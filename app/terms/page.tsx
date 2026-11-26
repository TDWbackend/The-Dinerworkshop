import { BootScript } from "@/components/BootScript";
import { TX_BOOT } from "@/lib/boot";
import { Scripts } from "@/components/Scripts";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Terms & Conditions · The Dinerworkshop",
  description: "Terms & Conditions for private dining reservations, events and Claypot Rice takeaway at The Dinerworkshop.",
};

// The wording is the client's own document ("Terms & Conditions — The Diner Workshop", last updated 25 Nov 2026),
// set out as written. Each clause is [its title, its text]; a section with `list` is a run of untitled points.
type Section = { id: string; title: string; clauses?: [string, ReactNode][]; list?: string[]; text?: ReactNode };

const SECTIONS: Section[] = [
  {
    id: "bookings",
    title: "Bookings, Deposits & Payment",
    clauses: [
      ["Reservation Confirmation", "A private dining reservation is confirmed only upon receipt of a booking agreement/confirmation and a 50% deposit of the cost of the dinner."],
      ["Balance Settlement", "The remaining balance is due on the day of the dinner."],
      ["Accepted Payment Methods", "PayNow & Stripe"],
    ],
  },
  {
    id: "cancellations",
    title: "Cancellations, No-Shows & Rescheduling",
    clauses: [
      ["Cancellation Notice", "Cancellations made 14 days or more prior to the scheduled event date will receive a credit (the 50% deposit), to be used within 90 days. Cancellations made within 7 days of the event will incur forfeiture of the deposit. In the event of a cancellation by The Dinerworkshop due to unforeseen circumstances (i.e. sickness), the Client will receive a credit (the 50% deposit) to be used on a rescheduled date agreeable by both Parties."],
      ["Rescheduling", "Requests to change the event date or time are subject to venue availability and must be submitted in writing at least 14 days in advance. Rescheduling within 7 days of the event may be treated as a cancellation."],
      ["Late Arrivals & No-Shows", "Please notify us promptly if your party is running late. Arrivals more than 30 minutes past the scheduled start time without prior notice may be treated as a no-show/cancellation, and applicable deposit charges will apply."],
    ],
  },
  {
    id: "guest-count",
    title: "Guest Count",
    clauses: [
      ["Final Headcount", "Your final guaranteed guest count must be confirmed at least 3 days prior to the event. Final billing will be based on your confirmed guest count or actual attendance, whichever is greater."],
    ],
  },
  {
    id: "dietary",
    title: "Dietary Needs & Allergens",
    clauses: [
      ["Dietary Restrictions & Allergens", "Please inform us of any dietary requirements or food allergies during ‘Culinary Discovery Questionnaire’ consultation. While our culinary team takes every reasonable precaution, our kitchen handles common allergens (including nuts, dairy, gluten, shellfish, soy, and eggs) and cannot guarantee a 100% allergen-free environment."],
    ],
  },
  {
    id: "duration",
    title: "Event Duration & Overtime",
    clauses: [
      ["Scheduled Hours", "Your reservation covers the agreed event window specified in your booking confirmation. Early access for setup must be pre-arranged, and all guests and vendors must vacate the premises by the agreed conclusion time."],
      ["Overtime Charges", "Extending your event beyond the confirmed end time is subject to staff and venue availability and will incur an overtime fee calculated on an hourly basis."],
    ],
  },
  {
    id: "outside-items",
    title: "Outside Food, Beverages, Signage & Decor",
    clauses: [
      ["Outside Food & Celebration Cakes", "Outside celebration cakes are permitted subject to prior approval with no cakeage fee. No other outside food is permitted due to strict food safety regulations."],
      ["Beverages & Corkage", "The first bottle of outside liquor brought to the venue incurs no corkage fees. Corkage fees apply for subsequent liquor. In accordance with Singapore liquor licensing laws and responsible service standards, we reserve the right to restrict or refuse alcohol service to intoxicated or underage guests."],
      ["Decorations & Setup", "All decorations, floral arrangements, or signage must be approved in advance. Open flames, confetti, glitter, smoke machines, and adhesives or nails that damage walls or furnishings are strictly prohibited. All guest and vendor items must be removed immediately after the event. There will be a separate charge for venue rental in the case of an event."],
    ],
  },
  {
    id: "conduct",
    title: "Guest Conduct, Damages & Liability",
    clauses: [
      ["Property & Damages", "The Client is financially responsible for any loss or damage to the venue, furniture, tableware, glassware, or audio-visual equipment caused by guests, attendees, or third-party vendors engaged for the event."],
      ["Conduct & Safety", "We reserve the right to refuse entry, cease service, or require any disruptive, abusive, or intoxicated individual to leave the premises in the interest of guest safety and regulatory compliance."],
      ["Personal Belongings & Force Majeure", "The Diner Workshop is not responsible for lost, stolen, or unattended personal belongings. Neither party shall be liable for delays or cancellations caused by events beyond reasonable control (including severe weather, utility disruptions, public health directives, or government orders), in which case both parties will work in good faith to reschedule the booking."],
    ],
  },
  {
    id: "personal-data",
    title: "Personal Data Protection (PDPA — Singapore)",
    clauses: [
      ["Collection & Use of Personal Data", "By making an inquiry or reservation with The Diner Workshop, you consent to our collection, use, and disclosure of your personal data (such as your name, contact details, billing information, and dietary/allergy requirements) strictly for the purposes of processing your booking, managing your private dining experience, handling payments, and ensuring food safety."],
      ["Marketing Communications", "We will only send you promotional updates, event invitations, or newsletters. You may withdraw your consent and unsubscribe at any time by contacting us directly."],
      ["Third-Party Service Providers & Overseas Transfers", "To facilitate reservations, payment processing, and event coordination, your personal data may be shared with trusted third-party service providers (including booking platforms and payment gateways), some of which may store or process data outside Singapore. We ensure that any such recipients uphold data protection standards comparable to Singapore’s Personal Data Protection Act (PDPA)."],
      ["Data Security & Retention", "We implement reasonable administrative and technical safeguards to protect your personal data against unauthorized access, disclosure, or loss. We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected or to comply with applicable Singapore legal, tax, and accounting requirements."],
      ["Photography & Social Media", "We respect the privacy of our private dining guests. Our team will not photograph or post images of your private event on social media without prior permission from the Client."],
      ["Access, Correction & Data Protection Officer (DPO)", <>You may request access to, or correction of, your personal data in our records, or withdraw your consent at any time, by contacting our Data Protection Officer at <span className="tc__mail">thedinerworkshop@gmail.com</span>.</>],
    ],
  },
  {
    id: "claypot",
    title: "Claypot Rice Takeaway",
    list: [
      "Ordering is a minimum of 7 days in advance. Pick-up day is scheduled to be every Monday.",
      "We will contact you with regards to your scheduled pick-up time 3 days before your pick-up. Please arrange your own preferred delivery vendor if you have a delivery request.",
      "For pot rental, a refundable deposit of $150 and $20 rental fee are chargeable. The pot is to be returned to us 2 days after your event. A $20 rental per day will be levied for any delay.",
      "The pot will be returned to us cleaned. We recommend putting warm water & dishwashing liquid into the pot, letting it soak overnight before washing. Do not use any abrasive scrub or cleaning solution. It is not dishwasher safe.",
      "The pot deposit will be returned to you upon the return of the cleaned pot.",
      "In the event of any cancellation, confirmed orders are non-refundable as fresh produce would have been purchased.",
      "In the event if the claypot is damaged during pot rental period, the pot deposit will be forfeited.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law",
    text: "These Terms & Conditions shall be governed by and construed in accordance with the laws of the Republic of Singapore, and any disputes arising out of or in connection with them shall be subject to the exclusive jurisdiction of the courts of Singapore.",
  },
];

export default function TermsPage() {
  return (
    <>
      <link rel="stylesheet" href={"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap"} precedence="dw" />
      <link rel="stylesheet" href="/assets/pages/terms.css?v=1" precedence="dw" />
      <link rel="stylesheet" href="/assets/book.css?v=2" precedence="dw" />
      <link rel="stylesheet" href="/assets/foot.css?v=4" precedence="dw" />
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
          <a className="btn" href="/contact#book">
            Book Now
          </a>
          {" "}
          <button className="burger" id="burger" type="button" aria-label="Menu">
            <span></span>
          </button>
        </div>
      </header>
      {/* ─────────────── terms & conditions ─────────────── */}
      <main className="tc" id="top">
        <div className="inner">
          <div className="tc__head">
            <h1>
              Terms &amp; Conditions
            </h1>
            <p className="tc__date">
              Last Updated: 25 Nov 2026
            </p>
            <p className="tc__intro">
              Welcome to The Diner Workshop (www.thedinerworkshop.com). By submitting a booking inquiry, confirming a private dining reservation, or attending an event at our space, you (“Client”) agree to the following Terms &amp; Conditions on behalf of yourself and your guests.
            </p>
          </div>
          <nav className="tc__toc" aria-label="Contents">
            <p>
              Contents
            </p>
            <ol>
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a href={"#" + s.id}>
                    <span>
                      {i + 1}.
                    </span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          {SECTIONS.map((s, i) => (
            <section className="tc__sec" id={s.id} key={s.id} aria-labelledby={s.id + "-h"}>
              <h2 id={s.id + "-h"}>
                <span>
                  {i + 1}.
                </span>
                {s.title}
              </h2>
              {s.clauses && (
                <dl className="tc__body">
                  {s.clauses.map(([term, text]) => (
                    <div key={term}>
                      <dt>
                        {term}
                      </dt>
                      <dd>
                        {text}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              {s.list && (
                <div className="tc__body">
                  <ul>
                    {s.list.map(item => (
                      <li key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {s.text && (
                <div className="tc__body">
                  <p>
                    {s.text}
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>
      </main>
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
          <a href="/terms" aria-current="page">
            Terms &amp; Conditions
          </a>
        </div>
      </footer>
      <Scripts
        srcs={[
          "/assets/pages/terms.js?v=1",
          "/assets/db.js?v=4",
          "/assets/book.js?v=9",
          "/assets/wa.js?v=2",
          "/assets/btn.js",
          "/assets/motion.js?v=5",
        ]}
      />
    </>
  );
}
