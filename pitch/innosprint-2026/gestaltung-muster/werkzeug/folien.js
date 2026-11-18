// Die drei Musterfolien als Liste von Elementen (Formen, Bilder, Texte) in Folienpixeln (1920 x 1080).
// Wortlaute stammen aus dem geprüften Pitch (pitch/innosprint-2026/werkzeug/inhalt-p5.js) und aus den am
// 18.11.2026 gelesenen Quellen; Abweichungen stehen in der Herkunftsübersicht.
const { F, breite, text, obenFuerMitte, form, rechteck, rahmen, linie, bild, pille, r1 } = require('./basis');
const { reiheBreite } = require('./grafiken');

const RAND = 80, RECHTS = 1840;
function marke(variante, wortfarbe) {
  return [bild('Produktzeichen', `marke-${variante}.svg`, { x: RAND, y: 56, w: 56, h: 56, alt: 'Produktzeichen CircularFlow' }),
    text('Wortmarke', 'CircularFlow', { x: RAND + 72, y: obenFuerMitte(84, 32), g: 32, fett: true, farbe: wortfarbe })];
}

// ---------- Musterfolie 1 · Einstieg ----------
function folie1() {
  const e = [];
  const BODEN = 742, TH = 164, TB = reiheBreite(6);
  const xL = 336, xR = 1080; // linke Kanten der beiden Türreihen
  e.push(rechteck('Boden', { x: 0, y: BODEN, w: 1920, h: 1080 - BODEN, farbe: F.gruenTief }));
  e.push(...marke('hell', F.weiss));
  e.push(...pille('Kennzeichnung Fiktiver Fall', 'Fiktiver Fall', { x: RECHTS, y: 58, ausr: 'rechts', fg: F.simT, bg: F.simF }).teile);
  e.push(text('Titel Zeile 1', 'Eine brauchbare Tür kann verloren gehen,', { x: RAND, y: 160, g: 68, fett: true, farbe: F.weiss }));
  e.push(text('Titel Zeile 2', 'weil die Information zu spät kommt', { x: RAND, y: 238, g: 68, fett: true, farbe: F.bernstein }));
  e.push(bild('Haus Lindenhof', 'haus-lindenhof.svg', { x: RAND, y: BODEN - 350, w: 236, h: 350, alt: 'Bürohaus, aus dem Türen ausgebaut werden (fiktiv)' }));
  e.push(bild('Umbau am Kanal', 'umbau-am-kanal.svg', { x: RECHTS - 236, y: BODEN - 350, w: 236, h: 350, alt: 'Gebäude im Umbau mit Gerüst (fiktiv)' }));
  e.push(bild('Bogen mit Uhr', 'bogen-zu-spaet.svg', { x: 570, y: 356, w: 780, h: 224, alt: 'Der Weg vom Angebot zum Bedarf ist an der Uhr unterbrochen: Die Information kommt zu spät' }));
  e.push(bild('Sechs angebotene Türen', 'tueren-angeboten.svg', { x: xL, y: BODEN - TH, w: TB, h: TH, alt: 'Sechs angebotene Türen' }));
  e.push(bild('Sechs gesuchte Türen', 'tueren-gesucht.svg', { x: xR, y: BODEN - TH, w: TB, h: TH, alt: 'Sechs leere Türumrisse: Bedarf an sechs Türen' }));
  e.push(...pille('zu spät erfahren', 'zu spät erfahren', { x: 960, y: 506, h: 54, g: 30, ausr: 'mitte', fg: F.weiss, bg: F.rot, pad: 26 }).teile);
  // Beschriftungen unter den beiden Orten
  e.push(text('Ort links', 'Haus Lindenhof', { x: RAND + 16, y: 766, g: 36, fett: true, farbe: F.weiss }));
  e.push(text('Angebot', '6 von 12 Türen angeboten', { x: RAND + 16, y: 814, g: 30, farbe: F.gruenHell }));
  e.push(text('Ort rechts', 'Umbau am Kanal', { x: xR, y: 766, g: 36, fett: true, farbe: F.weiss }));
  e.push(text('Bedarf', 'braucht 6 Türen', { x: xR, y: 814, g: 30, farbe: F.gruenHell }));
  // Folgen
  const pfeil = (name, x, cy, farbe) => form(name, { x, y: cy - 13, w: 46, h: 26, d: 'M0 9H28V0L46 13L28 26V17H0Z', farbe });
  e.push(pfeil('Pfeil Folge links', RAND + 16, 926, F.bernstein));
  e.push(bild('Container', 'container.svg', { x: RAND + 82, y: 870, w: 156, h: 104, alt: 'Container, aus dem eine Tür ragt' }));
  e.push(text('Folge links', 'können im Container landen', { x: RAND + 262, y: obenFuerMitte(928, 34), g: 34, fett: true, farbe: F.bernstein }));
  e.push(pfeil('Pfeil Folge rechts', xR, 926, F.weiss));
  e.push(bild('Lieferung', 'lieferung.svg', { x: xR + 66, y: 870, w: 156, h: 104, alt: 'Lieferwagen mit neuer Tür' }));
  e.push(text('Folge rechts', 'neu bestellt', { x: xR + 246, y: obenFuerMitte(928, 34), g: 34, fett: true, farbe: F.weiss }));
  e.push(text('Fußzeile Fall', 'Fiktiver Pilotfall CF-PILOT-01; Gebäude und Projekte ausgedacht', { x: RAND, y: 1022, g: 22, farbe: F.gruenHell }));
  e.push(text('Fußzeile Team', 'Feyrouz Chahed · Houssam Taleb · INNOSPRINT Zirkuläres Bauen · Dortmund · 20.11.2026', { x: RECHTS, y: 1022, g: 22, farbe: F.gruenHell, ausr: 'end' }));
  return {
    nr: 1, titel: 'Muster 1 · Einstieg: sechs Türen, zu spät erfahren', hintergrund: F.gruen, elemente: e,
    notiz: 'Spricht: Feyrouz · 31 Sekunden · Sprechtext unverändert aus dem geprüften Pitch (Folie 1)\n\nEin ausgedachter Fall, der in Dortmund spielt: In einem Bürohaus werden zwölf Türen ausgebaut, sechs davon werden angeboten. Ein anderer Umbau braucht genau sechs Türen. Doch die Projektleitung erfährt zu spät davon und bestellt neu. Die angebotenen Türen können im Container landen. Wir sind Feyrouz Chahed und Houssam Taleb. Mit CircularFlow wollen wir das ändern.',
  };
}

