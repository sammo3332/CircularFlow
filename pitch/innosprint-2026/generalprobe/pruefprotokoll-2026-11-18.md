# Prüfprotokoll · Pitch-Dateien und Demo · 18.11.2026

Dokumentversion 1.1 · Stand 18.11.2026 · Branch `codex/plattform-v1` · Ausgangscommit `23dc050` ·
geprüfter Deck-Stand `b647ea3` (Pitch-Dateien seitdem unverändert). Prüfende: Koordination (Claude Code), alle Befehle selbst ausgeführt.
Die Ausgaben der Prüfungen liegen in `ergebnisse/`. Uhrzeiten der Ausführung werden nicht angegeben, maßgeblich ist der Commit.
Umgebung: Linux, Chromium über Playwright, Python 3, Node.js, Poppler, LibreOffice nur für die frühere Erzeugung der PDFs.

Dieses Protokoll übernimmt keine Angabe aus früheren Prüfberichten. Was hier steht, wurde in dieser Runde gerechnet,
ausgelesen oder angesehen. Früher geprüfte Punkte, die hier nicht wiederholt wurden, stehen unter „Nicht ausgeführt“.

## 1. Pitch-Dateien gegen README

- **Befehl:** `python3 -I pitch/innosprint-2026/generalprobe/pruefskripte/abgleich-pitchdateien.py <Repository> <Ausgabe.json>`
- **Ergebnis:** 23 von 23 Prüfungen bestanden (`ergebnisse/abgleich-pitchdateien.json`).
  - Prüfsummen (SHA-256, Anfang) wie in der README: PPTX `9d5a86e7e239229a`, PDF `bc7f651fa7b5b669`, Sprechtext
    `e210d241234c43b0`.
  - 15 Folien in der PPTX, ausgeblendet genau die Folien 5, 6 und 10 bis 15.
  - Links: PPTX Folie 4 → 5 und 6, Folie 5 → 6 und 7, Folie 6 → 7, sonst keine. PDF: dieselben fünf Ziele, das
    Zielseitenobjekt je Link der Seitenzahl zugeordnet.
  - Wortzahl nach der Zählregel des Generators (`werkzeug/baue.js`): 433, Feyrouz 244, Houssam 189. Der Absatz
    „Bei Rückfragen:“ auf Folie 8 sowie „Klick:“ und „Bei Zeitdruck:“ zählen nicht.
  - Zeitfenster 31, 35, 27, 64, 33, 48 und 21 s, Summe 259 s. Die Uhrzeiten am Ende (0:31, 1:06, 1:33, 2:37, 3:10, 3:58,
    4:19) sind die laufende Summe. Die Zeit bei ruhigem Tempo (433 / 1,8 + 18 s) ergibt ebenfalls 259 s. Bei zügigem
    Tempo (433 / 2,3 + 18 s, auf 5 s gerundet) ergibt sich 3:25.
  - Die README nennt dieselben Werte (Wörter, Anteile, Tabelle, Dauer ruhig und zügig, Rest bis 5:00 = 41 s).
  - Folien-PDF: 15 Seiten, die Schriften sind eingebettet (Liberation Sans, metrisch gleich zu Arial), der Anfang jedes
    Titels steht auf der passenden Seite.
  - Sprechtext-PDF: 16 Seiten, jeder Notizabsatz aller 15 Folien steht im Text, das Deckblatt nennt 433 Wörter,
    259 s (4:19) und etwa 3:25 bei zügigem Tempo.
- **Sichtprüfung:** Alle 15 Folienseiten bei 96 dpi in einer Übersicht angesehen, die Seiten 8 und 9 zusätzlich einzeln.
  Nichts ist abgeschnitten, nichts überlappt. Die Kennzeichen „Hypothese“ (Folie 8), „Beispieldaten“ und „Simulation“
  (Folie 4) sowie „Annahme, unbestätigt“ (Folie 2) sind sichtbar.

## 2. Veröffentlichte Auslieferung, nur lesend

- Die veröffentlichte Vorschau „CircularFlow Fassung 2“ (Version `1794826502-00b9`) wurde **weder verändert noch neu
  veröffentlicht**. Mit dem Werkzeug „Artifact“ wurden ihre 35 Dateien aufgelistet und lesend heruntergeladen.
