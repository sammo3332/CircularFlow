// Tests des Vorgangs (Status, Übergänge, Validierung, Checkliste). Aufruf vom Repository-Root:
// node --test plattform/test/vorgang.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vorgangStatus, vorgangSchritt, checkliste, checklisteSetzen, naechsterVorgangsschritt, vorgangBeendet, HINWEIS_FACH, HINWEIS_VORMERKUNG } from '../app/vorgang.js';
import { abgleich, abgleichListe, pruefbitteAnlegen } from '../app/abgleich.js';
import { entscheidungFuer, naechsteHandlung, bauteilStatus, offeneEntscheidungen, moeglicheZiele, offeneNachweise, schluessel, lage } from '../app/regeln.js';
import { leerePersistenz } from '../app/zustand.js';
import { kontext, bauteil, bedarf, entscheidung, START } from './_hilfe.mjs';

// Hilfsablauf: Prüfbitte TW-05 → BD-22 anlegen und Ereignisse nacheinander anwenden. Rückgabe: Persistenz und Funktionen.
function ablauf() {
  const p = leerePersistenz();
  const c0 = kontext(p, START);
  const r = pruefbitteAnlegen(c0, abgleich(c0, bauteil(c0, 'KB', 'TW-05'), bedarf(c0, 'SB', 'BD-22')));
  p.zuordnungen.push(r.zuordnung); p.ereignisse.push(r.ereignis);
  const ctx = (at = START) => kontext(p, at);
  const e = (c) => entscheidung(c, 'KB', 'E-01');
  // Führt eine Aktion zur Projektzeit at aus; bei Erfolg wird das Ereignis gespeichert.
  const tu = (at, aktion, eingabe) => { const c = ctx(at); const res = vorgangSchritt(c, e(c), aktion, eingabe); if (res.ereignis) p.ereignisse.push(res.ereignis); return res; };
  return { p, ctx, e, tu };
}
const fach = { urteil: 'geeignet', person: 'L. Müller' };

test('E-01 und E-02 verhalten sich ohne neue Ereignisse wie bisher', () => {
  const c = kontext();
  for (const id of ['E-01', 'E-02']) {
    const e = entscheidung(c, 'LH', id); const st = vorgangStatus(c, e);
    assert.equal(st.key, 'offen'); assert.equal(st.aktiv, true); assert.equal(naechsterVorgangsschritt(c, e), null);
    assert.equal(naechsteHandlung(c, bauteil(c, 'LH', e.bauteil)).entscheidung.id, id);
  }
  assert.equal(entscheidungFuer(c, bauteil(c, 'LH', 'T-07')).id, 'E-01');
  assert.equal(entscheidungFuer(c, bauteil(c, 'LH', 'DB-01')).id, 'E-02');
  assert.equal(naechsteHandlung(c, bauteil(c, 'LH', 'T-07')).text, lage(c, entscheidung(c, 'LH', 'E-01')).haupt.text);
  assert.equal(offeneEntscheidungen(c).gesamt, 2);
});

test('Die bestehende Vorlage zählt wie eine Prüfbitte; vor ihrem Zeitpunkt nicht', () => {
  const p = leerePersistenz();
  p.ereignisse.push({ entscheidung: schluessel('LH', 'E-01'), art: 'vorlage', at: '2026-11-18T15:30' });
  assert.equal(vorgangStatus(kontext(p, START), entscheidung(kontext(p), 'LH', 'E-01')).key, 'offen');
  const spaet = kontext(p, '2026-11-18T15:30');
  assert.equal(vorgangStatus(spaet, entscheidung(spaet, 'LH', 'E-01')).key, 'pruefbitte');
  // Nach einer Vorlage ist ein Fachergebnis eintragbar.
  assert.ok(vorgangSchritt(spaet, entscheidung(spaet, 'LH', 'E-01'), 'fachergebnis', fach).ereignis);
});

test('Prüfbitte: Status, „wartet“ in der nächsten Handlung, Bauteilstatus Fachprüfung', () => {
  const { ctx, e } = ablauf();
  const c = ctx(); const st = vorgangStatus(c, e(c));
  assert.equal(st.key, 'pruefbitte'); assert.deepEqual(st.erlaubt, ['fachergebnis', 'abbruch']);
  const b = bauteil(c, 'KB', 'TW-05');
  const h = naechsteHandlung(c, b);
  assert.equal(h.wartet, true); assert.match(h.text, /Rückmeldung der Fachprüfung/);
  assert.equal(bauteilStatus(c, b), 'fachpruefung');
});

