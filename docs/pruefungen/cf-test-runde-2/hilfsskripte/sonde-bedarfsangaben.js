// Eigene Sonde des Prüfers (Scratchpad, nicht im Repository): Angabenblock einer Bedarfsseite lesen.
// Aufruf: node sonde-bedarfsangaben.js <startUrl mit Schrägstrich am Ende> <hash>
const { chromium } = require('playwright');
const [basis, hash] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 810 }, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
  const page = await ctx.newPage();
  await page.goto(basis + hash, { waitUntil: 'networkidle' }); await page.locator('h1').first().waitFor({ timeout: 15000 });
  const zeilen = await page.locator('dl > div').evaluateAll((els) => els.map((e) => e.innerText.replace(/\s+/g, ' ').trim()));
  console.log(hash, '->', JSON.stringify(zeilen, null, 1));
  await browser.close();
})().catch((e) => { console.error('SKRIPTFEHLER', String(e).split('\n')[0]); process.exit(1); });
