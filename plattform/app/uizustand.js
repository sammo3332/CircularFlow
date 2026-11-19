// Zustand der Oberfläche (Filter, Auswahl, Entwürfe). Liegt hier statt in main.js, damit die Ansichten auch ohne Browser prüfbar sind.
// Filter stehen bewusst nicht im Hash: veröffentlichte claude.ai-Seiten reichen nur „#name“ durch.
import { PROJEKTZEITEN } from './daten.js';
import { leererEntwurf } from './ansichten/erfassung.js';
import { leereMeldung } from './ansichten/radar.js';
import { entwurfAusBedarf } from './bedarf.js';

export const leererKatalog = () => ({ q: '', gruppe: '', bezirk: '', bis: '', mindest: '', offen: false, alle: false, vorgabe: null });
export const leereBedarfsliste = () => ({ gruppe: '', projekt: '', offen: false });
export const leererBestand = () => ({ q: '', gruppe: '', status: '', etage: '', offen: false, mobil: false });
export const leereRadarFilter = () => ({ status: '', notiz: {}, bezirk: {}, verwerfen: {}, fehler: {}, meldung: leereMeldung(), meldungFehler: {}, gespeichert: null });

// Formulare (Fassung 2): Entwurf und Fehler je Feld. Die Prüfung selbst steckt in bedarf.js, projektanlage.js und vorgang.js.
export const leererBedarfEntwurf = (projekt = '') => ({ projekt, gruppe: '', raum: '', titel: '', menge: '', bestellfrist: '', pruefzeitTage: '', annahmeVon: '', annahmeBis: '', anforderungen: '', zustaendig: '', geschaetzt: { bestellfrist: false, pruefzeitTage: false, annahme: false } });
export const leeresBedarfsformular = () => ({ schluessel: '', entwurf: leererBedarfEntwurf(), fehler: {} });
// Startet das Formular neu (Route gewechselt): ohne bedarf = neuer Bedarf, sonst Ergänzung des vorhandenen.
export const bedarfsformularStarten = (ui, bedarf = null) => {
  ui.bedarfForm = bedarf ? { schluessel: `${bedarf.projekt}:${bedarf.id}`, entwurf: entwurfAusBedarf(bedarf), fehler: {} } : { schluessel: 'neu', entwurf: leererBedarfEntwurf(ui.bedarfe?.projekt || ''), fehler: {} };
};
export const leeresProjektformular = () => ({ entwurf: { name: '', zusatz: '', art: '', bezirk: '', rueckbauAb: '', entscheidungBis: '', gebaeudeName: '', etagen: '1', raeume: '4' }, fehler: {} });
export const leeresVorgangsformular = () => ({ k: '', eingabe: {}, fehler: {}, aktion: '' });
// Pilotbetrieb: Anfrage, Dienstleister, Angebot bearbeiten, Verkauf/Provision und Interesse. Entwurf und Fehler je Formular.
export const leeresPilotformular = () => ({ anfrage: { entwurf: null, fehler: {} }, dienstleister: { entwurf: null, fehler: {}, offen: false }, angebot: { k: '', entwurf: null, fehler: {}, offen: false }, verkauf: { k: '', eingabe: {}, fehler: {} }, provision: { k: '', eingabe: {}, fehler: {} }, interesse: { k: '', notiz: '', fehler: {} }, schritt: { id: '', eingabe: {}, fehler: {}, aktion: '' }, datei: { fehler: '', meldung: '' } });

export function neuerUiZustand() {
  return {
    at: PROJEKTZEITEN[0].at,
    schmal: false,
    start: { region: 'dortmund', art: '', nurAngebote: false, osm: false, ansicht: null },
    gebaeude: {},
    bestand: leererBestand(),
    erfassung: leererEntwurf(),
    radar: leereRadarFilter(),
    importe: { ifc: null, ifcSim: false, scanSim: false },
    uebersicht: { tage: 90 },
    katalog: leererKatalog(),
    bedarfe: leereBedarfsliste(),
    abgleich: { ergebnis: '' },
    vorgaenge: { status: '' },
    bedarfForm: leeresBedarfsformular(),
    projektForm: leeresProjektformular(),
    vorgangForm: leeresVorgangsformular(),
    pilot: leeresPilotformular(),
    pilotraum: { raum: '', url: '', schluessel: '', status: 'getrennt', name: '', rechte: '', fehler: '', version: 0, zuletzt: '' },
    zuletzt: null, zielWahl: null, zuordnungFehler: '', resetFrage: false, fokus: null, fokusNachRoute: null, speicherHinweis: '',
  };
}

