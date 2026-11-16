// Einstieg: Router, Rahmen, Ereignisse. Ein gemeinsamer Datensatz für alle Ansichten.
import { REGIONEN, PROJEKTZEITEN, GRUPPEN } from './daten.js';
import { loeseAbgleichSchluessel, abgleich, abgleichListe, pruefbitteAnlegen, pruefbitteErlaubt, zuordnungZumBedarf } from './abgleich.js';
import { pruefeBedarf, bedarfAusEntwurf, naechsteBedarfId, bedarfAenderung } from './bedarf.js';
import { pruefeProjekt, projektAusEntwurf } from './projektanlage.js';
import { vorgangSchritt, checklisteSetzen } from './vorgang.js';
import { neuerUiZustand, leererKatalog, leereBedarfsliste, leererBestand, leereRadarFilter, leeresBedarfsformular, leeresProjektformular, leeresVorgangsformular, bedarfsformularStarten } from './uizustand.js';
import { ladePersistenz, speichere, loesche, baueDaten, leerePersistenz, anzahlEigeneAenderungen } from './zustand.js';
import { schluessel, moeglicheZiele, neueEntscheidung, bauteilAusErfassung, naechsteBauteilId, pruefeErfassung, erkennungSimulation, radarSchritt, pruefeMeldung, ifcVorpruefung, ZAHL, lage, vermerkSchritt, beispielAufmassRechtzeitig } from './regeln.js';
import { esc, icon, slug, pchip, nichtGefunden, laedt, routeBedarf, routeEntscheidung } from './ui.js';
import { zeit, jetztBerlin } from './zeit.js';
import { karteMontieren, karteEntfernen, markerHervorheben } from './karte.js';
import { startseite, projektUebersicht, popupHtml, gefilterteProjekte } from './ansichten/projekte.js';
import { gebaeudeAnsicht } from './ansichten/gebaeude.js';
import { bestand, pass } from './ansichten/bauteile.js';
import { entscheidungsListe, entscheidungsSeite } from './ansichten/entscheidung.js';
import { erfassung, leererEntwurf } from './ansichten/erfassung.js';
import { radar, leereMeldung } from './ansichten/radar.js';
import { uebersicht } from './ansichten/uebersicht.js';
import { katalog } from './ansichten/katalog.js';
import { bedarfe, bedarfDetail } from './ansichten/bedarfe.js';
import { bedarfFormular, BEDARF_FELD_ID, BEDARF_FESTE_FELDER, erstesBedarfFeld } from './ansichten/bedarfform.js';
import { projektFormular, PROJEKT_FELD_ID, erstesProjektFeld } from './ansichten/projektform.js';
import { VORGANG_FELD_ID } from './ansichten/vorgangsteil.js';
import { abgleichListeSeite, abgleichSeite } from './ansichten/abgleich.js';
import { vorgaenge } from './ansichten/vorgaenge.js';

const app = document.getElementById('app');
const speicher = (() => { try { const s = window.localStorage; s.setItem('cf-test', '1'); s.removeItem('cf-test'); return s; } catch { return null; } })();
let R = null; let geo = null; let geoFehler = '';
let p = ladePersistenz(speicher);
let db = baueDaten(p);

const ui = neuerUiZustand();
// Schmale Anzeige: das Diagramm wird dafür mit einer kleineren Zeichenfläche gebaut.
const schmalMedium = window.matchMedia ? window.matchMedia('(max-width: 640px)') : null;
ui.schmal = Boolean(schmalMedium?.matches);
schmalMedium?.addEventListener?.('change', (ev) => { ui.schmal = ev.matches; if (R) render(); });

const toast = document.createElement('div');
toast.className = 'toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
document.body.append(toast);
function melde(text, ms = 3600) { toast.textContent = text; clearTimeout(melde.t); melde.t = setTimeout(() => { toast.textContent = ''; }, ms); }

