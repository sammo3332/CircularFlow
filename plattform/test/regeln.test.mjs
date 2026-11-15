// Regeltests der Plattform (Fassung 1). Aufruf vom Repository-Root:
// node --test plattform/test/regeln.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../../prototype/dist/door-rules.mjs';
import {
  wertAusEingabe, wertText, anforderungTuer, bewerteBoden, bewerteEinfach, lage, bauteilStatus, naechsteHandlung,
  offeneNachweise, moeglicheZiele, neueEntscheidung, erkennungSimulation, naechsteBauteilId, pruefeErfassung,
  bauteilAusErfassung, radarSchritt, pruefeMeldung, ifcVorpruefung, schluessel,
} from '../app/regeln.js';
import { GRUPPEN, PROJEKTZEITEN, BEDARFE, ZIELOEFFNUNGEN } from '../app/daten.js';
import { QUELLEN, HINWEISE } from '../app/radar-daten.js';
import { baueDaten, leerePersistenz, ladePersistenz, speichere, SPEICHERSCHLUESSEL } from '../app/zustand.js';
import { sortiereHinweise } from '../app/ansichten/radar.js';
import { istDatum, jetztBerlin } from '../app/zeit.js';

const START = PROJEKTZEITEN[0].at; // 2026-11-18T14:00
const kontext = (p = leerePersistenz(), at = START) => ({ R, at, daten: baueDaten(p), ereignisse: p.ereignisse, ezustand: p.ezustand });
const bauteil = (ctx, projekt, id) => ctx.daten.bauteile.find((b) => b.projekt === projekt && b.id === id);
const entscheidung = (ctx, projekt, id) => ctx.daten.entscheidungen.find((e) => e.projekt === projekt && e.id === id);
const breite = GRUPPEN.tuer.felder.find((f) => f.key === 'breite');
const material = GRUPPEN.tuer.felder.find((f) => f.key === 'material');

// ---------- Werte und Wertstatus ----------
test('Wert: Maßeingabe zählt als gemessen, leere Eingabe als fehlt, ungültige Zahl als Fehler', () => {
  assert.deepEqual(wertAusEingabe(breite, ''), { wert: null, status: 'fehlt', quelle: '' });
  assert.deepEqual(wertAusEingabe(breite, ' 860 ', 'Messung'), { wert: 860, status: 'gemessen', quelle: 'Messung' });
  assert.equal(wertAusEingabe(breite, '860,5').wert, 860.5);
  assert.ok(wertAusEingabe(breite, '86O').fehler);
  assert.ok(wertAusEingabe(breite, '0').fehler, 'null Millimeter ist kein Maß');
  assert.ok(wertAusEingabe(breite, '860,123').fehler, 'höchstens zwei Nachkommastellen');
  assert.equal(wertAusEingabe(material, 'Vollholz').status, 'bestaetigt', 'Auswahl ist bestätigt, nicht gemessen');
  assert.equal(wertText(breite, { wert: 860.5 }), '860,5 mm');
  assert.equal(wertText(breite, { wert: null }), '–');
});

// ---------- Türregel je Zielöffnung ----------
test('Tür: B-02 nutzt unverändert die geprüfte Anforderung aus Rev. 2', () => {
  const z = ZIELOEFFNUNGEN.find((x) => x.id === 'B-02');
  assert.equal(anforderungTuer(R, z), R.REQUIREMENT);
});

test('Tür: B-04 bekommt eigene Grenzen und Messstelle, der Messauftrag nennt B-04 und P-04', () => {
  const z = ZIELOEFFNUNGEN.find((x) => x.id === 'B-04');
  const req = anforderungTuer(R, z);
  assert.equal(req.target, 'B-04'); assert.equal(req.sheet, 'P-04');
  assert.equal(req.minMm, 880); assert.equal(req.maxMm, 890);
  const r = R.evaluateDoor({ requirement: req, measurement: R.emptyMeasurement(), deadlines: { measureDeadline: z.measureDeadline, replaceDeadline: z.replaceDeadline }, at: START });
  assert.equal(r.mainStep.rank, 5);
  assert.match(r.mainStep.text, /B-04.*P-04/);
  const gut = R.evaluateDoor({ requirement: req, measurement: { valueText: '885', unit: 'mm', reference: req.reference, status: 'gemessen', source: 'Notiz', measuredOn: '2026-11-18', receivedAt: '2026-11-18T13:00' }, deadlines: { measureDeadline: z.measureDeadline, replaceDeadline: z.replaceDeadline }, at: START });
  assert.equal(gut.usable, true);
  assert.equal(gut.mainStep.rank, 6);
});

