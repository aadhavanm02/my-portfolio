// Cloudflare Worker that lets the Playground apps call Gemini without exposing the API key.
// The key lives in the Worker as a secret (GEMINI_API_KEY); the browser never sees it.
// Requests are only accepted from the portfolio's own pages, and replies are kept short.
//
// POST { prompt, system?, json?, image?: { mime, data(base64) }, readUrl?: boolean, maxTokens? }
//   -> { text, model }

const ALLOWED_ORIGINS = ["https://aadhavanm02.github.io", "http://localhost:5173"];
// Tried in order; Gemini sometimes reports a model as busy, so the next one takes over.
const MODELS = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-flash-lite-latest"];
const MAX_PROMPT_CHARS = 12000;
const MAX_IMAGE_BYTES = 1_500_000;

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors(origin) } });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (!ALLOWED_ORIGINS.includes(origin)) return new Response("Not allowed", { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== "POST") return json({ error: "Use POST" }, 405, origin);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Send JSON" }, 400, origin);
    }

    const prompt = String(body.prompt || "").slice(0, MAX_PROMPT_CHARS);
    const system = String(body.system || "").slice(0, 4000);
    if (!prompt) return json({ error: "Missing prompt" }, 400, origin);

    const parts = [{ text: prompt }];
    if (body.image && typeof body.image.data === "string") {
      const mime = /^image\/(jpeg|png|webp)$/.test(body.image.mime) ? body.image.mime : "image/jpeg";
      if (body.image.data.length * 0.75 > MAX_IMAGE_BYTES) return json({ error: "Photo is too large" }, 413, origin);
      parts.unshift({ inline_data: { mime_type: mime, data: body.image.data } });
    }

    // Reading a link uses Gemini's URL context tool, which can't be combined with JSON mode.
    const readUrl = Boolean(body.readUrl);
    const payload = {
      contents: [{ role: "user", parts }],
      generationConfig: {
        maxOutputTokens: Math.min(Number(body.maxTokens) || 1200, 2500),
        temperature: 0.4,
        responseMimeType: body.json && !readUrl ? "application/json" : "text/plain",
        thinkingConfig: { thinkingBudget: 0 },
      },
    };
    if (system) payload.systemInstruction = { parts: [{ text: system }] };
    if (readUrl) payload.tools = [{ url_context: {} }];

    const tried = [];
    for (const model of MODELS) {
      let res = await callGemini(model, payload, env);
      // Some models reject the thinking setting; retry once without it.
      if (res.status === 400) {
        const copy = structuredClone(payload);
        delete copy.generationConfig.thinkingConfig;
        res = await callGemini(model, copy, env);
      }
      if (res.status === 503 || res.status === 404 || res.status === 429 || res.status === 500) {
        tried.push(`${model}:${res.status}`);
        continue;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return json({ error: data?.error?.message || "AI request failed" }, 502, origin);
      const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
      return json({ text, model }, 200, origin);
    }
    return json({ error: "The AI is busy right now. Please try again in a minute.", tried }, 503, origin);
  },
};

function callGemini(model, payload, env) {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify(payload),
  });
}
