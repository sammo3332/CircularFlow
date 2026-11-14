# Plan CF-UMBAU-01 Revision 2 · Türsimulation

**Planfassung 0.1 · 14.11.2026 · Entwurf zur Prüfung durch cf-review und zur Freigabe durch Houssam und Feyrouz**

Erstellt von cf-planung (nur lesend). Branch `codex/claude-agenten-vorbereitung`, Ausgangscommit `e250a1a`. Dieser Plan ist keine Freigabe und ändert den Umfang nicht. Es wurde kein Test, kein Browser und kein Code ausgeführt.

Aussagearten: **[B]** bestätigte Vorgabe aus Revision 2, **[Beob]** Beobachtung im Repository (gelesen, nicht ausgeführt), **[Emp]** Empfehlung, **[Hyp]** Hypothese.

## 1. Quellen- und Fassungsabgleich

### 1.1 Gelesene Quellen

| Quelle | Fassung / Status | Rolle |
|---|---|---|
| `docs/grundlagen/CF-UMBAU-01_Revision_2.md` | Rev. 2, 14.11.2026, „Prüffassung zur Teamfreigabe. Umsetzung erst nach Freigabe“ | Maßgeblicher Verhaltensentwurf (Aufmaß, Fristen, Fälle 01–14) |
| `docs/grundlagen/Softwareplanung_v0.1.md` | Entwurf v0.1, 14.11.2026, zur Abstimmung | Vorschläge zu Einstieg, Layout, Bedienelementen, Architektur. Nicht freigegeben. |
| `docs/produktbrief.md` | v0.2, 08.11.2026, Entwurf für den Prototyp | Beschreibt CF-DEMO-01 (Kalendertage). Türfall kommt nicht vor. |
| `docs/entscheidungen.md` | Verweisdatei, 07.11.2026 | Verweist auf ein externes Protokoll, nicht im Repository |
| `docs/claude-vor-entwicklung.md` | Arbeitsfassung 14.11.2026, „keine App-Freigabe“ | Planformat, Abnahmegrundlage, Übergabereihenfolge |
| `docs/agenten-start.md`, `AGENTS.md`, `CLAUDE.md`, `README.md`, `prototype/README.md` | 14.11. bzw. 08.11.2026 | Projektregeln |
| `prototype/dist/*`, `prototype/test/rules.test.mjs` | Stand `e250a1a` | Bestand. `styles.css` nur über Selektoren eingesehen. |

Nicht vorliegend: Produktbrief v0.3 §7 (Grundlage von Rev. 2), Produktfassung v0.4, Praxistest-Paket, Zweitbegutachtung, externes Entscheidungsprotokoll. Inhalte daraus werden nicht übernommen, außer soweit `docs/claude-vor-entwicklung.md` sie zusammenfasst.

### 1.2 Widersprüche und Lücken

