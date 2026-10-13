(() => {
const { sleep, shuffle } = Site;
const SCRIPTS = Site.TERMINAL_SCRIPTS;
const COMMON = Site.TERMINAL_COMMON;
const panels = document.querySelectorAll('.panel');
Site.terms = new Map();
const terms = Site.terms;
const visible = new WeakMap();
const io = new IntersectionObserver(es => es.forEach(e => visible.set(e.target, e.isIntersecting)));
panels.forEach(p => {
  const term = document.createElement('pre');
  term.className = `term ${p.classList.contains('right') ? 'on-left' : 'on-right'}`;
  term.setAttribute('aria-hidden', 'true');
  p.prepend(term);
  terms.set(p, term);
  io.observe(term);
  runTerm(term, SCRIPTS[p.id] || SCRIPTS.about);
});
async function runTerm(term, script) {
  const MAX = 60;
  const lines = [];
  const render = cursor => { term.textContent = lines.join('\n') + (cursor ? '█' : ''); };
  const push = s => { lines.push(s); if (lines.length > MAX) lines.shift(); };
  while (lines.length < MAX) {
    for (const [cmd, ...out] of shuffle([...script, ...shuffle([...COMMON]).slice(0, 3)])) {
      push(cmd);
      out.forEach(push);
      push('');
    }
  }
  render(!Site.calm);
  if (Site.calm) return;
  await sleep(Math.random() * 400);
  for (;;) {
    const round = shuffle([...script, ...shuffle([...COMMON]).slice(0, 3)]);
    for (const [cmd, ...out] of round) {
      while (!visible.get(term)) await sleep(400);
      push('');
      for (const ch of cmd) {
        lines[lines.length - 1] += ch;
        render(true);
        await sleep(22 + Math.random() * 36);
      }
      await sleep(190);
      for (const o of out) {
        push(o);
        render(true);
        await sleep(65 + Math.random() * 135);
      }
      for (let b = 0; b < 3; b++) {
        render(b % 2 === 0); await sleep(230);
      }
    }
    push('');
  }
}
})();
