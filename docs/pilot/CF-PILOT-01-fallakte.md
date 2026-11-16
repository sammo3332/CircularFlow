# CF-PILOT-01 · Zwölf Bürotüren vor dem Umbau

Fiktiver, quellenbasierter Pilotfall mit Fallakte und Simulation des Ablaufs.

| | |
|---|---|
| Dokumentversion | 1.2 vom 16.11.2026: Innentüren und Nachweise präzisiert, Vorgaben des Teams vom 16.11.2026 eingetragen. Fassung 1.0 steht in `1f6656f`, Fassung 1.1 (Befunde der unabhängigen Prüfung) in `9e595a4`. |
| Branch | `codex/plattform-v1` |
| Ausgangscommit | `daa40a9` (Fassung 2, festgehaltener Pitch-Stand). Der Anwendungscode ist seit `2121b92` unverändert. |
| Maßgeblich | Produktbrief v0.2 (`docs/produktbrief.md`). Diese Fallakte ist eine Simulation. Sie erweitert den Produktumfang nicht. |
| Unverändert | Anwendungscode (`plattform/`, `prototype/`), Pitch-Stand (`docs/pitch-ablauf.md`), Freigabe der Vorschau |
| Pitch-Stand | bleibt festgehalten: Vorschau Version 2 (Versions-ID `1794826502-00b9`), Code `2121b92` |
| Dateien | diese Fallakte, die Nachrechnung [`cf-pilot-01-simulation.mjs`](cf-pilot-01-simulation.mjs) und der Plan für die Zeit nach dem Pitch [`../plan-restmenge.md`](../plan-restmenge.md) |

Alle Namen, Daten, Mengen und Rollen sind Simulationsannahmen. Es wurde niemand kontaktiert. Es gibt keine Kosten- oder
CO₂-Zahlen.

## 0. Auftrag

- **Nutzerproblem:** Vor einem Umbau werden Türen ausgebaut. Ein anderes Projekt könnte sie brauchen, muss seine
  Ersatzbestellung aber bis zu einem festen Tag auslösen. Erreicht das Angebot die zuständige Planung zu spät, wird
  neu bestellt. Dann werden die alten Türen entsorgt, obwohl sie gepasst hätten.
- **Gewünschtes Ergebnis:** Eine Fallakte zeigt den Ablauf in acht Schritten, jeweils mit Person, App, Vorgängen vor
  Ort und Auslöser für den nächsten Schritt. Für bedienbare Schritte gibt es einen Klickpfad in Fassung 2. Drei
  Varianten mit denselben Basisdaten halten je vier Zeitpunkte fest. Die Quellen sind mit Status eingeordnet.
- **Ausgeschlossen:**
  - neue Implementierung und Änderungen am Anwendungscode,
  - Pitch-Stand und Freigabe,
  - echte Kontakte, Kosten- und CO₂-Werte,
  - eine Fachfreigabe.
- **Akzeptanzkriterien:**
  1. Jeder der acht Schritte nennt Person, App, Vorgänge vor Ort, Auslöser und Stand (bedienbar, simuliert, fehlt).
  2. Bedienbare Schritte haben einen Klickpfad.
  3. Beim Scan sind vorgeschlagene, gemessene und fachlich bestätigte Werte getrennt.
  4. Jede Variante nennt: Angebot bekannt, erreicht die Planung, Entscheidung bis, Übergabe möglich.
  5. Jede Quelle trägt einen Status und trennt Belegtes von Offenem.
  6. Es gibt eine Demo mit zwei Momenten und eine kleinste Erweiterung.
  7. Die Nachrechnung läuft mit dem unveränderten Fachkern ohne Fehler, die bestehenden Tests bleiben grün.

## 1. Ergebnis in Kürze

**Fassung 2 trägt den Pilot von der Erfassung bis „Übergabe geplant“.** Diese Schritte sind in der Oberfläche
bedienbar. Außerhalb der App bleiben die Abstimmung mit dem Eigentümer, die Unterlagen, der Kostenvergleich sowie
Ausbau, Transport und Einbau. Wichtigste Einschränkung: Alles ist simuliert. Die Quellen belegen den Ablauf nur in
Teilen. Fristen, Prüfzeit und Zuständigkeiten müsste ein reales Projekt erst bestätigen.

Zwei Befunde aus der Nachrechnung:

1. **Der letzte Tag ist der 05.02.2027, nicht der 19.02.2027.** Bei 14 Tagen Mindestprüfzeit ist eine Prüfbitte nur
   bis zur Bestellfrist minus 14 Tage möglich. Ab 06.02.2027 meldet der Abgleich „Für diese Entscheidung zu spät“.
   Die Übersicht zeigt die Bestellfrist unter „Zeitkritisch (7 Tage)“ aber erst ab 13.02.2027. Das ist acht Tage
   nach dem letzten möglichen Prüfbeginn.
2. **Nach einer Vormerkung von 5 Stück ist die sechste Tür unsichtbar.** Der Bedarf gilt dann als belegt. Er fehlt in
   der Paarliste, bei den offenen Bedarfen und unter „Zeitkritisch“. Ein zweites Türangebot wäre am Tag der
   Vormerkung noch prüfbar, die Prüfbitte dafür ist aber gesperrt. Die Menge gilt weiter als „gedeckt“, weil der
   Fachkern die Menge des Bauteils zählt und nicht die Vormerkung. Dass eine Tür neu bestellt werden muss, steht nur
   in der Notiz zum Fachergebnis.

**Nach dem Pitch (Vorgabe des Teams vom 16.11.2026):**

1. Zuerst die sichtbare Restmenge: „6 benötigt, 5 unverbindlich vorgemerkt, 1 offen“. Die Bestellfrist für die offene
   Tür bleibt sichtbar.
2. Als nächster Schritt der zweite Vorgang für die Restmenge.

Der Plan steht in [`docs/plan-restmenge.md`](../plan-restmenge.md). Umgesetzt ist nichts davon. Die Frist „Prüfbitte
spätestens“ bleibt ein späterer Kandidat (Abschnitt 9).

## 2. Annahmen

Alle Annahmen sind reversibel. Ein reales Projekt ersetzt sie durch eigene Werte.

| Nr. | Annahme | Wert in der Simulation |
|---|---|---|
| A1 | Gebäude mit den zwölf Türen | Haus Lindenhof (LH) aus den Beispieldaten, Räume 1.02, 1.04 und 1.06 |
| A2 | Bedarfsprojekt | „Umbau am Kanal“ (UAK), Umbau, Stadtbezirk Innenstadt-Nord, Lage symbolisch (Bezirksmitte) |
| A3 | Bedarf | BD-24 „Bürotüren 1. OG“, 6 Stk, angelegt 11.01.2027, zuständig Planung |
| A4 | Ersatzbestellung | Bestellfrist 19.02.2027 (Vorgabe des Auftrags) |
| A5 | Mindestprüfzeit | 14 Tage. Simulationsannahme, nicht belegt. Sie bleibt so gekennzeichnet, bis das Team einen konkreten Praxisfall besprochen hat. |
| A6 | Ausbau und Verfügbarkeit | Ausbau 01.–05.03.2027 (Vorgabe), „verfügbar ab“ 05.03.2027 |
| A7 | Annahmefenster | 08.–12.03.2027 (Vorgabe) |
| A8 | Begehung und Erfassung | 19.01.2027, 15:00. Ab dann ist das Angebot bekannt. |
| A9 | Planung erreicht das Angebot | V1 und V3: 20.01.2027, 09:00; V2: 22.02.2027, 09:00 |
| A10 | Probeausbau einer Mustertür (V3) | 02.02.2027; Fachergebnis am Prüfende 03.02.2027 |
| A11 | Vormerkung und Übergabeplanung | 04.02.2027; Übergabe am 08.03.2027, erster Tag des Annahmefensters |
| A12 | Zwischenlagerung | 05.–08.03.2027 (3 Tage), Ort offen |
| A13 | Schutzanforderungen | Am Zielort gilt keine Brand-, Rauch- oder Schallschutzanforderung. Die Türen in LH tragen keine Kennzeichnung; das ist eine Beobachtung, kein Nachweis. Was gilt, wenn das nicht stimmt, steht in Abschnitt 6 unter „Innentüren und Nachweise“. |
| A14 | Sechs Angebotstüren | gleichartig, als eine Position mit Menge 6 (LH · T-13, Raum 1.04) |
| A15 | Rollen | Planung, Bauleitung, Montagebetrieb und Fachprüfung sind die fiktiven Rollen der App. Der Eigentümer kommt dazu, er ist nicht in der App. |
| A16 | Stichtag | Die Oberfläche zeigt Mi 18.11.2026, 14:00. Die Zeitpunkte 2027 rechnet die Nachrechnung mit demselben Fachkern. |
| A17 | Zählweise | Alle Fristen zählen in Kalendertagen, wie im Fachkern. Wochenenden und Feiertage sind nicht berücksichtigt. |

