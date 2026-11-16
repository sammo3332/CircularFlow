// Gebäudeansicht: schematischer 2D-Grundriss je Etage mit anklickbaren Räumen und Bauteilen.
// Das Modell ist ein Beispielmodell. IFC- und Raumscan-Import sind getrennt als Prüfung bzw. Simulation dargestellt.
import { GRUPPEN, STATUS } from '../daten.js';
import { esc, chip, icon, leer, slug, routePass, routeRaum, routeEntscheidung, tonMarke } from '../ui.js';
import { naechsteHandlung, bauteilStatus } from '../regeln.js';
import { projektKopf, raumVon, bauteileImRaum } from './projekte.js';

export function gebaeudeAnsicht(ctx, p, raumId) {
  if (!(p.gebaeude || []).length) return `${projektKopf(ctx, p, 'gebaeude')}${leer('Noch kein Gebäudemodell.', 'Für dieses Projekt liegen keine Etagen und Räume vor. Sie können später aus einem IFC-Plan oder Raumscan kommen.')}${importBereich(ctx)}`;
  const g = p.gebaeude[0];
  const gewaehlt = raumId ? raumVon(p, raumId) : null;
  const etageId = gewaehlt ? gewaehlt.etage.id : (ctx.ui.gebaeude[p.kurz] || (g.etagen.find((e) => e.id === '1.OG') || g.etagen[0]).id);
  const etage = g.etagen.find((e) => e.id === etageId) || g.etagen[0];
  return `${projektKopf(ctx, p, 'gebaeude')}
  <div class="geb-kopf">
    <div class="etagenwahl" role="group" aria-label="Etage wählen">${g.etagen.map((e) => `<button type="button" class="filterchip" aria-pressed="${e.id === etage.id}" data-action="etage" data-projekt="${esc(p.kurz)}" data-etage="${esc(e.id)}">${esc(e.id)}</button>`).join('')}</div>
    <p class="leise">${esc(g.name)} · ${esc(etage.name)} · ${chip('Beispielmodell, schematisch', 'sim')}</p>
  </div>
  <div class="geb-raster">
    <div class="flaeche plan-flaeche">
      ${grundriss(ctx, p, etage, gewaehlt?.raum.id)}
      <p class="legende-zeile"><span><i class="lg lg-raum"></i>Raum</span><span><i class="lg lg-bauteil"></i>Bauteil (Farbe = Status)</span><span><i class="lg lg-oeffnung"></i>Zielöffnung</span><span><i class="lg lg-bedarf"></i>Bedarf</span><span><i class="lg lg-flaeche"></i>Sammelposition, Fläche</span></p>
    </div>
    <aside class="geb-seite">${gewaehlt ? raumPanel(ctx, p, gewaehlt) : `<div class="flaeche raum-hinweis"><h2>Raum wählen</h2><p>Klicken Sie im Grundriss auf einen Raum oder ein Bauteil. Ein Raum zeigt seine Bauteile, Zielöffnungen und Bedarfe.</p><ul class="raumliste kompakt">${etage.raeume.map((r) => { const n = bauteileImRaum(ctx, p, r.id).length; return `<li><a href="${routeRaum(p.kurz, r.id)}"><span class="mono">${esc(r.id)}</span><span>${esc(r.name)}</span>${n ? `<em>${n}</em>` : ''}</a></li>`; }).join('')}</ul></div>`}</aside>
  </div>
  ${importBereich(ctx)}`;
}

