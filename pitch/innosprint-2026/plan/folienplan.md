# Folienplan INNOSPRINT-Pitch 20.11.2026: drei Fassungen A, B, C

Stand 17.11.2026. Ich habe keine Dateien geschrieben und keine Befehle ausgeführt. Der Bericht geht an die Hauptsitzung, damit cf-entwicklung PPTX und PDF baut.

## 0. Quellen und Fassungen

**Gelesen:**
- `CLAUDE.md` und `AGENTS.md`
- `docs/claude-vor-entwicklung.md` (14.11.2026)
- `docs/pitch-ablauf.md` (festgehaltener Stand 16.11.2026, Vorschau Version 2, ID `1794826502-00b9`, Code `2121b92`)
- `docs/plattform-v2.md` (Fassung 2.0, alle Abschnitte)
- `plattform/README.md`
- `docs/pilot/CF-PILOT-01-fallakte.md` (Fassung 1.3, 16.11.2026, ganz gelesen)
- `docs/plan-restmenge.md` (v1.1, nur Ausblick)
- `docs/produktbrief.md` (v0.2, 08.11.2026)
- die drei Auszüge im Scratchpad: Teilnahmebedingungen (Stand 01.10.2026), Lösungsansatz, Rechercheplan

**Bilder, selbst angesehen:** `k1-uebersicht`, `k2-paarliste`, `k3-zu-spaet`, `k4-weiter-pruefen`, `k5-vorgang`, `k6-vormerkung-anlegen`, `pilot-abgleich-t13-bd24`, `pilot-pass-angaben`, `pilot-scan-karte`.

**Nicht gelesen oder nicht angesehen:**
- `docs/grundlagen/*`, `docs/agenten-start.md` und `docs/entscheidungen.md`. Der Folienplan braucht sie nicht, weil er keine Türregel und keinen Code ändert.
- `cf-pilot-01-simulation.mjs`. Die Nachrechnungszahlen stammen aus Fallakte §5 und §10, nicht aus eigener Ausführung.
- Die Bilder `k1-uebersicht-kacheln`, `k5-pruefbitte-oben`, `pilot-erfassung-werte`, `pilot-pass-bedarfe` und `pilot-scan-vorgeschlagen`. Ich plane sie nicht fest ein, nur als optionale Alternativen.

**Quellenwiderspruch, keine Umfangsänderung:** Der Produktbrief v0.2 beschreibt Bedarf, Vorgang und Abgleich der Fassung 2 nicht. Plattform v2 §9 hat dazu die Frage offen, ob Fassung 2 den Produktbrief fortschreibt oder ein Demo-Entwurf bleibt. Ich plane deshalb alles aus Fassung 2 als „Simulation, Demo-Entwurf“. Die Folien behaupten keine Produktfreigabe.

**Kürzel für Fußzeilen und Belege:**
- Quellen: FA = Fallakte v1.3, PA = pitch-ablauf.md, PV2 = plattform-v2.md, PB = Produktbrief v0.2, LA = Lösungsansatz, RP = Rechercheplan, VA = Teilnahmebedingungen.
- Belegstatus: **BF** = direkt beobachtete Funktion (Bild oder PA), **PB** = Projektbeleg (Team-/Projektdokument), **HA** = Herstellerangabe, **HY** = Hypothese, **EV** = eigener Vorschlag, **SI** = Simulation, **VA** = Veranstalterangabe.

**Chips auf den Folien** (Farben aus der App):
- „Fiktiver Pilotfall“, „Beispieldaten“ und „Simulation“ in Gelb.
- „Annahme, unbestätigt“ und „Hypothese“ in Blau.
- „Herstellerangabe“ in neutralem Grau.

**Nicht verwendet:** 40 % CO₂ und 55 % Abfall laut Veranstalter. Sie stehen im Veranstalterdokument ohne Quelle, und jede Fassung kommt ohne sie aus. Wer sie nutzen will, schreibt „laut Veranstalter“ dazu.

---

## 1. Gemeinsame Bausteine

### 1.1 Demo-Block E1–E6: Ersatzfolien und Demo-Drehbuch in einem

E1–E6 entsprechen genau K1–K6 aus PA. Beim Live-Vortrag sind sie das Drehbuch, bei Ausfall die Ersatzfolien. Sie sind gleich in A und B, und in C stehen sie im Anhang. Die Sprechtexte decken die vier „Sätze, die stimmen“ aus PA ab.

**Gemeinsam auf allen E-Folien:**
- Chips „Beispieldaten“ und „Simulation“.
- Kleines Schild „Ersatz für Live-Demo · K1“ usw. Es steht nur auf der versteckten Version.
- Das Bildschirmfoto groß, mit höchstens einer Hervorhebung.

**E1 · Die Übersicht zeigt 8 Paare, davon 2 prüfbar, und 2 Vorgänge**
- Bild: `k1-uebersicht.jpg`. Hervorheben: „8 Paare davon 2 prüfbar“, „2 Vorgänge“ und der Stichtag-Chip.
- Spricht: Houssam, 30 s.
- Beleg: BF (Bild, PA K1, Startbedingung).
- Sprechtext: „Das ist die Übersicht der Vorschau. Alle Daten sind Beispieldaten. Der Stichtag der Demo ist ein gewählter Zeitpunkt in der Simulation: Mittwoch, 18. November, 14 Uhr. Oben stehen die Fristen der nächsten sieben Tage. Darunter: neun Positionen werden in den nächsten 90 Tagen verfügbar. Acht Paare aus Angebot und Bedarf derselben Gruppe, davon zwei prüfbar. Und zwei Vorgänge.“

**E2 · Jedes Paar hat ein Ergebnis mit Grund**
- Bild: `k2-paarliste.jpg`. Hervorheben: die Filterchips „Weiter prüfen 2 · Angaben fehlen 4 · Zu spät 2“.
- Spricht: Houssam, 25 s.
- Beleg: BF (Bild, PA K2).
- Sprechtext: „Ein Klick auf die Acht öffnet die Liste. Jedes Paar hat ein Ergebnis: zwei Mal weiter prüfen, vier Mal Angaben fehlen, zwei Mal für diese Entscheidung zu spät. Geprüft werden Typ, Menge und Zeit. Wichtig: Der Abgleich ist ein Vorschlag zur Prüfung, keine fachliche Freigabe.“

**E3 · Dieses Paar ist zu spät: Die Prüfung endet 5 Tage nach der Bestellfrist**
- Bild: `k3-zu-spaet.jpg` (TW-01 → BD-23). Hervorheben: „Prüfende 02.12.2026 liegt 5 Tage nach der Bestellfrist 27.11.2026“ und „Gesperrt“.
- Spricht: Feyrouz, 30 s. Houssam bedient.
- Beleg: BF (Bild, PA K3). Die 14 Tage Prüfzeit von BD-23 stammen aus PV2 §6 und sind eine Annahme, kein Beleg.
- Sprechtext: „Nehmen wir ein Paar, das zu spät ist. Die Prüfung wäre erst am 2. Dezember 2026 fertig. Die Bestellfrist des Bedarfs ist der 27. November, fünf Tage früher. Die Prüfbitte ist gesperrt, der Grund steht direkt daneben. Der nächste Schritt für die Planung: klären, ob die Bestellentscheidung noch offen ist. Die 14 Tage Mindestprüfzeit sind eine Beispielannahme.“

**E4 · Dieses Paar passt zeitlich: Prüfende 123 Tage vor der Bestellfrist**
- Bild: `k4-weiter-pruefen.jpg` (TW-05 → BD-22). Hervorheben: „Prüfende 28.11.2026 liegt 123 Tage vor der Bestellfrist 31.03.2027“.
- Spricht: Houssam, 30 s.
- Beleg: BF (Bild). Prüfpunkte und „ca. 7,9 km, Lage symbolisch“ stehen laut PA K4 weiter unten, nicht auf dem Bild. Die 10 Tage Prüfzeit und das geschätzte Annahmefenster stammen aus PV2 §6 und sind Annahmen.
- Sprechtext: „Zurück zur Liste, jetzt ein Paar mit dem Ergebnis weiter prüfen. Die Prüfung wäre am 28. November 2026 fertig, 123 Tage vor der Bestellfrist am 31. März 2027. Weiter unten stehen die Prüfpunkte und die Entfernung, etwa 7,9 Kilometer, die Lage ist nur symbolisch. Auch hier gilt: Mindestprüfzeit und Annahmefenster sind Beispielannahmen, kein Beleg aus einem echten Projekt.“