test('Übergänge: nur erlaubte Schritte, keine Rückwärtsübergänge', () => {
  const { ctx, e, tu } = ablauf();
  const nicht = (at, aktion, eingabe, muster) => { const r = tu(at, aktion, eingabe); assert.ok(r.fehler?.allgemein, `${aktion} sollte gesperrt sein`); assert.match(r.fehler.allgemein, muster); };
  nicht(START, 'vormerkung', { menge: '10', ablauf: '2026-12-31' }, /Prüfbitte gestellt.*nicht möglich/);
  nicht(START, 'uebergabe-geplant', {}, /nicht möglich/);
  nicht(START, 'uebergeben', {}, /nicht möglich/);
  nicht(START, 'pruefbitte', {}, /nicht möglich/);
  nicht(START, 'unbekannt', {}, /gibt es nicht/);
  assert.ok(tu(START, 'fachergebnis', fach).ereignis);
  nicht(START, 'fachergebnis', fach, /Geeignet.*nicht möglich/);
  nicht(START, 'uebergabe-geplant', {}, /nicht möglich/);
  assert.ok(tu(START, 'vormerkung', { menge: '60', ablauf: '2027-03-15' }).ereignis);
  nicht(START, 'fachergebnis', fach, /Vorgemerkt.*nicht möglich/);
  nicht(START, 'vormerkung', { menge: '60', ablauf: '2027-03-15' }, /nicht möglich/);
  nicht(START, 'uebergeben', {}, /nicht möglich/);
  assert.ok(tu(START, 'uebergabe-geplant', { termin: '2027-02-10', ort: 'Lager Huckarde', rolle: 'montage' }).ereignis);
  nicht(START, 'vormerkung', { menge: '60', ablauf: '2027-03-15' }, /Übergabe geplant.*nicht möglich/);
  assert.ok(tu('2027-02-10T10:00', 'uebergeben', { datum: '2027-02-10' }).ereignis);
  const ende = ctx('2027-02-10T10:00');
  assert.equal(vorgangBeendet(ende, e(ende)), true);
  for (const a of ['fachergebnis', 'vormerkung', 'uebergabe-geplant', 'uebergeben', 'abbruch']) {
    const r = vorgangSchritt(ende, e(ende), a, { grund: 'x' });
    assert.match(r.fehler.allgemein, /Vorgang ist beendet/);
  }
});

test('Fachergebnis: Validierung je Feld, Notiz bei bedingt und ungeeignet, Beschriftung', () => {
  const { ctx, e } = ablauf(); const c = ctx();
  assert.deepEqual(Object.keys(vorgangSchritt(c, e(c), 'fachergebnis', {}).fehler).sort(), ['person', 'urteil']);
  assert.ok(vorgangSchritt(c, e(c), 'fachergebnis', { urteil: 'vielleicht', person: 'X' }).fehler.urteil);
  assert.ok(vorgangSchritt(c, e(c), 'fachergebnis', { urteil: 'bedingt', person: 'X' }).fehler.notiz);
  assert.ok(vorgangSchritt(c, e(c), 'fachergebnis', { urteil: 'ungeeignet', person: 'X', notiz: '  ' }).fehler.notiz);
  assert.ok(vorgangSchritt(c, e(c), 'fachergebnis', { urteil: 'geeignet', person: ' ' }).fehler.person);
  assert.equal(vorgangSchritt(c, e(c), 'fachergebnis', { urteil: 'geeignet', person: 'x'.repeat(81) }).fehler.person, 'Der Name darf höchstens 80 Zeichen haben.');
  const ok = vorgangSchritt(c, e(c), 'fachergebnis', { urteil: 'geeignet', person: ' L. Müller ' }).ereignis;
  assert.equal(ok.person, 'L. Müller'); assert.equal(ok.von, 'browser'); assert.equal(ok.at, START); assert.equal(ok.sim, true);
  assert.equal(ok.entscheidung, 'KB:E-01'); assert.equal(ok.hinweis, 'laut Eintrag (Simulation), keine Fachfreigabe'); assert.equal(HINWEIS_FACH, ok.hinweis);
  assert.match(ok.text, /laut Eintrag \(Simulation\), keine Fachfreigabe/);
});