„Erreicht die Planung“ heißt hier: Die zuständige Planung öffnet das Paar im Abgleich. Fassung 2 benachrichtigt
niemanden.

## 3. Ausgangsdaten: zwölf Türen

| Gruppe | Anzahl | Raum | Ziel | In Fassung 2 |
|---|---|---|---|---|
| Interne Verwendung | 4 | 1.02 (Beispiel) | Zielöffnungen im selben Gebäude | Eine Tür ist beispielhaft erfasst und der Öffnung B-04 zugeordnet, mit einer eigenen Entscheidung. Frei sind nur B-04 und B-07, denn B-02 gehört zum Türbeispiel E-01. Für zwei der vier Türen gibt es also kein Ziel, und neue Zielöffnungen lassen sich nicht anlegen. |
| Offener Zustand oder Nachweis | 2 | 1.06 | offen | erfasst mit Menge 2, Zustand C und der Notiz „Zarge verzogen, Kennzeichnung unklar“. Der Pass nennt die offenen Nachweise. |
| Vorläufiges Angebot | 6 | 1.04 | Bedarf UAK · BD-24 | erfasst als LH · T-13, Menge 6 |

Die Pilotdaten liegen in der Demo neben den Beispieldaten. Übersicht und Paarliste zählen beide.

## 4. Ablauf in acht Schritten

Stand je Schritt: **bedienbar** heißt, die Oberfläche von Fassung 2 kann es. **Simuliert** heißt, die App zeigt es nur
als Simulation oder Eintrag. **Fehlt** heißt, Fassung 2 hat dafür nichts. Feldnamen und Knöpfe stehen in **Fettdruck**
wie auf dem Bildschirm, ohne Zusätze wie „(Pflicht)“.

Die Nummern der Entscheidungen hängen von der Reihenfolge ab, denn die App zählt sie in Haus Lindenhof fortlaufend.
In einem frischen Profil sind E-01 und E-02 schon belegt. Im Browserlauf kam die Prüfbitte (Schritt 7) vor der
internen Zuordnung (Schritt 5). Deshalb wurde die Prüfbitte E-03 und die interne Zuordnung E-04. Wer in der
Reihenfolge dieser Akte klickt, bekommt die Nummern umgekehrt.

### Schritt 1 · Abstimmung mit Eigentümer und Bauleitung

- **Wer:** Eigentümer von Haus Lindenhof, Bauleitung LH und Planung UAK.
- **In der App:** LH steht als Projekt mit Phase, „Ausbau ab“ und Gebäude in der Liste. Das Bedarfsprojekt UAK wird
  als eigenes Projekt erfasst.
- **Vor Ort oder außerhalb:**
  - Klären, ob ausgebaut und weitergegeben werden darf.
  - Wer überträgt das Eigentum und wer haftet? Die Handlungsempfehlung von Concular nennt dafür eine
    Übergabevereinbarung (Abschnitt 6).
  - Zugang zur Baustelle und Fristen bis zur Rückbauausschreibung festlegen.
  - Ansprechpersonen benennen.
- **Auslöser für Schritt 2:** Der Eigentümer stimmt Begehung und Erfassung zu.
- **Klickpfad:**
  1. Navigation **Projekte**, Liste: **Umbau Haus Lindenhof**. Die Projektseite zeigt „Ausbau ab 25.11.2026“ aus
     den Beispieldaten.
  2. Bedarfsprojekt: **Projekte**, dann Reiter **Projekt erfassen**:
     - **Name** „Umbau am Kanal“
     - **Art der Maßnahme** „Umbau“
     - **Stadtbezirk** „Innenstadt-Nord“
     - **Entscheidung bis** 19.02.2027
     - **Etagen** 2, **Räume je Etage** 4
  3. **Projekt speichern**. Ergebnis: Kürzel UAK mit dem Chip „Eigene Eingabe“.
- **Stand:** Projekt erfassen ist bedienbar.
  - **Fehlt:** Zustimmung, Protokoll und Vereinbarung. Vorhandene Projekte lassen sich nicht bearbeiten, „Ausbau ab“
    von LH bleibt also beim Beispielwert.
  - Rollen gibt es nur als fiktive Rollen, nicht als Personen je Projekt.

### Schritt 2 · Unterlagen und Zugang klären

- **Wer:** Bauleitung LH und Eigentümer (Bestandsunterlagen).
- **In der App:** Der Grundriss von LH hat eine IFC-Vorprüfung. Sie liest die Datei nur im Browser. Sie zeigt das
  Schema und zählt Geschosse (IfcBuildingStorey), Räume (IfcSpace) und Türen (IfcDoor).
- **Vor Ort oder außerhalb:** Bestandspläne, Türliste und Brandschutzplan beschaffen. Klären, welche Türen
  Anforderungen haben, und das Schadstoffgutachten einholen. Schlüssel und Begehungstermin abstimmen.
- **Auslöser für Schritt 3:** Der Termin steht. Die Unterlagen liegen vor, oder die Lücke ist benannt.
- **Klickpfad:**
  1. **Projekte**, dann **Umbau Haus Lindenhof**, dann **Grundriss öffnen**.
  2. Bei **IFC-Datei vorprüfen** eine IFC-Datei wählen.
  3. Ergebnis im Test: „Schema IFC4“ mit der Zahl der Geschosse, Räume und Türen.
- **Stand:**
  - **Bedienbar:** die IFC-Vorprüfung.
  - **Simuliert:** der Import. Maße aus IfcDoor würden nur als „vorgeschlagen“ übernommen.
  - **Fehlt:** Ablage für Unterlagen (Pläne, Türliste, Gutachten) und ein Import aus Excel oder CSV.

### Schritt 3 · Begehung, Fotos, Scan und manuelles Aufmaß

- **Wer:** Bauleitung LH erfasst, der Montagebetrieb misst.
- **In der App:** Die mobile Erfassung führt in fünf Schritten zum Bauteil:
  1. Ort
  2. Foto
  3. Bauteil (Gruppe, Menge, „verfügbar ab“, Zustand)
  4. Angaben (Werte mit Status)
  5. Prüfen und Speichern
- **Vor Ort oder außerhalb:** Türen nummerieren und fotografieren. Türblatt, Zarge, Wandstärke und Anschlag aufnehmen,
  Schäden notieren.
- **Auslöser für Schritt 4:** Das Bauteil ist gespeichert. Damit gibt es einen Bauteilpass.
- **Klickpfad, sechs Angebotstüren:**
  1. Navigation **Erfassen**, **Projekt** „LH“, **Raum** „1.04“, **Weiter**.
  2. Im Fotoschritt ein Foto wählen. Der Kasten „Erkennung · Simulation“ schlägt eine Innentür vor.
  3. **Weiter**. Gruppe **Innentür**, **Menge in Stk** 6, **Verfügbar ab** 05.03.2027, Zustand **B**
     (Gebrauchsspuren). „Verfügbar ab“ ist mit 25.11.2026 aus den Beispieldaten vorbelegt und muss geändert werden.
  4. **Weiter**, dann die Werte eintragen:
     - **Türblattbreite** 860 eintippen.
     - Bei **Türblatthöhe** und **Zarge** jeweils **Vorschlag übernehmen**.
     - **Anschlag** „DIN links“ und **Schutzkennzeichnung** „keine Kennzeichnung gefunden“ wählen.
     - **Türblatt** bleibt Vorschlag.
  5. **Weiter**, **Speichern**. Ergebnis: „LH · T-13 gespeichert“.
- **Klickpfad, zwei Türen mit offenen Fragen:**
  1. **Erfassen**, „LH“, Raum „1.06“, **Weiter**, ohne Foto **Weiter**.
  2. **Innentür**, Menge 2, Verfügbar ab 05.03.2027, Zustand **C**, **Notiz zum Zustand** „Zarge verzogen,
     Kennzeichnung unklar“.
  3. **Weiter**, Türblattbreite 860, **Weiter**, **Speichern**.
- **Klickpfad, Scan:** **Projekte**, **Umbau Haus Lindenhof**, **Grundriss öffnen**, **Beispielscan simulieren**.
  Ergebnis: „Öffnung B-04, Breite 884 mm · vorgeschlagen“.
