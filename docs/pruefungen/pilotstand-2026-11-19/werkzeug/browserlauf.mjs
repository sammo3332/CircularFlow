// Pilotstand 19.11.2026 · Browserlauf gegen den Pilotserver: echte Texterkennung, Korrektur und Bestätigung, Speichern und Neuladen,
// Fehlerfälle, Interesse, Anfrage mit Dienstleister und Verlauf, Angebot bearbeiten, Verkauf und Provision, Datei sichern/laden,
// zwei getrennte Sitzungen im Pilotraum, fremder Raum, Leseschlüssel, Handy-Emulation.
// Aufruf vom Repository-Wurzelverzeichnis: node docs/pruefungen/pilotstand-2026-11-19/werkzeug/browserlauf.mjs <Testdatenordner> [Bildordner] [Port]
// Testdaten: testbild-tuer.jpg, kaputt.png, notiz.txt, rauschen.png (siehe testdaten.py). Braucht Playwright mit Chromium. Emulation, kein echtes Gerät.
import path from 'node:path';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { raumAnlegen } from '../../../../plattform/server/pilotserver.mjs';
const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');

const WURZEL = path.resolve(path.dirname(new globalThis.URL(import.meta.url).pathname), '..', '..', '..', '..');
const TEST = path.resolve(process.argv[2] || 'testdaten');
const AUS = path.resolve(process.argv[3] || path.join(WURZEL, 'docs/pruefungen/pilotstand-2026-11-19/bilder'));
const PORT = Number(process.argv[4] || 8010);
const BASIS = `http://127.0.0.1:${PORT}/plattform/`;
const FIX = path.join(WURZEL, 'plattform/etikett-versuch/fixtures');
const DATEN = path.join(TEST, 'pilotserver-daten');
let fehler = 0; const zeiten = {};
const pruefe = (ok, text) => { console.log(`${ok ? 'OK  ' : 'FEHL'} ${text}`); if (!ok) fehler += 1; };
const text = async (p, sel = 'main') => (await p.locator(sel).innerText()).replace(/\s+/g, ' ');
const bild = (p, name, opt = {}) => p.screenshot({ path: path.join(AUS, `${name}.png`), ...opt });
const konsole = (p, liste) => { p.on('console', (m) => { if (m.type() === 'error') liste.push(m.text()); }); p.on('pageerror', (e) => liste.push(e.message)); };

