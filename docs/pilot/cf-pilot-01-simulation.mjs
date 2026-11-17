// CF-PILOT-01 · Nachrechnung der drei Varianten mit dem unveränderten Fachkern von Fassung 2 (Code 2121b92, Stand daa40a9).
// Auf dem Entwicklungsbranch codex/plattform-entwicklung-20261118 kommt die Frist „Prüfbitte spätestens“ (pruefbitteFrist) hinzu;
// Abgleichregel, Vorgangsstatus und Beispieldaten sind dort unverändert. Auf dem Pitch-Stand (codex/plattform-v1) gibt es diese Frist nicht.
// Fiktiver Pilotfall „Zwölf Bürotüren vor dem Umbau“. Alle Namen, Daten, Mengen und Rollen sind Simulationsannahmen.
// Neben den Beispieldaten enthält die Nachrechnung nur das Angebot LH · T-13 (6 Stk) und den Bedarf UAK · BD-24.
// Die interne Tür und die zwei Türen mit Zustand C sind nur im Browserlauf erfasst. Fristen zählen in Kalendertagen.
// Das Skript liest nur Module aus plattform/app und prototype/dist, ändert keinen Anwendungscode und speichert nichts.
// Es setzt die Projektzeit (ctx.at) auf Tage im Jahr 2027. Die Oberfläche lässt dagegen nur 18.–20.11.2026 zu.
// Aufruf vom Repository-Root: node docs/pilot/cf-pilot-01-simulation.mjs
// Weicht ein erwartetes Ergebnis ab, bricht das Skript mit einer Fehlermeldung ab.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as R from '../../prototype/dist/door-rules.mjs';
import { baueDaten, leerePersistenz } from '../../plattform/app/zustand.js';
import { projektAusEntwurf, pruefeProjekt } from '../../plattform/app/projektanlage.js';
import { bedarfAusEntwurf, naechsteBedarfId, pruefeBedarf } from '../../plattform/app/bedarf.js';
import { bauteilAusErfassung, naechsteBauteilId, pruefeErfassung } from '../../plattform/app/regeln.js';
import { abgleich, abgleichListe, pruefbitteAnlegen, pruefbitteFrist, zuordnungZumBedarf, FRIST_PRUEFBITTE } from '../../plattform/app/abgleich.js';
import { vorgangSchritt, vorgangStatus, naechsterVorgangsschritt, bedarfBelegt } from '../../plattform/app/vorgang.js';
import { kennzahlen } from '../../plattform/app/kennzahlen.js';

// ---------- Annahmen (Simulation) ----------
const A = {
  bedarfAngelegt: '2027-01-11T09:00', // Planung „Umbau am Kanal“ legt den Bedarf an
  begehung: '2027-01-19T15:00', // Begehung, Fotos, Aufmaß; Angebot in CircularFlow erfasst (= Angebot bekannt)
  planungV1: '2027-01-20T09:00', // V1 und V3: Planung öffnet den Abgleich
  planungV2: '2027-02-22T09:00', // V2: Planung erreicht das Angebot erst nach der Ersatzbestellung
  fachergebnis: '2027-02-03T16:00', // Ende der Mindestprüfzeit (14 Tage)
  vormerkung: '2027-02-04T10:00',
  uebergabePlanung: '2027-02-04T10:30',
  uebergabe: '2027-03-08T16:00', // erster Tag des Annahmefensters
  bestellfrist: '2027-02-19', // Ersatzbestellung muss entschieden sein
  verfuegbarAb: '2027-03-05', // Ende des Ausbaus 01.–05.03.2027
  annahmeVon: '2027-03-08', annahmeBis: '2027-03-12',
  pruefzeitTage: '14', // Simulationsannahme, bis das Team einen konkreten Praxisfall besprochen hat
};

const geo = JSON.parse(readFileSync(new URL('../../plattform/daten/dortmund-stadtbezirke.geojson', import.meta.url), 'utf8'));
const ctxBei = (p, at) => ({ R, at, daten: baueDaten(p), ereignisse: p.ereignisse, ezustand: p.ezustand });
const finde = (liste, projekt, id) => liste.find((x) => x.projekt === projekt && x.id === id);
const tag = (s) => (s ? `${s.slice(8, 10)}.${s.slice(5, 7)}.${s.slice(0, 4)}` : '–');
const zeile = (...t) => console.log(t.join(''));

