// Pilotbetrieb: Prüf- und Logistikanfragen, Dienstleister, Interesse, Angebot bearbeiten, Verkauf und Provision (nur Darstellung).
// Regeln in pilot.js. Zustand der Formulare: ctx.ui.pilot.
import { GRUPPEN, ZUSTAND } from '../daten.js';
import { esc, chip, icon, leer, slug, seitenkopf, feld, feldAttr, optionen, tonSymbol, pchip, routePass, routeBedarf, routeEntscheidung, person } from '../ui.js';
import { zeit, datum } from '../zeit.js';
import { LEISTUNGEN, ANFRAGE_STATUS, URTEIL, KOSTENTRAEGER, DIENSTLEISTER_ART, VERKAUF_STATUS, PROVISION_STATUS, HINWEIS_ANFRAGE, HINWEIS_INTERESSE, HINWEIS_PROVISION,
  anfrageStatus, findeDienstleister, waehlbareDienstleister, anfragenFuerBauteil, anfragenFuerBedarf, interessenFuerBauteil, interessenFuerBedarf, offenesInteresse, provisionsLage, letzteAenderung,
  leererAngebotEntwurf, leererDienstleisterEntwurf } from '../pilot.js';

export const routeAnfrage = (a) => `#anfrage-${slug(a.id)}`;
export const routeAnfrageNeu = (b, d = null) => `#anfrage-neu-${slug(b.projekt)}-${slug(b.id)}${d ? `--${slug(d.projekt)}-${slug(d.id)}` : ''}`;
export const ANFRAGE_FELD_ID = { leistung: 'af-leistung', bedarf: 'af-bedarf', beschreibung: 'af-beschreibung', unterlagen: 'af-unterlagen', offeneFragen: 'af-fragen', zustaendig: 'af-zustaendig', termin: 'af-termin', dienstleister: 'af-dienstleister', kostentraeger: 'af-kosten', bauteil: 'af-leistung' };
export const DIENSTLEISTER_FELD_ID = { name: 'dl-name', leistungen: 'dl-leistungen', art: 'dl-art', freigabe: 'dl-freigabe', ort: 'dl-ort', kontakt: 'dl-kontakt' };
export const ANGEBOT_FELD_ID = { menge: 'ag-menge', verfuegbarAb: 'ag-ab', verfuegbarBis: 'ag-bis', zustand: 'ag-zustand', zustandText: 'ag-notiz', status: 'ag-status', grund: 'ag-grund' };
export const SCHRITT_FELD_ID = { dienstleister: 'as-dienstleister', bestaetigt: 'as-bestaetigt', urteil: 'as-urteil', person: 'as-person', notiz: 'as-notiz', termin: 'as-termin', ort: 'as-ort', datum: 'as-datum', grund: 'as-grund', kostentraeger: 'as-kosten', kostenHinweis: 'as-kostenhinweis' };

const bauteilVon = (ctx, r) => ctx.daten.bauteile.find((b) => b.projekt === r.projekt && b.id === r.id) || null;
const bedarfVon = (ctx, r) => (r ? ctx.daten.bedarfe.find((d) => d.projekt === r.projekt && d.id === r.id) || null : null);
const projektVon = (ctx, kurz) => ctx.daten.projekte.find((p) => p.kurz === kurz) || null;
const statusChip = (a) => { const s = anfrageStatus(a); return chip(s.label || s.key, s.ton || 'neutral'); };
const dlChip = (d) => (d ? `${chip(DIENSTLEISTER_ART[d.art]?.label || d.art, DIENSTLEISTER_ART[d.art]?.ton || 'neutral')}${d.zurueckgezogen ? ` ${chip('zurückgezogen', 'crit')}` : ''}` : '');
const sicherDatum = (d) => { try { return datum(d); } catch { return '–'; } };
const regelHinweis = () => `<p class="klein">${chip('regelbasiert, keine KI', 'sim')} Status, erlaubte Schritte und Hinweise folgen festen Regeln aus den eingetragenen Angaben.</p>`;

// ---------- Liste ----------
export function anfragenSeite(ctx) {
  const alle = (ctx.daten.anfragen || []).slice().sort((x, y) => (y.geaendert > x.geaendert ? 1 : -1));
  const dl = ctx.daten.dienstleister || [];
  return `${seitenkopf({ pfad: [['#uebersicht', 'Übersicht']], aktuell: 'Anfragen', eyebrow: 'Pilotbetrieb', titel: 'Prüf- und Logistikanfragen', untertitel: 'Anfragen an Dienstleister vorbereiten und ihren Verlauf dokumentieren. Es wird nichts versendet.', aktionen: '<a class="knopf-zweit" href="#bauteile">Anfrage aus einem Bauteilpass starten</a>' })}
  <p class="hinweisbox">${tonSymbol('info')} <span>${esc(HINWEIS_ANFRAGE)}</span></p>
  ${alle.length ? `<div class="tabelle-rahmen"><table class="tab-karten"><thead><tr><th scope="col">Anfrage</th><th scope="col">Leistung</th><th scope="col">Status</th><th scope="col">Dienstleister</th><th scope="col">Zuständig · Termin</th></tr></thead>
    <tbody>${alle.map((a) => { const b = bauteilVon(ctx, a.bauteil); const p = b && projektVon(ctx, b.projekt); const d = findeDienstleister(ctx, a.dienstleister); return `<tr data-href="${routeAnfrage(a)}">
      <td data-label="Anfrage"><div class="bt-name"><span class="bref">${p ? pchip(p) : esc(a.bauteil.projekt)}<span class="mono">${esc(a.id)}</span></span><span><a href="${routeAnfrage(a)}"><b>${esc(b ? b.name : a.bauteil.id)} · ${esc(a.bauteil.id)}</b></a><small>${a.bedarf ? `Bedarf ${esc(a.bedarf.projekt)} · ${esc(a.bedarf.id)}` : 'ohne Bedarf'}</small></span></div></td>
      <td data-label="Leistung">${esc(LEISTUNGEN[a.leistung] || a.leistung)}</td>
      <td data-label="Status">${statusChip(a)}</td>
      <td data-label="Dienstleister">${d ? `${esc(d.name)} ${dlChip(d)}` : '<span class="leise">noch keiner</span>'}</td>
      <td data-label="Zuständig · Termin">${esc(a.zustaendig)}<small>benötigt bis ${sicherDatum(a.termin)}</small></td></tr>`; }).join('')}</tbody></table></div>`
    : leer('Noch keine Anfrage vorbereitet.', 'Eine Anfrage beginnt im Bauteilpass („Prüf- oder Logistikanfrage vorbereiten“) oder auf der Abgleichseite eines Paares.', '<a class="knopf" href="#bauteile">Zu den Bauteilen</a>')}
  ${regelHinweis()}
  ${dienstleisterBereich(ctx, dl)}`;
}

