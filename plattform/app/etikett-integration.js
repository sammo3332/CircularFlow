// Typenschild lesen (Texterkennung, lokal) und in den Bauteilpass übernehmen. Keine Objekterkennung, kein Aufmaß, keine Fachfreigabe.
// Sprache „deu“: liest deutsche und englische Beschriftungen einschließlich Umlauten (geprüft 19.11.2026 an synthetischen Etiketten).
import { ausEtikett, gepruefterEntwurf, FELDER } from '../etikett-versuch/etikett.mjs';
export { FELDER };
export const OCR_SPRACHE = 'deu';
export const OCR_ZEITLIMIT_MS = 60000;
const TYPEN = ['image/png', 'image/jpeg', 'image/webp'];

export function etikettStart(text, foto = null) {
  const scan = ausEtikett(text);
  return { scan, pruefung: Object.fromEntries(Object.entries(scan.felder).map(([k, v]) => [k, { wert: v.wert, geprueft: false }])), foto, manuell: false };
}
// Angaben ohne Texterkennung von Hand eintragen (Scan nicht möglich oder nicht gewünscht).
export function etikettManuell() {
  const scan = ausEtikett('');
  return { scan, pruefung: Object.fromEntries(Object.keys(FELDER).map((k) => [k, { wert: '', geprueft: false }])), foto: null, manuell: true };
}
export function etikettUebernehmen(etikett) {
  if (!etikett) return null;
  if (!Object.values(etikett.pruefung).some((x) => String(x.wert).trim())) return null;
  const mitFoto = Boolean(etikett.foto?.daten);
  return { ...gepruefterEntwurf(etikett.scan, etikett.pruefung, undefined, { mitFoto }), foto: etikett.foto || null, manuell: Boolean(etikett.manuell),
    hinweis: mitFoto ? 'Etikettangaben am Foto bestätigt. Kein Aufmaß und keine Fachfreigabe.' : 'Etikettangaben manuell eingegeben und geprüft, ohne Foto. Kein Aufmaß und keine Fachfreigabe.' };
}
// Zahl der erkannten Vorschläge für die Anzeige.
export const erkannteFelder = (etikett) => Object.values(etikett?.scan?.felder || {}).filter((f) => f.status === 'vorgeschlagen').length;

// Abbruch-Handgriff: abbrechen() beendet eine laufende Texterkennung (der Worker wird beendet, es wird nichts übernommen).
export function etikettAbbruch() { const a = { aktiv: false, cb: null, abbrechen() { a.aktiv = true; if (a.cb) a.cb(); } }; return a; }

// Liest ein Etikettfoto. log({ phase, prozent }) meldet den Fortschritt. Wirft verständliche Fehler bei Dateityp, Größe,
// beschädigtem Bild, fehlender Engine, Zeitüberschreitung oder Abbruch.
export async function etikettLesen(file, { log = () => {}, abbruch = null, zeitlimitMs = OCR_ZEITLIMIT_MS, sprache = OCR_SPRACHE } = {}) {
  if (!file) throw new Error('Bitte ein Foto des Typenschilds wählen.');
  if (!TYPEN.includes(file.type)) throw new Error('Bitte ein JPEG-, PNG- oder WebP-Foto wählen. Andere Dateitypen werden nicht gelesen.');
  if (file.size > 20 * 1024 * 1024) throw new Error('Das Foto ist größer als 20 MB. Bitte eine kleinere Aufnahme wählen.');
  log({ phase: 'bild', prozent: 0 });
  const foto = await etikettFoto(file); // beschädigte Bilder scheitern hier, bevor die Engine lädt
  let worker = null; let timer = null; let beendet = false;
  const aufraeumen = async () => { clearTimeout(timer); if (worker) { const w = worker; worker = null; try { await w.terminate(); } catch { /* schon beendet */ } } };
  const abbruchVersprechen = new Promise((_, fail) => {
    timer = setTimeout(() => { beendet = true; fail(new Error('Die Texterkennung dauert zu lange (über 60 Sekunden). Bitte näher und schärfer fotografieren oder die Angaben von Hand eintragen.')); }, zeitlimitMs);
    if (abbruch) abbruch.cb = () => { beendet = true; fail(new Error('Texterkennung abgebrochen. Es wurde nichts übernommen.')); };
  });
  const lauf = (async () => {
    log({ phase: 'laden', prozent: 0 });
    let createWorker;
    try { const mod = await import('../etikett-versuch/vendor/tesseract.esm.min.js'); createWorker = mod.createWorker || mod.default?.createWorker; if (typeof createWorker !== 'function') throw new Error('kein createWorker'); } catch { throw new Error('Die Texterkennung ist nicht geladen (Engine fehlt). Im Ordner plattform/etikett-versuch „npm install“ und „npm run vendor“ ausführen oder die Angaben von Hand eintragen.'); }
    const root = new URL('../etikett-versuch/vendor/', import.meta.url);
    worker = await createWorker(sprache, 1, {
      workerPath: new URL('worker.min.js', root).href, corePath: new URL('core/', root).href, langPath: new URL('lang', root).href, workerBlobURL: false, gzip: false, cacheMethod: 'none',
      logger: (m) => { if (beendet) return; if (m.status === 'recognizing text') log({ phase: 'lesen', prozent: Math.round((m.progress || 0) * 100) }); else if (/loading|initializing/.test(m.status || '')) log({ phase: 'laden', prozent: Math.round((m.progress || 0) * 100) }); },
    });
    if (beendet) throw new Error('abgebrochen');
    await worker.setParameters({ tessedit_pageseg_mode: '6' });
    const { data } = await worker.recognize(foto.blob);
    if (beendet) throw new Error('abgebrochen');
    log({ phase: 'fertig', prozent: 100 });
    return etikettStart(data.text, { daten: foto.daten, name: file.name, breite: foto.breite, hoehe: foto.hoehe });
  })();
  try { return await Promise.race([lauf, abbruchVersprechen]); }
  finally { beendet = true; await aufraeumen(); }
}

// Verkleinert das Etikettfoto (längste Seite 1600 px) für Anzeige und Speicher und liefert es auch als Blob für die Engine.
async function etikettFoto(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => fail(new Error('Das Bild konnte nicht gelesen werden. Die Datei ist beschädigt oder kein unterstütztes Bild.')); i.src = url; });
    if (!img.naturalWidth || !img.naturalHeight) throw new Error('Das Bild ist leer.');
    if (img.naturalWidth * img.naturalHeight > 24000000) throw new Error('Das Foto hat mehr als 24 Megapixel. Bitte mit geringerer Auflösung aufnehmen.');
    const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas'); canvas.width = Math.round(img.naturalWidth * scale); canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((ok) => canvas.toBlob(ok, 'image/jpeg', 0.92));
    return { daten: canvas.toDataURL('image/jpeg', 0.9), blob: blob || file, breite: canvas.width, hoehe: canvas.height };
  } finally { URL.revokeObjectURL(url); }
}
