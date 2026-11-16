# CircularFlow Plattform · Fassung 2 · Plan und Entscheidungen

**Fassung 2.0 (Plan) · 16.11.2026 · Branch `codex/plattform-v1` · Ausgangscommit `b82bba5`**
(Fassung 1.1, veröffentlicht als Version 8, lokal als Tag `plattform-v1.1-ausgang` gesichert; Branch auf GitHub.)

Auftrag von Houssam (16.11.2026, abends, eigenständige Arbeit über Nacht): Oberfläche modernisieren und die
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
`#bedarf-neu`, `#abgleich-<p>-<bauteil>~<p>-<bedarf>`, `#projekt-neu`. Alle bisherigen Routen bleiben gültig.
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
