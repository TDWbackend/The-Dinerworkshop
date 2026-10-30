/* Claypot fly-through. A link with data-fly="<image selector>" lifts that image off the page,
   flies and turns it to the exact spot the pot sits on the claypot page while the screen fades
   to that page's dark ground, then opens the page. The pot is already in place when it loads. */
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const DUR = 1150;

  // where the pot sits in the claypot page's opening (mirrors .cp-hero__pot in claypot.html)
  function target() {
    const vw = innerWidth, vh = innerHeight, cw = document.documentElement.clientWidth;
    if (vw > 900) {
      const w = Math.min(vh * .88, vw * .58);
      return { x: cw + vw * .04 - w / 2, y: vh * .52, w };
    }
    const w = Math.min(vw * .82, vh * .52);
    return { x: cw / 2, y: 96 + w / 2, w };
  }
  function angleOf(el) {
    const m = getComputedStyle(el).transform;
    if (!m || m === "none") return 0;
    const v = m.match(/matrix\(([^)]+)\)/);
    if (!v) return 0;
    const [a, b] = v[1].split(",").map(Number);
    return Math.atan2(b, a) * 180 / Math.PI;
  }

  document.querySelectorAll("a[data-fly]").forEach(link => link.addEventListener("click", e => {
    const img = document.querySelector(link.dataset.fly);
    if (!img || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    const r = img.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight || !img.offsetWidth) return;   // not on screen: just go
    e.preventDefault();
    const href = link.href;

    const w0 = img.offsetWidth, cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const a0 = angleOf(img);
    const t = target();
    const a1 = Math.ceil((a0 + 200) / 360) * 360;     // keep turning forward, land square like the page's pot

    const ground = document.createElement("div");
    ground.style.cssText = "position:fixed;inset:0;z-index:1000;opacity:0;pointer-events:none;" +
      "background:radial-gradient(ellipse 46% 60% at 72% 52%, rgba(255,251,244,.95), rgba(255,251,244,0) 70%), linear-gradient(180deg, #ebe4d7 0%, #e3dbcc 55%, #e9e2d5 100%);";
    const pot = new Image();
    pot.src = img.currentSrc || img.src;
    pot.alt = "";
    pot.style.cssText = `position:fixed;z-index:1001;left:${cx - w0 / 2}px;top:${cy - w0 / 2}px;width:${w0}px;height:${w0}px;` +
      "object-fit:contain;pointer-events:none;filter:drop-shadow(0 36px 46px rgba(42,29,22,.3));will-change:transform;";
    document.body.append(ground, pot);
    img.style.visibility = "hidden";

    const s = t.w / w0;
    pot.animate([
      { transform: `translate(0px, 0px) scale(1) rotate(${a0}deg)` },
      { transform: `translate(${(t.x - cx) * .5}px, ${(t.y - cy) * .5 - 40}px) scale(${(1 + s) / 2 * 1.04}) rotate(${(a0 + a1) / 2}deg)`, offset: .55 },
      { transform: `translate(${t.x - cx}px, ${t.y - cy}px) scale(${s}) rotate(${a1}deg)` }
    ], { duration: DUR, easing: "cubic-bezier(.65, 0, .35, 1)", fill: "forwards" });
    ground.animate([{ opacity: 0 }, { opacity: 1 }], { duration: DUR * .7, delay: DUR * .15, easing: "ease-in-out", fill: "forwards" });

    try { sessionStorage.setItem("potFly", "1"); } catch (_) {}
    setTimeout(() => { location.href = href; }, DUR + 60);
    // if the visitor comes back with the browser's back button, put the page back as it was
    addEventListener("pageshow", ev => { if (ev.persisted) { ground.remove(); pot.remove(); img.style.visibility = ""; } }, { once: true });
  }));
})();
