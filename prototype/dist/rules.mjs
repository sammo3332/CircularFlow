export const OUTCOMES = {
  review: { label: 'Weiter prüfen', short: 'Weiter prüfen', icon: 'check' },
  late: { label: 'Für diese Entscheidung zu spät', short: 'Zu spät', icon: 'clock' },
  clarify: { label: 'Klärung nötig', short: 'Klärung nötig', icon: 'question' },
};

const DAY_MS = 86_400_000;

function calendarDay(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) return null;
  return timestamp / DAY_MS;
}

export function formatDate(value) {
  if (calendarDay(value) === null) return 'Offen';
  const [year, month, day] = value.split('-');
  return `${day}.${month}.${year}`;
}

function dateFact(value, evidence = 'documented') {
  if (!value || evidence === 'unknown') return { day: null, invalid: false };
  const day = calendarDay(value);
  return { day, invalid: day === null };
}

function wholeNumber(value, min, max) {
  if (typeof value !== 'number' && (typeof value !== 'string' || !/^\d+$/.test(value.trim()))) return null;
  const number = Number(value);
  return Number.isInteger(number) && number >= min && number <= max ? number : null;
}

function normalized(value) {
  return String(value ?? '').trim().normalize('NFC').toLocaleLowerCase('de-DE');
}

export function evaluateCase(item) {
  const known = dateFact(item.knownAt, item.knownEvidence);
  const received = dateFact(item.receivedAt, item.receivedEvidence);
  const deadline = dateFact(item.deadline, item.deadlineEvidence);
  const pickupStart = dateFact(item.pickupStart, item.pickupEvidence);
  const pickupEnd = dateFact(item.pickupEnd, item.pickupEvidence);
  const needStart = dateFact(item.needStart);
  const needEnd = dateFact(item.needEnd);
  const lead = item.leadEvidence === 'unknown' ? null : wholeNumber(item.leadDays, 0, 365);
  const offerQty = wholeNumber(item.offerQty, 1, 1_000_000);
  const needQty = wholeNumber(item.needQty, 1, 1_000_000);

  const estimates = [
    [received.day !== null, item.receivedEvidence, 'Eingang'],
    [deadline.day !== null, item.deadlineEvidence, 'Entscheidungsfrist'],
    [lead !== null, item.leadEvidence, 'Mindestprüfzeit'],
    [pickupStart.day !== null || pickupEnd.day !== null, item.pickupEvidence, 'Übergabefenster'],
  ].filter(([usable, evidence]) => usable && evidence === 'estimated').map(([, , label]) => label);

  const result = (kind, reasons, next, overlap = null) => ({ kind, reasons, next, estimates, overlap });
  const reasons = [];
  const invalid = [
    [known, 'Kenntnis auf der Angebotsseite'], [received, 'Eingang'],
    [deadline, 'Entscheidungsfrist'], [pickupStart, 'Beginn der Übergabe'],
    [pickupEnd, 'Ende der Übergabe'], [needStart, 'Beginn der Annahme'],
    [needEnd, 'Ende der Annahme'],
  ];
  for (const [fact, label] of invalid) {
    if (fact.invalid) reasons.push(`${label} enthält ein ungültiges Datum.`);
  }
  if (known.day !== null && received.day !== null && known.day > received.day) {
    reasons.push('Das Angebot wurde laut Eingabe erst nach der Information der Bedarfsseite bekannt.');
  }
  if (pickupStart.day !== null && pickupEnd.day !== null && pickupStart.day > pickupEnd.day) {
    reasons.push('Der Beginn der Übergabe liegt nach ihrem Ende.');
  }
  if (needStart.day !== null && needEnd.day !== null && needStart.day > needEnd.day) {
    reasons.push('Der Beginn der Annahme liegt nach ihrem Ende.');
  }
  const hasContradiction = reasons.length > 0;

  const timingKnown = received.day !== null && deadline.day !== null;
  const clearlyLate = timingKnown && received.day > deadline.day;
  const insufficientTime = timingKnown && lead !== null && received.day + lead > deadline.day;

  if (!received.invalid && received.day === null) reasons.push('Der Eingang bei der zuständigen Person fehlt oder ist als unbekannt markiert.');
  if (!deadline.invalid && deadline.day === null) reasons.push('Die Entscheidungsfrist fehlt oder ist als unbekannt markiert.');
  if (lead === null) reasons.push('Die Mindestprüfzeit in Kalendertagen ist offen oder ungültig.');
  if (!pickupStart.invalid && !pickupEnd.invalid && (pickupStart.day === null || pickupEnd.day === null)) {
    reasons.push('Das mögliche Übergabefenster ist unvollständig.');
  }
  if (!needStart.invalid && !needEnd.invalid && (needStart.day === null || needEnd.day === null)) {
    reasons.push('Das Annahmefenster des Bedarfsprojekts ist unvollständig.');
  }

  let overlap = null;
  if ([pickupStart, pickupEnd, needStart, needEnd].every(({ day }) => day !== null)
      && pickupStart.day <= pickupEnd.day && needStart.day <= needEnd.day) {
    const start = Math.max(pickupStart.day, needStart.day);
    const end = Math.min(pickupEnd.day, needEnd.day);
    if (start > end) {
      reasons.push('Übergabe und Annahme haben keinen gemeinsamen Kalendertag.');
    } else {
      overlap = [start, end].map(day => new Date(day * DAY_MS).toISOString().slice(0, 10));
    }
  }

  const offered = normalized(item.offerType);
  const needed = normalized(item.needType);
  if (!offered || !needed) reasons.push('Der Bauteiltyp fehlt auf mindestens einer Seite.');
  else if (offered !== needed) reasons.push('Angebot und Bedarf nennen unterschiedliche Bauteiltypen.');
  if (offerQty === null || needQty === null) reasons.push('Mindestens eine Stückzahl fehlt oder ist ungültig.');
  else if (offerQty < needQty) reasons.push(`Es sind ${offerQty} von ${needQty} benötigten Stück verfügbar. Eine Teilmenge muss abgestimmt werden.`);

  if (!hasContradiction && (clearlyLate || insufficientTime)) {
    const main = clearlyLate
      ? `Eingang nach der Frist. Das Angebot erreichte die zuständige Person am ${formatDate(item.receivedAt)}. Die Entscheidung war bis ${formatDate(item.deadline)} fällig.`
      : `Prüfzeit reicht nicht. Zwischen Eingang und Frist liegen ${deadline.day - received.day} Kalendertage. Eingetragen sind ${lead} Tage Mindestprüfzeit.`;
    return result('late', [main, ...reasons], 'Die zuständige Person klärt, ob die Entscheidung noch offen ist oder ein späterer Bedarf passt.', overlap);
  }

  if (reasons.length) {
    return result('clarify', reasons, 'Offene Angaben mit den beteiligten Rollen klären und den Fall erneut prüfen.', overlap);
  }

  const dates = overlap[0] === overlap[1]
    ? `am ${formatDate(overlap[0])}`
    : `vom ${formatDate(overlap[0])} bis ${formatDate(overlap[1])}`;
  return result('review', [
    `Es bleiben ${deadline.day - received.day} Kalendertage bis zur Frist. Die eingetragene Mindestprüfzeit beträgt ${lead} Tage.`,
    `Übergabe und Annahme überschneiden sich ${dates}. Bauteiltyp und Stückzahl passen zu den Eingaben.`,
  ], 'Zustand, Maße und notwendige Nachweise mit einer qualifizierten Fachperson prüfen lassen.', overlap);
}