const ctx = () => ({ R, at: ui.at, daten: db, ereignisse: p.ereignisse, ezustand: p.ezustand, ui, geo, eigeneAenderungen: anzahlEigeneAenderungen(p) });

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
  try { h = decodeURIComponent((location.hash || '#uebersicht').slice(1)); } catch { return { view: 'fehlt', art: 'Seite', id: location.hash.slice(1) }; }
  const m = (prefix) => (h.startsWith(prefix) ? h.slice(prefix.length) : null);
  if (h === 'uebersicht' || h === '') return { view: 'uebersicht' };
  if (h === 'projekte') return { view: 'start' };
  if (h === 'vorgaenge') return { view: 'vorgaenge' };
  if (h === 'bauteile') return { view: 'katalog' };
  if (h === 'bedarfe') return { view: 'bedarfe' };
  if (h === 'bedarf-neu') return { view: 'bedarfneu' };
  const be = m('bedarf-ergaenzen-'); if (be !== null) { const d = db.bedarfe.find((x) => `${slug(x.projekt)}-${slug(x.id)}` === be); return d ? { view: 'bedarfergaenzen', d } : { view: 'fehlt', art: 'Bedarf', id: be }; }
  if (h === 'projekt-neu') return { view: 'projektneu' };
  if (h === 'abgleich') return { view: 'abgleichliste' };
  const bd = m('bedarf-'); if (bd !== null) { const d = db.bedarfe.find((x) => `${slug(x.projekt)}-${slug(x.id)}` === bd); return d ? { view: 'bedarf', d } : { view: 'fehlt', art: 'Bedarf', id: bd }; }
  const ab = m('abgleich-'); if (ab !== null) { const x = loeseAbgleichSchluessel(db, ab); return x ? { view: 'abgleich', ...x } : { view: 'fehlt', art: 'Abgleich', id: ab }; }
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
const BEREICH = {
  uebersicht: 'uebersicht', vorgaenge: 'uebersicht',
  start: 'projekte', projekt: 'projekte', gebaeude: 'projekte', bestand: 'projekte', entscheidungen: 'projekte', entscheidung: 'projekte', radar: 'projekte', projektneu: 'projekte',
  katalog: 'bauteile', pass: 'bauteile',
  bedarfe: 'bedarfe', bedarf: 'bedarfe', bedarfneu: 'bedarfe', bedarfergaenzen: 'bedarfe', abgleichliste: 'bedarfe', abgleich: 'bedarfe',
  erfassung: 'erfassen',
};
const HAUPT = [['uebersicht', '#uebersicht', 'Übersicht', 'uebersicht'], ['projekte', '#projekte', 'Projekte', 'karte'], ['bauteile', '#bauteile', 'Bauteile', 'bauteil'], ['bedarfe', '#bedarfe', 'Bedarfe', 'bedarf'], ['erfassen', '#erfassung', 'Erfassen', 'kamera']];
function rahmen(r, inhalt) {
  const bereich = BEREICH[r.view] || '';
  const navLink = ([k, h, t, i]) => `<a href="${h}" data-action="nav" data-ziel="${k}" ${bereich === k ? 'aria-current="page"' : ''}>${icon(i)}<span>${t}</span></a>`;
  const zeitwahl = (id) => `<label class="projektzeit" for="${id}"><span>Stichtag der Demo <em>(Simulation)</em></span><select id="${id}">${PROJEKTZEITEN.map((z) => `<option value="${z.at}" ${z.at === ui.at ? 'selected' : ''}>${z.label}</option>`).join('')}</select></label>`;
  const pr = r.p;
  return `
  <button type="button" class="skip" data-action="skip">Zum Inhalt springen</button>
  <div class="shell">
    <aside class="rail" aria-label="Seitenleiste">
      <a class="marke" href="#uebersicht"><span class="marke-zeichen" aria-hidden="true">${icon('kreislauf')}</span><span><b>CircularFlow</b><small>Bauteile im Kreislauf</small></span></a>
      <nav class="nav" aria-label="Hauptnavigation">${HAUPT.map(navLink).join('')}</nav>
      ${pr ? `<div class="kontext"><span class="label">Projekt</span><a href="#projekt-${slug(pr.kurz)}" class="kontext-titel">${pchip(pr)}<b>${esc(pr.name)}</b></a></div>` : ''}
      <div class="rail-fuss">${zeitwahl('projektzeit')}<p><span class="chip chip-sim">Beispieldaten</span> Projekte, Personen und Bauteile sind fiktiv. Eigene Erfassungen bleiben in diesem Browser.</p></div>
    </aside>
    <div class="arbeitsflaeche">
      <header class="kopf-mobil"><a class="marke" href="#uebersicht"><span class="marke-zeichen" aria-hidden="true">${icon('kreislauf')}</span><b>CircularFlow</b></a>${zeitwahl('projektzeit-m')}</header>
      ${ui.speicherHinweis ? `<p class="speicherhinweis" role="alert">${esc(ui.speicherHinweis)}</p>` : ''}
      <main id="inhalt" tabindex="-1">${inhalt}</main>
    </div>
  </div>
  <nav class="tabbar" aria-label="Hauptnavigation (Handy)">${HAUPT.map(navLink).join('')}</nav>`;
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
  if (neu) {
    ui.zuordnungFehler = '';
    // Entwürfe der Formulare gelten nur für die Seite, auf der sie begonnen wurden.
    ui.vorgangForm = leeresVorgangsformular();
    if (r.view === 'bedarfneu') bedarfsformularStarten(ui, null);
    else if (r.view === 'bedarfergaenzen') bedarfsformularStarten(ui, r.d);
    else if (r.view === 'projektneu') ui.projektForm = leeresProjektformular();
  }
  if (r.view === 'erfassung' && neu) {
    const ent = ui.erfassung;
    if (r.p && (ent.gespeichert || ent.projekt !== r.p.kurz || ent.raum !== r.raum)) ui.erfassung = { ...leererEntwurf(r.p.kurz, r.raum), schritt: 2, verfuegbarAb: r.p.rueckbauAb || '' };
    else if (!r.p && ent.gespeichert) ui.erfassung = leererEntwurf();
  }
  const c = ctx();
  const inhalt = !R ? laedt()
    : r.view === 'uebersicht' ? uebersicht(c)
    : r.view === 'katalog' ? katalog(c)
    : r.view === 'bedarfe' ? bedarfe(c)
    : r.view === 'bedarf' ? bedarfDetail(c, r.d)
    : r.view === 'bedarfneu' ? bedarfFormular(c)
    : r.view === 'bedarfergaenzen' ? bedarfFormular(c, r.d)
    : r.view === 'abgleichliste' ? abgleichListeSeite(c)
    : r.view === 'abgleich' ? abgleichSeite(c, r.bauteil, r.bedarf)
    : r.view === 'vorgaenge' ? vorgaenge(c)
    : r.view === 'projektneu' ? projektFormular(c)
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
  document.title = `${{ uebersicht: 'Übersicht', katalog: 'Bauteile', bedarfe: 'Bedarfe', bedarf: `Bedarf ${r.d?.id}`, bedarfneu: 'Bedarf erfassen', bedarfergaenzen: `Bedarf ${r.d?.id} ergänzen`, abgleichliste: 'Passende Paare', abgleich: `Abgleich ${r.bauteil?.id} und ${r.bedarf?.id}`, vorgaenge: 'Arbeitsliste', projektneu: 'Projekt erfassen', start: 'Projekte', projekt: r.p?.name, gebaeude: `Gebäude ${r.p?.kurz}`, bestand: `Bestand ${r.p?.kurz}`, pass: `${r.b?.id} Bauteilpass`, entscheidungen: `Entscheidungen ${r.p?.kurz}`, entscheidung: `Entscheidung ${r.e?.id}`, erfassung: 'Erfassung', radar: 'Projektradar' }[r.view] || 'Nicht gefunden'} · CircularFlow`;
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
  // Links mit Aktion setzen erst den Filter im ui-Objekt; die Navigation zeichnet danach selbst. Gleiche Seite: sofort neu zeichnen.
  const zumLink = (el) => el.localName === 'a' && el.getAttribute('href') !== location.hash;
  const act = a.dataset.action; const ent = ui.erfassung;
  const k = a.dataset.entscheidung;
  switch (act) {
    case 'skip': document.getElementById('inhalt').focus(); return;
    case 'start-art': ui.start.art = a.dataset.wert; break;
    case 'etage': ui.gebaeude[a.dataset.projekt] = a.dataset.etage; if (location.hash.startsWith('#raum-')) { gehe(`#gebaeude-${slug(a.dataset.projekt)}`); return; } ui.fokus = null; break;
    case 'bestand-reset': ui.bestand = leererBestand(); ui.fokus = 'f-gruppe'; break;
    case 'bestand-offen': ui.bestand = { ...leererBestand(), offen: true }; if (zumLink(a)) return; break;
    case 'bald-tage': ui.uebersicht.tage = Number(a.dataset.wert) === 30 ? 30 : 90; break;
    case 'katalog-vorgabe': {
      const art = a.dataset.wert; const v = art === 'bald' ? { art, tage: Number(a.dataset.tage) === 30 ? 30 : 90 } : art === 'monat' ? { art, monat: a.dataset.monat } : { art };
      ui.katalog = { ...leererKatalog(), vorgabe: v, gruppe: a.dataset.gruppe || '' }; tooltipWeg(); if (zumLink(a)) return; break;
    }
    case 'katalog-vorgabe-weg': ui.katalog.vorgabe = null; ui.katalog.gruppe = ''; ui.fokus = 'kat-q'; break;
    // Hauptnavigation „Bauteile“ öffnet den ganzen Katalog: eine Vorgabe aus der Übersicht (Kachel, Diagramm) entfällt.
    case 'nav': if (ev.ctrlKey || ev.metaKey || ev.shiftKey || a.dataset.ziel !== 'bauteile' || !ui.katalog.vorgabe) return; ui.katalog.vorgabe = null; ui.katalog.gruppe = ''; if (zumLink(a)) return; break;
    case 'katalog-reset': ui.katalog = leererKatalog(); ui.fokus = 'kat-q'; break;
    case 'bedarfe-vorgabe': ui.bedarfe = { ...leereBedarfsliste(), offen: true }; if (zumLink(a)) return; break;
    case 'bedarfe-reset': ui.bedarfe = leereBedarfsliste(); ui.fokus = 'bed-gruppe'; break;
    case 'abgleich-filter': ui.abgleich.ergebnis = a.dataset.wert; if (zumLink(a)) return; break;
    case 'vorgang-filter': ui.vorgaenge.status = a.dataset.wert; if (zumLink(a)) return; break;
    case 'bedarf-ergaenzen': gehe(`#bedarf-ergaenzen-${slug(a.dataset.projekt)}-${slug(a.dataset.bedarf)}`); return;
    case 'pruefbitte-anlegen': pruefbitteAnlegenAktion(a.dataset.key, a.getAttribute('aria-disabled') === 'true'); return;
    case 'zum-vorgang': { const el = document.getElementById('vorgang-status'); if (el) { el.scrollIntoView({ block: 'center' }); el.focus({ preventScroll: true }); } return; }
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
      Object.assign(ui, { resetFrage: false, zuletzt: null, zielWahl: null, zuordnungFehler: '', erfassung: leererEntwurf(), radar: leereRadarFilter(), importe: { ifc: null, ifcSim: false, scanSim: false }, speicherHinweis: '',
        bedarfForm: leeresBedarfsformular(), projektForm: leeresProjektformular(), vorgangForm: leeresVorgangsformular(), bedarfe: leereBedarfsliste(), katalog: leererKatalog(), bestand: leererBestand(), vorgaenge: { status: '' }, abgleich: { ergebnis: '' } });
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
  if (t.dataset.ff) { formEingabe(t); return; }
  if (t.dataset.aufmass) { const key = t.dataset.aufmass; uebernehmen((d) => { const alt = d.ezustand[key]?.aufmass || R.emptyMeasurement(); d.ezustand[key] = { ...(d.ezustand[key] || {}), aufmass: { ...alt, [t.dataset.feld]: t.value } }; }); render(); return; }
  if (t.dataset.schaden) { schadenEingabe(t.dataset.schaden, t.value); render(); return; }
  if (t.id === 'bestand-q') { ui.bestand.q = t.value; render(); return; }
  if (t.id === 'kat-q') { ui.katalog.q = t.value; render(); return; }
  if (t.id === 'kat-menge') { ui.katalog.mindest = t.value; render(); return; }
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
  if (t.dataset.ff) { formEingabe(t); if (t.dataset.neuZeichnen) render(); return; }
  if (t.dataset.checkliste) { checklisteUmschalten(t); return; }
  if (t.id === 'projektzeit' || t.id === 'projektzeit-m') { ui.at = t.value; render(); melde(`Stichtag der Demo ${PROJEKTZEITEN.find((z) => z.at === t.value).label} (Simulation). Alle Ansichten zeigen diesen Stand.`); return; }
  if (t.id === 'nur-angebote') ui.start.nurAngebote = t.checked;
  else if (t.id === 'osm') ui.start.osm = t.checked;
  else if (t.id === 'region') ui.start.region = t.value;
  else if (t.id === 'f-gruppe') ui.bestand.gruppe = t.value;
  else if (t.id === 'f-status') ui.bestand.status = t.value;
  else if (t.id === 'f-etage') ui.bestand.etage = t.value;
  else if (t.id === 'f-offen') ui.bestand.offen = t.checked;
  else if (t.id === 'f-mobil') ui.bestand.mobil = t.checked;
  else if (t.id === 'kat-gruppe') ui.katalog.gruppe = t.value;
  else if (t.id === 'kat-bezirk') ui.katalog.bezirk = t.value;
  else if (t.id === 'kat-bis') ui.katalog.bis = t.value;
  else if (t.id === 'kat-offen') ui.katalog.offen = t.checked;
  else if (t.id === 'kat-alle') ui.katalog.alle = t.checked;
  else if (t.id === 'bed-gruppe') ui.bedarfe.gruppe = t.value;
  else if (t.id === 'bed-projekt') ui.bedarfe.projekt = t.value;
  else if (t.id === 'bed-offen') ui.bedarfe.offen = t.checked;
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
  const f = ev.target;
  if (f.id === 'meldeformular') { ev.preventDefault(); meldungSpeichern(); return; }
  if (!f.dataset.form) return;
  ev.preventDefault();
  for (const el of f.elements) if (el.dataset?.ff && !el.disabled && !(el.type === 'radio' && !el.checked)) formEingabe(el); // auch Eingaben ohne Ereignis (z. B. Browser-Autofill)
  if (f.dataset.form === 'bedarf') bedarfSpeichern();
  else if (f.dataset.form === 'projekt') projektSpeichern();
  else if (f.dataset.form === 'vorgang') vorgangAktion(f.dataset.entscheidung, f.dataset.aktion);
});

