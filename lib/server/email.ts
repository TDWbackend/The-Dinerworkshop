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
import { bookingConfirmed, claypotNotify, claypotReceipt, type Mail } from "./email-templates";
import { db, SERVICE, SITE, type Actor } from "./supabase";

const RESEND = process.env.RESEND_API_KEY ?? "";
const FROM = process.env.MAIL_FROM ?? "The Dinerworkshop <hello@thedinerworkshop.com>";
const REPLY = process.env.REPLY_TO ?? "thedinerworkshop@gmail.com";
const NOTIFY = process.env.NOTIFY_EMAIL ?? "thedinerworkshop@gmail.com";

export const emailReady = () => !!RESEND;

// a problem the caller should be told about, with the HTTP status to answer with
export class EmailError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

async function send(to: string, mail: Mail) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + RESEND, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY, subject: mail.subject, html: mail.html, text: mail.text }),
  });
  if (!res.ok) throw new Error("The email service refused it (" + res.status + "): " + (await res.text()).slice(0, 300));
}

// The price list is only readable by the backend (secret key). Without it (a resend from the desk before Stripe is
// set up), the edition's name comes from this list and the price from the order itself.
const EDITION_LABELS: Record<string, string> = { tasting: "The 'Tasting' Edition", grand: "The 'Grand' Edition" };
async function editionOf(o: { edition: string; total: number; qty: number }) {
  const fallback = { label: EDITION_LABELS[o.edition] ?? o.edition, price: o.total / o.qty };
  if (!SERVICE) return fallback;
  try {
    return (await db({ service: true }, "/claypot_editions?select=label,price&edition=eq." + encodeURIComponent(o.edition)))[0] || fallback;
  } catch { return fallback; }
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
    await send(r.email, bookingConfirmed(r, SITE));
    await db(actor, "/bookings?id=eq." + id, { method: "PATCH", body: JSON.stringify({ confirmed_email_at: new Date().toISOString() }) });
    return { sent: true, to: r.email };
  }

  if (kind === "claypot_receipt" || kind === "claypot_notify") {
    const o = (await db(actor, "/claypot_orders?select=*&id=eq." + id))[0];
    if (!o) throw new EmailError(404, "No such order");
    const ed = await editionOf(o);

    if (kind === "claypot_notify") {
      await send(NOTIFY, claypotNotify(o, ed, SITE));
      return { sent: true, to: NOTIFY };
    }
    if (!o.email) throw new EmailError(400, "This order has no email address.");
    if (!o.paid) throw new EmailError(400, "This order has not been paid.");
    await send(o.email, claypotReceipt(o, ed, SITE));
    await db(actor, "/claypot_orders?id=eq." + id, { method: "PATCH", body: JSON.stringify({ receipt_email_at: new Date().toISOString() }) });
    return { sent: true, to: o.email };
  }
  throw new EmailError(400, "Unknown email");
}
