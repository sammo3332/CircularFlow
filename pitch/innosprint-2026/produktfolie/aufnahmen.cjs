// Erzeugt die Aufnahmen der Produktfolie aus der laufenden Plattform (Branch claude/bold-fermat-t1ngwv).
// Aufruf vom Repository-Wurzelverzeichnis, Server läuft: node pitch/innosprint-2026/produktfolie/aufnahmen.cjs <Testbild.jpg>
// Handy: Chromium mit Geräteprofil „Pixel 7“ (Emulation). Rechner: Chromium 1280 × 720. Jede Aufnahme in frischem Profil.
const { chromium, devices } = require('playwright');
const path = require('path');
const BILD = path.resolve(process.argv[2]); const AUS = path.join(__dirname, 'bilder'); const URL = process.argv[3] || 'http://127.0.0.1:8000/plattform/';
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ ...devices['Pixel 7'] }); const p = await c.newPage();
  await p.goto(`${URL}#erfassung`); await p.waitForSelector('#erf-projekt');
  await p.selectOption('#erf-projekt', 'LH'); await p.selectOption('#erf-raum', { index: 1 }); await p.click('#erf-weiter');
  await p.setInputFiles('#erf-foto', BILD); await p.waitForSelector('.fotofeld img');
  await p.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); }); await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(AUS, 'handy-foto.png') });
  await p.click('#erf-weiter'); await p.locator('label.zustandschip').nth(1).click(); await p.click('#erf-weiter');
  await p.fill('#w-breite', '860'); await p.click('#ueb-hoehe'); await p.click('#erf-weiter'); await p.waitForSelector('#erf-speichern');
  await p.evaluate(() => { document.activeElement?.blur(); document.querySelector('.erf-karte').scrollIntoView({ block: 'start' }); window.scrollBy(0, -70); }); await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(AUS, 'handy-pruefen.png') });
  await p.click('#erf-speichern'); await p.waitForSelector('#h-gesp'); await p.waitForTimeout(4200);
  await p.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); }); await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(AUS, 'handy-gespeichert.png') });
  await c.close();
  const d = await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 }); const q = await d.newPage();
  await q.goto(`${URL}#abgleich`); await q.waitForSelector('main h1');
  await q.click('tr:has-text("TW-05"):has-text("BD-22")'); await q.waitForTimeout(400);
  await q.evaluate(() => document.activeElement?.blur());
  await q.screenshot({ path: path.join(AUS, 'rechner-abgleich.png') });
  await q.click('button:has-text("Prüfbitte anlegen")'); await q.waitForSelector('main h1'); await q.waitForTimeout(4200);
  await q.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); }); await q.waitForTimeout(200);
  await q.screenshot({ path: path.join(AUS, 'rechner-entscheidung.png') });
  await b.close(); console.log('5 Aufnahmen in', AUS);
})();
