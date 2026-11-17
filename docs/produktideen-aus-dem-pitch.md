# Produktideen aus dem Pitch · für die spätere Plattformplanung

| | |
|---|---|
| Dokumentversion | 1.1 vom 17.11.2026. Befunde von cf-review auf Fassung 1.0 (`6a3db03`) sind eingearbeitet. |
| Status | **Ideensammlung, keine Freigabe und kein Produktumfang.** Maßgeblich bleiben der Produktbrief v0.2 und die Entscheidungen des Teams. Was das Team übernimmt, trägt es mit Aufgabe und Commit in sein Entscheidungsprotokoll ein. |
| Branch | `codex/plattform-v1` |
| Ausgangscommit | `8b340b9` (Pitch-Endstand nach Nachbesserung 3) |
| Herkunft | 5-Minuten-Pitch INNOSPRINT (`pitch/innosprint-2026/`), Steckbrief des Teams (13.11.2026), Fallakte CF-PILOT-01 1.3 (`docs/pilot/CF-PILOT-01-fallakte.md`), Plan Restmenge 1.1 (`docs/plan-restmenge.md`), Fassung 2 (`docs/plattform-v2.md`) |

Status je Idee wie in der Fallakte:
- **Projektbeleg:** in Projektunterlagen oder in der Vorschau belegt.
- **Hypothese:** vom Team erwartet, nicht belegt.
- **Eigener Vorschlag:** Idee aus der Pitcharbeit, weder geprüft noch beschlossen.

## 1. Was der Pitch über die Plattform gezeigt hat

- **Kernaussage ohne eigene Frist:** Die Kernaussage des Pitches lautet: „Spätestens am 5. Februar die Prüfung
  anfragen“ (Folie 2). Genau diesen Tag zeigt die Vorschau nicht als eigene Frist (Folie 14).
- **Zeitkritisch kommt zu spät:** „Zeitkritisch“ zeigt die Bestellfrist erst sieben Tage vorher. Bei mehr als sieben
  Tagen Prüfzeit, etwa den angenommenen 14 Tagen, ist es dann für eine Prüfung schon zu spät.
- **Steckbrief verspricht mehr als der Prototyp:**
  - „Belege kommen als Foto, Maß oder Dokument dazu.“
    - Gemessene Maße speichert die Vorschau schon, mit Wertstatus und Quelle.
    - Eine Ablage für Unterlagen, Dokumente am Pass und Unterlagen der Prüfung fehlen (Fallakte, Abschnitt 4,
      Schritte 2, 4 und 7).
    - Die Verwendbarkeitsnachweise auf Folie 14 sind ein eigenes Thema.
  - „Nach Fristablauf muss die Planung den Termin neu bestätigen.“
    - Die Vorschau zeigt nach Fristablauf „Frist verstrichen“, und der Vorgang bleibt offen.
    - Die im Status erlaubten Schritte bleiben möglich, im Beispiel E-01 Vermerk und Abbruch.
    - Eine neu bestätigte Frist gibt es nicht.
- **Wirkung nicht messbar:** Folie 7 kündigt an, Wirkung zu zählen. Die Plattform zählt heute Paare und Vorgänge,
  aber nicht, was wieder eingebaut wird. Fassung 2 sieht in der Übersicht ausdrücklich „keine Wirkungszahlen“ vor.

## 2. Neue Ideen

