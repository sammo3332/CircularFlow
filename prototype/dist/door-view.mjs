// Darstellung und Eingabeverarbeitung der Türkarte (CF-UMBAU-01 Revision 2).
// Der Zustand liegt nur im Arbeitsspeicher. Es gibt keinen localStorage und keinen Export.
// Die Fachregeln stehen in door-rules.mjs.
import {
  DEADLINES, DOOR, REFERENCE_OPTIONS, REQUIREMENT, SAMPLE_MEASUREMENT, STATUS_OPTIONS, TEXT, VIEW_TIMES,
  emptyMeasurement, evaluateDoor, formatWall,
} from './door-rules.mjs';

const START_AT = VIEW_TIMES[0].at;
const FIELDS = ['valueText', 'reference', 'status', 'source', 'measuredOn', 'receivedAt'];
const KIND_CLASS = { met: 'review', open: 'clarify', missed: 'late' };
const MEASURE_CLASS = { onTime: 'review', pending: 'clarify', overdue: 'late', late: 'late' };
const REPLACE_CLASS = { open: 'review', elapsed: 'late' };

const state = { at: START_AT, measurement: emptyMeasurement() };

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

export function getDoorState() {
  return { at: state.at, measurement: { ...state.measurement } };
}

export function evaluateState(current = state) {
  return evaluateDoor({ requirement: REQUIREMENT, measurement: current.measurement, deadlines: DEADLINES, at: current.at });
}

const badge = (kind, text) => `<span class="badge status-${kind}">${esc(text)}</span>`;

function decisionHtml(result) {
  const step = result.mainStep;
  return `<p class="eyebrow">NÄCHSTER SCHRITT</p>
    <h2 class="door-step">${esc(step.text)}</h2>
    <p class="door-role">Rolle: ${esc(step.role)}</p>
    <p>${esc(step.reason)}</p>
    ${step.note ? `<p><strong>${esc(step.note)}</strong></p>` : ''}
    <h3>Weiterhin offen</h3>
    ${result.stillOpen.length
    ? `<ul class="reason-list">${result.stillOpen.map(item => `<li>${esc(item.text)} <span class="door-role">(Rolle: ${esc(item.role)})</span></li>`).join('')}</ul>`
    : '<p>Nichts weiter offen.</p>'}`;
}

function deadlineStatusHtml(result) {
  return `<dl class="door-deadlines">
      <div><dt>Aufmaßfrist</dt><dd>${esc(formatWall(DEADLINES.measureDeadline))} ${badge(MEASURE_CLASS[result.measureStatus.key], result.measureStatus.label)}</dd></div>
      <div><dt>Ersatzentscheidung</dt><dd>${esc(formatWall(DEADLINES.replaceDeadline))} ${badge(REPLACE_CLASS[result.replaceStatus.key], result.replaceStatus.label)}</dd></div>
    </dl>
    <p class="fineprint">${esc(TEXT.orderNote)}</p>
    ${result.warnings.map(text => `<p class="door-warning" role="alert">${esc(text)}</p>`).join('')}`;
}

function compareHtml(result, measurement) {
  const source = String(measurement.source ?? '').trim();
  return `<dl class="door-compare-list">
      <div><dt>Ist</dt><dd>${esc(result.istText)}</dd></div>
      <div><dt>Soll</dt><dd>${REQUIREMENT.minMm}–${REQUIREMENT.maxMm} ${esc(REQUIREMENT.unit)}</dd></div>
    </dl>
    <p class="fineprint">Herkunft: ${esc(REQUIREMENT.origin)}</p>
    <p class="fineprint">Messstelle: ${esc(REQUIREMENT.measuringPoint)}</p>
    ${source ? `<p class="fineprint">Belegquelle: ${esc(source)}</p>` : ''}
    <p class="door-finding">${badge(KIND_CLASS[result.width.kind], 'Befund')} ${esc(result.width.text)}</p>
    <p class="fineprint">${esc(TEXT.widthNote)}</p>`;
}

export function doorParts(current = state) {
  const result = evaluateState(current);
  return {
    result,
    decision: decisionHtml(result),
    deadlines: deadlineStatusHtml(result),
    compare: compareHtml(result, current.measurement),
  };
}

function field(name, label, control, hint = '') {
  return `<div class="field"><label for="door-${name}">${label}</label>${control}${hint ? `<p class="fineprint">${hint}</p>` : ''}<p class="door-error" id="door-err-${name}" hidden></p></div>`;
}

function selectHtml(name, options, selected) {
  return `<select id="door-${name}" name="${name}" data-door-field>${options.map(option => `<option value="${esc(option)}"${option === selected ? ' selected' : ''}>${esc(option)}</option>`).join('')}</select>`;
}

