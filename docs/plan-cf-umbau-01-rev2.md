# Plan CF-UMBAU-01 Revision 2 · Türsimulation

**Planfassung 0.2 · 14.11.2026 · nach Planprüfung durch cf-review · wartet auf Freigabe durch Houssam und Feyrouz**

Planung: cf-planung, nur lesend. Planprüfung: cf-review, nur lesend, auf Planfassung 0.1 (Commit `5ac22a5`). Korrekturen: Hauptsitzung. Branch `codex/claude-agenten-vorbereitung`, Ausgangscommit der Planung `e250a1a`. Dieser Plan ist **keine Freigabe**. Er ändert den Umfang nicht. Es wurde kein App-Code geschrieben und kein Test und kein Browser ausgeführt.

Aussagearten:

- **[Rev2]** Vorgabe aus CF-UMBAU-01 Revision 2. Diese ist selbst nur Prüffassung und **nicht freigegeben**.
- **[SP]** Vorschlag aus Softwareplanung v0.1 (Entwurf, nicht freigegeben).
- **[Beob]** Beobachtung im Repository (gelesen, nicht ausgeführt).
- **[Emp]** Empfehlung dieses Plans.
- **[Abg]** aus Rev. 2 §4/§5 abgeleitet. Muss vom Team bestätigt werden (F4).
- **[Hyp]** Hypothese.

## 0. Aufgabe

| Punkt | Inhalt |
|---|---|
| Nutzerrolle | Person im Planungsbüro [Rev2 §1]. Erste reale Nutzergruppe bleibt Hypothese [Hyp]. |
| Nutzerproblem | Vor der Ersatzentscheidung ist unklar, ob die vorhandene Tür T-07 samt Zarge aus Raum A in die Öffnung B-02 desselben Umbaus versetzt werden kann. Offen ist, ob das Breitenkriterium belegt ist und welcher Schritt jetzt ansteht [Rev2 §1]. |
| Gewünschtes Verhalten | Eine Karte im statischen Prototyp zeigt Ist und Soll, den Breitenbefund, beide Fristen, die Rolle und genau einen Hauptschritt mit Begründung, abhängig von Aufmaß und Betrachtungszeit [Rev2 §2–§5]. |
| Ausgeschlossen | Framework-Wechsel, Backend, Anmeldung, KI, Upload, 3D, Marktplatz, Versand, Push, Merge, Deployment, bezahlte Dienste [Rev2 §6]. Ebenso Eignungs-, Einbau- oder Normaussagen, Bestellung, automatische Friständerung [Rev2 §3, §5] und alle Erweiterungen aus v0.4 (Abschnitt 7). |
| Akzeptanzkriterien | Fälle 01–14 und Zusatzprüfungen Z1–Z12 in Abschnitt 6, jede Prüfung einer Anforderung zugeordnet |

## 1. Quellen- und Fassungsabgleich

### 1.1 Gelesene Quellen

| Quelle | Fassung / Status | Rolle |
|---|---|---|
| `docs/grundlagen/CF-UMBAU-01_Revision_2.md` | Rev. 2, 14.11.2026, „Prüffassung zur Teamfreigabe. Umsetzung erst nach Freigabe“ | Maßgeblicher Verhaltensentwurf |
| `docs/grundlagen/Softwareplanung_v0.1.md` | Entwurf v0.1, 14.11.2026, zur Abstimmung | Vorschläge zu Einstieg, Layout, Bedienelementen, Architektur |
| `docs/produktbrief.md` | v0.2, 08.11.2026, Entwurf für den Prototyp | CF-DEMO-01 (projektübergreifende Vermittlung, Kalendertage). Ein Türfall kommt nicht vor [Beob]. |
| `docs/entscheidungen.md` | Verweisdatei, 07.11.2026 | Verweist auf ein externes Protokoll, das nicht im Repository liegt |
| `docs/claude-vor-entwicklung.md` | Arbeitsfassung 14.11.2026, „keine App-Freigabe“ | Planformat, Abnahmegrundlage, R1–R12 in Zusammenfassung |
| `AGENTS.md`, `CLAUDE.md`, `README.md`, `prototype/README.md`, `docs/agenten-start.md` | 14.11. bzw. 08.11.2026 | Projektregeln |
| `prototype/dist/*`, `prototype/test/rules.test.mjs` | Stand `e250a1a` | Bestand |

**Nicht vorliegend:**

- Produktbrief v0.3 §7, die Grundlage von Rev. 2
- Produktfassung v0.4
- Praxistest-Paket
- Zweitbegutachtung v1.1
- externes Entscheidungsprotokoll

Von v0.4 und dem Praxistest-Paket ist nur die Zusammenfassung in `docs/claude-vor-entwicklung.md` bekannt. Darüber hinaus übernimmt der Plan nichts.

### 1.2 Gegenüberstellung der Fassungen und Vorschlag zur Konsolidierung

| Fassung | Was sie für die Tür sagt | Verfügbarkeit |
|---|---|---|
| Produktbrief v0.2 | Nichts. Sie beschreibt CF-DEMO-01 (Angebot und Bedarf zwischen Projekten). | im Repository |
| Produktbrief v0.3 §7 | Laut Rev. 2 die Grundlage der Türsimulation. Der Inhalt ist unbekannt. | **fehlt** |
| Produktfassung v0.4 | Erweitert den Produktvorschlag (R1–R12, Praxiszeitpunkte, Vorfilter). Sie genehmigt keine Erweiterung der Türsimulation. | nur als Zusammenfassung |
| CF-UMBAU-01 Rev. 2 | Vollständiges Verhalten der Karte, Fälle 01–14 | im Repository, Prüffassung |
| Softwareplanung v0.1 | Gestaltung und Struktur zu Rev. 2 | im Repository, Entwurf |

**Konsolidierungsvorschlag [Emp]:**

- **Verhalten:** Rev. 2 legt das Verhalten fest.
- **Gestaltung:** Softwareplanung v0.1 gilt, soweit dieser Plan nicht ausdrücklich abweicht.
- **Umfang und Ablauf:** Dieser Plan (Fassung 0.2) legt beides fest.
- **v0.2:** Bleibt für CF-DEMO-01 gültig und wird nicht verändert.
- **v0.4:** Wird nicht umgesetzt.
- **Freigabe:** Das Team hält sie in Abschnitt 9 fest, mit dem Vermerk „Produktbrief v0.3 §7 nicht eingesehen“, sofern v0.3 nicht nachgereicht wird.

### 1.3 Widersprüche und Lücken

