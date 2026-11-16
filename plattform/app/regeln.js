// Reine Fachfunktionen der Plattform: kein DOM, kein Speicher, keine Systemuhr.
// Die geprüfte Türregel (prototype/dist/door-rules.mjs) wird als Modul R übergeben und nicht verändert.
import { GRUPPEN, PERSONEN } from './daten.js';
import { minuten, bis, istDatum, zeit, ausMinuten } from './zeit.js';
import { vorgangStatus, naechsterVorgangsschritt, aktiverVorgang, uebergebenerVorgang } from './vorgang.js';

export const schluessel = (projekt, id) => `${projekt}:${id}`;
export const rolleKey = (role) => Object.keys(PERSONEN).find((k) => PERSONEN[k].rolle === role) || 'planung';
const hundertstel = (v) => Math.round(v * 100);
export const ZAHL = /^\d+([.,]\d{1,2})?$/;

// ---------- Werte ----------
// Eingabe eines Werts durch eine Person: Maße gelten als gemessen, Auswahl und Text als bestätigt.
export function wertAusEingabe(feld, eingabe, quelle = 'Eingabe') {
  const roh = String(eingabe ?? '').trim();
  if (roh === '') return { wert: null, status: 'fehlt', quelle: '' };
  if (feld.art === 'mass') {
    if (!ZAHL.test(roh)) return { fehler: `${feld.label}: bitte eine Zahl in ${feld.einheit} mit höchstens zwei Nachkommastellen.` };
    const zahl = Number(roh.replace(',', '.'));
    if (!(zahl > 0)) return { fehler: `${feld.label}: Wert muss größer als 0 sein.` };
    return { wert: zahl, status: 'gemessen', quelle };
  }
  return { wert: roh, status: 'bestaetigt', quelle };
}

export function wertText(feld, w) {
  if (!w || w.wert === null || w.wert === undefined || w.wert === '') return '–';
  if (feld?.art === 'mass') return `${String(w.wert).replace('.', ',')} ${feld.einheit}`;
  return String(w.wert);
}

// ---------- Türregel je Zielöffnung ----------
export function anforderungTuer(R, z) {
  if (z.geprueft && z.id === R.REQUIREMENT.target) return R.REQUIREMENT;
  return { target: z.id, sheet: z.sheet, reference: `Rohbauöffnungsbreite ${z.id}, Messstelle laut ${z.sheet}`, measuringPoint: z.messstelle, origin: z.herkunft, minMm: z.minMm, maxMm: z.maxMm, unit: 'mm' };
}
export const fristenTuer = (z) => ({ measureDeadline: z.measureDeadline, replaceDeadline: z.replaceDeadline });

// Türdemo: Beispielaufmaß, das rechtzeitig vor der Aufmaßfrist eingeht, und die Projektzeit, ab der es sichtbar ist.
// B-02 nutzt das geprüfte Beispiel aus Rev. 2 (Eingang 18.11., 15:00). Andere Öffnungen: Eingang zur Projektzeit,
// liegt diese nach der Frist, eine Stunde vor der Frist. Die Projektzeit springt nur vor, nie zurück.
export function beispielAufmassRechtzeitig(R, z, at, zeiten = []) {
  const req = anforderungTuer(R, z);
  let aufmass;
  if (req === R.REQUIREMENT) aufmass = { ...R.SAMPLE_MEASUREMENT };
  else {
    const eingang = minuten(at) <= minuten(z.measureDeadline) ? at : ausMinuten(minuten(z.measureDeadline) - 60);
    aufmass = { valueText: String(Math.round((z.minMm + z.maxMm) / 2)), unit: 'mm', reference: req.reference, status: 'gemessen', source: 'fiktive Aufmaßnotiz', measuredOn: eingang.slice(0, 10), receivedAt: eingang };
  }
  const ab = minuten(aufmass.receivedAt);
  const neueZeit = minuten(at) >= ab ? at : (zeiten.find((x) => minuten(x.at) >= ab)?.at ?? aufmass.receivedAt);
  return { aufmass, at: neueZeit };
}

