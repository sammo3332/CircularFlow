import { evaluateCase, formatDate, OUTCOMES } from './rules.mjs';
import { DEMO_CASES, emptyCase, EVIDENCE, WORK_STATES } from './scenarios.mjs';
import { afterDoorRender, bindDoor, doorPageHtml } from './door-view.mjs';

const KEY = 'circularflow-testfaelle-v1';
const page = document.querySelector('#page');
const warning = document.querySelector('#storage-warning');
const toast = document.querySelector('#toast');
const navNames = { overview: 'Übersicht', projects: 'Projekte', case: 'Vorprüfung', door: 'Tür im selben Umbau' };
const factFields = {
  knownEvidence: ['knownAt'], receivedEvidence: ['receivedAt'], deadlineEvidence: ['deadline'],
  pickupEvidence: ['pickupStart', 'pickupEnd'], leadEvidence: ['leadDays'],
};
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

function showWarning(message) {
  warning.textContent = message;
  warning.hidden = false;
}

function loadCases() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return DEMO_CASES.map(item => ({ ...item }));
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved) || !saved.every(item => item && typeof item.id === 'string')) {
      throw new Error('Unbekanntes Speicherformat');
    }
    return saved.map(item => ({ ...emptyCase(), ...item }));
  } catch {
    showWarning('Der lokale Arbeitsstand konnte nicht geladen werden. Die Beispieldaten stehen für diese Sitzung bereit.');
    return DEMO_CASES.map(item => ({ ...item }));
  }
}

let cases = loadCases();
let view = 'overview';
let filter = 'all';
let draft = null;
let dirty = false;
let toastTimeout;

const icons = { check: '✓', clock: '◷', question: '?', all: '▦', offer: '↗', need: '↙' };
const button = (label, action, extra = '', kind = 'secondary') =>
  `<button class="button ${kind}" type="button" data-action="${action}" ${extra}>${label}</button>`;

function announce(message) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.hidden = false;
  toastTimeout = setTimeout(() => { toast.hidden = true; }, 4100);
}

function badge(kind) {
  const info = OUTCOMES[kind];
  return `<span class="badge status-${kind}"><span aria-hidden="true">${icons[info.icon]}</span>${info.short}</span>`;
}

function heading(kicker, title, copy, action = '') {
  return `<div class="page-heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="subtext">${copy}</p></div>${action}</div>`;
}

function overview() {
  const entries = cases.map(item => ({ item, kind: evaluateCase(item).kind }));
  const metrics = [
    ['all', 'Testfälle', entries.length],
    ['review', 'Weiter prüfen', entries.filter(x => x.kind === 'review').length],
    ['late', 'Zu spät', entries.filter(x => x.kind === 'late').length],
    ['clarify', 'Klärung nötig', entries.filter(x => x.kind === 'clarify').length],
  ];
  const visible = filter === 'all' ? entries : entries.filter(x => x.kind === filter);
  return `
    ${heading('CIRCULARFLOW · DORTMUND', 'Wiederverwendung früh prüfen', 'Angebote, Bedarfe und Fristen in einem nachvollziehbaren Ablauf.', button('<span aria-hidden="true">＋</span> Neuer Testfall', 'new', '', 'primary'))}
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-content"><span class="hero-tag"><span></span> VORPRÜFUNG</span><h2 id="hero-title">Reicht die Zeit für den nächsten Schritt?</h2><p>Spiel einen fiktiven Fall durch. CircularFlow prüft Informationszeitpunkt, Vorlauf und Übergabe und zeigt, was die zuständige Person als Nächstes klären kann.</p>${button('Beispielfall öffnen <span aria-hidden="true">→</span>', 'open', 'data-id="CF-DEMO-01"', 'hero-button')}</div>
      <div class="hero-graphic" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orbit orbit-three"></div><span class="node node-a">ANGEBOT</span><span class="node node-b">FRIST</span><span class="node node-c">BEDARF</span></div>
    </section>
    <section class="panel door-entry" aria-labelledby="door-entry-title"><div><h2 id="door-entry-title">Tür im selben Umbau</h2><p>Prüfe, was vor der Ersatzentscheidung noch fehlt.</p></div><span class="badge demo-badge">Simulation mit Beispieldaten</span><button class="button secondary" type="button" data-nav="door">Tür im selben Umbau öffnen <span aria-hidden="true">→</span></button></section>
    <div class="metric-grid" aria-label="Fallzahlen">${metrics.map(([key, label, count]) => `<div class="metric"><div class="metric-icon metric-${key}" aria-hidden="true">${icons[OUTCOMES[key]?.icon ?? 'all']}</div><strong>${count}</strong><span>${label}</span></div>`).join('')}</div>
    <section class="panel" aria-labelledby="case-list-title"><div class="panel-head"><div><h2 id="case-list-title">Testfälle</h2><p>Vorbereitete Situationen und deine lokal gespeicherten Varianten.</p></div><span class="local-label">Nur in diesem Browser</span></div>
      <div class="filters" aria-label="Ergebnis filtern">${metrics.map(([key, label]) => `<button type="button" data-filter="${key}" aria-pressed="${filter === key}">${key === 'all' ? 'Alle' : label}</button>`).join('')}</div>
      <div class="case-list">${visible.length ? visible.map(({ item, kind }) => `
        <button type="button" class="case-row" data-action="open" data-id="${esc(item.id)}"><span class="case-glyph" aria-hidden="true">◇</span><span class="case-copy"><strong>${esc(item.title)}</strong><small>${esc(item.supplyProject)} <span aria-hidden="true">→</span> ${esc(item.demandProject)}</small></span>${badge(kind)}<span class="row-arrow" aria-hidden="true">›</span></button>`).join('') : '<p class="empty">Für diesen Filter gibt es derzeit keinen Fall.</p>'}</div>
    </section>`;
}

