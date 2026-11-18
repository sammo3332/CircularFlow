// Prüft die drei Musterfolien: Lesbarkeit (Schriftgrößen, Kontraste), Wortlaute und Zahlen gegen die Quellen,
// Übereinstimmung mit dem Produkt. Es wird nichts verändert.
// Aufruf: node pruefen.js <stand-final.json> <repo> <quellenordner> <karte.json>
const fs = require('fs'); const path = require('path');
const [standDatei, repo, quellen, karteDatei] = process.argv.slice(2);
const stand = JSON.parse(fs.readFileSync(standDatei, 'utf8'));
let fehler = 0; const ok = (b, t) => { console.log(`${b ? 'ok    ' : 'FEHLER'} ${t}`); if (!b) fehler++; };
const lum = (hex) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const kontrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const HG = { 1: '#0E5546', 2: '#F6F2EA', 3: '#F6F2EA' };

console.log('== 1 · Lesbarkeit: Schriftgrößen und Kontraste (Folie 1920 x 1080; 2 px = 1 pt) ==');
for (const f of stand) {
  const texte = f.elemente.filter((e) => e.art === 'text'); const zeilen = [];
  for (const t of texte) {
    const cx = t.x + t.w / 2, cy = t.y + (t.g * t.zh * t.zeilen) / 2; let hg = HG[f.nr], aufBild = false;
    for (const e of f.elemente) { if (e === t) break; const drin = cx >= e.x && cx <= e.x + e.w && cy >= e.y && cy <= e.y + e.h; if (!drin) continue; if (e.art === 'form' && e.farbe && e.deck === undefined) { hg = e.farbe; aufBild = false; } else if (e.art === 'bild') aufBild = true; }
    zeilen.push({ name: t.name, g: t.g, fett: t.fett, k: aufBild ? null : kontrast(t.farbe, hg), farbe: t.farbe, hg });
  }
  const klein = zeilen.filter((z) => z.g < 28).map((z) => `${z.name} ${z.g} px`);
  const kmin = zeilen.filter((z) => z.k !== null).sort((a, b) => a.k - b.k)[0];
  console.log(`Folie ${f.nr}: ${texte.length} Texte, Schrift ${Math.min(...zeilen.map((z) => z.g))} bis ${Math.max(...zeilen.map((z) => z.g))} px`);
  console.log(`  unter 28 px (14 pt): ${klein.length ? klein.join('; ') : 'keine'}`);
  ok(zeilen.every((z) => z.g >= 20), `Folie ${f.nr}: keine Schrift unter 20 px (10 pt)`);
  // Schwelle wie bei WCAG AA: große Schrift (ab 36 px oder fett ab 28 px, also 18 pt beziehungsweise 14 pt fett) 3:1, sonst 4,5:1
  const gross = (z) => z.g >= 36 || (z.fett && z.g >= 28);
  const schwach = zeilen.filter((z) => z.k !== null && z.k < (gross(z) ? 3 : 4.5));
  ok(schwach.length === 0, `Folie ${f.nr}: Kontrast normale Schrift mindestens 4,5:1, große Schrift mindestens 3:1 (kleinster Wert: ${kmin.name} ${kmin.k.toFixed(1)}:1, ${kmin.farbe} auf ${kmin.hg})${schwach.length ? ' · zu schwach: ' + schwach.map((z) => z.name + ' ' + z.k.toFixed(1)).join('; ') : ''}`);
}

