# Veröffentlichung auf Vercel – Prüfung und Vorbereitung · 20.11.2026

Auftrag (20.11.2026): Die Website `https://circularflowdortmund.vercel.app` zeigt trotz „erfolgreichem“ Deployment 404.
Gewünscht ist die vorhandene CircularFlow-Demo (Bauteilpass, Angebots-/Bedarfsabgleich, Zeitprüfung) im **bestehenden**
Vercel-Projekt `circularflowdortmund`, kein zweites Projekt, Veröffentlichung erst nach Freigabe.

| Angabe | Wert |
| --- | --- |
| Geprüfter Code | Branch `codex/pilotstand-20261119`, Commit `eccd5e2` (App unverändert; dieser Ordner kommt als Dokumentation hinzu) |
| Dokumentfassung | 1, 20.11.2026 |
| Live-Stand bei Prüfbeginn | `GET /`, `/plattform/`, `/prototype/dist/`, `/README.md`, `/index.html`: alle **404**, Header `x-vercel-error: NOT_FOUND` |
| `main` | `85a7497`, 6 Dateien (`.gitignore`, `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/…`), **kein** `index.html`, **kein** `vercel.json` |
| Pilot-Branch | 404 Dateien, enthält `plattform/` (statische App ohne Build), `prototype/dist/`, `vercel.json`, `.vercelignore`; baut auf `main` auf |

## 1 Befund: Warum die Seite 404 zeigt

Das Vercel-Projekt deployt nach Lage der Dinge den Branch `main`. Dort liegt nur Dokumentation. Ohne `index.html`, ohne
`vercel.json` und ohne Framework gibt es nichts auszuliefern, also 404 auf jedem Pfad. Die eigentliche Anwendung liegt
vollständig im selben Repository, aber auf dem Branch `codex/pilotstand-20261119`. Es muss **keine neue Anwendung** gebaut werden.

Nicht aus dem Repository ablesbar (braucht Vercel-Zugang oder einen Blick ins Dashboard): ob das Projekt mit GitHub
verknüpft ist, welcher Branch als Production Branch eingestellt ist, Root Directory, Framework Preset und Deployment Protection.

## 2 Technische Grundlage

- Start lokal: `node plattform/server/pilotserver.mjs` (optional, für den gemeinsamen Datenstand) oder ein beliebiger statischer
  Server im Repository-Wurzelverzeichnis (`python3 -m http.server 8030`), dann `http://127.0.0.1:8030/plattform/`.
- **Kein Build-Befehl, keine Abhängigkeiten.** Vercel braucht nur die Dateien des Branches im Wurzelverzeichnis:
  `plattform/` (App, Texterkennung mit Engine-Dateien, 13 MB), `prototype/dist/door-rules.mjs` (geprüfte Türregel, wird von
  `plattform/app/main.js` relativ geladen – deshalb muss das Root Directory die Repository-Wurzel bleiben), `vercel.json`
  (Redirect `/` → `/plattform/`, Cache-Regeln). `.vercelignore` wirkt nur bei CLI-Uploads, nicht bei Git-Deployments
  (Vercel-Doku „Exclude Files from Deployments with .vercelignore“, gelesen 20.11.2026).
- Sensible Daten: `git grep` nach Schlüsseln, Tokens, Passwörtern und E-Mail-Adressen in versionierten Dateien ohne Treffer
  (nur Wort „Token“ in Kommentaren). Pilotserver-Daten (`plattform/server/daten/`) sind per `.gitignore` ausgeschlossen.
  Das Repository ist öffentlich; ein Git-Deployment liefert zusätzlich `docs/` und `pitch/` aus (dieselben Dateien, die auf GitHub
  schon öffentlich sind). Optional später: Rewrites in `vercel.json`, die `/docs/` und `/pitch/` ausblenden.
- Keine kostenpflichtigen Dienste nötig. Die App ruft außer der eigenen Herkunft nichts auf (siehe Abnahme, Kriterium 5).

## 3 Notwendige Änderungen (zur Freigabe)

**Am Code: keine.** Die App bleibt unverändert. Hinzu kommen nur dieser Prüfordner und ein Absatz in `plattform/README.md`.

**Am Vercel-Projekt `circularflowdortmund`** (Dashboard → Projekt → Settings), eine der beiden Varianten:

| Variante | Änderung | Wirkung | Bewertung |
| --- | --- | --- | --- |
| **A (empfohlen)** | Settings → Git → **Production Branch** = `codex/pilotstand-20261119`; danach Deployments → „Redeploy“ oder ein Push auf den Branch | Produktions-URL liefert die App; jeder Push auf den Branch aktualisiert sie automatisch | kein Merge in `main` nötig, sofort rücknehmbar (Production Branch zurück auf `main`) |
| B | Pilot-Branch nach `main` mergen (Fast-Forward möglich, `main` ist Vorfahre) | wie A, `main` wird der ausgelieferte Stand | greift in den freigegebenen Stand ein (`CLAUDE.md`: nur mit gesondertem Auftrag); dafür einfachere Pflege |

Für beide Varianten prüfen bzw. setzen: Framework Preset **Other**, Build Command **leer**, Output Directory **leer**,
Root Directory **leer** (Repository-Wurzel), Install Command **leer**. Git-Verknüpfung: Repository `sammo3332/CircularFlow`.
Domain: `circularflowdortmund.vercel.app` bleibt; keine eigene Domain, keine Käufe.

