// Erzeugt die veröffentlichbare Fassung des Entwurfs (claude.ai Artifact) aus den Repository-Dateien.
// Aufruf vom Repository-Root: node entwurf/plattform/bauen-artifact.mjs <Zielordner>
// Die Seite verliert den HTML-Rahmen (den setzt die Plattform), Schriften werden als data:-URI eingebettet.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = dirname(fileURLToPath(import.meta.url));
const ziel = process.argv[2];
if (!ziel) { console.error('Zielordner fehlt.'); process.exit(1); }
mkdirSync(ziel, { recursive: true });

const html = readFileSync(join(hier, 'index.html'), 'utf8');
const kopf = html.split('<!-- ARTIFACT-START -->')[1].split('<!-- ARTIFACT-HEAD-END -->')[0];
const koerper = html.split('<body>')[1].split('<!-- ARTIFACT-END -->')[0];
writeFileSync(join(ziel, 'index.html'), `${kopf.trim()}\n${koerper.trim()}\n`);

let css = readFileSync(join(hier, 'styles.css'), 'utf8');
css = css.replace(/url\('fonts\/([^']+)'\)/g, (_, datei) => `url('data:font/woff2;base64,${readFileSync(join(hier, 'fonts', datei)).toString('base64')}')`);
writeFileSync(join(ziel, 'styles.css'), css);

for (const datei of ['app.js', 'daten.js']) copyFileSync(join(hier, datei), join(ziel, datei));
copyFileSync(join(hier, '..', '..', 'prototype', 'dist', 'door-rules.mjs'), join(ziel, 'door-rules.mjs'));
console.log('Artifact-Fassung erstellt in', ziel);
