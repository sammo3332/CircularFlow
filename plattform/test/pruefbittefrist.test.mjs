// Tests der Frist „Prüfbitte spätestens“ (Plan: docs/plan-pruefbitte-spaetestens.md, Tests T1 bis T8). Aufruf vom Repository-Root:
// node --test plattform/test/pruefbittefrist.test.mjs
// Zeit: Die Regel pruefbitteFrist(bedarf) kennt keine Uhr. Zeitkritisch und „verstrichen“ prüfen wir zu ausdrücklich gesetzten Projektzeiten (ctx.at).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abgleich, abgleichListe, pruefbitteAnlegen, pruefbitteFrist, FRIST_PRUEFBITTE } from '../app/abgleich.js';
import { kennzahlen } from '../app/kennzahlen.js';
import { bedarfAusEntwurf } from '../app/bedarf.js';
import { bauteilAusErfassung, neueEntscheidung } from '../app/regeln.js';
import { vorgangSchritt } from '../app/vorgang.js';
import { leerePersistenz } from '../app/zustand.js';
import { neuerUiZustand } from '../app/uizustand.js';
import { PROJEKTZEITEN } from '../app/daten.js';
import { esc, routeBedarf } from '../app/ui.js';
import { uebersicht } from '../app/ansichten/uebersicht.js';
import { bedarfDetail } from '../app/ansichten/bedarfe.js';
import { kontext, kleinKontext, bauteil, bedarf, entscheidung, START } from './_hilfe.mjs';

// ---------- Pilotstand (docs/pilot/cf-pilot-01-simulation.mjs) ----------
// BD-24: Projekt UAK, 6 Bürotüren, Bestellfrist 19.02.2027, Mindestprüfzeit 14 Tage (geschätzt), Annahmefenster 08. bis 12.03.2027.
// T-13: Angebot aus LH, 6 Stk, verfügbar ab 05.03.2027, erfasst am 19.01.2027. Beide kommen wie im Browser über die Persistenz in den Datenstand.
const BD24 = bedarfAusEntwurf({ projekt: 'UAK', gruppe: 'tuer', titel: 'Bürotüren 1. OG', menge: '6', bestellfrist: '2027-02-19', pruefzeitTage: '14', annahmeVon: '2027-03-08', annahmeBis: '2027-03-12', zustaendig: 'planung', anforderungen: '', geschaetzt: { pruefzeitTage: true } }, { id: 'BD-24', at: '2027-01-11T09:00' });
const T13 = bauteilAusErfassung({ projekt: 'LH', raum: '1.04', gruppe: 'tuer', menge: '6', zustand: 'B', notiz: '', verfuegbarAb: '2027-03-05' }, { id: 'T-13', at: '2027-01-19T15:00', etage: '1.OG' });
const pilot = () => { const p = leerePersistenz(); p.bedarfe.push(structuredClone(BD24)); p.erfassungen.push(structuredClone(T13)); return p; };
const plusTage = (d, n) => new Date(Date.parse(`${d}T12:00:00Z`) + n * 86400000).toISOString().slice(0, 10);
const mitUi = (p = leerePersistenz(), at = START) => ({ ...kontext(p, at), ui: neuerUiZustand(), geo: null, eigeneAenderungen: 0 });
const fristEintraege = (ctx, id) => kennzahlen(ctx).zeitkritisch.eintraege.filter((f) => f.name === FRIST_PRUEFBITTE && (!id || f.id === id));
// Zeitangaben ohne Herkunft „geschätzt“: der Wortlaut des Plans ohne Zusatz.
const NEUTRAL = { projekt: 'SB', id: 'BD-X', gruppe: 'tuer', menge: 6, bestellfrist: '2027-02-19', pruefzeitTage: 14, annahmeVon: '2027-03-08', annahmeBis: '2027-03-12', belegt: { bestellfrist: 'belegt', pruefzeitTage: 'belegt', annahme: 'belegt' } };

// ---------- T1 ----------
test('T1 Pilotbedarf BD-24: Prüfbitte spätestens 05.02.2027 (Bestellfrist 19.02.2027 minus 14 Tage)', () => {
  const f = pruefbitteFrist(BD24);
  assert.equal(FRIST_PRUEFBITTE, 'Prüfbitte spätestens');
  assert.equal(f.status, 'ok'); assert.equal(f.tag, '2027-02-05');
  assert.equal(f.grenze, 'bestellfrist'); assert.equal(f.grenzTag, '2027-02-19'); assert.equal(f.pruefzeitTage, 14);
  assert.deepEqual(f.geschaetzt, ['Mindestprüfzeit']); assert.deepEqual(f.fehlend, []); assert.deepEqual(f.klaerung, []);
  assert.equal(f.text, 'Bestellfrist 19.02.2027 minus 14 Tage Mindestprüfzeit (geschätzt)');
});