// ---------- Musterfolie 2 · Problemgröße ----------
// Zahlen: Destatis, Pressemitteilung Nr. 185 vom 1. Juni 2026 (362,7 Mio. t Abfälle, davon 182,8 Mio. t Bau- und
// Abbruchabfälle, 50 %, vorläufig, 2024); Umweltbundesamt, Tabelle „Abfallaufkommen“ nach Abfallbilanz des
// Statistischen Bundesamts (darunter Boden, Steine und Baggergut 102.887 Tsd. t). Kästchen: 182.769/362.719 = 50,4 %
// -> 50 Kästchen; 102.887/362.719 = 28,4 % -> 28 Kästchen (eigene Rundung).
const WAFFEL = { boden: 28, bau: 22, rest: 50 };
const WF = { boden: '#86BFAE', bau: F.gruen, rest: '#C4BAA3' };
function folie2() {
  const e = [];
  const PB = 700; // Breite der grünen Fläche
  e.push(rechteck('Grüne Fläche', { x: 0, y: 0, w: PB, h: 1080, farbe: F.gruen }));
  e.push(...marke('hell', F.weiss));
  let px = RAND;
  for (const [t, fg, bg] of [['Deutschland', F.gruen, F.creme], ['2024', F.gruen, F.creme], ['vorläufig', F.simT, F.simF]]) {
    const p = pille('Angabe ' + t, t, { x: px, y: 318, h: 52, g: 27, fg, bg }); e.push(...p.teile); px = p.rechts + 12;
  }
  e.push(text('Zahl', '182,8', { x: RAND - 8, y: 384, g: 208, fett: true, farbe: F.weiss }));
  e.push(text('Einheit', 'Millionen Tonnen', { x: RAND, y: 620, g: 50, fett: true, farbe: F.bernstein }));
  e.push(text('Kategorie', 'Bau- und Abbruchabfälle', { x: RAND, y: 692, g: 42, fett: true, farbe: F.weiss }));
  e.push(text('Quelle 1', 'Quelle: Statistisches Bundesamt (Destatis),\nPressemitteilung Nr. 185 vom 1. Juni 2026,\nvorläufige Ergebnisse für 2024', { x: RAND, y: 946, g: 22, farbe: F.gruenHell, zh: 1.36 }));
  const X = PB + 70; // linke Kante der rechten Seite
  e.push(text('Titel Zeile 1', 'Die Hälfte aller Abfälle sind', { x: X, y: 60, g: 56, fett: true, farbe: F.tinte }));
  e.push(text('Titel Zeile 2', 'Bau- und Abbruchabfälle', { x: X, y: 126, g: 56, fett: true, farbe: F.gruen }));
  // Kästchenbild: 10 x 10, zeilenweise von oben; 1 Kästchen = 1 % aller Abfälle
  const Z = 46, L = 8, T = Z + L, WY = 236, G = 10 * T - L;
  const gruppe = (name, von, bis, farbe) => {
    let d = '', zw = ''; let minR = 9, maxR = 0, minC = 9, maxC = 0; const zellen = [];
    for (let i = von; i < bis; i++) { const r = Math.floor(i / 10), c = i % 10; zellen.push([r, c]); minR = Math.min(minR, r); maxR = Math.max(maxR, r); minC = Math.min(minC, c); maxC = Math.max(maxC, c); }
    for (const [r, c] of zellen) { d += `M${(c - minC) * T} ${(r - minR) * T}h${Z}v${Z}h-${Z}z`; zw += `<rect x="${(c - minC) * T}" y="${(r - minR) * T}" width="${Z}" height="${Z}" rx="7" fill="${farbe}"/>`; }
    const f = form(name, { x: X + minC * T, y: WY + minR * T, w: (maxC - minC) * T + Z, h: (maxR - minR) * T + Z, d, farbe });
    f.ecken = 7; f.zwilling = zw; return f;
  };
  e.push(gruppe('Kästchen Boden, Steine und Baggergut (28)', 0, WAFFEL.boden, WF.boden));
  e.push(gruppe('Kästchen übrige Bau- und Abbruchabfälle (22)', WAFFEL.boden, WAFFEL.boden + WAFFEL.bau, WF.bau));
  e.push(gruppe('Kästchen alle anderen Abfälle (50)', 50, 100, WF.rest));
  const BX = X + G + 26, TX = BX + 26; // Klammerlinie und Textkante
  e.push(linie('Klammer Bau- und Abbruchabfälle', { x1: BX, y1: WY, x2: BX, y2: WY + 5 * T - L, s: 5, farbe: F.gruen }));
  e.push(text('Beschriftung Anteil', '50 % aller Abfälle', { x: TX, y: WY + 6, g: 36, fett: true, farbe: F.tinte }));
  e.push(rechteck('Farbfeld Boden', { x: TX, y: WY + 86, w: 28, h: 28, r: 6, farbe: WF.boden }));
  e.push(text('Beschriftung Boden', 'darunter Boden, Steine und\nBaggergut: 102,9 Mio. t', { x: TX + 42, y: WY + 78, g: 28, farbe: F.tinte2, zh: 1.28 }));
  e.push(rechteck('Farbfeld übrige Bau- und Abbruchabfälle', { x: TX, y: WY + 174, w: 28, h: 28, r: 6, farbe: WF.bau }));
  e.push(text('Beschriftung übrige Bau- und Abbruchabfälle', 'übrige Bau- und Abbruchabfälle', { x: TX + 42, y: WY + 170, g: 28, farbe: F.tinte2 }));
  e.push(linie('Klammer andere Abfälle', { x1: BX, y1: WY + 5 * T, x2: BX, y2: WY + G, s: 5, farbe: '#B5AC98' }));
  e.push(text('Beschriftung andere', 'alle anderen Abfälle', { x: TX, y: WY + 5 * T + 6, g: 30, farbe: F.tinte2 }));
  e.push(text('Gesamtmenge', '100 Kästchen = 362,7 Mio. t Abfälle insgesamt', { x: X, y: WY + G + 14, g: 24, farbe: F.tinte3 }));
  // getrennt davon: Bauteile zur Wiederverwendung
  const KY = 836, KH = 142;
  e.push(rechteck('Kasten Wiederverwendung', { x: X, y: KY, w: RECHTS - X, h: KH, r: 22, farbe: F.bernsteinHell, rand: { farbe: F.bernstein, staerke: 3 } }));
  e.push(bild('Tür', 'tuer.svg', { x: X + 30, y: KY + 14, w: 51.4, h: 114, alt: 'Tür als Beispiel für ein wiederverwendbares Bauteil' }));
  e.push(text('Fragezeichen', '?', { x: X + 122, y: obenFuerMitte(KY + KH / 2, 86), g: 86, fett: true, farbe: F.bernsteinTief, ausr: 'center' }));
  e.push(text('Wiederverwendung Titel', 'Wiederverwendbare Bauteile wie Türen', { x: X + 176, y: KY + 16, g: 34, fett: true, farbe: F.tinte }));
  e.push(text('Wiederverwendung Text', 'sind in diesen Zahlen nicht eigens ausgewiesen.\nWir leiten daraus keine Einsparung ab.', { x: X + 176, y: KY + 62, g: 27, farbe: F.tinte2, zh: 1.3 }));
  e.push(text('Quelle 2', 'Boden, Steine und Baggergut: Umweltbundesamt, Tabelle „Abfallaufkommen“ (nach Abfallbilanz des\nStatistischen Bundesamts), abgerufen am 18.11.2026 · 1 Kästchen = 1 % aller Abfälle, gerundet', { x: X, y: 998, g: 20, farbe: F.tinte3, zh: 1.36 }));
  return {
    nr: 2, titel: 'Muster 2 · Problemgröße: 182,8 Millionen Tonnen', hintergrund: F.creme, elemente: e,
    notiz: 'Sprechtext-VORSCHLAG (nicht Teil des geprüften Pitches). Diese Folie gibt es im geprüften Pitch nicht; die Zahl stammt aus der Gestaltungsfassung v0.2 und ist am 18.11.2026 an den Quellen nachgelesen. 32 Wörter, beim Sprechtempo des geprüften Pitches etwa 18 Sekunden. Wer spricht und ob die Zeit dafür reicht, entscheidet das Team.\n\n2024 fielen in Deutschland 182,8 Millionen Tonnen Bau- und Abbruchabfälle an, die Hälfte aller Abfälle, nach vorläufigen Zahlen des Statistischen Bundesamts. Wie viel davon wiederverwendbare Bauteile sind, weisen die Zahlen nicht aus.\n\nQuellen: Statistisches Bundesamt (Destatis), Pressemitteilung Nr. 185 vom 1. Juni 2026: 362,7 Mio. t Abfälle insgesamt, davon 182,8 Mio. t Bau- und Abbruchabfälle (50 %), vorläufige Ergebnisse für 2024. Umweltbundesamt, Tabelle „Abfallaufkommen“ nach Abfallbilanz des Statistischen Bundesamts: darunter Boden, Steine und Baggergut 102,887 Mio. t. Kästchen eigene Rundung: 50 von 100 für Bau- und Abbruchabfälle (50,4 %), davon 28 für Boden, Steine und Baggergut (28,4 % aller Abfälle).',
  };
}