| # | Befund | Empfehlung | Entscheidet |
|---|---|---|---|
| W1 | Rev. 2 stützt sich auf v0.3 §7 und verlangt, die Freigabereferenz auf v0.3 festzuhalten [Rev2 §1]. Im Repository liegt nur v0.2. | v0.3 §7 nachreichen oder Konsolidierung 1.2 beschließen | Houssam/Feyrouz |
| W2 | Laut `AGENTS.md` und `README.md` ist der Produktbrief die einzige maßgebliche Spezifikation. Laut `CLAUDE.md` ersetzen die Tür-Unterlagen ihn nicht stillschweigend. | Datierte Freigabe in Abschnitt 9 und als Entscheidungsvermerk. Bis dahin kein App-Code. | Houssam/Feyrouz |
| W3 | Rev. 2 ist Prüffassung, Softwareplanung Entwurf. Eine Freigabe ist nicht dokumentiert. | Freigabe mit Datum und Umfang (Abschnitt 9) | Houssam/Feyrouz |
| W4 | Rev. 2 nennt als Basis `f640e2b` und als Arbeitsbranch `codex/cf-umbau-01-innentuer` von dieser Basis [Rev2 §1]. | **Von der Hauptsitzung per git (nur lesend) geprüft:** `f640e2b` ist Vorfahr von `e250a1a`, `prototype/` ist zwischen beiden identisch. Seitdem kamen nur Dokumente und Agentendateien hinzu. Für die Branch-Basis siehe F8. | Team |
| W4a | Rev. 2 spricht von 13 Bestandstests. In `rules.test.mjs` gezählt: 3 aus der Schleife plus 10 einzelne Tests = 13 [Beob]. | Am Arbeitsstand tatsächlich ausführen | cf-test |
| W5 | Von den Grenzzeitpunkten aus Fall 09 liegt nur die Betrachtung 19.11. 12:00 außerhalb der vier Auswahlzeitpunkte [Rev2 §4]. Ein Eingang um 16:00 lässt sich schon bei Betrachtung 19.11. 09:00 prüfen. | Fall 09 Teil 1 bei 19.11. 09:00 (auch im Browser prüfbar). Teil 2 bei 19.11. 12:00 nur als Regeltest. | Team (F2) |
| W6 | Fall 08 und 13 brauchen andere Fristen. Die Fristen sind feste Demo-Daten [SP]. Die Warnung zum Fristwiderspruch wird in der Oberfläche deshalb nie ausgelöst. | Fristen fest, als Parameter an die Regel. Fall 08 und 13 als Regeltest. Option: Demo-Schalter (F3). | Team |
| W7 | Für einige Fälle nennt Rev. 2 den Hauptschritt oder „Weiterhin offen“ nicht vollständig (09, 10, 11, Teile von 08). | Ableitungen [Abg] in Abschnitt 6, Bestätigung in F4 | Team |
| W8 | Das Beispielaufmaß hat Eingang 18.11. 15:00 [SP], der Start ist 18.11. 14:00 [Rev2 §4]. Direkt nach dem Einsetzen erscheint „noch nicht eingegangen“. Das entspricht Rev. 2, überrascht aber. | Hinweistext (F5) | Team |
| W9 | `docs/entscheidungen.md` ist nur ein Verweis. | Freigabe in Abschnitt 9 und als Vermerk festhalten | Team |
| W10 | Erweiterungen aus v0.4 liegen nicht in Rev. 2. | Außerhalb des Umfangs (Abschnitt 7) | Team |
| W11 | `rules.mjs` rechnet in Kalendertagen, die Tür braucht Uhrzeiten. | Eigenes Regelmodul, Bestand unverändert | Planung |
| W12 | Rev. 2 nennt „Einheit mm“ als Verwertbarkeitskriterium [§3]. Die Softwareplanung führt „Einheit“ als Datenfeld. Die Eingabe ist aber „Wert in mm“ ohne Einheitenfeld. | Einheit als feste Konstante „mm“ an die Regel übergeben und dort prüfen. Wert mit Einheitenzusatz (z. B. „890 cm“) gilt als ungültig (F10). | Team |
| W13 | Rev. 2 Fall 04 spricht von „KI-Vorschlag“. R11 und §6 schließen KI aus. | Messstatus „vorgeschlagen“ bildet den Fall ohne KI-Funktion ab [Emp] | – |
| W14 | Die Bestands-README nennt Testbefehle relativ zu `prototype/`, `CLAUDE.md` nennt sie vom Repository-Root aus. Der dokumentierte Befehl führt eine neue Testdatei nicht mit aus. | Beide Formen mit beiden Dateien angeben (UM-17, F9) | Team |

### 1.4 Empfehlungen R1–R12 (v0.4, nur als Zusammenfassung bekannt)

| R | Kurzinhalt | Status in diesem Plan |
|---|---|---|
| R1 | Schutzanforderungen: Fachprüfung, keine Eignungszusage | **Übernommen als Grenze:** Innentür ohne Brand- oder Rauchschutz [SP], UM-11, UM-16 |
| R2 | Herkunftsstatus je Wert | **Teilweise:** Messstatus, Quelle, Datum laut Rev. 2. Die vollständige Statusliste ist **zurückgestellt**. |
| R3 | Maßbezüge und Einheit unterscheiden | **Übernommen:** UM-04, W12, Fall 04, Z11 |
| R4 | Angebot, Zuständigkeit, Entscheidungsfrist, Übergabe | **Zurückgestellt:** manueller Fallbogen, nicht in der Karte |
| R5 | Offene Punkte mit Rolle und Frist | **Teilweise:** Rollen laut Rev. 2 §5. Eine Frist je Punkt ist **zurückgestellt**. |
| R6 | Wirtschaftlicher Vorfilter | **Zurückgestellt:** Praxistest, nicht in der Karte |
| R7 | Gleicher Leistungsumfang, Kostenannahmen | **Zurückgestellt:** keine Einsparrechnung |
| R8 | Keine Einbaufreigabe, kein Siegel | **Übernommen:** UM-16, Texttest Z12 |
| R9 | Sollwert mit Quelle oder Annahme | **Übernommen:** UM-02 „fiktives Planungsblatt P-02 · Simulationsannahme“ |
| R10 | Datenschutz | **Übernommen:** Nur fiktive Beispieldaten. Die Belegquelle ist Freitext, bleibt nur im Arbeitsspeicher und wird nicht weitergegeben. Der Hinweis „keine echten Namen oder Fallnotizen eintragen“ steht am Feld [Emp]. |
| R11 | Erster Test ohne KI oder Fotobestimmung | **Übernommen:** keine KI, kein Upload (W13) |
| R12 | Audit-Ergebnisse später | **Zurückgestellt** |

## 2. Anforderungen

