// Zusatzablauf: Bedarf ohne Annahmefenster (Bestellfrist 30.11.2026, Mindestprüfzeit 6 belegt).
// Handrechnung Regel: 30.11.2026 minus 6 Tage = 24.11.2026. Der Abgleich kann ohne Annahmefenster nie „weiter prüfen“/„knapp“ sagen (Angaben fehlen),
// also kein prüfbares Paar und nach Plan T6/PS-4 kein Eintrag unter „Zeitkritisch“; die Bedarfsseite nennt den Tag trotzdem (Plan 2.2 „Kein Angebot“/Eigenschaft des Bedarfs).
const { chromium } = require('playwright');
const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
let abw = 0;
const pruef = (t, soll, ist, gut) => { if (!gut) abw++; console.log(`${gut ? 'OK        ' : 'ABWEICHUNG'} ${t}${gut ? '' : ` | soll ${JSON.stringify(soll)} | ist ${JSON.stringify(ist)}`}`); };
const ist = (t, w) => console.log(`   IST ${t}: ${typeof w === 'string' ? w : JSON.stringify(w)}`);
const h1 = (page, t) => page.locator('h1', { hasText: t }).first().waitFor({ timeout: 15000 });
(async () => {
  const basis = process.argv[2];
  const browser = await chromium.launch();
  const kontext = await browser.newContext({ viewport: { width: 1440, height: 810 }, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
  const page = await kontext.newPage(); const meldungen = [];
  page.on('pageerror', (e) => meldungen.push(String(e))); page.on('console', (m) => { if (m.type() === 'error') meldungen.push(m.text()); });
  await page.goto(basis, { waitUntil: 'networkidle' }); await h1(page, 'Übersicht');
  await page.locator('a[href="#bedarfe"]:visible').first().click(); await page.locator('#btn-bedarf-neu').click(); await page.locator('#bedarf-form').waitFor();
  await page.selectOption('#bf-projekt', 'SB'); await page.selectOption('#bf-gruppe', { label: 'Systemtrennwände' });
  await page.fill('#bf-titel', 'Ohnefenster'); await page.fill('#bf-menge', '30'); await page.fill('#bf-bestellfrist', '2026-11-30'); await page.fill('#bf-pruefzeit', '6');
  await page.locator('#bf-speichern').click(); await page.waitForURL(/#bedarf-sb-bd-24$/); await h1(page, 'BD-24'); await page.waitForTimeout(300);
  const t = norm(await page.evaluate(() => document.body.innerText));
  const z = await page.locator('dl > div').filter({ has: page.locator('dt', { hasText: 'Prüfbitte spätestens' }) }).first().evaluate((e) => ({ wert: e.querySelector('.mono')?.innerText.trim() || null, chips: [...e.querySelectorAll('.chip')].map((c) => c.innerText.replace(/\s+/g, ' ').trim()), klein: [...e.querySelectorAll('small')].map((c) => c.innerText.replace(/\s+/g, ' ').trim()) }));
  ist('Bedarfsseite BD-24 Zeile', z); ist('Angebotszeile', t.match(/\d+ Angebote?, davon \d+ prüfbar/)?.[0] ?? null);
  ist('Angebote (Abgleich)', await page.locator('a.paar').evaluateAll((els) => els.map((e) => e.innerText.replace(/\s+/g, ' ').trim().slice(0, 140))));
  pruef('Bedarfsseite nennt „24.11.2026“ (Handrechnung)', '24.11.2026', z.wert, z.wert === '24.11.2026');
  pruef('Bedarfsseite: „Bestellfrist 30.11.2026 minus 6 Tage Mindestprüfzeit“, kein Chip', ['Bestellfrist 30.11.2026 minus 6 Tage Mindestprüfzeit', []], [z.klein[0], z.chips], z.klein[0] === 'Bestellfrist 30.11.2026 minus 6 Tage Mindestprüfzeit' && z.chips.length === 0);
  pruef('Abgleich: 0 prüfbare Angebote (Angaben fehlen: Annahmefenster)', '… davon 0 prüfbar', t.match(/\d+ Angebote?, davon \d+ prüfbar/)?.[0], /\bdavon 0 prüfbar\b/.test(t));
  await page.locator('a[href="#uebersicht"]:visible').first().click(); await h1(page, 'Übersicht'); await page.waitForTimeout(300);
  const kopf = norm(await page.locator('#h-zk').locator('xpath=..').innerText()); const titel = await page.locator('.frist-zeile .fz-text a').allInnerTexts();
  ist('Übersicht Kopf', kopf); ist('Fristzeilen (Titel)', titel.map(norm));
  pruef('Übersicht: keine Zeile „Prüfbitte spätestens“, weiter 4 Fristen (Bestellfrist 30.11. liegt außerhalb des Fensters)', '4 Fristen, ohne Prüfbitte', [kopf, titel.map(norm).some((x) => /Prüfbitte spätestens/.test(x))], /\b4 Fristen\b/.test(kopf) && !titel.some((x) => /Prüfbitte spätestens/.test(x)));
  pruef('keine Konsolen- oder Seitenfehler', [], meldungen, meldungen.length === 0);
  await kontext.close(); await browser.close();
  console.log(abw ? `ABWEICHUNGEN: ${abw}` : 'ZUSATZABLAUF OHNE ANNAHMEFENSTER ALLES OK'); process.exitCode = abw ? 1 : 0;
})().catch((e) => { console.error('SKRIPTFEHLER', String(e).split('\n').slice(0, 3).join(' | ')); process.exit(1); });
