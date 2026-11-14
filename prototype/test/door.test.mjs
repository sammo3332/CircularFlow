import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  DEADLINES, REQUIREMENT, SAMPLE_MEASUREMENT, TEXT, emptyMeasurement, evaluateDoor,
} from '../dist/door-rules.mjs';
import { doorPageHtml, doorParts } from '../dist/door-view.mjs';

const P02 = REQUIREMENT.reference;
const T = {
  start: '2026-11-18T14:00', mid: '2026-11-18T15:30', d19: '2026-11-19T09:00',
  d19noon: '2026-11-19T12:00', d20: '2026-11-20T09:00',
};
const standard = (changes = {}) => ({ ...SAMPLE_MEASUREMENT, ...changes });
const run = (measurement, at, deadlines = DEADLINES) =>
  evaluateDoor({ requirement: REQUIREMENT, measurement, deadlines, at });
const none = () => emptyMeasurement();
const steps = r => [r.mainStep?.text, ...r.stillOpen.map(a => a.text)];
const MEASURE = 'Rohbauöffnung B-02 an der Messstelle laut P-02 messen oder ein verwertbares Aufmaß nachreichen';
const FACH = 'Variante zur fachlichen Prüfung vorlegen';
const conflict = { measureDeadline: '2026-11-19T13:00', replaceDeadline: '2026-11-19T12:00' };

test('01: kein Aufmaß, Start', () => {
  const r = run(none(), T.start);
  assert.equal(r.width.kind, 'open');
  assert.equal(r.istText, 'Aufmaß fehlt');
  assert.equal(r.width.text, 'Breite offen – Aufmaß fehlt');
  assert.equal(r.measureStatus.label, 'Aufmaß ausstehend');
  assert.equal(r.replaceStatus.label, 'Entscheidungsfrist offen');
  assert.equal(r.mainStep.text, MEASURE);
  assert.equal(r.mainStep.role, 'Montagebetrieb');
  assert.deepEqual(r.fieldErrors, {});
});

test('02: 890 mm rechtzeitig, Fachprüfung', () => {
  const r = run(standard(), T.mid);
  assert.equal(r.width.label, 'Breitenkriterium erfüllt');
  assert.equal(r.measureStatus.label, 'rechtzeitig eingegangen');
  assert.equal(r.mainStep.text, FACH);
  assert.equal(r.mainStep.role, 'Planung');
  assert.equal(r.mainStep.note, 'Weitere technische Anforderungen bleiben offen.');
  assert.deepEqual(r.stillOpen, []);
  assert.deepEqual(r.otherChecks, ['Höhe', 'Anschlag', 'Zustand']);
});

test('03: 870 mm verfehlt, 15 mm unter der Untergrenze', () => {
  const r = run(standard({ valueText: '870' }), T.mid);
  assert.equal(r.width.label, 'Breitenkriterium verfehlt – 15 mm unter der Untergrenze');
  assert.equal(r.mainStep.text, 'Anpassung fachlich klären oder Ersatzweg vorbereiten');
  assert.equal(r.mainStep.role, 'Planung');
});

for (const [name, reference] of [['04a', 'lichte Breite'], ['04b', 'Türblattmaß']]) {
  test(`${name}: Bezug „${reference}“ lässt die Breite offen und nennt beide Bezüge`, () => {
    const r = run(standard({ reference }), T.mid);
    assert.equal(r.width.kind, 'open');
    assert.ok(r.width.text.includes(reference));
    assert.ok(r.width.text.includes(P02));
    assert.ok(r.fieldErrors.reference.includes(reference) && r.fieldErrors.reference.includes(P02));
    assert.equal(r.usable, false);
  });
}

test('04c: vorgeschlagen, geschätzt und fehlende Quelle lassen die Breite offen', () => {
  for (const changes of [{ status: 'vorgeschlagen' }, { status: 'geschätzt' }, { source: '' }, { source: '   ' }]) {
    const r = run(standard(changes), T.mid);
    assert.equal(r.width.kind, 'open', JSON.stringify(changes));
    assert.ok(r.width.reasons.length);
  }
  assert.ok(run(standard({ status: 'vorgeschlagen' }), T.mid).width.text.includes('vorgeschlagen'));
  assert.ok(run(standard({ source: '' }), T.mid).width.text.includes('Belegquelle fehlt'));
});