Der Sollbereich 885–895 mm und die Messstelle sind **gewählte Simulationsannahmen, keine Norm** [Rev2 §2]. Aufmaßfrist (18.11. 16:00) und Ersatzentscheidungsfrist (19.11. 12:00) sind zwei getrennte Zeitstände mit eigenen Texten und Auswirkungen. In Klammern steht die Zuordnung zu Softwareplanung A1–A8.

| ID | Beobachtbares Ergebnis | Ansicht / Regel | Status |
|---|---|---|---|
| UM-01 | Der Einstieg „Tür im selben Umbau“ öffnet die Karte. Die Karte zeigt T-07 samt Zarge aus Raum A → B-02 und dauerhaft „Simulation mit Beispieldaten“. (A1) | D1, D2 | [Rev2 §2]. Platzierung [Emp] |
| UM-02 | Ist und Soll stehen nebeneinander in mm. Soll 885–895 mm, Herkunft „fiktives Planungsblatt P-02 · Simulationsannahme“, Messstelle beschrieben. Fehlt das Aufmaß, steht dort der Text „Aufmaß fehlt“. (A2) | D2 Maßvergleich | [Rev2 §2]. Textstatus [SP] |
| UM-03 | Eingaben: Wert in mm, Messbezug, Messstatus, Belegquelle, Messdatum, Eingang bei der Planung (Datum und Uhrzeit). Fehler stehen am Feld. | D2 Aufmaß | Felder [Rev2 §2]. Fehler am Feld [SP]. Auswahlwerte [Emp] |
| UM-04 | Verwertbar ist ein Aufmaß nur, wenn alles stimmt: Wert endlich und positiv, Einheit mm, Bezug P-02, Status „gemessen“, Quelle vorhanden, Messdatum gültig, Eingang zeitlich plausibel und bis zur Betrachtungszeit. Sonst bleibt die Breite offen und der Grund wird genannt. Bei falschem Bezug nennt der Grund den erfassten **und** den erwarteten Bezug. Ein Türblattmaß oder eine lichte Breite ersetzt das Aufmaß nicht. (A3) | Regel `usable` | [Rev2 §3] |
| UM-05 | Der Bereich gilt inklusive der Grenzen. 890 mm ergibt „Breitenkriterium erfüllt“. 870 mm ergibt „Breitenkriterium verfehlt – 15 mm unter der Untergrenze“. Das gilt nur für ein verwertbares Aufmaß. (A4) | Regel `width` | [Rev2 §3]. Text für „über der Obergrenze“ [Emp] |
| UM-06 | Fehlt der Eingang oder liegt er nach der Betrachtungszeit, gilt das Aufmaß als „noch nicht eingegangen“. Das allein ist kein Terminwiderspruch. Ein ungültiger Zeitwert erfordert Klärung. Liegt der Eingang an einem früheren Berliner Kalendertag als das Messdatum, erscheint „Eingang vor Messdatum – widersprüchlich“, und das Aufmaß bleibt unverwertbar. | Regel `receipt` | [Rev2 §3] |
| UM-07 | Ohne verwertbares Aufmaß gilt „Aufmaß ausstehend“ bis **einschließlich** 18.11. 16:00, danach „Aufmaß überfällig“. Mit verwertbarem Aufmaß zählt der tatsächliche Eingang: „rechtzeitig eingegangen“ (≤ 16:00) oder „verspätet eingegangen“. Ein rechtzeitiger Eingang bleibt später rechtzeitig. (A5) | Regel `measureStatus` | [Rev2 §4] |
| UM-08 | „Entscheidungsfrist offen“ bis **einschließlich** 19.11. 12:00, danach „Entscheidungsfrist verstrichen“. Der Termin dokumentiert keine tatsächlich ausgelöste Bestellung. Der Status ist unabhängig von UM-07. | Regel `replaceStatus` | [Rev2 §4] |
| UM-09 | Liegt die Aufmaßfrist nach der Ersatzfrist, erscheint zusätzlich „Aufmaß ist erst nach der Ersatzentscheidung fällig“. Die Warnung ist unabhängig von beiden Zeitständen. Bis zur Klärung empfiehlt die Karte keine Vorlage zur Fachprüfung. | Regel `warnings` | [Rev2 §4] |
| UM-10 | Alle Aufgaben werden unabhängig abgeleitet. Die erste zutreffende ist der Hauptschritt (Rangfolge in 4.3), weitere zutreffende stehen einmalig unter „Weiterhin offen“. Aufgaben für die Fachprüfung gibt es nur im offenen, widerspruchsfreien Fall. Der Messauftrag bleibt unter „Weiterhin offen“, wenn ein höherrangiger Schritt zutrifft. (A6) | Regel `actions` | [Rev2 §5] |
| UM-11 | Höhe, Anschlag und Zustand erscheinen als offene Punkte der Fachprüfung und werden nicht bewertet. Bei Rang 6 steht zusätzlich „Weitere technische Anforderungen bleiben offen.“ | D2 | [Rev2 §2, §5] |
| UM-12 | Die reine Regel bekommt den Betrachtungszeitpunkt übergeben. Feste Zeitwerte werden unabhängig von Systemuhr und Gerätezeitzone verglichen. Die Zeitzone Europe/Berlin (November UTC+01:00) ist beschriftet. Auswahl: 18.11. 14:00 (Start), 18.11. 15:30, 19.11. 09:00, 20.11. 09:00. (A7) | Regel, D2 | [Rev2 §4, §6]. Umsetzung als Wanduhrzeit [Emp] |
| UM-13 | Bedienbare Eingaben, „Beispielaufmaß einsetzen“ (890 mm, P-02, gemessen, fiktive Aufmaßnotiz, Messdatum 18.11., Eingang 18.11. 15:00, Betrachtungszeit bleibt unverändert) und „Simulation zurücksetzen“ (Aufmaß leer, 18.11. 14:00). (A7) | D2 | Beispiele und Reset [Rev2 §6]. Werte und Startzustand [SP]. Rücksetzdetails [Emp] |
| UM-14 | Die reine Regel ist vom UI getrennt. Bestehende Fälle und lokal gespeicherte Daten (`circularflow-testfaelle-v1`) bleiben nutzbar und unverändert. (A8) | Architektur | [Rev2 §6] |
| UM-14a | Die Türdaten liegen nur im Arbeitsspeicher, ohne `localStorage` und ohne Export. | Architektur | [Emp] ([Rev2 §6] „kann im Speicher bleiben“, [SP]) |
| UM-15 | Status erscheint immer als Text, nicht nur als Farbe. Alles ist per Tastatur bedienbar, Beschriftungen sind sichtbar. In schmaler Ansicht stehen Hauptschritt und Fristen vor den Eingaben. | D2 | [Emp] ([SP] Gestaltungsvorschlag) |
| UM-16 | Keine Eignungs-, Freigabe- oder Normaussage. Der Befund bewertet ausschließlich die Breite, über die Eignung entscheiden Fachleute. Die Belegquelle wird als Text ausgegeben, nicht als HTML. | Texte, UI | [Rev2 §3]. Escaping [Emp] |
| UM-17 | Kurze Startanleitung in `prototype/README.md`: statischen HTTP-Server für `prototype/dist` starten, Seite öffnen, bestehende und neue Regeltests mit `node --test` ausführen. Es wird nur ein Serverbefehl dokumentiert, den cf-test tatsächlich ausgeführt hat. | README | [Rev2 §6]. Nachweisregel [Emp] |
| UM-18 | Übergabe nach der Umsetzung nennt: geprüfter HEAD und Arbeitsbaum, Branch, Ausgangscommit, Änderung (Dateiliste und Diff), Start- und Testbefehle, beobachtete Ergebnisse, offene Prüfungen, Freigabereferenz (Rev. 2, v0.3-Status, Planfassung, Freigabedatum). | Übergabe | [Rev2 §1, §6] |
| UM-19 | Nach Ablauf einer Frist bleiben Breitenbefund, Aufmaßstatus, Warnungen und offene Angaben sichtbar. Die Karte ändert keine Frist automatisch und löst keine Bestellung und keine Fachfreigabe aus. | D2, Regel | [Rev2 §5] |

