// Pilotbetrieb: Interesse an einem Angebot, Dienstleister, Prüf- und Logistikanfragen, Bauteilverkauf mit Provisionsstatus
// und Änderungen am eigenen Angebot. Reine Fachfunktionen ohne DOM und ohne Systemuhr (Stichtag = ctx.at).
// Alles hier sind Einträge von Personen. Nichts wird versendet, bezahlt oder fachlich freigegeben.
import { GRUPPEN, ZUSTAND } from './daten.js';
import { istDatum, datum, minuten } from './zeit.js';

export const HINWEIS_REGEL = 'Regelbasierter Hinweis aus den eingetragenen Angaben. Keine KI, keine fachliche Freigabe.';
export const HINWEIS_INTERESSE = 'Interessenbekundung: keine Reservierung, keine Bestellung, kein Vertrag.';
export const HINWEIS_ANFRAGE = 'Gespeicherte Anfrage. Die Plattform versendet keine Nachricht; eine Beauftragung geschieht außerhalb und wird hier nur vermerkt.';
export const HINWEIS_PROVISION = 'Provision nur nach abgeschlossenem Bauteilverkauf und nur laut eingetragener Vereinbarung. Keine Vorgabe, keine Zahlung.';

export const LEISTUNGEN = {
  fachpruefung: 'Fachprüfung der Eignung', ausbau: 'Ausbau', transport: 'Transport', lagerung: 'Zwischenlagerung', aufbereitung: 'Aufbereitung oder Reinigung', sonstige: 'Sonstige Leistung',
};
export const ANFRAGE_STATUS = {
  vorbereitet: { label: 'Anfrage vorbereitet', ton: 'neutral', text: 'gespeichert, nicht versendet' },
  beauftragt: { label: 'Beauftragt (laut Eintrag)', ton: 'info', text: 'Beauftragung außerhalb der Plattform vermerkt' },
  ergebnis: { label: 'Ergebnis eingetragen', ton: 'ok', text: 'Ergebnis der Leistung liegt laut Eintrag vor' },
  klaerung: { label: 'Weitere Klärung', ton: 'warn', text: 'offene Fragen, noch nicht entschieden' },
  uebergabe: { label: 'Übergabe geplant', ton: 'info', text: 'Termin und Ort vermerkt' },
  abgeschlossen: { label: 'Abgeschlossen', ton: 'ok', text: 'Leistung erbracht laut Eintrag' },
  abgelehnt: { label: 'Abgelehnt', ton: 'crit', text: 'nicht weiterverfolgt' },
};
// Erlaubte Übergänge. Kein Schritt setzt ein Ergebnis von selbst; „Ergebnis“ braucht ein eingetragenes Urteil.
export const ANFRAGE_ERLAUBT = {
  vorbereitet: ['beauftragt', 'abgelehnt'],
  beauftragt: ['ergebnis', 'klaerung', 'abgelehnt'],
  klaerung: ['beauftragt', 'ergebnis', 'uebergabe', 'abgelehnt'],
  ergebnis: ['uebergabe', 'klaerung', 'abgeschlossen', 'abgelehnt'],
  uebergabe: ['abgeschlossen', 'klaerung', 'abgelehnt'],
  abgeschlossen: [], abgelehnt: [],
};
export const ANFRAGE_BEENDET = ['abgeschlossen', 'abgelehnt'];
export const URTEIL = { positiv: 'positiv (laut Eintrag)', negativ: 'negativ (laut Eintrag)', offen: 'mit Auflagen oder offenen Punkten' };
export const KOSTENTRAEGER = { offen: 'noch nicht vereinbart', kaeufer: 'Käuferseite (laut Vereinbarung)', verkaeufer: 'Verkäuferseite (laut Vereinbarung)', geteilt: 'geteilt (laut Vereinbarung)' };
export const DIENSTLEISTER_ART = { test: { label: 'Testeintrag', ton: 'sim' }, freigegeben: { label: 'freigegebener Kontakt', ton: 'ok' } };
export const VERKAUF_STATUS = {
  offen: { label: 'Kein Verkauf dokumentiert', ton: 'neutral' },
  abgeschlossen: { label: 'Verkauf abgeschlossen (laut Eintrag)', ton: 'ok' },
  nicht: { label: 'Nicht zustande gekommen (laut Eintrag)', ton: 'crit' },
};
export const PROVISION_STATUS = {
  offen: { label: 'offen (keine Vereinbarung eingetragen)', ton: 'info' },
  vereinbart: { label: 'vereinbart (laut Eintrag)', ton: 'ok' },
  keine: { label: 'keine Provision vereinbart', ton: 'neutral' },
};