async function erfassungMitOcr(p, name, { etikett = path.join(FIX, 'testetikett.png'), korrektur = true } = {}) {
  await p.goto(`${BASIS}#erfassung`); await p.waitForSelector('#erf-projekt');
  await p.selectOption('#erf-projekt', 'LH'); await p.selectOption('#erf-raum', { index: 1 }); await p.click('#erf-weiter'); await p.waitForSelector('#erf-foto-wahl');
  await p.setInputFiles('#erf-foto-wahl', path.join(TEST, 'testbild-tuer.jpg')); await p.waitForSelector('.fotofeld img');
  const t0 = Date.now();
  await p.setInputFiles('#erf-etikett-wahl', etikett);
  await p.waitForSelector('#etikett-lauf', { timeout: 10000 }).catch(() => {});
  const lauf = await p.locator('#etikett-fortschritt').innerText().catch(() => '');
  await p.waitForSelector('#etikett-ergebnis', { timeout: 120000 });
  zeiten[name] = Date.now() - t0;
  const erg = await text(p, '#etikett-ergebnis');
  pruefe(/Texterkennung fertig: 4 von 4/.test(erg), `${name}: echte Texterkennung im Browser (${(zeiten[name] / 1000).toFixed(1)} s, Fortschrittsanzeige „${lauf}“) · „${erg.slice(0, 90)}“`);
  pruefe(await p.locator('#erf-weiter[disabled]').count() === 0, `${name}: Weiter ist nach der Texterkennung wieder frei`);
  await bild(p, `${name}-2-etikett-gelesen`);
  await p.click('#erf-weiter'); await p.waitForSelector('#erf-menge');
  await p.click('label.gruppenkarte:has(input[value="tuer"])'); await p.fill('#erf-menge', '1');
  const werte = await p.evaluate(() => ({ h: document.querySelector('#etikett-hersteller').value, m: document.querySelector('#etikett-modell').value, s: document.querySelector('#etikett-seriennummer').value, b: document.querySelector('#etikett-baujahr').value, foto: Boolean(document.querySelector('.etikett-bild img')) }));
  pruefe(werte.h === 'MUSTERWERK' && werte.m === 'TUER-17' && werte.s === 'CF-2026-001' && werte.b === '2020' && werte.foto, `${name}: vier Felder neben dem Etikettfoto vorgeschlagen (${werte.h}, ${werte.m}, ${werte.s}, ${werte.b})`);
  if (korrektur) {
    await p.check('[data-etikett-check="modell"]');
    await p.fill('#etikett-modell', 'TUER-17-KORR');
    pruefe(!(await p.isChecked('[data-etikett-check="modell"]')), `${name}: Korrektur hebt die Bestätigung auf (erneute Bestätigung nötig)`);
  }
  await bild(p, `${name}-3-pruefen`);
  await p.click('#erf-weiter'); await p.waitForSelector('.wertfelder'); await p.fill('#w-breite', '860');
  await p.click('#erf-weiter'); await p.waitForSelector('#erf-speichern');
  await p.click('#erf-speichern'); await p.waitForSelector('#erf-fehler');
  pruefe(/bestätigen/.test(await text(p, '#erf-fehler')), `${name}: Speichern ohne Bestätigung ist gesperrt („${(await text(p, '#erf-fehler')).slice(0, 80)}“)`);
  await bild(p, `${name}-5-gesperrt`);
  for (const k of ['hersteller', 'modell', 'seriennummer', 'baujahr']) await p.check(`[data-etikett-check="${k}"]`);
  await p.click('#erf-speichern'); await p.waitForSelector('#h-gesp');
  const titel = await text(p, '#h-gesp');
  pruefe(/ist im Bestand/.test(titel), `${name}: gespeichert („${titel}“)`);
  await bild(p, `${name}-6-gespeichert`);
  await p.click('a:has-text("Bauteilpass öffnen")'); await p.waitForSelector('.skizze img');
  const hash = await p.evaluate(() => location.hash);
  const pass = await text(p);
  pruefe(/MUSTERWERK/.test(pass) && /ausgelesen \(Texterkennung\), am Foto bestätigt/.test(pass) && (!korrektur || (/TUER-17-KORR/.test(pass) && /manuell eingegeben, am Foto bestätigt/.test(pass))), `${name}: Bauteilpass zeigt Typenschild mit Herkunft je Angabe`);
  pruefe(/Zuletzt geändert/.test(pass) && /Kein Aufmaß und keine Fachfreigabe/.test(pass), `${name}: Bauteilpass nennt letzte Änderung und Grenze (kein Aufmaß, keine Fachfreigabe)`);
  await p.reload(); await p.waitForSelector('.skizze img');
  const nach = await text(p);
  pruefe(/MUSTERWERK/.test(nach) && /860/.test(nach) && (!korrektur || /TUER-17-KORR/.test(nach)), `${name}: nach Neuladen von ${hash} bleiben Typenschild, Maß und Foto erhalten`);
  await bild(p, `${name}-7-pass`, { fullPage: true });
  return hash;
}