- **Stand:**
  - **Bedienbar:** Erfassung und manuelles Aufmaß.
  - **Simuliert:** die Bilderkennung („keine echte Bildanalyse“) und der Raumscan.
  - **Fehlt:** Einzelnummern je Tür innerhalb einer Position.

**Wertstatus beim Scan und beim Aufmaß**

| Stufe | Bedeutung in Fassung 2 | Beispiel im Pilot | Zählt für die Türregel |
|---|---|---|---|
| vorgeschlagen | „Schätzung oder simulierte Erkennung, nicht geprüft“ | Türblatt „Holzwerkstoff“; Scan: Öffnung B-04, 884 mm | nein |
| gemessen | „vor Ort gemessen“ | Türblattbreite 860 mm, eingetippt | ja, nur gemessene Maße |
| bestätigt | „aus Unterlage übernommen oder von einer Person geprüft, nicht gemessen“ | Türblatthöhe 1985 mm und Zarge (Vorschlag übernommen); Anschlag und Schutzkennzeichnung (gewählt, Quelle „Eingabe vor Ort“) | nein, nicht als Maß |
| fachlich bestätigt | gibt es nicht als Wertstatus | nur das Fachergebnis, gekennzeichnet „laut Eintrag (Simulation), keine Fachfreigabe“ | – |

Das Scanmaß bleibt „vorgeschlagen“. Erst ein Aufmaß an der Messstelle laut P-04 macht es zu „gemessen“. „Bestätigt“
heißt in Fassung 2 nur: Eine Person hat den Wert eingetragen oder übernommen. Es heißt nicht „fachlich geprüft“.
„Keine Kennzeichnung gefunden“ beweist nicht, dass eine Tür keine Brandschutztür ist. Das klärt die Fachprüfung.

### Schritt 4 · Bauteilpass

- **Wer:** Die Bauleitung LH pflegt den Pass. Planung UAK und Fachprüfung lesen ihn.
- **In der App:** Der Abschnitt „Angaben“ zeigt je Feld Wert, Status und Quelle. Dazu kommen „Bedarfe derselben
  Gruppe“, offene Nachweise und der Verlauf.
- **Vor Ort oder außerhalb:** Türblatt und Zarge physisch kennzeichnen und zusammenhalten.
- **Auslöser für Schritt 5:** Der Pass nennt passende Bedarfe oder interne Ziele.
- **Klickpfad:** nach dem Speichern **Bauteilpass öffnen**, oder Navigation **Bauteile** und dann LH · T-13.
  - Unter „Bedarfe derselben Gruppe“ steht UAK · BD-24 mit „Weiter prüfen“.
  - Außerdem steht dort SB · BD-21 mit „Angaben fehlen“.
- **Stand:**
  - **Bedienbar:** der Pass.
  - **Fehlt:** Die Menge lässt sich nach dem Speichern nicht ändern (wichtig für Variante 3). Es gibt keine
    Dokumente am Pass.
  - **Passt nicht zum Pilot:** Als „Nächste Handlung“ nennt der Pass die Frist aus den Beispieldaten von LH,
    „Entscheidung vor Ausbau Di 24.11., 12:00“. Sie lässt sich nicht ändern, weil vorhandene Projekte nicht
    bearbeitbar sind (Schritt 1).

### Schritt 5 · Interne Verwendung und externe Vermittlung

- **Wer:** Planung LH (intern) und Planung UAK (extern), dazu die Bauleitung LH.
- **In der App:**
  - Intern: Eine Tür wird einer Zielöffnung im selben Gebäude zugeordnet. Die Türregel nennt den nächsten Schritt.
  - Extern: Der Abgleich zeigt Bedarfe anderer Projekte derselben Gruppe.
- **Vor Ort oder außerhalb:** Zuerst intern verteilen, den Rest extern anbieten. Diese Reihenfolge empfiehlt auch
  Concular (Abschnitt 6).
- **Auslöser für Schritt 6:** Die internen Ziele sind vergeben oder verworfen. Der Rest wird als Angebot geführt.
- **Klickpfad intern:**
  1. **Erfassen**, „LH“, Raum „1.02“, **Weiter**, **Weiter**.
  2. **Innentür**, Menge 1, Verfügbar ab 01.03.2027.
  3. **Weiter**, Türblattbreite 860 und Türblatthöhe 1985 eintippen, **Weiter**, **Speichern**.
  4. **Bauteilpass öffnen**, **Ziel zuordnen**, „Öffnung B-04“ wählen, **Zuordnen und Entscheidung anlegen**.
  5. **Entscheidung E-04 öffnen** (die Nummer hängt von der Reihenfolge ab, siehe oben). Nächster Schritt:
     „Rohbauöffnung B-04 an der Messstelle laut P-04 messen oder ein verwertbares Aufmaß nachreichen“.
- **Klickpfad extern:** Bauteilpass LH · T-13, unter „Bedarfe derselben Gruppe“ die Zeile UAK · BD-24. Sie führt
  zur Abgleichseite (Schritt 6).
- **Stand:**
  - **Bedienbar:** interne Zuordnung (zwei freie Zielöffnungen) und externer Abgleich.
  - **Fehlt:** eine Sichtbarkeit je Kreis (Projekt, Eigentümer, alle) und neue Zielöffnungen.
  - **Empfehlung, keine Regel:** „Erst intern, dann extern“ bleibt eine Empfehlung an die Beteiligten (Vorgabe vom
    16.11.2026). Die App erzwingt die Reihenfolge nicht, der Abgleich zeigt alle Bedarfe sofort.
  - Es wird nichts versendet.

### Schritt 6 · Bedarf und Fristen abgleichen

- **Wer:** Die Planung UAK legt den Bedarf an und liest den Abgleich. Die Bauleitung LH verantwortet „verfügbar ab“.
- **In der App:** Der Abgleich vergleicht für ein Paar vier Dinge:
  - Gruppe und Einheit,
  - Menge,
  - Zeit: Prüfbeginn, Prüfende, Bestellfrist, frühester Übergabetag und Annahmefenster,
  - Entfernung.
  Maße und Anforderungen vergleicht er nicht.
- **Vor Ort oder außerhalb:** Die Planung UAK prüft am Pass, ob Maße, Anschlag und Anforderungen grob passen.
- **Auslöser für Schritt 7:** Das Ergebnis lautet „Weiter prüfen“ oder „Knapp“. Bei „zu spät“ geht es nicht weiter
  (Variante 2).
- **Klickpfad:**
  1. Navigation **Bedarfe**, **Bedarf erfassen**, dann ausfüllen:
     - **Projekt** UAK, **Bauteilgruppe** Innentüren, **Titel** „Bürotüren 1. OG“, **Menge** 6
     - **Bestellfrist** 19.02.2027, **Mindestprüfzeit in Tagen** 14
     - **Annahmefenster von** 08.03.2027, **Annahmefenster bis** 12.03.2027
     - **Anforderungen** (Text), **Zuständig (Rolle)** Planung
  2. **Speichern**. Ergebnis: BD-24.
  3. Zum Paar: auf der Bedarfsseite unter „Angebote derselben Gruppe“ die Zeile LH · T-13. Oder **Übersicht**,
     Kachel **Paare derselben Gruppe**, Zeile T-13 → BD-24.
- **Was die Oberfläche am Demo-Stichtag 18.11.2026 zeigt:**
  - „Weiter prüfen“ und „Vorschlag zur Prüfung, keine fachliche Freigabe“
  - „Prüfende 02.12.2026 liegt 79 Tage vor der Bestellfrist 19.02.2027.“
  - „Frühester Übergabetag 05.03.2027; im Annahmefenster 08.03.2027 bis 12.03.2027 bleiben ab 08.03.2027 5 Tage für
    die Übergabe.“
  - Prüfpunkt „Zwischenlagerung klären: 3 Tage zwischen dem frühesten Übergabetag 05.03.2027 und dem Beginn des
    Annahmefensters 08.03.2027.“
  - „ca. 3,1 km Luftlinie (Lage symbolisch)“

  Die Werte für Januar und Februar 2027 stehen in Abschnitt 5.
- **Stand:**
  - **Bedienbar:** Bedarf und Abgleich.
  - **Fehlt:** Benachrichtigung der zuständigen Planung (bewusst: es wird nichts versendet) und eine Frist für den
    spätesten Prüfbeginn (Abschnitt 9).

### Schritt 7 · Fachprüfung und Kostenvergleich

