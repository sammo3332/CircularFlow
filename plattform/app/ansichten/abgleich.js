// Abgleich: Liste aller Paare und die erklärte Prüfung eines Paares. Der Knopf „Prüfbitte anlegen“ (oder sein Sperrgrund) steht hier; angelegt wird in main.js.
import { GRUPPEN, ZUSTAND } from '../daten.js';
import { abgleich, abgleichListe, reserveText, ERGEBNIS, ERGEBNIS_REIHENFOLGE, HINWEIS_ABGLEICH, lueckeText } from '../abgleich.js';
import { offeneNachweise } from '../regeln.js';
import { esc, chip, icon, leer, pchip, gruppenChip, seitenkopf, person, routeBedarf, routePass, routeAbgleich, routeEntscheidung, ergebnisChip, tagText, tonSymbol } from '../ui.js';
import { zeit } from '../zeit.js';
import { verfuegbarText } from './bauteile.js';
import { bedarfeReiter, bestellfristVon, mengeBedarf } from './bedarfe.js';
import { interesseKnopf, routeAnfrageNeu } from './anfragen.js';
import { mengeText } from './katalog.js';

export const VORSCHLAG = 'Vorschlag zur Prüfung, keine fachliche Freigabe';
const projektVon = (ctx, kurz) => ctx.daten.projekte.find((p) => p.kurz === kurz) || { kurz, farbe: '#55605b', name: kurz };
const tagOderFehlt = (d) => (d ? `<span class="mono">${tagText(d)}</span>` : chip('fehlt', 'info'));
const tageText = (n) => `${n} ${n === 1 ? 'Tag' : 'Tage'}`;

function kurz(ctx, a) {
  const z = a.zeit;
  if (a.gesamt.key === 'weiter' || a.gesamt.key === 'knapp') return `Reserve ${reserveText(z.reserveTage)}${z.lagertage ? `, Zwischenlager ${tageText(z.lagertage)}` : ''}`;
  if (a.gesamt.key === 'spaet' && z.reserveTage !== null) return `Reserve ${reserveText(z.reserveTage)}`;
  return a.gruende[0] || '';
}

