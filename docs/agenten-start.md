# CircularFlow · Vier Rollen für Claude Code

Stand 14.11.2026. Die Agenten sind auf das jeweilige Projekt begrenzt. Die Hauptsitzung koordiniert. Die vier Rollen laufen bei Bedarf und in einer geplanten Reihenfolge.

## Einrichtung aus dem Repository

Die Konfiguration liegt auf `codex/claude-agenten-vorbereitung` im Repository `sammo3332/CircularFlow`. Zuerst im lokalen Repository den Arbeitsbaum und vorhandene Branches prüfen. Lokale Arbeit erhalten. Danach den Remote-Stand abrufen und den vorhandenen lokalen Branch auswählen oder, falls noch nicht vorhanden und der Wechsel sicher ist, einen Tracking-Branch von `origin/codex/claude-agenten-vorbereitung` anlegen. Keine fremden Änderungen zurücksetzen und keinen Merge erzwingen.

Claude Desktop öffnen, **Code → Lokal** wählen und eine neue Sitzung im tatsächlichen CircularFlow-Repository starten. Für die erste Planung reicht der Planmodus; für die spätere freigegebene Umsetzung eignet sich der normale Berechtigungsmodus. Die vier Definitionen stehen im Projekt unter `.claude/agents/`.

Claude ausdrücklich bitten: „Nutze zuerst cf-planung und danach cf-review zur Prüfung des Plans.“ Die Delegation muss im Verlauf mit dem Agentennamen sichtbar sein. Die bloße Existenz der Dateien oder dieses Dokuments beweist keinen Agentenlauf. Wenn die Agenten nicht erkannt werden, lokale Pfade und doppelte Definitionen prüfen und die Sitzung neu starten. Es werden keine Plugins oder kostenpflichtigen Dienste benötigt.

## Vorbereitung vor dem ersten Auftrag

Lies zuerst `docs/claude-vor-entwicklung.md`. Die Hauptsitzung übergibt vorhandene Quellen mit Fassung und fehlende Quellen ausdrücklich als fehlend. Die Planung und ihre unabhängige Prüfung erfolgen vor jeder App-Implementierung. Die Agentendateien werden erst nach Kopieren bzw. Abruf im tatsächlichen lokalen Repository von Claude Code geladen. Eine neue Sitzung ist für die Ersteinrichtung die verlässlichste Prüfung.

## Erster Auftrag für CircularFlow

> Nutze zuerst den Subagenten cf-planung. Gib ihm die relevante Produktfassung, den Softwareplan und CF-UMBAU-01, Revision 2. Er soll Anforderungen, Ablauf, Architektur, jede Ansicht mit konkreten Inhalten und die Abnahmekriterien abgleichen. Zeige mir seinen Plan und die offenen Entscheidungen. Ich gebe den Umfang anschließend gemeinsam mit Feyrouz frei.

## Ablauf nach Freigabe

| Reihenfolge | Agent | Eingabe und Ergebnis |
|---|---|---|
| 1 | `cf-planung` | Aufgabe und Quellen → Plan mit Anforderungen und Abnahme. |
| 2 | `cf-entwicklung` | Bestätigter Plan → Codeänderung, Referenzstand, Dateiliste, Basisprüfungen. |
| 3 | `cf-review` | Bestätigter Plan, vollständiger Diff und Hinweise zu neuen Dateien → priorisierte Befunde mit Fundstellen. |
| 4 | `cf-test` | Bestätigter Plan und konkreter Arbeitsstand → tatsächlich ausgeführte Regeltests und Browserprüfung, falls möglich. |

> Setze den bestätigten Auftrag mit cf-entwicklung um. Gib danach cf-review den Plan, den Diff und die neuen Dateien. Lass cf-test dieselbe Codefassung unabhängig prüfen. Wenn Review oder Test einen konkreten Fehler ergibt, lass cf-entwicklung ihn im genehmigten Umfang beheben und wiederhole die betroffene Prüfung. Melde, was erledigt und was noch offen ist. Veröffentlichungen und die fachliche Freigabe bleiben beim Team.

Für einen neuen fachlichen Umfang geht die Aufgabe zurück in die Planung. Die Hauptsitzung übergibt an jede Rolle nur die für ihren Auftrag relevanten Quellen und Ergebnisse. Alle vier Definitionen verwenden Sonnet als Ausgangseinstellung. Die konfigurierte Alias-Bezeichnung garantiert keine bestimmte Modellversion; die lokale Claude-Code-Sitzung muss das tatsächlich verwendete Modell anzeigen. Die Hauptsitzung beauftragt Reviews gezielt. Das optionale Review Gate bleibt aus.

[Anthropic-Dokumentation zu projektbezogenen Subagenten](https://code.claude.com/docs/en/sub-agents), geprüft am 14.11.2026.
