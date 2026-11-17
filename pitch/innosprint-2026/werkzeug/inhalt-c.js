// Fassung C "Praxistest Dortmund": C1-C9, Anhang mit E1-E6 (versteckt), Anhang Quellen
const B = require("./bausteine");
const G = require("./inhalt-gemeinsam");
const { COL, LM, CW, T, karte, zeit4, bildAusschnitt, bildGroesse, papier } = B;

const FUSS_ABGRENZUNG = "Concular Exchange: laut Anbieter, Stand 08.11.2026, nicht erneut geprüft. Madaster Match: laut Dokumentation, zuletzt bearbeitet 09.09.2026. Quelle: PB; LA; RP; FA §6";

function folien() {
  const f = [];

  f.push({
    id: "C1", abschnitt: "Einstieg", layout: "TITEL", titel: "Wir suchen einen Fall in Dortmund",
    untertitel: "CircularFlow · vier Zeitpunkte, eine Frage",
    zeichne: (s) => { zeit4(s, { x: LM, y: 3.6, w: CW, dark: true }); },
    notiz: {
      spricht: "Feyrouz",
      text: "Wir sind Feyrouz und Houssam, ein studentisches Team, und das ist CircularFlow. Wir haben eine Idee, eine Simulation und eine Frage. Die Frage lautet: Wann erfährt die zuständige Person, dass ein Bauteil frei wird, und reicht die Zeit bis zur Entscheidung? Dafür suchen wir heute einen echten Fall in Dortmund.",
    },
  });

  f.push({
    id: "C2", abschnitt: "Frage", layout: "INHALT", titel: "Zwei Fristen könnten entscheiden, ob ein Bauteil weitergegeben wird",
    chips: ["hypothese", "hersteller"], fuss: "Quelle: FA §6 (Concular Handlungsempfehlung, Dezember 2024, PDF-S. 38; BLB NRW, 02.12.2024)",
    zeichne: (s) => {
      karte(s, LM, 2.15, 4.2, 2.85, { fill: COL.gruenHell });
      T(s, "Bedarfsseite", { x: LM + 0.25, y: 2.3, w: 3.7, h: 0.4, fontSize: 20, bold: true, color: COL.gruen });
      T(s, "Bis zur Bestellfrist muss Ersatz bestellt werden.", { x: LM + 0.25, y: 2.9, w: 3.7, h: 1.5, fontSize: 18 });
      karte(s, 5.0, 2.15, 7.73, 2.85, { fill: COL.papier, line: COL.rahmen });
      T(s, "Angebotsseite", { x: 5.25, y: 2.3, w: 7.2, h: 0.4, fontSize: 20, bold: true, color: COL.gruen });
      T(s, "Concular empfiehlt für Rückbauprojekte der öffentlichen Hand, eine Frist zu vereinbaren, bis zu der Bauprodukte verkauft werden können, in der Regel bis kurz vor der Ausschreibung des Rückbaus.", { x: 5.25, y: 2.8, w: 7.2, h: 1.1, fontSize: 16 });
      T(s, [
        { text: "Quelle: Handlungsempfehlung, Dezember 2024, PDF-Seite 38", options: { fontSize: 14, color: COL.tinte2, breakLine: true } },
        { text: "Die Empfehlung betrifft Rückbau, unser Fall ist ein Umbau.", options: { fontSize: 14, bold: true } },
      ], { x: 5.25, y: 4.0, w: 7.2, h: 0.9 });
      karte(s, LM, 5.15, CW, 1.25, { fill: COL.weiss, line: COL.linie });
      T(s, [
        { text: "Dortmunder Beispiel, BLB NRW, 02.12.2024: erst ausbauen, dann abbrechen", options: { bold: true, fontSize: 16, breakLine: true } },
        { text: "„Rückbau erst, nachdem alle demontierbaren Baustoffe vollständig ausgebaut wurden“ (UB TU Dortmund)", options: { fontSize: 14, color: COL.tinte2 } },
      ], { x: LM + 0.25, y: 5.25, w: CW - 0.5, h: 1.05, valign: "middle" });
    },
    notiz: {
      spricht: "Feyrouz",
      text: "Zwei Fristen könnten über die Weitergabe eines Bauteils entscheiden. Wer ein Bauteil braucht, muss bis zu einem Tag Ersatz bestellen. Concular empfiehlt für Rückbauprojekte der öffentlichen Hand, eine Frist zu vereinbaren, bis zu der Bauprodukte verkauft werden können, in der Regel bis kurz vor der Ausschreibung des Rückbaus. Die Empfehlung betrifft Rückbau, unser Fall ist ein Umbau. In Dortmund wurde bei der Universitätsbibliothek erst ausgebaut und dann abgebrochen, das schreibt der BLB NRW. Ob und wo es knapp wird, wissen wir nicht. Unsere Vermutung: Das Wissen darüber kommt oft spät.",
      min5: "entfällt.", min3: "entfällt.",
    },
  });

  f.push({
    id: "C3", abschnitt: "Frage", layout: "INHALT", titel: "Wir fragen nach vier Zeitpunkten",
    chips: ["hypothese"], fuss: "Quelle: RP",
    zeichne: (s) => {
      s.addText("Reicht die Zeit für eine Prüfung?", {
        shape: B.getP().ShapeType.roundRect, rectRadius: 0.08, x: 3.4, y: 2.25, w: 4.0, h: 0.5,
        fill: { color: COL.hinwF }, line: { color: COL.hinwF, width: 0.5 },
        fontFace: B.FONT, fontSize: 16, bold: true, color: COL.hinwT, align: "center", valign: "middle", margin: 0.02, fit: "none",
      });
      zeit4(s, {
        x: LM, y: 3.0, w: CW,
        fragen: ["Wann wurde das Angebot bekannt?", "Wann erreichte es die zuständige Person?", "Bis wann musste sie entscheiden?", "Wann war die Übergabe möglich?"],
      });
      karte(s, LM, 5.35, CW, 0.9, { fill: COL.achtF });
      T(s, "Prüfbitte = Bitte an eine Fachperson, die Eignung zu prüfen · Mindestprüfzeit = 14 Tage (Annahme)",
        { x: LM + 0.25, y: 5.4, w: CW - 0.5, h: 0.8, fontSize: 16, color: COL.achtT, valign: "middle", bold: true });
    },
    notiz: {
      spricht: "Feyrouz",
      text: "Statt Bauchgefühl wollen wir vier Zeitpunkte getrennt erfassen. Erstens: Wann wurde das Angebot auf der abgebenden Seite bekannt? Zweitens: Wann erreichte es die zuständige Person? Drittens: Bis wann musste diese Person entscheiden? Viertens: Wann war die Übergabe möglich? Bleibt zwischen dem zweiten und dritten Zeitpunkt weniger Zeit, als eine Prüfung braucht, kommt das Angebot zu spät. Dafür muss vor der Bestellung eine Fachperson prüfen, ob das Bauteil passt. Die Bitte dazu heißt bei uns Prüfbitte. Wir nehmen an, die Prüfung dauert mindestens 14 Tage, das ist die Mindestprüfzeit. Das ist unsere Arbeitsannahme.",
    },
  });

  f.push({
    id: "C4", abschnitt: "Frage", layout: "INHALT", titel: "Im fiktiven Fall lagen die vier Zeitpunkte so",
    chips: ["fiktiv", "simulation", ["annahme", "Annahme, unbestätigt: 14 Tage Mindestprüfzeit"]], fuss: "Quelle: FA §5 (Nachrechnung mit dem Fachkern, keine Praxisdaten)",
    zeichne: (s) => {
      const kopf = (t) => ({ text: t, options: { bold: true, color: COL.weiss, fill: { color: COL.gruen } } });
      const zk = (t) => ({ text: t, options: { bold: true, fill: { color: COL.gruenHell } } });
      const rows = [
        [kopf("Zeitpunkt"), kopf("Variante 1: rechtzeitig"), kopf("Variante 2: nach der Ersatzbestellung")],
        [zk("Angebot bekannt"), "19.01.2027", "19.01.2027"],
        [zk("erreicht die Planung"), "20.01.2027", "22.02.2027"],
        [zk("entscheiden bis"), "19.02.2027 (Prüfbitte spätestens 05.02.2027)", "19.02.2027 (Prüfbitte spätestens 05.02.2027)"],
        [zk("Übergabe möglich"), "08.03.2027, 6 Stk", { text: "für BD-24 keine", options: { color: COL.spaetT, bold: true, fill: { color: COL.spaetF } } }],
      ];
      s.addTable(rows, {
        x: LM, y: 2.25, w: CW, colW: [2.9, 4.6, 4.63], rowH: [0.5, 0.62, 0.62, 0.85, 0.62],
        fontFace: B.FONT, fontSize: 16, color: COL.tinte, valign: "middle", margin: [0.05, 0.15, 0.05, 0.15],
        border: { type: "solid", color: COL.linie, pt: 0.75 },
      });
      T(s, "Haus Lindenhof, 12 Türen; Bedarf BD-24 mit 6 Stk. Alle Zeitpunkte sind simuliert.", { x: LM, y: 5.7, w: CW, h: 0.4, fontSize: 16, color: COL.tinte2 });
    },
    notiz: {
      spricht: "Feyrouz",
      text: "Unser fiktiver Fall mit zwölf Türen aus Haus Lindenhof zeigt das. Variante eins: Das Angebot wird am 19. Januar bekannt und erreicht die Planung am 20. Januar. Entscheiden muss sie bis zum 19. Februar, die Übergabe ginge am 8. März. Variante zwei: Es erreicht sie erst am 22. Februar. Dann ist die Ersatzbestellung raus, und für diesen Bedarf gibt es keine Übergabe. Mit 14 Tagen Prüfzeit war der letzte Tag der 5. Februar. Alles ist simuliert.",
      min5: "bleibt.", min3: "entfällt.",
    },
  });

  f.push({
    id: "C5", abschnitt: "Plattform", layout: "BILD", titel: "Die Plattform prüft die Zeit und nennt den nächsten Schritt",
    chips: ["beispiel", "simulation", "vorschlag"], fuss: "Quelle: PA; Bildschirmfotos aus Fassung 2 (Code 2121b92), Stichtag der Demo Mi 18.11.2026, 14:00 (Simulation)",
    zeichne: (s) => {
      const zellen = [
        ["k2-paarliste.jpg", { x: 0.19, y: 0.165, w: 0.61, h: 0.21 }, "8 Paare, 2 prüfbar", "K2 · Paare derselben Gruppe", "Bildschirmfoto der Paarliste: 8 Paare derselben Gruppe, davon 2 prüfbar, Filter nach Ergebnis (Beispieldaten)"],
        ["k3-zu-spaet.jpg", { x: 0.19, y: 0.33, w: 0.47, h: 0.34 }, "Zu spät: 5 Tage nach der Bestellfrist", "K3 · TW-01 → BD-23", "Ausschnitt des Abgleichs TW-01 und BD-23: Für diese Entscheidung zu spät, Prüfbitte gesperrt (Beispieldaten)"],
        ["k4-weiter-pruefen.jpg", { x: 0.19, y: 0.31, w: 0.47, h: 0.365 }, "Weiter prüfen: 123 Tage davor", "K4 · TW-05 → BD-22", "Ausschnitt des Abgleichs TW-05 und BD-22: Weiter prüfen, Prüfende 123 Tage vor der Bestellfrist (Beispieldaten)"],
        ["k6-vormerkung-anlegen.jpg", { x: 0.19, y: 0.27, w: 0.485, h: 0.355 }, "Nächster Schritt: Vormerkung anlegen", "K6 · TW-05 → BD-22", "Ausschnitt: Kasten Nächster fachlicher Schritt, Vormerkung anlegen, laut Eintrag in der Simulation (Beispieldaten)"],
      ];
      zellen.forEach(([bild, fr, kopf, schritt, alt], i) => {
        const x = LM + (i % 2) * 6.2, y = 2.15 + Math.floor(i / 2) * 2.2, h = 2.0;
        karte(s, x, y, 5.93, h, { fill: COL.weiss, line: COL.rahmen });
        papier(s, x + 0.1, y + 0.1, 3.5, h - 0.2);
        bildAusschnitt(s, bild, fr, x + 0.17, y + 0.17, 3.36, h - 0.34, alt);
        B.chip(s, "beispiel", x + 3.75, y + 0.1);
        T(s, kopf, { x: x + 3.75, y: y + 0.58, w: 2.05, h: 0.9, fontSize: 16, bold: true });
        T(s, schritt, { x: x + 3.75, y: y + 1.55, w: 2.05, h: 0.35, fontSize: 14, color: COL.tinte2 });
      });
    },
    notiz: {
      spricht: "Houssam",
      text: "So sieht die Prüfung in unserer Vorschau aus, hier als Bildschirmfotos mit Beispieldaten. Oben links die Liste: acht Paare, zwei prüfbar. Oben rechts ein Paar, das zu spät ist: Prüfende fünf Tage nach der Bestellfrist, Prüfbitte gesperrt, der Grund steht daneben. Unten links ein Paar, das passt: weiter prüfen. Unten rechts der nächste Schritt: Vormerkung anlegen, laut Eintrag in der Simulation. Das ist ein Vorschlag zur Prüfung, keine Freigabe. Das Fachergebnis ist ein Eintrag in der Simulation. Die Vorschau zeigen wir auf Nachfrage gern im Anschluss.",
    },
  });

  f.push({
    id: "C6", abschnitt: "Plattform", layout: "INHALT", titel: "Zielgruppe und Abgrenzung: eine Rollenannahme, kein Praxisbefund",
    chips: ["hypothese", "hersteller"], fuss: FUSS_ABGRENZUNG,
    zeichne: (s) => {
      karte(s, LM, 2.15, 5.9, 4.1, { fill: COL.hinwF });
      T(s, "Wer hat das Problem?", { x: LM + 0.25, y: 2.3, w: 5.4, h: 0.4, fontSize: 20, bold: true, color: COL.hinwT });
      T(s, [
        { text: "Unsere Hypothese: Planung und Bauleitung auf der Bedarfsseite", options: { bullet: true, breakLine: true } },
        { text: "Eigentümer und Einrichtungen auf der Angebotsseite", options: { bullet: true, breakLine: true } },
        { text: "Das ist eine Rollenannahme, kein Praxisbefund.", options: { bold: true } },
      ], { x: LM + 0.25, y: 2.9, w: 5.4, h: 3.2, fontSize: 18, paraSpaceAfter: 12 });
      karte(s, 6.83, 2.15, 5.9, 4.1, { fill: COL.papier, line: COL.rahmen });
      T(s, "Was gibt es schon?", { x: 7.08, y: 2.3, w: 5.4, h: 0.4, fontSize: 20, bold: true, color: COL.gruen });
      T(s, [
        { text: "Andere Plattformen vermitteln Angebot und Gesuch:", options: { breakLine: true } },
        { text: "Concular Exchange (laut Anbieter)", options: { bullet: true, breakLine: true } },
        { text: "Madaster Match (laut Dokumentation)", options: { bullet: true, breakLine: true } },
        { text: "Unsere Frage dazu: Reicht die Zeit bis zur Bestellentscheidung für eine fachliche Prüfung? Ob andere Plattformen das abbilden, haben wir nicht geprüft.", options: { bold: true } },
      ], { x: 7.08, y: 2.9, w: 5.4, h: 3.2, fontSize: 16, paraSpaceAfter: 8 });
    },
    notiz: {
      spricht: "Feyrouz",
      text: "Wer hat das Problem? Unsere Hypothese: Planung und Bauleitung auf der Bedarfsseite, dazu Eigentümer und Einrichtungen, die ausbauen lassen. Das ist eine Rollenannahme, kein Praxisbefund. Andere Plattformen vermitteln Angebot und Gesuch, Concular Exchange laut Anbieter, Madaster Match laut Dokumentation. Da gibt es eine Überschneidung. Unsere Frage dazu: Reicht die Zeit bis zur Bestellentscheidung für eine fachliche Prüfung? Ob andere Plattformen das abbilden, haben wir nicht geprüft. Ob das im Alltag fehlt, ist offen.",
      min5: "bleibt.", min3: "entfällt.",
    },
  });

  f.push(G.geschaeftsmodell({ id: "C7", abschnitt: "Nutzen und Test" }));

  f.push({
    id: "C8", abschnitt: "Nutzen und Test", layout: "INHALT", titel: "Der Praxistest in Dortmund ist klein und hat ein beobachtbares Signal",
    chips: [["annahme", "Annahme, unbestätigt: 14 Tage"], "vorschlagTest"], fuss: "Quelle: RP; FA §11",
    zeichne: (s) => {
      const w = 2.6, g = 0.25, y = 2.15, h = 2.4;
      const k = [
        ["1 · Fall rekonstruieren", "Einen Fall mit einer zuständigen Person entlang der vier Zeitpunkte rekonstruieren."],
        ["2 · Prüfzeit klären", "Mindestprüfzeit klären: bestätigt oder ersetzt sie die 14 Tage?"],
        ["3 · Karte zeigen", "Angebotskarte zuerst ohne Erklärung zeigen. Frage: „Welchen nächsten Schritt wählen Sie, und warum?“"],
      ];
      k.forEach(([kopf, txt], i) => {
        const x = LM + i * (w + g);
        karte(s, x, y, w, h, { fill: COL.gruenHell });
        T(s, kopf, { x: x + 0.15, y: y + 0.15, w: w - 0.3, h: 0.35, fontSize: 16, bold: true, color: COL.gruen });
        T(s, txt, { x: x + 0.15, y: y + 0.6, w: w - 0.3, h: h - 0.7, fontSize: 14 });
        if (i < 2) s.addShape(B.getP().ShapeType.rightArrow, { x: x + w + 0.02, y: y + h / 2 - 0.15, w: g - 0.04, h: 0.3, fill: { color: COL.tinte3 }, line: { color: COL.tinte3, width: 0.25 } });
      });
      karte(s, 9.1, y, 3.63, h, { fill: COL.okF });
      T(s, "Signal", { x: 9.3, y: y + 0.15, w: 3.2, h: 0.35, fontSize: 20, bold: true, color: COL.okT });
      T(s, "Ein konkreter, vor der Frist machbarer Schritt und eine plausible Quelle für die frühere Information.", { x: 9.3, y: y + 0.65, w: 3.25, h: 1.65, fontSize: 16 });
      zeit4(s, { x: LM, y: 4.8, w: 8.3 + 0.0, hervor: null });
      karte(s, 9.1, 4.8, 3.63, 1.5, { fill: COL.papier, line: COL.rahmen });
      T(s, [{ text: "Grenze", options: { bold: true, fontSize: 16, color: COL.gruen, breakLine: true } }, { text: "Ein Einzelfall belegt weder Markt noch Wirkung.", options: { fontSize: 16 } }], { x: 9.3, y: 4.95, w: 3.25, h: 1.25 });
    },
    notiz: {
      spricht: "Houssam",
      text: "Unser kleinster Test: Mit einer zuständigen Person rekonstruieren wir einen echten Fall entlang der vier Zeitpunkte und klären die Mindestprüfzeit. Dann zeigen wir eine Angebotskarte, zunächst ohne Erklärung, und fragen: Welchen nächsten Schritt würden Sie wählen, und warum? Ein gutes Signal wäre ein konkreter Schritt, der vor der Frist machbar war, und eine plausible Quelle für die frühere Information. Ein Einzelfall belegt weder einen Markt noch die Wirkung einer Software.",
    },
  });

  f.push({
    id: "C9", abschnitt: "Schluss", layout: "SCHLUSS", titel: "Wer einen Fall kennt, an dem Bauteile vor dem Umbau frei wurden, hilft uns am meisten",
    zeichne: (s) => {
      T(s, "Wir können die vier Fragen gemeinsam durchgehen. Sprechen Sie uns nach dem Pitch an.", { x: LM, y: 2.65, w: CW, h: 0.45, fontSize: 20, color: COL.gruenHell });
      zeit4(s, { x: LM, y: 3.45, w: CW, dark: true, hervor: 0 });
      B.chipZeile(s, ["simulation", "beispiel", "fiktiv"], LM, 5.15);
    },
    notiz: {
      spricht: "Feyrouz",
      text: "Unsere Bitte: Wenn Sie in Planung, Bauleitung oder bei einem Eigentümer einen Fall kennen, bei dem Türen, Wände oder Böden vor einem Umbau frei wurden, sprechen Sie uns nach dem Pitch an. Wir können die vier Fragen gemeinsam durchgehen. Für den nächsten Schritt suchen wir einen echten Fall. Wir haben bisher eine Simulation und eine klare Frage. Schlusssatz (Houssam): Danke.",
    },
  });

  f.push(...G.eFolien("C", "Anhang", "C9"));
  f.push(G.anhang({ id: "AX", abschnitt: "Anhang", hinweisFassung: "Fassung C: Praxistest Dortmund. E1 bis E6 liegen als versteckter Anhang vor dieser Folie und werden nur auf Nachfrage in der Fragerunde gezeigt." }));
  return f;
}
module.exports = { folien };