async function fehlerfaelle(p) {
  await p.goto(`${BASIS}#erfassung`); await p.waitForSelector('#erf-projekt');
  await p.selectOption('#erf-projekt', 'LH'); await p.selectOption('#erf-raum', { index: 1 }); await p.click('#erf-weiter'); await p.waitForSelector('#erf-etikett-wahl');
  await p.setInputFiles('#erf-etikett-wahl', path.join(TEST, 'notiz.txt')); await p.waitForSelector('#etikett-fehler');
  pruefe(/JPEG-, PNG- oder WebP/.test(await text(p, '#etikett-fehler')), `Falscher Dateityp: „${(await text(p, '#etikett-fehler')).slice(0, 70)}“`);
  await p.setInputFiles('#erf-etikett-wahl', path.join(TEST, 'kaputt.png')); await p.waitForSelector('#etikett-fehler');
  pruefe(/konnte nicht gelesen werden/.test(await text(p, '#etikett-fehler')), `Beschädigtes Bild: „${(await text(p, '#etikett-fehler')).slice(0, 70)}“`);
  await bild(p, 'rechner-fehler-bild');
  await p.setInputFiles('#erf-etikett-wahl', path.join(FIX, 'leer.png')); await p.waitForSelector('#etikett-ergebnis', { timeout: 120000 });
  pruefe(/0 von 4/.test(await text(p, '#etikett-ergebnis')), `Leeres Bild: keine Angabe erfunden („${(await text(p, '#etikett-ergebnis')).slice(0, 60)}“)`);
  // Abbruch während der Texterkennung: Die Sprachdatei wird künstlich 6 s verzögert (die Erkennung selbst ist sonst schneller als ein Klick).
  await p.route('**/vendor/lang/*.traineddata', async (route) => { await new Promise((r) => setTimeout(r, 6000)); await route.continue(); });
  await p.setInputFiles('#erf-etikett-wahl', path.join(TEST, 'rauschen.png'));
  await p.waitForSelector('#erf-etikett-abbrechen', { timeout: 15000 }); await p.waitForTimeout(800); await p.click('#erf-etikett-abbrechen');
  await p.waitForSelector('#etikett-fehler, #etikett-ergebnis', { timeout: 120000 });
  const abbruch = await p.locator('#etikett-fehler').count() ? await text(p, '#etikett-fehler') : 'Ergebnis statt Abbruch';
  pruefe(/abgebrochen/.test(abbruch) && (await p.locator('#etikett-ergebnis').count()) === 0, `Abbruch während des Ladens: „${abbruch.slice(0, 70)}“, kein Ergebnis übernommen`);
  pruefe((await p.locator('#erf-weiter[disabled]').count()) === 0, 'Nach dem Abbruch ist Weiter wieder frei');
  await p.unroute('**/vendor/lang/*.traineddata');
  // Neues Foto verwirft alte Vorschläge
  await p.setInputFiles('#erf-etikett-wahl', path.join(FIX, 'testetikett.png')); await p.waitForSelector('#etikett-ergebnis', { timeout: 120000 });
  await p.setInputFiles('#erf-etikett-wahl', path.join(FIX, 'leer.png')); await p.waitForSelector('#etikett-lauf', { timeout: 10000 }).catch(() => {});
  pruefe(await p.locator('#etikett-ergebnis').count() === 0, 'Neues Etikettfoto verwirft die alten Vorschläge sofort');
  await p.waitForSelector('#etikett-ergebnis', { timeout: 120000 });
  pruefe(/0 von 4/.test(await text(p, '#etikett-ergebnis')), 'Nach dem neuen Foto gelten nur dessen (leere) Vorschläge');
  // Von Hand ohne Scan
  await p.click('[data-action="erf-etikett-weg"]'); await p.click('#erf-etikett-manuell'); await p.waitForSelector('#etikett-ergebnis');
  pruefe(/ohne Scan/.test(await text(p, '#etikett-ergebnis')), 'Angaben ohne Scan: Eingabemodus geöffnet');
  await p.click('#erf-weiter'); await p.waitForSelector('#erf-menge');
  await p.click('label.gruppenkarte:has(input[value="tuer"])'); await p.fill('#erf-menge', '1');
  await p.fill('#etikett-hersteller', 'Handwerk GmbH'); await p.check('[data-etikett-check="hersteller"]');
  pruefe(/Herkunft: manuell eingegeben, geprüft/.test(await text(p, '.etikett-pruefung')), 'Ohne Foto heißt die Herkunft „manuell eingegeben, geprüft“ (nicht „am Foto bestätigt“)');
  await p.click('#erf-weiter'); await p.waitForSelector('.wertfelder'); await p.click('#erf-weiter'); await p.waitForSelector('#erf-speichern');
  await p.click('#erf-speichern'); await p.waitForSelector('#h-gesp');
  await p.click('a:has-text("Bauteilpass öffnen")'); await p.waitForSelector('#angebot');
  pruefe(/Handwerk GmbH/.test(await text(p)) && /manuell eingegeben, geprüft/.test(await text(p)) && /ohne Foto/.test(await text(p)), 'Manuelle Erfassung ohne Typenschildfoto im Pass mit Herkunft „manuell eingegeben“');
}

