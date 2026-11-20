// Pilotbetrieb: Interesse, Dienstleister, Anfragen mit Verlauf, Verkauf und Provision, Angebot bearbeiten (reine Regeln).
import test from 'node:test';
import assert from 'node:assert/strict';
import { kontext, START, bauteil, bedarf } from './_hilfe.mjs';
import { leerePersistenz, ladePersistenz, speichere, baueDaten, exportStand, importStand, vereinige, zusammenfuehren, standSignatur, anzahlEigeneAenderungen } from '../app/zustand.js';
import { interesseAnlegen, interesseZurueckziehen, offenesInteresse, pruefeDienstleister, dienstleisterAusEntwurf, leererDienstleisterEntwurf,
  pruefeAnfrage, anfrageAusEntwurf, leererAnfrageEntwurf, anfrageSchritt, anfrageStatus, naechsteId, verkaufSetzen, provisionSetzen, provisionsLage,
  pruefeAngebot, angebotAenderung, leererAngebotEntwurf, letzteAenderung, dienstleisterZurueckziehen, waehlbareDienstleister } from '../app/pilot.js';

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
  const v = vereinige(p, anderer); assert.equal(v.dienstleister.length, 2);
  assert.equal(v.interessen.length, 2, 'gleiche Kennung mit anderem Inhalt wird umbenannt, nichts geht still verloren'); assert.deepEqual(v.interessen.map((i) => i.id).sort(), ['I-01', 'I-02']); assert.equal(v.interessen.find((i) => i.id === 'I-02').notiz, 'Doppel');
  assert.equal(anzahlEigeneAenderungen(v), 4);
  // Laden über den Browserspeicher behält die neuen Schlüssel
  let data; const store = { setItem: (k, val) => { data = val; }, getItem: () => data };
  assert.equal(speichere(store, v).ok, true); const l = ladePersistenz(store); assert.equal(l.dienstleister.length, 2); assert.deepEqual(l.verkaeufe, {});
});

test('Drei-Wege-Zusammenführung: lokale Statuswechsel gewinnen, unveränderte Einträge folgen dem Raum', () => {
  const p = mitDienstleister(leerePersistenz()); let ctx = mit(p);
  const e = { ...leererAnfrageEntwurf(TW05, BD22), leistung: 'fachpruefung', zustaendig: 'Planung', termin: '2026-12-10' };
  p.anfragen.push(anfrageAusEntwurf(e, { id: 'A-01', at: START })); p.interessen.push(interesseAnlegen(ctx, { bauteil: TW05, bedarf: BD22 }).interesse);
  const raum = JSON.parse(JSON.stringify(p)); const sig = standSignatur(raum); // zuletzt abgeglichener Stand
  // Lokal beim selben Stichtag: Anfrage beauftragt, Interesse zurückgezogen (Befund 1 des Reviews)
  ctx = mit(p); p.anfragen[0] = anfrageSchritt(ctx, p.anfragen[0], 'beauftragt', { dienstleister: 'DL-01', bestaetigt: true }).anfrage;
  p.interessen[0] = interesseZurueckziehen(ctx, p.interessen[0]).interesse;
  // Im Raum hat inzwischen jemand anderes einen Dienstleister ergänzt
  raum.dienstleister.push({ ...raum.dienstleister[0], id: 'DL-02', name: 'Transport (anderer Browser)' });
  const z = zusammenfuehren(sig, raum, p);
  assert.equal(z.stand.anfragen[0].status, 'beauftragt'); assert.equal(z.stand.interessen[0].status, 'zurueckgezogen'); assert.equal(z.stand.dienstleister.length, 2);
  assert.deepEqual(z.umbenannt, []); assert.deepEqual(z.verworfen, []);
  // Umgekehrt: Lokal unverändert, Raum weiter → Raum gewinnt
  const z2 = zusammenfuehren(standSignatur(p), z.stand, p); assert.equal(z2.stand.dienstleister.length, 2);
});

