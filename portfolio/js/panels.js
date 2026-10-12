(() => {
const { smoothstep } = Site;
const panels = document.querySelectorAll('.panel');
const terms = Site.terms || new Map();
const groups = [...panels].map(p => ({
  panel: p,
  kids: [...p.children].filter(c => !c.classList.contains('term') && !c.classList.contains('portrait')),
  portrait: p.querySelector('.portrait'),
  term: terms.get(p),
  side: p.classList.contains('right') ? 1 : -1,
}));
function updateFloaters() {
  const vh = innerHeight;
  groups.forEach(({ panel, kids, side, term, portrait }) => {
    const r = panel.getBoundingClientRect();
    const overTop = Math.max(0, -r.top);
    const overBottom = Math.max(0, r.bottom - vh);
    const over = Math.max(overTop, overBottom) / Math.max(r.height, 1);
    const t = smoothstep(0.1, 0.7, over);
    const dirY = overTop > overBottom ? -1 : 1;
    if (portrait) {
      portrait.style.opacity = 1 - t;
      portrait.style.transform = "translateX(" + (-side * t * 160) + "px) translateY(" + (dirY * t * 30) + "px)";
    }
    const order = dirY < 0 ? kids : [...kids].reverse();
    order.forEach((el, i) => {
      const ti = over > 0 ? smoothstep(0.1, 0.7, over + i * 0.07) : t;
      el.style.opacity = 1 - ti;
      el.style.transform = `translateX(${side * ti * 160}px) translateY(${dirY * ti * 30}px)`;
    });
  });
}
let floatPending = false;
addEventListener('scroll', () => {
  if (floatPending) return;
  floatPending = true;
  requestAnimationFrame(() => { floatPending = false; updateFloaters(); });
}, { passive: true });
addEventListener('resize', updateFloaters);
updateFloaters();
})();
