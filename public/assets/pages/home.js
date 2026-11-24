/* nav: compact when scrolled, light text over dark sections */
const nav = document.getElementById("nav");
const darks = [...document.querySelectorAll("[data-dark], #heroStage")];
function navState() {
  nav.classList.toggle("scrolled", scrollY > 60);
  const probe = 40;
  const onDark = darks.some(s => { if (!s.hasAttribute("data-dark")) return false; const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; });
  nav.classList.toggle("on-dark", onDark);
}
addEventListener("scroll", navState, { passive: true });
navState();
document.getElementById("burger").addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll(".nav__links a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

/* hero: the logo is seen first, then the preloader fades away. The clip does not play by itself:
   scrolling turns the plate, so the drawing comes to life under the visitor's hand. At the end the words arrive. */
const hero = document.getElementById("heroVideo");
const rootEl = document.documentElement;
const pre = document.getElementById("pre");
const stage = document.getElementById("heroStage"), track = document.getElementById("heroTrack");
const T0 = performance.now(), READ = 2150;   // the logo is seen for this long before anything moves
const CLIP_END = .8;                          // share of the scroll used by the clip; the rest holds the words
const REAL_AT = .4;                           // from here on the dish reads as a photo, so the page goes dark
let revealTimer = 0;
function revealHero() {
  if (!rootEl.classList.contains("preload")) return;
  const left = READ - (performance.now() - T0);
  if (left > 0) { if (!revealTimer) revealTimer = setTimeout(() => { revealTimer = 0; revealHero(); }, left); return; }
  rootEl.classList.remove("preload");
  if (pre) { pre.classList.add("is-out"); setTimeout(() => pre.remove(), 2600); }
  try { sessionStorage.setItem("heroSeen", "1"); } catch (_) {}
}
function setLook(real) {
  stage.classList.toggle("is-sketch", !real);
  stage.querySelector(".hero__say--sketch").setAttribute("aria-hidden", real ? "true" : "false");
  stage.querySelector(".hero__say--real").setAttribute("aria-hidden", real ? "false" : "true");
  if (real) stage.setAttribute("data-dark", ""); else stage.removeAttribute("data-dark");
  navState();
}
(() => {
  if (!hero || !track) { revealHero(); return; }
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {   // no scrubbing: the finished dish and the words
    hero.poster = hero.dataset.end; setLook(true); stage.classList.add("is-told"); revealHero(); return;
  }
  // load the whole clip first so every scroll position can be shown instantly
  const src = innerWidth <= 700 ? hero.dataset.srcSmall : hero.dataset.src;
  fetch(src).then(r => { if (!r.ok) throw 0; return r.blob(); }).then(b => { hero.src = URL.createObjectURL(b); hero.load(); })
    .catch(() => { hero.preload = "auto"; hero.src = src; });
  hero.addEventListener("loadeddata", revealHero, { once: true });
  setTimeout(revealHero, 3800);

  const clamp01 = v => Math.min(1, Math.max(0, v));
  let cur = 0, raf = 0;
  const progress = () => { const r = track.getBoundingClientRect(); return clamp01(-r.top / Math.max(1, r.height - innerHeight)); };
  function paint() {
    const p = progress(), target = clamp01(p / CLIP_END);
    cur += (target - cur) * .14;                       // ease toward the scroll so the turn glides
    if (Math.abs(target - cur) < .0005) cur = target;
    const d = hero.duration;
    if (d && isFinite(d)) { const t = Math.min(d - .04, cur * d); if (Math.abs(hero.currentTime - t) > .008) hero.currentTime = t; }
    stage.classList.toggle("is-moving", p > .02);
    const real = cur > REAL_AT;
    if (real !== stage.hasAttribute("data-dark")) setLook(real);
    stage.classList.toggle("is-told", p >= CLIP_END - .02);
    raf = cur === target ? 0 : requestAnimationFrame(paint);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(paint); };
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", kick);
  hero.addEventListener("loadedmetadata", kick);
  kick();
})();

/* reserve scene: the walk from the living room to the dining table follows the scroll; the invitation
   comes out once the camera has arrived. The clip is fetched whole shortly before the scene is reached. */
(() => {
  const v = document.getElementById("tourVideo"), track = document.getElementById("tourTrack"), stage = document.getElementById("tourStage");
  if (!v || !track) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { v.poster = v.dataset.end; stage.classList.add("is-told"); return; }
  const END = .82;                                     // share of the scroll used by the walk; the rest holds the words
  const clamp01 = x => Math.min(1, Math.max(0, x));
  let cur = 0, raf = 0, loaded = false;
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (!e.isIntersecting || loaded) return;
    loaded = true; o.disconnect();
    const src = innerWidth <= 700 ? v.dataset.srcSmall : v.dataset.src;
    fetch(src).then(r => { if (!r.ok) throw 0; return r.blob(); }).then(b => { v.src = URL.createObjectURL(b); v.load(); })
      .catch(() => { v.preload = "auto"; v.src = src; });
  }), { rootMargin: "1200px 0px" }).observe(track);
  const progress = () => { const r = track.getBoundingClientRect(); return clamp01(-r.top / Math.max(1, r.height - innerHeight)); };
  function paint() {
    const p = progress(), target = clamp01(p / END);
    cur += (target - cur) * .14;
    if (Math.abs(target - cur) < .0005) cur = target;
    const d = v.duration;
    if (d && isFinite(d)) { const t = Math.min(d - .04, cur * d); if (Math.abs(v.currentTime - t) > .008) v.currentTime = t; }
    stage.classList.toggle("is-told", p >= END - .02);
    raf = cur === target ? 0 : requestAnimationFrame(paint);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(paint); };
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", kick);
  v.addEventListener("loadedmetadata", kick);
  kick();
})();

