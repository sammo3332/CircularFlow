// Folien, die in mehreren Fassungen vorkommen: Demo-Block E1-E6, Geschäftsmodell (G-GM),
// Praxistest kurz (G-PT), Anhang "Quellen und Kennzeichnung". Texte nach Folienplan + Korrekturliste.
const B = require("./bausteine");
const { COL, LM, CW, T, karte, kette, zeit4, bildPassend, bildGroesse, papier } = B;

const KOPF = (k) => `Demo-Schritt K${k} von 6 · Bildschirmfoto aus Fassung 2`;

const E_DEF = [
  {
    k: 1, titel: "Die Übersicht zeigt 8 Paare, davon 2 prüfbar, und 2 Vorgänge", bild: "k1-uebersicht.jpg",
    hl: { x: 0.19, y: 0.6, w: 0.79, h: 0.145 }, chips: ["beispiel"], spricht: "Houssam", dauer: 30,
    unter: "K1 · Übersicht",
    hinweis: "Hervorgehoben: Positionen in den nächsten 90 Tagen, Paare derselben Gruppe, Vorgänge je Status.",
    alt: "Bildschirmfoto der Übersicht: 9 Positionen in 90 Tagen, 8 Paare davon 2 prüfbar, 2 Vorgänge (Beispieldaten)",
    text: "Das ist die Übersicht der Vorschau. Alle Daten sind Beispieldaten. Der Stichtag der Demo ist ein gewählter Zeitpunkt in der Simulation: Mittwoch, 18. November, 14 Uhr. Zeitkritisch zeigt die Fristen der nächsten sieben Tage. Darunter: neun Positionen werden in den nächsten 90 Tagen verfügbar, ohne festes Ziel. Ein Paar ist ein Angebot und ein Bedarf derselben Bauteilgruppe. Wir haben acht Paare, davon zwei prüfbar, und zwei Vorgänge. Weiter unten zeigt die Übersicht die Verfügbarkeit je Monat. Zahlen zu Kosten, CO₂ oder Abfall zeigt sie bewusst nicht, weil Daten fehlen.",
    klick: "Klick: Startseite Übersicht. Optional nach unten scrollen zur Verfügbarkeit je Monat.",
  },
  {
    k: 2, titel: "Jedes Paar hat ein Ergebnis mit Grund", bild: "k2-paarliste.jpg",
    hl: { x: 0.19, y: 0.31, w: 0.575, h: 0.055 }, chips: ["beispiel"], spricht: "Houssam", dauer: 25,
    unter: "K2 · Liste der 8 Paare derselben Gruppe",
    hinweis: "Hervorgehoben: die Filter nach Ergebnis, zum Beispiel Weiter prüfen 2 und Für diese Entscheidung zu spät 2.",
    alt: "Bildschirmfoto der Paarliste mit Filtern: Alle 8, Weiter prüfen 2, Knapp 0, Angaben fehlen 4, Klärung nötig 0, zu spät 2 (Beispieldaten)",
    text: "Ein Klick auf die Acht öffnet die Liste. Jedes Paar hat ein Ergebnis: zwei Mal weiter prüfen, vier Mal Angaben fehlen, zwei Mal für diese Entscheidung zu spät. Geprüft werden Typ, Menge, Zeit und Entfernung. Wichtig: Der Abgleich ist ein Vorschlag zur Prüfung, keine fachliche Freigabe.",
    klick: "Klick: In der Kachel Paare derselben Gruppe auf die große Zahl 8 Paare klicken.",
  },
  {
    k: 3, titel: "Dieses Paar ist zu spät: Die Prüfung endet 5 Tage nach der Bestellfrist", bild: "k3-zu-spaet.jpg",
    hl: { x: 0.2, y: 0.478, w: 0.32, h: 0.045 }, chips: ["beispiel"], spricht: "Feyrouz", dauer: 30,
    unter: "K3 · Abgleich TW-01 → BD-23 (Systemtrennwand)",
    hinweis: "Hervorgehoben: Prüfende 02.12.2026 liegt 5 Tage nach der Bestellfrist 27.11.2026. Die Prüfbitte ist gesperrt.",
    alt: "Bildschirmfoto des Abgleichs TW-01 und BD-23: Für diese Entscheidung zu spät, Prüfende 02.12.2026 liegt 5 Tage nach der Bestellfrist 27.11.2026 (Beispieldaten)",
    text: "Nehmen wir ein Paar, das zu spät ist, eine Systemtrennwand. Die Prüfung wäre erst am 2. Dezember 2026 fertig. Die Bestellfrist des Bedarfs ist der 27. November, fünf Tage früher. Die Prüfbitte ist gesperrt, der Grund steht direkt daneben. Der nächste Schritt für die Planung: klären, ob die Bestellentscheidung noch offen ist. Die 14 Tage Mindestprüfzeit sind eine Beispielannahme.",
    klick: "Klick: Zeile TW-01 → BD-23 („Für diese Entscheidung zu spät“).",
  },
  {
    k: 4, titel: "Dieses Paar passt zeitlich: Prüfende 123 Tage vor der Bestellfrist", bild: "k4-weiter-pruefen.jpg",
    hl: { x: 0.2, y: 0.436, w: 0.33, h: 0.04 }, chips: ["beispiel"], spricht: "Houssam", dauer: 30,
    unter: "K4 · Abgleich TW-05 → BD-22 (Systemtrennwand)",
    hinweis: "Hervorgehoben: Prüfende 28.11.2026 liegt 123 Tage vor der Bestellfrist 31.03.2027.",
    alt: "Bildschirmfoto des Abgleichs TW-05 und BD-22: Weiter prüfen, Prüfende 28.11.2026 liegt 123 Tage vor der Bestellfrist 31.03.2027 (Beispieldaten)",
    text: "Zurück zur Liste, jetzt ein Paar mit dem Ergebnis weiter prüfen, wieder eine Systemtrennwand. Die Prüfung wäre am 28. November 2026 fertig, 123 Tage vor der Bestellfrist am 31. März 2027. Weiter unten stehen die Prüfpunkte und die Entfernung, etwa 7,9 Kilometer, die Lage ist nur symbolisch. Auch hier gilt: Mindestprüfzeit und Annahmefenster sind Beispielannahmen, kein Beleg aus einem echten Projekt.",
    klick: "Klick: Oben im Pfad Paare derselben Gruppe, dann Zeile TW-05 → BD-22 („Weiter prüfen“).",
  },
  {
    k: 5, titel: "Die Prüfbitte legt einen Vorgang an, das Fachergebnis ist ein Eintrag", bild: "k5-vorgang.jpg",
    hl: { x: 0.012, y: 0.19, w: 0.975, h: 0.1 }, chips: ["beispiel", "simulation"], spricht: "Houssam", dauer: 25,
    unter: "K5 · Vorgang zu TW-05 → BD-22",
    hinweis: "Hervorgehoben: die Statuskette mit sechs Schritten, aktuell „Prüfbitte gestellt“. Darunter das Formular „Fachergebnis eintragen“.",
    alt: "Bildschirmfoto des Vorgangs: Status Prüfbitte gestellt, Statuskette mit sechs Schritten, Formular Fachergebnis eintragen (Beispieldaten, Simulation)",
    text: "Mit „Prüfbitte anlegen“ entsteht ein Vorgang. Die Kette zeigt sechs Schritte, von der Zuordnung bis zur Übergabe. Jetzt trägt jemand das Fachergebnis ein: geeignet, mit dem Namen einer Fachperson, hier ein Beispiel. Das ist ein Eintrag in der Simulation. Geprüft hat hier niemand, und es wird nichts versendet und niemand kontaktiert.",
    klick: "Klick: Prüfbitte anlegen.",
  },
  {
    k: 6, titel: "Der nächste Schritt heißt „Vormerkung anlegen“, hier endet die Demo", bild: "k6-vormerkung-anlegen.jpg",
    hl: { x: 0.19, y: 0.27, w: 0.485, h: 0.355 }, chips: ["beispiel", "simulation"], spricht: "Houssam", dauer: 25,
    unter: "K6 · Vorgang TW-05 → BD-22, nächster Schritt",
    hinweis: "Hervorgehoben: Nächster fachlicher Schritt · Vormerkung anlegen, laut Eintrag (Simulation), keine Fachfreigabe.",
    alt: "Bildschirmfoto: Kasten Nächster fachlicher Schritt, Vormerkung anlegen, Fachergebnis geeignet laut Eintrag in der Simulation (Beispieldaten)",
    text: "Der Vorgang steht jetzt auf geeignet, laut Eintrag. Oben steht der nächste fachliche Schritt: Vormerkung anlegen. Hier endet unsere Demo. Eine Vormerkung wäre unverbindlich und ebenfalls Simulation. Die Software prüft also die Zeit und zeigt den nächsten Schritt. Die fachliche Prüfung machen weiterhin Fachleute.",
    klick: "Klick: Geeignet wählen, unter Name der Fachperson „Fachplanung (Beispiel)“ eintragen, Fachergebnis eintragen, dann hochscrollen zum Kasten Nächster fachlicher Schritt: Vormerkung anlegen. Hier endet die Demo.",
  },
];

