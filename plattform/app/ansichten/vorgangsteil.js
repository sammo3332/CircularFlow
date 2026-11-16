// Vorgang auf der Entscheidungsseite: Statuskette, Formulare für die erlaubten Aktionen und die Checkliste „Was ist zu klären“.
// Die Regeln (erlaubte Aktionen, Prüfung, Checkliste) stehen in vorgang.js; hier nur Darstellung.
// Zustand: ctx.ui.vorgangForm = { k, eingabe: { <aktion>: { feld: wert } }, fehler: { <aktion>: { feld: text } }, aktion }.
import { PERSONEN, GRUPPEN } from '../daten.js';
import { HINWEIS_FACH, HINWEIS_VORMERKUNG, checkliste } from '../vorgang.js';
import { offeneNachweise, schluessel } from '../regeln.js';
import { esc, chip, feld, feldAttr, optionen, tonSymbol, tagText, routeAbgleich } from '../ui.js';
import { zeit, datum } from '../zeit.js';

// Fehlerschlüssel aus vorgangSchritt → Feld-ID (Fokus auf das erste fehlerhafte Feld).
export const VORGANG_FELD_ID = { urteil: 'vf-urteil', person: 'vf-person', notiz: 'vf-notiz', menge: 'vf-menge', ablauf: 'vf-ablauf', termin: 'vf-termin', ort: 'vf-ort', rolle: 'vf-rolle', datum: 'vf-datum', grund: 'vf-grund' };
export const VORGANG_REIHENFOLGE = ['pruefbitte', 'fachergebnis', 'vormerkung', 'uebergabe-geplant', 'uebergeben', 'abbruch'];
const WORT = { geeignet: 'geeignet', bedingt: 'bedingt geeignet', ungeeignet: 'ungeeignet' };
const ROLLEN = ['planung', 'bauleitung', 'montage', 'fach'];

// Die sechs Stationen der Kette. Nur Darstellung des Status aus vorgangStatus.
export function kette(st) {
  const gemerkt = Boolean(st.vormerkung) && !st.abgelaufen;
  const stationen = [
    { key: 'zuordnung', name: 'Zuordnung', erledigt: true, text: 'Bauteil und Ziel gewählt' },
    { key: 'pruefbitte', name: 'Prüfbitte', erledigt: Boolean(st.pruefbitte), text: st.pruefbitte ? zeit(st.pruefbitte.at) : '' },
    { key: 'fachergebnis', name: 'Fachergebnis', erledigt: Boolean(st.fachergebnis), text: st.fachergebnis ? `${WORT[st.fachergebnis.urteil]} (laut Eintrag)` : '' },
    { key: 'vormerkung', name: 'Vormerkung', erledigt: gemerkt, text: st.vormerkung ? (st.abgelaufen ? `abgelaufen am ${datum(st.vormerkung.ablauf)}` : `bis ${datum(st.vormerkung.ablauf)}`) : '' },
    { key: 'uebergabe', name: 'Übergabe geplant', erledigt: Boolean(st.uebergabe), text: st.uebergabe ? `am ${datum(st.uebergabe.termin)}` : '' },
    { key: 'uebergeben', name: 'Übergeben', erledigt: Boolean(st.uebergeben), text: st.uebergeben ? `am ${datum(st.uebergeben.datum)}` : '' },
  ];
  let jetzt = st.beendet ? -1 : stationen.findIndex((s) => !s.erledigt);
  return stationen.map((s, i) => ({ ...s, zustand: s.erledigt ? 'erledigt' : i === jetzt ? 'aktuell' : st.beendet ? 'entfällt' : 'offen' }));
}

const person = (k) => PERSONEN[k] || { rolle: '', name: '' };

