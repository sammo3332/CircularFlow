// B6: eigene Stichproben der Regel „Prüfbitte spätestens“ gegen die Handrechnung (werkzeug/b6-handrechnung.json).
// Aufruf: node b6-stichproben.mjs <Repository-Wurzel> <Handrechnung.json>
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
const hand = JSON.parse(readFileSync(process.argv[3], 'utf8'));
const imp = (p) => import(pathToFileURL(`${root}/${p}`).href);
const { pruefbitteFrist, abgleich, FRIST_PRUEFBITTE } = await imp('plattform/app/abgleich.js');
const { bedarfAusEntwurf } = await imp('plattform/app/bedarf.js');
const { bauteilAusErfassung } = await imp('plattform/app/regeln.js');
const { kleinKontext } = await imp('plattform/test/_hilfe.mjs');

// eigene Tagesrechnung, unabhängig von der Anwendung (UTC-Mittag)
const plus = (d, n) => new Date(Date.parse(`${d}T12:00:00Z`) + n * 86400000).toISOString().slice(0, 10);
let fehler = 0; let pruefungen = 0;
const pruef = (ok, text) => { pruefungen++; if (!ok) fehler++; console.log(`${ok ? 'OK     ' : 'FEHLER '}${text}`); };

console.log(`Prozess-Zeitzone TZ=${process.env.TZ || '(nicht gesetzt)'} | Intl: ${Intl.DateTimeFormat().resolvedOptions().timeZone} | Konstante: ${FRIST_PRUEFBITTE}`);

// Fixtures: Bedarf (UAK, Türen 6 Stk) und Angebot (LH, Türen 6 Stk); wie im Pilot, aber mit eigenen Daten
const bauBedarf = (f, vor, mitAnnahme) => bedarfAusEntwurf({
  projekt: 'UAK', gruppe: 'tuer', titel: 'Stichprobe', menge: '6', bestellfrist: f.bestellfrist, pruefzeitTage: String(f.pruefzeit),
  annahmeVon: mitAnnahme ? f.annahmeVon : '', annahmeBis: mitAnnahme ? f.annahmeBisEff : '', zustaendig: 'planung', anforderungen: '', geschaetzt: {},
}, { id: 'BD-X', at: `${vor}T09:00` });
const bauAngebot = (vor, verfuegbar) => bauteilAusErfassung({ projekt: 'LH', raum: '1.04', gruppe: 'tuer', menge: '6', zustand: 'B', notiz: '', verfuegbarAb: verfuegbar }, { id: 'T-X', at: `${vor}T09:00`, etage: '1.OG' });