| # | Befund | Empfehlung | Entscheidet |
|---|---|---|---|
| W1 | Rev. 2 stützt sich auf Produktbrief **v0.3 §7**. Im Repository liegt nur **v0.2** ohne Türfall. | v0.3 §7 bereitstellen oder Rev. 2 und Softwareplanung v0.1 ausdrücklich als Spezifikation erklären, mit Vermerk „v0.3 nicht eingesehen“. | Houssam/Feyrouz |
| W2 | Laut `AGENTS.md` ist der Produktbrief maßgeblich, laut `CLAUDE.md` ersetzen die Tür-Unterlagen ihn nicht stillschweigend. | Datierte Freigabe als Produktbrief-Ergänzung oder Entscheidungsvermerk. Bis dahin keine Codearbeit. | Houssam/Feyrouz |
| W3 | Rev. 2 ist Prüffassung, Softwareplanung ist Entwurf. Keine Freigabe dokumentiert. | Nach Planprüfung Freigabe mit Datum und Umfang festhalten. | Houssam/Feyrouz |
| W4 | Rev. 2 nennt Basis `f640e2b` (Branch `codex/circularflow-vorpruefung-v1`). | **Geklärt durch die Hauptsitzung (git, nur lesend):** `f640e2b` ist Vorfahr von `e250a1a`, `prototype/` ist zwischen beiden identisch. Seitdem kamen nur Dokumente und Agentendateien hinzu. | – |
| W4a | Rev. 2 spricht von 13 Bestandstests. Beim Lesen von `rules.test.mjs` gezählt: 13. | Beim geprüften Commit tatsächlich ausführen. | cf-test |
| W5 | Fall 09 braucht die Zeitpunkte 18.11. 16:00 und 19.11. 12:00, die nicht zu den vier Auswahlzeitpunkten gehören. | Regel nimmt beliebige Zeitpunkte. Fall 09 als Regeltest. Siehe F2. | Team |
| W6 | Fall 08 und 13 brauchen andere Fristen. Fristen sind feste Demo-Daten. | Fristen fest, als Parameter an die Regel. Fall 08 und 13 als Regeltest. Siehe F3. | Team |
| W7 | Einige Fälle (10, 11) nennen Hauptschritt bzw. „Weiterhin offen“ nicht vollständig. Werte aus §5 abgeleitet. | Team bestätigt die Ableitungen. Siehe F4. | Team |
| W8 | Beispielaufmaß hat Eingang 18.11. 15:00, Start ist 18.11. 14:00. Direkt nach dem Einsetzen erscheint „noch nicht eingegangen“. | Hinweistext. Siehe F5. | Team |
| W9 | `docs/entscheidungen.md` ist nur ein Verweis. Türentscheidungen sind nicht dokumentiert. | Entscheidung nach Freigabe mit Datum festhalten. | Team |
| W10 | v0.4-Elemente (Vorfilter, vier Praxiszeitpunkte, Herkunftsliste, Frist je offenem Punkt) fehlen in Rev. 2. | Außerhalb des Umfangs (Abschnitt 7). | Team |
| W11 | `rules.mjs` rechnet in Kalendertagen, die Tür braucht Uhrzeiten. | Eigenes Regelmodul, Bestand unverändert. | Planung |

## 2. Anforderungen

Soll 885–895 mm ist eine **Simulationsannahme, keine Norm**. Aufmaßfrist (18.11. 16:00) und Ersatzentscheidungsfrist (19.11. 12:00) sind getrennte Zeitstände mit getrennten Texten und Auswirkungen. Zuordnung zu Softwareplanung A1–A8 in Klammern.

