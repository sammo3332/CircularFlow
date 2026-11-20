// Tests des Abgleichs (Fassung 2, Entwurfsregel). Aufruf vom Repository-Root:
// node --test plattform/test/abgleich.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCase } from '../../prototype/dist/rules.mjs';
import { DEMO_CASES } from '../../prototype/dist/scenarios.mjs';
import { abgleich, abgleichListe, abgleichSchluessel, loeseAbgleichSchluessel, pruefbitteAnlegen, ERGEBNIS } from '../app/abgleich.js';
import { leerePersistenz } from '../app/zustand.js';
import { kontext, kleinKontext, bauteil, bedarf, START } from './_hilfe.mjs';

const ctx = kontext();
const tw05 = bauteil(ctx, 'KB', 'TW-05'); const tw01 = bauteil(ctx, 'LH', 'TW-01'); const t31 = bauteil(ctx, 'KB', 'T-31');
const bd21 = bedarf(ctx, 'SB', 'BD-21'); const bd22 = bedarf(ctx, 'SB', 'BD-22'); const bd23 = bedarf(ctx, 'SB', 'BD-23');

// ---------- Die drei Demo-Fälle (Abschnitt 6) ----------
test('Demo 1: TW-05 → BD-22 ist „Weiter prüfen“ mit Reserve, Prüfpunkten und symbolischer Entfernung', () => {
  const a = abgleich(ctx, tw05, bd22);
  assert.equal(a.gesamt.key, 'weiter'); assert.equal(a.gesamt.label, 'Weiter prüfen');
  assert.equal(a.zeit.pruefbeginn, '2026-11-18'); assert.equal(a.zeit.pruefende, '2026-11-28');
  assert.equal(a.zeit.reserveTage, 58);
  assert.deepEqual(a.zeit.uebergabe, { fruehestens: '2027-02-01', von: '2027-02-01', bis: '2027-03-31' });
  assert.equal(a.menge.status, 'gedeckt'); assert.equal(a.menge.einheit, 'lfm');
  assert.deepEqual(a.zeit.geschaetzt, ['Mindestprüfzeit', 'Annahmefenster']);
  assert.ok(a.pruefpunkte.some((p) => p.art === 'eignung' && p.rolle === 'fach'));
  assert.ok(a.pruefpunkte.some((p) => p.art === 'geschaetzt'));
  assert.equal(a.entfernung.symbolisch, true); assert.ok(a.entfernung.km > 0); assert.match(a.entfernung.text, /Lage symbolisch/);
  assert.equal(a.pruefbitteMoeglich, true); assert.equal(a.sperrgrund, null);
  assert.equal(a.schluessel, 'kb-tw-05--sb-bd-22');
});

test('Demo 2: TW-01 → BD-23 ist zu spät, genaue Tageszahl, Zwischenlagerung als Prüfpunkt, Prüfbitte gesperrt', () => {
  const a = abgleich(ctx, tw01, bd23);
  assert.equal(a.gesamt.key, 'spaet'); assert.equal(a.gesamt.label, 'Für diese Entscheidung zu spät');
  assert.equal(a.zeit.gruende[0], 'Prüfende 02.12.2026 liegt 5 Tage nach der Bestellfrist 27.11.2026.');
  assert.equal(a.pruefbitteMoeglich, false); assert.match(a.sperrgrund, /zu spät.*5 Tage/);
  const lager = a.pruefpunkte.find((p) => p.art === 'zwischenlager');
  assert.match(lager.text, /40 Tage/);
});

test('Demo 3: T-31 → BD-21 nennt alle fehlenden Angaben, Prüfbitte gesperrt', () => {
  const a = abgleich(ctx, t31, bd21);
  assert.equal(a.gesamt.key, 'fehlt'); assert.equal(a.gesamt.label, 'Angaben fehlen');
  assert.deepEqual(a.zeit.gruende, ['Bestellfrist fehlt.', 'Mindestprüfzeit fehlt.', 'Annahmefenster (Beginn) fehlt.', 'Annahmefenster (Ende) fehlt.']);
  assert.equal(a.menge.status, 'gedeckt');
  assert.equal(a.pruefbitteMoeglich, false); assert.match(a.sperrgrund, /Angaben fehlen/);
  assert.equal(a.zeit.pruefende, null, 'kein Zeitergebnis ohne Prüfzeit');
});