test('Entscheidung E-01 (T-07 → B-02) entspricht der geprüften Regel und wartet nach Vorlage auf die Fachprüfung', () => {
  const p = leerePersistenz();
  const ctx = kontext(p);
  const e = entscheidung(ctx, 'LH', 'E-01');
  assert.equal(e.regel, 'tuer');
  const ohne = lage(ctx, e);
  const direkt = R.evaluateDoor({ requirement: R.REQUIREMENT, measurement: R.emptyMeasurement(), deadlines: R.DEADLINES, at: START });
  assert.equal(ohne.haupt.rank, direkt.mainStep.rank);
  assert.equal(ohne.haupt.text, direkt.mainStep.text);
  // Beispielaufmaß ab 15:00 eingegangen, Projektzeit 15:30: Rang 6, nach Vorlage „wartet“.
  p.ezustand[schluessel('LH', 'E-01')] = { aufmass: { ...R.SAMPLE_MEASUREMENT } };
  const spaeter = kontext(p, PROJEKTZEITEN[1].at);
  assert.equal(lage(spaeter, e).haupt.rank, 6);
  p.ereignisse.push({ entscheidung: schluessel('LH', 'E-01'), art: 'vorlage', at: PROJEKTZEITEN[1].at });
  const nachVorlage = kontext(p, PROJEKTZEITEN[1].at);
  const l = lage(nachVorlage, e);
  assert.equal(l.haupt.wartet, true);
  assert.equal(bauteilStatus(nachVorlage, bauteil(nachVorlage, 'LH', 'T-07')), 'fachpruefung');
  // Vor der Vorlage (14:00) zählt das Ereignis nicht.
  assert.notEqual(bauteilStatus(kontext(p, START), bauteil(kontext(p, START), 'LH', 'T-07')), 'fachpruefung');
});

// ---------- Doppelboden (Entwurfsregel) ----------
const BD01 = BEDARFE.find((b) => b.id === 'BD-01');
const boden = (extra) => bewerteBoden({ bedarf: BD01, flaecheM2: 104, rasterIst: '600 × 600 mm', beschaedigtRoh: '', hoeheAm: null, lastAm: null, at: START, ...extra });

test('Boden: fehlende beschädigte Fläche bleibt offen und ist nicht null', () => {
  const r = boden({});
  assert.equal(r.verwendbar, null);
  assert.equal(r.haupt.rank, 5);
  assert.ok(r.weiter.some((a) => a.text.startsWith('Beschädigte Fläche')) || r.haupt.text.startsWith('Beschädigte Fläche'));
});

test('Boden: Mengengrenze eingeschlossen und in Hundertstel gerechnet', () => {
  assert.equal(boden({ beschaedigtRoh: '24,8' }).kriterien.find((k) => k.key === 'menge').ton, 'ok', '79,2 m² verwendbar = 79,2 m² Bedarf');
  const knapp = boden({ beschaedigtRoh: '24,81' }).kriterien.find((k) => k.key === 'menge');
  assert.equal(knapp.ton, 'crit');
  assert.match(knapp.befund, /0,01 m² fehlen/);
  assert.equal(boden({ beschaedigtRoh: '24,811' }).verwendbar, null, 'drei Nachkommastellen sind ungültig');
  assert.equal(boden({ beschaedigtRoh: '105' }).verwendbar, null, 'mehr als die Fläche ist ungültig');
});

test('Boden: Nachweise rechtzeitig und alles passend führt zur Vorlage, Nachweise erst nach der Projektzeit zählen nicht', () => {
  const ok = boden({ beschaedigtRoh: '6', hoeheAm: '2026-11-18T10:00', lastAm: '2026-11-18T11:00' });
  assert.equal(ok.haupt.rank, 6);
  const zukunft = boden({ beschaedigtRoh: '6', hoeheAm: '2026-11-19T08:00', lastAm: '2026-11-18T11:00' });
  assert.equal(zukunft.hoehe, null);
  assert.equal(zukunft.haupt.rank, 5);
});

