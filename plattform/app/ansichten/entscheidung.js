// Wiederverwendungsentscheidung (Bauteil → Zielöffnung oder Bedarf) und Liste je Projekt.
import { GRUPPEN, PROJEKTE } from '../daten.js';
import { esc, chip, icon, leer, slug, routePass, routeEntscheidung, routeRaum, person, bauteilRef, pchip } from '../ui.js';
import { lage, tonVon, naechsteFrist, schluessel, wertText } from '../regeln.js';
import { zeit, abstand, minuten } from '../zeit.js';
import { projektKopf, raumVon } from './projekte.js';

export function entscheidungsListe(ctx, p) {
  const liste = ctx.daten.entscheidungen.filter((e) => e.projekt === p.kurz).map((e) => ({ e, l: lage(ctx, e) }))
    .sort((a, b) => ((a.l.haupt.wartet ? 7 : a.l.haupt.rank) - (b.l.haupt.wartet ? 7 : b.l.haupt.rank)) || ((naechsteFrist(a.l, ctx.at)?.at || '9') < (naechsteFrist(b.l, ctx.at)?.at || '9') ? -1 : 1));
  return `${projektKopf(ctx, p, 'entscheidungen')}
  ${liste.length ? `<div class="entscheidungsliste">${liste.map(({ e, l }) => zeile(ctx, p, e, l)).join('')}</div>
  <p class="hinweis-zeile">Sortiert nach Handlungsdruck: Rang des nächsten Schritts, dann nächste Frist. Neue Entscheidungen entstehen im Bauteilpass über „Ziel zuordnen“.</p>`
    : leer('Noch keine Entscheidungen.', 'Eine Entscheidung entsteht, wenn ein Bauteil im Pass einer Zielöffnung oder einem Bedarf zugeordnet wird.', `<a class="knopf" href="#bestand-${slug(p.kurz)}">Zum Bestand</a>`)}`;
}

function zeile(ctx, p, e, l) {
  const f = naechsteFrist(l, ctx.at) || l.fristen[l.fristen.length - 1];
  const a = f ? abstand(f.at, ctx.at) : null;
  return `<a class="entscheidung-zeile" href="${routeEntscheidung(e)}">
    <span class="ez-id"><span class="mono">${esc(e.id)}</span>${chip(l.geprueft ? 'Regel geprüft' : 'Entwurf', l.geprueft ? 'ok' : 'neutral')}</span>
    <span class="ez-titel"><b>${esc(l.b.id)} ${esc(l.b.name)}</b><small>→ ${e.ziel.art === 'zieloeffnung' ? `Zielöffnung ${esc(l.z.id)}, Raum ${esc(l.z.raum)}` : `Bedarf ${esc(l.z.projekt)} · ${esc(l.z.id)}`}</small></span>
    <span class="ez-schritt"><i class="streifen t-${tonVon(l.haupt)}"></i><span><small>Nächster Schritt · ${esc(person(l.haupt.rolle).rolle)}</small><b>${esc(l.haupt.text)}</b>${l.weiter.length ? `<small>und ${l.weiter.length} weitere offene Aufgabe${l.weiter.length > 1 ? 'n' : ''}</small>` : ''}</span></span>
    <span class="ez-frist">${f ? `<small>${esc(f.name)}</small><span class="mono">${zeit(f.at)}</span><small class="${a.vorbei ? 'vorbei' : ''}">${a.text}</small>` : '<small>keine Frist</small>'}</span>
  </a>`;
}