test('Ergebnis-Bezeichnungen und Töne sind als Konstante vorhanden', () => {
  assert.deepEqual(Object.keys(ERGEBNIS).sort(), ['fehlt', 'klaerung', 'knapp', 'spaet', 'weiter']);
  for (const v of Object.values(ERGEBNIS)) assert.ok(v.label && v.ton);
});

// ---------- Grenzfälle der Zeitprüfung ----------
const wand = (extra = {}) => ({ projekt: 'KB', id: 'TW-X', gruppe: 'wand', menge: 100, verfuegbarAb: '2027-02-01', erfassung: { am: '2026-11-05T09:00' }, ...extra });
const nachfrage = (extra = {}) => ({ projekt: 'SB', id: 'BD-X', gruppe: 'wand', menge: 60, einheit: 'lfm', bestellfrist: '2027-03-31', pruefzeitTage: 10, annahmeVon: '2027-02-01', annahmeBis: '2027-03-31', angelegt: '2026-11-10', ...extra });
const pruefe = (b, d, at = START) => abgleich(kleinKontext([b], [d], at), b, d);

test('Grenze: Prüfende = Bestellfrist ist knapp (0 Tage Reserve), einen Tag später zu spät', () => {
  const knapp = pruefe(wand(), nachfrage({ bestellfrist: '2026-11-28', pruefzeitTage: 10 }));
  assert.equal(knapp.gesamt.key, 'knapp'); assert.equal(knapp.zeit.reserveTage, 0); assert.equal(knapp.zeit.pruefende, '2026-11-28');
  const spaet = pruefe(wand(), nachfrage({ bestellfrist: '2026-11-27', pruefzeitTage: 10 }));
  assert.equal(spaet.gesamt.key, 'spaet'); assert.match(spaet.zeit.gruende[0], /liegt 1 Tag nach der Bestellfrist/);
  const davor = pruefe(wand(), nachfrage({ bestellfrist: '2026-11-29', pruefzeitTage: 10 }));
  assert.equal(davor.gesamt.key, 'weiter'); assert.equal(davor.zeit.reserveTage, 1);
});

test('Grenze: ein Überlappungstag genügt (knapp); kein Tag ist zu spät', () => {
  // Frühester Übergabetag = Verfügbar ab 01.02.2027 = Ende des Annahmefensters.
  const eintag = pruefe(wand(), nachfrage({ annahmeVon: '2026-12-01', annahmeBis: '2027-02-01' }));
  assert.equal(eintag.gesamt.key, 'knapp'); assert.equal(eintag.zeit.reserveTage, 0);
  const keiner = pruefe(wand(), nachfrage({ annahmeVon: '2026-12-01', annahmeBis: '2027-01-31' }));
  assert.equal(keiner.gesamt.key, 'spaet'); assert.match(keiner.zeit.gruende[0], /Frühester Übergabetag 01\.02\.2027 liegt 1 Tag nach dem Ende des Annahmefensters 31\.01\.2027/);
});

