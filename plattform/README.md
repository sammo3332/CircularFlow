# CircularFlow Plattform · Fassung 1

Stand 15.11.2026. Erster durchgehender Klickablauf der Arbeitsplattform für Bauteilmanagement und
Wiederverwendung: Dortmund-Karte mit Projekten, Gebäude mit Etagen und Räumen, Bauteilbestand,
Bauteilpass, mobile Erfassung, Zuordnung zu Zielöffnung oder Bedarf, nächster fachlicher Schritt,
Projektradar und Gebäudeansicht. Plan, Entscheidungen und Recherche: [`docs/plattform-v1.md`](../docs/plattform-v1.md).

Alle Projekte, Personen, Räume, Maße und Nachweise sind **Beispieldaten**. Die Radar-Hinweise H-01 bis
H-05 stammen aus öffentlichen Quellen (abgerufen am 15.11.2026) und sind **ungeprüft**. Die Hinweise
B-01 bis B-04 sind erfunden und zeigen den Prüfablauf.

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

**Ohne Internet** funktionieren alle Ansichten, auch die Karte mit den Stadtbezirken. Nur die
zuschaltbare Straßenkarte (OpenStreetMap) braucht eine Verbindung; beim Zuschalten gehen IP-Adresse
und Herkunftsseite an openstreetmap.org.

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
| Zeit | Fristen der Beispielprojekte folgen der Projektzeit (Simulation, oben links). Radar-Fristen, Meldungen und Prüfschritte nutzen das echte Datum |

## Prüfen

```sh
node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/regeln.test.mjs
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
| `app/ansichten/` | Startseite, Projekt, Gebäude, Bestand, Pass, Entscheidung, Erfassung, Radar |
| `daten/dortmund-stadtbezirke.geojson` | vereinfachte Bezirksgrenzen, Quelle in der Datei |
| `vendor/leaflet/` | Leaflet 1.9.4 mit Lizenz (BSD-2-Clause) |
| `fonts/` | Archivo und JetBrains Mono, SIL Open Font License 1.1 |
| `test/regeln.test.mjs` | Regeltests für `app/regeln.js` |
| `bauen-artifact.mjs` | erzeugt die Fassung für eine Veröffentlichung als claude.ai-Seite |
