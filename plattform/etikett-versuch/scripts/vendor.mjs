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
const modelPath=path.join(target,'lang/eng.traineddata');
const expected='7d4322bd2a7749724879683fc3912cb542f19906c83bcc1a52132556427170b2';
let model;
if(process.env.CF_TESSDATA_FILE)model=await fs.readFile(process.env.CF_TESSDATA_FILE);
else {
 try{model=await fs.readFile(modelPath);}catch{
  const res=await fetch('https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/65727574dfcd264acbb0c3e07860e4e9e9b22185/eng.traineddata');
  if(!res.ok)throw new Error(`Sprachdatei nicht abrufbar: ${res.status}`);model=Buffer.from(await res.arrayBuffer());
 }
}
if(crypto.createHash('sha256').update(model).digest('hex')!==expected)throw new Error('Sprachdatei passt nicht zur geprüften SHA-256-Prüfsumme.');
await fs.writeFile(modelPath,model);
console.log('Lokale Engine und geprüfte englische Sprachdatei bereit. Keine Fotoübertragung nötig.');
