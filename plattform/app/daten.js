// Gemeinsamer Datensatz der Plattform. Projekte, Gebäude, Räume, Personen und Bauteile sind BEISPIELDATEN.
// Echt sind nur die Dortmunder Bezirksgrenzen (daten/dortmund-stadtbezirke.geojson).

export const REGIONEN = [
  {
    id: 'dortmund', name: 'Dortmund', aktiv: true, mitte: [51.5136, 7.4653], zoom: 11,
    grenzen: 'daten/dortmund-stadtbezirke.geojson',
    grenzenQuelle: 'Bezirksgrenzen: Stadt Dortmund, Open Data, dl-de/zero-2-0',
  },
  { id: 'bochum', name: 'Bochum', aktiv: false },
  { id: 'essen', name: 'Essen', aktiv: false },
];

// Projektzeit der Simulation (Europe/Berlin). Dieselben Zeitpunkte wie CF-UMBAU-01 Rev. 2.
export const PROJEKTZEITEN = [
  { at: '2026-11-18T14:00', label: 'Mi 18.11., 14:00' },
  { at: '2026-11-18T15:30', label: 'Mi 18.11., 15:30' },
  { at: '2026-11-19T09:00', label: 'Do 19.11., 09:00' },
  { at: '2026-11-20T09:00', label: 'Fr 20.11., 09:00' },
];

export const PERSONEN = {
  planung: { rolle: 'Planung', name: 'J. Neumann', stelle: 'Architekturbüro (fiktiv)' },
  bauleitung: { rolle: 'Bauleitung', name: 'S. Weber', stelle: 'Bauherrenvertretung (fiktiv)' },
  montage: { rolle: 'Montagebetrieb', name: 'K. Arslan', stelle: 'Tischlerei und Innenausbau (fiktiv)' },
  fach: { rolle: 'Fachprüfung', name: 'L. Brandt', stelle: 'Sachverständige Bauteile (fiktiv)' },
  radar: { rolle: 'Projektradar', name: 'M. Yilmaz', stelle: 'CircularFlow-Team (fiktiv)' },
  // Eigene Eingaben in diesem Browser werden niemandem aus den Beispieldaten zugeschrieben.
  browser: { rolle: 'Eigene Eingabe', name: 'Sie', stelle: 'in diesem Browser' },
};

export const ARTEN = { umbau: 'Umbau', sanierung: 'Sanierung', rueckbau: 'Rückbau', neubau: 'Neubau' };

export const STATUS = {
  erfasst: { label: 'Erfasst', ton: 'neutral' },
  bewertung: { label: 'In Bewertung', ton: 'info' },
  entscheidung: { label: 'Entscheidung offen', ton: 'warn' },
  fachpruefung: { label: 'Fachprüfung angefragt', ton: 'info' },
  vorgemerkt: { label: 'Zur Wiederverwendung vorgemerkt', ton: 'ok' },
  nicht: { label: 'Nicht wiederverwendbar', ton: 'crit' },
};

// Status je Angabe. Regeln werten Maße nur als „gemessen“.
export const WERTSTATUS = {
  vorgeschlagen: { label: 'vorgeschlagen', ton: 'sim', text: 'Schätzung oder simulierte Erkennung, nicht geprüft' },
  gemessen: { label: 'gemessen', ton: 'ok', text: 'vor Ort gemessen' },
  bestaetigt: { label: 'bestätigt', ton: 'info', text: 'aus Unterlage übernommen oder von einer Person geprüft, nicht gemessen' },
  fehlt: { label: 'fehlt', ton: 'crit', text: 'keine Angabe' },
};

export const ZUSTAND = { A: 'kaum Gebrauchsspuren', B: 'Gebrauchsspuren', C: 'Mängel, Instandsetzung nötig', D: 'beschädigt' };

