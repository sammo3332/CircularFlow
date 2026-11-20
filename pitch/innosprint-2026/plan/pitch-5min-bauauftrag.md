# Bauauftrag · Pitch 5 Minuten (Phase 2)

| | |
|---|---|
| Stand | 17.11.2026 · nach Freigabe von Plan 0.2 mit Anpassungen des Teams (siehe `pitch-5min-plan.md`, Abschnitt 14) |
| Branch / Ausgangscommit | `codex/plattform-v1` / `3dca4e5` |
| Ziel | ein Deck „Pitch 5 Minuten“ als PPTX, PDF und Sprechtext-PDF, aus dem Generator in `werkzeug/` |
| Neue Quellen | Concular-Workshop, Folien 49 und 67 (vom Team am 17.11. hochgeladen); Onepager/Steckbrief `CircularFlow_Onepager_INNOSPRINT.docx`, zuletzt geändert 13.11.2026, 11:53 Uhr. Ob er mit der hochgeladenen Fassung identisch ist, ist nicht belegt. |
| Praxisfeedback | Bis 17.11. nachmittags keine Antwort auf die fünf Anfragen. Es gibt kein bestätigtes Praxisfeedback; Folie 7 bleibt ohne Praxisgespräch. |

## Anpassungen des Teams (verbindlich)

- **Länge:** Der Standard-Sprechtext hat rund 450 Wörter (hier 461). Die Folien 1–3 sind vereinfacht.
- **Folie 2:** „Spätestens am 5. Februar die Prüfung anfragen“; die 14 Tage stehen sichtbar als Annahme da.
- **Standarddemo:**
  - Sie zeigt nur „fünf Tage zu spät“ (K3) und „Weiter prüfen“ (K4).
  - Bei Zeitdruck kommt direkt das Bildschirmfoto des noch fehlenden Ergebnisses.
- **Anhang:** Restmenge und Wettbewerbsvergleich wandern dorthin.
- **Teamfolie:** Feyrouz und Houssam sprechen je einen eigenen Satz.
- **Schluss:** die Bitte um Kontakt zu einem Dortmunder Umbauprojekt.

## Dateien

- **Neues Inhaltsmodul:** `werkzeug/inhalt-p5.js`, Kennung „P5“.
  - Datei: `CircularFlow_INNOSPRINT2026_Pitch-5-Minuten.pptx`
  - Ordner: `ausgabe/abgabe-5-minuten/`
- **Fassung A** wandert nach `ausgabe/weitere-fassungen/`, damit nur ein Ordner „zur Abgabe“ übrig bleibt. Den Ordner `empfohlen-zur-abgabe/` danach entfernen.
- **PDF:** `ausgabe/abgabe-5-minuten/…Pitch-5-Minuten.pdf` (LibreOffice, mit ausgeblendeten Folien).
- **Sprechtext:** `ausgabe/sprechtexte/…Pitch-5-Minuten_Sprechtext.pdf`.
- **Folienzahl:** 15, davon 7 sichtbar.

| Nr. | Kennung | Sichtbar | Inhalt |
|---|---|---|---|
| 1 | P1 | ja | Einstieg |
| 2 | P2 | ja | Spätestens am 5. Februar |
| 3 | P3 | ja | Was CircularFlow prüft |
| 4 | P4 | ja | Demo |
| 5 | EK3 | ausgeblendet | Ersatz: fünf Tage zu spät |
| 6 | EK4 | ausgeblendet | Ersatz: weiter prüfen |
| 7 | P5 | ja | Impact Dortmund |
| 8 | P6 | ja | Prototyp, Geschäftsmodell, Team |
| 9 | P7 | ja | Schluss und Bitte |
| 10 | AX1 | ausgeblendet | Nach der Prüfbitte (K5/K6) |
| 11 | AX2 | ausgeblendet | So rechnet die Zeitprüfung |
| 12 | AX3 | ausgeblendet | Restmenge (Simulation) |
| 13 | AX4 | ausgeblendet | Wettbewerb und Abgrenzung |
| 14 | AX5 | ausgeblendet | Grenzen und Nachweise |
| 15 | AX6 | ausgeblendet | Quellen und Kennzeichnung |

**Links:**
- P4 hat zwei Links: „Bildschirmfoto: zu spät ›“ → Folie 5 und „Bildschirmfoto: weiter prüfen ›“ → Folie 6.
- EK3 hat „weiter ›“ → Folie 6 und „zurück zum Vortrag“ → Folie 7.
- EK4 hat „zurück zum Vortrag“ → Folie 7.
- Im Vortragsmodus springt „Weiter“ von Folie 4 direkt zu Folie 7, weil 5 und 6 ausgeblendet sind.

## Gestaltung

- **Schrift und Farben:**
  - Arial; Farben und Kennzeichnungs-Chips wie in `GESTALTUNG.md`. Grün, Gelb und Rot nur für den Zeitstatus.
  - Hauptfolien: Titel 34 pt, Text mindestens 20 pt, Fußnoten 11 pt.
  - Anhang: Text mindestens 14 pt.
- **Raster:** Ränder 0,6 Zoll, Titelzone oben, Inhalte in drei Spalten.
- **Bilder:** keine fremden Fotos, nur eigene Grafiken und die vorhandenen Ausschnitte in `bilder/ausschnitte/`.
- **Wenig Text:**
  - Auf den Folien 1–3 höchstens etwa 25 Wörter ohne Titel, Chips und Fußnote.
  - Zahlen und Zeit als Grafik: Türsymbole, Zeitleiste, Ampel.
- **Fußzeile:** wie bisher, „CircularFlow · INNOSPRINT 2026“ und Foliennummer.

## Folien (Texte wörtlich übernehmen)

### 1 · P1 · Einstieg · Spricht: Feyrouz · Zeitfenster 31 s · Uhr am Ende 0:31
- **Layout:** dunkelgrün (TITEL).
- **Titel:** „Eine brauchbare Tür kann verloren gehen, weil die Information zu spät kommt“
- **Grafik:**
  - Links 12 Türsymbole, davon 6 hervorgehoben, Beschriftung „Haus Lindenhof: 6 von 12 Türen angeboten“.
  - Rechts genau 6 gestrichelte Türsymbole, „Umbau am Kanal: braucht 6 Türen“.
  - Dazwischen ein unterbrochener Pfeil mit Uhr: „zu spät erfahren“.
  - Darunter: „→ neu bestellt“.
