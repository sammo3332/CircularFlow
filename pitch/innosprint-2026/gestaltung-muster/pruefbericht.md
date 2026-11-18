# Prüfbericht zu den drei Musterfolien

**Fassung 1.0 · 18.11.2026 · Branch `codex/pitch-gestaltung-20261118` · Ausgangscommit `fbd6cff`**

Geprüft wurde ein einziger Stand: der Canva-Entwurf `DAHbQg1-t6o` nach der letzten Speicherung, seine drei Exporte in
`vorschau/` und die Folienbeschreibung in `werkzeug/folien.js`, deren Endstand in `canva/stand-final.json` liegt.
Alle Befehle liefen im Ordner `pitch/innosprint-2026/gestaltung-muster`. Die Ausgaben stehen in `pruefung/`.

## 1. Stimmt der Canva-Entwurf mit der geprüften Folienbeschreibung überein?

Die Texte, Maße und Farben wurden an der Folienbeschreibung geprüft. Deshalb zuerst der Nachweis, dass Canva dasselbe
zeigt.

```bash
node werkzeug/bauen.js vorschau <temp> aufnahmen/karte-k4.json aufnahmen/karte-k4.png
node werkzeug/bauen.js stand <temp> aufnahmen/karte-k4.json aufnahmen/karte-k4.png stand.json
python3 -I werkzeug/vergleich.py vorschau <temp>/vorschau-lokal
```

| Folie | Elemente | abweichende Pixel, hart | nach Glättung |
|---|---|---|---|
| 1 | 26 (13 Texte, 8 Bilder, 5 Formen) | 12 833 (0,62 %) | 0 |
| 2 | 33 (19 Texte, 2 Bilder, 12 Formen) | 48 238 (2,33 %) | 0 |
| 3 | 33 (17 Texte, 6 Bilder, 10 Formen) | 26 264 (1,27 %) | 36 (0,002 %) |

„Hart“ zählt jeden Bildpunkt, der sich um mehr als 60 von 255 Stufen unterscheidet; das trifft Kantenglättung von
Schrift und Rundungen. „Nach Glättung“ vergleicht beide Bilder mit einem Weichzeichner von 4 Pixeln und zählt
Unterschiede über 40 Stufen; übrig blieben dann verschobene oder fehlende Elemente. Es gibt keine. Der neu erzeugte
Stand der Elemente ist bytegleich mit `canva/stand-final.json`. Ausgabe: `pruefung/01-nachbau-und-vergleich.txt`.

Nicht geprüft: die Ansicht im Canva-Editor und im Präsentationsmodus. Geprüft sind die Rückmeldungen der
Schnittstelle zu jedem Element und der PNG-Export.

## 2. Lesbarkeit

```bash
node werkzeug/pruefen.js canva/stand-final.json ../../.. quellen aufnahmen/karte-k4.json
```

| Folie | Schriftgrößen | unter 28 px (14 pt) | kleinster Kontrast |
|---|---|---|---|
| 1 | 22 bis 68 px | Pille „Fiktiver Fall“ 26 px; zwei Fußzeilen 22 px | Titel, zweite Zeile: 4,2:1 (68 px fett) |
| 2 | 20 bis 208 px | drei Pillen 27 px; Quelle 22 px; „100 Kästchen = …“ 24 px; Text im Bernstein-Kasten 27 px; Quelle 20 px | „Millionen Tonnen“: 4,2:1 (50 px fett) |
| 3 | 20 bis 58 px | zwei Pillen 26 px; „heute“ 24 px; Pille „Echte Ansicht der Vorschau“ 23 px; Fußzeile 20 px | Fußzeile: 5,4:1 |

- Keine Schrift ist kleiner als 20 px (10 pt).
- Schwelle für Kontraste wie bei WCAG AA: große Schrift (ab 36 px oder fett ab 28 px) mindestens 3:1, sonst
  mindestens 4,5:1. Alle Texte bestehen. Beim ersten Lauf lag das Fragezeichen auf Musterfolie 2 bei 2,7:1; es wurde
  auf `#96590A` abgedunkelt (4,8:1) und die Folie neu exportiert.
- Die Schrift in der Plattformaufnahme ist auf der Folie etwa 28 px hoch (14,5 px in der Plattform mal 1,93), die
  Zeile unter dem Knopf etwa 25 px.
- Schärfe der Aufnahme im Export: 1391,9 gegenüber 1421,7 in der lokalen Vorschau (Laplace-Varianz, gleicher
  Ausschnitt). Als gewöhnliches PNG waren es in der ersten Fassung 522,3. Vier Varianten wurden auf einer Probeseite
  verglichen: `pruefung/05-canva-messungen.txt`, Bild `pruefung/schaerfe-vier-varianten.png`.

Nicht geprüft: Lesbarkeit an einem Beamer, bei Raumlicht und aus der letzten Reihe.

## 3. Quellenrichtigkeit

Mit demselben Befehl wie in Abschnitt 2. Ausgabe: `pruefung/02-lesbarkeit-quellen-produkt.txt`.

**Wortlaute gegen den geprüften Pitch (11 Prüfungen, alle bestanden).** Titel der Folien 1 und 3 wörtlich;
„Haus Lindenhof: 6 von 12 Türen angeboten“, „Umbau am Kanal: braucht 6 Türen“, „zu spät erfahren“, „neu bestellt“,
„Fiktiver Fall“, Fußzeile und Teamzeile wie in `pitch/innosprint-2026/werkzeug/inhalt-p5.js`; „können im Container
landen“ aus dem geprüften Sprechtext; die Sprechtexte der Folien 1 und 3 in den Notizen wörtlich.