// ---------- Ausgangsdaten: Projekt, Bedarf, Angebot ----------
function ausgangsstand() {
  const p = leerePersistenz();
  // Projekt „Umbau am Kanal“ wie im Formular „Projekt erfassen“ (erstes eigenes Projekt im Bezirk: Lage = Bezirksmitte).
  const entwurfProjekt = { name: 'Umbau am Kanal', art: 'umbau', bezirk: 'Innenstadt-Nord', entscheidungBis: A.bestellfrist, rueckbauAb: '', etagen: '2', raeume: '4', gebaeudeName: '' };
  assert.deepEqual(pruefeProjekt(entwurfProjekt, baueDaten(p).projekte), {}, 'Projektformular meldet Fehler');
  const mitte = geo.features.find((f) => f.properties.name === 'Innenstadt-Nord').properties.mitte;
  const projekt = projektAusEntwurf(entwurfProjekt, { projekte: baueDaten(p).projekte, mitte, at: A.bedarfAngelegt });
  p.projekteEigen.push(projekt);

  // Bedarf: 6 Bürotüren mit Bestellfrist, Mindestprüfzeit und Annahmefenster.
  const entwurfBedarf = {
    projekt: projekt.kurz, gruppe: 'tuer', titel: 'Bürotüren 1. OG', menge: '6', bestellfrist: A.bestellfrist, pruefzeitTage: A.pruefzeitTage,
    annahmeVon: A.annahmeVon, annahmeBis: A.annahmeBis, zustaendig: 'planung',
    anforderungen: 'Türblatt ca. 860 × 1985 mm, Zarge passend zur Wand, keine Brand- oder Schallschutzanforderung (Annahme)',
  };
  assert.deepEqual(pruefeBedarf(entwurfBedarf, { daten: baueDaten(p) }), {}, 'Bedarfsformular meldet Fehler');
  const bedarf = bedarfAusEntwurf(entwurfBedarf, { id: naechsteBedarfId(baueDaten(p).bedarfe), at: A.bedarfAngelegt });
  p.bedarfe.push(bedarf);

  // Angebot: 6 gleichartige Türen aus Haus Lindenhof (LH), Raum 1.04, als eine Position mit Menge 6.
  // Werte und Status wie in der mobilen Erfassung: getipptes Maß = gemessen, gewählter Wert = bestätigt (Eingabe vor Ort),
  // übernommener Vorschlag = bestätigt (von Hand geprüft), nicht übernommener Vorschlag = vorgeschlagen.
  const entwurfAngebot = {
    projekt: 'LH', raum: '1.04', gruppe: 'tuer', menge: '6', zustand: 'B', notiz: '', verfuegbarAb: A.verfuegbarAb,
    foto: { daten: 'Platzhalter (Simulation, kein Bild)', breite: 900, hoehe: 1600 }, // wie im Klickpfad: Foto im Hochformat
    werte: {
      breite: { eingabe: '860', status: 'gemessen', quelle: 'Messung vor Ort (mobile Erfassung)' },
      hoehe: { eingabe: '1985', status: 'bestaetigt', quelle: 'Erkennung (Simulation), von Hand geprüft' },
      anschlag: { eingabe: 'DIN links', status: 'bestaetigt', quelle: 'Eingabe vor Ort' },
      material: { eingabe: 'Holzwerkstoff', status: 'vorgeschlagen', quelle: 'Erkennung (Simulation)' },
      zarge: { eingabe: 'Stahlumfassungszarge', status: 'bestaetigt', quelle: 'Erkennung (Simulation), von Hand geprüft' },
      schutz: { eingabe: 'keine Kennzeichnung gefunden', status: 'bestaetigt', quelle: 'Eingabe vor Ort' },
    },
  };
  assert.deepEqual(pruefeErfassung(entwurfAngebot), {}, 'Erfassung meldet Fehler');
  const lh = baueDaten(p).projekte.find((x) => x.kurz === 'LH');
  const etage = lh.gebaeude[0].etagen.find((e) => e.raeume.some((r) => r.id === entwurfAngebot.raum)).id;
  const angebot = bauteilAusErfassung(entwurfAngebot, { id: naechsteBauteilId(baueDaten(p).bauteile, 'LH', 'tuer'), at: A.begehung, etage });
  p.erfassungen.push(angebot);
  return { p, projekt, bedarf, angebot };
}