// Bauteilgruppen mit Feldern für Erfassung und Pass.
export const GRUPPEN = {
  tuer: {
    name: 'Innentüren', einzahl: 'Innentür', prefix: 'T', typ: 'Einzelbauteil', einheit: 'Stk', erfassbar: true, zuordnung: 'zieloeffnung',
    felder: [
      { key: 'breite', label: 'Türblattbreite', art: 'mass', einheit: 'mm', bezug: 'Türblattmaß', hinweis: 'Zählt nicht als Aufmaß der Zielöffnung.' },
      { key: 'hoehe', label: 'Türblatthöhe', art: 'mass', einheit: 'mm', bezug: 'Türblattmaß' },
      { key: 'anschlag', label: 'Anschlag', art: 'wahl', optionen: ['DIN links', 'DIN rechts'] },
      { key: 'material', label: 'Türblatt', art: 'wahl', optionen: ['Holzwerkstoff', 'Vollholz', 'Stahl', 'Glas'] },
      { key: 'zarge', label: 'Zarge', art: 'wahl', optionen: ['Stahlumfassungszarge', 'Holzzarge', 'Blockzarge', 'Aluminiumzarge'] },
      { key: 'schutz', label: 'Schutzkennzeichnung', art: 'wahl', optionen: ['keine Kennzeichnung gefunden', 'Kennzeichnung vorhanden (z. B. T30)'] },
    ],
    vorschlag: { breite: 860, hoehe: 1985, material: 'Holzwerkstoff', zarge: 'Stahlumfassungszarge' },
  },
  boden: {
    name: 'Doppelboden', einzahl: 'Doppelboden', prefix: 'DB', typ: 'Sammelposition', einheit: 'm²', erfassbar: true, zuordnung: 'bedarf',
    felder: [
      { key: 'raster', label: 'Rastermaß', art: 'wahl', optionen: ['600 × 600 mm', '500 × 500 mm'] },
      { key: 'aufbauhoehe', label: 'Aufbauhöhe', art: 'mass', einheit: 'mm', bezug: 'Rohdecke bis Oberkante Belag' },
      { key: 'material', label: 'Plattenmaterial', art: 'wahl', optionen: ['Calciumsulfat', 'Holzwerkstoff', 'Stahl'] },
      { key: 'belag', label: 'Belag', art: 'wahl', optionen: ['Nadelvlies', 'Teppich', 'Linoleum', 'ohne Belag'] },
      { key: 'beschaedigt', label: 'Beschädigte Fläche', art: 'mass', einheit: 'm²', bezug: 'Stichprobe, hochgerechnet' },
    ],
    vorschlag: { raster: '600 × 600 mm', material: 'Calciumsulfat', belag: 'Nadelvlies' },
  },
  heiz: { name: 'Heizkörper', einzahl: 'Heizkörper', prefix: 'HK', typ: 'Sammelposition', einheit: 'Stk', erfassbar: false, felder: [{ key: 'laenge', label: 'Baulänge', art: 'mass', einheit: 'mm', bezug: 'Heizkörper' }] },
  wand: { name: 'Systemtrennwände', einzahl: 'Systemtrennwand', prefix: 'TW', typ: 'Sammelposition', einheit: 'lfm', erfassbar: false, felder: [{ key: 'hoehe', label: 'Elementhöhe', art: 'mass', einheit: 'mm', bezug: 'Element' }] },
  licht: { name: 'Leuchten', einzahl: 'Leuchte', prefix: 'LE', typ: 'Sammelposition', einheit: 'Stk', erfassbar: false, felder: [{ key: 'raster', label: 'Rastermaß', art: 'wahl', optionen: ['625 × 625 mm', '600 × 600 mm'] }] },
  sonstig: {
    name: 'Sonstige Bauteile', einzahl: 'Bauteil', prefix: 'X', typ: 'Einzelbauteil', einheit: 'Stk', erfassbar: true,
    felder: [
      { key: 'bezeichnung', label: 'Bezeichnung', art: 'text' },
      { key: 'material', label: 'Material', art: 'text' },
    ],
    vorschlag: {},
  },
};

const w = (wert, status, quelle, extra = {}) => ({ wert, status, quelle, ...extra });

// Grundrisse: Koordinaten in einem Raster von 100 × 60 je Etage (schematisch).
const r = (id, name, x, y, b, h, flaeche) => ({ id, name, plan: [x, y, b, h], flaeche });