async function abgleichUndAnfrage(p) {
  await p.goto(`${BASIS}#abgleich`); await p.waitForSelector('main h1');
  await p.click('tr:has-text("TW-01"):has-text("BD-23")'); await p.waitForSelector('#h-ab-ergebnis');
  pruefe(/Für diese Entscheidung zu spät/.test(await text(p, '#h-ab-ergebnis')) && (await p.locator('#btn-pruefbitte[aria-disabled="true"]').count()) === 1, 'Abgleich TW-01 → BD-23: „zu spät“, Prüfbitte gesperrt, Grund steht daneben');
  await p.goto(`${BASIS}#abgleich`); await p.waitForSelector('main h1'); await p.click('tr:has-text("T-31"):has-text("BD-21")'); await p.waitForSelector('#h-ab-ergebnis');
  pruefe(/Angaben fehlen/.test(await text(p, '#h-ab-ergebnis')) && /Fehlende Angaben ergänzen/.test(await text(p)), 'Abgleich T-31 → BD-21: „Angaben fehlen“ mit konkret fehlender Angabe und nächstem Schritt');
  await p.goto(`${BASIS}#abgleich`); await p.waitForSelector('main h1'); await p.click('tr:has-text("TW-05"):has-text("BD-22")'); await p.waitForSelector('#h-ab-ergebnis');
  const ab = await text(p);
  pruefe(/Weiter prüfen/.test(await text(p, '#h-ab-ergebnis')) && /regelbasiert, keine KI/.test(ab) && /Nächster Schritt · Planung/i.test(ab), 'Abgleich TW-05 → BD-22: „Weiter prüfen“, als regelbasiert gekennzeichnet, Zuständigkeit genannt');
  await p.fill('.interesse-form input[name="notiz"]', 'Rückruf erbeten'); await p.click('.interesse-form button[type="submit"]'); await p.waitForSelector('.interesse-form', { state: 'detached' });
  pruefe(/Interesse festgehalten/.test(await text(p)) && /keine Reservierung/.test(await text(p)), 'Interesse festgehalten, als „keine Reservierung“ gekennzeichnet');
  await bild(p, 'rechner-abgleich-interesse');
  await p.click('#btn-anfrage-vorbereiten'); await p.waitForSelector('#form-anfrage');
  await p.click('#af-senden'); await p.waitForSelector('#anfrage-fehler');
  pruefe(/Angaben fehlen/.test(await text(p, '#anfrage-fehler')), 'Anfrage ohne Pflichtangaben wird abgewiesen');
  await p.selectOption('#af-leistung', 'fachpruefung'); await p.fill('#af-zustaendig', 'Planung, J. Neumann'); await p.fill('#af-termin', '2026-12-10'); await p.fill('#af-unterlagen', 'Foto, Typenschild');
  await p.click('#af-senden'); await p.waitForSelector('#anfrage-status');
  pruefe(/Anfrage vorbereitet/.test(await text(p, '#anfrage-status')) && /Nicht versendet/.test(await text(p)), 'Anfrage gespeichert: Status „vorbereitet“, nicht versendet');
  const anfrageHash = await p.evaluate(() => location.hash);
  await p.click('#as-beauftragt-senden'); await p.waitForSelector('#aform-beauftragt .feld-meldung');
  pruefe(/Dienstleister/.test(await text(p, '#aform-beauftragt')), 'Beauftragung ohne Dienstleister und Bestätigung wird abgewiesen');
  await bild(p, 'rechner-anfrage-vorbereitet', { fullPage: true });
  await p.goto(`${BASIS}#anfragen`); await p.waitForSelector('#dienstleister');
  await p.click('#btn-dl-neu'); await p.waitForSelector('#form-dienstleister');
  await p.fill('#dl-name', 'Prüfbüro Test (Testeintrag)'); await p.check('input[name="leistung-fachpruefung"]'); await p.check('input[name="art"][value="test"]');
  await p.click('#dl-senden'); await p.waitForSelector('#form-dienstleister', { state: 'detached' });
  pruefe(/Prüfbüro Test/.test(await text(p, '#dienstleister')) && /Testeintrag/.test(await text(p, '#dienstleister')), 'Dienstleister als Testeintrag hinterlegt');
  await p.goto(`${BASIS}${anfrageHash}`); await p.waitForSelector('#aform-beauftragt');
  await p.selectOption('#as-dienstleister', 'DL-01'); await p.check('#as-bestaetigt'); await p.click('#as-beauftragt-senden'); await p.waitForSelector('#aform-ergebnis');
  pruefe(/Beauftragt \(laut Eintrag\)/.test(await text(p, '#anfrage-status')) && /Keine Nachricht versendet/.test(await text(p)), 'Beauftragung vermerkt (laut Eintrag), keine Nachricht');
  await p.click('#as-ergebnis-senden'); await p.waitForSelector('#aform-ergebnis .feld-meldung');
  await p.check('input[name="urteil"][value="negativ"]'); await p.fill('#as-person', 'L. Brandt'); await p.click('#as-ergebnis-senden'); await p.waitForSelector('#aform-ergebnis .feld-meldung');
  pruefe(/Grund oder offene Punkte/.test(await text(p, '#aform-ergebnis')), 'Negatives Ergebnis braucht einen Grund');
  await p.fill('#as-notiz', 'Maße passen nicht zur Öffnung'); await p.click('#as-ergebnis-senden'); await p.waitForSelector('#aform-abgeschlossen');
  pruefe(/Ergebnis eingetragen/.test(await text(p, '#anfrage-status')) && /negativ/.test(await text(p)) && /keine Fachfreigabe/.test(await text(p)), 'Negative Prüfung eingetragen: nicht automatisch abgelehnt, keine Fachfreigabe');
  await p.selectOption('#as-kosten', 'kaeufer'); await p.click('#as-kosten-senden'); await p.waitForSelector('#anfrage-status');
  pruefe(/Käuferseite/.test(await text(p)), 'Kostentragung eingetragen, ohne Beträge');
  await bild(p, 'rechner-anfrage-verlauf', { fullPage: true });
  return anfrageHash;
}