function formular(ctx, k, aktion, titel, intro, felder, knopf, klasse = '') {
  const vf = ctx.ui.vorgangForm; const fe = (vf.k === k && vf.fehler[aktion]) || {};
  const werte = (vf.k === k && vf.eingabe[aktion]) || {};
  const ff = (name, extra = '') => `name="${name}" data-ff="vorgang-${aktion}"${extra}`;
  const fld = (id, key, label, hinweis, ctl, kl = '') => feld({ id, label, hinweis, klasse: kl, fehler: fe[key], control: ctl(feldAttr(id, fe[key], hinweis), werte[key] ?? '') });
  return `<form class="vorgangsform ${klasse}" id="vform-${aktion}" data-form="vorgang" data-aktion="${aktion}" data-entscheidung="${esc(k)}" novalidate aria-labelledby="h-vf-${aktion}">
    <h3 id="h-vf-${aktion}">${titel}</h3><p class="leise">${intro}</p>
    ${Object.keys(fe).length ? `<p class="feld-meldung" role="alert">${Object.keys(fe).length === 1 ? 'Eine Angabe fehlt oder ist ungültig.' : `${Object.keys(fe).length} Angaben fehlen oder sind ungültig.`}</p>` : ''}
    ${felder({ fld, ff, werte, fe })}
    <div class="formular-aktionen"><button type="submit" class="knopf" id="vf-${aktion === 'uebergabe-geplant' ? 'uebergabe' : aktion}-senden">${knopf}</button></div>
  </form>`;
}