## 3. Ansichten

Die Türkarte ist eine neue Ansicht im bestehenden Prototyp. „Projekte“ und „Vorprüfung“ bleiben unverändert.

### D1 Übersicht (bestehend, ergänzt)

```
[Hero „Reicht die Zeit …“]  (unverändert)
+--------------------------------------------------------------+
| Tür im selben Umbau                      Simulation mit       |
| Prüfe, was vor der Ersatzentscheidung    Beispieldaten        |
| noch fehlt.                  [ Tür im selben Umbau öffnen → ] |
+--------------------------------------------------------------+
[Kennzahlen] [Testfälle]  (unverändert)
```

Der Einstieg ist ein Button mit `data-nav="door"`, die Texte sind [Emp]. Zusätzlich ist ein Eintrag in der Seitennavigation vorgesehen (F6).

### D2 Türkarte

Die DOM-Reihenfolge ist zugleich Lese- und Tab-Reihenfolge. Die Texte sind [Emp], sofern sie nicht wörtlich aus Rev. 2 stammen. Wörtlich übernommen sind: „Simulation mit Beispieldaten“, die Statusbegriffe aus §3/§4, die Handlungen aus §5 und die Messstelle aus §2.

```
Kopf
  h1 „Tür im selben Umbau“   [Simulation mit Beispieldaten]
  „Tür T-07 samt Zarge aus Raum A → Zielöffnung B-02“  [← Zur Übersicht]
Entscheidung  (aria-live=polite)
  „Nächster Schritt“  <Handlung>  · Rolle: <Planung|Montagebetrieb>
  <Begründung, bei Rang 1: „Erst feststellen, ob Ersatz bereits bestellt
   wurde und welche Optionen noch offenstehen.“>
  „Weiterhin offen“  <Liste oder „Nichts weiter offen.“>
Fristen
  Aufmaßfrist           18.11.2026, 16:00 Uhr   <Aufmaß ausstehend|überfällig|rechtzeitig/verspätet eingegangen>
  Ersatzentscheidung    19.11.2026, 12:00 Uhr   <Entscheidungsfrist offen|verstrichen>
  „Der Termin dokumentiert keine ausgelöste Bestellung.“
  [Warnung bei Fristwiderspruch]
  Betrachtungszeit (Europe/Berlin, UTC+01:00)  ( ) 18.11. 14:00 ( ) 18.11. 15:30
                                               ( ) 19.11. 09:00 ( ) 20.11. 09:00
Maßvergleich
  „Rohbauöffnungsbreite B-02“  Ist: <x mm | Aufmaß fehlt>   Soll: 885–895 mm
  Herkunft: fiktives Planungsblatt P-02 · Simulationsannahme
  Messstelle: horizontal zwischen den seitlichen Rohbaukanten von B-02,
              1,00 m über Oberkante Rohfußboden
  Befund: <Breitenkriterium erfüllt | Breitenkriterium verfehlt – 15 mm unter der Untergrenze | Breite offen: Grund>
  „Der Befund bewertet ausschließlich die Breite. Über die Eignung entscheiden die zuständigen Fachleute.“
Aufmaß erfassen
  Wert in mm [___]  Messbezug [Auswahl]  Messstatus [Auswahl]
  Belegquelle [___] (Hinweis: nur fiktive Angaben)  Messdatum [Datum]
  Eingang bei der Planung [Datum+Uhrzeit, Europe/Berlin]
  [Beispielaufmaß einsetzen]  [Simulation zurücksetzen]
Weitere Prüfpunkte (Fachperson): Höhe · Anschlag · Zustand – offen, nicht bewertet
```

| Element | Inhalt |
|---|---|
| Messbezug [Emp] | „Rohbauöffnungsbreite B-02, Messstelle laut P-02“ (einziger zulässiger Wert [Rev2 §2]), „lichte Breite“, „Türblattmaß“, „nicht angegeben“ |
| Messstatus [Emp] | „gemessen“, „geschätzt“, „vorgeschlagen“ (steht für den KI-Vorschlag aus Fall 04, ohne KI-Funktion), „nicht angegeben“ |
| Wert in mm [Emp] | Textfeld `inputmode="decimal"`, nur eine Zahl, Komma oder Punkt als Dezimalzeichen. Ein Einheitenzusatz wie „890 cm“ oder „890 mm“ gilt als ungültig: „Bitte nur die Zahl in mm eingeben.“ (F10) |
| Leerzustand | Ist „Aufmaß fehlt“, Befund „Breite offen – Aufmaß fehlt“, „Aufmaß ausstehend“. Hauptschritt „Rohbauöffnung B-02 an der Messstelle laut P-02 messen oder ein verwertbares Aufmaß nachreichen“ (Montagebetrieb). |
| Fehlerzustand | Grund am Feld und im Befund. Beispiele: „Erfasster Bezug: Türblattmaß. Erwartet: Rohbauöffnungsbreite B-02, Messstelle laut P-02.“, „Wert ist keine positive Zahl.“, „Status ‚geschätzt‘ zählt nicht als Aufmaß.“, „Belegquelle fehlt.“, „Messdatum fehlt oder ist ungültig.“, „Eingang vor Messdatum – widersprüchlich“, „Aufmaß noch nicht eingegangen (Eingang liegt nach der Betrachtungszeit).“ [Emp, außer Rev.-2-Zitaten] |
| Erfolgszustand | „Breitenkriterium erfüllt“ und „rechtzeitig eingegangen“. Hauptschritt „Variante zur fachlichen Prüfung vorlegen“ (Planung), dazu „Weitere technische Anforderungen bleiben offen.“ |
| Fristwiderspruch | „Aufmaß ist erst nach der Ersatzentscheidung fällig“ bei den Fristen. Im UI nur über F3 erreichbar. |
| Hinweis nach Beispielaufmaß [Emp] | Wenn der Eingang nach der Betrachtungszeit liegt: „Eingang 18.11. 15:00 liegt nach der Betrachtungszeit. Betrachtungszeit auf 18.11. 15:30 stellen.“ |
| Statusdarstellung | Immer als Text. Vorschlag laut [SP]: vorhandene Klassen verwenden (erfüllt `status-review`, offen `status-clarify`, verfehlt `status-late`). `status-review` heißt im Bestand „Weiter prüfen“. Deshalb steht neben „erfüllt“ immer der Satz zur Breitenbewertung (F11). |
| Reset [Emp] | Aufmaß leer, 18.11. 14:00, Meldung „Simulation zurückgesetzt.“, Fokus auf die Überschrift, ohne Rückfrage (F7) |
| Navigation [Emp] | „Zur Übersicht“ und Seitennavigation. Der Zustand bleibt bis Reset oder Neuladen erhalten (F7). |