async function passAngebotVerkauf(p) {
  await p.goto(`${BASIS}#pass-kb-tw-05`); await p.waitForSelector('#angebot');
  await p.click('#btn-angebot'); await p.waitForSelector('#form-angebot');
  await p.fill('#ag-menge', '0'); await p.click('#ag-senden'); await p.waitForSelector('#form-angebot .feld-meldung');
  await p.fill('#ag-menge', '55'); await p.fill('#ag-bis', '2027-03-31'); await p.click('#ag-senden'); await p.waitForSelector('#form-angebot', { state: 'detached' });
  const t = await text(p);
  pruefe(/Angebot geändert/.test(t) && /55 lfm/.test(t), 'Angebot bearbeitet: Menge 55 lfm, Verfügbarkeit bis 31.03.2027');
  await p.check('#form-verkauf input[name="status"][value="abgeschlossen"]'); await p.click('#vk-senden'); await p.waitForSelector('#form-verkauf .feld-meldung');
  pruefe(/Datum des Verkaufsabschlusses/.test(await text(p, '#form-verkauf')), 'Verkauf „abgeschlossen“ ohne Datum wird abgewiesen');
  await p.fill('#vk-datum', '2026-11-18'); await p.click('#vk-senden'); await p.waitForSelector('#verkauf');
  pruefe(/Verkauf abgeschlossen \(laut Eintrag\)/.test(await text(p, '#verkauf')), 'Verkauf abgeschlossen (laut Eintrag), keine Zahlung');
  const pv = await p.locator('#verkauf select[name="status"]').count();
  pruefe(pv === 0 || /Provisionsstatus/.test(await text(p, '#verkauf')), `Provision nur bei vermittelter Leistung (${pv ? 'Dienstleister aus Anfrage vorhanden' : 'ohne Leistung kein Provisionsstatus'})`);
  if (pv) {
    await p.selectOption('#verkauf select[name="status"]', 'vereinbart'); await p.waitForSelector('#verkauf input[name="grundlage"]');
    await p.click('#verkauf form[data-form="pilot-provision"] button[type="submit"]'); await p.waitForSelector('#verkauf .feld-meldung');
    pruefe(/Berechnungsgrundlage/.test(await text(p, '#verkauf')), 'Provision „vereinbart“ ohne Berechnungsgrundlage wird abgewiesen (kein Vorgabewert)');
    await p.fill('#verkauf input[name="grundlage"]', 'laut Rahmenvereinbarung vom 19.11.2026 (Test)'); await p.click('#verkauf form[data-form="pilot-provision"] button[type="submit"]'); await p.waitForSelector('#verkauf');
    pruefe(/vereinbart \(laut Eintrag\)/.test(await text(p, '#verkauf')), 'Provisionsstatus „vereinbart“ mit eingetragener Grundlage');
  }
  await bild(p, 'rechner-pass-verkauf', { fullPage: true });
}

async function dateiSichernLaden(b, p) {
  await p.goto(`${BASIS}#pilotraum`); await p.waitForSelector('#btn-daten-sichern');
  const [download] = await Promise.all([p.waitForEvent('download'), p.click('#btn-daten-sichern')]);
  const datei = path.join(TEST, 'datenstand-export.json'); await download.saveAs(datei);
  const inhalt = JSON.parse(await fs.readFile(datei, 'utf8'));
  pruefe(inhalt.schema === 'circularflow-stand-v1' && inhalt.daten.erfassungen.length >= 2 && inhalt.daten.anfragen.length === 1, `Datei gesichert: ${inhalt.daten.erfassungen.length} Erfassungen, ${inhalt.daten.anfragen.length} Anfrage, ${inhalt.daten.dienstleister.length} Dienstleister`);
  const c2 = await b.newContext({ viewport: { width: 1280, height: 800 } }); const p2 = await c2.newPage();
  await p2.goto(`${BASIS}#pilotraum`); await p2.waitForSelector('#daten-datei');
  await p2.setInputFiles('#daten-datei', path.join(TEST, 'kaputt.png')); await p2.waitForSelector('#datenstand .feld-meldung');
  pruefe(/kein lesbarer/.test(await text(p2, '#datenstand')), 'Ungültige Datei wird abgewiesen');
  await p2.setInputFiles('#daten-datei', datei); await p2.waitForSelector('#datenstand .hinweisbox');
  pruefe(/neue Einträge/.test(await text(p2, '#datenstand')), `Datei geladen: „${(await text(p2, '#datenstand .hinweisbox')).slice(0, 80)}“`);
  await p2.goto(`${BASIS}#anfragen`); await p2.waitForSelector('main h1');
  pruefe(/A-01/.test(await text(p2)), 'Nach dem Laden sind die Einträge im zweiten Browserprofil vorhanden');
  await c2.close();
}

