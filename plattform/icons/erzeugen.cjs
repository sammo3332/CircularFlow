// Erzeugt die PNG-Icons der Web-App aus dem Zeichen der Plattform (Kreislauf, wie in app/ui.js).
// Nur für die Pflege der Icons nötig, nicht für den Betrieb. Aufruf: node plattform/icons/erzeugen.cjs
// Braucht Playwright mit Chromium. „maskierbar“ hat vollflächigen Grund und das Zeichen in der sicheren Mitte.
const { chromium } = require('playwright');
const path = require('path');
const zeichen = '<path d="M17 4.5A8.5 8.5 0 0 0 4.2 9"/><path d="M4 4v5h5"/><path d="M7 19.5A8.5 8.5 0 0 0 19.8 15"/><path d="M20 20v-5h-5"/>';
const svg = (rund, anteil) => { const s = 512 * anteil / 24; const o = (512 - 24 * s) / 2; return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="${rund}" fill="#0e5546"/><g transform="translate(${o} ${o}) scale(${s})" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${zeichen}</g></svg>`; };
const ICONS = [['icon-192.png', 192, 96, 0.5625], ['icon-512.png', 512, 96, 0.5625], ['icon-maskierbar-512.png', 512, 0, 0.44], ['apple-touch-icon.png', 180, 0, 0.52]];
(async () => {
  const b = await chromium.launch();
  for (const [name, px, rund, anteil] of ICONS) {
    const p = await b.newPage({ viewport: { width: px, height: px } });
    await p.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${px}px;height:${px}px}</style>${svg(rund, anteil)}`);
    await p.screenshot({ path: path.join(__dirname, name), omitBackground: true });
    await p.close(); console.log(name, px);
  }
  await b.close();
})();
