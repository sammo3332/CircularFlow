import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const target=path.join(root,'vendor');
await fs.mkdir(path.join(target,'core'),{recursive:true});await fs.mkdir(path.join(target,'lang'),{recursive:true});
const pkg=path.dirname(require.resolve('tesseract.js/package.json'));const core=path.dirname(require.resolve('tesseract.js-core/package.json'));
for(const file of ['dist/tesseract.esm.min.js','dist/worker.min.js','dist/tesseract.min.js.LICENSE.txt','dist/worker.min.js.LICENSE.txt','LICENSE.md'])await fs.copyFile(path.join(pkg,file),path.join(target,path.basename(file)));
for(const file of await fs.readdir(core)){if(file.endsWith('.wasm.js')||file==='LICENSE')await fs.copyFile(path.join(core,file),path.join(target,'core',file));}
// Sprachdateien (tessdata_fast, Commit 6572757): deu für deutsche und englische Typenschilder (Umlaute, geprüft am 19.11.2026), eng als Vergleich.
const MODELLE={deu:'19d219bbb6672c869d20a9636c6816a81eb9a71796cb93ebe0cb1530e2cdb22d',eng:'7d4322bd2a7749724879683fc3912cb542f19906c83bcc1a52132556427170b2'};
for(const [sprache,expected] of Object.entries(MODELLE)){
 const modelPath=path.join(target,`lang/${sprache}.traineddata`);
 let model;
 const eigene=process.env[`CF_TESSDATA_${sprache.toUpperCase()}`]||(sprache==='eng'?process.env.CF_TESSDATA_FILE:'');
 if(eigene)model=await fs.readFile(eigene);
 else {
  try{model=await fs.readFile(modelPath);}catch{
   const res=await fetch(`https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/65727574dfcd264acbb0c3e07860e4e9e9b22185/${sprache}.traineddata`);
   if(!res.ok)throw new Error(`Sprachdatei ${sprache} nicht abrufbar: ${res.status}`);model=Buffer.from(await res.arrayBuffer());
  }
 }
 if(crypto.createHash('sha256').update(model).digest('hex')!==expected)throw new Error(`Sprachdatei ${sprache} passt nicht zur geprüften SHA-256-Prüfsumme.`);
 await fs.writeFile(modelPath,model);
}
console.log('Lokale Engine und geprüfte Sprachdateien (deu, eng) bereit. Keine Fotoübertragung nötig.');
