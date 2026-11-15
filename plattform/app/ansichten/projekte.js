// Startseite (Karte und Projektliste), Projektübersicht und gemeinsamer Projektkopf.
import { REGIONEN, ARTEN, GRUPPEN } from '../daten.js';
import { esc, chip, pchip, artText, icon, leer, slug, routePass, routeRaum, routeEntscheidung } from '../ui.js';
import { naechsteHandlung, lage, naechsteFrist, tonVon } from '../regeln.js';
import { zeit, datum } from '../zeit.js';

const HERKUNFT = { beispiel: ['Beispiel', 'sim'], radar: ['aus Radar bestätigt', 'info'], meldung: ['Projektmeldung', 'info'] };
export const herkunftChip = (p) => chip(...(HERKUNFT[p.herkunft] || ['Beispiel', 'sim']));
export const angeboten = (ctx, p) => ctx.daten.bauteile.filter((b) => b.projekt === p.kurz && b.status !== 'nicht' && !b.ziel);
export const bedarfeVon = (ctx, p) => ctx.daten.bedarfe.filter((d) => d.projekt === p.kurz);
export const raumVon = (p, raumId) => {
  for (const g of p.gebaeude || []) for (const e of g.etagen) { const r = e.raeume.find((x) => x.id === raumId); if (r) return { gebaeude: g, etage: e, raum: r }; }
  return null;
};
export const bauteileImRaum = (ctx, p, raumId) => ctx.daten.bauteile.filter((b) => b.projekt === p.kurz && (b.raum === raumId || (b.bereich || []).includes(raumId)));

export function gefilterteProjekte(ctx) {
  const f = ctx.ui.start;
  return ctx.daten.projekte.filter((p) => p.region === undefined || p.region === f.region)
    .filter((p) => !f.art || p.art === f.art)
    .filter((p) => !f.nurAngebote || angeboten(ctx, p).length > 0);
}

// ---------- Startseite ----------
export function startseite(ctx) {
  const f = ctx.ui.start;
  const region = REGIONEN.find((r) => r.id === f.region);
  const liste = gefilterteProjekte(ctx);
  const alle = ctx.daten.projekte.length;
  const knopf = (wert, text) => `<button type="button" class="filterchip" aria-pressed="${f.art === wert}" data-action="start-art" data-wert="${wert}">${text}</button>`;
  return `
  <section class="seitenkopf">
    <div>
      <p class="eyebrow">Projekte · Region ${esc(region.name)}</p>
      <h1>Bauteile in laufenden Projekten</h1>
      <p class="unter">${alle} Projekte mit ${ctx.daten.bauteile.filter((b) => b.status !== 'nicht').length} erfassten Bauteilpositionen. ${chip('Beispieldaten, Lage symbolisch', 'sim')}</p>
    </div>
    <label class="region-wahl"><span>Region</span>
      <select id="region">${REGIONEN.map((r) => `<option value="${r.id}" ${r.id === f.region ? 'selected' : ''} ${r.aktiv ? '' : 'disabled'}>${esc(r.name)}${r.aktiv ? '' : ' (in Vorbereitung)'}</option>`).join('')}</select>
    </label>
  </section>
  <div class="filterleiste" role="group" aria-label="Projekte filtern">
    ${knopf('', 'Alle')}${Object.entries(ARTEN).map(([k, t]) => knopf(k, t)).join('')}
    <label class="schalter"><input type="checkbox" id="nur-angebote" ${f.nurAngebote ? 'checked' : ''}><span>nur mit angebotenen Bauteilen</span></label>
    <label class="schalter" title="Lädt Kartenkacheln von openstreetmap.org. Dabei werden Ihre IP-Adresse und diese Seite als Herkunft übertragen."><input type="checkbox" id="osm" ${f.osm ? 'checked' : ''}><span>Straßenkarte (online, OpenStreetMap)</span></label>
  </div>
  <div class="karte-rahmen">
    <div id="karte" class="karte" role="region" aria-label="Karte: Projekte in Dortmund. Marker öffnen eine Kurzinfo, die Liste darunter enthält dieselben Projekte."></div>
    <p class="karte-meldung" id="karte-meldung" role="status"></p>
  </div>
  <section class="block" aria-labelledby="h-liste">
    <div class="block-kopf"><h2 id="h-liste">Aktuelle und neue Projekte</h2><span class="leise">${liste.length} von ${alle} · gleiche Daten wie die Karte</span></div>
    ${liste.length ? `<ul class="projektliste">${liste.map((p) => projektZeile(ctx, p)).join('')}</ul>`
      : leer('Kein Projekt passt zum Filter.', 'Filter zurücksetzen oder eine andere Art wählen.', '<button type="button" class="knopf" data-action="start-art" data-wert="">Alle Projekte zeigen</button>')}
  </section>`;
}

