// Mobile Erfassung: Ort → Foto → Bauteil → Angaben → Prüfen und Speichern.
// Etikett-Texterkennung ist echt. Bauteilgruppe und Aufmaß bleiben manuell.
import { GRUPPEN, ZUSTAND, WERTSTATUS } from '../daten.js';
import { esc, chip, wertChip, icon, slug, routePass, pchip, leer, seitenkopf } from '../ui.js';
import { pruefeErfassung, wertText } from '../regeln.js';
import { datum } from '../zeit.js';
import { FELDER } from '../etikett-integration.js';
import { raumVon } from './projekte.js';

export const SCHRITTE = ['Ort', 'Foto', 'Bauteil', 'Angaben', 'Prüfen'];
export const leererEntwurf = (projekt = '', raum = '') => ({ schritt: 1, projekt, raum, foto: null, fotoFehler: '', fotoLaedt: false, etikett: null, etikettLaedt: false, etikettFehler: '', erkennung: null, gruppe: '', werte: {}, menge: '1', zustand: '', verfuegbarAb: '', notiz: '', fehler: {}, gespeichert: null });

export function erfassung(ctx) {
  const ent = ctx.ui.erfassung;
  if (ent.gespeichert) return gespeichert(ctx, ent.gespeichert);
  const projekte = ctx.daten.projekte.filter((p) => (p.gebaeude || []).length);
  const p = projekte.find((x) => x.kurz === ent.projekt);
  const ort = p && ent.raum ? raumVon(p, ent.raum) : null;
  return `
  ${seitenkopf({ eyebrow: 'Erfassen', titel: 'Bauteil erfassen', untertitel: p ? `${pchip(p)} ${esc(p.name)}${ort ? ` · Raum ${esc(ort.raum.id)} ${esc(ort.raum.name)}` : ''}` : 'Für Handy und Tablet gebaut, funktioniert auch am Rechner.' })}
  <div class="erfassung">
    <ol class="schritte" aria-label="Fortschritt">${SCHRITTE.map((t, i) => `<li class="${i + 1 < ent.schritt ? 'fertig' : i + 1 === ent.schritt ? 'jetzt' : ''}" ${i + 1 === ent.schritt ? 'aria-current="step"' : ''}>${i + 1 < ent.schritt ? `<button type="button" data-action="erf-gehe" data-schritt="${i + 1}"><span class="mono">${i + 1}</span>${t}</button>` : `<span><span class="mono">${i + 1}</span>${t}</span>`}</li>`).join('')}</ol>
    <section class="flaeche erf-karte" aria-labelledby="h-erf">
      ${[schritt1, schritt2, schritt3, schritt4, schritt5][ent.schritt - 1](ctx, ent, projekte, p, ort)}
    </section>
    <div class="erf-aktionen">
      ${ent.schritt > 1 ? `<button type="button" class="knopf-leise" id="erf-zurueck" data-action="erf-zurueck">${icon('zurueck')} Zurück</button>` : '<span></span>'}
      ${ent.schritt < 5 ? `<button type="button" class="knopf" id="erf-weiter" ${ent.etikettLaedt ? 'disabled' : ''} data-action="erf-weiter">Weiter ${icon('pfeil')}</button>` : `<button type="button" class="knopf" id="erf-speichern" ${ent.etikettLaedt ? 'disabled' : ''} data-action="erf-speichern">${icon('haken')} Speichern</button>`}
    </div>
    ${meineErfassungen(ctx)}
  </div>`;
}

const fehlerText = (ent, key) => (ent.fehler[key] ? `<p class="feld-meldung" id="fehler-${key}" role="alert">${esc(ent.fehler[key])}</p>` : '');

