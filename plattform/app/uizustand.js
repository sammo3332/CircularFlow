// Zustand der Oberfläche (Filter, Auswahl, Entwürfe). Liegt hier statt in main.js, damit die Ansichten auch ohne Browser prüfbar sind.
// Filter stehen bewusst nicht im Hash: veröffentlichte claude.ai-Seiten reichen nur „#name“ durch.
import { PROJEKTZEITEN } from './daten.js';
import { leererEntwurf } from './ansichten/erfassung.js';
import { leereMeldung } from './ansichten/radar.js';

export const leererKatalog = () => ({ q: '', gruppe: '', bezirk: '', bis: '', mindest: '', offen: false, alle: false, vorgabe: null });
export const leereBedarfsliste = () => ({ gruppe: '', projekt: '', offen: false });
export const leererBestand = () => ({ q: '', gruppe: '', status: '', etage: '', offen: false, mobil: false });
export const leereRadarFilter = () => ({ status: '', notiz: {}, bezirk: {}, verwerfen: {}, fehler: {}, meldung: leereMeldung(), meldungFehler: {}, gespeichert: null });

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
    zuletzt: null, zielWahl: null, zuordnungFehler: '', resetFrage: false, fokus: null, fokusNachRoute: null, speicherHinweis: '',
  };
}
