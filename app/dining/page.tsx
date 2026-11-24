import { BootScript } from "@/components/BootScript";
import { TX_BOOT } from "@/lib/boot";
import { Scripts } from "@/components/Scripts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dining · The Dinerworkshop",
  description: "The Bespoke Dining Experience at The Dinerworkshop, Sembawang: the evening, how the personalized omakase works, the estate, prices, group size and booking.",
};

export default function DiningPage() {
  return (
    <>
      <link rel="stylesheet" href={"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap"} precedence="dw" />
      <link rel="stylesheet" href="/assets/pages/dining.css?v=1" precedence="dw" />
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
          <a href="/dining" className="is-current" aria-current="page">
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
      {/* ─────────────── hero ─────────────── */}
      <section className="d-hero" id="top" data-dark="">
        <img className="d-hero__img" src="/assets/experience/grill-baste.jpg" alt="Two pork chops basted with a brush over glowing charcoal" />
        <div className="inner d-hero__inner">
          <h1 className="rv">
            The Bespoke Dining Experience
          </h1>
          <p className="sub rv d1">
            An evening that proceeds entirely at your pace.
          </p>
          <div className="d-hero__cta rv d3">
            <a className="btn" href="#book" data-book="">
              {"Book Now "}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      {/* ─────────────── how the personalized omakase works ─────────────── */}
      <section className="d-how pad" id="how">
        <div className="inner">
          <div className="how__head how__head--mid">
            <p className="pre rv">
              How the Personalized Omakase Works
            </p>
            <h2 className="rv wordrise">
              No two evenings are identical.
            </h2>
            <p className="rv wordrise wordrise--quick">
              There is no fixed menu at The Dinerworkshop. You are part of the curating process: you share your palate, your occasion and your budget, and Ian builds the menu around your group. With a single sitting per evening, yours is the only table he is cooking for.
            </p>
          </div>
        </div>
        <div className="jour" id="jour">
          <article className="jrow">
            <div className="jrow__pic rv">
              <div className="jrow__img">
                <img src="/assets/dining/how-1.jpg" alt="Charcoal-grilled octopus skewers on a clay plate" loading="lazy" />
              </div>
            </div>
            <div className="jrow__txt rv">
              <div className="num">
                Step 1
              </div>
              <h3>
                The Culinary Discovery
              </h3>
              <p>
                Upon booking, we guide you through a preference questionnaire to understand your palate, dietary nuances, occasion, and preferred budget. We recommend a minimum of 2 weeks in advance to avoid disappointment.
              </p>
            </div>
          </article>
          <article className="jrow jrow--flip">
            <div className="jrow__pic rv">
              <div className="jrow__img">
                <img src="/assets/dining/how-2.jpg" alt="Seared beef topped with salmon roe" loading="lazy" />
              </div>
            </div>
            <div className="jrow__txt rv">
              <div className="num">
                Step 2
              </div>
              <h3>
                Artisanal Sourcing
              </h3>
              <p>
                We personally select the week's finest seasonal seafood, prime meats, and local botanicals exclusively for your booking.
              </p>
            </div>
          </article>
          <article className="jrow">
            <div className="jrow__pic rv">
              <div className="jrow__img">
                <img src="/assets/dining/how-3.jpg" alt="Seared steak carved into slices on a wooden board" loading="lazy" />
              </div>
            </div>
            <div className="jrow__txt rv">
              <div className="num">
                Step 3
              </div>
              <h3>
                The Omakase Unveiling
              </h3>
              <p>
                Arrive to a bespoke menu tailored precisely around your group's tastes.
              </p>
            </div>
          </article>
        </div>
      </section>
      {/* ─────────────── ingredient sourcing ─────────────── */}
      <section className="d-src pad">
        <div className="inner">
          <div className="src__head">
            <h2 className="rv">
              Purity is non-negotiable. We partner directly with boutique importers and local artisanal purveyors to source:
            </h2>
          </div>
          <div className="src__grid">
            <article className="src__card rv">
              <div className="src__img">
                <img src="/assets/sourcing/seafood.jpg" alt="A bowl of large prawns with greens and fried shallots" loading="lazy" />
              </div>
              <p>
                Air-flown seasonal seafood and wild-caught delicacies.
              </p>
            </article>
            <article className="src__card rv d1">
              <div className="src__img">
                <img src="/assets/sourcing/meats.jpg" alt="Seared beef carved into slices on a leaf-shaped platter" loading="lazy" />
              </div>
              <p>
                Hormone-free meats.
              </p>
            </article>
            <article className="src__card rv d2">
              <div className="src__img">
                <img src="/assets/sourcing/greens.jpg" alt="Fresh greens, herbs and vegetables laid out on the table" loading="lazy" />
              </div>
              <p>
                Locally sourced pesticide-free greens.
              </p>
            </article>
          </div>
        </div>
      </section>
      {/* ─────────────── investment & packages ─────────────── */}
      <section className="invest pad" id="investment">
        <div className="inner">
          <p className="pre rv">
            {"Investment & Packages"}
          </p>
          <h2 className="rv d1">
            Tailored to your ingredient selections.
          </h2>
          <div className="invest__grid">
            <div className="card rv">
              <div className="k">
                Bespoke Omakase Dinners
              </div>
              <div className="big">
                <span>
                  $150+ to $250+
                </span>
                <small>
                  per guest
                </small>
              </div>
              <p>
                Tailored to ingredient selections.
              </p>
            </div>
            <div className="card rv d1">
              <div className="k">
                {"Corkage & Cakeage Policy"}
              </div>
              <h3>
                Complimentary BYOB
              </h3>
              <ul>
                <li>
                  Complimentary BYOB for the first bottle.
                </li>
                <li>
                  No cakeage fee (we love celebration!)
                </li>
              </ul>
            </div>
            <div className="card rv d2">
              <div className="k">
                {"Dietary Tailoring & Allergies"}
              </div>
              <h3>
                Fully bespoke menus
              </h3>
              <p>
                Because every menu is fully bespoke, we seamlessly accommodate vegetarian, pescatarian, gluten-free, or specific dietary requirements with advance consultation.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ─────────────── booking, policy, faq ─────────────── */}
      <section className="booking pad" id="booking">
        <div className="inner">
          <h2 className="rv d1 booking__title">
            Reservation Process
          </h2>
          {/* group size, days and time: part of the reservation details */}
          <div className="facts facts--booking">
            <div className="fact rv d1">
              <svg className="fact__ic" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="16" cy="10.5" r="3.6" />
                <path d="M9.5 25v-2.2a6.5 6.5 0 0 1 13 0V25" />
                <circle cx="7.6" cy="13" r="2.7" />
                <path d="M2.5 24v-1.4a5 5 0 0 1 6.4-4.8" />
                <circle cx="24.4" cy="13" r="2.7" />
                <path d="M29.5 24v-1.4a5 5 0 0 0-6.4-4.8" />
              </svg>
              <div className="k">
                Group Size
              </div>
              <div className="v">
                6–10 guests
              </div>
              <div className="s">
                The entire estate hall, exclusively yours
              </div>
            </div>
            <div className="fact rv d2">
              <svg className="fact__ic" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4.5" y="7" width="23" height="20" rx="2.5" />
                <path d="M4.5 13h23M10.5 4v5M21.5 4v5" />
                <path d="M10 18h2M15 18h2M20 18h2M10 22h2M15 22h2" />
              </svg>
              <div className="k">
                Operating Days
              </div>
              <div className="v">
                Wed – Sun
              </div>
              <div className="s">
                Minimum 2 weeks advance reservation only
              </div>
            </div>
            <div className="fact rv d3">
              <svg className="fact__ic" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="16" cy="16" r="11.5" />
                <path d="M16 9.5V16l4.5 3" />
              </svg>
              <div className="k">
                Time
              </div>
              <div className="v">
                7:00 PM til late
              </div>
              <div className="s">
                One sitting per evening
              </div>
            </div>
          </div>
          <div className="booking__grid">
            <div>
              <ol className="ol">
                <li className="rv">
                  <div>
                    <strong>
                      Inquire
                    </strong>
                    <span>
                      Submit your preferred date and group size via our concierge page (minimum 2 weeks in advance).
                    </span>
                  </div>
                </li>
                <li className="rv d1">
                  <div>
                    <strong>
                      Consultation
                    </strong>
                    <span>
                      Complete our brief Culinary Discovery Questionnaire.
                    </span>
                  </div>
                </li>
                <li className="rv d2">
                  <div>
                    <strong>
                      Confirmation
                    </strong>
                    <span>
                      A full non-refundable payment secures your exclusive evening on the calendar.
                    </span>
                  </div>
                </li>
              </ol>
              <div className="booking__cta rv d3" id="book">
                <a className="btn" href="#book" data-book="">
                  {"Book Now "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="side">
              <h3 className="policy__title rv">
                Reservation Policy
              </h3>
              <div className="policy">
                <div className="row rv">
                  <strong>
                    At least 7 days notice
                  </strong>
                  <span>
                    If you need to postpone your dining experience, the payment will be credited toward a rescheduled date within 90 days.
                  </span>
                </div>
                <div className="row rv d1">
                  <strong>
                    Less than 7 days notice
                  </strong>
                  <span>
                    The payment will be forfeited due to the bespoke fresh ingredient sourcing.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="faq">
            <div className="rv">
              <p className="pre">
                FAQ
              </p>
              <h2>
                Frequently Asked Questions
              </h2>
            </div>
            <div>
              <details className="rv" open>
                <summary>
                  May we bring our personal wine collection?
                  <i></i>
                </summary>
                <p>
                  Absolutely. We offer complimentary corkage for the 1st bottle.
                </p>
              </details>
              <details className="rv d1">
                <summary>
                  Is private parking available?
                  <i></i>
                </summary>
                <p>
                  Yes, 2 private parking spaces are available within our estate grounds. More parking spaces are available further down the road.
                </p>
              </details>
              <details className="rv d2">
                <summary>
                  May we request rare or premium ingredients?
                  <i></i>
                </summary>
                <p>
                  Certainly. During your menu discovery consultation, we can incorporate specific luxury delicacies into your customized menu.
                </p>
              </details>
              <details className="rv d3">
                <summary>
                  Are pets welcome at The Dinerworkshop?
                  <i></i>
                </summary>
                <p>
                  Yes, absolutely! As proud pawparents to a rescued dog and cat, our home and estate grounds are warmly open to your well-behaved furry family members. Please let us know in advance so we can ensure a comfortable setup for them as well.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>
      {/* ─────────────── reserve ─────────────── */}
      <section className="contact pad" id="enquire" data-dark="">
        <div className="inner">
          <div className="contact__grid">
            <div>
              <h2 className="rv">
                {"Reserve your "}
                <em>
                  private sitting.
                </em>
              </h2>
              <p className="lead rv d1">
                Submit your preferred date and group size via WhatsApp, minimum 2 weeks in advance.
              </p>
              <div className="contact__cta rv d2">
                <a className="btn" href="#book" data-book="">
                  {"Reserve Your Private Sitting "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                {" "}
                <a className="btn btn--gold" href="https://wa.me/6580710506" target="_blank" rel="noopener">
                  WhatsApp +65 8071 0506
                </a>
              </div>
            </div>
            <dl className="contact__list rv d2">
              <div>
                <dt>
                  Location
                </dt>
                <dd>
                  17 Admiralty Road East S759975 (Near Sembawang Park)
                </dd>
              </div>
              <div>
                <dt>
                  Phone
                </dt>
                <dd>
                  <a href="tel:+6580710506">
                    +65 8071 0506
                  </a>
                </dd>
              </div>
              <div>
                <dt>
                  Email
                </dt>
                <dd>
                  <a href="mailto:thedinerworkshop@gmail.com">
                    thedinerworkshop@gmail.com
                  </a>
                </dd>
              </div>
              <div>
                <dt>
                  Pet Policy
                </dt>
                <dd>
                  Proudly Pet-Friendly (Pawparents to a rescued dog and cat)
                </dd>
              </div>
            </dl>
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
                <a href="/dining" aria-current="page">
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
          "/assets/pages/dining.js?v=1",
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
