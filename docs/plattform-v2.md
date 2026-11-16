# CircularFlow Plattform · Fassung 2 · Plan und Entscheidungen

**Fassung 2.0 (Plan) · 16.11.2026 · Branch `codex/plattform-v1` · Ausgangscommit `b82bba5`**
(Fassung 1.1, veröffentlicht als Version 8, lokal als Tag `plattform-v1.1-ausgang` gesichert; Branch auf GitHub.)

Auftrag von Houssam (16.11.2026, nachts, eigenständige Arbeit über Nacht): Oberfläche modernisieren und die
Plattform fachlich und technisch weiterentwickeln, damit sie bei der Jury (INNOSPRINT-Pitch 20.11.2026)
verständlich, überzeugend und zuverlässig wirkt. Wenige, vollständig funktionierende Verbesserungen.
Die fachliche Bewertung stammt von Agent 1 (cf-planung, 16.11.2026); offene Teamfragen hat der Koordinator
reversibel entschieden (Abschnitt 8). **Dieser Plan ist keine Produktfreigabe und ändert weder den Produktbrief
v0.2 noch CF-UMBAU-01 Revision 2.**

## 0. Aufgabe

- **Nutzerproblem:** Planende und Bauleitungen erfahren zu spät, welche Bauteile wo und wann frei werden, und
  können nicht vor ihrer Bestellfrist erkennen, ob für ein passendes Angebot noch eine Fachprüfung möglich ist.
  Was für Prüfung, Vormerkung und Übergabe noch zu klären ist, steht nirgends zusammen.
- **Gewünschtes Verhalten:** Übersicht mit Verfügbarkeit im Zeitverlauf, passenden Angebot-Bedarf-Paaren,
  offenen Vorgängen und Fristen; Bedarfe erfassen; erklärbarer Abgleich mit Zeit-, Mengen- und Typprüfung;
  Prüfbitte und Koordination bis zur geplanten Übergabe; Projekte direkt erfassen.
- **Ausgeschlossen:** CO₂-, Kosten- oder Abfallwerte, Preise, Wirtschaftlichkeitsrechner, Benachrichtigungen,
  Kontaktaufnahme, Login und Rollen, KI-Matching, verbindliche Reservierung, Änderungen an Radar, Raumscan,
  IFC, `prototype/dist/*` und der geprüften Türregel.
- **Akzeptanzkriterien:** je Paket in Abschnitt 2; Regeltests und Browserprüfung des Demoablaufs (Abschnitt 6).

## 1. Belegte Grundlagen

- Funktionssammlung aus anderen Plattformen: „CircularFlow_Funktionsvergleich_und_Claude_Auftrag_v1.0.md“
  (Google Drive des Teams, Fassung v1.0, 10.11.2026, Arbeitsentwurf; ChatGPT hat öffentliche Websites von
  Restado, Loopfront, Madaster und Concular gelesen, kein Konto- oder Schnittstellentest). Übernommen werden
  nur Muster: Katalog mit Filtern (Restado), Arbeitsliste und Projektzuordnung (Loopfront), schlanke
  Bauteilakte (Madaster), Gesuch und Angebot mit erklärbarer Zeitprüfung und sichtbarem nächstem Schritt
  (Concular). Der Vergleich hält fest: Katalog und Abgleich allein unterscheiden CircularFlow nicht; prüfbar
  machen soll man, ob die Bauleitung vor ihrer Bestellfrist eine Fachprüfung auslösen kann.
- „CircularFlow_Bauteile_Deutschland_2026-11-12.xlsx“ (Produktauswahl): Innentüren zuerst, Systemtrennwände
  als Alternative bei konkretem Bedarf, Doppelboden mit Fachpartner; gemeinsame Daten je Los; Wirtschaftlichkeit
  ist zu klären, aber ohne vorhandene Zahlen.
- Zeitregel des Produktbriefs v0.2 (A3/A4) ist in `prototype/dist/rules.mjs` (`evaluateCase`) umgesetzt:
  Kalendertage, Grenztag zählt als rechtzeitig, Widersprüche vor Zeitergebnis. Der neue Abgleich übernimmt diese
  Semantik und kennzeichnet Erweiterungen.

## 2. Priorisierter Umfang

Reihenfolge nach Abhängigkeit. Schnittregel bei Zeitmangel: P1–P3 und P5 zuerst, dann P4, zuletzt P6;
in P4 kann „Übergabe“ entfallen.

