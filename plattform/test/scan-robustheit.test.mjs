import test from 'node:test';
import assert from 'node:assert/strict';
import { ausEtikett, gepruefterEntwurf } from '../etikett-versuch/etikett.mjs';
import { leseTypenschild, lesartenVerbinden, kontrastPixel, drehungsGeometrie } from '../etikett-versuch/lesepipeline.mjs';
import { etikettStart, etikettUebernehmen } from '../app/etikett-integration.js';
import { erfassung, leererEntwurf, fortschrittText } from '../app/ansichten/erfassung.js';
import { neuerUiZustand } from '../app/uizustand.js';
import { kontext } from './_hilfe.mjs';

const voll = 'Hersteller: Musterwerk\nModell: T-17\nSeriennummer: A-123\nBaujahr: 2020';
test('Übliche Beschriftungen, kein Doppelpunkt, Gleichheitszeichen und getrennte Spalten', () => {
  for (const text of ['Fabrikat Musterwerk\nTyp = T-17\nSer.-Nr. A-123\nHerstellungsjahr 2020', 'Manufacturer: Musterwerk | Model: T-17\nS/N: A-123; Year: 2020']) {
    const r = ausEtikett(text, 2026);
    assert.deepEqual(Object.values(r.felder).map((f) => f.wert), ['Musterwerk', 'T-17', 'A-123', '2020']);
  }
});
test('Zweizeilige Etikettfelder ohne Wertverschiebung zum nächsten Feld', () => {
  const r = ausEtikett('Hersteller\nMusterwerk\nModell\nT-17\nSeriennummer\nBaujahr\n2020');
  assert.equal(r.felder.seriennummer.status, 'fehlt'); assert.equal(r.felder.baujahr.wert, '2020');
  assert.match(r.felder.hersteller.beleg, /Hersteller.*Musterwerk/);
});
test('Unbeschriftete Prosa, Artikelnummer, Maße und Feuerwiderstand werden nicht als Fachwerte übernommen', () => {
  const r = ausEtikett('Braune Tür aus Holz\nArtikelnummer ABC\nBreite: 985 mm\nT30\n2020');
  assert.ok(Object.values(r.felder).every((f) => f.status === 'fehlt'));
  assert.equal(r.felder.breite, undefined);
});
test('Unterschiedliche Leseversuche ergänzen fehlende Angaben, ohne sie zu bestätigen', () => {
  const r = lesartenVerbinden([{ text: 'Hersteller: Musterwerk', variante: 'Original', confidence: 90 }, { text: 'Modell: T-17\nBaujahr: 2020', variante: 'Kontrast', confidence: 80 }]);
  assert.equal(r.felder.hersteller.wert, 'Musterwerk'); assert.equal(r.felder.modell.status, 'vorgeschlagen');
  assert.equal(r.felder.seriennummer.status, 'fehlt'); assert.match(r.hinweise.join(' '), /Seriennummer nicht erkannt/);
  assert.throws(() => gepruefterEntwurf(r, { hersteller: { wert: 'Musterwerk', geprueft: false } }), /bestätigen/);
});
test('Konflikte zwischen Durchläufen werden weder nach Confidence noch Feldanzahl entschieden', () => {
  const r = lesartenVerbinden([{ text: voll, variante: 'Original', confidence: 99 }, { text: 'Hersteller: Andere Firma', variante: 'Kontrast', confidence: 10 }]);
  assert.equal(r.felder.hersteller.status, 'uneindeutig'); assert.equal(r.felder.hersteller.wert, '');
  assert.match(r.hinweise.join(' '), /unterschiedliche/);
});
test('Vollständiges stark bewertetes Bild benötigt nur einen echten Leseaufruf', async () => {
  let n = 0;
  const worker = { setParameters: async () => {}, recognize: async () => { n++; return { data: { text: voll, confidence: 95 } }; } };
  const r = await leseTypenschild(worker, 'original', { kontrastBild: () => { throw Error('unnötig'); } });
  assert.equal(n, 1); assert.equal(r.ocr.versuche.length, 1);
});
test('Fehlende Angaben führen genau zu einem zweiten Versuch mit anderer Zeilenaufteilung', async () => {
  const modes = []; const bilder = [];
  const worker = { setParameters: async (p) => modes.push(p.tessedit_pageseg_mode), recognize: async (bild) => { bilder.push(bild); return { data: { text: bild === 'original' ? 'Hersteller: Musterwerk' : voll, confidence: 90 } }; } };
  const r = await leseTypenschild(worker, 'original', { kontrastBild: async () => 'kontrast' });
  assert.deepEqual(modes, ['6', '11']); assert.deepEqual(bilder, ['original', 'kontrast']); assert.equal(r.felder.modell.wert, 'T-17');
});
test('Abbruch verhindert zweiten Durchlauf und jede Ergebnisübernahme', async () => {
  let aktiv = true; let n = 0;
  const worker = { setParameters: async () => {}, recognize: async () => { n++; aktiv = false; return { data: { text: voll } }; } };
  await assert.rejects(leseTypenschild(worker, 'bild', { aktiv: () => aktiv }), /abgebrochen/); assert.equal(n, 1);
});
test('Kontrast: schwaches Signal spreizen, transparenten Hintergrund weiß behandeln, leeres Bild leer lassen', () => {
  assert.deepEqual([...kontrastPixel(new Uint8ClampedArray([180,180,180,255,200,200,200,255]))], [0,0,0,255,255,255,255,255]);
  assert.deepEqual([...kontrastPixel(new Uint8ClampedArray([0,0,0,0]))], [255,255,255,255]);
  assert.deepEqual([...kontrastPixel(new Uint8ClampedArray([255,255,255,255]))], [255,255,255,255]);
});
test('Vierteldrehung tauscht nur bei 90/270 Grad die Bildmaße; andere Werte sind gesperrt', () => {
  assert.equal(drehungsGeometrie(1200, 800, 90).breite, 800); assert.equal(drehungsGeometrie(1200, 800, 180).hoehe, 800);
  assert.throws(() => drehungsGeometrie(1200, 800, 13), /Drehung/);
});
test('Verbundenes Leseergebnis bleibt im bestätigten Entwurf nachvollziehbar und ohne Fachfreigabe', () => {
  const scan = lesartenVerbinden([{ text: voll, variante: 'Original', confidence: 90 }]);
  const e = etikettStart(scan.rohtext, { daten: 'data:foto' }, scan);
  Object.values(e.pruefung).forEach((p) => { p.geprueft = true; });
  const b = etikettUebernehmen(e); assert.equal(b.felder.hersteller.herkunft, 'ausgelesen');
  assert.match(b.rohtext, /Leseversuch 1/); assert.equal(b.fachfreigabe, false); assert.equal(b.aufmass.status, 'fehlt');
});
test('Oberfläche zeigt Drehung, erneutes Lesen und ungeprüfte Vorschläge; Fortschritt unterscheidet den zweiten Versuch', () => {
  const ui = neuerUiZustand(); ui.erfassung = { ...leererEntwurf('LH', '1.14'), schritt: 2, etikettDatei: {}, etikettDrehung: 90 };
  const html = erfassung({ ...kontext(), ui, eigeneAenderungen: 0 });
  assert.match(html, /id="erf-etikett-drehung"/); assert.match(html, /value="90" selected/);
  assert.match(html, /Foto erneut auslesen/); assert.match(html, /Unterschiedliche Lesarten bleiben offen/);
  assert.match(fortschrittText({ phase: 'erneut', prozent: 10 }), /Zweiter Leseversuch/);
});

test('Trenner innerhalb eines Herstellernamens werden ohne folgende Feldbeschriftung erhalten', () => {
  assert.equal(ausEtikett('Hersteller: Alpha; Beta GmbH').felder.hersteller.wert, 'Alpha; Beta GmbH');
});
