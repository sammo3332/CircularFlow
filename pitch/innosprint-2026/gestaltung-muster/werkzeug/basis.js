// Bausteine der Musterfolien: Farben, Textmaße, Formen, Pillen. Maße in Pixeln einer Folie von 1920 x 1080.
// Die Standardschrift, die Canva über die Schnittstelle setzt, hat dieselben Zeichenbreiten wie Arial
// (an der Probeseite gemessen); die lokale Vorschau rechnet deshalb mit Liberation Sans.
const BREITEN = require('./schriftbreiten.json');

const F = {
  gruen: '#0E5546', gruenTief: '#0B4638', gruenMittel: '#1D7A64', gruenHell: '#E0EEE8',
  creme: '#F6F2EA', creme2: '#EDE6D8', linie: '#DDD5C5', weiss: '#FFFFFF',
  bernstein: '#F2A33A', bernsteinDunkel: '#C97F1A', bernsteinTief: '#96590A', bernsteinHell: '#FCEBCB',
  rot: '#C8402F', rotDunkel: '#A2261D',
  tinte: '#17201D', tinte2: '#3F4A45', tinte3: '#59655F',
  simF: '#F5EECB', simT: '#594810',
};

// Lage der Grundlinie unter der Oberkante des Textkastens (gemessen im Canva-Export): 0,9465 x Schriftgröße
const GRUNDLINIE = 0.9465;
const VERSAL = 0.716; // Versalhöhe von Arial

function breite(text, groesse, fett) {
  const tab = BREITEN[fett ? 'bold' : 'normal'];
  let s = 0;
  for (const z of text) { if (tab[z] === undefined) throw new Error(`Zeichenbreite fehlt: „${z}“ in „${text}“`); s += tab[z]; }
  return (s / 1000) * groesse;
}

// Text. ankerX bezieht sich je nach Ausrichtung auf linke Kante, Mitte oder rechte Kante; y ist die Oberkante.
function text(name, inhalt, { x, y, g, fett = false, farbe = F.tinte, ausr = 'start', zh = 1.2, luft = 0.03 }) {
  const zeilen = inhalt.split('\n');
  const tb = Math.max(...zeilen.map((z) => breite(z, g, fett)));
  const w = Math.ceil(tb * (1 + luft) + 8);
  const left = ausr === 'start' ? x : ausr === 'center' ? x - w / 2 : x - w;
  return { art: 'text', name, text: inhalt, x: Math.round(left * 10) / 10, y: Math.round(y * 10) / 10, w, g, fett, farbe, ausr, zh, textbreite: tb, zeilen: zeilen.length };
}
// Oberkante so, dass die Versalien einer einzeiligen Schrift auf der Höhe cy mittig stehen
const obenFuerMitte = (cy, g) => cy - (GRUNDLINIE - VERSAL / 2) * g;

const r1 = (n) => Math.round(n * 10) / 10;
// Pfad eines Rechtecks mit runden Ecken im Kasten 0..w, 0..h
function rundPfad(w, h, r, ox = 0, oy = 0, gegen = false) {
  r = Math.min(r, w / 2, h / 2); const a = r1(ox), b = r1(oy), c = r1(ox + w), d = r1(oy + h), R = r1(r);
  if (!r) return gegen ? `M${a} ${b}V${d}H${c}V${b}Z` : `M${a} ${b}H${c}V${d}H${a}Z`;
  if (gegen) return `M${r1(ox + r)} ${b}A${R} ${R} 0 0 0 ${a} ${r1(oy + r)}V${r1(oy + h - r)}A${R} ${R} 0 0 0 ${r1(ox + r)} ${d}H${r1(ox + w - r)}A${R} ${R} 0 0 0 ${c} ${r1(oy + h - r)}V${r1(oy + r)}A${R} ${R} 0 0 0 ${r1(ox + w - r)} ${b}Z`;
  return `M${r1(ox + r)} ${b}H${r1(ox + w - r)}A${R} ${R} 0 0 1 ${c} ${r1(oy + r)}V${r1(oy + h - r)}A${R} ${R} 0 0 1 ${r1(ox + w - r)} ${d}H${r1(ox + r)}A${R} ${R} 0 0 1 ${a} ${r1(oy + h - r)}V${r1(oy + r)}A${R} ${R} 0 0 1 ${r1(ox + r)} ${b}Z`;
}
// Form aus einem Pfad im Kasten w x h (mindestens 8 Pixel je Richtung, sonst vergrößert Canva das Element)
function form(name, { x, y, w, h, d, farbe, rand, deck }) {
  if (w < 8 || h < 8) throw new Error(`Form ${name} ist kleiner als 8 Pixel: ${w} x ${h}`);
  return { art: 'form', name, x: r1(x), y: r1(y), w: r1(w), h: r1(h), d, farbe, rand, deck };
}
const rechteck = (name, { x, y, w, h, r = 0, farbe, rand, deck }) => form(name, { x, y, w, h, d: rundPfad(w, h, r), farbe, rand, deck });
// Rahmen (Ring) mit runden Ecken und Strichstärke s als gefüllte Fläche
const rahmen = (name, { x, y, w, h, r, s, farbe, deck }) => form(name, { x, y, w, h, d: rundPfad(w, h, r) + ' ' + rundPfad(w - 2 * s, h - 2 * s, Math.max(r - s, 0), s, s, true), farbe, deck });
// Waagerechte oder senkrechte Linie mit Stärke s (im 8 Pixel hohen Kasten, damit Canva sie nicht aufbläst)
function linie(name, { x1, y1, x2, y2, s, farbe, deck }) {
  if (y1 === y2) { const k = Math.max(8, s); return form(name, { x: Math.min(x1, x2), y: y1 - k / 2, w: Math.abs(x2 - x1), h: k, d: `M0 ${r1((k - s) / 2)}H${r1(Math.abs(x2 - x1))}V${r1((k + s) / 2)}H0Z`, farbe, deck }); }
  if (x1 === x2) { const k = Math.max(8, s); return form(name, { x: x1 - k / 2, y: Math.min(y1, y2), w: k, h: Math.abs(y2 - y1), d: `M${r1((k - s) / 2)} 0H${r1((k + s) / 2)}V${r1(Math.abs(y2 - y1))}H${r1((k - s) / 2)}Z`, farbe, deck }); }
  throw new Error('nur waagerechte oder senkrechte Linien');
}
const bild = (name, datei, { x, y, w, h, alt }) => ({ art: 'bild', name, datei, x: r1(x), y: r1(y), w: r1(w), h: r1(h), alt });

// Pille: Fläche und mittig gesetzte Schrift. ausr 'links': x ist linke Kante; 'rechts': x ist rechte Kante; 'mitte': Mitte.
function pille(name, inhalt, { x, y, h = 52, g = 26, fett = true, fg, bg, rand, ausr = 'links', pad = 22 }) {
  const tb = breite(inhalt, g, fett); const w = Math.ceil(tb + 2 * pad);
  const left = ausr === 'links' ? x : ausr === 'rechts' ? x - w : x - w / 2;
  const fl = rechteck(name + ' · Fläche', { x: left, y, w, h, r: h / 2, farbe: bg, rand });
  const t = text(name, inhalt, { x: left + w / 2, y: obenFuerMitte(y + h / 2, g), g, fett, farbe: fg, ausr: 'center' });
  return { teile: [fl, t], w, left, rechts: left + w };
}

module.exports = { F, GRUNDLINIE, VERSAL, breite, text, obenFuerMitte, rundPfad, form, rechteck, rahmen, linie, bild, pille, r1 };
