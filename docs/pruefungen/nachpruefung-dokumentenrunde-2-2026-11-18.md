# Nachprüfbericht · die drei Befunde aus Dokumentenrunde 2

Dokumentversion 1.0 · Stand 18.11.2026 · Branch `codex/plattform-v1`, Ausgangscommit `6ea30e7` (Entwicklungsbranch
`codex/plattform-entwicklung-20261118`, Ausgangscommit `270e045`). Der Commit dieses Berichts steht im Git-Verlauf.

**Gegenstand und Umfang.** Gezielte Nachprüfung der drei korrigierten Befunde aus Dokumentenrunde 2 an den tatsächlichen
Enddateien. Es war **keine neue allgemeine Prüfrunde**. Geprüft habe ich selbst, ohne Agenten, mit `grep -n` an den
Markdown-Dateien, mit `pdftotext` an den PDFs und durch Gegenlesen am Repository (`git branch`, `git worktree list`,
`git merge-base`). Geprüft wurden zuerst die Dateien des Pitch-Branches (`6ea30e7`, lokal gleich Remote, Arbeitsverzeichnis sauber),
dann habe ich die Reste behoben und dieselben Prüfungen an den korrigierten Dateien wiederholt. Die Zeilennummern unten gelten für den
Stand **nach** den Korrekturen dieser Runde.

## 1. Befund 1: Einverständnis im Praxistest

Der Befund: Die Nutzung der Angaben wurde zu Beginn als gegeben angekündigt, am Ende aber erst erfragt. Bei „nein“ zu den Notizen
widersprachen sich „Datum, Rolle“ und „nichts weiter eintragen“.

| Fundstelle | Prüfergebnis |
|---|---|
| `docs/praxistest/gespraechsleitfaden-15-minuten.md` Z. 35–36 (Einstieg) | bestanden: „Wir nutzen Ihre Angaben zur Prüfung unserer Idee. Ob wir sie ohne Namen und Büro auch in Vorträgen und Folien verwenden dürfen, fragen wir am Ende, ebenso zu Namen, Büro, Zitaten und Fotos.“ |
| Leitfaden Z. 38 | bestanden: Bei „nein“ wird nicht mitgeschrieben, festgehalten werden nur Datum und Rolle. |
| Leitfaden Z. 59–61 (Abschluss) und Z. 88 | bestanden: Die erste Abschlussfrage ist genau die angekündigte Frage; „Ohne „ja“ … wird nichts … außerhalb des Teams verwendet“. |
| `docs/praxistest/kurzcheck-einseiter.md` Z. 35–37 („Ihre Daten“) | bestanden: gleichlautend mit dem Einstieg. |
| `docs/praxistest/README.md` Z. 31–32 („Verwendung“), Z. 37 | bestanden: Nutzung zur Prüfung der Idee; Vorträge und Folien nur nach Zustimmung am Ende; Notizen nicht im Git-Repository. |
| `docs/praxistest/gespraechsnotiz-vorlage.md` Z. 8 (Einverständnis zuerst, bei „nein“ nur Datum und Rolle), Z. 14, Z. 16–20 | bestanden: Reihenfolge und Wortlaut passen zum Leitfaden. |
| Alte Formulierungen („zunächst ohne Namen und Büro“, „verwenden Ihre Angaben“, „Notizen ohne Namen verwenden“, „nichts weiter eintragen“, „Drei Fragen“) in `docs/praxistest/*.md` | bestanden: keine Treffer. |
| PDFs `kurzcheck-einseiter.pdf`, `gespraechsleitfaden-15-minuten.pdf`, `gespraechsnotiz-vorlage.pdf` (Text mit `pdftotext`) | bestanden: neue Formulierung enthalten, alte nicht. Der Einseiter hat eine Seite. |

**Verbliebener Fehler:** Leitfaden Abschnitt „Direkt danach“ verlangte, die Notiz „vollständig auszufüllen“, auch wenn die Person
den Notizen nicht zugestimmt hat. **Behoben:** Leitfaden Z. 76 („Bei „nein“ zu den Notizen entfällt dieser Abschnitt: Die Notiz enthält
dann nur Datum und Rolle.“).

**Kontrolle nach der Behebung (erneut ausgeführt):** Z. 76 ist vorhanden und im PDF des Leitfadens enthalten (1 Treffer). Alte
Formulierungen in `docs/praxistest/*.md`: 0 Treffer. Die drei PDFs tragen den Vermerk „nicht extern verwenden“, der Einseiter hat
weiter eine Seite und zeigt die drei offenen Platzhalter `[Kontakt des Teams eintragen]`, `[Zusage und Frist offen]`, `[Team trägt ein]`.

