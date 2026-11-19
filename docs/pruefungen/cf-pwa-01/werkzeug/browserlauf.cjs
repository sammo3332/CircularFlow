// CF-PWA-01 · Browserlauf zu den Abnahmekriterien A2 bis A7 (Plan: docs/plan-pwa-erfassung.md).
// Aufruf vom Repository-Wurzelverzeichnis, Server läuft (python3 -m http.server 8000):
//   python3 docs/pruefungen/cf-pwa-01/werkzeug/testbild.py /tmp/testbild-tuer.jpg
//   node docs/pruefungen/cf-pwa-01/werkzeug/browserlauf.cjs /tmp/testbild-tuer.jpg [Bildordner] [Basis-URL]
// Braucht Playwright mit Chromium. Geräteprofile sind Emulation, kein echtes Gerät.
const { chromium, devices } = require('playwright');
const path = require('path');
const BILD = path.resolve(process.argv[2] || 'testbild-tuer.jpg');
const AUS = path.resolve(process.argv[3] || path.join(__dirname, '..', 'bilder'));
const URL = process.argv[4] || 'http://127.0.0.1:8000/plattform/';
let fehler = 0;
const pruefe = (ok, text) => { console.log(`${ok ? 'OK  ' : 'FEHL'} ${text}`); if (!ok) fehler += 1; };

const messung = (p) => p.evaluate(() => {
  const sichtbar = (e) => e.offsetParent !== null;
  const ziele = [...document.querySelectorAll('main button, main a.knopf, main a.knopf-zweit, main a.knopf-leise, main label.knopf, main label.knopf-zweit, main select, main input:not([type=radio]):not([type=file]):not([type=checkbox]), .kopf-mobil select, .tabbar a, main label.zustandschip, main label.gruppenkarte, main .meine-liste a')].filter(sichtbar);
  const hoehe = (e) => Math.round((e.closest('.einheit-feld') || e).getBoundingClientRect().height);
  return {
    ueberstand: document.documentElement.scrollWidth - window.innerWidth,
    unter44: ziele.filter((e) => hoehe(e) < 44).map((e) => `${e.id || e.textContent.trim().slice(0, 20)}:${hoehe(e)}`),
    schriftUnter16: [...document.querySelectorAll('main input:not([type=radio]):not([type=file]):not([type=checkbox]), main select, main textarea, .kopf-mobil select')].filter(sichtbar).filter((e) => parseFloat(getComputedStyle(e).fontSize) < 16).map((e) => `${e.id}:${getComputedStyle(e).fontSize}`),
  };
});

