// Menu mobile
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', false);
}));

// Carte à gratter du hero
(function () {
  const hero = document.querySelector('.hero');
  const canvas = document.querySelector('.hero__scratch');
  const ctx = canvas.getContext('2d');
  let drawing = false, last = null, scratched = 0;

  function paint() {
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = hero.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    // couche "papier" à gratter
    ctx.fillStyle = '#F3EEE4';
    ctx.fillRect(0, 0, width, height);
    // grain léger
    for (let i = 0; i < (width * height) / 180; i++) {
      ctx.fillStyle = `rgba(23,22,20,${Math.random() * 0.05})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5);
    }
  }

  function scratch(x, y) {
    const r = Math.max(28, window.innerWidth / 22);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineWidth = r * 2;
    ctx.beginPath();
    ctx.moveTo(last ? last.x : x, last ? last.y : y);
    ctx.lineTo(x, y);
    ctx.stroke();
    last = { x, y };
    if (++scratched > 8) hero.classList.add('scratched');
  }

  function pos(e) {
    const rect = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - rect.left, y: p.clientY - rect.top };
  }

  // Souris : gratte au survol ; tactile : gratte au glissé (sans bloquer le défilement vertical)
  canvas.addEventListener('mousemove', e => { const p = pos(e); scratch(p.x, p.y); });
  canvas.addEventListener('mouseleave', () => { last = null; });
  canvas.addEventListener('touchstart', e => { drawing = true; last = null; const p = pos(e); scratch(p.x, p.y); }, { passive: true });
  canvas.addEventListener('touchmove', e => { if (drawing) { const p = pos(e); scratch(p.x, p.y); } }, { passive: true });
  canvas.addEventListener('touchend', () => { drawing = false; last = null; });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (!hero.classList.contains('scratched')) paint(); }, 200);
  });
  paint();
})();