test('Vormerkung: Menge in der Einheit des Bauteils, Ablauf nicht vor dem Stichtag, Beschriftung unverbindlich', () => {
  const { ctx, e, tu } = ablauf(); tu(START, 'fachergebnis', fach); const c = ctx();
  const v = (eingabe) => vorgangSchritt(c, e(c), 'vormerkung', eingabe);
  assert.ok(v({ menge: '', ablauf: '2027-01-01' }).fehler.menge); assert.match(v({ menge: '', ablauf: '2027-01-01' }).fehler.menge, /lfm/);
  assert.ok(v({ menge: '0', ablauf: '2027-01-01' }).fehler.menge);
  assert.ok(v({ menge: '1,234', ablauf: '2027-01-01' }).fehler.menge);
  assert.match(v({ menge: '121', ablauf: '2027-01-01' }).fehler.menge, /nur 120 lfm/);
  assert.ok(v({ menge: '10', ablauf: '' }).fehler.ablauf);
  assert.ok(v({ menge: '10', ablauf: '2027-02-30' }).fehler.ablauf);
  assert.match(v({ menge: '10', ablauf: '2026-11-17' }).fehler.ablauf, /nicht vor dem Stichtag \(18\.11\.2026\)/);
  const ok = v({ menge: '12,5', ablauf: '2026-11-18' }).ereignis;   // Ablauf am Stichtag ist erlaubt
  assert.equal(ok.menge, 12.5); assert.equal(ok.einheit, 'lfm'); assert.equal(ok.hinweis, HINWEIS_VORMERKUNG);
  assert.match(ok.text, /Vormerkung \(Simulation, unverbindlich\)/);
});

test('Übergabe geplant: Termin im Annahmefenster, ab verfügbar, nicht nach Vormerkungsablauf; Ort und Rolle Pflicht', () => {
  const { ctx, e, tu } = ablauf(); tu(START, 'fachergebnis', fach); tu(START, 'vormerkung', { menge: '60', ablauf: '2027-02-20' });
  const c = ctx(); const u = (x) => vorgangSchritt(c, e(c), 'uebergabe-geplant', { ort: 'Lager', rolle: 'montage', termin: '2027-02-10', ...x });
  assert.ok(u({ termin: '' }).fehler.termin);
  assert.match(u({ termin: '2026-11-17' }).fehler.termin, /nicht vor dem Stichtag/);
  assert.match(u({ termin: '2026-12-01' }).fehler.termin, /erst ab 01\.02\.2027 verfügbar/);
  assert.match(u({ termin: '2027-02-21' }).fehler.termin, /Vormerkung läuft am 20\.02\.2027 ab/);
  assert.match(u({ termin: '2027-04-01' }).fehler.termin, /Vormerkung läuft|Annahmefenster endet/);
  assert.ok(u({ ort: ' ' }).fehler.ort); assert.ok(u({ rolle: '' }).fehler.rolle); assert.ok(u({ rolle: 'chef' }).fehler.rolle); assert.ok(u({ rolle: 'browser' }).fehler.rolle);
  assert.equal(u({ termin: '2027-02-01' }).ereignis.termin, '2027-02-01', 'ab verfügbar ist erlaubt');
  assert.equal(u({ termin: '2027-02-20' }).ereignis.termin, '2027-02-20', 'am Ablauftag erlaubt');
  // Annahmefenster getrennt prüfen: Vormerkung bis nach dem Fenster, Termin nach dem Fenster.
  const q = ablauf(); q.tu(START, 'fachergebnis', fach); q.tu(START, 'vormerkung', { menge: '60', ablauf: '2027-06-30' });
  const cq = q.ctx();
  assert.match(vorgangSchritt(cq, q.e(cq), 'uebergabe-geplant', { termin: '2027-04-01', ort: 'a', rolle: 'montage' }).fehler.termin, /Annahmefenster endet am 31\.03\.2027/);
});

