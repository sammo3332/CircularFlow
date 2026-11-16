// Bedarfe erfassen und ergänzen: reine Prüf- und Baufunktionen ohne DOM.
import { GRUPPEN } from './daten.js';
import { istDatum } from './zeit.js';

const ZAHL = /^\d+([.,]\d{1,2})?$/;
const text = (v) => String(v ?? '').trim();
export const ZEITFELDER = ['bestellfrist', 'pruefzeitTage', 'annahmeVon', 'annahmeBis'];
export const BEDARF_ROLLEN = ['planung', 'bauleitung', 'montage', 'fach'];

// Prüft einen Bedarfsentwurf. Rückgabe: Fehler je Feld; leeres Objekt = gültig.
// entwurf: { projekt, gruppe, titel, menge, bestellfrist, pruefzeitTage, annahmeVon, annahmeBis, anforderungen, zustaendig }
// ctx.daten.projekte wird (falls vorhanden) zur Prüfung des Projekts genutzt.
export function pruefeBedarf(entwurf, ctx = {}) {
  const fehler = {};
  const projekte = ctx.daten?.projekte;
  if (!text(entwurf.projekt)) fehler.projekt = 'Bitte ein Projekt wählen.';
  else if (projekte && !projekte.some((p) => p.kurz === entwurf.projekt)) fehler.projekt = 'Dieses Projekt gibt es nicht.';
  if (!text(entwurf.gruppe)) fehler.gruppe = 'Bitte eine Bauteilgruppe wählen.';
  else if (!GRUPPEN[entwurf.gruppe]) fehler.gruppe = 'Diese Bauteilgruppe gibt es nicht.';
  if (!text(entwurf.titel)) fehler.titel = 'Bitte einen Titel eingeben.';
  const einheit = GRUPPEN[entwurf.gruppe]?.einheit;
  const menge = text(entwurf.menge);
  if (!ZAHL.test(menge) || !(Number(menge.replace(',', '.')) > 0)) fehler.menge = `Bitte eine Menge größer als 0${einheit ? ` in ${einheit}` : ''} eingeben (höchstens zwei Nachkommastellen).`;
  for (const k of ['bestellfrist', 'annahmeVon', 'annahmeBis']) {
    if (text(entwurf[k]) && !istDatum(text(entwurf[k]))) fehler[k] = 'Bitte ein gültiges Datum eingeben.';
  }
  if (!fehler.annahmeVon && !fehler.annahmeBis && text(entwurf.annahmeVon) && text(entwurf.annahmeBis) && text(entwurf.annahmeVon) > text(entwurf.annahmeBis)) fehler.annahmeBis = 'Das Ende des Annahmefensters darf nicht vor dem Beginn liegen.';
  const pz = text(entwurf.pruefzeitTage);
  if (pz && (!/^\d+$/.test(pz) || Number(pz) > 365)) fehler.pruefzeitTage = 'Bitte eine ganze Zahl von 0 bis 365 (Tage) eingeben.';
  if (text(entwurf.zustaendig) && !BEDARF_ROLLEN.includes(entwurf.zustaendig)) fehler.zustaendig = 'Bitte eine Rolle aus der Liste wählen.';
  return fehler;
}

// Nächste freie Bedarfsnummer über alle Projekte (BD-nn), damit Kennungen in Links eindeutig bleiben.
export function naechsteBedarfId(bedarfe) {
  const nr = bedarfe.map((d) => /^BD-(\d+)$/.exec(d.id)).filter(Boolean).map((m) => Number(m[1]));
  return `BD-${String(Math.max(0, ...nr) + 1).padStart(2, '0')}`;
}

