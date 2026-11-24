/** @type {import('next').NextConfig} */
const nextConfig = {
  // the old static pages ended in .html: send those addresses to the new ones
  async redirects() {
    const pages = ["about", "dining", "claypot", "classes", "contact", "admin"];
    return [
      { source: "/index.html", destination: "/", permanent: true },
      ...pages.map(p => ({ source: `/${p}.html`, destination: `/${p}`, permanent: true })),
    ];
  },
  // local checking only: DW_COMPARE_ORIGIN (in .env.local) shows another copy of the site under /_old for comparison
  async rewrites() {
    const old = process.env.DW_COMPARE_ORIGIN;
    return old ? [{ source: "/_old/:path*", destination: `${old}/:path*` }] : [];
  },
};
export default nextConfig;