// Kürzungen je Fassung ("A", "B", "C")
function kuerzung(modus, k) {
  const bleibt5 = [1, 3, 4].includes(k);
  if (modus === "C") return { min5: "entfällt (nur auf Nachfrage in der Fragerunde).", min3: "entfällt." };
  const min5 = bleibt5 ? "bleibt." : "entfällt.";
  let min3 = "entfällt.";
  if (modus === "B" && (k === 3 || k === 4)) min3 = "als sichtbare Bildfolie zeigen (Kopie der Demo-Folie, sichtbar gestellt, etwa 25 Sekunden).";
  return { min5, min3 };
}

function eFolien(modus, abschnitt, zurueckId) {
  return E_DEF.map((e) => {
    const k = e.k, nextId = k < 6 ? `E${k + 1}` : null;
    const kz = kuerzung(modus, k);
    return {
      id: `E${k}`, abschnitt, layout: "DEMO", versteckt: true, titel: e.titel, kopf: KOPF(k), chips: e.chips,
      fuss: "Quelle: PA; Bildschirmfoto aus Fassung 2 (Code 2121b92), Beispieldaten, Stichtag der Demo Mi 18.11.2026, 14:00 (Simulation)",
      zeichne: (s, ctx) => {
        const g = bildGroesse(e.bild, 7.7, 4.0);
        papier(s, LM, 2.15, g.w + 0.2, g.h + 0.2);
        bildPassend(s, e.bild, LM + 0.1, 2.25, 7.7, 4.0, e.alt);
        const hl = e.hl, ix = LM + 0.1, iy = 2.25;
        s.addShape(B.getP().ShapeType.rect, {
          x: ix + hl.x * g.w, y: iy + hl.y * g.h, w: hl.w * g.w, h: hl.h * g.h,
          fill: { color: COL.weiss, transparency: 100 }, line: { color: COL.hinwT, width: 3 },
        });
        const x2 = LM + g.w + 0.2 + 0.35, w2 = 12.73 - x2;
        T(s, e.unter, { x: x2, y: 2.15, w: w2, h: 0.75, fontSize: 18, bold: true });
        T(s, e.hinweis, { x: x2, y: 3.0, w: w2, h: 1.6, fontSize: 14, color: COL.tinte2 });
        if (nextId) {
          T(s, [{ text: "weiter ›", options: { hyperlink: { slide: ctx.nr[nextId], tooltip: "Nächster Demo-Schritt" } } }],
            { x: x2, y: 5.65, w: w2, h: 0.35, fontSize: 16 });
        }
        T(s, [{ text: "zurück zum Vortrag", options: { hyperlink: { slide: ctx.nr[zurueckId], tooltip: "Zurück zum Vortrag" } } }],
          { x: x2, y: 6.05, w: w2, h: 0.35, fontSize: 16 });
      },
      notiz: { spricht: e.spricht, text: e.text, klick: e.klick, min5: kz.min5, min3: kz.min3, dauer: e.dauer },
    };
  });
}