- **Wer:** Fachprüfung (Sachverständige oder Fachplanung), Planung UAK, Montagebetrieb für den Probeausbau.
- **In der App:** Die Prüfbitte legt einen Vorgang an. Das Fachergebnis wird als Eintrag erfasst. Die Checkliste
  „Was ist zu klären“ nennt unter anderem Ausbau, Transport und Lager sowie Wirtschaftlichkeit, ohne Zahlen.
- **Vor Ort oder außerhalb:**
  - Probeausbau einer Mustertür: zerstörungsfrei möglich? Zustand danach?
  - Prüfung von Zustand, Maßen, Beschlägen und Zarge.
  - Anforderungen am Zielort mit Brandschutzkonzept und Fachplanung klären:
    - Ohne Schutzanforderung ist für Innentüren laut Concular kein Verwendbarkeitsnachweis erforderlich.
    - Mit Brandschutzanforderung braucht es laut Concular derzeit eine Zustimmung im Einzelfall.
    - Einzelheiten und Grenzen stehen in Abschnitt 6 unter „Innentüren und Nachweise“.
  - Zustand, Funktion und Passung prüft die Fachprüfung in jedem Fall. Kein Verwendbarkeitsnachweis heißt nicht
    ungeprüft.
- **Kostenvergleich** außerhalb der App, mit gleichem Leistungsumfang auf beiden Seiten:
  - Wiederverwendung: Ausbau, Schutz, Transport, Zwischenlager, Aufarbeitung, Anpassung, Einbau, Abnahme,
    Gewährleistung.
  - Neukauf: Lieferung, Einbau, Abnahme.
  - Auf der Seite von LH entfallen bei Weitergabe Entsorgungskosten.
  - Wer welche Kosten trägt, regelt der Vertrag. Zahlen gibt es in dieser Akte keine.
- **Auslöser für Schritt 8:** Das Fachergebnis ist eingetragen, und die Planung entscheidet sich vor der
  Bestellfrist für die Wiederverwendung.
- **Klickpfad:**
  1. Auf der Abgleichseite **Prüfbitte anlegen**. Ergebnis: ein Vorgang (im Browserlauf E-03) im Status „Prüfbitte
     gestellt“.
  2. Formular **Fachergebnis eintragen**: Ergebnis „bedingt geeignet“ (Variante 3) oder „geeignet“ (Variante 1),
     **Name der Fachperson** (z. B. „Fachplanung Türen (Beispiel)“), **Notiz** (bei „bedingt“ Pflicht, z. B.
     „Probeausbau: eine Tür beschädigt, 5 von 6 verwendbar“).
  3. **Fachergebnis eintragen**. Ergebnis: „Bedingt geeignet (laut Eintrag)“ mit „laut Eintrag (Simulation), keine
     Fachfreigabe“. Darunter steht die Checkliste „Was ist zu klären“.
- **Stand:**
  - **Bedienbar als Eintrag (simuliert):** Prüfbitte und Fachergebnis.
  - **Fehlt bewusst:** der Kostenvergleich (nur ein Checklistenpunkt ohne Zahlen).
  - **Fehlt:** Unterlagen der Prüfung (Protokoll, Fotos des Probeausbaus).

### Schritt 8 · Ausbau, Transport, Übergabe und dokumentierter Einbau

- **Wer:** Rückbau- oder Montagebetrieb, Bauleitung LH, Bauleitung UAK, Transport.
- **In der App:**
  - Vormerkung (unverbindlich),
  - Übergabe geplant mit Termin, Ort und Rolle,
  - Übergabe eingetragen. Das geht nur bis zum Stichtag, deshalb in der Oberfläche nicht für 2027.
- **Vor Ort oder außerhalb:**
  - Ausbau vom 01. bis 05.03.2027. Der Zugang ist mit dem Rückbauunternehmen vereinbart.
  - Türblatt und Zarge zusammen kennzeichnen und schützen.
  - Transport und Zwischenlager vom 05. bis 08.03.2027.
  - Übergabe am 08.03.2027 mit Protokoll und Eigentumsübergang.
  - Einbau, Abnahme und Dokumentation.
- **Auslöser:** Mit dem Eintrag der Übergabe endet der Vorgang in der App. Der Einbau folgt außerhalb.
- **Klickpfad:**
  1. Auf der Entscheidungsseite Formular **Vormerken**: **Menge in Stk** 5 (Variante 3) oder 6 (Variante 1),
     **Vormerkung gilt bis** 12.03.2027, Knopf **Vormerken**. Ergebnis: „Vorgemerkt (Simulation)“.
  2. Formular **Übergabe planen**: **Termin** 08.03.2027, **Ort der Übergabe** „Anlieferung Umbau am Kanal, 1. OG“,
     **Zuständige Rolle** Bauleitung, Knopf **Übergabe planen**. Ergebnis: „Übergabe geplant am 08.03.2027“.
  3. Formular **Als übergeben eintragen**: **Übergabedatum** 08.03.2027, Knopf **Als übergeben eintragen**. Die
     Oberfläche lehnt ab: „Das Datum darf
     nicht nach dem Stichtag (18.11.2026) liegen.“ In der Nachrechnung gelingt der Schritt: „Übergeben am
     08.03.2027 (Simulation, laut Eintrag).“
- **Stand:**
  - **Bedienbar:** Vormerkung und Übergabeplanung.
  - **Nur in der Nachrechnung:** „übergeben“ im Jahr 2027.
  - **Fehlt:** Einbau dokumentieren, Übergabeprotokoll, Lagerort und Transport.

## 5. Drei Varianten mit denselben Basisdaten

Quelle der Werte: Nachrechnung mit dem unveränderten Fachkern (Abschnitt 10). Die Oberfläche lässt als Stichtag nur
18. bis 20.11.2026 zu. Neben den Beispieldaten enthält die Nachrechnung nur das Angebot LH · T-13 und den Bedarf
UAK · BD-24. Die interne Tür und die zwei Türen mit Zustand C sind nur im Browserlauf erfasst. Fristen zählen in
Kalendertagen (A17).

**Wann die Prüfbitte noch möglich ist.** Die Planung reagiert am jeweiligen Tag um 16:00.

| Planung reagiert | Ergebnis des Abgleichs | Begründung in der App |
|---|---|---|
| 19.01. bis 04.02.2027 | Weiter prüfen | am 19.01.: „Prüfende 02.02.2027 liegt 17 Tage vor der Bestellfrist 19.02.2027.“ |
| 05.02.2027 | Knapp | „Prüfende 19.02.2027 liegt am Tag der Bestellfrist 19.02.2027.“ |
| ab 06.02.2027 | Für diese Entscheidung zu spät | „Prüfende 20.02.2027 liegt 1 Tag nach der Bestellfrist 19.02.2027.“ |

Die Bestellfrist von BD-24 steht unter „Zeitkritisch (7 Tage)“ erst ab 13.02.2027 (09:00). Das gilt, solange kein
Vorgang läuft. Der 13.02.2027 ist ein Samstag, im Büro fällt die Warnung also frühestens am Montag, 15.02., auf.

| Zeitpunkt | Variante 1 · rechtzeitig | Variante 2 · nach der Ersatzbestellung | Variante 3 · Probeausbau, 5 von 6 |
|---|---|---|---|
| Angebot bekannt | 19.01.2027 | 19.01.2027 | 19.01.2027 |
| erreicht die zuständige Planung | 20.01.2027 | 22.02.2027 | 20.01.2027 |
| Planung musste entscheiden bis | 19.02.2027 (Prüfbitte spätestens 05.02.2027) | 19.02.2027 (Prüfbitte spätestens 05.02.2027) | 19.02.2027: 5 wiederverwenden, 1 neu bestellen |
| Übergabe möglich | 08.03.2027, 6 Stk | für BD-24 keine. Die Türen sind ab 05.03.2027 frei für andere Bedarfe. | 08.03.2027, 5 Stk. Die sechste Tür kommt aus der Neubestellung. |

### Variante 1 · Das Angebot erreicht die Planung rechtzeitig

- **Abgleich am 20.01.2027:** „Weiter prüfen“.
  - „Prüfende 03.02.2027 liegt 16 Tage vor der Bestellfrist 19.02.2027.“
  - „Frühester Übergabetag 05.03.2027; im Annahmefenster 08.03.2027 bis 12.03.2027 bleiben ab 08.03.2027 5 Tage für
    die Übergabe.“
- **Prüfpunkte:**
  - Zwischenlagerung klären, 3 Tage zwischen 05.03. und 08.03.2027.
  - 1 offener Nachweis: Türblatt, Vorschlag prüfen.
  - Eignung von einer Fachperson prüfen lassen.
