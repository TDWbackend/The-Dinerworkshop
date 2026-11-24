// Server-side access to the Supabase project. Only files under app/api import this, so nothing here reaches the browser.
import "server-only";

export const SB_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
export const PUBLISHABLE = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
// The secret key (sb_secret_... or the older service_role key). It skips the database's rules, so it is only ever
// set in Vercel > Environment Variables (never NEXT_PUBLIC_, never in the repo). Needed for Stripe payments only.
export const SERVICE = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
export const SITE = (process.env.SITE_URL ?? "https://www.thedinerworkshop.com").replace(/\/+$/, "");

// who a database request is made as: the backend itself (secret key), or a signed-in admin (their access token)
export type Actor = { service: true } | { token: string };

export async function db(actor: Actor, path: string, init: RequestInit & { prefer?: string } = {}) {
  const { prefer, ...rest } = init;
  const headers: Record<string, string> = "service" in actor
    ? { apikey: SERVICE, Authorization: "Bearer " + SERVICE }
    : { apikey: PUBLISHABLE, Authorization: "Bearer " + actor.token };
  if (rest.body) headers["Content-Type"] = "application/json";
  if (prefer) headers.Prefer = prefer;
  const res = await fetch(SB_URL + "/rest/v1" + path, { ...rest, headers, cache: "no-store" });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error((data && data.message) || "Database error " + res.status);
  return data;
}

// is this access token a signed-in account the database lists as an admin?
export async function isAdmin(token: string) {
  if (!token || !SB_URL || !PUBLISHABLE) return false;
  const res = await fetch(SB_URL + "/rest/v1/rpc/is_admin", {
    method: "POST", cache: "no-store",
    headers: { apikey: PUBLISHABLE, Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: "{}",
  });
  return res.ok && (await res.json()) === true;
}

export const json = (status: number, body: unknown) => Response.json(body, { status });