// ---------- Demo-Ankündigung (A4 / B2) ----------
function demoAnkuendigung({ id, abschnitt, titel, zeile1, zeile3, spricht, text, min5, min3, fuss }) {
  return {
    id, abschnitt, layout: "INHALT", titel, chips: ["beispiel", "simulation"], fuss,
    zeichne: (s, ctx) => {
      T(s, zeile1, { x: LM, y: 2.2, w: CW, h: 0.4, fontSize: 20, bold: true });
      T(s, "Stichtag der Demo: Mi 18.11., 14:00 (Simulation), nicht das heutige Datum", { x: LM, y: 2.65, w: CW, h: 0.35, fontSize: 16, color: COL.tinte2 });
      T(s, zeile3, { x: LM, y: 3.05, w: CW, h: 0.35, fontSize: 16, color: COL.tinte2 });
      kette(s, { x: LM, y: 3.75, w: CW });
      const ks = ["K1 Übersicht", "K2 Paarliste", "K3 Zu spät", "K4 Weiter prüfen", "K5 Prüfbitte", "K6 Vormerkung"];
      const col = CW / 6;
      ks.forEach((t, i) => {
        s.addText(t, {
          shape: B.getP().ShapeType.roundRect, rectRadius: 0.06, x: LM + i * col, y: 5.2, w: col - 0.15, h: 0.5,
          fill: { color: COL.gruenHell }, line: { color: COL.gruenHell, width: 0.5 },
          fontFace: B.FONT, fontSize: 14, bold: true, color: COL.gruen, align: "left", valign: "middle", margin: [0, 0, 0, 0.12], fit: "none",
        });
      });
      T(s, [{ text: "Ersatzfolien", options: { hyperlink: { slide: ctx.nr.E1, tooltip: "Demo als Bildfolgen (Ersatz)" } } }],
        { x: 11.2, y: 6.05, w: 1.53, h: 0.32, fontSize: 14, align: "right" });
    },
    notiz: { spricht, text, min5, min3 },
  };
}

