#!/usr/bin/env bash
# Lädt eine Datei über eine einmalige Canva-Upload-Adresse hoch und trägt die Medienkennung in medien.json ein.
# Aufruf: canva-hochladen.sh <medien.json> <datei> <upload-url>
set -euo pipefail
medien="$1"; datei="$2"; url="$3"; antwort="$(mktemp)"
code=$(curl -sS -m 180 -o "$antwort" -w "%{http_code}" -X POST -H "Content-Type: application/octet-stream" --data-binary @"$datei" "$url") || { echo "curl-Fehler: $(basename "$datei")"; exit 1; }
node -e '
const fs = require("fs"); const [medien, datei, antwort, code] = process.argv.slice(1);
const a = fs.readFileSync(antwort, "utf8"); let id = null; try { id = JSON.parse(a).mediaId; } catch (e) {}
if (code !== "201" || !id) { console.log(`FEHLER HTTP ${code} · ${require("path").basename(datei)} · ${a.slice(0, 200)}`); process.exit(2); }
const m = fs.existsSync(medien) ? JSON.parse(fs.readFileSync(medien, "utf8")) : {}; m[require("path").basename(datei)] = id;
fs.writeFileSync(medien, JSON.stringify(m, null, 1)); console.log(`HTTP ${code} · ${require("path").basename(datei)} · ${id}`);' "$medien" "$datei" "$antwort" "$code"
rm -f "$antwort"
