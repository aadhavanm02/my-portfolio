// Quanvas AI bridge. The app calls these helpers; they ask Gemini through the portfolio's
// Cloudflare Worker (the API key stays there). If a call fails, the app falls back to its
// built-in answers, so nothing breaks when the AI is busy.
(function () {
  const ENDPOINT = "https://portfolio-gemini-proxy.aadhavanm8.workers.dev";
  const SYSTEM =
    "You are the assistant inside Quanvas, a notes app for Indian home cooks and shoppers. " +
    "Be accurate, short and practical. Prefer Indian names and units (kg, g, litre, cups, tsp, rupees) where natural. " +
    "Plain sentences, no markdown, no emoji. If something is unsafe, illegal or not food or household related, still answer briefly and honestly.";

  async function ask(opts) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: SYSTEM, ...opts }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.text) throw new Error(data.error || "AI request failed");
    return data.text;
  }

  function parseJSON(text) {
    const m = text.match(/\{[\s\S]*\}/);
    return JSON.parse(m ? m[0] : text);
  }

  async function askJSON(prompt, extra) {
    return parseJSON(await ask({ prompt, json: true, ...extra }));
  }

  // AI recipes live in this browser so saved recipe cards still open after a reload.
  const STORE = "quanvas-ai-recipes";
  function loadRecipes() {
    try {
      return JSON.parse(localStorage.getItem(STORE) || "{}");
    } catch {
      return {};
    }
  }
  function saveRecipe(key, recipe) {
    try {
      const all = loadRecipes();
      all[key] = recipe;
      localStorage.setItem(STORE, JSON.stringify(all));
    } catch {}
  }

  const KINDS = ["veg", "leaf", "powder", "paste", "seed", "pod", "dal_l", "dal_s", "rice", "onion", "tomato", "bottle", "jar", "bowl", "flake"];

  async function recipe(query, knownItems) {
    const r = await askJSON(
      `Write a reliable home recipe for: "${query}".\n` +
        `Return JSON: {"name":string,"time":"About N min","effort":"Easy"|"Medium effort"|"Takes effort","serves":number,` +
        `"ingredients":[{"name":string,"qty":number (0 if to taste),"unit":string,"note"?:string,"item"?:one of ${JSON.stringify(knownItems)} only if it is exactly that,"kind":one of ${JSON.stringify(KINDS)}}],` +
        `"steps":[{"title":short imperative,"add":what goes in with amounts,"time":seconds as number,"heat":0 off,1 low,2 medium,3 high,"cue":how to tell it is done}]}\n` +
        `5 to 12 ingredients, 4 to 8 steps. If it is not a dish, return {"name":""}.`,
      { maxTokens: 2000 }
    );
    if (!r || !r.name || !Array.isArray(r.ingredients) || !Array.isArray(r.steps) || !r.steps.length) return null;
    const known = new Set(knownItems);
    const recipe = {
      name: String(r.name),
      time: String(r.time || "About 30 min"),
      effort: String(r.effort || "Easy"),
      serves: Math.max(1, Number(r.serves) || 2),
      ingredients: r.ingredients.slice(0, 16).map((i) => {
        const out = { name: String(i.name || "Ingredient"), qty: Number(i.qty) || 0, unit: String(i.unit || (Number(i.qty) ? "" : "to taste")) };
        if (i.note) out.note = String(i.note);
        if (i.item && known.has(i.item)) out.item = i.item;
        else {
          out.kind = KINDS.includes(i.kind) ? i.kind : "veg";
          out.bg = "#F1F2F5";
        }
        return out;
      }),
      steps: r.steps.slice(0, 10).map((s) => ({
        title: String(s.title || "Next step"),
        add: String(s.add || ""),
        time: Math.max(0, Math.round(Number(s.time) || 0)),
        heat: Math.min(3, Math.max(0, Math.round(Number(s.heat) || 0))),
        cue: String(s.cue || ""),
        look: null,
      })),
      ai: true,
    };
    const key = "ai:" + recipe.name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    saveRecipe(key, recipe);
    return { key, recipe };
  }

  async function answer(query) {
    const r = await askJSON(
      `Answer this for someone writing notes: "${query}".\n` +
        `Return JSON: {"title":short title,"text":2 to 4 sentence answer,"differ"?:one sentence if sources commonly disagree,"health"?:true if it is a health or diet question}`
    );
    if (!r || !r.text) return null;
    return { title: String(r.title || query), text: String(r.text), differ: r.differ ? String(r.differ) : undefined, health: Boolean(r.health) };
  }

  // A photo for an item, from the Wikipedia article Gemini picked (free to use, credited in the app).
  async function wikiPhoto(title) {
    if (!title) return null;
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`);
      if (!res.ok) return null;
      const d = await res.json();
      if (d.type === "disambiguation") return null;
      const src = (d.thumbnail && d.thumbnail.source) || (d.originalimage && d.originalimage.source);
      return src ? { img: src, page: d.content_urls && d.content_urls.mobile && d.content_urls.mobile.page } : null;
    } catch {
      return null;
    }
  }

  async function item(name) {
    const r = await askJSON(
      `Someone wrote "${name}" in a shopping or notes list. Explain what it is.\n` +
        `Return JSON: {"name":clean common name,"aka":other names in India (Tamil, Hindi, English) comma separated or "",` +
        `"desc":one short sentence for a card,"long":3 sentences: what it is, how it looks or tastes, how it is used,` +
        `"uses":up to 3 short dishes or uses,"tip":one short buying or storing tip,` +
        `"wiki":exact English Wikipedia article title for it}`
    );
    if (!r || !r.desc) return null;
    const clean = String(r.name || name);
    const photo = await wikiPhoto(r.wiki || clean);
    return {
      name: clean,
      aka: r.aka ? String(r.aka) : "",
      desc: String(r.desc),
      long: [r.long || r.desc, r.tip ? `Tip: ${r.tip}` : ""].filter(Boolean).join(" "),
      uses: Array.isArray(r.uses) ? r.uses.slice(0, 3).map(String) : [],
      letter: clean[0] || "?",
      ai: true,
      img: photo ? photo.img : "",
      imgPage: photo ? photo.page : "",
    };
  }

  async function photo(dataUrl, knownItems) {
    const [head, data] = String(dataUrl).split(",");
    const mime = (head.match(/data:([^;]+)/) || [])[1] || "image/jpeg";
    const r = await askJSON(
      `What food item, ingredient or kitchen product is in this photo?\n` +
        `Return JSON: {"name":common English name,"aka":Indian names (Tamil, Hindi) comma separated or "",` +
        `"desc":one or two sentences,"confidence":"Very likely"|"Probably","note"?:short note if unsure or what it could be confused with,` +
        `"item"?:one of ${JSON.stringify(knownItems)} if it is exactly that}`,
      { image: { mime, data } }
    );
    if (!r || !r.name) return null;
    return r;
  }

  async function fileSummary(name, text) {
    const r = await askJSON(
      `Summarise this file called "${name}" for a notes app.\n` +
        `Return JSON: {"summary":2 sentences,"figures"?:[[label,value]] up to 3 key numbers or dates found,"points":up to 3 short things worth checking}\n\nFILE:\n${text.slice(0, 9000)}`
    );
    if (!r || !r.summary) return null;
    return {
      summary: String(r.summary),
      figures: Array.isArray(r.figures) && r.figures.length ? r.figures.slice(0, 3).map((f) => [String(f[0]), String(f[1])]) : undefined,
      points: Array.isArray(r.points) ? r.points.slice(0, 3).map(String) : [],
      sample: false,
    };
  }

  async function fileQA(block, question) {
    try {
      const context = block.text
        ? `FILE "${block.name}":\n${String(block.text).slice(0, 9000)}`
        : `Only the file name is known: "${block.name}". Say you can only see the name if the answer needs the contents.`;
      return (await ask({ prompt: `${context}\n\nQuestion: ${question}\nAnswer in one to three sentences.`, maxTokens: 400 })).trim();
    } catch {
      return "Couldn't reach the AI just now. Try again in a minute.";
    }
  }

  async function link(url) {
    const text = await ask({
      prompt:
        `Open ${url} and explain what it is about in exactly 3 short lines for a notes app. ` +
        `If it is a video and you know timestamps, start a line with the timestamp like "3:15 | ". Otherwise start each line with "- ". ` +
        `On a 4th line write "RECIPE: <dish name>" if the page is a recipe, otherwise "RECIPE: no".`,
      readUrl: true,
      maxTokens: 500,
    });
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const rm = text.match(/RECIPE:\s*(.+)/i);
    const dish = rm && !/^no\b/i.test(rm[1].trim()) ? rm[1].trim().replace(/[."]+$/g, "") : "";
    const points = lines
      .filter((l) => !/^RECIPE:/i.test(l))
      .slice(0, 3)
      .map((l) => {
        const t = l.match(/^(\d{1,2}:\d{2})\s*\|\s*(.+)$/);
        return t ? [t[1], t[2]] : [null, l.replace(/^[-*•]\s*/, "")];
      });
    if (!points.length) return null;
    return { points, recipe: Boolean(dish), dish };
  }

  window.QV_AI = { recipe, answer, item, photo, fileSummary, fileQA, link, loadRecipes };
})();