function schritt1(ctx, ent, projekte, p) {
  const etagen = p ? p.gebaeude[0].etagen : [];
  return `<h2 id="h-erf">Wo steht das Bauteil?</h2>
    <p class="leise">Das Bauteil gehört zu einem Raum. Projekt und Raum lassen sich auch direkt im Grundriss wählen.</p>
    <div class="formular formular-eng">
      <div class="feld"><label for="erf-projekt">Projekt</label><select id="erf-projekt"><option value="">Bitte wählen</option>${projekte.map((x) => `<option value="${esc(x.kurz)}" ${x.kurz === ent.projekt ? 'selected' : ''}>${esc(x.kurz)} · ${esc(x.name)}</option>`).join('')}</select></div>
      <div class="feld"><label for="erf-raum">Raum</label><select id="erf-raum" ${p ? '' : 'disabled'} ${ent.fehler.ort ? 'aria-invalid="true" aria-describedby="fehler-ort"' : ''}><option value="">${p ? 'Bitte wählen' : 'Erst Projekt wählen'}</option>
        ${etagen.map((e) => `<optgroup label="${esc(e.id)} · ${esc(e.name)}">${e.raeume.map((r) => `<option value="${esc(r.id)}" ${r.id === ent.raum ? 'selected' : ''}>${esc(r.id)} ${esc(r.name)}</option>`).join('')}</optgroup>`).join('')}</select>${fehlerText(ent, 'ort')}</div>
    </div>`;
}

function schritt2(ctx, ent) {
  const er = ent.erkennung;
  return `<h2 id="h-erf">Foto aufnehmen</h2>
    <p class="leise">Auf dem Handy öffnet sich die Kamera, am Rechner die Dateiauswahl. Das Foto bleibt in diesem Browser.</p>
    <label class="fotofeld ${ent.foto ? 'hat-foto' : ''}" for="erf-foto">
      ${ent.foto ? `<img src="${esc(ent.foto.daten)}" alt="Gewähltes Foto">` : `<span class="fotofeld-leer">${icon('kamera')}<b>Foto aufnehmen oder wählen</b><small>JPEG oder PNG bis 20 MB</small></span>`}
      <input type="file" id="erf-foto" accept="image/*" capture="environment">
    </label>
    ${ent.fotoLaedt ? '<p class="leise" role="status">Foto wird verkleinert …</p>' : ''}
    ${ent.fotoFehler ? `<p class="feld-meldung" role="alert">${esc(ent.fotoFehler)}</p>` : ''}
    ${ent.foto ? `<p class="leise">${esc(ent.foto.name)} · ${ent.foto.breite} × ${ent.foto.hoehe} px nach Verkleinerung</p>` : ''}
    ${er ? `<div class="ergebnisbox sim" role="status"><p><b>Erkennung · Simulation</b> ${chip('keine echte Bildanalyse', 'sim')}</p>
      <p>Vorschlag: <b>${esc(GRUPPEN[er.gruppe].einzahl)}</b>, abgeleitet nur aus dem Seitenverhältnis (${esc(er.grund)}). Vorgeschlagene Werte erscheinen als „vorgeschlagen“ und müssen geprüft oder gemessen werden.</p></div>` : ''}
    ${ent.foto ? '<button type="button" class="knopf-leise" data-action="erf-foto-weg">Foto entfernen</button>' : '<p class="klein">Ohne Foto weiter ist möglich. Das Foto fehlt dann als Nachweis.</p>'}
    <hr><h3>Typenschild auslesen (Versuch)</h3>
    <p>Optional: Etikett nah und scharf fotografieren. Die Texterkennung läuft lokal. Im nächsten Schritt Angaben korrigieren und einzeln bestätigen. Maße bleiben offen.</p>
    <label for="erf-etikett">Foto des Typenschilds wählen</label>
    <input id="erf-etikett" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" ${ent.etikettLaedt ? 'disabled' : ''}>
    ${ent.etikettLaedt ? '<p role="status">Etikett wird gelesen … Bitte warten.</p>' : ''}
    ${ent.etikettFehler ? `<p role="alert" class="feld-meldung">${esc(ent.etikettFehler)}</p>` : ''}
    ${ent.etikett ? '<p role="status">Texterkennung fertig. Angaben in Schritt 3 prüfen.</p>' : ''}`;
}

