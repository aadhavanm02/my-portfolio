// Clickable walkthrough player for the Playground.
// Each project page sets window.WT_CONFIG and loads this file. Screens are images captured from the
// design canvas; hotspots are the links drawn on each screen, so tapping works like the prototype.
(function () {
  const cfg = window.WT_CONFIG;
  const root = document.getElementById("wt");
  const state = { variant: 0, story: 0, history: [], current: null, showTaps: false, data: {} };

  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  root.innerHTML = `
    <div class="wt-banner" role="note">
      <strong>Demo</strong> Sample data, not a live app. Tap the screen to move through the story.
      ${cfg.note ? `<span class="wt-banner__more">${cfg.note}</span>` : ""}
    </div>
    <div class="wt-body">
      <div class="wt-stage"><div class="wt-device"><div class="wt-chrome" aria-hidden="true"><span></span><span></span><span></span><b></b></div><div class="wt-viewport"><div class="wt-screen"><img alt="" /><div class="wt-hotspots"></div></div></div></div></div>
      <aside class="wt-panel">
        <div class="wt-variants" role="tablist" aria-label="Device"></div>
        <label class="wt-field"><span>Story</span><select class="wt-story"></select></label>
        <div class="wt-now">
          <span class="wt-chapter"></span>
          <h1 class="wt-title"></h1>
          <p class="wt-hint"></p>
        </div>
        <button type="button" class="wt-btn wt-btn--primary wt-next">Next step</button>
        <div class="wt-actions">
          <button type="button" class="wt-btn wt-back">Back</button>
          <button type="button" class="wt-btn wt-restart">Restart</button>
        </div>
        <label class="wt-toggle"><input type="checkbox" class="wt-taps" /> Show tap areas</label>
        <p class="wt-count"></p>
      </aside>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const img = $(".wt-screen img");
  const spots = $(".wt-hotspots");
  const deskViewport = $(".wt-viewport");
  const device = $(".wt-device");
  const screenEl = $(".wt-screen");
  let viewport = deskViewport;

  // Phone screens show inside the shared iPhone mockup (live status bar, Dynamic Island).
  // Screens are drawn at full height with room left at the top, so the status bar floats over them
  // and takes its colour from the screen; bottom bars stay put because nothing needs to scroll.
  const phone = window.IPhone.create({ statusBg: cfg.statusBg || "#ffffff", label: "Phone", overlay: true });
  phone.followImage(img);
  const phoneView = el("div", "wt-pview");
  // On a real phone the screens fill the display, with no mockup around them.
  const onPhone = matchMedia("(max-width: 640px)").matches;
  if (onPhone) {
    root.classList.add("wt-phone");
    $(".wt-stage").appendChild(phoneView);
  } else {
    phone.content.appendChild(phoneView);
    $(".wt-stage").appendChild(phone.holder);
  }

  async function loadVariant(i) {
    const v = cfg.variants[i];
    if (!state.data[i]) {
      const res = await fetch(v.data);
      const json = await res.json();
      state.data[i] = { ...json, byId: Object.fromEntries(json.screens.map((s) => [s.id, s])) };
    }
    return state.data[i];
  }

  function variant() {
    return cfg.variants[state.variant];
  }

  function story() {
    return variant().stories[state.story];
  }

  function renderVariants() {
    const box = $(".wt-variants");
    box.hidden = cfg.variants.length < 2;
    box.innerHTML = "";
    cfg.variants.forEach((v, i) => {
      const b = el("button", "wt-chip" + (i === state.variant ? " is-on" : ""), v.label);
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(i === state.variant));
      b.onclick = () => switchVariant(i);
      box.appendChild(b);
    });
    const sel = $(".wt-story");
    sel.innerHTML = variant().stories.map((s, i) => `<option value="${i}">${s.label}</option>`).join("");
    sel.value = String(state.story);
  }

  async function switchVariant(i) {
    state.variant = i;
    state.story = 0;
    renderVariants();
    await start();
  }

  async function start() {
    await loadVariant(state.variant);
    state.history = [];
    go(story().path[0], false);
  }

  function fit() {
    const v = variant();
    const s = state.current;
    if (!s) return;
    const stage = $(".wt-stage").getBoundingClientRect();
    if (v.frame === "phone") {
      if (onPhone) root.style.setProperty("--z", Math.min(stage.width / 390, stage.height / s.h));
      else phone.fit(stage.width - 8, Math.max(stage.height, 480) - 8);
      return;
    }
    const frameW = v.frame === "desktop" ? Math.min(s.w, 1440) : 390;
    const frameH = v.frame === "desktop" ? 900 : 844;
    const pad = v.frame === "desktop" ? 46 : 28;
    const scale = Math.min((stage.width - 8) / (frameW + pad), (Math.max(stage.height, 480) - 8) / (frameH + pad), v.frame === "desktop" ? 0.9 : 1);
    device.style.setProperty("--fw", frameW + "px");
    device.style.setProperty("--fh", frameH + "px");
    device.style.setProperty("--scale", scale);
    device.style.width = (frameW + pad) * scale + "px";
    device.style.height = (frameH + pad) * scale + (v.frame === "desktop" ? 30 * scale : 0) + "px";
  }

  function go(id, push = true) {
    const data = state.data[state.variant];
    const s = data.byId[id];
    if (!s) return;
    if (push && state.current) state.history.push(state.current.id);
    state.current = s;
    const isPhone = variant().frame === "phone";
    device.className = "wt-device wt-device--" + variant().frame;
    device.hidden = isPhone;
    phone.holder.hidden = !isPhone || onPhone;
    viewport = isPhone ? phoneView : deskViewport;
    if (screenEl.parentElement !== viewport) viewport.appendChild(screenEl);
    img.src = variant().base + "screens/" + s.id + ".webp";
    img.width = s.w;
    img.height = s.h;
    $(".wt-screen").style.width = s.w + "px";
    $(".wt-screen").style.height = s.h + "px";
    spots.innerHTML = "";
    s.links.forEach((l) => {
      const b = el("button", "wt-spot");
      b.type = "button";
      b.style.left = l.x + "px";
      b.style.top = l.y + "px";
      b.style.width = l.w + "px";
      b.style.height = l.h + "px";
      b.setAttribute("aria-label", l.label || "Next screen");
      b.onclick = () => go(l.to);
      spots.appendChild(b);
    });
    viewport.scrollTop = 0;
    $(".wt-chapter").textContent = s.chapter || "";
    $(".wt-title").textContent = s.title;
    $(".wt-hint").textContent = s.hint || (s.links.length ? "Tap a highlighted area to continue." : "End of this path. Pick another story or restart.");
    $(".wt-back").disabled = state.history.length === 0;
    const path = story().path;
    const at = path.indexOf(s.id);
    const next = at >= 0 ? path[at + 1] : null;
    const nextBtn = $(".wt-next");
    nextBtn.disabled = !next;
    nextBtn.textContent = next ? "Next step" : "End of this story";
    nextBtn.onclick = () => next && go(next);
    $(".wt-count").textContent = at >= 0 ? `Step ${at + 1} of ${path.length} in this story` : "Off the main path. Use Back, or pick a story.";
    nudge();
    fit();
  }

  let nudgeTimer;
  function nudge() {
    clearTimeout(nudgeTimer);
    root.classList.remove("wt-nudge");
    nudgeTimer = setTimeout(() => root.classList.add("wt-nudge"), 2200);
  }

  $(".wt-back").onclick = () => {
    const prev = state.history.pop();
    if (prev) go(prev, false);
  };
  $(".wt-restart").onclick = () => start();
  $(".wt-story").onchange = (e) => {
    state.story = Number(e.target.value);
    start();
  };
  $(".wt-taps").onchange = (e) => root.classList.toggle("wt-show", e.target.checked);
  img.addEventListener("click", () => root.classList.add("wt-flash") || setTimeout(() => root.classList.remove("wt-flash"), 700));
  window.addEventListener("resize", fit);
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "Backspace") $(".wt-back").click();
  });

  renderVariants();
  start();
})();