Ohne Git-Verknüpfung (falls das Projekt nur per CLI angelegt wurde): `vercel deploy --prod` aus einem sauberen Export des Commits
`eccd5e2` in **dasselbe** Projekt (`vercel link --project circularflowdortmund`), oder Verknüpfung im Dashboard herstellen.

## 4 Tests auf dem Code-Stand `eccd5e2`

Alle Läufe am 20.11.2026 in diesem Container; Rohausgaben in `rohausgaben/`, Bilder in `bilder/`.

| Prüfung | Befehl | Ergebnis |
| --- | --- | --- |
| Regeltests (Türregel, Plattformregeln, Pilot, Pilotserver, Etikett) | `node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs plattform/test/*.test.mjs` | **239/239 bestanden**, `rohausgaben/regeltests-eccd5e2.txt` |
| Abnahme der fünf Auftragskriterien gegen den sauberen Export (`git archive eccd5e2`, `python3 -m http.server 8030`) | `node docs/pruefungen/vercel-2026-11-20/werkzeug/abnahme.mjs http://127.0.0.1:8030/plattform/ docs/pruefungen/vercel-2026-11-20/bilder lokal` | **17/17 bestanden**, `rohausgaben/abnahme-lokal-eccd5e2.txt` |
| Statische Prüfung mit Texterkennung, Manifest, Installierbarkeit | `docs/pruefungen/pilotstand-2026-11-19/werkzeug/statisch-pruefen.mjs` (Lauf vom 19.11. auf demselben Commit) | bestanden, `../pilotstand-2026-11-19/rohausgaben/statisch-pruefen.txt` |

Die fünf Kriterien des Auftrags, lokal belegt:

1. **Ohne 404:** `/plattform/` und Manifest 200; unbekannte Unterseite zeigt die Hinweisseite der App. (Die Umleitung `/` → `/plattform/` kann nur auf Vercel geprüft werden.)
2. **Bauteilpass:** Katalog mit 11 Bauteilpässen, `#pass-lh-db-01` geöffnet, Angebotsblock vorhanden (`bilder/lokal-2-bauteilpass.png`).
3. **Angebots- und Bedarfsdaten:** 5 Bedarfe (BD-…), 11 angebotene Bauteile, 8 Paarungen in der Abgleichliste.
4. **Zeitprüfung:** TW-01 → BD-23 „Für diese Entscheidung zu spät“ (Prüfbitte gesperrt); TW-05 → BD-22 „Weiter prüfen“, regelbasiert;
   Türdemo E-01: „Rechtzeitigen Eingang zeigen“ setzt ein Beispielaufmaß mit Eingang Mi 18.11., 15:00 vor der Aufmaßfrist.
5. **Keine echten Nachrichten:** Prüfbitte wird als Simulation („nichts wird versendet“) angelegt; 45 Netzwerkanfragen, alle an die
   eigene Herkunft, nur GET; keine POST/PUT; keine Konsolenfehler.

## 5 Was fehlt (Stand 20.11.2026, 11:20 Uhr)

- **Vercel-Zugang aus Claude heraus funktioniert nicht.** Das Netzwerk-Secret „Vercel-Zugriffstoken“ für `api.vercel.com` ist in der
  Cloud-Umgebung hinterlegt und wird vom Proxy angewendet (Antwortheader `X-Proxy-Error: upstream denied the request: connection
  "Vercel-Zugriffstoken", host "api.vercel.com"`), Vercel antwortet aber `403 {"code":"forbidden","message":"The request is missing an
  authentication token","missingToken":true}`. Also kommt kein gültiger Bearer-Token an: Wert leer, falscher Header oder fehlendes
  Präfix. Geprüft in dieser Sitzung (8 Versuche über 10 Minuten) und in einer frischen Sitzung (3 Versuche). Korrektur: Token unter
  vercel.com → Account Settings → Tokens neu anlegen (Scope: das Team, dem `circularflowdortmund` gehört), in der Cloud-Umgebung
  „CircularFlow“ → Edit → Network secrets für Host `api.vercel.com` als Header `Authorization`, Präfix `Bearer` speichern.
- Ohne diesen Zugang kann ich Projekteinstellungen weder lesen noch ändern und kein Deployment auslösen. Die Änderungen aus
  Abschnitt 3 sind dann im Dashboard von Hand zu setzen (drei Einstellungen, ein Redeploy).
- Nicht geprüft: die Umleitung `/` → `/plattform/` und die Texterkennung **auf Vercel** (erst nach dem Deployment möglich; dafür
  `abnahme.mjs` und `statisch-pruefen.mjs` mit der Vercel-Adresse aufrufen), echtes Handy, HTTPS-Installation als App.

## 6 Nach dem Deployment (Abnahme auf Vercel)

```sh
node docs/pruefungen/vercel-2026-11-20/werkzeug/abnahme.mjs https://circularflowdortmund.vercel.app/plattform/ docs/pruefungen/vercel-2026-11-20/bilder vercel
node docs/pruefungen/pilotstand-2026-11-19/werkzeug/statisch-pruefen.mjs https://circularflowdortmund.vercel.app/plattform/
```

Erwartet: 18/18 (mit Umleitungsprüfung) bzw. alle statischen Prüfungen bestanden. Ergebnisse hier nachtragen.