| ID | Beobachtbares Ergebnis | Ansicht / Regel | Status |
|---|---|---|---|
| UM-01 | Einstieg „Tür im selben Umbau“. Karte zeigt T-07 (Raum A) → B-02 und dauerhaft „Simulation mit Beispieldaten“. (A1) | D1, D2 | [B]; Platzierung [Emp] |
| UM-02 | Ist und Soll in mm nebeneinander. Soll 885–895 mm, Herkunft „fiktives Planungsblatt P-02 · Simulationsannahme“, Messstelle beschrieben. Fehlendes Aufmaß als Text „Aufmaß fehlt“. (A2) | D2 Maßvergleich | [B] |
| UM-03 | Eingaben: Wert in mm, Messbezug, Messstatus, Belegquelle, Messdatum, Eingang (Datum + Uhrzeit). Fehler am Feld. | D2 Aufmaß | [B] Felder, [Emp] Auswahlwerte |
| UM-04 | Verwertbar nur bei: Wert endlich und positiv, Einheit mm, Bezug P-02, Status „gemessen“, Quelle, gültiges Messdatum, Eingang bis zur Betrachtungszeit. Sonst Breite offen mit Grund. Falscher Bezug nennt erfassten und erwarteten Bezug. (A3) | Regel `usable` | [B] §3 |
| UM-05 | 885 und 895 erfüllt, 890 erfüllt, 870 „verfehlt – 15 mm unter der Untergrenze“. Nur für verwertbares Aufmaß. Bewertet nur die Breite. (A4) | Regel `width` | [B]; Text „über Obergrenze“ [Emp] |
| UM-06 | Eingang fehlt oder liegt nach der Betrachtungszeit → „noch nicht eingegangen“, kein Terminwiderspruch. Ungültiger Zeitwert → Klärung. Eingang an früherem Berliner Kalendertag als Messdatum → „Eingang vor Messdatum – widersprüchlich“, unverwertbar. | Regel `receipt` | [B] §3 |
| UM-07 | Ohne verwertbares Aufmaß „ausstehend“ bis einschließlich Frist, danach „überfällig“. Mit verwertbarem Aufmaß „rechtzeitig/verspätet eingegangen“ nach tatsächlichem Eingang. Rechtzeitig bleibt rechtzeitig. Genau 16:00 ist rechtzeitig. (A5) | Regel `measureStatus` | [B] §4 |
| UM-08 | „Entscheidungsfrist offen“ bis einschließlich 19.11. 12:00, danach „verstrichen“. Keine Aussage über tatsächliche Bestellung. Unabhängig von UM-07. | Regel `replaceStatus` | [B] §4 |
| UM-09 | Aufmaßfrist nach Ersatzfrist → „Aufmaß ist erst nach der Ersatzentscheidung fällig“. Keine Fachprüfungsempfehlung bis geklärt. | Regel `warnings` | [B] §4 |
| UM-10 | Ein Hauptschritt nach fester Reihenfolge 1–6 (§5). Weitere zutreffende Aufgaben einmalig unter „Weiterhin offen“. Keine automatische Friständerung, Bestellung oder Freigabe. (A6) | Regel `actions` | [B] §5 |
| UM-11 | Höhe, Anschlag, Zustand als offene Punkte der Fachprüfung, nicht bewertet. | D2 | [B] §2 |
| UM-12 | Regel erhält Betrachtungszeitpunkt explizit. Unabhängig von Systemuhr und Gerätezeitzone. Zeitzone Europe/Berlin beschriftet. (A7) | Regel, D2 | [B]; Wanduhrzeit [Emp] |
| UM-13 | „Beispielaufmaß einsetzen“, „Simulation zurücksetzen“ (Aufmaß leer, 18.11. 14:00). (A7) | D2 | [B]; Details [Emp] |
| UM-14 | Reine Regel vom UI getrennt. Türdaten nur im Speicher. Bestehende Fälle und `localStorage` (`circularflow-testfaelle-v1`) unberührt. (A8) | Architektur | [B] |
| UM-15 | Status als Text, nicht nur Farbe. Tastaturbedienung, sichtbare Beschriftungen. Schmal: Hauptschritt und Fristen vor den Eingaben. | D2 | [Emp] |
| UM-16 | Keine Eignungs-, Freigabe- oder Normaussage. Belegquelle als Text ausgegeben, nicht als HTML. | Texte, UI | [B]; Escaping [Emp] |
| UM-17 | Kurze Startanleitung (Server starten, Seite öffnen, beide Testbefehle). | `prototype/README.md` | [B] §6 |

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

Button mit `data-nav="door"`. [Emp] Zusätzlich Eintrag in der Seitennavigation (F6).

### D2 Türkarte

DOM-Reihenfolge = Lese- = Tab-Reihenfolge.

