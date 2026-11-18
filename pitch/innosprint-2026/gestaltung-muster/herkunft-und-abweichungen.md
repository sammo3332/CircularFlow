# Herkunft der Inhalte und Abweichungen

**Fassung 1.0 · 18.11.2026 · Branch `codex/pitch-gestaltung-20261118` · Ausgangscommit `fbd6cff`**

Verglichen werden drei Stände:

| Kürzel | Stand | Fundstelle | Wie gelesen |
|---|---|---|---|
| **GP** | geprüfter Pitch, 5 Minuten | `pitch/innosprint-2026/werkzeug/inhalt-p5.js`, Abgabe in `pitch/innosprint-2026/ausgabe/abgabe-5-minuten/` (PPTX-Prüfsumme beginnt mit `9d5a86e7e239229a`, PDF mit `bc7f651fa7b5b669`), Branch `codex/plattform-v1`, Commit `fbd6cff` | Quelldatei vollständig gelesen |
| **v0.2** | ChatGPTs Gestaltungsfassung v0.2 vom 18.11.2026 | vom Team hochgeladenes Paket `CircularFlow_Gestaltungsfassung_v0.2_Paket.zip`, SHA-256 `6a99a15421e46361986c8b7154e8c12743c03bd960c5bb87c80ff63326e0551f` | Übergabe vollständig gelesen; Folientexte und Notizen aus der PPTX ausgelesen; alle 15 Folien als Bild angesehen |
| **Muster** | die drei Musterfolien | Canva-Design `DAHbQg1-t6o`; Beschreibung in `werkzeug/folien.js`; Endstand in `canva/stand-final.json` | selbst gebaut und geprüft |

Das Paket v0.2 wurde nicht verändert und nicht ins Repository übernommen. Es enthält auf Folie 1 ein fremdes Foto
ohne nachgewiesene Nutzungsfreigabe. Prüfsummen seiner vier Dateien:

| Datei | SHA-256 |
|---|---|
| `CircularFlow_INNOSPRINT_Gestaltungsfassung_v0.2.pptx` | `43356bbc79282b7fc1237f4c02e0ae268226550604d14a7ae12c382393c63e0c` |
| `CircularFlow_INNOSPRINT_Gestaltungsfassung_v0.2.pdf` | `4bb28eed719fb0b30f8accc8b02d0c27c417ee75ac466a7c16853d20024d1620` |
| `CircularFlow_Sprechtext_und_Probe_v0.2.pdf` | `1f5a7d039696fd77934f50241a99c31a1afbf0a593ffc4b505081d22e9a7afbb` |
| `CircularFlow_Uebergabe_Gestaltungsfassung_v0.2.md` | `149214a5a3db70d0ef668f610d7ba3ddfe405f5563816c0176959e10edd8ff14` |

Die drei ersten Prüfsummen stimmen mit den Angaben in der Übergabe von v0.2 überein.

## 1. Abweichungen zwischen geprüftem Pitch und v0.2

Status: **belegt** = an der Quelle selbst gelesen · **übernommen** = Angabe aus v0.2, hier nicht nachgeprüft ·
**unbelegt** = keine Quelle gefunden.

