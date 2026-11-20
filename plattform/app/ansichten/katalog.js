// Katalog: projektübergreifende Bauteilkarten mit Filtern. Die Filter halten ihren Stand im ui-Objekt, nicht im Hash.
// Kommt der Katalog von einer Kachel oder einem Diagrammbalken, ist die Grundmenge genau die dort gezählte Liste (ui.katalog.vorgabe).
import { GRUPPEN, ZUSTAND } from '../daten.js';
import { kennzahlen, monatLabel } from '../kennzahlen.js';
import { bauteilStatus, offeneNachweise } from '../regeln.js';
import { esc, chip, icon, leer, pchip, gruppenChip, seitenkopf, routePass, statusChip } from '../ui.js';
import { verfuegbarText } from './bauteile.js';

export const angebotsfaehig = (b) => b.status !== 'nicht' && !b.ziel;
export const mengeText = (b) => `${String(b.menge).replace('.', ',')} ${GRUPPEN[b.gruppe].einheit}`;

export function vorgabeText(ctx, v) {
  if (!v) return '';
  if (v.art === 'bald') return `Bald verfügbar (${v.tage} Tage)`;
  if (v.art === 'monat') return `Verfügbar ab im ${monatLabel(v.monat)}`;
  if (v.art === 'offen') return 'Mit offenen Nachweisen';
  return '';
}

// Grundmenge vor den freien Filtern.
export function katalogGrundmenge(ctx) {
  const f = ctx.ui.katalog; const v = f.vorgabe;
  if (v?.art === 'bald') return kennzahlen(ctx, { horizontTage: v.tage === 30 ? 30 : 90 }).baldVerfuegbar.eintraege;
  if (v?.art === 'monat') return kennzahlen(ctx).zeitverlauf.monate.find((m) => m.monat === v.monat)?.eintraege || [];
  if (v?.art === 'offen') return kennzahlen(ctx).offenePruefpunkte.eintraege.map((x) => x.bauteil);
  return f.alle ? ctx.daten.bauteile : ctx.daten.bauteile.filter(angebotsfaehig);
}

export function katalogEintraege(ctx) {
  const f = ctx.ui.katalog;
  const q = f.q.trim().toLowerCase();
  const mindest = Number(String(f.mindest).trim().replace(',', '.'));
  return katalogGrundmenge(ctx).filter((b) => {
    const p = ctx.daten.projekte.find((x) => x.kurz === b.projekt);
    const text = `${b.id} ${b.name} ${GRUPPEN[b.gruppe].name} ${b.projekt} ${p?.name || ''} ${p?.bezirk || ''} ${b.raum}`.toLowerCase();
    return (!q || text.includes(q)) && (!f.gruppe || b.gruppe === f.gruppe) && (!f.bezirk || p?.bezirk === f.bezirk)
      && (!f.bis || (b.verfuegbarAb && b.verfuegbarAb <= f.bis)) && (!String(f.mindest).trim() || (Number.isFinite(mindest) && b.menge >= mindest))
      && (!f.offen || offeneNachweise(ctx, b).length > 0);
  }).sort((a, b) => (a.verfuegbarAb || '9').localeCompare(b.verfuegbarAb || '9') || a.projekt.localeCompare(b.projekt) || a.id.localeCompare(b.id));
}

function karte(ctx, b) {
  const p = ctx.daten.projekte.find((x) => x.kurz === b.projekt);
  const offen = offeneNachweise(ctx, b).length;
  return `<li class="bt-karte">
    <div class="btk-kopf"><span class="bref">${p ? pchip(p) : esc(b.projekt)}<span class="mono">${esc(b.id)}</span></span>${statusChip(bauteilStatus(ctx, b))}</div>
    <h3><a class="btk-link" href="${routePass(b)}">${esc(b.name)}</a></h3>
    <p class="btk-gruppe">${gruppenChip(b.gruppe, GRUPPEN[b.gruppe].name)}</p>
    <dl class="fakten">
      <div><dt>Menge</dt><dd class="mono">${esc(mengeText(b))}</dd></div>
      <div><dt>Zustand</dt><dd>${b.zustand ? `<span class="zustand z-${b.zustand}" title="${esc(ZUSTAND[b.zustand])}">${esc(b.zustand)}</span> <span class="leise">${esc(ZUSTAND[b.zustand])}</span>` : 'nicht angegeben'}</dd></div>
      <div><dt>Verfügbar</dt><dd>${esc(verfuegbarText(b))}</dd></div>
      <div><dt>Bezirk</dt><dd>${esc(p?.bezirk || '–')}</dd></div>
      <div><dt>Offene Nachweise</dt><dd class="mono">${offen ? `<b>${offen}</b>` : '0'}</dd></div>
    </dl>
  </li>`;
}