```
Kopf
  h1 „Tür im selben Umbau“   [Simulation mit Beispieldaten]
  „Tür T-07 mit Zarge aus Raum A → Zielöffnung B-02“  [← Zur Übersicht]
Entscheidung  (aria-live=polite)
  „Nächster Schritt“  <Handlung>  · Rolle: <Planung|Montagebetrieb>
  <ein Satz Grund>
  „Weiterhin offen“  <Liste oder „Nichts weiter offen.“>
Fristen
  Aufmaßfrist           18.11.2026, 16:00 Uhr   <Aufmaßstatus>
  Ersatzentscheidung    19.11.2026, 12:00 Uhr   <Entscheidungsfrist offen|verstrichen>
  [Warnung bei Fristwiderspruch]
  Betrachtungszeit (Europe/Berlin, UTC+01:00)  ( ) 18.11. 14:00 ( ) 18.11. 15:30
                                               ( ) 19.11. 09:00 ( ) 20.11. 09:00
Maßvergleich
  „Rohbauöffnungsbreite B-02“  Ist: <x mm | Aufmaß fehlt>   Soll: 885–895 mm
  Herkunft: fiktives Planungsblatt P-02 · Simulationsannahme
  Messstelle: horizontal zwischen den seitlichen Rohbaukanten von B-02, 1,00 m über OK Rohfußboden
  Befund: <Breitenkriterium erfüllt | verfehlt – 15 mm unter der Untergrenze | offen: Grund>
Aufmaß erfassen
  Wert in mm [___]  Messbezug [Auswahl]  Messstatus [Auswahl]
  Belegquelle [___]  Messdatum [Datum]  Eingang bei der Planung [Datum+Uhrzeit]
  [Beispielaufmaß einsetzen]  [Simulation zurücksetzen]
Weitere Prüfpunkte (Fachperson): Höhe · Anschlag · Zustand – offen, nicht bewertet
```

| Element | Inhalt |
|---|---|
| Messbezug [Emp] | „Rohbauöffnungsbreite B-02, Messstelle laut P-02“ (zulässig), „lichte Breite“, „Türblattmaß“, „nicht angegeben“ |
| Messstatus [Emp] | „gemessen“, „geschätzt“, „vorgeschlagen“, „nicht angegeben“ |
| Wert in mm | Textfeld `inputmode="decimal"`, Komma und Punkt zulässig [Emp] |
| Eingang | `datetime-local`, beschriftet „Europe/Berlin“ |
| Leerzustand | Ist „Aufmaß fehlt“, Befund „Breite offen – Aufmaß fehlt“, Aufmaß ausstehend. Hauptschritt „Rohbauöffnung B-02 an der Messstelle laut P-02 messen oder ein verwertbares Aufmaß nachreichen“ (Montagebetrieb). |
| Fehlerzustand | Grund am Feld und im Befund, z. B. „Erfasster Bezug: Türblattmaß. Erwartet: Rohbauöffnungsbreite B-02, Messstelle laut P-02.“ |
| Erfolgszustand | „Breitenkriterium erfüllt“ + „rechtzeitig eingegangen“. Hauptschritt „Variante zur fachlichen Prüfung vorlegen“ (Planung). „Befund gilt nur für die Breite. Die Eignung prüfen Fachleute.“ |
| Fristwiderspruch | „Aufmaß ist erst nach der Ersatzentscheidung fällig“ |
| Hinweis nach Beispielaufmaß [Emp] | „Eingang 18.11. 15:00 liegt nach der Betrachtungszeit. Betrachtungszeit auf 18.11. 15:30 stellen.“ |
| Statusdarstellung | Immer Text. Bestehende Klassen: erfüllt `status-review`, offen `status-clarify`, verfehlt `status-late` |
| Reset | Aufmaß leer, 18.11. 14:00, Meldung „Simulation zurückgesetzt.“, Fokus auf Überschrift, ohne Rückfrage [Emp] |
| Navigation | „Zur Übersicht“ und Seitennavigation. Zustand bleibt bis Reset oder Neuladen [Emp] |

Tastatur: nur native Elemente, Radiogruppe in `fieldset/legend`, keine Tastaturfalle, `:focus-visible` des Bestands. Ergebnis aktualisieren, ohne Formular neu zu zeichnen. Schmal: Breakpoints 760/480 px, eine Spalte in obiger Reihenfolge.

## 4. Datenmodell und Datenfluss

