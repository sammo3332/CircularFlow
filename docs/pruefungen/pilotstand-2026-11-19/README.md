# Pilotstand 19.11.2026 · Prüfbericht und Übergabe

Dokumentversion 1.0 · Stand 19.11.2026 · Branch `codex/pilotstand-20261119` · Ausgangscommit `f3c57a9`
(`codex/uebernahme-scan-pitch-20261118`, Scan-Integration von ChatGPT), Merge von `claude/bold-fermat-t1ngwv` (`665ffdb`, CF-PWA-01),
Umsetzung `c297aa5` und Folgecommits auf diesem Branch. Bearbeitung: Claude (Hauptsitzung); unabhängige Prüfung durch die Agenten
cf-review und cf-test (Abschnitt 6). Auftrag: Team, 19.11.2026, „technische Fertigstellung, durchgehend nutzbarer Pilotstand“.

Nicht veröffentlicht, nicht gemergt, keine Zugriffsrechte externer Dienste geändert, keine Käufe. Der Pitch-Stand `codex/plattform-v1`
(Code `2121b92`) und die geteilte Vorschau bleiben unverändert.

## 1 Aufgabe

- **Nutzerproblem:** Eine Projektperson will vor Ort ein Bauteil mit Foto und Typenschild erfassen, die Angaben prüfen, einen passenden
  Bedarf finden, fehlende Angaben und Fristen klären, eine Prüf- oder Logistikleistung anfragen und den Verlauf dokumentieren. Zwei
  Projektseiten (Verkäufer, Käufer) brauchen denselben Datenstand.
- **Gewünschtes Verhalten:** der Ablauf aus dem Auftrag, am Rechner und am Smartphone, ohne erfundene Werte, mit Herkunft je Angabe,
  ohne stillen Datenverlust, mit sichtbarem Speicherstatus, regelbasierten Hinweisen (nicht als KI) und dem Geschäftsmodell laut
  Teamvorgabe (Provision nur nach abgeschlossenem Verkauf und nur laut Vereinbarung).
- **Ausgeschlossen:** Veröffentlichung, Merge, Hosting/HTTPS, echte Nachrichten, Zahlungen, Verträge, erfundene Partner,
  Bauteilerkennung aus Fotos, Fachfreigaben durch die Plattform, Änderungen am Pitch-Stand.
- **Akzeptanzkriterien:** siehe Tabelle in Abschnitt 4 (A1 bis A13), jeweils mit ausgeführtem Beleg.

## 2 Bestandsprüfung (Ausgangsstand `f3c57a9` + `665ffdb`, geprüft am 19.11.2026)

| Funktion | vorhanden | tatsächlich geprüft (vor dieser Arbeit) | fehlte | nächste Änderung (jetzt umgesetzt) |
|---|---|---|---|---|
| Etikett-Texterkennung (Tesseract.js, 4 Felder) | ja (`f3c57a9`) | nur unter Node mit synthetischen Bildern; **im Browser nie** (Modulimport war falsch: `createWorker` ist kein benannter Export der ESM-Datei) | Fortschritt, Abbruch, Zeitlimit, Fehlertexte je Ursache, deutsche Sprachdatei, Eingabe ohne Scan | alles umgesetzt; im Browser geprüft (0,8 s am Rechner und in der Handy-Emulation) |
| Korrektur und Einzelbestätigung | ja | Node-Tests | Herkunft „am Foto bestätigt“ auch ohne Foto; Checkbox nach manueller Eingabe gesperrt | Herkunft unterscheidet jetzt ausgelesen / manuell / am Foto bestätigt / geprüft; Checkbox folgt der Eingabe |
| Speichern im Bauteilpass, Neuladen | ja | Node-Tests (Speichern/Laden), CF-PWA-01-Browserlauf ohne Etikett | Speicherfehler erschien als Erfolg; keine Datei-Sicherung; keine gemeinsame Datenhaltung | Fehlerseite statt Erfolg; Datenstand als Datei sichern/laden; Pilotserver mit Räumen und Schlüsseln |
| Mobile Erfassung, Installierbarkeit (PWA) | ja (`665ffdb`, getrennter Branch) | Playwright-Emulation Pixel 7 / iPhone 13 (kein Gerät) | Branch war nicht mit dem Scan-Stand vereint | gemergt, Konflikte in `erfassung.js`/`main.js` aufgelöst |
| Simulierte Erkennung (Seitenverhältnis) | Funktion vorhanden; im Ablauf schon nicht mehr aufgerufen | Regeltest der alten Funktion | Reste in Oberfläche und Gruppenwahl („Vorschlag aus Simulation“) | aus dem Ablauf entfernt; Funktion bleibt nur für den historischen Test |
| Abgleich Angebot/Bedarf (weiter, knapp, fehlt, Klärung, zu spät) mit Begründung, nächstem Schritt, Rolle, Frist | ja (Fassung 2) | Regeltests, Browserläufe der Prüfrunden 1 und 2 | Kennzeichnung „regelbasiert, keine KI“; Interesse der Käuferseite | ergänzt |
| Vorgang (Prüfbitte, Fachergebnis, Vormerkung, Übergabe) | ja | Regeltests, Browserläufe | – | unverändert |
| Angebot bearbeiten, Verfügbarkeit aktualisieren | nein | – | fehlte | Formular im Bauteilpass, Überlagerung im Datenstand, Verlaufseintrag |
| Prüf-/Logistikanfrage mit Dienstleister und Verlauf | nein | – | fehlte | `pilot.js` + Ansichten `#anfragen`, `#anfrage-…`, `#anfrage-neu-…` |
| Geschäftsmodell (Verkauf, Provision) | nein (Hypothese in §6 der Entscheidungsdatei) | – | fehlte | Block „Verkauf und Provision“ im Bauteilpass |
| Regeltests | 225 (nach Merge) | ja | Tests für neue Regeln | 232 Tests, davon 7 neu (`pilot.test.mjs`, `etikett.test.mjs`) |