| Nr. | Idee | Anlass | Status | Bezug zu bestehenden Plänen | Offene Prüfung |
|---|---|---|---|---|---|
| N1 | **Wirkung zählen:** je Projekt angebotene, rechtzeitig geprüfte und wieder eingebaute Bauteile, bei Scheitern mit Grund (zu spät, Angaben fehlen, ungeeignet) | Folie 7 („Ziel, noch keine Messung“); Umweltamt: „Es gibt kaum Daten zu Baustoffströmen.“ | eigener Vorschlag | Fassung 2 zählt Paare und Vorgänge (`docs/plattform-v2.md`, Abschnitt 4) und legt für die Übersicht „keine Wirkungszahlen“ fest (Abschnitt 2, Paket P5). Die Idee braucht also eine neue Entscheidung. „Einbau dokumentieren“ ist Kandidat in der Fallakte, Abschnitt 9. Nur Stückzahlen: CO₂-, Kosten- und Abfallwerte sind in Fassung 2 verworfen. | Wer bestätigt den Einbau, und wann gilt ein Bauteil als „wieder eingebaut“? |
| N2 | **Herkunft der Prüfzeit:** zusätzlich zu „belegt“ und „geschätzt“ festhalten, ob die Prüfzeit eine Angabe der Fachperson oder gemessen ist; Dauer von Prüfbitte bis Fachergebnis aus den Vorgängen ablesen | Folie 9 („echte Prüfzeit statt 14 Tage Annahme“); 14 Tage sind Annahme A5 der Fallakte | eigener Vorschlag, Erweiterung von Fassung 2 | Fassung 2 kennzeichnet jede Zeitangabe eines Bedarfs als „belegt“ oder „geschätzt“ (`docs/plattform-v2.md`, Abschnitt 3). Vorgänge bestehen aus Ereignissen (`plattform/app/vorgang.js`). Ob sich die Dauer daraus ohne Umbau ablesen lässt, ist nicht geprüft. | Reale Werte gibt es erst mit einem Praxisfall. |
| N3 | **Feld „Angebot erreicht die Projektleitung“**, damit sichtbar wird, wie viel Zeit zwischen Angebot und Kenntnis vergeht | Folie 1 („weil die Information zu spät kommt“); Folie 9 (vier Zeitpunkte) | Hypothese; Concular nennt nur allgemein „Zeitliche Unterschiede in Nachfrage und Angebot“ (Workshop, Folie 49) | Die Fallakte führt „erreicht die Planung“ schon als einen der vier Zeitpunkte je Variante (Abschnitt 0, Akzeptanzkriterium 4). In der App gibt es dafür kein Feld. Fassung 2 kennt „verfügbar ab“, Bestellfrist und Annahmefenster. | Im Pilot messen, ob hier die Lücke liegt. |
| N4 | **Ergebnisblatt „Kurzcheck“** für eine Bauteilgruppe in einem Projekt: Paare, Zeitprüfung, fehlende Angaben, nächster Schritt; ohne Eignungsurteil | Folie 8 („erstes Angebot: Kurzcheck für eine Bauteilgruppe in einem Projekt“) | Hypothese; Zahlungsbereitschaft und Preis offen | Export und Druck sind in Fassung 2 auf „später“ gestellt. | Wer zahlt: Bauherrschaft oder Bestandsorganisation (Pitch) oder Büroleitung eines Planungsbüros (Steckbrief)? |
| N5 | **Frist nach Ablauf neu bestätigen:** neue Frist mit Begründung und zuständiger Person | Steckbrief („Nach Fristablauf muss die Planung den Termin neu bestätigen.“) | Projektbeleg für die Lücke, Lösung eigener Vorschlag | Die Vorschau zeigt „Frist verstrichen … Der Vorgang bleibt offen. Weiter möglich: …“. Welche Schritte möglich sind, hängt vom Status ab, im Beispiel E-01 (Aufmaßfrist) Vermerk und Abbruch (`docs/pitch-ablauf.md`, Zusatz A für Fragen der Jury; `docs/plattform-v2.md`, Abschnitt 10). Einträge nach Ablauf der Bestellfrist tragen den Vermerk „Eingetragen nach Ablauf der Bestellfrist“. | Darf eine neu bestätigte Frist ein „zu spät“ aufheben, oder bleibt die Zeitregel streng? |
| N6 | **Belege anhängen:** Foto oder Dokument am Pass und am Vorgang, mit Quelle und Datum | Steckbrief („Belege kommen als Foto, Maß oder Dokument dazu.“) | Projektbeleg für die Lücke (Fallakte, Abschnitt 4: Schritt 2 „Ablage für Unterlagen“, Schritt 4 „Dokumente am Pass“, Schritt 7 „Unterlagen der Prüfung“), Lösung eigener Vorschlag | Gemessene Maße speichert Fassung 2 schon mit Wertstatus „vorgeschlagen“, „gemessen“ oder „bestätigt“ und Quelle (Fallakte, Abschnitt 4, Tabelle „Wertstatus beim Scan und beim Aufmaß“). „Fachlich bestätigt“ ist dort ausdrücklich kein Wertstatus; daran ändert N6 nichts. „Einbau dokumentieren“ mit Foto ist Kandidat (Fallakte, Abschnitt 9). | Speicherort: Der Prototyp läuft ohne Server im Browser. |