| Gruppe | Felder | Herkunft / Zuständigkeit |
|---|---|---|
| Fall | id „T-07“, Tür samt Zarge, Herkunft „Raum A“, Ziel „B-02“ | Konstante, fiktiv |
| Anforderung | Bezug „P-02“, Messstelle, minMm 885, maxMm 895, Einheit mm, „fiktives Planungsblatt · Simulationsannahme“ | Konstante, keine Norm |
| Fristen | `measureDeadline` 2026-11-18T16:00, `replaceDeadline` 2026-11-19T12:00 | Konstante, Europe/Berlin |
| Aufmaß | `valueText`, `reference`, `status`, `source`, `measuredOn`, `receivedAt` | Eingabe. Messen: Montagebetrieb. Erfassen: Planung. |
| Betrachtungszeit | `at` | Auswahl, explizit an die Regel |
| Ergebnis | `width`, `measureStatus`, `receipt`, `replaceStatus`, `warnings[]`, `mainStep`, `stillOpen[]`, `otherChecks[]` | Berechnet, nie gespeichert |

```
Eingabefelder (Strings) -> trimmen -> Validierung in der Regel
  -> evaluateDoor({ requirement, measurement, deadlines, at })   [rein, keine Uhr, kein Speicher]
  -> Ergebnisobjekt -> Darstellung (Belegquelle escaped)
```

Zeit: Berliner Wanduhr-Zeichenketten, Vergleich ohne `Date`. November = UTC+01:00. Sommerzeitwechsel außerhalb der Simulation. Speicher: nur Arbeitsspeicher, kein `localStorage`.

Regelreihenfolge (§5):

| Rang | Auslöser | Hauptschritt (Rolle) |
|---|---|---|
| 1 | Ersatzentscheidung verstrichen | Bestellstatus klären (Planung) |
| 2 | Fristwiderspruch oder ungültiger/widersprüchlicher Eingang | Termine klären (Planung) |
| 3 | Ersatz offen und Breite verfehlt | Anpassung fachlich klären oder Ersatzweg vorbereiten (Planung) |
| 4 | Ersatz offen und Aufmaß überfällig oder verspätet | Prüfvorlauf klären (Planung) |
| 5 | Verwertbares Aufmaß fehlt | Rohbauöffnung B-02 messen oder Aufmaß nachreichen (Montagebetrieb) |
| 6 | Breite erfüllt, rechtzeitig, Ersatz offen, widerspruchsfrei | Variante zur fachlichen Prüfung vorlegen (Planung) |

Alle zutreffenden Ränge werden ermittelt. Der erste ist Hauptschritt, die übrigen stehen einmalig unter „Weiterhin offen“.

## 5. Architektur und Dateiplan

Bestand [Beob]: `app.mjs` mit Ansichten `overview/projects/case`, `render()` ersetzt `#page.innerHTML`, Klick-Handler über `data-nav`/`data-action`, `input`-Handler nur für `#case-form`. Speicherschlüssel `circularflow-testfaelle-v1`.

| Datei | Status | Inhalt / Grenze |
|---|---|---|
| `prototype/dist/door-rules.mjs` | neu | `evaluateDoor(...)`, Konstanten, Textbausteine. Kein DOM, kein `Date.now`. |
| `prototype/dist/door-view.mjs` | neu | Karte, Eingabehandler, Zustand im Speicher, Escape-Funktion |
| `prototype/dist/app.mjs` | klein geändert | `navNames.door`, Verzweigung in `render()`, Einstieg in `overview()` |
| `prototype/dist/index.html` | klein geändert | optionaler Navigationseintrag (F6) |
| `prototype/dist/styles.css` | nur additiv | neue Klassen |
| `prototype/test/door.test.mjs` | neu | Fälle 01–13 und Zusatzfälle |
| `prototype/README.md` | geändert | Startanleitung, beide Testbefehle |
| `rules.mjs`, `scenarios.mjs`, `rules.test.mjs` | unverändert | Regression |

