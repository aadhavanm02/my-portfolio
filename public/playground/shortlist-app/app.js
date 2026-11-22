// Shortlist: daily job matches, a one-page resume tailored to each job, and referrals.
// One responsive app: a top nav on desktop, bottom tabs on phones. Everything is saved in this
// browser. Resume reading, tailoring, refining and referral notes are done by Gemini through the
// portfolio's Cloudflare Worker, so the API key never reaches the page.
(function () {
  const D = window.SL_DATA;
  const AI_URL = "https://portfolio-gemini-proxy.aadhavanm8.workers.dev";
  const KEY = "shortlist-app-v1";
  const LIMITS = { tailor: 20, refinePerJob: 20, refineDay: 400, active: 5 };

  // ---------- Icons ----------
  const svg = (d, s = 20, extra = "") =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
  const I = {
    back: svg('<path d="M15 6l-6 6 6 6"/>', 22),
    next: svg('<path d="M9 6l6 6-6 6"/>', 18),
    jobs: svg('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),
    refs: svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c2 .8 3.5 2.8 3.5 5.5"/>'),
    msgs: svg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>'),
    doc: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>'),
    gear: svg('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'),
    bell: svg('<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', 18),
    filter: svg('<path d="M4 6h16M7 12h10M10 18h4"/>', 18),
    check: svg('<path d="M5 12l4 4L19 6"/>', 16),
    x: svg('<path d="M6 6l12 12M18 6L6 18"/>', 16),
    wand: svg('<path d="M15 4V2M15 10V8M11 6h2M17 6h2"/><path d="M3 21l11-11"/>', 18),
    hand: svg('<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11.5v-7a1.5 1.5 0 0 1 3 0V12M14 10.5a1.5 1.5 0 0 1 3 0V12M17 11.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-2a6 6 0 0 1-5.2-3L4 14.5a1.5 1.5 0 0 1 2.5-1.6L8 15"/>', 18),
    download: svg('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', 18),
    ext: svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>', 18),
    send: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 20, 'stroke-width="2.2"'),
    undo: svg('<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>', 16),
    info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>', 16),
    clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 14),
    shield: svg('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>', 14),
    plus: svg('<path d="M12 5v14M5 12h14"/>', 18),
    mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>', 18),
    flag: svg('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', 20),
    lock: svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', 14),
    brief: svg('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>', 20),
    upload: svg('<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>', 18),
    spark: svg('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>', 16),
    logo: svg('<path d="M5 12l4 4L19 6"/>', 18, 'stroke-width="3"'),
  };

  // ---------- State ----------
  const today = () => new Date().toISOString().slice(0, 10);
  const clone = (x) => JSON.parse(JSON.stringify(x));
  function fresh() {
    return {
      v: 1,
      onboarded: false,
      goal: { find: true, refer: true },
      prefs: { titles: ["Product Designer", "Senior Product Designer", "UX Designer"], cities: ["Chennai", "Bangalore", "Hyderabad"], work: ["Office", "Hybrid"], exp: "4", notice: "30 days" },
      resume: null,
      resumeFile: "",
      status: {},
      tailored: {},
      usage: { day: today(), tailor: 0, refine: 0 },
      requests: [],
      threads: clone(D.threads.filter((t) => t.id !== "priya")),
      giving: clone(D.giving),
      settings: { push: true, hide: true },
      notifyMe: {},
    };
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
  // The web and phone views share progress when both are open.
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      S = load();
      render();
    }
  });
  function usage() {
    if (S.usage.day !== today()) S.usage = { day: today(), tailor: 0, refine: 0 };
    return S.usage;
  }

  // ---------- Helpers ----------
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const $ = (s, r = document) => r.querySelector(s);
  const job = (id) => D.jobs.find((j) => j.id === id);
  const ref = (id) => D.referrers[id];
  const initials = (n) => String(n || "?").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const isDesk = () => window.matchMedia("(min-width: 900px)").matches;
  const go = (path) => (location.hash = "#/" + path);

  let toastTimer;
  function toast(msg) {
    document.querySelectorAll(".toast").forEach((t) => t.remove());
    const t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.textContent = msg;
    document.body.appendChild(t);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.remove(), 3200);
  }

  // ---------- AI ----------
  const SYSTEM =
    "You are the resume assistant inside Shortlist, a job search app in India. " +
    "Never invent experience, employers, titles, numbers or skills the person has not stated. " +
    "Keep resumes to one page. Write plainly and specifically, no buzzwords, no emoji, no markdown.";
  async function ask(prompt, extra = {}) {
    if (!navigator.onLine) throw new Error("You're offline. Connect to the internet and try again.");
    const res = await fetch(AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: SYSTEM, prompt, ...extra }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.text) throw new Error(data.error || "The AI didn't answer. Try again in a minute.");
    return data.text;
  }
  async function askJSON(prompt, extra) {
    const t = await ask(prompt, { json: true, maxTokens: 2500, ...extra });
    const m = t.match(/\{[\s\S]*\}/);
    return JSON.parse(m ? m[0] : t);
  }

  // ---------- Resume helpers ----------
  function cleanResume(r) {
    if (!r || !Array.isArray(r.experience)) return null;
    return {
      name: String(r.name || "Your name"),
      title: String(r.title || ""),
      links: Array.isArray(r.links) ? r.links.slice(0, 3).map(String) : [],
      summary: String(r.summary || ""),
      experience: r.experience.slice(0, 4).map((e) => ({
        role: String(e.role || ""),
        company: String(e.company || ""),
        dates: String(e.dates || ""),
        bullets: (Array.isArray(e.bullets) ? e.bullets : []).slice(0, 6).map((b) => (typeof b === "string" ? { label: "", text: b } : { label: String(b.label || ""), text: String(b.text || "") })),
      })),
      education: String(r.education || ""),
      skills: Array.isArray(r.skills) ? r.skills.slice(0, 16).map(String) : [],
    };
  }
  function resumeText(r) {
    if (!r) return "";
    return [r.title, r.summary, ...r.experience.flatMap((e) => [e.role, e.company, ...e.bullets.map((b) => `${b.label} ${b.text}`)]), r.education, ...r.skills].join(" \n ");
  }
  function lines(r) {
    const out = [{ path: "summary", label: "Summary", text: r.summary }];
    r.experience.forEach((e, i) => e.bullets.forEach((b, j) => out.push({ path: `experience.${i}.bullets.${j}.text`, label: `${e.company}${b.label ? " · " + b.label : ""}`, text: b.text })));
    return out;
  }
  function getPath(r, p) {
    return p.split(".").reduce((o, k) => (o == null ? undefined : o[k]), r);
  }
  function setPath(r, p, v) {
    const ks = p.split(".");
    const last = ks.pop();
    const o = ks.reduce((o, k) => (o == null ? undefined : o[k]), r);
    if (o != null && last in o) o[last] = v;
  }
  const SYN = {
    "mobile apps": ["mobile app", "ios", "android"],
    "checkout flows": ["checkout"],
    dashboards: ["dashboard"],
    "design systems": ["design system"],
    "b2b saas": ["b2b", "saas"],
    "data visualisation": ["data visual", "chart"],
    "a/b testing": ["a/b", "experiment"],
    ecommerce: ["ecommerce", "e-commerce", "shopify", "storefront"],
    payments: ["payment"],
    "usability testing": ["usability"],
    "visual design": ["visual design", "ui design"],
    "motion design": ["motion", "animation"],
    cart: ["cart"],
    analytics: ["analytics"],
    growth: ["growth", "engagement"],
    "landing pages": ["landing page"],
    "information architecture": ["information architecture"],
  };
  function hasKw(text, k) {
    const t = text.toLowerCase();
    const key = k.toLowerCase();
    return [key, key.replace(/s$/, ""), ...(SYN[key] || [])].some((w) => t.includes(w));
  }
  function haveMissing(r, j) {
    const t = resumeText(r);
    const have = j.keywords.filter((k) => hasKw(t, k));
    return { have, missing: j.keywords.filter((k) => !have.includes(k)) };
  }
  function score(r, j) {
    if (!r) return 0;
    const { have } = haveMissing(r, j);
    return Math.min(98, Math.round(50 + (48 * have.length) / j.keywords.length));
  }
  const bulletCount = (r) => r.experience.reduce((n, e) => n + e.bullets.length, 0);

  function paper(r, opts = {}) {
    const cls = (p) => {
      const c = [];
      if (opts.hl && opts.hl.has(p)) c.push("hl");
      if (opts.hlNew && opts.hlNew.has(p)) c.push("hl-new");
      if (opts.edit) c.push("edit");
      return c.join(" ");
    };
    const attr = (p) => (opts.edit ? ` data-act="editLine" data-path="${p}" tabindex="0" role="button" aria-label="Edit this line"` : "");
    return `<article class="paper" aria-label="Resume preview">
      <div class="paper__head"><div><div class="paper__name">${esc(r.name)}</div><div class="paper__title">${esc(r.title)}</div></div>
      <div class="paper__links">${r.links.map(esc).join("<br>")}</div></div>
      <div class="line ${cls("summary")}"${attr("summary")}>${esc(r.summary)}</div>
      <div class="paper__sec">PROFESSIONAL EXPERIENCE</div>
      ${r.experience
        .map(
          (e, i) => `<div class="paper__job">${esc(e.role)}${e.company ? ", " + esc(e.company) : ""}<span>${esc(e.dates)}</span></div>
        <ul>${e.bullets.map((b, j) => { const p = `experience.${i}.bullets.${j}.text`; return `<li class="${cls(p)}"${attr(p)}>${b.label ? `<b>${esc(b.label)}:</b> ` : ""}${esc(b.text)}</li>`; }).join("")}</ul>`
        )
        .join("")}
      ${r.education ? `<div class="paper__sec">EDUCATION</div><div>${esc(r.education)}</div>` : ""}
      ${r.skills.length ? `<div class="paper__sec">SKILLS</div><div class="paper__skills">${r.skills.map(esc).join(" · ")}</div>` : ""}
    </article>`;
  }

  function printResume(r, fileName) {
    const w = window.open("", "_blank");
    if (!w) return toast("Allow pop-ups to download the PDF.");
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(fileName)}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Manrope:wght@800&display=swap" rel="stylesheet">
      <style>@page{size:A4;margin:14mm}body{margin:0;font:10.5pt/1.5 Inter,sans-serif;color:#222}
      .paper__head{display:flex;justify-content:space-between}.paper__name{font:800 20pt Manrope,sans-serif;color:#111}
      .paper__title,.paper__links,.paper__sec{color:#b8461c}.paper__links{text-align:right;font-size:9pt}
      .paper__sec{margin:12pt 0 4pt;font-size:8pt;font-weight:800;letter-spacing:.08em}.paper__job{display:flex;justify-content:space-between;font-weight:700;margin-top:6pt}
      .paper__job span{font-weight:500}ul{margin:2pt 0 0;padding-left:14pt}</style></head><body>${paper(r)}
      <script>document.fonts.ready.then(()=>{setTimeout(()=>print(),200)})<\/script></body></html>`);
    w.document.close();
  }

  // ---------- Layout ----------
  const unread = () => S.threads.filter((t) => t.unread).length;
  function deskNav(active, crumb) {
    const u = usage();
    const link = (k, label, extra = "") => `<a href="#/${k}" class="${active === k ? "on" : ""}">${label}${extra}</a>`;
    return `<nav class="desk-nav" aria-label="Main">
      <a class="desk-nav__brand" href="#/jobs"><span class="logo">${I.logo}</span>Shortlist</a>
      <div class="desk-nav__links">${link("jobs", "Jobs")}${link("referrals", "Referrals")}${link("messages", "Messages", unread() ? `<span class="count">${unread()}</span>` : "")}${link("resumes", "Resumes")}</div>
      ${crumb ? `<a class="desk-nav__crumb" href="#/${crumb[0]}">${I.back.replace('width="22" height="22"', 'width="16" height="16"')}${esc(crumb[1])}</a>` : ""}
      <div class="desk-nav__right">
        <span class="pill-stat"><i></i>Tailorings left today: ${LIMITS.tailor - u.tailor} of ${LIMITS.tailor}</span>
        <a class="icon-btn" href="#/notifications" aria-label="Notifications">${I.bell}<span class="dot"></span></a>
        <a class="me-pill" href="#/settings"><span class="avatar avatar--me">${esc(initials(S.resume?.name || "A")[0])}</span>${esc(S.resume?.name || "You")}</a>
      </div></nav>`;
  }
  function bottomNav(active) {
    const item = (k, label, ic, badge) => `<a href="#/${k}" class="${active === k ? "on" : ""}" ${active === k ? 'aria-current="page"' : ""}><span class="ic">${ic}</span>${label}${badge ? `<span class="badge">${badge}</span>` : ""}</a>`;
    return `<nav class="bottom-nav" aria-label="Main">${item("jobs", "Jobs", I.jobs)}${item("referrals", "Referrals", I.refs)}${item("messages", "Messages", I.msgs, unread() || "")}${item("resumes", "Resumes", I.doc)}${item("settings", "Settings", I.gear)}</nav>`;
  }
  function mobTop(title, sub) {
    return `<header class="top top--mob"><div class="top__title"><h1>${esc(title)}</h1>${sub ? `<span>${esc(sub)}</span>` : ""}</div>
      <a class="icon-btn" href="#/notifications" aria-label="Notifications">${I.bell}<span class="dot"></span></a>
      <a href="#/settings" class="avatar avatar--me" aria-label="Settings" style="text-decoration:none">${esc(initials(S.resume?.name || "A")[0])}</a></header>`;
  }
  function subTop(back, title, sub, action = "") {
    return `<header class="top top--sub"><a class="icon-btn" href="#/${back}" aria-label="Back">${I.back}</a>
      <div class="top__title"><b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ""}</div>${action}</header>`;
  }
  // tab: which main tab is active. mob: mobile header. foot: sticky footer (mobile) / inline (desktop).
  function shell({ tab, crumb, mob, body, foot, nav = true }) {
    const offline = !navigator.onLine ? `<div class="info info--amber" style="border-radius:0">${I.info}<span><b>You're offline.</b> Your saved jobs and resumes still work. AI tailoring needs a connection.</span></div>` : "";
    return `${deskNav(tab, crumb)}${mob || ""}${offline}<main class="main" id="main">${body}</main>${foot ? `<div class="foot mob-only">${foot}</div>` : ""}${nav ? `<div class="mob-only">${bottomNav(tab)}</div>` : ""}`;
  }

  // ---------- Onboarding ----------
  function vWelcome() {
    const sample = D.jobs[0];
    return `<main class="main"><div class="page onb-wrap" style="min-height:100%;justify-content:space-between">
      <div style="display:flex;flex-direction:column;gap:22px">
        <div style="display:flex;align-items:center;gap:10px;font:800 18px Manrope,sans-serif;color:var(--ink)"><span class="logo">${I.logo}</span>Shortlist</div>
        <div class="welcome-hero" style="display:flex;flex-direction:column;gap:14px"><h1>Find the right jobs. Tailor your resume. Get referred.</h1>
        <p class="muted" style="font-size:15px;line-height:1.55">Daily job matches, a one-page resume for every job, and people inside the company who are ready to refer you.</p></div>
        <div class="card" style="padding:14px;box-shadow:0 10px 30px rgb(28 26 34 / 8%)">
          <div class="job__head"><div class="job__title">${esc(sample.title)}</div><span class="match">94%</span></div>
          <div class="job__meta">${esc(sample.company)} · ${esc(sample.city)} · ${esc(sample.mode)}</div>
          <div class="job__facts"><b>${esc(sample.salary)}</b><span>${esc(sample.exp)}</span><span>${esc(sample.posted)}</span></div>
          <div class="person" style="margin-top:10px;padding:10px;border-radius:10px;background:var(--bg)"><span class="avatar avatar--xs">PR</span><div class="person__text"><b style="font-size:12px">Priya at Cartwheel</b>can refer you</div><span class="chip chip--green">${I.check}Open · ready to refer</span></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;padding-top:24px">
        <button class="btn btn--dark btn--block" data-act="go" data-to="start/1">Get started free</button>
        <button class="btn btn--block" data-act="useSample">Use the sample profile</button>
        <p class="note" style="text-align:center">Your resume and progress stay in this browser.</p>
      </div></div></main>`;
  }

  function onbFrame(step, total, title, sub, inner, foot, back) {
    return `<header class="top top--sub" style="border:0"><a class="icon-btn" href="#/${back}" aria-label="Back">${I.back}</a><div class="top__title"><span>Step ${step} of ${total}</span></div></header>
      <main class="main"><div class="page onb-wrap"><div class="onb-progress" aria-hidden="true">${Array.from({ length: total }, (_, i) => `<i class="${i < step ? "on" : ""}"></i>`).join("")}</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px"><h1 style="font-size:26px">${title}</h1><p class="muted" style="font-size:14px">${sub}</p></div>${inner}
      <div class="desk-only" style="margin-top:8px">${foot}</div></div></main><div class="foot mob-only">${foot}</div>`;
  }

  function vGoal() {
    const c = (k, ic, t, s) => `<button class="choice" aria-pressed="${S.goal[k]}" data-act="goal" data-k="${k}"><span class="choice__ic">${ic}</span><span class="choice__text"><b>${t}</b><span>${s}</span></span><span class="check">${S.goal[k] ? I.check : ""}</span></button>`;
    return onbFrame(1, 3, "What brings you here?", "Pick one or both. You can change it later.",
      `<div style="display:flex;flex-direction:column;gap:12px">${c("find", I.brief, "Find a job", "Daily matches, tailored resumes and referrals.")}${c("refer", I.hand, "Refer people at my company", "Post openings and refer one person at a time.")}</div>
       <div class="info">${I.info}<span>We'll set up your job search first. Referring others needs a verified work email, which you can add in Settings.</span></div>`,
      `<button class="btn btn--dark btn--block" data-act="go" data-to="start/2" ${S.goal.find || S.goal.refer ? "" : "disabled"}>Continue</button>`, "welcome");
  }

  function tagsField(name, label, items, placeholder) {
    return `<div class="field"><span>${label}</span><div class="tags">${items.map((t, i) => `<span class="tag">${esc(t)}<button data-act="untag" data-f="${name}" data-i="${i}" aria-label="Remove ${esc(t)}">${I.x}</button></span>`).join("")}
      <input data-tag="${name}" placeholder="${placeholder}" aria-label="${placeholder}" enterkeyhint="done"></div></div>`;
  }

  function vPrefs() {
    const p = S.prefs;
    return onbFrame(2, 3, "What job are you looking for?", "We rank jobs against your resume every day.",
      `${tagsField("titles", "Job titles", p.titles, "Add a title")}${tagsField("cities", "Locations", p.cities, "Add city")}
       <div class="field"><span>Work type</span><div class="toggle-row">${["Office", "Hybrid", "Remote"].map((w) => `<button class="toggle" aria-pressed="${p.work.includes(w)}" data-act="work" data-w="${w}">${p.work.includes(w) ? "✓ " : ""}${w}</button>`).join("")}</div></div>
       <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><label class="field"><span>Experience (yrs)</span><input class="input" inputmode="numeric" data-pref="exp" value="${esc(p.exp)}"></label>
       <label class="field"><span>Notice period</span><input class="input" data-pref="notice" value="${esc(p.notice)}"></label></div>`,
      `<button class="btn btn--dark btn--block" data-act="go" data-to="start/3" ${p.titles.length ? "" : "disabled"}>Continue</button>`, "start/1");
  }

  let resumeBusy = "";
  function vResumeStep() {
    const r = S.resume;
    const inner = resumeBusy
      ? `<div class="card empty"><div class="spinner spinner--lg"></div><b style="color:var(--ink)">${esc(resumeBusy)}</b><span class="note">Gemini is reading the roles and bullets. This takes about 10 seconds.</span></div>`
      : r
        ? `<div class="card file-row"><span class="file-ic">PDF</span><div class="person__text"><b>${esc(S.resumeFile || "Resume")}</b>${r.experience.length} roles, ${bulletCount(r)} bullets read</div><button class="btn btn--ghost btn--sm" data-act="resetResume" style="color:var(--accent-ink)">Replace</button></div>${paper(r)}`
        : `<div style="display:flex;flex-direction:column;gap:10px">
            <label class="btn btn--block" style="cursor:pointer">${I.upload}Upload resume (PDF or TXT)<input type="file" accept=".pdf,.txt,.md" data-file="resume" class="sr"></label>
            <details class="card" style="padding:12px 14px"><summary style="cursor:pointer;font-weight:700;color:var(--ink)">Paste resume text</summary>
              <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px"><textarea class="textarea" rows="8" id="paste" placeholder="Paste the text of your resume here"></textarea>
              <button class="btn btn--dark" data-act="parsePaste">Read my resume</button></div></details>
            <button class="btn btn--block btn--ghost" data-act="sampleResume" style="color:var(--accent-ink)">Use the sample resume instead</button>
            <div class="info">${I.shield}<span>Phone numbers and emails are left out. Your resume is only sent to the AI to read and tailor it.</span></div></div>`;
    return onbFrame(3, 3, "Add your resume", "Every tailored version starts from this master resume.", inner,
      `<button class="btn btn--dark btn--block" data-act="finishOnb" ${r && !resumeBusy ? "" : "disabled"}>See today's jobs</button>`, "start/2");
  }

  async function parseResume(text, fileName) {
    if (text.trim().length < 80) return toast("That looks too short to be a resume.");
    resumeBusy = "Reading your resume…";
    render();
    try {
      const r = await askJSON(
        `Turn this resume into JSON: {"name","title","links":[short labels like "Portfolio","LinkedIn"],"summary","experience":[{"role","company","dates","bullets":[{"label":short project or area name or "","text"}]}],"education","skills":[]}.\n` +
          `Keep the person's wording. Do not invent anything. Leave out phone numbers, emails and street addresses. Max 4 roles, 5 bullets each.\n\nRESUME:\n${text.slice(0, 10000)}`
      );
      const clean = cleanResume(r);
      if (!clean || !clean.experience.length) throw new Error("Couldn't find any roles in that file.");
      S.resume = clean;
      S.resumeFile = fileName || "Pasted resume";
      S.tailored = {};
      save();
    } catch (e) {
      toast(e.message || "Couldn't read that resume. Try pasting the text.");
    }
    resumeBusy = "";
    render();
  }

  async function readFile(file) {
    if (!file) return;
    if (/\.pdf$/i.test(file.name)) {
      resumeBusy = "Opening your PDF…";
      render();
      try {
        const lib = await loadPdfJs();
        const doc = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
        let text = "";
        for (let p = 1; p <= Math.min(doc.numPages, 3); p++) {
          const page = await doc.getPage(p);
          const c = await page.getTextContent();
          text += c.items.map((i) => i.str + (i.hasEOL ? "\n" : " ")).join("") + "\n";
        }
        resumeBusy = "";
        if (text.trim().length < 80) {
          render();
          return toast("This PDF looks like an image. Paste the text instead.");
        }
        return parseResume(text, file.name);
      } catch {
        resumeBusy = "";
        render();
        return toast("Couldn't open that PDF. Try pasting the text.");
      }
    }
    parseResume(await file.text(), file.name);
  }
  let pdfjs;
  function loadPdfJs() {
    if (pdfjs) return pdfjs;
    pdfjs = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(window.pdfjsLib);
      };
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return pdfjs;
  }

  // ---------- Jobs ----------
  let jobsTab = "new";
  let jobsQuery = "";
  let onlyRefs = false;
  function refSignal(j) {
    const rs = j.referrers.map(ref);
    if (!rs.length) return "";
    const open = rs.filter((r) => r.open && !requestFor(r.id)).length;
    if (open) return `<div class="job__ref"><span class="avatar avatar--xs">${rs[0].initials}</span>${rs.length > 1 ? `${rs.length} people here can refer you · ${open} open now` : "1 person here can refer you · open now"}</div>`;
    return `<div class="job__ref job__ref--busy"><span class="avatar avatar--xs">${rs[0].initials}</span>${rs.length} referrer${rs.length > 1 ? "s" : ""} · ${requestFor(rs[0].id) ? "request sent" : "referring someone now"}</div>`;
  }
  function jobCard(j) {
    const s = score(S.resume, j);
    return `<a class="card job" href="#/job/${j.id}"><div class="job__head"><span class="job__logo" aria-hidden="true">${esc(j.company[0])}</span><div class="job__body">
      <div class="job__head"><div class="job__title">${esc(j.title)} ${j.dream ? '<span class="chip chip--blue" style="height:22px;vertical-align:2px">Dream company</span>' : ""}</div><span class="match ${s < 80 ? "match--mid" : ""}">${s}%<span class="desk-only"> match</span></span></div>
      <div class="job__meta">${esc(j.company)} · ${esc(j.city)} · ${esc(j.mode)}</div>
      <div class="job__facts"><b>${esc(j.salary)}</b><span>${esc(j.exp)}</span><span>${esc(j.posted)}</span><span class="desk-only">via ${esc(j.via)}</span></div>
      ${refSignal(j)}</div></div></a>`;
  }
  function vJobs() {
    const st = (j) => S.status[j.id] || "new";
    const counts = { new: 0, applied: 0, skipped: 0 };
    D.jobs.forEach((j) => counts[st(j)]++);
    const q = jobsQuery.toLowerCase();
    const list = D.jobs
      .filter((j) => st(j) === jobsTab)
      .filter((j) => !q || `${j.title} ${j.company} ${j.city} ${j.keywords.join(" ")}`.toLowerCase().includes(q))
      .filter((j) => !onlyRefs || j.referrers.length)
      .sort((a, b) => score(S.resume, b) - score(S.resume, a));
    const u = usage();
    const tab = (k, l) => `<button class="${jobsTab === k ? "on" : ""}" data-act="jobsTab" data-k="${k}">${l} · ${counts[k]}</button>`;
    const body = `<div class="page">
      <div class="page-head desk-only"><div><h1>Today's jobs</h1><p class="muted" style="margin-top:4px">${D.jobs.length} matches for ${esc(S.prefs.titles.slice(0, 2).join(", "))}. Ranked against your resume.</p></div><a class="btn btn--sm" href="#/start/2">${I.filter}Preferences</a></div>
      <div class="search mob-only">${I.search}<input type="search" placeholder="Search title, company or skill" value="${esc(jobsQuery)}" data-input="jobsQuery" aria-label="Search jobs"><button class="icon-btn" style="width:32px;height:32px" data-act="toggleRefs" aria-label="Only jobs with referrers" aria-pressed="${onlyRefs}">${I.filter}</button></div>
      <div class="tabs">${tab("new", "New")}${tab("applied", "Applied")}${tab("skipped", "Skipped")}</div>
      <div class="desk-only" style="display:flex;gap:10px"><div class="search" style="flex:1">${I.search}<input type="search" placeholder="Search title, company or skill" value="${esc(jobsQuery)}" data-input="jobsQuery" aria-label="Search jobs"></div><button class="toggle" aria-pressed="${onlyRefs}" data-act="toggleRefs">Has referrers</button></div>
      <div class="mob-only" style="display:flex;align-items:center;justify-content:space-between;font-size:12px;font-weight:600;color:var(--ink)"><span style="display:flex;align-items:center;gap:6px"><i style="width:7px;height:7px;border-radius:50%;background:var(--green)"></i>${LIMITS.tailor - u.tailor} of ${LIMITS.tailor} tailorings left</span>${onlyRefs ? '<span class="chip chip--green">Has referrers</span>' : ""}</div>
      <div class="list" id="jobList">${list.length ? list.map(jobCard).join("") : emptyJobs()}</div></div>`;
    return shell({ tab: "jobs", mob: mobTop("Today's jobs", `${counts.new} matches · ranked against your resume`), body });
  }
  function emptyJobs() {
    const m = { new: ["All caught up", "You've looked at every job for today. New matches arrive tomorrow morning."], applied: ["Nothing applied yet", "Jobs you mark as applied show up here, with the resume you sent."], skipped: ["No skipped jobs", "Skip jobs that aren't right and they'll stop showing up."] }[jobsTab];
    return `<div class="card empty">${I.jobs}<b style="color:var(--ink)">${jobsQuery ? "No jobs match that search" : m[0]}</b><span class="note">${jobsQuery ? "Try a different title, company or skill." : m[1]}</span></div>`;
  }

  // ---------- Job detail ----------
  const requestFor = (refId) => S.requests.find((r) => r.refId === refId && r.status === "waiting");
  function referrerBlock(j, compact) {
    const rs = j.referrers.map(ref);
    if (!rs.length)
      return `<div class="card ref-card"><b style="color:var(--ink)">No referrers at ${esc(j.company)} yet</b><p class="note">You can still apply directly. We'll tell you if someone from ${esc(j.company)} starts referring.</p></div>`;
    const openR = rs.find((r) => r.open && !requestFor(r.id));
    return `<div class="card ref-card"><div style="display:flex;justify-content:space-between;align-items:center"><b style="color:var(--ink);font-size:14px">Get referred at ${esc(j.company.split(" ")[0])}</b><span class="chip" style="background:#fff">${rs.length} referrer${rs.length > 1 ? "s" : ""}</span></div>
      ${rs.map((r) => { const req = requestFor(r.id); return `<a class="person" href="#/profile/${r.id}"><span class="avatar">${r.initials}</span><div class="person__text"><b>${esc(r.name)}</b>${esc(r.role)} · ${esc(r.replies)}<span style="margin-top:6px">${req ? `<span class="chip chip--blue">Request sent</span>` : r.open ? `<span class="chip chip--green">${I.check}Open · ready to refer</span>` : `<span class="chip chip--amber">${I.clock}In use · referring someone</span>`}</span></div></a>`; }).join("")}
      ${openR ? `<button class="btn ${compact ? "" : "btn--dark"} btn--block" data-act="askRef" data-ref="${openR.id}" data-job="${j.id}">${I.hand}Ask ${esc(openR.name.split(" ")[0])} for a referral</button>` : rs.some((r) => !r.open) ? `<button class="btn btn--block" data-act="notifyMe" data-job="${j.id}">${I.bell}${S.notifyMe[j.id] ? "We'll tell you when it opens" : "Notify me when a slot opens"}</button>` : ""}
      ${compact ? "" : `<p class="note">Tip: tailor your resume first. Referrers see the version you send.</p>`}</div>`;
  }
  function vJob(id) {
    const j = job(id);
    if (!j) return vNotFound();
    const { have, missing } = haveMissing(S.resume, j);
    const s = score(S.resume, j);
    const t = S.tailored[id];
    const u = usage();
    const left = LIMITS.tailor - u.tailor;
    const tailorBtn = t
      ? `<a class="btn btn--dark btn--block" href="#/tailored/${id}">${I.doc}Open tailored resume</a>`
      : `<button class="btn btn--dark btn--block" data-act="tailor" data-job="${id}" ${left > 0 ? "" : "disabled"}>${I.wand}Tailor resume to this job</button>`;
    const facts = `<div class="chips"><span class="match">${s}% match</span><span class="chip">${esc(j.salary)}</span><span class="chip">${esc(j.exp)}</span><span class="chip">Posted ${esc(j.posted)}</span></div>`;
    const kw = `<div style="display:grid;gap:14px" class="kw-grid">
      <div style="display:flex;flex-direction:column;gap:8px"><span class="label" style="color:var(--green)">Already in your resume</span><div class="chips">${have.map((k) => `<span class="chip chip--green">${esc(k)}</span>`).join("") || '<span class="note">None of the asked skills yet</span>'}</div></div>
      ${missing.length ? `<div style="display:flex;flex-direction:column;gap:8px"><span class="label" style="color:var(--accent-ink)">Asked for, not in your resume</span><div class="chips">${missing.map((k) => `<span class="chip chip--accent">${esc(k)}</span>`).join("")}</div></div>` : ""}</div>`;
    const about = `<div class="prose"><h3>About the role</h3><p>${esc(j.about)}</p><h3 style="margin-top:14px">What you'll do</h3><ul>${j.do.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><h3 style="margin-top:14px">What we're looking for</h3><ul>${j.want.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
    const status = S.status[id];
    const actions = `<div style="display:flex;flex-wrap:wrap;gap:8px"><button class="btn btn--sm" data-act="openPosting" data-job="${id}">${I.ext}Open original posting</button>
      <button class="btn btn--sm" data-act="setStatus" data-job="${id}" data-s="${status === "applied" ? "new" : "applied"}">${status === "applied" ? "Applied ✓ · Undo" : "Mark as applied"}</button>
      <button class="btn btn--sm" data-act="setStatus" data-job="${id}" data-s="${status === "skipped" ? "new" : "skipped"}">${status === "skipped" ? "Skipped · Undo" : "Skip"}</button></div>`;
    const body = `<div class="page"><div class="split">
      <div style="display:flex;flex-direction:column;gap:18px">
        <section class="card detail-card">
          <div class="job__head"><span class="job__logo" style="width:52px;height:52px;font-size:20px">${esc(j.company[0])}</span><div style="flex:1;display:flex;flex-direction:column;gap:4px"><h1 style="font-size:24px">${esc(j.title)}</h1><span class="muted">${esc(j.company)} · ${esc(j.city)} · ${esc(j.mode)}</span></div></div>
          ${facts}${actions}
          <div class="card file-row" style="background:var(--bg)">${I.mail}<div class="person__text"><b style="font-size:13px">${esc(j.email)}</b>Found on the company's careers page</div><button class="btn btn--sm" data-act="copy" data-text="${esc(j.email)}">Copy</button></div>
          <div class="mob-only">${referrerBlock(j, true)}</div>
          ${kw}<hr style="border:0;border-top:1px solid var(--line);margin:0">${about}
        </section>
      </div>
      <aside class="desk-only" style="flex-direction:column;gap:16px">${referrerBlock(j)}
        <div><h3 style="font-size:16px">Your resume</h3><p class="note">${t ? "Tailored version" : "Master version"}</p></div>${paper(t ? t.resume : S.resume)}
        ${tailorBtn}<p class="note" style="text-align:center">Uses 1 of ${left} tailorings left today</p></aside>
    </div></div>`;
    return shell({
      tab: "jobs",
      crumb: ["jobs", "Back to jobs"],
      mob: subTop("jobs", j.title, `${j.company} · ${j.city} · ${j.mode}`, `<button class="icon-btn" data-act="openPosting" data-job="${id}" aria-label="Open original posting">${I.ext}</button>`),
      body,
      foot: `${tailorBtn}<p class="note" style="text-align:center">${t ? "Saved for this job" : `Uses 1 of ${left} tailorings left today`}</p>`,
      nav: false,
    });
  }

  // ---------- Tailoring ----------
  let tailorRun = null;
  async function tailor(id) {
    const j = job(id);
    const u = usage();
    if (u.tailor >= LIMITS.tailor) return go(`limit`);
    tailorRun = { id, step: 0, error: "" };
    go(`tailoring/${id}`);
    const tick = setInterval(() => {
      if (tailorRun && tailorRun.step < 2) {
        tailorRun.step++;
        if (location.hash === `#/tailoring/${id}`) render();
      }
    }, 2200);
    try {
      const master = S.resume;
      const ls = lines(master);
      const out = await askJSON(
        `JOB: ${j.title} at ${j.company} (${j.city}, ${j.mode}).\nAbout: ${j.about}\nDuties: ${j.do.join("; ")}\nWants: ${j.want.join("; ")}\nKeywords: ${j.keywords.join(", ")}\n\n` +
          `RESUME LINES (path: text):\n${ls.map((l) => `${l.path}: ${l.text}`).join("\n")}\nSkills: ${master.skills.join(", ")}\n\n` +
          `Suggest 2 to 4 rewrites of existing lines so they use this job's language, only where it stays true to what the line already says. Keep each rewrite about the same length.\n` +
          `Also list up to 2 skills or keywords the job asks for that the resume does not show at all, as questions.\n` +
          `Return JSON: {"suggestions":[{"path":one of the paths above,"after":new text,"why":short reason that names the job's wording}],"questions":[{"skill":string,"question":"The job asks for X. It isn't in your resume, so I didn't add it. Have you used it?"}]}`
      );
      tailorRun.step = 3;
      const suggestions = (out.suggestions || [])
        .filter((s) => s && typeof s.path === "string" && typeof getPath(master, s.path) === "string" && s.after && s.after !== getPath(master, s.path))
        .slice(0, 4)
        .map((s, k) => ({ id: k, path: s.path, label: (ls.find((l) => l.path === s.path) || {}).label || "Line", before: getPath(master, s.path), after: String(s.after), why: String(s.why || ""), state: "pending" }));
      const questions = (out.questions || []).filter((q) => q && q.skill).slice(0, 2).map((q) => ({ skill: String(q.skill), question: String(q.question || `The job asks for ${q.skill}. It isn't in your resume. Have you used it?`), answer: null }));
      if (!suggestions.length && !questions.length) throw new Error("The AI didn't find anything to change. Your resume may already fit this job well.");
      usage().tailor++;
      S.tailored[id] = { resume: clone(master), suggestions, questions, edited: [], history: [], chat: [], refines: 0, changed: [], at: Date.now() };
      save();
      clearInterval(tick);
      tailorRun = null;
      go(`tailored/${id}`);
    } catch (e) {
      clearInterval(tick);
      tailorRun = { id, step: 0, error: e.message || "Something went wrong." };
      render();
    }
  }
  function vTailoring(id) {
    const j = job(id);
    const run = tailorRun && tailorRun.id === id ? tailorRun : { step: 0, error: "" };
    const st = (k, label) => `<div class="step ${run.step > k ? "done" : run.step === k ? "now" : "todo"}"><i>${run.step > k ? I.check : ""}</i>${label}</div>`;
    const body = run.error
      ? `<div class="page page--narrow"><div class="card empty">${I.info}<h2 style="font-size:20px">Couldn't tailor this one</h2><p class="note">${esc(run.error)}</p><p class="note">This didn't use up a tailoring.</p>
          <div style="display:flex;gap:8px"><a class="btn" href="#/job/${id}">Back to job</a><button class="btn btn--dark" data-act="tailor" data-job="${id}">Try again</button></div></div></div>`
      : `<div class="page page--narrow" style="align-items:center;text-align:center;padding-top:48px"><div class="spinner spinner--lg"></div><h2 style="font-size:22px">Tailoring your resume</h2><span class="muted">Usually takes about 10 seconds</span>
          <div class="card steps" style="align-self:stretch">${st(0, "Reading the job description")}${st(1, "Matching keywords to your resume")}${st(2, "Writing suggestions")}${st(3, "Checking it still fits one page")}</div></div>`;
    return shell({ tab: "jobs", crumb: [`job/${id}`, `${j.title}, ${j.company.split(" ")[0]}`], mob: subTop(`job/${id}`, "Tailoring resume", `${j.title} · ${j.company}`), body, foot: run.error ? "" : `<a class="btn btn--block" href="#/job/${id}">Cancel</a>`, nav: false });
  }

  function applyAll(t) {
    const r = clone(t.resume);
    t.suggestions.forEach((s) => setPath(r, s.path, s.after));
    return r;
  }
  function vTailored(id) {
    const j = job(id);
    const t = S.tailored[id];
    if (!t) return vJob(id);
    const before = score(S.resume, j);
    const now = score(t.resume, j);
    const ifAll = score(applyAll(t), j);
    const pending = t.suggestions.filter((s) => s.state === "pending").length;
    const hl = new Set([...t.suggestions.filter((s) => s.state === "accepted").map((s) => s.path), ...t.edited]);
    const hlNew = new Set(t.changed || []);
    const r0 = j.referrers.map(ref).find((r) => r.open && !requestFor(r.id));
    const sugg = t.suggestions
      .map(
        (s) => `<div class="card sugg"><div class="sugg__head"><span>${esc(s.label)}</span>${s.state === "accepted" ? `<span class="sugg__ok">✓ Accepted</span>` : s.state === "rejected" ? `<span class="sugg__no">Kept original</span>` : ""}</div>
        <div class="before">${esc(s.before)}</div><div class="after">${esc(s.after)}</div>${s.why ? `<div class="why">${esc(s.why)}</div>` : ""}
        <div style="display:flex;gap:8px">${s.state === "pending" ? `<button class="btn btn--dark btn--sm" data-act="sugg" data-job="${id}" data-i="${s.id}" data-s="accepted">Accept</button><button class="btn btn--sm" data-act="sugg" data-job="${id}" data-i="${s.id}" data-s="rejected">Reject</button>` : `<button class="btn btn--sm btn--ghost" data-act="sugg" data-job="${id}" data-i="${s.id}" data-s="pending">${I.undo}Undo</button>`}</div></div>`
      )
      .join("");
    const qs = t.questions
      .map(
        (q, k) => `<div class="card ask-card"><h3>Needs your answer</h3><p>${esc(q.question)}</p>${q.answer == null ? `<div style="display:flex;gap:8px"><button class="btn btn--sm" data-act="answer" data-job="${id}" data-i="${k}" data-a="yes">Yes, add it</button><button class="btn btn--sm" data-act="answer" data-job="${id}" data-i="${k}" data-a="no">No, leave it out</button></div>` : `<span class="note">${q.answer === "yes" ? `Added ${esc(q.skill)} to your skills.` : `Left out. Good call if you haven't used it.`}</span>`}</div>`
      )
      .join("");
    const left = `<div style="display:flex;flex-direction:column;gap:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><span style="font-size:14px">Match ${before}% → <b style="color:var(--green)">${now}%</b>${pending ? ` <span class="muted">(${ifAll}% if you accept all)</span>` : ""}</span>${pending ? `<button class="btn btn--sm" data-act="acceptAll" data-job="${id}">Accept all</button>` : ""}</div>
      ${sugg}${qs}
      ${r0 ? `<div class="info">${I.info}<span style="flex:1">Send this version to ${esc(r0.name.split(" ")[0])} with a referral request.</span><button class="btn btn--sm" data-act="askRef" data-ref="${r0.id}" data-job="${id}">Ask</button></div>` : ""}</div>`;
    const right = `<div style="display:flex;flex-direction:column;gap:12px"><div class="desk-only" style="justify-content:space-between;align-items:flex-start;gap:12px"><div><h2 style="font-size:18px">Tailored for ${esc(j.company)}</h2><p class="note">Changes are highlighted. Click any line to edit it.</p></div><button class="btn btn--dark" data-act="download" data-job="${id}">${I.download}Download PDF</button></div>
      <span class="label mob-only">Preview · tap a line to edit</span>${paper(t.resume, { hl, hlNew, edit: true })}
      <a class="btn btn--block desk-only" href="#/chat/${id}" style="display:flex">${I.msgs}Refine with chat</a></div>`;
    const body = `<div class="page"><div class="split split--left">${left}${right}</div></div>`;
    return shell({
      tab: "jobs",
      crumb: [`job/${id}`, `${j.title}, ${j.company.split(" ")[0]}`],
      mob: subTop(`job/${id}`, "Tailored resume", `${j.company} · ${before}% → ${now}%`, `<button class="btn btn--dark btn--sm" data-act="download" data-job="${id}">${I.download}PDF</button>`),
      body,
      foot: `<a class="btn btn--accent btn--block" href="#/chat/${id}">${I.msgs}Refine with chat</a>`,
      nav: false,
    });
  }

  // ---------- Refine chat ----------
  let chatBusy = false;
  async function refine(id, message) {
    const j = job(id);
    const t = S.tailored[id];
    const u = usage();
    if (!message.trim() || chatBusy) return;
    if (t.refines >= LIMITS.refinePerJob || u.refine >= LIMITS.refineDay) return toast("No refinements left for this job. Edit lines by hand instead.");
    t.chat.push({ from: "me", text: message.trim() });
    chatBusy = true;
    save();
    render();
    try {
      const out = await askJSON(
        `JOB: ${j.title} at ${j.company}. Keywords: ${j.keywords.join(", ")}\n\nCURRENT RESUME JSON:\n${JSON.stringify(t.resume)}\n\nTHE PERSON ASKS: "${message.trim()}"\n\n` +
          `Make the changes they ask for. If something they ask would add a claim, title, number or skill the resume doesn't support, don't add it: say so plainly and use the closest true wording from their resume instead. ` +
          `Keep it one page: max 4 roles, 5 bullets each, summary under 45 words. Keep the same JSON shape and keep name and links unchanged.\n` +
          `Return JSON: {"reply":"2 to 4 sentences saying what you changed, naming the lines, and anything you didn't do and why. End with whether it still fits one page.","resume":{same shape}}`
      );
      const next = cleanResume(out.resume);
      if (!next || !next.experience.length) throw new Error("The AI sent back a broken resume, so nothing changed. Try again.");
      next.name = t.resume.name;
      next.links = t.resume.links;
      const changed = lines(next).filter((l) => getPath(t.resume, l.path) !== l.text).map((l) => l.path);
      t.history.push(clone(t.resume));
      t.resume = next;
      t.changed = changed;
      t.refines++;
      usage().refine++;
      t.chat.push({ from: "ai", text: String(out.reply || "Done."), undo: true });
    } catch (e) {
      t.chat.push({ from: "ai", text: e.message || "Couldn't make that change. Try again.", error: true });
    }
    chatBusy = false;
    save();
    render();
    const box = $("#chatBox");
    if (box) box.scrollTop = box.scrollHeight;
  }
  function vChat(id) {
    const j = job(id);
    const t = S.tailored[id];
    if (!t) return vJob(id);
    const left = LIMITS.refinePerJob - t.refines;
    const lastUndo = t.chat.map((m, k) => (m.undo ? k : -1)).filter((k) => k >= 0).pop();
    const msgs = t.chat.length
      ? t.chat.map((m, k) => `<div class="bubble ${m.from === "me" ? "bubble--me" : ""}" ${m.error ? 'style="background:#fdecea;color:var(--red)"' : ""}>${esc(m.text)}${m.undo && k === lastUndo && t.history.length ? `<div style="margin-top:8px"><button class="btn btn--sm" data-act="undo" data-job="${id}">${I.undo}Undo these changes</button></div>` : ""}</div>`).join("")
      : `<div class="bubble">Tell me what to change, like “move ModernCart above Cart Abandonment Recovery” or “mention checkout earlier in the summary”. I'll only use what's already true in your resume.</div>`;
    const composer = `<div class="info" style="font-size:12px">${I.msgs}<span><b>Put all your changes in one message.</b> Each send uses 1 of your ${left} refinements left for this job.</span></div>
        <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="quick" data-act="quick" data-text="Make the summary shorter">+ Shorter summary</button><button class="quick" data-act="quick" data-text="Use more of the job description's keywords where it's true">+ More JD keywords</button><button class="quick" data-act="quick" data-text="Move the most relevant bullet for this job to the top of its role">+ Move a bullet up</button></div>
        <form class="composer" data-form="chat" data-job="${id}"><textarea class="textarea" rows="2" name="msg" aria-label="Your changes" placeholder="e.g. 1) Shorten the summary  2) Move ModernCart up  3) Use the word stakeholders" ${left > 0 ? "" : "disabled"}></textarea><button class="send" aria-label="Send" ${chatBusy || left <= 0 ? "disabled" : ""}>${I.send}</button></form>`;
    const panel = `<div class="card chat-panel">
      <div class="desk-only" style="padding:16px 18px;border-bottom:1px solid var(--line);justify-content:space-between;align-items:flex-start"><div><b style="color:var(--ink)">Refine this resume</b><p class="note">For ${esc(j.company)} only</p></div><div style="width:110px;display:flex;flex-direction:column;gap:6px;align-items:flex-end"><b style="font-size:12px;color:var(--ink)">${left} of ${LIMITS.refinePerJob} left</b><div class="progress" style="width:100%"><i style="width:${(left / LIMITS.refinePerJob) * 100}%"></i></div></div></div>
      <div class="chat" id="chatBox" style="overflow-y:auto">${msgs}${chatBusy ? `<div class="bubble" style="display:flex;align-items:center;gap:10px"><span class="spinner"></span>Updating your resume…</div>` : ""}</div>
      <div class="desk-only" style="padding:12px 14px 14px;border-top:1px solid var(--line);flex-direction:column;gap:10px">${composer}</div></div>`;
    const hl = new Set(t.changed || []);
    const body = `<div class="page chat-page"><div class="split split--chat" style="flex:1">
      <div class="desk-only" style="flex-direction:column;gap:12px"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><h2 style="font-size:18px">Tailored for ${esc(j.company)}</h2><p class="note">Changes from chat are highlighted</p></div><button class="btn btn--dark" data-act="download" data-job="${id}">${I.download}Download PDF</button></div>${paper(t.resume, { hlNew: hl })}</div>
      <div class="mob-only"><a class="card file-row" href="#/tailored/${id}" style="text-decoration:none;color:inherit"><span class="file-ic" style="background:#fff;border:1px solid var(--line);border-top:3px solid var(--accent)"></span><div class="person__text"><b>View updated resume</b>${t.changed?.length ? `${t.changed.length} changes · ` : ""}${bulletCount(t.resume)} bullets</div>${I.next}</a></div>
      ${panel}</div></div>`;
    return shell({
      tab: "jobs",
      crumb: [`tailored/${id}`, "Back to suggestions"],
      mob: subTop(`tailored/${id}`, "Refine resume", `${j.company} only`, `<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;padding-right:6px"><b style="font-size:12px;color:var(--ink)">${left} of ${LIMITS.refinePerJob} left</b><div class="progress" style="width:90px"><i style="width:${(left / LIMITS.refinePerJob) * 100}%"></i></div></div>`),
      body,
      foot: composer,
      nav: false,
    });
  }

  // ---------- Resumes ----------
  function vResumes() {
    const versions = Object.entries(S.tailored);
    const body = `<div class="page page--narrow">
      <div class="page-head desk-only"><div><h1>Resumes</h1><p class="muted">Referrers see the version you send.</p></div></div>
      <div class="card file-row"><span class="file-ic" style="background:#fff;border:1px solid var(--line);border-top:3px solid var(--accent)"></span><div class="person__text"><b>${esc(S.resume.name)} <span class="chip chip--accent" style="height:20px">Master</span></b>${esc(S.resumeFile)} · ${S.resume.experience.length} roles, ${bulletCount(S.resume)} bullets</div>
        <button class="icon-btn" data-act="downloadMaster" aria-label="Download master resume">${I.download}</button></div>
      <button class="btn btn--sm" style="align-self:flex-start" data-act="replaceResume">${I.upload}Replace master resume</button>
      <span class="label">Tailored versions</span>
      ${versions.length ? versions.map(([id, t]) => { const j = job(id); const req = S.requests.find((r) => r.jobId === id); return `<div class="card file-row"><span class="file-ic" style="background:#fff;border:1px solid var(--line);border-top:3px solid var(--accent)"></span><a class="person__text" href="#/tailored/${id}" style="text-decoration:none"><b>${esc(j.company)}</b>${score(t.resume, j)}% match${req ? ` · sent to ${esc(ref(req.refId).name.split(" ")[0])}` : ""}</a><button class="icon-btn" data-act="download" data-job="${id}" aria-label="Download ${esc(j.company)} resume">${I.download}</button></div>`; }).join("") : `<div class="card empty">${I.doc}<b style="color:var(--ink)">No tailored versions yet</b><span class="note">Open a job and tap Tailor resume. Each version is saved here.</span><a class="btn btn--sm" href="#/jobs">See today's jobs</a></div>`}
    </div>`;
    return shell({ tab: "resumes", mob: mobTop("Resumes", "Referrers see the version you send"), body });
  }

  // ---------- Referrals ----------
  function openings() {
    return D.jobs.flatMap((j) => j.referrers.map((rid) => ({ j, r: ref(rid) })));
  }
  let refsTab = "get";
  function vReferrals(tabArg) {
    if (tabArg) refsTab = tabArg;
    const active = S.requests.filter((r) => r.status === "waiting");
    const tab = (k, l) => `<button class="${refsTab === k ? "on" : ""}" data-act="refsTab" data-k="${k}">${l}</button>`;
    let inner = "";
    if (refsTab === "get") {
      inner = openings()
        .map(({ j, r }) => {
          const req = requestFor(r.id);
          return `<div class="card" style="padding:14px;display:flex;flex-direction:column;gap:10px"><a href="#/opening/${r.id}/${j.id}" style="display:flex;gap:12px;text-decoration:none;color:inherit"><span class="job__logo" style="display:flex">${esc(j.company[0])}</span><div style="flex:1;display:flex;flex-direction:column;gap:3px"><b style="color:var(--ink)">${esc(j.title)}</b><span class="note" style="font-size:13px">${esc(j.company)} · ${esc(j.city)} · ${esc(j.mode)}</span>
            <span style="display:flex;align-items:center;gap:6px;font-size:12px"><span class="avatar avatar--xs">${r.initials}</span><b style="color:var(--ink)">${esc(r.name)}</b><span class="muted">· ${esc(r.role)}</span><span style="color:var(--green)">${I.shield}</span></span></div></a>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">${req ? `<span class="chip chip--blue">Request sent · ${daysLeft(req)} days left</span><a class="btn btn--sm" href="#/requests">View</a>` : r.open ? `<span class="chip chip--green">${I.check}Open · ready to refer</span><button class="btn btn--dark btn--sm" data-act="askRef" data-ref="${r.id}" data-job="${j.id}">Request</button>` : `<span class="chip chip--amber">${I.clock}In use · referring someone</span><button class="btn btn--sm" data-act="notifyMe" data-job="${j.id}">${S.notifyMe[j.id] ? "We'll tell you" : "Notify me"}</button>`}</div></div>`;
        })
        .join("");
    } else if (refsTab === "requests") {
      inner = `<div class="stats"><div class="card stat"><b>${active.length}</b><span>Active</span></div><div class="card stat"><b>${S.requests.filter((r) => r.status === "interviewing").length}</b><span>Interviewing</span></div><div class="card stat"><b>${LIMITS.active - active.length}</b><span>Slots left of ${LIMITS.active}</span></div></div>
        ${S.requests.length ? `<span class="label">Your requests</span>${S.requests.slice().reverse().map(reqCard).join("")}` : `<div class="card empty">${I.refs}<b style="color:var(--ink)">No requests yet</b><span class="note">Ask someone at a company you like. You can have ${LIMITS.active} requests open at a time.</span><button class="btn btn--sm" data-act="refsTab" data-k="get">Find referrers</button></div>`}
        <span class="label">Closed</span><div class="card" style="padding:14px;display:flex;gap:12px"><span class="avatar">VP</span><div style="flex:1;display:flex;flex-direction:column;gap:3px"><b style="color:var(--ink)">Product Designer, Growth</b><span class="note" style="font-size:13px">Orbit Logistics · Vikram P.</span><span class="note">No reply in 7 days</span><span class="chip" style="align-self:flex-start">Expired · no reply in 7 days</span></div></div>`;
    } else {
      const g = S.giving;
      inner = `<div class="stats"><div class="card stat"><b>${g.filter((x) => x.status === "open").length}</b><span>Open</span></div><div class="card stat"><b>${g.reduce((n, x) => n + (x.waiting || 0), 0)}</b><span>Waiting</span></div><div class="card stat"><b>6</b><span>Referred</span></div></div>
        ${g.some((x) => x.waiting) ? `<div class="info info--amber">${I.clock}<span style="flex:1"><b>${g.reduce((n, x) => n + (x.waiting || 0), 0)} requests waiting.</b> The oldest expires in 3 days.</span><button class="btn btn--sm" data-act="review">Review</button></div>` : ""}
        ${g.map((x) => `<div class="card" style="padding:14px;display:flex;flex-direction:column;gap:6px"><b style="color:var(--ink)">${esc(x.title)}</b><span class="note" style="font-size:13px">${esc(x.meta)}</span>${x.waiting ? `<span style="font-size:12px;color:var(--blue);font-weight:600">${x.waiting} waiting · first in line: ${esc(x.first)}</span>` : ""}${x.status === "open" ? `<span class="chip chip--green" style="align-self:flex-start">${I.check}Open · ready to refer</span>` : x.status === "inuse" ? `<span class="chip chip--amber" style="align-self:flex-start">${I.clock}In use · referring someone</span>` : `<span class="chip" style="align-self:flex-start">${I.lock}Closed · position filled</span>`}</div>`).join("")}
        <button class="btn btn--accent" data-act="postOpening" style="align-self:flex-end">${I.plus}Post opening</button>`;
    }
    const body = `<div class="page page--narrow"><div class="page-head desk-only"><div><h1>Referrals</h1><p class="muted">One person per opening at a time, first come first served.</p></div></div>
      <div class="tabs">${tab("get", "Get referred")}${tab("requests", `My requests · ${active.length}`)}${tab("give", "Give")}</div><div class="list">${inner}</div></div>`;
    return shell({ tab: "referrals", mob: mobTop("Referrals"), body });
  }
  const daysLeft = (req) => Math.max(0, 7 - Math.floor((Date.now() - req.at) / 864e5));
  function reqCard(q) {
    const j = job(q.jobId);
    const r = ref(q.refId);
    return `<div class="card" style="padding:14px;display:flex;gap:12px"><span class="avatar">${r.initials}</span><div style="flex:1;display:flex;flex-direction:column;gap:3px"><b style="color:var(--ink)">${esc(j.title)}</b><span class="note" style="font-size:13px">${esc(j.company)} · ${esc(r.name)}</span><span class="note">Sent ${new Date(q.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · ${esc(q.resumeLabel)}</span>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${q.status === "waiting" ? `<span class="chip chip--blue">Waiting for reply · ${daysLeft(q)} days left</span><button class="btn btn--sm btn--ghost" data-act="withdraw" data-id="${q.id}">Withdraw</button>` : `<span class="chip">Withdrawn</span>`}</div></div></div>`;
  }
  function vOpening(rid, jid) {
    const r = ref(rid);
    const j = job(jid);
    if (!r || !j) return vNotFound();
    const t = S.tailored[jid];
    const res = t ? t.resume : S.resume;
    const req = requestFor(rid);
    const looks = r.looks.map((k) => `<span class="chip ${hasKw(resumeText(res), k) ? "chip--green" : "chip--accent"}">${esc(k)}</span>`).join("");
    const btn = req
      ? `<a class="btn btn--block" href="#/requests">Request sent · ${daysLeft(req)} days left</a>`
      : r.open
        ? `<button class="btn btn--dark btn--block" data-act="askRef" data-ref="${rid}" data-job="${jid}">${I.hand}Request referral</button>`
        : `<button class="btn btn--block" data-act="notifyMe" data-job="${jid}">${I.bell}${S.notifyMe[jid] ? "We'll tell you when it opens" : "Notify me when it opens"}</button>`;
    const body = `<div class="page page--narrow">
      <div style="display:flex;flex-direction:column;gap:6px"><h1 style="font-size:24px">${esc(j.title)}</h1><span class="muted">${esc(j.company)} · ${esc(j.city)} · ${esc(j.mode)}</span>
      <div class="chips">${r.open ? `<span class="chip chip--green">${I.check}Open · ready to refer</span>` : `<span class="chip chip--amber">${I.clock}In use</span>`}<span class="chip">${esc(j.exp)}</span><span class="chip">Posted ${esc(j.posted)}</span></div></div>
      <a class="card person" href="#/profile/${rid}" style="padding:14px"><span class="avatar" style="width:44px;height:44px">${r.initials}</span><div class="person__text"><b>${esc(r.name)}</b>${esc(r.role)} at ${esc(r.company)}<span style="display:flex;gap:6px;margin-top:6px"><span class="chip chip--green">${I.shield}Verified</span><span class="chip">${r.referred} referred · ${r.hired} hired</span></span></div></a>
      <div style="display:flex;flex-direction:column;gap:8px"><h3 style="font-size:16px">Note from ${esc(r.name.split(" ")[0])}</h3><p style="font-size:14px;line-height:1.55">${esc(r.note)}</p></div>
      <div style="display:flex;flex-direction:column;gap:8px"><span class="label">What ${esc(r.name.split(" ")[0])} looks for</span><div class="chips">${looks}</div><span class="note">Green = already in your ${t ? "tailored " : ""}resume</span></div>
      <div class="info">${I.info}<span><b>How it works:</b> one person per opening at a time, first come first served. It reopens if they aren't selected, withdraw, or nobody replies for 7 days.</span></div>
      <div class="desk-only" style="flex-direction:column;gap:6px">${btn}<p class="note" style="text-align:center">${LIMITS.active - S.requests.filter((x) => x.status === "waiting").length} of ${LIMITS.active} active requests left</p></div></div>`;
    return shell({ tab: "referrals", crumb: ["referrals", "Back to referrals"], mob: subTop("referrals", "Referral opening", j.company), body, foot: `${btn}<p class="note" style="text-align:center">${LIMITS.active - S.requests.filter((x) => x.status === "waiting").length} of ${LIMITS.active} active requests left</p>`, nav: false });
  }

  function vProfile(rid) {
    const r = ref(rid);
    if (!r) return vNotFound();
    const js = D.jobs.filter((j) => j.referrers.includes(rid));
    const body = `<div class="page page--narrow" style="align-items:stretch">
      <div style="display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;padding:12px 0"><span class="avatar avatar--lg">${r.initials}</span><h1 style="font-size:22px">${esc(r.name)}</h1><span class="muted">${esc(r.role)} at ${esc(r.company)}</span><span class="chip chip--green">${I.shield}Work email verified</span></div>
      <div class="stats"><div class="card stat"><b>${r.referred}</b><span>Referred</span></div><div class="card stat"><b>${r.hired}</b><span>Hired</span></div><div class="card stat"><b>${esc(r.replies.replace("replies in ", ""))}</b><span>Reply time</span></div></div>
      <span class="label">Open openings</span>${js.map((j) => `<a class="card job" href="#/opening/${rid}/${j.id}"><div class="job__title">${esc(j.title)}</div><div class="job__meta">${esc(j.company)} · ${esc(j.city)} · ${esc(j.mode)}</div>${r.open ? `<span class="chip chip--green" style="align-self:flex-start">${I.check}Open · ready to refer</span>` : `<span class="chip chip--amber" style="align-self:flex-start">${I.clock}In use</span>`}</a>`).join("")}</div>`;
    return shell({ tab: "referrals", crumb: ["referrals", "Back to referrals"], mob: subTop("referrals", "Profile", "", `<button class="icon-btn" data-act="report" aria-label="Report or block">${I.flag}</button>`), body, nav: false });
  }

  // ---------- Messages ----------
  function vMessages() {
    const body = `<div class="page page--narrow"><div class="page-head desk-only"><div><h1>Messages</h1><p class="muted">Chats with referrers and people you refer.</p></div></div>
      ${S.threads.length ? `<div class="card" style="padding:0 14px">${S.threads.map((t) => { const p = t.with ? ref(t.with) : null; const last = t.msgs[t.msgs.length - 1]; return `<a class="row" href="#/thread/${t.id}"><span class="avatar" style="width:42px;height:42px">${esc(p ? p.initials : t.initials)}</span><div class="row__text"><b>${esc(p ? p.name : t.name)}</b><span style="color:${t.unread ? "var(--ink)" : "var(--muted)"};font-weight:${t.unread ? 600 : 400}">${esc(last ? last.text : "")}</span></div><span class="note">${esc(last ? last.day : "")}</span>${t.unread ? '<i style="width:8px;height:8px;border-radius:50%;background:var(--accent)"></i>' : ""}</a>`; }).join("")}</div>` : `<div class="card empty">${I.msgs}<b style="color:var(--ink)">No messages yet</b><span class="note">When a referrer accepts your request, you can chat here.</span></div>`}</div>`;
    return shell({ tab: "messages", mob: mobTop("Messages"), body });
  }
  function vThread(id) {
    const t = S.threads.find((x) => x.id === id);
    if (!t) return vNotFound();
    if (t.unread) {
      t.unread = false;
      save();
    }
    const p = t.with ? ref(t.with) : null;
    const name = p ? p.name : t.name;
    let lastDay = "";
    const msgs = t.msgs
      .map((m) => {
        const day = m.day !== lastDay ? `<div class="note" style="align-self:center">${esc(m.day)}</div>` : "";
        lastDay = m.day;
        return `${day}<div class="bubble ${m.from === "me" ? "bubble--me" : ""}">${esc(m.text)}</div>`;
      })
      .join("");
    const body = `<div class="page page--narrow chat-page"><div class="card chat-panel">
      <div style="padding:12px 14px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;gap:10px"><div><b style="color:var(--ink);font-size:13px">${esc(t.job)}</b><p class="note">Referral request</p></div><span class="chip chip--green">${esc(t.status)}</span></div>
      <div class="chat" id="chatBox">${msgs}</div>
      <div class="desk-only" style="padding:12px 14px;border-top:1px solid var(--line);flex-direction:column;gap:8px">${threadComposer(id)}</div></div></div>`;
    return shell({ tab: "messages", crumb: ["messages", "Back to messages"], mob: subTop("messages", name, p ? p.company : t.job, `<button class="icon-btn" data-act="report" aria-label="Report or block">${I.flag}</button>`), body, foot: threadComposer(id), nav: false });
  }
  function threadComposer(id) {
    return `<span class="note" style="display:flex;gap:6px;align-items:center">${I.shield}Never pay for a referral. Report anything off.</span>
      <form class="composer" data-form="thread" data-id="${id}"><input class="input" name="msg" placeholder="Write a message" aria-label="Write a message" autocomplete="off"><button class="send" aria-label="Send">${I.send}</button></form>`;
  }

  // ---------- Settings ----------
  function vSettings() {
    const u = usage();
    const body = `<div class="page page--narrow"><div class="page-head desk-only"><div><h1>Settings</h1></div></div>
      <div class="person" style="padding:6px 0"><span class="avatar avatar--me" style="width:48px;height:48px;font-size:20px">${esc(initials(S.resume.name)[0])}</span><div class="person__text"><b style="font-size:17px">${esc(S.resume.name)}</b>${esc(S.resume.title)} · saved in this browser</div></div>
      <span class="label">Account</span><div class="rows">
        <a class="row" href="#/start/1"><div class="row__text"><b>I'm here to</b><span>${[S.goal.find && "Find a job", S.goal.refer && "Refer people"].filter(Boolean).join(" and ")}</span></div>${I.next}</a>
        <a class="row" href="#/start/2"><div class="row__text"><b>Job preferences</b><span>${S.prefs.titles.length} titles · ${S.prefs.cities.length} cities · ${esc(S.prefs.work.join(", "))}</span></div>${I.next}</a>
        <a class="row" href="#/resumes"><div class="row__text"><b>Master resume</b><span>${esc(S.resumeFile)}</span></div>${I.next}</a></div>
      <span class="label">Referrals</span><div class="rows">
        <div class="row"><div class="row__text"><b>Work verification</b><span>Needed before you can post openings</span></div><span class="chip chip--amber">Not verified</span></div>
        <div class="row"><div class="row__text"><b>Hide me from coworkers</b><span>People at your company can't see you're looking</span></div><button class="switch" role="switch" aria-checked="${S.settings.hide}" data-act="setting" data-k="hide" aria-label="Hide me from coworkers"></button></div></div>
      <span class="label">AI and alerts</span><div class="rows">
        <a class="row" href="#/usage"><div class="row__text"><b>AI usage today</b><span>${u.tailor} of ${LIMITS.tailor} tailorings · ${u.refine} of ${LIMITS.refineDay} refinements</span></div>${I.next}</a>
        <div class="row"><div class="row__text"><b>Push notifications</b><span>Requests, replies, reopened openings</span></div><button class="switch" role="switch" aria-checked="${S.settings.push}" data-act="setting" data-k="push" aria-label="Push notifications"></button></div></div>
      <button class="btn btn--ghost" data-act="resetApp" style="align-self:flex-start;color:var(--red);padding:0">Delete my data and start over</button></div>`;
    return shell({ tab: "settings", mob: mobTop("Settings"), body });
  }
  function vUsage() {
    const u = usage();
    const bar = (label, used, max, note) => `<div style="display:flex;flex-direction:column;gap:8px;padding:16px 0;border-bottom:1px solid var(--line)"><div style="display:flex;justify-content:space-between"><b style="color:var(--ink)">${label}</b><b style="color:var(--ink);font-size:14px">${used} of ${max} used</b></div><div class="progress" role="progressbar" aria-label="${label}" aria-valuenow="${used}" aria-valuemin="0" aria-valuemax="${max}"><i style="width:${(used / max) * 100}%"></i></div><span class="note" style="font-size:13px">${note}</span></div>`;
    const body = `<div class="page page--narrow"><div class="page-head desk-only"><div><h1>AI usage today</h1><p class="muted">Limits reset every day.</p></div></div>
      ${bar("Tailorings", u.tailor, LIMITS.tailor, "The first AI pass for a job. Uses Gemini Flash.")}${bar("Refinements", u.refine, LIMITS.refineDay, `Chat changes after tailoring. Up to ${LIMITS.refinePerJob} per job.`)}
      <p class="note" style="font-size:13px">Manual edits never count. If Gemini is busy, the app tries a lighter model before giving up.</p></div>`;
    return shell({ tab: "settings", crumb: ["settings", "Back to settings"], mob: subTop("settings", "AI usage today", "Resets every day"), body, nav: false });
  }
  function vNotifications() {
    const items = [
      ...S.requests.map((q) => [`You asked ${ref(q.refId).name} for a referral`, `${job(q.jobId).title} · ${job(q.jobId).company}`, new Date(q.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })]),
      ...Object.keys(S.notifyMe).filter((k) => S.notifyMe[k]).map((k) => [`We'll tell you when ${job(k).company} has a free referrer`, job(k).title, "Alert on"]),
      ["Today's jobs are ready", `${D.jobs.length} matches for ${S.prefs.titles[0] || "your titles"}`, "7:00 AM"],
    ];
    const body = `<div class="page page--narrow"><div class="page-head desk-only"><h1>Notifications</h1></div><div class="card" style="padding:0 14px">${items.map((n) => `<div class="row"><span class="avatar" style="background:var(--accent-soft);color:var(--accent-ink)">${I.bell}</span><div class="row__text"><b style="font-size:14px">${esc(n[0])}</b><span>${esc(n[1])}</span></div><span class="note">${esc(n[2])}</span></div>`).join("")}</div></div>`;
    return shell({ tab: "", crumb: ["jobs", "Back to jobs"], mob: subTop("jobs", "Notifications"), body, nav: false });
  }
  function vLimit() {
    const body = `<div class="page page--narrow"><div class="card empty">${I.clock}<h2 style="font-size:20px">Daily AI limit reached</h2><p class="note">You've used all ${LIMITS.tailor} tailorings for today. They reset tomorrow. You can still edit tailored resumes by hand and send referral requests.</p><a class="btn btn--dark" href="#/resumes">Open my resumes</a></div></div>`;
    return shell({ tab: "jobs", mob: subTop("jobs", "Daily limit"), body, nav: false });
  }
  function vNotFound() {
    return shell({ tab: "jobs", mob: subTop("jobs", "Not found"), body: `<div class="page"><div class="card empty"><b>That page isn't here</b><a class="btn" href="#/jobs">Back to jobs</a></div></div>` });
  }

  // ---------- Sheets ----------
  function sheet(html, label) {
    closeSheet();
    const s = document.createElement("div");
    s.className = "scrim";
    s.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(label)}"><span class="sheet__grab" aria-hidden="true"></span>${html}</div>`;
    s.addEventListener("click", (e) => e.target === s && closeSheet());
    document.body.appendChild(s);
    const f = s.querySelector("textarea, input, button");
    if (f) f.focus({ preventScroll: true });
    return s;
  }
  function closeSheet() {
    document.querySelectorAll(".scrim").forEach((s) => s.remove());
  }

  function requestSheet(rid, jid) {
    const r = ref(rid);
    const j = job(jid);
    if (S.requests.filter((x) => x.status === "waiting").length >= LIMITS.active)
      return sheet(`<h2 style="font-size:20px">You have ${LIMITS.active} requests open</h2><p class="muted" style="font-size:14px;line-height:1.5">Withdraw one or wait for a reply before asking someone new. This keeps referrers from getting flooded.</p><a class="btn btn--dark btn--block" href="#/requests" data-act="close">See my requests</a>`, "Limit reached");
    const t = S.tailored[jid];
    const first = r.name.split(" ")[0];
    const draft = `Hi ${first}, I'm a ${S.resume.title || "designer"} interested in the ${j.title} role at ${j.company}. ${S.resume.summary.split(".")[0]}. Would you be open to referring me?`.slice(0, 500);
    const opt = (v, title, sub, on) => `<button class="radio-card" role="radio" aria-checked="${on}" data-act="pickRes" data-v="${v}"><i></i><span class="person__text"><b>${title}</b>${sub}</span></button>`;
    const s = sheet(
      `<h2 style="font-size:22px">Ask ${esc(first)} for a referral</h2>
      <div class="field"><span>Resume to send</span><div role="radiogroup" style="display:flex;flex-direction:column;gap:8px">${t ? opt("tailored", `Tailored for ${esc(j.company.split(" ")[0])}`, `${score(t.resume, j)}% match · recommended`, true) : ""}${opt("master", "Master resume", `${score(S.resume, j)}% match`, !t)}</div>
      ${t ? "" : `<button class="btn btn--sm btn--ghost" style="align-self:flex-start;color:var(--accent-ink);padding:0" data-act="tailorFromSheet" data-job="${jid}">${I.wand}Tailor first for a better match</button>`}</div>
      <label class="field"><span style="display:flex;justify-content:space-between;align-items:center">Note to ${esc(first)}<button class="btn btn--sm btn--ghost" style="color:var(--accent-ink);padding:0" data-act="writeNote" data-ref="${rid}" data-job="${jid}">${I.spark}Write it for me</button></span><textarea class="textarea" rows="5" maxlength="500" id="refNote">${esc(draft)}</textarea></label>
      <span class="note" id="noteCount">${draft.length} of 500 characters</span>
      <label style="display:flex;gap:10px;align-items:flex-start;font-size:13px"><input type="checkbox" id="refAgree" checked style="width:20px;height:20px;accent-color:var(--ink)">I meet the basic requirements and will reply within 7 days.</label>
      <button class="btn btn--dark btn--block" data-act="sendRequest" data-ref="${rid}" data-job="${jid}">Send request</button>`,
      `Ask ${first} for a referral`
    );
    s.dataset.res = t ? "tailored" : "master";
    const ta = s.querySelector("#refNote");
    ta.addEventListener("input", () => (s.querySelector("#noteCount").textContent = `${ta.value.length} of 500 characters`));
  }

  function didApplySheet(jid) {
    const j = job(jid);
    const r = j.referrers.map(ref).find((x) => x.open && !requestFor(x.id));
    sheet(
      `<div class="card file-row" style="background:var(--green-soft);border-color:transparent"><span style="color:var(--green)">${I.check}</span><div class="person__text"><b>PDF ready</b>Resume - ${esc(S.resume.name)} - ${esc(j.company)}.pdf · choose Save as PDF</div></div>
      <h2 style="font-size:22px">Did you apply to this job?</h2><button class="btn btn--ghost" style="align-self:flex-start;padding:0;color:var(--accent-ink);text-decoration:underline" data-act="openPosting" data-job="${jid}">Open the posting to apply ↗</button>
      ${r ? `<div class="info"><span class="avatar avatar--xs">${r.initials}</span><span style="flex:1"><b>${esc(r.name.split(" ")[0])} can refer you.</b> Referrals get noticed faster.</span><button class="btn btn--sm" data-act="askRef" data-ref="${r.id}" data-job="${jid}">Ask</button></div>` : ""}
      <button class="btn btn--dark btn--block" data-act="markApplied" data-job="${jid}">Yes, mark as applied</button><button class="btn btn--block" data-act="close">Not yet</button>`,
      "Did you apply?"
    );
  }

  function editLineSheet(jid, path) {
    const t = S.tailored[jid];
    const cur = getPath(t.resume, path);
    const s = sheet(
      `<h2 style="font-size:20px">Edit this line</h2><p class="note">Manual edits never use a refinement.</p><textarea class="textarea" rows="5" id="lineEdit">${esc(cur)}</textarea>
       <div style="display:flex;gap:8px"><button class="btn" data-act="close" style="flex:1">Cancel</button><button class="btn btn--dark" style="flex:1" data-act="saveLine" data-job="${jid}" data-path="${path}">Save</button></div>`,
      "Edit line"
    );
    const ta = s.querySelector("#lineEdit");
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }

  // ---------- Router ----------
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/");
    return parts;
  }
  let lastHash = "";
  function render() {
    const app = $("#app");
    const [a, b, c] = route();
    const keepScroll = location.hash === lastHash;
    const main = $("#main");
    const scroll = keepScroll && main ? main.scrollTop : 0;
    // Keep focus and caret in a search box while typing re-renders the list.
    const active = document.activeElement;
    const focusKey = active && active.dataset ? active.dataset.input : null;
    const caret = focusKey ? active.selectionStart : 0;

    let html;
    if (!S.onboarded || !S.resume) {
      if (a === "start" && b === "1") html = vGoal();
      else if (a === "start" && b === "2") html = vPrefs();
      else if (a === "start" && b === "3") html = vResumeStep();
      else html = vWelcome();
    } else {
      const views = {
        jobs: () => vJobs(),
        job: () => vJob(b),
        tailoring: () => vTailoring(b),
        tailored: () => vTailored(b),
        chat: () => vChat(b),
        resumes: () => vResumes(),
        referrals: () => vReferrals(),
        requests: () => vReferrals("requests"),
        opening: () => vOpening(b, c),
        profile: () => vProfile(b),
        messages: () => vMessages(),
        thread: () => vThread(b),
        settings: () => vSettings(),
        usage: () => vUsage(),
        notifications: () => vNotifications(),
        limit: () => vLimit(),
        start: () => (b === "1" ? vGoal() : b === "2" ? vPrefs() : vResumeStep()),
      };
      html = (views[a] || views.jobs)();
    }
    app.innerHTML = html;
    const m = $("#main");
    if (m) m.scrollTop = scroll;
    if (a === "chat" || a === "thread") {
      const box = $("#chatBox");
      if (box) box.scrollTop = box.scrollHeight;
    }
    if (focusKey) {
      const el = document.querySelector(`[data-input="${focusKey}"]:not([hidden])`);
      const vis = [...document.querySelectorAll(`[data-input="${focusKey}"]`)].find((x) => x.offsetParent);
      const target = vis || el;
      if (target) {
        target.focus();
        target.setSelectionRange(caret, caret);
      }
    }
    lastHash = location.hash;
  }

  // ---------- Actions ----------
  const A = {
    go: (el) => go(el.dataset.to),
    close: () => closeSheet(),
    goal: (el) => {
      S.goal[el.dataset.k] = !S.goal[el.dataset.k];
      save();
      render();
    },
    untag: (el) => {
      S.prefs[el.dataset.f].splice(Number(el.dataset.i), 1);
      save();
      render();
    },
    work: (el) => {
      const w = el.dataset.w;
      const list = S.prefs.work;
      S.prefs.work = list.includes(w) ? list.filter((x) => x !== w) : [...list, w];
      save();
      render();
    },
    sampleResume: () => {
      S.resume = clone(D.sampleResume);
      S.resumeFile = "Resume - Aadhavan M.pdf";
      S.tailored = {};
      save();
      render();
    },
    resetResume: () => {
      S.resume = null;
      save();
      render();
    },
    parsePaste: () => parseResume(($("#paste") || {}).value || "", "Pasted resume"),
    finishOnb: () => {
      S.onboarded = true;
      save();
      go("jobs");
    },
    useSample: () => {
      S.resume = clone(D.sampleResume);
      S.resumeFile = "Resume - Aadhavan M.pdf";
      S.onboarded = true;
      save();
      go("jobs");
      render();
    },
    jobsTab: (el) => {
      jobsTab = el.dataset.k;
      render();
    },
    toggleRefs: () => {
      onlyRefs = !onlyRefs;
      render();
    },
    refsTab: (el) => {
      refsTab = el.dataset.k;
      closeSheet();
      if (location.hash !== "#/referrals") go("referrals");
      else render();
    },
    setStatus: (el) => {
      S.status[el.dataset.job] = el.dataset.s;
      save();
      toast(el.dataset.s === "applied" ? "Marked as applied" : el.dataset.s === "skipped" ? "Skipped. It won't show in New." : "Moved back to New");
      render();
    },
    markApplied: (el) => {
      S.status[el.dataset.job] = "applied";
      save();
      closeSheet();
      toast("Marked as applied. Good luck!");
      render();
    },
    openPosting: (el) => {
      const j = job(el.dataset.job);
      window.open(`https://www.google.com/search?q=${encodeURIComponent(`${j.title} ${j.company} jobs`)}`, "_blank", "noopener");
      toast("Example company: this opens a job search for the role.");
    },
    copy: (el) => {
      navigator.clipboard?.writeText(el.dataset.text).then(() => toast("Copied"), () => toast(el.dataset.text));
    },
    tailor: (el) => tailor(el.dataset.job),
    tailorFromSheet: (el) => {
      closeSheet();
      tailor(el.dataset.job);
    },
    sugg: (el) => {
      const t = S.tailored[el.dataset.job];
      const s = t.suggestions[Number(el.dataset.i)];
      s.state = el.dataset.s;
      setPath(t.resume, s.path, s.state === "accepted" ? s.after : s.before);
      t.changed = [];
      save();
      render();
    },
    acceptAll: (el) => {
      const t = S.tailored[el.dataset.job];
      t.suggestions.forEach((s) => {
        s.state = "accepted";
        setPath(t.resume, s.path, s.after);
      });
      t.changed = [];
      save();
      toast("All suggestions accepted");
      render();
    },
    answer: (el) => {
      const t = S.tailored[el.dataset.job];
      const q = t.questions[Number(el.dataset.i)];
      q.answer = el.dataset.a;
      if (q.answer === "yes" && !t.resume.skills.some((s) => s.toLowerCase() === q.skill.toLowerCase())) t.resume.skills.push(q.skill);
      save();
      render();
    },
    editLine: (el) => {
      const [a, id] = route();
      if (a === "tailored") editLineSheet(id, el.dataset.path);
    },
    saveLine: (el) => {
      const t = S.tailored[el.dataset.job];
      const v = $("#lineEdit").value.trim();
      if (v) {
        setPath(t.resume, el.dataset.path, v);
        if (!t.edited.includes(el.dataset.path)) t.edited.push(el.dataset.path);
        save();
      }
      closeSheet();
      render();
    },
    download: (el) => {
      const j = job(el.dataset.job);
      const t = S.tailored[el.dataset.job];
      printResume(t ? t.resume : S.resume, `Resume - ${S.resume.name} - ${j.company}`);
      setTimeout(() => didApplySheet(j.id), 600);
    },
    downloadMaster: () => printResume(S.resume, `Resume - ${S.resume.name}`),
    replaceResume: () => {
      S.onboarded = false;
      S.resume = null;
      save();
      go("start/3");
    },
    quick: (el) => {
      const ta = [...document.querySelectorAll('[data-form="chat"] textarea')].find((x) => x.offsetParent);
      if (!ta) return;
      ta.value = ta.value.trim() ? `${ta.value.trim()}\n${el.dataset.text}` : el.dataset.text;
      ta.focus();
    },
    undo: (el) => {
      const t = S.tailored[el.dataset.job];
      const prev = t.history.pop();
      if (prev) {
        t.resume = prev;
        t.changed = [];
        t.chat.push({ from: "ai", text: "Undone. Your resume is back to how it was before that change." });
        save();
        render();
      }
    },
    askRef: (el) => requestSheet(el.dataset.ref, el.dataset.job),
    pickRes: (el) => {
      const s = el.closest(".scrim");
      s.dataset.res = el.dataset.v;
      s.querySelectorAll(".radio-card").forEach((b) => b.setAttribute("aria-checked", String(b === el)));
    },
    writeNote: async (el) => {
      const r = ref(el.dataset.ref);
      const j = job(el.dataset.job);
      const ta = $("#refNote");
      const old = ta.value;
      el.disabled = true;
      ta.value = "Writing…";
      try {
        const t = S.tailored[j.id];
        const text = await ask(
          `Write a short, warm referral request note (under 450 characters, no greeting fluff, first person) from this person to ${r.name}, ${r.role} at ${r.company}, for the ${j.title} role.\n` +
            `${r.name.split(" ")[0]} says: "${r.note}" and looks for: ${r.looks.join(", ")}.\nUse only facts stated in this resume. Do not add industries, domains, skills or numbers it doesn't mention, even if the referrer looks for them:\n${resumeText(t ? t.resume : S.resume).slice(0, 4000)}\nStart with "Hi ${r.name.split(" ")[0]},". Plain text only.`,
          { maxTokens: 300 }
        );
        ta.value = text.trim().replace(/^"|"$/g, "").slice(0, 500);
      } catch (e) {
        ta.value = old;
        toast(e.message);
      }
      ta.dispatchEvent(new Event("input"));
      el.disabled = false;
    },
    sendRequest: (el) => {
      const s = el.closest(".scrim");
      if (!$("#refAgree").checked) return toast("Tick the box to confirm you meet the basics.");
      const note = $("#refNote").value.trim();
      if (note.length < 20) return toast("Add a short note so they know why you're a fit.");
      const r = ref(el.dataset.ref);
      const j = job(el.dataset.job);
      const id = "q" + Date.now();
      S.requests.push({ id, refId: r.id, jobId: j.id, note, at: Date.now(), status: "waiting", resumeLabel: s.dataset.res === "tailored" ? "Tailored resume" : "Master resume" });
      S.threads.unshift({ id, with: r.id, job: j.title, status: "Request sent", msgs: [{ from: "me", text: note, day: "Today" }] });
      save();
      closeSheet();
      toast(`Sent to ${r.name.split(" ")[0]}. They have 7 days to reply.`);
      render();
    },
    withdraw: (el) => {
      const q = S.requests.find((x) => x.id === el.dataset.id);
      if (q && confirm("Withdraw this request? The opening goes to the next person.")) {
        q.status = "withdrawn";
        save();
        render();
      }
    },
    notifyMe: (el) => {
      S.notifyMe[el.dataset.job] = !S.notifyMe[el.dataset.job];
      save();
      toast(S.notifyMe[el.dataset.job] ? "We'll tell you when a referrer is free." : "Alert turned off");
      render();
    },
    review: () => {
      const g = S.giving.find((x) => x.waiting);
      if (!g) return;
      sheet(
        `<h2 style="font-size:20px">${esc(g.first)} asked for a referral</h2><p class="muted" style="font-size:14px">${esc(g.title)} · ${esc(g.meta)}</p>
        <div class="card" style="padding:14px;font-size:14px;line-height:1.55">Hi! I've been a product designer for 3 years, mostly on B2B dashboards. I'd love to be considered for this role. My resume is attached.</div>
        <div style="display:flex;gap:8px"><button class="btn" style="flex:1" data-act="decide" data-v="decline">Decline</button><button class="btn btn--dark" style="flex:1" data-act="decide" data-v="accept">Refer ${esc(g.first.split(" ")[0])}</button></div>`,
        "Review request"
      );
    },
    decide: (el) => {
      const g = S.giving.find((x) => x.waiting);
      if (el.dataset.v === "accept") {
        g.status = "inuse";
        g.meta = `Referring ${g.first} · just now`;
        g.waiting = 0;
        toast(`You're referring ${g.first}. The opening is locked until there's an outcome.`);
      } else {
        g.waiting--;
        g.first = "Meera S.";
        toast("Declined kindly. The next person in line moves up.");
      }
      save();
      closeSheet();
      render();
    },
    postOpening: () =>
      sheet(
        `<h2 style="font-size:20px">Post a referral opening</h2><div class="info info--amber">${I.shield}<span>Verify your work email in Settings before this goes live. You can save it now.</span></div>
        <label class="field"><span>Role</span><input class="input" id="poTitle" placeholder="e.g. Product Designer"></label><label class="field"><span>Location</span><input class="input" id="poCity" placeholder="e.g. Chennai · Hybrid"></label>
        <label class="field"><span>Who you'll refer</span><textarea class="textarea" rows="3" id="poNote" placeholder="What makes someone a good fit?"></textarea></label><button class="btn btn--dark btn--block" data-act="savePost">Save opening</button>`,
        "Post opening"
      ),
    savePost: () => {
      const t = $("#poTitle").value.trim();
      if (!t) return toast("Add the role you'll refer for.");
      S.giving.unshift({ title: t, meta: `${$("#poCity").value.trim() || "Location not set"} · waiting for verification`, status: "open", waiting: 0 });
      save();
      closeSheet();
      toast("Saved. It goes live once your work email is verified.");
      render();
    },
    report: () =>
      sheet(
        `<h2 style="font-size:20px">Report or block</h2><p class="muted" style="font-size:14px">Tell us what happened. They won't know who reported them.</p>${["Asked me to pay", "Not who they say they are", "Rude or unsafe", "Spam"].map((x) => `<button class="radio-card" data-act="reported"><i></i>${x}</button>`).join("")}`,
        "Report or block"
      ),
    reported: () => {
      closeSheet();
      toast("Thanks. We'll look into it within 24 hours.");
    },
    setting: (el) => {
      S.settings[el.dataset.k] = !S.settings[el.dataset.k];
      save();
      render();
    },
    resetApp: () => {
      if (!confirm("Delete your resume, tailored versions and requests from this browser?")) return;
      S = fresh();
      save();
      go("welcome");
      render();
    },
  };

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el || el.disabled) return;
    const fn = A[el.dataset.act];
    if (fn) {
      if (el.tagName !== "A" || el.dataset.act === "close") e.preventDefault();
      fn(el, e);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSheet();
    const el = e.target;
    if ((e.key === "Enter" || e.key === " ") && el.dataset && el.dataset.act === "editLine") {
      e.preventDefault();
      A.editLine(el);
    }
    if (e.key === "Enter" && el.dataset && el.dataset.tag) {
      e.preventDefault();
      const v = el.value.trim();
      if (v) {
        S.prefs[el.dataset.tag].push(v);
        save();
        render();
        const again = document.querySelector(`[data-tag="${el.dataset.tag}"]`);
        if (again) again.focus();
      }
    }
    if (e.key === "Enter" && !e.shiftKey && el.closest && el.closest('[data-form="chat"]') && el.tagName === "TEXTAREA" && isDesk()) {
      e.preventDefault();
      el.form.requestSubmit();
    }
  });
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.dataset.input === "jobsQuery") {
      jobsQuery = el.value;
      render();
    }
    if (el.dataset.pref) {
      S.prefs[el.dataset.pref] = el.value;
      save();
    }
  });
  document.addEventListener("change", (e) => {
    if (e.target.dataset.file === "resume") readFile(e.target.files[0]);
  });
  document.addEventListener("submit", (e) => {
    const f = e.target;
    e.preventDefault();
    if (f.dataset.form === "chat") {
      const v = f.msg.value;
      f.msg.value = "";
      refine(f.dataset.job, v);
    }
    if (f.dataset.form === "thread") {
      const t = S.threads.find((x) => x.id === f.dataset.id);
      const v = f.msg.value.trim();
      if (t && v) {
        t.msgs.push({ from: "me", text: v, day: "Today" });
        save();
        render();
        const inp = [...document.querySelectorAll('[data-form="thread"] input')].find((x) => x.offsetParent);
        if (inp) inp.focus();
      }
    }
  });
  window.addEventListener("hashchange", () => {
    closeSheet();
    render();
  });
  window.addEventListener("online", render);
  window.addEventListener("offline", render);
  let wasDesk = isDesk();
  window.addEventListener("resize", () => {
    if (isDesk() !== wasDesk) {
      wasDesk = isDesk();
      render();
    }
  });

  if (!location.hash) location.replace(S.onboarded && S.resume ? "#/jobs" : "#/welcome");
  render();
})();
