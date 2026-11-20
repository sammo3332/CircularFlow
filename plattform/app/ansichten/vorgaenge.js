// Arbeitsliste: alle Vorgänge (Entscheidungen) mit abgeleitetem Status, nächstem Schritt, Zuständigkeit und Frist (lesend).
import { VORGANG_STATUS, vorgangStatus } from '../vorgang.js';
import { lageVorgang, angezeigteFrist } from '../regeln.js';
import { esc, chip, leer, pchip, seitenkopf, person, routeEntscheidung, routeBedarf } from '../ui.js';
import { zeit, abstand } from '../zeit.js';

export function vorgangsZeilen(ctx) {
  const f = ctx.ui.vorgaenge.status;
  return ctx.daten.entscheidungen.map((e) => ({ e, st: vorgangStatus(ctx, e) })).filter((x) => !f || x.st.key === f)
    .sort((a, b) => (Number(a.st.beendet) - Number(b.st.beendet)) || a.e.projekt.localeCompare(b.e.projekt) || a.e.id.localeCompare(b.e.id));
}

function zeile(ctx, { e, st }) {
  const p = ctx.daten.projekte.find((x) => x.kurz === e.projekt);
  const l = lageVorgang(ctx, e);
  const frist = st.beendet ? null : angezeigteFrist(l, ctx.at);
  const a = frist ? abstand(frist.at, ctx.at) : null;
  const zust = l.haupt.rolle ? person(l.haupt.rolle) : null;
  const ziel = e.ziel.art === 'zieloeffnung' ? `Öffnung ${e.ziel.id}` : `Bedarf ${e.ziel.projekt || e.projekt} · ${e.ziel.id}`;
  return `<tr data-href="${routeEntscheidung(e)}">
    <td data-label="Vorgang"><div class="bt-name"><span class="bref">${p ? pchip(p) : esc(e.projekt)}<span class="mono">${esc(e.id)}</span></span><span><a href="${routeEntscheidung(e)}"><b>${esc(e.bauteil)} → ${esc(ziel)}</b></a><small>${esc(l.regelText)}</small></span></div></td>
    <td data-label="Status">${chip(st.label, st.ton)}${st.abgelaufen ? '<small>Vormerkung ist abgelaufen</small>' : st.ueberfaellig ? '<small>Übergabetermin überschritten</small>' : ''}</td>
    <td data-label="Nächster Schritt">${st.beendet ? '<span class="leise">beendet, keine weiteren Schritte</span>' : `<b>${esc(l.haupt.text)}</b>${l.haupt.wartet ? '<small>wartet auf die Fachprüfung</small>' : ''}`}</td>
    <td data-label="Zuständig">${st.beendet || !zust ? '–' : `${esc(zust.rolle)}<small>${esc(zust.name)}</small>`}</td>
    <td data-label="Frist">${frist ? `<span class="mono">${zeit(frist.at)}</span><small class="${a.vorbei ? 'vorbei' : ''}">${esc(frist.name)} · ${esc(a.text)}</small>` : '<span class="leise">keine Frist</span>'}</td>
  </tr>`;
}

export function vorgaenge(ctx) {
  const f = ctx.ui.vorgaenge.status;
  const alle = ctx.daten.entscheidungen.map((e) => vorgangStatus(ctx, e));
  const zeilen = vorgangsZeilen(ctx);
  const zahl = (k) => alle.filter((s) => s.key === k).length;
  return `${seitenkopf({ pfad: [['#uebersicht', 'Übersicht']], aktuell: 'Arbeitsliste', titel: 'Arbeitsliste', untertitel: 'Alle Vorgänge mit Status, nächstem Schritt, Zuständigkeit und Frist. Der Status folgt den Einträgen bis zum Stichtag der Demo.', aktionen: '<a class="knopf-zweit" href="#anfragen">Prüf- und Logistikanfragen</a>' })}
  <div class="filterleiste" role="group" aria-label="Nach Status filtern">
    <button type="button" class="filterchip" aria-pressed="${!f}" data-action="vorgang-filter" data-wert="">Alle ${alle.length}</button>
    ${Object.entries(VORGANG_STATUS).filter(([k]) => zahl(k) || f === k).map(([k, s]) => `<button type="button" class="filterchip" aria-pressed="${f === k}" data-action="vorgang-filter" data-wert="${k}">${esc(s.label)} ${zahl(k)}</button>`).join('')}
  </div>
  ${zeilen.length ? `<div class="tabelle-rahmen"><table class="tab-karten vorgaenge-tab">
    <thead><tr><th scope="col">Vorgang</th><th scope="col">Status</th><th scope="col">Nächster Schritt</th><th scope="col">Zuständig</th><th scope="col">Frist</th></tr></thead>
    <tbody>${zeilen.map((x) => zeile(ctx, x)).join('')}</tbody></table></div>
    <p class="hinweis-zeile">Laufende Vorgänge zuerst. Fachergebnisse, Vormerkungen und Übergaben sind Einträge der Simulation, keine Fachfreigabe und nicht verbindlich.</p>`
    : leer('Kein Vorgang in diesem Status.', alle.length ? 'Anderen Status wählen.' : 'Ein Vorgang entsteht aus einer Prüfbitte oder einer Zuordnung im Bauteilpass.', alle.length ? '<button type="button" class="knopf" data-action="vorgang-filter" data-wert="">Alle Vorgänge zeigen</button>' : '<a class="knopf" href="#abgleich">Passende Paare ansehen</a>')}`;
}
