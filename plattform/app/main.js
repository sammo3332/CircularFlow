// Einstieg: Router, Rahmen, Ereignisse. Ein gemeinsamer Datensatz für alle Ansichten.
import { REGIONEN, PROJEKTZEITEN, GRUPPEN } from './daten.js';
import { ladePersistenz, speichere, loesche, baueDaten, leerePersistenz } from './zustand.js';
import { schluessel, neueEntscheidung, bauteilAusErfassung, naechsteBauteilId, pruefeErfassung, erkennungSimulation, radarSchritt, pruefeMeldung, ifcVorpruefung, ZAHL, lage, beispielAufmassRechtzeitig } from './regeln.js';
import { esc, icon, slug, pchip, nichtGefunden } from './ui.js';
import { zeit, jetztBerlin } from './zeit.js';
import { karteMontieren, karteEntfernen, markerHervorheben } from './karte.js';
import { startseite, projektUebersicht, popupHtml, gefilterteProjekte } from './ansichten/projekte.js';
import { gebaeudeAnsicht } from './ansichten/gebaeude.js';
import { bestand, pass } from './ansichten/bauteile.js';
import { entscheidungsListe, entscheidungsSeite } from './ansichten/entscheidung.js';
import { erfassung, leererEntwurf } from './ansichten/erfassung.js';
import { radar, leereMeldung } from './ansichten/radar.js';

const app = document.getElementById('app');
const speicher = (() => { try { const s = window.localStorage; s.setItem('cf-test', '1'); s.removeItem('cf-test'); return s; } catch { return null; } })();
let R = null; let geo = null; let geoFehler = '';
let p = ladePersistenz(speicher);
let db = baueDaten(p);

const ui = {
  at: PROJEKTZEITEN[0].at,
  start: { region: 'dortmund', art: '', nurAngebote: false, osm: false, ansicht: null },
  gebaeude: {},
  bestand: { q: '', gruppe: '', status: '', etage: '', offen: false, mobil: false },
  erfassung: leererEntwurf(),
  radar: { status: '', notiz: {}, bezirk: {}, verwerfen: {}, fehler: {}, meldung: leereMeldung(), meldungFehler: {}, gespeichert: null },
  importe: { ifc: null, ifcSim: false, scanSim: false },
  zuletzt: null, zielWahl: null, zuordnungFehler: '', resetFrage: false, fokus: null, fokusNachRoute: null, speicherHinweis: '',
};

const toast = document.createElement('div');
toast.className = 'toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
document.body.append(toast);
function melde(text, ms = 3600) { toast.textContent = text; clearTimeout(melde.t); melde.t = setTimeout(() => { toast.textContent = ''; }, ms); }

const eigeneAenderungen = () => p.erfassungen.length + p.zuordnungen.length + p.ereignisse.length + p.meldungen.length + p.projekteAusRadar.length
  + Object.keys(p.ezustand).length + Object.keys(p.radar).length + Object.keys(p.werte).length;
const ctx = () => ({ R, at: ui.at, daten: db, ereignisse: p.ereignisse, ezustand: p.ezustand, ui, geo, eigeneAenderungen: eigeneAenderungen() });

function uebernehmen(aenderung) {
  aenderung(p);
  db = baueDaten(p);
  const r = speichere(speicher, p);
  if (!speicher) ui.speicherHinweis = 'Dieser Browser erlaubt keinen lokalen Speicher. Änderungen gehen beim Neuladen verloren.';
  else if (!r.ok) ui.speicherHinweis = 'Speichern im Browser ist fehlgeschlagen. Änderungen gehen beim Neuladen verloren.';
  else if (r.fotosNichtGespeichert) ui.speicherHinweis = `Der Browserspeicher ist voll. ${r.fotosNichtGespeichert === 1 ? 'Ein Foto bleibt' : `${r.fotosNichtGespeichert} Fotos bleiben`} nur bis zum Neuladen erhalten. Diese Bauteile zeigen „Foto nicht gespeichert“ unter den offenen Nachweisen.`;
  else ui.speicherHinweis = '';
}