function projektZeile(ctx, p) {
  const ang = angeboten(ctx, p); const bed = bedarfeVon(ctx, p);
  const offen = ctx.daten.entscheidungen.filter((e) => e.projekt === p.kurz).map((e) => ({ e, l: lage(ctx, e) }));
  const frist = offen.map(({ l }) => naechsteFrist(l, ctx.at)).filter(Boolean).sort((a, b) => (a.at < b.at ? -1 : 1))[0];
  return `<li class="projektzeile" data-projektzeile="${esc(p.kurz)}">
    <a href="#projekt-${slug(p.kurz)}" class="pz-link" data-hover="${esc(p.kurz)}">
      <span class="pz-kenn">${pchip(p, true)}</span>
      <span class="pz-titel"><b>${esc(p.name)}</b><small>${esc(p.zusatz)}</small></span>
      <span class="pz-meta">${chip(artText(p.art), 'neutral')} <span>${esc(p.phase)}</span> <span>${esc(p.bezirk)}</span></span>
      <span class="pz-zahlen"><span><b class="mono">${ang.length}</b> angeboten</span><span><b class="mono">${bed.length}</b> Bedarf${bed.length === 1 ? '' : 'e'}</span></span>
      <span class="pz-frist">${frist ? `<small>${esc(frist.name)}</small><span class="mono">${zeit(frist.at)}</span>` : `<small>${p.status === 'neu' ? 'neu im Radar' : 'keine offene Frist'}</small>`}${herkunftChip(p)}</span>
    </a>
  </li>`;
}

export function popupHtml(ctx, p) {
  const ang = angeboten(ctx, p);
  const gruppen = [...new Set(ang.map((b) => GRUPPEN[b.gruppe].name))];
  return `<div class="popup"><p class="popup-kopf">${pchip(p)} <b>${esc(p.name)}</b></p>
    <p>${esc(artText(p.art))} · ${esc(p.phase)}<br>${esc(p.bezirk)} · Lage symbolisch</p>
    <p>${ang.length ? `${ang.length} angebotene Bauteilpositionen: ${esc(gruppen.join(', '))}` : 'Noch keine angebotenen Bauteile.'}</p>
    <a class="knopf knopf-klein" href="#projekt-${slug(p.kurz)}">Projekt öffnen</a></div>`;
}

// ---------- Projektkopf ----------
export function projektKopf(ctx, p, aktiv) {
  const tabs = [['projekt', 'Übersicht', 'uebersicht'], ['gebaeude', 'Gebäude', 'gebaeude'], ['bestand', 'Bestand', 'liste'], ['entscheidungen', 'Entscheidungen', 'flagge']];
  return `
  <nav class="pfad" aria-label="Pfad"><a href="#projekte">Projekte</a><span>/</span><span aria-current="page">${esc(p.name)}</span></nav>
  <section class="projektkopf">
    ${pchip(p, true)}
    <div class="pk-text">
      <h1>${esc(p.name)}</h1>
      <p class="unter">${chip(artText(p.art), 'neutral')} <span>${esc(p.phase)}</span> <span>${esc(p.bezirk)}</span> ${herkunftChip(p)}</p>
    </div>
  </section>
  <nav class="unternav" aria-label="Projektbereiche">${tabs.map(([r, t, i]) => `<a href="#${r}-${slug(p.kurz)}" ${aktiv === r ? 'aria-current="page"' : ''}>${icon(i)}<span>${t}</span></a>`).join('')}</nav>`;
}

