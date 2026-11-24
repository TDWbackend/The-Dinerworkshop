import { BootScript } from "@/components/BootScript";
import { TX_BOOT } from "@/lib/boot";
import { Scripts } from "@/components/Scripts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Sensory Kitchen · Cooking Class · The Dinerworkshop",
  description: "“Our Sensory Kitchen” is a hands-on culinary workshop designed to teach children meal preparation as a vital, empowering life skill.",
};

export default function ClassesPage() {
  return (
    <>
      <link rel="stylesheet" href={"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap"} precedence="dw" />
      <link rel="stylesheet" href="/assets/pages/classes.css?v=1" precedence="dw" />
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
          <a href="/classes" className="is-current" aria-current="page">
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
      <section className="k-hero" id="top" data-dark="">
        <img className="k-hero__img" src="/assets/classes/hero.jpg?v=3" alt="Children in chef hats and aprons measuring and mixing at the long table during a cooking class" />
        <div className="inner k-hero__inner">
          <h1 className="rv">
            Our Sensory Kitchen
          </h1>
          <p className="sub rv d1">
            Empowering Children with Essential Culinary Life Skills
          </p>
          <p className="body rv d2">
            “Our Sensory Kitchen” is a hands-on culinary workshop designed to teach children meal preparation as a vital, empowering life skill. By exploring raw ingredients, kitchen tools, and flavour building, young chefs develop fine motor control, confidence, and independence in the kitchen.
          </p>
          <div className="k-hero__cta rv d3">
            <a className="btn" href="#enquire">
              {"Enquire about Our Sensory Kitchen "}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      {/* ─────────────── core philosophy ─────────────── */}
      <section className="k-core pad">
        <div className="inner k-core__grid">
          <div className="k-core__img rv">
            <img src="/assets/classes/philosophy.jpg?v=4" alt="A girl in a chef hat and gloves mixing ingredients between two bowls" loading="lazy" />
          </div>
          <div>
            <p className="pre rv">
              Core Philosophy
            </p>
            <h2 className="rv d1">
              Cooking is a Life Skill
            </h2>
            <p className="body rv d2">
              The kitchen serves as a living laboratory where curiosity turns into lifelong self-reliance. Through step-by-step scaffolding, children master kitchen mechanics, food safety, and project management, progressing naturally from basic prep work to creating complete, delicious meals.
            </p>
          </div>
        </div>
      </section>
      {/* ─────────────── program framework: stair cards ─────────────── */}
      <section className="stairs" id="program">
        <div className="stairs__track" id="stairTrack">
          <div className="stairs__pin">
            <div className="inner">
              <div className="stairs__head">
                <p className="pre">
                  Program Framework
                </p>
                <h2>
                  Young Culinary Artisans
                </h2>
              </div>
              <div className="stairs__row">
                <article className="step">
                  <img src="/assets/classes/level-1.jpg?v=4" alt="Two girls wiping fresh banana leaves clean at the long wooden table" loading="lazy" />
                  <div className="step__body">
                    <p className="step__lvl">
                      Level 1
                    </p>
                    <h3>
                      The Prep Apprentice
                    </h3>
                    <p className="step__focus">
                      Foundations
                    </p>
                    <p>
                      Focuses on kitchen fundamentals: hand hygiene, washing produce, measuring ingredients, stripping herbs, and kneading dough to understand food consistency.
                    </p>
                  </div>
                </article>
                <article className="step">
                  <img src="/assets/classes/level-2.jpg?v=4" alt="A boy cutting strawberries with a child-safe knife on a chopping board" loading="lazy" />
                  <div className="step__body">
                    <p className="step__lvl">
                      Level 2
                    </p>
                    <h3>
                      The Junior Tool Specialist
                    </h3>
                    <p className="step__focus">
                      {"Precision & Safety"}
                    </p>
                    <p>
                      Introduces safe cutting techniques using child-friendly cutlery, peeling, and the bridge-and-claw grip to build knife control, uniform prep, and safety awareness.
                    </p>
                  </div>
                </article>
                <article className="step">
                  <img src="/assets/classes/level-3.jpg?v=3" alt="A smiling girl in a chef hat holding up the dish she made" loading="lazy" />
                  <div className="step__body">
                    <p className="step__lvl">
                      Level 3
                    </p>
                    <h3>
                      The Recipe Master
                    </h3>
                    <p className="step__focus">
                      {"Sequencing & Timing"}
                    </p>
                    <p>
                      Young chefs take full ownership of a 3-to-5 step recipe, managing timing, executing prep, balancing flavours, and proudly plating their creations.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─────────────── key life skills ─────────────── */}
      <section className="k-skills pad">
        <div className="inner">
          <h2 className="rv">
            Key Life Skills Developed
          </h2>
          <div className="k-skills__grid">
            <article className="skill rv">
              <div className="skill__n">
                I
              </div>
              <h3>
                {"Motor Control & Safety"}
              </h3>
              <p>
                Mastering hand-eye coordination, safe tool handling, and precise measurement.
              </p>
            </article>
            <article className="skill rv d1">
              <div className="skill__n">
                II
              </div>
              <h3>
                {"Planning & Sequencing"}
              </h3>
              <p>
                Following multi-step instructions, managing time, and organising workspace.
              </p>
            </article>
            <article className="skill rv d2">
              <div className="skill__n">
                III
              </div>
              <h3>
                {"Food Confidence & Independence"}
              </h3>
              <p>
                Fostering pride in self-sufficiency and a healthy, intuitive relationship with real food.
              </p>
            </article>
          </div>
        </div>
      </section>
      {/* ─────────────── enquire ─────────────── */}
      <section className="contact pad" id="enquire" data-dark="">
        <div className="inner">
          <div className="contact__grid">
            <div>
              <h2 className="rv">
                {"Enquire about "}
                <em>
                  Our Sensory Kitchen.
                </em>
              </h2>
              <div className="contact__cta rv d1">
                <a className="btn" href="https://wa.me/6580710506?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20Our%20Sensory%20Kitchen." target="_blank" rel="noopener">
                  {"WhatsApp +65 8071 0506 "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                {" "}
                <a className="btn btn--gold" href="mailto:thedinerworkshop@gmail.com?subject=Our%20Sensory%20Kitchen">
                  Email the concierge
                </a>
              </div>
            </div>
            <dl className="contact__list rv d2">
              <div>
                <dt>
                  Location
                </dt>
                <dd>
                  Sembawang Colonial Enclave, Singapore (Near Sembawang Park)
                </dd>
              </div>
              <div>
                <dt>
                  Reservations
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
                <a href="/classes" aria-current="page">
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
          "/assets/pages/classes.js?v=1",
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
