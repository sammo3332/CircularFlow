// Erzeugt je Fassung das Sprechtext-PDF (A4 hoch) aus den Notizen der gebauten PPTX (Korrektur R2/R11).
//  - Text: Notizen der PPTX (jszip), nicht ein zweiter Text
//  - Folienbilder: Folien-PDF der Fassung, pdftoppm -jpeg -r 80
//  - PDF: Chromium über Playwright
//  - Kennung und Abschnitt je Folie: aus den inhalt-Modulen (gleiche Reihenfolge wie in der PPTX)
//  - Selbstprüfung: pdftotext, je Folie erster Satz, letzter Satz und Zeile "Dauer (voll)" im PDF-Text; Exit-Code 1 bei FEHLER
// Aufruf: node sprechtext.js [A|B|C ...]
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const JSZip = require("jszip");
const { chromium } = require("/opt/node-tools/node_modules/playwright");
const B = require("./bausteine");

const AUS = path.join(__dirname, "..", "ausgabe");
const STAND = "Stand 17.11.2026";
const DECKS = {
  A: { name: "CircularFlow_INNOSPRINT2026_Fassung-A_Umbaufall", ordner: "empfohlen-zur-abgabe", mod: "./inhalt-a", fassung: "Fassung A · Umbaufall", klick: "Live-Demo: dazu kommt Klickzeit." },
  B: { name: "CircularFlow_INNOSPRINT2026_Fassung-B_Demo-zuerst", ordner: "weitere-fassungen", mod: "./inhalt-b", fassung: "Fassung B · Demo zuerst", klick: "Live-Demo: dazu kommt Klickzeit." },
  C: { name: "CircularFlow_INNOSPRINT2026_Fassung-C_Praxistest-Dortmund", ordner: "weitere-fassungen", mod: "./inhalt-c", fassung: "Fassung C · Praxistest Dortmund", klick: "Demo-Bilder nur auf Nachfrage." },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const unesc = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, "&");
const norm = (s) => s.normalize("NFKC").replace(/\s+/g, " ").trim();
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Notizen und Sichtbarkeit je Folie in Reihenfolge der Präsentation
async function liesNotizen(pptx) {
  const zip = await JSZip.loadAsync(fs.readFileSync(pptx));
  const txt = (n) => zip.file(n).async("string");
  const pres = await txt("ppt/presentation.xml");
  const prels = await txt("ppt/_rels/presentation.xml.rels");
  const ziel = {};
  for (const m of prels.matchAll(/<Relationship\b[^>]*>/g)) {
    const id = /Id="([^"]+)"/.exec(m[0]), t = /Target="([^"]+)"/.exec(m[0]);
    if (id && t) ziel[id[1]] = t[1];
  }
  const folien = [];
  for (const m of pres.matchAll(/<p:sldId\b[^>]*r:id="([^"]+)"/g)) {
    const slide = "ppt/" + ziel[m[1]].replace(/^\//, "").replace(/^ppt\//, "");
    const sx = await txt(slide);
    const rels = await txt(slide.replace("slides/", "slides/_rels/") + ".rels");
    const nm = /Target="\.\.\/notesSlides\/([^"]+)"/.exec(rels);
    if (!nm) throw new Error("Keine Notiz zu " + slide);
    const nx = await txt("ppt/notesSlides/" + nm[1]);
    const sp = nx.match(/<p:sp>(?:(?!<\/p:sp>)[\s\S])*?<p:ph type="body"[\s\S]*?<\/p:sp>/);
    if (!sp) throw new Error("Kein Notizplatzhalter in " + nm[1]);
    const absaetze = [...sp[0].matchAll(/<a:p>([\s\S]*?)<\/a:p>/g)].map((p) => unesc([...p[1].matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map((t) => t[1]).join("")));
    folien.push({ versteckt: /<p:sld\b[^>]*show="0"/.test(sx), absaetze });
  }
  return folien;
}