function dienstleisterBereich(ctx, dl) {
  const f = ctx.ui.pilot.dienstleister;
  return `<section class="flaeche" id="dienstleister" aria-labelledby="h-dl">
    <div class="block-kopf"><h2 id="h-dl">Dienstleister</h2>${f.offen ? '' : '<button type="button" class="knopf-zweit knopf-klein" id="btn-dl-neu" data-action="dl-neu">Dienstleister hinterlegen</button>'}</div>
    <p class="leise">Nur freigegebene echte Kontakte oder eindeutig gekennzeichnete Testeinträge. Es gibt keine vorbelegten Partner. Die Freigabe ist eine Selbstauskunft der eintragenden Person; ein falscher Eintrag lässt sich zurückziehen und ist dann nicht mehr wählbar.</p>
    ${dl.length ? `<ul class="kompaktliste flaeche-schraffur">${dl.map((d) => `<li><span><b>${esc(d.name)}</b> ${dlChip(d)}<small>${(d.leistungen || []).map((l) => esc(LEISTUNGEN[l] || l)).join(' · ')}${d.ort ? ` · ${esc(d.ort)}` : ''}${d.kontakt ? ` · ${esc(d.kontakt)}` : ''}${d.art === 'freigegeben' ? ` · Freigabe: ${esc(d.freigabe)}` : ''}${d.zurueckgezogen ? ` · zurückgezogen ${sicherDatum(d.zurueckgezogen)}${d.zurueckGrund ? ` (${esc(d.zurueckGrund)})` : ''}` : ''}</small></span><span><span class="mono">${esc(d.id)}</span>${d.zurueckgezogen ? '' : ` <button type="button" class="knopf-leise knopf-klein" data-action="dl-zurueck" data-dienstleister="${esc(d.id)}">Zurückziehen</button>`}</span></li>`).join('')}</ul>` : '<p class="leer-zeile">Noch kein Dienstleister hinterlegt.</p>'}
    ${f.offen ? dienstleisterFormular(ctx) : ''}
  </section>`;
}

export function dienstleisterFormular(ctx) {
  const f = ctx.ui.pilot.dienstleister; const e = f.entwurf || leererDienstleisterEntwurf(); const fe = f.fehler || {};
  const ff = (name, extra = '') => `name="${name}" data-ff="pilot-dienstleister"${extra}`;
  const fld = (id, key, label, hinweis, ctl, kl = '') => feld({ id, label, hinweis, klasse: kl, fehler: fe[key], control: ctl(feldAttr(id, fe[key], hinweis), e[key] ?? '') });
  return `<form class="vorgangsform" id="form-dienstleister" data-form="pilot-dienstleister" novalidate aria-labelledby="h-dl-form">
    <h3 id="h-dl-form">Dienstleister hinterlegen</h3>
    <div class="formular formular-eng">
      ${fld('dl-name', 'name', 'Name (Pflicht)', 'Firma oder Stelle, keine Privatpersonen.', (a, w) => `<input ${a} ${ff('name', ' maxlength="80" autocomplete="off"')} value="${esc(w)}">`)}
      ${fld('dl-ort', 'ort', 'Ort', '', (a, w) => `<input ${a} ${ff('ort', ' maxlength="80" autocomplete="off"')} value="${esc(w)}">`)}
      ${fld('dl-kontakt', 'kontakt', 'Kontakt (freiwillig)', 'Nur dienstliche Angaben, die das Team weitergeben darf.', (a, w) => `<input ${a} ${ff('kontakt', ' maxlength="160" autocomplete="off"')} value="${esc(w)}">`, 'feld-breit')}
    </div>
    <fieldset class="optionswahl ${fe.leistungen ? 'feld-fehler' : ''}" id="dl-leistungen" tabindex="-1"><legend>Leistungen (Pflicht)</legend>
      ${Object.entries(LEISTUNGEN).map(([k, t]) => `<label class="zustandschip"><input type="checkbox" ${ff(`leistung-${k}`)} ${e.leistungen?.[k] ? 'checked' : ''}><span><b>${esc(t)}</b></span></label>`).join('')}
      ${fe.leistungen ? `<p class="feld-meldung">${esc(fe.leistungen)}</p>` : ''}</fieldset>
    <fieldset class="optionswahl ${fe.art ? 'feld-fehler' : ''}" id="dl-art" tabindex="-1"><legend>Art des Eintrags (Pflicht)</legend>
      ${Object.entries(DIENSTLEISTER_ART).map(([k, t]) => `<label class="zustandschip"><input type="radio" ${ff('art', ' data-neu-zeichnen="1"')} value="${k}" ${e.art === k ? 'checked' : ''}><span><b>${esc(t.label)}</b></span></label>`).join('')}
      ${fe.art ? `<p class="feld-meldung">${esc(fe.art)}</p>` : ''}</fieldset>
    ${e.art === 'freigegeben' ? `<div class="formular formular-eng">${fld('dl-freigabe', 'freigabe', 'Freigabe des Kontakts (Pflicht)', 'Wer hat den echten Kontakt wann zur Nutzung im Pilot freigegeben?', (a, w) => `<input ${a} ${ff('freigabe', ' maxlength="120" autocomplete="off"')} value="${esc(w)}">`, 'feld-breit')}</div>` : ''}
    <div class="formular-aktionen"><button type="submit" class="knopf" id="dl-senden">Dienstleister speichern</button> <button type="button" class="knopf-leise" data-action="dl-abbrechen">Abbrechen</button></div>
  </form>`;
}