// ---------- Doppelboden je Bedarf (Entwurfsregel, nicht geprüft) ----------
// rasterIst zählt nur, wenn der Wert gemessen oder bestätigt ist; ein bloßer Vorschlag kommt als rasterVorschlag.
export function bewerteBoden({ bedarf, flaecheM2, rasterIst, rasterVorschlag = '', beschaedigtRoh, hoeheAm, lastAm, at }) {
  const roh = String(beschaedigtRoh ?? '').trim();
  const beschaedigt = ZAHL.test(roh) ? hundertstel(Number(roh.replace(',', '.'))) / 100 : null;
  const beschaedigtGueltig = beschaedigt !== null && beschaedigt <= flaecheM2;
  const beschaedigtFehler = beschaedigtGueltig ? '' : roh === '' ? `Angabe fehlt. Bitte eine Zahl zwischen 0 und ${flaecheM2} eingeben.` : `Bitte eine Zahl zwischen 0 und ${flaecheM2} mit höchstens zwei Nachkommastellen eingeben.`;
  const verwendbar = beschaedigtGueltig ? (hundertstel(flaecheM2) - hundertstel(beschaedigt)) / 100 : null;
  const bedarfM2 = Math.round(bedarf.bedarfM2 * (100 + bedarf.reserveProzent)) / 100;
  const hoehe = bis(hoeheAm, at) ? hoeheAm : null;
  const last = bis(lastAm, at) ? lastAm : null;
  const nw = bedarf.nachweisWerte;
  const sollMenge = `${zahlText(bedarfM2)} m² (${bedarf.bedarfM2} m² + ${bedarf.reserveProzent} % Reserve)`;
  // Deckung: Auch ohne jeden Schaden ist höchstens die erfasste Fläche verwendbar. Reicht schon sie nicht,
  // ist der Bedarf sicher nicht vollständig gedeckt, unabhängig von der noch offenen Schadfläche.
  const hoechstens = verwendbar ?? flaecheM2;
  const fehlt = Math.max(0, hundertstel(bedarfM2) - hundertstel(hoechstens)) / 100;
  const deckung = hundertstel(hoechstens) < hundertstel(bedarfM2)
    ? { key: 'teil', label: 'Bedarf nicht vollständig gedeckt', ton: 'crit', hoechstens, fehlt, schadenOffen: verwendbar === null,
      text: `${verwendbar === null ? 'Höchstens' : 'Verwendbar sind'} ${zahlText(hoechstens)} m², Bedarf ${sollMenge}. Es fehlen ${verwendbar === null ? 'mindestens ' : ''}${zahlText(fehlt)} m².${verwendbar === null ? ' Die beschädigte Fläche ist noch unbekannt und kann die Lücke nur vergrößern.' : ''}` }
    : verwendbar === null
      ? { key: 'offen', label: 'Deckung offen', ton: 'warn', hoechstens, fehlt: 0, schadenOffen: true, text: `Erfasst sind ${zahlText(flaecheM2)} m², Bedarf ${sollMenge}. Ob es reicht, hängt von der beschädigten Fläche ab.` }
      : { key: 'voll', label: 'Bedarf gedeckt', ton: 'ok', hoechstens, fehlt: 0, schadenOffen: false, text: `Verwendbar sind ${zahlText(verwendbar)} m², Bedarf ${sollMenge}. Überschuss ${zahlText((hundertstel(verwendbar) - hundertstel(bedarfM2)) / 100)} m².` };
  const k = (key, name, soll, ist, befund, ton, weg) => ({ key, name, soll, ist, befund, ton, weg });
  const kriterien = [
    rasterIst === bedarf.raster ? k('raster', 'Rastermaß', bedarf.raster, `${rasterIst}`, 'erfüllt', 'ok', 'Regel (Entwurf)')
      : rasterIst ? k('raster', 'Rastermaß', bedarf.raster, rasterIst, 'verfehlt', 'crit', 'Regel (Entwurf)')
        : k('raster', 'Rastermaß', bedarf.raster, rasterVorschlag ? `${rasterVorschlag} (nur vorgeschlagen)` : 'fehlt', rasterVorschlag ? 'offen: Vorschlag prüfen' : 'offen: Angabe fehlt', 'warn', 'Regel (Entwurf)'),
    deckung.key === 'teil' ? k('menge', 'Menge', sollMenge, verwendbar === null ? `höchstens ${zahlText(flaecheM2)} m², beschädigte Fläche unbekannt` : `${zahlText(verwendbar)} m² verwendbar`, `Bedarf nicht vollständig gedeckt, ${verwendbar === null ? 'mindestens ' : ''}${zahlText(fehlt)} m² fehlen`, 'crit', 'Regel (Entwurf)')
      : deckung.key === 'offen' ? k('menge', 'Menge', sollMenge, 'beschädigte Fläche fehlt oder ist ungültig', 'offen: Angabe prüfen', 'warn', 'Regel (Entwurf)')
        : k('menge', 'Menge', sollMenge, `${zahlText(verwendbar)} m² verwendbar`, `erfüllt, ${zahlText((hundertstel(verwendbar) - hundertstel(bedarfM2)) / 100)} m² Überschuss`, 'ok', 'Regel (Entwurf)'),
    !hoehe ? k('hoehe', 'Aufbauhöhe', `${bedarf.aufbauhoeheMm} mm`, 'Verstellbereich der Stützen unbekannt', 'offen: Nachweis fehlt', 'warn', 'Nachweis')
      : bedarf.aufbauhoeheMm >= nw.verstellVonMm && bedarf.aufbauhoeheMm <= nw.verstellBisMm ? k('hoehe', 'Aufbauhöhe', `${bedarf.aufbauhoeheMm} mm`, `Verstellbereich ${nw.verstellVonMm} bis ${nw.verstellBisMm} mm (${nw.quelle})`, 'im Verstellbereich', 'ok', 'Nachweis')
        : k('hoehe', 'Aufbauhöhe', `${bedarf.aufbauhoeheMm} mm`, `Verstellbereich ${nw.verstellVonMm} bis ${nw.verstellBisMm} mm (${nw.quelle})`, 'außerhalb des Verstellbereichs', 'crit', 'Nachweis'),
    last ? k('last', 'Tragfähigkeit', `Punktlast ${bedarf.punktlastKn} kN`, 'Herstellernachweis liegt vor (fiktiv)', 'Bewertung durch Fachprüfung', 'info', 'Fachprüfung')
      : k('last', 'Tragfähigkeit', `Punktlast ${bedarf.punktlastKn} kN`, 'kein Nachweis, kein Typenschild', 'offen: Nachweis fehlt', 'warn', 'Fachprüfung'),
  ];
  const nachweiseDa = Boolean(hoehe && last);
  const letzter = nachweiseDa ? (minuten(hoehe) > minuten(last) ? hoehe : last) : null;
  const fr = bedarf.fristen;
  const nachweis = nachweiseDa
    ? (minuten(letzter) <= minuten(fr.nachweis) ? { key: 'onTime', label: 'Nachweise rechtzeitig eingegangen', ton: 'ok' } : { key: 'late', label: 'Nachweise verspätet eingegangen', ton: 'crit' })
    : (minuten(at) <= minuten(fr.nachweis) ? { key: 'pending', label: 'Nachweise ausstehend', ton: 'warn' } : { key: 'overdue', label: 'Nachweise überfällig', ton: 'crit' });
  const ersatzOffen = minuten(at) <= minuten(fr.ersatz);
  const ersatz = ersatzOffen ? { key: 'open', label: 'Entscheidungsfrist offen', ton: 'ok' } : { key: 'expired', label: 'Entscheidungsfrist verstrichen', ton: 'crit' };
  const widerspruch = minuten(fr.nachweis) > minuten(fr.ersatz);
  const verfehlt = kriterien.filter((x) => x.ton === 'crit');
  const pruefbarErfuellt = ['raster', 'menge', 'hoehe'].every((key) => kriterien.find((x) => x.key === key).ton === 'ok');
  const aufgaben = [];
  const add = (rank, text, rolle, grund) => aufgaben.push({ rank, text, rolle, grund });
  if (!ersatzOffen) add(1, 'Bestellstatus klären', 'planung', 'Erst feststellen, ob ein neuer Doppelboden bereits bestellt wurde und welche Optionen noch offenstehen.');
  if (widerspruch) add(2, 'Termine klären', 'planung', 'Die Nachweisfrist liegt nach der Ersatzentscheidung.');
  // Reicht die Menge sicher nicht, ist das der erste fachliche Punkt: Teilmenge oder weitere Quelle.
  if (deckung.key === 'teil') add(3, 'Teilmenge einplanen oder weitere Quelle suchen', 'planung', `Die erfassten ${zahlText(hoechstens)} m² decken den Bedarf nur zum Teil. Entweder als Teilmenge einplanen und den Rest anders beschaffen oder eine weitere Quelle für ${deckung.schadenOffen ? 'mindestens ' : ''}${zahlText(fehlt)} m² suchen.`);
  const andere = verfehlt.filter((x) => x.key !== 'menge');
  if (ersatzOffen && andere.length) add(3, 'Anpassung fachlich klären oder Ersatzweg vorbereiten', 'planung', `Verfehlt: ${andere.map((x) => x.name).join(', ')}. Die Ersatzentscheidung steht noch aus.`);
  if (ersatzOffen && (nachweis.key === 'overdue' || nachweis.key === 'late')) add(4, 'Prüfvorlauf klären', 'planung', 'Die Nachweise sind überfällig oder verspätet eingegangen, die Ersatzentscheidung steht noch aus.');
  if (!nachweiseDa) add(5, 'Herstellerangaben zu Stützenhöhe und Tragfähigkeit beschaffen oder Probeausbau veranlassen', 'montage', 'Ohne Nachweise bleiben Aufbauhöhe und Tragfähigkeit offen.');
  if (verwendbar === null) add(5, 'Beschädigte Fläche aus der Stichprobe prüfen und gültig angeben', 'bauleitung', 'Ohne gültige Angabe bleibt die verwendbare Menge offen.');
  if (!rasterIst) add(5, rasterVorschlag ? 'Rastermaß vor Ort prüfen und bestätigen' : 'Rastermaß vor Ort feststellen', 'bauleitung', 'Ein vorgeschlagenes oder fehlendes Rastermaß zählt nicht.');
  if (nachweiseDa && nachweis.key === 'onTime' && ersatzOffen && pruefbarErfuellt && !widerspruch) add(6, 'Variante zur fachlichen Prüfung vorlegen', 'planung', 'Rastermaß, Menge und Aufbauhöhe passen, die Nachweise liegen rechtzeitig vor. Weitere technische Anforderungen bleiben offen.');
  aufgaben.sort((a, b) => a.rank - b.rank);
  return { kriterien, deckung, nachweis, ersatz, verwendbar, bedarfM2, beschaedigtGueltig, beschaedigtFehler, haupt: aufgaben[0], weiter: aufgaben.slice(1), widerspruch, hoehe, last };
}
export const zahlText = (n) => Number(n).toLocaleString('de-DE', { maximumFractionDigits: 2 });

