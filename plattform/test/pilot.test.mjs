// Pilotbetrieb: Interesse, Dienstleister, Anfragen mit Verlauf, Verkauf und Provision, Angebot bearbeiten (reine Regeln).
import test from 'node:test';
import assert from 'node:assert/strict';
import { kontext, START, bauteil, bedarf } from './_hilfe.mjs';
import { leerePersistenz, ladePersistenz, speichere, baueDaten, exportStand, importStand, vereinige, anzahlEigeneAenderungen } from '../app/zustand.js';
import { interesseAnlegen, interesseZurueckziehen, offenesInteresse, pruefeDienstleister, dienstleisterAusEntwurf, leererDienstleisterEntwurf,
  pruefeAnfrage, anfrageAusEntwurf, leererAnfrageEntwurf, anfrageSchritt, anfrageStatus, naechsteId, verkaufSetzen, provisionSetzen, provisionsLage,
  pruefeAngebot, angebotAenderung, leererAngebotEntwurf, letzteAenderung } from '../app/pilot.js';

const mit = (p) => kontext(p, START);
const TW05 = { projekt: 'KB', id: 'TW-05' }; const BD22 = { projekt: 'SB', id: 'BD-22' }; const BD21 = { projekt: 'SB', id: 'BD-21' };

test('Interesse: nur passende Gruppe, kein Doppel, keine Reservierung; zurückziehen', () => {
  const p = leerePersistenz(); let ctx = mit(p);
  const r = interesseAnlegen(ctx, { bauteil: TW05, bedarf: BD22, notiz: 'Bitte Rückmeldung' });
  assert.ok(r.interesse); assert.equal(r.interesse.id, 'I-01'); assert.match(r.interesse.hinweis, /keine Reservierung/);
  p.interessen.push(r.interesse); ctx = mit(p);
  assert.match(interesseAnlegen(ctx, { bauteil: TW05, bedarf: BD22 }).fehler.allgemein, /bereits/);
  assert.match(interesseAnlegen(ctx, { bauteil: TW05, bedarf: BD21 }).fehler.allgemein, /Bauteilgruppe passt nicht/);
  assert.ok(offenesInteresse(ctx, bauteil(ctx, 'KB', 'TW-05'), bedarf(ctx, 'SB', 'BD-22')));
  const z = interesseZurueckziehen(ctx, r.interesse); assert.equal(z.interesse.status, 'zurueckgezogen');
  assert.ok(interesseZurueckziehen(ctx, z.interesse).fehler);
});

test('Dienstleister: Testeintrag oder freigegebener Kontakt mit Freigabevermerk', () => {
  const e = leererDienstleisterEntwurf();
  assert.ok(pruefeDienstleister(e).name); assert.ok(pruefeDienstleister(e).leistungen);
  e.name = 'Prüfbüro Test'; e.leistungen = { fachpruefung: true }; e.art = 'freigegeben';
  assert.match(pruefeDienstleister(e).freigabe, /freigegeben/);
  e.freigabe = 'Houssam, 19.11.2026, Testdaten'; assert.deepEqual(pruefeDienstleister(e), {});
  const d = dienstleisterAusEntwurf(e, { id: naechsteId([], 'DL'), at: START });
  assert.equal(d.id, 'DL-01'); assert.deepEqual(d.leistungen, ['fachpruefung']); assert.equal(d.art, 'freigegeben');
  e.art = 'test'; const t = dienstleisterAusEntwurf(e, { id: 'DL-02', at: START }); assert.equal(t.freigabe, '');
});

function mitDienstleister(p) {
  p.dienstleister.push(dienstleisterAusEntwurf({ name: 'Prüfbüro Test', leistungen: { fachpruefung: true, transport: true }, art: 'test' }, { id: 'DL-01', at: START }));
  return p;
}