- **Verlauf:**
  - Prüfbitte am 20.01.
  - Fachergebnis „geeignet“ am 03.02.
  - Vormerkung von 6 Stk bis 12.03. sowie Übergabe geplant für 08.03., beides am 04.02.
  - übergeben am 08.03.2027. Status „Übergeben (Simulation)“, nächster Schritt „Abgeschlossen“.
- **Außerhalb der App:** Der Ersatz wird nicht bestellt. Am 08.03. werden die Türen angeliefert und eingebaut.

### Variante 2 · Das Angebot erreicht die Planung nach der Ersatzbestellung

- **Abgleich am 22.02.2027:** „Für diese Entscheidung zu spät“, mit der Begründung „Prüfbeginn 22.02.2027 (Stichtag
  der Demo) liegt 3 Tage nach der Bestellfrist 19.02.2027.“ „Stichtag der Demo“ meint hier den Tag der Auswertung.
- **Was die App jetzt zeigt:**
  - Die Prüfbitte ist gesperrt.
  - Nächster Schritt: „Klären, ob die Bestellentscheidung noch offen ist oder ein späterer Bedarf passt“.
  - Im Bauteilpass ist die Zuordnung gesperrt: „Der Abgleich ergibt „Für diese Entscheidung zu spät“.“
  - Unter „Zeitkritisch“ steht die Bestellfrist von BD-24 als überfällig.
- **Weitere Paare für T-13:** nur SB · BD-21 mit „Angaben fehlen“.
- **Befund:** Die App hat das Angebot ab 19.01. sichtbar gemacht, als prüfbares Paar in der Übersicht. Als dringend
  markiert hat sie es nicht vor 13.02., und benachrichtigt hat sie niemanden. Der letzte mögliche Prüfbeginn
  (05.02.) erscheint nirgends als Frist.
- **Außerhalb der App:** Der Ersatz ist bestellt. Die Türen sind ab 05.03.2027 frei. Ohne weiteren Abnehmer gehen sie
  in die Rückbauausschreibung.

### Variante 3 · Beim Probeausbau fällt eine Tür aus

- Zeitlich wie Variante 1. Der Probeausbau am 02.02. beschädigt eine Tür.
- **Fachergebnis am 03.02.:** „bedingt geeignet“ mit der Notiz „Probeausbau am 02.02.2027: eine Tür beim Ausbau
  beschädigt, 5 von 6 verwendbar. Eine Tür neu bestellen.“
- **Vormerkung am 04.02.:** „Vormerkung (Simulation, unverbindlich): 5 Stk bis 12.03.2027.“
- **Stand am 15.02.2027,** vier Tage vor der Bestellfrist:
  - Vorgang „Vorgemerkt (Simulation)“, nächster Schritt „Übergabe planen“.
  - Menge im Abgleich: „gedeckt“ (Angebot 6, Bedarf 6). Der Fachkern zählt die Menge des Bauteils, nicht die
    Vormerkung.
  - BD-24 gilt als belegt. Er zählt nicht als offener Bedarf und steht nicht unter „Zeitkritisch“.
  - Vor der Prüfbitte hatte BD-24 fünf Paare: T-13 und vier Türangebote aus den Beispieldaten (KB · T-31,
    LH · T-03, LH · T-05, SL · T-41). Nach der Vormerkung sind es 0.
  - Ein zweites Angebot für die sechste Tür, etwa KB · T-31 aus den Beispieldaten, wäre am Tag der Vormerkung
    (04.02.) zeitlich noch „Weiter prüfen“. Die Prüfbitte ist aber gesperrt: „Der Bedarf gehört bereits zum laufenden
    Vorgang E-03.“
- **Übergabe:** geplant und eingetragen am 08.03.2027 mit 5 Stk.
- **Befund:** Die sechste Tür muss bis 19.02. neu bestellt werden. Das steht nur in der Notiz. Fassung 2 kann eine
  Teilmenge vormerken. Die Restmenge des Bedarfs verfolgt sie nicht.

## 6. Quellen: was sie belegen und was offen bleibt

Prüfweg: Die Seiten und PDF-Dateien wurden am 16.11.2026 mit `curl` über den Proxy dieser Arbeitsumgebung
abgerufen, in Text umgewandelt und gelesen. Zitate sind wörtlich. Die Seitenangaben sind PDF-Seiten.

| Quelle | Status | Belegt | Nicht belegt, reales Projekt muss bestätigen |
|---|---|---|---|
| **Concular, Referenz „TU Dortmund Bibliothek“**, <https://concular.de/tu-dortmund-bibliothek/>, ohne Datum | veröffentlichte Herstellerangabe | „Bevor die Universitätsbibliothek der TU Dortmund einem Neubau weicht, hat Concular im Auftrag des BLB NRW Materialien erfasst, die zirkuläre Ökobilanz erstellt und das Inventar vermittelt.“ Erfasst und auf Wiederverwendbarkeit bewertet wurden „Leuchten, Regale und Deckenelemente, aber auch Holzbänke und Hörsaalklappstühle“. „Ein großer Teil der identifizierten Materialien wurde extern vermittelt.“ | Keine Türen, Mengen, Termine, Fristen, Abnehmer, Prüfungen, Transporte oder Einbauten. Der Ablauf „erfassen, bewerten, extern vermitteln“ ist nur als Angabe des Anbieters belegt. |
| **BLB NRW, Pressemitteilung „Nachhaltiger Rückbau der Universitätsbibliothek“**, 02.12.2024, <https://www.blb.nrw.de/presse/pressemeldungen/pressedetails/nachhaltiger-rueckbau-der-universitaetsbibliothek> | Projektbeleg des Auftraggebers (öffentliche Mitteilung) | Oberirdischer Rückbau seit Ende November 2024. „Somit erfolgt der Rückbau erst, nachdem alle demontierbaren Baustoffe vollständig ausgebaut wurden.“ Mengen für Ausbau und Recycling, z. B. rund 21.000 t Stahlbeton zu Recycling-Beton. | Concular wird nicht genannt. Keine Angaben zu vermittelten Bauteilen oder Türen. Belegt ist die Reihenfolge „erst ausbauen, dann abbrechen“ in einem Dortmunder Projekt, nicht der Vermittlungserfolg. |
| **Concular, „Zirkuläres Planen und Bauen mit Fokus auf die Wiederverwendung von Bauprodukten – Handlungsempfehlung für die öffentliche Hand“**, Stand Dezember 2024, 1. Auflage, <https://concular.de/wp-content/uploads/2024/12/2024_Concular_Handlungsempfehlung_oeffentliche_Hand_Wiederverwendung.pdf> | veröffentlichte Herstellerangabe (Leitfaden eines Anbieters mit rechtlichen Ergänzungen einer Kanzlei; „keine Rechtsberatung“) | Siehe die Liste unter der Tabelle. | Keine Mindestprüfzeiten, keine Bestellfristen der Bedarfsseite, keine Dauer zwischen Angebot und Entscheidung. Dortmund wird nicht genannt, „Zarge“ und „Gewährleistung“ kommen nicht vor. Rechtsfragen sind „projektweise zu prüfen“. |
| **Madaster, „Match“** (Dokumentation, deutsch), <https://docs.madaster.com/de/de/knowledge-base/industrial-reuse.html>, „Zuletzt bearbeitet: 9. September 2026“ | veröffentlichte Herstellerangabe (Hilfeseite, nicht selbst bedient) | Siehe die Liste unter der Tabelle. | Auf der Seite fehlen: Bestellfrist oder Prüfzeit auf der Suchseite, Fachprüfung, Teilmengen nach einer Prüfung und Einbau. Wie gut das Matching in der Praxis trifft, ist nicht belegt. |
| **Madaster, „Vorbereiten einer IFC-Quelldatei“** („Zuletzt bearbeitet: 27. Oktober 2026“) und **„Madaster BIM – IFC import process“** (PDF, erstellt 08.11.2022), <https://docs.madaster.com/files/en/Madaster%20BIM%20-%20IFC%20import%20process.pdf> | veröffentlichte Herstellerangabe | „Verwenden Sie vorzugsweise das Exportformat IFC 4, alternativ IFC 2x3.“ Allen Elementen ein Material und eine Klassifizierung zuweisen (z. B. DIN 276), Basismengen exportieren. Der Import liest zuerst die Daten und verknüpft dann die Elemente über Madaster-Eigenschaften oder Suchkriterien („Matching“) mit Materialien und Produkten der Datenbanken. Die Suchkriterien laufen in fester Reihenfolge, von „Equals“ (Groß- und Kleinschreibung beachtet) bis „Ends with“. Mengen kommen aus IfcElementQuantity (z. B. NetVolume, NetArea). | „Matching“ meint dort Material gegen Datenbank, nicht Angebot gegen Bedarf. Ein Bestandsgebäude ohne Modell braucht erst ein Modell oder die Excel-Vorlage. Ob es für Haus Lindenhof ein IFC-Modell gibt, ist offen. |
| **Madaster, „Vorbereiten einer Excel-Quelldatei“** („Zuletzt bearbeitet: 22. September 2026“) und **„Madaster Action Plan“** (PDF, Version 4.0, 12.01.2022), <https://docs.madaster.com/files/be/en/Madaster%20-%20Action%20Plan.pdf> | veröffentlichte Herstellerangabe | Das Excel-Template ist die Alternative, wenn es kein BIM-Modell gibt. Es gibt ein Tabellenblatt „Rückbau“ für Elemente, die entfernt werden. Ohne die Angabe „Material/Produkt“ kann die Plattform ein Element nicht mit ihren Datenbanken verknüpfen, und eine Klassifizierung ist erforderlich. IFC- und Excel-Quelldateien werden beim Import automatisch geprüft, auf Vollständigkeit von Materialbeschreibung, Klassifizierungscode und Geometrie (Action Plan). | Wie aufwendig das Ausfüllen für zwölf Türen ist, belegen die Quellen nicht. |
| **Concular, Seite „Leitfaden zur Wiederverwendung von Brandschutztüren“**, <https://concular.de/leitfaden-brandschutztueren/>, ohne Datum | veröffentlichte Herstellerangabe (der Anbieter verkauft selbst Türen und Leistungen) | Siehe „Innentüren und Nachweise“. | Den Leitfaden selbst (PDF) haben wir nicht gelesen, nur die Seite dazu. Die Kosten- und CO₂-Angaben der Seite werden nicht übernommen. Das Verfahren in Nordrhein-Westfalen nennt die Seite nicht. |