export function entscheidungsSeite(ctx, p, e) {
  const l = lage(ctx, e); const b = l.b; const z = l.z;
  const ton = tonVon(l.haupt);
  const aktion = l.haupt.wartet ? null : l.haupt.rank === 6 ? (e.regel === 'einfach' ? 'Abgleich vermerken' : 'Zur Fachprüfung vorlegen')
    : l.haupt.rank === 5 ? (l.haupt.rolle === 'montage' ? (e.regel === 'tuer' ? 'Messauftrag vermerken' : 'Nachweisanforderung vermerken') : 'Aufgabe vermerken') : 'Klärung vermerken';
  const k = schluessel(e.projekt, e.id);
  const verlauf = ctx.ereignisse.filter((x) => x.entscheidung === k && x.at <= ctx.at).sort((x, y) => (x.at < y.at ? 1 : -1));
  const zielProjekt = PROJEKTE.find((x) => x.kurz === (e.ziel.projekt || e.projekt)) || ctx.daten.projekte.find((x) => x.kurz === (e.ziel.projekt || e.projekt));
  const herkunft = raumVon(p, b.raum);
  const ziel = e.ziel.art === 'zieloeffnung' ? raumVon(p, z.raum) : (zielProjekt ? raumVon(zielProjekt, z.raeume?.[0]) : null);
  return `
  <nav class="pfad" aria-label="Pfad"><a href="#projekte">Projekte</a><span>/</span><a href="#projekt-${slug(p.kurz)}">${esc(p.name)}</a><span>/</span><a href="#entscheidungen-${slug(p.kurz)}">Entscheidungen</a><span>/</span><span aria-current="page">${esc(e.id)}</span></nav>
  <section class="seitenkopf">
    <div>
      <p class="eyebrow">Wiederverwendungsentscheidung · <span class="mono">${esc(e.id)}</span></p>
      <h1>${bauteilRef(p, b)} ${esc(b.name)} → ${e.ziel.art === 'zieloeffnung' ? `Öffnung ${esc(z.id)}` : `${zielProjekt ? pchip(zielProjekt) : ''} Bedarf ${esc(z.id)}`}</h1>
      <p class="unter">${chip(l.regelText, l.geprueft ? 'ok' : 'neutral')} <a href="${routePass(b)}">Bauteilpass ${esc(b.id)}</a></p>
    </div>
  </section>
  <section class="ergebnis t-rand-${ton}" aria-labelledby="h-schritt">
    <div class="ergebnis-haupt">
      <p class="label">Nächster fachlicher Schritt</p>
      <h2 id="h-schritt" tabindex="-1">${esc(l.haupt.text)}</h2>
      <p class="ergebnis-rolle">${esc(person(l.haupt.rolle).rolle)} · ${esc(person(l.haupt.rolle).name)}, ${esc(person(l.haupt.rolle).stelle)}</p>
      <p class="ergebnis-grund">${esc(l.haupt.grund)}</p>
      ${l.vorlage && !l.haupt.wartet ? `<p class="ergebnis-grund"><b>Am ${zeit(l.vorlage.at)} zur Fachprüfung vorgelegt.</b> Die aktuelle Lage verlangt zuerst diesen Schritt.</p>` : ''}
      <div class="ergebnis-aktionen">
        ${aktion ? `<button type="button" class="knopf" id="aktion-schritt" data-action="schritt" data-entscheidung="${esc(k)}">${aktion}</button>` : '<span class="chip chip-info">Liegt der Fachprüfung vor</span>'}
        <span class="leise">Wird mit Projektzeit im Verlauf vermerkt. Simulation, nichts wird versendet.</span>
      </div>
    </div>
    <div class="ergebnis-weiter"><p class="label">Weiterhin offen</p>
      ${l.weiter.length ? `<ul>${l.weiter.map((w) => `<li><b>${esc(w.text)}</b><small>${esc(person(w.rolle).rolle)}</small></li>`).join('')}</ul>` : '<p class="leise">Nichts weiter offen.</p>'}</div>
  </section>
  <div class="entscheid-raster">
    <div class="entscheid-haupt">${e.regel === 'tuer' ? tuerTeil(ctx, e, l, k) : e.regel === 'boden' ? bodenTeil(ctx, e, l, k) : einfachTeil(ctx, e, l)}</div>
    <aside class="entscheid-seite">
      <section class="flaeche"><h2>Herkunft und Ziel</h2>
        <dl class="werte"><div><dt>Herkunft</dt><dd><a href="${routeRaum(p.kurz, b.raum)}">${esc(p.kurz)} · ${esc(b.raum)} ${esc(herkunft?.raum.name || '')}</a><small>${esc(herkunft?.etage.name || '')}</small></dd></div>
        <div><dt>Ziel</dt><dd>${ziel && zielProjekt ? `<a href="${routeRaum(zielProjekt.kurz, ziel.raum.id)}">${esc(zielProjekt.kurz)} · ${esc(ziel.raum.id)} ${esc(ziel.raum.name)}</a><small>${esc(ziel.etage.name)}</small>` : esc(z.titel || z.id)}</dd></div></dl>
      </section>
      <section class="flaeche"><h2>Fristen</h2>
        ${l.fristen.length ? `<ul class="fristen-kompakt">${l.fristen.map((f) => { const a = abstand(f.at, ctx.at); return `<li><span><b>${esc(f.name)}</b><small>${esc(person(f.rolle).rolle)}</small></span><span class="mono">${zeit(f.at)}</span><span>${chip(f.status, f.ton)}<small class="${a.vorbei ? 'vorbei' : ''}">${a.text}</small></span></li>`; }).join('')}</ul>` : '<p class="leer-zeile">Keine Fristen hinterlegt.</p>'}
        <p class="klein">Ein Termin dokumentiert keine ausgelöste Bestellung. Die Plattform ändert keine Frist automatisch.</p>
      </section>
      <section class="flaeche"><h2>Zuständig</h2>
        <dl class="werte">${[['Entscheidung', 'planung'], ['Aufmaß und Nachweise', 'montage'], ['Fachprüfung', 'fach']].map(([t, key]) => `<div><dt>${t}</dt><dd><b>${esc(person(key).name)}</b> · ${esc(person(key).stelle)}</dd></div>`).join('')}</dl>
      </section>
      <section class="flaeche"><h2>Verlauf</h2>
        ${verlauf.length ? `<ol class="verlauf">${verlauf.map((v) => `<li><span class="mono">${zeit(v.at, false)}</span><p>${esc(v.text)}<small>${esc(person(v.von).rolle)} · ${esc(person(v.von).name)} · Simulation, nichts versendet</small></p></li>`).join('')}</ol>` : `<p class="leer-zeile">Angelegt ${zeit(e.angelegt)}. Noch keine Schritte vermerkt.</p>`}
      </section>
    </aside>
  </div>`;
}

