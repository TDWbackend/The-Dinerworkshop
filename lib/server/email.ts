// Every email the site sends is written here.
//   booking_confirmed  to the guest, when Ian confirms their evening (sent from the bookings desk)
//   claypot_receipt    to the guest, the invoice and payment receipt for a paid claypot order
//   claypot_notify     to Ian, "a new claypot order has been paid"
//
// Environment variables (Vercel > Settings > Environment Variables):
//   RESEND_API_KEY   from resend.com, after the sending domain is verified there
//   MAIL_FROM        optional, default  The Dinerworkshop <hello@thedinerworkshop.com>
//   REPLY_TO         optional, where a guest's reply goes, default thedinerworkshop@gmail.com
//   NOTIFY_EMAIL     optional, where Ian's "new order" emails go, default thedinerworkshop@gmail.com
//   SITE_URL         optional, default https://www.thedinerworkshop.com
import "server-only";
import { db, SITE, type Actor } from "./supabase";

const RESEND = process.env.RESEND_API_KEY ?? "";
const FROM = process.env.MAIL_FROM ?? "The Dinerworkshop <hello@thedinerworkshop.com>";
const REPLY = process.env.REPLY_TO ?? "thedinerworkshop@gmail.com";
const NOTIFY = process.env.NOTIFY_EMAIL ?? "thedinerworkshop@gmail.com";

const WHERE = "17 Admiralty Road East, Singapore 759975 (Near Sembawang Park)";
const WHATSAPP = "+65 8071 0506";

export const emailReady = () => !!RESEND;

// a problem the caller should be told about, with the HTTP status to answer with
export class EmailError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

// guests typed these words: they are shown as text, never as markup
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
const first = (name: string) => String(name || "").trim().split(/\s+/)[0] || "there";
const longDate = (iso: string) =>
  new Date(String(iso).slice(0, 10) + "T12:00:00Z").toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const clock = (t: string) => { const [h, m] = String(t || "19:00").slice(0, 5).split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
const money = (n: unknown) => "$" + Number(n || 0).toFixed(2);

type Row = [string, string];
// one plain layout for every email: the wordmark, a heading, a few lines, a table of details
function layout(heading: string, intro: string[], rows: Row[], outro: string[]) {
  const td = "padding:9px 0;border-bottom:1px solid #e3dccf;font:300 15px/1.5 Helvetica,Arial,sans-serif;color:#2a1d16;vertical-align:top";
  const html = `<!doctype html><html><body style="margin:0;background:#f1eadf">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1eadf"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#f7f2e8;border:1px solid #e3dccf">
<tr><td style="padding:30px 32px 0"><img src="${SITE}/assets/wordmark-ink.png" alt="The Dinerworkshop" height="34" style="display:block;height:34px;border:0"></td></tr>
<tr><td style="padding:26px 32px 0;font:300 26px/1.15 Helvetica,Arial,sans-serif;letter-spacing:-.01em;text-transform:uppercase;color:#2a1d16">${esc(heading)}</td></tr>
<tr><td style="padding:14px 32px 0;font:300 15px/1.6 Helvetica,Arial,sans-serif;color:#2a1d16">${intro.map(p => `<p style="margin:0 0 10px">${esc(p)}</p>`).join("")}</td></tr>
<tr><td style="padding:8px 32px 0"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows.map(([k, v]) =>
    `<tr><td style="${td};width:38%;color:#7a6c5f;font-size:12px;letter-spacing:.06em;text-transform:uppercase">${esc(k)}</td><td style="${td}">${esc(v)}</td></tr>`).join("")}</table></td></tr>
<tr><td style="padding:20px 32px 30px;font:300 14px/1.6 Helvetica,Arial,sans-serif;color:#7a6c5f">${outro.map(p => `<p style="margin:0 0 10px">${esc(p)}</p>`).join("")}</td></tr>
</table></td></tr></table></body></html>`;
  const text = [heading.toUpperCase(), "", ...intro, "", ...rows.map(([k, v]) => `${k}: ${v}`), "", ...outro].join("\n");
  return { html, text };
}

async function send(to: string, subject: string, body: { html: string; text: string }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + RESEND, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY, subject, html: body.html, text: body.text }),
  });
  if (!res.ok) throw new Error("The email service refused it (" + res.status + "): " + (await res.text()).slice(0, 300));
}

