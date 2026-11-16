/* Buttons: wrap each button's words so they can roll up and round on hover (styles in type.css).
   Watches for buttons added or relabelled later, like the booking pop-up's step button. */
(() => {
  function wrap(btn) {
    [...btn.childNodes].forEach(n => {
      if (n.nodeType !== 3 || !n.textContent.trim()) return;
      const t = n.textContent.trim();
      const roll = document.createElement("span");
      roll.className = "btn__roll";
      const inner = document.createElement("span");
      inner.textContent = t;
      inner.setAttribute("data-t", t);
      roll.appendChild(inner);
      btn.replaceChild(roll, n);
    });
  }
  const all = root => root.querySelectorAll && root.querySelectorAll(".btn").forEach(wrap);
  all(document);
  new MutationObserver(ms => ms.forEach(m => {
    if (m.target.classList && m.target.classList.contains("btn")) wrap(m.target);
    m.addedNodes.forEach(n => { if (n.nodeType === 1) { if (n.classList.contains("btn")) wrap(n); all(n); } });
  })).observe(document.body, { childList: true, subtree: true });
})();
