import {createWorker} from './vendor/tesseract.esm.min.js';
import {FELDER,ausEtikett,gepruefterEntwurf} from './etikett.mjs';
const $=id=>document.getElementById(id);
const KEY='circularflow-etikett-versuch-v1';
let photo=null,scan=null,worker=null,busy=false,photoURL=null,testdaten=false;
const controlled=['photo','fixture','scan','export'];
function fehler(message=''){$('error').textContent=message;$('error').hidden=!message;}
function setBusy(value){busy=value;for(const id of controlled)$(id).disabled=value||(id==='scan'&&!photo);$('form').querySelector('button[type=submit]').disabled=value;}
function clearResult(){scan=null;$('result').hidden=true;$('fields').replaceChildren();$('raw').textContent='';}
async function setPhoto(file,isFixture=false){
 if(busy)return;
 fehler();clearResult();photo=null;$('scan').disabled=true;$('preview').hidden=true;$('origin').textContent='';
 if(photoURL){URL.revokeObjectURL(photoURL);photoURL=null;}
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Bitte ein JPEG-, PNG- oder WebP-Foto wählen.');
 if(file.size>20*1024*1024)throw new Error('Das Foto ist größer als 20 MB. Bitte eine kleinere Aufnahme wählen.');
 const bitmap=await createImageBitmap(file);
 const pixels=bitmap.width*bitmap.height;bitmap.close();
 if(pixels>24000000)throw new Error('Das Foto hat mehr als 24 Megapixel. Bitte mit geringerer Auflösung aufnehmen.');
 photo=file;testdaten=isFixture;photoURL=URL.createObjectURL(file);$('preview').src=photoURL;$('preview').hidden=false;
 $('origin').textContent=isFixture?'Synthetisches Testetikett. Kein Foto eines echten Bauteils.':`Ausgewählte Aufnahme: ${file.name}`;
 $('scan').disabled=false;$('progress').textContent='Foto bereit. Jetzt Etikett auslesen.';
}
$('photo').addEventListener('change',async e=>{try{if(e.target.files[0])await setPhoto(e.target.files[0]);}catch(e){fehler(e.message);}});
$('fixture').addEventListener('click',async()=>{try{const res=await fetch('./fixtures/testetikett.png');if(!res.ok)throw new Error('Das Testetikett ist nicht verfügbar.');await setPhoto(new File([await res.blob()],'synthetisches-testetikett.png',{type:'image/png'}),true);}catch(e){fehler(e.message);}});

function fields(result){
 $('fields').replaceChildren();
 for(const [key,label]of Object.entries(FELDER)){
  const v=result.felder[key],box=document.createElement('div');box.className='field';
  const lab=document.createElement('label');lab.htmlFor='value-'+key;lab.textContent=label;
  const inp=document.createElement('input');inp.type='text';inp.id='value-'+key;inp.maxLength=120;inp.value=v.wert;inp.autocomplete='off';if(key==='baujahr')inp.inputMode='numeric';
  const state=document.createElement('p');state.className='state';state.textContent=v.status==='vorgeschlagen'?'Vorschlag aus dem Etikett, noch nicht geprüft.':v.status==='uneindeutig'?'Uneindeutig. Bitte am Foto ablesen und manuell eintragen.':'Nicht erkannt. Kann leer bleiben oder am Foto ergänzt werden.';
  const checkLabel=document.createElement('label');checkLabel.className='check';
  const check=document.createElement('input');check.type='checkbox';check.id='checked-'+key;check.disabled=!v.wert;
  checkLabel.append(check,document.createTextNode('Am Foto geprüft und bestätigt'));
  inp.addEventListener('input',()=>{check.checked=false;check.disabled=!inp.value.trim();});
  box.append(lab,inp,state,checkLabel);$('fields').append(box);
 }
 $('hints').replaceChildren();for(const h of result.hinweise){const li=document.createElement('li');li.textContent=h;$('hints').append(li);}
 $('raw').textContent=result.rohtext||'Kein Text erkannt.';$('result').hidden=false;
}

