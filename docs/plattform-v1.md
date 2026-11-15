# CircularFlow Plattform v1 · Produkt- und Umsetzungsplan

**Fassung 1.0 · 15.11.2026 · Branch `codex/plattform-v1`, Ausgangscommit `a89d1e3` (Plattform-Entwurf 0.2)**

Auftrag von Houssam (15.11.2026): CircularFlow wird eine Arbeitsplattform für Bauteilmanagement und
Wiederverwendung in Bau- und Umbauprojekten. Erster Klickablauf: Karte → Projekt und Raum → mobile
Erfassung → Bestand → Bauteilpass → nächster Schritt zur Wiederverwendung. Dazu Projektradar und
Gebäudeansicht mit erkennbarem Stand. Reversible Produkt- und Designfragen entscheidet die Umsetzung.

Alle Projekte, Gebäude, Räume, Personen und Bauteile sind **Beispieldaten**. Echt sind die Dortmunder
Bezirksgrenzen (Open Data) und die Quellenbewertung des Radars.

Verhältnis zum Produktbrief: Der Produktbrief v0.2 bleibt die maßgebliche Spezifikation des bisherigen Prototyps
und wird durch diesen Plan nicht ersetzt. Die neue Produktrichtung aus dem Auftrag vom 15.11.2026 muss nach Durchsicht
in den Produktbrief übernommen werden. Bis dahin ist die Plattform ein beauftragter Prototyp auf eigenem Branch.

## 0. Aufgabe

- **Nutzerproblem:** Planung, Bauleitung und Rückbau sehen nicht an einer Stelle, welche Bauteile in welchem Projekt
  und Raum verfügbar sind, was über sie belegt ist und was als Nächstes passieren muss, damit sie wiederverwendet werden.
  Neue Projekte werden zu spät bekannt.
- **Gewünschtes Verhalten:** Projekte auf einer Dortmund-Karte finden, Projekt und Raum öffnen, ein Bauteil vor Ort mit
  Foto und Werten erfassen, es im Bestand wiederfinden, den Pass öffnen und nach der Zuordnung zu einer Zielöffnung oder
  einem Bedarf den nächsten fachlichen Schritt sehen. Projekthinweise aus öffentlichen Quellen mit Prüfstatus führen.
- **Ausgeschlossen:** echte Bilderkennung, Upload auf einen Server, Benutzerkonten, automatischer Abruf von Quellen,
  jede Kontaktaufnahme aus der Plattform, echter IFC- oder Scan-Import, 3D-Ansicht, Produktivbetrieb.
- **Akzeptanzkriterien:** siehe Abschnitt 7. Jede simulierte Funktion ist in der Oberfläche als Simulation gekennzeichnet.

## 1. Abgleich: Auftrag gegen vorhandenen Stand

| Auftrag | Vorhanden (Entwurf 0.2, Prototyp) | Entscheidung |
|---|---|---|
| Startseite mit Dortmund-Karte und Projektliste aus denselben Daten | nein, nur ein Projekt ohne Lage | neu: Leaflet mit Bezirksgrenzen, Marker und Liste aus einem Datensatz, Regionen als Konfiguration |
| Projekt mit Phase, Gebäude, Etagen, Räumen, angebotenen Bauteilen | Projektkopf, Bauteile mit Geschoss und Raum als Text | erweitert: Gebäude → Etage → Raum als Daten, Bauteil gehört zu einem Raum |
| Bestand und Bauteilpass mit Quelle, Zustand, Verfügbarkeit, Nachweisen, Frist, nächster Handlung | Bestand mit Filtern, Pass mit Maßen, Nachweisen, Verlauf | übernommen und erweitert: Verfügbarkeit, Wertstatus je Angabe, Zuordnung zu Zielöffnung oder Bedarf, nächste Handlung je Bauteil |
| Tür und zweite Bauteilgruppe | Tür T-07 mit geprüfter Regel, Doppelboden DB-01 mit Entwurfsregel | übernommen. Türregel nimmt jetzt Zielöffnung und Planungsblatt als Parameter (rückwärtskompatibel, 46 Regeltests) |
| Mobile Erfassung mit Foto, Raum, Werten mit Status | nein | neu |
| Projektradar | nein | neu, mit echter Quellenbewertung und Prüfablauf |
| Gebäudeansicht mit anklickbaren Bauteilen, Importprüfung | Gebäudeschnitt als Skizze | neu: 2D-Grundriss je Etage, Import als Prüfung und Simulation |
| Desktop und Handy als eine App | schmale Ansicht vorhanden | neu: Hauptnavigation Projekte, Radar, Erfassung; unten als Leiste auf dem Handy |