export const PROJEKTE = [
  {
    id: 'P-2026-014', kurz: 'LH', farbe: '#0e6b58', name: 'Umbau Haus Lindenhof', zusatz: 'Verwaltungsgebäude, Umbau im Bestand',
    art: 'umbau', phase: 'LP 5 · Ausführungsplanung', lp: 5, status: 'aktuell', bezirk: 'Innenstadt-Ost', lage: [51.5098, 7.4991],
    herkunft: 'beispiel', rueckbauAb: '2026-11-25', entscheidungBis: '2026-11-24T12:00',
    gebaeude: [{
      id: 'A', name: 'Haus A', etagen: [
        { id: 'EG', name: 'Erdgeschoss', raeume: [r('E.01', 'Foyer', 0, 0, 40, 25, 96), r('E.02', 'Empfang', 40, 0, 25, 25, 58), r('E.05', 'Lager', 65, 0, 35, 25, 84), r('E.03', 'Flur', 0, 25, 100, 10, 60), r('E.07', 'Werkstatt', 0, 35, 50, 25, 120), r('E.08', 'Technik', 50, 35, 50, 25, 118)] },
        { id: '1.OG', name: '1. Obergeschoss', raeume: [r('1.02', 'Büro', 0, 0, 20, 25, 46), r('1.04', 'Büro', 20, 0, 20, 25, 46), r('1.06', 'Büro', 40, 0, 20, 25, 46), r('1.08', 'Büro', 60, 0, 20, 25, 46), r('1.10', 'Büro', 80, 0, 20, 25, 46), r('1.01', 'Flur', 0, 25, 100, 10, 62), r('1.12', 'Büro', 0, 35, 30, 25, 70), r('1.14', 'Raum A · Besprechung', 30, 35, 40, 25, 94), r('1.16', 'Teeküche', 70, 35, 30, 25, 68)] },
        { id: '2.OG', name: '2. Obergeschoss', raeume: [r('2.01', 'Empfang', 0, 0, 25, 25, 58), r('2.03', 'Besprechung neu', 25, 0, 30, 25, 70), r('2.05', 'Büro neu', 55, 0, 20, 25, 46), r('2.07', 'Archiv', 75, 0, 25, 25, 58), r('2.02', 'Flur', 0, 25, 100, 10, 62), r('2.10', 'Büro', 0, 35, 20, 25, 21), r('2.11', 'Büro', 20, 35, 20, 25, 21), r('2.12', 'Büro', 40, 35, 20, 25, 21), r('2.13', 'Büro', 60, 35, 20, 25, 21), r('2.14', 'Büro', 80, 35, 20, 25, 20)] },
        { id: '3.OG', name: '3. Obergeschoss', raeume: [r('3.01', 'Flur', 0, 25, 100, 10, 62), r('3.04', 'Technikzone', 0, 0, 30, 25, 24), r('3.05', 'Technikzone', 30, 0, 30, 25, 24), r('3.06', 'Technikzone', 60, 0, 20, 25, 24), r('3.08', 'Büro neu', 80, 0, 20, 25, 46), r('3.10', 'Besprechung', 0, 35, 60, 25, 140), r('3.12', 'Lager', 60, 35, 40, 25, 92)] },
      ],
    }],
  },
  {
    id: 'P-2026-019', kurz: 'KB', farbe: '#9a4d0f', name: 'Rückbau Bürohaus Kanalblick', zusatz: 'Bürogebäude, selektiver Rückbau',
    art: 'rueckbau', phase: 'Rückbauplanung', lp: 6, status: 'aktuell', bezirk: 'Huckarde', lage: [51.5262, 7.4128],
    herkunft: 'beispiel', hinweis: 'B-03', rueckbauAb: '2027-02-01', entscheidungBis: '2027-01-15T12:00',
    gebaeude: [{
      id: 'A', name: 'Bürohaus', etagen: [
        { id: 'EG', name: 'Erdgeschoss', raeume: [r('E.01', 'Halle', 0, 0, 60, 35, 210), r('E.04', 'Kantine', 60, 0, 40, 35, 140), r('E.02', 'Flur', 0, 35, 100, 25, 150)] },
        { id: '1.OG', name: '1. Obergeschoss', raeume: [r('1.01', 'Großraumbüro', 0, 0, 70, 60, 420), r('1.05', 'Besprechung', 70, 0, 30, 60, 180)] },
        { id: '2.OG', name: '2. Obergeschoss', raeume: [r('2.01', 'Großraumbüro', 0, 0, 100, 60, 600)] },
      ],
    }],
  },
  {
    id: 'P-2026-023', kurz: 'SL', farbe: '#5b3fa0', name: 'Sanierung Schule Am Lindenbach', zusatz: 'Schulgebäude, energetische Sanierung',
    art: 'sanierung', phase: 'LP 3 · Entwurfsplanung', lp: 3, status: 'neu', bezirk: 'Aplerbeck', lage: [51.4905, 7.5612],
    herkunft: 'beispiel', rueckbauAb: '2027-07-05', entscheidungBis: '2027-05-31T12:00',
    gebaeude: [{
      id: 'A', name: 'Hauptgebäude', etagen: [
        { id: 'EG', name: 'Erdgeschoss', raeume: [r('E.11', 'Klasse 1a', 0, 0, 33, 30, 62), r('E.12', 'Klasse 1b', 33, 0, 34, 30, 62), r('E.13', 'Klasse 2a', 67, 0, 33, 30, 62), r('E.10', 'Flur', 0, 30, 100, 30, 120)] },
        { id: '1.OG', name: '1. Obergeschoss', raeume: [r('1.11', 'Klasse 3a', 0, 0, 50, 30, 64), r('1.12', 'Klasse 3b', 50, 0, 50, 30, 64), r('1.10', 'Flur', 0, 30, 100, 30, 120)] },
      ],
    }],
  },
  {
    id: 'P-2026-030', kurz: 'SB', farbe: '#a1324a', name: 'Neubau Quartier Seeblick', zusatz: 'Wohn- und Bürobau, Bedarf an Bauteilen',
    art: 'neubau', phase: 'LP 2 · Vorplanung', lp: 2, status: 'neu', bezirk: 'Hörde', lage: [51.4882, 7.5098],
    herkunft: 'beispiel', rueckbauAb: null, entscheidungBis: '2027-03-31T12:00',
    gebaeude: [{
      id: 'A', name: 'Haus 1 (geplant)', etagen: [
        { id: 'EG', name: 'Erdgeschoss', raeume: [r('E.01', 'Gewerbe', 0, 0, 100, 60, 380)] },
        { id: '1.OG', name: '1. Obergeschoss', raeume: [r('1.01', 'Büroeinheit', 0, 0, 60, 60, 240), r('1.02', 'Büroeinheit', 60, 0, 40, 60, 160)] },
      ],
    }],
  },
];

