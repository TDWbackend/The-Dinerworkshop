/* nav: compact when scrolled, light text over dark sections */
const nav = document.getElementById("nav");
/* opening clip: the sharper file on big screens; with reduced motion, just the dining room */
(() => {
  const v = document.getElementById("ctVideo");
  if (!v) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { v.removeAttribute("autoplay"); v.removeAttribute("src"); v.poster = v.dataset.end; v.load(); return; }
  const px = Math.max(screen.width, screen.height) * (devicePixelRatio || 1);
  if (px > 2600 && v.dataset.src4k) { v.src = v.dataset.src4k; v.play().catch(() => {}); }
})();
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
