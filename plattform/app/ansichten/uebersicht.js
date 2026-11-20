// Übersicht: Kernfrage, Zeitkritisches, Kennzahl-Kacheln und Verfügbarkeit im Zeitverlauf.
// Alle Zahlen kommen aus kennzahlen(ctx). Jede Kachel verlinkt auf genau die gezählten Einträge.
import { kennzahlen } from '../kennzahlen.js';
import { VORGANG_STATUS } from '../vorgang.js';
import { ERGEBNIS, ERGEBNIS_REIHENFOLGE } from '../abgleich.js';
import { esc, chip, icon, pchip, slug, seitenkopf, routeEntscheidung, routeBedarf } from '../ui.js';
import { zeit, abstand, datum } from '../zeit.js';
import { verfuegbarkeitsDiagramm } from './diagramm.js';

export const KERNFRAGE = 'Was wird wo und wann verfügbar, welches Projekt könnte es brauchen, und was ist für Prüfung, Vormerkung und Übergabe noch zu klären?';
const mengenText = (m) => Object.entries(m).map(([e, v]) => `${String(v).replace('.', ',')} ${e}`).join(' · ') || 'keine Mengen';

// Kachel: Überschrift, große Zahl als Link zur Ziel-Liste, kurzer Text, Teillinks. Die ganze Fläche ist klickbar.
function kachel({ id, titel, zahl, einheit = '', neben = '', href, aktion = '', text = '', kopfExtra = '', teile = '', ziel }) {
  return `<section class="kachel" aria-labelledby="${id}">
    <div class="kachel-kopf"><h2 id="${id}">${esc(titel)}</h2>${kopfExtra}</div>
    <a class="kachel-haupt" href="${esc(href)}" ${aktion} aria-label="${esc(`${titel}: ${zahl} ${einheit}${neben ? `, ${neben}` : ''}. ${ziel}`)}"><b class="kachel-zahl">${zahl}</b>${einheit ? `<span class="kachel-einheit">${esc(einheit)}</span>` : ''}${neben ? `<span class="kachel-neben">${esc(neben)}</span>` : ''}</a>
    ${text ? `<p class="kachel-text">${text}</p>` : ''}
    ${teile}
    <p class="kachel-ziel" aria-hidden="true">${esc(ziel)} ${icon('pfeilrechts')}</p>
  </section>`;
}

function zeitkritisch(ctx, kz) {
  const z = kz.zeitkritisch;
  const zeile = (f) => {
    const a = abstand(f.at, ctx.at);
    const e = f.art === 'entscheidung' ? f.ref : null;
    const p = ctx.daten.projekte.find((x) => x.kurz === f.projekt);
    const titel = e ? `${e.id} · ${e.bauteil} → ${e.ziel.id}` : `${f.id} · ${f.ref.titel}`;
    const href = e ? routeEntscheidung(e) : routeBedarf(f.ref);
    return `<li class="frist-zeile">
      <span class="fz-chip">${chip(f.ueberfaellig ? 'Überfällig' : a.text, f.ueberfaellig ? 'crit' : f.ton === 'crit' ? 'crit' : 'warn')}</span>
      <span class="fz-text"><a href="${href}"><b>${esc(f.name)}</b> · ${esc(titel)}</a><small>${p ? `${pchip(p)} ` : ''}${f.detail ? esc(f.detail) : f.art === 'entscheidung' ? 'Vorgang, zur Entscheidung' : 'Bedarf, zum Bedarf'}</small></span>
      <span class="fz-zeit mono">${zeit(f.at)}</span>
    </li>`;
  };
  return `<section class="flaeche zeitkritisch" aria-labelledby="h-zk">
    <div class="block-kopf"><h2 id="h-zk">Zeitkritisch (${z.tage} Tage)</h2><span class="leise">${z.anzahl ? `${z.anzahl} Frist${z.anzahl === 1 ? '' : 'en'}${z.ueberfaellig ? `, davon ${z.ueberfaellig} überfällig` : ''} · Überfälliges zuerst` : `Stichtag ${zeit(ctx.at)}`}</span></div>
    ${z.anzahl ? `<ul class="fristliste">${[...z.eintraege].sort((a, b) => Number(b.ueberfaellig) - Number(a.ueberfaellig)).map(zeile).join('')}</ul>`
      : `<p class="leer-zeile">Keine Frist in den nächsten ${z.tage} Tagen nach dem Stichtag der Demo (${zeit(ctx.at)}).</p>`}
  </section>`;
}