test('Prüfbeginn: spätester Tag aus Stichtag, Erfassung des Angebots und Anlage des Bedarfs', () => {
  assert.equal(pruefe(wand(), nachfrage()).zeit.pruefbeginn, '2026-11-18');
  assert.equal(pruefe(wand({ erfassung: { am: '2026-11-25T08:00' } }), nachfrage()).zeit.pruefbeginn, '2026-11-25');
  assert.equal(pruefe(wand(), nachfrage({ angelegt: '2026-11-30' })).zeit.pruefbeginn, '2026-11-30');
  // Die Projektzeit selbst ist die ausdrücklich geprüfte Zeit: später gesetzt, kippt das Ergebnis.
  const dd = nachfrage({ bestellfrist: '2026-11-30', pruefzeitTage: 5 });
  assert.equal(pruefe(wand(), dd, '2026-11-20T09:00').gesamt.key, 'weiter');
  const spaeter = pruefe(wand(), dd, '2026-11-26T09:00');
  assert.equal(spaeter.gesamt.key, 'spaet'); assert.match(spaeter.zeit.gruende[0], /Prüfende 01\.12\.2026 liegt 1 Tag nach/);
  const nachFrist = pruefe(wand(), dd, '2026-12-02T09:00');
  assert.match(nachFrist.zeit.gruende[0], /Prüfbeginn 02\.12\.2026 \(Stichtag der Demo\) liegt 2 Tage nach/);
});

test('Zwischenlagerung ist ein Prüfpunkt mit Dauer, kein Ausschluss', () => {
  const a = pruefe(wand({ verfuegbarAb: '2026-12-01' }), nachfrage({ annahmeVon: '2027-01-15' }));
  assert.equal(a.gesamt.key, 'weiter'); assert.equal(a.zeit.lagertage, 45);
  assert.match(a.pruefpunkte.find((p) => p.art === 'zwischenlager').text, /45 Tage/);
  assert.equal(pruefe(wand(), nachfrage()).pruefpunkte.some((p) => p.art === 'zwischenlager'), false);
});

test('Endet die Verfügbarkeit vor dem Prüfende, entsteht ein Prüfpunkt', () => {
  const a = pruefe(wand({ verfuegbarAb: '2026-11-19', verfuegbarBis: '2026-11-20' }), nachfrage());
  assert.equal(a.gesamt.key, 'weiter');
  assert.match(a.pruefpunkte.find((p) => p.art === 'verfuegbarkeit').text, /20\.11\.2026.*28\.11\.2026/);
  assert.equal(pruefe(wand({ verfuegbarBis: '2027-03-31' }), nachfrage()).pruefpunkte.some((p) => p.art === 'verfuegbarkeit'), false, 'verfügbar bis zählt nicht als fehlende Angabe oder Ausschluss');
});

test('Widersprüche gehen vor jedem Zeitergebnis (Klärung nötig)', () => {
  const fall = (extra, text) => { const a = pruefe(wand(), nachfrage(extra)); assert.equal(a.gesamt.key, 'klaerung', text); assert.ok(a.zeit.gruende.length); assert.equal(a.pruefbitteMoeglich, false); return a; };
  fall({ annahmeVon: '2027-04-01', annahmeBis: '2027-03-01' }, 'Beginn nach Ende');
  fall({ annahmeBis: '2027-02-30' }, 'ungültiges Datum');
  fall({ bestellfrist: 'morgen' }, 'ungültige Frist');
  fall({ pruefzeitTage: 400 }, 'Prüfzeit über 365');
  fall({ pruefzeitTage: -1 }, 'Prüfzeit negativ');
  fall({ pruefzeitTage: 'abc' }, 'Prüfzeit kein Zahlenwert');
  assert.equal(pruefe(wand({ verfuegbarBis: '2027-01-01' }), nachfrage()).gesamt.key, 'klaerung', 'verfügbar bis vor verfügbar ab');
  // Auch ein sonst eindeutig verspäteter Fall bleibt bei Widerspruch ohne Zeitergebnis.
  assert.equal(pruefe(wand(), nachfrage({ bestellfrist: '2026-11-01', annahmeVon: '2027-04-01', annahmeBis: '2027-03-01' })).gesamt.key, 'klaerung');
});

test('Andere Gruppe oder Einheit: Klärung nötig, keine Umrechnung', () => {
  const einheit = pruefe(wand(), nachfrage({ einheit: 'Stk' }));
  assert.equal(einheit.gesamt.key, 'klaerung'); assert.match(einheit.zeit.gruende[0], /Einheiten unterscheiden sich.*nicht umgerechnet/);
  const gruppe = pruefe(wand(), nachfrage({ gruppe: 'tuer', einheit: 'Stk' }));
  assert.equal(gruppe.gesamt.key, 'klaerung'); assert.match(gruppe.zeit.gruende[0], /unterschiedliche Bauteilgruppen/);
});