- **Chip:** „Fiktiver Fall“.
- **Zeile klein:** „CircularFlow · Feyrouz Chahed · Houssam Taleb · INNOSPRINT Zirkuläres Bauen · Dortmund · 20.11.2026“.
- **Fußnote:** „Fiktiver Pilotfall CF-PILOT-01; Gebäude und Projekte ausgedacht“.
- **Notiz:** „Ein ausgedachter Fall, der in Dortmund spielt: In einem Bürohaus werden zwölf Türen ausgebaut, sechs davon werden angeboten. Ein anderer Umbau braucht genau sechs Türen. Doch die Projektleitung erfährt zu spät davon und bestellt neu. Die angebotenen Türen können im Container landen. Wir sind Feyrouz Chahed und Houssam Taleb. Mit CircularFlow wollen wir das ändern.“

### 2 · P2 · Spätestens am 5. Februar · Spricht: Feyrouz · 38 s · Uhr 1:09
- **Titel:** „Spätestens am 5. Februar die Prüfung anfragen“
- **Zeitleiste**, groß, drei Marken:
  - „19.01. Angebot bekannt“
  - „05.02. spätestens Prüfung anfragen“
  - „19.02. Bestellfrist: Ersatz bestellen“
- **Klammer** von 05.02. bis 19.02.: „14 Tage Prüfzeit (Annahme)“.
- **Farbband:**
  - grün bis 04.02., gelb am 05.02., rot ab 06.02.
  - Legende: „rechtzeitig · knapp · zu spät“, Überschrift „wenn die Projektleitung an diesem Tag anfragt“.
- **Chips:** „Fiktiver Fall“, „Annahme, unbestätigt: 14 Tage Prüfzeit“.
- **Fußnote:** „Alle Daten 2027, fiktiv; nachgerechnet mit der Rechenregel der Vorschau. Quelle: Fallakte CF-PILOT-01 §5“.
- **Notiz:** „Der Umbau muss bis zum 19. Februar Ersatz bestellen. Das ist die Bestellfrist. Vorher muss eine Fachperson prüfen, ob die Türen passen. Wir nehmen an, das dauert 14 Tage. Das ist eine Annahme, keine Messung. Also muss die Projektleitung die Prüfung spätestens am 5. Februar anfragen. Diese Anfrage nennen wir Prüfbitte. Wer erst danach vom Angebot erfährt, ist zu spät. Wie CircularFlow prüft, ob die Zeit reicht, zeigt Houssam.“

### 3 · P3 · Was CircularFlow prüft · Spricht: Houssam · 31 s · Uhr 1:40
- **Titel:** „CircularFlow zeigt, ob die Zeit für die Prüfung reicht“ (Nachbesserung 17.11.: ohne „noch“)
- **Grafik:**
  - Drei Eingabekästen in einer Reihe: „Bauteil frei ab“ · „Bestellfrist“ · „Prüfzeit“.
  - Pfeil zu: „Reicht die Zeit für die Prüfung?“
  - Drei Ergebnisse: „weiter prüfen“ (grün) · „knapp“ (gelb) · „zu spät“ (rot).
  - Klein darunter: „Was fehlt? Was ist der nächste Schritt?“
- **Rollenzeile:** „Fachleute beurteilen die Eignung · Die Projektleitung entscheidet die Bestellung“.
- **Fußnote:** „Funktionen der Vorschau (Fassung 2)“.
- **Notiz:** „CircularFlow bringt drei Angaben zusammen: wann ein Bauteil frei wird, bis wann ein Projekt bestellen muss und wie lange die Prüfung dauert. Daraus zeigt es: Reicht die Zeit, ist es knapp oder zu spät, welche Angaben fehlen und was als Nächstes zu tun ist. Die Eignung beurteilen Fachleute, die Bestellung entscheidet die Projektleitung.“

### 4 · P4 · Demo · Spricht: Houssam · 60 s · Uhr 2:40
- **Titel:** „Live: Ein Paar ist fünf Tage zu spät, ein anderes kann weiter geprüft werden“
- **Zeile:** „Vorschau Fassung 2 · Beispieldaten: Systemtrennwände statt Türen · Stichtag der Demo: Mi 18.11.2026, 14:00 Uhr (Simulation)“.
- **Zwei Schrittkarten:**
  - „1 Zu spät · TW-01 → BD-23“ mit Link „Bildschirmfoto: zu spät ›“ → Folie 5; die Ziffer steht in einem gezeichneten Kreis (Nachbesserung 17.11.: kein Zeichen ①, ②).
  - „2 Weiter prüfen · TW-05 → BD-22“ mit Link „Bildschirmfoto: weiter prüfen ›“ → Folie 6.
- **Chips:** „Beispieldaten“, „Simulation“.
- **Fußnote:** „Prüfzeiten sind Beispielannahmen. Der Abgleich ist ein Vorschlag zur Prüfung, keine Freigabe. Es wird nichts versendet.“
- **Notiz (Absätze):**
  - „K1 · Das ist unsere Vorschau mit Beispieldaten, hier mit Systemtrennwänden statt Türen. Die Zeitfrage ist dieselbe.“
  - „K2 · Jedes Paar ist ein Angebot und ein Bedarf derselben Bauteilgruppe. Bei vier Paaren fehlen noch Angaben, etwa eine Frist.“
  - „K3 · Dieses Paar ist zu spät: Mit der angenommenen Prüfzeit wäre die Prüfung erst fünf Tage nach der Bestellfrist fertig. Deshalb ist die Prüfbitte gesperrt.“
  - „K4 · Bei diesem Paar reicht die Zeit: weiter prüfen. Das ist ein Vorschlag, keine Freigabe. Entscheiden müssen Fachleute und Projektleitung.“
  - „Zurück zur Präsentation, Folie 7 · Was das für Dortmund bringen kann, erklärt Feyrouz.“
  - **Klick:** Alt+Tab zum Browser (Übersicht) · in der Kachel „Paare derselben Gruppe“ auf **8 Paare** · Zeile **TW-01 → BD-23** · oben im Pfad **Paare derselben Gruppe** · Zeile **TW-05 → BD-22** · Alt+Tab zurück.
  - **Bei Zeitdruck:**
    - Steht K3 um 2:10 nicht da oder hakt die Vorschau: zurück zur Präsentation und die Bildschirmfotos über die Links auf dieser Folie zeigen.
    - Ist K4 um 2:25 noch nicht erreicht: zurück und direkt „Bildschirmfoto: weiter prüfen ›“.