test('Übergeben: Datum nicht nach dem Stichtag; Status wird beendet und gibt das Bauteil frei', () => {
  const { ctx, e, tu } = ablauf();
  tu(START, 'fachergebnis', fach); tu(START, 'vormerkung', { menge: '60', ablauf: '2027-03-15' }); tu(START, 'uebergabe-geplant', { termin: '2027-02-10', ort: 'Lager', rolle: 'bauleitung' });
  const c = ctx('2027-02-10T10:00');
  assert.match(vorgangSchritt(c, e(c), 'uebergeben', { datum: '2027-02-11' }).fehler.datum, /nicht nach dem Stichtag/);
  assert.ok(vorgangSchritt(c, e(c), 'uebergeben', { datum: '' }).fehler.datum);
  assert.ok(tu('2027-02-10T10:00', 'uebergeben', { datum: '2027-02-10' }).ereignis);
  const ende = ctx('2027-02-10T10:00'); const b = bauteil(ende, 'KB', 'TW-05');
  assert.equal(vorgangStatus(ende, e(ende)).key, 'uebergeben');
  assert.equal(entscheidungFuer(ende, b), null);
  const h = naechsteHandlung(ende, b); assert.equal(h.text, 'Abgeschlossen'); assert.equal(h.ton, 'ok');
  assert.equal(bauteilStatus(ende, b), 'uebergeben');
  assert.equal(abgleichListe(ende).some((x) => x.bauteil.id === 'TW-05'), false);
  assert.equal(offeneEntscheidungen(ende).gesamt, 2, 'nur E-01 und E-02 von LH bleiben offen');
});

test('Nächste Handlung folgt dem Vorgangsschritt nach dem Fachergebnis', () => {
  const { ctx, tu } = ablauf(); const b = (c) => bauteil(c, 'KB', 'TW-05');
  tu(START, 'fachergebnis', fach);
  assert.equal(naechsteHandlung(ctx(), b(ctx())).text, 'Vormerkung anlegen');
  assert.equal(naechsteHandlung(ctx(), b(ctx())).frist, '2027-03-31T23:59');
  tu(START, 'vormerkung', { menge: '60', ablauf: '2027-03-15' });
  assert.equal(naechsteHandlung(ctx(), b(ctx())).text, 'Übergabe planen');
  assert.equal(bauteilStatus(ctx(), b(ctx())), 'vorgemerkt');
  tu(START, 'uebergabe-geplant', { termin: '2027-02-10', ort: 'Lager', rolle: 'bauleitung' });
  const h = naechsteHandlung(ctx(), b(ctx()));
  assert.equal(h.text, 'Übergabe durchführen'); assert.equal(h.rolle, 'bauleitung'); assert.equal(h.frist, '2027-02-10T23:59');
  assert.match(h.grund, /Lager/);
  // Nach dem Termin ohne Übergabe: überfällig.
  assert.equal(naechsteHandlung(ctx('2027-02-12T09:00'), b(ctx())).ton, 'crit');
  assert.equal(vorgangStatus(ctx('2027-02-12T09:00'), entscheidung(ctx(), 'KB', 'E-01')).ueberfaellig, true);
});

test('Status hängt von der Projektzeit ab: spätere Ereignisse zählen noch nicht', () => {
  const { p, ctx, e } = ablauf();
  const c = ctx(); const f = vorgangSchritt({ ...c, at: '2026-11-19T09:00' }, e(c), 'fachergebnis', fach).ereignis;
  p.ereignisse.push(f);
  assert.equal(vorgangStatus(ctx('2026-11-18T14:00'), e(c)).key, 'pruefbitte');
  assert.equal(vorgangStatus(ctx('2026-11-19T08:59'), e(c)).key, 'pruefbitte');
  assert.equal(vorgangStatus(ctx('2026-11-19T09:00'), e(c)).key, 'geeignet');
  assert.equal(vorgangStatus(ctx('2026-11-19T09:00'), e(c)).verlauf.length, 2);
  // Stichtagsprüfung folgt der Projektzeit: am 19.11. ist ein Ablauf am 18.11. ungültig.
  const c2 = ctx('2026-11-19T09:00');
  assert.ok(vorgangSchritt(c2, e(c2), 'vormerkung', { menge: '5', ablauf: '2026-11-18' }).fehler.ablauf);
});