function schritt3(ctx, ent) {
  const er = ent.erkennung;
  const g = GRUPPEN[ent.gruppe];
  return `<h2 id="h-erf">Welches Bauteil?</h2>
    <fieldset class="gruppenwahl" id="erf-gruppe-feld" tabindex="-1" ${ent.fehler.gruppe ? 'aria-describedby="fehler-gruppe"' : ''}><legend>Bauteilgruppe</legend>
      ${Object.entries(GRUPPEN).filter(([, x]) => x.erfassbar).map(([k, x]) => `<label class="gruppenkarte"><input type="radio" name="erf-gruppe" value="${k}" ${ent.gruppe === k ? 'checked' : ''} ${ent.fehler.gruppe ? 'aria-invalid="true"' : ''}><span><b>${esc(x.einzahl)}</b><small>${esc(x.typ)} · Menge in ${esc(x.einheit)}</small>${er?.gruppe === k ? chip('vorgeschlagen (Simulation)', 'sim') : ''}</span></label>`).join('')}
    </fieldset>${fehlerText(ent, 'gruppe')}
    <div class="formular formular-eng">
      <div class="feld"><label for="erf-menge">Menge${g ? ` in ${esc(g.einheit)}` : ''}</label><input id="erf-menge" inputmode="decimal" value="${esc(ent.menge)}" ${ent.fehler.menge ? 'aria-invalid="true" aria-describedby="fehler-menge"' : ''}>${fehlerText(ent, 'menge')}</div>
      <div class="feld"><label for="erf-verfuegbar">Verfügbar ab</label><input id="erf-verfuegbar" type="date" value="${esc(ent.verfuegbarAb)}">${fehlerText(ent, 'verfuegbarAb')}</div>
    </div>
    <fieldset class="zustandswahl"><legend>Zustand nach Sichtprüfung</legend>
      ${Object.entries(ZUSTAND).map(([k, t]) => `<label class="zustandschip"><input type="radio" name="erf-zustand" value="${k}" ${ent.zustand === k ? 'checked' : ''}><span><b class="zustand z-${k}">${k}</b>${esc(t)}</span></label>`).join('')}
    </fieldset>
    <div class="feld"><label for="erf-notiz">Notiz zum Zustand</label><input id="erf-notiz" value="${esc(ent.notiz)}" placeholder="z. B. Kantenschaden unten links"></div>${etikettFelder(ent)}`;
}

function etikettFelder(ent) {
 if (!ent.etikett) return '';
 const e=ent.etikett;
 return `<section aria-labelledby="etikett-titel"><h3 id="etikett-titel">Angaben vom Typenschild prüfen</h3>
 <p>Jede übernommene Angabe am Foto prüfen und bestätigen. Falsche Vorschläge korrigieren oder leeren. Bestätigung betrifft nur den Text, keine technische Eignung.</p>
 ${e.foto ? `<img src="${esc(e.foto.daten)}" alt="Gewähltes Typenschild als Prüfreferenz" style="max-width:100%;max-height:300px;object-fit:contain">` : ''}
 <details><summary>Erkannten Text anzeigen</summary><pre style="white-space:pre-wrap">${esc(e.scan.rohtext)}</pre></details>
 ${e.scan.hinweise.map(h=>`<p class="klein">${esc(h)}</p>`).join('')}
 <div class="formular">${Object.entries(FELDER).map(([k,label])=>`<div class="feld"><label for="etikett-${k}">${esc(label)}</label><input id="etikett-${k}" data-etikett="${k}" maxlength="120" value="${esc(e.pruefung[k].wert)}"><label><input type="checkbox" data-etikett-check="${k}" ${e.pruefung[k].geprueft?'checked':''}> Am Foto geprüft</label><small>${esc(e.scan.felder[k].status==='vorgeschlagen'?'OCR-Vorschlag, ungeprüft':e.scan.felder[k].status==='uneindeutig'?'Uneindeutig, manuell klären':'Keine Angabe erkannt')}</small></div>`).join('')}</div>
 ${fehlerText(ent,'etikett')}</section>`;
}

function schritt4(ctx, ent) {
  const g = GRUPPEN[ent.gruppe];
  if (!g) return '<h2 id="h-erf">Angaben</h2><p>Bitte zuerst eine Bauteilgruppe wählen.</p>';
  return `<h2 id="h-erf">Angaben zu ${esc(g.einzahl)}</h2>
    <p class="leise">Jede Angabe hat einen Status. Getippte Maße gelten als <b>gemessen</b>, übernommene Vorschläge als <b>bestätigt</b>, aber nicht gemessen.</p>
    <div class="wertfelder">${g.felder.map((f) => wertfeld(ent, f)).join('')}</div>
    <p class="legende-zeile">${Object.keys(WERTSTATUS).map((k) => `${wertChip(k)} <small>${esc(WERTSTATUS[k].text)}</small>`).join(' ')}</p>`;
}