### 5 · EK3 · ausgeblendet · Ersatz „zu spät“ · Spricht: Houssam
- **Titel:** „Bildschirmfoto: Dieses Paar ist fünf Tage zu spät“
- **Bild:** `bilder/ausschnitte/e3-zu-spaet.jpg`, groß.
- **Bildunterschrift:** „K3 · TW-01 → BD-23 · Prüfende 02.12.2026 liegt 5 Tage nach der Bestellfrist 27.11.2026 · Prüfbitte gesperrt“.
- **Chip:** „Beispieldaten“.
- **Links:** „weiter ›“ → Folie 6 und „zurück zum Vortrag“ → Folie 7.
- **Notiz:**
  - Erster Satz: „Das ist unsere Vorschau mit Beispieldaten, hier mit Systemtrennwänden statt Türen.“
  - Danach die Notizen K2 (nur der erste Satz) und K3.

### 6 · EK4 · ausgeblendet · Ersatz „weiter prüfen“ · Spricht: Houssam
- **Titel:** „Bildschirmfoto: Bei diesem Paar reicht die Zeit“
- **Bild:** `bilder/ausschnitte/e4-weiter-pruefen.jpg`.
- **Bildunterschrift:** „K4 · TW-05 → BD-22 · weiter prüfen · Vorschlag zur Prüfung, keine fachliche Freigabe“.
- **Chip:** „Beispieldaten“.
- **Link:** „zurück zum Vortrag“ → Folie 7.
- **Notiz:** die Notiz K4, danach der Übergabesatz „Was das für Dortmund bringen kann, erklärt Feyrouz.“

### 7 · P5 · Impact · Spricht: Feyrouz · 33 s · Uhr 3:13
- **Titel:** „Im Dortmunder Pilot wollen wir messen, was wirklich wiederverwendet wird“
- **Box links:** „SDG 12.5 · Abfall deutlich verringern, auch durch Wiederverwendung (sinngemäß)“.
- **Kette in der Mitte:** „angeboten → rechtzeitig geprüft → wieder eingebaut“, darunter „Wenn nicht: zu spät · Angaben fehlen · ungeeignet“.
- **Zitatkasten rechts:** „„Es gibt kaum Daten zu Baustoffströmen.“ Stadt Dortmund, Umweltamt, INNOSPRINT, 13.11.2026“.
- **Chip:** „Ziel, noch keine Messung“.
- **Fußnote:** „SDG 12.5: Unterziel der Vereinten Nationen, sinngemäß wiedergegeben; Zitat: Stadt Dortmund, Umweltamt, INNOSPRINT, 13.11.2026, Folie 11“ (Nachbesserung 17.11.).
- **Notiz:** „Unser Bezug zu SDG 12.5: weniger Abfall durch Wiederverwendung. Das Umweltamt der Stadt hat im Sprint gezeigt: Es gibt kaum Daten zu Baustoffströmen. In einem geplanten Pilot in Dortmund wollen wir deshalb zählen: Wie viele angebotene Bauteile werden rechtzeitig geprüft, wie viele wirklich wieder eingebaut, und woran scheitert es sonst? Was heute schon steht, zeigt Houssam.“

### 8 · P6 · Prototyp, Geschäftsmodell, Team · Spricht: Houssam, dann Feyrouz · 50 s · Uhr 4:03
- **Titel:** „Der Prototyp läuft. Als Erstes wollen wir einen Kurzcheck testen“
- **Linke Spalte:**
  - **„Heute zeigbar“:** kleiner Ausschnitt `bilder/ausschnitte/e1-uebersicht.jpg` mit Chip „Beispieldaten“; Text „Prototyp im Browser · Beispieldaten, Simulation“.
  - **„Nutzer“:** „Planung und Projektleitung im Umbau“.
  - **„Käufer“** mit Chip „Hypothese“: „Bauherrschaft oder Bestandsorganisation · erstes Angebot: Kurzcheck für eine Bauteilgruppe in einem Projekt · Zahlungsbereitschaft und Preis offen · offen auch: Liegt der Nutzen eher beim Planungsbüro?“
- **Rechte Spalte:**
  - Karte „Houssam Taleb · Informatik an der TU Dortmund, jetzt im Master · entwickelt den Prototyp“.
  - Karte „Feyrouz Chahed · Informatik an der TU Dortmund · Datenanalyse, IT-Sicherheit, Umsetzung und Ideen“.
  - Darunter: „Uns fehlt: Fachwissen aus Bau und Rückbau, Bauteilbewertung, Recht und Logistik → Partner gesucht“.
- **Fußnote:** „Team und Lücken laut Steckbrief des Teams (13.11.2026)“.
- **Notiz:**
  - Erster Absatz: „Heute läuft unser Prototyp im Browser, mit Beispieldaten. Nutzen soll ihn zuerst die Projektleitung im Umbau. Bezahlen könnte die Bauherrschaft oder Bestandsorganisation, zum Beispiel für einen Kurzcheck einer Bauteilgruppe in einem Projekt. Ob jemand zahlt, wissen wir noch nicht. Ich habe an der TU Dortmund Informatik studiert, bin jetzt im Master und entwickle den Prototyp.“
  - Zweiter Absatz, beginnt mit „Feyrouz:“: „Ich studiere ebenfalls Informatik an der TU Dortmund und kenne mich in Datenanalyse und IT-Sicherheit aus. Uns fehlt Fachwissen aus Bau und Rückbau. Dafür suchen wir Partner aus der Branche.“

### 9 · P7 · Schluss · Spricht: Feyrouz · 32 s · Uhr 4:35
- **Layout:** dunkelgrün (SCHLUSS).
- **Titel:** „Wir suchen einen echten Umbaufall in Dortmund“
- **Zwei kurze Zeilen „Im Sprint gelernt“:**
  - „Umweltamt: „Bei Bauentscheidungen zählen meist Zeit und Kosten.““
  - „Concular: „Zeitliche Unterschiede in Nachfrage und Angebot““