// ---------- G-GM Geschäftsmodell ----------
function geschaeftsmodell({ id, abschnitt }) {
  return {
    id, abschnitt, layout: "INHALT", titel: "Wer zahlen könnte, ist eine Hypothese: Zahlungsbereitschaft ist ungeprüft",
    chips: ["hypothese"], fuss: "Quelle: LA; RP",
    zeichne: (s) => {
      const w = 3.55, g = 0.74, y = 2.2, h = 2.75;
      const k = [
        ["Nutzen", "Eigentümer, öffentliche Einrichtungen und Wohnungsunternehmen könnten für ein Zielbild von Frühwarnung und Koordination zahlen.", COL.gruenHell, COL.gruenHell],
        ["Leistung", "Betriebe für Prüfung, Ausbau, Transport, Lager und Wiedereinbau könnten Aufträge bekommen.", COL.gruenHell, COL.gruenHell],
        ["Zahlt?", "Ungeprüft: Zahlungsbereitschaft, Budget, Preis. Kein Preis, keine Zahl.", COL.hinwF, COL.hinwF],
      ];
      k.forEach(([kopf, txt, f, l], i) => {
        const x = LM + i * (w + g);
        karte(s, x, y, w, h, { fill: f, line: l });
        T(s, i === 2 ? [{ text: kopf + " ", options: { bold: true, fontSize: 22 } }, { text: "?", options: { bold: true, fontSize: 36, color: COL.hinwT } }] : kopf, { x: x + 0.25, y: y + 0.2, w: w - 0.5, h: 0.6, fontSize: 22, bold: true, color: COL.gruen });
        T(s, txt, { x: x + 0.25, y: y + 0.85, w: w - 0.5, h: h - 1.0, fontSize: 16 });
        if (i < 2) s.addShape(B.getP().ShapeType.rightArrow, { x: x + w + 0.12, y: y + h / 2 - 0.2, w: g - 0.24, h: 0.4, fill: { color: COL.tinte3 }, line: { color: COL.tinte3, width: 0.25 } });
      });
      karte(s, LM, 5.15, CW, 1.2, { fill: COL.papier, line: COL.rahmen });
      T(s, [
        { text: "Die heutige Vorschau benachrichtigt niemanden.", options: { bold: true, breakLine: true } },
        { text: "Zusammenarbeit mit bestehenden Lösungen ist eine Teamidee: Der Lösungsansatz bindet qualifizierte Fachleute und bestehende Lösungen für Materialprüfung, Rückbau und Wiederverwendung in den Prozess ein.", options: {} },
      ], { x: LM + 0.25, y: 5.25, w: CW - 0.5, h: 1.0, fontSize: 16, valign: "middle" });
    },
    notiz: {
      spricht: "Feyrouz",
      text: "Zum Geschäftsmodell haben wir eine Hypothese, keine Zahlen. Eigentümer, öffentliche Einrichtungen und Wohnungsunternehmen könnten für ein Zielbild von Frühwarnung und Koordination zahlen. Die heutige Vorschau benachrichtigt niemanden. Betriebe für Prüfung, Ausbau, Transport und Lager könnten Aufträge bekommen. Unser Lösungsansatz bindet qualifizierte Fachleute und bestehende Lösungen für Materialprüfung, Rückbau und Wiederverwendung in den Prozess ein. Ob jemand zahlen würde, wer das Budget hat und in welcher Höhe, haben wir nicht geprüft.",
    },
  };
}