// ---------- T2 ----------
test('T2 Beispielbedarfe BD-22 und BD-23: Tag, Grenze, Herkunft', () => {
  const c = kontext();
  const f22 = pruefbitteFrist(bedarf(c, 'SB', 'BD-22'));
  assert.equal(f22.status, 'ok'); assert.equal(f22.tag, '2027-03-21');
  assert.equal(f22.grenze, 'bestellfrist', 'Gleichstand mit dem Annahmeende 31.03.2027: die Bestellfrist');
  assert.deepEqual(f22.geschaetzt, ['Mindestprüfzeit'], 'das geschätzte Annahmefenster geht nicht in die Rechnung ein');
  assert.equal(f22.text, 'Bestellfrist 31.03.2027 minus 10 Tage Mindestprüfzeit (geschätzt)');
  const f23 = pruefbitteFrist(bedarf(c, 'SB', 'BD-23'));
  assert.equal(f23.status, 'ok'); assert.equal(f23.tag, '2026-11-13'); assert.deepEqual(f23.geschaetzt, []);
  assert.equal(f23.text, 'Bestellfrist 27.11.2026 minus 14 Tage Mindestprüfzeit', 'ohne „(geschätzt)“');
});

// ---------- T3 ----------
test('T3 Randfälle: Prüfzeit 0 und als Ziffernfolge, fehlende und ungültige Angaben', () => {
  const mit = (extra) => pruefbitteFrist({ ...NEUTRAL, ...extra });
  // Prüfzeit 0 ist gültig: Der Fristtag ist die Bestellfrist. Eine Ziffernfolge zählt wie die Zahl, 1 steht in der Einzahl.
  let f = mit({ pruefzeitTage: 0 });
  assert.equal(f.status, 'ok'); assert.equal(f.tag, '2027-02-19'); assert.equal(f.text, 'Bestellfrist 19.02.2027 minus 0 Tage Mindestprüfzeit');
  f = mit({ pruefzeitTage: '1' });
  assert.equal(f.tag, '2027-02-18'); assert.equal(f.text, 'Bestellfrist 19.02.2027 minus 1 Tag Mindestprüfzeit');
  assert.equal(mit({ pruefzeitTage: 365 }).tag, '2026-02-19', 'Obergrenze 365 Tage');
  // Fehlende Angaben: kein Tag, benannt wie im Abgleich.
  for (const leer of [null, '', undefined]) {
    f = mit({ pruefzeitTage: leer });
    assert.equal(f.status, 'fehlt'); assert.equal(f.tag, null); assert.deepEqual(f.fehlend, ['Mindestprüfzeit']); assert.equal(f.text, 'Mindestprüfzeit fehlt.');
  }
  f = mit({ bestellfrist: null });
  assert.equal(f.status, 'fehlt'); assert.deepEqual(f.fehlend, ['Bestellfrist']); assert.equal(f.text, 'Bestellfrist fehlt.');
  f = mit({ bestellfrist: null, pruefzeitTage: null });
  assert.equal(f.status, 'fehlt'); assert.deepEqual(f.fehlend, ['Bestellfrist', 'Mindestprüfzeit']); assert.equal(f.text, 'Bestellfrist fehlt. Mindestprüfzeit fehlt.');
  // Ungültige Angaben sind ein Widerspruch (Klärung), keine fehlende Angabe.
  for (const falsch of [-1, 366, 1.5, 'abc', '1,5', '-3']) {
    f = mit({ pruefzeitTage: falsch });
    assert.equal(f.status, 'klaerung', String(falsch)); assert.equal(f.tag, null); assert.deepEqual(f.fehlend, []);
    assert.deepEqual(f.klaerung, ['Die Mindestprüfzeit muss eine ganze Zahl von 0 bis 365 Tagen sein.']); assert.equal(f.text, f.klaerung[0]);
  }
  f = mit({ bestellfrist: '2027-02-30' });
  assert.equal(f.status, 'klaerung'); assert.deepEqual(f.klaerung, ['Die Bestellfrist enthält ein ungültiges Datum.']);
  f = mit({ annahmeBis: '2027-13-01' });
  assert.equal(f.status, 'klaerung'); assert.deepEqual(f.klaerung, ['Das Ende des Annahmefensters enthält ein ungültiges Datum.']);
  // Widerspruch geht vor: ungültige Bestellfrist und fehlende Prüfzeit ergeben „Klärung“; die fehlende Angabe bleibt benannt.
  f = mit({ bestellfrist: '2027-02-30', pruefzeitTage: null });
  assert.equal(f.status, 'klaerung'); assert.deepEqual(f.fehlend, ['Mindestprüfzeit']); assert.equal(f.text, 'Die Bestellfrist enthält ein ungültiges Datum.');
  f = mit({ bestellfrist: '2027-02-30', pruefzeitTage: -1 });
  assert.deepEqual(f.klaerung, ['Die Bestellfrist enthält ein ungültiges Datum.', 'Die Mindestprüfzeit muss eine ganze Zahl von 0 bis 365 Tagen sein.']);
  // Ende des Annahmefensters vor der Bestellfrist: Der frühere Tag gilt.
  f = mit({ annahmeBis: '2027-02-10' });
  assert.equal(f.status, 'ok'); assert.equal(f.tag, '2027-01-27'); assert.equal(f.grenze, 'annahme'); assert.equal(f.grenzTag, '2027-02-10');
  assert.equal(f.text, 'Ende des Annahmefensters 10.02.2027 minus 14 Tage Mindestprüfzeit');
  // Gleichstand und späteres Annahmeende: die Bestellfrist. Ohne Annahmeende: ebenso.
  for (const bis of ['2027-02-19', '2027-03-31', null, '']) { f = mit({ annahmeBis: bis }); assert.equal(f.grenze, 'bestellfrist', String(bis)); assert.equal(f.tag, '2027-02-05'); }
  // Der Beginn des Annahmefensters geht nicht in die Rechnung ein.
  assert.equal(mit({ annahmeVon: null }).tag, '2027-02-05'); assert.equal(mit({ annahmeVon: 'kaputt' }).tag, '2027-02-05');
});

