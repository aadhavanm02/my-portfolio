// Strip: your medicines, the way they look in your hand.
// A phone app that turns a prescription into a plan, keeps a picture of every strip, and lets you
// pop a pocket to log a dose. Everything is saved in this browser. Reading a prescription or a
// strip from a photo, and the Ask tab, use Gemini through the portfolio's Cloudflare Worker.
(function () {
  const AI_URL = "https://portfolio-gemini-proxy.aadhavanm8.workers.dev";
  const KEY = "strip-app-v1";

  // ---------- Small helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const pad = (n) => String(n).padStart(2, "0");
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const nowHM = () => {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const mins = (hm) => {
    const [h, m] = hm.split(":").map(Number);
    return h * 60 + m;
  };
  const nowMins = () => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  };
  const fmt12 = (hm) => {
    let [h, m] = hm.split(":").map(Number);
    const ap = h < 12 ? "AM" : "PM";
    h = h % 12 || 12;
    return `${h}:${pad(m)} ${ap}`;
  };
  const fmtNum = (n) => (n % 1 ? `${Math.floor(n) || ""}½` : String(n));
  const monthName = (ym) => {
    if (!ym) return "";
    const [y, m] = ym.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  };
  const WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const svg = (d, s = 20, extra = "") =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
  const I = {
    back: svg('<path d="M15 6l-6 6 6 6"/>', 22),
    close: svg('<path d="M6 6l12 12M18 6L6 18"/>', 20),
    plus: svg('<path d="M12 5v14M5 12h14"/>', 18),
    check: svg('<path d="M5 12l4 4L19 6"/>', 16, 'stroke-width="3"'),
    today: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    box: svg('<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>'),
    care: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M12 10v6"/>'),
    ask: svg('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'),
    family: svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c2 .8 3.5 2.8 3.5 5.5"/>'),
    camera: svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>', 22),
    pill: svg('<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M12 8v8"/>'),
    rx: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', 18),
    send: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 20),
    info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>', 18),
    bell: svg('<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>', 18),
  };

  // ---------- Words (English, Tamil and Hindi for the words people see most) ----------
  const L = {
    en: { today: "Today", box: "Box", care: "Care", ask: "Ask", family: "Family", next: "Next", taken: "Taken", open: "Open", yourStrips: "Your strips", add: "Add", allDone: "All done for today", fullStrip: "Open full strip", left: "left" },
    ta: { today: "இன்று", box: "பெட்டி", care: "பராமரிப்பு", ask: "கேள்", family: "குடும்பம்", next: "அடுத்து", taken: "எடுத்தேன்", open: "திற", yourStrips: "உங்கள் ஸ்ட்ரிப்கள்", add: "சேர்", allDone: "இன்றைக்கு எல்லாம் முடிந்தது", fullStrip: "முழு ஸ்ட்ரிப்", left: "மீதம்" },
    hi: { today: "आज", box: "डिब्बा", care: "देखभाल", ask: "पूछें", family: "परिवार", next: "अगली", taken: "ले ली", open: "खोलें", yourStrips: "आपकी स्ट्रिप", add: "जोड़ें", allDone: "आज की सब दवाएँ हो गईं", fullStrip: "पूरी स्ट्रिप", left: "बाकी" },
  };
  const t = (k) => (L[S.lang] && L[S.lang][k]) || L.en[k];

  // ---------- Schedule ----------
  const SLOTS = [
    { id: "bb", label: "Before breakfast", time: "07:00" },
    { id: "ab", label: "After breakfast", time: "09:00" },
    { id: "al", label: "After lunch", time: "14:00" },
    { id: "ad", label: "After dinner", time: "21:00" },
  ];
  const slot = (id) => SLOTS.find((s) => s.id === id);
  const COLORS = ["#e8573f", "#2e57c9", "#f2efe8", "#e9a23b", "#3f8f6b", "#8a5cc9", "#d94f7a"];

  // ---------- Sample data ----------
  const SAMPLE_RX = {
    clinic: "Sunrise Clinic",
    doctor: "Dr. Priya Raman",
    date: dayKey(new Date(Date.now() - 2 * 864e5)),
    days: 30,
    meds: [
      { name: "Metformin", strength: "500 mg", form: "tablet", doses: { ab: 1, ad: 1 }, note: "After food", weekly: null },
      { name: "Amlodipine", strength: "5 mg", form: "tablet", doses: { ad: 0.5 }, note: "Half a tablet after dinner", weekly: null },
      { name: "Vitamin D3", strength: "60K", form: "capsule", doses: { ab: 1 }, note: "Once a week", weekly: "ask" },
      { name: "Thyroxine", strength: "50 mcg", form: "bottle", doses: { bb: 1 }, note: "Empty stomach, before breakfast", weekly: null },
    ],
  };

  // ---------- State ----------
  function fresh() {
    return { v: 1, lang: "en", big: false, onboarded: false, rx: null, plan: [], meds: [], logs: [], chat: [], seenFinished: {}, family: [] };
  }
  let S = load();
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.v === 1) return s;
    } catch {}
    return fresh();
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch {}
  }
  function applyPrefs() {
    document.documentElement.classList.toggle("big", !!S.big);
    document.documentElement.lang = S.lang === "ta" ? "ta" : S.lang === "hi" ? "hi" : "en";
  }

  // ---------- AI ----------
  async function ask(prompt, extra = {}) {
    if (!navigator.onLine) throw new Error("You're offline. Connect to the internet and try again.");
    const res = await fetch(AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, ...extra }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.text) throw new Error(data.error || "Couldn't reach the assistant. Try again in a minute.");
    return data.text;
  }
  async function askJSON(prompt, extra) {
    const text = await ask(prompt, { json: true, maxTokens: 1500, ...extra });
    const m = text.match(/\{[\s\S]*\}/);
    return JSON.parse(m ? m[0] : text);
  }
  function imagePart(dataUrl) {
    const [head, data] = dataUrl.split(",");
    return { mime: (head.match(/data:([^;]+)/) || [])[1] || "image/jpeg", data };
  }
  function shrink(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        const img = new Image();
        img.onload = () => {
          const k = Math.min(1, 1400 / Math.max(img.width, img.height));
          const c = document.createElement("canvas");
          c.width = img.width * k;
          c.height = img.height * k;
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = reject;
        img.src = r.result;
      };
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  // ---------- Medicine helpers ----------
  const totalDaily = (m) => Object.values(m.doses || {}).reduce((a, b) => a + b, 0) / (typeof m.weekly === "number" ? 7 : 1);
  function remaining(m) {
    if (m.kind === "bottle") return m.bottle.left;
    return m.stack.reduce((n, s) => n + s.pockets.reduce((a, b) => a + b, 0), 0);
  }
  function daysLeft(m) {
    const d = totalDaily(m);
    if (!d || m.asNeeded) return null;
    const units = m.kind === "bottle" ? m.bottle.left / (m.bottle.dose || 1) : remaining(m);
    return Math.floor(units / d);
  }
  const low = (m) => {
    const d = daysLeft(m);
    return d != null && d <= 5;
  };
  function dueOn(m, date) {
    if (m.asNeeded) return [];
    if (typeof m.weekly === "number" && date.getDay() !== m.weekly) return [];
    return SLOTS.filter((s) => (m.doses || {})[s.id] > 0).map((s) => s.id);
  }
  const logFor = (medId, slotId, date = dayKey()) => S.logs.find((l) => l.medId === medId && l.slot === slotId && l.date === date);
  function slotsToday() {
    const d = new Date();
    return SLOTS.map((s) => {
      const meds = S.meds.filter((m) => dueOn(m, d).includes(s.id));
      const done = meds.filter((m) => logFor(m.id, s.id));
      return { ...s, meds, done, complete: meds.length > 0 && done.length === meds.length };
    }).filter((s) => s.meds.length);
  }
  // The next slot to act on: something overdue that wasn't logged, else the next one coming up.
  function nextSlot() {
    const list = slotsToday().filter((s) => !s.complete);
    if (!list.length) return null;
    const now = nowMins();
    const overdue = list.find((s) => now - mins(s.time) > 120);
    if (overdue) return { ...overdue, overdue: true };
    return list.find((s) => mins(s.time) >= now - 120) || list[list.length - 1];
  }
  const topStrip = (m) => m.stack.find((s) => s.pockets.some((p) => p > 0));

  // Take a dose out of the strip or bottle. A half dose leaves the other half in its pocket.
  function consume(m, qty) {
    if (m.kind === "bottle") {
      m.bottle.left = Math.max(0, +(m.bottle.left - (m.bottle.dose || 1) * qty).toFixed(2));
      return [];
    }
    const changed = [];
    let need = qty;
    while (need > 0) {
      const strip = topStrip(m);
      if (!strip) break;
      const iHalf = strip.pockets.findIndex((p) => p === 0.5);
      const i = need === 0.5 && iHalf >= 0 ? iHalf : iHalf >= 0 ? iHalf : strip.pockets.findIndex((p) => p > 0);
      const take = Math.min(need, strip.pockets[i]);
      strip.pockets[i] = +(strip.pockets[i] - take).toFixed(2);
      changed.push(i);
      need = +(need - take).toFixed(2);
    }
    return changed;
  }
  function logDose(m, slotId, qty, at = nowHM(), date = dayKey()) {
    const snapshot = clone(m);
    consume(m, qty);
    const entry = { id: uid(), medId: m.id, slot: slotId, date, at, qty, due: slotId ? slot(slotId).time : null };
    S.logs.push(entry);
    return { entry, snapshot };
  }
  function undoDoses(items) {
    items.forEach(({ entry, snapshot }) => {
      S.logs = S.logs.filter((l) => l.id !== entry.id);
      const i = S.meds.findIndex((x) => x.id === snapshot.id);
      if (i >= 0) S.meds[i] = snapshot;
    });
    save();
    render();
  }
  function newStrip(per, exp, usedCount = 0) {
    const pockets = Array(per).fill(1);
    for (let i = 0; i < usedCount && i < per; i++) pockets[i] = 0;
    return { id: uid(), pockets, exp: exp || "", batch: "" };
  }
  function expYM(monthsAhead) {
    const d = new Date();
    d.setMonth(d.getMonth() + monthsAhead);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  }
  function makeMed(p, opts = {}) {
    const kind = p.form === "bottle" || p.form === "syrup" ? "bottle" : "strip";
    const m = {
      id: uid(),
      name: p.name,
      strength: p.strength || "",
      kind,
      shape: p.form === "capsule" ? "cap" : "round",
      color: p.color || COLORS[S.meds.length % COLORS.length],
      color2: "#f6f3ec",
      perStrip: opts.perStrip || (p.form === "capsule" && p.weekly != null ? 4 : 10),
      stack: [],
      doses: clone(p.doses || {}),
      weekly: typeof p.weekly === "number" ? p.weekly : null,
      asNeeded: !!p.asNeeded,
      note: p.note || "",
      from: opts.from || "rx",
      where: p.where || "",
    };
    if (kind === "bottle") {
      const isSyrup = p.form === "syrup";
      m.bottle = isSyrup ? { total: 100, left: 100, unit: "ml", dose: p.dose || 5 } : { total: 30, left: 30, unit: "tablets", dose: 1 };
      m.exp = p.exp || expYM(14);
    } else {
      const n = opts.strips ?? 1;
      for (let i = 0; i < n; i++) m.stack.push(newStrip(m.perStrip, p.exp || expYM(12 + i * 2), i === 0 ? opts.used || 0 : 0));
    }
    return m;
  }

  // ---------- Pictures of strips ----------
  function stripHTML(m, opts = {}) {
    const s = opts.strip || topStrip(m) || m.stack[m.stack.length - 1];
    if (!s) return "";
    const cols = s.pockets.length <= 4 ? 4 : s.pockets.length <= 10 ? 5 : s.pockets.length <= 14 ? 7 : 5;
    const pk = (v, i) => {
      const cls = ["pk", m.shape === "cap" ? "cap" : "", v === 0 ? "empty" : v < 1 ? "half" : "", opts.popped && opts.popped.includes(i) ? "pop" : ""].join(" ");
      const label = v === 0 ? "empty pocket" : v < 1 ? "half a tablet" : "full pocket";
      const act = opts.tap ? ` data-act="pocket" data-med="${m.id}" data-i="${i}"` : "";
      return `<button class="${cls}" style="--c:${m.color};--c2:${m.color2}"${act} aria-label="${esc(m.name)}, pocket ${i + 1}, ${label}" ${opts.tap ? "" : 'tabindex="-1"'}><i></i></button>`;
    };
    return `<div class="strip" style="--cols:${cols}">${s.pockets.map(pk).join("")}</div>
      ${opts.meta ? `<div class="strip-meta"><span>Strip ${m.stack.indexOf(s) + 1} of ${m.stack.length}</span><span>${s.exp ? "Exp " + monthName(s.exp) : ""}</span></div>` : ""}`;
  }
  function miniStrip(m) {
    if (m.kind === "bottle") return `<div class="mini-bottle" aria-hidden="true"><span></span><b><i style="width:${Math.round((m.bottle.left / m.bottle.total) * 100)}%"></i></b></div>`;
    const s = topStrip(m) || m.stack[0];
    if (!s) return "";
    return `<div class="mini-strip">${s.pockets.slice(0, 4).map((v) => `<span class="pk ${m.shape === "cap" ? "cap" : ""} ${v === 0 ? "empty" : v < 1 ? "half" : ""}" style="--c:${m.color}"><i></i></span>`).join("")}</div>`;
  }
  function bottleHTML(m) {
    const lvl = Math.round((m.bottle.left / m.bottle.total) * 100);
    return `<div class="bottle" style="--lvl:${lvl}%"><b><i></i></b><span>${esc(m.name.split(" ")[0]).toUpperCase()}</span></div>`;
  }
  const pillDots = (meds) => `<span class="pills">${meds.map((m) => `<span class="pill-dot ${m.shape === "cap" ? "" : "round"}" style="--c:${m.color}"></span>`).join("")}</span>`;
  const leftText = (m) => (m.kind === "bottle" ? `${fmtNum(m.bottle.left)} ${m.bottle.unit} ${t("left")}` : `${fmtNum(remaining(m))} of ${m.stack.length * m.perStrip} ${t("left")}`);

  // ---------- Layout ----------
  let tab = "today";
  function nav() {
    const lowAny = S.meds.some(low);
    const b = (k, ic) => `<button class="${tab === k ? "on" : ""}" data-act="tab" data-k="${k}" ${tab === k ? 'aria-current="page"' : ""}>${ic}${t(k)}${k === "family" && lowAny ? '<span class="dot"></span>' : ""}</button>`;
    return `<nav class="bottom-nav" aria-label="Main">${b("today", I.today)}${b("box", I.box)}${b("care", I.care)}${b("ask", I.ask)}${b("family", I.family)}</nav>`;
  }
  const screen = (body, foot = "", withNav = false, cls = "") =>
    `<main class="main ${cls}" id="main"><div class="page">${body}</div></main>${foot ? `<div class="foot ${cls}">${foot}</div>` : ""}${withNav ? nav() : ""}`;
  const head = (title, back = "home", right = "") => `<div class="top"><button class="icon-btn" data-act="go" data-to="${back}" aria-label="Back">${I.back}</button><h1>${esc(title)}</h1>${right}</div>`;

  let toastTimer;
  function toast(msg, undo) {
    document.querySelectorAll(".toast").forEach((x) => x.remove());
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.innerHTML = `<span>${esc(msg)}</span>${undo ? '<button type="button">Undo</button>' : ""}`;
    if (undo) el.querySelector("button").onclick = () => {
      el.remove();
      undo();
    };
    document.body.appendChild(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.remove(), 4200);
  }
  function sheet(html, label) {
    closeSheet();
    const s = document.createElement("div");
    s.className = "scrim";
    s.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(label)}"><span class="sheet__grab"></span>${html}</div>`;
    s.addEventListener("click", (e) => e.target === s && closeSheet());
    document.body.appendChild(s);
  }
  const closeSheet = () => document.querySelectorAll(".scrim").forEach((x) => x.remove());

  // ---------- Router ----------
  // Screens: welcome, rxCam, rxRead, plan, setup, stripCam, confirm, home (tabs), dose, strip, finished, bottle, addMed, refill, homeStart
  let view = { name: S.onboarded ? "home" : "welcome" };
  function go(name, extra = {}) {
    view = { name, ...extra };
    closeSheet();
    render();
    const m = $("#main");
    if (m) m.scrollTop = 0;
  }

  // ---------- Welcome and setup ----------
  function vWelcome() {
    const lang = (k, l) => `<button aria-pressed="${S.lang === k}" data-act="lang" data-k="${k}" ${k !== "en" ? `lang="${k}"` : ""}>${l}</button>`;
    const demo = { id: "demo", name: "Metformin", color: "#e8573f", shape: "round", color2: "#f6f3ec", stack: [{ pockets: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1] }] };
    return screen(
      `<div class="lang">${lang("en", "English")}${lang("ta", "தமிழ்")}${lang("hi", "हिंदी")}<button aria-pressed="${!!S.big}" data-act="big" aria-label="Larger text">Aa+</button></div>
       <div style="padding:22px 30px 8px;transform:rotate(-6deg)">${stripHTML(demo)}</div>
       <h1 style="font-size:calc(34px * var(--fs));line-height:1.1">Your medicines, the way they look in your hand</h1>
       <p class="note" style="font-size:calc(15px * var(--fs))">Start with the prescription from your doctor. We turn it into a plan, then you add each strip.</p>`,
      `<button class="btn btn--dark btn--block" data-act="go" data-to="rxCam">${I.camera}Scan my prescription</button>
       <button class="btn btn--block" data-act="go" data-to="homeStart">No doctor visit? Start from home</button>`
    );
  }

  let rxBusy = "";
  function vRxCam() {
    return screen(
      `${head("Show your prescription", "welcome")}
       <p class="note">Lay the paper flat in good light. Gemini reads the medicines, doses and timings. Check them on the next screen.</p>
       <label class="cam" style="cursor:pointer">${rxBusy ? `<div class="empty"><div class="spinner"></div><b style="color:#fff">${esc(rxBusy)}</b><span>Usually about 10 seconds</span></div>` : `<div class="empty">${I.camera}<b style="color:#fff">Take a photo or choose one</b><span style="font-size:13px">Tap here</span></div>`}<span class="cam__frame"></span>
       <input type="file" accept="image/*" capture="environment" class="sr" data-file="rx" ${rxBusy ? "disabled" : ""}></label>`,
      `<button class="btn btn--block" data-act="sampleRx" ${rxBusy ? "disabled" : ""}>Use a sample prescription</button>
       <p class="note" style="text-align:center">Your photo is only sent to the AI to read it. It isn't saved.</p>`,
      false,
      "dark-page"
    );
  }
  async function readRx(file) {
    rxBusy = "Reading your prescription…";
    render();
    try {
      const img = await shrink(file);
      const r = await askJSON(
        "Read this doctor's prescription photo. Return JSON: " +
          '{"clinic":string,"doctor":string,"days":number (course length, 30 if not written),"meds":[{"name":string,"strength":string,"form":"tablet"|"capsule"|"syrup"|"bottle","morning":number,"noon":number,"night":number,"food":"before"|"after"|"","weekly":true|false,"note":short instruction}]}. ' +
          "Doses like 1-0-1 mean morning-noon-night; ½ is 0.5. If the photo is not a prescription or can't be read, return {\"meds\":[]}.",
        { image: imagePart(img) }
      );
      const meds = (r.meds || []).filter((x) => x && x.name).slice(0, 8).map((x) => {
        const doses = {};
        if (+x.morning) doses[x.food === "before" ? "bb" : "ab"] = +x.morning;
        if (+x.noon) doses.al = +x.noon;
        if (+x.night) doses.ad = +x.night;
        if (!Object.keys(doses).length) doses.ab = 1;
        return { name: String(x.name), strength: String(x.strength || ""), form: ["tablet", "capsule", "syrup", "bottle"].includes(x.form) ? x.form : "tablet", doses, note: String(x.note || ""), weekly: x.weekly ? "ask" : null };
      });
      if (!meds.length) throw new Error("Couldn't find medicines in that photo. Try again in better light, or use the sample.");
      S.rx = { clinic: r.clinic || "", doctor: r.doctor || "", date: dayKey(), days: +r.days || 30 };
      S.plan = meds;
      save();
      rxBusy = "";
      go("plan");
    } catch (e) {
      rxBusy = "";
      render();
      toast(e.message || "Couldn't read that photo.");
    }
  }

  function vPlan() {
    const row = (p, i) => {
      const when = Object.entries(p.doses).map(([k, v]) => `${fmtNum(v)} ${p.form === "capsule" ? "cap" : "tab"} ${slot(k).label.toLowerCase()}`).join(" · ");
      const needsDay = p.weekly === "ask";
      return `<div class="row" style="padding:12px 0;border-bottom:1px solid var(--line2)"><span class="check ${needsDay ? "todo" : ""}">${needsDay ? "" : I.check}</span>
        <div class="grow"><b style="color:var(--ink)">${esc(p.name)} ${esc(p.strength)}</b><div class="note">${needsDay ? "Which day of the week?" : esc(when)}${p.note && !needsDay ? " · " + esc(p.note) : ""}</div></div>
        ${needsDay || typeof p.weekly === "number" ? `<select class="input" style="width:auto;min-height:40px" data-week="${i}" aria-label="Day for ${esc(p.name)}">${needsDay ? "<option value=''>Pick day</option>" : ""}${WEEK.map((d, k) => `<option value="${k}" ${p.weekly === k ? "selected" : ""}>${d.slice(0, 3)}</option>`).join("")}</select>` : ""}</div>`;
    };
    const ready = S.plan.every((p) => p.weekly !== "ask");
    return screen(
      `${head("We read your prescription", "rxCam")}
       ${S.rx ? `<div class="card pad"><div class="row"><b class="grow" style="color:var(--ink)">${esc(S.rx.clinic || "Prescription")}${S.rx.doctor ? " · " + esc(S.rx.doctor) : ""}</b><span class="note">${esc(S.rx.days)} days</span></div></div>` : ""}
       <span class="label">Your plan</span><div class="card" style="padding:0 16px">${S.plan.map(row).join("")}</div>
       <div class="info">${I.info}<span>Handwriting can be misread. If anything looks off, check with the clinic before you start.</span></div>`,
      `<button class="btn btn--dark btn--block" data-act="savePlan" ${ready ? "" : "disabled"}>Save plan</button>`
    );
  }

  // Add each medicine's strips after the plan is saved.
  function vSetup() {
    const added = S.plan.filter((p) => S.meds.some((m) => m.planName === p.name));
    const pct = S.plan.length ? Math.round((added.length / S.plan.length) * 100) : 0;
    const row = (p, i) => {
      const m = S.meds.find((x) => x.planName === p.name);
      return `<div class="row" style="padding:12px 0;border-bottom:1px solid var(--line2)"><span class="check ${m ? "" : "todo"}">${m ? I.check : ""}</span>
        <div class="grow"><b style="color:var(--ink)">${esc(p.name)} ${esc(p.strength)}</b><div class="note">${m ? (m.kind === "bottle" ? "Bottle added" : `${m.stack.length} strip${m.stack.length > 1 ? "s" : ""} of ${m.perStrip}`) : p.form === "bottle" || p.form === "syrup" ? "Bottle · not added yet" : "Not added yet"}</div></div>
        ${m ? "" : `<button class="btn btn--sm" data-act="addFromPlan" data-i="${i}">${p.form === "bottle" || p.form === "syrup" ? "Add bottle" : "Add strip"}</button>`}</div>`;
    };
    const done = added.length === S.plan.length && S.plan.length;
    return screen(
      `<div class="top"><h1>${done ? "All set" : `${added.length} of ${S.plan.length} added`}</h1></div>
       <p class="note">Add what you bought. Scan the silver back of a strip, or add it straight from your plan.</p>
       <div class="progress" aria-hidden="true"><i style="width:${pct}%"></i></div>
       <div class="card" style="padding:0 16px">${S.plan.map(row).join("")}</div>`,
      done
        ? `<button class="btn btn--dark btn--block" data-act="finishSetup">Go to Today</button>`
        : `<button class="btn btn--dark btn--block" data-act="go" data-to="stripCam">${I.camera}Scan a strip</button><button class="link" data-act="finishSetup">Skip for now</button>`
    );
  }

  let stripBusy = "";
  function vStripCam() {
    return screen(
      `${head("Show the back of the strip", S.onboarded ? "home" : "setup")}
       <p class="note">The silver side with the printing. Gemini reads the name, expiry and how many pockets it has.</p>
       <label class="cam" style="cursor:pointer">${stripBusy ? `<div class="empty"><div class="spinner"></div><b style="color:#fff">${esc(stripBusy)}</b></div>` : `<div class="empty">${I.camera}<b style="color:#fff">Take a photo of the strip</b><span style="font-size:13px">Tap here</span></div>`}<span class="cam__frame"></span>
       <input type="file" accept="image/*" capture="environment" class="sr" data-file="strip" ${stripBusy ? "disabled" : ""}></label>`,
      `<button class="btn btn--block" data-act="go" data-to="addMed">Type it in instead</button>`,
      false,
      "dark-page"
    );
  }
  async function readStrip(file) {
    stripBusy = "Reading the strip…";
    render();
    try {
      const img = await shrink(file);
      const r = await askJSON(
        'This is the back of a medicine blister strip, or a bottle label. Return JSON {"name":string,"strength":string,"form":"tablet"|"capsule"|"bottle"|"syrup","pockets":number (pockets in one strip, 10 if unsure),"expiry":"YYYY-MM" or "","batch":string}. If it is not medicine, return {"name":""}.',
        { image: imagePart(img) }
      );
      if (!r.name) throw new Error("Couldn't read a medicine name. Try again with the printed side facing up, or type it in.");
      const match = S.plan.find((p) => p.name.toLowerCase().includes(String(r.name).toLowerCase().split(" ")[0]) || String(r.name).toLowerCase().includes(p.name.toLowerCase()));
      stripBusy = "";
      go("confirm", {
        draft: {
          name: match ? match.name : String(r.name),
          strength: String(r.strength || (match && match.strength) || ""),
          form: r.form || (match && match.form) || "tablet",
          perStrip: Math.max(4, Math.min(30, +r.pockets || 10)),
          exp: /^\d{4}-\d{2}$/.test(r.expiry || "") ? r.expiry : expYM(12),
          doses: match ? clone(match.doses) : { ab: 1 },
          weekly: match ? match.weekly : null,
          note: match ? match.note : "",
          planName: match ? match.name : null,
          used: 0,
          strips: 1,
        },
      });
    } catch (e) {
      stripBusy = "";
      render();
      toast(e.message || "Couldn't read that photo.");
    }
  }

  // Confirm a strip: when you take it, how many strips, and any pockets already used.
  function vConfirm() {
    const d = view.draft;
    if (!d) return vHome();
    const isBottle = d.form === "bottle" || d.form === "syrup";
    const demo = { id: "draft", name: d.name, color: COLORS[S.meds.length % COLORS.length], color2: "#f6f3ec", shape: d.form === "capsule" ? "cap" : "round", stack: [newStrip(d.perStrip, d.exp, d.used)] };
    const timeBtn = (s) => `<button class="opt" aria-pressed="${!!d.doses[s.id]}" data-act="dTime" data-k="${s.id}">${s.label}</button>`;
    return screen(
      `${head("Is this right?", S.onboarded ? "home" : "setup")}
       <div><h2 style="font-size:calc(28px * var(--fs))">${esc(d.name)} ${esc(d.strength)}</h2><p class="note">${isBottle ? "Bottle" : `Strip of ${d.perStrip}`}${d.exp ? " · expires " + monthName(d.exp) : ""}</p></div>
       ${isBottle ? "" : `<div>${stripHTML(demo, {})}</div>`}
       <div class="row"><span class="label grow">When do you take it?</span>${d.planName ? '<span class="chip chip--green">From your prescription</span>' : ""}</div>
       <div class="toggle-grid">${SLOTS.map(timeBtn).join("")}</div>
       ${Object.values(d.doses).some((v) => v === 0.5) ? '<div class="info info--blue">' + I.info + "<span>Half a tablet each time. The other half goes back in its pocket and is used next.</span></div>" : ""}
       ${isBottle ? "" : `<div class="row"><span class="grow">Strips bought</span><button class="icon-btn" data-act="dStrips" data-n="-1" aria-label="One less strip">−</button><b style="min-width:24px;text-align:center">${d.strips}</b><button class="icon-btn" data-act="dStrips" data-n="1" aria-label="One more strip">+</button></div>
       <div class="row"><span class="grow">Tablets already used from this strip</span><button class="icon-btn" data-act="dUsed" data-n="-1" aria-label="One less">−</button><b style="min-width:24px;text-align:center">${d.used}</b><button class="icon-btn" data-act="dUsed" data-n="1" aria-label="One more">+</button></div>`}`,
      `<button class="btn btn--dark btn--block" data-act="addDraft" ${Object.keys(d.doses).length || d.asNeeded ? "" : "disabled"}>Yes, add it</button>`
    );
  }

  function vHomeStart() {
    const c = (to, ic, b, s) => `<button class="choice" data-act="go" data-to="${to}"><span class="choice__ic">${ic}</span><span class="grow"><b>${b}</b><span>${s}</span></span></button>`;
    return screen(
      `${head("Where do you want to start?", "welcome")}
       <p class="note">No doctor visit needed. Pick one, add the rest any time.</p>
       <div class="list">${c("stripCam", I.pill, "Medicines I already take", "Scan each strip, set your times")}${c("addMed", I.box, "What's in my medicine box", "Fever tablets, syrups, creams")}${c("rxCam", I.rx, "I just saw a doctor", "Scan today's prescription")}</div>
       <button class="link" data-act="sampleHome">Or try it with sample medicines</button>`
    );
  }

  // Type a medicine in (no camera).
  function vAddMed() {
    const d = view.draft || (view.draft = { name: "", strength: "", form: "tablet", perStrip: 10, doses: { ab: 1 }, asNeeded: false, exp: expYM(12), used: 0, strips: 1, where: "" });
    const formBtn = (k, l) => `<button class="opt" aria-pressed="${d.form === k}" data-act="mForm" data-k="${k}">${l}</button>`;
    return screen(
      `${head("Add a medicine", S.onboarded ? "home" : "homeStart")}
       <label class="field">Name<input class="input" data-m="name" value="${esc(d.name)}" placeholder="e.g. Paracetamol" autocomplete="off"></label>
       <label class="field">Strength<input class="input" data-m="strength" value="${esc(d.strength)}" placeholder="e.g. 650 mg"></label>
       <span class="label">What does it come in?</span><div class="toggle-grid">${formBtn("tablet", "Tablet strip")}${formBtn("capsule", "Capsule strip")}${formBtn("bottle", "Bottle of tablets")}${formBtn("syrup", "Syrup")}</div>
       <span class="label">How often?</span><div class="toggle-grid"><button class="opt" aria-pressed="${!d.asNeeded}" data-act="mNeed" data-v="0">On a schedule</button><button class="opt" aria-pressed="${d.asNeeded}" data-act="mNeed" data-v="1">Only when needed</button></div>
       ${d.asNeeded ? `<label class="field">Where is it kept?<input class="input" data-m="where" value="${esc(d.where)}" placeholder="e.g. Kitchen shelf, top box"></label>` : ""}`,
      `<button class="btn btn--dark btn--block" data-act="mNext" ${d.name.trim() ? "" : "disabled"}>${d.asNeeded ? "Add to medicine box" : "Next: set times"}</button>`
    );
  }

  // ---------- Home tabs ----------
  function vHome() {
    if (tab === "box") return vBox();
    if (tab === "care") return vCare();
    if (tab === "ask") return vAsk();
    if (tab === "family") return vFamily();
    return vToday();
  }

  function vToday() {
    const d = new Date();
    const nx = nextSlot();
    const daily = S.meds.filter((m) => !m.asNeeded);
    const main = daily.find((m) => m.kind === "strip" && topStrip(m)) || daily[0];
    const finished = S.meds.find((m) => m.kind === "strip" && m.stack.length && !topStrip(m) && !S.seenFinished[m.id]);
    let nextCard = "";
    if (nx && nx.overdue) {
      const missing = nx.meds.filter((m) => !logFor(m.id, nx.id));
      nextCard = `<div class="next" style="background:var(--amber-soft);border-color:#f1d391"><div class="next__head" style="color:var(--amber)"><span>Did you take it? · ${nx.label}, ${fmt12(nx.time)}</span></div>
        <div class="row">${pillDots(missing)}<b class="grow" style="color:var(--ink)">${esc(missing.map((m) => m.name).join(", "))}</b></div>
        <p class="note">Check your strip. If the pocket is still full, you haven't taken it. Never take two to catch up unless your doctor says so.</p>
        <div class="row"><button class="btn btn--dark grow" data-act="dose" data-slot="${nx.id}">Taking it now</button><button class="btn" data-act="earlier" data-slot="${nx.id}">Took it earlier</button></div>
        <button class="link" data-act="skip" data-slot="${nx.id}">Skip this dose</button></div>`;
    } else if (nx) {
      const missing = nx.meds.filter((m) => !logFor(m.id, nx.id));
      const qty = missing.reduce((a, m) => a + m.doses[nx.id], 0);
      nextCard = `<button class="next" data-act="dose" data-slot="${nx.id}" style="text-align:left"><div class="next__head"><span>${t("next")} · ${nx.label} · ${fmt12(nx.time)}</span><span class="chip" style="background:#fff">${fmtNum(qty)} ${qty > 1 ? "tablets" : "tablet"}</span></div>
        <div class="row">${pillDots(missing)}<b class="grow" style="color:var(--ink)">${esc(missing.map((m) => m.name).join(", "))}</b><b style="color:var(--ink)">${t("open")}</b></div></button>`;
    } else if (daily.length) {
      nextCard = `<div class="next" style="background:var(--green-soft);border-color:#bfe3cf"><div class="next__head" style="color:var(--green)"><span>${t("allDone")}</span><span>${I.check}</span></div><p class="note">Tomorrow starts ${fmt12(slotsTodayFirst())}.</p></div>`;
    }
    const others = daily.filter((m) => m !== main);
    const lowOnes = S.meds.filter(low);
    const body = `<div class="top"><div class="grow"><span class="note">${d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</span><h1 style="font-size:calc(28px * var(--fs))">${t("today")}</h1></div><button class="btn btn--dark btn--sm" data-act="addSheet">${I.plus}${t("add")}</button></div>
      ${finished ? `<button class="info info--green" data-act="go" data-to="finished" data-med="${finished.id}" style="border:0;text-align:left;width:100%">${I.check}<span><b>${esc(finished.name)} strip finished.</b> Tap to see how it went.</span></button>` : ""}
      ${nextCard}
      ${lowOnes.length ? `<button class="info" data-act="go" data-to="refill" style="border:0;text-align:left;width:100%">${I.bell}<span><b>${esc(lowOnes.map((m) => m.name).join(", "))}</b> ${lowOnes.length > 1 ? "are" : "is"} running low. Tap to arrange a refill.</span></button>` : ""}
      ${main ? `<div class="row"><span class="label grow">${t("yourStrips")}</span><span class="note">Back of the strip, as in your hand</span></div>
        <div class="card pad" style="display:flex;flex-direction:column;gap:12px"><div class="row"><b class="grow" style="color:var(--ink)">${esc(main.name)} ${esc(main.strength)}</b><span class="note">${leftText(main)}</span></div>
        ${main.kind === "bottle" ? bottleHTML(main) : stripHTML(main, { tap: true, popped: lastPopped })}
        <div class="row"><span class="note grow">${main.kind === "bottle" ? "" : `Tap a pocket to log a dose${main.stack.length > 1 ? ` · +${main.stack.length - main.stack.indexOf(topStrip(main) || main.stack[0]) - 1} strips in stack` : ""}`}</span><button class="link" data-act="go" data-to="strip" data-med="${main.id}" style="padding:0">${t("fullStrip")}</button></div></div>` : `<div class="card empty">${I.pill}<b style="color:var(--ink)">No medicines yet</b><span class="note">Scan a prescription or add a strip to get started.</span><button class="btn btn--dark btn--sm" data-act="addSheet">${I.plus}Add a medicine</button></div>`}
      ${others.length ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${others.map((m) => `<button class="card pad" data-act="${m.kind === "bottle" ? "openBottle" : "openStrip"}" data-med="${m.id}" style="text-align:left;display:flex;flex-direction:column;gap:8px"><b style="color:var(--ink);font-size:calc(14px * var(--fs))">${esc(m.name)} ${esc(m.strength)}</b>${miniStrip(m)}<span class="note" style="${low(m) ? "color:var(--red);font-weight:600" : ""}">${low(m) ? "Running low" : leftText(m)}${typeof m.weekly === "number" ? " · " + WEEK[m.weekly].slice(0, 3) : ""}</span></button>`).join("")}</div>` : ""}`;
    return screen(body, "", true);
  }
  const slotsTodayFirst = () => {
    const f = SLOTS.find((s) => S.meds.some((m) => (m.doses || {})[s.id] > 0 && !m.asNeeded));
    return f ? f.time : "09:00";
  };

  // Logging a slot: shows the tablets to take, then opens the pockets.
  function vDose() {
    const sl = slot(view.slot);
    const meds = S.meds.filter((m) => dueOn(m, new Date()).includes(sl.id));
    const todo = meds.filter((m) => !logFor(m.id, sl.id));
    const tabs = slotsToday().map((s) => `<button class="${s.id === sl.id ? "on" : ""}" data-act="go" data-to="dose" data-slot="${s.id}">${s.label.replace("After ", "After ").replace("Before breakfast", "Before bkfst")}<br><small>${s.complete ? "Done" : `${s.meds.length - s.done.length} now`}</small></button>`).join("");
    const item = (m) => `<div class="card pad row"><span class="pill-dot ${m.shape === "cap" ? "" : "round"}" style="--c:${m.color};margin:0;border-color:#fff"></span><div class="grow"><b style="color:var(--ink)">${esc(m.name)} ${esc(m.strength)}</b><div class="note">${fmtNum(m.doses[sl.id])} ${m.kind === "bottle" && m.bottle.unit === "ml" ? "× " + m.bottle.dose + " ml" : m.shape === "cap" ? "capsule" : "tablet"}${m.note ? " · " + esc(m.note) : ""}</div></div>${logFor(m.id, sl.id) ? `<span class="chip chip--green">${I.check}${t("taken")}</span>` : ""}</div>`;
    return screen(
      `${head(`${sl.label}`, "home")}
       <div class="tabs" style="text-align:center">${tabs}</div>
       <p class="note">${fmt12(sl.time)} · ${todo.length ? `${todo.length} to take` : "All taken"}</p>
       <div class="list">${meds.map(item).join("")}</div>
       ${sl.id.startsWith("a") ? '<div class="info info--blue">' + I.info + "<span>After food, within 30 minutes. With a full glass of water.</span></div>" : '<div class="info info--blue">' + I.info + "<span>On an empty stomach, 30 minutes before food.</span></div>"}`,
      todo.length ? `<button class="btn btn--dark btn--block" data-act="takeSlot" data-slot="${sl.id}">${todo.length > 1 ? `I took ${todo.length === 2 ? "both" : "all " + todo.length}` : "I took it"}</button>` : `<button class="btn btn--block" data-act="go" data-to="home">Back to Today</button>`
    );
  }

  // Full strip view for one medicine, with tabs to switch.
  function vStrip() {
    const m = S.meds.find((x) => x.id === view.med) || S.meds.find((x) => x.kind === "strip");
    if (!m) return vHome();
    const strips = S.meds.filter((x) => x.kind === "strip");
    const tabs = strips.map((x) => `<button class="${x.id === m.id ? "on" : ""}" data-act="go" data-to="strip" data-med="${x.id}">${esc(x.name)}</button>`).join("");
    const half = Object.values(m.doses).some((v) => v === 0.5);
    const nextIdx = strips.indexOf(m) + 1;
    return screen(
      `${head(`${m.name} ${m.strength}`, "home", `<div style="text-align:right"><b style="font-size:calc(22px * var(--fs));color:var(--ink)">${fmtNum(remaining(m))}</b><div class="note">${t("left")}</div></div>`)}
       <div class="tabs">${tabs}</div>
       <p class="note">${Object.entries(m.doses).map(([k, v]) => `${fmtNum(v)} ${slot(k).label.toLowerCase()}`).join(" · ") || "When needed"}${typeof m.weekly === "number" ? " · every " + WEEK[m.weekly] : ""}</p>
       ${stripHTML(m, { tap: true, meta: true, popped: lastPopped })}
       ${half ? `<div class="info info--blue">${I.info}<span>Half doses: the other half stays in its pocket and is used first next time.</span></div>` : ""}
       <p class="note">Tap a full pocket to log an extra dose, or an empty one to put a tablet back if you made a mistake.</p>`,
      nextIdx < strips.length ? `<button class="btn btn--dark btn--block" data-act="go" data-to="strip" data-med="${strips[nextIdx].id}">Next strip: ${esc(strips[nextIdx].name)}</button>` : `<button class="btn btn--block" data-act="go" data-to="home">Back to Today</button>`
    );
  }

  function vFinished() {
    const m = S.meds.find((x) => x.id === view.med);
    if (!m) return vHome();
    const logs = S.logs.filter((l) => l.medId === m.id && l.slot);
    const onTime = logs.filter((l) => l.due && Math.abs(mins(l.at) - mins(l.due)) <= 60).length;
    return screen(
      `<div style="padding:10px 30px">${stripHTML(m, { strip: m.stack[m.stack.length - 1] })}</div>
       <h1 style="font-size:calc(28px * var(--fs))">Strip finished</h1>
       <p class="note">${m.stack.length > 1 ? "Every strip in the stack is used." : "That was your only strip."} Add new strips when you buy them.</p>
       <div class="stats"><div class="card stat"><b>${onTime}/${logs.length || 0}</b><span>on time</span></div><div class="card stat"><b>${missedCount(m)}</b><span>missed</span></div><div class="card stat"><b>0</b><span>days left</span></div></div>`,
      `<button class="btn btn--dark btn--block" data-act="restock" data-med="${m.id}">I bought new strips</button><button class="btn btn--block" data-act="seenFinished" data-med="${m.id}" data-to="refill">Arrange a refill</button>`
    );
  }
  function missedCount(m, days = 30) {
    let n = 0;
    for (let i = 1; i <= days; i++) {
      const d = new Date(Date.now() - i * 864e5);
      if (d < new Date(m.addedAt || Date.now())) break;
      dueOn(m, d).forEach((s) => {
        if (!logFor(m.id, s, dayKey(d))) n++;
      });
    }
    return n;
  }

  // ---------- Medicine box ----------
  let boxQ = "";
  let boxF = "all";
  function vBox() {
    const exp = (m) => {
      const e = m.kind === "bottle" ? m.exp : (topStrip(m) || m.stack[0] || {}).exp;
      if (!e) return null;
      const [y, mo] = e.split("-").map(Number);
      return Math.round((new Date(y, mo - 1, 28) - new Date()) / 864e5);
    };
    const q = boxQ.toLowerCase();
    const list = S.meds.filter((m) => (!q || `${m.name} ${m.strength} ${m.note} ${m.where}`.toLowerCase().includes(q)) && (boxF === "all" || (boxF === "daily" && !m.asNeeded) || (boxF === "needed" && m.asNeeded) || (boxF === "exp" && (exp(m) ?? 999) < 60)));
    const cnt = (f) => S.meds.filter((m) => f === "all" || (f === "daily" && !m.asNeeded) || (f === "needed" && m.asNeeded) || (f === "exp" && (exp(m) ?? 999) < 60)).length;
    const f = (k, l) => `<button class="${boxF === k ? "on" : ""}" data-act="boxF" data-k="${k}">${l} · ${cnt(k)}</button>`;
    return screen(
      `<div class="top"><div class="grow"><span class="note">Everything at home</span><h1 style="font-size:calc(26px * var(--fs))">Medicine box</h1></div><button class="btn btn--dark btn--sm" data-act="addSheet">${I.plus}${t("add")}</button></div>
       <label class="row card" style="padding:0 14px;min-height:50px">${I.search}<input class="grow" style="border:0;outline:0;background:none;min-height:48px;font-size:calc(15px * var(--fs))" placeholder="Search: fever, cough, pain…" value="${esc(boxQ)}" data-input="boxQ" aria-label="Search the medicine box"></label>
       <div class="tabs">${f("all", "All")}${f("daily", "Daily")}${f("needed", "When needed")}${f("exp", "Expiring")}</div>
       <div class="list">${list.map((m) => { const e = exp(m); return `<button class="card pad row" data-act="${m.kind === "bottle" ? "openBottle" : "openStrip"}" data-med="${m.id}" style="text-align:left">${miniStrip(m)}<div class="grow"><b style="color:var(--ink)">${esc(m.name)} ${esc(m.strength)}</b><div class="note">${leftText(m)} · ${m.asNeeded ? "when needed" : "daily"}${m.where ? " · " + esc(m.where) : ""}</div></div>${e != null ? `<span class="note" style="${e < 60 ? "color:var(--red);font-weight:600" : ""}">${e < 0 ? "Expired" : e < 60 ? `In ${e} days` : "Exp " + monthName(m.kind === "bottle" ? m.exp : (topStrip(m) || m.stack[0]).exp)}</span>` : ""}</button>`; }).join("") || `<div class="card empty"><b style="color:var(--ink)">${boxQ ? "Nothing at home matches" : "Your box is empty"}</b><span class="note">${boxQ ? "Try another word, or add it." : "Add fever tablets, syrups and creams you keep at home."}</span></div>`}</div>`,
      "",
      true
    );
  }

  function vBottle() {
    const m = S.meds.find((x) => x.id === view.med);
    if (!m) return vHome();
    const isSyrup = m.bottle.unit === "ml";
    return screen(
      `${head(`${m.name} ${m.strength}`, "home", `<div style="text-align:right"><b style="font-size:calc(22px * var(--fs));color:var(--ink)">${fmtNum(m.bottle.left)} ${isSyrup ? "ml" : ""}</b><div class="note">of ${m.bottle.total} ${m.bottle.unit}</div></div>`)}
       <p class="note">${Object.entries(m.doses).map(([k, v]) => `${fmtNum(v)} ${slot(k).label.toLowerCase()}`).join(" · ") || "When needed"}${m.where ? " · kept in " + esc(m.where) : ""}</p>
       <div style="padding:16px 0">${bottleHTML(m)}</div>
       <div class="stats"><div class="card stat"><b>${Math.floor(m.bottle.left / (m.bottle.dose || 1))}</b><span>doses left</span></div><div class="card stat"><b>${daysLeft(m) ?? "—"}</b><span>days left</span></div><div class="card stat"><b style="font-size:calc(16px * var(--fs))">${monthName(m.exp)}</b><span>expiry</span></div></div>`,
      `<button class="btn btn--dark btn--block" data-act="bottleDose" data-med="${m.id}">Took ${isSyrup ? m.bottle.dose + " ml" : "1 tablet"}</button>${m.asNeeded ? "" : `<button class="link" data-act="stopMed" data-med="${m.id}">${isSyrup ? "Feeling better? Stop the doses" : "Doctor stopped it? Stop reminders"}</button>`}`
    );
  }

  // ---------- Care: prescription and strip report ----------
  function vCare() {
    const rx = S.rx;
    const day = rx ? Math.min(rx.days, Math.floor((Date.now() - new Date(rx.date)) / 864e5) + 1) : 0;
    const daily = S.meds.filter((m) => !m.asNeeded);
    const r = report();
    return screen(
      `<div class="top"><h1 style="font-size:calc(26px * var(--fs))">${t("care")}</h1><button class="btn btn--dark btn--sm" data-act="go" data-to="rxCam">Scan prescription</button></div>
       ${rx && rx.doctor ? `<div class="card pad row"><span class="choice__ic" style="background:var(--blue-soft);color:var(--blue);border-radius:50%">${esc(rx.doctor.replace(/^Dr\.?\s*/, "").split(" ").map((x) => x[0]).join("").slice(0, 2))}</span><div class="grow"><b style="color:var(--ink)">${esc(rx.doctor)}</b><div class="note">${esc(rx.clinic)}</div></div></div>` : ""}
       ${rx ? `<div class="card pad" style="display:flex;flex-direction:column;gap:10px"><div class="row"><b class="grow" style="color:var(--ink)">Prescription · ${new Date(rx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</b><span class="chip chip--green">Active</span></div><div class="row note"><span class="grow">${rx.days} day course</span><span>Day ${day} of ${rx.days}</span></div><div class="progress"><i style="width:${(day / rx.days) * 100}%;background:var(--dark)"></i></div>
        ${daily.map((m) => `<div class="row" style="padding-top:6px"><span class="pill-dot ${m.shape === "cap" ? "" : "round"}" style="--c:${m.color};margin:0;border-color:#fff"></span><div class="grow"><b style="color:var(--ink);font-size:calc(14px * var(--fs))">${esc(m.name)} ${esc(m.strength)}</b><div class="note">${Object.entries(m.doses).map(([k, v]) => `${fmtNum(v)} ${slot(k).label.toLowerCase()}`).join(", ")}</div></div><span class="note" style="${low(m) ? "color:var(--red);font-weight:600" : ""}">${low(m) ? "Low · " : ""}${m.kind === "bottle" ? Math.floor(m.bottle.left) : fmtNum(remaining(m))} left</span></div>`).join("")}</div>` : `<div class="card empty">${I.rx}<b style="color:var(--ink)">No prescription yet</b><span class="note">Scan one after your next visit and your plan updates itself.</span></div>`}
       <span class="label">Your strip report · last 30 days</span>
       <div class="stats"><div class="card stat"><b>${r.pct}%</b><span>on time</span></div><div class="card stat"><b>${r.late}</b><span>late</span></div><div class="card stat"><b>${r.missed}</b><span>missed</span></div></div>
       <div class="card pad"><div class="cal">${r.days.map((d) => `<span class="${d.c}" title="${d.label}">${d.n}</span>`).join("")}</div>
       <div class="row note" style="margin-top:12px;gap:14px;flex-wrap:wrap"><span>● taken</span><span style="color:#8a5a00">● late</span><span style="color:var(--red)">○ missed</span></div></div>
       <button class="btn" data-act="shareReport">Share the report with my doctor</button>
       <button class="link" data-act="reset">Start over on this phone</button>`,
      "",
      true
    );
  }
  function report() {
    const days = [];
    let ok = 0;
    let late = 0;
    let missed = 0;
    const start = new Date();
    start.setDate(start.getDate() - 27);
    for (let i = 0; i < 28; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = dayKey(d);
      const isToday = key === dayKey();
      const future = d > new Date();
      let due = 0;
      let got = 0;
      let lt = 0;
      S.meds.forEach((m) => {
        if (new Date(m.addedAt || 0) > new Date(key + "T23:59")) return;
        dueOn(m, d).forEach((s) => {
          const passed = !isToday || nowMins() > mins(slot(s).time) + 120;
          if (!passed) return;
          due++;
          const l = logFor(m.id, s, key);
          if (l && !l.skipped) {
            got++;
            if (Math.abs(mins(l.at) - mins(slot(s).time)) > 90) lt++;
          }
        });
      });
      let c = "future";
      if (!future || isToday) {
        if (!due) c = "";
        else if (got < due) {
          c = "miss";
          missed += due - got;
        } else if (lt) {
          c = "late";
          late += lt;
          ok += got - lt;
        } else {
          c = "ok";
          ok += got;
        }
      }
      days.push({ n: d.getDate(), c, label: key });
    }
    const total = ok + late + missed;
    return { days, ok, late, missed, pct: total ? Math.round((ok / total) * 100) : 100 };
  }

  // ---------- Ask (Gemini) ----------
  let askBusy = false;
  function vAsk() {
    const chips = ["I skipped breakfast. Can I still take my tablets?", "Can I have tea with my medicines?", "What is each tablet for?"];
    return screen(
      `<div class="top"><div class="grow"><h1 style="font-size:calc(26px * var(--fs))">${t("ask")}</h1><span class="note">Answers use your prescription and the medicine leaflet</span></div></div>
       ${S.chat.length ? "" : `<div class="info info--blue">${I.info}<span>The assistant explains what is already prescribed. It never changes a dose. For anything new or urgent, it points you to your doctor.</span></div><div class="chips">${chips.map((c) => `<button class="btn btn--sm" data-act="askChip" data-q="${esc(c)}">${esc(c)}</button>`).join("")}</div>`}
       <div class="list" id="chat">${S.chat.map((m) => `<div class="bubble ${m.me ? "bubble--me" : ""}">${esc(m.text)}</div>`).join("")}${askBusy ? '<div class="bubble row"><span class="spinner" style="width:18px;height:18px"></span>Thinking…</div>' : ""}</div>`,
      `<form class="composer" data-form="ask"><input class="input" name="q" placeholder="Ask about any of your medicines" autocomplete="off" aria-label="Ask about your medicines"><button class="send" aria-label="Send" ${askBusy ? "disabled" : ""}>${I.send}</button></form>`,
      true
    );
  }
  async function askAssistant(q) {
    if (!q.trim() || askBusy) return;
    S.chat.push({ me: true, text: q.trim() });
    askBusy = true;
    save();
    render();
    try {
      const meds = S.meds.map((m) => `${m.name} ${m.strength}: ${m.asNeeded ? "when needed" : Object.entries(m.doses).map(([k, v]) => `${v} ${slot(k).label}`).join(", ")}${typeof m.weekly === "number" ? " (weekly, " + WEEK[m.weekly] + ")" : ""}${m.note ? " — " + m.note : ""}`).join("\n");
      const history = S.chat.slice(-6).map((m) => `${m.me ? "Patient" : "Assistant"}: ${m.text}`).join("\n");
      const text = await ask(
        `PATIENT'S MEDICINES (from their prescription):\n${meds || "None added yet"}\n\nCONVERSATION:\n${history}\n\nReply to the patient's last message in 2 to 4 short sentences.`,
        {
          system:
            "You are the assistant in Strip, a medicine tracker for older people in India. Explain only what is already prescribed, in plain simple words. " +
            "Never change, add or stop a dose and never diagnose. Never suggest taking two doses to catch up. For anything new, worrying or urgent, tell them to call their doctor or pharmacist. No markdown.",
          maxTokens: 400,
        }
      );
      S.chat.push({ me: false, text: text.trim() });
    } catch (e) {
      S.chat.push({ me: false, text: e.message || "Couldn't reach the assistant. Try again in a minute." });
    }
    askBusy = false;
    save();
    render();
    const m = $("#main");
    if (m) m.scrollTop = m.scrollHeight;
  }

  // ---------- Family ----------
  function vFamily() {
    const slots = slotsToday();
    const lowOnes = S.meds.filter(low);
    return screen(
      `<div class="top"><h1 style="font-size:calc(26px * var(--fs))">${t("family")}</h1></div>
       <p class="note">Your son, daughter or carer can see what you've taken today and what's running low. They never see your chats.</p>
       <span class="label">What they see today</span>
       <div class="card" style="padding:4px 16px">${slots.map((s) => `<div class="row" style="padding:12px 0;border-bottom:1px solid var(--line2)"><span class="check ${s.complete ? "" : "todo"}">${s.complete ? I.check : ""}</span><div class="grow"><b style="color:var(--ink)">${s.label}</b><div class="note">${esc(s.meds.map((m) => m.name).join(", "))}</div></div><span class="note" style="${s.complete ? "color:var(--green);font-weight:600" : ""}">${s.complete ? "Taken " + (S.logs.filter((l) => l.slot === s.id && l.date === dayKey()).map((l) => l.at).sort().pop() || "") : "Due " + fmt12(s.time)}</span></div>`).join("") || '<p class="note" style="padding:12px 0">Nothing scheduled today.</p>'}</div>
       ${lowOnes.length ? `<div class="card pad" style="background:var(--peach);border-color:#f4c6b6;display:flex;flex-direction:column;gap:10px"><b style="color:var(--peach-ink)">${esc(lowOnes.map((m) => `${m.name} is down to ${m.kind === "bottle" ? Math.floor(m.bottle.left) + " " + m.bottle.unit : fmtNum(remaining(m)) + " tablets"}`).join(" · "))}</b><button class="btn btn--dark" data-act="go" data-to="refill">Arrange refill</button></div>` : ""}
       <button class="btn btn--block" data-act="shareFamily">Share today with family on WhatsApp</button>`,
      "",
      true
    );
  }

  function vRefill() {
    const need = S.meds.filter((m) => !m.asNeeded && (low(m) || (m.kind === "strip" && !topStrip(m))));
    const list = need.length ? need : S.meds.filter((m) => !m.asNeeded);
    const qty = (m) => (m.kind === "bottle" ? "1 bottle" : `${Math.max(1, Math.ceil(((S.rx ? S.rx.days : 30) * totalDaily(m)) / m.perStrip) - Math.floor(remaining(m) / m.perStrip))} strips`);
    return screen(
      `${head("Arrange a refill", "home")}
       <p class="note">Show this at the pharmacy, or send it to your chemist on WhatsApp.</p>
       <div class="card pad" style="display:flex;flex-direction:column;gap:12px"><div class="row"><b class="grow" style="color:var(--ink)">Refill list</b><span class="note">${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span></div>
       ${list.map((m) => `<div class="row"><span class="pill-dot ${m.shape === "cap" ? "" : "round"}" style="--c:${m.color};margin:0;border-color:#fff"></span><b class="grow" style="color:var(--ink)">${esc(m.name)} ${esc(m.strength)}</b><b>× ${qty(m)}</b></div>`).join("")}
       ${S.rx && S.rx.doctor ? `<p class="note">Prescribed by ${esc(S.rx.doctor)}, ${esc(S.rx.clinic)}</p>` : ""}</div>
       <div class="info info--blue">${I.info}<span>When the new strips arrive, add them from Today → Add, and they join the stack.</span></div>`,
      `<button class="btn btn--dark btn--block" data-act="waRefill">Send to chemist on WhatsApp</button><button class="btn btn--block" data-act="go" data-to="home">Done</button>`
    );
  }

  // ---------- Render ----------
  let lastPopped = [];
  function render() {
    applyPrefs();
    const app = $("#app");
    const v = view.name;
    const map = { welcome: vWelcome, rxCam: vRxCam, plan: vPlan, setup: vSetup, stripCam: vStripCam, confirm: vConfirm, homeStart: vHomeStart, addMed: vAddMed, home: vHome, dose: vDose, strip: vStrip, finished: vFinished, bottle: vBottle, refill: vRefill };
    const main = $("#main");
    const keep = main ? main.scrollTop : 0;
    const focus = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.input || document.activeElement.dataset.m : null;
    const caret = focus ? document.activeElement.selectionStart : 0;
    app.innerHTML = (map[v] || vHome)();
    const m2 = $("#main");
    if (m2) m2.scrollTop = keep;
    if (focus) {
      const el = document.querySelector(`[data-input="${focus}"],[data-m="${focus}"]`);
      if (el) {
        el.focus();
        el.setSelectionRange(caret, caret);
      }
    }
    lastPopped = [];
  }

  // ---------- Actions ----------
  const A = {
    go: (el) => {
      if (el.dataset.med) view.med = el.dataset.med;
      if (el.dataset.to === "home") return go("home");
      go(el.dataset.to, { med: el.dataset.med || view.med, slot: el.dataset.slot || view.slot });
    },
    tab: (el) => {
      tab = el.dataset.k;
      go("home");
    },
    lang: (el) => {
      S.lang = el.dataset.k;
      save();
      render();
    },
    big: () => {
      S.big = !S.big;
      save();
      render();
    },
    sampleRx: () => {
      S.rx = { clinic: SAMPLE_RX.clinic, doctor: SAMPLE_RX.doctor, date: SAMPLE_RX.date, days: SAMPLE_RX.days };
      S.plan = clone(SAMPLE_RX.meds);
      save();
      go("plan");
    },
    savePlan: () => {
      save();
      go("setup");
    },
    addFromPlan: (el) => {
      const p = S.plan[+el.dataset.i];
      const isBottle = p.form === "bottle" || p.form === "syrup";
      const weekly = p.weekly != null;
      go("confirm", { draft: { name: p.name, strength: p.strength, form: p.form, perStrip: weekly ? 4 : 10, exp: expYM(isBottle ? 14 : 12), doses: clone(p.doses), weekly: p.weekly, note: p.note, planName: p.name, used: 0, strips: weekly ? 1 : 3 } });
    },
    finishSetup: () => {
      S.onboarded = true;
      save();
      tab = "today";
      go("home");
    },
    dTime: (el) => {
      const d = view.draft;
      const k = el.dataset.k;
      if (d.doses[k]) delete d.doses[k];
      else d.doses[k] = 1;
      render();
    },
    dStrips: (el) => {
      view.draft.strips = Math.max(1, Math.min(6, view.draft.strips + +el.dataset.n));
      render();
    },
    dUsed: (el) => {
      view.draft.used = Math.max(0, Math.min(view.draft.perStrip - 1, view.draft.used + +el.dataset.n));
      render();
    },
    addDraft: () => {
      const d = view.draft;
      const m = makeMed(d, { from: d.planName ? "rx" : "self", strips: d.strips, used: d.used, perStrip: d.perStrip });
      m.planName = d.planName;
      m.addedAt = new Date().toISOString();
      if (d.planName) {
        const p = S.plan.find((x) => x.name === d.planName);
        if (p && typeof p.weekly === "number") m.weekly = p.weekly;
      }
      S.meds.push(m);
      save();
      toast(`${m.name} added`);
      if (!S.onboarded && S.plan.length) go("setup");
      else {
        S.onboarded = true;
        save();
        tab = "today";
        go("home");
      }
    },
    sampleHome: () => {
      const add = (p, o) => {
        const m = makeMed(p, o);
        m.addedAt = new Date(Date.now() - 6 * 864e5).toISOString();
        S.meds.push(m);
        return m;
      };
      add({ name: "Telmisartan", strength: "40 mg", form: "tablet", doses: { ab: 1 }, note: "After breakfast", color: "#e8573f" }, { from: "self", strips: 2, used: 6 });
      add({ name: "Atorvastatin", strength: "10 mg", form: "tablet", doses: { ad: 1 }, note: "After dinner", color: "#f2efe8" }, { from: "self", strips: 1, used: 7 });
      add({ name: "Paracetamol", strength: "650 mg", form: "tablet", asNeeded: true, where: "Kitchen shelf, top box", color: "#f6f6f2" }, { strips: 2, used: 6 });
      const syrup = add({ name: "Cough syrup", strength: "", form: "syrup", asNeeded: true, where: "Fridge door" }, {});
      syrup.bottle.left = 58;
      S.onboarded = true;
      save();
      tab = "today";
      go("home");
    },
    mForm: (el) => {
      view.draft.form = el.dataset.k;
      render();
    },
    mNeed: (el) => {
      view.draft.asNeeded = el.dataset.v === "1";
      render();
    },
    mNext: () => {
      const d = view.draft;
      d.name = d.name.trim();
      if (d.asNeeded) {
        const m = makeMed({ ...d, doses: {} }, { from: "self", strips: 1, perStrip: 10 });
        m.addedAt = new Date().toISOString();
        S.meds.push(m);
        S.onboarded = true;
        save();
        toast(`${m.name} added to your medicine box`);
        tab = "box";
        go("home");
        return;
      }
      go("confirm", { draft: { ...d, planName: null, weekly: null } });
    },
    addSheet: () =>
      sheet(
        `<h2 style="font-size:calc(22px * var(--fs))">Add a medicine</h2><p class="note">What does it come in?</p>
        <button class="choice" data-act="go" data-to="stripCam"><span class="choice__ic">${I.pill}</span><span class="grow"><b>Tablet strip</b><span>Scan the silver back</span></span></button>
        <button class="choice" data-act="go" data-to="stripCam"><span class="choice__ic">${I.box}</span><span class="grow"><b>Bottle or syrup</b><span>Scan the label</span></span></button>
        <button class="choice" data-act="go" data-to="addMed"><span class="choice__ic">Aa</span><span class="grow"><b>Type the name</b><span>If you can't scan it</span></span></button>
        <button class="btn btn--block" data-act="go" data-to="rxCam">Got a new prescription? Scan it</button>`,
        "Add a medicine"
      ),
    pocket: (el) => {
      const m = S.meds.find((x) => x.id === el.dataset.med);
      const i = +el.dataset.i;
      const strip = topStrip(m) || m.stack[m.stack.length - 1];
      const sIdx = m.stack.indexOf(strip);
      // Show the strip that is on screen: the top strip, or the last one when all are empty.
      const shown = view.name === "strip" || view.name === "home" ? strip : strip;
      if (shown.pockets[i] === 0) {
        // Put a tablet back: undoes the most recent dose of this medicine today.
        const last = [...S.logs].reverse().find((l) => l.medId === m.id && l.date === dayKey());
        shown.pockets[i] = 1;
        if (last) S.logs = S.logs.filter((l) => l !== last);
        save();
        toast("Put back. That dose is no longer logged.");
        render();
        return;
      }
      // Log against the next due slot for this medicine today, or as an extra dose.
      const due = dueOn(m, new Date()).find((s) => !logFor(m.id, s));
      const qty = due ? m.doses[due] : 1;
      const snapshot = clone(m);
      const before = shown.pockets[i];
      const take = Math.min(qty, before);
      shown.pockets[i] = +(before - take).toFixed(2);
      if (take < qty) consume(m, +(qty - take).toFixed(2));
      const entry = { id: uid(), medId: m.id, slot: due || null, date: dayKey(), at: nowHM(), qty, due: due ? slot(due).time : null };
      S.logs.push(entry);
      if (!topStrip(m)) delete S.seenFinished[m.id];
      save();
      lastPopped = [i];
      render();
      toast(due ? `${m.name} logged · ${slot(due).label.toLowerCase()}` : `Extra ${m.name} logged`, () => undoDoses([{ entry, snapshot }]));
      void sIdx;
    },
    dose: (el) => go("dose", { slot: el.dataset.slot }),
    takeSlot: (el) => {
      const id = el.dataset.slot;
      const meds = S.meds.filter((m) => dueOn(m, new Date()).includes(id) && !logFor(m.id, id));
      const items = meds.map((m) => logDose(m, id, m.doses[id]));
      save();
      tab = "today";
      go("home");
      toast(`${meds.length > 1 ? meds.length + " pockets" : "1 pocket"} opened · ${slot(id).label.toLowerCase()}`, () => undoDoses(items));
    },
    earlier: (el) => {
      const id = el.dataset.slot;
      const meds = S.meds.filter((m) => dueOn(m, new Date()).includes(id) && !logFor(m.id, id));
      const items = meds.map((m) => logDose(m, id, m.doses[id], slot(id).time));
      save();
      render();
      toast("Logged at the usual time", () => undoDoses(items));
    },
    skip: (el) => {
      const id = el.dataset.slot;
      S.meds.filter((m) => dueOn(m, new Date()).includes(id) && !logFor(m.id, id)).forEach((m) => S.logs.push({ id: uid(), medId: m.id, slot: id, date: dayKey(), at: nowHM(), qty: 0, skipped: true }));
      save();
      render();
      toast("Skipped. Your doctor will see it in the report.");
    },
    openStrip: (el) => go("strip", { med: el.dataset.med }),
    openBottle: (el) => go("bottle", { med: el.dataset.med }),
    bottleDose: (el) => {
      const m = S.meds.find((x) => x.id === el.dataset.med);
      const due = dueOn(m, new Date()).find((s) => !logFor(m.id, s));
      const r = logDose(m, due || null, due ? m.doses[due] : 1);
      save();
      render();
      toast(`Logged · ${fmtNum(m.bottle.left)} ${m.bottle.unit} left`, () => undoDoses([r]));
    },
    stopMed: (el) => {
      const m = S.meds.find((x) => x.id === el.dataset.med);
      m.asNeeded = true;
      m.doses = {};
      save();
      toast(`Reminders stopped. ${m.name} stays in your medicine box.`);
      tab = "box";
      go("home");
    },
    restock: (el) => {
      const m = S.meds.find((x) => x.id === el.dataset.med);
      m.stack = [newStrip(m.perStrip, expYM(12)), newStrip(m.perStrip, expYM(13))];
      delete S.seenFinished[m.id];
      save();
      toast("2 new strips added to the stack");
      go("home");
    },
    seenFinished: (el) => {
      S.seenFinished[el.dataset.med] = true;
      save();
      go(el.dataset.to || "home");
    },
    boxF: (el) => {
      boxF = el.dataset.k;
      render();
    },
    askChip: (el) => askAssistant(el.dataset.q),
    shareReport: () => {
      const r = report();
      const text = `My Strip report, last 4 weeks: ${r.pct}% on time, ${r.late} late, ${r.missed} missed.\n${S.meds.filter((m) => !m.asNeeded).map((m) => `${m.name} ${m.strength}: ${fmtNum(remaining(m))} left`).join("\n")}`;
      if (navigator.share) navigator.share({ title: "My strip report", text }).catch(() => {});
      else {
        navigator.clipboard && navigator.clipboard.writeText(text);
        toast("Report copied. Paste it into a message to your doctor.");
      }
    },
    shareFamily: () => {
      const s = slotsToday();
      const text = `Today: ${s.map((x) => `${x.label} ${x.complete ? "✓ taken" : "due " + fmt12(x.time)}`).join(", ")}.${S.meds.filter(low).length ? " Running low: " + S.meds.filter(low).map((m) => m.name).join(", ") + "." : ""}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    },
    waRefill: () => {
      const list = S.meds.filter((m) => !m.asNeeded && (low(m) || (m.kind === "strip" && !topStrip(m))));
      const use = list.length ? list : S.meds.filter((m) => !m.asNeeded);
      const text = `Hello, please send:\n${use.map((m) => `• ${m.name} ${m.strength}`).join("\n")}${S.rx && S.rx.doctor ? `\nPrescribed by ${S.rx.doctor}.` : ""}\nThank you.`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    },
    reset: () => {
      if (!confirm("Clear your plan, strips and history from this phone?")) return;
      S = fresh();
      save();
      tab = "today";
      go("welcome");
    },
  };

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el || el.disabled) return;
    const fn = A[el.dataset.act];
    if (fn) {
      e.preventDefault();
      fn(el, e);
    }
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el.dataset.file === "rx" && el.files[0]) readRx(el.files[0]);
    if (el.dataset.file === "strip" && el.files[0]) readStrip(el.files[0]);
    if (el.dataset.week != null) {
      S.plan[+el.dataset.week].weekly = el.value === "" ? "ask" : +el.value;
      save();
      render();
    }
  });
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.dataset.input === "boxQ") {
      boxQ = el.value;
      render();
    }
    if (el.dataset.m && view.draft) {
      view.draft[el.dataset.m] = el.value;
      const btn = $('[data-act="mNext"]');
      if (btn) btn.disabled = !view.draft.name.trim();
    }
  });
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.target.dataset.form === "ask") {
      const q = e.target.q.value;
      e.target.q.value = "";
      askAssistant(q);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSheet();
  });
  // Re-check what is due every minute, so the Today card stays current.
  setInterval(() => {
    if (view.name === "home" && tab === "today" && !document.querySelector(".scrim")) render();
  }, 60000);

  render();
})();