async function pilotraum(b, raumA, raumB, passHash) {
  const api = async (schluessel) => { const r = await fetch(`http://127.0.0.1:${PORT}/api/raum/stand`, { headers: { authorization: `Bearer ${schluessel}` } }); return r.json(); };
  const verbinde = async (p, schluessel) => { await p.goto(`${BASIS}#pilotraum`); await p.waitForSelector('#pr-schluessel'); await p.fill('#pr-schluessel', schluessel); await p.click('#pr-verbinden'); await p.waitForSelector('[data-action="pilotraum-aktualisieren"]', { timeout: 15000 }); return text(p, '#pilotraum'); };
  console.log('\n== Pilotraum: zwei getrennte Sitzungen, fremder Raum, Leseschlüssel ==');
  const c1 = await b.newContext({ viewport: { width: 1280, height: 800 } }); const p1 = await c1.newPage(); const k1 = []; konsole(p1, k1);
  // Sitzung 1 hat lokale Einträge (Datei geladen) und verbindet sich: Übernahme in den Raum
  await p1.goto(`${BASIS}#pilotraum`); await p1.waitForSelector('#daten-datei'); await p1.setInputFiles('#daten-datei', path.join(TEST, 'datenstand-export.json')); await p1.waitForSelector('#datenstand .hinweisbox');
  const m1 = await verbinde(p1, raumA.bearbeiten);
  pruefe(/verbunden · bearbeiten/.test(m1) && /in den Pilotraum übernommen/.test(m1), `Sitzung 1 verbunden (bearbeiten), lokale Einträge übernommen: „${m1.slice(0, 120)}“`);
  const s1 = await api(raumA.bearbeiten);
  pruefe(s1.version >= 1 && s1.daten.anfragen.length === 1 && s1.daten.erfassungen.length >= 2, `Server Raum A: Fassung ${s1.version}, ${s1.daten.erfassungen.length} Erfassungen, ${s1.daten.anfragen.length} Anfrage`);
  await bild(p1, 'rechner-pilotraum-verbunden');
  // Sitzung 2 (frisches Profil) verbindet sich mit demselben Raum und sieht die Daten
  const c2 = await b.newContext({ viewport: { width: 1280, height: 800 } }); const p2 = await c2.newPage(); const k2 = []; konsole(p2, k2);
  await verbinde(p2, raumA.bearbeiten);
  await p2.goto(`${BASIS}${passHash}`); await p2.waitForSelector('main h1');
  pruefe(/MUSTERWERK/.test(await text(p2)), `Sitzung 2 sieht die Erfassung ${passHash} aus Sitzung 1 (gemeinsamer Datenstand)`);
  // Sitzung 2 ändert etwas; Sitzung 1 gleicht ab
  await p2.goto(`${BASIS}#anfragen`); await p2.waitForSelector('#dienstleister'); await p2.click('#btn-dl-neu'); await p2.waitForSelector('#form-dienstleister');
  await p2.fill('#dl-name', 'Transport Test (Sitzung 2)'); await p2.check('input[name="leistung-transport"]'); await p2.check('input[name="art"][value="test"]'); await p2.click('#dl-senden'); await p2.waitForSelector('#form-dienstleister', { state: 'detached' });
  await p2.waitForTimeout(1500);
  const s2 = await api(raumA.bearbeiten);
  pruefe(s2.daten.dienstleister.some((d) => /Sitzung 2/.test(d.name)), `Änderung aus Sitzung 2 liegt im Raum (Fassung ${s2.version})`);
  await p1.goto(`${BASIS}#pilotraum`); await p1.waitForSelector('[data-action="pilotraum-aktualisieren"]'); await p1.click('[data-action="pilotraum-aktualisieren"]'); await p1.waitForSelector('#pilotraum .hinweisbox', { timeout: 15000 });
  await p1.goto(`${BASIS}#anfragen`); await p1.waitForSelector('#dienstleister');
  pruefe(/Sitzung 2/.test(await text(p1, '#dienstleister')), 'Sitzung 1 sieht nach dem Abgleich den Eintrag aus Sitzung 2');
  // Neuladen in Sitzung 2 behält Verbindung und Daten
  await p2.reload(); await p2.waitForSelector('main h1'); await p2.waitForTimeout(1200);
  pruefe(/Pilotraum verbunden/.test(await text(p2, '.rail')), 'Sitzung 2 bleibt nach Neuladen verbunden');
  // Fremder Raum B sieht nichts von Raum A
  const c3 = await b.newContext({ viewport: { width: 1280, height: 800 } }); const p3 = await c3.newPage();
  await verbinde(p3, raumB.bearbeiten);
  await p3.goto(`${BASIS}${passHash}`); await p3.waitForSelector('main');
  pruefe(/gibt es nicht/.test(await text(p3)), 'Fremder Raum B: Erfassung aus Raum A ist nicht sichtbar (Projektdaten getrennt)');
  await p3.goto(`${BASIS}#pilotraum`); await p3.waitForSelector('#pr-schluessel', { state: 'detached' }).catch(() => {});
  // Leseschlüssel: Verbindung ja, Schreiben nein
  const c4 = await b.newContext({ viewport: { width: 1280, height: 800 } }); const p4 = await c4.newPage();
  const m4 = await verbinde(p4, raumA.lesen);
  pruefe(/nur lesen/.test(m4), 'Leseschlüssel: verbunden mit „nur lesen“');
  await p4.goto(`${BASIS}#anfragen`); await p4.waitForSelector('#dienstleister');
  pruefe(/Sitzung 2/.test(await text(p4, '#dienstleister')), 'Leseschlüssel sieht den gemeinsamen Stand');
  await p4.click('#btn-dl-neu'); await p4.waitForSelector('#form-dienstleister'); await p4.fill('#dl-name', 'Nur-Lesen-Eintrag'); await p4.check('input[name="leistung-ausbau"]'); await p4.check('input[name="art"][value="test"]'); await p4.click('#dl-senden'); await p4.waitForSelector('#form-dienstleister', { state: 'detached' }); await p4.waitForTimeout(1200);
  const s4 = await api(raumA.bearbeiten);
  pruefe(!s4.daten.dienstleister.some((d) => /Nur-Lesen/.test(d.name)) && s4.version === s2.version, `Leseschlüssel schreibt nicht in den Raum (Fassung bleibt ${s4.version}); Eintrag bleibt lokal`);
  // Falscher Schlüssel
  const c5 = await b.newContext({ viewport: { width: 1280, height: 800 } }); const p5 = await c5.newPage();
  await p5.goto(`${BASIS}#pilotraum`); await p5.waitForSelector('#pr-schluessel'); await p5.fill('#pr-schluessel', 'xxxxxxxxxxxxxxxxxxxx'); await p5.click('#pr-verbinden'); await p5.waitForSelector('#form-pilotraum .feld-meldung', { timeout: 15000 });
  pruefe(/ungültig/.test(await text(p5, '#form-pilotraum')), 'Ungültiger Schlüssel wird abgewiesen');
  pruefe(k1.length === 0 && k2.length === 0, `Keine Konsolenfehler in den Pilotraum-Sitzungen (${JSON.stringify([...k1, ...k2])})`);
  for (const c of [c1, c2, c3, c4, c5]) await c.close();
}

