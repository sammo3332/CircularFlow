// Datenstand der Plattform: Beispieldaten aus dem Code plus eigene Änderungen aus dem Browser.
// Eigene Änderungen liegen nur in diesem Browser (localStorage) und lassen sich zurücksetzen.
import { PROJEKTE, BAUTEILE, ZIELOEFFNUNGEN, BEDARFE, ENTSCHEIDUNGEN, GRUPPEN } from './daten.js';
import { ergaenzeBedarf } from './bedarf.js';
import { QUELLEN, HINWEISE } from './radar-daten.js';
import { angebotAnwenden, ANFRAGE_STATUS, DIENSTLEISTER_ART, VERKAUF_STATUS } from './pilot.js';

export const SPEICHERSCHLUESSEL = 'circularflow-plattform-v1';
export const leerePersistenz = () => ({ version: 1, erfassungen: [], zuordnungen: [], ereignisse: [], ezustand: {}, radar: {}, meldungen: [], projekteAusRadar: [], werte: {}, bedarfe: [], bedarfAenderungen: {}, projekteEigen: [],
  // Pilotbetrieb (19.11.2026): Interesse, Dienstleister, Anfragen, Verkäufe, Änderungen am eigenen Angebot.
  interessen: [], dienstleister: [], anfragen: [], verkaeufe: {}, bauteilAenderungen: {} });
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
    // Pilotbetrieb: Einträge brauchen Kennung und gültige Verweise; unbekannte Status entfallen.
    const ref = (r) => objekt(r) && zk(r.projekt) && zk(r.id);
    leer.interessen = einmalig(leer.interessen.filter((i) => objekt(i) && zk(i.id) && ref(i.bauteil) && ref(i.bedarf) && ['offen', 'zurueckgezogen'].includes(i.status) && zk(i.at)), (i) => i.id);
    leer.dienstleister = einmalig(leer.dienstleister.filter((d) => objekt(d) && zk(d.id) && zk(d.name) && Array.isArray(d.leistungen) && DIENSTLEISTER_ART[d.art]), (d) => d.id);
    leer.anfragen = einmalig(leer.anfragen.filter((a) => objekt(a) && zk(a.id) && ref(a.bauteil) && (a.bedarf === null || a.bedarf === undefined || ref(a.bedarf)) && ANFRAGE_STATUS[a.status] && zk(a.leistung) && zk(a.geaendert) && Array.isArray(a.verlauf)), (a) => a.id);
    leer.verkaeufe = Object.fromEntries(Object.entries(leer.verkaeufe).filter(([k, v]) => /^[^:]+:[^:]+$/.test(k) && objekt(v) && VERKAUF_STATUS[v.status] && objekt(v.provisionen)));
    leer.bauteilAenderungen = Object.fromEntries(Object.entries(leer.bauteilAenderungen).filter(([k, v]) => /^[^:]+:[^:]+$/.test(k) && objekt(v) && Number.isFinite(v.menge) && zk(v.geaendertAm)));
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
    const e=kopie.erfassungen[i];
    if(!e.etikett?.foto?.daten) continue;
    kopie.erfassungen[i]={...e,etikett:{...e.etikett,foto:{...e.etikett.foto,daten:null,nichtGespeichert:true}}};
    try {speicher.setItem(SPEICHERSCHLUESSEL,JSON.stringify(kopie));return {ok:true,fotosNichtGespeichert:kopie.erfassungen.filter(x=>x.etikett?.foto?.nichtGespeichert).length};} catch {}
  }
  for (let i = kopie.erfassungen.length - 1; i >= 0; i -= 1) {
    const e = kopie.erfassungen[i];
    if (!e.foto?.daten) continue;
    kopie.erfassungen[i] = { ...e, foto: { ...e.foto, daten: null, nichtGespeichert: true } };
    try { speicher.setItem(SPEICHERSCHLUESSEL, JSON.stringify(kopie)); return { ok: true, fotosNichtGespeichert: kopie.erfassungen.reduce((n,x)=>n+Number(Boolean(x.foto?.nichtGespeichert))+Number(Boolean(x.etikett?.foto?.nichtGespeichert)),0) }; } catch { /* nächstes Foto */ }
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
  // Änderungen am eigenen Angebot (Menge, Verfügbarkeit, Zustand, nicht mehr angeboten) überlagern das Bauteil.
  for (const [k, a] of Object.entries(p.bauteilAenderungen || {})) {
    const i = bauteile.findIndex((x) => `${x.projekt}:${x.id}` === k);
    if (i >= 0) bauteile[i] = angebotAnwenden(bauteile[i], a);
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
    interessen: klon(p.interessen || []), dienstleister: klon(p.dienstleister || []), anfragen: klon(p.anfragen || []), verkaeufe: klon(p.verkaeufe || {}),
  };
}

