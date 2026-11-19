

# CircularFlow Plattform · Pilotstand 19.11.2026

Stand 19.11.2026 · Branch `codex/pilotstand-20261119` · Arbeitsstand für den Pilotbetrieb, keine Veröffentlichung. Der geprüfte
Pitch-Stand (`codex/plattform-v1`, Code `2121b92`) und die geteilte Vorschau bleiben unverändert.

Dieser Stand verbindet den Scan-Stand von ChatGPT (`f3c57a9`, Etikett-Texterkennung) mit der installierbaren Web-App (CF-PWA-01,
`665ffdb`) und ergänzt den Pilotablauf: Bauteil fotografieren → Typenschild auslesen → Angaben prüfen und bestätigen → Bauteilpass
speichern → passenden Bedarf finden → fehlende Angaben und Fristen klären → Prüf- oder Logistikleistung anfragen → Verlauf dokumentieren.
Prüfbericht mit Belegen: [`docs/pruefungen/pilotstand-2026-11-19/README.md`](../docs/pruefungen/pilotstand-2026-11-19/README.md).

## Starten

Einmalig die Texterkennung bereitstellen (Engine und Sprachdateien liegen nicht im Repository):

```sh
cd plattform/etikett-versuch && npm install && npm run vendor && cd ../..
```

Dann **vom Repository-Wurzelverzeichnis** den Pilotserver starten (liefert die Seite aus und hält den gemeinsamen Datenstand):

```sh
node plattform/server/pilotserver.mjs
```

`http://localhost:8000/plattform/` öffnen. Ohne Pilotraum arbeitet die Plattform wie bisher nur mit dem Speicher dieses Browsers.
Alternativ genügt für reine Einzelnutzung weiterhin `python3 -m http.server 8000` vom Wurzelverzeichnis.

**Gemeinsamer Datenstand (Pilotraum):** Raum anlegen, Schlüssel an die berechtigten Personen geben, in der Anwendung unter
„Daten und Pilotraum“ (`#pilotraum`) verbinden.

```sh
node plattform/server/pilotserver.mjs raum-anlegen "Pilot Dortmund"
```

Der Befehl zeigt einmalig einen Bearbeitungs- und einen Leseschlüssel; der Server speichert nur Prüfsummen. Daten liegen als Dateien in
`plattform/server/daten/` (nicht im Repository, Vorversion als `.vorher`). Fremde Räume sind nicht erreichbar, der Leseschlüssel kann
nicht schreiben. Der Server liefert nur `plattform/` und `prototype/dist/` aus. Beim Abgleich gewinnen eigene Änderungen seit dem letzten
Abgleich; gleiche Kennungen aus zwei Browsern werden umbenannt und gemeldet.
Für andere Geräte im selben WLAN die Adresse `http://<IP des Rechners>:8000/plattform/` verwenden (ohne HTTPS keine App-Installation).

**Prüfen:**

```sh
node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs
cd plattform/etikett-versuch && node test/ocr.mjs && cd ../..
node docs/pruefungen/pilotstand-2026-11-19/werkzeug/browserlauf.mjs <Testdatenordner>   # Playwright mit Chromium, startet den Pilotserver selbst auf Port 8010
```

## Klickpfad des Pilotablaufs (Beispieldaten, Stichtag der Demo Mi 18.11.2026, 14:00)

1. **Erfassen** (`#erfassung`): Projekt LH, Raum wählen → Schritt 2: Bauteilfoto, dann „Typenschild fotografieren“ oder
   „Vorhandenes Bild wählen“ (Testbild `plattform/etikett-versuch/fixtures/testetikett.png`). Fortschritt erscheint, Abbrechen ist möglich.
   Ohne Scan: „Angaben ohne Scan eintragen“.
2. Schritt 3: Bauteilgruppe, Menge; Typenschildangaben neben dem Foto prüfen, korrigieren, jede Angabe „Am Foto geprüft“ bestätigen.
   Eine Änderung hebt die Bestätigung auf. Schritt 4: Maße messen oder offen lassen. Schritt 5: Speichern.
   Ohne Bestätigung ist Speichern gesperrt; ein Speicherfehler erscheint als Fehler, nicht als Erfolg.
3. **Bauteilpass** (`#pass-lh-t-13` nach der ersten Erfassung): Angaben mit Herkunft (ausgelesen, manuell eingegeben, am Foto bestätigt,
   gemessen), Typenschild mit Rohtext, letzte Änderung, „Angebot bearbeiten“ (Menge, Verfügbarkeit, Zustand, zurückziehen).
