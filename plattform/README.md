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
