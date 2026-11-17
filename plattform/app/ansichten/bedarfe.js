// Bedarfe: Liste und Detail. Erfassen und Ergänzen stehen in bedarfform.js.
import { GRUPPEN } from '../daten.js';
import { abgleichListe, lueckeText, pruefbitteFrist, FRIST_PRUEFBITTE } from '../abgleich.js';
import { fehlendeZeitangaben } from '../bedarf.js';
import { bedarfBelegt, bedarfBelegtArt, bedarfVorgang, vorgangStatus } from '../vorgang.js';
import { esc, chip, icon, leer, pchip, gruppenChip, seitenkopf, person, routeBedarf, routeAbgleich, routeEntscheidung, tagText, ergebnisChip, tonMarke } from '../ui.js';
import { verfuegbarText } from './bauteile.js';

export const bestellfristVon = (d) => d.bestellfrist ?? d.fristen?.ersatz?.slice(0, 10) ?? null;
export const mengeBedarf = (d) => (d.bedarfM2 !== undefined ? `${String(d.bedarfM2).replace('.', ',')} m²` : d.menge ? `${String(d.menge).replace('.', ',')} ${d.einheit || GRUPPEN[d.gruppe].einheit}` : 'fehlt');
const markierung = (d, key) => (d.belegt?.[key] === 'geschaetzt' ? ` ${chip('geschätzt', 'warn')}` : d.belegt?.[key] === 'belegt' ? ' <small class="inline">belegt</small>' : '');
const fenster = (d) => (d.annahmeVon && d.annahmeBis ? `${tagText(d.annahmeVon)} bis ${tagText(d.annahmeBis)}` : d.annahmeVon || d.annahmeBis ? `${d.annahmeVon ? `ab ${tagText(d.annahmeVon)}` : `bis ${tagText(d.annahmeBis)}`} (unvollständig)` : '');

// Beschriftung für einen belegten Bedarf (Fachregel: vorgang.bedarfBelegtArt).
export const belegtText = (ctx, d) => (bedarfBelegtArt(ctx, d.projekt, d.id) === 'uebergeben' ? 'übergeben, gedeckt' : 'im Vorgang');

export function bedarfeEintraege(ctx) {
  const f = ctx.ui.bedarfe;
  return ctx.daten.bedarfe.filter((d) => (!f.gruppe || d.gruppe === f.gruppe) && (!f.projekt || d.projekt === f.projekt) && (!f.offen || !bedarfBelegt(ctx, d.projekt, d.id)))
    .sort((a, b) => (bestellfristVon(a) || '9').localeCompare(bestellfristVon(b) || '9') || a.projekt.localeCompare(b.projekt) || a.id.localeCompare(b.id));
}

function zeile(ctx, d) {
  const p = ctx.daten.projekte.find((x) => x.kurz === d.projekt);
  const fehlt = fehlendeZeitangaben(d); const liste = abgleichListe(ctx, { bedarf: d }); const n = liste.length; const np = liste.filter((a) => a.gesamt.key === 'weiter' || a.gesamt.key === 'knapp').length; const belegt = bedarfBelegt(ctx, d.projekt, d.id);
  return `<tr data-href="${routeBedarf(d)}">
    <td data-label="Bedarf"><div class="bt-name"><span class="bref">${p ? pchip(p) : esc(d.projekt)}<span class="mono">${esc(d.id)}</span></span><span><a href="${routeBedarf(d)}"><b>${esc(d.titel)}</b></a><small>${gruppenChip(d.gruppe, GRUPPEN[d.gruppe].name)}</small></span></div></td>
    <td data-label="Menge" class="r mono">${esc(mengeBedarf(d))}</td>
    <td data-label="Bestellfrist">${bestellfristVon(d) ? `<span class="mono">${tagText(bestellfristVon(d))}</span>${markierung(d, 'bestellfrist')}` : chip('fehlt', 'info')}</td>
    <td data-label="Annahmefenster">${fenster(d) ? `<span class="mono">${fenster(d)}</span>${markierung(d, 'annahme')}` : chip('fehlt', 'info')}</td>
    <td data-label="Zeitangaben">${fehlt.length ? chip(`${fehlt.length} von 4 fehlen`, 'info', ` title="${esc(fehlt.join(', '))}"`) : chip('vollständig', 'ok')}${fehlt.length ? `<small>${esc(fehlt.join(', '))}</small>` : ''}</td>
    <td data-label="Angebote derselben Gruppe (davon prüfbar)" class="r mono">${belegt ? chip(belegtText(ctx, d), 'info') : `<b>${n}</b> <small>davon <b>${np}</b> prüfbar</small>`}</td>
  </tr>`;
}

