/** Label text -> conservative metadata suggestions. Does not classify the object. */
export const FELDER = {
  hersteller: 'Hersteller', modell: 'Modell / Typ', seriennummer: 'Seriennummer', baujahr: 'Baujahr'
};
const LABELS = [
  ['hersteller', /^(?:HERSTELLER|MANUFACTURER)\s*:\s*(.+)$/iu],
  ['modell', /^(?:MODELL|MODEL|TYP|TYPE)\s*:\s*(.+)$/iu],
  ['seriennummer', /^(?:SERIENNUMMER|SERIAL(?:\s+(?:NUMBER|NO\.?))?|S\/N)\s*:\s*(.+)$/iu],
  ['baujahr', /^(?:BAUJAHR|YEAR(?:\s+OF\s+MANUFACTURE)?)\s*:\s*(.+)$/iu],
];
export function ausEtikett(text, maxJahr = new Date().getFullYear()) {
  if (typeof text !== 'string') throw new TypeError('OCR-Text muss eine Zeichenkette sein.');
  const rohtext = text.slice(0, 16000).normalize('NFKC').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
  const candidates = Object.fromEntries(Object.keys(FELDER).map(k => [k, []]));
  for (const raw of rohtext.split(/\r?\n/u)) {
    const line = raw.trim();
    for (const [key, re] of LABELS) {
      const m = line.match(re);
      if (m) candidates[key].push({ value: m[1].trim(), line });
    }
  }
  const felder = {}, hinweise = [];
  for (const key of Object.keys(FELDER)) {
    const all = candidates[key];
    const values = [...new Set(all.map(x => x.value))];
    let status = 'fehlt', wert = '', beleg = '';
    if (values.length > 1) { status = 'uneindeutig'; hinweise.push(`${FELDER[key]}: mehrere unterschiedliche Angaben, manuell klären.`); }
    else if (values.length === 1) {
      const v = values[0];
      const containsOtherLabel = /(?:HERSTELLER|MANUFACTURER|MODELL|MODEL|SERIENNUMMER|SERIAL|BAUJAHR|YEAR)\s*:/iu.test(v);
      const valid = v.length <= 120 && !containsOtherLabel && (key !== 'baujahr' || (/^[12]\d{3}$/u.test(v) && +v <= maxJahr));
      if (valid) { status='vorgeschlagen';wert=v;beleg=all[0].line; }
      else { status='uneindeutig';hinweise.push(`${FELDER[key]}: nicht eindeutig lesbar oder unplausibel, manuell klären.`); }
    }
    felder[key] = { wert, status, quelle: beleg ? 'Texterkennung vom Etikett, ungeprüft' : '', beleg };
  }
  if (!Object.values(felder).some(x => x.status === 'vorgeschlagen')) hinweise.push('Keine eindeutig beschrifteten Metadaten erkannt. Näher und schärfer fotografieren oder manuell erfassen.');
  return { schema:'cf-etikett-v1', felder, rohtext, hinweise, grenzen:'Keine Bauteilerkennung, kein Aufmaß, keine Fachfreigabe.' };
}

export function gepruefterEntwurf(scan, pruefung, jetzt = new Date().toISOString()) {
  const felder = {};
  for (const key of Object.keys(FELDER)) {
    const p=pruefung?.[key];
    const value=String(p?.wert ?? '').trim();
    if (!value) continue;
    if (p?.geprueft !== true) throw new Error(`${FELDER[key]} bitte am Foto prüfen und ausdrücklich bestätigen.`);
    if (value.length>120 || /[\r\n\u0000]/u.test(value)) throw new Error(`${FELDER[key]} ist zu lang oder ungültig.`);
    if (key==='baujahr' && (!/^[12]\d{3}$/u.test(value) || +value>new Date(jetzt).getFullYear())) throw new Error('Baujahr bitte prüfen.');
    const src=scan.felder[key];
    const unveraendert=src.status==='vorgeschlagen' && value===src.wert;
    felder[key]={wert:value,status:'bestätigt',quelle:unveraendert?'Etikett, OCR-Vorschlag am Foto bestätigt':'Etikett, manuell am Foto eingetragen',beleg:unveraendert?src.beleg:''};
  }
  if (!Object.keys(felder).length) throw new Error('Mindestens eine am Foto geprüfte Angabe ist nötig.');
  return {schema:'cf-etikett-entwurf-v1',erfasstAm:jetzt,felder,rohtext:scan.rohtext,aufmass:{status:'fehlt'},fachfreigabe:false,hinweis:'Etikettangaben bestätigt, nicht gemessen. Kein Gültigkeitsnachweis. Separater Entwurf, noch nicht im CircularFlow-Bestand.'};
}
