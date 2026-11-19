# Produktentscheidungen · Entscheidungsdatei

Dokumentversion 1.1 (Nachtrag §7 vom 19.11.2026) · ursprünglich Stand 18.11.2026 · Branch `codex/plattform-v1` (gleichlautend auf `codex/plattform-entwicklung-20261118`) ·
Ausgangscommit `6ea30e7`

**Zweck.** Diese Datei hält die bisher getroffenen Produktentscheidungen mit Datum, Begründung und offenen Punkten fest. Der
Auftraggeber hat sie am 18.11.2026 ausdrücklich verlangt. Sie ersetzt **nicht** das Entscheidungsprotokoll des Teams
(`00_START_HIER/ENTSCHEIDUNGEN.md`, nicht im Repository). `docs/entscheidungen.md` (Stand 07.11.2026) verweist darauf und bittet,
hier keine zweite Liste zu führen. Die Anweisung vom 18.11.2026 geht vor, deshalb steht diese Übergabeliste hier. Das Team
übernimmt die Einträge in sein Protokoll und bestätigt oder ändert sie. Frühere Entscheidungen bleiben bei Änderung als
„abgelöst“ erhalten (Abschnitt 3).

**Zwei Arten von Einträgen.**

- **Festlegung des Auftraggebers:** ausdrücklich im Auftrag oder im Chat gesagt, mit Datum. Sie gilt.
- **Vorschlag der Koordination:** eine eigene Festlegung der Koordination (Claude Code) innerhalb eines Auftrags. Sie gilt als
  **Vorschlag, solange die Freigabe des Teams fehlt**, und ist umkehrbar.

## 1. Festlegungen des Auftraggebers

| Nr. | Datum | Festlegung | Begründung | Offene Punkte | Beleg |
|---|---|---|---|---|---|
| A1 | 17./18.11.2026 | Die Plattform wird nur auf einem getrennten Entwicklungsbranch weiterentwickelt. Der geprüfte Pitch-Stand einschließlich Demo bleibt unverändert. Push auf den getrennten Branch ist erlaubt, ein Merge, ein Deployment und das Aktualisieren der geteilten Vorschau sind es nicht. | Schutz des geprüften Pitch-Stands und der Demo. | Merge und Vorschau entscheidet das Team. | Nachtauftrag, Absatz zur Plattform (wörtlich in `docs/priorisierung-nach-dem-pitch.md` §5); Branch `codex/plattform-entwicklung-20261118` |
| A2 | 17./18.11.2026 | Aus den Plänen zu Restmenge und „Prüfbitte spätestens“ wird die kleinste sinnvolle, ausreichend beschriebene Verbesserung gewählt und vollständig umgesetzt. Erwartetes Verhalten und Abnahmekriterien stehen vor der Umsetzung. Umkehrbare Einzelheiten entscheidet die Koordination. | Eine fertige kleine Verbesserung ist besser als ein unfertiger Stand. | Die Freigabe der gewählten Änderung durch das Team fehlt (V1 bis V9). | Nachtauftrag; Plan `23dc050`, Umsetzung `dca307f` |
| A3 | 17./18.11.2026 | Keine Käufe, keine neuen externen Nachrichten, keine Veröffentlichungen, keine Änderung von Zugriffsrechten, keine Einreichung. Höchstens zwei Prüf- und Korrekturrunden, keine neuen Plugins, kein Review-Gate. | Rahmen der Nachtarbeit. | – | Nachtauftrag |
| A4 | 18.11.2026 | Für den Pitch gilt ausdrücklich „angenommene Prüfzeit“. Beispieldaten und Ersatzbilder bleiben unverändert. | Der K3-Satz im Deck sagt bereits „angenommenen Prüfzeit“, Folie 2 sagt „Wir nehmen an, das dauert 14 Tage“. Eine Änderung der Daten würde den geprüften Pitch-Stand und die Ersatzbilder ändern. | Die Oberfläche kennzeichnet die 14 Tage bei BD-23 weiter nicht als „geschätzt“ (`plattform/app/daten.js` Z. 164 „belegt“, Z. 162 nennt es Beispielannahme). Auf Folie 11 (Anhang) steht „Prüfzeit“ ohne „angenommene“: Sprechregel in der Probenanleitung, Folien unverändert. Jurynachfrage ist vorbereitet. | Nachricht vom 18.11.2026; `pitch/innosprint-2026/generalprobe/probenanleitung.md` §2; Plan E10 |
| A5 | 18.11.2026 | Der Praxistest-Entwurf lässt Kontaktangaben, Speicherort, Löschfrist und die Zusage zum Ergebnisblatt **sichtbar offen**. Die Unterlagen werden noch nicht extern verwendet. | Keine Zusage und keine externe Nutzung ohne Freigabe des Teams. | Das Team trägt Kontakt, Speicherort und Löschfrist ein und entscheidet, ob und bis wann es ein Ergebnisblatt zusagt. | Nachricht vom 18.11.2026; `docs/praxistest/README.md`, Platzhalter in `kurzcheck-einseiter.md` und `gespraechsnotiz-vorlage.md` |
| A6 | 18.11.2026 | Nachprüfung: Der Pitch- und der Entwicklungsstand werden bewahrt. Keine weitere Funktion, kein Merge, kein Deployment. | Die Abgabe liegt vor, nur die drei Befunde aus Dokumentenrunde 2 werden nachgeprüft. | – | Nachricht vom 18.11.2026; `docs/pruefungen/nachpruefung-dokumentenrunde-2-2026-11-18.md` |
| A7 | 18.11.2026 | Die Produktentscheidungen werden in dieser Datei im Repository festgehalten. Eigene Festlegungen der Koordination gelten als Vorschläge, solange die Freigabe fehlt. | Nachvollziehbarkeit; klare Trennung von Entscheidung und Vorschlag. | Übernahme in `00_START_HIER/ENTSCHEIDUNGEN.md` durch das Team. | diese Datei |