test('Zu spät ist auch bei sonst fehlenden Angaben sicher; fehlende Angaben werden vollständig genannt', () => {
  const spaet = pruefe(wand(), { projekt: 'SB', id: 'BD-Y', gruppe: 'wand', menge: 10, einheit: 'lfm', bestellfrist: '2026-11-10' });
  assert.equal(spaet.gesamt.key, 'spaet'); assert.match(spaet.zeit.gruende[0], /Prüfbeginn 18\.11\.2026.*8 Tage nach der Bestellfrist 10\.11\.2026/);
  // Annahmefenster endet vor „verfügbar ab“: sicher zu spät, obwohl Frist und Prüfzeit fehlen.
  const fenster = pruefe(wand(), { projekt: 'SB', id: 'BD-Y', gruppe: 'wand', menge: 10, einheit: 'lfm', annahmeBis: '2027-01-15' });
  assert.equal(fenster.gesamt.key, 'spaet'); assert.match(fenster.zeit.gruende[0], /Verfügbar ab 01\.02\.2027 liegt 17 Tage nach dem Ende des Annahmefensters 15\.01\.2027/);
  const fehlt = pruefe(wand({ verfuegbarAb: null }), { projekt: 'SB', id: 'BD-Y', gruppe: 'wand', menge: 10, einheit: 'lfm' });
  assert.equal(fehlt.gesamt.key, 'fehlt');
  assert.deepEqual(fehlt.fehlend, ['Bestellfrist', 'Mindestprüfzeit', 'Annahmefenster (Beginn)', 'Annahmefenster (Ende)', 'Verfügbar ab (Angebot)']);
  assert.match(fehlt.naechsterSchritt.text, /Fehlende Angaben ergänzen/);
});

test('Menge: gedeckt, teilweise mit Lücke, fehlend; Einheit aus der Gruppe', () => {
  const teil = pruefe(wand({ menge: 42 }), nachfrage());
  assert.equal(teil.menge.status, 'teilweise'); assert.equal(teil.menge.luecke, 18); assert.equal(teil.gesamt.key, 'weiter');
  assert.ok(teil.pruefpunkte.some((p) => p.art === 'teilmenge' && /18 lfm/.test(p.text)));
  const fehlt = pruefe(wand({ menge: null }), nachfrage());
  assert.equal(fehlt.menge.status, 'fehlt'); assert.equal(fehlt.gesamt.key, 'fehlt'); assert.ok(fehlt.fehlend.includes('Menge'));
  assert.equal(pruefe(wand({ menge: 60 }), nachfrage()).menge.status, 'gedeckt', 'genau passende Menge ist gedeckt');
});

test('Geschätzte Angaben werden am Ergebnis genannt', () => {
  const a = pruefe(wand(), nachfrage({ belegt: { bestellfrist: 'geschaetzt', pruefzeitTage: 'belegt', annahme: 'geschaetzt' } }));
  assert.deepEqual(a.zeit.geschaetzt, ['Bestellfrist', 'Annahmefenster']);
  assert.deepEqual(pruefe(wand(), nachfrage({ belegt: { bestellfrist: 'belegt' } })).zeit.geschaetzt, []);
});

// ---------- Doppelboden ----------
test('Doppelboden: Deckung aus der Bodenregel, nur im selben Projekt', () => {
  const db01 = bauteil(ctx, 'LH', 'DB-01'); const bd01 = bedarf(ctx, 'LH', 'BD-01'); const db11 = bauteil(ctx, 'KB', 'DB-11');
  const a = abgleich(ctx, db01, bd01);
  assert.equal(a.menge.status, 'gedeckt'); assert.equal(a.menge.einheit, 'm²'); assert.equal(a.menge.bedarf, 79.2);
  assert.match(a.menge.quelle, /Bodenregel/);
  const ueber = abgleich(ctx, db11, bd01);
  assert.equal(ueber.typ.ok, false); assert.equal(ueber.gesamt.key, 'klaerung'); assert.equal(ueber.pruefbitteMoeglich, false);
  assert.match(ueber.sperrgrund, /selben Projekts/);
  assert.equal(abgleichListe(ctx).some((x) => x.bauteil.id === 'DB-11'), false, 'keine Doppelboden-Paare über Projekte');
});

