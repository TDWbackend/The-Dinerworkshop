// POST /api/claypot-checkout
// The claypot page calls this when a guest presses "Pay". It checks the order, saves it as "unpaid", and answers
// with the address of the Stripe payment page. The order only becomes "confirmed" when Stripe tells
// /api/stripe-webhook that the money has arrived.
//
// Environment variables (Vercel, never NEXT_PUBLIC_):
//   STRIPE_SECRET_KEY     Stripe secret or restricted key (Checkout Sessions: write)
//   SUPABASE_SECRET_KEY   the Supabase secret key (visitors may not add claypot orders themselves)
import { db, json, SB_URL, SERVICE, SITE } from "@/lib/server/supabase";

const STRIPE = process.env.STRIPE_SECRET_KEY ?? "";
const MAX_POTS = 10;
const BACKEND = { service: true } as const;

// today's date in Singapore, as YYYY-MM-DD
const sgToday = () => new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
const addDays = (iso: string, n: number) => new Date(Date.parse(iso + "T00:00:00Z") + n * 86400000).toISOString().slice(0, 10);
const longDate = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export async function POST(req: Request) {
  if (!SB_URL || !SERVICE || !STRIPE) return json(503, { error: "Payments are not set up yet." });

  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json(400, { error: "Bad request" }); }
  if (b.company) return json(400, { error: "Bad request" });                       // the hidden field only robots fill

  const name = String(b.name ?? "").trim();
  const phone = String(b.phone ?? "").trim();
  const email = String(b.email ?? "").trim();
  const pickup = String(b.pickup_date ?? "");
  const edition = String(b.edition ?? "");
  const qty = Number(b.qty);
  if (!name || name.length > 120) return json(400, { error: "Please tell us your name." });
  if (phone.replace(/\D/g, "").length < 8 || phone.length > 40) return json(400, { error: "Please add a number we can reach you on." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return json(400, { error: "Please add an email address for your receipt." });
  if (!Number.isInteger(qty) || qty < 1 || qty > MAX_POTS) return json(400, { error: "Please choose between 1 and " + MAX_POTS + " pots." });
  if (!/^\d{4}-\d\d-\d\d$/.test(pickup) || isNaN(Date.parse(pickup + "T00:00:00Z"))) return json(400, { error: "Please choose a pick-up Monday." });
  // orders need a week, and pick-up is every Monday
  if (new Date(pickup + "T00:00:00Z").getUTCDay() !== 1 || pickup < addDays(sgToday(), 7)) {
    return json(400, { error: "Please choose a Monday at least one week from today." });
  }

  try {
    const eds = await db(BACKEND, "/claypot_editions?select=edition,label,price&edition=eq." + encodeURIComponent(edition));
    const ed = eds && eds[0];
    if (!ed) return json(400, { error: "Please choose an edition." });

    // saved as unpaid; the database works out the total from its own price list
    const rows = await db(BACKEND, "/claypot_orders", {
      method: "POST", prefer: "return=representation",
      body: JSON.stringify({ status: "unpaid", source: "website", name, phone, email, pickup_date: pickup, edition, qty, keep_pot: !!b.keep_pot }),
    });
    const order = rows[0];

    const p = new URLSearchParams();
    p.set("mode", "payment");
    p.set("success_url", SITE + "/claypot?paid=1#order");
    p.set("cancel_url", SITE + "/claypot?paid=0#order");
    p.set("client_reference_id", order.id);
    p.set("customer_email", email);
    p.set("expires_at", String(Math.floor(Date.now() / 1000) + 31 * 60));         // an unpaid order is dropped after half an hour
    p.set("line_items[0][quantity]", String(qty));
    p.set("line_items[0][price_data][currency]", "sgd");
    p.set("line_items[0][price_data][unit_amount]", String(Math.round(Number(ed.price) * 100)));
    p.set("line_items[0][price_data][product_data][name]", "Signature Claypot Rice, " + ed.label);
    p.set("line_items[0][price_data][product_data][description]", "Collection on " + longDate(pickup));
    p.set("metadata[order_id]", order.id);
    p.set("payment_intent_data[metadata][order_id]", order.id);
    p.set("payment_intent_data[description]", "Claypot Rice order CP-" + order.invoice_no);

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: "Bearer " + STRIPE, "Content-Type": "application/x-www-form-urlencoded", "Idempotency-Key": "checkout-" + order.id },
      body: p,
    });
    const session = await res.json();
    if (!res.ok || !session.url) {
      console.error("Stripe refused the session:", session && session.error && session.error.message);
      await db(BACKEND, "/claypot_orders?id=eq." + order.id + "&status=eq.unpaid", { method: "DELETE" }).catch(() => {});
      return json(502, { error: "We could not open the payment page just now. Please try again." });
    }
    await db(BACKEND, "/claypot_orders?id=eq." + order.id, { method: "PATCH", body: JSON.stringify({ stripe_session: session.id }) });
    return json(200, { url: session.url });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error && /too many/i.test(e.message) ? e.message : "We could not take your order just now. Please try again.";
    return json(500, { error: msg });
  }
}