**E5 · Die Prüfbitte legt einen Vorgang an, das Fachergebnis ist ein Eintrag**
- Bild: `k5-vorgang.jpg` (Ausschnitt). Hervorheben: „Prüfbitte gestellt“, die Statuskette mit 6 Schritten und das Formular „Fachergebnis eintragen“.
- Spricht: Houssam, 25 s.
- Beleg: BF (Bild, PA K5/K6), SI.
- Sprechtext: „Mit ‚Prüfbitte anlegen‘ entsteht ein Vorgang. Die Kette zeigt sechs Schritte, von der Zuordnung bis zur Übergabe. Jetzt trägt jemand das Fachergebnis ein: geeignet, mit dem Namen einer Fachperson, hier ein Beispiel. Das ist ein Eintrag in der Simulation. Geprüft hat hier niemand, und es wird nichts versendet und niemand kontaktiert.“

**E6 · Der nächste Schritt heißt „Vormerkung anlegen“, hier endet die Demo**
- Bild: `k6-vormerkung-anlegen.jpg`. Hervorheben: der Kasten „Nächster fachlicher Schritt · Vormerkung anlegen“ und „laut Eintrag (Simulation), keine Fachfreigabe“.
- Spricht: Houssam, 25 s.
- Beleg: BF (Bild, PA K6), SI. Der Name „J. Neumann (fiktiv)“ steht im Bild und ist dort als fiktiv gekennzeichnet.
- Sprechtext: „Der Vorgang steht jetzt auf geeignet, laut Eintrag. Oben steht der nächste fachliche Schritt: Vormerkung anlegen. Hier endet unsere Demo. Eine Vormerkung wäre unverbindlich und ebenfalls Simulation. Die Software prüft also die Zeit und zeigt den nächsten Schritt. Die fachliche Prüfung machen weiterhin Fachleute.“

**Dauer des Blocks:** Die Sprechtexte ergeben etwa 165 s. Mit Klick- und Ladezeit setze ich 180 s an. Das entspricht PA („etwa drei Minuten“).

### 1.2 Bedienregel für Live-Demo und Ersatz (Vorschlag, EV)

1. **Vorher:** Frisches Profil, Startbedingung prüfen (PA „Vorbereitung“). Danach sind die Ersatzfolien nur Backup.
2. **Aufteilung:** Houssam bedient, Feyrouz hat die Uhr. Bei E3 spricht Feyrouz, während Houssam klickt.
3. **Anordnung in der Datei:** Die versteckten Folien E1–E6 stehen direkt nach der Demo-Ankündigung. Im Vortragsmodus überspringt PowerPoint sie von selbst, und die Reihenfolge läuft ohne Eingriff weiter.
4. **Auslöser für den Ersatz:**
   - Die Seite lädt nach etwa 10 s nicht.
   - Die Startbedingung ist falsch und ein zweites frisches Profil hilft nicht.
   - Nach einem Fehlklick weicht die Ansicht ab.
5. **Festes Wort:** „Die Vorschau lädt gerade nicht. Wir zeigen dieselben Schritte als Bildschirmfotos.“
6. **Sprung:** Auf der Demo-Ankündigung liegt unten rechts ein kleiner, unauffälliger Link „Ersatz“ auf E1. Er funktioniert auch bei versteckten Folien. Alternativ Foliennummer tippen und Enter. Beides ist von mir nicht geprüft und gehört in die Generalprobe auf dem Vortragsrechner.
7. **Ausfall mitten in der Demo:** Man macht bei der E-Folie des aktuellen K-Schritts weiter, nicht von vorn. Nach E6 geht es normal zur nächsten sichtbaren Folie.
8. **Dateien:** PPTX mit versteckten E-Folien. Das Abgabe-PDF enthält die E-Folien als „Anhang: Ersatzfolien“ am Ende. Der Grund: Versteckte Folien fehlen oft im PDF-Export. Das Team entscheidet in Frage 2 (Abschnitt 5), ob der Anhang mit abgegeben wird.

### 1.3 Gemeinsame Sprechtexte

**G-GM · Geschäftsmodell (Hypothese)** (Feyrouz, 30 s, in A, B und C)
- Titel: **Wer zahlen könnte, ist eine Hypothese: Zahlungsbereitschaft ist ungeprüft**
- Inhalt (Stichworte):
  - Mögliche Zahlende: Eigentümer, öffentliche Einrichtungen, Wohnungsunternehmen (Frühwarnung, Koordination).
  - Mögliche Auftragnehmer: Betriebe für Prüfung, Ausbau, Transport, Lager, Wiedereinbau.
  - Alternative: Zusammenarbeit mit bestehenden Plattformen.
  - Ungeprüft: Zahlungsbereitschaft, Budget, Preis.
- Visuell: Drei Kästen „Nutzen“, „Leistung“, „Zahlt?“ mit Fragezeichen im dritten. Kein Preis, keine Zahl.
- Chip: Hypothese (blau).
- Beleg: HY. Quellen: LA „Mehrwert, vom Team erwartet, nicht belegt“ und RP „Geschäftsmodell und Zugang“. Die Zusammenarbeit mit bestehenden Plattformen ist ein eigener Vorschlag (EV) laut Koordinatorrahmen.
- Fußzeile: „LA; RP“.
- Sprechtext: „Zum Geschäftsmodell haben wir eine Hypothese, keine Zahlen. Eigentümer, öffentliche Einrichtungen und Wohnungsunternehmen könnten für Frühwarnung und Koordination zahlen. Betriebe für Prüfung, Ausbau, Transport und Lager könnten Aufträge bekommen. Eine Alternative wäre die Zusammenarbeit mit bestehenden Plattformen. Ob jemand zahlen würde, wer das Budget hat und in welcher Höhe, haben wir nicht geprüft.“

**G-PT · Nächster Praxistest, kurz** (in A und B)
- Titel: **Der nächste Test ist klein: ein echter Fall, vier Zeitpunkte, eine Mindestprüfzeit**
- Inhalt:
  - Vier Fragen als Zeitleiste: Angebot bekannt → erreicht die zuständige Person → Entscheidung bis → Übergabe möglich.
  - Klären, ob 14 Tage Mindestprüfzeit stimmen.
  - Signal: eine dokumentierte Angabe mit Quelle.
  - Grenze: ein Einzelfall belegt keinen Markt.
- Visuell: Zeitleiste mit vier leeren Markern und je einer Frage.
- Chips: Annahme, unbestätigt (14 Tage). Der Test selbst ist ein Vorschlag (EV).
- Beleg: PB (FA §11 „Nächster Prüfauftrag“), RP „Fallnotiz“ und „Auswertung“.
- Fußzeile: „FA §11; RP“.
- Sprechtext: „Unser nächster Schritt ist klein. Wir suchen eine Planerin oder einen Planer, die oder der einen Fall mit uns durchgeht. Wann wurde das Angebot bekannt? Wann erreichte es die zuständige Person? Bis wann musste sie entscheiden? Wann war die Übergabe möglich? Daraus sehen wir, ob 14 Tage Mindestprüfzeit stimmen. Das Signal wäre eine dokumentierte Angabe mit Quelle. Ein Einzelfall belegt keinen Markt. Wer so einen Fall hat, spricht uns nach dem Pitch an.“

---

## 2. Fassung A (empfohlen): „Zwölf Bürotüren und ein Datum, das niemand sieht“

- **Schwerpunkt:** Der Umbaufall zuerst, die Demo in der Mitte. Der Fall liefert den Aha-Moment („der letzte Tag ist der 5. Februar, nicht der 19.“). Die Demo zeigt danach die Regel.
- **Kernbotschaft:** Ob Bauteile weitergegeben werden, kann am Zeitpunkt hängen, an dem die Planung das Angebot sieht. Die Plattform prüft die Zeit und nennt den nächsten menschlichen Schritt.
- **Passt am besten:** zu einem Publikum aus Planung, Bau und Eigentümerseite, das Fälle anschaulich mag, und für eine erzählte Geschichte mit einer Live-Demo als Beweis.
- **Sprechzeit:** ca. 6:55 Minuten ohne Fragen, bei 8 sichtbaren Folien plus 6 versteckten E-Folien.
  - Rechnung: gesprochenes Deutsch mit etwa 2,3 Wörtern pro Sekunde. Das ist eine eigene Schätzung und braucht einen Probelauf mit Stoppuhr.
  - Die Demo ist mit 180 s angesetzt.
  - Bei bis zu 11 Minuten je Team (eigene Rechnung aus VA) bleiben rund 4 Minuten für Wechsel und Fragen.
- **Bei etwa 3 Minuten entfallen:** A4 mit dem ganzen E-Block, und A5 wird auf die Kurzfassung gekürzt. Es bleiben A1, A2, A3, A5-kurz, A6, A7 und A8, zusammen ca. 3:20.
- **Wortgrenzen:** Jeder Sprechtext liegt zwischen 40 und 110 Wörtern. Dauern sind Schätzungen.