## 2. Vorschläge der Koordination (Freigabe des Teams fehlt)

| Nr. | Datum | Vorschlag | Begründung | Offene Punkte | Beleg |
|---|---|---|---|---|---|
| V1 | 18.11.2026 | **Reihenfolge:** „Prüfbitte spätestens“ wird vor der Restmenge umgesetzt. Die Restmenge bleibt zurückgestellt. | Kleinste Verbesserung: vier App-Dateien, keine Datenänderung, geringes Risiko für die Demo. Die Restmenge braucht neun Dateien und hat sechs offene Fragen (F1 bis F6). | Bestätigung der Reihenfolge durch das Team. Die Reihenfolge vom 16.11.2026 gilt für diese eine Umsetzung nicht (Abschnitt 3). | `docs/priorisierung-nach-dem-pitch.md` §3 und §5 |
| V2 | 18.11.2026 | **E1 Formel:** Frist = der frühere Tag aus Bestellfrist und Ende des Annahmefensters, minus Mindestprüfzeit, in Kalendertagen. | Gleichlauf mit der Regel des Abgleichs, Tag für Tag durch Tests gesichert. | Der Produktbrief v0.2 nennt die Frist nicht. Eine Fortschreibung braucht die ausdrückliche Freigabe. | Plan §2, §8; Tests T4 |
| V3 | 18.11.2026 | **E2 nie „überfällig“:** Nach dem Fristtag gibt es für „Prüfbitte spätestens“ keinen Eintrag und nie „überfällig“. Die Bedarfsseite nennt den Tag mit „verstrichen“, der Abgleich meldet „Für diese Entscheidung zu spät“, die Bestellfrist bleibt unter „Zeitkritisch“. | Schützt die Startbedingung der Demo (BD-23 hat den Fristtag 13.11.2026). | Spannung zum Steckbrief („lässt keine Frist stillschweigend verstreichen“): Die verstrichene Frist ist sichtbar, aber kein eigener „überfällig“-Eintrag. Umkehr: „Überfällig“ mit Historie als eigene Stufe. | Plan §8 und §9 |
| V4 | 18.11.2026 | **E3 bis E9 Einzelheiten:** Fenster wie die übrigen Fristen (7 Tage); Eintragsart `art: 'bedarf'` mit `name`; keine Sonderregeln für Prüfzeit 0, Teilmenge und Doppelboden; nur Kalendertage ohne Wochenendverschiebung; nicht auf der Abgleichseite; Wortlaut „Prüfbitte spätestens“ mit vorhandenem Kennzeichen „geschätzt“; auch ein Vorgang im Status „Angelegt“ unterdrückt den Eintrag. | Möglichst kleine Änderung, Pitch-Pfad unberührt. | Jede Einzelheit ist umkehrbar und im Plan mit der Umkehr beschrieben. | Plan §8 (E3 bis E9) |
| V5 | 18.11.2026 | **Beispieldaten BD-23 bleiben unverändert** (Plan E10). | Gleiche Begründung wie A4. | durch A4 festgelegt; die Kennzeichnung „belegt“ in den Beispieldaten bleibt sichtbar widersprüchlich. | Plan E10 |
| V6 | 18.11.2026 | **Praxistest:** drei Gespräche mit einer Projektleitung; Entscheidungsregeln „Weiter“ und „Überdenken“ je Hypothese; Fragen am vergangenen Fall; keine Aufnahme, kein Preis, keine Zusage; Nutzung der Angaben zur Prüfung der Idee, Vorträge und Folien nur nach „ja“ am Ende; Notizen nicht im Git-Repository. | Keine erfundene Praxisbestätigung, saubere Einwilligung, überprüfbare Hypothesen. | Das Team bestätigt Regeln, Fragen und Ablauf vor dem ersten Gespräch (siehe A5). | `docs/praxistest/`, `pitch/innosprint-2026/juryfragen/juryantworten.md` §2 |
| V7 | 18.11.2026 | **Juryantworten:** Erster Nutzer (Projektleitung im Planungsbüro), möglicher Käufer und erstes bezahlbares Angebot (Kurzcheck) sind Hypothesen (H3, H4, H5); zur Wirkung „Das wissen wir noch nicht“; Concular und Madaster nur als Herstellerangaben. | Keine unbelegten Aussagen vor der Jury. | Gespräche des Praxistests; Wortlaut von SDG 12.5 an der UN-Quelle nachlesen (aus der Arbeitsumgebung nicht erreichbar). | `pitch/innosprint-2026/juryfragen/juryantworten.md` |
| V8 | 18.11.2026 | **Folgeaufgaben, nicht begonnen:** F-1 Bedarfsseite bei rechtzeitig angelegtem Vorgang nach dem Fristtag (kein „verstrichen“, sondern „Vorgang läuft“); F-2 Restmenge; F-3 Herkunft der Prüfzeit nach dem Praxisgespräch. | Hinweise der Prüfungen; keine weitere Funktion ohne Abnahme. | Freigabe durch das Team. | `docs/pruefungen/abschluss-2026-11-18.md` §7.5 |
| V9 | 18.11.2026 | **Prüfstand:** Der Entwicklungsstand ist geprüft (Regeltests, Browserabläufe, Code-Review, zwei Prüfrunden). Er ist nicht gemergt und nicht bereitgestellt. | Auftrag A1. | Entscheidung des Teams über Merge und Vorschau. | `docs/pruefungen/cf-test-runde-1/`, `docs/pruefungen/cf-test-runde-2/` |