// Prüfbitte über den Abgleich anlegen (wie der Knopf „Prüfbitte anlegen“).
function pruefbitte(p, at, angebot, bedarf) {
  const ctx = ctxBei(p, at);
  const a = abgleich(ctx, finde(ctx.daten.bauteile, angebot.projekt, angebot.id), finde(ctx.daten.bedarfe, bedarf.projekt, bedarf.id));
  const r = pruefbitteAnlegen(ctx, a);
  assert.ok(!r.fehler, `Prüfbitte gesperrt: ${r.fehler?.allgemein}`);
  p.zuordnungen.push(r.zuordnung); p.ereignisse.push(r.ereignis);
  return { a, vorgang: r.zuordnung, ereignis: r.ereignis };
}
// Vorgangsschritt wie im Formular der Entscheidungsseite.
function schritt(p, at, vorgang, aktion, eingabe) {
  const r = vorgangSchritt(ctxBei(p, at), vorgang, aktion, eingabe);
  assert.ok(!r.fehler, `${aktion} am ${at} abgelehnt: ${JSON.stringify(r.fehler)}`);
  p.ereignisse.push(r.ereignis);
  return r.ereignis;
}
const abgleichBei = (p, at, angebot, bedarf) => { const ctx = ctxBei(p, at); return abgleich(ctx, finde(ctx.daten.bauteile, angebot.projekt, angebot.id), finde(ctx.daten.bedarfe, bedarf.projekt, bedarf.id)); };
const plusTage = (d, n) => { const t = new Date(`${d}T12:00:00Z`); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };

// ---------- Ausgangsstand ----------
const basis = ausgangsstand();
zeile('CF-PILOT-01 · Nachrechnung mit dem Fachkern von Fassung 2 (Simulation, fiktive Daten)');
zeile('Projekt: ', basis.projekt.kurz, ' · ', basis.projekt.name, ' · Bedarf ', basis.bedarf.id, ' (6 Stk, Bestellfrist ', tag(A.bestellfrist), ', Mindestprüfzeit 14 Tage, Annahme ', tag(A.annahmeVon), '–', tag(A.annahmeBis), ')');
zeile('Angebot: ', basis.angebot.projekt, ' · ', basis.angebot.id, ' · ', basis.angebot.menge, ' Stk, Raum ', basis.angebot.raum, ', verfügbar ab ', tag(basis.angebot.verfuegbarAb), ', erfasst ', tag(A.begehung.slice(0, 10)));
assert.equal(basis.projekt.kurz, 'UAK'); assert.equal(basis.bedarf.id, 'BD-24'); assert.equal(basis.angebot.id, 'T-13');

zeile('\nWertstatus im Bauteilpass (aus der Erfassung):');
for (const [k, w] of Object.entries(basis.angebot.werte)) zeile('  ', k.padEnd(9), String(w.wert).padEnd(30), w.status.padEnd(13), w.quelle);
assert.equal(basis.angebot.werte.breite.status, 'gemessen');
assert.equal(basis.angebot.werte.hoehe.status, 'bestaetigt');
assert.equal(basis.angebot.werte.material.status, 'vorgeschlagen');

// ---------- Zeitfenster für die Prüfbitte (gleiche Basisdaten, Planung reagiert an verschiedenen Tagen) ----------
zeile('\nErgebnis des Abgleichs, wenn die Planung an diesem Tag reagiert (16:00, nach der Begehung):');
let letzterPruefbarerTag = null; let vorher = null;
for (let d = '2027-01-19'; d <= '2027-02-22'; d = plusTage(d, 1)) {
  const a = abgleichBei(basis.p, `${d}T16:00`, basis.angebot, basis.bedarf);
  if (a.pruefbitteMoeglich) letzterPruefbarerTag = d;
  if (a.gesamt.key !== vorher) zeile('  ab ', tag(d), ': ', a.gesamt.label, ' · Prüfende ', tag(a.zeit.pruefende), ' · ', a.zeit.gruende[0] || '');
  vorher = a.gesamt.key;
}
zeile('  Letzter Tag mit möglicher Prüfbitte: ', tag(letzterPruefbarerTag));
assert.equal(letzterPruefbarerTag, '2027-02-05');

