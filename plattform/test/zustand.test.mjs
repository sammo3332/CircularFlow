// Tests des Datenstands: alte gespeicherte Stände, neue Schlüssel, Zählung. Aufruf vom Repository-Root:
// node --test plattform/test/zustand.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerePersistenz, ladePersistenz, speichere, baueDaten, anzahlEigeneAenderungen, SPEICHERSCHLUESSEL } from '../app/zustand.js';
import { PROJEKTE, BEDARFE, BAUTEILE, BEZIRKE } from '../app/daten.js';
import { bedarfAusEntwurf } from '../app/bedarf.js';
import { projektAusEntwurf } from '../app/projektanlage.js';

const speicher = (inhalt) => { const m = new Map(inhalt ? [[SPEICHERSCHLUESSEL, typeof inhalt === 'string' ? inhalt : JSON.stringify(inhalt)]] : []); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v), removeItem: (k) => m.delete(k) }; };

test('Neue Schlüssel in der leeren Persistenz', () => {
  const p = leerePersistenz();
  assert.deepEqual(p.bedarfe, []); assert.deepEqual(p.bedarfAenderungen, {}); assert.deepEqual(p.projekteEigen, []);
  assert.equal(p.version, 1);
});

test('Alte gespeicherte Stände (Fassung 1.1, ohne neue Schlüssel) laden weiter', () => {
  const alt = { version: 1, erfassungen: [], zuordnungen: [{ projekt: 'LH', id: 'E-03', bauteil: 'T-03', ziel: { art: 'zieloeffnung', id: 'B-04' }, regel: 'tuer', angelegt: '2026-11-18T14:00' }], ereignisse: [{ entscheidung: 'LH:E-01', art: 'vorlage', at: '2026-11-18T15:30' }], ezustand: { 'LH:E-01': { aufmass: {} } }, radar: {}, meldungen: [], projekteAusRadar: [], werte: {} };
  const p = ladePersistenz(speicher(alt));
  assert.equal(p.zuordnungen.length, 1); assert.equal(p.ereignisse.length, 1);
  assert.deepEqual(p.bedarfe, []); assert.deepEqual(p.bedarfAenderungen, {}); assert.deepEqual(p.projekteEigen, []);
  assert.equal(baueDaten(p).entscheidungen.length, 3);
  assert.equal(anzahlEigeneAenderungen(p), 3);
});

test('Beschädigte Einträge der neuen Schlüssel werden ausgelassen, ein beschädigter Stand blockiert nicht', () => {
  const gut = bedarfAusEntwurf({ projekt: 'SB', gruppe: 'wand', titel: 'T', menge: '5' }, { id: 'BD-24', at: '2026-11-18' });
  const projekt = projektAusEntwurf({ name: 'Eigenes', art: 'umbau', bezirk: 'Hörde', etagen: '1', raeume: '2' }, { projekte: PROJEKTE, mitte: [51.4, 7.5], at: '2026-11-18' });
  const p = ladePersistenz(speicher({
    version: 1,
    bedarfe: [gut, null, 'x', { projekt: 'SB' }, { projekt: 'SB', id: 'BD-30', gruppe: 'raumschiff', titel: 'x' }, { projekt: 'SB', id: 'BD-31', gruppe: 'wand' }],
    projekteEigen: [projekt, {}, { kurz: 'AA' }, { kurz: 'AB', id: 'P', name: 'n', lage: ['a', 'b'], gebaeude: [] }, { kurz: 'AC', id: 'P', name: 'n', lage: [1, 2], gebaeude: 'nein' }],
    bedarfAenderungen: { 'SB:BD-21': { bestellfrist: '2027-01-01' }, kaputt: { a: 1 }, 'SB:BD-22': 'text', 'SB:BD-23': [] },
  }));
  assert.equal(p.bedarfe.length, 1); assert.equal(p.bedarfe[0].id, 'BD-24');
  assert.equal(p.projekteEigen.length, 1); assert.equal(p.projekteEigen[0].kurz, projekt.kurz);
  assert.deepEqual(Object.keys(p.bedarfAenderungen), ['SB:BD-21']);
  // Falsche Grundform: ganzer Schlüssel fällt auf den Leerwert zurück.
  const q = ladePersistenz(speicher({ version: 1, bedarfe: 'x', projekteEigen: {}, bedarfAenderungen: [] }));
  assert.deepEqual([q.bedarfe, q.projekteEigen, q.bedarfAenderungen], [[], [], {}]);
  for (const kaputt of ['{', 'null', '[]', '{"version":2}']) assert.deepEqual(ladePersistenz(speicher(kaputt)), leerePersistenz(), kaputt);
  assert.deepEqual(ladePersistenz(null), leerePersistenz());
});