// ---------- Router ----------
const projektPerSlug = (s) => db.projekte.find((x) => slug(x.kurz) === s);
function route() {
  let h;
  try { h = decodeURIComponent((location.hash || '#projekte').slice(1)); } catch { return { view: 'fehlt', art: 'Seite', id: location.hash.slice(1) }; }
  const m = (prefix) => (h.startsWith(prefix) ? h.slice(prefix.length) : null);
  if (h === 'projekte' || h === '') return { view: 'start' };
  for (const [prefix, view] of [['projekt-', 'projekt'], ['gebaeude-', 'gebaeude'], ['bestand-', 'bestand'], ['entscheidungen-', 'entscheidungen']]) {
    const rest = m(prefix); if (rest !== null) { const pr = projektPerSlug(rest); return pr ? { view, p: pr } : { view: 'fehlt', art: 'Projekt', id: rest }; }
  }
  for (const [prefix, view] of [['raum-', 'raum'], ['pass-', 'pass'], ['entscheidung-', 'entscheidung'], ['erfassung-', 'erfassung']]) {
    const rest = m(prefix); if (rest === null) continue;
    const i = rest.indexOf('-'); const pr = projektPerSlug(i > 0 ? rest.slice(0, i) : rest); const id = i > 0 ? rest.slice(i + 1) : '';
    if (!pr) return { view: 'fehlt', art: 'Projekt', id: rest };
    if (view === 'raum' || view === 'erfassung') {
      const raum = (pr.gebaeude || []).flatMap((g) => g.etagen.flatMap((e) => e.raeume)).find((r) => slug(r.id) === id);
      if (!raum) return { view: 'fehlt', art: 'Raum', id };
      return view === 'raum' ? { view: 'gebaeude', p: pr, raum: raum.id } : { view: 'erfassung', p: pr, raum: raum.id };
    }
    if (view === 'pass') { const b = db.bauteile.find((x) => x.projekt === pr.kurz && slug(x.id) === id); return b ? { view, p: pr, b } : { view: 'fehlt', art: 'Bauteil', id }; }
    const e = db.entscheidungen.find((x) => x.projekt === pr.kurz && slug(x.id) === id); return e ? { view, p: pr, e } : { view: 'fehlt', art: 'Entscheidung', id };
  }
  if (h === 'erfassung') return { view: 'erfassung' };
  if (h === 'radar') return { view: 'radar', tab: 'hinweise' };
  if (h === 'radar-quellen') return { view: 'radar', tab: 'quellen' };
  if (h === 'radar-melden') return { view: 'radar', tab: 'melden' };
  const hi = m('hinweis-'); if (hi !== null) { const x = db.hinweise.find((y) => slug(y.id) === hi); return x ? { view: 'radar', tab: 'hinweise', hinweis: x } : { view: 'fehlt', art: 'Hinweis', id: hi }; }
  return { view: 'fehlt', art: 'Seite', id: h };
}
const gehe = (hash) => { if (location.hash === hash) render(); else location.hash = hash; };

// ---------- Rahmen ----------
function rahmen(r, inhalt) {
  const bereich = r.view === 'radar' ? 'radar' : r.view === 'erfassung' ? 'erfassung' : 'projekte';
  const haupt = [['projekte', 'Projekte', 'karte'], ['radar', 'Radar', 'radar'], ['erfassung', 'Erfassung', 'kamera']];
  const zeitwahl = (id) => `<label class="projektzeit" for="${id}"><span>Projektzeit <em>Simulation</em></span><select id="${id}">${PROJEKTZEITEN.map((z) => `<option value="${z.at}" ${z.at === ui.at ? 'selected' : ''}>${z.label}</option>`).join('')}</select></label>`;
  const pr = r.p;
  return `
  <button type="button" class="skip" data-action="skip">Zum Inhalt springen</button>
  <div class="shell">
    <aside class="rail" aria-label="Hauptnavigation">
      <a class="marke" href="#projekte"><span class="marke-zeichen" aria-hidden="true">${icon('kreislauf')}</span><span><b>CircularFlow</b><small>Bauteile im Kreislauf</small></span></a>
      <nav class="nav" aria-label="Bereiche">${haupt.map(([k, t, i]) => `<a href="#${k}" ${bereich === k ? 'aria-current="page"' : ''}>${icon(i)}<span>${t}</span></a>`).join('')}</nav>
      ${pr ? `<div class="kontext"><span class="label">Projekt</span><a href="#projekt-${slug(pr.kurz)}" class="kontext-titel">${pchip(pr)}<b>${esc(pr.name)}</b></a></div>` : ''}
      <div class="rail-fuss">${zeitwahl('projektzeit')}<p><span class="chip chip-sim">Beispieldaten</span> Projekte, Personen und Bauteile sind fiktiv. Eigene Erfassungen bleiben in diesem Browser.</p></div>
    </aside>
    <div class="arbeitsflaeche">
      <header class="kopf-mobil"><a class="marke" href="#projekte"><span class="marke-zeichen" aria-hidden="true">${icon('kreislauf')}</span><b>CircularFlow</b></a>${zeitwahl('projektzeit-m')}</header>
      ${ui.speicherHinweis ? `<p class="speicherhinweis" role="alert">${esc(ui.speicherHinweis)}</p>` : ''}
      <main id="inhalt" tabindex="-1">${inhalt}</main>
    </div>
  </div>
  <nav class="tabbar" aria-label="Hauptnavigation">${haupt.map(([k, t, i]) => `<a href="#${k}" ${bereich === k ? 'aria-current="page"' : ''}>${icon(i)}<span>${t}</span></a>`).join('')}</nav>`;
}

