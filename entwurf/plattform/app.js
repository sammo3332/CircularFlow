// CircularFlow Plattform-Entwurf: Projektübersicht, Bauteilbestand, Bauteilpass, Wiederverwendungsentscheidung.
// Ein gemeinsamer Zustand im Arbeitsspeicher. Alle Daten sind fiktiv. Nichts wird gespeichert oder versendet.
import { PROJEKT, PERSONEN, PROJEKTZEITEN, GRUPPEN, STATUS, MASSSTATUS, ZUSTAND, BAUTEILE, ENTSCHEIDUNGEN } from './daten.js';

// Geprüfte Türregel (CF-UMBAU-01 Rev. 2) unverändert wiederverwenden.
// Im veröffentlichten Entwurf liegt sie neben der Seite, im Repository unter prototype/dist/.
async function ladeTuerregel() {
  try { return await import('./door-rules.mjs'); }
  catch { return import('../../prototype/dist/door-rules.mjs'); }
}

let R; // Türregel-Modul
const app = document.getElementById('app');

const state = {
  at: PROJEKTZEITEN[0].at,
  tuerAufmass: null,
  boden: { beschaedigtM2: String(ENTSCHEIDUNGEN[1].ist.beschaedigtM2), hoeheAm: null, lastAm: null },
  ereignisse: [], // { at, von, text, bauteil, entscheidung, art: 'vorlage' | 'aufgabe', sim }
  filter: { q: '', gruppe: '', status: '', geschoss: '', offen: false },
  fokus: null, // Ersatzziel für den Fokus, wenn das bediente Element nach dem Neuzeichnen fehlt
};

// Dauerhafte Live-Regionen außerhalb des neu gezeichneten Bereichs, damit Ansagen zuverlässig ankommen.
const toast = document.createElement('div');
toast.className = 'toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
const ansage = document.createElement('div');
ansage.className = 'sr'; ansage.setAttribute('aria-live', 'polite');
document.body.append(toast, ansage);
let letzteAnsage = { id: '', text: '' };

// ---------- Zeit (Berliner Wanduhrzeit, ohne Gerätezeitzone) ----------
const WT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
function teile(s) { const [d, t = '00:00'] = s.split('T'); const [y, m, dd] = d.split('-').map(Number); const [h, mi] = t.split(':').map(Number); return { y, m, dd, h, mi }; }
function minuten(s) { const p = teile(s); return Date.UTC(p.y, p.m - 1, p.dd, p.h, p.mi) / 60000; }
function zeit(s, mitTag = true) {
  const p = teile(s); const wt = WT[new Date(Date.UTC(p.y, p.m - 1, p.dd)).getUTCDay()];
  const d = `${String(p.dd).padStart(2, '0')}.${String(p.m).padStart(2, '0')}.`;
  return `${mitTag ? wt + ' ' : ''}${d}, ${String(p.h).padStart(2, '0')}:${String(p.mi).padStart(2, '0')}`;
}
function datum(s) { const p = teile(s); return `${String(p.dd).padStart(2, '0')}.${String(p.m).padStart(2, '0')}.${p.y}`; }
function abstand(ziel, jetzt) {
  const diff = minuten(ziel) - minuten(jetzt); const a = Math.abs(diff);
  const tage = Math.floor(a / 1440), std = Math.floor((a % 1440) / 60), min = a % 60;
  const text = tage ? `${tage} Tg. ${std} Std.` : std ? `${std} Std.${min ? ` ${min} Min.` : ''}` : `${min} Min.`;
  if (diff === 0) return { text: 'genau jetzt', vorbei: false };
  return diff > 0 ? { text: `noch ${text}`, vorbei: false } : { text: `seit ${text} vorbei`, vorbei: true };
}
const bis = (s) => s && minuten(s) <= minuten(state.at);

// ---------- Hilfen ----------
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const chip = (label, ton) => `<span class="chip chip-${ton}">${esc(label)}</span>`;
const person = (key) => PERSONEN[key];
const bauteil = (id) => BAUTEILE.find((b) => b.id === id);
const entscheidung = (id) => ENTSCHEIDUNGEN.find((e) => e.id === id);
const slug = (id) => id.toLowerCase();
// Zwei Nachkommastellen, damit Anzeige und Vergleich (Hundertstel) übereinstimmen.
const zahl = (n) => n.toLocaleString('de-DE', { maximumFractionDigits: 2 });

function sichtbareEreignisse(filterFn = () => true) {
  return state.ereignisse.filter((e) => bis(e.at) && filterFn(e));
}

// Letzte sichtbare Vorlage einer Entscheidung zur Fachprüfung.
function vorlage(e) {
  return sichtbareEreignisse((x) => x.entscheidung === e.id && x.art === 'vorlage').sort((x, y) => minuten(x.at) - minuten(y.at)).pop() || null;
}

// Status folgt der aktuellen Regellage: „Fachprüfung angefragt“ nur, solange die Regel Rang 6 ergibt
// (offener, widerspruchsfreier Fall, Rev. 2 §5). Sonst gilt der hinterlegte Status.
function bauteilStatus(b) {
  const e = ENTSCHEIDUNGEN.find((x) => x.bauteil === b.id);
  if (e && vorlage(e) && lageRegel(e).haupt.rank === 6) return 'fachpruefung';
  return b.status;
}

// ---------- Auswertung der Entscheidungen ----------
function bewerteTuer() {
  return R.evaluateDoor({ requirement: R.REQUIREMENT, measurement: state.tuerAufmass, deadlines: R.DEADLINES, at: state.at });
}

