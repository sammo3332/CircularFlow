// Fassung A "Umbaufall": Folien A1-A8, E1-E6 (versteckt), Anhang
const B = require("./bausteine");
const G = require("./inhalt-gemeinsam");
const { COL, LM, CW, T, karte, kette, zeitleisteFall } = B;

const A5_KURZ = "Der Nutzen, den wir erwarten: Die Planung sieht früh, was frei wird, bekommt die Zeitprüfung mit Begründung in Tagen und sieht den nächsten Schritt. Das ist eine Hypothese. Andere Plattformen vermitteln Angebot und Gesuch. Unsere Frage ist, ob die Zeit für eine Prüfung reicht. Ob andere Plattformen das abbilden, haben wir nicht geprüft.";
const A3_KURZ = "Das Angebot wird am 19. Januar bekannt. Mit 14 Tagen Mindestprüfzeit ist der letzte Tag für die Prüfbitte der 5. Februar, nicht der 19. Ab dem 6. Februar lautet das Ergebnis: für diese Entscheidung zu spät. In Variante 1 erreicht das Angebot die Planung am 20. Januar, rechtzeitig. In Variante 2 erst am 22. Februar, dann ist der Ersatz schon bestellt. Alle Zeitpunkte sind nachgerechnet, nicht erlebt. Die 14 Tage sind eine Annahme.";
const A4_KURZ = "Jetzt zeigen wir die Zeitprüfung live in der Vorschau. Die Türen aus unserem Fall liegen dort nicht, wir nehmen die Beispieldaten der Vorschau. Die Zeitprüfung ist dieselbe. Ein Paar ist ein Angebot und ein Bedarf derselben Bauteilgruppe.";
const MADASTER = "Madaster: Die Dokumentation (Stand 09.09.2026) nennt keine Bestellfrist und keine Prüfzeit auf der Suchseite. Die Funktion selbst haben wir nicht bedient.";
const FUSS_ABGRENZUNG = "Concular Exchange: laut Anbieter, Stand 08.11.2026, nicht erneut geprüft. Madaster Match: laut Dokumentation, zuletzt bearbeitet 09.09.2026. Quelle: Rechercheplan des Teams; Fallakte CF-PILOT-01 §6";