export function katalog(ctx) {
  const f = ctx.ui.katalog;
  const grund = katalogGrundmenge(ctx);
  const liste = katalogEintraege(ctx);
  const gruppen = [...new Set(ctx.daten.bauteile.map((b) => b.gruppe))];
  const bezirke = [...new Set(ctx.daten.projekte.filter((p) => ctx.daten.bauteile.some((b) => b.projekt === p.kurz)).map((p) => p.bezirk))].sort((a, b) => a.localeCompare(b, 'de'));
  const sel = (id, label, opts, wert) => `<label class="filter"><span>${label}</span><select id="${id}"><option value="">Alle</option>${opts.map(([v, t]) => `<option value="${esc(v)}" ${v === wert ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>`;
  const aktiv = f.q || f.gruppe || f.bezirk || f.bis || String(f.mindest).trim() || f.offen || f.vorgabe || f.alle;
  return `${seitenkopf({
    titel: 'Bauteile', untertitel: 'Angebotene Bauteile aus allen Projekten. Wählen Sie ein Bauteil für die Bauteilakte.',
    aktionen: `<a class="knopf-zweit" href="#erfassung">${icon('kamera')} Bauteil erfassen</a>`,
  })}
  ${f.vorgabe ? `<div class="vorgabe" role="status"><span>${chip(vorgabeText(ctx, f.vorgabe), 'info')} <span class="leise">Die Liste zeigt genau die Einträge der Übersicht.</span></span><button type="button" class="knopf-leise knopf-klein" data-action="katalog-vorgabe-weg">Vorgabe aufheben</button></div>` : ''}
  <div class="werkzeugleiste" role="group" aria-label="Bauteile suchen und filtern">
    <label class="filter filter-suche"><span>Suche</span><span class="suchfeld">${icon('suche')}<input id="kat-q" type="search" value="${esc(f.q)}" placeholder="ID, Bauteil, Projekt oder Raum" autocomplete="off"></span></label>
    ${sel('kat-gruppe', 'Gruppe', gruppen.map((g) => [g, GRUPPEN[g].name]), f.gruppe)}
    ${sel('kat-bezirk', 'Bezirk', bezirke.map((b) => [b, b]), f.bezirk)}
    <label class="filter"><span>Verfügbar spätestens ab</span><input id="kat-bis" type="date" value="${esc(f.bis)}"></label>
    <label class="filter filter-schmal"><span>Mindestmenge</span><input id="kat-menge" inputmode="decimal" value="${esc(f.mindest)}" placeholder="z. B. 20" autocomplete="off"></label>
    <label class="schalter"><input type="checkbox" id="kat-offen" ${f.offen ? 'checked' : ''}><span>nur mit offenen Nachweisen</span></label>
    ${f.vorgabe ? '' : `<label class="schalter"><input type="checkbox" id="kat-alle" ${f.alle ? 'checked' : ''}><span>auch nicht angebotene zeigen</span></label>`}
    <span class="treffer" role="status">${liste.length} von ${grund.length}</span>
    ${aktiv ? '<button type="button" class="knopf-leise" id="kat-reset" data-action="katalog-reset">Filter zurücksetzen</button>' : ''}
  </div>
  ${liste.length ? `<ul class="bt-raster">${liste.map((b) => karte(ctx, b)).join('')}</ul>
  <p class="hinweis-zeile">Sortiert nach „verfügbar ab“. Zustand nach Sichtprüfung (Skala des Entwurfs, keine Norm). Bezirk und Lage der Projekte sind symbolisch.</p>`
    : leer('Kein Bauteil passt zu den Filtern.', grund.length ? 'Filter lockern oder zurücksetzen.' : 'Für diese Auswahl gibt es keine Bauteile.', '<button type="button" class="knopf" data-action="katalog-reset">Filter zurücksetzen</button>')}`;
}