**Belegt in der Handlungsempfehlung von Concular**, jeweils als Empfehlung des Herausgebers:

- **Reihenfolge der Verwendung:** Die „Hierarchie der Wiederverwendung“ (Abb. 5.3, PDF-Seite 31) beginnt mit der
  projektinternen Vermittlung (in-situ): „Kein Eigentumswechsel“, „keine Transportemissionen“. Es folgen die
  portfolio-interne Vermittlung, dann die externe Vermittlung „B2B, Direktvertrieb“ mit „Eigentumswechsel“ und
  „Wenige, bekannte Abnehmer“, zuletzt B2C.
- **Nachweise:** siehe unten „Innentüren und Nachweise“.
- **Prüfung und Haftung:** Das Wiederverwendungspotenzial wird im Rahmen der Bestandserfassung nach DIN SPEC 91484
  geprüft, mit „gutachterliche[r] Aussage“. Beim Einkauf „stellen die Inverkehrbringenden (Bauteilbörse, Marktplatz)
  die Gebrauchstauglichkeit sicher und haften für die Rechtskonformität“ (PDF-Seite 15).
- **Probeausbau:** „Ggf. Veranlassung von Probebergungen“ (PDF-Seite 19). Die Ergebnisse dienen „als
  Entscheidungsgrundlage für die Wiederverwendbarkeit“ (PDF-Seite 33).
- **Fristen, Ausbau, Übergabe** (PDF-Seite 38):
  - Nötig ist eine „Frist, bis zu der die Bauprodukte verkauft werden können (in der Regel bis kurz vor
    Veröffentlichung der Rückbauausschreibung)“.
  - Der Ausbau findet „in der Regel kurz vor dem Start der Rückbauarbeiten statt“. Der Zugang wird mit dem
    Rückbauunternehmen vertraglich vereinbart.
  - Eine „Übergabevereinbarung“ regelt den Eigentumsübergang.
- **Umbau:** Bauprodukte des Innenausbaus „können im gleichen Projekt wieder eingebracht werden“ (Anwendungsfall 3,
  PDF-Seite 23).
- **Kosten:** „Wiedergewonnene Bauprodukte sind in der Beschaffung bis zu 30% günstiger als Neuware“ (PDF-Seite 11).
  Die Angabe hat keine Bezugsgröße und keine Quelle. Für den Pilot wird sie nicht verwendet.

**Belegt in der Madaster-Seite „Match“**, als Angabe des Herstellers:

- **Anbieten:** Ein Match-Projekt hat Start- und Enddatum sowie temporäre Lagerorte. Produkte kommen einzeln oder per
  Excel- oder CSV-Import dazu: „Es wird kein spezielles Excel-Template benötigt!“
- **Felder:** unter anderem „Verfügbar ab“ und „Verfügbar bis“ (empfohlen), Mindestmenge, Menge, Maße, Materialien
  (optional „mit KI“ aus Zeilendaten), technischer und ästhetischer Zustand, Demontagefähigkeit, gefährliche Stoffe.
- **Sichtbarkeit:** Veröffentlichen wahlweise „nur innerhalb des Projekts, Ihres Accounts oder für alle Benutzer“.
- **Suchen:** Suchprofile mit Standortfilter und Filterregeln, E-Mail-Benachrichtigung täglich, wöchentlich oder
  monatlich.
- **Status:** Match, Interessiert, Abgelehnt, Favorisiert, Vermittelt. „Vermittlung bestätigen“ bestätigt „die
  geplante Übergabe“.
- **Rolle der Plattform:** „keine Handelsplattform, sondern eine Vermittlungsplattform“. „Vertragsabschlüsse,
  Verkauf, Logistik und Zwischenlagerung werden direkt von den beteiligten Parteien organisiert.“
- **Vorlauf:** „Für Rückbauprojekte wird ein Vorlauf von mindestens vier bis fünf Monaten empfohlen.“

**Innentüren und Nachweise**

Ob eine gebrauchte Tür einen neuen Verwendbarkeitsnachweis braucht, hängt laut Concular an ihrer Rolle im Gebäude:
„Inwiefern ein neuer Verwendbarkeitsnachweis notwendig ist, entscheidet die Bedeutung des Bauprodukts innerhalb des
Gebäudes und seine Auswirkungen auf die bauordnungsrechtlichen Anforderungen“ (Handlungsempfehlung, Kapitel 2.3.1,
PDF-Seite 14). Daraus ergeben sich drei Fälle. Alle Angaben sind veröffentlichte Herstellerangaben, und die
Handlungsempfehlung „stellt keine Rechtsberatung dar“.

| Fall | Was die Quelle sagt | Was das für den Pilot heißt |
|---|---|---|
| Innentür ohne Schutzanforderung | „Ferner ist ein Verwendbarkeitsnachweis auch nicht erforderlich, wenn das Bauprodukt eine untergeordnete Bedeutung für die Bauwerkssicherheit hat.“ Als Beispiel nennt der Text nach MVV TB 2023/1 „D 2.2.2.3 Innentüren einschließlich Zubehör“ (PDF-Seite 14; der Satz ist im PDF über zwei Spalten umbrochen). Im Entscheidungsbaum steht die Innentür als Beispiel beim Ausgang „Kein Nachweis notwendig“ (Abb. 2.3, PDF-Seite 15, sinngemäß, weil die Wörter der Abbildung im Text einzeln stehen). | Gilt für die sechs Angebotstüren nur, wenn Annahme A13 stimmt. Die Fachplanung bestätigt das am Zielort. Zustand, Funktion und Passung prüft die Fachprüfung trotzdem: Die Prüfung gehört zur Bestandserfassung nach DIN SPEC 91484, und Inverkehrbringende stellen die Gebrauchstauglichkeit sicher (PDF-Seite 15). |
| Brandschutztür (z. B. T30) | Brandschutz gehört zu den Schutzzielen, für die sicherheitsrelevante Bauprodukte sorgen (PDF-Seite 14). „Zur Verwendung von sicherheitsrelevanten wiedergewonnenen Bauprodukten ist in der Regel ein neuer Verwendbarkeitsnachweis“ zu beantragen, genannt sind abZ, abP und ZiE (PDF-Seite 15). Laut Conculars Seite zum Leitfaden für Brandschutztüren verliert eine Tür beim Ausbau „in der Regel ihren Verwendbarkeitsnachweis und ihr Ü-Zeichen bzw. ihre CE-Kennzeichnung“. Eine Zustimmung im Einzelfall braucht es „Derzeit ja, für Innen- wie für Außentüren.“ Und: „Eine PÜZ-Stelle begutachtet, je Modell wird eine Tür brandgeprüft. Die oberste Bauaufsicht erteilt die ZiE.“ | Nicht Teil des Pilots (A13). Wäre eine der Türen eine Brandschutztür, oder bräuchte der Zielort eine, trüge die Simulation nicht. Wie lange Brandprüfung und Zustimmung dauern, nennen die gelesenen Quellen nicht. Dass 14 Tage Prüfzeit dafür reichen, ist nicht belegt. |
| Tür mit Schallschutzanforderung | Schallschutz steht unter den Schutzzielen (PDF-Seite 14). An anderer Stelle nennt der Text Schallschutz eine Komfortanforderung, die „zukünftig im Gebäudetyp-E gemeinsam mit den Planenden vereinbart und reduziert werden“ kann (PDF-Seite 15). Das ist ein Ausblick, kein geltendes Recht. | Ob eine Schallschutzanforderung an eine Bürotür einen Nachweis auslöst, beantworten die Quellen nicht eindeutig. Das klärt die Fachplanung. |

