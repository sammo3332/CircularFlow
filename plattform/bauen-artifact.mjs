// Erzeugt die veröffentlichbare Fassung der Plattform (claude.ai Artifact) aus den Repository-Dateien.
// Aufruf vom Repository-Root: node plattform/bauen-artifact.mjs <Zielordner>
// Die Seite verliert den HTML-Rahmen (den setzt die Veröffentlichung), Schriften werden als data:-URI eingebettet,
// die Türregel liegt neben den Modulen (app/door-rules.mjs). Am Ende steht die Dateiliste für die Veröffentlichung.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = dirname(fileURLToPath(import.meta.url));
const ziel = process.argv[2];
if (!ziel) { console.error('Zielordner fehlt.'); process.exit(1); }

const dateien = {};
const kopiere = (von, nach, typ) => {
  mkdirSync(dirname(join(ziel, nach)), { recursive: true });
  copyFileSync(von, join(ziel, nach));
  dateien[nach] = typ ? { from: join(ziel, nach), contentType: typ } : join(ziel, nach);
};

mkdirSync(ziel, { recursive: true });
const html = readFileSync(join(hier, 'index.html'), 'utf8');
const kopf = html.split('<!-- ARTIFACT-START -->')[1].split('<!-- ARTIFACT-HEAD-END -->')[0];
const koerper = html.split('<body>')[1].split('<!-- ARTIFACT-END -->')[0];
writeFileSync(join(ziel, 'index.html'), `${kopf.trim()}\n${koerper.trim()}\n`);

let css = readFileSync(join(hier, 'styles.css'), 'utf8');
css = css.replace(/url\('fonts\/([^']+)'\)/g, (_, datei) => `url('data:font/woff2;base64,${readFileSync(join(hier, 'fonts', datei)).toString('base64')}')`);
writeFileSync(join(ziel, 'styles.css'), css);
dateien['styles.css'] = join(ziel, 'styles.css');

for (const datei of readdirSync(join(hier, 'app')).filter((d) => d.endsWith('.js'))) kopiere(join(hier, 'app', datei), `app/${datei}`);
// In der veröffentlichten Fassung liegt die Türregel neben main.js; den Repository-Pfad direkt ersetzen.
const mainPfad = join(ziel, 'app', 'main.js');
writeFileSync(mainPfad, readFileSync(mainPfad, 'utf8').replace("'../../prototype/dist/door-rules.mjs'", "'./door-rules.mjs'"));
for (const datei of readdirSync(join(hier, 'app', 'ansichten')).filter((d) => d.endsWith('.js'))) kopiere(join(hier, 'app', 'ansichten', datei), `app/ansichten/${datei}`);
kopiere(join(hier, '..', 'prototype', 'dist', 'door-rules.mjs'), 'app/door-rules.mjs', 'text/javascript');
kopiere(join(hier, 'vendor', 'leaflet', 'leaflet.js'), 'vendor/leaflet/leaflet.js');
kopiere(join(hier, 'vendor', 'leaflet', 'leaflet.css'), 'vendor/leaflet/leaflet.css');
kopiere(join(hier, 'daten', 'dortmund-stadtbezirke.geojson'), 'daten/dortmund-stadtbezirke.geojson', 'application/json');

writeFileSync(join(ziel, 'dateien.json'), JSON.stringify(dateien, null, 2));
console.log(`Artifact-Fassung erstellt in ${ziel} (${Object.keys(dateien).length} Begleitdateien, Liste in dateien.json)`);