function projectCards() {
  const projects = new Map();
  for (const item of cases) {
    const sides = [
      ['Angebot', item.supplyProject, item.supplyLocation, item.offerType, item.offerQty],
      ['Bedarf', item.demandProject, item.demandLocation, item.needType, item.needQty],
    ];
    for (const [role, name, location, type, quantity] of sides) {
      if (!name) continue;
      const key = JSON.stringify([role, name, location]);
      if (!projects.has(key)) projects.set(key, { role, name, location, type, quantity, ids: [] });
      projects.get(key).ids.push(item.id);
    }
  }
  return `${heading('PROJEKTÜBERSICHT', 'Projekte im Testablauf', 'Diese Übersicht entsteht aus den Angeboten und Bedarfen deiner Testfälle.', button('Neuer Testfall', 'new', '', 'primary'))}
    <section class="project-grid" aria-label="Projekte">${[...projects.values()].map(item => `<article class="panel project-card"><div class="panel-head"><div class="metric-icon" aria-hidden="true">${item.role === 'Angebot' ? icons.offer : icons.need}</div><span class="badge demo-badge">${item.role}</span></div><h2>${esc(item.name)}</h2><p>${esc(item.location || 'Ort offen')}</p><dl><div><dt>Beispiel aus den Fällen</dt><dd>${esc(item.type || 'Bauteil offen')}${item.quantity ? ` · ${esc(item.quantity)} Stück` : ''}</dd></div><div><dt>Verknüpfte Testfälle</dt><dd>${item.ids.length}</dd></div></dl><div class="project-links">${item.ids.map(id => button(esc(id), 'open', `data-id="${esc(id)}"`, 'secondary')).join('')}</div></article>`).join('') || '<p class="empty">Sobald du einen Fall mit Projektnamen speicherst, erscheinen hier die Projekte.</p>'}</section>`;
}

function input(name, label, { type = 'text', placeholder = '', required = false, max = 160, min = 0 } = {}) {
  const attrs = type === 'number' ? `min="${min}" max="${max}" step="1"` : type === 'text' ? `maxlength="${max}"` : '';
  return `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" value="${esc(draft[name])}" ${attrs}${required ? ' required' : ''}${placeholder ? ` placeholder="${esc(placeholder)}"` : ''}></div>`;
}

function select(name, label, values) {
  return `<div class="field"><label for="${name}">${label}</label><select name="${name}" id="${name}">${values.map(([key, text]) => `<option value="${esc(key)}"${draft[name] === key ? ' selected' : ''}>${esc(text)}</option>`).join('')}</select></div>`;
}

