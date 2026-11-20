# Claude-Empfehlungen vor Entwicklung

Stand: 14.11.2026. Arbeitsfassung für die Hauptsitzung, keine App-Freigabe. Die Agentenkonfiguration ist vorbereitet; ein Lauf in Claude Code auf Houssams Rechner ist damit nicht nachgewiesen.

## Quellen und Prüfweg

Gelesen: bereitgestellte Produktfassung v0.4 (14.11.2026, 19:45, R1–R12); Praxistest-Paket (14.11.2026); maßgebliche Entwicklungs- und Übergabeabschnitte der Zweitbegutachtung v1.1 (14.11.2026, Ergebnisse 8–9); CF-UMBAU-01 Revision 2 (14.11.2026); Softwareplanung CF-UMBAU-01 v0.1; relevante Abschnitte der älteren Entscheidungsvorlage v0.3/CF-DEV-01. Prüfweg: bereitgestellte Projektdateien, PDF-Textextraktion, 14.11.2026. Das ist keine erneute Prüfung der dort zitierten öffentlichen Belege. Die Zweitbegutachtung wurde für diesen Abgleich gezielt, nicht vollständig neu geprüft.

Selbst geöffnete Primärquelle: https://code.claude.com/docs/en/sub-agents (14.11.2026). Projektbezogene Agenten liegen in `.claude/agents/`; Werkzeuglisten begrenzen ihre Werkzeuge. Das dokumentierte Muster wird auf vier Rollen angewendet. Die fachliche Rollenteilung und Prüfreihenfolge unten sind unsere Empfehlung für CircularFlow.

Nicht durch diesen Abgleich geprüft: echter Nutzerbedarf, fachliche Eignung einer Tür, Markt-/Preis-/CO₂-Aussagen, öffentliche Quellen der Claude-Dokumente, aktueller lokaler Windows-Arbeitsbaum. Repositorybasis und Ausführung prüft die Hauptsitzung gesondert.

## Verfügbare Grundlagen im Repository

`docs/grundlagen/CF-UMBAU-01_Revision_2.md` und `docs/grundlagen/Softwareplanung_v0.1.md` sind die bereitgestellten Arbeitsfassungen. Die Claude-PDFs wurden hier ausgewertet; sie sind nicht automatisch im lokalen Claude-Projekt vorhanden. Bei benötigten Einzelheiten fehlende Originale benennen und nicht aus dieser Zusammenfassung zusätzliche Regeln erfinden.

## Entscheidungen und Widersprüche

- **Übernommen als Arbeitsregel, 14.11.2026:** Quellen → Recherche → Anforderungen → Seiten und Datenfluss → Architektur → Abnahmetests → freigegebene Umsetzung. Begründung: Das Team verlangt prüfbare Planung vor Code. Offen: konkrete Freigabe und tatsächliche Ausführung.
- **Änderung gegenüber CF-DEV-01:** Claudes Zweitbegutachtung stellt den React/Vite-Neuaufbau zurück. Revision 2 verlangt bestehendes HTML/CSS/JavaScript, reine Regel und `node --test`. Keine stillschweigende Migration.
- **Fassungen auseinanderhalten:** v0.4 erweitert den Produktvorschlag; sie genehmigt keine Erweiterung der engen Türsimulation. Vier Praxiszeitpunkte ersetzen nicht automatisch Aufmaßfrist, Ersatzfrist, Messdatum, Eingang und Betrachtungszeit der Revision 2.
- **Zusätzlicher Quellenkonflikt:** Laut Prüfung der Hauptsitzung steht `docs/produktbrief.md` noch auf v0.2 mit projektübergreifender Vermittlung; `docs/entscheidungen.md` verweist auf ein hier nicht verfügbares externes Protokoll. Planung muss v0.2, v0.3-Bezug der Revision 2 und v0.4-Vorschlag gegenüberstellen und eine konsolidierte Spezifikation vorschlagen. Ein späteres Dokument überschreibt keine bestätigte Entscheidung automatisch.
- **Testzahlen nicht vermischen:** Ältere Fassungen nennen andere Umfänge. Maßgeblich für Revision 2 sind 13 nummerierte Regelprüffälle plus Browserfall 14 und zusätzlich die bestehenden Regressionstests. Die dort genannten 13 Bestandstests sind eine Projektangabe; ihre tatsächliche Zahl muss am geprüften Commit festgestellt werden. Die acht Prüffälle eines älteren Auftrags und die 13 Fälle von CF-DEV-01 sind keine austauschbaren Nachweise.
- **Kein optionales Review Gate:** Die Hauptsitzung beauftragt Planprüfung und Code-Review ausdrücklich. Keine zusätzlichen automatischen Hooks, Plugins oder Dienste.

## Empfehlungsliste: berücksichtigt bedeutet nicht automatisch implementiert