// ---------- Abgleich mit einem Bedarf ohne eigene Regel (Entwurf) ----------
export function bewerteEinfach({ bauteil, bedarf, frist, at }) {
  const g = GRUPPEN[bauteil.gruppe];
  const fehlend = (g.felder || []).filter((f) => !bauteil.werte?.[f.key] || bauteil.werte[f.key].status === 'fehlt').map((f) => f.label);
  const vorgeschlagen = (g.felder || []).filter((f) => bauteil.werte?.[f.key]?.status === 'vorgeschlagen').map((f) => f.label);
  const aufgaben = [];
  if (frist && minuten(at) > minuten(frist)) aufgaben.push({ rank: 1, text: 'Bestellstatus beim Bedarfsträger klären', rolle: 'planung', grund: 'Die Frist für diesen Bedarf ist verstrichen.' });
  if (fehlend.length) aufgaben.push({ rank: 5, text: `Fehlende Angaben ergänzen: ${fehlend.join(', ')}`, rolle: 'montage', grund: 'Ohne diese Angaben ist kein Abgleich mit dem Bedarf möglich.' });
  if (vorgeschlagen.length) aufgaben.push({ rank: 5, text: `Vorschläge prüfen oder messen: ${vorgeschlagen.join(', ')}`, rolle: 'montage', grund: 'Vorgeschlagene Werte sind nicht geprüft.' });
  aufgaben.push({ rank: 6, text: `Abgleich mit Bedarf ${bedarf.id} fachlich prüfen`, rolle: 'planung', grund: `Bedarf: ${bedarf.titel}${bedarf.menge ? `, ${bedarf.menge} ${bedarf.einheit}` : ''}. Den Bedarfsträger informiert Ihr Team außerhalb der Plattform.` });
  aufgaben.sort((a, b) => a.rank - b.rank);
  return { haupt: aufgaben[0], weiter: aufgaben.slice(1), fehlend, vorgeschlagen };
}