- **Vergleich mit dem Repository** (`python3 -I pruefskripte/dateivergleich.py`, Ausgabe und SHA-256 aller 35 Dateien in
  `ergebnisse/dateivergleich.txt`):
  - Lokale Dateien in `plattform/` gegen den Download: 31 von 35 Dateien byte-gleich. Die vier Abweichungen
    (`app/main.js`, `index.html`, `styles.css`, `app/door-rules.mjs`) sind der Bauschritt der Veröffentlichung
    (Schriften als `data:`-URI, Türregel neben den Modulen, HTML-Rahmen).
  - Darum zusätzlich `node plattform/bauen-artifact.mjs <Zielordner außerhalb des Repositorys>`: Der Nachbau und der
    Download sind in 34 von 35 Dateien byte-gleich. Nur `index.html` weicht ab, und zwar im Seitentitel („CircularFlow
    Fassung 2“ gegen „CircularFlow Plattform“) und durch den vom Dienst ergänzten HTML-Rahmen (Unterschied gespeichert in
    `ergebnisse/index-html-diff.txt`).
- **Folgerung** (aus dem Dateivergleich, nicht aus dem Öffnen der Seite): Die heruntergeladenen Dateien der veröffentlichten
  Vorschau entsprechen `plattform/` in diesem Repository nach dem Bauschritt der Veröffentlichung (Code `2121b92`, seitdem
  nur die README geändert; Ausgabe von `git diff --stat` in `ergebnisse/diff-anwendungscode.txt`).
- **Nicht geprüft:** Die Seite auf claude.ai selbst wurde nicht in einem Browser geöffnet (kein Zugang von hier). Die
  Freigabe und die Sichtbarkeit der Vorschau sind nicht geprüft.

## 3. Demo im frischen Browserkontext

- **Befehle:** Je ein statischer Server (`python3 -m http.server`) für den lokalen Stand (Repository-Wurzel, Adresse
  `/plattform/`) und für den heruntergeladenen Stand, danach
  `node pitch/innosprint-2026/generalprobe/pruefskripte/demo-pruefung.js <Startadresse> <Ausgabeordner> <Bezeichnung>`.
- **Einstellungen:** Chromium, neuer Kontext je Lauf (nichts gespeichert), Fenster 1440 × 810 bei Skalierung 1,5 für die
  Bilder, danach 1280 × 720 für die Scroll-Prüfung, Sprache de-DE, Zeitzone Europe/Berlin.
- **Ergebnis:** 28 von 28 Prüfungen im lokalen Stand und 28 von 28 in der **lokal geöffneten Kopie** der veröffentlichten
  Auslieferung, also den heruntergeladenen Dateien, nicht der Seite auf claude.ai
  (`ergebnisse/demo-lokal.json`, `ergebnisse/demo-veroeffentlicht.json`), keine Konsolenfehler und keine
  fehlgeschlagenen Netzanfragen.
  - Startbedingung: „8 Paare davon 2 prüfbar“, „2 Vorgänge“, Stichtag „Mi 18.11., 14:00 (Simulation)“, „Zeitkritisch
    (7 Tage)“ mit „4 Fristen“, oben „noch 2 Std. · Aufmaßfrist · E-01 · T-07 → B-02“.
  - K2: 8 Paare, davon 2 prüfbar; die Zeilen TW-01 → BD-23 und TW-05 → BD-22 sind vorhanden.
  - K3 (TW-01 → BD-23): „Für diese Entscheidung zu spät“, „Prüfende 02.12.2026 liegt 5 Tage nach der Bestellfrist
    27.11.2026“, „Vorschlag zur Prüfung, keine fachliche Freigabe“. „Prüfbitte anlegen“ hat `aria-disabled="true"`, der
    Sperrgrund „Gesperrt. Für diese Entscheidung zu spät …“ steht daneben. Ein Klick auf den Knopf legt nichts an.
  - K4 (TW-05 → BD-22): „Weiter prüfen“, „Vorschlag zur Prüfung, keine fachliche Freigabe“, „Prüfende 28.11.2026 liegt
    123 Tage vor der Bestellfrist 31.03.2027“. Der Knopf ist nicht gesperrt und wurde nicht angeklickt.
  - Nach dem Durchlauf unverändert 8 Paare, davon 2 prüfbar, und 2 Vorgänge.
  - Kein seitliches Scrollen bei 1280 × 720 auf Übersicht, Paarliste, K3 und K4.
