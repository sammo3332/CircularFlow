# CircularFlow · Vorprüfung v1.0

Funktionsfähige Browser-Demo für einen simulierten Wiederverwendungsfall. `dist/` enthält die komplette statische Anwendung und kann über einen statischen Webserver ausgeliefert werden. Die Module benötigen HTTP(S). Die Anwendung braucht keine Installation und keinen Anwendungsserver.

## Starten

Vom Repository-Root einen statischen Server für `prototype/dist` starten und die Seite öffnen:

```sh
python3 -m http.server 8000 --directory prototype/dist
```

Dann `http://localhost:8000/` im Browser aufrufen. Der Server wurde mit diesem Befehl gestartet, `index.html` und alle `.mjs`-Module wurden per HTTP ausgeliefert. Eine Bedienprüfung im Browser ist damit nicht belegt.

## Prüfung

Vom Repository-Root:

```sh
node --test prototype/test/rules.test.mjs prototype/test/door.test.mjs
```

Im Verzeichnis `prototype/` (mit `dist/` und `test/`):

```sh
node --test test/rules.test.mjs test/door.test.mjs
```

`rules.test.mjs` prüft die Vorprüfung, `door.test.mjs` die Türsimulation.

## Tür im selben Umbau

Die Karte „Tür im selben Umbau“ (Übersicht oder Seitennavigation) ist eine Simulation mit Beispieldaten. Die Regel steht in `dist/door-rules.mjs`, die Darstellung in `dist/door-view.mjs`. Der Zustand bleibt nur im Arbeitsspeicher und wird nicht gespeichert. Alle Zeitwerte sind Berliner Wanduhrzeiten (Europe/Berlin) und werden ohne Systemuhr und ohne Gerätezeitzone verglichen. Die feste Annahme ist November 2026 (UTC+01:00). Sommerzeitwechsel sind nicht Teil der Simulation.

Die Ergebnisse der Vorprüfung sind „Weiter prüfen“, „Für diese Entscheidung zu spät“ und „Klärung nötig“. Geschätzte Werte sind sichtbar. Eingaben werden lokal im Browser gespeichert. Die Beispieldaten sind fiktiv. Die Fachprüfung und fachliche Freigabe bleiben bei qualifizierten Personen.
