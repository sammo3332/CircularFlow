// Prüft die Plattform gegen einen reinen statischen Server (wie beim Hosting aus dem Repository, ohne Pilotserver):
// Texterkennung mit den im Repository liegenden Engine-Dateien, Manifest/Installierbarkeit, keine Konsolenfehler, Pilotraum-Seite ohne Server.
// Aufruf: python3 -m http.server 8030 (vom Wurzelverzeichnis) und dann node docs/pruefungen/pilotstand-2026-11-19/werkzeug/statisch-pruefen.mjs [Basis-URL]
import path from 'node:path';
import { createRequire } from 'node:module';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const WURZEL = path.resolve(path.dirname(new globalThis.URL(import.meta.url).pathname), '..', '..', '..', '..');
const BASIS = process.argv[2] || 'http://127.0.0.1:8030/plattform/';
let fehler = 0; const pruefe = (ok, t) => { console.log(`${ok ? 'OK  ' : 'FEHL'} ${t}`); if (!ok) fehler += 1; };
const b = await chromium.launch();
for (const [name, profil] of [['rechner', { viewport: { width: 1280, height: 800 } }], ['handy', devices['Pixel 7']]]) {
  const c = await b.newContext(profil); const p = await c.newPage(); const k = []; const geladen = [];
  p.on('console', (m) => { if (m.type() === 'error') k.push(m.text()); }); p.on('pageerror', (e) => k.push(e.message));
  p.on('response', (r) => { if (/vendor\//.test(r.url())) geladen.push(`${r.status()} ${r.url().split('/vendor/')[1]}`); });
  await p.goto(`${BASIS}#erfassung`); await p.waitForSelector('#erf-projekt');
  await p.selectOption('#erf-projekt', 'LH'); await p.selectOption('#erf-raum', { index: 1 }); await p.click('#erf-weiter'); await p.waitForSelector('#erf-etikett-wahl');
  const t0 = Date.now(); await p.setInputFiles('#erf-etikett-wahl', path.join(WURZEL, 'plattform/etikett-versuch/fixtures/testetikett-deutsch.png'));
  await p.waitForSelector('#etikett-ergebnis, #etikett-fehler', { timeout: 120000 });
  const erg = await p.locator('#etikett-ergebnis').count() ? await p.locator('#etikett-ergebnis').innerText() : `FEHLER: ${await p.locator('#etikett-fehler').innerText()}`;
  pruefe(/4 von 4/.test(erg), `${name}: Texterkennung mit den Repository-Dateien (${((Date.now() - t0) / 1000).toFixed(1)} s): ${erg.replace(/\s+/g, ' ').slice(0, 70)}`);
  console.log(`     geladen: ${geladen.join(', ')}`);
  pruefe(geladen.every((g) => g.startsWith('200')), `${name}: alle Engine-Dateien ausgeliefert`);
  if (name === 'rechner') {
    const cdp = await c.newCDPSession(p);
    const m = await cdp.send('Page.getAppManifest'); pruefe(Boolean(m.url) && !m.errors.length, `Manifest geladen (${m.url}), Fehler: ${JSON.stringify(m.errors)}`);
    const inst = await cdp.send('Page.getInstallabilityErrors'); pruefe(inst.installabilityErrors.length === 0, `Installationshindernisse laut Chromium: ${JSON.stringify(inst.installabilityErrors)}`);
    await p.goto(`${BASIS}#pilotraum`); await p.waitForSelector('#pr-schluessel');
    await p.fill('#pr-schluessel', 'x'.repeat(24)); await p.click('#pr-verbinden'); await p.waitForSelector('#form-pilotraum .feld-meldung', { timeout: 15000 });
    pruefe(/kein Pilotserver|nicht erreichbar/.test(await p.locator('#form-pilotraum').innerText()), `Ohne Pilotserver: verständliche Meldung statt Absturz („${(await p.locator('#form-pilotraum .feld-meldung').innerText()).slice(0, 60)}“)`);
  }
  const echte = k.filter((x) => !/api\/raum|404/.test(x)); // der erwartete 404 der Pilotraum-Abfrage ohne Server zählt nicht
  pruefe(echte.length === 0, `${name}: keine Konsolenfehler (${JSON.stringify(echte)})`);
  await c.close();
}
await b.close();
console.log(fehler ? `${fehler} Prüfung(en) fehlgeschlagen` : 'Alle Prüfungen bestanden'); process.exit(fehler ? 1 : 0);
