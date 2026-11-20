// Nachbearbeitung der gebauten PPTX (Korrektur R3 und R12):
//  - Jede Notiz im Platzhalter type="body" wird in einzelne Absätze zerlegt (eine Zeile je <a:p>,
//    leere Zeile als leerer Absatz); die Zeile "Spricht: ..." wird fett.
//  - In allen XML-Teilen wird lang="en-US" (und altLang="en-US") durch de-DE ersetzt.
// Aufruf: node nachbearbeiten.js <datei.pptx> ...   oder als Modul: nachbearbeite(datei)
const fs = require("fs");
const JSZip = require("jszip");

const LANG = "de-DE";

function notizAbsaetze(xml) {
  let anzahl = 0;
  const neu = xml.replace(/<p:sp>(?:(?!<\/p:sp>)[\s\S])*?<p:ph type="body"[\s\S]*?<\/p:sp>/g, (sp) => {
    return sp.replace(/(<a:lstStyle\/>)([\s\S]*?)(<\/p:txBody>)/, (_, ls, inhalt, ende) => {
      // Der Text steht in einem einzigen <a:t> (XML-Escaping bleibt unverändert erhalten).
      const m = inhalt.match(/<a:t>([\s\S]*?)<\/a:t>/);
      if (!m) return _;
      const zeilen = m[1].split(/\r?\n/);
      anzahl++;
      const abs = zeilen.map((z, i) => {
        if (z === "") return `<a:p><a:endParaRPr lang="${LANG}" dirty="0"/></a:p>`;
        const fett = i === 0 && z.startsWith("Spricht:") ? ' b="1"' : "";
        return `<a:p><a:r><a:rPr lang="${LANG}"${fett} dirty="0"/><a:t>${z}</a:t></a:r></a:p>`;
      });
      return ls + abs.join("") + ende;
    });
  });
  return { xml: neu, anzahl };
}

async function nachbearbeite(datei) {
  const zip = await JSZip.loadAsync(fs.readFileSync(datei));
  let notizen = 0;
  for (const name of Object.keys(zip.files)) {
    const f = zip.files[name];
    if (f.dir || !/\.(xml|rels)$/.test(name)) continue;
    let xml = await f.async("string");
    const alt = xml;
    if (/^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(name)) {
      const r = notizAbsaetze(xml);
      xml = r.xml; notizen += r.anzahl;
    }
    xml = xml.replace(/\b(lang|altLang)="en-US"/g, `$1="${LANG}"`);
    if (xml !== alt) zip.file(name, xml);
  }
  const out = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 9 } });
  fs.writeFileSync(datei, out);
  return { notizen };
}

module.exports = { nachbearbeite };
if (require.main === module) {
  (async () => { for (const d of process.argv.slice(2)) console.log(d, await nachbearbeite(d)); })().catch((e) => { console.error(e); process.exit(1); });
}
