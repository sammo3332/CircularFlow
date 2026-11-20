# CircularFlow – Claude Code

Lies `AGENTS.md`, `README.md`, `docs/produktbrief.md` und `docs/entscheidungen.md`. Es gelten dieselben Projektanweisungen und derselbe maßgebliche Produktbrief wie für andere Bearbeitende.

Vor Beginn muss die Aufgabe Nutzerproblem, gewünschtes Verhalten, ausgeschlossenen Umfang und überprüfbare Akzeptanzkriterien benennen. Dokumentversion, Branch und Ausgangscommit in der Übergabe festhalten, bei jeder technischen Aufgabe. Keine unkoordinierten Änderungen an gemeinsam bearbeiteten Dateien.

Der Prototyp ist statisch. Die Regeltests (`rules.test.mjs` und `door.test.mjs`) werden mit `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs` ausgeführt. Rückgabe mit Änderung beziehungsweise Commit, beobachtetem Verhalten, ausgeführten Prüfungen und offenen Punkten. Eine erfolgreiche Prüfung niemals ohne Ausführung behaupten.

## Vier Agenten und Vorbereitung vor Entwicklung · 14.11.2026

Für die durch Houssam beauftragte Konfiguration und Planung zuerst
`docs/agenten-start.md` und `docs/claude-vor-entwicklung.md` lesen.
Die Agenten stehen in `.claude/agents/`: cf-planung, cf-entwicklung,
cf-review und cf-test. Die Hauptsitzung koordiniert die Übergaben.
Zuerst Quellen und Anforderungen abgleichen und den Plan unabhängig
prüfen lassen. Danach nur den ausdrücklich freigegebenen
Implementierungsumfang bearbeiten.

Der bestehende Produktbrief v0.2 beschreibt den bisherigen Prototyp.
Die unter `docs/grundlagen/` aufgenommenen Tür-Unterlagen sind
Planungsentwürfe und ersetzen ihn nicht stillschweigend.
Konfiguration und Planungsauftrag sind keine Freigabe einer
Produkterweiterung. Den Quellenwiderspruch vor Umsetzung auflösen.

Keine automatischen Review-Gate-Hooks aktivieren. Keine unnötigen
parallelen Agentenläufe. Für jede Prüfung denselben Codezustand
und tatsächlich ausgeführte Befehle nennen. Fehlenden Browserzugriff
und nicht ausgeführte Tests offen ausweisen.
