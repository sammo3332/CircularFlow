// Tests zu den Review-Befunden der Fassung 2 (Befunde 1 bis 15). Aufruf vom Repository-Root:
// node --test plattform/test/befunde.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../../prototype/dist/door-rules.mjs';
import { kontext, kleinKontext, bauteil, bedarf, entscheidung, START } from './_hilfe.mjs';
import { leerePersistenz, ladePersistenz, SPEICHERSCHLUESSEL } from '../app/zustand.js';
import { neuerUiZustand } from '../app/uizustand.js';
import { abgleich, abgleichListe, pruefbitteAnlegen, pruefbitteErlaubt, reserveText, zuordnungZumBedarf } from '../app/abgleich.js';
import { vorgangSchritt, vorgangStatus, bedarfBelegt, uebergebenerVorgang } from '../app/vorgang.js';
import { moeglicheZiele, neueEntscheidung, schluessel, beispielAufmassRechtzeitig } from '../app/regeln.js';
import { kennzahlen } from '../app/kennzahlen.js';
import { neuesKuerzel, projektAusEntwurf, RESERVIERTE_KUERZEL } from '../app/projektanlage.js';
import { PROJEKTE, PROJEKTZEITEN } from '../app/daten.js';
import { entscheidungsSeite } from '../app/ansichten/entscheidung.js';
import { abgleichSeite, abgleichListeSeite } from '../app/ansichten/abgleich.js';
import { pass } from '../app/ansichten/bauteile.js';
import { startseite } from '../app/ansichten/projekte.js';
import { projektUebersicht } from '../app/ansichten/projekte.js';
import { bedarfe as bedarfeSeite } from '../app/ansichten/bedarfe.js';
import { uebersicht } from '../app/ansichten/uebersicht.js';

const mitUi = (p = leerePersistenz(), at = START) => ({ ...kontext(p, at), ui: neuerUiZustand(), geo: null, eigeneAenderungen: 0 });

