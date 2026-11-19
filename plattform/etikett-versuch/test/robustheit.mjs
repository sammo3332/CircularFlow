// Echte OCR, derselbe Ablauf wie in der Plattform, ausschließlich synthetische Bildpixel.
import fs from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import assert from 'node:assert/strict';
import { createWorker } from 'tesseract.js';
import { leseTypenschild, kontrastPixel } from '../lesepipeline.mjs';
import { spawnSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const fixtures = new URL('fixtures/robustheit/', root);
// Pillow dekodiert/enkodiert ausschließlich Testpixel. Kontrastberechnung ist der Original-JS-Code.
function kontrast(datei) {
  const code = 'from PIL import Image;import sys;sys.stdout.buffer.write(Image.open(sys.argv[1]).convert("RGBA").tobytes())';
  const r = spawnSync('python3', ['-c', code, datei], { maxBuffer: 20 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(r.stderr.toString());
  const pixel = kontrastPixel(r.stdout);
  const png = spawnSync('python3', ['-c', 'from PIL import Image;import sys,io;im=Image.open(sys.argv[1]);out=Image.frombytes("RGBA",im.size,sys.stdin.buffer.read());out.save(sys.stdout.buffer,format="PNG")', datei], { input: pixel, maxBuffer: 20 * 1024 * 1024 });
  if (png.status !== 0) throw new Error(png.stderr.toString());
  return png.stdout;
}
const start = performance.now();
const worker = await createWorker('deu', 1, { langPath: new URL('vendor/lang/', root).pathname, gzip: false, cacheMethod: 'none' });
const initialisierungMs = Math.round(performance.now() - start); const faelle = [];
try {
  for (const file of ['klar.png', 'alternative-beschriftung.png', 'kontrastarm.png', '90-grad.png', '90-grad-korrigiert.png', 'unscharf.png', 'widerspruch.png', 'leer.png']) {
    const pfad = new URL(file, fixtures).pathname; const t = performance.now();
    const scan = await leseTypenschild(worker, pfad, { maxJahr: 2026, kontrastBild: async () => kontrast(pfad) });
    faelle.push({ datei: file, synthetisch: true, ocrMs: Math.round(performance.now() - t), ...scan });
    console.log(JSON.stringify({ datei: file, versuche: scan.ocr.versuche.length, felder: Object.fromEntries(Object.entries(scan.felder).map(([k, f]) => [k, f.wert || f.status])) }));
  }
} finally { await worker.terminate(); }
const result = { datum: new Date().toISOString(), engine: 'Tesseract.js 7.0.0 / LSTM / deu', ausfuehrung: 'Node.js CPU, keine Browser- oder Geräteprüfung', initialisierungMs, faelle,
  grenze: 'Nur synthetische Funktionsprüfung, keine Baustellen-Erkennungsrate und kein Zeitvergleich mit manueller Erfassung. Drehkorrektur am Testbild mit Pillow, Browser-Canvas separat nicht geprüft.' };
await fs.writeFile(new URL('pruefung/robustheit-2026-11-19.json', root), JSON.stringify(result, null, 2));
const erwartet = { hersteller: 'MUSTERWERK', modell: 'TUER-17', seriennummer: 'CF-2026-001', baujahr: '2020' };
for (const f of faelle.filter((f) => ['klar.png', 'alternative-beschriftung.png', 'kontrastarm.png', '90-grad-korrigiert.png'].includes(f.datei))) {
  for (const [k, v] of Object.entries(erwartet)) assert.equal(f.felder[k].wert, v, `${f.datei}: ${k}`);
}
assert.equal(faelle.find((f) => f.datei === 'widerspruch.png').felder.hersteller.status, 'uneindeutig');
assert.ok(Object.values(faelle.find((f) => f.datei === 'leer.png').felder).every((f) => f.status === 'fehlt'));
console.log('OCR-Abnahme: vier positive Bilder mit je vier Sollwerten; Widerspruch und leeres Bild bestanden. Gedrehtes/unscharfes Bild sind zusätzliche beobachtete Grenzfälle.');
