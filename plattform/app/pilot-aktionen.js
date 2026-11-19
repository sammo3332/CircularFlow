// Pilotbetrieb: Aktionen und Formulare (Interesse, Dienstleister, Anfrage, Angebot, Verkauf, Provision, Datei, Pilotraum).
// Hält main.js klein: main übergibt ui, Kontext, uebernehmen, render, melde, gehe und den Speicher.
import { interesseAnlegen, interesseZurueckziehen, pruefeDienstleister, dienstleisterAusEntwurf, leererDienstleisterEntwurf, pruefeAnfrage, anfrageAusEntwurf, leererAnfrageEntwurf,
  anfrageSchritt, naechsteId, verkaufSetzen, provisionSetzen, pruefeAngebot, angebotAenderung, leererAngebotEntwurf, findeAnfrage } from './pilot.js';
import { ANFRAGE_FELD_ID, DIENSTLEISTER_FELD_ID, ANGEBOT_FELD_ID, SCHRITT_FELD_ID, routeAnfrage } from './ansichten/anfragen.js';
import { leeresPilotformular } from './uizustand.js';
import { exportStand, importStand, vereinige, anzahlEigeneAenderungen, baueDaten } from './zustand.js';
import { pilotraumLaden, pilotraumSpeichern, raumInfo, standHolen, standSchreiben } from './sync.js';
import { routePass } from './ui.js';

const MELDUNG = { beauftragt: 'Beauftragung vermerkt. Es wurde keine Nachricht versendet.', ergebnis: 'Ergebnis eingetragen (laut Eintrag, keine Fachfreigabe).', klaerung: 'Klärung vermerkt.', uebergabe: 'Übergabe geplant.', abgeschlossen: 'Anfrage abgeschlossen (laut Eintrag).', abgelehnt: 'Anfrage abgelehnt.', kosten: 'Kostentragung gespeichert.' };

