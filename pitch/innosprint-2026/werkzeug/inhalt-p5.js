// Pitch 5 Minuten (Kennung P5): Folien P1-P7, Ersatzfolien EK3/EK4, Anhang AX1-AX6.
// Texte wörtlich nach plan/pitch-5min-bauauftrag.md. Notizformat: absaetze + zeit (siehe bausteine.js, notizTextP5).
const B = require("./bausteine");
const { COL, LM, CW, T, karte, papier } = B;

const FUSS = 11; // Fußnoten 11 pt
const FUSS_DUNKEL = COL.gruenHell;
const TXT_UE = {
  p2: "Wie CircularFlow prüft, ob die Zeit reicht, zeigt Houssam.",
  p4: "Was das für Dortmund bringen kann, erklärt Feyrouz.",
  p5: "Was heute schon steht, zeigt Houssam.",
  p6: "Wechsel innerhalb der Folie: zweiter Absatz spricht Feyrouz",
};
const ZEIT = (sek, uhr) => ({ sek, uhr });
const KEINE_ZEIT_EK = "Zeitfenster: keines (ersetzt den Demo-Schritt; die Zeit zählt zum Zeitfenster der Folie 4)";
const KEINE_ZEIT_AX = "Zeitfenster: keines (ausgeblendet, nur bei Rückfragen)";

// Sprechtexte der sichtbaren Folien (wörtlich aus dem Bauauftrag)
const TXT = {
  p1: "Ein ausgedachter Fall, der in Dortmund spielt: In einem Bürohaus werden zwölf Türen ausgebaut, sechs davon werden angeboten. Ein anderer Umbau braucht genau sechs Türen. Doch die Projektleitung erfährt zu spät davon und bestellt neu. Die angebotenen Türen können im Container landen. Wir sind Feyrouz Chahed und Houssam Taleb. Mit CircularFlow wollen wir das ändern.",
  p2: "Der Umbau muss bis zum 19. Februar Ersatz bestellen. Das ist die Bestellfrist. Vorher muss eine Fachperson prüfen, ob die Türen passen. Wir nehmen an, das dauert 14 Tage. Also muss die Projektleitung die Prüfung spätestens am 5. Februar anfragen. Diese Anfrage nennen wir Prüfbitte. Wer erst danach vom Angebot erfährt, ist zu spät. Wie CircularFlow prüft, ob die Zeit reicht, zeigt Houssam.",
  p3: "CircularFlow bringt drei Angaben zusammen: wann ein Bauteil frei wird, bis wann ein Projekt bestellen muss und wie lange die Prüfung dauert. Daraus zeigt es: Reicht die Zeit, ist es knapp oder zu spät, welche Angaben fehlen und was als Nächstes zu tun ist.",
  k1: "K1 · Das ist unsere Vorschau mit Beispieldaten. Ganz oben steht eine Innentür: Am Einbauort fehlt noch das Maß, die Frist endet in zwei Stunden. Im Weiteren geht es um Systemtrennwände statt Türen, die Zeitfrage ist dieselbe.",
  k2: "K2 · Jedes Paar ist ein Angebot und ein Bedarf derselben Bauteilgruppe.",
  k3: "K3 · Dieses Paar ist zu spät: Mit der angenommenen Prüfzeit wäre die Prüfung erst fünf Tage nach der Bestellfrist fertig. Deshalb ist die Prüfbitte gesperrt.",
  k4: "K4 · Bei diesem Paar reicht die Zeit: weiter prüfen. Das ist ein Vorschlag, keine Freigabe. Entscheiden müssen Fachleute und Projektleitung.",
  zurueck: "Zurück zur Präsentation, Folie 7 · Was das für Dortmund bringen kann, erklärt Feyrouz.",
  klick: "Klick: Alt+Tab zum Browser (Übersicht) · in der Kachel „Paare derselben Gruppe“ auf 8 Paare · Zeile TW-01 → BD-23 · oben im Pfad Paare derselben Gruppe · Zeile TW-05 → BD-22 · Alt+Tab zurück.",
  zeitdruck1: "Bei Zeitdruck: Steht K3 um 2:10 nicht da oder hakt die Vorschau: zurück zur Präsentation und die Bildschirmfotos über die Links auf dieser Folie zeigen. Waren K1 und K2 schon gesprochen, auf Folie 5 nur den K3-Satz.",
  zeitdruck2: "Bei Zeitdruck: Ist K4 um 2:25 noch nicht erreicht: zurück und direkt „Bildschirmfoto: weiter prüfen ›“.",
  p5: "Unser Bezug zu SDG 12.5: weniger Abfall durch Wiederverwendung. Das Umweltamt der Stadt hat im Sprint gezeigt: Es gibt kaum Daten zu Baustoffströmen. In einem künftigen Pilot in Dortmund wollen wir deshalb zählen: Wie viele angebotene Bauteile werden rechtzeitig geprüft, wie viele wirklich wieder eingebaut, und woran scheitert es sonst? Was heute schon steht, zeigt Houssam.",
  p6a: "Heute läuft unser Prototyp im Browser, mit Beispieldaten. Nutzen soll ihn zuerst die Projektleitung im Planungsbüro. Als erstes Angebot planen wir einen Kurzcheck für eine Bauteilgruppe. Wer dafür bezahlt, klären wir im Pilot. Ich habe an der TU Dortmund Informatik studiert, bin jetzt im Master und entwickle den Prototyp.",
  p6r: "Bei Rückfragen: Als Budgetverantwortliche kommen infrage: die Bauherrschaft, die den Umbau beauftragt; die Bestandsorganisation, die Gebäude im Bestand verwaltet; oder die Büroleitung eines Planungsbüros, wie im Steckbrief angenommen, etwa mit einer Projektlizenz. Bestätigt ist davon nichts. Wer zahlt und zu welchem Preis, klären wir im Pilot.",
  p6b: "Feyrouz: Ich studiere ebenfalls Informatik an der TU Dortmund und kenne mich in Datenanalyse und IT-Sicherheit aus. Uns fehlt Fachwissen aus Bau und Rückbau. Dafür suchen wir Partner aus der Branche.",
  p7: "Diesen Kurzcheck wollen wir mit einer Projektleitung an einem echten Dortmunder Umbau erproben. Dabei prüfen wir, ob unsere Entscheidungskarte hilft, die Fachprüfung rechtzeitig anzustoßen. Dafür klären wir auch die benötigte Prüfzeit. Bringen Sie uns mit einem passenden Umbauprojekt in Kontakt.",
  ek3a: "Das ist unsere Vorschau mit Beispieldaten, hier mit Systemtrennwänden statt Türen.",
  ek3spaet: "Spätfall: Waren K1 und K2 schon live gesprochen, nur den K3-Satz sprechen.",
  ek3weiter: "Danach immer „weiter ›“ zu Folie 6. Wer doch direkt „zurück zum Vortrag“ geht, sagt vorher: „Was das für Dortmund bringen kann, erklärt Feyrouz.“",
  ek3k2: "K2 · Jedes Paar ist ein Angebot und ein Bedarf derselben Bauteilgruppe.",
  ek4b: "Was das für Dortmund bringen kann, erklärt Feyrouz.",
};