function saetze(text) {
  return text.split(/(?<!\d)(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
}

function htmlFuerDeck(d, folien, meta, bilder, sm) {
  const css = `
@page { size: A4; margin: 14mm 15mm; }
html { font-family: Arial, "Liberation Sans", sans-serif; hyphens: manual; -webkit-hyphens: manual; color: #17201D; }
body { margin: 0; font-size: 11.5pt; line-height: 1.42; }
section { break-before: page; page-break-before: always; }
section.deckblatt { break-before: auto; page-break-before: auto; }
h1 { font-size: 22pt; margin: 0 0 4pt; color: #0E5546; }
h2.kopf { font-size: 12.5pt; margin: 0 0 6pt; padding: 5pt 8pt; background: #E0EEE8; color: #0E5546; border-left: 4pt solid #0E5546; break-after: avoid; page-break-after: avoid; }
h2.kopf .aus { color: #7D4C00; font-weight: bold; }
img.folie { display: block; width: 100%; border: 1pt solid #C9CFCB; margin: 0 0 8pt; break-inside: avoid; }
p { margin: 0 0 7pt; orphans: 3; widows: 3; }
p.sprecher { font-weight: bold; }
p.dauer { font-size: 11pt; color: #3F4A45; margin-top: 4pt; }
.kasten { border: 1pt solid #C9CFCB; border-left-width: 4pt; padding: 5pt 8pt 1pt; margin: 0 0 7pt; font-size: 11pt; break-inside: avoid; page-break-inside: avoid; }
.kasten.klick { background: #E4ECF8; border-color: #1F4F96; }
.kasten.m5 { background: #FBECD0; border-color: #7D4C00; }
.kasten.m3 { background: #F5EECB; border-color: #594810; }
.kasten b { display: inline-block; margin-right: 2pt; }
table { border-collapse: collapse; margin: 10pt 0; font-size: 12pt; }
th, td { border: 1pt solid #C9CFCB; padding: 6pt 12pt; text-align: left; }
th { background: #E0EEE8; }
td.z { text-align: right; }
.hinweis { margin-top: 14pt; padding: 8pt 10pt; background: #F2F3F0; border: 1pt solid #ECEEE9; }
.klein { color: #3F4A45; }`;
  const teile = [];
  const anteil = Object.entries(sm.anteil).sort((a, b) => b[1] - a[1]).map(([p, v]) => `${esc(p)} ${v} s`).join(", ");
  teile.push(`<section class="deckblatt"><h1>Sprechtext · ${esc(d.fassung)}</h1>
<p class="klein">CircularFlow · INNOSPRINT Zirkuläres Bauen · Dortmund · 20.11.2026</p>
<p><b>${STAND}</b></p>
<table><tr><th>Stufe</th><th>Sekunden</th><th>Minuten</th></tr>
<tr><td>voll</td><td class="z">${sm.voll}</td><td class="z">${mmss(sm.voll)}</td></tr>
<tr><td>etwa 5 Minuten</td><td class="z">${sm.min5}</td><td class="z">${mmss(sm.min5)}</td></tr>
<tr><td>etwa 3 Minuten</td><td class="z">${sm.min3}</td><td class="z">${mmss(sm.min3)}</td></tr></table>
<p class="klein">${esc(d.klick)}</p>
<p><b>Sprechanteil (voll):</b> ${anteil}</p>
<div class="hinweis">Zeiten sind Schätzungen aus Wortzahlen (2,3 Wörter/s); Probe mit Stoppuhr steht aus.</div></section>`);
  folien.forEach((f, i) => {
    const m = meta[i];
    const dauerZeile = f.absaetze.find((a) => a.startsWith("Dauer (voll):")) || "";
    const dm = /(\d+)/.exec(dauerZeile);
    const ausg = f.versteckt ? ` · <span class="aus">ausgeblendet: ${m.abschnitt === "Demo" ? "Ersatzfolie" : "Anhang"}</span>` : "";
    const sprecher = (f.absaetze[0] || "").replace(/^Spricht:\s*/, "");
    let html = `<section><h2 class="kopf">Folie ${i + 1} · ${esc(m.id)} · Spricht: ${esc(sprecher)} · etwa ${dm ? dm[1] : "?"} s${ausg}</h2>`;
    html += `<img class="folie" alt="Folie ${i + 1}" src="data:image/jpeg;base64,${bilder[i].toString("base64")}">`;
    f.absaetze.forEach((a, j) => {
      if (a === "") return;
      if (j === 0) html += `<p class="sprecher">${esc(a)}</p>`;
      else if (a.startsWith("Klick:")) html += `<div class="kasten klick"><p><b>Klick:</b>${esc(a.slice(6))}</p></div>`;
      else if (a.startsWith("Bei 5 Minuten:")) html += `<div class="kasten m5"><p><b>Bei 5 Minuten:</b>${esc(a.slice(14))}</p></div>`;
      else if (a.startsWith("Bei 3 Minuten:")) html += `<div class="kasten m3"><p><b>Bei 3 Minuten:</b>${esc(a.slice(14))}</p></div>`;
      else if (a.startsWith("Dauer (voll):")) html += `<p class="dauer">${esc(a)}</p>`;
      else html += `<p>${esc(a)}</p>`;
    });
    teile.push(html + "</section>");
  });
  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><title>Sprechtext ${esc(d.fassung)}</title><style>${css}</style></head><body>${teile.join("\n")}</body></html>`;
}

// Selbstprüfung: gibt Liste { nr, id, ok, fehlt[] } zurück
function pruefe(pdf, folien, meta) {
  const text = norm(execFileSync("pdftotext", [pdf, "-"], { encoding: "utf8", maxBuffer: 1 << 28 }));
  const marken = folien.map((_, i) => ({ i, pos: text.indexOf(norm(`Folie ${i + 1} · ${meta[i].id} · Spricht:`)) }));
  const ergebnis = [];
  folien.forEach((f, i) => {
    const von = marken[i].pos;
    const bis = i + 1 < folien.length ? marken[i + 1].pos : text.length;
    const fehlt = [];
    if (von < 0) fehlt.push("Kopfzeile");
    const abschnitt = von < 0 ? "" : text.slice(von, bis);
    const inhalt = f.absaetze.filter((a) => a !== "");
    const volltext = inhalt.find((a, j) => j > 0 && !/^(Klick:|Bei 5 Minuten:|Bei 3 Minuten:|Dauer \(voll\):)/.test(a)) || "";
    const letzte = inhalt.filter((a) => !a.startsWith("Dauer (voll):")).pop() || "";
    const erster = saetze(volltext)[0], letzterVoll = saetze(volltext).pop(), letzterNotiz = saetze(letzte).pop();
    const dauer = inhalt.find((a) => a.startsWith("Dauer (voll):"));
    for (const [was, s] of [["erster Satz", erster], ["letzter Satz", letzterVoll], ["letzter Satz der Notiz", letzterNotiz], ["Dauer", dauer]]) {
      if (!s || !abschnitt.includes(norm(s))) fehlt.push(was);
    }
    ergebnis.push({ nr: i + 1, id: meta[i].id, ok: fehlt.length === 0, fehlt });
  });
  return ergebnis;
}

(async () => {
  const wahl = process.argv.slice(2).filter((a) => /^[ABC]$/.test(a));
  const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR_PITCH || os.tmpdir(), "sprechtext-"));
  fs.mkdirSync(path.join(AUS, "sprechtexte"), { recursive: true });
  const browser = await chromium.launch();
  let fehler = 0;
  try {
    for (const k of wahl.length ? wahl : ["A", "B", "C"]) {
      const d = DECKS[k];
      const pptx = path.join(AUS, d.ordner, d.name + ".pptx"), folienPdf = path.join(AUS, d.ordner, d.name + ".pdf");
      const folien = await liesNotizen(pptx);
      const inhalt = require(d.mod).folien();
      if (inhalt.length !== folien.length) throw new Error(`${k}: ${inhalt.length} Folien im Inhaltsmodul, ${folien.length} in der PPTX`);
      const meta = inhalt.map((f) => ({ id: f.id, abschnitt: f.abschnitt }));
      const sm = B.summen(inhalt);
      const bd = path.join(tmp, k); fs.mkdirSync(bd);
      execFileSync("pdftoppm", ["-jpeg", "-r", "80", folienPdf, path.join(bd, "f")]);
      const dateien = fs.readdirSync(bd).filter((n) => n.endsWith(".jpg")).sort();
      if (dateien.length !== folien.length) throw new Error(`${k}: ${dateien.length} Folienbilder, ${folien.length} Folien`);
      const bilder = dateien.map((n) => fs.readFileSync(path.join(bd, n)));
      const html = htmlFuerDeck(d, folien, meta, bilder, sm);
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load" });
      const ziel = path.join(AUS, "sprechtexte", `${d.name}_Sprechtext.pdf`);
      await page.pdf({ path: ziel, format: "A4", printBackground: true });
      await page.close();
      const seiten = /Pages:\s+(\d+)/.exec(execFileSync("pdfinfo", [ziel], { encoding: "utf8" }))[1];
      console.log(`${k}: ${path.basename(ziel)} (${seiten} Seiten)`);
      for (const r of pruefe(ziel, folien, meta)) {
        console.log(`   Folie ${r.nr} (${r.id}): ${r.ok ? "OK" : "FEHLER, fehlt: " + r.fehlt.join(", ")}`);
        if (!r.ok) fehler++;
      }
    }
  } finally {
    await browser.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  if (fehler) { console.error(`Selbstprüfung: ${fehler} Folie(n) mit FEHLER`); process.exit(1); }
  console.log("Selbstprüfung Sprechtext: alle Folien OK");
})().catch((e) => { console.error(e); process.exit(1); });