| Paket | Inhalt | Abnahme (Kurzform) |
|---|---|---|
| P1 Fachkern | Reine Funktionen: Abgleich (Typ, Menge, Zeit, Übergabe, Entfernung, Prüfpunkte), Vorgangsstatus, Kennzahlen, Bedarf- und Projektprüfung; Beispieldaten ergänzt | Prüffälle aus Abschnitt 3; Paritätstest gegen `evaluateCase` (CF-DEMO-01 bis -03); alle bestehenden Tests grün; `door-rules.mjs` unverändert |
| P2 Bedarfe | `#bedarfe`, `#bedarf-<projekt>-<id>`, `#bedarf-neu`; Formular zum Erfassen und Ergänzen (auch der Beispielbedarfe über Überlagerung) | Pflichtfelder Projekt, Gruppe, Titel, Menge; unvollständiger Bedarf speicherbar und als „Angaben fehlen“ markiert; Fehler am Feld; nach Neuladen da; Zurücksetzen entfernt ihn; Tastatur und Handy |
| P3 Abgleich und Katalog | Katalog `#bauteile` (Karten, Filter Gruppe, Bezirk, verfügbar bis, Menge); „Passende Gegenstücke“ in Pass und Bedarf; Abgleichseite; Aktion „Prüfbitte anlegen“ | rechtzeitiger, verspäteter und unvollständiger Fall mit drei Ergebnissen und Gründen; Prüfbitte bei „zu spät“ und „Angaben fehlen“ gesperrt mit Grund; keine Einheitenmischung; Lage „symbolisch“ |
| P4 Vorgang und Koordination | Auf der Entscheidungsseite: Fachergebnis (Eintrag, Simulation), Vormerkung, Übergabe geplant, übergeben, Abbruch; Checkliste „Was ist zu klären“; Arbeitsliste `#vorgaenge` | Nur erlaubte Übergänge bedienbar; Validierung am Feld; Verlauf mit Projektzeit und „Simulation“; nach Neuladen da; E-01 und E-02 verhalten sich wie bisher |
| P5 Übersicht und Navigation | `#uebersicht` als Start; Navigation Übersicht · Projekte · Bauteile · Bedarfe · Erfassen; Radar als Reiter unter Projekte | Jede Kennzahl hat ein Klickziel mit denselben Einträgen; keine Wirkungszahlen; alle alten Links gültig; Projektzeit als „Stichtag der Demo (Simulation)“ |
| P6 Projekt erfassen | Formular: Name, Art, Bezirk, Ausbau ab, Entscheidung bis, Gebäude mit Etagen und Räumen; automatischer Grundriss | Projekt auf Karte, Liste und in der Erfassung mit Chip „Eigene Eingabe“; Bauteil in einem seiner Räume erfassbar; leerer Name abgewiesen |

Bewertete und zurückgestellte Ideen:

| Idee | Entscheidung | Grund |
|---|---|---|
| Karte mit Zahl der Bedarfe im Popup | klein mitnehmen | wenig Aufwand, verbindet Karte und Bedarf |
| QR-Etiketten, Export, Druck | später | für den Pitch nicht nötig; Druck im veröffentlichten Artefakt gesperrt |
| Preise | später | keine Daten; wenn vorhanden nur als Testangabe |
| Wirtschaftlichkeitsrechner | verworfen | keine Zahlen; nur als Prüfpunkt „Wirtschaftlichkeit klären“ |
| CO₂-, Kosten-, Abfallanzeige | verworfen | keine belastbare Datengrundlage; AGENTS.md verbietet erfundene Werte |
| Benachrichtigungen, Kontaktaufnahme | verworfen | ausdrücklich ausgeschlossen |
| Rollen und Login | verworfen | Prototyp ohne Server; in Fassung 1 ausgeschlossen |
| KI-Matching | verworfen | Produktbrief stellt es zurück; der Abgleich ist regelbasiert und erklärbar |
| Doppelboden-Abgleich über Projekte hinweg | zurückgestellt | bisherige Sperre bleibt; Demo nutzt Wand und Tür |
| Wand selbst erfassbar machen | zurückgestellt | Demo nutzt Beispieldaten; Felder für Wand fehlen |

## 3. Regeln (Entwurf, fachlich nicht geprüft)

**Daten:** Bauteil bekommt optional `verfuegbarBis`. Bedarf bekommt `bestellfrist` (entspricht der
Ersatzentscheidungsfrist), `pruefzeitTage` (ganze Zahl 0–365), `annahmeVon`, `annahmeBis`, `anforderungen`
(Freitext, nicht maschinell bewertet), `zustaendig` (Rolle), `angelegt`, und je Zeitangabe `belegt` oder
`geschaetzt`. Die Einheit kommt aus der Bauteilgruppe. Aufmaßfrist und Nachweisfrist bleiben Sache der
Tür- und Bodenregel; der Abgleich nutzt sie nicht.

**Zeitprüfung:** Kalendertage, Europe/Berlin. Stichtag S = Tag der Projektzeit (Annahme, sichtbar genannt).
Prüfbeginn P = spätester Tag aus S, Erfassungstag des Angebots und Anlagetag des Bedarfs. Prüfende E = P +
Mindestprüfzeit. F = Bestellfrist. V1/V2 = verfügbar ab/bis. A1/A2 = Annahmefenster. Frühester Übergabetag
U = später Tag aus V1 und E. Ergebnisse in dieser Reihenfolge:
1. **Klärung nötig (Widerspruch):** A1 nach A2, V2 vor V1, ungültiges Datum, Prüfzeit außerhalb 0–365,
   andere Gruppe oder Einheit. Kein Zeitergebnis.
2. **Für diese Entscheidung zu spät:** sicher zutreffend auch bei sonst fehlenden Angaben, wenn P nach F, E nach F
   oder U nach A2. Grund mit genauer Tageszahl.
3. **Angaben fehlen:** Bestellfrist, Prüfzeit, Annahmefenster (beide Enden), verfügbar ab oder Menge unbekannt;
   alle fehlenden Angaben werden genannt. `verfuegbarBis` zählt nicht.
4. **Knapp:** alles bekannt und 0 Tage Reserve (E = F oder U = A2). Keine erfundene Tagesschwelle.
5. **Weiter prüfen (rechtzeitig):** sonst, mit Reserve in Tagen.
Grenzfälle: E = F ist rechtzeitig (knapp), einen Tag später zu spät. Ein Überlappungstag genügt (knapp).
**Erweiterung gegenüber `evaluateCase`:** Verfügbar vor dem Annahmefenster ist kein Ausschluss, sondern der
Prüfpunkt „Zwischenlagerung klären“ mit Dauer in Kalendertagen. Endet die Verfügbarkeit vor dem Prüfende,
entsteht ein Prüfpunkt. Geschätzte Angaben werden am Ergebnis genannt.