## 2. Befund 2: Sätze im Abschlussbericht

Der Befund: Sätze im Berichtsentwurf stimmten nicht oder waren nicht belegt. Geprüft in `docs/pruefungen/abschluss-2026-11-18.md`.

| Fundstelle | Aussage | Prüfergebnis |
|---|---|---|
| Z. 149 | „Temporäre Branches und Arbeitsverzeichnisse wurden wieder entfernt.“ | bestanden: `git branch -a --list '*tmp*'` liefert 0 Zeilen; `git worktree list` zeigt nur den Pitch- und den Entwicklungsbranch. |
| Z. 8–10 | „keine neue Nachricht“, Entwicklungsbranch „nicht in den Pitch-Branch gemergt“, enthält die Dokumente des Pitch-Branches, „kein Pull Request angelegt“ | bestanden: `git merge-base --is-ancestor` Entwicklung → Pitch: nein; Pitch → Entwicklung: ja; Merge-Commits im Entwicklungsbranch `270e045`, `6f50745`. |
| Z. 72 | Korrekturen „eingearbeitet in `1ce2db2` und `2add671`“ | bestanden: beide Commits vorhanden. |
| Z. 117 und Z. 93 | SDG-Abruf „curl über den Proxy … und ein Abruf-Agent … alle ohne Verbindung“ | bestanden: deckt sich mit `juryantworten.md` Abschnitt 3 (sechs Hosts plus zweiter Versuch). |
| Z. 239 | keine erfundene Kürzungsstelle | bestanden: „Eine Kürzungsstelle ist im Deck nicht vorgesehen“. |
| Z. 55–56 | Tabellenvorspann zu den Belegen | bestanden bis auf einen Satzfehler (siehe unten). |

**Verbliebener Fehler:** Z. 56 „ist die Ausgabe nicht gespeichert und das dort vermerkt“ (Satzfehler). **Behoben:** „…nicht
gespeichert, und das steht dort.“

**Kontrolle nach der Behebung (erneut ausgeführt):** Z. 56 lautet jetzt „…nicht gespeichert, und das steht dort.“, die alte
Formulierung hat 0 Treffer. Die übrigen Fundstellen sind unverändert. Der Bericht trägt jetzt Version 1.1 und einen Nachtrag
(Abschnitt 9) zu den Festlegungen vom 18.11.2026.

## 3. Befund 3: Prüfaussagen ohne gespeicherte Ausgabe

Der Befund: Aussagen wie „im Browser ausgelesen“, `git diff` und die getrennte Testzählung hatten keine gespeicherte Ausgabe.

| Fundstelle | Aussage | Prüfergebnis |
|---|---|---|
| `pitch/innosprint-2026/juryfragen/juryantworten.md` Z. 56, 165, 166 | Oberflächentexte zu K2, K3, K4 und BD-21 | bestanden: Alle zitierten Texte stehen in den gespeicherten Ausgaben, neun in `generalprobe/ergebnisse/abgleich-texte.txt` (zum Beispiel „Nichts fehlt.“, „2 offene Nachweise am Bauteil klären (siehe Bauteilakte)“, „Geschätzte Angaben bestätigen: Mindestprüfzeit, Annahmefenster“, „Fehlende Angaben ergänzen: …“, „Reserve im Annahmefenster 58 Tage“, „Reserve bis zur Bestellfrist 123 Tage“). der Text der Entscheidungsseite E-01 in `ergebnisse/demo-lokal.json`. |
| `juryantworten.md` Z. 9 | Postfach | bestanden: stützt sich auf `pitch/innosprint-2026/README.md` Z. 174 (bis 17.11.2026, 23:10 Uhr, keine Antwort auf neun Anfragen). |
| `docs/priorisierung-nach-dem-pitch.md` Z. 6, `docs/plan-pruefbitte-spaetestens.md` Z. 8 | `git diff --stat 2121b92 23dc050 -- plattform prototype` | bestanden: Ausgabe in `generalprobe/ergebnisse/diff-anwendungscode.txt` (nur `plattform/README.md`, 2 Zeilen). |
| `generalprobe/pruefprotokoll-2026-11-18.md` Z. 46, Z. 49, Z. 92; `generalprobe/probenanleitung.md` Z. 100, 101, 109 | Unterschied von `index.html`, Änderungen am Code, 46 + 144 Tests | bestanden: `ergebnisse/index-html-diff.txt` (nur Seitentitel und HTML-Rahmen), `ergebnisse/diff-anwendungscode.txt`, `ergebnisse/regeltests-getrennt.txt` (46 und 144, jeweils ohne Fehler). |
| Läufe auf dem Endstand | Regeltests und Browserabläufe auf `2add671` und `92391c3` | bestanden: `docs/pruefungen/cf-test-runde-2/rohausgaben/`. |
| Suche in `docs` und `pitch/innosprint-2026` nach „im Browser ausgelesen“ und „ohne gespeicherte Ausgabe“ | übrig gebliebene unbelegte Aussagen | bestanden: nur die Beschreibung des Befunds selbst im Abschlussbericht. |

