// Übrige Folien des Decks im Stil der Musterfolien. Aufruf: node rest.js <ausgabeordner>
const fs = require('fs'); const path = require('path');
const { F, breite, text, obenFuerMitte, rechteck, rahmen, linie, bild, form, pille, r1 } = require('./basis');
const medien = JSON.parse(fs.readFileSync(path.join(__dirname, 'medien.json'), 'utf8'));
const seiten = JSON.parse(fs.readFileSync(path.join(__dirname, 'seiten-rest.json'), 'utf8'));
const p5 = fs.readFileSync('/home/user/CircularFlow/pitch/innosprint-2026/werkzeug/inhalt-p5.js', 'utf8');
const TXTB = p5.slice(p5.indexOf('const TXT = {'), p5.indexOf('const KURZ'));
const T = (k) => TXTB.match(new RegExp(`\\n  ${k}: "([^"]+)"`))[1];
const RAND = 80, RECHTS = 1840;
const OK = '#1F6B42', ROT = '#A2261D';
const marke = (v, c) => [bild('Produktzeichen', `marke-${v}.svg`, { x: RAND, y: 56, w: 56, h: 56, alt: 'Produktzeichen CircularFlow' }), text('Wortmarke', 'CircularFlow', { x: RAND + 72, y: obenFuerMitte(84, 32), g: 32, fett: true, farbe: c })];
const fuss = (t, c = F.tinte3, y = 1020) => text('Fußzeile', t, { x: RAND, y, g: 20, farbe: c });
const titel = (a, b, y = 150, g = 58, ca = F.tinte, cb = F.gruen) => [text('Titel Zeile 1', a, { x: RAND, y, g, fett: true, farbe: ca }), ...(b ? [text('Titel Zeile 2', b, { x: RAND, y: y + g * 1.2, g, fett: true, farbe: cb })] : [])];
const kennz = (liste) => { let x = RECHTS; const out = []; for (const t of liste.slice().reverse()) { const p = pille('Kennzeichnung ' + t, t, { x, y: 58, ausr: 'rechts', fg: F.simT, bg: F.simF }); out.push(...p.teile); x = p.left - 12; } return out; };
const notiz = (wer, ...ks) => `Spricht: ${wer}\n\n` + ks.map((k) => T(k)).join('\n\n');
const folien = [];

// Frist
{ const e = [...marke('gruen', F.tinte), ...kennz(['Fiktiver Fall', 'angenommene Prüfzeit: 14 Tage']), ...titel('Spätestens am 5. Februar die Prüfung anfragen', null, 150, 64)];
  const X0 = 140, D = 1640 / 33, x = (d) => X0 + d * D, BY = 560, BH = 64;
  e.push(rechteck('Band rechtzeitig', { x: x(0), y: BY, w: 17 * D, h: BH, farbe: OK }), rechteck('Band knapp', { x: x(17), y: BY, w: D, h: BH, farbe: '#C98A12' }), rechteck('Band zu spät', { x: x(18), y: BY, w: 15 * D, h: BH, farbe: ROT }));
  e.push(bild('Tür', 'tuer.svg', { x: x(0) - 4, y: 300, w: 51.4, h: 114, alt: 'Angebotene Tür' }));
  [[0, '19.01.', 'Angebot bekannt', 'start'], [17, '05.02.', 'spätestens Prüfung anfragen', 'center'], [31, '19.02.', 'Bestellfrist: Ersatz bestellen', 'center']].forEach(([d, dat, lab, au], i) => {
    const px = x(d); e.push(linie(`Marke ${dat}`, { x1: px, y1: 520, x2: px, y2: BY + BH + 12, s: 5, farbe: F.tinte }));
    const ax = au === 'start' ? px + 14 : px; e.push(text(`Datum ${dat}`, dat, { x: i === 0 ? ax + 60 : ax, y: 430, g: 44, fett: true, farbe: F.tinte, ausr: au === 'start' ? 'start' : 'center' }), text(`Beschriftung ${dat}`, lab, { x: i === 0 ? ax + 60 : ax, y: 488, g: 28, farbe: F.tinte2, ausr: au === 'start' ? 'start' : 'center' }));
  });
  e.push(rechteck('Klammer Prüfzeit', { x: x(17), y: 690, w: 14 * D, h: 26, r: 8, farbe: F.bernstein }), text('Prüfzeit', '14 Tage Prüfzeit (Annahme)', { x: (x(17) + x(31)) / 2, y: 728, g: 36, fett: true, farbe: F.tinte, ausr: 'center' }));
  e.push(text('Legende', 'wenn die Projektleitung an diesem Tag anfragt:', { x: RAND, y: 850, g: 28, farbe: F.tinte2 }));
  let lx = RAND; for (const [t, bg, fg] of [['rechtzeitig', OK, F.weiss], ['knapp', '#C98A12', F.tinte], ['zu spät', ROT, F.weiss]]) { const p = pille('Legende ' + t, t, { x: lx, y: 900, g: 28, bg, fg }); e.push(...p.teile); lx = p.rechts + 16; }
  e.push(fuss('Alle Daten 2027, fiktiv; nachgerechnet mit der Rechenregel der Vorschau. Quelle: Fallakte CF-PILOT-01 §5'));
  folien.push({ id: 2, bg: F.creme, e, notiz: notiz('Feyrouz', 'p2') }); }