// ---------- Lage einer Entscheidung ----------
// ctx: { R, at, daten: { projekte, bauteile, zieloeffnungen, bedarfe }, ereignisse, ezustand }
export function zielVon(ctx, e) {
  if (e.ziel.art === 'zieloeffnung') return ctx.daten.zieloeffnungen.find((z) => z.projekt === (e.ziel.projekt || e.projekt) && z.id === e.ziel.id);
  return ctx.daten.bedarfe.find((b) => b.projekt === (e.ziel.projekt || e.projekt) && b.id === e.ziel.id);
}
export const bauteilVon = (ctx, e) => ctx.daten.bauteile.find((b) => b.projekt === e.projekt && b.id === e.bauteil);
export const projektVon = (ctx, kurz) => ctx.daten.projekte.find((p) => p.kurz === kurz);

export function vorlageVon(ctx, e) {
  return ctx.ereignisse.filter((x) => x.entscheidung === schluessel(e.projekt, e.id) && x.art === 'vorlage' && bis(x.at, ctx.at))
    .sort((x, y) => minuten(x.at) - minuten(y.at)).pop() || null;
}

const tonAufmass = (key) => ({ pending: 'warn', overdue: 'crit', onTime: 'ok', late: 'crit' }[key] || 'neutral');

export function lageRegel(ctx, e) {
  const z = zielVon(ctx, e); const b = bauteilVon(ctx, e); const zs = ctx.ezustand[schluessel(e.projekt, e.id)] || {};
  if (e.regel === 'tuer') {
    const req = anforderungTuer(ctx.R, z); const dl = fristenTuer(z);
    const r = ctx.R.evaluateDoor({ requirement: req, measurement: zs.aufmass || ctx.R.emptyMeasurement(), deadlines: dl, at: ctx.at });
    return {
      r, z, b, req, regelText: z.geprueft ? 'Regel geprüft · CF-UMBAU-01 Rev. 2' : 'Türregel aus CF-UMBAU-01, Zielöffnung fiktiv',
      geprueft: Boolean(z.geprueft),
      haupt: { rank: r.mainStep.rank, text: r.mainStep.text, rolle: rolleKey(r.mainStep.role), grund: r.mainStep.reason },
      weiter: r.stillOpen.map((s) => ({ text: s.text, rolle: rolleKey(s.role) })),
      fristen: [
        { name: 'Aufmaßfrist', at: dl.measureDeadline, rolle: 'montage', status: r.measureStatus.label, ton: tonAufmass(r.measureStatus.key) },
        { name: 'Ersatzentscheidung', at: dl.replaceDeadline, rolle: 'planung', status: r.replaceStatus.label, ton: r.replaceStatus.key === 'open' ? 'ok' : 'crit' },
      ],
    };
  }
  if (e.regel === 'boden') {
    // Die Entwurfsregel nimmt nur gemessene oder von einer Person bestätigte Werte; Vorschläge und Lücken bleiben offen.
    const geprueft = (w) => Boolean(w) && (w.status === 'gemessen' || w.status === 'bestaetigt');
    const raster = b.werte?.raster;
    const roh = zs.beschaedigtRoh ?? (geprueft(b.werte?.beschaedigt) ? String(b.werte.beschaedigt.wert ?? '') : '');
    const r = bewerteBoden({ bedarf: z, flaecheM2: b.menge, rasterIst: geprueft(raster) ? raster.wert : '', rasterVorschlag: raster?.status === 'vorgeschlagen' ? raster.wert : '', beschaedigtRoh: roh, hoeheAm: zs.hoeheAm, lastAm: zs.lastAm, at: ctx.at });
    return {
      r, z, b, regelText: 'Regel im Entwurf · nicht geprüft', geprueft: false, haupt: r.haupt, weiter: r.weiter,
      fristen: [
        { name: 'Nachweisfrist', at: z.fristen.nachweis, rolle: 'montage', status: r.nachweis.label, ton: r.nachweis.ton },
        { name: 'Ersatzentscheidung', at: z.fristen.ersatz, rolle: 'planung', status: r.ersatz.label, ton: r.ersatz.ton },
      ],
    };
  }
  const p = projektVon(ctx, z.projekt);
  const frist = p?.entscheidungBis || null;
  const r = bewerteEinfach({ bauteil: b, bedarf: z, frist, at: ctx.at });
  return {
    r, z, b, regelText: 'Abgleich ohne eigene Regel · Entwurf', geprueft: false, haupt: r.haupt, weiter: r.weiter,
    fristen: frist ? [{ name: `Entscheidung ${z.projekt}`, at: frist, rolle: 'planung', status: minuten(ctx.at) > minuten(frist) ? 'Frist verstrichen' : 'Frist offen', ton: minuten(ctx.at) > minuten(frist) ? 'crit' : 'ok' }] : [],
  };
}

