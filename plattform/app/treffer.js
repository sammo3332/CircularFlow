// Hinweise im geöffneten Browser. Verwendet die vorhandenen Regeln, keine neue Matching-Logik.
import { abgleichListe } from './abgleich.js';

export const bedarfKennung = (d) => JSON.stringify([d.projekt, d.id]);
export const leererTrefferstand = () => ({ beobachtet: [], gelesen: [] });
export function trefferBereich(ctx) {
  const r = ctx.ui?.pilotraum;
  return r?.raum ? JSON.stringify([String(r.url || '').replace(/\/+$/, ''), r.raum]) : 'lokal';
}
const liste = (a) => Array.isArray(a) ? [...new Set(a.filter((x) => typeof x === 'string'))] : [];
export function bereinigeTrefferstand(s) { return { beobachtet: liste(s?.beobachtet), gelesen: liste(s?.gelesen) }; }
export function bedarfBeobachten(s, d, an) {
  const neu = bereinigeTrefferstand(s); const k = bedarfKennung(d);
  neu.beobachtet = an ? [...new Set([...neu.beobachtet, k])] : neu.beobachtet.filter((x) => x !== k);
  return neu;
}
export function trefferErmitteln(ctx, s) {
  const beobachtet = new Set(s.beobachtet); const gelesen = new Set(s.gelesen);
  // Nur die ausdrücklich beobachteten Bedarfe, nur derzeit prüfbare Paare.
  const paare = ctx.daten.bedarfe.filter((d) => beobachtet.has(bedarfKennung(d)))
    .flatMap((d) => abgleichListe(ctx, { bedarf: d, ergebnis: ['weiter', 'knapp'] }));
  return { beobachtet: ctx.daten.bedarfe.filter((d) => beobachtet.has(bedarfKennung(d))),
    paare: paare.map((a) => ({ ...a, neu: !gelesen.has(a.schluessel) })),
    anzahlNeu: paare.filter((a) => !gelesen.has(a.schluessel)).length };
}

// Getrennt vom geteilten Datenstand: Lesen in einem Browser bestätigt nichts bei anderen Personen.
export function trefferZentrale(speicher) {
  const fluechtig = new Map(); let speicherFehler = !speicher;
  const key = (ctx) => `circularflow-treffer-v1:${encodeURIComponent(trefferBereich(ctx))}`;
  function laden(ctx) {
    const k = key(ctx);
    if (fluechtig.has(k)) return fluechtig.get(k);
    try { return bereinigeTrefferstand(JSON.parse(speicher?.getItem(k) || 'null')); }
    catch { return leererTrefferstand(); }
  }
  function speichern(ctx, s) {
    const k = key(ctx);
    try { if (!speicher) throw new Error(); speicher.setItem(k, JSON.stringify(s)); fluechtig.delete(k); speicherFehler = false; }
    catch { fluechtig.set(k, s); speicherFehler = true; }
  }
  return {
    stand(ctx) { const s = laden(ctx); return { ...trefferErmitteln(ctx, s), vorgaben: s, speicherFehler }; },
    beobachten(ctx, d, an) { speichern(ctx, bedarfBeobachten(laden(ctx), d, an)); },
    gelesen(ctx, schluessel) {
      const aktuell = trefferErmitteln(ctx, laden(ctx));
      const erlaubt = aktuell.paare.filter((a) => !schluessel || a.schluessel === schluessel).map((a) => a.schluessel);
      const s = laden(ctx); speichern(ctx, { ...s, gelesen: [...new Set([...s.gelesen, ...erlaubt])] });
    },
    reset(ctx) { speichern(ctx, leererTrefferstand()); },
  };
}
