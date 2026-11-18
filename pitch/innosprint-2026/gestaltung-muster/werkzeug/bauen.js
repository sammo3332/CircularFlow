// Baut die drei Musterfolien.
//   node bauen.js vorschau <ausgabeordner> <karte.json> <karte.png>   Grafiken schreiben, lokale Vorschau rendern
//   node bauen.js canva <ausgabeordner> <karte.json> <karte.png> <medien.json> <seiten.json>   Befehle für Canva schreiben
// Die lokale Vorschau bildet die Canva-Folie nach (gleiche Maße, gleiche Zeichenbreiten); maßgeblich ist der Canva-Export.
const fs = require('fs');
const path = require('path');
const { GRUNDLINIE } = require('./basis');
const { grafiken } = require('./grafiken');
const { folie1, folie2, folie3 } = require('./folien');

const [modus, aus, karteJson, kartePng, medienJson, seitenJson] = process.argv.slice(2);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pngMasse = (datei) => { const b = fs.readFileSync(datei); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; };

function folien() {
  const k = JSON.parse(fs.readFileSync(karteJson, 'utf8')).mess;
  k.bild = pngMasse(kartePng);
  return [folie1(), folie2(), folie3(k)];
}
function schreibeGrafiken() {
  const dir = path.join(aus, 'grafiken'); fs.mkdirSync(dir, { recursive: true });
  for (const [name, f] of Object.entries(grafiken)) fs.writeFileSync(path.join(dir, name + '.svg'), f());
  // Die Aufnahme wird als SVG-Hülle mit eingebettetem PNG eingesetzt: Gewöhnliche PNG-Bilder zeichnet Canva im Export
  // weich (Schärfemaß 512 bis 665 gegenüber 1317 mit Hülle und 1453 im Original, gemessen am 18.11.2026).
  fs.copyFileSync(kartePng, path.join(dir, 'karte-k4.png'));
  const m = pngMasse(kartePng);
  fs.writeFileSync(path.join(dir, 'karte-k4.svg'), `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${m.w} ${m.h}" width="${m.w}" height="${m.h}"><image width="${m.w}" height="${m.h}" href="data:image/png;base64,${fs.readFileSync(kartePng).toString('base64')}"/></svg>\n`);
  return dir;
}
function pruefe(f) {
  const hinweise = [];
  for (const el of f.elemente) {
    const rechts = el.x + el.w, unten = el.art === 'text' ? el.y + el.zeilen * el.g * el.zh : el.y + el.h;
    if (el.x < 0 || rechts > 1920 || el.y < 0 || unten > 1080) hinweise.push(`außerhalb der Folie: ${el.name} (x ${el.x} bis ${Math.round(rechts)}, y ${el.y} bis ${Math.round(unten)})`);
    if (el.art === 'text' && el.g < 20) hinweise.push(`Schrift unter 20 px: ${el.name}`);
  }
  return hinweise;
}
function zwillingSvg(f, dir) {
  let s = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="1920" height="1080" fill="${f.hintergrund}"/>`;
  for (const el of f.elemente) {
    if (el.art === 'form') {
      const fuell = el.farbe ? `fill="${el.farbe}"` : 'fill="none"';
      const rand = el.rand ? ` stroke="${el.rand.farbe}" stroke-width="${el.rand.staerke}"` : '';
      const inhalt = el.zwilling || `<path d="${el.d}" ${fuell}${rand}/>`;
      s += `<svg x="${el.x}" y="${el.y}" width="${el.w}" height="${el.h}" viewBox="0 0 ${el.w} ${el.h}" preserveAspectRatio="none" overflow="visible"${el.deck !== undefined ? ` opacity="${el.deck}"` : ''}>${inhalt}</svg>`;
    } else if (el.art === 'bild') {
      s += `<image href="file://${path.join(dir, el.datei)}" x="${el.x}" y="${el.y}" width="${el.w}" height="${el.h}" preserveAspectRatio="none"/>`;
    } else {
      const ax = el.ausr === 'start' ? el.x : el.ausr === 'center' ? el.x + el.w / 2 : el.x + el.w;
      const anker = el.ausr === 'start' ? 'start' : el.ausr === 'center' ? 'middle' : 'end';
      el.text.split('\n').forEach((z, i) => { s += `<text x="${ax}" y="${el.y + GRUNDLINIE * el.g + i * el.zh * el.g}" font-family="Liberation Sans" font-size="${el.g}" font-weight="${el.fett ? 700 : 400}" fill="${el.farbe}" text-anchor="${anker}" xml:space="preserve">${esc(z)}</text>`; });
    }
  }
  return s + '</svg>';
}

(async () => {
  const fl = folien();
  if (modus === 'vorschau') {
    const dir = schreibeGrafiken(); const zdir = path.join(aus, 'vorschau-lokal'); fs.mkdirSync(zdir, { recursive: true });
    const { chromium } = require('playwright');
    const browser = await chromium.launch();
    for (const skal of [1]) {
      const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: skal });
      for (const f of fl) {
        const html = path.join(zdir, `folie-${f.nr}.html`);
        fs.writeFileSync(html, `<!doctype html><meta charset="utf-8"><body style="margin:0">${zwillingSvg(f, dir)}</body>`);
        await page.goto('file://' + html); await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: path.join(zdir, `folie-${f.nr}.png`) });
        const h = pruefe(f); const texte = f.elemente.filter((e) => e.art === 'text');
        console.log(`Folie ${f.nr}: ${f.elemente.length} Elemente (${texte.length} Texte, ${f.elemente.filter((e) => e.art === 'bild').length} Bilder, ${f.elemente.filter((e) => e.art === 'form').length} Formen); kleinste Schrift ${Math.min(...texte.map((t) => t.g))} px; Wörter sichtbar: ${texte.map((t) => t.text).join(' ').split(/\s+/).filter((w) => /[A-Za-zÄÖÜäöü0-9]/.test(w)).length}${h.length ? '\n  ' + h.join('\n  ') : ''}`);
      }
      await page.close();
    }
    await browser.close();
  } else if (modus === 'canva') {
    const medien = JSON.parse(fs.readFileSync(medienJson, 'utf8')); const seiten = JSON.parse(fs.readFileSync(seitenJson, 'utf8'));
    const cdir = path.join(aus, 'canva'); fs.mkdirSync(cdir, { recursive: true });
    for (const f of fl) {
      const seite = seiten[String(f.nr)]; if (!seite) throw new Error('Seitenkennung fehlt für Folie ' + f.nr);
      const ops = [];
      for (const el of f.elemente) {
        if (el.art === 'form') {
          const o = { type: 'insert_shape', page_id: seite, top: el.y, left: el.x, width: el.w, height: el.h, path: el.d, view_box_width: el.w, view_box_height: el.h };
          if (el.farbe) o.color = el.farbe; if (el.rand) { o.stroke_color = el.rand.farbe; o.stroke_weight = el.rand.staerke; }
          if (el.deck !== undefined) o.opacity = el.deck; if (el.ecken) o.corner_rounding = el.ecken;
          ops.push(o);
        } else if (el.art === 'bild') {
          const id = medien[el.datei]; if (!id) throw new Error('Medienkennung fehlt: ' + el.datei);
          ops.push({ type: 'insert_fill', page_id: seite, asset_type: 'image', asset_id: id, alt_text: el.alt, left: el.x, top: el.y, width: el.w, height: el.h });
        } else ops.push({ type: 'add_text', page_id: seite, text: el.text, top: el.y, left: el.x, width: el.w });
      }
      ops.push({ type: 'replace_speaker_notes', page_id: seite, notes: f.notiz });
      fs.writeFileSync(path.join(cdir, `folie-${f.nr}-einfuegen.json`), JSON.stringify(ops));
      const texte = f.elemente.filter((e) => e.art === 'text').map((t) => ({ name: t.name, text: t.text, formatting: { font_size: t.g, font_weight: t.fett ? 'bold' : 'normal', color: t.farbe, line_height: t.zh, text_align: t.ausr } }));
      fs.writeFileSync(path.join(cdir, `folie-${f.nr}-texte.json`), JSON.stringify(texte, null, 1));
      console.log(`Folie ${f.nr}: ${ops.length} Befehle, ${JSON.stringify(ops).length} Zeichen, ${texte.length} Texte`);
    }
  } else if (modus === 'stand') {
    // hält den Stand der Elemente fest (Grundlage für spätere Korrekturbefehle)
    fs.writeFileSync(path.join(aus, medienJson || 'stand.json'), JSON.stringify(fl.map((f) => ({ nr: f.nr, elemente: f.elemente.map(({ zwilling, ...e }) => e) })), null, 1));
    console.log('Stand geschrieben');
  } else throw new Error('Modus vorschau, canva oder stand');
})().catch((e) => { console.error(e); process.exit(1); });
