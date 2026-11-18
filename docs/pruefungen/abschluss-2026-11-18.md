# Abschlussbericht · Nacht vom 17. auf den 18.11.2026

Dokumentversion 1.0 · Stand 18.11.2026 · Pitch-Branch `codex/plattform-v1`, Ausgangscommit `c5f2d23` · Entwicklungsbranch
`codex/plattform-entwicklung-20261118`, geprüfter Code-Stand `92391c3` (danach nur Dokumente) · Berichtscommit: dieser Commit

Dieser Bericht fasst den selbstständig ausgeführten Abschlussauftrag zusammen. **Eingereicht, versendet oder veröffentlicht
wurde nichts.** Es wurde kein Gespräch geführt und keine neue Nachricht versendet. Die veröffentlichte Vorschau wurde nur
gelesen, nicht verändert. Der Entwicklungsbranch ist nicht in den Pitch-Branch gemergt und nicht bereitgestellt; er enthält die
Dokumente des Pitch-Branches (Merge der Dokumente in den Entwicklungsbranch). In dieser Runde wurde kein Pull Request angelegt.

## 1. Die Abgabedateien (unverändert seit `b647ea3`)

| Datei | Prüfsumme (SHA-256, Anfang) |
|---|---|
| `pitch/innosprint-2026/ausgabe/abgabe-5-minuten/CircularFlow_INNOSPRINT2026_Pitch-5-Minuten.pdf` (zum Einreichen, 15 Seiten) | `bc7f651fa7b5b669` |
| `pitch/innosprint-2026/ausgabe/abgabe-5-minuten/CircularFlow_INNOSPRINT2026_Pitch-5-Minuten.pptx` (zum Vortragen) | `9d5a86e7e239229a` |
| `pitch/innosprint-2026/ausgabe/sprechtexte/CircularFlow_INNOSPRINT2026_Pitch-5-Minuten_Sprechtext.pdf` (zum Ausdrucken, 16 Seiten) | `e210d241234c43b0` |

Das Deck wurde in dieser Runde **nicht verändert** (433 Wörter, Feyrouz 244, Houssam 189, gerechnet 4:19, nicht gestoppt).
Prüfsummen, Wortzahl, Sprecheranteile, Zeitfenster, fünf Links und die ausgeblendeten Folien wurden gegen die README
nachgerechnet: 23 von 23 Prüfungen bestanden (Abschnitt 4).

## 2. Umgang mit dem ChatGPT-Bericht

Bericht: Branch `codex/chatgpt-nachtpruefung-20261117`, Commit `1871b323c62487ab406a34a808a5af69a5fb5a8c`, Datei
`docs/pruefungen/chatgpt-nachtpruefung-2026-11-17.md`. Der Branch wurde nur als Remote-Referenz geholt. Er hängt an `e21ccc9`
und enthält genau diese eine Datei. Es wurde nichts überschrieben und nichts in diesen Branch geschrieben. Der Bericht wurde
als Eingabe gewertet, nicht als Anweisung, und gegen die Dateien geprüft.