test('Boden: ein nur vorgeschlagenes Rastermaß zählt nicht, auch wenn sonst alles passt', () => {
  const r = boden({ rasterIst: '', rasterVorschlag: '600 × 600 mm', beschaedigtRoh: '6', hoeheAm: '2026-11-18T10:00', lastAm: '2026-11-18T11:00' });
  const raster = r.kriterien.find((k) => k.key === 'raster');
  assert.equal(raster.ton, 'warn'); assert.equal(raster.befund, 'offen: Vorschlag prüfen');
  assert.equal(r.haupt.rank, 5);
  assert.equal(r.haupt.text, 'Rastermaß vor Ort prüfen und bestätigen');
});

test('Boden: Entscheidung E-02 nimmt Werte nur mit Status gemessen oder bestätigt', () => {
  const p = leerePersistenz();
  const ctx = kontext(p);
  const e = entscheidung(ctx, 'LH', 'E-02');
  assert.equal(lage(ctx, e).r.kriterien.find((k) => k.key === 'raster').ton, 'ok', 'Beispiel: Rastermaß bestätigt');
  p.werte['LH:DB-01'] = { raster: { wert: '600 × 600 mm', status: 'vorgeschlagen', quelle: 'Erkennung (Simulation)' }, beschaedigt: { wert: 6, status: 'vorgeschlagen', quelle: 'Schätzung' } };
  const l = lage(kontext(p), e);
  assert.equal(l.r.kriterien.find((k) => k.key === 'raster').befund, 'offen: Vorschlag prüfen');
  assert.equal(l.r.verwendbar, null, 'vorgeschlagene beschädigte Fläche zählt nicht');
});

test('Boden: verspätete Nachweise führen zu Rang 4, verstrichene Ersatzfrist zu Rang 1', () => {
  const spaet = boden({ beschaedigtRoh: '6', hoeheAm: '2026-11-19T11:00', lastAm: '2026-11-19T09:00', at: '2026-11-19T12:00' });
  assert.equal(spaet.nachweis.key, 'late');
  assert.equal(spaet.haupt.rank, 4);
  const vorbei = boden({ beschaedigtRoh: '6', at: '2026-11-20T12:01' });
  assert.equal(vorbei.haupt.rank, 1);
  assert.equal(boden({ beschaedigtRoh: '6', at: '2026-11-20T12:00' }).ersatz.key, 'open', 'Frist ist bis einschließlich 12:00 offen');
});

// ---------- Abgleich ohne eigene Regel ----------
test('Einfacher Abgleich: fehlende Angaben vor fachlicher Prüfung, verstrichene Frist zuerst', () => {
  const bd = BEDARFE.find((b) => b.id === 'BD-21');
  const leer = { gruppe: 'tuer', werte: {} };
  assert.equal(bewerteEinfach({ bauteil: leer, bedarf: bd, frist: '2027-03-31T12:00', at: START }).haupt.rank, 5);
  const voll = { gruppe: 'tuer', werte: Object.fromEntries(GRUPPEN.tuer.felder.map((f) => [f.key, { wert: 'x', status: f.art === 'mass' ? 'gemessen' : 'bestaetigt' }])) };
  const r = bewerteEinfach({ bauteil: voll, bedarf: bd, frist: '2027-03-31T12:00', at: START });
  assert.equal(r.haupt.rank, 6);
  assert.match(r.haupt.text, /BD-21/);
  assert.equal(bewerteEinfach({ bauteil: voll, bedarf: bd, frist: '2026-11-18T13:59', at: START }).haupt.rank, 1);
  assert.equal(bewerteEinfach({ bauteil: voll, bedarf: bd, frist: START, at: START }).haupt.rank, 6, 'Frist genau jetzt ist noch offen');
});

// ---------- Bestand, nächste Handlung, Zuordnung ----------
test('Nächste Handlung: ohne Ziel zuordnen, ausgeschlossen keine Wiederverwendung, mit Entscheidung deren Schritt', () => {
  const ctx = kontext();
  const t03 = naechsteHandlung(ctx, bauteil(ctx, 'LH', 'T-03'));
  assert.equal(t03.text, 'Zielöffnung oder Bedarf zuordnen');
  assert.equal(t03.aktion, 'zuordnen');
  assert.equal(naechsteHandlung(ctx, bauteil(ctx, 'LH', 'T-11')).text, 'Keine Wiederverwendung');
  const t07 = naechsteHandlung(ctx, bauteil(ctx, 'LH', 'T-07'));
  assert.equal(t07.entscheidung.id, 'E-01');
  assert.equal(bauteilStatus(ctx, bauteil(ctx, 'LH', 'T-07')), 'entscheidung');
});

