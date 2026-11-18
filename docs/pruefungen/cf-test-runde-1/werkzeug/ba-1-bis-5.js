// Browserabnahme BA-1 bis BA-5 (Plan docs/plan-pruefbitte-spaetestens.md, Abschnitt 6) gegen den Entwicklungsstand.
// Aufruf: node ba-1-bis-5.js <startUrl mit Schrägstrich am Ende> <Ausgabeordner> [BA-1 BA-2 ...]
// Je Ablauf ein frischer Browserkontext (leerer Speicher), de-DE, Europe/Berlin. Erwartungen stammen aus der Tabelle in Abschnitt 6 des Plans.
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');

const [basis, aus, ...nur] = process.argv.slice(2);
fs.mkdirSync(path.join(aus, 'bilder'), { recursive: true });
const erg = []; const skriptfehler = [];
const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const pruef = (ba, titel, soll, ist, gut) => { erg.push({ ba, titel, soll, ist, ok: Boolean(gut) }); console.log(`${gut ? 'OK        ' : 'ABWEICHUNG'} ${ba} · ${titel}${gut ? '' : ` | soll ${JSON.stringify(soll)} | ist ${JSON.stringify(ist)}`}`); };
const ist = (ba, titel, wert) => console.log(`   IST ${ba} · ${titel}: ${typeof wert === 'string' ? wert : JSON.stringify(wert)}`);

async function neuerKontext(browser, w = 1440, h = 810) {
  const kontext = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
  const page = await kontext.newPage(); const meldungen = [];
  page.on('pageerror', (e) => meldungen.push('pageerror: ' + e)); page.on('console', (m) => { if (m.type() === 'error') meldungen.push('console: ' + m.text()); });
  page.on('requestfailed', (r) => meldungen.push('netz: ' + r.url().slice(0, 100)));
  return { kontext, page, meldungen };
}
const bild = async (page, ba, name) => { await page.waitForFunction(() => !(document.querySelector('.toast')?.textContent || '').trim(), null, { timeout: 8000 }).catch(() => {}); await page.screenshot({ path: path.join(aus, 'bilder', `${ba}-${name}.png`) }); }; // Bestätigungsmeldung (3,6 s) abwarten, damit sie nichts verdeckt
const h1 = (page, text) => page.locator('h1', { hasText: text }).first().waitFor({ timeout: 15000 });

async function uebersichtLesen(page) {
  const t = norm(await page.evaluate(() => document.body.innerText));
  const kopf = norm(await page.locator('#h-zk').locator('xpath=..').innerText());
  const zeilen = await page.locator('.frist-zeile').evaluateAll((els) => els.map((e) => { const n = (x) => (x ? x.innerText.replace(/\s+/g, ' ').trim() : null); return { chip: n(e.querySelector('.fz-chip')), titel: n(e.querySelector('.fz-text a')), klein: n(e.querySelector('.fz-text small')), zeit: n(e.querySelector('.fz-zeit')), href: e.querySelector('a')?.getAttribute('href') }; }));
  const kachel = async (id) => { const k = page.locator('section[aria-labelledby="' + id + '"] .kachel-haupt'); return (await k.count()) ? norm(await k.first().innerText()) : null; };
  const kP = await kachel('k-paare'); const kV = await kachel('k-vorgaenge'); return { t, kopf, zeilen, paare: kP?.match(/^(\d+) Paare davon (\d+) prüfbar/)?.slice(1, 3) || null, vorgaenge: kV?.match(/^(\d+) Vorgänge?\b/)?.[1] || null, kachelPaare: kP, kachelVorgaenge: kV };
}
async function bedarfsZeile(page) {
  const z = page.locator('dl > div').filter({ has: page.locator('dt', { hasText: 'Prüfbitte spätestens' }) });
  const n = await z.count();
  if (!n) return { anzahl: 0 };
  return z.first().evaluate((e) => ({ voll: e.innerText.replace(/\s+/g, ' ').trim(), wert: e.querySelector('.mono')?.innerText.trim() || null, chips: [...e.querySelectorAll('.chip')].map((c) => c.innerText.replace(/\s+/g, ' ').trim()), klein: [...e.querySelectorAll('small')].map((c) => c.innerText.replace(/\s+/g, ' ').trim()) })).then((r) => ({ anzahl: n, ...r }));
}
const keinSeitlichesScrollen = (page) => page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, ok: document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1 }));