async function handy(b, name, profil) {
  console.log(`\n== ${name} (${profil.viewport.width} × ${profil.viewport.height}, Emulation) ==`);
  const c = await b.newContext({ ...profil });
  const p = await c.newPage();
  const konsole = []; p.on('console', (m) => { if (m.type() === 'error') konsole.push(m.text()); }); p.on('pageerror', (e) => konsole.push(e.message));
  const a4 = async (schritt) => { const m = await messung(p); pruefe(m.ueberstand <= 0 && !m.unter44.length && !m.schriftUnter16.length, `A4 ${schritt}: Überstand ${m.ueberstand} px, Ziele unter 44 px: ${JSON.stringify(m.unter44)}, Felder unter 16 px: ${JSON.stringify(m.schriftUnter16)}`); };
  const bild = (n, opt = {}) => p.screenshot({ path: path.join(AUS, `${name}-${n}.png`), ...opt });

  await p.goto(`${URL}#installieren`); await p.waitForSelector('.inst');
  const text = await p.locator('main').innerText();
  pruefe(/keine Offline-Nutzung/.test(text) && /keine Synchronisierung/.test(text), 'A3 Installationshilfe nennt „keine Offline-Nutzung“ und „keine Synchronisierung“');
  console.log(`     Erster Weg auf der Seite: ${await p.locator('.inst-weg h2').first().innerText()}`);
  await a4('Installationshilfe'); await bild('0-installieren', { fullPage: true });

  await p.goto(`${URL}#erfassung`); await p.waitForSelector('#erf-projekt');
  await a4('Schritt 1 Ort');
  await p.selectOption('#erf-projekt', 'LH'); await p.selectOption('#erf-raum', { index: 1 }); await bild('1-ort'); await p.click('#erf-weiter');
  const felder = await p.evaluate(() => ({ kamera: document.querySelector('#erf-foto')?.getAttribute('capture'), wahl: document.querySelector('#erf-foto-wahl')?.getAttribute('capture') ?? null }));
  pruefe(felder.kamera === 'environment' && felder.wahl === null, `A5 Feld mit Kamera (capture="${felder.kamera}") und Feld ohne capture (${felder.wahl})`);
  await a4('Schritt 2 Foto, leer'); await bild('2-foto-leer');
  await p.setInputFiles('#erf-foto-wahl', BILD); await p.waitForSelector('.fotofeld img');
  pruefe(true, 'A5 „Vorhandenes Bild wählen“ übernimmt das Bild');
  await p.click('[data-action="erf-foto-weg"]'); await p.waitForSelector('.fotofeld-leer');
  await p.setInputFiles('#erf-foto', BILD); await p.waitForSelector('.fotofeld img');
  pruefe(true, 'A5 „Foto aufnehmen“ übernimmt das Bild (Datei statt Kamera, Emulation)');
  await a4('Schritt 2 Foto, mit Bild'); await bild('2-foto');
  await p.click('#erf-weiter'); await p.waitForSelector('#erf-menge');
  await p.locator('label.zustandschip').nth(1).click(); await p.fill('#erf-notiz', 'Kratzer an der Bandseite');
  await a4('Schritt 3 Bauteil'); await bild('3-bauteil');
  await p.click('#erf-weiter'); await p.waitForSelector('.wertfelder');
  await p.fill('#w-breite', '860'); await p.click('#ueb-hoehe');
  await a4('Schritt 4 Angaben'); await bild('4-angaben');
  await p.click('#erf-weiter'); await p.waitForSelector('#erf-speichern');
  await a4('Schritt 5 Prüfen'); await bild('5-pruefen');
  await p.click('#erf-speichern'); await p.waitForSelector('#h-gesp');
  const titel = (await p.locator('#h-gesp').innerText()).replace(/\s+/g, ' ');
  pruefe(/ist im Bestand/.test(titel), `A6 gespeichert: „${titel}“`);
  pruefe(await p.locator('.meine-liste img.kl-bild').count() === 1, 'A6 Liste zeigt die Erfassung mit Vorschaubild');
  await a4('Gespeichert'); await bild('6-gespeichert');
  await p.click('a:has-text("Bauteilpass öffnen")'); await p.waitForSelector('.skizze img');
  await a4('Bauteilpass'); await bild('7-pass');
  const hash = await p.evaluate(() => location.hash);
  await p.reload(); await p.waitForSelector('.skizze img');
  const nach = await p.evaluate(() => ({ breite: document.querySelector('.skizze img').naturalWidth, text: document.querySelector('main').innerText }));
  pruefe(nach.breite > 0 && /860/.test(nach.text) && /Kratzer an der Bandseite/.test(nach.text), `A6 nach Neuladen von ${hash}: Foto ${nach.breite} px breit, Breite 860 und Notiz vorhanden`);
  await p.goto(`${URL}#erfassung`); await p.waitForSelector('.meine-liste');
  await p.click('.meine-liste a'); await p.waitForSelector('.skizze img');
  pruefe((await p.evaluate(() => location.hash)) === hash, 'A6 Liste „In diesem Browser gespeichert“ öffnet denselben Pass');
  const c2 = await b.newContext({ ...profil }); const p2 = await c2.newPage();
  await p2.goto(`${URL}${hash}`); await p2.waitForSelector('main');
  pruefe(/gibt es nicht/.test(await p2.locator('main').innerText()), 'Grenze bestätigt: In einem zweiten Browserprofil gibt es den Datensatz nicht (keine Synchronisierung)');
  await c2.close();
  pruefe(konsole.length === 0, `Keine Fehler in der Konsole (${JSON.stringify(konsole)})`);
  await c.close();
}