// Prüfbitte spätestens (Fachkern pruefbitteFrist): derselbe Tag wie der letzte Tag mit möglicher Prüfbitte (Gleichlauf mit dem Abgleich).
const fristPruefbitte = pruefbitteFrist(basis.bedarf);
zeile('  ', FRIST_PRUEFBITTE, ' ', basis.bedarf.id, ': ', tag(fristPruefbitte.tag), ' (', fristPruefbitte.text, ')');
assert.equal(fristPruefbitte.status, 'ok');
assert.equal(fristPruefbitte.tag, letzterPruefbarerTag);

// Zeitkritisch auf der Übersicht: ab wann erscheinen „Prüfbitte spätestens“ und die Bestellfrist des noch offenen Bedarfs?
// Je Bedarf kann es beide Einträge geben; sie unterscheiden sich im Namen (name), nicht in der Art.
const ersterTagZeitkritisch = (name) => {
  for (let d = '2027-01-19'; d <= '2027-02-19'; d = plusTage(d, 1)) {
    const k = kennzahlen(ctxBei(basis.p, `${d}T09:00`));
    if (k.zeitkritisch.eintraege.some((f) => f.art === 'bedarf' && f.id === basis.bedarf.id && f.name === name)) return d;
  }
  return null;
};
const ersterTagPruefbitte = ersterTagZeitkritisch(FRIST_PRUEFBITTE); const ersterTagBestellfrist = ersterTagZeitkritisch('Bestellfrist');
zeile('  ', FRIST_PRUEFBITTE, ' ', basis.bedarf.id, ' erscheint unter „Zeitkritisch (7 Tage)“ erstmals am ', tag(ersterTagPruefbitte), ' (09:00), solange kein Vorgang läuft.');
zeile('  Bestellfrist ', basis.bedarf.id, ' erscheint unter „Zeitkritisch (7 Tage)“ erstmals am ', tag(ersterTagBestellfrist), ' (09:00), solange kein Vorgang läuft.');
assert.equal(ersterTagPruefbitte, '2027-01-30');
assert.equal(ersterTagBestellfrist, '2027-02-13');

// ---------- Variante 1: rechtzeitig ----------
function variante1() {
  const { p, angebot, bedarf } = ausgangsstand();
  const { a, vorgang } = pruefbitte(p, A.planungV1, angebot, bedarf);
  assert.equal(a.gesamt.key, 'weiter');
  assert.equal(a.zeit.pruefende, '2027-02-03');
  assert.equal(a.zeit.reserveBestellung, 16);
  assert.equal(a.zeit.uebergabe.fruehestens, '2027-03-05');
  assert.ok(a.pruefpunkte.some((x) => x.art === 'zwischenlager' && x.text.includes('3 Tage')));
  schritt(p, A.fachergebnis, vorgang, 'fachergebnis', { urteil: 'geeignet', person: 'Fachplanung (Beispiel)', notiz: '' });
  schritt(p, A.vormerkung, vorgang, 'vormerkung', { menge: '6', ablauf: A.annahmeBis });
  schritt(p, A.uebergabePlanung, vorgang, 'uebergabe-geplant', { termin: A.annahmeVon, ort: 'Anlieferung Umbau am Kanal, 1. OG', rolle: 'bauleitung' });
  const ev = schritt(p, A.uebergabe, vorgang, 'uebergeben', { datum: A.annahmeVon });
  const ctx = ctxBei(p, A.uebergabe);
  const st = vorgangStatus(ctx, vorgang);
  assert.equal(st.key, 'uebergeben');
  return { vorgang, a, st, ev, naechster: naechsterVorgangsschritt(ctx, vorgang) };
}

