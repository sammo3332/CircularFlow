// Formular zum Erfassen und Ergänzen eines Bedarfs. Prüfung und Aufbau stecken in bedarf.js; hier nur Darstellung.
// Zustand: ctx.ui.bedarfForm = { schluessel, entwurf, fehler }. Eingaben schreibt main.js über data-ff="bedarf" und name.
import { GRUPPEN, PERSONEN } from '../daten.js';
import { BEDARF_ROLLEN } from '../bedarf.js';
import { esc, seitenkopf, feld, feldAttr, optionen, fehlerUebersicht, routeBedarf, icon } from '../ui.js';

// Fehlerschlüssel aus pruefeBedarf → Feld-ID; die Reihenfolge ist die Reihenfolge im Formular (erstes Feld mit Fehler bekommt den Fokus).
export const BEDARF_FELD_ID = { projekt: 'bf-projekt', gruppe: 'bf-gruppe', raum: 'bf-raum', titel: 'bf-titel', menge: 'bf-menge', bestellfrist: 'bf-bestellfrist', pruefzeitTage: 'bf-pruefzeit', annahmeVon: 'bf-annahme-von', annahmeBis: 'bf-annahme-bis', zustaendig: 'bf-zustaendig' };
export const BEDARF_FELD_NAME = { projekt: 'Projekt', gruppe: 'Bauteilgruppe', titel: 'Titel', menge: 'Menge', bestellfrist: 'Bestellfrist', pruefzeitTage: 'Mindestprüfzeit', annahmeVon: 'Annahmefenster von', annahmeBis: 'Annahmefenster bis', zustaendig: 'Zuständig' };
// In der Ergänzung sind diese Angaben des Beispielbedarfs nicht änderbar (Überlagerung ergänzt nur Zeit- und Zusatzangaben).
export const BEDARF_FESTE_FELDER = ['projekt', 'gruppe', 'raum', 'titel', 'menge'];
export const erstesBedarfFeld = (fehler) => Object.keys(BEDARF_FELD_ID).find((k) => fehler[k]) || null;

const art = (e, key) => (e.geschaetzt?.[key] ? 'geschaetzt' : 'belegt');
const artWahl = (e, key, id) => `<label class="art-wahl" for="${id}"><span>Diese Angabe ist</span><select id="${id}" name="art-${key}" data-ff="bedarf">${optionen([['belegt', 'belegt (z. B. Vertrag oder Plan)'], ['geschaetzt', 'geschätzt (Annahme)']], art(e, key), null)}</select></label>`;