function formulare(ctx, e, st, b, d) {
  const k = schluessel(e.projekt, e.id); const einheit = GRUPPEN[b?.gruppe]?.einheit || '';
  const f = {
    pruefbitte: () => formular(ctx, k, 'pruefbitte', 'Prüfbitte anlegen', 'Bittet die Fachprüfung um die Eignungsprüfung. Simulation, es wird nichts versendet.', () => '', 'Prüfbitte anlegen'),
    fachergebnis: () => formular(ctx, k, 'fachergebnis', 'Fachergebnis eintragen', `Trägt ein, was die Fachperson mitgeteilt hat: ${HINWEIS_FACH}.`, ({ fld, ff, werte, fe }) => `
      <fieldset class="optionswahl ${fe.urteil ? 'feld-fehler' : ''}" id="vf-urteil" tabindex="-1" ${fe.urteil ? 'aria-invalid="true" aria-describedby="vf-urteil-f"' : ''}><legend>Ergebnis (Pflicht)</legend>
        ${Object.entries(WORT).map(([v, t]) => `<label class="zustandschip"><input type="radio" id="vf-urteil-${v}" ${ff('urteil')} value="${v}" ${werte.urteil === v ? 'checked' : ''}><span><b>${esc(t[0].toUpperCase() + t.slice(1))}</b></span></label>`).join('')}
        ${fe.urteil ? `<p class="feld-meldung" id="vf-urteil-f">${esc(fe.urteil)}</p>` : ''}</fieldset>
      <div class="formular formular-eng">
        ${fld('vf-person', 'person', 'Name der Fachperson (Pflicht, als Text)', 'Nur Name oder Funktion, keine Kontaktdaten. Wird als Eintrag von „Sie“ gespeichert.', (a, w) => `<input ${a} ${ff('person', ' maxlength="80" autocomplete="off"')} value="${esc(w)}">`)}
        ${fld('vf-notiz', 'notiz', 'Notiz (bei „bedingt“ und „ungeeignet“ Pflicht)', 'Bedingung oder Grund.', (a, w) => `<textarea ${a} ${ff('notiz', ' rows="2" maxlength="400"')}>${esc(w)}</textarea>`, 'feld-breit')}
      </div>`, 'Fachergebnis eintragen'),
    vormerkung: () => formular(ctx, k, 'vormerkung', 'Vormerken', `${HINWEIS_VORMERKUNG}. Eine Vormerkung ist keine Bestellung und keine Reservierung.`, ({ fld, ff }) => `
      <div class="formular formular-eng">
        ${fld('vf-menge', 'menge', `Menge in ${esc(einheit)} (Pflicht)`, b ? `Höchstens ${esc(String(b.menge).replace('.', ','))} ${esc(einheit)} (Menge des Bauteils).` : '', (a, w) => `<span class="einheit-feld"><input ${a} ${ff('menge', ' inputmode="decimal"')} value="${esc(w)}"><span>${esc(einheit)}</span></span>`)}
        ${fld('vf-ablauf', 'ablauf', 'Vormerkung gilt bis (Pflicht)', `Nicht vor dem Stichtag ${datum(ctx.at)}.`, (a, w) => `<input type="date" ${a} ${ff('ablauf')} value="${esc(w)}">`)}
      </div>`, 'Vormerken'),
    'uebergabe-geplant': () => formular(ctx, k, 'uebergabe-geplant', 'Übergabe planen', `Termin nicht vor dem Stichtag${b?.verfuegbarAb ? `, nicht vor „verfügbar ab“ ${datum(b.verfuegbarAb)}` : ''}${d?.annahmeVon && d?.annahmeBis ? `, im Annahmefenster ${tagText(d.annahmeVon)} bis ${tagText(d.annahmeBis)}` : ''}${st.vormerkung ? `, nicht nach Vormerkungsablauf ${datum(st.vormerkung.ablauf)}` : ''}. Simulation.`, ({ fld, ff }) => `
      <div class="formular formular-eng">
        ${fld('vf-termin', 'termin', 'Termin (Pflicht)', '', (a, w) => `<input type="date" ${a} ${ff('termin')} value="${esc(w)}">`)}
        ${fld('vf-ort', 'ort', 'Ort der Übergabe (Pflicht)', 'z. B. „Lager Baustelle“. Keine privaten Adressen.', (a, w) => `<input ${a} ${ff('ort', ' maxlength="120" autocomplete="off"')} value="${esc(w)}">`)}
        ${fld('vf-rolle', 'rolle', 'Zuständige Rolle (Pflicht)', '', (a, w) => `<select ${a} ${ff('rolle')}>${optionen(ROLLEN.map((r) => [r, person(r).rolle]), w)}</select>`)}
      </div>`, 'Übergabe planen'),
    uebergeben: () => formular(ctx, k, 'uebergeben', 'Als übergeben eintragen', `Trägt ein, dass die Übergabe stattgefunden hat (Simulation, laut Eintrag). Das Datum darf nicht nach dem Stichtag ${datum(ctx.at)} liegen.`, ({ fld, ff }) => `
      <div class="formular formular-eng">${fld('vf-datum', 'datum', 'Übergabedatum (Pflicht)', '', (a, w) => `<input type="date" ${a} ${ff('datum')} value="${esc(w)}">`)}</div>`, 'Als übergeben eintragen'),
    abbruch: () => formular(ctx, k, 'abbruch', 'Vorgang abbrechen', 'Beendet den Vorgang. Danach sind keine weiteren Schritte möglich; das Bauteil und der Bedarf werden wieder frei.', ({ fld, ff }) => `
      <div class="formular formular-eng">${fld('vf-grund', 'grund', 'Grund (Pflicht)', 'Kurz und ohne Namen von Personen.', (a, w) => `<textarea ${a} ${ff('grund', ' rows="2" maxlength="400"')}>${esc(w)}</textarea>`, 'feld-breit')}</div>`, 'Vorgang abbrechen', 'vorgangsform-abbruch'),
  };
  return VORGANG_REIHENFOLGE.filter((a) => st.erlaubt.includes(a)).map((a) => f[a]());
}

function checklisteKarte(ctx, e, b, st) {
  const k = schluessel(e.projekt, e.id);
  const c = checkliste(ctx, e, { offeneNachweise: b ? offeneNachweise(ctx, b) : [] });
  return `<section class="flaeche" id="checkliste" aria-labelledby="h-checkliste">
    <div class="block-kopf"><h2 id="h-checkliste">Was ist zu klären</h2><span class="leise" role="status">${c.offen === 0 ? 'alles abgehakt' : `${c.offen} von ${c.punkte.length} offen`}</span></div>
    <ul class="checkliste">${c.punkte.map((p) => `<li class="${p.erledigt ? 'cl-fertig' : ''}">
      <label for="cl-${p.key}"><input type="checkbox" id="cl-${p.key}" data-checkliste="${esc(k)}" data-punkt="${p.key}" ${p.erledigt ? 'checked' : ''} ${p.abgeleitet || st.beendet ? 'disabled' : ''}><span><b>${esc(p.label)}</b>${p.sperrt ? ` ${chip('sperrt die Vormerkung', 'warn')}` : ''}<small>${esc(p.text)}</small></span></label></li>`).join('')}</ul>
    <p class="klein">Häkchen sind Einträge einer Person, keine Prüfung. Nur „Eignung“ sperrt einen Schritt; sie wird aus dem Fachergebnis abgeleitet. Wirtschaftlichkeit ist zu klären, in dieser Fassung ohne Zahlen.</p>
  </section>`;
}

