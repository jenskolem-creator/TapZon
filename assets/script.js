// BackgroundPaths — vanilla port of the framer-motion component.
// 36 flowing paths x2 mirrored groups, cycling Google brand colors,
// animated continuously (repeatCount="indefinite" — never stops).
(function initBgPaths() {
  const host = document.getElementById('bgPaths');
  if (!host) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853']; // blue, red, yellow, green

  function buildGroup(position) {
    let out = '';
    for (let i = 0; i < 36; i++) {
      const d =
        `M-${380 - i * 5 * position} -${189 + i * 6}` +
        `C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}` +
        `C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`;
      const color = COLORS[i % COLORS.length];
      const width = (0.8 + i * 0.04).toFixed(2);
      if (reduce) {
        out += `<path d="${d}" stroke="${color}" stroke-width="${width}" fill="none" stroke-opacity="0.7"/>`;
      } else {
        const dur = (18 + Math.random() * 10).toFixed(1);
        const odur = (14 + Math.random() * 8).toFixed(1);
        // Negative begin = start mid-cycle so the sweep is already full at load.
        const begin = (-Math.random() * dur).toFixed(1);
        const obegin = (-Math.random() * odur).toFixed(1);
        // pathLength normalizes the path to 1 unit so the dash "flows" along it.
        out +=
          `<path class="flow" d="${d}" stroke="${color}" stroke-width="${width}" fill="none" ` +
          `stroke-linecap="round" pathLength="1" stroke-dasharray="0.55 0.45" stroke-opacity="0.8">` +
          `<animate attributeName="stroke-dashoffset" values="1;0" dur="${dur}s" begin="${begin}s" calcMode="linear" repeatCount="indefinite"/>` +
          `<animate attributeName="stroke-opacity" values="0.45;0.9;0.45" dur="${odur}s" begin="${obegin}s" calcMode="linear" repeatCount="indefinite"/>` +
          `</path>`;
      }
    }
    return out;
  }

  host.innerHTML =
    '<svg viewBox="0 0 696 316" fill="none" preserveAspectRatio="none">' +
    buildGroup(1) + buildGroup(-1) +
    '</svg>';
})();

// Mobile/overlay nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});
navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => observer.observe(el));

// Current year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Order form -> mailto (no backend, matches "ingen data lagres på nettsiden")
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(orderForm);
    const navn = data.get('navn') || '';
    const bedrift = data.get('bedrift') || '';
    const epost = data.get('epost') || '';
    const produkt = data.get('produkt') || '';
    const antall = data.get('antall') || '';
    const melding = data.get('melding') || '';

    const subject = `Bestilling: ${produkt} (${antall})`;
    const body =
      `Navn: ${navn}\n` +
      `Bedrift: ${bedrift}\n` +
      `E-post: ${epost}\n` +
      `Produkt: ${produkt}\n` +
      `Antall/pakke: ${antall}\n` +
      `Melding: ${melding}`;

    window.location.href =
      `mailto:tapzonreview@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
