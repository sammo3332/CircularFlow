# Plan CF-PWA-01 · Installierbare Web-App und mobile Erfassung

Stand: 18.11.2026 · Status: Auftrag des Teams vom 18.11.2026, vor der Umsetzung festgehalten.
Branch: `claude/bold-fermat-t1ngwv` · Ausgangscommit: `747b16c` (`codex/plattform-entwicklung-20261118`).
Produktbrief: Fassung im Ausgangscommit (`docs/produktbrief.md`). Pitch-Stand bleibt `codex/plattform-v1`, Code `2121b92`.

## 1 Nutzerproblem

Eine Projektperson steht im Gebäude und will ein Bauteil am Smartphone mit Foto festhalten und die Angaben später
wieder öffnen. Die Plattform läuft bisher nur als Browserseite; es gibt kein App-Symbol, keine Installationshilfe,
und Felder und Knöpfe der Erfassung sind für die Bedienung mit dem Finger knapp bemessen.

## 2 Bestandsaufnahme (Ausgangscommit, geprüft am 18.11.2026)

Geprüft mit Chromium 1243 (Playwright, Geräteprofil „Pixel 7“, 412 × 839) gegen `python3 -m http.server`.
Kein echtes Gerät. Testbild: gezeichnet und als Testbild beschriftet.

| Bereich | Vorhanden | Nötige Änderung |
|---|---|---|
| Mobile Darstellung | Eigenes Layout bis 860 px mit Tableiste; in allen 5 Schritten kein seitliches Scrollen (gemessen: 0 px Überstand) | Bedienelemente sind 40 px hoch (Ziel: mindestens 44 px). Felder haben 14,5 px Schrift; iOS vergrößert die Seite beim Antippen von Feldern unter 16 px (bekanntes Verhalten, hier nicht am Gerät geprüft) |
| Fotoaufnahme | Ein Dateifeld mit `capture="environment"`; Bild wird auf 1280 px verkleinert (JPEG) | Das Feld heißt „aufnehmen oder wählen“, `capture` öffnet auf Handys aber direkt die Kamera. Ein vorhandenes Bild lässt sich so nicht wählen → zwei getrennte Wege |
| Speicherung | `localStorage` dieses Browsers; Foto übersteht das Neuladen (geprüft: 960 px breit nach Neuladen); bei vollem Speicher wird das Foto weggelassen und das gemeldet | Keine Funktionsänderung. Kennzeichnung „nur dieses Gerät, dieser Browser“ deutlicher, schon vor dem Speichern |
| Datensatz wieder öffnen | Liste „In diesem Browser gespeichert“ führt zum Bauteilpass mit Foto und Angaben | Liste ohne Vorschaubild und nur am Ende der Erfassung → Vorschaubild; Hinweis auf die Liste nach dem Speichern |
| Installierbarkeit | Nichts: kein Manifest, keine Icons, keine Angaben für iOS, kein Service Worker | Manifest, Icons, Kopfangaben, Installationshilfe |
| Hosting | Statische Dateien, kein Build. Start nur vom Repository-Wurzelverzeichnis, weil `plattform/` die Türregel aus `prototype/dist/` lädt | Für die Installation auf einem Handy ist HTTPS nötig (oder `localhost`). Über `http://<IP>:8000` im WLAN bleibt die Seite nutzbar, aber nicht installierbar. Kein Deployment in diesem Auftrag |
| Offline | Die Seite lädt nichts von fremden Servern (außer der zuschaltbaren Straßenkarte), braucht aber den eigenen Server | Bewusst nicht Teil des Auftrags, siehe 4 |

## 3 Gewünschtes Verhalten

1. **Installierbar:** Die Seite liefert ein Web-App-Manifest (Name, Start bei der Erfassung, eigenes Fenster,
   Farben) und Icons (192, 512, maskierbar 512, 180 für iOS). Die Angaben stehen außerhalb des Bereichs, den
   `bauen-artifact.mjs` übernimmt; die veröffentlichte Pitch-Vorschau ändert sich dadurch nicht.
2. **Installationshilfe** (`#installieren`, erreichbar aus Erfassung und Seitenleiste): erklärt je Gerät den Weg
   (Android/Chrome, iPhone/Safari, Rechner mit Chrome oder Edge). Bietet der Browser die Installation an, gibt es
   den Knopf „App installieren“. Läuft die Seite schon als App, steht das dort. Die Seite nennt die Grenzen: nur mit
   Verbindung zum Server, Daten nur auf diesem Gerät, keine Synchronisierung.
3. **Erfassung am Handy:** Bis 860 px Breite sind Felder, Auswahllisten und Knöpfe mindestens 44 px hoch, Felder
   haben 16 px Schrift. Schritt „Foto“ bietet „Foto aufnehmen“ (Kamera) und „Vorhandenes Bild wählen“ getrennt an.
4. **Speichern und wieder öffnen:** Nach dem Speichern führt „Bauteilpass öffnen“ zum Datensatz; die Liste
   „Auf diesem Gerät gespeichert“ zeigt jede eigene Erfassung mit Vorschaubild und führt zum Pass. Der Datensatz
   ist nach dem Neuladen mit Foto wieder da.
5. **Kennzeichnung:** Lokale Speicherung steht im Foto-Schritt, im Prüfschritt, nach dem Speichern und in der
   Installationshilfe. Die simulierte Erkennung bleibt wie bisher gekennzeichnet.

## 4 Ausgeschlossener Umfang

- Kein Service Worker, keine Offline-Nutzung. Sie wird nirgends zugesagt.
- Keine Synchronisierung zwischen Geräten, kein Konto, kein Server, keine Datenbank.
- Kein App-Store-Release, keine kostenpflichtigen Dienste, kein Deployment, kein Merge.
- Pitch-Stand `codex/plattform-v1`, veröffentlichte Vorschau und die Pitch-Decks bleiben unverändert.
- Abgleichregeln, Vorgang, Beispieldaten und Speicherformat bleiben unverändert.

## 5 Abnahmekriterien

| Nr. | Kriterium | Prüfung |
|---|---|---|
| A1 | Manifest ist gültig, alle genannten Icons existieren in der genannten Größe | Node-Test |
| A2 | Chromium meldet keine Installationshindernisse (`Page.getInstallabilityErrors` leer) | Browserlauf |
| A3 | `#installieren` rendert; nennt „keine Offline-Nutzung“ und „keine Synchronisierung“ | Node-Test, Browserlauf |
| A4 | Erfassung bei 412 px: kein seitliches Scrollen; kein Bedienelement unter 44 px; kein Feld unter 16 px Schrift | Browserlauf mit Messung |
| A5 | Foto-Schritt hat ein Feld mit und eines ohne `capture`; beide übernehmen ein Bild | Node-Test, Browserlauf |
| A6 | Ablauf Ort → Foto → Bauteil → Angaben → Speichern → Pass öffnen → Neuladen: Datensatz und Foto vorhanden; Liste zeigt Vorschaubild | Browserlauf |
| A7 | Am Rechner (1280 × 720) bleibt die Plattform bedienbar; Übersicht und Entscheidungsseite ohne seitliches Scrollen | Browserlauf |
| A8 | Bestehende Tests bleiben grün | `node --test …` |
| A9 | `bauen-artifact.mjs` erzeugt weiterhin eine Fassung ohne Manifest-Verweis | Lauf in einen Wegwerfordner |

Testdaten: Beispieldaten der Plattform und ein gezeichnetes, beschriftetes Testbild. Zeitrahmen: ein Arbeitsgang
am 18.11.2026. Ausgaben: keine.