// Zielöffnungen (für Türen). B-02 ist der geprüfte Fall aus CF-UMBAU-01 Rev. 2.
export const ZIELOEFFNUNGEN = [
  { projekt: 'LH', id: 'B-02', raum: '2.03', etage: '2.OG', plan: [40, 25], sheet: 'P-02', minMm: 885, maxMm: 895, measureDeadline: '2026-11-18T16:00', replaceDeadline: '2026-11-19T12:00', messstelle: 'horizontal zwischen den seitlichen Rohbaukanten von B-02, 1,00 m über Oberkante Rohfußboden', herkunft: 'fiktives Planungsblatt P-02 · Simulationsannahme', geprueft: true },
  { projekt: 'LH', id: 'B-04', raum: '2.05', etage: '2.OG', plan: [65, 25], sheet: 'P-04', minMm: 880, maxMm: 890, measureDeadline: '2026-11-19T16:00', replaceDeadline: '2026-11-20T12:00', messstelle: 'horizontal zwischen den seitlichen Rohbaukanten von B-04, 1,00 m über Oberkante Rohfußboden', herkunft: 'fiktives Planungsblatt P-04 · Simulationsannahme' },
  { projekt: 'LH', id: 'B-07', raum: '3.08', etage: '3.OG', plan: [90, 25], sheet: 'P-07', minMm: 875, maxMm: 885, measureDeadline: '2026-11-20T16:00', replaceDeadline: '2026-11-23T12:00', messstelle: 'horizontal zwischen den seitlichen Rohbaukanten von B-07, 1,00 m über Oberkante Rohfußboden', herkunft: 'fiktives Planungsblatt P-07 · Simulationsannahme' },
];

// Bedarfe (für Sammelpositionen).
export const BEDARFE = [
  { projekt: 'LH', id: 'BD-01', gruppe: 'boden', titel: 'Doppelboden Technikzone 3.OG', raeume: ['3.04', '3.05', '3.06'], etage: '3.OG', bedarfM2: 72, reserveProzent: 10, raster: '600 × 600 mm', aufbauhoeheMm: 150, punktlastKn: 3, fristen: { nachweis: '2026-11-19T10:00', ersatz: '2026-11-20T12:00' }, nachweisWerte: { verstellVonMm: 110, verstellBisMm: 180, quelle: 'Herstellerangabe (fiktiv)' }, herkunft: 'fiktives Raumbuch 3.OG · Simulationsannahme' },
  { projekt: 'LH', id: 'BD-02', gruppe: 'boden', titel: 'Doppelboden Archiv 2.07', raeume: ['2.07'], etage: '2.OG', bedarfM2: 52, reserveProzent: 10, raster: '600 × 600 mm', aufbauhoeheMm: 120, punktlastKn: 4, fristen: { nachweis: '2026-11-23T10:00', ersatz: '2026-11-26T12:00' }, nachweisWerte: { verstellVonMm: 110, verstellBisMm: 180, quelle: 'Herstellerangabe (fiktiv)' }, herkunft: 'fiktives Raumbuch 2.OG · Simulationsannahme' },
  { projekt: 'SB', id: 'BD-21', gruppe: 'tuer', titel: 'Innentüren Büroeinheiten', raeume: ['1.01', '1.02'], etage: '1.OG', menge: 12, einheit: 'Stk', text: 'Türblatt etwa 860 × 1985 mm, ohne Schutzanforderung', herkunft: 'fiktive Vorplanung' },
  { projekt: 'SB', id: 'BD-22', gruppe: 'wand', titel: 'Systemtrennwände Gewerbe', raeume: ['E.01'], etage: 'EG', menge: 60, einheit: 'lfm', text: 'Raumhöhe etwa 2,75 m', herkunft: 'fiktive Vorplanung' },
];

const begehung = 'Begehung 12.11.2026';
const plan = 'Bestandsplan (fiktiv)';