export function abgleichListeSeite(ctx) {
  const f = ctx.ui.abgleich.ergebnis;
  const alle = abgleichListe(ctx);
  const liste = f ? alle.filter((a) => a.gesamt.key === f) : alle;
  const zahl = (k) => alle.filter((a) => a.gesamt.key === k).length;
  const pruefbar = zahl('weiter') + zahl('knapp');
  return `${seitenkopf({ titel: 'Paare derselben Gruppe', untertitel: `Angebote und Bedarfe derselben Bauteilgruppe, geprüft nach Typ, Menge und Zeit. ${VORSCHLAG}.` })}
  <p class="zahlenzeile" id="paare-zahlen"><b class="mono">${alle.length}</b> ${alle.length === 1 ? 'Paar' : 'Paare'} derselben Gruppe, davon <b class="mono">${pruefbar}</b> prüfbar (weiter prüfen oder knapp). Die übrigen sind zu spät, unvollständig oder klärungsbedürftig.</p>
  ${bedarfeReiter('abgleich')}
  <div class="filterleiste" role="group" aria-label="Nach Ergebnis filtern">
    <button type="button" class="filterchip" aria-pressed="${!f}" data-action="abgleich-filter" data-wert="">Alle ${alle.length}</button>
    ${ERGEBNIS_REIHENFOLGE.map((k) => `<button type="button" class="filterchip" aria-pressed="${f === k}" data-action="abgleich-filter" data-wert="${k}">${esc(ERGEBNIS[k].label)} ${zahl(k)}</button>`).join('')}
  </div>
  ${liste.length ? `<div class="tabelle-rahmen"><table class="tab-karten paare-tab">
    <thead><tr><th scope="col">Ergebnis</th><th scope="col">Angebot</th><th scope="col">Bedarf</th><th scope="col">Zeit und Menge</th><th scope="col">Entfernung</th></tr></thead>
    <tbody>${liste.map((a) => `<tr data-href="${routeAbgleich(a.schluessel)}">
      <td data-label="Ergebnis">${ergebnisChip(a.gesamt)}</td>
      <td data-label="Angebot"><div class="bt-name"><span class="bref">${pchip(projektVon(ctx, a.bauteil.projekt))}<span class="mono">${esc(a.bauteil.id)}</span></span><span><a href="${routeAbgleich(a.schluessel)}"><b>${esc(a.bauteil.name)}</b></a><small>${esc(mengeText(a.bauteil))} · ${esc(verfuegbarText(a.bauteil))}</small></span></div></td>
      <td data-label="Bedarf"><div class="bt-name"><span class="bref">${pchip(projektVon(ctx, a.bedarf.projekt))}<span class="mono">${esc(a.bedarf.id)}</span></span><span><b>${esc(a.bedarf.titel)}</b><small>${esc(mengeBedarf(a.bedarf))}${bestellfristVon(a.bedarf) ? ` · Bestellfrist ${tagText(bestellfristVon(a.bedarf))}` : ''}</small></span></div></td>
      <td data-label="Zeit und Menge">${esc(kurz(ctx, a))}<small>${esc(a.menge.status === 'teilweise' ? `Menge: ${lueckeText(a.menge).replace(/^Es/, 'es').replace(/\.$/, '')}` : a.menge.status === 'gedeckt' ? 'Menge gedeckt' : a.menge.status === 'fehlt' ? 'Menge fehlt' : '')}</small></td>
      <td data-label="Entfernung">${esc(a.entfernung.text)}</td></tr>`).join('')}</tbody></table></div>
    <p class="hinweis-zeile">${esc(HINWEIS_ABGLEICH)} Bauteile und Bedarfe mit laufendem Vorgang erscheinen hier nicht.</p>`
    : leer('Kein Paar in diesem Ergebnis.', alle.length ? 'Anderes Ergebnis wählen.' : 'Es gibt derzeit keine Kombination aus freiem Angebot und offenem Bedarf.', alle.length ? '<button type="button" class="knopf" data-action="abgleich-filter" data-wert="">Alle Paare zeigen</button>' : '')}`;
}

function angebotKarte(ctx, a) {
  const b = a.bauteil; const p = projektVon(ctx, b.projekt); const offen = offeneNachweise(ctx, b).length;
  return `<section class="flaeche paar-spalte" aria-labelledby="h-ab-angebot"><p class="label">Angebot</p>
    <h2 id="h-ab-angebot">${pchip(p)} <span class="mono">${esc(b.id)}</span> ${esc(b.name)}</h2>
    <dl class="werte">
      <div><dt>Projekt</dt><dd>${esc(p.name)}<small>${esc(p.bezirk || '')} · Lage symbolisch</small></dd></div>
      <div><dt>Gruppe</dt><dd>${gruppenChip(b.gruppe, GRUPPEN[b.gruppe].name)}</dd></div>
      <div><dt>Menge</dt><dd class="mono">${esc(mengeText(b))}</dd></div>
      <div><dt>Zustand</dt><dd>${b.zustand ? `<span class="zustand z-${b.zustand}">${esc(b.zustand)}</span> ${esc(ZUSTAND[b.zustand])}` : 'nicht angegeben'}</dd></div>
      <div><dt>Verfügbar</dt><dd>${esc(verfuegbarText(b))}</dd></div>
      <div><dt>Erfasst</dt><dd>${b.erfassung?.am ? zeit(b.erfassung.am) : '–'}</dd></div>
      <div><dt>Offene Nachweise</dt><dd class="mono">${offen}</dd></div>
    </dl><a class="knopf-zweit" href="${routePass(b)}">Bauteilakte öffnen</a></section>`;
}