async function handy(b) {
  const profil = devices['Pixel 7'];
  console.log(`\n== Handy-Emulation (${profil.viewport.width} × ${profil.viewport.height}, Chromium-Profil „Pixel 7“, kein echtes Gerät) ==`);
  const c = await b.newContext({ ...profil }); const p = await c.newPage(); const k = []; konsole(p, k);
  const mess = async (was) => { const m = await p.evaluate(() => { const sichtbar = (e) => e.offsetParent !== null; const z = [...document.querySelectorAll('main button, main a.knopf, main a.knopf-zweit, main label.knopf-zweit, main select, main input:not([type=radio]):not([type=file]):not([type=checkbox])')].filter(sichtbar); const h = (e) => Math.round((e.closest('.einheit-feld') || e).getBoundingClientRect().height); return { ueberstand: document.documentElement.scrollWidth - window.innerWidth, unter44: z.filter((e) => h(e) < 44).map((e) => `${e.id || e.textContent.trim().slice(0, 16)}:${h(e)}`) }; }); pruefe(m.ueberstand <= 0 && !m.unter44.length, `Handy ${was}: Überstand ${m.ueberstand} px, Ziele unter 44 px: ${JSON.stringify(m.unter44)}`); };
  await p.goto(`${BASIS}#erfassung`); await p.waitForSelector('#erf-projekt'); await mess('Schritt 1');
  await p.selectOption('#erf-projekt', 'LH'); await p.selectOption('#erf-raum', { index: 1 }); await p.click('#erf-weiter'); await p.waitForSelector('#erf-etikett');
  pruefe((await p.getAttribute('#erf-etikett', 'capture')) === 'environment' && (await p.getAttribute('#erf-etikett-wahl', 'capture')) === null, 'Handy: Typenschild-Feld öffnet die Kamera (capture), Zweitfeld die Bilder');
  await mess('Schritt 2'); await bild(p, 'handy-2-foto');
  const t0 = Date.now(); await p.setInputFiles('#erf-etikett-wahl', path.join(FIX, 'testetikett-deutsch.png')); await p.waitForSelector('#etikett-ergebnis', { timeout: 120000 }); zeiten.handy = Date.now() - t0;
  pruefe(/4 von 4/.test(await text(p, '#etikett-ergebnis')), `Handy: deutsches Etikett mit Umlauten gelesen (${(zeiten.handy / 1000).toFixed(1)} s)`);
  await bild(p, 'handy-2-etikett');
  await p.click('#erf-weiter'); await p.waitForSelector('#erf-menge'); await p.click('label.gruppenkarte:has(input[value="tuer"])');
  pruefe((await p.inputValue('#etikett-hersteller')) === 'Türenwerk Müller GmbH' && (await p.inputValue('#etikett-modell')) === 'Bürotür Größe 2 / TÜ-885', 'Handy: Umlaute richtig in den Feldern');
  await mess('Schritt 3'); await bild(p, 'handy-3-pruefen', { fullPage: true });
  for (const k2 of ['hersteller', 'modell', 'seriennummer', 'baujahr']) await p.check(`[data-etikett-check="${k2}"]`);
  await p.click('#erf-weiter'); await p.waitForSelector('.wertfelder'); await p.click('#erf-weiter'); await p.waitForSelector('#erf-speichern'); await mess('Schritt 5');
  await p.click('#erf-speichern'); await p.waitForSelector('#h-gesp'); await bild(p, 'handy-6-gespeichert');
  await p.click('a:has-text("Bauteilpass öffnen")'); await p.waitForSelector('#angebot'); await mess('Bauteilpass'); await bild(p, 'handy-7-pass', { fullPage: true });
  pruefe(k.length === 0, `Handy: keine Konsolenfehler (${JSON.stringify(k)})`);
  await c.close();
}

