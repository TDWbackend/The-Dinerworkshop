import { BootScript } from "@/components/BootScript";
import { PRELOAD_BOOT, TX_BOOT } from "@/lib/boot";
import { Scripts } from "@/components/Scripts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Dinerworkshop · Heritage Private Dining, Sembawang",
  description: "Generational Hainanese heritage, culinary precision and an exclusive 1924 colonial sanctuary. Single-sitting private omakase dining in Sembawang, Singapore.",
};

export default function HomePage() {
  return (
    <>
      <link rel="stylesheet" href={"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap"} precedence="dw" />
      <link rel="stylesheet" href="/assets/pages/home.css?v=1" precedence="dw" />
      <link rel="stylesheet" href="/assets/book.css?v=2" precedence="dw" />
      <link rel="stylesheet" href="/assets/foot.css?v=2" precedence="dw" />
      <link rel="stylesheet" href="/assets/reviews.css" precedence="dw" />
      <link rel="stylesheet" href="/assets/pages/home-2.css?v=1" precedence="dw" />
      <link rel="stylesheet" href={"https://fonts.googleapis.com/css2?family=Inter+Tight:wght@200;300;400&family=Inter:wght@300;400;500&display=swap"} precedence="dw" />
      <link rel="stylesheet" href="/assets/type.css?v=17" precedence="dw" />
      <link rel="stylesheet" href="/assets/motion.css?v=4" precedence="dw" />
      <BootScript code={PRELOAD_BOOT} />
      <BootScript code={TX_BOOT} />
      {/* preloader: the logo fades in, then the screen fades away to the page */}
      <div className="loader" id="pre" aria-hidden="true">
        <img className="loader__logo" src="/assets/logo-ink.png" alt="" />
      </div>
      {/* ─────────────── nav ─────────────── */}
      <header className="nav" id="nav">
        <a className="nav__logo" href="/" aria-label="The Dinerworkshop, home">
          <img className="on-light" src="/assets/wordmark-ink.png" alt="The Dinerworkshop" />
          <img className="on-darkbg" src="/assets/wordmark-cream.png" alt="" />
        </a>
        <nav className="nav__links">
          <a href="/" className="is-current" aria-current="page">
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
      {/* ─────────────── hero ─────────────── */}
      <section className="hero-scrub" id="top">
        <div className="hero-scrub__track" id="heroTrack">
          <div className="hero is-sketch" id="heroStage">
            <video className="hero__video" id="heroVideo" data-src="/assets/hero-scrub-1080.mp4" data-src-small="/assets/hero-scrub-720.mp4" poster="/assets/hero-scrub-start.jpg" data-end="/assets/hero-scrub-end.jpg" muted playsInline preload="none" aria-label="A sepia drawing of glazed pork belly turns on its plate and comes to life as the real dish"></video>
            <div className="hero__copy">
              <div className="hero__says rv d1">
                <div className="hero__say hero__say--sketch">
                  <h1>
                    <span>
                      Where Heritage Meets
                    </span>
                    {" "}
                    <span>
                      Culinary Curiosity.
                    </span>
                  </h1>
                </div>
                <div className="hero__say hero__say--real" aria-hidden="true">
                  <p className="hero__h">
                    <span>
                      The Bespoke
                    </span>
                    {" "}
                    <span>
                      Dining Experience
                    </span>
                  </p>
                  <p className="hero__sub hero__sub--long">
                    {"Set within a historic 1923 Black & White colonial estate in Sembawang, The Dinerworkshop offers an exclusive, single-sitting private dining retreat for discerning guests who appreciate authentic culinary heritage, absolute privacy, and uncompromised ingredient quality."}
                  </p>
                </div>
              </div>
              <div className="hero__cta rv d4">
                <a className="btn" href="#book" data-book="">
                  {"Reserve Your Private Sitting "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                {" "}
                <a className="btn btn--ghost" href="#food">
                  Explore the Omakase Journey
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─────────────── the food: signature dishes, one at a time in the centre ─────────────── */}
      <section className="sig" id="food">
        <div className="sig__track" id="sigTrack">
          <div className="sig__pin">
            <p className="sig__label">
              Signature Dishes
            </p>
            <article className="dish">
              <div className="dish__name rv">
                <h2>
                  Charcoal Grilled Specialties
                </h2>
                <p className="dish__sub">
                  {"Meats & Botanicals"}
                </p>
              </div>
              <div className="dish__plate rv">
                <img src="/assets/dishes/charcoal-grilled.webp?v=4" alt="Sliced charcoal-grilled steak with flame-seared vegetables on a black plate" />
              </div>
              <div className="dish__text rv">
                <p>
                  Kissed by white-hot binchotan, our prime cuts are flame-grilled to lock in smoky depth, succulent textures, and natural sweetness.
                </p>
              </div>
            </article>
            <article className="dish">
              <div className="dish__name rv">
                <h2>
                  Hainanese Heritage Pork Chop
                </h2>
              </div>
              <div className="dish__plate rv">
                <img src="/assets/dishes/pork-chop.webp?v=4" alt="Sliced roast pork with tomato pepper sauce on a black plate" loading="lazy" />
              </div>
              <div className="dish__text rv">
                <p>
                  {"Tender, thick-cut pork finished with slow-reduced roasted tomato & pepper jam."}
                </p>
              </div>
            </article>
            <article className="dish">
              <div className="dish__name rv">
                <h2>
                  Botanical Plant Creations
                </h2>
              </div>
              <div className="dish__plate rv">
                <img src="/assets/dishes/botanical-umami.webp?v=4" alt="Charred okra in a ring of chilli sauce on a black plate" loading="lazy" />
              </div>
              <div className="dish__text rv">
                <p>
                  Intricate vegetarian courses crafted to match the depth and complexity of prime meats.
                </p>
              </div>
            </article>
            <article className="dish">
              <div className="dish__name rv">
                <h2>
                  Signature Claypot Rice
                </h2>
              </div>
              <div className="dish__plate rv">
                <img id="sigPot" src="/assets/dishes/claypot.webp" alt="Overhead view of the signature chicken claypot rice" loading="lazy" />
              </div>
              <div className="dish__text rv">
                <p>
                  Our crown jewel: an homage to grandma, Po Po’s recipe, elevated with a subtle Japanese nuance.
                </p>
                <a className="btn" href="/claypot" data-fly="#sigPot">
                  {"Discover Our Claypot Rice "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
      {/* ─────────────── the journey: the estate draws itself in, link to about us ─────────────── */}
      <section className="estate" id="journey">
        <video id="estateReveal" src="/assets/estate-reveal-1440.mp4" data-src-4k="/assets/estate-reveal-4k.mp4" poster="/assets/estate-reveal-end.jpg" muted playsInline preload="none" aria-label="Sketch of The Dinerworkshop’s colonial estate drawing itself in"></video>
        <video className="estate__zoom" id="estateZoom" src="/assets/estate-zoom-1080.mp4" muted playsInline preload="none" aria-hidden="true"></video>
        <div className="estate__wash" aria-hidden="true"></div>
        <div className="inner estate__inner">
          <div className="story__text estate__copy" id="estateCopy">
            <h2>
              Old-world Singapore charm.
            </h2>
            <p className="estate__body">
              {"Tucked away in the serene greenery of Sembawang, our 1923 Black & White estate offers an atmosphere of old-world Singapore charm."}
            </p>
            <div className="estate__cta">
              <a className="btn" href="/about" id="aboutZoom">
                {"About Us "}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* ─────────────── the bespoke dining experience: four cards wiped in left to right ─────────────── */}
      <section className="exp" id="experience">
        <div className="exp__track" id="expTrack">
          <div className="exp__pin">
            <div className="inner">
              <div className="exp__head">
                <div>
                  <h2>
                    From arrival to the last course.
                  </h2>
                </div>
                <a className="btn" href="/dining">
                  {"Discover the Dining "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
              <div className="exp__row">
                <article className="ecard">
                  <img src="/assets/experience/house-dusk-wide.jpg" alt="The Black and White colonial house at dusk, its windows lit" loading="lazy" style={{ objectPosition: "37% 50%" }} />
                  <div className="ecard__body">
                    <h3>
                      The Arrival
                    </h3>
                    <p>
                      Step off the beaten path into our 1924 colonial sanctuary.
                    </p>
                  </div>
                </article>
                <article className="ecard">
                  <img src="/assets/experience/living-hall.jpg?v=3" alt="The living hall in warm evening light, with a yellow sofa, carved wooden chairs and Persian rugs" loading="lazy" />
                  <div className="ecard__body">
                    <h3>
                      Pre-Dinner Drinks
                    </h3>
                    <p>
                      Unwind in our living hall with handcrafted welcome drinks.
                    </p>
                  </div>
                </article>
                <article className="ecard">
                  <img src="/assets/experience/table-setting.jpg" alt="A place setting on the wooden dining table, with a red napkin folded into a rose" loading="lazy" />
                  <div className="ecard__body">
                    <h3>
                      The Omakase Table
                    </h3>
                    <p>
                      Transition to your private dining room for a multi-course experience.
                    </p>
                  </div>
                </article>
                <article className="ecard">
                  <img src="/assets/experience/evening.jpg" alt="Guests sharing a candlelit dinner" loading="lazy" />
                  <div className="ecard__body">
                    <h3>
                      Unhurried Elegance
                    </h3>
                    <p>
                      With only a single sitting hosted per evening, the night proceeds at your leisure.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─────────────── Google reviews: the real ones, words left, two drifting columns right ─────────────── */}
      <section className="greviews" id="reviews">
        <div className="inner greviews__grid">
          <div className="greviews__words">
            <h2 className="rv">
              Thank you for sharing your love for food.
            </h2>
            <div className="greviews__rule rv d1"></div>
            <div className="grating rv d2">
              <div className="grating__score">
                <b>
                  4.8
                </b>
                <span className="gstars" aria-label="4.8 out of 5 stars" id="gRatingStars"></span>
              </div>
              <div className="grating__src">
                <svg className="glogo" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
                </svg>
                <span>
                  Rated on Google
                </span>
              </div>
            </div>
            <a className="greviews__link rv d3" href="https://maps.google.com/?cid=13214365977571479634" target="_blank" rel="noopener">
              Read all on Google
            </a>
          </div>
          <div className="gcols" id="gcols" aria-label="Google reviews">
            <div className="gcol" style={{ "--dur": "46s" } as React.CSSProperties}>
              <div className="gcol__inner"></div>
            </div>
            <div className="gcol gcol--down" style={{ "--dur": "38s" } as React.CSSProperties}>
              <div className="gcol__inner"></div>
            </div>
          </div>
        </div>
      </section>
      {/* ─────────────── closing: reserve ─────────────── */}
      <section className="tour" id="reserve">
        <div className="tour__track" id="tourTrack">
          <div className="tour__stage" id="tourStage" data-dark="">
            <video className="tour__video" id="tourVideo" data-src="/assets/tour-scrub-1080.mp4" data-src-small="/assets/tour-scrub-720.mp4" poster="/assets/contact-dining-start.jpg?v=3" data-end="/assets/contact-dining-end.jpg?v=3" muted playsInline preload="none" aria-label="A walk from the living room through the wide opening to the dining table"></video>
            <div className="tour__shade" aria-hidden="true"></div>
            <div className="inner tour__words">
              <h2>
                {"Reserve your "}
                <em>
                  private sitting.
                </em>
              </h2>
              <p className="lead">
                Submit your preferred date and group size via WhatsApp, minimum 2 weeks in advance.
              </p>
              <div className="cta__btns">
                <a className="btn" href="/contact#book" data-book="">
                  {"Book Now "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
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
                <a href="/" aria-current="page">
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
          "/assets/pages/home.js?v=1",
          "/assets/db.js?v=4",
          "/assets/book.js?v=8",
          "/assets/wa.js?v=2",
          "/assets/fly.js",
          "/assets/reviews.js",
          "/assets/btn.js",
          "/assets/motion.js?v=5",
        ]}
      />
    </>
  );
}
