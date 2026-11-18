# Priorisierung nach dem Pitch · Abgleich der Produktpläne

| | |
|---|---|
| Dokumentversion | 1.1 vom 18.11.2026. Entwurf der Planung (`cf-planung`), von der Koordination um Abschnitt 5 ergänzt und nach der ersten unabhängigen Prüfung berichtigt (Ausgangscommit, Auftragszitat, Fenster). Keine Fortschreibung des Produktbriefs v0.2. |
| Branch, Ausgangscommit | `codex/plattform-v1`, `da85183` (Stand, auf den sich die Zeilenangaben beziehen). Bis `23dc050` kamen `e244fc4`, `d4116ef`, `c584285` und `23dc050` hinzu; an `plattform/` und `prototype/` änderte sich dabei nur die README. Dass der Anwendungscode seit `2121b92` unverändert ist, steht im Plan Restmenge 1.1. Die Koordination hat es am 18.11.2026 nachgeprüft: `git diff --stat 2121b92 23dc050 -- plattform prototype` zeigt nur `plattform/README.md` (2 Zeilen), Ausgabe in `pitch/innosprint-2026/generalprobe/ergebnisse/diff-anwendungscode.txt`. |
| Gelesen, mit Fassung | Produktbrief v0.2 (08.11.2026) · Plan Restmenge 1.1 (16.11.) · Fallakte CF-PILOT-01 1.3 (16.11.), ganz · plattform-v2 2.0 (16.11.), ganz · Produktideen 1.3 (17.11.) · pitch-ablauf (Stand 16.11.) · claude-vor-entwicklung und agenten-start (14.11.) · AGENTS.md, CLAUDE.md, README · Code `plattform/app/*` und Tests · CF-UMBAU-01 Rev. 2 nur Z. 60–98 (Fristbegriffe). Softwareplanung v0.1 nicht gelesen (Stichwortsuche nach Prüfzeit, Prüfbitte, Restmenge ohne Treffer). |
| Aussagenarten | **Vorgabe** = im Repository bestätigt · **Beobachtung** = von mir in Code oder Dokument gelesen, nicht ausgeführt · **Empfehlung** = mein Vorschlag |

Keiner der drei Kandidaten steht im Produktbrief v0.2, und keiner ist freigegeben. Kriterien der Priorisierung: Nutzen für die Kernfrage „reicht die Zeit?“, Größe, Risiko für die Demo, offene Teamentscheidungen.

## 1. Überschneidungen und Widersprüche

| Nr. | Befund | Folge |
|---|---|---|
| 1 | **Reihenfolge.** Vorgabe: Der Auftrag vom 16.11. priorisiert zuerst die Restmenge, dann den zweiten Vorgang, und sagt „für jetzt genügt die Dokumentation“ (Plan Restmenge §1). Fallakte §9 und §11 stellen „Prüfbitte spätestens“ als späteren Kandidaten zurück („abgelöst“), Produktideen B2 ebenso. Der aktuelle Auftrag der Hauptsitzung („eine kleinste sinnvolle Verbesserung umsetzen“) steht nicht im Repository. | Widerspruch zwischen „nur Dokumentation“ und „umsetzen“, und zwischen „Restmenge zuerst“ und „kleinste zuerst“. Das Team entscheidet (Frage 1). Meine Empfehlung wählt nach Größe, nicht nach dem Auftrag vom 16.11. |
| 2 | **Gleicher Code.** Beide Pläne ändern den Block „Zeitkritisch“ (`kennzahlen.js` Z. 82–105, `uebersicht.js` Z. 24–43). Die Restmenge ergänzt die Bestellfrist um „n Stk offen“, „Prüfbitte spätestens“ fügt je Bedarf einen eigenen Eintrag ein. | Kein inhaltlicher Konflikt, aber ein Merge-Konflikt. Einträge je Bedarf nach `name` unterscheiden, nicht nach `art` und `id` (beide Eintragsarten tragen `art: 'bedarf'` und dieselbe `id`). |
| 3 | **Nach dem Fristtag.** Restmenge A9: Die Bestellfrist bleibt überfällig („gewollt“). plattform-v2 §4: überfällig heißt verstrichen bei nicht erledigtem Vorgang. Für „Prüfbitte spätestens“ sagt kein Dokument, was nach dem Fristtag geschieht. | Empfehlung: nie überfällig, der Abgleich meldet dann „zu spät“. Sonst stünde BD-23 (Frist 13.11.2026) am Demo-Stichtag als fünfte Frist da. |
| 4 | **Prüfzeit im Pilot.** Fallakte A5 nennt die 14 Tage „nicht belegt“. Klickpfad Schritt 6 und `cf-pilot-01-simulation.mjs` (Z. 33, 54) speichern sie als „belegt“, weil „belegt“ der Standard ist (`bedarf.js` Z. 53–55, `bedarfform.js` Z. 14). Beobachtung. | Der externe Hinweis „Prüfzeiten sind zu belegende Eingaben“ trifft das. Pilotdaten sollen „geschätzt“ tragen, die Fallakte ist nachzuführen. |
| 5 | **Produktbrief.** v0.2 kennt weder Bedarf noch Vorgang noch Abgleich. plattform-v2 §9 Punkt 5 („Produktbrief fortschreiben?“) ist offen. Nur die Regel „Eingang plus Mindestprüfzeit darf auf den Fristtag fallen“ (Produktbrief, Abschnitt Regel) stützt die Formel von „Prüfbitte spätestens“. | Ausdrückliche Freigabe nötig, keine stillschweigende Fortschreibung. |
| 6 | **Hinweise der Hauptsitzung.** Beobachtung: Beide Punkte sind im Code nachvollziehbar. „Zeitkritisch“ nutzt 7 Tage (`kennzahlen.js` Z. 32, 101). Nach der Teil-Vormerkung zählt der Fachkern die Menge des Bauteils (`abgleich.js` Z. 93–101) und gilt der Bedarf als belegt (`vorgang.js` Z. 89–92). Der externe Prüfbericht liegt mir nicht vor. | Zum Satz „Geprüfte Mengen sind nicht tatsächlich wiederverwendete Mengen“: Die Restmenge darf „übergeben“ nicht als „wiederverwendet“ formulieren (Plan A5 bleibt bei „laut Eintrag“). |