// Ist die Variante vorgelegt und bleibt die Regel bei Rang 6, wartet die Entscheidung auf die Fachprüfung.
export function lage(ctx, e) {
  const l = lageRegel(ctx, e); const v = vorlageVon(ctx, e);
  if (v && l.haupt.rank === 6) return { ...l, vorlage: v, haupt: { rank: 6, wartet: true, text: 'Rückmeldung der Fachprüfung abwarten', rolle: 'fach', grund: `Die Variante liegt seit ${zeit(v.at)} der Fachprüfung vor. Weitere technische Anforderungen bleiben offen.` } };
  return { ...l, vorlage: v };
}
export const tonVon = (h) => (h.wartet ? 'info' : h.rank <= 2 ? 'crit' : h.rank <= 4 ? 'warn' : h.rank === 5 ? 'info' : 'ok');
export function naechsteFrist(l, at) { return l.fristen.filter((f) => minuten(f.at) >= minuten(at)).sort((x, y) => minuten(x.at) - minuten(y.at))[0] || null; }

// Lage mit Vorgangsstatus: Bis zum Fachergebnis gilt die bisherige Regel (Tür, Boden, Abgleich; „wartet“ nach Vorlage
// oder Prüfbitte). Danach zeigt der Vorgang den nächsten Schritt (Vormerkung, Übergabe planen, Übergabe durchführen).
export function lageVorgang(ctx, e) {
  const l = lage(ctx, e); const st = vorgangStatus(ctx, e);
  const schritt = naechsterVorgangsschritt(ctx, e);
  if (schritt) {
    const fristen = schritt.frist ? [{ name: schritt.fristName, at: schritt.frist, rolle: schritt.rolle || 'planung', status: schritt.ton === 'crit' || schritt.rank <= 4 ? 'überfällig oder abgelaufen' : 'offen', ton: schritt.ton === 'crit' || schritt.rank <= 4 ? 'crit' : 'ok' }] : [];
    return { ...l, vorgang: st, haupt: { rank: schritt.rank, text: schritt.text, rolle: schritt.rolle, grund: schritt.grund }, weiter: [], fristen };
  }
  if (st.key === 'pruefbitte' && l.haupt.rank === 6 && !l.haupt.wartet) {
    return { ...l, vorgang: st, haupt: { rank: 6, wartet: true, text: 'Rückmeldung der Fachprüfung abwarten', rolle: 'fach', grund: `Die Prüfbitte liegt seit ${zeit(st.pruefbitte.at)} der Fachprüfung vor. Weitere technische Anforderungen bleiben offen.` } };
  }
  return { ...l, vorgang: st };
}

// Offene Entscheidungen nach Handlungsdruck: wartende zuletzt, dann Rang des nächsten Schritts, dann nächste Frist.
// Ohne kommende Frist gilt die zuletzt verstrichene, damit Überfälliges sichtbar bleibt. Beendete Vorgänge zählen nicht.
export function offeneEntscheidungen(ctx, anzahl = 2) {
  const alle = ctx.daten.entscheidungen.filter((e) => vorgangStatus(ctx, e).aktiv).map((e) => {
    const l = lageVorgang(ctx, e);
    const frist = naechsteFrist(l, ctx.at) || [...l.fristen].sort((x, y) => minuten(x.at) - minuten(y.at)).pop() || null;
    return { e, l, frist };
  });
  const kommend = (x) => (x.frist && minuten(x.frist.at) >= minuten(ctx.at) ? minuten(x.frist.at) : Number.MAX_SAFE_INTEGER);
  alle.sort((a, b) => (Number(Boolean(a.l.haupt.wartet)) - Number(Boolean(b.l.haupt.wartet))) || (a.l.haupt.rank - b.l.haupt.rank) || (kommend(a) - kommend(b)));
  return { liste: alle.slice(0, anzahl), gesamt: alle.length };
}
// Der aktive Vorgang des Bauteils; beendete Vorgänge (übergeben, ungeeignet, abgebrochen) geben es frei.
export const entscheidungFuer = (ctx, b) => aktiverVorgang(ctx, b.projekt, b.id);