| Quelle | Empfehlung | Behandlung vor Entwicklung |
|---|---|---|
| v0.4 R1 | Schutzanforderungen: Fachprüfung, niemals Eignungszusage | Übernommen als Grenze; erster technischer Fall ohne Brand-/Rauchschutz. Schall-/Einbruchanforderungen im manuellen Vorfilter klären. |
| R2 | Herkunftsstatus je Wert, fehlende Angaben sichtbar | In Anforderungen abgleichen; Revision 2 hat Messstatus, Quelle und Datum. Vollständige Statusliste ist mögliche Erweiterung. |
| R3 | Maßbezüge und Einheit unterscheiden | In Revision 2 konkret enthalten: Rohbauöffnung P-02 ≠ Türblatt/lichte Breite. |
| R4 | Angebot bekannt, bei zuständiger Person, Entscheidungsfrist, Übergabe möglich | Für manuellen Fallbogen berücksichtigt; Umsetzung und Zuordnung zur bestehenden Zeitlogik offen. |
| R5 | Offene Punkte mit Rolle und Frist | Rollen/Handlungspriorität in Revision 2 enthalten; zusätzliche Frist pro Punkt erst spezifizieren. |
| R6 | Wirtschaftlicher Vorfilter; auch „lohnt sich nicht“ zulassen | Für Praxistest vorgeschlagen. Schwelle und Beurteilung durch Team/Person offen; keine 300-Euro-Regel einbauen. |
| R7 | Gleicher Leistungsumfang, Kostenannahmen transparent | Für Praxisvergleich berücksichtigt; keine automatische Einsparrechnung. |
| R8 | Entscheidungsvorbereitung ohne Einbaufreigabe/Siegel | Übernommen als Produktgrenze und Textprüfung. |
| R9 | Sollwert mit Quelle oder Annahme | Revision 2 nennt P-02 ausdrücklich fiktiv, 885–895 mm als Simulationsannahme. Keine Normtoleranz behaupten. |
| R10 | Datenschutz und zulässige Weitergabe | Keine vertraulichen Originale/Fallnotizen oder Zugangsdaten an weitere Dienste. Keine Namen/Fotos ohne passende Einwilligung. |
| R11 | Erster Test ohne KI/Fotobestimmung | Übernommen; keine KI-, Upload- oder LiDAR-Implementierung. |
| R12 | Audit-Ergebnisse später übernehmen | Zurückgestellt, bis ein echter Fall Bedarf zeigt. |
| Zweitbegutachtung 8a | Handgeführter Fall vor weiterer Software; operative Rolle B oder Türenbetrieb F | Praxisprüfung hat Vorrang. Erster Nutzer bleibt Hypothese; Teamwahl bzw. Gespräch entscheidet. |
| Praxistest-Paket | 30-Minuten-Gespräch, Karte erst nach letztem echten Fall; K1–K6 | Als Vorschlag erfasst. Kriterien, Schwellen und Einwilligung vor Test festlegen; keine erfundenen Ergebnisse. |
| Praxistest-Paket K1–K6 | Fall, Ausfüllbarkeit, Aufwand, Vorfilter, Folgefall, bestehende Lösung | Je Kriterium erfüllt/nicht erfüllt/unbekannt mit Beobachtung; Selbsteinschätzung ist keine gemessene Zeitersparnis. Zwei-Drittel-/Ein-Drittel-Schwellen sind Vorschläge. |
| Zweitbegutachtung 9 | Concular und Pre-Demolition-Audit als Vergleich, keine unbelegte Alleinstellung | Rechercheauftrag offen. Fehlende öffentliche Beschreibung einer Funktion beweist nicht, dass sie fehlt. |
| Zweitbegutachtung 9 | Wettbewerbsblock um Bauteilnetz, Baukreisel, Rotor DC/Opalis, UBA 2015, DBU 2024 ergänzen | Quellenprüfung vor Pitchbehauptungen offen. restado-Zitate über Concular durch passende Primärquelle ersetzen. |
| Zweitbegutachtung 9 | Unbestätigte Produktnamen/Zahlen prüfen | Holyrood Door Finder, allrounderX, Köhnlein, Material Index, Quedlinburg, Digital Door Twin und Concular-Checkliste bleiben bis Primärprüfung unbelegt. Ebenso keine ESG-Pflicht oder pauschalen Einsparwerte übernehmen. |
| Zweitbegutachtung 9 | Vision klar trennen | SmartScan, LiDAR, 3D/AR, Marktplatz, B2C, ExpertCheck-Netzwerk und Siegel sind kein freigegebener erster Umfang. LivePass → Bauteilkarte; ExpertCheck → Vorlage zur Fachprüfung. |
| Zweitbegutachtung 9 | Übergaben mit gelesen/nicht gelesen und Fassungen | Übernommen. Keine automatische Chat-/Dateisynchronisation behaupten. |
| Praxistest/Pitch | Simulation kenntlich, keine Praxisvalidierung behaupten; Einreichungsregeln prüfen | Vor Pitchabgabe tatsächlichen Bau-/Teststand und Teilnahmebedingungen prüfen. Genannte Termine sind hier übernommene Projektangaben, keine neue Veranstalterprüfung. |