## 2. Was jeder Plan beschreibt und was fehlt

| Quelle | Verhalten | Ausschluss | Abnahme | Betroffene Stellen | Fehlt |
|---|---|---|---|---|---|
| Plan Restmenge 1.1 | ja (Stufe 1, 2) | ja (§6) | ja (A1–A10, B1–B7) | ja (§7, mit Zeilen) | Aufwand; Antworten auf F1–F6; Browserabnahme der 2027-Fälle (Oberfläche nur 18.–20.11.2026); Wortlaut für lfm und m² |
| Fallakte §9 „Prüfbitte spätestens“ | Formel und Beispiel (kurzer Absatz) | nein | nein | nein | Wortlaut, Randfälle, Dateien, Tests, Umgang mit dem Annahmefenster |
| Fallakte §5, §10 | Nachrechnung der Varianten | – | Prüfungen im Skript | – | – |
| plattform-v2 2.0 | Regeln §3, Kennzahlen §4, Fristablauf §10 | §0 | je Paket | §7 (Dateien) | Fortschreibung des Produktbriefs offen |
| Produktideen 1.3 | Ideen N1–N6, B1–B3 | „keine Freigabe“ | nein | nur Verweise | Spezifikation je Idee |
| pitch-ablauf | Startbedingung, K1–K6, Zusätze | – | 28 Schritte geprüft | – | keine Aussage zu neuen Fristen |

## 3. Priorisierung (höchstens drei)

**P1 · Frist „Prüfbitte spätestens“ (Bestellfrist minus Prüfzeit). Empfehlung: zuerst.**
- **Nutzerproblem:** Die Planung sieht den letzten Tag für die Prüfbitte nirgends. Im Pilot ist es der 05.02.2027, „Zeitkritisch“ zeigt die Bestellfrist erst ab 13.02. Die Beispielbedarfe haben 10 und 14 Tage Prüfzeit, also mehr als die 7 Tage des Fensters. (Die Beispielbedarfe BD-22 und BD-23 sind ausgedachte Zeitangaben; BD-23 trägt in `daten.js` trotzdem „belegt“, siehe Plan E10.)
- **Verhalten:** Unter „Zeitkritisch (7 Tage)“ steht für jeden Bedarf mit prüfbarem Paar und ohne laufenden Vorgang der Eintrag „Prüfbitte spätestens“, und die Bedarfsseite nennt den Tag samt Rechnung. Die Frist folgt dem Abgleich: bis zu diesem Tag „Weiter prüfen“ oder „Knapp“, danach „Für diese Entscheidung zu spät“.
- **Ausgeschlossen:** Versand und Erinnerung, Änderung von Abgleichregel und Vorgangsfristen, neue Eingabefelder, Zeile auf der Abgleichseite, Wochenendregel, Kosten und CO₂.
- **Abnahme:** (1) Pilot BD-24 ergibt den 05.02.2027. (2) Der Eintrag erscheint am 30.01.2027 um 09:00, am 29.01.2027 um 09:00 noch nicht. (3) Der Demo-Stichtag bleibt unverändert (8 Paare, 2 prüfbar, 2 Vorgänge, 4 Fristen). (4) Kein Eintrag bei laufendem Vorgang, fehlender Prüfzeit oder ohne prüfbares Paar. (5) „geschätzt“ ist sichtbar. (6) Die bestehenden Tests bleiben grün. Ausführlich im Plan `docs/plan-pruefbitte-spaetestens.md`, PS-1 bis PS-12.
- **Dateien:** `abgleich.js`, `kennzahlen.js`, `ansichten/uebersicht.js`, `ansichten/bedarfe.js`, neue Testdatei, `docs/pilot/cf-pilot-01-simulation.mjs`.
- **Aufwand:** klein. Vier App-Dateien, geschätzt rund 60 Zeilen Code und 120 Zeilen Tests, keine Datenänderung.
- **Risiko Demo:** gering. Am 18.–20.11.2026 entsteht kein neuer Eintrag (BD-22 hat die Frist 21.03.2027, BD-23 kein prüfbares Paar). Die geänderten Ansichten liegen nicht im Pitch-Pfad, und der Pitch-Stand bleibt eingefroren.
- **Herkunft:** Fallakte §1, §5, §9; Pitch Folie 2; Produktideen B2.
- **Status:** Die Lücke ist ein Projektbeleg (Nachrechnung am Fachkern, simuliert). Der Nutzen ist eine Hypothese (14 Tage unbestätigt). Die Lösung ist ein Vorschlag der Planung, nicht freigegeben.

