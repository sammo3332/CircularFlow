// Datenstand sichern und laden (Datei) sowie Pilotraum verbinden (gemeinsamer Datenstand über den Pilotserver). Nur Darstellung.
import { esc, chip, icon, seitenkopf, tonSymbol } from '../ui.js';
import { zeit } from '../zeit.js';

export function pilotraumSeite(ctx) {
  return `${seitenkopf({ pfad: [['#erfassung', 'Erfassen']], aktuell: 'Daten und Pilotraum', eyebrow: 'Pilotbetrieb', titel: 'Daten sichern, laden und gemeinsam nutzen', untertitel: 'Ohne Pilotraum liegen eigene Einträge nur in diesem Browser auf diesem Gerät.' })}
  ${datenBlock(ctx)}${pilotraumBlock(ctx)}`;
}

export function datenBlock(ctx) {
  const d = ctx.ui.pilot.datei;
  return `<section class="flaeche" id="datenstand" aria-labelledby="h-daten">
    <div class="block-kopf"><h2 id="h-daten">Datenstand als Datei</h2><span class="leise">${ctx.eigeneAenderungen} eigene ${ctx.eigeneAenderungen === 1 ? 'Eintrag' : 'Einträge'}</span></div>
    <p class="leise">Sichert alle eigenen Einträge (Erfassungen mit Fotos, Bedarfe, Vorgänge, Anfragen) als Datei. So gehen sie nicht verloren und lassen sich auf einem anderen Gerät laden. Beispieldaten sind nicht enthalten.</p>
    <div class="ergebnis-aktionen">
      <button type="button" class="knopf-zweit" id="btn-daten-sichern" data-action="daten-sichern" ${ctx.eigeneAenderungen ? '' : 'disabled'}>${icon('haken')} Datenstand sichern (Datei)</button>
      <label class="knopf-zweit dateiknopf" for="daten-datei">Datenstand aus Datei laden<input type="file" id="daten-datei" accept="application/json,.json"></label>
    </div>
    <p class="klein">Beim Laden werden die Einträge der Datei mit den vorhandenen zusammengeführt: Gleiche Kennungen bleiben einmal erhalten, neue kommen dazu.</p>
    ${d.meldung ? `<p class="hinweisbox" role="status">${tonSymbol('ok')} <span>${esc(d.meldung)}</span></p>` : ''}
    ${d.fehler ? `<p class="feld-meldung" role="alert">${esc(d.fehler)}</p>` : ''}
  </section>`;
}

export function pilotraumBlock(ctx) {
  const r = ctx.ui.pilotraum; const verbunden = r.status === 'verbunden';
  return `<section class="flaeche" id="pilotraum" aria-labelledby="h-pilotraum">
    <div class="block-kopf"><h2 id="h-pilotraum">Pilotraum (gemeinsamer Datenstand)</h2>${verbunden ? chip(r.rechte === 'bearbeiten' ? 'verbunden · bearbeiten' : 'verbunden · nur lesen', 'ok') : r.status === 'fehler' ? chip('nicht verbunden', 'crit') : chip('nicht verbunden', 'neutral')}</div>
    <p class="leise">Ein Pilotraum liegt auf dem Pilotserver des Teams (eigener Rechner, kein externer Dienst). Berechtigte Personen mit Schlüssel sehen denselben Datenstand; andere Räume bleiben getrennt. Der Bearbeitungsschlüssel erlaubt Änderungen, der Leseschlüssel nur Ansicht.</p>
    ${verbunden ? `<dl class="werte">
        <div><dt>Raum</dt><dd>${esc(r.name)}<small>${esc(r.url)}</small></dd></div>
        <div><dt>Rechte</dt><dd>${r.rechte === 'bearbeiten' ? 'Bearbeiten: eigene Einträge werden in den Raum geschrieben.' : 'Nur Lesen: Änderungen bleiben lokal in diesem Browser.'}</dd></div>
        <div><dt>Stand</dt><dd>Fassung ${esc(String(r.version))}${r.zuletzt ? `, zuletzt abgeglichen ${zeit(r.zuletzt)}` : ''}</dd></div>
      </dl>
      ${r.fehler ? `<p class="feld-meldung" role="alert">${esc(r.fehler)}</p>` : ''}
      ${r.meldung ? `<p class="hinweisbox" role="status">${tonSymbol('ok')} <span>${esc(r.meldung)}</span></p>` : ''}
      <div class="ergebnis-aktionen"><button type="button" class="knopf-zweit" data-action="pilotraum-aktualisieren">Jetzt abgleichen</button> <button type="button" class="knopf-leise" data-action="pilotraum-trennen">Verbindung trennen</button></div>`
    : `<form class="vorgangsform" id="form-pilotraum" data-form="pilotraum" novalidate>
        <div class="formular formular-eng">
          <div class="feld"><label for="pr-url">Serveradresse</label><input id="pr-url" name="url" data-ff="pilotraum" autocomplete="off" placeholder="z. B. http://192.168.1.20:8000" value="${esc(r.url)}"><p class="feld-hinweis">Leer = derselbe Server, von dem diese Seite geladen wurde.</p></div>
          <div class="feld"><label for="pr-schluessel">Zugangsschlüssel</label><input id="pr-schluessel" name="schluessel" data-ff="pilotraum" type="password" autocomplete="off" value="${esc(r.schluessel)}"><p class="feld-hinweis">Vom Team erhalten (Bearbeitungs- oder Leseschlüssel). Wird nur auf diesem Gerät gespeichert.</p></div>
        </div>
        ${r.fehler ? `<p class="feld-meldung" role="alert">${esc(r.fehler)}</p>` : ''}
        <div class="formular-aktionen"><button type="submit" class="knopf" id="pr-verbinden">Verbinden</button></div>
        <p class="klein">Beim Verbinden werden eigene Einträge dieses Browsers in den Pilotraum übernommen (zusammengeführt) und der gemeinsame Stand geladen. Server starten: <span class="mono">node plattform/server/pilotserver.mjs</span>, Raum anlegen: <span class="mono">node plattform/server/pilotserver.mjs raum-anlegen "Name"</span>.</p>
      </form>`}
  </section>`;
}
