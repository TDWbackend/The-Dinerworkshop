/* "Why The Dinerworkshop?": the dishes follow the scroll in from the sides, settling as the section reaches the middle */
(() => {
  const sec = document.getElementById("why"), dishes = sec && sec.querySelectorAll(".why-dish");
  if (!dishes || !dishes.length) return;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let raf = 0;
  const paint = () => {
    raf = 0;
    if (innerWidth < 1100) return;
    const b = sec.getBoundingClientRect();
    const p = still ? 1 : Math.min(1, Math.max(0, (innerHeight - b.top) / (innerHeight * .75 + b.height * .25)));
    const e = 1 - Math.pow(1 - p, 3);                        // eases in, settles gently
    dishes.forEach(d => d.style.setProperty("--p", e.toFixed(4)));
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(paint); };
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", kick);
  paint();
})();