**P2 · Offene Restmenge sichtbar (Plan Restmenge, Stufe 1). Danach, nicht die kleinste.**
- **Nutzerproblem:** Nach 5 von 6 Stück gilt der Bedarf als gedeckt, die sechste Tür steht nur in einer Notiz, und die Bestellfrist verschwindet aus „Zeitkritisch“.
- **Verhalten:** Die Mengenbilanz „6 benötigt · 5 unverbindlich vorgemerkt · 1 offen“ erscheint auf Bedarfs-, Entscheidungs-, Listen- und Projektseite. Die Bestellfrist „· 1 Stk offen“ bleibt sichtbar, solange etwas offen ist.
- **Ausgeschlossen:** zweiter Vorgang (Stufe 2), Neubestellung, Doppelboden, nachträgliche Mengenänderung.
- **Abnahme:** Plan A1–A10, gekürzt. 1 Bilanz auf Bedarfs- und Entscheidungsseite. 2 Bestellfrist am 12.02. nicht, ab 13.02. ja, ab 20.02. überfällig. 3 Kachel und Filter „Bedarfe offen“ zählen BD-24. 4 Eine Vormerkung von 7 Stk bei 6 Bedarf wird abgelehnt. 5 „6 benötigt · 5 übergeben · 1 offen“ ab 08.03.2027. 6 Ein Teilangebot ergibt „1 in Prüfung · 5 offen“. 7 Die Startbedingung bleibt. 8 Die Nachrechnung ist umgestellt. 9 Die Frist bleibt nach der Bestellfrist überfällig. 10 Die Entscheidungsseite zeigt „Bestellfrist des Bedarfs“.
- **Dateien:** sieben App-Dateien (`vorgang.js`, `kennzahlen.js`, `entscheidung.js`, `vorgangsteil.js`, `bedarfe.js`, `projekte.js`, `uebersicht.js`), eine neue Testdatei, das Pilot-Skript.
- **Aufwand:** mittel für Stufe 1, groß mit Stufe 2. Es sind 9 Dateien, 10 Kriterien und 6 offene Fragen (F1–F6). Die 2027-Fälle sind im Browser nicht prüfbar.
- **Risiko Demo:** mittel. Betroffen sind „Bedarfe offen“, die Folgen von `bedarfBelegt` und die Entscheidungsseiten. Der Plan rechnet die Startbedingung nach (A7), ausgeführt ist nichts.
- **Herkunft:** Plan 1.1 (Auftrag 16.11.), Fallakte Variante 3, Pitch-Anhang.
- **Status:** Die Lücke ist ein Projektbeleg. Die Lösung ist der Plan (Vorschlag), F1–F6 sind unbeantwortet, der Umfang ist nicht freigegeben.

