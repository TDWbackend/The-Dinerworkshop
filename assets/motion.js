/* Page arrival: release the page's reveals once the curtain lifts, and wipe rows of cards in from left to right
   (styles in motion.css). A fully clipped card does not count as on screen, so each row is watched through its
   container: when the row comes into view, its cards are revealed one after another. */
(() => {
  const root = document.documentElement;
  const CARDS = ".ing, .ct-info__item, .why, .skill, .philo__item, .how__card, .fact, .card, .policy .row";
  const groups = new Map();
  document.querySelectorAll(CARDS).forEach(el => {
    if (!el.classList.contains("rv")) return;
    const p = el.parentElement;
    if (!groups.has(p)) groups.set(p, []);
    groups.get(p).push(el);
  });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    (groups.get(e.target) || []).forEach(el => el.classList.add("in"));
    io.unobserve(e.target);
  }), { threshold: .15, rootMargin: "0px 0px -6% 0px" });
  groups.forEach((list, parent) => { list.forEach((el, i) => el.style.setProperty("--mo-i", i % 4)); io.observe(parent); });
  if (root.classList.contains("mo-hold")) setTimeout(() => root.classList.remove("mo-hold"), 950);
})();
