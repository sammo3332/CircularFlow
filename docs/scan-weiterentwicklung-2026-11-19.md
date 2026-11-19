# Scan-Erfassung · Auftrag vom 19.11.2026

Basis: `c93cd88c7e60109ea3d04598836488d46e1941dd`, Branch `codex/bedarf-trefferhinweise-20261119`. Neuer, getrennter Entwicklungsbranch: `codex/scan-robustheit-20261119`. Vorhandene Trefferhinweise bleiben enthalten. Pitch, freigegebene Demo, Hauptbranch und Veröffentlichung bleiben unverändert.

Teamauftrag: vorhandenen Scan prüfen, offene Lösungen recherchieren und eine tatsächlich nutzbare Erweiterung implementieren. Es sind keine echten Bauteilfotos für diese Aufgabe bereitgestellt. Das allgemeine Team-Entscheidungsprotokoll ist nicht verfügbar. Die folgenden technischen Einzelheiten sind die umkehrbare Umsetzungsempfehlung innerhalb dieses Auftrags.

## Konkreter Nutzerfall und Umfang

Eine erfassende Person fotografiert ein lesbares Typenschild, möchte weniger abtippen und erkennt fehlende oder widersprüchliche Angaben. Der bestehende CF-SCAN-01 bleibt der kleinste überprüfbare Fall.

1. Weitere übliche deutsche/englische Beschriftungen, einfache Trenner und Beschriftung/Wert auf zwei Zeilen unterstützen. Hersteller, Modell, Seriennummer und Baujahr bleiben die vier Vorschlagsfelder.
2. Vorhandene Tesseract.js-Engine weiterverwenden. Zuerst normal lesen; bei unvollständigem oder schwach bewertetem Ergebnis einen begrenzten zweiten Durchlauf mit Kontrastaufbereitung und anderer Zeilenaufteilung durchführen. Unterschiedliche Lesarten nicht stillschweigend auswählen. Fehlendes und Widersprüche sichtbar lassen.
3. Quer/auf dem Kopf fotografierte Schilder durch wählbare Vierteldrehung erneut lesen. Fortschritt, Abbruch, Zeitlimit und die Bestätigung je übernommener Angabe beibehalten.
4. Nach dem Scan zeigen, welche Etikettfelder fehlen oder geklärt werden müssen. Maße, Menge, Zustand und Verfügbarkeit bleiben getrennte Eingaben; keine fachliche Freigabe aus einem Bild.

Nicht Teil dieser geprüften Umsetzung: allgemeine Erkennung beliebiger Bauteile aus Fotos, Material-/Schadstoff-/Brandschutzdiagnose, verlässliches Fotoaufmaß, Herstellerdatenbank, kostenpflichtige Bilderkennung oder ungefragte Bildübertragung. Mögliche spätere Verfahren werden recherchiert und als solche benannt.

## Abnahme

- Echte OCR auf klar als synthetisch markierten Bilddateien läuft durch denselben Leseablauf wie die Plattform; klare, alternative Beschriftungen, schwacher Kontrast, gedrehte Aufnahme und leeres Bild werden geprüft. Ergebnisse und tatsächliche Laufzeiten speichern; keine Baustellen-Erkennungsrate daraus ableiten.
- Automatisierte Tests prüfen verschiedene Beschriftungen, Konflikte zwischen Durchläufen, fehlende Felder, Bestätigungszwang, Herkunft, Speicher-/Pass-Integration und vorhandene Plattformregeln.
- Keine freie Auslegung unbekannter Texte als bestätigte Eigenschaften. Kein Fachwert erhält durch die Erweiterung den Status „gemessen“.
- Ein Browser-/Kameranachweis wird nur nach tatsächlichem Durchspielen behauptet. Echte Fotos und ein Zeitvergleich mit manueller Erfassung bleiben eigener Praxisnachweis.

## Recherche und Wahl

Öffentliche Primärquellen am 19.11.2026 selbst geöffnet; keine vollständige Suche sämtlicher GitHub-Projekte und kein Benchmark aller Kandidaten. Veröffentlichte Funktionen sind von der folgenden CircularFlow-Empfehlung getrennt.

