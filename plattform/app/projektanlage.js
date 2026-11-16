// Projekt direkt erfassen: Prüfung und Aufbau eines eigenen Projekts mit schematischem Grundriss. Ohne DOM.
import { ARTEN, BEZIRKE } from './daten.js';
import { istDatum } from './zeit.js';

const text = (v) => String(v ?? '').trim();
export const ETAGEN_MAX = 6;
export const RAEUME_MAX = 8;
// Feste Palette (dunkel genug für weiße Kürzel); die ersten vier Beispielprojekte nutzen andere Farben.
export const PALETTE = ['#1f6f8b', '#8a2f6f', '#2f6b2f', '#b3541e', '#3a4a9f', '#006d77', '#7b3f00', '#5a5f1c'];

const ganzzahl = (v, min, max) => { const t = text(v); return /^\d+$/.test(t) && Number(t) >= min && Number(t) <= max ? Number(t) : null; };

// Fehler je Feld; leeres Objekt = gültig. entwurf: { name, zusatz, art, bezirk, rueckbauAb, entscheidungBis, gebaeudeName, etagen, raeume }
export function pruefeProjekt(entwurf, projekte = []) {
  const fehler = {};
  const name = text(entwurf.name);
  if (!name) fehler.name = 'Bitte einen Projektnamen eingeben.';
  else if (name.length > 80) fehler.name = 'Der Name darf höchstens 80 Zeichen haben.';
  else if (projekte.some((p) => text(p.name).toLocaleLowerCase('de-DE') === name.toLocaleLowerCase('de-DE'))) fehler.name = 'Ein Projekt mit diesem Namen gibt es schon.';
  if (!ARTEN[entwurf.art]) fehler.art = 'Bitte die Art der Maßnahme wählen.';
  if (!BEZIRKE.includes(entwurf.bezirk)) fehler.bezirk = 'Bitte einen Stadtbezirk wählen.';
  for (const k of ['rueckbauAb', 'entscheidungBis']) if (text(entwurf[k]) && !istDatum(text(entwurf[k]))) fehler[k] = 'Bitte ein gültiges Datum eingeben.';
  if (!fehler.rueckbauAb && !fehler.entscheidungBis && text(entwurf.rueckbauAb) && text(entwurf.entscheidungBis) && text(entwurf.entscheidungBis) > text(entwurf.rueckbauAb)) fehler.entscheidungBis = 'Die Entscheidung muss spätestens zum Ausbau fallen.';
  if (ganzzahl(entwurf.etagen, 1, ETAGEN_MAX) === null) fehler.etagen = `Bitte eine ganze Zahl von 1 bis ${ETAGEN_MAX} eingeben.`;
  if (ganzzahl(entwurf.raeume, 1, RAEUME_MAX) === null) fehler.raeume = `Bitte eine ganze Zahl von 1 bis ${RAEUME_MAX} eingeben (Räume je Etage).`;
  if (text(entwurf.gebaeudeName).length > 60) fehler.gebaeudeName = 'Der Gebäudename darf höchstens 60 Zeichen haben.';
  return fehler;
}

const FOLD = (s) => s.replace(/ä/gi, 'a').replace(/ö/gi, 'o').replace(/ü/gi, 'u').replace(/ß/g, 's').normalize('NFD').replace(/[^A-Za-z]/g, '').toUpperCase();