// Demo
{ const e = [...marke('gruen', F.tinte), ...kennz(['Beispieldaten', 'Simulation']), ...titel('Live: Ein Paar ist fünf Tage zu spät,', 'ein anderes kann weiter geprüft werden')];
  [[RAND, '#FBE5E1', ROT, 'Zu spät', 'TW-01 → BD-23', 'Prüfbitte gesperrt'], [1000, '#E2F1E7', OK, 'Weiter prüfen', 'TW-05 → BD-22', 'Vorschlag zur Prüfung, keine Freigabe']].forEach(([x, bg, fg, a, b, c]) => {
    e.push(rechteck('Karte ' + a, { x, y: 380, w: 840, h: 400, r: 28, farbe: bg, rand: { farbe: fg, staerke: 4 } }), text('Ergebnis ' + a, a, { x: x + 50, y: 430, g: 84, fett: true, farbe: fg }), text('Paar ' + a, b, { x: x + 50, y: 560, g: 50, fett: true, farbe: F.tinte }), text('Folge ' + a, c, { x: x + 50, y: 650, g: 34, farbe: F.tinte2 }));
  });
  e.push(text('Hinweis', 'Vorschau Fassung 2 · Beispieldaten: Systemtrennwände statt Türen\nStichtag der Demo: Mi 18.11.2026, 14:00 Uhr (Simulation)', { x: RAND, y: 840, g: 30, farbe: F.tinte2, zh: 1.3 }), fuss('Prüfzeiten sind Beispielannahmen. Der Abgleich ist ein Vorschlag zur Prüfung, keine Freigabe. Es wird nichts versendet.'));
  folien.push({ id: 4, bg: F.creme, e, notiz: notiz('Houssam', 'k1', 'k2', 'k3', 'k4', 'zurueck', 'klick', 'zeitdruck1', 'zeitdruck2') }); }

