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

/* the ingredients: the pot turns as you scroll, and on wide screens the section holds while each
   ingredient comes up out of the pot, in close-up, and settles beside its name, one after another */
(() => {
  const ingPot = document.getElementById("ingPot");
  const track = document.getElementById("ingTrack");
  if (!ingPot || !track || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const all = [...track.querySelectorAll(".ing")];
  // all six come out of the pot together, a beat apart: rice, ebi, chicken, liver sausage, shiitake, XO sausage
  const order = [0, 3, 1, 4, 2, 5].map(i => all[i]).filter(Boolean);
  const wideQ = matchMedia("(min-width: 901px)");
  const clamp01 = v => Math.min(1, Math.max(0, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  let from = [], raf = 0, cur = 0;

  function measure() {
    from = order.map(el => {
      const pic = el.querySelector(".ing__pic");
      pic.style.transform = "";
      const a = pic.getBoundingClientRect(), b = ingPot.getBoundingClientRect();
      return { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2) };
    });
  }
  const progress = () => { const r = track.getBoundingClientRect(); return clamp01(-r.top / Math.max(1, r.height - innerHeight)); };

  function paint(p) {
    if (!wideQ.matches) {
      const r = ingPot.getBoundingClientRect();
      ingPot.style.setProperty("--r", (clamp01((innerHeight - r.top) / (innerHeight + r.height)) * 90 - 45).toFixed(2) + "deg");
      return;
    }
    ingPot.style.setProperty("--r", (p * 60 - 15).toFixed(2) + "deg");
    order.forEach((el, k) => {
      const t = clamp01((p - .04 - k * .03) / .6), e = ease(t), f = from[k] || { x: 0, y: 0 };
      const pic = el.querySelector(".ing__pic"), txt = el.querySelector(".ing__txt");
      const lift = Math.sin(Math.PI * e) * -46;          // a little arc up out of the pot
      pic.style.transform = `translate(${(f.x * (1 - e)).toFixed(1)}px, ${(f.y * (1 - e) + lift).toFixed(1)}px) scale(${(.3 + .7 * e).toFixed(3)}) rotate(${((1 - e) * -50).toFixed(1)}deg)`;
      pic.style.opacity = clamp01(t * 4).toFixed(3);
      txt.style.opacity = (.18 + .82 * clamp01((t - .35) / .5)).toFixed(3);
    });
  }
  function tick() {
    const t = progress();
    cur += (t - cur) * .12;
    if (Math.abs(t - cur) < .0004) cur = t;
    paint(cur);
    raf = cur === t ? 0 : requestAnimationFrame(tick);
  }
  function setMode() {
    track.classList.toggle("is-live", wideQ.matches);
    order.forEach(el => { el.querySelector(".ing__pic").style.cssText = ""; el.querySelector(".ing__txt").style.opacity = ""; });
    if (wideQ.matches) { measure(); cur = progress(); }
    paint(cur);
  }
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
  addEventListener("resize", setMode);
  wideQ.addEventListener("change", setMode);
  setMode();
  // the pictures load lazily; measure again once they and the pot have their size
  addEventListener("load", setMode); if (document.readyState === "complete") setMode();
  [ingPot, ...order.map(el => el.querySelector(".ing__pic"))].forEach(img => img.complete || img.addEventListener("load", setMode, { once: true }));
})();

/* takeaway order: paid online through the booking backend (assets/db.js) once payments are switched on;
   until then, or if the payment page cannot be opened, it builds a WhatsApp message to Ian instead */
(() => {
  const form = document.getElementById("orderForm");
  const $ = id => document.getElementById(id);
  let qty = 1, busy = false;
  const MAX = 10;
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  // orders need a week; pick-up is on Tuesdays, so the earliest date is the first Tuesday a week or more away
  const tomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 7); while (d.getDay() !== 2) d.setDate(d.getDate() + 1); return iso(d); };
  const isTuesday = v => new Date(v + "T12:00:00").getDay() === 2;
  $("oDate").min = tomorrow(); $("oDate").step = 7;

  // a link like claypot.html?edition=grand#order or ?keep=1 preselects
  const qs = new URLSearchParams(location.search);
  if (qs.get("edition") === "grand") $("edGrand").checked = true;
  // the pot beside the form grows when the Grand edition is chosen
  const orderSec = form.closest(".cp-order");
  const sizePot = () => orderSec && orderSec.classList.toggle("is-grand", $("edGrand").checked);
  form.querySelectorAll("input[name=edition]").forEach(r => r.addEventListener("change", sizePot));
  sizePot();
  if (qs.get("keep")) $("keepPot").checked = true;

  function total() {
    const price = +form.querySelector("input[name=edition]:checked").dataset.price;
    $("qty").textContent = qty;
    $("qMinus").disabled = qty <= 1;
    $("qPlus").disabled = qty >= MAX;
    $("oTotal").textContent = "$" + price * qty;
  }
  $("qMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); total(); });
  $("qPlus").addEventListener("click", () => { qty = Math.min(MAX, qty + 1); total(); });
  form.addEventListener("change", total);
  form.addEventListener("input", e => { const f = e.target.closest(".order__field"); if (f) f.classList.remove("is-bad"); });
  total();

  const flag = (id, bad) => { $(id).classList.toggle("is-bad", bad); return !bad; };
  form.addEventListener("submit", e => {
    e.preventDefault();
    const okD = flag("fDate", !form.date.value || form.date.value < tomorrow() || !isTuesday(form.date.value));
    const okN = flag("fName", !form.name.value.trim());
    const okP = flag("fPhone", form.phone.value.replace(/\D/g, "").length < 8);
    if (!(okD && okN && okP)) { const bad = form.querySelector(".order__field.is-bad input"); if (bad) bad.focus(); return; }
    const ed = form.querySelector("input[name=edition]:checked");
    const [y, m, d] = form.date.value.split("-").map(Number);
    const when = new Date(y, m - 1, d).toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const lines = [
      "Hi Ian, I'd like to order the Signature Claypot Rice for takeaway.",
      "",
      `Edition: ${ed.value} x ${qty}`,
      `Total: $${+ed.dataset.price * qty}`,
      `Preferred collection date: ${when}`
    ];
    if (form.keep.checked) lines.push("I'd also like to enquire about the Limited-Edition \"Rent or Keep The Pot\" release.");
    lines.push("", "Name: " + form.name.value.trim(), "WhatsApp: " + form.phone.value.trim());
    const url = "https://wa.me/6580710506?text=" + encodeURIComponent(lines.join("\n"));
    $("oAgain").href = url;
    // how the note under the button reads: saved for Ian, handed to WhatsApp, or could not be saved
    const note = how => {
      const saved = how === "saved";
      $("oSentText").textContent = saved ? "Your order has been received. Ian will confirm your order personally on WhatsApp."
        : how === "failed" ? "We could not send your order just now. Please send it to Ian on WhatsApp:"
        : "Your order is ready in WhatsApp. Press send there to reach Ian. WhatsApp didn’t open?";
      $("oAgain").textContent = how === "failed" ? "Open WhatsApp" : "Try again";
      $("oAgain").hidden = saved; $("oSentDot").hidden = saved;
      $("oSent").classList.add("on");
    };
    // online payment (assets/db.js: pay) sends the guest to the Stripe payment page; the order is confirmed
    // when the payment arrives. Without it the order goes to Ian on WhatsApp as before.
    const DB = window.DW_DB && window.DW_DB.pay ? window.DW_DB : null;
    if (!DB) { note("wa"); window.open(url, "_blank", "noopener"); return; }
    if (!flag("fEmail", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim()))) { form.email.focus(); return; }
    if (busy) return;
    busy = true; $("oBtn").disabled = true;
    DB.fn("claypot-checkout", {
      pickup_date: form.date.value, edition: ed.dataset.key, qty, keep_pot: form.keep.checked,
      name: form.name.value.trim(), phone: form.phone.value.trim(), email: form.email.value.trim(), company: form.company.value
    }).then(out => { if (!out || !out.url) throw 0; location.href = out.url; })
      .catch(() => { note("failed"); busy = false; $("oBtn").disabled = false; });
  });
  // with online payment on, the form asks for an email and the button pays instead of opening WhatsApp
  document.addEventListener("dw:ready", () => {
    if (!(window.DW_DB && window.DW_DB.pay)) return;
    $("fEmail").hidden = false;
    const b = $("oBtn");
    [...b.childNodes].forEach(n => { if (n.nodeType === 3 || (n.classList && n.classList.contains("btn__roll"))) n.remove(); });
    b.prepend(document.createTextNode("Pay and Place Order "));
    $("oFine").textContent = "Secure payment by Stripe. Your invoice and receipt arrive by email.";
    // back from the payment page
    const back = new URLSearchParams(location.search).get("paid");
    if (back === "1" || back === "0") {
      $("oSentText").textContent = back === "1" ? "Thank you. Your payment has been received and your order is confirmed. Your invoice and receipt are on their way by email."
        : "The payment was not completed, so no order has been placed. You are welcome to try again.";
      $("oAgain").hidden = true; $("oSentDot").hidden = true; $("oSent").classList.add("on");
      history.replaceState(null, "", location.pathname + "#order");
      setTimeout(() => $("oSent").scrollIntoView({ block: "center" }), 600);     // the message sits under the form
    }
  });
})();