test('Zuordnung: belegte Ziele fallen weg, Türen sehen Öffnungen im Projekt und Türbedarfe der Region, Böden nur Bedarfe im Projekt', () => {
  const ctx = kontext();
  const tuer = moeglicheZiele(ctx, bauteil(ctx, 'LH', 'T-03'));
  assert.deepEqual(tuer.oeffnungen.map((z) => z.id), ['B-04', 'B-07'], 'B-02 ist durch E-01 belegt');
  assert.deepEqual(tuer.bedarfe.map((b) => `${b.projekt}:${b.id}`), ['SB:BD-21']);
  const kb = moeglicheZiele(ctx, bauteil(ctx, 'KB', 'DB-11'));
  assert.deepEqual(kb.bedarfe, [], 'Doppelböden nur im eigenen Projekt');
  const e = neueEntscheidung(ctx, bauteil(ctx, 'LH', 'T-03'), { art: 'zieloeffnung', id: 'B-04', projekt: 'LH' });
  assert.equal(e.id, 'E-03'); assert.equal(e.regel, 'tuer');
  assert.equal(neueEntscheidung(ctx, bauteil(ctx, 'LH', 'T-03'), { art: 'bedarf', id: 'BD-21', projekt: 'SB' }).regel, 'einfach');
});

// ---------- Mobile Erfassung ----------
test('Erkennung (Simulation): nur Seitenverhältnis, Hochformat schlägt Tür vor', () => {
  assert.equal(erkennungSimulation({ breite: 3000, hoehe: 4000 }).gruppe, 'tuer');
  assert.equal(erkennungSimulation({ breite: 4000, hoehe: 3000 }).gruppe, 'boden');
  assert.equal(erkennungSimulation({ breite: 1000, hoehe: 1150 }).gruppe, 'boden', 'Grenze 1,15 nicht überschritten');
  assert.equal(erkennungSimulation({ breite: 1000, hoehe: 1151 }).gruppe, 'tuer');
});

test('Erfassung: Prüfung des Entwurfs nennt jedes Problem am Feld', () => {
  const f = pruefeErfassung({ projekt: '', raum: '', gruppe: '', werte: {}, menge: '1' });
  assert.ok(f.ort); assert.ok(f.gruppe);
  const g = pruefeErfassung({ projekt: 'LH', raum: '1.14', gruppe: 'tuer', werte: { breite: { eingabe: 'abc', status: 'gemessen' } }, menge: '0', verfuegbarAb: '2026-02-30' });
  assert.ok(g['wert-breite']); assert.ok(g.menge); assert.ok(g.verfuegbarAb);
  assert.deepEqual(pruefeErfassung({ projekt: 'LH', raum: '1.14', gruppe: 'tuer', werte: { breite: { eingabe: '860', status: 'vorgeschlagen' } }, menge: '1', verfuegbarAb: '2026-11-25' }), {});
});