// ---------- Neue Anfrage ----------
export function anfrageFormular(ctx, b, d) {
  const f = ctx.ui.pilot.anfrage; const e = f.entwurf; const fe = f.fehler || {}; const p = projektVon(ctx, b.projekt);
  const ff = (name, extra = '') => `name="${name}" data-ff="pilot-anfrage"${extra}`;
  const fld = (id, key, label, hinweis, ctl, kl = '') => feld({ id, label, hinweis, klasse: kl, fehler: fe[key], control: ctl(feldAttr(id, fe[key], hinweis), e[key] ?? '') });
  const bedarfe = ctx.daten.bedarfe.filter((x) => x.gruppe === b.gruppe);
  const dl = waehlbareDienstleister(ctx);
  const bedarfWert = e.bedarf ? `${e.bedarf.projekt}|${e.bedarf.id}` : '';
  return `${seitenkopf({ pfad: [['#bauteile', 'Bauteile'], [routePass(b), `${b.id} Bauteilpass`]], aktuell: 'Anfrage vorbereiten', eyebrow: 'Pilotbetrieb', titel: 'Prüf- oder Logistikanfrage vorbereiten', untertitel: `${p ? pchip(p) : ''} <span class="mono">${esc(b.id)}</span> ${esc(b.name)}${d ? ` · Bedarf <span class="mono">${esc(d.id)}</span> ${esc(d.titel)}` : ''}` })}
  <p class="hinweisbox">${tonSymbol('info')} <span>${esc(HINWEIS_ANFRAGE)}</span></p>
  <form class="flaeche vorgangsform" id="form-anfrage" data-form="pilot-anfrage" novalidate aria-labelledby="h-af">
    <h2 id="h-af">Angaben zur Anfrage</h2>
    ${Object.keys(fe).length ? `<p class="feld-meldung" role="alert" id="anfrage-fehler" tabindex="-1">${Object.keys(fe).length === 1 ? 'Eine Angabe fehlt oder ist ungültig.' : `${Object.keys(fe).length} Angaben fehlen oder sind ungültig.`}</p>` : ''}
    <div class="formular formular-eng">
      ${fld('af-leistung', 'leistung', 'Gewünschte Leistung (Pflicht)', 'Fachprüfung, Ausbau, Transport, Lagerung oder Aufbereitung.', (a, w) => `<select ${a} ${ff('leistung')}>${optionen(Object.entries(LEISTUNGEN), w)}</select>`)}
      ${feld({ id: 'af-bedarf', label: 'Zugehöriger Projektbedarf', hinweis: 'Freiwillig; nur Bedarfe derselben Bauteilgruppe.', fehler: fe.bedarf, control: `<select ${feldAttr('af-bedarf', fe.bedarf)} ${ff('bedarf')}>${optionen(bedarfe.map((x) => [`${x.projekt}|${x.id}`, `${x.projekt} · ${x.id} ${x.titel}`]), bedarfWert, 'ohne Bedarf')}</select>` })}
      ${fld('af-zustaendig', 'zustaendig', 'Zuständige Person oder Rolle (Pflicht)', 'z. B. „Planung, J. Neumann“. Keine privaten Kontaktdaten.', (a, w) => `<input ${a} ${ff('zustaendig', ' maxlength="80" autocomplete="off"')} value="${esc(w)}">`)}
      ${fld('af-termin', 'termin', 'Benötigt bis (Pflicht)', 'Bis wann das Ergebnis oder die Leistung gebraucht wird.', (a, w) => `<input type="date" ${a} ${ff('termin')} value="${esc(w)}">`)}
      ${feld({ id: 'af-dienstleister', label: 'Dienstleister (kann später gewählt werden)', hinweis: dl.length ? 'Nur hinterlegte Einträge.' : 'Noch keiner hinterlegt; unter „Anfragen“ lässt sich einer anlegen.', fehler: fe.dienstleister, control: `<select ${feldAttr('af-dienstleister', fe.dienstleister)} ${ff('dienstleister')}>${optionen(dl.map((x) => [x.id, `${x.name} (${DIENSTLEISTER_ART[x.art].label})`]), e.dienstleister || '', 'noch offen')}</select>` })}
      ${fld('af-kosten', 'kostentraeger', 'Kostentragung', 'Keine automatische Verteilung. Ohne Vereinbarung bleibt sie offen.', (a, w) => `<select ${a} ${ff('kostentraeger')}>${optionen(Object.entries(KOSTENTRAEGER), w || 'offen', null)}</select>`)}
      ${fld('af-beschreibung', 'beschreibung', 'Was genau geprüft oder geleistet werden soll', '', (a, w) => `<textarea ${a} ${ff('beschreibung', ' rows="2" maxlength="400"')}>${esc(w)}</textarea>`, 'feld-breit')}
      ${fld('af-unterlagen', 'unterlagen', 'Vorhandene Unterlagen', 'z. B. Foto, Typenschild, Bestandsplan. Die Dateien selbst bleiben im Bauteilpass.', (a, w) => `<textarea ${a} ${ff('unterlagen', ' rows="2" maxlength="400"')}>${esc(w)}</textarea>`, 'feld-breit')}
      ${fld('af-fragen', 'offeneFragen', 'Offene Fragen', '', (a, w) => `<textarea ${a} ${ff('offeneFragen', ' rows="2" maxlength="400"')}>${esc(w)}</textarea>`, 'feld-breit')}
    </div>
    <div class="formular-aktionen"><button type="submit" class="knopf" id="af-senden">Anfrage speichern (nicht versenden)</button> <a class="knopf-leise" href="${routePass(b)}">Abbrechen</a></div>
  </form>`;
}