// Zahl aller eigenen Änderungen in diesem Browser (für Hinweis und Zurücksetzen).
export function anzahlEigeneAenderungen(p) {
  const n = (x) => (Array.isArray(x) ? x.length : x && typeof x === 'object' ? Object.keys(x).length : 0);
  return ['erfassungen', 'zuordnungen', 'ereignisse', 'meldungen', 'projekteAusRadar', 'ezustand', 'radar', 'werte', 'bedarfe', 'bedarfAenderungen', 'projekteEigen',
    'interessen', 'dienstleister', 'anfragen', 'verkaeufe', 'bauteilAenderungen']
    .reduce((s, k) => s + n(p?.[k]), 0);
}

// ---------- Datenstand als Datei sichern und laden (ohne Server) ----------
export const EXPORT_SCHEMA = 'circularflow-stand-v1';
export function exportStand(p, { at = null, quelle = 'Browser' } = {}) {
  return JSON.stringify({ schema: EXPORT_SCHEMA, exportiertAm: at, quelle, hinweis: 'Eigene Einträge der CircularFlow-Plattform. Beispieldaten sind nicht enthalten.', daten: p }, null, 1);
}
// Liest eine gesicherte Datei. Liefert einen geprüften Stand (wie ladePersistenz) oder wirft einen verständlichen Fehler.
export function importStand(text) {
  let d;
  try { d = JSON.parse(String(text)); } catch { throw new Error('Die Datei ist kein lesbarer CircularFlow-Datenstand (kein JSON).'); }
  if (!d || d.schema !== EXPORT_SCHEMA || !d.daten || typeof d.daten !== 'object') throw new Error('Die Datei ist kein CircularFlow-Datenstand (Kennung fehlt).');
  const roh = JSON.stringify(d.daten);
  const stand = ladePersistenz({ getItem: () => roh });
  if (anzahlEigeneAenderungen(stand) === 0 && anzahlEigeneAenderungen(d.daten) > 0) throw new Error('Die Datei enthält keine gültigen Einträge.');
  return stand;
}
// Vereinigt zwei Stände: Listen nach Kennung (vorhandene Einträge bleiben, neue kommen dazu), Zuordnungen nach Schlüssel (der neuere gewinnt).
export function vereinige(basis, neu) {
  const a = ladePersistenz({ getItem: () => JSON.stringify(basis) }); const b = ladePersistenz({ getItem: () => JSON.stringify(neu) });
  const key = { erfassungen: (x) => `${x.projekt}:${x.id}`, zuordnungen: (x) => `${x.projekt}:${x.id}`, meldungen: (x) => x.id, projekteAusRadar: (x) => x.kurz, bedarfe: (x) => x.id, projekteEigen: (x) => String(x.kurz).toUpperCase(), interessen: (x) => x.id, dienstleister: (x) => x.id, anfragen: (x) => x.id };
  const out = { ...a };
  for (const [k, kf] of Object.entries(key)) {
    const vorhanden = new Map(a[k].map((x) => [kf(x), x]));
    for (const x of b[k]) { const alt = vorhanden.get(kf(x)); if (!alt) vorhanden.set(kf(x), x); else if (k === 'anfragen' && String(x.geaendert) > String(alt.geaendert)) vorhanden.set(kf(x), x); }
    out[k] = [...vorhanden.values()];
  }
  const gesehen = new Set(a.ereignisse.map((x) => JSON.stringify(x)));
  out.ereignisse = [...a.ereignisse, ...b.ereignisse.filter((x) => !gesehen.has(JSON.stringify(x)))];
  for (const k of ['ezustand', 'radar', 'werte', 'bedarfAenderungen', 'verkaeufe', 'bauteilAenderungen']) {
    out[k] = { ...a[k] };
    for (const [id, v] of Object.entries(b[k])) {
      const alt = out[k][id]; const neuer = !alt || String(v.geaendertAm || v.at || '') >= String(alt.geaendertAm || alt.at || '');
      out[k][id] = k === 'ezustand' || k === 'werte' || k === 'radar' || k === 'bedarfAenderungen' ? { ...(alt || {}), ...v } : (neuer ? v : alt);
    }
  }
  return out;
}

