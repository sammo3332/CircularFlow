// Prüft die Standarddemo in einem frischen Browserkontext und sichert Bilder.
// Aufruf: node demo-pruefung.js <startUrl> <ausgabeordner> <bezeichnung>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const [startUrl, aus, name] = process.argv.slice(2);
fs.mkdirSync(aus, { recursive: true });
const erg = { name, startUrl, pruefungen: [], fehler: [], netz: [] };
const ok = (titel, soll, ist, gut) => { erg.pruefungen.push({ titel, soll, ist, ok: Boolean(gut) }); };
const enthaelt = (text, teil) => text.replace(/\s+/g, ' ').includes(teil);

(async () => {
  const browser = await chromium.launch();
  // frischer Kontext = leerer Speicher, wie ein neues Browserprofil
  const kontext = await browser.newContext({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: 1.5, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
  const page = await kontext.newPage();
  page.on('pageerror', (e) => erg.fehler.push('pageerror: ' + String(e)));
  page.on('console', (m) => { if (m.type() === 'error') erg.fehler.push('console: ' + m.text()); });
  page.on('requestfailed', (r) => erg.netz.push(`${r.url().slice(0, 100)} (${r.failure()?.errorText})`));

  const text = async () => (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ');
  const bild = async (datei, clip) => page.screenshot({ path: path.join(aus, datei), ...(clip ? { clip } : {}) });
  const keinSeitlichesScrollen = async () => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);

  await page.goto(startUrl, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Übersicht', level: 1 }).waitFor({ timeout: 15000 });
  const speicher = await page.evaluate(() => ({ ls: Object.keys(localStorage).length, ss: Object.keys(sessionStorage).length }));
  ok('Frischer Kontext: nichts gespeichert', { ls: 0, ss: 0 }, speicher, speicher.ls === 0 && speicher.ss === 0);

  // Startbedingung
  let t = await text();
  ok('Seitentitel', 'enthält CircularFlow', await page.title(), (await page.title()).includes('CircularFlow'));
  ok('Stichtag der Demo', 'Mi 18.11., 14:00 (Simulation)', (t.match(/Stichtag der Demo:? ?\(?[^)]*\)?[^A-Z]{0,40}/) || [''])[0], enthaelt(t, 'Mi 18.11., 14:00 (Simulation)'));
  ok('Kachel „Paare derselben Gruppe“: 8 Paare, davon 2 prüfbar', '8 Paare davon 2 prüfbar', (t.match(/\b\d+ Paare davon \d+ prüfbar/) || [null])[0], /\b8 Paare davon 2 prüfbar/.test(t));
  ok('Kachel „Vorgänge je Status“: 2 Vorgänge', '2 Vorgänge', (t.match(/\b\d+ Vorgänge?\b/) || [null])[0], /\b2 Vorgänge\b/.test(t));
  ok('Zeitkritisch (7 Tage) mit 4 Fristen', '4 Fristen', (t.match(/\d+ Fristen/) || [null])[0], enthaelt(t, 'Zeitkritisch (7 Tage)') && /\b4 Fristen\b/.test(t));
  const zk = t.slice(t.indexOf('Zeitkritisch (7 Tage)'), t.indexOf('Bald verfügbar'));
  ok('Zeitkritisch: oben „noch 2 Std.“ Aufmaßfrist E-01 T-07 → B-02', 'noch 2 Std. Aufmaßfrist · E-01 · T-07 → B-02', zk.slice(0, 200), /noch 2 Std\. Aufmaßfrist · E-01 · T-07 → B-02/.test(zk));
  ok('Kein seitliches Scrollen (Übersicht, 1440 px)', true, await keinSeitlichesScrollen(), await keinSeitlichesScrollen());
  await bild('01-start-uebersicht.png');

  // Fehlendes Aufmaß: Eintrag öffnen
  await page.getByText(/Aufmaßfrist/).first().click();
  await page.waitForTimeout(500);
  t = await text();
  ok('Eintrag E-01 zeigt fehlendes Aufmaß', 'Aufmaß', (t.match(/[^.]{0,80}(Aufmaß|Maß)[^.]{0,120}\./) || [null])[0], /Aufmaß/.test(t) && /(fehlt|offen|noch kein|nicht)/i.test(t.slice(t.indexOf('Aufmaß'), t.indexOf('Aufmaß') + 400)));
  erg.e01_auszug = t.slice(t.indexOf('Aufmaß') - 40, t.indexOf('Aufmaß') + 360);
  await bild('01b-e01-aufmass.png');
  await page.goto(startUrl, { waitUntil: 'networkidle' });

  // K2 Paarliste
  let kachel = page.getByRole('link', { name: /8\s*Paare/ });
  if (!(await kachel.count())) kachel = page.getByRole('button', { name: /8\s*Paare/ });
  await kachel.first().click();
  await page.waitForTimeout(500);
  t = await text();
  ok('K2 Paarliste: 8 Paare, davon 2 prüfbar', '8 Paare derselben Gruppe, davon 2 prüfbar', (t.match(/\d+ Paare derselben Gruppe, davon \d+ prüfbar/) || [null])[0], /8 Paare derselben Gruppe, davon 2 prüfbar/.test(t));
  ok('K2 Paarliste enthält TW-01 → BD-23 und TW-05 → BD-22', true, null, (await page.locator('tr').filter({ hasText: 'TW-01' }).filter({ hasText: 'BD-23' }).count()) === 1 && (await page.locator('tr').filter({ hasText: 'TW-05' }).filter({ hasText: 'BD-22' }).count()) === 1);
  await bild('02-k2-paarliste.png');

  // K3 fünf Tage zu spät, Prüfbitte gesperrt
  await page.locator('tr').filter({ hasText: 'TW-01' }).filter({ hasText: 'BD-23' }).first().click();
  await page.waitForTimeout(600);
  t = await text();
  ok('K3 Ergebnis „Für diese Entscheidung zu spät“', 'Für diese Entscheidung zu spät', null, enthaelt(t, 'TW-01 und BD-23: Für diese Entscheidung zu spät'));
  ok('K3 fünf Tage zu spät (Prüfende 02.12.2026, Bestellfrist 27.11.2026)', 'Prüfende 02.12.2026 liegt 5 Tage nach der Bestellfrist 27.11.2026', (t.match(/Prüfende [\d.]+ liegt \d+ Tage? nach der Bestellfrist [\d.]+/) || [null])[0], enthaelt(t, 'Prüfende 02.12.2026 liegt 5 Tage nach der Bestellfrist 27.11.2026'));
  ok('K3 „Vorschlag zur Prüfung, keine fachliche Freigabe“', true, null, enthaelt(t, 'Vorschlag zur Prüfung, keine fachliche Freigabe'));
  const knopf = page.locator('#btn-pruefbitte');
  ok('K3 Knopf „Prüfbitte anlegen“ ist gesperrt (aria-disabled)', 'true', await knopf.getAttribute('aria-disabled'), (await knopf.getAttribute('aria-disabled')) === 'true');
  ok('K3 Sperrgrund sichtbar („Gesperrt.“)', 'Gesperrt. Für diese Entscheidung zu spät: Prüfende 02.12.2026 liegt 5 Tage nach der Bestellfrist 27.11.2026', (t.match(/Gesperrt\.[^.]*\.[^.]*\./) || [null])[0], /Gesperrt\. Für diese Entscheidung zu spät/.test(t));
  await bild('03-k3-zu-spaet.png');
  const ergebnis = await page.locator('.ergebnis-kopf').first().boundingBox();
  if (ergebnis) await bild('03b-k3-ergebnisblock.png', { x: Math.max(0, ergebnis.x - 8), y: Math.max(0, ergebnis.y - 8), width: Math.min(1440, ergebnis.width + 16), height: Math.min(810 - Math.max(0, ergebnis.y - 8), ergebnis.height + 16) });
  // Klick auf den gesperrten Knopf legt nichts an
  await knopf.click({ force: true }); // aria-disabled: ein Nutzer kann klicken, Playwright prüft sonst die Bedienbarkeit
  await page.waitForTimeout(500);
  t = await text();
  ok('K3 Klick auf gesperrten Knopf: Seite bleibt, kein Vorgang angelegt', 'Seite bleibt beim Paar TW-01 / BD-23', page.url().split('#')[1], page.url().includes('abgleich-lh-tw-01--sb-bd-23') && !/Vorgang angelegt|Prüfbitte angelegt/.test(t));

  // zurück über den Pfad
  await page.getByRole('link', { name: 'Paare derselben Gruppe' }).first().click();
  await page.waitForTimeout(500);
  ok('Zurück zu „Paare derselben Gruppe“ über den Pfad', '#abgleich', page.url().split('#')[1], /#abgleich$/.test(page.url()));

  // K4 Weiter prüfen
  await page.locator('tr').filter({ hasText: 'TW-05' }).filter({ hasText: 'BD-22' }).first().click();
  await page.waitForTimeout(600);
  t = await text();
  ok('K4 Ergebnis „Weiter prüfen“', 'TW-05 und BD-22: Weiter prüfen', null, enthaelt(t, 'TW-05 und BD-22: Weiter prüfen'));
  ok('K4 „Vorschlag zur Prüfung, keine fachliche Freigabe“', true, null, enthaelt(t, 'Vorschlag zur Prüfung, keine fachliche Freigabe'));
  ok('K4 Prüfende 28.11.2026 liegt 123 Tage vor der Bestellfrist 31.03.2027', 'Prüfende 28.11.2026 liegt 123 Tage vor der Bestellfrist 31.03.2027', (t.match(/Prüfende [\d.]+ liegt \d+ Tage? vor der Bestellfrist [\d.]+/) || [null])[0], enthaelt(t, 'Prüfende 28.11.2026 liegt 123 Tage vor der Bestellfrist 31.03.2027'));
  const knopf2 = page.locator('#btn-pruefbitte');
  ok('K4 Knopf „Prüfbitte anlegen“ ist nicht gesperrt (nicht angeklickt)', null, await knopf2.getAttribute('aria-disabled'), (await knopf2.getAttribute('aria-disabled')) === null);
  await bild('04-k4-weiter-pruefen.png');
  const ergebnis2 = await page.locator('.ergebnis-kopf').first().boundingBox();
  if (ergebnis2) await bild('04b-k4-ergebnisblock.png', { x: Math.max(0, ergebnis2.x - 8), y: Math.max(0, ergebnis2.y - 8), width: Math.min(1440, ergebnis2.width + 16), height: Math.min(810 - Math.max(0, ergebnis2.y - 8), ergebnis2.height + 16) });

  // Zustand unverändert: Übersicht zeigt wieder 2 Vorgänge
  await page.goto(startUrl, { waitUntil: 'networkidle' });
  t = await text();
  ok('Nach dem Durchlauf unverändert: 8 Paare, davon 2 prüfbar, 2 Vorgänge', '8 Paare davon 2 prüfbar · 2 Vorgänge', null, /\b8 Paare davon 2 prüfbar/.test(t) && /\b2 Vorgänge\b/.test(t));

  // Mindestgröße 1280 × 720: kein seitliches Scrollen auf den vier Ansichten
  await page.setViewportSize({ width: 1280, height: 720 });
  const ansichten = { Übersicht: '', Paarliste: '#abgleich', 'K3 TW-01 → BD-23': '#abgleich-lh-tw-01--sb-bd-23', 'K4 TW-05 → BD-22': '#abgleich-kb-tw-05--sb-bd-22' };
  const basis = startUrl.split('#')[0];
  for (const [n, h] of Object.entries(ansichten)) {
    await page.goto(basis + h, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    ok(`Kein seitliches Scrollen bei 1280 × 720: ${n}`, true, await keinSeitlichesScrollen(), await keinSeitlichesScrollen());
  }

  ok('Keine Konsolen- oder Seitenfehler', [], erg.fehler, erg.fehler.length === 0);
  await kontext.close();
  await browser.close();
  erg.alle_ok = erg.pruefungen.every((p) => p.ok);
  fs.writeFileSync(path.join(aus, 'ergebnis.json'), JSON.stringify(erg, null, 1));
  for (const p of erg.pruefungen) console.log((p.ok ? 'OK     ' : 'FEHLER ') + p.titel + (p.ok ? '' : ` | soll ${JSON.stringify(p.soll)} | ist ${JSON.stringify(p.ist)}`));
  console.log('Netzfehler (informativ):', erg.netz.length ? erg.netz : 'keine');
  console.log(erg.alle_ok ? `ALLES OK (${name})` : `ABWEICHUNGEN (${name})`);
})().catch((e) => { console.error('SKRIPTFEHLER', e.message); process.exit(1); });