test('Drei-Wege-Zusammenführung: gleiche Kennungen aus zwei Browsern werden umbenannt, Verweise ziehen mit', () => {
  const raum = mitDienstleister(leerePersistenz());
  raum.anfragen.push(anfrageAusEntwurf({ ...leererAnfrageEntwurf(TW05, BD22), leistung: 'transport', zustaendig: 'Bauleitung', termin: '2026-12-10' }, { id: 'A-01', at: START }));
  raum.erfassungen.push({ projekt: 'LH', id: 'T-13', gruppe: 'tuer', name: 'Innentür Raum', menge: 1, raum: '1.14', etage: '1.OG', werte: {}, erfassung: { art: 'Mobile Erfassung', am: START, von: 'browser' } });
  // Anderer Browser, ohne Abgleich (keine Signatur): gleicher Dienstleister-Schlüssel, gleiche Anfrage-Kennung, gleiche Bauteilkennung – mit anderem Inhalt und Verweisen
  const lokal = leerePersistenz();
  lokal.dienstleister.push(dienstleisterAusEntwurf({ name: 'Logistik Zwei', leistungen: { transport: true }, art: 'test' }, { id: 'DL-01', at: START }));
  lokal.erfassungen.push({ projekt: 'LH', id: 'T-13', gruppe: 'tuer', name: 'Innentür Flur', menge: 1, raum: '1.02', etage: '1.OG', werte: {}, erfassung: { art: 'Mobile Erfassung', am: START, von: 'browser' } });
  const a = anfrageAusEntwurf({ ...leererAnfrageEntwurf({ projekt: 'LH', id: 'T-13' }, null), leistung: 'ausbau', zustaendig: 'Montage', termin: '2026-12-01', dienstleister: 'DL-01' }, { id: 'A-01', at: START });
  lokal.anfragen.push(a); lokal.interessen.push({ id: 'I-01', bauteil: { projekt: 'LH', id: 'T-13' }, bedarf: { projekt: 'SB', id: 'BD-21' }, notiz: '', status: 'offen', at: START, von: 'browser' });
  lokal.verkaeufe['LH:T-13'] = { bauteil: { projekt: 'LH', id: 'T-13' }, status: 'abgeschlossen', datum: '2026-11-18', bedarf: null, notiz: '', at: START, provisionen: { 'DL-01': { status: 'offen', grundlage: '', at: START } } };
  const z = zusammenfuehren(null, raum, lokal);
  assert.equal(z.verworfen.length, 0);
  assert.deepEqual(z.umbenannt.map((u) => `${u.von}>${u.nach}`).sort(), ['A-01>A-02', 'DL-01>DL-02', 'LH:T-13>LH:T-14']);
  const s = z.stand;
  assert.equal(s.erfassungen.length, 2); assert.equal(s.erfassungen.find((x) => x.id === 'T-14').name, 'Innentür Flur');
  const neu = s.anfragen.find((x) => x.id === 'A-02'); assert.equal(neu.bauteil.id, 'T-14'); assert.equal(neu.dienstleister, 'DL-02');
  assert.equal(s.interessen[0].bauteil.id, 'T-14'); assert.ok(s.verkaeufe['LH:T-14']); assert.ok(s.verkaeufe['LH:T-14'].provisionen['DL-02']); assert.equal(s.verkaeufe['LH:T-13'], undefined);
  assert.equal(s.anfragen.find((x) => x.id === 'A-01').leistung, 'transport', 'Eintrag des Raums bleibt unverändert');
  assert.equal(raum.anfragen.length, 1); assert.equal(raum.erfassungen.length, 1, 'der Raumstand selbst bleibt unverändert');
});