| Nr. | Titel | Spricht | Dauer |
|---|---|---|---|
| A1 | Zwölf Bürotüren und ein Datum, das niemand sieht | Feyrouz | 25 s |
| A2 | Eine Tür wird entsorgt, wenn die Planung zu spät vom Angebot erfährt | Feyrouz | 30 s |
| A3 | Der letzte Tag ist der 5. Februar, nicht der 19. | Feyrouz | 35 s |
| A4 | Wir zeigen die Zeitprüfung live an Beispieldaten | Houssam | 25 s plus Demo E1–E6 180 s |
| A5 | Die Plattform prüft die Zeit und nennt den nächsten Schritt | Houssam | 35 s |
| A6 | Wer zahlen könnte, ist eine Hypothese (G-GM) | Feyrouz | 30 s |
| A7 | Der nächste Test ist klein (G-PT) | Feyrouz, Schlusssatz Houssam | 35 s |
| A8 | Schluss | Houssam | 20 s |

Summe: 25 + 30 + 35 + 25 + 180 + 35 + 30 + 35 + 20 = 415 s, das sind 6:55.

**A1 · Zwölf Bürotüren und ein Datum, das niemand sieht** (Titelfolie, Dunkelgrün)
- Inhalt: „CircularFlow · INNOSPRINT 20.11.2026 · Houssam Taleb, Feyrouz Chahed“.
- Visuell: Die Statuskette als weißes Band auf Grün (Zuordnung → Prüfbitte → Fachergebnis → Vormerkung → Übergabe geplant → Übergeben, nach `k6`). Der Chip „Fiktiver Pilotfall“ erscheint unten.
- Chip: Fiktiver Pilotfall.
- Spricht: Feyrouz, 25 s.
- Beleg: PB (LA „studentisches Gründungsteam“), SI.
- Sprechtext: „Guten Tag! Wir sind Feyrouz und Houssam, ein studentisches Team, und das ist CircularFlow. Wir zeigen einen Fall aus dem Umbau: zwölf Bürotüren, die ausgebaut werden. Sechs davon könnte ein anderes Projekt brauchen. In unserem Fall hängt das weniger an der Tür als an einem Datum. Der Fall ist ausgedacht und mit veröffentlichten Quellen eingeordnet.“ (ca. 58 Wörter)

**A2 · Eine Tür wird entsorgt, wenn die Planung zu spät vom Angebot erfährt**
- Inhalt:
  - Haus Lindenhof: 12 Türen = 4 intern + 2 offene Fragen + 6 Angebot.
  - Bedarf „Umbau am Kanal“: 6 Stk, Bestellfrist 19.02.2027.
  - Mögliche Betroffene (Hypothese): Planung, Bauleitung, Eigentümer.
- Visuell: Kästchen-Diagramm mit 12 Quadraten (4 hellgrün „intern“, 2 blau „offene Fragen“, 6 dunkelgrün „Angebot“). Ein Pfeil führt zu einer Karte „Bedarf BD-24 · 6 Stk · Bestellfrist 19.02.2027“.
- Chips: Fiktiver Pilotfall, Beispieldaten, Hypothese (Zielgruppe).
- Spricht: Feyrouz, 30 s.
- Beleg: Der Fall ist SI/PB (FA §0, §2 A3/A4, §3). Die Rollen sind HY, denn PB nennt die Bauleitung ausdrücklich „keine Praxisbefund“. Die Bestellfrist 19.02.2027 ist laut FA A4 eine Vorgabe des Auftrags.
- Fußzeile: „FA §0, §3“.
- Sprechtext: „Haus Lindenhof wird umgebaut, zwölf Türen kommen raus: vier für den eigenen Umbau, zwei mit offenen Fragen, sechs als Angebot. Das Projekt Umbau am Kanal braucht sechs Türen, muss aber bis zum 19. Februar 2027 Ersatz bestellen. Erfährt die Planung zu spät vom Angebot, wird neu gekauft, und die alten Türen werden entsorgt, obwohl sie gepasst hätten. Wir vermuten: Betroffen sind Planung und Bauleitung. Das ist eine Hypothese, kein Praxisbefund.“ (ca. 80 Wörter)

**A3 · Der letzte Tag ist der 5. Februar, nicht der 19.**
- Inhalt: Zeitleiste 19.01. bis 08.03.2027 mit diesen Markern:
  - 19.01. Angebot bekannt.
  - 05.02. letzter Tag für die Prüfbitte.
  - 13.02. Warnung unter „Zeitkritisch“ (ein Samstag).
  - 19.02. Bestellfrist.
  - 22.02. Angebot erreicht Planung in Variante 2.
  - 01.–05.03. Ausbau.
  - 08.03. Übergabe.
  - Die Klammer „41 Tage Vorlauf“ geht von 19.01. bis 01.03.
- Visuell: Die Zeitleiste als Hauptmotiv, mit Farbbändern. Bis 04.02. „weiter prüfen“ in Grün, der 05.02. „knapp“ in der Bernsteinfarbe der App (aus `k1`), ab 06.02. „zu spät“ in Rot.
- Chips: Fiktiver Pilotfall, Simulation, Annahme, unbestätigt: 14 Tage Mindestprüfzeit.
- Spricht: Feyrouz, 35 s.
- Beleg:
  - Alle Daten sind SI, nachgerechnet mit dem Fachkern (FA §1 Befund 1, §5 Tabellen).
  - Die Lücke „Warnung erst ab 13.02., acht Tage nach dem letzten Prüfbeginn“ ist ein PB-Befund (FA §1, §5 Variante 2).
  - Die 14 Tage sind eine Annahme (FA A5).
  - Die 41 Tage sind FA §6. Rechnung: 19.01. bis 01.03. = 41 Tage.
- Fußzeile: „FA §1, §5 (Nachrechnung mit dem Fachkern, keine Praxisdaten)“.
- Sprechtext: „Das Angebot wird am 19. Januar bekannt. Mit 14 Tagen Mindestprüfzeit ist der letzte Tag für die Prüfbitte der 5. Februar, nicht der 19. Ab dem 6. Februar lautet das Ergebnis: für diese Entscheidung zu spät. Eine Warnung unter Zeitkritisch gäbe es erst ab dem 13. Februar. Das ist eine Lücke in unserer Plattform. Erreicht das Angebot die Planung erst am 22. Februar, ist der Ersatz schon bestellt. Alle Zeitpunkte sind nachgerechnet, nicht erlebt. Die 14 Tage sind eine Annahme.“ (ca. 92 Wörter)

**A4 · Wir zeigen die Zeitprüfung live an Beispieldaten** (Demo-Ankündigung)
- Inhalt: „Live-Demo · Fassung 2 · Beispieldaten · Stichtag der Demo Mi 18.11., 14:00 (Simulation)“. Dazu der Hinweis, dass der Türfall nicht im Demo-Profil liegt.
- Visuell: Die Statuskette mit sechs Schritten. K1–K6 stehen als kleine Punkte darunter. Unten rechts liegt der kleine Link „Ersatz“ auf E1.
- Chips: Beispieldaten, Simulation.
- Spricht: Houssam, 25 s, danach Demo E1–E6 mit 180 s.
- Beleg: BF (PA „Hauptablauf“). Die Aussage „Regel ist dieselbe“ stützt sich auf FA Schritt 6: Der Pilot nutzt denselben Abgleich der Fassung 2.
- Fußzeile: „PA; PV2 §11“.
- Sprechtext: „Jetzt zeigen wir die Zeitprüfung live in der Vorschau. Die Türen aus unserem Fall liegen dort nicht, wir nehmen die Beispieldaten der Vorschau. Die Regel ist dieselbe. Der Stichtag der Demo ist ein gewählter Zeitpunkt in der Simulation, nicht das heutige Datum. Es wird nichts versendet und niemand kontaktiert.“ (ca. 52 Wörter)
- Danach kommen die versteckten E1–E6 (Abschnitt 1.1).

**A5 · Die Plattform prüft die Zeit und nennt den nächsten Schritt**
- Inhalt:
  - Links, Erwarteter Nutzen (Hypothese): früh sehen, was frei wird · Zeitprüfung mit Begründung in Tagen · nächster Schritt statt Freigabe.
  - Rechts, Abgrenzung: Andere Plattformen vermitteln Angebot und Gesuch (Concular Exchange laut Anbieter, Madaster Match laut Dokumentation). CircularFlow fragt, ob die Zeit bis zur Bestellentscheidung für eine fachliche Prüfung reicht.