## Plan, den cf-planung liefern muss

1. Quellen-/Fassungsabgleich und Anforderungen mit IDs, Nutzerproblem, Akzeptanzkriterium und Status (bestätigt, Beobachtung, Hypothese, Empfehlung).
2. Jede notwendige Ansicht mit Zweck, konkretem Text/Inhalt, Eingaben, Aktionen, Navigation, Leer-/Fehler-/Ergebniszuständen und zugänglicher Bedienung. Keine leeren Seitentitel als Ersatz für UX-Planung.
3. Datenmodell und Datenfluss: Eingabe → Validierung → reine Regel mit explizitem Zeitpunkt → Ergebnis → Darstellung; Herkunft, Maße, Zeitstempel, Zuständigkeit und Speicherverhalten ausdrücklich beschreiben.
4. Architektur im vorhandenen Projekt, Dateiplan, Änderungsgrenzen und begründete Wahl; die vorhandenen Fälle erhalten. App-Code erst nach konkretem Auftrag.
5. Anforderungs-Test-Zuordnung mit Sollwerten, Grenzfällen, Regressionen und Browserablauf. Reviewer prüft diesen Plan vor der Umsetzung; Teamfreigabe wird mit Datum, Umfang und offenen Punkten festgehalten.

## Abnahmegrundlage Revision 2

| Fall | Beobachtbares Soll |
|---|---|
| 01 | Kein Aufmaß: Breite offen, Aufmaß ausstehend, Ersatzfrist offen, Messauftrag. |
| 02 | Gültige 890 mm rechtzeitig: Breite erfüllt, Vorlage zur Fachprüfung. |
| 03 | Gültige 870 mm: 15 mm unter Untergrenze, Anpassung/Ersatzweg. |
| 04 | Falscher Bezug, Vorschlag/Schätzung, fehlende Quelle, leere/ungültige/nicht positive Zahl: offen mit Grund. |
| 05 | Fehlendes Aufmaß nach Aufmaßfrist: Prüfvorlauf klären; Messauftrag bleibt. |
| 06 | Passendes Maß spät eingegangen: Breite erfüllt, verspätet, Prüfvorlauf klären. |
| 07 | Rechtzeitiger Eingang bleibt später rechtzeitig; nach Ersatzfrist Bestellstatus klären. |
| 08 | Aufmaßfrist nach Ersatzfrist: eigenständige Warnung, Termine klären. |
| 09 | 885/895 mm inklusive; exakt Aufmaßfrist rechtzeitig; exakt Ersatzfrist noch offen. |
| 10 | Türblattmaß zählt auch mit frühem Eingang nicht als verwertbares Aufmaß. |
| 11 | Eingang am Kalendertag vor Messdatum: widersprüchlich, unverwertbar, Termine klären. |
| 12 | Betrachtungszeit vor tatsächlichem Eingang: noch nicht eingegangen, kein Terminwiderspruch. |
| 13 | Ersatzfrist abgelaufen plus Fristwiderspruch plus fehlendes Aufmaß: Bestellstatus zuerst, beide übrigen Aufgaben sichtbar. |
| 14 | Browser: öffnen, Eingabe, Zeit vor/zurück, Reset, vorhandenen Fall bedienen. Ohne Browserwerkzeug ausdrücklich nicht ausgeführt. |

Die exakten Daten und Zeitpunkte stehen in Revision 2. Die Kurzliste ersetzt diese Quelle nicht. Ergebnisse werden erst nach tatsächlichem Lauf als bestanden markiert; Regeltest, Browserprüfung und Praxisbeleg bleiben getrennt.

## Geordnete Übergaben

Hauptsitzung → cf-planung → cf-review (Planprüfung) → konkret freigegebener Auftrag → cf-entwicklung → cf-review (vollständiger Diff) → cf-test (gleiche Codefassung). Fehler gehen an cf-entwicklung; danach die betroffenen Prüfungen wiederholen. Keine parallelen Änderungen an derselben Fassung. Jede Übergabe nennt Datum, gelesen/nicht gelesen, Quellfassungen, Ergebnis, offene Punkte und genau einen nächsten Auftrag.

Planung und Review haben ausschließlich Read/Grep/Glob. Test hat zusätzlich Bash zum Ausführen lokaler Prüfungen: damit ist er technisch nicht schreibgeschützt, obwohl seine Anweisung Code- und Teständerungen ausschließt. Entwickler arbeitet nur im genehmigten Umfang. Keine dieser Rollen ersetzt fachliche Freigaben oder eine Betriebssystem-Sandbox.