test('T3 Herkunft „geschätzt“ nennt nur Angaben, die in die Rechnung eingehen; Doppelboden liest die Ersatzentscheidung', () => {
  const mit = (extra) => pruefbitteFrist({ ...NEUTRAL, ...extra });
  let f = mit({ belegt: { bestellfrist: 'geschaetzt', pruefzeitTage: 'belegt', annahme: 'geschaetzt' } });
  assert.deepEqual(f.geschaetzt, ['Bestellfrist'], 'Annahmefenster zählt nicht, solange die Bestellfrist gilt');
  assert.equal(f.text, 'Bestellfrist 19.02.2027 (geschätzt) minus 14 Tage Mindestprüfzeit');
  f = mit({ annahmeBis: '2027-02-10', belegt: { bestellfrist: 'geschaetzt', pruefzeitTage: 'geschaetzt', annahme: 'geschaetzt' } });
  assert.deepEqual(f.geschaetzt, ['Mindestprüfzeit', 'Annahmefenster'], 'Reihenfolge und Namen wie im Abgleich; die Bestellfrist gilt hier nicht');
  assert.equal(f.text, 'Ende des Annahmefensters 10.02.2027 (geschätzt) minus 14 Tage Mindestprüfzeit (geschätzt)');
  assert.deepEqual(mit({ belegt: undefined }).geschaetzt, [], 'ohne Kennzeichen wird nichts behauptet');
  // Doppelboden: ohne Bestellfrist gilt der Tag der Ersatzentscheidung (wie pruefeZeit); die Beispielbedarfe haben keine Prüfzeit.
  const boden = { projekt: 'LH', id: 'BD-X', gruppe: 'boden', bedarfM2: 10, fristen: { nachweis: '2026-11-19T10:00', ersatz: '2026-11-20T12:00' } };
  assert.equal(pruefbitteFrist(boden).status, 'fehlt'); assert.deepEqual(pruefbitteFrist(boden).fehlend, ['Mindestprüfzeit']);
  f = pruefbitteFrist({ ...boden, pruefzeitTage: 5 });
  assert.equal(f.tag, '2026-11-15'); assert.equal(f.grenzTag, '2026-11-20'); assert.equal(f.text, 'Bestellfrist 20.11.2026 minus 5 Tage Mindestprüfzeit');
  // Rein: die Eingabe bleibt unverändert, gleiche Eingabe gleiches Ergebnis.
  const kopie = structuredClone(BD24);
  assert.deepEqual(pruefbitteFrist(BD24), pruefbitteFrist(BD24)); assert.deepEqual(BD24, kopie);
});

// ---------- T4 ----------
test('T4 Gleichlauf mit dem Abgleich: prüfbar genau bis einschließlich Prüfbitte spätestens (Bestellfrist)', () => {
  const frist = pruefbitteFrist(BD24).tag;
  const stand = (d) => abgleich(kleinKontext([T13], [BD24], `${d}T16:00`), T13, BD24);
  for (let d = '2027-01-19'; d <= '2027-02-22'; d = plusTage(d, 1)) {
    const a = stand(d);
    assert.equal(a.gesamt.key === 'weiter' || a.gesamt.key === 'knapp', d <= frist, `${d}: ${a.gesamt.key}`);
    assert.equal(a.pruefbitteMoeglich, d <= frist, `${d}: Prüfbitte`);
  }
  let a = stand('2027-02-04');
  assert.equal(a.gesamt.key, 'weiter'); assert.equal(a.zeit.reserveTage, 1);
  a = stand('2027-02-05');
  assert.equal(a.gesamt.key, 'knapp'); assert.equal(a.zeit.reserveTage, 0); assert.equal(a.zeit.gruende[0], 'Prüfende 19.02.2027 liegt am Tag der Bestellfrist 19.02.2027.');
  a = stand('2027-02-06');
  assert.equal(a.gesamt.key, 'spaet'); assert.equal(a.gesamt.label, 'Für diese Entscheidung zu spät'); assert.equal(a.zeit.gruende[0], 'Prüfende 20.02.2027 liegt 1 Tag nach der Bestellfrist 19.02.2027.');
});