function wertfeld(ent, f) {
  const w = ent.werte[f.key] || { eingabe: '', status: 'fehlt', quelle: '' };
  const id = `w-${f.key}`;
  const fehler = ent.fehler[`wert-${f.key}`];
  const attr = `id="${id}" data-wert="${f.key}" ${fehler ? `aria-invalid="true" aria-describedby="${id}-f"` : ''}`;
  const eingabe = f.art === 'mass' ? `<span class="einheit-feld"><input ${attr} inputmode="decimal" value="${esc(w.eingabe)}" placeholder="messen"><span>${esc(f.einheit)}</span></span>`
    : f.art === 'wahl' ? `<select ${attr}><option value="">nicht angegeben</option>${f.optionen.map((o) => `<option ${o === w.eingabe ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`
      : `<input ${attr} value="${esc(w.eingabe)}">`;
  return `<div class="wertfeld ${fehler ? 'feld-fehler' : ''}">
    <div class="wf-kopf"><label for="${id}">${esc(f.label)}${f.bezug ? `<small>Bezug: ${esc(f.bezug)}</small>` : ''}</label>${wertChip(w.status)}</div>
    <div class="wf-eingabe">${eingabe}
      ${w.status === 'vorgeschlagen' ? `<button type="button" class="knopf-zweit knopf-klein" id="ueb-${f.key}" data-action="erf-uebernehmen" data-key="${f.key}">Vorschlag übernehmen</button>` : ''}
      ${w.status !== 'fehlt' ? `<button type="button" class="knopf-leise knopf-klein" id="leer-${f.key}" data-action="erf-leeren" data-key="${f.key}" aria-label="${esc(f.label)} leeren">Leeren</button>` : ''}</div>
    <small class="wf-quelle">${w.quelle ? `Quelle: ${esc(w.quelle)}` : 'Keine Angabe'}${f.hinweis ? ` · ${esc(f.hinweis)}` : ''}</small>
    ${fehler ? `<p class="feld-meldung" id="${id}-f">${esc(fehler)}</p>` : ''}
  </div>`;
}

function schritt5(ctx, ent, projekte, p, ort) {
  const g = GRUPPEN[ent.gruppe];
  const fehler = pruefeErfassung(ent);
  const n = Object.keys(fehler).length;
  return `<h2 id="h-erf">Prüfen und speichern</h2>
    ${n ? `<div class="ergebnisbox fehlerbox" id="erf-fehler" tabindex="-1" role="alert"><p><b>${n} Angabe${n === 1 ? '' : 'n'} verhindern das Speichern.</b></p><ul>${Object.entries(fehler).map(([k, t]) => { const s = k === 'ort' ? 1 : k.startsWith('wert-') ? 4 : 3; return `<li>${esc(t)} <button type="button" class="knopf-leise knopf-klein" data-action="erf-gehe" data-schritt="${s}">Zu Schritt ${s}: ${SCHRITTE[s - 1]}</button></li>`; }).join('')}</ul></div>` : ''}
    <div class="pruefraster">
      <div class="pr-foto">${ent.foto ? `<img src="${esc(ent.foto.daten)}" alt="Foto zur Erfassung">` : '<div class="skizze-leer"><small>Kein Foto</small></div>'}</div>
      <dl class="werte">
        <div><dt>Ort</dt><dd>${p ? `${pchip(p)} ${esc(p.name)}` : '–'}${ort ? `<small>${esc(ort.etage.name)} · Raum ${esc(ort.raum.id)} ${esc(ort.raum.name)}</small>` : ''}</dd></div>
        <div><dt>Bauteil</dt><dd>${g ? `${esc(g.einzahl)} · ${esc(g.typ)}` : '–'}${ent.erkennung ? chip('Vorschlag aus Simulation', 'sim') : ''}</dd></div>
        <div><dt>Menge</dt><dd class="mono">${esc(ent.menge)} ${g ? esc(g.einheit) : ''}</dd></div>
        <div><dt>Zustand</dt><dd>${ent.zustand ? `<span class="zustand z-${ent.zustand}">${ent.zustand}</span> ${esc(ZUSTAND[ent.zustand])}` : 'nicht angegeben'}</dd></div>
        <div><dt>Verfügbar ab</dt><dd>${ent.verfuegbarAb ? datum(ent.verfuegbarAb + 'T00:00') : 'nicht angegeben'}</dd></div>
      </dl>
    </div>
    ${ent.etikett ? etikettFelder(ent) : ''}
    ${g ? `<ul class="prueffelder" aria-label="Angaben mit Status">${g.felder.map((f) => { const w = ent.werte[f.key] || { status: 'fehlt' }; const anzeige = w.status === 'fehlt' ? '–' : wertText(f, { wert: w.eingabe }); return `<li><span class="pf-text"><span class="pf-name">${esc(f.label)}</span><span class="pf-wert mono">${esc(anzeige)}</span></span>${wertChip(w.status)}</li>`; }).join('')}</ul>` : ''}
    <p class="klein">Nach dem Speichern erscheint das Bauteil im Bestand von ${p ? esc(p.kurz) : 'diesem Projekt'} und hat einen eigenen Pass. Fehlende und vorgeschlagene Angaben stehen dort als offene Nachweise.</p>`;
}

function gespeichert(ctx, gs) {
  const b = ctx.daten.bauteile.find((x) => `${x.projekt}:${x.id}` === gs.key);
  const p = b && ctx.daten.projekte.find((x) => x.kurz === b.projekt);
  if (!b || !p) return leer('Erfassung nicht gefunden.', 'Die gespeicherte Erfassung ist nicht mehr vorhanden.', '<button type="button" class="knopf" data-action="erf-neu">Neues Bauteil erfassen</button>');
  return `${seitenkopf({ eyebrow: 'Erfassen', titel: 'Gespeichert' })}
  <section class="flaeche gespeichert" role="status" aria-labelledby="h-gesp">
    <p class="gesp-icon">${icon('haken')}</p>
    <h2 id="h-gesp" tabindex="-1">${pchip(p)} <span class="mono">${esc(b.id)}</span> ${esc(b.name)} ist im Bestand</h2>
    <p>Raum ${esc(b.raum)} · ${gs.fotoHinweis ? esc(gs.fotoHinweis) : b.foto ? 'mit Foto' : 'ohne Foto'}. Gespeichert in diesem Browser.</p>
    <div class="ergebnis-aktionen">
      <a class="knopf" href="${routePass(b)}">Bauteilpass öffnen</a>
      <a class="knopf-zweit" href="#bestand-${slug(p.kurz)}">Im Bestand ansehen</a>
      <button type="button" class="knopf-leise" data-action="erf-neu" data-projekt="${esc(b.projekt)}" data-raum="${esc(b.raum)}">Weiteres Bauteil im selben Raum</button>
    </div>
  </section>`;
}

function meineErfassungen(ctx) {
  const eigene = ctx.daten.bauteile.filter((b) => b.erfassung?.art === 'Mobile Erfassung');
  // Zurücksetzen gibt es, sobald irgendetwas Eigenes gespeichert ist, nicht nur bei Erfassungen.
  if (!eigene.length && !ctx.eigeneAenderungen) return '';
  const reset = ctx.ui.resetFrage
    ? '<span class="reset-frage">Alle eigenen Erfassungen und Änderungen löschen? <button type="button" class="knopf-leise knopf-klein" data-action="reset-ja">Ja, löschen</button> <button type="button" class="knopf-leise knopf-klein" data-action="reset-nein">Abbrechen</button></span>'
    : '<button type="button" class="knopf-leise knopf-klein" data-action="reset-frage">Zurücksetzen</button>';
  return `<section class="block meine" aria-labelledby="h-meine">
    <div class="block-kopf"><h2 id="h-meine">In diesem Browser gespeichert</h2>${reset}</div>
    ${eigene.length ? `<ul class="flaeche kompaktliste">${eigene.map((b) => `<li><a href="${routePass(b)}"><span class="mono">${esc(b.projekt)} · ${esc(b.id)}</span><span><b>${esc(b.name)}</b><small>Raum ${esc(b.raum)} · ${b.foto ? 'mit Foto' : 'ohne Foto'}</small></span></a></li>`).join('')}</ul>` : ''}
    <p class="leise">${ctx.eigeneAenderungen} eigene ${ctx.eigeneAenderungen === 1 ? 'Änderung' : 'Änderungen'} (Erfassungen, Zuordnungen, Aufmaße, Radar-Prüfungen, Meldungen). Sie liegen nur in diesem Browser.</p>
  </section>`;
}