const feld = (s) => String(s ?? '').trim();
const ZAHL = /^\d+([.,]\d{1,2})?$/;
const zahl = (s) => Number(feld(s).replace(',', '.'));
export const bauteilKey = (b) => `${b.projekt}:${b.id}`;
const stichtag = (ctx) => String(ctx.at).slice(0, 10);
const findeBauteil = (ctx, ref) => (ref ? ctx.daten.bauteile.find((b) => b.projekt === ref.projekt && b.id === ref.id) || null : null);
const findeBedarf = (ctx, ref) => (ref ? ctx.daten.bedarfe.find((d) => d.projekt === ref.projekt && d.id === ref.id) || null : null);
export const findeDienstleister = (ctx, id) => (id ? (ctx.daten.dienstleister || []).find((d) => d.id === id) || null : null);
export const findeAnfrage = (ctx, id) => (ctx.daten.anfragen || []).find((a) => a.id === id) || null;
const refText = (r) => (r ? `${r.projekt} · ${r.id}` : '');

// Nächste freie Nummer je Präfix über die ganze Liste (I-01, DL-01, A-01).
export function naechsteId(liste, prefix) {
  const nr = (liste || []).map((x) => new RegExp(`^${prefix}-(\\d+)$`).exec(x?.id || '')).filter(Boolean).map((m) => Number(m[1]));
  return `${prefix}-${String(Math.max(0, ...nr) + 1).padStart(2, '0')}`;
}

// ---------- Interesse (Käuferseite) ----------
export const interessenFuerBauteil = (ctx, b) => (ctx.daten.interessen || []).filter((i) => i.bauteil.projekt === b.projekt && i.bauteil.id === b.id);
export const interessenFuerBedarf = (ctx, d) => (ctx.daten.interessen || []).filter((i) => i.bedarf.projekt === d.projekt && i.bedarf.id === d.id);
export const offenesInteresse = (ctx, b, d) => interessenFuerBauteil(ctx, b).find((i) => i.status === 'offen' && i.bedarf.projekt === d.projekt && i.bedarf.id === d.id) || null;

export function interesseAnlegen(ctx, { bauteil, bedarf, notiz = '' }) {
  const b = findeBauteil(ctx, bauteil); const d = findeBedarf(ctx, bedarf);
  if (!b) return { fehler: { allgemein: 'Das Bauteil gibt es nicht mehr.' } };
  if (!d) return { fehler: { allgemein: 'Den Bedarf gibt es nicht mehr.' } };
  if (b.gruppe !== d.gruppe) return { fehler: { allgemein: `Bauteilgruppe passt nicht: ${GRUPPEN[b.gruppe]?.name || b.gruppe} gegenüber ${GRUPPEN[d.gruppe]?.name || d.gruppe}.` } };
  if (b.status === 'nicht') return { fehler: { allgemein: 'Das Bauteil ist als nicht verfügbar eingestuft.' } };
  if (offenesInteresse(ctx, b, d)) return { fehler: { allgemein: 'Für dieses Paar ist bereits ein Interesse festgehalten.' } };
  const n = feld(notiz); if (n.length > 300) return { fehler: { notiz: 'Die Notiz darf höchstens 300 Zeichen haben.' } };
  const id = naechsteId(ctx.daten.interessen, 'I');
  return { interesse: { id, bauteil: { projekt: b.projekt, id: b.id }, bedarf: { projekt: d.projekt, id: d.id }, notiz: n, status: 'offen', at: ctx.at, von: 'browser', hinweis: HINWEIS_INTERESSE } };
}
export function interesseZurueckziehen(ctx, interesse) {
  if (!interesse || interesse.status !== 'offen') return { fehler: { allgemein: 'Dieses Interesse ist nicht mehr offen.' } };
  if (minuten(ctx.at) < minuten(interesse.at)) return { fehler: { allgemein: `Das Interesse wurde am ${datum(interesse.at)} festgehalten. Stichtag auf diesen Tag oder später stellen.` } };
  return { interesse: { ...interesse, status: 'zurueckgezogen', zurueckAm: ctx.at } };
}