test('Erfassung: neues Bauteil behält den Status jedes Werts, bekommt die nächste Nummer und eigene offene Nachweise', () => {
  const ctx = kontext();
  assert.equal(naechsteBauteilId(ctx.daten.bauteile, 'LH', 'tuer'), 'T-13');
  assert.equal(naechsteBauteilId(ctx.daten.bauteile, 'LH', 'boden'), 'DB-02');
  assert.equal(naechsteBauteilId(ctx.daten.bauteile, 'KB', 'sonstig'), 'X-01');
  const entwurf = { projekt: 'LH', raum: '1.14', gruppe: 'tuer', menge: '1', zustand: 'B', verfuegbarAb: '2026-11-25', notiz: '', erkennung: { gruppe: 'tuer' }, foto: null,
    werte: { breite: { eingabe: '860', status: 'vorgeschlagen', quelle: 'Erkennung (Simulation)' }, hoehe: { eingabe: '1985', status: 'gemessen', quelle: 'Messung vor Ort' }, material: { eingabe: 'Holzwerkstoff', status: 'bestaetigt', quelle: 'Erkennung (Simulation), von Hand geprüft' } } };
  const b = bauteilAusErfassung(entwurf, { id: 'T-13', at: START, etage: '1.OG' });
  assert.equal(b.status, 'erfasst');
  assert.deepEqual(b.werte.breite, { wert: 860, status: 'vorgeschlagen', quelle: 'Erkennung (Simulation)' });
  assert.equal(b.werte.hoehe.status, 'gemessen');
  assert.equal(b.werte.anschlag.status, 'fehlt');
  assert.equal(b.erfassung.erkennung, 'Simulation');
  assert.equal(b.erfassung.von, 'browser', 'eigene Erfassung, keiner Beispielperson zugeschrieben');
  const ohneSim = bauteilAusErfassung({ ...entwurf, werte: { breite: { eingabe: '862', status: 'gemessen', quelle: 'Messung vor Ort' } } }, { id: 'T-14', at: START, etage: '1.OG' });
  assert.equal(ohneSim.erfassung.erkennung, null, 'kein Simulationshinweis, wenn kein Wert mehr aus der Simulation stammt');
  const p = leerePersistenz(); p.erfassungen.push(b);
  const ctx2 = kontext(p);
  const neu = bauteil(ctx2, 'LH', 'T-13');
  const offen = offeneNachweise(ctx2, neu).map((o) => o.text);
  assert.ok(offen.includes('Türblattbreite: Vorschlag prüfen oder messen'));
  assert.ok(offen.includes('Anschlag fehlt'));
  assert.ok(offen.includes('Foto fehlt'));
  assert.equal(naechsteHandlung(ctx2, neu).aktion, 'zuordnen');
});

// ---------- Projektradar ----------
test('Radar: Hinweis erst prüfen, dann mit Notiz bestätigen, ohne Bezirk nicht auf die Karte', () => {
  const h = HINWEISE.find((x) => x.id === 'H-01');
  assert.equal(h.status, 'neu');
  assert.ok(radarSchritt(h, 'bestaetigen', { von: 'radar', notiz: 'x', at: START }).fehler.allgemein, 'ungeprüft nicht direkt bestätigen');
  const inPruefung = radarSchritt(h, 'pruefen', { von: 'radar', at: START }).hinweis;
  assert.equal(inPruefung.status, 'pruefung');
  const ohne = radarSchritt(inPruefung, 'bestaetigen', { von: 'radar', notiz: '', at: START }).fehler;
  assert.ok(ohne.notiz); assert.ok(ohne.bezirk);
  const ok = radarSchritt(inPruefung, 'bestaetigen', { von: 'radar', notiz: 'Ort und Zeitraum bestätigt', bezirk: 'Innenstadt-Nord', at: START }).hinweis;
  assert.equal(ok.status, 'bestaetigt'); assert.equal(ok.bezirk, 'Innenstadt-Nord');
  assert.equal(ok.verlauf.length, 2);
  assert.ok(radarSchritt(ok, 'verwerfen', { von: 'radar', notiz: 'x', at: START }).fehler.allgemein, 'bestätigt bleibt bestätigt');
  assert.ok(radarSchritt(h, 'verwerfen', { von: 'radar', notiz: '  ', at: START }).fehler.notiz, 'Verwerfen braucht einen Grund');
});

test('Radar: Meldung braucht Titel, Art, Bezirk, meldende Stelle und Bestätigung', () => {
  assert.deepEqual(Object.keys(pruefeMeldung({ titel: '', art: '', bezirk: '', melder: '', einwilligung: false })).sort(), ['art', 'bezirk', 'einwilligung', 'melder', 'titel']);
  assert.deepEqual(pruefeMeldung({ titel: 'Umbau', art: 'umbau', bezirk: 'Eving', melder: 'Planungsbüro', einwilligung: true }), {});
});