- **Zum ersten Demo-Satz („Am Einbauort fehlt noch das Maß“):** Die Entscheidungsseite E-01 nennt als nächsten fachlichen
  Schritt: „Rohbauöffnung B-02 an der Messstelle laut P-02 messen oder ein verwertbares Aufmaß nachreichen“, dazu „Ohne
  verwertbares Aufmaß bleibt die Breite offen.“ Der Satz ist also durch die Vorschau gedeckt.
- **Pilotdaten:** Es wurden keine eigenen Daten erfasst. Der Pitch-Stand der Vorschau blieb unverändert.

## 4. Ersatzbilder

- Die Bilder `bilder/k1-uebersicht.jpg` bis `k4-weiter-pruefen.jpg` (Quelle der Ersatzfolien 5 und 6) wurden gegen eine
  neue Aufnahme mit denselben Einstellungen verglichen: gleiche Größe (2160 × 1215), 0,03 bis 0,21 % der Pixel weichen um
  mehr als 24 von 255 ab, die mittlere Abweichung liegt unter 0,7. Vermutlich ist das JPEG-Rauschen (gemessen wurden nur Pixelanteil und Mittelwert). Die Ersatzfolien zeigen also,
  was die Demo heute liefert. Befehl: `python3 -I pruefskripte/bildvergleich.py`, Ausgabe in `ergebnisse/bildvergleich.txt`.
  Die Wirkung der Bilder auf den Folien am Beamer ist nicht geprüft.
- Als Rückfall außerhalb von PowerPoint liegen vier Bilder der neuen Aufnahme (veröffentlichte Auslieferung) in
  `generalprobe/bilder/`: Übersicht, Paarliste, „fünf Tage zu spät“, „Weiter prüfen“.

## 5. Regeltests

- **Befehl:** `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs`
- **Ergebnis:** 190 von 190 bestanden (46 in `prototype/test/`, 144 in `plattform/test/`, getrennt nachgezählt in `ergebnisse/regeltests-getrennt.txt`), 0
  fehlgeschlagen, Dauer 0,95 Sekunden, ausgeführt gegen `23dc050`, Arbeitsbaum ohne Änderung an `plattform/` und
  `prototype/`. Die vollständige Ausgabe steht in `ergebnisse/regeltests.txt`. Das belegt die geprüften Fälle der Regeln
  und der Vorschau, keine allgemeine Fehlerfreiheit und keine fachliche Eignung.

## 6. Primärquellen

Die Prüfung der Quellen für die Juryantworten steht in `pitch/innosprint-2026/juryfragen/juryantworten.md`, Abschnitt 3.

## 7. Nicht ausgeführt

PowerPoint und Keynote (Öffnen, Notizen, Arial, Links im Vortragsmodus), Vortragsrechner (Alt+Tab, Netz), Beamer,
Stoppuhr, Presenter, Öffnen der Online-Vorschau auf claude.ai im Browser, Bildschirmleser.
Einzelheiten und Reihenfolge: `probenanleitung.md`, Abschnitt 5.

## 8. Grenzen der Aussagen

- „Bestanden“ gilt für die geprüften Fälle, nicht für allgemeine Fehlerfreiheit.
- Alle Zeiten sind gerechnet und nicht gestoppt. Die Zeiten für den Spätfall (4:27 und 4:39) stammen aus dem Bauauftrag
  (`plan/pitch-5min-bauauftrag.md`, „Annahmen von cf-test“) und wurden hier nur nachvollzogen: 259 s plus angenommene 8 s
  Wechselaufwand = 267 s = 4:27; dazu 21 Wörter ÷ 1,8 = etwa 12 s = 279 s = 4:39. Die 8 Sekunden sind eine Annahme.
- Die Prüfung der veröffentlichten Auslieferung belegt, dass die Dateien dem Repository entsprechen und im Chromium
  laufen. Sie belegt nicht, dass die Seite am Veranstaltungsort mit dessen Netz und Browser läuft.
