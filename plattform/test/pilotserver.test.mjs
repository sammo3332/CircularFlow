// Pilotserver: Schlüssel, Rechte, Versionskonflikt, Schrumpfschutz, Pfadsperren, fehlerhafte Adressen. Startet den Server auf einem freien Port.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
const daten = await fs.mkdtemp(path.join(os.tmpdir(), 'cf-pilotserver-'));
process.argv.push('--daten', daten);
const { starten, raumAnlegen } = await import('../server/pilotserver.mjs');
const server = await starten(0); const port = server.address().port; const basis = `http://127.0.0.1:${port}`;
const raumA = await raumAnlegen('A', daten); const raumB = await raumAnlegen('B', daten);
const api = (pfad, schluessel, init = {}) => fetch(`${basis}${pfad}`, { ...init, headers: { ...(schluessel ? { authorization: `Bearer ${schluessel}` } : {}), ...(init.body ? { 'content-type': 'application/json' } : {}) } });
const stand = (n) => ({ version: 1, erfassungen: [], dienstleister: Array.from({ length: n }, (_, i) => ({ id: `DL-0${i + 1}`, name: `D${i + 1}`, leistungen: ['transport'], art: 'test' })) });
test.after(() => { server.close(); return fs.rm(daten, { recursive: true, force: true }); });

test('Zugang: ohne oder mit falschem Schlüssel 401; Leseschlüssel darf nicht schreiben; Räume sind getrennt', async () => {
  assert.equal((await api('/api/raum', '')).status, 401); assert.equal((await api('/api/raum', 'x'.repeat(24))).status, 401);
  const info = await (await api('/api/raum', raumA.bearbeiten)).json(); assert.equal(info.rechte, 'bearbeiten'); assert.equal(info.name, 'A');
  assert.equal((await api('/api/raum/stand', raumA.lesen, { method: 'PUT', body: JSON.stringify({ basisVersion: 0, daten: stand(1) }) })).status, 403);
  const w = await api('/api/raum/stand', raumA.bearbeiten, { method: 'PUT', body: JSON.stringify({ basisVersion: 0, daten: stand(2) }) }); assert.equal(w.status, 200); assert.equal((await w.json()).version, 1);
  const b = await (await api('/api/raum/stand', raumB.bearbeiten)).json(); assert.equal(b.daten, null, 'Raum B sieht Raum A nicht');
  const l = await (await api('/api/raum/stand', raumA.lesen)).json(); assert.equal(l.daten.dienstleister.length, 2);
});

test('Versionskonflikt 409, Schrumpfschutz 422, falsche Datenfassung 400, Vorversion gesichert', async () => {
  assert.equal((await api('/api/raum/stand', raumA.bearbeiten, { method: 'PUT', body: JSON.stringify({ basisVersion: 0, daten: stand(3) }) })).status, 409);
  const s = await api('/api/raum/stand', raumA.bearbeiten, { method: 'PUT', body: JSON.stringify({ basisVersion: 1, daten: stand(1) }) }); assert.equal(s.status, 422); assert.match((await s.json()).fehler, /weniger Einträge/);
  assert.equal((await api('/api/raum/stand', raumA.bearbeiten, { method: 'PUT', body: JSON.stringify({ basisVersion: 1, daten: { version: 2 } }) })).status, 400);
  assert.equal((await api('/api/raum/stand', raumA.bearbeiten, { method: 'PUT', body: JSON.stringify({ basisVersion: 1, daten: {} }) })).status, 400);
  const ok = await api('/api/raum/stand', raumA.bearbeiten, { method: 'PUT', body: JSON.stringify({ basisVersion: 1, daten: stand(3) }) }); assert.equal(ok.status, 200);
  const dateien = await fs.readdir(daten); assert.ok(dateien.some((d) => d.endsWith('.vorher')), 'Vorversion liegt als Sicherung vor');
  const jetzt = await (await api('/api/raum/stand', raumA.bearbeiten)).json(); assert.equal(jetzt.version, 2); assert.equal(jetzt.daten.dienstleister.length, 3);
});

test('Statische Auslieferung: nur Plattform und Türregel; Serverordner, Daten, node_modules und fehlerhafte Adressen sind gesperrt', async () => {
  assert.equal((await fetch(`${basis}/plattform/`)).status, 200);
  assert.equal((await fetch(`${basis}/prototype/dist/door-rules.mjs`)).status, 200);
  assert.equal((await fetch(`${basis}/plattform/app/main.js`)).status, 200);
  assert.equal((await fetch(`${basis}/plattform/server/pilotserver.mjs`)).status, 403);
  assert.equal((await fetch(`${basis}/plattform/server/daten/raeume.json`)).status, 403);
  assert.equal((await fetch(`${basis}/plattform/etikett-versuch/node_modules/tesseract.js/package.json`)).status, 403);
  assert.equal((await fetch(`${basis}/docs/produktentscheidungen.md`)).status, 403);
  assert.equal((await fetch(`${basis}/README.md`)).status, 403);
  assert.equal((await fetch(`${basis}/plattform/..%2fdocs/produktentscheidungen.md`)).status, 403);
  assert.equal((await fetch(`${basis}/%E0%A4%A`)).status, 400, 'ungültige Kodierung beendet den Server nicht');
  assert.equal((await fetch(`${basis}/plattform/`)).status, 200, 'Server läuft weiter');
});