Grenzen: kein Framework, Backend, Anmeldung, KI, Upload, 3D, Marktplatz, Versand, Push, Merge, Deployment, keine neue Abhängigkeit (Rev. 2 §6).

Der dokumentierte Befehl `node --test prototype/test/rules.test.mjs` führt die neue Datei nicht aus. Beide Dateien einzeln nennen.

## 6. Abnahme

Status aller Zeilen: **nicht ausgeführt**.

Standard-Aufmaß: 890 mm, Bezug P-02, „gemessen“, fiktive Aufmaßnotiz, Messdatum 18.11.2026, Eingang 18.11.2026 15:00. Standardfristen: Aufmaß 18.11. 16:00, Ersatz 19.11. 12:00. Europe/Berlin.

| Fall | Eingabe und Betrachtung | Erwartung | Anforderungen |
|---|---|---|---|
| 01 | kein Aufmaß, 18.11. 14:00 | Breite offen, Aufmaß ausstehend, Ersatzfrist offen. Hauptschritt Messauftrag. | UM-02, 04, 07, 08, 10 |
| 02 | 890 mm, Eingang 18.11. 15:00, Betrachtung 18.11. 15:30 | Breite erfüllt, rechtzeitig. Hauptschritt Fachprüfung. | UM-05, 07, 10 |
| 03 | wie 02 mit 870 mm | verfehlt, 15 mm unter Untergrenze. Anpassung oder Ersatzweg. | UM-05, 10 |
| 04 | wie 02 mit „lichte Breite“, „Türblattmaß“, Status „vorgeschlagen“, „geschätzt“, Quelle leer, Wert leer, „abc“, 0, -890, Infinity | jeweils Breite offen mit Grund | UM-03, 04, 16 |
| 05 | kein Aufmaß, 19.11. 09:00 | überfällig, Ersatz offen. Prüfvorlauf klären, Messauftrag unter „Weiterhin offen“. | UM-07, 08, 10 |
| 06 | 890 mm, Messdatum 19.11., Eingang 19.11. 09:00, Betrachtung 19.11. 09:00 | erfüllt, verspätet, Ersatz offen. Prüfvorlauf klären. | UM-05, 07, 10 |
| 07 | Standard, Betrachtung 20.11. 09:00 | erfüllt, weiterhin rechtzeitig, Ersatzfrist verstrichen. Bestellstatus klären. | UM-07, 08, 10 |
| 08 | Aufmaßfrist 19.11. 13:00, Ersatzfrist 19.11. 12:00, 18.11. 14:00, kein Aufmaß | Warnung. Termine klären vor Messauftrag. | UM-09, 10 |
| 09 | 885 und 895 mm. Eingang exakt 18.11. 16:00. Betrachtung exakt 19.11. 12:00. | Grenzen erfüllt, rechtzeitig, Ersatzfrist offen. (Erster Teil Betrachtung 18.11. 16:00, abgeleitet, F4.) | UM-05, 07, 08 |
| 10 | 890 mm als „Türblattmaß“, Eingang 18.11. 15:00, 19.11. 09:00 | Breite offen, überfällig. Prüfvorlauf klären, Messauftrag unter „Weiterhin offen“ (abgeleitet, F4). | UM-04, 07, 10 |
| 11 | 890 mm, Messdatum 19.11., Eingang 18.11. 15:00, 19.11. 09:00 | Breite offen, widersprüchlich. Termine klären. Messauftrag und Prüfvorlauf unter „Weiterhin offen“ (abgeleitet, F4). | UM-06, 10 |
| 12 | Standard, Betrachtung 18.11. 14:00 | noch nicht eingegangen, Breite offen, ausstehend, kein Widerspruch | UM-06, 07, 12 |
| 13 | kein Aufmaß, Aufmaßfrist 19.11. 13:00, Ersatzfrist 19.11. 12:00, 20.11. 09:00 | überfällig. Bestellstatus klären. „Weiterhin offen“: Termine klären, Messauftrag. | UM-08, 09, 10 |
| **14 (Browser)** | öffnen, Wert eingeben, Zeit vor/zurück, Reset, bestehenden Fall bedienen | wie oben; CF-DEMO-01 öffnet, bearbeitet, speichert wie zuvor. Ohne Browser „nicht ausgeführt“. | UM-01, 03, 12–15 |

