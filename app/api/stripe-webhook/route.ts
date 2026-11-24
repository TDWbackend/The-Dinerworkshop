// POST /api/stripe-webhook : Stripe calls this when something happens to a payment.
//   paid            -> the order becomes "confirmed", the payment goes into the accounts, the guest gets the
//                      invoice and receipt, and Ian gets a "new order" email.
//   page expired    -> the unpaid order is dropped.
//   refunded        -> a minus payment goes into the accounts; a full refund cancels the order.
//
// Environment variables (Vercel, never NEXT_PUBLIC_):
//   STRIPE_WEBHOOK_SECRET   the "whsec_..." signing secret of the webhook endpoint in Stripe
//   SUPABASE_SECRET_KEY     the Supabase secret key
// In Stripe, point the webhook at  https://www.thedinerworkshop.com/api/stripe-webhook  and send it:
//   checkout.session.completed, checkout.session.async_payment_succeeded, checkout.session.expired, charge.refunded
import { sendEmail } from "@/lib/server/email";
import { db, SB_URL, SERVICE } from "@/lib/server/supabase";

const WH_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";
const BACKEND = { service: true } as const;

const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, "0")).join("");
function same(a: string, b: string) {                      // compares without leaking where the strings differ
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
// only Stripe knows the signing secret, so a correct signature proves the message is from Stripe
async function fromStripe(raw: string, header: string | null) {
  if (!header) return false;
  const parts = header.split(",").map(s => s.trim().split("="));
  const t = (parts.find(p => p[0] === "t") || [])[1];
  const sigs = parts.filter(p => p[0] === "v1").map(p => p[1]);
  if (!t || !sigs.length || Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(WH_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const want = hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(t + "." + raw)));
  return sigs.some(s => same(s, want));
}

// an email that fails must not undo the payment: it is logged, and Ian can resend from the desk
async function email(kind: string, id: string) {
  try { await sendEmail(BACKEND, kind, id); } catch (e) { console.error("email", kind, e); }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function paid(s: any) {
  if (s.payment_status !== "paid") return;                  // a slow payment method: wait for async_payment_succeeded
  const id = s.client_reference_id || (s.metadata && s.metadata.order_id);
  if (!id) return;
  // only the first message about a payment changes anything, so a repeat from Stripe cannot double up
  const rows = await db(BACKEND, "/claypot_orders?id=eq." + encodeURIComponent(id) + "&paid=eq.false", {
    method: "PATCH", prefer: "return=representation",
    body: JSON.stringify({ status: "confirmed", paid: true, paid_at: new Date().toISOString() }),
  });
  const order = rows && rows[0];
  if (!order) return;
  await db(BACKEND, "/payments?on_conflict=stripe_ref", {
    method: "POST", prefer: "resolution=ignore-duplicates",
    body: JSON.stringify({
      kind: "claypot", amount: (s.amount_total ?? order.total * 100) / 100, method: "stripe",
      order_id: order.id, customer_id: order.customer_id, payer: order.name,
      note: "Claypot Rice order CP-" + order.invoice_no, stripe_ref: s.payment_intent || s.id,
    }),
  });
  await email("claypot_receipt", order.id);
  await email("claypot_notify", order.id);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function refunded(c: any) {
  const ref = c.payment_intent;
  if (!ref) return;
  const pays = await db(BACKEND, "/payments?select=*&stripe_ref=eq." + encodeURIComponent(ref));
  const pay = pays && pays[0];
  if (!pay) return;
  // Stripe reports the running total refunded; only what is new since last time is added
  const before = await db(BACKEND, "/payments?select=amount&stripe_ref=like." + encodeURIComponent("refund:" + c.id + ":*"));
  const already = (before || []).reduce((n: number, r: { amount: number }) => n + Number(r.amount), 0);
  const delta = -(c.amount_refunded / 100) - already;
  if (Math.abs(delta) >= 0.005) {
    await db(BACKEND, "/payments?on_conflict=stripe_ref", {
      method: "POST", prefer: "resolution=ignore-duplicates",
      body: JSON.stringify({
        kind: pay.kind, amount: delta, method: "stripe", order_id: pay.order_id, booking_id: pay.booking_id,
        customer_id: pay.customer_id, payer: pay.payer, note: "Refund", stripe_ref: "refund:" + c.id + ":" + c.amount_refunded,
      }),
    });
  }
  if (c.refunded && pay.order_id) {
    await db(BACKEND, "/claypot_orders?id=eq." + pay.order_id, { method: "PATCH", body: JSON.stringify({ status: "cancelled" }) });
  }
}

export async function POST(req: Request) {
  if (!SB_URL || !SERVICE || !WH_SECRET) return new Response("Not set up", { status: 503 });
  const raw = await req.text();
  if (!(await fromStripe(raw, req.headers.get("stripe-signature")))) return new Response("Bad signature", { status: 400 });
  try {
    const event = JSON.parse(raw);
    const o = event.data && event.data.object;
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") await paid(o);
    else if (event.type === "checkout.session.expired") {
      const id = o.client_reference_id || (o.metadata && o.metadata.order_id);
      if (id) await db(BACKEND, "/claypot_orders?id=eq." + encodeURIComponent(id) + "&status=eq.unpaid", { method: "DELETE" });
    } else if (event.type === "charge.refunded") await refunded(o);
    return Response.json({ received: true });
  } catch (e) {
    console.error(e);
    return new Response("Error", { status: 500 });           // Stripe will try again later
  }
}
