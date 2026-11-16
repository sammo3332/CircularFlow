// Tests der Projektanlage. Aufruf vom Repository-Root: node --test plattform/test/projektanlage.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pruefeProjekt, projektAusEntwurf, neuesKuerzel, grundriss, PALETTE } from '../app/projektanlage.js';
import { PROJEKTE, BEZIRKE } from '../app/daten.js';
import { baueDaten, leerePersistenz } from '../app/zustand.js';
import { kontext } from './_hilfe.mjs';

const ok = { name: 'Umbau Rathaus Mengede', art: 'umbau', bezirk: 'Mengede', etagen: '2', raeume: '3' };
const mitte = [51.5, 7.4];

test('Bezirke: zwölf Dortmunder Stadtbezirke', () => {
  assert.equal(BEZIRKE.length, 12); assert.ok(BEZIRKE.includes('Hörde') && BEZIRKE.includes('Innenstadt-Nord'));
});

test('Prüfung: leerer Name, Art, Bezirk, Daten, Etagen 1–6, Räume 1–8', () => {
  assert.deepEqual(pruefeProjekt(ok, PROJEKTE), {});
  assert.deepEqual(Object.keys(pruefeProjekt({}, PROJEKTE)).sort(), ['art', 'bezirk', 'etagen', 'name', 'raeume']);
  assert.ok(pruefeProjekt({ ...ok, name: '   ' }, PROJEKTE).name);
  assert.ok(pruefeProjekt({ ...ok, name: 'x'.repeat(81) }, PROJEKTE).name);
  assert.match(pruefeProjekt({ ...ok, name: 'umbau haus lindenhof' }, PROJEKTE).name, /gibt es schon/);
  assert.ok(pruefeProjekt({ ...ok, art: 'hausbau' }, PROJEKTE).art);
  assert.ok(pruefeProjekt({ ...ok, bezirk: 'Atlantis' }, PROJEKTE).bezirk);
  for (const schlecht of ['0', '7', '1,5', 'zwei', '']) assert.ok(pruefeProjekt({ ...ok, etagen: schlecht }, PROJEKTE).etagen, `Etagen ${schlecht}`);
  for (const schlecht of ['0', '9', '-1', 'x', '']) assert.ok(pruefeProjekt({ ...ok, raeume: schlecht }, PROJEKTE).raeume, `Räume ${schlecht}`);
  for (const gut of ['1', '6']) assert.equal(pruefeProjekt({ ...ok, etagen: gut }, PROJEKTE).etagen, undefined);
  for (const gut of ['1', '8']) assert.equal(pruefeProjekt({ ...ok, raeume: gut }, PROJEKTE).raeume, undefined);
  assert.ok(pruefeProjekt({ ...ok, rueckbauAb: '2027-13-01' }, PROJEKTE).rueckbauAb);
  assert.ok(pruefeProjekt({ ...ok, entscheidungBis: 'bald' }, PROJEKTE).entscheidungBis);
  assert.match(pruefeProjekt({ ...ok, rueckbauAb: '2027-01-10', entscheidungBis: '2027-01-11' }, PROJEKTE).entscheidungBis, /spätestens zum Ausbau/);
  assert.deepEqual(pruefeProjekt({ ...ok, rueckbauAb: '2027-01-10', entscheidungBis: '2027-01-10' }, PROJEKTE), {});
});

test('Projekt: Eigene Eingabe, Lage = Bezirksmitte, Kürzel und Farbe', () => {
  const p = projektAusEntwurf({ ...ok, rueckbauAb: '2027-01-10', entscheidungBis: '2027-01-05' }, { projekte: PROJEKTE, mitte, at: '2026-11-18T14:00' });
  assert.equal(p.herkunft, 'eigen'); assert.deepEqual(p.lage, mitte); assert.notEqual(p.lage, mitte, 'Kopie, kein geteilter Verweis');
  assert.equal(p.kurz, 'URM'); assert.match(p.kurz, /^[A-Z]{2,3}$/); assert.ok(PALETTE.includes(p.farbe));
  assert.equal(p.name, 'Umbau Rathaus Mengede'); assert.equal(p.bezirk, 'Mengede'); assert.equal(p.art, 'umbau');
  assert.equal(p.rueckbauAb, '2027-01-10'); assert.equal(p.entscheidungBis, '2027-01-05T12:00');
  assert.equal(p.id, 'P-EIGEN-01');
  const ohne = projektAusEntwurf(ok, { projekte: PROJEKTE, mitte, at: '2026-11-18T14:00' });
  assert.equal(ohne.rueckbauAb, null); assert.equal(ohne.entscheidungBis, null);
});