export function bauteilStatus(ctx, b) {
  const e = entscheidungFuer(ctx, b);
  if (e) {
    const st = vorgangStatus(ctx, e);
    if (st.key === 'vorgemerkt' || st.key === 'uebergabe') return 'vorgemerkt';
    if (lageVorgang(ctx, e).haupt.wartet) return 'fachpruefung';
    if (b.status === 'erfasst' || b.status === 'bewertung') return 'entscheidung';
  } else if (uebergebenerVorgang(ctx, b.projekt, b.id)) return 'uebergeben';
  return b.status;
}

// ---------- Nächste Handlung und offene Nachweise je Bauteil ----------
export function naechsteHandlung(ctx, b) {
  const p = projektVon(ctx, b.projekt);
  if (b.status === 'nicht') return { text: 'Keine Wiederverwendung', rolle: null, grund: b.grund, ton: 'neutral', frist: null };
  if (b.status === 'vorgemerkt') return { text: b.ziel ? 'Keine Handlung nötig' : 'Ausbau und Einlagerung planen', rolle: b.ziel ? null : 'bauleitung', grund: b.ziel ? `Bauteil ${b.ziel}.` : '', ton: 'ok', frist: null };
  const e = entscheidungFuer(ctx, b);
  if (e) {
    const l = lageVorgang(ctx, e); const f = naechsteFrist(l, ctx.at);
    return { text: l.haupt.text, rolle: l.haupt.rolle, grund: l.haupt.grund, ton: tonVon(l.haupt), frist: f ? f.at : null, fristName: f ? f.name : '', entscheidung: e, wartet: l.haupt.wartet };
  }
  const fertig = uebergebenerVorgang(ctx, b.projekt, b.id);
  if (fertig) { const s = naechsterVorgangsschritt(ctx, fertig); return { text: s.text, rolle: null, grund: s.grund, ton: 'ok', frist: null, fristName: '', entscheidung: fertig }; }
  if (b.naechste) return { ...b.naechste, ton: 'warn', frist: p?.entscheidungBis || null, fristName: 'Entscheidung vor Ausbau' };
  const g = GRUPPEN[b.gruppe];
  const text = g.zuordnung === 'zieloeffnung' ? 'Zielöffnung oder Bedarf zuordnen' : 'Bedarf zuordnen';
  return { text, rolle: 'planung', grund: 'Ohne Zielort lässt sich keine Wiederverwendung prüfen.', ton: 'warn', frist: p?.entscheidungBis || null, fristName: 'Entscheidung vor Ausbau', aktion: 'zuordnen' };
}

export function offeneNachweise(ctx, b) {
  const g = GRUPPEN[b.gruppe]; const liste = [];
  if (b.status === 'nicht') return liste;
  for (const f of g.felder || []) {
    const w = b.werte?.[f.key];
    if (!w || w.status === 'fehlt') liste.push({ text: `${f.label} fehlt`, rolle: f.art === 'mass' ? 'montage' : 'bauleitung', art: 'wert' });
    else if (w.status === 'vorgeschlagen') liste.push({ text: `${f.label}: Vorschlag prüfen${f.art === 'mass' ? ' oder messen' : ''}`, rolle: f.art === 'mass' ? 'montage' : 'bauleitung', art: 'wert' });
  }
  if (b.erfassung?.art === 'Mobile Erfassung' && !b.foto) liste.push({ text: 'Foto fehlt', rolle: 'bauleitung', art: 'nachweis' });
  else if (b.foto?.nichtGespeichert && !b.foto.daten) liste.push({ text: 'Foto nicht gespeichert (Browserspeicher voll), neu aufnehmen', rolle: 'bauleitung', art: 'nachweis' });
  for (const o of b.offen || []) liste.push({ ...o, art: 'nachweis' });
  const e = entscheidungFuer(ctx, b);
  if (e && b.status !== 'vorgemerkt') {
    const l = lage(ctx, e);
    if (e.regel === 'tuer' && !l.r.usable) liste.push({ text: `Aufmaß Rohbauöffnung ${l.z.id} (${l.r.width.reasons[0] || 'nicht verwertbar'})`, rolle: 'montage', frist: l.z.measureDeadline, art: 'regel' });
    if (e.regel === 'boden') {
      if (!l.r.hoehe) liste.push({ text: 'Verstellbereich der Stützen nachweisen', rolle: 'montage', frist: l.z.fristen.nachweis, art: 'regel' });
      if (!l.r.last) liste.push({ text: 'Tragfähigkeit nachweisen (Herstellerangabe)', rolle: 'montage', frist: l.z.fristen.nachweis, art: 'regel' });
    }
  }
  return liste;
}