// ---------- Rendern ----------
let letzteRoute = null;
// Beschreibt das fokussierte Element so, dass es nach dem Neuzeichnen wiedergefunden wird, auch ohne id.
function fokusSelektor(el) {
  if (!el || el === document.body || !app.contains(el)) return null;
  if (el.id) return `#${CSS.escape(el.id)}`;
  if (el.name && el.type === 'radio') return `input[name="${CSS.escape(el.name)}"][value="${CSS.escape(el.value)}"]`;
  if (el.dataset.action) return ['action', 'wert', 'etage', 'key', 'hinweis', 'projekt', 'bauteil', 'entscheidung', 'schritt'].filter((k) => el.dataset[k] !== undefined)
    .map((k) => `[data-${k}="${CSS.escape(el.dataset[k])}"]`).join('');
  return null;
}
function render() {
  const r = route(); const neu = location.hash !== letzteRoute;
  if (neu) ui.zuordnungFehler = '';
  if (r.view === 'erfassung' && neu) {
    const ent = ui.erfassung;
    if (r.p && (ent.gespeichert || ent.projekt !== r.p.kurz || ent.raum !== r.raum)) ui.erfassung = { ...leererEntwurf(r.p.kurz, r.raum), schritt: 2, verfuegbarAb: r.p.rueckbauAb || '' };
    else if (!r.p && ent.gespeichert) ui.erfassung = leererEntwurf();
  }
  const c = ctx();
  const inhalt = !R ? '<p class="leise">Wird geladen …</p>'
    : r.view === 'start' ? startseite(c)
      : r.view === 'projekt' ? projektUebersicht(c, r.p)
        : r.view === 'gebaeude' ? gebaeudeAnsicht(c, r.p, r.raum)
          : r.view === 'bestand' ? bestand(c, r.p)
            : r.view === 'pass' ? pass(c, r.p, r.b)
              : r.view === 'entscheidungen' ? entscheidungsListe(c, r.p)
                : r.view === 'entscheidung' ? entscheidungsSeite(c, r.p, r.e)
                  : r.view === 'erfassung' ? erfassung(c)
                    : r.view === 'radar' ? radar(c, r)
                      : nichtGefunden(r.art, r.id);
  const aktiv = document.activeElement; const sel = fokusSelektor(aktiv); const pos = aktiv?.id ? aktiv.selectionStart : null;
  if (document.getElementById('karte')) karteEntfernen(ui.start.ansicht || (ui.start.ansicht = {}));
  app.innerHTML = rahmen(r, inhalt);
  document.title = `${{ start: 'Projekte', projekt: r.p?.name, gebaeude: `Gebäude ${r.p?.kurz}`, bestand: `Bestand ${r.p?.kurz}`, pass: `${r.b?.id} Bauteilpass`, entscheidungen: `Entscheidungen ${r.p?.kurz}`, entscheidung: `Entscheidung ${r.e?.id}`, erfassung: 'Erfassung', radar: 'Projektradar' }[r.view] || 'Nicht gefunden'} · CircularFlow`;
  if (r.view === 'start' && R) karteAnzeigen(c);
  letzteRoute = location.hash;
  if (neu) {
    // Nach einem Seitenwechsel: ein gezieltes Ziel (z. B. neuer Hinweis) oder der Inhaltsanfang.
    const ziel = ui.fokusNachRoute && document.getElementById(ui.fokusNachRoute);
    if (ziel) { ziel.scrollIntoView({ block: 'center' }); ziel.focus({ preventScroll: true }); } else { document.getElementById('inhalt').focus({ preventScroll: true }); window.scrollTo(0, 0); }
    ui.fokusNachRoute = null;
  } else {
    // Ein ausdrücklich gesetzter Fokus (z. B. erstes Feld mit Fehler) hat Vorrang vor dem zuletzt aktiven Element.
    const el = (ui.fokus && document.getElementById(ui.fokus)) || (sel && app.querySelector(sel));
    if (el) {
      el.focus({ preventScroll: Boolean(sel && !ui.fokus) });
      if (el === document.getElementById(aktiv?.id) && pos != null && el.setSelectionRange) { try { el.setSelectionRange(pos, pos); } catch { /* Datumsfelder */ } }
    }
  }
  ui.fokus = null;
}

function karteAnzeigen(c) {
  const el = document.getElementById('karte'); const meldung = document.getElementById('karte-meldung');
  const region = REGIONEN.find((x) => x.id === ui.start.region);
  const meldeFehler = (t) => { if (meldung) meldung.textContent = t; };
  try {
    karteMontieren(el, { region, geo, osmAn: ui.start.osm, ansicht: ui.start.ansicht, meldeFehler, projekte: gefilterteProjekte(c).map((x) => ({ p: x, popupHtml: popupHtml(c, x) })) });
    if (geoFehler) meldeFehler(geoFehler);
  } catch {
    el.classList.add('karte-aus');
    el.innerHTML = '<p>Die Karte konnte nicht geladen werden. Die Projektliste darunter enthält dieselben Projekte.</p>';
  }
}

