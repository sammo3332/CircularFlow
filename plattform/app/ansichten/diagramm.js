// Diagramm „Verfügbarkeit im Zeitverlauf“: gestapelte Monatsbalken nach Bauteilgruppe als SVG, ohne Bibliothek.
// Die Zahlen kommen aus kennzahlen(ctx).zeitverlauf. Hier wird nur gezeichnet (leere Monate füllen die Zeitachse auf).
import { GRUPPEN } from '../daten.js';
import { mengenNachEinheit, monatLabel } from '../kennzahlen.js';
import { esc, GRUPPENREIHE, gruppenPunkt, leer, icon } from '../ui.js';

const KURZ = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const naechsterMonat = (m) => { const y = Number(m.slice(0, 4)); const mo = Number(m.slice(5, 7)); return mo === 12 ? `${y + 1}-01` : `${y}-${String(mo + 1).padStart(2, '0')}`; };
const positionen = (n) => `${n} ${n === 1 ? 'Position' : 'Positionen'}`;
const mengenText = (m) => Object.entries(m).map(([e, v]) => `${String(v).replace('.', ',')} ${e}`).join(' · ');

// Lückenlose Monatsliste vom ersten bis zum letzten Monat mit Einträgen.
export function monatsreihe(zv) {
  if (!zv.monate.length) return [];
  const nach = new Map(zv.monate.map((m) => [m.monat, m]));
  const reihe = []; let m = zv.monate[0].monat; const ende = zv.monate[zv.monate.length - 1].monat;
  for (let i = 0; i < 60 && m <= ende; i += 1) { reihe.push(nach.get(m) || { monat: m, label: monatLabel(m), anzahl: 0, nachGruppe: {}, eintraege: [], mengen: {} }); m = naechsterMonat(m); }
  return reihe;
}

function schritt(max) { return max <= 5 ? 1 : max <= 10 ? 2 : max <= 25 ? 5 : 10; }

