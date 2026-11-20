// Abnahme der fünf Kriterien aus dem Veröffentlichungsauftrag (20.11.2026) gegen eine beliebige Basis-Adresse:
// 1 Website ohne 404, 2 Bauteilpass sichtbar, 3 Angebots- und Bedarfsdaten sichtbar, 4 Zeitprüfung mit Beispieldaten,
// 5 keine echten Nachrichten oder Prüfaufträge (nur gleiche Herkunft, nur GET/HEAD, Simulationshinweise).
// Aufruf: node docs/pruefungen/vercel-2026-11-20/werkzeug/abnahme.mjs <Basis-URL der Plattform> <Bilderordner> [Kennung]
// Beispiel lokal: python3 -m http.server 8030 (im sauberen Export) und
//   node docs/pruefungen/vercel-2026-11-20/werkzeug/abnahme.mjs http://127.0.0.1:8030/plattform/ docs/pruefungen/vercel-2026-11-20/bilder lokal
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const { chromium, devices } = createRequire(import.meta.url)('playwright');

const BASIS = process.argv[2] || 'http://127.0.0.1:8030/plattform/';
const BILDER = process.argv[3] || 'docs/pruefungen/vercel-2026-11-20/bilder';
const KENNUNG = process.argv[4] || 'lauf';
const URSPRUNG = new globalThis.URL(BASIS).origin;
const LOKAL = /^(127\.0\.0\.1|localhost)$/.test(new globalThis.URL(BASIS).hostname);
fs.mkdirSync(BILDER, { recursive: true });

let fehler = 0;
const pruefe = (ok, t) => { console.log(`${ok ? 'OK  ' : 'FEHL'} ${t}`); if (!ok) fehler += 1; };
const text = async (p, sel) => (sel ? p.locator(sel).first().innerText() : p.locator('body').innerText());
const bild = (p, name) => p.screenshot({ path: path.join(BILDER, `${KENNUNG}-${name}.png`), fullPage: true });

console.log(`Basis: ${BASIS}  (${LOKAL ? 'lokal' : 'gehostet'})`);
const b = await chromium.launch();
const c = await b.newContext({ ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } });
const p = await c.newPage();
const anfragen = []; const konsole = [];
p.on('request', (r) => anfragen.push({ method: r.method(), url: r.url() }));
p.on('console', (m) => { if (m.type() === 'error') konsole.push(m.text()); });
p.on('pageerror', (e) => konsole.push(e.message));

// 1 Website öffnet ohne 404
console.log('\n== 1 Website ohne 404 ==');
if (!LOKAL) {
  const r0 = await c.request.get(`${URSPRUNG}/`, { maxRedirects: 0 });
  pruefe([301, 302, 307, 308].includes(r0.status()) && /\/plattform\/?$/.test(r0.headers()['location'] || ''), `/ leitet um (${r0.status()} → ${r0.headers()['location']})`);
}
const r1 = await c.request.get(BASIS);
pruefe(r1.status() === 200, `${BASIS} antwortet ${r1.status()}`);
const r2 = await c.request.get(`${BASIS}manifest.webmanifest`);
pruefe(r2.status() === 200, `Manifest antwortet ${r2.status()}`);
await p.goto(`${BASIS}#uebersicht`); await p.waitForSelector('main h1');
pruefe(!/NOT_FOUND|could not be found/i.test(await text(p)), `Übersicht gerendert: „${(await text(p, 'main h1')).slice(0, 60)}“`);
await p.goto(`${BASIS}#gibt-es-nicht`); await p.waitForFunction(() => (document.querySelector('main')?.innerText || '').trim().length > 0);
const fehltText = (await text(p, 'main')).replace(/\s+/g, ' ');
pruefe(!/NOT_FOUND|could not be found/i.test(fehltText) && /nicht|fehlt|unbekannt/i.test(fehltText), `Unbekannte Unterseite zeigt die Hinweisseite der App, nicht den 404 des Hosters („${fehltText.slice(0, 90)}“)`);
await bild(p, '1-uebersicht');

// 2 Bauteilpass wird angezeigt
console.log('\n== 2 Bauteilpass ==');
await p.goto(`${BASIS}#bauteile`); await p.waitForSelector('main h1');
const passLinks = p.locator('a[href^="#pass-"]');
const nPass = await passLinks.count();
pruefe(nPass > 0, `Bauteilkatalog verweist auf ${nPass} Bauteilpässe`);
await passLinks.first().click(); await p.waitForSelector('#angebot');
const passText = (await text(p, 'main')).replace(/\s+/g, ' ');
const passH1 = (await text(p, 'main h1')).replace(/\s+/g, ' ');
pruefe((await p.locator('#angebot').count()) === 1 && /\b(T|TW|DB|BD)-\d\d\b/.test(passH1) && /Zuletzt geändert|Herkunft|Angebot/.test(passText), `Bauteilpass geöffnet (${await p.evaluate(() => location.hash)}): „${passH1.slice(0, 70)}“, Angebotsblock vorhanden`);
await bild(p, '2-bauteilpass');

