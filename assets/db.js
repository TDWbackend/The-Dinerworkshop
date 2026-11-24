/* Booking backend (Supabase).
   `url` and `key` are the project's PUBLIC values: the key is the publishable ("anon") key, which is
   safe in the browser because the database's row-level security only lets visitors add a booking
   request and ask which evenings are taken. Never put the service_role / secret key in this file.
   While both are empty the booking form simply works through WhatsApp, as before. */
window.DW_DB = (() => {
  const url = "https://onhobpfdquzcnvazccck.supabase.co";
  const key = "sb_publishable_bt3PwVF2Gv1eNlgGGZuuqQ_abO3CUu8";
  const ready = !!(url && key);
  // Claypot orders are paid online by Stripe. Turn this on only once the claypot-checkout and stripe-webhook
  // functions are deployed with their Stripe keys; until then the order form hands over to WhatsApp as before.
  const pay = false;

  // one request to the project; `token` is a signed-in admin's access token (visitors send none)
  async function call(path, { method = "GET", body, token, prefer, timeout = 9000 } = {}) {
    if (!ready) throw new Error("Booking backend is not set up");
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeout);
    try {
      const headers = { apikey: key, Authorization: "Bearer " + (token || key) };
      if (body !== undefined) headers["Content-Type"] = "application/json";
      if (prefer) headers.Prefer = prefer;
      const res = await fetch(url.replace(/\/+$/, "") + path, {
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

  // one of the backend's server functions (payment page, emails)
  const fn = (name, body, token) => call("/functions/v1/" + name, { method: "POST", body, token, timeout: 25000 });

  return { url, key, ready, pay: ready && pay, call, fn };
})();
