// Rendert jede Ansicht in Node für alle Beispielobjekte und prüft, dass nichts Kaputtes im HTML steht.
// Außerdem: Jede Zahl auf der Übersicht stimmt mit der Zahl der Einträge im Ziel überein.
import test from 'node:test';
import assert from 'node:assert/strict';
import { kontext, START } from './_hilfe.mjs';
import { leerePersistenz } from '../app/zustand.js';
import { PROJEKTZEITEN } from '../app/daten.js';
import { neuerUiZustand, leererKatalog, leereBedarfsliste, leererBestand } from '../app/uizustand.js';
import { kennzahlen } from '../app/kennzahlen.js';
import { abgleichListe, pruefbitteAnlegen, abgleichSchluessel, loeseAbgleichSchluessel } from '../app/abgleich.js';
import { uebersicht } from '../app/ansichten/uebersicht.js';
import { katalog } from '../app/ansichten/katalog.js';
import { bedarfe, bedarfDetail, bedarfNeuPlatzhalter } from '../app/ansichten/bedarfe.js';
import { abgleichListeSeite, abgleichSeite } from '../app/ansichten/abgleich.js';
import { vorgaenge } from '../app/ansichten/vorgaenge.js';
import { projektNeuPlatzhalter } from '../app/ansichten/folgt.js';
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
  p.bedarfe.push({ projekt: 'SB', id: 'BD-30', gruppe: 'tuer', titel: 'Eigene Türen', raeume: [], etage: null, menge: 4, einheit: 'Stk', text: '', bestellfrist: null, pruefzeitTage: null, annahmeVon: null, annahmeBis: null, anforderungen: '', zustaendig: null, belegt: {}, angelegt: '2026-11-18', herkunft: 'eigene Eingabe in diesem Browser', neu: true });
  return mitUi(p, at);
}

const KONTEXTE = () => [['leer', mitUi()], ['reich', reichKontext()], ...PROJEKTZEITEN.slice(1).map((z) => [`Zeit ${z.at}`, mitUi(leerePersistenz(), z.at)])];

test('Übersicht, Katalog, Bedarfe, Arbeitsliste und Platzhalter rendern ohne Fehler', () => {
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
    sauber(bedarfNeuPlatzhalter(), 'Bedarf neu'); sauber(projektNeuPlatzhalter(), 'Projekt neu');
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
