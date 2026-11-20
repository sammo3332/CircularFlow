# Prüflauf `cf-test`, Runde 2 (letzte Runde) · 18.11.2026

Dokumentversion 1.0 · Stand 18.11.2026 · Wiederholung der Läufe aus Runde 1 (`../cf-test-runde-1/`) auf den Endständen:

- **Pitch-Stand:** Branch `codex/plattform-v1`, Commit `2add671` (Arbeitsverzeichnis vorher und nachher sauber).
- **Entwicklungsstand:** Branch `codex/plattform-entwicklung-20261118`, Commit `92391c3` (Arbeitsverzeichnis vorher und nachher
  sauber).

Mit denselben Skripten und Befehlen wie in Runde 1, Umgebung gleich (Node v22.23.4, Python 3.13, Chromium über Playwright 1.63.0,
frischer Kontext je Lauf, de-DE, Europe/Berlin). Der Prüflauf hat nichts im Repository verändert und nichts committet. Während
des Laufs hat die Hauptsitzung in einem anderen Arbeitsverzeichnis zwei Dokument-Commits angelegt (`7a67724`, `fe9dc79`, nur
Dokumente). Geprüft wurden `2add671` und `92391c3`, nicht diese Commits. `git diff --stat 2add671 fe9dc79` zeigt nur
`docs/pruefungen/abschluss-2026-11-18.md` (neu), `probenanleitung.md` und `pruefprotokoll-2026-11-18.md`.

Die Rohausgaben (nur Text, mit Exitcodes) stehen in `rohausgaben/`, die zusätzlichen Hilfsskripte in `hilfsskripte/`. Bilder,
Serverprotokolle (nur Antworten mit Status 200) und die Mutationskopien sind nicht archiviert.

## Ergebnis in Kürze

Alle beauftragten Prüfungen bestanden, **kein blockierender Befund**. Die Ausgaben sind gegenüber Runde 1 gleich, mit einer
erwarteten Ausnahme (B1c).

| ID | Prüfung | Ergebnis | Rohausgabe |
|---|---|---|---|
| A1 | Regeltests Pitch-Stand | 190 von 190 (46 + 144), nichts übersprungen, Exitcode 0 | `A1-*` |
| A2 | Pitch-Dateien gegen README | 23 von 23; drei SHA-256-Präfixe gleich; JSON identisch zur gespeicherten Ausgabe | `A2-*` |
| A3 | Demo, lokaler Stand | 28 von 28, keine Konsolen- und Netzfehler | `A3-*` |
| A-Z | `git diff --stat b647ea3 HEAD -- pitch/innosprint-2026/ausgabe plattform prototype docs/pitch-ablauf.md` | leer; dieselbe Probe gegen `2121b92..b647ea3` ist nicht leer, die Probe ist also aussagekräftig | `A-Z-diff-stat.txt` |
| A5 | Pilot-Skript im Pitch-Stand | Exitcode 0 | `A5-*` |
| B1a | Regeltests Entwicklungsstand | 210 von 210 (46 + 164), Testliste gleich Runde 1 | `B1a-*` |
| B1b | neue Testdatei | 20 von 20, nichts übersprungen | `B1b-*` |
| B1c | Pilot-Skript | Exitcode 0, letzte Zeile „Alle erwarteten Ergebnisse eingetreten.“, Zeile „Prüfbitte spätestens“ jetzt mit „(geschätzt)“ | `B1c-*` |
| B1d | Mutationsprobe (Kopien außerhalb des Repositorys) | 12 von 12 erkannt, die unmutierte Kopie besteht 20 von 20 | `B1d-*` |
| B2 | BA-1 bis BA-5 | 61 Prüfungen (10 + 15 + 15 + 14 + 7), 0 Abweichungen; die 105 Konsolenzeilen sind byte-gleich zu Runde 1 | `B2-*` |
| B2 | Zusatzabläufe X1, X2, X3 | 16, 8 und 5 Prüfungen, zeilenweise gleich zu Runde 1 | `B2-zusatz-*` |
| B3 | Pitch-Demo auf dem Entwicklungsstand | 28 von 28; alle 7 Bildschirmfotos byte-gleich zu A3 | `B3-*` |
| B4 | 1280 × 720 ohne seitliches Scrollen | 13 von 13 | `B4-*` |
| B5 | Anwendungslogik gegenüber `dca307f` unverändert? | bestätigt: genau 4 Dateien (`plattform/README.md`, ein Kommentar in `plattform/app/ansichten/bedarfe.js`, zwei Testfilter); `bedarfe.js` ohne die Kommentarzeile ist byte-gleich zu `dca307f`; `prototype/` unverändert | `B5-*` |
| B6 | Stichproben der Regel in vier Zeitzonen | je 57 Prüfungen, 0 Fehler, byte-gleich zu Runde 1 | `B6-*` |
| C1 | Zahlen in `../cf-test-runde-1/README.md` gegen die Rohausgaben | keine Zahlenabweichung | – |
| C2 | gespeicherte Dateien in `generalprobe/ergebnisse/` | `regeltests.txt` 190/190; `dateivergleich.txt` 31 von 35 und 34 von 35, 0 Widersprüche; `bildvergleich.txt` byte-gleich zu einer frischen Ausgabe | `C2-*` |