// Entwurfsregel Doppelboden: gleiche Rangfolge wie die Türregel, eigene Kriterien. Nicht geprüft.
// Grenzen eingeschlossen. Mengen in Hundertstel m² als ganze Zahlen verglichen, damit keine Rundungsfehler kippen.
function bewerteBoden() {
  const e = entscheidung('E-02');
  const hundertstel = (v) => Math.round(v * 100);
  const roh = String(state.boden.beschaedigtM2 ?? '').trim();
  const zahlOk = /^\d+([.,]\d+)?$/.test(roh);
  const beschaedigt = zahlOk ? hundertstel(Number(roh.replace(',', '.'))) / 100 : null;
  const beschaedigtGueltig = beschaedigt !== null && beschaedigt <= e.ist.flaecheM2;
  const beschaedigtFehler = beschaedigtGueltig ? '' : roh === '' ? `Angabe fehlt. Bitte eine Zahl zwischen 0 und ${e.ist.flaecheM2} eingeben.` : `Bitte eine Zahl zwischen 0 und ${e.ist.flaecheM2} eingeben.`;
  const verwendbar = beschaedigtGueltig ? (hundertstel(e.ist.flaecheM2) - hundertstel(beschaedigt)) / 100 : null;
  const bedarf = Math.round(e.soll.bedarfM2 * (100 + e.soll.reserveProzent)) / 100;
  const hoehe = bis(state.boden.hoeheAm) ? state.boden.hoeheAm : null;
  const last = bis(state.boden.lastAm) ? state.boden.lastAm : null;
  const w = e.nachweisWerte;
  const sollMenge = `${zahl(bedarf)} m² (${e.soll.bedarfM2} m² + ${e.soll.reserveProzent} % Reserve)`;

  const kriterien = [
    e.soll.raster === e.ist.raster
      ? { key: 'raster', name: 'Rastermaß', soll: e.soll.raster, ist: `${e.ist.raster} (gemessen)`, befund: 'erfüllt', ton: 'ok', weg: 'Regel (Entwurf)' }
      : { key: 'raster', name: 'Rastermaß', soll: e.soll.raster, ist: `${e.ist.raster} (gemessen)`, befund: 'verfehlt', ton: 'crit', weg: 'Regel (Entwurf)' },
    verwendbar === null
      ? { key: 'menge', name: 'Menge', soll: sollMenge, ist: 'beschädigte Fläche fehlt oder ist ungültig', befund: 'offen: Angabe prüfen', ton: 'warn', weg: 'Regel (Entwurf)' }
      : hundertstel(verwendbar) >= hundertstel(bedarf)
        ? { key: 'menge', name: 'Menge', soll: sollMenge, ist: `${zahl(verwendbar)} m² verwendbar`, befund: `erfüllt, ${zahl((hundertstel(verwendbar) - hundertstel(bedarf)) / 100)} m² Überschuss`, ton: 'ok', weg: 'Regel (Entwurf)' }
        : { key: 'menge', name: 'Menge', soll: sollMenge, ist: `${zahl(verwendbar)} m² verwendbar`, befund: `verfehlt, ${zahl((hundertstel(bedarf) - hundertstel(verwendbar)) / 100)} m² fehlen`, ton: 'crit', weg: 'Regel (Entwurf)' },
    !hoehe
      ? { key: 'hoehe', name: 'Aufbauhöhe', soll: `${e.soll.aufbauhoeheMm} mm`, ist: 'Verstellbereich der Stützen unbekannt', befund: 'offen: Nachweis fehlt', ton: 'warn', weg: 'Nachweis' }
      : e.soll.aufbauhoeheMm >= w.verstellVonMm && e.soll.aufbauhoeheMm <= w.verstellBisMm
        ? { key: 'hoehe', name: 'Aufbauhöhe', soll: `${e.soll.aufbauhoeheMm} mm`, ist: `Verstellbereich ${w.verstellVonMm} bis ${w.verstellBisMm} mm (${w.quelle})`, befund: 'im Verstellbereich', ton: 'ok', weg: 'Nachweis' }
        : { key: 'hoehe', name: 'Aufbauhöhe', soll: `${e.soll.aufbauhoeheMm} mm`, ist: `Verstellbereich ${w.verstellVonMm} bis ${w.verstellBisMm} mm (${w.quelle})`, befund: 'außerhalb des Verstellbereichs', ton: 'crit', weg: 'Nachweis' },
    last
      ? { key: 'last', name: 'Tragfähigkeit', soll: `Punktlast ${e.soll.punktlastKn} kN`, ist: 'Herstellernachweis liegt vor (fiktiv)', befund: 'Bewertung durch Fachprüfung', ton: 'info', weg: 'Fachprüfung' }
      : { key: 'last', name: 'Tragfähigkeit', soll: `Punktlast ${e.soll.punktlastKn} kN`, ist: 'kein Nachweis, kein Typenschild', befund: 'offen: Nachweis fehlt', ton: 'warn', weg: 'Fachprüfung' },
  ];

  const nachweiseDa = Boolean(hoehe && last);
  const letzterEingang = nachweiseDa ? (minuten(hoehe) > minuten(last) ? hoehe : last) : null;
  let nachweis;
  if (nachweiseDa) nachweis = minuten(letzterEingang) <= minuten(e.fristen.nachweis) ? { key: 'onTime', label: 'Nachweise rechtzeitig eingegangen', ton: 'ok' } : { key: 'late', label: 'Nachweise verspätet eingegangen', ton: 'crit' };
  else nachweis = minuten(state.at) <= minuten(e.fristen.nachweis) ? { key: 'pending', label: 'Nachweise ausstehend', ton: 'warn' } : { key: 'overdue', label: 'Nachweise überfällig', ton: 'crit' };
  const ersatzOffen = minuten(state.at) <= minuten(e.fristen.ersatz);
  const ersatz = ersatzOffen ? { key: 'open', label: 'Entscheidungsfrist offen', ton: 'ok' } : { key: 'expired', label: 'Entscheidungsfrist verstrichen', ton: 'crit' };
  const widerspruch = minuten(e.fristen.nachweis) > minuten(e.fristen.ersatz);
  const verfehlt = kriterien.filter((k) => k.ton === 'crit');
  const pruefbarErfuellt = ['raster', 'menge', 'hoehe'].every((k) => kriterien.find((x) => x.key === k).ton === 'ok');

  const aufgaben = [];
  const add = (rank, text, rolle, grund) => aufgaben.push({ rank, text, rolle, grund });
  if (!ersatzOffen) add(1, 'Bestellstatus klären', 'planung', 'Erst feststellen, ob ein neuer Doppelboden bereits bestellt wurde und welche Optionen noch offenstehen.');
  if (widerspruch) add(2, 'Termine klären', 'planung', 'Die Nachweisfrist liegt nach der Ersatzentscheidung.');
  if (ersatzOffen && verfehlt.length) add(3, 'Anpassung fachlich klären oder Ersatzweg vorbereiten', 'planung', `Verfehlt: ${verfehlt.map((k) => k.name).join(', ')}. Die Ersatzentscheidung steht noch aus.`);
  if (ersatzOffen && (nachweis.key === 'overdue' || nachweis.key === 'late')) add(4, 'Prüfvorlauf klären', 'planung', 'Die Nachweise sind überfällig oder verspätet eingegangen, die Ersatzentscheidung steht noch aus.');
  if (!nachweiseDa) add(5, 'Herstellerangaben zu Stützenhöhe und Tragfähigkeit beschaffen oder Probeausbau veranlassen', 'montage', 'Ohne Nachweise bleiben Aufbauhöhe und Tragfähigkeit offen.');
  if (verwendbar === null) add(5, 'Beschädigte Fläche aus der Stichprobe prüfen und gültig angeben', 'bauleitung', 'Ohne gültige Angabe bleibt die verwendbare Menge offen.');
  if (nachweiseDa && nachweis.key === 'onTime' && ersatzOffen && pruefbarErfuellt && !widerspruch) add(6, 'Variante zur fachlichen Prüfung vorlegen', 'planung', 'Rastermaß, Menge und Aufbauhöhe passen, die Nachweise liegen rechtzeitig vor. Weitere technische Anforderungen bleiben offen.');
  aufgaben.sort((a, b) => a.rank - b.rank);
  return { kriterien, nachweis, ersatz, verwendbar, bedarf, beschaedigtGueltig, beschaedigtFehler, haupt: aufgaben[0], weiter: aufgaben.slice(1), widerspruch, hoehe, last };
}

// Einheitliche Sicht auf beide Entscheidungen, direkt aus der jeweiligen Regel.
function lageRegel(e) {
  if (e.regel === 'tuer') {
    const r = bewerteTuer();
    return {
      r, haupt: { rank: r.mainStep.rank, text: r.mainStep.text, rolle: rolleKey(r.mainStep.role), grund: r.mainStep.reason },
      weiter: r.stillOpen.map((s) => ({ text: s.text, rolle: rolleKey(s.role) })),
      fristen: [
        { id: 'E-01-a', name: 'Aufmaßfrist', at: R.DEADLINES.measureDeadline, rolle: 'montage', status: r.measureStatus.label, ton: tonTuerAufmass(r.measureStatus.key) },
        { id: 'E-01-e', name: 'Ersatzentscheidung', at: R.DEADLINES.replaceDeadline, rolle: 'planung', status: r.replaceStatus.label, ton: r.replaceStatus.key === 'open' ? 'ok' : 'crit' },
      ],
    };
  }
  const r = bewerteBoden();
  return {
    r, haupt: r.haupt, weiter: r.weiter,
    fristen: [
      { id: 'E-02-n', name: 'Nachweisfrist', at: e.fristen.nachweis, rolle: 'montage', status: r.nachweis.label, ton: r.nachweis.ton },
      { id: 'E-02-e', name: 'Ersatzentscheidung', at: e.fristen.ersatz, rolle: 'planung', status: r.ersatz.label, ton: r.ersatz.ton },
    ],
  };
}
// Lage für die Anzeige: Ist die Variante bereits vorgelegt und ergibt die Regel weiter Rang 6,
// wartet die Entscheidung auf die Fachprüfung. Jeder andere Rang hat Vorrang vor der Vorlage.
function lage(e) {
  const l = lageRegel(e); const v = vorlage(e);
  if (v && l.haupt.rank === 6) {
    return { ...l, vorlage: v, haupt: { rank: 6, wartet: true, text: 'Rückmeldung der Fachprüfung abwarten', rolle: 'fach', grund: `Die Variante liegt seit ${zeit(v.at)} der Fachprüfung vor. Weitere technische Anforderungen bleiben offen.` } };
  }
  return { ...l, vorlage: v };
}
function naechsteFrist(l) { return l.fristen.filter((f) => minuten(f.at) >= minuten(state.at)).sort((x, y) => minuten(x.at) - minuten(y.at))[0] || null; }
// Reihenfolge nach Handlungsdruck: Rang, dann nächste Frist. Wartende Entscheidungen zuletzt.
function sortiert(liste) {
  const gewicht = (x) => (x.l.haupt.wartet ? 7 : x.l.haupt.rank);
  const frist = (x) => { const f = naechsteFrist(x.l); return f ? minuten(f.at) : Number.MAX_SAFE_INTEGER; };
  return liste.sort((a, b) => gewicht(a) - gewicht(b) || frist(a) - frist(b));
}
const tonVon = (haupt) => (haupt.wartet ? 'info' : haupt.rank <= 2 ? 'crit' : haupt.rank <= 4 ? 'warn' : haupt.rank === 5 ? 'info' : 'ok');
function rolleKey(role) { return Object.keys(PERSONEN).find((k) => PERSONEN[k].rolle === role) || 'planung'; }
function tonTuerAufmass(key) { return { pending: 'warn', overdue: 'crit', onTime: 'ok', late: 'crit' }[key] || 'neutral'; }

// Offene Angaben je Bauteil, für T-07 und DB-01 aus der Auswertung abgeleitet.
function offeneAngaben(b) {
  const liste = [...b.offen];
  if (b.id === 'T-07') {
    const r = bewerteTuer();
    if (!r.usable) liste.push({ text: `Aufmaß Rohbauöffnung B-02 (${r.width.reasons[0] || 'nicht verwertbar'})`, rolle: 'montage', frist: R.DEADLINES.measureDeadline });
    liste.push({ text: 'Höhe, Anschlag und Zustand fachlich prüfen', rolle: 'fach' });
    liste.push({ text: 'Hersteller unbekannt', rolle: 'bauleitung' });
  }
  if (b.id === 'DB-01') {
    const r = bewerteBoden(); const e = entscheidung('E-02');
    if (!r.hoehe) liste.push({ text: 'Verstellbereich der Stützen nachweisen', rolle: 'montage', frist: e.fristen.nachweis });
    if (!r.last) liste.push({ text: 'Tragfähigkeit nachweisen (Herstellerangabe)', rolle: 'montage', frist: e.fristen.nachweis });
    liste.push({ text: 'Kleber der Stützen auf Schadstoffe prüfen', rolle: 'fach' });
  }
  return liste;
}

