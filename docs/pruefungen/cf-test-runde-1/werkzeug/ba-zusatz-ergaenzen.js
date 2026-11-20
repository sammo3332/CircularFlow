// Zusatzablauf: BD-21 (nicht berechenbar) über „Angaben ändern“ ergänzen (Plan 3.3 „Fehler: behoben wird das über Bedarf ergänzen“).
// Handrechnung: Bestellfrist 24.11.2026 minus 3 Tage = 21.11.2026 (Sa), Fristende Sa 21.11., 23:59; Stichtag Mi 18.11., 14:00 => 3 Tg. 9 Std. 59 Min. => „noch 3 Tg. 9 Std.“.
// Übersicht: Eintrag nur, wenn die Bedarfsseite mindestens ein prüfbares Angebot nennt; die Zahl in der Detailzeile muss mit der Bedarfsseite übereinstimmen.
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const [basis, aus] = process.argv.slice(2);
fs.mkdirSync(path.join(aus, 'bilder'), { recursive: true });
const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
let abw = 0;
const pruef = (titel, soll, ist, gut) => { if (!gut) abw++; console.log(`${gut ? 'OK        ' : 'ABWEICHUNG'} ${titel}${gut ? '' : ` | soll ${JSON.stringify(soll)} | ist ${JSON.stringify(ist)}`}`); };
const ist = (t, w) => console.log(`   IST ${t}: ${typeof w === 'string' ? w : JSON.stringify(w)}`);
const h1 = (page, t) => page.locator('h1', { hasText: t }).first().waitFor({ timeout: 15000 });
const zeilen = (page) => page.locator('.frist-zeile').evaluateAll((els) => els.map((e) => { const n = (x) => (x ? x.innerText.replace(/\s+/g, ' ').trim() : null); return { chip: n(e.querySelector('.fz-chip')), titel: n(e.querySelector('.fz-text a')), klein: n(e.querySelector('.fz-text small')), zeit: n(e.querySelector('.fz-zeit')) }; }));
const bedarfsZeile = (page) => page.locator('dl > div').filter({ has: page.locator('dt', { hasText: 'Prüfbitte spätestens' }) }).first().evaluate((e) => ({ wert: e.querySelector('.mono')?.innerText.trim() || null, chips: [...e.querySelectorAll('.chip')].map((c) => c.innerText.replace(/\s+/g, ' ').trim()), klein: [...e.querySelectorAll('small')].map((c) => c.innerText.replace(/\s+/g, ' ').trim()) }));
(async () => {
  const browser = await chromium.launch();
  const kontext = await browser.newContext({ viewport: { width: 1440, height: 810 }, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
  const page = await kontext.newPage(); const meldungen = [];
  page.on('pageerror', (e) => meldungen.push(String(e))); page.on('console', (m) => { if (m.type() === 'error') meldungen.push(m.text()); });
  await page.goto(basis + '#bedarf-sb-bd-21', { waitUntil: 'networkidle' }); await h1(page, 'BD-21');
  let b = await bedarfsZeile(page); ist('BD-21 vorher', b);
  pruef('vorher: „nicht berechenbar“, „Bestellfrist fehlt. Mindestprüfzeit fehlt.“', ['nicht berechenbar', 'Bestellfrist fehlt. Mindestprüfzeit fehlt.'], [b.chips[0], b.klein[0]], b.chips[0] === 'nicht berechenbar' && b.klein[0] === 'Bestellfrist fehlt. Mindestprüfzeit fehlt.');
  await page.locator('#btn-bedarf-ergaenzen').click(); await page.locator('#bedarf-form').waitFor();
  await page.fill('#bf-bestellfrist', '2026-11-24'); await page.fill('#bf-pruefzeit', '3'); await page.selectOption('#bf-art-pruefzeit', { label: 'geschätzt (Annahme)' });
  await page.fill('#bf-annahme-von', '2027-01-10'); await page.fill('#bf-annahme-bis', '2027-03-31');
  await page.locator('#bf-speichern').click(); await page.waitForURL(/#bedarf-sb-bd-21$/); await h1(page, 'BD-21'); await page.waitForTimeout(300);
  const t = norm(await page.evaluate(() => document.body.innerText)); b = await bedarfsZeile(page); ist('BD-21 nachher', b);
  const nm = t.match(/(\d+) Angebote?, davon (\d+) prüfbar/); ist('Angebote auf der Bedarfsseite', nm?.[0] ?? null);
  const M = nm ? Number(nm[2]) : -1;
  pruef('nachher: „21.11.2026“', '21.11.2026', b.wert, b.wert === '21.11.2026');
  pruef('nachher: Chip „geschätzt“, Rechnung „Bestellfrist 24.11.2026 minus 3 Tage Mindestprüfzeit (geschätzt)“', [['geschätzt'], 'Bestellfrist 24.11.2026 minus 3 Tage Mindestprüfzeit (geschätzt)'], [b.chips, b.klein[0]], JSON.stringify(b.chips) === '["geschätzt"]' && b.klein[0] === 'Bestellfrist 24.11.2026 minus 3 Tage Mindestprüfzeit (geschätzt)');
  await page.screenshot({ path: path.join(aus, 'bilder', 'bd-21-ergaenzt.png') });
  await page.locator('a[href="#uebersicht"]:visible').first().click(); await h1(page, 'Übersicht'); await page.waitForTimeout(300);
  const z = await zeilen(page); const kopf = norm(await page.locator('#h-zk').locator('xpath=..').innerText()); ist('Kopf', kopf); ist('Fristzeilen', z);
  const pz = z.find((x) => /^Prüfbitte spätestens · BD-21/.test(x.titel || '')); const bz = z.find((x) => /^Bestellfrist · BD-21/.test(x.titel || ''));
  const erwartetAnzahl = 4 + (M >= 1 ? 1 : 0) + 1;
  pruef(`Zahl der Fristen = 4 + Prüfbitte (nur wenn ${M} ≥ 1 prüfbare) + Bestellfrist BD-21 (24.11. liegt im Fenster)`, `${erwartetAnzahl} Fristen`, kopf, new RegExp(`\\b${erwartetAnzahl} Fristen\\b`).test(kopf));
  if (M >= 1) {
    pruef('Prüfbitte-Zeile: Chip „noch 3 Tg. 9 Std.“, Zeit „Sa 21.11., 23:59“ (Wochenende wird nicht verschoben, Plan E6)', ['noch 3 Tg. 9 Std.', 'Sa 21.11., 23:59'], [pz?.chip, pz?.zeit], pz?.chip === 'noch 3 Tg. 9 Std.' && pz?.zeit === 'Sa 21.11., 23:59');
    pruef(`Detailzeile nennt dieselbe Zahl wie die Bedarfsseite (${M})`, `Bedarf · ${M} ${M === 1 ? 'prüfbares Paar' : 'prüfbare Paare'} · Bestellfrist 24.11.2026 minus 3 Tage Mindestprüfzeit (geschätzt)`, pz?.klein, (pz?.klein || '').endsWith(`Bedarf · ${M} ${M === 1 ? 'prüfbares Paar' : 'prüfbare Paare'} · Bestellfrist 24.11.2026 minus 3 Tage Mindestprüfzeit (geschätzt)`));
    const iP = z.indexOf(pz), iB = z.indexOf(bz);
    pruef('Reihenfolge nach Zeit: Prüfbitte (Sa 21.11., 23:59) vor der Bestellfrist (Di 24.11., 23:59)', 'Index Prüfbitte < Index Bestellfrist', [iP, iB], iP >= 0 && iB > iP);
  } else {
    pruef('kein prüfbares Angebot: keine Zeile „Prüfbitte spätestens · BD-21“', 'keine Zeile', pz ?? null, !pz);
  }
  await page.screenshot({ path: path.join(aus, 'bilder', 'uebersicht-nach-ergaenzen.png') });
  pruef('keine Konsolen- oder Seitenfehler', [], meldungen, meldungen.length === 0);
  await kontext.close(); await browser.close();
  console.log(abw ? `ABWEICHUNGEN: ${abw}` : 'ZUSATZABLAUF ERGÄNZEN ALLES OK'); process.exitCode = abw ? 1 : 0;
})().catch((e) => { console.error('SKRIPTFEHLER', String(e).split('\n').slice(0, 3).join(' | ')); process.exit(1); });