- **Zeile „Nächster Test“:** „ein echter Umbau · vier Zeitpunkte: Angebot bekannt → erreicht die Projektleitung → Bestellfrist → Übergabe · echte Prüfzeit statt 14 Tage Annahme“.
- **Groß:** „Unsere Bitte: Bringen Sie uns mit einem Dortmunder Umbauprojekt in Kontakt.“
- **Fußnote:** „Stadt Dortmund, Umweltamt, 13.11.2026, Folie 11; Concular, Workshop im INNOSPRINT, Folie 49“.
- **Notiz:** „Im Sprint haben wir gelernt: Zeit ist eine echte Hürde. Das Umweltamt sagt, bei Bauentscheidungen zählen meist Zeit und Kosten. Concular nennt zeitliche Unterschiede zwischen Angebot und Nachfrage. Ob unsere 14 Tage Prüfzeit stimmen, wissen wir nicht. Das prüfen wir als Nächstes an einem echten Umbau. Unsere Bitte: Bringen Sie uns mit einem Dortmunder Umbauprojekt in Kontakt. Danke.“

### Anhang (ausgeblendet; Notiz jeweils „Spricht: [wer gefragt wird]“, „Nur bei Rückfragen“ und eine Kurzantwort)

- **10 · AX1 · „Nach der Prüfbitte: Fachergebnis und nächster Schritt“**
  - Bilder: `e5-vorgang.jpg` und `e6-vormerkung.jpg`; Chips „Beispieldaten“, „Simulation“.
  - Text: „Prüfbitte legt einen Vorgang an · Fachergebnis ist ein Eintrag, keine Freigabe · nächster Schritt: Vormerkung anlegen, also unverbindlich reservieren“.
  - Quelle: Pitch-Ablauf K5/K6.
- **11 · AX2 · „So rechnet die Zeitprüfung“**
  - „Prüfende = Tag der Anfrage + Prüfzeit.“
  - Tabelle aus dem fiktiven Fall: Anfrage 04.02. → Prüfende 18.02. → weiter prüfen · 05.02. → 19.02. → knapp · 06.02. → 20.02. → zu spät.
  - „Demo-Paare mit Beispielwerten: BD-23 Prüfzeit 14 Tage, Bestellfrist 27.11.2026 → Prüfende 02.12.2026, 5 Tage zu spät · BD-22 Prüfzeit 10 Tage, Bestellfrist 31.03.2027 → Prüfende 28.11.2026, 123 Tage vorher.“
  - Quelle: Fallakte §5, `docs/plattform-v2.md`.
- **12 · AX3 · „Erkenntnis aus der Simulation: Die Restmenge fällt aus dem Blick“**
  - Mengenleiste mit 6 Türen (5 vorgemerkt, 1 offen).
  - „Probeausbau am 02.02.2027 beschädigt eine Tür · 5 unverbindlich vorgemerkt, 1 offen, Bestellfrist 19.02.2027 · die Vorschau zeigt den Bedarf danach als gedeckt; die fehlende Tür steht nur in einer Notiz · nächster Ausbau (geplant, nicht umgesetzt): offene Restmenge mit Frist sichtbar halten“.
  - Chips: „Simulation“, „Fiktiver Fall“.
  - Quelle: Fallakte §5, Variante 3; Plan Restmenge 1.1 §2.
- **13 · AX4 · „Wettbewerb und Abgrenzung“**, vier Zeilen:
  - „Concular (Workshop im INNOSPRINT, Folien 49 und 67): nennt „Zeitliche Unterschiede in Nachfrage und Angebot“ und „Fehlende Infrastruktur für Lagerung, Rezertifizierung und Aufbereitung“; zeigt „Interne Vermittlung“: interner Marktplatz mit „Reservieren“ und „Integration in Planungstool“ mit „Reservieren und bilanzieren“.“
  - „Madaster: Materialpässe für Gebäude (laut Steckbrief); Seite „Match“ mit „Verfügbar ab“, Vorlauf und E-Mail-Benachrichtigung (laut Dokumentation, Stand 09.09.2026).“
  - „Börsen wie Restado vermitteln Gebrauchtes (laut Steckbrief, nicht geprüft). Heute oft: eigene Excel-Listen (laut Steckbrief).“
  - „Unser Fokus: die einzelne Bestellentscheidung im laufenden Umbau – reicht die Zeit für die Fachprüfung, was fehlt, was ist der nächste Schritt. Ob andere Plattformen das ebenso abbilden, haben wir nicht geprüft.“
  - Chip: „Herstellerangabe“.
- **14 · AX5 · „Grenzen der Vorschau und Nachweise“**
  - „Der späteste Tag für die Anfrage steht nicht als eigene Frist da; „Zeitkritisch“ zeigt die Bestellfrist erst sieben Tage vorher; keine Benachrichtigung.“
  - „Nur Beispieldaten; Fachergebnis ist ein Eintrag; ein Scan liefert nur Vorschläge; für die Türregel zählt nur Gemessenes.“
  - „Nachweise laut Concular-Handlungsempfehlung (12/2024): Innentür ohne Schutzanforderung kein Verwendbarkeitsnachweis; Brandschutztür Zustimmung im Einzelfall.“
  - Quelle: Fallakte §1, §4, §5, §6.
- **15 · AX6 · „Quellen und Kennzeichnung“**
  - Quellen mit Stand:
    - Fallakte CF-PILOT-01 1.3 und Plan Restmenge 1.1 (16.11.2026)
    - Pitch-Ablauf (16.11.2026) und Vorschau Fassung 2 (Code 2121b92)
    - Stadt Dortmund, Umweltamt, INNOSPRINT 13.11.2026
    - Concular, Workshop im INNOSPRINT, Folien 49/67, und Handlungsempfehlung 12/2024
    - Madaster-Dokumentation (09.09.2026)
    - INNOSPRINT Tag 5 (13.11.2026) und Teilnahmebedingungen (01.10.2026)
    - Steckbrief des Teams (13.11.2026)
    - SDG 12.5 der Vereinten Nationen (sinngemäß)
  - Bedeutung der Chips wie in Fassung A.

## Sprechtext-PDF

- **Deckblatt „Ablauf auf einen Blick“:** Tabelle mit Folie, Spricht, Zeitfenster, Uhr am Ende und Übergabesatz.
- **Demo:**
  - Klickpfad.
  - Regel bei Zeitdruck (2:10 / 2:25) und Rückfall auf die Bildschirmfotos.
- **Zeiten:** „Zeiten bei ruhigem Tempo (etwa 1,8 Wörter je Sekunde) einschließlich Sprecherwechsel, Umschalten und Klicks. Bei zügigem Tempo (2,3 Wörter je Sekunde) dauert der Vortrag etwa 3:40. Probe mit Stoppuhr steht aus.“ (Nachbesserung 17.11.)
- **Notizen:** Je Folie wie bisher; die Kopfzeile nennt Foliennummer und Kennung. Statt „Dauer (voll)“ steht das Zeitfenster mit „Uhr am Ende“.

