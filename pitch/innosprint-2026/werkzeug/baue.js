// Baut die vier Pitch-Decks (A, B, C und P5 = Pitch 5 Minuten) (nur PPTX). Aufruf:
//   NODE_PATH=<pfad zu pptxgenjs>/node_modules node baue.js [A|B|C|P5 ...]  [--aus <Ordner>]
// Standard-Ausgabe: ../ausgabe/<Ordner>/; mit --aus werden alle PPTX in einen Ordner geschrieben.
const path = require("path");
const fs = require("fs");
const B = require("./bausteine");
const { nachbearbeite } = require("./nachbearbeiten");

const DECKS = {
  A: { datei: "CircularFlow_INNOSPRINT2026_Fassung-A_Umbaufall.pptx", ordner: "weitere-fassungen", mod: "./inhalt-a", titel: "CircularFlow INNOSPRINT 2026 · Fassung A · Umbaufall" },
  B: { datei: "CircularFlow_INNOSPRINT2026_Fassung-B_Demo-zuerst.pptx", ordner: "weitere-fassungen", mod: "./inhalt-b", titel: "CircularFlow INNOSPRINT 2026 · Fassung B · Demo zuerst" },
  C: { datei: "CircularFlow_INNOSPRINT2026_Fassung-C_Praxistest-Dortmund.pptx", ordner: "weitere-fassungen", mod: "./inhalt-c", titel: "CircularFlow INNOSPRINT 2026 · Fassung C · Praxistest Dortmund" },
  P5: { datei: "CircularFlow_INNOSPRINT2026_Pitch-5-Minuten.pptx", ordner: "abgabe-5-minuten", mod: "./inhalt-p5", titel: "CircularFlow INNOSPRINT 2026 · Pitch 5 Minuten", p5: true },
};

(async () => {
  const args = process.argv.slice(2);
  const iAus = args.indexOf("--aus");
  const aus = iAus >= 0 ? path.resolve(args[iAus + 1]) : null;
  const wahl = args.filter((a, i) => /^(A|B|C|P5)$/.test(a) && (iAus < 0 || i !== iAus + 1));
  for (const k of wahl.length ? wahl : ["A", "B", "C", "P5"]) {
    const d = DECKS[k];
    const ziel = aus || path.join(__dirname, "..", "ausgabe", d.ordner);
    fs.mkdirSync(ziel, { recursive: true });
    const pres = B.neuesDeck(d.titel, { p5: !!d.p5 });
    const folien = require(d.mod).folien();
    const datei = path.join(ziel, d.datei);
    const r = await B.baue(pres, folien, datei);
    const nb = await nachbearbeite(datei); // R3/R12: Notizen als Absätze, Sprache Deutsch
    const sichtbar = folien.filter((f) => !f.versteckt).length;
    console.log(`${k}: ${datei} (${folien.length} Folien, ${sichtbar} sichtbar, ${folien.length - sichtbar} versteckt; ${nb.notizen} Notizen in Absätze zerlegt)`);
    console.log("   Linknummern:", Object.entries(r.nr).map(([a, b]) => `${a}=${b}`).join(" "));
    if (d.p5) {
      // P5: Wortzahl des Standard-Sprechtexts (Sprechabsätze der sichtbaren Folien ohne Klick-, Zeitdruck-Zeilen) und Summe der Zeitfenster
      // gezählt wird nur Gesprochenes: ohne Klick-/Zeitdruck-Absätze, Kennungen "K1 ·" bis "K4 ·", "Feyrouz:" und die Regieanweisung "Zurück zur Präsentation, Folie 7 ·"
      const sprech = (a) => !/^(Klick:|Bei Zeitdruck:)/.test(a);
      const gesprochen = (a) => a.replace(/^K\d · /, "").replace(/^Feyrouz: /, "").replace(/^Zurück zur Präsentation, Folie 7 · /, "");
      const wz = folien.filter((f) => !f.versteckt).reduce((n, f) => n + f.notiz.absaetze.filter(sprech).reduce((m, a) => m + B.woerter(gesprochen(a)), 0), 0);
      const sek = folien.filter((f) => !f.versteckt).reduce((n, f) => n + f.notiz.zeit.sek, 0), mm = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
      console.log(`   Standard-Sprechtext der sichtbaren Folien: ${wz} Wörter · Summe der Zeitfenster: ${sek} s (${mm(sek)})`);
      continue;
    }
    const sm = B.summen(folien), mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    console.log(`   Summen (s): voll ${sm.voll} (${mmss(sm.voll)}) · etwa 5 Minuten ${sm.min5} (${mmss(sm.min5)}) · etwa 3 Minuten ${sm.min3} (${mmss(sm.min3)})`);
    console.log("   Sprechanteil voll (s):", Object.entries(sm.anteil).sort((a, b) => b[1] - a[1]).map(([p, v]) => `${p} ${v}`).join(", "));
  }
})().catch((e) => { console.error(e); process.exit(1); });
