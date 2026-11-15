# CircularFlow Plattform · klickbarer Entwurf

Entwurf 0.2 vom 15.11.2026. Vier verbundene Ansichten mit einem gemeinsamen, **fiktiven** Beispielprojekt:
Projektübersicht, Bauteilbestand, Bauteilpass und Wiederverwendungsentscheidung. Planung, Quellen und
Empfehlung stehen in [`docs/plattform-entwurf.md`](../../docs/plattform-entwurf.md).

Der Entwurf ist kein Produktivcode. Er speichert nichts, versendet nichts und hat kein Backend.
Aktionen wie „Zur Fachprüfung vorlegen“ werden nur im Verlauf der Seite vermerkt.

## Öffnen

Vom Repository-Root einen statischen Server starten (Windows meist `py` statt `python3`):

```sh
python3 -m http.server 8000
```

Dann `http://localhost:8000/entwurf/plattform/` öffnen. Der Server muss vom Repository-Root laufen,
weil der Entwurf die geprüfte Türregel aus `prototype/dist/door-rules.mjs` lädt.

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Seitenrahmen |
| `app.js` | Zustand, Router, die vier Ansichten, Entwurfsregel Doppelboden |
| `daten.js` | gemeinsamer fiktiver Datensatz (Projekt, Personen, Bauteile, Entscheidungen) |
| `styles.css` | Gestaltung, heller und dunkler Modus, schmale Ansicht |
| `fonts/` | Archivo und JetBrains Mono (lateinische Teilmenge), SIL Open Font License 1.1, Lizenztexte daneben |
| `bauen-artifact.mjs` | erzeugt die Fassung für die Veröffentlichung als claude.ai-Seite |

## Regeln

- **E-01 (Tür T-07 → B-02)** nutzt `prototype/dist/door-rules.mjs` unverändert, also die mit 45 Regeltests
  geprüfte Fassung aus CF-UMBAU-01 Revision 2.
- **E-02 (Doppelboden DB-01)** nutzt eine Entwurfsregel in `app.js` mit derselben Rangfolge. Sie ist
  **nicht geprüft** und in der Oberfläche so gekennzeichnet.