export const BAUTEILE = [
  {
    projekt: 'LH', id: 'T-07', gruppe: 'tuer', name: 'Innentür samt Zarge', menge: 1, etage: '1.OG', raum: '1.14', plan: [50, 35],
    werte: { breite: w(860, 'gemessen', begehung), hoehe: w(1985, 'gemessen', begehung), anschlag: w(null, 'fehlt', ''), material: w('Holzwerkstoff', 'bestaetigt', 'Sichtprüfung'), zarge: w('Stahlumfassungszarge', 'bestaetigt', 'Sichtprüfung'), schutz: w('keine Kennzeichnung gefunden', 'bestaetigt', 'Sichtprüfung Bandseite') },
    zustand: 'B', zustandText: 'Gebrauchsspuren am Türblatt, Zarge ohne sichtbare Verformung', hersteller: 'unbekannt', baujahr: 'ca. 2004 (geschätzt)',
    status: 'entscheidung', verfuegbarAb: '2026-11-25', erfassung: { art: 'Begehung', am: '2026-11-12T10:20', von: 'bauleitung' },
    rueckbau: [['Verbindung', 'Zarge verschraubt (Annahme, nicht geöffnet)'], ['Zugänglichkeit', 'beidseitig zugänglich'], ['Schadstoffverdacht', 'nicht bekannt, nicht untersucht']],
    nachweise: [{ titel: 'Fotodokumentation Begehung', art: 'Foto', datum: '2026-11-12T10:20', von: 'bauleitung', stand: 'liegt vor', ton: 'ok' }, { titel: 'Bestandsplan 1.OG', art: 'Plan', datum: '2019-03-01T00:00', von: 'planung', stand: 'liegt vor, nicht geprüft', ton: 'neutral' }],
    offen: [{ text: 'Höhe, Anschlag und Zustand fachlich prüfen', rolle: 'fach' }],
    verlauf: [{ at: '2026-11-12T10:20', von: 'bauleitung', text: 'Bei der Begehung erfasst, 3 Fotos.' }, { at: '2026-11-14T09:00', von: 'planung', text: 'Entscheidung E-01 angelegt: Wiederverwendung in Öffnung B-02 prüfen.' }],
  },
  {
    projekt: 'LH', id: 'T-03', gruppe: 'tuer', name: 'Innentür mit Holzzarge', menge: 1, etage: '1.OG', raum: '1.08', plan: [70, 25],
    werte: { breite: w(735, 'vorgeschlagen', 'Schätzung bei der Begehung'), hoehe: w(null, 'fehlt', ''), anschlag: w('DIN rechts', 'bestaetigt', 'Sichtprüfung'), material: w('Vollholz', 'bestaetigt', 'Sichtprüfung'), zarge: w('Holzzarge', 'bestaetigt', 'Sichtprüfung'), schutz: w(null, 'fehlt', '') },
    zustand: 'C', zustandText: 'Zarge an der Bandseite eingerissen', hersteller: 'unbekannt', baujahr: 'unbekannt',
    status: 'erfasst', verfuegbarAb: '2026-11-25', erfassung: { art: 'Begehung', am: '2026-11-12T10:45', von: 'bauleitung' },
    rueckbau: [['Verbindung', 'unbekannt'], ['Schadstoffverdacht', 'nicht bekannt, nicht untersucht']],
    nachweise: [{ titel: 'Fotodokumentation Begehung', art: 'Foto', datum: '2026-11-12T10:45', von: 'bauleitung', stand: 'liegt vor', ton: 'ok' }],
    offen: [{ text: 'Zustand der Zarge bewerten', rolle: 'fach' }],
    verlauf: [{ at: '2026-11-12T10:45', von: 'bauleitung', text: 'Bei der Begehung erfasst, 2 Fotos.' }],
  },
  {
    projekt: 'LH', id: 'T-05', gruppe: 'tuer', name: 'Innentür samt Zarge', menge: 1, etage: '1.OG', raum: '1.10', plan: [90, 25],
    werte: { breite: w(860, 'gemessen', begehung), hoehe: w(1985, 'gemessen', begehung), anschlag: w('DIN links', 'bestaetigt', 'Sichtprüfung'), material: w('Holzwerkstoff', 'bestaetigt', 'Sichtprüfung'), zarge: w('Stahlumfassungszarge', 'bestaetigt', 'Sichtprüfung'), schutz: w('keine Kennzeichnung gefunden', 'bestaetigt', 'Sichtprüfung Bandseite') },
    zustand: 'B', zustandText: 'leichte Gebrauchsspuren', hersteller: 'unbekannt', baujahr: 'ca. 2004 (geschätzt)',
    status: 'bewertung', verfuegbarAb: '2026-11-25', erfassung: { art: 'Begehung', am: '2026-11-12T10:55', von: 'bauleitung' },
    rueckbau: [['Verbindung', 'Zarge verschraubt (Annahme)'], ['Schadstoffverdacht', 'nicht bekannt, nicht untersucht']],
    nachweise: [{ titel: 'Fotodokumentation Begehung', art: 'Foto', datum: '2026-11-12T10:55', von: 'bauleitung', stand: 'liegt vor', ton: 'ok' }],
    offen: [],
    verlauf: [{ at: '2026-11-12T10:55', von: 'bauleitung', text: 'Bei der Begehung erfasst, 3 Fotos.' }],
  },
  {
    projekt: 'LH', id: 'T-11', gruppe: 'tuer', name: 'Ganzglastür mit Aluminiumzarge', menge: 1, etage: '2.OG', raum: '2.01', plan: [12, 25],
    werte: { breite: w(900, 'bestaetigt', plan), hoehe: w(2100, 'bestaetigt', plan), anschlag: w('DIN links', 'bestaetigt', 'Sichtprüfung'), material: w('Glas', 'bestaetigt', 'Sichtprüfung'), zarge: w('Aluminiumzarge', 'bestaetigt', 'Sichtprüfung'), schutz: w('keine Kennzeichnung gefunden', 'bestaetigt', 'Sichtprüfung') },
    zustand: 'D', zustandText: 'Glas mit Kantenabplatzung, Zarge verzogen', hersteller: 'unbekannt', baujahr: 'unbekannt',
    status: 'nicht', grund: 'Glas beschädigt, Zarge verzogen. Verwertung über Entsorgungsweg.', verfuegbarAb: null, erfassung: { art: 'Begehung', am: '2026-11-12T11:20', von: 'bauleitung' },
    rueckbau: [['Verbindung', 'Zarge gedübelt'], ['Schadstoffverdacht', 'nicht bekannt, nicht untersucht']],
    nachweise: [{ titel: 'Fotodokumentation Schaden', art: 'Foto', datum: '2026-11-12T11:20', von: 'bauleitung', stand: 'liegt vor', ton: 'ok' }],
    offen: [],
    verlauf: [{ at: '2026-11-12T11:20', von: 'bauleitung', text: 'Bei der Begehung erfasst, Schaden fotografiert.' }, { at: '2026-11-13T16:10', von: 'planung', text: 'Als nicht wiederverwendbar eingestuft. Grund dokumentiert.' }],
  },
  {
    projekt: 'LH', id: 'T-12', gruppe: 'tuer', name: 'Innentür samt Zarge', menge: 1, etage: '1.OG', raum: '1.12', plan: [15, 35],
    werte: { breite: w(860, 'gemessen', begehung), hoehe: w(1985, 'gemessen', begehung), anschlag: w('DIN rechts', 'bestaetigt', 'Sichtprüfung'), material: w('Holzwerkstoff', 'bestaetigt', 'Sichtprüfung'), zarge: w('Stahlumfassungszarge', 'bestaetigt', 'Sichtprüfung'), schutz: w('keine Kennzeichnung gefunden', 'bestaetigt', 'Sichtprüfung Bandseite') },
    zustand: 'A', zustandText: 'kaum Gebrauchsspuren', hersteller: 'unbekannt', baujahr: 'ca. 2004 (geschätzt)',
    status: 'vorgemerkt', ziel: 'verbleibt am Ort in Raum 1.12', verfuegbarAb: null, erfassung: { art: 'Begehung', am: '2026-11-12T11:05', von: 'bauleitung' },
    rueckbau: [['Verbindung', 'kein Ausbau nötig']],
    nachweise: [{ titel: 'Fotodokumentation Begehung', art: 'Foto', datum: '2026-11-12T11:05', von: 'bauleitung', stand: 'liegt vor', ton: 'ok' }],
    offen: [],
    verlauf: [{ at: '2026-11-12T11:05', von: 'bauleitung', text: 'Bei der Begehung erfasst.' }, { at: '2026-11-13T15:30', von: 'planung', text: 'Verbleibt am Ort. Zur Wiederverwendung vorgemerkt.' }],
  },
  {
    projekt: 'LH', id: 'DB-01', gruppe: 'boden', name: 'Doppelbodenplatten 600 × 600 mm', menge: 104, etage: '2.OG', raum: '2.10', bereich: ['2.10', '2.11', '2.12', '2.13', '2.14'],
    werte: { raster: w('600 × 600 mm', 'gemessen', begehung), aufbauhoehe: w(140, 'vorgeschlagen', 'Schätzung an einer Messstelle'), material: w('Calciumsulfat', 'bestaetigt', 'Sichtprüfung Plattenkante'), belag: w('Nadelvlies', 'bestaetigt', 'Sichtprüfung'), beschaedigt: w(9, 'bestaetigt', 'Stichprobe 40 Platten, 3 mit Kantenschaden, hochgerechnet') },
    zustand: 'B', zustandText: 'Stichprobe 40 Platten: 3 mit Kantenschaden', hersteller: 'unbekannt (kein Typenschild gefunden)', baujahr: 'ca. 2009 (geschätzt)',
    status: 'entscheidung', verfuegbarAb: '2026-11-25', erfassung: { art: 'Begehung', am: '2026-11-12T13:10', von: 'bauleitung' }, mengeQuelle: 'Raumflächen 2.10 bis 2.14 aus Bestandsplan (fiktiv)',
    rueckbau: [['Verbindung', 'Platten lose aufgelegt, Stützen verklebt (Annahme)'], ['Zugänglichkeit', 'Räume leergeräumt ab 23.11.2026 (fiktiv)'], ['Schadstoffverdacht', 'Kleber der Stützen nicht untersucht']],
    nachweise: [{ titel: 'Fotodokumentation Stichprobe', art: 'Foto', datum: '2026-11-12T13:10', von: 'bauleitung', stand: 'liegt vor', ton: 'ok' }, { titel: 'Bestandsplan 2.OG', art: 'Plan', datum: '2019-03-01T00:00', von: 'planung', stand: 'liegt vor, nicht geprüft', ton: 'neutral' }],
    offen: [{ text: 'Kleber der Stützen auf Schadstoffe prüfen', rolle: 'fach' }],
    verlauf: [{ at: '2026-11-12T13:10', von: 'bauleitung', text: 'Bei der Begehung erfasst, Stichprobe 40 Platten.' }, { at: '2026-11-14T09:30', von: 'planung', text: 'Entscheidung E-02 angelegt: Wiederverwendung für Bedarf BD-01 prüfen.' }],
  },
  {
    projekt: 'LH', id: 'HK-01', gruppe: 'heiz', name: 'Plattenheizkörper Typ 22', menge: 18, etage: '1.OG', raum: '1.02', bereich: ['1.02', '1.04', '1.06', '1.08', '1.10', '1.12'], plan: [10, 20],
    werte: { laenge: w('1000 bis 1400', 'vorgeschlagen', 'Schätzung bei der Begehung') },
    zustand: 'B', zustandText: 'Lack stellenweise beschädigt', hersteller: 'unbekannt', baujahr: 'ca. 2004 (geschätzt)',
    status: 'erfasst', verfuegbarAb: '2026-11-25', erfassung: { art: 'Begehung', am: '2026-11-12T11:40', von: 'bauleitung' },
    rueckbau: [['Verbindung', 'verschraubt'], ['Schadstoffverdacht', 'nicht bekannt, nicht untersucht']],
    nachweise: [], offen: [{ text: 'Baulängen je Raum aufnehmen', rolle: 'montage' }],
    naechste: { text: 'Baulängen je Raum aufnehmen', rolle: 'montage', grund: 'Ohne Baulängen lässt sich kein Bedarf zuordnen.' },
    verlauf: [{ at: '2026-11-12T11:40', von: 'bauleitung', text: 'Bei der Begehung erfasst, ohne Fotos.' }],
  },
  {
    projekt: 'LH', id: 'TW-01', gruppe: 'wand', name: 'Systemtrennwand, Vollwandelemente', menge: 42, etage: '1.OG', raum: '1.01', plan: [50, 27],
    werte: { hoehe: w(2750, 'gemessen', begehung) },
    zustand: 'B', zustandText: 'einzelne Dellen, Dichtungen spröde', hersteller: 'unbekannt', baujahr: 'unbekannt',
    status: 'bewertung', verfuegbarAb: '2026-11-25', erfassung: { art: 'Begehung', am: '2026-11-12T12:05', von: 'bauleitung' },
    rueckbau: [['Verbindung', 'Klemmprofile, demontierbar'], ['Schadstoffverdacht', 'nicht bekannt, nicht untersucht']],
    nachweise: [{ titel: 'Fotodokumentation Begehung', art: 'Foto', datum: '2026-11-12T12:05', von: 'bauleitung', stand: 'liegt vor', ton: 'ok' }],
    offen: [{ text: 'Schallschutzanforderung am Zielort klären', rolle: 'planung' }, { text: 'Systemhersteller ermitteln', rolle: 'montage' }],
    naechste: { text: 'Schallschutzanforderung am Zielort klären', rolle: 'planung', grund: 'Ein möglicher Zielort im Projekt Seeblick (BD-22) braucht eine Angabe zum Schallschutz.' },
    verlauf: [{ at: '2026-11-12T12:05', von: 'bauleitung', text: 'Bei der Begehung erfasst.' }],
  },
  {
    projekt: 'LH', id: 'LE-01', gruppe: 'licht', name: 'Rasterleuchten 625 × 625 mm', menge: 32, etage: '2.OG', raum: '2.12', plan: [50, 47],
    werte: { raster: w('625 × 625 mm', 'gemessen', begehung) },
    zustand: 'C', zustandText: 'Leuchtmittel veraltet, Umrüstung nötig', hersteller: 'unbekannt', baujahr: 'ca. 2009 (geschätzt)',
    status: 'nicht', grund: 'Umrüstung auf LED unwirtschaftlich (Annahme der Planung). Verwertung über Entsorgungsweg.', verfuegbarAb: null, erfassung: { art: 'Begehung', am: '2026-11-12T13:40', von: 'bauleitung' },
    rueckbau: [['Verbindung', 'in Rasterdecke eingelegt']], nachweise: [], offen: [],
    verlauf: [{ at: '2026-11-12T13:40', von: 'bauleitung', text: 'Bei der Begehung erfasst.' }, { at: '2026-11-13T16:20', von: 'planung', text: 'Als nicht wiederverwendbar eingestuft. Grund dokumentiert.' }],
  },
  // Projekt Kanalblick (Rückbau)
  {
    projekt: 'KB', id: 'TW-05', gruppe: 'wand', name: 'Systemtrennwand mit Glasfeldern', menge: 120, etage: '1.OG', raum: '1.01', plan: [70, 30],
    werte: { hoehe: w(2800, 'bestaetigt', plan) }, zustand: 'B', zustandText: 'gepflegt, Glasfelder ohne Schaden', hersteller: 'Typenschild vorhanden, nicht ausgewertet', baujahr: 'ca. 2012',
    status: 'bewertung', verfuegbarAb: '2027-02-01', erfassung: { art: 'Begehung', am: '2026-11-05T09:30', von: 'bauleitung' },
    rueckbau: [['Verbindung', 'Klemmprofile, demontierbar']], nachweise: [], offen: [{ text: 'Typenschild auswerten', rolle: 'montage' }],
    naechste: { text: 'Bedarf im Projekt Seeblick prüfen (BD-22)', rolle: 'planung', grund: 'Menge und Höhe passen grob, Schallschutz offen.' },
    verlauf: [{ at: '2026-11-05T09:30', von: 'bauleitung', text: 'Bei der Begehung erfasst.' }],
  },
  {
    projekt: 'KB', id: 'DB-11', gruppe: 'boden', name: 'Doppelboden 600 × 600 mm', menge: 340, etage: '2.OG', raum: '2.01', bereich: ['2.01'],
    werte: { raster: w('600 × 600 mm', 'gemessen', 'Begehung 05.11.2026'), aufbauhoehe: w(null, 'fehlt', ''), material: w('Holzwerkstoff', 'bestaetigt', 'Sichtprüfung'), belag: w('Teppich', 'bestaetigt', 'Sichtprüfung'), beschaedigt: w(null, 'fehlt', '') },
    zustand: 'B', zustandText: 'Teppich verschlissen, Platten augenscheinlich gut', hersteller: 'unbekannt', baujahr: 'ca. 2012',
    status: 'erfasst', verfuegbarAb: '2027-02-01', erfassung: { art: 'Begehung', am: '2026-11-05T10:10', von: 'bauleitung' },
    rueckbau: [['Verbindung', 'Platten lose aufgelegt']], nachweise: [], offen: [],
    verlauf: [{ at: '2026-11-05T10:10', von: 'bauleitung', text: 'Bei der Begehung erfasst.' }],
  },
  {
    projekt: 'KB', id: 'T-31', gruppe: 'tuer', name: 'Bürotüren, 14 Stück', menge: 14, etage: '1.OG', raum: '1.05', plan: [70, 15],
    werte: { breite: w(985, 'bestaetigt', plan), hoehe: w(2110, 'bestaetigt', plan), anschlag: w(null, 'fehlt', ''), material: w('Holzwerkstoff', 'bestaetigt', 'Sichtprüfung'), zarge: w('Stahlumfassungszarge', 'bestaetigt', 'Sichtprüfung'), schutz: w(null, 'fehlt', '') },
    zustand: 'B', zustandText: 'Gebrauchsspuren', hersteller: 'unbekannt', baujahr: 'ca. 2012',
    status: 'erfasst', verfuegbarAb: '2027-02-01', erfassung: { art: 'Begehung', am: '2026-11-05T10:40', von: 'bauleitung' },
    rueckbau: [['Verbindung', 'unbekannt']], nachweise: [], offen: [{ text: 'Schutzkennzeichnung je Tür prüfen', rolle: 'fach' }],
    verlauf: [{ at: '2026-11-05T10:40', von: 'bauleitung', text: 'Bei der Begehung erfasst, Sammelposition.' }],
  },
  // Projekt Schule Am Lindenbach (Sanierung)
  {
    projekt: 'SL', id: 'HK-12', gruppe: 'heiz', name: 'Gliederheizkörper', menge: 24, etage: 'EG', raum: 'E.11', bereich: ['E.11', 'E.12', 'E.13'], plan: [16, 2],
    werte: { laenge: w(null, 'fehlt', '') }, zustand: 'C', zustandText: 'Lackschäden, Ventile alt', hersteller: 'unbekannt', baujahr: 'ca. 1975 (geschätzt)',
    status: 'erfasst', verfuegbarAb: '2027-07-05', erfassung: { art: 'Begehung', am: '2026-11-10T08:30', von: 'bauleitung' },
    rueckbau: [['Verbindung', 'verschraubt'], ['Schadstoffverdacht', 'Altanstrich nicht untersucht']], nachweise: [], offen: [{ text: 'Altanstrich untersuchen lassen', rolle: 'fach' }],
    naechste: { text: 'Altanstrich untersuchen lassen', rolle: 'fach', grund: 'Ohne Schadstoffbefund ist keine Wiederverwendung planbar.' },
    verlauf: [{ at: '2026-11-10T08:30', von: 'bauleitung', text: 'Bei der Begehung erfasst.' }],
  },
  {
    projekt: 'SL', id: 'T-41', gruppe: 'tuer', name: 'Klassenraumtüren, 6 Stück', menge: 6, etage: '1.OG', raum: '1.11', plan: [25, 30],
    werte: { breite: w(985, 'vorgeschlagen', 'Schätzung bei der Begehung'), hoehe: w(null, 'fehlt', ''), anschlag: w(null, 'fehlt', ''), material: w('Vollholz', 'bestaetigt', 'Sichtprüfung'), zarge: w('Blockzarge', 'bestaetigt', 'Sichtprüfung'), schutz: w(null, 'fehlt', '') },
    zustand: 'B', zustandText: 'solide, Oberflächen abgenutzt', hersteller: 'unbekannt', baujahr: 'ca. 1975 (geschätzt)',
    status: 'erfasst', verfuegbarAb: '2027-07-05', erfassung: { art: 'Begehung', am: '2026-11-10T09:10', von: 'bauleitung' },
    rueckbau: [['Verbindung', 'Blockzarge eingemauert']], nachweise: [], offen: [],
    verlauf: [{ at: '2026-11-10T09:10', von: 'bauleitung', text: 'Bei der Begehung erfasst, Sammelposition.' }],
  },
];

// Entscheidungen: Bauteil → Zielöffnung (Türregel, geprüft) oder Bedarf (Doppelbodenregel, Entwurf).
export const ENTSCHEIDUNGEN = [
  { projekt: 'LH', id: 'E-01', bauteil: 'T-07', ziel: { art: 'zieloeffnung', id: 'B-02' }, regel: 'tuer', angelegt: '2026-11-14T09:00' },
  { projekt: 'LH', id: 'E-02', bauteil: 'DB-01', ziel: { art: 'bedarf', id: 'BD-01' }, regel: 'boden', angelegt: '2026-11-14T09:30' },
];
