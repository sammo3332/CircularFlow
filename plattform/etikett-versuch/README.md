# CircularFlow · Etikett auslesen

Stand 18.11.2026 · technischer Versuch v0.1.0 · kein freigegebener Pitch-Stand.

## Was tatsächlich gebaut wurde

Ein eigenständiger mobiler Web-Versuch für echte Texterkennung (OCR) aus einem Foto eines Typenschilds. Tesseract.js liest die Bildpixel lokal. Hersteller, Modell/Typ, Seriennummer und Baujahr werden nur bei erkennbarer Feldbeschriftung vorgeschlagen. Die Person kann korrigieren, jede übernommene Angabe am Foto bestätigen, einen geprüften Entwurf lokal speichern und JSON exportieren. Etikettwerte werden bestätigt, niemals als gemessen markiert.

Die bestehende CircularFlow-Erfassung schlägt dagegen nur anhand des Foto-Seitenverhältnisses eine Bauteilgruppe vor. Dieser Versuch ersetzt sie noch nicht. Er erkennt **keine Tür aus ihrem Aussehen**, misst nichts und beurteilt weder Material noch Eignung, Brandschutz oder Schadstoffe. Fotoverarbeitung und Metadatenvorschlag sind ein erster, eng begrenzter Teil einer späteren Scan-Funktion.

## Start aus dem vollständigen Testpaket

Im entpackten Ordner, der `index.html` enthält:

```sh
python3 -m http.server 8000
```

Dann `http://localhost:8000/` öffnen. Nicht per Doppelklick als file:// öffnen. Das Paket enthält die Browser-Engine, Kerne und Sprachdatei lokal; für die Oberfläche ist keine Node-Installation nötig. Ein Auslieferungsserver bleibt notwendig; es gibt noch keinen Service Worker und keine Offline-Installation.

Am Handy im selben WLAN kann der lokale Server über seine LAN-Adresse geöffnet werden (`python3 -m http.server 8000 --bind 0.0.0.0`). Diese LAN-Bereitstellung ist eine eigene Entscheidung am Vortragsrechner, hier nicht gestartet. Fotoaufnahme verwendet das normale Dateifeld mit Kameraoption. Ein richtiger Smartphone-Test wurde hier noch nicht ausgeführt.

## Start aus dem GitHub-Quellstand

Die großen Engine-/Sprachdateien werden nicht ins Git-Repository aufgenommen. Zum Vorbereiten im Ordner dieses Versuchs:

```sh
npm install
npm run vendor
python3 -m http.server 8000
```

`npm run vendor` kopiert Tesseract.js/Core 7.0.0 aus den lokalen Node-Abhängigkeiten. Die englische Sprachdatei wird aus einem fest angegebenen Upstream-Commit geladen und per SHA-256 überprüft. Alternativ `CF_TESSDATA_FILE=/absoluter/pfad/eng.traineddata npm run vendor` mit derselben geprüften Datei verwenden. Beim Fotoauslesen selbst wird kein Bild an einen Dienst gesendet. Alle Auslieferungsdateien stammen vom selben Server; eine Content-Security-Policy begrenzt Verbindungen entsprechend.

## Drei Schritte im Versuch

1. Ein Typenschild nah, gerade und scharf fotografieren oder das ausdrücklich synthetische Testetikett wählen.
2. Etikett auslesen. Jeden vorgeschlagenen Wert am Bild prüfen, gegebenenfalls korrigieren und bestätigen. Fehlendes darf leer bleiben. Widersprüchliche Werte werden nicht ausgewählt.
3. Geprüften Entwurf lokal speichern oder als JSON herunterladen. Er ist noch **nicht** im CircularFlow-Bestand. Maße und Fachfreigabe bleiben fehlend. Änderungen an einem Feld heben dessen Bestätigung wieder auf.

Das Foto bleibt im Arbeitsspeicher dieser Seite und wird beim Speichern nicht abgelegt. Im lokalen Entwurf stehen die bestätigten Metadaten und der erkannte Text. Löschen betrifft nur den Speicherbereich dieses Versuchs, nicht den bisherigen Plattform-Speicher. Maximal zehn Entwürfe; keine Synchronisation zwischen Geräten. Englisch trainiertes OCR-Modell: deutsche Sonderzeichen und komplexe Layouts müssen besonders sorgfältig geprüft werden.

## Tatsächlich ausgeführte Prüfungen

