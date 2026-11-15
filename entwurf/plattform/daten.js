// Gemeinsame Beispieldaten für den Plattform-Entwurf.
// ALLE Angaben sind fiktiv: Projekt, Personen, Räume, Maße, Nachweise.
// Alle Ansichten lesen ausschließlich aus diesem einen Datensatz.

export const PROJEKT = {
  id: 'P-2026-014',
  name: 'Umbau Haus Lindenhof',
  zusatz: 'Verwaltungsgebäude, Umbau im Bestand',
  ort: 'fiktiver Standort',
  phase: 'LP 5 · Ausführungsplanung',
  rueckbauAb: '2026-11-25',
  geschosse: ['EG', '1.OG', '2.OG', '3.OG'],
};

export const PERSONEN = {
  planung: { rolle: 'Planung', name: 'J. Neumann', stelle: 'Architekturbüro (fiktiv)' },
  bauleitung: { rolle: 'Bauleitung', name: 'S. Weber', stelle: 'Bauherrenvertretung (fiktiv)' },
  montage: { rolle: 'Montagebetrieb', name: 'K. Arslan', stelle: 'Tischlerei und Innenausbau (fiktiv)' },
  fach: { rolle: 'Fachprüfung', name: 'L. Brandt', stelle: 'Sachverständige Bauteile (fiktiv)' },
};

// Projektzeit der Simulation (Europe/Berlin). Dieselben vier Zeitpunkte wie CF-UMBAU-01 Rev. 2.
export const PROJEKTZEITEN = [
  { at: '2026-11-18T14:00', label: 'Mi 18.11., 14:00' },
  { at: '2026-11-18T15:30', label: 'Mi 18.11., 15:30' },
  { at: '2026-11-19T09:00', label: 'Do 19.11., 09:00' },
  { at: '2026-11-20T09:00', label: 'Fr 20.11., 09:00' },
];

export const GRUPPEN = {
  tuer: { name: 'Innentüren', kurz: 'Tür' },
  boden: { name: 'Doppelboden', kurz: 'Doppelboden' },
  heiz: { name: 'Heizkörper', kurz: 'Heizkörper' },
  wand: { name: 'Systemtrennwände', kurz: 'Trennwand' },
  licht: { name: 'Leuchten', kurz: 'Leuchte' },
};

// Statusfolge eines Bauteils im Projekt.
export const STATUS = {
  erfasst: { label: 'Erfasst', ton: 'neutral', text: 'Bei der Begehung aufgenommen, noch nicht bewertet.' },
  bewertung: { label: 'In Bewertung', ton: 'info', text: 'Angaben werden ergänzt und geprüft.' },
  entscheidung: { label: 'Entscheidung offen', ton: 'warn', text: 'Eine Wiederverwendung wird für einen Zielort geprüft.' },
  fachpruefung: { label: 'Fachprüfung angefragt', ton: 'info', text: 'Variante liegt der Fachprüfung vor.' },
  vorgemerkt: { label: 'Zur Wiederverwendung vorgemerkt', ton: 'ok', text: 'Zielort festgelegt, Ausbau geplant.' },
  nicht: { label: 'Nicht wiederverwendbar', ton: 'crit', text: 'Wiederverwendung ausgeschlossen, Grund dokumentiert.' },
};

// Messstatus einer Maßangabe.
export const MASSSTATUS = {
  gemessen: 'gemessen',
  plan: 'aus Bestandsplan',
  geschaetzt: 'geschätzt',
  fehlt: 'fehlt',
};

