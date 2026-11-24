/* Booking backend (Supabase).
   The project's PUBLIC values come from the environment (NEXT_PUBLIC_SUPABASE_URL and
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, see app/layout.tsx). The publishable key is safe in the browser because the
   database's row-level security only lets visitors add a booking request and ask which evenings are taken.
   Secret keys never reach this file: they live in the server routes under app/api.
   While the values are empty the booking form simply works through WhatsApp, as before. */
window.DW_DB = (() => {
  const env = window.DW_ENV || {};
  const url = env.url || "";
  const key = env.key || "";
  const ready = !!(url && key);
  // Claypot orders are paid online by Stripe. NEXT_PUBLIC_CLAYPOT_PAY=true turns this on, only once the Stripe keys
  // are set; until then the order form hands over to WhatsApp as before.
  const pay = !!env.pay;

  // one request; `token` is a signed-in admin's access token (visitors send none)
  async function request(base, path, { method = "GET", body, token, prefer, timeout = 9000 } = {}) {
    if (!ready) throw new Error("Booking backend is not set up");
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeout);
    try {
      const headers = { apikey: key, Authorization: "Bearer " + (token || key) };
      if (body !== undefined) headers["Content-Type"] = "application/json";
      if (prefer) headers.Prefer = prefer;
      const res = await fetch(base + path, {
        method, headers, signal: ctl.signal,
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      const text = await res.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (_) { data = text; }
      if (!res.ok) {
        const err = new Error((data && (data.message || data.msg || data.error_description || data.error)) || ("Request failed (" + res.status + ")"));
        err.status = res.status;
        throw err;
      }
      return data;
    } finally { clearTimeout(timer); }
  }

  // the Supabase project (database and sign-in)
  const call = (path, opts) => request(url.replace(/\/+$/, ""), path, opts);
  // this site's own server routes (payment page, emails): app/api/<name>/route.ts
  const fn = (name, body, token) => request("", "/api/" + name, { method: "POST", body, token, timeout: 25000 });

  return { url, key, ready, pay: ready && pay, call, fn };
})();
