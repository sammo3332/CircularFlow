# Plan nach dem Pitch · Restmenge sichtbar und zweiter Vorgang

| | |
|---|---|
| Dokumentversion | 1.1 vom 16.11.2026. Fassung 1.0 steht in `d46e294`, danach sind die Befunde der unabhängigen Prüfung eingearbeitet. |
| Status | Plan, nicht umgesetzt. Umsetzung erst nach dem Pitch und erst, wenn das Team den Umfang freigegeben hat. |
| Branch | `codex/plattform-v1` |
| Ausgangscommit | `9e595a4`, der Stand, auf dem dieser Plan geschrieben wurde. Die Fallakte nennt mit `daa40a9` den Ausgangsstand des Pilotfalls. Der Anwendungscode ist seit `2121b92` unverändert. |
| Pitch-Stand | bleibt festgehalten: Vorschau Version 2 (Versions-ID `1794826502-00b9`), Code `2121b92`. Dieser Plan ändert daran nichts. |
| Maßgeblich | Produktbrief v0.2. Der Plan erweitert den Produktumfang erst mit der Freigabe. |
| Anlass | CF-PILOT-01, Variante 3 ([Fallakte](pilot/CF-PILOT-01-fallakte.md), Abschnitt 5) |

## 1. Auftrag vom 16.11.2026

„Priorisiere für nach dem Pitch zuerst die sichtbare Restmenge: 6 benötigt, 5 unverbindlich vorgemerkt, 1 offen. Die
Bestellfrist für die offene Tür soll sichtbar bleiben. Plane den zweiten Vorgang für die Restmenge als nächsten
Schritt.“ Und: „Für jetzt genügt die Dokumentation.“

**Nachtrag vom 18.11.2026:** Der Nachtauftrag vom 17./18.11.2026 verlangt, aus den Plänen zu Restmenge und „Prüfbitte
spätestens“ die kleinste sinnvolle Verbesserung zu wählen und umzusetzen. Für diese eine Umsetzung gilt die Reihenfolge
vom 16.11.2026 deshalb nicht: Zuerst wird „Prüfbitte spätestens“ auf `codex/plattform-entwicklung-20261118` umgesetzt
(`docs/priorisierung-nach-dem-pitch.md`, Abschnitt 5). Dieser Plan bleibt unverändert gültig. Wer die Restmenge danach
umsetzt, ändert denselben Block „Zeitkritisch“ (`kennzahlen.js`, `ansichten/uebersicht.js`): Einträge je Bedarf nach
`name` unterscheiden, nicht nach `art` und `id`.

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
| in Prüfung | Vorgänge ohne Vormerkung: angelegt (über „Ziel zuordnen“), Prüfbitte gestellt, geeignet oder bedingt geeignet. Gezählt wird die angebotene Menge, höchstens der Rest des Bedarfs. |
| unverbindlich vorgemerkt | Vorgänge mit gültiger Vormerkung, auch mit geplanter Übergabe: die vorgemerkte Menge |
| übergeben | Vorgänge mit eingetragener Übergabe: die vorgemerkte Menge, laut Eintrag |
| offen | benötigt minus alle gebundenen Mengen, nie unter 0 |

Beispiel Variante 3: benötigt 6, unverbindlich vorgemerkt 5, offen 1. Die App zeigt „6 benötigt · 5 unverbindlich
vorgemerkt · 1 offen“. Nach der Übergabe am 08.03.2027 zeigt sie „6 benötigt · 5 übergeben · 1 offen“.

Eine abgelaufene Vormerkung bindet ihre Menge weiter, bis sie erneuert oder der Vorgang abgebrochen wird. Das ist ein
Vorschlag, siehe Frage F5. Ein Abbruch oder das Ergebnis „ungeeignet“ gibt die Menge frei.

**Geltungsbereich und Randfälle**

- Die Bilanz gilt für Bauteilgruppen mit der Einheit Stück.
- **Doppelboden:** bleibt außen vor (Frage F2). Seine Deckung kommt aus der Bodenregel und kennt „mindestens“. Für ihn
  gilt weiter: Der Bedarf ist belegt, sobald ein Vorgang läuft.