function grundriss(ctx, p, etage, aktivRaum) {
  const auf = ctx.daten.bauteile.filter((b) => b.projekt === p.kurz && b.etage === etage.id);
  const oeffnungen = ctx.daten.zieloeffnungen.filter((z) => z.projekt === p.kurz && z.etage === etage.id);
  const bedarfe = ctx.daten.bedarfe.filter((d) => d.projekt === p.kurz && d.etage === etage.id);
  const raum = (id) => etage.raeume.find((r) => r.id === id);
  const flaechen = auf.filter((b) => (b.bereich || []).length && b.gruppe === 'boden');
  const zaehler = {};
  const pos = (b) => {
    if (b.plan) return b.plan;
    const r = raum(b.raum); if (!r) return [50, 30];
    const i = (zaehler[b.raum] = (zaehler[b.raum] || 0) + 1);
    return [r.plan[0] + r.plan[2] / 2 + (i - 1) * 5 - 5, r.plan[1] + r.plan[3] / 2 + 3];
  };
  const tonFarbe = (b) => STATUS[bauteilStatus(ctx, b)]?.ton || 'neutral';
  return `<svg class="grundriss" viewBox="-2 -2 104 66" role="group" aria-label="Grundriss ${esc(etage.name)}, Beispielmodell">
    <defs><pattern id="schraffur" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="2.4" class="schraffur-linie"/></pattern></defs>
    ${etage.raeume.map((r) => `<a href="${routeRaum(p.kurz, r.id)}" class="raum${r.id === aktivRaum ? ' aktiv' : ''}" aria-label="Raum ${esc(r.id)} ${esc(r.name)}">
      <rect x="${r.plan[0]}" y="${r.plan[1]}" width="${r.plan[2]}" height="${r.plan[3]}" />
      <text x="${r.plan[0] + 1.6}" y="${r.plan[1] + 3.6}" class="rn-nr">${esc(r.id)}</text>
      ${r.plan[2] >= 18 ? `<text x="${r.plan[0] + 1.6}" y="${r.plan[1] + 6.6}" class="rn-name">${esc(r.name.length > 22 ? r.name.slice(0, 21) + '…' : r.name)}</text>` : ''}
    </a>`).join('')}
    ${bedarfe.map((d) => d.raeume.map((id) => raum(id)).filter(Boolean).map((r) => `<rect x="${r.plan[0] + 0.8}" y="${r.plan[1] + 0.8}" width="${r.plan[2] - 1.6}" height="${r.plan[3] - 1.6}" class="bedarf-rahmen"><title>Bedarf ${esc(d.id)}: ${esc(d.titel)}</title></rect>`).join('')).join('')}
    ${flaechen.map((b) => b.bereich.map((id) => raum(id)).filter(Boolean).map((r) => `<rect x="${r.plan[0] + 1.5}" y="${r.plan[1] + 8}" width="${r.plan[2] - 3}" height="${r.plan[3] - 10}" class="flaeche-schraffur" fill="url(#schraffur)"/>`).join('')).join('')}
    ${oeffnungen.map((z) => { const e = ctx.daten.entscheidungen.find((x) => x.ziel.art === 'zieloeffnung' && x.ziel.id === z.id && x.projekt === p.kurz); const inner = `<rect x="${z.plan[0] - 3}" y="${z.plan[1] - 1.1}" width="6" height="2.2" class="oeffnung"/><text x="${z.plan[0]}" y="${z.plan[1] + 4.6}" class="oe-text" text-anchor="middle">${esc(z.id)}</text>`; return e ? `<a href="${routeEntscheidung(e)}" aria-label="Zielöffnung ${esc(z.id)}, Entscheidung ${esc(e.id)}">${inner}</a>` : `<g aria-label="Zielöffnung ${esc(z.id)}, offen">${inner}<title>Zielöffnung ${esc(z.id)} · noch keinem Bauteil zugeordnet</title></g>`; }).join('')}
    ${auf.map((b) => { const [x, y] = pos(b); const g = GRUPPEN[b.gruppe]; return `<a href="${routePass(b)}" class="bauteil-punkt t-${tonFarbe(b)}" aria-label="${esc(b.id)} ${esc(b.name)}, ${esc(STATUS[bauteilStatus(ctx, b)]?.label)}${b.plan ? '' : ', Lage im Raum nicht erfasst'}">
      <rect x="${x - 3.6}" y="${y - 1.9}" width="7.2" height="3.8" rx="1"/><text x="${x}" y="${y + 1}" text-anchor="middle">${esc(b.id.length > 5 ? g.prefix : b.id)}</text></a>`; }).join('')}
  </svg>`;
}

function raumPanel(ctx, p, { etage, raum }) {
  const teile = bauteileImRaum(ctx, p, raum.id);
  const oeffnungen = ctx.daten.zieloeffnungen.filter((z) => z.projekt === p.kurz && z.raum === raum.id);
  const bedarfe = ctx.daten.bedarfe.filter((d) => d.projekt === p.kurz && d.raeume.includes(raum.id));
  return `<section class="flaeche raumpanel" aria-labelledby="h-raum">
    <p class="eyebrow">${esc(etage.name)}</p>
    <h2 id="h-raum"><span class="mono">${esc(raum.id)}</span> ${esc(raum.name)}</h2>
    <p class="leise">${raum.flaeche ? `${raum.flaeche} m² (Beispiel)` : ''}</p>
    <a class="knopf breit" href="#erfassung-${slug(p.kurz)}-${slug(raum.id)}">${icon('kamera')} Bauteil in diesem Raum erfassen</a>
    <h3>Bauteile im Raum</h3>
    ${teile.length ? `<ul class="kompaktliste">${teile.map((b) => { const n = naechsteHandlung(ctx, b); return `<li><a href="${routePass(b)}"><span class="mono">${esc(b.id)}</span><span><b>${esc(b.name)}</b><small>${esc(STATUS[bauteilStatus(ctx, b)]?.label)}${b.raum !== raum.id ? ` · Hauptraum ${esc(b.raum)}` : ''}</small></span><span class="kl-schritt">${tonMarke(n.ton)}${esc(n.text)}</span></a></li>`; }).join('')}</ul>` : '<p class="leer-zeile">Noch keine Bauteile in diesem Raum erfasst.</p>'}
    ${oeffnungen.length ? `<h3>Zielöffnungen</h3><ul class="kompaktliste">${oeffnungen.map((z) => { const e = ctx.daten.entscheidungen.find((x) => x.ziel.art === 'zieloeffnung' && x.ziel.id === z.id && x.projekt === p.kurz); return `<li>${e ? `<a href="${routeEntscheidung(e)}">` : '<span class="kl-zeile">'}<span class="mono">${esc(z.id)}</span><span><b>Rohbauöffnung ${esc(z.id)}</b><small>Soll ${z.minMm}–${z.maxMm} mm · ${esc(z.herkunft)}</small></span>${e ? `${chip(`${e.bauteil} zugeordnet`, 'info')}</a>` : `${chip('frei', 'neutral')}</span>`}</li>`; }).join('')}</ul>` : ''}
    ${bedarfe.length ? `<h3>Bedarfe</h3><ul class="kompaktliste">${bedarfe.map((d) => `<li><span class="kl-zeile"><span class="mono">${esc(d.id)}</span><span><b>${esc(d.titel)}</b><small>${esc(d.herkunft)}</small></span></span></li>`).join('')}</ul>` : ''}
  </section>`;
}