// ---------- Dienstleister ----------
export const leererDienstleisterEntwurf = () => ({ name: '', leistungen: {}, ort: '', kontakt: '', art: 'test', freigabe: '' });
export function pruefeDienstleister(e) {
  const f = {};
  const name = feld(e.name);
  if (name.length < 2 || name.length > 80) f.name = 'Bitte einen Namen mit 2 bis 80 Zeichen eintragen.';
  const leistungen = Object.keys(LEISTUNGEN).filter((k) => e.leistungen?.[k]);
  if (!leistungen.length) f.leistungen = 'Bitte mindestens eine Leistung wählen.';
  if (!DIENSTLEISTER_ART[e.art]) f.art = 'Bitte „Testeintrag“ oder „freigegebener Kontakt“ wählen.';
  if (e.art === 'freigegeben' && feld(e.freigabe).length < 5) f.freigabe = 'Bitte eintragen, wer den Kontakt wann freigegeben hat.';
  if (feld(e.ort).length > 80) f.ort = 'Höchstens 80 Zeichen.';
  if (feld(e.kontakt).length > 160) f.kontakt = 'Höchstens 160 Zeichen.';
  return f;
}
export function dienstleisterAusEntwurf(e, { id, at }) {
  return { id, name: feld(e.name), leistungen: Object.keys(LEISTUNGEN).filter((k) => e.leistungen?.[k]), ort: feld(e.ort), kontakt: feld(e.kontakt), art: e.art, freigabe: e.art === 'freigegeben' ? feld(e.freigabe) : '', angelegt: at, von: 'browser', zurueckgezogen: null };
}
// Ein Eintrag lässt sich nicht löschen (Verweise aus Anfragen bleiben), aber zurückziehen: Er ist dann nicht mehr wählbar.
export function dienstleisterZurueckziehen(ctx, d, grund = '') {
  if (!d) return { fehler: { allgemein: 'Diesen Dienstleister gibt es nicht.' } };
  if (d.zurueckgezogen) return { fehler: { allgemein: 'Der Eintrag ist bereits zurückgezogen.' } };
  const g = feld(grund); if (g.length > 200) return { fehler: { grund: 'Höchstens 200 Zeichen.' } };
  return { dienstleister: { ...d, zurueckgezogen: ctx.at, zurueckGrund: g } };
}
export const waehlbareDienstleister = (ctx) => (ctx.daten.dienstleister || []).filter((d) => !d.zurueckgezogen);