test('04d: leerer, ungültiger, nicht positiver oder nicht endlicher Wert lässt die Breite offen', () => {
  for (const valueText of ['', 'abc', '0', '-890', 'Infinity', '1' + '0'.repeat(400)]) {
    const r = run(standard({ valueText }), T.mid);
    assert.equal(r.width.kind, 'open', valueText.slice(0, 12));
    assert.ok(r.fieldErrors.valueText, valueText.slice(0, 12));
  }
});

test('05: 19.11. 09:00 ohne Aufmaß, Prüfvorlauf, Messauftrag bleibt offen', () => {
  const r = run(none(), T.d19);
  assert.equal(r.measureStatus.label, 'Aufmaß überfällig');
  assert.equal(r.replaceStatus.label, 'Entscheidungsfrist offen');
  assert.deepEqual(steps(r), ['Prüfvorlauf klären', MEASURE]);
});

test('06: verspätet eingegangenes, verwertbares Aufmaß', () => {
  const r = run(standard({ measuredOn: '2026-11-19', receivedAt: '2026-11-19T09:00' }), T.d19);
  assert.equal(r.width.kind, 'met');
  assert.equal(r.measureStatus.label, 'verspätet eingegangen');
  assert.equal(r.replaceStatus.label, 'Entscheidungsfrist offen');
  assert.deepEqual(steps(r), ['Prüfvorlauf klären']);
});

test('07: rechtzeitiger Eingang bleibt rechtzeitig, Entscheidungsfrist verstrichen', () => {
  const r = run(standard(), T.d20);
  assert.equal(r.width.label, 'Breitenkriterium erfüllt');
  assert.equal(r.measureStatus.label, 'rechtzeitig eingegangen');
  assert.equal(r.replaceStatus.label, 'Entscheidungsfrist verstrichen');
  assert.equal(r.mainStep.text, 'Bestellstatus klären');
  assert.equal(r.mainStep.reason, 'Erst feststellen, ob Ersatz bereits bestellt wurde und welche Optionen noch offenstehen.');
  assert.deepEqual(r.stillOpen, []);
});

test('08: Fristwiderspruch, Termine klären vor Messauftrag, keine Fachprüfung', () => {
  const r = run(none(), T.start, conflict);
  assert.equal(r.measureStatus.label, 'Aufmaß ausstehend');
  assert.equal(r.replaceStatus.label, 'Entscheidungsfrist offen');
  assert.deepEqual(r.warnings, ['Aufmaß ist erst nach der Ersatzentscheidung fällig']);
  assert.deepEqual(steps(r), ['Termine klären', MEASURE]);
  assert.ok(!steps(r).includes(FACH));
});

test('08b: Fristwiderspruch verhindert die Fachprüfung auch bei gutem Aufmaß', () => {
  const r = run(standard(), T.mid, conflict);
  assert.equal(r.width.kind, 'met');
  assert.equal(r.mainStep.text, 'Termine klären');
  assert.ok(!steps(r).includes(FACH));
});

test('09a: 885 und 895 mm erfüllen die Breite', () => {
  for (const valueText of ['885', '895', '885,0', '895.0']) {
    assert.equal(run(standard({ valueText }), T.mid).width.label, 'Breitenkriterium erfüllt', valueText);
  }
});

test('09b: Eingang genau zur Aufmaßfrist ist rechtzeitig', () => {
  const r = run(standard({ receivedAt: '2026-11-18T16:00' }), T.d19);
  assert.equal(r.measureStatus.label, 'rechtzeitig eingegangen');
  assert.equal(r.mainStep.text, FACH);
});

