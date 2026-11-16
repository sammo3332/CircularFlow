// Gemeinsame Bausteine der Oberfläche.
import { PERSONEN, STATUS, WERTSTATUS, ARTEN } from './daten.js';

export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const slug = (s) => String(s).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Zustandssymbole: Form und Text tragen die Bedeutung, die Farbe verstärkt sie nur.
const SYMBOL = {
  ok: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  warn: '<path d="M12 3 2.5 20h19z"/><path d="M12 10v4.5M12 17.5v.5"/>',
  crit: '<circle cx="12" cy="12" r="9"/><path d="m8.5 8.5 7 7M15.5 8.5l-7 7"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5v.5"/>',
};
const SYMBOLTEXT = { ok: 'in Ordnung', warn: 'Achtung', crit: 'dringend', info: 'Hinweis' };
export const tonSymbol = (ton) => (SYMBOL[ton] ? `<svg class="tsym t-${ton}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${SYMBOL[ton]}</svg>` : '');
export const tonMarke = (ton) => (SYMBOL[ton] ? `${tonSymbol(ton)}<span class="sr">${SYMBOLTEXT[ton]}: </span>` : '');
export const chip = (label, ton = 'neutral', extra = '') => `<span class="chip chip-${ton}"${extra}>${tonSymbol(ton)}${esc(label)}</span>`;
export const ergebnisChip = (gesamt) => chip(gesamt.label, gesamt.ton);
export const person = (k) => PERSONEN[k] || { rolle: '', name: '', stelle: '' };
export const statusChip = (s) => chip(STATUS[s]?.label || s, STATUS[s]?.ton || 'neutral');
export const wertChip = (s) => chip(WERTSTATUS[s]?.label || s, WERTSTATUS[s]?.ton || 'neutral', ` title="${esc(WERTSTATUS[s]?.text || '')}"`);
export const artText = (a) => ARTEN[a] || a;

// Projektkennung: Kürzel in Projektfarbe, in jeder Ansicht gleich.
export const pchip = (p, gross = false) => `<span class="pkenn${gross ? ' pkenn-gross' : ''}" style="--pf:${esc(p.farbe)}" title="${esc(p.name)}">${esc(p.kurz)}</span>`;
export const bauteilRef = (p, b) => `<span class="bref">${pchip(p)}<span class="mono">${esc(b.id)}</span></span>`;

// Feste Reihenfolge und Farben der Bauteilgruppen in der ganzen App (Diagramm, Katalog, Legende).
// Farben aus der validierten Referenzpalette (Blau, Magenta, Violett, Türkis, Orange); nie die Statusfarben Grün, Gelb, Rot.
export const GRUPPENREIHE = ['tuer', 'boden', 'heiz', 'wand', 'licht', 'sonstig'];
export const gruppenPunkt = (g) => `<i class="gpunkt g-${esc(g)}" aria-hidden="true"></i>`;
export const gruppenChip = (g, name) => `<span class="gruppe">${gruppenPunkt(g)}${esc(name)}</span>`;

export const routeBedarf = (d) => `#bedarf-${slug(d.projekt)}-${slug(d.id)}`;
export const routeAbgleich = (schluessel) => `#abgleich-${schluessel}`;
export const routePass = (b) => `#pass-${slug(b.projekt)}-${slug(b.id)}`;
export const routeEntscheidung = (e) => `#entscheidung-${slug(e.projekt)}-${slug(e.id)}`;
export const routeRaum = (kurz, raum) => `#raum-${slug(kurz)}-${slug(raum)}`;