export function bedarfe(ctx) {
  const f = ctx.ui.bedarfe;
  const liste = bedarfeEintraege(ctx);
  const gruppen = [...new Set(ctx.daten.bedarfe.map((d) => d.gruppe))];
  const projekte = [...new Set(ctx.daten.bedarfe.map((d) => d.projekt))];
  const sel = (id, label, opts, wert) => `<label class="filter"><span>${label}</span><select id="${id}"><option value="">Alle</option>${opts.map(([v, t]) => `<option value="${esc(v)}" ${v === wert ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>`;
  const aktiv = f.gruppe || f.projekt || f.offen;
  return `${seitenkopf({
    titel: 'Bedarfe', untertitel: 'Was Projekte suchen, bis wann sie bestellen müssen und wann sie Bauteile annehmen können.',
    aktionen: `<a class="knopf" href="#bedarf-neu" id="btn-bedarf-neu">${icon('plus')} Bedarf erfassen</a>`,
  })}
  ${bedarfeReiter('bedarfe')}
  <div class="werkzeugleiste" role="group" aria-label="Bedarfe filtern">
    ${sel('bed-gruppe', 'Gruppe', gruppen.map((g) => [g, GRUPPEN[g].name]), f.gruppe)}
    ${sel('bed-projekt', 'Projekt', projekte.map((k) => [k, `${k} · ${ctx.daten.projekte.find((p) => p.kurz === k)?.name || ''}`]), f.projekt)}
    <label class="schalter"><input type="checkbox" id="bed-offen" ${f.offen ? 'checked' : ''}><span>nur offene Bedarfe (ohne laufenden Vorgang)</span></label>
    <span class="treffer" role="status">${liste.length} von ${ctx.daten.bedarfe.length}</span>
    ${aktiv ? '<button type="button" class="knopf-leise" id="bed-reset" data-action="bedarfe-reset">Filter zurücksetzen</button>' : ''}
  </div>
  ${liste.length ? `<div class="tabelle-rahmen"><table class="tab-karten bedarfe-tab">
    <thead><tr><th scope="col">Bedarf</th><th scope="col" class="r">Menge</th><th scope="col">Bestellfrist</th><th scope="col">Annahmefenster</th><th scope="col">Zeitangaben</th><th scope="col" class="r">Angebote derselben Gruppe<small>davon prüfbar</small></th></tr></thead>
    <tbody>${liste.map((d) => zeile(ctx, d)).join('')}</tbody></table></div>
    <p class="hinweis-zeile">Sortiert nach Bestellfrist. Fehlende Zeitangaben machen den Abgleich unvollständig („Angaben fehlen“). Geschätzte Angaben sind gekennzeichnet.</p>`
    : leer('Kein Bedarf passt zu den Filtern.', 'Filter zurücksetzen oder einen Bedarf erfassen.', '<button type="button" class="knopf" data-action="bedarfe-reset">Filter zurücksetzen</button>')}`;
}

// Reiter im Bereich „Bedarfe“.
export function bedarfeReiter(aktiv) {
  return `<nav class="reiter" aria-label="Bedarfe">${[['bedarfe', '#bedarfe', 'Bedarfe'], ['abgleich', '#abgleich', 'Paare derselben Gruppe']].map(([k, h, t]) => `<a href="${h}" ${aktiv === k ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</nav>`;
}

const angabe = (k, v) => `<div><dt>${k}</dt><dd>${v}</dd></div>`;
const fehltChip = () => chip('fehlt', 'info');

// Zeile „Prüfbitte spätestens“ (Regel: abgleich.pruefbitteFrist). „verstrichen“: der Tag liegt vor dem Stichtag (Tag von ctx.at).
// Fehlen Angaben oder widersprechen sie sich, steht „nicht berechenbar“ mit dem Grund anstelle des Datums.
function pruefbitteAngabe(ctx, d) {
  const f = pruefbitteFrist(d);
  if (f.status !== 'ok') return angabe(FRIST_PRUEFBITTE, `${chip('nicht berechenbar', f.status === 'klaerung' ? 'warn' : 'info')}<small>${esc(f.text)}</small>`);
  const verstrichen = f.tag < String(ctx.at).slice(0, 10);
  return angabe(FRIST_PRUEFBITTE, `<span class="mono">${tagText(f.tag)}</span>${f.geschaetzt.length ? ` ${chip('geschätzt', 'warn')}` : ''}${verstrichen ? ` ${chip('verstrichen', 'crit')}` : ''}<small>${esc(f.text)}</small>`
    + `${verstrichen ? '' : '<small>In den 7 Tagen davor steht sie unter „Zeitkritisch“, solange ein Angebot prüfbar ist und kein Vorgang läuft.</small>'}`);
}

export function bedarfDetail(ctx, d) {
  const p = ctx.daten.projekte.find((x) => x.kurz === d.projekt); const g = GRUPPEN[d.gruppe];
  const fehlt = fehlendeZeitangaben(d); const paare = abgleichListe(ctx, { bedarf: d }); const e = bedarfVorgang(ctx, d.projekt, d.id);
  const boden = d.bedarfM2 !== undefined;
  return `${seitenkopf({
    pfad: [['#bedarfe', 'Bedarfe']], aktuell: d.id,
    eyebrow: `Bedarf · ${g.name}`, titel: `${p ? pchip(p) : ''} <span class="mono">${esc(d.id)}</span> ${esc(d.titel)}`,
    untertitel: `${esc(mengeBedarf(d))} ${fehlt.length ? chip(`${fehlt.length} Zeitangabe${fehlt.length === 1 ? '' : 'n'} fehlen`, 'info') : chip('Zeitangaben vollständig', 'ok')} ${d.neu ? chip('Eigene Eingabe', 'sim') : ''}${d.ergaenzt ? chip('ergänzt in diesem Browser', 'sim') : ''}`,
    aktionen: `<button type="button" class="knopf-zweit" id="btn-bedarf-ergaenzen" data-action="bedarf-ergaenzen" data-projekt="${esc(d.projekt)}" data-bedarf="${esc(d.id)}">${icon('plus')} ${fehlt.length ? 'Bedarf ergänzen' : 'Angaben ändern'}</button>`,
  })}
  <div class="zweispaltig">
    <section class="flaeche" aria-labelledby="h-bd-angaben">
      <h2 id="h-bd-angaben">Angaben</h2>
      <dl class="werte werte-breit">
        ${angabe('Projekt', p ? `<a href="#projekt-${esc(p.kurz.toLowerCase())}">${esc(p.kurz)} · ${esc(p.name)}</a><small>${esc(p.bezirk)} · Lage symbolisch</small>` : esc(d.projekt))}
        ${angabe('Bauteilgruppe', gruppenChip(d.gruppe, g.name))}
        ${angabe('Menge', `<span class="mono">${esc(mengeBedarf(d))}</span>${boden ? `<small>Bedarf ${esc(String(d.bedarfM2).replace('.', ','))} m² mit ${d.reserveProzent} % Reserve</small>` : ''}`)}
        ${d.raeume?.length ? angabe('Räume', `${esc(d.raeume.join(', '))}${d.etage ? `<small>${esc(d.etage)}</small>` : ''}`) : ''}
        ${angabe('Bestellfrist', bestellfristVon(d) ? `<span class="mono">${tagText(bestellfristVon(d))}</span>${markierung(d, 'bestellfrist')}${boden && !d.bestellfrist ? '<small>Frist der Ersatzentscheidung</small>' : ''}` : fehltChip())}
        ${angabe('Mindestprüfzeit', d.pruefzeitTage !== undefined && d.pruefzeitTage !== null && d.pruefzeitTage !== '' ? `<span class="mono">${esc(d.pruefzeitTage)} Tage</span>${markierung(d, 'pruefzeitTage')}` : fehltChip())}
        ${angabe('Annahmefenster', fenster(d) ? `<span class="mono">${fenster(d)}</span>${markierung(d, 'annahme')}` : fehltChip())}
        ${pruefbitteAngabe(ctx, d)}
        ${angabe('Anforderungen', d.anforderungen ? `${esc(d.anforderungen)}<small>Freitext, nicht maschinell bewertet</small>` : d.text ? esc(d.text) : '<span class="leise">keine angegeben</span>')}
        ${angabe('Zuständig', d.zustaendig ? `${esc(person(d.zustaendig).rolle)}` : '<span class="leise">nicht festgelegt</span>')}
        ${angabe('Angelegt', d.angelegt ? `<span class="mono">${tagText(d.angelegt)}</span>` : '<span class="leise">Beispieldaten</span>')}
        ${angabe('Herkunft', esc(d.herkunft || ''))}
      </dl>
      ${fehlt.length ? `<div class="ergebnisbox"><p><b>Für den Abgleich fehlt:</b> ${esc(fehlt.join(', '))}.</p><p class="leise">Ohne diese Angaben zeigt der Abgleich „Angaben fehlen“, sofern nicht schon etwas sicher zu spät ist.</p></div>` : ''}
    </section>
    <section class="flaeche" aria-labelledby="h-bd-angebote">
      <div class="block-kopf"><h2 id="h-bd-angebote">Angebote derselben Gruppe</h2><span class="leise"><b>${paare.length}</b> ${paare.length === 1 ? 'Angebot' : 'Angebote'}, davon <b>${paare.filter((a) => a.gesamt.key === 'weiter' || a.gesamt.key === 'knapp').length}</b> prüfbar (weiter prüfen oder knapp)</span></div>
      ${e ? `<p class="hinweisbox">Dieser Bedarf ${vorgangStatus(ctx, e).key === 'uebergeben' ? 'ist durch die Übergabe im Vorgang' : 'gehört zum laufenden Vorgang'} <a href="${routeEntscheidung(e)}">${esc(e.projekt)} · ${esc(e.id)}</a> (Bauteil ${esc(e.bauteil)}) ${vorgangStatus(ctx, e).key === 'uebergeben' ? 'gedeckt. Weitere Angebote werden nicht mehr vorgeschlagen.' : 'belegt. Weitere Angebote sind erst nach dessen Ende möglich.'}</p>` : ''}
      ${paare.length ? `<ul class="paarliste">${paare.map((a) => `<li><a class="paar" href="${routeAbgleich(a.schluessel)}">
        <span class="paar-kopf">${ergebnisChip(a.gesamt)}<span class="bref">${pchip(ctx.daten.projekte.find((x) => x.kurz === a.bauteil.projekt) || { kurz: a.bauteil.projekt, farbe: '#555', name: '' })}<span class="mono">${esc(a.bauteil.id)}</span></span></span>
        <b>${esc(a.bauteil.name)}</b>
        <small>${esc(a.menge.status === 'fehlt' ? 'Menge fehlt' : `${String(a.bauteil.menge).replace('.', ',')} ${esc(a.menge.einheit)}`)} · ${esc(verfuegbarText(a.bauteil))}</small>
        ${a.menge.status === 'teilweise' ? `<small class="paar-luecke t-${esc(a.menge.ton)}">${tonMarke(a.menge.ton)}${esc(lueckeText(a.menge))}</small>` : ''}
        <small>${esc(a.gruende[0] || '')}</small></a></li>`).join('')}</ul>`
        : (e ? '' : leer('Kein passendes Angebot.', 'Es gibt kein angebotenes Bauteil derselben Gruppe, das für diesen Bedarf in Frage kommt.'))}
    </section>
  </div>`;
}
