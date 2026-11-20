import {createWorker} from '/home/user/CircularFlow/plattform/etikett-versuch/node_modules/tesseract.js/src/index.js';
import {ausEtikett} from '/home/user/CircularFlow/plattform/etikett-versuch/etikett.mjs';
import {performance} from 'node:perf_hooks';
const dir='/tmp/claude-0/-home-user-CircularFlow/abdce38b-a89c-5699-959f-aeaffcbb39fc/scratchpad/ocr-sprache/';
const fx='/home/user/CircularFlow/plattform/etikett-versuch/fixtures/';
for (const lang of ['eng','deu','deu+eng']) {
  const t0=performance.now();
  const w=await createWorker(lang,1,{langPath:dir+'lang',gzip:false,cacheMethod:'none'});
  await w.setParameters({tessedit_pageseg_mode:'6'});
  const init=Math.round(performance.now()-t0);
  for (const f of [dir+'deutsch.png', fx+'testetikett.png', fx+'testetikett-schief.png']) {
    const t=performance.now(); const {data}=await w.recognize(f); const ms=Math.round(performance.now()-t);
    const r=ausEtikett(data.text,2026);
    console.log(`[${lang}] init ${init} ms · ${f.split('/').pop()} ${ms} ms ·`, Object.fromEntries(Object.entries(r.felder).map(([k,v])=>[k,v.wert||'('+v.status+')'])));
    if (f.endsWith('deutsch.png')) console.log('   roh:', JSON.stringify(data.text.trim()));
  }
  await w.terminate();
}
