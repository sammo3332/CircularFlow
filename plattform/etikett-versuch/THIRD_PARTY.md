# Drittkomponenten

Tesseract.js 7.0.0: Copyright der jeweiligen Projektmitwirkenden, Apache License 2.0. https://github.com/naptha/tesseract.js . Original-Lizenz: `vendor/LICENSE.md`. Zusätzliche gebündelte Hinweise: `vendor/tesseract.min.js.LICENSE.txt` und `vendor/worker.min.js.LICENSE.txt`.

Tesseract.js-Core 7.0.0: WebAssembly-Port von Tesseract, Apache License 2.0. https://github.com/naptha/tesseract.js-core . Original-Lizenz: `vendor/core/LICENSE`.

Englische Sprachdaten `tessdata_fast`, Apache License 2.0. Copyright 1988–1995 Hewlett Packard Company; 2006–2022 Google Inc. https://github.com/tesseract-ocr/tessdata_fast . Herkunft und Prüfsumme in README. Apache-2.0-Volltext in `vendor/LICENSE.md`. Die Originaldateien wurden unverändert übernommen; eigene Ergänzungen liegen außerhalb von `vendor/`.

Die drei Bilddateien unter `fixtures/` sind eigens erzeugte synthetische Testdaten. Sie zeigen weder ein echtes Bauteil noch einen echten Hersteller.

## Erweiterung vom 19.11.2026

Engine und Modelle bleiben unverändert; es wurde kein weiterer KI-Dienst eingebunden. `lesepipeline.mjs` und die Erweiterungen an `etikett.mjs` sind eigene Anwendungsergänzungen außerhalb des Vendor-Ordners.

Die acht zusätzlichen PNG-Bilder in `fixtures/robustheit/` sind eigens erzeugte synthetische Testdaten. Die Marken-/Modell-/Serienangaben sind erfunden. Das Python-Skript `scripts/scan-testbilder.py` erzeugt sie erneut mit Pillow und der Schrift DejaVu Sans. Pillow wird außerdem nur im Node-Bildtest zur Dekodierung/Enkodierung verwendet; es ist keine Browser- oder Produktabhängigkeit. Keine echten Bauteilfotos sind enthalten.