**Menge, Typ, Einheit, Entfernung:** nur gleiche Gruppe; keine Umrechnung zwischen Einheiten; gedeckt,
teilweise (Lücke) oder Menge fehlt. Doppelboden nutzt die bestehende Deckung aus `bewerteBoden` und nur
Bedarfe im selben Projekt. Entfernung als Luftlinie aus symbolischer Lage, „ca. n km (Lage symbolisch)“, ohne
Einfluss auf das Ergebnis.

**Vorgang:** Die bestehende Entscheidung (E-xx) ist der Vorgang. Der Status wird aus Ereignissen bis zur
Projektzeit abgeleitet. Ereignisse: `vorlage` (Prüfbitte, besteht), `fachergebnis` (geeignet, bedingt,
ungeeignet; Name der Fachperson als Text; Notiz bei bedingt und ungeeignet; Beschriftung „laut Eintrag,
Simulation, keine Fachfreigabe“), `vormerkung` (Menge in derselben Einheit, Ablaufdatum nicht vor Stichtag;
„Vormerkung, Simulation, unverbindlich“), `uebergabe-geplant` (Termin nicht vor Stichtag und verfügbar ab,
im Annahmefenster, nicht nach Vormerkungsablauf; Ort und Rolle Pflicht), `uebergeben` (Datum nicht nach Stichtag),
`abbruch` (Grund Pflicht). Keine Rückwärtsübergänge. Ungeeignet beendet den Vorgang; das Bauteil wird für andere
Ziele frei. Eine abgelaufene Vormerkung wird als abgelaufen angezeigt. Checkliste „Was ist zu klären“: Eignung,
Nachweise, Ausbau, Transport und Lager, Übergabe, Wirtschaftlichkeit (ohne Zahlen); nur Eignung sperrt.
Eingetragen wird immer als „Sie“; Beispielpersonen werden keine eigenen Einträge zugeschrieben.

## 4. Übersicht: Kennzahlen

Stichtag H = Projektzeit. Mengen nie über Einheiten addieren.

| Kennzahl | Herleitung | Klickziel |
|---|---|---|
| Bald verfügbar | Positionen mit Status ungleich „nicht“, ohne festes Ziel, verfügbar ab zwischen H und H + 90 Tagen (umschaltbar 30) | Katalog mit Filter |
| Verfügbarkeit im Zeitverlauf | Positionen je Monat von „verfügbar ab“, nach Gruppe; Tabelle als Textalternative | Katalog für den Monat |
| Bedarfe offen | Bedarfe ohne aktiven Vorgang | Bedarfe gefiltert |
| Passende Paare | Paare aus dem Abgleich nach Ergebnis; Bauteile mit aktivem Vorgang ausgenommen | Abgleichsliste gefiltert |
| Vorgänge je Status | abgeleiteter Status aller Vorgänge, inklusive E-01 und E-02 | Arbeitsliste gefiltert |
| Offene Prüfpunkte | Bauteile mit mindestens einem offenen Nachweis, dazu Zahl der Punkte | Bestand mit Filter „offen“ |
| Zeitkritisch (7 Tage) | Fristen zwischen H und H + 7 Tagen; Überfälliges hervorgehoben | Entscheidung oder Bedarf |

Ein Vorgang mit dem Status „übergeben“ belegt seinen Bedarf: Der Bedarf zählt nicht mehr unter „Bedarfe offen“, wird im Abgleich nicht mehr angeboten, und seine Bestellfrist ist nicht mehr zeitkritisch. Erst „ungeeignet“ oder „abgebrochen“ geben ihn wieder frei. „Paare derselben Gruppe“ zählt alle Ergebnisse; daneben steht „davon prüfbar“ (weiter prüfen oder knapp). Überfällig ist eine Frist, die verstrichen ist, während der Vorgang nicht erledigt ist (zum Beispiel abgelaufene Vormerkung, Bestellfrist ohne Vormerkung, Übergabetermin vorbei). Eine Prüfbitte ist nur erlaubt, wenn der Abgleich des Paares sie erlaubt (Ziel Bedarf) oder die Türregel Rang 6 erreicht hat (Ziel Zielöffnung); sonst zeigt die Entscheidungsseite den Grund.

## 5. Navigation

Übersicht · Projekte (Karte, Liste; Reiter Radar und Projekt erfassen) · Bauteile (Katalog) · Bedarfe · Erfassen.
Neue Routen: `#uebersicht` (Start; leerer Hash), `#vorgaenge`, `#bauteile`, `#bedarfe`, `#bedarf-<p>-<id>`,
`#bedarf-neu`, `#bedarf-ergaenzen-<p>-<id>`, `#abgleich` (Liste), `#abgleich-<p>-<bauteil>--<p>-<bedarf>`, `#projekt-neu`.
Der Trenner im Abgleich-Schlüssel ist `--`, weil claude.ai-Seiten nur Buchstaben, Ziffern und Bindestriche im Hash
durchreichen. Alle bisherigen Routen bleiben gültig.
Filter als Teil des Hashs, soweit claude.ai das erlaubt (dort nur `#name`); sonst Filter im Seitenzustand.

## 6. Demoablauf für die Jury (Beispieldaten, Projektzeit Mi 18.11., 14:00)

Ergänzte Beispieldaten: BD-22 (Seeblick, Systemtrennwände 60 lfm) mit Bestellfrist 31.03.2027, Prüfzeit 10 Tage,
Annahmefenster 01.02.–31.03.2027 (geschätzt); neuer BD-23 (Seeblick, 30 lfm) mit Bestellfrist 27.11.2026,
Prüfzeit 14 Tage, Annahmefenster 11.01.–26.02.2027; BD-21 (Innentüren) bleibt ohne Zeitangaben.
1. Übersicht: Fristen der nächsten Tage, bald verfügbare Positionen, passende Paare.
2. Projekt erfassen (optional ein Bauteil in einem Raum erfassen).
3. Katalog: Systemtrennwände filtern, TW-05 (Kanalblick, ab 01.02.2027) öffnen, Bauteilakte.
4. Rechtzeitig: TW-05 → BD-22, „Weiter prüfen“ mit Reserve, Prüfpunkte.
5. Zu spät: TW-01 → BD-23, Prüfende nach der Bestellfrist, Prüfbitte gesperrt.
6. Unvollständig: T-31 → BD-21, „Angaben fehlen“; Bedarf ergänzen, Ergebnis wechselt.
7. Koordinieren: Prüfbitte für TW-05 → BD-22, Fachergebnis eintragen, vormerken, Übergabe planen; Übersicht zählt mit.

