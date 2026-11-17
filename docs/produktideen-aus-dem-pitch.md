# Produktideen aus dem Pitch · für die spätere Plattformplanung

| | |
|---|---|
| Dokumentversion | 1.0 vom 17.11.2026 |
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
- **Zeitkritisch kommt zu spät:** „Zeitkritisch“ zeigt die Bestellfrist erst sieben Tage vorher. Bei 14 Tagen
  Prüfzeit ist es dann für eine Prüfung schon zu spät.
- **Steckbrief verspricht mehr als der Prototyp:**
  - „Belege kommen als Foto, Maß oder Dokument dazu.“ Die Vorschau speichert aber keine Nachweise.
  - „Nach Fristablauf muss die Planung den Termin neu bestätigen.“ Die Vorschau bietet nach Fristablauf nur Vermerk
    und Abbruch.
- **Wirkung nicht messbar:** Folie 7 kündigt an, Wirkung zu zählen. Die Plattform zählt heute Paare und Vorgänge,
  aber nicht, was wieder eingebaut wird.

## 2. Neue Ideen

| Nr. | Idee | Anlass | Status | Bezug zu bestehenden Plänen | Offene Prüfung |
|---|---|---|---|---|---|
| N1 | **Wirkung zählen:** je Projekt angebotene, rechtzeitig geprüfte und wieder eingebaute Bauteile, bei Scheitern mit Grund (zu spät, Angaben fehlen, ungeeignet) | Folie 7 („Ziel, noch keine Messung“); Umweltamt: „Es gibt kaum Daten zu Baustoffströmen.“ | eigener Vorschlag | Fassung 2 zählt Paare und Vorgänge (`docs/plattform-v2.md`, Abschnitt 4). „Einbau dokumentieren“ ist Kandidat in der Fallakte, Abschnitt 9. Nur Stückzahlen: CO₂-, Kosten- und Abfallwerte sind in Fassung 2 verworfen. | Wer bestätigt den Einbau, und wann gilt ein Bauteil als „wieder eingebaut“? |
| N2 | **Echte Prüfzeit statt Annahme:** je Bedarf festhalten, woher die Prüfzeit stammt (Annahme, Angabe der Fachperson, gemessen); Dauer von Prüfbitte bis Fachergebnis aus den Vorgängen ablesen | Folie 9 („echte Prüfzeit statt 14 Tage Annahme“); 14 Tage sind Annahme A5 der Fallakte | eigener Vorschlag | Vorgänge bestehen aus Ereignissen (`plattform/app/vorgang.js`). Ob sich die Dauer daraus ohne Umbau ablesen lässt, ist nicht geprüft. | Reale Werte gibt es erst mit einem Praxisfall. |
| N3 | **Zeitpunkt „Angebot erreicht die Projektleitung“** als eigene Angabe, damit sichtbar wird, wie viel Zeit zwischen Angebot und Kenntnis vergeht | Folie 1 („weil die Information zu spät kommt“); Folie 9 (vier Zeitpunkte) | Hypothese; Concular nennt nur allgemein „Zeitliche Unterschiede in Nachfrage und Angebot“ (Workshop, Folie 49) | Fassung 2 kennt „verfügbar ab“, Bestellfrist und Annahmefenster, aber nicht, wann die Projektleitung vom Angebot erfährt. | Im Pilot messen, ob hier die Lücke liegt. |
| N4 | **Ergebnisblatt „Kurzcheck“** für eine Bauteilgruppe in einem Projekt: Paare, Zeitprüfung, fehlende Angaben, nächster Schritt; ohne Eignungsurteil | Folie 8 („erstes Angebot: Kurzcheck für eine Bauteilgruppe in einem Projekt“) | Hypothese; Zahlungsbereitschaft und Preis offen | Export und Druck sind in Fassung 2 auf „später“ gestellt. | Wer zahlt: Bauherrschaft oder Bestandsorganisation (Pitch) oder Büroleitung eines Planungsbüros (Steckbrief)? |
| N5 | **Frist nach Ablauf neu bestätigen:** neue Frist mit Begründung und zuständiger Person | Steckbrief („Nach Fristablauf muss die Planung den Termin neu bestätigen.“) | Projektbeleg für die Lücke: Die Vorschau zeigt „Frist verstrichen … Der Vorgang bleibt offen. Weiter möglich: Vermerk, Abbruch.“ (`docs/pitch-ablauf.md`, Zusatz A für Fragen der Jury); die Lösung ist eigener Vorschlag | – | Darf eine neu bestätigte Frist ein „zu spät“ aufheben, oder bleibt die Zeitregel streng? |
| N6 | **Belege am Vorgang:** Foto, Maß oder Dokument, je Angabe mit Herkunft (abgelesen, gemessen, aus Dokument, KI-Vorschlag, fachlich bestätigt) | Steckbrief („Belege kommen als Foto, Maß oder Dokument dazu.“); Folie 14 („Die Vorschau speichert keine Nachweise.“) | Projektbeleg für die Lücke; Lösung eigener Vorschlag | „Einbau dokumentieren“ mit Foto (Fallakte, Abschnitt 9) | Speicherort: Der Prototyp läuft ohne Server im Browser. |
| N7 | **Türfall des Pilots in der Demo:** Geschichte und Demo zeigen dieselben Türen | Folie 4 („Im Weiteren geht es um Systemtrennwände statt Türen“) | eigener Vorschlag | Die Pilotdaten liegen in Fassung 2 neben den Beispieldaten (Fallakte, Abschnitt 3), ihre Fristen liegen aber im Februar 2027. | Lässt sich ein passender Stichtag wählen, ohne die geprüfte Startbedingung der Demo zu ändern? |

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
| B2 | Frist „Prüfbitte spätestens“ (Bestellfrist minus Prüfzeit) | Kandidat, Fallakte Abschnitt 9, Variante 2. Laut Fallakte ist der Aufwand klein und durch den Auftrag vom 16.11. hinter die Restmenge gestellt. | Sie ist die Kernaussage von Folie 2 und die erste Grenze auf Folie 14. Ohne sie erscheint die Bestellfrist erst unter „Zeitkritisch“, wenn eine Prüfung nicht mehr rechtzeitig fertig werden kann. |

## 5. Offene Fragen für die Planung

1. **Käufer:** Der Steckbrief nennt die Büroleitung eines Planungsbüros. Der Pitch nennt als Hypothese die
   Bauherrschaft oder die Bestandsorganisation. Was davon testen wir zuerst?
2. **Abgrenzung oder Zusammenarbeit:** Concular zeigt „Interne Vermittlung“ mit „Reservieren“ und „Integration in
   Planungstool“ (Workshop, Folie 67, Herstellerangabe). Welche Teile ergänzt CircularFlow, und welche gibt es schon?

## 6. Nächster Prüfauftrag

Im ersten echten Umbaufall die vier Zeitpunkte und die echte Prüfzeit erfassen (Folie 9).

- **Abschluss:** dokumentierte Werte mit Quelle, die die Annahme von 14 Tagen bestätigen oder ersetzen.
- **Danach:** N2 und N3 neu bewerten.
- **Zuständigkeit und Frist:** Vorschlag Team CircularFlow, vor der nächsten Planungsrunde. Das Team bestätigt beides.