test('Rückdatierung ist bei Verkauf, Provision, Angebot und Interesse gesperrt; Provisionsvereinbarung bleibt beim Umstellen erhalten', () => {
  const p = mitDienstleister(leerePersistenz()); let ctx = kontext(p, '2026-11-18T15:00'); const b = bauteil(ctx, 'KB', 'TW-05');
  p.anfragen.push(anfrageAusEntwurf({ ...leererAnfrageEntwurf(TW05, BD22), leistung: 'transport', zustaendig: 'Bauleitung', termin: '2026-12-10' }, { id: 'A-01', at: START }));
  p.anfragen[0] = anfrageSchritt(ctx, p.anfragen[0], 'beauftragt', { dienstleister: 'DL-01', bestaetigt: true }).anfrage; ctx = kontext(p, '2026-11-18T15:00');
  p.verkaeufe['KB:TW-05'] = verkaufSetzen(ctx, b, { status: 'abgeschlossen', datum: '2026-11-18' }).verkauf; ctx = kontext(p, '2026-11-18T15:00');
  p.verkaeufe['KB:TW-05'] = provisionSetzen(ctx, b, 'DL-01', { status: 'vereinbart', grundlage: 'laut Absprache' }).verkauf; ctx = kontext(p, '2026-11-18T15:00');
  assert.match(verkaufSetzen(mit(p), b, { status: 'nicht' }).fehler.allgemein, /Stichtag/, 'früherer Stichtag als der letzte Eintrag');
  const zurueck = verkaufSetzen(ctx, b, { status: 'nicht' }).verkauf; assert.equal(zurueck.provisionen['DL-01'].status, 'vereinbart', 'Vereinbarung bleibt gespeichert');
  p.verkaeufe['KB:TW-05'] = zurueck; ctx = kontext(p, '2026-11-18T15:00'); assert.equal(provisionsLage(ctx, b).zeilen[0].provision, null, 'ohne Abschluss nicht anwendbar');
  p.verkaeufe['KB:TW-05'] = verkaufSetzen(ctx, b, { status: 'abgeschlossen', datum: '2026-11-18' }).verkauf; ctx = kontext(p, '2026-11-18T15:00'); assert.equal(provisionsLage(ctx, b).zeilen[0].provision.status, 'vereinbart');
  assert.match(provisionSetzen(mit(p), b, 'DL-01', { status: 'keine' }).fehler.allgemein, /Stichtag/);
  p.bauteilAenderungen['KB:TW-05'] = angebotAenderung(leererAngebotEntwurf(b), { at: '2026-11-18T15:00' });
  const b2 = bauteil(kontext(p, START), 'KB', 'TW-05'); assert.match(pruefeAngebot(leererAngebotEntwurf(b2), b2, START).allgemein, /Stichtag/); assert.deepEqual(pruefeAngebot(leererAngebotEntwurf(b2), b2, '2026-11-18T15:00'), {});
  const i = interesseAnlegen(ctx, { bauteil: TW05, bedarf: BD22 }).interesse; assert.match(interesseZurueckziehen(mit(p), i).fehler.allgemein, /Stichtag/);
});

test('Angebot: „wird angeboten“ hebt „nicht verfügbar“ auf; Dienstleister lassen sich zurückziehen und sind dann nicht wählbar', () => {
  const p = leerePersistenz(); let ctx = mit(p);
  const nicht = ctx.daten.bauteile.find((b) => b.status === 'nicht'); assert.ok(nicht, 'Beispieldaten enthalten ein nicht verfügbares Bauteil');
  const e = leererAngebotEntwurf(nicht); assert.equal(e.status, 'nicht'); e.status = 'erfasst';
  p.bauteilAenderungen[`${nicht.projekt}:${nicht.id}`] = angebotAenderung(e, { at: '2026-11-18T15:00' });
  const nb = baueDaten(p).bauteile.find((b) => b.projekt === nicht.projekt && b.id === nicht.id); assert.equal(nb.status, 'erfasst'); assert.match(nb.verlauf.at(-1).text, /wieder angeboten/);
  const q = mitDienstleister(leerePersistenz()); ctx = mit(q);
  const r = dienstleisterZurueckziehen(ctx, q.dienstleister[0], 'falsch eingetragen'); q.dienstleister[0] = r.dienstleister; ctx = mit(q);
  assert.equal(waehlbareDienstleister(ctx).length, 0); assert.ok(dienstleisterZurueckziehen(ctx, q.dienstleister[0]).fehler);
  const e2 = { ...leererAnfrageEntwurf(TW05, BD22), leistung: 'fachpruefung', zustaendig: 'Planung', termin: '2026-12-10', dienstleister: 'DL-01' };
  assert.match(pruefeAnfrage(e2, ctx).dienstleister, /zurückgezogen/);
});