// ---------- Anfrage im Detail ----------
function schrittFormular(ctx, a, aktion, titel, intro, felder, knopf) {
  const s = ctx.ui.pilot.schritt; const fe = (s.id === a.id && s.fehler[aktion]) || {}; const werte = (s.id === a.id && s.eingabe[aktion]) || {};
  const ff = (name, extra = '') => `name="${name}" data-ff="pilot-schritt-${aktion}"${extra}`;
  const fld = (id, key, label, hinweis, ctl, kl = '') => feld({ id, label, hinweis, klasse: kl, fehler: fe[key], control: ctl(feldAttr(id, fe[key], hinweis), werte[key] ?? '') });
  return `<form class="vorgangsform" id="aform-${aktion}" data-form="pilot-schritt" data-aktion="${aktion}" data-anfrage="${esc(a.id)}" novalidate aria-labelledby="h-as-${aktion}">
    <h3 id="h-as-${aktion}">${titel}</h3><p class="leise">${intro}</p>
    ${Object.keys(fe).length ? `<p class="feld-meldung" role="alert">${Object.keys(fe).length === 1 ? 'Eine Angabe fehlt oder ist ungültig.' : `${Object.keys(fe).length} Angaben fehlen oder sind ungültig.`}</p>` : ''}
    ${felder({ fld, ff, werte, fe })}
    <div class="formular-aktionen"><button type="submit" class="knopf" id="as-${aktion}-senden">${knopf}</button></div>
  </form>`;
}
function schrittFormulare(ctx, a) {
  const st = anfrageStatus(a); const dl = waehlbareDienstleister(ctx);
  const f = {
    beauftragt: () => schrittFormular(ctx, a, 'beauftragt', 'Als beauftragt vermerken', 'Die Beauftragung geschieht außerhalb der Plattform (Telefon, E-Mail, Auftrag). Hier wird sie nur vermerkt.', ({ fld, ff, werte, fe }) => `
      <div class="formular formular-eng">${feld({ id: 'as-dienstleister', label: 'Dienstleister (Pflicht)', hinweis: dl.length ? '' : 'Zuerst unter „Anfragen“ einen Dienstleister hinterlegen.', fehler: fe.dienstleister, control: `<select ${feldAttr('as-dienstleister', fe.dienstleister)} ${ff('dienstleister')}>${optionen(dl.map((x) => [x.id, `${x.name} (${DIENSTLEISTER_ART[x.art].label})`]), werte.dienstleister ?? a.dienstleister ?? '')}</select>` })}</div>
      <label class="schalter ${fe.bestaetigt ? 'feld-fehler' : ''}"><input type="checkbox" id="as-bestaetigt" ${ff('bestaetigt')} ${werte.bestaetigt ? 'checked' : ''}><span>Die Beauftragung ist außerhalb der Plattform erfolgt (keine Nachricht aus der Plattform).</span></label>${fe.bestaetigt ? `<p class="feld-meldung">${esc(fe.bestaetigt)}</p>` : ''}`, 'Beauftragung vermerken'),
    ergebnis: () => schrittFormular(ctx, a, 'ergebnis', 'Ergebnis eintragen', a.leistung === 'fachpruefung' ? 'Trägt ein, was die Fachperson mitgeteilt hat. Laut Eintrag, keine Fachfreigabe durch die Plattform.' : 'Trägt ein, was der Dienstleister mitgeteilt hat.', ({ fld, ff, werte, fe }) => `
      <fieldset class="optionswahl ${fe.urteil ? 'feld-fehler' : ''}" id="as-urteil" tabindex="-1"><legend>Ergebnis (Pflicht)</legend>${Object.entries(URTEIL).map(([v, t]) => `<label class="zustandschip"><input type="radio" ${ff('urteil')} value="${v}" ${werte.urteil === v ? 'checked' : ''}><span><b>${esc(t)}</b></span></label>`).join('')}${fe.urteil ? `<p class="feld-meldung">${esc(fe.urteil)}</p>` : ''}</fieldset>
      <div class="formular formular-eng">
        ${fld('as-person', 'person', 'Mitgeteilt von (Pflicht)', 'Name oder Funktion, keine Kontaktdaten.', (at, w) => `<input ${at} ${ff('person', ' maxlength="80" autocomplete="off"')} value="${esc(w)}">`)}
        ${fld('as-notiz', 'notiz', 'Grund oder offene Punkte (bei „negativ“ und „offene Punkte“ Pflicht)', '', (at, w) => `<textarea ${at} ${ff('notiz', ' rows="2" maxlength="400"')}>${esc(w)}</textarea>`, 'feld-breit')}
      </div>`, 'Ergebnis eintragen'),
    klaerung: () => schrittFormular(ctx, a, 'klaerung', 'Weitere Klärung vermerken', 'Hält fest, was noch offen ist.', ({ fld, ff }) => `<div class="formular formular-eng">${fld('as-notiz', 'notiz', 'Was ist zu klären (Pflicht)', '', (at, w) => `<textarea ${at} ${ff('notiz', ' rows="2" maxlength="400"')}>${esc(w)}</textarea>`, 'feld-breit')}</div>`, 'Klärung vermerken'),
    uebergabe: () => schrittFormular(ctx, a, 'uebergabe', 'Übergabe planen', `Termin nicht vor dem Stichtag ${datum(ctx.at)}.`, ({ fld, ff }) => `<div class="formular formular-eng">
        ${fld('as-termin', 'termin', 'Termin (Pflicht)', '', (at, w) => `<input type="date" ${at} ${ff('termin')} value="${esc(w)}">`)}
        ${fld('as-ort', 'ort', 'Ort (Pflicht)', 'z. B. „Lager Baustelle“.', (at, w) => `<input ${at} ${ff('ort', ' maxlength="120" autocomplete="off"')} value="${esc(w)}">`)}</div>`, 'Übergabe planen'),
    abgeschlossen: () => schrittFormular(ctx, a, 'abgeschlossen', 'Als abgeschlossen eintragen', `Das Datum darf nicht nach dem Stichtag ${datum(ctx.at)} liegen.`, ({ fld, ff }) => `<div class="formular formular-eng">${fld('as-datum', 'datum', 'Abgeschlossen am (Pflicht)', '', (at, w) => `<input type="date" ${at} ${ff('datum')} value="${esc(w)}">`)}</div>`, 'Abschluss eintragen'),
    abgelehnt: () => schrittFormular(ctx, a, 'abgelehnt', 'Nicht weiterverfolgen', 'Beendet die Anfrage.', ({ fld, ff }) => `<div class="formular formular-eng">${fld('as-grund', 'grund', 'Grund (Pflicht)', '', (at, w) => `<textarea ${at} ${ff('grund', ' rows="2" maxlength="400"')}>${esc(w)}</textarea>`, 'feld-breit')}</div>`, 'Anfrage ablehnen'),
  };
  const liste = ['beauftragt', 'ergebnis', 'klaerung', 'uebergabe', 'abgeschlossen', 'abgelehnt'].filter((k) => st.erlaubt.includes(k)).map((k) => f[k]());
  if (!st.beendet) liste.push(schrittFormular(ctx, a, 'kosten', 'Kostentragung eintragen', 'Wer die Dienstleistungskosten trägt, steht nur hier. Es gibt keine automatische Verteilung und keine Beträge.', ({ fld, ff, werte }) => `<div class="formular formular-eng">
      ${feld({ id: 'as-kosten', label: 'Kostentragung', control: `<select ${feldAttr('as-kosten')} ${ff('kostentraeger')}>${optionen(Object.entries(KOSTENTRAEGER), werte.kostentraeger ?? a.kostentraeger ?? 'offen', null)}</select>` })}
      ${fld('as-kostenhinweis', 'kostenHinweis', 'Hinweis', 'z. B. Datum der Absprache.', (at, w) => `<input ${at} ${ff('kostenHinweis', ' maxlength="200" autocomplete="off"')} value="${esc(w)}">`)}</div>`, 'Kostentragung speichern'));
  return liste;
}