// Eindeutiges Kürzel aus 2 bis 3 Großbuchstaben; kollidiert nie mit vorhandenen (auch nicht mit R1, R2 …, die Ziffern enthalten).
export function neuesKuerzel(name, projekte) {
  const belegt = new Set(projekte.map((p) => String(p.kurz).toUpperCase()));
  const woerter = String(name).split(/[\s\-–/]+/).map(FOLD).filter(Boolean);
  const kandidaten = [];
  const initialen = woerter.map((w) => w[0]).join('');
  if (initialen.length >= 2) kandidaten.push(initialen.slice(0, 3), initialen.slice(0, 2));
  const erstes = woerter[0] || '';
  if (erstes.length >= 2) kandidaten.push(erstes.slice(0, 3), erstes.slice(0, 2));
  const alle = woerter.join('');
  for (let i = 2; i <= alle.length && kandidaten.length < 40; i += 1) kandidaten.push(alle.slice(0, 2) + alle[i] );
  const frei = kandidaten.filter((k) => /^[A-Z]{2,3}$/.test(k)).find((k) => !belegt.has(k));
  if (frei) return frei;
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (const x of A) for (const y of A) { if (!belegt.has(x + y) && !/^R\d/.test(x + y)) return x + y; }
  for (const x of A) for (const y of A) for (const z of A) { if (!belegt.has(x + y + z)) return x + y + z; }
  return 'XXX';
}

const etagenName = (i) => (i === 0 ? { id: 'EG', name: 'Erdgeschoss' } : { id: `${i}.OG`, name: `${i}. Obergeschoss` });

// Schematischer Grundriss im 100 × 60-Raster: n Räume in einem Gitter, Breiten und Höhen füllen das Raster vollständig.
export function grundriss(n) {
  const spalten = n <= 3 ? n : n <= 6 ? Math.ceil(n / 2) : 4;
  const zeilen = Math.ceil(n / spalten);
  const plaene = [];
  for (let i = 0; i < n; i += 1) {
    const z = Math.floor(i / spalten); const s = i % spalten;
    const inZeile = Math.min(spalten, n - z * spalten); // letzte Zeile darf weniger Räume haben und wird aufgeteilt
    const b = Math.floor(100 / inZeile); const h = Math.floor(60 / zeilen);
    plaene.push([s * b, z * h, s === inZeile - 1 ? 100 - s * b : b, z === zeilen - 1 ? 60 - z * h : h]);
  }
  return plaene;
}

export function gebaeudeAus({ gebaeudeName, etagen, raeume }) {
  const ne = Number(etagen); const nr = Number(raeume);
  const plaene = grundriss(nr);
  return [{
    id: 'A', name: text(gebaeudeName) || 'Gebäude A',
    etagen: Array.from({ length: ne }, (_, i) => {
      const e = etagenName(i); const kopf = i === 0 ? 'E' : String(i);
      return { ...e, raeume: plaene.map((plan, j) => ({ id: `${kopf}.${String(j + 1).padStart(2, '0')}`, name: `Raum ${j + 1}`, plan, flaeche: null })) };
    }),
  }];
}

// Baut das Projekt. Zu rufen erst nach pruefeProjekt(...) ohne Fehler.
// mitte: [Breite, Länge] der Bezirksmitte; die Lage bleibt symbolisch.
export function projektAusEntwurf(entwurf, { projekte, mitte, at }) {
  const eigene = projekte.filter((p) => p.herkunft === 'eigen').length;
  const nr = Math.max(0, ...projekte.map((p) => /^P-EIGEN-(\d+)$/.exec(p.id)).filter(Boolean).map((m) => Number(m[1]))) + 1;
  return {
    id: `P-EIGEN-${String(nr).padStart(2, '0')}`, kurz: neuesKuerzel(entwurf.name, projekte), farbe: PALETTE[eigene % PALETTE.length],
    name: text(entwurf.name), zusatz: text(entwurf.zusatz) || 'Eigene Eingabe, Angaben nicht geprüft',
    art: entwurf.art, phase: 'Phase noch nicht erfasst', lp: 0, status: 'neu', bezirk: entwurf.bezirk, lage: [mitte[0], mitte[1]],
    herkunft: 'eigen', angelegt: String(at).slice(0, 10),
    rueckbauAb: text(entwurf.rueckbauAb) || null, entscheidungBis: text(entwurf.entscheidungBis) ? `${text(entwurf.entscheidungBis)}T12:00` : null,
    gebaeude: gebaeudeAus(entwurf),
  };
}
