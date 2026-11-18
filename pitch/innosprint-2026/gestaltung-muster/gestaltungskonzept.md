# Gestaltungskonzept für den CircularFlow-Pitch

**Fassung 1.0 · 18.11.2026 · Branch `codex/pitch-gestaltung-20261118` · Ausgangscommit `fbd6cff`**

Status: Vorschlag der Koordination. Über Übernahme, Änderung oder Verwerfung entscheidet das Team anhand der drei
Musterfolien.

## 1. Was die Referenzfotos zeigen

Grundlage sind die fünf Fotos, die Houssam bei Pitchveranstaltungen aufgenommen hat. Sie dienen nur als
Gestaltungsbeispiele. Logos, Zahlen und Aussagen daraus kommen im Pitch nicht vor; die Fotos selbst werden nicht
verwendet. Der frühere Stay-Safe-&-Brave-Pitch lag nicht vor.

| Foto | Was gestalterisch auffällt | Passt zu CircularFlow? |
|---|---|---|
| 1 · große Prozentzahlen links, Weltkarte mit Pfeilen rechts | Eine große Zahl je Zeile mit Symbol und einer kurzen Zeile darunter. Logo oben links mit Trennlinie. Karte mit Legende zeigt, woher etwas kommt. | **Ja:** große Zahl mit kurzer Einordnung und Symbol; fester Platz für das Zeichen. **Nein:** Karte und Flaggen, wir haben keine räumlichen Daten. |
| 2 · Prozesskette mit Pfeilfeldern und Würfeln | Ein Ablauf von links nach rechts; unter jedem Schritt ein Bild, das zeigt, wie sich die Menge verändert; unten eine Reihe runder Ergebnissymbole. | **Ja:** Abläufe und Größenverhältnisse als Bild statt als Text; erkennbare Dinge statt Kästen. |
| 3 · drei Bildschirmansichten mit je einem Wort | Das Produkt ist groß zu sehen; je Ansicht ein einziges Wort darunter; kurze Überschrift. | **Ja:** große Produktansicht, sehr wenig Beschriftung. **Nein:** Telefonrahmen. Die Projektleitung arbeitet am Bildschirm; ein Rahmen würde unsere Ansicht verkleinern. |
| 4 · große Angabe „Monat Jahr“ mit Sanduhr | Eine einzige große Angabe, kurze Erklärung daneben, ein Symbol für Zeit, kleine Quellenzeile unten links. | **Ja:** Quellenzeile an festem Platz; ein Symbol für Zeitdruck. **Nein:** heller Verlauf mit dünner heller Schrift; am Beamer zu kontrastarm. |
| 5 · ineinanderliegende Kreise | Größen werden durch Flächen verglichen; Überschrift links, Quelle unten. | **Ja:** Größenverhältnis als Fläche. Wir nehmen ein Kästchenbild, weil sich Anteile daran genauer ablesen lassen als an Kreisen. **Nein:** Marktgröße und Wachstum; solche Aussagen machen wir nicht. |

Aus Houssams Liste übernommen: anschauliche Grafiken zu Abläufen und Größenverhältnissen, groß dargestellte
Produktansicht, klare Aufteilung in Überschrift, Bild und kurze Erklärung, eigene Farben und wiederkehrende Elemente.

## 2. Farbwelt

Die Farben kommen aus der Plattform (`plattform/styles.css`) und werden um einen kräftigen Akzent ergänzt. So sehen
Folien und Produkt wie aus einer Hand aus.

| Rolle | Farbe | Verwendung |
|---|---|---|
| Grün | `#0E5546` | Markenfarbe der Plattform: Flächen, Hervorhebungen, Zeitstrahl |
| Grün tief | `#0B4638` | Boden der Einstiegsfolie |
| Grün mittel | `#1D7A64` | Gebäude |
| Grün hell | `#E0EEE8` | Symbolscheiben, helle Schrift auf Grün |
| Creme | `#F6F2EA` | heller Folienhintergrund |
| Bernstein | `#F2A33A` | **Akzent:** das Bauteil (Türen), Markierungen, Einheit der großen Zahl |
| Bernstein hell | `#FCEBCB` | Kasten „Wiederverwendbare Bauteile“ |
| Bernstein tief | `#96590A` | Fragezeichen auf hellem Bernstein (Kontrast 4,8:1) |
| Rot | `#C8402F` | nur für „zu spät“ |
| Tinte | `#17201D`, `#3F4A45`, `#59655F` | Schrift in drei Stufen |
| Kennzeichnung | Fläche `#F5EECB`, Schrift `#594810` | Pillen „Fiktiver Fall“, „Beispieldaten“, „Simulation“, „vorläufig“ wie in der Plattform |

