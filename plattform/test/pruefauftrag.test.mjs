// Prüfauftrag vom 16.11.2026 nach der Übergabe der Fassung 2:
// 1. Ein Fachergebnis lässt sich erst nach einer tatsächlich angelegten Prüfbitte eintragen, und jede Prüfbitte
//    (auch „Zur Fachprüfung vorlegen“) braucht dieselbe Freigabe durch Abgleich oder Türregel.
// 2. Ein laufender Vorgang bleibt nach Ablauf einer Frist dokumentierbar, und die verstrichene Frist ist sichtbar.
// 3. Doppelboden 7 m² gegen 57,2 m²: Die Lücke von mindestens 50,2 m² ist auch bei unbekannter Schadfläche erkennbar.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kontext, bauteil, bedarf, entscheidung, START } from './_hilfe.mjs';
import { leerePersistenz } from '../app/zustand.js';
import { neuerUiZustand } from '../app/uizustand.js';
import { PROJEKTZEITEN, PROJEKTE } from '../app/daten.js';
import { vorgangSchritt, vorgangStatus } from '../app/vorgang.js';
import { abgleich, pruefbitteAnlegen, pruefbitteErlaubt, lueckeText } from '../app/abgleich.js';
import { lageVorgang, schluessel, neueEntscheidung, bauteilAusErfassung } from '../app/regeln.js';
import { bedarfAusEntwurf } from '../app/bedarf.js';
import { kennzahlen } from '../app/kennzahlen.js';
import { entscheidungsSeite } from '../app/ansichten/entscheidung.js';
import { abgleichSeite, abgleichListeSeite } from '../app/ansichten/abgleich.js';
import { pass } from '../app/ansichten/bauteile.js';
import { bedarfDetail } from '../app/ansichten/bedarfe.js';