// ---------- Musterfolie 3 · Produktnutzen ----------
// Echte Ergebniskarte der Ansicht „Abgleich“ (TW-05 und BD-22), aufgenommen aus plattform/ im Pitch-Stand.
function folie3(mess) {
  const e = [];
  e.push(...marke('gruen', F.tinte));
  const p2 = pille('Kennzeichnung Simulation', 'Simulation', { x: RECHTS, y: 58, ausr: 'rechts', fg: F.simT, bg: F.simF });
  const p1 = pille('Kennzeichnung Beispieldaten', 'Beispieldaten', { x: p2.left - 12, y: 58, ausr: 'rechts', fg: F.simT, bg: F.simF });
  e.push(...p1.teile, ...p2.teile);
  const t1 = 'CircularFlow zeigt,', G = 58;
  e.push(text('Titel Teil 1', t1, { x: RAND, y: 148, g: G, fett: true, farbe: F.tinte, luft: 0 }));
  e.push(text('Titel Teil 2', 'ob die Zeit für die Prüfung reicht', { x: RAND + breite(t1 + ' ', G, true), y: 148, g: G, fett: true, farbe: F.gruen }));
  // Zeitstrahl, maßstäblich: 18.11.2026 (Stichtag der Demo) bis 31.03.2027 (Bestellfrist) = 133 Tage
  const KX = 473, KY = 262, KW = 1367; const s = KW / mess.karte.w; const KH = r1(KW * mess.bild.h / mess.bild.w);
  const SP = KX - 40 - RAND; // Breite der linken Spalte
  const TAGE = { gesamt: 133, pruefzeit: 10, freiAb: 75 }; // 18.11. + 10 = 28.11.2026; 18.11.2026 + 75 = 01.02.2027
  const AX = RAND + 48, Y0 = KY + 130, Y1 = KY + KH - 46, PT = (Y1 - Y0) / TAGE.gesamt; const yTag = (t) => r1(Y0 + t * PT);
  const LX = AX + 44;
  e.push(rechteck('Zeitstrahl · Fläche', { x: RAND, y: KY, w: SP, h: KH, r: 20, farbe: F.weiss, rand: { farbe: F.linie, staerke: 2 } }));
  e.push(bild('Zeitstrahl · Symbol Prüfzeit', 'symbol-pruefzeit.svg', { x: RAND + 22, y: KY + 22, w: 52, h: 52, alt: 'Symbol Stoppuhr' }));
  e.push(text('Zeitstrahl · Frage', 'Reicht die Zeit?', { x: RAND + 88, y: obenFuerMitte(KY + 48, 30), g: 30, fett: true, farbe: F.gruen }));
  e.push(text('Zeitstrahl · heute', 'heute', { x: AX, y: Y0 - 38, g: 24, farbe: F.tinte3, ausr: 'center' }));
  e.push(rechteck('Zeitstrahl · Zeit bis zur Bestellfrist (123 Tage)', { x: AX - 6, y: yTag(TAGE.pruefzeit), w: 12, h: Y1 - yTag(TAGE.pruefzeit), farbe: F.gruen }));
  e.push(rechteck('Zeitstrahl · angenommene Prüfzeit (10 Tage)', { x: AX - 15, y: Y0, w: 30, h: yTag(TAGE.pruefzeit) - Y0, r: 7, farbe: F.bernstein }));
  e.push(bild('Zeitstrahl · Symbol Bauteil', 'symbol-bauteil.svg', { x: AX - 24, y: yTag(TAGE.freiAb) - 24, w: 48, h: 48, alt: 'Symbol Bauteil' }));
  e.push(bild('Zeitstrahl · Symbol Bestellfrist', 'symbol-bestellfrist.svg', { x: AX - 24, y: Y1 - 24, w: 48, h: 48, alt: 'Symbol Kalender' }));
  // Beschriftungen als mittig um cy gesetzte Stapel; erläuternde Zeilen 28 px (14 pt), damit sie am Beamer lesbar bleiben
  const KLEIN = 28, ZH = 1.15;
  const stapel = (name, zeilen, cy) => {
    const hs = zeilen.map(([t, g]) => g * ZH * t.split('\n').length); let y = cy - hs.reduce((a, b) => a + b, 0) / 2;
    zeilen.forEach(([t, g, fett, farbe], i) => { e.push(text(`${name} · Zeile ${i + 1}`, t, { x: LX, y: obenFuerMitte(y + g * ZH / 2, g), g, fett, farbe, zh: ZH })); y += hs[i]; });
  };
  stapel('Zeitstrahl · Prüfzeit', [['10 Tage', 34, true, F.tinte], ['angenommene\nPrüfzeit', KLEIN, false, F.tinte2]], Y0 + 44);
  stapel('Zeitstrahl · Abstand', [['123 Tage', 48, true, F.gruen], ['vor der Bestellfrist', KLEIN, false, F.tinte2]], (yTag(TAGE.pruefzeit) + yTag(TAGE.freiAb)) / 2 + 8);
  stapel('Zeitstrahl · Bauteil', [['Bauteil frei ab', KLEIN, false, F.tinte2], ['01.02.2027', 30, true, F.tinte]], yTag(TAGE.freiAb));
  stapel('Zeitstrahl · Bestellfrist', [['Bestellfrist', KLEIN, false, F.tinte2], ['31.03.2027', 30, true, F.tinte]], Y1 - 2);
  e.push(form('Pfeil zur Ansicht', { x: KX - 31, y: KY + KH / 2 - 20, w: 22, h: 40, d: 'M0 0L22 20L0 40Z', farbe: F.bernstein }));
  // echte Ansicht
  e.push(rechteck('Schatten der Ansicht', { x: KX + 12, y: KY + 14, w: KW, h: KH, r: 16, farbe: F.gruen, deck: 0.16 }));
  e.push(bild('Echte Ansicht: Ergebnis des Abgleichs', 'karte-k4.svg', { x: KX, y: KY, w: KW, h: KH, alt: 'Echte Ansicht der Vorschau: Ergebnis „Weiter prüfen“ für TW-05 und BD-22 mit Begründung, nächstem Schritt und Knopf „Prüfbitte anlegen“ (Beispieldaten, Simulation)' }));
  e.push(...pille('Kennzeichnung echte Ansicht', 'Echte Ansicht der Vorschau', { x: KX + KW - 28, y: KY - 22, h: 44, g: 23, ausr: 'rechts', fg: F.weiss, bg: F.gruen, pad: 20 }).teile);
  const g1 = mess.grund1, kn = mess.knopf;
  e.push(rechteck('Markierung Begründung', { x: KX + (g1.x - 5) * s, y: KY + (g1.y - 4) * s, w: (g1.w + 10) * s, h: (g1.h + 8) * s, r: 8, farbe: F.bernstein, deck: 0.3 }));
  const rx = KX + (kn.x - 8) * s, ry = KY + (kn.y - 8) * s, rw = (kn.w + 16) * s, rh = (kn.h + 16) * s;
  e.push(rahmen('Markierung Knopf', { x: rx, y: ry, w: rw, h: rh, r: 24, s: 7, farbe: F.bernstein }));
  e.push(bild('Mauszeiger', 'zeiger.svg', { x: rx + rw - 8, y: ry + rh / 2 - 8, w: 48, h: 60, alt: 'Mauszeiger auf dem Knopf „Prüfbitte anlegen“' }));
  e.push(text('Fußzeile', 'Echte Ansicht der Vorschau (Fassung 2, Code 2121b92): Abgleich TW-05 und BD-22, Systemtrennwände statt Türen · Stichtag der Demo Mi 18.11.2026, 14:00 (Simulation)\nDer Abgleich ist ein Vorschlag zur Prüfung, keine fachliche Freigabe. Es wird nichts versendet.', { x: RAND, y: 1002, g: 20, farbe: F.tinte3, zh: 1.36 }));
  return {
    nr: 3, titel: 'Muster 3 · Produktnutzen: echte Ansicht „Abgleich“', hintergrund: F.creme, elemente: e,
    notiz: 'Spricht: Houssam · 27 Sekunden · Sprechtext unverändert aus dem geprüften Pitch (Folie 3)\n\nCircularFlow bringt drei Angaben zusammen: wann ein Bauteil frei wird, bis wann ein Projekt bestellen muss und wie lange die Prüfung dauert. Daraus zeigt es: Reicht die Zeit, ist es knapp oder zu spät, welche Angaben fehlen und was als Nächstes zu tun ist.\n\nZur Ansicht: echte Aufnahme der Vorschau, Paar TW-05 und BD-22 (Beispieldaten, Systemtrennwände statt Türen). Die Prüfzeit von 10 Tagen ist angenommen. Der Abgleich ist ein Vorschlag zur Prüfung, keine fachliche Freigabe. Der Knopf legt in der Simulation einen Vorgang an; es wird nichts versendet.',
  };
}

module.exports = { folie1, folie2, folie3, WAFFEL, WF };