4. **Bedarf finden**: Bauteilpass → „Bedarfe derselben Gruppe“ oder `#abgleich`. Paar öffnen: Ergebnis „Weiter prüfen“, „Angaben fehlen“
   oder „Für diese Entscheidung zu spät“ mit Begründung, fehlender Angabe, nächstem Schritt, Zuständigkeit und Frist; als regelbasiert
   gekennzeichnet. Beispiele: TW-05 → BD-22 (weiter prüfen), T-31 → BD-21 (Angaben fehlen; Bedarf ergänzen), TW-01 → BD-23 (zu spät).
5. **Käuferseite**: auf der Abgleichseite „Interesse festhalten“ (keine Reservierung); „Prüfbitte anlegen“ startet wie bisher den Vorgang.
6. **Anfrage** (`#anfrage-neu-…` von Pass oder Abgleich): Leistung, Unterlagen, offene Fragen, zuständige Person, Termin, Dienstleister,
   Kostentragung → speichern (nicht versenden). Unter `#anfragen` Dienstleister hinterlegen (Testeintrag oder freigegebener Kontakt).
   Verlauf: beauftragt (laut Eintrag) → Ergebnis (positiv, negativ, offene Punkte; nie automatisch) → Klärung, Übergabe, abgeschlossen
   oder abgelehnt.
7. **Verkauf und Provision** (im Bauteilpass): Verkaufsstand eintragen; erst nach „abgeschlossen“ erscheint je vermitteltem Dienstleister
   der Provisionsstatus, der ohne eingetragene Vereinbarung „offen“ bleibt.
8. **Daten und Pilotraum** (`#pilotraum`): Datenstand als Datei sichern oder laden; Pilotraum verbinden.

Zurücksetzen: Erfassen → „In diesem Browser gespeichert“ → „Zurücksetzen“.

## Was echt ist und was nicht (Pilotstand)

| Bereich | Stand |
|---|---|
| Texterkennung vom Typenschild | echt, lokal (Tesseract.js 7.0.0, Sprachdatei `deu`); vier Felder; im Browser geprüft (Chromium). Kein Versand des Fotos |
| Erkennung aus dem Bauteilfoto | gibt es nicht; die frühere Simulation ist aus dem Ablauf entfernt |
| Herkunft je Angabe | echt: ausgelesen, manuell eingegeben, am Foto bestätigt, gemessen, laut Eintrag (Fachergebnis) |
| Speichern | Browserspeicher dieses Geräts; Fehler werden angezeigt; Datei-Sicherung; mit Pilotraum gemeinsamer Stand über den Pilotserver |
| Abgleich, Vorgänge, Anfragen | regelbasierte Einträge von Personen; nichts wird versendet, keine Fachfreigabe |
| Dienstleister | nur eigene Einträge (Testeintrag oder freigegebener Kontakt); keine vorbelegten Partner |
| Verkauf und Provision | Dokumentation laut Eintrag; keine Beträge, keine Prozentsätze, keine Zahlung |
| Beispielprojekte, Personen, Bauteile | fiktiv (unverändert) |

Nicht geprüft: echtes Smartphone, Kamera, Installation als App auf einem Gerät, HTTPS, echte Typenschilder, echte Nutzer.

---

# Entwicklungszusatz: Etikett in den Bauteilpass übernehmen

Stand 18.11.2026 · Arbeitsstand, nicht veröffentlichte Pitch-Vorschau.

Aus dem vollständigen Testpaket im Ordner mit `plattform/` und `prototype/` starten:

```sh
python3 -m http.server 8000
```

`http://localhost:8000/plattform/#erfassung` öffnen. Ort wählen, in Schritt 2 optional ein Typenschild fotografieren oder `plattform/etikett-versuch/fixtures/testetikett.png` wählen. Warten, dann in Schritt 3 jeden Wert am Foto prüfen und bestätigen. Bauteilgruppe, Maße und Verfügbarkeit bleiben getrennte Eingaben. In Schritt 5 speichern und den Bauteilpass öffnen. Hersteller, Modell, Seriennummer, Baujahr und Herkunft bleiben beim Neuladen erhalten. Bei vollem Browserspeicher können Fotos entfallen; die Oberfläche weist darauf hin.

