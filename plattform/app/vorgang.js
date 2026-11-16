// Vorgang = bestehende Entscheidung (E-xx). Reine Fachfunktionen ohne DOM und ohne Systemuhr.
// Der Status wird aus den Ereignissen bis zur Projektzeit (ctx.at) abgeleitet; es gibt keinen gespeicherten Status.
// Dieses Modul darf regeln.js NICHT importieren (regeln.js importiert dieses Modul).
// ctx: { at, daten: { bauteile, bedarfe, entscheidungen, ... }, ereignisse, ezustand }
import { PERSONEN, GRUPPEN } from './daten.js';
import { minuten, bis, istDatum, datum, zeit } from './zeit.js';

export const HINWEIS_FACH = 'laut Eintrag (Simulation), keine Fachfreigabe';
export const HINWEIS_VORMERKUNG = 'Vormerkung (Simulation, unverbindlich)';

const ZAHL = /^\d+([.,]\d{1,2})?$/;
const vk = (projekt, id) => `${projekt}:${id}`;
export const vorgangSchluessel = (e) => vk(e.projekt, e.id);
const stichtag = (ctx) => String(ctx.at).slice(0, 10);
// Ein Datum ohne Uhrzeit gilt als Frist bis zum Ende dieses Tages.
export const tagesende = (d) => (d ? `${d}T23:59` : null);

export const VORGANG_STATUS = {
  offen: { label: 'Angelegt', ton: 'neutral' },
  pruefbitte: { label: 'Prüfbitte gestellt', ton: 'info' },
  geeignet: { label: 'Geeignet (laut Eintrag)', ton: 'ok' },
  bedingt: { label: 'Bedingt geeignet (laut Eintrag)', ton: 'warn' },
  vorgemerkt: { label: 'Vorgemerkt (Simulation)', ton: 'ok' },
  abgelaufen: { label: 'Vormerkung abgelaufen', ton: 'crit' },
  uebergabe: { label: 'Übergabe geplant', ton: 'info' },
  uebergeben: { label: 'Übergeben (Simulation)', ton: 'ok' },
  ungeeignet: { label: 'Ungeeignet (laut Eintrag)', ton: 'crit' },
  abgebrochen: { label: 'Abgebrochen', ton: 'neutral' },
};
export const BEENDET = ['uebergeben', 'ungeeignet', 'abgebrochen'];
// Status, ab dem ein Fachergebnis vorliegt. Davor gilt die bisherige Tür- und Bodenregel.
export const NACH_FACHERGEBNIS = ['geeignet', 'bedingt', 'vorgemerkt', 'abgelaufen', 'uebergabe', 'uebergeben'];

// Erlaubte Aktionen je Status. Keine Rückwärtsübergänge; beendete Vorgänge erlauben nichts mehr.
const ERLAUBT = {
  offen: ['pruefbitte', 'abbruch'],
  pruefbitte: ['fachergebnis', 'abbruch'],
  geeignet: ['vormerkung', 'abbruch'],
  bedingt: ['vormerkung', 'abbruch'],
  vorgemerkt: ['uebergabe-geplant', 'abbruch'],
  abgelaufen: ['vormerkung', 'abbruch'],
  uebergabe: ['uebergeben', 'abbruch'],
  uebergeben: [], ungeeignet: [], abgebrochen: [],
};
export const AKTIONEN = ['pruefbitte', 'fachergebnis', 'vormerkung', 'uebergabe-geplant', 'uebergeben', 'abbruch'];

const bauteilZu = (ctx, e) => ctx.daten.bauteile.find((b) => b.projekt === e.projekt && b.id === e.bauteil) || null;
const bedarfZu = (ctx, e) => (e.ziel?.art === 'bedarf' ? ctx.daten.bedarfe.find((d) => d.projekt === (e.ziel.projekt || e.projekt) && d.id === e.ziel.id) || null : null);
export const vorgangEreignisse = (ctx, e) => (ctx.ereignisse || [])
  .map((x, i) => ({ x, i })).filter(({ x }) => x && x.entscheidung === vorgangSchluessel(e) && x.at && bis(x.at, ctx.at))
  .sort((a, b) => (minuten(a.x.at) - minuten(b.x.at)) || (a.i - b.i)).map(({ x }) => x);

