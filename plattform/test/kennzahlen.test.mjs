// Tests der Kennzahlen der Übersicht. Aufruf vom Repository-Root: node --test plattform/test/kennzahlen.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kennzahlen, monatLabel } from '../app/kennzahlen.js';
import { abgleich, pruefbitteAnlegen } from '../app/abgleich.js';
import { vorgangSchritt } from '../app/vorgang.js';
import { leerePersistenz } from '../app/zustand.js';
import { kontext, bauteil, bedarf, entscheidung, START } from './_hilfe.mjs';

const k0 = kennzahlen(kontext());

test('Zahl und mitgelieferte Liste stimmen bei jeder Kennzahl überein', () => {
  const prüfe = (k) => {
    assert.equal(k.baldVerfuegbar.anzahl, k.baldVerfuegbar.eintraege.length);
    assert.equal(k.bedarfeOffen.anzahl, k.bedarfeOffen.eintraege.length);
    assert.equal(k.passendePaare.anzahl, k.passendePaare.eintraege.length);
    assert.equal(k.vorgaenge.anzahl, k.vorgaenge.eintraege.length);
    assert.equal(k.offenePruefpunkte.anzahl, k.offenePruefpunkte.eintraege.length);
    assert.equal(k.offenePruefpunkte.punkte, k.offenePruefpunkte.eintraege.reduce((s, x) => s + x.offen.length, 0));
    assert.equal(k.zeitkritisch.anzahl, k.zeitkritisch.eintraege.length);
    assert.equal(k.zeitverlauf.anzahl, k.zeitverlauf.monate.reduce((s, m) => s + m.eintraege.length, 0));
    for (const m of k.zeitverlauf.monate) { assert.equal(m.anzahl, m.eintraege.length); assert.equal(Object.values(m.nachGruppe).reduce((s, n) => s + n, 0), m.anzahl); }
    for (const g of [k.passendePaare.nachErgebnis, k.vorgaenge.nachStatus]) {
      for (const v of Object.values(g)) assert.equal(v.anzahl, v.eintraege.length);
      assert.equal(Object.values(g).reduce((s, v) => s + v.anzahl, 0), g === k.vorgaenge.nachStatus ? k.vorgaenge.anzahl : k.passendePaare.anzahl);
    }
  };
  prüfe(k0);
  prüfe(kennzahlen(kontext(), { horizontTage: 30 }));
  prüfe(kennzahlen(kontext(leerePersistenz(), '2026-11-20T09:00')));
});

test('Bald verfügbar: Horizont 90 Tage, umschaltbar auf 30; ohne „nicht“ und ohne festes Ziel', () => {
  const ids = (k) => k.baldVerfuegbar.eintraege.map((b) => `${b.projekt}:${b.id}`);
  assert.equal(k0.horizontTage, 90);
  assert.ok(ids(k0).includes('KB:TW-05') && ids(k0).includes('LH:TW-01') && ids(k0).includes('LH:T-07'));
  assert.ok(!ids(k0).some((i) => ['LH:T-11', 'LH:LE-01', 'LH:T-12'].includes(i)), 'nicht wiederverwendbar oder festes Ziel');
  assert.ok(!ids(k0).some((i) => i.startsWith('SL:')), 'Juli 2027 liegt hinter dem Horizont');
  const k30 = kennzahlen(kontext(), { horizontTage: 30 });
  assert.ok(k30.baldVerfuegbar.anzahl < k0.baldVerfuegbar.anzahl);
  assert.ok(!k30.baldVerfuegbar.eintraege.some((b) => b.projekt === 'KB'), 'Februar 2027 liegt hinter 30 Tagen');
  // Rand: genau H + Horizont zählt noch.
  assert.ok(kennzahlen(kontext(), { horizontTage: 75 }).baldVerfuegbar.eintraege.some((b) => b.id === 'TW-05'), '18.11. + 75 Tage = 01.02.');
  assert.ok(!kennzahlen(kontext(), { horizontTage: 74 }).baldVerfuegbar.eintraege.some((b) => b.id === 'TW-05'));
});

test('Mengen nie über Einheiten addiert', () => {
  const m = k0.baldVerfuegbar.mengen;
  assert.deepEqual(Object.keys(m).sort(), ['Stk', 'lfm', 'm²']);
  const sumLfm = k0.baldVerfuegbar.eintraege.filter((b) => b.gruppe === 'wand').reduce((s, b) => s + b.menge, 0);
  assert.equal(m.lfm, sumLfm); assert.equal(m.lfm, 42 + 120);
  assert.equal(m['m²'], 104 + 340);
  assert.deepEqual(k0.bedarfeOffen.mengen, { Stk: 12, lfm: 90, 'm²': 52 });
  for (const mon of k0.zeitverlauf.monate) for (const einheit of Object.keys(mon.mengen)) assert.ok(['Stk', 'lfm', 'm²'].includes(einheit));
  assert.ok(!/CO2|CO₂|kosten|abfall|euro/i.test(Object.keys(k0).join(' ')), 'keine Wirkungszahlen');
});

test('Verfügbarkeit im Zeitverlauf: Monate aufsteigend, nach Gruppe getrennt', () => {
  assert.deepEqual(k0.zeitverlauf.monate.map((m) => m.monat), ['2026-11', '2027-02', '2027-07']);
  assert.equal(monatLabel('2026-11'), 'November 2026');
  const nov = k0.zeitverlauf.monate[0];
  assert.equal(nov.nachGruppe.tuer, 3); assert.equal(nov.nachGruppe.wand, 1); assert.equal(nov.nachGruppe.boden, 1); assert.equal(nov.nachGruppe.heiz, 1);
  assert.equal(k0.zeitverlauf.monate[1].nachGruppe.wand, 1);
});

