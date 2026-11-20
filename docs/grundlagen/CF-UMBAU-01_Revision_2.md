# CF-UMBAU-01 Entwicklungsauftrag Revision 2

CF-UMBAU-01 · INNOSPRINT-Türsimulation · Revision 2 vom 14.11.2026
Grundlage: CircularFlow-Produktbrief v0.3, Abschnitt 7.
Status: Prüffassung zur Teamfreigabe. Umsetzung erst nach Freigabe.

1. Ziel und Ausgangspunkt

Eine Person im Planungsbüro möchte vor der Ersatzentscheidung klären,
ob eine vorhandene Tür samt Zarge in eine andere Öffnung desselben
Umbaus versetzt werden kann. Die Karte zeigt, ob das einzelne
Breitenkriterium belegt ist und welcher Schritt jetzt ansteht.

Repository: sammo3332/CircularFlow.
Geprüfte Basis: Entwurfs-PR #1, codex/circularflow-vorpruefung-v1,
Commit f640e2baa8178c09e4a2b0bfd1d6d7187a79dede.
Lies AGENTS.md, CLAUDE.md, README.md, docs/entscheidungen.md,
docs/produktbrief.md und prototype/README.md. Prüfe HEAD und Arbeitsbaum.
Arbeite nach Freigabe auf dem lokalen Branch codex/cf-umbau-01-innentuer
von der geprüften Basis. Erhalte bestehende Arbeit und melde relevante
Abweichungen. Halte die Freigabereferenz auf v0.3 und diese Revision fest.

2. Eine Karte für den fiktiven Umbau

Ergänze im statischen Prototyp den Einstieg „Tür im selben Umbau“.
Die Karte zeigt dauerhaft „Simulation mit Beispieldaten“. Tür T-07
samt Zarge aus Raum A soll in die Zielöffnung B-02. Das fiktive
Planungsblatt P-02 gibt für diese Kombination 885–895 mm vor.

P-02 definiert die Messstelle für diesen Beispieldatensatz:
horizontal zwischen den seitlichen Rohbaukanten von B-02, 1,00 m
über Oberkante Rohfußboden. Zulässiger Messbezug:
„Rohbauöffnungsbreite B-02, Messstelle laut P-02“.
Sollbereich und Messstelle sind gewählte Simulationsannahmen.

Eingaben: Wert in mm, Messbezug, Messstatus, Belegquelle, Messdatum
und Eingang bei der Planung mit Datum und Uhrzeit. Zeige Ist und
Soll, den Breitenbefund, beide Fristen, Rolle und Hauptschritt.
Höhe, Anschlag und Zustand bleiben offene Punkte der Fachprüfung.

3. Wann das Aufmaß zählt

Ein Aufmaß ist verwertbar, wenn der Zahlenwert endlich und positiv
ist, die Einheit mm lautet, der Bezug P-02 entspricht, der Status
„gemessen“ ist, Quelle und gültiges Messdatum vorliegen und ein
zeitlich plausibler Eingang bis zum Betrachtungszeitpunkt vorliegt.

- Bei einem anderen Bezug bleibt die Breite offen. Nenne den
  erfassten und den erwarteten Bezug. Ein Türblattmaß oder eine
  lichte Breite ersetzt das in P-02 definierte Aufmaß nicht.
- Geschätzte, vorgeschlagene, fehlende oder ungültige Angaben
  lassen die Breite offen. Zeige den Grund.
- Fehlt der Eingang oder liegt er nach dem Betrachtungszeitpunkt,
  gilt das Aufmaß als noch nicht eingegangen. Das allein ist kein
  Terminwiderspruch. Ein ungültiger Zeitwert erfordert Klärung.
- Liegt der Eingang in Europe/Berlin an einem früheren Kalendertag
  als das Messdatum, zeige „Eingang vor Messdatum – widersprüchlich“.
  Der Eintrag bleibt unverwertbar, auch bei passendem Maß.
- Bei einem verwertbaren Aufmaß gilt der Bereich inklusive Grenzen.
  890 mm ergibt „Breitenkriterium erfüllt“. 870 mm ergibt
  „Breitenkriterium verfehlt – 15 mm unter der Untergrenze“.

Der Befund bewertet ausschließlich die Breite. Die zuständigen
Fachleute entscheiden über die tatsächliche Eignung.

