(() => {
const { animate, stagger } = Site.anime;
const { smoothstep } = Site;
const chip = document.getElementById('chip');
const pins = document.getElementById('pins');
if (Site.lite) {
  pins.remove();
  document.querySelector('.layer.tim').remove();
  document.querySelector('.layer.die').dataset.depth = 2;
}
const layers = [...document.querySelectorAll('.layer')];
const substrate = document.getElementById('substrate');
const dieCore = document.querySelector('.die-core');

const GRID = Site.lite ? 0 : 24;
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
  if (Site.lite) return;
  const cx = innerWidth / 2, cy = innerHeight / 2;
  const m = resetHold ? { x: cx, y: cy } : mouse;
  const dx = (m.x - cx) / cx, dy = (m.y - cy) / cy;
  const dist = Math.min(Math.hypot(dx, dy) / Math.SQRT2, 1);
  const e = Site.calm ? 0 : smoothstep(0.12, 0.85, dist);
  layers.forEach(l => {
    const d = +l.dataset.depth;
    animate(l, {
      translateZ: d * (BASE_GAP + EXPLODE_GAP * e),
      translateX: dx * d * DRIFT * e,
      translateY: dy * d * DRIFT * e,
      duration: Site.calm ? 0 : 900,
      ease: 'outExpo',
    });
  });
}

const onArrow = ev => !!(ev.target instanceof Element && ev.target.closest('.nav-arrow, .progress-dots'));
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

const rot = { x: 55, z: -30, tx: 55, tz: -30, running: false };
function stepRotation() {
  rot.x += (rot.tx - rot.x) * 0.15;
  rot.z += (rot.tz - rot.z) * 0.15;
  const done = Math.abs(rot.tx - rot.x) < 0.05 && Math.abs(rot.tz - rot.z) < 0.05;
  if (done) { rot.x = rot.tx; rot.z = rot.tz; }
  chip.style.transform = `rotateX(${rot.x}deg) rotateZ(${rot.z}deg)`;
  rot.running = !done;
  if (rot.running) requestAnimationFrame(stepRotation);
}
function updateRotation() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? scrollY / max : 0;
  document.getElementById('hint').style.opacity = p > 0.05 ? 0 : 0.7;
  if (Site.lite) {
    rot.tx = 55 - p * 35;
    rot.tz = -30 + p * 360;
    if (Site.calm) { rot.x = rot.tx; rot.z = rot.tz; }
    if (!rot.running) { rot.running = true; requestAnimationFrame(stepRotation); }
    return;
  }
  animate(chip, {
    rotateX: 55 - p * 35,
    rotateZ: -30 + p * 360,
    duration: Site.calm ? 0 : 700,
    ease: 'outQuart',
  });
  document.getElementById('hint').style.opacity = p > 0.05 ? 0 : 0.7;
}
let rotPending = false;
addEventListener('scroll', () => {
  if (rotPending) return;
  rotPending = true;
  requestAnimationFrame(() => { rotPending = false; updateRotation(); });
}, { passive: true });
updateRotation();
animate(layers, {
  opacity: [0, 1],
  delay: stagger(120, { from: 'first' }),
  duration: 900,
  ease: 'outQuad',
});
})();