Regel: Bernstein steht immer für das Bauteil oder für die Stelle, auf die man schauen soll. Rot steht nur für
„zu spät“.

## 3. Schrift und wiederkehrende Elemente

- **Schrift:** die Standardschrift, die Canva über die Schnittstelle setzt (Zeichenbreiten wie Arial). Die Schriftart
  lässt sich dort nicht wählen. Das Team kann in Canva eine andere Schrift setzen.
- **Größen auf 1920 × 1080** (2 px entsprechen 1 pt in der bisherigen PowerPoint-Fassung): Titel 56 bis 68 px fett;
  große Zahl 208 px; Beschriftungen 28 bis 48 px; Quellen- und Fußzeilen 20 bis 22 px. Nichts ist kleiner als 20 px
  (10 pt).
- **Unter 14 pt (28 px) liegen:** die Kennzeichnungen in Pillen („Fiktiver Fall“, „Beispieldaten“, „Simulation“ mit
  26 px; „Deutschland“, „2024“, „vorläufig“ mit 27 px; „Echte Ansicht der Vorschau“ mit 23 px, alle fett) sowie drei
  erläuternde Angaben („heute“ und „100 Kästchen = …“ mit 24 px, der Text im Bernstein-Kasten mit 27 px). Die
  bisherige Regel aus `pitch/innosprint-2026/werkzeug/GESTALTUNG.md` lautet „Nicht unter 14 pt für Inhalte und nicht
  unter 10 pt für Fußnoten“. Die Pillen und diese drei Angaben halten sie nicht ein, wenn man sie als Inhalt zählt.
  Vorschlag für die Übertragung: Pillen und diese Angaben auf 28 px setzen.
- **Titel:** eine Aussage in ein bis zwei Zeilen; der zweite Teil farbig.
- **Produktzeichen** oben links: das Zeichen der Plattform (abgerundetes Quadrat mit Kreislaufsymbol) und die
  Wortmarke.
- **Pillen** oben rechts oder am Inhalt für die Kennzeichnungen.
- **Quellen- oder Fußzeile** unten links.
- **Das Bauteil als Leitmotiv:** die bernsteinfarbene Tür erscheint auf der Einstiegsfolie und wieder auf der
  Datenfolie.

## 4. Die drei Musterfolien

| Folie | Frage | Bildidee | Übertragene Eigenschaft der Referenzen |
|---|---|---|---|
| 1 · Einstieg | Warum geht eine brauchbare Tür verloren? | Zwei Orte, ein unterbrochener Weg. Waagerecht: was passieren sollte (Türen zum Bedarf). Senkrecht: was stattdessen passiert (Container, Neubestellung). | Ablaufgrafik mit erkennbaren Dingen (Foto 2), Symbol für Zeit (Foto 4) |
| 2 · Problemgröße | Wie groß ist der Abfallstrom, und was davon sagt etwas über Bauteile? | Links die große Zahl auf Grün. Rechts 100 Kästchen: die Hälfte grün, davon der hellere Teil Boden, Steine und Baggergut. Das Bauteil steht außerhalb in einem eigenen Kasten mit Fragezeichen. | große Zahl mit kurzer Einordnung (Foto 1), Größenverhältnis als Fläche (Foto 5), Quellenzeile (Foto 4) |
| 3 · Produktnutzen | Reicht die Zeit, und was kann die Projektleitung jetzt tun? | Links ein maßstäblicher Zeitstrahl: Der kleine bernsteinfarbene Block ist die Prüfzeit, der lange grüne Strich die Zeit bis zur Bestellfrist. Rechts die echte Ergebniskarte in 1,93-facher Größe, ein Satz hinterlegt, ein Knopf umrandet. | große Produktansicht mit sehr wenig Beschriftung (Foto 3) |

Zur Produktfolie:

- Die Ansicht ist echt. Sie wurde aus der Plattform im Pitch-Stand aufgenommen, in einem 1000 px breiten Fenster. In
  dieser Breite bricht die Karte kompakt um und lässt sich so groß zeigen, dass ihre Schrift auf der Folie etwa
  28 px hoch ist.
- Gezeigt wird nur die Ergebniskarte, nicht das ganze Fenster. Sie ist der entscheidende Bereich der Ansicht
  „Abgleich“. Ein Geräterahmen hätte sie verkleinert.