| Nr. | Thema | GP | v0.2 | Herkunft und Prüfung | Umgang in den Mustern |
|---|---|---|---|---|---|
| A1 | Aufbau | 15 Folien: 7 im Vortrag (Einstieg, Frist, Lösung, Demo, Impact, Team, Schluss), 2 Ersatzfolien, 6 Anhang | 15 Folien, 7 im Vortrag. Die ersten drei Erklärfolien sind ersetzt durch Titel, Kontextzahl und ein zusammengefasstes Fallbeispiel | v0.2-Übergabe, Abschnitt „Änderung gegenüber dem bisherigen Pitch“; in der PPTX nachgelesen | Die Muster halten sich an Titel und Sprechtext von GP-Folie 1 und GP-Folie 3. Über den Aufbau des ganzen Decks entscheidet das Team. |
| A2 | Wortzahl und Dauer | 433 Wörter (Feyrouz 244, Houssam 189), rechnerisch 4:19 | 410 Wörter (Feyrouz 254, Houssam 156), rechnerisch 4:22 mit 30 s für Wechsel und Klicks, nicht gestoppt | GP: Zeitangaben in `inhalt-p5.js` (letzte Folie endet bei 4:19); v0.2: Übergabe | Musterfolie 1 und 3 ändern nichts. Musterfolie 2 käme hinzu, siehe B2. |
| A3 | Abfallzahl | keine. Folienplan, Zeile 536: „Wir nennen keine Zahlen. Die Übersicht zeigt bewusst keine Kosten-, CO₂- oder Abfallwerte, weil Daten fehlen“ | Folie 2: „182,8 Millionen Tonnen · Bau- und Abbruchabfälle in Deutschland · 2024“, „vorläufige Ergebnisse“ | **belegt.** Destatis, Pressemitteilung Nr. 185 vom 1. Juni 2026, am 18.11.2026 direkt gelesen: „mit 50 % (182,8 Millionen Tonnen)“, „nach vorläufigen Ergebnissen“. ChatGPT hatte die Seite nur über eine Websuche gelesen (direkter Abruf dort 403). | Zahl übernommen, mit Jahr, Region, „vorläufig“ und Quelle. Der Auftrag vom 18.11.2026 verlangt die Zahl ausdrücklich; die frühere Festlegung ist damit für eine belegte Kontextzahl geändert. Eigene Einsparungen bleiben ausgeschlossen. |
| A4 | Boden und Steine | – | Folie 2: „Enthält auch Boden und Steine.“ | **belegt, aber nicht in der von v0.2 genannten Quelle.** Die Pressemitteilung nennt Boden und Steine nicht. Die Angabe steht in der Tabelle „Abfallaufkommen“ des Umweltbundesamts (Quelle dort: Statistisches Bundesamt, Abfallbilanz): „darunter Boden, Steine und Baggergut“ 102.887 Tsd. t für 2024. | Als eigene Angabe mit zweiter Quelle auf der Folie: 102,9 Mio. t. |
| A5 | „kleiner Teil“ | – | Sprechtext Folie 2: „Wir setzen bei einem kleinen Teil an: Bauteilen, die weiterverwendet werden könnten.“ | **unbelegt.** Keine der gelesenen Quellen weist eine Menge wiederverwendbarer Bauteile aus. | Nicht übernommen. Stattdessen: „Wie viel davon wiederverwendbare Bauteile sind, weisen die Zahlen nicht aus.“ |
| A6 | Demo-Zeitmarken | Notiz Folie 4: „Steht K3 um 2:10 nicht da …“, „Ist K4 um 2:25 noch nicht erreicht …“ | Demo-Fenster 1:26 bis 2:35; „Die früheren 2:10/2:25 gelten hier nicht.“ | v0.2-Übergabe und Notiz der Folie 4 | Die Muster berühren den Demoablauf nicht. Bei der Übertragung gelten die Zeitmarken des geprüften Pitches, solange das Team nichts anderes festlegt. |
| A7 | SDG 12.5 | „sinngemäß wiedergegeben“ | „von ChatGPT an der UN-Primärquelle geöffnet“ | **übernommen**, hier nicht nachgeprüft | nicht Teil der Muster |
| A8 | Titelbild | kein Foto | Folie 1 mit Foto aus dem Concular-Workshop, S. 30; laut Übergabe „Keine Nutzungsfreigabe in dieser Runde nachgewiesen“ | v0.2-Übergabe, Punkt 6 | Nicht verwendet. Die Muster enthalten nur eigene Grafiken und die eigene Plattformaufnahme. |
| A9 | Einstiegstext | 55 Wörter mit dem Fall der zwölf Türen | Folie 1: 31 Wörter ohne Fall; der Fall folgt auf Folie 3 (70 Wörter) | PPTX-Notizen von v0.2 | Musterfolie 1 nutzt den geprüften Text unverändert. |
| A10 | Auftrag an Claude in der Übergabe | – | „Höchstens drei wesentliche Befunde … Keine allgemeine Neugestaltung.“ | v0.2-Übergabe, letzter Abschnitt | Durch Houssams Auftrag vom 18.11.2026 ersetzt, der die Neugestaltung ausdrücklich verlangt. |
| A11 | Prüfung des Produkts | Demo im frischen Browser geprüft (Generalprobe) | „Die Browserprüfung konnte in dieser Umgebung nicht neu laufen“; Bildschirmfotos wiederverwendet | v0.2-Übergabe | Für Musterfolie 3 wurde die Ansicht am 18.11.2026 neu aus der Plattform aufgenommen, siehe Abschnitt 3. |

