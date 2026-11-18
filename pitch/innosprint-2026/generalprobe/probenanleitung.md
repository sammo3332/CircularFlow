# Probenanleitung · 5-Minuten-Pitch INNOSPRINT · Generalprobe

Dokumentversion 1.1 · Stand 18.11.2026 · Branch `codex/plattform-v1` · Ausgangscommit `23dc050` ·
Deck-Stand `b647ea3`. Prüfsummen der Dateien: PPTX `9d5a86e7e239229a`, PDF `bc7f651fa7b5b669`, Sprechtext `e210d241234c43b0`.

Zum Ausdrucken sind die Abschnitte 1 bis 4 gedacht (als PDF drei Seiten, `probenanleitung-druck.pdf`). Abschnitt 5 trennt,
was hier **ausgeführt** wurde, von dem, was ihr noch **proben** müsst. Die Zeiten sind aus den Wortzahlen gerechnet und nicht
gestoppt.
Druckfassung neu erzeugen: `sed '/^## 5\./,$d' pitch/innosprint-2026/generalprobe/probenanleitung.md > /tmp/druck.md`, dann
`node docs/praxistest/pdf-erzeugen.cjs /tmp/druck.md pitch/innosprint-2026/generalprobe/probenanleitung-druck.pdf 9`.

## 1. Rollen und Sprecherwechsel

| Folie | Spricht | Dauer | Uhr am Ende | Übergabe an die nächste Person |
|---|---|---|---|---|
| 1 Eine brauchbare Tür kann verloren gehen | Feyrouz | 31 s | 0:31 | – |
| 2 Spätestens am 5. Februar die Prüfung anfragen | Feyrouz | 35 s | 1:06 | „Wie CircularFlow prüft, ob die Zeit reicht, zeigt Houssam.“ |
| 3 CircularFlow zeigt, ob die Zeit für die Prüfung reicht | Houssam | 27 s | 1:33 | – |
| 4 Live-Demo (K1 bis K4) | Houssam | 64 s | 2:37 | „Was das für Dortmund bringen kann, erklärt Feyrouz.“ |
| 7 In einem Dortmunder Pilot wollen wir messen … | Feyrouz | 33 s | 3:10 | „Was heute schon steht, zeigt Houssam.“ |
| 8 Der Prototyp läuft … | Houssam, dann Feyrouz | 48 s | 3:58 | Wechsel mitten in der Folie: „Feyrouz: Ich studiere ebenfalls …“ |
| 9 Wir suchen einen echten Umbaufall in Dortmund | Feyrouz | 21 s | **4:19** | Schluss: „Bringen Sie uns mit einem passenden Umbauprojekt in Kontakt.“ |

- **Wortzahl:** 433 Wörter, Feyrouz 244, Houssam 189. Bis 5:00 bleiben 41 Sekunden.
- **Zügig gesprochen** (2,3 Wörter je Sekunde) dauert es etwa 3:25. Wer nervös schneller wird, hat also Puffer.
- **Vorschlag:** Houssam bedient die Demo, Feyrouz hat die Uhr und gibt bei Bedarf das Zeichen.
- Die Folien 5, 6 und 10 bis 15 sind ausgeblendet. „Weiter“ auf Folie 4 springt zu Folie 7.

## 2. Die Demo in sechs Schritten (Folie 4)

Vorher: frisches Browserprofil, Vollbild, mindestens 1280 × 720. **Startbedingung:** Übersicht zeigt „8 Paare davon 2
prüfbar“, „2 Vorgänge“, oben rechts „Stichtag der Demo: Mi 18.11., 14:00 (Simulation)“ (links unten steht dazu die Auswahl „Mi 18.11., 14:00“) und oben in „Zeitkritisch“ den
Eintrag „noch 2 Std. · Aufmaßfrist · E-01 · T-07 → B-02“. Stimmt etwas nicht: neues frisches Profil.