| Punkt im Bericht | Bewertung | Ergebnis |
|---|---|---|
| Aufgabe 1: README, Wortzahlen, Sprecheranteile, Zeiten, Hashes und Commitbezug synchronisieren | Die README war auf `e21ccc9` noch auf 461 Wörtern. Der Bericht nennt das selbst einen „offenen Abschluss“. | Seit `da85183` (README 2.3) aktuell. Mit einem Skript gegen die tatsächlichen Dateien nachgerechnet: 23 von 23. Die Zeit ist als „gerechnet, nicht gestoppt“ bezeichnet. |
| Aufgabe 2: Demo im frischen Kontext absichern, Screenshots, Online-Artefakt nur als geprüft melden, wenn geöffnet | berechtigt | 28 von 28 Prüfungen, lokal und an einer lokal geöffneten Kopie der veröffentlichten Auslieferung. **Die Seite auf claude.ai wurde nicht im Browser geöffnet** und ist als nicht geprüft gekennzeichnet. Vier Ersatzbilder gesichert. |
| Aufgabe 3: Juryantworten mit Belegstatus, Einseiter, 15-Minuten-Skript | berechtigt | `pitch/innosprint-2026/juryfragen/juryantworten.md`, `docs/praxistest/`. Kein Praxisgespräch als erledigt gemeldet. |
| „Eine 7-Tage-Anzeige vor Bestellfrist genügt nicht, wenn die Prüfzeit länger ist.“ Zwei Lücken: letzte sinnvolle Anfrage, offene Restmenge | stimmt mit dem eigenen Befund überein (Folie 14, Produktideen B2) | Die Frist „Prüfbitte spätestens“ ist auf dem Entwicklungsbranch umgesetzt (Abschnitt 7). Die Restmenge bleibt als Plan zurückgestellt. |
| „Vor dem Pitch keine neue 3D-, Scanner-, Radar-, Benachrichtigungs- oder Backendentwicklung.“ | berechtigt | eingehalten. Plattformarbeit nur auf dem getrennten Branch, Pitch-Stand und Demo unverändert. |
| „Concular nicht als reinen Marktplatz ohne Zeitkoordination darstellen; Originalfolien erneut heranziehen.“ | berechtigt | Antwort 5 sagt ausdrücklich, was **nicht** gesagt werden soll. Die Concular-Angabe zur Universitätsbibliothek ist als Herstellerangabe gekennzeichnet. |
| Höchstens zwei Prüf- und Korrekturrunden, keine Käufe, Veröffentlichungen, Zusagen | berechtigt | eingehalten, siehe Abschnitt 4 |
| Lokaler Chromium-Start im Bericht gescheitert | betrifft deren Umgebung | In dieser Umgebung läuft Chromium. Die Ergebnisse stehen im Prüfprotokoll. |

## 3. Was neu im Repository liegt

| Ort | Inhalt | Branch |
|---|---|---|
| `pitch/innosprint-2026/generalprobe/` | Probenanleitung 1.1 (Sprecherwechsel, Zeitkontrollen, Demoausfall; Druckfassung `probenanleitung-druck.pdf`), Prüfprotokoll 1.1, vier Ersatzbilder (`bilder/`), Prüfskripte (`pruefskripte/`), gespeicherte Ausgaben (`ergebnisse/`) | `codex/plattform-v1` |
| `pitch/innosprint-2026/juryfragen/juryantworten.md` | zehn sprechbare Antworten mit Status (belegt, gezeigt, Hypothese), Hypothesen H1 bis H10 mit Prüfschritten, Quellenprüfung | `codex/plattform-v1` |
| `docs/praxistest/` | Kurzcheck-Einseiter (eine Seite, PDF), 15-Minuten-Gesprächsleitfaden, Gesprächsnotiz-Vorlage (PDFs jeweils neben den Markdown-Dateien), README mit den offenen Entscheidungen des Teams | `codex/plattform-v1` |
| `docs/priorisierung-nach-dem-pitch.md`, `docs/plan-pruefbitte-spaetestens.md` | Abgleich der Pläne, höchstens drei Verbesserungen, Plan mit Abnahmekriterien vor der Umsetzung | `codex/plattform-v1` |
| `docs/pruefungen/` | dieser Bericht, Prüfläufe `cf-test` Runde 1 und 2 (Zusammenfassung, Rohausgaben, Werkzeuge) | beide |
| `plattform/`, `docs/pilot/cf-pilot-01-simulation.mjs` | Frist „Prüfbitte spätestens“, 20 neue Tests, Startanleitung in `plattform/README.md` | `codex/plattform-entwicklung-20261118` |

## 4. Ausgeführte Prüfungen und Ergebnisse

Die Prüfungen in dieser Tabelle wurden in dieser Sitzung ausgeführt. Die Spalte „Beleg“ nennt die gespeicherte Ausgabe im
Repository. Wo keine Datei steht, ist die Ausgabe nicht gespeichert und das dort vermerkt.