## 7. Arbeitsteilung (ohne gleichzeitige Änderungen an denselben Dateien)

| Rolle | Agent | Dateien |
|---|---|---|
| 1 Fachliche Bewertung, Prioritäten, Jury-Ablauf | cf-planung | nur lesen; Ergebnis in diesem Dokument |
| 3 Datenmodell und Dashboard-Logik | cf-entwicklung, Paket A | neu `app/abgleich.js`, `app/vorgang.js`, `app/kennzahlen.js`, `app/bedarf.js`, `app/projektanlage.js`; `app/daten.js`, `app/zustand.js`; neue Tests in `plattform/test/` |
| 2 Oberfläche, Navigation, Barrierefreiheit, Integration | cf-entwicklung, Pakete B und C nacheinander | `styles.css`, `ui.js`, `main.js`, `index.html`, `app/ansichten/*`; in `regeln.js` nur der Vorgangsstatus in `naechsteHandlung`/`offeneEntscheidungen` und „aktiver Vorgang“ |
| 4 Tests, Fehleranalyse, Demoablauf | cf-test | nur prüfen; Hilfsskripte außerhalb des Repositorys |
| Unabhängige Prüfung | cf-review | nur lesen |

Die Pakete laufen nacheinander. Nach jedem Paket: Commit, Regeltests; nach der Integration cf-review und cf-test
auf derselben Codefassung.

## 8. Entscheidungen des Koordinators (reversibel, zur späteren Bestätigung)

1. Umfang P1–P6 umsetzen, Schnittregel wie oben (Auftrag erlaubt direkte Umsetzung).
2. „Reservierung“ heißt in der Oberfläche „Vormerkung (Simulation, unverbindlich)“.
3. Zwischenlagerung ist ein Prüfpunkt, kein Klärungsergebnis (gekennzeichnete Erweiterung).
4. Doppelboden-Abgleich bleibt auf das eigene Projekt beschränkt.
5. Prüfbeginn = Stichtag der Projektzeit, sichtbar genannt.
6. Mindestprüfzeiten 10 und 14 Tage sind Beispielannahmen, gekennzeichnet; echte Werte fehlen.
7. Fachperson als Freitext mit Hinweis „Simulation, keine Fachfreigabe“.
8. Radar wird Reiter unter Projekte; die Route `#radar` bleibt.
9. Horizonte: 90 Tage „Bald verfügbar“ (umschaltbar 30), 7 Tage „Zeitkritisch“.
10. Wand bleibt nicht selbst erfassbar.

## 9. Umsetzungsstand und Übergabe · 16.11.2026

**Codestand:** Branch `codex/plattform-v1` (auf GitHub). Endstand der Anwendung `584e377`, Ausgangscommit der
Fassung 2 `b82bba5`. Commits: `5d65085` Plan, `3f049ee` Fachkern (Paket A), `918b95f` Oberfläche (Paket B),
`d4156ca` Formulare und Vorgang (Paket C), `f1d4be6` Review-Befunde, `0d0923d` Routen im Plan, `d106bdc`,
`c128429` und `584e377` Korrekturen aus Nachprüfung, Endprüfung und Review der Schluss-Commits.

### Umgesetzt

Alle Pakete P1 bis P6 aus Abschnitt 2; die Schnittregel musste nicht angewendet werden.

| Paket | Ergebnis | Warum |
|---|---|---|
| P1 Fachkern | `abgleich.js`, `vorgang.js`, `kennzahlen.js`, `bedarf.js`, `projektanlage.js` als reine Funktionen mit Tests; Zeitregel wie `evaluateCase` (Paritätstest CF-DEMO-01 bis -03) | Jede Zahl und jedes Ergebnis der Oberfläche ist ohne Browser nachprüfbar |
| P2 Bedarfe | Liste, Detail, Erfassen, Ergänzen (Beispielbedarfe als Überlagerung) | „Welches Projekt könnte es brauchen?“ braucht erfasste Bedarfe |
| P3 Katalog und Abgleich | Katalog mit Filtern; Abgleichsliste und Abgleichseite mit Typ, Menge, Zeit, Entfernung, Prüfpunkten und nächstem Schritt; Prüfbitte nur, wenn der Abgleich sie erlaubt | Kern der Jury-Frage: passt es rechtzeitig, und was ist noch zu prüfen |
| P4 Vorgang | Prüfbitte, Fachergebnis (laut Eintrag, Simulation, keine Fachfreigabe), Vormerkung (Simulation, unverbindlich), Übergabe geplant, übergeben, Abbruch; Checkliste „Was ist zu klären“; Arbeitsliste | Zeigt den Weg vom Vorschlag zur Übergabe, ohne eine Freigabe vorzutäuschen |
| P5 Übersicht und Navigation | Startseite Übersicht mit Kernfrage, Zeitkritisch, fünf Kacheln mit Klickziel und Verfügbarkeit im Zeitverlauf mit Tabelle; Navigation Übersicht · Projekte · Bauteile · Bedarfe · Erfassen | Die Jury sieht auf einen Blick, was wann frei wird und was drängt |
| P6 Projekt erfassen | Formular mit Gebäude, Etagen und Räumen, schematischer Grundriss, Chip „Eigene Eingabe“ | Demo-Schritt „Projekt erfassen“ |

