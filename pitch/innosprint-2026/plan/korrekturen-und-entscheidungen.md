# Korrekturen und Entscheidungen zum Folienplan

Stand 17.11.2026 · Koordination (Hauptsitzung) · gilt zusammen mit [`folienplan.md`](folienplan.md) und
[`../werkzeug/GESTALTUNG.md`](../werkzeug/GESTALTUNG.md). **Wo diese Liste vom Folienplan abweicht, gilt diese Liste.**

Grundlage: unabhängige Prüfung des Folienplans durch cf-review am 17.11.2026 (keine blockierenden Befunde,
6 hohe, 10 mittlere, 5 geringe). Jeder Befund ist unten umgesetzt oder begründet entschieden.

## A. Entscheidungen der Koordination

| Nr. | Entscheidung | Begründung |
|---|---|---|
| K1 | **Empfohlen zur Abgabe: Fassung A.** Kennzeichnung nur über den Ordner `ausgabe/empfohlen-zur-abgabe/` und das README, **nicht** im Dateinamen und nicht auf Folien. | Ein Dateiname mit „Empfohlen“ ginge beim Einreichen mit. |
| K2 | Die Demo-Folien E1–E6 sind in der PPTX **versteckt** und stehen direkt nach der Demo-Ankündigung (A und B) bzw. im Anhang (C). In der **PDF erscheinen sie an derselben Stelle** (Export mit versteckten Folien). | Wer die PDF liest, sieht die Demo als Bildfolge in der Vortragsreihenfolge. Damit ist auch die Anhang-Frage aus dem Plan (§1.2 Nr. 8, §7.4 Frage 2) entschieden. |
| K3 | Jede E-Folie trägt oben „Demo-Schritt K1 von 6 · Bildschirmfoto aus Fassung 2“ (statt „Ersatz für Live-Demo“) und unten rechts zwei kleine Links: „weiter ›“ (auf die nächste E-Folie) und „zurück zum Vortrag“ (auf die erste sichtbare Folie nach dem Demo-Block). Die Demo-Ankündigung hat unten rechts einen kleinen Link „Ersatzfolien“ auf E1. | Prüfbefund M7: Die Weiter-Taste von einer versteckten Folie ist auf dem Vortragsrechner ungeprüft; Links machen den Weg eindeutig. In der Generalprobe testen. |
| K4 | Jede Fassung bekommt am Ende eine versteckte Folie **„Anhang: Quellen und Kennzeichnung“** (in der PDF sichtbar). Inhalt: die Quellen mit Stand, die Bedeutung der Chips, „Alle Daten sind Beispieldaten oder ein fiktiver Pilotfall; Nachrechnung mit dem Fachkern von Fassung 2; keine Praxisdaten“. | Prüfbarkeit für die Jury, ohne Redezeit. |
| K5 | Fassung C bleibt ohne Live-Demo im Hauptteil. Die Plattform kommt dort als Bildschirmfotos aus Fassung 2 (C5 mit `k3`, `k4` und `k6`). Die Live-Demo ist optional für die Fragerunde („auf Nachfrage“), mit demselben Ablauf K1–K6 und den E-Folien im Anhang. | Prüfbefund M9. C ist die Fassung mit dem geringsten Vorführrisiko; Fassung 2 wird trotzdem gezeigt. |
| K6 | Sprechzeiten sind Schätzungen. Auf jeder Fassung gilt: „keine Pitchdauer vom Veranstalter belegt“. Für jede Fassung gibt es drei Stufen: voll, etwa 5 Minuten, etwa 3 Minuten. Die Kürzungen stehen in den Notizen der betroffenen Folien („Bei 5 Minuten: …“, „Bei 3 Minuten: entfällt“) und im README. | Prüfbefund M8. |
| K7 | Keine Aussage, ob das Team einen Partner oder Kunden hat. Stattdessen: „Für den nächsten Schritt suchen wir einen echten Fall.“ | Prüfbefund M10: Ob sich seit dem Sprint ein Partner gefunden hat, ist nicht belegt. Das Team bestätigt vor der Abgabe. |

## B. Korrekturen je Befund (Wortlaut verbindlich, wo angegeben)

**H1 · Abgabefrist.** Nicht auf Folien, sondern im README: „Einreichung der Pitchpräsentation laut Veranstalter bis
einschließlich 18.11.2026; laut Auftrag des Teams bis 18.11., 13 Uhr. Einreichungsweg und Dateiformat nennt das
Veranstalterdokument nicht.“

