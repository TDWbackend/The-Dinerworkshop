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
/* split the heading and paragraph above the steps into words for their entrance */
document.querySelectorAll(".wordrise").forEach(el => {
  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute("aria-label", el.textContent.trim());
  el.textContent = "";
  words.forEach((w, i) => {
    const sp = document.createElement("span");
    sp.className = "w"; sp.textContent = w; sp.style.setProperty("--i", i); sp.setAttribute("aria-hidden", "true");
    el.append(sp, i < words.length - 1 ? " " : "");
  });
});

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".rv").forEach(el => io.observe(el));