## 3 Was geändert wurde (Kurzfassung)

- **Texterkennung** (`plattform/app/etikett-integration.js`): Sprachdatei `deu` (liest deutsche und englische Etiketten, Umlaute
  richtig; `eng` las „Turenwerk Muller“), Fortschrittsanzeige, Abbrechen, Zeitlimit 60 s, Fehlertexte für Dateityp, Größe, beschädigtes
  Bild, fehlende Engine; das Etikettfoto wird vor der Engine dekodiert. Neues Foto verwirft alte Vorschläge sofort. „Angaben ohne Scan
  eintragen“ für die manuelle Eingabe. Sprachvergleich: `werkzeug/ocr-sprachvergleich.mjs`, Ergebnis in
  `plattform/etikett-versuch/pruefung/ocr-ergebnis-2026-11-19.json`.
- **Herkunft** (`plattform/etikett-versuch/etikett.mjs`): je Angabe `herkunft` (ausgelesen/manuell), `amFoto`, lesbare Quelle.
- **Erfassung** (`erfassung.js`, `main.js`): Typenschildblock mit zwei Aufnahmewegen, Lauf- und Fehlerzustand; Prüfung neben dem Foto;
  Speicherfehler als eigene Seite; Kennung entsteht erst beim Speichern; keine simulierten Vorschläge.
- **Pilotbetrieb** (`pilot.js`, `pilot-aktionen.js`, `ansichten/anfragen.js`): Interesse, Dienstleister, Anfrage-Statuskette,
  Angebotsänderung, Verkauf, Provision, letzte Änderung; Bauteilpass, Abgleich, Bedarf und Arbeitsliste verweisen darauf.
- **Datenhaltung** (`zustand.js`, `sync.js`, `server/pilotserver.mjs`, `ansichten/pilotraum.js`): neue Persistenzschlüssel mit
  Prüfung beim Laden; Datei-Export/-Import mit Zusammenführung; Pilotserver (statische Auslieferung + Räume mit Bearbeitungs- und
  Leseschlüssel, Versionsprüfung mit Konfliktantwort, 15-MB-Grenze, keine Auslieferung des Datenordners oder von `node_modules`).
- **Dokumente:** `plattform/README.md` (Start, Klickpfad, echt/nicht echt), `docs/produktentscheidungen.md` §7 (A8, A9, V10 bis V15),
  `docs/praxistest/erfassungsvergleich-vorlage.md` + `.csv` (fünf Bauteile, ohne Messwerte).

## 4 Prüfungen (alle am Codezustand von Commit `c297aa5`, Folgekorrektur der Herkunftsanzeige in `erfassung.js`/`main.js` danach erneut mit Regeltests geprüft)

