# Übernahme von Claude · 18.11.2026 · Fassung 1.0

Führende KI: ChatGPT. Team: Houssam Taleb und Feyrouz Chahed. Auftrag: Claudes Arbeit prüfen und selbst fortführen. Ein Zugriff auf den vollständigen Claude-Chat besteht nicht.

## Ausgangsstände und Prüfweg

- GitHub selbst gelesen am 18.11.2026: Pitchgestaltung `7c08fc77433a9befb3863f4ca6ec7c35df0f869b`, Entwicklung `747b16cbb6e6b48917cc0f92157d5b1a90330671`, Pitch `fbd6cff4ca7ad7a61d55457fc4681afb8aab65c6`, separater Etikettversuch `427d4b5e5631a8023d645c3994651592c02b1d44`. Die Claude-Abschlussberichte sind übernommene Angaben aus dem Teamgespräch; ihre sämtlichen alten Prüfungen wurden nicht wiederholt.
- Canva selbst gelesen: `DAHbQg1-t6o`, Titel „CircularFlow · Pitch-Gestaltung · drei Musterfolien“, vier Seiten einschließlich einer leeren vierten Seite. Text, Notizen und Seitenstand wurden gelesen, gerenderte erste drei Muster betrachtet. Das Original wurde nicht geändert.
- Alle vier bereitgestellten Projektquellen gelesen: START_HIER und KI-Startpaket v1.0, gemeinsame Arbeitsbasis v1.0, Sprintplan v0.3. Sie beschreiben den frühen Ausgangsstand; aktuelle GitHub-Dateien und der neue Teamauftrag ergänzen ihn.
- Tesseract- und Modelldokumentation im vorangehenden Scan-Versuch am 18.11.2026 selbst geöffnet; Quellen und Modell-Prüfsumme stehen in `plattform/etikett-versuch/README.md`. Die Destatis-Zahl folgt ausdrücklich der vorläufigen Veröffentlichung vom 01.06.2026. Keine aktuelle Endgültigkeit behauptet.

## Umgesetzt

Die bestehende Erfassung kann ein gesondertes Etikettfoto mit lokal bereitgestelltem Tesseract.js 7.0.0 auslesen. Vier Metadaten: Hersteller, Modell/Typ, Seriennummer, Baujahr. Jedes übernommene Feld muss am Foto bestätigt werden. Eingabeänderungen heben die Bestätigung auf. Leere Felder bleiben möglich. Ein erneutes Foto verwirft die alten Etikettvorschläge. Rohtext, Herkunft und bestätigte Angaben werden mit dem Bauteilpass gespeichert und beim Neuladen erhalten. Das Etikettfoto wird verkleinert gespeichert; bei Speicherknappheit kann es entfallen. Maße und Fachfreigabe entstehen nicht aus dem Scan. Die vorherige simulierte Vorschlagsbildung anhand des Fotoformats wird in der Erfassung nicht mehr aufgerufen. Die alte reine Funktion bleibt für historische Tests bestehen.

Sieben einfache Pitchfolien mit 398 Wörtern Sprechtext, großer originaler Produktaufnahme und Quellen in den Notizen. Der Scan ist als technischer Versuch mit synthetischem Testetikett gekennzeichnet. Geschäftsmodell und Vermittlungsablauf sind sichtbar als Erprobung beziehungsweise Planung gekennzeichnet. Die missverständliche zusätzliche Zeitlinie aus dem Canva-Muster entfällt. Das Originalbild bleibt erhalten. Die Fotos anderer Eventpräsentationen dienen nur als interne Stilreferenz. Keine Zahlen, Logos oder Personen daraus übernommen.

## Tatsächlich geprüft

`node --test prototype/test/*.mjs plattform/test/*.mjs plattform/etikett-versuch/test/*.mjs`: 233 vom Node-Testläufer gemeldete Tests, 233 bestanden. Darin 7 neue Integrationstests, 14 Parserfälle und die echte OCR-Ausführung als Testdatei. Der Testläufer zählt auch Hilfs-/Skriptdateien; die Zahl bezeichnet keine 233 getrennten UI-Aktionen. Vollständige Ausgabe: `uebernahme-tests-2026-11-18.txt`.

Echte OCR unter Node auf geradem synthetischem Etikett, schiefem/leicht unscharfem synthetischem Etikett und leerem Bild ausgeführt. Metadaten sowie kein Durchschleusen von Maßen oder Brandschutz geprüft. Ergebnis: `plattform/etikett-versuch/pruefung/ocr-ergebnis-2026-11-18.json`.

Neue Integrationstests prüfen ungeprüfte Angaben als Speichersperre, Übernahme ohne Aufmaß, leere Angaben, korrigierte Herkunft, ungültiges Baujahr, Speichern/Neuladen, HTML-Escaping, Etikettfoto bei Speicherknappheit und die Prüfoberfläche. JavaScript-Syntax geprüft. Sieben Folien gerendert und einzeln betrachtet; PowerPoint-Datei auf Paketstruktur und Geometrie geprüft. PDF per LibreOffice exportiert. Kein nativer PowerPoint-Nachweis.

## Noch offen

Interaktiver Browserlauf ist in dieser Ausführungsumgebung blockiert. Kein Smartphone-/Kameratest, keine Installation als native App oder PWA, keine reale Baustelle und kein Zeitersparnisnachweis. Kein bestätigter Pilot, keine realen Partner, keine Einnahmen und keine Fachfreigabe. Keine unabhängige neue Reviewrunde behauptet. Kein Merge, keine Veröffentlichung, keine Einreichung, keine versendete Nachricht. Das Testpaket ist ein lokaler Web-Prototyp, keine fertige synchronisierte App.

## Genau drei nächste Aufgaben (Zuständigkeit und Fristen vorgeschlagen)

| Aufgabe | Wer / Frist | Abschlusskriterium |
|---|---|---|
| Geräteprobe der Erfassung | Houssam, 19.11., vor der Generalprobe | Am Vortragsrechner und Handy Etikettfoto wählen, korrigieren, Einzelbestätigung, Pass speichern und neu laden. Fehler, Ladezeit und Browser notieren. Ohne bestandene Probe nur das gekennzeichnete Ersatzbild zeigen. |
| Pitch gemeinsam sprechen | Feyrouz und Houssam, 19.11. | Sieben Folien in PowerPoint prüfen und zweimal mit Stoppuhr sprechen. Beide Durchläufe unter fünf Minuten; optionaler Live-Teil höchstens 45 Sekunden. Quellenhinweise und „angenommene Prüfzeit“ mitsprechen, wenn gefragt. |
| Echter kleiner Erfassungsvergleich | Feyrouz Zugang, Houssam Zeitmessung, nach Geräteprobe / Termin mit Fachperson offen | Fünf reale Bauteile mit lesbaren Etiketten je manuell und mit OCR erfassen, Reihenfolge wechseln. Gesamte Zeit bis zum geprüften Datensatz inklusive Korrektur sowie Fehler und Lücken protokollieren. Erst danach Zeitaussage. |

## Fortsetzung

ChatGPT bleibt führend, bis das Team anders entscheidet. Falls Claude wieder übernimmt: Ausgangscommit, diesen Bericht, Produktentscheidungen §6 und die gespeicherte OCR-Ausgabe zuerst lesen. Nächster technischer Auftrag ist das Beheben konkret protokollierter Fehler aus der Geräteprobe. Keine unbeschränkte automatische Bauteilerkennung versprechen.