- **Bedarf ohne Menge:** Es gibt keine Bilanz. Wie heute belegt ein Vorgang den Bedarf ganz.
- **Bedarf ohne Bestellfrist:** Die Bilanz wird gezeigt, aber es gibt keine Frist, die sichtbar bleiben könnte. Der
  nächste Schritt für die Restmenge nennt dann „Bestellfrist fehlt“.

## 4. Stufe 1 · Restmenge sichtbar

**Gewünschtes Verhalten**

1. **Mengenzeile.** „6 benötigt · 5 unverbindlich vorgemerkt · 1 offen“ steht überall dort, wo der Bedarf mit einem
   Vorgang erscheint:
   - auf der Bedarfsseite unter „Angaben“ und im Hinweis auf den Vorgang,
   - auf der Entscheidungsseite im Block „Vorgang“ und im Block „Abgleich mit dem Bedarf“,
   - in der Bedarfsliste anstelle von „im Vorgang“, also „im Vorgang · 1 offen“,
   - auf der Projektseite an der Marke des Bedarfs.
2. **Bestellfrist der offenen Menge.** Sie ist eine Frist des Bedarfs, nicht des Vorgangs. Sie bleibt sichtbar,
   solange „offen“ größer als 0 ist:
   - unter „Zeitkritisch (7 Tage)“ als „Bestellfrist · 1 Stk offen“. Es gilt dieselbe Sieben-Tage-Regel wie heute,
     nach dem Datum ist die Frist überfällig.
   - auf der Bedarfsseite mit dem Zusatz „gilt für 1 offene Stk“,
   - auf der Entscheidungsseite in der Box „Fristen“, als eigene Zeile „Bestellfrist des Bedarfs · 1 Stk offen“ mit
     der zuständigen Rolle des Bedarfs.

   Sie gehört nicht zu den Fristen des Vorgangs. Deshalb bleiben drei Dinge unverändert: die Arbeitsliste, die
   Reihenfolge der offenen Entscheidungen und der Hinweis „Frist verstrichen“ im Vorgang.
3. **Keine doppelte Bestellfrist.** Unter „Zeitkritisch“ steht die Bestellfrist je Bedarf höchstens einmal.
   - Vor der Vormerkung führt ein Vorgang die Bestellfrist selbst, vor und nach dem Fachergebnis. Dann ergänzt sein
     Eintrag die offene Menge, etwa „Bestellfrist · 5 Stk offen“. Einen zweiten Eintrag des Bedarfs gibt es nicht.
   - Nach der Vormerkung führt der Vorgang die Bestellfrist nicht mehr. Dann steht der Eintrag des Bedarfs.
4. **Offene Bedarfe.** Die Kachel „Bedarfe offen“ und der Filter der Bedarfsliste folgen derselben Regel. Sie zählen
   Bedarfe mit offener Menge, auch wenn ein Vorgang läuft. Die Mengen je Einheit sind die offenen Mengen. Der Filter
   heißt dann „nur Bedarfe mit offener Menge“.
5. **Vormerkung begrenzt.** Die Menge darf höchstens so groß sein wie das Angebot und der offene Rest des Bedarfs,
   einschließlich der eigenen Bindung. In Stufe 1 gibt es je Bedarf nur einen Vorgang, also ist der Rest dort die
   ganze Bedarfsmenge. Heute ist nur das Angebot die Grenze. Der Hinweis am Formular nennt die neue Grenze.
6. **Nächster Schritt für die Restmenge** als Text, ohne neue Aktion: „Restmenge 1 Stk: weiteres Angebot suchen oder
   neu bestellen. Bestellfrist 19.02.2027, zuständig Planung.“

**Bleibt in Stufe 1 gleich**

- Ein Bedarf mit laufendem Vorgang bleibt für weitere Prüfbitten gesperrt. Das öffnet erst Stufe 2.
- Abgleichregeln, Zeitregel, Türregel und Doppelboden.
- Die Fristen eines Vorgangs, also auch Arbeitsliste und „Frist verstrichen“ (siehe Punkt 2).

**Akzeptanzkriterien**

Kriterien mit Daten im Jahr 2027 prüfen Tests im Fachkern mit einer Projektzeit in 2027, wie die Nachrechnung. Die
Oberfläche lässt als Stichtag nur 18. bis 20.11.2026 zu. Die Vormerkung im Pilot gilt bis 12.03.2027.