test('Kürzel: eindeutig, zwei bis drei Großbuchstaben, keine Kollision (auch nicht mit R1, R2 …)', () => {
  const vorhanden = [...PROJEKTE, { kurz: 'R1' }, { kurz: 'R2' }];
  assert.equal(neuesKuerzel('Umbau Haus Lindenhof', vorhanden), 'UHL');
  assert.equal(neuesKuerzel('Rückbau Bürohaus Kanalblick', vorhanden), 'RBK');
  // Kollision mit LH, KB, SL, SB: es entsteht ein anderes Kürzel.
  for (const name of ['Lager Halle', 'Klinik Bau', 'Schule Lindenbach', 'Seeblick Bau']) { const k = neuesKuerzel(name, vorhanden); assert.ok(!vorhanden.some((x) => x.kurz === k), name); assert.match(k, /^[A-Z]{2,3}$/); }
  assert.notEqual(neuesKuerzel('Lager Halle', vorhanden), 'LH');
  // Viele gleichnamige Projekte erzeugen jeweils neue Kürzel.
  const liste = [...vorhanden];
  for (let i = 0; i < 40; i += 1) { const k = neuesKuerzel('Test Projekt', liste); assert.ok(!liste.some((x) => x.kurz === k)); assert.match(k, /^[A-Z]{2,3}$/); liste.push({ kurz: k }); }
  assert.match(neuesKuerzel('Ärger über Öl', []), /^[A-Z]{2,3}$/);
  assert.match(neuesKuerzel('123 !!!', []), /^[A-Z]{2,3}$/, 'Name ohne Buchstaben');
  assert.match(neuesKuerzel('X', []), /^[A-Z]{2,3}$/);
});

test('Gebäude A mit Etagen und Räumen: IDs, Grundriss im 100×60-Raster', () => {
  const p = projektAusEntwurf({ ...ok, etagen: '3', raeume: '5', gebaeudeName: 'Altbau' }, { projekte: PROJEKTE, mitte, at: '2026-11-18T14:00' });
  assert.equal(p.gebaeude.length, 1); assert.equal(p.gebaeude[0].id, 'A'); assert.equal(p.gebaeude[0].name, 'Altbau');
  assert.deepEqual(p.gebaeude[0].etagen.map((e) => e.id), ['EG', '1.OG', '2.OG']);
  assert.deepEqual(p.gebaeude[0].etagen[0].raeume.map((r) => r.id), ['E.01', 'E.02', 'E.03', 'E.04', 'E.05']);
  assert.deepEqual(p.gebaeude[0].etagen[1].raeume.map((r) => r.id), ['1.01', '1.02', '1.03', '1.04', '1.05']);
  assert.equal(projektAusEntwurf(ok, { projekte: PROJEKTE, mitte, at: '2026-11-18' }).gebaeude[0].name, 'Gebäude A');
  for (let n = 1; n <= 8; n += 1) {
    const plaene = grundriss(n);
    assert.equal(plaene.length, n);
    // Alle Räume liegen im Raster und füllen es lückenlos ohne Überlappung (Flächensumme 100 × 60).
    let flaeche = 0;
    for (const [x, y, b, h] of plaene) { assert.ok(x >= 0 && y >= 0 && b > 0 && h > 0 && x + b <= 100 && y + h <= 60, `n=${n}`); flaeche += b * h; }
    assert.equal(flaeche, 6000, `n=${n}: lückenlos`);
    for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) {
      const [a, b] = [plaene[i], plaene[j]];
      assert.ok(a[0] + a[2] <= b[0] || b[0] + b[2] <= a[0] || a[1] + a[3] <= b[1] || b[1] + b[3] <= a[1], `n=${n}: ${i}/${j} überlappen`);
    }
  }
});

test('Eigene Projekte bekommen eindeutige Kennungen und wechselnde Farben', () => {
  const p1 = projektAusEntwurf(ok, { projekte: PROJEKTE, mitte, at: '2026-11-18' });
  const p2 = projektAusEntwurf({ ...ok, name: 'Zweites Projekt' }, { projekte: [...PROJEKTE, p1], mitte, at: '2026-11-18' });
  assert.equal(p2.id, 'P-EIGEN-02'); assert.notEqual(p1.farbe, p2.farbe); assert.notEqual(p1.kurz, p2.kurz);
  const p = leerePersistenz(); p.projekteEigen.push(p1);
  assert.ok(kontext(p).daten.projekte.some((x) => x.kurz === p1.kurz && x.herkunft === 'eigen'));
});
