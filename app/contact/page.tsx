import { BootScript } from "@/components/BootScript";
import { TX_BOOT } from "@/lib/boot";
import { Scripts } from "@/components/Scripts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us · The Dinerworkshop",
  description: "Concierge & Contact: reach The Dinerworkshop in the Sembawang Colonial Enclave, near Sembawang Park. WhatsApp +65 8071 0506.",
};

export default function ContactPage() {
  return (
    <>
      <link rel="stylesheet" href={"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap"} precedence="dw" />
      <link rel="stylesheet" href="/assets/pages/contact.css?v=1" precedence="dw" />
      <link rel="stylesheet" href="/assets/book.css?v=2" precedence="dw" />
      <link rel="stylesheet" href="/assets/foot.css?v=2" precedence="dw" />
      <link rel="stylesheet" href={"https://fonts.googleapis.com/css2?family=Inter+Tight:wght@200;300;400&family=Inter:wght@300;400;500&display=swap"} precedence="dw" />
      <link rel="stylesheet" href="/assets/type.css?v=17" precedence="dw" />
      <link rel="stylesheet" href="/assets/motion.css?v=5" precedence="dw" />
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
          <a className="btn" href="#book" data-book="">
            Book Now
          </a>
          {" "}
          <button className="burger" id="burger" type="button" aria-label="Menu">
            <span></span>
          </button>
        </div>
      </header>
      {/* ─────────────── concierge & contact: the booking form sits right here ─────────────── */}
      <section className="ct-top" id="top">
        <div className="inner ct-top__grid">
          <div className="ct-top__text">
            <h1 className="rv">
              {"Concierge & Contact"}
            </h1>
            <p className="lead rv d1">
              Submit your preferred date and group size via our concierge page or WhatsApp (minimum 2 weeks in advance).
            </p>
            <p className="lead rv d2">
              Ian will be in touch personally to discuss a suitable evening.
            </p>
          </div>
          <div className="ct-top__book rv d1" id="book">
            <div id="bookInline"></div>
          </div>
        </div>
      </section>
      {/* ─────────────── details ─────────────── */}
      <section className="ct-info pad">
        <div className="inner">
          <div className="ct-info__grid">
            <div className="ct-info__item rv">
              <p className="ct-label">
                Location
              </p>
              <p className="v">
                17 Admiralty Road East S759975 (Near Sembawang Park)
              </p>
            </div>
            <div className="ct-info__item rv d1">
              <p className="ct-label">
                Phone
              </p>
              <p className="v">
                <a href="tel:+6580710506">
                  +65 8071 0506
                </a>
              </p>
            </div>
            <div className="ct-info__item rv d2">
              <p className="ct-label">
                Email
              </p>
              <p className="v">
                <a href="mailto:thedinerworkshop@gmail.com">
                  thedinerworkshop@gmail.com
                </a>
              </p>
            </div>
            <div className="ct-info__item rv">
              <p className="ct-label">
                Operating Days
              </p>
              <p className="v">
                Wednesday through Sunday (Minimum 2 weeks advance reservation only)
              </p>
            </div>
            <div className="ct-info__item rv d1">
              <p className="ct-label">
                Time
              </p>
              <p className="v">
                7:00 PM til late (One sitting per evening)
              </p>
            </div>
            <div className="ct-info__item rv d2">
              <p className="ct-label">
                Pet Policy
              </p>
              <p className="v">
                Proudly Pet-Friendly (Pawparents to a rescued dog and cat)
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ─────────────── map ─────────────── */}
      <section className="ct-map pad">
        <div className="inner">
          <div className="ct-map__head rv">
            <p className="ct-label">
              Find Us
            </p>
            <h2>
              Sembawang Colonial Enclave
            </h2>
          </div>
          <div className="ct-map__frame rv d1">
            <iframe src="https://www.google.com/maps?q=The+Dinerworkshop+Sembawang+Singapore&z=16&output=embed" title="Map showing The Dinerworkshop, 17 Admiralty Road East, Singapore" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe>
          </div>
          <p className="ct-map__note rv d2">
            17 Admiralty Road East, Singapore 759975 · Near Sembawang Park
          </p>
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
                <a href="/contact" aria-current="page">
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
          "/assets/pages/contact.js?v=1",
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