// ---------- Prüf- und Logistikanfrage ----------
export const leererAnfrageEntwurf = (bauteil = null, bedarf = null) => ({ bauteil, bedarf, leistung: '', beschreibung: '', unterlagen: '', offeneFragen: '', zustaendig: '', termin: '', dienstleister: '', kostentraeger: 'offen' });
export function pruefeAnfrage(e, ctx) {
  const f = {};
  if (!findeBauteil(ctx, e.bauteil)) f.bauteil = 'Bitte ein vorhandenes Bauteil wählen.';
  if (e.bedarf && !findeBedarf(ctx, e.bedarf)) f.bedarf = 'Den gewählten Bedarf gibt es nicht.';
  if (!LEISTUNGEN[e.leistung]) f.leistung = 'Bitte die gewünschte Leistung wählen.';
  if (feld(e.beschreibung).length > 400) f.beschreibung = 'Höchstens 400 Zeichen.';
  if (feld(e.unterlagen).length > 400) f.unterlagen = 'Höchstens 400 Zeichen.';
  if (feld(e.offeneFragen).length > 400) f.offeneFragen = 'Höchstens 400 Zeichen.';
  const z = feld(e.zustaendig); if (z.length < 2 || z.length > 80) f.zustaendig = 'Bitte die zuständige Person oder Rolle eintragen (2 bis 80 Zeichen).';
  if (!istDatum(feld(e.termin))) f.termin = 'Bitte den benötigten Termin als Datum eintragen.';
  if (e.dienstleister && !findeDienstleister(ctx, e.dienstleister)) f.dienstleister = 'Diesen Dienstleister gibt es nicht.';
  else if (e.dienstleister && findeDienstleister(ctx, e.dienstleister).zurueckgezogen) f.dienstleister = 'Dieser Dienstleister ist zurückgezogen und nicht mehr wählbar.';
  if (!KOSTENTRAEGER[e.kostentraeger || 'offen']) f.kostentraeger = 'Bitte eine Angabe zur Kostentragung wählen.';
  return f;
}
export function anfrageAusEntwurf(e, { id, at, vorgang = null }) {
  const b = e.bauteil; const d = e.bedarf || null;
  return {
    id, bauteil: { projekt: b.projekt, id: b.id }, bedarf: d ? { projekt: d.projekt, id: d.id } : null, vorgang,
    leistung: e.leistung, beschreibung: feld(e.beschreibung), unterlagen: feld(e.unterlagen), offeneFragen: feld(e.offeneFragen),
    zustaendig: feld(e.zustaendig), termin: feld(e.termin), dienstleister: e.dienstleister || null, kostentraeger: e.kostentraeger || 'offen',
    status: 'vorbereitet', ergebnis: null, uebergabe: null, angelegt: at, geaendert: at, von: 'browser',
    verlauf: [{ at, status: 'vorbereitet', text: `Anfrage „${LEISTUNGEN[e.leistung]}“ für ${refText(b)} vorbereitet. Nicht versendet.` }],
  };
}
export const anfragenFuerBauteil = (ctx, b) => (ctx.daten.anfragen || []).filter((a) => a.bauteil.projekt === b.projekt && a.bauteil.id === b.id);
export const anfragenFuerBedarf = (ctx, d) => (ctx.daten.anfragen || []).filter((a) => a.bedarf && a.bedarf.projekt === d.projekt && a.bedarf.id === d.id);
export const anfrageStatus = (a) => ({ key: a.status, ...ANFRAGE_STATUS[a.status], beendet: ANFRAGE_BEENDET.includes(a.status), erlaubt: ANFRAGE_ERLAUBT[a.status] || [] });