test('Radardaten: jede Quelle bewertet, echte Hinweise belegt und ungeprüft, Beispiele erkennbar, keine Kontaktdaten', () => {
  const ids = new Set(QUELLEN.map((q) => q.id));
  for (const q of QUELLEN) {
    for (const k of ['name', 'betreiber', 'aktualitaet', 'abdeckung', 'zugriff', 'lizenz', 'felder', 'relevanzText', 'einsatz']) assert.ok(String(q[k] || '').trim(), `${q.id}: ${k} fehlt`);
    assert.ok(['hoch', 'mittel', 'gering'].includes(q.relevanz), q.id);
  }
  for (const h of HINWEISE) {
    assert.ok(ids.has(h.quelle), `${h.id}: Quelle ${h.quelle} unbekannt`);
    assert.ok(istDatum(h.datum) && istDatum(h.abgerufen), `${h.id}: Datum`);
    if (h.beispiel) assert.match(h.titel, /^Beispiel: /);
    else {
      assert.equal(h.status, 'neu', `${h.id}: echte Hinweise sind ungeprüft`);
      assert.deepEqual(h.verlauf, []);
      assert.match(h.quelleUrl, /^https:\/\//);
      assert.equal(h.abgerufen, '2026-11-15');
    }
  }
  const text = JSON.stringify({ QUELLEN, HINWEISE });
  assert.doesNotMatch(text, /@/, 'keine E-Mail-Adressen');
  assert.doesNotMatch(text, /\+49|\b0\d{3,4}[ /-]\d{3,}/, 'keine Telefonnummern');
});

test('Radar: bestätigter Beispielhinweis führt zum Beispielprojekt, Sortierung zeigt offene echte Hinweise zuerst', () => {
  const ctx = kontext();
  assert.equal(ctx.daten.projekte.find((p) => p.hinweis === 'B-03')?.kurz, 'KB');
  const s = sortiereHinweise(ctx.daten.hinweise);
  assert.equal(s[0].beispiel, false); assert.equal(s[0].status, 'neu');
  assert.equal(s.at(-1).status, 'verworfen');
});

// ---------- Speichern im Browser ----------
test('Speichern: kaputter oder fremder Stand wird verworfen, bei vollem Speicher ohne Fotos gespeichert', () => {
  const speicher = (vorher) => { const m = new Map(vorher ? [[SPEICHERSCHLUESSEL, vorher]] : []); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v), removeItem: (k) => m.delete(k), m }; };
  assert.deepEqual(ladePersistenz(speicher('{kaputt')), leerePersistenz());
  assert.deepEqual(ladePersistenz(speicher(JSON.stringify({ version: 2 }))), leerePersistenz());
  assert.deepEqual(ladePersistenz(null), leerePersistenz());
  const voll = { setItem: (k, v) => { if (v.includes('data:image')) throw new Error('QuotaExceededError'); voll.wert = v; } };
  const p = leerePersistenz(); p.erfassungen.push({ projekt: 'LH', id: 'T-13', foto: { daten: 'data:image/jpeg;base64,AAAA', breite: 3, hoehe: 4 } });
  const r = speichere(voll, p);
  assert.equal(r.ok, true); assert.equal(r.fotosNichtGespeichert, 1);
  assert.equal(JSON.parse(voll.wert).erfassungen[0].foto.nichtGespeichert, true);
});

test('Speichern: bei vollem Speicher fällt nur das neueste Foto weg, ältere bleiben', () => {
  // Platz für genau ein Foto: das ältere bleibt gespeichert, das neue nicht.
  const knapp = { setItem: (k, v) => { if ((v.match(/data:image/g) || []).length > 1) throw new Error('QuotaExceededError'); knapp.wert = v; } };
  const p = leerePersistenz();
  p.erfassungen.push({ projekt: 'LH', id: 'T-13', foto: { daten: 'data:image/jpeg;base64,ALT' } }, { projekt: 'LH', id: 'T-14', foto: { daten: 'data:image/jpeg;base64,NEU' } });
  const r = speichere(knapp, p);
  assert.equal(r.fotosNichtGespeichert, 1);
  const gespeichert = JSON.parse(knapp.wert).erfassungen;
  assert.equal(gespeichert[0].foto.daten, 'data:image/jpeg;base64,ALT');
  assert.equal(gespeichert[1].foto.daten, null);
  const d = baueDaten({ ...leerePersistenz(), erfassungen: [{ projekt: 'LH', id: 'T-14', gruppe: 'tuer', werte: {}, foto: { daten: null, nichtGespeichert: true }, nachweise: [{ titel: 'Foto der mobilen Erfassung', art: 'Foto', stand: 'liegt vor', ton: 'ok' }] }] });
  assert.match(d.bauteile.find((b) => b.id === 'T-14').nachweise[0].stand, /nicht gespeichert/);
});