app.addEventListener('mouseover', (ev) => { const z = ev.target.closest('[data-hover]'); if (z) markerHervorheben(z.dataset.hover, true); });
app.addEventListener('mouseout', (ev) => { const z = ev.target.closest('[data-hover]'); if (z) markerHervorheben(z.dataset.hover, false); });
app.addEventListener('focusin', (ev) => { const z = ev.target.closest('[data-hover]'); if (z) markerHervorheben(z.dataset.hover, true); });
app.addEventListener('focusout', (ev) => { const z = ev.target.closest('[data-hover]'); if (z) markerHervorheben(z.dataset.hover, false); });
window.addEventListener('hashchange', render);

// Tooltip für Diagrammsegmente: bei Maus und Tastaturfokus, Text aus data-tip.
const tip = document.createElement('div');
tip.className = 'tip'; tip.setAttribute('role', 'tooltip'); tip.hidden = true;
document.body.append(tip);
function tooltipZeigen(el) {
  tip.textContent = el.dataset.tip; tip.hidden = false;
  const r = el.getBoundingClientRect(); const w = tip.offsetWidth;
  const links = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8);
  tip.style.left = `${links}px`; tip.style.top = `${Math.max(8, r.top - tip.offsetHeight - 8)}px`;
}
function tooltipWeg() { tip.hidden = true; }
app.addEventListener('mouseover', (ev) => { const z = ev.target.closest('[data-tip]'); if (z) tooltipZeigen(z); });
app.addEventListener('mouseout', (ev) => { if (ev.target.closest('[data-tip]')) tooltipWeg(); });
app.addEventListener('focusin', (ev) => { const z = ev.target.closest('[data-tip]'); if (z) tooltipZeigen(z); });
app.addEventListener('focusout', (ev) => { if (ev.target.closest('[data-tip]')) tooltipWeg(); });
document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') tooltipWeg(); });
window.addEventListener('scroll', tooltipWeg, { passive: true });

