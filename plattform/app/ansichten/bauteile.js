// Bauteilbestand je Projekt und Bauteilpass.
import { GRUPPEN, STATUS, WERTSTATUS, ZUSTAND } from '../daten.js';
import { esc, chip, wertChip, statusChip, icon, leer, slug, routePass, routeRaum, routeEntscheidung, person, bauteilRef, tonMarke, tonSymbol, routeAbgleich, ergebnisChip, pchip, gruppenChip } from '../ui.js';
import { naechsteHandlung, offeneNachweise, bauteilStatus, entscheidungFuer, moeglicheZiele, wertText, lage } from '../regeln.js';
import { zeit, datum, abstand } from '../zeit.js';
import { projektKopf, raumVon } from './projekte.js';
import { abgleichListe, zuordnungZumBedarf } from '../abgleich.js';
import { uebergebenerVorgang } from '../vorgang.js';

const werteZaehlung = (b) => {
  const z = { gemessen: 0, bestaetigt: 0, vorgeschlagen: 0, fehlt: 0 };
  for (const f of GRUPPEN[b.gruppe].felder || []) z[b.werte?.[f.key]?.status || 'fehlt'] += 1;
  return z;
};
export const verfuegbarText = (b) => (b.status === 'nicht' ? 'nicht verfügbar' : b.ziel ? 'bleibt am Ort' : b.verfuegbarAb ? `ab ${datum(b.verfuegbarAb + 'T00:00')}${b.verfuegbarBis ? ` bis ${datum(b.verfuegbarBis + 'T00:00')}` : ''}` : 'offen');

