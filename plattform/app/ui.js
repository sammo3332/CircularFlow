// Gemeinsame Bausteine der Oberfläche.
import { PERSONEN, STATUS, WERTSTATUS, ARTEN } from './daten.js';

export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const slug = (s) => String(s).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const chip = (label, ton = 'neutral', extra = '') => `<span class="chip chip-${ton}"${extra}>${esc(label)}</span>`;
export const person = (k) => PERSONEN[k] || { rolle: '', name: '', stelle: '' };
export const statusChip = (s) => chip(STATUS[s]?.label || s, STATUS[s]?.ton || 'neutral');
export const wertChip = (s) => chip(WERTSTATUS[s]?.label || s, WERTSTATUS[s]?.ton || 'neutral', ` title="${esc(WERTSTATUS[s]?.text || '')}"`);
export const artText = (a) => ARTEN[a] || a;

// Projektkennung: Kürzel in Projektfarbe, in jeder Ansicht gleich.
export const pchip = (p, gross = false) => `<span class="pkenn${gross ? ' pkenn-gross' : ''}" style="--pf:${esc(p.farbe)}" title="${esc(p.name)}">${esc(p.kurz)}</span>`;
export const bauteilRef = (p, b) => `<span class="bref">${pchip(p)}<span class="mono">${esc(b.id)}</span></span>`;

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
  }[n] || '';
  return `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
}

export const leer = (titel, text, aktion = '') => `<div class="leer"><b>${esc(titel)}</b><p>${esc(text)}</p>${aktion}</div>`;
export const nichtGefunden = (art, id) => leer(`${art} „${id}“ gibt es nicht.`, 'Der Link ist veraltet oder falsch geschrieben.', '<a class="knopf" href="#projekte">Zu den Projekten</a>');
