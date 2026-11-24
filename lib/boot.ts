// Small scripts that run before the page paints. They only set classes on <html>, which the page transitions
// (public/assets/motion.css) and the home preloader read.

// Home: the preloader plays once per visit (each new tab or browser session), with motion allowed.
export const PRELOAD_BOOT = `(() => {
  let seen = false;
  try { seen = !!sessionStorage.getItem("heroSeen"); } catch (_) {}
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add(seen || still ? "hero-rest" : "preload");
})();`;

// Claypot: arriving from the homepage's claypot fly-through, the pot is already in place and the rest fades in.
export const POT_BOOT = `try { if (sessionStorage.getItem("potFly")) { sessionStorage.removeItem("potFly"); document.documentElement.classList.add("pot-arrive"); } } catch (_) {}`;

// Every page opens as a watercolour wash from its own corner (the same map is in public/assets/motion.js).
export const TX_BOOT = `(() => { const r = document.documentElement; if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const TX = { "": "c", about: "tl", dining: "br", claypot: "tr", classes: "bl", contact: "b", admin: "c" };
  const f = location.pathname.replace(/\\/+$/, "").split("/").pop(); r.dataset.tx = f in TX ? TX[f] : "r";
  let skip = r.classList.contains("preload") || r.classList.contains("pot-arrive");
  try { if (sessionStorage.getItem("txSkip")) { sessionStorage.removeItem("txSkip"); skip = true; } } catch (_) {}
  if (!skip) { r.classList.add("tx-in", "mo-hold"); try { if (!sessionStorage.getItem("heroSeen")) r.classList.add("tx-first"); } catch (_) {} } })();`;