test('Bedarfe offen, passende Paare je Ergebnis und Vorgänge je Status in der Ausgangslage', () => {
  assert.deepEqual(k0.bedarfeOffen.eintraege.map((d) => d.id).sort(), ['BD-02', 'BD-21', 'BD-22', 'BD-23']);
  assert.equal(k0.passendePaare.nachErgebnis.weiter.anzahl, 2);
  assert.equal(k0.passendePaare.nachErgebnis.spaet.anzahl, 2);
  assert.equal(k0.passendePaare.nachErgebnis.fehlt.anzahl, 4);
  assert.equal(k0.vorgaenge.anzahl, 2); assert.equal(k0.vorgaenge.nachStatus.offen.anzahl, 2, 'E-01 und E-02 zählen mit');
  assert.equal(k0.vorgaenge.offen, 2);
});

test('Offene Prüfpunkte: Bauteile mit mindestens einem offenen Nachweis, dazu die Zahl der Punkte', () => {
  assert.ok(k0.offenePruefpunkte.anzahl > 0 && k0.offenePruefpunkte.punkte >= k0.offenePruefpunkte.anzahl);
  assert.ok(k0.offenePruefpunkte.eintraege.every((x) => x.offen.length > 0 && x.bauteil.status !== 'nicht'));
});

test('Zeitkritisch: Fristen der nächsten 7 Tage, nach Zeit sortiert, Überfälliges gekennzeichnet', () => {
  const z = k0.zeitkritisch;
  assert.equal(z.tage, 7);
  assert.deepEqual(z.eintraege.map((f) => `${f.id}:${f.name}`), ['E-01:Aufmaßfrist', 'E-02:Nachweisfrist', 'E-01:Ersatzentscheidung', 'E-02:Ersatzentscheidung']);
  assert.equal(z.ueberfaellig, 0);
  assert.ok(z.eintraege.every((f) => f.art === 'entscheidung' && f.projekt === 'LH'));
  const spaet = kennzahlen(kontext(leerePersistenz(), '2026-11-19T11:00')).zeitkritisch;   // Nachweisfrist E-02 war 10:00
  const nachweis = spaet.eintraege.find((f) => f.name === 'Nachweisfrist');
  assert.equal(nachweis.ueberfaellig, true); assert.equal(spaet.ueberfaellig, spaet.eintraege.filter((f) => f.ueberfaellig).length);
  assert.ok(spaet.ueberfaellig >= 1);
  // Bestellfrist eines Bedarfs: BD-23 am 27.11. liegt 9 Tage voraus (außerhalb), bei 14 Tagen Horizont enthalten.
  assert.ok(!z.eintraege.some((f) => f.art === 'bedarf'));
  const weit = kennzahlen(kontext(), { kritischTage: 14 }).zeitkritisch;
  const bd23 = weit.eintraege.find((f) => f.art === 'bedarf');
  assert.equal(bd23.id, 'BD-23'); assert.equal(bd23.name, 'Bestellfrist'); assert.equal(bd23.ueberfaellig, false);
  const nachBestellfrist = kennzahlen(kontext(leerePersistenz(), '2026-11-28T09:00')).zeitkritisch.eintraege.find((f) => f.id === 'BD-23');
  assert.equal(nachBestellfrist.ueberfaellig, true);
});

test('Nach einer Prüfbitte zählen die Kennzahlen mit', () => {
  const p = leerePersistenz(); const c = kontext(p);
  const r = pruefbitteAnlegen(c, abgleich(c, bauteil(c, 'KB', 'TW-05'), bedarf(c, 'SB', 'BD-22')));
  p.zuordnungen.push(r.zuordnung); p.ereignisse.push(r.ereignis);
  const k = kennzahlen(kontext(p));
  assert.equal(k.vorgaenge.anzahl, 3); assert.equal(k.vorgaenge.nachStatus.pruefbitte.anzahl, 1);
  assert.equal(k.bedarfeOffen.anzahl, k0.bedarfeOffen.anzahl - 1);
  assert.equal(k.passendePaare.anzahl, k0.passendePaare.anzahl - 3, 'TW-05 (2 Paare) und der belegte Bedarf BD-22 entfallen');
  assert.equal(k.passendePaare.nachErgebnis.weiter.anzahl, 0);
  // Bei Vormerkung gilt das Bauteil als mit festem Ziel und verschwindet aus „Bald verfügbar“.
  assert.ok(k.baldVerfuegbar.eintraege.some((b) => b.id === 'TW-05'));
  const c2 = kontext(p);
  const e = entscheidung(c2, 'KB', 'E-01');
  p.ereignisse.push(vorgangSchritt(c2, e, 'fachergebnis', { urteil: 'geeignet', person: 'L. Müller' }).ereignis);
  const c3 = kontext(p); p.ereignisse.push(vorgangSchritt(c3, entscheidung(c3, 'KB', 'E-01'), 'vormerkung', { menge: '60', ablauf: '2027-03-01' }).ereignis);
  const k2 = kennzahlen(kontext(p));
  assert.ok(!k2.baldVerfuegbar.eintraege.some((b) => b.id === 'TW-05'));
  assert.equal(k2.vorgaenge.nachStatus.vorgemerkt.anzahl, 1);
  // Die Frist der Vormerkung ist eine Frist des Vorgangs.
  assert.ok(kennzahlen(kontext(p), { kritischTage: 200 }).zeitkritisch.eintraege.some((f) => f.id === 'E-01' && f.projekt === 'KB' && f.name === 'Vormerkung läuft ab'));
});