export function anfrageSeite(ctx, a) {
  const st = anfrageStatus(a); const b = bauteilVon(ctx, a.bauteil); const d = bedarfVon(ctx, a.bedarf); const p = b && projektVon(ctx, b.projekt); const dl = findeDienstleister(ctx, a.dienstleister);
  const s = ctx.ui.pilot.schritt; const allg = s.id === a.id ? s.fehler.allgemein : '';
  const vorgang = a.vorgang ? ctx.daten.entscheidungen.find((e) => `${e.projekt}:${e.id}` === a.vorgang) : null;
  return `${seitenkopf({ pfad: [['#anfragen', 'Anfragen']], aktuell: a.id, eyebrow: `Anfrage · ${esc(LEISTUNGEN[a.leistung] || a.leistung)}`, titel: `<span class="mono">${esc(a.id)}</span> ${esc(b ? b.name : a.bauteil.id)}`, untertitel: `${statusChip(a)} <span>${esc(st.text)} · zuletzt geändert ${zeit(a.geaendert)}</span>` })}
  <section class="flaeche" aria-labelledby="h-a-angaben">
    <div class="block-kopf"><h2 id="h-a-angaben">Angaben</h2>${b ? `<a class="knopf-zweit knopf-klein" href="${routePass(b)}">Bauteilpass öffnen</a>` : ''}</div>
    <dl class="werte">
      <div><dt>Bauteil</dt><dd>${b ? `${p ? pchip(p) : ''} <a href="${routePass(b)}"><span class="mono">${esc(b.id)}</span> ${esc(b.name)}</a><small>${esc(GRUPPEN[b.gruppe]?.name || '')} · Raum ${esc(b.raum)}</small>` : `${esc(a.bauteil.projekt)} · ${esc(a.bauteil.id)} <small>nicht mehr vorhanden</small>`}</dd></div>
      <div><dt>Projektbedarf</dt><dd>${d ? `<a href="${routeBedarf(d)}"><span class="mono">${esc(d.id)}</span> ${esc(d.titel)}</a><small>${esc(d.projekt)}</small>` : '<span class="leise">ohne Bedarf</span>'}</dd></div>
      ${vorgang ? `<div><dt>Vorgang</dt><dd><a href="${routeEntscheidung(vorgang)}">${esc(vorgang.projekt)} · ${esc(vorgang.id)}</a></dd></div>` : ''}
      <div><dt>Leistung</dt><dd>${esc(LEISTUNGEN[a.leistung] || a.leistung)}${a.beschreibung ? `<small>${esc(a.beschreibung)}</small>` : ''}</dd></div>
      <div><dt>Unterlagen</dt><dd>${a.unterlagen ? esc(a.unterlagen) : '<span class="leise">keine genannt</span>'}</dd></div>
      <div><dt>Offene Fragen</dt><dd>${a.offeneFragen ? esc(a.offeneFragen) : '<span class="leise">keine</span>'}</dd></div>
      <div><dt>Zuständig</dt><dd>${esc(a.zustaendig)}</dd></div>
      <div><dt>Benötigt bis</dt><dd class="mono">${sicherDatum(a.termin)}</dd></div>
      <div><dt>Dienstleister</dt><dd>${dl ? `${esc(dl.name)} ${dlChip(dl)}<small>${dl.leistungen.map((l) => esc(LEISTUNGEN[l] || l)).join(' · ')}</small>` : '<span class="leise">noch keiner gewählt</span>'}</dd></div>
      <div><dt>Kostentragung</dt><dd>${esc(KOSTENTRAEGER[a.kostentraeger] || KOSTENTRAEGER.offen)}${a.kostenHinweis ? `<small>${esc(a.kostenHinweis)}</small>` : ''}</dd></div>
      ${a.ergebnis ? `<div><dt>Ergebnis</dt><dd>${esc(URTEIL[a.ergebnis.urteil] || a.ergebnis.urteil)}<small>mitgeteilt von ${esc(a.ergebnis.person)}${a.ergebnis.notiz ? ` · ${esc(a.ergebnis.notiz)}` : ''}${a.leistung === 'fachpruefung' ? ' · keine Fachfreigabe durch die Plattform' : ''}</small></dd></div>` : ''}
      ${a.uebergabe ? `<div><dt>Übergabe</dt><dd>${datum(a.uebergabe.termin)}, ${esc(a.uebergabe.ort)}</dd></div>` : ''}
    </dl>
    <p class="klein">${esc(HINWEIS_ANFRAGE)}</p>
  </section>
  <section class="flaeche vorgang" id="anfrage-verlauf" aria-labelledby="h-a-verlauf">
    <div class="block-kopf"><h2 id="h-a-verlauf">Verlauf und nächste Schritte</h2><span class="leise">Einträge von Personen, nichts versendet</span></div>
    <div class="vorgang-status" id="anfrage-status" tabindex="-1"><span class="label">Aktueller Status</span><span class="vs-zeile">${statusChip(a)} ${esc(st.text)}</span></div>
    <ol class="verlauf">${(a.verlauf || []).filter((v) => v && typeof v === 'object').slice().reverse().map((v) => `<li><span class="mono">${(() => { try { return zeit(v.at, false); } catch { return '–'; } })()}</span><p>${esc(v.text || '')}<small>${esc(ANFRAGE_STATUS[v.status]?.label || v.status || '')} · Eigene Eingabe</small></p></li>`).join('')}</ol>
    ${st.beendet ? `<p class="kette-ende hinweisbox">${tonSymbol(st.ton === 'crit' ? 'crit' : 'ok')} <b>Die Anfrage ist beendet: ${esc(st.label)}.</b>${a.abgelehnt ? ` Grund: ${esc(a.abgelehnt.grund)}` : ''}</p>` : ''}
    ${allg ? `<p class="feld-meldung" id="anfrage-fehler" tabindex="-1" role="alert">${esc(allg)}</p>` : ''}
    ${!st.beendet ? `<div class="vorgang-aktionen">${schrittFormulare(ctx, a).join('')}</div>` : ''}
    ${regelHinweis()}
  </section>`;
}