## Prüfung durch cf-entwicklung vor der Rückgabe

- `exportiere.sh` läuft durch: validate PASSED, python-pptx öffnet, LibreOffice exportiert. Die Sprechtext-Selbstprüfung meldet für alle Folien OK.
- `show="0"` genau bei den Folien 5, 6 und 10–15. Alle Links zeigen auf die Ziele aus der Tabelle oben, in PPTX und PDF.
- Der Standard-Sprechtext der sichtbaren Folien hat etwa 461 Wörter (zählen und melden).
- Die Folien rendern und ansehen: nichts abgeschnitten, keine Überlappung, Schriftgrößen wie oben.
- Die Fassungen A, B und C bleiben inhaltlich unverändert; nur der Ordner von A ändert sich.

## Nachbesserung 2 (nach cf-test und cf-review auf `6fa5693`, 17.11.2026)

cf-test hat P1–P10 bestanden. cf-review hat keinen Faktenfehler gefunden. Übernommen werden B1–B4 und C1–C3 von cf-review
sowie die kosmetischen Punkte K2 und K4 von cf-test. Die Wortzahl bleibt bei 461. Die Notizen und Folientexte lauten
jetzt wörtlich:

| Folie | Änderung |
|---|---|
| 2 · P2 · Notiz | Satz „Das ist eine Annahme, keine Messung.“ entfällt (die Folie trägt den Chip, Folie 9 sagt „wissen wir nicht“). Zeitfenster 35 s, Uhr 1:06. |
| 3 · P3 · Notiz | Satz „Die Eignung beurteilen Fachleute, die Bestellung entscheidet die Projektleitung.“ entfällt (steht auf der Folie und in K4). Zeitfenster 27 s, Uhr 1:33. |
| 4 · P4 · Notiz K1 | „K1 · Das ist unsere Vorschau mit Beispieldaten. Ganz oben steht eine Innentür: Am Einbauort fehlt noch das Maß, die Frist endet in zwei Stunden. Im Weiteren geht es um Systemtrennwände statt Türen, die Zeitfrage ist dieselbe.“ (Belegt: Übersicht „Zeitkritisch“, „Aufmaßfrist · E-01 · T-07 → B-02 · noch 2 Std.“; T-07 Innentür, Zielöffnung B-02, Aufmaßfrist 18.11.2026, 16:00 Uhr; das löst die Ankündigung im Steckbrief „Einer Innentür fehlt das Maß“ ein.) |
| 4 · P4 · Notiz K2 | „K2 · Jedes Paar ist ein Angebot und ein Bedarf derselben Bauteilgruppe.“ (Satz zu den vier Paaren entfällt.) Zeitfenster Folie 4: 64 s, Uhr 2:37. |
| 4 · P4 · Folientext | „Mi 18.11.2026“ mit geschütztem Leerzeichen, damit „Mi“ nicht allein am Zeilenende steht. |
| 1 · P1 · Folientext | Kein einzelnes „Türen“ in der zweiten Zeile der Beschriftung „Umbau am Kanal: braucht 6 Türen“ (Box breiter oder Umbruch nach dem Doppelpunkt). |
| 7 · P5 · Titel | „In einem Dortmunder Pilot wollen wir messen, was wirklich wiederverwendet wird“. Zeitfenster 33 s, Uhr 3:10. |
| 8 · P6 · Notiz Houssam | „Heute läuft unser Prototyp im Browser, mit Beispieldaten. Nutzen soll ihn zuerst die Projektleitung im Umbau. Bezahlen könnte die Bauherrschaft, die Bestandsorganisation oder, wie im Steckbrief, das Planungsbüro, zum Beispiel für einen Kurzcheck einer Bauteilgruppe. Ob jemand zahlt, wissen wir noch nicht. Ich habe an der TU Dortmund Informatik studiert, bin jetzt im Master und entwickle den Prototyp.“ Zeitfenster Folie 8: 53 s, Uhr 4:03. |
| 8 · P6 · Folientext Käufer | „Bauherrschaft oder Bestandsorganisation · im Steckbrief: Büroleitung eines Planungsbüros · erstes Angebot: Kurzcheck für eine Bauteilgruppe in einem Projekt · Zahlungsbereitschaft und Preis offen“ (ersetzt „offen auch: Liegt der Nutzen eher beim Planungsbüro?“). |
| 9 · P7 · Notiz | Erster Satz „Im Sprint haben wir gehört: Auf die Zeit kommt es an.“ (statt „… gelernt: Zeit ist eine echte Hürde.“). Zeitfenster 32 s, Uhr 4:35. |
| 13 · AX4 · Folientext | „Alternative: eigene Excel-Listen (laut Steckbrief).“ (statt „Heute oft: …“). |
| 14 · AX5 · Folientext | Erste Spalte unverändert. Zweite Spalte: „Nur Beispieldaten; Fachergebnis ist ein Eintrag; ein Scan liefert nur Vorschläge; bei Türen zählen nur gemessene Maße.“ Dritte Spalte: „Nachweise (Angaben von Concular, keine Rechtsberatung): Innentür ohne Schutzanforderung laut Handlungsempfehlung 12/2024 kein neuer Verwendbarkeitsnachweis; Zustand und Passung prüft trotzdem eine Fachperson. Brandschutztür laut Concular-Leitfaden derzeit Zustimmung im Einzelfall. Die Vorschau speichert keine Nachweise.“ |
| 14 · AX5 · Notiz | Kurzantwort wie die Folie, dazu: „Im Steckbrief steht, CircularFlow lasse keine Frist stillschweigend verstreichen. Läuft eine Frist ab, zeigt die Vorschau „Frist verstrichen“, und der Vorgang bleibt offen. Eine Benachrichtigung vorher und den spätesten Anfragetag als eigene Frist hat sie noch nicht.“ (Belegt: Pitch-Ablauf, Zusatz A; Fallakte §1, §5, §6.) |
| Sprechtext-Deckblatt | Übersichtstabelle mit den neuen Zeitfenstern 31/35/27/64/33/53/32 s und Uhrzeiten 0:31/1:06/1:33/2:37/3:10/4:03/4:35. Zeitsatz unverändert (461 Wörter: 4:35 bei 1,8; etwa 3:40 bei 2,3 einschließlich 18 s für Wechsel, Umschalten und Klicks). Die Zeitdruckregel 2:10 / 2:25 bleibt. |

## Nachbesserung 3 (nach cf-review auf `b6e4172`, 17.11.2026)