- **Tastatur:** Nur native Elemente. Die Radiogruppe steht in `fieldset/legend`. Es gibt keine Tastaturfalle, der Bestand behält `:focus-visible`. Eingaben aktualisieren nur den Ergebnisbereich, ohne das Formular neu zu zeichnen, damit der Fokus beim Tippen erhalten bleibt.
- **Desktop [SP]:** Entscheidung und Fristen stehen nebeneinander, der Maßvergleich links neben der Aufmaßeingabe. Die DOM-Reihenfolge bleibt dabei unverändert.
- **Schmal:** Bestehende Breakpoints 760 und 480 px [Beob]. Eine Spalte in der obigen Reihenfolge.

## 4. Datenmodell und Datenfluss

### 4.1 Modell

| Gruppe | Felder | Herkunft / Zuständigkeit |
|---|---|---|
| Fall | id „T-07“, „Tür samt Zarge“, Herkunft „Raum A“, Ziel „B-02“ | Konstante, fiktiv |
| Anforderung | Bezug „Rohbauöffnungsbreite B-02, Messstelle laut P-02“, Messstelle (Text), `minMm` 885, `maxMm` 895, `unit` „mm“, Kennzeichnung „fiktives Planungsblatt · Simulationsannahme“ | Konstante, gewählte Annahme, keine Norm |
| Fristen | `measureDeadline` „2026-11-18T16:00“, `replaceDeadline` „2026-11-19T12:00“ | Konstante, Europe/Berlin. In Tests als Parameter änderbar. |
| Aufmaß | `valueText`, `unit` (im UI fest „mm“), `reference`, `status`, `source`, `measuredOn` (YYYY-MM-DD), `receivedAt` (YYYY-MM-DDTHH:mm) | Eingabe. Messen: Montagebetrieb. Erfassen des Eingangs: Planung. |
| Betrachtungszeit | `at` (YYYY-MM-DDTHH:mm) | Auswahl, wird ausdrücklich an die Regel übergeben |
| Ergebnis | `width` {met/missed/open, Abstand mm, Gründe}, `receipt` {missing/notYet/received/invalid/contradictory}, `measureStatus`, `replaceStatus`, `warnings[]`, `mainStep` {Text, Rolle, Begründung}, `stillOpen[]`, `otherChecks[]` | Berechnet, nie gespeichert |

### 4.2 Datenfluss

```
Eingabefelder (Strings) -> trimmen
  -> evaluateDoor({ requirement, measurement, deadlines, at })
       1. Validierung: Zahl, Einheit, Bezug, Status, Quelle, Messdatum, Eingang (echte Kalendergültigkeit)
       2. Eingang: fehlt / nach `at` / ungültig / vor Messdatum (Kalendertag) / eingegangen
       3. Verwertbarkeit -> Breitenbefund
       4. Zeitstände (Aufmaß, Ersatz) inkl. Grenzzeitpunkt = rechtzeitig, Warnung
       5. Aufgaben unabhängig ableiten -> Rang sortieren -> Hauptschritt + „Weiterhin offen“
     [rein: keine Systemuhr, kein Date.now, kein DOM, kein Speicher]
  -> Ergebnisobjekt -> Darstellung (Belegquelle escaped)
```

- **Zeit [Emp]:** Alle Zeitwerte sind Berliner Wanduhr-Zeichenketten im festen Format. Sie werden nach der Gültigkeitsprüfung als Zeichenketten verglichen, ohne `Date`. Der Kalendertag ist der Datumsanteil. Das ist unabhängig von Systemuhr und Gerätezeitzone. Sommerzeitwechsel liegen außerhalb der Simulation und werden in der README vermerkt.
- **Speicher:** Nur Arbeitsspeicher (UM-14a). Keine automatisch erzeugten Zeitstempel.
- **Keine Fachaussage:** Keine Bestellung, keine Friständerung, keine Freigabe (UM-19).

### 4.3 Rangfolge (Rev. 2 §5, wörtlich)

| Rang | Auslöser | Hauptschritt | Rolle |
|---|---|---|---|
| 1 | Ersatzentscheidungsfrist verstrichen | „Bestellstatus klären“. Begründung: „Erst feststellen, ob Ersatz bereits bestellt wurde und welche Optionen noch offenstehen.“ | Planung |
| 2 | Fristwiderspruch oder ungültiger bzw. widersprüchlicher Eingang | „Termine klären“ | Planung |
| 3 | Ersatztermin offen und Breite verfehlt | „Anpassung fachlich klären oder Ersatzweg vorbereiten“ | Planung |
| 4 | Ersatztermin offen und Aufmaß überfällig oder verspätet | „Prüfvorlauf klären“ | Planung |
| 5 | Verwertbares Aufmaß fehlt | „Rohbauöffnung B-02 an der Messstelle laut P-02 messen oder ein verwertbares Aufmaß nachreichen“. Bleibt unter „Weiterhin offen“, wenn ein höherer Rang zutrifft. | Montagebetrieb |
| 6 | Breite erfüllt, Aufmaß rechtzeitig, Ersatztermin offen, Zeiten widerspruchsfrei | „Variante zur fachlichen Prüfung vorlegen“. Zusatz: „Weitere technische Anforderungen bleiben offen.“ | Planung |

## 5. Architektur und Dateiplan

Bestand [Beob, von cf-review bestätigt]:

