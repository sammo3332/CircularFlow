// Erzeugt aus einer Markdown-Datei ein A4-PDF (pandoc zu HTML, Chromium über Playwright zu PDF).
// Aufruf: node docs/praxistest/pdf-erzeugen.cjs <datei.md> <ausgabe.pdf> [Schriftgröße in pt, Standard 9.5]
// Voraussetzungen: pandoc und Playwright mit Chromium (in der Arbeitsumgebung vorhanden).
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const [eingabe, ausgabe, pt = '9.5'] = process.argv.slice(2);
if (!eingabe || !ausgabe) { console.error('Aufruf: node pdf-erzeugen.cjs <datei.md> <ausgabe.pdf> [pt]'); process.exit(1); }

const css = `
@page { size: A4; margin: 13mm 14mm; }
html { font-family: Arial, "Liberation Sans", sans-serif; font-size: ${pt}pt; line-height: 1.3; color: #1b2420; hyphens: manual; -webkit-hyphens: manual; }
body { margin: 0; max-width: none; padding: 0; hyphens: manual; -webkit-hyphens: manual; overflow-wrap: normal; }
h1 { font-size: 1.7em; margin: 0 0 3pt; color: #0E5546; }
h2 { font-size: 1.15em; margin: 9pt 0 3pt; color: #0E5546; border-bottom: 1px solid #C9CFCB; padding-bottom: 1pt; }
p { margin: 3pt 0 4pt; }
em { color: #55605b; }
table { border-collapse: collapse; width: 100%; margin: 4pt 0 5pt; page-break-inside: avoid; }
th, td { border: 1px solid #C9CFCB; padding: 2.5pt 4pt; text-align: left; vertical-align: top; }
th { background: #E0EEE8; }
ul, ol { margin: 2pt 0 4pt 14pt; padding: 0; }
li { margin: 1pt 0; }
code { font-family: "Liberation Mono", monospace; font-size: 0.9em; }
header#title-block-header { display: none; }
`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pdf-'));
const kopf = path.join(tmp, 'kopf.html');
fs.writeFileSync(kopf, `<style>${css}</style>`);
const html = path.join(tmp, 'seite.html');
execFileSync('pandoc', [eingabe, '-f', 'gfm', '-t', 'html5', '-s', '--metadata', 'lang=de', '--metadata', `pagetitle=${path.basename(eingabe, '.md')}`, '-H', kopf, '-o', html]);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + html, { waitUntil: 'load' });
  await page.pdf({ path: ausgabe, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  const seiten = /Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [ausgabe], { encoding: 'utf8' }))[1];
  console.log(`${ausgabe}: ${seiten} Seite(n)`);
})().catch((e) => { console.error(e); process.exit(1); });