// ---------- Bausteine für Bauteilpass, Bedarf und Abgleich ----------
export function interesseKnopf(ctx, b, d) {
  const offen = offenesInteresse(ctx, b, d); const f = ctx.ui.pilot.interesse; const k = `${b.projekt}:${b.id}|${d.projekt}:${d.id}`;
  if (offen) return `<p class="lokal-hinweis">${chip('Interesse festgehalten', 'ok')} <span>${esc(datum(offen.at))}${offen.notiz ? ` · ${esc(offen.notiz)}` : ''} · ${esc(HINWEIS_INTERESSE)} <button type="button" class="knopf-leise knopf-klein" data-action="interesse-zurueck" data-interesse="${esc(offen.id)}">Zurückziehen</button></span></p>`;
  return `<form class="interesse-form" data-form="pilot-interesse" data-key="${esc(k)}" novalidate><label class="feld-inline" for="int-notiz-${slug(k)}"><span>Interesse am Angebot festhalten</span><input id="int-notiz-${slug(k)}" name="notiz" data-ff="pilot-interesse" maxlength="300" placeholder="Notiz, z. B. Rückfrage" value="${f.k === k ? esc(f.notiz) : ''}"></label><button type="submit" class="knopf-zweit knopf-klein">${icon('flagge')} Interesse festhalten</button>${f.k === k && f.fehler.allgemein ? `<p class="feld-meldung" role="alert">${esc(f.fehler.allgemein)}</p>` : ''}<small class="klein">${esc(HINWEIS_INTERESSE)}</small></form>`;
}

export function interessenAmBedarf(ctx, d) {
  const liste = interessenFuerBedarf(ctx, d).filter((i) => i.status === 'offen');
  if (!liste.length) return '';
  return `<section class="flaeche" aria-labelledby="h-int-bed"><div class="block-kopf"><h2 id="h-int-bed">Interesse an Angeboten</h2><em class="zaehler">${liste.length}</em></div>
    <ul class="kompaktliste">${liste.map((i) => { const b = bauteilVon(ctx, i.bauteil); return `<li>${b ? `<a href="${routePass(b)}"><span class="mono">${esc(b.projekt)} · ${esc(b.id)}</span><span><b>${esc(b.name)}</b><small>${datum(i.at)}${i.notiz ? ` · ${esc(i.notiz)}` : ''}</small></span></a>` : `<span>${esc(i.bauteil.projekt)} · ${esc(i.bauteil.id)}</span>`}</li>`; }).join('')}</ul>
    <p class="klein">${esc(HINWEIS_INTERESSE)}</p></section>`;
}

function angebotFormular(ctx, b) {
  const f = ctx.ui.pilot.angebot; const k = `${b.projekt}:${b.id}`; const e = f.k === k && f.entwurf ? f.entwurf : leererAngebotEntwurf(b); const fe = f.k === k ? f.fehler : {};
  const ff = (name, extra = '') => `name="${name}" data-ff="pilot-angebot"${extra}`; const einheit = GRUPPEN[b.gruppe]?.einheit || '';
  const fld = (id, key, label, hinweis, ctl, kl = '') => feld({ id, label, hinweis, klasse: kl, fehler: fe[key], control: ctl(feldAttr(id, fe[key], hinweis), e[key] ?? '') });
  return `<form class="vorgangsform" id="form-angebot" data-form="pilot-angebot" data-key="${esc(k)}" novalidate aria-labelledby="h-ag">
    <h3 id="h-ag">Angebot bearbeiten</h3><p class="leise">Menge, Verfügbarkeit und Zustand aktualisieren oder das Angebot zurückziehen. Maße bleiben im Block „Angaben“.</p>
    ${fe.allgemein ? `<p class="feld-meldung" role="alert">${esc(fe.allgemein)}</p>` : ''}
    <div class="formular formular-eng">
      ${fld('ag-menge', 'menge', `Menge in ${esc(einheit)} (Pflicht)`, '', (a, w) => `<span class="einheit-feld"><input ${a} ${ff('menge', ' inputmode="decimal"')} value="${esc(w)}"><span>${esc(einheit)}</span></span>`)}
      ${fld('ag-ab', 'verfuegbarAb', 'Verfügbar ab', '', (a, w) => `<input type="date" ${a} ${ff('verfuegbarAb')} value="${esc(w)}">`)}
      ${fld('ag-bis', 'verfuegbarBis', 'Verfügbar bis', 'Leer = offen.', (a, w) => `<input type="date" ${a} ${ff('verfuegbarBis')} value="${esc(w)}">`)}
      ${fld('ag-zustand', 'zustand', 'Zustand nach Sichtprüfung', '', (a, w) => `<select ${a} ${ff('zustand')}>${optionen(Object.entries(ZUSTAND).map(([k2, t]) => [k2, `${k2} · ${t}`]), w, 'nicht angegeben')}</select>`)}
      ${fld('ag-notiz', 'zustandText', 'Notiz zum Zustand', '', (a, w) => `<input ${a} ${ff('zustandText', ' maxlength="200" autocomplete="off"')} value="${esc(w)}">`, 'feld-breit')}
    </div>
    <fieldset class="optionswahl ${fe.status ? 'feld-fehler' : ''}" id="ag-status" tabindex="-1"><legend>Angebot</legend>
      <label class="zustandschip"><input type="radio" ${ff('status', ' data-neu-zeichnen="1"')} value="erfasst" ${e.status !== 'nicht' ? 'checked' : ''}><span><b>wird angeboten</b></span></label>
      <label class="zustandschip"><input type="radio" ${ff('status', ' data-neu-zeichnen="1"')} value="nicht" ${e.status === 'nicht' ? 'checked' : ''}><span><b>nicht mehr angeboten</b></span></label>
      ${fe.status ? `<p class="feld-meldung">${esc(fe.status)}</p>` : ''}</fieldset>
    ${e.status === 'nicht' ? `<div class="formular formular-eng">${fld('ag-grund', 'grund', 'Grund (Pflicht)', '', (a, w) => `<input ${a} ${ff('grund', ' maxlength="200" autocomplete="off"')} value="${esc(w)}">`, 'feld-breit')}</div>` : ''}
    <div class="formular-aktionen"><button type="submit" class="knopf" id="ag-senden">Änderung speichern</button> <button type="button" class="knopf-leise" data-action="angebot-abbrechen">Abbrechen</button></div>
  </form>`;
}