function nachweiseVon(b) {
  const liste = [...b.nachweise];
  if (b.id === 'T-07') {
    const r = bewerteTuer(); const m = state.tuerAufmass;
    if (r.usable) liste.push({ titel: 'Aufmaßnotiz Rohbauöffnung B-02', art: 'Aufmaß', datum: m.receivedAt, von: 'montage', stand: `eingegangen, ${m.valueText} mm`, ton: 'ok' });
    else if (r.receipt.state === 'received' || r.receipt.state === 'contradictory' || r.receipt.state === 'invalid') liste.push({ titel: 'Aufmaßnotiz Rohbauöffnung B-02', art: 'Aufmaß', datum: m.receivedAt, von: 'montage', stand: `nicht verwertbar: ${r.width.reasons[0] || r.receipt.label}`, ton: 'warn' });
    else liste.push({ titel: 'Aufmaßnotiz Rohbauöffnung B-02', art: 'Aufmaß', datum: null, von: 'montage', stand: 'fehlt', ton: 'crit' });
  }
  if (b.id === 'DB-01') {
    const r = bewerteBoden();
    const w = entscheidung('E-02').nachweisWerte;
    liste.push(r.hoehe ? { titel: 'Herstellerangabe Stützen', art: 'Nachweis', datum: r.hoehe, von: 'montage', stand: `eingegangen, ${w.verstellVonMm} bis ${w.verstellBisMm} mm`, ton: 'ok' } : { titel: 'Herstellerangabe Stützen', art: 'Nachweis', datum: null, von: 'montage', stand: 'fehlt', ton: 'crit' });
    liste.push(r.last ? { titel: 'Nachweis Tragfähigkeit', art: 'Nachweis', datum: r.last, von: 'montage', stand: 'eingegangen, Bewertung offen', ton: 'info' } : { titel: 'Nachweis Tragfähigkeit', art: 'Nachweis', datum: null, von: 'montage', stand: 'fehlt', ton: 'crit' });
  }
  return liste;
}

function verlaufVon(b) {
  const basis = b.verlauf.filter((v) => bis(v.at)).map((v) => ({ ...v }));
  if (b.id === 'T-07') {
    const m = state.tuerAufmass; const r = bewerteTuer();
    if (m.receivedAt && R.isWallDateTime(m.receivedAt) && bis(m.receivedAt) && r.receipt.state !== 'invalid') {
      basis.push({ at: m.receivedAt, von: 'montage', text: r.usable ? `Aufmaß B-02 eingegangen: ${m.valueText} mm, ${m.reference}.` : `Eintrag zum Aufmaß B-02 eingegangen, nicht verwertbar: ${r.width.reasons[0] || r.receipt.label}.` });
    }
  }
  if (b.id === 'DB-01') {
    const h = bewerteBoden().hoehe;
    if (h) basis.push({ at: h, von: 'montage', text: 'Herstellerangabe zu den Stützen eingegangen (Verstellbereich).' });
  }
  sichtbareEreignisse((e) => e.bauteil === b.id).forEach((e) => basis.push(e));
  return basis.sort((x, y) => minuten(y.at) - minuten(x.at));
}

// ---------- Router ----------
function route() {
  const h = (location.hash || '#uebersicht').slice(1);
  if (h.startsWith('pass-')) return { view: 'pass', id: h.slice(5).toUpperCase() };
  if (h.startsWith('entscheidung-')) return { view: 'entscheidung', id: h.slice(13).toUpperCase() };
  if (['uebersicht', 'bestand', 'entscheidungen'].includes(h)) return { view: h };
  return h ? { view: 'unbekannt', id: h } : { view: 'uebersicht' };
}

// Maße je Bauteil. Der Verstellbereich von DB-02 kommt aus dem Nachweis zu E-02, sobald er eingegangen ist.
function masseVon(b) {
  if (b.id === 'DB-02' && bewerteBoden().hoehe) {
    const w = entscheidung('E-02').nachweisWerte;
    return [{ name: 'Verstellbereich', wert: `${w.verstellVonMm} bis ${w.verstellBisMm} mm`, bezug: 'Stützenhöhe', status: 'nachweis', quelle: `${w.quelle}, über E-02` }];
  }
  return b.masse;
}
function gehe(hash) { if (location.hash === hash) render(); else location.hash = hash; }

// ---------- Rahmen ----------
function rahmen(r, inhalt) {
  const nav = [
    ['uebersicht', 'Übersicht', icon('grid')],
    ['bestand', 'Bestand', icon('stack')],
    ['entscheidungen', 'Entscheidungen', icon('flag')],
  ];
  const aktiv = r.view === 'pass' ? 'bestand' : r.view === 'entscheidung' ? 'entscheidungen' : r.view;
  return `
  <button type="button" class="skip" data-action="skip">Zum Inhalt springen</button>
  <div class="shell">
    <aside class="rail" aria-label="Projektnavigation">
      <div class="marke"><span class="marke-zeichen" aria-hidden="true">${icon('loop')}</span><span><b>CircularFlow</b><small>Bauteile im Umbau</small></span></div>
      <div class="projektwahl">
        <span class="label">Projekt</span>
        <b>${esc(PROJEKT.name)}</b>
        <small>${esc(PROJEKT.id)} · ${esc(PROJEKT.phase)}</small>
      </div>
      <nav class="nav">
        ${nav.map(([k, t, i]) => `<a href="#${k}" ${aktiv === k ? 'aria-current="page"' : ''}>${i}<span>${t}</span>${k === 'entscheidungen' ? `<em>${ENTSCHEIDUNGEN.length}</em>` : ''}</a>`).join('')}
      </nav>
      <div class="rail-fuss">
        <span class="chip chip-sim">Beispieldaten</span>
        <p>Projekt, Personen und Maße sind fiktiv. Aktionen werden nur vermerkt, nichts wird versendet.</p>
      </div>
    </aside>
    <div class="arbeitsflaeche">
      <header class="kopf">
        <form class="suche" role="search" id="suche">
          <label for="suche-q" class="sr">Bauteile durchsuchen</label>
          ${icon('search')}<input id="suche-q" type="search" placeholder="Bauteil, ID oder Raum suchen" value="${esc(state.filter.q)}" autocomplete="off">
        </form>
        <div class="projektzeit">
          <label for="projektzeit">Projektzeit <span>Simulation</span></label>
          <select id="projektzeit">${PROJEKTZEITEN.map((z) => `<option value="${z.at}" ${z.at === state.at ? 'selected' : ''}>${z.label}</option>`).join('')}</select>
        </div>
      </header>
      <main id="inhalt" tabindex="-1">${inhalt}</main>
    </div>
  </div>`;
}

// ---------- Ansicht 1: Projektübersicht ----------
function uebersicht() {
  const lagen = sortiert(ENTSCHEIDUNGEN.map((e) => ({ e, l: lage(e) })));
  const fristen = lagen.flatMap(({ e, l }) => l.fristen.map((f) => ({ ...f, e }))).sort((a, b) => minuten(a.at) - minuten(b.at));
  const naechste = fristen.find((f) => minuten(f.at) >= minuten(state.at));
  const offen = BAUTEILE.flatMap((b) => offeneAngaben(b).map((o) => ({ ...o, b })));
  const nachRolle = Object.keys(PERSONEN).map((k) => ({ k, items: offen.filter((o) => o.rolle === k) })).filter((g) => g.items.length);
  const aktivitaet = [
    ...BAUTEILE.flatMap((b) => verlaufVon(b).map((v) => ({ ...v, b }))),
  ].sort((x, y) => minuten(y.at) - minuten(x.at)).slice(0, 5);

  return `
  <section class="seitenkopf">
    <div>
      <p class="eyebrow">${esc(PROJEKT.id)} · ${esc(PROJEKT.zusatz)}</p>
      <h1>${esc(PROJEKT.name)}</h1>
      <p class="unter">${esc(PROJEKT.phase)} · Rückbau ab ${datum(PROJEKT.rueckbauAb + 'T00:00')} · Stand ${zeit(state.at)}</p>
    </div>
    ${naechste ? `<div class="naechste-frist"><span class="label">Nächste Frist</span><b>${esc(naechste.name)} ${esc(naechste.e.id)}</b><span class="mono">${zeit(naechste.at)}</span><span class="restzeit">${abstand(naechste.at, state.at).text}</span></div>` : `<div class="naechste-frist"><span class="label">Nächste Frist</span><b>Keine weitere Frist</b><span class="restzeit">alle Termine liegen zurück</span></div>`}
  </section>

  <section class="block" aria-labelledby="h-entscheidungen">
    <div class="block-kopf"><h2 id="h-entscheidungen">Offene Entscheidungen</h2><a href="#entscheidungen" class="leise">Alle Entscheidungen</a></div>
    <div class="entscheidungsliste">${lagen.map(({ e, l }) => entscheidungZeile(e, l)).join('')}</div>
  </section>

  <div class="zweispaltig">
    <section class="block" aria-labelledby="h-fristen">
      <div class="block-kopf"><h2 id="h-fristen">Anstehende Fristen</h2><span class="leise">18. bis 20. November</span></div>
      <div class="flaeche">
        ${zeitleiste(fristen)}
        <ol class="fristliste">${fristen.map((f) => {
          const a = abstand(f.at, state.at);
          return `<li><a href="#entscheidung-${slug(f.e.id)}"><span class="mono f-zeit">${zeit(f.at)}</span><span class="f-name"><b>${esc(f.name)}</b> · ${esc(f.e.id)} ${esc(bauteil(f.e.bauteil).id)}<small>${esc(person(f.rolle).rolle)} · ${esc(person(f.rolle).name)}</small></span><span class="f-stand">${chip(f.status, f.ton)}<small class="${a.vorbei ? 'vorbei' : ''}">${a.text}</small></span></a></li>`;
        }).join('')}</ol>
      </div>
    </section>

    <section class="block" aria-labelledby="h-offen">
      <div class="block-kopf"><h2 id="h-offen">Offene Angaben</h2><a href="#bestand" class="leise" data-offen>Im Bestand filtern</a></div>
      <div class="flaeche rollen">
        ${nachRolle.map((g) => `
          <div class="rolle">
            <div class="rolle-kopf"><b>${esc(person(g.k).rolle)}</b><span>${esc(person(g.k).name)}</span><em>${g.items.length}</em></div>
            <ul>${g.items.slice(0, 4).map((o) => `<li><a href="#pass-${slug(o.b.id)}"><span class="mono">${esc(o.b.id)}</span> ${esc(o.text)}${o.frist ? ` <small>bis ${zeit(o.frist, false)}</small>` : ''}</a></li>`).join('')}${g.items.length > 4 ? `<li class="mehr">und ${g.items.length - 4} weitere</li>` : ''}</ul>
          </div>`).join('')}
      </div>
    </section>
  </div>

  <div class="zweispaltig">
    <section class="block" aria-labelledby="h-bestand">
      <div class="block-kopf"><h2 id="h-bestand">Bestand nach Gruppen</h2><a href="#bestand" class="leise">Bauteilbestand öffnen</a></div>
      <div class="flaeche gruppen">${Object.entries(GRUPPEN).map(([k, g]) => gruppenZeile(k, g)).join('')}
        <div class="legende">${Object.entries(STATUS).map(([, s]) => `<span><i class="punkt t-${s.ton}"></i>${esc(s.label)}</span>`).join('')}</div>
      </div>
    </section>
    <section class="block" aria-labelledby="h-aktiv">
      <div class="block-kopf"><h2 id="h-aktiv">Zuletzt im Projekt</h2></div>
      <ol class="flaeche aktivitaet">${aktivitaet.map((v) => `<li><span class="mono">${zeit(v.at, false)}</span><p><a href="#pass-${slug(v.b.id)}">${esc(v.b.id)}</a> ${esc(v.text)}<small>${esc(person(v.von).rolle)} · ${esc(person(v.von).name)}</small></p></li>`).join('')}</ol>
    </section>
  </div>`;
}