Zusatzprüfungen [Emp]:

| ID | Prüfung | Anforderung |
|---|---|---|
| Z1 | Ungültiger Eingang „2026-11-31T10:00“ → Termine klären. Fehlendes Messdatum → Breite offen. | UM-04, 06 |
| Z2 | Regeltests mit `TZ=Asia/Tokyo` und `TZ=America/Los_Angeles` gleich | UM-12 |
| Z3 | Belegquelle `<img src=x onerror=alert(1)>` als Text | UM-16 |
| Z4 | `localStorage['circularflow-testfaelle-v1']` unverändert | UM-14 |
| Z5 | Tastaturdurchlauf ohne Maus, Fokus nach Reset sichtbar | UM-15 |
| Z6 | ≤ 480 px: Hauptschritt und Fristen vor Eingaben, kein horizontales Scrollen | UM-15 |
| Z7 | 884,9 → verfehlt, 0,1 mm. 895,1 → über Obergrenze | UM-05 |

Regression: 13 Bestandstests unverändert. Browser: Übersicht, Projekte, Vorprüfung, Fall bearbeiten, speichern, neu laden. Kein Diff an `rules.mjs`, `scenarios.mjs`, `rules.test.mjs`.

## 7. Trennung der Bereiche

| Bereich | Inhalt | Nicht Teil davon |
|---|---|---|
| Aktuelle Türsimulation | Eine fiktive Karte mit Regel, Fristen, Hauptschritt, im Speicher | Praxisaussage, Eignungsfreigabe |
| Manuelles Praxisgespräch [Hyp] | Handgeführter Fall, Gespräch, Kriterien vorab festlegen | Software, erfundene Ergebnisse |
| Spätere Produktoptionen | Vorfilter, Praxiszeitpunkte, Herkunftsliste, mehrere Türen, Persistenz, Mehrbenutzer, KI/LiDAR/Upload, Marktplatz | Nicht freigegeben |

## 8. Offene Fragen an Houssam und Feyrouz

| # | Frage | Vorschlag |
|---|---|---|
| F1 | Wo liegt Produktbrief v0.3 §7? Gilt Rev. 2 als Spezifikation? Wie wird die Freigabe dokumentiert? | Rev. 2 + Softwareplanung als Spezifikation mit Vermerk „v0.3 nicht eingesehen“, datierte Freigabe. **Blockiert die Umsetzung.** |
| F2 | Betrachtungszeit nur vier feste Zeitpunkte? | Ja. Fall 09 als Regeltest. |
| F3 | Fristen fest oder editierbar? | Fest. Fristwiderspruch nur im Regeltest. |
| F4 | Abgeleitete Werte für Fall 09, 10, 11 und Behandlung fehlenden/ungültigen Messdatums bestätigen | Wie Abschnitt 6 |
| F5 | Beispielaufmaß stellt Betrachtungszeit auf 15:30? | Nein, Hinweistext |
| F6 | Eintrag in der Seitennavigation? | Ja |
| F7 | Zustand beim Verlassen erhalten, Reset ohne Rückfrage? | Ja |
| F8 | Branch für die Umsetzung | `codex/cf-umbau-01-innentuer` ab `e250a1a` (Prototyp identisch mit `f640e2b`) |
| F9 | Beide Testdateien in `README.md` und `CLAUDE.md` nennen? Welcher lokale Server? | Ja; Server erst nach Prüfung auf dem Zielrechner nennen |
