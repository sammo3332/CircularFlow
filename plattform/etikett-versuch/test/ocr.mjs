import fs from 'node:fs/promises';import {performance} from 'node:perf_hooks';import assert from 'node:assert/strict';
import {createWorker} from 'tesseract.js';import {ausEtikett} from '../etikett.mjs';
const root=new URL('../',import.meta.url),start=performance.now();
const worker=await createWorker('eng',1,{langPath:new URL('vendor/lang/',root).pathname,gzip:false,cacheMethod:'none'});
const initialisierungMs=Math.round(performance.now()-start),cases=[];
try{
 await worker.setParameters({tessedit_pageseg_mode:'6'});
 for(const file of ['testetikett.png','testetikett-schief.png','leer.png']){
  const t=performance.now();const {data}=await worker.recognize(new URL('fixtures/'+file,root).pathname);const r=ausEtikett(data.text,2026);
  if(file==='testetikett.png'){assert.equal(r.felder.hersteller.wert,'MUSTERWERK');assert.equal(r.felder.modell.wert,'TUER-17');assert.equal(r.felder.seriennummer.wert,'CF-2026-001');assert.equal(r.felder.baujahr.wert,'2020');}
  if(file==='leer.png')assert.ok(Object.values(r.felder).every(x=>x.status==='fehlt'));
  assert.ok(!('breite'in r.felder));assert.ok(!('brandschutz'in r.felder));
  cases.push({datei:file,synthetisch:true,ocrMs:Math.round(performance.now()-t),rohtext:data.text,felder:r.felder,hinweise:r.hinweise});
 }
}finally{await worker.terminate();}
const result={datum:'2026-11-18',engine:'Tesseract.js 7.0.0 / LSTM / eng',ausfuehrung:'Node.js, lokale CPU; kein Smartphone- oder Browsernachweis',initialisierungMs,faelle:cases,grenze:'Synthetische Funktionsprüfung. Keine Aussage zur Erkennungsrate an echten Bauteilen oder zur Zeitersparnis.'};
await fs.writeFile(new URL('test-ergebnis.json',root),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