| Befehl | Rohausgabe | Ergebnis |
|---|---|---|
| `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs` | [`rohausgaben/regeltests.txt`](rohausgaben/regeltests.txt) | 232 von 232 bestanden |
| `cd plattform/etikett-versuch && node test/ocr.mjs` (Node, Sprachdatei deu) | [`rohausgaben/ocr-node.txt`](rohausgaben/ocr-node.txt) | 5 Fixtures: 4 Etiketten vollständig richtig (auch Umlaute), leeres Bild ohne Angabe |
| `node docs/pruefungen/pilotstand-2026-11-19/werkzeug/browserlauf.mjs <Testdaten>` (Playwright, Chromium 153, Pilotserver) | [`rohausgaben/browserlauf.txt`](rohausgaben/browserlauf.txt), Bilder in [`bilder/`](bilder/) | 63 von 63 bestanden |
| `node plattform/bauen-artifact.mjs <Wegwerfordner>` | – | gebaut (41 Begleitdateien); die Vorschau-Fassung enthält keine OCR-Engine und keinen Pilotserver |

Umgebung: Node 22.23, Playwright-Chromium 153 (Headless), Linux-Container. **Kein echtes Gerät, keine Kamera, kein HTTPS.**
Testdaten: gezeichnetes Bauteilfoto, synthetische Etiketten (`plattform/etikett-versuch/fixtures/`), beschädigte PNG-Datei,
Textdatei, Rauschbild (`werkzeug/testdaten.py`).

| Nr. | Kriterium (Auftrag) | Ergebnis | Beleg |
|---|---|---|---|
| A1 | Projekt und Ort wählen, Bauteilfoto, gesondertes Typenschildfoto, Texterkennung mit Bearbeitungszustand | erfüllt (Emulation) | Browserlauf „rechner“ und „handy“, `bilder/rechner-2-etikett-gelesen.png` |
| A2 | Erkannte Angaben neben dem Foto prüfen, korrigieren; Korrektur hebt Bestätigung auf; ohne Bestätigung kein Speichern | erfüllt | Browserlauf Zeilen „Korrektur hebt…“, „Speichern ohne Bestätigung…“, `bilder/rechner-3-pruefen.png`, `rechner-5-gesperrt.png` |
| A3 | Unlesbares bleibt offen, keine erfundenen Werte | erfüllt | leeres Bild: „0 von 4“; Regeltests `etikett.test.mjs`, `parser.test.mjs` |
| A4 | Neues Foto übernimmt keine alten Vorschläge | erfüllt | Browserlauf „Neues Etikettfoto verwirft…“ |
| A5 | Fehler: Dateityp, beschädigt, groß, Ladefehler, Abbruch | erfüllt (groß: Regel 20 MB/24 MP, nicht mit echter Datei ausgelöst; Ladefehler: Fehlertext vorhanden, nicht ausgelöst) | Browserlauf „Falscher Dateityp“, „Beschädigtes Bild“, „Abbruch während des Ladens“ |
| A6 | Manuelle Eingabe ohne Scan, Herkunft „manuell eingegeben“ | erfüllt | Browserlauf „Angaben ohne Scan“, Regeltest „Ohne Scan…“ |
| A7 | Bauteilpass mit Herkunft je Angabe, letzter Änderung, Speichern/Neuladen; Speicherfehler kein Erfolg | erfüllt (Speicherfehler: Regeltest-Pfad und Node-Rendering der Fehlerseite; im Browser nicht ausgelöst) | `bilder/rechner-7-pass.png`, Browserlauf „nach Neuladen…“ |
| A8 | Gemeinsame Datenhaltung: zwei Sitzungen, getrennte Räume, Leserecht, vorhandene Daten erhalten | erfüllt (lokal, Chromium-Profile) | Browserlauf „Pilotraum“, `bilder/rechner-pilotraum-verbunden.png` |
| A9 | Verkäufer bearbeitet Angebot/Verfügbarkeit, sieht Interessenten und Anfragen; Käufer hält Interesse fest | erfüllt | Browserlauf „Angebot bearbeitet“, „Interesse festgehalten“, `bilder/rechner-abgleich-interesse.png` |
| A10 | Ergebnisse weiter/fehlt/zu spät mit Begründung, fehlender Angabe, nächstem Schritt, Rolle, Frist; regelbasiert gekennzeichnet | erfüllt | Browserlauf drei Abgleiche |
| A11 | Keine simulierte Erkennung im Ablauf | erfüllt | `erfassung.js` ohne `erkennung`-Anzeige; Regeltest der alten Funktion bleibt |
| A12 | Anfrage mit Pflichtfeldern, Dienstleister (Testeintrag/freigegeben), Statuskette, Ergebnis nie automatisch, nichts versendet | erfüllt | Browserlauf „Anfrage…“, Regeltest `pilot.test.mjs`, `bilder/rechner-anfrage-verlauf.png` |
| A13 | Verkauf/Provision: ohne Abschluss keine Provision, ohne Vereinbarung offen, keine Prozentsätze, keine Zahlung | erfüllt | Browserlauf „Verkauf…“, Regeltest, `bilder/rechner-pass-verkauf.png` |

