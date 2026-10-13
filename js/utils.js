window.Site = window.Site || {};
Site.lite = matchMedia('(max-width: 768px), (pointer: coarse)').matches;
document.documentElement.classList.toggle('lite', Site.lite);
Site.calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.toggle('calm', Site.calm);
Site.currentSection = sections => {
  const mid = innerHeight / 2;
  let best = 0, bestD = Infinity;
  sections.forEach((s, i) => {
    const r = s.getBoundingClientRect();
    const dist = Math.abs(r.top + r.height / 2 - mid);
    if (dist < bestD) { bestD = dist; best = i; }
  });
  return best;
};
Site.smoothstep = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};
Site.sleep = ms => new Promise(r => setTimeout(r, ms));
Site.shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