test('Abgelaufene Vormerkung wird als abgelaufen angezeigt und kann erneuert werden', () => {
  const { ctx, e, tu } = ablauf();
  tu(START, 'fachergebnis', fach); tu(START, 'vormerkung', { menge: '30', ablauf: '2026-11-20' });
  assert.equal(vorgangStatus(ctx('2026-11-20T23:00'), e(ctx())).key, 'vorgemerkt', 'am Ablauftag noch gültig');
  const spaet = ctx('2026-11-21T08:00'); const st = vorgangStatus(spaet, e(spaet));
  assert.equal(st.key, 'abgelaufen'); assert.equal(st.label, 'Vormerkung abgelaufen'); assert.equal(st.abgelaufen, true); assert.equal(st.aktiv, true);
  assert.deepEqual(st.erlaubt, ['vormerkung', 'abbruch']);
  assert.match(vorgangSchritt(spaet, e(spaet), 'uebergabe-geplant', { termin: '2027-02-10', ort: 'a', rolle: 'montage' }).fehler.allgemein, /nicht möglich/);
  assert.equal(naechsteHandlung(spaet, bauteil(spaet, 'KB', 'TW-05')).text, 'Vormerkung erneuern');
  const neu = tu('2026-11-21T08:00', 'vormerkung', { menge: '30', ablauf: '2027-01-31' });
  assert.ok(neu.ereignis);
  assert.equal(vorgangStatus(ctx('2026-11-21T08:00'), e(ctx())).key, 'vorgemerkt');
});

test('Ungeeignet beendet den Vorgang, gibt das Bauteil frei, sperrt aber dieses Ziel für dieses Bauteil', () => {
  const { ctx, e, tu } = ablauf();
  assert.ok(tu(START, 'fachergebnis', { urteil: 'ungeeignet', person: 'L. Müller', notiz: 'Glasfelder beschädigt' }).ereignis);
  const c = ctx(); const b = bauteil(c, 'KB', 'TW-05');
  const st = vorgangStatus(c, e(c));
  assert.equal(st.key, 'ungeeignet'); assert.equal(st.beendet, true);
  assert.equal(entscheidungFuer(c, b), null);
  assert.notEqual(bauteilStatus(c, b), 'fachpruefung');
  const z = moeglicheZiele(c, b).bedarfe.map((d) => d.id);
  assert.ok(!z.includes('BD-22'), 'ungeeignetes Ziel bleibt gesperrt'); assert.ok(z.includes('BD-23'));
  // Andere Bauteile können den Bedarf wieder nutzen.
  assert.ok(moeglicheZiele(c, bauteil(c, 'LH', 'TW-01')).bedarfe.some((d) => d.id === 'BD-22'));
  assert.equal(abgleichListe(c).some((x) => x.schluessel === 'kb-tw-05--sb-bd-22'), false);
  assert.equal(abgleichListe(c).some((x) => x.schluessel === 'kb-tw-05--sb-bd-23'), true, 'Bauteil ist wieder frei');
  assert.equal(abgleichListe(c).some((x) => x.schluessel === 'lh-tw-01--sb-bd-22'), true, 'Bedarf ist wieder frei');
  assert.match(abgleich(c, b, bedarf(c, 'SB', 'BD-22')).sperrgrund, /ungeeignet beendet/);
});

test('Abbruch braucht einen Grund, beendet den Vorgang und gibt Bauteil und Ziel wieder frei', () => {
  const { ctx, e, tu } = ablauf();
  const leer = vorgangSchritt(ctx(), e(ctx()), 'abbruch', { grund: '  ' });
  assert.ok(leer.fehler.grund);
  assert.ok(tu(START, 'abbruch', { grund: 'Bedarf entfallen' }).ereignis);
  const c = ctx(); const b = bauteil(c, 'KB', 'TW-05');
  assert.equal(vorgangStatus(c, e(c)).key, 'abgebrochen');
  assert.equal(entscheidungFuer(c, b), null);
  assert.ok(moeglicheZiele(c, b).bedarfe.some((d) => d.id === 'BD-22'), 'abgebrochenes Ziel ist wieder frei');
  assert.equal(abgleichListe(c).some((x) => x.schluessel === 'kb-tw-05--sb-bd-22'), true);
  assert.equal(offeneEntscheidungen(c).gesamt, 2);
  // Abbruch ist auch nach der Vormerkung möglich.
  const q = ablauf(); q.tu(START, 'fachergebnis', fach); q.tu(START, 'vormerkung', { menge: '5', ablauf: '2027-01-01' });
  assert.ok(q.tu(START, 'abbruch', { grund: 'Termin geplatzt' }).ereignis);
});