// ---------- Ereignisse ----------
app.addEventListener('click', (ev) => {
  const zeile = ev.target.closest('tr[data-href]');
  if (zeile && !ev.target.closest('a,button,input,select')) { gehe(zeile.dataset.href); return; }
  const a = ev.target.closest('[data-action]'); if (!a) return;
  const act = a.dataset.action; const ent = ui.erfassung;
  const k = a.dataset.entscheidung;
  switch (act) {
    case 'skip': document.getElementById('inhalt').focus(); return;
    case 'start-art': ui.start.art = a.dataset.wert; break;
    case 'etage': ui.gebaeude[a.dataset.projekt] = a.dataset.etage; if (location.hash.startsWith('#raum-')) { gehe(`#gebaeude-${slug(a.dataset.projekt)}`); return; } ui.fokus = null; break;
    case 'bestand-reset': ui.bestand = { q: '', gruppe: '', status: '', etage: '', offen: false, mobil: false }; ui.fokus = 'f-gruppe'; break;
    case 'zuordnen': zuordnen(a.dataset.bauteil); return;
    case 'schritt': schrittVermerken(k); return;
    case 'aufmass-beispiel': aufmassBeispiel(k); return;
    case 'aufmass-leeren': uebernehmen((d) => { d.ezustand[k] = { ...(d.ezustand[k] || {}), aufmass: R.emptyMeasurement() }; }); melde('Aufmaß geleert.'); break;
    case 'boden-nachweis': { const key = a.dataset.key; const jetzt = p.ezustand[k]?.[key]; uebernehmen((d) => { d.ezustand[k] = { ...(d.ezustand[k] || {}), [key]: jetzt && jetzt <= ui.at ? null : ui.at }; }); melde(p.ezustand[k][key] ? 'Eingang vermerkt.' : 'Eingang zurückgenommen.'); break; }
    case 'import-ifc-sim': ui.importe.ifcSim = !ui.importe.ifcSim; break;
    case 'import-scan-sim': ui.importe.scanSim = !ui.importe.scanSim; break;
    case 'erf-gehe': ent.schritt = Number(a.dataset.schritt); ent.fehler = {}; ui.fokus = 'h-erf'; break;
    case 'erf-zurueck': ent.schritt = Math.max(1, ent.schritt - 1); ent.fehler = {}; ui.fokus = 'erf-zurueck'; break;
    case 'erf-weiter': erfWeiter(); return;
    case 'erf-speichern': erfSpeichern(); return;
    case 'erf-uebernehmen': { const w = ent.werte[a.dataset.key]; ent.werte[a.dataset.key] = { ...w, status: 'bestaetigt', quelle: 'Erkennung (Simulation), von Hand geprüft' }; ui.fokus = `w-${a.dataset.key}`; break; }
    case 'erf-leeren': ent.werte[a.dataset.key] = { eingabe: '', status: 'fehlt', quelle: '' }; ui.fokus = `w-${a.dataset.key}`; break;
    case 'erf-foto-weg': ent.foto = null; ent.erkennung = null; ent.fotoFehler = ''; break;
    case 'erf-neu': ui.erfassung = a.dataset.projekt ? { ...leererEntwurf(a.dataset.projekt, a.dataset.raum), schritt: 2, verfuegbarAb: db.projekte.find((x) => x.kurz === a.dataset.projekt)?.rueckbauAb || '' } : leererEntwurf(); ui.fokus = 'h-erf'; break;
    case 'reset-frage': ui.resetFrage = true; break;
    case 'reset-nein': ui.resetFrage = false; break;
    case 'reset-ja':
      loesche(speicher); p = leerePersistenz(); db = baueDaten(p);
      Object.assign(ui, { resetFrage: false, zuletzt: null, zielWahl: null, zuordnungFehler: '', erfassung: leererEntwurf(), radar: { status: '', notiz: {}, bezirk: {}, verwerfen: {}, fehler: {}, meldung: leereMeldung(), meldungFehler: {}, gespeichert: null }, importe: { ifc: null, ifcSim: false, scanSim: false }, speicherHinweis: '' });
      melde('Eigene Erfassungen und Änderungen gelöscht.'); break;
    case 'zum-ziel': { const sel = document.getElementById('ziel-wahl'); if (sel) { sel.scrollIntoView({ block: 'center' }); sel.focus({ preventScroll: true }); } return; }
    case 'radar-pruefen': case 'radar-bestaetigen': case 'radar-verwerfen': radarAktion(act.slice(6), a.dataset.hinweis); return;
    case 'radar-verwerfen-frage': ui.radar.verwerfen[a.dataset.hinweis] = true; ui.fokus = `notiz-${slug(a.dataset.hinweis)}`; break;
    case 'radar-verwerfen-abbrechen': delete ui.radar.verwerfen[a.dataset.hinweis]; delete ui.radar.fehler[a.dataset.hinweis]; ui.fokus = `hinweis-titel-${slug(a.dataset.hinweis)}`; break;
    case 'radar-filter': ui.radar.status = a.dataset.wert; break;
    default: return;
  }
  render();
});