const NACH_FRIST = '2026-11-20T09:00';
const mitUi = (p, at = START) => ({ ...kontext(p, at), ui: neuerUiZustand(), geo: null, eigeneAenderungen: 0 });
const seite = (c, e) => entscheidungsSeite(c, c.daten.projekte.find((x) => x.kurz === e.projekt), e);
const formIds = (html) => [...html.matchAll(/<form class="vorgangsform[^"]*" id="vform-([a-z-]+)"/g)].map((m) => m[1]);
const flach = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const FACH = { urteil: 'geeignet', person: 'Fachplanung (Test)' };
const ereignis = (e, art, at, extra = {}) => ({ at, von: 'browser', bauteil: `${e.projekt}:${e.bauteil}`, entscheidung: schluessel(e.projekt, e.id), art, sim: true, text: art, ...extra });
// Prüfbitte über den Abgleich, wie in der Oberfläche („Prüfbitte anlegen“).
function mitPruefbitte(p, bauteilRef, bedarfRef, at = START) {
  const c = kontext(p, at);
  const r = pruefbitteAnlegen(c, abgleich(c, bauteil(c, ...bauteilRef), bedarf(c, ...bedarfRef)));
  assert.ok(r.zuordnung, JSON.stringify(r.fehler));
  p.zuordnungen.push(r.zuordnung); p.ereignisse.push(r.ereignis);
  return r.zuordnung;
}
function schritt(p, at, e, aktion, eingabe) {
  const c = kontext(p, at); const res = vorgangSchritt(c, entscheidung(c, e.projekt, e.id), aktion, eingabe);
  assert.ok(res.ereignis, `${aktion}: ${JSON.stringify(res.fehler)}`);
  p.ereignisse.push(res.ereignis);
  return res.ereignis;
}

// ---------- 1. Fachergebnis nur nach angelegter Prüfbitte ----------
test('Fachergebnis: ohne Prüfbitte weder Formular noch Eintrag, zu jeder Projektzeit', () => {
  for (const z of PROJEKTZEITEN) {
    const c = mitUi(leerePersistenz(), z.at);
    for (const id of ['E-01', 'E-02']) {
      const e = entscheidung(c, 'LH', id);
      assert.equal(vorgangStatus(c, e).key, 'offen');
      assert.match(vorgangSchritt(c, e, 'fachergebnis', FACH).fehler.allgemein, /im Status „Angelegt“ nicht möglich/, `${id} ${z.at}`);
      assert.ok(!formIds(seite(c, e)).includes('fachergebnis'), `${id} ${z.at}: kein Formular`);
    }
  }
});

test('Fachergebnis: gespeicherte Einträge ohne vorherige Prüfbitte zählen nicht', () => {
  const p = leerePersistenz(); const e = entscheidung(kontext(p), 'LH', 'E-01');
  p.ereignisse.push(ereignis(e, 'fachergebnis', START, { urteil: 'geeignet', person: 'X' }));
  let c = mitUi(p);
  assert.equal(vorgangStatus(c, e).key, 'offen'); assert.equal(vorgangStatus(c, e).fachergebnis, null);
  assert.ok(!formIds(seite(c, e)).includes('fachergebnis'));
  // Eine spätere Prüfbitte macht das frühere Fachergebnis nicht gültig; erst ein neues Fachergebnis zählt.
  p.ereignisse.push(ereignis(e, 'pruefbitte', '2026-11-18T15:30'));
  c = mitUi(p, '2026-11-18T15:30');
  assert.equal(vorgangStatus(c, e).key, 'pruefbitte'); assert.equal(vorgangStatus(c, e).fachergebnis, null);
  assert.deepEqual(formIds(seite(c, e)), ['fachergebnis', 'abbruch']);
});

test('Fachergebnis: eine Prüfbitte nach dem Stichtag zählt nicht, davor lässt sich nichts eintragen', () => {
  const p = leerePersistenz();
  const e = mitPruefbitte(p, ['KB', 'TW-05'], ['SB', 'BD-22'], '2026-11-19T09:00');
  const c = mitUi(p, START);
  assert.equal(vorgangStatus(c, e).key, 'offen');
  assert.ok(!formIds(seite(c, e)).includes('fachergebnis'));
  assert.match(vorgangSchritt(c, e, 'fachergebnis', FACH).fehler.allgemein, /Einträge nach diesem Stichtag/);
  assert.equal(schritt(p, '2026-11-19T09:00', e, 'fachergebnis', FACH).art, 'fachergebnis');
});

test('Prüfbitte: Erfüllte Bodenregel ersetzt sie nicht; E-02 bleibt gesperrt, bis der Abgleich sie erlaubt', () => {
  const p = leerePersistenz(); p.ezustand[schluessel('LH', 'E-02')] = { hoeheAm: START, lastAm: START };
  let c = mitUi(p); let e = entscheidung(c, 'LH', 'E-02');
  const l = lageVorgang(c, e);
  assert.equal(l.haupt.text, 'Fehlende Angaben zum Bedarf ergänzen'); assert.match(l.haupt.grund, /Mindestprüfzeit fehlt/);
  let html = seite(c, e);
  assert.doesNotMatch(html, /Zur Fachprüfung vorlegen/);
  assert.match(html, /id="aktion-bedarf-ergaenzen" href="#bedarf-ergaenzen-lh-bd-01"/);
  assert.match(html, /id="pruefbitte-gesperrt"/); assert.ok(!formIds(html).includes('fachergebnis'));
  // Nach dem Ergänzen des Bedarfs ist die Prüfbitte auf beiden Wegen möglich (Formular und „Zur Fachprüfung vorlegen“).
  p.bedarfAenderungen = { 'LH:BD-01': { pruefzeitTage: 1, annahmeVon: '2026-11-01', annahmeBis: '2027-12-31' } };
  c = mitUi(p); e = entscheidung(c, 'LH', 'E-02');
  assert.equal(pruefbitteErlaubt(c, e).erlaubt, true);
  assert.equal(lageVorgang(c, e).haupt.text, 'Variante zur fachlichen Prüfung vorlegen');
  html = seite(c, e);
  assert.match(html, /Zur Fachprüfung vorlegen/); assert.ok(formIds(html).includes('pruefbitte'));
});

// ---------- 2. Fristablauf: dokumentierbar und sichtbar ----------
function eigenerBedarf(p) {
  p.bedarfe.push(bedarfAusEntwurf({ projekt: 'SB', gruppe: 'wand', titel: 'Prüffall Bestellfrist', menge: '10', bestellfrist: '2026-11-19', pruefzeitTage: '1', annahmeVon: '2026-11-01', annahmeBis: '2027-03-31', anforderungen: '', zustaendig: 'planung' }, { id: 'BD-90', at: START }));
}

test('Fristablauf: Bestellfrist läuft während der Prüfbitte ab; sichtbar, und der Vorgang bleibt dokumentierbar', () => {
  const p = leerePersistenz(); eigenerBedarf(p);
  const e = mitPruefbitte(p, ['LH', 'TW-01'], ['SB', 'BD-90']);
  let c = mitUi(p);
  let bf = lageVorgang(c, e).fristen.find((f) => f.name === 'Bestellfrist');
  assert.deepEqual([bf.at, bf.status], ['2026-11-19T23:59', 'offen']);
  assert.ok(kennzahlen(c).zeitkritisch.eintraege.some((f) => f.ref?.id === e.id && f.name === 'Bestellfrist' && !f.ueberfaellig), 'zeitkritisch vor Ablauf');
  c = mitUi(p, NACH_FRIST);
  bf = lageVorgang(c, e).fristen.find((f) => f.name === 'Bestellfrist');
  assert.deepEqual([bf.status, bf.ton], ['verstrichen', 'crit']);
  assert.ok(kennzahlen(c).zeitkritisch.eintraege.some((f) => f.ref?.id === e.id && f.name === 'Bestellfrist' && f.ueberfaellig), 'überfällig nach Ablauf');
  const html = seite(c, e);
  assert.match(html, /id="frist-verstrichen"[^>]*>.*Bestellfrist.*Einträge bleiben möglich/s);
  assert.deepEqual(formIds(html), ['fachergebnis', 'abbruch']);
  assert.match(schritt(p, NACH_FRIST, e, 'fachergebnis', FACH).text, /Eingetragen nach Ablauf der Bestellfrist \(19\.11\.2026\)/);
  // Nach dem Fachergebnis bleibt die Bestellfrist „verstrichen“ (nicht „offen“); Vormerkung und Abbruch bleiben möglich.
  c = mitUi(p, NACH_FRIST);
  assert.equal(vorgangStatus(c, e).key, 'geeignet');
  assert.equal(lageVorgang(c, e).fristen.find((f) => f.name === 'Bestellfrist').status, 'verstrichen');
  assert.deepEqual(formIds(seite(c, e)), ['vormerkung', 'abbruch']);
  assert.ok(vorgangSchritt(c, e, 'vormerkung', { menge: '10', ablauf: '2026-11-20' }).ereignis);
  assert.match(vorgangSchritt(c, e, 'abbruch', { grund: 'Ersatz bestellt' }).ereignis.text, /nach Ablauf der Bestellfrist/);
});

test('Fristablauf: E-01 nach der Aufmaßfrist nennt die Frist und lässt Vermerk und Abbruch zu', () => {
  const c = mitUi(leerePersistenz(), '2026-11-19T09:00'); const e = entscheidung(c, 'LH', 'E-01');
  const html = seite(c, e);
  assert.match(html, /id="frist-verstrichen"[^>]*>.*Aufmaßfrist/s);
  assert.match(html, /id="aktion-schritt"/); assert.ok(formIds(html).includes('abbruch'));
  assert.ok(vorgangSchritt(c, e, 'abbruch', { grund: 'Aufmaß nicht rechtzeitig, Ersatz bestellt' }).ereignis);
});

test('Fristablauf: abgelaufene Vormerkung lässt sich erneuern oder abbrechen', () => {
  const p = leerePersistenz();
  const e = mitPruefbitte(p, ['KB', 'TW-05'], ['SB', 'BD-22']);
  schritt(p, START, e, 'fachergebnis', FACH);
  schritt(p, START, e, 'vormerkung', { menge: '60', ablauf: '2026-11-19' });
  const c = mitUi(p, NACH_FRIST);
  assert.equal(vorgangStatus(c, e).key, 'abgelaufen');
  const html = seite(c, e);
  assert.match(html, /Die Vormerkung ist abgelaufen\.<\/b> Erneuern oder Abbrechen bleibt möglich/);
  assert.deepEqual(formIds(html), ['vormerkung', 'abbruch']);
  assert.equal(schritt(p, NACH_FRIST, e, 'vormerkung', { menge: '60', ablauf: '2026-11-30' }).art, 'vormerkung');
  assert.equal(vorgangStatus(mitUi(p, NACH_FRIST), e).key, 'vorgemerkt');
});

// ---------- 3. Doppelboden 7 m² gegen 57,2 m² ----------
test('Doppelboden 7 m² gegen 57,2 m²: mindestens 50,2 m² fehlen an jeder Stelle, auch bei unbekannter Schadfläche', () => {
  const p = leerePersistenz();
  p.erfassungen.push(bauteilAusErfassung({ projekt: 'LH', raum: '2.07', gruppe: 'boden', menge: '7', werte: {}, foto: null }, { id: 'DB-02', at: START, etage: '2.OG' }));
  let c = mitUi(p); const db2 = bauteil(c, 'LH', 'DB-02'); const bd2 = bedarf(c, 'LH', 'BD-02');
  const a = abgleich(c, db2, bd2);
  assert.deepEqual([a.menge.status, a.menge.luecke, a.menge.mindestens, a.menge.bedarf], ['teilweise', 50.2, true, 57.2]);
  assert.equal(lueckeText(a.menge), 'Es fehlen mindestens 50,2 m².');
  const lh = PROJEKTE.find((x) => x.kurz === 'LH');
  assert.match(flach(abgleichSeite(c, db2, bd2)), /Es fehlen mindestens 50,2 m²/);
  assert.match(flach(abgleichListeSeite(c)), /Menge: es fehlen mindestens 50,2 m²/);
  const karte = /<a class="paar" href="#abgleich-lh-db-02--lh-bd-02">.*?class="paar-luecke[^"]*">.*?Es fehlen mindestens 50,2 m²/s;
  assert.match(pass(c, lh, db2), karte, 'Karte „Passende Gegenstücke“ im Pass');
  assert.match(pass(c, lh, db2), /<option value="bedarf\|LH\|BD-02"[^>]*>[^<]*Es fehlen mindestens 50,2 m²/);
  assert.match(bedarfDetail(c, bd2), karte, 'Karte „Passende Angebote“ beim Bedarf');
  // Nach der Zuordnung zeigt die Entscheidung den Befund zuerst, die Schadfläche bleibt leer.
  const e = neueEntscheidung(kontext(p), db2, { art: 'bedarf', projekt: 'LH', id: 'BD-02' }); p.zuordnungen.push(e);
  c = mitUi(p); const html = seite(c, entscheidung(c, 'LH', e.id));
  assert.ok(html.indexOf('id="befund-deckung"') < html.indexOf('id="h-schritt"'));
  assert.match(flach(html), /Bedarf nicht vollständig gedeckt.*Höchstens 7 m², Bedarf 57,2 m².*Es fehlen mindestens 50,2 m²/);
  assert.match(html, /<input id="b-schaden"[^>]*value=""/);
  assert.match(flach(html), /Teilmenge einplanen oder weitere Quelle suchen/);
});
