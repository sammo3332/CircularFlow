// B4: kein seitliches Scrollen bei 1280 x 720 auf Übersicht und den Bedarfsseiten (frischer Kontext je Gruppe)
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const [basis, aus] = process.argv.slice(2);
fs.mkdirSync(path.join(aus, 'bilder'), { recursive: true });
let fehlzahl = 0;
const scroll = (page) => page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, innerWidth: window.innerWidth, ok: document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1 }));
const abgeschnitten = (page, sel) => page.evaluate((s) => [...document.querySelectorAll(s)].flatMap((r) => [r, ...r.querySelectorAll('*')]).filter((e) => e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 1).map((e) => `${e.tagName}.${e.className}`), sel);
const melde = (ok, text) => { if (!ok) fehlzahl++; console.log(`${ok ? 'OK        ' : 'ABWEICHUNG'} ${text}`); };
(async () => {
  const browser = await chromium.launch();
  // Gruppe 1: Beispieldaten
  let kontext = await browser.newContext({ viewport: { width: 1280, height: 720 }, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
  let page = await kontext.newPage(); const meldungen = [];
  page.on('pageerror', (e) => meldungen.push(String(e))); page.on('console', (m) => { if (m.type() === 'error') meldungen.push(m.text()); });
  for (const [name, hash, h1] of [['Übersicht', '', 'Übersicht'], ['BD-22', '#bedarf-sb-bd-22', 'BD-22'], ['BD-23', '#bedarf-sb-bd-23', 'BD-23'], ['BD-21 (Zusatz)', '#bedarf-sb-bd-21', 'BD-21']]) {
    await page.goto(basis + hash, { waitUntil: 'networkidle' }); await page.locator('h1', { hasText: h1 }).first().waitFor({ timeout: 15000 }); await page.waitForTimeout(300);
    const s = await scroll(page); const ab = await abgeschnitten(page, hash ? 'dl > div' : '.frist-zeile');
    melde(s.ok, `1280 × 720 ${name}: scrollWidth ${s.scrollWidth} <= clientWidth ${s.clientWidth} (Fenster ${s.innerWidth}); abgeschnittene Elemente: ${JSON.stringify(ab)}`);
    melde(ab.length === 0, `1280 × 720 ${name}: kein abgeschnittener Text in ${hash ? 'Angaben' : 'Fristzeilen'}`);
    await page.screenshot({ path: path.join(aus, 'bilder', `1280-${name.replace(/[^A-Za-z0-9-]/g, '')}.png`) });
  }
  melde(meldungen.length === 0, `Konsolen-/Seitenfehler (Gruppe 1): ${JSON.stringify(meldungen)}`);
  await kontext.close();
  // Gruppe 2 (Zusatz): Zustand von BA-3 (Bedarf Fristtest), Übersicht mit der neuen Zeile und BD-24
  kontext = await browser.newContext({ viewport: { width: 1280, height: 720 }, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
  page = await kontext.newPage(); const m2 = [];
  page.on('pageerror', (e) => m2.push(String(e))); page.on('console', (x) => { if (x.type() === 'error') m2.push(x.text()); });
  await page.goto(basis, { waitUntil: 'networkidle' }); await page.locator('h1', { hasText: 'Übersicht' }).first().waitFor();
  await page.locator('a[href="#bedarfe"]:visible').first().click(); await page.locator('#btn-bedarf-neu').click(); await page.locator('#bedarf-form').waitFor();
  await page.selectOption('#bf-projekt', 'SB'); await page.selectOption('#bf-gruppe', { label: 'Systemtrennwände' });
  await page.fill('#bf-titel', 'Fristtest'); await page.fill('#bf-menge', '30'); await page.fill('#bf-bestellfrist', '2026-11-30'); await page.fill('#bf-pruefzeit', '6');
  await page.selectOption('#bf-art-pruefzeit', { label: 'geschätzt (Annahme)' }); await page.fill('#bf-annahme-von', '2027-02-01'); await page.fill('#bf-annahme-bis', '2027-03-31');
  await page.locator('#bf-speichern').click(); await page.waitForURL(/#bedarf-sb-bd-24$/); await page.waitForTimeout(300);
  let s = await scroll(page); melde(s.ok, `1280 × 720 BD-24 (Zusatz, Zustand BA-3): scrollWidth ${s.scrollWidth} <= clientWidth ${s.clientWidth}`);
  await page.locator('a[href="#uebersicht"]:visible').first().click(); await page.locator('h1', { hasText: 'Übersicht' }).first().waitFor(); await page.waitForTimeout(300);
  s = await scroll(page); const ab = await abgeschnitten(page, '.frist-zeile');
  melde(s.ok, `1280 × 720 Übersicht mit 5 Fristen (Zusatz, Zustand BA-3): scrollWidth ${s.scrollWidth} <= clientWidth ${s.clientWidth}`);
  melde(ab.length === 0, `1280 × 720 Übersicht mit 5 Fristen: kein abgeschnittener Text ${JSON.stringify(ab)}`);
  await page.screenshot({ path: path.join(aus, 'bilder', '1280-Uebersicht-5-Fristen.png') });
  melde(m2.length === 0, `Konsolen-/Seitenfehler (Gruppe 2): ${JSON.stringify(m2)}`);
  await kontext.close(); await browser.close();
  console.log(fehlzahl ? `ABWEICHUNGEN: ${fehlzahl}` : 'B4 ALLES OK'); process.exitCode = fehlzahl ? 1 : 0;
})().catch((e) => { console.error('SKRIPTFEHLER', String(e).split('\n').slice(0, 3).join(' | ')); process.exit(1); });