// 3 Angebots- und Bedarfsdaten sichtbar
console.log('\n== 3 Angebote und Bedarfe ==');
await p.goto(`${BASIS}#bedarfe`); await p.waitForSelector('main h1');
const nBed = await p.locator('main tbody tr').count();
pruefe(nBed > 0 && /BD-\d/.test(await text(p, 'main')), `Bedarfe: ${nBed} Zeilen mit Kennungen BD-…`);
await bild(p, '3-bedarfe');
await p.goto(`${BASIS}#bauteile`); await p.waitForSelector('main h1');
const nBau = await p.locator('main a[href^="#pass-"]').count();
const bauText = (await text(p, 'main')).replace(/\s+/g, ' ');
pruefe(nBau > 0 && /Angebot|angeboten/i.test(bauText), `Bauteile/Angebote: ${nBau} Bauteile im Katalog, Angebotsangaben sichtbar („${bauText.slice(0, 80)}“)`);
await bild(p, '3-bauteile');
await p.goto(`${BASIS}#abgleich`); await p.waitForSelector('main h1');
const nAb = await p.locator('main tbody tr').count();
pruefe(nAb > 0 && /TW-01/.test(await text(p, 'main')) && /BD-23/.test(await text(p, 'main')), `Abgleichliste: ${nAb} Paarungen Angebot ↔ Bedarf (Beispieldaten)`);
await bild(p, '3-abgleich');

// 4 Zeitprüfung mit Beispieldaten
console.log('\n== 4 Zeitprüfung ==');
await p.click('tr:has-text("TW-01"):has-text("BD-23")'); await p.waitForSelector('#h-ab-ergebnis');
pruefe(/zu spät/.test(await text(p, '#h-ab-ergebnis')) && (await p.locator('#btn-pruefbitte[aria-disabled="true"]').count()) === 1, `TW-01 → BD-23: „${(await text(p, '#h-ab-ergebnis')).slice(0, 60)}“, Prüfbitte gesperrt`);
await bild(p, '4-zeitpruefung-zu-spaet');
await p.goto(`${BASIS}#abgleich`); await p.waitForSelector('main h1');
await p.click('tr:has-text("TW-05"):has-text("BD-22")'); await p.waitForSelector('#h-ab-ergebnis');
const abText = await text(p);
pruefe(/Weiter prüfen/.test(await text(p, '#h-ab-ergebnis')) && /regelbasiert/.test(abText), `TW-05 → BD-22: „${(await text(p, '#h-ab-ergebnis')).slice(0, 60)}“, als regelbasiert gekennzeichnet`);
await bild(p, '4-zeitpruefung-weiter');
const entscheidungsHash = `#entscheidung-${encodeURIComponent('lh')}-${encodeURIComponent('e-01')}`;
await p.goto(`${BASIS}${entscheidungsHash}`); await p.waitForSelector('main h1');
const hatKnopf = (await p.locator('#btn-aufmass-beispiel').count()) === 1;
pruefe(hatKnopf || /rechtzeitig eingegangen/.test(await text(p)), `Türdemo E-01 (T-07 → B-02) geladen: „${(await text(p, 'main h1')).slice(0, 70)}“`);
if (hatKnopf) {
  await p.click('#btn-aufmass-beispiel'); await p.waitForSelector('#aufmass-eingang');
  const eingang = await text(p, '#aufmass-eingang');
  pruefe(/rechtzeitig eingegangen/.test(eingang) && /vor der Frist/.test(eingang), `Beispielaufmaß: „${eingang.replace(/\s+/g, ' ').slice(0, 110)}“`);
}
await bild(p, '4-tuerdemo-aufmass');

// 5 Keine echten Nachrichten oder Prüfaufträge
console.log('\n== 5 Keine echten Nachrichten ==');
await p.goto(`${BASIS}#abgleich`); await p.waitForSelector('main h1');
await p.click('tr:has-text("TW-05"):has-text("BD-22")'); await p.waitForSelector('#btn-pruefbitte');
await p.click('#btn-pruefbitte');
await p.waitForFunction(() => /Prüfbitte angelegt/.test(document.body.innerText), null, { timeout: 10000 });
pruefe(/nichts wird versendet/.test(await text(p)), 'Prüfbitte angelegt: als Simulation gekennzeichnet („nichts wird versendet“)');
await bild(p, '5-pruefbitte-simulation');
const fremd = anfragen.filter((a) => !a.url.startsWith(URSPRUNG) && !a.url.startsWith('data:') && !a.url.startsWith('blob:'));
pruefe(fremd.length === 0, `Keine Anfragen an fremde Adressen (${anfragen.length} Anfragen, alle an ${URSPRUNG})${fremd.length ? ': ' + fremd.map((a) => a.url).join(', ') : ''}`);
const schreibend = anfragen.filter((a) => !['GET', 'HEAD'].includes(a.method));
pruefe(schreibend.length === 0, `Keine schreibenden Anfragen (POST/PUT/…) während des Laufs${schreibend.length ? ': ' + schreibend.map((a) => `${a.method} ${a.url}`).join(', ') : ''}`);
const echte = konsole.filter((x) => !/api\/raum|404/.test(x));
pruefe(echte.length === 0, `Keine Konsolenfehler (${JSON.stringify(echte).slice(0, 300)})`);

await c.close(); await b.close();
console.log(`\n${fehler ? `${fehler} Prüfung(en) fehlgeschlagen` : 'Alle Prüfungen bestanden'} · Basis ${BASIS}`);
process.exit(fehler ? 1 : 0);