cf-review hat keinen Sachfehler, keine falsche Zahl und keinen Widerspruch zwischen den Dateien gefunden. Übernommen
werden die drei gemeldeten Befunde.
- Der Standard-Sprechtext bleibt bei 461 Wörtern.
- Zeitfenster und Uhrzeiten bleiben gleich.
- Folientexte, Links und Ausblendung ändern sich nicht.

| Stelle | Änderung | Grund |
|---|---|---|
| 9 · P7 · Notiz | Neuer erster Satz, gleich lang (11 Wörter) | Keine Quelle sagt „Auf die Zeit kommt es an“. Der alte Satz gab eine eigene Schlussfolgerung als gehörte Aussage aus. |
| 7 · P5 · Notiz | „künftigen“ statt „geplanten“ Pilot | Es gibt noch keinen vereinbarten Pilot (Folie 9 sucht einen Umbaufall). |
| 5 · EK3 · Notiz | zwei Regiezeilen | Im Spätfall wurden K1 und K2 sonst doppelt gesprochen, der Vortrag käme nah an 5:00. Wer von Folie 5 direkt zurückging, verlor den Übergabesatz. |
| 4 · P4 · Notiz | Regel für 2:10 ergänzt | wie EK3 |
| Sprechtext-Deckblatt | Regel bei Zeitdruck wie die neue Notiz von Folie 4; Übergabesatz für EK3 statt „–“ | wie EK3 |
| README | Abschnitt 3: Spätfall mit Zeit; Abschnitt 4: Spätfall proben | Zeitrechnung für den Spätfall fehlte |

Wortlaut (jede Zeile ist ein Absatz der Notiz):

```text
P7, erster Satz (ersetzt „Im Sprint haben wir gehört: Auf die Zeit kommt es an.“):
Zwei Aussagen aus dem Sprint zeigen, dass Zeit eine Rolle spielt.

P5, Beginn des dritten Satzes (ersetzt „In einem geplanten Pilot in Dortmund …“):
In einem künftigen Pilot in Dortmund wollen wir deshalb zählen: …

EK3, erster Absatz nach „Spricht: Houssam“, vor dem Sprechtext:
Spätfall: Waren K1 und K2 schon live gesprochen, nur den K3-Satz sprechen.

EK3, Absatz nach K3, vor der Zeile „Zeitfenster“:
Danach immer „weiter ›“ zu Folie 6. Wer doch direkt „zurück zum Vortrag“ geht, sagt vorher: „Was das für Dortmund bringen kann, erklärt Feyrouz.“

P4, Regel für 2:10 (ersetzt die bisherige Zeile):
Bei Zeitdruck: Steht K3 um 2:10 nicht da oder hakt die Vorschau: zurück zur Präsentation und die Bildschirmfotos über die Links auf dieser Folie zeigen. Waren K1 und K2 schon gesprochen, auf Folie 5 nur den K3-Satz.

Sprechtext-Deckblatt, Spalte Übergabesatz für „5 · EK3“:
bei „zurück zum Vortrag“: Was das für Dortmund bringen kann, erklärt Feyrouz.
```

README:
- **Abschnitt 3, „Bei Zeitdruck“:**
  - Unter „Steht K3 um 2:10 nicht da …“ ergänzen: „Waren K1 und K2 schon gesprochen, auf Folie 5 nur den
    K3-Satz sprechen.“
  - Neuer Punkt: „Zeit im Spätfall: Mit nur dem K3-Satz endet der Vortrag bei etwa 4:45. Wer auf Folie 5 die ganze
    Notiz liest, kommt auf knapp 5:00.“
  - Der Punkt zu „zurück zum Vortrag“ lautet: „Im Vortrag geht es von Folie 5 immer mit „weiter ›“ zu Folie 6. Dort
    steht der Übergabesatz, und „zurück zum Vortrag“ führt zu Folie 7.“
- **Abschnitt 4, Punkt „Demo mit Stoppuhr“:** ergänzen: „Den Spätfall einmal proben: Ausfall um 2:10, auf Folie 5
  nur K3. Ziel: Ende etwa 4:45.“

Abnahme:
- `exportiere.sh` läuft durch. `validate.py` meldet PASSED, und die Sprechtext-Selbstprüfung meldet OK.
- Der Standard-Sprechtext hat 461 Wörter. Zeitfenster 31/35/27/64/33/53/32 s, Uhr 4:35.
- Die Folienseiten des PDFs sehen aus wie in `1eb08a2`. Links und `show="0"` sind unverändert.
- Die Fassungen A, B und C bleiben textgleich.

## Nachbesserung 4 (redaktionell, Vorgabe des Teams vom 17.11.2026)

Drei redaktionelle Änderungen des Teams für Folie 8, Folie 9 und Folie 14:
- Der Standard-Sprechtext bleibt bei 461 Wörtern. Folie 8 wird um 9 Wörter kürzer (79 statt 88), Folie 9 um 9 länger
  (68 statt 59).
- Neue Zeitfenster: Folie 8 hat 48 s, die Uhr am Ende zeigt 3:58. Folie 9 hat 37 s, die Uhr am Ende bleibt bei 4:35.
  Die Summe bleibt 275 s.
- Feyrouz spricht 272 Wörter, Houssam 189.
- Links, Ausblendung, Ersatzfolien und alle anderen Folien bleiben unverändert.

| Stelle | Änderung |
|---|---|
| 8 · P6 · Folientext | Die Felder „Nutzer“ und „Käufer“ werden zu einem Feld mit drei Zeilen (Bezeichnung fett). Der Chip „Hypothese“ bleibt am Feld. Alle anderen Felder bleiben. |
| 8 · P6 · Notiz | Neuer Absatz für Houssam. Feyrouz bleibt gleich. Danach kommt ein neuer Absatz „Bei Rückfragen: …“ zu den Budgetverantwortlichen. Er zählt nicht zum Standard-Sprechtext. |
| 9 · P7 · Folientext | Der Kasten „Nächster Test“ bekommt eine neue Überschrift und zwei neue Zeilen. Titel, „Im Sprint gelernt“, Bitte und Quelle bleiben. |
| 9 · P7 · Notiz | Neuer Text: Der Praxistest prüft die Karte, die Prüfzeit ist eine der nötigen Angaben, und die Bitte bleibt. |
| 14 · AX5 · Folientext | Die dritte Spalte bekommt einen neuen Text. Die pauschalen Aussagen zu Türnachweisen entfallen. „keine Nachweisdokumente“ ersetzt „keine Nachweise“. |
| 14 · AX5 · Notiz | Die Sätze zu Nachweisen werden ersetzt, siehe unten. Der Rest der Kurzantwort bleibt. |
| 15 · AX6 · Folientext | Quelle „Concular, Workshop im INNOSPRINT, Folien 49/67“ ohne „und Handlungsempfehlung 12/2024“. Folie 14 zitiert die Handlungsempfehlung nicht mehr. |
| Zählregel | Absätze, die mit „Bei Rückfragen:“ beginnen, zählen nicht zum Standard-Sprechtext (wie „Klick:“ und „Bei Zeitdruck:“). Im Sprechtext-PDF stehen sie als eigener Kasten. |

