// The wording and design of every email the site sends. Pure functions (no network, no secrets), so
// scripts/preview-emails.mjs can render them to files for checking.
//   bookingConfirmed  to the guest, when Ian confirms their evening
//   claypotReceipt    to the guest, the invoice and payment receipt for a paid claypot order
//   claypotNotify     to Ian, "a new claypot order has been paid"

export type Mail = { subject: string; html: string; text: string };
type Row = [string, string];

const WHERE = "17 Admiralty Road East, Singapore 759975 (Near Sembawang Park)";
const WHATSAPP = "+65 8071 0506";
const WA_LINK = "https://wa.me/6580710506";

// the site's colours
const CREAM = "#f1eadf", PAPER = "#f8f4ec", INK = "#2a1d16", SOFT = "#7a6c5f", LINE = "#e2d9c9", BRONZE = "#8a6a45";
const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";

// guests typed these words: they are shown as text, never as markup
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
const first = (name: string) => String(name || "").trim().split(/\s+/)[0] || "there";
export const longDate = (iso: string) =>
  new Date(String(iso).slice(0, 10) + "T12:00:00Z").toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const clock = (t: string) => { const [h, m] = String(t || "19:00").slice(0, 5).split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
const money = (n: unknown) => "$" + Number(n || 0).toFixed(2);

type Parts = {
  site: string;
  label: string;                       // the small line above the heading
  heading: string;
  intro: string[];
  rows: Row[];
  outro: string[];
  button?: { text: string; url: string };
};

// One layout for every email: the round logo, a small label, the heading, a few lines, the details, one button.
// Built from tables and inline styles, which is what email programs (Gmail, Outlook, Apple Mail) need.
function layout(p: Parts) {
  const cell = `padding:13px 0;border-bottom:1px solid ${LINE};font:300 15px/1.5 ${SANS};color:${INK};vertical-align:top`;
  const rows = p.rows.map(([k, v]) =>
    `<tr><td style="${cell};width:36%;padding-right:12px;font-size:11px;line-height:1.9;letter-spacing:.14em;text-transform:uppercase;color:${SOFT}">${esc(k)}</td><td style="${cell}">${esc(v)}</td></tr>`).join("");
  const button = p.button ? `<tr><td align="center" style="padding:30px 40px 0">
<table role="presentation" cellspacing="0" cellpadding="0"><tr><td bgcolor="${INK}" style="background:${INK};border-radius:2px">
<a href="${esc(p.button.url)}" style="display:inline-block;padding:15px 30px;font:400 12px/1 ${SANS};letter-spacing:.18em;text-transform:uppercase;color:${CREAM};text-decoration:none">${esc(p.button.text)}</a>
</td></tr></table></td></tr>` : "";
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"><title>${esc(p.heading)}</title></head>
<body style="margin:0;padding:0;background:${CREAM};-webkit-text-size-adjust:100%">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="${CREAM}" style="background:${CREAM}"><tr><td align="center" style="padding:36px 14px 44px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="${PAPER}" style="max-width:580px;background:${PAPER};border:1px solid ${LINE}">
<tr><td align="center" style="padding:44px 40px 0"><img src="${p.site}/assets/logo-ink.png" width="118" height="122" alt="The Dinerworkshop" style="display:block;width:118px;height:auto;border:0"></td></tr>
<tr><td align="center" style="padding:30px 40px 0;font:400 11px/1.4 ${SANS};letter-spacing:.24em;text-transform:uppercase;color:${BRONZE}">${esc(p.label)}</td></tr>
<tr><td align="center" style="padding:12px 40px 0;font:300 29px/1.14 ${SANS};letter-spacing:-.01em;text-transform:uppercase;color:${INK}">${esc(p.heading)}</td></tr>
<tr><td align="center" style="padding:22px 0 0"><table role="presentation" cellspacing="0" cellpadding="0"><tr><td width="44" height="1" bgcolor="${BRONZE}" style="width:44px;height:1px;background:${BRONZE};font-size:0;line-height:0">&nbsp;</td></tr></table></td></tr>
<tr><td style="padding:26px 40px 0;font:300 15px/1.65 ${SANS};color:${INK}">${p.intro.map(t => `<p style="margin:0 0 10px">${esc(t)}</p>`).join("")}</td></tr>
<tr><td style="padding:10px 40px 0"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid ${LINE}">${rows}</table></td></tr>
${button}
<tr><td style="padding:28px 40px 40px;font:300 13px/1.65 ${SANS};color:${SOFT}">${p.outro.map(t => `<p style="margin:0 0 10px">${esc(t)}</p>`).join("")}</td></tr>
</table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:580px"><tr><td align="center" style="padding:24px 24px 0;font:300 12px/1.7 ${SANS};color:${SOFT}">
The Dinerworkshop<br>${esc(WHERE)}<br><a href="${p.site}" style="color:${SOFT};text-decoration:underline">${esc(p.site.replace(/^https?:\/\//, ""))}</a>
</td></tr></table>
</td></tr></table></body></html>`;
  const text = [p.heading.toUpperCase(), "", ...p.intro, "", ...p.rows.map(([k, v]) => `${k}: ${v}`), "",
    ...(p.button ? [`${p.button.text}: ${p.button.url}`, ""] : []), ...p.outro, "", "The Dinerworkshop", WHERE, p.site].join("\n");
  return { html, text };
}

export type Booking = { name: string; dining_date: string; dining_time: string; guests: number; occasion?: string | null; dietary?: string | null };
export type Order = { name: string; phone: string; email?: string | null; qty: number; total: number; invoice_no: number;
  pickup_date: string; paid_at?: string | null; created_at: string; keep_pot?: boolean | null };
export type Edition = { label: string; price: number };

export function bookingConfirmed(r: Booking, site: string): Mail {
  const rows: Row[] = [
    ["Date", longDate(r.dining_date)], ["Time", clock(r.dining_time)], ["Guests", String(r.guests)],
    ["Where", "The Dinerworkshop, " + WHERE],
  ];
  if (r.occasion) rows.push(["Occasion", r.occasion]);
  if (r.dietary) rows.push(["Dietary requirements", r.dietary]);
  return { subject: "Your evening at The Dinerworkshop is confirmed", ...layout({
    site, label: "Private Dining", heading: "Your evening is confirmed",
    intro: [`Dear ${first(r.name)},`, "Your private dining evening at The Dinerworkshop is confirmed."],
    rows,
    button: { text: "WhatsApp Ian", url: WA_LINK },
    outro: ["If you need to postpone your dining experience with 14 days or more notice, the 50% deposit will be credited toward a rescheduled date within 90 days. Within 7 days of the event, the deposit will be forfeited due to the bespoke fresh ingredient sourcing.",
      `For anything at all, reach Ian on WhatsApp at ${WHATSAPP}.`],
  }) };
}

const invoiceOf = (o: Order) => "CP-" + o.invoice_no;
const itemOf = (ed: Edition) => `Signature Claypot Rice, ${ed.label}`;

export function claypotReceipt(o: Order, ed: Edition, site: string): Mail {
  const paidOn = longDate(new Date(Date.parse(o.paid_at || o.created_at) + 8 * 3600 * 1000).toISOString());   // Singapore date
  return { subject: `Your Claypot Rice order ${invoiceOf(o)}: invoice and receipt`, ...layout({
    site, label: "Signature Claypot Rice", heading: "Thank you for your order",
    intro: [`Dear ${first(o.name)},`, "Your payment has been received and your order is confirmed. This email is your invoice and your receipt."],
    rows: [["Invoice", invoiceOf(o)], ["Date paid", paidOn], ["Billed to", `${o.name}, ${o.phone}`],
      ["Item", `${o.qty} x ${itemOf(ed)}`], ["Price each", money(ed.price)], ["Total paid", money(o.total) + " (SGD)"],
      ["Collection", longDate(o.pickup_date)], ["Collect from", "The Dinerworkshop, " + WHERE]],
    button: { text: "WhatsApp Ian", url: WA_LINK },
    outro: [`For anything at all, reach Ian on WhatsApp at ${WHATSAPP}.`],
  }) };
}

export function claypotNotify(o: Order, ed: Edition, site: string): Mail {
  return { subject: `New claypot order ${invoiceOf(o)}: ${o.qty} x ${ed.label}, ${longDate(o.pickup_date)}`, ...layout({
    site, label: "The bookings desk", heading: "New claypot order",
    intro: [`${o.name} has ordered and paid.`],
    rows: [["Order", invoiceOf(o)], ["Pots", `${o.qty} x ${itemOf(ed)}`], ["Collection", longDate(o.pickup_date)], ["Paid", money(o.total)],
      ["Name", o.name], ["WhatsApp", o.phone], ["Email", o.email || "Not given"],
      ...(o.keep_pot ? [["Also asked about", "Rent or Keep The Pot"] as Row] : [])],
    button: { text: "Open the desk", url: site + "/admin" },
    outro: [],
  }) };
}
