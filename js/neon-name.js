(() => {
const { animate } = Site.anime;
const letters = [];
document.querySelectorAll('.neon-name').forEach(nameEl => {
const words = nameEl.textContent.split(' ');
nameEl.textContent = '';
let i = 0;
words.forEach((word, w) => {
  const wrap = document.createElement('span');
  wrap.style.whiteSpace = 'nowrap';
  [...word].forEach(ch => {
    const s = document.createElement('span');
    s.className = 'ltr';
    s.textContent = ch;
    s.style.animationDelay = `${-(i++) * 0.23}s`;
    if (nameEl.tagName === 'H1') letters.push(s);
    wrap.appendChild(s);
  });
  nameEl.appendChild(wrap);
  if (w < words.length - 1) nameEl.appendChild(document.createTextNode(' '));
});
});
const scatter = letters.map(() => ({ mag: 0.5 + Math.random(), rot: Math.random() * 2 - 1 }));
let prevY = scrollY, scatterPending = false;
if (!Site.lite) addEventListener('scroll', () => {
  if (scatterPending) return;
  scatterPending = true;
  requestAnimationFrame(() => {
    scatterPending = false;
    const delta = scrollY - prevY;
    prevY = scrollY;
    if (!delta) return;
    const dir = Math.sign(delta);
    const force = Math.min(Math.abs(delta), 60);
    letters.forEach((s, i) => {
      const { mag, rot } = scatter[i];
      animate(s, {
        translateY: [-dir * force * mag, 0],
        rotate: [rot * force * 0.4, 0],
        duration: 1400,
        ease: 'outElastic(1, .5)',
      });
    });
  });
}, { passive: true });
})();