## 3. Grundsatzfrage: Erinnerung vor Fristablauf

- **Steckbrief:** CircularFlow „lässt keine Frist stillschweigend verstreichen“.
- **Fassung 2:** Benachrichtigungen sind „verworfen“ (`docs/plattform-v2.md`). Die Simulation versendet nichts.
- **Wettbewerb:** Madaster Match bietet laut Dokumentation E-Mail-Benachrichtigungen (Folie 13). Eine Erinnerung
  allein unterscheidet CircularFlow also nicht.
- **Vorschlag:** zuerst ohne Versand lösen, mit der Frist „Prüfbitte spätestens“ unter „Zeitkritisch“ (B2). Ein
  Versand nur nach einer neuen Entscheidung des Teams.

## 4. Durch den Pitch bestätigt, bereits geplant oder Kandidat

| Nr. | Thema | Stand | Was der Pitch dazu zeigt |
|---|---|---|---|
| B1 | Sichtbare Restmenge, danach zweiter Vorgang für die Restmenge | Plan Restmenge 1.1 (`docs/plan-restmenge.md`). Laut Auftrag vom 16.11.2026 kommt sie nach dem Pitch zuerst, nach Freigabe des Umfangs. | Anhang Folie 12: Nach einer Teil-Vormerkung gilt der Bedarf als gedeckt, die fehlende Tür steht nur in einer Notiz. |
| B2 | Frist „Prüfbitte spätestens“ (Bestellfrist minus Prüfzeit) | Kandidat, Fallakte Abschnitt 9, Variante 2. Laut Fallakte ist der Aufwand klein und durch den Auftrag vom 16.11. hinter die Restmenge gestellt. | Sie ist die Kernaussage von Folie 2 und die erste Grenze auf Folie 14. Ohne sie erscheint die Bestellfrist unter „Zeitkritisch“ erst, wenn eine Prüfung mit mehr als sieben Tagen Prüfzeit nicht mehr rechtzeitig fertig werden kann. So ist es im Pilot mit 14 Tagen und bei den Demo-Bedarfen mit 10 und 14 Tagen. |
| B3 | Türfall des Pilots als Demo, damit Geschichte und Demo dieselben Türen zeigen | Fallakte, Abschnitt 8: Demo des Türfalls in einem eigenen Profil, Projekt, Bedarf und Türen werden vorab von Hand eingetragen. Diese Daten ändern die Startbedingung des Pitches (im Test 9 statt 8 Paare, 4 statt 2 Vorgänge). | Die Notiz zu Folie 4 (K1) sagt: „Im Weiteren geht es um Systemtrennwände statt Türen“. Vorschlag: den Türfall fest als wählbare Demo aufnehmen, ohne die geprüfte Startbedingung zu ändern. |

## 5. Offene Fragen für die Planung

1. **Käufer:** Der Steckbrief nennt die Büroleitung eines Planungsbüros. Der Pitch nennt als Hypothese die
   Bauherrschaft oder die Bestandsorganisation. Was davon testen wir zuerst?
2. **Abgrenzung oder Zusammenarbeit:** Concular zeigt „Interne Vermittlung“ mit „Reservieren“ und „Integration in
   Planungstool“ (Workshop, Folie 67, Herstellerangabe). Welche Teile ergänzt CircularFlow, und welche gibt es schon?

## 6. Nächster Prüfauftrag

Es gilt der nächste Prüfauftrag der Fallakte (Abschnitt 11): Mit einer Planerin oder einem Planer aus einem realen
Umbauprojekt prüfen, wie viele Tage vor der Ersatzbestellung ein Angebot vorliegen muss.

- **Ergänzung aus dem Pitch:** Dabei die vier Zeitpunkte und die echte Prüfzeit erfassen (Folie 9).
- **Danach:** N2 und N3 neu bewerten.
- **Zuständigkeit und Frist:** wie in der Fallakte vorgeschlagen. Das Team bestätigt beides.