- Visuell: Zweispaltige Gegenüberstellung mit einer Mini-Statuskette. Die Hersteller-Seite trägt den Chip „Herstellerangabe“.
- Chips: Hypothese, Herstellerangabe.
- Spricht: Houssam, 35 s.
- Beleg:
  - Erwarteter Nutzen: HY (LA „vom Team erwartet, nicht belegt“).
  - Concular Exchange: HA (RP, am 08.11.2026 geöffnet, nicht erneut geprüft).
  - Madaster Match: HA (FA §6, Dokumentation, „Zuletzt bearbeitet 9. September 2026“).
  - Der Unterschied ist die Frage aus dem Koordinatorrahmen (EV).
  - Die Überschneidung räumt RP selbst ein: „Wir bringen Angebot und Bedarf zusammen reicht als Abgrenzung nicht aus.“
- Fußzeile: „RP; FA §6“.
- Sprechtext: „Was bringt das? Wir erwarten: Die Planung sieht früh, was frei wird, bekommt die Zeitprüfung mit Begründung in Tagen und sieht den nächsten Schritt. Das ist eine Hypothese. Andere Plattformen vermitteln Angebot und Gesuch, Concular Exchange laut Anbieter, Madaster Match laut Dokumentation. Da gibt es eine Überschneidung. Unser Unterschied ist die Frage, ob die Zeit bis zur Bestellentscheidung für eine fachliche Prüfung reicht, und wer als Nächstes dran ist.“ (ca. 82 Wörter)
- **Kurzfassung A5-kurz** (22 s, für die 3-Minuten-Variante): „Der Nutzen, den wir erwarten: Die Planung sieht früh, was frei wird, bekommt die Zeitprüfung mit Begründung in Tagen und sieht den nächsten Schritt. Das ist eine Hypothese. Andere Plattformen vermitteln Angebot und Gesuch. Unsere Frage ist, ob die Zeit für eine Prüfung reicht.“ (ca. 50 Wörter)

**A6 · Wer zahlen könnte, ist eine Hypothese: Zahlungsbereitschaft ist ungeprüft.** Siehe G-GM. Feyrouz, 30 s.

**A7 · Der nächste Test ist klein: ein echter Fall, vier Zeitpunkte, eine Mindestprüfzeit.** Siehe G-PT. Feyrouz, 35 s.

**A8 · Schluss** (Dunkelgrün)
- Titel als Aussage: **Wir fragen nicht nur, ob es passt, sondern ob die Zeit reicht**
- Inhalt: Die Zeile „Simulation · Beispieldaten · fiktiver Pilotfall“ und die Namen Houssam Taleb und Feyrouz Chahed.
- Visuell: Die Statuskette in Weiß, die letzten drei Schritte hervorgehoben.
- Chips: Simulation, Beispieldaten, Fiktiver Pilotfall.
- Spricht: Houssam, 20 s.
- Beleg: HY, EV.
- Sprechtext: „Zusammengefasst: Wiederverwendung kann am Zeitpunkt scheitern, das ist unsere Hypothese. CircularFlow prüft, ob die Zeit für eine fachliche Prüfung reicht, und nennt den nächsten menschlichen Schritt. Heute ist das Simulation mit Beispieldaten. Als Nächstes brauchen wir einen echten Fall. Danke.“ (ca. 48 Wörter)

---

## 3. Fassung B: „Ein Vorschlag ist keine Freigabe“

- **Schwerpunkt:** Die Live-Demo sofort nach der Eröffnung, danach das Vertrauensthema („gemessen, bestätigt, vorgeschlagen“). Der Pilotfall wird kurz nachgeschoben.
- **Kernbotschaft:** CircularFlow macht aus einem Treffer einen prüfbaren nächsten Schritt: mit Zeitprüfung, mit Status je Wert und ohne vorgetäuschte Freigabe.
- **Passt am besten:** zu einem Publikum, das Produkt und Technik sehen will. Es ist die Fassung, die am meisten von der gebauten Plattform zeigt.
- **Sprechzeit:** ca. 7:00 Minuten, bei 8 sichtbaren Folien plus 6 versteckten E-Folien.
  - Mit Demo ab Sekunde 25 liegt das Hauptrisiko am Anfang.
  - Bei etwa 3 Minuten entfallen B2 mit dem E-Block, B3 und B4. Stattdessen werden E3 und E4 als zwei sichtbare Bildfolien gezeigt (je 25 s). Zusammen mit B1, B5, B6, B7 und B8 ergibt das ca. 3:30.

| Nr. | Titel | Spricht | Dauer |
|---|---|---|---|
| B1 | Reicht die Zeit für eine Prüfung? Wir zeigen es zuerst | Houssam | 25 s |
| B2 | Wir starten in der Übersicht der Vorschau | Houssam | 20 s plus Demo E1–E6 180 s |
| B3 | Ein Vorschlag ist keine Freigabe: gemessen, bestätigt, vorgeschlagen | Houssam | 35 s |
| B4 | Im Pilotfall hängt alles am 5. Februar | Feyrouz | 35 s |
| B5 | Für wen und was anders: Zeitfrage vor der Bestellentscheidung | Feyrouz | 35 s |
| B6 | Wer zahlen könnte, ist eine Hypothese (G-GM) | Feyrouz | 30 s |
| B7 | Der nächste Test ist klein (G-PT) | Feyrouz, Schlusssatz Houssam | 35 s |
| B8 | Schluss | Houssam | 20 s |

Summe: 25 + 20 + 180 + 35 + 35 + 35 + 30 + 35 + 20 = 415 s, das sind 6:55.

**B1 · Reicht die Zeit für eine Prüfung? Wir zeigen es zuerst** (Titelfolie, Dunkelgrün)
- Inhalt: Die Frage groß, darunter „CircularFlow · INNOSPRINT 20.11.2026“.
- Visuell: Die Statuskette als Band. Das Problem steht nur im Sprechtext.
- Chips: Beispieldaten, Simulation.
- Spricht: Houssam, 25 s.
- Beleg: HY (Problemformulierung aus PV2 §0), PB.
- Sprechtext: „Bauteile aus einem Umbau oder Rückbau könnten anderswo gebraucht werden. Die Frage, die wir uns stellen: Reicht die Zeit bis zur Bestellentscheidung, damit eine Fachperson noch prüfen kann? Wir sind Houssam und Feyrouz, ein studentisches Team, und das ist CircularFlow. Statt lange zu erklären, zeigen wir es gleich. Alle Daten in der Vorschau sind Beispieldaten.“ (ca. 62 Wörter)

**B2 · Wir starten in der Übersicht der Vorschau** (Demo-Ankündigung)
- Inhalt: „Live-Demo · 6 Schritte · Beispieldaten · Stichtag der Demo Mi 18.11., 14:00 (Simulation)“.
- Visuell: Statuskette mit K1–K6 als Punkten. Der Link „Ersatz“ liegt unten rechts.
- Chips: Beispieldaten, Simulation.
- Spricht: Houssam, 20 s.
- Beleg: BF (PA).
- Sprechtext: „Wir starten in der Übersicht der Vorschau und gehen sechs Schritte. Am Ende steht kein Verkaufsabschluss, sondern der nächste menschliche Schritt. Der Stichtag der Demo ist ein gewählter Zeitpunkt in der Simulation, nicht das heutige Datum. Es wird nichts versendet.“ (ca. 46 Wörter)
- Danach kommen die versteckten E1–E6.

**B3 · Ein Vorschlag ist keine Freigabe: gemessen, bestätigt, vorgeschlagen**
- Inhalt:
  - Türblattbreite 860 mm: gemessen.
  - Türblatthöhe 1985 mm: bestätigt.
  - Türblatt Holzwerkstoff: vorgeschlagen.
  - Scan: Öffnung B-04, 884 mm: vorgeschlagen.
  - „Für die Türregel zählt nur, was gemessen ist.“
- Visuell: `pilot-pass-angaben.jpg` links und `pilot-scan-karte.jpg` rechts, beide als Ausschnitte.
- Chips: Fiktiver Pilotfall, Beispieldaten, Simulation.
- Spricht: Houssam, 35 s.
- Beleg: BF (beide Bilder), SI (Scan und Erkennung). Die Regel „nur gemessen zählt“ steht in FA §4 Schritt 3 (Tabelle „Wertstatus“) und im Bild.
- Fußzeile: „FA §4 Schritt 3, §8“.
- Sprechtext: „Noch ein Beispiel aus unserem fiktiven Türfall. Die Plattform trennt gemessen, bestätigt und vorgeschlagen. Die Türblattbreite von 860 Millimetern ist gemessen. Die Höhe ist bestätigt, aber nicht gemessen. Das Material ist nur vorgeschlagen. Ein simulierter Raumscan liefert 884 Millimeter, ebenfalls nur vorgeschlagen. Für die Türregel zählt nur, was gemessen ist. Fachlich bestätigt gibt es als Status nicht. Das Fachergebnis ist ein Eintrag.“ (ca. 75 Wörter)