function tuerTeil(ctx, e, l, k) {
  const { R } = ctx; const r = l.r; const req = l.req; const m = ctx.ezustand[k]?.aufmass || R.emptyMeasurement();
  const fe = r.fieldErrors || {};
  const befundTon = r.width.kind === 'met' ? 'ok' : r.width.kind === 'missed' ? 'crit' : 'warn';
  const feld = (id, label, inner, key) => `<div class="feld ${fe[key] ? 'feld-fehler' : ''}"><label for="${id}">${label}</label>${inner}${fe[key] ? `<p class="feld-meldung" id="${id}-f">${esc(fe[key])}</p>` : ''}</div>`;
  const optionen = [req.reference, 'lichte Breite', 'Türblattmaß', R.NOT_GIVEN];
  const opts = (liste, wert) => liste.map((o) => `<option ${o === wert ? 'selected' : ''}>${esc(o)}</option>`).join('');
  const d = (name) => `data-aufmass="${esc(k)}" data-feld="${name}"`;
  return `<section class="flaeche"><div class="block-kopf"><h2>Anforderungen am Zielort</h2><span class="leise">Quelle: ${esc(req.origin)}</span></div>
    <div class="tabelle-rahmen"><table class="einfach anforderungen"><thead><tr><th scope="col">Kriterium</th><th scope="col">Soll</th><th scope="col">Ist</th><th scope="col">Befund</th><th scope="col">Prüfweg</th></tr></thead><tbody>
      <tr><td><b>Breite Rohbauöffnung ${esc(l.z.id)}</b><small>${esc(req.measuringPoint)}</small></td><td class="mono nw">${req.minMm}–${req.maxMm} mm</td><td class="mono">${esc(r.istText)}</td><td>${chip(r.width.text, befundTon)}</td><td>Regel</td></tr>
      ${R.OTHER_CHECKS.map((c) => `<tr><td><b>${esc(c)}</b></td><td>laut Fachprüfung</td><td>nicht bewertet</td><td>${chip('offen', 'neutral')}</td><td>Fachprüfung</td></tr>`).join('')}
    </tbody></table></div>
    ${massskala(r, req, m)}
    <p class="klein">${esc(R.TEXT.widthNote)} Das Türblattmaß aus dem Bauteilpass zählt nicht als Aufmaß der Zielöffnung.</p></section>
  <section class="flaeche"><div class="block-kopf"><h2>Aufmaß Zielöffnung ${esc(l.z.id)}</h2><span class="leise">Eingabe, wirkt ab dem Eingangszeitpunkt</span></div>
    <div class="formular">
      ${feld('t-wert', 'Wert in mm', `<input id="t-wert" ${d('valueText')} inputmode="decimal" value="${esc(m.valueText)}">`, 'valueText')}
      ${feld('t-bezug', 'Messbezug', `<select id="t-bezug" ${d('reference')}>${opts(optionen, m.reference)}</select>`, 'reference')}
      ${feld('t-status', 'Messstatus', `<select id="t-status" ${d('status')}>${opts(R.STATUS_OPTIONS, m.status)}</select>`, 'status')}
      ${feld('t-quelle', 'Belegquelle', `<input id="t-quelle" ${d('source')} value="${esc(m.source)}" placeholder="z. B. Aufmaßnotiz">`, 'source')}
      ${feld('t-datum', 'Messdatum', `<input id="t-datum" type="date" ${d('measuredOn')} value="${esc(m.measuredOn)}">`, 'measuredOn')}
      ${feld('t-eingang', 'Eingang bei der Planung', `<input id="t-eingang" type="datetime-local" ${d('receivedAt')} value="${esc(m.receivedAt)}">`, 'receivedAt')}
    </div>
    <div class="formular-aktionen">
      <button type="button" class="knopf-zweit" id="btn-aufmass-beispiel" data-action="aufmass-beispiel" data-entscheidung="${esc(k)}">Beispielaufmaß einsetzen</button>
      <button type="button" class="knopf-leise" id="btn-aufmass-leeren" data-action="aufmass-leeren" data-entscheidung="${esc(k)}">Aufmaß leeren</button>
      <span class="leise">Beispiel: ${req.target === 'B-02' ? '890' : String(Math.round((req.minMm + req.maxMm) / 2))} mm, gemessen, Eingang ${req.target === 'B-02' ? '18.11. 15:00' : 'zur Projektzeit'}.</span>
    </div></section>`;
}