Aus dem Git-Quellstand zuerst im Unterordner `plattform/etikett-versuch` `npm install` und `npm run vendor` ausführen, dann zum Repository-Stamm zurückkehren und den Server starten. Im beigefügten Testpaket sind Engine und Sprachdatei schon enthalten.

Die Foto-Texterkennung arbeitet lokal mit Tesseract.js 7.0.0. Das ist keine Objekterkennung und kein Aufmaß. Die frühere Vorschlagsbildung anhand des Bildformats wird in der Erfassungsoberfläche nicht mehr ausgelöst. Geprüft wurden Regeln, Speichern/Neuladen und HTML-Ausgabe in Node sowie echte OCR auf synthetischen Bildern. Interaktiver Browser, Smartphone, Kamera, App-Installation und reale Baustellen sind noch nicht geprüft. Die Anwendung bleibt ein Web-Prototyp ohne gemeinsame Serverdatenbank oder geräteübergreifende Synchronisation. Die bestehende Karte kann externe Kartenkacheln laden; die OCR sendet das Foto an keinen Dienst.

Der bisherige `bauen-artifact.mjs`-Export wurde für OCR nicht erweitert oder geprüft. Für diesen Versuch die vollständige lokale Ordnerstruktur verwenden.

Prüfbericht und Geräteprobe: `docs/pruefungen/uebernahme-2026-11-18.md`. Der folgende ursprüngliche README-Stand beschreibt die Basis einschließlich der getrennten Fristerweiterung.

---

# CircularFlow Plattform · Fassung 2

Stand 16.11.2026, Entwicklungsstand „Prüfbitte spätestens“ vom 18.11.2026 (Fassung 2, Plan und Regeln: [`docs/plattform-v2.md`](../docs/plattform-v2.md)). Fassung 1 war der erste durchgehende Klickablauf der Arbeitsplattform für Bauteilmanagement und
Wiederverwendung: Dortmund-Karte mit Projekten, Gebäude mit Etagen und Räumen, Bauteilbestand,
Bauteilpass, mobile Erfassung, Zuordnung zu Zielöffnung oder Bedarf, nächster fachlicher Schritt,
Projektradar und Gebäudeansicht. Plan, Entscheidungen und Recherche: [`docs/plattform-v1.md`](../docs/plattform-v1.md).

Alle Projekte, Personen, Räume, Maße und Nachweise sind **Beispieldaten**. Die Radar-Hinweise H-01 bis
H-05 stammen aus öffentlichen Quellen (abgerufen am 15.11.2026) und sind **ungeprüft**. Die Hinweise
B-01 bis B-04 sind erfunden und zeigen den Prüfablauf.

## Entwicklungsstand: Prüfbitte spätestens

Dieser Branch (`codex/plattform-entwicklung-20261118`) ergänzt die Frist „Prüfbitte spätestens“: den letzten Tag, an dem der Abgleich ein Angebot für einen Bedarf bei vollständigen Zeitangaben noch als prüfbar zeigt (der frühere Tag aus Bestellfrist und Ende des Annahmefensters, minus Mindestprüfzeit, in Kalendertagen). Fehlt das Annahmefenster, meldet der Abgleich am Fristtag „Angaben fehlen“, die Bedarfsseite nennt den Tag trotzdem.
Die Übersicht führt sie unter „Zeitkritisch (7 Tage)“, solange ein Angebot prüfbar ist und kein Vorgang läuft, und die Bedarfsseite nennt im Block „Angaben“ den Tag, seine Rechnung und die Herkunft („geschätzt“), bei fehlenden oder ungültigen Angaben „nicht berechenbar“ mit Grund.
Abgleichregel, Vorgangsstatus, Beispieldaten und Speicher bleiben unverändert; Plan und Abnahmekriterien stehen in [`docs/plan-pruefbitte-spaetestens.md`](../docs/plan-pruefbitte-spaetestens.md).

**Starten:** Statischen Server vom Repository-Wurzelverzeichnis starten (`python3 -m http.server 8000`) und `http://localhost:8000/plattform/` öffnen.