| Nr. | Prüfung | Erwartung |
|---|---|---|
| A1 | Pilotdaten Variante 3, nach der Vormerkung von 5 Stk am 04.02.2027 | Bilanz von BD-24: benötigt 6, vorgemerkt 5, offen 1. Bedarfsseite und Entscheidungsseite zeigen „6 benötigt · 5 unverbindlich vorgemerkt · 1 offen“. |
| A2 | „Zeitkritisch“ am 12.02., 13.02. und 20.02.2027, jeweils 09:00 | Am 12.02. steht die Bestellfrist noch nicht da, ab 13.02. als „Bestellfrist · 1 Stk offen“, ab 20.02. als überfällig. |
| A3 | Kachel „Bedarfe offen“ am 15.02.2027 | BD-24 zählt mit, die Stück-Summe der Kachel enthält 1 Stk von BD-24. Der Filter „nur Bedarfe mit offener Menge“ zeigt BD-24 ebenfalls. |
| A4 | Vormerkung höchstens der Bedarf | In einem Vorgang KB · T-31 (14 Stk Angebot) → BD-24 wird eine Vormerkung von 7 Stk abgelehnt, die Meldung nennt die Grenze. Heute nimmt die App sie an. Die Grenze gegen einen echten Rest prüft B2. |
| A5 | Übergabe eingetragen, Projektzeit ab 08.03.2027 | „6 benötigt · 5 übergeben · 1 offen“ |
| A6 | Vorgang in Prüfung mit Teilangebot, etwa LH · T-03 (1 Stk) für BD-24, am 15.02.2027 | „6 benötigt · 1 in Prüfung · 5 offen“. Unter „Zeitkritisch“ steht für BD-24 genau ein Eintrag zur Bestellfrist, mit „5 Stk offen“. |
| A7 | frisches Profil mit Beispieldaten | Die Übersicht zeigt weiter 8 Paare, davon 2 prüfbar, und 2 Vorgänge. Die Kachel „Bedarfe offen“ zählt so viele Bedarfe wie heute. Die bestehenden Tests bleiben grün. |
| A8 | Nachrechnung CF-PILOT-01 | Variante 3 erwartet jetzt die sichtbare Restmenge. Die Prüfungen, die heute die Lücke festhalten, werden umgestellt. |
| A9 | nach der Bestellfrist, ohne zweiten Vorgang | „Bestellfrist · 1 Stk offen“ bleibt überfällig unter „Zeitkritisch“, bis ein zweiter Vorgang die Menge deckt (Stufe 2) oder eine spätere Stufe die Neubestellung festhält. Das ist gewollt. |
| A10 | Entscheidungsseite des Vorgangs LH · T-13 → BD-24 am 15.02. und am 20.02.2027 | Die Box „Fristen“ zeigt „Bestellfrist des Bedarfs · 1 Stk offen“. Am 20.02. meldet der Vorgang keine verstrichene Frist, solange seine Vormerkung gilt. Arbeitsliste und Reihenfolge der offenen Entscheidungen sind wie heute. |

## 5. Stufe 2 · Zweiter Vorgang für die Restmenge

**Gewünschtes Verhalten**

1. **Wieder abgleichbar.** Ein Bedarf mit offener Menge, für den kein anderer Vorgang in Prüfung ist, erscheint wieder
   an diesen Stellen:
   - in der Paarliste,
   - auf der Bedarfsseite unter „Angebote derselben Gruppe“,
   - im Bauteilpass unter „Bedarfe derselben Gruppe“ und „Ziel zuordnen“.
2. **Menge gegen den Rest.** Der Abgleich prüft die Menge gegen die offene Menge, zum Beispiel „Restmenge 1 von 6 Stk:
   gedeckt“.
3. **Zeitregel unverändert.** Mit den Pilotdaten ergibt KB · T-31 → BD-24 am 04.02.2027 „Weiter prüfen“, mit
   Prüfende 18.02.2027, einen Tag vor der Bestellfrist.
