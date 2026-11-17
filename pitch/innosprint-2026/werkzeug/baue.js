// Baut die drei Pitch-Decks (nur PPTX). Aufruf:
//   NODE_PATH=<pfad zu pptxgenjs>/node_modules node baue.js [A|B|C ...]  [--aus <Ordner>]
// Standard-Ausgabe: ../ausgabe/<Ordner>/; mit --aus werden alle PPTX in einen Ordner geschrieben.
const path = require("path");
const fs = require("fs");
const B = require("./bausteine");

const DECKS = {
  A: { datei: "CircularFlow_INNOSPRINT2026_Fassung-A_Umbaufall.pptx", ordner: "empfohlen-zur-abgabe", mod: "./inhalt-a", titel: "CircularFlow INNOSPRINT 2026 · Fassung A · Umbaufall" },
  B: { datei: "CircularFlow_INNOSPRINT2026_Fassung-B_Demo-zuerst.pptx", ordner: "weitere-fassungen", mod: "./inhalt-b", titel: "CircularFlow INNOSPRINT 2026 · Fassung B · Demo zuerst" },
  C: { datei: "CircularFlow_INNOSPRINT2026_Fassung-C_Praxistest-Dortmund.pptx", ordner: "weitere-fassungen", mod: "./inhalt-c", titel: "CircularFlow INNOSPRINT 2026 · Fassung C · Praxistest Dortmund" },
};

(async () => {
  const args = process.argv.slice(2);
  const iAus = args.indexOf("--aus");
  const aus = iAus >= 0 ? path.resolve(args[iAus + 1]) : null;
  const wahl = args.filter((a, i) => /^[ABC]$/.test(a) && i !== iAus + 1);
  for (const k of wahl.length ? wahl : ["A", "B", "C"]) {
    const d = DECKS[k];
    const ziel = aus || path.join(__dirname, "..", "ausgabe", d.ordner);
    fs.mkdirSync(ziel, { recursive: true });
    const pres = B.neuesDeck(d.titel);
    const folien = require(d.mod).folien();
    const datei = path.join(ziel, d.datei);
    const r = await B.baue(pres, folien, datei);
    const sichtbar = folien.filter((f) => !f.versteckt).length;
    console.log(`${k}: ${datei} (${folien.length} Folien, ${sichtbar} sichtbar, ${folien.length - sichtbar} versteckt)`);
    console.log("   Linknummern:", Object.entries(r.nr).map(([a, b]) => `${a}=${b}`).join(" "));
    console.log("   Sprechdauer sichtbar (s):", r.dauern.filter((_, i) => !folien[i].versteckt).reduce((a, b) => a + b, 0),
      "· Demo E (s):", r.dauern.filter((_, i) => /^E\d/.test(folien[i].id)).reduce((a, b) => a + b, 0));
  }
})().catch((e) => { console.error(e); process.exit(1); });