| Schritt | Aktion | Das ist zu sehen | Dazu sagt Houssam |
|---|---|---|---|
| 1 · K1 | Alt+Tab (Mac: Cmd+Tab) zum Browser, Übersicht | Startbedingung wie oben | „… Ganz oben steht eine Innentür: Am Einbauort fehlt noch das Maß, die Frist endet in zwei Stunden …“ |
| 2 · K2 | Kachel „Paare derselben Gruppe“ (8 Paare) | Paarliste mit 8 Zeilen | „Jedes Paar ist ein Angebot und ein Bedarf derselben Bauteilgruppe.“ |
| 3 · K3 | Zeile **TW-01 → BD-23** | „Für diese Entscheidung zu spät“, „Prüfende 02.12.2026 liegt 5 Tage nach der Bestellfrist 27.11.2026“, Knopf „Prüfbitte anlegen“ gesperrt | „Dieses Paar ist zu spät … Deshalb ist die Prüfbitte gesperrt.“ |
| 4 | Oben im Pfad „Paare derselben Gruppe“ | Paarliste | – |
| 5 · K4 | Zeile **TW-05 → BD-22** | „Weiter prüfen“, „Vorschlag zur Prüfung, keine fachliche Freigabe“, „Prüfende 28.11.2026 liegt 123 Tage vor der Bestellfrist 31.03.2027“ | „Bei diesem Paar reicht die Zeit: weiter prüfen. Das ist ein Vorschlag, keine Freigabe …“ |
| 6 | Alt+Tab zurück, zu Folie 7 | Folie 7 | Übergabe an Feyrouz |

Die Prüfbitte wird in der Hauptdemo **nicht** angelegt. Wer es doch tut, muss die Vorschau danach zurücksetzen (neues
Profil, oder Erfassen → In diesem Browser gespeichert → Zurücksetzen).

**Hinweis zu K3 (Beispieldaten):** Die Oberfläche kennzeichnet die 14 Tage Prüfzeit bei BD-23 nicht als „geschätzt“: In
`plattform/app/daten.js` steht für BD-23 „belegt“ (Z. 164), obwohl Z. 162 beide Bedarfe als Beispielannahmen bezeichnet. Sagt
deshalb wie im K3-Satz „mit der **angenommenen** Prüfzeit“, und auf Nachfrage: „Die 14 Tage sind eine Annahme in den
Beispieldaten, nicht belegt.“ Die Daten wurden nicht geändert, damit Pitch-Stand und Ersatzbilder gleich bleiben. Ob BD-23 vor
dem Pitch auf „geschätzt“ gestellt wird (dann Ersatzbilder neu aufnehmen), entscheidet das Team.

**Mögliche Nachfrage zu K2 und K4:** „Warum steht in der Liste 58 Tage und auf der Seite 123 Tage?“ Antwort: Die Liste zeigt
hier die Reserve im Annahmefenster, 58 Tage (verfügbar ab 01.02.2027, Annahmefenster bis 31.03.2027). Die Seite nennt beide
Reserven: 123 Tage bis zur Bestellfrist und 58 Tage im Annahmefenster (`ergebnisse/abgleich-texte.txt`).

## 3. Zeitkontrollen

| Zeitpunkt | Soll | Wenn nicht |
|---|---|---|
| 1:33 | Houssam startet die Demo | – |
| **2:10** | K3 („zu spät“) ist zu sehen | Zurück zu PowerPoint, Folie 4, „Bildschirmfoto: zu spät ›“ |
| **2:25** | K4 („Weiter prüfen“) ist erreicht | Zurück zu PowerPoint, Folie 4, „Bildschirmfoto: weiter prüfen ›“ |
| 2:37 | Demo endet, Folie 7 beginnt | – |
| 3:10 / 3:58 | Folie 8 beginnt / Folie 9 beginnt | – |
| 4:19 | Ende (gerechnet) | Grenze 5:00 |

## 4. Wenn die Demo ausfällt

1. **Vorschau hakt oder lädt nicht** (zu jedem Zeitpunkt): zurück zu PowerPoint (Alt+Tab), nichts reparieren. Auf Folie 4
   die Links „Bildschirmfoto: zu spät ›“ (Folie 5) und „Bildschirmfoto: weiter prüfen ›“ (Folie 6) nutzen. Auf Folie 5
   führt „weiter ›“ zu Folie 6, auf Folie 6 „zurück zum Vortrag“ zu Folie 7.
2. **Spätfall (Ausfall um 2:10):** Waren K1 und K2 schon gesprochen, auf Folie 5 **nur den K3-Satz** sprechen. Das Ende
   liegt dann gerechnet bei etwa 4:27: 4:19 plus **angenommene** 8 Sekunden für das Zurückwechseln und zwei Klicks (nicht
   gemessen). Wer auf Folie 5 auch Einleitung und K2 spricht (21 Wörter, bei 1,8 Wörtern je Sekunde etwa 12 Sekunden mehr),
   kommt auf etwa 4:39. Die Regiezeilen in den Notizen werden nicht gesprochen.