Nach der unabhängigen Prüfung durch cf-review wurden 15 Befunde behoben (`f1d4be6`, Nachprüfung: 15 von 15).
Danach folgten fünf Korrekturen:
- Der Bauteilpass sperrt Bedarfe, für die der Abgleich „zu spät“ oder „Klärung nötig“ ergibt. Vorher entstand ein
  Vorgang, der Bauteil und Bedarf bis zum Abbruch band.
- Die zwei offenen Entscheidungen mit Frist und Zuständigkeit aus Fassung 1.1 stehen wieder auf der Kartenseite
  (`#projekte`). Sie waren beim Umbau der Oberfläche entfallen.
- Die Ziffern der Statuskette sind im Dunkelmodus lesbar.
- Die Hauptnavigation „Bauteile“ hebt eine Katalogvorgabe aus der Übersicht auf.
- Der Bauteilpass nennt gesperrte Bedarfe direkt unter dem Auswahlfeld, mit Link zum Abgleich. Ist kein Ziel
  wählbar, entfallen Auswahlfeld und Knopf.

### Ausprobieren

Server vom Repository-Root starten (`python3 -m http.server 8000`), `http://localhost:8000/plattform/` öffnen und den
Demoablauf in 7 Schritten aus `plattform/README.md` durchgehen. Direkte Einstiege:
- `#abgleich-kb-tw-05--sb-bd-22`: rechtzeitig
- `#abgleich-lh-tw-01--sb-bd-23`: zu spät
- `#abgleich-kb-t-31--sb-bd-21`: Angaben fehlen
- `#projekte`: Karte mit offenen Entscheidungen
- `#entscheidung-lh-e-01`: Türdemo
- `#entscheidung-lh-e-02`: Doppelboden

Zurücksetzen über Erfassen → „In diesem Browser gespeichert“ → „Zurücksetzen“.

### Prüfungen

Alle Browserläufe nutzten Chromium ohne Fenster über Playwright mit Sprache de-DE und Zeitzone Europe/Berlin. Die
Skripte liegen außerhalb des Repositorys.

**Agent 4 (cf-test) auf `d106bdc`.** Der Arbeitsbaum war vor und nach der Prüfung unverändert.

| Bereich | Ergebnis |
|---|---|
| Regel- und Ansichtstests: `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs` | 176 von 176 |
| Jury-Ablauf in 7 Schritten, Desktop 1440 × 900 | 55 von 55. Jede Kachelzahl entspricht der Zahl der Einträge im Klickziel. Reserve 58 Tage, ca. 7,9 km. Prüfende 02.12.2026, 5 Tage nach der Bestellfrist. Wechsel von „Angaben fehlen“ zu „Weiter prüfen“ nach dem Ergänzen |
| Neu in `d106bdc` | BD-23 im Pass von TW-01 gesperrt, BD-21 im Pass von T-31 wählbar, zwei Entscheidungskarten auf `#projekte` |
| Regression Fassung 1.1 (Doppelboden 7 m², Türdemo, offene Entscheidungen) | 26 von 26 |
| Radar, IFC-Vorprüfung mit eigener kleiner IFC-Datei (2 Geschosse, 2 Räume, 3 Türen), Erfassung ohne Foto | bestanden |
| Handy 390 × 844 (Emulation), 13 Routen | kein Querscrollen, untere Leiste bedienbar |
| Dunkelmodus, Kontrast aller sichtbaren Texte auf 8 Ansichten | ein Verstoß: Ziffern der Statuskette |
| Tastatur | Fokus sichtbar, Enter auf einer Kachel navigiert, Fokus nach Navigation im Inhalt |
| Speichern, Neuladen, Zurücksetzen, kaputter Speicherwert | bestanden |
| Unbekannte Route, Filter ohne Treffer | bestanden |
| Konsole und Netz | keine Fehler, keine Anfrage an fremde Hosts |
| Vorschau-Build (`node plattform/bauen-artifact.mjs <Ordner>`), lokal ausgeliefert | Übersicht, Türregel und E-01 funktionieren |

Befunde: einer mittel und drei gering.
- Mittel: Kontrast der Ziffern in der Statuskette im Dunkelmodus.
- Gering: Eine Katalogvorgabe aus der Übersicht blieb haften und verbarg TW-05 in Schritt 3.
- Gering: Eine Element-ID stand im Prüfauftrag, gibt es aber in der App nicht.
- Gering: Leeres Absenden des Projektformulars per Enter wurde nicht gesondert geprüft.

**cf-review auf `c128429`** (nur lesend, die zwei Schluss-Commits): kein blockierender und kein hoher Befund.
- Mittel: Der Grund für gesperrte Bedarfe stand erst nach dem Klick auf „Zuordnen“ da. Behoben in `584e377`.
- Gering: Strg-Klick auf „Bauteile“ leerte die Vorgabe im aktuellen Tab. Behoben in `584e377`.
- Gering, offen: Ein nach Stichtagswechsel gesperrtes, noch gemerktes Ziel zeigt beim Klick den Abgleich-Fehler
  statt „Bitte ein Ziel wählen“ (unschädlich).
- Gering, offen: Der Test deckt die Fehlermeldung in `main.js` und den Fall „Klärung nötig“ nicht eigens ab.