Nicht übernommen: die feste Projektzeit-Simulation als Hauptbedienelement. Sie bleibt als Einstellung „Projektzeit (Simulation)“, weil Fristen und die Türregel davon abhängen.

## 2. Produktentscheidungen (reversibel)

1. **Region als Konfiguration.** Dortmund ist aktiv, weitere Regionen sind sichtbar als „in Vorbereitung“. Eine Region bringt Mittelpunkt, Zoom und Grenzdaten mit.
2. **Karte ohne Kachelserver als Grundlage.** Die Bezirksgrenzen liegen im Repository, die Karte funktioniert offline. Eine Straßenkarte (OpenStreetMap, nur online, mit Namensnennung, ohne Vorladen) lässt sich zuschalten; ist sie nicht erreichbar, meldet die Karte das und die Bezirkskarte bleibt. Für den Produktivbetrieb empfohlen: basemap.de (siehe 8.1).
3. **Projektkennung überall gleich.** Jedes Projekt hat ein Kürzel und eine Farbe (Marker, Liste, Kopf, Bauteil-IDs wie „LH · T-07“).
4. **Wertstatus je Angabe:** vorgeschlagen (Schätzung oder simulierte Erkennung, ungeprüft), gemessen (vor Ort gemessen), bestätigt (aus Unterlage übernommen oder von einer Person geprüft, nicht gemessen), fehlt. Regeln werten Maße nur als „gemessen“.
5. **Erkennung nur simuliert und sichtbar gekennzeichnet.** Der Vorschlag leitet sich aus dem Seitenverhältnis des Fotos ab, keine Bildanalyse.
6. **Foto über Datei-Eingabe mit Kamerahinweis** (`capture`). Das funktioniert auf Handys auch ohne HTTPS; ein Live-Kamerabild bräuchte einen sicheren Kontext.
7. **Zuordnung:** Eine Tür geht an eine Zielöffnung (Türregel), ein Doppelboden an einen Bedarf (Entwurfsregel). Ohne Zuordnung heißt die nächste Handlung „Zielöffnung oder Bedarf zuordnen“.
8. **Radar ohne Automatik:** Ein Hinweis wird erst durch eine dokumentierte Prüfung (Notiz, Stadtbezirk) zum bestätigten Projekt und erscheint dann auf der Karte. Eine Projektmeldung landet als „gemeldet, Prüfung offen“ und wird mit einer Prüfnotiz übernommen, weil Meldungen auch von Dritten kommen können. Kein automatischer Abruf, kein Kontakt aus der Plattform.
9. **Gebäudeansicht in 2D.** Ein Grundriss je Etage reicht für Raum und Bauteil und läuft auf jedem Handy. 3D und IFC bleiben Ausblick; die IFC-Datei kann nur vorgeprüft werden.
10. **Speicherung:** Beispieldaten im Code, eigene Erfassungen und Prüfschritte im Browser (localStorage), jederzeit zurücksetzbar. Kein Server.

## 3. Navigation und Abläufe

```
Projekte (Start: Karte + Liste)
└── Projekt ── Übersicht (Phase, Gebäude, Etagen, Räume, angebotene Bauteile, Bedarfe)
            ├── Gebäude (Grundriss je Etage, Raum, Bauteile, Import prüfen)
            ├── Bestand (Suche, Filter) ── Bauteilpass ── Entscheidung
            └── Entscheidungen
Radar (Hinweise, Quellen, Projekt melden)
Erfassung (Ort → Foto → Bauteil und Werte → Prüfen und Speichern → Pass)
```

