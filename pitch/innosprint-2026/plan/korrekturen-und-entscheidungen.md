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

## D. Korrekturrunde 2 (nach cf-test und cf-review der fertigen Folien, 17.11.2026)

Grundlage: cf-test auf `4e2d477` (alle Prüfungen bestanden; Hinweis T7: Bildschrift auf Demo-Folien projiziert nur
etwa 10 px) und cf-review auf `4e2d477` (keine blockierenden Befunde, nichts Erfundenes, 3 hoch, 10 mittel,
10 gering). Wortlaut verbindlich, wo angegeben.

**D1 · Lesbarkeit der Bildschirmfotos (T7, gering 2).** Demo-Folien E1–E6 und C5 zeigen **Ausschnitte** statt ganzer
Bildschirme: linke Navigationsleiste weg, auf den relevanten Bereich zugeschnitten (E1: Zeitkritisch und Kacheln;
E2: Filterchips und Tabelle; E3 und E4: Ergebniskasten mit Grund; E5: Statuskette und Formular; E6: Kasten „Nächster
fachlicher Schritt“ und Status). Ausschnitte mit PIL in `pitch/innosprint-2026/bilder/ausschnitte/` speichern. Auf der
Folie so groß, dass die Bildschrift bei 1920 px Projektionsbreite mindestens etwa 14 px hoch ist (Faustregel: Bildbreite
in Zoll ≥ Ausschnittbreite in px ÷ 220). Hervorhebungsrahmen neu setzen. Seitentext auf eine kurze Bildunterschrift
kürzen. C5: statt vier kleiner Bilder zwei große Ausschnitte (E3 „zu spät“ und E4 „weiter prüfen“), dazu die Statuskette
bis „Vormerkung anlegen“; `k2` entfällt dort. Mit einer Renderprobe bei 144 dpi prüfen.

**D2 · Demo-Ankündigung A4/B2 (H-A).** Statuskette entfernen. Stattdessen nur die sechs Demo-Schritte als nummerierte
Reihe „Unsere sechs Demo-Schritte“: K1 Übersicht · K2 Paarliste · K3 Zu spät · K4 Weiter prüfen · K5 Prüfbitte · K6 Vormerkung.

**D3 · Schlussfolien A/B (H-B).** Beschriftung der Schritte 1–3 „in der Vorschau abgebildet“ statt „in der Demo gezeigt“;
Schritt 4 „nächster Schritt“. Titel A8/B8: „Wir prüfen nicht nur Typ und Menge, sondern ob die Zeit für die Prüfung reicht“.

**D4 · Fassung C (H-C).**
- C1-Sprechtext ergänzen: „Wird ein Angebot zu spät bekannt, wird neu bestellt, und passende Bauteile können entsorgt werden.“
- C5: Zeile mit Chip „Hypothese“: „Erwarteter Nutzen: früh sehen, was frei wird · Zeit mit Begründung prüfen · nächster
  Schritt statt Freigabe“.
- C5-Sprechtext ergänzen: „Ein Paar ist ein Angebot und ein Bedarf derselben Bauteilgruppe. Prüfbar heißt: Die Zeit reicht
  noch. Eine Vormerkung ist eine unverbindliche Reservierung.“
- C4: Titel „Der fiktive Fall in vier Zeitpunkten“; Sprechtext im Konjunktiv („wäre der letzte Tag“) (M-2).
- C2: „bis zu einem festen Tag“; Concular-Satz in zwei Sätze teilen; BLB-Kasten räumlich von den Fristkarten trennen,
  eigener Chip „Projektbeleg“ und Überschrift „Dortmunder Beispiel“; Karte „Bedarfsseite“ mit Fußnote „Annahme des
  Pilotfalls (Fallakte A4)“.
- C9: „jemanden aus der Planung“ statt „die Planerin oder den Planer, die oder der“; kleiner Link „Vorschau-Bilder (Anhang)“
  auf E1.

**D5 · Zeitleiste A3 und Pilotfolie B (M-1).** Legende: „Ergebnis, wenn die Planung an diesem Tag reagiert“. Marker:
„13.02. Bestellfrist erscheint unter „Zeitkritisch“ (Samstag, keine Benachrichtigung)“, „22.02. Variante 2: Angebot
erreicht die Planung zu spät“, „08.03. Variante 1: Übergabe (Angebot rechtzeitig bei der Planung)“. Sprechtext ergänzen:
„Zeitkritisch ist die Liste der Fristen der nächsten sieben Tage in der Übersicht.“ und „In Variante 1 erreicht das
Angebot die Planung am 20. Januar, rechtzeitig. In Variante 2 erst am 22. Februar.“