(async () => {
  await fs.rm(DATEN, { recursive: true, force: true }); await fs.mkdir(AUS, { recursive: true });
  const raumA = await raumAnlegen('Pilotraum A (Test)', DATEN); const raumB = await raumAnlegen('Pilotraum B (Test)', DATEN);
  const server = spawn(process.execPath, [path.join(WURZEL, 'plattform/server/pilotserver.mjs'), '--port', String(PORT), '--daten', DATEN], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 1200));
  const b = await chromium.launch();
  console.log(`Chromium ${b.version()} · ${BASIS} · Pilotserver (Node ${process.version}) · ${new Date().toISOString()}`);
  try {
    console.log('\n== Rechner 1280 × 800: Erfassung mit echter Texterkennung, Korrektur, Bestätigung, Speichern, Neuladen ==');
    const c = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 }); const p = await c.newPage(); const k = []; konsole(p, k);
    const passHash = await erfassungMitOcr(p, 'rechner');
    console.log('\n== Fehlerfälle und Erfassung ohne Scan ==');
    await fehlerfaelle(p);
    console.log('\n== Abgleich, Interesse, Anfrage mit Dienstleister und Verlauf ==');
    await abgleichUndAnfrage(p);
    console.log('\n== Bauteilpass: Angebot bearbeiten, Verkauf, Provision ==');
    await passAngebotVerkauf(p);
    console.log('\n== Datenstand als Datei sichern und laden ==');
    await dateiSichernLaden(b, p);
    pruefe(k.length === 0, `Keine Konsolenfehler im Rechnerlauf (${JSON.stringify(k)})`);
    await c.close();
    await pilotraum(b, raumA, raumB, passHash);
    await handy(b);
  } catch (e) { pruefe(false, `Abbruch des Laufs: ${e.stack || e.message}`); }
  await b.close(); server.kill();
  console.log(`\nTexterkennung im Browser (ms, einschließlich Laden der Engine): ${JSON.stringify(zeiten)}`);
  console.log(`${fehler ? `${fehler} Prüfung(en) fehlgeschlagen` : 'Alle Prüfungen bestanden'}`);
  process.exit(fehler ? 1 : 0);
})();