test('T4 Gleichlauf mit dem Abgleich: endet das Annahmefenster vor der Bestellfrist, gilt dieser Tag', () => {
  const bd = { ...BD24, angelegt: '2026-12-01', annahmeVon: '2027-02-01', annahmeBis: '2027-02-10' };
  const t13 = { ...T13, verfuegbarAb: '2027-01-01', erfassung: { ...T13.erfassung, am: '2026-12-01T09:00' } };
  const f = pruefbitteFrist(bd);
  assert.equal(f.tag, '2027-01-27'); assert.equal(f.grenze, 'annahme'); assert.equal(f.grenzTag, '2027-02-10');
  const stand = (d) => abgleich(kleinKontext([t13], [bd], `${d}T16:00`), t13, bd);
  for (let d = '2026-12-01'; d <= '2027-02-05'; d = plusTage(d, 1)) {
    const a = stand(d);
    assert.equal(a.gesamt.key === 'weiter' || a.gesamt.key === 'knapp', d <= f.tag, `${d}: ${a.gesamt.key}`);
  }
  assert.equal(stand('2027-01-27').gesamt.key, 'knapp');
  const spaet = stand('2027-01-28');
  assert.equal(spaet.gesamt.key, 'spaet'); assert.equal(spaet.zeit.gruende[0], 'Frühester Übergabetag 11.02.2027 liegt 1 Tag nach dem Ende des Annahmefensters 10.02.2027.');
  // Hätte die Bestellfrist gegolten (05.02.2027), stünde die Frist 9 Tage zu spät.
  assert.equal(pruefbitteFrist({ ...bd, annahmeBis: null }).tag, '2027-02-05');
});

// ---------- T5 ----------
test('T5 Zeitkritisch: Eintrag ab 7 Tage vor dem Fristtag, einmal je Bedarf, nie überfällig', () => {
  const p = pilot();
  assert.equal(fristEintraege(kontext(p, '2027-01-29T09:00'), 'BD-24').length, 0, 'das Fenster endet am 05.02. um 09:00');
  const [e, ...rest] = fristEintraege(kontext(p, '2027-01-30T09:00'), 'BD-24');
  assert.equal(rest.length, 0); assert.ok(e, 'ein Eintrag am 30.01.');
  assert.equal(e.art, 'bedarf'); assert.equal(e.projekt, 'UAK'); assert.equal(e.at, '2027-02-05T23:59'); assert.equal(e.tage, 6); assert.equal(e.ueberfaellig, false); assert.equal(e.ton, 'warn');
  assert.equal(e.pruefbarePaare, 4, 'T-13, LH·T-03, LH·T-05, KB·T-31; SL·T-41 ist zu spät');
  assert.equal(e.detail, 'Bedarf · 4 prüfbare Paare · Bestellfrist 19.02.2027 minus 14 Tage Mindestprüfzeit (geschätzt)');
  assert.equal(e.ref.id, 'BD-24');
  const am = fristEintraege(kontext(p, '2027-02-05T16:00'), 'BD-24');
  assert.equal(am.length, 1); assert.equal(am[0].tage, 0, 'am Fristtag selbst steht der Eintrag noch');
  assert.equal(fristEintraege(kontext(p, '2027-02-06T09:00'), 'BD-24').length, 0, 'nach dem Fristtag kein Eintrag und nie überfällig');
  // Jeden Tag des Pilotzeitraums: höchstens ein Eintrag, genau vom 30.01. bis 05.02., nie überfällig.
  for (let d = '2027-01-19'; d <= '2027-02-22'; d = plusTage(d, 1)) {
    const l = fristEintraege(kontext(p, `${d}T09:00`), 'BD-24');
    assert.equal(l.length, d >= '2027-01-30' && d <= '2027-02-05' ? 1 : 0, d);
    assert.ok(l.every((f) => !f.ueberfaellig), d);
  }
  // Zahl und mitgelieferte Liste stimmen weiter überein; der Eintrag zählt in der Kopfzahl mit.
  const kz = kennzahlen(kontext(p, '2027-01-30T09:00'));
  assert.equal(kz.zeitkritisch.anzahl, kz.zeitkritisch.eintraege.length);
  assert.equal(kz.zeitkritisch.anzahl, kennzahlen(kontext(p, '2027-01-29T09:00')).zeitkritisch.anzahl + 1);
});