// Anhang: Kurzantworten, nur aus dem Inhalt der jeweiligen Anhangfolie
const KURZ = {
  ax1: "Mit der Prüfbitte entsteht ein Vorgang. Das Fachergebnis ist ein Eintrag, keine Freigabe. Der nächste Schritt ist die Vormerkung, also eine unverbindliche Reservierung. Alles mit Beispieldaten in der Simulation.",
  ax2: "Die Prüfung endet am Tag der Anfrage plus Prüfzeit. Im fiktiven Fall: Anfrage am 04.02., Prüfende am 18.02., weiter prüfen. Am 05.02. ist es knapp, ab dem 06.02. zu spät. Bei den Demo-Paaren ist BD-23 mit 14 Tagen Prüfzeit fünf Tage zu spät, BD-22 mit 10 Tagen Prüfzeit liegt 123 Tage vor der Bestellfrist.",
  ax3: "In der Simulation beschädigt der Probeausbau am 02.02.2027 eine Tür. Fünf Türen sind unverbindlich vorgemerkt, eine ist offen, Bestellfrist 19.02.2027. Die Vorschau zeigt den Bedarf danach als gedeckt, die fehlende Tür steht nur in einer Notiz. Als nächsten Ausbau planen wir, die offene Restmenge mit Frist sichtbar zu halten. Das ist nicht umgesetzt.",
  ax4: "Wir konzentrieren uns auf die einzelne Bestellentscheidung im laufenden Umbau: Reicht die Zeit für die Fachprüfung, was fehlt, was ist der nächste Schritt. Ob andere Plattformen das ebenso abbilden, haben wir nicht geprüft. Die Angaben zu Concular, Madaster und den Börsen stammen aus Workshop, Dokumentation und Steckbrief.",
  ax5: "Die Vorschau zeigt den spätesten Tag für die Anfrage nicht als eigene Frist, Zeitkritisch zeigt die Bestellfrist erst sieben Tage vorher, und es gibt keine Benachrichtigung. Es sind nur Beispieldaten, das Fachergebnis ist ein Eintrag, ein Scan liefert nur Vorschläge, und bei Türen zählen nur gemessene Maße. Welche Prüfungen und Nachweise erforderlich sind, klären Fachplanung und gegebenenfalls zuständige Prüfstellen für das konkrete Bauteil und den vorgesehenen Einbau. Die Vorschau speichert keine Nachweisdokumente. Im Steckbrief steht, CircularFlow lasse keine Frist stillschweigend verstreichen. Läuft eine Frist ab, zeigt die Vorschau „Frist verstrichen“, und der Vorgang bleibt offen. Eine Benachrichtigung vorher und den spätesten Anfragetag als eigene Frist hat sie noch nicht.",
  ax6: "Die Quellen mit Stand stehen auf der Folie. Fiktiver Fall und Beispieldaten sind ausgedacht, Simulation und Fachergebnis sind Einträge ohne Fachfreigabe, Annahme und Hypothese sind nicht belegt, Herstellerangabe heißt: nicht selbst geprüft.",
};
const anhangNotiz = (spricht, kurz) => ({ spricht, absaetze: ["Nur bei Rückfragen.", "Kurzantwort: " + kurz], zeitfenster: KEINE_ZEIT_AX });

