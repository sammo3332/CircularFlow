# Prüflauf `cf-test`, Runde 1 · 18.11.2026

Dokumentversion 1.0 · Stand 18.11.2026 · Ausgeführt vom Agenten `cf-test` auf zwei festen Codeständen:

- **Teil A, Pitch-Stand:** Branch `codex/plattform-v1`, Commit `23dc050` (Arbeitsverzeichnis sauber, `plattform/` und
  `prototype/` seit `2121b92` nur in `plattform/README.md` geändert).
- **Teil B, Entwicklungsstand:** Branch `codex/plattform-entwicklung-20261118`, Commit `dca307f` (Arbeitsverzeichnis sauber).

Umgebung: Node v22.23.4, Python 3.13, Chromium über Playwright 1.63.0 (headless, je Ablauf ein frischer Kontext, Sprache
de-DE, Zeitzone Europe/Berlin, 1440 × 810, BA-4 zusätzlich 390 × 844). Die Rohausgaben stehen in `rohausgaben/`, die
Werkzeuge des Prüflaufs in `werkzeug/`. Der Prüflauf hat nichts im Repository verändert und nichts committet.

Dieses Dokument fasst das Ergebnis des Prüflaufs zusammen. Maßgeblich sind die Rohausgaben. Die Zahlen unten wurden
gegen sie nachgelesen.

## Ergebnis in Kürze

Alle beauftragten Prüfungen bestanden. Es gab **keinen blockierenden Befund** und keinen Befund „vor Abgabe beheben“.
Praxisbelege gibt es keine: Die Prüfzeiten von 14 und 10 Tagen bleiben Simulationsannahmen.

| ID | Prüfung | Befehl (Kurzform) | Ergebnis | Rohausgabe |
|---|---|---|---|---|
| A1 | Regeltests Pitch-Stand | `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs` | 190 von 190 | `A1-regeltests-rohausgabe.txt` |
| A2 | Pitch-Dateien gegen README | `abgleich-pitchdateien.py` | 23 von 23; 433 Wörter (244 / 189), 259 s = 4:19; eigene Zählung der Notizabsätze gleich; SHA-256 wie README | `A2-*.txt` |
| A3 | Demo, lokaler Stand | `demo-pruefung.js` | 28 von 28, keine Konsolen- und Netzfehler | `A3-demo-lokal-konsole.txt` |
| A4 | Demo, heruntergeladene Auslieferung | `demo-pruefung.js` | 28 von 28 | `A4-demo-veroeffentlicht-konsole.txt` |
| A4-N | Download gegen Nachbau aus `bauen-artifact.mjs` | `sha256sum` je Datei | 34 von 35 byte-gleich, nur `index.html` (Seitentitel und HTML-Rahmen) | `A4-nachbau-vergleich.txt` |
| A5 | Pilot-Skript auf dem Pitch-Stand | `node docs/pilot/cf-pilot-01-simulation.mjs` | Exitcode 0, Bestellfrist BD-24 erstmals am 13.02.2027 | `A5-pilot-simulation-pitchstand.txt` |
| B1a | Regeltests Entwicklungsstand | derselbe Befehl wie A1 | 210 von 210 (190 + 20 neue) | `B1-regeltests-rohausgabe.txt` |
| B1b | neue Testdatei | `node --test plattform/test/pruefbittefrist.test.mjs` | 20 von 20, nichts übersprungen | `B1-pruefbittefrist-rohausgabe.txt` |
| B1c | Pilot-Skript | `node docs/pilot/cf-pilot-01-simulation.mjs` | Exitcode 0; „Prüfbitte spätestens“ BD-24 am 05.02.2027, erstmals sichtbar am 30.01.2027; Bestellfrist erstmals am 13.02.2027 | `B1-pilot-simulation.txt` |
| B1d | Taugen die 20 Tests? (Mutationsprobe auf Kopien außerhalb des Repositorys) | `mutationen.py` | 12 Mutationen, alle erkannt, keine überlebt | `B1-mutationsprobe.txt` |
| BA-1 bis BA-5 | Browserabläufe aus Plan Abschnitt 6, Gesamtlauf | `ba-1-bis-5.js` | 61 Prüfungen, 0 Abweichungen (10 + 15 + 15 + 14 + 7) | `B2-ba1-bis-ba5-gesamtlauf.txt` |
| X1 bis X3 | Zusatzabläufe: Fristtag, Bedarf ergänzen, Bedarf ohne Annahmefenster | `ba-zusatz-*.js` | 16, 8 und 5 Prüfungen, alle bestanden | `B2-zusatz-*.txt` |
| B3 | Pitch-Demo auf dem Entwicklungsstand | `demo-pruefung.js` | 28 von 28; alle 7 Bildschirmfotos byte-gleich zu denen des Pitch-Stands | `B3-*.txt` |
| B4 | 1280 × 720 ohne seitliches Scrollen | `b4-1280.js` | 13 von 13 | `B4-1280-konsole.txt` |
| B5 | Geänderte Dateien | `git diff --stat 23dc050 dca307f` | genau die sieben im Plan erlaubten Dateien; keine verbotenen Pfade | `B5-diff-stat.txt` |
| B6 | Eigene Stichproben der Regel gegen Handrechnung (Schaltjahr, Jahreswechsel, Zeitumstellung, Prüfzeit 0 und 365, ungültige Angaben) | `b6-stichproben.mjs` | je 57 Prüfungen, 0 Fehler, in vier Zeitzonen identisch | `B6-stichproben-*.txt` |

