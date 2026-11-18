// Liest die Texte der Paarliste (K2) und der Abgleichseiten K3, K4 und eines Paares zu BD-21 aus der Vorschau.
// Aufruf: node abgleich-texte.js <startUrl> (Adresse der Vorschau, zum Beispiel http://localhost:8130/plattform/)
// Frischer Browserkontext, Fenster 1440 x 810, de-DE, Europe/Berlin. Es wird nichts verändert oder gespeichert.
const { chromium } = require('playwright');
(async () => {
  const [url] = process.argv.slice(2);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 810 }, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
  const page = await ctx.newPage();
  const text = async () => (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ');
  const zurListe = async () => {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Übersicht', level: 1 }).waitFor();
    let kachel = page.getByRole('link', { name: /8\s*Paare/ });
    if (!(await kachel.count())) kachel = page.getByRole('button', { name: /8\s*Paare/ });
    await kachel.first().click();
    await page.waitForTimeout(500);
  };
  await zurListe();
  console.log('=== K2 Paarliste (eine Zeile je Paar)');
  for (const z of await page.evaluate(() => [...document.querySelectorAll('tr')].map((r) => r.innerText.replace(/\s+/g, ' ').trim()))) console.log(z.slice(0, 260));
  const abschnitt = (t, von, bis) => { const i = t.indexOf(von); if (i < 0) return '(nicht gefunden)'; const j = bis ? t.indexOf(bis, i) : -1; return t.slice(i, j > i ? j : i + 700); };
  for (const [name, a, b] of [['K3 TW-01 → BD-23', 'TW-01', 'BD-23'], ['K4 TW-05 → BD-22', 'TW-05', 'BD-22'], ['Paar T-03 → BD-21', 'T-03', 'BD-21']]) {
    await zurListe();
    await page.locator('tr').filter({ hasText: a }).filter({ hasText: b }).first().click();
    await page.waitForTimeout(500);
    const t = await text();
    console.log(`\n=== ${name}`);
    console.log('Nächster Schritt:', abschnitt(t, 'NÄCHSTER SCHRITT', null).slice(0, 300));
    console.log('Zeitrechnung:', abschnitt(t, 'Zeitrechnung', 'Fehlende und geschätzte Angaben').slice(0, 700));
    console.log('Fehlende und geschätzte Angaben, Prüfpunkte:', abschnitt(t, 'Fehlende und geschätzte Angaben', null).slice(0, 700));
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
