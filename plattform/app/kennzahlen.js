// Kennzahlen der Übersicht. Jede Kennzahl liefert die gezählten Einträge mit, damit Zahl und verlinkte Liste übereinstimmen.
// Stichtag H = Projektzeit (ctx.at). Mengen werden nie über Einheiten addiert. Keine CO₂-, Kosten- oder Abfallwerte.
import { GRUPPEN } from './daten.js';
import { minuten } from './zeit.js';
import { offeneNachweise, lage } from './regeln.js';
import { vorgangStatus, VORGANG_STATUS, naechsterVorgangsschritt, aktiverVorgang, uebergebenerVorgang, bedarfBelegt, tagesende } from './vorgang.js';
import { abgleichListe, ERGEBNIS_REIHENFOLGE } from './abgleich.js';

const tagNr = (d) => Math.floor(minuten(`${String(d).slice(0, 10)}T00:00`) / 1440);
const monatVon = (d) => String(d).slice(0, 7);
const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
export const monatLabel = (m) => `${MONATE[Number(m.slice(5, 7)) - 1]} ${m.slice(0, 4)}`;

// Mengen je Einheit; { Stk: 3, lfm: 120 }.
export function mengenNachEinheit(eintraege) {
  const m = {};
  for (const { einheit, menge } of eintraege) if (Number.isFinite(menge) && einheit) m[einheit] = Math.round(((m[einheit] || 0) + menge) * 100) / 100;
  return m;
}
const bauteilMenge = (b) => ({ einheit: GRUPPEN[b.gruppe]?.einheit, menge: Number(b.menge) });
const bedarfMenge = (d) => ({ einheit: d.einheit || GRUPPEN[d.gruppe]?.einheit, menge: Number(d.menge ?? d.bedarfM2) });

// Festes Ziel: gesetztes Ziel oder ein Vorgang ab der Vormerkung.
function festesZiel(ctx, b) {
  if (b.ziel) return true;
  const e = aktiverVorgang(ctx, b.projekt, b.id);
  if (e && ['vorgemerkt', 'uebergabe'].includes(vorgangStatus(ctx, e).key)) return true;
  return Boolean(uebergebenerVorgang(ctx, b.projekt, b.id));
}
export const verfuegbarkeitsKandidaten = (ctx) => ctx.daten.bauteile.filter((b) => b.status !== 'nicht' && b.verfuegbarAb && !festesZiel(ctx, b));