// Ein Schritt im Verlauf. Liefert { anfrage } (neue Kopie) oder { fehler: { feld: text } }.
export function anfrageSchritt(ctx, a, aktion, eingabe = {}) {
  if (!a) return { fehler: { allgemein: 'Diese Anfrage gibt es nicht mehr.' } };
  const st = anfrageStatus(a); const f = {}; const tag = stichtag(ctx);
  if (aktion !== 'kosten' && !st.erlaubt.includes(aktion)) return { fehler: { allgemein: st.beendet ? `Die Anfrage ist beendet (${st.label}).` : `Dieser Schritt ist im Status „${st.label}“ nicht möglich.` } };
  if (minuten(ctx.at) < minuten(a.geaendert)) return { fehler: { allgemein: `Es gibt Einträge nach diesem Stichtag. Stichtag auf ${datum(a.geaendert)} oder später stellen.` } };
  const neu = { ...a, geaendert: ctx.at, verlauf: [...(a.verlauf || [])] };
  const schreibe = (text, extra = {}) => { Object.assign(neu, extra); neu.verlauf.push({ at: ctx.at, status: neu.status, text }); return { anfrage: neu }; };
  if (aktion === 'kosten') {
    if (!KOSTENTRAEGER[eingabe.kostentraeger]) return { fehler: { kostentraeger: 'Bitte eine Angabe zur Kostentragung wählen.' } };
    const hinweis = feld(eingabe.kostenHinweis); if (hinweis.length > 200) return { fehler: { kostenHinweis: 'Höchstens 200 Zeichen.' } };
    return schreibe(`Kostentragung: ${KOSTENTRAEGER[eingabe.kostentraeger]}${hinweis ? ` – ${hinweis}` : ''}.`, { kostentraeger: eingabe.kostentraeger, kostenHinweis: hinweis });
  }
  if (aktion === 'beauftragt') {
    const dl = eingabe.dienstleister || a.dienstleister;
    if (!findeDienstleister(ctx, dl)) f.dienstleister = 'Bitte einen hinterlegten Dienstleister wählen.';
    else if (findeDienstleister(ctx, dl).zurueckgezogen) f.dienstleister = 'Dieser Dienstleister ist zurückgezogen und nicht mehr wählbar.';
    if (eingabe.bestaetigt !== true) f.bestaetigt = 'Bitte bestätigen, dass die Beauftragung außerhalb der Plattform erfolgt ist.';
    if (Object.keys(f).length) return { fehler: f };
    const d = findeDienstleister(ctx, dl);
    return schreibe(`Als beauftragt vermerkt: ${d.name} (${DIENSTLEISTER_ART[d.art].label}). Keine Nachricht versendet.`, { status: 'beauftragt', dienstleister: dl, beauftragtAm: ctx.at });
  }
  if (aktion === 'ergebnis') {
    const urteil = feld(eingabe.urteil); const person = feld(eingabe.person); const notiz = feld(eingabe.notiz);
    if (!URTEIL[urteil]) f.urteil = 'Bitte das Ergebnis wählen: positiv, negativ oder mit offenen Punkten.';
    if (person.length < 2 || person.length > 80) f.person = 'Bitte eintragen, wer das Ergebnis mitgeteilt hat (Name oder Funktion).';
    if (urteil !== 'positiv' && !notiz) f.notiz = 'Bitte Grund oder offene Punkte eintragen.';
    if (notiz.length > 400) f.notiz = 'Höchstens 400 Zeichen.';
    if (Object.keys(f).length) return { fehler: f };
    const hinweis = a.leistung === 'fachpruefung' ? ' Laut Eintrag, keine Fachfreigabe durch die Plattform.' : '';
    return schreibe(`Ergebnis eingetragen: ${URTEIL[urteil]}, mitgeteilt von ${person}.${notiz ? ` ${notiz}` : ''}${hinweis}`, { status: 'ergebnis', ergebnis: { urteil, person, notiz, at: ctx.at } });
  }
  if (aktion === 'klaerung') {
    const notiz = feld(eingabe.notiz); if (!notiz) return { fehler: { notiz: 'Bitte eintragen, was zu klären ist.' } }; if (notiz.length > 400) return { fehler: { notiz: 'Höchstens 400 Zeichen.' } };
    return schreibe(`Weitere Klärung: ${notiz}`, { status: 'klaerung' });
  }
  if (aktion === 'uebergabe') {
    const termin = feld(eingabe.termin); const ort = feld(eingabe.ort);
    if (!istDatum(termin)) f.termin = 'Bitte einen gültigen Termin eintragen.'; else if (termin < tag) f.termin = `Der Termin darf nicht vor dem Stichtag (${datum(tag)}) liegen.`;
    if (!ort || ort.length > 120) f.ort = 'Bitte den Übergabeort eintragen (höchstens 120 Zeichen).';
    if (Object.keys(f).length) return { fehler: f };
    return schreibe(`Übergabe geplant am ${datum(termin)}, Ort: ${ort}.`, { status: 'uebergabe', uebergabe: { termin, ort } });
  }
  if (aktion === 'abgeschlossen') {
    const am = feld(eingabe.datum);
    if (!istDatum(am)) f.datum = 'Bitte das Datum des Abschlusses eintragen.'; else if (am > tag) f.datum = `Das Datum darf nicht nach dem Stichtag (${datum(tag)}) liegen.`;
    if (Object.keys(f).length) return { fehler: f };
    return schreibe(`Abgeschlossen am ${datum(am)} (laut Eintrag).`, { status: 'abgeschlossen', abgeschlossenAm: am });
  }
  // abgelehnt
  const grund = feld(eingabe.grund);
  if (!grund) return { fehler: { grund: 'Bitte den Grund eintragen.' } }; if (grund.length > 400) return { fehler: { grund: 'Höchstens 400 Zeichen.' } };
  return schreibe(`Abgelehnt. Grund: ${grund}`, { status: 'abgelehnt', abgelehnt: { grund, at: ctx.at } });
}