function bedarfKarte(ctx, a) {
  const d = a.bedarf; const p = projektVon(ctx, d.projekt); const g = (k) => (d.belegt?.[k] === 'geschaetzt' ? ` ${chip('geschätzt', 'warn')}` : '');
  const fenster = d.annahmeVon && d.annahmeBis ? `${tagText(d.annahmeVon)} bis ${tagText(d.annahmeBis)}` : '';
  return `<section class="flaeche paar-spalte" aria-labelledby="h-ab-bedarf"><p class="label">Bedarf</p>
    <h2 id="h-ab-bedarf">${pchip(p)} <span class="mono">${esc(d.id)}</span> ${esc(d.titel)}</h2>
    <dl class="werte">
      <div><dt>Projekt</dt><dd>${esc(p.name)}<small>${esc(p.bezirk || '')} · Lage symbolisch</small></dd></div>
      <div><dt>Gruppe</dt><dd>${gruppenChip(d.gruppe, GRUPPEN[d.gruppe].name)}</dd></div>
      <div><dt>Menge</dt><dd class="mono">${esc(mengeBedarf(d))}</dd></div>
      <div><dt>Bestellfrist</dt><dd>${tagOderFehlt(bestellfristVon(d))}${g('bestellfrist')}</dd></div>
      <div><dt>Mindestprüfzeit</dt><dd>${d.pruefzeitTage !== undefined && d.pruefzeitTage !== null && d.pruefzeitTage !== '' ? `<span class="mono">${esc(d.pruefzeitTage)} Tage</span>${g('pruefzeitTage')}` : chip('fehlt', 'info')}</dd></div>
      <div><dt>Annahmefenster</dt><dd>${fenster ? `<span class="mono">${fenster}</span>${g('annahme')}` : chip('fehlt', 'info')}</dd></div>
      <div><dt>Anforderungen</dt><dd>${d.anforderungen ? esc(d.anforderungen) : d.text ? esc(d.text) : '<span class="leise">keine angegeben</span>'}</dd></div>
      <div><dt>Zuständig</dt><dd>${d.zustaendig ? esc(person(d.zustaendig).rolle) : '<span class="leise">nicht festgelegt</span>'}</dd></div>
    </dl><a class="knopf-zweit" href="${routeBedarf(d)}">Bedarf öffnen</a></section>`;
}

const MENGE_CHIP = { gedeckt: ['Gedeckt', 'ok'], teilweise: ['Teilweise gedeckt', 'warn'], fehlt: ['Menge fehlt', 'info'], offen: ['Deckung offen', 'info'] };