**Koordinator auf `584e377`, nach allen Korrekturen, mit denselben Skripten:**
- Regel- und Ansichtstests: 177 von 177
- Jury-Ablauf: 55 von 55
- Regression Fassung 1.1: 26 von 26
- Dunkelmodus: 0 Verstöße auf 8 Ansichten
- Handy: 13 Routen ohne Querscrollen, untere Leiste bedienbar
- Vorschau-Build: 4 von 4
- Nachprüfung der Befunde: 13 von 13
  - Kontrast der Ziffern im Dunkelmodus 10,43:1 und 8,84:1, im Hellmodus 6,48:1 und 8,73:1.
  - „Bauteile“ in der Navigation hebt die Vorgabe auf, auch auf derselben Seite und am Handy.
  - Schritt 3 zeigt TW-05.
  - Ein leeres Projektformular per Enter setzt den Fokus auf den Namen.
- Hinweis im Bauteilpass: 12 von 12 (Desktop und Handy, Link öffnet den Abgleich mit Grund, Strg-Klick lässt die
  Vorgabe stehen)
- Keine Skriptfehler und keine Anfragen an fremde Hosts in allen Läufen

Zwei Tastaturprüfungen im Skript von Agent 4 bleiben rot. Das Skript erkennt Fokusrahmen an Pseudo-Elementen und
SVG-Konturen nicht. Eine eigene Messung der berechneten Stile bestätigt den sichtbaren Fokus an Kachel,
Diagrammsegment und Monatslink (3 von 3), ein Screenshot zeigt ihn. Die neue Sperre im Pass betrifft bei allen vier
Projektzeiten nur die zwei Paare zu BD-23.

**Nicht geprüft:**
- Straßenkarte (Anfragen nach außen)
- Fotoaufnahme mit Kamera
- Raumscan (simuliert)
- Echte Geräte, Safari und Firefox, Bildschirmleser
- Tab-Reihenfolge außerhalb der Übersicht
- Kontrast von SVG-Text und Karteninhalt
- Kontrast im Hellmodus außer der Statuskette
- Fachliche Richtigkeit von Abgleich und Vorgang

Alles läuft als Simulation mit Beispieldaten.

### Grenzen und bekannte Punkte

- Abgleich, Mindestprüfzeiten (10 und 14 Tage) und Annahmefenster der Beispiele sind Entwurfsregel und Annahmen,
  fachlich nicht geprüft. Lage und Entfernung sind symbolisch.
- Nach einer Prüfbitte lässt sich ein Fachergebnis unabhängig vom Regelergebnis eintragen. Es ist als „laut
  Eintrag“ gekennzeichnet.
- „Übergeben“ ist im Demo-Zeitraum nicht erreichbar. Die Annahmefenster liegen 2027, ein Übergabedatum darf nicht nach
  dem Stichtag liegen, und die Projektzeit lässt sich nur zwischen 18. und 20.11.2026 wählen. Die Logik ist durch
  Tests abgedeckt.
- Die Sperre gegen rückdatierte Einträge gilt für die neuen Vorgangsschritte, nicht für die älteren Knöpfe
  „Zur Fachprüfung vorlegen“ und „Aufgabe vermerken“ der Fassung 1.
- Im Bauteilpass bleibt die Zuordnung zu einem Bedarf mit „Angaben fehlen“ erlaubt. Der Bedarf lässt sich
  ergänzen, und der Doppelbodenfall der Fassung 1.1 braucht diesen Weg. Der entstehende Vorgang bindet Bauteil und
  Bedarf bis zum Abbruch. „Zu spät“ und „Klärung nötig“ (Widerspruch in den Angaben) sind gesperrt, wie bei der
  Prüfbitte.
- Eigene Bedarfe, deren Kennung schon ein Beispielbedarf trägt, werden beim Laden verworfen (gewollt).
- Die Gruppenfarbe „Sonstige“ ist bewusst grau und unterschreitet die Farbsättigung, die das Palettenprüfskript
  verlangt. Die Gruppe ist zusätzlich über Legende, Text und Tabelle erkennbar.
- Die Startseite ist jetzt die Übersicht, die Karte liegt unter „Projekte“. Alle alten Links funktionieren weiter.
- Git-Tags lassen sich über den Git-Proxy nicht pushen (HTTP 403). `plattform-v1-veroeffentlicht` (`f499936`) und
  `plattform-v1.1-ausgang` (`b82bba5`) bestehen nur lokal. Der Branch ist gepusht.
- Die bereits geteilte Seite der Fassung 1.1 wurde nicht aktualisiert, weil öffentliche Veröffentlichungen
  ausgeschlossen waren. Fassung 2 (Stand `584e377`) liegt stattdessen als neue, private und nicht geteilte Seite
  „CircularFlow Fassung 2“ im claude.ai-Konto. Sie entstand mit `node plattform/bauen-artifact.mjs` und weicht nur
  im Seitentitel ab. Geprüft sind der lokal ausgelieferte Build (4 von 4) und die Liste der 35 hochgeladenen Dateien.
  Die veröffentlichte Seite selbst wurde nicht im Browser geöffnet.
- Nicht geändert: Produktbrief v0.2, CF-UMBAU-01 Revision 2, `prototype/dist/*`, `docs/entscheidungen.md`,
  `AGENTS.md`, `CLAUDE.md`.

### Entscheidungen, die eine Rückmeldung brauchen

1. Die zehn Entscheidungen des Koordinators in Abschnitt 8, besonders „Vormerkung“ statt „Reservierung“, die
   Prüfzeiten als Annahmen und den Doppelboden nur im eigenen Projekt.
2. Die Übersicht als Startseite statt der Karte.
3. Soll ein Fachergebnis nur möglich sein, wenn der Abgleich die Prüfbitte erlaubt hat?
4. Soll die geteilte Seite auf Fassung 2 aktualisiert werden? Dafür ist eine ausdrückliche Freigabe nötig.
5. Soll Fassung 2 den Produktbrief v0.2 fortschreiben, oder bleibt sie ein Demo-Entwurf?

