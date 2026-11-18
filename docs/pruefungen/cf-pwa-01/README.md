# Prüfbericht CF-PWA-01 · Installierbare Web-App und mobile Erfassung

Stand: 18.11.2026 · Branch `claude/bold-fermat-t1ngwv` · Ausgangscommit `747b16c` · Plan:
[`docs/plan-pwa-erfassung.md`](../../plan-pwa-erfassung.md). Alle Läufe am selben Codezustand (Commit dieses
Berichts), lokaler Server `python3 -m http.server 8000` vom Repository-Wurzelverzeichnis.

## Ausgeführte Befehle

| Befehl | Rohausgabe | Ergebnis |
|---|---|---|
| `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs` | [`rohausgaben/regeltests.txt`](rohausgaben/regeltests.txt) | 218 von 218 bestanden (vorher 210; 8 neu) |
| `node docs/pruefungen/cf-pwa-01/werkzeug/browserlauf.cjs <Testbild>` | [`rohausgaben/browserlauf.txt`](rohausgaben/browserlauf.txt) | 57 von 57 Prüfungen bestanden |
| `node plattform/bauen-artifact.mjs <Wegwerfordner>` | [`rohausgaben/artifact-bau.txt`](rohausgaben/artifact-bau.txt) | gebaut, kein Manifest-Verweis in der Vorschau-Fassung |

Umgebung: Node 22.23, Playwright mit Chromium 157.0.8103.78 (Headless), Linux-Container. **Kein echtes Gerät.**
„Pixel 7“ und „iPhone 13“ sind Geräteprofile von Playwright (Bildschirmgröße, Touch, Browserkennung) im selben
Chromium; das iPhone-Profil prüft also nicht Safari.

## Abnahmekriterien

| Nr. | Kriterium | Ergebnis | Beleg |
|---|---|---|---|
| A1 | Manifest gültig, Icons in genannter Größe | erfüllt | `plattform/test/pwa.test.mjs`, Browserlauf (Auslieferung 200) |
| A2 | Chromium meldet keine Installationshindernisse | erfüllt | Browserlauf: `Page.getInstallabilityErrors` leer |
| A3 | Installationshilfe rendert und nennt die Grenzen | erfüllt | Test, Browserlauf, `bilder/android-0-installieren.jpg` |
| A4 | 412 px und 390 px: kein seitliches Scrollen, Ziele ≥ 44 px, Felder ≥ 16 px | erfüllt | Browserlauf, je 9 Messpunkte pro Profil |
| A5 | Foto mit Kamera-Feld und ohne `capture`; beide übernehmen ein Bild | erfüllt, mit Einschränkung | Browserlauf: Bilddatei statt Kamera |
| A6 | Speichern, Pass öffnen, Neuladen, Liste mit Vorschaubild | erfüllt | Browserlauf, `bilder/android-6-gespeichert.jpg`, `android-7-pass.jpg` |
| A7 | Rechner 1280 × 720 bleibt bedienbar | erfüllt | Browserlauf, `bilder/rechner-2-entscheidung.jpg` |
| A8 | Bestehende Tests grün | erfüllt | `regeltests.txt` |
| A9 | Vorschau-Fassung ohne Manifest-Verweis | erfüllt | `artifact-bau.txt` |

Vergleich mit dem Ausgangsstand (Messung vor der Änderung, „Pixel 7“): Bedienelemente 40 px hoch, Felder
14,5 px, Stichtagswahl 13,5 px, ein einziges Foto-Feld mit `capture`, kein Manifest.

## Was nicht geprüft wurde

- Installation auf einem echten Android-Gerät oder iPhone, Symbol auf dem Startbildschirm, Start als eigenes Fenster.
- Der Installationsdialog: `beforeinstallprompt` wurde im Headless-Lauf nicht ausgelöst. Der Knopf „App
  installieren“ ist deshalb nur über die Tests der Ansicht geprüft, nicht im Browser geklickt.
- Die Kamera. Der Lauf übergibt beiden Feldern eine Bilddatei. Ob ein bestimmtes Handy bei „Foto aufnehmen“ direkt
  die Kamera öffnet, hängt von Gerät und Browser ab.
- Safari, Firefox, Edge. Die Hinweise der Installationshilfe zu iOS (eigener Speicher der App vom Home-Bildschirm,
  Vergrößern bei Feldern unter 16 px) beruhen auf bekanntem Verhalten von iOS, nicht auf einer eigenen Prüfung.
- Eine HTTPS-Adresse. Geprüft wurde nur `http://127.0.0.1:8000`.
- Sehr viele oder sehr große Fotos (Grenze des Browserspeichers); die vorhandene Behandlung „Speicher voll“ wurde
  nicht verändert und hier nicht erneut ausgelöst.

## Verbleibende Grenzen

1. Keine Offline-Nutzung: kein Service Worker. Ohne erreichbaren Server startet auch die installierte App nicht.
2. Keine Synchronisierung: Der Browserlauf bestätigt, dass ein zweites Browserprofil den erfassten Datensatz nicht
   kennt. Handy und Rechner sehen nur die gemeinsamen Beispieldaten.
3. Kein Hosting: Für die Installation am Handy fehlt eine HTTPS-Adresse. Deployment war nicht beauftragt.
4. Die Stichtagswahl im Kopf der Handy-Ansicht ist durch die 16-px-Schrift breiter geworden; bei 390 px passt sie
   noch neben das Logo (Bilder `iphone-*`). Schmalere Geräte wurden nicht geprüft.
5. Die größeren Bedienelemente gelten bis 860 px Breite für alle Ansichten, nicht nur für die Erfassung. Außer
   Erfassung, Installationshilfe und Bauteilpass wurden die übrigen Handy-Ansichten nur über die bestehenden
   Tests, nicht einzeln im Browser nachgemessen.

## Bilder

`bilder/` enthält die Aufnahmen des Browserlaufs (verkleinert auf 900 px Breite, JPEG). Ganzseitige Aufnahmen
zeigen die feste Tableiste mitten im Bild; das ist eine Eigenheit der Aufnahme, nicht der Seite. Das Türbild ist
ein gezeichnetes, beschriftetes Testbild (`werkzeug/testbild.py`), kein Foto eines Bauteils.