test('T5 Zeitkritisch: Einzahl bei einem prüfbaren Paar; bei Prüfzeit 0 steht die Prüfbitte vor der Bestellfrist', () => {
  const p = pilot(); p.bedarfe[0].pruefzeitTage = 0;
  const l = kennzahlen(kontext(p, '2027-02-13T09:00')).zeitkritisch.eintraege.filter((f) => f.id === 'BD-24');
  assert.deepEqual(l.map((f) => f.name), [FRIST_PRUEFBITTE, 'Bestellfrist'], 'bei gleicher Zeit zuerst die Prüfbitte');
  assert.equal(l[0].at, l[1].at); assert.equal(l[0].at, '2027-02-19T23:59');
  assert.match(l[0].detail, /minus 0 Tage Mindestprüfzeit/);
  // Ein einziges prüfbares Paar: Einzahl. Ist LH·TW-01 an BD-22 gebunden (Vorgang „Angelegt“), bleibt für BD-23 nur KB·TW-05.
  const c0 = kontext(); const q = leerePersistenz();
  q.zuordnungen.push(neueEntscheidung(c0, bauteil(c0, 'LH', 'TW-01'), { art: 'bedarf', id: 'BD-22', projekt: 'SB' }));
  const ein = fristEintraege(kontext(q, '2026-11-13T09:00'), 'BD-23');
  assert.equal(ein.length, 1); assert.equal(ein[0].pruefbarePaare, 1);
  assert.equal(ein[0].detail, 'Bedarf · 1 prüfbares Paar · Bestellfrist 27.11.2026 minus 14 Tage Mindestprüfzeit');
});

// ---------- T6 ----------
test('T6 Kein Eintrag bei laufendem Vorgang, auch „Angelegt“; nach Abbruch ist der Bedarf wieder frei', () => {
  const p = pilot(); const c = kontext(p, '2027-01-20T09:00');
  const r = pruefbitteAnlegen(c, abgleich(c, bauteil(c, 'LH', 'T-13'), bedarf(c, 'UAK', 'BD-24')));
  assert.ok(r.zuordnung, JSON.stringify(r.fehler));
  p.zuordnungen.push(r.zuordnung); p.ereignisse.push(r.ereignis);
  const c30 = kontext(p, '2027-01-30T09:00');
  assert.equal(fristEintraege(c30, 'BD-24').length, 0, 'Prüfbitte gestellt');
  // Abbruch gibt den Bedarf wieder frei, und die Frist steht wieder da.
  const abbruch = vorgangSchritt(c30, entscheidung(c30, r.zuordnung.projekt, r.zuordnung.id), 'abbruch', { grund: 'Test' });
  assert.ok(abbruch.ereignis, JSON.stringify(abbruch.fehler)); p.ereignisse.push(abbruch.ereignis);
  assert.equal(fristEintraege(kontext(p, '2027-01-30T09:00'), 'BD-24').length, 1, 'nach dem Abbruch');
  // „Angelegt“ (Zuordnung ohne Prüfbitte) zählt als laufender Vorgang.
  const q = pilot(); const cq = kontext(q);
  q.zuordnungen.push(neueEntscheidung(cq, bauteil(cq, 'LH', 'T-13'), { art: 'bedarf', id: 'BD-24', projekt: 'UAK' }));
  assert.equal(fristEintraege(kontext(q, '2027-01-30T09:00'), 'BD-24').length, 0, 'Angelegt');
});

test('T6 Kein Eintrag ohne Prüfzeit, ohne Zeitfelder oder bei ungültigen Angaben', () => {
  const at = '2027-01-30T09:00';
  // (b) Pilotbedarf ohne Mindestprüfzeit
  const p = pilot(); p.bedarfe[0].pruefzeitTage = null;
  assert.equal(fristEintraege(kontext(p, at), 'BD-24').length, 0);
  // (c) Bedarf mit leeren Zeitfeldern (BD-30 aus ansichten.test.mjs)
  const q = pilot();
  q.bedarfe.push({ projekt: 'SB', id: 'BD-30', gruppe: 'tuer', titel: 'Eigene Türen', raeume: [], etage: null, menge: 4, einheit: 'Stk', text: '', bestellfrist: null, pruefzeitTage: null, annahmeVon: null, annahmeBis: null, anforderungen: '', zustaendig: null, belegt: {}, angelegt: '2026-11-18', herkunft: 'eigene Eingabe in diesem Browser', neu: true });
  assert.equal(fristEintraege(kontext(q, at), 'BD-30').length, 0);
  assert.equal(fristEintraege(kontext(q, at), 'BD-24').length, 1, 'der Pilotbedarf daneben bleibt unberührt');
  // ungültige Angaben: Widerspruch ergibt keinen Eintrag
  for (const extra of [{ pruefzeitTage: 366 }, { bestellfrist: '2027-02-30' }, { annahmeBis: '2027-02-30' }]) {
    const w = pilot(); Object.assign(w.bedarfe[0], extra);
    assert.equal(fristEintraege(kontext(w, at), 'BD-24').length, 0, JSON.stringify(extra));
  }
});