| Prüfung | Befehl oder Weg | Ergebnis | Codestand | Beleg |
|---|---|---|---|---|
| Pitch-Dateien gegen README | `python3 -I pitch/innosprint-2026/generalprobe/pruefskripte/abgleich-pitchdateien.py <Repository> <Ausgabe.json>` | 23 von 23 bestanden (von mir und von `cf-test` ausgeführt) | Pitch-Dateien unverändert seit `b647ea3` | `generalprobe/ergebnisse/abgleich-pitchdateien.json` |
| Demo im frischen Browserkontext, lokaler Stand | `node …/pruefskripte/demo-pruefung.js <Adresse> <Ordner> <Name>`, Chromium über Playwright | 28 von 28, keine Konsolen- und Netzfehler (von mir und von `cf-test`) | `plattform/`, Code `2121b92` | `ergebnisse/demo-lokal.json` |
| Dieselbe Demo an der lokal geöffneten Kopie der veröffentlichten Auslieferung (Version `1794826502-00b9`, 35 Dateien nur lesend heruntergeladen) | wie oben | 28 von 28 (von mir und von `cf-test`) | veröffentlichte Dateien | `ergebnisse/demo-veroeffentlicht.json` |
| Download gegen `plattform/` und gegen Nachbau (`bauen-artifact.mjs`) | `…/pruefskripte/dateivergleich.py` | 31 von 35 gegen `plattform/` (Bauschritt der Veröffentlichung), 34 von 35 gegen den Nachbau (nur Seitentitel und HTML-Rahmen von `index.html`) | siehe oben | `ergebnisse/dateivergleich.txt` (SHA-256 aller 35 Dateien) |
| Ersatzbilder gegen frische Aufnahme | `…/pruefskripte/bildvergleich.py` | gleiche Größe, 0,03 bis 0,21 % der Pixel weichen ab, mittlerer Unterschied unter 0,7 von 255 | `bilder/k1` bis `k4` | `ergebnisse/bildvergleich.txt` |
| Regeltests, Pitch-Stand | `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs` | 190 von 190 (46 + 144), 0 Fehler (von mir und von `cf-test`) | `23dc050`, `plattform/` und `prototype/` unverändert | `ergebnisse/regeltests.txt` |
| Regeltests, Entwicklungsstand (`cf-test`, Runde 1) | derselbe Befehl | 210 von 210 (20 neue Tests), neue Testdatei allein 20 von 20 | `dca307f` | `cf-test-runde-1/rohausgaben/B1-*` |
| Regeltests, Pilot-Nachrechnung und Browserabläufe, Endstände (`cf-test`, Runde 2; von mir zusätzlich auf dem Entwicklungsstand) | dieselben Befehle und Skripte wie in Runde 1 | Pitch `2add671`: 190 von 190, 23 von 23, Demo 28 von 28. Entwicklung `92391c3`: 210 von 210, 20 von 20, Pilot-Skript Exitcode 0 mit „(geschätzt)“, BA-1 bis BA-5 61 Prüfungen ohne Abweichung, Zusatzabläufe, Pitch-Demo 28 von 28 mit 7 byte-gleichen Bildern, 1280 × 720 13 von 13, Stichproben und Mutationsprobe gleich wie in Runde 1 | `2add671`, `92391c3` | `cf-test-runde-2/rohausgaben/` |
| Mutationsprobe der neuen Tests (`cf-test`) | Kopien außerhalb des Repositorys, `mutationen.py` | 12 Mutationen der Regel und der Anzeige, alle von den neuen Tests erkannt | `dca307f` | `cf-test-runde-1/rohausgaben/B1-mutationsprobe.txt` |
| Browserabläufe BA-1 bis BA-5 aus dem Plan (`cf-test`) | `ba-1-bis-5.js`, je Ablauf ein frischer Kontext | 61 Prüfungen, 0 Abweichungen; drei Zusatzabläufe (Fristtag, Bedarf ergänzen, ohne Annahmefenster) 16, 8 und 5 Prüfungen bestanden; 390 × 844 und 1280 × 720 ohne seitliches Scrollen | `dca307f` | `cf-test-runde-1/rohausgaben/B2-*`, `B4-*` |
| Pitch-Demo auf dem Entwicklungsstand (`cf-test`) | `demo-pruefung.js` | 28 von 28, alle 7 Bildschirmfotos byte-gleich zum Pitch-Stand | `dca307f` | `cf-test-runde-1/rohausgaben/B3-*` |
| Eigene Stichproben der Regel (`cf-test`) | Handrechnung gegen `pruefbitteFrist` und Abgleich, vier Zeitzonen | je 57 Prüfungen, 0 Fehler, in allen Zeitzonen gleich | `dca307f` | `cf-test-runde-1/rohausgaben/B6-*` |
| Unabhängige Prüfung der Unterlagen (`cf-review`, Runde 1) | lesend gegen Quellen, Oberfläche und Dateien | Befunde zu Uhrzeiten, Belegen, Überzeichnungen und Einverständnis, eingearbeitet in `1ce2db2` und `2add671` (Nachbesserungen aus Runde 2: Abschnitt 4.1) | Pitch-Branch | Rückgabe des Agenten, nicht als Datei gespeichert |
| Code-Review des Entwicklungsstands (`cf-review`) | lesend gegen den Plan | kein wesentlicher Befund, sechs Hinweise (Abschnitt 7.5) | `dca307f` | Rückgabe des Agenten, nicht als Datei gespeichert; Umgang mit den Hinweisen in Abschnitt 7.5 |
| Unabhängige Prüfung der Unterlagen und der Nacharbeiten (`cf-review`, Runde 2) | lesend gegen Quellen, gespeicherte Ausgaben und das Diff `dca307f` zu `92391c3` | drei wesentliche Befunde und Nebenbefunde, alle belegten eingearbeitet (Abschnitt 4.1) | Pitch `2add671`, Entwicklung `92391c3` | Abschnitt 4.1 |
| Auslesung der Oberflächentexte (K2, K3, K4, BD-21) | `node …/pruefskripte/abgleich-texte.js` | Exitcode 0; Texte stehen in der Ausgabe | `plattform/` Code `2121b92` | `generalprobe/ergebnisse/abgleich-texte.txt` |
| Änderungen am Anwendungscode seit dem Pitch-Stand | `git diff --stat 2121b92 23dc050 -- plattform prototype` | nur `plattform/README.md`, 2 Zeilen | `23dc050` | `generalprobe/ergebnisse/diff-anwendungscode.txt` |
| Zählung der Regeltests getrennt | zwei Aufrufe von `node --test` | 46 von 46 (Prototyp), 144 von 144 (Plattform) | `75fd769` | `generalprobe/ergebnisse/regeltests-getrennt.txt` |
| Unterschied von `index.html` (Download gegen Nachbau) | `diff -u` | nur Seitentitel und HTML-Rahmen | siehe oben | `generalprobe/ergebnisse/index-html-diff.txt` |