function importBereich(ctx) {
  const im = ctx.ui.importe;
  return `<section class="block" aria-labelledby="h-import">
    <div class="block-kopf"><h2 id="h-import">Gebäudedaten übernehmen</h2><span class="leise">Prüfung für später, nichts wird übernommen</span></div>
    <div class="zweispaltig">
      <div class="flaeche importkarte">
        <p class="ik-kopf"><b>IFC-Plan</b>${chip('Vorprüfung echt · Import simuliert', 'sim')}</p>
        <p>Eine IFC-Datei aus dem BIM-Modell liefert Geschosse (IfcBuildingStorey), Räume (IfcSpace) und Türen (IfcDoor). Die Vorprüfung liest die Datei nur in diesem Browser, lädt nichts hoch und zählt diese Einträge.</p>
        <label class="knopf-zweit dateiknopf">${icon('plus')} IFC-Datei vorprüfen<input type="file" id="ifc-datei" accept=".ifc,application/x-step,text/plain"></label>
        ${im.ifc ? (im.ifc.fehler ? `<p class="feld-meldung" role="alert">${esc(im.ifc.fehler)}</p>` : `<div class="ergebnisbox" role="status"><p><b>${esc(im.ifc.datei)}</b> · Schema ${esc(im.ifc.schema)}</p><ul>${Object.entries(im.ifc.zaehlung).map(([k, v]) => `<li><span>${esc(k)}</span><b class="mono">${v}</b></li>`).join('')}</ul><p class="klein">Nur gezählt. Geometrie, Räume und Maße wurden nicht übernommen.</p></div>`) : ''}
        <button type="button" class="knopf-leise" data-action="import-ifc-sim">Import simulieren</button>
        ${im.ifcSim ? `<div class="ergebnisbox sim" role="status"><p><b>Simulation:</b> So würde ein IFC-Import zugeordnet.</p><table class="einfach"><tbody>
          <tr><td>IfcBuildingStorey</td><td>Etage (Name, Höhe)</td></tr><tr><td>IfcSpace</td><td>Raum (Nummer, Name, Fläche aus Mengenangaben)</td></tr>
          <tr><td>IfcDoor</td><td>Tür oder Zielöffnung. OverallWidth und OverallHeight sind optional und beschreiben den Umriss der Türöffnung im Modell, kein Aufmaß: Übernahme nur als „vorgeschlagen“, Quelle IFC</td></tr>
          <tr><td>IfcRelContainedInSpatialStructure, IfcRelSpaceBoundary</td><td>Zuordnung Bauteil → Etage bzw. Raum</td></tr></tbody></table>
          <p class="klein">Es wurde keine Datei gelesen und nichts angelegt.</p></div>` : ''}
      </div>
      <div class="flaeche importkarte">
        <p class="ik-kopf"><b>Raumscan</b>${chip('simuliert', 'sim')}</p>
        <p>Ein Scan mit LiDAR-Handy (z. B. Apple RoomPlan) liefert Wände, Öffnungen und Raummaße. Für Regeln zählt ein Scanmaß erst nach Prüfung an der Messstelle, weil Toleranz und Bezug abweichen können.</p>
        <button type="button" class="knopf-leise" data-action="import-scan-sim">Beispielscan simulieren</button>
        ${im.scanSim ? `<div class="ergebnisbox sim" role="status"><p><b>Simulation:</b> Beispielscan Raum 2.05</p><ul>
          <li><span>Wände</span><b class="mono">4</b></li><li><span>Öffnungen</span><b class="mono">2</b></li><li><span>Öffnung B-04, Breite</span><b class="mono">884 mm · vorgeschlagen</b></li></ul>
          <p class="klein">Das Scanmaß würde als „vorgeschlagen“ übernommen und erst durch ein Aufmaß an der Messstelle laut P-04 zu „gemessen“. Nichts wurde angelegt.</p></div>` : ''}
      </div>
    </div>
  </section>`;
}

