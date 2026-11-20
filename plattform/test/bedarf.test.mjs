// Tests der Bedarfserfassung. Aufruf vom Repository-Root: node --test plattform/test/bedarf.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pruefeBedarf, bedarfAusEntwurf, naechsteBedarfId, fehlendeZeitangaben, bedarfAenderung, ergaenzeBedarf, entwurfAusBedarf } from '../app/bedarf.js';
import { abgleich } from '../app/abgleich.js';
import { baueDaten, leerePersistenz } from '../app/zustand.js';
import { BEDARFE } from '../app/daten.js';
import { kontext, bauteil, bedarf } from './_hilfe.mjs';

const ctx = kontext();
const ok = { projekt: 'SB', gruppe: 'wand', titel: 'Trennwände Foyer', menge: '25' };

test('Pflichtfelder: Projekt, Gruppe, Titel, Menge; ein Fehler je Feld', () => {
  assert.deepEqual(pruefeBedarf(ok, ctx), {});
  assert.deepEqual(Object.keys(pruefeBedarf({}, ctx)).sort(), ['gruppe', 'menge', 'projekt', 'titel']);
  assert.ok(pruefeBedarf({ ...ok, projekt: 'ZZ' }, ctx).projekt);
  assert.ok(pruefeBedarf({ ...ok, gruppe: 'raumschiff' }, ctx).gruppe);
  assert.ok(pruefeBedarf({ ...ok, titel: '   ' }, ctx).titel);
  assert.deepEqual(pruefeBedarf({ ...ok }, {}), {}, 'ohne Kontext wird das Projekt nur auf Eingabe geprüft');
});

test('Menge: größer als 0, höchstens zwei Nachkommastellen, Komma erlaubt', () => {
  for (const schlecht of ['', '0', '0,00', '-3', 'abc', '1,234', '1e3', ' ']) assert.ok(pruefeBedarf({ ...ok, menge: schlecht }, ctx).menge, `„${schlecht}“`);
  for (const gut of ['1', '12,5', '0,01', '10.25', 7]) assert.equal(pruefeBedarf({ ...ok, menge: gut }, ctx).menge, undefined, `„${gut}“`);
  assert.match(pruefeBedarf({ ...ok, menge: '0' }, ctx).menge, /lfm/, 'Einheit der Gruppe wird genannt');
});

test('Optionale Angaben: gültige Daten, Annahme von ≤ bis, Prüfzeit 0 bis 365, Bestellfrist', () => {
  const voll = { ...ok, bestellfrist: '2027-03-31', pruefzeitTage: '10', annahmeVon: '2027-02-01', annahmeBis: '2027-02-01', zustaendig: 'planung' };
  assert.deepEqual(pruefeBedarf(voll, ctx), {}, 'ein Tag Annahmefenster ist gültig');
  assert.ok(pruefeBedarf({ ...voll, bestellfrist: '2027-02-30' }, ctx).bestellfrist);
  assert.ok(pruefeBedarf({ ...voll, annahmeVon: 'x' }, ctx).annahmeVon);
  assert.ok(pruefeBedarf({ ...voll, annahmeBis: '31.03.2027' }, ctx).annahmeBis);
  assert.match(pruefeBedarf({ ...voll, annahmeVon: '2027-04-01' }, ctx).annahmeBis, /nicht vor dem Beginn/);
  for (const schlecht of ['-1', '366', '1,5', 'zehn', '3.0']) assert.ok(pruefeBedarf({ ...voll, pruefzeitTage: schlecht }, ctx).pruefzeitTage, schlecht);
  for (const gut of ['0', '365', 14]) assert.equal(pruefeBedarf({ ...voll, pruefzeitTage: gut }, ctx).pruefzeitTage, undefined, String(gut));
  assert.ok(pruefeBedarf({ ...voll, zustaendig: 'chef' }, ctx).zustaendig);
  assert.deepEqual(pruefeBedarf({ ...ok, bestellfrist: '', pruefzeitTage: '', annahmeVon: '', annahmeBis: '' }, ctx), {}, 'leere optionale Felder sind erlaubt');
});