test('Anfrage: Pflichtfelder, Verlauf ohne automatische Positivprüfung, Statuskette', () => {
  const p = mitDienstleister(leerePersistenz()); let ctx = mit(p);
  const e = leererAnfrageEntwurf(TW05, BD22);
  const f = pruefeAnfrage(e, ctx); assert.ok(f.leistung); assert.ok(f.zustaendig); assert.ok(f.termin); assert.equal(f.bauteil, undefined);
  Object.assign(e, { leistung: 'fachpruefung', zustaendig: 'Planung (J. Neumann)', termin: '2026-12-10', unterlagen: 'Foto, Typenschild', offeneFragen: 'Schallschutz' });
  assert.deepEqual(pruefeAnfrage(e, ctx), {});
  let a = anfrageAusEntwurf(e, { id: naechsteId(p.anfragen, 'A'), at: START });
  assert.equal(a.id, 'A-01'); assert.equal(a.status, 'vorbereitet'); assert.match(a.verlauf[0].text, /Nicht versendet/);
  p.anfragen.push(a); ctx = mit(p);
  // Ergebnis vor Beauftragung ist nicht möglich; Beauftragung braucht Dienstleister und Bestätigung.
  assert.match(anfrageSchritt(ctx, a, 'ergebnis', { urteil: 'positiv', person: 'X' }).fehler.allgemein, /nicht möglich/);
  assert.ok(anfrageSchritt(ctx, a, 'beauftragt', {}).fehler.dienstleister);
  assert.ok(anfrageSchritt(ctx, a, 'beauftragt', { dienstleister: 'DL-01' }).fehler.bestaetigt);
  const ctx2 = kontext(p, '2026-11-18T15:00');
  a = anfrageSchritt(ctx2, a, 'beauftragt', { dienstleister: 'DL-01', bestaetigt: true }).anfrage;
  assert.equal(a.status, 'beauftragt'); assert.match(a.verlauf.at(-1).text, /Keine Nachricht versendet/);
  // Ergebnis: Urteil Pflicht, bei negativ Grund Pflicht; kein Automatismus
  assert.ok(anfrageSchritt(ctx2, a, 'ergebnis', { person: 'L. Brandt' }).fehler.urteil);
  assert.ok(anfrageSchritt(ctx2, a, 'ergebnis', { urteil: 'negativ', person: 'L. Brandt' }).fehler.notiz);
  const neg = anfrageSchritt(ctx2, a, 'ergebnis', { urteil: 'negativ', person: 'L. Brandt', notiz: 'Maße passen nicht' }).anfrage;
  assert.equal(neg.status, 'ergebnis'); assert.equal(neg.ergebnis.urteil, 'negativ'); assert.match(neg.verlauf.at(-1).text, /keine Fachfreigabe/);
  assert.deepEqual(anfrageStatus(neg).erlaubt, ['uebergabe', 'klaerung', 'abgeschlossen', 'abgelehnt']);
  const abl = anfrageSchritt(ctx2, neg, 'abgelehnt', { grund: 'ungeeignet laut Prüfung' }).anfrage;
  assert.equal(anfrageStatus(abl).beendet, true); assert.ok(anfrageSchritt(ctx2, abl, 'klaerung', { notiz: 'x' }).fehler.allgemein);
  // Positiver Weg bis Abschluss, Rückdatierung gesperrt
  const pos = anfrageSchritt(ctx2, a, 'ergebnis', { urteil: 'positiv', person: 'L. Brandt' }).anfrage;
  assert.ok(anfrageSchritt(ctx, pos, 'uebergabe', { termin: '2026-12-01', ort: 'Lager' }).fehler.allgemein, 'Stichtag vor dem letzten Eintrag');
  const ue = anfrageSchritt(ctx2, pos, 'uebergabe', { termin: '2026-12-01', ort: 'Lager Baustelle' }).anfrage;
  assert.equal(ue.status, 'uebergabe'); assert.ok(anfrageSchritt(ctx2, ue, 'abgeschlossen', { datum: '2026-12-01' }).fehler.datum, 'nicht nach dem Stichtag');
  const ab = anfrageSchritt(ctx2, ue, 'abgeschlossen', { datum: '2026-11-18' }).anfrage; assert.equal(ab.status, 'abgeschlossen');
  // Kostentragung jederzeit eintragbar, ohne Beträge
  const k = anfrageSchritt(ctx2, a, 'kosten', { kostentraeger: 'kaeufer', kostenHinweis: 'laut Absprache' }).anfrage; assert.equal(k.kostentraeger, 'kaeufer');
});

test('Verkauf und Provision: ohne Abschluss keine Provision, ohne Vereinbarung offen, kein Vorgabewert', () => {
  const p = mitDienstleister(leerePersistenz()); let ctx = mit(p);
  const e = { ...leererAnfrageEntwurf(TW05, BD22), leistung: 'transport', zustaendig: 'Bauleitung', termin: '2026-12-10' };
  let a = anfrageAusEntwurf(e, { id: 'A-01', at: START }); p.anfragen.push(a); ctx = mit(p);
  const b = bauteil(ctx, 'KB', 'TW-05');
  const lage0 = provisionsLage(ctx, b); assert.equal(lage0.verkauf.status, 'offen'); assert.equal(lage0.zeilen.length, 0, 'vorbereitete Anfrage ist keine vermittelte Leistung');
  p.anfragen[0] = anfrageSchritt(ctx, a, 'beauftragt', { dienstleister: 'DL-01', bestaetigt: true }).anfrage; ctx = mit(p);
  assert.equal(provisionsLage(ctx, b).zeilen.length, 1); assert.equal(provisionsLage(ctx, b).zeilen[0].provision, null, 'ohne Verkauf kein Provisionsstatus');
  assert.match(provisionSetzen(ctx, b, 'DL-01', { status: 'vereinbart', grundlage: 'x' }).fehler.allgemein, /Ohne abgeschlossenen Bauteilverkauf/);
  assert.ok(verkaufSetzen(ctx, b, { status: 'abgeschlossen' }).fehler.datum);
  assert.ok(verkaufSetzen(ctx, b, { status: 'abgeschlossen', datum: '2026-11-20' }).fehler.datum, 'nicht nach dem Stichtag');
  p.verkaeufe['KB:TW-05'] = verkaufSetzen(ctx, b, { status: 'abgeschlossen', datum: '2026-11-18', bedarf: BD22 }).verkauf; ctx = mit(p);
  let lage = provisionsLage(ctx, b); assert.equal(lage.verkauf.status, 'abgeschlossen'); assert.equal(lage.zeilen[0].provision.status, 'offen');
  assert.ok(provisionSetzen(ctx, b, 'DL-01', { status: 'vereinbart' }).fehler.grundlage, 'Vereinbarung braucht eine eingetragene Grundlage');
  assert.ok(provisionSetzen(ctx, b, 'DL-99', { status: 'keine' }).fehler.allgemein);
  p.verkaeufe['KB:TW-05'] = provisionSetzen(ctx, b, 'DL-01', { status: 'vereinbart', grundlage: 'laut Rahmenvereinbarung vom 19.11.2026' }).verkauf; ctx = mit(p);
  lage = provisionsLage(ctx, b); assert.equal(lage.zeilen[0].provision.status, 'vereinbart'); assert.match(lage.zeilen[0].provision.grundlage, /Rahmenvereinbarung/);
  assert.doesNotMatch(JSON.stringify(lage), /\d+ ?%/, 'kein Prozentsatz');
  // Verkauf zurück auf „nicht zustande gekommen“ löscht die Provisionsstände
  p.verkaeufe['KB:TW-05'] = verkaufSetzen(ctx, b, { status: 'nicht' }).verkauf; ctx = mit(p);
  assert.equal(provisionsLage(ctx, b).zeilen[0].provision, null);
});

