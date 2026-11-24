/* About opening: unless the visitor came through Home's "About Us" zoom (which already ends on this picture),
   the same zoom clip plays here: it moves in on the house and finishes on the same frame as the still.
   The words come in as it nears the end. */
(() => {
  const v = document.getElementById("aboutDraw"), r = document.documentElement;
  if (!v || r.classList.contains("from-zoom") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  v.src = v.dataset.src;
  const RATE = 1.5;                                                              // the clip is 6 seconds; here it takes 4
  const pace = () => { v.playbackRate = v.defaultPlaybackRate = RATE; };
  v.addEventListener("loadedmetadata", pace); v.addEventListener("play", pace);
  v.preload = "auto";
  r.classList.add("about-draw", "about-hold");
  const done = () => { r.classList.remove("about-hold"); };
  const giveUp = () => { r.classList.remove("about-draw", "about-hold"); };          // could not play: the still is shown
  // start once the page's own opening (the wash, or the logo on a first visit) is under way
  const wait = r.classList.contains("tx-first") ? 2300 : 250;
  let started = false;
  const go = () => { if (started) return; started = true; pace(); v.play().catch(giveUp); };
  v.addEventListener("canplay", () => setTimeout(go, Math.max(0, wait - (performance.now() - T0))), { once: true });
  const T0 = performance.now();
  v.addEventListener("timeupdate", () => { if (v.duration && v.currentTime > v.duration * .62) done(); });
  v.addEventListener("ended", done);
  v.addEventListener("error", giveUp);
  setTimeout(() => { if (!started) giveUp(); }, 6000);                             // never leave a blank page
})();