## 3. Abgelöste Entscheidungen

| Datum | Entscheidung | abgelöst durch | Hinweis |
|---|---|---|---|
| 16.11.2026 | „Priorisiere für nach dem Pitch zuerst die sichtbare Restmenge … Für jetzt genügt die Dokumentation.“ | A2 (Nachtauftrag 17./18.11.2026) **für diese eine Umsetzung** | Der Plan Restmenge 1.1 bleibt unverändert gültig. Datierte Nachträge: Fallakte §11 und Plan Restmenge §1. |
| 16.11.2026 | Die Empfehlung aus Fallakte 1.0, „Prüfbitte spätestens“ zuerst umzusetzen, war durch den Auftrag vom 16.11. abgelöst. | A2 | Die Frist ist auf dem Entwicklungsbranch umgesetzt (Fallakte §9, Nachtrag in §11). |

## 4. Offene Punkte für das Team

1. Freigabe der Änderung „Prüfbitte spätestens“ und Entscheidung über Merge und Vorschau (A1, V1 bis V9).
2. Übernahme dieser Einträge in `00_START_HIER/ENTSCHEIDUNGEN.md` mit Aufgabe und Commit.
3. Praxistest: Kontaktangaben, Speicherort, Löschfrist, Zusage zum Ergebnisblatt (A5). Die Unterlagen werden bis dahin nicht extern verwendet.
4. Spannung von V3 (E2) zum Steckbrief („keine Frist stillschweigend verstreichen“).
5. Die Oberfläche zeigt BD-23 weiter ohne „geschätzt“ (A4); im Vortrag gilt „angenommene Prüfzeit“.
6. Fortschreibung des Produktbriefs v0.2 um die Frist nur mit ausdrücklicher Freigabe.
7. Die 14 Tage Prüfzeit bleiben eine Annahme, bis ein Praxisgespräch eine dokumentierte Angabe liefert.

## 5. Belege (Aufgabe und Commit)

