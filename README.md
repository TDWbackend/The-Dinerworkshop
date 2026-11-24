# The Dinerworkshop

The website for The Dinerworkshop, built with Next.js (App Router) and deployed on Vercel.
Bookings, guests and accounts live in Supabase; emails go through Resend; claypot payments through Stripe.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Where things are

| Path | What |
|---|---|
| `app/page.tsx`, `app/<page>/page.tsx` | The pages: Home, About, Dining, Claypot, Classes, Contact |
| `app/admin/page.tsx` | Ian's desk (`/admin`): bookings, claypot orders, calendar, guests, accounts |
| `app/not-found.tsx` | The "page not found" page |
| `app/layout.tsx` | The shell every page shares; passes the public Supabase values to the browser |
| `app/api/send-email` | Sends the booking confirmation (admin only) |
| `app/api/claypot-checkout` | Opens the Stripe payment page for a claypot order |
| `app/api/stripe-webhook` | Stripe tells the site a payment arrived, expired or was refunded |
| `lib/server/` | Server-only code: Supabase access and the email wording |
| `public/assets/` | Images, video, stylesheets and the page behaviour scripts |
| `public/assets/pages/` | Each page's own stylesheet and script |

## Environment variables

Public values are in `.env` (safe to commit). Secrets go in **Vercel > Settings > Environment Variables**
(and `.env.local` on your own machine); see `.env.example`.

| Name | Needed for | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | bookings, the desk | no |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | bookings, the desk | no |
| `RESEND_API_KEY` | emails | yes |
| `MAIL_FROM`, `REPLY_TO`, `NOTIFY_EMAIL`, `SITE_URL` | emails (all have defaults) | no |
| `SUPABASE_SECRET_KEY` | claypot payments | yes |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | claypot payments | yes |
| `NEXT_PUBLIC_CLAYPOT_PAY` | `true` switches the claypot form to pay online | no |

After changing a variable in Vercel, redeploy for it to take effect.

## How a page works

Each page is a React server component. Its behaviour (reveals, page transitions, the booking pop-up, the desk)
is plain JavaScript in `public/assets`, loaded by `components/Scripts.tsx` once React has taken over the page.
Links between pages are ordinary links, so every page view is a full load and the page-opening animation plays.