function evidenceField(dateName, statusName, label, { duration = false, secondDate = '' } = {}) {
  return `<div class="fact-row"><div class="fact-values">${input(dateName, label, duration ? { type: 'number', max: 365, placeholder: 'Offen' } : { type: 'date' })}${secondDate ? input(secondDate, 'Übergabe bis', { type: 'date' }) : ''}</div>${select(statusName, `Belegstatus · ${label}`, Object.entries(EVIDENCE))}</div>`;
}

function formattedFact(value, status) {
  return value && status !== 'unknown' ? `${formatDate(value)} · ${EVIDENCE[status] ?? 'Geschätzt'}` : 'Unbekannt';
}

function caseResult(item) {
  const result = evaluateCase(item);
  const outcome = OUTCOMES[result.kind];
  const dates = [
    ['Angebot bekannt', formattedFact(item.knownAt, item.knownEvidence)],
    ['Info angekommen', formattedFact(item.receivedAt, item.receivedEvidence)],
    ['Entscheidung bis', formattedFact(item.deadline, item.deadlineEvidence)],
    ['Mögliche Übergabe', item.pickupStart && item.pickupEnd && item.pickupEvidence !== 'unknown'
      ? `${formatDate(item.pickupStart)} – ${formatDate(item.pickupEnd)} · ${EVIDENCE[item.pickupEvidence] ?? 'Geschätzt'}` : 'Unbekannt'],
  ];
  return `<p class="eyebrow">ERGEBNIS DER VORPRÜFUNG</p><div class="result-heading status-${result.kind}"><span aria-hidden="true">${icons[outcome.icon]}</span><h2>${outcome.label}</h2></div>
    <ul class="reason-list">${result.reasons.map(reason => `<li>${esc(reason)}</li>`).join('')}</ul>
    ${result.estimates.length ? `<p class="estimate"><strong>Geschätzte Eingaben</strong><br>${esc(result.estimates.join(', '))}. Das Ergebnis gilt unter diesen Annahmen.</p>` : ''}
    <div class="next-step"><h3>Nächster menschlicher Schritt</h3><p>${esc(result.next)}</p></div>
    <dl class="timeline">${dates.map(([label, date], i) => `<div><span aria-hidden="true">${String.fromCharCode(65 + i)}</span><div><dt>${label}</dt><dd>${esc(date)}</dd></div></div>`).join('')}</dl>
    <p class="fineprint">Prüfvorschlag mit fiktiven Testdaten. Eignung und Freigabe prüfen qualifizierte Fachpersonen.</p>`;
}