// ---------- Aktionen ----------
function zuordnen(bkey) {
  const wahl = document.getElementById('ziel-wahl')?.value || (ui.zielWahl?.fuer === bkey ? ui.zielWahl.wert : '');
  if (!wahl) { ui.zuordnungFehler = 'Bitte ein Ziel wählen.'; ui.fokus = 'ziel-wahl'; render(); return; }
  const [art, projekt, id] = wahl.split('|');
  const b = db.bauteile.find((x) => `${x.projekt}:${x.id}` === bkey);
  // Nur Ziele, die die Fachregel noch anbietet (ein übergebenes Bauteil und belegte Ziele nicht).
  const frei = moeglicheZiele(ctx(), b); const liste = art === 'zieloeffnung' ? frei.oeffnungen : frei.bedarfe;
  if (!liste.some((z) => z.projekt === projekt && z.id === id)) { ui.zuordnungFehler = 'Dieses Ziel ist für das Bauteil nicht mehr möglich.'; ui.fokus = 'ziel-wahl'; render(); return; }
  if (art === 'bedarf') {
    const z = zuordnungZumBedarf(ctx(), b, liste.find((x) => x.projekt === projekt && x.id === id));
    if (!z.moeglich) { ui.zuordnungFehler = z.grund; ui.fokus = 'ziel-wahl'; render(); return; }
  }
  const e = neueEntscheidung(ctx(), b, { art, projekt, id });
  uebernehmen((d) => {
    d.zuordnungen.push(e);
    d.ereignisse.push({ at: ui.at, von: 'browser', bauteil: bkey, entscheidung: schluessel(e.projekt, e.id), art: 'anlage', sim: true, text: `Entscheidung ${e.id} angelegt: ${b.id} → ${art === 'zieloeffnung' ? 'Zielöffnung' : 'Bedarf'} ${projekt === b.projekt ? '' : `${projekt} · `}${id}.` });
  });
  ui.zuordnungFehler = ''; ui.zielWahl = null; ui.fokus = 'h-handlung';
  render(); melde(`Entscheidung ${e.id} angelegt. Der nächste Schritt steht oben im Pass.`);
}

