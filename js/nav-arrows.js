(() => {
const sections = [...document.querySelectorAll('main > section')];
const nav = document.createElement('nav');
nav.className = 'nav-arrows';
nav.innerHTML = '<button class="nav-arrow up" aria-label="Previous section"><span class="tri"></span></button>' +
  '<button class="nav-arrow down" aria-label="Next section"><span class="tri"></span></button>';
document.body.appendChild(nav);
const [up, down] = nav.children;
const current = () => {
  const mid = innerHeight / 2;
  let best = 0, bestD = Infinity;
  sections.forEach((s, i) => {
    const r = s.getBoundingClientRect();
    const dist = Math.abs(r.top + r.height / 2 - mid);
    if (dist < bestD) { bestD = dist; best = i; }
  });
  return best;
};
const go = dir => {
  const i = Math.min(sections.length - 1, Math.max(0, current() + dir));
  sections[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
};
const splash = (btn, e) => {
  const r = btn.getBoundingClientRect();
  const x = e.clientX || r.left + r.width / 2, y = e.clientY || r.top + r.height / 2;
  for (let k = 0; k < 14; k++) {
    const p = document.createElement('span');
    p.className = 'spark';
    p.style.left = x + 'px'; p.style.top = y + 'px';
    document.body.appendChild(p);
    const a = Math.random() * Math.PI * 2, dist = 14 + Math.random() * 30, s = .4 + Math.random() * .8;
    p.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(a) * dist}px), calc(-50% + ${Math.sin(a) * dist}px)) scale(${s * .3})`, opacity: 0 },
    ], { duration: 420 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => p.remove();
  }
};
[up, down].forEach(b => {
  b.addEventListener('pointerenter', () => Site.cpuReset?.(true));
  b.addEventListener('pointerleave', () => Site.cpuReset?.(false));
});
up.addEventListener('click', e => { splash(up, e); go(-1); });
down.addEventListener('click', e => { splash(down, e); go(1); });
const update = () => {
  const i = current();
  up.classList.toggle('hidden', i === 0 && scrollY < 10);
  down.classList.toggle('hidden', i === sections.length - 1);
};
let pending = false;
addEventListener('scroll', () => {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => { pending = false; update(); });
}, { passive: true });
addEventListener('resize', update);
update();
})();