4. Zwei Zeitstände und ein eigener Terminwiderspruch

Beispieldaten in Europe/Berlin, für alle Novembertermine UTC+01:00:
Aufmaßfrist 18.11.2026, 16:00 Uhr. Ersatzentscheidung 19.11.2026,
12:00 Uhr. Ausgangszeitpunkt 18.11., 14:00 Uhr. Spätere Auswahl:
18.11., 15:30 Uhr, 19.11., 09:00 Uhr und 20.11., 09:00 Uhr. Vergleiche feste Zeitwerte
unabhängig von Systemuhr und Gerätezeitzone. Der exakte Grenzzeitpunkt
zählt bei beiden Fristen als rechtzeitig.

- Aufmaßstatus: Ohne verwertbares Aufmaß „Aufmaß ausstehend“ bis
  einschließlich Aufmaßfrist, danach „Aufmaß überfällig“. Bei
  verwertbarem Aufmaß zählt der tatsächliche Eingang: „rechtzeitig
  eingegangen“ oder „verspätet eingegangen“. Ein früherer
  rechtzeitiger Eingang bleibt auch später rechtzeitig.
- Ersatzentscheidung: „Entscheidungsfrist offen“ bis einschließlich
  Ersatztermin, danach „Entscheidungsfrist verstrichen“. Der Termin
  dokumentiert keine tatsächlich ausgelöste Bestellung.
- Liegt die Aufmaßfrist nach der Ersatzentscheidungsfrist, zeige
  zusätzlich „Aufmaß ist erst nach der Ersatzentscheidung fällig“.
  Diese Warnung ist unabhängig von beiden Zeitständen. Bis zur
  Klärung kann die Karte keine Vorlage zur Fachprüfung empfehlen.

5. Hauptschritt und weiterhin offene Aufgaben

Leite die Aufgaben unabhängig voneinander ab. Zeige den ersten
zutreffenden Punkt als Hauptschritt. Weitere zutreffende offene
Aufgaben stehen einmalig unter „Weiterhin offen“. Aufgaben für die
Fachprüfung sind nur im noch offenen, widerspruchsfreien Fall
zulässig. Reihenfolge:

1. Ersatzentscheidungsfrist verstrichen: „Bestellstatus klären“,
   Rolle Planung. Erst feststellen, ob Ersatz bereits bestellt wurde
   und welche Optionen noch offenstehen.
2. Fristwiderspruch oder ungültiger/widersprüchlicher Eingang:
   „Termine klären“, Rolle Planung.
3. Bei offenem Ersatztermin und verfehlter Breite:
   „Anpassung fachlich klären oder Ersatzweg vorbereiten“, Rolle Planung.
4. Bei offenem Ersatztermin und überfälligem oder verspätetem Aufmaß:
   „Prüfvorlauf klären“, Rolle Planung.
5. Solange ein verwertbares Aufmaß fehlt: „Rohbauöffnung B-02 an der
   Messstelle laut P-02 messen oder ein verwertbares Aufmaß nachreichen“,
   Rolle Montagebetrieb. Dieser Punkt bleibt unter „Weiterhin offen“,
   wenn ein höherrangiger Schritt zutrifft.
6. Breite erfüllt, Aufmaß rechtzeitig, Ersatztermin offen und Zeiten
   widerspruchsfrei: „Variante zur fachlichen Prüfung vorlegen“,
   Rolle Planung. Weitere technische Anforderungen bleiben offen.

Nach Fristablauf bleiben Breitenbefund, Aufmaßstatus, Warnungen und
noch offene Angaben sichtbar. Die Karte ändert keine Frist automatisch
und löst keine Bestellung oder Fachfreigabe aus.

6. Umsetzung und Abnahme

Verwende das bestehende HTML, CSS und JavaScript. Trenne die reine
Regel mit übergebenem Betrachtungszeitpunkt vom UI. Biete bedienbare
Eingaben, Beispieldaten und Reset. Die Türsimulation kann im Speicher
bleiben. Bestehende Fälle und lokal gespeicherte Daten bleiben nutzbar.
Umfang: eine lokale Karte, Regeltests und kurze Startanleitung.
Ausgeschlossen: Framework-Wechsel, Backend, Anmeldung, KI, Upload,
3D, Marktplatz, Versand, Push, Merge, Deployment und bezahlte Dienste.

