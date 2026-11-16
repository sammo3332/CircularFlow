// Erklärbarer Abgleich zwischen einem Bauteil (Angebot) und einem Bedarf: Typ, Menge, Zeit, Übergabe, Entfernung.
// Reine Fachfunktionen ohne DOM. Regeln siehe docs/plattform-v2.md Abschnitt 3 (Entwurf, fachlich nicht geprüft).
// Zeitprüfung in Kalendertagen (Europe/Berlin). Stichtag S = Tag der Projektzeit (ctx.at).
import { GRUPPEN } from './daten.js';
import { minuten, ausMinuten, istDatum, datum } from './zeit.js';
import { bewerteBoden, offeneNachweise, neueEntscheidung, schluessel, zahlText, lage } from './regeln.js';
import { aktiverVorgang, uebergebenerVorgang, bedarfBelegt, bedarfVorgang, zielUngeeignet, pruefbitteEreignis, vorgangStatus } from './vorgang.js';
import { fehlendeZeitangaben } from './bedarf.js';

export const ERGEBNIS = {
  weiter: { label: 'Weiter prüfen', ton: 'ok' },
  knapp: { label: 'Knapp', ton: 'warn' },
  spaet: { label: 'Für diese Entscheidung zu spät', ton: 'crit' },
  fehlt: { label: 'Angaben fehlen', ton: 'info' },
  klaerung: { label: 'Klärung nötig', ton: 'warn' },
};
export const ERGEBNIS_REIHENFOLGE = ['weiter', 'knapp', 'fehlt', 'klaerung', 'spaet'];
// Mengenlücke als Satz für Listen und Karten: „Es fehlen mindestens 50,2 m²“, solange die beschädigte Fläche unbekannt ist.
export const lueckeText = (m) => (m?.status === 'teilweise' ? `Es fehlen ${m.mindestens ? 'mindestens ' : ''}${zahlText(m.luecke)} ${m.einheit}.` : '');
export const HINWEIS_ABGLEICH = 'Entwurfsregel, fachlich nicht geprüft. Die Angaben sind Beispiele, die Lage ist symbolisch.';

// ---------- Schlüssel für Routen ----------
const slug = (s) => String(s).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Form: <projekt>-<bauteil>--<projekt>-<bedarf>, z. B. kb-tw-05--sb-bd-22 (nur ASCII, ein Doppelbindestrich trennt; slug() erzeugt nie zwei Bindestriche)
export const abgleichSchluessel = (bauteil, bedarf) => `${slug(bauteil.projekt)}-${slug(bauteil.id)}--${slug(bedarf.projekt)}-${slug(bedarf.id)}`;
// Löst den Schlüssel gegen die Daten auf; IDs dürfen Bindestriche enthalten (T-07, DB-01). Liefert { bauteil, bedarf } oder null.
export function loeseAbgleichSchluessel(ctxOderDaten, text) {
  const daten = ctxOderDaten?.daten || ctxOderDaten;
  const teile = String(text ?? '').toLowerCase().split('--');
  if (teile.length !== 2 || !daten) return null;
  const finde = (teil, liste) => liste.find((x) => teil === `${slug(x.projekt)}-${slug(x.id)}`) || null;
  const bauteil = finde(teile[0], daten.bauteile); const bedarf = finde(teile[1], daten.bedarfe);
  return bauteil && bedarf ? { bauteil, bedarf } : null;
}

