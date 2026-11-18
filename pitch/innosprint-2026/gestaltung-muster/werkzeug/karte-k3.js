// Nimmt die Ergebniskarte des Abgleichs TW-05 und BD-22 (Pitch-Stand der Plattform) für die Produktfolie auf
// und misst die Lage der Stellen, die auf der Folie markiert werden. Es wird nichts verändert oder gespeichert.
// Aufruf: node karte-fuer-folie.js <startUrl> <ausgabeordner> [breite=1000] [hoehe=800] [skalierung=3]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const [url, aus, b = '1000', h = '800', dsf = '3'] = process.argv.slice(2);
  fs.mkdirSync(aus, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: +b, height: +h }, deviceScaleFactor: +dsf, locale: 'de-DE', timezoneId: 'Europe/Berlin', colorScheme: 'light' });
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') fehler.push(m.text()); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Übersicht', level: 1 }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  const t0 = (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ');
  const startbedingung = { paare: /8 Paare/.test(t0), pruefbar: /davon 2 prüfbar/.test(t0), vorgaenge: /\b2 Vorgänge\b/.test(t0), stichtag: /Mi 18\.11\., 14:00/.test(t0), speicher: await page.evaluate(() => Object.keys(localStorage).length) };
  let k = page.getByRole('link', { name: /8\s*Paare/ }); if (!(await k.count())) k = page.getByRole('button', { name: /8\s*Paare/ });
  await k.first().click(); await page.waitForTimeout(500);
  await page.locator('tr').filter({ hasText: 'TW-01' }).filter({ hasText: 'BD-23' }).first().click(); await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  const karte = page.locator('.ergebnis-kopf');
  await karte.screenshot({ path: path.join(aus, 'karte-k3-roh.png') });
  await page.screenshot({ path: path.join(aus, 'fenster-k4.png') });
  const mess = await page.evaluate(() => {
    const karte = document.querySelector('.ergebnis-kopf'); const kr = karte.getBoundingClientRect(); const cs = getComputedStyle(karte);
    const rel = (r) => ({ x: +(r.x - kr.x).toFixed(2), y: +(r.y - kr.y).toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) });
    const bereich = (el) => { const rg = document.createRange(); rg.selectNodeContents(el); return rel(rg.getBoundingClientRect()); };
    const lis = karte.querySelectorAll('.gruende li');
    return {
      karte: { w: +kr.width.toFixed(2), h: +kr.height.toFixed(2), radius: cs.borderTopLeftRadius, rand: cs.borderTopWidth + ' ' + cs.borderTopColor, flaeche: cs.backgroundColor, seitenflaeche: getComputedStyle(document.body).backgroundColor },
      titel: bereich(karte.querySelector('#h-ab-ergebnis')), grund1: bereich(lis[0]), grund2: lis[1] ? bereich(lis[1]) : null,
      naechster: bereich(karte.querySelector('.naechster')), knopf: rel(document.querySelector('#btn-pruefbitte').getBoundingClientRect()),
      texte: { titel: karte.querySelector('#h-ab-ergebnis').innerText.trim(), grund1: lis[0].innerText.trim(), grund2: lis[1] ? lis[1].innerText.trim() : '', naechster: karte.querySelector('.naechster').innerText.replace(/\s+/g, ' ').trim(), knopf: document.querySelector('#btn-pruefbitte').innerText.trim(), gesamt: karte.innerText.replace(/\s+/g, ' ').trim() },
      knopfGesperrt: document.querySelector('#btn-pruefbitte').getAttribute('aria-disabled'),
      seitentitel: document.querySelector('main h1').innerText.replace(/\s+/g, ' ').trim(),
    };
  });
  fs.writeFileSync(path.join(aus, 'karte-k3.json'), JSON.stringify({ url, aufgenommen: new Date().toISOString(), viewport: { breite: +b, hoehe: +h, skalierung: +dsf }, startbedingung, mess, fehler }, null, 2));
  await browser.close();
  console.log(JSON.stringify({ startbedingung, fehler, karte: mess.karte, titel: mess.titel, grund1: mess.grund1, knopf: mess.knopf, texte: mess.texte }, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