test('09c: genau zur Ersatzfrist ist die Entscheidungsfrist noch offen', () => {
  const r = run(standard({ receivedAt: '2026-11-18T16:00' }), T.d19noon);
  assert.equal(r.replaceStatus.label, 'Entscheidungsfrist offen');
  assert.equal(r.mainStep.text, FACH);
});

test('10: Türblattmaß, 19.11. 09:00, Aufmaß überfällig, Messauftrag bleibt', () => {
  const r = run(standard({ reference: 'Türblattmaß' }), T.d19);
  assert.equal(r.width.kind, 'open');
  assert.equal(r.measureStatus.label, 'Aufmaß überfällig');
  assert.notEqual(r.measureStatus.label, 'rechtzeitig eingegangen');
  assert.deepEqual(steps(r), ['Prüfvorlauf klären', MEASURE]);
});

test('11: Eingang vor Messdatum ist widersprüchlich', () => {
  const r = run(standard({ measuredOn: '2026-11-19' }), T.d19);
  assert.equal(r.width.kind, 'open');
  assert.ok(r.width.text.includes('Eingang vor Messdatum – widersprüchlich'));
  assert.equal(r.receipt.state, 'contradictory');
  assert.equal(r.usable, false);
  assert.deepEqual(steps(r), ['Termine klären', 'Prüfvorlauf klären', MEASURE]);
});

test('12: Eingang nach der Betrachtungszeit gilt als noch nicht eingegangen, ohne Widerspruch', () => {
  const r = run(standard(), T.start);
  assert.equal(r.receipt.state, 'notYet');
  assert.equal(r.width.kind, 'open');
  assert.ok(r.width.text.includes('noch nicht eingegangen'));
  assert.equal(r.measureStatus.label, 'Aufmaß ausstehend');
  assert.ok(!steps(r).includes('Termine klären'));
  assert.equal(r.mainStep.text, MEASURE);
});

test('13: Fristwiderspruch nach Ablauf der Ersatzfrist', () => {
  const r = run(none(), T.d20, conflict);
  assert.equal(r.measureStatus.label, 'Aufmaß überfällig');
  assert.deepEqual(steps(r), ['Bestellstatus klären', 'Termine klären', MEASURE]);
  assert.ok(!steps(r).includes('Prüfvorlauf klären'));
  assert.equal(r.warnings.length, 1);
});

test('Z1: ungültiges Kalenderdatum im Eingang erfordert Termine klären, fehlendes Messdatum lässt Breite offen', () => {
  const bad = run(standard({ receivedAt: '2026-11-31T10:00' }), T.mid);
  assert.equal(bad.receipt.state, 'invalid');
  assert.equal(bad.mainStep.text, 'Termine klären');
  assert.equal(bad.width.kind, 'open');
  for (const receivedAt of ['2026-02-29T10:00', '2026-13-01T10:00', '2026-11-18T24:00', '2026-11-18T10:60', '2026-11-18 10:00']) {
    assert.equal(run(standard({ receivedAt }), T.mid).receipt.state, 'invalid', receivedAt);
  }
  assert.equal(run(standard({ receivedAt: '2028-02-29T10:00', measuredOn: '2028-02-29' }), '2028-03-01T00:00').receipt.state, 'received');
  const noDate = run(standard({ measuredOn: '' }), T.mid);
  assert.equal(noDate.width.kind, 'open');
  assert.ok(noDate.width.text.includes('Messdatum fehlt oder ist ungültig'));
  assert.equal(run(standard({ measuredOn: '2026-02-30' }), T.mid).width.kind, 'open');
});

