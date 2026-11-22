// Builds the iPhone mockup around any content (an iframe or a scrolling screen) and keeps the
// status bar clock live. Usage:
//   const phone = IPhone.create({ statusBg: "#fff" });
//   phone.content.appendChild(iframe);   // or any element
//   holder.appendChild(phone.holder);  phone.fit(maxW, maxH);
(function () {
  const W = 390 + 26;
  const H = 844 + 26;
  const H_OVERLAY = 868 + 26;

  const icons =
    // Signal bars
    '<svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>' +
    // Wi-Fi
    '<svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.3-1.4A10.4 10.4 0 0 0 8 .5 10.4 10.4 0 0 0 .7 3.4L2 4.8a8.5 8.5 0 0 1 6-2.4z"/><path d="M8 6c1.3 0 2.5.5 3.4 1.3l1.3-1.4A6.7 6.7 0 0 0 8 4.1c-1.8 0-3.4.7-4.7 1.8l1.3 1.4C5.5 6.5 6.7 6 8 6z"/><path d="M8 9.6c.6 0 1.1.2 1.5.5L8 11.7l-1.5-1.6c.4-.3.9-.5 1.5-.5z"/></svg>' +
    // Battery
    '<svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true"><rect x=".5" y=".5" width="23" height="12" rx="3.6" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="16" height="9" rx="2.2"/><path d="M25 4.3v4.4c.9-.3 1.5-1.2 1.5-2.2s-.6-1.9-1.5-2.2z" opacity=".45"/></svg>';

  function clock() {
    const d = new Date();
    let h = d.getHours() % 12;
    if (h === 0) h = 12;
    return `${h}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  const clocks = new Set();
  setInterval(() => clocks.forEach((el) => (el.textContent = clock())), 15000);

  function create(opts = {}) {
    const holder = document.createElement("div");
    holder.className = "iph-holder";
    holder.innerHTML = `
      <div class="iph" role="group" aria-label="${opts.label || "iPhone"}">
        <span class="iph__btn iph__btn--action"></span><span class="iph__btn iph__btn--up"></span>
        <span class="iph__btn iph__btn--down"></span><span class="iph__btn iph__btn--power"></span>
        <div class="iph__screen">
          <div class="iph__status" aria-hidden="true"><span class="iph__time"></span><span class="iph__island"></span><span class="iph__icons">${icons}</span></div>
          <div class="iph__content"></div>
          <div class="iph__safe" aria-hidden="true"><span class="iph__home"></span></div>
        </div>
      </div>`;
    const phone = holder.firstElementChild;
    if (opts.overlay) phone.classList.add("iph--overlay");
    const time = phone.querySelector(".iph__time");
    time.textContent = clock();
    clocks.add(time);

    const h = opts.overlay ? H_OVERLAY : H;
    const api = {
      holder,
      phone,
      content: phone.querySelector(".iph__content"),
      setStatus(bg, ink) {
        if (bg) phone.style.setProperty("--iph-status-bg", bg);
        phone.style.setProperty("--iph-status-ink", ink || (isDark(bg) ? "#fff" : "#0b0b0c"));
      },
      // The strip behind the home indicator matches the bottom of the app; the bar flips to
      // white on dark apps, like iOS.
      setBottom(bg) {
        if (!bg) return;
        phone.style.setProperty("--iph-bottom-bg", bg);
        phone.style.setProperty("--iph-home", isDark(bg) ? "#ffffff" : "#0b0b0c");
      },
      // Scale the phone to fit a box; it never grows past its real size.
      fit(maxW, maxH) {
        const s = Math.min(1, maxW / (W + 12), maxH / (h + 12));
        phone.style.transform = `translate(${6 * s}px, ${6 * s}px) scale(${s})`;
        holder.style.width = (W + 12) * s + "px";
        holder.style.height = (h + 12) * s + "px";
        return s;
      },
      // For a same-origin iframe: keep the status bar the same colour as whatever is at the top
      // of the app right now (a header, a dark camera view, a dimmed sheet), like iOS does.
      followIframe(iframe) {
        let last = "";
        let lastB = "";
        const sync = () => {
          try {
            const doc = iframe.contentDocument;
            if (!doc || !doc.body) return;
            const win = iframe.contentWindow;
            const color = colorAt(doc, win, 1);
            if (color && color !== last) {
              last = color;
              api.setStatus(color);
            }
            const bottom = colorAt(doc, win, win.innerHeight - 1);
            if (bottom && bottom !== lastB) {
              lastB = bottom;
              api.setBottom(bottom);
            }
          } catch {}
        };
        iframe.addEventListener("load", () => {
          sync();
          try {
            const w = iframe.contentWindow;
            ["click", "hashchange", "scroll", "transitionend", "animationend"].forEach((ev) => w.addEventListener(ev, () => setTimeout(sync, 60), true));
          } catch {}
        });
        setInterval(sync, 400);
        sync();
      },
      // For screenshots: read the colour of the image's top edge.
      followImage(img) {
        const pick = (y) => {
          const c = document.createElement("canvas");
          c.width = 1;
          c.height = 1;
          const g = c.getContext("2d");
          g.drawImage(img, 12, y, 1, 1, 0, 0, 1, 1);
          const [r, gg, b] = g.getImageData(0, 0, 1, 1).data;
          return "#" + [r, gg, b].map((v) => v.toString(16).padStart(2, "0")).join("");
        };
        const sync = () => {
          try {
            api.setStatus(pick(4));
            api.setBottom(pick(Math.max(0, img.naturalHeight - 3)));
          } catch {}
        };
        img.addEventListener("load", sync);
        if (img.complete) sync();
      },
    };
    api.setStatus(opts.statusBg || "#ffffff");
    return api;
  }

  // Colour a viewer sees at the very top of a page: the element there, its parents, and any
  // see-through layers (like a sheet's dark backdrop) blended together.
  function colorAt(doc, win, y) {
    const x = Math.min(24, win.innerWidth / 2);
    const stack = doc.elementsFromPoint ? doc.elementsFromPoint(x, y) : [doc.elementFromPoint(x, y)];
    const layers = [];
    const seen = new Set();
    for (const start of stack) {
      for (let el = start; el && el.nodeType === 1; el = el.parentElement) {
        if (seen.has(el)) continue;
        seen.add(el);
        const m = win.getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
        if (!m) continue;
        const a = m.length > 3 ? Number(m[3]) : 1;
        if (a > 0) layers.push([Number(m[0]), Number(m[1]), Number(m[2]), a]);
      }
    }
    // The first opaque layer is the base; see-through layers above it are blended on top.
    let base = [255, 255, 255];
    let i = layers.findIndex((l) => l[3] >= 1);
    if (i >= 0) base = layers[i].slice(0, 3);
    else i = layers.length;
    for (let k = i - 1; k >= 0; k--) {
      const [r, g, b, a] = layers[k];
      base = [r * a + base[0] * (1 - a), g * a + base[1] * (1 - a), b * a + base[2] * (1 - a)];
    }
    return "#" + base.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  }

  function isDark(color) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(color || "").trim());
    if (!m) return false;
    const n = parseInt(m[1], 16);
    const l = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
    return l < 128;
  }

  window.IPhone = { create, W, H };
})();