// Ersatzfolien
const ersatz = (id, ti, svg, B, H, mess, KW, nk, fuss1, nz) => { const KX = 210, KH = r1(KW * H / B), KY = 260, s = KW / 708; const e = [...marke('gruen', F.tinte), ...kennz(['Beispieldaten', 'Simulation']), ...titel(ti, null, 150, 64)];
  e.push(rechteck('Schatten', { x: KX + 12, y: KY + 14, w: KW, h: KH, r: 20, farbe: F.gruen, deck: 0.16 }), bild('Echte Ansicht', svg, { x: KX, y: KY, w: KW, h: KH, alt: 'Echte Ansicht der Vorschau (Beispieldaten, Simulation)' }));
  const g = mess.grund1, k = mess.knopf;
  e.push(rechteck('Markierung Begründung', { x: KX + (g.x - 5) * s, y: KY + (g.y - 4) * s, w: (g.w + 10) * s, h: (g.h + 8) * s, r: 8, farbe: F.bernstein, deck: 0.3 }), rahmen('Markierung Knopf', { x: KX + (k.x - 8) * s, y: KY + (k.y - 8) * s, w: (k.w + 16) * s, h: (k.h + 16) * s, r: 24, s: 7, farbe: F.bernstein }));
  e.push(fuss(fuss1)); folien.push({ id, bg: F.creme, e, notiz: nz }); };
const m3 = JSON.parse(fs.readFileSync(path.resolve('/tmp/claude-0/-home-user-CircularFlow/abdce38b-a89c-5699-959f-aeaffcbb39fc/scratchpad/gestaltung/assets/produkt-k3/karte-k3.json'), 'utf8')).mess;
const m4 = JSON.parse(fs.readFileSync(path.resolve('/tmp/claude-0/-home-user-CircularFlow/abdce38b-a89c-5699-959f-aeaffcbb39fc/scratchpad/gestaltung/assets/produkt-2x/karte-k4.json'), 'utf8')).mess;
const FU = 'Ersatzbild: echte Ansicht der Vorschau (Fassung 2), Beispieldaten, Stichtag der Demo Mi 18.11.2026, 14:00 (Simulation) · keine fachliche Freigabe · es wird nichts versendet';
ersatz(5, 'Dieses Paar ist fünf Tage zu spät', 'karte-k3.svg', 2734, 1336, m3, 1500, 0, FU, notiz('Houssam', 'ek3spaet', 'ek3a', 'ek3k2', 'k3', 'ek3weiter'));
ersatz(6, 'Bei diesem Paar reicht die Zeit', 'karte-k4.svg', 2734, 1440, m4, 1330, 0, FU, notiz('Houssam', 'k4', 'ek4b'));

// Pilot
{ const e = [...marke('gruen', F.tinte), ...kennz(['Ziel, noch keine Messung']), ...titel('In einem Dortmunder Pilot wollen wir messen,', 'was wirklich wiederverwendet wird')];
  const sch = [['angeboten', 'tuer.svg'], ['rechtzeitig geprüft', 'symbol-pruefzeit.svg'], ['wieder eingebaut', 'tuer.svg']];
  sch.forEach(([t, svg], i) => { const x = RAND + i * 440; e.push(rechteck('Stufe ' + t, { x, y: 400, w: 380, h: 280, r: 24, farbe: F.weiss, rand: { farbe: F.linie, staerke: 3 } }));
    e.push(svg === 'tuer.svg' ? bild('Symbol ' + t, svg, { x: x + 164, y: 424, w: 51.4, h: 114, alt: 'Tür' }) : bild('Symbol ' + t, svg, { x: x + 154, y: 440, w: 72, h: 72, alt: 'Stoppuhr' }));
    e.push(text('Stufe ' + t, t, { x: x + 190, y: 590, g: 36, fett: true, farbe: F.tinte, ausr: 'center' }));
    if (i < 2) e.push(form('Pfeil ' + i, { x: x + 392, y: 520, w: 36, h: 40, d: 'M0 0L36 20L0 40Z', farbe: F.bernstein })); });
  e.push(text('Wenn nicht', 'Wenn nicht: zu spät · Angaben fehlen · ungeeignet', { x: RAND, y: 710, g: 34, fett: true, farbe: ROT }));
  e.push(rechteck('Zitatkarte', { x: 1400, y: 400, w: 440, h: 280, r: 24, farbe: F.gruenHell }), text('Zitat', '„Es gibt kaum Daten\nzu Baustoffströmen.“', { x: 1430, y: 440, g: 36, fett: true, farbe: F.gruen, zh: 1.25 }), text('Zitatquelle', 'Stadt Dortmund, Umweltamt,\nINNOSPRINT, 13.11.2026', { x: 1430, y: 580, g: 26, farbe: F.tinte2, zh: 1.3 }));
  e.push(rechteck('SDG Fläche', { x: RAND, y: 820, w: 1000, h: 90, r: 20, farbe: F.bernsteinHell, rand: { farbe: F.bernstein, staerke: 3 } }), text('SDG', 'SDG 12.5 · weniger Abfall durch Wiederverwendung (sinngemäß)', { x: RAND + 30, y: obenFuerMitte(865, 30), g: 30, fett: true, farbe: F.tinte }));
  e.push(fuss('SDG 12.5: Unterziel der Vereinten Nationen, sinngemäß wiedergegeben; Zitat: Stadt Dortmund, Umweltamt, INNOSPRINT, 13.11.2026, Folie 11'));
  folien.push({ id: 8, bg: F.creme, e, notiz: notiz('Feyrouz', 'p5') }); }

