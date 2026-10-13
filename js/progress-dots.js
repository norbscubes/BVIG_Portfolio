(() => {
const sections = [...document.querySelectorAll('main > section')];
const nav = document.createElement('nav');
nav.className = 'progress-dots';
nav.setAttribute('aria-label', 'Sections');
const label = id => id.charAt(0).toUpperCase() + id.slice(1);
const dots = sections.map(s => {
  const b = document.createElement('button');
  b.className = 'dot';
  b.setAttribute('aria-label', label(s.id));
  b.innerHTML = `<span class="lbl">${label(s.id)}</span>`;
  b.addEventListener('click', () => s.scrollIntoView({ behavior: Site.calm ? 'auto' : 'smooth', block: 'center' }));
  nav.appendChild(b);
  return b;
});
document.body.appendChild(nav);
nav.addEventListener('pointerenter', () => Site.cpuReset?.(true));
nav.addEventListener('pointerleave', () => Site.cpuReset?.(false));
let active = -1;
const update = () => {
  const i = Site.currentSection(sections);
  if (i === active) return;
  if (active >= 0) { dots[active].classList.remove('on'); dots[active].removeAttribute('aria-current'); }
  dots[i].classList.add('on');
  dots[i].setAttribute('aria-current', 'true');
  active = i;
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
