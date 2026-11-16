/* Page transitions (styles in motion.css). Each page folds open its own way; following a link to another page
   folds that page's panel in first, then goes. Links that already have their own hand-off (booking pop-up,
   claypot fly-through, About zoom) stop the click themselves, so they are left alone.
   Also: release the page's reveals once the panel clears, and wipe rows of cards in from left to right. */
(() => {
  const root = document.documentElement;
  const TX = { "about.html": "left", "dining.html": "split", "claypot.html": "iris", "classes.html": "down", "contact.html": "diag", "404.html": "fade" };
  const txFor = path => { const f = (path.split("/").pop() || "index").replace(/\.html?$/, "") + ".html"; return TX[f] || "up"; };
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!still) document.addEventListener("click", e => {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin) return;
    if (/\.[a-z0-9]+$/i.test(u.pathname) && !/\.html?$/i.test(u.pathname)) return;      // files, not pages
    if (u.pathname === location.pathname && u.search === location.search) return;     // same page, e.g. #anchors
    e.preventDefault();
    const cover = document.createElement("div");
    cover.className = "tx-cover";
    cover.dataset.tx = txFor(u.pathname);
    document.body.appendChild(cover);
    setTimeout(() => { location.href = u.href; }, 560);
  });
  // back/forward from the cache: take the panel away again
  addEventListener("pageshow", ev => { if (ev.persisted) document.querySelectorAll(".tx-cover").forEach(c => c.remove()); });

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
  if (root.classList.contains("mo-hold")) setTimeout(() => root.classList.remove("mo-hold"), 600);
})();