**B4 · Im Pilotfall hängt alles am 5. Februar**
- Inhalt: Kompakte Zeitleiste mit vier Zeitpunkten und diesen Markern:
  - 19.01. Angebot bekannt.
  - 05.02. letzter Tag für die Prüfbitte.
  - 19.02. Bestellfrist.
  - 08.03. Übergabe.
- Visuell: Die Zeitleiste in einer Zeile, darunter „Annahme, unbestätigt: 14 Tage Mindestprüfzeit“.
- Chips: Fiktiver Pilotfall, Simulation, Annahme, unbestätigt.
- Spricht: Feyrouz, 35 s.
- Beleg: SI/PB (FA §5, Nachrechnung).
- Fußzeile: „FA §5“.
- Sprechtext: „Warum die Zeit so wichtig ist, zeigt unser fiktiver Fall. Zwölf Türen aus Haus Lindenhof, sechs für den Umbau am Kanal. Das Angebot wird am 19. Januar bekannt, die Bestellfrist ist der 19. Februar. Mit 14 Tagen Prüfzeit ist der letzte Tag für die Prüfbitte der 5. Februar. Die Zeitpunkte sind mit demselben Fachkern nachgerechnet. Die 14 Tage sind eine Annahme, die ein echter Fall bestätigen müsste.“ (ca. 78 Wörter)

**B5 · Für wen und was anders: die Zeitfrage vor der Bestellentscheidung**
- Inhalt:
  - Zielgruppe (Hypothese): Planung und Bauleitung auf der Bedarfsseite, dazu Eigentümer, die ausbauen lassen.
  - Erwarteter Nutzen: früh sehen · Zeit mit Begründung prüfen · nächsten Schritt kennen.
  - Abgrenzung: Concular Exchange (laut Anbieter) und Madaster Match (laut Dokumentation) vermitteln Angebot und Gesuch.
- Visuell: Drei Karten „Wer“, „Nutzen“, „Anders als“. Die Hersteller-Karte trägt den Chip „Herstellerangabe“.
- Chips: Hypothese, Herstellerangabe.
- Spricht: Feyrouz, 35 s.
- Beleg: HY (PB, LA), HA (RP, FA §6).
- Fußzeile: „PB; LA; RP; FA §6“.
- Sprechtext: „Für wen? Unsere Hypothese: Planung und Bauleitung auf der Bedarfsseite, dazu Eigentümer, die ausbauen lassen. Der Nutzen, den wir erwarten: früh sehen, was frei wird, die Zeit mit Begründung prüfen und den nächsten Schritt kennen. Andere Plattformen vermitteln Angebot und Gesuch, Concular Exchange laut Anbieter, Madaster Match laut Dokumentation. Da gibt es eine Überschneidung. Unser Unterschied ist die Zeitfrage vor der Bestellentscheidung.“ (ca. 70 Wörter)

**B6 · Geschäftsmodell.** Siehe G-GM. Feyrouz, 30 s.

**B7 · Praxistest.** Siehe G-PT. Feyrouz, 35 s.

**B8 · Schluss** (Dunkelgrün)
- Titel als Aussage: **Ein Vorschlag zur Prüfung ist noch keine Freigabe, und genau so zeigen wir ihn**
- Inhalt: Die Chips „Simulation · Beispieldaten · fiktiver Pilotfall“ und die Namen.
- Visuell: Die Statuskette in Weiß mit dem Schritt „Fachergebnis“ hervorgehoben.
- Spricht: Houssam, 20 s.
- Beleg: BF, EV.
- Sprechtext: „CircularFlow macht aus einem Treffer einen prüfbaren nächsten Schritt: mit Zeitprüfung, mit Status je Wert und ohne vorgetäuschte Freigabe. Heute ist das Simulation mit Beispieldaten. Fachleute prüfen, wir bereiten die Entscheidung vor. Als Nächstes brauchen wir einen echten Fall. Danke.“ (ca. 46 Wörter)

---

## 4. Fassung C: „Wir suchen einen Fall in Dortmund“

- **Schwerpunkt:** Der Pilotversuch und die Zusammenarbeit. Die Fassung beginnt mit der Frage nach vier Zeitpunkten. Die Plattform kommt als Bildschirmfotos, nicht live.
- **Kernbotschaft:** Wir haben eine Simulation und eine klare Frage. Für den nächsten Schritt in Dortmund brauchen wir einen echten Fall, an dem wir vier Zeitpunkte nachzeichnen.
- **Passt am besten:** zu einem Publikum mit Praxis aus Bau, Planung und Entsorgung in Dortmund, wenn das Team vor allem Feedback und einen Praxispartner gewinnen will (LA „erwartete Ergebnisse“). Die Fassung hat das niedrigste Demo-Risiko.
- **Sprechzeit:** ca. 5:15 Minuten, bei 9 sichtbaren Folien. Es gibt keine Live-Demo, also kein Ausfallrisiko.
- **Demo-Anteil:** C5 zeigt die Bildschirmfotos als reguläre Folie. Als Anhang liegen E1–E6 versteckt hinter dem Schluss, falls in der Fragerunde jemand die Vorschau sehen will.
- **Bei etwa 3 Minuten entfallen:** C2, C4 und C6. Es bleiben C1, C3, C5, C7, C8 und C9, zusammen ca. 3:20.

| Nr. | Titel | Spricht | Dauer |
|---|---|---|---|
| C1 | Wir suchen einen Fall in Dortmund | Feyrouz | 25 s |
| C2 | Zwei Fristen entscheiden, ob ein Bauteil weitergegeben wird | Feyrouz | 40 s |
| C3 | Wir fragen nach vier Zeitpunkten | Feyrouz | 35 s |
| C4 | Im fiktiven Fall lagen die vier Zeitpunkte so | Feyrouz | 40 s |
| C5 | Die Plattform prüft die Zeit und nennt den nächsten Schritt | Houssam | 40 s |
| C6 | Zielgruppe und Abgrenzung | Feyrouz | 35 s |
| C7 | Wer zahlen könnte, ist eine Hypothese (G-GM) | Feyrouz | 30 s |
| C8 | Der Praxistest in Dortmund ist klein und hat ein beobachtbares Signal | Houssam | 40 s |
| C9 | Unsere Bitte | Feyrouz, Schlusssatz Houssam | 30 s |

Summe: 25 + 40 + 35 + 40 + 40 + 35 + 30 + 40 + 30 = 315 s, das sind 5:15.

**C1 · Wir suchen einen Fall in Dortmund** (Titelfolie, Dunkelgrün)
- Inhalt: „CircularFlow · INNOSPRINT 20.11.2026 · Houssam Taleb, Feyrouz Chahed“.
- Visuell: Eine leere Zeitleiste mit vier Markern in Weiß auf Grün.
- Spricht: Feyrouz, 25 s.
- Beleg: PB (LA „Pilotversuch in Dortmund“, „idealerweise ein Praxispartner“), HY.
- Sprechtext: „Wir sind Feyrouz und Houssam, ein studentisches Team, und das ist CircularFlow. Wir haben eine Idee, eine Simulation und eine Frage. Die Frage lautet: Wann erfährt die zuständige Person, dass ein Bauteil frei wird, und reicht die Zeit bis zur Entscheidung? Dafür suchen wir heute einen echten Fall in Dortmund. Einen Partner oder Kunden haben wir bisher nicht.“ (ca. 62 Wörter)

**C2 · Zwei Fristen entscheiden, ob ein Bauteil weitergegeben wird**
- Inhalt:
  - Karte 1, Bedarfsseite: Bis zur Bestellfrist muss Ersatz bestellt werden.
  - Karte 2, Angebotsseite: Verkauf „in der Regel bis kurz vor Veröffentlichung der Rückbauausschreibung“ (Concular-Handlungsempfehlung, Stand 12/2024, PDF-S. 38).
  - Dortmund: BLB NRW, 02.12.2024, UB TU Dortmund: „Rückbau erst, nachdem alle demontierbaren Baustoffe vollständig ausgebaut wurden“.
- Visuell: Zwei Fristenkarten und eine Zitatkarte „BLB NRW“. Die Quelle steht jeweils unter der Karte.
- Chips: Herstellerangabe (Karte 2), Hypothese (Aussage „Wissen kommt oft spät“).
- Spricht: Feyrouz, 40 s.
- Beleg: Die Verkaufsfrist ist HA (FA §6). Das BLB-Zitat ist PB und belegt nur die Reihenfolge „erst ausbauen, dann abbrechen“, nicht einen Vermittlungserfolg (FA §6). „Wissen kommt oft spät“ ist HY (LA „häufig erst dann erkannt“, nicht belegt).
- Fußzeile: „FA §6 (Concular 12/2024; BLB NRW 02.12.2024)“.
- Sprechtext: „Wiederverwendung hat Fristen auf zwei Seiten. Wer ein Bauteil braucht, muss bis zu einem Tag Ersatz bestellen. Wer ausbaut, muss laut Concular-Leitfaden Bauprodukte in der Regel bis kurz vor der Rückbauausschreibung verkaufen. In Dortmund wurde bei der Universitätsbibliothek erst ausgebaut und dann abgebrochen, das schreibt der BLB NRW. Ob und wo es knapp wird, wissen wir nicht. Unsere Vermutung: Das Wissen darüber kommt oft spät.“ (ca. 82 Wörter)