// ---------- G-PT Praxistest kurz (A, B) ----------
function praxistestKurz({ id, abschnitt }) {
  return {
    id, abschnitt, layout: "INHALT", titel: "Der nächste Test ist klein: ein echter Fall, vier Zeitpunkte, eine Mindestprüfzeit",
    chips: [["annahme", "Annahme, unbestätigt: 14 Tage"], "vorschlagTest"], fuss: "Quelle: FA §11; RP",
    zeichne: (s) => {
      zeit4(s, {
        x: LM + 0.1, y: 2.3, w: CW - 0.2,
        fragen: ["Wann wurde das Angebot bekannt?", "Wann erreichte es die zuständige Person?", "Bis wann musste sie entscheiden?", "Wann war die Übergabe möglich?"],
      });
      const w = 3.9, g = 0.215, y = 4.55, h = 1.8;
      const k = [
        ["Klären", "Stimmen 14 Tage Mindestprüfzeit?", COL.achtF],
        ["Signal", "Eine dokumentierte Angabe mit Quelle.", COL.gruenHell],
        ["Grenze", "Ein Einzelfall belegt keinen Markt.", COL.papier],
      ];
      k.forEach(([kopf, txt, f], i) => {
        const x = LM + i * (w + g);
        karte(s, x, y, w, h, { fill: f, line: f === COL.papier ? COL.rahmen : f });
        T(s, kopf, { x: x + 0.25, y: y + 0.18, w: w - 0.5, h: 0.4, fontSize: 20, bold: true, color: COL.gruen });
        T(s, txt, { x: x + 0.25, y: y + 0.7, w: w - 0.5, h: h - 0.8, fontSize: 16 });
      });
    },
    notiz: {
      spricht: "Feyrouz",
      text: "Unser nächster Schritt ist klein. Für den nächsten Schritt suchen wir einen echten Fall: eine Planerin oder einen Planer, die oder der einen Fall mit uns durchgeht. Wann wurde das Angebot bekannt? Wann erreichte es die zuständige Person? Bis wann musste sie entscheiden? Wann war die Übergabe möglich? Daraus sehen wir, ob 14 Tage Mindestprüfzeit stimmen. Das Signal wäre eine dokumentierte Angabe mit Quelle. Ein Einzelfall belegt keinen Markt. Schlusssatz (Houssam): Wer so einen Fall hat, spricht uns nach dem Pitch an.",
    },
  };
}