export function vorgangsBereich(ctx, e, l) {
  const st = l.vorgang; const k = schluessel(e.projekt, e.id);
  const b = l.b; const d = e.ziel.art === 'bedarf' ? l.z : null;
  const vf = ctx.ui.vorgangForm; const allg = vf.k === k ? vf.fehler.allgemein : '';
  const ks = kette(st);
  const fs = st.beendet ? [] : formulare(ctx, e, st, b, d);
  const sn = st.pruefbitte?.schnappschuss;
  return `<section class="flaeche vorgang" id="vorgang" aria-labelledby="h-vorgang">
    <div class="block-kopf"><h2 id="h-vorgang">Vorgang</h2><span class="leise">Einträge der Simulation, keine Fachfreigabe</span></div>
    <div class="vorgang-status" id="vorgang-status" tabindex="-1">
      <span class="label">Aktueller Status</span>
      <span class="vs-zeile">${chip(st.label, st.ton)}${st.abgelaufen ? ' <b>Die Vormerkung ist abgelaufen.</b>' : st.ueberfaellig ? ' <b>Der Übergabetermin ist überschritten.</b>' : ''}</span>
    </div>
    <ol class="kette" aria-label="Stationen des Vorgangs">${ks.map((s, i) => `<li class="k-${s.zustand === 'entfällt' ? 'aus' : s.zustand}" ${s.zustand === 'aktuell' ? 'aria-current="step"' : ''}><span class="k-nr mono" aria-hidden="true">${i + 1}</span><span class="k-text"><b>${s.name}</b><small>${s.zustand === 'erledigt' ? `erledigt${s.text ? ` · ${esc(s.text)}` : ''}` : s.zustand === 'aktuell' ? `jetzt${s.text ? ` · ${esc(s.text)}` : ''}` : s.zustand === 'entfällt' ? 'entfällt' : 'offen'}</small></span></li>`).join('')}</ol>
    ${st.beendet ? `<p class="kette-ende hinweisbox">${tonSymbol(st.ton === 'crit' ? 'crit' : st.ton === 'ok' ? 'ok' : 'info')} <b>Der Vorgang ist beendet: ${esc(st.label)}.</b> ${st.key === 'ungeeignet' ? `Das Fachergebnis lautet „ungeeignet“ (${esc(HINWEIS_FACH)}); das Bauteil ist für andere Ziele wieder frei.${st.fachergebnis?.notiz ? ` Grund: ${esc(st.fachergebnis.notiz)}` : ''}` : st.key === 'abgebrochen' ? `Grund: ${esc(st.abbruch.grund)}. Bauteil und Bedarf sind wieder frei.` : 'Es sind keine weiteren Schritte möglich.'}</p>` : ''}
    ${sn ? `<p class="klein">Grundlage der Prüfbitte: Abgleich „${esc(sn.gesamt?.label || '')}“ <a href="${routeAbgleich(sn.schluessel)}">${esc(sn.bauteil?.id || '')} und ${esc(sn.bedarf?.id || '')}</a> (Stand ${esc(zeit(sn.stand || st.pruefbitte.at))}. Vorschlag zur Prüfung, keine fachliche Freigabe.</p>` : ''}
    ${allg ? `<p class="feld-meldung" id="vorgang-fehler" tabindex="-1" role="alert">${esc(allg)}</p>` : ''}
    ${fs.length ? `<div class="vorgang-aktionen">${fs.join('')}</div>` : ''}
  </section>
  ${checklisteKarte(ctx, e, b, st)}`;
}