Plan und Priorisierung `23dc050`; Umsetzung `dca307f`, Nacharbeiten `995cfc1`, `154dfc2`; Dokumente und Berichte bis `6ea30e7` (Pitch-Branch)
und `270e045` (Entwicklungsbranch). Der Commit dieser Datei steht im Git-Verlauf.


## 6. Nachtrag 18.11.2026 · Übernahme durch ChatGPT

**Festlegung des Auftraggebers:** ChatGPT übernimmt Claudes Arbeit und führt sie fort, weil Claude vorerst keine Tokens mehr hat. Quellen sind die bereitgestellten Projektunterlagen, die im Gespräch wiedergegebenen Claude-Berichte, die selbst gelesenen GitHub-Stände und der gelesene Canva-Entwurf. Kein Zugriff auf den vollständigen anderen Chat behauptet.

**Änderung gegenüber A6:** Das damalige Verbot zusätzlicher Funktionen galt für die abgeschlossene Dokumentennachprüfung. Der neue Auftrag erlaubt die getrennte Weiterarbeit an Scan und Pitchentwurf. A1 und A3 bleiben für den freigegebenen Stand und externe Aktionen bestehen. Die zwei bisherigen Arbeitsbranches und die veröffentlichte Vorschau werden nicht verändert.

**Gestaltung:** Wenig sichtbarer Text, große tatsächliche Produktansicht, Details im Sprechtext. Neue sieben Folien sind ein Arbeitsentwurf, keine Ersetzung der abgegebenen Dateien. Die frühere Freigabe nur dreier Muster wird durch den ausdrücklichen Fortsetzungsauftrag zum Entwurf des ganzen Decks erweitert.

**Kleinster technischer Versuch (Empfehlung, umgesetzt im Arbeitsbranch):** Echte lokale Etikett-Texterkennung mit vier beschrifteten Metadaten. Korrektur und Einzelbestätigung vor Speicherung im Bauteilpass. Keine Maße, Materialzertifikate oder Freigabe aus dem Foto. Begründung: ein begrenzter, überprüfbarer Teil der gewünschten Erfassung. Offen: Browser-/Handyprobe und manuell-gegen-unterstützt-Vergleich.

**Geschäftsmodellhypothese aus dem Teamgespräch:** Provisionen aus Bauteilgeschäften; zusätzlich eventuell Vermittlung von Fachleistungen und Transport. Gebühren bei beiden Projektseiten sowie Dienstleistern sind eine zu prüfende Variante, keine festgelegten Konditionen. Offen: Zahlungsbereitschaft, tatsächlicher Leistungsumfang, transparente Vereinbarung und Zuständigkeiten. Eine pauschale Haftungsfreiheit ist nicht festgestellt.

**Umfang:** Türen bleiben konkreter Testfall. Fenster und Leuchten sind Beispiele der langfristigen Idee, keine nachgewiesenen Verkaufsschlager. Im Prototyp gibt es dafür noch keine eigenen Fachregeln. Fremde Eventfotos dienen als interne Gestaltungsreferenz; ihre Logos, Zahlen und Personen werden nicht in den neuen Pitch übernommen.

Prüfweg, ausgeführte Tests, Grenzen und die nächsten drei Aufgaben stehen im Übernahmebericht, nicht in einer zweiten allgemeinen Entscheidungsliste.

## 7. Nachtrag 19.11.2026 · Pilotstand (technische Fertigstellung durch Claude)

Dokumentversion 1.1 · Branch `codex/pilotstand-20261119` · Ausgangscommit `f3c57a9` (Scan-Integration von ChatGPT) zuzüglich Merge von
`claude/bold-fermat-t1ngwv` (`665ffdb`, CF-PWA-01). Auftrag des Teams vom 19.11.2026: durchgehend nutzbarer Pilotstand.

**Festlegung des Auftraggebers A8 (19.11.2026, Geschäftsmodell):** Käufer und Verkäufer bezahlen die jeweils vereinbarten Prüf- und
Logistikleistungen an die beauftragten Unternehmen. Nach abgeschlossenem Bauteilverkauf zahlen die vermittelten Dienstleister
CircularFlow eine vereinbarte Provision. **Ändert** die Hypothese „Provisionen aus Bauteilgeschäften“ aus §6 (abgelöst). Umsetzung:
Verkaufsstand je Bauteil, vermittelte Leistungen je Dienstleister, Provisionsstatus „offen“, solange keine Vereinbarung eingetragen ist;
keine Prozentsätze, keine Zahlungen. Offen: Akzeptanz des Modells durch Dienstleister, Höhe und Grundlage der Provision, Kostentragung
bei negativer Prüfung (wird je Anfrage eingetragen, nicht automatisch verteilt).