3. **Link funktioniert nicht:** Im Vortragsmodus die Foliennummer tippen und Enter drücken (5 oder 6). Ob das in der
   Version am Vortragsrechner klappt, ist **nicht geprobt** (Abschnitt 5).
4. **PowerPoint fällt aus:** das PDF öffnen. Es enthält alle 15 Folien. Nach Seite 4 stehen die Ersatzfolien auf den
   Seiten 5 und 6, danach geht es auf Seite 7 weiter.
5. **Alles fällt aus:** die Bilder im Ordner `generalprobe/bilder/` (USB-Stick, Handy) und die ausgedruckten Seiten 1 und 5 des
   Sprechtexts (Ablauf und Demotext K1 bis K4). Es sind die vier Bildschirme der Demo bei Stichtag Mi 18.11., 14:00:
   `ausfall-1-uebersicht.jpg`, `ausfall-2-paarliste.jpg`, `ausfall-3-fuenf-tage-zu-spaet.jpg`,
   `ausfall-4-weiter-pruefen.jpg`.
6. **Rückfragen:** Foliennummer + Enter öffnet den Anhang (10 Prüfbitte und Fachergebnis, 11 Zeitprüfung, 12 Restmenge,
   13 Wettbewerb, 14 Grenzen, 15 Quellen). Kurzantworten stehen in den Notizen. Die Juryantworten stehen in
   `pitch/innosprint-2026/juryfragen/juryantworten.md`.

## 5. Ausgeführt und noch zu proben

### Hier ausgeführt (18.11.2026, Chromium über Playwright, Linux; die Ausgaben stehen in `ergebnisse/`)

| Prüfung | Ergebnis |
|---|---|
| Demo in frischem Browserkontext, **lokaler Stand** (`plattform/`, Code `2121b92`) | 28 von 28 Prüfungen bestanden, keine Konsolenfehler, keine Netzfehler (`ergebnisse/demo-lokal.json`) |
| Dieselbe Demo gegen eine **lokale Kopie der veröffentlichten Auslieferung** (Version `1794826502-00b9`, alle 35 Dateien nur lesend heruntergeladen und lokal geöffnet; **nicht** die Seite auf claude.ai) | 28 von 28 Prüfungen bestanden (`ergebnisse/demo-veroeffentlicht.json`) |
| Heruntergeladene Dateien gegen `plattform/` im Repository | 31 von 35 byte-gleich. Abweichend: `app/main.js`, `app/door-rules.mjs`, `index.html`, `styles.css`. Das ist der Bauschritt der Veröffentlichung (`ergebnisse/dateivergleich.txt`). Der Code ist seit `2121b92` nur in der README geändert (`ergebnisse/diff-anwendungscode.txt`) |
| Heruntergeladene Dateien gegen einen Nachbau aus dem Repository (`node plattform/bauen-artifact.mjs`) | 34 von 35 Dateien byte-gleich. `index.html` weicht nur im Seitentitel („CircularFlow Fassung 2“) und im vom Dienst ergänzten HTML-Rahmen ab (`ergebnisse/dateivergleich.txt`, Unterschied gespeichert in `ergebnisse/index-html-diff.txt`) |
| Startbedingung | 8 Paare, davon 2 prüfbar; 2 Vorgänge; Stichtag Mi 18.11., 14:00; „Zeitkritisch (7 Tage)“ mit 4 Fristen und oben „noch 2 Std. · Aufmaßfrist · E-01 · T-07 → B-02“ |
| K3 | „Für diese Entscheidung zu spät“; „Prüfende 02.12.2026 liegt 5 Tage nach der Bestellfrist 27.11.2026“; „Prüfbitte anlegen“ mit `aria-disabled`; Klick auf den Knopf legt nichts an |
| K4 | „Weiter prüfen“; „Vorschlag zur Prüfung, keine fachliche Freigabe“; „Prüfende 28.11.2026 liegt 123 Tage vor der Bestellfrist 31.03.2027“; Knopf nicht gesperrt (nicht angeklickt) |
| Fehlendes Maß (K1) | Entscheidungsseite E-01: „Rohbauöffnung B-02 … messen oder ein verwertbares Aufmaß nachreichen. Ohne verwertbares Aufmaß bleibt die Breite offen.“ |
| Nach dem Durchlauf | unverändert 8 Paare, davon 2 prüfbar, 2 Vorgänge |
| Fenstergröße 1280 × 720 | kein seitliches Scrollen auf Übersicht, Paarliste, K3 und K4 |
| Ersatzbilder gegen frische Aufnahme | `bilder/k1` bis `k4` (Quelle der Ersatzfolien) stimmen mit der neuen Aufnahme überein: 0,03 bis 0,21 % der Pixel weichen ab, mittlerer Unterschied unter 0,7 von 255 (`ergebnisse/bildvergleich.txt`). Vermutlich ist das JPEG-Rauschen (gemessen wurden nur Pixelanteil und Mittelwert). Wie die Bilder auf den Ersatzfolien 5 und 6 wirken, wurde nur in der Seitenübersicht der PDF angesehen, nicht am Beamer |
| Regeltests | 190 von 190 bestanden (`ergebnisse/regeltests.txt`; getrennt 46 + 144: `ergebnisse/regeltests-getrennt.txt`). Das belegt die Prüffälle, keine Fehlerfreiheit |
| Pitch-Dateien (PPTX, PDF, Sprechtext) gegen README | 23 von 23 Prüfungen bestanden: Prüfsummen, 15 Folien, ausgeblendet 5, 6, 10–15, fünf Links in PPTX und PDF, 433 Wörter (244 / 189), Zeitfenster 259 s, Uhrzeiten, Sprechtext 16 Seiten, jeder Notizabsatz im Sprechtext |