/* reveal on scroll */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".rv").forEach(el => io.observe(el));

/* about: the estate sketch draws itself in each time the section comes into view */
const estate = document.getElementById("estateReveal");
if (estate) {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // hold on the blank parchment (first frame) until it plays; reduced motion keeps the finished poster
  // 4K for screens that show more than ~2600 device pixels across (Retina laptops, big monitors); 2560 for phones and smaller screens
  const px = Math.max(screen.width, screen.height) * (devicePixelRatio || 1);
  if (px > 2600) estate.src = estate.getAttribute("data-src-4k");
  const copy = document.getElementById("estateCopy");
  const SPEED = 2;     // the 6-second sketch draws itself in 3 seconds, then the words come out
  if (still) { copy.classList.add("in"); }
  else {
    estate.preload = "auto"; estate.removeAttribute("poster");
    estate.addEventListener("loadedmetadata", () => { estate.playbackRate = SPEED; });
    estate.addEventListener("play", () => { estate.playbackRate = SPEED; copy.classList.remove("in"); });
    estate.addEventListener("ended", () => copy.classList.add("in"));
    estate.addEventListener("error", () => copy.classList.add("in"));
  }
  new IntersectionObserver(es => es.forEach(e => {
    if (still) return;
    if (e.isIntersecting && e.intersectionRatio >= .45) {
      if (estate.paused && !estate.ended) estate.play().catch(() => {});
    } else if (!e.isIntersecting) {
      estate.pause(); estate.currentTime = 0; copy.classList.remove("in");
    }
  }), { threshold: [0, .45] }).observe(estate);
}


/* the evening: on desktop the section pins and each scroll step wipes the next card in, left to right */
(() => {
  const track = document.getElementById("expTrack");
  if (!track) return;
  const cards = [...track.querySelectorAll(".ecard")];
  const wide = matchMedia("(min-width: 901px)");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp01 = v => Math.min(1, Math.max(0, v));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  let cur = 0, raf = 0;
  const target = () => { const r = track.getBoundingClientRect(); return clamp01(-r.top / Math.max(1, r.height - innerHeight)); };
  // the first card is already there with the heading; the other three follow one by one over a short scroll
  const paint = p => cards.forEach((c, i) => c.style.setProperty("--e", i === 0 ? 1 : ease(clamp01((p - (.04 + (i - 1) * .27)) / .26)).toFixed(4)));
  function tick() {
    const t = target();
    cur += (t - cur) * .08;
    if (Math.abs(t - cur) < .0004) cur = t;
    paint(cur);
    raf = cur === t ? 0 : requestAnimationFrame(tick);
  }
  function kick() {
    if (!wide.matches || still) return;
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; cur = target(); paint(cur); return; }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function setMode() {
    if (wide.matches && !still) {
      cards.forEach(c => { c.classList.remove("rv", "in", "d1", "d2", "d3"); io.unobserve(c); });
      cur = target(); paint(cur);
    } else {
      cards.forEach((c, i) => { c.style.removeProperty("--e"); if (!c.classList.contains("in")) { c.classList.add("rv"); if (i % 2) c.classList.add("d2"); io.observe(c); } });
    }
  }
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", () => { setMode(); kick(); });
  document.addEventListener("visibilitychange", kick);
  setMode();
})();

/* ──────────────────────────────────────────────────────────
   THE FOOD. Signature dishes on one plate. On desktop the
   section pins; each scroll step turns the plate and, as it
   turns, the next dish appears on it. The plate holds still
   while you read. On phones the dishes simply stack.
   ────────────────────────────────────────────────────────── */