export function bedarfFormular(ctx, d = null) {
  const f = ctx.ui.bedarfForm; const e = f.entwurf; const fe = f.fehler || {};
  const ergaenzen = Boolean(d); const fest = (k) => (ergaenzen && BEDARF_FESTE_FELDER.includes(k) ? ' disabled' : '');
  const p = ctx.daten.projekte.find((x) => x.kurz === e.projekt);
  const g = GRUPPEN[e.gruppe]; const projekte = ctx.daten.projekte;
  const raeume = (p?.gebaeude || []).flatMap((x) => x.etagen);
  const ff = (name, extra = '') => `name="${name}" data-ff="bedarf"${extra}`;
  // Ein Feld: Beschriftung, Hinweis, Fehler. ctl bekommt die Attribute (id, aria-invalid, aria-describedby).
  const fld = (id, key, label, hinweis, ctl, klasse = '') => feld({ id, label, hinweis, klasse, fehler: fe[key], control: ctl(feldAttr(id, fe[key], hinweis)) });
  const datum = (id, key, label, hinweis) => fld(id, key, label, hinweis, (a) => `<input type="date" ${a} ${ff(key)} value="${esc(e[key])}">`);
  const titel = ergaenzen ? `Bedarf ${d.id} ergänzen` : 'Bedarf erfassen';
  const zurueck = ergaenzen ? routeBedarf(d) : '#bedarfe';
  return `${seitenkopf({
    pfad: ergaenzen ? [['#bedarfe', 'Bedarfe'], [routeBedarf(d), d.id]] : [['#bedarfe', 'Bedarfe']], aktuell: ergaenzen ? 'Ergänzen' : 'Bedarf erfassen',
    eyebrow: 'Bedarf', titel,
    untertitel: ergaenzen ? 'Ergänzt wird, was für den Abgleich fehlt. Projekt, Gruppe, Titel und Menge des Bedarfs bleiben unverändert.'
      : 'Pflicht sind Projekt, Bauteilgruppe, Titel und Menge. Zeitangaben dürfen fehlen; der Bedarf wird dann im Abgleich als „Angaben fehlen“ markiert.',
  })}
  <form id="bedarf-form" class="formseite" data-form="bedarf" novalidate>
    ${fehlerUebersicht('bf-fehler', fe, BEDARF_FELD_NAME)}
    <p class="hinweisbox hinweis-daten">Bitte keine personenbezogenen Daten Dritter eintragen (Namen, Telefonnummern oder Adressen von Personen). Alle Eingaben bleiben nur in diesem Browser.</p>
    <section class="flaeche" aria-labelledby="h-bf-was">
      <h2 id="h-bf-was">Was wird gebraucht?</h2>
      <div class="formular formular-eng">
        ${fld('bf-projekt', 'projekt', 'Projekt (Pflicht)', '', (a) => `<select ${a} ${ff('projekt', ` data-neu-zeichnen="1"${fest('projekt')}`)}>${optionen(projekte.map((x) => [x.kurz, `${x.kurz} · ${x.name}`]), e.projekt)}</select>`)}
        ${fld('bf-gruppe', 'gruppe', 'Bauteilgruppe (Pflicht)', '', (a) => `<select ${a} ${ff('gruppe', ` data-neu-zeichnen="1"${fest('gruppe')}`)}>${optionen(Object.entries(GRUPPEN).map(([k, x]) => [k, x.name]), e.gruppe)}</select>`)}
        ${fld('bf-titel', 'titel', 'Titel (Pflicht)', 'z. B. „Innentüren Büroeinheiten“. Kurz und ohne Namen von Personen.', (a) => `<input ${a} ${ff('titel', ` maxlength="120"${fest('titel')}`)} value="${esc(e.titel)}">`, 'feld-breit')}
        ${fld('bf-menge', 'menge', `Menge (Pflicht)${g ? ` in ${esc(g.einheit)}` : ''}`, g ? `Die Einheit ${esc(g.einheit)} gehört zur Gruppe ${esc(g.name)} und ist nicht wählbar.` : 'Die Einheit folgt aus der Bauteilgruppe.', (a) => `<span class="einheit-feld"><input ${a} ${ff('menge', `${fest('menge')} inputmode="decimal"`)} value="${esc(e.menge)}"><span>${g ? esc(g.einheit) : '–'}</span></span>`)}
        ${fld('bf-raum', 'raum', 'Raum im Projekt (optional)', ergaenzen ? 'Beim Ergänzen nicht änderbar.' : 'Nur Räume des gewählten Projekts.', (a) => `<select ${a} ${ff('raum', p && !ergaenzen ? '' : ' disabled')}><option value="">${p ? 'Kein bestimmter Raum' : 'Erst Projekt wählen'}</option>${raeume.map((et) => `<optgroup label="${esc(et.id)} · ${esc(et.name)}">${et.raeume.map((r) => `<option value="${esc(r.id)}" ${r.id === e.raum ? 'selected' : ''}>${esc(r.id)} ${esc(r.name)}</option>`).join('')}</optgroup>`).join('')}</select>`)}
      </div>
    </section>
    <section class="flaeche" aria-labelledby="h-bf-zeit">
      <h2 id="h-bf-zeit">Zeitangaben <span class="leise">(dürfen fehlen)</span></h2>
      <p class="leise">Kalendertage. Fehlt eine Angabe, bleibt der Abgleich unvollständig. Geschätzte Angaben werden am Ergebnis genannt.</p>
      <div class="formular formular-eng">
        <div class="feldgruppe">${datum('bf-bestellfrist', 'bestellfrist', 'Bestellfrist', 'Letzter Tag, an dem bestellt werden kann.')}${artWahl(e, 'bestellfrist', 'bf-art-bestellfrist')}</div>
        <div class="feldgruppe">${fld('bf-pruefzeit', 'pruefzeitTage', 'Mindestprüfzeit in Tagen', 'Ganze Zahl von 0 bis 365.', (a) => `<input ${a} ${ff('pruefzeitTage', ' inputmode="numeric"')} value="${esc(e.pruefzeitTage)}">`)}${artWahl(e, 'pruefzeitTage', 'bf-art-pruefzeit')}</div>
        <div class="feldgruppe">${datum('bf-annahme-von', 'annahmeVon', 'Annahmefenster von', 'Ab wann Bauteile angenommen werden können.')}${artWahl(e, 'annahme', 'bf-art-annahme')}</div>
        <div class="feldgruppe">${datum('bf-annahme-bis', 'annahmeBis', 'Annahmefenster bis', 'Bis wann Bauteile angenommen werden können.')}<p class="leise art-hinweis">Die Angabe „belegt oder geschätzt“ links gilt für das ganze Annahmefenster.</p></div>
      </div>
    </section>
    <section class="flaeche" aria-labelledby="h-bf-mehr">
      <h2 id="h-bf-mehr">Weitere Angaben <span class="leise">(optional)</span></h2>
      <div class="formular formular-eng">
        ${fld('bf-anforderungen', 'anforderungen', 'Anforderungen', 'Freitext. Wird angezeigt, aber nicht maschinell bewertet.', (a) => `<textarea ${a} ${ff('anforderungen', ' rows="3" maxlength="600"')}>${esc(e.anforderungen)}</textarea>`, 'feld-breit')}
        ${fld('bf-zustaendig', 'zustaendig', 'Zuständig (Rolle)', '', (a) => `<select ${a} ${ff('zustaendig')}>${optionen(BEDARF_ROLLEN.map((r) => [r, PERSONEN[r].rolle]), e.zustaendig, 'nicht festgelegt')}</select>`)}
      </div>
    </section>
    <div class="formular-aktionen">
      <button type="submit" class="knopf" id="bf-speichern">${icon('haken')} Speichern</button>
      <a class="knopf-leise" id="bf-abbrechen" href="${zurueck}">Abbrechen</a>
      <span class="leise">Speichert nur in diesem Browser. Nichts wird versendet.</span>
    </div>
  </form>`;
}