Prüfablauf (Abnahme): Marker öffnen → Projekt öffnen → Raum öffnen → „Bauteil hier erfassen“ → Foto, Werte, Speichern → im Bestand wiederfinden → Pass öffnen → Zielöffnung zuordnen → nächster Schritt zur Wiederverwendung sichtbar.

## 4. Datenmodell

| Objekt | Wichtige Felder |
|---|---|
| Region | id, name, aktiv, Mittelpunkt, Zoom, Grenzdaten mit Quelle und Lizenz |
| Projekt | id, kurz, farbe, name, art (Umbau, Sanierung, Rückbau, Neubau), phase, status, bezirk, lage (symbolisch), herkunft (Beispiel, Radar, Meldung), rueckbauAb |
| Gebäude, Etage, Raum | Gebäude → Etagen → Räume mit Nummer, Name, Grundrissrechteck |
| Bauteil | id, projekt, raum, gruppe, typ (Einzel, Sammel), menge, werte {wert, status, quelle}, zustand, verfuegbarkeit, quelle der Erfassung, fotos, nachweise, verlauf |
| Zielöffnung | id, raum, Anforderung (Soll, Bezug, Messstelle, Planungsblatt), Fristen |
| Bedarf | id, beschreibung, menge, anforderungen, Fristen |
| Entscheidung | Bauteil → Zielöffnung oder Bedarf, Regel (geprüft oder Entwurf), Aufmaß bzw. Nachweise, Verlauf |
| Radarquelle | Betreiber, URL, Aktualität, Abdeckung, Zugriff, Lizenz, Felder, Relevanz |
| Hinweis | Titel, Quelle mit Link, Kennung, Datum, Abrufdatum, Frist, Art, Ort, Bezirk (mit Herkunft der Angabe), Relevanz mit Begründung, nicht belegte Punkte, Nutzungsvorbehalt, Prüfstatus (neu, in Prüfung, gemeldet, bestätigt, verworfen), Prüfverlauf |

## 5. Architektur und Dateien

Statisches HTML, CSS und JavaScript-Module ohne Build-Schritt, gestartet über einen lokalen statischen Server vom Repository-Root. Reine Regeln ohne DOM, damit sie mit `node --test` prüfbar sind.

| Pfad | Inhalt |
|---|---|
| `plattform/index.html`, `styles.css` | Rahmen und Gestaltung |
| `plattform/app/` | Daten, Zustand, Regeln, Ansichten, Router |
| `plattform/daten/dortmund-stadtbezirke.geojson` | Bezirksgrenzen (Open Data Dortmund, dl-de/zero-2-0) |
| `plattform/vendor/leaflet/` | Leaflet 1.9.4 (BSD-2-Clause) |
| `plattform/test/` | Regel- und Zustandstests |
| `prototype/dist/door-rules.mjs` | geprüfte Türregel, jetzt mit Zielöffnung und Planungsblatt als Parameter |

## 6. Integrationen

Siehe Abschnitt 8 (Recherche). Eingebaut wird nur Leaflet, weil die Karte im ersten Ablauf zoomen, verschieben und Marker öffnen muss. Kamera, Erkennung, 3D und IFC bleiben ohne Bibliothek, bis ein Ablauf sie konkret braucht.

## 7. Abnahme

- Regeltests: `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs`.
- Browser (Desktop und Handy): Prüfablauf aus Abschnitt 3, Radar-Prüfschritte, Gebäudeansicht mit Klick auf ein Bauteil, Leer- und Fehlerzustände, kein seitliches Scrollen auf dem Handy.
- Unabhängige Prüfung durch cf-review (Code) und cf-test (Tests und Browser) auf derselben Fassung.

## 8. Recherche

