// Misst die Zeichenbreiten von Liberation Sans (metrikgleich zu Arial/Arimo) und schreibt sie als Tabelle.
// Aufruf: node schriftbreiten.js <ausgabe.json>
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const aus = process.argv[2];
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent('<canvas id="c"></canvas>');
  const zeichen = []; for (let i = 32; i < 256; i++) if (i < 127 || i > 160) zeichen.push(String.fromCharCode(i));
  '„“”‚‘’–—·›‹→←↓↑≈×²³€…•✓°'.split('').forEach((z) => zeichen.push(z));
  const tab = await page.evaluate((zs) => {
    const ctx = document.getElementById('c').getContext('2d'); const r = { normal: {}, bold: {} };
    for (const g of ['normal', 'bold']) { ctx.font = `${g} 1000px "Liberation Sans"`; for (const z of zs) r[g][z] = Math.round(ctx.measureText(z).width); }
    ctx.font = 'bold 100px "Liberation Sans"'; r.probe = { 'Hamburgefonstiv 182,8 Mio. t (fett 100)': ctx.measureText('Hamburgefonstiv 182,8 Mio. t').width };
    ctx.font = 'normal 100px "Liberation Sans"'; r.probe['Hamburgefonstiv 182,8 Mio. t (normal 100)'] = ctx.measureText('Hamburgefonstiv 182,8 Mio. t').width;
    return r;
  }, zeichen);
  fs.writeFileSync(aus, JSON.stringify(tab));
  console.log(JSON.stringify(tab.probe), 'Zeichen:', Object.keys(tab.normal).length, 'a:', tab.normal.a, tab.bold.a, 'W:', tab.normal.W, 'Leer:', tab.normal[' ']);
  await browser.close();
})();