Geprüfte Fehlerfälle außerdem (Regeltests): ungültiges Baujahr, HTML-Escaping der Eingaben, Speicherknappheit (Etikettfoto entfällt,
Metadaten bleiben), beschädigte Datei beim Laden, Rückdatierung von Anfrageschritten, fremde Kennungen.

## 5 Stufen der Fertigstellung

| Stufe | Stand |
|---|---|
| Technisch umgesetzt | gesamter Ablauf aus dem Auftrag, Pilotserver, Datei-Sicherung |
| Im Browser geprüft | ja (Chromium Headless, Rechner 1280 × 800 und Emulation Pixel 7), Rohausgabe und Bilder liegen bei |
| Am Smartphone geprüft | **nein** – Emulation ersetzt keinen Kameratest; Installation als App am Gerät nicht geprüft |
| Mit echten Nutzern geprüft | **nein** – kein Praxistest, keine echten Typenschilder, keine Dienstleister |

Eine durchgehende Simulation bleibt eine Simulation: Beispielprojekte, Fristen, Personen und Bedarfe sind fiktiv.

## 6 Unabhängige Prüfung (cf-review, cf-test)

Wird nach Abschluss der Agentenläufe ergänzt (Befunde, Behebung, erneute Prüfung).

## 7 Bekannte Fehler und Grenzen

1. **Kein Gerätetest.** Kamera, Handy-Browser (Safari, Chrome Android), Installation und reale Ladezeiten der Engine (etwa 1,5 MB
   Sprachdatei + Engine) sind nicht gemessen; 0,8 s gelten für den Container.
2. **Echte Typenschilder** (Prägung, Glanz, Schmutz, Schrägen) sind nicht geprüft; die Parserregeln erwarten Beschriftungen wie
   „Hersteller:“ / „Modell:“ / „Seriennummer:“ / „Baujahr:“ oder englische Entsprechungen. Fehlt die Beschriftung, bleibt das Feld leer
   und wird von Hand eingetragen.
3. **Pilotserver:** nur HTTP, nur im eigenen Netz; Raumschlüssel statt persönlicher Konten; keine Protokollierung, wer geändert hat
   (Einträge heißen „Eigene Eingabe“). Zwei gleichzeitige Erfassungen mit derselben Kennung innerhalb weniger Sekunden: Der Abgleich
   behält den Eintrag des Raums und meldet den Konflikt; der verworfene Eintrag ist im lokalen Browser nicht automatisch wiederhergestellt.
   Leseschlüssel: Änderungen bleiben lokal und werden als solche angezeigt, aber nicht verhindert.
4. **Anfrage ↔ Vorgang:** Eine Anfrage „Fachprüfung“ setzt das Fachergebnis des Vorgangs nicht automatisch; beides wird getrennt
   eingetragen (gewollt), ist aber nur über Verweise verbunden.
5. **Vorschau-Fassung (`bauen-artifact.mjs`)** enthält weder OCR-Engine noch Pilotserver; dort erscheint der Fehlertext „Engine fehlt“.
6. **Keine Objekterkennung.** Es gibt kein geprüftes Modell, keine Freigabe zur Bildverarbeitung und keine Hardwareprüfung; ein Knopf
   dafür wurde bewusst nicht eingebaut.
7. **Zeitersparnis nicht gemessen.** Die Vorlage für fünf echte Bauteile liegt vor (`docs/praxistest/erfassungsvergleich-vorlage.md`).

## 8 Zuordnung der Pitchaussagen zum Produktstand (Sprechtext vom 19.11.2026)