Zwei Läufe sind mit ihren ersten, fehlerhaften Ausgaben aufbewahrt (`…lauf1-mit-Skriptfehler`, `…lauf1-mit-Erwartungsfehler`).
Die Fehler lagen in den Prüfskripten (falsche Erwartung des Prüfers), nicht in der Anwendung. Danach wurden die Skripte
korrigiert und neu ausgeführt.

## Hinweise des Prüflaufs und ihr Umgang

| Nr. | Hinweis | Umgang |
|---|---|---|
| K1 | „Letzter Tag, an dem der Abgleich noch prüfbar zeigt“ gilt nur bei vollständigen Zeitangaben. Ohne Annahmefenster meldet der Abgleich am Fristtag „Angaben fehlen“, die Bedarfsseite nennt den Tag trotzdem (Plan 2.2, Zusatzablauf X3). | Wortlaut in `plattform/README.md` und im Plan ergänzt („bei vollständigen Zeitangaben“). |
| K2 | Der Produktbrief v0.2 nennt die Frist nicht. Die Freigabe steht nur im Plan §9 und in `docs/priorisierung-nach-dem-pitch.md` §5. Der Eintrag in `00_START_HIER/ENTSCHEIDUNGEN.md` und die Bestätigung durch das Team stehen aus. | **Offen für das Team** (Abschlussbericht, Abschnitt 6). |
| K3 | Nach „Prüfbitte anlegen“ zeigt die Bedarfsseite weiter den Tag und den bedingten Satz „…solange … kein Vorgang läuft“. Wörtlich nicht falsch, plankonform. | Folgeaufgabe F-1 im Abschlussbericht (zusammen mit dem Chip „verstrichen“ bei rechtzeitig angelegtem Vorgang). |
| K4 | Restzeit unter einem Tag erscheint wie bei allen Fristen als „noch 14 Std. 59 Min.“ (bestehende Funktion `abstand`). | Keine Änderung, bestehendes Verhalten. |
| K5 | Die Bestätigungsmeldung „Bedarf … gespeichert“ verdeckt bei 390 px kurz die neue Zeile. | Keine Änderung, bestehendes Verhalten. |
| K6 | Die neue Testdatei hat 363 statt „ca. 120“ Zeilen (Schätzung im Plan zu niedrig). | Keine Wirkung. |

## Nicht ausgeführt

Praxisgespräch und Bestätigung der Prüfzeit (Fallakte §11); PowerPoint, Beamer, Stoppuhr; Firefox, WebKit, Safari und echte
Mobilgeräte (nur Chromium, 390 × 844 nur als Fenstergröße emuliert, Touch und Bildschirmleser nicht geprüft); die
veröffentlichte Vorschau im Netz (nur die lokal heruntergeladenen 35 Dateien); die Prüffälle der Türregel Revision 2
(laufen nur indirekt über die 190 bestehenden Tests und die Pitch-Demo); Neuladen der Seite mit gespeichertem Bedarf.

## Nachvollziehen

`werkzeug/` enthält die Skripte. Die Browser-Skripte erwarten eine Startadresse und einen Ausgabeordner, zum Beispiel
`node docs/pruefungen/cf-test-runde-1/werkzeug/ba-1-bis-5.js http://127.0.0.1:8122/plattform/ <Ausgabeordner>` nach
`python3 -m http.server 8122 --bind 127.0.0.1` im Repository-Wurzelverzeichnis des **Entwicklungsbranches**.
Die Rohausgaben nennen Pfade der Arbeitsumgebung (zum Beispiel `/home/user/CircularFlow`), die Skripte selbst enthalten keine absoluten Pfade.