test('Eigener Bedarf: unvollständig speicherbar, als „Angaben fehlen“ erkennbar, Zeitangaben als belegt oder geschätzt', () => {
  const d = bedarfAusEntwurf(ok, { id: 'BD-24', at: '2026-11-18T14:00' });
  assert.equal(d.id, 'BD-24'); assert.equal(d.menge, 25); assert.equal(d.einheit, 'lfm'); assert.equal(d.angelegt, '2026-11-18'); assert.equal(d.neu, true);
  assert.equal(d.bestellfrist, null); assert.equal(d.pruefzeitTage, null); assert.deepEqual(d.belegt, {});
  assert.deepEqual(fehlendeZeitangaben(d), ['Bestellfrist', 'Mindestprüfzeit', 'Annahmefenster (Beginn)', 'Annahmefenster (Ende)']);
  const c = kontext(); const a = abgleich({ ...c, daten: { ...c.daten, bedarfe: [...c.daten.bedarfe, d] } }, bauteil(c, 'KB', 'TW-05'), d);
  assert.equal(a.gesamt.key, 'fehlt');
  const v = bedarfAusEntwurf({ ...ok, titel: ' Mit Zeit ', bestellfrist: '2027-03-31', pruefzeitTage: '0', annahmeVon: '2027-02-01', annahmeBis: '2027-03-01', geschaetzt: { pruefzeitTage: true } }, { id: 'BD-25', at: '2026-11-18T14:00' });
  assert.equal(v.titel, 'Mit Zeit'); assert.equal(v.pruefzeitTage, 0);
  assert.deepEqual(v.belegt, { bestellfrist: 'belegt', pruefzeitTage: 'geschaetzt', annahme: 'belegt' });
  assert.deepEqual(fehlendeZeitangaben(v), []);
});

test('Nächste Bedarfsnummer über alle Projekte', () => {
  assert.equal(naechsteBedarfId(BEDARFE), 'BD-24');
  assert.equal(naechsteBedarfId([]), 'BD-01');
  assert.equal(naechsteBedarfId([{ id: 'BD-07' }, { id: 'XY' }]), 'BD-08');
});

test('Beispielbedarfe ergänzen über Überlagerung: Ergebnis wechselt, Beispielwerte bleiben erhalten', () => {
  const p = leerePersistenz();
  const vorher = kontext(p); const bd21 = bedarf(vorher, 'SB', 'BD-21');
  assert.equal(abgleich(vorher, bauteil(vorher, 'KB', 'T-31'), bd21).gesamt.key, 'fehlt');
  const entwurf = { ...entwurfAusBedarf(bd21), bestellfrist: '2027-03-31', pruefzeitTage: '10', annahmeVon: '2027-02-01', annahmeBis: '2027-03-31', geschaetzt: { pruefzeitTage: true } };
  assert.deepEqual(pruefeBedarf(entwurf, vorher), {});
  p.bedarfAenderungen['SB:BD-21'] = bedarfAenderung(entwurf);
  const nachher = kontext(p); const neu = bedarf(nachher, 'SB', 'BD-21');
  assert.equal(neu.titel, bd21.titel); assert.equal(neu.menge, 12); assert.equal(neu.ergaenzt, true);
  assert.equal(neu.bestellfrist, '2027-03-31'); assert.equal(neu.pruefzeitTage, 10);
  assert.equal(abgleich(nachher, bauteil(nachher, 'KB', 'T-31'), neu).gesamt.key, 'weiter');
  assert.deepEqual(abgleich(nachher, bauteil(nachher, 'KB', 'T-31'), neu).zeit.geschaetzt, ['Mindestprüfzeit']);
  assert.equal(BEDARFE.find((d) => d.id === 'BD-21').bestellfrist, undefined, 'Beispieldaten bleiben unverändert');
  // Zurücksetzen entfernt die Ergänzung.
  p.bedarfAenderungen = {};
  assert.equal(bedarf(kontext(p), 'SB', 'BD-21').bestellfrist, undefined);
  // Eine Überlagerung auf unbekannten Bedarf ändert nichts.
  p.bedarfAenderungen['SB:BD-99'] = { bestellfrist: '2027-01-01' };
  assert.equal(baueDaten(p).bedarfe.length, BEDARFE.length);
  assert.equal(ergaenzeBedarf({ id: 'x' }, null).id, 'x');
});

test('Überlagerung gilt auch für eigene Bedarfe; Entwurf aus Bedarf ist rückführbar', () => {
  const p = leerePersistenz();
  p.bedarfe.push(bedarfAusEntwurf(ok, { id: 'BD-24', at: '2026-11-18T14:00' }));
  assert.equal(bedarf(kontext(p), 'SB', 'BD-24').titel, 'Trennwände Foyer');
  const e = entwurfAusBedarf(bedarf(kontext(p), 'SB', 'BD-22'));
  assert.equal(e.pruefzeitTage, '10'); assert.equal(e.menge, '60'); assert.deepEqual(e.geschaetzt, { bestellfrist: false, pruefzeitTage: true, annahme: true });
  assert.deepEqual(pruefeBedarf(e, kontext(p)), {});
});