// Zeitangaben und Beschriftung der Herkunft, wie sie Entwurf und Überlagerung gemeinsam brauchen.
function zeitTeil(entwurf) {
  const t = {};
  const f = (k) => text(entwurf[k]);
  t.bestellfrist = f('bestellfrist') || null;
  t.pruefzeitTage = f('pruefzeitTage') === '' ? null : Number(f('pruefzeitTage'));
  t.annahmeVon = f('annahmeVon') || null;
  t.annahmeBis = f('annahmeBis') || null;
  t.anforderungen = f('anforderungen');
  t.zustaendig = f('zustaendig') || null;
  // belegt oder geschätzt je Angabe; ohne Angabe wird nichts behauptet.
  const gs = entwurf.geschaetzt || {};
  t.belegt = {};
  if (t.bestellfrist) t.belegt.bestellfrist = gs.bestellfrist ? 'geschaetzt' : 'belegt';
  if (t.pruefzeitTage !== null) t.belegt.pruefzeitTage = gs.pruefzeitTage ? 'geschaetzt' : 'belegt';
  if (t.annahmeVon || t.annahmeBis) t.belegt.annahme = gs.annahme ? 'geschaetzt' : 'belegt';
  return t;
}

// Baut einen eigenen Bedarf. Zu rufen erst nach pruefeBedarf(...) ohne Fehler.
export function bedarfAusEntwurf(entwurf, { id, at }) {
  const g = GRUPPEN[entwurf.gruppe];
  return {
    projekt: entwurf.projekt, id, gruppe: entwurf.gruppe, titel: text(entwurf.titel), raeume: [], etage: null,
    menge: Number(text(entwurf.menge).replace(',', '.')), einheit: g.einheit, text: '',
    ...zeitTeil(entwurf), angelegt: String(at).slice(0, 10), herkunft: 'eigene Eingabe in diesem Browser', neu: true,
  };
}

// Überlagerung für einen vorhandenen (auch Beispiel-)Bedarf: nur Ergänzungen, nie Titel oder Menge.
// Gespeichert unter p.bedarfAenderungen['<projekt>:<id>'] und von baueDaten über den Bedarf gelegt.
export function bedarfAenderung(entwurf) {
  return zeitTeil(entwurf);
}
export function ergaenzeBedarf(bedarf, aenderung) {
  if (!aenderung || typeof aenderung !== 'object') return bedarf;
  const neu = { ...bedarf };
  for (const k of [...ZEITFELDER, 'anforderungen', 'zustaendig']) if (k in aenderung) neu[k] = aenderung[k];
  neu.belegt = { ...(bedarf.belegt || {}), ...(aenderung.belegt || {}) };
  neu.ergaenzt = true;
  return neu;
}
// Entwurf (Formularwerte als Text) aus einem vorhandenen Bedarf, zum Ergänzen.
export function entwurfAusBedarf(bedarf) {
  const gs = (k) => bedarf.belegt?.[k] === 'geschaetzt';
  return {
    projekt: bedarf.projekt, gruppe: bedarf.gruppe, titel: bedarf.titel, menge: String(bedarf.menge ?? bedarf.bedarfM2 ?? ''),
    bestellfrist: bedarf.bestellfrist || '', pruefzeitTage: bedarf.pruefzeitTage === null || bedarf.pruefzeitTage === undefined ? '' : String(bedarf.pruefzeitTage),
    annahmeVon: bedarf.annahmeVon || '', annahmeBis: bedarf.annahmeBis || '', anforderungen: bedarf.anforderungen || '', zustaendig: bedarf.zustaendig || '',
    geschaetzt: { bestellfrist: gs('bestellfrist'), pruefzeitTage: gs('pruefzeitTage'), annahme: gs('annahme') },
  };
}

// Fehlende Zeitangaben eines Bedarfs (Beschriftungen für „Angaben fehlen“).
export function fehlendeZeitangaben(bedarf) {
  const fehlt = [];
  const bf = bedarf.bestellfrist ?? bedarf.fristen?.ersatz?.slice(0, 10);
  if (!bf) fehlt.push('Bestellfrist');
  if (bedarf.pruefzeitTage === null || bedarf.pruefzeitTage === undefined || bedarf.pruefzeitTage === '') fehlt.push('Mindestprüfzeit');
  if (!bedarf.annahmeVon) fehlt.push('Annahmefenster (Beginn)');
  if (!bedarf.annahmeBis) fehlt.push('Annahmefenster (Ende)');
  return fehlt;
}
