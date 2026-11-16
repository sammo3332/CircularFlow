# Plan nach dem Pitch · Restmenge sichtbar und zweiter Vorgang

| | |
|---|---|
| Dokumentversion | 1.0 vom 16.11.2026 |
| Status | Plan, nicht umgesetzt. Umsetzung erst nach dem Pitch und erst, wenn das Team den Umfang freigegeben hat. |
| Branch | `codex/plattform-v1` |
| Ausgangscommit | `9e595a4`. Der Anwendungscode ist seit `2121b92` unverändert. |
| Pitch-Stand | bleibt festgehalten: Vorschau Version 2 (Versions-ID `1794826502-00b9`), Code `2121b92`. Dieser Plan ändert daran nichts. |
| Maßgeblich | Produktbrief v0.2. Der Plan erweitert den Produktumfang erst mit der Freigabe. |
| Anlass | CF-PILOT-01, Variante 3 ([Fallakte](pilot/CF-PILOT-01-fallakte.md), Abschnitt 5) |

## 1. Auftrag vom 16.11.2026

„Priorisiere für nach dem Pitch zuerst die sichtbare Restmenge: 6 benötigt, 5 unverbindlich vorgemerkt, 1 offen. Die
Bestellfrist für die offene Tür soll sichtbar bleiben. Plane den zweiten Vorgang für die Restmenge als nächsten
Schritt.“ Und: „Für jetzt genügt die Dokumentation.“

Daraus folgen zwei Stufen:

- **Stufe 1:** Die Restmenge wird sichtbar. Das hat die erste Priorität nach dem Pitch.
- **Stufe 2:** Für die Restmenge lässt sich ein zweiter Vorgang anlegen. Das ist der nächste Schritt danach.

## 2. Nutzerproblem

Die Planung von „Umbau am Kanal“ braucht sechs Türen. Nach dem Probeausbau sind fünf verwendbar und unverbindlich
vorgemerkt. Für die sechste Tür muss sie bis zur Bestellfrist am 19.02.2027 eine andere Lösung finden.

Fassung 2 zeigt das nicht. Nach der Vormerkung gilt der Bedarf als ganz belegt. Die Nachrechnung von CF-PILOT-01 zeigt
am 15.02.2027:

- Der Abgleich nennt die Menge „gedeckt“ (Angebot 6, Bedarf 6).
- Der Bedarf zählt nicht als offen und steht nicht unter „Zeitkritisch“. Die Paarliste zeigt für ihn kein Angebot mehr.
- Ein zweites Türangebot wäre am Tag der Vormerkung noch prüfbar. Die Prüfbitte ist aber gesperrt: „Der Bedarf gehört
  bereits zum laufenden Vorgang E-03.“
- Die fehlende Tür steht nur in der Notiz zum Fachergebnis.

Das Risiko: Die sechste Tür wird zu spät oder gar nicht bestellt.

## 3. Mengenbilanz eines Bedarfs

Jeder Vorgang zu einem Bedarf bindet eine Menge. Die Bilanz zählt für jeden Bedarf:

| Begriff | Bedeutung |
|---|---|
| benötigt | die Menge des Bedarfs |
| in Prüfung | Vorgänge ohne Vormerkung (Prüfbitte gestellt, geeignet, bedingt geeignet): die angebotene Menge, höchstens der Rest des Bedarfs |
| unverbindlich vorgemerkt | Vorgänge mit gültiger Vormerkung, auch mit geplanter Übergabe: die vorgemerkte Menge |
| übergeben | Vorgänge mit eingetragener Übergabe: die vorgemerkte Menge, laut Eintrag |
| offen | benötigt minus alle gebundenen Mengen, nie unter 0 |

Beispiel Variante 3: benötigt 6, unverbindlich vorgemerkt 5, offen 1. Die App zeigt „6 benötigt · 5 unverbindlich
vorgemerkt · 1 offen“. Nach der Übergabe am 08.03.2027 zeigt sie „6 benötigt · 5 übergeben · 1 offen“.

Eine abgelaufene Vormerkung bindet ihre Menge weiter, bis sie erneuert oder der Vorgang abgebrochen wird (Vorschlag,
siehe Entscheidung E5). Ein Abbruch oder das Ergebnis „ungeeignet“ gibt die Menge frei.

Die Bilanz gilt für Bauteilgruppen mit der Einheit Stück. Der Doppelboden bleibt außen vor, weil seine Deckung aus
der Bodenregel kommt und „mindestens“ kennt (Entscheidung E2). Für ihn gilt weiter: Der Bedarf ist belegt, sobald ein
Vorgang läuft.

