# Abschlussbericht · Nacht vom 17. auf den 18.11.2026

Dokumentversion 1.0 · Stand 18.11.2026 · Pitch-Branch `codex/plattform-v1`, Ausgangscommit `2add671` · Entwicklungsbranch
`codex/plattform-entwicklung-20261118`, Stand `92391c3` · Berichtscommit: dieser Commit

Dieser Bericht fasst den selbstständig ausgeführten Abschlussauftrag zusammen. **Eingereicht, versendet oder veröffentlicht
wurde nichts.** Es wurde kein Gespräch geführt und niemand angeschrieben. Die veröffentlichte Vorschau wurde nur gelesen,
nicht verändert. Der Entwicklungsbranch ist nicht gemergt und nicht bereitgestellt. Es gibt keine Pull Requests.

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
| `pitch/innosprint-2026/generalprobe/` | Probenanleitung 1.1 (Sprecherwechsel, Zeitkontrollen, Demoausfall), Prüfprotokoll 1.1, vier Ersatzbilder (`bilder/`), Prüfskripte (`pruefskripte/`), gespeicherte Ausgaben (`ergebnisse/`) | `codex/plattform-v1` |
| `pitch/innosprint-2026/juryfragen/juryantworten.md` | zehn sprechbare Antworten mit Status (belegt, gezeigt, Hypothese), Hypothesen H1 bis H10 mit Prüfschritten, Quellenprüfung | `codex/plattform-v1` |
| `docs/praxistest/` | Kurzcheck-Einseiter (eine Seite, PDF), 15-Minuten-Gesprächsleitfaden, Gesprächsnotiz-Vorlage, README mit Entscheidungen des Teams | `codex/plattform-v1` |
| `docs/priorisierung-nach-dem-pitch.md`, `docs/plan-pruefbitte-spaetestens.md` | Abgleich der Pläne, höchstens drei Verbesserungen, Plan mit Abnahmekriterien vor der Umsetzung | `codex/plattform-v1` |
| `docs/pruefungen/` | dieser Bericht, Prüflauf `cf-test` Runde 1 (Zusammenfassung, Rohausgaben, Werkzeuge) | beide |
| `plattform/`, `docs/pilot/cf-pilot-01-simulation.mjs` | Frist „Prüfbitte spätestens“, 20 neue Tests, Startanleitung in `plattform/README.md` | `codex/plattform-entwicklung-20261118` |

## 4. Ausgeführte Prüfungen und Ergebnisse

Alles in dieser Tabelle wurde in dieser Sitzung ausgeführt. Die Ausgaben stehen, wo angegeben, im Repository.