// Zustand von BA-3: Bedarf „Fristtest“ erfassen, wie im Plan beschrieben (Datumsfelder als ISO-Werte)
async function bedarfErfassen(page, ba) {
  await page.locator('a[href="#bedarfe"]:visible').first().click();
  await h1(page, 'Bedarfe');
  await page.locator('#btn-bedarf-neu').click();
  await page.locator('#bedarf-form').waitFor();
  await page.selectOption('#bf-projekt', 'SB');
  await page.selectOption('#bf-gruppe', { label: 'Systemtrennwände' });
  await page.fill('#bf-titel', 'Fristtest');
  await page.fill('#bf-menge', '30');
  await page.fill('#bf-bestellfrist', '2026-11-30');
  await page.fill('#bf-pruefzeit', '6');
  await page.selectOption('#bf-art-pruefzeit', { label: 'geschätzt (Annahme)' });
  await page.fill('#bf-annahme-von', '2027-02-01');
  await page.fill('#bf-annahme-bis', '2027-03-31');
  const eingabe = { projekt: await page.inputValue('#bf-projekt'), gruppe: await page.locator('#bf-gruppe option:checked').innerText(), titel: await page.inputValue('#bf-titel'), menge: await page.inputValue('#bf-menge'), bestellfrist: await page.inputValue('#bf-bestellfrist'), pruefzeit: await page.inputValue('#bf-pruefzeit'), art: await page.locator('#bf-art-pruefzeit option:checked').innerText(), von: await page.inputValue('#bf-annahme-von'), bis: await page.inputValue('#bf-annahme-bis') };
  ist(ba, 'Formularwerte vor „Speichern“', eingabe);
  await bild(page, ba, 'formular');
  await page.locator('#bf-speichern').click();
  await page.waitForURL(/#bedarf-sb-bd-24$/, { timeout: 15000 });
  await h1(page, 'BD-24');
}
// Tab-Taste bis zur Zeile „Prüfbitte spätestens“ in der Liste „Zeitkritisch“
async function tabZurZeile(page, max = 150) {
  await page.evaluate(() => { document.activeElement?.blur?.(); window.scrollTo(0, 0); });
  for (let i = 1; i <= max; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => { const a = document.activeElement; return { tag: a?.tagName, text: (a?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 90), href: a?.getAttribute?.('href') || null, inZeile: Boolean(a?.closest?.('.frist-zeile')) }; });
    if (info.inZeile && info.text.includes('Prüfbitte spätestens')) return { tabs: i, ...info };
  }
  return null;
}
const fokusInfo = (page) => page.evaluate(() => { const a = document.activeElement; const m = a?.closest?.('main'); return { tag: a?.tagName, id: a?.id || null, text: (a?.innerText || a?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 70), imMain: Boolean(m), imApp: Boolean(a?.closest?.('#app')), istBody: a === document.body, hash: location.hash }; });
// kein abgeschnittener Text: Elemente mit Breite, deren Inhalt breiter ist als sie selbst
const abgeschnitten = (page, selektor) => page.evaluate((sel) => [...document.querySelectorAll(sel)].flatMap((root) => [root, ...root.querySelectorAll('*')]).filter((e) => e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 1).map((e) => `${e.tagName}.${e.className}: scrollWidth ${e.scrollWidth} > clientWidth ${e.clientWidth}`), selektor);
const ausserhalb = (page, selektor) => page.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => e.getBoundingClientRect()).filter((r) => r.right > window.innerWidth + 1 || r.left < -1).map((r) => `left ${Math.round(r.left)} right ${Math.round(r.right)} (Fenster ${window.innerWidth})`), selektor);