**D6 · Begriffe in B (M-3) und Sprache.** B2-Sprechtext: „Wir nehmen an, eine Prüfung dauert mindestens 14 Tage. Das
nennen wir Mindestprüfzeit.“ Pilotfolie in B mit derselben Legende wie A2. In allen Fassungen „Fachkern“ in Sprechtexten
und Fußnoten ersetzen durch „Rechenregel der Vorschau“. E1/E2-Sprechtext: „Ein Vorgang entsteht mit der Prüfbitte.“ und
„Angaben fehlen heißt: Für den Abgleich fehlt noch etwas, zum Beispiel eine Frist.“ E4-Sprechtext: „Hier hat der Bedarf
eine Mindestprüfzeit von zehn Tagen. Auch das ist ein Beispielwert. Das Annahmefenster ist der Zeitraum, in dem das
Projekt die Teile annehmen kann.“ (M-8)

**D7 · Fußnoten und Anhang (M-4, M-5).** Fußnoten mit ausgeschriebenen Kurznamen statt Kürzeln: „Fallakte CF-PILOT-01 §…“,
„Pitch-Ablauf“, „Doku Fassung 2“, „Lösungsansatz des Teams“, „Rechercheplan des Teams“,
„Produktbrief v0.2“, „Teilnahmebedingungen INNOSPRINT“. A2: „Quelle: Fallakte §0, §2 (A3, A4, A15), §3; Rollen:
Lösungsansatz des Teams“. Anhang: je Quelle Stand und, wo öffentlich, die Adresse:
- Concular, Handlungsempfehlung für die öffentliche Hand, Dezember 2024:
  concular.de/wp-content/uploads/2024/12/2024_Concular_Handlungsempfehlung_oeffentliche_Hand_Wiederverwendung.pdf
- BLB NRW, Pressemitteilung „Nachhaltiger Rückbau der Universitätsbibliothek“, 02.12.2024: blb.nrw.de (Presse)
- Madaster, Dokumentation „Match“, zuletzt bearbeitet 09.09.2026: docs.madaster.com/de/de/knowledge-base/industrial-reuse.html
- Concular Exchange: laut Rechercheplan des Teams (Anbieterseite am 08.11.2026 geöffnet, nicht erneut geprüft)
- Teilnahmebedingungen INNOSPRINT, Stand 01.10.2026: greenhouse.ruhr/programme/innosprint/
- Interne Unterlagen (Repository CircularFlow, nicht öffentlich): Fallakte CF-PILOT-01 Fassung 1.3 (16.11.2026),
  Pitch-Ablauf (16.11.2026), Doku Fassung 2, Produktbrief v0.2 (08.11.2026), Lösungsansatz des Teams (05.11.2026),
  Rechercheplan des Teams v1.0 (08.11.2026).

**D8 · Abgrenzung (M-6).** Unter dem Satz aus M2 klein ergänzen: „Madaster: Die Dokumentation (Stand 09.09.2026) nennt
keine Bestellfrist und keine Prüfzeit auf der Suchseite. Die Funktion selbst haben wir nicht bedient.“

**D9 · Tonfall (M-7, gering 6).** A1-Titel: „Zwölf Bürotüren und ein Datum, das nirgends steht“. A2-Titel: „Eine Tür
kann entsorgt werden, wenn die Planung zu spät vom Angebot erfährt“; Sprechtext „können entsorgt werden“; A2-Sprechtext
nennt „Planung, Bauleitung und Eigentümer“ (gering 5). B1: „… wird neu bestellt, und passende Bauteile können entsorgt
werden.“

**D10 · Geschäftsmodell (M-9).** Drei Kästen:
1. „Wer hätte den Nutzen?“ – Eigentümer, öffentliche Einrichtungen, Wohnungsunternehmen (Zielbild: Frühwarnung und
   Koordination); Betriebe für Prüfung, Ausbau, Transport, Lager, Wiedereinbau (mögliche Aufträge).
2. „Wofür könnte man zahlen?“ – offen, zum Beispiel ein Pilot in einem Projekt oder die laufende Nutzung; Alternative:
   Zusammenarbeit mit bestehenden Lösungen (Lösungsansatz des Teams).
3. „Ungeprüft“ – Zahlungsbereitschaft, Budget, Preis. Kein Preis, keine Zahl.
Der Satz „Die heutige Vorschau benachrichtigt niemanden.“ bleibt.

**D11 · Praxistest (M-10).** A und B: „Signal: eine dokumentierte Prüfzeit mit Quelle“.

**D12 · Ausgabeordner (gering 7).** Sprechtext-PDFs nach `ausgabe/sprechtexte/`. In `ausgabe/empfohlen-zur-abgabe/`
liegen nur PDF (zum Einreichen) und PPTX (für Vortrag und Bearbeitung; Notizen enthalten Sprechtext und Regieanweisungen).

**D13 · Dauern.** Nach den Änderungen „Dauer: etwa N Sekunden“ neu aus den Wortzahlen rechnen (2,3 Wörter je Sekunde),
Demo-Folien behalten ihre Planwerte. Die Summen meldet cf-entwicklung; das README übernimmt sie.
