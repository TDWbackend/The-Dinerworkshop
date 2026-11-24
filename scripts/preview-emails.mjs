// Writes each email as an HTML file so the design can be checked in a browser.
//   node scripts/preview-emails.mjs [output-folder]
import fs from "node:fs";
import path from "node:path";
import { bookingConfirmed, claypotNotify, claypotReceipt } from "../lib/server/email-templates.ts";

const out = process.argv[2] || "email-previews";
const site = process.env.SITE_URL || "https://www.thedinerworkshop.com";
const booking = { name: "Sample Guest", dining_date: "2026-12-12", dining_time: "19:30", guests: 8, occasion: "A celebration", dietary: "One guest does not eat shellfish" };
const order = { name: "Sample Guest", phone: "+65 9123 4567", email: "guest@example.com", qty: 2, total: 300, invoice_no: 1001, pickup_date: "2026-12-15", paid_at: "2026-12-01T04:10:00Z", created_at: "2026-12-01T04:05:00Z", keep_pot: true };
const edition = { label: "The 'Grand' Edition", price: 150 };

fs.mkdirSync(out, { recursive: true });
for (const [file, mail] of [
  ["1-booking-confirmed.html", bookingConfirmed(booking, site)],
  ["2-claypot-receipt.html", claypotReceipt(order, edition, site)],
  ["3-claypot-new-order-to-ian.html", claypotNotify(order, edition, site)],
]) {
  fs.writeFileSync(path.join(out, file), mail.html);
  console.log(file, "|", mail.subject);
}