// Mögliche Ziele für ein Bauteil: Zielöffnungen im Projekt (Türen) und Bedarfe derselben Gruppe in der Region.
export function moeglicheZiele(ctx, b) {
  // Nur aktive Vorgänge belegen ein Ziel. Ein für dieses Bauteil mit „ungeeignet“ beendetes Ziel bleibt gesperrt.
  const belegt = new Set();
  for (const e of ctx.daten.entscheidungen) {
    const st = vorgangStatus(ctx, e); const k = `${e.ziel.art}:${e.ziel.projekt || e.projekt}:${e.ziel.id}`;
    if (st.aktiv || (st.key === 'ungeeignet' && e.projekt === b.projekt && e.bauteil === b.id)) belegt.add(k);
  }
  const offen = (art, p, id) => !belegt.has(`${art}:${p}:${id}`);
  const oeffnungen = GRUPPEN[b.gruppe].zuordnung === 'zieloeffnung'
    ? ctx.daten.zieloeffnungen.filter((z) => z.projekt === b.projekt && offen('zieloeffnung', z.projekt, z.id)) : [];
  const bedarfe = ctx.daten.bedarfe.filter((d) => d.gruppe === b.gruppe && (d.gruppe !== 'boden' || d.projekt === b.projekt) && offen('bedarf', d.projekt, d.id));
  return { oeffnungen, bedarfe };
}
export function neueEntscheidung(ctx, b, ziel) {
  const nr = Math.max(0, ...ctx.daten.entscheidungen.filter((e) => e.projekt === b.projekt).map((e) => Number(e.id.slice(2)))) + 1;
  const regel = ziel.art === 'zieloeffnung' ? 'tuer' : (b.gruppe === 'boden' ? 'boden' : 'einfach');
  return { projekt: b.projekt, id: `E-${String(nr).padStart(2, '0')}`, bauteil: b.id, ziel: { art: ziel.art, id: ziel.id, projekt: ziel.projekt }, regel, angelegt: ctx.at };
}

// ---------- Mobile Erfassung ----------
// Simulierte Erkennung: Vorschlag allein aus dem Seitenverhältnis des Fotos, keine Bildanalyse.
export function erkennungSimulation({ breite, hoehe }) {
  const hoch = hoehe > breite * 1.15;
  const gruppe = hoch ? 'tuer' : 'boden';
  return { gruppe, grund: hoch ? 'Foto im Hochformat' : 'Foto im Querformat oder quadratisch', vorschlaege: GRUPPEN[gruppe].vorschlag };
}

export function naechsteBauteilId(bauteile, projekt, gruppe) {
  const prefix = GRUPPEN[gruppe].prefix;
  const nummern = bauteile.filter((b) => b.projekt === projekt && b.id.startsWith(`${prefix}-`)).map((b) => Number(b.id.slice(prefix.length + 1))).filter(Number.isFinite);
  return `${prefix}-${String(Math.max(0, ...nummern) + 1).padStart(2, '0')}`;
}

// Prüft den Erfassungsentwurf. entwurf.werte: { key: { eingabe, status, quelle } }
export function pruefeErfassung(entwurf) {
  const fehler = {};
  if (!entwurf.projekt || !entwurf.raum) fehler.ort = 'Bitte Projekt und Raum wählen.';
  if (!entwurf.gruppe || !GRUPPEN[entwurf.gruppe]?.erfassbar) fehler.gruppe = 'Bitte eine Bauteilgruppe wählen.';
  const g = GRUPPEN[entwurf.gruppe];
  if (g) {
    for (const f of g.felder) {
      const w = entwurf.werte?.[f.key];
      if (w && (w.status === 'gemessen' || w.status === 'bestaetigt') && f.art === 'mass') {
        const r = wertAusEingabe(f, w.eingabe);
        if (r.fehler) fehler[`wert-${f.key}`] = r.fehler;
      }
    }
    const menge = String(entwurf.menge ?? '').trim();
    if (!ZAHL.test(menge) || !(Number(menge.replace(',', '.')) > 0)) fehler.menge = `Bitte eine Menge größer als 0 in ${g.einheit} eingeben.`;
  }
  if (entwurf.verfuegbarAb && !istDatum(entwurf.verfuegbarAb)) fehler.verfuegbarAb = 'Bitte ein gültiges Datum eingeben.';
  return fehler;
}

export function bauteilAusErfassung(entwurf, { id, at, von = 'browser', etage }) {
  const g = GRUPPEN[entwurf.gruppe];
  const werte = {};
  for (const f of g.felder) {
    const w = entwurf.werte?.[f.key];
    if (!w || w.status === 'fehlt') { werte[f.key] = { wert: null, status: 'fehlt', quelle: '' }; continue; }
    const wert = f.art === 'mass' ? Number(String(w.eingabe).replace(',', '.')) : String(w.eingabe);
    werte[f.key] = { wert, status: w.status, quelle: w.quelle || 'Mobile Erfassung' };
  }
  const name = entwurf.gruppe === 'sonstig' ? (werte.bezeichnung?.wert || 'Bauteil') : g.einzahl;
  // Kennzeichnung „simulierte Erkennung“ nur, solange ein Wert noch aus der Simulation stammt.
  const ausSimulation = Object.values(werte).some((w) => /Simulation/.test(w.quelle || ''));
  return {
    projekt: entwurf.projekt, id, gruppe: entwurf.gruppe, name, menge: Number(String(entwurf.menge).replace(',', '.')), etage, raum: entwurf.raum,
    werte, zustand: entwurf.zustand || null, zustandText: entwurf.notiz || '', hersteller: 'unbekannt', baujahr: 'unbekannt',
    status: 'erfasst', verfuegbarAb: entwurf.verfuegbarAb || null, foto: entwurf.foto ? { daten: entwurf.foto.daten, breite: entwurf.foto.breite, hoehe: entwurf.foto.hoehe } : null,
    erfassung: { art: 'Mobile Erfassung', am: at, von, erkennung: ausSimulation ? 'Simulation' : null },
    rueckbau: [['Schadstoffverdacht', 'nicht untersucht']],
    nachweise: entwurf.foto ? [{ titel: 'Foto der mobilen Erfassung', art: 'Foto', datum: at, von, stand: 'liegt vor', ton: 'ok' }] : [],
    offen: [], neu: true,
    verlauf: [{ at, von, text: `Mobil erfasst${entwurf.foto ? ' mit Foto' : ' ohne Foto'}${ausSimulation ? ', Vorschläge aus simulierter Erkennung' : ''}.` }],
  };
}


