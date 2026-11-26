import { BootScript } from "@/components/BootScript";
import { POT_BOOT, TX_BOOT } from "@/lib/boot";
import { Scripts } from "@/components/Scripts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signature Claypot Rice · The Dinerworkshop",
  description: "Our crown jewel: Signature Claypot Rice, an homage to grandma, Po Po’s recipe, elevated with a subtle Japanese nuance. Available for private takeaway.",
};

export default function ClaypotPage() {
  return (
    <>
      <link rel="stylesheet" href={"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap"} precedence="dw" />
      <link rel="stylesheet" href="/assets/pages/claypot.css?v=2" precedence="dw" />
      <link rel="stylesheet" href="/assets/foot.css?v=4" precedence="dw" />
      <link rel="stylesheet" href="/assets/reviews.css" precedence="dw" />
      <link rel="stylesheet" href="/assets/pages/claypot-2.css?v=1" precedence="dw" />
      <link rel="stylesheet" href="/assets/book.css?v=2" precedence="dw" />
      <link rel="stylesheet" href={"https://fonts.googleapis.com/css2?family=Inter+Tight:wght@200;300;400&family=Inter:wght@300;400;500&display=swap"} precedence="dw" />
      <link rel="stylesheet" href="/assets/type.css?v=17" precedence="dw" />
      <link rel="stylesheet" href="/assets/motion.css?v=5" precedence="dw" />
      <BootScript code={POT_BOOT} />
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
          <a href="/about">
            About Us
          </a>
          {" "}
          <a href="/dining">
            Dining
          </a>
          {" "}
          <a href="/claypot" className="is-current" aria-current="page">
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
      {/* ─────────────── opening ─────────────── */}
      <section className="cp-hero" id="top">
        <div className="cp-hero__pot" aria-hidden="true">
          <img src="/assets/dishes/claypot.webp" alt="" />
        </div>
        <div className="inner cp-hero__inner">
          <h1 className="rv">
            {"Signature "}
            <em>
              Claypot Rice
            </em>
          </h1>
          <p className="crown rv d1">
            Our crown jewel: an homage to grandma, Po Po’s recipe, elevated with a subtle Japanese nuance.
          </p>
          <div className="cp-hero__cta rv d2">
            <a className="btn" href="#order">
              {"Order Takeaway "}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            {" "}
            <a className="btn btn--ghost" href="#ingredients">
              The Ingredients
            </a>
          </div>
        </div>
      </section>
      {/* ─────────────── the ingredients ─────────────── */}
      <section className="cp-ing pad" id="ingredients">
        <div className="inner">
          <div className="cp-ing__head">
            <p className="pre rv">
              The Ingredients
            </p>
            <p className="cp-ing__lead rv d1">
              Premium Thai Hom Mali rice is slow-simmered in Banko-yaki earthenware alongside tender boneless chicken thighs, braised shiitake mushrooms, Japanese ebi, rich liver sausage, and XO pork sausages.
            </p>
          </div>
          <div className="cp-ing__track" id="ingTrack">
            <div className="cp-ing__pin">
              <div className="cp-ing__stage">
                <div className="cp-ing__col cp-ing__col--l">
                  <div className="ing rv">
                    <img className="ing__pic" src="/assets/claypot/rice.webp" alt="" width="480" height="480" loading="lazy" />
                    <div className="ing__txt">
                      <h3>
                        Premium Thai Hom Mali Rice
                      </h3>
                    </div>
                  </div>
                  <div className="ing rv d1">
                    <img className="ing__pic" src="/assets/claypot/chicken.webp" alt="" width="480" height="480" loading="lazy" />
                    <div className="ing__txt">
                      <h3>
                        Fresh Sakura Chicken
                      </h3>
                      <p>
                        Tender boneless chicken thighs
                      </p>
                    </div>
                  </div>
                  <div className="ing rv d2">
                    <img className="ing__pic" src="/assets/claypot/shiitake.webp" alt="" width="480" height="480" loading="lazy" />
                    <div className="ing__txt">
                      <h3>
                        Braised Shiitake Mushrooms
                      </h3>
                    </div>
                  </div>
                </div>
                <figure className="cp-ing__pot rv">
                  <img id="ingPot" src="/assets/dishes/claypot.webp" alt="Overhead view of the signature chicken claypot rice" loading="lazy" />
                  <figcaption>
                    Slow-simmered in Banko-yaki earthenware
                  </figcaption>
                </figure>
                <div className="cp-ing__col cp-ing__col--r">
                  <div className="ing rv">
                    <img className="ing__pic" src="/assets/claypot/ebi.webp" alt="" width="480" height="480" loading="lazy" />
                    <div className="ing__txt">
                      <h3>
                        Japanese Ebi
                      </h3>
                    </div>
                  </div>
                  <div className="ing rv d1">
                    <img className="ing__pic" src="/assets/claypot/liver-sausage.webp" alt="" width="480" height="480" loading="lazy" />
                    <div className="ing__txt">
                      <h3>
                        Rich Liver Sausage
                      </h3>
                    </div>
                  </div>
                  <div className="ing rv d2">
                    <img className="ing__pic" src="/assets/claypot/xo-sausage.webp" alt="" width="480" height="480" loading="lazy" />
                    <div className="ing__txt">
                      <h3>
                        XO Pork Sausages
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─────────────── why it is special ─────────────── */}
      <section className="cp-why pad">
        <div className="inner">
          <h2 className="rv">
            {"Our "}
            <em>
              crown jewel.
            </em>
          </h2>
          <div className="cp-why__grid">
            <article className="why rv">
              <div className="why__n">
                I
              </div>
              <h3>
                Po Po’s Foundational Recipe
              </h3>
              <p>
                {"The undisputed matriarch of the family, his maternal grandmother (“Po Po”), passed down her legendary claypot rice and slow-braised meats through the traditional Hainanese method of "}
                <em>
                  watch, taste, and learn
                </em>
                .
              </p>
            </article>
            <article className="why rv d1">
              <div className="why__n">
                II
              </div>
              <h3>
                A Subtle Japanese Nuance
              </h3>
              <p>
                Premium Thai Hom Mali rice is slow-simmered in Banko-yaki earthenware alongside Japanese ebi.
              </p>
            </article>
            <article className="why rv d2">
              <div className="why__n">
                III
              </div>
              <h3>
                A Golden, Delicate Bottom Crust
              </h3>
              <p>
                The result is an exquisite harmony of smoky aromatics, rich umami, and a golden, delicate bottom crust.
              </p>
            </article>
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
      {/* ─────────────── takeaway order ─────────────── */}
      <section className="cp-order pad" id="order" data-dark="">
        <div className="inner cp-order__grid">
          <div className="cp-order__intro">
            <p className="pre rv">
              Claypot Rice Takeaway · The Party@Home Series
            </p>
            <h2 className="rv d1">
              Bring the culinary warmth of The Dinerworkshop into your home.
            </h2>
            <p className="rv d2">
              Our signature Chicken Claypot Rice is available for private takeaway in two sizes.
            </p>
            <p className="rv d2">
              You need to place an order one week in advance. Pick up is every Monday.
            </p>
            <img className="rv d3" src="/assets/dishes/claypot.webp" alt="" loading="lazy" />
          </div>
          <form className="order rv d1" id="orderForm" noValidate>
            <span className="order__label">
              Choose your edition
            </span>
            <div className="order__eds">
              <input type="radio" name="edition" id="edTasting" defaultValue="The 'Tasting' Edition" data-key="tasting" data-price="80" defaultChecked />
              {" "}
              <label htmlFor="edTasting">
                <b>
                  The ‘Tasting’ Edition
                </b>
                <small>
                  Serves 2–4 guests
                </small>
                <span className="price">
                  $80
                </span>
              </label>
              {" "}
              <input type="radio" name="edition" id="edGrand" defaultValue="The 'Grand' Edition" data-key="grand" data-price="150" />
              {" "}
              <label htmlFor="edGrand">
                <b>
                  The ‘Grand’ Edition
                </b>
                <small>
                  Serves 6–8 guests
                </small>
                <span className="price">
                  $150
                </span>
              </label>
            </div>
            <div className="order__row">
              <span className="order__label">
                Number of pots
              </span>
              <div className="order__count" role="group" aria-label="Number of pots">
                <button type="button" id="qMinus" aria-label="One fewer pot">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                    <path d="M3 8h10" />
                  </svg>
                </button>
                {" "}
                <output id="qty" aria-live="polite">
                  1
                </output>
                {" "}
                <button type="button" id="qPlus" aria-label="One more pot">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                    <path d="M3 8h10M8 3v10" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="order__keep">
              <input type="checkbox" id="keepPot" name="keep" />
              {" "}
              <label htmlFor="keepPot">
                <span className="box">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M2.5 6.2l2.3 2.3 4.7-5" />
                  </svg>
                </span>
                <span>
                  {"Inquire about our exclusive Limited-Edition "}
                  <strong>
                    “Rent or Keep The Pot”
                  </strong>
                  {" release, prepared and delivered in an authentic Japanese Ginpo Donabe. You just need to warm it up straight on the stove."}
                </span>
              </label>
            </div>
            <label className="order__field" id="fDate">
              <span className="order__label">
                Pick-up Monday
              </span>
              {" "}
              <input type="date" name="date" id="oDate" required />
              {" "}
              <em className="err">
                Please choose a Monday at least one week from today.
              </em>
            </label>
            <div className="order__two">
              <label className="order__field" id="fName">
                <span className="order__label">
                  Your name
                </span>
                {" "}
                <input type="text" name="name" autoComplete="name" required />
                {" "}
                <em className="err">
                  Please tell us your name.
                </em>
              </label>
              {" "}
              <label className="order__field" id="fPhone">
                <span className="order__label">
                  WhatsApp number
                </span>
                {" "}
                <input type="tel" name="phone" autoComplete="tel" inputMode="tel" required />
                {" "}
                <em className="err">
                  Please add a number we can reach you on.
                </em>
              </label>
            </div>
            {/* shown only when orders are paid online: the invoice and receipt go to this address */}
            <label className="order__field" id="fEmail" hidden>
              <span className="order__label">
                Email address
              </span>
              {" "}
              <input type="email" name="email" autoComplete="email" />
              {" "}
              <em className="err">
                Please add an email address for your receipt.
              </em>
            </label>
            <div className="order__total">
              <span>
                Total
              </span>
              <strong id="oTotal">
                $80
              </strong>
            </div>
            <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: "0" }} />
            {" "}
            <button className="btn" type="submit" id="oBtn">
              {"Order on WhatsApp "}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <p className="order__fine" id="oFine">
              Ian will confirm your order personally on WhatsApp.
            </p>
            <p className="order__sent" id="oSent" role="status">
              <span id="oSentText">
                Your order is ready in WhatsApp. Press send there to reach Ian. WhatsApp didn’t open?
              </span>
              {" "}
              <a id="oAgain" href="#" target="_blank" rel="noopener">
                Try again
              </a>
              <span id="oSentDot">
                .
              </span>
            </p>
          </form>
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
                <a href="/claypot" aria-current="page">
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
                <span>
                  thedinerworkshop@gmail.com
                </span>
                {" "}
                <a className="foot__ig" href="https://instagram.com/TheDinerworkshop" target="_blank" rel="noopener" aria-label="Instagram, @thedinerworkshop">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  @thedinerworkshop
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
          <a href="/terms">
            Terms &amp; Conditions
          </a>
        </div>
      </footer>
      <Scripts
        srcs={[
          "/assets/pages/claypot.js?v=2",
          "/assets/db.js?v=4",
          "/assets/book.js?v=9",
          "/assets/wa.js?v=2",
          "/assets/reviews.js",
          "/assets/btn.js",
          "/assets/motion.js?v=5",
        ]}
      />
    </>
  );
}