**Neue Anzeige sehen** (Klickpfad BA-3, Kurzform): „Bedarfe“ → „Bedarf erfassen“ mit Projekt „SB“, Gruppe „Systemtrennwände“, Titel „Fristtest“, Menge 30, Bestellfrist 30.11.2026, Mindestprüfzeit 6 mit „geschätzt (Annahme)“, Annahmefenster 01.02.2027 bis 31.03.2027, „Speichern“ (die Eingabe der Datumsfelder folgt der Browsersprache, bei Englisch zum Beispiel MM/TT/JJJJ). Dann „Übersicht“: Unter „Zeitkritisch (7 Tage)“ steht „Prüfbitte spätestens · BD-24 · Fristtest“ (Di 24.11., 23:59), die Kopfzeile zählt „5 Fristen“, und die Bedarfsseite BD-24 zeigt den 24.11.2026 mit dem Chip „geschätzt“. Danach den „Stichtag der Demo“ auf „Fr 20.11., 09:00“ stellen: Der Chip der Zeile zählt auf „noch 4 Tg. 14 Std.“. Zum Aufräumen: Erfassen → „In diesem Browser gespeichert“ → „Zurücksetzen“.

**Tests ausführen:** `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs`

Dieser Branch ersetzt die geprüfte Pitch-Vorschau nicht. Pitch-Stand: Branch `codex/plattform-v1`, Code `2121b92`.

## Entwicklungsstand: installierbare Web-App und mobile Erfassung (CF-PWA-01)

Branch `claude/bold-fermat-t1ngwv`, aufbauend auf `codex/plattform-entwicklung-20261118` (`747b16c`). Plan und
Abnahmekriterien: [`docs/plan-pwa-erfassung.md`](../docs/plan-pwa-erfassung.md). Prüfbericht mit Rohausgaben und
Bildern: [`docs/pruefungen/cf-pwa-01/`](../docs/pruefungen/cf-pwa-01/README.md).

**Neu:** Web-App-Manifest und Icons, Installationshilfe unter `#installieren`, größere Felder und Knöpfe am Handy,
zwei Foto-Wege („Foto aufnehmen“ mit Kamera, „Vorhandenes Bild wählen“), Liste der eigenen Erfassungen mit
Vorschaubild, deutlichere Kennzeichnung der lokalen Speicherung.

**Nicht umgesetzt und nicht zugesagt:** Offline-Nutzung (es gibt keinen Service Worker), Synchronisierung zwischen
Geräten, Konto, Server, App-Store. Was am Handy erfasst wird, erscheint nicht am Rechner.

### Als App installieren

Voraussetzung ist eine Adresse mit **HTTPS** oder `localhost`. Über `http://<IP-Adresse>:8000` im WLAN lässt sich
die Seite am Handy benutzen, aber nicht installieren; die Installationshilfe sagt das dann selbst.

- **Am Rechner (Chrome oder Edge):** Server starten (siehe „Starten“), `http://localhost:8000/plattform/` öffnen,
  in der Adresszeile das Installieren-Symbol anklicken oder `#installieren` öffnen und „App installieren“ wählen.
- **Android (Chrome):** Seite über HTTPS öffnen, Menü mit den drei Punkten → „Zum Startbildschirm hinzufügen“ oder
  „App installieren“.
- **iPhone und iPad (Safari):** Seite über HTTPS öffnen, Teilen-Symbol → „Zum Home-Bildschirm“. Die App vom
  Home-Bildschirm hat dort einen eigenen Speicher; vorher in Safari Erfasstes erscheint darin nicht.

Die installierte App startet bei der Erfassung (`#erfassung`) und braucht bei jedem Start die Verbindung zum Server.

**Für ein Handy fehlt noch ein Hosting mit HTTPS.** Die Plattform besteht nur aus statischen Dateien; ausgeliefert
werden müssen `plattform/` und `prototype/dist/door-rules.mjs` mit unveränderter Ordnerlage (also das
Repository-Wurzelverzeichnis). Welcher Dienst das übernimmt, ist nicht entschieden; ein Deployment war nicht
beauftragt. Die veröffentlichte Pitch-Vorschau (claude.ai) lässt sich nicht installieren und bleibt unverändert:
`bauen-artifact.mjs` übernimmt die App-Angaben nicht.

### Was tatsächlich geprüft wurde (18.11.2026)

| Umgebung | Geprüft | Ergebnis |
|---|---|---|
| Node 22, `node --test …` | 218 Tests, davon 8 neu (`test/pwa.test.mjs`) | 218 bestanden |
| Chromium 157 (Headless), Rechner 1280 × 720 | Manifest lädt, Chromium meldet keine Installationshindernisse, Icons werden ausgeliefert; Übersicht, Abgleich, Entscheidungsseite, Erfassung ohne seitliches Scrollen | bestanden |
| Chromium 157 mit Geräteprofil „Pixel 7“ (412 × 839, **Emulation**) | Ablauf Ort → Foto → Bauteil → Angaben → Speichern → Pass → Neuladen → Liste; Zielgrößen und Schriftgrößen gemessen | bestanden |
| Chromium 157 mit Geräteprofil „iPhone 13“ (390 × 664, **Emulation**, kein Safari) | derselbe Ablauf | bestanden |