### 4.1 Zweite Prüfrunde

**`cf-test` (Wiederholung auf den Endständen `2add671` und `92391c3`):** Alle Läufe aus Runde 1 wurden wiederholt und bestanden,
kein blockierender Befund (`docs/pruefungen/cf-test-runde-2/`). Die Ausgaben sind gegenüber Runde 1 gleich, mit einer erwarteten
Ausnahme: Das Pilot-Skript nennt jetzt „(geschätzt)“ und zeigt einen vierten Prüfpunkt. Die Anwendungslogik ist gegenüber dem in
Runde 1 geprüften Commit `dca307f` unverändert (nur ein Kommentar, zwei Testfilter, README). Befunde: V1 toter Verweis auf diesen
Bericht im Entwicklungsstand (behoben durch den Merge), V2 „belegt“ bei BD-23 (offen für das Team), H1 Fallakte nachgeführt.

**`cf-review` (Unterlagen, Entwurf dieses Berichts, Nacharbeiten):** Drei wesentliche Befunde, alle belegt und behoben:

| Befund | Behebung |
|---|---|
| Praxistest: Die Verwendung der Angaben wurde zu Beginn als gegeben angekündigt, am Ende aber erst erfragt. Bei „nein“ zu den Notizen widersprachen sich „Datum, Rolle“ und „nichts weiter eintragen“. | Einstieg, Einseiter und README sagen gleichlautend: Nutzung zur Prüfung der Idee; ob die Angaben ohne Namen für Vorträge und Folien verwendet werden dürfen, wird am Ende erfragt. Bei „nein“ nur Datum und Rolle, die Einverständniszeile steht jetzt zuerst. Ausgefüllte Notizen nicht im Git-Repository. Eingabespalten der Notiz verbreitert. |
| Dieser Bericht: Sätze, die nicht stimmten oder nicht belegt waren (Branches „entfernt“, „keine Pull Requests“, „alle eingearbeitet“, „zwei Wege“ beim SDG-Abruf, Kürzungsstelle bei Zeitdruck). | Berichtigt in dieser Fassung; die temporären Branches und Arbeitsverzeichnisse sind vor diesem Commit entfernt worden. |
| Prüfaussagen ohne gespeicherte Ausgabe („im Browser ausgelesen“, `git diff`, getrennte Testzählung, Unterschied von `index.html`, Lauf auf dem Endstand). | Skript und Ausgabe bzw. Ausgaben gespeichert (Abschnitt 4, unterste vier Zeilen); die Läufe auf dem Endstand stehen in `cf-test-runde-2/`. Die Postfach-Aussage wurde auf die dokumentierte Prüfung der Pitch-README zurückgeführt. |