function massskala(r, req, m) {
  const min = req.minMm - 25, max = req.maxMm + 25, W = 600;
  const x = (v) => 20 + ((v - min) / (max - min)) * (W - 40);
  const wert = r.usable ? Number(String(m.valueText).replace(',', '.')) : null;
  const ticks = [min, req.minMm - 10, req.minMm, (req.minMm + req.maxMm) / 2, req.maxMm, req.maxMm + 10, max];
  const xi = wert === null ? null : x(Math.min(Math.max(wert, min), max));
  return `<div class="skala"><svg viewBox="0 0 ${W} 74" role="img" aria-label="Maßskala: Soll ${req.minMm} bis ${req.maxMm} Millimeter${wert ? `, Ist ${wert} Millimeter` : ', Ist noch nicht verwertbar'}">
    <line x1="20" x2="${W - 20}" y1="34" y2="34" class="sk-achse"/><rect x="${x(req.minMm)}" y="22" width="${x(req.maxMm) - x(req.minMm)}" height="24" class="sk-soll"/>
    ${ticks.map((t) => `<line x1="${x(t)}" x2="${x(t)}" y1="30" y2="38" class="sk-achse"/><text x="${x(t)}" y="62" text-anchor="middle" class="sk-tick ${t === req.minMm || t === req.maxMm ? 'sk-tick-b' : ''}">${t}</text>`).join('')}
    <text x="${(x(req.minMm) + x(req.maxMm)) / 2}" y="16" text-anchor="middle" class="sk-tick sk-tick-b">Soll</text>
    ${xi !== null ? `<g class="sk-ist ${r.width.kind === 'met' ? 't-ok' : 't-crit'}"><path d="M${xi} 50 l-6 10 h12 z"/><line x1="${xi}" x2="${xi}" y1="18" y2="50"/></g>` : ''}
  </svg><p class="skala-legende"><span><i class="sk-soll-i"></i>Sollbereich, Grenzen eingeschlossen</span><span>${wert !== null ? `Ist <b class="mono">${esc(String(m.valueText))} mm</b>` : 'Ist erscheint, sobald ein verwertbares Aufmaß vorliegt'}</span></p></div>`;
}