// Fassung der Ersatzfolie: großes Bildschirmfoto links, Unterschrift und Links rechts
function ersatzFolie({ id, titel, bild, alt, unter, notiz, links }) {
  return {
    id, abschnitt: "Demo", layout: "BILD", versteckt: true, titel, chips: ["beispiel"], fussPt: FUSS,
    fuss: "Quelle: Pitch-Ablauf; Bildschirmfoto aus Fassung 2 (Code 2121b92), Beispieldaten, Stichtag der Demo Mi 18.11.2026, 14:00 (Simulation)",
    zeichne: (s, ctx) => {
      const datei = "ausschnitte/" + bild, maxH = 4.1;
      const g = B.bildGroesse(datei, 7.4, maxH);
      papier(s, LM, 2.15, g.w + 0.2, g.h + 0.2);
      B.bildPassend(s, datei, LM + 0.1, 2.25, 7.4, maxH, alt);
      for (const hl of B.ausschnittRahmen(bild)) {
        s.addShape(B.getP().ShapeType.rect, {
          x: LM + 0.1 + hl[0] * g.w, y: 2.25 + hl[1] * g.h, w: hl[2] * g.w, h: hl[3] * g.h,
          fill: { color: COL.weiss, transparency: 100 }, line: { color: COL.hinwT, width: 2.5 },
        });
      }
      const x2 = LM + g.w + 0.2 + 0.4, w2 = 12.73 - x2;
      T(s, unter, { x: x2, y: 2.15, w: w2, h: 2.3, fontSize: 20, bold: true });
      links.forEach(([text, zielId, tip], i) => {
        T(s, [{ text, options: { hyperlink: { slide: ctx.nr[zielId], tooltip: tip } } }], { x: x2, y: 5.2 + i * 0.5, w: w2, h: 0.4, fontSize: 20 });
      });
    },
    notiz,
  };
}

