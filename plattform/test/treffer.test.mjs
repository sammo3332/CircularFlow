import test from 'node:test';
import assert from 'node:assert/strict';
import { kontext, kleinKontext, bedarf } from './_hilfe.mjs';
import { abgleichListe, pruefbitteAnlegen } from '../app/abgleich.js';
import { bedarfKennung, leererTrefferstand, bedarfBeobachten, trefferErmitteln, trefferZentrale } from '../app/treffer.js';
import { trefferSeite, trefferBanner, trefferSchalter } from '../app/ansichten/treffer.js';
import { pilotraumLaden, pilotraumSpeichern } from '../app/sync.js';
import { pilotAktionen } from '../app/pilot-aktionen.js';
import { neuerUiZustand } from '../app/uizustand.js';
import { leerePersistenz, baueDaten } from '../app/zustand.js';

const c = kontext(); const d = bedarf(c, 'SB', 'BD-22');
const beobachtet = (d) => bedarfBeobachten(leererTrefferstand(), d, true);
const speicher = () => { const m = new Map(); return { getItem: (k) => m.get(k) || null, setItem: (k, v) => m.set(k, v) }; };

test('Ohne Beobachtung gibt es keine ungefragten Hinweise auf Demo-Bedarfe', () => {
  assert.equal(trefferErmitteln(c, leererTrefferstand()).anzahlNeu, 0);
});
test('Beobachteter Bedarf: nur Weiter prüfen und Knapp, keine automatische Zuordnung', () => {
  assert.ok(d); const s = beobachtet(d); const vorher = JSON.stringify(c);
  const t = trefferErmitteln(c, s);
  assert.ok(t.anzahlNeu > 0);
  assert.deepEqual(t.paare.map((a) => a.schluessel), abgleichListe(c, { bedarf: d, ergebnis: ['weiter', 'knapp'] }).map((a) => a.schluessel));
  assert.ok(t.paare.every((a) => ['weiter', 'knapp'].includes(a.gesamt.key)));
  assert.equal(JSON.stringify(c), vorher);
});
test('Neues Angebot trifft nachträglich ein: Hinweis ohne Katalogsuche; andere Gruppe bleibt außen vor', () => {
  const a = abgleichListe(c, { bedarf: d, ergebnis: 'weiter' })[0]; assert.ok(a);
  const cc = kleinKontext([], [d], c.at, c.daten.projekte); const s = beobachtet(d);
  assert.equal(trefferErmitteln(cc, s).anzahlNeu, 0);
  cc.daten.bauteile.push({ ...a.bauteil, id: 'NEU-1' });
  assert.equal(trefferErmitteln(cc, s).anzahlNeu, 1);
  cc.daten.bauteile.push({ ...a.bauteil, id: 'NEU-2', gruppe: 'licht' });
  assert.equal(trefferErmitteln(cc, s).anzahlNeu, 1);
});
test('Fehlende Angaben, verspätete und zurückgezogene Angebote sind keine Trefferhinweise', () => {
  const a = abgleichListe(c, { bedarf: d, ergebnis: 'weiter' })[0];
  for (const b of [{ ...a.bauteil, verfuegbarAb: null }, { ...a.bauteil, verfuegbarAb: '2028-01-01' }, { ...a.bauteil, status: 'nicht' }]) {
    assert.equal(trefferErmitteln(kleinKontext([b], [d], c.at, c.daten.projekte), beobachtet(d)).anzahlNeu, 0);
  }
});
test('Lesestatus überlebt Neuladen; erst ein weiteres Angebot erhöht die Zahl', () => {
  const st = speicher(); const z = trefferZentrale(st); z.beobachten(c, d, true);
  const erstes = z.stand(c).paare[0]; z.gelesen(c, erstes.schluessel);
  const z2 = trefferZentrale(st); assert.equal(z2.stand(c).paare.find((a) => a.schluessel === erstes.schluessel).neu, false);
  z2.gelesen(c); assert.equal(z2.stand(c).anzahlNeu, 0);
  const cc = { ...c, daten: { ...c.daten, bauteile: [...c.daten.bauteile, { ...erstes.bauteil, id: 'NEU-99' }] } };
  assert.equal(z2.stand(cc).anzahlNeu, 1);
});
test('Ein laufender Vorgang entfernt seine Treffer und neue Hinweise bleiben ohne Eignungszusage', () => {
  const cc = kontext(); const a = abgleichListe(cc, { bedarf: d, ergebnis: 'weiter' })[0]; const r = pruefbitteAnlegen(cc, a);
  assert.ok(r.zuordnung); cc.daten.entscheidungen.push(r.zuordnung); cc.ereignisse.push(r.ereignis);
  assert.equal(trefferErmitteln(cc, beobachtet(d)).anzahlNeu, 0);
});
test('Abschalten und Zurücksetzen entfernen Hinweise; unbekannte Links bestätigen nichts', () => {
  const z = trefferZentrale(speicher()); z.beobachten(c, d, true); const n = z.stand(c).anzahlNeu;
  z.gelesen(c, 'unbekannt'); assert.equal(z.stand(c).anzahlNeu, n);
  z.beobachten(c, d, false); assert.equal(z.stand(c).anzahlNeu, 0);
  z.beobachten(c, d, true); z.reset(c); assert.equal(z.stand(c).beobachtet.length, 0);
});
test('Einstellungen pro Pilotraum und Browser; keine Zugangsschlüssel in Trefferdaten', () => {
  const st = speicher(); const z = trefferZentrale(st);
  const raum = (raum) => ({ ...c, ui: { pilotraum: { url: 'https://pilot.example', raum, schluessel: 'geheim' } } });
  z.beobachten(raum('a'), d, true); assert.ok(z.stand(raum('a')).anzahlNeu);
  assert.equal(z.stand(raum('b')).anzahlNeu, 0); assert.equal(z.stand(c).anzahlNeu, 0);
  assert.equal(trefferZentrale(speicher()).stand(raum('a')).anzahlNeu, 0);
  pilotraumSpeichern(st, { url: 'https://pilot.example', raum: 'a', schluessel: 'geheim' });
  assert.equal(pilotraumLaden(st).raum, 'a');
});
test('Nicht verfügbarer oder voller Speicher: weiter bedienbar, Warnung, nur flüchtiger Lesestatus', () => {
  for (const st of [null, { getItem() { return '{kaputt'; }, setItem() { throw new Error('voll'); } }]) {
    const z = trefferZentrale(st); z.beobachten(c, d, true); assert.ok(z.stand(c).anzahlNeu);
    assert.equal(z.stand(c).speicherFehler, true); z.gelesen(c); assert.equal(z.stand(c).anzahlNeu, 0);
  }
});
test('Darstellung: Direktlink, klarer Status, sichere Texte und Fachgrenze', () => {
  const z = trefferZentrale(speicher()); z.beobachten(c, d, true);
  const ctx = { ...c, treffer: z.stand(c) };
  assert.match(trefferBanner(ctx), /#treffer/);
  assert.match(trefferSeite(ctx), /data-action="treffer-lesen"/);
  assert.match(trefferSchalter(ctx, d), /aria-pressed="true"/);
  assert.match(trefferSeite(ctx), /keine Push-Nachricht/);
  assert.match(trefferSeite(ctx), /nicht automatisch bewertet/);
  const x = { ...ctx, treffer: structuredClone(ctx.treffer) }; x.treffer.paare[0].bauteil.name = '<img src=x onerror=alert(1)>';
  assert.ok(!trefferSeite(x).includes('<img src=x')); assert.ok(trefferSeite(x).includes('&lt;img'));
  assert.equal(bedarfKennung(d), JSON.stringify([d.projekt, d.id]));
});

// Teilmengen bleiben wie im bisherigen Abgleich Vorschläge; die Lücke muss sichtbar sein.
test('Teilmenge wird nicht als vollständige Deckung dargestellt', () => {
  const a = abgleichListe(c, { bedarf: d, ergebnis: 'weiter' })[0];
  const cc = kleinKontext([{ ...a.bauteil, menge: 1 }], [d], c.at, c.daten.projekte);
  const z = trefferZentrale(speicher()); z.beobachten(cc, d, true);
  const t = z.stand(cc); assert.equal(t.paare.length, 1); assert.equal(t.paare[0].menge.status, 'teilweise');
  assert.match(trefferSeite({ ...cc, treffer: t }), /Es fehlen/);
});
test('Knapp wird gemeldet; ein späterer Stichtag kann Vorschläge entfernen', () => {
  const a = abgleichListe(c, { bedarf: d, ergebnis: 'weiter' })[0];
  const dd = { ...d, bestellfrist: '2026-11-28' };
  const cc = kleinKontext([a.bauteil], [dd], c.at, c.daten.projekte);
  const t = trefferErmitteln(cc, beobachtet(dd)); assert.equal(t.paare[0].gesamt.key, 'knapp');
  cc.at = '2026-12-01T14:00'; assert.equal(trefferErmitteln(cc, beobachtet(dd)).anzahlNeu, 0);
});

test('Später verbundener Pilotraum: automatischer Abgleich erzeugt einen neuen Hinweis ohne Suche', { timeout: 2000 }, async (t) => {
  const alterDocument = globalThis.document; let tick;
  globalThis.document = { hidden: false, addEventListener() {} };
  t.after(() => { if (alterDocument === undefined) delete globalThis.document; else globalThis.document = alterDocument; });
  t.mock.method(globalThis, 'setInterval', (fn, ms) => { assert.equal(ms, 20000); tick = fn; return 0; });
  const ui = neuerUiZustand(); const st = speicher(); let p = leerePersistenz();
  const ctx = () => ({ ...kontext(p), ui }); const z = trefferZentrale(st);
  const fremd = leerePersistenz();
  const a = abgleichListe(c, { bedarf: d, ergebnis: 'weiter' })[0];
  fremd.erfassungen.push({ ...a.bauteil, id: 'NEU-REMOTE' });
  t.mock.method(globalThis, 'fetch', async () => ({ status: 200, ok: true, json: async () => ({ raum: 'a', name: 'Test', rechte: 'lesen', version: 1, daten: fremd }) }));
  let fertig; const gerendert = new Promise((resolve) => { fertig = resolve; });
  const ak = pilotAktionen({ ui, ctx, speicher: st, datenHolen: () => ({ p, db: baueDaten(p) }), datenSetzen: (neu) => { p = neu; }, render: () => fertig(), melde() {}, gehe() {}, uebernehmen() {} });
  ak.start(); assert.equal(typeof tick, 'function', 'Abgleich startet auch ohne gespeicherte Verbindung');
  Object.assign(ui.pilotraum, { status: 'verbunden', raum: 'a', url: 'https://pilot.example', schluessel: 'testschluessel' });
  z.beobachten(ctx(), d, true); z.gelesen(ctx()); assert.equal(z.stand(ctx()).anzahlNeu, 0);
  tick(); await gerendert;
  assert.equal(z.stand(ctx()).anzahlNeu, 1);
  assert.equal(z.stand(ctx()).paare.find((a) => a.neu).bauteil.id, 'NEU-REMOTE');
});
