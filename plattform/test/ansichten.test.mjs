// Rendert jede Ansicht in Node für alle Beispielobjekte und prüft, dass nichts Kaputtes im HTML steht.
// Außerdem: Jede Zahl auf der Übersicht stimmt mit der Zahl der Einträge im Ziel überein.
import test from 'node:test';
import assert from 'node:assert/strict';
import { kontext, START } from './_hilfe.mjs';
import { leerePersistenz } from '../app/zustand.js';
import { bedarfFormular, BEDARF_FELD_ID, erstesBedarfFeld } from '../app/ansichten/bedarfform.js';
import { projektFormular, PROJEKT_FELD_ID, erstesProjektFeld } from '../app/ansichten/projektform.js';
import { vorgangSchritt } from '../app/vorgang.js';
import { pruefeBedarf } from '../app/bedarf.js';
import { pruefeProjekt, projektAusEntwurf } from '../app/projektanlage.js';
import { naechsteHandlung, schluessel } from '../app/regeln.js';
import { leererBedarfEntwurf, leeresProjektformular, bedarfsformularStarten } from '../app/uizustand.js';
import { PROJEKTZEITEN } from '../app/daten.js';
import { neuerUiZustand, leererKatalog, leereBedarfsliste, leererBestand } from '../app/uizustand.js';
import { kennzahlen } from '../app/kennzahlen.js';
import { abgleichListe, pruefbitteAnlegen, abgleichSchluessel, loeseAbgleichSchluessel } from '../app/abgleich.js';
import { uebersicht } from '../app/ansichten/uebersicht.js';
import { katalog } from '../app/ansichten/katalog.js';
import { bedarfe, bedarfDetail } from '../app/ansichten/bedarfe.js';
import { abgleichListeSeite, abgleichSeite } from '../app/ansichten/abgleich.js';
import { vorgaenge } from '../app/ansichten/vorgaenge.js';
import { startseite, projektUebersicht } from '../app/ansichten/projekte.js';
import { gebaeudeAnsicht } from '../app/ansichten/gebaeude.js';
import { bestand, pass } from '../app/ansichten/bauteile.js';
import { entscheidungsListe, entscheidungsSeite } from '../app/ansichten/entscheidung.js';
import { erfassung } from '../app/ansichten/erfassung.js';
import { radar } from '../app/ansichten/radar.js';

const mitUi = (p = leerePersistenz(), at = START) => ({ ...kontext(p, at), ui: neuerUiZustand(), geo: null, eigeneAenderungen: 0 });
const anzahl = (html, re) => (html.match(re) || []).length;
const sauber = (html, was) => {
  assert.ok(html.length > 200, `${was}: zu wenig HTML`);
  for (const [re, name] of [[/\bundefined\b/, 'undefined'], [/\bNaN\b/, 'NaN'], [/\[object Object\]/, '[object Object]'], [/\bnull\b(?![^<]*>)/, 'null']]) {
    const m = html.match(re); assert.equal(m, null, `${was}: enthält ${name} bei „${m && html.slice(Math.max(0, m.index - 60), m.index + 40)}“`);
  }
  for (const m of html.matchAll(/(?:href|data-href)="(#[^"]*)"/g)) assert.match(m[1], /^#[A-Za-z0-9-]*$/, `${was}: Route nur aus ASCII-Buchstaben, Ziffern und Bindestrichen: ${m[1]}`);
  assert.equal(html.includes('streifen'), false, `${was}: alter Seitenstreifen`);
};

