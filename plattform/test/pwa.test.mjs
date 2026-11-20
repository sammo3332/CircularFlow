// CF-PWA-01: Manifest, Icons, Installationshilfe und die Foto-Wege der Erfassung (Plan: docs/plan-pwa-erfassung.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { kontext } from './_hilfe.mjs';
import { leerePersistenz } from '../app/zustand.js';
import { neuerUiZustand } from '../app/uizustand.js';
import { erfassung } from '../app/ansichten/erfassung.js';
import { installieren, geraeteArt } from '../app/ansichten/installieren.js';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
const lies = (d) => readFileSync(join(wurzel, d), 'utf8');
// Breite und Höhe stehen im IHDR-Block einer PNG-Datei an fester Stelle.
const pngMass = (d) => { const b = readFileSync(join(wurzel, d)); assert.equal(b.subarray(1, 4).toString('latin1'), 'PNG', `${d} ist keine PNG-Datei`); return `${b.readUInt32BE(16)}x${b.readUInt32BE(20)}`; };
const mitUi = (p = leerePersistenz(), inst = {}) => ({ ...kontext(p), ui: Object.assign(neuerUiZustand(), { installation: { art: 'android', laeuftAlsApp: false, angebot: false, sicher: true, manifest: true, ergebnis: '', ...inst } }), geo: null, eigeneAenderungen: 0 });