// ---------- Projektradar ----------
export const PRUEFSTATUS = {
  neu: { label: 'ungeprüft', ton: 'neutral' },
  pruefung: { label: 'in Prüfung', ton: 'info' },
  gemeldet: { label: 'gemeldet, Prüfung offen', ton: 'warn' },
  bestaetigt: { label: 'bestätigt', ton: 'ok' },
  verworfen: { label: 'verworfen', ton: 'crit' },
};
const ERLAUBT = { pruefen: ['neu'], bestaetigen: ['pruefung', 'gemeldet'], verwerfen: ['neu', 'pruefung', 'gemeldet'] };
const ZIEL = { pruefen: 'pruefung', bestaetigen: 'bestaetigt', verwerfen: 'verworfen' };
// Fehler kommen je Feld zurück (allgemein, bezirk, notiz), damit die Ansicht sie am richtigen Feld zeigt.
export function radarSchritt(h, aktion, { von, notiz = '', at, bezirk = '' }) {
  if (!h) return { fehler: { allgemein: 'Diesen Hinweis gibt es nicht mehr.' } };
  if (!ERLAUBT[aktion]?.includes(h.status)) return { fehler: { allgemein: `Dieser Schritt ist im Status „${PRUEFSTATUS[h.status]?.label ?? h.status}“ nicht möglich.` } };
  const text = String(notiz).trim();
  const fehler = {};
  if (aktion === 'bestaetigen' && !h.bezirk && !bezirk) fehler.bezirk = 'Bitte den Stadtbezirk festlegen. Ohne Bezirk kann das Projekt nicht auf der Karte stehen.';
  if (aktion === 'bestaetigen' && !text) fehler.notiz = 'Für die Bestätigung ist eine Prüfnotiz nötig.';
  if (aktion === 'verwerfen' && !text) fehler.notiz = 'Bitte den Grund für das Verwerfen angeben.';
  if (Object.keys(fehler).length) return { fehler };
  const neu = { ...h, status: ZIEL[aktion], verlauf: [...(h.verlauf || []), { at, von, aktion, notiz: text }] };
  if (aktion === 'bestaetigen' && !h.bezirk) { neu.bezirk = bezirk; neu.bezirkHinweis = 'bei der Prüfung festgelegt'; }
  return { hinweis: neu };
}
export function pruefeMeldung(m) {
  const fehler = {};
  if (!String(m.titel ?? '').trim()) fehler.titel = 'Bitte einen Projekttitel angeben.';
  if (!m.bezirk) fehler.bezirk = 'Bitte einen Stadtbezirk wählen.';
  if (!m.art) fehler.art = 'Bitte die Art der Maßnahme wählen.';
  if (!String(m.melder ?? '').trim()) fehler.melder = 'Bitte angeben, wer meldet (Rolle oder Organisation).';
  if (!m.einwilligung) fehler.einwilligung = 'Ohne Bestätigung der Angaben kann die Meldung nicht gespeichert werden.';
  return fehler;
}

// ---------- IFC-Vorprüfung (echt, nur Zählung, kein Import) ----------
export function ifcVorpruefung(text) {
  const kopf = String(text).slice(0, 4000);
  if (!/ISO-10303-21/.test(kopf)) return { gueltig: false, fehler: 'Keine IFC-Datei im STEP-Format (Kennung ISO-10303-21 fehlt).' };
  const schema = (kopf.match(/FILE_SCHEMA\s*\(\s*\(\s*'([^']+)'/i) || [])[1] || 'unbekannt';
  // Ein Durchlauf über alle Entitäten. Standardfälle (IFC2x3/IFC4) zählen zur jeweiligen Klasse.
  const anzahl = new Map();
  for (const m of String(text).matchAll(/=\s*(IFC[A-Z]+)\s*\(/gi)) { const n = m[1].toUpperCase(); anzahl.set(n, (anzahl.get(n) || 0) + 1); }
  const z = (...namen) => namen.reduce((s, n) => s + (anzahl.get(n) || 0), 0);
  return { gueltig: true, schema, zaehlung: { Geschosse: z('IFCBUILDINGSTOREY'), Räume: z('IFCSPACE'), Türen: z('IFCDOOR', 'IFCDOORSTANDARDCASE'), Fenster: z('IFCWINDOW', 'IFCWINDOWSTANDARDCASE'), Wände: z('IFCWALL', 'IFCWALLSTANDARDCASE', 'IFCWALLELEMENTEDCASE') } };
}