// Zustand mit eigenen Erfassungen: ein Vorgang mit Prüfbitte und ein eigener Bedarf.
function reichKontext(at = START) {
  const c0 = mitUi(leerePersistenz(), at);
  const a = abgleichListe(c0, { ergebnis: 'weiter' })[0];
  const r = pruefbitteAnlegen(c0, a);
  const p = leerePersistenz();
  p.zuordnungen.push(r.zuordnung); p.ereignisse.push(r.ereignis);
  const c1 = mitUi(leerePersistenz(), at);
  p.projekteEigen.push(projektAusEntwurf({ name: 'Eigenes Testprojekt', art: 'umbau', bezirk: 'Hörde', etagen: '2', raeume: '3', gebaeudeName: 'Haus 1', rueckbauAb: '2027-03-01', entscheidungBis: '2027-02-01' }, { projekte: c1.daten.projekte, mitte: [51.49, 7.5], at }));
  p.bedarfe.push({ projekt: 'SB', id: 'BD-30', gruppe: 'tuer', titel: 'Eigene Türen', raeume: [], etage: null, menge: 4, einheit: 'Stk', text: '', bestellfrist: null, pruefzeitTage: null, annahmeVon: null, annahmeBis: null, anforderungen: '', zustaendig: null, belegt: {}, angelegt: '2026-11-18', herkunft: 'eigene Eingabe in diesem Browser', neu: true });
  return mitUi(p, at);
}

const KONTEXTE = () => [['leer', mitUi()], ['reich', reichKontext()], ...PROJEKTZEITEN.slice(1).map((z) => [`Zeit ${z.at}`, mitUi(leerePersistenz(), z.at)])];

test('Übersicht, Katalog, Bedarfe und Arbeitsliste rendern ohne Fehler', () => {
  for (const [name, c] of KONTEXTE()) {
    for (const tage of [30, 90]) { c.ui.uebersicht.tage = tage; sauber(uebersicht(c), `Übersicht ${name} ${tage}`); }
    sauber(katalog(c), `Katalog ${name}`);
    for (const v of [{ art: 'bald', tage: 30 }, { art: 'bald', tage: 90 }, { art: 'offen' }, { art: 'monat', monat: '2027-02' }, { art: 'monat', monat: '1999-01' }]) { c.ui.katalog = { ...leererKatalog(), vorgabe: v }; sauber(katalog(c), `Katalog ${name} ${v.art}`); }
    c.ui.katalog = { ...leererKatalog(), q: 'zzz-nichts', bis: '2027-01-01', mindest: '5' }; const leer = katalog(c); sauber(leer, `Katalog leer ${name}`); assert.match(leer, /Filter zurücksetzen/);
    c.ui.katalog = { ...leererKatalog(), mindest: 'abc', alle: true }; sauber(katalog(c), `Katalog Mindestmenge ungültig ${name}`);
    sauber(bedarfe(c), `Bedarfe ${name}`);
    c.ui.bedarfe = { ...leereBedarfsliste(), offen: true, gruppe: 'wand' }; sauber(bedarfe(c), `Bedarfe gefiltert ${name}`);
    c.ui.bedarfe = { ...leereBedarfsliste(), projekt: 'LH', gruppe: 'tuer' }; assert.match(bedarfe(c), /Filter zurücksetzen/);
    sauber(vorgaenge(c), `Vorgänge ${name}`);
    for (const s of ['offen', 'pruefbitte', 'uebergeben', 'gibt-es-nicht']) { c.ui.vorgaenge.status = s; sauber(vorgaenge(c), `Vorgänge ${name} ${s}`); }
    for (const e of ['', 'weiter', 'knapp', 'spaet', 'fehlt', 'klaerung']) { c.ui.abgleich.ergebnis = e; sauber(abgleichListeSeite(c), `Abgleichsliste ${name} ${e}`); }
  }
});

test('Bedarf-Detail für jeden Bedarf', () => {
  for (const [name, c] of KONTEXTE()) for (const d of c.daten.bedarfe) sauber(bedarfDetail(c, d), `Bedarf ${d.projekt} ${d.id} ${name}`);
  const c = mitUi(); const h = bedarfDetail(c, c.daten.bedarfe.find((d) => d.id === 'BD-22'));
  assert.match(h, /geschätzt/); assert.match(h, /Passende Angebote/); assert.match(h, /Bedarf ergänzen|Angaben ändern/);
});

test('Abgleichseite für alle Paare und auch für unpassende Kombinationen', () => {
  for (const [name, c] of KONTEXTE()) {
    for (const b of c.daten.bauteile) for (const d of c.daten.bedarfe) {
      const h = abgleichSeite(c, b, d); sauber(h, `Abgleich ${b.projekt} ${b.id} / ${d.projekt} ${d.id} ${name}`);
      assert.match(h, /keine fachliche Freigabe/); assert.match(h, /Prüfbitte anlegen/); assert.match(h, /Erklärte Prüfung/);
      const key = abgleichSchluessel(b, d); assert.match(key, /^[a-z0-9]+(-[a-z0-9]+)*--[a-z0-9]+(-[a-z0-9]+)*$/, key);
      assert.equal(loeseAbgleichSchluessel(c, key).bauteil.id, b.id);
    }
  }
});