test('T6 Kein Eintrag ohne prüfbares Paar: Die Frist ist eine Eigenschaft des Bedarfs, „prüfbar“ sagt allein der Abgleich', () => {
  const at = '2027-01-30T09:00';
  // Kein Angebot der Gruppe (Leuchten: nur LH·LE-01, nicht wiederverwendbar): Die Frist ist berechenbar, aber es gibt nichts zu prüfen.
  const p = pilot(); const licht = { ...structuredClone(BD24), id: 'BD-31', gruppe: 'licht' }; p.bedarfe.push(licht);
  assert.equal(pruefbitteFrist(licht).status, 'ok'); assert.equal(abgleichListe(kontext(p, at), { bedarf: licht }).length, 0);
  assert.equal(fristEintraege(kontext(p, at), 'BD-31').length, 0);
  // Alle Paare des Bedarfs ergeben „Klärung nötig“ (Beginn des Annahmefensters ungültig): Die Frist bleibt „ok“, ein prüfbares Paar gibt es nicht.
  const q = pilot(); q.bedarfe[0].annahmeVon = 'kaputt';
  const c = kontext(q, at);
  assert.equal(pruefbitteFrist(c.daten.bedarfe.find((d) => d.id === 'BD-24')).tag, '2027-02-05');
  assert.ok(abgleichListe(c, { bedarf: c.daten.bedarfe.find((d) => d.id === 'BD-24') }).every((a) => a.gesamt.key === 'klaerung'));
  assert.equal(fristEintraege(c, 'BD-24').length, 0);
  // Die Bedarfsseite nennt den Tag trotzdem.
  const h = bedarfDetail(mitUi(p, at), kontext(p, at).daten.bedarfe.find((d) => d.id === 'BD-31'));
  assert.ok(h.includes('<span class="mono">05.02.2027</span>'));
});

test('T6 Beispieldaten: keine neue Frist zu allen vier Projektzeiten, die Startbedingung bleibt', () => {
  for (const z of PROJEKTZEITEN) assert.equal(fristEintraege(kontext(leerePersistenz(), z.at)).length, 0, z.at);
  const k = kennzahlen(kontext(leerePersistenz(), START));
  assert.deepEqual(k.zeitkritisch.eintraege.map((f) => `${f.id}:${f.name}`), ['E-01:Aufmaßfrist', 'E-02:Nachweisfrist', 'E-01:Ersatzentscheidung', 'E-02:Ersatzentscheidung']);
  assert.equal(k.zeitkritisch.anzahl, 4); assert.equal(k.zeitkritisch.ueberfaellig, 0);
  assert.equal(k.passendePaare.anzahl, 8); assert.equal(k.passendePaare.pruefbar, 2); assert.equal(k.vorgaenge.anzahl, 2);
});

// ---------- T7 ----------
test('T7 Beispielbedarfe: BD-23 am 13.11.2026 knapp mit Eintrag, am 14.11.2026 zu spät ohne Eintrag', () => {
  const stand = (at) => { const c = kontext(leerePersistenz(), at); return { c, a: abgleich(c, bauteil(c, 'LH', 'TW-01'), bedarf(c, 'SB', 'BD-23')) }; };
  let s = stand('2026-11-13T09:00');
  assert.equal(s.a.gesamt.key, 'knapp');
  const [e, ...rest] = fristEintraege(s.c, 'BD-23');
  assert.equal(rest.length, 0); assert.ok(e);
  assert.equal(e.at, '2026-11-13T23:59'); assert.equal(e.tage, 0); assert.equal(e.pruefbarePaare, 2); assert.equal(e.ueberfaellig, false);
  assert.equal(e.detail, 'Bedarf · 2 prüfbare Paare · Bestellfrist 27.11.2026 minus 14 Tage Mindestprüfzeit');
  s = stand('2026-11-14T09:00');
  assert.equal(s.a.gesamt.key, 'spaet'); assert.equal(s.a.gesamt.label, 'Für diese Entscheidung zu spät');
  assert.equal(fristEintraege(s.c, 'BD-23').length, 0);
});

test('T7 Beispielbedarfe: BD-22 erscheint ab 15.03.2027, nicht am 14.03.2027', () => {
  assert.equal(fristEintraege(kontext(leerePersistenz(), '2027-03-14T09:00'), 'BD-22').length, 0);
  const [e, ...rest] = fristEintraege(kontext(leerePersistenz(), '2027-03-15T09:00'), 'BD-22');
  assert.equal(rest.length, 0); assert.ok(e);
  assert.equal(e.at, '2027-03-21T23:59'); assert.equal(e.tage, 6); assert.equal(e.pruefbarePaare, 2);
  assert.equal(e.detail, 'Bedarf · 2 prüfbare Paare · Bestellfrist 31.03.2027 minus 10 Tage Mindestprüfzeit (geschätzt)');
});