**Festlegung des Auftraggebers A9 (19.11.2026, Ablauf):** Bauteil fotografieren → Typenschild auslesen → Angaben prüfen und bestätigen →
Bauteilpass speichern → passenden Bedarf finden → fehlende Angaben und Fristen klären → Prüf- oder Logistikleistung anfragen → Verlauf
dokumentieren. Eine Funktion gilt erst als fertig, wenn sie ausgeführt und passend geprüft wurde.

**Vorschläge der Koordination (umgesetzt, Freigabe des Teams fehlt):**

| Nr. | Vorschlag | Begründung | Offen |
|---|---|---|---|
| V10 | Texterkennung mit der deutschen Sprachdatei `deu` (tessdata_fast) statt `eng`. | Am 19.11.2026 an synthetischen Etiketten geprüft: `eng` liest Umlaute falsch („Turenwerk Muller“, „GréRe“), `deu` liest das deutsche und das englische Testetikett vollständig richtig und ist kleiner (1,5 MB statt 4,1 MB). `eng` bleibt als Vergleich im Paket. | Echte Typenschilder (Prägung, Glanz, Schmutz) sind nicht geprüft. |
| V11 | Herkunft je Typenschildangabe: „ausgelesen (Texterkennung), am Foto bestätigt“, „manuell eingegeben, am Foto bestätigt“, ohne Foto „manuell eingegeben, geprüft“. Maße weiter „gemessen/bestätigt/vorgeschlagen/fehlt“, Fachergebnis „laut Eintrag“. | Auftrag §3 verlangt die Unterscheidung ausgelesen, manuell, am Foto bestätigt, gemessen, fachlich geprüft. | – |
| V12 | Die simulierte Erkennung der Bauteilgruppe aus dem Seitenverhältnis ist aus dem Erfassungsablauf entfernt; die alte Funktion bleibt nur für historische Tests. Objekterkennung aus Bauteilfotos gibt es nicht. | Auftrag §5: keine Simulation im aktiven Ablauf; keine vorbereitete Schnittstelle als „Erkennung“ ausgeben. | Eine echte Bauteilerkennung braucht ein geprüftes Modell, Hardware und eine Freigabe zur Bildverarbeitung; nicht Teil dieses Stands. |
| V13 | Gemeinsamer Datenstand über einen eigenen **Pilotserver** (Node, keine Abhängigkeiten, Datei je Pilotraum) mit Bearbeitungs- und Leseschlüssel; die Anwendung bleibt ohne Verbindung vollständig lokal nutzbar. Zusätzlich Datenstand als Datei sichern und laden. | Auftrag §3: kleinste passende Lösung für gemeinsamen Zugriff im Pilot, getrennte Räume, kein kostenpflichtiger Dienst. | Kein Hosting, kein HTTPS, keine Benutzerkonten; Schlüssel sind Raumschlüssel, keine persönlichen Zugänge. Gleichzeitige Erfassung mit gleicher Kennung innerhalb weniger Sekunden kann einen Eintrag verwerfen (wird gemeldet, nicht still). |
| V14 | Anfragen haben die Statuskette vorbereitet → beauftragt (laut Eintrag) → Ergebnis eingetragen → weitere Klärung oder abgelehnt → Übergabe geplant → abgeschlossen. Ein Ergebnis braucht ein eingetragenes Urteil; nichts wird versendet. | Auftrag §6. Die bestehende Vorgangskette (Prüfbitte, Fachergebnis, Vormerkung, Übergabe) bleibt unverändert daneben. | Verknüpfung Anfrage ↔ Vorgang ist nur als Verweis vorgesehen, nicht automatisch. |
| V15 | Interesse an einem Angebot ist eine Interessenbekundung je Paar (Bauteil, Bedarf), keine Reservierung; sie sperrt nichts. | Auftrag §4. | – |

**Abgelöst:** §6 „Geschäftsmodellhypothese … Provisionen aus Bauteilgeschäften“ durch A8. Die frühere Freigabe nur dreier Musterfolien
und der Pitch-Entwurf bleiben von diesem Nachtrag unberührt.

Prüfweg, ausgeführte Tests, Grenzen und nächste Aufgaben: `docs/pruefungen/pilotstand-2026-11-19/README.md`.
