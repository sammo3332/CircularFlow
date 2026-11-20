// Erkundung (nur lesen): DOM der Übersicht und einer Bedarfsseite im frischen Kontext
const { chromium } = require('playwright');
(async () => {
  const basis = 'http://127.0.0.1:8122/plattform/';
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 810 }, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push('pageerror: ' + e)); page.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
  await page.goto(basis, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Übersicht', level: 1 }).waitFor();
  console.log('--- Übersicht: Zeilen .frist-zeile ---');
  console.log(JSON.stringify(await page.locator('.frist-zeile').allInnerTexts(), null, 1));
  console.log('--- Stichtag-Auswahl ---');
  console.log(await page.evaluate(() => [...document.querySelectorAll('select[id^=projektzeit]')].map((s) => ({ id: s.id, sichtbar: !!s.offsetParent, wert: s.value, optionen: [...s.options].map((o) => o.textContent) }))));
  await page.goto(basis + '#bedarf-sb-bd-22', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  console.log('--- BD-22: dl-Zeilen im Block Angaben ---');
  console.log(JSON.stringify(await page.locator('dl > div').allInnerTexts(), null, 1));
  const zeile = page.locator('dl > div').filter({ hasText: 'Prüfbitte spätestens' });
  console.log('Anzahl Zeilen "Prüfbitte spätestens":', await zeile.count());
  console.log('HTML der Zeile:', await zeile.first().evaluate((e) => e.outerHTML));
  console.log('Fehler:', JSON.stringify(fehler));
  await browser.close();
})().catch((e) => { console.error('SKRIPTFEHLER', e); process.exit(1); });