test('baueDaten: Bedarfe (Beispiel + Überlagerung + eigene) und Projekte (Beispiel + Radar + eigene)', () => {
  const p = leerePersistenz();
  const eigenerBedarf = bedarfAusEntwurf({ projekt: 'SB', gruppe: 'tuer', titel: 'Türen Haus 2', menge: '4' }, { id: 'BD-24', at: '2026-11-18' });
  p.bedarfe.push(eigenerBedarf); p.bedarfAenderungen['SB:BD-22'] = { bestellfrist: '2027-04-30', belegt: { bestellfrist: 'geschaetzt' } };
  p.projekteAusRadar.push({ kurz: 'R1', id: 'P-RADAR-01', name: 'Radar', lage: [51.5, 7.4], gebaeude: [] });
  const eigen = projektAusEntwurf({ name: 'Eigenes Projekt', art: 'neubau', bezirk: 'Eving', etagen: '1', raeume: '1' }, { projekte: PROJEKTE, mitte: [51.55, 7.5], at: '2026-11-18' });
  p.projekteEigen.push(eigen);
  const d = baueDaten(p);
  assert.equal(d.bedarfe.length, BEDARFE.length + 1);
  const bd22 = d.bedarfe.find((x) => x.id === 'BD-22');
  assert.equal(bd22.bestellfrist, '2027-04-30'); assert.equal(bd22.pruefzeitTage, 10, 'nicht überlagerte Werte bleiben');
  assert.deepEqual(bd22.belegt, { bestellfrist: 'geschaetzt', pruefzeitTage: 'geschaetzt', annahme: 'geschaetzt' });
  assert.equal(BEDARFE.find((x) => x.id === 'BD-22').bestellfrist, '2027-03-31', 'Beispieldaten bleiben unverändert');
  assert.deepEqual(d.projekte.map((x) => x.kurz), [...PROJEKTE.map((x) => x.kurz), 'R1', eigen.kurz]);
  d.bedarfe.find((x) => x.id === 'BD-24').titel = 'geändert';
  assert.equal(p.bedarfe[0].titel, 'Türen Haus 2', 'baueDaten gibt Kopien heraus');
  // Ein eigenes Bauteil in einem Raum des eigenen Projekts bleibt über die Erfassung möglich (Raum existiert).
  assert.ok(d.projekte.find((x) => x.kurz === eigen.kurz).gebaeude[0].etagen[0].raeume.some((r) => r.id === 'E.01'));
});

test('Beispieldaten: Bauteil TW-01 mit verfuegbarBis, Bedarfe BD-22 und BD-23 als Beispiel gekennzeichnet', () => {
  assert.equal(BAUTEILE.find((b) => b.id === 'TW-01').verfuegbarBis, '2027-03-31');
  const d = Object.fromEntries(BEDARFE.map((x) => [x.id, x]));
  assert.deepEqual([d['BD-22'].bestellfrist, d['BD-22'].pruefzeitTage, d['BD-22'].annahmeVon, d['BD-22'].annahmeBis], ['2027-03-31', 10, '2027-02-01', '2027-03-31']);
  assert.deepEqual([d['BD-23'].projekt, d['BD-23'].gruppe, d['BD-23'].menge, d['BD-23'].einheit, d['BD-23'].raeume], ['SB', 'wand', 30, 'lfm', ['1.02']]);
  assert.deepEqual([d['BD-23'].bestellfrist, d['BD-23'].pruefzeitTage, d['BD-23'].annahmeVon, d['BD-23'].annahmeBis], ['2026-11-27', 14, '2027-01-11', '2027-02-26']);
  for (const k of ['bestellfrist', 'pruefzeitTage', 'annahmeVon', 'annahmeBis']) assert.equal(d['BD-21'][k], undefined, `BD-21 bleibt ohne ${k}`);
  assert.ok(['BD-21', 'BD-22', 'BD-23'].every((id) => /Beispiel|fiktiv/.test(d[id].herkunft)));
  assert.equal(PROJEKTE.find((x) => x.kurz === 'SB').gebaeude[0].etagen[1].raeume.some((r) => r.id === '1.02'), true, 'Raum 1.02 existiert in Seeblick');
  assert.equal(BEZIRKE.length, 12);
});

test('anzahlEigeneAenderungen zählt alle Schlüssel', () => {
  assert.equal(anzahlEigeneAenderungen(leerePersistenz()), 0);
  const p = leerePersistenz();
  p.erfassungen.push({}); p.zuordnungen.push({}); p.ereignisse.push({}, {}); p.meldungen.push({}); p.projekteAusRadar.push({});
  p.ezustand.a = {}; p.radar.a = {}; p.werte.a = {};
  p.bedarfe.push({}); p.bedarfAenderungen.a = {}; p.bedarfAenderungen.b = {}; p.projekteEigen.push({});
  assert.equal(anzahlEigeneAenderungen(p), 1 + 1 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 2 + 1);
  assert.equal(anzahlEigeneAenderungen(null), 0); assert.equal(anzahlEigeneAenderungen({}), 0);
});

test('Speichern und Laden: neue Schlüssel überstehen den Rundweg, Zurücksetzen leert sie', () => {
  const s = speicher(); const p = leerePersistenz();
  p.bedarfe.push(bedarfAusEntwurf({ projekt: 'SB', gruppe: 'wand', titel: 'T', menge: '5' }, { id: 'BD-24', at: '2026-11-18' }));
  p.bedarfAenderungen['SB:BD-21'] = { bestellfrist: '2027-01-01' };
  assert.equal(speichere(s, p).ok, true);
  const q = ladePersistenz(s);
  assert.deepEqual(q.bedarfe, p.bedarfe); assert.deepEqual(q.bedarfAenderungen, p.bedarfAenderungen);
  assert.equal(anzahlEigeneAenderungen(q), 2);
  s.removeItem(SPEICHERSCHLUESSEL);
  assert.equal(anzahlEigeneAenderungen(ladePersistenz(s)), 0);
});