// Leitet den Status aus den Ereignissen ab. Ungültige Übergänge in gespeicherten Ereignissen werden übergangen.
export function vorgangStatus(ctx, e) {
  const tag = stichtag(ctx);
  const v = { pruefbitte: null, fachergebnis: null, vormerkung: null, uebergabe: null, uebergeben: null, abbruch: null };
  let key = 'offen';
  const verlauf = vorgangEreignisse(ctx, e);
  const abgelaufenAm = (t) => key === 'vorgemerkt' && v.vormerkung && v.vormerkung.ablauf < t;
  for (const ev of verlauf) {
    if (abgelaufenAm(ev.at.slice(0, 10))) key = 'abgelaufen';
    const art = ev.art === 'vorlage' ? 'pruefbitte' : ev.art; // die bestehende Vorlage zählt wie eine Prüfbitte
    if (!ERLAUBT[key]?.includes(art)) continue;
    if (art === 'pruefbitte') { v.pruefbitte = ev; key = 'pruefbitte'; }
    else if (art === 'fachergebnis') { if (!['geeignet', 'bedingt', 'ungeeignet'].includes(ev.urteil)) continue; v.fachergebnis = ev; key = ev.urteil; }
    else if (art === 'vormerkung') { v.vormerkung = ev; key = 'vorgemerkt'; }
    else if (art === 'uebergabe-geplant') { v.uebergabe = ev; key = 'uebergabe'; }
    else if (art === 'uebergeben') { v.uebergeben = ev; key = 'uebergeben'; }
    else if (art === 'abbruch') { v.abbruch = ev; key = 'abgebrochen'; }
  }
  const abgelaufen = abgelaufenAm(tag);
  if (abgelaufen) key = 'abgelaufen';
  // „ungeeignet“ endet den Vorgang; das Ereignis bleibt als Fachergebnis erhalten.
  const beendet = BEENDET.includes(key);
  const ueberfaellig = key === 'uebergabe' && v.uebergabe.termin < tag;
  return {
    key, ...VORGANG_STATUS[key], beendet, aktiv: !beendet, abgelaufen, ueberfaellig, ...v, verlauf,
    erlaubt: ERLAUBT[key] || [], nachFachergebnis: NACH_FACHERGEBNIS.includes(key),
  };
}
export const vorgangBeendet = (ctx, e) => vorgangStatus(ctx, e).beendet;
export const vorgangAktiv = (ctx, e) => !vorgangStatus(ctx, e).beendet;
export const vorgaengeFuer = (ctx, projekt, bauteilId) => ctx.daten.entscheidungen.filter((e) => e.projekt === projekt && e.bauteil === bauteilId);
export const aktiverVorgang = (ctx, projekt, bauteilId) => vorgaengeFuer(ctx, projekt, bauteilId).find((e) => vorgangAktiv(ctx, e)) || null;
export const uebergebenerVorgang = (ctx, projekt, bauteilId) => vorgaengeFuer(ctx, projekt, bauteilId).find((e) => vorgangStatus(ctx, e).key === 'uebergeben') || null;
// Ein Bedarf ist belegt, solange ein aktiver Vorgang ihn als Ziel hat oder ein Vorgang mit „übergeben“ endete
// (die Übergabe deckt den Bedarf). Ungeeignet und abgebrochen geben ihn wieder frei.
// ausser: ein Vorgang (Entscheidung), der nicht als Sperrgrund zählt, etwa der eigene bei der Prüfung der Prüfbitte.
export const bedarfVorgang = (ctx, projekt, id, ausser = null) => ctx.daten.entscheidungen.find((e) => e.ziel?.art === 'bedarf'
  && (e.ziel.projekt || e.projekt) === projekt && e.ziel.id === id && !(ausser && e.projekt === ausser.projekt && e.id === ausser.id)
  && (() => { const st = vorgangStatus(ctx, e); return st.aktiv || st.key === 'uebergeben'; })()) || null;
