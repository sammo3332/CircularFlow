// Datenstand der Plattform: Beispieldaten aus dem Code plus eigene Änderungen aus dem Browser.
// Eigene Änderungen liegen nur in diesem Browser (localStorage) und lassen sich zurücksetzen.
import { PROJEKTE, BAUTEILE, ZIELOEFFNUNGEN, BEDARFE, ENTSCHEIDUNGEN, GRUPPEN } from './daten.js';
import { ergaenzeBedarf } from './bedarf.js';
import { QUELLEN, HINWEISE } from './radar-daten.js';
import { angebotAnwenden, ANFRAGE_STATUS, DIENSTLEISTER_ART, VERKAUF_STATUS, PROVISION_STATUS } from './pilot.js';

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
    leer.anfragen = einmalig(leer.anfragen.filter((a) => objekt(a) && zk(a.id) && ref(a.bauteil) && (a.bedarf === null || a.bedarf === undefined || ref(a.bedarf)) && ANFRAGE_STATUS[a.status] && zk(a.leistung) && zk(a.geaendert) && zk(a.termin)
      && Array.isArray(a.verlauf) && a.verlauf.every((v) => objekt(v) && zk(v.at) && zk(v.status)) && (a.ergebnis === null || a.ergebnis === undefined || (objekt(a.ergebnis) && zk(a.ergebnis.urteil)))), (a) => a.id);
    leer.verkaeufe = Object.fromEntries(Object.entries(leer.verkaeufe).filter(([k, v]) => /^[^:]+:[^:]+$/.test(k) && objekt(v) && VERKAUF_STATUS[v.status] && objekt(v.provisionen))
      .map(([k, v]) => [k, { ...v, provisionen: Object.fromEntries(Object.entries(v.provisionen).filter(([, pr]) => objekt(pr) && PROVISION_STATUS[pr.status])) }]));
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
// ---------- Zusammenführen zweier Stände (Pilotraum, Datei) ----------
// Drei-Wege-Zusammenführung auf Eintragsebene. sig = Signatur des zuletzt abgeglichenen Stands (standSignatur) oder null,
// server = gemeinsamer Stand, lokal = dieser Browser. Ein lokaler Eintrag gewinnt, wenn er seit dem Abgleich neu ist oder sich geändert
// hat; sonst gilt der Server. Nichts wird gelöscht. Ist die Kennung eines neuen lokalen Eintrags im Server schon anders belegt, wird der
// lokale Eintrag umbenannt und alle Verweise werden mitgezogen; nicht umbenennbare Einträge (Projekte, Meldungen) bleiben beim Server
// und werden gemeldet. Liefert { stand, umbenannt: [{ art, von, nach }], verworfen: [{ art, kennung }] }.
const hashText = (t) => { let h = 2166136261; for (let i = 0; i < t.length; i += 1) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return `${(h >>> 0).toString(36)}.${t.length}`; };
const sigVon = (x) => hashText(JSON.stringify(x));
const LISTEN = { erfassungen: (x) => `${x.projekt}:${x.id}`, zuordnungen: (x) => `${x.projekt}:${x.id}`, meldungen: (x) => String(x.id), projekteAusRadar: (x) => String(x.kurz).toUpperCase(), bedarfe: (x) => String(x.id), projekteEigen: (x) => String(x.kurz).toUpperCase(), interessen: (x) => x.id, dienstleister: (x) => x.id, anfragen: (x) => x.id };
const WOERTERBUECHER = ['ezustand', 'radar', 'werte', 'bedarfAenderungen', 'verkaeufe', 'bauteilAenderungen'];
const SCHICHTEN = ['ezustand', 'radar', 'werte', 'bedarfAenderungen']; // Teilstände je Schlüssel werden feldweise überlagert
const normiere = (x) => ladePersistenz({ getItem: () => JSON.stringify(x || leerePersistenz()) });
export function standSignatur(p) {
  const n = normiere(p); const sig = { listen: {}, woerterbuecher: {}, ereignisse: {} };
  for (const [k, kf] of Object.entries(LISTEN)) sig.listen[k] = Object.fromEntries(n[k].map((x) => [kf(x), sigVon(x)]));
  for (const k of WOERTERBUECHER) sig.woerterbuecher[k] = Object.fromEntries(Object.entries(n[k]).map(([id, v]) => [id, sigVon(v)]));
  for (const e of n.ereignisse) sig.ereignisse[sigVon(e)] = true;
  return sig;
}
const naechsteNummer = (ids, prefix) => { const nr = ids.map((id) => new RegExp(`^${prefix}-(\\d+)$`).exec(String(id))).filter(Boolean).map((m) => Number(m[1])); return `${prefix}-${String(Math.max(0, ...nr) + 1).padStart(2, '0')}`; };
// Umbenennung eines neuen lokalen Eintrags samt Verweisen. Liefert die neue Kennung oder null, wenn die Art nicht umbenennbar ist.
function umbenennen(art, eintrag, lokal, belegt) {
  const alleIds = (liste, filter) => [...liste.filter(filter).map((x) => x.id), ...belegt.filter((k) => filter({ projekt: k.split(':')[0], id: k.includes(':') ? k.split(':')[1] : k })).map((k) => (k.includes(':') ? k.split(':')[1] : k))];
  if (art === 'erfassungen') {
    const prefix = GRUPPEN[eintrag.gruppe]?.prefix || 'X'; const alt = eintrag.id;
    const neu = naechsteNummer(alleIds(lokal.erfassungen, (x) => x.projekt === eintrag.projekt && String(x.id).startsWith(`${prefix}-`)), prefix);
    const altKey = `${eintrag.projekt}:${alt}`; const neuKey = `${eintrag.projekt}:${neu}`;
    eintrag.id = neu;
    for (const a of lokal.anfragen) if (a.bauteil?.projekt === eintrag.projekt && a.bauteil.id === alt) a.bauteil = { projekt: eintrag.projekt, id: neu };
    for (const i of lokal.interessen) if (i.bauteil?.projekt === eintrag.projekt && i.bauteil.id === alt) i.bauteil = { projekt: eintrag.projekt, id: neu };
    for (const z of lokal.zuordnungen) if (z.projekt === eintrag.projekt && z.bauteil === alt) z.bauteil = neu;
    for (const e of lokal.ereignisse) if (e.bauteil === altKey) e.bauteil = neuKey;
    for (const k of ['verkaeufe', 'bauteilAenderungen', 'werte']) if (lokal[k][altKey]) { lokal[k][neuKey] = lokal[k][altKey]; delete lokal[k][altKey]; if (k === 'verkaeufe') lokal[k][neuKey].bauteil = { projekt: eintrag.projekt, id: neu }; }
    return neu;
  }
  if (art === 'bedarfe') {
    const alt = eintrag.id; const neu = naechsteNummer(alleIds(lokal.bedarfe, () => true), 'BD'); eintrag.id = neu;
    const altKey = `${eintrag.projekt}:${alt}`; const neuKey = `${eintrag.projekt}:${neu}`;
    for (const a of lokal.anfragen) if (a.bedarf?.id === alt && a.bedarf.projekt === eintrag.projekt) a.bedarf = { projekt: eintrag.projekt, id: neu };
    for (const i of lokal.interessen) if (i.bedarf?.id === alt && i.bedarf.projekt === eintrag.projekt) i.bedarf = { projekt: eintrag.projekt, id: neu };
    for (const v of Object.values(lokal.verkaeufe)) if (v.bedarf?.id === alt && v.bedarf.projekt === eintrag.projekt) v.bedarf = { projekt: eintrag.projekt, id: neu };
    for (const z of lokal.zuordnungen) if (z.ziel?.art === 'bedarf' && z.ziel.id === alt && (z.ziel.projekt || z.projekt) === eintrag.projekt) z.ziel = { ...z.ziel, id: neu };
    if (lokal.bedarfAenderungen[altKey]) { lokal.bedarfAenderungen[neuKey] = lokal.bedarfAenderungen[altKey]; delete lokal.bedarfAenderungen[altKey]; }
    return neu;
  }
  if (art === 'zuordnungen') {
    const alt = eintrag.id; const neu = naechsteNummer(alleIds(lokal.zuordnungen, (x) => x.projekt === eintrag.projekt), 'E'); eintrag.id = neu;
    const altKey = `${eintrag.projekt}:${alt}`; const neuKey = `${eintrag.projekt}:${neu}`;
    for (const e of lokal.ereignisse) if (e.entscheidung === altKey) e.entscheidung = neuKey;
    for (const a of lokal.anfragen) if (a.vorgang === altKey) a.vorgang = neuKey;
    if (lokal.ezustand[altKey]) { lokal.ezustand[neuKey] = lokal.ezustand[altKey]; delete lokal.ezustand[altKey]; }
    return neu;
  }
  if (art === 'interessen') { eintrag.id = naechsteNummer(alleIds(lokal.interessen, () => true), 'I'); return eintrag.id; }
  if (art === 'anfragen') { eintrag.id = naechsteNummer(alleIds(lokal.anfragen, () => true), 'A'); return eintrag.id; }
  if (art === 'dienstleister') {
    const alt = eintrag.id; const neu = naechsteNummer(alleIds(lokal.dienstleister, () => true), 'DL'); eintrag.id = neu;
    for (const a of lokal.anfragen) if (a.dienstleister === alt) a.dienstleister = neu;
    for (const v of Object.values(lokal.verkaeufe)) if (v.provisionen?.[alt]) { v.provisionen[neu] = v.provisionen[alt]; delete v.provisionen[alt]; }
    return neu;
  }
  return null;
}
export function zusammenfuehren(sig, serverStand, lokalStand) {
  const server = normiere(serverStand); const lokal = normiere(lokalStand); const s = sig || { listen: {}, woerterbuecher: {}, ereignisse: {} };
  const umbenannt = []; const verworfen = [];
  const out = { ...server };
  for (const [k, kf] of Object.entries(LISTEN)) {
    const basisSig = s.listen[k] || {}; const serverMap = new Map(server[k].map((x) => [kf(x), x]));
    // Erst Kollisionen neuer lokaler Einträge auflösen (Umbenennung samt Verweisen), dann zusammenführen.
    for (const x of [...lokal[k]]) {
      const key = kf(x); const neuLokal = !(key in basisSig); const srv = serverMap.get(key);
      if (neuLokal && srv && sigVon(srv) !== sigVon(x)) {
        const belegt = [...serverMap.keys()];
        const neu = umbenennen(k, x, lokal, belegt);
        if (neu) umbenannt.push({ art: k, von: key, nach: kf(x) }); else { verworfen.push({ art: k, kennung: key }); lokal[k] = lokal[k].filter((y) => y !== x); }
      }
    }
  }
  for (const [k, kf] of Object.entries(LISTEN)) {
    const basisSig = s.listen[k] || {}; const ergebnis = new Map(server[k].map((x) => [kf(x), x]));
    for (const x of lokal[k]) { const key = kf(x); const geaendert = basisSig[key] !== sigVon(x); if (!ergebnis.has(key) || geaendert) ergebnis.set(key, x); }
    out[k] = [...ergebnis.values()];
  }
  const gesehen = new Set(server.ereignisse.map(sigVon));
  out.ereignisse = [...server.ereignisse, ...lokal.ereignisse.filter((e) => { const h = sigVon(e); return !gesehen.has(h) && !s.ereignisse[h]; })];
  for (const k of WOERTERBUECHER) {
    const basisSig = s.woerterbuecher[k] || {}; out[k] = { ...server[k] };
    for (const [id, v] of Object.entries(lokal[k])) {
      const geaendert = basisSig[id] !== sigVon(v);
      if (!(id in out[k])) out[k][id] = v; else if (geaendert) out[k][id] = SCHICHTEN.includes(k) ? { ...out[k][id], ...v } : v;
    }
  }
  return { stand: normiere(out), umbenannt, verworfen };
}
// Datei laden: Einträge der Datei kommen dazu, vorhandene Einträge bleiben; Kennungskollisionen werden umbenannt.
export function vereinige(basis, neu) { return zusammenfuehren(null, basis, neu).stand; }