export function pilotAktionen({ ui, ctx, uebernehmen, render, melde, gehe, speicher, datenHolen, datenSetzen }) {
  const pf = () => ui.pilot;
  const bauteilAus = (key) => datenHolen().db.bauteile.find((b) => `${b.projekt}:${b.id}` === key) || null;
  const refAus = (s) => { const [projekt, id] = String(s || '').split('|'); return projekt && id ? { projekt, id } : null; };
  let abgleichTimer = null;

  // ---------- Eingaben der Formulare (data-ff="pilot-…") ----------
  function eingabe(t) {
    const wert = t.type === 'checkbox' ? t.checked : t.value; const ff = t.dataset.ff; const p = pf();
    if (ff === 'pilot-anfrage') { if (!p.anfrage.entwurf) return; if (t.name === 'bedarf') p.anfrage.entwurf.bedarf = refAus(wert); else p.anfrage.entwurf[t.name] = wert; delete p.anfrage.fehler[t.name]; }
    else if (ff === 'pilot-dienstleister') { const e = p.dienstleister.entwurf || (p.dienstleister.entwurf = leererDienstleisterEntwurf()); if (t.name.startsWith('leistung-')) { e.leistungen = { ...e.leistungen, [t.name.slice(9)]: wert }; delete p.dienstleister.fehler.leistungen; } else { e[t.name] = wert; delete p.dienstleister.fehler[t.name]; } }
    else if (ff === 'pilot-angebot') { const key = t.closest('form')?.dataset.key; if (p.angebot.k !== key || !p.angebot.entwurf) p.angebot = { k: key, entwurf: leererAngebotEntwurf(bauteilAus(key)), fehler: {}, offen: true }; p.angebot.entwurf[t.name] = wert; delete p.angebot.fehler[t.name]; }
    else if (ff === 'pilot-verkauf') { const key = t.closest('form')?.dataset.key; if (p.verkauf.k !== key) p.verkauf = { k: key, eingabe: {}, fehler: {} }; p.verkauf.eingabe[t.name] = wert; delete p.verkauf.fehler[t.name]; }
    else if (ff.startsWith('pilot-provision-')) { const key = t.closest('form')?.dataset.key; const dl = ff.slice(16); if (p.provision.k !== key) p.provision = { k: key, eingabe: {}, fehler: {} }; p.provision.eingabe[dl] = { ...(p.provision.eingabe[dl] || {}), [t.name]: wert }; delete p.provision.fehler[dl]; }
    else if (ff === 'pilot-interesse') { const key = t.closest('form')?.dataset.key; p.interesse = { k: key, notiz: wert, fehler: {} }; }
    else if (ff.startsWith('pilot-schritt-')) { const id = t.closest('form')?.dataset.anfrage; const aktion = ff.slice(14); if (p.schritt.id !== id) p.schritt = { id, eingabe: {}, fehler: {}, aktion: '' }; p.schritt.eingabe[aktion] = { ...(p.schritt.eingabe[aktion] || {}), [t.name]: wert }; }
    else if (ff === 'pilotraum') { ui.pilotraum[t.name] = wert; ui.pilotraum.fehler = ''; }
  }

  // ---------- Formulare absenden ----------
  function absenden(f) {
    const art = f.dataset.form; const p = pf(); const c = ctx();
    if (art === 'pilot-interesse') {
      const [bk, dk] = String(f.dataset.key).split('|'); const [bp, bid] = bk.split(':'); const [dp, did] = dk.split(':');
      const r = interesseAnlegen(c, { bauteil: { projekt: bp, id: bid }, bedarf: { projekt: dp, id: did }, notiz: p.interesse.k === f.dataset.key ? p.interesse.notiz : '' });
      if (r.fehler) { p.interesse = { k: f.dataset.key, notiz: p.interesse.notiz, fehler: r.fehler }; render(); return; }
      uebernehmen((d) => { d.interessen.push({ ...r.interesse, id: naechsteId(d.interessen, 'I') }); });
      p.interesse = { k: '', notiz: '', fehler: {} }; render(); melde('Interesse festgehalten. Keine Reservierung, keine Bestellung.'); return;
    }
    if (art === 'pilot-dienstleister') {
      const e = p.dienstleister.entwurf || leererDienstleisterEntwurf(); const fe = pruefeDienstleister(e);
      if (Object.keys(fe).length) { p.dienstleister.fehler = fe; ui.fokus = DIENSTLEISTER_FELD_ID[Object.keys(fe)[0]]; render(); return; }
      let id; uebernehmen((d) => { id = naechsteId(d.dienstleister, 'DL'); d.dienstleister.push(dienstleisterAusEntwurf(e, { id, at: ui.at })); });
      p.dienstleister = { entwurf: null, fehler: {}, offen: false }; ui.fokus = 'h-dl'; render(); melde(`Dienstleister ${id} gespeichert.`); return;
    }
    if (art === 'pilot-anfrage') {
      const e = p.anfrage.entwurf; if (!e) return; const fe = pruefeAnfrage(e, c);
      if (Object.keys(fe).length) { p.anfrage.fehler = fe; ui.fokus = ANFRAGE_FELD_ID[Object.keys(fe)[0]] || 'anfrage-fehler'; render(); return; }
      let a; uebernehmen((d) => { a = anfrageAusEntwurf(e, { id: naechsteId(d.anfragen, 'A'), at: ui.at }); d.anfragen.push(a); });
      p.anfrage = { entwurf: null, fehler: {} }; ui.fokusNachRoute = 'anfrage-status'; gehe(routeAnfrage(a)); melde(`Anfrage ${a.id} gespeichert. Nicht versendet.`); return;
    }
    if (art === 'pilot-schritt') {
      const id = f.dataset.anfrage; const aktion = f.dataset.aktion; const a = findeAnfrage(c, id);
      if (p.schritt.id !== id) p.schritt = { id, eingabe: {}, fehler: {}, aktion: '' };
      const r = anfrageSchritt(c, a, aktion, p.schritt.eingabe[aktion] || {});
      if (r.fehler) { const { allgemein, ...felder } = r.fehler; p.schritt.fehler = { [aktion]: felder, ...(allgemein ? { allgemein } : {}) }; p.schritt.aktion = aktion; const erstes = Object.keys(felder)[0]; ui.fokus = erstes ? SCHRITT_FELD_ID[erstes] : 'anfrage-fehler'; render(); return; }
      uebernehmen((d) => { const i = d.anfragen.findIndex((x) => x.id === id); if (i >= 0) d.anfragen[i] = r.anfrage; });
      p.schritt = { id: '', eingabe: {}, fehler: {}, aktion: '' }; ui.fokus = 'anfrage-status'; render(); melde(MELDUNG[aktion] || 'Gespeichert.'); return;
    }
    if (art === 'pilot-angebot') {
      const key = f.dataset.key; const b = bauteilAus(key); const e = (p.angebot.k === key && p.angebot.entwurf) || leererAngebotEntwurf(b); const fe = pruefeAngebot(e, b);
      if (Object.keys(fe).length) { p.angebot = { k: key, entwurf: e, fehler: fe, offen: true }; ui.fokus = ANGEBOT_FELD_ID[Object.keys(fe)[0]]; render(); return; }
      uebernehmen((d) => { d.bauteilAenderungen[key] = angebotAenderung(e, { at: ui.at }); });
      p.angebot = { k: '', entwurf: null, fehler: {}, offen: false }; ui.fokus = 'h-angebot'; render(); melde('Angebot geändert. Der Abgleich ist neu berechnet.'); return;
    }
    if (art === 'pilot-verkauf') {
      const key = f.dataset.key; const b = bauteilAus(key); const ein = p.verkauf.k === key ? p.verkauf.eingabe : {};
      const vorhanden = c.daten.verkaeufe?.[key];
      const r = verkaufSetzen(c, b, { status: ein.status ?? vorhanden?.status ?? '', datum: ein.datum ?? vorhanden?.datum ?? '', bedarf: ein.bedarf !== undefined ? refAus(ein.bedarf) : vorhanden?.bedarf || null, notiz: ein.notiz ?? vorhanden?.notiz ?? '' });
      if (r.fehler) { p.verkauf = { k: key, eingabe: ein, fehler: r.fehler }; ui.fokus = r.fehler.datum ? 'vk-datum' : 'vk-status'; render(); return; }
      uebernehmen((d) => { d.verkaeufe[key] = r.verkauf; });
      p.verkauf = { k: '', eingabe: {}, fehler: {} }; ui.fokus = 'h-verkauf'; render(); melde('Verkaufsstand gespeichert (laut Eintrag). Keine Zahlung ausgelöst.'); return;
    }
    if (art === 'pilot-provision') {
      const key = f.dataset.key; const dl = f.dataset.dienstleister; const b = bauteilAus(key); const ein = (p.provision.k === key && p.provision.eingabe[dl]) || {};
      const vorhanden = c.daten.verkaeufe?.[key]?.provisionen?.[dl] || { status: 'offen', grundlage: '' };
      const r = provisionSetzen(c, b, dl, { status: ein.status ?? vorhanden.status, grundlage: ein.grundlage ?? vorhanden.grundlage });
      if (r.fehler) { if (p.provision.k !== key) p.provision = { k: key, eingabe: {}, fehler: {} }; p.provision.fehler[dl] = r.fehler; render(); return; }
      uebernehmen((d) => { d.verkaeufe[key] = r.verkauf; });
      p.provision = { k: '', eingabe: {}, fehler: {} }; ui.fokus = 'h-verkauf'; render(); melde('Provisionsstatus gespeichert (laut Eintrag).'); return;
    }
    if (art === 'pilotraum') { verbinden(); }
  }

  // ---------- Klick-Aktionen ----------
  function klick(act, a) {
    const p = pf();
    switch (act) {
      case 'dl-neu': p.dienstleister = { entwurf: leererDienstleisterEntwurf(), fehler: {}, offen: true }; ui.fokus = 'dl-name'; return true;
      case 'dl-abbrechen': p.dienstleister = { entwurf: null, fehler: {}, offen: false }; ui.fokus = 'h-dl'; return true;
      case 'angebot-bearbeiten': p.angebot = { k: a.dataset.key, entwurf: leererAngebotEntwurf(bauteilAus(a.dataset.key)), fehler: {}, offen: true }; ui.fokus = 'ag-menge'; return true;
      case 'angebot-abbrechen': p.angebot = { k: '', entwurf: null, fehler: {}, offen: false }; ui.fokus = 'btn-angebot'; return true;
      case 'interesse-zurueck': { const i = ctx().daten.interessen.find((x) => x.id === a.dataset.interesse); const r = interesseZurueckziehen(ctx(), i); if (r.fehler) { melde(r.fehler.allgemein); return true; } uebernehmen((d) => { const k = d.interessen.findIndex((x) => x.id === i.id); if (k >= 0) d.interessen[k] = r.interesse; }); melde('Interesse zurückgezogen.'); return true; }
      case 'daten-sichern': datenSichern(); return false;
      case 'pilotraum-aktualisieren': abgleichen({ meldung: true }); return false;
      case 'pilotraum-trennen': trennen(); return true;
      default: return null;
    }
  }

  // ---------- Datei sichern und laden ----------
  function datenSichern() {
    const { p } = datenHolen();
    const text = exportStand(p, { at: new Date().toISOString() });
    const blob = new Blob([text], { type: 'application/json' }); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `circularflow-datenstand-${new Date().toISOString().slice(0, 10)}.json`; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    pf().datei = { fehler: '', meldung: `Datei mit ${anzahlEigeneAenderungen(p)} eigenen Einträgen erzeugt (${Math.round(text.length / 1024)} KB).` }; render();
  }
  async function datenLaden(file) {
    const p = pf(); p.datei = { fehler: '', meldung: '' };
    if (!file) return;
    if (file.size > 30 * 1024 * 1024) { p.datei.fehler = 'Die Datei ist größer als 30 MB.'; render(); return; }
    let text; try { text = await file.text(); } catch { p.datei.fehler = 'Die Datei konnte nicht gelesen werden.'; render(); return; }
    let stand; try { stand = importStand(text); } catch (e) { p.datei.fehler = e.message; render(); return; }
    const vorher = anzahlEigeneAenderungen(datenHolen().p); let nachher = vorher;
    uebernehmen((d) => { const v = vereinige(d, stand); for (const k of Object.keys(v)) d[k] = v[k]; nachher = anzahlEigeneAenderungen(d); });
    p.datei.meldung = `${nachher - vorher} ${nachher - vorher === 1 ? 'neuer Eintrag' : 'neue Einträge'} aus der Datei übernommen (${anzahlEigeneAenderungen(stand)} in der Datei, ${nachher} jetzt insgesamt).`;
    render(); melde('Datenstand aus Datei zusammengeführt.');
  }

  // ---------- Pilotraum (gemeinsamer Datenstand) ----------
  const cfg = () => ({ url: ui.pilotraum.url || '', schluessel: ui.pilotraum.schluessel || '' });
  function start() {
    const gespeichert = pilotraumLaden(speicher);
    if (!gespeichert) return;
    Object.assign(ui.pilotraum, gespeichert, { status: 'verbindet' });
    abgleichen({ meldung: false }).catch(() => {});
    document.addEventListener('visibilitychange', () => { if (!document.hidden && ui.pilotraum.status === 'verbunden') abgleichen({ meldung: false }).catch(() => {}); });
    abgleichTimer = setInterval(() => { if (ui.pilotraum.status === 'verbunden' && !document.hidden) abgleichen({ meldung: false }).catch(() => {}); }, 20000);
  }
  async function verbinden() {
    const r = ui.pilotraum; r.fehler = '';
    if (!r.schluessel || r.schluessel.length < 16) { r.fehler = 'Bitte den Zugangsschlüssel eintragen (mindestens 16 Zeichen).'; ui.fokus = 'pr-schluessel'; render(); return; }
    r.status = 'verbindet'; render();
    try {
      const info = await raumInfo(cfg());
      Object.assign(r, { status: 'verbunden', name: info.name, rechte: info.rechte, version: info.version, zuletzt: new Date().toISOString(), meldung: '' });
      pilotraumSpeichern(speicher, cfg());
      const eigene = anzahlEigeneAenderungen(datenHolen().p);
      await abgleichen({ meldung: false, uebernahme: true });
      r.meldung = `Verbunden mit „${info.name}“ (${info.rechte === 'bearbeiten' ? 'Bearbeiten' : 'nur Lesen'}).${eigene && info.rechte === 'bearbeiten' ? ` ${eigene} eigene Einträge dieses Browsers wurden in den Pilotraum übernommen.` : eigene ? ` ${eigene} eigene Einträge bleiben lokal (nur Leserecht).` : ''}`;
    } catch (e) { Object.assign(r, { status: 'fehler', fehler: e.message }); }
    render();
  }
  function trennen() { pilotraumSpeichern(speicher, null); Object.assign(ui.pilotraum, { status: 'getrennt', name: '', rechte: '', fehler: '', version: 0, zuletzt: '', meldung: 'Verbindung getrennt. Der zuletzt geladene Stand bleibt in diesem Browser.' }); }
  let laeuft = null;
  // Holt den gemeinsamen Stand, führt ihn mit dem lokalen zusammen und schreibt den lokalen Stand zurück (bei Bearbeitungsrecht).
  async function abgleichen({ meldung = false, uebernahme = false } = {}) {
    if (laeuft) return laeuft;
    laeuft = (async () => {
      const r = ui.pilotraum;
      try {
        const st = await standHolen(cfg());
        Object.assign(r, { status: 'verbunden', name: st.name, rechte: st.rechte, fehler: '' });
        const lokal = datenHolen().p;
        const vorherLokal = anzahlEigeneAenderungen(lokal);
        let neu = st.daten ? vereinige(st.daten, lokal) : lokal;
        const geaendert = JSON.stringify(neu) !== JSON.stringify(st.daten || null);
        datenSetzen(neu); r.version = st.version; r.zuletzt = new Date().toISOString();
        if (r.rechte === 'bearbeiten' && geaendert) {
          const w = await standSchreiben(cfg(), st.version, neu);
          if (w.konflikt) { neu = vereinige(w.daten || {}, neu); datenSetzen(neu); const w2 = await standSchreiben(cfg(), w.version, neu); if (w2.konflikt) throw new Error('Der Pilotraum wurde gleichzeitig geändert. Bitte noch einmal abgleichen.'); r.version = w2.version; } else r.version = w.version;
        }
        const jetzt = anzahlEigeneAenderungen(datenHolen().p);
        if (meldung) { r.meldung = `Abgeglichen: Fassung ${r.version}, ${jetzt} Einträge im Raum${jetzt !== vorherLokal ? ` (${jetzt - vorherLokal > 0 ? '+' : ''}${jetzt - vorherLokal} gegenüber diesem Browser)` : ''}.`; melde('Pilotraum abgeglichen.'); }
        if (!uebernahme) render();
      } catch (e) { r.status = r.name ? 'verbunden' : 'fehler'; r.fehler = e.message; if (meldung) melde(`Abgleich fehlgeschlagen: ${e.message}`); render(); throw e; }
      finally { laeuft = null; }
    })();
    return laeuft;
  }
  // Nach jeder lokalen Änderung in den Raum schreiben (nur mit Bearbeitungsrecht). Konflikte werden zusammengeführt.
  let schreibTimer = null;
  function nachAenderung() {
    if (ui.pilotraum.status !== 'verbunden' || ui.pilotraum.rechte !== 'bearbeiten') return;
    clearTimeout(schreibTimer); schreibTimer = setTimeout(() => abgleichen({ meldung: false }).catch(() => {}), 400);
  }

  return { eingabe, absenden, klick, datenLaden, start, nachAenderung, abgleichen, neuesFormular: leeresPilotformular, leererAnfrageEntwurf, baueDaten };
}