| Aussage (Folie) | umgesetzt | Prüfbeleg | noch offen | zulässige Formulierung im Pitch |
|---|---|---|---|---|
| F4 „Wer verkaufen möchte, fotografiert … trägt Angaben ein. Im Bauteilpass stehen Menge, Maße, Zustand, Verfügbarkeit.“ | ja | Browserlauf A1–A7, `bilder/rechner-7-pass.png` | – | wie gesprochen; „Prototyp mit Beispieldaten“ beibehalten |
| F4 „Wer etwas sucht, gibt seinen Bedarf an. Die Plattform gleicht ab … weitergeprüft … fehlen Angaben.“ | ja | A10 | Entwurfsregel, fachlich nicht geprüft | wie gesprochen, „Vorschlag zur Prüfung, keine Freigabe“ mitdenken |
| F5 „Prüfung am 2. Dezember fertig, fünf Tage nach der Bestellfrist … zweites Beispiel: Zeit zum Weiterprüfen … Schaltfläche legt Vorgang an“ | ja (Beispieldaten, angenommene Prüfzeit) | A10, Ersatzfolien 11/12 | – | „angenommene Prüfzeit“ aussprechen |
| F6 „Texterkennung an künstlichen Typenschildern getestet: Hersteller, Modell, Seriennummer, Baujahr. Angaben müssen geprüft und bestätigt werden.“ | ja, jetzt auch im Browser | A1–A3, OCR-Node-Test | echte Typenschilder | wie gesprochen; nicht „funktioniert auf der Baustelle“ |
| F6 „Später soll KI Bauteile auf Fotos erkennen und nächste Schritte vorschlagen. Messen und fachlich prüfen müssen Menschen.“ | nein (bewusst) | A11 | Modell, Freigabe, Hardware | „später“ beibehalten; nächste Schritte sind heute regelbasiert |
| F6 „Ob wir Zeit sparen, müssen wir noch messen.“ | Vorlage liegt vor | `docs/praxistest/erfassungsvergleich-vorlage.md` | Messung | wie gesprochen |
| F7 „Kontakt zu Prüf- und Logistikunternehmen … Käufer und Verkäufer bezahlen die Leistungen … nach Verkauf zahlen diese uns eine vereinbarte Provision … noch zu klären“ | Dokumentation im Produkt: Anfrage, Dienstleister, Verkauf, Provisionsstatus | A12, A13 | Akzeptanz, Höhe, Kostentragung | wie gesprochen („noch zu klären“ beibehalten); keine Partner nennen |
| F8 „Plattform an einem echten Umbauprojekt testen … festhalten, was angeboten, geprüft, eingebaut wird“ | Datenfelder vorhanden (Anfrageverlauf, Verkauf) | – | Praxistest nicht durchgeführt | „Bisher noch nicht durchgeführt“ beibehalten |
| F9 Team zu dritt (Adil Al-Chaabawi: Bautechnik und Baudaten) | – | Steckbrief/Folie; nicht im Repository belegt | Steckbrief im Repository nennt nur zwei Personen | nur sprechen, wenn das Team es bestätigt |
| F10 „circularflowdortmund.vercel.app – Web-App-Prototyp“ | veröffentlichte Vorschau = Pitch-Stand `2121b92`, **nicht** dieser Pilotstand | – | Deployment des Pilotstands nicht beauftragt | „Prototyp“ sagen; nicht „Pilotstand mit Texterkennung ist online“ |

## 9 Nächste Aufgaben (Vorschläge, Zuständigkeit und Frist vom Team zu bestätigen)

| Aufgabe | Wer / Frist | Abschlusskriterium |
|---|---|---|
| Geräteprobe: Pilotserver im WLAN starten, am Handy `#erfassung` mit Kamera, Typenschild, Bestätigung, Speichern, Neuladen; Dauer und Fehler notieren | Houssam, vor dem Pitch (20.11.) | Protokoll mit Gerät, Browser, OCR-Dauer, Fehlern; bei Fehlschlag nur Ersatzbilder zeigen |
| Erfassungsvergleich an fünf echten Bauteilen mit der Vorlage | Feyrouz (Zugang), Houssam (Zeit), Termin offen | ausgefüllte Vorlage; erst danach Zeitaussage |
| Pilotraum mit Team und einer Projektleitung erproben (zwei Geräte, ein Raum, Leseschlüssel für Beobachter) | Team, nach dem Pitch | beide Seiten sehen denselben Stand; Konfliktfall einmal absichtlich ausgelöst und dokumentiert |