// ---------- Liste ----------
test('abgleichListe: gleiche Gruppe, ohne „nicht“ und ohne aktive Vorgänge, sinnvoll sortiert', () => {
  const l = abgleichListe(ctx);
  const ids = l.map((x) => `${x.bauteil.id}>${x.bedarf.id}`);
  assert.ok(ids.includes('TW-05>BD-22') && ids.includes('TW-01>BD-23') && ids.includes('T-31>BD-21'));
  assert.ok(l.every((x) => x.bauteil.gruppe === x.bedarf.gruppe));
  assert.ok(!ids.some((i) => i.startsWith('T-11>') || i.startsWith('LE-01>')), 'Status „nicht“ ausgenommen');
  assert.ok(!ids.some((i) => i.startsWith('T-07>') || i.startsWith('DB-01>')), 'E-01 und E-02 sind aktive Vorgänge');
  assert.ok(!ids.some((i) => i.startsWith('T-12>')), 'festes Ziel ausgenommen');
  const rang = ['weiter', 'knapp', 'fehlt', 'klaerung', 'spaet'];
  assert.deepEqual(l.map((x) => rang.indexOf(x.gesamt.key)), [...l.map((x) => rang.indexOf(x.gesamt.key))].sort((x, y) => x - y));
  assert.deepEqual(abgleichListe(ctx, { ergebnis: 'spaet' }).map((x) => x.schluessel), ['kb-tw-05--sb-bd-23', 'lh-tw-01--sb-bd-23']);
  assert.equal(abgleichListe(ctx, { bauteil: { projekt: 'KB', id: 'TW-05' } }).length, 2);
  assert.equal(abgleichListe(ctx, { bedarf: { projekt: 'SB', id: 'BD-21' } }).length, 4);
  assert.equal(abgleichListe(ctx, { ergebnis: ['weiter', 'fehlt'] }).length, l.filter((x) => ['weiter', 'fehlt'].includes(x.gesamt.key)).length);
});

// ---------- Schlüssel ----------
test('Abgleich-Schlüssel: bilden und auflösen, auch mit Bindestrichen in den IDs', () => {
  const s = abgleichSchluessel(t31, bd21);
  assert.equal(s, 'kb-t-31--sb-bd-21');
  const r = loeseAbgleichSchluessel(ctx, s);
  assert.equal(r.bauteil, t31); assert.equal(r.bedarf, bd21);
  assert.equal(loeseAbgleichSchluessel(ctx.daten, 'LH-DB-01--LH-BD-01').bauteil.id, 'DB-01', 'Groß- und Kleinschreibung egal, Daten statt Kontext');
  for (const schlecht of ['', 'kb-t-31', 'kb-t-31--sb-bd-99', 'xx-t-31--sb-bd-21', 'a--b--c', null]) assert.equal(loeseAbgleichSchluessel(ctx, schlecht), null, String(schlecht));
});