**H2 · Klickfolge im Demo-Drehbuch.** Jede E-Folie bekommt in den Notizen nach dem Sprechtext einen Absatz
„Klick:“ mit dem Wortlaut aus `docs/pitch-ablauf.md`:
- E1: „Klick: Startseite Übersicht. Optional nach unten scrollen zur Verfügbarkeit je Monat.“
- E2: „Klick: In der Kachel Paare derselben Gruppe auf die große Zahl 8 Paare klicken.“
- E3: „Klick: Zeile TW-01 → BD-23 („Für diese Entscheidung zu spät“).“
- E4: „Klick: Oben im Pfad Paare derselben Gruppe, dann Zeile TW-05 → BD-22 („Weiter prüfen“).“
- E5: „Klick: Prüfbitte anlegen.“
- E6: „Klick: Geeignet wählen, unter Name der Fachperson „Fachplanung (Beispiel)“ eintragen, Fachergebnis eintragen,
  dann hochscrollen zum Kasten Nächster fachlicher Schritt: Vormerkung anlegen. Hier endet die Demo.“

E1-Sprechtext zusätzlich: „Weiter unten zeigt die Übersicht die Verfügbarkeit je Monat. Zahlen zu Kosten, CO₂ oder
Abfall zeigt sie bewusst nicht, weil Daten fehlen.“

**H3 · Begriffe erklären.**
- In A2 (Sprechtext, vor dem letzten Satz) und sinngemäß in C3: „Bevor bestellt wird, muss eine Fachperson prüfen, ob
  die Türen passen. Die Bitte dazu heißt bei uns Prüfbitte. Wir nehmen an, die Prüfung dauert mindestens 14 Tage, das
  ist die Mindestprüfzeit.“ Auf A2 als kleine Legende: „Prüfbitte = Bitte an eine Fachperson, die Eignung zu prüfen ·
  Mindestprüfzeit = 14 Tage (Annahme)“.
- E1 Sprechtext: „Ein Paar ist ein Angebot und ein Bedarf derselben Bauteilgruppe.“ und „Zeitkritisch zeigt die Fristen
  der nächsten sieben Tage.“
- Fassung B erklärt dieselben Begriffe in B1 (ein Satz) und E1.

**H4 · Folie C2.**
- Titel: „Zwei Fristen könnten entscheiden, ob ein Bauteil weitergegeben wird“ mit Chip „Hypothese“.
- Concular-Satz: „Concular empfiehlt für Rückbauprojekte der öffentlichen Hand, eine Frist zu vereinbaren, bis zu der
  Bauprodukte verkauft werden können, in der Regel bis kurz vor der Ausschreibung des Rückbaus.“ Quelle:
  Handlungsempfehlung, Dezember 2024, PDF-Seite 38. Zusatz: „Die Empfehlung betrifft Rückbau, unser Fall ist ein Umbau.“
- BLB-Karte bleibt nur mit der Beschriftung „Dortmunder Beispiel, BLB NRW, 02.12.2024: erst ausbauen, dann abbrechen“
  und ohne Bezug auf die zwei Fristen.

**H5 · Fassung B.**
- Neue Reihenfolge: B1, B2 (Demo-Ankündigung, danach E1–E6), **B3 = Pilotfall (bisher B4)**, **B4 = Wertstatus (bisher B3)**,
  B5–B8 unverändert.
- B1 Sprechtext ergänzen: „Erfährt die Planung zu spät von einem Angebot, wird neu bestellt, und passende Bauteile
  werden entsorgt.“
- Neuer Titel der Wertstatus-Folie: „Ein Scan liefert Vorschläge, für die Türregel zählt nur Gemessenes“.
- Die 3-Minuten-Stufe von B: B1, B2 entfällt samt Demo; stattdessen E3 und E4 als zwei sichtbare Bildfolien (Kopien
  der Demo-Folien, sichtbar, je 25 s); B3 entfällt, B4 entfällt; B5–B8 bleiben. Für die PPTX genügt der Hinweis in
  den Notizen; es werden keine zusätzlichen Folien gebaut.

**H6 · Folie C9.** Den Satz „Wir bringen eine kurze Fallvorlage mit.“ ersetzen durch „Wir können die vier Fragen
gemeinsam durchgehen.“