(() => {
  const track = document.getElementById("sigTrack");
  if (!track) return;
  const dishes = [...track.querySelectorAll(".dish")];
  const N = dishes.length;
  const TURN = 140;                                  // degrees the plate turns per dish
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp01 = v => Math.min(1, Math.max(0, v));
  const smooth = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
  let cur = 0, raf = 0, active = -1;

  const progress = () => { const r = track.getBoundingClientRect(); return clamp01(-r.top / Math.max(1, r.height - innerHeight)); };
  // a little hold at the start and end, then each turn happens in the middle half of its step
  function pos(p) {
    const raw = clamp01((p - .04) / .9) * (N - 1);
    const k = Math.min(N - 2, Math.floor(raw));
    return k + smooth((raw - k - .25) / .5);
  }
  function paint(p) {
    const at = pos(p), k = Math.floor(at), f = at - k;
    dishes.forEach((d, i) => {
      const [name, plate, text] = d.children;
      plate.style.transform = "";
      // the dish on the plate now stays put underneath; the next one fades in over it as the plate turns
      plate.style.opacity = i === k ? 1 : i === k + 1 ? smooth(f * 1.15 - .08).toFixed(3) : 0;
      // every dish, the claypot included, sits upright when it is the one showing and turns in and out around that
      const spin = (at - i) * TURN;
      plate.firstElementChild.style.transform = `rotate(${spin.toFixed(2)}deg)`;
      const t = clamp01(1 - Math.abs(at - i) * 2.4);
      name.style.opacity = text.style.opacity = t.toFixed(3);
      name.style.transform = `translateY(${(-(at - i) * 40).toFixed(1)}px)`;
      text.style.transform = `translateY(${(-(at - i) * 60).toFixed(1)}px)`;
    });
    const now = Math.round(at);
    if (now !== active) { active = now; dishes.forEach((d, i) => d.classList.toggle("is-on", i === now)); }
  }
  function tick() {
    const t = progress();
    cur += (t - cur) * .09;
    if (Math.abs(t - cur) < .0003) cur = t;
    paint(cur);
    raf = cur === t ? 0 : requestAnimationFrame(tick);
  }
  function kick() {
    if (still) return;
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; cur = progress(); paint(cur); return; }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function setMode() {
    dishes.forEach(d => [...d.children].forEach(el => { el.classList.remove("rv", "in", "d1", "d2"); io.unobserve(el); }));
    if (still) { dishes.forEach((d, i) => { d.classList.toggle("is-on", i === 0); [...d.children].forEach(el => { el.style.opacity = i === 0 ? 1 : 0; }); }); return; }
    cur = progress(); active = -1; paint(cur);
  }
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", () => { setMode(); kick(); });
  document.addEventListener("visibilitychange", kick);
  setMode();
})();

/* About Us: the section lines up with the screen, the zoom clip takes over from the drawing's last frame,
   moves in on the house, and the About page opens on that final frame */
(() => {
  const link = document.getElementById("aboutZoom"), clip = document.getElementById("estateZoom"), teaser = document.getElementById("journey");
  if (!link || !clip) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  new IntersectionObserver((es, io) => es.forEach(e => { if (e.isIntersecting) { clip.preload = "auto"; clip.load(); io.disconnect(); } }), { threshold: .2 }).observe(teaser);
  let going = false;
  link.addEventListener("click", e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    e.preventDefault();
    if (going) return; going = true;
    const href = link.href;
    const go = () => { if (going === "done") return; going = "done"; try { sessionStorage.setItem("txSkip", "1"); } catch (_) {} location.href = href; };
    // the whole hand-off, from the press to the About page, takes 3 seconds: the clip is sped up to fit what is left
    const TOTAL = 3000;
    const start = waited => {
      const left = TOTAL - waited;
      const pace = () => { const d = clip.duration; clip.playbackRate = clip.defaultPlaybackRate = d && isFinite(d) ? Math.max(1, d * 1000 / left) : 2.4; };
      teaser.classList.add("is-zooming");
      clip.currentTime = 0;
      pace(); clip.addEventListener("loadedmetadata", pace); clip.addEventListener("play", pace);
      const p = clip.play();
      if (p && p.catch) p.catch(go);
      clip.addEventListener("ended", go);
      clip.addEventListener("error", go);
      setTimeout(go, left + 150);              // never longer, even if the clip is slow to load
    };
    // bring the section flush with the screen first, so the frame is exactly the About page's frame
    const off = teaser.getBoundingClientRect().top;
    if (Math.abs(off) > 2) { const wait = Math.min(600, 200 + Math.abs(off) * .4); scrollTo({ top: scrollY + off, behavior: "smooth" }); setTimeout(() => start(wait), wait); }
    else start(0);
    addEventListener("pageshow", ev => { if (ev.persisted) { teaser.classList.remove("is-zooming"); clip.pause(); going = false; } }, { once: true });
  });
})();
