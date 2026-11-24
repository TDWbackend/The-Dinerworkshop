/* nav: compact when scrolled, light text over dark sections */
const nav = document.getElementById("nav");
const darks = [...document.querySelectorAll("[data-dark]")];
function navState() {
  nav.classList.toggle("scrolled", scrollY > 60);
  const probe = 40;
  nav.classList.toggle("on-dark", darks.some(s => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; }));
}
addEventListener("scroll", navState, { passive: true });
navState();
document.getElementById("burger").addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll(".nav__links a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

/* reveal on scroll */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".rv").forEach(el => io.observe(el));

/* the estate sketch draws itself in each time the opening comes into view */
const estate = document.getElementById("estateReveal");
if (estate) {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const px = Math.max(screen.width, screen.height) * (devicePixelRatio || 1);
  if (px > 2600) estate.src = estate.getAttribute("data-src-4k");
  if (!still) { estate.preload = "auto"; estate.removeAttribute("poster"); estate.addEventListener("play", () => { estate.playbackRate = 1.7; }); }
  new IntersectionObserver(es => es.forEach(e => {
    if (still) return;
    if (e.isIntersecting && e.intersectionRatio >= .45) {
      if (estate.paused && !estate.ended) estate.play().catch(() => {});
    } else if (!e.isIntersecting) {
      estate.pause(); estate.currentTime = 0;
    }
  }), { threshold: [0, .45] }).observe(estate);
}

/* history: the knife travels down the line with the middle of the screen, cutting it as it goes;
   each chapter comes in from its own side once the knife reaches it */
(() => {
  const body = document.getElementById("tlBody");
  if (!body) return;
  const knife = document.getElementById("tlKnife");
  const cut = document.getElementById("tlCut");
  const chs = [...body.querySelectorAll(".ch")];
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let ticking = false;
  function update() {
    ticking = false;
    const r = body.getBoundingClientRect();
    const kh = knife.offsetHeight;
    const y = Math.max(0, Math.min(r.height - kh, innerHeight * .55 - r.top));   // top of the knife, measured down the line
    const tip = y + kh;                                                            // the blade's tip leads the cut
    cut.style.height = tip + "px";
    knife.style.top = y + "px";
    chs.forEach(c => {
      const mid = c.offsetTop + c.offsetHeight / 2;
      if (tip >= c.offsetTop - innerHeight * .25) c.classList.add("in");
      c.classList.toggle("cut", tip >= mid);
    });
  }
  if (still) { chs.forEach(c => c.classList.add("in", "cut")); return; }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update);
  update();
})();

/* why: the words come up one by one as the paragraph rises, all there once it reaches the middle of the screen */
(() => {
  const p = document.getElementById("whyWords");
  if (!p) return;
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement("span"); s.className = "w"; s.textContent = part; frag.appendChild(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(p);
  const words = [...p.querySelectorAll(".w")];
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { words.forEach(w => w.classList.add("on")); return; }
  let ticking = false;
  function paint() {
    ticking = false;
    const r = p.getBoundingClientRect();
    // 0 when the paragraph's top enters at the bottom of the screen, 1 when its middle reaches the middle of the screen
    const start = innerHeight, end = innerHeight / 2 - r.height / 2;
    const t = Math.min(1, Math.max(0, (start - r.top) / Math.max(1, start - end)));
    const lit = Math.round(t * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < lit));
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
  addEventListener("resize", paint);
  paint();
})();