test('Z2: Ergebnis hängt nicht von der Gerätezeitzone ab; Regel nutzt kein Date', () => {
  const source = readFileSync(new URL('../dist/door-rules.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /\bDate\b|Date\.now|performance\.now|process\.env|localStorage|document\./);
  const before = JSON.stringify(run(standard(), T.d20));
  const tz = process.env.TZ;
  for (const zone of ['Asia/Tokyo', 'America/Los_Angeles', 'Europe/Berlin']) {
    process.env.TZ = zone;
    assert.equal(JSON.stringify(run(standard(), T.d20)), before, zone);
  }
  if (tz === undefined) delete process.env.TZ; else process.env.TZ = tz;
});

test('Z7: 884,9 und 895,1 mm verfehlen die Breite um 0,1 mm', () => {
  assert.equal(run(standard({ valueText: '884,9' }), T.mid).width.label, 'Breitenkriterium verfehlt – 0,1 mm unter der Untergrenze');
  assert.equal(run(standard({ valueText: '895.1' }), T.mid).width.label, 'Breitenkriterium verfehlt – 0,1 mm über der Obergrenze');
});

test('Z8: genau zur Aufmaßfrist ist das fehlende Aufmaß noch ausstehend', () => {
  assert.equal(run(none(), '2026-11-18T16:00').measureStatus.label, 'Aufmaß ausstehend');
  assert.equal(run(none(), '2026-11-18T16:01').measureStatus.label, 'Aufmaß überfällig');
});

test('Z9: Eingang 16:01 ist verspätet, Prüfvorlauf klären', () => {
  const r = run(standard({ receivedAt: '2026-11-18T16:01' }), T.d19);
  assert.equal(r.measureStatus.label, 'verspätet eingegangen');
  assert.equal(r.mainStep.text, 'Prüfvorlauf klären');
});

test('Z10: 12:01 am 19.11. ist die Entscheidungsfrist verstrichen', () => {
  const r = run(standard(), '2026-11-19T12:01');
  assert.equal(r.replaceStatus.label, 'Entscheidungsfrist verstrichen');
  assert.equal(r.mainStep.text, 'Bestellstatus klären');
});

test('Z11: Einheitenzusatz und falsche Einheit lassen die Breite offen', () => {
  for (const valueText of ['890 cm', '890 mm', '890mm']) {
    const r = run(standard({ valueText }), T.mid);
    assert.equal(r.width.kind, 'open', valueText);
    assert.equal(r.fieldErrors.valueText, 'Bitte nur die Zahl in mm eingeben.');
  }
  const cm = run(standard({ unit: 'cm' }), T.mid);
  assert.equal(cm.width.kind, 'open');
  assert.ok(cm.fieldErrors.valueText.includes('mm'));
});

test('Z12: kein Eignungs-, Freigabe-, Norm- oder Siegeltext in Regel und Ansicht', () => {
  const forbidden = /geeignet|freigegeben|\bnorm|siegel/i;
  const texts = [JSON.stringify(TEXT), REQUIREMENT.origin, REQUIREMENT.measuringPoint];
  const measurements = [none(), standard(), standard({ valueText: '870' }), standard({ valueText: '900' }),
    standard({ reference: 'Türblattmaß' }), standard({ measuredOn: '2026-11-19' }), standard({ status: 'geschätzt' })];
  for (const measurement of measurements) {
    for (const at of [T.start, T.mid, T.d19, T.d20]) {
      texts.push(JSON.stringify(run(measurement, at)), JSON.stringify(run(measurement, at, conflict)));
      const parts = doorParts({ at, measurement });
      texts.push(parts.decision, parts.deadlines, parts.compare);
      assert.ok(parts.compare.includes(TEXT.widthNote));
    }
  }
  texts.push(doorPageHtml({ at: T.start, measurement: none() }));
  for (const text of texts) assert.doesNotMatch(text, forbidden);
});

test('Ansicht: Belegquelle wird als Text ausgegeben, nicht als HTML', () => {
  const source = '<img src=x onerror=alert(1)>';
  const html = [doorParts({ at: T.mid, measurement: standard({ source }) }).compare,
    doorPageHtml({ at: T.mid, measurement: standard({ source }) })].join('');
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
});

test('Regel: ungültige Betrachtungszeit oder Fristen werden abgelehnt', () => {
  assert.throws(() => run(none(), '2026-11-31T10:00'), TypeError);
  assert.throws(() => run(none(), T.mid, { ...DEADLINES, measureDeadline: 'morgen' }), TypeError);
});