const laeufe = {
  async 'BA-1'(browser) {
    const { kontext, page, meldungen } = await neuerKontext(browser);
    await page.goto(basis, { waitUntil: 'networkidle' }); await h1(page, 'Übersicht');
    const u = await uebersichtLesen(page);
    pruef('BA-1', 'Stichtag der Demo: Mi 18.11., 14:00', 'Mi 18.11., 14:00', await page.locator('#projektzeit option:checked').innerText(), (await page.locator('#projektzeit option:checked').innerText()) === 'Mi 18.11., 14:00');
    pruef('BA-1', 'Kachel „Paare derselben Gruppe“: 8 Paare, davon 2 prüfbar', ['8', '2'], u.paare, u.paare && u.paare[0] === '8' && u.paare[1] === '2'); ist('BA-1', 'Kachel Paare (Text)', u.kachelPaare);
    pruef('BA-1', 'Kachel „Vorgänge je Status“: 2 Vorgänge', '2', u.vorgaenge, u.vorgaenge === '2'); ist('BA-1', 'Kachel Vorgänge (Text)', u.kachelVorgaenge);
    pruef('BA-1', '„Zeitkritisch (7 Tage)“: 4 Fristen', 'Zeitkritisch (7 Tage) … 4 Fristen', u.kopf, /Zeitkritisch \(7 Tage\)/.test(u.kopf) && /\b4 Fristen\b/.test(u.kopf));
    pruef('BA-1', 'Zahl der Fristzeilen = 4', 4, u.zeilen.length, u.zeilen.length === 4);
    pruef('BA-1', 'erste Zeile: Chip „noch 2 Std.“', 'noch 2 Std.', u.zeilen[0]?.chip, u.zeilen[0]?.chip === 'noch 2 Std.');
    pruef('BA-1', 'erste Zeile: „Aufmaßfrist · E-01 · T-07 → B-02“', 'Aufmaßfrist · E-01 · T-07 → B-02', u.zeilen[0]?.titel, u.zeilen[0]?.titel === 'Aufmaßfrist · E-01 · T-07 → B-02');
    pruef('BA-1', 'keine Zeile „Prüfbitte spätestens“ (in keiner Fristzeile)', 0, u.zeilen.filter((z) => /Prüfbitte spätestens/.test(`${z.titel} ${z.klein}`)).length, !u.zeilen.some((z) => /Prüfbitte spätestens/.test(`${z.titel} ${z.klein}`)));
    pruef('BA-1', 'der Text „Prüfbitte spätestens“ steht nirgends auf der Übersicht', false, /Prüfbitte spätestens/.test(u.t), !/Prüfbitte spätestens/.test(u.t));
    ist('BA-1', 'alle Fristzeilen', u.zeilen);
    pruef('BA-1', 'keine Konsolen- oder Seitenfehler', [], meldungen, meldungen.length === 0);
    await bild(page, 'BA-1', 'uebersicht'); await kontext.close();
  },

  async 'BA-2'(browser) {
    const { kontext, page, meldungen } = await neuerKontext(browser);
    await page.goto(basis + '#bedarf-sb-bd-22', { waitUntil: 'networkidle' }); await h1(page, 'BD-22');
    let z = await bedarfsZeile(page); ist('BA-2', 'BD-22 Zeile', z);
    pruef('BA-2', 'BD-22: genau eine Zeile „Prüfbitte spätestens“', 1, z.anzahl, z.anzahl === 1);
    pruef('BA-2', 'BD-22: „21.03.2027“', '21.03.2027', z.wert, z.wert === '21.03.2027');
    pruef('BA-2', 'BD-22: Chip „geschätzt“ (nur dieser)', ['geschätzt'], z.chips, JSON.stringify(z.chips) === '["geschätzt"]');
    pruef('BA-2', 'BD-22: „Bestellfrist 31.03.2027 minus 10 Tage Mindestprüfzeit (geschätzt)“', 'Bestellfrist 31.03.2027 minus 10 Tage Mindestprüfzeit (geschätzt)', z.klein?.[0], z.klein?.[0] === 'Bestellfrist 31.03.2027 minus 10 Tage Mindestprüfzeit (geschätzt)');
    pruef('BA-2', 'BD-22: „In den 7 Tagen davor …“ steht da', 'In den 7 Tagen davor steht sie unter „Zeitkritisch“, solange ein Angebot prüfbar ist und kein Vorgang läuft.', z.klein?.[1], z.klein?.[1] === 'In den 7 Tagen davor steht sie unter „Zeitkritisch“, solange ein Angebot prüfbar ist und kein Vorgang läuft.');
    await bild(page, 'BA-2', 'bd-22');
    await page.goto(basis + '#bedarf-sb-bd-23'); await h1(page, 'BD-23'); await page.waitForTimeout(200);
    z = await bedarfsZeile(page); ist('BA-2', 'BD-23 Zeile', z);
    pruef('BA-2', 'BD-23: genau eine Zeile', 1, z.anzahl, z.anzahl === 1);
    pruef('BA-2', 'BD-23: „13.11.2026“', '13.11.2026', z.wert, z.wert === '13.11.2026');
    pruef('BA-2', 'BD-23: Chip „verstrichen“ (nur dieser, kein „geschätzt“)', ['verstrichen'], z.chips, JSON.stringify(z.chips) === '["verstrichen"]');
    pruef('BA-2', 'BD-23: „Bestellfrist 27.11.2026 minus 14 Tage Mindestprüfzeit“ (ohne „(geschätzt)“)', 'Bestellfrist 27.11.2026 minus 14 Tage Mindestprüfzeit', z.klein?.[0], z.klein?.[0] === 'Bestellfrist 27.11.2026 minus 14 Tage Mindestprüfzeit');
    pruef('BA-2', 'BD-23: ohne „In den 7 Tagen davor …“', 'nicht vorhanden', z.klein, !(z.voll || '').includes('In den 7 Tagen davor') && z.klein?.length === 1);
    await bild(page, 'BA-2', 'bd-23');
    await page.goto(basis + '#bedarf-sb-bd-21'); await h1(page, 'BD-21'); await page.waitForTimeout(200);
    z = await bedarfsZeile(page); ist('BA-2', 'BD-21 Zeile', z);
    pruef('BA-2', 'BD-21: genau eine Zeile', 1, z.anzahl, z.anzahl === 1);
    pruef('BA-2', 'BD-21: „nicht berechenbar“', ['nicht berechenbar'], z.chips, JSON.stringify(z.chips) === '["nicht berechenbar"]');
    pruef('BA-2', 'BD-21: „Bestellfrist fehlt. Mindestprüfzeit fehlt.“', 'Bestellfrist fehlt. Mindestprüfzeit fehlt.', z.klein?.[0], z.klein?.[0] === 'Bestellfrist fehlt. Mindestprüfzeit fehlt.');
    pruef('BA-2', 'BD-21: kein Datum', null, z.wert, z.wert === null);
    await bild(page, 'BA-2', 'bd-21');
    pruef('BA-2', 'keine Konsolen- oder Seitenfehler', [], meldungen, meldungen.length === 0);
    await kontext.close();
  },

  async 'BA-3'(browser) {
    const { kontext, page, meldungen } = await neuerKontext(browser);
    await page.goto(basis, { waitUntil: 'networkidle' }); await h1(page, 'Übersicht');
    await bedarfErfassen(page, 'BA-3');
    const t0 = norm(await page.evaluate(() => document.body.innerText));
    ist('BA-3', 'Hinweis nach dem Speichern', t0.match(/Bedarf BD-24 gespeichert[^.]*\.[^.]*\./)?.[0] ?? null);
    let z = await bedarfsZeile(page); ist('BA-3', 'BD-24 Zeile', z);
    pruef('BA-3', 'BD-24: „24.11.2026“', '24.11.2026', z.wert, z.wert === '24.11.2026');
    pruef('BA-3', 'BD-24: Chip „geschätzt“ (nur dieser)', ['geschätzt'], z.chips, JSON.stringify(z.chips) === '["geschätzt"]');
    pruef('BA-3', 'BD-24: „Bestellfrist 30.11.2026 minus 6 Tage Mindestprüfzeit (geschätzt)“', 'Bestellfrist 30.11.2026 minus 6 Tage Mindestprüfzeit (geschätzt)', z.klein?.[0], z.klein?.[0] === 'Bestellfrist 30.11.2026 minus 6 Tage Mindestprüfzeit (geschätzt)');
    pruef('BA-3', 'BD-24: „In den 7 Tagen davor …“ steht da (Tag liegt nach dem Stichtag)', 'In den 7 Tagen davor …', z.klein?.[1], /^In den 7 Tagen davor/.test(z.klein?.[1] || ''));
    pruef('BA-3', 'BD-24: „2 Angebote, davon 2 prüfbar“', '2 Angebote, davon 2 prüfbar', t0.match(/\d+ Angebote?, davon \d+ prüfbar/)?.[0] ?? null, /\b2 Angebote, davon 2 prüfbar\b/.test(t0));
    await bild(page, 'BA-3', 'bd-24');
    await page.locator('a[href="#uebersicht"]:visible').first().click(); await h1(page, 'Übersicht');
    let u = await uebersichtLesen(page); const letzte = u.zeilen[u.zeilen.length - 1];
    ist('BA-3', 'Übersicht Kopf', u.kopf); ist('BA-3', 'alle Fristzeilen', u.zeilen);
    pruef('BA-3', 'Übersicht: „5 Fristen“', '5 Fristen', u.kopf, /\b5 Fristen\b/.test(u.kopf));
    pruef('BA-3', 'letzte Zeile: Chip „noch 6 Tg. 9 Std.“', 'noch 6 Tg. 9 Std.', letzte?.chip, letzte?.chip === 'noch 6 Tg. 9 Std.');
    pruef('BA-3', 'letzte Zeile: „Prüfbitte spätestens · BD-24 · Fristtest“', 'Prüfbitte spätestens · BD-24 · Fristtest', letzte?.titel, letzte?.titel === 'Prüfbitte spätestens · BD-24 · Fristtest');
    pruef('BA-3', 'letzte Zeile: „Di 24.11., 23:59“', 'Di 24.11., 23:59', letzte?.zeit, letzte?.zeit === 'Di 24.11., 23:59');
    pruef('BA-3', 'letzte Zeile: Detailzeile laut Plan 3.2/3.4 („SB Bedarf · 2 prüfbare Paare · Bestellfrist 30.11.2026 minus 6 Tage Mindestprüfzeit (geschätzt)“)', 'SB Bedarf · 2 prüfbare Paare · Bestellfrist 30.11.2026 minus 6 Tage Mindestprüfzeit (geschätzt)', letzte?.klein, letzte?.klein === 'SB Bedarf · 2 prüfbare Paare · Bestellfrist 30.11.2026 minus 6 Tage Mindestprüfzeit (geschätzt)');
    pruef('BA-3', 'letzte Zeile verlinkt auf #bedarf-sb-bd-24', '#bedarf-sb-bd-24', letzte?.href, letzte?.href === '#bedarf-sb-bd-24');
    pruef('BA-3', 'die vier bisherigen Zeilen bleiben davor, unverändert', ['Aufmaßfrist · E-01 · T-07 → B-02', 'Nachweisfrist · E-02 · DB-01 → BD-01', 'Ersatzentscheidung · E-01 · T-07 → B-02', 'Ersatzentscheidung · E-02 · DB-01 → BD-01'], u.zeilen.slice(0, 4).map((x) => x.titel), JSON.stringify(u.zeilen.slice(0, 4).map((x) => x.titel)) === JSON.stringify(['Aufmaßfrist · E-01 · T-07 → B-02', 'Nachweisfrist · E-02 · DB-01 → BD-01', 'Ersatzentscheidung · E-01 · T-07 → B-02', 'Ersatzentscheidung · E-02 · DB-01 → BD-01']));
    await bild(page, 'BA-3', 'uebersicht-18-11');
    await page.selectOption('#projektzeit', '2026-11-20T09:00'); await page.waitForTimeout(400);
    u = await uebersichtLesen(page); const pb = u.zeilen.find((x) => /Prüfbitte spätestens/.test(x.titel || ''));
    ist('BA-3', 'Fr 20.11., 09:00: Kopf', u.kopf); ist('BA-3', 'Fr 20.11., 09:00: alle Fristzeilen', u.zeilen);
    pruef('BA-3', 'Stichtag „Fr 20.11., 09:00“: Chip „noch 4 Tg. 14 Std.“', 'noch 4 Tg. 14 Std.', pb?.chip, pb?.chip === 'noch 4 Tg. 14 Std.');
    await bild(page, 'BA-3', 'uebersicht-20-11');
    await page.selectOption('#projektzeit', '2026-11-18T14:00'); await page.waitForTimeout(400);
    u = await uebersichtLesen(page); const pb2 = u.zeilen.find((x) => /Prüfbitte spätestens/.test(x.titel || ''));
    pruef('BA-3', 'Zusatz Rücksprung der Betrachtungszeit auf „Mi 18.11., 14:00“: wieder „noch 6 Tg. 9 Std.“ und 5 Fristen', ['noch 6 Tg. 9 Std.', '5 Fristen'], [pb2?.chip, u.kopf], pb2?.chip === 'noch 6 Tg. 9 Std.' && /\b5 Fristen\b/.test(u.kopf));
    pruef('BA-3', 'keine Konsolen- oder Seitenfehler', [], meldungen, meldungen.length === 0);
    await kontext.close();
  },

  async 'BA-4'(browser) {
    const { kontext, page, meldungen } = await neuerKontext(browser);
    await page.goto(basis, { waitUntil: 'networkidle' }); await h1(page, 'Übersicht');
    await bedarfErfassen(page, 'BA-4');
    await page.locator('a[href="#uebersicht"]:visible').first().click(); await h1(page, 'Übersicht');
    // 1440 x 810: Tab bis zur Zeile, Enter
    let tab = await tabZurZeile(page); ist('BA-4', '1440: Fokus auf der Zeile nach Tab-Tastendrücken', tab);
    pruef('BA-4', '1440: Tab erreicht die Zeile „Prüfbitte spätestens“', 'Link in .frist-zeile', tab, tab && tab.tag === 'A');
    await page.keyboard.press('Enter'); await page.waitForTimeout(500);
    let f = await fokusInfo(page); ist('BA-4', '1440: Fokus nach Enter', f);
    pruef('BA-4', '1440: Enter öffnet #bedarf-sb-bd-24', '#bedarf-sb-bd-24', f.hash, f.hash === '#bedarf-sb-bd-24');
    pruef('BA-4', '1440: Fokus liegt im Inhalt (nicht auf <body>, im Hauptbereich)', 'im main/app, nicht body', f, !f.istBody && (f.imMain || f.imApp));
    // 390 x 844
    await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(400);
    await page.goto(basis + '#uebersicht'); await h1(page, 'Übersicht'); await page.waitForTimeout(400);
    let s = await keinSeitlichesScrollen(page); pruef('BA-4', '390: Übersicht ohne seitliches Scrollen', true, s, s.ok);
    const z1 = await abgeschnitten(page, '.frist-zeile'); pruef('BA-4', '390: Übersicht, Fristzeilen ohne abgeschnittenen Text', [], z1, z1.length === 0);
    const z2 = await ausserhalb(page, '.frist-zeile, .frist-zeile *'); pruef('BA-4', '390: Übersicht, Fristzeilen liegen innerhalb des Fensters', [], z2, z2.length === 0);
    await bild(page, 'BA-4', 'uebersicht-390');
    await page.locator('.frist-zeile').last().evaluate((e) => e.scrollIntoView({ block: 'center' })); await bild(page, 'BA-4', 'uebersicht-390-fristen');
    tab = await tabZurZeile(page); ist('BA-4', '390: Fokus auf der Zeile', tab);
    pruef('BA-4', '390: Tab erreicht die Zeile „Prüfbitte spätestens“', 'Link in .frist-zeile', tab, tab && tab.tag === 'A');
    await page.keyboard.press('Enter'); await page.waitForTimeout(500);
    f = await fokusInfo(page); ist('BA-4', '390: Fokus nach Enter', f);
    pruef('BA-4', '390: Enter öffnet #bedarf-sb-bd-24', '#bedarf-sb-bd-24', f.hash, f.hash === '#bedarf-sb-bd-24');
    pruef('BA-4', '390: Fokus liegt im Inhalt', 'im main/app, nicht body', f, !f.istBody && (f.imMain || f.imApp));
    s = await keinSeitlichesScrollen(page); pruef('BA-4', '390: BD-24 ohne seitliches Scrollen', true, s, s.ok);
    const z3 = await abgeschnitten(page, 'dl > div'); pruef('BA-4', '390: BD-24 Angaben ohne abgeschnittenen Text', [], z3, z3.length === 0);
    const z4 = await ausserhalb(page, 'dl > div, dl > div *'); pruef('BA-4', '390: BD-24 Angaben liegen innerhalb des Fensters', [], z4, z4.length === 0);
    const zeile = await bedarfsZeile(page); ist('BA-4', '390: BD-24 Zeile', zeile);
    pruef('BA-4', '390: BD-24 zeigt Tag, Chip, Rechnung und Satz vollständig', ['24.11.2026', ['geschätzt']], [zeile.wert, zeile.chips], zeile.wert === '24.11.2026' && JSON.stringify(zeile.chips) === '["geschätzt"]' && zeile.klein?.length === 2);
    await page.locator('dl > div').filter({ hasText: 'Prüfbitte spätestens' }).first().evaluate((e) => e.scrollIntoView({ block: 'center' })); await bild(page, 'BA-4', 'bd-24-390');
    pruef('BA-4', 'keine Konsolen- oder Seitenfehler', [], meldungen, meldungen.length === 0);
    await kontext.close();
  },

  async 'BA-5'(browser) {
    const { kontext, page, meldungen } = await neuerKontext(browser);
    await page.goto(basis, { waitUntil: 'networkidle' }); await h1(page, 'Übersicht');
    await bedarfErfassen(page, 'BA-5');
    // Angebot TW-05 in „Angebote derselben Gruppe“ öffnen
    const zeile = page.locator('a.paar').filter({ hasText: 'TW-05' }).first();
    ist('BA-5', 'Zeile TW-05 auf BD-24', norm(await zeile.innerText()));
    await zeile.click(); await page.waitForURL(/#abgleich-kb-tw-05--sb-bd-24$/, { timeout: 15000 });
    ist('BA-5', 'Abgleichseite', norm(await page.locator('h1').first().innerText()));
    const knopf = page.locator('#btn-pruefbitte'); ist('BA-5', '„Prüfbitte anlegen“ aria-disabled', await knopf.getAttribute('aria-disabled'));
    pruef('BA-5', '„Prüfbitte anlegen“ ist bedienbar (nicht gesperrt)', null, await knopf.getAttribute('aria-disabled'), (await knopf.getAttribute('aria-disabled')) === null);
    await bild(page, 'BA-5', 'abgleich-tw-05');
    await knopf.click(); await page.waitForTimeout(700);
    ist('BA-5', 'Adresse nach „Prüfbitte anlegen“', await page.evaluate(() => location.hash)); ist('BA-5', 'Überschrift danach', norm(await page.locator('h1').first().innerText()));
    await bild(page, 'BA-5', 'nach-pruefbitte');
    await page.locator('a[href="#uebersicht"]:visible').first().click(); await h1(page, 'Übersicht'); await page.waitForTimeout(300);
    const u = await uebersichtLesen(page); ist('BA-5', 'Übersicht Kopf', u.kopf); ist('BA-5', 'alle Fristzeilen', u.zeilen); ist('BA-5', 'Kachel Vorgänge', u.kachelVorgaenge);
    pruef('BA-5', 'Zeitkritisch: „4 Fristen“', '4 Fristen', u.kopf, /\b4 Fristen\b/.test(u.kopf));
    pruef('BA-5', 'keine Zeile „Prüfbitte spätestens“', 0, u.zeilen.filter((z) => /Prüfbitte spätestens/.test(`${z.titel} ${z.klein}`)).length, !u.zeilen.some((z) => /Prüfbitte spätestens/.test(`${z.titel} ${z.klein}`)));
    pruef('BA-5', '„Vorgänge je Status“: 3 Vorgänge', '3', u.vorgaenge, u.vorgaenge === '3');
    await bild(page, 'BA-5', 'uebersicht');
    // Zusatz: die Frist bleibt eine Eigenschaft des Bedarfs (Bedarfsseite zeigt weiter Tag und Rechnung)
    await page.goto(basis + '#bedarf-sb-bd-24'); await h1(page, 'BD-24'); await page.waitForTimeout(300);
    const bz = await bedarfsZeile(page); ist('BA-5', 'Zusatz: BD-24 nach Prüfbitte', bz);
    // Plan Abschnitt 6, Satz 1: Zurücksetzen. Erfassen → „In diesem Browser gespeichert“ → „Zurücksetzen“ → „Ja, löschen“
    await page.locator('a[href="#erfassung"]:visible').first().click(); await h1(page, 'Erfassen').catch(() => {});
    await page.locator('button[data-action="reset-frage"]').click(); await page.locator('button[data-action="reset-ja"]').click(); await page.waitForTimeout(400);
    await page.locator('a[href="#uebersicht"]:visible').first().click(); await h1(page, 'Übersicht'); await page.waitForTimeout(300);
    const r = await uebersichtLesen(page); ist('BA-5', 'nach Zurücksetzen: Kopf', r.kopf); ist('BA-5', 'nach Zurücksetzen: Fristzeilen', r.zeilen.map((x) => x.titel));
    pruef('BA-5', 'Zurücksetzen: Übersicht wieder wie BA-1 (8 Paare, davon 2 prüfbar; 2 Vorgänge; 4 Fristen ohne Prüfbitte spätestens)', ['8', '2', '2', 4, 0], [r.paare?.[0], r.paare?.[1], r.vorgaenge, r.zeilen.length, r.zeilen.filter((x) => /Prüfbitte spätestens/.test(x.titel)).length], r.paare?.[0] === '8' && r.paare?.[1] === '2' && r.vorgaenge === '2' && r.zeilen.length === 4 && !r.zeilen.some((x) => /Prüfbitte spätestens/.test(x.titel)));
    await page.goto(basis + '#bedarf-sb-bd-24'); await page.waitForTimeout(500);
    ist('BA-5', 'Adresse #bedarf-sb-bd-24 nach dem Zurücksetzen (Seitentext, Anfang)', { hash: await page.evaluate(() => location.hash), text: norm(await page.evaluate(() => document.body.innerText)).slice(0, 160) });
    await page.goto(basis + '#bedarfe'); await h1(page, 'Bedarfe'); await page.waitForTimeout(300);
    const liste = norm(await page.evaluate(() => document.body.innerText));
    pruef('BA-5', 'Zurücksetzen: Bedarfsliste enthält BD-24 „Fristtest“ nicht mehr', 'weder „Fristtest“ noch „BD-24“', { fristtest: /Fristtest/.test(liste), bd24: /BD-24/.test(liste) }, !/Fristtest/.test(liste) && !/BD-24/.test(liste));
    pruef('BA-5', 'keine Konsolen- oder Seitenfehler', [], meldungen, meldungen.length === 0);
    await kontext.close();
  },
};

(async () => {
  const browser = await chromium.launch();
  for (const [name, fn] of Object.entries(laeufe)) {
    if (nur.length && !nur.includes(name)) continue;
    console.log(`\n===== ${name} =====`);
    try { await fn(browser); } catch (e) { skriptfehler.push({ ba: name, fehler: String(e).split('\n')[0] }); console.log(`SKRIPTFEHLER ${name}: ${String(e).split('\n').slice(0, 3).join(' | ')}`); }
  }
  await browser.close();
  fs.writeFileSync(path.join(aus, 'ba-ergebnis.json'), JSON.stringify({ basis, erg, skriptfehler }, null, 1));
  const je = {}; for (const e of erg) { je[e.ba] ??= { ok: 0, abw: 0 }; je[e.ba][e.ok ? 'ok' : 'abw']++; }
  console.log('\nZUSAMMENFASSUNG je Ablauf:', JSON.stringify(je), '| Skriptfehler:', skriptfehler.length);
  process.exitCode = erg.some((e) => !e.ok) || skriptfehler.length ? 1 : 0;
})();