- Ansichten `overview`, `projects`, `case` und `navNames` (`app.mjs:8`)
- `render()` ersetzt `page.innerHTML` (`app.mjs:173`)
- Klick-Handler über `data-nav` und `data-action` (`app.mjs:269–286`)
- `input`-Handler nur für `#case-form` (`app.mjs:288–300`)
- Speicherschlüssel `circularflow-testfaelle-v1` (`app.mjs:4`)
- Klassen `status-review`, `status-clarify`, `status-late` (`styles.css:63–65`)
- Seitennavigation in `index.html` Zeilen 21–23

| Datei | Status | Inhalt / Grenze |
|---|---|---|
| `prototype/dist/door-rules.mjs` | neu | `evaluateDoor(...)`, Konstanten (Soll, Einheit, Fristen, Betrachtungszeitpunkte), Textbausteine. Kein DOM, kein `Date.now`. |
| `prototype/dist/door-view.mjs` | neu | Rendering der Karte, Eingabehandler für das Türformular, eigener Zustand im Speicher, Escape-Funktion |
| `prototype/dist/app.mjs` | klein geändert | `navNames.door`. **Eigener Zweig `view === 'door'` in `render()`**: Die bestehende Verzweigung (`app.mjs:173`) fällt sonst in `caseEditor()` mit leerem `draft`. Einstieg in `overview()`. Aktionsnamen der Tür mit Präfix `door-`, damit sie nicht mit den bestehenden `data-action`-Werten kollidieren. Keine Änderung an Speicher oder Fall-Editor. |
| `prototype/dist/index.html` | klein geändert | Navigationseintrag (F6) |
| `prototype/dist/styles.css` | nur additiv | Neue Klassen, keine Änderung bestehender Regeln |
| `prototype/test/door.test.mjs` | neu | Fälle 01–13, Z1, Z2, Z7–Z11 |
| `prototype/README.md` | geändert | Startanleitung (UM-17), beide Testdateien |
| `CLAUDE.md` | nur nach Abstimmung | Testbefehl um `door.test.mjs` ergänzen (gemeinsam bearbeitete Datei, F9) |
| `rules.mjs`, `scenarios.mjs`, `rules.test.mjs` | unverändert | Regression |

**Testbefehle (Vorschlag, nicht ausgeführt):**

- vom Repository-Root: `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs`
- in `prototype/`: `node --test test/rules.test.mjs test/door.test.mjs`

**Server:** Für die README wird erst ein Befehl übernommen, wenn cf-test ihn ausgeführt hat (UM-17). Kandidat ist `python3 -m http.server 8000 --directory prototype/dist`, nicht geprüft.

**Reihenfolge nach Freigabe:**

1. `door-rules.mjs` und `door.test.mjs`
2. Einstieg und Karte
3. Eingaben, Beispielaufmaß und Reset
4. Startanleitung
5. cf-review prüft den vollständigen Diff
6. cf-test prüft dieselbe Codefassung (Regeltests und Browserfall 14)
7. Übergabe nach UM-18

## 6. Abnahme

Status aller Zeilen: **nicht ausgeführt**. Regeltest, Browserprüfung und Praxisbeleg sind getrennte Nachweise.

**Standard-Aufmaß:** 890 mm, Bezug P-02, „gemessen“, fiktive Aufmaßnotiz, Messdatum 18.11.2026, Eingang 18.11. 15:00.
**Standardfristen:** Aufmaßfrist 18.11. 16:00, Ersatzfrist 19.11. 12:00. Alle Zeiten Europe/Berlin, November 2026.

| Fall | Aufmaß | Eingang | Betrachtung | Erwartung | Anforderungen |
|---|---|---|---|---|---|
| 01 | keins | – | 18.11. 14:00 | Breite offen, Aufmaß ausstehend, Ersatzfrist offen. Hauptschritt Messauftrag (Montagebetrieb). | UM-02, 04, 07, 08, 10 |
| 02 | 890 mm | 18.11. 15:00 | 18.11. 15:30 | Breite erfüllt, rechtzeitig eingegangen. Hauptschritt „Variante zur fachlichen Prüfung vorlegen“ (Planung) mit Zusatz zu weiteren Anforderungen. | UM-05, 07, 10, 11 |
| 03 | 870 mm | 18.11. 15:00 | 18.11. 15:30 | „Breitenkriterium verfehlt – 15 mm unter der Untergrenze“. Hauptschritt „Anpassung fachlich klären oder Ersatzweg vorbereiten“. | UM-05, 10 |
| 04a | 890 mm, Bezug „lichte Breite“ | 18.11. 15:00 | 18.11. 15:30 | Breite offen. Grund nennt „lichte Breite“ **und** „Rohbauöffnungsbreite B-02, Messstelle laut P-02“. | UM-03, 04 |
| 04b | 890 mm, Bezug „Türblattmaß“ | 18.11. 15:00 | 18.11. 15:30 | Breite offen. Grund nennt „Türblattmaß“ **und** den erwarteten Bezug. | UM-03, 04 |
| 04c | Status „vorgeschlagen“ (KI-Vorschlag) bzw. „geschätzt“, Quelle leer | 18.11. 15:00 | 18.11. 15:30 | jeweils Breite offen mit Grund | UM-03, 04 |
| 04d | Wert leer, „abc“, 0, −890, nicht endlich (z. B. „Infinity“) [Emp: Beispiele] | 18.11. 15:00 | 18.11. 15:30 | jeweils Breite offen mit Grund | UM-03, 04 |
| 05 | keins | – | 19.11. 09:00 | Aufmaß überfällig, Ersatzfrist offen. Hauptschritt „Prüfvorlauf klären“, Messauftrag unter „Weiterhin offen“. | UM-07, 08, 10 |
| 06 | 890 mm, Messdatum 19.11. | 19.11. 09:00 | 19.11. 09:00 | Breite erfüllt, verspätet eingegangen, Ersatzfrist offen. Hauptschritt „Prüfvorlauf klären“. | UM-05, 07, 10 |
| 07 | Standard | 18.11. 15:00 | 20.11. 09:00 | Breite erfüllt, weiterhin rechtzeitig eingegangen, Entscheidungsfrist verstrichen. Hauptschritt „Bestellstatus klären“ mit Begründung aus Rang 1. Befund und Aufmaßstatus bleiben sichtbar. | UM-07, 08, 10, 19 |
| 08 | keins. Fristen: Aufmaß 19.11. 13:00, Ersatz 19.11. 12:00 | – | 18.11. 14:00 | Aufmaß ausstehend, Entscheidungsfrist offen (beide Fristen laufen). Warnung „Aufmaß ist erst nach der Ersatzentscheidung fällig“ sichtbar. Hauptschritt „Termine klären“. Messauftrag unter „Weiterhin offen“ [Abg]. Keine Fachprüfung. | UM-07, 08, 09, 10 |
| 09a | 885 mm und 895 mm (je ein Lauf) | 18.11. 15:00 | 18.11. 15:30 | jeweils Breitenkriterium erfüllt | UM-05 |
| 09b | Standard, Eingang genau zur Frist | 18.11. 16:00 | 19.11. 09:00 | rechtzeitig eingegangen. Hauptschritt „Variante zur fachlichen Prüfung vorlegen“ [Abg]. | UM-07, 10 |
| 09c | wie 09b | 18.11. 16:00 | 19.11. 12:00 (nur Regeltest) | Entscheidungsfrist offen. Hauptschritt „Variante zur fachlichen Prüfung vorlegen“ [Abg]. | UM-08, 10 |
| 10 | 890 mm, Bezug „Türblattmaß“ | 18.11. 15:00 | 19.11. 09:00 | Breite offen, Aufmaß überfällig, kein rechtzeitiger Eingang eines verwertbaren Aufmaßes. Hauptschritt „Prüfvorlauf klären“, Messauftrag unter „Weiterhin offen“ [Abg]. | UM-04, 07, 10 |
| 11 | 890 mm nach P-02, Messdatum 19.11. | 18.11. 15:00 | 19.11. 09:00 | Breite offen, „Eingang vor Messdatum – widersprüchlich“. Hauptschritt „Termine klären“. Messauftrag sichtbar. Aufmaß überfällig, „Prüfvorlauf klären“ ebenfalls unter „Weiterhin offen“ [Abg]. | UM-06, 07, 10 |
| 12 | 890 mm nach P-02, Messdatum 18.11. | 18.11. 15:00 | zurück auf 18.11. 14:00 | Noch nicht eingegangen, Breite offen, Aufmaß ausstehend. Kein Terminwiderspruch. | UM-06, 07, 12 |
| 13 | keins. Fristen: Aufmaß 19.11. 13:00, Ersatz 19.11. 12:00 | – | 20.11. 09:00 | Aufmaß überfällig. Hauptschritt „Bestellstatus klären“. Unter „Weiterhin offen“: „Termine klären“ und Messauftrag. Warnung sichtbar. Kein „Prüfvorlauf klären“, weil der Ersatztermin nicht offen ist. | UM-08, 09, 10, 19 |
| **14 (Browser, getrennt)** | Karte öffnen, Messwert erfassen, Betrachtungszeit vor und zurück stellen, Reset auslösen. Danach einen bestehenden Fall (z. B. CF-DEMO-01) öffnen und seinen Ablauf prüfen. | | | Anzeige wie in den Fällen oben. Der bestehende Fall öffnet, wird bearbeitet und gespeichert wie bisher. **Ohne Browserwerkzeug als „nicht ausgeführt“ melden.** | UM-01, 03, 12–15, 19 |