test('Angebot bearbeiten: Prüfung, Überlagerung im Datenstand, Verlauf und letzte Änderung', () => {
  const p = leerePersistenz(); let ctx = mit(p); const b = bauteil(ctx, 'KB', 'TW-05');
  const e = leererAngebotEntwurf(b); assert.deepEqual(pruefeAngebot(e, b), {});
  e.menge = '0'; assert.ok(pruefeAngebot(e, b).menge); e.menge = '55';
  e.verfuegbarAb = '2027-02-01'; e.verfuegbarBis = '2027-01-01'; assert.ok(pruefeAngebot(e, b).verfuegbarBis); e.verfuegbarBis = '2027-03-31';
  e.status = 'nicht'; assert.ok(pruefeAngebot(e, b).grund); e.grund = 'wird im Haus weiterverwendet';
  p.bauteilAenderungen['KB:TW-05'] = angebotAenderung(e, { at: '2026-11-18T15:00' });
  const roh = JSON.stringify(p); const daten = baueDaten(ladePersistenz({ getItem: () => roh }));
  const nb = daten.bauteile.find((x) => x.projekt === 'KB' && x.id === 'TW-05');
  assert.equal(nb.menge, 55); assert.equal(nb.status, 'nicht'); assert.equal(nb.grund, 'wird im Haus weiterverwendet'); assert.match(nb.verlauf.at(-1).text, /Angebot geändert/);
  ctx = kontext(p, '2026-11-18T16:00'); assert.equal(letzteAenderung(ctx, bauteil(ctx, 'KB', 'TW-05')), '2026-11-18T15:00');
  assert.equal(letzteAenderung(mit(p), bauteil(mit(p), 'KB', 'TW-05')) < '2026-11-18T15:00', true, 'Änderungen nach dem Stichtag zählen nicht');
});

test('Datenstand sichern, laden, vereinigen; beschädigte Dateien werden abgewiesen', () => {
  const p = mitDienstleister(leerePersistenz()); const ctx = mit(p);
  p.interessen.push(interesseAnlegen(ctx, { bauteil: TW05, bedarf: BD22 }).interesse);
  const text = exportStand(p, { at: START }); assert.match(text, /circularflow-stand-v1/);
  const geladen = importStand(text); assert.equal(geladen.dienstleister.length, 1); assert.equal(geladen.interessen.length, 1);
  assert.throws(() => importStand('{"x":1}'), /Kennung/); assert.throws(() => importStand('kein json'), /kein JSON/);
  const anderer = leerePersistenz(); anderer.dienstleister.push({ ...p.dienstleister[0], id: 'DL-02', name: 'Transport Test' }); anderer.interessen.push({ ...p.interessen[0], id: 'I-01', notiz: 'Doppel' });
  const v = vereinige(p, anderer); assert.equal(v.dienstleister.length, 2); assert.equal(v.interessen.length, 1, 'gleiche Kennung bleibt einmal'); assert.equal(v.interessen[0].notiz, '');
  assert.equal(anzahlEigeneAenderungen(v), 3);
  // Laden über den Browserspeicher behält die neuen Schlüssel
  let data; const store = { setItem: (k, val) => { data = val; }, getItem: () => data };
  assert.equal(speichere(store, v).ok, true); const l = ladePersistenz(store); assert.equal(l.dienstleister.length, 2); assert.deepEqual(l.verkaeufe, {});
});