| Projekt / Primärquelle | Veröffentlichte Fähigkeit / Codelizenz | Empfehlung für CircularFlow | Tatsächlich ausgeführt |
|---|---|---|---|
| [Tesseract.js](https://github.com/naptha/tesseract.js) | Texterkennung im Browser und Node mit WebAssembly; Apache-2.0. Die vorhandene Installation ist auf 7.0.0 festgelegt. | Vorhandene lokale Engine beibehalten, Eingabe-/Feldverarbeitung verbessern. Keine automatische Datenbankrecherche daraus ableiten. | Ja, lokale CPU mit deutschem LSTM-Modell, acht synthetische Bildfälle. |
| [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) | OCR-/Dokumentwerkzeuge, Code Apache-2.0. | Kandidat für einen späteren gesonderten Vergleich bei komplexeren Schildern/Dokumenten; zusätzliche Laufzeit und Modelle erst anhand echter Fehlschläge begründen. | Nur Quelle geprüft; nicht installiert oder mit CircularFlow-Bildern getestet. |
| [docTR](https://github.com/mindee/doctr) | Dokument-Texterkennung mit PyTorch, Apache-2.0. | Ebenfalls möglicher Vergleichskandidat, keine notwendige zusätzliche Server-/Python-Architektur für den jetzigen Fall. | Nur Quelle geprüft. |
| [Transformers.js](https://github.com/huggingface/transformers.js) | Bildklassifikation, Objekterkennung und Zero-Shot-Verfahren im Browser; Bibliothek Apache-2.0. Modellabhängige Dateien und Anforderungen kommen hinzu. | Vorschlag für späteren klar begrenzten Bauteilgruppen-Versuch, z. B. Tür/Fenster/Leuchte/„unklar“. Kein Beleg, dass ein beliebiges Modell zuverlässig Bauteileigenschaften erkennt. Ausgewählte Modelllizenz und Geräteverhalten separat prüfen. | Nur Quellen geprüft, keine Bildklassifikation in die App eingebaut. |
| [ZXing Browser](https://github.com/zxing-js/browser) | Bar-/QR-Code-Lesen aus Bild und Kamera, MIT. | Sinnvoll, wenn ein echter Fall lesbare Identifikationscodes und eine bekannte Datenquelle bietet. Ein Code enthält nicht automatisch alle Bauteildaten. | Nur Quelle geprüft. |

Zusätzliche Primärquelle: [Hugging Face, WebGPU-Anleitung](https://huggingface.co/docs/transformers.js/guides/webgpu), geöffnet 19.11.2026. Die Möglichkeit lokaler Modelle ist kein Nachweis einer zuverlässigen CircularFlow-Funktion. Es wurden keine Fotos an diese Projekte oder externe KI-Dienste übertragen, keine Dienstverträge geschlossen und keine Kosten ausgelöst.

Technische Wahl: Tesseract.js 7.0.0 und vorhandenes deutsches Modell beibehalten. Keine neue Produktabhängigkeit. Kontrast und Feldzuordnung sind eigene, regelbasierte Anwendungsergänzungen. Tesseract nutzt ein trainiertes Erkennungsmodell; daraus wird keine allgemeine visuelle Bauteil-KI. Engine-Confidence ist keine kalibrierte Richtigkeitswahrscheinlichkeit. Die Versuchsschwelle 80 löst nur einen zusätzlichen Durchlauf aus und braucht Praxisprüfung. Eine höhere Erkennungsrate durch Kontrast ist durch die hier gewählten Bilder nicht belegt.

## Tatsächlich ausgeführte Prüfungen

```bash
mkdir -p .test-tmp
TMPDIR="$PWD/.test-tmp" node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs plattform/etikett-versuch/test/parser.test.mjs
python3 plattform/etikett-versuch/scripts/scan-testbilder.py
TMPDIR="$PWD/.test-tmp" node plattform/etikett-versuch/test/robustheit.mjs
node --check plattform/app/main.js
node --check plattform/app/etikett-integration.js
```

**279 Tests bestanden, 0 Fehler.** Davon 13 neue Fälle in `plattform/test/scan-robustheit.test.mjs`; zusätzlich zu den vorherigen 252 Plattform-/Regeltests wurden 14 bereits bestehende Parserfälle mit ausgeführt. Der eigene OCR-Bildlauf ist gesondert zu zählen, nicht als Smartphone-Test. Syntaxchecks bestanden. Gespeicherte Testausgabe: `docs/pruefungen/scan-robustheit-2026-11-19-tests.txt`.

Acht Bilder wurden tatsächlich durch Tesseract gelesen, anschließend durch denselben `leseTypenschild`-Ablauf wie in der Plattform verarbeitet. Ergebnisse mit Rohtext, Herkunft, einzelnen Vorschlägen und tatsächlichen Laufzeiten: `plattform/etikett-versuch/pruefung/robustheit-2026-11-19.json`.

| Synthetisches Bild | Beobachtetes Ergebnis |
|---|---|
| Klar | Vier Sollwerte korrekt vorgeschlagen; ein Durchlauf. |
| Alternative Beschriftung | Vier Sollwerte korrekt vorgeschlagen; ein Durchlauf. Der alte Parser erkennt aus dem gleichen gespeicherten ersten OCR-Text 0 statt 4 Feldern. |
| Kontrastarm | Vier Sollwerte korrekt vorgeschlagen; schon im ersten Durchlauf. Keine hier gemessene Verbesserung durch Kontrast nötig. |
| 90 Grad gedreht | Keine der vier Angaben vorgeschlagen, auch nach zweitem Durchlauf. Drehkorrektur erforderlich. |
| Gedreht und korrigiert | Vier Sollwerte korrekt vorgeschlagen. Die Bildkorrektur im Test erfolgte mit Pillow, die entsprechende Canvas-Bedienung ist nicht im Browser nachgewiesen. |
| Unscharf | Vier Sollwerte nach zwei Durchläufen; schon im ersten Rohtext lesbar. Kein belegter Genauigkeitsgewinn durch den zweiten Durchlauf. |
| Widerspruch | Hersteller uneindeutig, kein Hersteller ausgewählt. |
| Leer | Keine Werte erfunden. |

Vier positive Fälle mit je vier vorgegebenen Sollwerten, der Widerspruch und das leere Bild sind durch Assertions abgesichert. Gedrehtes und unscharfes Bild sind zusätzliche dokumentierte Grenzbeobachtungen. Der gespeicherte Alt-Neu-Vergleich (`vergleich-parser-2026-11-19.json`) betrifft Feldzuordnung und neue Pipeline, keinen Vergleich verschiedener OCR-Engines. 

## Grenzen und Übergabe

Die Browser-Sichtprüfung dieser Fassung wurde versucht. `http://localhost:8001/plattform/#erfassung` zeigte auch im verfügbaren Chromium nur „Missing or invalid bearer token.“. Kein abgeschlossener UI-, Upload-, Canvas-Drehungs- oder Kameratest. Die automatisierten Tests prüfen Rendertexte und Abläufe, ersetzen aber keine sichtbare Browserbedienung. Keine unabhängige Agenten-Prüfrunde ausgeführt.

Keine echten Bauteilfotos bereitgestellt, keine gemessene Baustellen-Erkennungsrate, keine gemessene Zeitersparnis. Keine neue allgemeine Bauteilerkennung aus Fotos implementiert. Ein Baujahr/Hersteller, der nicht sichtbar beschriftet ist, wird nicht erfunden. Handbestätigung ist weiterhin zwingend; die Fachprüfung bleibt bei qualifizierten Personen. Fotos werden beim Lesen lokal verarbeitet. Erst ein ausdrücklich gespeichertes Bauteil kann im aktivierten Pilotraum nach der bestehenden Funktion geteilt werden.

Nächste drei Aufgaben:

1. **Houssam, vor Übernahme in einen Vorführstand:** Auf dem tatsächlichen Gerät ein Testetikett wählen, bei Bedarf drehen, erneut lesen, vier Werte bestätigen, speichern und nach Neuladen im Pass prüfen. Abschluss: richtige Herkunft, keine Übernahme ohne Bestätigung und kein Maßstatus durch den Scan.
2. **Feyrouz und Houssam, vor einer Zuverlässigkeitsaussage:** Drei freigegebene echte Typenschilder sammeln und manuelle Referenzwerte festhalten; anschließend Korrekturen und gesamten Erfassungsaufwand messen. Abschluss: dokumentierte Feldfehler und Zeiten, auch bei Fehlschlägen.
3. **Team, nach diesen Fällen:** Entscheiden, ob mehr OCR-Robustheit, Code-Lesen oder eine Bauteilgruppen-Erkennung den größten zusätzlichen Nutzen hat. Abschluss: genau ein Folgefall mit Sollwerten und abgrenzbarem Test.

