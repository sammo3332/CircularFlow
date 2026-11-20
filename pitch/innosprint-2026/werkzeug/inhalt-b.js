// Fassung B "Demo zuerst": B1, B2 (+E1-E6 versteckt), B3 Pilotfall, B4 Wertstatus, B5-B8, Anhang
const B = require("./bausteine");
const G = require("./inhalt-gemeinsam");
const { COL, LM, CW, T, karte, kette, zeitleisteFall, bildPassend, bildGroesse, papier } = B;

const B8_KURZ = "CircularFlow macht aus einem Paar einen prüfbaren nächsten Schritt: mit Zeitprüfung und ohne vorgetäuschte Freigabe. Heute ist das Simulation mit Beispieldaten. Fachleute prüfen, wir bereiten die Entscheidung vor. Als Nächstes brauchen wir einen echten Fall. Danke.";
const B2_KURZ = "Wir nehmen an, eine Prüfung dauert mindestens 14 Tage. Das nennen wir Mindestprüfzeit. Die Beispiele der Vorschau sind Systemtrennwände. Der Stichtag der Demo ist ein gewählter Zeitpunkt in der Simulation, nicht das heutige Datum. Ein Paar ist ein Angebot und ein Bedarf derselben Bauteilgruppe.";
const B1_ZUSATZ = "Wir nehmen an, eine Prüfung dauert mindestens 14 Tage. Das nennen wir Mindestprüfzeit. Ein Paar ist ein Angebot und ein Bedarf derselben Bauteilgruppe.";
const B5_KURZ = "Für wen? Unsere Hypothese: Planung und Bauleitung auf der Bedarfsseite, dazu Eigentümer, die ausbauen lassen. Der Nutzen, den wir erwarten: früh sehen, was frei wird, die Zeit mit Begründung prüfen und den nächsten Schritt kennen. Andere Plattformen vermitteln Angebot und Gesuch, Concular Exchange laut Anbieter, Madaster Match laut Dokumentation. Unsere Frage dazu: Reicht die Zeit bis zur Bestellentscheidung für eine fachliche Prüfung? Ob andere Plattformen das abbilden, haben wir nicht geprüft.";
const MADASTER = "Madaster: Die Dokumentation (Stand 09.09.2026) nennt keine Bestellfrist und keine Prüfzeit auf der Suchseite. Die Funktion selbst haben wir nicht bedient.";
const FUSS_ABGRENZUNG = "Concular Exchange: laut Anbieter, Stand 08.11.2026, nicht erneut geprüft. Madaster Match: laut Dokumentation, zuletzt bearbeitet 09.09.2026. Quelle: Produktbrief v0.2; Lösungsansatz des Teams; Rechercheplan des Teams; Fallakte CF-PILOT-01 §6";
const BILDUNTERSCHRIFT = "Bildschirmfoto aus einem eigenen Profil mit den fiktiven Pilotdaten, nicht aus der Live-Demo";

