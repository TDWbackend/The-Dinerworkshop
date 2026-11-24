/* Google reviews, word for word from the Google listing. Each column holds the set twice so it loops seamlessly. */
(() => {
  const REVIEWS = [
    { name: "Patrick AE Lim", meta: "3 reviews", stars: 5, colour: "#7B1FA2", visit: "Dine in · Lunch",
      text: "Fantabulous dining experience at a quiet home setting… food was yummylicious and the service staff were attentive. 👍👍👍" },
    { name: "Lynn Low", meta: "6 reviews", stars: 4, colour: "#0B8043", visit: "Dine in · Lunch",
      text: "Cosy, relaxing ambience, delicious food and friendly hospitality from Chef Ian and his family. A lovely dining experience" },
    { name: "Jason Tong", meta: "Local Guide · 10 reviews · 7 photos", stars: 5, colour: "#E8710A", visit: "Dine in · Lunch",
      text: "Lovely food, great service, warm atmosphere, kind people." }
  ];
  const G = "<svg class=\"glogo\" viewBox=\"0 0 48 48\" aria-hidden=\"true\"><path fill=\"#FFC107\" d=\"M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z\"/><path fill=\"#FF3D00\" d=\"M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z\"/><path fill=\"#4CAF50\" d=\"M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z\"/><path fill=\"#1976D2\" d=\"M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z\"/></svg>";
  const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg>';
  const stars = n => Array.from({ length: 5 }, (_, i) => i < n ? STAR : STAR.replace("<svg ", '<svg class="off" ')).join("");
  const esc = t => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const card = r => `<article class="gcard">
      <div class="gcard__top"><span class="gcard__av" style="background:${r.colour}">${r.name[0]}</span>
        <div class="gcard__who"><div class="gcard__name">${esc(r.name)}</div><div class="gcard__meta">${esc(r.meta)}</div></div>${G}</div>
      <div class="gcard__row"><span class="gstars" aria-label="${r.stars} out of 5 stars">${stars(r.stars)}</span><span>${r.visit}</span></div>
      <p>${esc(r.text)}</p>
      <div class="gcard__foot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M8.8 12.2l2.2 2.2 4.2-4.4"/></svg>Verified Google review</div>
    </article>`;
  const rating = document.getElementById("gRatingStars");
  if (rating) rating.innerHTML = stars(5);
  const cols = [...document.querySelectorAll("#gcols .gcol__inner")];
  if (!cols.length) return;
  // the second column starts further along the list so the two never line up
  const order = [REVIEWS, [...REVIEWS.slice(1), REVIEWS[0]]];
  cols.forEach((col, c) => {
    let set = order[c];
    while (set.length < 4) set = set.concat(order[c]);        // enough cards to fill the column before it repeats
    const html = set.map(card).join("");
    col.innerHTML = html + html;
  });
})();