// ---------- Anhang ----------
function anhang({ id, abschnitt, hinweisFassung }) {
  return {
    id, abschnitt, layout: "ANHANG", versteckt: true, titel: "Anhang: Quellen und Kennzeichnung", fuss: null,
    zeichne: (s) => {
      const zeilen = [
        ["fiktiv", "Ausgedachter Fall, mit veröffentlichten Quellen eingeordnet"],
        ["beispiel", "Die Daten der Vorschau sind fiktiv"],
        ["simulation", "Vorgänge und Ergebnisse sind Einträge, keine Fachfreigabe"],
        ["annahme", "Zum Beispiel 14 Tage Mindestprüfzeit"],
        ["hypothese", "Vom Team erwartet, nicht belegt"],
        ["hersteller", "Laut Anbieter oder Dokumentation, nicht selbst geprüft"],
      ];
      zeilen.forEach(([c, t], i) => {
        const y = 1.7 + i * 0.64;
        B.chip(s, c, LM, y + 0.08);
        T(s, t, { x: 3.4, y, w: 3.15, h: 0.56, fontSize: 14, color: COL.tinte2, valign: "middle" });
      });
      karte(s, 6.9, 1.7, 5.83, 3.85, { fill: COL.papier, line: COL.rahmen });
      T(s, [
        { text: "Quellen mit Stand", options: { bold: true, fontSize: 16, breakLine: true } },
        { text: "FA: Fallakte CF-PILOT-01, Fassung 1.3, 16.11.2026", options: { breakLine: true } },
        { text: "PA: Pitch-Ablauf, Stand 16.11.2026 (Vorschau Version 2, Code 2121b92)", options: { breakLine: true } },
        { text: "PV2: Plattform Fassung 2.0", options: { breakLine: true } },
        { text: "PB: Produktbrief v0.2, 08.11.2026", options: { breakLine: true } },
        { text: "LA: Lösungsansatz, RP: Rechercheplan (beide Team)", options: { breakLine: true } },
        { text: "Concular Exchange: laut Anbieter, Stand 08.11.2026, nicht erneut geprüft", options: { breakLine: true } },
        { text: "Madaster Match: laut Dokumentation, zuletzt bearbeitet 09.09.2026", options: { breakLine: true } },
        { text: "Concular Handlungsempfehlung 12/2024, PDF-S. 38", options: { breakLine: true } },
        { text: "BLB NRW, 02.12.2024", options: {} },
      ], { x: 7.1, y: 1.85, w: 5.45, h: 3.5, fontSize: 14, paraSpaceAfter: 2 });
      karte(s, LM, 5.7, CW, 0.75, { fill: COL.gruenHell });
      T(s, "Alle Daten sind Beispieldaten oder ein fiktiver Pilotfall; Nachrechnung mit dem Fachkern von Fassung 2; keine Praxisdaten. Sprechzeiten sind Schätzungen, keine Pitchdauer vom Veranstalter belegt.",
        { x: LM + 0.25, y: 5.72, w: CW - 0.5, h: 0.7, fontSize: 14, valign: "middle" });
    },
    notiz: { spricht: "Houssam", text: "Nicht gesprochen. Nachschlagefolie für die Jury und die Fragerunde: Quellen mit Stand und die Bedeutung der Kennzeichnungen. " + (hinweisFassung || ""), dauer: 0 },
  };
}

module.exports = { eFolien, demoAnkuendigung, geschaeftsmodell, praxistestKurz, anhang };
