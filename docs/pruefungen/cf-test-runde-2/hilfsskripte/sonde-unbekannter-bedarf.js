// Eigene Sonde des Prüfers (Scratchpad, nicht im Repository): Was zeigt die Seite bei einem Link auf einen nicht vorhandenen Bedarf?
// Aufruf: node sonde-unbekannter-bedarf.js <startUrl mit Schrägstrich am Ende> <hash>
const { chromium } = require('playwright');
const [basis, hash] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 810 }, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
  const page = await ctx.newPage(); const meldungen = [];
  page.on('pageerror', (e) => meldungen.push('pageerror: ' + e)); page.on('console', (m) => { if (m.type() === 'error') meldungen.push('console: ' + m.text()); });
  await page.goto(basis + hash, { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  const info = await page.evaluate(() => ({ hash: location.hash, h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.replace(/\s+/g, ' ').trim()), mainText: (document.querySelector('main')?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 300), mainLeer: !(document.querySelector('main')?.innerText || '').trim() }));
  console.log(JSON.stringify({ basis, hash, ...info, meldungen }));
  await browser.close();
})().catch((e) => { console.error('SKRIPTFEHLER', String(e).split('\n')[0]); process.exit(1); });