export function uebersicht(ctx) {
  const tage = ctx.ui.uebersicht?.tage === 30 ? 30 : 90;
  const kz = kennzahlen(ctx, { horizontTage: tage });
  const bv = kz.baldVerfuegbar; const pp = kz.passendePaare; const vg = kz.vorgaenge; const op = kz.offenePruefpunkte; const bo = kz.bedarfeOffen;

  const projektZahl = {};
  for (const x of op.eintraege) projektZahl[x.bauteil.projekt] = (projektZahl[x.bauteil.projekt] || 0) + 1;

  const kacheln = [
    kachel({
      id: 'k-bald', titel: 'Bald verfügbar', zahl: bv.anzahl, einheit: bv.anzahl === 1 ? 'Position' : 'Positionen', href: '#bauteile', aktion: `data-action="katalog-vorgabe" data-wert="bald" data-tage="${tage}"`,
      kopfExtra: `<span class="umschalter" role="group" aria-label="Zeitraum">${[30, 90].map((t) => `<button type="button" class="filterchip filterchip-klein" aria-pressed="${t === tage}" data-action="bald-tage" data-wert="${t}">${t} Tage</button>`).join('')}</span>`,
      text: `Verfügbar ab zwischen Stichtag und ${tage} Tage danach, ohne festes Ziel. Mengen je Einheit: <b>${esc(mengenText(bv.mengen))}</b>.`, ziel: 'Im Katalog ansehen',
    }),
    kachel({
      id: 'k-paare', titel: 'Paare derselben Gruppe', zahl: pp.anzahl, einheit: pp.anzahl === 1 ? 'Paar' : 'Paare', neben: `davon ${pp.pruefbar} prüfbar`, href: '#abgleich', aktion: 'data-action="abgleich-filter" data-wert=""',
      text: 'Angebot und Bedarf derselben Gruppe, nach Ergebnis des Abgleichs. „Prüfbar“ heißt weiter prüfen oder knapp; die übrigen sind zu spät, unvollständig oder klärungsbedürftig.',
      teile: `<ul class="kachel-liste">${ERGEBNIS_REIHENFOLGE.map((k) => `<li><a href="#abgleich" data-action="abgleich-filter" data-wert="${k}">${chip(ERGEBNIS[k].label, ERGEBNIS[k].ton)}<b class="mono">${pp.nachErgebnis[k].anzahl}</b></a></li>`).join('')}</ul>`, ziel: 'Alle Paare ansehen',
    }),
    kachel({
      id: 'k-vorgaenge', titel: 'Vorgänge je Status', zahl: vg.anzahl, einheit: vg.anzahl === 1 ? 'Vorgang' : 'Vorgänge', href: '#vorgaenge', aktion: 'data-action="vorgang-filter" data-wert=""',
      text: `${vg.offen} davon laufen noch.`,
      teile: `<ul class="kachel-liste">${Object.entries(VORGANG_STATUS).filter(([k]) => vg.nachStatus[k].anzahl).map(([k, s]) => `<li><a href="#vorgaenge" data-action="vorgang-filter" data-wert="${k}">${chip(s.label, s.ton)}<b class="mono">${vg.nachStatus[k].anzahl}</b></a></li>`).join('') || '<li class="leise">Noch keine Vorgänge.</li>'}</ul>`, ziel: 'Arbeitsliste öffnen',
    }),
    kachel({
      id: 'k-pruef', titel: 'Offene Prüfpunkte', zahl: op.anzahl, einheit: op.anzahl === 1 ? 'Bauteil' : 'Bauteile', href: '#bauteile', aktion: 'data-action="katalog-vorgabe" data-wert="offen"',
      text: `${op.punkte} offene Nachweise und Angaben insgesamt. Je Projekt im Bestand:`,
      teile: `<ul class="kachel-liste kachel-liste-dicht">${Object.entries(projektZahl).map(([kurz, n]) => { const p = ctx.daten.projekte.find((x) => x.kurz === kurz); return `<li><a href="#bestand-${slug(kurz)}" data-action="bestand-offen">${p ? pchip(p) : esc(kurz)}<span>Bestand, nur offene</span><b class="mono">${n}</b></a></li>`; }).join('')}</ul>`, ziel: 'Alle im Katalog ansehen',
    }),
    kachel({
      id: 'k-bedarfe', titel: 'Bedarfe offen', zahl: bo.anzahl, einheit: bo.anzahl === 1 ? 'Bedarf' : 'Bedarfe', href: '#bedarfe', aktion: 'data-action="bedarfe-vorgabe"',
      text: `Bedarfe ohne laufenden Vorgang. Mengen je Einheit: <b>${esc(mengenText(bo.mengen))}</b>.`, ziel: 'Bedarfe ansehen',
    }),
  ].join('');

  return `${seitenkopf({
    titel: 'Übersicht',
    untertitel: `${esc(KERNFRAGE)}`,
    aktionen: `${chip('Beispieldaten', 'sim')}${chip(`Stichtag der Demo: ${zeit(ctx.at)} (Simulation)`, 'sim')}`,
  })}
  ${zeitkritisch(ctx, kz)}
  <div class="kachelraster">${kacheln}</div>
  <section class="flaeche" aria-labelledby="h-verlauf-dg">
    <div class="block-kopf"><h2 id="h-verlauf-dg">Verfügbarkeit im Zeitverlauf</h2><span class="leise">Positionen je Monat von „verfügbar ab“, ohne festes Ziel · Stichtag ${datum(String(ctx.at).slice(0, 10))}</span></div>
    ${verfuegbarkeitsDiagramm(ctx, kz)}
    <p class="klein">Ein Klick auf einen Balken oder Monat öffnet den Katalog mit genau diesen Positionen. Es gibt keine Angaben zu Kosten, CO₂ oder Abfall, weil dafür keine Daten vorliegen.</p>
  </section>`;
}