// Team
{ const e = [...marke('gruen', F.tinte), ...titel('Der Prototyp läuft.', 'Als Erstes wollen wir einen Kurzcheck testen')];
  e.push(rechteck('Karte heute', { x: RAND, y: 380, w: 800, h: 200, r: 24, farbe: F.weiss, rand: { farbe: F.linie, staerke: 3 } }), text('Heute zeigbar', 'Heute zeigbar', { x: RAND + 36, y: 410, g: 36, fett: true, farbe: F.gruen }), text('Prototyp', 'Prototyp im Browser', { x: RAND + 36, y: 470, g: 32, farbe: F.tinte }));
  let px = RAND + 36; for (const t of ['Beispieldaten', 'Simulation']) { const p = pille('Heute ' + t, t, { x: px, y: 520, h: 44, g: 24, fg: F.simT, bg: F.simF }); e.push(...p.teile); px = p.rechts + 12; }
  e.push(rechteck('Karte Angebot', { x: RAND, y: 610, w: 800, h: 300, r: 24, farbe: F.weiss, rand: { farbe: F.linie, staerke: 3 } }), text('Nutzer und Angebot', 'Nutzer und Angebot', { x: RAND + 36, y: 640, g: 36, fett: true, farbe: F.gruen }));
  e.push(...pille('Hypothese', 'Hypothese', { x: RAND + 764, y: 640, ausr: 'rechts', h: 44, g: 24, fg: F.simT, bg: F.simF }).teile);
  e.push(text('Angebotstext', 'Nutzer: Projektleitung im Planungsbüro\nErstes Angebot: Kurzcheck für eine Bauteilgruppe\nZahlender Auftraggeber: im Pilot zu klären', { x: RAND + 36, y: 710, g: 30, farbe: F.tinte, zh: 1.45 }));
  [['Houssam Taleb', 'Informatik an der TU Dortmund, jetzt im Master\nentwickelt den Prototyp', 380], ['Feyrouz Chahed', 'Informatik an der TU Dortmund\nDatenanalyse, IT-Sicherheit, Umsetzung und Ideen', 600]].forEach(([n, t, y]) => e.push(rechteck('Person ' + n, { x: 940, y, w: 900, h: 190, r: 24, farbe: F.weiss, rand: { farbe: F.linie, staerke: 3 } }), text('Name ' + n, n, { x: 980, y: y + 28, g: 42, fett: true, farbe: F.tinte }), text('Rolle ' + n, t, { x: 980, y: y + 92, g: 28, farbe: F.tinte2, zh: 1.3 })));
  e.push(rechteck('Lücke', { x: 940, y: 820, w: 900, h: 140, r: 24, farbe: F.bernsteinHell, rand: { farbe: F.bernstein, staerke: 3 } }), text('Uns fehlt', 'Uns fehlt: Fachwissen aus Bau und Rückbau,\nBauteilbewertung, Recht und Logistik → Partner gesucht', { x: 970, y: 850, g: 30, fett: true, farbe: F.tinte, zh: 1.3 }));
  e.push(fuss('Team und Lücken laut Steckbrief des Teams (13.11.2026)'));
  folien.push({ id: 9, bg: F.creme, e, notiz: notiz('Houssam, dann Feyrouz', 'p6a', 'p6b', 'p6r') }); }