export function doorPageHtml(current = state) {
  const m = current.measurement;
  const parts = doorParts(current);
  return `<div class="page-heading"><div><p class="eyebrow">SIMULATION MIT BEISPIELDATEN</p><h1 id="door-title" tabindex="-1">Tür im selben Umbau</h1><p class="subtext">${esc(DOOR.name)} aus ${esc(DOOR.from)} → Zielöffnung ${esc(DOOR.target)} <span class="badge demo-badge">Simulation mit Beispieldaten</span></p></div><button class="button secondary" type="button" data-nav="overview">← Zur Übersicht</button></div>
    <p id="door-notice" class="door-notice" role="status"></p>
    <div class="door-grid">
      <section id="door-decision" class="panel door-panel" aria-label="Entscheidung" aria-live="polite">${parts.decision}</section>
      <section class="panel door-panel" aria-labelledby="door-deadlines-title">
        <h2 id="door-deadlines-title">Fristen</h2>
        <div id="door-deadlines">${parts.deadlines}</div>
        <fieldset class="door-times"><legend>Betrachtungszeit (Europe/Berlin, UTC+01:00)</legend>
          ${VIEW_TIMES.map(time => `<label class="door-radio"><input type="radio" name="door-at" value="${esc(time.at)}"${time.at === current.at ? ' checked' : ''}> ${esc(time.label)}</label>`).join('')}
        </fieldset>
      </section>
      <section id="door-compare" class="panel door-panel" aria-label="Maßvergleich">
        <h2>Rohbauöffnungsbreite B-02</h2>
        <div id="door-compare-body">${parts.compare}</div>
      </section>
      <section class="panel door-panel" aria-labelledby="door-form-title">
        <h2 id="door-form-title">Aufmaß erfassen</h2>
        <div class="door-fields" id="door-fields">
          ${field('valueText', 'Wert in mm', `<input id="door-valueText" name="valueText" type="text" inputmode="decimal" autocomplete="off" data-door-field value="${esc(m.valueText)}">`, 'Nur die Zahl, Komma oder Punkt als Dezimalzeichen.')}
          ${field('reference', 'Messbezug', selectHtml('reference', REFERENCE_OPTIONS, m.reference))}
          ${field('status', 'Messstatus', selectHtml('status', STATUS_OPTIONS, m.status))}
          ${field('source', 'Belegquelle', `<input id="door-source" name="source" type="text" maxlength="160" autocomplete="off" data-door-field value="${esc(m.source)}">`, 'Nur fiktive Angaben, keine echten Namen oder Fallnotizen eintragen.')}
          ${field('measuredOn', 'Messdatum', `<input id="door-measuredOn" name="measuredOn" type="date" data-door-field value="${esc(m.measuredOn)}">`)}
          ${field('receivedAt', 'Eingang bei der Planung (Europe/Berlin)', `<input id="door-receivedAt" name="receivedAt" type="datetime-local" data-door-field value="${esc(m.receivedAt)}">`)}
        </div>
        <div class="form-actions"><button class="button secondary" type="button" data-action="door-sample">Beispielaufmaß einsetzen</button><button class="button secondary" type="button" data-action="door-reset">Simulation zurücksetzen</button></div>
      </section>
    </div>
    <section class="panel door-panel door-other" aria-labelledby="door-other-title"><h2 id="door-other-title">Weitere Prüfpunkte (Fachperson)</h2><p>${parts.result.otherChecks.map(esc).join(' · ')} – offen, nicht bewertet.</p></section>`;
}

function applyErrors(page, result) {
  for (const name of FIELDS) {
    const message = result.fieldErrors[name];
    const control = page.querySelector(`#door-${name}`);
    const out = page.querySelector(`#door-err-${name}`);
    if (!control || !out) continue;
    out.textContent = message ?? '';
    out.hidden = !message;
    if (message) {
      control.setAttribute('aria-invalid', 'true');
      control.setAttribute('aria-describedby', out.id);
    } else {
      control.removeAttribute('aria-invalid');
      control.removeAttribute('aria-describedby');
    }
  }
}

// Aktualisiert nur den Ergebnisbereich. Formularfelder und Radiogruppe bleiben unberührt (Fokus).
function updateResults(page) {
  const parts = doorParts();
  page.querySelector('#door-decision').innerHTML = parts.decision;
  page.querySelector('#door-deadlines').innerHTML = parts.deadlines;
  page.querySelector('#door-compare-body').innerHTML = parts.compare;
  applyErrors(page, parts.result);
}

export function afterDoorRender(page) {
  applyErrors(page, evaluateState());
}

function setNotice(page, text) {
  page.querySelector('#door-notice').textContent = text;
}

function writeForm(page) {
  for (const name of FIELDS) page.querySelector(`#door-${name}`).value = state.measurement[name];
}

export function bindDoor(page) {
  page.addEventListener('input', event => onFieldChange(page, event));
  page.addEventListener('change', event => {
    if (event.target.name === 'door-at') {
      state.at = event.target.value;
      setNotice(page, '');
      updateResults(page);
    } else onFieldChange(page, event);
  });
  page.addEventListener('click', event => {
    const target = event.target.closest('button[data-action^="door-"]');
    if (!target || !page.querySelector('#door-fields')) return;
    if (target.dataset.action === 'door-sample') {
      state.measurement = { ...SAMPLE_MEASUREMENT };
      writeForm(page);
      updateResults(page);
      setNotice(page, SAMPLE_MEASUREMENT.receivedAt > state.at
        ? `Beispielaufmaß eingesetzt. Eingang ${formatWall(SAMPLE_MEASUREMENT.receivedAt)} liegt nach der Betrachtungszeit. Betrachtungszeit auf 18.11.2026, 15:30 Uhr stellen.`
        : 'Beispielaufmaß eingesetzt.');
    }
    if (target.dataset.action === 'door-reset') {
      state.at = START_AT;
      state.measurement = emptyMeasurement();
      writeForm(page);
      for (const radio of page.querySelectorAll('input[name="door-at"]')) radio.checked = radio.value === START_AT;
      updateResults(page);
      setNotice(page, 'Simulation zurückgesetzt.');
      page.querySelector('#door-title').focus();
    }
  });
}

function onFieldChange(page, event) {
  const target = event.target;
  if (!target.matches?.('[data-door-field]') || !page.querySelector('#door-fields')) return;
  state.measurement = { ...state.measurement, [target.name]: target.value.trim() };
  setNotice(page, '');
  updateResults(page);
}