app.addEventListener('input', (ev) => {
  const t = ev.target; const ent = ui.erfassung;
  if (t.dataset.aufmass) { const key = t.dataset.aufmass; uebernehmen((d) => { const alt = d.ezustand[key]?.aufmass || R.emptyMeasurement(); d.ezustand[key] = { ...(d.ezustand[key] || {}), aufmass: { ...alt, [t.dataset.feld]: t.value } }; }); render(); return; }
  if (t.dataset.schaden) { schadenEingabe(t.dataset.schaden, t.value); render(); return; }
  if (t.id === 'bestand-q') { ui.bestand.q = t.value; render(); return; }
  if (t.id === 'erf-menge') { ent.menge = t.value; delete ent.fehler.menge; render(); return; }
  if (t.id === 'erf-notiz') { ent.notiz = t.value; return; }
  if (t.dataset.wert && t.tagName === 'INPUT') {
    const f = GRUPPEN[ent.gruppe].felder.find((x) => x.key === t.dataset.wert);
    const leer = !t.value.trim();
    ent.werte[f.key] = { eingabe: t.value, status: leer ? 'fehlt' : f.art === 'mass' ? 'gemessen' : 'bestaetigt', quelle: leer ? '' : f.art === 'mass' ? 'Messung vor Ort (mobile Erfassung)' : 'Eingabe vor Ort' };
    delete ent.fehler[`wert-${f.key}`]; render(); return;
  }
  if (t.dataset.radarNotiz) { ui.radar.notiz[t.dataset.radarNotiz] = t.value; if (ui.radar.fehler[t.dataset.radarNotiz]) delete ui.radar.fehler[t.dataset.radarNotiz].notiz; return; }
  if (t.dataset.meldung) { ui.radar.meldung[t.dataset.meldung] = t.type === 'checkbox' ? t.checked : t.value; delete ui.radar.meldungFehler[t.dataset.meldung]; }
});

app.addEventListener('change', async (ev) => {
  const t = ev.target; const ent = ui.erfassung;
  if (t.id === 'projektzeit' || t.id === 'projektzeit-m') { ui.at = t.value; render(); melde(`Projektzeit ${PROJEKTZEITEN.find((z) => z.at === t.value).label}. Alle Ansichten zeigen diesen Stand.`); return; }
  if (t.id === 'nur-angebote') ui.start.nurAngebote = t.checked;
  else if (t.id === 'osm') ui.start.osm = t.checked;
  else if (t.id === 'region') ui.start.region = t.value;
  else if (t.id === 'f-gruppe') ui.bestand.gruppe = t.value;
  else if (t.id === 'f-status') ui.bestand.status = t.value;
  else if (t.id === 'f-etage') ui.bestand.etage = t.value;
  else if (t.id === 'f-offen') ui.bestand.offen = t.checked;
  else if (t.id === 'f-mobil') ui.bestand.mobil = t.checked;
  else if (t.id === 'ziel-wahl') { ui.zuordnungFehler = ''; ui.zielWahl = { fuer: t.dataset.bauteil, wert: t.value }; }
  else if (t.id === 'erf-projekt') { ent.projekt = t.value; ent.raum = ''; ent.verfuegbarAb = db.projekte.find((x) => x.kurz === t.value)?.rueckbauAb || ''; delete ent.fehler.ort; }
  else if (t.id === 'erf-raum') { ent.raum = t.value; delete ent.fehler.ort; }
  else if (t.name === 'erf-gruppe') { gruppeWaehlen(t.value); }
  else if (t.name === 'erf-zustand') ent.zustand = t.value;
  else if (t.id === 'erf-verfuegbar') { ent.verfuegbarAb = t.value; delete ent.fehler.verfuegbarAb; }
  else if (t.dataset.wert && t.tagName === 'SELECT') { ent.werte[t.dataset.wert] = { eingabe: t.value, status: t.value ? 'bestaetigt' : 'fehlt', quelle: t.value ? 'Auswahl vor Ort' : '' }; }
  else if (t.id === 'erf-foto') { await fotoAufnehmen(t.files?.[0]); return; }
  else if (t.id === 'ifc-datei') { await ifcPruefen(t.files?.[0]); return; }
  else if (t.dataset.meldung) { ui.radar.meldung[t.dataset.meldung] = t.type === 'checkbox' ? t.checked : t.value; delete ui.radar.meldungFehler[t.dataset.meldung]; }
  else if (t.dataset.radarBezirk) { ui.radar.bezirk[t.dataset.radarBezirk] = t.value; delete ui.radar.fehler[t.dataset.radarBezirk]?.bezirk; }
  else return;
  render();
});

app.addEventListener('submit', (ev) => {
  if (ev.target.id === 'meldeformular') { ev.preventDefault(); meldungSpeichern(); }
});

app.addEventListener('mouseover', (ev) => { const z = ev.target.closest('[data-hover]'); if (z) markerHervorheben(z.dataset.hover, true); });
app.addEventListener('mouseout', (ev) => { const z = ev.target.closest('[data-hover]'); if (z) markerHervorheben(z.dataset.hover, false); });
app.addEventListener('focusin', (ev) => { const z = ev.target.closest('[data-hover]'); if (z) markerHervorheben(z.dataset.hover, true); });
app.addEventListener('focusout', (ev) => { const z = ev.target.closest('[data-hover]'); if (z) markerHervorheben(z.dataset.hover, false); });
window.addEventListener('hashchange', render);