// `actor` is who reads the booking or order: the signed-in admin (the bookings desk) or the backend (Stripe webhook)
export async function sendEmail(actor: Actor, kind: string, rawId: string): Promise<{ sent: true; to: string }> {
  if (!RESEND) throw new EmailError(503, "Email is not set up yet (no RESEND_API_KEY).");
  const id = encodeURIComponent(String(rawId ?? ""));

  if (kind === "booking_confirmed") {
    const r = (await db(actor, "/bookings?select=*&id=eq." + id))[0];
    if (!r) throw new EmailError(404, "No such booking");
    if (!r.email) throw new EmailError(400, "This booking has no email address.");
    if (r.status !== "accepted") throw new EmailError(400, "Only a confirmed booking can be emailed.");
    const rows: Row[] = [
      ["Date", longDate(r.dining_date)], ["Time", clock(r.dining_time)], ["Guests", String(r.guests)],
      ["Where", "The Dinerworkshop, " + WHERE],
    ];
    if (r.occasion) rows.push(["Occasion", r.occasion]);
    if (r.dietary) rows.push(["Dietary requirements", r.dietary]);
    await send(r.email, "Your evening at The Dinerworkshop is confirmed", layout(
      "Your evening is confirmed",
      [`Dear ${first(r.name)},`, "Your private dining evening at The Dinerworkshop is confirmed."],
      rows,
      ["If you need to postpone your dining experience with at least 7 days notice, the payment will be credited toward a rescheduled date within 90 days. With less than 7 days notice, the payment will be forfeited due to the bespoke fresh ingredient sourcing.",
        `For anything at all, reach Ian on WhatsApp at ${WHATSAPP}.`]));
    await db(actor, "/bookings?id=eq." + id, { method: "PATCH", body: JSON.stringify({ confirmed_email_at: new Date().toISOString() }) });
    return { sent: true, to: r.email };
  }

  if (kind === "claypot_receipt" || kind === "claypot_notify") {
    const o = (await db(actor, "/claypot_orders?select=*&id=eq." + id))[0];
    if (!o) throw new EmailError(404, "No such order");
    const ed = (await db(actor, "/claypot_editions?select=label,price&edition=eq." + encodeURIComponent(o.edition)))[0] || { label: o.edition, price: o.total / o.qty };
    const invoice = "CP-" + o.invoice_no;
    const item = `Signature Claypot Rice, ${ed.label}`;
    const paidOn = longDate(new Date(Date.parse(o.paid_at || o.created_at) + 8 * 3600 * 1000).toISOString());

    if (kind === "claypot_notify") {
      await send(NOTIFY, `New claypot order ${invoice}: ${o.qty} x ${ed.label}, ${longDate(o.pickup_date)}`, layout(
        "New claypot order",
        [`${o.name} has ordered and paid.`],
        [["Order", invoice], ["Pots", `${o.qty} x ${item}`], ["Collection", longDate(o.pickup_date)], ["Paid", money(o.total)],
          ["Name", o.name], ["WhatsApp", o.phone], ["Email", o.email || "Not given"],
          ...(o.keep_pot ? [["Also asked about", "Rent or Keep The Pot"] as Row] : [])],
        [`Open the bookings desk: ${SITE}/admin`]));
      return { sent: true, to: NOTIFY };
    }

    if (!o.email) throw new EmailError(400, "This order has no email address.");
    if (!o.paid) throw new EmailError(400, "This order has not been paid.");
    await send(o.email, `Your Claypot Rice order ${invoice}: invoice and receipt`, layout(
      "Thank you for your order",
      [`Dear ${first(o.name)},`, "Your payment has been received and your order is confirmed. This email is your invoice and your receipt."],
      [["Invoice", invoice], ["Date paid", paidOn], ["Billed to", `${o.name}, ${o.phone}`],
        ["Item", `${o.qty} x ${item}`], ["Price each", money(ed.price)], ["Total paid", money(o.total) + " (SGD)"],
        ["Collection", longDate(o.pickup_date)], ["Collect from", "The Dinerworkshop, " + WHERE]],
      [`For anything at all, reach Ian on WhatsApp at ${WHATSAPP}.`]));
    await db(actor, "/claypot_orders?id=eq." + id, { method: "PATCH", body: JSON.stringify({ receipt_email_at: new Date().toISOString() }) });
    return { sent: true, to: o.email };
  }
  throw new EmailError(400, "Unknown email");
}
