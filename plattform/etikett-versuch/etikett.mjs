/** Label text -> conservative metadata suggestions. Does not classify the object. */
export const FELDER = {
  hersteller: 'Hersteller', modell: 'Modell / Typ', seriennummer: 'Seriennummer', baujahr: 'Baujahr'
};
// Nur explizite Feldbezeichnungen. Artikel-/Auftragsnummern sind keine Seriennummern.
const MUSTER = [
  ['hersteller', '(?:HERSTELLER|MANUFACTURER|FABRIKAT|MARKE)'],
  ['modell', '(?:MODELL|MODEL|TYP|TYPE)'],
  ['seriennummer', '(?:SERIENNUMMER|SERIEN[- ]?NR\\.?|SER\\.?[- ]?NR\\.?|SERIAL(?:\\s+(?:NUMBER|NO\\.?))?|S\\s*[/]\\s*N|SN)'],
  ['baujahr', '(?:BAUJAHR|HERSTELLUNGSJAHR|YEAR(?:\\s+OF\\s+MANUFACTURE)?)'],
];
const LABELS = MUSTER.map(([key, label]) => [key, new RegExp(`^${label}(?:\\s*[:=]\\s*|\\s+[-–]\\s+|\\s+)(.+)$`, 'iu'), new RegExp(`^${label}\\s*[:=]?\\s*$`, 'iu')]);
const SPALTEN = new RegExp(`\\s*[|;\\t]\\s*(?=(?:${MUSTER.map(([, label]) => label).join('|')})(?:\\s|[:=]|$))`, 'iu');
const istBeschriftung = (text) => LABELS.some(([, re, nur]) => re.test(text) || nur.test(text));
export function ausEtikett(text, maxJahr = new Date().getFullYear()) {
  if (typeof text !== 'string') throw new TypeError('OCR-Text muss eine Zeichenkette sein.');
  const rohtext = text.slice(0, 16000).normalize('NFKC').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
  const candidates = Object.fromEntries(Object.keys(FELDER).map(k => [k, []]));
  const zeilen = rohtext.split(/\r?\n/u).flatMap((line) => line.split(SPALTEN)).map((s) => s.trim()).filter(Boolean);
  for (let i = 0; i < zeilen.length; i++) {
    const line = zeilen[i];
    for (const [key, re, nur] of LABELS) {
      const m = line.match(re);
      if (m) candidates[key].push({ value: m[1].trim(), line });
      else if (nur.test(line) && zeilen[i + 1] && !istBeschriftung(zeilen[i + 1])) {
        candidates[key].push({ value: zeilen[i + 1], line: `${line} / ${zeilen[i + 1]}` });
      }
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
      const containsOtherLabel = /(?:HERSTELLER|MANUFACTURER|FABRIKAT|MARKE|MODELL|MODEL|TYP|TYPE|SERIENNUMMER|SERIAL|SERIEN[- ]?NR\.?|SER\.?[- ]?NR\.?|S\/N|BAUJAHR|HERSTELLUNGSJAHR|YEAR)\s*[:=]/iu.test(v);
      const valid = v.length <= 120 && !containsOtherLabel && (key !== 'baujahr' || (/^[12]\d{3}$/u.test(v) && +v <= maxJahr));
      if (valid) { status='vorgeschlagen';wert=v;beleg=all[0].line; }
      else { status='uneindeutig';hinweise.push(`${FELDER[key]}: nicht eindeutig lesbar oder unplausibel, manuell klären.`); }
    }
    felder[key] = { wert, status, quelle: beleg ? 'Texterkennung vom Etikett, ungeprüft' : '', beleg };
  }
  if (!Object.values(felder).some(x => x.status === 'vorgeschlagen')) hinweise.push('Keine eindeutig beschrifteten Metadaten erkannt. Näher und schärfer fotografieren oder manuell erfassen.');
  return { schema:'cf-etikett-v1', felder, rohtext, hinweise, grenzen:'Keine Bauteilerkennung, kein Aufmaß, keine Fachfreigabe.' };
}

// mitFoto: Die Bestätigung geschah am Foto des Typenschilds; ohne Foto gilt die Angabe als manuell eingegeben und geprüft, nicht am Foto bestätigt.
export function gepruefterEntwurf(scan, pruefung, jetzt = new Date().toISOString(), { mitFoto = true } = {}) {
  const felder = {};
  for (const key of Object.keys(FELDER)) {
    const p=pruefung?.[key];
    const value=String(p?.wert ?? '').trim();
    if (!value) continue;
    if (p?.geprueft !== true) throw new Error(mitFoto ? `${FELDER[key]} bitte am Foto prüfen und ausdrücklich bestätigen.` : `${FELDER[key]} bitte prüfen und ausdrücklich bestätigen.`);
    if (value.length>120 || /[\r\n\u0000]/u.test(value)) throw new Error(`${FELDER[key]} ist zu lang oder ungültig.`);
    if (key==='baujahr' && (!/^[12]\d{3}$/u.test(value) || +value>new Date(jetzt).getFullYear())) throw new Error('Baujahr bitte prüfen.');
    const src=scan.felder[key];
    const unveraendert=src.status==='vorgeschlagen' && value===src.wert;
    const herkunft=unveraendert?'ausgelesen':'manuell';
    const quelle=unveraendert?(mitFoto?'ausgelesen (Texterkennung), am Foto bestätigt':'ausgelesen (Texterkennung), bestätigt'):(mitFoto?'manuell eingegeben, am Foto bestätigt':'manuell eingegeben, geprüft');
    felder[key]={wert:value,status:'bestätigt',herkunft,amFoto:Boolean(mitFoto),quelle,beleg:unveraendert?src.beleg:''};
  }
  if (!Object.keys(felder).length) throw new Error(mitFoto ? 'Mindestens eine am Foto geprüfte Angabe ist nötig.' : 'Mindestens eine geprüfte Angabe ist nötig.');
  return {schema:'cf-etikett-entwurf-v1',erfasstAm:jetzt,felder,rohtext:scan.rohtext,aufmass:{status:'fehlt'},fachfreigabe:false,hinweis:'Etikettangaben bestätigt, nicht gemessen. Kein Gültigkeitsnachweis. Separater Entwurf, noch nicht im CircularFlow-Bestand.'};
}