test('Abgleichseite zeigt Gründe, Sperrgrund und erklärte Zeitrechnung', () => {
  const c = mitUi(); const f = (b, d) => abgleichSeite(c, c.daten.bauteile.find((x) => x.projekt === b[0] && x.id === b[1]), c.daten.bedarfe.find((x) => x.projekt === d[0] && x.id === d[1]));
  const weiter = f(['KB', 'TW-05'], ['SB', 'BD-22']);
  assert.match(weiter, /Weiter prüfen/); assert.doesNotMatch(weiter, /Gesperrt/); assert.match(weiter, /ca\. [\d,]+ km Luftlinie \(Lage symbolisch\)/); assert.match(weiter, /Reserve/);
  const spaet2 = f(['LH', 'TW-01'], ['SB', 'BD-23']);
  assert.match(spaet2, /zu spät/); assert.match(spaet2, /Gesperrt/); assert.match(spaet2, /aria-disabled="true"/);
  const fehlt = f(['KB', 'T-31'], ['SB', 'BD-21']);
  assert.match(fehlt, /Angaben fehlen/); assert.match(fehlt, /Gesperrt/); assert.match(fehlt, /Bestellfrist/);
});

test('Projekt-, Gebäude-, Bestand-, Pass-, Entscheidungs-, Erfassungs- und Radaransichten', () => {
  for (const [name, c] of KONTEXTE()) {
    sauber(startseite(c), `Start ${name}`);
    for (const p of c.daten.projekte) {
      sauber(projektUebersicht(c, p), `Projekt ${p.kurz} ${name}`);
      sauber(gebaeudeAnsicht(c, p, null), `Gebäude ${p.kurz} ${name}`);
      const raum = p.gebaeude?.[0]?.etagen?.[0]?.raeume?.[0]?.id; if (raum) sauber(gebaeudeAnsicht(c, p, raum), `Raum ${p.kurz} ${raum} ${name}`);
      sauber(bestand(c, p), `Bestand ${p.kurz} ${name}`);
      sauber(entscheidungsListe(c, p), `Entscheidungen ${p.kurz} ${name}`);
    }
    for (const b of c.daten.bauteile) { const h = pass(c, c.daten.projekte.find((p) => p.kurz === b.projekt), b); sauber(h, `Pass ${b.projekt} ${b.id} ${name}`); if (b.status !== 'nicht') assert.match(h, /Passende Bedarfe/); }
    for (const e of c.daten.entscheidungen) sauber(entscheidungsSeite(c, c.daten.projekte.find((p) => p.kurz === e.projekt), e), `Entscheidung ${e.projekt} ${e.id} ${name}`);
    for (const schritt of [1, 2, 3, 4, 5]) { c.ui.erfassung = { ...c.ui.erfassung, schritt, projekt: 'LH', raum: '1.14', gruppe: 'tuer' }; sauber(erfassung(c), `Erfassung Schritt ${schritt} ${name}`); }
    for (const tab of ['hinweise', 'quellen', 'melden']) sauber(radar(c, { tab }), `Radar ${tab} ${name}`);
  }
});

test('Pass: Passende Bedarfe mit Ergebnis-Chip und Link, verfügbar von bis', () => {
  const c = mitUi(); const b = c.daten.bauteile.find((x) => x.id === 'TW-01' && x.projekt === 'LH');
  const h = pass(c, c.daten.projekte.find((p) => p.kurz === 'LH'), b);
  assert.match(h, /href="#abgleich-lh-tw-01--sb-bd-22"/); assert.match(h, /bis 31\.03\.2027/);
  assert.equal(anzahl(h, /class="paar"/g), abgleichListe(c, { bauteil: b }).length);
});