**P3 · Herkunft der Prüfzeit (Idee N2). Erst nach dem Praxisgespräch.**
- **Nutzerproblem:** Die 14 Tage sind eine Annahme. Wer die Zahl nennt (Fachperson, Messung), bleibt offen, obwohl der Abgleich sie als Grenze nutzt.
- **Verhalten:** Zur Mindestprüfzeit lässt sich die Herkunft wählen („belegt“, „geschätzt“, „Angabe der Fachperson“), und Abgleich und Fristen nennen sie im Wortlaut. Die Dauer von Prüfbitte bis Fachergebnis wird erst mit realen Werten ausgewertet.
- **Ausgeschlossen:** Auswertung der Vorgangsdauer, neue Kennzahl, Praxiswerte, Änderung der Zeitregel.
- **Abnahme:** (1) Das Formular bietet drei Herkünfte. (2) Abgleich und Bedarfsseite nennen sie. (3) Alte gespeicherte Bedarfe laden unverändert. (4) Die Startbedingung bleibt.
- **Dateien:** `bedarf.js`, `ansichten/bedarfform.js`, `abgleich.js`, `ansichten/bedarfe.js`, Tests. `zustand.js` ist nur nötig, falls das Speicherformat wächst.
- **Aufwand:** mittel. Datenmodell und Speicher sind berührt, und ohne reale Werte ist der Nutzen klein.
- **Risiko Demo:** gering (das Formular liegt nicht im Pitch-Pfad), aber es besteht ein Migrationsrisiko beim Speicherformat.
- **Herkunft:** Produktideen 1.3 N2 (Pitch Folie 9); Fallakte A5 und §11.
- **Status:** eigener Vorschlag, Hypothese.

## 4. Empfehlung und nächste Aufgaben

Empfehlung: P1 jetzt, nach der Freigabe. P2 danach, nachdem F1–F6 beantwortet sind. P3 erst nach dem Praxisgespräch aus Fallakte §11.
1. **Team (Houssam, Feyrouz):** Frage 1 beantworten und den Umfang des Plans `docs/plan-pruefbitte-spaetestens.md` freigeben. Frage 1 lautet: Gilt die Reihenfolge vom 16.11. („Restmenge zuerst, nur Dokumentation“) für diese Umsetzung weiter? Mein Vorschlag: aufheben, weil P1 die kleinste Verbesserung ist. Frist (Vorschlag): vor Beginn der Entwicklung. Abschluss: Eintrag in `00_START_HIER/ENTSCHEIDUNGEN.md` mit Datum, Umfang und offenen Punkten.
2. **`cf-review`:** den Plan `docs/plan-pruefbitte-spaetestens.md` lesend gegen Code und Pläne prüfen. Abschluss: priorisierte Befunde mit Fundstellen.
3. **`cf-entwicklung`:** nur nach Nr. 1 und 2, auf getrenntem Branch, Fachkern mit Tests zuerst. Abschluss: Übergabe mit Codestand und tatsächlich ausgeführten Befehlen.

## 5. Entscheidung der Koordination vom 18.11.2026

Der Auftraggeber hat im Nachtauftrag vom 17./18.11.2026 den folgenden Absatz zur Plattform erteilt (wörtlich):

> „Entwickle nach Abschluss des Pitch-Pakets auch die Plattform weiter. Arbeite dafür auf einem getrennten
> Entwicklungsbranch und bewahre den geprüften Pitch-Stand einschließlich seiner Demo unverändert. Lies die bestehenden
> Pläne zu Restmenge und „Prüfbitte spätestens“. Wähle daraus die kleinste sinnvolle, ausreichend beschriebene
> Verbesserung und setze sie vollständig um. Dokumentiere erwartetes Verhalten und Abnahmekriterien vor der Umsetzung.
> Entscheide umkehrbare Einzelheiten selbst. Lass cf-review die Änderung prüfen und cf-test die passenden Regeltests und
> Browserabläufe ausführen. Behebe belegte Fehler. Push auf den getrennten Branch ist erlaubt; kein Merge, Deployment
> oder Aktualisieren der geteilten Vorschau. Liefere einen funktionierenden Entwicklungsstand mit Startanleitung und
> tatsächlichen Prüfergebnissen. Beginne keine weitere Funktion, wenn dadurch ein unfertiger Stand zurückbleiben würde.“

Damit sind die Wahl der kleinsten Verbesserung, das Umsetzen „vollständig“, die Entscheidung über „umkehrbare
Einzelheiten“ und der getrennte Entwicklungsbranch angeordnet.

- **Frage 1 (Reihenfolge) ist damit beantwortet.** Die Reihenfolge vom 16.11.2026 („Restmenge zuerst, für jetzt genügt die
  Dokumentation“) gilt für diese eine Umsetzung nicht. **P1 „Prüfbitte spätestens“** wird umgesetzt, weil sie die kleinste
  ist. P2 und P3 bleiben unverändert in dieser Reihenfolge zurückgestellt. Die Restmenge bleibt im Plan Restmenge 1.1 so
  beschrieben, wie sie ist.
- **Branch:** `codex/plattform-entwicklung-20261118`, Ausgangscommit `23dc050` (der Commit mit Priorisierung und Plan). Kein Merge und keine Veröffentlichung.
- **Noch offen für das Team:** ein Eintrag in `00_START_HIER/ENTSCHEIDUNGEN.md` mit Datum, Umfang und offenen Punkten. Dieses
  Repository führt keine eigene Entscheidungsliste. Die Koordination hat dort nichts eingetragen.