export function icon(n) {
  const p = {
    karte: '<path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5"/><path d="M15 6.5V20"/>',
    radar: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12 18 6"/>',
    kamera: '<path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/>',
    gebaeude: '<path d="M4 21V5l8-2v18"/><path d="M12 9h8v12"/><path d="M7.5 8h1M7.5 12h1M7.5 16h1M15.5 13h1M15.5 17h1"/>',
    liste: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    flagge: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
    uebersicht: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    kreislauf: '<path d="M17 4.5A8.5 8.5 0 0 0 4.2 9"/><path d="M4 4v5h5"/><path d="M7 19.5A8.5 8.5 0 0 0 19.8 15"/><path d="M20 20v-5h-5"/>',
    suche: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    pfeil: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    zurueck: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    haken: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    warnung: '<path d="M12 3 2.5 20h19z"/><path d="M12 10v4.5M12 17.5v.5"/>',
    bauteil: '<path d="M12 3 3.5 7.5v9L12 21l8.5-4.5v-9z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>',
    bedarf: '<path d="M7 4h10l2 2v14H5V6z"/><path d="M8.5 10h7M8.5 14h7M8.5 17h4"/>',
    paar: '<path d="M9 7H6a4 4 0 0 0 0 8h3M15 7h3a4 4 0 0 1 0 8h-3M8 11h8"/>',
    pfeilrechts: '<path d="m9 6 6 6-6 6"/>',
  }[n] || '';
  return `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
}

export const leer = (titel, text, aktion = '') => `<div class="leer"><b>${esc(titel)}</b><p>${esc(text)}</p>${aktion}</div>`;
export const laedt = (text = 'Wird geladen …') => `<div class="laden" role="status"><i class="laden-punkt" aria-hidden="true"></i>${esc(text)}</div>`;

// Seitenkopf: Pfad, Überschrift, Untertitel, Aktionen. pfad: [[href, text], ...] ohne die aktuelle Seite; titel und untertitel sind HTML.
export function seitenkopf({ pfad = [], aktuell = '', eyebrow = '', titel, untertitel = '', aktionen = '' }) {
  const kette = [...pfad.map(([h, t]) => `<a href="${esc(h)}">${esc(t)}</a>`), aktuell ? `<span aria-current="page">${esc(aktuell)}</span>` : ''].filter(Boolean).join('<span aria-hidden="true">/</span>');
  return `${kette ? `<nav class="pfad" aria-label="Pfad">${kette}</nav>` : ''}
  <header class="seitenkopf"><div class="kopf-text">${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h1>${titel}</h1>${untertitel ? `<p class="unter">${untertitel}</p>` : ''}</div>${aktionen ? `<div class="kopf-aktionen">${aktionen}</div>` : ''}</header>`;
}

// Reiter innerhalb von „Projekte“: Karte und Liste · Radar · Projekt erfassen.
export function projekteReiter(aktiv) {
  const t = [['start', '#projekte', 'Karte und Liste'], ['radar', '#radar', 'Radar'], ['neu', '#projekt-neu', 'Projekt erfassen']];
  return `<nav class="reiter" aria-label="Projekte">${t.map(([k, h, x]) => `<a href="${h}" ${aktiv === k ? 'aria-current="page"' : ''}>${x}</a>`).join('')}</nav>`;
}

// Kurzes Datum aus „YYYY-MM-DD“ ohne Zeitzone.
export const tagText = (d) => (d ? `${String(d).slice(8, 10)}.${String(d).slice(5, 7)}.${String(d).slice(0, 4)}` : '');
export const nichtGefunden = (art, id) => leer(`${art} „${id}“ gibt es nicht.`, 'Der Link ist veraltet oder falsch geschrieben.', '<a class="knopf" href="#projekte">Zu den Projekten</a>');

// Formularbausteine: Feld mit Beschriftung, optionalem Hinweis und Fehlermeldung. Fehler hängen über aria-describedby am Feld.
// feldAttr liefert id und die Attribute für Fehler und Hinweis; feld setzt Beschriftung und Meldungen darum.
export function feldAttr(id, fehler = '', hinweis = '') {
  const ids = [hinweis && `${id}-h`, fehler && `${id}-f`].filter(Boolean).join(' ');
  return `id="${id}"${fehler ? ' aria-invalid="true"' : ''}${ids ? ` aria-describedby="${ids}"` : ''}`;
}
// label und hinweis sind HTML (bereits maskiert), fehler ist Text.
export function feld({ id, label, control, fehler = '', hinweis = '', klasse = '' }) {
  return `<div class="feld ${fehler ? 'feld-fehler' : ''} ${klasse}"><label for="${id}">${label}</label>${control}${hinweis ? `<p class="feld-hinweis" id="${id}-h">${hinweis}</p>` : ''}${fehler ? `<p class="feld-meldung" id="${id}-f">${esc(fehler)}</p>` : ''}</div>`;
}
export const optionen = (liste, wert, leerText = 'Bitte wählen') => `${leerText === null ? '' : `<option value="">${esc(leerText)}</option>`}${liste.map(([v, t]) => `<option value="${esc(v)}" ${v === wert ? 'selected' : ''}>${esc(t)}</option>`).join('')}`;
// Fehlerübersicht am Formularanfang (role=alert); die Fehler am Feld bleiben die Hauptsache.
export function fehlerUebersicht(id, fehler, felder) {
  const n = Object.keys(fehler).length;
  if (!n) return '';
  return `<div class="ergebnisbox fehlerbox" id="${id}" role="alert"><p><b>${n} Angabe${n === 1 ? '' : 'n'} ${n === 1 ? 'verhindert' : 'verhindern'} das Speichern.</b></p><ul>${Object.entries(fehler).map(([k, t]) => `<li>${felder[k] ? `<b>${esc(felder[k])}:</b> ` : ''}${esc(t)}</li>`).join('')}</ul></div>`;
}