export const bedarfBelegt = (ctx, projekt, id, ausser = null) => Boolean(bedarfVorgang(ctx, projekt, id, ausser));
// Art der Belegung: null (frei), 'laufend' (aktiver Vorgang) oder 'uebergeben' (durch Übergabe gedeckt).
export function bedarfBelegtArt(ctx, projekt, id) {
  const e = bedarfVorgang(ctx, projekt, id);
  return e ? (vorgangStatus(ctx, e).key === 'uebergeben' ? 'uebergeben' : 'laufend') : null;
}
// Ziel ist für dieses Bauteil gesperrt, wenn ein früherer Vorgang mit „ungeeignet“ endete.
export const zielUngeeignet = (ctx, projekt, bauteilId, ziel) => vorgaengeFuer(ctx, projekt, bauteilId)
  .some((e) => e.ziel?.art === ziel.art && e.ziel.id === ziel.id && (e.ziel.projekt || e.projekt) === (ziel.projekt || projekt) && vorgangStatus(ctx, e).key === 'ungeeignet');

// ---------- Aktionen ----------
const feld = (s) => String(s ?? '').trim();
const ereignis = (ctx, e, art, nutzlast, text) => ({ entscheidung: vorgangSchluessel(e), bauteil: vk(e.projekt, e.bauteil), art, at: ctx.at, von: 'browser', sim: true, text, ...nutzlast });
const zahl = (s) => Number(String(s).trim().replace(',', '.'));
const einheitVon = (b) => GRUPPEN[b?.gruppe]?.einheit || '';

