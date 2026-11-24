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

/* program framework: on desktop the section pins and each scroll step raises the next card onto its stair */
const track = document.getElementById("stairTrack");
const steps = [...track.querySelectorAll(".step")];
const wide = matchMedia("(min-width: 901px)");
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp01 = v => Math.min(1, Math.max(0, v));
const easeOut = t => 1 - Math.pow(1 - t, 3);
let cur = 0, raf = 0;
function target() {
  const r = track.getBoundingClientRect();
  return clamp01(-r.top / Math.max(1, r.height - innerHeight));
}
function paint(p) {
  // level 1 is already standing on its stair with the heading; 2 and 3 follow over a short scroll
  steps.forEach((s, i) => s.style.setProperty("--e", i === 0 ? 1 : easeOut(clamp01((p - (.04 + (i - 1) * .36)) / .32)).toFixed(4)));
}
function tick() {
  const t = target();
  cur += (t - cur) * .1;
  if (Math.abs(t - cur) < .0004) cur = t;
  paint(cur);
  raf = cur === t ? 0 : requestAnimationFrame(tick);
}
function kick() {
  if (!wide.matches || still) return;
  // hidden tabs pause animation frames, so jump straight to the right state instead of leaving cards invisible
  if (document.hidden) { cancelAnimationFrame(raf); raf = 0; cur = target(); paint(cur); return; }
  if (!raf) raf = requestAnimationFrame(tick);
}
document.addEventListener("visibilitychange", kick);
function setMode() {
  if (wide.matches && !still) {
    steps.forEach(s => { s.classList.remove("rv", "in"); io.unobserve(s); });
    cur = target(); paint(cur);
  } else {
    steps.forEach((s, i) => { s.style.removeProperty("--e"); if (!s.classList.contains("in")) { s.classList.add("rv"); if (i) s.classList.add("d" + i); io.observe(s); } });
  }
}
addEventListener("scroll", kick, { passive: true });
addEventListener("resize", () => { setMode(); kick(); });
wide.addEventListener("change", setMode);
setMode();