export function kennzahlen(ctx, { horizontTage = 90, kritischTage = 7 } = {}) {
  const H = tagNr(ctx.at);
  const projektVon = (kurz) => ctx.daten.projekte.find((p) => p.kurz === kurz);

  // Bald verfügbar: verfügbar ab zwischen H und H + Horizont (Randtage eingeschlossen).
  const kandidaten = verfuegbarkeitsKandidaten(ctx);
  const bald = kandidaten.filter((b) => tagNr(b.verfuegbarAb) >= H && tagNr(b.verfuegbarAb) <= H + horizontTage)
    .sort((a, b) => a.verfuegbarAb.localeCompare(b.verfuegbarAb) || a.projekt.localeCompare(b.projekt) || a.id.localeCompare(b.id));
  const baldVerfuegbar = { horizontTage, anzahl: bald.length, eintraege: bald, mengen: mengenNachEinheit(bald.map(bauteilMenge)) };

  // Verfügbarkeit im Zeitverlauf: je Monat von „verfügbar ab“, nach Gruppe getrennt. Tabelle dient als Textalternative.
  const monate = new Map();
  for (const b of kandidaten.filter((x) => tagNr(x.verfuegbarAb) >= H)) {
    const m = monatVon(b.verfuegbarAb);
    if (!monate.has(m)) monate.set(m, []);
    monate.get(m).push(b);
  }
  const zeitverlauf = {
    gruppen: [...new Set(kandidaten.map((b) => b.gruppe))],
    monate: [...monate.keys()].sort().map((m) => {
      const eintraege = monate.get(m);
      const nachGruppe = {};
      for (const b of eintraege) nachGruppe[b.gruppe] = (nachGruppe[b.gruppe] || 0) + 1;
      return { monat: m, label: monatLabel(m), anzahl: eintraege.length, nachGruppe, eintraege, mengen: mengenNachEinheit(eintraege.map(bauteilMenge)) };
    }),
  };
  zeitverlauf.anzahl = zeitverlauf.monate.reduce((s, m) => s + m.anzahl, 0);

  // Bedarfe ohne aktiven Vorgang.
  const offeneBedarfe = ctx.daten.bedarfe.filter((d) => !bedarfBelegt(ctx, d.projekt, d.id));
  const bedarfeOffen = { anzahl: offeneBedarfe.length, eintraege: offeneBedarfe, mengen: mengenNachEinheit(offeneBedarfe.map(bedarfMenge)) };

  // Passende Paare nach Ergebnis (Bauteile mit aktivem Vorgang sind in abgleichListe bereits ausgenommen).
  const paare = abgleichListe(ctx);
  const nachErgebnis = {};
  for (const k of ERGEBNIS_REIHENFOLGE) { const l = paare.filter((a) => a.gesamt.key === k); nachErgebnis[k] = { anzahl: l.length, eintraege: l }; }
  // „Paare derselben Gruppe“ zählt alle Ergebnisse; „prüfbar“ nur weiter prüfen und knapp.
  const pruefbarePaare = paare.filter((a) => a.gesamt.key === 'weiter' || a.gesamt.key === 'knapp');
  const passendePaare = { anzahl: paare.length, eintraege: paare, nachErgebnis, pruefbar: pruefbarePaare.length, pruefbarEintraege: pruefbarePaare };

  // Vorgänge je Status (alle, auch beendete; E-01 und E-02 zählen mit).
  const alle = ctx.daten.entscheidungen.map((e) => ({ e, status: vorgangStatus(ctx, e) }));
  const nachStatus = {};
  for (const k of Object.keys(VORGANG_STATUS)) { const l = alle.filter((x) => x.status.key === k).map((x) => x.e); nachStatus[k] = { anzahl: l.length, eintraege: l }; }
  const vorgaenge = { anzahl: alle.length, offen: alle.filter((x) => x.status.aktiv).length, eintraege: alle.map((x) => x.e), nachStatus };

  // Offene Prüfpunkte: Bauteile mit mindestens einem offenen Nachweis, dazu Zahl der Punkte.
  const mitPunkten = ctx.daten.bauteile.map((b) => ({ bauteil: b, offen: offeneNachweise(ctx, b) })).filter((x) => x.offen.length);
  const offenePruefpunkte = { anzahl: mitPunkten.length, punkte: mitPunkten.reduce((s, x) => s + x.offen.length, 0), eintraege: mitPunkten };

  // Zeitkritisch: Fristen offener Vorgänge und Bedarfe zwischen H und H + Tage; Überfälliges (nicht erfüllt) ist gekennzeichnet.
  const jetzt = minuten(ctx.at); const ende = jetzt + kritischTage * 1440;
  const fristen = [];
  for (const e of ctx.daten.entscheidungen) {
    const st = vorgangStatus(ctx, e); if (!st.aktiv) continue;
    const schritt = naechsterVorgangsschritt(ctx, e);
    // Nach dem Fachergebnis ist eine verstrichene Frist überfällig, solange der Vorgang nicht erledigt ist (abgelaufene Vormerkung,
    // Bestellfrist ohne Vormerkung, Übergabetermin vorbei). Davor gilt die Tür- und Bodenregel: dort kennzeichnet „crit“ die nicht erfüllte Frist.
    const liste = schritt ? (schritt.frist ? [{ name: schritt.fristName, at: schritt.frist, ton: schritt.ton, offen: true }] : []) : lage(ctx, e).fristen.map((f) => ({ ...f, offen: f.ton === 'crit' }));
    for (const f of liste) {
      const t = minuten(f.at); const vorbei = t < jetzt;
      if ((vorbei && !f.offen) || (!vorbei && t > ende)) continue;
      fristen.push({ art: 'entscheidung', projekt: e.projekt, id: e.id, ref: e, name: f.name, at: f.at, ueberfaellig: vorbei, ton: vorbei ? 'crit' : f.ton, tage: Math.floor((t - jetzt) / 1440) });
    }
  }
  for (const d of offeneBedarfe) {
    if (!d.bestellfrist) continue;
    const at = tagesende(d.bestellfrist); const t = minuten(at); const vorbei = t < jetzt;
    if (!vorbei && t > ende) continue;
    fristen.push({ art: 'bedarf', projekt: d.projekt, id: d.id, ref: d, name: 'Bestellfrist', at, ueberfaellig: vorbei, ton: vorbei ? 'crit' : 'warn', tage: Math.floor((t - jetzt) / 1440) });
  }
  fristen.sort((a, b) => minuten(a.at) - minuten(b.at));
  const zeitkritisch = { tage: kritischTage, anzahl: fristen.length, ueberfaellig: fristen.filter((f) => f.ueberfaellig).length, eintraege: fristen };

  return { stichtag: ctx.at, horizontTage, kritischTage, baldVerfuegbar, zeitverlauf, bedarfeOffen, passendePaare, vorgaenge, offenePruefpunkte, zeitkritisch };
}