## 4. Stufe 1 · Restmenge sichtbar

**Gewünschtes Verhalten**

1. **Mengenzeile.** „6 benötigt · 5 unverbindlich vorgemerkt · 1 offen“ steht überall dort, wo der Bedarf mit einem
   Vorgang erscheint:
   - auf der Bedarfsseite unter „Angaben“ und im Hinweis auf den Vorgang,
   - auf der Entscheidungsseite im Block „Vorgang“, unter dem Status,
   - in der Bedarfsliste anstelle von „im Vorgang“, also „im Vorgang · 1 offen“,
   - auf der Projektseite an der Marke des Bedarfs.
2. **Bestellfrist der offenen Menge bleibt sichtbar**, solange „offen“ größer als 0 ist:
   - unter „Zeitkritisch (7 Tage)“ als „Bestellfrist · 1 Stk offen“. Es gilt dieselbe Sieben-Tage-Regel wie heute,
     nach dem Datum ist die Frist überfällig.
   - auf der Bedarfsseite mit dem Zusatz „gilt für 1 offene Stk“,
   - auf der Entscheidungsseite als Frist des Bedarfs, mit der zuständigen Rolle des Bedarfs.
3. **Kachel „Bedarfe offen“** zählt Bedarfe mit offener Menge, auch wenn ein Vorgang läuft. Die Mengen je Einheit sind
   die offenen Mengen.
4. **Vormerkung begrenzt.** Die Menge darf höchstens so groß sein wie das Angebot und der offene Rest des Bedarfs,
   einschließlich der eigenen Bindung. Heute ist nur das Angebot die Grenze. Ein Angebot von 14 Stück ließe sich also
   für einen Bedarf von 6 vormerken.
5. **Nächster Schritt für die Restmenge** als Text, ohne neue Aktion: „Restmenge 1 Stk: weiteres Angebot suchen oder
   neu bestellen. Bestellfrist 19.02.2027, zuständig Planung.“

**Bleibt in Stufe 1 gleich**

- Ein Bedarf mit laufendem Vorgang bleibt für weitere Prüfbitten gesperrt. Das öffnet erst Stufe 2.
- Abgleichregeln, Zeitregel, Türregel und Doppelboden.
- Die Fristen eines Vorgangs. Vor dem Fachergebnis bleibt die Bestellfrist eine Frist des Vorgangs.

**Akzeptanzkriterien**

| Nr. | Prüfung | Erwartung |
|---|---|---|
| A1 | Pilotdaten Variante 3, nach der Vormerkung von 5 Stk am 04.02.2027 | Bilanz von BD-24: benötigt 6, vorgemerkt 5, offen 1. Bedarfsseite und Entscheidungsseite zeigen „6 benötigt · 5 unverbindlich vorgemerkt · 1 offen“. |
| A2 | Übersicht am 12.02., 13.02. und 20.02.2027, jeweils 09:00 | Am 12.02. steht die Bestellfrist noch nicht unter „Zeitkritisch“, ab 13.02. als „Bestellfrist · 1 Stk offen“, ab 20.02. als überfällig. |
| A3 | Kachel „Bedarfe offen“ am 15.02.2027 | zählt BD-24 mit 1 Stk |
| A4 | Vormerkung über dem Rest | In einem Vorgang KB · T-31 (14 Stk Angebot) → BD-24 wird eine Vormerkung von 7 Stk abgelehnt, die Meldung nennt den offenen Rest. Heute nimmt die App sie an, weil nur die Menge des Bauteils zählt. |
| A5 | Übergabe am 08.03.2027 eingetragen | „6 benötigt · 5 übergeben · 1 offen“ |
| A6 | Vorgang in Prüfung mit Teilangebot, etwa LH · T-03 (1 Stk) für BD-24 | „6 benötigt · 1 in Prüfung · 5 offen“. Die Bestellfrist bleibt für die 5 Stk sichtbar. |
| A7 | frisches Profil mit Beispieldaten | Die Übersicht zeigt weiter 8 Paare, davon 2 prüfbar, und 2 Vorgänge. Die Kachel „Bedarfe offen“ zählt so viele Bedarfe wie heute. Die bestehenden Tests bleiben grün. |
| A8 | Nachrechnung CF-PILOT-01 | Variante 3 erwartet jetzt die sichtbare Restmenge. Die Prüfungen, die heute die Lücke festhalten, werden umgestellt. |