Nebenbefunde, ebenfalls umgesetzt: Antwort 2 (fehlende Angaben zeigt K2, nicht K3 und K4), Antwort 1 (Herstellerangabe), Antwort 3
und 9 (Folieninhalt ist nicht „gezeigt“), Antwort 6 (Wortlaut nach der Concular-Seite), Antwort 9 gekürzt, SDG ohne erfundenes Zitat,
Madaster-Zitat und Seitenangabe der Concular-Handlungsempfehlung (PDF-Seite 3, gedruckte Seite 5), Pfade im Leitfaden, Platzhalter,
„Teil B“ in der Priorisierung, Ausgangscommit, Liste der Nachführung, Fallakte §1 im Entwicklungsstand, Hinweis zu den Beispieldaten
von BD-23 in der Probenanleitung und in Antwort 1, Druckfassung der Probenanleitung, „vermutlich JPEG-Rauschen“, Spätfall-Zeiten als
Annahme gekennzeichnet. **Nicht umgesetzt** (kein belegter Fehler): Der Name „Claude Code“ in den Unterlagen bleibt, ob Werkzeugnamen
in den Unterlagen stehen, entscheidet das Team. Die wörtlichen Steckbrief-Zitate und der Wortlaut des Nachtauftrags waren für den
Reviewer nicht prüfbar.

Die Korrekturen der zweiten Runde wurden von mir durchgesehen, aber nicht von `cf-review` erneut geprüft (höchstens zwei Runden).

## 5. Nicht ausgeführt und Unsicherheiten

- **PowerPoint und Keynote:** nicht geöffnet. Notizen, Arial-Zeilenumbrüche (hier wurde mit Liberation Sans gerendert),
  Links im Vortragsmodus und Foliennummer + Enter sind **nicht** geprobt.
- **Beamer, Presenter, Alt+Tab, Netz am Ort:** nicht geprüft.
- **Die Seite auf claude.ai** wurde nicht im Browser geöffnet. Geprüft ist nur der heruntergeladene Stand. Freigabe und
  Sichtbarkeit der Vorschau sind nicht geprüft.
- **Alle Zeiten sind gerechnet, keine ist gestoppt** (4:19 ruhig, etwa 3:25 zügig, 64 s Demo, 4:27 im Spätfall).
- **SDG 12.5:** Der Wortlaut des Unterziels konnte nicht an der Primärquelle gelesen werden. Die Hosts der Vereinten Nationen
  und weitere Quellen waren aus der Arbeitsumgebung nicht erreichbar (curl über den Proxy für mehrere Adressen und ein
  Abruf-Agent für zwei Adressen, alle ohne Verbindung; Einzelheiten in `juryantworten.md`, Abschnitt 3). Antwort 7 benennt das.
- **Beispieldaten BD-23:** Die Oberfläche kennzeichnet die 14 Tage Prüfzeit bei BD-23 nicht als „geschätzt“ (`daten.js` Z. 164
  „belegt“), obwohl sie eine Beispielannahme ist. Im Vortrag „angenommene Prüfzeit“ sagen (so steht es im K3-Satz). Daten nicht
  geändert, siehe Plan E10 und Probenanleitung, Abschnitt 2.
- **Concular und Madaster:** Aussagen stammen aus Herstellerseiten und Folien. Ob und wie viele Bauteile in der
  Universitätsbibliothek wieder eingebaut wurden, ist nicht belegt. Die Pressemeldung des BLB NRW nennt Concular nicht.
- **Praxis:** Es gibt kein Gespräch, keine Praxisbestätigung, keinen Partner und keine bestätigte Prüfzeit. Die 14 Tage
  bleiben eine Simulationsannahme. Die Hypothesen H1 bis H10 sind unbestätigt, die Entscheidungsregeln ein Vorschlag.
- **Entwicklungsstand:** nur in Chromium unter Linux geprüft, nicht am Beamer, nicht in anderen Browsern oder Sprachen,
  Touch und Bildschirmleser nicht geprüft. Neuladen der Seite mit gespeichertem Bedarf nicht geprüft.

## 6. Annahmen und Entscheidungen (alle umkehrbar, das Team bestätigt)

1. **Reihenfolge:** Der Auftrag, die kleinste sinnvolle Verbesserung umzusetzen, beantwortet die offene Frage 1. „Prüfbitte
   spätestens“ (klein, vier App-Dateien) wurde vor der Restmenge umgesetzt. Datierte Nachträge stehen in Fallakte §11 und
   Plan Restmenge §1.