**Nicht geprüft:** kein echtes Smartphone, kein Safari, kein Firefox, kein Edge; der Installationsdialog selbst und
das Symbol auf dem Startbildschirm; die Kamera (im Lauf wird eine Bilddatei übergeben); eine HTTPS-Adresse. Der
Knopf „App installieren“ erscheint nur, wenn der Browser die Installation anbietet; im Headless-Lauf tat er das
nicht, sein Weg ist deshalb nur über die Tests der Ansicht abgedeckt.

**Browserlauf wiederholen** (Server läuft, Playwright mit Chromium vorhanden):

```sh
python3 docs/pruefungen/cf-pwa-01/werkzeug/testbild.py /tmp/testbild-tuer.jpg
node docs/pruefungen/cf-pwa-01/werkzeug/browserlauf.cjs /tmp/testbild-tuer.jpg
```

## Starten

Einen statischen Server **vom Repository-Root** starten (Windows meist `py` statt `python3`):

```sh
python3 -m http.server 8000
```

Dann im Browser `http://localhost:8000/plattform/` öffnen.

Der Server muss vom Repository-Root laufen, weil die Plattform die geprüfte Türregel aus
`prototype/dist/door-rules.mjs` lädt. Ein Build oder eine Installation ist nicht nötig.

**Auf dem Handy testen** (gleiches WLAN): Server mit `python3 -m http.server 8000 --bind 0.0.0.0`
starten und am Handy `http://<IP-Adresse des Rechners>:8000/plattform/#erfassung` öffnen. Die
Fotoaufnahme nutzt das normale Dateifeld mit Kamera-Option und braucht dafür kein HTTPS.

**Ohne Internet, aber mit erreichbarem Server** (zum Beispiel lokal am selben Rechner) funktionieren alle Ansichten, auch die Karte mit den Stadtbezirken. Ist der Server nicht erreichbar, lädt die Seite nicht; eine Offline-Nutzung gibt es nicht. Nur die
zuschaltbare Straßenkarte (OpenStreetMap) braucht eine Verbindung; beim Zuschalten gehen IP-Adresse
und Herkunftsseite an openstreetmap.org.

## Funktionen der Fassung 2

- **Übersicht** mit Verfügbarkeit im Zeitverlauf, Fristen, passenden Paaren und Arbeitsliste (`#uebersicht`, `#vorgaenge`).
- **Katalog** der angebotenen Bauteile mit Filtern (`#bauteile`).
- **Bedarfe** erfassen und ergänzen (`#bedarf-neu`, `#bedarf-ergaenzen-<projekt>-<id>`); Beispielbedarfe werden als Überlagerung ergänzt.
- **Abgleich** von Angebot und Bedarf mit Typ-, Mengen- und Zeitprüfung (`#abgleich`, `#abgleich-<paar>`), Aktion „Prüfbitte anlegen“. Im Bauteilpass sind Bedarfe mit „zu spät“ oder „Klärung nötig“ nicht zuordenbar.
- **Vorgang** auf der Entscheidungsseite: Statuskette Zuordnung, Prüfbitte, Fachergebnis, Vormerkung, Übergabe geplant, übergeben (Abbruch und „ungeeignet“ als Ende), Checkliste „Was ist zu klären“.
- **Projekt erfassen** mit Gebäude, Etagen und Räumen (`#projekt-neu`); eigene Projekte tragen den Chip „Eigene Eingabe“.
- **Kartenseite** (`#projekte`) mit den zwei dringendsten offenen Entscheidungen samt Frist und Zuständigkeit (seit Fassung 1.1), Reiter Radar und Projekt erfassen.

## Demoablauf in 7 Schritten (Stichtag Mi 18.11., 14:00)