test('Speichern: Felder mit falscher Form werden einzeln verworfen', () => {
  const speicher = { getItem: () => JSON.stringify({ version: 1, erfassungen: null, radar: [], werte: { 'LH:T-03': {} }, meldungen: [{ id: 'M-01', status: 'gemeldet' }] }) };
  const p = ladePersistenz(speicher);
  assert.deepEqual(p.erfassungen, []);
  assert.deepEqual(p.radar, {});
  assert.deepEqual(p.meldungen, [{ id: 'M-01', status: 'gemeldet' }]);
  assert.ok(p.werte['LH:T-03']);
  assert.doesNotThrow(() => baueDaten(p));
  const kaputt = ladePersistenz({ getItem: () => JSON.stringify({ version: 1, erfassungen: [null, { projekt: 'LH' }, { projekt: 'LH', id: 'T-13', gruppe: 'tuer', werte: {} }] }) });
  assert.deepEqual(kaputt.erfassungen.map((e) => e.id), ['T-13'], 'Einträge ohne Pflichtfelder fallen weg');
  assert.doesNotThrow(() => baueDaten(kaputt));
});

test('Datenstand: eigene Werte, Radarstatus und Meldungen überlagern die Beispieldaten', () => {
  const p = leerePersistenz();
  p.werte['LH:T-03'] = { breite: { wert: 861, status: 'gemessen', quelle: 'Messung' } };
  p.radar['H-02'] = { status: 'pruefung', verlauf: [{ at: START, von: 'radar', aktion: 'pruefen', notiz: '' }] };
  p.meldungen.push({ id: 'M-01', titel: 'Umbau Test', quelle: 'meldung', status: 'gemeldet', datum: '2026-11-18', abgerufen: '2026-11-18', verlauf: [] });
  const d = baueDaten(p);
  assert.equal(d.bauteile.find((b) => b.projekt === 'LH' && b.id === 'T-03').werte.breite.wert, 861);
  assert.equal(d.hinweise.find((h) => h.id === 'H-02').status, 'pruefung');
  assert.ok(d.hinweise.some((h) => h.id === 'M-01'));
  assert.equal(HINWEISE.find((h) => h.id === 'H-02').status, 'neu', 'Beispieldaten bleiben unverändert');
});

// ---------- IFC-Vorprüfung ----------
test('IFC-Vorprüfung: zählt Einträge genau, ohne Typen mitzuzählen, und lehnt Nicht-IFC ab', () => {
  assert.equal(ifcVorpruefung('Hallo').gueltig, false);
  const ifc = `ISO-10303-21;\nHEADER;\nFILE_SCHEMA(('IFC4'));\nENDSEC;\nDATA;\n#1=IFCBUILDINGSTOREY('a',$,'EG');\n#2=IFCBUILDINGSTOREY('b',$,'1.OG');\n#3=IFCSPACE('c');\n#4= IFCSPACE ('d');\n#5=IFCDOOR('e');\n#6=IFCDOORTYPE('f');\n#7=IFCWALL('g');\n#8=IFCWALLSTANDARDCASE('h');\n#9=IFCWINDOW('i');\nENDSEC;\nEND-ISO-10303-21;`;
  const r = ifcVorpruefung(ifc);
  assert.equal(r.gueltig, true); assert.equal(r.schema, 'IFC4');
  assert.deepEqual(r.zaehlung, { Geschosse: 2, Räume: 2, Türen: 1, Fenster: 1, Wände: 2 });
  const ifc2x3 = ifc.replace("#5=IFCDOOR('e');", "#5=IFCDOORSTANDARDCASE('e');#10=IFCDOOR('x');");
  assert.equal(ifcVorpruefung(ifc2x3).zaehlung.Türen, 2, 'Standardfall zählt als Tür');
});

test('Zeit: echte Berliner Uhrzeit für den Radar, mit Sommerzeit und Jahreswechsel', () => {
  assert.equal(jetztBerlin(new Date('2026-03-29T01:30:00Z')), '2026-03-29T03:30');
  assert.equal(jetztBerlin(new Date('2026-12-31T23:30:00Z')), '2027-01-01T00:30');
  assert.match(jetztBerlin(), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
});
