// Fassung C "Praxistest Dortmund": C1-C9, Anhang mit E1-E6 (versteckt), Anhang Quellen
const B = require("./bausteine");
const G = require("./inhalt-gemeinsam");
const { COL, LM, CW, T, karte, zeit4, bildAusschnitt, bildGroesse, papier } = B;

const MADASTER = "Madaster: Die Dokumentation (Stand 09.09.2026) nennt keine Bestellfrist und keine Prüfzeit auf der Suchseite. Die Funktion selbst haben wir nicht bedient.";
const FUSS_ABGRENZUNG = "Concular Exchange: laut Anbieter, Stand 08.11.2026, nicht erneut geprüft. Madaster Match: laut Dokumentation, zuletzt bearbeitet 09.09.2026. Quelle: Produktbrief v0.2; Lösungsansatz des Teams; Rechercheplan des Teams; Fallakte CF-PILOT-01 §6";

const C5_KURZ = "So sieht die Prüfung in unserer Vorschau aus, hier als zwei große Ausschnitte von Bildschirmfotos mit Beispieldaten. Ein Paar ist ein Angebot und ein Bedarf derselben Bauteilgruppe. Links ein Paar, das zu spät ist: Die Prüfung wäre fünf Tage nach der Bestellfrist fertig, die Prüfbitte ist gesperrt, der Grund steht daneben. Rechts ein Paar, das passt: weiter prüfen. Das ist ein Vorschlag zur Prüfung, keine Freigabe. Der Nutzen, den wir erwarten: Die Planung sieht früh, was frei wird, bekommt die Zeitprüfung mit Begründung in Tagen und sieht den nächsten Schritt. Das ist eine Hypothese.";
const C6_KURZ = "Wer hat das Problem? Unsere Hypothese: Planung und Bauleitung auf der Bedarfsseite, dazu Eigentümer und Einrichtungen, die ausbauen lassen. Das ist eine Rollenannahme, kein Praxisbefund.";
const C9_KURZ = "Unsere Bitte: Wenn Sie in Planung, Bauleitung oder bei einem Eigentümer einen Fall kennen, bei dem Türen, Wände oder Böden vor einem Umbau frei wurden, sprechen Sie uns nach dem Pitch an. Schlusssatz (Houssam): Danke.";

