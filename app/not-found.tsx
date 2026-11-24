import { BootScript } from "@/components/BootScript";
import { TX_BOOT } from "@/lib/boot";
import { Scripts } from "@/components/Scripts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found · The Dinerworkshop",
  description: "This page is not on the menu. Find your way back to The Dinerworkshop.",
};

export default function NotFound() {
  return (
    <>
      <link rel="stylesheet" href={"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap"} precedence="dw" />
      <link rel="stylesheet" href="/assets/pages/not-found.css?v=1" precedence="dw" />
      <link rel="stylesheet" href="/assets/book.css?v=2" precedence="dw" />
      <link rel="stylesheet" href="/assets/foot.css?v=2" precedence="dw" />
      <link rel="stylesheet" href={"https://fonts.googleapis.com/css2?family=Inter+Tight:wght@200;300;400&family=Inter:wght@300;400;500&display=swap"} precedence="dw" />
      <link rel="stylesheet" href="/assets/type.css?v=17" precedence="dw" />
      <link rel="stylesheet" href="/assets/motion.css?v=4" precedence="dw" />
      <BootScript code={TX_BOOT} />
      <header className="nav" id="nav">
        <a className="nav__logo" href="/" aria-label="The Dinerworkshop, home">
          <img className="on-light" src="/assets/wordmark-ink.png" alt="The Dinerworkshop" />
          <img className="on-darkbg" src="/assets/wordmark-cream.png" alt="" />
        </a>
        <nav className="nav__links">
          <a href="/">
            Home
          </a>
          {" "}
          <a href="/about">
            About Us
          </a>
          {" "}
          <a href="/dining">
            Dining
          </a>
          {" "}
          <a href="/claypot">
            Claypot
          </a>
          {" "}
          <a href="/classes">
            Classes
          </a>
        </nav>
        <div className="nav__right">
          <a className="btn" href="/contact#book">
            Book Now
          </a>
          {" "}
          <button className="burger" id="burger" type="button" aria-label="Menu">
            <span></span>
          </button>
        </div>
      </header>
      {/* ─────────────── not found ─────────────── */}
      <section className="estate nf" id="top">
        <img className="estate__still" src="/assets/estate-zoom-end.jpg" alt="Sketch of The Dinerworkshop’s 1923 Black and White colonial estate" />
        <div className="estate__wash" aria-hidden="true"></div>
        <div className="inner estate__inner">
          <div className="story__text">
            <div className="nf__code rv">
              404
            </div>
            <h1 className="rv d1">
              This page is not on the menu.
            </h1>
            <p className="lead rv d2">
              The page you are looking for has moved or was never here. The estate, however, is right where it has always been.
            </p>
            <div className="nf__cta rv d3">
              <a className="btn" href="/">
                {"Back to Home "}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              {" "}
              <a className="btn btn--ghost" href="/contact#book">
                Book Now
              </a>
            </div>
          </div>
        </div>
      </section>
      <footer className="foot">
        <div className="inner foot__top">
          <div className="foot__brand">
            <a href="/" aria-label="The Dinerworkshop, home">
              <img className="foot__logo" src="/assets/logo-ink.png" alt="The Dinerworkshop" />
            </a>
            <p className="foot__line">
              Where Heritage Meets Culinary Curiosity.
            </p>
            <div className="foot__social">
              <a href="https://instagram.com/TheDinerworkshop" target="_blank" rel="noopener" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>
          <div className="foot__cols">
            <div className="foot__col">
              <p className="foot__h">
                Explore
              </p>
              <nav aria-label="Pages">
                <a href="/">
                  Home
                </a>
                {" "}
                <a href="/about">
                  About Us
                </a>
                {" "}
                <a href="/dining">
                  Dining
                </a>
                {" "}
                <a href="/claypot">
                  Claypot Rice
                </a>
                {" "}
                <a href="/classes">
                  Classes
                </a>
                {" "}
                <a href="/contact">
                  Contact Us
                </a>
              </nav>
            </div>
            <div className="foot__col">
              <p className="foot__h">
                Visit
              </p>
              <address>
                17 Admiralty Road East
                <br />
                Singapore 759975
                <br />
                <span className="foot__muted">
                  Near Sembawang Park
                </span>
              </address>
              <p style={{ marginTop: "14px" }}>
                Wed – Sun
                <br />
                <span className="foot__muted">
                  7:00 PM til late
                </span>
              </p>
            </div>
            <div className="foot__col">
              <p className="foot__h">
                Contact
              </p>
              <div className="foot__list">
                <a href="tel:+6580710506">
                  +65 8071 0506
                </a>
                {" "}
                <a href="mailto:thedinerworkshop@gmail.com">
                  thedinerworkshop@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="foot__mark" aria-hidden="true">
          The Dinerworkshop
        </div>
        <div className="inner foot__base">
          <span>
            © 2026 The Dinerworkshop. All rights reserved.
          </span>
        </div>
      </footer>
      <Scripts
        srcs={[
          "/assets/pages/not-found.js?v=1",
          "/assets/db.js?v=4",
          "/assets/book.js?v=8",
          "/assets/wa.js?v=2",
          "/assets/btn.js",
          "/assets/motion.js?v=5",
        ]}
      />
    </>
  );
}