function verkaufBereich(ctx, b) {
  const lage = provisionsLage(ctx, b); const v = lage.verkauf; const k = `${b.projekt}:${b.id}`;
  const vf = ctx.ui.pilot.verkauf; const ve = vf.k === k ? vf.eingabe : {}; const vfe = vf.k === k ? vf.fehler : {};
  const pf = ctx.ui.pilot.provision;
  const ff = (name, extra = '') => `name="${name}" data-ff="pilot-verkauf"${extra}`;
  const bedarfe = ctx.daten.bedarfe.filter((x) => x.gruppe === b.gruppe);
  const status = ve.status ?? v.status;
  return `<section class="flaeche" id="verkauf" aria-labelledby="h-verkauf">
    <div class="block-kopf"><h2 id="h-verkauf">Verkauf und Provision</h2>${chip((VERKAUF_STATUS[v.status] || VERKAUF_STATUS.offen).label, (VERKAUF_STATUS[v.status] || VERKAUF_STATUS.offen).ton)}</div>
    <p class="leise">Geschäftsmodell laut Teamvorgabe: Käufer und Verkäufer bezahlen die vereinbarten Prüf- und Logistikleistungen an die beauftragten Unternehmen. Nach abgeschlossenem Bauteilverkauf zahlen die vermittelten Dienstleister CircularFlow eine vereinbarte Provision.</p>
    ${v.status === 'abgeschlossen' ? `<p>Verkauf abgeschlossen am <b>${datum(v.datum)}</b>${v.bedarf ? ` an Bedarf <span class="mono">${esc(v.bedarf.projekt)} · ${esc(v.bedarf.id)}</span>` : ''}${v.notiz ? ` · ${esc(v.notiz)}` : ''} (laut Eintrag).</p>` : ''}
    <form class="vorgangsform" id="form-verkauf" data-form="pilot-verkauf" data-key="${esc(k)}" novalidate aria-labelledby="h-vk-form">
      <h3 id="h-vk-form">Bauteilverkauf dokumentieren</h3>
      ${vfe.allgemein ? `<p class="feld-meldung" role="alert">${esc(vfe.allgemein)}</p>` : ''}
      <fieldset class="optionswahl ${vfe.status ? 'feld-fehler' : ''}" id="vk-status" tabindex="-1"><legend>Stand (Pflicht)</legend>
        ${Object.entries(VERKAUF_STATUS).map(([s, t]) => `<label class="zustandschip"><input type="radio" ${ff('status', ' data-neu-zeichnen="1"')} value="${s}" ${status === s ? 'checked' : ''}><span><b>${esc(t.label)}</b></span></label>`).join('')}
        ${vfe.status ? `<p class="feld-meldung">${esc(vfe.status)}</p>` : ''}</fieldset>
      ${status === 'abgeschlossen' ? `<div class="formular formular-eng">
        ${feld({ id: 'vk-datum', label: 'Abgeschlossen am (Pflicht)', hinweis: `Nicht nach dem Stichtag ${datum(ctx.at)}.`, fehler: vfe.datum, control: `<input type="date" ${feldAttr('vk-datum', vfe.datum)} ${ff('datum')} value="${esc(ve.datum ?? v.datum ?? '')}">` })}
        ${feld({ id: 'vk-bedarf', label: 'Käuferbedarf', hinweis: 'Freiwillig.', fehler: vfe.bedarf, control: `<select ${feldAttr('vk-bedarf', vfe.bedarf)} ${ff('bedarf')}>${optionen(bedarfe.map((x) => [`${x.projekt}|${x.id}`, `${x.projekt} · ${x.id} ${x.titel}`]), ve.bedarf ?? (v.bedarf ? `${v.bedarf.projekt}|${v.bedarf.id}` : ''), 'nicht zugeordnet')}</select>` })}
        ${feld({ id: 'vk-notiz', label: 'Notiz', fehler: vfe.notiz, klasse: 'feld-breit', control: `<input ${feldAttr('vk-notiz', vfe.notiz)} ${ff('notiz', ' maxlength="300" autocomplete="off"')} value="${esc(ve.notiz ?? v.notiz ?? '')}">` })}</div>` : ''}
      <div class="formular-aktionen"><button type="submit" class="knopf-zweit" id="vk-senden">Verkaufsstand speichern</button></div>
    </form>
    <h3>Vermittelte Leistungen und Provision</h3>
    ${lage.zeilen.length ? `<ul class="einfache-liste provisionen">${lage.zeilen.map((z) => { const pe = pf.k === k && pf.eingabe[z.dienstleister.id] ? pf.eingabe[z.dienstleister.id] : {}; const pfe = pf.k === k && pf.fehler[z.dienstleister.id] ? pf.fehler[z.dienstleister.id] : {}; const pr = z.provision; return `<li>
        <b>${esc(z.dienstleister.name)}</b> ${dlChip(z.dienstleister)}<small>${z.anfragen.map((a) => `<a href="${routeAnfrage(a)}">${esc(a.id)} ${esc(LEISTUNGEN[a.leistung] || a.leistung)} (${esc(ANFRAGE_STATUS[a.status]?.label || a.status)})</a>`).join(' · ')}</small>
        ${pr ? `<p>Provision: ${chip((PROVISION_STATUS[pr.status] || PROVISION_STATUS.offen).label, (PROVISION_STATUS[pr.status] || PROVISION_STATUS.offen).ton)}${pr.grundlage ? ` <small>Grundlage: ${esc(pr.grundlage)}</small>` : ''}</p>
        <form class="vorgangsform" data-form="pilot-provision" data-key="${esc(k)}" data-dienstleister="${esc(z.dienstleister.id)}" novalidate>
          ${pfe.allgemein ? `<p class="feld-meldung" role="alert">${esc(pfe.allgemein)}</p>` : ''}
          <div class="formular formular-eng">
            ${feld({ id: `pv-status-${slug(z.dienstleister.id)}`, label: 'Provisionsstatus', fehler: pfe.status, control: `<select ${feldAttr(`pv-status-${slug(z.dienstleister.id)}`, pfe.status)} name="status" data-ff="pilot-provision-${esc(z.dienstleister.id)}" data-neu-zeichnen="1">${optionen(Object.entries(PROVISION_STATUS).map(([s, t]) => [s, t.label]), pe.status ?? pr.status, null)}</select>` })}
            ${(pe.status ?? pr.status) === 'vereinbart' ? feld({ id: `pv-grundlage-${slug(z.dienstleister.id)}`, label: 'Vereinbarte Berechnungsgrundlage (Pflicht)', hinweis: 'Frei formuliert, kein voreingestellter Prozentsatz.', fehler: pfe.grundlage, klasse: 'feld-breit', control: `<input ${feldAttr(`pv-grundlage-${slug(z.dienstleister.id)}`, pfe.grundlage)} name="grundlage" data-ff="pilot-provision-${esc(z.dienstleister.id)}" maxlength="200" autocomplete="off" value="${esc(pe.grundlage ?? pr.grundlage ?? '')}">` }) : ''}
          </div>
          <div class="formular-aktionen"><button type="submit" class="knopf-zweit knopf-klein">Provisionsstatus speichern</button></div>
        </form>` : '<p class="leise">Provisionsstatus erst nach abgeschlossenem Verkauf.</p>'}</li>`; }).join('')}</ul>` : '<p class="leer-zeile">Noch keine vermittelte Leistung: Eine Anfrage zählt, sobald sie mit einem Dienstleister als beauftragt vermerkt ist.</p>'}
    <ul class="hinweisliste">${lage.hinweise.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
    ${regelHinweis()}
  </section>`;
}