// ---------- Bauteilverkauf und Provision (Geschäftsmodell laut Teamvorgabe vom 19.11.2026) ----------
export const verkaufVon = (ctx, b) => (ctx.daten.verkaeufe || {})[bauteilKey(b)] || null;
export function verkaufSetzen(ctx, b, eingabe = {}) {
  const f = {}; const status = feld(eingabe.status); const tag = stichtag(ctx);
  if (!VERKAUF_STATUS[status]) f.status = 'Bitte den Stand des Verkaufs wählen.';
  const am = feld(eingabe.datum);
  if (status === 'abgeschlossen') { if (!istDatum(am)) f.datum = 'Bitte das Datum des Verkaufsabschlusses eintragen.'; else if (am > tag) f.datum = `Das Datum darf nicht nach dem Stichtag (${datum(tag)}) liegen.`; }
  const bedarf = eingabe.bedarf ? findeBedarf(ctx, eingabe.bedarf) : null;
  if (eingabe.bedarf && !bedarf) f.bedarf = 'Den gewählten Bedarf gibt es nicht.';
  const notiz = feld(eingabe.notiz); if (notiz.length > 300) f.notiz = 'Höchstens 300 Zeichen.';
  const alt = verkaufVon(ctx, b) || { provisionen: {} };
  if (alt.at && minuten(ctx.at) < minuten(alt.at)) f.allgemein = `Der Verkaufsstand wurde zuletzt am ${datum(alt.at)} eingetragen. Stichtag auf diesen Tag oder später stellen.`;
  if (Object.keys(f).length) return { fehler: f };
  // Eingetragene Provisionsvereinbarungen bleiben erhalten, auch wenn der Stand zwischenzeitlich geändert wird; sie gelten nur bei „abgeschlossen“.
  return { verkauf: { bauteil: { projekt: b.projekt, id: b.id }, status, datum: status === 'abgeschlossen' ? am : '', bedarf: bedarf ? { projekt: bedarf.projekt, id: bedarf.id } : null, notiz, at: ctx.at, von: 'browser', provisionen: alt.provisionen || {} } };
}
// Vermittelte Leistungen = Anfragen dieses Bauteils, die mit einem Dienstleister beauftragt (oder weiter) sind.
export const vermittelteLeistungen = (ctx, b) => anfragenFuerBauteil(ctx, b).filter((a) => a.dienstleister && a.status !== 'vorbereitet' && a.status !== 'abgelehnt');
export function provisionSetzen(ctx, b, dienstleisterId, eingabe = {}) {
  const v = verkaufVon(ctx, b);
  if (!v || v.status !== 'abgeschlossen') return { fehler: { allgemein: 'Ohne abgeschlossenen Bauteilverkauf entsteht nach diesem Modell keine Vermittlungsprovision.' } };
  if (!findeDienstleister(ctx, dienstleisterId)) return { fehler: { allgemein: 'Diesen Dienstleister gibt es nicht.' } };
  if (!vermittelteLeistungen(ctx, b).some((a) => a.dienstleister === dienstleisterId)) return { fehler: { allgemein: 'Für diesen Dienstleister ist keine vermittelte Leistung an diesem Bauteil eingetragen.' } };
  const status = feld(eingabe.status); const grundlage = feld(eingabe.grundlage);
  const alt = v.provisionen?.[dienstleisterId];
  if (alt?.at && minuten(ctx.at) < minuten(alt.at)) return { fehler: { allgemein: `Der Provisionsstatus wurde zuletzt am ${datum(alt.at)} eingetragen. Stichtag auf diesen Tag oder später stellen.` } };
  if (!PROVISION_STATUS[status]) return { fehler: { status: 'Bitte den Provisionsstatus wählen.' } };
  if (status === 'vereinbart' && grundlage.length < 3) return { fehler: { grundlage: 'Bitte die vereinbarte Berechnungsgrundlage eintragen (frei formuliert, kein Vorgabewert).' } };
  if (grundlage.length > 200) return { fehler: { grundlage: 'Höchstens 200 Zeichen.' } };
  return { verkauf: { ...v, provisionen: { ...(v.provisionen || {}), [dienstleisterId]: { status, grundlage: status === 'vereinbart' ? grundlage : '', at: ctx.at } } } };
}
// Zusammenhang für die Anzeige: Verkauf, vermittelte Leistungen je Dienstleister, Provisionsstatus (offen, solange nichts vereinbart ist).
export function provisionsLage(ctx, b) {
  const verkauf = verkaufVon(ctx, b) || { status: 'offen', provisionen: {} };
  const leistungen = vermittelteLeistungen(ctx, b);
  const je = new Map();
  for (const a of leistungen) { const d = findeDienstleister(ctx, a.dienstleister); if (!d) continue; if (!je.has(d.id)) je.set(d.id, { dienstleister: d, anfragen: [] }); je.get(d.id).anfragen.push(a); }
  const zeilen = [...je.values()].map((z) => ({ ...z, provision: verkauf.status === 'abgeschlossen' ? (verkauf.provisionen?.[z.dienstleister.id] || { status: 'offen', grundlage: '' }) : null }));
  const hinweise = [HINWEIS_PROVISION];
  if (verkauf.status !== 'abgeschlossen') hinweise.push('Ohne abgeschlossenen Verkauf entsteht nach diesem Modell keine Vermittlungsprovision.');
  if (leistungen.some((a) => a.ergebnis?.urteil === 'negativ')) hinweise.push('Eine negative Prüfung kann Dienstleistungskosten verursachen. Wer sie trägt, steht nur in der jeweiligen Anfrage (Kostentragung), es gibt keine automatische Verteilung.');
  return { verkauf: { ...verkauf, ...VERKAUF_STATUS[verkauf.status] }, zeilen, hinweise };
}

