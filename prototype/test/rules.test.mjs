import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateCase, formatDate } from '../dist/rules.mjs';
import { DEMO_CASES, emptyCase } from '../dist/scenarios.mjs';

const valid = DEMO_CASES[0];
const check = changes => evaluateCase({ ...valid, ...changes });

for (const [i, outcome] of ['review', 'late', 'clarify'].entries()) {
  test(`${DEMO_CASES[i].id}: ${outcome}`, () => {
    const result = evaluateCase(DEMO_CASES[i]);
    assert.equal(result.kind, outcome);
    assert.ok(result.reasons.length);
    assert.ok(result.next);
  });
}

test('Fristtag zählt mit, der unmittelbar folgende Tag ist zu spät', () => {
  assert.equal(check({ leadDays: '7' }).kind, 'review');
  const result = check({ leadDays: '8' });
  assert.equal(result.kind, 'late');
  assert.match(result.reasons[0], /^Prüfzeit reicht nicht/);
});

test('fehlende Übergabe verdeckt eine eindeutige Verspätung nicht', () => {
  const result = check({ receivedAt: '2027-02-15', pickupStart: '', pickupEnd: '' });
  assert.equal(result.kind, 'late');
  assert.match(result.reasons[0], /^Eingang nach der Frist/);
  assert.match(result.reasons[0], /15\.02\.2027/);
  assert.ok(result.reasons.some(reason => reason.includes('Übergabefenster')));
});

test('fehlende oder absichtlich unbekannte Prüfzeit ist keine Null', () => {
  for (const changes of [{ leadDays: '' }, { leadDays: ' ' }, { leadDays: '3', leadEvidence: 'unknown' }]) {
    assert.equal(check(changes).kind, 'clarify');
  }
  assert.equal(check({ leadDays: '0' }).kind, 'review');
});

test('ein gespeicherter unbekannter Eingangswert beeinflusst das Ergebnis nicht', () => {
  const result = check({ receivedAt: '2027-02-15', receivedEvidence: 'unknown' });
  assert.equal(result.kind, 'clarify');
  assert.ok(result.reasons.some(reason => reason.includes('Eingang')));
});

test('mehrere Klärungsgründe bleiben sichtbar', () => {
  const result = check({ offerQty: '8', needStart: '2027-03-01', needEnd: '2027-03-02', needType: 'Leuchten' });
  assert.equal(result.kind, 'clarify');
  assert.ok(result.reasons.some(reason => reason.includes('gemeinsamen Kalendertag')));
  assert.ok(result.reasons.some(reason => reason.includes('Teilmenge')));
  assert.ok(result.reasons.some(reason => reason.includes('unterschiedliche Bauteiltypen')));
});

test('ungültige oder widersprüchliche Angaben benötigen Klärung', () => {
  assert.equal(check({ knownAt: '2027-02-16', receivedAt: '2027-02-15' }).kind, 'clarify');
  assert.equal(check({ pickupStart: '2027-02-28' }).kind, 'clarify');
  assert.equal(check({ receivedAt: '2027-02-30' }).kind, 'clarify');
  assert.equal(formatDate('2027-02-30'), 'Offen');
});

test('geschätzte Entscheidungsdaten sind im Ergebnis nachvollziehbar', () => {
  const result = check({ receivedAt: '2027-02-15', receivedEvidence: 'estimated' });
  assert.equal(result.kind, 'late');
  assert.ok(result.estimates.includes('Eingang'));
});

test('ein einzelner gemeinsamer Kalendertag genügt für das Übergabefenster', () => {
  const result = check({ needStart: valid.pickupEnd, needEnd: valid.pickupEnd });
  assert.equal(result.kind, 'review');
  assert.deepEqual(result.overlap, [valid.pickupEnd, valid.pickupEnd]);
});

test('Berechnung bleibt beim Monatswechsel und bei Sommerzeit tagesgenau', () => {
  const result = check({ knownAt: '2027-03-20', receivedAt: '2027-03-27', deadline: '2027-03-30', leadDays: '3' });
  assert.equal(result.kind, 'review');
  assert.match(result.reasons[0], /3 Kalendertage/);
});

test('unvollständiger neuer Fall kann als solcher ausgewertet werden', () => {
  const result = evaluateCase(emptyCase());
  assert.equal(result.kind, 'clarify');
  assert.ok(result.reasons.length >= 5);
});