function folien() {
  const f = [];

  f.push({
    id: "C1", abschnitt: "Einstieg", layout: "TITEL", titel: "Wir suchen einen Fall in Dortmund",
    untertitel: "CircularFlow · vier Zeitpunkte, eine Frage",
    zeichne: (s) => { zeit4(s, { x: LM, y: 3.6, w: CW, dark: true }); },
    notiz: {
      spricht: "Feyrouz",
      text: "Wir sind Feyrouz und Houssam, ein studentisches Team, und das ist CircularFlow. Wir haben eine Idee, eine Simulation und eine Frage. Die Frage lautet: Wann erfährt die zuständige Person, dass ein Bauteil frei wird, und reicht die Zeit bis zur Entscheidung? Wird ein Angebot zu spät bekannt, wird neu bestellt, und passende Bauteile können entsorgt werden. Dafür suchen wir heute einen echten Fall in Dortmund.",
    },
  });

  f.push({
    id: "C2", abschnitt: "Frage", layout: "INHALT", titel: "Zwei Fristen könnten entscheiden, ob ein Bauteil weitergegeben wird",
    chips: ["hypothese", "hersteller"], fuss: "Quelle: Fallakte CF-PILOT-01 §6 (Concular Handlungsempfehlung, Dezember 2024, PDF-S. 38; BLB NRW, 02.12.2024)",
    zeichne: (s) => {
      karte(s, LM, 2.15, 4.2, 2.55, { fill: COL.gruenHell });
      T(s, "Bedarfsseite", { x: LM + 0.25, y: 2.28, w: 3.7, h: 0.4, fontSize: 20, bold: true, color: COL.gruen });
      T(s, "Bis zu einem festen Tag, der Bestellfrist, muss Ersatz bestellt werden.", { x: LM + 0.25, y: 2.8, w: 3.7, h: 1.0, fontSize: 18 });
      T(s, "Annahme des Pilotfalls (Fallakte CF-PILOT-01, A4)", { x: LM + 0.25, y: 4.05, w: 3.7, h: 0.55, fontSize: 14, color: COL.tinte2, valign: "bottom" });
      karte(s, 5.0, 2.15, 7.73, 2.55, { fill: COL.papier, line: COL.rahmen });
      T(s, "Angebotsseite", { x: 5.25, y: 2.28, w: 7.2, h: 0.4, fontSize: 20, bold: true, color: COL.gruen });
      T(s, "Concular empfiehlt für Rückbauprojekte der öffentlichen Hand, eine Frist zu vereinbaren. Bis zu dieser Frist können Bauprodukte verkauft werden, in der Regel bis kurz vor der Ausschreibung des Rückbaus.", { x: 5.25, y: 2.75, w: 7.2, h: 1.1, fontSize: 16 });
      T(s, [
        { text: "Quelle: Handlungsempfehlung, Dezember 2024, PDF-Seite 38", options: { fontSize: 14, color: COL.tinte2, breakLine: true } },
        { text: "Die Empfehlung betrifft Rückbau, unser Fall ist ein Umbau.", options: { fontSize: 14, bold: true } },
      ], { x: 5.25, y: 3.95, w: 7.2, h: 0.65 });
      karte(s, LM, 5.2, CW, 1.2, { fill: COL.weiss, line: COL.linie });
      B.chip(s, "projektbeleg", LM + 0.25, 5.3);
      T(s, "Dortmunder Beispiel", { x: LM + 2.15, y: 5.3, w: 6, h: 0.36, fontSize: 18, bold: true, valign: "middle" });
      T(s, [
        { text: "BLB NRW, 02.12.2024: erst ausbauen, dann abbrechen", options: { bold: true, fontSize: 16, breakLine: true } },
        { text: "„Rückbau erst, nachdem alle demontierbaren Baustoffe vollständig ausgebaut wurden“ (UB TU Dortmund)", options: { fontSize: 14, color: COL.tinte2 } },
      ], { x: LM + 0.25, y: 5.72, w: CW - 0.5, h: 0.62 });
    },
    notiz: {
      spricht: "Feyrouz",
      text: "Zwei Fristen könnten über die Weitergabe eines Bauteils entscheiden. Wer ein Bauteil braucht, muss bis zu einem festen Tag Ersatz bestellen. Concular empfiehlt für Rückbauprojekte der öffentlichen Hand, eine Frist zu vereinbaren. Bis zu dieser Frist können Bauprodukte verkauft werden, in der Regel bis kurz vor der Ausschreibung des Rückbaus. Das ist eine Angabe des Anbieters Concular. Die Empfehlung betrifft Rückbau, unser Fall ist ein Umbau. In Dortmund erfolgt laut BLB NRW der Rückbau der Universitätsbibliothek erst, nachdem alle demontierbaren Baustoffe ausgebaut wurden. Ob und wo es knapp wird, wissen wir nicht. Unsere Vermutung: Das Wissen darüber kommt oft spät.",
      min5: { art: "weg" }, min3: { art: "weg" },
    },
  });

  f.push({
    id: "C3", abschnitt: "Frage", layout: "INHALT", titel: "Wir fragen nach vier Zeitpunkten",
    chips: ["hypothese"], fuss: "Quelle: Rechercheplan des Teams",
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
      text: "Wir wollen vier Zeitpunkte getrennt erfassen. Erstens: Wann wurde das Angebot auf der abgebenden Seite bekannt? Zweitens: Wann erreichte es die zuständige Person? Drittens: Bis wann musste diese Person entscheiden? Viertens: Wann war die Übergabe möglich? Bleibt zwischen dem zweiten und dritten Zeitpunkt weniger Zeit, als eine Prüfung braucht, kommt das Angebot zu spät. Dafür muss vor der Bestellung eine Fachperson prüfen, ob das Bauteil passt. Die Bitte dazu heißt bei uns Prüfbitte. Wir nehmen an, die Prüfung dauert mindestens 14 Tage, das ist die Mindestprüfzeit. Das ist unsere Arbeitsannahme.",
      min5: { art: "voll" }, min3: { art: "zuerst", text: "Bis zu einem festen Tag, der Bestellfrist, muss Ersatz bestellt werden." },
    },
  });

  f.push({
    id: "C4", abschnitt: "Frage", layout: "INHALT", titel: "Der fiktive Fall in vier Zeitpunkten",
    chips: ["fiktiv", "simulation", ["annahme", "Annahme, unbestätigt: 14 Tage Mindestprüfzeit"]], fuss: "Quelle: Fallakte CF-PILOT-01 §5 (Nachrechnung mit der Rechenregel der Vorschau, keine Praxisdaten)",
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
      text: "Unser fiktiver Fall mit zwölf Türen aus Haus Lindenhof zeigt das. Das Projekt Umbau am Kanal braucht sechs Türen. In Variante eins würde das Angebot am 19. Januar bekannt und erreichte die Planung am 20. Januar. Entscheiden müsste sie bis zum 19. Februar, die Übergabe ginge am 8. März. In Variante zwei erreichte es sie erst am 22. Februar. Dann wäre die Ersatzbestellung raus, und für diesen Bedarf gäbe es keine Übergabe. Mit angenommenen 14 Tagen Mindestprüfzeit wäre der letzte Tag für die Prüfbitte der 5. Februar. Alles ist simuliert.",
      min5: { art: "voll" }, min3: { art: "weg" },
    },
  });

  f.push({
    id: "C5", abschnitt: "Plattform", layout: "BILD", titel: "Die Plattform prüft die Zeit und nennt den nächsten Schritt",
    chips: ["beispiel", "simulation", "vorschlag"], fuss: "Quelle: Pitch-Ablauf; Bildschirmfotos aus Fassung 2 (Code 2121b92), Stichtag der Demo Mi 18.11.2026, 14:00 (Simulation)",
    zeichne: (s) => {
      const zellen = [
        ["e3-zu-spaet.jpg", "K3 · TW-01 → BD-23: zu spät, Prüfbitte gesperrt", "Ausschnitt des Abgleichs TW-01 und BD-23: Für diese Entscheidung zu spät, Prüfende 5 Tage nach der Bestellfrist, Prüfbitte gesperrt (Beispieldaten)"],
        ["e4-weiter-pruefen.jpg", "K4 · TW-05 → BD-22: weiter prüfen, 123 Tage davor", "Ausschnitt des Abgleichs TW-05 und BD-22: Weiter prüfen, Prüfende 123 Tage vor der Bestellfrist (Beispieldaten)"],
      ];
      const iw = 5.9, g = CW - 2 * (iw + 0.1);
      zellen.forEach(([bild, unter, alt], i) => {
        const x = LM + i * (iw + 0.1 + g), datei = "ausschnitte/" + bild;
        const gr = B.bildGroesse(datei, iw, 3.5);
        papier(s, x, 2.05, gr.w + 0.1, gr.h + 0.1);
        B.bildPassend(s, datei, x + 0.05, 2.1, iw, 3.5, alt);
        T(s, unter, { x, y: 2.05 + gr.h + 0.13, w: iw + 0.1, h: 0.26, fontSize: 14, bold: true, color: COL.tinte2 });
      });
      B.ketteZeile(s, {
        x: LM, y: 5.98, w: CW, h: 0.32,
        schritte: ["Zuordnung", "Prüfbitte", "Fachergebnis", "Vormerkung anlegen"],
        zustand: ["voll", "voll", "voll", "rand"],
      });
      B.chip(s, "hypothese", LM, 6.36);
      T(s, "Erwarteter Nutzen: früh sehen, was frei wird · Zeit mit Begründung prüfen · nächster Schritt statt Freigabe", { x: LM + 1.65, y: 6.36, w: CW - 1.65, h: 0.36, fontSize: 14, valign: "middle" });
    },
    notiz: {
      spricht: "Houssam",
      text: "So sieht die Prüfung in unserer Vorschau aus, hier als zwei große Ausschnitte von Bildschirmfotos mit Beispieldaten. Ein Paar ist ein Angebot und ein Bedarf derselben Bauteilgruppe. Links ein Paar, das zu spät ist: Die Prüfung wäre fünf Tage nach der Bestellfrist fertig, die Prüfbitte ist gesperrt, der Grund steht daneben. Rechts ein Paar, das passt: weiter prüfen. Prüfbar heißt: Die Zeit reicht noch. Darunter die Statuskette bis zum nächsten Schritt: Vormerkung anlegen. Eine Vormerkung ist eine unverbindliche Reservierung. Das ist ein Vorschlag zur Prüfung, keine Freigabe. Das Fachergebnis ist ein Eintrag in der Simulation. Der Nutzen, den wir erwarten: Die Planung sieht früh, was frei wird, bekommt die Zeitprüfung mit Begründung in Tagen und sieht den nächsten Schritt. Das ist eine Hypothese. Die Vorschau zeigen wir auf Nachfrage gern im Anschluss.",
      min3: { art: "kurz", text: C5_KURZ },
    },
  });

  f.push({
    id: "C6", abschnitt: "Plattform", layout: "INHALT", titel: "Zielgruppe und Abgrenzung: eine Rollenannahme, kein Praxisbefund",
    chips: ["hypothese", "hersteller"], fuss: FUSS_ABGRENZUNG,
    zeichne: (s) => {
      karte(s, LM, 2.15, 4.9, 4.1, { fill: COL.hinwF });
      T(s, "Wer hat das Problem?", { x: LM + 0.25, y: 2.3, w: 4.4, h: 0.4, fontSize: 20, bold: true, color: COL.hinwT });
      T(s, [
        { text: "Unsere Hypothese: Planung und Bauleitung auf der Bedarfsseite", options: { bullet: true, breakLine: true } },
        { text: "Eigentümer und Einrichtungen auf der Angebotsseite", options: { bullet: true, breakLine: true } },
        { text: "Das ist eine Rollenannahme, kein Praxisbefund.", options: { bold: true } },
      ], { x: LM + 0.25, y: 2.9, w: 4.4, h: 3.2, fontSize: 18, paraSpaceAfter: 12 });
      karte(s, 5.73, 2.15, 7.0, 4.1, { fill: COL.papier, line: COL.rahmen });
      T(s, "Was gibt es schon?", { x: 5.98, y: 2.3, w: 6.5, h: 0.4, fontSize: 20, bold: true, color: COL.gruen });
      T(s, [
        { text: "Andere Plattformen vermitteln Angebot und Gesuch:", options: { breakLine: true } },
        { text: "Concular Exchange (laut Anbieter)", options: { bullet: true, breakLine: true } },
        { text: "Madaster Match (laut Dokumentation)", options: { bullet: true, breakLine: true } },
        { text: "Unsere Frage dazu: Reicht die Zeit bis zur Bestellentscheidung für eine fachliche Prüfung? Ob andere Plattformen das abbilden, haben wir nicht geprüft.", options: { bold: true, breakLine: true } },
        { text: MADASTER, options: { fontSize: 14 } },
      ], { x: 5.98, y: 2.9, w: 6.5, h: 3.2, fontSize: 16, paraSpaceAfter: 8 });
    },
    notiz: {
      spricht: "Houssam",
      text: "Wer hat das Problem? Unsere Hypothese: Planung und Bauleitung auf der Bedarfsseite, dazu Eigentümer und Einrichtungen, die ausbauen lassen. Das ist eine Rollenannahme, kein Praxisbefund. Andere Plattformen vermitteln Angebot und Gesuch, Concular Exchange laut Anbieter, Madaster Match laut Dokumentation. Da gibt es eine Überschneidung. Unsere Frage dazu: Reicht die Zeit bis zur Bestellentscheidung für eine fachliche Prüfung? Ob andere Plattformen das abbilden, haben wir nicht geprüft. Bei Madaster nennt die Dokumentation, Stand 9. September 2026, keine Bestellfrist und keine Prüfzeit auf der Suchseite. Die Funktion selbst haben wir nicht bedient. Ob das im Alltag fehlt, ist offen.",
      min5: { art: "voll" }, min3: { art: "kurz", text: C6_KURZ },
    },
  });

  f.push(G.geschaeftsmodell({ id: "C7", abschnitt: "Nutzen und Test", spricht: "Houssam" }));

  f.push({
    id: "C8", abschnitt: "Nutzen und Test", layout: "INHALT", titel: "Der Praxistest in Dortmund ist klein und hat ein beobachtbares Signal",
    chips: [["annahme", "Annahme, unbestätigt: 14 Tage"], "vorschlagTest"], fuss: "Quelle: Rechercheplan des Teams; Fallakte CF-PILOT-01 §11",
    zeichne: (s) => {
      const w = 2.6, g = 0.25, y = 2.15, h = 2.4;
      const k = [
        ["1 · Rekonstruieren", "Einen Fall mit einer zuständigen Person entlang der vier Zeitpunkte rekonstruieren."],
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
    zeichne: (s, ctx) => {
      T(s, "Wir können die vier Fragen gemeinsam durchgehen. Sprechen Sie uns nach dem Pitch an.", { x: LM, y: 2.65, w: CW, h: 0.45, fontSize: 20, color: COL.gruenHell });
      zeit4(s, { x: LM, y: 3.45, w: CW, dark: true, hervor: 0 });
      B.chipZeile(s, ["simulation", "beispiel", "fiktiv"], LM, 5.15);
      s.addText([{ text: "Vorschau-Bilder (Anhang)", options: { hyperlink: { slide: ctx.nr.E1, tooltip: "Bilder der Vorschau im Anhang" } } }], {
        shape: B.getP().ShapeType.roundRect, rectRadius: 0.06, x: 9.9, y: 5.12, w: 2.83, h: 0.36, fill: { color: COL.weiss }, line: { color: COL.weiss, width: 0.5 },
        fontFace: B.FONT, fontSize: 14, align: "center", valign: "middle", margin: 0.02, fit: "none" });
    },
    notiz: {
      spricht: "Feyrouz",
      text: "Unsere Bitte: Wenn Sie in Planung, Bauleitung oder bei einem Eigentümer einen Fall kennen, bei dem Türen, Wände oder Böden vor einem Umbau frei wurden, sprechen Sie uns nach dem Pitch an. Wir können die vier Fragen gemeinsam durchgehen. Für den nächsten Schritt suchen wir einen echten Fall. Wir haben bisher eine Simulation und eine klare Frage. Schlusssatz (Houssam): Danke.",
      min3: { art: "kurz", text: C9_KURZ },
    },
  });

  f.push(...G.eFolien("C", "Anhang", "C9"));
  f.push(G.anhang({ id: "AX", abschnitt: "Anhang", hinweisFassung: "Fassung C: Praxistest Dortmund. E1 bis E6 liegen als versteckter Anhang vor dieser Folie und werden nur auf Nachfrage in der Fragerunde gezeigt." }));
  return f;
}
module.exports = { folien };