| Prüfung | Befehl oder Weg | Ergebnis | Codestand | Beleg |
|---|---|---|---|---|
| Pitch-Dateien gegen README | `python3 -I pitch/innosprint-2026/generalprobe/pruefskripte/abgleich-pitchdateien.py <Repository> <Ausgabe.json>` | 23 von 23 bestanden (von mir und von `cf-test` ausgeführt) | Pitch-Dateien unverändert seit `b647ea3` | `generalprobe/ergebnisse/abgleich-pitchdateien.json` |
| Demo im frischen Browserkontext, lokaler Stand | `node …/pruefskripte/demo-pruefung.js <Adresse> <Ordner> <Name>`, Chromium über Playwright | 28 von 28, keine Konsolen- und Netzfehler (von mir und von `cf-test`) | `plattform/`, Code `2121b92` | `ergebnisse/demo-lokal.json` |
| Dieselbe Demo an der lokal geöffneten Kopie der veröffentlichten Auslieferung (Version `1794826502-00b9`, 35 Dateien nur lesend heruntergeladen) | wie oben | 28 von 28 (von mir und von `cf-test`) | veröffentlichte Dateien | `ergebnisse/demo-veroeffentlicht.json` |
| Download gegen `plattform/` und gegen Nachbau (`bauen-artifact.mjs`) | `…/pruefskripte/dateivergleich.py` | 31 von 35 gegen `plattform/` (Bauschritt der Veröffentlichung), 34 von 35 gegen den Nachbau (nur Seitentitel und HTML-Rahmen von `index.html`) | siehe oben | `ergebnisse/dateivergleich.txt` (SHA-256 aller 35 Dateien) |
| Ersatzbilder gegen frische Aufnahme | `…/pruefskripte/bildvergleich.py` | gleiche Größe, 0,03 bis 0,21 % der Pixel weichen ab, mittlerer Unterschied unter 0,7 von 255 | `bilder/k1` bis `k4` | `ergebnisse/bildvergleich.txt` |
| Regeltests, Pitch-Stand | `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs` | 190 von 190 (46 + 144), 0 Fehler (von mir und von `cf-test`) | `23dc050`, `plattform/` und `prototype/` unverändert | `ergebnisse/regeltests.txt` |
| Regeltests, Entwicklungsstand (`cf-test`, Runde 1) | derselbe Befehl | 210 von 210 (20 neue Tests), neue Testdatei allein 20 von 20 | `dca307f` | `cf-test-runde-1/rohausgaben/B1-*` |
| Regeltests und Pilot-Nachrechnung, Endstand (von mir) | derselbe Befehl, `node docs/pilot/cf-pilot-01-simulation.mjs` | 210 von 210; Pilot-Skript Exitcode 0 („Prüfbitte spätestens“ BD-24 am 05.02.2027, erstmals sichtbar am 30.01.2027) | `92391c3` | nicht gespeichert, siehe Runde 2 |
| Mutationsprobe der neuen Tests (`cf-test`) | Kopien außerhalb des Repositorys, `mutationen.py` | 12 Mutationen der Regel und der Anzeige, alle von den neuen Tests erkannt | `dca307f` | `cf-test-runde-1/rohausgaben/B1-mutationsprobe.txt` |
| Browserabläufe BA-1 bis BA-5 aus dem Plan (`cf-test`) | `ba-1-bis-5.js`, je Ablauf ein frischer Kontext | 61 Prüfungen, 0 Abweichungen; drei Zusatzabläufe (Fristtag, Bedarf ergänzen, ohne Annahmefenster) 16, 8 und 5 Prüfungen bestanden; 390 × 844 und 1280 × 720 ohne seitliches Scrollen | `dca307f` | `cf-test-runde-1/rohausgaben/B2-*`, `B4-*` |
| Pitch-Demo auf dem Entwicklungsstand (`cf-test`) | `demo-pruefung.js` | 28 von 28, alle 7 Bildschirmfotos byte-gleich zum Pitch-Stand | `dca307f` | `cf-test-runde-1/rohausgaben/B3-*` |
| Eigene Stichproben der Regel (`cf-test`) | Handrechnung gegen `pruefbitteFrist` und Abgleich, vier Zeitzonen | je 57 Prüfungen, 0 Fehler, in allen Zeitzonen gleich | `dca307f` | `cf-test-runde-1/rohausgaben/B6-*` |
| Unabhängige Prüfung der Unterlagen (`cf-review`, Runde 1) | lesend gegen Quellen, Oberfläche und Dateien | Befunde zu Uhrzeiten, Belegen, Überzeichnungen und Einverständnis, alle eingearbeitet (`1ce2db2`) | Pitch-Branch | Abschnitt 6 |
| Code-Review des Entwicklungsstands (`cf-review`) | lesend gegen den Plan | kein wesentlicher Befund, sechs Hinweise (Abschnitt 7.5) | `dca307f` | Rückgabe des Agenten, hier zusammengefasst |
| Zweite, gebündelte Prüfrunde (`cf-review` Unterlagen und Nacharbeiten, `cf-test` Wiederholung der Läufe auf dem Endstand) | siehe Abschnitt 4.1 | zum Zeitpunkt dieser Fassung in Arbeit | Pitch-Branch `2add671`, Entwicklungsbranch `92391c3` | Abschnitt 4.1 |