Alle Abrufe am 15.11.2026, nur lesend: keine Installation, kein Login, keine Formulare, keine Kontaktaufnahme.
Ausführliche Belege liegen nicht im Repository; die wichtigsten Quellen stehen unten.

### 8.1 Karte, mobile Erfassung, Gebäudeansicht

| Bereich | Lösung | Lizenz | Geräte | Formate | Aufwand ohne Build | Entscheidung |
|---|---|---|---|---|---|---|
| Karte | Leaflet 1.9.4 | BSD-2-Clause | Desktop und Mobil, Touch | Rasterkacheln, GeoJSON, Marker | gering: ein Script, lokal | **eingebaut** |
| Karte | MapLibre GL JS 6.18 | BSD-3-Clause | WebGL-Browser | Vektorkacheln mit Style, GeoJSON | gering bis mittel: nur ES-Module | später, mit basemap.de Web Vektor |
| Karte | OpenLayers 10.11 | BSD-2-Clause | Desktop und Mobil | WMS, WMTS, WFS, MVT, GeoJSON, KML | mittel: Bundler empfohlen | nur falls kommunale GIS-Dienste in UTM nötig |
| Grundlage | Open Data Dortmund, Stadtbezirke | Portal: dl-de/zero-2.0, Geoportal: dl-de/by-2.0 (Widerspruch) | – | GeoJSON | sehr gering | **eingebaut**, vereinfacht, Quelle wird genannt |
| Grundlage | OSM-Kacheln / basemap.de | OSM: Namensnennung, kein Vorladen, kein SLA · basemap.de: CC BY 4.0 | alle | PNG-Kacheln bzw. WMTS, Vektor | sehr gering | OSM zuschaltbar online; basemap.de für den Produktivbetrieb |
| Erfassung | HTML Media Capture (`capture`) | Webstandard | Chrome Android, Safari iOS; Desktop zeigt Dateiauswahl | Bilddatei | sehr gering, kein HTTPS nötig | **eingebaut** |
| Erfassung | getUserMedia | Webstandard | alle aktuellen Browser, nur im sicheren Kontext | Videostrom | gering bis mittel | später, für Live-Vorschau über HTTPS |
| Erfassung | TF.js COCO-SSD, MediaPipe Object Detector | Apache-2.0 | Browser | Modelle mit 80 COCO-Klassen, **keine Klasse „Tür“** | gering bis mittel | nicht eingebaut; Erkennung bleibt simuliert, echte Erkennung braucht eigenes Training |
| Erfassung | Apple RoomPlan, ARCore Depth, WebXR | proprietär bzw. Apache-2.0 | RoomPlan nur iOS mit LiDAR, nativ; WebXR nicht auf iOS | RoomPlan: Räume, Türen, Öffnungen als JSON/USDZ | hoch, nativ | Ausblick; im Prototyp simuliert |
| Gebäude | three.js r187 | MIT | WebGL 2 | glTF, OBJ, USDZ; kein IFC-Loader | gering bis mittel | nicht eingebaut, 2D-Grundriss reicht für den Ablauf |
| Gebäude | web-ifc 0.0.79 / That Open Engine 3.6 | MPL-2.0 / MIT | moderne Browser (WASM) | IFC lesen und schreiben | mittel / hoch (Build) | später für IFC-Import |
| Gebäude | xeokit-sdk 2.6 | AGPL-3.0 oder Kauflizenz | WebGL | XKT, glTF, IFC über web-ifc | gering bis mittel | nur bei geklärter Lizenz |
| Gebäude | IfcOpenShell 0.9 | LGPL-3.0 | Server, Desktop (Python) | IFC | nicht im Browser | später als Vorverarbeitung IFC → JSON |

Folgerungen für später: IFC-Import zuerst als Vorverarbeitung (Geschoss, Raum, Tür samt Beziehungen in eigenes JSON).
`IfcDoor.OverallWidth` und `OverallHeight` sind optional und beschreiben den Umriss der Öffnung im Modell, kein
Aufmaß; sie gehen nur als „vorgeschlagen“ in den Pass. Ein Raumscan liefert Schätzungen und ersetzt kein Aufmaß
an der Messstelle.