// Schluss
{ const e = [...marke('hell', F.weiss), text('Im Sprint gelernt', 'Im Sprint gelernt', { x: RAND, y: 200, g: 34, fett: true, farbe: F.bernstein }), text('Zitate', 'Umweltamt: „Bei Bauentscheidungen zählen meist Zeit und Kosten.“\nConcular: „Zeitliche Unterschiede in Nachfrage und Angebot“', { x: RAND, y: 270, g: 38, farbe: F.weiss, zh: 1.4 }), text('Erproben', 'Kurzcheck an einem echten Dortmunder Umbau erproben', { x: RAND, y: 470, g: 40, fett: true, farbe: F.gruenHell }), bild('Tür', 'tuer.svg', { x: 1700, y: 190, w: 80, h: 177.4, alt: 'Tür' }), text('Bitte', 'Unsere Bitte: Bringen Sie uns mit einem\nDortmunder Umbauprojekt in Kontakt.', { x: RAND, y: 620, g: 68, fett: true, farbe: F.weiss, zh: 1.25 }), fuss('Stadt Dortmund, Umweltamt, 13.11.2026, Folie 11; Concular, Workshop im INNOSPRINT, Folie 49', F.gruenHell)];
  folien.push({ id: 10, bg: F.gruen, e, notiz: notiz('Feyrouz', 'p7') }); }

module.exports = { folien, seiten, medien };
if (require.main === module) { const aus = process.argv[2]; fs.mkdirSync(aus, { recursive: true });
  for (const f of folien) { const seite = seiten[f.id] || seiten[String(f.id)]; if (!seite) throw new Error('Seite ' + f.id); const ops = []; const texte = [];
    for (const el of f.e) { if (el.art === 'form') { const o = { type: 'insert_shape', page_id: seite, top: el.y, left: el.x, width: el.w, height: el.h, path: el.d, view_box_width: el.w, view_box_height: el.h }; if (el.farbe) o.color = el.farbe; if (el.rand) { o.stroke_color = el.rand.farbe; o.stroke_weight = el.rand.staerke; } if (el.deck !== undefined) o.opacity = el.deck; ops.push(o); }
      else if (el.art === 'bild') { const id = medien[el.datei]; if (!id) throw new Error('Medium ' + el.datei); ops.push({ type: 'insert_fill', page_id: seite, asset_type: 'image', asset_id: id, alt_text: el.alt, left: el.x, top: el.y, width: el.w, height: el.h }); }
      else { ops.push({ type: 'add_text', page_id: seite, text: el.text, top: el.y, left: el.x, width: el.w }); texte.push({ name: el.name, text: el.text, formatting: { font_size: el.g, font_weight: el.fett ? 'bold' : 'normal', color: el.farbe, line_height: el.zh, text_align: el.ausr } }); } }
    ops.push({ type: 'replace_speaker_notes', page_id: seite, notes: f.notiz });
    const bad = f.e.filter((el) => el.art === 'text' && (el.x + el.w > 1920 || el.x < 0)).map((el) => el.name); if (bad.length) console.log('Folie', f.id, 'zu breit:', bad.join('; '));
    fs.writeFileSync(path.join(aus, `rest-${f.id}-einfuegen.json`), JSON.stringify(ops)); fs.writeFileSync(path.join(aus, `rest-${f.id}-texte.json`), JSON.stringify(texte));
    console.log(`Folie ${f.id}: ${ops.length} Befehle, ${JSON.stringify(ops).length} Zeichen, ${texte.length} Texte`); } }