Nicht einzeln verglichen wurden die Folien 7 bis 15 von v0.2 (Impact, Team, Schluss, Anhang). Sie sind nicht Teil der
drei Muster.

## 2. Abweichungen der Musterfolien vom geprüften Pitch

| Nr. | Musterfolie | Abweichung | Herkunft | Offen |
|---|---|---|---|---|
| B1 | 1 · Einstieg | Neuer sichtbarer Text „können im Container landen“ | geprüfter Sprechtext der Folie 1: „Die angebotenen Türen können im Container landen.“ | – |
| | | Gezeigt werden sechs angebotene und sechs gesuchte Türen. Die zwölf ausgebauten Türen stehen nur in der Beschriftung „6 von 12 Türen angeboten“; GP zeigte zwölf Türsymbole. | Gestaltungsentscheidung, Aussage unverändert | – |
| | | Teamzeile ohne vorangestelltes „CircularFlow ·“; dafür Produktzeichen und Wortmarke oben links | Gestaltungsentscheidung | – |
| | | Titel in zwei Zeilen, zweite Zeile farbig; Wortlaut unverändert | Gestaltungsentscheidung | – |
| | | Gebäude, Uhr auf fünf nach zwölf, Container, Lieferwagen als Illustration | eigene Grafiken; kein neuer Sachverhalt | – |
| B2 | 2 · Problemgröße | **Ganze Folie neu.** Titel „Die Hälfte aller Abfälle sind Bau- und Abbruchabfälle“ | Destatis, PM 185, Zwischenüberschrift: „Die Hälfte aller Abfälle im Jahr 2024 waren Bau- und Abbruchabfälle“ | Aufnahme in den Vortrag: Entscheidung des Teams |
| | | „182,8 Millionen Tonnen“, „50 % aller Abfälle“, „362,7 Mio. t Abfälle insgesamt“ | Destatis, PM 185 | – |
| | | „darunter Boden, Steine und Baggergut: 102,9 Mio. t“ | Umweltbundesamt, Tabelle „Abfallaufkommen“, Zeile „darunter Boden, Steine und Baggergut“, 2024: 102.887 Tsd. t | – |
| | | Kästchenbild 28 + 22 + 50 | **eigene Rundung:** 182.769 / 362.719 = 50,4 %; 102.887 / 362.719 = 28,4 %. Auf der Folie steht „1 Kästchen = 1 % aller Abfälle, gerundet“. | – |
| | | „Wiederverwendbare Bauteile wie Türen sind in diesen Zahlen nicht eigens ausgewiesen. Wir leiten daraus keine Einsparung ab.“ | Beobachtung an beiden Quellen: keine eigene Angabe zu Bauteilen oder Wiederverwendung | – |
| | | Sprechtext-Vorschlag, 32 Wörter | neu formuliert; nicht Teil des geprüften Sprechtexts | Wer spricht; Zeit, siehe unten |
| B3 | 3 · Produktnutzen | Echte Ergebniskarte statt des Schemas „drei Angaben → Frage → drei Ergebnisse“ | Auftrag: große echte Plattformansicht | Zu sehen ist nur „Weiter prüfen“. „Knapp“ und „zu spät“ stehen nur im Sprechtext. |
| | | Die Zeilen „Was fehlt? Was ist der nächste Schritt?“ und „Fachleute beurteilen die Eignung · Die Projektleitung entscheidet die Bestellung“ entfallen als Folientext | Die Aufnahme selbst zeigt „Vorschlag zur Prüfung, keine fachliche Freigabe“ und den nächsten Schritt | Soll der Satz zur Rollenverteilung sichtbar bleiben? |
| | | Zeitstrahl mit „heute“, „10 Tage · angenommene Prüfzeit“, „123 Tage vor der Bestellfrist“, „Bauteil frei ab 01.02.2027“, „Bestellfrist 31.03.2027“ | Beispieldaten der Plattform (`plattform/app/daten.js`, TW-05 und BD-22) und der Satz der Ergebniskarte; nachgerechnet | – |
| | | Das Beispiel sind Systemtrennwände, nicht Türen | wie in der geprüften Demo (K3, K4); in der Fußzeile vermerkt | – |
| | | „heute“ ist der Stichtag der Demo, Mi 18.11.2026, 14:00 (Simulation) | Plattform; in der Fußzeile vermerkt | – |

