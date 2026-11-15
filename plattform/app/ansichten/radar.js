// Projektradar: Hinweise aus öffentlichen Quellen und direkten Meldungen, mit Prüfstatus.
// Ein Hinweis wird erst nach dokumentierter Prüfung zum Projekt, auch eine Direktmeldung.
// Die Plattform nimmt keinen Kontakt auf und ruft keine Quelle automatisch ab.
import { ARTEN, PERSONEN } from '../daten.js';
import { RADAR_STAND } from '../radar-daten.js';
import { esc, chip, leer, slug, artText } from '../ui.js';
import { PRUEFSTATUS } from '../regeln.js';
import { datum, zeit } from '../zeit.js';

export const leereMeldung = () => ({ titel: '', art: '', bezirk: '', melder: '', text: '', einwilligung: false });
export const BEZIRKE = ['Aplerbeck', 'Brackel', 'Eving', 'Hombruch', 'Hörde', 'Huckarde', 'Innenstadt-Nord', 'Innenstadt-Ost', 'Innenstadt-West', 'Lütgendortmund', 'Mengede', 'Scharnhorst'];
const REIHENFOLGE = { neu: 0, gemeldet: 1, pruefung: 2, bestaetigt: 3, verworfen: 4 };
const AKTION = { pruefen: 'Prüfung begonnen', bestaetigen: 'als Projekt bestätigt', verwerfen: 'verworfen', gemeldet: 'Meldung eingegangen' };
const tag = (d) => datum(`${d}T00:00`);

