// POST /api/send-email  { kind, id }
// Called by the bookings desk (public/assets/admin.js). Only a signed-in admin may call it: the request carries
// their Supabase access token, and the booking or order is read with that same token, so the database's own rules
// decide what they may see. The emails themselves are written in lib/server/email.ts.
import { EmailError, emailReady, sendEmail } from "@/lib/server/email";
import { isAdmin, json, PUBLISHABLE, SB_URL } from "@/lib/server/supabase";

export async function POST(req: Request) {
  if (!SB_URL || !PUBLISHABLE) return json(503, { error: "Not set up" });
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!(await isAdmin(token))) return json(401, { error: "Not allowed" });
  if (!emailReady()) return json(503, { error: "Email is not set up yet (no RESEND_API_KEY)." });

  let b: { kind?: string; id?: string };
  try { b = await req.json(); } catch { return json(400, { error: "Bad request" }); }
  try {
    return json(200, await sendEmail({ token }, String(b.kind ?? ""), String(b.id ?? "")));
  } catch (e) {
    if (e instanceof EmailError) return json(e.status, { error: e.message });
    console.error(e);
    return json(500, { error: e instanceof Error ? e.message : "Could not send" });
  }
}
