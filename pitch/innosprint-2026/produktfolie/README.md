# Produktfolie · Erfassen am Handy, entscheiden am Rechner

Stand: 18.11.2026 · Branch `claude/bold-fermat-t1ngwv` · Entwurf, nicht Teil der eingereichten Pitch-Decks.
Die Decks unter `../ausgabe/` und der Pitch-Stand `codex/plattform-v1` sind unverändert. Ob und wo die Folie
verwendet wird, entscheidet das Team.

| Datei | Inhalt |
|---|---|
| `CircularFlow_Produktfolie_Erfassung-und-Entscheidung.pptx` | eine Folie 16:9, alle Texte, Chips und Rahmen als einzelne Formen bearbeitbar; Sprechtext und Antworten auf Rückfragen in den Notizen |
| `vorschau.png` | Vorschau der Folie (LibreOffice-Export; dort ersetzt Liberation Sans die Schrift Arial) |
| `bilder/` | unbearbeitete Aufnahmen aus der laufenden Plattform |
| `aufnahmen.cjs`, `baue.py` | erzeugen Aufnahmen und Folie neu |

**Was die Bilder zeigen:** links Schritt 5 der mobilen Erfassung („Prüfen und speichern“), rechts die
Entscheidungsseite TW-05 → BD-22 nach „Prüfbitte anlegen“. Beide stammen aus Chromium 157: das Handy als
Geräteprofil „Pixel 7“ (Emulation), der Rechner mit 1280 × 720. Der Smartphone-Rahmen ist gezeichnet. Das Türbild
ist ein beschriftetes Testbild, kein Foto eines Bauteils.

**Was die Folie bewusst nicht zeigt:** keinen Pfeil und keine Verbindung zwischen Handy und Rechner. Die
Erfassung vom Handy erscheint nicht am Rechner; es gibt keine Synchronisierung. Die Folie sagt das im Kasten
„Stand heute“.

**Vor einer Verwendung prüfen:** Folie in PowerPoint öffnen (Schrift Arial, Umbrüche), Aufnahme nach Möglichkeit
durch ein echtes Bauteilfoto vom eigenen Handy ersetzen und den Chip „Testbild“ dann entfernen. Die Aussage „ohne
App-Store“ stützt sich auf die Installation über den Browser; auf einem echten Gerät ist sie noch nicht geprüft.

Neu erzeugen (Server läuft vom Repository-Wurzelverzeichnis, Playwright und python-pptx vorhanden):

```sh
node pitch/innosprint-2026/produktfolie/aufnahmen.cjs /tmp/testbild-tuer.jpg
python3 pitch/innosprint-2026/produktfolie/baue.py
```