// ---------- Zahl und Zielliste stimmen überein ----------
const kachelZahl = (html, id) => Number(new RegExp(`aria-labelledby="${id}"[\\s\\S]*?<b class="kachel-zahl">(\\d+)</b>`).exec(html)[1]);
const teilZahlen = (html, id) => { const block = new RegExp(`aria-labelledby="${id}"[\\s\\S]*?<ul class="kachel-liste[\\s\\S]*?</ul>`).exec(html)[0].split('<ul')[1]; return [...block.matchAll(/data-wert="([a-z]*)"[^>]*>[\s\S]*?<b class="mono">(\d+)<\/b>/g)].map((m) => [m[1], Number(m[2])]); };

test('Kachel „Bald verfügbar“ und Diagramm: Zahl gleich Zahl der Katalogkarten', () => {
  for (const [name, c] of KONTEXTE()) for (const tage of [30, 90]) {
    c.ui.uebersicht.tage = tage; const kz = kennzahlen(c, { horizontTage: tage });
    assert.equal(kachelZahl(uebersicht(c), 'k-bald'), kz.baldVerfuegbar.anzahl, `${name} ${tage}`);
    c.ui.katalog = { ...leererKatalog(), vorgabe: { art: 'bald', tage } };
    assert.equal(anzahl(katalog(c), /class="bt-karte"/g), kz.baldVerfuegbar.anzahl, `Katalog ${name} ${tage}`);
    for (const m of kz.zeitverlauf.monate) {
      c.ui.katalog = { ...leererKatalog(), vorgabe: { art: 'monat', monat: m.monat } };
      assert.equal(anzahl(katalog(c), /class="bt-karte"/g), m.anzahl, `Monat ${m.monat} ${name}`);
      for (const [g, n] of Object.entries(m.nachGruppe)) { c.ui.katalog = { ...leererKatalog(), vorgabe: { art: 'monat', monat: m.monat }, gruppe: g }; assert.equal(anzahl(katalog(c), /class="bt-karte"/g), n, `Monat ${m.monat} ${g}`); }
    }
    const dg = uebersicht(c);
    assert.equal(anzahl(dg, /class="seg-link g-[a-z]+" href="#bauteile" data-action="katalog-vorgabe" data-wert="monat"/g), kz.zeitverlauf.monate.reduce((s, m) => s + Object.keys(m.nachGruppe).length, 0));
    assert.match(dg, /Als Tabelle anzeigen/); assert.match(dg, /<svg viewBox/);
  }
});