export function radar(ctx, r) {
  const tabs = [['radar', 'Hinweise', 'hinweise'], ['radar-quellen', 'Quellen', 'quellen'], ['radar-melden', 'Projekt melden', 'melden']];
  return `
  <section class="seitenkopf"><div><p class="eyebrow">Projektradar · Dortmund</p><h1>Projekte früh erkennen</h1>
    <p class="unter">Hinweise aus öffentlichen Quellen und direkten Meldungen. Quellen zuletzt gesichtet am ${tag(RADAR_STAND.geprueftAm)}.</p>
    <p class="unter">${chip('kein automatischer Abruf', 'neutral')} ${chip('keine automatische Kontaktaufnahme', 'neutral')}</p></div></section>
  <nav class="reiter" aria-label="Bereiche des Projektradars">${tabs.map(([h, t, k]) => `<a href="#${h}" ${r.tab === k ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
  ${r.tab === 'quellen' ? quellen(ctx) : r.tab === 'melden' ? melden(ctx) : hinweise(ctx, r.hinweis)}`;
}

// Offene Hinweise zuerst, innerhalb eines Status echte vor erfundenen, dann die neuesten.
export function sortiereHinweise(liste) {
  return [...liste].sort((a, b) => (REIHENFOLGE[a.status] - REIHENFOLGE[b.status])
    || (a.beispiel === b.beispiel ? 0 : a.beispiel ? 1 : -1)
    || (a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0));
}

function hinweise(ctx, aktiv) {
  const f = ctx.ui.radar.status;
  const alle = ctx.daten.hinweise;
  const liste = sortiereHinweise(alle.filter((h) => !f || h.status === f));
  const zahl = (s) => alle.filter((h) => h.status === s).length;
  return `<p class="hinweisbox">Ein Hinweis ist noch kein Projekt. Erst nach dokumentierter Prüfung erscheint er als bestätigtes Projekt auf der Karte. Kontakt nimmt Ihr Team außerhalb der Plattform auf.</p>
  <div class="filterleiste" role="group" aria-label="Nach Prüfstatus filtern">
    <button type="button" class="filterchip" aria-pressed="${!f}" data-action="radar-filter" data-wert="">Alle ${alle.length}</button>
    ${Object.entries(PRUEFSTATUS).map(([k, s]) => `<button type="button" class="filterchip" aria-pressed="${f === k}" data-action="radar-filter" data-wert="${k}">${esc(s.label)} ${zahl(k)}</button>`).join('')}
  </div>
  ${liste.length ? `<ul class="hinweisliste">${liste.map((h) => hinweis(ctx, h, aktiv?.id === h.id)).join('')}</ul>` : leer('Keine Hinweise in diesem Status.', 'Anderen Filter wählen oder ein Projekt melden.', '<a class="knopf" href="#radar-melden">Projekt melden</a>')}`;
}

function herkunft(h) {
  if (h.beispiel) return chip('Beispiel, erfunden', 'sim');
  if (h.quelle === 'meldung') return chip('Direktmeldung', 'info');
  return chip('öffentliche Quelle', 'neutral');
}

function hinweis(ctx, h, aktiv) {
  const s = PRUEFSTATUS[h.status];
  const id = slug(h.id);
  const fehler = ctx.ui.radar.fehler[h.id] || {};
  const projekt = h.status === 'bestaetigt' ? ctx.daten.projekte.find((p) => p.hinweis === h.id) : null;
  const heute = ctx.at.slice(0, 10);
  const fe = (k) => (fehler[k] ? `<p class="feld-meldung" id="fehler-${k}-${id}">${esc(fehler[k])}</p>` : '');
  const inv = (k) => (fehler[k] ? `aria-invalid="true" aria-describedby="fehler-${k}-${id}"` : '');
  const notizFeld = (label) => `<div class="feld"><label for="notiz-${id}">${label}</label><textarea id="notiz-${id}" data-radar-notiz="${esc(h.id)}" rows="2" ${inv('notiz')}>${esc(ctx.ui.radar.notiz[h.id] || '')}</textarea>${fe('notiz')}</div>`;
  const bezirkFeld = () => (h.bezirk ? '' : `<div class="feld"><label for="bezirk-${id}">Stadtbezirk festlegen</label><select id="bezirk-${id}" data-radar-bezirk="${esc(h.id)}" ${inv('bezirk')}><option value="">Bitte wählen</option>${BEZIRKE.map((b) => `<option ${ctx.ui.radar.bezirk[h.id] === b ? 'selected' : ''}>${b}</option>`).join('')}</select>${fe('bezirk')}</div>`);
  const ort = [h.ort, h.bezirk ? `Bezirk ${h.bezirk}${h.bezirkHinweis ? ` (${h.bezirkHinweis})` : ''}` : `Bezirk ${h.bezirkHinweis || 'offen'}`].filter(Boolean).join(' · ');
  const verlauf = (h.verlauf || []).map((v) => {
    const wer = PERSONEN[v.von]?.name;
    return `<li><span class="mono">${zeit(v.at)}</span> ${wer ? `${esc(wer)}: ` : ''}${esc(AKTION[v.aktion] || v.aktion)}${v.notiz ? ` – ${esc(v.notiz)}` : ''}</li>`;
  }).join('');

  let aktionen;
  if (h.status === 'neu') {
    aktionen = ctx.ui.radar.verwerfen[h.id]
      ? `${notizFeld('Grund für das Verwerfen')}<div class="ergebnis-aktionen"><button type="button" class="knopf-zweit" data-action="radar-verwerfen" data-hinweis="${esc(h.id)}">Verwerfen bestätigen</button><button type="button" class="knopf-leise" data-action="radar-verwerfen-abbrechen" data-hinweis="${esc(h.id)}">Abbrechen</button></div>`
      : `<div class="ergebnis-aktionen"><button type="button" class="knopf" data-action="radar-pruefen" data-hinweis="${esc(h.id)}">Prüfung beginnen</button><button type="button" class="knopf-leise" data-action="radar-verwerfen-frage" data-hinweis="${esc(h.id)}">Verwerfen …</button></div>`;
  } else if (h.status === 'pruefung' || h.status === 'gemeldet') {
    aktionen = `<p class="leise">Vor der Bestätigung prüfen: Erfüllungsort in Dortmund, Art der Maßnahme, Zeitraum und zuständige Stelle.</p>
      <div class="formular formular-eng">${bezirkFeld()}${notizFeld(h.status === 'gemeldet' ? 'Prüfnotiz, z. B. Meldung mit dem Projektträger abgeglichen' : 'Prüfnotiz, z. B. Ort, Zeitraum und Zuständigkeit bestätigt')}</div>
      <div class="ergebnis-aktionen"><button type="button" class="knopf" data-action="radar-bestaetigen" data-hinweis="${esc(h.id)}">Als Projekt bestätigen</button><button type="button" class="knopf-leise" data-action="radar-verwerfen" data-hinweis="${esc(h.id)}">Verwerfen</button></div>`;
  } else if (h.status === 'bestaetigt') {
    aktionen = projekt ? `<p>Bestätigt. <a href="#projekt-${slug(projekt.kurz)}">Projekt ${esc(projekt.kurz)} öffnen</a> oder auf der <a href="#projekte">Karte</a> ansehen.</p>` : '<p>Bestätigt.</p>';
  } else {
    aktionen = '<p class="leise">Verworfen. Der Hinweis bleibt zur Nachvollziehbarkeit sichtbar.</p>';
  }

  return `<li class="flaeche hinweis ${aktiv ? 'aktiv' : ''}" id="hinweis-${id}">
    <div class="hinweis-kopf">${chip(s.label, s.ton)}${herkunft(h)}${h.vorbehalt ? chip('Quelle mit Nutzungsvorbehalt', 'warn') : ''}<span class="mono leise">${esc(h.id)}</span></div>
    <h3 id="hinweis-titel-${id}" tabindex="-1">${esc(h.titel)}</h3>
    <div class="hinweis-meta"><span>${esc(artText(h.art))}</span><span>${esc(ort)}</span></div>
    <dl class="hinweis-quelle">
      <div><dt>Quelle</dt><dd>${h.quelleUrl ? `<a href="${esc(h.quelleUrl)}" target="_blank" rel="noopener noreferrer">${esc(h.quelleName)}</a>` : esc(h.quelleName)}${h.typ && !h.beispiel ? `<small>${esc(h.typ)}</small>` : ''}</dd></div>
      <div><dt>Datum</dt><dd class="mono">${tag(h.datum)}</dd></div>
      <div><dt>Abgerufen</dt><dd class="mono">${tag(h.abgerufen)}</dd></div>
      ${h.frist ? `<div><dt>${esc(h.fristText || 'Frist')}</dt><dd class="mono">${tag(h.frist)}${h.frist < heute ? ' <small>abgelaufen</small>' : ''}</dd></div>` : ''}
      <div><dt>Relevanz</dt><dd><b class="relevanz-${esc(h.relevanz)}">${esc(h.relevanz)}</b></dd></div>
    </dl>
    ${h.relevanzText ? `<p>${esc(h.relevanzText)}</p>` : ''}
    ${h.text ? `<p class="leise">${esc(h.text)}</p>` : ''}
    ${h.offen ? `<p class="hinweis-offen"><b>Nicht belegt:</b> ${esc(h.offen)}</p>` : ''}
    ${verlauf ? `<div><p class="label">Prüfverlauf</p><ul class="pruefverlauf">${verlauf}</ul></div>` : ''}
    ${fehler.allgemein ? `<p class="feld-meldung" role="alert">${esc(fehler.allgemein)}</p>` : ''}
    <div class="hinweis-aktionen">${aktionen}</div>
  </li>`;
}

function quellen(ctx) {
  const q = ctx.daten.quellen;
  if (!q.length) return leer('Noch keine Quellen bewertet.', 'Die Bewertung der Quellen folgt.');
  const zeile = (k, v) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`;
  return `<p class="hinweisbox">Bewertung am ${tag(RADAR_STAND.geprueftAm)}. ${esc(RADAR_STAND.methode)} Der Prototyp ruft keine Quelle automatisch ab.</p>
  <section class="flaeche"><h2>Empfehlung für den ersten Radar</h2>
    <ol class="empfehlung">${RADAR_STAND.empfehlung.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
  </section>
  <ul class="quellenliste">${q.map((x) => `<li class="flaeche quelle">
    <div class="hinweis-kopf">${chip(x.art, 'neutral')}${x.stufe ? chip(`Empfehlung, Schritt ${x.stufe}`, 'ok') : ''}<span>Relevanz: <b class="relevanz-${esc(x.relevanz)}">${esc(x.relevanz)}</b></span></div>
    <h3>${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.name)}</a>` : esc(x.name)}</h3>
    <p class="leise">${esc(x.betreiber)}</p>
    <dl class="quelle-werte">${zeile('Aktualität', x.aktualitaet)}${zeile('Abdeckung', x.abdeckung)}${zeile('Zugriff', x.zugriff)}${zeile('Lizenz und Nutzung', x.lizenz)}${zeile('Felder', x.felder)}${zeile('Relevanz für Umbau, Sanierung, Rückbau', x.relevanzText)}${zeile('Einsatz', x.einsatz)}</dl>
  </li>`).join('')}</ul>
  <div class="zweispaltig">
    <section class="flaeche"><h2>Lehre aus der Recherche: nach Erfüllungsort filtern</h2>
      <p class="leise">Mehrere Treffer nannten Dortmund nur als Sitz der Vergabestelle oder des Auftragnehmers.</p>
      <ul class="einfache-liste">${RADAR_STAND.fehltreffer.map((f) => `<li>${f.url ? `<a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">${esc(f.text)}</a>` : esc(f.text)}</li>`).join('')}</ul>
    </section>
    <section class="flaeche"><h2>Vor einem automatischen Abruf zu klären</h2>
      <ul class="einfache-liste">${RADAR_STAND.rechtsfragen.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    </section>
  </div>`;
}

function melden(ctx) {
  const m = ctx.ui.radar.meldung; const f = ctx.ui.radar.meldungFehler;
  const fe = (k) => (f[k] ? `<p class="feld-meldung" id="meldung-${k}-f">${esc(f[k])}</p>` : '');
  const inv = (k) => (f[k] ? `aria-invalid="true" aria-describedby="meldung-${k}-f"` : '');
  return `<section class="flaeche erf-karte" aria-labelledby="h-melden">
    <h2 id="h-melden">Projekt direkt melden</h2>
    <p class="leise">Für Projektträger, Planungsbüros und Rückbaubetriebe. Die Meldung wird nur in diesem Browser gespeichert und wartet auf Prüfung. Es wird nichts versendet und niemand benachrichtigt.</p>
    <form id="meldeformular" novalidate>
      <div class="formular formular-eng">
        <div class="feld"><label for="meldung-titel">Projekttitel</label><input id="meldung-titel" data-meldung="titel" value="${esc(m.titel)}" autocomplete="off" ${inv('titel')}>${fe('titel')}</div>
        <div class="feld"><label for="meldung-art">Art der Maßnahme</label><select id="meldung-art" data-meldung="art" ${inv('art')}><option value="">Bitte wählen</option>${Object.entries(ARTEN).map(([k, t]) => `<option value="${k}" ${m.art === k ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>${fe('art')}</div>
        <div class="feld"><label for="meldung-bezirk">Stadtbezirk</label><select id="meldung-bezirk" data-meldung="bezirk" ${inv('bezirk')}><option value="">Bitte wählen</option>${BEZIRKE.map((b) => `<option ${m.bezirk === b ? 'selected' : ''}>${b}</option>`).join('')}</select>${fe('bezirk')}</div>
        <div class="feld"><label for="meldung-melder">Wer meldet? Rolle oder Organisation</label><input id="meldung-melder" data-meldung="melder" value="${esc(m.melder)}" placeholder="z. B. Projektträger, Planungsbüro" autocomplete="off" ${inv('melder')}>${fe('melder')}</div>
      </div>
      <div class="feld" style="margin-top:12px"><label for="meldung-text">Kurzbeschreibung (optional)</label><textarea id="meldung-text" data-meldung="text" rows="3" placeholder="Zeitraum, betroffene Bauteile. Bitte keine Namen oder Telefonnummern.">${esc(m.text)}</textarea></div>
      <label class="schalter" style="margin-top:8px"><input type="checkbox" id="meldung-einwilligung" data-meldung="einwilligung" ${m.einwilligung ? 'checked' : ''} ${inv('einwilligung')}><span>Die Angaben sind korrekt, und ich darf das Projekt melden.</span></label>${fe('einwilligung')}
      <div class="ergebnis-aktionen"><button type="submit" class="knopf">Meldung speichern</button></div>
    </form>
  </section>`;
}