// Prüft eine Aktion. Liefert { ereignis } oder { fehler: { feld: text } }; Fehler ohne Feld unter „allgemein“.
export function vorgangSchritt(ctx, e, aktion, eingabe = {}) {
  if (!e) return { fehler: { allgemein: 'Diesen Vorgang gibt es nicht mehr.' } };
  if (!AKTIONEN.includes(aktion)) return { fehler: { allgemein: 'Diese Aktion gibt es nicht.' } };
  // Rückdatierte Einträge: Ein neuer Schritt darf nicht vor einem schon vorhandenen Eintrag dieses Vorgangs liegen.
  const spaeter = (ctx.ereignisse || []).filter((x) => x && x.entscheidung === vorgangSchluessel(e) && x.at && minuten(x.at) > minuten(ctx.at))
    .sort((a, c) => minuten(c.at) - minuten(a.at))[0];
  if (spaeter) return { fehler: { allgemein: `Es gibt Einträge nach diesem Stichtag. Stichtag auf ${zeit(spaeter.at)} oder später stellen.` } };
  const st = vorgangStatus(ctx, e);
  if (!st.erlaubt.includes(aktion)) return { fehler: { allgemein: st.beendet ? `Der Vorgang ist beendet (${st.label}). Es sind keine weiteren Schritte möglich.` : `Dieser Schritt ist im Status „${st.label}“ nicht möglich.` } };
  const tag = stichtag(ctx); const b = bauteilZu(ctx, e); const d = bedarfZu(ctx, e);
  const fehler = {};
  // Nach Ablauf der Bestellfrist bleibt der Vorgang dokumentierbar; der Eintrag hält fest, dass er danach kam.
  const nachFrist = d?.bestellfrist && minuten(ctx.at) > minuten(tagesende(d.bestellfrist)) ? ` Eingetragen nach Ablauf der Bestellfrist (${datum(d.bestellfrist)}).` : '';
  const einheit = einheitVon(b);
  if (aktion === 'pruefbitte') {
    return { ereignis: ereignis(ctx, e, 'pruefbitte', { schnappschuss: eingabe.schnappschuss || null }, 'Prüfbitte an die Fachprüfung angelegt (Simulation).') };
  }
  if (aktion === 'fachergebnis') {
    const urteil = feld(eingabe.urteil); const person = feld(eingabe.person); const notiz = feld(eingabe.notiz);
    if (!['geeignet', 'bedingt', 'ungeeignet'].includes(urteil)) fehler.urteil = 'Bitte ein Ergebnis wählen: geeignet, bedingt geeignet oder ungeeignet.';
    if (!person) fehler.person = 'Bitte den Namen der Fachperson eintragen.';
    else if (person.length > 80) fehler.person = 'Der Name darf höchstens 80 Zeichen haben.';
    if ((urteil === 'bedingt' || urteil === 'ungeeignet') && !notiz) fehler.notiz = urteil === 'bedingt' ? 'Bitte die Bedingung eintragen.' : 'Bitte den Grund eintragen.';
    if (Object.keys(fehler).length) return { fehler };
    const wort = { geeignet: 'geeignet', bedingt: 'bedingt geeignet', ungeeignet: 'ungeeignet' }[urteil];
    return { ereignis: ereignis(ctx, e, 'fachergebnis', { urteil, person, notiz, hinweis: HINWEIS_FACH }, `Fachergebnis: ${wort}. Eingetragen für ${person}, ${HINWEIS_FACH}.${notiz ? ` ${notiz}` : ''}${nachFrist}`) };
  }
  if (aktion === 'vormerkung') {
    const roh = feld(eingabe.menge); const ablauf = feld(eingabe.ablauf);
    const m = zahl(roh);
    if (!ZAHL.test(roh) || !(m > 0)) fehler.menge = `Bitte eine Menge größer als 0 in ${einheit} eingeben (höchstens zwei Nachkommastellen).`;
    else if (b && Number.isFinite(b.menge) && m > b.menge) fehler.menge = `Das Bauteil umfasst nur ${String(b.menge).replace('.', ',')} ${einheit}.`;
    if (!istDatum(ablauf)) fehler.ablauf = 'Bitte ein gültiges Ablaufdatum eingeben.';
    else if (ablauf < tag) fehler.ablauf = `Das Ablaufdatum darf nicht vor dem Stichtag (${datum(tag)}) liegen.`;
    if (Object.keys(fehler).length) return { fehler };
    return { ereignis: ereignis(ctx, e, 'vormerkung', { menge: m, einheit, ablauf, hinweis: HINWEIS_VORMERKUNG }, `${HINWEIS_VORMERKUNG}: ${String(m).replace('.', ',')} ${einheit} bis ${datum(ablauf)}.${nachFrist}`) };
  }
  if (aktion === 'uebergabe-geplant') {
    const termin = feld(eingabe.termin); const ort = feld(eingabe.ort); const rolle = feld(eingabe.rolle);
    if (!istDatum(termin)) fehler.termin = 'Bitte einen gültigen Termin eingeben.';
    else if (termin < tag) fehler.termin = `Der Termin darf nicht vor dem Stichtag (${datum(tag)}) liegen.`;
    else if (b?.verfuegbarAb && termin < b.verfuegbarAb) fehler.termin = `Das Bauteil ist erst ab ${datum(b.verfuegbarAb)} verfügbar.`;
    else if (d?.annahmeVon && termin < d.annahmeVon) fehler.termin = `Das Annahmefenster beginnt am ${datum(d.annahmeVon)}.`;
    else if (d?.annahmeBis && termin > d.annahmeBis) fehler.termin = `Das Annahmefenster endet am ${datum(d.annahmeBis)}.`;
    else if (st.vormerkung && termin > st.vormerkung.ablauf) fehler.termin = `Die Vormerkung läuft am ${datum(st.vormerkung.ablauf)} ab. Der Termin darf nicht danach liegen.`;
    if (!ort) fehler.ort = 'Bitte den Übergabeort eintragen.';
    if (!rolle) fehler.rolle = 'Bitte die zuständige Rolle wählen.';
    else if (!PERSONEN[rolle] || rolle === 'radar' || rolle === 'browser') fehler.rolle = 'Bitte eine Rolle aus der Liste wählen.';
    if (Object.keys(fehler).length) return { fehler };
    return { ereignis: ereignis(ctx, e, 'uebergabe-geplant', { termin, ort, rolle }, `Übergabe geplant am ${datum(termin)}, Ort: ${ort}, zuständig: ${PERSONEN[rolle].rolle} (Simulation).`) };
  }
  if (aktion === 'uebergeben') {
    const am = feld(eingabe.datum);
    if (!istDatum(am)) fehler.datum = 'Bitte ein gültiges Übergabedatum eingeben.';
    else if (am > tag) fehler.datum = `Das Datum darf nicht nach dem Stichtag (${datum(tag)}) liegen.`;
    if (Object.keys(fehler).length) return { fehler };
    return { ereignis: ereignis(ctx, e, 'uebergeben', { datum: am }, `Übergeben am ${datum(am)} (Simulation, laut Eintrag).`) };
  }
  // abbruch
  const grund = feld(eingabe.grund);
  if (!grund) return { fehler: { grund: 'Bitte den Grund für den Abbruch eintragen.' } };
  return { ereignis: ereignis(ctx, e, 'abbruch', { grund }, `Vorgang abgebrochen. Grund: ${grund}${nachFrist}`) };
}