Prüffälle, zusätzlich zu den 13 Tests des Ausgangsstands
Alle Tage im November 2026, alle Zeiten in Europe/Berlin. Für gültige
Standard-Aufmaße gelten P-02 als Bezug, eine fiktive Aufmaßnotiz als
Quelle und bei frühem Eingang das Messdatum 18.11.

01. Kein Aufmaß am 18.11., 14:00. Breite offen, Aufmaß ausstehend,
    Ersatzfrist offen. Hauptschritt: Messauftrag an Montagebetrieb.
02. 890 mm, Eingang 18.11., 15:00, Betrachtung 18.11., 15:30.
    Breite erfüllt, rechtzeitig eingegangen. Hauptschritt: Fachprüfung.
03. Wie 02 mit 870 mm. Breite verfehlt, 15 mm unter Untergrenze.
    Hauptschritt: Anpassung klären oder Ersatzweg vorbereiten.
04. Wie 02 mit 890 mm als „lichte Breite“ oder „Türblattmaß“.
    Breite offen. Grund nennt den jeweiligen und den erwarteten Bezug.
    Auch KI-Vorschlag, Schätzung, fehlende Quelle und leere,
    ungültige oder nicht positive Zahlen bleiben offen.
05. Am 19.11., 09:00 fehlt das Aufmaß weiterhin. Aufmaß überfällig,
    Ersatzfrist offen. Prüfvorlauf klären. Messauftrag bleibt sichtbar.
06. 890 mm, Messdatum und Eingang am 19.11., Eingang um 09:00,
    Betrachtung um 09:00. Breite erfüllt, Aufmaß verspätet,
    Ersatzfrist offen. Hauptschritt: Prüfvorlauf klären.
07. 890 mm, Eingang 18.11., 15:00, Betrachtung 20.11., 09:00.
    Breite erfüllt, weiterhin rechtzeitig eingegangen, Ersatzfrist
    verstrichen. Hauptschritt: Bestellstatus klären.
08. Aufmaßfrist 19.11., 13:00, Ersatzfrist 19.11., 12:00,
    Betrachtung 18.11., 14:00. Beide Fristen laufen. Widerspruch ist
    sichtbar und „Termine klären“ hat Vorrang vor dem Messauftrag.
09. 885 und 895 mm erfüllen die Breite. Eingang genau am
    18.11., 16:00 ist rechtzeitig. Genau am 19.11., 12:00
    gilt die Ersatzentscheidungsfrist noch als offen.
10. 890 mm als Türblattmaß, Eingang 18.11., 15:00, Betrachtung
    19.11., 09:00. Breite offen und Aufmaß überfällig. Kein
    rechtzeitiger Eingang eines verwertbaren Aufmaßes.
11. 890 mm nach P-02, Messdatum 19.11., Eingang 18.11., 15:00,
    Betrachtung 19.11., 09:00. Breite offen, Eingang widersprüchlich,
    Hauptschritt „Termine klären“. Messauftrag bleibt sichtbar.
12. 890 mm nach P-02, Messdatum 18.11., Eingang 18.11., 15:00,
    Betrachtung zurück auf 18.11., 14:00. Noch nicht eingegangen,
    Breite offen, Aufmaß ausstehend. Kein Terminwiderspruch.
13. Kein Aufmaß, Aufmaßfrist 19.11., 13:00, Ersatzfrist
    19.11., 12:00, Betrachtung 20.11., 09:00. Aufmaß überfällig.
    Hauptschritt „Bestellstatus klären“. Unter „Weiterhin offen“
    stehen „Termine klären“ und der Messauftrag.
14. Browserprüfung: Karte öffnen, einen Messwert erfassen, die
    Betrachtungszeit vor und zurück stellen und Reset auslösen.
    Danach einen bestehenden Fall öffnen und seinen Ablauf prüfen.

Führe die bestehenden und neuen Regeltests mit node --test aus.
Starte prototype/dist über einen lokalen statischen HTTP-Server und
prüfe Fall 14, soweit ein Browser verfügbar ist. Liefere Branch,
Ausgangscommit, Änderung, Start- und Testbefehle sowie beobachtete
Ergebnisse und offene Prüfungen.