## 10. Prüfauftrag nach der Übergabe · 16.11.2026

**Auftrag (Houssam, 16.11.2026):** Übersicht und Entscheidungen aus Abschnitt 8 bleiben für die Demo. Zu prüfen:
1. Ein Fachergebnis lässt sich erst nach einer tatsächlich angelegten Prüfbitte eintragen.
2. Ein laufender Vorgang bleibt bei Fristablauf dokumentierbar.
3. Doppelboden: Bei 7 m² Bestand und 57,2 m² Bedarf ist die fehlende Menge von mindestens 50,2 m² auch bei
   unbekannter Schadfläche erkennbar.

Danach den kürzesten zuverlässigen Pitch-Ablauf für die geprüfte Vorschau liefern. Über die öffentliche Freigabe
entscheidet das Team nach der Generalprobe.

- **Nutzerproblem:** Die Jury muss sehen, dass ein Vorschlag nie als Freigabe durchgeht, dass ein Vorgang nach
  einer verstrichenen Frist weiter festhält, was geschieht, und dass eine Teilmenge als Teilmenge erkennbar ist.
- **Ausgeschlossen:** neue Funktionen, Änderungen an der Übersicht und an Abschnitt 8, die öffentliche Freigabe,
  der Produktbrief.
- **Akzeptanz:** je Punkt Tests in `plattform/test/pruefauftrag.test.mjs` und eine Browserprüfung.
- **Ausgang:** `74fa0f9`. Codestand danach: `1063421` und `2121b92`. Pitch-Ablauf: `a48ac47` und dieser Commit.

### Ergebnis je Punkt

**1. Fachergebnis nur nach Prüfbitte**
- Der Fachkern ließ ein Fachergebnis schon vorher nur nach einer Prüfbitte zu. Gespeicherte, vordatierte und vor
  der Prüfbitte datierte Fachergebnisse zählen nicht.
- **Gefunden:** Der ältere Knopf „Zur Fachprüfung vorlegen“ legt eine Vorlage an, und die zählt wie eine
  Prüfbitte. Beim Doppelboden (E-02 mit beiden Nachweisen) umging er so die Sperre des Abgleichs, während der
  Vorgang gleichzeitig „Prüfbitte noch nicht möglich“ meldete.
- **Jetzt:** Für alle Wege gilt dieselbe Sperre (`regeln.vermerkSchritt`, `lageVorgang`).
  - E-02 nennt „Fehlende Angaben zum Bedarf ergänzen“ und bietet einen Link dorthin.
  - Die Vorlage ist erst möglich, wenn BD-01 Mindestprüfzeit und Annahmefenster hat.
  - Der alte Knopf trägt nicht mehr rückdatiert ein.

**2. Dokumentierbar bei Fristablauf**
- Eintragen ließ sich schon vorher jeder erlaubte Schritt.
- **Gefunden:**
  - Während einer laufenden Prüfbitte fehlte die Bestellfrist des Bedarfs auf der Entscheidungsseite und unter
    „Zeitkritisch“.
  - Nach dem Fachergebnis stand eine verstrichene Frist weiter als „offen“.
  - Arbeitsliste und Kartenkarten verdeckten eine verstrichene Frist durch die nächste.
- **Jetzt:**
  - Die Bestellfrist gehört zu den Fristen des Vorgangs, ihr Status folgt dem Datum.
  - Die Seite meldet „Frist verstrichen: … Der Vorgang bleibt offen. Weiter möglich: …“.
  - Einträge danach vermerken „Eingetragen nach Ablauf der Bestellfrist (…)“, beim Doppelboden „der
    Ersatzentscheidung“.
  - Listen und Karten zeigen die verstrichene Frist zuerst.

**3. Doppelboden 7 m² gegen 57,2 m²**
- Entscheidung und Abgleichseite waren richtig.
- **Gefunden:** Die Paarliste schrieb „es fehlen 50,2 m²“ ohne „mindestens“. Pass und Bedarfsseite nannten die
  Lücke gar nicht.
- **Jetzt:** An allen Stellen steht „Es fehlen mindestens 50,2 m²“, auch im Auswahlfeld des Passes.

### Prüfungen

**Tests:** `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs`
ergab auf `2121b92` 190 von 190. Gegenprobe: In einer Kopie wurde jede der 12 Korrekturen einzeln
zurückgenommen, und die neuen Tests erkannten jede Rücknahme.

**Browser** (Chromium über Playwright, de-DE, Europe/Berlin) auf `2121b92`:

| Prüfung | Ergebnis |
|---|---|
| Prüfauftrag | 33 von 33 |
| Jury-Ablauf | 55 von 55 |
| Fassung 1.1 | 26 von 26 |
| Dunkelmodus | 0 Verstöße auf 8 Ansichten |
| Handy | 13 Routen ohne seitliches Scrollen |
| Nachprüfung | 13 von 13 |
| Hinweis im Pass | 12 von 12 |
| Fokus | 3 von 3 |
| Tastaturskript | 35 von 37, die bekannten zwei Fehlalarme des Skripts |
| Pitch-Ablauf | 28 von 28 lokal, 28 von 28 auf den gebauten Dateien der Vorschau |
| Rauchtest Vorschau | 4 von 4 |

**cf-review auf `1063421`:** kein blockierender und kein hoher Befund, 2 mittlere und 6 geringe Punkte.
- **In `2121b92` behoben:**
  - Überschrift nach der Sperrart,
  - verstrichene Frist zuerst,
  - Vermerktext,
  - Hinweis mit den möglichen Schritten,
  - Hinweis beim Doppelboden,
  - CSS-Spezifität,
  - ungültiges Datum der Bestellfrist (in `lageVorgang` und `vorgangSchritt`; die Bedarfsliste in `kennzahlen.js` prüft es
    nicht eigens),
  - fehlender Vorgang.