test('Bauteile mit aktivem Vorgang: Ziele sind belegt, andere Bauteile sehen den belegten Bedarf nicht', () => {
  const { ctx } = ablauf(); const c = ctx();
  assert.ok(!moeglicheZiele(c, bauteil(c, 'LH', 'TW-01')).bedarfe.some((d) => d.id === 'BD-22'));
  // Bestehende Beispiele: B-02 ist durch E-01 belegt, B-04 frei.
  const t = moeglicheZiele(kontext(), bauteil(kontext(), 'LH', 'T-03'));
  assert.deepEqual(t.oeffnungen.map((z) => z.id), ['B-04', 'B-07']);
});

test('Checkliste: sechs Punkte, nur Eignung sperrt, gespeicherter Stand wird gelesen', () => {
  const { p, ctx, e, tu } = ablauf();
  let c = ctx(); const offene = offeneNachweise(c, bauteil(c, 'KB', 'TW-05'));
  let cl = checkliste(c, e(c), { offeneNachweise: offene });
  assert.deepEqual(cl.punkte.map((x) => x.label), ['Eignung', 'Nachweise', 'Ausbau', 'Transport und Lager', 'Übergabe', 'Wirtschaftlichkeit']);
  assert.deepEqual(cl.punkte.filter((x) => x.sperrt).map((x) => x.key), ['eignung']);
  assert.deepEqual(cl.sperrend, ['eignung']); assert.equal(cl.punkte[1].erledigt, false); assert.match(cl.punkte[1].text, /1 offene/);
  assert.match(cl.punkte[5].text, /ohne Zahlen/);
  // Gespeicherter Stand: Häkchen ohne Eignung.
  p.ezustand['KB:E-01'] = { checkliste: checklisteSetzen({}, 'ausbau', true) };
  assert.deepEqual(checklisteSetzen(p.ezustand['KB:E-01'].checkliste, 'eignung', true), { ausbau: true }, 'Eignung lässt sich nicht abhaken');
  assert.deepEqual(checklisteSetzen({ ausbau: true }, 'ausbau', false), {});
  assert.deepEqual(checklisteSetzen({}, 'gibtsnicht', true), {});
  c = ctx(); cl = checkliste(c, e(c), { offeneNachweise: [] });
  assert.equal(cl.punkte.find((x) => x.key === 'ausbau').erledigt, true);
  assert.equal(cl.punkte.find((x) => x.key === 'nachweise').erledigt, true, 'keine offenen Nachweise');
  tu(START, 'fachergebnis', { urteil: 'bedingt', person: 'L. Müller', notiz: 'Dichtungen ersetzen' });
  c = ctx(); cl = checkliste(c, e(c), { offeneNachweise: offene });
  assert.deepEqual(cl.sperrend, []); assert.match(cl.punkte[0].text, /bedingt geeignet.*keine Fachfreigabe/);
  assert.match(naechsteHandlung(c, bauteil(c, 'KB', 'TW-05')).grund, /Dichtungen ersetzen/);
});

test('Ungeeignet: Eignung bleibt offen und sperrend', () => {
  const { ctx, e, tu } = ablauf(); tu(START, 'fachergebnis', { urteil: 'ungeeignet', person: 'X', notiz: 'Schaden' });
  const c = ctx(); const cl = checkliste(c, e(c));
  assert.deepEqual(cl.sperrend, ['eignung']); assert.match(cl.punkte[0].text, /ungeeignet/);
});

test('Ungültige gespeicherte Ereignisse werden übergangen', () => {
  const { p, ctx, e } = ablauf();
  p.ereignisse.push({ entscheidung: 'KB:E-01', art: 'uebergeben', at: START, datum: '2026-11-18' });      // Sprung ohne Zwischenschritte
  p.ereignisse.push({ entscheidung: 'KB:E-01', art: 'fachergebnis', at: START, urteil: 'vielleicht' });   // unbekanntes Ergebnis
  p.ereignisse.push(null);
  assert.equal(vorgangStatus(ctx(), e(ctx())).key, 'pruefbitte');
});