Wortlaut:

```text
Folie 8, Feld (drei Zeilen):
Nutzer: Projektleitung im Planungsbüro.
Erstes Angebot: Kurzcheck für eine Bauteilgruppe im Umbau.
Zahlender Auftraggeber: im Pilot zu klären.

Folie 8, Notiz Houssam (49 Wörter, ersetzt den bisherigen Absatz):
Heute läuft unser Prototyp im Browser, mit Beispieldaten. Nutzen soll ihn zuerst die Projektleitung im Planungsbüro. Als erstes Angebot planen wir einen Kurzcheck für eine Bauteilgruppe. Wer dafür bezahlt, klären wir im Pilot. Ich habe an der TU Dortmund Informatik studiert, bin jetzt im Master und entwickle den Prototyp.

Folie 8, neuer Absatz nach dem Absatz von Feyrouz (nicht gezählt):
Bei Rückfragen: Als Budgetverantwortliche kommen infrage: die Bauherrschaft, die den Umbau beauftragt; die Bestandsorganisation, die Gebäude im Bestand verwaltet; oder die Büroleitung eines Planungsbüros, wie im Steckbrief angenommen, etwa mit einer Projektlizenz. Bestätigt ist davon nichts. Wer zahlt und zu welchem Preis, klären wir im Pilot.

Folie 9, Kasten „Nächster Test“:
Überschrift: Nächster Test an einem echten Umbau
Zeile 1: Hilft die Karte einer Projektleitung, die Fachprüfung rechtzeitig anzustoßen?
Zeile 2: Dafür nötige Angaben, unter anderem: tatsächliche Prüfzeit · Bestellfrist · Bauteil frei ab

Folie 9, Notiz (68 Wörter, ersetzt den bisherigen Absatz):
Zwei Aussagen aus dem Sprint zeigen, dass Zeit eine Rolle spielt. Das Umweltamt sagt, bei Bauentscheidungen zählen meist Zeit und Kosten. Concular nennt zeitliche Unterschiede zwischen Angebot und Nachfrage. Als Nächstes wollen wir an einem echten Umbau prüfen, ob unsere Karte einer Projektleitung hilft, die Fachprüfung rechtzeitig anzustoßen. Dafür brauchen wir unter anderem die tatsächliche Prüfzeit. Unsere Bitte: Bringen Sie uns mit einem Dortmunder Umbauprojekt in Kontakt. Danke.

Folie 14, dritte Spalte (ersetzt den bisherigen Text):
Nachweise: Welche Prüfungen und Nachweise erforderlich sind, klären Fachplanung und gegebenenfalls zuständige Prüfstellen für das konkrete Bauteil und den vorgesehenen Einbau. Die Vorschau speichert keine Nachweisdokumente.

Folie 14, Notiz: Die Sätze von „Nachweise nach Angaben von Concular, keine Rechtsberatung: …“ bis „Die Vorschau speichert keine Nachweise.“ werden ersetzt durch:
Welche Prüfungen und Nachweise erforderlich sind, klären Fachplanung und gegebenenfalls zuständige Prüfstellen für das konkrete Bauteil und den vorgesehenen Einbau. Die Vorschau speichert keine Nachweisdokumente.
```

README:
- **Abschnitt 2:**
  - Zeilen 8 und 9 der Tabelle: 48 s / 3:58 und 37 s / 4:35.
  - Neue Aufteilung: „Feyrouz spricht 272, Houssam 189 und bedient die Demo.“
- **Abschnitt 4:** Bei Folie 8 heißt es jetzt „Feld mit Nutzer, Angebot und Auftraggeber“ statt „Käufertext in der Spalte“.
- **Abschnitt 5, Tabelle Steckbrief:**
  - Zeile Nutzer: Folie 8 „Projektleitung im Planungsbüro“.
  - Zeile Käufer: Folie 8 „Zahlender Auftraggeber: im Pilot zu klären“. Die möglichen Budgetverantwortlichen (Bauherrschaft, Bestandsorganisation, Büroleitung laut Steckbrief) stehen in den Notizen.
- **Abschnitt 6:**
  - „Hypothese: Nutzer und erstes Angebot (Folie 8).“
  - Der Punkt „Nachweise auf Folie 14“ lautet: „Folie 14 sagt nur, wer die nötigen Prüfungen und Nachweise klärt. Pauschale Aussagen zu Türnachweisen enthält der Pitch nicht mehr.“

Abnahme:
- `exportiere.sh` läuft durch. `validate.py` meldet PASSED. Die Sprechtext-Selbstprüfung meldet OK, und der Sprechtext
  hat 16 Seiten.
- Der Standard-Sprechtext hat 461 Wörter. Die Zeitfenster sind 31/35/27/64/33/48/37 s, Summe 275 s, Uhr 4:35.
- Die Folien 8, 9, 14 und 15 sind gerendert und angesehen: nichts abgeschnitten, nichts überlappt, Haupttext mindestens
  20 pt, Anhang mindestens 14 pt.
- Alle anderen Folienseiten sind pixelgleich zu `c45ce11`.
- Die Links 4→5, 4→6, 5→6, 5→7 und 6→7 sowie `show="0"` bei 5, 6 und 10–15 sind unverändert.
- Die Fassungen A, B und C bleiben unverändert.

### Nachbesserung 4a (nach cf-review auf `9d9748a`)

cf-review hat bestätigt:
- Die drei Vorgaben sind erfüllt.
- Es gibt keinen Sachfehler, und Wortzahl und Zeiten stimmen.

Übernommen werden zwei Befunde. Sprechtext und Zeiten bleiben unverändert.