// ---------- Aktionen ----------
function zuordnen(bkey) {
  const wahl = document.getElementById('ziel-wahl')?.value || (ui.zielWahl?.fuer === bkey ? ui.zielWahl.wert : '');
  if (!wahl) { ui.zuordnungFehler = 'Bitte ein Ziel wählen.'; ui.fokus = 'ziel-wahl'; render(); return; }
  const [art, projekt, id] = wahl.split('|');
  const b = db.bauteile.find((x) => `${x.projekt}:${x.id}` === bkey);
  const e = neueEntscheidung(ctx(), b, { art, projekt, id });
  uebernehmen((d) => {
    d.zuordnungen.push(e);
    d.ereignisse.push({ at: ui.at, von: 'browser', bauteil: bkey, entscheidung: schluessel(e.projekt, e.id), art: 'anlage', sim: true, text: `Entscheidung ${e.id} angelegt: ${b.id} → ${art === 'zieloeffnung' ? 'Zielöffnung' : 'Bedarf'} ${projekt === b.projekt ? '' : `${projekt} · `}${id}.` });
  });
  ui.zuordnungFehler = ''; ui.zielWahl = null; ui.fokus = 'h-handlung';
  render(); melde(`Entscheidung ${e.id} angelegt. Der nächste Schritt steht oben im Pass.`);
}

function schrittVermerken(k) {
  const e = db.entscheidungen.find((x) => schluessel(x.projekt, x.id) === k);
  const l = lage(ctx(), e); if (l.haupt.wartet) return;
  const fach = l.haupt.rank === 6 && e.regel !== 'einfach';
  const rolle = { montage: 'Montagebetrieb', fach: 'Fachprüfung', bauleitung: 'Bauleitung' }[l.haupt.rolle] || 'Planung';
  const text = fach ? `Variante ${e.id} zur Fachprüfung vorgelegt (an L. Brandt, fiktiv).` : `${l.haupt.text}: als Aufgabe für ${rolle} vermerkt.`;
  if (p.ereignisse.some((x) => x.entscheidung === k && x.at === ui.at && x.text === text)) { melde('Zu dieser Projektzeit bereits vermerkt.'); return; }
  uebernehmen((d) => d.ereignisse.push({ at: ui.at, von: 'browser', bauteil: schluessel(e.projekt, e.bauteil), entscheidung: k, art: fach ? 'vorlage' : 'aufgabe', sim: true, text }));
  ui.fokus = 'h-schritt'; render(); melde(fach ? 'Zur Fachprüfung vorgelegt. Status des Bauteils aktualisiert.' : 'Im Verlauf vermerkt.');
}

function aufmassBeispiel(k) {
  // Ein Klick: Beispielaufmaß mit Eingang vor der Aufmaßfrist setzen und die Projektzeit bei Bedarf bis zum Eingang vorstellen.
  const e = db.entscheidungen.find((x) => schluessel(x.projekt, x.id) === k);
  const z = db.zieloeffnungen.find((x) => x.projekt === (e.ziel.projekt || e.projekt) && x.id === e.ziel.id);
  const { aufmass, at } = beispielAufmassRechtzeitig(R, z, ui.at, PROJEKTZEITEN);
  uebernehmen((d) => { d.ezustand[k] = { ...(d.ezustand[k] || {}), aufmass }; });
  const zeitGestellt = at !== ui.at; ui.at = at;
  ui.fokus = 'aufmass-eingang'; render();
  melde(`Beispielaufmaß ${aufmass.valueText} mm eingegangen ${zeit(aufmass.receivedAt)}, vor der Aufmaßfrist ${zeit(z.measureDeadline)}.${zeitGestellt ? ` Projektzeit auf ${zeit(at)} gestellt.` : ''}`);
}

function schadenEingabe(k, wert) {
  const e = db.entscheidungen.find((x) => schluessel(x.projekt, x.id) === k);
  uebernehmen((d) => {
    d.ezustand[k] = { ...(d.ezustand[k] || {}), beschaedigtRoh: wert };
    // Gültige Eingabe zählt wie jede getippte Messung als „gemessen“; leer, ungültig oder größer als die Fläche heißt „fehlt“.
    const roh = String(wert).trim(); const bkey = schluessel(e.projekt, e.bauteil);
    const flaeche = db.bauteile.find((b) => schluessel(b.projekt, b.id) === bkey)?.menge ?? 0;
    const zahl = ZAHL.test(roh) ? Number(roh.replace(',', '.')) : null;
    const gueltig = zahl !== null && zahl <= flaeche;
    d.werte[bkey] = { ...(d.werte[bkey] || {}), beschaedigt: gueltig ? { wert: zahl, status: 'gemessen', quelle: `Stichprobe vor Ort, hochgerechnet (Eingabe in Entscheidung ${e.id})` } : { wert: null, status: 'fehlt', quelle: '' } };
  });
}

// ---------- Erfassung ----------
function gruppeWaehlen(g) {
  const ent = ui.erfassung; ent.gruppe = g; delete ent.fehler.gruppe;
  ent.werte = {};
  const vorschlag = ent.erkennung && ent.erkennung.gruppe === g ? GRUPPEN[g].vorschlag : {};
  for (const [key, wert] of Object.entries(vorschlag)) ent.werte[key] = { eingabe: String(wert), status: 'vorgeschlagen', quelle: 'Erkennung (Simulation)' };
  if (GRUPPEN[g].einheit === 'Stk' && !ZAHL.test(String(ent.menge).trim())) ent.menge = '1';
}