4. **Zweiter Vorgang.** „Prüfbitte anlegen“ legt einen weiteren Vorgang zum selben Bedarf an. Gesperrt bleibt die
   Prüfbitte in zwei Fällen:
   - Es ist nichts mehr offen.
   - Ein anderer Vorgang zu diesem Bedarf hat noch keine Vormerkung, auch einer im Status „angelegt“.

   Je Bedarf ist also höchstens ein Vorgang zugleich in Prüfung (Frage F3).
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
| B5 | ein Vorgang zu BD-24 ist in Prüfung oder angelegt | Eine weitere Prüfbitte ist gesperrt, der Grund nennt den laufenden Vorgang. |
| B6 | Beispieldaten, Doppelboden, Zielöffnungen | unverändert. Die Startbedingung des Pitches gilt weiter, die bestehenden Tests bleiben grün. |
| B7 | zwei Vorgänge zu BD-24, einer davon in Prüfung | Unter „Zeitkritisch“ steht die Bestellfrist von BD-24 höchstens einmal. |

## 6. Ausgeschlossen

- Umsetzung vor dem Pitch und jede Änderung an Pitch-Stand, Vorschau und Freigabe.
- Eine Neubestellung als eigener Vorgang oder ein Vermerk „Restmenge anders beschafft“ (Frage F4).
- Mehrere Vorgänge in Prüfung zugleich für denselben Bedarf (Frage F3).
- Der Doppelboden (Frage F2).
- Die Menge eines Bauteils nach der Erfassung ändern. Das Ergebnis „5 von 6“ drückt die Vormerkung aus.
- Benachrichtigungen, Versand, Kosten- und CO₂-Zahlen.

## 7. Betroffene Stellen im Code

Stand `2121b92`, mit Zeilen zur Orientierung. Das hilft bei der späteren Umsetzung. Geändert wird hier nichts.

| Datei | Heute | Stufe 1 | Stufe 2 |
|---|---|---|---|
| `plattform/app/vorgang.js` | `bedarfVorgang` und `bedarfBelegt` (Zeile 86–97): Ein Bedarf ist belegt, sobald ein aktiver oder übergebener Vorgang ihn als Ziel hat. `vorgangSchritt` begrenzt die Vormerkung nur auf die Menge des Bauteils. | neue reine Funktion für die Mengenbilanz. Die Vormerkung wird zusätzlich auf den offenen Rest begrenzt. | `bedarfBelegt` gilt nur noch, wenn nichts offen ist oder ein Vorgang ohne Vormerkung läuft. |
| `plattform/app/kennzahlen.js` | Offene Bedarfe sind Bedarfe ohne aktiven Vorgang. Die Bestellfrist erscheint unter „Zeitkritisch“ für sie und als Frist eines Vorgangs vor seiner Vormerkung. | offene Bedarfe nach der Bilanz, Eintrag „Bestellfrist · n offen“, höchstens ein Bestellfrist-Eintrag je Bedarf | – |
| `plattform/app/abgleich.js` | `pruefeMenge` vergleicht mit der ganzen Bedarfsmenge. `sperre` sperrt bei jedem aktiven Vorgang zum Bedarf. `abgleichListe` überspringt belegte Bedarfe. | – | Menge gegen den Rest, Sperre nach der neuen Regel, Liste mit Bedarfen mit offener Menge |
| `plattform/app/regeln.js` | `lageVorgang` (ab Zeile 203) führt die Bestellfrist nur vor dem Fachergebnis. `angezeigteFrist` und `offeneEntscheidungen` (Zeile 262–277) bauen darauf auf. `moeglicheZiele` nimmt belegte Bedarfe aus „Ziel zuordnen“. | bewusst unverändert: Die Bestellfrist der Restmenge geht nicht in die Fristen des Vorgangs ein. | Bedarfe mit offener Menge sind in `moeglicheZiele` wieder wählbar. |
| `plattform/app/ansichten/entscheidung.js` | Box „Fristen“ (Zeile 86–87) zeigt die Fristen des Vorgangs. Block „Abgleich mit dem Bedarf“ (ab Zeile 193). | eigene Zeile „Bestellfrist des Bedarfs · n Stk offen“ in der Box „Fristen“, Mengenzeile im Block „Abgleich mit dem Bedarf“ | – |
| `plattform/app/ansichten/vorgangsteil.js` | Block „Vorgang“. Der Hinweis am Formular „Vormerken“ nennt die Menge des Bauteils als Grenze (Zeile 69). „Frist verstrichen“ prüft die Fristen des Vorgangs (Zeile 106–107). | Mengenzeile des Bedarfs, Hinweis am Formular mit der neuen Grenze. „Frist verstrichen“ bleibt, wie es ist. | – |
| `plattform/app/ansichten/vorgaenge.js` | Die Arbeitsliste zeigt die Frist aus `angezeigteFrist`. | unverändert, weil sich die Fristen des Vorgangs nicht ändern | – |
| `plattform/app/ansichten/bedarfe.js` | Liste mit „im Vorgang“. Filter „nur offene Bedarfe (ohne laufenden Vorgang)“ (Zeile 19 und 51). Detail mit Hinweis auf den Vorgang. | Mengenzeile, Filter nach der Bilanz, Bestellfrist mit Zusatz, nächster Schritt für die Restmenge | Angebote für den Rest |
| `plattform/app/ansichten/projekte.js` | `bedarfMarke`: „zugeordnet: …“ | Zusatz „· n offen“ | – |
| `plattform/app/ansichten/uebersicht.js` | Kachel „Bedarfe offen“ mit dem Text „Bedarfe ohne laufenden Vorgang“ | Text „Bedarfe mit offener Menge“ | – |
| Tests | – | neue Datei `plattform/test/restmenge.test.mjs` mit A1 bis A10 | B1 bis B7 in derselben Datei |
| `docs/pilot/cf-pilot-01-simulation.mjs` | prüft die heutige Lücke | Variante 3 auf die sichtbare Restmenge umstellen | zweiten Vorgang ergänzen |