// ---------- T8 ----------
const sauber = (html, was) => {
  assert.ok(html.length > 200, `${was}: zu wenig HTML`);
  for (const [re, name] of [[/\bundefined\b/, 'undefined'], [/\bNaN\b/, 'NaN'], [/\[object Object\]/, '[object Object]'], [/\bnull\b(?![^<]*>)/, 'null']]) {
    const m = html.match(re); assert.equal(m, null, `${was}: enthält ${name} bei „${m && html.slice(Math.max(0, m.index - 60), m.index + 40)}“`);
  }
};
const FREMD = /€|CO₂|Einsparung|Kosten|geeignet|Eignung|Freigabe/i;
const angabeZeile = (html) => /<div><dt>Prüfbitte spätestens<\/dt><dd>([\s\S]*?)<\/dd><\/div>/.exec(html)?.[1];
const hatChip = (html, wort) => new RegExp(`<span class="chip chip-[a-z]+">(?:<svg[\\s\\S]*?</svg>)?${wort}</span>`).test(html);
const VORLAUF = 'In den 7 Tagen davor steht sie unter „Zeitkritisch“, solange ein Angebot prüfbar ist und kein Vorgang läuft.';

test('T8 Übersicht: Zeile „Prüfbitte spätestens“ mit Detailzeile und Link zum Bedarf', () => {
  const c = mitUi(pilot(), '2027-01-30T09:00'); const kz = kennzahlen(c);
  const zeilen = [...uebersicht(c).matchAll(/<li class="frist-zeile">([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  assert.equal(zeilen.length, kz.zeitkritisch.anzahl, 'Zahl der Zeilen gleich Kopfzahl');
  const z = zeilen.filter((x) => x.includes(FRIST_PRUEFBITTE));
  assert.equal(z.length, 1);
  const f = kz.zeitkritisch.eintraege.find((x) => x.name === FRIST_PRUEFBITTE);
  assert.ok(z[0].includes(`<b>${FRIST_PRUEFBITTE}</b> · BD-24 · Bürotüren 1. OG`));
  assert.ok(z[0].includes(`href="${routeBedarf(BD24)}"`), z[0]);
  assert.ok(z[0].includes(`<small>`) && z[0].includes(esc(f.detail)), 'Detailzeile maskiert eingebaut');
  assert.ok(!z[0].includes('Bedarf, zum Bedarf'), 'die Detailzeile ersetzt den Standardtext');
  assert.ok(z[0].includes('Fr 05.02., 23:59'), 'Wochentag und Uhrzeit in der Zeitspalte');
  assert.match(z[0], /noch 6 Tg\. 14 Std\./);
  assert.doesNotMatch(z[0], FREMD);
  assert.match(uebersicht(c), new RegExp(`${kz.zeitkritisch.anzahl} Fristen`));
  // Ohne Detailzeile bleibt der bisherige Text: die Bestellfrist von BD-23 nach ihrem Tag.
  const spaet = mitUi(leerePersistenz(), '2026-11-28T09:00');
  assert.match(uebersicht(spaet), /Bedarf, zum Bedarf/);
});

test('T8 Übersicht am Demo-Stichtag: keine Zeile „Prüfbitte spätestens“, 4 Fristen wie im Pitch-Stand', () => {
  for (const z of PROJEKTZEITEN) {
    const h = uebersicht(mitUi(leerePersistenz(), z.at)); sauber(h, `Übersicht ${z.at}`);
    assert.equal(h.includes(FRIST_PRUEFBITTE), false, z.at);
  }
  const h = uebersicht(mitUi());
  assert.match(h, /4 Fristen/); assert.match(h, /noch 2 Std\./); assert.match(h, /Aufmaßfrist<\/b> · E-01 · T-07 → B-02/);
});

test('T8 Bedarfsseite BD-24: Tag, Rechnung, Chip „geschätzt“, danach „verstrichen“', () => {
  const sicht = (at) => { const c = mitUi(pilot(), at); return bedarfDetail(c, bedarf(c, 'UAK', 'BD-24')); };
  let h = sicht('2027-01-30T09:00'); sauber(h, 'BD-24 30.01.');
  let z = angabeZeile(h);
  assert.ok(z, 'Zeile „Prüfbitte spätestens“ im Block Angaben');
  assert.match(h, /<dt>Annahmefenster<\/dt>[\s\S]*?<\/div>\s*<div><dt>Prüfbitte spätestens<\/dt>/, 'steht direkt nach „Annahmefenster“');
  assert.ok(z.includes('<span class="mono">05.02.2027</span>')); assert.ok(z.includes('Bestellfrist 19.02.2027 minus 14 Tage Mindestprüfzeit (geschätzt)'));
  assert.ok(hatChip(z, 'geschätzt')); assert.equal(hatChip(z, 'verstrichen'), false); assert.ok(z.includes(VORLAUF));
  assert.doesNotMatch(z, FREMD);
  h = sicht('2027-02-05T16:00'); z = angabeZeile(h);
  assert.equal(hatChip(z, 'verstrichen'), false, 'am Fristtag noch nicht verstrichen'); assert.ok(z.includes(VORLAUF));
  h = sicht('2027-02-06T09:00'); sauber(h, 'BD-24 06.02.'); z = angabeZeile(h);
  assert.ok(z.includes('05.02.2027')); assert.ok(hatChip(z, 'verstrichen')); assert.ok(hatChip(z, 'geschätzt')); assert.equal(z.includes('In den 7 Tagen davor'), false);
  assert.ok(z.includes('Bestellfrist 19.02.2027 minus 14 Tage Mindestprüfzeit (geschätzt)'));
});

test('T8 Bedarfsseite der Beispielbedarfe: BD-22 geschätzt, BD-23 verstrichen, BD-21 nicht berechenbar', () => {
  const c = mitUi();
  const z22 = angabeZeile(bedarfDetail(c, bedarf(c, 'SB', 'BD-22')));
  assert.ok(z22.includes('21.03.2027')); assert.ok(hatChip(z22, 'geschätzt')); assert.ok(z22.includes('Bestellfrist 31.03.2027 minus 10 Tage Mindestprüfzeit (geschätzt)')); assert.ok(z22.includes(VORLAUF));
  const z23 = angabeZeile(bedarfDetail(c, bedarf(c, 'SB', 'BD-23')));
  assert.ok(z23.includes('13.11.2026')); assert.ok(hatChip(z23, 'verstrichen')); assert.equal(hatChip(z23, 'geschätzt'), false);
  assert.ok(z23.includes('Bestellfrist 27.11.2026 minus 14 Tage Mindestprüfzeit')); assert.equal(z23.includes('In den 7 Tagen davor'), false);
  const z21 = angabeZeile(bedarfDetail(c, bedarf(c, 'SB', 'BD-21')));
  assert.ok(hatChip(z21, 'nicht berechenbar')); assert.ok(z21.includes('Bestellfrist fehlt. Mindestprüfzeit fehlt.'));
  assert.equal(/\d{2}\.\d{2}\.\d{4}/.test(z21), false, 'kein Datum, wenn nicht berechenbar'); assert.equal(z21.includes('In den 7 Tagen davor'), false);
  for (const z of [z22, z23, z21]) assert.doesNotMatch(z, FREMD);
  // Widerspruch: nicht berechenbar mit dem Grund des Abgleichs.
  const w = bedarfDetail(c, { ...bedarf(c, 'SB', 'BD-22'), pruefzeitTage: 366 });
  assert.ok(hatChip(angabeZeile(w), 'nicht berechenbar')); assert.ok(angabeZeile(w).includes('Die Mindestprüfzeit muss eine ganze Zahl von 0 bis 365 Tagen sein.'));
  const b = bedarfDetail(c, { ...bedarf(c, 'SB', 'BD-22'), bestellfrist: '2027-02-30' });
  assert.ok(angabeZeile(b).includes('Die Bestellfrist enthält ein ungültiges Datum.'));
});

test('T8 Bedarfsseite: jeder Bedarf in jedem Kontext enthält die Zeile und bleibt sauber', () => {
  const kontexte = [...PROJEKTZEITEN.map((z) => [`Beispiel ${z.at}`, mitUi(leerePersistenz(), z.at)]), ...['2027-01-19T09:00', '2027-01-30T09:00', '2027-02-06T09:00', '2027-03-15T09:00'].map((at) => [`Pilot ${at}`, mitUi(pilot(), at)])];
  for (const [name, c] of kontexte) {
    for (const d of c.daten.bedarfe) {
      const h = bedarfDetail(c, d); sauber(h, `${d.projekt} ${d.id} ${name}`);
      const z = angabeZeile(h); assert.ok(z, `${d.id} ${name}: Zeile fehlt`);
      assert.doesNotMatch(z, FREMD, `${d.id} ${name}`);
    }
    sauber(uebersicht(c), `Übersicht ${name}`);
    const kz = kennzahlen(c); assert.equal((uebersicht(c).match(/class="frist-zeile"/g) || []).length, kz.zeitkritisch.anzahl, name);
  }
});

// Die Frist liest nur den Abgleich: Sie ändert dessen Ergebnis für kein Paar der Beispieldaten.
test('Abgleich bleibt unverändert: gleiche Paare, gleiche Ergebnisse wie im Pitch-Stand', () => {
  const l = abgleichListe(kontext()).map((a) => `${a.bauteil.projekt}·${a.bauteil.id}→${a.bedarf.id}:${a.gesamt.key}`).sort();
  assert.deepEqual(l, ['KB·T-31→BD-21:fehlt', 'KB·TW-05→BD-22:weiter', 'KB·TW-05→BD-23:spaet', 'LH·T-03→BD-21:fehlt', 'LH·T-05→BD-21:fehlt', 'LH·TW-01→BD-22:weiter', 'LH·TW-01→BD-23:spaet', 'SL·T-41→BD-21:fehlt']);
});
