#!/bin/bash
# Baut alle drei Pitch-Decks, prüft sie und erzeugt je zwei PDFs (Folien; Sprechtext unter ausgabe/sprechtexte/).
# Aufruf: bash exportiere.sh
# Umgebung (Standardwerte für diese Sitzung, per Umgebungsvariable überschreibbar):
#   PITCH_NODE_PATH  Ordner node_modules mit pptxgenjs 3.12.0
#   SKILL      Ordner der PPTX-Anleitung mit scripts/office/{validate,soffice}.py
set -euo pipefail
HIER="$(cd "$(dirname "$0")" && pwd)"
AUS="$HIER/../ausgabe"
export NODE_PATH="${PITCH_NODE_PATH:-/tmp/claude-0/-home-user-CircularFlow/abdce38b-a89c-5699-959f-aeaffcbb39fc/scratchpad/pitch-tools/node_modules}:${NODE_PATH:-}"
SKILL="${SKILL:-/root/.claude/skills/synced/f3344db3-3b8b-47e1-a86e-4e52d34deb71_ae4ba12a-da81-4210-ae6c-9e30538d0646/pptx}"
export PPTX_SKILL_DIR="$SKILL"
TMP="${TMPDIR_PITCH:-/tmp/claude-0/-home-user-CircularFlow/abdce38b-a89c-5699-959f-aeaffcbb39fc/scratchpad/pitch-bau/export}"
mkdir -p "$TMP" "$AUS/sprechtexte"
# Bildausschnitte der Demo-Folien (D1) neu erzeugen
python3 "$HIER/ausschnitte.py"
# alte Sprechtext-PDFs in den Fassungsordnern entfernen (liegen jetzt unter sprechtexte/)
rm -f "$AUS"/empfohlen-zur-abgabe/*_Sprechtext.pdf "$AUS"/weitere-fassungen/*_Sprechtext.pdf

node "$HIER/baue.js"

DECKS=(
  "empfohlen-zur-abgabe/CircularFlow_INNOSPRINT2026_Fassung-A_Umbaufall"
  "weitere-fassungen/CircularFlow_INNOSPRINT2026_Fassung-B_Demo-zuerst"
  "weitere-fassungen/CircularFlow_INNOSPRINT2026_Fassung-C_Praxistest-Dortmund"
)
FOLIEN='pdf:impress_pdf_Export:{"ExportHiddenSlides":{"type":"boolean","value":"true"}}'
NOTIZEN='pdf:impress_pdf_Export:{"ExportNotesPages":{"type":"boolean","value":"true"},"ExportOnlyNotesPages":{"type":"boolean","value":"true"},"ExportHiddenSlides":{"type":"boolean","value":"true"}}'

for d in "${DECKS[@]}"; do
  PPTX="$AUS/$d.pptx"; ORDNER="$(dirname "$PPTX")"; NAME="$(basename "$d")"
  zip -dq "$PPTX" '*/' >/dev/null 2>&1 || true          # Ordnereinträge entfernen (falls vorhanden)
  python3 "$SKILL/scripts/office/validate.py" "$PPTX"
  python3 -c "import pptx,sys; p=pptx.Presentation(sys.argv[1]); print('python-pptx öffnet:', len(p.slides), 'Folien')" "$PPTX"
  # Folien-PDF (mit versteckten Folien)
  python3 "$SKILL/scripts/office/soffice.py" --headless --convert-to "$FOLIEN" --outdir "$ORDNER" "$PPTX" >/dev/null 2>&1
  # Sprechtext-PDF (Notizenseiten), zuerst in Temp-Ordner, dann umbenennen
  rm -f "$TMP/$NAME.pdf"
  python3 "$SKILL/scripts/office/soffice.py" --headless --convert-to "$NOTIZEN" --outdir "$TMP" "$PPTX" >/dev/null 2>&1
  mv "$TMP/$NAME.pdf" "$AUS/sprechtexte/${NAME}_Sprechtext.pdf"
  echo "$NAME: Folien-PDF $(pdfinfo "$ORDNER/$NAME.pdf" | awk '/Pages/{print $2}') Seiten, Sprechtext-PDF $(pdfinfo "$AUS/sprechtexte/${NAME}_Sprechtext.pdf" | awk '/Pages/{print $2}') Seiten"
done