**Einzige inhaltliche Abweichung gegenüber Runde 1 (B1c):** Zwei Zeilen der Pilot-Ausgabe unterscheiden sich. Zeile 18 nennt
jetzt „(geschätzt)“ (erwartet). Außerdem listet Variante 1 einen vierten Prüfpunkt „Geschätzte Angaben bestätigen:
Mindestprüfzeit.“. Ursache ist die eine neue Zeile im Pilot-Skript (`geschaetzt: { pruefzeitTage: true }`, Commit `995cfc1`),
die die bestehende Regel in `plattform/app/abgleich.js` auslöst. Der Anwendungscode ist nicht geändert, das Ergebnis des
Skripts bleibt grün.

## Befunde und ihr Umgang

| Nr. | Befund | Umgang |
|---|---|---|
| V1 | Fallakte (Zeile 610) und Produktideen (Zeile 60) im Entwicklungsstand verweisen auf `docs/pruefungen/abschluss-2026-11-18.md`. Die Datei gab es in `92391c3` nicht, sie kommt mit dem Merge des Pitch-Branches. | Behoben: Der Pitch-Branch mit dem Bericht wurde in den Entwicklungsbranch gemergt, der Verweis führt jetzt auf eine vorhandene Datei. |
| V2 | Die Seite BD-23 zeigt „Mindestprüfzeit 14 Tage belegt“ und „Annahmefenster … belegt“, obwohl `plattform/app/daten.js` (Zeile 162) beide Bedarfe als Beispielannahmen bezeichnet; BD-22 zeigt korrekt „geschätzt“. Bestand, nicht Teil dieses Umbaus. Betroffen ist der Pitch-Kernfall K3 (TW-01 → BD-23). | **Festgelegt am 18.11.2026 (Auftraggeber):** Im Pitch heißt es ausdrücklich „angenommene Prüfzeit“, Beispieldaten und Ersatzbilder bleiben unverändert (`docs/produktentscheidungen.md`, Plan E10). Nichts geändert, weil `daten.js` den eingefrorenen Pitch-Stand und die Ersatzbilder ändern würde. Hinweis für den Vortrag in `probenanleitung.md` (Abschnitt 2). |
| H1 | Die Fallakte (Variante 1) nennt drei Prüfpunkte, Pilot-Skript und Oberfläche zeigen mit „geschätzt (Annahme)“ vier. | Fallakte im Entwicklungsstand nachgeführt. |
| H2 | Das lokale `codex/plattform-v1` stand auf `2add671`, die Remote auf `fe9dc79`. | Beim Abschluss angeglichen. |
| H3 | Die Rohausgaben von A5 und B1c aus Runde 1 enthalten keine Exitcode-Zeile; es gibt einen dritten Vorlauf mit Skriptfehler (`B2-ba5-probe.txt`); B6 hatte im Vorlauf 60 Prüfungen mit 3 Fehlern. | Die Exitcodes stehen jetzt in `rohausgaben/` (Runde 2). `../cf-test-runde-1/README.md` nennt die Vorläufe. |
| H4 | Ein Link auf einen nicht vorhandenen Bedarf zeigt einen Hinweistext ohne `h1` und ohne Konsolenfehler, auf beiden Ständen gleich. | Bestand, keine Änderung. |
| H5 | Produktbrief v0.2 und `docs/entscheidungen.md` nennen die Frist nicht. Der Eintrag in `00_START_HIER/ENTSCHEIDUNGEN.md` fehlt im Repository. | Offen für das Team (wie K2 in Runde 1). |

## Nicht ausgeführt

Praxisbeleg (kein Gespräch, keine bestätigte Prüfzeit); Aufmaßeingabe und die Prüffälle der Türregel Revision 2 als eigene
Fälle (nur indirekt über die 190 und 210 Tests und die Pitch-Demo; ausstehend ist die manuelle Prüfung im Browser: ein Aufmaß an
E-01 eingeben und den Wechsel vor und nach der Ersatzentscheidungsfrist durchspielen); Neuladen der Seite mit gespeichertem
Bedarf; Abruf der Vorschau auf claude.ai (A4 nicht wiederholt, nur die Prüfsummen-Gegenprobe C2); Firefox, WebKit, Safari, echte
Mobilgeräte, Touch, Bildschirmleser; PowerPoint, Beamer, Stoppuhr; die Commits `7a67724` und `fe9dc79` wurden nicht inhaltlich
geprüft (die Prüfzahlen im Berichtsentwurf wurden gegen die Läufe gelesen und stimmen).