**C3 · Wir fragen nach vier Zeitpunkten**
- Inhalt: Vier Marker mit den Fragen:
  1. Wann wurde das Angebot bekannt?
  2. Wann erreichte es die zuständige Person?
  3. Bis wann musste sie entscheiden?
  4. Wann war die Übergabe möglich?
- Visuell: Die Zeitleiste als Hauptmotiv. Zwischen Marker 2 und 3 steht der Text „Reicht die Zeit für eine Prüfung?“.
- Chip: Hypothese (Arbeitsannahme).
- Spricht: Feyrouz, 35 s.
- Beleg: PB (RP „Fallnotiz“ mit vier Zeitpunkten), HY.
- Fußzeile: „RP“.
- Sprechtext: „Statt Bauchgefühl wollen wir vier Zeitpunkte getrennt erfassen. Erstens: Wann wurde das Angebot auf der abgebenden Seite bekannt? Zweitens: Wann erreichte es die zuständige Person? Drittens: Bis wann musste diese Person entscheiden? Viertens: Wann war die Übergabe möglich? Bleibt zwischen dem zweiten und dritten Zeitpunkt weniger Zeit, als eine Prüfung braucht, kommt das Angebot zu spät. Das ist unsere Arbeitsannahme.“ (ca. 72 Wörter)

**C4 · Im fiktiven Fall lagen die vier Zeitpunkte so**
- Inhalt: Tabelle mit den vier Zeitpunkten für Variante 1 (rechtzeitig) und Variante 2 (nach der Ersatzbestellung):

| Zeitpunkt | Variante 1 | Variante 2 |
|---|---|---|
| Angebot bekannt | 19.01.2027 | 19.01.2027 |
| erreicht die Planung | 20.01.2027 | 22.02.2027 |
| entscheiden bis | 19.02.2027 (Prüfbitte spätestens 05.02.2027) | 19.02.2027 (Prüfbitte spätestens 05.02.2027) |
| Übergabe möglich | 08.03.2027, 6 Stk | für BD-24 keine |

  Dazu die Anmerkung „Annahme: 14 Tage Mindestprüfzeit“.
- Visuell: Die Tabelle, daneben eine kleine Version von `pilot-abgleich-t13-bd24.jpg` mit der Unterschrift „Stichtag 18.11.2026: 79 Tage vor der Bestellfrist, entspannt“.
- Chips: Fiktiver Pilotfall, Simulation, Annahme, unbestätigt.
- Spricht: Feyrouz, 40 s.
- Beleg: SI/PB (FA §5, Tabelle „Drei Varianten“). Das Bild ist BF und zeigt den Demo-Stichtag, nicht 2027.
- Fußzeile: „FA §5“.
- Sprechtext: „Unser fiktiver Fall mit zwölf Türen aus Haus Lindenhof zeigt das. Variante eins: Das Angebot wird am 19. Januar bekannt und erreicht die Planung am 20. Januar. Entscheiden muss sie bis zum 19. Februar, die Übergabe ginge am 8. März. Variante zwei: Es erreicht sie erst am 22. Februar. Dann ist die Ersatzbestellung raus, und für diesen Bedarf gibt es keine Übergabe. Mit 14 Tagen Prüfzeit war der letzte Tag der 5. Februar. Alles ist simuliert.“ (ca. 88 Wörter)

**C5 · Die Plattform prüft die Zeit und nennt den nächsten Schritt**
- Inhalt: Drei Bildschirmfotos nebeneinander mit Bildunterschriften:
  - „8 Paare, 2 prüfbar“
  - „Zu spät: 5 Tage nach der Bestellfrist“
  - „Weiter prüfen: 123 Tage davor“
- Visuell: `k2-paarliste.jpg`, `k3-zu-spaet.jpg` und `k4-weiter-pruefen.jpg`, als Ausschnitte auf das Ergebnis zugeschnitten. Das ist der dauerhafte Ersatz für die Demo.
- Chips: Beispieldaten, Simulation, Vorschlag zur Prüfung, keine Freigabe.
- Spricht: Houssam, 40 s.
- Beleg: BF (Bilder, PA).
- Fußzeile: „PA; Bildschirmfotos Fassung 2 (Code 2121b92)“.
- Sprechtext: „So sieht die Prüfung in unserer Vorschau aus, hier als Bildschirmfotos mit Beispieldaten. Links die Liste: acht Paare, zwei prüfbar. In der Mitte ein Paar, das zu spät ist: Prüfende fünf Tage nach der Bestellfrist, Prüfbitte gesperrt, der Grund steht daneben. Rechts ein Paar, das passt: weiter prüfen. Das ist ein Vorschlag zur Prüfung, keine Freigabe. Das Fachergebnis ist ein Eintrag in der Simulation. Die Vorschau zeigen wir gern im Anschluss.“ (ca. 82 Wörter)

**C6 · Zielgruppe und Abgrenzung**
- Inhalt:
  - Zielgruppe (Hypothese): Planung und Bauleitung auf der Bedarfsseite, Eigentümer und Einrichtungen auf der Angebotsseite.
  - Andere Plattformen vermitteln Angebot und Gesuch (Concular Exchange laut Anbieter, Madaster Match laut Dokumentation).
  - Unsere Frage: Reicht die Zeit für eine fachliche Prüfung?
- Visuell: Zwei Spalten „Wer hat das Problem?“ und „Was gibt es schon?“.
- Chips: Hypothese, Herstellerangabe.
- Spricht: Feyrouz, 35 s.
- Beleg: HY (PB „Rollenannahme kein Praxisbefund“, LA), HA (RP, FA §6).
- Fußzeile: „PB; LA; RP; FA §6“.
- Sprechtext: „Wer hat das Problem? Unsere Hypothese: Planung und Bauleitung auf der Bedarfsseite, dazu Eigentümer und Einrichtungen, die ausbauen lassen. Das ist eine Rollenannahme, kein Praxisbefund. Andere Plattformen vermitteln Angebot und Gesuch, Concular Exchange laut Anbieter, Madaster Match laut Dokumentation. Da gibt es eine Überschneidung. Wir fragen zusätzlich, ob die Zeit für eine fachliche Prüfung reicht. Ob das im Alltag fehlt, ist offen.“ (ca. 75 Wörter)

**C7 · Geschäftsmodell.** Siehe G-GM. Feyrouz, 30 s.

**C8 · Der Praxistest in Dortmund ist klein und hat ein beobachtbares Signal**
- Inhalt:
  - Schritt 1: einen Fall mit einer zuständigen Person entlang der vier Zeitpunkte rekonstruieren.
  - Schritt 2: Mindestprüfzeit klären (bestätigt oder ersetzt die 14 Tage).
  - Schritt 3: Angebotskarte zeigen, zuerst ohne Erklärung. Frage: „Welchen nächsten Schritt wählen Sie, und warum?“
  - Signal: ein konkreter, vor der Frist machbarer Schritt und eine plausible Quelle für die frühere Information.
  - Grenze: Ein Einzelfall belegt weder Markt noch Wirkung.
- Visuell: Drei Schritte als Ablaufband über der Zeitleiste, rechts der Kasten „Signal“.
- Chips: Annahme, unbestätigt (14 Tage), Vorschlag.
- Spricht: Houssam, 40 s.
- Beleg: PB (RP „Kleinster Versuch“ und „Auswertung“, FA §11), EV (Zuschnitt des Tests).
- Fußzeile: „RP; FA §11“.
- Sprechtext: „Unser kleinster Test: Mit einer zuständigen Person rekonstruieren wir einen echten Fall entlang der vier Zeitpunkte und klären die Mindestprüfzeit. Dann zeigen wir eine Angebotskarte, zunächst ohne Erklärung, und fragen: Welchen nächsten Schritt würden Sie wählen, und warum? Ein gutes Signal wäre ein konkreter Schritt, der vor der Frist machbar war, und eine plausible Quelle für die frühere Information. Ein Einzelfall belegt weder einen Markt noch die Wirkung einer Software.“ (ca. 82 Wörter)