function entscheidungZeile(e, l) {
  const b = bauteil(e.bauteil);
  const naechste = l.fristen.filter((f) => minuten(f.at) >= minuten(state.at)).sort((x, y) => minuten(x.at) - minuten(y.at))[0] || l.fristen[l.fristen.length - 1];
  const a = abstand(naechste.at, state.at);
  const tonHaupt = tonVon(l.haupt);
  return `
  <a class="entscheidung-zeile" href="#entscheidung-${slug(e.id)}">
    <span class="ez-id"><span class="mono">${esc(e.id)}</span>${chip(e.regel === 'tuer' ? 'Regel geprüft' : 'Regel im Entwurf', e.regel === 'tuer' ? 'ok' : 'neutral')}</span>
    <span class="ez-titel"><b>${esc(b.id)} ${esc(b.name)}</b><small>${esc(e.herkunft)} → ${esc(e.zielText)}</small></span>
    <span class="ez-schritt"><i class="streifen t-${tonHaupt}"></i><span><small>Nächster Schritt · ${esc(person(l.haupt.rolle).rolle)}</small><b>${esc(l.haupt.text)}</b>${l.weiter.length ? `<small>und ${l.weiter.length} weitere offene Aufgabe${l.weiter.length > 1 ? 'n' : ''}</small>` : ''}</span></span>
    <span class="ez-frist"><small>${esc(naechste.name)}</small><span class="mono">${zeit(naechste.at)}</span><small class="${a.vorbei ? 'vorbei' : ''}">${a.text}</small></span>
  </a>`;
}

function gruppenZeile(k, g) {
  const teile = BAUTEILE.filter((b) => b.gruppe === k);
  const zaehl = Object.keys(STATUS).map((s) => ({ s, n: teile.filter((b) => bauteilStatus(b) === s).length })).filter((x) => x.n);
  return `<a class="gruppe" href="#bestand" data-gruppe="${k}">
    <span class="g-name"><b>${esc(g.name)}</b><small>${teile.length} Position${teile.length > 1 ? 'en' : ''}</small></span>
    <span class="balken" aria-label="${zaehl.map((x) => `${x.n} ${STATUS[x.s].label}`).join(', ')}">${zaehl.map((x) => `<i class="t-${STATUS[x.s].ton}" style="flex:${x.n}"></i>`).join('')}</span>
  </a>`;
}

// Zeitleiste der Fristen, maßstäblich in Stunden.
function zeitleiste(fristen) {
  const start = minuten('2026-11-18T08:00'), ende = minuten('2026-11-20T20:00');
  const W = 640, H = 92, L = 12, Rr = 12;
  const x = (s) => L + ((minuten(s) - start) / (ende - start)) * (W - L - Rr);
  const tage = ['2026-11-18', '2026-11-19', '2026-11-20'];
  const jetzt = x(state.at);
  return `<div class="zeitleiste"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Zeitleiste der Fristen vom 18. bis 20. November mit der aktuellen Projektzeit">
    ${tage.map((d) => { const x0 = x(d + 'T00:00') < L ? L : x(d + 'T00:00'); const x1 = x(d + 'T23:59') > W - Rr ? W - Rr : x(d + 'T23:59'); const p = teile(d); return `<rect x="${x0}" y="22" width="${x1 - x0}" height="36" class="tag ${p.dd % 2 ? 'tag-a' : 'tag-b'}"/><text x="${x0 + 6}" y="16" class="tl-tag">${WT[new Date(Date.UTC(p.y, p.m - 1, p.dd)).getUTCDay()]} ${p.dd}.11.</text>`; }).join('')}
    ${fristen.map((f) => `<g><line x1="${x(f.at)}" x2="${x(f.at)}" y1="22" y2="58" class="tl-frist t-${f.ton}"/><circle cx="${x(f.at)}" cy="40" r="5" class="tl-punkt t-${f.ton}"/></g>`).join('')}
    <line x1="${jetzt}" x2="${jetzt}" y1="18" y2="70" class="tl-jetzt"/>
    <text x="${Math.min(Math.max(jetzt, 40), W - 40)}" y="86" class="tl-jetzt-text" text-anchor="middle">Projektzeit ${zeit(state.at, false).split(', ')[1]}</text>
  </svg></div>`;
}