// Prüfbitte-Ereignis aus einem Abgleichergebnis (Schnappschuss ist reine Daten, ohne Objektverweise).
export function pruefbitteEreignis(ctx, e, schnappschuss) {
  return vorgangSchritt(ctx, e, 'pruefbitte', { schnappschuss });
}

// ---------- Nächster Schritt nach dem Fachergebnis ----------
// Liefert null, solange noch kein Fachergebnis vorliegt oder der Vorgang endete, ohne abgeschlossen zu sein.
export function naechsterVorgangsschritt(ctx, e) {
  const st = vorgangStatus(ctx, e); const d = bedarfZu(ctx, e);
  if (!st.nachFachergebnis) return null;
  const mk = (rank, text, rolle, grund, ton, frist = null, fristName = '') => ({ rank, text, rolle, grund, ton, frist, fristName, status: st.key });
  switch (st.key) {
    case 'geeignet': return mk(6, 'Vormerkung anlegen', 'planung', `Fachergebnis „geeignet“, ${HINWEIS_FACH}. Die Vormerkung ist unverbindlich.`, 'ok', tagesende(d?.bestellfrist), d?.bestellfrist ? 'Bestellfrist' : '');
    case 'bedingt': return mk(6, 'Vormerkung anlegen', 'planung', `Fachergebnis „bedingt geeignet“, ${HINWEIS_FACH}. Bedingung: ${st.fachergebnis.notiz}`, 'warn', tagesende(d?.bestellfrist), d?.bestellfrist ? 'Bestellfrist' : '');
    case 'abgelaufen': return mk(4, 'Vormerkung erneuern', 'planung', `Die ${HINWEIS_VORMERKUNG} ist am ${datum(st.vormerkung.ablauf)} abgelaufen.`, 'warn', tagesende(st.vormerkung.ablauf), 'Vormerkung abgelaufen');
    case 'vorgemerkt': return mk(6, 'Übergabe planen', 'planung', `${HINWEIS_VORMERKUNG}: ${String(st.vormerkung.menge).replace('.', ',')} ${st.vormerkung.einheit} bis ${datum(st.vormerkung.ablauf)}.`, 'info', tagesende(st.vormerkung.ablauf), 'Vormerkung läuft ab');
    case 'uebergabe': return mk(st.ueberfaellig ? 2 : 6, 'Übergabe durchführen', st.uebergabe.rolle, `Geplant am ${datum(st.uebergabe.termin)}, Ort: ${st.uebergabe.ort}. Nach der Übergabe das Datum eintragen.`, st.ueberfaellig ? 'crit' : 'info', tagesende(st.uebergabe.termin), 'Übergabetermin');
    case 'uebergeben': return mk(7, 'Abgeschlossen', null, `Übergeben am ${datum(st.uebergeben.datum)} (Simulation, laut Eintrag).`, 'ok');
    default: return null;
  }
}

