import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://www.thedinerworkshop.com"),
  // the picture a shared link shows (WhatsApp, iMessage, Facebook...): the home page's opening scene.
  // Each page's own title and description are used with it.
  openGraph: {
    type: "website",
    siteName: "The Dinerworkshop",
    locale: "en_SG",
    images: [{ url: "/assets/og-home.jpg", width: 1200, height: 630, alt: "The Dinerworkshop: where heritage meets culinary curiosity" }],
  },
  twitter: { card: "summary_large_image", images: ["/assets/og-home.jpg"] },
  icons: {
    icon: [{ url: "/assets/favicon-logo.png", type: "image/png", sizes: "64x64" }],
    apple: [{ url: "/assets/apple-touch-logo.png", sizes: "180x180" }],
  },
};

// The site keeps its own colours when the phone is in dark mode. Some browsers (Samsung Internet, in-app browsers)
// recolour any page that does not say it handles dark mode itself, and ignore "light only". So the page says it
// supports both, and its dark styles are simply the same colours again (see public/assets/type.css).
export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light dark" };

// The PUBLIC Supabase values, handed to public/assets/db.js. The publishable key is safe in the browser: the
// database's row-level security only lets visitors add a booking request and ask which evenings are taken.
const env = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  pay: process.env.NEXT_PUBLIC_CLAYPOT_PAY === "true",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // the boot scripts and the page scripts set classes on <html> and <body> themselves
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: "window.DW_ENV=" + JSON.stringify(env).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
