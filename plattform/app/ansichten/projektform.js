// Formular „Projekt erfassen“. Prüfung und Aufbau stecken in projektanlage.js; hier nur Darstellung.
// Zustand: ctx.ui.projektForm = { entwurf, fehler }. Eingaben schreibt main.js über data-ff="projekt" und name.
import { ARTEN, BEZIRKE } from '../daten.js';
import { ETAGEN_MAX, RAEUME_MAX } from '../projektanlage.js';
import { esc, feld, feldAttr, optionen, fehlerUebersicht, seitenkopf, projekteReiter, icon } from '../ui.js';

export const PROJEKT_FELD_ID = { name: 'pf-name', art: 'pf-art', bezirk: 'pf-bezirk', rueckbauAb: 'pf-rueckbau', entscheidungBis: 'pf-entscheidung', gebaeudeName: 'pf-gebaeude', etagen: 'pf-etagen', raeume: 'pf-raeume' };
export const PROJEKT_FELD_NAME = { name: 'Name', art: 'Art', bezirk: 'Bezirk', rueckbauAb: 'Ausbau ab', entscheidungBis: 'Entscheidung bis', gebaeudeName: 'Gebäudename', etagen: 'Etagen', raeume: 'Räume je Etage' };
export const erstesProjektFeld = (fehler) => Object.keys(PROJEKT_FELD_ID).find((k) => fehler[k]) || null;

export function projektFormular(ctx) {
  const f = ctx.ui.projektForm; const e = f.entwurf; const fe = f.fehler || {};
  const ff = (name, extra = '') => `name="${name}" data-ff="projekt"${extra}`;
  const fld = (id, key, label, hinweis, ctl, klasse = '') => feld({ id, label, hinweis, klasse, fehler: fe[key], control: ctl(feldAttr(id, fe[key], hinweis)) });
  const ne = Number(e.etagen); const nr = Number(e.raeume);
  const vorschau = Number.isInteger(ne) && Number.isInteger(nr) && ne >= 1 && ne <= ETAGEN_MAX && nr >= 1 && nr <= RAEUME_MAX
    ? `Es entstehen ${ne} ${ne === 1 ? 'Etage' : 'Etagen'} mit je ${nr} ${nr === 1 ? 'Raum' : 'Räumen'}, zusammen ${ne * nr} Räume mit schematischem Grundriss.` : '';
  return `${seitenkopf({
    pfad: [['#projekte', 'Projekte']], aktuell: 'Projekt erfassen', eyebrow: 'Projekte', titel: 'Projekt erfassen',
    untertitel: 'Legt ein Projekt mit einem Gebäude, Etagen und Räumen an. Der Grundriss ist schematisch, die Lage auf der Karte symbolisch (Mitte des Bezirks).',
  })}
  ${projekteReiter('neu')}
  <form id="projekt-form" class="formseite" data-form="projekt" novalidate>
    ${fehlerUebersicht('pf-fehler', fe, PROJEKT_FELD_NAME)}
    <p class="hinweisbox hinweis-daten">Bitte keine personenbezogenen Daten Dritter eintragen. Die Angaben bleiben nur in diesem Browser und sind nicht geprüft.</p>
    <section class="flaeche" aria-labelledby="h-pf-projekt">
      <h2 id="h-pf-projekt">Projekt</h2>
      <div class="formular formular-eng">
        ${fld('pf-name', 'name', 'Name (Pflicht)', 'Höchstens 80 Zeichen, ohne Namen von Personen.', (a) => `<input ${a} ${ff('name', ' maxlength="80" autocomplete="off"')} value="${esc(e.name)}">`, 'feld-breit')}
        ${fld('pf-art', 'art', 'Art der Maßnahme (Pflicht)', '', (a) => `<select ${a} ${ff('art')}>${optionen(Object.entries(ARTEN), e.art)}</select>`)}
        ${fld('pf-bezirk', 'bezirk', 'Stadtbezirk (Pflicht)', 'Die Lage auf der Karte ist die Mitte des Bezirks.', (a) => `<select ${a} ${ff('bezirk')}>${optionen(BEZIRKE.map((b) => [b, b]), e.bezirk)}</select>`)}
        ${fld('pf-rueckbau', 'rueckbauAb', 'Ausbau ab', 'Wann Bauteile frühestens ausgebaut werden. Wird beim Erfassen als „verfügbar ab“ vorgeschlagen.', (a) => `<input type="date" ${a} ${ff('rueckbauAb')} value="${esc(e.rueckbauAb)}">`)}
        ${fld('pf-entscheidung', 'entscheidungBis', 'Entscheidung bis', 'Spätestens zum Ausbau. Zählt in der Übersicht als Frist.', (a) => `<input type="date" ${a} ${ff('entscheidungBis')} value="${esc(e.entscheidungBis)}">`)}
      </div>
    </section>
    <section class="flaeche" aria-labelledby="h-pf-gebaeude">
      <h2 id="h-pf-gebaeude">Gebäude</h2>
      <div class="formular formular-eng">
        ${fld('pf-gebaeude', 'gebaeudeName', 'Gebäudename', 'Leer lassen für „Gebäude A“.', (a) => `<input ${a} ${ff('gebaeudeName', ' maxlength="60" autocomplete="off"')} value="${esc(e.gebaeudeName)}">`, 'feld-breit')}
        ${fld('pf-etagen', 'etagen', `Etagen (1 bis ${ETAGEN_MAX})`, 'Erdgeschoss zählt mit.', (a) => `<input ${a} ${ff('etagen', ' inputmode="numeric"')} value="${esc(e.etagen)}">`)}
        ${fld('pf-raeume', 'raeume', `Räume je Etage (1 bis ${RAEUME_MAX})`, '', (a) => `<input ${a} ${ff('raeume', ' inputmode="numeric"')} value="${esc(e.raeume)}">`)}
      </div>
      ${vorschau ? `<p class="leise" id="pf-vorschau">${esc(vorschau)}</p>` : ''}
    </section>
    <div class="formular-aktionen">
      <button type="submit" class="knopf" id="pf-speichern">${icon('haken')} Projekt speichern</button>
      <a class="knopf-leise" id="pf-abbrechen" href="#projekte">Abbrechen</a>
      <span class="leise">Speichert nur in diesem Browser. Nichts wird versendet.</span>
    </div>
  </form>`;
}