// Alle Pilot-Blöcke im Bauteilpass: Angebot bearbeiten, Interessenten und Anfragen, Verkauf und Provision, letzte Änderung.
export function passPilotBereich(ctx, p, b) {
  const interessen = interessenFuerBauteil(ctx, b); const offen = interessen.filter((i) => i.status === 'offen');
  const anfragen = anfragenFuerBauteil(ctx, b); const f = ctx.ui.pilot.angebot; const k = `${b.projekt}:${b.id}`;
  const letzte = letzteAenderung(ctx, b);
  return `<section class="flaeche" id="angebot" aria-labelledby="h-angebot">
    <div class="block-kopf"><h2 id="h-angebot">Angebot (Verkäuferseite)</h2>${f.offen && f.k === k ? '' : '<button type="button" class="knopf-zweit knopf-klein" id="btn-angebot" data-action="angebot-bearbeiten" data-key="' + esc(k) + '">Angebot bearbeiten</button>'}</div>
    <p class="leise">Zuletzt geändert: <b>${letzte ? zeit(letzte) : 'keine Änderung bis zum Stichtag'}</b>${b.angebotGeaendert ? ` · ${chip('Angebot geändert', 'info')}` : ''}</p>
    ${f.offen && f.k === k ? angebotFormular(ctx, b) : ''}
  </section>
  <section class="flaeche" id="interessenten" aria-labelledby="h-interessenten">
    <div class="block-kopf"><h2 id="h-interessenten">Interessenten und Anfragen</h2><a class="knopf-zweit knopf-klein" id="btn-anfrage-neu" href="${routeAnfrageNeu(b)}">${icon('flagge')} Prüf- oder Logistikanfrage vorbereiten</a></div>
    ${offen.length ? `<ul class="kompaktliste">${offen.map((i) => { const d = bedarfVon(ctx, i.bedarf); return `<li>${d ? `<a href="${routeBedarf(d)}"><span class="mono">${esc(d.projekt)} · ${esc(d.id)}</span><span><b>Interesse: ${esc(d.titel)}</b><small>${datum(i.at)}${i.notiz ? ` · ${esc(i.notiz)}` : ''} · keine Reservierung</small></span></a>` : `<span>${esc(i.bedarf.projekt)} · ${esc(i.bedarf.id)}</span>`}</li>`; }).join('')}</ul>` : '<p class="leer-zeile">Noch kein Interesse festgehalten. Käufer halten es auf der Abgleichseite eines Paares fest.</p>'}
    ${anfragen.length ? `<ul class="kompaktliste">${anfragen.map((a) => { const d = findeDienstleister(ctx, a.dienstleister); return `<li><a href="${routeAnfrage(a)}"><span class="mono">${esc(a.id)}</span><span><b>${esc(LEISTUNGEN[a.leistung] || a.leistung)}</b><small>${esc(anfrageStatus(a).label || a.status)}${d ? ` · ${esc(d.name)}` : ''} · benötigt bis ${sicherDatum(a.termin)}</small></span>${icon('pfeilrechts')}</a></li>`; }).join('')}</ul>` : '<p class="leer-zeile">Noch keine Anfrage zu diesem Bauteil.</p>'}
  </section>
  ${verkaufBereich(ctx, b)}`;
}
