# Trefferhinweise für Bedarfe

Stand: 19.11.2026. Umgesetzt auf eigenem Entwicklungsbranch `codex/bedarf-trefferhinweise-20261119`. Basis: `codex/pilotstand-20261119`, Commit `0a7286597d0f257a491b36e5a6c855d6ca9d08da`. Keine Veröffentlichung, kein Merge, keine Änderung am Pitchbranch.

## Auftrag und Quellen

Aktueller Teamauftrag im Chat: Nach dem Eintragen eines Bedarfs passende Angebote ohne eigene Suche erkennen und darüber in der Plattform informiert werden. Dieser Auftrag autorisiert den hier beschriebenen begrenzten Implementierungsumfang. Er erweitert die bisherige Bedarfsansicht um Hinweise; die Matching- und Fachregeln bleiben bestehen.

Prüfweg: Quelltexte über die GitHub-Schnittstelle am 19.11.2026 selbst gelesen, auf oben genannten Commit festgelegt. Insbesondere `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/produktbrief.md`, `docs/entscheidungen.md`, `docs/produktentscheidungen.md`, `docs/agenten-start.md`, `docs/claude-vor-entwicklung.md`, `plattform/README.md`, `plattform/app/main.js`, `abgleich.js`, Bedarfsansichten, Zustands- und Pilotmodule. Das externe allgemeine Entscheidungsprotokoll ist nicht bereitgestellt. Es wird hier keine zweite allgemeine Entscheidungsliste angelegt.

Beobachtung vor der Änderung: Speichern eines Bedarfs berechnet bereits Angebote. Liste und Detail zeigen Angebote derselben Gruppe, getrennt nach Regelstatus. Eine persistente Beobachtung mit neuen/gelesenen Treffern fehlte. Die bisherige Speichermeldung bezeichnete dabei alle Gruppenangebote pauschal als passend, einschließlich nicht prüfbarer Paare.

## Begrenzter Umfang und Abnahme

1. Nach Anlage eines Bedarfs in diesem Browser ist die Beobachtung an. Bei bestehenden Bedarfen ist sie ausdrücklich einschaltbar. Kein ungefragtes Beobachten aller Beispielbedarfe.
2. Neue Vorschläge erscheinen als Banner auf allen Ansichten und als Zahl bei „Bedarfe“. `#treffer` zeigt den direkten Link zum jeweiligen Angebot-Bedarf-Abgleich, den Regelstatus und den nächsten Schritt. Teilmengen nennen die fehlende Menge.
3. Nur aktuell von der bestehenden Regel als „Weiter prüfen“ oder „Knapp“ eingestufte Paare zählen. Fehlende Angaben, Verspätungen, belegte und zurückgezogene Angebote werden nicht als neue prüfbare Vorschläge gezählt. Die bisherigen Bedarfsansichten bleiben zur Klärung weiterer Kandidaten erhalten.
4. Einzelnes Öffnen oder „Alle als gelesen markieren“ speichert den Lesestatus lokal. Hinweise erzeugen keine Zuordnung, Reservierung, Nachricht oder fachliche Freigabe. Bereits gelesene Paare werden nach Bearbeitungen nicht erneut als neu gemeldet.
5. Beobachtung/Lesestatus sind je Browser und Pilotraum getrennt. Keine Zugangsschlüssel in den Treffer-Einstellungen, keine Übertragung dieser Einstellungen an andere Personen. Kein neuer Dienst oder neue Abhängigkeit. Kein Push/E-Mail-Versand und keine Hintergrundzustellung bei geschlossener Plattform.
6. Gemeinsame neue Angebote werden nach dem vorhandenen Pilotraum-Abgleich berücksichtigt. Der bisherige 20-Sekunden-Takt wird auch bei einer erst nach dem Start eingerichteten Verbindung registriert. Die Tests prüfen diesen nachträglichen Verbindungsfall mit einer simulierten Serverantwort; das ist kein echter Mehrgeräte-Browsertest.

Technische Arbeitsentscheidung: Vorhandene statische JS-Module und `abgleichListe` weiterverwenden; getrennte lokale Einstellungen statt eines gemeinsamen Lesestatus. Begründung: Der Nutzer sieht neue Angebote ohne Suche; das Lesen in einem Browser verändert keine Hinweise bei anderen Personen. Eine personenbezogene Anmeldung ist damit nicht eingeführt. Offene fachliche Frage: Nutzen und gewünschte Hinweishäufigkeit im echten Projekt testen.

## Tatsächlich ausgeführte Prüfungen

```bash
mkdir -p .test-tmp
TMPDIR="$PWD/.test-tmp" node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs
node --check plattform/app/main.js
```

Ergebnis: **252 Tests bestanden, 0 fehlgeschlagen**, einschließlich 13 neuer Tests in `plattform/test/treffer.test.mjs`. Der Syntaxcheck bestand. Gespeicherte Ausgabe: `trefferhinweise-2026-11-19-tests.txt`.

Die neuen Tests prüfen: kein ungefragtes Beobachten; bestehende Regelvorschläge; später eintreffendes Angebot; andere Gruppe; fehlende Angaben/verspätete/zurückgezogene Angebote; Lesestatus nach Neuladen; laufender Vorgang; Ausschalten/Reset; Raum- und Browsertrennung; Speicherausfall; sichere HTML-Ausgabe und Fachgrenzen; Teilmengen; knappes Zeitfenster und Zeitwechsel; automatischer Abgleich nach späterem Verbinden. Die Zusammenfassung betrifft 13 `test`-Blöcke, einzelne Blöcke prüfen mehrere dieser Fälle.

Die bestehende Pilotserver-Testdatei startet einen echten lokalen HTTP-Server und prüft Zugriff, Versionierung und Auslieferung. Das ist von der visuellen Browserprüfung zu unterscheiden.

## Grenzen und notwendiger Sichttest

Kein erfolgreicher Sicht- und Bedienungstest im Browser: Der Zugriff auf `http://localhost:8000/plattform/` in der bereitgestellten Browserumgebung wurde mit HTTP 401 und „Missing or invalid bearer token.“ blockiert. Daher sind Darstellung auf Mobilgeräten, tatsächliche Klickfolge, Fokusführung und ein echter Zwei-Browser-Abgleich hier nicht bestätigt. Keine unabhängige Agenten-Prüfrunde ausgeführt.

Keine Aussage über tatsächliche fachliche Passung oder Zeitersparnis im Betrieb. Anforderungen im Freitext werden unverändert nicht maschinell geprüft. Hinweise gelten für den geladenen Datenstand und den gewählten Demo-Stichtag. Lokale Einstellungen sind keine personenbezogenen Konten. Bei ID-Umbenennungen durch einen Pilotraum-Konflikt die Beobachtung am umbenannten Bedarf erneut einschalten; eine automatische Übertragung auf die neue Kennung ist nicht umgesetzt. Datei-Export enthält bewusst keine Hinweis-Einstellungen.

Nächster überprüfbarer Schritt: Houssam prüft vor Übernahme auf seinem Gerät: neuen Bedarf speichern → Trefferhinweis öffnen → neu laden → kein erneuter Neu-Hinweis; anschließend in zwei verbundenen Browsern ein zusätzliches Angebot erfassen und den Datenabgleich abwarten. Abschlusskriterium: nur das neue prüfbare Paar erscheint als neu und führt zum richtigen Abgleich. Erst anschließend die Übernahme in den gewünschten Nutzungsstand entscheiden.
