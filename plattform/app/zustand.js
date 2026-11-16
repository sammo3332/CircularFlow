// Datenstand der Plattform: Beispieldaten aus dem Code plus eigene Änderungen aus dem Browser.
// Eigene Änderungen liegen nur in diesem Browser (localStorage) und lassen sich zurücksetzen.
import { PROJEKTE, BAUTEILE, ZIELOEFFNUNGEN, BEDARFE, ENTSCHEIDUNGEN, GRUPPEN } from './daten.js';
import { ergaenzeBedarf } from './bedarf.js';
import { QUELLEN, HINWEISE } from './radar-daten.js';

export const SPEICHERSCHLUESSEL = 'circularflow-plattform-v1';
export const leerePersistenz = () => ({ version: 1, erfassungen: [], zuordnungen: [], ereignisse: [], ezustand: {}, radar: {}, meldungen: [], projekteAusRadar: [], werte: {}, bedarfe: [], bedarfAenderungen: {}, projekteEigen: [] });
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
    // Einträge ohne Pflichtfelder (z. B. aus einem beschädigten Stand) werden ausgelassen.
    // Schlüsselfelder müssen die richtige Art haben (Zeichenketten) und dürfen nicht doppelt vorkommen; doppelte Einträge entfallen.
    const objekt = (x) => x && typeof x === 'object' && !Array.isArray(x);
    const zk = (v) => typeof v === 'string' && v.trim() !== '';
    const einmalig = (liste, key) => { const gesehen = new Set(); return liste.filter((x) => { const k = key(x); if (gesehen.has(k)) return false; gesehen.add(k); return true; }); };
    leer.erfassungen = einmalig(leer.erfassungen.filter((e) => objekt(e) && zk(e.projekt) && zk(e.id) && GRUPPEN[e.gruppe]), (e) => `${e.projekt}:${e.id}`);
    const vorhandeneEntscheidungen = new Set(ENTSCHEIDUNGEN.map((e) => `${e.projekt}:${e.id}`));
    leer.zuordnungen = einmalig(leer.zuordnungen.filter((e) => objekt(e) && zk(e.projekt) && zk(e.id) && zk(e.bauteil) && objekt(e.ziel) && zk(e.ziel.art) && zk(e.ziel.id)
      && !vorhandeneEntscheidungen.has(`${e.projekt}:${e.id}`)), (e) => `${e.projekt}:${e.id}`);
    leer.ereignisse = leer.ereignisse.filter((x) => objekt(x) && (x.at === undefined || zk(x.at)) && (x.entscheidung === undefined || zk(x.entscheidung)) && (x.bauteil === undefined || zk(x.bauteil)));
    leer.meldungen = leer.meldungen.filter((m) => objekt(m) && m.id && m.status);
    leer.projekteAusRadar = leer.projekteAusRadar.filter((x) => objekt(x) && x.kurz && Array.isArray(x.lage));
    // Neue Schlüssel (Fassung 2): ältere Stände ohne sie laden unverändert; beschädigte Einträge entfallen.
    const beispielBedarfe = new Set(BEDARFE.map((d) => d.id));
    leer.bedarfe = einmalig(leer.bedarfe.filter((x) => objekt(x) && zk(x.projekt) && zk(x.id) && GRUPPEN[x.gruppe] && typeof x.titel === 'string' && !beispielBedarfe.has(x.id)), (x) => x.id);
    const beispielKuerzel = new Set(PROJEKTE.map((x) => String(x.kurz).toUpperCase()));
    leer.projekteEigen = einmalig(leer.projekteEigen.filter((x) => objekt(x) && zk(x.kurz) && zk(x.id) && typeof x.name === 'string' && Array.isArray(x.lage) && x.lage.length === 2 && x.lage.every(Number.isFinite) && Array.isArray(x.gebaeude)
      && !beispielKuerzel.has(x.kurz.toUpperCase())), (x) => x.kurz.toUpperCase());
    leer.bedarfAenderungen = Object.fromEntries(Object.entries(leer.bedarfAenderungen).filter(([k, v]) => /^[^:]+:[^:]+$/.test(k) && objekt(v) && !Array.isArray(v)));
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
    projekte: [...klon(PROJEKTE), ...klon(p.projekteAusRadar), ...klon(p.projekteEigen || [])],
    bauteile,
    zieloeffnungen: klon(ZIELOEFFNUNGEN),
    // Beispielbedarfe und eigene Bedarfe; Ergänzungen (Zeitangaben usw.) liegen als Überlagerung darüber.
    bedarfe: [...klon(BEDARFE), ...klon(p.bedarfe || [])].map((d) => ergaenzeBedarf(d, (p.bedarfAenderungen || {})[`${d.projekt}:${d.id}`])),
    entscheidungen: [...klon(ENTSCHEIDUNGEN), ...klon(p.zuordnungen)],
    hinweise,
    quellen: QUELLEN,
  };
}

// Zahl aller eigenen Änderungen in diesem Browser (für Hinweis und Zurücksetzen).
export function anzahlEigeneAenderungen(p) {
  const n = (x) => (Array.isArray(x) ? x.length : x && typeof x === 'object' ? Object.keys(x).length : 0);
  return ['erfassungen', 'zuordnungen', 'ereignisse', 'meldungen', 'projekteAusRadar', 'ezustand', 'radar', 'werte', 'bedarfe', 'bedarfAenderungen', 'projekteEigen']
    .reduce((s, k) => s + n(p?.[k]), 0);
}