(async () => {
  const b = await chromium.launch();
  console.log(`Chromium ${b.version()} · ${URL} · ${new Date().toISOString()}`);

  console.log('\n== A2 Installierbarkeit (Chromium, Rechnerprofil) ==');
  const c = await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
  const p = await c.newPage(); const cdp = await c.newCDPSession(p);
  let angebot = false; await p.exposeFunction('cfAngebot', () => { angebot = true; });
  await p.addInitScript(() => window.addEventListener('beforeinstallprompt', () => window.cfAngebot()));
  await p.goto(`${URL}#uebersicht`); await p.waitForSelector('main h1');
  const m = await cdp.send('Page.getAppManifest');
  pruefe(Boolean(m.url) && !m.errors.length, `A2 Manifest geladen: ${m.url}, Fehler: ${JSON.stringify(m.errors)}`);
  const inst = await cdp.send('Page.getInstallabilityErrors');
  pruefe(inst.installabilityErrors.length === 0, `A2 Installationshindernisse laut Chromium: ${JSON.stringify(inst.installabilityErrors)}`);
  await p.waitForTimeout(2500);
  console.log(`     Hinweis: beforeinstallprompt im Headless-Lauf ${angebot ? 'ausgelöst' : 'nicht ausgelöst (der Installationsdialog selbst ist hier nicht prüfbar)'}`);
  console.log(`     Service Worker registriert: ${await p.evaluate(() => navigator.serviceWorker.getRegistrations().then((r) => r.length))} (erwartet 0, keine Offline-Nutzung)`);
  pruefe((await p.evaluate(() => [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')].map((l) => l.href))).length === 3, 'Icons im Seitenkopf verlinkt');
  for (const d of ['manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskierbar-512.png', 'icons/apple-touch-icon.png', 'icons/icon.svg']) { const r = await p.request.get(URL + d); pruefe(r.ok(), `${d} wird ausgeliefert (${r.status()}, ${r.headers()['content-type']})`); }

  console.log('\n== A7 Rechner 1280 × 720 ==');
  const konsole = []; p.on('console', (x) => { if (x.type() === 'error') konsole.push(x.text()); });
  const breit = async (was) => { const u = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); pruefe(u <= 0, `A7 ${was}: Überstand ${u} px`); };
  await breit('Übersicht');
  pruefe(await p.locator('.rail').isVisible() && !(await p.locator('.tabbar').isVisible()), 'A7 Seitenleiste sichtbar, Tableiste aus');
  pruefe((await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ziel').trim())) === '40px', 'A7 Rechner behält die bisherige Zielhöhe 40 px');
  await p.goto(`${URL}#abgleich`); await p.waitForSelector('main h1');
  await p.click('tr:has-text("TW-05"):has-text("BD-22")'); await p.waitForSelector('main h1'); await p.waitForTimeout(200);
  await breit('Abgleich TW-05 → BD-22');
  pruefe(/Weiter prüfen/.test(await p.locator('main').innerText()), 'A7 Abgleich TW-05 → BD-22 zeigt „Weiter prüfen“');
  await p.screenshot({ path: path.join(AUS, 'rechner-1-abgleich.png') });
  await p.click('button:has-text("Prüfbitte anlegen")'); await p.waitForSelector('main h1'); await p.waitForTimeout(200);
  await breit('Entscheidungsseite nach „Prüfbitte anlegen“');
  pruefe(/Prüfbitte gestellt/.test(await p.locator('main').innerText()), 'A7 Entscheidungsseite zeigt „Prüfbitte gestellt“');
  await p.screenshot({ path: path.join(AUS, 'rechner-2-entscheidung.png') });
  await p.goto(`${URL}#installieren`); await p.waitForSelector('.inst'); await breit('Installationshilfe');
  console.log(`     Erster Weg auf der Seite: ${await p.locator('.inst-weg h2').first().innerText()}`);
  await p.screenshot({ path: path.join(AUS, 'rechner-3-installieren.png'), fullPage: true });
  await p.goto(`${URL}#erfassung`); await p.waitForSelector('#erf-projekt'); await breit('Erfassung');
  pruefe(konsole.length === 0, `Keine Fehler in der Konsole (${JSON.stringify(konsole)})`);
  await c.close();

  await handy(b, 'android', devices['Pixel 7']);
  await handy(b, 'iphone', devices['iPhone 13']);
  await b.close();
  console.log(`\n${fehler ? `${fehler} Prüfung(en) fehlgeschlagen` : 'Alle Prüfungen bestanden'}`);
  process.exit(fehler ? 1 : 0);
})();
