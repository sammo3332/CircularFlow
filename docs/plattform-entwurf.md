# CircularFlow Plattform · Planung und klickbarer Entwurf

**Entwurf 0.2 · 15.11.2026 · nach Prüfung durch cf-review · Branch `codex/plattform-entwurf`, Ausgangscommit `086d602`**

Auftrag von Houssam (15.11.2026): Die Produktrichtung ändert sich. Die Türsimulation (CF-UMBAU-01) ist
technische Vorarbeit. Ziel ist eine Arbeitsplattform für Bauteilmanagement und Wiederverwendung in Bau-
und Umbauprojekten. Dieser Stand liefert Recherche, Planung und einen klickbaren Entwurf. Er ist keine
Freigabe einer Umsetzung und ersetzt den Produktbrief nicht (siehe Abschnitt 8).

Klickbarer Entwurf: `entwurf/plattform/` auf Branch `codex/plattform-entwurf` (lokal öffnen siehe dortige README).
Auf Branch `codex/plattform-v1` ist der Entwurf nach `plattform/` übernommen und weiterentwickelt, siehe `docs/plattform-v1.md`.
Alle Projekt-, Personen-, Maß- und Nachweisdaten im Entwurf sind **fiktiv**.

## 1. Aufgabe

| Punkt | Inhalt |
|---|---|
| Nutzerrolle | Planung im Umbau (Hauptnutzer), dazu Bauleitung, Montagebetrieb und Fachprüfung als Beteiligte. Die erste reale Zielrolle bleibt zu bestätigen. |
| Nutzerproblem | Wiederverwendbare Bauteile werden erfasst, aber die Entscheidung je Bauteil hängt an verstreuten Maßen, Nachweisen und Fristen. Ohne klaren nächsten Schritt verstreicht die Ersatzentscheidung und es wird neu bestellt. |
| Gewünschtes Verhalten | Ein Projekt zeigt offene Entscheidungen und Fristen, den Bauteilbestand mit Status, einen Pass je Bauteil mit Herkunft der Angaben und eine Entscheidung je Bauteil und Zielort mit Anforderungen, Zuständigkeit, Fristen und dem nächsten fachlichen Schritt. |
| Ausgeschlossen (Entwurf) | Backend, Anmeldung, Speicherung, Versand, KI-Erfassung, BIM-Import, Ökobilanz, Marktplatz, Eignungs- oder Einbaufreigaben. Ebenso die projektübergreifende Vermittlung von Angebot und Bedarf sowie die Mindestprüfzeit aus Produktbrief v0.2. Die Status „Zur Wiederverwendung vorgemerkt“ und „Nicht wiederverwendbar“ sind nur als Beispieldaten hinterlegt und im Entwurf nicht bedienbar. |
| Akzeptanz Entwurf | Vier Ansichten mit einem Datensatz, Klickablauf A bis D (Abschnitt 5) durchspielbar, Tür nutzt die geprüfte Regel, zweite Bauteilgruppe gezeigt, Beispieldaten erkennbar gekennzeichnet. |

## 2. Recherche: Concular und Madaster

Geprüft am 15.11.2026 anhand öffentlich zugänglicher Seiten. Kein Zugang zu den Anwendungen selbst.
Aussagen über Bildschirme stammen aus Handbuchtext und Bildunterschriften, nicht aus eigener Bedienung.
Was in den abgerufenen Quellen fehlt, kann im Produkt trotzdem vorhanden sein.

### 2.1 Quellen