// Knopf im Hauptkasten: Regeln in regeln.vermerkSchritt (Vorlage nur mit Freigabe der Prüfbitte, keine Rückdatierung).
function schrittVermerken(k) {
  const e = db.entscheidungen.find((x) => schluessel(x.projekt, x.id) === k);
  const r = vermerkSchritt(ctx(), e);
  if (r.fehler) { melde(r.fehler); return; }
  uebernehmen((d) => d.ereignisse.push(r.ereignis));
  ui.fokus = 'h-schritt'; render(); melde(r.vorlage ? 'Zur Fachprüfung vorgelegt. Status des Bauteils aktualisiert.' : 'Im Verlauf vermerkt.');
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

// ---------- Formulare: Eingaben sammeln, mit den Fachmodulen prüfen, über uebernehmen speichern ----------
// Jedes Feld trägt data-ff="bedarf|projekt|vorgang-<aktion>" und name="<feld>". Der Entwurf liegt im ui-Zustand, nicht im DOM.
function formEingabe(t) {
  const wert = t.type === 'checkbox' ? t.checked : t.value; const ff = t.dataset.ff;
  if (ff === 'bedarf') {
    const e = ui.bedarfForm.entwurf;
    if (t.name.startsWith('art-')) e.geschaetzt = { ...e.geschaetzt, [t.name.slice(4)]: wert === 'geschaetzt' };
    else { e[t.name] = wert; if (t.name === 'projekt') e.raum = ''; }
  } else if (ff === 'projekt') ui.projektForm.entwurf[t.name] = wert;
  else if (ff.startsWith('vorgang-')) {
    const k = t.closest('form')?.dataset.entscheidung; const aktion = ff.slice(8);
    if (ui.vorgangForm.k !== k) ui.vorgangForm = { ...leeresVorgangsformular(), k };
    ui.vorgangForm.eingabe[aktion] = { ...(ui.vorgangForm.eingabe[aktion] || {}), [t.name]: wert };
  }
}

function bedarfSpeichern() {
  const f = ui.bedarfForm; const e = f.entwurf; const c = ctx();
  const vorhanden = f.schluessel === 'neu' ? null : db.bedarfe.find((x) => `${x.projekt}:${x.id}` === f.schluessel);
  const fehler = pruefeBedarf(e, c);
  if (vorhanden) for (const k of BEDARF_FESTE_FELDER) delete fehler[k]; // Beim Ergänzen sind diese Angaben nicht änderbar
  if (Object.keys(fehler).length) { f.fehler = fehler; ui.fokus = BEDARF_FELD_ID[erstesBedarfFeld(fehler)]; render(); return; }
  if (vorhanden) {
    uebernehmen((d) => { d.bedarfAenderungen[f.schluessel] = bedarfAenderung(e); });
    const n = abgleichListe(ctx(), { bedarf: db.bedarfe.find((x) => `${x.projekt}:${x.id}` === f.schluessel) }).length;
    gehe(routeBedarf(vorhanden)); melde(`Bedarf ${vorhanden.id} ergänzt. Die passenden Angebote sind neu berechnet (${n} ${n === 1 ? 'Angebot' : 'Angebote'}).`);
    return;
  }
  const b = bedarfAusEntwurf(e, { id: naechsteBedarfId(db.bedarfe), at: ui.at });
  const etage = e.raum ? (db.projekte.find((x) => x.kurz === e.projekt)?.gebaeude || []).flatMap((g) => g.etagen).find((et) => et.raeume.some((r) => r.id === e.raum)) : null;
  if (etage) { b.raeume = [e.raum]; b.etage = etage.id; }
  uebernehmen((d) => { d.bedarfe.push(b); });
  const n = abgleichListe(ctx(), { bedarf: db.bedarfe.find((x) => x.projekt === b.projekt && x.id === b.id) }).length;
  gehe(routeBedarf(b)); melde(`Bedarf ${b.id} gespeichert. Die passenden Angebote sind berechnet (${n} ${n === 1 ? 'Angebot' : 'Angebote'}).`);
}

function projektSpeichern() {
  const f = ui.projektForm; const e = f.entwurf;
  const fehler = pruefeProjekt(e, db.projekte);
  if (Object.keys(fehler).length) { f.fehler = fehler; ui.fokus = PROJEKT_FELD_ID[erstesProjektFeld(fehler)]; render(); return; }
  // Lage: Mitte des Bezirks aus den geladenen Grenzen, sonst Regionsmitte. Weitere eigene Projekte im selben Bezirk rücken auf einer Spirale ab.
  const mitte = geo?.features.find((x) => x.properties.name === e.bezirk)?.properties.mitte || REGIONEN[0].mitte;
  const n = db.projekte.filter((x) => x.herkunft === 'eigen' && x.bezirk === e.bezirk).length;
  const winkel = n * 2.39996; const radius = n ? 0.004 * (1 + Math.floor((n - 1) / 6)) : 0;
  const pr = projektAusEntwurf(e, { projekte: db.projekte, mitte: [mitte[0] + radius * Math.sin(winkel), mitte[1] + radius * 1.6 * Math.cos(winkel)], at: ui.at });
  uebernehmen((d) => { d.projekteEigen.push(pr); });
  gehe(`#projekt-${slug(pr.kurz)}`); melde(`Projekt ${pr.name} gespeichert (Eigene Eingabe, Lage symbolisch). Es steht auf Karte und Liste und ist in der Erfassung wählbar.`);
}

const VORGANG_MELDUNG = {
  pruefbitte: 'Prüfbitte angelegt (Simulation, nichts wird versendet).',
  fachergebnis: 'Fachergebnis eingetragen (laut Eintrag, Simulation, keine Fachfreigabe).',
  vormerkung: 'Vormerkung eingetragen (Simulation, unverbindlich).',
  'uebergabe-geplant': 'Übergabe geplant (Simulation, nichts wird versendet).',
  uebergeben: 'Als übergeben eingetragen (Simulation).',
  abbruch: 'Vorgang abgebrochen. Bauteil und Bedarf sind wieder frei.',
};
function vorgangAktion(k, aktion) {
  const e = db.entscheidungen.find((x) => schluessel(x.projekt, x.id) === k);
  if (ui.vorgangForm.k !== k) ui.vorgangForm = { ...leeresVorgangsformular(), k };
  const vf = ui.vorgangForm;
  // Prüfbitte nur, wenn die Fachregel sie zur Projektzeit erlaubt (Zeit-, Mengen- und Türregel); sonst Grund anzeigen.
  if (aktion === 'pruefbitte') {
    const pb = pruefbitteErlaubt(ctx(), e);
    if (!pb.erlaubt) { vf.aktion = aktion; vf.fehler = { allgemein: pb.grund }; ui.fokus = 'vorgang-fehler'; render(); return; }
  }
  const res = vorgangSchritt(ctx(), e, aktion, vf.eingabe[aktion] || {});
  if (res.fehler) {
    const { allgemein, ...felder } = res.fehler;
    vf.aktion = aktion; vf.fehler = { [aktion]: felder, ...(allgemein ? { allgemein } : {}) };
    const erstes = Object.keys(felder)[0];
    ui.fokus = erstes ? VORGANG_FELD_ID[erstes] : 'vorgang-fehler'; render(); return;
  }
  uebernehmen((d) => d.ereignisse.push(res.ereignis));
  ui.vorgangForm = leeresVorgangsformular(); ui.fokus = 'vorgang-status'; render();
  melde(`${VORGANG_MELDUNG[aktion]}${res.ereignis.urteil === 'ungeeignet' ? ' Der Vorgang ist beendet.' : ''}`);
}

function checklisteUmschalten(t) {
  const k = t.dataset.checkliste; const punkt = t.dataset.punkt;
  uebernehmen((d) => {
    const z = { ...(d.ezustand[k] || {}) }; const stand = checklisteSetzen(z.checkliste || {}, punkt, t.checked);
    if (Object.keys(stand).length) z.checkliste = stand; else delete z.checkliste;
    if (Object.keys(z).length) d.ezustand[k] = z; else delete d.ezustand[k];
  });
  render();
}

// Prüfbitte aus dem Abgleich: legt Zuordnung (neuer Vorgang) und Ereignis an und öffnet die Entscheidungsseite.
function pruefbitteAnlegenAktion(key, gesperrt) {
  const x = loeseAbgleichSchluessel(db, key);
  if (!x) { melde('Dieses Paar gibt es nicht mehr.'); return; }
  const a = abgleich(ctx(), x.bauteil, x.bedarf);
  if (gesperrt || !a.pruefbitteMoeglich) { ui.fokus = 'pruefbitte-grund'; render(); return; }
  const r = pruefbitteAnlegen(ctx(), a);
  if (r.fehler) { ui.fokus = 'pruefbitte-grund'; render(); melde(r.fehler.allgemein); return; }
  uebernehmen((d) => { d.zuordnungen.push(r.zuordnung); d.ereignisse.push(r.ereignis); });
  ui.fokusNachRoute = 'h-entscheidung';
  gehe(routeEntscheidung(r.zuordnung)); melde('Prüfbitte angelegt (Simulation, nichts wird versendet).');
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

