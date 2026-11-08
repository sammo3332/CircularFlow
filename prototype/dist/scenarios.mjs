export const WORK_STATES = ['Erfasst', 'In Klärung', 'Abgeschlossen'];
export const EVIDENCE = {
  estimated: 'Geschätzt',
  documented: 'Belegt im Testfall',
  unknown: 'Unbekannt',
};

export function emptyCase() {
  return {
    id: '', title: '', workState: 'Erfasst',
    supplyProject: '', supplyLocation: '', offerType: '', offerQty: '', condition: '', dimensions: '',
    demandProject: '', demandLocation: '', needType: '', needQty: '', role: '',
    knownAt: '', knownEvidence: 'unknown', receivedAt: '', receivedEvidence: 'unknown',
    deadline: '', deadlineEvidence: 'unknown', pickupStart: '', pickupEnd: '', pickupEvidence: 'unknown',
    needStart: '', needEnd: '', leadDays: '', leadEvidence: 'unknown',
    note: '', updatedAt: '',
  };
}

const base = {
  ...emptyCase(),
  supplyProject: 'Umbau Nord', supplyLocation: 'Dortmund · Innenstadt-Nord',
  demandProject: 'Innenausbau West', demandLocation: 'Dortmund · Innenstadt-West',
  offerType: 'Systemtrennwände', needType: 'Systemtrennwände',
  offerQty: '24', needQty: '18', role: 'Bauleitung Bedarfsprojekt',
  condition: 'Demontierbare Module. Zustand und Ausbau vor Ort prüfen.',
  dimensions: 'Beispielmaß 120 × 270 cm',
  knownAt: '2027-02-01', receivedAt: '2027-02-05', deadline: '2027-02-12',
  pickupStart: '2027-02-22', pickupEnd: '2027-02-26',
  needStart: '2027-02-24', needEnd: '2027-03-02',
  leadDays: '3', knownEvidence: 'documented', receivedEvidence: 'documented',
  deadlineEvidence: 'documented', pickupEvidence: 'estimated', leadEvidence: 'estimated',
};

export const DEMO_CASES = [
  { ...base, id: 'CF-DEMO-01', title: 'Systemtrennwände · rechtzeitig' },
  { ...base, id: 'CF-DEMO-02', title: 'Systemtrennwände · verspätet', receivedAt: '2027-02-15' },
  { ...base, id: 'CF-DEMO-03', title: 'Systemtrennwände · Frist offen', deadline: '', deadlineEvidence: 'unknown', workState: 'In Klärung' },
];