// ---------- Projektübersicht ----------
export function projektUebersicht(ctx, p) {
  const ang = angeboten(ctx, p); const bed = bedarfeVon(ctx, p);
  const offen = ctx.daten.entscheidungen.filter((e) => e.projekt === p.kurz);
  const lp = p.lp || 0;
  const phasen = ['Grundlagen', 'Vorplanung', 'Entwurf', 'Genehmigung', 'Ausführungsplanung', 'Vergabe vorbereiten', 'Vergabe', 'Ausführung', 'Dokumentation'];
  return `${projektKopf(ctx, p, 'projekt')}
  <section class="block" aria-labelledby="h-phase">
    <div class="block-kopf"><h2 id="h-phase">Projektphase</h2><span class="leise">${esc(p.phase)}${p.rueckbauAb ? ` · Ausbau ab ${datum(p.rueckbauAb + 'T00:00')}` : ''}${p.entscheidungBis ? ` · Entscheidungen bis ${zeit(p.entscheidungBis, false)}` : ''}</span></div>
    ${lp ? `<ol class="phasen" aria-label="Leistungsphasen 1 bis 9">${phasen.map((t, i) => `<li class="${i + 1 < lp ? 'fertig' : i + 1 === lp ? 'jetzt' : ''}" ${i + 1 === lp ? 'aria-current="step"' : ''}><span class="mono">LP ${i + 1}</span><small>${t}</small></li>`).join('')}</ol>` : `<p class="leise">Phase noch nicht erfasst.</p>`}
  </section>
  <div class="zweispaltig">
    <section class="block" aria-labelledby="h-geb">
      <div class="block-kopf"><h2 id="h-geb">Gebäude, Etagen und Räume</h2>${(p.gebaeude || []).length ? `<a class="leise" href="#gebaeude-${slug(p.kurz)}">Grundriss öffnen</a>` : ''}</div>
      ${(p.gebaeude || []).length ? (p.gebaeude || []).map((g) => `
        <div class="flaeche gebaeudebaum">
          <p class="gb-name">${icon('gebaeude')}<b>${esc(g.name)}</b><span class="leise">${g.etagen.length} Etagen · ${g.etagen.reduce((n, e) => n + e.raeume.length, 0)} Räume</span></p>
          ${g.etagen.map((e) => `<details ${e.raeume.some((r) => bauteileImRaum(ctx, p, r.id).length) ? 'open' : ''}><summary><b>${esc(e.id)}</b> ${esc(e.name)} <span class="leise">${e.raeume.length} Räume</span></summary>
            <ul class="raumliste">${e.raeume.map((r) => { const n = bauteileImRaum(ctx, p, r.id).length; return `<li><a href="${routeRaum(p.kurz, r.id)}"><span class="mono">${esc(r.id)}</span><span>${esc(r.name)}</span>${n ? `<em>${n} Bauteil${n === 1 ? '' : 'e'}</em>` : '<em class="leise">–</em>'}</a></li>`; }).join('')}</ul></details>`).join('')}
        </div>`).join('') : leer('Noch keine Gebäudedaten.', 'Etagen und Räume kommen aus einem IFC-Plan, einem Raumscan oder einer manuellen Anlage. Für dieses Projekt liegt noch nichts vor.')}
    </section>
    <section class="block" aria-labelledby="h-ang">
      <div class="block-kopf"><h2 id="h-ang">Angebotene Bauteile</h2>${ang.length ? `<a class="leise" href="#bestand-${slug(p.kurz)}">Ganzer Bestand</a>` : ''}</div>
      ${ang.length ? `<ul class="flaeche kompaktliste">${ang.slice(0, 8).map((b) => { const n = naechsteHandlung(ctx, b); return `<li><a href="${routePass(b)}"><span class="mono">${esc(b.id)}</span><span><b>${esc(b.name)}</b><small>${esc(b.menge)} ${esc(GRUPPEN[b.gruppe].einheit)} · Raum ${esc(b.raum)}${b.verfuegbarAb ? ` · ab ${datum(b.verfuegbarAb + 'T00:00')}` : ''}</small></span><span class="kl-schritt"><i class="streifen t-${n.ton}"></i>${esc(n.text)}</span></a></li>`; }).join('')}${ang.length > 8 ? `<li class="mehr"><a href="#bestand-${slug(p.kurz)}">und ${ang.length - 8} weitere im Bestand</a></li>` : ''}</ul>`
        : leer('Keine angebotenen Bauteile.', p.art === 'neubau' ? 'Dieses Projekt sucht Bauteile, siehe Bedarfe.' : 'Bauteile entstehen über die Erfassung vor Ort.', (p.gebaeude || []).length ? `<a class="knopf" href="#erfassung">${icon('kamera')} Bauteil erfassen</a>` : '')}
      ${bed.length ? `<div class="block-kopf"><h2>Bedarfe</h2></div><ul class="flaeche kompaktliste">${bed.map((d) => `<li><span class="mono">${esc(d.id)}</span><span><b>${esc(d.titel)}</b><small>${esc(GRUPPEN[d.gruppe].name)} · ${d.bedarfM2 ? `${d.bedarfM2} m² + ${d.reserveProzent} % Reserve` : `${d.menge} ${esc(d.einheit)}`}${d.text ? ` · ${esc(d.text)}` : ''}</small></span>${bedarfBelegt(ctx, d)}</li>`).join('')}</ul>` : ''}
      ${offen.length ? `<div class="block-kopf"><h2>Entscheidungen</h2><a class="leise" href="#entscheidungen-${slug(p.kurz)}">Alle</a></div><ul class="flaeche kompaktliste">${offen.map((e) => { const l = lage(ctx, e); return `<li><a href="${routeEntscheidung(e)}"><span class="mono">${esc(e.id)}</span><span><b>${esc(e.bauteil)} → ${esc(e.ziel.id)}</b><small>${esc(l.regelText)}</small></span><span class="kl-schritt"><i class="streifen t-${tonVon(l.haupt)}"></i>${esc(l.haupt.text)}</span></a></li>`; }).join('')}</ul>` : ''}
    </section>
  </div>`;
}

function bedarfBelegt(ctx, d) {
  const e = ctx.daten.entscheidungen.find((x) => x.ziel.art === 'bedarf' && x.ziel.id === d.id && (x.ziel.projekt || x.projekt) === d.projekt);
  return e ? `<a class="kl-schritt" href="${routeEntscheidung(e)}">${chip(`zugeordnet: ${e.projekt} · ${e.bauteil}`, 'info')}</a>` : `<span class="kl-schritt">${chip('offen', 'neutral')}</span>`;
}