// ---------- Bestand ----------
export function bestand(ctx, p) {
  const f = ctx.ui.bestand;
  const q = f.q.trim().toLowerCase();
  const alle = ctx.daten.bauteile.filter((b) => b.projekt === p.kurz);
  const etagen = (p.gebaeude?.[0]?.etagen || []).map((e) => e.id);
  const liste = alle.filter((b) => {
    const r = raumVon(p, b.raum);
    const text = `${b.id} ${b.name} ${GRUPPEN[b.gruppe].name} ${b.raum} ${r?.raum.name || ''}`.toLowerCase();
    return (!q || text.includes(q)) && (!f.gruppe || b.gruppe === f.gruppe) && (!f.status || bauteilStatus(ctx, b) === f.status)
      && (!f.etage || b.etage === f.etage) && (!f.offen || offeneNachweise(ctx, b).length) && (!f.mobil || b.erfassung?.art === 'Mobile Erfassung');
  });
  const aktiv = f.q || f.gruppe || f.status || f.etage || f.offen || f.mobil;
  const sel = (id, label, opts, wert) => `<label class="filter"><span>${label}</span><select id="${id}"><option value="">Alle</option>${opts.map(([v, t]) => `<option value="${esc(v)}" ${v === wert ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>`;
  const gruppen = [...new Set(alle.map((b) => b.gruppe))];
  return `${projektKopf(ctx, p, 'bestand')}
  <div class="werkzeugleiste" role="group" aria-label="Bestand durchsuchen und filtern">
    <label class="filter filter-suche"><span>Suche</span><span class="suchfeld">${icon('suche')}<input id="bestand-q" type="search" value="${esc(f.q)}" placeholder="ID, Bauteil oder Raum" autocomplete="off"></span></label>
    ${sel('f-gruppe', 'Gruppe', gruppen.map((g) => [g, GRUPPEN[g].name]), f.gruppe)}
    ${sel('f-status', 'Status', Object.entries(STATUS).map(([k, s]) => [k, s.label]), f.status)}
    ${sel('f-etage', 'Etage', etagen.map((e) => [e, e]), f.etage)}
    <label class="schalter"><input type="checkbox" id="f-offen" ${f.offen ? 'checked' : ''}><span>nur mit offenen Nachweisen</span></label>
    <label class="schalter"><input type="checkbox" id="f-mobil" ${f.mobil ? 'checked' : ''}><span>nur mobil erfasst</span></label>
    <span class="treffer">${liste.length} von ${alle.length}</span>
    ${aktiv ? '<button type="button" class="knopf-leise" id="btn-filter-reset" data-action="bestand-reset">Filter zurücksetzen</button>' : ''}
  </div>
  ${liste.length ? `<div class="tabelle-rahmen"><table class="bestand">
    <thead><tr><th scope="col">Bauteil</th><th scope="col">Raum</th><th scope="col" class="r">Menge</th><th scope="col">Angaben</th><th scope="col">Zustand</th><th scope="col">Verfügbar</th><th scope="col">Status</th><th scope="col">Nächste Handlung</th></tr></thead>
    <tbody>${liste.map((b) => zeile(ctx, p, b)).join('')}</tbody></table></div>
    <p class="hinweis-zeile">Angaben: Status je Wert der Bauteilgruppe. Zustand nach Sichtprüfung: ${Object.entries(ZUSTAND).map(([k, t]) => `<b>${k}</b> ${esc(t)}`).join(' · ')}. Skala des Entwurfs, keine Norm.</p>`
    : leer(alle.length ? 'Kein Bauteil passt zu Suche und Filtern.' : 'Noch keine Bauteile erfasst.', alle.length ? 'Filter zurücksetzen oder anders suchen.' : 'Bauteile entstehen über die Erfassung vor Ort.', alle.length ? '<button type="button" class="knopf" data-action="bestand-reset">Filter zurücksetzen</button>' : `<a class="knopf" href="#erfassung">${icon('kamera')} Bauteil erfassen</a>`)}`;
}

function zeile(ctx, p, b) {
  const z = werteZaehlung(b); const n = naechsteHandlung(ctx, b); const r = raumVon(p, b.raum);
  const gesamt = Object.values(z).reduce((a, c) => a + c, 0) || 1;
  const neu = ctx.ui.zuletzt === `${b.projekt}:${b.id}`;
  return `<tr data-href="${routePass(b)}" class="${neu ? 'neu-erfasst' : ''}">
    <td><div class="bt-name">${bauteilRef(p, b)}<span><a href="${routePass(b)}"><b>${esc(b.name)}</b></a><small>${esc(GRUPPEN[b.gruppe].name)} · ${esc(GRUPPEN[b.gruppe].typ)}${b.erfassung?.art === 'Mobile Erfassung' ? ' · mobil erfasst' : ''}</small>${neu ? chip('gerade erfasst', 'ok') : ''}</span></div></td>
    <td><span class="mono">${esc(b.raum)}</span><small>${esc(r?.raum.name || '')}</small></td>
    <td class="r mono">${esc(String(b.menge).replace('.', ','))} ${esc(GRUPPEN[b.gruppe].einheit)}</td>
    <td><span class="wertbalken" title="${Object.entries(z).filter(([, v]) => v).map(([k, v]) => `${v} ${WERTSTATUS[k].label}`).join(', ')}">${Object.entries(z).filter(([, v]) => v).map(([k, v]) => `<i class="ws-${k}" style="flex:${v / gesamt}"></i>`).join('')}</span><small>${Object.entries(z).filter(([, v]) => v).map(([k, v]) => `${v} ${WERTSTATUS[k].label}`).join(' · ')}</small></td>
    <td>${b.zustand ? `<span class="zustand z-${b.zustand}" title="${esc(ZUSTAND[b.zustand])}">${esc(b.zustand)}</span>` : '<span class="leise">–</span>'}</td>
    <td>${esc(verfuegbarText(b))}</td>
    <td>${statusChip(bauteilStatus(ctx, b))}</td>
    <td><div class="bt-schritt">${tonMarke(n.ton)}<span>${esc(n.text)}${n.frist ? `<small>${esc(n.fristName || 'Frist')} ${zeit(n.frist, false)}</small>` : ''}</span></div></td>
  </tr>`;
}

// ---------- Bauteilpass ----------
export function pass(ctx, p, b) {
  const g = GRUPPEN[b.gruppe]; const s = bauteilStatus(ctx, b); const n = naechsteHandlung(ctx, b);
  const offen = offeneNachweise(ctx, b); const e = entscheidungFuer(ctx, b); const r = raumVon(p, b.raum);
  // Ziel zählt nur, wenn es wählbar ist: Bedarfe, die der Abgleich ausschließt („zu spät“, „Klärung nötig“), nicht.
  const ziele = e ? null : moeglicheZiele(ctx, b);
  const hatZiel = Boolean(ziele && (ziele.oeffnungen.length || ziele.bedarfe.some((d) => zuordnungZumBedarf(ctx, b, d).moeglich)));
  const nurGesperrt = Boolean(ziele && !hatZiel && ziele.bedarfe.length);
  const verlauf = [...(b.verlauf || []), ...ctx.ereignisse.filter((x) => x.bauteil === `${b.projekt}:${b.id}`)]
    .filter((v) => v.at <= ctx.at).sort((x, y) => (x.at < y.at ? 1 : -1));
  const a = n.frist ? abstand(n.frist, ctx.at) : null;
  const paare = b.status === 'nicht' || b.ziel ? [] : abgleichListe(ctx, { bauteil: b });
  return `
  <nav class="pfad" aria-label="Pfad"><a href="#bauteile">Bauteile</a><span aria-hidden="true">/</span><a href="#bestand-${slug(p.kurz)}">Bestand ${esc(p.kurz)}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(b.id)}</span></nav>
  <section class="seitenkopf pass-kopf">
    <div>
      <p class="eyebrow">Bauteilpass · ${esc(g.name)} · ${esc(g.typ)}</p>
      <h1>${bauteilRef(p, b)} ${esc(b.name)}</h1>
      <p class="unter">${statusChip(s)} <span>${esc(b.erfassung?.art || 'Erfassung')} ${b.erfassung?.am ? zeit(b.erfassung.am) : ''} von ${esc(person(b.erfassung?.von).name)}</span>${b.erfassung?.erkennung ? chip('Vorschläge aus simulierter Erkennung', 'sim') : ''}</p>
    </div>
  </section>
  <div class="pass-raster">
    <div class="pass-haupt">
      <section class="flaeche handlung t-${n.ton}" aria-labelledby="h-handlung">
        <p class="label">${tonSymbol(n.ton)}Nächste Handlung</p>
        <h2 id="h-handlung" tabindex="-1">${esc(n.text)}</h2>
        <p class="ergebnis-rolle">${n.rolle ? `${esc(person(n.rolle).rolle)} · ${esc(person(n.rolle).name)}` : ''}${n.frist ? ` · ${esc(n.fristName || 'Frist')} ${zeit(n.frist)} <span class="${a.vorbei ? 'vorbei' : ''}">(${a.text})</span>` : ''}</p>
        ${n.grund ? `<p class="ergebnis-grund">${esc(n.grund)}</p>` : ''}
        <div class="ergebnis-aktionen">${e ? `<a class="knopf" href="${routeEntscheidung(e)}">Entscheidung ${esc(e.id)} öffnen</a>` : n.aktion === 'zuordnen' && hatZiel ? '<button type="button" class="knopf" data-action="zum-ziel">Ziel zuordnen</button>' : n.aktion === 'zuordnen' ? (nurGesperrt ? '<p class="leise">Zurzeit ist kein Ziel zuordenbar: Der Abgleich schließt die vorhandenen Bedarfe aus. Die Gründe stehen unten unter „Ziel zuordnen“.</p>' : '<p class="leise">Noch kein freies Ziel dieser Bauteilgruppe. Ein passender Bedarf oder eine Zielöffnung muss zuerst angelegt werden.</p>') : ''}</div>
      </section>
      <section class="flaeche steckbrief" aria-labelledby="h-steck">
        <h2 id="h-steck" class="sr">Steckbrief</h2>
        <div class="skizze">${b.foto?.daten ? `<img src="${esc(b.foto.daten)}" alt="Foto von ${esc(b.id)} aus der mobilen Erfassung">` : b.foto?.nichtGespeichert ? '<div class="skizze-leer"><small>Foto wurde wegen Speicherplatz nicht im Browser gespeichert.</small></div>' : skizze(b)}</div>
        <dl class="werte">
          <div><dt>Menge</dt><dd class="mono">${esc(String(b.menge).replace('.', ','))} ${esc(g.einheit)}${b.mengeQuelle ? ` <small>${esc(b.mengeQuelle)}</small>` : ''}</dd></div>
          <div><dt>Raum</dt><dd><a href="${routeRaum(p.kurz, b.raum)}">${esc(b.raum)} ${esc(r?.raum.name || '')}</a>${(b.bereich || []).length > 1 ? ` <small>verteilt auf ${esc(b.bereich.join(', '))}</small>` : ''}<small>${esc(r?.gebaeude.name || '')} · ${esc(r?.etage.name || b.etage)}</small></dd></div>
          <div><dt>Zustand</dt><dd>${b.zustand ? `<span class="zustand z-${b.zustand}">${esc(b.zustand)}</span> ${esc(ZUSTAND[b.zustand])}${b.zustandText ? `: ${esc(b.zustandText)}` : ''}` : 'nicht angegeben'}</dd></div>
          <div><dt>Verfügbarkeit</dt><dd>${esc(verfuegbarText(b))}${b.grund ? `<small>${esc(b.grund)}</small>` : ''}</dd></div>
          <div><dt>Hersteller</dt><dd>${esc(b.hersteller)}</dd></div>
          <div><dt>Baujahr</dt><dd>${esc(b.baujahr)}</dd></div>
          <div><dt>Quelle</dt><dd>${esc(b.erfassung?.art || '')}${b.erfassung?.am ? ` am ${zeit(b.erfassung.am)}` : ''}</dd></div>
        </dl>
      </section>
      ${b.status === 'nicht' ? '' : `<section class="flaeche" aria-labelledby="h-passend">
        <div class="block-kopf"><h2 id="h-passend">Bedarfe derselben Gruppe</h2><span class="leise"><b>${paare.length}</b> ${paare.length === 1 ? 'Bedarf' : 'Bedarfe'}, davon <b>${paare.filter((a) => a.gesamt.key === 'weiter' || a.gesamt.key === 'knapp').length}</b> prüfbar · Vorschlag zur Prüfung, keine Freigabe</span></div>
        ${paare.length ? `<ul class="paarliste">${paare.map((x) => `<li><a class="paar" href="${routeAbgleich(x.schluessel)}"><span class="paar-kopf">${ergebnisChip(x.gesamt)}<span class="bref">${pchip(ctx.daten.projekte.find((q) => q.kurz === x.bedarf.projekt) || { kurz: x.bedarf.projekt, farbe: '#55605b', name: '' })}<span class="mono">${esc(x.bedarf.id)}</span></span></span><b>${esc(x.bedarf.titel)}</b><small>${esc(x.gruende[0] || '')}</small></a></li>`).join('')}</ul>`
          : `<p class="leer-zeile">${b.ziel ? `Das Bauteil hat bereits ein festes Ziel (${esc(b.ziel)}).` : e ? `Für dieses Bauteil läuft bereits der Vorgang ${esc(e.id)}.` : 'Kein offener Bedarf derselben Bauteilgruppe, für den dieses Bauteil in Frage kommt.'}</p>`}
      </section>`}
      <section class="flaeche" aria-labelledby="h-werte">
        <div class="block-kopf"><h2 id="h-werte">Angaben</h2><span class="leise">${Object.entries(WERTSTATUS).map(([k, v]) => `${wertChip(k)}`).join(' ')}</span></div>
        <div class="tabelle-rahmen"><table class="einfach">
          <thead><tr><th scope="col">Angabe</th><th scope="col" class="r">Wert</th><th scope="col">Status</th><th scope="col">Quelle</th></tr></thead>
          <tbody>${(g.felder || []).map((f) => { const w = b.werte?.[f.key] || { status: 'fehlt' }; return `<tr><td>${esc(f.label)}${f.bezug ? `<small>Bezug: ${esc(f.bezug)}</small>` : ''}${f.hinweis ? `<small>${esc(f.hinweis)}</small>` : ''}</td><td class="r mono">${esc(wertText(f, w))}</td><td>${wertChip(w.status)}</td><td>${esc(w.quelle || '–')}</td></tr>`; }).join('')}</tbody>
        </table></div>
        <p class="klein">Die Türregel wertet Maße nur, wenn sie gemessen sind. Die Bodenregel (Entwurf) nimmt gemessene oder von einer Person bestätigte Werte. Vorschläge zählen nie. Ein bestätigter Vorschlag ist geprüft, aber nicht gemessen.</p>
      </section>
      <section class="flaeche" aria-labelledby="h-nachweise">
        <div class="block-kopf"><h2 id="h-nachweise">Quellen und Nachweise</h2></div>
        ${(b.nachweise || []).length ? `<ul class="nachweise">${b.nachweise.map((x) => `<li><span class="n-art">${esc(x.art)}</span><span class="n-titel"><b>${esc(x.titel)}</b><small>${x.datum ? datum(x.datum) : 'noch kein Eingang'} · ${esc(person(x.von).rolle)}</small></span>${chip(x.stand, x.ton)}</li>`).join('')}</ul>` : '<p class="leer-zeile">Noch keine Quellen oder Nachweise hinterlegt.</p>'}
      </section>
      <section class="flaeche" aria-labelledby="h-rueckbau">
        <div class="block-kopf"><h2 id="h-rueckbau">Rückbau und Schadstoffe</h2></div>
        <dl class="werte zwei">${(b.rueckbau || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      </section>
    </div>
    <aside class="pass-seite">
      ${zuordnung(ctx, p, b, e)}
      <section class="flaeche" aria-labelledby="h-offen">
        <div class="block-kopf"><h2 id="h-offen">Offene Nachweise</h2><em class="zaehler">${offen.length}</em></div>
        ${offen.length ? `<ul class="offen-liste">${offen.map((o) => `<li><b>${esc(o.text)}</b><small>${esc(person(o.rolle).rolle)} · ${esc(person(o.rolle).name)}${o.frist ? ` · bis ${zeit(o.frist)}` : ''}</small></li>`).join('')}</ul>` : '<p class="leer-zeile">Keine offenen Nachweise.</p>'}
      </section>
      <section class="flaeche" aria-labelledby="h-verlauf">
        <h2 id="h-verlauf">Verlauf</h2>
        <ol class="verlauf">${verlauf.map((v) => `<li><span class="mono">${zeit(v.at, false)}</span><p>${esc(v.text)}<small>${esc(person(v.von).rolle)} · ${esc(person(v.von).name)}${v.sim ? ' · Simulation, nichts versendet' : ''}</small></p></li>`).join('')}</ol>
      </section>
    </aside>
  </div>`;
}

function zuordnung(ctx, p, b, e) {
  if (e) {
    const l = lage(ctx, e); const z = l.z;
    return `<section class="flaeche verknuepft" id="zuordnung" aria-labelledby="h-zu">
      <h2 id="h-zu">Zuordnung</h2>
      <p>${e.ziel.art === 'zieloeffnung' ? `Zielöffnung <b>${esc(z.id)}</b> in Raum ${esc(z.raum)}, Soll ${z.minMm}–${z.maxMm} mm` : `Bedarf <b>${esc((e.ziel.projekt || e.projekt))} · ${esc(z.id)}</b>: ${esc(z.titel)}`}</p>
      <p>${chip(l.regelText, l.geprueft ? 'ok' : 'neutral')}${l.r?.deckung ? ` ${chip(l.r.deckung.label, l.r.deckung.ton)}` : ''}</p>
      <a class="knopf" href="${routeEntscheidung(e)}">Entscheidung ${esc(e.id)} öffnen</a>
    </section>`;
  }
  if (b.status === 'nicht' || b.status === 'vorgemerkt') return '';
  const fertig = uebergebenerVorgang(ctx, b.projekt, b.id);
  if (fertig) {
    return `<section class="flaeche verknuepft" id="zuordnung" aria-labelledby="h-zu">
      <h2 id="h-zu">Abgeschlossen</h2>
      <p>Das Bauteil wurde übergeben (Vorgang ${esc(fertig.id)}, Simulation, laut Eintrag). Es wird keinem weiteren Ziel zugeordnet.</p>
      <a class="knopf-zweit" href="${routeEntscheidung(fertig)}">Vorgang ${esc(fertig.id)} ansehen</a>
    </section>`;
  }
  const { oeffnungen, bedarfe } = moeglicheZiele(ctx, b);
  const fehler = ctx.ui.zuordnungFehler;
  const key = `${b.projekt}:${b.id}`;
  const gewaehlt = ctx.ui.zielWahl?.fuer === key ? ctx.ui.zielWahl.wert : '';
  const opt = (wert, text, gesperrt = false) => `<option value="${esc(wert)}" ${wert === gewaehlt && !gesperrt ? 'selected' : ''} ${gesperrt ? 'disabled' : ''}>${text}</option>`;
  // Gesperrte Bedarfe bleiben sichtbar, ihr Grund steht direkt am Feld (mit Link zum Abgleich), nicht erst nach dem Klick.
  const bewertet = bedarfe.map((d) => ({ d, z: zuordnungZumBedarf(ctx, b, d) }));
  const gesperrt = bewertet.filter((x) => !x.z.moeglich);
  const waehlbar = oeffnungen.length + bewertet.length - gesperrt.length;
  const sperrSatz = gesperrt.length ? `Nicht wählbar: ${gesperrt.map(({ d, z }) => `<a href="${routeAbgleich(z.ergebnis.schluessel)}">${esc(d.projekt)} · ${esc(d.id)}</a> (${esc(z.ergebnis.gesamt.label)})`).join(', ')}. Der Abgleich schließt ${gesperrt.length === 1 ? 'diesen Bedarf' : 'diese Bedarfe'} aus, der Link zeigt den Grund.` : '';
  const beschrieben = [gesperrt.length ? 'ziel-hinweis' : '', fehler ? 'ziel-fehler' : ''].filter(Boolean).join(' ');
  return `<section class="flaeche zuordnung" id="zuordnung" aria-labelledby="h-zu">
    <h2 id="h-zu">Ziel zuordnen</h2>
    <p class="leise">Ein Bauteil geht an eine Zielöffnung im Projekt oder an einen Bedarf in der Region. Daraus entsteht eine Entscheidung mit Fristen und nächstem Schritt.</p>
    ${!(oeffnungen.length || bedarfe.length) ? '<p class="leer-zeile">Kein freies Ziel dieser Bauteilgruppe vorhanden.</p>'
    : !waehlbar ? `<p class="leer-zeile" id="ziel-hinweis">Zurzeit ist kein Ziel zuordenbar. ${sperrSatz}</p>`
    : `<div class="feld"><label for="ziel-wahl">Ziel</label><select id="ziel-wahl" data-bauteil="${esc(key)}" ${fehler ? 'aria-invalid="true"' : ''} ${beschrieben ? `aria-describedby="${beschrieben}"` : ''}><option value="">Bitte wählen</option>
      ${oeffnungen.length ? `<optgroup label="Zielöffnungen im Projekt ${esc(p.kurz)}">${oeffnungen.map((z) => opt(`zieloeffnung|${z.projekt}|${z.id}`, `${esc(z.id)} · Raum ${esc(z.raum)} · Soll ${z.minMm}–${z.maxMm} mm`)).join('')}</optgroup>` : ''}
      ${bewertet.length ? `<optgroup label="Bedarfe">${bewertet.map(({ d, z }) => opt(`bedarf|${d.projekt}|${d.id}`, `${esc(d.projekt)} · ${esc(d.id)} · ${esc(d.titel)} · Abgleich: ${esc(z.ergebnis.gesamt.label)}`, !z.moeglich)).join('')}</optgroup>` : ''}
    </select>${sperrSatz ? `<p class="feld-hinweis" id="ziel-hinweis">${sperrSatz}</p>` : ''}${fehler ? `<p class="feld-meldung" id="ziel-fehler">${esc(fehler)}</p>` : ''}</div>
    <button type="button" class="knopf" id="btn-zuordnen" data-action="zuordnen" data-bauteil="${esc(b.projekt)}:${esc(b.id)}">Zuordnen und Entscheidung anlegen</button>`}
  </section>`;
}

// Schematische Ansicht je Bauteilgruppe, wenn kein Foto vorliegt.
function skizze(b) {
  if (b.gruppe === 'tuer') {
    const br = b.werte?.breite?.wert ? `${b.werte.breite.wert} mm` : 'Breite offen';
    const ho = b.werte?.hoehe?.wert ? `${b.werte.hoehe.wert} mm` : 'Höhe offen';
    return `<svg viewBox="0 0 240 244" role="img" aria-label="Schematische Ansicht des Türblatts, ${esc(br)} breit, ${esc(ho)} hoch">
      <rect x="52" y="22" width="96" height="190" class="sk-zarge"/><rect x="58" y="28" width="84" height="184" class="sk-blatt"/><circle cx="132" cy="122" r="3.5" class="sk-linie-f"/>
      <line x1="58" y1="226" x2="142" y2="226" class="sk-mass"/><line x1="58" y1="220" x2="58" y2="232" class="sk-mass"/><line x1="142" y1="220" x2="142" y2="232" class="sk-mass"/>
      <text x="100" y="240" text-anchor="middle" class="sk-text">${esc(br)}</text>
      <line x1="168" y1="28" x2="168" y2="212" class="sk-mass"/><line x1="162" y1="28" x2="174" y2="28" class="sk-mass"/><line x1="162" y1="212" x2="174" y2="212" class="sk-mass"/>
      <text x="176" y="124" class="sk-text">${esc(ho)}</text><text x="10" y="14" class="sk-klein">Ansicht Türblatt, schematisch</text></svg>`;
  }
  if (b.gruppe === 'boden') {
    const zellen = []; for (let r = 0; r < 5; r += 1) for (let c = 0; c < 6; c += 1) zellen.push(`<rect x="${20 + c * 30}" y="${30 + r * 30}" width="28" height="28" class="${(r === 1 && c === 4) || (r === 3 && c === 1) ? 'sk-schaden' : 'sk-platte'}"/>`);
    return `<svg viewBox="0 0 220 240" role="img" aria-label="Schematische Draufsicht Doppelboden, Kantenschäden markiert"><text x="10" y="18" class="sk-klein">Draufsicht Raster, schematisch</text>${zellen.join('')}
      <rect x="110" y="200" width="12" height="12" class="sk-schaden"/><text x="128" y="210" class="sk-klein">Kantenschaden</text></svg>`;
  }
  return `<div class="skizze-leer"><span class="mono">${esc(b.id)}</span><small>Kein Foto und keine Skizze</small></div>`;
}