export function abgleichSeite(ctx, bauteil, bedarf) {
  const a = abgleich(ctx, bauteil, bedarf); const z = a.zeit;
  const zeitBefund = ERGEBNIS[z.status] || a.gesamt;
  const [mLabel, mTon] = MENGE_CHIP[a.menge.status] || ['–', 'neutral'];
  const reihe = (name, wert) => `<tr><th scope="row">${name}</th><td>${wert}</td></tr>`;
  return `${seitenkopf({
    pfad: [['#bedarfe', 'Bedarfe'], ['#abgleich', 'Paare derselben Gruppe']], aktuell: `${a.bauteil.id} → ${a.bedarf.id}`,
    eyebrow: 'Abgleich · Angebot und Bedarf', titel: `<span class="mono">${esc(a.bauteil.id)}</span> und <span class="mono">${esc(a.bedarf.id)}</span>: ${esc(a.gesamt.label)}`,
    untertitel: `${ergebnisChip(a.gesamt)} ${chip(VORSCHLAG, 'sim')} <span>Stichtag der Demo ${zeit(ctx.at)} (Simulation)</span>`,
  })}
  <section class="flaeche ergebnis-kopf" aria-labelledby="h-ab-ergebnis">
    <p class="label">Ergebnis</p>
    <h2 id="h-ab-ergebnis" tabindex="-1">${tonSymbol(a.gesamt.ton)}${esc(a.gesamt.label)}</h2>
    <p class="ergebnis-rolle">${VORSCHLAG}. ${esc(a.hinweis)} ${chip('regelbasiert, keine KI', 'sim')}</p>
    <ul class="gruende">${a.gruende.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    <div class="naechster"><p class="label">Nächster Schritt · ${esc(person(a.naechsterSchritt.rolle).rolle)}</p><p><b>${esc(a.naechsterSchritt.text)}</b>${a.naechsterSchritt.vorgang ? ` <a href="${routeEntscheidung(a.naechsterSchritt.vorgang)}">Vorgang ${esc(a.naechsterSchritt.vorgang.id)} öffnen</a>` : ''}</p></div>
    <div class="ergebnis-aktionen">
      <button type="button" class="knopf" id="btn-pruefbitte" data-action="pruefbitte-anlegen" data-key="${esc(a.schluessel)}" ${a.pruefbitteMoeglich ? '' : 'aria-disabled="true" aria-describedby="pruefbitte-grund"'}>${icon('flagge')} Prüfbitte anlegen</button>
      ${a.pruefbitteMoeglich ? '<span class="leise">Legt einen Vorgang an und bittet die Fachprüfung um Eignungsprüfung. Simulation, es wird nichts versendet.</span>' : `<span class="sperrgrund" id="pruefbitte-grund" tabindex="-1">${tonSymbol('warn')}<span><b>Gesperrt.</b> ${esc(a.sperrgrund)}</span></span>`}
      <a class="knopf-zweit" id="btn-anfrage-vorbereiten" href="${routeAnfrageNeu(a.bauteil, a.bedarf)}">Prüf- oder Logistikanfrage vorbereiten</a>
    </div>
    ${interesseKnopf(ctx, a.bauteil, a.bedarf)}
  </section>
  <div class="zweispaltig paar">${angebotKarte(ctx, a)}${bedarfKarte(ctx, a)}</div>
  <section class="flaeche" aria-labelledby="h-ab-pruefung">
    <div class="block-kopf"><h2 id="h-ab-pruefung">Erklärte Prüfung</h2><span class="leise">Typ, Menge, Zeit und Entfernung nacheinander</span></div>
    <div class="tabelle-rahmen"><table class="einfach pruef-tab"><thead><tr><th scope="col">Prüfung</th><th scope="col">Befund</th><th scope="col">Erklärung</th></tr></thead><tbody>
      <tr><th scope="row">Typ</th><td>${chip(a.typ.ok ? 'Passt' : 'Widerspruch', a.typ.ok ? 'ok' : 'warn')}</td><td>${esc(a.typ.text)}</td></tr>
      <tr><th scope="row">Menge</th><td>${chip(mLabel, mTon)}</td><td>${esc(a.menge.text)}<small>Quelle: ${esc(a.menge.quelle)}. Keine Umrechnung zwischen Einheiten.</small></td></tr>
      <tr><th scope="row">Zeit</th><td>${chip(zeitBefund.label, zeitBefund.ton)}</td><td>${z.gruende.length ? `<ul class="gruende">${z.gruende.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : 'Kein Zeitergebnis.'}</td></tr>
      <tr><th scope="row">Übergabe und Lager</th><td>${z.uebergabe ? (z.lagertage === null ? chip('Lager offen', 'info') : chip(z.lagertage ? `${tageText(z.lagertage)} Lager` : 'ohne Zwischenlager', z.lagertage ? 'warn' : 'ok')) : chip('offen', 'info')}</td><td>${z.uebergabe ? `Frühester Übergabetag ${tagText(z.uebergabe.fruehestens)}${z.status === 'spaet' ? (z.uebergabe.bis ? `; das Annahmefenster endet am ${tagText(z.uebergabe.bis)}. Zu spät für diese Entscheidung.` : '.') : `; Übergabe möglich von ${tagText(z.uebergabe.von)} bis ${tagText(z.uebergabe.bis)}.`}` : 'Noch nicht berechenbar, weil Angaben fehlen.'}</td></tr>
      <tr><th scope="row">Entfernung</th><td>${chip('ohne Einfluss', 'neutral')}</td><td>${esc(a.entfernung.text)}<small>Luftlinie zwischen den symbolischen Projektlagen. Sie beeinflusst das Ergebnis nicht.</small></td></tr>
    </tbody></table></div>
  </section>
  <div class="zweispaltig">
    <section class="flaeche" aria-labelledby="h-ab-rechnung">
      <h2 id="h-ab-rechnung">Zeitrechnung</h2>
      <table class="einfach rechnung"><tbody>
        ${reihe('Stichtag der Demo (Simulation)', `<span class="mono">${tagText(z.stichtag)}</span>`)}
        ${reihe('Prüfbeginn', `<span class="mono">${tagText(z.pruefbeginn)}</span><small>spätester Tag aus Stichtag, Erfassung des Angebots und Anlage des Bedarfs: ${esc(z.pruefbeginnQuelle)}</small>`)}
        ${reihe('Mindestprüfzeit', z.pruefzeitTage !== null ? `<span class="mono">${tageText(z.pruefzeitTage)}</span>${z.geschaetzt.includes('Mindestprüfzeit') ? ` ${chip('geschätzt', 'warn')}` : ''}` : chip('fehlt', 'info'))}
        ${reihe('Prüfende', tagOderFehlt(z.pruefende))}
        ${reihe('Bestellfrist', `${tagOderFehlt(z.bestellfrist)}${z.geschaetzt.includes('Bestellfrist') ? ` ${chip('geschätzt', 'warn')}` : ''}`)}
        ${reihe('Reserve bis zur Bestellfrist', z.reserveBestellung !== null ? `<span class="mono">${esc(reserveText(z.reserveBestellung))}</span>` : '<span class="leise">nicht berechenbar</span>')}
        ${reihe('Verfügbar', `${z.verfuegbarAb ? `<span class="mono">ab ${tagText(z.verfuegbarAb)}</span>` : chip('fehlt', 'info')}${z.verfuegbarBis ? ` <span class="mono">bis ${tagText(z.verfuegbarBis)}</span>` : ''}`)}
        ${reihe('Annahmefenster', z.annahmeVon && z.annahmeBis ? `<span class="mono">${tagText(z.annahmeVon)} bis ${tagText(z.annahmeBis)}</span>${z.geschaetzt.includes('Annahmefenster') ? ` ${chip('geschätzt', 'warn')}` : ''}` : chip('fehlt', 'info'))}
        ${reihe('Reserve im Annahmefenster', z.reserveAnnahme !== null ? `<span class="mono">${esc(reserveText(z.reserveAnnahme))}</span>` : '<span class="leise">nicht berechenbar</span>')}
      </tbody></table>
      <p class="klein">Kalendertage, Berliner Zeit. Ein Grenztag zählt als rechtzeitig. Mindestprüfzeiten im Beispiel sind Annahmen.</p>
    </section>
    <div class="spalte">
      <section class="flaeche" aria-labelledby="h-ab-fehlt">
        <h2 id="h-ab-fehlt">Fehlende und geschätzte Angaben</h2>
        ${a.fehlend.length ? `<p class="label">Fehlt</p><ul class="einfache-liste">${a.fehlend.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : '<p class="leer-zeile">Nichts fehlt.</p>'}
        ${z.geschaetzt.length ? `<p class="label">Geschätzt</p><ul class="einfache-liste">${z.geschaetzt.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        ${a.fehlend.length || z.geschaetzt.length ? `<p class="klein">Ergänzen oder bestätigen Sie die Angaben im <a href="${routeBedarf(a.bedarf)}">Bedarf</a> oder im <a href="${routePass(a.bauteil)}">Bauteilpass</a>.</p>` : ''}
      </section>
      <section class="flaeche" aria-labelledby="h-ab-punkte">
        <h2 id="h-ab-punkte">Prüfpunkte</h2>
        ${a.pruefpunkte.length ? `<ul class="pruefpunkte">${a.pruefpunkte.map((x) => `<li><span>${esc(x.text)}</span><small>${esc(person(x.rolle).rolle)}</small></li>`).join('')}</ul>` : `<p class="leer-zeile">${a.typ.ok ? 'Keine Prüfpunkte.' : 'Keine Prüfpunkte, weil Angebot und Bedarf nicht zur selben Bauteilgruppe und Einheit gehören.'}</p>`}
      </section>
    </div>
  </div>`;
}
