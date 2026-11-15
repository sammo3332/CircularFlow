// Datenstand der Plattform: Beispieldaten aus dem Code plus eigene Änderungen aus dem Browser.
// Eigene Änderungen liegen nur in diesem Browser (localStorage) und lassen sich zurücksetzen.
import { PROJEKTE, BAUTEILE, ZIELOEFFNUNGEN, BEDARFE, ENTSCHEIDUNGEN } from './daten.js';
import { QUELLEN, HINWEISE } from './radar-daten.js';

export const SPEICHERSCHLUESSEL = 'circularflow-plattform-v1';
export const leerePersistenz = () => ({ version: 1, erfassungen: [], zuordnungen: [], ereignisse: [], ezustand: {}, radar: {}, meldungen: [], projekteAusRadar: [], werte: {} });
const klon = (x) => JSON.parse(JSON.stringify(x));

export function ladePersistenz(speicher) {
  try {
    const roh = speicher?.getItem(SPEICHERSCHLUESSEL);
    if (!roh) return leerePersistenz();
    const d = JSON.parse(roh);
    if (!d || d.version !== 1) return leerePersistenz();
    // Nur Felder mit passender Form übernehmen; ein beschädigter Stand darf die App nicht blockieren.
    const leer = leerePersistenz();
    const passt = (k) => (Array.isArray(leer[k]) ? Array.isArray(d[k]) : d[k] && typeof d[k] === 'object' && !Array.isArray(d[k]));
    for (const k of Object.keys(leer)) if (k !== 'version' && passt(k)) leer[k] = d[k];
    return leer;
  } catch { return leerePersistenz(); }
}

export function speichere(speicher, p) {
  if (!speicher) return { ok: false, grund: 'kein Speicher' };
  try { speicher.setItem(SPEICHERSCHLUESSEL, JSON.stringify(p)); return { ok: true }; } catch { /* Speicher voll, siehe unten */ }
  // Speicher voll: Fotos von der neuesten Erfassung an einzeln weglassen, bis der Stand passt.
  // Ältere, bereits gespeicherte Fotos bleiben so erhalten. Weggelassene Fotos bleiben bis zum Neuladen sichtbar.
  const kopie = { ...p, erfassungen: [...p.erfassungen] };
  for (let i = kopie.erfassungen.length - 1; i >= 0; i -= 1) {
    const e = kopie.erfassungen[i];
    if (!e.foto?.daten) continue;
    kopie.erfassungen[i] = { ...e, foto: { ...e.foto, daten: null, nichtGespeichert: true } };
    try { speicher.setItem(SPEICHERSCHLUESSEL, JSON.stringify(kopie)); return { ok: true, fotosNichtGespeichert: kopie.erfassungen.filter((x) => x.foto?.nichtGespeichert).length }; } catch { /* nächstes Foto */ }
  }
  return { ok: false, grund: 'Speicher nicht verfügbar' };
}

export function loesche(speicher) { try { speicher?.removeItem(SPEICHERSCHLUESSEL); } catch { /* ohne Speicher */ } }

// Baut den gemeinsamen Datensatz, den alle Ansichten lesen.
export function baueDaten(p) {
  const bauteile = [...klon(BAUTEILE), ...klon(p.erfassungen)];
  // Ein nicht gespeichertes Foto ist nach dem Neuladen kein vorliegender Nachweis mehr.
  for (const b of bauteile) {
    if (b.foto?.nichtGespeichert && !b.foto.daten) b.nachweise = (b.nachweise || []).map((n) => (n.art === 'Foto' ? { ...n, stand: 'nicht gespeichert (Speicher voll)', ton: 'warn' } : n));
  }
  for (const [k, felder] of Object.entries(p.werte || {})) {
    const [projekt, id] = k.split(':');
    const b = bauteile.find((x) => x.projekt === projekt && x.id === id);
    if (b) b.werte = { ...b.werte, ...felder };
  }
  const hinweise = [...klon(HINWEISE), ...klon(p.meldungen)].map((h) => (p.radar[h.id] ? { ...h, ...p.radar[h.id] } : h));
  return {
    projekte: [...klon(PROJEKTE), ...klon(p.projekteAusRadar)],
    bauteile,
    zieloeffnungen: klon(ZIELOEFFNUNGEN),
    bedarfe: klon(BEDARFE),
    entscheidungen: [...klon(ENTSCHEIDUNGEN), ...klon(p.zuordnungen)],
    hinweise,
    quellen: QUELLEN,
  };
}
