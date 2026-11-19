#!/usr/bin/env node
// Pilotserver: liefert die Plattform aus und hält je Pilotraum einen gemeinsamen Datenstand (Datei), geschützt durch Zugangsschlüssel.
// Kein externer Dienst, keine Abhängigkeiten. Start: node plattform/server/pilotserver.mjs [--port 8000] [--daten plattform/server/daten]
// Raum anlegen: node plattform/server/pilotserver.mjs raum-anlegen "Name des Pilotraums"  (zeigt Bearbeitungs- und Leseschlüssel einmalig an)
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { ladePersistenz, anzahlEigeneAenderungen } from '../app/zustand.js';

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, '..', '..');
const args = process.argv.slice(2);
const opt = (name, std) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : std; };
const DATEN = path.resolve(opt('--daten', path.join(hier, 'daten')));
const PORT = Number(opt('--port', '8000'));
const MAX_BYTES = 15 * 1024 * 1024;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.geojson': 'application/geo+json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.wasm': 'application/wasm', '.traineddata': 'application/octet-stream', '.csv': 'text/csv; charset=utf-8', '.pdf': 'application/pdf' };

const hash = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');
const gleich = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
// Alle Dateizugriffe nehmen den Datenordner als Parameter, damit raumAnlegen auch aus anderen Prozessen (Tests) denselben Ordner trifft.
const raeumeDatei = (daten) => path.join(daten, 'raeume.json');
async function raeumeLesen(daten = DATEN) { try { return JSON.parse(await fsp.readFile(raeumeDatei(daten), 'utf8')); } catch { return {}; } }
async function raeumeSchreiben(r, daten = DATEN) { await fsp.mkdir(daten, { recursive: true }); await fsp.writeFile(raeumeDatei(daten), JSON.stringify(r, null, 1)); }
const standDatei = (id, daten = DATEN) => path.join(daten, `raum-${id}.json`);
async function standLesen(id, daten = DATEN) { try { return JSON.parse(await fsp.readFile(standDatei(id, daten), 'utf8')); } catch { return { version: 0, geaendert: null, daten: null }; } }
async function standSchreiben(id, stand, daten = DATEN) { const tmp = `${standDatei(id, daten)}.tmp`; await fsp.writeFile(tmp, JSON.stringify(stand)); await fsp.rename(tmp, standDatei(id, daten)); }

export async function raumAnlegen(name, daten = DATEN) {
  const r = await raeumeLesen(daten);
  const id = crypto.randomBytes(4).toString('hex'); const bearbeiten = crypto.randomBytes(18).toString('base64url'); const lesen = crypto.randomBytes(18).toString('base64url');
  r[id] = { name: String(name || 'Pilotraum').slice(0, 80), bearbeiten: hash(bearbeiten), lesen: hash(lesen), angelegt: new Date().toISOString() };
  await raeumeSchreiben(r, daten);
  return { id, name: r[id].name, bearbeiten, lesen };
}
// Prüft den Schlüssel: liefert { id, name, rechte } oder null.
async function zugang(schluessel) {
  if (!schluessel || schluessel.length < 16 || schluessel.length > 200) return null;
  const h = hash(schluessel); const r = await raeumeLesen();
  for (const [id, raum] of Object.entries(r)) { if (gleich(raum.bearbeiten, h)) return { id, name: raum.name, rechte: 'bearbeiten' }; if (gleich(raum.lesen, h)) return { id, name: raum.name, rechte: 'lesen' }; }
  return null;
}

const json = (res, code, body) => { res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }); res.end(JSON.stringify(body)); };
function koerper(req) {
  return new Promise((ok, fail) => { const teile = []; let n = 0; req.on('data', (c) => { n += c.length; if (n > MAX_BYTES) { fail(new Error('zu groß')); req.destroy(); } else teile.push(c); }); req.on('end', () => ok(Buffer.concat(teile).toString('utf8'))); req.on('error', fail); });
}
// Schreibzugriffe laufen nacheinander je Raum (keine zwei gleichzeitigen Dateischreibvorgänge).
const schlange = new Map();
const nacheinander = (id, fn) => { const vorher = schlange.get(id) || Promise.resolve(); const jetzt = vorher.then(fn, fn); schlange.set(id, jetzt.catch(() => {})); return jetzt; };