**Pitch-Ablauf.** Nach Rechnung dieses Plans ändern sich die Startbedingung und die Zusätze des Pitch-Ablaufs nicht.
In den Beispieldaten deckt TW-05 mit 120 lfm den Bedarf BD-22 mit 60 lfm ganz ab. Der Doppelboden ist ausgenommen.
Soll der Pitch nach der Umsetzung noch einmal vorgeführt werden, wird der Ablauf trotzdem erneut geprüft.

## 8. Offene Fragen mit Vorschlag

Das Team entscheidet diese Fragen im maßgeblichen Protokoll `00_START_HIER/ENTSCHEIDUNGEN.md`, nicht in diesem
Dokument. Bis dahin sind die Vorschläge Annahmen des Plans.

| Nr. | Frage | Vorschlag |
|---|---|---|
| F1 | Bindet ein Vorgang ohne Vormerkung eine Menge (angelegt, Prüfbitte, Fachergebnis)? | Ja, die angebotene Menge, höchstens der Rest. Sonst stünde der Bedarf während der Prüfung voll offen. |
| F2 | Gehört der Doppelboden dazu? | Nein, erst später. Seine Deckung kommt aus der Bodenregel und kennt „mindestens“. |
| F3 | Dürfen mehrere Vorgänge zugleich in Prüfung sein? | Nein, höchstens einer je Bedarf. Parallele Prüfungen kommen frühestens später. |
| F4 | Wie wird eine Neubestellung der Restmenge festgehalten? | in einer eigenen, späteren Stufe. Bis dahin bleibt die Bestellfrist sichtbar und ist nach dem Datum überfällig (A9). |
| F5 | Bleibt die Menge einer abgelaufenen Vormerkung gebunden? | Ja, bis Erneuerung oder Abbruch, mit Hinweis. Die Frist „Vormerkung abgelaufen“ steht schon heute unter „Zeitkritisch“. |
| F6 | Beschriftung | „benötigt“, „in Prüfung“, „unverbindlich vorgemerkt“, „übergeben“, „offen“ |

## 9. Ablauf der Umsetzung nach der Freigabe

Der Ablauf folgt `CLAUDE.md` und `docs/agenten-start.md`:

1. Das Team gibt Stufe 1 frei und beantwortet F1 bis F6.
2. **cf-entwicklung** setzt zuerst den Fachkern mit Tests um, danach die Anzeige.
3. **cf-review** prüft lesend gegen diesen Plan.
4. **cf-test** prüft die Tests, den Browser und die Startbedingung des Pitches.
5. Übergabe mit Codestand und ausgeführten Befehlen.
6. Für Stufe 2 dasselbe, nach eigener Freigabe.

Die 14 Tage Mindestprüfzeit aus dem Pilot bleiben eine Simulationsannahme, bis das Team einen konkreten Praxisfall
besprochen hat. Der Plan setzt keine feste Prüfzeit voraus. Er nutzt die Mindestprüfzeit, die am Bedarf steht.
