(() => {
const { animate, stagger } = Site.anime;
const { smoothstep } = Site;
const chip = document.getElementById('chip');
const layers = [...document.querySelectorAll('.layer')];
const pins = document.getElementById('pins');
const substrate = document.getElementById('substrate');
const dieCore = document.querySelector('.die-core');

const GRID = 24;
for (let r = 0; r < GRID; r++) {
  for (let c = 0; c < GRID; c++) {
    const pin = document.createElement('i');
    const center = r > 7 && r < 16 && c > 7 && c < 16;
    const corner = r === 0 && c === 0;
    pin.className = center || corner ? 'pin off' : 'pin';
    pins.appendChild(pin);
  }
}

for (let i = 0; i < 4; i++) {
  for (let k = 0; k < 6; k++) {
    const cap = document.createElement('span');
    cap.className = 'cap';
    const along = 105 + k * 24;
    const edge = 52;
    const pos = [
      { left: along, top: edge },
      { left: 340 - edge, top: along },
      { left: along, top: 340 - edge },
      { left: edge - 10, top: along },
    ][i];
    cap.style.left = `${pos.left}px`;
    cap.style.top = `${pos.top}px`;
    if (i % 2) cap.style.transform = 'rotate(90deg)';
    substrate.appendChild(cap);
  }
}

for (let i = 0; i < 4; i++) dieCore.appendChild(document.createElement('i'));
const cache = document.createElement('i');
cache.className = 'cache';
dieCore.appendChild(cache);

const BASE_GAP = 6, EXPLODE_GAP = 90, DRIFT = 35;
layers.forEach(l => {
  const d = +l.dataset.depth;
  l.style.transform = `translateZ(${d * BASE_GAP}px)`;
});

let mouse = { x: innerWidth / 2, y: innerHeight / 2 };
let pending = false;
let resetHold = false;
Site.cpuReset = on => {
  resetHold = on;
  updateExplode();
};

function updateExplode() {
  pending = false;
  const cx = innerWidth / 2, cy = innerHeight / 2;
  const m = resetHold ? { x: cx, y: cy } : mouse;
  const dx = (m.x - cx) / cx, dy = (m.y - cy) / cy;
  const dist = Math.min(Math.hypot(dx, dy) / Math.SQRT2, 1);
  const e = smoothstep(0.12, 0.85, dist);
  layers.forEach(l => {
    const d = +l.dataset.depth;
    animate(l, {
      translateZ: d * (BASE_GAP + EXPLODE_GAP * e),
      translateX: dx * d * DRIFT * e,
      translateY: dy * d * DRIFT * e,
      duration: 900,
      ease: 'outExpo',
    });
  });
}

const onArrow = ev => !!(ev.target instanceof Element && ev.target.closest('.nav-arrow'));
addEventListener('pointerover', ev => {
  const hold = onArrow(ev);
  if (hold !== resetHold) Site.cpuReset(hold);
});
addEventListener('pointermove', ev => {
  mouse = { x: ev.clientX, y: ev.clientY };
  const hold = onArrow(ev);
  if (hold !== resetHold) { Site.cpuReset(hold); return; }
  if (!pending) { pending = true; requestAnimationFrame(updateExplode); }
});

function updateRotation() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? scrollY / max : 0;
  animate(chip, {
    rotateX: 55 - p * 35,
    rotateZ: -30 + p * 360,
    duration: 700,
    ease: 'outQuart',
  });
  document.getElementById('hint').style.opacity = p > 0.05 ? 0 : 0.7;
}
addEventListener('scroll', updateRotation, { passive: true });
updateRotation();
animate(layers, {
  opacity: [0, 1],
  delay: stagger(120, { from: 'first' }),
  duration: 900,
  ease: 'outQuad',
});
})();