## 5. Stufe 2 · Zweiter Vorgang für die Restmenge

**Gewünschtes Verhalten**

1. **Wieder abgleichbar.** Ein Bedarf mit offener Menge, für den kein anderer Vorgang in Prüfung ist, erscheint wieder
   in der Paarliste, auf der Bedarfsseite unter „Angebote derselben Gruppe“ und im Bauteilpass unter „Bedarfe
   derselben Gruppe“ und „Ziel zuordnen“.
2. **Menge gegen den Rest.** Der Abgleich prüft die Menge gegen die offene Menge, zum Beispiel „Restmenge 1 von 6 Stk:
   gedeckt“.
3. **Zeitregel unverändert.** Mit den Pilotdaten ergibt KB · T-31 → BD-24 am 04.02.2027 „Weiter prüfen“, mit
   Prüfende 18.02.2027, einen Tag vor der Bestellfrist.
4. **Zweiter Vorgang.** „Prüfbitte anlegen“ legt einen weiteren Vorgang zum selben Bedarf an. Gesperrt bleibt die
   Prüfbitte nur, wenn nichts mehr offen ist oder ein anderer Vorgang zu diesem Bedarf noch keine Vormerkung hat. Je
   Bedarf ist also höchstens ein Vorgang zugleich in Prüfung (Entscheidung E3).
5. **Vormerkung im zweiten Vorgang** höchstens so groß wie das Angebot und der offene Rest.
6. **Gedeckt.** Ist nichts mehr offen, verschwindet die Bestellfrist des Bedarfs aus „Zeitkritisch“, und der Bedarf
   erscheint nicht mehr in der Paarliste.
7. **Freigabe.** Endet ein Vorgang mit Abbruch oder „ungeeignet“, wird seine Menge wieder offen.

**Akzeptanzkriterien**

| Nr. | Prüfung | Erwartung |
|---|---|---|
| B1 | Pilotdaten, 04.02.2027 nach der Vormerkung von 5 Stk | BD-24 steht wieder in der Paarliste, mit „Restmenge 1“. KB · T-31 → BD-24 ergibt „Weiter prüfen“, die Prüfbitte ist möglich. Heute ist sie gesperrt. |
| B2 | zweiter Vorgang, Vormerkung | 1 Stk wird angenommen, 2 Stk werden mit Hinweis auf den offenen Rest abgelehnt. |
| B3 | nach der zweiten Vormerkung | „6 benötigt · 6 unverbindlich vorgemerkt · 0 offen“. Die Bestellfrist von BD-24 steht nicht mehr unter „Zeitkritisch“. |
| B4 | Abbruch des zweiten Vorgangs | wieder 1 offen, die Bestellfrist ist wieder sichtbar |
| B5 | ein Vorgang zu BD-24 ist in Prüfung | Eine weitere Prüfbitte ist gesperrt, der Grund nennt den laufenden Vorgang. |
| B6 | Beispieldaten, Doppelboden, Zielöffnungen | unverändert. Die Startbedingung des Pitches gilt weiter, die bestehenden Tests bleiben grün. |

## 6. Ausgeschlossen

- Umsetzung vor dem Pitch und jede Änderung an Pitch-Stand, Vorschau und Freigabe.
- Eine Neubestellung als eigener Vorgang oder ein Vermerk „Restmenge anders beschafft“ (Entscheidung E4).
- Mehrere Vorgänge in Prüfung zugleich für denselben Bedarf (Entscheidung E3).
- Der Doppelboden (Entscheidung E2).
- Die Menge eines Bauteils nach der Erfassung ändern. Das Ergebnis „5 von 6“ drückt die Vormerkung aus.
- Benachrichtigungen, Versand, Kosten- und CO₂-Zahlen.

## 7. Betroffene Stellen im Code

Stand `2121b92`. Nur zur Orientierung für die spätere Umsetzung. Geändert wird hier nichts.