function caseEditor() {
  const title = draft.id ? esc(draft.title) : 'Neuer Testfall';
  return `${heading(draft.id ? esc(draft.id) : 'FIKTIVE TESTUMGEBUNG', title, 'Bearbeite Angebot und Bedarf. Das Ergebnis aktualisiert sich während der Eingabe.', button('← Zur Fallübersicht', 'overview'))}
    <div class="editor-layout">
      <form id="case-form" class="editor-form">
        <section class="panel form-panel"><div class="panel-head"><div><h2>Fall und Zuständigkeit</h2><p>Nutze frei erfundene Angaben für diesen Prototyp.</p></div></div><div class="field-grid">${input('title', 'Fallname', { required: true, max: 100, placeholder: 'z. B. Trennwände für Innenausbau' })}${input('role', 'Zuständige Rolle', { placeholder: 'z. B. Bauleitung' })}${select('workState', 'Interner Arbeitsstatus', WORK_STATES.map(s => [s, s]))}</div></section>
        <section class="panel form-panel"><div class="panel-head"><div><h2>Angebot und Bedarf</h2><p>Stückzahlen und Zeitfenster bleiben je Projekt getrennt.</p></div></div>
          <fieldset><legend><span aria-hidden="true">↗</span> Angebotsprojekt</legend><div class="field-grid">
            ${input('supplyProject', 'Name Angebotsprojekt', { required: true })}${input('supplyLocation', 'Ort Angebotsprojekt')}${input('offerType', 'Angebotener Bauteiltyp')}${input('offerQty', 'Verfügbare Stückzahl', { type: 'number', min: 1, max: 1000000 })}${input('condition', 'Zustand / Dokumentation')}${input('dimensions', 'Maße / Ausführung')}
          </div></fieldset>
          <fieldset><legend><span aria-hidden="true">↙</span> Bedarfsprojekt</legend><div class="field-grid">
            ${input('demandProject', 'Name Bedarfsprojekt', { required: true })}${input('demandLocation', 'Ort Bedarfsprojekt')}${input('needType', 'Benötigter Bauteiltyp')}${input('needQty', 'Benötigte Stückzahl', { type: 'number', min: 1, max: 1000000 })}${input('needStart', 'Annahme ab', { type: 'date' })}${input('needEnd', 'Annahme bis', { type: 'date' })}
          </div></fieldset>
        </section>
        <section class="panel form-panel"><div class="panel-head"><div><h2>Zeitpunkte und Prüfzeit</h2><p>Leere Felder und als unbekannt markierte Werte fließen nicht in die Berechnung ein. Die Frist zählt einschließlich des Fristtags.</p></div></div>
          ${evidenceField('knownAt', 'knownEvidence', 'Angebot bekannt seit')}
          ${evidenceField('receivedAt', 'receivedEvidence', 'Info bei Bedarfsseite angekommen')}
          ${evidenceField('deadline', 'deadlineEvidence', 'Entscheidung bis')}
          ${evidenceField('pickupStart', 'pickupEvidence', 'Übergabe ab', { secondDate: 'pickupEnd' })}
          ${evidenceField('leadDays', 'leadEvidence', 'Mindestprüfzeit in Kalendertagen', { duration: true })}
        </section>
        <section class="panel form-panel"><div class="field"><label for="note">Notiz zum nächsten Schritt</label><textarea id="note" name="note" maxlength="500" rows="3" placeholder="z. B. Maße und Nachweise im Testgespräch erfragen">${esc(draft.note)}</textarea></div><div class="form-actions"><button class="button primary" type="submit">Fall lokal speichern</button>${button('Fallbericht herunterladen', 'export')}</div><p class="fineprint">Der Arbeitsstand bleibt in diesem Browser.</p></section>
      </form>
      <aside id="case-result" class="panel result-panel" aria-label="Ergebnis der Vorprüfung" aria-live="polite">${caseResult(draft)}</aside>
    </div>`;
}

function render() {
  document.querySelector('#view-name').textContent = navNames[view];
  for (const item of document.querySelectorAll('[data-nav]')) {
    if (item.dataset.nav === view) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  }
  if (view === 'door') {
    page.innerHTML = doorPageHtml();
    afterDoorRender(page);
    return;
  }
  page.innerHTML = view === 'overview' ? overview() : view === 'projects' ? projectCards() : caseEditor();
}