**Zusatzprüfungen [Emp]** (über Rev. 2 hinaus, gekennzeichnet):

| ID | Prüfung | Erwartung | Anforderung |
|---|---|---|---|
| Z1 | Eingang „2026-11-31T10:00“ (ungültig), Betrachtung 18.11. 15:30. Gesondert: Messdatum leer. | Ungültiger Eingang → „Termine klären“. Fehlendes Messdatum → Breite offen mit Grund. | UM-04, 06 |
| Z2 | Regeltests mit `TZ=Asia/Tokyo` und `TZ=America/Los_Angeles` | identische Ergebnisse | UM-12 |
| Z3 | Belegquelle `<img src=x onerror=alert(1)>` (Browser) | erscheint als Text, nichts wird ausgeführt | UM-16 |
| Z4 | `localStorage['circularflow-testfaelle-v1']` vor und nach der Türinteraktion (Browser) | unverändert | UM-14, 14a |
| Z5 | Tastaturdurchlauf ohne Maus (Browser) | alle Felder, Radiogruppe und beide Buttons erreichbar, Fokus nach Reset sichtbar | UM-15 |
| Z6 | Breite ≤ 480 px (Browser) | Hauptschritt und Fristen vor den Eingaben, kein horizontales Scrollen | UM-15 |
| Z7 | 884,9 mm bzw. 895,1 mm | verfehlt, 0,1 mm unter der Untergrenze bzw. 0,1 mm über der Obergrenze | UM-05 |
| Z8 | kein Aufmaß, Betrachtung **genau 18.11. 16:00** | „Aufmaß ausstehend“, nicht „überfällig“ | UM-07 |
| Z9 | Standard, Eingang **18.11. 16:01**, Betrachtung 19.11. 09:00 | „verspätet eingegangen“, Hauptschritt „Prüfvorlauf klären“ | UM-07, 10 |
| Z10 | Standard, Betrachtung **19.11. 12:01** | „Entscheidungsfrist verstrichen“, Hauptschritt „Bestellstatus klären“ | UM-08, 10 |
| Z11 | Wert „890 cm“ bzw. „890 mm“ im Wertfeld. Gesondert: Regel mit `unit` „cm“. | Breite offen mit Grund (F10) | UM-04 |
| Z12 | Textprüfung aller Ergebnistexte | kein „geeignet“, „freigegeben“, „Norm“ oder Siegel. Der Satz zur Breitenbewertung ist sichtbar. | UM-16 |

**Regression:**

- Die 13 Bestandstests laufen unverändert.
- Browser: Übersicht, Projekte und Vorprüfung öffnen, Fall bearbeiten, speichern, neu laden, wieder öffnen.
- Im Diff keine Änderung an `rules.mjs`, `scenarios.mjs` oder `rules.test.mjs`.

## 7. Trennung der Bereiche

| Bereich | Inhalt | Nicht Teil davon |
|---|---|---|
| Aktuelle Türsimulation (dieser Plan) | Eine fiktive Karte mit Regel, Fristen und Hauptschritt, nur im Arbeitsspeicher | Praxisaussage, Eignungsfreigabe |
| Manuelles Praxisgespräch [Hyp] | Handgeführter Fall, 30-Minuten-Gespräch, K1–K6. Kriterien, Schwellen und Einwilligung werden vorab festgelegt. Die Simulation ersetzt keinen Praxisbeleg. | Software, erfundene Ergebnisse |
| Spätere Produktoptionen | R2-Vollliste, R4–R7, R12, Praxiszeitpunkte, Frist je offenem Punkt, Schutzanforderungen, mehrere Türen, Persistenz, Mehrbenutzer, KI/LiDAR/Upload, Marktplatz | Nicht freigegeben, nicht bauen |

## 8. Offene Fragen an Houssam und Feyrouz