$('scan').addEventListener('click',async()=>{
 if(busy||!photo)return;
 setBusy(true);fehler();clearResult();$('progress').textContent='Texterkennung wird vorbereitet …';const start=performance.now();const currentPhoto=photo;let timer,expired=false;
 try{
  const run=async()=>{
   if(!worker){const initialized=await createWorker('eng',1,{workerPath:new URL('./vendor/worker.min.js',import.meta.url).href,corePath:new URL('./vendor/core/',import.meta.url).href,langPath:new URL('./vendor/lang',import.meta.url).href,gzip:false,cacheMethod:'none',workerBlobURL:false,logger:m=>{if(!expired&&m.status==='recognizing text')$('progress').textContent=`Etikett wird gelesen … ${Math.round(m.progress*100)} %`;}});if(expired){await initialized.terminate();throw new Error('Abgebrochen.');}worker=initialized;}
   await worker.setParameters({tessedit_pageseg_mode:'6'});
   return worker.recognize(currentPhoto);
  };
  const response=await Promise.race([run(),new Promise((_,reject)=>{timer=setTimeout(()=>{expired=true;reject(new Error('Die Texterkennung dauert zu lange. Bitte erneut mit einer nahen, scharfen Aufnahme versuchen.'));},45000);})]);
  scan=ausEtikett(response.data.text);fields(scan);$('progress').textContent='Texterkennung abgeschlossen. Vorschläge am Foto prüfen.';
  $('duration').textContent=`OCR-Dauer dieser Aufnahme: ${((performance.now()-start)/1000).toFixed(1)} s einschließlich nötigem Laden. Das ist keine gemessene Zeitersparnis gegenüber manueller Erfassung. Umlaute und undeutliche Zeichen besonders prüfen.`;
 }catch(e){if(worker){await worker.terminate();worker=null;}fehler(e.message||'Texterkennung fehlgeschlagen. Bitte erneut versuchen.');$('progress').textContent='Keine Angaben übernommen.';clearResult();}
 finally{clearTimeout(timer);setBusy(false);}
});

function record(){
 if(!scan)throw new Error('Bitte zuerst ein Etikett auslesen.');
 const review=Object.fromEntries(Object.keys(FELDER).map(k=>[k,{wert:$('value-'+k).value,geprueft:$('checked-'+k).checked}]));
 return {...gepruefterEntwurf(scan,review),testdaten,quelleBildname:photo?.name??'',id:crypto.randomUUID?.()??String(Date.now())};
}
function load(){const value=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(value))throw new Error('Gespeicherte Etikettentwürfe sind nicht lesbar.');return value.filter(x=>x?.schema==='cf-etikett-entwurf-v1').slice(-10);}
function showSaved(){
 $('saved').replaceChildren();
 try{const data=load();for(const r of data){const li=document.createElement('li');li.textContent=`${r.testdaten?'Testetikett · ':''}${Object.entries(r.felder).map(([k,v])=>`${FELDER[k]??k}: ${String(v.wert)}`).join(' · ')}`;$('saved').append(li);}
 if(!data.length){const li=document.createElement('li');li.textContent='Noch keine geprüften Etikettentwürfe gespeichert.';$('saved').append(li);}}
 catch(e){$('saved-status').textContent=e.message;}
}
$('form').addEventListener('submit',e=>{e.preventDefault();if(busy)return;fehler();try{const r=record();const data=load();if(data.length>=10)throw new Error('Hier sind bereits zehn Entwürfe gespeichert. Vor dem Löschen benötigte Entwürfe exportieren.');data.push(r);localStorage.setItem(KEY,JSON.stringify(data));showSaved();$('saved-status').textContent='Geprüfter Entwurf in diesem Browser gespeichert. Noch nicht in den CircularFlow-Bestand übernommen.';}catch(e){fehler(e.message);}});
$('export').addEventListener('click',()=>{if(busy)return;fehler();try{const r=record();download(r,`circularflow-etikett-${r.id}.json`);}catch(e){fehler(e.message);}});
function download(r,name){const blob=new Blob([JSON.stringify(r,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('clear').addEventListener('click',()=>{if(!window.confirm('Nur die Entwürfe dieses Etikett-Versuchs löschen?'))return;try{localStorage.removeItem(KEY);showSaved();$('saved-status').textContent='Etikettentwürfe gelöscht. Andere CircularFlow-Daten bleiben erhalten.';}catch{fehler('Löschen im Browserspeicher nicht möglich.');}});
window.addEventListener('pagehide',()=>{if(worker)worker.terminate();if(photoURL)URL.revokeObjectURL(photoURL);});
showSaved();