| Stelle | Änderung | Grund |
|---|---|---|
| 9 · P7 · Folientext | Im Kasten „Nächster Test an einem echten Umbau“ eine Zeile zwischen den beiden bisherigen Zeilen: „Die Karte zeigt, was bis zur Frist fehlt, wer es liefert und was als Nächstes zu tun ist.“ Schrift mindestens 20 pt; Kasten und Abstände so anpassen, dass nichts überlappt und die Bitte frei steht. | „Karte“ kommt im Vortrag hier zum ersten Mal vor. Die Erklärung folgt dem Steckbrief („Eine Karte zeigt, was bis zur Frist fehlt und wer es liefert“; „… was als Nächstes zu tun ist“). Der Wortlaut des Teams bleibt. |
| README, Abschnitt 11 | Der Satz „Ein Kandidat ist „Ob unsere 14 Tage Prüfzeit stimmen, wissen wir nicht.“, wenn das Gespräch etwas zur Prüfzeit sagt.“ lautet jetzt: „Ein Kandidat ist „Dafür brauchen wir unter anderem die tatsächliche Prüfzeit.“, wenn das Gespräch etwas zur Prüfzeit sagt.“ | Der alte Satz steht seit Nachbesserung 4 nicht mehr auf Folie 9. |

Nicht übernommen ist der Hinweis, Kurzcheck (Folie 8) und Praxistest (Folie 9) im Sprechtext zu verbinden. Das wäre eine
inhaltliche Festlegung, die das Team treffen sollte.

## Nachbesserung 5 (Vorgabe des Teams vom 17.11.2026: Kurzcheck und Praxistest verbinden)

Folie 9 verbindet den Kurzcheck von Folie 8 mit dem Praxistest und nennt die Karte „Entscheidungskarte“.
- Der gesamte Sprechtext von Folie 9 wird durch den Wortlaut des Teams ersetzt (40 statt 68 Wörter). Die Sätze zu
  Umweltamt und Concular werden nicht mehr gesprochen. Der Kasten „Im Sprint gelernt“ bleibt auf der Folie.
- Neue Summen: 433 Wörter (55 + 63 + 44 + 96 + 56 + 79 + 40), Feyrouz 244, Houssam 189.
- Zeitfenster: 31/35/27/64/33/48/21 s, Summe 259 s.
  - Folie 9 hat 21 s, die Uhr zeigt am Ende 4:19.
  - Bei ruhigem Tempo: 433 / 1,8 + 18 s ≈ 259 s = 4:19.
  - Bei zügigem Tempo: 433 / 2,3 + 18 s ≈ 206 s, also etwa 3:25.
  - Bis 5:00 bleiben 41 s.
- Spätfall nach den Annahmen von cf-test: mit nur K3 auf Folie 5 etwa 4:27, mit Einleitung und K2 etwa 4:39.
- Andere Folien, Notizen, Links und Ausblendung bleiben unverändert.

Wortlaut:

```text
Folie 9, Kasten (ersetzt Überschrift „Nächster Test an einem echten Umbau“ und die drei Zeilen):
Überschrift: Kurzcheck an einem echten Dortmunder Umbau erproben
Zeile 1: Mit einer Projektleitung prüfen: Hilft die Entscheidungskarte, die Fachprüfung rechtzeitig anzustoßen?
Zeile 2: Sie zeigt, was bis zur Frist fehlt, wer es liefert und was als Nächstes zu tun ist.
Zeile 3: Dafür klären wir auch die benötigte Prüfzeit.

Folie 9, Notiz (ersetzt den ganzen bisherigen Text; 40 Wörter):
Diesen Kurzcheck wollen wir mit einer Projektleitung an einem echten Dortmunder Umbau erproben. Dabei prüfen wir, ob unsere Entscheidungskarte hilft, die Fachprüfung rechtzeitig anzustoßen. Dafür klären wir auch die benötigte Prüfzeit. Bringen Sie uns mit einem passenden Umbauprojekt in Kontakt.

Folie 9, Zeitfenster: etwa 21 Sekunden · Uhr am Ende: 4:19
```

Unverändert auf Folie 9 bleiben:
- der Titel
- der Kasten „Im Sprint gelernt“ mit beiden Zitaten
- die Bitte „Unsere Bitte: Bringen Sie uns mit einem Dortmunder Umbauprojekt in Kontakt.“
- die Quellenzeile

Sprechtext-Deckblatt:
- Die Zeit bei zügigem Tempo im Zeitsatz (`ZEITEN_SATZ` in `sprechtext.js`, bisher fest „etwa 3:40“) wird aus der
  Wortzahl berechnet.
- Rechnung: Wörter / 2,3 + 18 s, gerundet auf 5 s, mit „etwa“ davor. Das ergibt jetzt „etwa 3:25“.

README:
- **Abschnitt 2:**
  - Zeile 9 der Tabelle: 21 s / **4:19**.
  - „Der Standard-Sprechtext hat 433 Wörter. Feyrouz spricht 244, Houssam 189 und bedient die Demo.“
  - Tempo: ruhig 4:35 → 4:19; zügig „etwa 3:40“ → „etwa 3:25“; bis 5:00 bleiben 41 Sekunden.
- **Abschnitt 3:** Spätfall „etwa 4:45“ → „etwa 4:27“. „Wer auf Folie 5 auch Einleitung und K2 spricht, kommt auf
  etwa 4:39.“
- **Abschnitt 4:**
  - Spätfall: „Ziel: Ende etwa 4:27.“
  - Gesamter Vortrag: „gerechnet 4:19, Grenze 5:00“ statt „Ziel 4:35, Grenze 5:00“.
- **Abschnitt 9:**
  - Zeile „Standard-Sprechtext mit rund 450 Wörtern“: „433 Wörter (am 17.11. vom Team weiter gekürzt)“.
  - Zeile „Timing“: „erfüllt (4:19)“.
- **Abschnitt 11:** Ersatzkandidat für Praxisfeedback: „Dafür klären wir auch die benötigte Prüfzeit.“

Abnahme:
- `exportiere.sh` läuft durch. `validate.py` meldet PASSED. Die Sprechtext-Selbstprüfung meldet OK, der Sprechtext hat
  16 Seiten.
- `baue.js` meldet 433 Wörter und 259 s (4:19).
- Folienseite 9 ist angesehen: nichts abgeschnitten, nichts überlappt, Haupttext mindestens 20 pt, die Bitte steht
  frei. Alle anderen Folienseiten sind pixelgleich zu `8684a0a`.
- Links und Ausblendung sind unverändert. Die Fassungen A, B und C bleiben unverändert.