// ---------- Prüfbitte ----------
test('Prüfbitte: legt Zuordnung und Ereignis mit Schnappschuss an; gesperrte Fälle liefern einen Fehler', () => {
  const r = pruefbitteAnlegen(ctx, abgleich(ctx, tw05, bd22));
  assert.equal(r.zuordnung.id, 'E-01'); assert.equal(r.zuordnung.projekt, 'KB'); assert.equal(r.zuordnung.regel, 'einfach');
  assert.deepEqual(r.zuordnung.ziel, { art: 'bedarf', id: 'BD-22', projekt: 'SB' });
  assert.equal(r.ereignis.art, 'pruefbitte'); assert.equal(r.ereignis.entscheidung, 'KB:E-01'); assert.equal(r.ereignis.at, START);
  assert.equal(r.ereignis.von, 'browser'); assert.equal(r.ereignis.sim, true);
  assert.equal(r.ereignis.schnappschuss.gesamt.key, 'weiter'); assert.equal(r.ereignis.schnappschuss.zeit.reserveTage, 58);
  assert.equal(JSON.stringify(JSON.parse(JSON.stringify(r.ereignis))), JSON.stringify(r.ereignis), 'nur Daten');
  const gesperrt = pruefbitteAnlegen(ctx, abgleich(ctx, tw01, bd23));
  assert.match(gesperrt.fehler.allgemein, /zu spät/);
  // Nach der Prüfbitte ist das Paar nicht mehr passend und das Bauteil gesperrt.
  const p = leerePersistenz(); p.zuordnungen.push(r.zuordnung); p.ereignisse.push(r.ereignis);
  const danach = kontext(p);
  assert.equal(abgleichListe(danach).some((x) => x.bauteil.id === 'TW-05'), false);
  assert.match(abgleich(danach, bauteil(danach, 'KB', 'TW-05'), bedarf(danach, 'SB', 'BD-23')).sperrgrund, /Vorgang E-01/);
  assert.match(abgleich(danach, bauteil(danach, 'LH', 'TW-01'), bedarf(danach, 'SB', 'BD-22')).sperrgrund, /Bedarf gehört bereits/);
});

// ---------- Parität zu evaluateCase (prototype/dist/rules.mjs) ----------
// Abbildung der Testfall-Felder auf Bauteil und Bedarf des Abgleichs:
//   receivedAt (Eingang) → Stichtag der Projektzeit (Prüfbeginn); knownAt → Erfassung des Angebots und Anlage des Bedarfs;
//   deadline → bestellfrist; leadDays → pruefzeitTage; pickupStart/pickupEnd → verfuegbarAb/verfuegbarBis;
//   needStart/needEnd → annahmeVon/annahmeBis; offerQty/needQty → Menge (Einheit lfm, Gruppe wand).
function ausFall(f) {
  const b = { projekt: 'X', id: 'TW-P', gruppe: 'wand', menge: Number(f.offerQty), verfuegbarAb: f.pickupStart || null, verfuegbarBis: f.pickupEnd || null, erfassung: { am: `${f.knownAt}T08:00` } };
  const d = { projekt: 'Y', id: 'BD-P', gruppe: 'wand', einheit: 'lfm', menge: Number(f.needQty), bestellfrist: f.deadline || null, pruefzeitTage: f.leadDays === '' ? null : Number(f.leadDays), annahmeVon: f.needStart, annahmeBis: f.needEnd, angelegt: f.knownAt };
  return abgleich(kleinKontext([b], [d], `${f.receivedAt}T09:00`), b, d);
}
const TAG = 86_400_000;
const tageZwischen = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / TAG);

test('Parität: CF-DEMO-01 bis -03 liefern dieselbe Einordnung wie evaluateCase', () => {
  const erwartet = { 'CF-DEMO-01': ['review', ['weiter']], 'CF-DEMO-02': ['late', ['spaet']], 'CF-DEMO-03': ['clarify', ['fehlt']] };
  for (const f of DEMO_CASES) {
    const alt = evaluateCase(f); const neu = ausFall(f);
    assert.equal(alt.kind, erwartet[f.id][0], f.id);
    assert.ok(erwartet[f.id][1].includes(neu.gesamt.key), `${f.id}: ${neu.gesamt.key}`);
  }
  // Reserve: evaluateCase nennt 7 Kalendertage bis zur Frist, der Abgleich zieht die Prüfzeit ab (3 Tage): 4.
  const f1 = DEMO_CASES[0];
  assert.equal(tageZwischen(f1.receivedAt, f1.deadline), 7);
  assert.equal(ausFall(f1).zeit.reserveBestellung, 7 - Number(f1.leadDays));
  assert.deepEqual(evaluateCase(f1).estimates, ['Mindestprüfzeit', 'Übergabefenster'], 'evaluateCase kennt Übergabefenster statt Annahmefenster');
  assert.match(ausFall(DEMO_CASES[2]).zeit.gruende.join(' '), /Bestellfrist fehlt/);
});

