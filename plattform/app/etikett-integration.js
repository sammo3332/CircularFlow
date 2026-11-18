import { ausEtikett, gepruefterEntwurf, FELDER } from '../etikett-versuch/etikett.mjs';
export { FELDER };
export function etikettStart(text) {
 const scan=ausEtikett(text);
 return {scan,pruefung:Object.fromEntries(Object.entries(scan.felder).map(([k,v])=>[k,{wert:v.wert,geprueft:false}]))};
}
export function etikettUebernehmen(etikett) {
 if(!etikett)return null;
 if(!Object.values(etikett.pruefung).some(x=>String(x.wert).trim()))return null;
 return {...gepruefterEntwurf(etikett.scan,etikett.pruefung), foto:etikett.foto || null, hinweis:'Etikettangaben am Foto bestätigt. Kein Aufmaß und keine Fachfreigabe.'};
}
export async function etikettLesen(file,log=()=>{}) {
 if(!file||!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>20*1024*1024)throw new Error('Bitte ein JPEG-, PNG- oder WebP-Typenschild bis 20 MB wählen.');
 const {createWorker}=await import('../etikett-versuch/vendor/tesseract.esm.min.js');
 const root=new URL('../etikett-versuch/vendor/',import.meta.url);
 const worker=await createWorker('eng',1,{workerPath:new URL('worker.min.js',root).href,corePath:new URL('core/',root).href,langPath:new URL('lang',root).href,workerBlobURL:false,gzip:false,cacheMethod:'none',logger:log});
 try{await worker.setParameters({tessedit_pageseg_mode:'6'});const {data}=await worker.recognize(file);const ergebnis=etikettStart(data.text); ergebnis.foto=await etikettFoto(file); return ergebnis;}finally{await worker.terminate();}
}

async function etikettFoto(file) {
 const url=URL.createObjectURL(file);
 try {
  const img=await new Promise((ok,fail)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>fail(new Error('Etikettfoto konnte nicht angezeigt werden.'));i.src=url;});
  const scale=Math.min(1,1600/Math.max(img.naturalWidth,img.naturalHeight));
  const canvas=document.createElement('canvas');canvas.width=Math.round(img.naturalWidth*scale);canvas.height=Math.round(img.naturalHeight*scale);
  canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
  return {daten:canvas.toDataURL('image/jpeg',0.9),name:file.name};
 } finally { URL.revokeObjectURL(url); }
}