// ---------- Variante 2: Angebot erreicht die Planung nach der Ersatzbestellung ----------
function variante2() {
  const { p, angebot, bedarf } = ausgangsstand();
  const a = abgleichBei(p, A.planungV2, angebot, bedarf);
  assert.equal(a.gesamt.key, 'spaet');
  assert.equal(a.pruefbitteMoeglich, false);
  assert.equal(a.sperrart, 'zeit');
  const ctx = ctxBei(p, A.planungV2);
  const z = zuordnungZumBedarf(ctx, finde(ctx.daten.bauteile, angebot.projekt, angebot.id), finde(ctx.daten.bedarfe, bedarf.projekt, bedarf.id));
  assert.equal(z.moeglich, false);
  const k = kennzahlen(ctx);
  const frist = k.zeitkritisch.eintraege.find((f) => f.art === 'bedarf' && f.id === bedarf.id && f.name === 'Bestellfrist');
  assert.ok(frist?.ueberfaellig, 'Bestellfrist sollte als überfällig unter Zeitkritisch stehen');
  const andere = abgleichListe(ctx, { bauteil: finde(ctx.daten.bauteile, angebot.projekt, angebot.id) }).map((x) => `${x.bedarf.projekt} ${x.bedarf.id}: ${x.gesamt.label}`);
  return { a, z, frist, andere };
}

// ---------- Variante 3: Probeausbau, eine Tür fällt aus, 5 von 6 ----------
function variante3() {
  const { p, angebot, bedarf } = ausgangsstand();
  const ctx0 = ctxBei(p, A.planungV1);
  const listeVorher = abgleichListe(ctx0, { bedarf: finde(ctx0.daten.bedarfe, bedarf.projekt, bedarf.id) });
  const paareVorher = `${listeVorher.length} (${listeVorher.map((x) => `${x.bauteil.projekt} ${x.bauteil.id}`).join(', ')})`;
  const { vorgang } = pruefbitte(p, A.planungV1, angebot, bedarf);
  schritt(p, A.fachergebnis, vorgang, 'fachergebnis', { urteil: 'bedingt', person: 'Fachplanung (Beispiel)', notiz: 'Probeausbau am 02.02.2027: eine Tür beim Ausbau beschädigt, 5 von 6 verwendbar. Eine Tür neu bestellen.' });
  schritt(p, A.vormerkung, vorgang, 'vormerkung', { menge: '5', ablauf: A.annahmeBis });
  // Ein zweites Türangebot aus den Beispieldaten (KB · T-31) wäre am Tag der Vormerkung zeitlich noch prüfbar,
  // ist für BD-24 aber gesperrt, weil der Bedarf zum laufenden Vorgang gehört.
  const ctxV = ctxBei(p, '2027-02-04T11:00');
  const zweites = abgleich(ctxV, finde(ctxV.daten.bauteile, 'KB', 'T-31'), finde(ctxV.daten.bedarfe, bedarf.projekt, bedarf.id));
  assert.equal(zweites.gesamt.key, 'weiter');
  assert.equal(zweites.pruefbitteMoeglich, false);
  assert.match(zweites.sperrgrund, /Der Bedarf gehört bereits zum laufenden Vorgang/);
  // Was zeigt der Fachkern nach der Teil-Vormerkung, vier Tage vor der Bestellfrist?
  const ctx = ctxBei(p, '2027-02-15T09:00');
  const st = vorgangStatus(ctx, vorgang);
  const a = abgleich(ctx, finde(ctx.daten.bauteile, angebot.projekt, angebot.id), finde(ctx.daten.bedarfe, bedarf.projekt, bedarf.id), { ausser: vorgang });
  const k = kennzahlen(ctx);
  const befund = {
    status: st.label, vormerkung: `${st.vormerkung.menge} ${st.vormerkung.einheit}`, naechster: naechsterVorgangsschritt(ctx, vorgang).text,
    mengeImAbgleich: `${a.menge.status} (Angebot ${a.menge.angebot}, Bedarf ${a.menge.bedarf})`,
    bedarfBelegt: bedarfBelegt(ctx, bedarf.projekt, bedarf.id),
    bestellfristZeitkritisch: k.zeitkritisch.eintraege.some((f) => f.art === 'bedarf' && f.id === bedarf.id && f.name === 'Bestellfrist'),
    bedarfOffenGezaehlt: k.bedarfeOffen.eintraege.some((d) => d.projekt === bedarf.projekt && d.id === bedarf.id),
    paareVorher, paareNachher: abgleichListe(ctx, { bedarf: finde(ctx.daten.bedarfe, bedarf.projekt, bedarf.id) }).length,
    zweitesAngebot: `KB T-31 → ${bedarf.id} am 04.02.2027: ${zweites.gesamt.label}, Prüfbitte gesperrt: ${zweites.sperrgrund}`,
  };
  assert.equal(st.key, 'vorgemerkt');
  assert.equal(a.menge.status, 'gedeckt');
  assert.equal(befund.bedarfBelegt, true);
  assert.equal(befund.bestellfristZeitkritisch, false);
  assert.equal(befund.paareNachher, 0);
  schritt(p, A.uebergabePlanung, vorgang, 'uebergabe-geplant', { termin: A.annahmeVon, ort: 'Anlieferung Umbau am Kanal, 1. OG', rolle: 'bauleitung' });
  const ev = schritt(p, A.uebergabe, vorgang, 'uebergeben', { datum: A.annahmeVon });
  const stEnde = vorgangStatus(ctxBei(p, A.uebergabe), vorgang);
  assert.equal(stEnde.key, 'uebergeben');
  return { befund, ev, verlauf: stEnde.verlauf.map((x) => `${tag(x.at.slice(0, 10))} ${x.text}`) };
}