function folien() {
  const f = [];

  f.push({
    id: "B1", abschnitt: "Einstieg", layout: "TITEL", titel: "Reicht die Zeit für eine Prüfung? Wir zeigen es zuerst",
    untertitel: "CircularFlow · Live-Vorschau mit Beispieldaten",
    zeichne: (s) => {
      kette(s, { x: LM, y: 3.75, w: CW, dark: true });
      B.chipZeile(s, ["beispiel", "simulation"], LM, 5.1);
    },
    notiz: {
      spricht: "Houssam",
      text: "Bauteile aus einem Umbau oder Rückbau könnten anderswo gebraucht werden. Erfährt die Planung zu spät von einem Angebot, wird neu bestellt, und passende Bauteile können entsorgt werden. Die Frage, die wir uns stellen: Reicht die Zeit bis zur Bestellentscheidung, damit eine Fachperson noch prüfen kann? Eine Prüfbitte ist die Bitte an eine Fachperson, die Eignung zu prüfen. Wir sind Houssam und Feyrouz, ein studentisches Team, und das ist CircularFlow. Statt lange zu erklären, zeigen wir es gleich. Alle Daten in der Vorschau sind Beispieldaten.",
      min3: { art: "zusatz", text: B1_ZUSATZ },
    },
  });

  f.push(G.demoAnkuendigung({
    id: "B2", abschnitt: "Demo", titel: "Wir starten in der Übersicht der Vorschau",
    zeile1: "Live-Demo · 6 Schritte · Beispieldaten",
    zeile3: "Die Beispiele der Vorschau sind Systemtrennwände.",
    fuss: "Quelle: Pitch-Ablauf", spricht: "Houssam",
    text: "Wir starten in der Übersicht der Vorschau und gehen sechs Schritte. Wir nehmen an, eine Prüfung dauert mindestens 14 Tage. Das nennen wir Mindestprüfzeit. Am Ende steht kein Verkaufsabschluss, sondern der nächste menschliche Schritt. Die Beispiele der Vorschau sind Systemtrennwände. Der Stichtag der Demo ist ein gewählter Zeitpunkt in der Simulation, nicht das heutige Datum. Es wird nichts versendet.",
    min5: { art: "kurz", text: B2_KURZ },
    min3: { art: "weg", text: "entfällt samt Demo; stattdessen E3 und E4 als zwei sichtbare Bildfolien zeigen (Kopien der Demo-Folien, sichtbar gestellt, je etwa 30 Sekunden)." },
  }));
  f.push(...G.eFolien("B", "Demo", "B3"));

  f.push({
    id: "B3", abschnitt: "Pilotfall und Vertrauen", layout: "INHALT", titel: "Im Pilotfall hängt alles am 5. Februar",
    chips: ["fiktiv", "simulation", ["annahme", "Annahme, unbestätigt: 14 Tage Mindestprüfzeit"]],
    fuss: "Quelle: Fallakte CF-PILOT-01 §5 (Nachrechnung mit der Rechenregel der Vorschau, keine Praxisdaten)",
    zeichne: (s) => {
      zeitleisteFall(s, {
        bandY: 3.7, legendeY: 5.42,
        marken: [
          { d: 0, pos: "o", datum: "19.01.", text: "Angebot bekannt", w: 2.0, h: 1.1 },
          { d: 17, pos: "u", datum: "05.02.", text: "letzter Tag für die Prüfbitte", w: 2.0, h: 1.1 },
          { d: 25, pos: "o", datum: "13.02.", text: "Bestellfrist erscheint unter „Zeitkritisch“ (Samstag, keine Benachrichtigung)", w: 2.1, h: 1.3 },
          { d: 31, pos: "u", datum: "19.02.", text: "Bestellfrist", w: 1.7, h: 1.1 },
          { d: 34, pos: "o", datum: "22.02.", text: "Variante 2: Angebot erreicht die Planung zu spät", w: 1.75, h: 1.1 },
          { d: 48, pos: "u", rechts: true, datum: "08.03.", text: "Variante 1: Übergabe (Angebot rechtzeitig bei der Planung)", w: 2.3, h: 1.1 },
        ],
      });
      karte(s, LM, 6.12, CW, 0.4, { fill: COL.achtF });
      T(s, "Prüfbitte = Bitte an eine Fachperson, die Eignung zu prüfen · Mindestprüfzeit = 14 Tage (Annahme)",
        { x: LM + 0.2, y: 6.12, w: CW - 0.4, h: 0.4, fontSize: 14, color: COL.achtT, valign: "middle", bold: true });
    },
    notiz: {
      spricht: "Feyrouz",
      text: "Warum die Zeit so wichtig ist, zeigt unser fiktiver Fall. Unser Fall spielt mit Türen, nicht mit Systemtrennwänden. Die Zeitprüfung ist dieselbe. Zwölf Türen aus Haus Lindenhof, sechs für den Umbau am Kanal. Das Angebot wird am 19. Januar bekannt, die Bestellfrist ist der 19. Februar. Mit 14 Tagen Prüfzeit ist der letzte Tag für die Prüfbitte der 5. Februar. Die Zeitpunkte sind mit derselben Rechenregel der Vorschau nachgerechnet. Zeitkritisch ist die Liste der Fristen der nächsten sieben Tage in der Übersicht. In Variante 1 erreicht das Angebot die Planung am 20. Januar, rechtzeitig. In Variante 2 erst am 22. Februar. Die 14 Tage sind eine Annahme, die ein echter Fall bestätigen müsste.",
      min5: { art: "voll" }, min3: { art: "weg" },
    },
  });

  f.push({
    id: "B4", abschnitt: "Pilotfall und Vertrauen", layout: "BILD", titel: "Ein Scan liefert Vorschläge, für die Türregel zählt nur Gemessenes",
    chips: ["fiktiv", "simulation"], fuss: "Quelle: Fallakte CF-PILOT-01 §4 Schritt 3, §8",
    zeichne: (s) => {
      const zeilen = [
        ["Türblattbreite 860 mm", "gemessen", COL.okT],
        ["Türblatthöhe 1985 mm", "bestätigt", COL.hinwT],
        ["Türblatt Holzwerkstoff", "vorgeschlagen", COL.simT],
        ["Scan: Öffnung B-04, 884 mm", "vorgeschlagen", COL.simT],
      ];
      zeilen.forEach(([a, st, c], i) => {
        T(s, [{ text: a, options: { fontSize: 14, color: COL.tinte, breakLine: true } }, { text: st, options: { fontSize: 16, bold: true, color: c } }],
          { x: LM, y: 2.2 + i * 0.78, w: 3.2, h: 0.7 });
      });
      karte(s, LM, 5.4, 3.2, 1.0, { fill: COL.gruenHell });
      T(s, "Für die Türregel zählt nur, was gemessen ist.", { x: LM + 0.15, y: 5.45, w: 2.9, h: 0.9, fontSize: 16, bold: true, color: COL.gruen, valign: "middle" });
      // Bild 1
      B.chip(s, "fiktiv", 4.0, 2.15);
      const g1 = bildGroesse("pilot-pass-angaben.jpg", 4.6, 3.1);
      papier(s, 4.0, 2.6, g1.w + 0.16, g1.h + 0.16);
      bildPassend(s, "pilot-pass-angaben.jpg", 4.08, 2.68, 4.6, 3.1, "Bildschirmfoto der Tabelle Angaben mit Wert, Status und Quelle: Türblattbreite 860 mm gemessen, Türblatthöhe 1985 mm bestätigt, Türblatt Holzwerkstoff vorgeschlagen (fiktiver Pilotfall)");
      T(s, BILDUNTERSCHRIFT, { x: 4.0, y: 5.95, w: 4.75, h: 0.5, fontSize: 14, color: COL.tinte2 });
      // Bild 2
      B.chip(s, "fiktiv", 8.95, 2.15);
      const g2 = bildGroesse("pilot-scan-karte.jpg", 3.6, 2.6);
      papier(s, 8.95, 2.6, g2.w + 0.16, g2.h + 0.16);
      bildPassend(s, "pilot-scan-karte.jpg", 9.03, 2.68, 3.6, 2.6, "Bildschirmfoto der Karte Raumscan: Beispielscan Raum 2.05, Öffnung B-04 Breite 884 mm vorgeschlagen (Simulation, fiktiver Pilotfall)");
      T(s, "Simulation. " + BILDUNTERSCHRIFT, { x: 8.95, y: 5.5, w: 3.78, h: 0.95, fontSize: 14, color: COL.tinte2 });
    },
    notiz: {
      spricht: "Houssam",
      text: "Noch ein Beispiel aus unserem fiktiven Türfall. Die Plattform trennt gemessen, bestätigt und vorgeschlagen. Die Türblattbreite von 860 Millimetern ist gemessen. Die Höhe ist bestätigt, aber nicht gemessen. Das Material ist nur vorgeschlagen. Ein simulierter Raumscan liefert 884 Millimeter, ebenfalls nur vorgeschlagen. Für die Türregel zählt nur, was gemessen ist. Fachlich bestätigt gibt es als Status nicht. Das Fachergebnis ist ein Eintrag.",
      min5: { art: "weg" }, min3: { art: "weg" },
    },
  });

  f.push({
    id: "B5", abschnitt: "Nutzen und Test", layout: "INHALT", titel: "Für wen und was anders: die Zeitfrage vor der Bestellentscheidung",
    chips: ["hypothese", "hersteller"], fuss: FUSS_ABGRENZUNG,
    zeichne: (s) => {
      const ws = [3.25, 3.25, 5.2], g = 0.215, y = 2.15, h = 4.1;
      const k = [
        ["Wer (Hypothese)", [["Planung und Bauleitung auf der Bedarfsseite, dazu Eigentümer, die ausbauen lassen.", {}]], COL.hinwF],
        ["Nutzen (erwartet)", [["Früh sehen, was frei wird", { bullet: true }], ["Zeit mit Begründung prüfen", { bullet: true }], ["Nächsten Schritt kennen", { bullet: true }]], COL.gruenHell],
        ["Anders als", [["Andere Plattformen vermitteln Angebot und Gesuch: Concular Exchange (laut Anbieter), Madaster Match (laut Dokumentation).", {}], ["Unsere Frage dazu: Reicht die Zeit bis zur Bestellentscheidung für eine fachliche Prüfung? Ob andere Plattformen das abbilden, haben wir nicht geprüft.", { bold: true }], [MADASTER, {}]], COL.papier],
      ];
      k.forEach(([kopf, absaetze, fill], i) => {
        const w = ws[i], x = LM + ws.slice(0, i).reduce((a, b) => a + b + g, 0);
        karte(s, x, y, w, h, { fill, line: fill === COL.papier ? COL.rahmen : fill });
        T(s, kopf, { x: x + 0.25, y: y + 0.2, w: w - 0.5, h: 0.4, fontSize: 20, bold: true, color: COL.gruen });
        const runs = absaetze.map(([t, o], j) => ({ text: t, options: Object.assign({}, o, { breakLine: j < absaetze.length - 1 }) }));
        T(s, runs, { x: x + 0.25, y: y + 0.75, w: w - 0.5, h: h - 0.9, fontSize: i === 2 ? 14 : 20, paraSpaceAfter: 10 });
      });
    },
    notiz: {
      spricht: "Feyrouz",
      text: "Für wen? Unsere Hypothese: Planung und Bauleitung auf der Bedarfsseite, dazu Eigentümer, die ausbauen lassen. Der Nutzen, den wir erwarten: früh sehen, was frei wird, die Zeit mit Begründung prüfen und den nächsten Schritt kennen. Andere Plattformen vermitteln Angebot und Gesuch, Concular Exchange laut Anbieter, Madaster Match laut Dokumentation. Da gibt es eine Überschneidung. Unsere Frage dazu: Reicht die Zeit bis zur Bestellentscheidung für eine fachliche Prüfung? Ob andere Plattformen das abbilden, haben wir nicht geprüft. Bei Madaster nennt die Dokumentation, Stand 9. September 2026, keine Bestellfrist und keine Prüfzeit auf der Suchseite. Die Funktion selbst haben wir nicht bedient.",
      min3: { art: "kurz", text: B5_KURZ },
    },
  });

  f.push(G.geschaeftsmodell({ id: "B6", abschnitt: "Nutzen und Test" }));
  f.push(G.praxistestKurz({ id: "B7", abschnitt: "Nutzen und Test" }));

  f.push({
    id: "B8", abschnitt: "Schluss", layout: "SCHLUSS", titel: "Wir prüfen nicht nur Typ und Menge, sondern ob die Zeit für die Prüfung reicht",
    zeichne: (s) => {
      kette(s, { x: LM, y: 3.0, w: CW, dark: true, zustand: ["voll", "voll", "voll", "rand", "dampf", "dampf"], beschriftung: true });
      B.chipZeile(s, ["simulation", "beispiel", "fiktiv"], LM, 5.1);
    },
    notiz: {
      spricht: "Houssam",
      text: "CircularFlow macht aus einem Paar einen prüfbaren nächsten Schritt: mit Zeitprüfung, mit Status je Wert und ohne vorgetäuschte Freigabe. Heute ist das Simulation mit Beispieldaten. Fachleute prüfen, wir bereiten die Entscheidung vor. Als Nächstes brauchen wir einen echten Fall. Danke.",
      min5: { art: "kurz", text: B8_KURZ }, min3: { art: "kurz", text: B8_KURZ },
    },
  });

  f.push(G.anhang({ id: "AX", abschnitt: "Anhang", hinweisFassung: "Fassung B: Demo zuerst." }));
  return f;
}
module.exports = { folien };
