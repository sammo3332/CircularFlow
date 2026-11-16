// Gemeinsame Testhilfen (keine eigenen Tests). Kontext wie in main.js: Daten aus Beispielstand plus Persistenz.
import * as R from '../../prototype/dist/door-rules.mjs';
import { baueDaten, leerePersistenz } from '../app/zustand.js';

export const START = '2026-11-18T14:00';
export const kontext = (p = leerePersistenz(), at = START) => ({ R, at, daten: baueDaten(p), ereignisse: p.ereignisse, ezustand: p.ezustand });
export const bauteil = (ctx, projekt, id) => ctx.daten.bauteile.find((b) => b.projekt === projekt && b.id === id);
export const bedarf = (ctx, projekt, id) => ctx.daten.bedarfe.find((b) => b.projekt === projekt && b.id === id);
export const entscheidung = (ctx, projekt, id) => ctx.daten.entscheidungen.find((e) => e.projekt === projekt && e.id === id);
// Minimaler Kontext für Einzelfälle mit frei gebauten Bauteilen und Bedarfen.
export const kleinKontext = (bauteile, bedarfe, at = START, projekte = []) => ({ R, at, daten: { projekte, bauteile, bedarfe, zieloeffnungen: [], entscheidungen: [] }, ereignisse: [], ezustand: {} });