export async function api(req, res, url) {
  res.setHeader('access-control-allow-origin', '*'); res.setHeader('access-control-allow-headers', 'authorization, content-type'); res.setHeader('access-control-allow-methods', 'GET, PUT, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  const auth = String(req.headers.authorization || ''); const schluessel = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const z = await zugang(schluessel);
  if (!z) { json(res, 401, { fehler: 'Zugangsschlüssel fehlt oder ist ungültig.' }); return; }
  if (url.pathname === '/api/raum' && req.method === 'GET') { const st = await standLesen(z.id); json(res, 200, { raum: z.id, name: z.name, rechte: z.rechte, version: st.version, geaendert: st.geaendert }); return; }
  if (url.pathname === '/api/raum/stand' && req.method === 'GET') { const st = await standLesen(z.id); json(res, 200, { raum: z.id, name: z.name, rechte: z.rechte, version: st.version, geaendert: st.geaendert, daten: st.daten }); return; }
  if (url.pathname === '/api/raum/stand' && req.method === 'PUT') {
    if (z.rechte !== 'bearbeiten') { json(res, 403, { fehler: 'Dieser Schlüssel erlaubt nur Lesen.' }); return; }
    let body; try { body = JSON.parse(await koerper(req)); } catch (e) { json(res, e.message === 'zu groß' ? 413 : 400, { fehler: e.message === 'zu groß' ? 'Der Datenstand ist größer als 15 MB.' : 'Kein gültiges JSON.' }); return; }
    if (!body || typeof body !== 'object' || !Number.isInteger(body.basisVersion) || !body.daten || typeof body.daten !== 'object') { json(res, 400, { fehler: 'basisVersion und daten sind nötig.' }); return; }
    if (body.daten.version !== 1) { json(res, 400, { fehler: 'Unbekannte Datenfassung; der Pilotserver kennt nur Fassung 1.' }); return; }
    const roh = JSON.stringify(body.daten);
    const geprueft = ladePersistenz({ getItem: () => roh }); // nur gültige Einträge; beschädigte entfallen
    await nacheinander(z.id, async () => {
      const st = await standLesen(z.id);
      if (st.version !== body.basisVersion) { json(res, 409, { fehler: 'Der Datenstand wurde inzwischen geändert.', version: st.version, geaendert: st.geaendert, daten: st.daten }); return; }
      // Schrumpfschutz: Die Anwendung löscht nie Einträge. Ein kleinerer Stand deutet auf einen Fehler hin und wird abgewiesen.
      const vorher = st.daten ? anzahlEigeneAenderungen(st.daten) : 0; const nachher = anzahlEigeneAenderungen(geprueft);
      if (nachher < vorher) { json(res, 422, { fehler: `Der neue Stand enthält weniger Einträge (${nachher}) als der gespeicherte (${vorher}) und wurde nicht übernommen. Erst abgleichen, dann erneut speichern.`, version: st.version, geaendert: st.geaendert, daten: st.daten }); return; }
      const neu = { version: st.version + 1, geaendert: new Date().toISOString(), daten: geprueft };
      // Vorversion als Sicherung behalten (eine Fassung zurück).
      if (st.daten) { try { await fsp.copyFile(standDatei(z.id), `${standDatei(z.id)}.vorher`); } catch { /* erste Fassung */ } }
      await standSchreiben(z.id, neu);
      json(res, 200, { version: neu.version, geaendert: neu.geaendert, eintraege: anzahlEigeneAenderungen(geprueft) });
    });
    return;
  }
  json(res, 404, { fehler: 'Unbekannter Pfad.' });
}

// Ausgeliefert werden nur die Plattform und die Türregel des Prototyps; Serverordner, Daten, node_modules und alles außerhalb bleiben gesperrt.
const FREI = ['/plattform/', '/prototype/dist/'];
function statisch(req, res, url) {
  let rel; try { rel = decodeURIComponent(url.pathname); } catch { res.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }); res.end('Ungültige Adresse'); return; }
  if (rel === '/') { res.writeHead(302, { location: '/plattform/' }); res.end(); return; }
  if (rel.endsWith('/')) rel += 'index.html';
  const datei = path.normalize(path.join(WURZEL, rel));
  const innerhalb = (basis) => datei === basis || datei.startsWith(basis + path.sep);
  // Die Freigabeliste gilt für den aufgelösten Pfad (nach „..“), nicht für die rohe Adresse.
  const relNorm = `/${path.relative(WURZEL, datei).split(path.sep).join('/')}`;
  if (!innerhalb(WURZEL) || !FREI.some((f) => relNorm.startsWith(f)) || innerhalb(DATEN) || innerhalb(path.join(WURZEL, 'plattform', 'server')) || rel.includes('/node_modules/')) { res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' }); res.end('Verboten'); return; }
  fs.stat(datei, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }); res.end('Nicht gefunden'); return; }
    res.writeHead(200, { 'content-type': MIME[path.extname(datei).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-cache', 'content-length': st.size });
    if (req.method === 'HEAD') { res.end(); return; }
    fs.createReadStream(datei).pipe(res);
  });
}

export function starten(port = PORT) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) { api(req, res, url).catch((e) => json(res, 500, { fehler: `Serverfehler: ${e.message}` })); return; }
    statisch(req, res, url);
  });
  return new Promise((ok) => server.listen(port, '0.0.0.0', () => ok(server)));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (args[0] === 'raum-anlegen') {
    const r = await raumAnlegen(args[1] || 'Pilotraum');
    console.log(`Pilotraum „${r.name}“ angelegt (Kennung ${r.id}).\nBearbeitungsschlüssel: ${r.bearbeiten}\nLeseschlüssel:         ${r.lesen}\nDie Schlüssel werden nur jetzt angezeigt; der Server speichert nur Prüfsummen. Datenordner: ${DATEN}`);
  } else {
    const s = await starten();
    console.log(`CircularFlow Pilotserver läuft: http://localhost:${s.address().port}/plattform/  (Daten: ${DATEN}). Beenden mit Strg+C.`);
  }
}