| # | Quelle | Art und Umfang |
|---|---|---|
| Q1 | [Madaster User Manual (EN)](https://docs.madaster.com/files/en/Madaster%20-%20User%20Manual.pdf), Version 10.12 vom 22.09.2022 | Benutzerhandbuch, Primärquelle. Ausgewertet: Kapitel 1 bis 3 (40 von 53 Seiten). Stand 2022, die Oberfläche kann sich seitdem geändert haben. |
| Q2 | [Concular Plattform](https://concular.de/concular-plattform/) | Produktseite, Primärquelle. Werbetext und Bildunterschriften. |
| Q3 | [Concular Pre-Deconstruction Audit nach DIN SPEC 91484](https://concular.de/din-spec-91484-pre-deconstruction-audit/) | Leistungsseite, Primärquelle |
| Q4 | [Concular Startseite](https://concular.de/) | Leistungsübersicht, Primärquelle |
| Q5 | [Madaster Plattform](https://madaster.com/platform/) | Produktseite. Enthielt beim Abruf keine Angaben zur Struktur, nur Werbetext. |

### 2.2 Beobachtungen

| Thema | Madaster (Q1) | Concular (Q2 bis Q4) |
|---|---|---|
| Ebenen | „Accounts“ → frei definierbare „Folders“ (z. B. Region, Abteilung) → „Buildings“. Rollen und Rechte je Ebene (Q1 §2.1) | Werbeaussage „Vom Portfolio über das einzelne Gebäude bis zum Bauteil im Kreislauf“ (Q2). Eine Datenstruktur ist dazu nicht beschrieben. |
| Reiter bzw. Module | Reiter je Gebäude: General, Dossier (Quelldateien), Building, Building process, Enrich, 3D, Performance (Q1 §2.4, §2.13, §2.25) | Module, keine Ansichten: CircularAsset, CircularLCA, ConcularExchange, CircularHub, Urban Mining Kataster (Q2) |
| Bestandsliste | Reiter „Enrich“: Elementliste mit Suche und „predefined filters on the left side“, Filter nach Elementstatus, Fortschritt der Anreicherung, Sammelbearbeitung (Q1 §2.23) | „Digitales Bauteil-Inventar“, Erfassung vor Ort per App „inklusive Offline-Modus und KI-Unterstützung“ (Q2, Q3) |
| Angaben je Element | Material oder Produkt, Klassifikation, Bauphase, Wiederverwendungsanteil, Demontierbarkeit (Verbindungsart, Zugänglichkeit, Durchdringungen, Produktkanten) (Q1 §2.23) | je Bauprodukt „Produkt- und Verortungsdaten, Mengen, Bemaßung, Zustand und Rückbaufähigkeit“ sowie „eine Bewertung nach Verwertungsstrom“ (Q3) |
| Umbau | Bauprozess mit Phasen Current, Demolition, Casco, New, Final (Q1 §2.13) | Pre-Redevelopment Audit: „Erhalten, umbauen oder rückbauen?“ (Q4) |
| Detail und Dokument | Materialpass als PDF- und Excel-Datei aus den aktiven Quelldateien (Q1 §3) | „Gebäuderessourcenpass und Materialpass mit Restwertberechnung“, „PDA-Produktpässe“ (Q2) |
| Entscheidung | In den ausgewerteten Kapiteln 1 bis 3 nicht als eigene Ansicht beschrieben | Anschlussnutzungskonzept nach DIN SPEC 91525, „technisch, ökologisch, wirtschaftlich geprüft“, und Pre-Redevelopment Audit als Leistungen (Q4). Das Anschlussnutzungskonzept steht auch im Zusammenhang mit Match-Making („Gesuche und Bauteile automatisch abgeglichen“), dazu „Verkaufsfreigaben mit Person und Zeitstempel“ (Q2). Wie Entscheidungen in der Software dargestellt werden, ist öffentlich nicht beschrieben. |
| Auswertung | Dashboards Overview, Mass, Circularity, Embodied Carbon, Benchmarking (Q1 §2.4.1) | CircularLCA-Dashboard mit Emissionen und Nachweisen für DGNB und QNG (Q2) |

### 2.3 Ableitung für CircularFlow

**Übernehmen**
- Klare Ebenen: Projekt → Bauteilbestand → Bauteil. Eine Portfolio-Ebene kommt erst mit mehreren Projekten.
- Bestand als durchsuchbare, filterbare Liste mit Status je Position. Einzelbauteile und Sammelpositionen nebeneinander.
- Angaben je Bauteil in der Logik des Pre-Deconstruction Audits: Verortung, Menge, Bemaßung, Zustand, Rückbaufähigkeit, Quellen.
- Freigaben und Änderungen mit Person und Zeitpunkt im Verlauf.

**Bewusst anders**
- Mittelpunkt ist die **Entscheidung im laufenden Umbau**: Zielort, Anforderungen mit Herkunft, Zuständigkeit, Fristen und genau ein nächster fachlicher Schritt. Eine Ansicht, die diese Punkte je Bauteil zusammenführt, ist in den abgerufenen Quellen beider Referenzen nicht beschrieben. Concular beschreibt Entscheidungsgrundlagen als Leistung und im Zusammenhang mit Match-Making (Q2, Q4). Ob die Software eine solche Ansicht hat, bleibt offen.
- Jede Maßangabe trägt Bezug, Messstatus und Quelle (aus CF-UMBAU-01). Ein Türblattmaß ersetzt kein Aufmaß der Zielöffnung.
- Die Plattform sagt nie „geeignet“. Sie zeigt Befunde je Kriterium und übergibt an die Fachprüfung.

**Jetzt nicht**
- Ökobilanz, CO₂- und Restwertberechnung, Benchmarking, Marktplatz, BIM-Import, KI-Erfassung. Diese Felder sind bei den Referenzen besetzt und für die Entscheidung im Umbau nicht nötig.

## 3. Navigation und Seiteninventar

```
Projekt (Umbau Haus Lindenhof, fiktiv)
├── Übersicht ............ offene Entscheidungen, Fristen, offene Angaben je Rolle, Bestand nach Gruppen, Aktivität
├── Bestand .............. Suche, Filter (Gruppe, Status, Geschoss, offene Angaben), Tabelle
│   └── Bauteilpass ...... Steckbrief mit Skizze, Maße, Quellen und Nachweise, Rückbau, offene Angaben, Standort, Verlauf
└── Entscheidungen ....... Liste
    └── Entscheidung ..... nächster Schritt, weiterhin offen, Anforderungen, Eingaben, Herkunft und Ziel, Fristen, Zuständigkeit, Verlauf
Kopfzeile: Suche über den Bestand · Projektzeit (Simulation) für alle Ansichten
```

| Ansicht | Zweck | Inhalte und Aktionen | Zustände |
|---|---|---|---|
| Übersicht | Was heute entschieden werden muss | Entscheidungen mit nächstem Schritt, Rolle und nächster Frist; maßstäbliche Zeitleiste 18. bis 20.11.; offene Angaben nach Rolle; Statusbalken je Bauteilgruppe; letzte Aktivitäten | Frist „noch …“ oder „seit … vorbei“; keine Frist mehr |
| Bestand | Alle Positionen finden und einordnen | Suche, vier Filter, Treffer, Tabelle mit ID, Bauteil, Standort, Menge, Maßlage, Zustand A bis D, Status, Zahl offener Angaben; Zeile öffnet den Pass | Leerzustand mit „Filter zurücksetzen“; schmal als Karten |
| Bauteilpass | Alles über ein Bauteil mit Herkunft | Skizze (Tür, Doppelboden), Werte, Maße mit Bezug, Status und Quelle, Nachweise mit Stand, Rückbau und Schadstoffe, offene Angaben mit Rolle und Frist, Gebäudeschnitt, Verlauf, verknüpfte Entscheidung | fehlende Nachweise rot, unbekannte Angaben ausgeschrieben |
| Entscheidung | Ein Bauteil an einen Zielort bringen | nächster fachlicher Schritt mit Rolle, Person und Begründung; Aktion je Schritt; weiterhin offen; Anforderungstabelle mit Prüfweg; Maßskala (Tür) oder Mengenbalken (Boden); Eingaben; Fristen; Zuständigkeit; Verlauf | Regel geprüft oder Entwurf sichtbar; Eingabefehler am Feld |

## 4. Datenmodell (Entwurf)

| Objekt | Felder | Herkunft |
|---|---|---|
| Projekt | ID, Name, Phase, Geschosse, Rückbaubeginn | Projektanlage |
| Person | Rolle (Planung, Bauleitung, Montagebetrieb, Fachprüfung), Name, Stelle | Projektteam |
| Bauteil | ID, Gruppe, Name, Typ (Einzelbauteil oder Sammelposition), Menge mit Einheit, Geschoss, Raum, Material, Hersteller, Baujahr, Zustand A bis D mit Text, Status, Erfassung (Zeit, Person) | Begehung |
| Maß | Name, Wert, Bezug, Messstatus (gemessen, aus Bestandsplan, geschätzt, aus Herstellerangabe, fehlt), Quelle, Hinweis | Begehung, Plan, Aufmaß, Nachweis |
| Nachweis | Titel, Art, Eingang (Zeit), von wem, Stand | Dokumente |
| Offene Angabe | Text, zuständige Rolle, Frist | abgeleitet aus Bauteil und Entscheidung |
| Entscheidung | ID, Bauteil, Herkunft, Zielort, Anforderungen (Kriterium, Soll, Quelle, Prüfweg Regel, Nachweis oder Fachprüfung), Fristen (Nachweis- bzw. Aufmaßfrist, Ersatzentscheidung), Zuständigkeit, Regel (geprüft oder Entwurf) | Planung |
| Ereignis | Zeit, Person, Text, Bauteil, Entscheidung, Statuswechsel | jede Aktion |

**Status je Bauteil:** Erfasst → In Bewertung → Entscheidung offen → Fachprüfung angefragt → Zur Wiederverwendung vorgemerkt. Daneben „Nicht wiederverwendbar“ mit dokumentiertem Grund. „Fachprüfung angefragt“ gilt nur, solange die Regel Rang 6 ergibt (offener, widerspruchsfreier Fall nach Rev. 2 §5). Verstreicht danach eine Frist oder fällt das Aufmaß weg, gilt wieder „Entscheidung offen“ mit dem neuen Schritt. Die Vorlage bleibt im Verlauf sichtbar.

**Zustand A bis D:** A kaum Gebrauchsspuren, B Gebrauchsspuren, C Mängel mit Instandsetzungsbedarf, D beschädigt. Skala des Entwurfs nach Sichtprüfung, keine Norm.

**Projektzeit:** Alle Ansichten werten zum selben Zeitpunkt aus. Ereignisse und Eingänge nach der Projektzeit zählen noch nicht. Wer die Zeit zurückstellt, sieht den früheren Stand. In der Simulation sind es die vier Zeitpunkte aus CF-UMBAU-01, im Produkt die tatsächliche Zeit.

**Regeln**
- **E-01 Tür T-07 → B-02:** `prototype/dist/door-rules.mjs` unverändert (CF-UMBAU-01 Rev. 2, 45 Regeltests).
- **E-02 Doppelboden DB-01 → 3.OG:** Entwurfsregel in `entwurf/plattform/app.js` mit derselben Rangfolge (1 Bestellstatus, 2 Termine, 3 Anpassung oder Ersatzweg, 4 Prüfvorlauf, 5 Nachweise oder Angaben beschaffen, 6 Fachprüfung). Kriterien: Rastermaß (Soll gegen gemessenes Ist), Menge mit 10 % Reserve (Grenze eingeschlossen, gerechnet in Hundertstel m²), Aufbauhöhe 150 mm gegen den Verstellbereich aus der Herstellerangabe, Tragfähigkeit nur per Fachprüfung. Eine leere oder ungültige Angabe zur beschädigten Fläche gilt als offen, nicht als null, höchstens zwei Nachkommastellen. **Nicht geprüft.** Mit den Beispieldaten nicht erreichbar und daher nicht durchgespielt: Rang 1 (die Ersatzfrist von E-02 liegt am 20.11. um 12:00, nach dem letzten Zeitpunkt), „Aufbauhöhe außerhalb des Verstellbereichs“ und „Rastermaß verfehlt“.
- **Vorlage:** Eine Vorlage zur Fachprüfung hängt an ihrem Zeitpunkt, nicht an den vorgelegten Werten. Ändern sich Werte danach und bleibt Rang 6, wartet die Entscheidung weiter. Im Produkt muss eine Vorlage die Werte festhalten (offener Punkt O6).
- **Ziellage:** Lage von B-02 im 2.OG und der Raum 3.04 bis 3.06 sind Ausschmückung des Entwurfs. Revision 2 kennt nur „Raum A → B-02“.

## 5. Klickablauf

| Ablauf | Schritte | Ergebnis |
|---|---|---|
| A Projekt verstehen | Übersicht öffnen → nächste Frist „Aufmaßfrist E-01, noch 2 Std.“ → Zeitleiste und offene Angaben lesen | Überblick um 18.11., 14:00 |
| B Tür entscheiden | Übersicht → E-01 → „Beispielaufmaß einsetzen“ (wirkt ab 15:00) → Projektzeit 18.11., 15:30 → Schritt „Variante zur fachlichen Prüfung vorlegen“ → „Zur Fachprüfung vorlegen“ → nächster Schritt „Rückmeldung der Fachprüfung abwarten“ → Bestand: T-07 „Fachprüfung angefragt“ → Pass T-07: Aufmaßnotiz eingegangen, Vorlage im Verlauf | Ein Bauteil vom offenen Aufmaß bis zur Vorlage |
| C Fristablauf | Projektzeit 20.11., 09:00 → E-01 „Bestellstatus klären“ mit Hinweis auf die frühere Vorlage, Status wieder „Entscheidung offen“; E-02 „Prüfvorlauf klären“ | Fristen wirken in allen Ansichten, auch nach einer Vorlage |
| D Sammelposition | Bestand → Filter Doppelboden → DB-01 → Entscheidung E-02 → Nachweise vermerken → Schritt Fachprüfung → beschädigte Fläche 30 m² → „Anpassung fachlich klären oder Ersatzweg vorbereiten“, 5,2 m² fehlen | Mengenabgleich statt Einzelmaß |

## 6. Prüfungen

### 6.1 Unabhängige Prüfung durch cf-review (Fassung `8398c7f`)

| Befund | Behandlung in Entwurf 0.2 |
|---|---|
| Skip-Link sprang zur Übersicht | Knopf, der nur den Inhalt fokussiert. Unbekannte Ansichten zeigen eine Meldung statt stumm der Übersicht. |
| Nach der Vorlage widersprachen sich die Ansichten, und Rang 1 war danach nicht mehr vermerkbar | Status „Fachprüfung angefragt“ folgt der Regellage (nur bei Rang 6). Übersicht und Liste zeigen „Rückmeldung der Fachprüfung abwarten“. Jeder höhere Rang bekommt wieder seinen Knopf und einen Hinweis auf die frühere Vorlage. |
| Leere oder untypische Eingabe zählte beim Doppelboden als gültig | Strenge Zahlprüfung wie bei der Tür. Leer heißt offen. Vergleich in Hundertstel m², Grenze eingeschlossen. |
| „Erfüllt“ beim Doppelboden ohne Wertvergleich | Aufbauhöhe wird gegen den Verstellbereich aus der Herstellerangabe verglichen, das Rastermaß gegen das gemessene Ist. Tragfähigkeit bleibt bei der Fachprüfung. |
| Recherche behauptete mehr als die Quellen | Aussagen auf die abgerufenen Quellen begrenzt. Handbuchfassung, Umfang und Abschnitte genannt. |
| Hinweise: DB-02 widersprüchlich, Verlauf bei unverwertbarem Aufmaß, Fokus nach Knöpfen, toter Tastaturcode, Sortierung, Status ohne Prüfspur, Ziellage, Zustandsskala, Doppelvermerke | Alle umgesetzt oder in diesem Dokument ausgewiesen. |

Nachprüfung durch cf-review auf `8b8a794`: Befunde 1 bis 5 korrekt behoben, keine neuen Fehler im Regelverhalten. Die drei verbliebenen Hinweise (DB-02 ohne offene Angabe, mehr als zwei Nachkommastellen, Formulierung zu Concular) sind danach behoben, ebenso Gestaltung des Skip-Knopfs und doppelte Ansagen. Diese letzte Änderung hat cf-review nicht mehr gelesen; sie ist durch die Ablaufprüfung abgedeckt.

### 6.2 Ausgeführte Prüfungen nach den Korrekturen (15.11.2026)

- `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs`: 45 von 45 bestanden. Bestehender Prototyp und Türregel unverändert.
- Klickablauf mit Playwright und Chromium gegen die Repository-Fassung und gegen die veröffentlichte Fassung: je 56 von 56 Prüfungen bestanden, keine JavaScript-Fehler. Abgedeckt sind die Abläufe A bis D, die Vorlage mit anschließendem Fristablauf, das Zurückstellen der Projektzeit, Grenzwerte der Menge, leere und ungültige Eingaben, DB-02, Filter, Suche, Leerzustand, unbekannte IDs und Ansichten, Fokus nach Knöpfen, Skip-Link und Handybreite 390 px ohne seitliches Scrollen.
- Sichtprüfung per Screenshot: Desktop 1360 px, Handy 390 px, Dunkelmodus.
- Nicht geprüft: Bedienung mit Screenreader (auch die Wirkung der Live-Regionen), andere Browser als Chromium, echte Nutzer.

## 7. Empfehlung: zuerst produktionsnah umsetzen

**Ablauf B als erster Produktionsschritt: Einzelbauteil vom Bestand bis zur Vorlage an die Fachprüfung.**

Begründung:
1. Die Fachlogik ist geprüft (CF-UMBAU-01, 45 Tests) und lässt sich direkt übernehmen.
2. Hier entsteht der eigene Nutzen: rechtzeitig vor der Ersatzentscheidung handeln. Eine solche Ansicht ist in den abgerufenen Beschreibungen beider Referenzen nicht enthalten. Das ist ein Hinweis, kein Beleg, dass es sie dort nicht gibt.
3. Der Ablauf braucht nur drei der vier Ansichten (Bestand, Pass, Entscheidung) und einen kleinen Datenbestand. Er lässt sich mit einem echten Umbau testen.

Voraussetzungen:
- Freigabe der neuen Produktrichtung durch Houssam und Feyrouz mit Datum (O1). Erst danach wird umgesetzt.
- Türregel verallgemeinern: Zielöffnung, Bezug und Texte als Parameter statt fest „B-02“ und „P-02“. Die bestehenden 45 Tests bleiben unverändert grün.
- Speicherung und Projektzeit als echte Zeit. Die Architektur (lokal, Server, Mehrbenutzer) ist offen.
- Datenschutz für Personen- und Fotodaten klären.

Danach: Sammelpositionen mit Mengenabgleich (Ablauf D), sobald ein echter Fall die Kriterien bestätigt.

## 8. Offen vor einer Umsetzung

| # | Frage | Vorschlag |
|---|---|---|
| O1 | Produktbrief v0.2 beschreibt projektübergreifende Vermittlung, die neue Richtung ist Bauteilmanagement im Projekt. Wer gibt die Richtung frei, und wird der Produktbrief fortgeschrieben? | Houssam und Feyrouz beschließen die Richtung mit Datum. Danach Produktbrief als neue Fassung, dieser Entwurf als Anlage. |
| O2 | Erste reale Zielrolle: Planung oder Bauleitung? | Planung, weil sie die Ersatzentscheidung verantwortet. In einem Gespräch prüfen. |
| O3 | Speicherung und Mehrbenutzerbetrieb | Erst nach O1 und einem echten Fall entscheiden. |
| O4 | Entwurfsregel Doppelboden fachlich bestätigen | Kriterien und Reserve mit Fachplanung abstimmen, dann Regeltests wie bei der Tür. |
| O5 | Gestaltung (Schrift, Farben, Dichte) | Entwurf als Richtung bestätigen oder Rückmeldung geben. |
| O6 | Was hält eine Vorlage zur Fachprüfung fest? | Im Produkt die vorgelegten Werte und Nachweise einfrieren. Spätere Änderungen erzeugen eine neue Vorlage. |