Nachvollziehen: `pruefskripte/` und `ergebnisse/` in diesem Ordner, Aufruf im Prüfprotokoll
(`pruefprotokoll-2026-11-18.md`).

### Noch zu proben (nichts davon war hier möglich)

- [ ] **PowerPoint am Vortragsrechner:** Datei öffnen. Referentenansicht: Notizen als Absätze, „Spricht: …“ fett.
      Mit **Arial** (hier wurde mit Liberation Sans gerendert) auf den Folien 1, 4, 8 und 9 prüfen, ob etwas umbricht
      oder überläuft.
- [ ] **Links im Vortragsmodus** mit Maus oder Touchpad (ein Presenter kann keine Links anklicken): Folie 4 → 5 → 6 → 7
      und Folie 4 → 6 → 7. „Weiter“ auf Folie 4 muss zu Folie 7 springen. Foliennummer + Enter auf eine
      ausgeblendete Folie.
- [ ] **Umschalten** aus dem Vortragsmodus in den Browser und zurück (Alt+Tab bzw. Cmd+Tab), Browser im Vollbild.
- [ ] **Vorschau am Veranstaltungsort:** Online-Vorschau öffnen. Die Seite auf claude.ai wurde hier **nicht** im Browser
      geöffnet. Geprüft ist nur der heruntergeladene Stand. Netz am Ort klären. Als Rückfall die lokale Variante
      (`python3 -m http.server 8000`, dann `http://localhost:8000/plattform/`).
- [ ] **Stoppuhr:** ganzer Vortrag in ruhigem Tempo (gerechnet 4:19), Demo allein (gerechnet 64 s), Spätfall mit
      Ausfall um 2:10 (gerechnet 4:27). **Keine dieser Zeiten ist gemessen.**
- [ ] **Beamer:** Sind die Zeitleiste auf Folie 2 und die Farben Grün, Gelb und Rot gut erkennbar? Sind die
      Bildschirmfotos auf den Folien 5 und 6 lesbar (der Kleintext darin ist klein, die Aussage steht in der
      Bildunterschrift)?
- [ ] **PDF-Export,** falls ihr in PowerPoint etwas ändert: „Ausgeblendete Folien einschließen“ wählen, sonst fehlen
      Ersatzfolien und Anhang.
- [ ] **Nach jeder Probe:** Vorschau zurücksetzen, Startbedingung direkt vor dem Pitch erneut prüfen.

### Vorschlag für die Generalprobe (etwa 45 Minuten)

1. Technik (10 Minuten): PowerPoint öffnen, Notizen, Arial-Umbrüche, Links, Alt+Tab, Vorschau laden.
2. Demo allein, dreimal, mit Stoppuhr (10 Minuten).
3. Ganzer Vortrag mit Stoppuhr, zweimal, mit allen Übergaben (15 Minuten). Danach die Zeit in Abschnitt 1 eintragen.
4. Einmal den Ausfall um 2:10 durchspielen (5 Minuten).
5. Technik-Check am 20.11. ab 13:30 Uhr (laut Veranstalterunterlage Tag 5, S. 3/4; Uhrzeit bitte beim Veranstalter bestätigen): Beamer, Adapter (HDMI oder USB-C), Strom, Hotspot, PDF und PPTX auf einem
   USB-Stick.