function bodenTeil(ctx, e, l, k) {
  const r = l.r; const z = l.z; const b = l.b; const zs = ctx.ezustand[k] || {};
  const quote = Math.max(0, Math.min(1, (r.verwendbar ?? 0) / b.menge));
  const bedarfAnteil = Math.min(1, r.bedarfM2 / b.menge);
  const roh = zs.beschaedigtRoh ?? String(b.werte?.beschaedigt?.wert ?? '');
  const knopf = (key, titel, am) => (am
    ? `<div class="nachweis-zeile"><span><b>${titel}</b><small>eingegangen ${zeit(am)}</small></span><button type="button" class="knopf-leise" id="btn-${key}" data-action="boden-nachweis" data-entscheidung="${esc(k)}" data-key="${key}">Eingang zurücknehmen</button></div>`
    : `<div class="nachweis-zeile"><span><b>${titel}</b><small>fehlt</small></span><button type="button" class="knopf-zweit" id="btn-${key}" data-action="boden-nachweis" data-entscheidung="${esc(k)}" data-key="${key}">Eingang zur Projektzeit vermerken</button></div>`);
  return `<section class="flaeche"><div class="block-kopf"><h2>Anforderungen am Zielort</h2><span class="leise">Quelle: ${esc(z.herkunft)}</span></div>
    <div class="tabelle-rahmen"><table class="einfach anforderungen"><thead><tr><th scope="col">Kriterium</th><th scope="col">Soll</th><th scope="col">Ist</th><th scope="col">Befund</th><th scope="col">Prüfweg</th></tr></thead>
      <tbody>${r.kriterien.map((x) => `<tr><td><b>${esc(x.name)}</b></td><td class="zahlen">${esc(x.soll)}</td><td>${esc(x.ist)}</td><td>${chip(x.befund, x.ton)}</td><td>${esc(x.weg)}</td></tr>`).join('')}</tbody></table></div>
    <div class="mengen"><div class="mengen-balken" role="img" aria-label="Menge: ${b.menge} Quadratmeter erfasst, ${r.verwendbar === null ? 'verwendbare Menge unbekannt' : `${r.verwendbar} verwendbar`}, Bedarf mit Reserve ${r.bedarfM2}">
      <i class="mb-verwendbar ${r.kriterien[1].ton === 'crit' ? 't-crit' : ''}" style="width:${quote * 100}%"></i><span class="mb-bedarf" style="left:${bedarfAnteil * 100}%"></span></div>
      <p class="skala-legende"><span><i class="mb-i-v"></i>verwendbar ${r.verwendbar === null ? '–' : `<b class="mono">${String(r.verwendbar).replace('.', ',')} m²</b>`} von <span class="mono">${b.menge} m²</span></span><span><i class="mb-i-b"></i>Bedarf mit Reserve <b class="mono">${String(r.bedarfM2).replace('.', ',')} m²</b></span></p></div>
    <p class="klein">Der Befund bewertet Rastermaß, Menge (Grenze eingeschlossen) und die Aufbauhöhe laut Nachweis. Über die Eignung entscheiden die zuständigen Fachleute.</p></section>
  <section class="flaeche"><div class="block-kopf"><h2>Bestand und Nachweise</h2><span class="leise">Eingabe</span></div>
    <div class="formular"><div class="feld ${r.beschaedigtGueltig ? '' : 'feld-fehler'}"><label for="b-schaden">Beschädigte Fläche in m² (Stichprobe, hochgerechnet)</label>
      <input id="b-schaden" data-schaden="${esc(k)}" inputmode="decimal" value="${esc(roh)}" ${r.beschaedigtGueltig ? '' : 'aria-invalid="true" aria-describedby="b-schaden-f"'}>
      ${r.beschaedigtGueltig ? '' : `<p class="feld-meldung" id="b-schaden-f">${esc(r.beschaedigtFehler)}</p>`}</div></div>
    ${knopf('hoeheAm', 'Herstellerangabe Stützen (Verstellbereich)', r.hoehe)}
    ${knopf('lastAm', 'Nachweis Tragfähigkeit', r.last)}
    <p class="klein">Ein Eingang zählt erst ab seiner Projektzeit. Wer die Projektzeit zurückstellt, sieht den Stand davor.</p></section>`;
}

function einfachTeil(ctx, e, l) {
  const b = l.b; const z = l.z; const g = GRUPPEN[b.gruppe];
  return `<section class="flaeche"><div class="block-kopf"><h2>Abgleich mit dem Bedarf</h2><span class="leise">Quelle: ${esc(z.herkunft)}</span></div>
    <dl class="werte"><div><dt>Bedarf</dt><dd><b>${esc(z.titel)}</b>${z.menge ? ` · ${z.menge} ${esc(z.einheit)}` : ''}${z.text ? `<small>${esc(z.text)}</small>` : ''}</dd></div>
    <div><dt>Angebot</dt><dd><b>${esc(b.name)}</b> · ${esc(String(b.menge).replace('.', ','))} ${esc(g.einheit)}</dd></div></dl>
    <div class="tabelle-rahmen"><table class="einfach"><thead><tr><th scope="col">Angabe</th><th scope="col" class="r">Wert</th><th scope="col">Status</th></tr></thead>
      <tbody>${(g.felder || []).map((f) => { const w = b.werte?.[f.key] || { status: 'fehlt' }; return `<tr><td>${esc(f.label)}</td><td class="r mono">${esc(wertText(f, w))}</td><td>${chip(w.status === 'bestaetigt' ? 'bestätigt' : w.status, w.status === 'gemessen' ? 'ok' : w.status === 'fehlt' ? 'crit' : w.status === 'vorgeschlagen' ? 'sim' : 'info')}</td></tr>`; }).join('')}</tbody></table></div>
    <p class="klein">Für diesen Abgleich gibt es noch keine geprüfte Regel. Die Plattform zeigt fehlende Angaben und den nächsten Schritt, bewertet aber keine Eignung.</p></section>`;
}

export { icon, minuten };