1. Übersicht: Fristen der nächsten Tage, bald verfügbare Positionen, passende Paare.
2. Projekt erfassen (`#projekt-neu`), danach unter Erfassen ein Bauteil in einem seiner Räume erfassen.
3. Katalog: Systemtrennwände filtern, TW-05 öffnen, Bauteilakte ansehen.
4. Rechtzeitig: TW-05 → BD-22, „Weiter prüfen“ mit Reserve und Prüfpunkten.
5. Zu spät: TW-01 → BD-23, Prüfende nach der Bestellfrist, Prüfbitte gesperrt (Grund steht daneben).
6. Unvollständig: T-31 → BD-21 „Angaben fehlen“; Bedarf ergänzen, das Ergebnis wechselt.
7. Koordinieren: Prüfbitte für TW-05 → BD-22 anlegen, Fachergebnis eintragen, vormerken, Übergabe planen; die Übersicht zählt mit.

Zurücksetzen: Erfassen → „In diesem Browser gespeichert“ → „Zurücksetzen“.

Für den Auftritt gibt es einen kürzeren, geprüften Ablauf mit Zusätzen für Fragen der Jury: [`docs/pitch-ablauf.md`](../docs/pitch-ablauf.md).

## Was echt ist und was simuliert

| Bereich | Stand |
|---|---|
| Karte | echt: Leaflet 1.9.4 lokal, Stadtbezirke aus Open Data Dortmund. Straßenkarte optional online |
| Projekte, Gebäude, Räume, Bauteile | Beispieldaten, schematische Grundrisse |
| Foto in der Erfassung | echt: Kamera oder Datei, verkleinert und nur in diesem Browser gespeichert |
| Erkennung aus dem Foto | **simuliert**: schlägt die Bauteilgruppe nur nach dem Seitenverhältnis vor |
| Werte und Status | echt: jeder Wert ist „vorgeschlagen“, „gemessen“, „bestätigt“ oder „fehlt“ |
| Türregel (Zuordnung zu einer Zielöffnung) | echt: geprüfte Regel CF-UMBAU-01 Rev. 2 |
| Doppelbodenregel (Zuordnung zu einem Bedarf) | Entwurfsregel, nicht fachlich geprüft |
| Projektradar | Quellenbewertung echt (Recherche 15.11.2026), kein automatischer Abruf, keine Kontaktaufnahme |
| IFC-Vorprüfung | echt: zählt Geschosse, Räume, Türen im Browser. Import **simuliert** |
| Raumscan | **simuliert** |
| Speichern | nur `localStorage` dieses Browsers. Zurücksetzen unter Erfassung → „In diesem Browser gespeichert“ |
| Installation als App | echt: Manifest und Icons; Installation über den Browser, nur mit HTTPS oder `localhost`. **Keine Offline-Nutzung, keine Synchronisierung zwischen Geräten** |
| Prüfbitte, Fachergebnis, Vormerkung, Übergabe | **simuliert**: Einträge von „Sie“ in diesem Browser, nichts wird versendet. Ein Fachergebnis ist laut Eintrag und keine Fachfreigabe, eine Vormerkung ist unverbindlich |
| Abgleich von Angebot und Bedarf | Entwurfsregel, nicht fachlich geprüft; Mindestprüfzeiten und Annahmefenster der Beispiele sind Annahmen; Lage und Entfernung symbolisch |
| Eigene Projekte, Bedarfe, Grundrisse | Eigene Eingaben, nicht geprüft; Grundriss schematisch |
| Zeit | Fristen der Beispielprojekte folgen der Projektzeit (Simulation, oben links). Radar-Fristen, Meldungen und Prüfschritte nutzen das echte Datum |

## Prüfen