Quellen (Auswahl): leafletjs.com/download.html · maplibre.org/maplibre-gl-js/docs · openlayers.org/download ·
operations.osmfoundation.org/policies/tiles · basemap.de/produkte-und-dienste/web-raster · open-data.dortmund.de
(Datensatz fb62-stadtbezirke) · w3.org/TR/html-media-capture · MDN zu getUserMedia und Secure Contexts ·
storage.googleapis.com/mediapipe-tasks/object_detector/labelmap.txt · developer.apple.com/documentation/roomplan ·
threejs.org/manual · github.com/ThatOpen/engine_web-ifc · github.com/xeokit/xeokit-sdk · pypi.org/project/ifcopenshell.

### 8.2 Projektradar Dortmund

14 Quellen bewertet nach Aktualität, Abdeckung, Zugriff, Lizenz, Feldern und Relevanz; die vollständige Bewertung
steht in der App unter Radar → Quellen und in `plattform/app/radar-daten.js`.

| Quelle | Zugriff | Lizenz und Nutzung | Relevanz | Empfehlung |
|---|---|---|---|---|
| Bekanntmachungsservice des Bundes (oeffentlichevergabe.de) | dokumentierte Schnittstelle, Tagesexport CSV/OCDS/eForms | CC0 | hoch | automatisch, täglich, Filter nach Erfüllungsort (NUTS DEA52), CPV und Stichwörtern |
| Vergabemarktplatz Metropole Ruhr (Plattform der Stadt) | öffentliche Listen, keine Schnittstelle | keine Weiterverwendungsregel | hoch | wöchentlich manuell |
| Vergabemarktplatz NRW | CPV-Listen per Link | wie oben | hoch | ergänzend zur Sichtung |
| Ratsinformationssystem (SessionNet) | HTML/PDF, Formular | robots.txt sperrt Crawler, Nutzungsvorbehalt dortmund.de | hoch (früheste Signale) | alle 14 Tage manuell, keine Personennamen |
| Aktuelle Hochbauprojekte (Stadt) | PDF-Liste | Nutzungsvorbehalt dortmund.de | hoch | vierteljährlich manuell |
| TED | Such-API ohne Schlüssel | frei weiterverwendbar | mittel (nur EU-weite Verfahren, weitgehend doppelt) | Rückfallebene |
| service.bund.de, Amtsblatt, Bauleitplanung, Open-Data-Datensätze | unterschiedlich | unterschiedlich | mittel bis gering | nicht im ersten Radar |

Hinweise im Prototyp: fünf echte Dortmunder Hinweise (H-01 bis H-05) aus Vergabemarktplatz, TED, Ratsinformationssystem
und service.bund.de, alle mit Quelle, Datum, Abrufdatum und Status „ungeprüft“. Dazu vier erfundene Beispiele (B-01 bis
B-04), die die Prüfstatus zeigen. Personenbezogene Angaben aus den Quellen wurden nicht übernommen.

Lehre aus der Recherche: Mehrere Treffer nannten Dortmund nur als Sitz der Vergabestelle oder des Auftragnehmers, das
Projekt lag in Münster, Bochum, Fröndenberg oder Hagen. Der Radar muss deshalb nach Erfüllungsort filtern, nicht nach
dem Wort „Dortmund“.

Vor einem automatischen Abruf zu klären: Nutzungsvorbehalt von dortmund.de gegenüber § 5 UrhG und Datenbankrecht;
robots.txt als Vorbehalt gegen Text- und Data-Mining (§ 44b UrhG); fehlende Lizenz der Vergabeplattformen; Datenschutz
(nur Organisationen speichern); UWG § 7 bei späterer Kontaktaufnahme durch Nutzende; bei Direktmeldungen Berechtigung,
Rechte an Fotos und Umgang mit Schadstoffangaben.