// ---------- Ansicht 2: Bauteilbestand ----------
function bestand() {
  const f = state.filter;
  const q = f.q.trim().toLowerCase();
  const liste = BAUTEILE.filter((b) => {
    const text = `${b.id} ${b.name} ${GRUPPEN[b.gruppe].name} ${b.ort} ${b.material}`.toLowerCase();
    return (!q || text.includes(q)) && (!f.gruppe || b.gruppe === f.gruppe) && (!f.status || bauteilStatus(b) === f.status)
      && (!f.geschoss || b.geschoss === f.geschoss) && (!f.offen || offeneAngaben(b).length);
  });
  const aktiv = f.q || f.gruppe || f.status || f.geschoss || f.offen;
  const sel = (id, label, opts, wert) => `<label class="filter"><span>${label}</span><select id="${id}"><option value="">Alle</option>${opts.map(([v, t]) => `<option value="${v}" ${v === wert ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>`;
  return `
  <section class="seitenkopf">
    <div><p class="eyebrow">${esc(PROJEKT.name)}</p><h1>Bauteilbestand</h1>
    <p class="unter">${BAUTEILE.length} Positionen aus der Begehung am 12.11.2026 · Einzelbauteile und Sammelpositionen</p></div>
  </section>
  <div class="werkzeugleiste" role="group" aria-label="Filter">
    ${sel('f-gruppe', 'Gruppe', Object.entries(GRUPPEN).map(([k, g]) => [k, g.name]), f.gruppe)}
    ${sel('f-status', 'Status', Object.entries(STATUS).map(([k, s]) => [k, s.label]), f.status)}
    ${sel('f-geschoss', 'Geschoss', PROJEKT.geschosse.map((g) => [g, g]), f.geschoss)}
    <label class="schalter"><input type="checkbox" id="f-offen" ${f.offen ? 'checked' : ''}><span>nur mit offenen Angaben</span></label>
    <span class="treffer" aria-live="polite">${liste.length} von ${BAUTEILE.length}</span>
    ${aktiv ? '<button type="button" class="knopf-leise" id="btn-filter-reset" data-action="filter-reset">Filter zurücksetzen</button>' : ''}
  </div>
  ${liste.length ? `
  <div class="tabelle-rahmen">
    <table class="bestand">
      <thead><tr><th scope="col">ID</th><th scope="col">Bauteil</th><th scope="col">Standort</th><th scope="col" class="r">Menge</th><th scope="col">Maße</th><th scope="col">Zustand</th><th scope="col">Status</th><th scope="col" class="r">Offen</th></tr></thead>
      <tbody>${liste.map((b) => bestandZeile(b)).join('')}</tbody>
    </table>
  </div>
  <p class="hinweis-zeile">Zustand nach Sichtprüfung: ${Object.entries(ZUSTAND).map(([k, t]) => `<b>${k}</b> ${esc(t)}`).join(' · ')}. Skala des Entwurfs, keine Norm.</p>` : `<div class="leer"><b>Keine Bauteile gefunden.</b><p>Kein Bauteil passt zu Suche und Filtern. Filter zurücksetzen oder anders suchen.</p><button type="button" class="knopf" id="btn-filter-reset-leer" data-action="filter-reset">Filter zurücksetzen</button></div>`}`;
}

function massLage(b) {
  const st = masseVon(b).map((m) => m.status);
  if (b.id === 'T-07') return bewerteTuer().usable ? ['gemessen', 'ok'] : ['Zielöffnung fehlt', 'warn'];
  if (st.includes('fehlt')) return ['unvollständig', 'warn'];
  if (st.every((s) => s === 'gemessen')) return ['gemessen', 'ok'];
  if (st.includes('gemessen')) return ['teilweise gemessen', 'info'];
  return [MASSSTATUS[st[0]] || 'offen', 'neutral'];
}

function bestandZeile(b) {
  const s = STATUS[bauteilStatus(b)]; const o = offeneAngaben(b).length; const [ml, mt] = massLage(b);
  return `<tr data-href="#pass-${slug(b.id)}">
    <td class="mono id"><a href="#pass-${slug(b.id)}">${esc(b.id)}</a></td>
    <td><b>${esc(b.name)}</b><small>${esc(GRUPPEN[b.gruppe].name)} · ${esc(b.typ)}</small></td>
    <td>${esc(b.ort)}</td>
    <td class="r mono">${zahl(b.menge)} ${esc(b.einheit)}</td>
    <td><span class="mass"><i class="punkt t-${mt}"></i>${esc(ml)}</span></td>
    <td><span class="nur-schmal leise">Zustand </span><span class="zustand z-${b.zustand}" title="${esc(b.zustandText)}">${esc(b.zustand)}</span></td>
    <td>${chip(s.label, s.ton)}</td>
    <td class="r">${o ? `<span class="zahl-offen">${o}<span class="nur-schmal"> offen</span></span>` : '<span class="leise">–</span>'}</td>
  </tr>`;
}

// ---------- Ansicht 3: Bauteilpass ----------
function pass(id) {
  const b = bauteil(id);
  if (!b) return nichtGefunden('Bauteil', id);
  const s = STATUS[bauteilStatus(b)]; const e = b.entscheidung ? entscheidung(b.entscheidung) : null;
  const offen = offeneAngaben(b); const nachweise = nachweiseVon(b); const verlauf = verlaufVon(b);
  const l = e ? lage(e) : null;
  return `
  <nav class="pfad" aria-label="Pfad"><a href="#bestand">Bauteilbestand</a><span>/</span><span aria-current="page">${esc(b.id)}</span></nav>
  <section class="seitenkopf pass-kopf">
    <div>
      <p class="eyebrow">Bauteilpass · ${esc(GRUPPEN[b.gruppe].name)} · ${esc(b.typ)}</p>
      <h1><span class="mono">${esc(b.id)}</span> ${esc(b.name)}</h1>
      <p class="unter">${chip(s.label, s.ton)} <span>Erfasst ${zeit(b.erfasst.am)} von ${esc(person(b.erfasst.von).name)}</span></p>
    </div>
    <div class="kopf-aktionen"><button type="button" class="knopf-leise" disabled title="Im Entwurf nicht aktiv">Pass exportieren</button></div>
  </section>

  <div class="pass-raster">
    <div class="pass-haupt">
      <section class="flaeche steckbrief" aria-labelledby="h-steck">
        <h2 id="h-steck" class="sr">Steckbrief</h2>
        <div class="skizze">${skizze(b)}</div>
        <dl class="werte">
          <div><dt>Menge</dt><dd class="mono">${zahl(b.menge)} ${esc(b.einheit)}</dd></div>
          <div><dt>Standort</dt><dd>${esc(b.ort)}</dd></div>
          <div><dt>Material</dt><dd>${esc(b.material)}</dd></div>
          <div><dt>Hersteller</dt><dd>${esc(b.hersteller)}</dd></div>
          <div><dt>Baujahr</dt><dd>${esc(b.baujahr)}</dd></div>
          <div><dt>Zustand</dt><dd><span class="zustand z-${b.zustand}">${esc(b.zustand)}</span> ${esc(ZUSTAND[b.zustand])}: ${esc(b.zustandText)}</dd></div>
          ${b.grund ? `<div><dt>Grund</dt><dd>${esc(b.grund)}</dd></div>` : ''}
          ${b.ziel ? `<div><dt>Zielort</dt><dd>${esc(b.ziel)}</dd></div>` : ''}
          ${!e && (b.status === 'vorgemerkt' || b.status === 'nicht') ? '<div><dt>Festlegung</dt><dd>Per Planungsnotiz, ohne Entscheidungsverfahren. Im Entwurf nur als Beispieldaten hinterlegt.</dd></div>' : ''}
        </dl>
      </section>

      <section class="flaeche" aria-labelledby="h-masse">
        <div class="block-kopf"><h2 id="h-masse">Maße</h2><span class="leise">Jedes Maß mit Bezug, Status und Quelle</span></div>
        <div class="tabelle-rahmen"><table class="einfach">
          <thead><tr><th scope="col">Maß</th><th scope="col" class="r">Wert</th><th scope="col">Bezug</th><th scope="col">Status</th><th scope="col">Quelle</th></tr></thead>
          <tbody>${masseVon(b).map((m) => `<tr><td>${esc(m.name)}${m.hinweis ? `<small>${esc(m.hinweis)}</small>` : ''}</td><td class="r mono">${esc(m.wert)}</td><td>${esc(m.bezug)}</td><td>${chip(MASSSTATUS[m.status], m.status === 'gemessen' ? 'ok' : m.status === 'fehlt' ? 'crit' : 'neutral')}</td><td>${esc(m.quelle)}</td></tr>`).join('')}</tbody>
        </table></div>
      </section>

      <section class="flaeche" aria-labelledby="h-nachweise">
        <div class="block-kopf"><h2 id="h-nachweise">Quellen und Nachweise</h2><span class="leise">${nachweise.length} Einträge</span></div>
        ${nachweise.length ? `<ul class="nachweise">${nachweise.map((n) => `<li><span class="n-art">${esc(n.art)}</span><span class="n-titel"><b>${esc(n.titel)}</b><small>${n.datum ? datum(n.datum) : 'noch kein Eingang'} · ${esc(person(n.von).rolle)}</small></span>${chip(n.stand, n.ton)}</li>`).join('')}</ul>` : '<p class="leer-zeile">Noch keine Quellen oder Nachweise hinterlegt.</p>'}
      </section>

      <section class="flaeche" aria-labelledby="h-rueckbau">
        <div class="block-kopf"><h2 id="h-rueckbau">Rückbau und Schadstoffe</h2></div>
        <dl class="werte zwei">${b.rueckbau.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      </section>
    </div>

    <aside class="pass-seite">
      ${e ? `<section class="flaeche verknuepft" aria-labelledby="h-ent">
        <h2 id="h-ent">Entscheidung <span class="mono">${esc(e.id)}</span></h2>
        ${e.bauteil !== b.id ? `<p>Gehört zu ${esc(e.bauteil)}. Der Verstellbereich wird über diese Entscheidung nachgewiesen.</p>` : ''}
        <p>${esc(e.herkunft)} → <b>${esc(e.zielText)}</b></p>
        <div class="mini-schritt"><small>Nächster Schritt · ${esc(person(l.haupt.rolle).rolle)}</small><b>${esc(l.haupt.text)}</b></div>
        <a class="knopf" href="#entscheidung-${slug(e.id)}">Entscheidung öffnen</a>
      </section>` : ''}
      <section class="flaeche" aria-labelledby="h-offen-b">
        <div class="block-kopf"><h2 id="h-offen-b">Offene Angaben</h2><em class="zaehler">${offen.length}</em></div>
        ${offen.length ? `<ul class="offen-liste">${offen.map((o) => `<li><b>${esc(o.text)}</b><small>${esc(person(o.rolle).rolle)} · ${esc(person(o.rolle).name)}${o.frist ? ` · bis ${zeit(o.frist)}` : ''}</small></li>`).join('')}</ul>` : '<p class="leer-zeile">Keine offenen Angaben.</p>'}
      </section>
      <section class="flaeche" aria-labelledby="h-ort">
        <h2 id="h-ort">Standort</h2>
        ${schnitt(b.geschoss, null, b.raum)}
      </section>
      <section class="flaeche" aria-labelledby="h-verlauf">
        <h2 id="h-verlauf">Verlauf</h2>
        <ol class="verlauf">${verlauf.map((v) => `<li><span class="mono">${zeit(v.at, false)}</span><p>${esc(v.text)}<small>${esc(person(v.von).rolle)} · ${esc(person(v.von).name)}${v.sim ? ' · Simulation, nichts versendet' : ''}</small></p></li>`).join('')}</ol>
      </section>
    </aside>
  </div>`;
}

// Schematische Ansicht je Bauteilgruppe.
function skizze(b) {
  if (b.gruppe === 'tuer') {
    const breite = (b.masse.find((m) => m.name === 'Türblatt Breite') || {}).wert || '?';
    const hoehe = (b.masse.find((m) => m.name === 'Türblatt Höhe') || {}).wert || 'Höhe offen';
    return `<svg viewBox="0 0 240 244" role="img" aria-label="Schematische Ansicht des Türblatts, Breite ${esc(breite)}, Höhe ${esc(hoehe)}">
      <rect x="52" y="22" width="96" height="190" class="sk-zarge"/>
      <rect x="58" y="28" width="84" height="184" class="sk-blatt"/>
      <circle cx="132" cy="122" r="3.5" class="sk-linie-f"/>
      <line x1="58" y1="226" x2="142" y2="226" class="sk-mass"/><line x1="58" y1="220" x2="58" y2="232" class="sk-mass"/><line x1="142" y1="220" x2="142" y2="232" class="sk-mass"/>
      <text x="100" y="238" text-anchor="middle" class="sk-text">${esc(breite)}</text>
      <line x1="168" y1="28" x2="168" y2="212" class="sk-mass"/><line x1="162" y1="28" x2="174" y2="28" class="sk-mass"/><line x1="162" y1="212" x2="174" y2="212" class="sk-mass"/>
      <text x="178" y="124" class="sk-text">${esc(hoehe)}</text>
      <text x="10" y="14" class="sk-klein">Ansicht Türblatt, schematisch</text>
    </svg>`;
  }
  if (b.gruppe === 'boden') {
    const zellen = []; for (let r = 0; r < 5; r += 1) for (let c = 0; c < 6; c += 1) zellen.push(`<rect x="${20 + c * 30}" y="${30 + r * 30}" width="28" height="28" class="${(r === 1 && c === 4) || (r === 3 && c === 1) ? 'sk-schaden' : 'sk-platte'}"/>`);
    return `<svg viewBox="0 0 220 240" role="img" aria-label="Schematische Draufsicht Doppelboden, Raster 600 mal 600 Millimeter, zwei beschädigte Platten markiert">
      <text x="10" y="18" class="sk-klein">Draufsicht Raster, schematisch</text>${zellen.join('')}
      <line x1="20" y1="196" x2="48" y2="196" class="sk-mass"/><text x="34" y="212" text-anchor="middle" class="sk-text">600</text>
      <rect x="110" y="200" width="12" height="12" class="sk-schaden"/><text x="128" y="210" class="sk-klein">Kantenschaden</text>
    </svg>`;
  }
  return `<div class="skizze-leer"><span class="mono">${esc(b.id)}</span><small>Keine Skizze hinterlegt</small></div>`;
}

// Schematischer Gebäudeschnitt mit Herkunft und optionalem Ziel.
function schnitt(von, nach, raumVon, raumNach) {
  const gs = [...PROJEKT.geschosse].reverse(); const H = 34;
  const y = (g) => 10 + gs.indexOf(g) * H;
  return `<svg class="schnitt" viewBox="0 0 260 ${gs.length * H + 20}" role="img" aria-label="Gebäudeschnitt: Herkunft ${esc(von)} ${esc(raumVon || '')}${nach ? `, Ziel ${esc(nach)} ${esc(raumNach || '')}` : ''}">
    ${gs.map((g) => `<rect x="44" y="${y(g)}" width="200" height="${H - 4}" class="${g === von ? 'sn-von' : g === nach ? 'sn-nach' : 'sn-geschoss'}"/><text x="36" y="${y(g) + H / 2 + 2}" text-anchor="end" class="sn-label">${g}</text>`).join('')}
    <text x="56" y="${y(von) + H / 2 + 2}" class="sn-text">${nach ? 'Herkunft · ' : ''}${esc(raumVon || '')}</text>
    ${nach ? `<text x="56" y="${y(nach) + H / 2 + 2}" class="sn-text">Ziel · ${esc(raumNach || '')}</text>
      <path d="M232 ${y(von) + 6} L232 ${y(nach) + H - 10}" class="sn-pfeil" marker-end="url(#pfeil)"/>` : ''}
    <defs><marker id="pfeil" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8 z" class="sn-spitze"/></marker></defs>
  </svg>`;
}

// ---------- Ansicht 4: Wiederverwendungsentscheidung ----------
function entscheidungsSeite(id) {
  const e = entscheidung(id);
  if (!e) return nichtGefunden('Entscheidung', id);
  const b = bauteil(e.bauteil); const l = lage(e);
  const tonHaupt = tonVon(l.haupt);
  const aktion = l.haupt.wartet ? null
    : l.haupt.rank === 6 ? 'Zur Fachprüfung vorlegen'
      : l.haupt.rank === 5 ? (e.regel === 'tuer' ? 'Messauftrag vermerken' : l.haupt.rolle === 'montage' ? 'Nachweisanforderung vermerken' : 'Aufgabe vermerken')
        : 'Klärung vermerken';
  const verlauf = verlaufVon(b);
  return `
  <nav class="pfad" aria-label="Pfad"><a href="#entscheidungen">Entscheidungen</a><span>/</span><span aria-current="page">${esc(e.id)}</span></nav>
  <section class="seitenkopf">
    <div>
      <p class="eyebrow">Wiederverwendungsentscheidung · <span class="mono">${esc(e.id)}</span></p>
      <h1>${esc(e.titel)}</h1>
      <p class="unter">${e.regel === 'tuer' ? chip('Regel geprüft · CF-UMBAU-01 Rev. 2', 'ok') : chip('Regel im Entwurf · nicht geprüft', 'neutral')} <a href="#pass-${slug(b.id)}">Bauteilpass ${esc(b.id)}</a></p>
    </div>
  </section>

  <section class="ergebnis t-rand-${tonHaupt}" aria-labelledby="h-schritt">
    <div class="ergebnis-haupt">
      <p class="label">Nächster fachlicher Schritt</p>
      <h2 id="h-schritt" tabindex="-1">${esc(l.haupt.text)}</h2>
      <p class="ergebnis-rolle">${esc(person(l.haupt.rolle).rolle)} · ${esc(person(l.haupt.rolle).name)}, ${esc(person(l.haupt.rolle).stelle)}</p>
      <p class="ergebnis-grund">${esc(l.haupt.grund)}</p>
      ${l.vorlage && !l.haupt.wartet ? `<p class="ergebnis-grund"><b>Am ${zeit(l.vorlage.at)} zur Fachprüfung vorgelegt.</b> Die aktuelle Lage verlangt zuerst diesen Schritt.</p>` : ''}
      <div class="ergebnis-aktionen">
        ${aktion ? `<button type="button" class="knopf" id="aktion-schritt" data-action="schritt" data-id="${esc(e.id)}">${aktion}</button>` : '<span class="chip chip-info">Liegt der Fachprüfung vor</span>'}
        <span class="leise">Vermerkt im Verlauf zur Projektzeit. Simulation, nichts wird versendet.</span>
      </div>
    </div>
    <div class="ergebnis-weiter">
      <p class="label">Weiterhin offen</p>
      ${l.weiter.length ? `<ul>${l.weiter.map((w) => `<li><b>${esc(w.text)}</b><small>${esc(person(w.rolle).rolle)}</small></li>`).join('')}</ul>` : '<p class="leise">Nichts weiter offen.</p>'}
    </div>
  </section>

  <div class="entscheid-raster">
    <div class="entscheid-haupt">
      ${e.regel === 'tuer' ? anforderungenTuer(e, l.r) : anforderungenBoden(e, l.r)}
    </div>
    <aside class="entscheid-seite">
      <section class="flaeche" aria-labelledby="h-wege">
        <h2 id="h-wege">Herkunft und Ziel</h2>
        ${schnitt(b.geschoss, e.zielGeschoss, b.raum, e.ziel)}
        <p class="klein">${esc(e.herkunft)} → ${esc(e.zielText)}</p>
      </section>
      <section class="flaeche" aria-labelledby="h-fr">
        <h2 id="h-fr">Fristen</h2>
        <ul class="fristen-kompakt">${l.fristen.map((f) => { const a = abstand(f.at, state.at); return `<li><span><b>${esc(f.name)}</b><small>${esc(person(f.rolle).rolle)}</small></span><span class="mono">${zeit(f.at)}</span><span>${chip(f.status, f.ton)}<small class="${a.vorbei ? 'vorbei' : ''}">${a.text}</small></span></li>`; }).join('')}</ul>
        <p class="klein">Ein Termin dokumentiert keine ausgelöste Bestellung. Die Karte ändert keine Frist automatisch.</p>
      </section>
      <section class="flaeche" aria-labelledby="h-zust">
        <h2 id="h-zust">Zuständig</h2>
        <dl class="werte">${[['Entscheidung', e.zustaendig.entscheidung], ['Aufmaß und Nachweise', e.zustaendig.aufmass], ['Fachprüfung', e.zustaendig.pruefung]].map(([t, k]) => `<div><dt>${t}</dt><dd><b>${esc(person(k).name)}</b> · ${esc(person(k).stelle)}</dd></div>`).join('')}</dl>
      </section>
      <section class="flaeche" aria-labelledby="h-v2">
        <h2 id="h-v2">Verlauf</h2>
        <ol class="verlauf">${verlauf.map((v) => `<li><span class="mono">${zeit(v.at, false)}</span><p>${esc(v.text)}<small>${esc(person(v.von).rolle)} · ${esc(person(v.von).name)}${v.sim ? ' · Simulation, nichts versendet' : ''}</small></p></li>`).join('')}</ol>
      </section>
    </aside>
  </div>`;
}

function anforderungenTuer(e, r) {
  const m = state.tuerAufmass;
  const fe = r.fieldErrors || {};
  const befundTon = r.width.kind === 'met' ? 'ok' : r.width.kind === 'missed' ? 'crit' : 'warn';
  const feld = (id, label, inner, key) => `<div class="feld ${fe[key] ? 'feld-fehler' : ''}"><label for="${id}">${label}</label>${inner}${fe[key] ? `<p class="feld-meldung" id="${id}-f">${esc(fe[key])}</p>` : ''}</div>`;
  const opts = (liste, wert) => liste.map((o) => `<option ${o === wert ? 'selected' : ''}>${esc(o)}</option>`).join('');
  return `
  <section class="flaeche" aria-labelledby="h-anf">
    <div class="block-kopf"><h2 id="h-anf">Anforderungen am Zielort</h2><span class="leise">Quelle: ${esc(R.REQUIREMENT.origin)}</span></div>
    <div class="tabelle-rahmen"><table class="einfach anforderungen">
      <thead><tr><th scope="col">Kriterium</th><th scope="col">Soll</th><th scope="col">Ist</th><th scope="col">Befund</th><th scope="col">Prüfweg</th></tr></thead>
      <tbody>
        <tr><td><b>Breite Rohbauöffnung B-02</b><small>${esc(R.REQUIREMENT.measuringPoint)}</small></td><td class="mono nw">${R.REQUIREMENT.minMm}–${R.REQUIREMENT.maxMm} mm</td><td class="mono">${esc(r.istText)}</td><td>${chip(r.width.text, befundTon)}</td><td>Regel</td></tr>
        ${R.OTHER_CHECKS.map((c) => `<tr><td><b>${esc(c)}</b></td><td>laut Fachprüfung</td><td>nicht bewertet</td><td>${chip('offen', 'neutral')}</td><td>Fachprüfung</td></tr>`).join('')}
        <tr><td><b>Schutzanforderungen</b></td><td colspan="2">${esc(e.schutz)}</td><td>${chip('Annahme', 'neutral')}</td><td>Raumbuch</td></tr>
      </tbody>
    </table></div>
    ${massskala(r)}
    <p class="klein">${esc(R.TEXT.widthNote)}</p>
  </section>

  <section class="flaeche" aria-labelledby="h-aufmass">
    <div class="block-kopf"><h2 id="h-aufmass">Aufmaß Zielöffnung B-02</h2><span class="leise">Eingabe für die Simulation</span></div>
    <div class="formular" id="tuer-form">
      ${feld('t-wert', 'Wert in mm', `<input id="t-wert" data-feld="valueText" inputmode="decimal" value="${esc(m.valueText)}" ${fe.valueText ? 'aria-describedby="t-wert-f" aria-invalid="true"' : ''}>`, 'valueText')}
      ${feld('t-bezug', 'Messbezug', `<select id="t-bezug" data-feld="reference">${opts(R.REFERENCE_OPTIONS, m.reference)}</select>`, 'reference')}
      ${feld('t-status', 'Messstatus', `<select id="t-status" data-feld="status">${opts(R.STATUS_OPTIONS, m.status)}</select>`, 'status')}
      ${feld('t-quelle', 'Belegquelle', `<input id="t-quelle" data-feld="source" value="${esc(m.source)}" placeholder="z. B. Aufmaßnotiz">`, 'source')}
      ${feld('t-datum', 'Messdatum', `<input id="t-datum" type="date" data-feld="measuredOn" value="${esc(m.measuredOn)}">`, 'measuredOn')}
      ${feld('t-eingang', 'Eingang bei der Planung', `<input id="t-eingang" type="datetime-local" data-feld="receivedAt" value="${esc(m.receivedAt)}">`, 'receivedAt')}
    </div>
    <div class="formular-aktionen">
      <button type="button" class="knopf-zweit" id="btn-tuer-beispiel" data-action="tuer-beispiel">Beispielaufmaß einsetzen</button>
      <button type="button" class="knopf-leise" id="btn-tuer-leeren" data-action="tuer-leeren">Aufmaß leeren</button>
      <span class="leise">Beispiel: 890 mm, gemessen 18.11., eingegangen 18.11. 15:00. Wirkt erst ab dieser Projektzeit.</span>
    </div>
  </section>`;
}

function massskala(r) {
  const min = 860, max = 920, W = 600;
  const x = (v) => 20 + ((v - min) / (max - min)) * (W - 40);
  const wert = r.usable ? Number(String(state.tuerAufmass.valueText).replace(',', '.')) : null;
  const ticks = [860, 870, 880, 885, 890, 895, 900, 910, 920];
  return `<div class="skala"><svg viewBox="0 0 ${W} 74" role="img" aria-label="Maßskala: Sollbereich 885 bis 895 Millimeter${wert ? `, Ist ${wert} Millimeter` : ', Ist noch nicht verwertbar'}">
    <line x1="20" x2="${W - 20}" y1="34" y2="34" class="sk-achse"/>
    <rect x="${x(885)}" y="22" width="${x(895) - x(885)}" height="24" class="sk-soll"/>
    ${ticks.map((t) => `<line x1="${x(t)}" x2="${x(t)}" y1="30" y2="38" class="sk-achse"/><text x="${x(t)}" y="62" text-anchor="middle" class="sk-tick ${t === 885 || t === 895 ? 'sk-tick-b' : ''}">${t}</text>`).join('')}
    <text x="${(x(885) + x(895)) / 2}" y="16" text-anchor="middle" class="sk-tick sk-tick-b">Soll</text>
    ${wert !== null && wert >= min - 20 && wert <= max + 20 ? `<g class="sk-ist ${r.width.kind === 'met' ? 't-ok' : 't-crit'}"><path d="M${x(Math.min(Math.max(wert, min), max))} 50 l-6 10 h12 z"/><line x1="${x(Math.min(Math.max(wert, min), max))}" x2="${x(Math.min(Math.max(wert, min), max))}" y1="18" y2="50"/></g>` : ''}
  </svg><p class="skala-legende"><span><i class="sk-soll-i"></i>Sollbereich, Grenzen eingeschlossen</span><span>${wert !== null ? `Ist <b class="mono">${esc(String(state.tuerAufmass.valueText))} mm</b>` : 'Ist erscheint, sobald ein verwertbares Aufmaß vorliegt'}</span></p></div>`;
}

function anforderungenBoden(e, r) {
  const quote = Math.max(0, Math.min(1, (r.verwendbar ?? 0) / e.ist.flaecheM2));
  const bedarfAnteil = Math.min(1, r.bedarf / e.ist.flaecheM2);
  const knopfNachweis = (key, titel, am) => am
    ? `<div class="nachweis-zeile"><span><b>${titel}</b><small>eingegangen ${zeit(am)}</small></span><button type="button" class="knopf-leise" id="btn-${key}" data-action="boden-nachweis" data-key="${key}">Eingang zurücknehmen</button></div>`
    : `<div class="nachweis-zeile"><span><b>${titel}</b><small>fehlt</small></span><button type="button" class="knopf-zweit" id="btn-${key}" data-action="boden-nachweis" data-key="${key}">Eingang zur Projektzeit vermerken</button></div>`;
  return `
  <section class="flaeche" aria-labelledby="h-anf">
    <div class="block-kopf"><h2 id="h-anf">Anforderungen am Zielort</h2><span class="leise">Quelle: fiktives Raumbuch 3.OG · Simulationsannahme</span></div>
    <div class="tabelle-rahmen"><table class="einfach anforderungen">
      <thead><tr><th scope="col">Kriterium</th><th scope="col">Soll</th><th scope="col">Ist</th><th scope="col">Befund</th><th scope="col">Prüfweg</th></tr></thead>
      <tbody>${r.kriterien.map((k) => `<tr><td><b>${esc(k.name)}</b></td><td class="zahlen">${esc(k.soll)}</td><td>${esc(k.ist)}</td><td>${chip(k.befund, k.ton)}</td><td>${esc(k.weg)}</td></tr>`).join('')}
        <tr><td><b>Schutzanforderungen</b></td><td colspan="2">${esc(e.schutz)}</td><td>${chip('Annahme', 'neutral')}</td><td>Raumbuch</td></tr></tbody>
    </table></div>
    <div class="mengen">
      <div class="mengen-balken" role="img" aria-label="Menge: ${zahl(e.ist.flaecheM2)} Quadratmeter erfasst, ${r.verwendbar === null ? 'verwendbare Menge unbekannt' : `${zahl(r.verwendbar)} verwendbar`}, Bedarf mit Reserve ${zahl(r.bedarf)}">
        <i class="mb-verwendbar ${r.kriterien[1].ton === 'crit' ? 't-crit' : ''}" style="width:${quote * 100}%"></i>
        <span class="mb-bedarf" style="left:${bedarfAnteil * 100}%"></span>
      </div>
      <p class="skala-legende"><span><i class="mb-i-v"></i>verwendbar ${r.verwendbar === null ? '–' : `<b class="mono">${zahl(r.verwendbar)} m²</b>`} von <span class="mono">${zahl(e.ist.flaecheM2)} m²</span> erfasst</span><span><i class="mb-i-b"></i>Bedarf mit Reserve <b class="mono">${zahl(r.bedarf)} m²</b></span></p>
    </div>
    <p class="klein">Der Befund bewertet Rastermaß, Menge (Grenze eingeschlossen) und die Aufbauhöhe laut Nachweis. Über die Eignung entscheiden die zuständigen Fachleute.</p>
  </section>

  <section class="flaeche" aria-labelledby="h-boden-in">
    <div class="block-kopf"><h2 id="h-boden-in">Bestand und Nachweise</h2><span class="leise">Eingabe für die Simulation</span></div>
    <div class="formular">
      <div class="feld ${r.beschaedigtGueltig ? '' : 'feld-fehler'}"><label for="b-schaden">Beschädigte Fläche in m² (aus Stichprobe hochgerechnet)</label>
        <input id="b-schaden" inputmode="decimal" value="${esc(state.boden.beschaedigtM2)}" ${r.beschaedigtGueltig ? '' : 'aria-invalid="true" aria-describedby="b-schaden-f"'}>
        ${r.beschaedigtGueltig ? '' : `<p class="feld-meldung" id="b-schaden-f">${esc(r.beschaedigtFehler)}</p>`}</div>
    </div>
    ${knopfNachweis('hoeheAm', 'Herstellerangabe Stützen (Verstellbereich)', r.hoehe)}
    ${knopfNachweis('lastAm', 'Nachweis Tragfähigkeit', r.last)}
    <p class="klein">Ein Eingang zählt erst ab seiner Projektzeit. Wer die Projektzeit zurückstellt, sieht den Stand davor.</p>
  </section>`;
}

// ---------- Entscheidungsliste ----------
function entscheidungen() {
  return `
  <section class="seitenkopf"><div><p class="eyebrow">${esc(PROJEKT.name)}</p><h1>Entscheidungen</h1>
  <p class="unter">Je Bauteil und Zielort eine Entscheidung mit Anforderungen, Fristen und Zuständigkeit.</p></div></section>
  <div class="entscheidungsliste">${sortiert(ENTSCHEIDUNGEN.map((e) => ({ e, l: lage(e) }))).map(({ e, l }) => entscheidungZeile(e, l)).join('')}</div>
  <p class="hinweis-zeile">Sortiert nach Handlungsdruck: Rang des nächsten Schritts, dann nächste Frist. Neue Entscheidungen entstehen aus dem Bauteilpass. Im Entwurf sind nur E-01 und E-02 angelegt.</p>`;
}

function nichtGefunden(art, id) {
  return `<div class="leer"><b>${art} ${esc(id)} gibt es in diesem Projekt nicht.</b><p>Der Link ist veraltet oder falsch geschrieben.</p><a class="knopf" href="#uebersicht">Zur Projektübersicht</a></div>`;
}

// ---------- Symbole ----------
function icon(n) {
  const p = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    stack: '<path d="M12 3 3 7.5l9 4.5 9-4.5z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    loop: '<path d="M17 4.5A8.5 8.5 0 0 0 4.2 9"/><path d="M4 4v5h5"/><path d="M7 19.5A8.5 8.5 0 0 0 19.8 15"/><path d="M20 20v-5h-5"/>',
  }[n];
  return `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
}

// ---------- Rendern und Ereignisse ----------
let letzteRoute = '';
function render(fokus) {
  const r = route();
  const inhalt = r.view === 'bestand' ? bestand() : r.view === 'pass' ? pass(r.id) : r.view === 'entscheidung' ? entscheidungsSeite(r.id)
    : r.view === 'entscheidungen' ? entscheidungen() : r.view === 'unbekannt' ? nichtGefunden('Ansicht', r.id) : uebersicht();
  const aktiv = document.activeElement && document.activeElement.id;
  const pos = aktiv && document.activeElement.selectionStart;
  app.innerHTML = rahmen(r, inhalt);
  document.title = `${{ uebersicht: 'Projektübersicht', bestand: 'Bauteilbestand', pass: `Bauteilpass ${r.id}`, entscheidung: `Entscheidung ${r.id}`, entscheidungen: 'Entscheidungen', unbekannt: 'Nicht gefunden' }[r.view]} · CircularFlow Entwurf`;
  const neu = location.hash !== letzteRoute; letzteRoute = location.hash;
  if (neu && fokus !== false) { document.getElementById('inhalt').focus({ preventScroll: true }); window.scrollTo(0, 0); }
  else {
    const el = (aktiv && document.getElementById(aktiv)) || (state.fokus && document.getElementById(state.fokus));
    if (el) {
      el.focus({ preventScroll: true });
      if (el.id === aktiv && pos != null && el.setSelectionRange) { try { el.setSelectionRange(pos, pos); } catch { /* Datumsfelder */ } }
    }
  }
  state.fokus = null;
  // Änderung des nächsten Schritts ansagen, ohne die gesamte Ansicht vorlesen zu lassen.
  if (r.view === 'entscheidung' && entscheidung(r.id)) {
    const text = lage(entscheidung(r.id)).haupt.text;
    if (letzteAnsage.id === r.id && letzteAnsage.text !== text) ansage.textContent = `Nächster Schritt: ${text}`;
    letzteAnsage = { id: r.id, text };
  } else letzteAnsage = { id: '', text: '' };
}

function vermerke(text, sekunden = 3200) {
  render(false); toast.textContent = text;
  clearTimeout(vermerke.t); vermerke.t = setTimeout(() => { toast.textContent = ''; }, sekunden);
}

app.addEventListener('click', (ev) => {
  const zeile = ev.target.closest('tr[data-href]');
  if (zeile && !ev.target.closest('a')) { gehe(zeile.dataset.href); return; }
  const g = ev.target.closest('[data-gruppe]');
  if (g) { state.filter = { q: '', gruppe: g.dataset.gruppe, status: '', geschoss: '', offen: false }; }
  if (ev.target.closest('[data-offen]')) { state.filter = { q: '', gruppe: '', status: '', geschoss: '', offen: true }; }
  const a = ev.target.closest('[data-action]');
  if (!a) return;
  const act = a.dataset.action;
  if (act === 'skip') { document.getElementById('inhalt').focus(); return; }
  if (act === 'filter-reset') { state.filter = { q: '', gruppe: '', status: '', geschoss: '', offen: false }; state.fokus = 'f-gruppe'; render(false); }
  if (act === 'tuer-beispiel') { state.tuerAufmass = { ...R.SAMPLE_MEASUREMENT }; vermerke(bis(R.SAMPLE_MEASUREMENT.receivedAt) ? 'Beispielaufmaß eingesetzt.' : 'Beispielaufmaß eingesetzt. Es wirkt ab Projektzeit Mi 18.11., 15:00.'); }
  if (act === 'tuer-leeren') { state.tuerAufmass = R.emptyMeasurement(); vermerke('Aufmaß geleert.'); }
  if (act === 'boden-nachweis') { const k = a.dataset.key; state.boden[k] = state.boden[k] && bis(state.boden[k]) ? null : state.at; vermerke(state.boden[k] ? 'Eingang vermerkt.' : 'Eingang zurückgenommen.'); }
  if (act === 'schritt') {
    const e = entscheidung(a.dataset.id); const l = lage(e); const b = bauteil(e.bauteil);
    if (l.haupt.wartet) return;
    const fach = l.haupt.rank === 6;
    const text = fach ? `Variante ${e.id} zur Fachprüfung vorgelegt (an ${person('fach').name}).` : `${l.haupt.text}: als Aufgabe für ${person(l.haupt.rolle).rolle} vermerkt.`;
    if (state.ereignisse.some((x) => x.entscheidung === e.id && x.at === state.at && x.text === text)) { vermerke('Zu dieser Projektzeit bereits vermerkt.'); return; }
    state.ereignisse.push({ at: state.at, von: 'planung', bauteil: b.id, entscheidung: e.id, sim: true, art: fach ? 'vorlage' : 'aufgabe', text });
    state.fokus = 'h-schritt';
    vermerke(fach ? 'Zur Fachprüfung vorgelegt. Status des Bauteils aktualisiert.' : 'Im Verlauf vermerkt.');
  }
});

app.addEventListener('input', (ev) => {
  const t = ev.target;
  if (t.dataset.feld) { state.tuerAufmass = { ...state.tuerAufmass, [t.dataset.feld]: t.value }; render(false); }
  if (t.id === 'b-schaden') { state.boden.beschaedigtM2 = t.value; render(false); }
  if (t.id === 'suche-q') { state.filter.q = t.value; if (route().view === 'bestand') render(false); }
});

app.addEventListener('change', (ev) => {
  const t = ev.target;
  if (t.id === 'projektzeit') { state.at = t.value; vermerke(`Projektzeit ${PROJEKTZEITEN.find((z) => z.at === t.value).label}. Alle Ansichten zeigen diesen Stand.`); }
  if (t.id === 'f-gruppe') { state.filter.gruppe = t.value; render(false); }
  if (t.id === 'f-status') { state.filter.status = t.value; render(false); }
  if (t.id === 'f-geschoss') { state.filter.geschoss = t.value; render(false); }
  if (t.id === 'f-offen') { state.filter.offen = t.checked; render(false); }
});

app.addEventListener('submit', (ev) => {
  if (ev.target.id === 'suche') { ev.preventDefault(); gehe('#bestand'); }
});

window.addEventListener('hashchange', () => render());

ladeTuerregel().then((mod) => {
  R = mod; state.tuerAufmass = R.emptyMeasurement(); render();
}).catch(() => {
  app.innerHTML = '<div class="leer"><b>Die Türregel konnte nicht geladen werden.</b><p>Den Entwurf über einen lokalen Server vom Repository-Wurzelverzeichnis aus öffnen.</p></div>';
});
