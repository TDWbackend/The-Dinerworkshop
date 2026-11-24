/* The private desk behind admin.html: bookings, claypot orders, the calendar, the guest list and the accounts.
   Sign-in is checked by the database, not by this page; without a signed-in admin account nothing is readable. */
(() => {
  const DB = window.DW_DB;
  const app = document.getElementById("app"), dlg = document.getElementById("dlg");
  const KEY = "dwAdminSession";
  const OCCASIONS = ["A celebration", "An evening with friends", "A family gathering", "A private occasion"];
  const STATUS = { pending: "Request", accepted: "Confirmed", completed: "Finished", declined: "Declined", cancelled: "Cancelled" };
  const ED = { tasting: { label: "The ‘Tasting’ Edition", short: "Tasting", price: 80 }, grand: { label: "The ‘Grand’ Edition", short: "Grand", price: 150 } };
  const OSTATUS = { confirmed: "To prepare", pending: "Waiting for you", collected: "Collected", cancelled: "Cancelled", unpaid: "Payment not finished" };
  const METHODS = { paynow: "PayNow", bank: "Bank transfer", cash: "Cash", card: "Card", stripe: "Stripe", other: "Other" };
  const KINDS = { dining: "Dining", claypot: "Claypot", other: "Other" };
  const VIEWS = { overview: "Overview", bookings: "Dining", orders: "Claypot", calendar: "Calendar", guests: "Guests", accounts: "Accounts" };
  const edLabel = o => (ED[o.edition] || { label: o.edition }).label;
  const edShort = o => (ED[o.edition] || { short: o.edition }).short;

  let session = null, rows = [], orders = [], customers = [], payments = [], loadedAt = 0;
  const off = { orders: false, crm: false };                // parts of the database that are not set up yet
  let view = "overview", tab = "pending", pickedDay = null, otab = "confirmed", opicked = null, gq = "";
  const firstOfMonth = () => { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d; };
  let month = firstOfMonth(), big = firstOfMonth(), dash = firstOfMonth(), acc = firstOfMonth();
  // Dining and Claypot each show as a list or as a board of columns; the choice is remembered on this device
  const boards = { bookings: false, orders: false };
  try { Object.assign(boards, JSON.parse(localStorage.getItem("dwDeskBoards") || "{}")); } catch (_) {}
  try { session = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (_) {}

  /* ── small helpers ── */
  // builds DOM with text nodes only, so nothing a guest typed can ever run as markup
  function el(tag, props, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k === "value") n.value = v;
      else if (k === "checked") n.checked = !!v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    for (const c of kids.flat(Infinity)) if (c != null && c !== false) n.append(c.nodeType ? c : document.createTextNode(String(c)));
    return n;
  }
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = () => iso(new Date());
  const asDate = v => { const [y, m, d] = String(v).slice(0, 10).split("-").map(Number); return new Date(y, m - 1, d); };
  const fmt = (v, o) => asDate(v).toLocaleDateString("en-SG", o);
  const longDate = v => fmt(v, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const shortDate = v => fmt(v, { day: "numeric", month: "short", year: "numeric" });
  const ym = d => iso(d).slice(0, 7);
  const monthName = (d, o) => d.toLocaleDateString("en-SG", o || { month: "long", year: "numeric" });
  const first = name => String(name || "").trim().split(/\s+/)[0] || "there";
  const DEFAULT_TIME = "19:00";                                       // the site: 7:00 PM til late
  const hhmm = t => /^\d\d:\d\d/.test(String(t || "")) ? String(t).slice(0, 5) : DEFAULT_TIME;
  const clock = t => { const [h, m] = hhmm(t).split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
  const money = n => { const v = Number(n) || 0; return (v < 0 ? "-$" : "$") + Math.abs(v).toLocaleString("en-SG", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 }); };
  const sum = (list, f) => list.reduce((n, x) => n + (Number(f(x)) || 0), 0);
  const waNumber = phone => { let d = String(phone || "").replace(/\D/g, "").replace(/^00/, ""); if (d.length === 8) d = "65" + d; return d; };   // 8 digits: a local Singapore number
  const wa = (phone, text) => `https://wa.me/${waNumber(phone)}?text=${encodeURIComponent(text)}`;
  const tel = phone => "tel:" + String(phone || "").replace(/[^\d+]/g, "");
  const mailto = email => "mailto:" + encodeURIComponent(email).replace("%40", "@");
  const stamp = v => new Date(v).toLocaleString("en-SG", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
  const custOf = id => id ? customers.find(c => c.id === id) : null;
  const lab = (t, input) => el("label", { class: "field" }, el("span", { text: t }), input);
  const btn = (text, fn, ghost) => el("button", { class: "btn" + (ghost ? " btn--ghost" : ""), type: "button", text, onclick: fn });
  const sortByDate = (list, k) => list.sort((a, b) => a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0);
  function waLink(r) {
    return wa(r.phone, r.status === "accepted"
      ? `Hi ${first(r.name)}, this is Ian from The Dinerworkshop. I would be delighted to host your group of ${r.guests} on ${longDate(r.dining_date)} at ${clock(r.dining_time)}.`
      : `Hi ${first(r.name)}, this is Ian from The Dinerworkshop. Thank you for your request for ${r.guests} guests on ${longDate(r.dining_date)}.`);
  }
  // a birthday as "14 March", and the date it next falls on
  const bdayText = v => fmt(v, { day: "numeric", month: "long" });
  function nextBirthday(v) {
    const [, m, d] = String(v).slice(0, 10).split("-").map(Number), now = asDate(today());
    let n = new Date(now.getFullYear(), m - 1, d);
    if (n < now) n = new Date(now.getFullYear() + 1, m - 1, d);
    return n;
  }
  const daysUntil = d => Math.round((d - asDate(today())) / 86400000);
  let toastTimer = 0;
  function toast(msg, link) {
    document.querySelectorAll(".toast").forEach(t => t.remove());
    const t = el("div", { class: "toast", role: "status" }, el("span", { text: msg }), link && el("a", { href: link.href, target: "_blank", rel: "noopener", text: link.text }));
    document.body.append(t);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.remove(), link ? 9000 : 4200);
  }
  function show(form) { dlg.replaceChildren(form); dlg.showModal(); }
  // a spreadsheet file, built in the browser. Words that start like a formula are made plain text.
  function csvFile(name, table) {
    const cell = v => {
      if (typeof v === "number") return String(v);
      let s = v == null ? "" : String(v);
      if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
      return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const blob = new Blob(["\ufeff" + table.map(r => r.map(cell).join(",")).join("\r\n") + "\r\n"], { type: "text/csv;charset=utf-8" });
    const a = el("a", { href: URL.createObjectURL(blob), download: name });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  // ‹ November 2026 › : steps one of the month pickers
  function monthNav(d, set, label) {
    return el("div", { class: "mnav" },
      el("button", { class: "cal__nav", type: "button", "aria-label": "Previous month", text: "‹", onclick: () => { set(new Date(d.getFullYear(), d.getMonth() - 1, 1)); render(); } }),
      el("h2", { text: label || monthName(d) }),
      el("button", { class: "cal__nav", type: "button", "aria-label": "Next month", text: "›", onclick: () => { set(new Date(d.getFullYear(), d.getMonth() + 1, 1)); render(); } }));
  }

  /* ── signing in: Supabase Auth; the database decides what a signed-in account may see ── */
  function keep(d) {
    session = { access_token: d.access_token, refresh_token: d.refresh_token, expires_at: d.expires_at || Math.floor(Date.now() / 1000) + (d.expires_in || 3600) };
    try { localStorage.setItem(KEY, JSON.stringify(session)); } catch (_) {}
  }
  function forget() { session = null; rows = []; orders = []; customers = []; payments = []; try { localStorage.removeItem(KEY); } catch (_) {} }
  async function token() {
    if (!session) { const e = new Error("Signed out"); e.status = 401; throw e; }
    if (session.expires_at * 1000 - Date.now() < 60000)
      keep(await DB.call("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: { refresh_token: session.refresh_token } }));
    return session.access_token;
  }
  async function api(path, opts = {}) {
    try { return await DB.call(path, { ...opts, token: await token() }); }
    catch (e) { if (e.status === 401 || e.status === 403 && /jwt/i.test(e.message)) { forget(); gate("Please sign in again."); } throw e; }
  }
  async function signOut() {
    const t = session && session.access_token;
    forget(); gate();
    if (t) DB.call("/auth/v1/logout", { method: "POST", token: t }).catch(() => {});
  }

  function gate(note) {
    dlg.open && dlg.close();
    const err = el("p", { class: "err", role: "alert", text: note || "", hidden: !note });
    const email = el("input", { type: "email", autocomplete: "username", required: true });
    const pass = el("input", { type: "password", autocomplete: "current-password", required: true });
    const go = el("button", { class: "btn", type: "submit", text: "Sign in" });
    const form = el("form", { class: "gate__card", onsubmit: async e => {
      e.preventDefault();
      go.disabled = true; err.hidden = true;
      try {
        keep(await DB.call("/auth/v1/token?grant_type=password", { method: "POST", body: { email: email.value.trim(), password: pass.value } }));
        const ok = await DB.call("/rest/v1/rpc/is_admin", { method: "POST", body: {}, token: session.access_token });
        if (ok !== true) { forget(); throw new Error("This account is not allowed to manage bookings."); }
        await start();
      } catch (ex) {
        err.textContent = /invalid/i.test(ex.message) ? "That email or password is not right." : ex.message;
        err.hidden = false; go.disabled = false;
      }
    } },
      el("img", { src: "assets/wordmark-ink.png", alt: "The Dinerworkshop" }),
      el("h1", { text: "Bookings" }),
      DB && DB.ready ? [
        el("label", { class: "field" }, el("span", { text: "Email" }), email),
        el("label", { class: "field" }, el("span", { text: "Password" }), pass),
        go, err
      ] : el("p", { text: "The booking backend is not connected yet. Add the Supabase project URL and publishable key to assets/db.js." })
    );
    app.replaceChildren(el("div", { class: "gate" }, form));
  }

  /* ── data ── */
  async function load() {
    rows = await api("/rest/v1/bookings?select=*&order=dining_date.asc,created_at.asc") || [];
    // the newer tables may not be set up yet in an older project: the desk still opens without them
    const opt = async path => { try { return await api(path) || []; } catch (e) { if (!session) throw e; return null; } };
    const o = await opt("/rest/v1/claypot_orders?select=*&order=pickup_date.asc,created_at.asc");
    const c = await opt("/rest/v1/customers?select=*&order=name.asc");
    const p = await opt("/rest/v1/payments?select=*&order=paid_on.asc,created_at.asc");
    off.orders = !o; off.crm = !c || !p;
    orders = o || []; customers = c || []; payments = p || [];
    sortByDate(rows, "dining_date"); sortByDate(orders, "pickup_date"); sortByDate(payments, "paid_on");
    loadedAt = Date.now();
  }
  async function patch(r, body, done, table = "bookings") {
    try {
      const out = await api(`/rest/v1/${table}?id=eq.${encodeURIComponent(r.id)}`, { method: "PATCH", body, prefer: "return=representation" });
      Object.assign(r, (out && out[0]) || body);
      render();
      if (done) done(r);
    } catch (e) { if (session) toast("Could not save: " + e.message); }
  }
  function setStatus(r, status) {
    patch(r, { status }, row => toast(`${row.name}: ${STATUS[status].toLowerCase()}.`));
  }
  // asks the backend to send one of its emails; answers true, or the reason it could not
  async function sendMail(kind, row) {
    try { await DB.fn("send-email", { kind, id: row.id }, await token()); return true; }
    catch (e) { return e.message || "unknown error"; }
  }
  async function emailBooking(r) {
    const ok = await sendMail("booking_confirmed", r);
    if (ok === true) { r.confirmed_email_at = new Date().toISOString(); render(); toast(`Confirmation emailed to ${r.email}.`); }
    else toast("The email could not be sent: " + ok);
  }
  async function emailReceipt(o) {
    const ok = await sendMail("claypot_receipt", o);
    if (ok === true) { o.receipt_email_at = new Date().toISOString(); render(); toast(`Invoice and receipt emailed to ${o.email}.`); }
    else toast("The email could not be sent: " + ok);
  }

  /* ── payments: every one is a line in the accounts ── */
  const payKey = table => table === "bookings" ? "booking_id" : "order_id";
  const paysOf = (row, table) => payments.filter(p => p[payKey(table)] === row.id);
  function payDialog(row, table) {
    const dining = table === "bookings";
    const amount = el("input", { type: "number", required: true, min: 0, step: "0.01", inputmode: "decimal", value: dining ? (row.amount == null ? "" : row.amount) : row.total });
    const method = el("select", null, Object.entries(METHODS).filter(([k]) => k !== "stripe").map(([k, t]) => el("option", { value: k, text: t })));
    const date = el("input", { type: "date", required: true, value: today() });
    const note = el("input", { type: "text", maxlength: 1000 });
    const err = el("p", { class: "err", role: "alert", hidden: true });
    const save = el("button", { class: "btn", type: "submit", text: "Record payment" });
    show(el("form", { class: "form", onsubmit: async e => {
      e.preventDefault();
      const body = { kind: dining ? "dining" : "claypot", amount: Number(amount.value), method: method.value, paid_on: date.value,
        payer: row.name, customer_id: row.customer_id || null, note: note.value.trim() || null, [payKey(table)]: row.id };
      save.disabled = true; err.hidden = true;
      try {
        const out = await api("/rest/v1/payments", { method: "POST", body, prefer: "return=representation" });
        payments.push((out && out[0]) || { ...body, id: String(Date.now()), created_at: new Date().toISOString() });
        const upd = { paid: true };
        if (dining && row.amount == null) upd.amount = body.amount;
        const done = await api(`/rest/v1/${table}?id=eq.${encodeURIComponent(row.id)}`, { method: "PATCH", body: upd, prefer: "return=representation" });
        Object.assign(row, (done && done[0]) || upd);
        dlg.close(); render(); toast(`${money(body.amount)} from ${row.name} recorded.`);
      } catch (ex) { err.textContent = "Could not save: " + ex.message; err.hidden = false; save.disabled = false; }
    } },
      el("h2", { text: "Payment from " + row.name }),
      el("p", { text: dining ? `${longDate(row.dining_date)}, ${row.guests} guests. This goes into the accounts.` : `${row.qty} x ${edLabel(row)}, collection ${longDate(row.pickup_date)}. This goes into the accounts.` }),
      el("div", { class: "form__row" }, lab("Amount received ($)", amount), lab("Paid by", method)),
      el("div", { class: "form__row" }, lab("Date received", date), lab("Note (optional)", note)),
      err,
      el("div", { class: "form__acts" }, save, btn("Close", () => dlg.close(), true))));
  }
  async function unpay(row, table) {
    const mine = paysOf(row, table);
    if (mine.some(p => p.method === "stripe")) { toast("This was paid through Stripe. Refund it in Stripe and the accounts update by themselves."); return; }
    if (!confirm(mine.length ? `Remove the ${money(sum(mine, p => p.amount))} payment recorded for ${row.name}? It also leaves the accounts.` : `Mark ${row.name} as not paid?`)) return;
    try {
      if (mine.length) {
        await api(`/rest/v1/payments?${payKey(table)}=eq.${encodeURIComponent(row.id)}`, { method: "DELETE" });
        payments = payments.filter(p => !mine.includes(p));
      }
      await patch(row, { paid: false }, null, table);
    } catch (e) { if (session) toast("Could not save: " + e.message); }
  }
  // the tick on a booking or an order. Ticking asks how much and how; un-ticking takes the payment out again.
  function payLine(row, table) {
    const mine = paysOf(row, table), viaStripe = mine.some(p => p.method === "stripe");
    const box = el("input", { type: "checkbox", checked: row.paid, disabled: viaStripe, onchange: e => {
      const want = e.target.checked; e.target.checked = !want;        // the tick only moves once it is really saved
      if (want) payDialog(row, table); else unpay(row, table);
    } });
    return el("div", { class: "paid" },
      el("label", null, box, viaStripe ? "Paid online by Stripe" : table === "bookings" ? "Full payment received" : "Payment received"),
      row.paid && mine.length ? el("span", { class: "paid__sum", text: `${money(sum(mine, p => p.amount))} · ${[...new Set(mine.map(p => METHODS[p.method] || p.method))].join(", ")} · ${shortDate(mine[0].paid_on)}` }) : null);
  }

  /* ── accept a request, or move a confirmed one: Ian picks the evening and the time ── */
  function schedule(r, accepting) {
    const date = el("input", { type: "date", required: true, value: r.dining_date });
    const time = el("input", { type: "time", required: true, step: 900, value: hhmm(r.dining_time) });
    const amount = el("input", { type: "number", min: 0, step: "0.01", inputmode: "decimal", value: r.amount == null ? "" : r.amount, placeholder: "Optional" });
    const mail = el("input", { type: "checkbox", checked: accepting && !!r.email });
    const err = el("p", { class: "err", role: "alert", hidden: true });
    const save = el("button", { class: "btn", type: "submit", text: accepting ? "Confirm booking" : "Save" });
    show(el("form", { class: "form", onsubmit: async e => {
      e.preventDefault();
      const body = { dining_date: date.value, dining_time: time.value || DEFAULT_TIME, amount: amount.value === "" ? null : Number(amount.value) };
      if (accepting) body.status = "accepted";
      const clash = rows.find(x => x !== r && x.status === "accepted" && x.dining_date === body.dining_date);
      if (clash && !confirm(`${clash.name} is already confirmed for ${longDate(body.dining_date)}. Confirm ${r.name} for that evening as well?`)) return;
      save.disabled = true; err.hidden = true;
      try {
        const out = await api(`/rest/v1/bookings?id=eq.${encodeURIComponent(r.id)}`, { method: "PATCH", body, prefer: "return=representation" });
        Object.assign(r, (out && out[0]) || body);
        sortByDate(rows, "dining_date");
        if (accepting) { tab = "confirmed"; pickedDay = null; }
        month = asDate(r.dining_date); month.setDate(1);              // show the month it now sits in
        dlg.close(); render();
        let mailed = "";
        if (mail.checked && r.email) {
          const ok = await sendMail("booking_confirmed", r);
          if (ok === true) { r.confirmed_email_at = new Date().toISOString(); render(); mailed = " Confirmation emailed."; }
          else mailed = " The email could not be sent: " + ok;
        }
        toast(`${r.name}: ${fmt(r.dining_date, { weekday: "short", day: "numeric", month: "short" })}, ${clock(r.dining_time)}.${mailed}`, { href: waLink(r), text: "Message on WhatsApp" });
      } catch (ex) { err.textContent = "Could not save: " + ex.message; err.hidden = false; save.disabled = false; }
    } },
      el("h2", { text: accepting ? "Confirm " + r.name : "Change date or time" }),
      el("p", { text: accepting
        ? `${r.name} asked for ${longDate(r.dining_date)}, ${r.guests} guests. Set the evening and the time.`
        : `${r.name}, ${r.guests} guests. Tell them once it is saved.` }),
      el("div", { class: "form__row" }, lab("Date", date), lab("Time", time)),
      lab("Price for the evening ($)", amount),
      r.email
        ? el("div", { class: "form__check" }, el("label", null, mail, `Email the confirmation to ${r.email}`))
        : el("p", { text: "No email address on this booking, so no confirmation email. Message them on WhatsApp." }),
      err,
      el("div", { class: "form__acts" }, save, btn("Close", () => dlg.close(), true))));
  }
  // tapped on the calendar: the booking opens in a popup to change its date or time, confirm, finish or cancel it
  function bookingPop(r) {
    const pending = r.status === "pending", live = r.status === "accepted", open = pending || live;
    const date = el("input", { type: "date", required: true, value: r.dining_date, disabled: !open });
    const time = el("input", { type: "time", required: true, step: 900, value: hhmm(r.dining_time), disabled: !live });
    const err = el("p", { class: "err", role: "alert", hidden: true });
    const save = el("button", { class: "btn", type: "submit", text: "Save changes" });
    const then = fn => () => { dlg.close(); fn(); };
    const guest = custOf(r.customer_id), bday = (guest && guest.birthday) || r.birthday;
    show(el("form", { class: "form", onsubmit: async e => {
      e.preventDefault();
      const body = { dining_date: date.value };
      if (live) body.dining_time = time.value || DEFAULT_TIME;
      if (body.dining_date === r.dining_date && (!live || hhmm(body.dining_time) === hhmm(r.dining_time))) { dlg.close(); return; }
      const clash = live && rows.find(x => x !== r && x.status === "accepted" && x.dining_date === body.dining_date);
      if (clash && !confirm(`${clash.name} is already confirmed for ${longDate(body.dining_date)}. Move ${r.name} to that evening as well?`)) return;
      save.disabled = true; err.hidden = true;
      try {
        const out = await api(`/rest/v1/bookings?id=eq.${encodeURIComponent(r.id)}`, { method: "PATCH", body, prefer: "return=representation" });
        Object.assign(r, (out && out[0]) || body);
        sortByDate(rows, "dining_date");
        big = asDate(r.dining_date); big.setDate(1);                  // the calendar follows it to its new month
        dlg.close(); render();
        toast(`${r.name}: ${fmt(r.dining_date, { weekday: "short", day: "numeric", month: "short" })}${live ? ", " + clock(r.dining_time) : ""}.`, { href: waLink(r), text: "Message on WhatsApp" });
      } catch (ex) { err.textContent = "Could not save: " + ex.message; err.hidden = false; save.disabled = false; }
    } },
      el("h2", { text: r.name }),
      el("p", null, el("span", { class: "chip chip--" + (r.status === "completed" ? "accepted" : r.status), text: STATUS[r.status] || r.status }),
        ` ${r.guests} guests${r.occasion ? " · " + r.occasion : ""}${r.amount != null ? " · " + money(r.amount) : ""}`),
      el("p", { class: "card__contact" }, el("a", { href: tel(r.phone), text: r.phone }), r.email && [" · ", el("a", { href: mailto(r.email), text: r.email })], bday && " · Birthday " + bdayText(bday)),
      (r.dietary || r.notes) && el("dl", { class: "pop__dl" },
        r.dietary && el("div", null, el("dt", { text: "Dietary requirements" }), el("dd", { text: r.dietary })),
        r.notes && el("div", null, el("dt", { text: "About their evening" }), el("dd", { text: r.notes }))),
      el("div", { class: "form__row" }, lab("Date", date), lab(pending ? "Time (set when you accept)" : "Time", time)),
      (live || r.status === "completed") && payLine(r, "bookings"),
      err,
      el("div", { class: "form__acts" },
        pending && btn("Accept", () => schedule(r, true)),
        open && (pending ? (save.className = "btn btn--ghost", save) : save),
        live && btn("Mark finished", then(() => setStatus(r, "completed")), true),
        live && btn("Cancel booking", () => confirm(`Cancel ${r.name}'s booking on ${longDate(r.dining_date)}?`) && then(() => setStatus(r, "cancelled"))(), true),
        pending && btn("Decline", then(() => setStatus(r, "declined")), true),
        r.status === "completed" && btn("Not finished yet", then(() => setStatus(r, "accepted")), true),
        el("a", { class: "btn btn--wa", href: waLink(r), target: "_blank", rel: "noopener", text: "WhatsApp" }),
        btn("All details", () => edit(r), true),
        el("span", { class: "sp" }),
        btn("Close", () => dlg.close(), true))));
  }
  // dragged on the calendar to another day
  function moveBooking(r, day) {
    if (!r || r.dining_date === day) return;
    const clash = rows.find(x => x !== r && x.status === "accepted" && x.dining_date === day);
    if (!confirm(`Move ${r.name} from ${longDate(r.dining_date)} to ${longDate(day)}?` + (clash ? ` ${clash.name} is already confirmed that evening.` : ""))) return;
    patch(r, { dining_date: day }, row => { sortByDate(rows, "dining_date"); render(); toast(`${row.name} moved to ${fmt(day, { weekday: "short", day: "numeric", month: "short" })}.`, { href: waLink(row), text: "Message on WhatsApp" }); });
  }

  /* ── the frame: sections down the side (along the bottom on a phone), the page beside it ── */
  const NS = "http://www.w3.org/2000/svg";
  function icon(d) {
    const s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true");
    d.split("|").forEach(p => { const n = document.createElementNS(NS, "path"); n.setAttribute("d", p); s.append(n); });
    return s;
  }
  const ICONS = {
    overview: "M4.5 4.5h6v6h-6z|M13.5 4.5h6v6h-6z|M4.5 13.5h6v6h-6z|M13.5 13.5h6v6h-6z",
    bookings: "M7 3v7a2.5 2.5 0 0 0 5 0V3|M9.5 3v18|M17.5 21V3c-2.2 1.6-3.2 4.2-3.2 7.5h3.2",
    orders: "M3 11.5h18|M5 11.5a7 7 0 0 0 14 0|M9.5 8c0-1.2 1-1.6 1-2.8|M13.5 8c0-1.2 1-1.6 1-2.8",
    calendar: "M4.5 6h15v13.5h-15z|M4.5 10.5h15|M8.5 3.5v4|M15.5 3.5v4",
    guests: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M4.5 20c1.2-3.3 4-5 7.5-5s6.3 1.7 7.5 5",
    accounts: "M5.5 20v-9|M12 20V4.5|M18.5 20v-6.5",
    refresh: "M19.5 11.5a7.5 7.5 0 1 0-2.2 5.3|M19.5 5v6.5H13",
    out: "M10 4.5H5v15h5|M14.5 8l4 4-4 4|M18.5 12H9.5",
    plus: "M12 5.5v13|M5.5 12h13",
    trash: "M5 7h14|M9.5 7V4.5h5V7|M7 7l.8 12.5h8.4L17 7|M10.5 10.5v6|M13.5 10.5v6"
  };
  function sideBar() {
    const waiting = { bookings: rows.filter(r => r.status === "pending").length, orders: orders.filter(o => o.status === "pending").length };
    const item = k => el("button", { class: "side__item", type: "button", "aria-current": view === k ? "page" : null, onclick: () => { if (view !== k) { view = k; render(); scrollTo(0, 0); } } },
      icon(ICONS[k]), el("span", { text: VIEWS[k] }), waiting[k] ? el("i", { text: waiting[k], "aria-label": waiting[k] + " waiting" }) : null);
    return el("aside", { class: "side" },
      el("img", { class: "side__logo", src: "assets/wordmark-ink.png", alt: "The Dinerworkshop" }),
      el("nav", { class: "side__nav", "aria-label": "Sections" }, Object.keys(VIEWS).map(item)),
      el("div", { class: "side__foot" },
        el("button", { class: "side__item", type: "button", onclick: refresh }, icon(ICONS.refresh), el("span", { text: "Refresh" })),
        el("button", { class: "side__item", type: "button", onclick: signOut }, icon(ICONS.out), el("span", { text: "Sign out" }))));
  }
  const setupNote = () => off.crm ? el("p", { class: "note", text: "The guest list and the accounts are not set up in the database yet. Run the latest schema.sql in Supabase, then press Refresh." }) : null;
  function page(title, ...kids) {
    const add = { orders: ["order", () => editOrder(null)], guests: ["guest", () => guestDlg(null)], accounts: ["payment", () => paymentDlg(null)] }[view] || ["booking", () => edit(null)];
    const keepScroll = scrollY;
    app.replaceChildren(el("div", { class: "shell" },
      sideBar(),
      el("div", { class: "main" },
        el("header", { class: "head" },
          el("h1", { text: title }),
          el("div", { class: "head__acts" },
            el("button", { class: "btn btn--ghost only-small", type: "button", "aria-label": "Refresh", onclick: refresh }, icon(ICONS.refresh)),
            el("button", { class: "btn btn--ghost only-small", type: "button", "aria-label": "Sign out", onclick: signOut }, icon(ICONS.out)),
            el("button", { class: "btn", type: "button", onclick: add[1] }, icon(ICONS.plus), "Add " + add[0]))),
        el("main", { class: "wrap" }, kids))));
    scrollTo(0, keepScroll);
  }
  function render() {
    ({ overview: renderOverview, bookings: renderBookings, orders: renderOrders, calendar: renderCalendar, guests: renderGuests, accounts: renderAccounts })[view]();
  }

  /* ── boards: columns of cards. Drag a card to another column to change where it stands, or tap it to open it. ── */
  function viewSwitch(k) {
    const set = v => () => { boards[k] = v; try { localStorage.setItem("dwDeskBoards", JSON.stringify(boards)); } catch (_) {} render(); };
    return el("div", { class: "tabs", role: "tablist", "aria-label": "Layout" },
      el("button", { class: "tab", type: "button", role: "tab", "aria-selected": boards[k] ? "false" : "true", onclick: set(false), text: "List" }),
      el("button", { class: "tab", type: "button", role: "tab", "aria-selected": boards[k] ? "true" : "false", onclick: set(true), text: "Board" }));
  }
  // Dragging that works with a mouse and with a finger. Mouse: press and move. Finger: hold for a moment, then move
  // (a finger that moves straight away is scrolling). The card follows the pointer; letting go over a column or a
  // calendar day (anything matching `targets`) calls onDrop. A plain click or tap calls onTap.
  let dragLive = false;
  document.addEventListener("touchmove", e => { if (dragLive) e.preventDefault(); }, { passive: false });
  function draggable(node, item, targets, onDrop, onTap) {
    let pid = null, sx = 0, sy = 0, ghost = null, over = null, timer = 0, active = false, dragged = false;
    const begin = () => {
      active = dragLive = dragged = true;
      const r = node.getBoundingClientRect();
      ghost = node.cloneNode(true);
      ghost.classList.add("drag-ghost");
      Object.assign(ghost.style, { width: r.width + "px", left: r.left + "px", top: r.top + "px" });
      document.body.append(ghost);
      node.classList.add("is-dragging"); document.body.classList.add("is-dragging-any");
    };
    const finish = () => {
      clearTimeout(timer);
      node.removeEventListener("pointermove", move); node.removeEventListener("pointerup", up); node.removeEventListener("pointercancel", finish);
      if (ghost) ghost.remove();
      if (over) over.classList.remove("is-over");
      node.classList.remove("is-dragging"); document.body.classList.remove("is-dragging-any");
      ghost = over = null; active = dragLive = false; pid = null;
    };
    function move(e) {
      if (e.pointerId !== pid) return;
      if (!active) {
        if (Math.hypot(e.clientX - sx, e.clientY - sy) < 6) return;
        if (e.pointerType === "mouse") begin(); else { finish(); return; }
      }
      ghost.style.transform = `translate(${e.clientX - sx}px, ${e.clientY - sy}px) rotate(2deg)`;
      const under = document.elementFromPoint(e.clientX, e.clientY), t = under && under.closest(targets);
      if (t !== over) { if (over) over.classList.remove("is-over"); over = t || null; if (over) over.classList.add("is-over"); }
      // near an edge the board, or the page, scrolls along
      const kan = node.closest(".kan");
      if (kan) { const k = kan.getBoundingClientRect(); if (e.clientX > k.right - 44) kan.scrollLeft += 16; else if (e.clientX < k.left + 44) kan.scrollLeft -= 16; }
      if (e.clientY > innerHeight - 56) scrollBy(0, 14); else if (e.clientY < 56) scrollBy(0, -14);
    }
    function up(e) {
      if (e.pointerId !== pid) return;
      const was = active, t = over;
      finish();
      if (was && t) onDrop(item, t);
    }
    node.addEventListener("pointerdown", e => {
      if (e.button || pid !== null) return;
      pid = e.pointerId; sx = e.clientX; sy = e.clientY; dragged = false;
      node.addEventListener("pointermove", move); node.addEventListener("pointerup", up); node.addEventListener("pointercancel", finish);
      if (e.pointerType === "mouse") { try { node.setPointerCapture(pid); } catch (_) {} }
      else timer = setTimeout(() => { if (pid !== null && !active) { begin(); if (navigator.vibrate) navigator.vibrate(12); } }, 320);
    });
    node.addEventListener("click", e => { if (dragged) { dragged = false; e.preventDefault(); return; } onTap(); });
    node.addEventListener("dragstart", e => e.preventDefault());
    node.addEventListener("contextmenu", e => { if (pid !== null) e.preventDefault(); });
    return node;
  }
  const MAX_COL = 15;                                           // a long history stays in the list, not on the board
  function kanban(cols) {
    return el("div", { class: "kan" }, cols.map(c => {
      const col = el("section", { class: "kan__col" + (c.red ? " kan__col--red" : ""), "aria-label": c.title, "data-key": c.key },
        el("h2", null, c.title, el("i", { text: c.items.length })),
        c.items.length ? c.items.slice(0, MAX_COL).map(c.card) : el("p", { class: "kan__empty", text: "Nothing here." }),
        c.items.length > MAX_COL ? el("p", { class: "kan__empty", text: `${c.items.length - MAX_COL} older ones are in the list.` }) : null);
      return col;
    }));
  }
  const closed = s => s === "declined" || s === "cancelled";
  const kanBooking = r => draggable(el("button", { class: "kan__card" + (closed(r.status) ? " is-cancelled" : ""), type: "button", title: "Drag to another column, or tap to open" },
    el("b", { text: r.name }),
    el("span", { text: fmt(r.dining_date, { weekday: "short", day: "numeric", month: "short" }) + (r.status === "pending" ? "" : " · " + clock(r.dining_time)) + ` · ${r.guests} guests` }),
    r.amount != null ? el("span", { text: money(r.amount) }) : null,
    r.status === "accepted" || r.status === "completed" ? el("em", { class: r.paid ? "is-ok" : "is-wait", text: r.paid ? "Paid" : "Not paid yet" }) : null,
    closed(r.status) ? el("em", { text: STATUS[r.status] }) : null),
    r, ".kan__col", (x, col) => dropBooking(x, col.dataset.key), () => bookingPop(r));
  function dropBooking(r, to) {
    const s = r.status;
    if (to === "pending") { if (s !== "pending") setStatus(r, "pending"); }
    else if (to === "accepted") { if (s === "completed") setStatus(r, "accepted"); else if (s !== "accepted") schedule(r, true); }      // confirming asks for the time
    else if (to === "completed") { if (s === "accepted") setStatus(r, "completed"); else if (s !== "completed") toast("Confirm the booking first, then it can be finished."); }
    else if (to === "closed") {
      if (s === "pending") setStatus(r, "declined");
      else if ((s === "accepted" || s === "completed") && confirm(`Cancel ${r.name}'s booking on ${longDate(r.dining_date)}?`)) setStatus(r, "cancelled");
    }
  }
  const kanOrder = o => draggable(el("button", { class: "kan__card" + (o.status === "cancelled" ? " is-cancelled" : ""), type: "button", title: "Drag to another column, or tap to open" },
    el("b", { text: o.name }),
    el("span", { text: `${o.qty} x ${edShort(o)} · ${money(o.total)}` }),
    el("span", { text: "Collection " + fmt(o.pickup_date, { weekday: "short", day: "numeric", month: "short" }) }),
    o.status !== "cancelled" ? el("em", { class: o.paid ? "is-ok" : "is-wait", text: o.paid ? "Paid" : "Not paid yet" }) : el("em", { text: "Cancelled" })),
    o, ".kan__col", (x, col) => dropOrder(x, col.dataset.key), () => editOrder(o));
  function dropOrder(o, to) {
    if (o.status === to) return;
    if (to === "cancelled" && !confirm(`Cancel ${o.name}'s order for ${longDate(o.pickup_date)}?` + (paysOf(o, "claypot_orders").some(p => p.method === "stripe") ? " It was paid online: refund it in Stripe as well." : ""))) return;
    setOrder(o, to);
  }

  /* ── overview: the month at a glance ── */
  const monthPays = (key, kind) => payments.filter(p => String(p.paid_on).slice(0, 7) === key && (!kind || p.kind === kind));
  function upcomingBirthdays(days) {
    return customers.filter(c => c.birthday).map(c => ({ c, on: nextBirthday(c.birthday) })).map(x => ({ ...x, in: daysUntil(x.on) }))
      .filter(x => x.in <= days).sort((a, b) => a.in - b.in);
  }
  function renderOverview() {
    const key = ym(dash), t = today();
    const evenings = rows.filter(r => (r.status === "accepted" || r.status === "completed") && String(r.dining_date).slice(0, 7) === key);
    const pots = orders.filter(o => (o.status === "confirmed" || o.status === "collected") && String(o.pickup_date).slice(0, 7) === key);
    const dining = sum(monthPays(key, "dining"), p => p.amount), claypot = sum(monthPays(key, "claypot"), p => p.amount), other = sum(monthPays(key, "other"), p => p.amount);
    const waiting = rows.filter(r => r.status === "pending"), unpaid = rows.filter(r => r.status === "accepted" && !r.paid);
    const stat = (big, label, small, go) => el(go ? "button" : "div", { class: "stat" + (go ? " stat--go" : ""), type: go ? "button" : null, onclick: go }, el("b", { text: big }), el("span", { text: label }), small ? el("small", { text: small }) : null);
    // the last six months, dining and claypot side by side
    const months = [...Array(6)].map((_, i) => new Date(dash.getFullYear(), dash.getMonth() - 5 + i, 1));
    const series = months.map(d => ({ d, dining: sum(monthPays(ym(d), "dining"), p => p.amount), claypot: sum(monthPays(ym(d), "claypot"), p => p.amount) + sum(monthPays(ym(d), "other"), p => p.amount) }));
    const top = Math.max(1, ...series.map(s => s.dining + s.claypot));
    const ahead = [
      ...rows.filter(r => r.status === "accepted" && r.dining_date >= t).map(r => ({ on: r.dining_date, what: `${clock(r.dining_time)} · ${r.name}, ${r.guests} guests`, tag: r.paid ? "Paid" : "Not paid yet", go: () => { view = "bookings"; pickedDay = r.dining_date; render(); } })),
      ...[...new Set(orders.filter(o => o.status === "confirmed" && o.pickup_date >= t).map(o => o.pickup_date))].map(d => ({ on: d, what: "Claypot collection · " + potsLine(orders.filter(o => o.status === "confirmed" && o.pickup_date === d)), tag: "", go: () => { view = "orders"; opicked = d; render(); } }))
    ].sort((a, b) => a.on < b.on ? -1 : a.on > b.on ? 1 : 0).slice(0, 7);
    const bdays = upcomingBirthdays(30);
    page("Overview",
      setupNote(),
      monthNav(dash, d => { dash = d; }),
      el("div", { class: "stats stats--6" },
        stat(evenings.length, "Confirmed bookings", evenings.length ? `${sum(evenings, r => r.guests)} guests` : null),
        stat(money(dining), "Earned from dining"),
        stat(money(claypot), "Earned from claypot", pots.length ? `${sum(pots, o => o.qty)} pots` : null),
        stat(money(dining + claypot + other), "Total received", other ? `${money(other)} other` : null),
        stat(waiting.length, "Requests waiting for you", null, () => { view = "bookings"; tab = "pending"; pickedDay = null; render(); }),
        stat(unpaid.length, "Confirmed, not paid yet", unpaid.length && sum(unpaid, r => r.amount) ? money(sum(unpaid, r => r.amount)) + " to come" : null, () => { view = "bookings"; tab = "confirmed"; pickedDay = null; render(); })),
      el("div", { class: "cols cols--even" },
        el("section", { class: "panel" },
          el("h2", { text: "Received, last six months" }),
          el("div", { class: "bars", role: "img", "aria-label": series.map(s => `${monthName(s.d, { month: "long" })}: ${money(s.dining + s.claypot)}`).join(", ") },
            series.map(s => el("div", { class: "bars__col" + (ym(s.d) === key ? " is-now" : "") },
              el("em", { text: s.dining + s.claypot ? money(s.dining + s.claypot) : "" }),
              el("div", { class: "bars__stack" },
                el("i", { class: "bars__claypot", style: `height:${(s.claypot / top * 100).toFixed(1)}%`, title: "Claypot " + money(s.claypot) }),
                el("i", { class: "bars__dining", style: `height:${(s.dining / top * 100).toFixed(1)}%`, title: "Dining " + money(s.dining) })),
              el("span", { text: monthName(s.d, { month: "short" }) })))),
          el("div", { class: "cal__key cal__key--row" },
            el("span", null, el("i", { style: "background: var(--ink)" }), "Dining"),
            el("span", null, el("i", { style: "background: var(--gold)" }), "Claypot and other"))),
        el("section", { class: "panel" },
          el("h2", { text: "Coming up" }),
          el("div", { class: "rowlist" }, ahead.length ? ahead.map(a => el("button", { class: "rowlist__item", type: "button", onclick: a.go },
            el("b", { text: fmt(a.on, { weekday: "short", day: "numeric", month: "short" }) }), el("span", { text: a.what }), a.tag ? el("em", { text: a.tag }) : null))
            : el("p", { text: "Nothing confirmed ahead." })),
          el("h2", { text: "Birthdays in the next 30 days", style: "margin-top: 22px" }),
          el("div", { class: "rowlist" }, bdays.length ? bdays.map(x => el("button", { class: "rowlist__item", type: "button", onclick: () => guestDlg(x.c) },
            el("b", { text: bdayText(x.c.birthday) }), el("span", { text: x.c.name }), el("em", { text: x.in === 0 ? "Today" : x.in === 1 ? "Tomorrow" : `In ${x.in} days` })))
            : el("p", { text: "No birthdays coming up." })))));
  }

  /* ── dining bookings ── */
  function lists() {
    return {
      pending: rows.filter(r => r.status === "pending"),
      confirmed: rows.filter(r => r.status === "accepted"),
      finished: rows.filter(r => r.status === "completed").reverse(),
      declined: rows.filter(r => r.status === "declined" || r.status === "cancelled").reverse()
    };
  }
  function card(r) {
    const notes = el("textarea", { value: r.admin_notes || "", placeholder: "Only you can see this", onblur: e => {
      const v = e.target.value.trim() || null;
      if (v !== (r.admin_notes || null)) patch(r, { admin_notes: v }, () => toast("Note saved."));
    } });
    const acts = [], past = r.dining_date < today(), guest = custOf(r.customer_id), bday = (guest && guest.birthday) || r.birthday;
    if (r.status === "pending") acts.push(btn("Accept", () => schedule(r, true)), btn("Decline", () => setStatus(r, "declined"), true));
    if (r.status === "accepted") acts.push(btn("Mark finished", () => setStatus(r, "completed"), !past));
    acts.push(el("a", { class: "btn btn--wa", href: waLink(r), target: "_blank", rel: "noopener", text: "WhatsApp" }));
    if (r.status === "accepted" && r.email) acts.push(btn(r.confirmed_email_at ? "Email confirmation again" : "Email confirmation", () => emailBooking(r), true));
    if (r.status === "accepted") acts.push(btn("Change date or time", () => schedule(r, false), true),
      btn("Cancel booking", () => confirm(`Cancel ${r.name}'s booking on ${longDate(r.dining_date)}?`) && setStatus(r, "cancelled"), true));
    if (r.status === "completed") acts.push(btn("Not finished yet", () => setStatus(r, "accepted"), true));
    if (r.status === "declined" || r.status === "cancelled") acts.push(btn("Back to requests", () => setStatus(r, "pending"), true));
    acts.push(btn("Edit", () => edit(r), true));
    if (guest) acts.push(btn("Guest record", () => guestDlg(guest), true));
    const timed = r.status === "accepted" || r.status === "completed";
    return el("article", { class: "card" + (r.status === "cancelled" || r.status === "declined" ? " is-cancelled" : "") },
      el("div", { class: "card__date" },
        el("b", { text: fmt(r.dining_date, { day: "numeric" }) }),
        el("span", { text: fmt(r.dining_date, { month: "short", year: "numeric" }) }),
        el("em", { text: fmt(r.dining_date, { weekday: "long" }) }),
        timed && el("strong", { text: clock(r.dining_time) })),
      el("div", { class: "card__body" },
        el("div", { class: "card__head" },
          el("h3", { text: r.name }),
          el("span", { class: "chip chip--" + (r.status === "completed" ? "accepted" : r.status), text: STATUS[r.status] || r.status }),
          r.status === "accepted" && past ? el("span", { class: "chip chip--pending", text: "Evening has passed" }) : null,
          el("span", { class: "chip", text: r.source === "manual" ? "Added by you" : "From the website" })),
        el("p", { class: "card__meta", text: `${r.guests} guests${r.occasion ? " · " + r.occasion : ""}${r.amount != null ? " · " + money(r.amount) : ""}` }),
        el("p", { class: "card__contact" },
          el("a", { href: tel(r.phone), text: r.phone }),
          r.email && [" · ", el("a", { href: mailto(r.email), text: r.email })],
          bday && " · Birthday " + bdayText(bday)),
        (r.dietary || r.notes) && el("dl", null,
          r.dietary && el("div", null, el("dt", { text: "Dietary requirements" }), el("dd", { text: r.dietary })),
          r.notes && el("div", null, el("dt", { text: "About their evening" }), el("dd", { text: r.notes }))),
        timed && payLine(r, "bookings"),
        el("label", { class: "field card__notes" }, el("span", { text: "Your notes" }), notes),
        el("div", { class: "card__acts" }, acts),
        el("p", { class: "card__when", text: "Received " + stamp(r.created_at) + (r.confirmed_email_at ? " · Confirmation emailed " + stamp(r.confirmed_email_at) : "") })));
  }
  function miniCalendar() {
    const y = month.getFullYear(), m = month.getMonth();
    const by = {};
    rows.forEach(r => { if (r.status === "pending" || r.status === "accepted" || r.status === "completed") (by[r.dining_date] = by[r.dining_date] || {})[r.status === "completed" ? "accepted" : r.status] = true; });
    const lead = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate(), t = today();
    const cells = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => el("div", { class: "cal__dow", text: d }));
    for (let i = 0; i < lead; i++) cells.push(el("span"));
    for (let d = 1; d <= days; d++) {
      const key = iso(new Date(y, m, d)), dow = new Date(y, m, d).getDay(), has = by[key] || {};
      const cls = ["cal__day", (dow === 1 || dow === 2) && "is-closed", key === t && "is-today", has.pending && "has-pending", has.accepted && "has-accepted", key === pickedDay && "is-picked"].filter(Boolean).join(" ");
      cells.push(el("button", { class: cls, type: "button", text: d, "aria-label": longDate(key) + (has.accepted ? ", confirmed" : has.pending ? ", request waiting" : ""), "aria-pressed": key === pickedDay ? "true" : "false",
        onclick: () => { pickedDay = pickedDay === key ? null : key; render(); } }));
    }
    const key = ym(month);
    const evenings = rows.filter(r => (r.status === "accepted" || r.status === "pending" || r.status === "completed") && String(r.dining_date).slice(0, 7) === key)
      .sort((a, b) => (a.dining_date + hhmm(a.dining_time)).localeCompare(b.dining_date + hhmm(b.dining_time)));
    return el("aside", { class: "cal", "aria-label": "Month" },
      el("div", { class: "cal__head" }, monthNav(month, d => { month = d; })),
      el("div", { class: "cal__grid" }, cells),
      el("div", { class: "cal__key" },
        el("span", null, el("i", { style: "background: var(--ink)" }), "Confirmed evening"),
        el("span", null, el("i", { style: "box-shadow: inset 0 0 0 1.5px var(--wait)" }), "Request waiting"),
        el("span", null, "Tap a day to see only that evening.")),
      el("div", { class: "cal__list" },
        el("h3", { text: "Evenings in " + monthName(month, { month: "long" }) }),
        evenings.length ? evenings.map(r => el("button", { class: "cal__item" + (r.status === "pending" ? " is-wait" : ""), type: "button", "aria-pressed": r.dining_date === pickedDay ? "true" : "false",
          onclick: () => { pickedDay = r.dining_date; render(); } },
          el("b", { text: fmt(r.dining_date, { weekday: "short", day: "numeric" }) }),
          el("span", { text: r.status === "pending" ? "Request" : clock(r.dining_time) }),
          el("em", { text: `${r.name}, ${r.guests}` }))) : el("p", { text: "No evenings booked this month." })));
  }
  function renderBookings() {
    const L = lists(), t = today(), next = L.confirmed.find(r => r.dining_date >= t);
    const showing = pickedDay ? rows.filter(r => r.dining_date === pickedDay) : L[tab] || [];
    const names = { pending: "Requests", confirmed: "Confirmed", finished: "Finished", declined: "Declined" };
    page("Bookings",
      el("div", { class: "stats" },
        el("div", { class: "stat" }, el("b", { text: L.pending.length }), el("span", { text: "Requests waiting for you" })),
        el("div", { class: "stat" }, el("b", { text: L.confirmed.filter(r => r.dining_date >= t).length }), el("span", { text: "Confirmed evenings ahead" })),
        el("div", { class: "stat" }, el("b", { text: next ? fmt(next.dining_date, { day: "numeric", month: "short" }) : "None" }), el("span", { text: "Next evening" }), next && el("small", { text: `${next.name}, ${next.guests} guests` }))),
      boards.bookings ? [
        el("div", { class: "toolbar toolbar--end" }, viewSwitch("bookings")),
        kanban([
          { key: "pending", title: "Requests", items: L.pending, card: kanBooking },
          { key: "accepted", title: "Confirmed", items: L.confirmed, card: kanBooking },
          { key: "completed", title: "Finished", items: L.finished, card: kanBooking },
          { key: "closed", title: "Declined or cancelled", items: L.declined, card: kanBooking, red: true }])
      ] : el("div", { class: "cols" },
        el("section", null,
          el("div", { class: "toolbar toolbar--split" },
            el("div", { class: "tabs", role: "tablist" }, Object.keys(names).map(k =>
              el("button", { class: "tab", type: "button", role: "tab", "aria-selected": !pickedDay && tab === k ? "true" : "false", onclick: () => { tab = k; pickedDay = null; render(); } }, names[k], el("i", { text: L[k].length })))),
            viewSwitch("bookings")),
          pickedDay && el("div", { class: "dayline" }, el("span", { text: "Showing " + longDate(pickedDay) }), btn("Show all", () => { pickedDay = null; render(); }, true)),
          el("div", { class: "list" }, showing.length ? showing.map(card) : el("p", { class: "empty", text: pickedDay ? "Nothing on this evening." : tab === "pending" ? "No requests waiting." : "Nothing here yet." }))),
        miniCalendar()));
  }

  /* ── claypot takeaway orders: paid online, so they arrive already confirmed ── */
  const potsLine = list => Object.keys(ED).map(k => [list.filter(o => o.edition === k).reduce((n, o) => n + o.qty, 0), ED[k].short]).filter(x => x[0]).map(x => `${x[0]} ${x[1]}`).join(" · ");
  const invoiceNo = o => o.invoice_no ? "CP-" + o.invoice_no : "";
  function orderWa(o) {
    const what = `${o.qty} x ${edLabel(o)}`;
    return wa(o.phone, o.status === "confirmed"
      ? `Hi ${first(o.name)}, this is Ian from The Dinerworkshop. Your Claypot Rice order (${what}) is confirmed for collection on ${longDate(o.pickup_date)}.`
      : `Hi ${first(o.name)}, this is Ian from The Dinerworkshop. Thank you for your Claypot Rice order (${what}) for ${longDate(o.pickup_date)}.`);
  }
  function setOrder(o, status) {
    patch(o, { status }, row => {
      if (status === "confirmed") toast(`${row.name}'s order is confirmed.`, { href: orderWa(row), text: "Message on WhatsApp" });
      else toast(`${row.name}: ${OSTATUS[status].toLowerCase()}.`);
    }, "claypot_orders");
  }
  function orderCard(o) {
    const notes = el("textarea", { value: o.admin_notes || "", placeholder: "Only you can see this", onblur: e => {
      const v = e.target.value.trim() || null;
      if (v !== (o.admin_notes || null)) patch(o, { admin_notes: v }, () => toast("Note saved."), "claypot_orders");
    } });
    const acts = [], guest = custOf(o.customer_id);
    if (o.status === "pending") acts.push(btn("Confirm", () => setOrder(o, "confirmed")), btn("Decline", () => setOrder(o, "cancelled"), true));
    if (o.status === "confirmed") acts.push(btn("Mark collected", () => setOrder(o, "collected")));
    acts.push(el("a", { class: "btn btn--wa", href: orderWa(o), target: "_blank", rel: "noopener", text: "WhatsApp" }));
    if (o.paid && o.email && o.status !== "unpaid") acts.push(btn(o.receipt_email_at ? "Email receipt again" : "Email invoice and receipt", () => emailReceipt(o), true));
    if (o.status === "confirmed") acts.push(btn("Cancel order", () => confirm(`Cancel ${o.name}'s order for ${longDate(o.pickup_date)}?` + (paysOf(o, "claypot_orders").some(p => p.method === "stripe") ? " It was paid online: refund it in Stripe as well." : "")) && setOrder(o, "cancelled"), true));
    if (o.status === "collected") acts.push(btn("Not collected yet", () => setOrder(o, "confirmed"), true));
    if (o.status === "cancelled") acts.push(btn("Back to prepare", () => setOrder(o, "confirmed"), true));
    acts.push(btn("Edit", () => editOrder(o), true));
    if (guest) acts.push(btn("Guest record", () => guestDlg(guest), true));
    return el("article", { class: "card" + (o.status === "cancelled" ? " is-cancelled" : "") },
      el("div", { class: "card__date" },
        el("b", { text: fmt(o.pickup_date, { day: "numeric" }) }),
        el("span", { text: fmt(o.pickup_date, { month: "short", year: "numeric" }) }),
        el("em", { text: fmt(o.pickup_date, { weekday: "long" }) }),
        el("strong", { text: "Collection" })),
      el("div", { class: "card__body" },
        el("div", { class: "card__head" },
          el("h3", { text: o.name }),
          el("span", { class: "chip chip--" + (o.status === "confirmed" || o.status === "collected" ? "accepted" : o.status === "unpaid" ? "pending" : o.status), text: OSTATUS[o.status] || o.status }),
          invoiceNo(o) ? el("span", { class: "chip", text: invoiceNo(o) }) : null,
          el("span", { class: "chip", text: o.source === "manual" ? "Added by you" : "From the website" })),
        el("p", { class: "card__meta", text: `${o.qty} x ${edLabel(o)} · ${money(o.total)}` }),
        el("p", { class: "card__contact" }, el("a", { href: tel(o.phone), text: o.phone }), o.email && [" · ", el("a", { href: mailto(o.email), text: o.email })]),
        o.keep_pot && el("dl", null, el("div", null, el("dt", { text: "Also asked about" }), el("dd", { text: "Rent or Keep The Pot" }))),
        o.status !== "unpaid" && o.status !== "pending" && payLine(o, "claypot_orders"),
        el("label", { class: "field card__notes" }, el("span", { text: "Your notes" }), notes),
        el("div", { class: "card__acts" }, acts),
        el("p", { class: "card__when", text: "Received " + stamp(o.created_at) + (o.receipt_email_at ? " · Invoice and receipt emailed " + stamp(o.receipt_email_at) : "") })));
  }
  function renderOrders() {
    const t = today(), key = ym(new Date());
    const L = {
      confirmed: orders.filter(o => o.status === "confirmed"),
      pending: orders.filter(o => o.status === "pending"),
      collected: orders.filter(o => o.status === "collected").reverse(),
      cancelled: orders.filter(o => o.status === "cancelled").reverse(),
      unpaid: orders.filter(o => o.status === "unpaid")
    };
    // "waiting for you" and "payment not finished" only show when there is something in them
    const names = Object.keys(OSTATUS).filter(k => L[k].length || k === "confirmed" || k === "collected" || k === "cancelled");
    if (!names.includes(otab)) otab = "confirmed";
    const ahead = orders.filter(o => (o.status === "pending" || o.status === "confirmed") && o.pickup_date >= t);
    const toCook = L.confirmed.filter(o => o.pickup_date >= t);
    const days = [...new Set(ahead.map(o => o.pickup_date))].sort();
    const showing = opicked ? orders.filter(o => o.pickup_date === opicked && o.status !== "cancelled" && o.status !== "unpaid") : L[otab];
    const earned = sum(monthPays(key, "claypot"), p => p.amount);
    page("Claypot orders",
      off.orders && el("p", { class: "note", text: "The claypot orders table is not set up in the database yet. Run the latest schema.sql in Supabase, then press Refresh." }),
      el("div", { class: "stats" },
        el("div", { class: "stat" }, el("b", { text: sum(toCook, o => o.qty) }), el("span", { text: "Pots to prepare" }), toCook.length ? el("small", { text: potsLine(toCook) }) : null),
        el("div", { class: "stat" }, el("b", { text: days[0] ? fmt(days[0], { day: "numeric", month: "short" }) : "None" }), el("span", { text: "Next collection day" }), days[0] && el("small", { text: potsLine(ahead.filter(o => o.pickup_date === days[0])) })),
        el("div", { class: "stat" }, el("b", { text: money(earned) }), el("span", { text: "Received this month" }))),
      boards.orders ? [
        el("div", { class: "toolbar toolbar--end" }, viewSwitch("orders")),
        kanban(["pending", "confirmed", "collected", "cancelled"].filter(k => k !== "pending" || L.pending.length)
          .map(k => ({ key: k, title: OSTATUS[k], items: L[k], card: kanOrder, red: k === "cancelled" })))
      ] : el("div", { class: "cols" },
        el("section", null,
          el("div", { class: "toolbar toolbar--split" },
            el("div", { class: "tabs", role: "tablist" }, names.map(k =>
              el("button", { class: "tab", type: "button", role: "tab", "aria-selected": !opicked && otab === k ? "true" : "false", onclick: () => { otab = k; opicked = null; render(); } }, OSTATUS[k], el("i", { text: L[k].length })))),
            viewSwitch("orders")),
          opicked && el("div", { class: "dayline" }, el("span", { text: "Showing collection on " + longDate(opicked) }), btn("Show all", () => { opicked = null; render(); }, true)),
          el("div", { class: "list" }, showing.length ? showing.map(orderCard) : el("p", { class: "empty", text: opicked ? "No orders for this day." : otab === "confirmed" ? "No pots to prepare." : "Nothing here yet." }))),
        el("aside", { class: "cal", "aria-label": "Collection days" },
          el("div", { class: "cal__head" }, el("h2", { text: "Collection days" })),
          el("div", { class: "cal__list", style: "margin-top: 12px; padding-top: 0; border-top: 0" },
            days.length ? days.map(d => { const list = ahead.filter(o => o.pickup_date === d), wait = list.some(o => o.status === "pending");
              return el("button", { class: "cal__item" + (wait ? " is-wait" : ""), type: "button", "aria-pressed": d === opicked ? "true" : "false", onclick: () => { opicked = opicked === d ? null : d; render(); } },
                el("b", { text: fmt(d, { weekday: "short", day: "numeric" }) }),
                el("span", { text: fmt(d, { month: "short" }) + (wait ? " · new" : "") }),
                el("em", { text: potsLine(list) })); })
            : el("p", { text: "No collections coming up." })),
          el("div", { class: "cal__key" }, el("span", null, "Tap a day to see only its orders.")))));
  }
  function editOrder(o) {
    const isNew = !o;
    const v = o || { status: "confirmed", edition: "tasting", qty: 1, pickup_date: opicked || "" };
    const f = {
      name: el("input", { type: "text", required: true, maxlength: 120, value: v.name || "" }),
      phone: el("input", { type: "tel", required: true, maxlength: 40, value: v.phone || "" }),
      email: el("input", { type: "email", maxlength: 200, value: v.email || "" }),
      pickup_date: el("input", { type: "date", required: true, value: v.pickup_date || "" }),
      edition: el("select", null, Object.entries(ED).map(([k, e]) => el("option", { value: k, text: `${e.label} ($${e.price})` }))),
      qty: el("input", { type: "number", required: true, min: 1, max: 20, value: v.qty || 1 }),
      total: el("input", { type: "number", required: true, min: 0, value: v.total == null ? ED[v.edition].price * (v.qty || 1) : v.total }),
      status: el("select", null, Object.entries(OSTATUS).filter(([k]) => k !== "unpaid" || v.status === "unpaid").map(([k, t]) => el("option", { value: k, text: t }))),
      keep_pot: el("input", { type: "checkbox", checked: v.keep_pot })
    };
    f.edition.value = v.edition; f.status.value = v.status;
    const price = () => { f.total.value = (ED[f.edition.value] || { price: 0 }).price * Math.max(1, Number(f.qty.value) || 1); };
    f.edition.addEventListener("change", price); f.qty.addEventListener("input", price);
    const err = el("p", { class: "err", role: "alert", hidden: true });
    const save = el("button", { class: "btn", type: "submit", text: isNew ? "Add order" : "Save" });
    show(el("form", { class: "form", onsubmit: async e => {
      e.preventDefault();
      const body = { name: f.name.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim() || null, pickup_date: f.pickup_date.value, edition: f.edition.value,
        qty: Number(f.qty.value), total: Number(f.total.value), status: f.status.value, keep_pot: f.keep_pot.checked };
      save.disabled = true; err.hidden = true;
      try {
        if (isNew) {
          const out = await api("/rest/v1/claypot_orders", { method: "POST", body: { ...body, source: "manual" }, prefer: "return=representation" });
          orders.push((out && out[0]) || { ...body, source: "manual", id: String(Date.now()), created_at: new Date().toISOString() });
          otab = body.status; opicked = null;
          if (!off.crm) customers = await api("/rest/v1/customers?select=*&order=name.asc") || customers;     // a first-time guest now has a record
        } else {
          const out = await api(`/rest/v1/claypot_orders?id=eq.${encodeURIComponent(o.id)}`, { method: "PATCH", body, prefer: "return=representation" });
          Object.assign(o, (out && out[0]) || body);
        }
        sortByDate(orders, "pickup_date");
        dlg.close(); render(); toast(isNew ? "Order added. Tick “Payment received” when they pay." : "Saved.");
      } catch (ex) { err.textContent = "Could not save: " + ex.message; err.hidden = false; save.disabled = false; }
    } },
      el("h2", { text: isNew ? "Add an order" : "Edit order" }),
      el("div", { class: "form__row" }, lab("Name", f.name), lab("WhatsApp number", f.phone)),
      lab("Email (for the invoice and receipt)", f.email),
      el("div", { class: "form__row" }, lab("Collection date", f.pickup_date), lab("Status", f.status)),
      el("div", { class: "form__row" }, lab("Edition", f.edition), lab("Number of pots", f.qty)),
      lab("Total ($)", f.total),
      el("div", { class: "form__check" }, el("label", null, f.keep_pot, "Asked about Rent or Keep The Pot")),
      err,
      el("div", { class: "form__acts" },
        save, btn("Close", () => dlg.close(), true), el("span", { class: "sp" }),
        !isNew && btn("Delete", async () => {
          if (!confirm(`Delete ${o.name}'s order for good? This cannot be undone. Any payment stays in the accounts.`)) return;
          try { await api(`/rest/v1/claypot_orders?id=eq.${encodeURIComponent(o.id)}`, { method: "DELETE" }); orders = orders.filter(x => x !== o); dlg.close(); render(); toast("Order deleted."); }
          catch (ex) { err.textContent = "Could not delete: " + ex.message; err.hidden = false; }
        }, true))));
  }

  /* ── add your own booking, or edit one ── */
  function edit(r, seed) {
    const isNew = !r;
    const v = r || { status: "accepted", guests: 6, dining_date: pickedDay || "", dining_time: DEFAULT_TIME, ...(seed || {}) };
    const f = {
      name: el("input", { type: "text", required: true, maxlength: 120, value: v.name || "" }),
      phone: el("input", { type: "tel", required: true, maxlength: 40, value: v.phone || "" }),
      email: el("input", { type: "email", maxlength: 200, value: v.email || "" }),
      birthday: el("input", { type: "date", max: today(), value: v.birthday || "" }),
      dining_date: el("input", { type: "date", required: true, value: v.dining_date || "" }),
      dining_time: el("input", { type: "time", required: true, step: 900, value: hhmm(v.dining_time) }),
      guests: el("input", { type: "number", required: true, min: 1, max: 30, value: v.guests || 6 }),
      amount: el("input", { type: "number", min: 0, step: "0.01", inputmode: "decimal", value: v.amount == null ? "" : v.amount, placeholder: "Optional" }),
      occasion: el("input", { type: "text", list: "occs", maxlength: 120, value: v.occasion || "" }),
      status: el("select", null, Object.entries(STATUS).map(([k, t]) => el("option", { value: k, text: t }))),
      dietary: el("input", { type: "text", maxlength: 1000, value: v.dietary || "" }),
      notes: el("textarea", { maxlength: 2000, value: v.notes || "" })
    };
    f.status.value = v.status;
    const err = el("p", { class: "err", role: "alert", hidden: true });
    const save = el("button", { class: "btn", type: "submit", text: isNew ? "Add booking" : "Save" });
    show(el("form", { class: "form", onsubmit: async e => {
      e.preventDefault();
      const body = {
        name: f.name.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim() || null, birthday: f.birthday.value || null,
        dining_date: f.dining_date.value, dining_time: f.dining_time.value || DEFAULT_TIME,
        guests: Number(f.guests.value), amount: f.amount.value === "" ? null : Number(f.amount.value), occasion: f.occasion.value.trim() || null,
        status: f.status.value, dietary: f.dietary.value.trim() || null, notes: f.notes.value.trim() || null
      };
      const clash = body.status === "accepted" && rows.find(x => x !== r && x.status === "accepted" && x.dining_date === body.dining_date);
      if (clash && !confirm(`${clash.name} is already confirmed for ${longDate(body.dining_date)}. Save this one as confirmed too?`)) return;
      save.disabled = true; err.hidden = true;
      try {
        if (isNew) {
          const out = await api("/rest/v1/bookings", { method: "POST", body: { ...body, source: "manual" }, prefer: "return=representation" });
          rows.push((out && out[0]) || { ...body, source: "manual", id: String(Date.now()), created_at: new Date().toISOString() });
          tab = { accepted: "confirmed", completed: "finished", pending: "pending" }[body.status] || "declined";
          if (view !== "calendar") { view = "bookings"; pickedDay = null; }
          if (!off.crm) customers = await api("/rest/v1/customers?select=*&order=name.asc") || customers;     // a first-time guest now has a record
        } else {
          const out = await api(`/rest/v1/bookings?id=eq.${encodeURIComponent(r.id)}`, { method: "PATCH", body, prefer: "return=representation" });
          Object.assign(r, (out && out[0]) || body);
        }
        sortByDate(rows, "dining_date");
        dlg.close(); render(); toast(isNew ? "Booking added." : "Saved.");
      } catch (ex) { err.textContent = "Could not save: " + ex.message; err.hidden = false; save.disabled = false; }
    } },
      el("h2", { text: isNew ? "Add a booking" : "Edit booking" }),
      el("div", { class: "form__row" }, lab("Name", f.name), lab("WhatsApp number", f.phone)),
      el("div", { class: "form__row" }, lab("Date", f.dining_date), lab("Time", f.dining_time)),
      el("div", { class: "form__row" }, lab("Guests", f.guests), lab("Status", f.status)),
      el("div", { class: "form__row" }, lab("Price for the evening ($)", f.amount), lab("Occasion", f.occasion)),
      el("div", { class: "form__row" }, lab("Email (optional)", f.email), lab("Birthday (optional)", f.birthday)),
      lab("Dietary requirements", f.dietary),
      lab("About their evening", f.notes),
      el("datalist", { id: "occs" }, OCCASIONS.map(o => el("option", { value: o }))),
      err,
      el("div", { class: "form__acts" },
        save, btn("Close", () => dlg.close(), true), el("span", { class: "sp" }),
        !isNew && btn("Delete", async () => {
          if (!confirm(`Delete ${r.name}'s booking for good? This cannot be undone. Any payment stays in the accounts.`)) return;
          try { await api(`/rest/v1/bookings?id=eq.${encodeURIComponent(r.id)}`, { method: "DELETE" }); rows = rows.filter(x => x !== r); dlg.close(); render(); toast("Booking deleted."); }
          catch (ex) { err.textContent = "Could not delete: " + ex.message; err.hidden = false; }
        }, true))));
  }

  /* ── calendar: the whole month, with evenings, collection days and birthdays. Drag an evening to move it. ── */
  function renderCalendar() {
    const y = big.getFullYear(), m = big.getMonth(), key = ym(big), t = today();
    const lead = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
    const by = {}, slot = k => by[k] || (by[k] = { b: [], o: [], c: [] });
    rows.forEach(r => { if (["pending", "accepted", "completed"].includes(r.status) && String(r.dining_date).slice(0, 7) === key) slot(r.dining_date).b.push(r); });
    orders.forEach(o => { if (["pending", "confirmed", "collected"].includes(o.status) && String(o.pickup_date).slice(0, 7) === key) slot(o.pickup_date).o.push(o); });
    customers.forEach(c => { if (c.birthday && Number(String(c.birthday).slice(5, 7)) === m + 1) slot(iso(new Date(y, m, Math.min(Number(String(c.birthday).slice(8, 10)), days)))).c.push(c); });
    const items = (k, long) => {
      const s = by[k] || { b: [], o: [], c: [] };
      return [
        ...s.b.sort((a, b) => hhmm(a.dining_time).localeCompare(hhmm(b.dining_time))).map(r => draggable(el("button", { class: "big__item big__item--" + r.status + " is-movable", type: "button", title: "Open. Drag to another day to move it." },
          el("b", { text: r.status === "pending" ? "Request" : clock(r.dining_time) }), ` ${r.name}${long ? ", " + r.guests + " guests" : " · " + r.guests}`),
          r, ".big__day[data-day]", (x, day) => moveBooking(x, day.dataset.day), () => bookingPop(r))),
        s.o.length ? el("button", { class: "big__item big__item--pot", type: "button", onclick: () => { view = "orders"; opicked = k; render(); scrollTo(0, 0); } },
          el("b", { text: "Claypot" }), " " + potsLine(s.o)) : null,
        ...s.c.map(c => el("button", { class: "big__item big__item--bday", type: "button", onclick: () => guestDlg(c) }, el("b", { text: "Birthday" }), " " + c.name))
      ].filter(Boolean);
    };
    const cells = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => el("div", { class: "big__dow", text: d }));
    for (let i = 0; i < lead; i++) cells.push(el("div", { class: "big__day is-blank" }));
    for (let d = 1; d <= days; d++) {
      const k = iso(new Date(y, m, d)), dow = new Date(y, m, d).getDay();
      const cell = el("div", { class: ["big__day", (dow === 1 || dow === 2) && "is-closed", k === t && "is-today"].filter(Boolean).join(" "), "data-day": k },
        el("button", { class: "big__num", type: "button", "aria-label": "Add a booking on " + longDate(k), title: "Add a booking on this day", text: d, onclick: () => edit(null, { dining_date: k }) }),
        items(k));
      cells.push(cell);
    }
    const busy = Object.keys(by).sort();
    page("Calendar",
      monthNav(big, d => { big = d; }),
      el("div", { class: "cal__key cal__key--row" },
        el("span", null, el("i", { style: "background: var(--ink)" }), "Confirmed evening"),
        el("span", null, el("i", { style: "box-shadow: inset 0 0 0 1.5px var(--wait)" }), "Request waiting"),
        el("span", null, el("i", { style: "background: var(--gold)" }), "Claypot collection"),
        el("span", null, el("i", { style: "background: #c9d8cd" }), "Birthday"),
        el("span", { class: "big__hint", text: "Drag an evening to another day to move it. Tap a day number to add a booking." })),
      el("div", { class: "big" }, cells),
      // on a phone the grid is too small to read, so the same month is listed day by day
      el("div", { class: "agenda" }, busy.length ? busy.map(k => el("div", { class: "agenda__day" },
        el("h3", { text: fmt(k, { weekday: "long", day: "numeric", month: "long" }) }), items(k, true)))
        : el("p", { class: "empty", text: "Nothing in " + monthName(big, { month: "long" }) + "." }),
        btn("Add a booking", () => edit(null), true)));
  }

  /* ── guests: everyone who has booked or ordered, with their birthday, visits and spending ── */
  function guestStats(c) {
    const b = rows.filter(r => r.customer_id === c.id), o = orders.filter(x => x.customer_id === c.id && x.status !== "unpaid"), p = payments.filter(x => x.customer_id === c.id);
    const seen = b.filter(r => r.status === "accepted" || r.status === "completed"), bought = o.filter(x => x.status === "confirmed" || x.status === "collected");
    const dates = [...seen.map(r => r.dining_date), ...bought.map(x => x.pickup_date)].sort(), t = today();
    return { b, o, p, evenings: seen.length, pots: sum(bought, x => x.qty), spent: sum(p, x => x.amount), last: dates.filter(d => d <= t).pop() || null, next: dates.find(d => d > t) || null };
  }
  async function deleteGuest(c, show) {
    if (!confirm(`Delete ${c.name} from the guest list? Their bookings, orders and payments stay.`)) return false;
    try { await api(`/rest/v1/customers?id=eq.${encodeURIComponent(c.id)}`, { method: "DELETE" }); customers = customers.filter(x => x !== c); dlg.open && dlg.close(); render(); toast("Guest deleted."); return true; }
    catch (ex) { show ? show("Could not delete: " + ex.message) : toast("Could not delete: " + ex.message); return false; }
  }
  const rowDel = (label, fn) => el("button", { class: "rowdel", type: "button", "aria-label": label, title: label, onclick: fn }, icon(ICONS.trash));
  const rowBlank = () => el("span", { class: "rowdel rowdel--blank", "aria-hidden": "true" });
  function renderGuests() {
    const host = el("div", { class: "guests" });
    const fill = () => {
      const q = gq.trim().toLowerCase(), qd = q.replace(/\D/g, "");
      const list = customers.filter(c => !q || c.name.toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q) || (qd && String(c.phone || "").replace(/\D/g, "").includes(qd)));
      host.replaceChildren(...(list.length ? [
        el("div", { class: "rowwrap" }, el("div", { class: "guest guest--head" }, el("span", { text: "Guest" }), el("span", { text: "Birthday" }), el("span", { text: "Evenings" }), el("span", { text: "Pots" }), el("span", { text: "Spent" }), el("span", { text: "Last here" })), rowBlank()),
        ...list.map(c => { const s = guestStats(c);
          return el("div", { class: "rowwrap" }, el("button", { class: "guest", type: "button", onclick: () => guestDlg(c) },
            el("span", { class: "guest__who" }, el("b", { text: c.name }), el("small", { text: [c.phone, c.email].filter(Boolean).join(" · ") })),
            el("span", { "data-l": "Birthday", text: c.birthday ? bdayText(c.birthday) : "" }),
            el("span", { "data-l": "Evenings", text: s.evenings || "" }),
            el("span", { "data-l": "Pots", text: s.pots || "" }),
            el("span", { "data-l": "Spent", text: s.spent ? money(s.spent) : "" }),
            el("span", { "data-l": "Last here", text: s.last ? shortDate(s.last) : s.next ? "Coming " + shortDate(s.next) : "" })),
            rowDel("Delete " + c.name, () => deleteGuest(c))); })
      ] : [el("p", { class: "empty", text: customers.length ? "No guest matches that." : "No guests yet. They are added by themselves when someone books or orders." })]));
    };
    const search = el("input", { type: "search", placeholder: "Search by name, number or email", value: gq, "aria-label": "Search guests", oninput: e => { gq = e.target.value; fill(); } });
    const bdays = upcomingBirthdays(60);
    fill();
    page("Guests",
      setupNote(),
      el("div", { class: "stats" },
        el("div", { class: "stat" }, el("b", { text: customers.length }), el("span", { text: "Guests on record" })),
        el("div", { class: "stat" }, el("b", { text: customers.filter(c => c.birthday).length }), el("span", { text: "With a birthday on record" })),
        el("div", { class: "stat" }, el("b", { text: bdays[0] ? bdayText(bdays[0].c.birthday) : "None" }), el("span", { text: "Next birthday" }), bdays[0] && el("small", { text: bdays[0].c.name }))),
      el("div", { class: "cols" },
        el("section", null,
          el("div", { class: "toolbar" }, el("label", { class: "field field--grow" }, search),
            el("button", { class: "btn", type: "button", onclick: () => guestDlg(null) }, icon(ICONS.plus), "Add guest"),
            btn("Download guests (CSV)", () => csvFile("dinerworkshop-guests.csv", [["Name", "Phone", "Email", "Birthday", "Evenings", "Pots", "Spent (SGD)", "Last here", "Notes"],
              ...customers.map(c => { const s = guestStats(c); return [c.name, c.phone || "", c.email || "", c.birthday || "", s.evenings, s.pots, s.spent, s.last || "", c.notes || ""]; })]), true)),
          host),
        el("aside", { class: "cal", "aria-label": "Birthdays" },
          el("div", { class: "cal__head" }, el("h2", { text: "Birthdays, next 60 days" })),
          el("div", { class: "rowlist", style: "margin-top: 10px" }, bdays.length ? bdays.map(x => el("button", { class: "rowlist__item", type: "button", onclick: () => guestDlg(x.c) },
            el("b", { text: bdayText(x.c.birthday) }), el("span", { text: x.c.name }), el("em", { text: x.in === 0 ? "Today" : x.in === 1 ? "Tomorrow" : `In ${x.in} days` })))
            : el("p", { text: "No birthdays coming up." })))));
  }
  function guestDlg(c) {
    const isNew = !c, v = c || {}, s = c ? guestStats(c) : null;
    const f = {
      name: el("input", { type: "text", required: true, maxlength: 120, value: v.name || "" }),
      phone: el("input", { type: "tel", maxlength: 40, value: v.phone || "" }),
      email: el("input", { type: "email", maxlength: 200, value: v.email || "" }),
      birthday: el("input", { type: "date", max: today(), value: v.birthday || "" }),
      notes: el("textarea", { maxlength: 4000, value: v.notes || "", placeholder: "Favourites, allergies, anything worth remembering" })
    };
    const err = el("p", { class: "err", role: "alert", hidden: true });
    const save = el("button", { class: "btn", type: "submit", text: isNew ? "Add guest" : "Save" });
    const history = s && [
      ...s.b.map(r => ({ on: r.dining_date, text: `Dining, ${r.guests} guests · ${STATUS[r.status]}${r.amount != null ? " · " + money(r.amount) : ""}` })),
      ...s.o.map(o => ({ on: o.pickup_date, text: `Claypot, ${o.qty} x ${edShort(o)} · ${OSTATUS[o.status]} · ${money(o.total)}` }))
    ].sort((a, b) => a.on < b.on ? 1 : -1);
    show(el("form", { class: "form", onsubmit: async e => {
      e.preventDefault();
      const body = { name: f.name.value.trim(), phone: f.phone.value.trim() || null, email: f.email.value.trim() || null, birthday: f.birthday.value || null, notes: f.notes.value.trim() || null };
      save.disabled = true; err.hidden = true;
      try {
        if (isNew) {
          const out = await api("/rest/v1/customers", { method: "POST", body, prefer: "return=representation" });
          customers.push((out && out[0]) || { ...body, id: String(Date.now()) });
          customers.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          const out = await api(`/rest/v1/customers?id=eq.${encodeURIComponent(c.id)}`, { method: "PATCH", body, prefer: "return=representation" });
          Object.assign(c, (out && out[0]) || body);
        }
        dlg.close(); render(); toast(isNew ? "Guest added." : "Saved.");
      } catch (ex) { err.textContent = /duplicate|unique/i.test(ex.message) ? "Another guest already has that phone number." : "Could not save: " + ex.message; err.hidden = false; save.disabled = false; }
    } },
      el("h2", { text: isNew ? "Add a guest" : v.name }),
      s && el("p", { text: [s.evenings ? `${s.evenings} evening${s.evenings > 1 ? "s" : ""}` : null, s.pots ? `${s.pots} pot${s.pots > 1 ? "s" : ""}` : null, s.spent ? money(s.spent) + " spent" : null].filter(Boolean).join(" · ") || "No visits yet." }),
      el("div", { class: "form__row" }, lab("Name", f.name), lab("WhatsApp number", f.phone)),
      el("div", { class: "form__row" }, lab("Email", f.email), lab("Birthday", f.birthday)),
      lab("Notes", f.notes),
      history && history.length ? el("div", { class: "history" }, el("h3", { text: "History" }), history.map(h => el("p", null, el("b", { text: shortDate(h.on) }), " " + h.text))) : null,
      err,
      el("div", { class: "form__acts" },
        save, btn("Close", () => dlg.close(), true),
        !isNew && v.phone ? el("a", { class: "btn btn--wa", href: wa(v.phone, `Hi ${first(v.name)}, this is Ian from The Dinerworkshop.`), target: "_blank", rel: "noopener", text: "WhatsApp" }) : null,
        el("span", { class: "sp" }),
        !isNew && btn("Delete guest", () => deleteGuest(c, m => { err.textContent = m; err.hidden = false; }), true))));
  }

  /* ── accounts: every payment received, by month, with a spreadsheet to download ── */
  function payFor(p) {
    const r = p.booking_id && rows.find(x => x.id === p.booking_id), o = p.order_id && orders.find(x => x.id === p.order_id);
    if (r) return `Dining on ${shortDate(r.dining_date)}, ${r.guests} guests`;
    if (o) return `Claypot ${invoiceNo(o)}: ${o.qty} x ${edShort(o)}, collection ${shortDate(o.pickup_date)}`.replace("  ", " ");
    return p.note || KINDS[p.kind] || "";
  }
  const payRow = p => [p.paid_on, KINDS[p.kind] || p.kind, p.payer || "", payFor(p), METHODS[p.method] || p.method, Number(p.amount), p.note || "", p.stripe_ref || ""];
  const PAY_HEAD = ["Date", "Type", "From", "For", "Paid by", "Amount (SGD)", "Note", "Reference"];
  async function deletePayment(p, show) {
    const stripe = p.method === "stripe";
    if (!confirm(stripe ? `This ${money(p.amount)} was paid online through Stripe. Deleting it here does not refund the guest. Delete it from the accounts anyway?`
      : `Delete this ${money(p.amount)} payment${p.payer ? " from " + p.payer : ""} from the accounts?`)) return false;
    try {
      await api(`/rest/v1/payments?id=eq.${encodeURIComponent(p.id)}`, { method: "DELETE" });
      payments = payments.filter(x => x !== p);
      // the booking or order it paid for is no longer paid, unless another payment still covers it
      const r = p.booking_id && rows.find(x => x.id === p.booking_id), o = p.order_id && orders.find(x => x.id === p.order_id);
      if (r && r.paid && !paysOf(r, "bookings").length) await patch(r, { paid: false });
      if (o && o.paid && !paysOf(o, "claypot_orders").length) await patch(o, { paid: false }, null, "claypot_orders");
      dlg.open && dlg.close(); render(); toast("Payment deleted."); return true;
    } catch (ex) { show ? show("Could not delete: " + ex.message) : toast("Could not delete: " + ex.message); return false; }
  }
  function renderAccounts() {
    const key = ym(acc), list = monthPays(key).slice().sort((a, b) => a.paid_on < b.paid_on ? -1 : a.paid_on > b.paid_on ? 1 : 0);
    const part = k => sum(list.filter(p => p.kind === k), p => p.amount);
    const due = rows.filter(r => r.status === "accepted" && !r.paid);
    page("Accounts",
      setupNote(),
      monthNav(acc, d => { acc = d; }),
      el("div", { class: "stats stats--4" },
        el("div", { class: "stat" }, el("b", { text: money(part("dining")) }), el("span", { text: "Dining" })),
        el("div", { class: "stat" }, el("b", { text: money(part("claypot")) }), el("span", { text: "Claypot" })),
        el("div", { class: "stat" }, el("b", { text: money(part("other")) }), el("span", { text: "Other" })),
        el("div", { class: "stat" }, el("b", { text: money(sum(list, p => p.amount)) }), el("span", { text: "Total received" }), el("small", { text: `${list.length} payment${list.length === 1 ? "" : "s"}` }))),
      el("div", { class: "toolbar", style: "margin-top: 22px" },
        btn(`Download ${monthName(acc, { month: "long" })} (CSV)`, () => csvFile(`dinerworkshop-payments-${key}.csv`, [PAY_HEAD, ...list.map(payRow), ["", "", "", "", "Total", sum(list, p => p.amount), "", ""]])),
        btn("Download everything (CSV)", () => csvFile("dinerworkshop-payments-all.csv", [PAY_HEAD, ...payments.map(payRow)]), true),
        el("button", { class: "btn btn--ghost", type: "button", onclick: () => paymentDlg(null) }, icon(ICONS.plus), "Add payment")),
      el("div", { class: "ledger" },
        list.length ? [
          el("div", { class: "rowwrap" }, el("div", { class: "ledger__row ledger__row--head" }, el("span", { text: "Date" }), el("span", { text: "From" }), el("span", { text: "For" }), el("span", { text: "Paid by" }), el("span", { text: "Amount" })), rowBlank()),
          ...list.map(p => el("div", { class: "rowwrap" }, el("button", { class: "ledger__row" + (p.amount < 0 ? " is-refund" : ""), type: "button", onclick: () => paymentDlg(p) },
            el("span", { text: fmt(p.paid_on, { day: "numeric", month: "short" }) }), el("span", { text: p.payer || "" }), el("span", { text: payFor(p) }),
            el("span", { text: METHODS[p.method] || p.method }), el("span", { text: money(p.amount) })),
            rowDel("Delete this payment", () => deletePayment(p)))),
          el("div", { class: "rowwrap" }, el("div", { class: "ledger__row ledger__row--foot" }, el("span"), el("span", { text: "Total" }), el("span"), el("span"), el("span", { text: money(sum(list, p => p.amount)) })), rowBlank())
        ] : el("p", { class: "empty", text: "No payments in " + monthName(acc) + "." })),
      due.length ? el("section", { class: "panel", style: "margin-top: 26px" },
        el("h2", { text: "Confirmed, not paid yet" }),
        el("div", { class: "rowlist" }, due.map(r => el("button", { class: "rowlist__item", type: "button", onclick: () => { view = "bookings"; pickedDay = r.dining_date; render(); scrollTo(0, 0); } },
          el("b", { text: fmt(r.dining_date, { weekday: "short", day: "numeric", month: "short" }) }), el("span", { text: `${r.name}, ${r.guests} guests` }), el("em", { text: r.amount != null ? money(r.amount) : "No price set" }))))) : null);
  }
  // a payment that is not tied to a booking or an order (or a correction to one)
  function paymentDlg(p) {
    const isNew = !p, v = p || { kind: "other", method: "paynow", paid_on: today() }, stripe = v.method === "stripe";
    const f = {
      payer: el("input", { type: "text", maxlength: 120, value: v.payer || "" }),
      amount: el("input", { type: "number", required: true, step: "0.01", inputmode: "decimal", value: v.amount == null ? "" : v.amount }),
      kind: el("select", null, Object.entries(KINDS).map(([k, t]) => el("option", { value: k, text: t }))),
      method: el("select", null, Object.entries(METHODS).filter(([k]) => k !== "stripe" || stripe).map(([k, t]) => el("option", { value: k, text: t }))),
      paid_on: el("input", { type: "date", required: true, value: v.paid_on }),
      note: el("input", { type: "text", maxlength: 1000, value: v.note || "" })
    };
    f.kind.value = v.kind; f.method.value = v.method;
    if (stripe) [f.amount, f.method, f.kind].forEach(n => { n.disabled = true; });
    const err = el("p", { class: "err", role: "alert", hidden: true });
    const save = el("button", { class: "btn", type: "submit", text: isNew ? "Add payment" : "Save" });
    show(el("form", { class: "form", onsubmit: async e => {
      e.preventDefault();
      const body = { payer: f.payer.value.trim() || null, paid_on: f.paid_on.value, note: f.note.value.trim() || null };
      if (!stripe) Object.assign(body, { amount: Number(f.amount.value), kind: f.kind.value, method: f.method.value });
      save.disabled = true; err.hidden = true;
      try {
        if (isNew) {
          const out = await api("/rest/v1/payments", { method: "POST", body, prefer: "return=representation" });
          payments.push((out && out[0]) || { ...body, id: String(Date.now()), created_at: new Date().toISOString() });
          acc = asDate(body.paid_on); acc.setDate(1);
        } else {
          const out = await api(`/rest/v1/payments?id=eq.${encodeURIComponent(p.id)}`, { method: "PATCH", body, prefer: "return=representation" });
          Object.assign(p, (out && out[0]) || body);
        }
        dlg.close(); render(); toast(isNew ? "Payment added." : "Saved.");
      } catch (ex) { err.textContent = "Could not save: " + ex.message; err.hidden = false; save.disabled = false; }
    } },
      el("h2", { text: isNew ? "Add a payment" : "Payment" }),
      el("p", { text: isNew ? "For money that is not tied to a booking or an order. For those, tick “payment received” on the booking or the order instead."
        : stripe ? "Paid online through Stripe: " + payFor(p) + ". The amount cannot be changed here; refund it in Stripe." : payFor(p) }),
      el("div", { class: "form__row" }, lab("From", f.payer), lab("Amount ($)", f.amount)),
      el("div", { class: "form__row" }, lab("Type", f.kind), lab("Paid by", f.method)),
      el("div", { class: "form__row" }, lab("Date received", f.paid_on), lab("Note", f.note)),
      err,
      el("div", { class: "form__acts" },
        save, btn("Close", () => dlg.close(), true), el("span", { class: "sp" }),
        !isNew && btn("Delete payment", () => deletePayment(p, m => { err.textContent = m; err.hidden = false; }), true))));
  }

  async function refresh() {
    try { await load(); render(); } catch (e) { if (session) toast("Could not load: " + e.message); }
  }
  async function start() {
    app.replaceChildren(el("div", { class: "gate" }, el("p", { text: "Loading…" })));
    try { await load(); render(); }
    catch (e) { if (session) app.replaceChildren(el("div", { class: "gate" }, el("div", { class: "gate__card" }, el("h1", { text: "Bookings" }), el("p", { class: "err", text: "Could not load: " + e.message }), btn("Try again", start)))); }
  }
  addEventListener("focus", () => { if (session && rows && Date.now() - loadedAt > 60000 && !dlg.open) refresh(); });

  if (session && DB && DB.ready) start(); else gate();
})();
