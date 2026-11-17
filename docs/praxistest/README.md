# Praxistest · Unterlagen

Dokumentversion 1.0 · Stand 18.11.2026 · Branch `codex/plattform-v1` · Ausgangscommit `e244fc4`

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
2. **Zusagen im Einseiter prüfen:** „nur für diesen Test“, „Namen, Büro oder Zitate nur mit ausdrücklicher Zustimmung“,
   „unverbindlich“, „keinen Preis nennen“. Das Team muss sie einhalten können.
3. **Entscheidungsregeln** aus den Juryantworten (Abschnitt 2) bestätigen oder ändern, **bevor** das erste Gespräch
   stattfindet.
4. **Wer führt, wer notiert.** Vorschlag: eine Person führt, eine notiert, getauscht je Gespräch.

## PDFs neu erzeugen

```bash
node docs/praxistest/pdf-erzeugen.cjs docs/praxistest/kurzcheck-einseiter.md docs/praxistest/kurzcheck-einseiter.pdf 9.5
```

Der Einseiter muss auf **eine** Seite passen. Das Skript meldet die Seitenzahl.