// ---------- Eigenes Angebot bearbeiten (Verkäuferseite) ----------
export const leererAngebotEntwurf = (b) => ({ menge: String(b.menge ?? '').replace('.', ','), verfuegbarAb: b.verfuegbarAb || '', verfuegbarBis: b.verfuegbarBis || '', zustand: b.zustand || '', zustandText: b.zustandText || '', status: b.status === 'nicht' ? 'nicht' : 'erfasst', grund: b.grund || '' });
export function pruefeAngebot(e, b, at = null) {
  const f = {}; const einheit = GRUPPEN[b.gruppe]?.einheit || '';
  if (at && b.geaendertAm && b.angebotGeaendert && minuten(at) < minuten(b.geaendertAm)) f.allgemein = `Das Angebot wurde zuletzt am ${datum(b.geaendertAm)} geändert. Stichtag auf diesen Tag oder später stellen.`;
  const m = feld(e.menge); if (!ZAHL.test(m) || !(zahl(m) > 0)) f.menge = `Bitte eine Menge größer als 0 in ${einheit} eingeben.`;
  if (feld(e.verfuegbarAb) && !istDatum(feld(e.verfuegbarAb))) f.verfuegbarAb = 'Bitte ein gültiges Datum eingeben.';
  if (feld(e.verfuegbarBis) && !istDatum(feld(e.verfuegbarBis))) f.verfuegbarBis = 'Bitte ein gültiges Datum eingeben.';
  if (!f.verfuegbarAb && !f.verfuegbarBis && feld(e.verfuegbarAb) && feld(e.verfuegbarBis) && feld(e.verfuegbarBis) < feld(e.verfuegbarAb)) f.verfuegbarBis = 'Das Ende darf nicht vor dem Beginn liegen.';
  if (feld(e.zustand) && !ZUSTAND[feld(e.zustand)]) f.zustand = 'Bitte einen Zustand aus der Skala wählen.';
  if (feld(e.zustandText).length > 200) f.zustandText = 'Höchstens 200 Zeichen.';
  if (!['erfasst', 'nicht'].includes(e.status)) f.status = 'Bitte wählen, ob das Bauteil angeboten wird.';
  if (e.status === 'nicht' && !feld(e.grund)) f.grund = 'Bitte den Grund eintragen, warum das Bauteil nicht mehr angeboten wird.';
  if (feld(e.grund).length > 200) f.grund = 'Höchstens 200 Zeichen.';
  return f;
}
export function angebotAenderung(e, { at }) {
  return { menge: zahl(e.menge), verfuegbarAb: feld(e.verfuegbarAb) || null, verfuegbarBis: feld(e.verfuegbarBis) || null, zustand: feld(e.zustand) || null, zustandText: feld(e.zustandText), status: e.status === 'nicht' ? 'nicht' : null, grund: e.status === 'nicht' ? feld(e.grund) : '', geaendertAm: at, von: 'browser' };
}
// Wendet die gespeicherte Änderung auf ein Bauteil an (in zustand.baueDaten). Der Status „nicht“ überlagert den bisherigen Status; sonst bleibt er.
export function angebotAnwenden(b, a) {
  if (!a) return b;
  const neu = { ...b, menge: a.menge, verfuegbarAb: a.verfuegbarAb, verfuegbarBis: a.verfuegbarBis, zustand: a.zustand, zustandText: a.zustandText, geaendertAm: a.geaendertAm, angebotGeaendert: true };
  // „wird angeboten“ hebt einen Status „nicht verfügbar“ auf (eigene Eingabe, im Verlauf vermerkt); sonst bleibt der bisherige Status.
  if (a.status === 'nicht') { neu.status = 'nicht'; neu.grund = a.grund; } else if (b.status === 'nicht') { neu.status = 'erfasst'; neu.grund = ''; }
  neu.verlauf = [...(b.verlauf || []), { at: a.geaendertAm, von: a.von || 'browser', text: `Angebot geändert: Menge ${String(a.menge).replace('.', ',')} ${GRUPPEN[b.gruppe]?.einheit || ''}, verfügbar ${a.verfuegbarAb ? `ab ${datum(a.verfuegbarAb)}` : 'offen'}${a.verfuegbarBis ? ` bis ${datum(a.verfuegbarBis)}` : ''}${a.status === 'nicht' ? `, nicht mehr angeboten (${a.grund})` : b.status === 'nicht' ? ', wieder angeboten' : ''}.` }];
  return neu;
}

// Datum der letzten Änderung an einem Bauteil über alle Einträge (Erfassung, Verlauf, Angebot, Vorgänge, Interesse, Anfragen, Verkauf).
export function letzteAenderung(ctx, b) {
  const k = bauteilKey(b);
  const zeiten = [b.erfassung?.am, b.geaendertAm, ...(b.verlauf || []).map((v) => v.at), ...(ctx.ereignisse || []).filter((x) => x.bauteil === k).map((x) => x.at),
    ...interessenFuerBauteil(ctx, b).map((i) => i.zurueckAm || i.at), ...anfragenFuerBauteil(ctx, b).map((a) => a.geaendert), verkaufVon(ctx, b)?.at]
    .filter((t) => typeof t === 'string' && t && minuten(t) <= minuten(ctx.at));
  return zeiten.sort((x, y) => minuten(y) - minuten(x))[0] || null;
}