function folien() {
  const f = [];

  // ---------- 1 · P1 Einstieg ----------
  f.push({
    id: "P1", abschnitt: "Einstieg", layout: "P5TITEL", titel: "Eine brauchbare Tür kann verloren gehen, weil die Information zu spät kommt",
    fussPt: FUSS, fussFarbe: FUSS_DUNKEL, fuss: "Fiktiver Pilotfall CF-PILOT-01; Gebäude und Projekte ausgedacht",
    zeichne: (s) => {
      const tw = 0.62, th = 1.05, gap = 0.14, y = 2.05, dy = COL.weiss;
      const gw = 6 * tw + 5 * gap; // 4,42
      B.tuerGitter(s, { x: LM, y, cols: 6, rows: 2, tw, th, gap, dark: true, stil: (i, c) => (c >= 3 ? "hervor" : "normal") });
      const rx = LM + CW - gw;
      const dx = 7.9, g3 = 3 * tw + 2 * gap;
      B.tuerGitter(s, { x: dx, y, cols: 3, rows: 2, tw, th, gap, dark: true, stil: () => "gesucht" });
      const cy = y + (2 * th + gap) / 2 - 0.2;
      const mid = (LM + gw + dx) / 2;
      B.pfeilUnterbrochen(s, { x0: LM + gw + 0.3, x1: dx - 0.3, cy, farbe: dy });
      T(s, "zu spät erfahren", { x: mid - 1.3, y: cy + 0.5, w: 2.6, h: 0.4, fontSize: 20, bold: true, color: COL.weiss, align: "center" });
      const ly = y + 2 * th + gap + 0.18;
      T(s, "Haus Lindenhof: 6 von 12 Türen angeboten", { x: LM, y: ly, w: gw, h: 0.7, fontSize: 20, bold: true, color: COL.weiss });
      T(s, "Umbau am Kanal: braucht 6 Türen", { x: dx, y: ly, w: LM + CW - dx, h: 0.7, fontSize: 20, bold: true, color: COL.weiss });
      T(s, "→ neu bestellt", { x: dx, y: ly + 0.8, w: LM + CW - dx, h: 0.55, fontSize: 28, bold: true, color: COL.weiss });
      B.chip(s, "fiktiv", LM, ly + 0.85, "Fiktiver Fall");
      T(s, "CircularFlow · Feyrouz Chahed · Houssam Taleb · INNOSPRINT Zirkuläres Bauen · Dortmund · 20.11.2026", { x: LM, y: 6.05, w: CW, h: 0.35, fontSize: 16, color: COL.gruenHell });
    },
    notiz: { spricht: "Feyrouz", absaetze: [TXT.p1], zeit: ZEIT(31, "0:31") },
  });

  // ---------- 2 · P2 Spätestens am 5. Februar ----------
  f.push({
    id: "P2", abschnitt: "Frist", layout: "INHALT", titel: "Spätestens am 5. Februar die Prüfung anfragen",
    chips: [["fiktiv", "Fiktiver Fall"], ["annahme", "Annahme, unbestätigt: 14 Tage Prüfzeit"]], fussPt: FUSS,
    fuss: "Alle Daten 2027, fiktiv; nachgerechnet mit der Rechenregel der Vorschau. Quelle: Fallakte CF-PILOT-01 §5",
    zeichne: (s) => {
      B.zeitleisteDrei(s, {
        bandY: 3.75, tage: 33,
        band: [[0, 17, "1F6B42"], [17, 18, "C98A12"], [18, 33, COL.spaetT]],
        marken: [
          { d: 0, datum: "19.01.", text: "Angebot bekannt", ausr: "l" },
          { d: 17, datum: "05.02.", text: "spätestens Prüfung anfragen", ausr: "m" },
          { d: 31, datum: "19.02.", text: "Bestellfrist: Ersatz bestellen", ausr: "r" },
        ],
        klammer: { von: 17, bis: 31, text: "14 Tage Prüfzeit (Annahme)" },
        legende: { titel: "wenn die Projektleitung an diesem Tag anfragt", y: 5.35, eintraege: [["1F6B42", "rechtzeitig"], [COL.achtT, "knapp"], [COL.spaetT, "zu spät"]] },
      });
    },
    notiz: { uebergabe: TXT_UE.p2, spricht: "Feyrouz", absaetze: [TXT.p2], zeit: ZEIT(35, "1:06") },
  });

  // ---------- 3 · P3 Was CircularFlow prüft ----------
  f.push({
    id: "P3", abschnitt: "Lösung", layout: "INHALT", titel: "CircularFlow zeigt, ob die Zeit für die Prüfung reicht",
    fussPt: FUSS, fuss: "Funktionen der Vorschau (Fassung 2)",
    zeichne: (s) => {
      const r = B.eingabeAmpel(s, {
        y: 1.95,
        eingaben: ["Bauteil frei ab", "Bestellfrist", "Prüfzeit"],
        frage: "Reicht die Zeit für die Prüfung?",
        ergebnisse: [["weiter prüfen", COL.okT, COL.okF], ["knapp", COL.achtT, COL.achtF], ["zu spät", COL.spaetT, COL.spaetF]],
      });
      T(s, "Was fehlt? Was ist der nächste Schritt?", { x: LM, y: r.bis + 0.15, w: CW, h: 0.4, fontSize: 20, color: COL.tinte2, align: "center" });
      karte(s, LM, 5.8, CW, 0.62, { fill: COL.papier, line: COL.rahmen });
      T(s, "Fachleute beurteilen die Eignung · Die Projektleitung entscheidet die Bestellung", { x: LM + 0.2, y: 5.8, w: CW - 0.4, h: 0.62, fontSize: 20, bold: true, valign: "middle", align: "center" });
    },
    notiz: { spricht: "Houssam", absaetze: [TXT.p3], zeit: ZEIT(27, "1:33") },
  });

  // ---------- 4 · P4 Demo ----------
  f.push({
    id: "P4", abschnitt: "Demo", layout: "DEMO", titel: "Live: Ein Paar ist fünf Tage zu spät, ein anderes kann weiter geprüft werden",
    fussPt: FUSS, fuss: "Prüfzeiten sind Beispielannahmen. Der Abgleich ist ein Vorschlag zur Prüfung, keine Freigabe. Es wird nichts versendet.",
    zeichne: (s, ctx) => {
      T(s, "Vorschau Fassung 2 · Beispieldaten: Systemtrennwände statt Türen · Stichtag der Demo: Mi\u00a018.11.2026, 14:00 Uhr (Simulation)", { x: LM, y: 1.65, w: CW, h: 0.75, fontSize: 20, color: COL.tinte2 });
      B.chipZeile(s, ["beispiel", "simulation"], LM, 2.55);
      const g = 0.3, w = (CW - g) / 2, y = 3.2, h = 2.7;
      const karten = [
        ["1", "Zu spät · TW-01 → BD-23", "Bildschirmfoto: zu spät ›", "Ersatzfolie: Bildschirmfoto zu spät", "EK3", COL.spaetF, COL.spaetT],
        ["2", "Weiter prüfen · TW-05 → BD-22", "Bildschirmfoto: weiter prüfen ›", "Ersatzfolie: Bildschirmfoto weiter prüfen", "EK4", COL.okF, COL.okT],
      ];
      karten.forEach(([ziffer, titel, link, tip, ziel, fill, fg], i) => {
        const x = LM + i * (w + g);
        karte(s, x, y, w, h, { fill, line: fg, lw: 1.5 });
        s.addText(ziffer, { shape: B.getP().ShapeType.ellipse, x: x + 0.3, y: y + 0.38, w: 0.6, h: 0.6, fill: { color: fg }, line: { color: fg, width: 2.25 },
          fontFace: B.FONT, fontSize: 24, bold: true, color: COL.weiss, align: "center", valign: "middle", margin: 0, fit: "none" });
        T(s, titel, { x: x + 1.0, y: y + 0.38, w: w - 1.1, h: 0.6, fontSize: 22, bold: true, color: fg, valign: "middle" });
        T(s, [{ text: link, options: { hyperlink: { slide: ctx.nr[ziel], tooltip: tip } } }], { x: x + 0.3, y: y + h - 0.85, w: w - 0.6, h: 0.45, fontSize: 20 });
      });
    },
    notiz: { uebergabe: TXT_UE.p4, spricht: "Houssam", absaetze: [TXT.k1, TXT.k2, TXT.k3, TXT.k4, TXT.zurueck, TXT.klick, TXT.zeitdruck1, TXT.zeitdruck2], zeit: ZEIT(64, "2:37") },
  });

  // ---------- 5 · EK3 ----------
  f.push(ersatzFolie({
    id: "EK3", titel: "Bildschirmfoto: Dieses Paar ist fünf Tage zu spät", bild: "e3-zu-spaet.jpg",
    alt: "Ausschnitt des Abgleichs TW-01 und BD-23: Für diese Entscheidung zu spät, Prüfende 02.12.2026 liegt 5 Tage nach der Bestellfrist 27.11.2026, Prüfbitte gesperrt (Beispieldaten)",
    unter: "K3 · TW-01 → BD-23 · Prüfende 02.12.2026 liegt 5 Tage nach der Bestellfrist 27.11.2026 · Prüfbitte gesperrt",
    links: [["weiter ›", "EK4", "Nächstes Bildschirmfoto"], ["zurück zum Vortrag", "P5", "Zurück zum Vortrag"]],
    notiz: { uebergabe: "bei „zurück zum Vortrag“: " + TXT_UE.p4, spricht: "Houssam", absaetze: [TXT.ek3spaet, TXT.ek3a, TXT.ek3k2, TXT.k3, TXT.ek3weiter], zeitfenster: KEINE_ZEIT_EK },
  }));

  // ---------- 6 · EK4 ----------
  f.push(ersatzFolie({
    id: "EK4", titel: "Bildschirmfoto: Bei diesem Paar reicht die Zeit", bild: "e4-weiter-pruefen.jpg",
    alt: "Ausschnitt des Abgleichs TW-05 und BD-22: Weiter prüfen, Prüfende 28.11.2026 liegt 123 Tage vor der Bestellfrist 31.03.2027 (Beispieldaten)",
    unter: "K4 · TW-05 → BD-22 · weiter prüfen · Vorschlag zur Prüfung, keine fachliche Freigabe",
    links: [["zurück zum Vortrag", "P5", "Zurück zum Vortrag"]],
    notiz: { uebergabe: TXT_UE.p4, spricht: "Houssam", absaetze: [TXT.k4, TXT.ek4b], zeitfenster: KEINE_ZEIT_EK },
  }));

  // ---------- 7 · P5 Impact ----------
  f.push({
    id: "P5", abschnitt: "Impact", layout: "INHALT", titel: "In einem Dortmunder Pilot wollen wir messen, was wirklich wiederverwendet wird",
    chips: [["hypothese", "Ziel, noch keine Messung"]], fussPt: FUSS,
    fuss: "SDG 12.5: Unterziel der Vereinten Nationen, sinngemäß wiedergegeben; Zitat: Stadt Dortmund, Umweltamt, INNOSPRINT, 13.11.2026, Folie 11",
    zeichne: (s) => {
      const y = 2.15, h = 4.2, g = 0.25, w1 = 3.7, w2 = 4.5, w3 = CW - w1 - w2 - 2 * g;
      karte(s, LM, y, w1, h, { fill: COL.gruenHell });
      T(s, [
        { text: "SDG 12.5", options: { bold: true, fontSize: 28, color: COL.gruen, breakLine: true } },
        { text: "Abfall deutlich verringern, auch durch Wiederverwendung (sinngemäß)", options: { fontSize: 20 } },
      ], { x: LM + 0.25, y: y + 0.25, w: w1 - 0.5, h: h - 0.5 });
      B.kettePilot(s, { x: LM + w1 + g, y, w: w2, stufen: ["angeboten", "rechtzeitig geprüft", "wieder eingebaut"], darunter: "Wenn nicht: zu spät · Angaben fehlen · ungeeignet" });
      const qx = LM + w1 + w2 + 2 * g;
      karte(s, qx, y, w3, h, { fill: COL.papier, line: COL.rahmen });
      T(s, [
        { text: "„Es gibt kaum Daten zu Baustoffströmen.“", options: { bold: true, fontSize: 22, breakLine: true, paraSpaceAfter: 12 } },
        { text: "Stadt Dortmund, Umweltamt, INNOSPRINT, 13.11.2026", options: { fontSize: 20, color: COL.tinte2 } },
      ], { x: qx + 0.25, y: y + 0.25, w: w3 - 0.5, h: h - 0.5 });
    },
    notiz: { uebergabe: TXT_UE.p5, spricht: "Feyrouz", absaetze: [TXT.p5], zeit: ZEIT(33, "3:10") },
  });

  // ---------- 8 · P6 Prototyp, Geschäftsmodell, Team ----------
  f.push({
    id: "P6", abschnitt: "Team", layout: "INHALT", titel: "Der Prototyp läuft. Als Erstes wollen wir einen Kurzcheck testen",
    fussPt: FUSS, fuss: "Team und Lücken laut Steckbrief des Teams (13.11.2026)",
    zeichne: (s) => {
      const lw = 6.2, rx = LM + lw + 0.25, rw = CW - lw - 0.25, ls = 1.0, rs = 0.9;
      // linke Spalte
      T(s, "Heute zeigbar", { x: LM, y: 1.62, w: lw, h: 0.36, fontSize: 22, bold: true, color: COL.gruen });
      const ig = B.bildGroesse("ausschnitte/e1-uebersicht.jpg", 1.95, 1.0);
      papier(s, LM, 2.02, ig.w + 0.1, ig.h + 0.1);
      B.bildPassend(s, "ausschnitte/e1-uebersicht.jpg", LM + 0.05, 2.07, 1.95, 1.0, "Kleiner Ausschnitt der Übersicht der Vorschau mit Kacheln (Beispieldaten)");
      T(s, "Prototyp im Browser · Beispieldaten, Simulation", { x: LM + 2.25, y: 2.0, w: lw - 2.25, h: 0.7, fontSize: 20, lineSpacingMultiple: ls });
      B.chip(s, "beispiel", LM + 2.25, 2.75);
      T(s, "Nutzer und Angebot", { x: LM, y: 3.2, w: 3.3, h: 0.36, fontSize: 22, bold: true, color: COL.gruen });
      B.chip(s, "hypothese", LM + 3.4, 3.2);
      const feld = (k, v, last) => [{ text: k, options: { bold: true } }, { text: " " + v, options: { breakLine: !last } }];
      T(s, [...feld("Nutzer:", "Projektleitung im Planungsbüro."), ...feld("Erstes Angebot:", "Kurzcheck für eine Bauteilgruppe im Umbau."), ...feld("Zahlender Auftraggeber:", "im Pilot zu klären.", true)], { x: LM, y: 3.7, w: lw, h: 2.8, fontSize: 20, lineSpacingMultiple: ls, paraSpaceAfter: 8 });
      // rechte Spalte
      B.personenKarte(s, { x: rx, y: 1.62, w: rw, h: 1.5, name: "Houssam Taleb", text: "Informatik an der TU Dortmund, jetzt im Master · entwickelt den Prototyp" });
      B.personenKarte(s, { x: rx, y: 3.25, w: rw, h: 1.75, name: "Feyrouz Chahed", text: "Informatik an der TU Dortmund · Datenanalyse, IT-Sicherheit, Umsetzung und Ideen" });
      karte(s, rx, 5.13, rw, 1.3, { fill: COL.hinwF });
      T(s, "Uns fehlt: Fachwissen aus Bau und Rückbau, Bauteilbewertung, Recht und Logistik → Partner gesucht", { x: rx + 0.2, y: 5.13, w: rw - 0.4, h: 1.3, fontSize: 20, bold: true, color: COL.hinwT, valign: "middle", lineSpacingMultiple: rs });
    },
    notiz: { uebergabe: TXT_UE.p6, spricht: "Houssam, dann Feyrouz", absaetze: [TXT.p6a, TXT.p6b, TXT.p6r], zeit: ZEIT(48, "3:58") },
  });

  // ---------- 9 · P7 Schluss ----------
  f.push({
    id: "P7", abschnitt: "Schluss", layout: "P5SCHLUSS", titel: "Wir suchen einen echten Umbaufall in Dortmund",
    fussPt: FUSS, fussFarbe: FUSS_DUNKEL, fuss: "Stadt Dortmund, Umweltamt, 13.11.2026, Folie 11; Concular, Workshop im INNOSPRINT, Folie 49",
    zeichne: (s) => {
      T(s, "Im Sprint gelernt", { x: LM, y: 1.6, w: CW, h: 0.4, fontSize: 22, bold: true, color: COL.gruenHell });
      T(s, [
        { text: "Umweltamt: „Bei Bauentscheidungen zählen meist Zeit und Kosten.“", options: { breakLine: true } },
        { text: "Concular: „Zeitliche Unterschiede in Nachfrage und Angebot“", options: {} },
      ], { x: LM, y: 2.05, w: CW, h: 0.85, fontSize: 20, color: COL.weiss, paraSpaceAfter: 6 });
      T(s, "Kurzcheck an einem echten Dortmunder Umbau erproben", { x: LM, y: 3.05, w: CW, h: 0.4, fontSize: 22, bold: true, color: COL.gruenHell });
      T(s, [
        { text: "Mit einer Projektleitung prüfen: Hilft die Entscheidungskarte, die Fachprüfung rechtzeitig anzustoßen?", options: { breakLine: true } },
        { text: "Sie zeigt, was bis zur Frist fehlt, wer es liefert und was als Nächstes zu tun ist.", options: { breakLine: true } },
        { text: "Dafür klären wir auch die benötigte Prüfzeit.", options: {} },
      ], { x: LM, y: 3.5, w: CW, h: 2.0, fontSize: 20, color: COL.weiss, paraSpaceAfter: 6 });
      T(s, "Unsere Bitte: Bringen Sie uns mit einem Dortmunder Umbauprojekt in Kontakt.", { x: LM, y: 5.4, w: CW, h: 1.1, fontSize: 32, bold: true, color: COL.weiss, valign: "middle" });
    },
    notiz: { spricht: "Feyrouz", absaetze: [TXT.p7], zeit: ZEIT(21, "4:19") },
  });

  // ---------- Anhang ----------
  f.push({
    id: "AX1", abschnitt: "Anhang", layout: "ANHANG", versteckt: true, titel: "Nach der Prüfbitte: Fachergebnis und nächster Schritt",
    chips: ["beispiel", "simulation"], fussPt: FUSS, fuss: "Quelle: Pitch-Ablauf K5/K6",
    zeichne: (s) => {
      const bw = 5.9, g = CW - 2 * bw;
      [["e5-vorgang.jpg", "K5 · Vorgang zu TW-05 → BD-22", "Ausschnitt des Vorgangs: Status Prüfbitte gestellt, Statuskette mit sechs Schritten, Formular Fachergebnis eintragen (Beispieldaten, Simulation)"],
        ["e6-vormerkung.jpg", "K6 · Vorgang TW-05 → BD-22, nächster Schritt", "Ausschnitt: Kasten Nächster fachlicher Schritt, Vormerkung anlegen, Fachergebnis geeignet laut Eintrag in der Simulation, Statuskette bei Schritt 4 (Beispieldaten)"]]
        .forEach(([bild, unter, alt], i) => {
          const x = LM + i * (bw + g), datei = "ausschnitte/" + bild, gr = B.bildGroesse(datei, bw - 0.2, 2.75);
          papier(s, x, 2.15, gr.w + 0.2, gr.h + 0.2);
          B.bildPassend(s, datei, x + 0.1, 2.25, bw - 0.2, 2.75, alt);
          T(s, unter, { x, y: 2.15 + gr.h + 0.3, w: bw, h: 0.3, fontSize: 14, bold: true, color: COL.tinte2 });
        });
      T(s, "Prüfbitte legt einen Vorgang an · Fachergebnis ist ein Eintrag, keine Freigabe · nächster Schritt: Vormerkung anlegen, also unverbindlich reservieren", { x: LM, y: 5.6, w: CW, h: 0.8, fontSize: 18 });
    },
    notiz: anhangNotiz("Houssam", KURZ.ax1),
  });

  f.push({
    id: "AX2", abschnitt: "Anhang", layout: "ANHANG", versteckt: true, titel: "So rechnet die Zeitprüfung",
    fussPt: FUSS, fuss: "Quelle: Fallakte §5, docs/plattform-v2.md",
    zeichne: (s) => {
      T(s, "Prüfende = Tag der Anfrage + Prüfzeit.", { x: LM, y: 1.5, w: CW, h: 0.5, fontSize: 24, bold: true, color: COL.gruen });
      const kopf = (t) => ({ text: t, options: { bold: true, color: COL.weiss, fill: { color: COL.gruen } } });
      const z = (a, b, c, fg, bg) => [{ text: a, options: { fill: { color: bg } } }, { text: b, options: { fill: { color: bg } } }, { text: c, options: { bold: true, color: fg, fill: { color: bg } } }];
      s.addTable([
        [kopf("Anfrage"), kopf("Prüfende"), kopf("Ergebnis")],
        z("04.02.", "18.02.", "weiter prüfen", COL.okT, COL.okF),
        z("05.02.", "19.02.", "knapp", COL.achtT, COL.achtF),
        z("06.02.", "20.02.", "zu spät", COL.spaetT, COL.spaetF),
      ], { x: LM, y: 2.2, w: 8.0, colW: [2.2, 2.2, 3.6], rowH: 0.55, fontFace: B.FONT, fontSize: 20, color: COL.tinte, valign: "middle", margin: [0.05, 0.15, 0.05, 0.15], border: { type: "solid", color: COL.linie, pt: 0.75 } });
      karte(s, LM, 5.0, CW, 1.4, { fill: COL.papier, line: COL.rahmen });
      T(s, "Demo-Paare mit Beispielwerten: BD-23 Prüfzeit 14 Tage, Bestellfrist 27.11.2026 → Prüfende 02.12.2026, 5 Tage zu spät · BD-22 Prüfzeit 10 Tage, Bestellfrist 31.03.2027 → Prüfende 28.11.2026, 123 Tage vorher.", { x: LM + 0.25, y: 5.0, w: CW - 0.5, h: 1.4, fontSize: 18, valign: "middle" });
    },
    notiz: anhangNotiz("Houssam", KURZ.ax2),
  });

  f.push({
    id: "AX3", abschnitt: "Anhang", layout: "ANHANG", versteckt: true, titel: "Erkenntnis aus der Simulation: Die Restmenge fällt aus dem Blick",
    chips: ["simulation", ["fiktiv", "Fiktiver Fall"]], fussPt: FUSS, fuss: "Quelle: Fallakte §5, Variante 3; Plan Restmenge 1.1 §2",
    zeichne: (s) => {
      B.mengenleiste(s, { x: LM, y: 2.35, n: 6, belegt: 5, tw: 1.0, th: 2.7, gap: 0.28, textBelegt: "5 vorgemerkt", textOffen: "1 offen" });
      T(s, "Probeausbau am 02.02.2027 beschädigt eine Tür · 5 unverbindlich vorgemerkt, 1 offen, Bestellfrist 19.02.2027 · die Vorschau zeigt den Bedarf danach als gedeckt; die fehlende Tür steht nur in einer Notiz · nächster Ausbau (geplant, nicht umgesetzt): offene Restmenge mit Frist sichtbar halten", { x: 8.3, y: 2.15, w: 4.43, h: 4.3, fontSize: 18 });
    },
    notiz: anhangNotiz("Houssam", KURZ.ax3),
  });

  f.push({
    id: "AX4", abschnitt: "Anhang", layout: "ANHANG", versteckt: true, titel: "Wettbewerb und Abgrenzung",
    chips: ["hersteller"], fussPt: FUSS, fuss: null,
    zeichne: (s) => {
      const zeilen = [
        ["Concular (Workshop im INNOSPRINT, Folien 49 und 67): nennt „Zeitliche Unterschiede in Nachfrage und Angebot“ und „Fehlende Infrastruktur für Lagerung, Rezertifizierung und Aufbereitung“; zeigt „Interne Vermittlung“: interner Marktplatz mit „Reservieren“ und „Integration in Planungstool“ mit „Reservieren und bilanzieren“.", 1.2, COL.papier],
        ["Madaster: Materialpässe für Gebäude (laut Steckbrief); Seite „Match“ mit „Verfügbar ab“, Vorlauf und E-Mail-Benachrichtigung (laut Dokumentation, Stand 09.09.2026).", 0.85, COL.papier],
        ["Börsen wie Restado vermitteln Gebrauchtes (laut Steckbrief, nicht geprüft). Alternative: eigene Excel-Listen (laut Steckbrief).", 0.85, COL.papier],
        ["Unser Fokus: die einzelne Bestellentscheidung im laufenden Umbau – reicht die Zeit für die Fachprüfung, was fehlt, was ist der nächste Schritt. Ob andere Plattformen das ebenso abbilden, haben wir nicht geprüft.", 0.95, COL.gruenHell],
      ];
      let y = 2.15;
      for (const [t, h, fill] of zeilen) {
        karte(s, LM, y, CW, h, { fill, line: fill === COL.papier ? COL.rahmen : fill });
        T(s, t, { x: LM + 0.2, y, w: CW - 0.4, h, fontSize: 16, valign: "middle", bold: fill === COL.gruenHell });
        y += h + 0.15;
      }
    },
    notiz: anhangNotiz("Feyrouz", KURZ.ax4),
  });

  f.push({
    id: "AX5", abschnitt: "Anhang", layout: "ANHANG", versteckt: true, titel: "Grenzen der Vorschau und Nachweise",
    fussPt: FUSS, fuss: "Quelle: Fallakte §1, §4, §5, §6",
    zeichne: (s) => {
      const txt = [
        "Der späteste Tag für die Anfrage steht nicht als eigene Frist da; „Zeitkritisch“ zeigt die Bestellfrist erst sieben Tage vorher; keine Benachrichtigung.",
        "Nur Beispieldaten; Fachergebnis ist ein Eintrag; ein Scan liefert nur Vorschläge; bei Türen zählen nur gemessene Maße.",
        "Nachweise: Welche Prüfungen und Nachweise erforderlich sind, klären Fachplanung und gegebenenfalls zuständige Prüfstellen für das konkrete Bauteil und den vorgesehenen Einbau. Die Vorschau speichert keine Nachweisdokumente.",
      ];
      const g = 0.25, w = (CW - 2 * g) / 3;
      txt.forEach((t, i) => {
        const x = LM + i * (w + g);
        karte(s, x, 1.7, w, 4.4, { fill: i === 2 ? COL.papier : COL.gruenHell, line: i === 2 ? COL.rahmen : COL.gruenHell });
        T(s, t, { x: x + 0.25, y: 1.95, w: w - 0.5, h: 3.9, fontSize: 18 });
      });
    },
    notiz: anhangNotiz("Houssam", KURZ.ax5),
  });

  f.push({
    id: "AX6", abschnitt: "Anhang", layout: "ANHANG", versteckt: true, titel: "Quellen und Kennzeichnung",
    fussPt: FUSS, fuss: null,
    zeichne: (s) => {
      const zeilen = [
        [["fiktiv", "Fiktiver Fall"], "Ausgedachter Fall, mit veröffentlichten Quellen eingeordnet"],
        ["beispiel", "Die Daten der Vorschau sind fiktiv"],
        ["simulation", "Vorgänge und Ergebnisse sind Einträge, keine Fachfreigabe"],
        ["annahme", "Zum Beispiel 14 Tage Prüfzeit"],
        ["hypothese", "Vom Team erwartet, nicht belegt"],
        ["hersteller", "Laut Anbieter oder Dokumentation, nicht selbst geprüft"],
      ];
      zeilen.forEach(([c, t], i) => {
        const x = LM + (i % 2) * 6.15, y = 1.45 + Math.floor(i / 2) * 0.6;
        if (Array.isArray(c)) B.chip(s, c[0], x, y + 0.1, c[1]); else B.chip(s, c, x, y + 0.1);
        T(s, t, { x: x + 2.85, y, w: 3.2, h: 0.56, fontSize: 14, color: COL.tinte2, valign: "middle" });
      });
      karte(s, LM, 3.45, CW, 2.95, { fill: COL.papier, line: COL.rahmen });
      const o = (t, last) => ({ text: t, options: { breakLine: !last } });
      T(s, [
        { text: "Quellen mit Stand", options: { bold: true, fontSize: 16, breakLine: true } },
        o("Fallakte CF-PILOT-01 1.3 und Plan Restmenge 1.1 (16.11.2026)"),
        o("Pitch-Ablauf (16.11.2026) und Vorschau Fassung 2 (Code 2121b92)"),
        o("Stadt Dortmund, Umweltamt, INNOSPRINT 13.11.2026"),
        o("Concular, Workshop im INNOSPRINT, Folien 49/67"),
        o("Madaster-Dokumentation (09.09.2026)"),
        o("INNOSPRINT Tag 5 (13.11.2026) und Teilnahmebedingungen (01.10.2026)"),
        o("Steckbrief des Teams (13.11.2026)"),
        o("SDG 12.5 der Vereinten Nationen (sinngemäß)", true),
      ], { x: LM + 0.25, y: 3.55, w: CW - 0.5, h: 2.75, fontSize: 14, paraSpaceAfter: 3 });
    },
    notiz: anhangNotiz("Feyrouz", KURZ.ax6),
  });

  return f;
}

module.exports = { folien, TXT };