for (const f of hand.faelle) {
  console.log(`\n=== ${f.id} · ${f.text}`);
  console.log(`Handrechnung: ${f.rechnung} => ${f.soll_tag} (Grenze: ${f.soll_grenze})`);
  // Regel direkt, ohne Annahmefenster (wörtlich wie beauftragt) und mit Annahmefenster
  const regel = pruefbitteFrist({ projekt: 'UAK', id: 'BD-X', gruppe: 'tuer', menge: 6, bestellfrist: f.bestellfrist, pruefzeitTage: f.pruefzeit, annahmeBis: f.annahmeBis });
  console.log(`pruefbitteFrist -> status=${regel.status} tag=${regel.tag} grenze=${regel.grenze} grenzTag=${regel.grenzTag} pruefzeitTage=${regel.pruefzeitTage} text="${regel.text}"`);
  pruef(regel.status === 'ok' && regel.tag === f.soll_tag, `${f.id} pruefbitteFrist.tag = Handrechnung ${f.soll_tag}`);
  pruef(regel.grenze === f.soll_grenze, `${f.id} Grenze = ${f.soll_grenze}`);
  // Gleichlauf mit dem Abgleich nur dort, wo es einen Soll-Text für den Fristtag gibt (F1 bis F4)
  if (!f.soll_am_tag) continue;
  const vor = plus(f.soll_tag, -50);          // Angebot erfasst und Bedarf angelegt lange vor dem Fristtag
  const verf = plus(f.soll_tag, -40);          // Angebot verfügbar ab vor dem Fristtag
  // Variante (a): wörtlich, kein Annahmefenster
  // Variante (b): Annahmefenster vollständig; bei F2 endet es am vorgegebenen Annahmeende, sonst nach der Bestellfrist
  const bis = f.annahmeBis ?? plus(f.bestellfrist, 11);
  const von = f.annahmeBis ? plus(f.annahmeBis, -5) : plus(f.bestellfrist, 7);
  const ff = { ...f, annahmeVon: von, annahmeBisEff: bis };
  for (const [name, mit] of [['(a) ohne Annahmefenster', false], ['(b) mit Annahmefenster ' + von + ' bis ' + bis, true]].filter(([, m]) => m || !f.annahmeBis)) { // (a) nur für Fälle ohne eigenes Annahmeende
    console.log(`  Variante ${name}`);
    const B = bauBedarf(ff, vor, mit); const T = bauAngebot(vor, verf);
    const reg = pruefbitteFrist(B);
    pruef(reg.tag === f.soll_tag && reg.status === 'ok', `${f.id}${name.slice(0, 3)} Regel am Bedarfsobjekt: ${reg.status} ${reg.tag}`);
    const stand = (d) => abgleich(kleinKontext([T], [B], `${d}T16:00`), T, B);
    const zeilen = [];
    for (let d = plus(f.soll_tag, -3); d <= plus(f.soll_tag, 2); d = plus(d, 1)) {
      const a = stand(d);
      zeilen.push({ d, key: a.gesamt.key, label: a.gesamt.label, grund: (a.zeit.gruende || [])[0] });
    }
    for (const z of zeilen) console.log(`    ${z.d}${z.d === f.soll_tag ? ' (Fristtag)' : z.d === plus(f.soll_tag, 1) ? ' (Tag danach)' : ''}: ${z.key} | ${z.label} | ${z.grund}`);
    const am = zeilen.find((z) => z.d === f.soll_tag); const danach = zeilen.find((z) => z.d === plus(f.soll_tag, 1));
    if (mit) {
      pruef(am.key === 'knapp', `${f.id}${name.slice(0, 3)} am Fristtag ${f.soll_tag}: „Knapp“ (ist: ${am.key} / ${am.label})`);
      pruef(zeilen.filter((z) => z.d < f.soll_tag).every((z) => z.key === 'weiter'), `${f.id}${name.slice(0, 3)} davor „Weiter prüfen“`);
    } else {
      // ohne Annahmefenster sagt der Abgleich am Fristtag nie „Knapp“: Angaben fehlen (nur beobachtet, kein Sollwert der Regel)
      console.log(`    BEOBACHTUNG am Fristtag ohne Annahmefenster: ${am.key} / ${am.label}`);
    }
    pruef(danach.key === 'spaet', `${f.id}${name.slice(0, 3)} am Tag danach ${plus(f.soll_tag, 1)}: „Für diese Entscheidung zu spät“ (ist: ${danach.key} / ${danach.label})`);
    pruef(zeilen.filter((z) => z.d > f.soll_tag).every((z) => z.key === 'spaet'), `${f.id}${name.slice(0, 3)} alle späteren Tage „zu spät“`);
    // prüfbar (weiter oder knapp) genau bis einschließlich Fristtag
    const pruefbar = (z) => z.key === 'weiter' || z.key === 'knapp';
    if (mit) pruef(zeilen.every((z) => pruefbar(z) === (z.d <= f.soll_tag)), `${f.id}${name.slice(0, 3)} prüfbar genau bis einschließlich ${f.soll_tag}`);
  }
}

console.log('\n=== Fehlende und ungültige Angaben');
for (const u of hand.ungueltig) {
  const e = u.eingabe;
  const r = pruefbitteFrist({ projekt: 'UAK', id: 'BD-X', gruppe: 'tuer', menge: 6, bestellfrist: e.bestellfrist, pruefzeitTage: e.pruefzeit ?? e.pruefzeitTage, annahmeBis: e.annahmeBis ?? null });
  console.log(`${u.id} ${JSON.stringify(e)} -> status=${r.status} tag=${r.tag} fehlend=${JSON.stringify(r.fehlend)} klaerung=${JSON.stringify(r.klaerung)} text="${r.text}"`);
  pruef(r.status === u.soll_status && r.tag === null, `${u.id} Status ${u.soll_status}, kein Tag`);
}
console.log(`\nSUMME ${pruefungen} Prüfungen, ${fehler} Fehler`);
process.exitCode = fehler ? 1 : 0;
