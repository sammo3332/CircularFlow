# CircularFlow

Stand: 08.11.2026 · Status: Der Entwicklungsbranch enthält eine ausführbare Simulation. Der Hauptzweig bleibt die Projektgrundlage.

Repository: [https://github.com/sammo3332/CircularFlow](https://github.com/sammo3332/CircularFlow) · Eigentümer: `sammo3332` · Sichtbarkeit: privat, am 07.11.2026 geprüft.

CircularFlow untersucht, wie Angebot und Bedarf für Wiederverwendung frühzeitig anhand von Zeit, Standort und Ressourceninformationen koordiniert werden können. Zielgruppe, erster Anwendungsfall und Zahlungsbereitschaft sind noch zu validieren.

## Verbindliche Arbeitsgrundlage

- [Produktbrief](docs/produktbrief.md): einzige maßgebliche Fassung.
- [Entscheidungsverweis](docs/entscheidungen.md): führt zum allgemeinen Entscheidungsprotokoll.
- [AGENTS.md](AGENTS.md) und [CLAUDE.md](CLAUDE.md): Arbeitsregeln für technische Aufgaben.
- Gemeinsamer Einstieg: `00_START_HIER/START_HIER.md` im gesonderten Ablagepaket. Google Drive ist noch nicht verbunden; ein externer Ablagelink fehlt.

## Einrichtung, Betrieb und Prüfung

Der [Prototyp](prototype/README.md) ist eine statische Browseranwendung. Für die Regelprüfung im Repository-Verzeichnis `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs` ausführen. `prototype/dist/` enthält die Website mit fiktiven Testdaten.

Die [Plattform](plattform/README.md) (Entwicklungsbranches) startet mit `python3 -m http.server 8000` vom Repository-Wurzelverzeichnis unter `http://localhost:8000/plattform/`; Tests: `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs`. Der Branch `claude/bold-fermat-t1ngwv` (18.11.2026) macht sie als Web-App installierbar; Installation, geprüfte Umgebungen und Grenzen stehen im Plattform-README.

Vor der ersten Prototypaufgabe festlegen: operative Zielrolle, konkreter Problemfall, erwartetes Bildschirmverhalten und überprüfbare Akzeptanzkriterien. Eine Aufgabe auf einem eigenen Branch bearbeiten; Änderungen und tatsächlich ausgeführte Prüfungen nachvollziehbar zurückgeben. Ausgaben, Veröffentlichung und externe Zusagen benötigen einen entsprechenden Auftrag.