Offen bleibt:

- **MVV TB:** Den Wortlaut der MVV TB haben wir nicht gelesen. Ob der Eintrag D 2.2.2.3 Ausnahmen nennt, ist offen.
- **Zarge:** Ob „Zubehör“ die Zarge umfasst, sagt die Handlungsempfehlung nicht.
- **Andere Bundesländer:** Für Baden-Württemberg nennt die Seite Einzelheiten, etwa eine Zustimmung für mehrere
  vergleichbare Fälle. Wie Nordrhein-Westfalen verfährt, sagen die gelesenen Quellen nicht.
- **Ausbau als Änderung:** Ob schon der Ausbau eine wesentliche Änderung ist, nennt die Seite selbst
  „Auslegungssache“.
- **Rauchschutztüren** erwähnt die Seite nur als Angebot im eigenen Shop, ohne eigenes Verfahren.
- **In der App:** „keine Kennzeichnung gefunden“ ist eine Beobachtung vor Ort mit dem Status „bestätigt“. Sie beweist
  nicht, dass eine Tür keine Brand- oder Rauchschutztür ist. Fassung 2 speichert keine Nachweise. Das Fachergebnis
  ist ein Eintrag, kein Nachweis.

**Was die Quellen für den Pilot bedeuten**

- Der Vorlauf im Pilot ist kurz. Vom bekannten Angebot (19.01.2027) bis zum Ausbau (01.03.2027) sind es 41 Tage, also
  etwa sechs Wochen. Madaster empfiehlt mindestens vier bis fünf Monate. Variante 2 ist deshalb kein Randfall.
- „Erst intern, dann extern“ stützen Concular (Hierarchie) und Madaster (Sichtbarkeit je Kreis). Die Reihenfolge
  bleibt eine Empfehlung an die Beteiligten, keine Regel der App (Vorgabe vom 16.11.2026).
- Für Innentüren ohne Schutzanforderung ist laut Concular kein Verwendbarkeitsnachweis erforderlich. Für
  Brandschutztüren braucht es laut Concular derzeit eine Zustimmung im Einzelfall. Bevor Variante 1 gilt, bestätigt
  die Fachplanung die Anforderungen am Zielort, und die Fachprüfung bestätigt Zustand und Passung.

**Was ein reales Projekt bestätigen müsste**

1. Zustimmung des Eigentümers, Übergabevereinbarung, Eigentumsübergang und Haftung.
2. Die tatsächliche Bestellfrist und Lieferzeit der Ersatztüren, und ob 14 Tage Prüfzeit reichen.
3. Anforderungen am Zielort laut Brandschutzkonzept und Fachplanung: Brand-, Rauch- und Schallschutz,
   Barrierefreiheit. Dazu, ob Türen in LH eine Zulassung oder Kennzeichnung haben. Bei Brandschutztüren außerdem
   Verfahren und Dauer einer Zustimmung im Einzelfall in Nordrhein-Westfalen.
4. Maße der Öffnungen am Zielort, Wandstärke und Anschlag je Öffnung.
5. Ob der Ausbau zerstörungsfrei gelingt (Probeausbau) und wie viele Türen ausfallen.
6. Zwischenlager, Versicherung, Transport und der Termin im Annahmefenster.
7. Kosten beider Wege mit gleichem Leistungsumfang, und wer welche Kosten trägt.
8. Gewährleistung und Abnahme beim Wiedereinbau.
9. Wie der Einbau dokumentiert wird.

## 7. Abdeckung in Fassung 2

| Schritt | Bedienbar | Nur simuliert oder als Eintrag | Fehlt |
|---|---|---|---|
| 1 Abstimmung | Projekt erfassen | – | Zustimmung, Vereinbarung, Projektdaten bearbeiten, Personen je Projekt |
| 2 Unterlagen | IFC-Vorprüfung | IFC-Import | Ablage für Unterlagen, Excel- oder CSV-Import |
| 3 Begehung | Erfassung, manuelles Aufmaß, Wertstatus | Bilderkennung, Raumscan | Einzelnummern je Tür in einer Position |
| 4 Bauteilpass | Pass mit Angaben, offenen Nachweisen, Paaren | – | Menge nachträglich ändern, Dokumente am Pass, eine Frist passend zum Pilot (der Pass nennt die Frist von LH aus den Beispieldaten) |
| 5 Intern und extern | Zuordnung zu zwei freien Zielöffnungen, Abgleich | – | Sichtbarkeit je Kreis, neue Zielöffnungen. „Erst intern, dann extern“ bleibt eine Empfehlung, keine Regel der App. |
| 6 Abgleich | Bedarf, Fristen, Abgleich, Zeitkritisch | – | Benachrichtigung, Frist „Prüfbitte spätestens“ |
| 7 Fachprüfung | Prüfbitte, Checkliste | Fachergebnis (laut Eintrag) | Kostenvergleich (bewusst), Prüfunterlagen |
| 8 Übergabe | Vormerkung, Übergabe geplant | „übergeben“ (nur Nachrechnung) | Einbau, Protokoll, Lager und Transport, Restmenge nach Teil-Vormerkung (geplant, siehe `docs/plan-restmenge.md`) |

## 8. Kurze Demo: die zwei stärksten Momente

Dauer etwa drei Minuten. **Nicht im Browserprofil der Generalprobe vorbereiten.** Die Pilotdaten ändern die
Startbedingung des Pitches (8 Paare, davon 2 prüfbar, 2 Vorgänge). Im Test stand die Übersicht danach bei 9 Paaren
und 4 Vorgängen.

**Vorbereitung** in einem eigenen frischen Profil: Projekt UAK (Schritt 1), Bedarf BD-24 (Schritt 6) und die sechs
Türen (Schritt 3) vorab eintragen. Datumsfelder vorher am Vortragsrechner ausprobieren, denn die Reihenfolge von Tag,
Monat und Jahr hängt von der Sprache des Browsers ab. Die Ausgabe der Nachrechnung als Folie oder Ausdruck
bereithalten.

**Moment 1: „Der letzte Tag ist der 5. Februar, nicht der 19.“ (Zeit)**

1. Navigation **Übersicht**, Kachel **Paare derselben Gruppe**, Zeile T-13 → BD-24. Zu sehen sind „Weiter prüfen“,
   das Prüfende vor der Bestellfrist, der früheste Übergabetag 05.03.2027 und der Prüfpunkt „Zwischenlagerung klären:
   3 Tage“.
2. Satz dazu: „Heute, im November, ist das entspannt. Entscheidend ist der Tag, an dem die Planung das Angebot sieht.“
3. Die Tabelle aus Abschnitt 5 zeigen. Bis 04.02. heißt es „Weiter prüfen“, am 05.02. „Knapp“, ab 06.02. „Zu spät“.
   Am 22.02. lautet die Begründung „Prüfbeginn 22.02.2027 … liegt 3 Tage nach der Bestellfrist 19.02.2027.“ Die
   Prüfbitte ist gesperrt.

**Moment 2: „Was gemessen ist und was nur vorgeschlagen.“ (Vertrauen)**

1. **Bauteile**, dann LH · T-13, Abschnitt „Angaben“: 860 mm „gemessen“, 1985 mm „bestätigt“ (Vorschlag von Hand
   geprüft), Türblatt „vorgeschlagen“.
2. **Projekte**, **Umbau Haus Lindenhof**, **Grundriss öffnen**, **Beispielscan simulieren**: „Öffnung B-04, Breite
   884 mm · vorgeschlagen“. Satz dazu: „Ein Scan oder Foto liefert Vorschläge. Für die Türregel zählt nur, was gemessen
   ist.“