**Verbliebener Fehler:** keiner. **Kontrolle:** keine Änderung nötig.

## 4. Festlegungen des Auftraggebers vom 18.11.2026 (umgesetzt, Fundstellen)

| Festlegung | Fundstelle |
|---|---|
| Im Pitch heißt es ausdrücklich „angenommene Prüfzeit“. Beispieldaten und Ersatzbilder bleiben unverändert. | `pitch/innosprint-2026/generalprobe/probenanleitung.md` §2 (Sprechregel, auch für Folie 11), `pitch/innosprint-2026/juryfragen/juryantworten.md` Z. 39–43, `docs/plan-pruefbitte-spaetestens.md` E10, `docs/pruefungen/cf-test-runde-2/README.md` V2 |
| Kontaktangaben, Speicherort, Löschfrist und Zusage zum Ergebnisblatt bleiben sichtbar offen; Unterlagen werden nicht extern verwendet. | `docs/praxistest/README.md` Z. 8–10; Platzhalter `[Kontakt des Teams eintragen]`, `[Zusage und Frist offen]`, `[Team trägt ein]` in `kurzcheck-einseiter.md` Z. 3, 33, 37; Vermerk „nicht extern verwenden“ in Einseiter, Leitfaden und Notiz |
| Entscheidungsdatei im Repository, eigene Festlegungen als Vorschläge | `docs/produktentscheidungen.md` |

## 5. Bewahrung des Pitch- und des Entwicklungsstands

Geprüft gegen die Stände vor dieser Runde (Pitch `6ea30e7`, Entwicklung `270e045`), jeweils an der Arbeitskopie mit den
Änderungen dieser Runde:

| Prüfung | Ergebnis |
|---|---|
| Pitch-Branch: `git diff --stat 6ea30e7 -- plattform prototype docs/pitch-ablauf.md pitch/innosprint-2026/ausgabe pitch/innosprint-2026/bilder pitch/innosprint-2026/generalprobe/bilder pitch/innosprint-2026/werkzeug` und neue Dateien in diesen Pfaden | leer: Plattform, Prototyp, Deck, Sprechtext, Ersatzbilder, Demo-Ablauf und Generator unverändert |
| Pitch-Branch: SHA-256 der Abgabedateien | PPTX `9d5a86e7e239229a`, PDF `bc7f651fa7b5b669`, Sprechtext `e210d241234c43b0`, unverändert |
| Pitch-Branch: `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs` | 190 von 190 bestanden |
| Entwicklungsbranch: `git diff --stat 270e045 -- plattform prototype` | leer: Anwendungscode und Tests unverändert |
| Entwicklungsbranch: derselbe Testbefehl und `node docs/pilot/cf-pilot-01-simulation.mjs` | 210 von 210 bestanden; Pilot-Skript Exitcode 0 |

Geänderte Dateien dieser Runde: nur Dokumente (Praxistest, Juryantworten, Probenanleitung und ihre Druckfassung, Plan, Abschlussbericht,
Notiz zu `cf-test` Runde 2, `docs/produktentscheidungen.md` und dieser Bericht). Die Änderungen liegen auf beiden Branches als
gleichlautende Commits, es wurde nichts gemergt.

## 6. Grenzen

Keine neue allgemeine Prüfrunde, keine Agenten. Die PDFs wurden über ihren Text geprüft, nur Einseiter und Notiz zusätzlich im
Bild angesehen. Die wörtlichen Steckbrief-Zitate und der Wortlaut des Nachtauftrags sind weiterhin nicht gegen ein Original
prüfbar. Nicht ausgeführt: PowerPoint, Beamer, Stoppuhr, Öffnen der Seite auf claude.ai. Kein Merge, kein Deployment, keine weitere
Funktion.