- **Bewusst offen:** Gespeicherte Prüfbitte- und Vorlage-Ereignisse zählen ohne erneute Prüfung der Freigabe. Es
  sind nur eigene Einträge in diesem Browser, und ein älterer Test nutzt das.

**cf-test auf `a48ac47`:** Agent 4 hat den Pitch-Ablauf wörtlich über die sichtbaren Beschriftungen befolgt, auf den
gebauten Dateien der Vorschau, in 1280 × 720 und 390 × 844.
- Alle Schritte sind bestanden, ohne Konsolenfehler und ohne Anfragen nach außen.
- Kein blockierender, hoher oder mittlerer Befund.
- Fünf geringe Befunde betrafen den Wortlaut des Dokuments (Status der Vormerkung, Klickzahl, klickbare Fläche der
  Kachel, Landeseite nach dem Zurücksetzen, Feldname „Menge in m²“). Sie sind in `docs/pitch-ablauf.md`
  eingearbeitet, ebenso die Hinweise, wo man in 1280 × 720 scrollen muss.

**Vorschau:** Seite „CircularFlow Fassung 2“, Version 2 mit Code `2121b92`. Sie unterscheidet sich vom Build nur im
Titel. Die Seite ist inzwischen als „Jeder mit dem Link“ geteilt; diese Einstellung stammt nicht von Claude. Die
geteilte Seite der Fassung 1.1 ist unverändert.

**Nicht geprüft:**
- die Vorschau auf claude.ai selbst (kein Browserzugang),
- die Datumseingabe per Tastatur auf einem deutschen Rechner,
- echte Geräte, Safari und Firefox,
- Bildschirmleser.

### Rückmeldungen zu Abschnitt 9 und offene Entscheidungen

Zu Abschnitt 9:
- Punkt 1 (Abschnitt 8) und Punkt 2 (Übersicht als Start) sind für die Demo bestätigt.
- Punkt 3 ist beantwortet: Ein Fachergebnis gibt es nur nach einer Prüfbitte, und die Prüfbitte nur mit Freigabe.
- Punkt 4 entscheidet das Team nach der Generalprobe.
- Punkt 5 ist offen.

Neu zu entscheiden:
1. Die Prüfbitte zum Doppelboden setzt vollständige Bedarfsangaben voraus (Mindestprüfzeit und Annahmefenster
   fehlen bei BD-01 und BD-02). Das folgt Abschnitt 4. Die Alternative wäre, dass die Bodenregel allein genügt.
2. Vorschlagswerte im Vormerkformular (Menge, „gilt bis“ gleich Ende des Annahmefensters), damit die Vormerkung im
   Pitch ohne Datumseingabe auskommt. Nicht umgesetzt.
3. Soll die Vorschau bis zur Generalprobe wieder privat sein?

## 11. Festgehaltener Pitch-Stand · 16.11.2026

**Entscheidungen von Houssam (16.11.2026):**
- Die Prüfbitte zum Doppelboden setzt weiterhin vollständige Bedarfsangaben voraus, also Mindestprüfzeit und
  Annahmefenster.
- Das Vormerkformular bekommt keine Vorschlagswerte.
- Die Freigabe der Vorschau bleibt unverändert. Über die öffentliche Freigabe entscheidet das Team nach der
  Generalprobe.
- Geprobt wird auf dem Vortragsrechner in einem frischen Browserprofil. Gestartet wird nur, wenn die Übersicht
  8 Paare, davon 2 prüfbar, und 2 Vorgänge zeigt.
- Der Hauptablauf endet bei „Vormerkung anlegen“.

**Festgehalten:**

| Was | Stand |
|---|---|
| Code | `2121b92`, danach nur Dokumentation |
| Vorschau | „CircularFlow Fassung 2“, Version 2, Versions-ID `1794826502-00b9`, gebaut aus `2121b92`. Nur der Seitentitel weicht vom Build ab. Die Freigabe ist unverändert: Derzeit gilt „Jeder mit dem Link“, eingestellt nicht von Claude |
| Pitch-Ablauf | `docs/pitch-ablauf.md` in dem Commit, der diesen Abschnitt enthält |
| Branch | `codex/plattform-v1` auf GitHub. Tags lassen sich über den Git-Proxy nicht pushen (HTTP 403), daher steht der Stand hier |

Bis zum Pitch ändern sich Code, Vorschau und Freigabe nur mit ausdrücklicher Zustimmung. Was die Probe ergibt, wird
als Befund notiert und nicht stillschweigend behoben.

**Prüfung des festgehaltenen Stands:** Die Dateien der Version 2 wurden lokal ausgeliefert und mit Chromium über
Playwright geprüft (de-DE, Europe/Berlin), jeweils in einem neuen Browserkontext ohne gespeicherte Daten.
- Skript `pitch-haupt.cjs` (Arbeitsordner außerhalb des Repositorys), in 1280 × 720, 1440 × 900 und 390 × 844:
  - Die Startbedingung ist erfüllt: „8 Paare davon 2 prüfbar“ und „2 Vorgänge“ bei Stichtag Mi 18.11., 14:00.
  - Der Hauptablauf braucht ab der Übersicht 7 Klicks bis „Vormerkung anlegen“.
  - Es gibt kein seitliches Scrollen.
  - Ergebnis: 24 von 24, ohne Konsolenfehler und ohne Anfragen nach außen.
- `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs`: 190 von 190.

**Nicht geprüft:**
- der Vortragsrechner und sein Browser,
- die Vorschau auf claude.ai selbst (kein Browserzugang von hier).

Beides deckt die Probe auf dem Vortragsrechner ab.