// ---------- Checkliste „Was ist zu klären“ ----------
export const CHECKLISTE_PUNKTE = [
  { key: 'eignung', label: 'Eignung', sperrt: true },
  { key: 'nachweise', label: 'Nachweise', sperrt: false },
  { key: 'ausbau', label: 'Ausbau', sperrt: false },
  { key: 'transport', label: 'Transport und Lager', sperrt: false },
  { key: 'uebergabe', label: 'Übergabe', sperrt: false },
  { key: 'wirtschaft', label: 'Wirtschaftlichkeit', sperrt: false },
];
// Gespeicherter Stand: ctx.ezustand[k].checkliste = { nachweise: true, ... } (Häkchen einer Person, keine Prüfung).
// offeneNachweise: Liste aus regeln.offeneNachweise(ctx, bauteil), damit dieses Modul regeln.js nicht braucht.
export function checkliste(ctx, e, { offeneNachweise = [] } = {}) {
  const st = vorgangStatus(ctx, e);
  const gespeichert = ctx.ezustand?.[vorgangSchluessel(e)]?.checkliste || {};
  const urteil = st.fachergebnis?.urteil;
  const eignungOk = urteil === 'geeignet' || urteil === 'bedingt';
  const punkte = CHECKLISTE_PUNKTE.map((p) => {
    let erledigt = Boolean(gespeichert[p.key]); let text = ''; let abgeleitet = false;
    if (p.key === 'eignung') {
      abgeleitet = true; erledigt = eignungOk;
      text = st.key === 'ungeeignet' ? `Fachergebnis „ungeeignet“, ${HINWEIS_FACH}.` : eignungOk ? `Fachergebnis „${urteil === 'bedingt' ? 'bedingt geeignet' : 'geeignet'}“, ${HINWEIS_FACH}.` : 'Noch kein Fachergebnis. Ohne Fachergebnis ist keine Vormerkung möglich.';
    } else if (p.key === 'nachweise') {
      abgeleitet = offeneNachweise.length === 0; erledigt = erledigt || offeneNachweise.length === 0;
      text = offeneNachweise.length ? `${offeneNachweise.length} offene Nachweise am Bauteil.` : 'Keine offenen Nachweise am Bauteil.';
    } else if (p.key === 'uebergabe') {
      abgeleitet = Boolean(st.uebergabe); erledigt = erledigt || Boolean(st.uebergabe);
      text = st.uebergabe ? `Übergabe geplant am ${datum(st.uebergabe.termin)}.` : 'Termin, Ort und zuständige Rolle noch offen.';
    } else {
      text = { ausbau: 'Ausbauweise und Zugang laut Bauteilakte klären.', transport: 'Transportweg und Zwischenlager klären.', wirtschaft: 'Wirtschaftlichkeit klären (ohne Zahlen in dieser Fassung).' }[p.key];
    }
    return { ...p, erledigt, text, abgeleitet };
  });
  return { punkte, offen: punkte.filter((p) => !p.erledigt).length, sperrend: punkte.filter((p) => p.sperrt && !p.erledigt).map((p) => p.key) };
}
// Setzt oder löscht ein Häkchen; liefert den neuen Stand für ctx.ezustand[k].checkliste.
export function checklisteSetzen(stand = {}, key, wert) {
  if (!CHECKLISTE_PUNKTE.some((p) => p.key === key && p.key !== 'eignung')) return { ...stand };
  const neu = { ...stand };
  if (wert) neu[key] = true; else delete neu[key];
  return neu;
}