test('A1 Manifest: Pflichtangaben, Start bei der Erfassung, Icons in der genannten Größe', () => {
  const m = JSON.parse(lies('manifest.webmanifest'));
  assert.equal(m.name, 'CircularFlow Plattform'); assert.equal(m.short_name, 'CircularFlow');
  assert.equal(m.display, 'standalone'); assert.equal(m.lang, 'de');
  assert.equal(m.start_url, './#erfassung'); assert.equal(m.scope, './');
  assert.match(m.theme_color, /^#[0-9a-f]{6}$/); assert.match(m.background_color, /^#[0-9a-f]{6}$/);
  for (const i of m.icons) { assert.ok(existsSync(join(wurzel, i.src)), `${i.src} fehlt`); assert.equal(pngMass(i.src), i.sizes); assert.equal(i.type, 'image/png'); }
  assert.ok(m.icons.some((i) => i.sizes === '192x192' && i.purpose === 'any'));
  assert.ok(m.icons.some((i) => i.sizes === '512x512' && i.purpose === 'any'));
  assert.ok(m.icons.some((i) => i.sizes === '512x512' && i.purpose === 'maskable'));
  assert.equal(pngMass('icons/apple-touch-icon.png'), '180x180');
  assert.doesNotMatch(JSON.stringify(m), /offline/i, 'Das Manifest verspricht keine Offline-Nutzung');
});

test('A1/A9 Seitenkopf: Manifest und iOS-Angaben stehen vor dem Bereich der veröffentlichten Vorschau', () => {
  const html = lies('index.html');
  const [vor, rest] = html.split('<!-- ARTIFACT-START -->');
  for (const teil of ['rel="manifest" href="manifest.webmanifest"', 'name="theme-color"', 'rel="apple-touch-icon" href="icons/apple-touch-icon.png"', 'apple-mobile-web-app-capable']) assert.ok(vor.includes(teil), `${teil} fehlt im Kopf`);
  assert.doesNotMatch(rest, /manifest|apple-touch|theme-color/);
  assert.ok(existsSync(join(wurzel, 'icons/icon.svg')));
});

test('Kein Service Worker: Offline-Nutzung ist nicht umgesetzt und wird nirgends registriert', () => {
  assert.doesNotMatch(lies('app/main.js'), /serviceWorker/);
  assert.doesNotMatch(lies('index.html'), /serviceWorker/);
});

test('A3 Installationshilfe: Grenzen stehen immer da, drei Wege, eigener Weg zuerst', () => {
  for (const art of ['android', 'ios', 'ios-anderer', 'rechner', 'rechner-firefox', 'rechner-safari', 'android-firefox', 'unbekannt']) {
    const html = installieren(mitUi(undefined, { art }));
    assert.doesNotMatch(html, /undefined|\[object Object\]|NaN/, art);
    assert.match(html, /keine Offline-Nutzung/); assert.match(html, /keine Synchronisierung/); assert.match(html, /Kein App-Store/);
    for (const t of ['Android · Chrome', 'iPhone und iPad · Safari', 'Rechner · Chrome oder Edge']) assert.ok(html.includes(t), `${t} fehlt (${art})`);
  }
  const ios = installieren(mitUi(undefined, { art: 'ios' }));
  assert.ok(ios.indexOf('iPhone und iPad') < ios.indexOf('Android · Chrome'), 'eigener Weg steht zuerst');
  assert.match(ios, /Zum Home-Bildschirm/); assert.match(ios, /eigenen Speicher/);
});

test('A3 Installationshilfe: Knopf nur bei Angebot des Browsers; Lage wird ehrlich benannt', () => {
  assert.doesNotMatch(installieren(mitUi()), /data-action="installieren"/);
  assert.match(installieren(mitUi(undefined, { angebot: true })), /data-action="installieren"/);
  const app = installieren(mitUi(undefined, { laeuftAlsApp: true, angebot: true }));
  assert.match(app, /läuft als installierte App/); assert.doesNotMatch(app, /data-action="installieren"/);
  assert.match(installieren(mitUi(undefined, { sicher: false, angebot: true })), /nicht über HTTPS/);
  assert.doesNotMatch(installieren(mitUi(undefined, { sicher: false, angebot: true })), /data-action="installieren"/);
  assert.match(installieren(mitUi(undefined, { manifest: false })), /lässt sich nicht installieren/);
  assert.match(installieren(mitUi(undefined, { angebot: true, ergebnis: 'abgelehnt' })), /abgebrochen/);
  assert.match(installieren({ ...mitUi(), ui: neuerUiZustand() }), /keine Offline-Nutzung/, 'rendert auch ohne Installationszustand');
});

test('Geräteart aus der Browserkennung', () => {
  assert.equal(geraeteArt('Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36'), 'android');
  assert.equal(geraeteArt('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'), 'ios');
  assert.equal(geraeteArt('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 CriOS/130.0 Mobile/15E148 Safari/604.1'), 'ios-anderer');
  assert.equal(geraeteArt('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15', 5), 'ios', 'iPad meldet sich als Mac mit Touch');
  assert.equal(geraeteArt('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15', 0), 'rechner-safari');
  assert.equal(geraeteArt('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36 Edg/130.0'), 'rechner');
  assert.equal(geraeteArt('Mozilla/5.0 (X11; Linux x86_64; rv:132.0) Gecko/20100101 Firefox/132.0'), 'rechner-firefox');
  assert.equal(geraeteArt('Mozilla/5.0 (Android 14; Mobile; rv:132.0) Gecko/132.0 Firefox/132.0'), 'android-firefox');
  assert.equal(geraeteArt(''), 'unbekannt');
});

test('A5 Foto-Schritt: ein Feld mit Kamera, eines ohne; lokale Speicherung ist gekennzeichnet', () => {
  const c = mitUi(); c.ui.erfassung = { ...c.ui.erfassung, schritt: 2, projekt: 'LH', raum: '1.14' };
  const html = erfassung(c);
  assert.match(html, /<input type="file" id="erf-foto" accept="image\/\*" capture="environment"/);
  const wahl = html.match(/<input type="file" id="erf-foto-wahl"[^>]*>/)?.[0];
  assert.ok(wahl, 'Feld „Vorhandenes Bild wählen“ fehlt'); assert.doesNotMatch(wahl, /capture/);
  assert.match(html, /Nur auf diesem Gerät/); assert.match(html, /nicht hochgeladen/);
  assert.doesNotMatch(html, /href="#installieren"/, 'der Hinweis steht nur am Anfang');
  c.ui.erfassung.schritt = 1;
  assert.match(erfassung(c), /href="#installieren"/);
  c.ui.installation.laeuftAlsApp = true;
  assert.doesNotMatch(erfassung(c), /href="#installieren"/, 'als App kein Installationshinweis');
});

test('A4/A6 Prüfschritt und Liste: Hinweis auf fehlende Synchronisierung, Vorschaubild, Link zum Pass', () => {
  const p = leerePersistenz();
  const bild = 'data:image/jpeg;base64,AAAA';
  p.erfassungen.push({ projekt: 'LH', id: 'T-90', gruppe: 'tuer', name: 'Innentür', raum: '1.14', etage: 'OG1', menge: 1, einheit: 'Stk', werte: {}, nachweise: [], foto: { daten: bild, breite: 4, hoehe: 4, name: 'a.jpg' }, erfassung: { art: 'Mobile Erfassung' } });
  p.erfassungen.push({ projekt: 'LH', id: 'T-91', gruppe: 'tuer', name: 'Innentür', raum: '1.14', etage: 'OG1', menge: 1, einheit: 'Stk', werte: {}, nachweise: [], foto: null, erfassung: { art: 'Mobile Erfassung' } });
  const c = mitUi(p); c.eigeneAenderungen = 2;
  c.ui.erfassung = { ...c.ui.erfassung, schritt: 5, projekt: 'LH', raum: '1.14', gruppe: 'tuer' };
  const html = erfassung(c);
  assert.match(html, /keine Synchronisierung/);
  assert.match(html, new RegExp(`<a href="#pass-lh-t-90"[^>]*>\\s*<img class="kl-bild" src="${bild}"`));
  assert.match(html, /<a href="#pass-lh-t-91"[^>]*><span class="kl-bild kl-bild-leer"/);
  assert.match(html, /In diesem Browser gespeichert/);
  c.ui.erfassung = { ...c.ui.erfassung, gespeichert: { key: 'LH:T-90', fotoHinweis: '' } };
  const fertig = erfassung(c);
  assert.match(fertig, /Bauteilpass öffnen/); assert.match(fertig, /ohne Synchronisierung/);
  assert.match(fertig, /class="kl-bild"/, 'Liste steht auch nach dem Speichern da');
});
