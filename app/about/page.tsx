import { BootScript } from "@/components/BootScript";
import { TX_BOOT } from "@/lib/boot";
import { Scripts } from "@/components/Scripts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us · The Dinerworkshop",
  description: "Why The Dinerworkshop: cherished Hainanese family recipes studied, perfected and elevated by Chef Ian, in a historic family home in Sembawang.",
};

export default function AboutPage() {
  return (
    <>
      <link rel="stylesheet" href={"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap"} precedence="dw" />
      <link rel="stylesheet" href="/assets/pages/about.css?v=3" precedence="dw" />
      <link rel="stylesheet" href="/assets/book.css?v=2" precedence="dw" />
      <link rel="stylesheet" href="/assets/foot.css?v=2" precedence="dw" />
      <link rel="stylesheet" href={"https://fonts.googleapis.com/css2?family=Inter+Tight:wght@200;300;400&family=Inter:wght@300;400;500&display=swap"} precedence="dw" />
      <link rel="stylesheet" href="/assets/type.css?v=17" precedence="dw" />
      <link rel="stylesheet" href="/assets/motion.css?v=5" precedence="dw" />
      <BootScript code={TX_BOOT} />
      {/* ─────────────── nav ─────────────── */}
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
          <a href="/about" className="is-current" aria-current="page">
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
      {/* ─────────────── about your host & chef: the estate draws itself in ─────────────── */}
      <section className="estate a-open" id="top">
        <img className="estate__still" src="/assets/estate-zoom-end.jpg" alt="Sketch of The Dinerworkshop’s 1923 Black and White colonial estate" />
        <div className="estate__wash" aria-hidden="true"></div>
        <div className="inner estate__inner">
          <div className="story__text">
            <h1 className="rv">
              {"About Your Host & Chef, Ian"}
            </h1>
            <p className="a-open__tag rv d1">
              Generational Hainanese Heritage. Culinary Precision.
            </p>
          </div>
        </div>
      </section>
      {/* ─────────────── your host: Ian beside his own story ─────────────── */}
      <section className="a-why a-host pad" id="host">
        <div className="inner a-why__grid">
          <figure className="a-why__photo rv">
            <img src="/assets/about/ian.jpg" alt="Chef Ian in his whites and a black apron, arms folded, smiling" loading="lazy" />
            <figcaption>
              Chef Ian
            </figcaption>
          </figure>
          <div className="a-why__text">
            <h2 className="rv">
              Chef Ian
            </h2>
            <p className="a-host__lead rv d1">
              Chef Ian’s passion for gastronomy was forged across two distinct worlds: the bustling Hainanese home kitchens of his childhood and the disciplined world of molecular biology.
            </p>
          </div>
        </div>
      </section>
      {/* ─────────────── why the dinerworkshop: straight after Chef Ian ─────────────── */}
      <section className="a-why a-why--solo pad" id="why">
        {/* desktop: two of Ian's dishes drift in from the edges as the section scrolls in */}
        <img className="why-dish why-dish--l" src="/assets/dishes/side-fish.webp" alt="" aria-hidden="true" loading="lazy" />
        {" "}
        <img className="why-dish why-dish--r" src="/assets/dishes/side-beef.webp" alt="" aria-hidden="true" loading="lazy" />
        <div className="inner">
          <h2 className="rv">
            Why The Dinerworkshop?
          </h2>
          <p id="whyWords">
            <strong>
              The Dinerworkshop
            </strong>
            {" is private dining in Chef Ian’s historic family home in Sembawang. He cooks his family’s Hainanese recipes, passed down through generations, then studied, perfected and elevated. One sitting an evening, so the only table is yours."}
          </p>
        </div>
      </section>
      {/* ─────────────── culinary philosophy ─────────────── */}
      <section className="philo a-philo pad">
        <div className="inner">
          <p className="pre rv">
            Culinary Philosophy
          </p>
          <h2 className="rv d1">
            Always finding new ingredients.
            <br />
            Always innovating.
          </h2>
          <div className="philo__grid">
            <div className="philo__item rv">
              <div className="num">
                I
              </div>
              <h3>
                Ingredients in Their Purest State
              </h3>
              <p>
                We source only peak-season, prime-grade ingredients, allowing natural flavour profiles to shine.
              </p>
            </div>
            <div className="philo__item rv d1">
              <div className="num">
                II
              </div>
              <h3>
                Science Meets Tradition
              </h3>
              <p>
                Slow-fire heritage techniques enhanced by modern thermal precision and textural experimentation.
              </p>
            </div>
            <div className="philo__item rv d2">
              <div className="num">
                III
              </div>
              <h3>
                {"Curiosity & Nostalgia"}
              </h3>
              <p>
                Every dish tells a story, whether inspired by nostalgic Hainanese roots or refined through global travels.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ─────────────── history: ian's culinary lineage ─────────────── */}
      <section className="tl pad" id="history">
        <div className="inner">
          <div className="tl__head">
            <p className="pre rv">
              How It Began
            </p>
            <h2 className="rv d1">
              Ian’s Culinary Lineage
            </h2>
          </div>
          <div className="tl__body" id="tlBody">
            <span className="tl__line" aria-hidden="true"></span>
            {" "}
            <span className="tl__cut" id="tlCut" aria-hidden="true"></span>
            <div className="tl__knife" id="tlKnife" aria-hidden="true">
              <img src="/assets/knife.webp" alt="" width="130" height="1160" />
            </div>
            <article className="ch ch--l">
              <span className="ch__dot" aria-hidden="true"></span>
              <div className="ch__img">
                <img src="/assets/history/family.jpg" alt="Ian’s family in an old black and white portrait" loading="lazy" />
              </div>
              <div className="ch__text">
                <h3>
                  A Hainanese Family
                </h3>
                <p>
                  Raised in a Hainanese family where culinary mastery was a celebrated tradition, Ian learned early that food is the ultimate expression of care and love.
                </p>
              </div>
            </article>
            <article className="ch ch--r">
              <span className="ch__dot" aria-hidden="true"></span>
              <div className="ch__img">
                <img src="/assets/history/popo-claypot.jpg" alt="Claypot rice with sausage and chicken" loading="lazy" />
              </div>
              <div className="ch__text">
                <h3>
                  Po Po’s Legendary Claypot Rice
                </h3>
                <p>
                  {"The undisputed matriarch of the family, his maternal grandmother (“Po Po”), passed down her legendary claypot rice and slow-braised meats through the traditional Hainanese method of "}
                  <em>
                    watch, taste, and learn
                  </em>
                  .
                </p>
              </div>
            </article>
            <article className="ch ch--l">
              <span className="ch__dot" aria-hidden="true"></span>
              <div className="ch__img">
                <img src="/assets/history/molecular-biology.jpg?v=2" alt="Chef Ian in a maroon apron plating a dish with a spoon at the kitchen counter" loading="lazy" />
              </div>
              <div className="ch__text">
                <h3>
                  The Disciplined World of Molecular Biology
                </h3>
                <p>
                  Combining a deep reverence for traditional flavour extraction with scientific precision over temperature, texture, and timing, Ian crafts bespoke menus that honour heritage while surprising the modern palate.
                </p>
              </div>
            </article>
            <article className="ch ch--r">
              <span className="ch__dot" aria-hidden="true"></span>
              <div className="ch__img">
                <img src="/assets/history/green-beans.jpg" alt="Charred green beans on a nut sauce, finished with yellow flowers" loading="lazy" />
              </div>
              <div className="ch__text">
                <h3>
                  A New Realm of Plant-Forward Gastronomy
                </h3>
                <p>
                  Meeting his wife, a vegetarian, unlocked a new realm of plant-forward gastronomy, deepening Ian’s appreciation for the purity of botanicals.
                </p>
              </div>
            </article>
            <article className="ch ch--l">
              <span className="ch__dot" aria-hidden="true"></span>
              <div className="ch__img">
                <img src="/assets/experience/house-dusk.jpg" alt="The Dinerworkshop’s Black and White colonial house at dusk, its windows lit" loading="lazy" />
              </div>
              <div className="ch__text">
                <h3>
                  The Dinerworkshop
                </h3>
                <p>
                  In late 2026, after much encouragement from dining friends, The Dinerworkshop was finally created to share this intimate private dining journey with more diners.
                </p>
              </div>
            </article>
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
                <a className="btn" href="/#enquire" data-book="">
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
                  Follow
                </dt>
                <dd>
                  <a href="https://instagram.com/TheDinerworkshop" target="_blank" rel="noopener">
                    @TheDinerworkshop
                  </a>
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
                <a href="/about" aria-current="page">
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
          "/assets/pages/about.js?v=1",
          "/assets/db.js?v=4",
          "/assets/book.js?v=8",
          "/assets/wa.js?v=2",
          "/assets/btn.js",
          "/assets/motion.js?v=5",
          "/assets/pages/about-3.js?v=1",
        ]}
      />
    </>
  );
}