- Markiert sind zwei Stellen: der Satz mit den 123 Tagen (halbtransparent hinterlegt) und der Knopf
  „Prüfbitte anlegen“ (Rahmen und Mauszeiger). Beide Markierungen liegen als eigene Formen über dem Bild; das Bild
  selbst ist nicht verändert, nur seine vier Ecken außerhalb des Kartenradius sind durchsichtig.
- Die Pille „Echte Ansicht der Vorschau“ und die Fußzeile sagen, was echt ist und dass es Beispieldaten sind.

## 5. Vorschlag für die Übertragung auf das ganze Deck

Erst nach der Beurteilung der Muster. Die Tabelle nennt je Folie des geprüften Pitches die geplante Darstellung.
Sprechtexte, Demoablauf und Ersatzbilder bleiben inhaltlich, wie sie sind.

| Folie des geprüften Pitches | Geplante Darstellung | Frage |
|---|---|---|
| 1 · Einstieg | wie Musterfolie 1 | Warum geht eine brauchbare Tür verloren? |
| neu · Problemgröße | wie Musterfolie 2, **nur wenn das Team sie aufnimmt** | Wie groß ist der Abfallstrom? |
| 2 · Spätestens am 5. Februar die Prüfung anfragen | maßstäblicher Zeitstrahl wie auf Musterfolie 3, hier waagerecht und groß: Die Prüfzeit als Block muss vor die Bestellfrist passen. Fall der Türen, 14 Tage angenommene Prüfzeit. | Bis wann muss die Prüfung angefragt sein? |
| 3 · CircularFlow zeigt, ob die Zeit für die Prüfung reicht | wie Musterfolie 3 | Reicht die Zeit, und was ist der nächste Schritt? |
| P4 (Foliennummer 4) · Live-Demo | ruhige Folie mit den beiden Paaren als große Karten und den Wegen zu den Ersatzbildern; Klickweg nur in den Notizen | Was sehen wir gleich? |
| Ersatzfolien K3 und K4 | je eine neu aufgenommene, scharfe Ergebniskarte in derselben Art wie auf Musterfolie 3 (K3 „zu spät“ mit gesperrter Prüfbitte, K4 „weiter prüfen“); Inhalt und Reihenfolge unverändert | Was hätte die Demo gezeigt? |
| P5 (Foliennummer 7) · Dortmunder Pilot | Kette „angeboten → rechtzeitig geprüft → wieder eingebaut“ als Bildfolge mit den Türen; das Zitat des Umweltamts groß | Was wollen wir im Pilot zählen? |
| P6 (Foliennummer 8) · Prototyp, Angebot, Team | links kleine echte Ansicht der Übersicht, rechts zwei Personenkarten; die Lücke „Uns fehlt …“ als Bernstein-Kasten | Wer sind wir, und was fehlt uns? |
| P7 (Foliennummer 9) · Schluss | dunkle Folie wie der Einstieg; die Bitte groß, die Tür als Motiv | Was brauchen wir von der Jury? |
| Anhang | gleiche Farben und Elemente, sonst sachlich und textnah | – |

Offen für die Übertragung: Musterfolie 3 zeigt dieselbe Ansicht, die kurz danach live vorgeführt wird (K4). Das Team
entscheidet, ob das als Vorbereitung gewollt ist oder ob Folie 3 eine andere Ansicht zeigen soll.

## 6. Grenzen

- Die Muster wurden nicht an einem Beamer geprüft.
- Die Farben des Kästchenbilds folgen der Regel „eine Kategorie hervorheben, ihre Teilmenge heller, der Rest
  neutral“. Ein Prüfwerkzeug für gleichrangige Kategorien meldet deshalb zu geringe Buntheit und Helligkeit außerhalb
  seines Bandes; die Unterscheidbarkeit bei Farbfehlsichtigkeit besteht es (`pruefung/03-farben-kaestchenbild.txt`).
- Auf Musterfolie 3 steht „123 Tage vor der Bestellfrist“ neben dem oberen Teil des grünen Strichs, vor der Marke
  „Bauteil frei ab“. Gemeint ist der ganze Strich bis zur Bestellfrist. Das kann als 65 Tage missverstanden werden.
  Vorschlag: eine Klammer über den ganzen Strich oder die Beschriftung „123 Tage bis zur Bestellfrist“. Noch nicht
  geändert.
- Das Deck als Ganzes ist noch nicht gestaltet. Dieser Abschnitt 5 ist ein Vorschlag.
