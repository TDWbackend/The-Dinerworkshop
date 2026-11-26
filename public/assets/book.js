/* Booking form. Normally a pop-up that any link with [data-book] opens; on a page with a
   #bookInline element it sits in the page instead, always open, and [data-book] scrolls to it.
   Three steps: occasion → party → details. On submit the request is saved to the booking backend
   (assets/db.js) for Ian to accept or decline; if the backend is not set up, or cannot be reached,
   it opens WhatsApp to Ian with every answer filled in instead. */
(function () {
  const WA = "6580710506";
  const MAIL = "thedinerworkshop@gmail.com";
  const MIN_G = 6, MAX_G = 10;              // doc: minimum 6, maximum 10 guests
  const LEAD_DAYS = 14;                       // doc: at least 2 weeks in advance

  const ico = {
    celebration: '<svg class="ic" viewBox="0 0 36 32" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><g transform="rotate(-14 12 17)"><path d="M8.5 6h7l-1 8.5a2.5 2.5 0 0 1-5 0z"/><path d="M12 17v9M9 26h6"/></g><g transform="rotate(14 24 17)"><path d="M20.5 6h7l-1 8.5a2.5 2.5 0 0 1-5 0z"/><path d="M24 17v9M21 26h6"/></g><path d="M18 1.5v3M16.5 3h3M13 3.5l.8 1.2M23 3.5l-.8 1.2"/></svg>',
    friends: '<svg class="ic" viewBox="0 0 34 30" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><circle cx="8" cy="11" r="3.2"/><circle cx="17" cy="9" r="3.4"/><circle cx="26" cy="11" r="3.2"/><path d="M2.5 24a5.5 5.5 0 0 1 11 0M10.5 23a6.5 6.5 0 0 1 13 0M20.5 24a5.5 5.5 0 0 1 11 0"/></svg>',
    family: '<svg class="ic" viewBox="0 0 34 30" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><circle cx="9" cy="7.5" r="3.3"/><circle cx="25" cy="7.5" r="3.3"/><circle cx="17" cy="15.5" r="2.4"/><path d="M3.5 26v-6.5a5.5 5.5 0 0 1 11 0M19.5 19.5a5.5 5.5 0 0 1 11 0V26M13 26a4 4 0 0 1 8 0"/></svg>',
    private: '<svg class="ic" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3"><g transform="translate(16 16)"><ellipse rx="3.6" ry="7" cy="-7.6"/><ellipse rx="3.6" ry="7" cy="-7.6" transform="rotate(60)"/><ellipse rx="3.6" ry="7" cy="-7.6" transform="rotate(120)"/><ellipse rx="3.6" ry="7" cy="-7.6" transform="rotate(180)"/><ellipse rx="3.6" ry="7" cy="-7.6" transform="rotate(240)"/><ellipse rx="3.6" ry="7" cy="-7.6" transform="rotate(300)"/><circle r="2.6"/></g></svg>'
  };
  const tick = '<span class="tick"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2.5 6.2l2.3 2.3 4.7-5"/></svg></span>';
  const occasions = [
    ["celebration", "A celebration"],
    ["friends", "An evening with friends"],
    ["family", "A family gathering"],
    ["private", "A private occasion"]
  ];

  const html = `
  <div class="bk" id="bk" aria-hidden="true">
    <div class="bk__scrim" data-close></div>
    <form class="bk__card" role="dialog" aria-modal="true" aria-labelledby="bkTitle1" novalidate>
      <button class="bk__close" type="button" data-close aria-label="Close"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 3l10 10M13 3L3 13"/></svg></button>
      <div class="bk__head">
        <div class="bk__sketch" aria-hidden="true">
          <img src="/assets/book/house.jpg" alt="" class="on"><img src="/assets/book/trees.jpg" alt=""><img src="/assets/book/gate.jpg" alt="">
        </div>
        <img class="bk__logo" src="/assets/logo-ink.png" alt="The Dinerworkshop">
        <p class="bk__label" id="bkLabel">01 / 03 · The Occasion</p>
        <div class="bk__bar"><span id="bkBar"></span></div>
      </div>

      <div class="bk__body" id="bkBody">
        <section class="bk__step is-on" data-step="1">
          <h2 id="bkTitle1">What brings you to our table?</h2>
          <p class="bk__sub">Tell us what you are celebrating.</p>
          <div class="bk__occ">
            ${occasions.map(([k, t]) => `<input type="radio" name="occasion" id="bk-${k}" value="${t}"><label for="bk-${k}">${tick}${ico[k]}<span>${t.replace(/ (with|gathering|occasion)/, "<br>$1").replace("<br>with", " <br>with")}</span></label>`).join("")}
          </div>
        </section>

        <section class="bk__step" data-step="2">
          <h2>Who is joining you?</h2>
          <div class="bk__count" role="group" aria-label="Number of guests">
            <button type="button" id="bkMinus" aria-label="Fewer guests"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 9h12"/></svg></button>
            <output id="bkGuests" aria-live="polite">6 guests</output>
            <button type="button" id="bkPlus" aria-label="More guests"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 9h12M9 3v12"/></svg></button>
          </div>
          <p class="bk__note">Group Size: 6–10 guests · Wed – Sun</p>
          <div class="bk__field" id="bkDateF" role="group" aria-labelledby="bkDateL">
            <span id="bkDateL">Preferred date</span>
            <input type="hidden" name="date" id="bkDate">
            <div class="bk__cal">
              <div class="bk__cal-top">
                <button type="button" id="bkCalPrev" aria-label="Previous month"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13 8H3M7 4L3 8l4 4"/></svg></button>
                <p id="bkCalMonth" aria-live="polite"></p>
                <button type="button" id="bkCalNext" aria-label="Next month"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></button>
              </div>
              <div class="bk__cal-dow" aria-hidden="true"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
              <div class="bk__cal-grid" id="bkCalGrid"></div>
              <ul class="bk__cal-key">
                <li id="bkCalKeySel" aria-live="polite">Selected date</li>
                <li class="k-res" id="bkCalKeyRes" hidden>Reserved</li>
              </ul>
            </div>
            <em class="hint">Wednesday to Sunday, at least 2 weeks in advance.</em>
            <em class="bk__err" id="bkDateErr">Please choose a Wednesday to Sunday at least 2 weeks from today.</em>
          </div>
          <label class="bk__field">
            <span>Dietary requirements</span>
            <input type="text" name="dietary" placeholder="Optional" autocomplete="off">
          </label>
          <label class="bk__field">
            <span>Anything we should know?</span>
            <textarea name="notes" placeholder="Share a little about your evening"></textarea>
          </label>
        </section>

        <section class="bk__step" data-step="3">
          <h2>Let us arrange the rest.</h2>
          <label class="bk__field bk__line" id="bkNameF">
            <span>Your name</span>
            <input type="text" name="name" autocomplete="name" required>
            <em class="bk__err">Please tell us your name.</em>
          </label>
          <label class="bk__field bk__line" id="bkPhoneF">
            <span>WhatsApp number</span>
            <input type="tel" name="phone" autocomplete="tel" inputmode="tel" required>
            <em class="bk__err">Please add a number we can reach you on.</em>
          </label>
          <label class="bk__field bk__line" id="bkEmailF">
            <span>Email address <small>Optional</small></span>
            <input type="email" name="email" autocomplete="email">
            <em class="bk__err">That email doesn’t look right.</em>
          </label>
          <label class="bk__field bk__line" id="bkBdayF">
            <span>Birthday <small>Optional</small></span>
            <input type="date" name="birthday" autocomplete="bday" min="1900-01-01">
            <em class="bk__err">That date doesn’t look right.</em>
          </label>
          <input type="text" name="company" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
          <p class="bk__personal">Ian will be in touch personally to discuss your preferred evening.</p>
        </section>

        <section class="bk__step bk__done" data-step="4">
          <h2 id="bkDoneTitle">Thank you.</h2>
          <p class="bk__sub" id="bkDoneSub"></p>
          <p class="alt"><span id="bkAltLead"></span> <a id="bkWaAgain" href="#" target="_blank" rel="noopener"></a>.</p>
        </section>
      </div>

      <div class="bk__foot">
        <button class="btn" type="submit" id="bkNext">Continue</button>
        <p class="bk__fine" id="bkFine" hidden>A 50% non-refundable payment secures your exclusive evening on the calendar. Remaining 50% payment on the day of dining.</p>
        <button class="bk__back" type="button" id="bkBack" hidden>Back</button>
      </div>
    </form>
  </div>`;

  const inlineHost = document.getElementById("bookInline");
  (inlineHost || document.body).insertAdjacentHTML("beforeend", html);
  const $ = id => document.getElementById(id);
  const root = $("bk"), form = root.querySelector("form"), body = $("bkBody");
  const inline = !!inlineHost;
  if (inline) { root.classList.add("bk--inline", "is-open"); root.setAttribute("aria-hidden", "false"); form.removeAttribute("aria-modal"); form.setAttribute("role", "form"); }
  const steps = [...root.querySelectorAll(".bk__step")];
  const sketches = [...root.querySelectorAll(".bk__sketch img")];
  const labels = ["01 / 03 · The Occasion", "02 / 03 · Your Party", "03 / 03 · Your Details", "Request sent to WhatsApp"];
  let step = 1, guests = MIN_G, opener = null, waUrl = "", busy = false;

  // the booking backend: evenings Ian has already confirmed cannot be requested again
  const DB = window.DW_DB && window.DW_DB.ready ? window.DW_DB : null;
  const taken = new Set();
  if (DB) DB.call("/rest/v1/rpc/booked_dates", { method: "POST", body: {} })
    .then(rows => (rows || []).forEach(r => taken.add(String(typeof r === "string" ? r : r.booked_dates || r.dining_date || "").slice(0, 10))))
    .then(() => drawCal())
    .catch(() => {});

  // the closing screen, three ways: saved for Ian, handed to WhatsApp, or could not be saved
  const DATE_ERR = "Please choose a Wednesday to Sunday at least 2 weeks from today.";
  const TAKEN_ERR = "That evening is already reserved. Please choose another date.";
  function done(how) {
    const sub = $("bkDoneSub"), lead = $("bkAltLead"), wa = $("bkWaAgain"), alt = root.querySelector(".bk__done .alt");
    alt.hidden = false;
    if (how === "saved") {
      labels[3] = "Request received";
      sub.textContent = "Your request has been received. Ian will be in touch personally to discuss your preferred evening.";
      alt.hidden = true;                                   // nothing for the guest to send: Ian contacts them
    } else if (how === "failed") {
      labels[3] = "Send your request on WhatsApp";
      sub.textContent = "We could not send your request just now. Please send it to Ian on WhatsApp and he will be in touch personally.";
      lead.textContent = ""; wa.textContent = "Open WhatsApp";
    } else {
      labels[3] = "Request sent to WhatsApp";
      sub.textContent = "Your request is ready in WhatsApp. Press send there and Ian will be in touch personally to discuss your preferred evening.";
      lead.textContent = "WhatsApp didn’t open?"; wa.textContent = "Try again";
    }
  }

  // date: earliest allowed is two weeks from today
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const minDate = () => { const d = new Date(); d.setDate(d.getDate() + LEAD_DAYS); return iso(d); };

  function setGuests(n) {
    guests = Math.min(MAX_G, Math.max(MIN_G, n));
    $("bkGuests").textContent = guests + " guests";
    $("bkMinus").disabled = guests <= MIN_G;
    $("bkPlus").disabled = guests >= MAX_G;
  }
  $("bkMinus").addEventListener("click", () => setGuests(guests - 1));
  $("bkPlus").addEventListener("click", () => setGuests(guests + 1));

  function go(n, back) {
    step = n;
    steps.forEach(s => { const on = +s.dataset.step === n; s.classList.toggle("is-on", on); s.classList.toggle("is-back", on && !!back); });
    sketches.forEach((im, i) => im.classList.toggle("on", i === Math.min(n, 3) - 1));
    $("bkLabel").textContent = labels[n - 1];
    $("bkBar").style.width = (Math.min(n, 3) / 3 * 100) + "%";
    $("bkNext").textContent = n === 3 ? "Request a table" : n === 4 ? (inline ? "Book another" : "Close") : "Continue";
    $("bkFine").hidden = n !== 3;
    $("bkBack").hidden = n === 1 || n === 4;
    form.setAttribute("aria-labelledby", n === 1 ? "bkTitle1" : "");
    form.setAttribute("aria-label", n === 1 ? "" : labels[n - 1]);
    body.scrollTop = 0;
    sync();
    const first = steps[n - 1].querySelector("input:not([type=radio]):not([type=hidden]), textarea");
    if (n === 3 && first && matchMedia("(min-width: 601px)").matches) first.focus({ preventScroll: true });
  }

  function sync() {
    if (step === 1) $("bkNext").disabled = !form.occasion.value;
    else $("bkNext").disabled = false;
  }
  form.addEventListener("change", sync);
  // picking an occasion moves on by itself after a beat
  root.querySelectorAll("input[name=occasion]").forEach(r => r.addEventListener("click", () => setTimeout(() => step === 1 && go(2), 380)));

  function flag(id, bad) { $(id).classList.toggle("is-bad", bad); return !bad; }
  const openDay = v => { const d = new Date(v + "T12:00:00").getDay(); return d === 0 || d >= 3; };   // doc: Wed to Sun

  // the date: a month of evenings. Closed days and evenings Ian has confirmed cannot be picked.
  const MONTHS_AHEAD = 12;
  const grid = $("bkCalGrid");
  let view = null;                              // first day of the month on show
  const monthOf = d => new Date(d.getFullYear(), d.getMonth(), 1);
  const firstMonth = () => monthOf(new Date(minDate() + "T12:00:00"));
  const lastMonth = () => { const f = firstMonth(); return new Date(f.getFullYear(), f.getMonth() + MONTHS_AHEAD, 1); };
  function drawCal(focusOn) {
    const min = minDate(), sel = $("bkDate").value, first = firstMonth(), last = lastMonth();
    if (!view || view < first) view = first;
    if (view > last) view = last;
    $("bkCalPrev").disabled = view <= first;
    $("bkCalNext").disabled = view >= last;
    $("bkCalMonth").textContent = view.toLocaleDateString("en-SG", { month: "long", year: "numeric" });
    const y = view.getFullYear(), m = view.getMonth(), days = new Date(y, m + 1, 0).getDate();
    let out = "<span></span>".repeat((view.getDay() + 6) % 7);   // weeks start on Monday
    for (let d = 1; d <= days; d++) {
      const v = iso(new Date(y, m, d)), full = taken.has(v), off = v < min || !openDay(v);
      out += `<button type="button" tabindex="-1" data-d="${v}" class="${full ? "is-taken" : ""}${v === sel ? " is-sel" : ""}"${off || full ? " disabled" : ""} aria-pressed="${v === sel}" aria-label="${prettyDate(v)}${full ? ", reserved" : ""}">${d}</button>`;
    }
    grid.innerHTML = out;
    // one day in the month takes Tab; the arrow keys move between days
    const live = [...grid.querySelectorAll("button:not(:disabled)")];
    const home = live.find(b => b.dataset.d === (focusOn || sel)) || live[0];
    if (home) { home.tabIndex = 0; if (focusOn) home.focus({ preventScroll: true }); }
    $("bkCalKeyRes").hidden = !taken.size;
    $("bkCalKeySel").textContent = sel
      ? new Date(sel + "T12:00:00").toLocaleDateString("en-SG", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
      : "Selected date";
  }
  function turn(by) { view = new Date(view.getFullYear(), view.getMonth() + by, 1); drawCal(); }
  $("bkCalPrev").addEventListener("click", () => turn(-1));
  $("bkCalNext").addEventListener("click", () => turn(1));
  grid.addEventListener("click", e => {
    const b = e.target.closest("button[data-d]");
    if (!b || b.disabled) return;
    $("bkDate").value = b.dataset.d;
    $("bkDateF").classList.remove("is-bad");
    drawCal(b.dataset.d);
  });
  grid.addEventListener("keydown", e => {
    const jump = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    const cur = e.target.closest("button[data-d]");
    if (!jump || !cur) return;
    e.preventDefault();
    const d = new Date(cur.dataset.d + "T12:00:00"), min = minDate(), end = lastMonth();
    end.setMonth(end.getMonth() + 1);
    for (let i = 0; i < 21; i++) {              // step over closed and reserved days
      d.setDate(d.getDate() + jump);
      const v = iso(d);
      if (v < min || d >= end) return;
      if (openDay(v) && !taken.has(v)) { view = monthOf(d); drawCal(v); return; }
    }
  });
  function fresh() { form.reset(); $("bkDate").value = ""; view = null; setGuests(MIN_G); drawCal(); go(1); }
  function checkStep2() {
    const v = $("bkDate").value, full = !!v && taken.has(v);
    $("bkDateErr").textContent = full ? TAKEN_ERR : DATE_ERR;
    return flag("bkDateF", !v || v < minDate() || !openDay(v) || full);
  }
  function checkStep3() {
    const okName = flag("bkNameF", !form.name.value.trim());
    const okPhone = flag("bkPhoneF", form.phone.value.replace(/\D/g, "").length < 8);
    const e = form.email.value.trim();
    const okMail = flag("bkEmailF", !!e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    const bd = form.birthday.value;
    const okBday = flag("bkBdayF", !!bd && (bd < "1900-01-01" || bd > iso(new Date())));
    return okName && okPhone && okMail && okBday;
  }
  form.addEventListener("input", e => { const f = e.target.closest(".bk__field"); if (f) f.classList.remove("is-bad"); });

  function prettyDate(v) {
    const [y, m, d] = v.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }
  function message() {
    const lines = [
      "Hi Ian, I'd like to reserve a private sitting at The Dinerworkshop.",
      "",
      "Occasion: " + form.occasion.value,
      "Guests: " + guests,
      "Preferred date: " + prettyDate(form.date.value)
    ];
    if (form.dietary.value.trim()) lines.push("Dietary requirements: " + form.dietary.value.trim());
    if (form.notes.value.trim()) lines.push("About our evening: " + form.notes.value.trim());
    lines.push("", "Name: " + form.name.value.trim(), "WhatsApp: " + form.phone.value.trim());
    if (form.email.value.trim()) lines.push("Email: " + form.email.value.trim());
    if (form.birthday.value) { const [, bm, bdd] = form.birthday.value.split("-").map(Number); lines.push("Birthday: " + new Date(2000, bm - 1, bdd).toLocaleDateString("en-SG", { day: "numeric", month: "long" })); }
    return lines.join("\n");
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (step === 1) { if (form.occasion.value) go(2); return; }
    if (step === 2) { if (checkStep2()) go(3); else (grid.querySelector('button[tabindex="0"]') || $("bkCalNext")).focus(); return; }
    if (step === 3) {
      if (!checkStep3()) { const bad = root.querySelector(".bk__field.is-bad input"); if (bad) bad.focus(); return; }
      const text = message();
      waUrl = `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
      $("bkWaAgain").href = waUrl;
      $("bkDoneTitle").textContent = "Thank you, " + form.name.value.trim().split(" ")[0] + ".";
      if (!DB) { window.open(waUrl, "_blank", "noopener"); done("wa"); go(4); return; }
      if (busy) return;
      if (form.company.value) { done("saved"); go(4); return; }      // a robot filled the hidden field: accept nothing
      busy = true;
      $("bkNext").disabled = true;
      $("bkNext").textContent = "Sending…";
      const val = n => form[n].value.trim() || null;
      DB.call("/rest/v1/bookings", { method: "POST", prefer: "return=minimal", body: {
        dining_date: form.date.value, guests, occasion: form.occasion.value || null,
        name: form.name.value.trim(), phone: form.phone.value.trim(),
        email: val("email"), birthday: form.birthday.value || null, dietary: val("dietary"), notes: val("notes")
      } }).then(() => done("saved"), () => done("failed")).then(() => { busy = false; go(4); });
      return;
    }
    if (inline) { fresh(); return; }
    close();
  });
  $("bkBack").addEventListener("click", () => go(step - 1, true));

  function open(e) {
    if (e) e.preventDefault();
    if (inline) {   // the form is already on the page: bring it into view
      if (step === 4) fresh();
      const top = root.getBoundingClientRect().top + scrollY - 110;
      scrollTo({ top, behavior: "smooth" });
      return;
    }
    opener = document.activeElement;
    if (step === 4) fresh();
    drawCal();
    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("bk-lock");
    setTimeout(() => (step === 1 ? root.querySelector("input[name=occasion]") : $("bkNext")).focus({ preventScroll: true }), 60);
  }
  function close() {
    if (inline) return;
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("bk-lock");
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  }
  root.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", close));
  document.addEventListener("keydown", e => {
    if (inline || !root.classList.contains("is-open")) return;
    if (e.key === "Escape") return close();
    if (e.key === "Tab") {   // keep focus inside the pop-up
      const f = [...form.querySelectorAll("button:not([hidden]):not(:disabled), input, textarea, a[href]")].filter(el => el.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  document.querySelectorAll("[data-book]").forEach(a => a.addEventListener("click", open));

  setGuests(MIN_G);
  drawCal();
  go(1);
  window.openBooking = open;
})();