console.log('\n== 2 · Wortlaute gegen den geprüften Pitch (pitch/innosprint-2026/werkzeug/inhalt-p5.js) ==');
const p5 = fs.readFileSync(path.join(repo, 'pitch/innosprint-2026/werkzeug/inhalt-p5.js'), 'utf8');
const txt = (n, f) => stand.find((s) => s.nr === f).elemente.find((e) => e.name === n).text;
const titel1 = (txt('Titel Zeile 1', 1) + ' ' + txt('Titel Zeile 2', 1));
ok(p5.includes(`titel: "${titel1}"`), `Folie 1 Titel wörtlich: „${titel1}“`);
ok(p5.includes(`"${txt('Ort links', 1)}: ${txt('Angebot', 1)}"`), `Folie 1: „${txt('Ort links', 1)}: ${txt('Angebot', 1)}“`);
ok(p5.includes(`"${txt('Ort rechts', 1)}: ${txt('Bedarf', 1)}"`), `Folie 1: „${txt('Ort rechts', 1)}: ${txt('Bedarf', 1)}“`);
ok(p5.includes('"zu spät erfahren"') && p5.includes('→ neu bestellt') && p5.includes('"Fiktiver Fall"'), 'Folie 1: „zu spät erfahren“, „neu bestellt“, „Fiktiver Fall“ stehen so im geprüften Pitch');
ok(p5.includes('Die angebotenen Türen können im Container landen.'), 'Folie 1: „können im Container landen“ stammt aus dem geprüften Sprechtext der Folie 1');
ok(p5.includes(`fuss: "${txt('Fußzeile Fall', 1)}"`), `Folie 1 Fußzeile wörtlich: „${txt('Fußzeile Fall', 1)}“`);
ok(p5.includes(`CircularFlow · ${txt('Fußzeile Team', 1)}`), 'Folie 1 Teamzeile wörtlich (ohne das vorangestellte „CircularFlow ·“, dafür steht das Produktzeichen)');
const titel3 = txt('Titel Teil 1', 3) + ' ' + txt('Titel Teil 2', 3);
ok(p5.includes(`titel: "${titel3}"`), `Folie 3 Titel wörtlich: „${titel3}“`);
ok(p5.includes('"Bauteil frei ab", "Bestellfrist", "Prüfzeit"'), 'Folie 3: Angaben „Bauteil frei ab“, „Bestellfrist“, „Prüfzeit“ wie auf der geprüften Folie 3');
const sprech = (k) => p5.match(new RegExp(`\\n  ${k}: "([^"]+)"`))[1];
const seiten = { 1: 'folie1', 3: 'folie3' }; const fol = fs.readFileSync(path.join(__dirname, 'folien.js'), 'utf8');
ok(fol.includes(sprech('p1')), 'Sprechtext Folie 1 in den Notizen wörtlich wie TXT.p1 (55 Wörter)');
ok(fol.includes(sprech('p3')), 'Sprechtext Folie 3 in den Notizen wörtlich wie TXT.p3 (44 Wörter)');

console.log('\n== 3 · Zahlen der Datenfolie gegen die gelesenen Quellen ==');
const pm = fs.readFileSync(path.join(quellen, 'destatis-pm185.txt'), 'utf8').replace(/\s+/g, ' ');
const uba = fs.readFileSync(path.join(quellen, 'uba-tabelle.txt'), 'utf8');
ok(/insgesamt 362,7 Millionen Tonnen Abfälle/.test(pm), 'Destatis PM 185: „insgesamt 362,7 Millionen Tonnen Abfälle“');
ok(/nach vorläufigen Ergebnissen/.test(pm) && /Im Jahr 2024/.test(pm), 'Destatis PM 185: „Im Jahr 2024 … nach vorläufigen Ergebnissen“');
ok(/Die Hälfte aller Abfälle im Jahr 2024 waren Bau- und Abbruchabfälle/.test(pm), 'Destatis PM 185, Überschrift: „Die Hälfte aller Abfälle im Jahr 2024 waren Bau- und Abbruchabfälle“');
ok(/mit 50 % \(182,8 Millionen Tonnen\)/.test(pm), 'Destatis PM 185: „mit 50 % (182,8 Millionen Tonnen)“');
ok(/Nr\. 185 vom 1\. Juni 2026/.test(pm), 'Destatis PM 185: „Nr. 185 vom 1. Juni 2026“');
ok(!/\bBoden\b|Steine|Baggergut/.test(pm), 'Destatis PM 185 nennt Boden, Steine und Baggergut nicht (nur die andere Abfallart „Bodenschätze“); deshalb zweite Quelle auf der Folie');
const zeile = (re) => uba.split('\n').find((z) => re.test(z)).trim().split(/\s{2,}/);
const bau = zeile(/^Bau- und Abbruchabfälle \(einschließlich Straßenaufbruch\)/), boden = zeile(/darunter Boden, Steine und Baggergut/);
const z2024 = (z) => parseFloat(z[z.length - 2].replace('.', ''));
ok(z2024(bau) === 182769, `UBA-Tabelle 2024: Bau- und Abbruchabfälle (einschließlich Straßenaufbruch) ${bau[bau.length - 2]} Tsd. t`);
ok(z2024(boden) === 102887, `UBA-Tabelle 2024: darunter Boden, Steine und Baggergut ${boden[boden.length - 2]} Tsd. t -> 102,9 Mio. t`);
ok(/362\.719/.test(uba), 'UBA-Tabelle 2024: Abfallaufkommen insgesamt 362.719 Tsd. t');
ok(/Quelle: Statistisches Bundesamt, Abfallbilanz/.test(uba), 'UBA-Tabelle: „Quelle: Statistisches Bundesamt, Abfallbilanz“');
const aB = 182769 / 362719, aS = 102887 / 362719;
ok(Math.round(aB * 100) === 50 && Math.round(aS * 100) === 28, `Kästchen: ${(aB * 100).toFixed(1)} % -> 50 von 100; Boden, Steine und Baggergut ${(aS * 100).toFixed(1)} % -> 28 von 100; übrige 22`);
ok(!/wiederverw|Wiederverw|Bauteil/.test(uba) && !/Bauteil/.test(pm), 'In beiden Quellen kommt „Bauteil“ beziehungsweise Wiederverwendung nicht als eigene Angabe vor (Aussage im gelben Kasten)');
const waf = fol.match(/const WAFFEL = \{ boden: (\d+), bau: (\d+), rest: (\d+) \}/).slice(1).map(Number);
ok(waf[0] === 28 && waf[1] === 22 && waf[2] === 50, `Folie 2 zeichnet ${waf[0]} + ${waf[1]} + ${waf[2]} Kästchen`);