export const BAUTEILE = [
  {
    id: 'T-07', gruppe: 'tuer', name: 'Innentür samt Zarge', typ: 'Einzelbauteil',
    menge: 1, einheit: 'Stk', geschoss: '1.OG', raum: 'Raum A', ort: '1.OG · Raum A · Flurseite',
    material: 'Holztürblatt, Stahlumfassungszarge', hersteller: 'unbekannt', baujahr: 'ca. 2004 (geschätzt)',
    zustand: 'B', zustandText: 'Gebrauchsspuren am Türblatt, Zarge ohne sichtbare Verformung (Sichtprüfung)',
    status: 'entscheidung', entscheidung: 'E-01', erfasst: { am: '2026-11-12T10:20', von: 'bauleitung' },
    masse: [
      { name: 'Türblatt Breite', wert: '860 mm', bezug: 'Türblattmaß', status: 'gemessen', quelle: 'Begehung 12.11.2026', hinweis: 'Zählt nicht als Aufmaß der Zielöffnung.' },
      { name: 'Türblatt Höhe', wert: '1985 mm', bezug: 'Türblattmaß', status: 'gemessen', quelle: 'Begehung 12.11.2026' },
      { name: 'Wanddicke an der Zarge', wert: '115 mm', bezug: 'Bestandswand Raum A', status: 'plan', quelle: 'Bestandsplan 1.OG (fiktiv)' },
    ],
    rueckbau: [
      ['Verbindung', 'Zarge verschraubt (Annahme, nicht geöffnet)'],
      ['Zugänglichkeit', 'beidseitig zugänglich'],
      ['Schadstoffverdacht', 'nicht bekannt, nicht untersucht'],
    ],
    nachweise: [
      { titel: 'Fotodokumentation Begehung', art: 'Foto', datum: '2026-11-12T10:20', von: 'bauleitung', stand: 'liegt vor', ton: 'ok' },
      { titel: 'Bestandsplan 1.OG', art: 'Plan', datum: '2019-03-01T00:00', von: 'planung', stand: 'liegt vor, nicht geprüft', ton: 'neutral' },
      { titel: 'Planungsblatt P-02 (Sollbereich B-02)', art: 'Planung', datum: '2026-11-14T09:00', von: 'planung', stand: 'Simulationsannahme', ton: 'neutral' },
    ],
    offen: [],
    verlauf: [
      { at: '2026-11-12T10:20', von: 'bauleitung', text: 'Bei der Begehung erfasst, 3 Fotos.' },
      { at: '2026-11-14T09:00', von: 'planung', text: 'Entscheidung E-01 angelegt: Wiederverwendung in Öffnung B-02 prüfen.' },
    ],
  },
  {
    id: 'T-03', gruppe: 'tuer', name: 'Innentür mit Holzzarge', typ: 'Einzelbauteil',
    menge: 1, einheit: 'Stk', geschoss: '1.OG', raum: '1.08', ort: '1.OG · Raum 1.08',
    material: 'Holztürblatt, Holzzarge', hersteller: 'unbekannt', baujahr: 'unbekannt',
    zustand: 'C', zustandText: 'Zarge an der Bandseite eingerissen (Sichtprüfung)',
    status: 'erfasst', erfasst: { am: '2026-11-12T10:45', von: 'bauleitung' },
    masse: [{ name: 'Türblatt Breite', wert: '735 mm', bezug: 'Türblattmaß', status: 'geschaetzt', quelle: 'Begehung, Schätzung' }],
    rueckbau: [['Verbindung', 'unbekannt'], ['Schadstoffverdacht', 'nicht bekannt, nicht untersucht']],
    nachweise: [{ titel: 'Fotodokumentation Begehung', art: 'Foto', datum: '2026-11-12T10:45', von: 'bauleitung', stand: 'liegt vor', ton: 'ok' }],
    offen: [{ text: 'Türblatt aufmessen', rolle: 'montage' }, { text: 'Zustand der Zarge bewerten', rolle: 'fach' }],
    verlauf: [{ at: '2026-11-12T10:45', von: 'bauleitung', text: 'Bei der Begehung erfasst, 2 Fotos.' }],
  },
  {
    id: 'T-05', gruppe: 'tuer', name: 'Innentür samt Zarge', typ: 'Einzelbauteil',
    menge: 1, einheit: 'Stk', geschoss: '1.OG', raum: '1.10', ort: '1.OG · Raum 1.10',
    material: 'Holztürblatt, Stahlumfassungszarge', hersteller: 'unbekannt', baujahr: 'ca. 2004 (geschätzt)',
    zustand: 'B', zustandText: 'leichte Gebrauchsspuren (Sichtprüfung)',
    status: 'bewertung', erfasst: { am: '2026-11-12T10:55', von: 'bauleitung' },
    masse: [
      { name: 'Türblatt Breite', wert: '860 mm', bezug: 'Türblattmaß', status: 'gemessen', quelle: 'Begehung 12.11.2026' },
      { name: 'Türblatt Höhe', wert: '1985 mm', bezug: 'Türblattmaß', status: 'gemessen', quelle: 'Begehung 12.11.2026' },
    ],
    rueckbau: [['Verbindung', 'Zarge verschraubt (Annahme)'], ['Schadstoffverdacht', 'nicht bekannt, nicht untersucht']],
    nachweise: [{ titel: 'Fotodokumentation Begehung', art: 'Foto', datum: '2026-11-12T10:55', von: 'bauleitung', stand: 'liegt vor', ton: 'ok' }],
    offen: [{ text: 'Zielöffnung festlegen', rolle: 'planung' }],
    verlauf: [{ at: '2026-11-12T10:55', von: 'bauleitung', text: 'Bei der Begehung erfasst, 3 Fotos.' }],
  },
  {
    id: 'T-11', gruppe: 'tuer', name: 'Ganzglastür mit Aluminiumzarge', typ: 'Einzelbauteil',
    menge: 1, einheit: 'Stk', geschoss: '2.OG', raum: '2.01', ort: '2.OG · Raum 2.01',
    material: 'ESG-Glas, Aluminiumzarge', hersteller: 'unbekannt', baujahr: 'unbekannt',
    zustand: 'D', zustandText: 'Glas mit Kantenabplatzung, Zarge verzogen (Sichtprüfung)',
    status: 'nicht', grund: 'Glas beschädigt, Zarge verzogen. Verwertung über Entsorgungsweg.', erfasst: { am: '2026-11-12T11:20', von: 'bauleitung' },
    masse: [{ name: 'Türblatt Breite', wert: '900 mm', bezug: 'Türblattmaß', status: 'plan', quelle: 'Bestandsplan 2.OG (fiktiv)' }],
    rueckbau: [['Verbindung', 'Zarge gedübelt'], ['Schadstoffverdacht', 'nicht bekannt, nicht untersucht']],
    nachweise: [{ titel: 'Fotodokumentation Schaden', art: 'Foto', datum: '2026-11-12T11:20', von: 'bauleitung', stand: 'liegt vor', ton: 'ok' }],
    offen: [],
    verlauf: [
      { at: '2026-11-12T11:20', von: 'bauleitung', text: 'Bei der Begehung erfasst, Schaden fotografiert.' },
      { at: '2026-11-13T16:10', von: 'planung', text: 'Als nicht wiederverwendbar eingestuft. Grund dokumentiert.' },
    ],
  },
  {
    id: 'T-12', gruppe: 'tuer', name: 'Innentür samt Zarge', typ: 'Einzelbauteil',
    menge: 1, einheit: 'Stk', geschoss: '1.OG', raum: '1.12', ort: '1.OG · Raum 1.12',
    material: 'Holztürblatt, Stahlumfassungszarge', hersteller: 'unbekannt', baujahr: 'ca. 2004 (geschätzt)',
    zustand: 'A', zustandText: 'kaum Gebrauchsspuren (Sichtprüfung)',
    status: 'vorgemerkt', ziel: '1.OG · Raum 1.12 (verbleibt am Ort)', erfasst: { am: '2026-11-12T11:05', von: 'bauleitung' },
    masse: [{ name: 'Türblatt Breite', wert: '860 mm', bezug: 'Türblattmaß', status: 'gemessen', quelle: 'Begehung 12.11.2026' }],
    rueckbau: [['Verbindung', 'kein Ausbau nötig']],
    nachweise: [{ titel: 'Fotodokumentation Begehung', art: 'Foto', datum: '2026-11-12T11:05', von: 'bauleitung', stand: 'liegt vor', ton: 'ok' }],
    offen: [],
    verlauf: [
      { at: '2026-11-12T11:05', von: 'bauleitung', text: 'Bei der Begehung erfasst.' },
      { at: '2026-11-13T15:30', von: 'planung', text: 'Verbleibt am Ort. Zur Wiederverwendung vorgemerkt.' },
    ],
  },
  {
    id: 'DB-01', gruppe: 'boden', name: 'Doppelbodenplatten 600 × 600 mm', typ: 'Sammelposition',
    menge: 104, einheit: 'm²', geschoss: '2.OG', raum: '2.10–2.14', ort: '2.OG · Räume 2.10 bis 2.14',
    material: 'Calciumsulfatplatte mit Nadelvlies-Belag', hersteller: 'unbekannt (kein Typenschild gefunden)', baujahr: 'ca. 2009 (geschätzt)',
    zustand: 'B', zustandText: 'Stichprobe 40 Platten: 3 mit Kantenschaden. Hochgerechnet ca. 9 m² nicht verwendbar.',
    status: 'entscheidung', entscheidung: 'E-02', erfasst: { am: '2026-11-12T13:10', von: 'bauleitung' },
    masse: [
      { name: 'Rastermaß', wert: '600 × 600 mm', bezug: 'Plattenkante', status: 'gemessen', quelle: 'Begehung 12.11.2026' },
      { name: 'Fläche', wert: '104 m²', bezug: 'Raumflächen 2.10 bis 2.14', status: 'plan', quelle: 'Bestandsplan 2.OG (fiktiv)' },
      { name: 'Aufbauhöhe', wert: 'ca. 140 mm', bezug: 'Rohdecke bis Oberkante Belag', status: 'geschaetzt', quelle: 'Begehung, eine Messstelle' },
    ],
    rueckbau: [
      ['Verbindung', 'Platten lose aufgelegt, Stützen verklebt (Annahme)'],
      ['Zugänglichkeit', 'Räume leergeräumt ab 23.11.2026 (fiktiv)'],
      ['Schadstoffverdacht', 'Kleber der Stützen nicht untersucht'],
    ],
    nachweise: [
      { titel: 'Fotodokumentation Stichprobe', art: 'Foto', datum: '2026-11-12T13:10', von: 'bauleitung', stand: 'liegt vor', ton: 'ok' },
      { titel: 'Bestandsplan 2.OG', art: 'Plan', datum: '2019-03-01T00:00', von: 'planung', stand: 'liegt vor, nicht geprüft', ton: 'neutral' },
    ],
    offen: [],
    verlauf: [
      { at: '2026-11-12T13:10', von: 'bauleitung', text: 'Bei der Begehung erfasst, Stichprobe 40 Platten.' },
      { at: '2026-11-14T09:30', von: 'planung', text: 'Entscheidung E-02 angelegt: Wiederverwendung im 3.OG prüfen.' },
    ],
  },
  {
    id: 'DB-02', gruppe: 'boden', name: 'Doppelbodenstützen, höhenverstellbar', typ: 'Sammelposition',
    menge: 290, einheit: 'Stk', geschoss: '2.OG', raum: '2.10–2.14', ort: '2.OG · unter DB-01',
    material: 'Stahl verzinkt', hersteller: 'unbekannt', baujahr: 'ca. 2009 (geschätzt)',
    zustand: 'B', zustandText: 'drei Stützen geprüft, ohne Korrosion (Sichtprüfung)',
    status: 'bewertung', erfasst: { am: '2026-11-12T13:25', von: 'bauleitung' },
    masse: [{ name: 'Verstellbereich', wert: 'unbekannt', bezug: 'Stützenhöhe', status: 'fehlt', quelle: '–' }],
    rueckbau: [['Verbindung', 'mit Rohdecke verklebt (Annahme)'], ['Schadstoffverdacht', 'Kleber nicht untersucht']],
    nachweise: [{ titel: 'Fotodokumentation Stichprobe', art: 'Foto', datum: '2026-11-12T13:25', von: 'bauleitung', stand: 'liegt vor', ton: 'ok' }],
    offen: [{ text: 'Verstellbereich der Stützen feststellen (gehört zu E-02)', rolle: 'montage' }],
    verlauf: [{ at: '2026-11-12T13:25', von: 'bauleitung', text: 'Bei der Begehung erfasst, Menge aus Raster hochgerechnet.' }],
  },
  {
    id: 'HK-01', gruppe: 'heiz', name: 'Plattenheizkörper Typ 22', typ: 'Sammelposition',
    menge: 18, einheit: 'Stk', geschoss: '1.OG', raum: 'mehrere', ort: '1.OG · Büroräume 1.02 bis 1.12',
    material: 'Stahl', hersteller: 'unbekannt', baujahr: 'ca. 2004 (geschätzt)',
    zustand: 'B', zustandText: 'Lack stellenweise beschädigt (Sichtprüfung)',
    status: 'erfasst', erfasst: { am: '2026-11-12T11:40', von: 'bauleitung' },
    masse: [{ name: 'Baulänge', wert: '1000 bis 1400 mm', bezug: 'Heizkörper', status: 'geschaetzt', quelle: 'Begehung, Schätzung' }],
    rueckbau: [['Verbindung', 'verschraubt'], ['Schadstoffverdacht', 'nicht bekannt, nicht untersucht']],
    nachweise: [],
    offen: [{ text: 'Baulängen je Raum aufnehmen', rolle: 'montage' }, { text: 'Bedarf im Neubauteil klären', rolle: 'planung' }],
    verlauf: [{ at: '2026-11-12T11:40', von: 'bauleitung', text: 'Bei der Begehung erfasst, ohne Fotos.' }],
  },
  {
    id: 'TW-01', gruppe: 'wand', name: 'Systemtrennwand, Vollwandelemente', typ: 'Sammelposition',
    menge: 42, einheit: 'lfm', geschoss: '1.OG', raum: 'Flur', ort: '1.OG · Flur Nordseite',
    material: 'Stahlblech beschichtet, Mineralwolle', hersteller: 'unbekannt', baujahr: 'unbekannt',
    zustand: 'B', zustandText: 'einzelne Dellen, Dichtungen spröde (Sichtprüfung)',
    status: 'bewertung', erfasst: { am: '2026-11-12T12:05', von: 'bauleitung' },
    masse: [{ name: 'Elementhöhe', wert: '2750 mm', bezug: 'Element', status: 'gemessen', quelle: 'Begehung 12.11.2026' }],
    rueckbau: [['Verbindung', 'Klemmprofile, demontierbar'], ['Schadstoffverdacht', 'nicht bekannt, nicht untersucht']],
    nachweise: [{ titel: 'Fotodokumentation Begehung', art: 'Foto', datum: '2026-11-12T12:05', von: 'bauleitung', stand: 'liegt vor', ton: 'ok' }],
    offen: [{ text: 'Schallschutzanforderung am Zielort klären', rolle: 'planung' }, { text: 'Systemhersteller ermitteln', rolle: 'montage' }],
    verlauf: [{ at: '2026-11-12T12:05', von: 'bauleitung', text: 'Bei der Begehung erfasst.' }],
  },
  {
    id: 'LE-01', gruppe: 'licht', name: 'Rasterleuchten 625 × 625 mm', typ: 'Sammelposition',
    menge: 32, einheit: 'Stk', geschoss: '2.OG', raum: 'mehrere', ort: '2.OG · Büroräume',
    material: 'Stahlblechgehäuse, Leuchtstoffröhren', hersteller: 'unbekannt', baujahr: 'ca. 2009 (geschätzt)',
    zustand: 'C', zustandText: 'Leuchtmittel veraltet, Umrüstung nötig',
    status: 'nicht', grund: 'Umrüstung auf LED unwirtschaftlich (Annahme der Planung). Verwertung über Entsorgungsweg.', erfasst: { am: '2026-11-12T13:40', von: 'bauleitung' },
    masse: [{ name: 'Rastermaß', wert: '625 × 625 mm', bezug: 'Leuchte', status: 'gemessen', quelle: 'Begehung 12.11.2026' }],
    rueckbau: [['Verbindung', 'in Rasterdecke eingelegt']],
    nachweise: [],
    offen: [],
    verlauf: [
      { at: '2026-11-12T13:40', von: 'bauleitung', text: 'Bei der Begehung erfasst.' },
      { at: '2026-11-13T16:20', von: 'planung', text: 'Als nicht wiederverwendbar eingestuft. Grund dokumentiert.' },
    ],
  },
];

