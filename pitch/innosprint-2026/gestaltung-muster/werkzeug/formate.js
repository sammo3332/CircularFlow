// Schreibt die Formatbefehle für die Texte einer Folie. Die Kennungen kommen in der Reihenfolge des Einfügens
// aus der Antwort von Canva.  Aufruf: node formate.js <canva-ordner> <foliennummer> <seitenkennung> <kennung,kennung,...>
const fs = require('fs'); const path = require('path');
const [dir, nr, seite, liste] = process.argv.slice(2);
const texte = JSON.parse(fs.readFileSync(path.join(dir, `folie-${nr}-texte.json`), 'utf8')); const ids = liste.split(',');
if (ids.length !== texte.length) throw new Error(`Anzahl passt nicht: ${ids.length} Kennungen, ${texte.length} Texte`);
if (new Set(ids).size !== ids.length) throw new Error('doppelte Kennung');
const ops = texte.map((t, i) => ({ type: 'format_text', locator_id: `${seite}-${ids[i]}`, formatting: t.formatting }));
fs.writeFileSync(path.join(dir, `folie-${nr}-format.json`), JSON.stringify(ops));
fs.writeFileSync(path.join(dir, `folie-${nr}-kennungen.json`), JSON.stringify(texte.map((t, i) => ({ name: t.name, kennung: `${seite}-${ids[i]}`, text: t.text })), null, 1));
texte.forEach((t, i) => console.error(`${ids[i]}  ${t.name}: ${t.text.slice(0, 40).replace(/\n/g, ' / ')}`));
console.log(JSON.stringify(ops));