test('Kachel „Passende Paare“ und „Vorgänge je Status“: Zahl gleich Zeilen im Ziel', () => {
  for (const [name, c] of KONTEXTE()) {
    const kz = kennzahlen(c); const html = uebersicht(c);
    assert.equal(kachelZahl(html, 'k-paare'), kz.passendePaare.anzahl);
    c.ui.abgleich.ergebnis = '';
    assert.equal(anzahl(abgleichListeSeite(c), /<tr data-href="#abgleich-/g), kz.passendePaare.anzahl, `Alle Paare ${name}`);
    for (const [k, n] of teilZahlen(html, 'k-paare')) { c.ui.abgleich.ergebnis = k; assert.equal(anzahl(abgleichListeSeite(c), /<tr data-href="#abgleich-/g), n, `Paare ${k} ${name}`); }
    assert.equal(kachelZahl(html, 'k-vorgaenge'), kz.vorgaenge.anzahl);
    c.ui.vorgaenge.status = ''; assert.equal(anzahl(vorgaenge(c), /<tr data-href="#entscheidung-/g), kz.vorgaenge.anzahl, `Alle Vorgänge ${name}`);
    for (const [k, n] of teilZahlen(html, 'k-vorgaenge')) { c.ui.vorgaenge.status = k; assert.equal(anzahl(vorgaenge(c), /<tr data-href="#entscheidung-/g), n, `Vorgänge ${k} ${name}`); }
  }
});

test('Kachel „Offene Prüfpunkte“ und „Bedarfe offen“ und „Zeitkritisch“: Zahl gleich Einträge im Ziel', () => {
  for (const [name, c] of KONTEXTE()) {
    const kz = kennzahlen(c); const html = uebersicht(c);
    assert.equal(kachelZahl(html, 'k-pruef'), kz.offenePruefpunkte.anzahl);
    c.ui.katalog = { ...leererKatalog(), vorgabe: { art: 'offen' } };
    assert.equal(anzahl(katalog(c), /class="bt-karte"/g), kz.offenePruefpunkte.anzahl, `Katalog offen ${name}`);
    let summe = 0;
    for (const [, n] of [...html.matchAll(/data-action="bestand-offen">[\s\S]*?<b class="mono">(\d+)<\/b>/g)].map((m) => [0, Number(m[1])])) summe += n;
    assert.equal(summe, kz.offenePruefpunkte.anzahl, 'Teilzahlen je Projekt ergeben die Summe');
    for (const p of c.daten.projekte) {
      c.ui.bestand = { ...leererBestand(), offen: true };
      const erwartet = kz.offenePruefpunkte.eintraege.filter((x) => x.bauteil.projekt === p.kurz).length;
      assert.equal(anzahl(bestand(c, p), /<tr data-href="#pass-/g), erwartet, `Bestand ${p.kurz} offen ${name}`);
    }
    assert.equal(kachelZahl(html, 'k-bedarfe'), kz.bedarfeOffen.anzahl);
    c.ui.bedarfe = { ...leereBedarfsliste(), offen: true };
    assert.equal(anzahl(bedarfe(c), /<tr data-href="#bedarf-/g), kz.bedarfeOffen.anzahl, `Bedarfe offen ${name}`);
    assert.equal(anzahl(html, /class="frist-zeile"/g), kz.zeitkritisch.anzahl, `Zeitkritisch ${name}`);
  }
});

test('Zeitkritisch zeigt Überfälliges zuerst und führt zu Entscheidung oder Bedarf', () => {
  const c = mitUi(leerePersistenz(), '2026-11-19T09:00'); const kz = kennzahlen(c);
  const h = uebersicht(c);
  const zeilen = [...h.matchAll(/<li class="frist-zeile">([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  assert.equal(zeilen.length, kz.zeitkritisch.anzahl); assert.ok(zeilen.length > 0);
  const ueber = zeilen.map((z) => z.includes('Überfällig'));
  assert.deepEqual(ueber, [...ueber].sort((a, b) => Number(b) - Number(a)), 'Überfälliges steht zuerst');
  for (const z of zeilen) assert.match(z, /href="#(entscheidung|bedarf)-/);
});

test('Navigation: Bedarfs-Links und Kennzahlen enthalten keine erfundenen Wirkungszahlen', () => {
  const h = uebersicht(mitUi());
  assert.doesNotMatch(h, /€|CO₂-Einsparung|kg CO|Tonnen|Kosten gespart/);
  assert.match(h, /Beispieldaten/); assert.match(h, /Stichtag der Demo/); assert.match(h, /Zeitkritisch \(7 Tage\)/);
});


// ---------- Formulare (Paket C) ----------
test('Bedarfsformular: neu und Ergänzung rendern, mit und ohne Fehler, Felder mit stabilen IDs', () => {
  for (const [name, c] of KONTEXTE()) {
    bedarfsformularStarten(c.ui, null);
    const h = bedarfFormular(c); sauber(h, `Bedarf neu ${name}`);
    for (const id of Object.values(BEDARF_FELD_ID)) assert.match(h, new RegExp(`id="${id}"`), id);
    for (const id of ['bf-art-bestellfrist', 'bf-art-pruefzeit', 'bf-art-annahme', 'bf-anforderungen', 'bf-speichern', 'bf-abbrechen']) assert.match(h, new RegExp(`id="${id}"`), id);
    assert.match(h, /personenbezogenen Daten Dritter/); assert.doesNotMatch(h, /aria-invalid/);
    // Fehler am Feld: aria-invalid und aria-describedby zeigen auf die Meldung
    c.ui.bedarfForm.entwurf = { ...leererBedarfEntwurf(), gruppe: 'tuer', menge: 'abc', bestellfrist: '2027-13-40', pruefzeitTage: '400' };
    const fehler = pruefeBedarf(c.ui.bedarfForm.entwurf, c); c.ui.bedarfForm.fehler = fehler;
    assert.equal(erstesBedarfFeld(fehler), 'projekt');
    const m = bedarfFormular(c); sauber(m, `Bedarf Fehler ${name}`);
    for (const k of ['projekt', 'titel', 'menge', 'bestellfrist', 'pruefzeitTage']) {
      const id = BEDARF_FELD_ID[k]; assert.match(m, new RegExp(`id="${id}"[^>]*aria-invalid="true"[^>]*aria-describedby="[^"]*${id}-f`), `${k} hat aria-invalid und describedby`);
      assert.match(m, new RegExp(`<p class="feld-meldung" id="${id}-f">`), `${k} hat Meldung`);
    }
    assert.match(m, /Stk/); assert.match(m, /id="bf-fehler"/);
    // Ergänzung eines Beispielbedarfs: feste Felder gesperrt, Werte vorbelegt
    const d = c.daten.bedarfe.find((x) => x.id === 'BD-22'); bedarfsformularStarten(c.ui, d);
    const e = bedarfFormular(c, d); sauber(e, `Bedarf ergänzen ${name}`);
    assert.match(e, /Bedarf BD-22 ergänzen/); assert.match(e, /value="2027-03-31"/); assert.match(e, /<option value="geschaetzt" selected>/);
    assert.match(e, /id="bf-titel"[^>]*disabled/); assert.match(e, /id="bf-menge"[^>]*disabled/);
    for (const x of c.daten.bedarfe) { bedarfsformularStarten(c.ui, x); sauber(bedarfFormular(c, x), `Bedarf ergänzen ${x.id} ${name}`); }
  }
});

test('Projektformular rendert leer und mit Fehlern; eigenes Projekt erscheint überall', () => {
  for (const [name, c] of KONTEXTE()) {
    c.ui.projektForm = leeresProjektformular();
    const h = projektFormular(c); sauber(h, `Projekt neu ${name}`);
    for (const id of Object.values(PROJEKT_FELD_ID)) assert.match(h, new RegExp(`id="${id}"`), id);
    assert.match(h, /Es entstehen 1 Etage mit je 4 Räumen/); assert.match(h, /personenbezogenen Daten Dritter/);
    c.ui.projektForm.entwurf = { ...c.ui.projektForm.entwurf, name: '  ', etagen: '9', raeume: '', rueckbauAb: '2027-01-01', entscheidungBis: '2027-02-01' };
    const fehler = pruefeProjekt(c.ui.projektForm.entwurf, c.daten.projekte); c.ui.projektForm.fehler = fehler;
    assert.equal(erstesProjektFeld(fehler), 'name');
    const m = projektFormular(c); sauber(m, `Projekt Fehler ${name}`);
    for (const k of ['name', 'art', 'bezirk', 'entscheidungBis', 'etagen', 'raeume']) assert.match(m, new RegExp(`id="${PROJEKT_FELD_ID[k]}"[^>]*aria-invalid="true"[^>]*aria-describedby="[^"]*${PROJEKT_FELD_ID[k]}-f`), k);
  }
  const c = reichKontext(); const eigen = c.daten.projekte.find((x) => x.herkunft === 'eigen');
  assert.ok(eigen); assert.match(startseite(c), /Eigene Eingabe/); assert.match(projektUebersicht(c, eigen), /Eigene Eingabe/);
  assert.match(erfassung({ ...c, ui: Object.assign(neuerUiZustand(), { erfassung: { ...c.ui.erfassung, schritt: 1 } }) }), new RegExp(`value="${eigen.kurz}"`));
  sauber(gebaeudeAnsicht(c, eigen, eigen.gebaeude[0].etagen[0].raeume[0].id), 'Raum im eigenen Projekt');
});

// Entscheidungsseite mit Vorgang: TW-05 → BD-22 Schritt für Schritt
function vorgangsAblauf() {
  const p = leerePersistenz(); const c0 = mitUi(p);
  const r = pruefbitteAnlegen(c0, abgleichListe(c0, { ergebnis: 'weiter' })[0]);
  p.zuordnungen.push(r.zuordnung); p.ereignisse.push(r.ereignis);
  const ctx = (at = START) => mitUi(p, at);
  const seite = (at = START) => { const c = ctx(at); const e = c.daten.entscheidungen.find((x) => x.projekt === r.zuordnung.projekt && x.id === r.zuordnung.id); return { c, e, html: entscheidungsSeite(c, c.daten.projekte.find((x) => x.kurz === e.projekt), e) }; };
  const tu = (aktion, eingabe, at = START) => { const { c, e } = seite(at); const res = vorgangSchritt(c, e, aktion, eingabe); assert.ok(res.ereignis, JSON.stringify(res)); p.ereignisse.push(res.ereignis); };
  return { p, seite, tu, key: schluessel(r.zuordnung.projekt, r.zuordnung.id) };
}
const formIds = (html) => [...html.matchAll(/<form class="vorgangsform[^"]*" id="vform-([a-z-]+)"/g)].map((m) => m[1]);

test('Entscheidungsseite: Statuskette, nur erlaubte Formulare, Kasten stimmt mit Pass und Arbeitsliste überein', () => {
  const a = vorgangsAblauf();
  const pruefe = (status, erlaubt, schritt) => {
    const { c, e, html } = a.seite(); sauber(html, status);
    assert.deepEqual(formIds(html), erlaubt, `${status}: Formulare`);
    assert.match(html, /<ol class="kette"/); assert.match(html, new RegExp(`id="vorgang-status"[\\s\\S]*?${status}`));
    assert.equal(anzahl(html, /<li class="k-/g), 6);
    const h = /id="h-schritt" tabindex="-1">([^<]*)</.exec(html)[1].replace(/&#39;/g, "'");
    assert.equal(h, schritt, `${status}: Kasten`);
    const b = c.daten.bauteile.find((x) => x.projekt === e.projekt && x.id === e.bauteil);
    assert.equal(h, naechsteHandlung(c, b).text, `${status}: Pass`);
    assert.ok(vorgaenge(c).replace(/&#39;/g, "'").includes(`<b>${h}</b>`), `${status}: Arbeitsliste`);
    return html;
  };
  let h = pruefe('Prüfbitte gestellt', ['fachergebnis', 'abbruch'], 'Rückmeldung der Fachprüfung abwarten');
  assert.match(h, /laut Eintrag \(Simulation\), keine Fachfreigabe/); assert.match(h, /aria-current="step"/); assert.match(h, /id="checkliste"/); assert.match(h, /id="cl-eignung"[^>]*disabled/);
  a.tu('fachergebnis', { urteil: 'bedingt', person: 'L. Müller', notiz: 'Beschläge prüfen' });
  h = pruefe('Bedingt geeignet', ['vormerkung', 'abbruch'], 'Vormerkung anlegen');
  assert.match(h, /Fachliche Grundlage/); assert.match(h, /Vormerkung \(Simulation, unverbindlich\)/); assert.match(h, /Beschläge prüfen/);
  a.tu('vormerkung', { menge: '20', ablauf: '2027-03-01' });
  h = pruefe('Vorgemerkt', ['uebergabe-geplant', 'abbruch'], 'Übergabe planen');
  assert.match(h, /id="vf-termin"/); assert.match(h, /Annahmefenster 01\.02\.2027 bis 31\.03\.2027/);
  a.tu('uebergabe-geplant', { termin: '2027-02-15', ort: 'Lager Seeblick', rolle: 'bauleitung' });
  h = pruefe('Übergabe geplant', ['uebergeben', 'abbruch'], 'Übergabe durchführen');
  assert.match(h, /id="vf-datum"/); assert.match(h, /Sie|Eigene Eingabe/); assert.match(h, /Übergabe geplant am 15\.02\.2027/);
  // Der Verlauf nennt alle Einträge, neueste zuerst, als Eintrag von „Sie“ (Simulation)
  const v = /<ol class="verlauf">([\s\S]*?)<\/ol>/.exec(h)[1];
  assert.equal(anzahl(v, /<li>/g), 4); assert.ok(v.indexOf('Übergabe geplant') < v.indexOf('Fachergebnis')); assert.match(v, /Sie[^<]*Simulation/);
});

test('Entscheidungsseite: Beenden durch „ungeeignet“ und Abbruch; Fehler am Feld bei ungültiger Eingabe', () => {
  const a = vorgangsAblauf(); a.tu('fachergebnis', { urteil: 'ungeeignet', person: 'L. Müller', notiz: 'Rahmen verzogen' });
  let { html } = a.seite(); sauber(html, 'ungeeignet');
  assert.deepEqual(formIds(html), []); assert.match(html, /Vorgang beendet: Ungeeignet/); assert.match(html, /k-aus/); assert.match(html, /für andere Ziele wieder frei/);
  const b = vorgangsAblauf(); b.tu('abbruch', { grund: 'Projekt gestoppt' });
  ({ html } = b.seite()); sauber(html, 'abgebrochen'); assert.match(html, /Vorgang beendet: Abgebrochen/); assert.match(html, /Projekt gestoppt/);
  // Formular mit Fehlern
  const f = vorgangsAblauf(); const { c, e } = f.seite();
  const res = vorgangSchritt(c, e, 'fachergebnis', { urteil: 'bedingt', person: '', notiz: '' });
  c.ui.vorgangForm = { k: f.key, eingabe: { fachergebnis: { urteil: 'bedingt', person: '', notiz: '' } }, fehler: { fachergebnis: res.fehler }, aktion: 'fachergebnis' };
  const h = entscheidungsSeite(c, c.daten.projekte.find((x) => x.kurz === e.projekt), e); sauber(h, 'Fehler');
  for (const id of ['vf-person', 'vf-notiz']) assert.match(h, new RegExp(`id="${id}"[^>]*aria-invalid="true"[^>]*aria-describedby="[^"]*${id}-f`), id);
  assert.match(h, /id="vf-urteil-bedingt" name="urteil" data-ff="vorgang-fachergebnis" value="bedingt" checked/);
});

test('Entscheidungsseite: E-01 und E-02 bleiben wie bisher bedienbar', () => {
  const c = mitUi(); const e1 = c.daten.entscheidungen.find((e) => e.projekt === 'LH' && e.id === 'E-01'); const e2 = c.daten.entscheidungen.find((e) => e.projekt === 'LH' && e.id === 'E-02');
  const lh = c.daten.projekte.find((x) => x.kurz === 'LH');
  const h1 = entscheidungsSeite(c, lh, e1); sauber(h1, 'E-01');
  assert.match(h1, /id="btn-aufmass-beispiel"/); assert.match(h1, /Rechtzeitigen Eingang zeigen/); assert.match(h1, /id="aktion-schritt"/);
  assert.deepEqual(formIds(h1), ['pruefbitte', 'abbruch']);
  const h2 = entscheidungsSeite(c, lh, e2); sauber(h2, 'E-02'); assert.match(h2, /id="btn-hoeheAm"/); assert.match(h2, /Befund Menge/);
  // Nach „Zur Fachprüfung vorlegen“ (bestehendes Ereignis) wartet der Vorgang wie bisher; Fachergebnis wird bedienbar
  const p = leerePersistenz(); p.ereignisse.push({ at: START, von: 'browser', bauteil: 'LH:DB-01', entscheidung: 'LH:E-02', art: 'vorlage', sim: true, text: 'Variante E-02 zur Fachprüfung vorgelegt.' });
  const c2 = mitUi(p); const e = c2.daten.entscheidungen.find((x) => x.projekt === 'LH' && x.id === 'E-02');
  const h = entscheidungsSeite(c2, c2.daten.projekte.find((x) => x.kurz === 'LH'), e); assert.deepEqual(formIds(h), ['fachergebnis', 'abbruch']);
});

test('Abgleichseite: Prüfbitte-Knopf mit Sperrgrund ist fokussierbar', () => {
  const c = mitUi(); const f = (b, d) => abgleichSeite(c, c.daten.bauteile.find((x) => x.projekt === b[0] && x.id === b[1]), c.daten.bedarfe.find((x) => x.projekt === d[0] && x.id === d[1]));
  assert.match(f(['LH', 'TW-01'], ['SB', 'BD-23']), /id="pruefbitte-grund" tabindex="-1"/);
  assert.match(f(['KB', 'TW-05'], ['SB', 'BD-22']), /id="btn-pruefbitte" data-action="pruefbitte-anlegen" data-key="kb-tw-05--sb-bd-22" >/);
});