**C9 · Unsere Bitte** (Schlussfolie, Dunkelgrün)
- Titel als Aussage: **Wer einen Fall kennt, an dem Bauteile vor dem Umbau frei wurden, hilft uns am meisten**
- Inhalt: Die Bitte in einem Satz, die Namen Houssam Taleb und Feyrouz Chahed und die Zeile „Simulation · Beispieldaten · fiktiver Pilotfall“.
- Visuell: Die Zeitleiste mit vier Markern in Weiß, der erste Marker hervorgehoben.
- Chips: Simulation, Beispieldaten, Fiktiver Pilotfall.
- Spricht: Feyrouz, Schlusssatz Houssam, 30 s.
- Beleg: EV (Bitte ans Publikum).
- Sprechtext: „Unsere Bitte: Wenn Sie in Planung, Bauleitung oder bei einem Eigentümer einen Fall kennen, bei dem Türen, Wände oder Böden vor einem Umbau frei wurden, sprechen Sie uns nach dem Pitch an. Wir bringen eine kurze Fallvorlage mit. Wir haben keinen Partner und keine Kunden, nur eine Simulation und eine klare Frage. Danke.“ (ca. 60 Wörter)

**Anhang C:** E1–E6, versteckt hinter C9, siehe Abschnitt 1.1.

---

## 5. Pflichtinhalte je Fassung

| Pflichtinhalt | Fassung A | Fassung B | Fassung C |
|---|---|---|---|
| Problem | A2 und A3 | B1 (kurz), B4 | C2, C3, C4 |
| Zielgruppe | A2 (Hypothese), A5 | B5 | C6 |
| Nutzen der Plattform | A5, A5-kurz | B5, B3 | C5 |
| Mögliches Geschäftsmodell (Hypothese, ohne Preise) | A6 (G-GM) | B6 (G-GM) | C7 (G-GM) |
| Nächster Praxistest | A7 (G-PT) | B7 (G-PT) | C8 und C9 |
| Kennzeichnung fiktiver Pilotfall, Beispieldaten, Annahme, Hypothese, Simulation | auf allen betroffenen Folien als Chip | auf allen betroffenen Folien als Chip | auf allen betroffenen Folien als Chip |
| Demo oder Ersatzfolien | Live-Demo A4 mit E1–E6 als Ersatz | Live-Demo B2 mit E1–E6 als Ersatz | keine Live-Demo, Bilder in C5, E1–E6 im Anhang |
| Abgrenzung zu Concular und Madaster (Herstellerangabe, Überschneidung benannt) | A5 | B5 | C6 |

---

## 6. Empfehlung: Fassung A „Empfohlen zur Abgabe“

**Meine Kriterien** (eigene Kriterien, keine Jurykriterien):

| Kriterium | A | B | C |
|---|---|---|---|
| 1. Verständlichkeit in kurzer Zeit | gut: Fall, dann Regel | mittel: Begriffe wie „Paar“ und „Prüfbitte“ kommen ohne Vorwissen | gut |
| 2. Ehrlicher Belegstand | gut, die eigene Lücke wird genannt | gut | sehr gut: Der Praxisbeleg wird ausdrücklich gesucht |
| 3. Demo-Risiko | mittel: Demo in der Mitte, Ersatz liegt bereit | hoch: Demo schon bei Sekunde 25 | niedrig: keine Live-Demo |
| 4. Vollständigkeit der Pflichtinhalte | vollständig | vollständig | vollständig |
| 5. Zeigt die gebaute Plattform | ja, live | ja, am meisten | nur als Bilder |

Die Zeilen sind meine Einschätzung, nicht gemessen.

**Begründung für A:**
- Der Fall liefert in etwa zwei Minuten die Begriffe (Bestellfrist, Mindestprüfzeit). Danach braucht die Demo kaum Erklärung.
- Der Aha-Moment („5. Februar, nicht 19.“) steht vor der Demo und hängt nicht an ihr. Fällt die Demo aus, bleibt die Kernaussage erhalten.
- Alle Pflichtinhalte sind abgedeckt, und die Fassung nennt die eigene Lücke („Warnung erst ab 13.02.“) ehrlich.
- Das Demo-Risiko liegt in der Mitte und ist über die Ersatzfolien abgefangen.

**Rückfalloption:** Zeigt die Generalprobe auf dem Vortragsrechner, dass die Vorschau nicht verlässlich läuft, ist C die sichere Alternative. Sie nutzt dieselben Bilder und denselben Fall, ohne Neubau. Die Entscheidung liegt beim Team.

**Kennzeichnung:** „Empfohlen zur Abgabe“ steht im Dateinamen (`…_Fassung-A_Empfohlen-zur-Abgabe.pptx` und `.pdf`) und im Übergabetext an die Hauptsitzung, nicht auf einer Folie vor der Jury.

---

## 7. Offene Punkte, Risiken und Jury-Fragen

### 7.1 Zahlen und Fundstellen

- **8 Paare, 2 prüfbar, 2 Vorgänge:** PA „Vorbereitung“, Schritt 2; `k1-uebersicht.jpg` (8, davon 2 prüfbar, 2 Vorgänge).
- **2 weiter prüfen, 0 knapp, 4 Angaben fehlen, 0 Klärung nötig, 2 zu spät:** `k2-paarliste.jpg`.
- **9 Positionen in 90 Tagen:** `k1-uebersicht.jpg`.
- **TW-01 → BD-23, Prüfende 02.12.2026, 5 Tage nach der Bestellfrist 27.11.2026:** PA K3 und `k3-zu-spaet.jpg`. 14 Tage Prüfzeit laut PV2 §6.
- **TW-05 → BD-22, Prüfende 28.11.2026, 123 Tage vor 31.03.2027:** `k4-weiter-pruefen.jpg`. 10 Tage Prüfzeit laut PV2 §6.
- **Reserve 58 Tage, 7,9 km (Lage symbolisch):** `k2-paarliste.jpg`, PA K4, PV2 §9.
- **12 Türen = 4 + 2 + 6, BD-24 mit 6 Stk, Bestellfrist 19.02.2027, 14 Tage:** FA §2 A3–A5, §3.
- **Angebot bekannt 19.01.2027, erreicht Planung 20.01.2027 (Variante 1) oder 22.02.2027 (Variante 2):** FA §2 A8–A9, §5.
- **Prüfbitte spätestens 05.02.2027, ab 06.02.2027 zu spät, Warnung unter „Zeitkritisch“ ab 13.02.2027 (Samstag):** FA §1, §5.
- **Ausbau 01.–05.03.2027, Annahmefenster 08.–12.03.2027, Übergabe 08.03.2027:** FA §2 A6/A7/A11.
- **41 Tage Vorlauf (19.01. bis 01.03.2027):** FA §6.
- **79 Tage am Stichtag 18.11.2026 (Prüfende 02.12.2026):** `pilot-abgleich-t13-bd24.jpg`, FA §4 Schritt 6. Das ist nicht der 2027-Fall.
- **Madaster empfiehlt für Rückbauprojekte mindestens vier bis fünf Monate Vorlauf (Herstellerangabe, anderer Fall):** FA §6. Das ist nicht auf den Folien. Ich nutze es nur in den Antworten unten.

### 7.2 Mögliche Jury-Fragen mit belegten Antworten

**1. Was ist neu gegenüber Concular und Madaster?**
- Die Überschneidung beim Abgleich ist real (RP: „Wir bringen Angebot und Bedarf zusammen“ reicht nicht als Abgrenzung).
- Unser Unterschied ist die Frage, ob die Zeit bis zur Bestellentscheidung für eine fachliche Prüfung reicht, und der nächste menschliche Schritt.
- Beobachtung: In der gelesenen Madaster-Match-Dokumentation stehen keine Bestellfrist und keine Prüfzeit auf der Suchseite (FA §6). Das beweist nicht, dass das Produkt es nicht kann. Wir haben keines der beiden Produkte bedient.
- Eine Alternative wäre die Zusammenarbeit mit bestehenden Plattformen.

**2. Habt ihr Kunden oder einen Praxispartner?**
- Nein. Es gibt keine Interviews, keine Partner und keine Zusagen.
- Der Pilotfall ist fiktiv und quellenbasiert (FA Kopf). Dafür gibt es den nächsten Praxistest.

**3. Woher kommen die 14 Tage Mindestprüfzeit?**
- Es ist eine Annahme (FA A5). Die gelesenen Concular-Unterlagen nennen keine Mindestprüfzeiten (FA §6).
- Bei Brandschutztüren nennen die Quellen nicht, wie lange Brandprüfung und Zustimmung dauern.
- Der offene Prüfauftrag steht in FA §11: eine dokumentierte Angabe mit Quelle aus einem realen Projekt.