### 4.1 Zweite Prüfrunde

Ergebnis wird nach Abschluss der Runde in diesem Abschnitt eingetragen.

## 5. Nicht ausgeführt und Unsicherheiten

- **PowerPoint und Keynote:** nicht geöffnet. Notizen, Arial-Zeilenumbrüche (hier wurde mit Liberation Sans gerendert),
  Links im Vortragsmodus und Foliennummer + Enter sind **nicht** geprobt.
- **Beamer, Presenter, Alt+Tab, Netz am Ort:** nicht geprüft.
- **Die Seite auf claude.ai** wurde nicht im Browser geöffnet. Geprüft ist nur der heruntergeladene Stand. Freigabe und
  Sichtbarkeit der Vorschau sind nicht geprüft.
- **Alle Zeiten sind gerechnet, keine ist gestoppt** (4:19 ruhig, etwa 3:25 zügig, 64 s Demo, 4:27 im Spätfall).
- **SDG 12.5:** Der Wortlaut des Unterziels konnte nicht an der Primärquelle gelesen werden. Die Hosts der Vereinten Nationen
  und weitere Quellen waren aus der Arbeitsumgebung nicht erreichbar (zwei Wege versucht). Antwort 7 benennt das.
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

## 8. Höchstens drei Aufgaben für die morgendliche Generalprobe

Die Zuständigkeiten und Fristen sind Vorschläge, das Team bestätigt sie.

1. **Technik und Demo am Vortragsrechner.** Vorschlag: Houssam, zu Beginn der Generalprobe (etwa 15 Minuten). In PowerPoint
   (nicht in LibreOffice) öffnen: Referentenansicht mit Notizen, Zeilenumbrüche mit Arial auf den Folien 1, 4, 8 und 9, Links
   4 → 5 → 6 → 7 und 4 → 6 → 7, Foliennummer + Enter, Alt+Tab (Mac: Cmd+Tab) zum Browser im Vollbild, Online-Vorschau öffnen
   oder die lokale Variante starten. Abschlusskriterium: Die Punkte „PowerPoint am Vortragsrechner“, „Links im
   Vortragsmodus“, „Umschalten“ und „Vorschau am Veranstaltungsort“ in `pitch/innosprint-2026/generalprobe/probenanleitung.md`,
   Abschnitt 5, sind abgehakt, Abweichungen stehen in der Datei.
2. **Zeitprobe mit Stoppuhr.** Vorschlag: Feyrouz führt die Uhr, Houssam bedient die Demo. Ganzer Vortrag zweimal im ruhigen
   Tempo mit allen Übergaben, Demo allein dreimal, einmal der Spätfall mit Ausfall um 2:10. Abschlusskriterium: Die
   gemessenen Zeiten stehen in Abschnitt 1 der Probenanleitung neben den gerechneten, beide Gesamtläufe liegen unter 5:00.
   Sonst wird gekürzt, die Zeile „Bei Zeitdruck“ der Notizen zeigt, wo.
3. **Jurysätze laut sprechen und Entscheidungen festhalten.** Vorschlag: beide, danach spätestens vor dem Technik-Check am
   20.11. Die zehn Antworten aus `pitch/innosprint-2026/juryfragen/juryantworten.md` laut lesen (jede unter 30 Sekunden),
   „Das wissen wir noch nicht“ dort stehen lassen, wo die Hypothese steht, und den Wortlaut von SDG 12.5 an der Quelle der
   Vereinten Nationen nachlesen (von hier nicht erreichbar). Dazu drei Entscheidungen für den Praxistest: Kontakt im Einseiter,
   Speicherort und Löschfrist der Notizen, Zusage eines Ergebnisblatts (`docs/praxistest/README.md`), und die
   Produktentscheidungen (unter anderem E2) in `00_START_HIER/ENTSCHEIDUNGEN.md` eintragen. Abschlusskriterium: jede Antwort
   ohne Ablesen unter 30 Sekunden, die drei Entscheidungen stehen schriftlich im Team-Protokoll.
