// Reine Regel der Türsimulation (CF-UMBAU-01 Revision 2).
// Kein DOM, kein Speicher, keine Systemuhr. Alle Zeitwerte sind Berliner
// Wanduhr-Zeichenketten ("YYYY-MM-DDTHH:mm", Datum "YYYY-MM-DD"). Sie werden nach
// der Kalenderprüfung als Zeichenketten verglichen, daher hängt das Ergebnis
// weder von der Gerätezeitzone noch von der Systemuhr ab.

export const NOT_GIVEN = 'nicht angegeben';

export const DOOR = {
  id: 'T-07',
  name: 'Tür T-07 samt Zarge',
  from: 'Raum A',
  target: 'B-02',
};

export const REQUIREMENT = {
  reference: 'Rohbauöffnungsbreite B-02, Messstelle laut P-02',
  measuringPoint: 'horizontal zwischen den seitlichen Rohbaukanten von B-02, 1,00 m über Oberkante Rohfußboden',
  origin: 'fiktives Planungsblatt P-02 · Simulationsannahme',
  minMm: 885,
  maxMm: 895,
  unit: 'mm',
};

export const DEADLINES = {
  measureDeadline: '2026-11-18T16:00',
  replaceDeadline: '2026-11-19T12:00',
};

export const VIEW_TIMES = [
  { at: '2026-11-18T14:00', label: '18.11.2026, 14:00 Uhr (Start)' },
  { at: '2026-11-18T15:30', label: '18.11.2026, 15:30 Uhr' },
  { at: '2026-11-19T09:00', label: '19.11.2026, 09:00 Uhr' },
  { at: '2026-11-20T09:00', label: '20.11.2026, 09:00 Uhr' },
];

export const REFERENCE_OPTIONS = [REQUIREMENT.reference, 'lichte Breite', 'Türblattmaß', NOT_GIVEN];
export const STATUS_OPTIONS = ['gemessen', 'geschätzt', 'vorgeschlagen', NOT_GIVEN];
export const OTHER_CHECKS = ['Höhe', 'Anschlag', 'Zustand'];

export const TEXT = {
  met: 'Breitenkriterium erfüllt',
  open: 'Breite offen',
  widthNote: 'Der Befund bewertet ausschließlich die Breite. Über die Eignung entscheiden die zuständigen Fachleute.',
  orderNote: 'Der Termin dokumentiert keine ausgelöste Bestellung.',
  conflict: 'Aufmaß ist erst nach der Ersatzentscheidung fällig',
  contradictory: 'Eingang vor Messdatum – widersprüchlich',
  technical: 'Weitere technische Anforderungen bleiben offen.',
};

export const SAMPLE_MEASUREMENT = {
  valueText: '890',
  unit: 'mm',
  reference: REQUIREMENT.reference,
  status: 'gemessen',
  source: 'fiktive Aufmaßnotiz',
  measuredOn: '2026-11-18',
  receivedAt: '2026-11-18T15:00',
};

export function emptyMeasurement() {
  return { valueText: '', unit: 'mm', reference: NOT_GIVEN, status: NOT_GIVEN, source: '', measuredOn: '', receivedAt: '' };
}

// ---- Zeitwerte (reine Zeichenkettenprüfung) ----