/* guest endorsements: each quote fades in, holds long enough to be read, then the next */
(() => {
  const stage = document.getElementById("say");
  if (!stage) return;
  const items = [...stage.querySelectorAll(".say__item")];
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (items.length < 2 || still) return;
  let i = 0, t0 = 0, raf = 0, paused = false, dur = 0, done = 0;
  const hold = el => 3500 + el.textContent.trim().split(/\s+/).length * 65;   // reading time, by length
  function show(n) {
    items[i].classList.remove("is-on"); items[i].classList.add("is-off");
    const prev = items[i];
    setTimeout(() => prev.classList.remove("is-off"), 700);
    i = n; items[i].classList.add("is-on");
    dur = hold(items[i]); t0 = performance.now();
  }
  function tick(now) {
    if (!paused) {
      done = Math.min(1, (now - t0) / dur);
      if (done >= 1) show((i + 1) % items.length);
    } else t0 = now - done * dur;
    raf = requestAnimationFrame(tick);
  }
  stage.addEventListener("mouseenter", () => { paused = true; });
  stage.addEventListener("mouseleave", () => { paused = false; });
  // only run while on screen
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { if (!raf) { dur = hold(items[i]); t0 = performance.now() - done * dur; raf = requestAnimationFrame(tick); } }
    else { cancelAnimationFrame(raf); raf = 0; }
  }), { threshold: .3 }).observe(stage);
})();
