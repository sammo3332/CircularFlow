// Gemeinsamer Ablauf für Plattform und den echten OCR-Versuch. Keine erfundenen Metadaten.
import { ausEtikett, FELDER } from './etikett.mjs';

export const anzahlVorschlaege = (scan) => Object.values(scan.felder).filter((f) => f.status === 'vorgeschlagen').length;
// 80 ist eine technische Versuchsschwelle, keine kalibrierte Wahrscheinlichkeit für richtige Angaben.
export const weitererVersuchNoetig = (scan, confidence) => anzahlVorschlaege(scan) < 4 || !Number.isFinite(confidence) || confidence < 80;

export function lesartenVerbinden(versuche, maxJahr) {
  if (!versuche.length) throw new Error('Kein Leseergebnis vorhanden.');
  const scans = versuche.map((v) => ausEtikett(v.text, maxJahr));
  const felder = {}; const hinweise = [];
  for (const key of Object.keys(FELDER)) {
    const kandidaten = scans.map((s) => s.felder[key]);
    const werte = [...new Set(kandidaten.filter((f) => f.status === 'vorgeschlagen').map((f) => f.wert))];
    const unklar = kandidaten.some((f) => f.status === 'uneindeutig');
    if (werte.length > 1 || unklar) {
      felder[key] = { wert: '', status: 'uneindeutig', quelle: '', beleg: '' };
      hinweise.push(`${FELDER[key]}: unterschiedliche oder unklare Lesarten. Am Foto klären und von Hand eintragen.`);
    } else if (werte.length === 1) felder[key] = kandidaten.find((f) => f.status === 'vorgeschlagen');
    else {
      felder[key] = { wert: '', status: 'fehlt', quelle: '', beleg: '' };
      hinweise.push(`${FELDER[key]} nicht erkannt. Am Schild nachsehen oder Angabe offen lassen.`);
    }
  }
  if (!Object.values(felder).some((f) => f.status === 'vorgeschlagen')) hinweise.push('Keine eindeutig beschrifteten Metadaten erkannt. Näher und schärfer fotografieren oder manuell erfassen.');
  return { schema: 'cf-etikett-v1', felder, hinweise,
    rohtext: versuche.map((v, i) => `Leseversuch ${i + 1} (${v.variante}):\n${String(v.text).slice(0, 16000)}`).join('\n\n'),
    grenzen: 'Keine Bauteilerkennung, kein Aufmaß, keine Fachfreigabe.',
    ocr: { versuche: versuche.map((v) => ({ variante: v.variante, confidence: Number.isFinite(v.confidence) ? v.confidence : null })), hinweis: 'Engine-Bewertung ist keine Bestätigung der Richtigkeit.' } };
}

export async function leseTypenschild(worker, bild, { kontrastBild = async () => bild, maxJahr = new Date().getFullYear(), aktiv = () => true, fortschritt = () => {} } = {}) {
  const versuche = [];
  for (let i = 0; i < 2; i++) {
    if (!aktiv()) throw new Error('Texterkennung abgebrochen.');
    fortschritt(i + 1);
    const eingang = i === 0 ? bild : await kontrastBild();
    if (!aktiv()) throw new Error('Texterkennung abgebrochen.');
    await worker.setParameters({ tessedit_pageseg_mode: i === 0 ? '6' : '11' });
    const { data } = await worker.recognize(eingang);
    if (!aktiv()) throw new Error('Texterkennung abgebrochen.');
    const text = String(data.text || '').slice(0, 16000);
    versuche.push({ text, confidence: data.confidence, variante: i === 0 ? 'Original' : 'Kontrast und freie Zeilen' });
    if (i === 0 && !weitererVersuchNoetig(ausEtikett(text, maxJahr), data.confidence)) break;
  }
  return lesartenVerbinden(versuche, maxJahr);
}

// Graustufen mit begrenzter Kontrastspreizung; identischer Algorithmus im Browser und Bildtest.
export function kontrastPixel(rgba) {
  if (rgba.length % 4) throw new Error('Ungültige Bildpixel.');
  const hist = new Uint32Array(256); const grau = new Uint8Array(rgba.length / 4);
  for (let i = 0; i < grau.length; i++) {
    const a = rgba[i * 4 + 3] / 255;
    const g = Math.round((.299 * rgba[i * 4] + .587 * rgba[i * 4 + 1] + .114 * rgba[i * 4 + 2]) * a + 255 * (1 - a));
    grau[i] = g; hist[g]++;
  }
  const quantil = (anteil) => { let sum = 0; for (let i = 0; i < 256; i++) { sum += hist[i]; if (sum > grau.length * anteil) return i; } return 255; };
  const lo = quantil(.005); const hi = quantil(.995); const span = Math.max(1, hi - lo);
  const out = new Uint8ClampedArray(rgba.length);
  for (let i = 0; i < grau.length; i++) {
    const v = hi > lo ? Math.max(0, Math.min(255, Math.round((grau[i] - lo) * 255 / span))) : grau[i];
    out.set([v, v, v, 255], i * 4);
  }
  return out;
}

export function drehungsGeometrie(breite, hoehe, grad = 0) {
  if (![0, 90, 180, 270].includes(grad)) throw new Error('Drehung muss 0, 90, 180 oder 270 Grad sein.');
  return { breite: grad % 180 ? hoehe : breite, hoehe: grad % 180 ? breite : hoehe, radians: grad * Math.PI / 180 };
}