test('Parität: Grenztag, zu kurze Prüfzeit und Widerspruch wie in evaluateCase', () => {
  const b = DEMO_CASES[0];
  const grenze = { ...b, leadDays: '7' }; // Eingang 05.02. + 7 = Frist 12.02.: rechtzeitig
  assert.equal(evaluateCase(grenze).kind, 'review'); assert.equal(ausFall(grenze).gesamt.key, 'knapp');
  const zuKurz = { ...b, leadDays: '8' };
  assert.equal(evaluateCase(zuKurz).kind, 'late'); assert.equal(ausFall(zuKurz).gesamt.key, 'spaet');
  const widerspruch = { ...b, needStart: '2027-03-05', needEnd: '2027-03-02' };
  assert.equal(evaluateCase(widerspruch).kind, 'clarify'); assert.equal(ausFall(widerspruch).gesamt.key, 'klaerung');
  const spaetUndWiderspruch = { ...widerspruch, receivedAt: '2027-02-15' };
  assert.equal(evaluateCase(spaetUndWiderspruch).kind, 'clarify'); assert.equal(ausFall(spaetUndWiderspruch).gesamt.key, 'klaerung', 'Widerspruch vor Zeitergebnis');
});

test('Parität: dokumentierte Abweichungen (Erweiterungen gegenüber evaluateCase)', () => {
  const b = DEMO_CASES[0];
  // 1. Kein gemeinsamer Tag, Annahme beginnt nach der Verfügbarkeit: evaluateCase klärt, der Abgleich prüft weiter mit Zwischenlagerung.
  const spaeterBedarf = { ...b, pickupStart: '2027-02-01', pickupEnd: '2027-02-05', needStart: '2027-02-24', needEnd: '2027-03-02' };
  assert.equal(evaluateCase(spaeterBedarf).kind, 'clarify');
  const a = ausFall(spaeterBedarf); assert.equal(a.gesamt.key, 'weiter'); assert.ok(a.pruefpunkte.some((p) => p.art === 'zwischenlager'));
  // 2. Annahme endet vor dem frühesten Übergabetag: evaluateCase klärt, der Abgleich ist sicher zu spät.
  const zuFrueh = { ...b, pickupStart: '2027-02-22', pickupEnd: '2027-02-26', needStart: '2027-02-01', needEnd: '2027-02-05' };
  assert.equal(evaluateCase(zuFrueh).kind, 'clarify'); assert.equal(ausFall(zuFrueh).gesamt.key, 'spaet');
  // 3. Teilmenge: evaluateCase klärt, der Abgleich prüft weiter und nennt die Lücke als Prüfpunkt.
  const teil = { ...b, offerQty: '10' };
  assert.equal(evaluateCase(teil).kind, 'clarify');
  const t = ausFall(teil); assert.equal(t.gesamt.key, 'weiter'); assert.equal(t.menge.luecke, 8);
});

test('Schlüssel: nur ASCII, Doppelbindestrich als Trenner, Rundreise für alle Kombinationen', () => {
  const ctx = kontext();
  for (const b of ctx.daten.bauteile) for (const d of ctx.daten.bedarfe) {
    const k = abgleichSchluessel(b, d);
    assert.match(k, /^[a-z0-9]+(-[a-z0-9]+)*--[a-z0-9]+(-[a-z0-9]+)*$/, k);
    assert.equal(k.split('--').length, 2, `genau ein Trenner: ${k}`);
    const r = loeseAbgleichSchluessel(ctx, k);
    assert.equal(`${r.bauteil.projekt}:${r.bauteil.id}|${r.bedarf.projekt}:${r.bedarf.id}`, `${b.projekt}:${b.id}|${d.projekt}:${d.id}`);
  }
});