**Zahlen der Datenfolie (13 Prüfungen, alle bestanden).**

| Angabe auf der Folie | Fundstelle |
|---|---|
| 182,8 Millionen Tonnen · 50 % | Destatis, Pressemitteilung Nr. 185 vom 1. Juni 2026: „mit 50 % (182,8 Millionen Tonnen)“ |
| Deutschland · 2024 · vorläufig | ebenda: „Im Jahr 2024 sind in Deutschland nach vorläufigen Ergebnissen insgesamt 362,7 Millionen Tonnen Abfälle entstanden.“ |
| Titel | ebenda, Zwischenüberschrift: „Die Hälfte aller Abfälle im Jahr 2024 waren Bau- und Abbruchabfälle“ |
| 362,7 Mio. t insgesamt | ebenda |
| 102,9 Mio. t Boden, Steine und Baggergut | Umweltbundesamt, Tabelle „Abfallaufkommen“, 2024: 102.887 Tsd. t; dort Bau- und Abbruchabfälle 182.769 und insgesamt 362.719 Tsd. t |
| 28 + 22 + 50 Kästchen | eigene Rundung aus 28,4 % und 50,4 % |
| Bauteile nicht eigens ausgewiesen | in beiden Auszügen kommt keine Angabe zu Bauteilen oder Wiederverwendung vor |

Die Pressemitteilung nennt Boden, Steine und Baggergut nicht; sie nennt nur die andere Abfallart „Abfälle aus der
Gewinnung und Behandlung von Bodenschätzen“. Deshalb steht für diese Angabe eine zweite Quelle auf der Folie.

Nicht geprüft: die Quelle „Umweltbundesamt, Texte 93/2015“ und die SDG-Quelle aus v0.2; beide kommen in den Mustern
nicht vor.

## 4. Übereinstimmung mit dem tatsächlichen Produkt

**11 Prüfungen, alle bestanden.** Ausgabe wie oben.

- Die Aufnahme entstand mit `werkzeug/karte-fuer-folie.js` in einem frischen Browser ohne gespeicherte Daten:
  Fenster 1000 × 800, Sprache Deutsch, Zeitzone Europe/Berlin. Die Startbedingung des Demoablaufs war erfüllt
  (8 Paare, 2 prüfbar, 2 Vorgänge, Stichtag Mi 18.11., 14:00); keine Konsolenfehler. Messdaten:
  `aufnahmen/karte-k4.json`.
- Ansicht: „TW-05 und BD-22: Weiter prüfen“, Schritt K4 des Demoablaufs in `docs/pitch-ablauf.md`.
- Markierter Satz: „Prüfende 28.11.2026 liegt 123 Tage vor der Bestellfrist 31.03.2027.“ Markierter Knopf:
  „Prüfbitte anlegen“, nicht gesperrt.
- Die Karte selbst zeigt „Vorschlag zur Prüfung, keine fachliche Freigabe“ und „Simulation, es wird nichts
  versendet“.
- Zeitstrahl: 18.11.2026 plus 10 Tage ist der 28.11.2026; bis zum 31.03.2027 sind es 123 Tage; der 01.02.2027 ist
  Tag 75 von 133. Die Werte stehen so in den Beispieldaten (`plattform/app/daten.js`: TW-05 verfügbar ab 2027-02-01;
  BD-22 Bestellfrist 2027-03-31, Prüfzeit 10 Tage, als geschätzt gekennzeichnet).
- Der Code der Plattform ist gegenüber `2121b92` (Vorschau Fassung 2) bis auf `plattform/README.md` unverändert
  (`pruefung/04-regeltests-und-unveraenderter-stand.txt`).
- Am Bild verändert: nur die vier Ecken außerhalb des Kartenradius sind durchsichtig (`werkzeug/ecken-runden.py`).
  Hinterlegung, Rahmen, Mauszeiger und Pille sind eigene Elemente über dem Bild.

## 5. Weitere ausgeführte Prüfungen

| Prüfung | Befehl | Ergebnis |
|---|---|---|
| Regeltests | `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs` im Wurzelordner | 46 Tests, 46 bestanden |
| Unveränderter Stand außerhalb des Ordners | `git status --short` ohne den neuen Ordner | 0 geänderte oder neue Dateien |
| Farben des Kästchenbilds | Palettenprüfung, siehe `pruefung/03-farben-kaestchenbild.txt` | Unterscheidbarkeit bei Farbfehlsichtigkeit bestanden; Helligkeitsband und Buntheit für gleichrangige Kategorien nicht bestanden (hier bewusst: eine Kategorie hervorgehoben, Rest neutral); Kontrast der hellen Kästchen zur Fläche unter 3:1, ausgeglichen durch direkte Beschriftung |
| Zeichenbreiten und Textlage in Canva | Probeseite, `werkzeug/textlage-messen.py` | Textbreite 1389,17 px gemeldet, 1389,16 px berechnet; Grundlinie 0,9465 × Schriftgröße unter der Oberkante |

## 6. Was nicht geprüft wurde

- Beamer, Raum, Entfernung.
- Canva-Editor und Präsentationsmodus; Änderbarkeit der Farben in den SVG-Grafiken.
- Dauer des Vortrags mit Datenfolie (gerechnet 4:37, nicht gestoppt).
- Eine unabhängige Zweitprüfung dieser Unterlagen ist in Abschnitt 7 vermerkt, sobald sie gelaufen ist.

## 7. Unabhängige Durchsicht

Noch nicht eingetragen.