export function verfuegbarkeitsDiagramm(ctx, kz) {
  const zv = kz.zeitverlauf;
  if (!zv.anzahl) return leer('Keine Verfügbarkeit ab dem Stichtag.', 'Es gibt keine angebotene Position mit „verfügbar ab“ nach dem Stichtag der Demo und ohne festes Ziel.');
  const reihe = monatsreihe(zv);
  const gruppen = GRUPPENREIHE.filter((g) => zv.gruppen.includes(g));
  const schmal = Boolean(ctx.ui?.schmal);
  const W = schmal ? 340 : 640; const H = 276; const L = 32; const R = 8; const T = 36; const B = 46;
  const pw = W - L - R; const ph = H - T - B;
  const max = Math.max(...reihe.map((m) => m.anzahl)); const st = schritt(max); const yMax = Math.ceil(max / st) * st;
  const einheit = ph / yMax; const slot = pw / reihe.length; const bw = Math.min(46, slot * 0.64);
  const y0 = T + ph;
  const ticks = []; for (let v = 0; v <= yMax; v += st) ticks.push(v);

  const saeulen = reihe.map((m, i) => {
    const cx = L + slot * i + slot / 2; let oben = y0;
    const segmente = gruppen.filter((g) => m.nachGruppe[g]).map((g) => {
      const n = m.nachGruppe[g]; const h = n * einheit; const yo = oben - h; oben = yo;
      const gesamt = mengenNachEinheit(m.eintraege.filter((b) => b.gruppe === g).map((b) => ({ einheit: GRUPPEN[g].einheit, menge: Number(b.menge) })));
      const tip = `${m.label} · ${GRUPPEN[g].name}: ${positionen(n)} (${mengenText(gesamt)})`;
      const rh = Math.max(h - 2, 2);
      return `<a class="seg-link g-${esc(g)}" href="#bauteile" data-action="katalog-vorgabe" data-wert="monat" data-monat="${esc(m.monat)}" data-gruppe="${esc(g)}" data-tip="${esc(tip)}" aria-label="${esc(`${tip}. Im Katalog zeigen.`)}">
        <rect class="seg" x="${(cx - bw / 2).toFixed(1)}" y="${(yo + 1).toFixed(1)}" width="${bw.toFixed(1)}" height="${rh.toFixed(1)}"/></a>`;
    }).join('');
    const jahr = i === 0 || m.monat.slice(5) === '01' ? `<text class="ax-jahr" x="${cx.toFixed(1)}" y="${y0 + 32}" text-anchor="middle">${m.monat.slice(0, 4)}</text>` : '';
    const mon = `<text class="ax-text" x="${cx.toFixed(1)}" y="${y0 + 17}" text-anchor="middle">${KURZ[Number(m.monat.slice(5, 7)) - 1]}</text>`;
    const label = m.anzahl ? `<a class="seg-link ax-link" href="#bauteile" data-action="katalog-vorgabe" data-wert="monat" data-monat="${esc(m.monat)}" data-gruppe="" data-tip="${esc(`${m.label}: ${positionen(m.anzahl)}, alle Gruppen`)}" aria-label="${esc(`${m.label}: ${positionen(m.anzahl)}. Alle im Katalog zeigen.`)}"><rect class="ax-flaeche" x="${(cx - slot / 2).toFixed(1)}" y="${y0 + 2}" width="${slot.toFixed(1)}" height="22"/>${mon}</a>` : mon;
    const summe = m.anzahl ? `<text class="ax-summe" x="${cx.toFixed(1)}" y="${(oben - 5).toFixed(1)}" text-anchor="middle">${m.anzahl}</text>` : '';
    return `<g>${segmente}${label}${jahr}${summe}</g>`;
  }).join('');

  const raster = ticks.map((v) => { const y = y0 - v * einheit; return `<line class="ax-raster" x1="${L}" x2="${W - R}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/><text class="ax-text" x="${L - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end">${v}</text>`; }).join('');
  const beschreibung = reihe.filter((m) => m.anzahl).map((m) => `${m.label} ${positionen(m.anzahl)}`).join(', ');
  const gesamtJeGruppe = (g) => zv.monate.reduce((s, m) => s + (m.nachGruppe[g] || 0), 0);

  const tabelle = `<table class="einfach diagramm-tab"><caption class="sr">Verfügbarkeit im Zeitverlauf, Anzahl Positionen je Monat und Bauteilgruppe</caption>
    <thead><tr><th scope="col">Monat „verfügbar ab“</th>${gruppen.map((g) => `<th scope="col" class="r">${esc(GRUPPEN[g].name)}</th>`).join('')}<th scope="col" class="r">Summe</th></tr></thead>
    <tbody>${zv.monate.map((m) => `<tr><th scope="row"><a href="#bauteile" data-action="katalog-vorgabe" data-wert="monat" data-monat="${esc(m.monat)}" data-gruppe="">${esc(m.label)}</a></th>${gruppen.map((g) => `<td class="r mono">${m.nachGruppe[g] || '–'}</td>`).join('')}<td class="r mono"><b>${m.anzahl}</b></td></tr>`).join('')}</tbody>
    <tfoot><tr><th scope="row">Alle Monate</th>${gruppen.map((g) => `<td class="r mono">${gesamtJeGruppe(g)}</td>`).join('')}<td class="r mono"><b>${zv.anzahl}</b></td></tr></tfoot></table>`;

  return `<figure class="diagramm" aria-labelledby="dg-titel">
    <figcaption class="sr" id="dg-titel">Verfügbarkeit im Zeitverlauf: ${esc(beschreibung)}</figcaption>
    <svg viewBox="0 0 ${W} ${H}" role="group" aria-labelledby="dg-titel" class="dg-svg" preserveAspectRatio="xMidYMid meet">
      <text class="ax-titel" x="0" y="11">Anzahl Positionen</text>
      ${raster}<line class="ax-achse" x1="${L}" x2="${W - R}" y1="${y0}" y2="${y0}"/>${saeulen}
    </svg>
    <ul class="legende" aria-label="Legende Bauteilgruppen">${gruppen.map((g) => `<li>${gruppenPunkt(g)}<span>${esc(GRUPPEN[g].name)}</span><b class="mono">${gesamtJeGruppe(g)}</b></li>`).join('')}</ul>
    <details class="diagramm-tabelle"><summary>${icon('liste')} Als Tabelle anzeigen</summary><div class="tabelle-rahmen">${tabelle}</div></details>
  </figure>`;
}