// ---------- Ausgabe ----------
const v1 = variante1(); const v2 = variante2(); const v3 = variante3();

zeile('\nVariante 1 · rechtzeitig');
zeile('  Angebot bekannt: ', tag(A.begehung.slice(0, 10)), ' · erreicht Planung: ', tag(A.planungV1.slice(0, 10)), ' · Entscheidung bis: ', tag(A.bestellfrist), ' · Übergabe möglich: ', tag(A.annahmeVon));
zeile('  Abgleich: ', v1.a.gesamt.label, ' · ', v1.a.zeit.gruende.join(' '));
zeile('  Prüfpunkte: ', v1.a.pruefpunkte.map((x) => x.text).join(' | '));
zeile('  Ende: ', v1.st.label, ' · ', v1.ev.text, ' · nächster Schritt: ', v1.naechster.text);

zeile('\nVariante 2 · Angebot erreicht die Planung nach der Ersatzbestellung');
zeile('  Angebot bekannt: ', tag(A.begehung.slice(0, 10)), ' · erreicht Planung: ', tag(A.planungV2.slice(0, 10)), ' · Entscheidung bis: ', tag(A.bestellfrist), ' · Übergabe für diesen Bedarf: keine');
zeile('  Abgleich: ', v2.a.gesamt.label, ' · ', v2.a.zeit.gruende[0]);
zeile('  Nächster Schritt: ', v2.a.naechsterSchritt.text, ' · Prüfbitte gesperrt: ', v2.a.sperrgrund);
zeile('  Bauteilpass, Zuordnung zum Bedarf: ', v2.z.grund);
zeile('  Übersicht, Zeitkritisch: Bestellfrist ', v2.frist.id, ' überfällig');
zeile('  Weitere Paare für das Angebot: ', v2.andere.join(' | ') || 'keine');

zeile('\nVariante 3 · Probeausbau, 5 von 6');
zeile('  Angebot bekannt: ', tag(A.begehung.slice(0, 10)), ' · erreicht Planung: ', tag(A.planungV1.slice(0, 10)), ' · Entscheidung bis: ', tag(A.bestellfrist), ' (Wiederverwendung 5 Stk, Neubestellung 1 Stk) · Übergabe möglich: ', tag(A.annahmeVon), ' (5 Stk)');
zeile('  Stand am 15.02.2027: ', v3.befund.status, ', Vormerkung ', v3.befund.vormerkung, ', nächster Schritt: ', v3.befund.naechster);
zeile('  Menge im Abgleich: ', v3.befund.mengeImAbgleich);
zeile('  Bedarf belegt: ', v3.befund.bedarfBelegt ? 'ja' : 'nein', ' · als offener Bedarf gezählt: ', v3.befund.bedarfOffenGezaehlt ? 'ja' : 'nein', ' · Bestellfrist unter Zeitkritisch: ', v3.befund.bestellfristZeitkritisch ? 'ja' : 'nein');
zeile('  Paare für ', basis.bedarf.id, ' vor der Prüfbitte: ', v3.befund.paareVorher, ', nach der Vormerkung: ', v3.befund.paareNachher);
zeile('  Zweites Angebot: ', v3.befund.zweitesAngebot);
zeile('  Verlauf:'); for (const z of v3.verlauf) zeile('    ', z);
zeile('\nAlle erwarteten Ergebnisse eingetreten.');
