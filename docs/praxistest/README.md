# Praxistest · Unterlagen

Dokumentversion 1.1 · Stand 18.11.2026 · Branch `codex/plattform-v1` · Ausgangscommit `23dc050`

**Status: Entwurf.** Es wurde kein Gespräch geführt, nichts versendet und niemand angeschrieben. Es gibt keine
Praxisbestätigung und keinen Partner. Das Team bestätigt die Unterlagen, bevor es sie verwendet.

| Datei | Zweck |
|---|---|
| `kurzcheck-einseiter.md` / `.pdf` | Eine Seite für die Projektleitung: was der Kurzcheck zeigt, was er braucht, was er nicht ist |
| `gespraechsleitfaden-15-minuten.md` / `.pdf` | Leitfaden für ein 15-Minuten-Gespräch mit zehn Fragen (F1 bis F10) und festen Regeln |
| `gespraechsnotiz-vorlage.md` / `.pdf` | Vorlage zum Festhalten, mit Einverständnis und Einordnung der Hypothesen H1 bis H10 |
| `pdf-erzeugen.cjs` | Erzeugt die PDFs aus den Markdown-Dateien (`pandoc` und Chromium) |

Die Hypothesen H1 bis H10, ihre Entscheidungsregeln und die Prüfschritte stehen in
`pitch/innosprint-2026/juryfragen/juryantworten.md`, Abschnitt 2.

## Vom Team vor dem ersten Gespräch zu entscheiden

1. **Kontakt eintragen** im Einseiter (Platzhalter „[Kontakt des Teams eintragen]“). Dort steht bewusst keine private Adresse
   und keine Telefonnummer.
2. **Zusagen im Einseiter prüfen.** Das Team muss sie einhalten können:
   - **Ergebnisblatt:** Der Einseiter und der Ablauf nennen ein Ergebnisblatt und ein gemeinsames Besprechen. Das Team
     entscheidet, ob es das je Fall leisten kann und bis wann. Sonst die Zeilen ändern („Wir zeigen Ihnen das Ergebnis im
     Gespräch“).
   - **Verwendung:** Angaben nur zur Prüfung der Idee und für Vorträge und Folien des Teams, zunächst ohne Namen und Büro.
     Namen, Büro, Zitate und Fotos nur mit ausdrücklicher Zustimmung (vier Fragen am Ende des Gesprächs, in der Notiz).
   - **Unverbindlich, kein Preis.** Eine Zusage (Kurztest, Termin, Datenüberlassung) notieren, nur wenn die Person sie
     ausdrücklich macht.
3. **Speicherort und Löschfrist der Notizen festlegen** und im Einseiter und in der Notiz eintragen (Platzhalter „[Team
   trägt ein]“). Vorschlag, das Team entscheidet: nur auf Geräten des Teams, nicht in geteilten Ordnern ohne Zustimmung,
   löschen nach der Auswertung der drei Gespräche.
4. **Entscheidungsregeln** aus den Juryantworten (Abschnitt 2) bestätigen oder ändern, **bevor** das erste Gespräch
   stattfindet.
5. **Wer führt, wer notiert.** Vorschlag: eine Person führt, eine notiert, getauscht je Gespräch.

## PDFs neu erzeugen

```bash
node docs/praxistest/pdf-erzeugen.cjs docs/praxistest/kurzcheck-einseiter.md docs/praxistest/kurzcheck-einseiter.pdf 9.5
```

Der Einseiter muss auf **eine** Seite passen. Das Skript meldet die Seitenzahl.
