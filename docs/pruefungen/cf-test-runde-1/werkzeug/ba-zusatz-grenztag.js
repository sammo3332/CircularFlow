// Zusatzablauf (nicht in der Planungstabelle): Fristtag im UI. Erwartungen aus Plan 2.2 und eigener Handrechnung.
// Bedarf SB/Systemtrennwände, Bestellfrist 19.11.2026, Mindestprüfzeit 0 (belegt), Annahme 01.02.2027 bis 31.03.2027.
// Handrechnung: Prüfbitte spätestens = 19.11.2026 minus 0 = 19.11.2026, Fristende Do 19.11., 23:59.
//   Stichtag Mi 18.11., 14:00: noch 1 Tg. 9 Std. (23:59 − 14:00 = 1 Tg. 9 Std. 59 Min., abgerundet)
//   Stichtag Do 19.11., 09:00: noch 14 Std. 59 Min. (Format der bestehenden Funktion abstand unter einem Tag), Paar „Knapp“ (Prüfende 19.11. = Bestellfrist)
//   Stichtag Fr 20.11., 09:00: Tag verstrichen, kein Eintrag, Paare „Für diese Entscheidung zu spät“
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const [basis, aus] = process.argv.slice(2);
fs.mkdirSync(path.join(aus, 'bilder'), { recursive: true });
const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
let abw = 0;
const pruef = (titel, soll, ist, gut) => { if (!gut) abw++; console.log(`${gut ? 'OK        ' : 'ABWEICHUNG'} ${titel}${gut ? '' : ` | soll ${JSON.stringify(soll)} | ist ${JSON.stringify(ist)}`}`); };
const ist = (titel, w) => console.log(`   IST ${titel}: ${typeof w === 'string' ? w : JSON.stringify(w)}`);
const h1 = (page, t) => page.locator('h1', { hasText: t }).first().waitFor({ timeout: 15000 });
const zeilen = (page) => page.locator('.frist-zeile').evaluateAll((els) => els.map((e) => { const n = (x) => (x ? x.innerText.replace(/\s+/g, ' ').trim() : null); return { chip: n(e.querySelector('.fz-chip')), titel: n(e.querySelector('.fz-text a')), klein: n(e.querySelector('.fz-text small')), zeit: n(e.querySelector('.fz-zeit')) }; }));
const kopf = async (page) => norm(await page.locator('#h-zk').locator('xpath=..').innerText());
const bedarfsZeile = async (page) => { const z = page.locator('dl > div').filter({ has: page.locator('dt', { hasText: 'Prüfbitte spätestens' }) }); return z.first().evaluate((e) => ({ wert: e.querySelector('.mono')?.innerText.trim() || null, chips: [...e.querySelectorAll('.chip')].map((c) => c.innerText.replace(/\s+/g, ' ').trim()), klein: [...e.querySelectorAll('small')].map((c) => c.innerText.replace(/\s+/g, ' ').trim()) })); };
const paare = async (page) => page.locator('a.paar').evaluateAll((els) => els.map((e) => e.innerText.replace(/\s+/g, ' ').trim()));
const stichtag = async (page, wert) => { await page.selectOption('#projektzeit', wert); await page.waitForTimeout(400); };
(async () => {
  const browser = await chromium.launch();
  const kontext = await browser.newContext({ viewport: { width: 1440, height: 810 }, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
  const page = await kontext.newPage(); const meldungen = [];
  page.on('pageerror', (e) => meldungen.push(String(e))); page.on('console', (m) => { if (m.type() === 'error') meldungen.push(m.text()); });
  await page.goto(basis, { waitUntil: 'networkidle' }); await h1(page, 'Übersicht');
  await page.locator('a[href="#bedarfe"]:visible').first().click(); await page.locator('#btn-bedarf-neu').click(); await page.locator('#bedarf-form').waitFor();
  await page.selectOption('#bf-projekt', 'SB'); await page.selectOption('#bf-gruppe', { label: 'Systemtrennwände' });
  await page.fill('#bf-titel', 'Grenztag'); await page.fill('#bf-menge', '30'); await page.fill('#bf-bestellfrist', '2026-11-19'); await page.fill('#bf-pruefzeit', '0');
  await page.fill('#bf-annahme-von', '2027-02-01'); await page.fill('#bf-annahme-bis', '2027-03-31');
  await page.locator('#bf-speichern').click(); await page.waitForURL(/#bedarf-sb-bd-24$/); await h1(page, 'BD-24'); await page.waitForTimeout(300);

  console.log('--- Stichtag Mi 18.11., 14:00 (Frist liegt in der Zukunft) ---');
  let b = await bedarfsZeile(page); ist('BD-24 Zeile', b);
  pruef('BD-24: Prüfbitte spätestens „19.11.2026“ (Prüfzeit 0 = Bestellfrist)', '19.11.2026', b.wert, b.wert === '19.11.2026');
  pruef('BD-24: Rechnung „Bestellfrist 19.11.2026 minus 0 Tage Mindestprüfzeit“, kein Chip', ['Bestellfrist 19.11.2026 minus 0 Tage Mindestprüfzeit', []], [b.klein[0], b.chips], b.klein[0] === 'Bestellfrist 19.11.2026 minus 0 Tage Mindestprüfzeit' && b.chips.length === 0);
  await page.locator('a[href="#uebersicht"]:visible').first().click(); await h1(page, 'Übersicht'); await page.waitForTimeout(300);
  let z = await zeilen(page); ist('Kopf', await kopf(page)); ist('Fristzeilen', z);
  const iP = z.findIndex((x) => /^Prüfbitte spätestens · BD-24/.test(x.titel || '')); const iB = z.findIndex((x) => /^Bestellfrist · BD-24/.test(x.titel || ''));
  pruef('Übersicht: 6 Fristen (4 bisherige + Prüfbitte + Bestellfrist)', '6 Fristen', await kopf(page), /\b6 Fristen\b/.test(await kopf(page)));
  pruef('Prüfbitte-Zeile: Chip „noch 1 Tg. 9 Std.“, Zeit „Do 19.11., 23:59“', ['noch 1 Tg. 9 Std.', 'Do 19.11., 23:59'], [z[iP]?.chip, z[iP]?.zeit], z[iP]?.chip === 'noch 1 Tg. 9 Std.' && z[iP]?.zeit === 'Do 19.11., 23:59');
  pruef('Bestellfrist-Zeile von BD-24 steht zur selben Zeit „Do 19.11., 23:59“', 'Do 19.11., 23:59', z[iB]?.zeit, iB >= 0 && z[iB]?.zeit === 'Do 19.11., 23:59');
  pruef('Plan 2.2: bei gleicher Zeit steht „Prüfbitte spätestens“ vor der „Bestellfrist“', 'Index Prüfbitte < Index Bestellfrist', [iP, iB], iP >= 0 && iB >= 0 && iP < iB);
  await page.screenshot({ path: path.join(aus, 'bilder', 'X1-18-11.png') });

  console.log('--- Stichtag Do 19.11., 09:00 (Fristtag = Stichtag) ---');
  await stichtag(page, '2026-11-19T09:00');
  z = await zeilen(page); ist('Kopf', await kopf(page)); ist('Fristzeilen', z);
  const pz = z.find((x) => /^Prüfbitte spätestens · BD-24/.test(x.titel || ''));
  pruef('Frist am Stichtag: Eintrag vorhanden mit Chip „noch 14 Std. 59 Min.“ (0 Tage, Restzeit unter einem Tag wie bei allen Fristen: Std. und Min.), Zeit „Do 19.11., 23:59“', ['noch 14 Std. 59 Min.', 'Do 19.11., 23:59'], [pz?.chip, pz?.zeit], pz?.chip === 'noch 14 Std. 59 Min.' && pz?.zeit === 'Do 19.11., 23:59');
  pruef('Der Eintrag ist nicht „Überfällig“', true, pz?.chip, pz && !/Überfällig/.test(pz.chip));
  await page.goto(basis + '#bedarf-sb-bd-24'); await h1(page, 'BD-24'); await page.waitForTimeout(300);
  b = await bedarfsZeile(page); const pa = await paare(page); ist('BD-24 Zeile', b); ist('Angebote', pa);
  pruef('Frist am Stichtag: Bedarfsseite „19.11.2026“ ohne Chip „verstrichen“ (der Grenztag zählt als rechtzeitig)', ['19.11.2026', false], [b.wert, b.chips.includes('verstrichen')], b.wert === '19.11.2026' && !b.chips.includes('verstrichen'));
  pruef('Frist am Stichtag: beide Angebote „Knapp“ (Prüfende 19.11.2026 liegt am Tag der Bestellfrist 19.11.2026)', 'je Paar Knapp', pa, pa.length === 2 && pa.every((t) => /^Knapp/.test(t) && /Prüfende 19\.11\.2026 liegt am Tag der Bestellfrist 19\.11\.2026/.test(t)));
  pruef('Frist am Stichtag: Satz „In den 7 Tagen davor …“ steht (noch nicht verstrichen)', true, b.klein, b.klein.some((k) => /^In den 7 Tagen davor/.test(k)));

  console.log('--- Stichtag Fr 20.11., 09:00 (Frist einen Tag verstrichen) ---');
  await stichtag(page, '2026-11-20T09:00');
  b = await bedarfsZeile(page); const pa2 = await paare(page); ist('BD-24 Zeile', b); ist('Angebote', pa2);
  pruef('nach der Frist: Bedarfsseite Chip „verstrichen“, ohne „In den 7 Tagen davor …“', [true, false], [b.chips.includes('verstrichen'), b.klein.some((k) => /^In den 7 Tagen davor/.test(k))], b.chips.includes('verstrichen') && !b.klein.some((k) => /^In den 7 Tagen davor/.test(k)));
  pruef('nach der Frist: beide Angebote „Für diese Entscheidung zu spät“', 'je Paar zu spät', pa2, pa2.length === 2 && pa2.every((t) => /^Für diese Entscheidung zu spät/.test(t)));
  await page.locator('a[href="#uebersicht"]:visible').first().click(); await h1(page, 'Übersicht'); await page.waitForTimeout(300);
  z = await zeilen(page); ist('Kopf', await kopf(page)); ist('Fristzeilen', z);
  pruef('nach der Frist: keine Zeile „Prüfbitte spätestens“ (nie überfällig)', 0, z.filter((x) => /Prüfbitte spätestens/.test(x.titel || '')).length, !z.some((x) => /Prüfbitte spätestens/.test(x.titel || '')));
  await page.screenshot({ path: path.join(aus, 'bilder', 'X1-20-11.png') });

  console.log('--- Rücksprung auf Do 19.11., 09:00 ---');
  await stichtag(page, '2026-11-19T09:00'); z = await zeilen(page);
  const pr = z.find((x) => /^Prüfbitte spätestens · BD-24/.test(x.titel || ''));
  pruef('Rücksprung der Betrachtungszeit: Eintrag mit „noch 14 Std. 59 Min.“ ist wieder da', 'noch 14 Std. 59 Min.', pr?.chip, pr?.chip === 'noch 14 Std. 59 Min.');
  pruef('keine Konsolen- oder Seitenfehler', [], meldungen, meldungen.length === 0);
  await kontext.close(); await browser.close();
  console.log(abw ? `ABWEICHUNGEN: ${abw}` : 'ZUSATZABLAUF ALLES OK'); process.exitCode = abw ? 1 : 0;
})().catch((e) => { console.error('SKRIPTFEHLER', String(e).split('\n').slice(0, 3).join(' | ')); process.exit(1); });
