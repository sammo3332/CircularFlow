# CircularFlow Plattform · Fassung 2

Stand 16.11.2026 (Fassung 2, Plan und Regeln: [`docs/plattform-v2.md`](../docs/plattform-v2.md)). Fassung 1 war der erste durchgehende Klickablauf der Arbeitsplattform für Bauteilmanagement und
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
| `bauen-artifact.mjs` | erzeugt die Fassung für eine Veröffentlichung als claude.ai-Seite |
