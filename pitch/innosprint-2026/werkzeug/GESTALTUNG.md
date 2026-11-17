# Gestaltung und Bau der Pitch-Präsentationen · INNOSPRINT 2026

Diese Vorgabe gilt für alle drei Fassungen. Sie leitet sich aus den Farben der Plattform ab (`plattform/styles.css`),
damit Folien und Live-Demo zusammenpassen.

## Format und Schrift

- 16:9, `LAYOUT_WIDE` (13,333 × 7,5 Zoll).
- Schrift: **Arial** für Titel und Text. Arial ist auf jedem Vortragsrechner vorhanden und wird in der PDF-Prüfung
  mit gleicher Laufweite dargestellt.
- Größen: Titel 32–40 pt fett, Zwischentitel 20–24 pt fett, Text 16–20 pt, Fußzeile und Quellen 10–11 pt.
  Nicht unter 14 pt für Inhalte und nicht unter 10 pt für Fußnoten.
- Text linksbündig. Titel sind Aussagen und enden ohne Punkt.

## Farben (aus der App)

| Rolle | Farbe | Verwendung |
|---|---|---|
| Hauptfarbe | `0E5546` Dunkelgrün | Hintergrund von Titel-, Abschnitts- und Schlussfolien; Hervorhebungen |
| Grün hell | `E0EEE8` | Flächen, Karten auf weißen Folien |
| Tinte | `17201D` | Text auf hellen Folien |
| Tinte 2 | `3F4A45` | Nebentext |
| Tinte 3 | `59655F` | Fußzeile, Quellen |
| Papier | `F2F3F0` | ruhige Fläche hinter Bildschirmfotos |
| Weiß | `FFFFFF` | Inhaltsfolien |
| Weiter prüfen | Text `1F6B42`, Fläche `E2F1E7` | positives Ergebnis |
| Zu spät | Text `A2261D`, Fläche `FBE5E1` | verpasste Frist |
| Achtung | Text `7D4C00`, Fläche `FBECD0` | knapp, Annahme |
| Hinweis | Text `1F4F96`, Fläche `E4ECF8` | Hypothese, Hinweis |
| Simulation | Text `594810`, Fläche `F5EECB` | Simulation, Beispieldaten, fiktiver Pilotfall |

Dunkelgrün dominiert. Rot nur für „zu spät“, Gelb nur für Kennzeichnungen.

## Wiederkehrendes Motiv

1. **Kennzeichnungs-Chips** wie in der App: abgerundete Rechtecke (`ROUNDED_RECTANGLE`) mit kurzem Text.
   - „Fiktiver Pilotfall“, „Beispieldaten“, „Simulation“: Gelb (`594810` auf `F5EECB`)
   - „Annahme, unbestätigt“: Achtung (`7D4C00` auf `FBECD0`)
   - „Hypothese“: Hinweis (`1F4F96` auf `E4ECF8`)
   - Ergebnis-Chips „Weiter prüfen“ (grün), „Für diese Entscheidung zu spät“ (rot), „Knapp“ (Achtung)

   Chips stehen oben rechts auf der Folie oder direkt am Element, das sie kennzeichnen.
2. **Statuskette** der App als nummerierte Kreise: 1 Zuordnung · 2 Prüfbitte · 3 Fachergebnis · 4 Vormerkung ·
   5 Übergabe geplant · 6 Übergeben.
3. **Zeitleiste** für die vier Zeitpunkte: Angebot bekannt · erreicht die Planung · Entscheidung bis · Übergabe möglich.

Keine Akzentlinien unter Titeln, keine Farbbalken oder Randstreifen, keine Schmuckgrafik ohne Aussage.
Jede Folie hat ein visuelles Element (Bild, Zeitleiste, Kette, Karten, große Zahl).

## Seitenrahmen (Layouts)

- **TITEL** (dunkelgrün): Titel, Untertitel, Namen „Houssam Taleb · Feyrouz Chahed“, „INNOSPRINT Zirkuläres Bauen ·
  Dortmund · 20.11.2026“.
- **INHALT** (weiß): Titel oben links (Platzhalter, immer gleiche Position), Inhaltsbereich darunter.
- **BILD** (weiß): Titel oben, großes Bildschirmfoto auf Papierfläche, Bildunterschrift.
- **ABSCHNITT / SCHLUSS** (dunkelgrün): große Aussage, kurzer Text.
- Fußzeile auf den Layouts, nicht auf den Folien: links „CircularFlow · INNOSPRINT 2026“, rechts Foliennummer,
  10 pt, `59655F` (auf Dunkelgrün: `E0EEE8`).
- Quellen stehen als kurze Fußnote über der Fußzeile (10–11 pt).

## Bildschirmfotos

- Liegen in `pitch/innosprint-2026/bilder/` (aus Fassung 2, Code `2121b92`, frisches Profil, Stichtag der Demo
  Mi 18.11.2026, 14:00).
- Seitenverhältnis erhalten (`sizing` nicht verzerren). Hinter dem Bild eine Papierfläche `F2F3F0`, dünner Rahmen
  `ECEEE9`.
- Jedes Foto trägt den Chip „Beispieldaten“ und eine Bildunterschrift mit dem Schritt (z. B. „K3 · Abgleich
  TW-01 → BD-23“). Alternativtext (`altText`) setzen.

## Sprechtext

- Jede Folie hat Notizen: erste Zeile „Spricht: Houssam“ oder „Spricht: Feyrouz“, dann eine Leerzeile, dann der
  Sprechtext. Optional am Ende „Dauer: etwa N Sekunden“.

## Dateien

- Ausgabe in `pitch/innosprint-2026/ausgabe/`:
  - `CircularFlow_INNOSPRINT2026_Fassung-<A|B|C>_<Kurzname>.pptx`
  - `CircularFlow_INNOSPRINT2026_Fassung-<A|B|C>_<Kurzname>.pdf` (Folien)
  - `CircularFlow_INNOSPRINT2026_Fassung-<A|B|C>_<Kurzname>_Sprechtext.pdf` (Notizenseiten: Folie mit Sprechtext)
- Keine Markierung „empfohlen“ im Dateinamen oder auf Folien. Die Empfehlung steht nur in `pitch/innosprint-2026/README.md`.

## Bau und Prüfung

Werkzeuge: `pptxgenjs` 3.12.0, LibreOffice 24.2, Poppler. Die Hilfsskripte stammen aus der PPTX-Anleitung
(`<Skill>/scripts`, siehe Befehle).

```bash
# PPTX bauen (NODE_PATH zeigt auf die installierte pptxgenjs-Version)
NODE_PATH=<pfad>/node_modules node pitch/innosprint-2026/werkzeug/baue.js
# Ordnereinträge aus dem ZIP entfernen (sonst Probleme beim Öffnen über Cloud-Dienste)
zip -dq <deck>.pptx '*/'
# Gültigkeit prüfen
python3 <Skill>/scripts/office/validate.py <deck>.pptx
# PDF der Folien
python3 <Skill>/scripts/office/soffice.py --headless --convert-to pdf --outdir <ausgabe> <deck>.pptx
# PDF mit Sprechtext (Notizenseiten)
python3 <Skill>/scripts/office/soffice.py --headless --convert-to 'pdf:impress_pdf_Export:{"ExportNotesPages":{"type":"boolean","value":"true"},"ExportOnlyNotesPages":{"type":"boolean","value":"true"}}' --outdir <tmp> <deck>.pptx
# Sichtprüfung
pdftoppm -jpeg -r 80 <deck>.pdf <prefix>
python3 <Skill>/scripts/slide_text.py <deck>.pptx
```