2. **E1 bis E10** im Plan (`docs/plan-pruefbitte-spaetestens.md`, Abschnitte 8 und 9), darunter: die Formel nutzt das Ende
   des Annahmefensters, **nach dem Fristtag nie „überfällig“** (E2, Produktentscheidung zur Eintragung durch das Team in
   `00_START_HIER/ENTSCHEIDUNGEN.md`, nicht in diesem Repository), die Beispieldaten von BD-23 bleiben unverändert, obwohl
   sie dort als „belegt“ stehen (E10).
3. **Erster Nutzer** (Projektleitung im Planungsbüro), **möglicher Käufer** und **erstes bezahlbares Angebot** (Kurzcheck) sind
   in den Juryantworten ausdrücklich als Hypothese gekennzeichnet und nicht als Befund.
4. **Praxistest:** drei Gespräche, Entscheidungsregeln „Weiter“ und „Überdenken“, Einverständnis zu Beginn (Notizen) und am
   Ende (vier Fragen), keine Aufnahme, kein Preis, keine Zusage. Offen für das Team: Kontakt im Einseiter, Speicherort und
   Löschfrist der Notizen, ob ein Ergebnisblatt zugesagt wird (`docs/praxistest/README.md`).
5. **Technik-Check am 20.11. ab 13:30 Uhr** stammt aus der Veranstalterunterlage (Tag 5, S. 3/4), so im Plan zitiert. Die
   Uhrzeit bitte beim Veranstalter bestätigen.
6. **Uhrzeiten der Ausführung** stehen nirgends in den Unterlagen. Maßgeblich sind die Commits.
7. **Freigabe der Plattform-Änderung:** Der Produktbrief v0.2 nennt die Frist „Prüfbitte spätestens“ nicht. Die Freigabe
   steht nur im Plan §9 und in `docs/priorisierung-nach-dem-pitch.md` §5 (Nachtauftrag). Das Team bestätigt sie und entscheidet
   über Merge und Vorschau.
8. **Werkzeuge:** vier Agenten (`cf-planung`, `cf-entwicklung`, `cf-review`, `cf-test`) mit getrennten Aufgaben, kein
   Review-Gate, keine neuen Plugins, keine Käufe. Temporäre Branches und Arbeitsverzeichnisse wurden wieder entfernt.

## 7. Plattform: Entwicklungsstand „Prüfbitte spätestens“

### 7.1 Gewählt und warum

Aus den Plänen zu Restmenge und „Prüfbitte spätestens“ wurde die kleinere Verbesserung gewählt: vier App-Dateien, keine
Datenänderung, geringes Risiko für die Demo (`docs/priorisierung-nach-dem-pitch.md`). Die Restmenge (neun Dateien, sechs
offene Fragen F1 bis F6) bleibt zurückgestellt.

### 7.2 Nutzerproblem, Verhalten, Ausschluss (Kurzfassung des Plans)

- **Nutzerproblem:** Mit 14 Tagen Mindestprüfzeit ist der 05.02.2027 der letzte Tag für die Prüfbitte zur Bestellfrist
  19.02.2027. Die Vorschau nannte diesen Tag nirgends, „Zeitkritisch“ zeigte die Bestellfrist erst ab 13.02. Bei jeder
  Prüfzeit über 7 Tage kommt der Hinweis zu spät.
- **Verhalten:** Unter „Zeitkritisch (7 Tage)“ steht für jeden Bedarf mit mindestens einem prüfbaren Paar und ohne laufenden
  Vorgang „Prüfbitte spätestens“ mit Tag und Rechnung, bei geschätzter Angabe mit „geschätzt“. Die Bedarfsseite nennt Tag
  und Rechnung. Die Frist ist der frühere Tag aus Bestellfrist und Ende des Annahmefensters minus Mindestprüfzeit, in
  Kalendertagen. Nach dem Fristtag gibt es keinen Eintrag und nie „überfällig“ (E2).
- **Ausgeschlossen:** Versand und Erinnerung, Änderung der Abgleichregel, neue Eingabefelder, Änderung der Beispieldaten,
  Zeile auf der Abgleichseite, Wochenendregel, Restmenge, Preise, CO₂ und Einsparungen.