**Zur Dauer.** Der geprüfte Pitch rechnet mit 433 Wörtern, etwa 1,8 Wörtern je Sekunde und 4:19 einschließlich
18 Sekunden für Wechsel und Klicks (`pitch/innosprint-2026/README.md`, Abschnitt zur Länge; die Folienzeiten im
Generator summieren sich auf 259 Sekunden). Der Vorschlag für Musterfolie 2 hat 32 Wörter, bei diesem Tempo etwa
18 Sekunden. Rechnerisch ergäbe das 4:37. Das ist eine Rechnung, keine gestoppte Zeit. v0.2 hat für die Zahl dagegen
die ersten drei Folien umgebaut.

## 3. Quellen der Musterfolien

| Aussage | Status | Quelle | Prüfweg am 18.11.2026 | Offen |
|---|---|---|---|---|
| 362,7 Mio. t Abfälle insgesamt, Deutschland 2024, vorläufig | veröffentlichte Angabe der Statistikbehörde | Statistisches Bundesamt (Destatis), Pressemitteilung Nr. 185 vom 1. Juni 2026, <https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/06/PD26_185_321.html> | Seite direkt abgerufen; Auszug `quellen/destatis-pm185.txt`; SHA-256 der abgerufenen Seite `64325dad80ce8a9758793f6861ca339b8e90ade35c640dc24b86b74fbe1b8749` | endgültige Ergebnisse können abweichen |
| 182,8 Mio. t Bau- und Abbruchabfälle, 50 % | wie oben | dieselbe Pressemitteilung | wie oben | wie oben |
| 362.719 und 182.769 Tsd. t | wie oben | Destatis, Kurzübersicht Abfallbilanz 2024 | Seite direkt abgerufen; Auszug `quellen/destatis-kurzuebersicht.txt`; SHA-256 `b5cfb8d9caa0ad22678a2f2205f5ca7c30e3b3a70f8cc01b7e0f3430b46f4bc4` | – |
| darunter Boden, Steine und Baggergut 102.887 Tsd. t | veröffentlichte Angabe, Datenquelle Statistisches Bundesamt | Umweltbundesamt, Tabelle „Abfallaufkommen in Tausend Tonnen“ (PDF, Dateiname mit Datum 2026-10-29) | PDF direkt abgerufen und Text ausgelesen; Auszug `quellen/uba-tabelle.txt`; SHA-256 `efd0044c6f62c8ce498ca49c93f20be11dc5de36c0d9eb61417b0aea93026153` | Die Tabelle kennzeichnet 2024 nicht eigens als vorläufig; die Werte stimmen mit den vorläufigen von Destatis überein. |
| 50 und 28 von 100 Kästchen | eigene Rechnung | aus den Tabellenwerten | `werkzeug/pruefen.js`, Abschnitt 3 | – |
| Bauteile sind in den Zahlen nicht eigens ausgewiesen | Beobachtung an den zwei Quellen | Pressemitteilung und UBA-Tabelle | Textsuche in beiden Auszügen | Andere Statistiken wurden nicht durchsucht. |
| Fall der zwölf Türen | fiktiver Fall | geprüfter Pitch, Fallakte CF-PILOT-01 | Wortlaut gegen `inhalt-p5.js` verglichen | keine neue fachliche Prüfung |
| Ergebniskarte „Weiter prüfen“, 123 Tage, Knopf „Prüfbitte anlegen“ | direkt beobachtete Funktion mit Beispieldaten | Plattform im Pitch-Stand (`plattform/`, gegenüber Code `2121b92` nur `README.md` geändert) | im frischen Browser aufgenommen, Startbedingung erfüllt, keine Konsolenfehler; `aufnahmen/karte-k4.json` | Simulation; kein Praxisnachweis |
| angenommene Prüfzeit 10 Tage | Beispielannahme | `plattform/app/daten.js`, BD-22: `pruefzeitTage: 10`, als geschätzt gekennzeichnet | Datei gelesen | keine ermittelte Prüfzeit |

Die in v0.2 zusätzlich genannte Quelle „Umweltbundesamt, Texte 93/2015“ wird in den Mustern nicht verwendet und
wurde nicht geprüft.

## 4. Was bewusst nicht behauptet wird

- keine Menge oder kein Anteil wiederverwendbarer Bauteile,
- keine Einsparung, kein CO₂-Wert, kein Marktvolumen,
- keine fachliche Freigabe durch die Plattform, kein Praxisfall, kein Partner.