| # | Frage | Vorschlag mit Begründung |
|---|---|---|
| F1 | Wird Produktbrief v0.3 §7 nachgereicht, oder gilt die Konsolidierung aus 1.2 (Rev. 2 plus Softwareplanung v0.1 plus dieser Plan, Vermerk „v0.3 nicht eingesehen“)? | Konsolidierung 1.2. Das ist die kleinste Lösung ohne erfundene Inhalte. **Blockiert die Umsetzung.** |
| F2 | Bietet die Betrachtungszeit nur die vier Zeitpunkte aus Rev. 2 §4? | Ja, wie Rev. 2 und [SP]. 19.11. 12:00 (Fall 09c) und die Grenzprüfungen Z8–Z10 laufen als Regeltest. |
| F3 | Bleiben die Fristen fest, oder soll ein Demo-Schalter den Fristwiderspruch (Fall 08/13) im UI zeigen? | Fest (Rev. 2 nennt Fristen nicht als Eingabe). Dann erscheint die Warnung nur im Regeltest. Einen Schalter nur, wenn die Warnung im Pitch gezeigt werden soll. |
| F4 | Bestätigt ihr die abgeleiteten Werte [Abg]? Fall 08 (Messauftrag unter „Weiterhin offen“), Fall 09b/c (Hauptschritt Fachprüfung), Fall 10 (Hauptschritt „Prüfvorlauf klären“), Fall 11 („Prüfvorlauf klären“ unter „Weiterhin offen“), dazu: fehlendes Messdatum → Breite offen, ungültiger Eingang → „Termine klären“. | Bestätigen. Alle Werte folgen direkt aus §3–§5 („Aufgaben unabhängig ableiten“). |
| F5 | Stellt „Beispielaufmaß einsetzen“ die Betrachtungszeit um? | Nein, wie [SP] („Die Betrachtungszeit bleibt dabei eine eigene Auswahl“). Dazu der Hinweistext aus D2. |
| F6 | Kommt der Eintrag „Tür im selben Umbau“ zusätzlich in die Seitennavigation? | Ja: bessere Tastaturerreichbarkeit und `aria-current`. Reversibel. |
| F7 | Bleibt der Zustand beim Verlassen der Karte erhalten? Reset ohne Rückfrage? | Ja und ja, weil nur Daten im Arbeitsspeicher betroffen sind. |
| F8 | Branch für die Umsetzung. **Abweichung von Rev. 2 §1**, das `codex/cf-umbau-01-innentuer` ab `f640e2b` verlangt. | `codex/cf-umbau-01-innentuer` ab dem Commit mit der freigegebenen Planfassung. `prototype/` ist dort identisch mit `f640e2b`, Plan und Agentendateien sind zusätzlich enthalten. Alternative streng nach Rev. 2: ab `f640e2b`, dann fehlen Plan und Agenten auf dem Branch. |
| F9 | Dürfen `prototype/README.md` und `CLAUDE.md` angepasst werden, um beide Testdateien zu nennen? | Ja. `CLAUDE.md` ist eine gemeinsam bearbeitete Datei und wird deshalb nur mit eurer Zustimmung geändert. In die README kommt nur ein Serverbefehl, den cf-test ausgeführt hat. |
| F10 | Einheit: Wertfeld nur als Zahl, ein Einheitenzusatz gilt als ungültig? | Ja. Das ist eindeutig und erfüllt „Einheit mm“ aus §3. Alternative: „890 mm“ tolerieren. Reversibel. |
| F11 | Status „Breitenkriterium erfüllt“ mit der grünen Klasse `status-review` (im Bestand „Weiter prüfen“) oder mit einer neutralen neuen Klasse? | Vorhandene Klasse wie [SP], immer mit Text und dem Satz zur Breitenbewertung. Wirkt das wie eine Eignungszusage, eine neutrale Klasse. Reversibel. |

## 9. Planprüfung und Freigabe

### 9.1 Planprüfung durch cf-review auf Fassung 0.1 (Commit `5ac22a5`)

| Befund | Art | Behandlung in Fassung 0.2 |
|---|---|---|
| A1 Grenzzeitpunkte nicht vollständig testbar, Fall 09 ohne Hauptschritt | vor Freigabe | Z8–Z10 ergänzt, Fall 09 in 09a–c mit Hauptschritt [Abg], F4 |
| A2 W5 nur teilweise richtig | vor Freigabe | W5 und F2 präzisiert, Fall 09b bei 19.11. 09:00 |
| A3 Fall 04 ohne Nennung erfasster und erwarteter Bezug | vor Freigabe | Fall 04a/b ergänzt, Zuordnung auf UM-03/04, Zahlbeispiele [Emp] |
| A4 Einheit mm nicht abgebildet | vor Freigabe | W12, `unit` im Modell, Z11, F10 |
| A5 Kennzeichnung [B] irreführend, UM-14 Speicher | vor Freigabe | [Rev2] mit Hinweis „nicht freigegeben“, UM-14a als [Emp] |
| B1 Freigabereferenz und Rückgabeformat fehlen | Lücke | UM-18, Abschnitt 9.2 |
| B2 Nutzerproblem, Fassungsgegenüberstellung, R1–R12 fehlen | Lücke | Abschnitte 0, 1.2, 1.4 |
| B3 Texte zu Rang 1 und 6, Sichtbarkeit nach Fristablauf | Lücke | 4.3, UM-11, UM-19, Fälle 07/13 |
| B4 Spalten vermischt, Fall 08 unvollständig, Ableitungen 10/11 | Lücke | Tabelle mit getrennten Spalten, Fall 08 vollständig, F4 |
| B5 Branch-Basis als Abweichung kennzeichnen | Lücke | F8 |
| C1–C7 Softwareplanung zitieren, Desktop-Layout, Warnung im UI, Statusklasse, Fallstricke in `render()`, Startanleitung, [Emp]-Kennzeichnung | Hinweis | F2/F5 mit [SP], Desktop-Layout in D2, W6/F3, F11, Dateiplan `app.mjs`, UM-17/W14, Kennzeichnung in D2 |

Fassung 0.2 wurde **nicht erneut** von cf-review geprüft.

### 9.2 Freigabe (vom Team auszufüllen)

| Feld | Eintrag |
|---|---|
| Datum | |
| Freigebende | Houssam, Feyrouz |
| Freigegebene Fassungen | CF-UMBAU-01 Rev. 2 (14.11.2026), Softwareplanung v0.1, dieser Plan Fassung 0.2 |
| Produktbrief-Bezug | v0.3 §7: ☐ eingesehen ☐ nicht eingesehen, Konsolidierung 1.2 gilt |
| Antworten F1–F11 | |
| Freigegebener Umfang | |
| Branch und Basiscommit | |
| Offene Punkte | |
