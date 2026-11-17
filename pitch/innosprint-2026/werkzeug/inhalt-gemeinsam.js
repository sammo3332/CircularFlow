// Folien, die in mehreren Fassungen vorkommen: Demo-Block E1-E6, Geschäftsmodell (G-GM),
// Praxistest kurz (G-PT), Anhang "Quellen und Kennzeichnung". Texte nach Folienplan + Korrekturliste.
const B = require("./bausteine");
const { COL, LM, CW, T, karte, kette, zeit4, bildPassend, bildGroesse, papier } = B;

const KOPF = (k) => `Demo-Schritt K${k} von 6 · Bildschirmfoto aus Fassung 2`;

const E_DEF = [
  {
    k: 1, titel: "Die Übersicht zeigt 8 Paare, davon 2 prüfbar, und 2 Vorgänge", bild: "e1-uebersicht.jpg", seite: true,
    chips: ["beispiel"], spricht: "Houssam", dauer: 30,
    unter: "K1 · Übersicht",
    hinweis: "Ausschnitt: Zeitkritisch und die Kacheln. Rahmen: Positionen, Paare, Vorgänge.",
    alt: "Ausschnitt der Übersicht: Zeitkritisch mit 4 Fristen, 9 Positionen in 90 Tagen, 8 Paare davon 2 prüfbar, 2 Vorgänge (Beispieldaten)",
    text: "Das ist die Übersicht der Vorschau. Alle Daten sind Beispieldaten. Der Stichtag der Demo ist ein gewählter Zeitpunkt in der Simulation: Mittwoch, 18. November, 14 Uhr. Zeitkritisch zeigt die Fristen der nächsten sieben Tage. Darunter: neun Positionen werden in den nächsten 90 Tagen verfügbar, ohne festes Ziel. Ein Paar ist ein Angebot und ein Bedarf derselben Bauteilgruppe. Wir haben acht Paare, davon zwei prüfbar, und zwei Vorgänge. Ein Vorgang entsteht mit der Prüfbitte. Weiter unten zeigt die Übersicht die Verfügbarkeit je Monat. Zahlen zu Kosten, CO₂ oder Abfall zeigt sie bewusst nicht, weil Daten fehlen.",
    klick: "Klick: Startseite Übersicht. Optional nach unten scrollen zur Verfügbarkeit je Monat.",
  },
  {
    k: 2, titel: "Jedes Paar hat ein Ergebnis mit Grund", bild: "e2-paarliste.jpg", seite: false,
    chips: ["beispiel"], spricht: "Houssam", dauer: 25,
    unter: "K2 · Liste der 8 Paare derselben Gruppe",
    hinweis: "Ausschnitt: Filter nach Ergebnis (Rahmen) und die ersten Zeilen der Tabelle.",
    alt: "Ausschnitt der Paarliste mit Filtern: Alle 8, Weiter prüfen 2, Knapp 0, Angaben fehlen 4, Klärung nötig 0, zu spät 2, und drei Tabellenzeilen (Beispieldaten)",
    text: "Ein Klick auf die Acht öffnet die Liste. Jedes Paar hat ein Ergebnis: zwei Mal weiter prüfen, vier Mal Angaben fehlen, zwei Mal für diese Entscheidung zu spät. Angaben fehlen heißt: Für den Abgleich fehlt noch etwas, zum Beispiel eine Frist. Geprüft werden Typ, Menge, Zeit und Entfernung. Wichtig: Der Abgleich ist ein Vorschlag zur Prüfung, keine fachliche Freigabe.",
    klick: "Klick: In der Kachel Paare derselben Gruppe auf die große Zahl 8 Paare klicken.",
  },
  {
    k: 3, titel: "Dieses Paar ist zu spät: Die Prüfung endet 5 Tage nach der Bestellfrist", bild: "e3-zu-spaet.jpg", seite: true,
    chips: ["beispiel"], spricht: "Feyrouz", dauer: 30,
    unter: "K3 · Abgleich TW-01 → BD-23 (Systemtrennwand)",
    hinweis: "Rahmen: Prüfende 02.12.2026 liegt 5 Tage nach der Bestellfrist 27.11.2026. Die Prüfbitte ist gesperrt.",
    alt: "Ausschnitt des Abgleichs TW-01 und BD-23: Für diese Entscheidung zu spät, Prüfende 02.12.2026 liegt 5 Tage nach der Bestellfrist 27.11.2026, Prüfbitte gesperrt (Beispieldaten)",
    text: "Nehmen wir ein Paar, das zu spät ist, eine Systemtrennwand. Die Prüfung wäre erst am 2. Dezember 2026 fertig. Die Bestellfrist des Bedarfs ist der 27. November, fünf Tage früher. Die Prüfbitte ist gesperrt, der Grund steht direkt daneben. Der nächste Schritt für die Planung: klären, ob die Bestellentscheidung noch offen ist. Die 14 Tage Mindestprüfzeit sind eine Beispielannahme.",
    klick: "Klick: Zeile TW-01 → BD-23 („Für diese Entscheidung zu spät“).",
  },
  {
    k: 4, titel: "Dieses Paar passt zeitlich: Prüfende 123 Tage vor der Bestellfrist", bild: "e4-weiter-pruefen.jpg", seite: true,
    chips: ["beispiel"], spricht: "Houssam", dauer: 30,
    unter: "K4 · Abgleich TW-05 → BD-22 (Systemtrennwand)",
    hinweis: "Rahmen: Prüfende 28.11.2026 liegt 123 Tage vor der Bestellfrist 31.03.2027.",
    alt: "Ausschnitt des Abgleichs TW-05 und BD-22: Weiter prüfen, Prüfende 28.11.2026 liegt 123 Tage vor der Bestellfrist 31.03.2027 (Beispieldaten)",
    text: "Zurück zur Liste, jetzt ein Paar mit dem Ergebnis weiter prüfen, wieder eine Systemtrennwand. Die Prüfung wäre am 28. November 2026 fertig, 123 Tage vor der Bestellfrist am 31. März 2027. Hier hat der Bedarf eine Mindestprüfzeit von zehn Tagen. Auch das ist ein Beispielwert. Das Annahmefenster ist der Zeitraum, in dem das Projekt die Teile annehmen kann. Weiter unten stehen die Prüfpunkte und die Entfernung, etwa 7,9 Kilometer, die Lage ist nur symbolisch.",
    klick: "Klick: Oben im Pfad Paare derselben Gruppe, dann Zeile TW-05 → BD-22 („Weiter prüfen“).",
  },
  {
    k: 5, titel: "Die Prüfbitte legt einen Vorgang an, das Fachergebnis ist ein Eintrag", bild: "e5-vorgang.jpg", seite: true,
    chips: ["beispiel", "simulation"], spricht: "Houssam", dauer: 25,
    unter: "K5 · Vorgang zu TW-05 → BD-22",
    hinweis: "Rahmen: die Statuskette, aktuell „Prüfbitte gestellt“. Darunter das Formular „Fachergebnis eintragen“.",
    alt: "Ausschnitt des Vorgangs: Status Prüfbitte gestellt, Statuskette mit sechs Schritten, Formular Fachergebnis eintragen (Beispieldaten, Simulation)",
    text: "Mit „Prüfbitte anlegen“ entsteht ein Vorgang. Die Kette zeigt sechs Schritte, von der Zuordnung bis zur Übergabe. Jetzt trägt jemand das Fachergebnis ein: geeignet, mit dem Namen einer Fachperson, hier ein Beispiel. Das ist ein Eintrag in der Simulation. Geprüft hat hier niemand, und es wird nichts versendet und niemand kontaktiert.",
    klick: "Klick: Prüfbitte anlegen.",
  },
  {
    k: 6, titel: "Der nächste Schritt heißt „Vormerkung anlegen“, hier endet die Demo", bild: "e6-vormerkung.jpg", seite: true,
    chips: ["beispiel", "simulation"], spricht: "Houssam", dauer: 25,
    unter: "K6 · Vorgang TW-05 → BD-22, nächster Schritt",
    hinweis: "Rahmen: Nächster fachlicher Schritt „Vormerkung anlegen“ und Schritt 4 der Kette. Laut Eintrag (Simulation), keine Fachfreigabe.",
    alt: "Ausschnitt: Kasten Nächster fachlicher Schritt, Vormerkung anlegen, Fachergebnis geeignet laut Eintrag in der Simulation, Statuskette bei Schritt 4 (Beispieldaten)",
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
      fuss: "Quelle: Pitch-Ablauf; Bildschirmfoto aus Fassung 2 (Code 2121b92), Beispieldaten, Stichtag der Demo Mi 18.11.2026, 14:00 (Simulation)",
      zeichne: (s, ctx) => {
        const datei = "ausschnitte/" + e.bild;
        const maxH = e.seite ? 4.0 : 3.55;
        const g = bildGroesse(datei, CW - 0.2, maxH);
        papier(s, LM, 2.15, g.w + 0.2, g.h + 0.2);
        bildPassend(s, datei, LM + 0.1, 2.25, CW - 0.2, maxH, e.alt);
        const ix = LM + 0.1, iy = 2.25;
        for (const hl of B.ausschnittRahmen(e.bild)) {
          s.addShape(B.getP().ShapeType.rect, {
            x: ix + hl[0] * g.w, y: iy + hl[1] * g.h, w: hl[2] * g.w, h: hl[3] * g.h,
            fill: { color: COL.weiss, transparency: 100 }, line: { color: COL.hinwT, width: 2.5 },
          });
        }
        const link = (text, id, tip, o) => T(s, [{ text, options: { hyperlink: { slide: ctx.nr[id], tooltip: tip } } }], Object.assign({ fontSize: 16 }, o));
        if (e.seite) {
          const x2 = LM + g.w + 0.2 + 0.35, w2 = 12.73 - x2;
          T(s, e.unter, { x: x2, y: 2.15, w: w2, h: 0.9, fontSize: 18, bold: true });
          T(s, e.hinweis, { x: x2, y: 3.1, w: w2, h: 1.9, fontSize: 14, color: COL.tinte2 });
          if (nextId) link("weiter ›", nextId, "Nächster Demo-Schritt", { x: x2, y: 5.55, w: w2, h: 0.35 });
          link("zurück zum Vortrag", zurueckId, "Zurück zum Vortrag", { x: x2, y: 5.95, w: w2, h: 0.35 });
        } else {
          const y = 2.15 + g.h + 0.2 + 0.1;
          T(s, [{ text: e.unter, options: { bold: true, fontSize: 18, breakLine: true } }, { text: e.hinweis, options: { fontSize: 14, color: COL.tinte2 } }], { x: LM, y, w: 8.0, h: 0.75 });
          if (nextId) link("weiter ›", nextId, "Nächster Demo-Schritt", { x: 9.2, y, w: 3.53, h: 0.35, align: "right" });
          link("zurück zum Vortrag", zurueckId, "Zurück zum Vortrag", { x: 9.2, y: y + 0.38, w: 3.53, h: 0.35, align: "right" });
        }
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
      T(s, "Unsere sechs Demo-Schritte", { x: LM, y: 3.85, w: CW, h: 0.4, fontSize: 20, bold: true, color: COL.gruen });
      const ks = [["K1", "Übersicht"], ["K2", "Paarliste"], ["K3", "Zu spät"], ["K4", "Weiter prüfen"], ["K5", "Prüfbitte"], ["K6", "Vormerkung"]];
      const g = 0.15, col = (CW - 5 * g) / 6;
      ks.forEach(([k, t], i) => {
        const x = LM + i * (col + g);
        karte(s, x, 4.4, col, 1.15, { fill: COL.gruenHell });
        T(s, k, { x: x + 0.15, y: 4.5, w: col - 0.3, h: 0.4, fontSize: 22, bold: true, color: COL.gruen });
        T(s, t, { x: x + 0.15, y: 4.98, w: col - 0.3, h: 0.5, fontSize: 16 });
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
    chips: ["hypothese"], fuss: "Quelle: Lösungsansatz des Teams; Rechercheplan des Teams",
    zeichne: (s) => {
      const w = 3.9, g = 0.215, y = 2.15, h = 3.1;
      const k = [
        ["Wer hätte den Nutzen?", [
          ["Eigentümer, öffentliche Einrichtungen, Wohnungsunternehmen (Zielbild: Frühwarnung und Koordination)", {}],
          ["Betriebe für Prüfung, Ausbau, Transport, Lager, Wiedereinbau (mögliche Aufträge)", {}]], COL.gruenHell],
        ["Wofür könnte man zahlen?", [
          ["Offen, zum Beispiel ein Pilot in einem Projekt oder die laufende Nutzung.", {}],
          ["Alternative: Zusammenarbeit mit bestehenden Lösungen (Lösungsansatz des Teams).", {}]], COL.gruenHell],
        ["Ungeprüft", [
          ["Zahlungsbereitschaft, Budget, Preis.", {}],
          ["Kein Preis, keine Zahl.", { bold: true }]], COL.hinwF],
      ];
      k.forEach(([kopf, absaetze, f], i) => {
        const x = LM + i * (w + g);
        karte(s, x, y, w, h, { fill: f, line: f });
        T(s, kopf, { x: x + 0.25, y: y + 0.2, w: w - 0.5, h: 0.45, fontSize: 18, bold: true, color: i === 2 ? COL.hinwT : COL.gruen });
        const runs = absaetze.map(([t, o], j) => ({ text: t, options: Object.assign({}, o, { breakLine: j < absaetze.length - 1 }) }));
        T(s, runs, { x: x + 0.25, y: y + 0.8, w: w - 0.5, h: h - 0.95, fontSize: 16, paraSpaceAfter: 10 });
      });
      karte(s, LM, 5.45, CW, 0.95, { fill: COL.papier, line: COL.rahmen });
      T(s, "Die heutige Vorschau benachrichtigt niemanden.", { x: LM + 0.25, y: 5.5, w: CW - 0.5, h: 0.85, fontSize: 20, bold: true, valign: "middle" });
    },
    notiz: {
      spricht: "Feyrouz",
      text: "Zum Geschäftsmodell haben wir eine Hypothese, keine Zahlen. Eigentümer, öffentliche Einrichtungen und Wohnungsunternehmen könnten für ein Zielbild von Frühwarnung und Koordination zahlen. Die heutige Vorschau benachrichtigt niemanden. Betriebe für Prüfung, Ausbau, Transport, Lager und Wiedereinbau könnten Aufträge bekommen. Wofür man zahlen könnte, ist offen: zum Beispiel ein Pilot in einem Projekt oder die laufende Nutzung. Eine Alternative ist die Zusammenarbeit mit bestehenden Lösungen: Unser Lösungsansatz bindet qualifizierte Fachleute und bestehende Lösungen für Materialprüfung, Rückbau und Wiederverwendung in den Prozess ein. Ob jemand zahlen würde, wer das Budget hat und in welcher Höhe, haben wir nicht geprüft.",
    },
  };
}

// ---------- G-PT Praxistest kurz (A, B) ----------
function praxistestKurz({ id, abschnitt }) {
  return {
    id, abschnitt, layout: "INHALT", titel: "Der nächste Test ist klein: ein echter Fall, vier Zeitpunkte, eine Mindestprüfzeit",
    chips: [["annahme", "Annahme, unbestätigt: 14 Tage"], "vorschlagTest"], fuss: "Quelle: Fallakte CF-PILOT-01 §11; Rechercheplan des Teams",
    zeichne: (s) => {
      zeit4(s, {
        x: LM + 0.1, y: 2.3, w: CW - 0.2,
        fragen: ["Wann wurde das Angebot bekannt?", "Wann erreichte es die zuständige Person?", "Bis wann musste sie entscheiden?", "Wann war die Übergabe möglich?"],
      });
      const w = 3.9, g = 0.215, y = 4.55, h = 1.8;
      const k = [
        ["Klären", "Stimmen 14 Tage Mindestprüfzeit?", COL.achtF],
        ["Signal", "Eine dokumentierte Prüfzeit mit Quelle.", COL.gruenHell],
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
      text: "Unser nächster Schritt ist klein. Für den nächsten Schritt suchen wir einen echten Fall: jemanden aus der Planung, der oder die einen Fall mit uns durchgeht. Wann wurde das Angebot bekannt? Wann erreichte es die zuständige Person? Bis wann musste sie entscheiden? Wann war die Übergabe möglich? Daraus sehen wir, ob 14 Tage Mindestprüfzeit stimmen. Das Signal wäre eine dokumentierte Prüfzeit mit Quelle. Ein Einzelfall belegt keinen Markt. Schlusssatz (Houssam): Wer so einen Fall hat, spricht uns nach dem Pitch an.",
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
        const x = LM + (i % 2) * 6.15, y = 1.55 + Math.floor(i / 2) * 0.58;
        B.chip(s, c, x, y + 0.1);
        T(s, t, { x: x + 2.85, y, w: 3.2, h: 0.56, fontSize: 14, color: COL.tinte2, valign: "middle" });
      });
      karte(s, LM, 3.35, CW, 2.75, { fill: COL.papier, line: COL.rahmen });
      const o = (t, b) => ({ text: t, options: { breakLine: true, bold: !!b } });
      T(s, [
        { text: "Quellen mit Stand", options: { bold: true, fontSize: 14, breakLine: true } },
        o("Concular, Handlungsempfehlung für die öffentliche Hand, Dezember 2024 (PDF-Seite 38): concular.de/wp-content/uploads/2024/12/2024_Concular_Handlungsempfehlung_oeffentliche_Hand_Wiederverwendung.pdf"),
        o("BLB NRW, Pressemitteilung „Nachhaltiger Rückbau der Universitätsbibliothek“, 02.12.2024: blb.nrw.de (Presse)"),
        o("Madaster, Dokumentation „Match“, zuletzt bearbeitet 09.09.2026: docs.madaster.com/de/de/knowledge-base/industrial-reuse.html"),
        o("Concular Exchange: laut Rechercheplan des Teams (Anbieterseite am 08.11.2026 geöffnet, nicht erneut geprüft)"),
        o("Teilnahmebedingungen INNOSPRINT, Stand 01.10.2026: greenhouse.ruhr/programme/innosprint/"),
        { text: "Interne Unterlagen (Repository CircularFlow, nicht öffentlich): Fallakte CF-PILOT-01 Fassung 1.3 (16.11.2026), Pitch-Ablauf (16.11.2026), Doku Fassung 2, Produktbrief v0.2 (08.11.2026), Lösungsansatz des Teams (05.11.2026), Rechercheplan des Teams v1.0 (08.11.2026).", options: {} },
      ], { x: LM + 0.2, y: 3.45, w: CW - 0.4, h: 2.55, fontSize: 12, paraSpaceAfter: 3 });
      karte(s, LM, 6.2, CW, 0.65, { fill: COL.gruenHell });
      T(s, "Alle Daten sind Beispieldaten oder ein fiktiver Pilotfall; Nachrechnung mit der Rechenregel der Vorschau (Fassung 2); keine Praxisdaten. Sprechzeiten sind Schätzungen, keine Pitchdauer vom Veranstalter belegt.",
        { x: LM + 0.2, y: 6.22, w: CW - 0.4, h: 0.6, fontSize: 14, valign: "middle" });
    },
    notiz: { spricht: "Houssam", text: "Nicht gesprochen. Nachschlagefolie für die Jury und die Fragerunde: Quellen mit Stand und die Bedeutung der Kennzeichnungen. " + (hinweisFassung || ""), dauer: 0 },
  };
}

module.exports = { eFolien, demoAnkuendigung, geschaeftsmodell, praxistestKurz, anhang };