- **Umfang:** sieben Dateien, 454 Einfügungen, 14 Löschungen gegenüber `23dc050` (`abgleich.js`, `kennzahlen.js`,
  `ansichten/uebersicht.js`, `ansichten/bedarfe.js`, neue Testdatei, Pilot-Skript, README). Danach kamen Nacharbeiten
  ohne Änderung der Logik hinzu (Abschnitt 7.5).

### 7.3 Startanleitung

Der Pitch-Stand bleibt auf `codex/plattform-v1`. Für den Entwicklungsstand ein eigenes Arbeitsverzeichnis anlegen, damit der
Pitch-Stand unberührt bleibt:

```bash
git fetch origin
git worktree add -b codex/plattform-entwicklung-20261118 ../CircularFlow-entwicklung origin/codex/plattform-entwicklung-20261118
cd ../CircularFlow-entwicklung
python3 -m http.server 8000
```

Dann `http://localhost:8000/plattform/` öffnen (Windows meist `py -m http.server 8000`). Die Tests:

```bash
node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs
```

Die neue Anzeige zeigt der Klickpfad in `plattform/README.md` (Abschnitt „Entwicklungsstand: Prüfbitte spätestens“): einen
Bedarf „Fristtest“ erfassen, dann unter „Übersicht“ den fünften Eintrag unter „Zeitkritisch“ ansehen. Danach „Erfassen“ →
„In diesem Browser gespeichert“ → „Zurücksetzen“.

### 7.4 Abnahme

Verhalten, Ausschluss und Abnahmekriterien (PS-1 bis PS-12, Tests T1 bis T10, Browserabläufe BA-1 bis BA-5) standen vor der
Umsetzung im Plan (`docs/plan-pruefbitte-spaetestens.md`, Commit `23dc050`). Die Prüfergebnisse stehen in Abschnitt 4.
Von der Pitch-Demo ist nichts verändert: Startbedingung (8 Paare, davon 2 prüfbar, 2 Vorgänge, 4 Fristen) und alle sieben
Bildschirmfotos sind auf dem Entwicklungsstand byte-gleich zum Pitch-Stand.

### 7.5 Hinweise der Prüfungen und Folgeaufgaben

| Hinweis | Umgang |
|---|---|
| `cf-review` 1 und `cf-test` K3: Bei einem rechtzeitig angelegten Vorgang zeigt die Bedarfsseite nach dem Fristtag trotzdem den roten Chip „verstrichen“, und der bedingte Satz „…solange … kein Vorgang läuft“ bleibt stehen. Plankonform (PS-7), kann aber als „verpasst“ gelesen werden. | **Folgeaufgabe F-1** (unten), nicht umgesetzt, um keine weitere Funktion ohne Abnahme zu beginnen. |
| `cf-review` 2: Zwei ältere Testfilter wurden unschärfer, weil sie nur nach `art === 'bedarf'` filtern. | umgesetzt: Filter nennen die Bestellfrist ausdrücklich (`995cfc1`) |
| `cf-review` 3: Im Pilot-Skript fehlte „geschätzt“ für die Prüfzeit (Plan, Frage 5; Fallakte A5). | umgesetzt (`995cfc1`), Fallakte Schritt 6 nachgeführt |
| `cf-review` 4: „7 Tagen“ steht fest im Text der Bedarfsseite, das Fenster ist `kritischTage`. | Kommentar im Code ergänzt (`995cfc1`), heute gleich |
| `cf-review` 5: README ohne die neue Testdatei, alter Stand, Datumsfelder je nach Browsersprache. | umgesetzt (`995cfc1`) |
| `cf-review` 6: Der Demo-Schritt „Bedarf ergänzen“ kann auf dem Entwicklungsstand einen fünften Eintrag erzeugen. | bekannt (Plan §7), betrifft nur den Entwicklungsbranch |
| `cf-test` K1: Ohne Annahmefenster meldet der Abgleich am Fristtag „Angaben fehlen“, die Bedarfsseite nennt den Tag trotzdem. | Wortlaut „bei vollständigen Zeitangaben“ in README und Plan (`154dfc2`, `2add671`) |
| `cf-test` K2: Die Freigabe steht nur im Plan §9, der Eintrag in `00_START_HIER/ENTSCHEIDUNGEN.md` steht aus. | offen für das Team (Abschnitt 6, Nr. 7) |
| `cf-test` K4, K5, K6: Restzeit „noch 14 Std. 59 Min.“, kurze Verdeckung durch die Meldung bei 390 px, Testdatei länger als geschätzt. | bestehendes Verhalten beziehungsweise ohne Wirkung, keine Änderung |