| Datei | Heute | Stufe 1 | Stufe 2 |
|---|---|---|---|
| `plattform/app/vorgang.js` | `bedarfVorgang` und `bedarfBelegt`: Ein Bedarf ist belegt, sobald ein aktiver oder übergebener Vorgang ihn als Ziel hat. `vorgangSchritt` begrenzt die Vormerkung nur auf die Menge des Bauteils. | neue reine Funktion für die Mengenbilanz. Die Vormerkung wird zusätzlich auf den offenen Rest begrenzt. | `bedarfBelegt` gilt nur noch, wenn nichts offen ist oder ein Vorgang in Prüfung ist. |
| `plattform/app/kennzahlen.js` | Offene Bedarfe sind Bedarfe ohne aktiven Vorgang. Die Bestellfrist erscheint nur für sie. | offene Bedarfe nach der Bilanz, Eintrag „Bestellfrist · n offen“ | – |
| `plattform/app/abgleich.js` | `pruefeMenge` vergleicht mit der ganzen Bedarfsmenge. `sperre` sperrt bei jedem aktiven Vorgang zum Bedarf. `abgleichListe` überspringt belegte Bedarfe. | – | Menge gegen den Rest, Sperre nach der neuen Regel, Liste mit Bedarfen mit offener Menge |
| `plattform/app/regeln.js` | `moeglicheZiele` nimmt belegte Bedarfe aus „Ziel zuordnen“. | – | Bedarfe mit offener Menge sind wieder wählbar. |
| `plattform/app/ansichten/bedarfe.js` | Liste „im Vorgang“, Detail mit Hinweis auf den Vorgang | Mengenzeile, Bestellfrist mit Zusatz, nächster Schritt für die Restmenge | Angebote für den Rest |
| `plattform/app/ansichten/vorgangsteil.js` | Block „Vorgang“ mit Status und Kette | Mengenzeile des Bedarfs und Frist der Restmenge | – |
| `plattform/app/ansichten/projekte.js` | `bedarfMarke`: „zugeordnet: …“ | Zusatz „· n offen“ | – |
| `plattform/app/ansichten/uebersicht.js` | Kachel „Bedarfe offen“ mit dem Text „Bedarfe ohne laufenden Vorgang“ | Text „Bedarfe mit offener Menge“ | – |
| Tests | – | neue Datei `plattform/test/restmenge.test.mjs` mit A1 bis A8 | B1 bis B6 in derselben Datei |
| `docs/pilot/cf-pilot-01-simulation.mjs` | prüft die heutige Lücke | Variante 3 auf die sichtbare Restmenge umstellen | zweiten Vorgang ergänzen |

Wird die Erweiterung vor einer weiteren Vorführung umgesetzt, muss der Pitch-Ablauf erneut geprüft werden.
Zusatz C zählt Vorgänge und offene Bedarfe, und die Zahlen können sich ändern.

## 8. Offene Entscheidungen mit Vorschlag

| Nr. | Frage | Vorschlag |
|---|---|---|
| E1 | Bindet ein Vorgang ohne Vormerkung eine Menge? | Ja, die angebotene Menge, höchstens der Rest. Sonst stünde der Bedarf während der Prüfung voll offen, und seine Bestellfrist erschiene doppelt. |
| E2 | Gehört der Doppelboden dazu? | Nein, erst später. Seine Deckung kommt aus der Bodenregel und kennt „mindestens“. |
| E3 | Dürfen mehrere Vorgänge zugleich in Prüfung sein? | Nein, höchstens einer je Bedarf. Parallele Prüfungen kommen frühestens später. |
| E4 | Wie wird eine Neubestellung der Restmenge festgehalten? | als eigene, spätere Stufe 3. Bis dahin bleibt die Bestellfrist sichtbar und ist nach dem Datum überfällig. |
| E5 | Bleibt die Menge einer abgelaufenen Vormerkung gebunden? | Ja, bis Erneuerung oder Abbruch, mit Hinweis. Die Frist „Vormerkung abgelaufen“ steht schon heute unter „Zeitkritisch“. |
| E6 | Beschriftung | „benötigt“, „in Prüfung“, „unverbindlich vorgemerkt“, „übergeben“, „offen“ |

## 9. Ablauf der Umsetzung nach der Freigabe

Der Ablauf folgt `CLAUDE.md` und `docs/agenten-start.md`:

1. Das Team gibt Stufe 1 frei und entscheidet E1 bis E6.
2. **cf-entwicklung** setzt zuerst den Fachkern mit Tests um, danach die Anzeige.
3. **cf-review** prüft lesend gegen diesen Plan.
4. **cf-test** prüft die Tests, den Browser und die Startbedingung des Pitches.
5. Übergabe mit Codestand und ausgeführten Befehlen.
6. Für Stufe 2 dasselbe, nach eigener Freigabe.

Die 14 Tage Mindestprüfzeit aus dem Pilot bleiben eine Simulationsannahme, bis das Team einen konkreten Praxisfall
besprochen hat. Der Plan setzt keine feste Prüfzeit voraus. Er nutzt die Mindestprüfzeit, die am Bedarf steht.