// ---------- Hilfen ----------
const tagNr = (d) => Math.floor(minuten(`${d}T00:00`) / 1440);
const tagText = (n) => ausMinuten(n * 1440).slice(0, 10);
const dt = (n) => datum(tagText(n));
const tage = (n) => `${n} ${n === 1 ? 'Tag' : 'Tage'}`;
// Datumsangabe: leer = fehlt, ungültig = Widerspruch, sonst Tageszahl. Uhrzeiten werden abgeschnitten.
function fakt(v) {
  if (v === null || v === undefined || v === '') return { tag: null, ungueltig: false };
  const t = String(v).slice(0, 10);
  return istDatum(t) ? { tag: tagNr(t), ungueltig: false } : { tag: null, ungueltig: true };
}
function pruefzeit(v) {
  if (v === null || v === undefined || v === '') return { wert: null, ungueltig: false };
  const ok = (typeof v === 'number' && Number.isInteger(v)) || (typeof v === 'string' && /^\d+$/.test(v.trim()));
  const n = Number(v);
  return ok && n >= 0 && n <= 365 ? { wert: n, ungueltig: false } : { wert: null, ungueltig: true };
}
const bogen = (g) => (g * Math.PI) / 180;
function luftlinieKm(a, b) {
  const R = 6371; const dLat = bogen(b[0] - a[0]); const dLon = bogen(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(bogen(a[0])) * Math.cos(bogen(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
const rund2 = (n) => Math.round(n * 100) / 100;

// ---------- Teilprüfungen ----------
function pruefeTyp(ctx, bauteil, bedarf) {
  const gb = GRUPPEN[bauteil.gruppe]; const gd = GRUPPEN[bedarf.gruppe];
  const einheitB = gb?.einheit; const einheitD = bedarf.einheit || gd?.einheit;
  const widersprueche = [];
  if (bauteil.gruppe !== bedarf.gruppe) widersprueche.push(`Angebot und Bedarf nennen unterschiedliche Bauteilgruppen (${gb?.name ?? bauteil.gruppe} und ${gd?.name ?? bedarf.gruppe}).`);
  if (einheitB !== einheitD) widersprueche.push(`Die Einheiten unterscheiden sich (${einheitB ?? '–'} und ${einheitD ?? '–'}). Es wird nicht umgerechnet.`);
  const ueberProjekt = bauteil.gruppe === 'boden' && bauteil.projekt !== bedarf.projekt;
  const ok = widersprueche.length === 0 && !ueberProjekt;
  return {
    ok, gruppe: bauteil.gruppe, einheit: einheitB, widersprueche, ueberProjekt,
    text: ok ? `Gleiche Bauteilgruppe: ${gb.name}.` : ueberProjekt ? 'Doppelboden wird nur innerhalb desselben Projekts abgeglichen (Sperre der Entwurfsregel).' : widersprueche.join(' '),
  };
}

function pruefeMenge(ctx, bauteil, bedarf, typ) {
  const einheit = typ.einheit || '';
  if (bauteil.gruppe === 'boden' && bedarf.gruppe === 'boden' && typ.ok) {
    // Doppelboden: Deckung aus der bestehenden Bodenregel (bewerteBoden), nur im selben Projekt.
    const e = ctx.daten.entscheidungen.find((x) => x.projekt === bauteil.projekt && x.bauteil === bauteil.id && x.ziel?.art === 'bedarf' && x.ziel.id === bedarf.id);
    const zs = (e && ctx.ezustand?.[schluessel(e.projekt, e.id)]) || {};
    const geprueft = (w) => Boolean(w) && (w.status === 'gemessen' || w.status === 'bestaetigt');
    const raster = bauteil.werte?.raster;
    const roh = zs.beschaedigtRoh ?? (geprueft(bauteil.werte?.beschaedigt) ? String(bauteil.werte.beschaedigt.wert ?? '') : '');
    const soll = bedarf.bedarfM2 !== undefined ? bedarf : {
      ...bedarf, bedarfM2: Number(bedarf.menge) || 0, reserveProzent: 0, raster: '', aufbauhoeheMm: 0, punktlastKn: 0,
      fristen: { nachweis: '2999-01-01T00:00', ersatz: '2999-01-01T00:00' }, nachweisWerte: { verstellVonMm: 0, verstellBisMm: 0, quelle: '' },
    };
    const r = bewerteBoden({ bedarf: soll, flaecheM2: bauteil.menge, rasterIst: geprueft(raster) ? raster.wert : '', rasterVorschlag: raster?.status === 'vorgeschlagen' ? raster.wert : '', beschaedigtRoh: roh, hoeheAm: zs.hoeheAm, lastAm: zs.lastAm, at: ctx.at });
    const status = { voll: 'gedeckt', teil: 'teilweise', offen: 'offen' }[r.deckung.key];
    return { status, einheit, angebot: bauteil.menge, bedarf: r.bedarfM2, luecke: status === 'teilweise' ? r.deckung.fehlt : 0, mindestens: Boolean(r.deckung.schadenOffen), ton: r.deckung.ton, text: r.deckung.text, quelle: 'Deckung aus der Bodenregel (Entwurf)' };
  }
  const a = Number(bauteil.menge); const n = Number(bedarf.menge ?? bedarf.bedarfM2);
  const angebot = Number.isFinite(a) && a > 0 ? a : null; const noetig = Number.isFinite(n) && n > 0 ? n : null;
  if (angebot === null || noetig === null) {
    const wer = [angebot === null ? 'Angebot' : null, noetig === null ? 'Bedarf' : null].filter(Boolean).join(' und ');
    return { status: 'fehlt', einheit, angebot, bedarf: noetig, luecke: null, mindestens: false, ton: 'info', text: `Die Menge fehlt (${wer}).`, quelle: 'Eintrag' };
  }
  if (angebot >= noetig) return { status: 'gedeckt', einheit, angebot, bedarf: noetig, luecke: 0, mindestens: false, ton: 'ok', text: `Angebot ${zahlText(angebot)} ${einheit}, Bedarf ${zahlText(noetig)} ${einheit}: gedeckt.`, quelle: 'Eintrag' };
  const luecke = rund2(noetig - angebot);
  return { status: 'teilweise', einheit, angebot, bedarf: noetig, luecke, mindestens: false, ton: 'warn', text: `Angebot ${zahlText(angebot)} ${einheit}, Bedarf ${zahlText(noetig)} ${einheit}: Es fehlen ${zahlText(luecke)} ${einheit}.`, quelle: 'Eintrag' };
}

function pruefeZeit(ctx, bauteil, bedarf, typ) {
  const S = tagNr(String(ctx.at).slice(0, 10));
  const erf = fakt(bauteil.erfassung?.am); const ang = fakt(bedarf.angelegt);
  const F = fakt(bedarf.bestellfrist ?? bedarf.fristen?.ersatz); const A1 = fakt(bedarf.annahmeVon); const A2 = fakt(bedarf.annahmeBis);
  const V1 = fakt(bauteil.verfuegbarAb); const V2 = fakt(bauteil.verfuegbarBis); const pz = pruefzeit(bedarf.pruefzeitTage);
  const gruende = []; const klaerung = [...typ.widersprueche];
  for (const [f, name] of [[F, 'Die Bestellfrist'], [A1, 'Der Beginn des Annahmefensters'], [A2, 'Das Ende des Annahmefensters'], [V1, '„Verfügbar ab“'], [V2, '„Verfügbar bis“']]) {
    if (f.ungueltig) klaerung.push(`${name} enthält ein ungültiges Datum.`);
  }
  if (pz.ungueltig) klaerung.push('Die Mindestprüfzeit muss eine ganze Zahl von 0 bis 365 Tagen sein.');
  if (A1.tag !== null && A2.tag !== null && A1.tag > A2.tag) klaerung.push('Der Beginn des Annahmefensters liegt nach seinem Ende.');
  if (V1.tag !== null && V2.tag !== null && V2.tag < V1.tag) klaerung.push('„Verfügbar bis“ liegt vor „verfügbar ab“.');

  // Prüfbeginn P = spätester Tag aus Stichtag, Erfassung des Angebots und Anlage des Bedarfs.
  const kandidaten = [[S, 'Stichtag der Demo'], [erf.tag, 'Erfassung des Angebots'], [ang.tag, 'Anlage des Bedarfs']].filter(([t]) => t !== null);
  const [P, pruefbeginnQuelle] = kandidaten.reduce((m, k) => (k[0] > m[0] ? k : m));
  const E = pz.wert !== null ? P + pz.wert : null;
  const Ulower = [V1.tag, E].filter((x) => x !== null).reduce((m, x) => Math.max(m, x), -Infinity);
  const U = V1.tag !== null && E !== null ? Math.max(V1.tag, E) : null;
  const fehlend = [...fehlendeZeitangaben({ ...bedarf, bestellfrist: bedarf.bestellfrist ?? bedarf.fristen?.ersatz?.slice(0, 10) })];
  // Ungültig angegebene Felder sind ein Widerspruch, keine fehlende Angabe.
  const ohne = (name) => { const i = fehlend.indexOf(name); if (i >= 0) fehlend.splice(i, 1); };
  if (F.ungueltig) ohne('Bestellfrist');
  if (pz.ungueltig) ohne('Mindestprüfzeit');
  if (A1.ungueltig) ohne('Annahmefenster (Beginn)');
  if (A2.ungueltig) ohne('Annahmefenster (Ende)');
  if (V1.tag === null && !V1.ungueltig) fehlend.push('Verfügbar ab (Angebot)');

  const geschaetzt = [];
  if (F.tag !== null && bedarf.belegt?.bestellfrist === 'geschaetzt') geschaetzt.push('Bestellfrist');
  if (pz.wert !== null && bedarf.belegt?.pruefzeitTage === 'geschaetzt') geschaetzt.push('Mindestprüfzeit');
  if ((A1.tag !== null || A2.tag !== null) && bedarf.belegt?.annahme === 'geschaetzt') geschaetzt.push('Annahmefenster');

  const basis = {
    stichtag: tagText(S), pruefbeginn: tagText(P), pruefbeginnQuelle, pruefende: E !== null ? tagText(E) : null, pruefzeitTage: pz.wert,
    bestellfrist: F.tag !== null ? tagText(F.tag) : null, annahmeVon: A1.tag !== null ? tagText(A1.tag) : null, annahmeBis: A2.tag !== null ? tagText(A2.tag) : null,
    verfuegbarAb: V1.tag !== null ? tagText(V1.tag) : null, verfuegbarBis: V2.tag !== null ? tagText(V2.tag) : null,
    uebergabe: null, reserveTage: null, reserveBestellung: null, reserveAnnahme: null, lagertage: null, geschaetzt, gruende, fehlend, klaerung,
  };
  if (klaerung.length) return { ...basis, status: 'klaerung', gruende: klaerung };

  // Zu spät ist sicher, auch wenn sonst Angaben fehlen: Prüfbeginn oder Prüfende nach der Bestellfrist, Übergabe nach dem Annahmefenster.
  if (F.tag !== null) {
    if (P > F.tag) gruende.push(`Prüfbeginn ${dt(P)} (${pruefbeginnQuelle}) liegt ${tage(P - F.tag)} nach der Bestellfrist ${dt(F.tag)}.`);
    else if (E !== null && E > F.tag) gruende.push(`Prüfende ${dt(E)} liegt ${tage(E - F.tag)} nach der Bestellfrist ${dt(F.tag)}.`);
  }
  if (A2.tag !== null && Number.isFinite(Ulower) && Ulower > A2.tag) {
    gruende.push(U !== null ? `Frühester Übergabetag ${dt(U)} liegt ${tage(U - A2.tag)} nach dem Ende des Annahmefensters ${dt(A2.tag)}.` : `Verfügbar ab ${dt(Ulower)} liegt ${tage(Ulower - A2.tag)} nach dem Ende des Annahmefensters ${dt(A2.tag)}.`);
  }
  if (gruende.length) {
    // Auch „zu spät“ zeigt Reserve (negativ), Übergabe und Lager, soweit berechenbar, damit Gründe, Rechnung und Prüfpunkte übereinstimmen.
    const reserveB = F.tag !== null && E !== null ? F.tag - E : null;
    const startS = U !== null ? (A1.tag !== null ? Math.max(U, A1.tag) : U) : null;
    const reserveA = A2.tag !== null && startS !== null ? A2.tag - startS : null;
    const bekannt = [reserveB, reserveA].filter((x) => x !== null);
    const minimum = bekannt.length ? Math.min(...bekannt) : null;
    return {
      ...basis, status: 'spaet', gruende, reserveTage: minimum !== null && minimum < 0 ? minimum : null, reserveBestellung: reserveB, reserveAnnahme: reserveA,
      lagertage: A1.tag !== null && U !== null ? Math.max(0, A1.tag - U) : null,
      uebergabe: U !== null ? { fruehestens: tagText(U), von: tagText(startS), bis: A2.tag !== null ? tagText(A2.tag) : null } : null,
    };
  }

  if (fehlend.length) return { ...basis, status: 'fehlt', gruende: fehlend.map((f) => `${f} fehlt.`) };

  // Alles bekannt: Reserve in Kalendertagen, Übergabefenster, Zwischenlagerung.
  const start = Math.max(U, A1.tag);
  const reserveBestellung = F.tag - E; const reserveAnnahme = A2.tag - start;
  const reserve = Math.min(reserveBestellung, reserveAnnahme);
  const lagertage = Math.max(0, A1.tag - U);
  const knapp = reserve === 0;
  const g = [];
  g.push(`Prüfende ${dt(E)} liegt ${reserveBestellung === 0 ? 'am Tag der Bestellfrist' : `${tage(reserveBestellung)} vor der Bestellfrist`} ${dt(F.tag)}.`);
  g.push(`Frühester Übergabetag ${dt(U)}; im Annahmefenster ${dt(A1.tag)} bis ${dt(A2.tag)} bleiben ab ${dt(start)} ${tage(reserveAnnahme + 1)} für die Übergabe${reserveAnnahme === 0 ? ' (ein Überlappungstag genügt)' : ''}.`);
  return { ...basis, status: knapp ? 'knapp' : 'weiter', reserveTage: reserve, reserveBestellung, reserveAnnahme, lagertage, uebergabe: { fruehestens: tagText(U), von: tagText(start), bis: tagText(A2.tag) }, gruende: g };
}

function entfernung(ctx, bauteil, bedarf) {
  const von = ctx.daten.projekte.find((p) => p.kurz === bauteil.projekt)?.lage; const nach = ctx.daten.projekte.find((p) => p.kurz === bedarf.projekt)?.lage;
  if (!von || !nach) return { km: null, symbolisch: true, text: 'Entfernung unbekannt (Lage symbolisch)' };
  const km = Math.round(luftlinieKm(von, nach) * 10) / 10;
  return { km, symbolisch: true, text: bauteil.projekt === bedarf.projekt ? 'gleiches Projekt (Lage symbolisch)' : `ca. ${String(km).replace('.', ',')} km Luftlinie (Lage symbolisch)` };
}

// ---------- Abgleich ----------
export function abgleich(ctx, bauteil, bedarf, opt = {}) {
  const typ = pruefeTyp(ctx, bauteil, bedarf);
  const menge = pruefeMenge(ctx, bauteil, bedarf, typ);
  const zeit = pruefeZeit(ctx, bauteil, bedarf, typ);
  const fehltMenge = menge.status === 'fehlt';
  let key = zeit.status;
  if (!typ.ok) key = 'klaerung';
  else if (key !== 'klaerung' && key !== 'spaet' && fehltMenge) key = 'fehlt';
  const fehlend = [...zeit.fehlend, ...(fehltMenge ? ['Menge'] : [])];
  // Bei „Angaben fehlen“ nennen die Gründe alle fehlenden Angaben, auch die Menge.
  const gruende = !typ.ok ? [typ.text] : key === 'fehlt' ? [...zeit.fehlend.map((f) => `${f} fehlt.`), ...(fehltMenge ? [menge.text] : [])] : zeit.gruende;
  const gesamt = { key, ...ERGEBNIS[key] };
  const rolleFehlend = (zeit.fehlend[0] || '').startsWith('Verfügbar') ? 'bauleitung' : 'planung';

  const pruefpunkte = [];
  const pp = (art, text, rolle) => pruefpunkte.push({ art, text, rolle });
  // Zwischenlagerung aus derselben Rechnung wie die Übergabe- und Lagerzeile (auch bei „zu spät“, wenn berechenbar).
  if (typ.ok && ['weiter', 'knapp', 'spaet'].includes(key) && zeit.lagertage > 0 && zeit.uebergabe) {
    pp('zwischenlager', `Zwischenlagerung klären: ${tage(zeit.lagertage)} zwischen dem frühesten Übergabetag ${datum(zeit.uebergabe.fruehestens)} und dem Beginn des Annahmefensters ${datum(zeit.annahmeVon)}.`, 'bauleitung');
  }
  if (typ.ok && zeit.verfuegbarBis && zeit.pruefende && tagNr(zeit.verfuegbarBis) < tagNr(zeit.pruefende)) pp('verfuegbarkeit', `Die Verfügbarkeit endet am ${datum(zeit.verfuegbarBis)}, vor dem Prüfende ${datum(zeit.pruefende)}. Verbleib des Bauteils klären.`, 'bauleitung');
  if (typ.ok && zeit.geschaetzt.length) pp('geschaetzt', `Geschätzte Angaben bestätigen: ${zeit.geschaetzt.join(', ')}.`, 'planung');
  if (typ.ok && menge.status === 'teilweise') pp('teilmenge', `Teilmenge abstimmen: Es fehlen ${menge.mindestens ? 'mindestens ' : ''}${zahlText(menge.luecke)} ${menge.einheit}. Rest anders beschaffen oder weiteres Angebot suchen.`, 'planung');
  if (typ.ok && menge.status === 'offen') pp('menge', `Deckung klären: ${menge.text}`, 'bauleitung');
  if (typ.ok) {
    const nachweise = offeneNachweise(ctx, bauteil);
    if (nachweise.length) pp('nachweise', `${nachweise.length} ${nachweise.length === 1 ? 'offener Nachweis' : 'offene Nachweise'} am Bauteil klären (siehe Bauteilakte).`, 'fach');
    pp('eignung', 'Eignung (Zustand, Maße, Nachweise) von einer Fachperson prüfen lassen.', 'fach');
  }

  const sp = sperre(ctx, bauteil, bedarf, typ, key, gruende, opt.ausser);
  const sperrgrund = sp.grund;
  const text = {
    weiter: 'Prüfbitte an die Fachprüfung anlegen',
    knapp: 'Prüfbitte sofort anlegen: kein Zeitpuffer mehr',
    spaet: 'Klären, ob die Bestellentscheidung noch offen ist oder ein späterer Bedarf passt',
    fehlt: `Fehlende Angaben ergänzen: ${fehlend.join(', ')}`,
    klaerung: 'Widerspruch in den Angaben klären und den Abgleich erneut prüfen',
  }[key];
  const rolle = { weiter: 'planung', knapp: 'planung', spaet: 'planung', fehlt: rolleFehlend, klaerung: 'planung' }[key];
  // Ist die Prüfbitte bei weiter/knapp gesperrt, nennt der nächste Schritt den Grund oder den laufenden Vorgang statt „Prüfbitte anlegen“.
  let naechster = { text, rolle };
  if (['weiter', 'knapp'].includes(key) && sperrgrund) {
    naechster = sp.vorgang ? { text: `Vorgang ${sp.vorgang.id} öffnen: ${sperrgrund}`, rolle, vorgang: sp.vorgang } : { text: `Prüfbitte derzeit gesperrt: ${sperrgrund}`, rolle };
  }

  return {
    schluessel: abgleichSchluessel(bauteil, bedarf), stand: ctx.at, bauteil, bedarf,
    typ, menge, zeit: { ...zeit, gruende }, entfernung: entfernung(ctx, bauteil, bedarf),
    pruefpunkte, naechsterSchritt: naechster, gesamt, fehlend, gruende, hinweis: HINWEIS_ABGLEICH,
    pruefbitteMoeglich: sperrgrund === null, sperrgrund, vorgang: sp.vorgang || null,
  };
}

// Sperren der Prüfbitte: bauliche Gründe zuerst, dann das Ergebnis. ausser = eigener Vorgang, der nicht als Sperrgrund zählt.
function sperre(ctx, bauteil, bedarf, typ, key, gruende, ausser = null) {
  const gleichV = (v) => ausser && v && v.projekt === ausser.projekt && v.id === ausser.id;
  const aktivV = aktiverVorgang(ctx, bauteil.projekt, bauteil.id);
  const aktiv = gleichV(aktivV) ? null : aktivV;
  const belegtV = bedarfVorgang(ctx, bedarf.projekt, bedarf.id, ausser);
  const aus = (grund, vorgang = null) => ({ grund, vorgang });
  if (!typ.ok) return aus(`${ERGEBNIS.klaerung.label}: ${typ.text}`);
  if (bauteil.status === 'nicht') return aus('Das Bauteil ist als nicht wiederverwendbar eingestuft.');
  if (bauteil.ziel) return aus(`Das Bauteil hat bereits ein festes Ziel (${bauteil.ziel}).`);
  if (aktiv) return aus(`Für dieses Bauteil läuft bereits der Vorgang ${aktiv.id}.`, aktiv);
  if (uebergebenerVorgang(ctx, bauteil.projekt, bauteil.id)) return aus('Das Bauteil wurde bereits übergeben.');
  if (belegtV) return vorgangStatus(ctx, belegtV).key === 'uebergeben' ? aus(`Der Bedarf ist bereits durch eine Übergabe gedeckt (Vorgang ${belegtV.id}).`, belegtV) : aus(`Der Bedarf gehört bereits zum laufenden Vorgang ${belegtV.id}.`, belegtV);
  if (zielUngeeignet(ctx, bauteil.projekt, bauteil.id, { art: 'bedarf', id: bedarf.id, projekt: bedarf.projekt })) return aus('Dieses Bauteil wurde für diesen Bedarf bereits als ungeeignet beendet.');
  if (!['weiter', 'knapp'].includes(key)) return aus(`${ERGEBNIS[key].label}: ${gruende[0] || ''}`.trim());
  return aus(null);
}

// Reserve als Text, auch negativ: „5 Tage“, „−5 Tage, zu spät“. Leer, wenn nicht berechenbar.
export const reserveText = (n) => (n === null || n === undefined ? '' : n < 0 ? `−${tage(-n)}, zu spät` : tage(n));

// Darf für diesen Vorgang (Entscheidung E-xx) eine Prüfbitte angelegt werden? Reine Prüfung zur Projektzeit ctx.at.
// Ziel „Bedarf“: der Abgleich dieses Paares muss die Prüfbitte erlauben (der eigene Vorgang zählt nicht als Sperrgrund).
// Ziel „Zielöffnung“: die Türregel muss Rang 6 erreicht haben (wie der Knopf „Zur Fachprüfung vorlegen“).
export function pruefbitteErlaubt(ctx, e) {
  if (!e) return { erlaubt: false, grund: 'Diesen Vorgang gibt es nicht mehr.' };
  const st = vorgangStatus(ctx, e);
  if (!st.erlaubt.includes('pruefbitte')) return { erlaubt: false, grund: st.beendet ? `Der Vorgang ist beendet (${st.label}).` : `Im Status „${st.label}“ ist keine Prüfbitte mehr nötig oder möglich.` };
  const b = ctx.daten.bauteile.find((x) => x.projekt === e.projekt && x.id === e.bauteil);
  if (!b) return { erlaubt: false, grund: 'Das Bauteil gibt es nicht mehr.' };
  if (e.ziel?.art === 'bedarf') {
    const d = ctx.daten.bedarfe.find((x) => x.projekt === (e.ziel.projekt || e.projekt) && x.id === e.ziel.id);
    if (!d) return { erlaubt: false, grund: 'Der Bedarf gibt es nicht mehr.' };
    const a = abgleich(ctx, b, d, { ausser: e });
    return a.pruefbitteMoeglich ? { erlaubt: true, grund: null, ergebnis: a.gesamt.key } : { erlaubt: false, grund: `Keine Prüfbitte möglich: ${a.sperrgrund}`, ergebnis: a.gesamt.key };
  }
  const l = lage(ctx, e);
  if (l.haupt.rank === 6 && !l.haupt.wartet) return { erlaubt: true, grund: null };
  return { erlaubt: false, grund: `Keine Prüfbitte möglich: Die Türregel ist noch nicht bei „zur Fachprüfung vorlegen“ (Rang ${l.haupt.rank}). Zuerst offene Anforderungen klären: ${l.haupt.text}.` };
}

// ---------- Liste aller Kandidatenpaare ----------
const gleich = (x, ref) => !ref || (x.projekt === ref.projekt && x.id === ref.id);
// Kandidaten: gleiche Gruppe; Bauteile mit Status „nicht“, festem Ziel, aktivem oder abgeschlossenem Vorgang entfallen,
// ebenso Bedarfe mit aktivem Vorgang und für das Bauteil als ungeeignet beendete Paare. Doppelboden nur im selben Projekt.
export function abgleichListe(ctx, { bauteil, bedarf, ergebnis } = {}) {
  const gewollt = ergebnis ? (Array.isArray(ergebnis) ? ergebnis : [ergebnis]) : null;
  const liste = [];
  for (const b of ctx.daten.bauteile) {
    if (!gleich(b, bauteil) || b.status === 'nicht' || b.ziel) continue;
    if (aktiverVorgang(ctx, b.projekt, b.id) || uebergebenerVorgang(ctx, b.projekt, b.id)) continue;
    for (const d of ctx.daten.bedarfe) {
      if (!gleich(d, bedarf) || d.gruppe !== b.gruppe) continue;
      if (b.gruppe === 'boden' && b.projekt !== d.projekt) continue;
      if (bedarfBelegt(ctx, d.projekt, d.id) || zielUngeeignet(ctx, b.projekt, b.id, { art: 'bedarf', id: d.id, projekt: d.projekt })) continue;
      const a = abgleich(ctx, b, d);
      if (!gewollt || gewollt.includes(a.gesamt.key)) liste.push(a);
    }
  }
  const rang = (a) => ERGEBNIS_REIHENFOLGE.indexOf(a.gesamt.key);
  const frist = (a) => (a.zeit.bestellfrist ? tagNr(a.zeit.bestellfrist) : Number.MAX_SAFE_INTEGER);
  return liste.sort((x, y) => (rang(x) - rang(y)) || (frist(x) - frist(y)) || x.bauteil.projekt.localeCompare(y.bauteil.projekt) || x.bauteil.id.localeCompare(y.bauteil.id) || x.bedarf.id.localeCompare(y.bedarf.id));
}

// ---------- Prüfbitte ----------
// Reiner Schnappschuss des Abgleichs für das Ereignis (nur Daten, keine Objektverweise).
export function schnappschuss(a) {
  const { status, pruefbeginn, pruefende, bestellfrist, annahmeVon, annahmeBis, reserveTage, lagertage, geschaetzt, gruende } = a.zeit;
  return JSON.parse(JSON.stringify({
    schluessel: a.schluessel, stand: a.stand, gesamt: { key: a.gesamt.key, label: a.gesamt.label }, bauteil: { projekt: a.bauteil.projekt, id: a.bauteil.id }, bedarf: { projekt: a.bedarf.projekt, id: a.bedarf.id },
    zeit: { status, pruefbeginn, pruefende, bestellfrist, annahmeVon, annahmeBis, reserveTage, lagertage, geschaetzt, gruende },
    menge: { status: a.menge.status, einheit: a.menge.einheit, angebot: a.menge.angebot, bedarf: a.menge.bedarf, text: a.menge.text }, entfernung: a.entfernung,
  }));
}

// Legt die Zuordnung (neuer Vorgang E-xx) und das Ereignis „pruefbitte“ an. Speichern ist Sache der Oberfläche.
// Liefert { zuordnung, ereignis } oder { fehler: { allgemein } }, wenn der Abgleich die Prüfbitte sperrt.
export function pruefbitteAnlegen(ctx, a) {
  if (!a.pruefbitteMoeglich) return { fehler: { allgemein: a.sperrgrund } };
  const zuordnung = neueEntscheidung(ctx, a.bauteil, { art: 'bedarf', id: a.bedarf.id, projekt: a.bedarf.projekt });
  const mit = { ...ctx, daten: { ...ctx.daten, entscheidungen: [...ctx.daten.entscheidungen, zuordnung] } };
  const r = pruefbitteEreignis(mit, zuordnung, schnappschuss(a));
  return r.fehler ? r : { zuordnung, ereignis: r.ereignis };
}

// Zuordnung im Bauteilpass zu einem Bedarf: nicht möglich, wenn der Abgleich sicher „zu spät“ oder
// „Klärung nötig“ ergibt. „Angaben fehlen“ bleibt möglich, weil sich der Bedarf ergänzen lässt.
export function zuordnungZumBedarf(ctx, bauteil, bedarf) {
  const ergebnis = abgleich(ctx, bauteil, bedarf);
  const gesperrt = ergebnis.gesamt.key === 'spaet' || ergebnis.gesamt.key === 'klaerung';
  return { moeglich: !gesperrt, ergebnis, grund: gesperrt ? `Der Abgleich ergibt „${ergebnis.gesamt.label}“. Details im Abgleich.` : '' };
}