// Entscheidung E-01 nutzt die geprüfte Türregel (CF-UMBAU-01 Rev. 2) unverändert.
// Entscheidung E-02 nutzt eine Entwurfsregel mit derselben Rangfolge (nicht geprüft).
export const ENTSCHEIDUNGEN = [
  {
    id: 'E-01', bauteil: 'T-07', regel: 'tuer',
    titel: 'Tür T-07 in Öffnung B-02 wiederverwenden',
    herkunft: '1.OG · Raum A', ziel: 'Öffnung B-02', zielText: '2.OG · neuer Besprechungsraum, Öffnung B-02',
    zustaendig: { entscheidung: 'planung', aufmass: 'montage', pruefung: 'fach' },
    schutz: 'Keine Brand-, Rauch- oder Schallschutzanforderung an B-02 laut fiktivem Raumbuch.',
  },
  {
    id: 'E-02', bauteil: 'DB-01', regel: 'boden',
    titel: 'Doppelboden DB-01 im 3.OG wiederverwenden',
    herkunft: '2.OG · Räume 2.10 bis 2.14', ziel: 'Fläche 3.04 bis 3.06', zielText: '3.OG · Fläche 3.04 bis 3.06, neue Technikzone',
    zustaendig: { entscheidung: 'planung', aufmass: 'montage', pruefung: 'fach' },
    schutz: 'Brandschutz am Zielort laut fiktivem Raumbuch ohne besondere Anforderung. Fachprüfung bestätigt.',
    soll: {
      raster: '600 × 600 mm', bedarfM2: 72, reserveProzent: 10, aufbauhoeheMm: 150, punktlastKn: 3,
    },
    ist: { flaecheM2: 104, beschaedigtM2: 9, raster: '600 × 600 mm' },
    fristen: { nachweis: '2026-11-19T10:00', ersatz: '2026-11-20T12:00' },
  },
];
