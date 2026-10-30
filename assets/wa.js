/* The floating Book Now pill and the green WhatsApp circle in the bottom corner of every page.
   Both hide while the booking pop-up is open. Book Now opens the booking (on the Contact page it scrolls to the form). */
(() => {
  const style = document.createElement("style");
  style.textContent = `
.wa-float { position: fixed; right: 22px; bottom: 22px; z-index: 150; width: 58px; height: 58px; border-radius: 50%; background: #25d366; color: #fff; display: grid; place-items: center; box-shadow: 0 10px 28px rgba(0, 0, 0, .25); transition: transform .45s cubic-bezier(.16, 1, .3, 1), box-shadow .45s; }
.wa-float:hover { transform: translateY(-3px) scale(1.04); box-shadow: 0 16px 34px rgba(0, 0, 0, .3); }
.wa-float svg { width: 32px; height: 32px; }
html.bk-lock .wa-float, html.bk-lock .book-float { display: none; }
.book-float { position: fixed; right: 22px; bottom: 94px; z-index: 150; width: 58px; height: 58px; border-radius: 50%; background: var(--ink, #2a1d16); color: var(--cream, #f1eadf); display: grid; place-items: center; box-shadow: 0 10px 28px rgba(42, 29, 22, .28); transition: transform .45s cubic-bezier(.16, 1, .3, 1), box-shadow .45s, background .35s, color .35s; }
.book-float:hover { background: var(--gold, #b5925c); color: var(--brown-2, #19110b); transform: translateY(-3px) scale(1.04); box-shadow: 0 16px 34px rgba(42, 29, 22, .3); }
.book-float svg { width: 26px; height: 26px; }
.book-float::after { content: "Book Now"; position: absolute; right: calc(100% + 12px); top: 50%; transform: translateY(-50%) translateX(6px); padding: 7px 12px; border-radius: 999px; background: var(--ink, #2a1d16); color: var(--cream, #f1eadf); font-size: 12px; letter-spacing: .08em; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity .3s, transform .3s; }
.book-float:hover::after { opacity: 1; transform: translateY(-50%); }
@media (max-width: 600px) { .wa-float { right: 16px; bottom: 16px; width: 54px; height: 54px; } .wa-float svg { width: 29px; height: 29px; } .book-float { right: 16px; bottom: 80px; width: 54px; height: 54px; } .book-float svg { width: 24px; height: 24px; } .book-float::after { display: none; } }`;
  document.head.appendChild(style);
  const a = document.createElement("a");
  a.className = "wa-float";
  a.href = "https://wa.me/6580710506";
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Chat with us on WhatsApp");
  a.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8zm-3 4.4c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.3s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.2-.7.2l-.9 1.1c-.2.2-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.4 0-.5L10.5 9c-.3-.6-.5-.5-.7-.5h-.8z"/></svg>';
  document.body.appendChild(a);
  const b = document.createElement("a");
  b.className = "book-float";
  b.href = "contact.html#book";
  b.setAttribute("aria-label", "Book Now");
  b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 2.8v4.2M16 2.8v4.2"/><path d="M9.2 15.3l2 2 3.8-4"/></svg>';
  b.addEventListener("click", e => { if (window.openBooking) window.openBooking(e); });
  document.body.appendChild(b);
})();