**M1 · Zeitleiste A3.** Marker „08.03. Übergabe (Variante 1)“ und „22.02. Angebot erreicht die Planung (Variante 2,
zu spät)“. Die Klammer „41 Tage Vorlauf“ entfällt.

**M2 · Abgrenzung.** In A5, B5, C6 und Jury-Antwort 1 statt „Unser Unterschied ist …“: „Unsere Frage dazu: Reicht
die Zeit bis zur Bestellentscheidung für eine fachliche Prüfung? Ob andere Plattformen das abbilden, haben wir nicht
geprüft.“ Concular Exchange mit Fußnote „laut Anbieter, Stand 08.11.2026, nicht erneut geprüft“; Madaster Match mit
„laut Dokumentation, zuletzt bearbeitet 09.09.2026“.

**M3 · Demo-Ankündigung A4/B2.** Statt „Die Regel ist dieselbe“: „Die Zeitprüfung ist dieselbe. Die Beispiele der
Vorschau sind Systemtrennwände, nicht Türen.“ In E3 und E4 einmal „Systemtrennwand“ nennen.

**M4 · Pilotbilder.**
- `pilot-pass-angaben.jpg` und `pilot-scan-karte.jpg` tragen den Chip „Fiktiver Pilotfall“ (nicht „Beispieldaten“)
  und die Bildunterschrift „Bildschirmfoto aus einem eigenen Profil mit den fiktiven Pilotdaten, nicht aus der
  Live-Demo“.
- `pilot-abgleich-t13-bd24.jpg` wird **nicht** auf Hauptfolien verwendet (es zeigt den Stichtag November 2026 mit
  „79 Tagen“ und ist mit E3 verwechselbar). Für den Pilotfall gilt die Zeitleiste als Grafik.

**M5 · Statuskette auf Schlussfolien.** Schritte 1–3 (Zuordnung, Prüfbitte, Fachergebnis) gefüllt als „in der Demo
gezeigt“, Schritt 4 (Vormerkung) umrandet als „nächster Schritt“, Schritte 5–6 gedämpft. Keine Hervorhebung von
Übergabe oder Übergeben.

**M6 · Geschäftsmodell.** Satz: „Eigentümer, öffentliche Einrichtungen und Wohnungsunternehmen könnten für ein Zielbild
von Frühwarnung und Koordination zahlen. Die heutige Vorschau benachrichtigt niemanden.“ Die Zusammenarbeit mit
bestehenden Lösungen ist als Teamidee belegt: Lösungsansatz („bindet qualifizierte Fachleute und bestehende Lösungen
für Materialprüfung, Rückbau und Wiederverwendung in den Prozess ein“). Fußnote „LA; RP“.

**M7 · Ersatzweg.** Siehe K3.

**M8 · Dauer.** Siehe K6. Fassung B: 6:55. In A „bis zu 11 Minuten je Team“ nur als „eigene Rechnung aus dem
Zeitfenster, keine Vorgabe“.

**M9 · Fassung C.** Siehe K5. In C5 zusätzlich `k6-vormerkung-anlegen.jpg`. Satz zur späteren Vorführung: „Die
Vorschau zeigen wir auf Nachfrage gern im Anschluss.“

**M10 · Partner.** Siehe K7. Betroffen: C1, C9, Jury-Antwort 2.

**L1** Madaster-Vorlauf wird nicht verwendet. **L2** E1: „ohne festes Ziel“ ergänzen. **L3** `pilot-scan-karte.jpg`
bleibt; die Bildunterschrift sagt „Simulation“. **L4** E2: „Geprüft werden Typ, Menge, Zeit und Entfernung.“
**L5** siehe M2.

## C. Was das Team vor der Abgabe bestätigt

1. Welche Fassung abgegeben wird (Empfehlung: A).
2. Ob sich seit dem Sprint ein Praxispartner oder ein realer Fall gefunden hat (dann Folie A7/B7/C9 anpassen).
3. Wer die Demo bedient (Vorschlag: Houssam bedient, Feyrouz hat die Uhr).
4. Ob die Bitte ans Publikum auf die Folien darf (Vorschlag: ja, ohne Datenschutzversprechen).
5. Sprung auf die Ersatzfolien in der Generalprobe auf dem Vortragsrechner testen.