3. Optional: Abgleich T-13 → BD-24, **Prüfbitte anlegen**, Fachergebnis „bedingt geeignet“ mit „5 von 6
   verwendbar“. Die Anzeige lautet „laut Eintrag (Simulation), keine Fachfreigabe“.

**Sätze, die stimmen:**

- „Die Daten sind fiktiv.“
- „Die Zeitpunkte 2027 sind mit demselben Fachkern nachgerechnet.“
- „Es wird nichts versendet.“
- „Ob 14 Tage Prüfzeit reichen, muss ein reales Projekt bestätigen.“

## 9. Erweiterungen nach dem Pitch (geplant, nicht umgesetzt)

**Reihenfolge laut Auftrag vom 16.11.2026**

1. **Sichtbare Restmenge.** Nach einer Teil-Vormerkung zeigt die App „6 benötigt, 5 unverbindlich vorgemerkt,
   1 offen“. Die Bestellfrist für die offene Tür bleibt sichtbar: auf der Bedarfsseite, auf der Entscheidungsseite
   und unter „Zeitkritisch“.
2. **Zweiter Vorgang für die Restmenge** als nächster Schritt. Für die offene Menge lässt sich ein weiteres Angebot
   abgleichen und prüfen. Die Vormerkung ist auf die offene Menge begrenzt.

Den Plan mit Verhalten, Ausschluss, Akzeptanzkriterien und den betroffenen Stellen im Code enthält
[`docs/plan-restmenge.md`](../plan-restmenge.md). Beides kommt erst nach dem Pitch und erst, wenn das Team den Umfang
freigegeben hat.

**Weitere Kandidaten (nicht priorisiert)**

- **Frist „Prüfbitte spätestens“** (Variante 2):
  - Die Frist ist Bestellfrist minus Mindestprüfzeit. Sie gilt für Bedarfe ohne laufenden Vorgang mit mindestens
    einem prüfbaren Paar.
  - Mit den Pilotdaten stünde „Prüfbitte spätestens 05.02.2027 · BD-24“ ab Samstag, 30.01.2027 unter
    „Zeitkritisch“. Das folgt derselben Sieben-Tage-Regel wie die Bestellfrist.
  - Ab 06.02.2027 ist das Paar „zu spät“.
  - Der Aufwand ist klein. Der Produktbrief v0.2 nennt diese Frist nicht.
- **Einbau dokumentieren** (Schritt 8): ein Schritt nach „übergeben“ mit Datum, Ort und Foto. Er ist wichtig für den
  Nachweis, aber nicht zeitkritisch.

## 10. Prüfungen

**Codezustand:** Ausgangscommit `daa40a9`. `git diff --name-only daa40a9 -- plattform prototype` ergibt keine Datei.
Alle Prüfungen liefen also mit dem Anwendungscode von `daa40a9`, der seit `2121b92` unverändert ist. Neu sind nur die
Dateien unter `docs/pilot/`. Fassung 1.0 dieser Akte steht in `1f6656f`.

| Prüfung | Befehl | Ergebnis |
|---|---|---|
| Nachrechnung | `node docs/pilot/cf-pilot-01-simulation.mjs` | „Alle erwarteten Ergebnisse eingetreten.“ Exit-Code 0, erneut ausgeführt für Fassung 1.1 und 1.2. Das Skript bricht ab, wenn ein erwarteter Wert abweicht. |
| Bestehende Tests | `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs` | 190 von 190 bestanden |
| Klickpfade im Browser | Playwright-Skript in Chromium, 1440 × 900, lokaler Server (`python3 -m http.server`), Stichtag Mi 18.11.2026, 14:00, zwei frische Kontexte | 30 von 30 bestanden, ohne Fehler in Konsole und Netz. Zweimal ausgeführt, vor und nach dem Schreiben der Akte. |
| Unabhängige Prüfung | Agent cf-review, nur lesend, auf Fassung 1.0 | kein blockierender und kein hoher Befund. Die 3 mittleren und 4 geringen Punkte sind in Fassung 1.1 eingearbeitet. |

Die unabhängige Prüfung hat die Zitate aus der Mitteilung des BLB NRW und aus den Madaster-Unterlagen zu IFC, Excel
und Action Plan nicht gegen den Text gelesen. Diese Zitate wurden beim Schreiben mit dem abgerufenen Text verglichen,
aber nicht unabhängig geprüft.

Für Fassung 1.2 haben sich nur Dokumente geändert. Nachrechnung und Tests liefen erneut. Den Browserlauf haben wir
nicht wiederholt, weil der Anwendungscode gleich geblieben ist.

Was das Browserskript prüft:

- Schritte 1, 3, 4, 5, 6, 7 und 8 in den Varianten „bedingt“ (5 von 6) und „geeignet“ (6 von 6),
- die zwei Türen mit offenen Fragen und die interne Zuordnung zu B-04,
- IFC-Vorprüfung und Beispielscan,
- die Ablehnung von „übergeben“ für 08.03.2027.

Datumsfelder setzte das Skript als ISO-Datum, ohne Tastatureingabe. Das Skript liegt nur in der Arbeitsumgebung,
nicht im Repository.

**Nicht geprüft:**

- die Vorschau auf claude.ai (kein Browserzugang von hier),
- die Datumseingabe per Tastatur auf einem deutschen Rechner,
- Safari, Firefox, echte Geräte und Bildschirmleser,
- die Funktionen von Concular und Madaster selbst (nur Dokumentation gelesen),
- jede Aussage über Praxiswirkung, Zeitersparnis oder Kosten.

## 11. Übergabe

- **Stand:** 16.11.2026, Dokumentversion 1.2, Branch `codex/plattform-v1`, Ausgangscommit `daa40a9`.
- **Gelesene Quellen und Prüfweg:** siehe Abschnitt 6. Abgerufen am 16.11.2026 mit `curl` über den Proxy der
  Arbeitsumgebung, nur die Hosts concular.de, www.blb.nrw.de, docs.madaster.com und madaster.com. Für Fassung 1.2 kam
  Conculars Seite zum Leitfaden für Brandschutztüren dazu.
- **Ergebnis:**
  - Fassung 2 bildet den Pilot bis „Übergabe geplant“ bedienbar ab.
  - Zwei Lücken sind belegt: der fehlende späteste Prüfbeginn (Variante 2) und die unsichtbare Restmenge nach einer
    Teil-Vormerkung (Variante 3).
  - Die Aussage zu Innentüren und Nachweisen ist in Abschnitt 6 nach drei Fällen getrennt.
- **Auftrag vom 16.11.2026, hier als Arbeitsstand:**
  1. Der Pitch-Stand bleibt festgehalten.
  2. Nach dem Pitch kommt zuerst die sichtbare Restmenge, als nächster Schritt der zweite Vorgang für die Restmenge.
  3. „Erst intern, dann extern“ bleibt eine Empfehlung.
  4. Die 14 Tage bleiben Simulationsannahme, bis ein konkreter Praxisfall besprochen ist.
  5. Für jetzt genügt die Dokumentation.

  Dieses Repository führt keine eigene Entscheidungsliste (`docs/entscheidungen.md`). Ins maßgebliche Protokoll
  `00_START_HIER/ENTSCHEIDUNGEN.md` trägt das Team die Punkte mit Aufgabe und Commit ein.
- **Änderungen an bisherigen Entscheidungen:** Die Empfehlung aus Fassung 1.0, zuerst „Prüfbitte spätestens“
  umzusetzen, ist durch den Auftrag abgelöst. Sie bleibt als späterer Kandidat erhalten. Pitch-Stand, Anwendungscode
  und Freigabe sind unverändert.
- **Offene Fragen an das Team:**
  1. Gibt es einen realen Partner, der Bestellfrist, Lieferzeit und Prüfzeit für Innentüren nennen kann?
  2. Die offenen Punkte im Plan zur Restmenge (`docs/plan-restmenge.md`, Abschnitt 8).
- **Nächster Prüfauftrag (genau einer):** Mit einer Planerin oder einem Planer aus einem realen Umbauprojekt prüfen,
  wie viele Tage vor der Ersatzbestellung ein Angebot vorliegen muss. Abschlusskriterium: eine dokumentierte Angabe
  mit Quelle, die die Annahme A5 (14 Tage) bestätigt oder ersetzt. Vorgeschlagene Zuständigkeit: Team CircularFlow.
  Frist: Vorschlag vor der nächsten Planungsrunde. Das Team bestätigt Zuständigkeit und Frist.