```sh
node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs
```

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Seitenrahmen, lädt Leaflet und `app/main.js` |
| `app/main.js` | Zustand, Router, Ereignisse, Speichern |
| `app/daten.js` | Beispieldaten: Regionen, Projekte, Gebäude, Bauteile, Zielöffnungen, Bedarfe |
| `app/radar-daten.js` | Radar: bewertete Quellen und Hinweise |
| `app/regeln.js` | reine Fachlogik: Werte, Türanforderung, Bodenregel, Zuordnung, Erfassung, Radar, IFC-Vorprüfung |
| `app/zustand.js` | gemeinsamer Datenstand aus Beispieldaten und eigenen Änderungen |
| `app/karte.js` | Leaflet-Karte mit Bezirken und Projektmarkern |
| `app/ui.js`, `app/zeit.js` | Bausteine für die Oberfläche, Datum und Zeit ohne Zeitzone des Geräts |
| `app/ansichten/` | Übersicht (mit Diagramm), Katalog, Bedarfe, Abgleich, Arbeitsliste, Projekt, Gebäude, Bestand, Pass, Entscheidung, Erfassung, Radar |
| `app/abgleich.js`, `app/vorgang.js`, `app/bedarf.js`, `app/projektanlage.js`, `app/kennzahlen.js` | Fachkern der Fassung 2 (ohne Oberfläche) |
| `app/ansichten/bedarfform.js`, `projektform.js`, `vorgangsteil.js` | Formulare und Vorgangsdarstellung |
| `app/uizustand.js` | Zustand der Oberfläche (Filter, Auswahl), unabhängig vom Browser prüfbar |
| `test/ansichten.test.mjs` | rendert alle Ansichten in Node, prüft Kachel-Zahlen gegen Ziellisten |
| `daten/dortmund-stadtbezirke.geojson` | vereinfachte Bezirksgrenzen, Quelle in der Datei |
| `vendor/leaflet/` | Leaflet 1.9.4 mit Lizenz (BSD-2-Clause) |
| `fonts/` | Archivo und JetBrains Mono, SIL Open Font License 1.1 |
| `test/regeln.test.mjs` | Regeltests für `app/regeln.js` |
| `test/abgleich.test.mjs`, `vorgang`, `kennzahlen`, `bedarf`, `projektanlage`, `zustand`, `befunde` | Tests des Fachkerns der Fassung 2 und der Review-Befunde; `_hilfe.mjs` baut den Prüfkontext |
| `test/pruefbittefrist.test.mjs` | Tests der Frist „Prüfbitte spätestens“ (Regel, Gleichlauf mit dem Abgleich, Übersicht, Bedarfsseite, Demo-Stichtag) |
| `manifest.webmanifest`, `icons/` | Angaben und Icons der Web-App; `icons/erzeugen.cjs` erzeugt die PNG-Dateien neu |
| `app/ansichten/installieren.js`, `test/pwa.test.mjs` | Installationshilfe (`#installieren`) und Tests zu Manifest, Icons, Installationshilfe und Foto-Wegen |
| `bauen-artifact.mjs` | erzeugt die Fassung für eine Veröffentlichung als claude.ai-Seite |



## Trefferhinweise für Bedarfe · 19.11.2026

Neuer Entwicklungsstand: Bedarf speichern → Angebote automatisch berechnen → neue Vorschläge ohne Katalogsuche sehen. Die Hauptnavigation zeigt bei „Bedarfe“ die Anzahl neuer Vorschläge. Ein Hinweis oben auf jeder Seite führt zu `#treffer` und von dort zum konkreten Abgleich.

- Neue Bedarfe werden in diesem Browser automatisch beobachtet. Bei bestehenden Bedarfen auf der Bedarfsseite „Über Angebote informieren“ einschalten. Dort lässt sich das Beobachten wieder ausschalten.
- Hinweise verwenden unverändert die bisherige Regel für „Weiter prüfen“ und „Knapp“. Auch Teilmengen können darunter sein; die fehlende Menge wird ausdrücklich angezeigt. Fachliche Eignung, Freitextanforderungen und Maße werden dadurch nicht bestätigt. Keine automatische Zuteilung oder Reservierung.
- Beim Öffnen eines Vorschlags wird dieses Paar als gelesen markiert. Alternativ „Alle als gelesen markieren“. Der Status bleibt im Browser erhalten. Bereits gelesene Paare werden bei Änderungen nicht erneut als neu gemeldet. Aktuell nicht mehr prüfbare oder belegte Paare verschwinden aus den Hinweisen.
- Beobachtung und Lesestatus bleiben getrennt vom gemeinsamen Datenstand, je Browser und Pilotraum. Auf einem anderen Gerät oder nach einem Raumwechsel Hinweise bei Bedarf erneut einschalten. Bei voller oder gesperrter Speicherung erscheint eine Warnung; dann bleiben Einstellungen nur bis zum Neuladen erhalten.
- Im verbundenen Pilotraum erfolgt der vorhandene Datenabgleich bei sichtbarer Plattform alle 20 Sekunden sowie beim Zurückkehren zur Seite. Das gilt jetzt auch, wenn die Verbindung erst nach dem Öffnen eingerichtet wird. Es gibt keine Nachrichten bei geschlossener Plattform, keine E-Mail und kein Push.

Technischer Auftrag, Prüfung und Grenzen: `docs/pruefungen/trefferhinweise-2026-11-19.md`.