**4. Spart das Geld oder CO₂?**
- Wir nennen keine Zahlen. Die Übersicht zeigt bewusst keine Kosten-, CO₂- oder Abfallwerte, weil Daten fehlen (PA K1).
- Einsparungen lassen sich erst aus einer nachvollziehbaren Vergleichsrechnung ableiten (RP).
- Die „bis zu 30 % günstiger“-Angabe aus dem Concular-Leitfaden hat keine Bezugsgröße und keine Quelle und wird nicht verwendet (FA §6).

**5. Wer haftet, was ist mit Brandschutz?**
- Es gibt keine Fachfreigabe in der Plattform. Fachleute entscheiden, wir bereiten die Entscheidung vor (LA, PV2 §3).
- Laut Concular braucht eine Innentür ohne Schutzanforderung keinen Verwendbarkeitsnachweis. Mit Brandschutzanforderung braucht es derzeit eine Zustimmung im Einzelfall. Das sind Herstellerangaben, keine Rechtsberatung (FA §6).
- Der Pilot nimmt an, dass am Zielort keine Brand-, Rauch- oder Schallschutzanforderung gilt (A13). Das gilt als Annahme.

**6. Was ist mit einer Teilmenge, etwa 5 von 6 Türen?**
- Die Plattform kann eine Teilmenge vormerken, verfolgt die Restmenge aber nicht (FA §5 Variante 3). Das ist ein bekannter Befund.
- Die sichtbare Restmenge steht als Plan in `docs/plan-restmenge.md`, nach dem Pitch. Es ist nicht umgesetzt und nicht freigegeben.

**7. Was ist der Unterschied zwischen Aufmaßfrist und Bestellfrist?**
- Die Bestellfrist im Abgleich entspricht der Ersatzentscheidungsfrist am Bedarf (PV2 §3). Die Aufmaßfrist gehört zur Tür- und Bodenregel.
- Auf `k1` stehen beide Begriffe aus dem Türbeispiel. Der Abgleich der Fassung 2 nutzt die Aufmaßfrist nicht.

### 7.3 Offene Punkte und Risiken

1. **Pitchdauer, Dateiformat und Einreichungsweg sind nicht belegt** (VA nennt keines davon). Die Sprechzeiten sind Schätzungen mit 2,3 Wörtern pro Sekunde. Jede Fassung braucht einen Probelauf mit Stoppuhr.
2. **Vorschau und Vortragsrechner sind nicht geprüft.** Die Vorschau wurde auf claude.ai selbst nicht im Browser geöffnet (PA „Nicht geprüft“). Über die öffentliche Freigabe entscheidet das Team nach der Generalprobe (PV2 §11). Netz im Reinoldinum ist unbekannt. Ohne Netz fehlt die Straßenkarte, die Demo bleibt aber nutzbar (PA „Wenn etwas hakt“).
3. **Datumseingabe nicht geprüft:** Der Hauptablauf braucht sie nicht, und der Stichtag ist eine Auswahl. Die Vormerkung wird bewusst nicht vorgeführt (PA).
4. **Pilotdaten sind nicht im Demo-Profil.** Sie würden die Startbedingung (8 Paare, 2 prüfbar, 2 Vorgänge) verändern (FA §8). Die Pilotbilder stammen aus einem eigenen Profil. Ihre Beschriftung sagt das, und die Sprechtexte trennen Pilotfall und Demo.
5. **Stichtag gegen Vortragstag:** Die Bilder zeigen Mi 18.11., 14:00, der Pitch ist am Fr 20.11. Die Folien sagen „gewählter Zeitpunkt in der Simulation, nicht das heutige Datum“.
6. **Die eigene Lücke öffentlich nennen:** Fassung A sagt „Das ist eine Lücke in unserer Plattform“ (Warnung erst ab 13.02.). Das ist ehrlich und belegt (FA §1). Ob das Team sie öffentlich nennen will, ist eine Entscheidung des Teams.
7. **Nicht angesehene Bilder und Zuschnitte:** Ich habe fünf Bilder nicht angesehen (Abschnitt 0). `k5-vorgang`, `pilot-pass-angaben` und `pilot-scan-karte` sind Ausschnitte mit kleinerer Auflösung. cf-entwicklung prüft die Lesbarkeit auf der Folie.
8. **Namen auf Bildern:** `k6` zeigt „J. Neumann, Architekturbüro (fiktiv)“. Der Hinweis „fiktiv“ steht im Bild, und ich würde das Bild unverändert lassen.
9. **Die Bitte ans Publikum (C9 und G-PT) ist eine externe Ansprache.** Ein Versprechen zum Umgang mit Falldaten habe ich bewusst weggelassen. Das Team entscheidet, ob es einen Satz dazu sagen will (Datenschutz R10 in `docs/claude-vor-entwicklung.md`).
10. **Produktbrief v0.2 und Fassung 2:** Fassung 2 geht über den Brief hinaus und bleibt als Demo-Entwurf gekennzeichnet (PV2 §9 Frage 5 ist offen).
11. **Herstellerangaben:** Concular Exchange stammt aus dem RP und wurde am 08.11.2026 von ChatGPT geöffnet, nicht erneut geprüft. Die Madaster-Match-Seite wurde am 16.11.2026 gelesen und nicht bedient. Die Folien sagen „laut Anbieter“ oder „laut Dokumentation“.
12. **Weitere offene Punkte:** Die Zahl der Bestandstests ist nicht Teil der Folien und wird nicht genannt. Wenn die Hauptsitzung Prüfzahlen einblenden will (190 von 190, 28 von 28 laut PV2 §10/§11), gelten sie nur für die dort genannten Commits und nur bis zu der dort festgehaltenen Prüfung.

### 7.4 Fragen an das Team mit Vorschlag

1. **Welche Fassung wird abgegeben?** Vorschlag: A (Abschnitt 6), mit C als Rückfall.
2. **Sollen die Ersatzfolien in der Abgabedatei stehen?** Vorschlag: PPTX mit versteckten Folien, im PDF als Anhang. Begründung: Das PDF bleibt ohne Anhang knapp, und die Jury kann die Demo im Anhang nachlesen. Das ist reversibel.
3. **Darf die Bitte ans Publikum in der Abgabe stehen?** Vorschlag: ja, aber ohne Datenschutzversprechen, bis das Team es festlegt.
4. **Wer bedient die Demo, wer hat die Uhr?** Vorschlag: Houssam bedient, Feyrouz hat die Uhr (Rollen laut LA: Houssam Technik).
5. **Soll die Vorschau bei Ausfall lokal gestartet werden (`python3 -m http.server`)?** Vorschlag: nur als zweiter Weg. Der Ersatz bleibt immer die Bildfolie, und der Code ändert sich bis zum Pitch nur mit ausdrücklicher Zustimmung (PA).
6. **Darf die Fußzeile „Quelle: …“ in jeder Folie stehen?** Vorschlag: ja, klein, grau, ein bis zwei Kürzel.

### 7.5 Gestaltungshinweise für cf-entwicklung

- Die Statuskette und die Zeitleiste sind die wiederkehrenden Motive. Jede Folie hat ein visuelles Element.
- Titel und Schlussfolien in Dunkelgrün `#0E5546`, Inhalt in Weiß, Schrift Arial. Keine Akzentlinien unter Titeln und keine Farbbalken.
- Bildschirmfotos werden auf das Ergebnis zugeschnitten und nicht als ganze Seite gezeigt. Das Original bleibt als `E`-Folie vollständig.
- Die Chips „Beispieldaten“, „Simulation“ und „Fiktiver Pilotfall“ bleiben auf jeder betroffenen Folie sichtbar.
- Die Datei und die Fußzeilen tragen nur die Quellenkürzel aus Abschnitt 0.

## Relevante Dateien

- `/home/user/CircularFlow/docs/pitch-ablauf.md`
- `/home/user/CircularFlow/docs/plattform-v2.md`
- `/home/user/CircularFlow/docs/pilot/CF-PILOT-01-fallakte.md`
- `/home/user/CircularFlow/docs/plan-restmenge.md`
- `/home/user/CircularFlow/docs/produktbrief.md`
- `/home/user/CircularFlow/plattform/README.md`
- `/home/user/CircularFlow/pitch/innosprint-2026/bilder/` (die 14 Bildschirmfotos)
- `/tmp/claude-0/-home-user-CircularFlow/abdce38b-a89c-5699-959f-aeaffcbb39fc/scratchpad/quellen-pitch/01-veranstalter-teilnahmebedingungen.md`
- `/tmp/claude-0/-home-user-CircularFlow/abdce38b-a89c-5699-959f-aeaffcbb39fc/scratchpad/quellen-pitch/02-team-loesungsansatz.md`
- `/tmp/claude-0/-home-user-CircularFlow/abdce38b-a89c-5699-959f-aeaffcbb39fc/scratchpad/quellen-pitch/03-team-rechercheplan-auszug.md`

Dieser Plan ist ein Entwurf zur Prüfung und Freigabe durch das Team.