function erfWeiter() {
  const ent = ui.erfassung; const f = pruefeErfassung(ent);
  const relevant = { 1: ['ort'], 2: [], 3: ['gruppe', 'menge', 'verfuegbarAb'], 4: Object.keys(f).filter((x) => x.startsWith('wert-')) }[ent.schritt] || [];
  ent.fehler = Object.fromEntries(Object.entries(f).filter(([x]) => relevant.includes(x)));
  if (Object.keys(ent.fehler).length) {
    const erstesWert = Object.keys(ent.fehler).find((x) => x.startsWith('wert-'));
    ui.fokus = ent.schritt === 1 ? 'erf-raum' : ent.schritt === 3 ? (ent.fehler.gruppe ? 'erf-gruppe-feld' : ent.fehler.menge ? 'erf-menge' : 'erf-verfuegbar') : erstesWert ? `w-${erstesWert.slice(5)}` : 'h-erf';
    render(); return;
  }
  ent.schritt += 1; ui.fokus = 'h-erf'; render();
}

function erfSpeichern() {
  const ent = ui.erfassung; const f = pruefeErfassung(ent);
  if (Object.keys(f).length) { ent.fehler = f; ui.fokus = 'erf-fehler'; render(); return; }
  const pr = db.projekte.find((x) => x.kurz === ent.projekt);
  const etage = pr.gebaeude[0].etagen.find((e) => e.raeume.some((r) => r.id === ent.raum)).id;
  const id = naechsteBauteilId(db.bauteile, ent.projekt, ent.gruppe);
  const b = bauteilAusErfassung(ent, { id, at: ui.at, etage });
  uebernehmen((d) => { d.erfassungen.push(b); });
  const fotoNurBisNeuladen = ui.speicherHinweis.startsWith('Der Browserspeicher ist voll');
  const key = `${b.projekt}:${b.id}`;
  ui.zuletzt = key;
  ui.erfassung = { ...leererEntwurf(), gespeichert: { key, fotoHinweis: fotoNurBisNeuladen && b.foto ? 'Foto nur bis zum Neuladen gespeichert' : '' } };
  ui.fokus = 'h-gesp'; render(); melde(`${b.projekt} · ${b.id} gespeichert.`);
}