function navigate(next) {
  if (next === 'case' && !draft) draft = { ...(cases[0] ?? emptyCase()) };
  view = next;
  render();
  document.querySelector('main').focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function switchCase(item) {
  if (dirty && draft?.id !== item.id && !window.confirm('Den aktuellen Entwurf verwerfen? Gespeicherte Fälle bleiben erhalten.')) return;
  if (!dirty || draft?.id !== item.id) {
    draft = { ...item };
    dirty = false;
  }
  navigate('case');
}

function newCase() {
  if (dirty && !window.confirm('Den aktuellen Entwurf verwerfen? Gespeicherte Fälle bleiben erhalten.')) return;
  draft = emptyCase();
  dirty = false;
  navigate('case');
  document.querySelector('#title').focus();
}

function readForm(form) {
  const values = Object.fromEntries(new FormData(form));
  const item = { ...draft, ...Object.fromEntries(Object.entries(values).map(([key, value]) => [key, String(value).trim()])) };
  for (const [evidence, fields] of Object.entries(factFields)) {
    if (!fields.some(field => item[field])) item[evidence] = 'unknown';
  }
  return item;
}

function nextId() {
  let n = 1;
  while (cases.some(item => item.id === `CF-TEST-${String(n).padStart(3, '0')}`)) n++;
  return `CF-TEST-${String(n).padStart(3, '0')}`;
}

function persist(form) {
  const current = readForm(form);
  const required = [['title', 'Fallname'], ['supplyProject', 'Name Angebotsprojekt'], ['demandProject', 'Name Bedarfsprojekt']];
  const empty = required.find(([key]) => !current[key]);
  if (empty) {
    announce(`Bitte ${empty[1]} eintragen.`);
    form.elements[empty[0]].focus();
    return;
  }
  draft = { ...current, id: current.id || nextId(), updatedAt: new Date().toISOString() };
  const existing = cases.findIndex(item => item.id === draft.id);
  if (existing === -1) cases = [...cases, { ...draft }];
  else cases = cases.map(item => item.id === draft.id ? { ...draft } : item);
  dirty = false;
  try {
    localStorage.setItem(KEY, JSON.stringify(cases));
    warning.hidden = true;
    announce('Fall lokal gespeichert.');
  } catch {
    showWarning('Der Browser konnte den Fall nicht dauerhaft speichern. Der aktuelle Stand ist in dieser Sitzung verfügbar.');
    announce('Fall für diese Sitzung übernommen.');
  }
  render();
  document.querySelector('#case-form button[type="submit"]').focus({ preventScroll: true });
}

function exportCase() {
  const item = readForm(document.querySelector('#case-form'));
  const result = evaluateCase(item);
  const lines = [
    'CircularFlow · Fallbericht · Fiktive Testdaten', `${item.id || 'Entwurf'} · ${item.title || 'Ohne Namen'}`, '',
    `Angebot: ${item.supplyProject || 'offen'} · ${item.offerType || 'offen'} · ${item.offerQty || 'offen'} Stück`,
    `Bedarf: ${item.demandProject || 'offen'} · ${item.needType || 'offen'} · ${item.needQty || 'offen'} Stück`,
    `Zuständige Rolle: ${item.role || 'offen'}`, `Arbeitsstatus: ${item.workState}`,
    `Angebot bekannt: ${formattedFact(item.knownAt, item.knownEvidence)}`,
    `Info angekommen: ${formattedFact(item.receivedAt, item.receivedEvidence)}`,
    `Entscheidung bis: ${formattedFact(item.deadline, item.deadlineEvidence)}`,
    `Übergabefenster: ${formattedFact(item.pickupStart, item.pickupEvidence)} bis ${formattedFact(item.pickupEnd, item.pickupEvidence)}`,
    `Annahmefenster: ${formatDate(item.needStart)} bis ${formatDate(item.needEnd)}`,
    `Mindestprüfzeit: ${item.leadDays !== '' && item.leadEvidence !== 'unknown' ? `${item.leadDays} Kalendertage · ${EVIDENCE[item.leadEvidence]}` : 'Unbekannt'}`, '',
    OUTCOMES[result.kind].label, ...result.reasons, '', `Geschätzte Eingaben: ${result.estimates.join(', ') || 'keine'}`,
    `Nächster Schritt: ${result.next}`, `Notiz: ${item.note || 'offen'}`, '',
    'Prüfvorschlag. Fachliche Freigaben bleiben bei qualifizierten Personen.',
  ];
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `CircularFlow_${item.id || 'Entwurf'}.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  announce('Fallbericht heruntergeladen.');
}

document.addEventListener('click', event => {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.dataset.nav) navigate(target.dataset.nav);
  if (target.dataset.filter) {
    filter = target.dataset.filter;
    render();
    document.querySelector(`[data-filter="${filter}"]`).focus({ preventScroll: true });
  }
  const { action, id } = target.dataset;
  if (action === 'new') newCase();
  if (action === 'overview') navigate('overview');
  if (action === 'export') exportCase();
  if (action === 'open') {
    const item = cases.find(entry => entry.id === id);
    if (item) switchCase(item);
  }
});

page.addEventListener('input', event => {
  const form = event.target.closest('#case-form');
  if (!form) return;
  for (const [evidence, fields] of Object.entries(factFields)) {
    if (!fields.includes(event.target.name)) continue;
    const valueWasEntered = !fields.some(field => draft[field]) && fields.some(field => form.elements[field].value);
    if (valueWasEntered && form.elements[evidence].value === 'unknown') form.elements[evidence].value = 'estimated';
  }
  draft = readForm(form);
  for (const evidence of Object.keys(factFields)) form.elements[evidence].value = draft[evidence];
  dirty = true;
  document.querySelector('#case-result').innerHTML = caseResult(draft);
});

page.addEventListener('submit', event => {
  if (event.target.id !== 'case-form') return;
  event.preventDefault();
  persist(event.target);
});

bindDoor(page);
render();