function daysInMonth(year, month) {
  if (month === 2) return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function validDay(y, m, d) {
  return y >= 1 && m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(y, m);
}

export function isWallDate(value) {
  const match = typeof value === 'string' && /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return Boolean(match) && validDay(+match[1], +match[2], +match[3]);
}

export function isWallDateTime(value) {
  const match = typeof value === 'string' && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  return Boolean(match) && validDay(+match[1], +match[2], +match[3]) && +match[4] < 24 && +match[5] < 60;
}

export function formatWall(value) {
  const [date, time] = value.split('T');
  const [y, m, d] = date.split('-');
  return time ? `${d}.${m}.${y}, ${time} Uhr` : `${d}.${m}.${y}`;
}

export function formatMm(number) {
  return String(Math.round(number * 1000) / 1000).replace('.', ',');
}

// ---- Wertfeld ----

function parseValue(raw) {
  const text = String(raw ?? '').trim();
  if (!text) return { error: 'Wert fehlt.' };
  if (/^\d+([.,]\d+)?$/.test(text)) {
    // Auf 0,001 mm runden: Vergleich und Anzeige verwenden dieselbe Zahl.
    const mm = Math.round(Number(text.replace(',', '.')) * 1000) / 1000;
    return Number.isFinite(mm) && mm > 0 ? { mm } : { error: 'Wert ist keine positive Zahl.' };
  }
  if (/^\d+([.,]\d+)?\s*\p{L}+\.?$/u.test(text)) return { error: 'Bitte nur die Zahl in mm eingeben.' };
  return { error: 'Wert ist keine positive Zahl.' };
}

function assertWall(value, name, withTime = true) {
  if (!(withTime ? isWallDateTime(value) : isWallDate(value))) {
    throw new TypeError(`${name} ist kein gültiger Zeitwert: ${String(value)}`);
  }
}

// ---- Regel ----

export function evaluateDoor({ requirement, measurement, deadlines, at }) {
  assertWall(at, 'at');
  assertWall(deadlines?.measureDeadline, 'measureDeadline');
  assertWall(deadlines?.replaceDeadline, 'replaceDeadline');
  const m = { ...emptyMeasurement(), ...(measurement ?? {}) };
  const str = key => String(m[key] ?? '').trim();
  const valueText = str('valueText');
  const reference = str('reference');
  const status = str('status');
  const source = str('source');
  const measuredOn = str('measuredOn');
  const receivedAt = str('receivedAt');
  const isEmpty = !valueText && !source && !measuredOn && !receivedAt
    && (!reference || reference === NOT_GIVEN) && (!status || status === NOT_GIVEN);

  // 1. Feldprüfung (Fehler am Feld) und Eingang
  const errors = [];
  const fail = (field, text) => errors.push({ field, text });
  const value = parseValue(valueText);
  if (value.error) fail('valueText', value.error);
  if (String(m.unit ?? '').trim() !== requirement.unit) fail('valueText', `Einheit ist nicht ${requirement.unit}.`);
  if (reference !== requirement.reference) {
    fail('reference', `Erfasster Bezug: ${reference || NOT_GIVEN}. Erwartet: ${requirement.reference}.`);
  }
  if (status !== 'gemessen') {
    fail('status', !status || status === NOT_GIVEN ? 'Messstatus fehlt.' : `Status „${status}“ zählt nicht als Aufmaß.`);
  }
  if (!source) fail('source', 'Belegquelle fehlt.');
  const measuredOk = isWallDate(measuredOn);
  if (!measuredOk) fail('measuredOn', 'Messdatum fehlt oder ist ungültig.');

  let receipt;
  if (!receivedAt) receipt = { state: 'missing', label: 'noch nicht eingegangen' };
  else if (!isWallDateTime(receivedAt)) {
    receipt = { state: 'invalid', label: 'Eingang ungültig' };
    fail('receivedAt', 'Eingang ist kein gültiger Zeitwert.');
  } else if (receivedAt > at) receipt = { state: 'notYet', label: 'noch nicht eingegangen' };
  else if (measuredOk && receivedAt.slice(0, 10) < measuredOn) {
    receipt = { state: 'contradictory', label: TEXT.contradictory };
    fail('receivedAt', TEXT.contradictory);
  } else receipt = { state: 'received', label: 'eingegangen' };

  const reasons = errors.map(error => error.text);
  if (receipt.state === 'missing') reasons.push('Aufmaß noch nicht eingegangen (Eingang fehlt).');
  if (receipt.state === 'notYet') reasons.push('Aufmaß noch nicht eingegangen (Eingang liegt nach der Betrachtungszeit).');
  const fieldErrors = {};
  // Ein noch völlig leeres Formular zeigt keine Feldfehler, nur „Aufmaß fehlt“.
  if (!isEmpty) for (const error of errors) fieldErrors[error.field] ??= error.text;

  const usable = !errors.length && receipt.state === 'received';

  // 2. Breitenbefund
  let width;
  let istText;
  if (usable) {
    const mm = value.mm;
    istText = `${formatMm(mm)} mm`;
    if (mm < requirement.minMm) {
      const distance = Math.round((requirement.minMm - mm) * 1000) / 1000;
      width = { kind: 'missed', label: `Breitenkriterium verfehlt – ${formatMm(distance)} mm unter der Untergrenze`, distanceMm: distance };
    } else if (mm > requirement.maxMm) {
      const distance = Math.round((mm - requirement.maxMm) * 1000) / 1000;
      width = { kind: 'missed', label: `Breitenkriterium verfehlt – ${formatMm(distance)} mm über der Obergrenze`, distanceMm: distance };
    } else width = { kind: 'met', label: TEXT.met, distanceMm: 0 };
    width.reasons = [];
    width.text = width.label;
  } else {
    istText = isEmpty ? 'Aufmaß fehlt' : 'Kein verwertbares Aufmaß';
    const why = isEmpty ? ['Aufmaß fehlt'] : reasons;
    width = { kind: 'open', label: TEXT.open, distanceMm: null, reasons: why, text: `${TEXT.open} – ${why.join(' ')}` };
  }

  // 3. Zeitstände. Der Grenzzeitpunkt zählt bei beiden Fristen als rechtzeitig.
  let measureStatus;
  if (usable) {
    measureStatus = receivedAt <= deadlines.measureDeadline
      ? { key: 'onTime', label: 'rechtzeitig eingegangen' }
      : { key: 'late', label: 'verspätet eingegangen' };
  } else {
    measureStatus = at <= deadlines.measureDeadline
      ? { key: 'pending', label: 'Aufmaß ausstehend' }
      : { key: 'overdue', label: 'Aufmaß überfällig' };
  }
  const replaceStatus = at <= deadlines.replaceDeadline
    ? { key: 'open', label: 'Entscheidungsfrist offen' }
    : { key: 'elapsed', label: 'Entscheidungsfrist verstrichen' };
  const warnings = deadlines.measureDeadline > deadlines.replaceDeadline ? [TEXT.conflict] : [];

  // 4. Aufgaben unabhängig ableiten, Rangfolge nach Rev. 2 §5
  const replaceOpen = replaceStatus.key === 'open';
  const badReceipt = receipt.state === 'invalid' || receipt.state === 'contradictory';
  const unclear = warnings.length > 0 || badReceipt;
  const actions = [];
  const add = (rank, text, role, why, note) => actions.push({ rank, text, role, reason: why, ...(note ? { note } : {}) });
  if (!replaceOpen) {
    add(1, 'Bestellstatus klären', 'Planung', 'Erst feststellen, ob Ersatz bereits bestellt wurde und welche Optionen noch offenstehen.');
  }
  if (unclear) {
    add(2, 'Termine klären', 'Planung', 'Fristen oder Eingang sind widersprüchlich oder ungültig. Das muss vor allen weiteren Schritten geklärt werden.');
  }
  // Freigegebene Lesart: Rang 3 verlangt nach Rev. 2 §5 nur offenen Ersatztermin und verfehlte Breite;
  // „widerspruchsfrei“ gilt nur für Rang 6. Bei Fristwiderspruch steht Rang 3 daher unter „Weiterhin offen“.
  if (replaceOpen && width.kind === 'missed') {
    add(3, 'Anpassung fachlich klären oder Ersatzweg vorbereiten', 'Planung', 'Das Breitenkriterium ist verfehlt, die Ersatzentscheidung steht noch aus.');
  }
  if (replaceOpen && (measureStatus.key === 'overdue' || measureStatus.key === 'late')) {
    add(4, 'Prüfvorlauf klären', 'Planung', 'Das Aufmaß ist überfällig oder verspätet, die Ersatzentscheidung steht noch aus.');
  }
  if (!usable) {
    add(5, 'Rohbauöffnung B-02 an der Messstelle laut P-02 messen oder ein verwertbares Aufmaß nachreichen', 'Montagebetrieb', 'Ohne verwertbares Aufmaß bleibt die Breite offen.');
  }
  if (width.kind === 'met' && measureStatus.key === 'onTime' && replaceOpen && !unclear) {
    add(6, 'Variante zur fachlichen Prüfung vorlegen', 'Planung', 'Die Breite ist belegt, das Aufmaß kam rechtzeitig und die Zeiten sind widerspruchsfrei.', TEXT.technical);
  }

  return {
    at,
    usable,
    istText,
    width,
    receipt,
    fieldErrors,
    measureStatus,
    replaceStatus,
    warnings,
    mainStep: actions[0] ?? null,
    stillOpen: actions.slice(1),
    otherChecks: OTHER_CHECKS,
  };
}