function folien() {
  const f = [];

  f.push({
    id: "A1", abschnitt: "Einstieg", layout: "TITEL", titel: "Zwölf Bürotüren und ein Datum, das nirgends steht",
    untertitel: "CircularFlow · ein fiktiver Fall aus dem Umbau",
    zeichne: (s) => {
      kette(s, { x: LM, y: 3.75, w: CW, dark: true });
      B.chip(s, "fiktiv", LM, 5.1);
    },
    notiz: {
      spricht: "Feyrouz",
      text: "Guten Tag! Wir sind Feyrouz und Houssam, ein studentisches Team, und das ist CircularFlow. Wir zeigen einen Fall aus dem Umbau: zwölf Bürotüren, die ausgebaut werden. Sechs davon könnte ein anderes Projekt brauchen. In unserem Fall hängt das weniger an der Tür als an einem Datum. Der Fall ist ausgedacht und mit veröffentlichten Quellen eingeordnet.",
    },
  });

  f.push({
    id: "A2", abschnitt: "Fall", layout: "INHALT", titel: "Eine Tür kann entsorgt werden, wenn die Planung zu spät vom Angebot erfährt",
    chips: ["fiktiv", "beispiel", "hypothese"], fuss: "Quelle: Fallakte §0, §2 (A3, A4, A15), §3; Rollen: Lösungsansatz des Teams",
    zeichne: (s) => {
      const P = B.getP(), q = 0.6, gp = 0.1, gg = 0.3;
      const gruppen = [[4, COL.gruenHell, COL.gruen, "4 intern"], [2, COL.hinwF, COL.hinwT, "2 offene Fragen"], [6, COL.gruen, COL.gruen, "6 Angebot"]];
      let x = LM;
      for (const [n, fill, line, lab] of gruppen) {
        for (let i = 0; i < n; i++) s.addShape(P.ShapeType.rect, { x: x + i * (q + gp), y: 2.2, w: q, h: q, fill: { color: fill }, line: { color: line, width: 1.5 } });
        T(s, lab, { x, y: 2.9, w: n * (q + gp) + 0.2, h: 0.3, fontSize: 14, bold: true });
        x += n * (q + gp) - gp + gg;
      }
      karte(s, 9.95, 2.2, 2.78, 1.3, { fill: COL.hinwF });
      T(s, [{ text: "Mögliche Betroffene (Hypothese)", options: { bold: true, breakLine: true } }, { text: "Planung, Bauleitung, Eigentümer", options: {} }],
        { x: 10.1, y: 2.3, w: 2.5, h: 1.1, fontSize: 14, color: COL.hinwT });
      karte(s, LM, 3.7, 5.6, 1.5, { fill: COL.gruenHell });
      T(s, [{ text: "Haus Lindenhof", options: { bold: true, fontSize: 20, breakLine: true } }, { text: "12 Türen = 4 intern + 2 offene Fragen + 6 Angebot", options: { fontSize: 16 } }],
        { x: LM + 0.25, y: 3.85, w: 5.1, h: 1.2, color: COL.gruen });
      s.addShape(P.ShapeType.rightArrow, { x: 6.35, y: 4.25, w: 0.6, h: 0.4, fill: { color: COL.tinte3 }, line: { color: COL.tinte3, width: 0.25 } });
      karte(s, 7.1, 3.7, 5.63, 1.5, { fill: COL.papier, line: COL.rahmen });
      T(s, [{ text: "Bedarf BD-24 · Umbau am Kanal", options: { bold: true, fontSize: 20, breakLine: true } }, { text: "6 Stk · Bestellfrist 19.02.2027", options: { fontSize: 16 } }],
        { x: 7.35, y: 3.85, w: 5.2, h: 1.2 });
      karte(s, LM, 5.4, CW, 0.9, { fill: COL.achtF });
      T(s, "Prüfbitte = Bitte an eine Fachperson, die Eignung zu prüfen · Mindestprüfzeit = 14 Tage (Annahme)",
        { x: LM + 0.25, y: 5.45, w: CW - 0.5, h: 0.8, fontSize: 16, color: COL.achtT, valign: "middle", bold: true });
    },
    notiz: {
      spricht: "Feyrouz",
      text: "Haus Lindenhof wird umgebaut, zwölf Türen kommen raus: vier für den eigenen Umbau, zwei mit offenen Fragen, sechs als Angebot. Das Projekt Umbau am Kanal braucht sechs Türen, muss aber bis zum 19. Februar 2027 Ersatz bestellen. Erfährt die Planung zu spät vom Angebot, wird neu gekauft, und die alten Türen können entsorgt werden, obwohl sie gepasst hätten. Bevor bestellt wird, muss eine Fachperson prüfen, ob die Türen passen. Die Bitte dazu heißt bei uns Prüfbitte. Wir nehmen an, die Prüfung dauert mindestens 14 Tage, das ist die Mindestprüfzeit. Wir vermuten: Betroffen sind Planung, Bauleitung und Eigentümer. Das ist eine Hypothese, kein Praxisbefund.",
    },
  });

  f.push({
    id: "A3", abschnitt: "Fall", layout: "INHALT", titel: "Der letzte Tag ist der 5. Februar, nicht der 19",
    chips: ["fiktiv", "simulation", [ "annahme", "Annahme, unbestätigt: 14 Tage Mindestprüfzeit" ]],
    fuss: "Quelle: Fallakte §1, §5 (Nachrechnung mit der Rechenregel der Vorschau, keine Praxisdaten)",
    zeichne: (s) => {
      zeitleisteFall(s, {
        bandY: 3.8, legendeY: 5.75,
        marken: [
          { d: 0, pos: "o", datum: "19.01.", text: "Angebot bekannt", w: 1.9 },
          { d: 17, pos: "u", datum: "05.02.", text: "letzter Tag für die Prüfbitte", w: 1.9, h: 1.2 },
          { d: 25, pos: "o", datum: "13.02.", text: "Bestellfrist erscheint unter „Zeitkritisch“ (Samstag, keine Benachrichtigung)", w: 2.0 },
          { d: 31, pos: "u", datum: "19.02.", text: "Bestellfrist", w: 1.7, h: 1.2 },
          { d: 34, pos: "o", datum: "22.02.", text: "Variante 2: Angebot erreicht die Planung zu spät", w: 1.6 },
          { d: 41, pos: "o", datum: "01.–05.03.", text: "Ausbau", w: 1.9 },
          { d: 48, pos: "u", rechts: true, datum: "08.03.", text: "Variante 1: Übergabe (Angebot rechtzeitig bei der Planung)", w: 2.3, h: 1.2 },
        ],
      });
    },
    notiz: {
      spricht: "Feyrouz",
      text: "Das Angebot wird am 19. Januar bekannt. Mit 14 Tagen Mindestprüfzeit ist der letzte Tag für die Prüfbitte der 5. Februar, nicht der 19. Ab dem 6. Februar lautet das Ergebnis: für diese Entscheidung zu spät. Zeitkritisch ist die Liste der Fristen der nächsten sieben Tage in der Übersicht. Die Bestellfrist erschiene dort erst ab dem 13. Februar, einem Samstag, ohne Benachrichtigung. Das ist eine Lücke in unserer Plattform. In Variante 1 erreicht das Angebot die Planung am 20. Januar, rechtzeitig. In Variante 2 erst am 22. Februar, dann ist der Ersatz schon bestellt. Alle Zeitpunkte sind nachgerechnet, nicht erlebt. Die 14 Tage sind eine Annahme.",
      min5: { art: "kurz", text: A3_KURZ }, min3: { art: "kurz", text: A3_KURZ },
    },
  });

  f.push(G.demoAnkuendigung({
    id: "A4", abschnitt: "Demo", titel: "Wir zeigen die Zeitprüfung live an Beispieldaten",
    zeile1: "Live-Demo · Fassung 2 · 6 Schritte · Beispieldaten",
    zeile3: "Der Türfall liegt nicht im Demo-Profil. Die Beispiele der Vorschau sind Systemtrennwände, nicht Türen.", fuss: "Quelle: Pitch-Ablauf; Doku Fassung 2 §11", spricht: "Houssam",
    text: "Jetzt zeigen wir die Zeitprüfung live in der Vorschau. Die Türen aus unserem Fall liegen dort nicht, wir nehmen die Beispieldaten der Vorschau. Die Zeitprüfung ist dieselbe. Die Beispiele der Vorschau sind Systemtrennwände, nicht Türen. Der Stichtag der Demo ist ein gewählter Zeitpunkt in der Simulation, nicht das heutige Datum. Es wird nichts versendet und niemand kontaktiert.",
    min5: { art: "kurz", text: A4_KURZ }, min3: { art: "weg", text: "entfällt, samt Demo und E1 bis E6." },
  }));
  f.push(...G.eFolien("A", "Demo", "A5"));

  f.push({
    id: "A5", abschnitt: "Nutzen und Test", layout: "INHALT", titel: "Die Plattform prüft die Zeit und nennt den nächsten Schritt",
    chips: ["hypothese", "hersteller"], fuss: FUSS_ABGRENZUNG,
    zeichne: (s) => {
      karte(s, LM, 2.15, 4.9, 3.35, { fill: COL.gruenHell });
      T(s, "Erwarteter Nutzen (Hypothese)", { x: LM + 0.25, y: 2.3, w: 4.4, h: 0.7, fontSize: 20, bold: true, color: COL.gruen });
      T(s, [
        { text: "Früh sehen, was frei wird", options: { bullet: true, breakLine: true } },
        { text: "Zeitprüfung mit Begründung in Tagen", options: { bullet: true, breakLine: true } },
        { text: "Nächster Schritt statt Freigabe", options: { bullet: true } },
      ], { x: LM + 0.25, y: 3.05, w: 4.4, h: 2.35, fontSize: 18, paraSpaceAfter: 10 });
      karte(s, 5.73, 2.15, 7.0, 3.35, { fill: COL.papier, line: COL.rahmen });
      T(s, "Abgrenzung", { x: 5.98, y: 2.28, w: 6.5, h: 0.4, fontSize: 20, bold: true, color: COL.gruen });
      T(s, [
        { text: "Andere Plattformen vermitteln Angebot und Gesuch:", options: { breakLine: true } },
        { text: "Concular Exchange (laut Anbieter)", options: { bullet: true, breakLine: true } },
        { text: "Madaster Match (laut Dokumentation)", options: { bullet: true, breakLine: true } },
        { text: "Unsere Frage dazu: Reicht die Zeit bis zur Bestellentscheidung für eine fachliche Prüfung? Ob andere Plattformen das abbilden, haben wir nicht geprüft.", options: { bold: true, breakLine: true } },
        { text: MADASTER, options: {} },
      ], { x: 5.98, y: 2.72, w: 6.5, h: 2.7, fontSize: 14, paraSpaceAfter: 4 });
      kette(s, { x: LM, y: 5.65, w: CW, mini: true });
    },
    notiz: {
      spricht: "Houssam",
      text: "Was bringt das? Wir erwarten: Die Planung sieht früh, was frei wird, bekommt die Zeitprüfung mit Begründung in Tagen und sieht den nächsten Schritt. Das ist eine Hypothese. Andere Plattformen vermitteln Angebot und Gesuch, Concular Exchange laut Anbieter, Madaster Match laut Dokumentation. Da gibt es eine Überschneidung. Unsere Frage dazu: Reicht die Zeit bis zur Bestellentscheidung für eine fachliche Prüfung? Ob andere Plattformen das abbilden, haben wir nicht geprüft. Bei Madaster nennt die Dokumentation, Stand 9. September 2026, keine Bestellfrist und keine Prüfzeit auf der Suchseite. Die Funktion selbst haben wir nicht bedient.",
      min5: { art: "kurz", text: A5_KURZ }, min3: { art: "kurz", text: A5_KURZ },
    },
  });

  f.push(G.geschaeftsmodell({ id: "A6", abschnitt: "Nutzen und Test" }));
  f.push(G.praxistestKurz({ id: "A7", abschnitt: "Nutzen und Test" }));

  f.push({
    id: "A8", abschnitt: "Schluss", layout: "SCHLUSS", titel: "Wir prüfen nicht nur Typ und Menge, sondern ob die Zeit für die Prüfung reicht",
    zeichne: (s) => {
      kette(s, { x: LM, y: 3.0, w: CW, dark: true, zustand: ["voll", "voll", "voll", "rand", "dampf", "dampf"], beschriftung: true });
      B.chipZeile(s, ["simulation", "beispiel", "fiktiv"], LM, 5.1);
    },
    notiz: {
      spricht: "Houssam",
      text: "Zusammengefasst: Wiederverwendung kann am Zeitpunkt scheitern, das ist unsere Hypothese. CircularFlow prüft, ob die Zeit für eine fachliche Prüfung reicht, und nennt den nächsten menschlichen Schritt. Heute ist das Simulation mit Beispieldaten. Als Nächstes brauchen wir einen echten Fall. Danke.",
    },
  });

  f.push(G.anhang({ id: "AX", abschnitt: "Anhang", hinweisFassung: "Fassung A: Umbaufall." }));
  return f;
}
module.exports = { folien };