console.log('\n== 4 · Übereinstimmung der Produktfolie mit dem tatsächlichen Produkt ==');
const karte = JSON.parse(fs.readFileSync(karteDatei, 'utf8')); const t = karte.mess.texte;
ok(karte.startbedingung.paare && karte.startbedingung.pruefbar && karte.startbedingung.vorgaenge && karte.startbedingung.stichtag && karte.startbedingung.speicher === 0 && karte.fehler.length === 0, 'Aufnahme: frischer Browser, Startbedingung erfüllt (8 Paare, 2 prüfbar, 2 Vorgänge, Stichtag Mi 18.11., 14:00), keine Konsolenfehler');
ok(karte.mess.seitentitel === 'TW-05 und BD-22: Weiter prüfen', `Ansicht: „${karte.mess.seitentitel}“`);
ok(t.grund1 === 'Prüfende 28.11.2026 liegt 123 Tage vor der Bestellfrist 31.03.2027.', `Markierter Satz in der Aufnahme: „${t.grund1}“`);
ok(t.knopf === 'Prüfbitte anlegen' && karte.mess.knopfGesperrt !== 'true', 'Markierter Knopf in der Aufnahme: „Prüfbitte anlegen“, nicht gesperrt');
ok(/Vorschlag zur Prüfung, keine fachliche Freigabe/.test(t.gesamt) && /Simulation, es wird nichts versendet/.test(t.gesamt), 'Aufnahme enthält „Vorschlag zur Prüfung, keine fachliche Freigabe“ und „Simulation, es wird nichts versendet“');
const daten = fs.readFileSync(path.join(repo, 'plattform/app/daten.js'), 'utf8');
ok(/id: 'TW-05'[^\n]*\n[^\n]*\n[^\n]*verfuegbarAb: '2027-02-01'/.test(daten), 'Beispieldaten: TW-05 verfügbar ab 2027-02-01 („Bauteil frei ab 01.02.2027“)');
ok(/id: 'BD-22'[^\n]*bestellfrist: '2027-03-31', pruefzeitTage: 10/.test(daten) && /id: 'BD-22'[^\n]*pruefzeitTage: 'geschaetzt'/.test(daten), 'Beispieldaten: BD-22 Bestellfrist 2027-03-31, Prüfzeit 10 Tage, als geschätzt gekennzeichnet („angenommene Prüfzeit 10 Tage“)');
const tage = (a, b) => Math.round((Date.UTC(...b) - Date.UTC(...a)) / 864e5);
ok(tage([2026, 10, 18], [2026, 10, 28]) === 10 && tage([2026, 10, 28], [2027, 2, 31]) === 123 && tage([2026, 10, 18], [2027, 1, 1]) === 75 && tage([2026, 10, 18], [2027, 2, 31]) === 133, 'Zeitstrahl nachgerechnet: 18.11. + 10 Tage = 28.11.2026; bis 31.03.2027 sind es 123 Tage; 01.02.2027 liegt bei Tag 75 von 133');
ok(fol.includes("const TAGE = { gesamt: 133, pruefzeit: 10, freiAb: 75 }"), 'Zeitstrahl ist mit 133, 10 und 75 Tagen maßstäblich gezeichnet');
ok(p5.includes('BD-22 mit 10 Tagen Prüfzeit liegt 123 Tage vor der Bestellfrist'), 'Geprüfter Pitch (Anhang AX2): „BD-22 mit 10 Tagen Prüfzeit liegt 123 Tage vor der Bestellfrist“');
const ablauf = fs.readFileSync(path.join(repo, 'docs/pitch-ablauf.md'), 'utf8');
ok(/TW-05 → BD-22/.test(ablauf) && /Prüfbitte anlegen/.test(ablauf), 'Demoablauf (docs/pitch-ablauf.md): Schritt K4 zeigt TW-05 → BD-22, Schritt K5 „Prüfbitte anlegen“');
console.log(`\n${fehler === 0 ? 'Alle Prüfungen bestanden.' : fehler + ' Prüfung(en) fehlgeschlagen.'}`);
process.exit(fehler ? 1 : 0);