// Zuordnung wie im Bauteilpass (main.js zuordnen): neue Entscheidung ohne Prüfbitte.
function imPass(p, projekt, bauteilId, ziel) {
  const c = kontext(p, START);
  const e = neueEntscheidung(c, bauteil(c, projekt, bauteilId), ziel);
  p.zuordnungen.push(e);
  return e;
}
const seite = (c, e) => entscheidungsSeite(c, c.daten.projekte.find((x) => x.kurz === e.projekt), e);
const formIds = (html) => [...html.matchAll(/<form class="vorgangsform[^"]*" id="vform-([a-z-]+)"/g)].map((m) => m[1]);

// Ablauf TW-05 → BD-22 über die Prüfbitte; Ereignisse mit steigender Projektzeit.
function ablauf() {
  const p = leerePersistenz(); const c0 = kontext(p, START);
  const r = pruefbitteAnlegen(c0, abgleich(c0, bauteil(c0, 'KB', 'TW-05'), bedarf(c0, 'SB', 'BD-22')));
  p.zuordnungen.push(r.zuordnung); p.ereignisse.push(r.ereignis);
  const ctx = (at = START) => kontext(p, at);
  const tu = (at, aktion, eingabe) => { const c = ctx(at); const res = vorgangSchritt(c, entscheidung(c, 'KB', 'E-01'), aktion, eingabe); assert.ok(res.ereignis, JSON.stringify(res.fehler)); p.ereignisse.push(res.ereignis); return res; };
  return { p, ctx, tu };
}
function bisUebergeben() {
  const a = ablauf();
  a.tu('2026-11-18T14:30', 'fachergebnis', { urteil: 'geeignet', person: 'L. Müller' });
  a.tu('2026-11-18T15:00', 'vormerkung', { menge: '5', ablauf: '2027-03-01' });
  a.tu('2026-11-19T09:00', 'uebergabe-geplant', { termin: '2027-02-05', ort: 'Lager', rolle: 'bauleitung' });
  a.tu('2027-02-06T09:00', 'uebergeben', { datum: '2027-02-06' });
  return a;
}

test('Befund 1: Prüfbitte nach Zuordnung im Pass nur mit erlaubtem Abgleich (zu spät, Angaben fehlen gesperrt)', () => {
  for (const [bt, d, muster] of [[['LH', 'TW-01'], 'BD-23', /zu spät/i], [['KB', 'T-31'], 'BD-21', /Angaben fehlen/]]) {
    const p = leerePersistenz(); const c0 = kontext(p, START);
    const b = bauteil(c0, ...bt); assert.ok(b, bt.join());
    const ziel = bedarf(c0, 'SB', d);
    const e = imPass(p, b.projekt, b.id, { art: 'bedarf', id: d, projekt: 'SB' });
    const c = kontext(p, START); const ee = entscheidung(c, e.projekt, e.id);
    assert.equal(vorgangStatus(c, ee).erlaubt.includes('pruefbitte'), true, 'die Statusregel allein erlaubt sie, die Fachprüfung muss sperren');
    const r = pruefbitteErlaubt(c, ee);
    assert.equal(r.erlaubt, false, `${b.id} → ${ziel.id}`); assert.match(r.grund, muster);
    const html = seite({ ...c, ui: neuerUiZustand() }, ee);
    assert.deepEqual(formIds(html), ['abbruch']); assert.match(html, /id="pruefbitte-gesperrt"/); assert.equal(html.includes('vform-pruefbitte'), false);
  }
});
test('Befund 1: erlaubter Abgleich TW-05 → BD-22 aus dem Pass bleibt möglich, der eigene Vorgang zählt nicht als Sperrgrund', () => {
  const p = leerePersistenz(); const e = imPass(p, 'KB', 'TW-05', { art: 'bedarf', id: 'BD-22', projekt: 'SB' });
  const c = kontext(p, START); const ee = entscheidung(c, e.projekt, e.id);
  assert.equal(abgleich(c, bauteil(c, 'KB', 'TW-05'), bedarf(c, 'SB', 'BD-22')).pruefbitteMoeglich, false, 'ohne Ausnahme sperrt der laufende Vorgang');
  assert.deepEqual(pruefbitteErlaubt(c, ee), { erlaubt: true, grund: null, ergebnis: 'weiter' });
  assert.deepEqual(formIds(seite({ ...c, ui: neuerUiZustand() }, ee)), ['pruefbitte', 'abbruch']);
  // Nach der Prüfbitte keine zweite
  const res = vorgangSchritt(c, ee, 'pruefbitte', {}); p.ereignisse.push(res.ereignis);
  assert.equal(pruefbitteErlaubt(kontext(p, START), ee).erlaubt, false);
});
test('Befund 1: Türregel – Prüfbitte erst bei Rang 6 (E-01); Ersatz bleibt über „zur Fachprüfung vorlegen“', () => {
  const p = leerePersistenz(); const c = kontext(p, START); const e = entscheidung(c, 'LH', 'E-01');
  const r0 = pruefbitteErlaubt(c, e); assert.equal(r0.erlaubt, false); assert.match(r0.grund, /Türregel/);
  const z = c.daten.zieloeffnungen.find((x) => x.id === e.ziel.id && x.projekt === e.projekt);
  const { aufmass, at } = beispielAufmassRechtzeitig(R, z, START, PROJEKTZEITEN);
  p.ezustand[schluessel('LH', 'E-01')] = { aufmass };
  assert.equal(pruefbitteErlaubt(kontext(p, at), entscheidung(kontext(p, at), 'LH', 'E-01')).erlaubt, true);
  assert.equal(pruefbitteErlaubt(c, null).erlaubt, false);
});

test('Befund 2 und 3: Nach der Übergabe kein Ziel mehr, Bedarf belegt, nicht mehr offen oder zeitkritisch', () => {
  const { ctx } = bisUebergeben(); const c = ctx('2027-02-06T10:00');
  const tw = bauteil(c, 'KB', 'TW-05'); assert.ok(uebergebenerVorgang(c, 'KB', 'TW-05'));
  assert.deepEqual(moeglicheZiele(c, tw), { oeffnungen: [], bedarfe: [] });
  const html = pass({ ...c, ui: neuerUiZustand() }, c.daten.projekte.find((x) => x.kurz === 'KB'), tw);
  assert.match(html, /Abgeschlossen/); assert.equal(html.includes('ziel-wahl'), false); assert.equal(html.includes('Ziel zuordnen'), false);
  // Bedarf
  assert.equal(bedarfBelegt(c, 'SB', 'BD-22'), true);
  assert.ok(!moeglicheZiele(c, bauteil(c, 'LH', 'TW-01')).bedarfe.some((d) => d.id === 'BD-22'));
  const kz = kennzahlen(c, { kritischTage: 90 });
  assert.ok(!kz.bedarfeOffen.eintraege.some((d) => d.id === 'BD-22'));
  assert.ok(!kz.zeitkritisch.eintraege.some((f) => f.art === 'bedarf' && f.id === 'BD-22'));
  assert.ok(!abgleichListe(c).some((a) => a.bedarf.id === 'BD-22'));
  // Zum Vergleich: ohne Übergabe war der Bedarf offen und zeitkritisch
  const k0 = kennzahlen(kontext(leerePersistenz(), '2027-02-06T10:00'), { kritischTage: 90 });
  assert.ok(k0.bedarfeOffen.eintraege.some((d) => d.id === 'BD-22')); assert.ok(k0.zeitkritisch.eintraege.some((f) => f.art === 'bedarf' && f.id === 'BD-22' && f.name === 'Bestellfrist'));
  // Abbruch gibt den Bedarf wieder frei
  const b = ablauf(); b.tu('2026-11-18T14:30', 'abbruch', { grund: 'Test' });
  assert.equal(bedarfBelegt(b.ctx('2026-11-19T10:00'), 'SB', 'BD-22'), false);
});

test('Befund 4: Überfällige Fristen nach dem Fachergebnis stehen in „Zeitkritisch“', () => {
  const a = ablauf();
  a.tu('2026-11-18T14:30', 'fachergebnis', { urteil: 'geeignet', person: 'L. Müller' });
  a.tu('2026-11-18T15:00', 'vormerkung', { menge: '5', ablauf: '2026-11-18' });
  const c = a.ctx('2026-11-19T10:00'); assert.equal(vorgangStatus(c, entscheidung(c, 'KB', 'E-01')).key, 'abgelaufen');
  const f = kennzahlen(c).zeitkritisch.eintraege.find((x) => x.id === 'E-01' && x.projekt === 'KB');
  assert.ok(f, 'abgelaufene Vormerkung fehlt'); assert.equal(f.ueberfaellig, true); assert.equal(f.name, 'Vormerkung abgelaufen');
  assert.equal(kennzahlen(c).zeitkritisch.ueberfaellig >= 1, true);
  // Bestellfrist verstrichen ohne Vormerkung (geeignet)
  const b = ablauf(); b.tu('2026-11-18T14:30', 'fachergebnis', { urteil: 'geeignet', person: 'L. Müller' });
  const spaet = kennzahlen(b.ctx('2027-04-02T10:00')).zeitkritisch.eintraege.find((x) => x.id === 'E-01' && x.projekt === 'KB');
  assert.ok(spaet); assert.equal(spaet.ueberfaellig, true); assert.equal(spaet.name, 'Bestellfrist');
  // Im Bestandsbeispiel ohne Fachergebnis bleibt es bei der Regel (E-01/E-02 unverändert)
  assert.deepEqual(kennzahlen(kontext()).zeitkritisch.eintraege.map((x) => `${x.id}:${x.name}`), ['E-01:Aufmaßfrist', 'E-02:Nachweisfrist', 'E-01:Ersatzentscheidung', 'E-02:Ersatzentscheidung']);
});

test('Befund 5, 9 und 10: „zu spät“ mit negativer Reserve, Übergabe und Lager; nächster Schritt; fehlende Menge in den Gründen', () => {
  const c = kontext(); const a = abgleich(c, bauteil(c, 'LH', 'TW-01'), bedarf(c, 'SB', 'BD-23'));
  assert.equal(a.gesamt.key, 'spaet'); assert.ok(a.zeit.reserveTage < 0, `Reserve ${a.zeit.reserveTage}`);
  assert.match(reserveText(a.zeit.reserveTage), /^−\d+ Tage?, zu spät$/); assert.equal(reserveText(-1), '−1 Tag, zu spät'); assert.equal(reserveText(0), '0 Tage'); assert.equal(reserveText(null), '');
  assert.ok(a.zeit.uebergabe, 'Übergabe berechenbar'); assert.notEqual(a.zeit.lagertage, null);
  const lager = a.pruefpunkte.find((x) => x.art === 'zwischenlager');
  assert.equal(Boolean(lager), a.zeit.lagertage > 0); if (lager) assert.match(lager.text, new RegExp(`${a.zeit.lagertage} Tage`));
  const html = abgleichSeite({ ...c, ui: neuerUiZustand() }, a.bauteil, a.bedarf);
  assert.match(html, /−\d+ Tage?, zu spät/); assert.equal(html.includes('nicht berechenbar'), a.zeit.reserveAnnahme === null || a.zeit.reserveBestellung === null);
  assert.match(html, /Zu spät für diese Entscheidung|Frühester Übergabetag/); assert.doesNotMatch(a.naechsterSchritt.text, /Prüfbitte (an|sofort)/);
  assert.match(abgleichListeSeite({ ...c, ui: { ...neuerUiZustand() } }), /Reserve −\d+ Tage?, zu spät/);
  // Nächster Schritt bei laufendem Vorgang: nicht „Prüfbitte anlegen“, sondern der Vorgang mit Link
  const p = leerePersistenz(); const e = imPass(p, 'KB', 'TW-05', { art: 'bedarf', id: 'BD-22', projekt: 'SB' });
  const c2 = kontext(p, START); const a2 = abgleich(c2, bauteil(c2, 'KB', 'TW-05'), bedarf(c2, 'SB', 'BD-22'));
  assert.equal(a2.gesamt.key, 'weiter'); assert.equal(a2.pruefbitteMoeglich, false);
  assert.doesNotMatch(a2.naechsterSchritt.text, /Prüfbitte an/); assert.match(a2.naechsterSchritt.text, new RegExp(`Vorgang ${e.id} öffnen`));
  assert.match(abgleichSeite({ ...c2, ui: neuerUiZustand() }, a2.bauteil, a2.bedarf), /href="#entscheidung-kb-e-01">Vorgang E-01 öffnen/);
  // Ohne Sperre bleibt es bei der Prüfbitte
  assert.match(abgleich(c, bauteil(c, 'KB', 'TW-05'), bedarf(c, 'SB', 'BD-22')).naechsterSchritt.text, /^Prüfbitte an die Fachprüfung anlegen/);
  // Befund 10: fehlende Menge steht in den Gründen
  for (const mitZeit of [true, false]) {
    const d = { ...bedarf(c, 'SB', mitZeit ? 'BD-22' : 'BD-21'), menge: undefined, bedarfM2: undefined };
    const fehlt = abgleich(c, bauteil(c, 'KB', mitZeit ? 'TW-05' : 'T-31'), d);
    assert.equal(fehlt.gesamt.key, 'fehlt'); assert.ok(fehlt.gruende.some((g) => /Menge/.test(g)), fehlt.gruende.join('|'));
    if (!mitZeit) assert.ok(fehlt.gruende.some((g) => /Bestellfrist/.test(g)), 'auch die übrigen fehlenden Angaben');
  }
});
test('Befund 11: Leertext der Prüfpunkte nennt den wahren Grund', () => {
  const c = mitUi(); const h = abgleichSeite(c, bauteil(c, 'LH', 'T-07'), bedarf(c, 'LH', 'BD-01'));
  assert.doesNotMatch(h, /Keine Prüfpunkte, solange/); assert.match(h, /Keine Prüfpunkte, weil Angebot und Bedarf nicht/);
});

test('Befund 6: Kürzel kollidiert nicht mit festen Routen', () => {
  assert.ok(RESERVIERTE_KUERZEL.includes('neu') && RESERVIERTE_KUERZEL.includes('ergaenzen'));
  for (const name of ['Neumarkt', 'Neustadt Süd', 'Neu', 'Nord Eins Umbau']) {
    const k = neuesKuerzel(name, PROJEKTE); assert.ok(!RESERVIERTE_KUERZEL.includes(k.toLowerCase()), `${name} → ${k}`); assert.match(k, /^[A-Z]{2,3}$/);
  }
  assert.notEqual(neuesKuerzel('Neumarkt', []), 'NEU');
  const pr = projektAusEntwurf({ name: 'Neumarkt', art: 'umbau', bezirk: 'Hörde', etagen: '1', raeume: '1' }, { projekte: PROJEKTE, mitte: [51.4, 7.5], at: START });
  assert.notEqual(pr.kurz.toLowerCase(), 'neu');
});

test('Befund 7: Projektseite zeigt beendete Vorgänge nicht als „zugeordnet“', () => {
  const sb = (c) => c.daten.projekte.find((x) => x.kurz === 'SB');
  const a = ablauf(); const laufend = projektUebersicht(mitUi(a.p, START), sb(mitUi(a.p)));
  assert.match(laufend, /zugeordnet: KB · TW-05/);
  const b = ablauf(); b.tu('2026-11-18T14:30', 'abbruch', { grund: 'Test' });
  const c = mitUi(b.p, '2026-11-19T10:00'); const h = projektUebersicht(c, sb(c));
  assert.doesNotMatch(h, /zugeordnet: KB/);
  const u = bisUebergeben(); const cu = mitUi(u.p, '2027-02-06T10:00'); const hu = projektUebersicht(cu, sb(cu));
  assert.doesNotMatch(hu, /zugeordnet: KB/); assert.match(hu, /übergeben: KB · TW-05/);
  cu.ui.bedarfe = { ...cu.ui.bedarfe, offen: true }; assert.doesNotMatch(bedarfeSeite(cu), /BD-22<\/span><span><a/);
});

test('Befund 8: „Paare derselben Gruppe“ und „davon prüfbar“ entsprechen den Listen', () => {
  for (const at of [START, '2027-01-15T10:00']) {
    const c = mitUi(leerePersistenz(), at); const kz = kennzahlen(c);
    const weiterKnapp = abgleichListe(c).filter((x) => ['weiter', 'knapp'].includes(x.gesamt.key)).length;
    assert.equal(kz.passendePaare.pruefbar, weiterKnapp); assert.ok(kz.passendePaare.anzahl >= kz.passendePaare.pruefbar);
    const k = uebersicht(c); assert.match(k, /Paare derselben Gruppe/); assert.match(k, new RegExp(`davon ${weiterKnapp} prüfbar`));
    c.ui.abgleich.ergebnis = '';
    const l = abgleichListeSeite(c); assert.match(l, /Paare derselben Gruppe/); assert.match(l, new RegExp(`<b class="mono">${kz.passendePaare.anzahl}</b> (Paar|Paare) derselben Gruppe, davon <b class="mono">${weiterKnapp}</b> prüfbar`));
    assert.doesNotMatch(l + k, /Passende Paare/);
    const b = bedarfeSeite(c); assert.match(b, /Angebote derselben Gruppe/); assert.doesNotMatch(b, /Passende Angebote/);
  }
});

test('Befund 13: Fehler der Ergebnisauswahl über aria-describedby am Fieldset und aria-invalid an den Radios', () => {
  const b = ablauf(); const c = { ...b.ctx(START), ui: neuerUiZustand() }; const e = entscheidung(c, 'KB', 'E-01');
  const res = vorgangSchritt(c, e, 'fachergebnis', {}); assert.ok(res.fehler.urteil);
  c.ui.vorgangForm = { k: 'KB:E-01', eingabe: {}, fehler: { fachergebnis: res.fehler }, aktion: 'fachergebnis' };
  const h = seite(c, e);
  assert.doesNotMatch(h, /<fieldset[^>]*aria-invalid/); assert.match(h, /<fieldset[^>]*id="vf-urteil"[^>]*aria-describedby="vf-urteil-f"/);
  assert.equal((h.match(/<input type="radio" id="vf-urteil-[a-z]+"[^>]*aria-invalid="true"/g) || []).length, 3);
  assert.match(h, /id="vf-urteil-f"/);
});

test('Befund 14: gespeicherte Schlüsselfelder werden geprüft, doppelte Kennungen ausgelassen', () => {
  const speicher = (x) => ({ getItem: () => JSON.stringify(x) });
  const e = (id, extra = {}) => ({ projekt: 'KB', id, bauteil: 'TW-05', ziel: { art: 'bedarf', id: 'BD-22', projekt: 'SB' }, regel: 'einfach', angelegt: START, ...extra });
  const bd = (id, projekt = 'SB') => ({ projekt, id, gruppe: 'wand', titel: 'T', menge: 3, einheit: 'lfm' });
  const pe = (kurz, id) => ({ kurz, id, name: 'n', lage: [51.4, 7.5], gebaeude: [] });
  const p = ladePersistenz(speicher({
    version: 1,
    ereignisse: [{ at: START, entscheidung: 'KB:E-01', art: 'aufgabe' }, { at: 5, art: 'aufgabe' }, { at: START, entscheidung: 7 }, [], { text: 'ohne at' }],
    zuordnungen: [e('E-05'), e('E-05'), e(6), e('E-07', { bauteil: 3 }), e('E-08', { ziel: { art: 'bedarf', id: 9 } }), e('E-01', { projekt: 'LH' })],
    bedarfe: [bd('BD-40'), bd('BD-40', 'KB'), bd(41), bd('BD-22')],
    projekteEigen: [pe('XYZ', 'P-EIGEN-01'), pe('xyz', 'P-EIGEN-02'), pe(5, 'P-EIGEN-03'), pe('KB', 'P-EIGEN-04'), pe('QQ', 9)],
  }));
  assert.deepEqual(p.ereignisse.map((x) => x.at ?? null), [START, null]);
  assert.deepEqual(p.zuordnungen.map((x) => x.id), ['E-05']);
  assert.deepEqual(p.bedarfe.map((x) => `${x.projekt}:${x.id}`), ['SB:BD-40']);
  assert.deepEqual(p.projekteEigen.map((x) => x.kurz), ['XYZ']);
});

test('Befund 15: Rückdatierte Einträge werden abgelehnt', () => {
  const a = ablauf(); a.tu('2026-11-19T10:00', 'fachergebnis', { urteil: 'geeignet', person: 'L. Müller' });
  const c = a.ctx('2026-11-18T14:00'); const r = vorgangSchritt(c, entscheidung(c, 'KB', 'E-01'), 'vormerkung', { menge: '5', ablauf: '2027-03-01' });
  assert.match(r.fehler.allgemein, /Es gibt Einträge nach diesem Stichtag\. Stichtag auf .*19\.11\., 10:00 oder später stellen\./);
  // Zur selben oder späteren Projektzeit ist der Schritt möglich
  for (const at of ['2026-11-19T10:00', '2026-11-20T08:00']) { const c2 = a.ctx(at); assert.ok(vorgangSchritt(c2, entscheidung(c2, 'KB', 'E-01'), 'vormerkung', { menge: '5', ablauf: '2027-03-01' }).ereignis, at); }
  // Ereignisse anderer Vorgänge zählen nicht
  const k = kontext(); assert.ok(vorgangSchritt(k, entscheidung(k, 'LH', 'E-01'), 'abbruch', { grund: 'x' }).ereignis);
});

test('Nachprüfung: Im Pass ist ein Bedarf mit „zu spät“ nicht zuordenbar, „Angaben fehlen“ schon', () => {
  const c = mitUi();
  const tw01 = bauteil(c, 'LH', 'TW-01');
  assert.equal(zuordnungZumBedarf(c, tw01, bedarf(c, 'SB', 'BD-23')).moeglich, false);
  assert.equal(zuordnungZumBedarf(c, bauteil(c, 'KB', 'T-31'), bedarf(c, 'SB', 'BD-21')).moeglich, true);
  const p = PROJEKTE.find((x) => x.kurz === 'LH');
  const html = pass(c, p, tw01);
  assert.match(html, /<option value="bedarf\|SB\|BD-23"\s+disabled>[^<]*Für diese Entscheidung zu spät/);
});

test('Nachprüfung: Die Kartenseite zeigt wieder zwei offene Entscheidungen mit Frist und Zuständigkeit (Fassung 1.1)', () => {
  const html = startseite(mitUi());
  const karten = html.match(/<a class="offen-karte" href="#entscheidung-[a-z0-9-]+"/g) || [];
  assert.equal(karten.length, 2);
  const abschnitt = html.slice(html.indexOf('class="offene"'), html.indexOf('class="filterleiste"'));
  assert.equal((abschnitt.match(/<small>Frist<\/small>/g) || []).length, 2);
  assert.equal((abschnitt.match(/<small>Zuständig<\/small>/g) || []).length, 2);
  assert.ok(html.indexOf('class="offene"') < html.indexOf('id="karte"'), 'Karten stehen vor der Karte');
});

test('Nachprüfung: Der Pass nennt gesperrte Bedarfe am Feld und zeigt ohne wählbares Ziel keinen Knopf', () => {
  const lh = PROJEKTE.find((x) => x.kurz === 'LH'); const kb = PROJEKTE.find((x) => x.kurz === 'KB');
  const c = mitUi();
  const html = pass(c, lh, bauteil(c, 'LH', 'TW-01'));
  assert.match(html, /<select id="ziel-wahl"[^>]*aria-describedby="ziel-hinweis"/);
  assert.match(html, /<p class="feld-hinweis" id="ziel-hinweis">Nicht wählbar: <a href="#abgleich-lh-tw-01--sb-bd-23">SB · BD-23<\/a> \(Für diese Entscheidung zu spät\)/);
  // Bestellfrist von BD-22 vor dem Prüfende: dann ist auch BD-22 zu spät und für TW-01 kein Ziel mehr wählbar.
  const pers = leerePersistenz(); pers.bedarfAenderungen = { 'SB:BD-22': { bestellfrist: '2026-11-20' } };
  const c2 = mitUi(pers);
  assert.equal(zuordnungZumBedarf(c2, bauteil(c2, 'LH', 'TW-01'), bedarf(c2, 'SB', 'BD-22')).moeglich, false);
  const html2 = pass(c2, lh, bauteil(c2, 'LH', 'TW-01'));
  assert.doesNotMatch(html2, /id="ziel-wahl"/);
  assert.doesNotMatch(html2, /id="btn-zuordnen"/);
  assert.match(html2, /<p class="leer-zeile" id="ziel-hinweis">Zurzeit ist kein Ziel zuordenbar\. Nicht wählbar: .*BD-22.*BD-23/);
  // T-31 (nächste Handlung „zuordnen“): ohne Sperre Knopf „Ziel zuordnen“ und kein Hinweis …
  assert.match(pass(c, kb, bauteil(c, 'KB', 'T-31')), /data-action="zum-ziel"/);
  assert.doesNotMatch(pass(c, kb, bauteil(c, 'KB', 'T-31')), /id="ziel-hinweis"/);
  // … ist BD-21 sicher zu spät, gibt es keinen Knopf mehr, und die Handlung nennt den Grund.
  const pers3 = leerePersistenz(); pers3.bedarfAenderungen = { 'SB:BD-21': { bestellfrist: '2026-11-20', pruefzeitTage: 14 } };
  const c3 = mitUi(pers3);
  const html3 = pass(c3, kb, bauteil(c3, 'KB', 'T-31'));
  assert.doesNotMatch(html3, /data-action="zum-ziel"/);
  assert.match(html3, /Zurzeit ist kein Ziel zuordenbar: Der Abgleich schließt die vorhandenen Bedarfe aus/);
});
