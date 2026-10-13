(() => {
const wave = document.getElementById('wave');
const ctx = wave.getContext('2d');
const WAVES = [
  { amp: 26, freq: 0.006, speed: 1.0, color: '60,242,180', width: 1.5, alpha: 0.9 },
  { amp: 18, freq: 0.011, speed: 1.6, color: '120,200,255', width: 1.2, alpha: 0.7 },
  { amp: 34, freq: 0.004, speed: 0.6, color: '140,90,255', width: 1, alpha: 0.5 },
  { amp: 12, freq: 0.018, speed: 2.3, color: '217,164,65', width: 0.8, alpha: 0.5 },
  { amp: 22, freq: 0.008, speed: 1.2, color: '60,242,180', width: 0.6, alpha: 0.35 },
];
let phase = 0, speed = 1, lastScroll = 0, lastT = performance.now();
function resizeWave() {
  const dpr = Site.lite ? 1 : devicePixelRatio || 1;
  wave.width = innerWidth * dpr;
  wave.height = 180 * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', resizeWave);
addEventListener('scroll', () => { lastScroll = performance.now(); }, { passive: true });
resizeWave();
const STEP = Site.lite ? 10 : 4, FRAME = Site.lite ? 1000 / 30 : 0;
let lastDraw = 0;
function drawWave(t) {
  if (t - lastDraw < FRAME) { requestAnimationFrame(drawWave); return; }
  lastDraw = t;
  const dt = Math.min((t - lastT) / 1000, 0.05);
  lastT = t;
  const target = t - lastScroll < 250 ? 0.12 : 1;
  speed += (target - speed) * Math.min(dt * 4, 1);
  phase += dt * speed * 2;
  const w = innerWidth, mid = 110;
  ctx.clearRect(0, 0, w, 180);
  WAVES.forEach((wv, i) => {
    ctx.beginPath();
    for (let x = 0; x <= w; x += STEP) {
      const env = Math.sin((x / w) * Math.PI);
      const y = mid
        + Math.sin(x * wv.freq + phase * wv.speed + i) * wv.amp * env
        + Math.sin(x * wv.freq * 2.7 - phase * wv.speed * 0.7) * wv.amp * 0.3 * env;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(${wv.color},${wv.alpha})`;
    ctx.lineWidth = wv.width;
    ctx.shadowColor = `rgba(${wv.color},0.8)`;
    ctx.shadowBlur = Site.lite ? 0 : 6;
    ctx.stroke();
  });
  requestAnimationFrame(drawWave);
}
requestAnimationFrame(drawWave);
})();