function ladeBild(url) { return new Promise((ok, fehler) => { const img = new Image(); img.onload = () => ok(img); img.onerror = () => fehler(new Error('Das Bild konnte nicht gelesen werden. Bitte JPEG oder PNG verwenden.')); img.src = url; }); }
async function fotoAufnehmen(datei) {
  const ent = ui.erfassung; if (!datei) return;
  ent.fotoFehler = '';
  if (!datei.type.startsWith('image/')) { ent.fotoFehler = 'Die Datei ist kein Bild.'; render(); return; }
  if (datei.size > 20 * 1024 * 1024) { ent.fotoFehler = 'Das Bild ist größer als 20 MB.'; render(); return; }
  ent.fotoLaedt = true; render();
  const url = URL.createObjectURL(datei);
  try {
    const img = await ladeBild(url);
    const s = Math.min(1, 1280 / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    ent.foto = { daten: c.toDataURL('image/jpeg', 0.78), breite: c.width, hoehe: c.height, name: datei.name };
    ent.erkennung = erkennungSimulation({ breite: c.width, hoehe: c.height });
    if (!ent.gruppe) gruppeWaehlen(ent.erkennung.gruppe);
    else if (ent.gruppe === ent.erkennung.gruppe) for (const [key, wert] of Object.entries(GRUPPEN[ent.gruppe].vorschlag)) if (!ent.werte[key] || ent.werte[key].status === 'fehlt') ent.werte[key] = { eingabe: String(wert), status: 'vorgeschlagen', quelle: 'Erkennung (Simulation)' };
  } catch (err) { ent.fotoFehler = err.message; } finally { URL.revokeObjectURL(url); ent.fotoLaedt = false; }
  ui.fokus = 'erf-foto'; render();
}

async function ifcPruefen(datei) {
  if (!datei) return;
  if (datei.size > 50 * 1024 * 1024) { ui.importe.ifc = { fehler: 'Die Datei ist größer als 50 MB. Für die Vorprüfung bitte eine kleinere Datei wählen.' }; render(); return; }
  try { const text = await datei.text(); const r = ifcVorpruefung(text); ui.importe.ifc = r.gueltig ? { ...r, datei: datei.name } : { fehler: r.fehler }; } catch { ui.importe.ifc = { fehler: 'Die Datei konnte nicht gelesen werden.' }; }
  render();
}

// ---------- Radar ----------
function radarAktion(aktion, id) {
  const h = db.hinweise.find((x) => x.id === id);
  // Radar-Schritte sind echte Vorgänge: Berliner Uhrzeit statt Projektzeit-Simulation.
  const r = radarSchritt(h, aktion, { von: 'browser', notiz: ui.radar.notiz[id] || '', bezirk: ui.radar.bezirk[id] || '', at: jetztBerlin() });
  if (r.fehler) {
    ui.radar.fehler[id] = r.fehler;
    ui.fokus = r.fehler.bezirk ? `bezirk-${slug(id)}` : r.fehler.notiz ? `notiz-${slug(id)}` : `hinweis-titel-${slug(id)}`;
    render(); return;
  }
  delete ui.radar.fehler[id]; delete ui.radar.verwerfen[id];
  uebernehmen((d) => {
    d.radar[id] = { status: r.hinweis.status, verlauf: r.hinweis.verlauf, ...(r.hinweis.bezirk !== h.bezirk ? { bezirk: r.hinweis.bezirk, bezirkHinweis: r.hinweis.bezirkHinweis } : {}) };
    if (aktion === 'bestaetigen') d.projekteAusRadar.push(projektAusHinweis(r.hinweis, d.projekteAusRadar.length));
  });
  ui.radar.notiz[id] = ''; delete ui.radar.bezirk[id];
  ui.fokus = `hinweis-titel-${slug(id)}`; render();
  melde(aktion === 'bestaetigen' ? 'Hinweis bestätigt. Das Projekt steht jetzt auf der Karte.' : aktion === 'pruefen' ? 'Prüfung begonnen.' : 'Hinweis verworfen.');
}

function projektAusHinweis(h, n) {
  const mitte = geo?.features.find((f) => f.properties.name === h.bezirk)?.properties.mitte || REGIONEN[0].mitte;
  // Versatz auf einer Spirale, damit mehrere bestätigte Projekte im selben Bezirk nicht übereinander liegen.
  const winkel = n * 2.39996; const radius = 0.004 * (1 + Math.floor(n / 6));
  return {
    id: `P-RADAR-${String(n + 1).padStart(2, '0')}`, kurz: `R${n + 1}`, farbe: '#3b5b8c', name: h.titel, zusatz: `Aus dem Projektradar · Quelle: ${h.quelleName}`,
    art: h.art, phase: 'Phase noch nicht erfasst', lp: 0, status: 'neu', bezirk: h.bezirk || 'Bezirk unbekannt', lage: h.lage || [mitte[0] + radius * Math.sin(winkel), mitte[1] + radius * 1.6 * Math.cos(winkel)],
    herkunft: h.quelle === 'meldung' ? 'meldung' : 'radar', hinweis: h.id, rueckbauAb: null, entscheidungBis: null, gebaeude: [],
  };
}

function meldungSpeichern() {
  const m = ui.radar.meldung; const f = pruefeMeldung(m);
  if (Object.keys(f).length) { ui.radar.meldungFehler = f; ui.fokus = `meldung-${Object.keys(f)[0]}`; render(); return; }
  const id = `M-${String(p.meldungen.length + 1).padStart(2, '0')}`;
  const jetzt = jetztBerlin(); // echtes Eingangsdatum, nicht die Projektzeit-Simulation
  const h = { id, titel: m.titel.trim(), quelle: 'meldung', quelleName: 'Direkte Projektmeldung', quelleUrl: '', datum: jetzt.slice(0, 10), abgerufen: jetzt.slice(0, 10), art: m.art, bezirk: m.bezirk, relevanz: m.art === 'neubau' ? 'mittel' : 'hoch', relevanzText: 'Vorläufig nach Art der Maßnahme eingestuft. Die Bewertung folgt bei der Prüfung.', text: m.text.trim(), melder: m.melder.trim(), status: 'gemeldet', beispiel: false, verlauf: [{ at: jetzt, von: 'melder', aktion: 'gemeldet', notiz: `Meldung durch ${m.melder.trim()}` }] };
  uebernehmen((d) => d.meldungen.push(h));
  ui.radar.meldung = leereMeldung(); ui.radar.meldungFehler = {}; ui.radar.gespeichert = id;
  ui.radar.status = ''; ui.fokusNachRoute = `hinweis-titel-${slug(id)}`; // Filter lösen, damit die neue Meldung sichtbar ist
  gehe(`#hinweis-${slug(id)}`); melde('Meldung gespeichert. Sie wartet auf Prüfung.');
}

// ---------- Start ----------
async function ladeTuerregel() {
  try { return await import('../../prototype/dist/door-rules.mjs'); } catch { return import('./door-rules.mjs'); }
}
async function ladeGeo() {
  try { const r = await fetch(REGIONEN[0].grenzen); if (!r.ok) throw new Error(); return await r.json(); }
  catch { geoFehler = 'Die Bezirksgrenzen konnten nicht geladen werden. Marker und Liste bleiben nutzbar.'; return null; }
}
Promise.all([ladeTuerregel(), ladeGeo()]).then(([mod, g]) => { R = mod; geo = g; render(); })
  .catch(() => { app.innerHTML = '<div class="leer"><b>Die Anwendung konnte nicht starten.</b><p>Bitte über einen lokalen Server vom Repository-Wurzelverzeichnis aus öffnen (siehe README).</p></div>'; });