- 14 Regeltests bestanden: fehlende Werte, widersprüchliche Etiketten, unklare Jahre, Bestätigung, Korrektur, kein Aufmaß und kein Durchschleusen von Brandschutzangaben.
- Echte OCR mit Tesseract.js 7.0.0 unter Node.js auf lokaler CPU: gerades synthetisches Etikett, um 4 Grad gedrehte/leicht unscharfe Variante und leeres Bild. Bei beiden Etiketten wurden die vier erwarteten Metadaten ausgelesen; das leere Bild erzeugte keine Metadaten. Vollständige Ausgabe: `pruefung/ocr-ergebnis-2026-11-18.json`.
- JavaScript-Syntax geprüft. Lokale Auslieferungsdateien und Lizenzen mitgeliefert.
- **Nicht ausgeführt:** interaktiver Browserablauf, Smartphone/Kamera, Installation als App, Import in den Plattformbestand und Erfassungszeitvergleich. Die Browserausführung ist in dieser Umgebung blockiert. Deshalb keine fertige Smartphone-Demo behaupten.

Für die Tests aus dem Quellstand erst `npm install` und `npm run vendor`, dann:

```sh
npm test
npm run test:ocr
```

Die OCR-Laufzeiten in der JSON-Datei betreffen nur diese synthetischen Bilder und diese CPU. Sie sind keine Messung von Zeitersparnis bei Fachleuten.

## Nächster Vergleich mit echten Bauteilen

Fünf Bauteile mit lesbaren Etiketten. Dieselben vier Metadaten je einmal manuell und einmal mit OCR-Unterstützung erfassen; Reihenfolge zwischen den Fällen wechseln. Zeiten vom Aufnehmen/Öffnen bis zum vollständig geprüften Datensatz messen, Korrekturen einbeziehen, richtige/leere/falsche Angaben festhalten. Nicht vorhandene Etikettangaben nicht als OCR-Fehler zählen, sondern als fehlende Daten dokumentieren. Vorlage: `pruefung/praxisvergleich.csv`. Erst nach dem Vergleich eine konkrete, auf diesen Test begrenzte Zeitaussage formulieren.

## Quellen und Lizenzen

- Tesseract.js und Tesseract.js-Core 7.0.0, Apache-2.0: https://github.com/naptha/tesseract.js und https://github.com/naptha/tesseract.js-core . Lizenztexte und Hinweise bleiben in `vendor/` erhalten.
- Englisches LSTM-Modell aus `tesseract-ocr/tessdata_fast`, Apache-2.0, Commit `65727574dfcd264acbb0c3e07860e4e9e9b22185` (Tag 4.1.0), Blob `bbef4675053b5b468cdb477053e28b1c698ba08e`. Die vorhandene lokale Datei wurde am 18.11.2026 gegen den Upstream-Git-Blob geprüft. SHA-256 `7d4322bd2a7749724879683fc3912cb542f19906c83bcc1a52132556427170b2`.
- Browser-API und lokale Pfade, Primärquelle am 18.11.2026 geöffnet: https://github.com/naptha/tesseract.js/blob/master/docs/api.md .
- Spätere Objekt-/Bilderkennung: Microsoft Florence-2-base, MIT laut Modellkarte, Objekterkennung/OCR/Bildbeschreibung. Modellkarte am 18.11.2026 geöffnet, **nicht im Versuch ausgeführt**: https://huggingface.co/microsoft/Florence-2-base .
- Spätere Raumgeometrie: Apple RoomPlan, Kamera und LiDAR auf passenden Apple-Geräten; native Swift-Schnittstelle, kein automatisch in der PWA vorhandener Raumscanner. Originalseite am 18.11.2026 geöffnet: https://developer.apple.com/augmented-reality/roomplan/ .
- Konkurrenzbeobachtung, nicht unabhängig erprobt: ConcularExchange nennt mobile Web-App und KI-Vorschläge aus Fotos. Originalseite am 18.11.2026 geöffnet: https://exchange.concular.de/mobile-app . Ein Foto-Scan ist daher kein belegtes Alleinstellungsmerkmal für CircularFlow.

## Übergabe an Claude

Stand und Datum zuerst prüfen, dann `AUFTRAG.md`, diese README und die echte OCR-Ausgabe lesen. Einziger nächster technischer Auftrag: Browser- und Smartphone-Ablauf dieses Versuchs ausführen, belegte Fehler korrigieren und die Übernahme der bestätigten Metadaten in einen Erfassungsentwurf der Plattform vorschlagen. Eine UI-Bestätigung ist keine fachliche Bestätigung eines Bauteils. Keine Daten oder Regeln des Pitch-Stands überschreiben. Kein Merge, Deployment und keine neue Jurybehauptung ohne passenden Nachweis. Falls nach der Geräteprüfung integriert wird, die bisherigen Simulationsvorschläge eindeutig vom echten OCR-Ergebnis trennen.
