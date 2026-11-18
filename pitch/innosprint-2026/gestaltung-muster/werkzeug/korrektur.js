// Vergleicht einen festgehaltenen Stand der Elemente mit dem aktuellen und schreibt die Korrekturbefehle für Canva
// (Text ersetzen, formatieren, Breite, Lage, Bild tauschen, Element löschen).
// Aufruf: node korrektur.js <stand-alt.json> <stand-neu.json> <kennungen.json> <medien.json> <ausgabeordner>
// kennungen.json: { "<foliennummer>": { "seite": "<Seitenkennung>", "elemente": { "<Elementname>": "<LB-Kennung>" } } }
const fs = require('fs'); const path = require('path');
const [altDatei, neuDatei, kennDatei, medienDatei, aus] = process.argv.slice(2);
const lies = (d) => JSON.parse(fs.readFileSync(d, 'utf8'));
const gleich = (a, b) => Math.abs(a - b) < 0.6; // Abweichungen unter einem Pixel sind Rundung und lösen keinen Befehl aus
const alt = lies(altDatei), neu = lies(neuDatei), kenn = lies(kennDatei), medien = lies(medienDatei);
for (const fa of alt) {
  const fn = neu.find((f) => f.nr === fa.nr); const k = kenn[String(fa.nr)]; if (!k) continue;
  const id = (name) => { const v = k.elemente[name]; if (!v) throw new Error(`Kennung fehlt: Folie ${fa.nr}, ${name}`); return `${k.seite}-${v}`; };
  const ops = []; const bericht = [];
  for (const a of fa.elemente) {
    const n = fn.elemente.find((e) => e.name === a.name);
    if (!n) { ops.push({ type: 'delete_element', locator_id: id(a.name) }); bericht.push(`gelöscht: ${a.name}`); continue; }
    const vorher = ops.length;
    if (a.art === 'text') {
      if (a.text !== n.text) ops.push({ type: 'replace_text', locator_id: id(a.name), text: n.text });
      if (a.g !== n.g || a.fett !== n.fett || a.farbe !== n.farbe || a.zh !== n.zh || a.ausr !== n.ausr) ops.push({ type: 'format_text', locator_id: id(a.name), formatting: { font_size: n.g, font_weight: n.fett ? 'bold' : 'normal', color: n.farbe, line_height: n.zh, text_align: n.ausr } });
      if (!gleich(a.w, n.w)) ops.push({ type: 'resize_element', locator_id: id(a.name), width: n.w });
    } else if (a.art === 'bild' && a.datei !== n.datei) {
      const m = medien[n.datei]; if (!m) throw new Error('Medienkennung fehlt: ' + n.datei);
      ops.push({ type: 'update_fill', locator_id: id(a.name), asset_type: 'image', asset_id: m, alt_text: n.alt });
    } else if (a.art !== 'text' && (!gleich(a.w, n.w) || !gleich(a.h, n.h))) throw new Error(`Form oder Bildgröße geändert, bitte neu einfügen: ${a.name}`);
    if (!gleich(a.x, n.x) || !gleich(a.y, n.y)) ops.push({ type: 'position_element', locator_id: id(a.name), top: n.y, left: n.x });
    if (ops.length > vorher) bericht.push(`geändert (${ops.slice(vorher).map((o) => o.type).join(', ')}): ${a.name}`);
  }
  for (const n of fn.elemente) if (!fa.elemente.find((e) => e.name === n.name)) throw new Error(`neues Element, bitte gesondert einfügen: ${n.name}`);
  fs.writeFileSync(path.join(aus, `folie-${fa.nr}-korrektur.json`), JSON.stringify(ops));
  console.error(`Folie ${fa.nr}: ${ops.length} Befehle\n  ` + bericht.join('\n  '));
}