**Folgeaufgaben (Vorschläge, nicht freigegeben):**

- **F-1 Bedarfsseite bei rechtzeitig angelegtem Vorgang.** Nutzerproblem: Die Planung liest „verstrichen“ als verpasst, obwohl
  die Prüfbitte rechtzeitig angelegt wurde. Abnahme: Bei einem Bedarf mit angelegtem oder laufendem Vorgang zeigt die Zeile nach
  dem Fristtag weder den roten Chip „verstrichen“ noch den bedingten Satz, sondern „Vorgang läuft“; für einen Bedarf ohne
  Vorgang bleibt alles wie heute (BD-23 „verstrichen“); neuer Test in `pruefbittefrist.test.mjs`, Pitch-Demo unverändert.
- **F-2 Restmenge** (Plan Restmenge 1.1, offene Fragen F1 bis F6): ändert denselben Block „Zeitkritisch“.
- **F-3 Herkunft der Prüfzeit** erst nach dem Praxisgespräch (Idee N2).

## 8. Höchstens drei Aufgaben für die morgendliche Generalprobe (Wortlaut des Auftrags)

Die Zuständigkeiten und Fristen sind Vorschläge, das Team bestätigt sie.

1. **Technik und Demo am Vortragsrechner.** Vorschlag: Houssam, zu Beginn der Generalprobe (etwa 15 Minuten). In PowerPoint
   (nicht in LibreOffice) öffnen: Referentenansicht mit Notizen, Zeilenumbrüche mit Arial auf den Folien 1, 4, 8 und 9, Links
   4 → 5 → 6 → 7 und 4 → 6 → 7, Foliennummer + Enter, Alt+Tab (Mac: Cmd+Tab) zum Browser im Vollbild, Online-Vorschau öffnen
   oder die lokale Variante starten. Abschlusskriterium: Die Punkte „PowerPoint am Vortragsrechner“, „Links im
   Vortragsmodus“, „Umschalten“ und „Vorschau am Veranstaltungsort“ in `pitch/innosprint-2026/generalprobe/probenanleitung.md`,
   Abschnitt 5, sind abgehakt, Abweichungen stehen in der Datei. Zum Mitnehmen: `probenanleitung-druck.pdf`.
2. **Zeitprobe mit Stoppuhr.** Vorschlag: Feyrouz führt die Uhr, Houssam bedient die Demo. Ganzer Vortrag zweimal im ruhigen
   Tempo mit allen Übergaben, Demo allein dreimal, einmal der Spätfall mit Ausfall um 2:10. Abschlusskriterium: Die
   gemessenen Zeiten stehen in Abschnitt 1 der Probenanleitung neben den gerechneten, beide Gesamtläufe liegen unter 5:00.
   Sonst ist zu kürzen. Eine Kürzungsstelle ist im Deck nicht vorgesehen (die Zeilen „Bei Zeitdruck“ der Notizen regeln nur den
   Rückfall auf die Bildschirmfotos), das Team legt sie fest.
3. **Jurysätze laut sprechen und Entscheidungen festhalten.** Vorschlag: beide, danach spätestens vor dem Technik-Check am
   20.11. Die zehn Antworten aus `pitch/innosprint-2026/juryfragen/juryantworten.md` laut lesen (jede unter 30 Sekunden),
   „Das wissen wir noch nicht“ dort stehen lassen, wo die Hypothese steht, und den Wortlaut von SDG 12.5 an der Quelle der
   Vereinten Nationen nachlesen (von hier nicht erreichbar). Dazu die offenen Entscheidungen für den Praxistest: Kontakt im Einseiter,
   Speicherort und Löschfrist der Notizen, Zusage eines Ergebnisblatts (`docs/praxistest/README.md`), ob BD-23 vor dem Pitch auf
   „geschätzt“ gestellt wird (dann Ersatzbilder neu aufnehmen) oder „angenommene Prüfzeit“ im Vortrag genügt, und die
   Produktentscheidungen (unter anderem E2) in `00_START_HIER/ENTSCHEIDUNGEN.md` eintragen. Abschlusskriterium: jede Antwort
   ohne Ablesen unter 30 Sekunden, die drei Entscheidungen stehen schriftlich im Team-Protokoll.
