// Gemeinsame Bausteine für die drei Pitch-Fassungen (Theme, Layouts, Chips, Statuskette, Zeitleisten, Bilder).
// Erzeugt keine Inhalte; die stehen in inhalt-*.js.
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");

const SKILL = process.env.PPTX_SKILL_DIR ||
  "/root/.claude/skills/synced/f3344db3-3b8b-47e1-a86e-4e52d34deb71_ae4ba12a-da81-4210-ae6c-9e30538d0646/pptx";
const { applyTheme } = require(path.join(SKILL, "scripts", "apply_theme.js"));

const BILDER = path.join(__dirname, "..", "bilder");
const FONT = "Arial";
const COL = {
  gruen: "0E5546", gruenHell: "E0EEE8", tinte: "17201D", tinte2: "3F4A45", tinte3: "59655F",
  papier: "F2F3F0", rahmen: "ECEEE9", weiss: "FFFFFF",
  okT: "1F6B42", okF: "E2F1E7", spaetT: "A2261D", spaetF: "FBE5E1",
  achtT: "7D4C00", achtF: "FBECD0", hinwT: "1F4F96", hinwF: "E4ECF8",
  simT: "594810", simF: "F5EECB", grauF: "E4E6E1", linie: "C9CFCB",
};
const THEME = {
  name: "CircularFlow Pitch", headFontFace: FONT, bodyFontFace: FONT,
  colors: {
    dk1: COL.tinte, lt1: COL.weiss, dk2: COL.gruen, lt2: COL.gruenHell,
    accent1: COL.gruen, accent2: COL.okT, accent3: COL.achtT, accent4: COL.hinwT,
    accent5: COL.simT, accent6: COL.spaetT, hlink: COL.hinwT, folHlink: COL.tinte3,
  },
};
const LM = 0.6, CW = 12.13, TOP = 2.15, FUSS_Y = 6.5;
const NAMEN = "Houssam Taleb · Feyrouz Chahed";
const EVENT = "INNOSPRINT Zirkuläres Bauen · Dortmund · 20.11.2026";

const CHIPS = {
  fiktiv: { t: "Fiktiver Pilotfall", fg: COL.simT, bg: COL.simF },
  beispiel: { t: "Beispieldaten", fg: COL.simT, bg: COL.simF },
  simulation: { t: "Simulation", fg: COL.simT, bg: COL.simF },
  annahme: { t: "Annahme, unbestätigt", fg: COL.achtT, bg: COL.achtF },
  hypothese: { t: "Hypothese", fg: COL.hinwT, bg: COL.hinwF },
  hersteller: { t: "Herstellerangabe", fg: COL.tinte2, bg: COL.grauF },
  veranstalter: { t: "Veranstalterangabe", fg: COL.tinte2, bg: COL.grauF },
  vorschlag: { t: "Vorschlag zur Prüfung, keine Freigabe", fg: COL.hinwT, bg: COL.hinwF },
  vorschlagTest: { t: "Vorschlag", fg: COL.hinwT, bg: COL.hinwF },
  weiter: { t: "Weiter prüfen", fg: COL.okT, bg: COL.okF },
  spaet: { t: "Für diese Entscheidung zu spät", fg: COL.spaetT, bg: COL.spaetF },
  projektbeleg: { t: "Projektbeleg", fg: COL.tinte2, bg: COL.grauF },
  knapp: { t: "Knapp", fg: COL.achtT, bg: COL.achtF },
};

let P = null; // aktuelle pptxgenjs-Instanz

function T(slide, text, o) {
  const opt = Object.assign({ fontFace: FONT, fontSize: 16, color: COL.tinte, align: "left", valign: "top", margin: 0, isTextBox: true, fit: "none" }, o);
  slide.addText(text, opt);
}

function chipBreite(text) { return text.length * 0.104 + 0.36; }
function chip(slide, key, x, y, textOverride) {
  const c = typeof key === "string" ? CHIPS[key] : key;
  const t = textOverride || c.t;
  const w = chipBreite(t);
  slide.addText(t, {
    shape: P.ShapeType.roundRect, rectRadius: 0.08, x, y, w, h: 0.36,
    fill: { color: c.bg }, line: { color: c.bg, width: 0.5 },
    fontFace: FONT, fontSize: 14, bold: true, color: c.fg, align: "center", valign: "middle", margin: 0.02, fit: "none",
  });
  return w;
}
// Zeile mit Chips; Einträge sind Schlüssel oder [Schlüssel, Text]
function chipZeile(slide, liste, x, y) {
  let cx = x;
  for (const e of liste) {
    const w = Array.isArray(e) ? chip(slide, e[0], cx, y, e[1]) : chip(slide, e, cx, y);
    cx += w + 0.15;
  }
  return cx;
}

function karte(slide, x, y, w, h, o = {}) {
  slide.addShape(P.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: o.fill || COL.gruenHell }, line: { color: o.line || o.fill || COL.gruenHell, width: o.lw || 0.75 },
  });
}

// ---------- Statuskette ----------
const KETTE = ["Zuordnung", "Prüfbitte", "Fachergebnis", "Vormerkung", "Übergabe geplant", "Übergeben"];
function kette(slide, { x, y, w, dark = false, zustand = null, mini = false, beschriftung = false }) {
  const col = w / 6, d = mini ? 0.46 : 0.62;
  const z = zustand || ["voll", "voll", "voll", "voll", "voll", "voll"];
  for (let i = 0; i < 5; i++) {
    slide.addShape(P.ShapeType.line, {
      x: x + i * col + d + 0.1, y: y + d / 2, w: col - d - 0.2, h: 0,
      line: { color: dark ? "6E9A8E" : "B8C2BD", width: 1.5 },
    });
  }
  for (let i = 0; i < 6; i++) {
    const cx = x + i * col, s = z[i];
    let fill, line, txt, lab;
    if (dark) {
      if (s === "voll") { fill = COL.weiss; line = COL.weiss; txt = COL.gruen; lab = COL.weiss; }
      else if (s === "rand") { fill = COL.gruen; line = COL.weiss; txt = COL.weiss; lab = COL.weiss; }
      else { fill = COL.gruen; line = "6E9A8E"; txt = "A9C7BD"; lab = "A9C7BD"; }
    } else {
      if (s === "voll") { fill = COL.gruen; line = COL.gruen; txt = COL.weiss; lab = COL.tinte; }
      else if (s === "rand") { fill = COL.weiss; line = COL.gruen; txt = COL.gruen; lab = COL.tinte; }
      else { fill = COL.papier; line = COL.linie; txt = COL.tinte3; lab = COL.tinte3; }
    }
    slide.addText(String(i + 1), {
      shape: P.ShapeType.ellipse, x: cx, y, w: d, h: d, fill: { color: fill }, line: { color: line, width: 2.25 },
      fontFace: FONT, fontSize: mini ? 14 : 18, bold: true, color: txt, align: "center", valign: "middle", margin: 0, fit: "none",
    });
    T(slide, KETTE[i], { x: cx, y: y + d + 0.08, w: col - 0.1, h: 0.3, fontSize: 14, bold: true, color: lab });
  }
  if (beschriftung) {
    const by = y + d + 0.5, c = dark ? COL.gruenHell : COL.tinte2;
    T(slide, "in der Vorschau abgebildet", { x, y: by, w: col * 3 - 0.1, h: 0.3, fontSize: 14, color: c });
    T(slide, "nächster Schritt", { x: x + col * 3, y: by, w: col - 0.1, h: 0.3, fontSize: 14, color: c });
  }
}

// Kompakte Statuskette als Reihe (Schritte 1 bis n) mit Zuständen "voll" | "rand"
function ketteZeile(slide, { x, y, w, h = 0.34, schritte, zustand }) {
  const n = schritte.length, g = 0.4, pw = (w - g * (n - 1)) / n;
  schritte.forEach((t, i) => {
    const px = x + i * (pw + g), rand = zustand[i] === "rand";
    slide.addText(`${i + 1}  ${t}`, {
      shape: P.ShapeType.roundRect, rectRadius: 0.08, x: px, y, w: pw, h,
      fill: { color: rand ? COL.weiss : COL.gruen }, line: { color: COL.gruen, width: 1.5 },
      fontFace: FONT, fontSize: 14, bold: true, color: rand ? COL.gruen : COL.weiss, align: "center", valign: "middle", margin: 0.02, fit: "none",
    });
    if (i < n - 1) T(slide, "›", { x: px + pw, y, w: g, h, fontSize: 18, bold: true, color: COL.tinte3, align: "center", valign: "middle" });
  });
}

// ---------- Vier-Punkte-Zeitleiste (Fragen) ----------
const VIER = ["Angebot bekannt", "erreicht die Planung", "Entscheidung bis", "Übergabe möglich"];
function zeit4(slide, { x, y, w, dark = false, fragen = null, hervor = null }) {
  const col = w / 4, d = 0.5;
  slide.addShape(P.ShapeType.line, {
    x: x + d, y: y + d / 2, w: 3 * col - d, h: 0, line: { color: dark ? "6E9A8E" : "B8C2BD", width: 2 },
  });
  for (let i = 0; i < 4; i++) {
    const cx = x + i * col, h = hervor === i;
    let fill, line, txt;
    if (dark) { fill = h ? COL.weiss : COL.gruen; line = COL.weiss; txt = h ? COL.gruen : COL.weiss; }
    else { fill = h ? COL.gruen : COL.weiss; line = COL.gruen; txt = h ? COL.weiss : COL.gruen; }
    slide.addText(String(i + 1), {
      shape: P.ShapeType.ellipse, x: cx, y, w: d, h: d, fill: { color: fill }, line: { color: line, width: 2.25 },
      fontFace: FONT, fontSize: 16, bold: true, color: txt, align: "center", valign: "middle", margin: 0, fit: "none",
    });
    T(slide, VIER[i], { x: cx, y: y + d + 0.12, w: col - 0.2, h: 0.32, fontSize: 16, bold: true, color: dark ? COL.weiss : COL.tinte });
    if (fragen) T(slide, fragen[i], { x: cx, y: y + d + 0.5, w: col - 0.25, h: 1.0, fontSize: 14, color: dark ? COL.gruenHell : COL.tinte2 });
  }
}

// ---------- Fall-Zeitleiste (19.01.–08.03.2027, linear in Tagen) ----------
const FALL_X0 = 0.95, FALL_W = 11.5, FALL_TAGE = 48;
const fx = (d) => FALL_X0 + (d / FALL_TAGE) * FALL_W;
function zeitleisteFall(slide, { bandY = 3.95, marken, legende = true, legendeY = 5.95 }) {
  const bh = 0.35;
  const seg = [[0, 17, "1F6B42"], [17, 18, "C98A12"], [18, 48, COL.spaetT]];
  for (const [a, b, c] of seg) {
    slide.addShape(P.ShapeType.rect, { x: fx(a), y: bandY, w: fx(b) - fx(a), h: bh, fill: { color: c }, line: { color: c, width: 0.25 } });
  }
  for (const m of marken) {
    const x = fx(m.d), up = m.pos === "o", wl = m.w || 1.9, hl = m.h || 1.3;
    const ny = up ? bandY - 0.35 - hl : bandY + bh + 0.35;
    slide.addShape(P.ShapeType.line, up
      ? { x, y: bandY - 0.35, w: 0, h: 0.35, line: { color: COL.tinte3, width: 1 } }
      : { x, y: bandY + bh, w: 0, h: 0.35, line: { color: COL.tinte3, width: 1 } });
    const right = m.rechts;
    const runs = [
      { text: m.datum, options: { bold: true, fontSize: 16, color: COL.tinte, breakLine: true } },
      { text: m.text, options: { fontSize: 14, color: COL.tinte2 } },
    ];
    T(slide, runs, {
      x: right ? x - wl : x, y: ny, w: wl, h: hl, valign: up ? "bottom" : "top", align: right ? "right" : "left",
      margin: right ? [0, 0.1, 0, 0] : [0, 0, 0, 0.1],
    });
    slide.addShape(P.ShapeType.ellipse, { x: x - 0.15, y: bandY + bh / 2 - 0.15, w: 0.3, h: 0.3, fill: { color: COL.weiss }, line: { color: COL.tinte, width: 2 } });
  }
  if (legende) {
    T(slide, "Ergebnis, wenn die Planung an diesem Tag reagiert:", { x: LM, y: legendeY, w: CW, h: 0.3, fontSize: 14, bold: true, color: COL.tinte, valign: "middle" });
    const items = [["1F6B42", "weiter prüfen bis 04.02."], ["C98A12", "knapp: 05.02."], [COL.spaetT, "für diese Entscheidung zu spät ab 06.02."]];
    let cx = LM;
    for (const [c, t] of items) {
      slide.addShape(P.ShapeType.rect, { x: cx, y: legendeY + 0.38, w: 0.24, h: 0.24, fill: { color: c }, line: { color: c, width: 0.25 } });
      const w = t.length * 0.098 + 0.2;
      T(slide, t, { x: cx + 0.34, y: legendeY + 0.34, w, h: 0.32, fontSize: 14, color: COL.tinte2, valign: "middle" });
      cx += 0.34 + w + 0.3;
    }
  }
}

// ---------- Bilder ----------
const BILDMASSE = {
  "k1-uebersicht.jpg": [2160, 1215], "k2-paarliste.jpg": [2160, 1215], "k3-zu-spaet.jpg": [2160, 1215],
  "k4-weiter-pruefen.jpg": [2160, 1215], "k5-vorgang.jpg": [1698, 1217], "k6-vormerkung-anlegen.jpg": [2160, 1215],
  "pilot-pass-angaben.jpg": [1152, 828], "pilot-scan-karte.jpg": [831, 558],
};
try {
  const aj = JSON.parse(fs.readFileSync(path.join(BILDER, "ausschnitte", "ausschnitte.json"), "utf8"));
  for (const [n, d] of Object.entries(aj)) BILDMASSE["ausschnitte/" + n] = [d.w, d.h];
} catch (e) { /* Ausschnitte fehlen: werkzeug/ausschnitte.py ausführen */ }
// Hervorhebungsrahmen eines Ausschnitts (Bruchteile) aus der JSON
function ausschnittRahmen(name) {
  const aj = JSON.parse(fs.readFileSync(path.join(BILDER, "ausschnitte", "ausschnitte.json"), "utf8"));
  return aj[name].hl;
}
function bildGroesse(datei, maxW, maxH) {
  const [pw, ph] = BILDMASSE[datei];
  let w = maxW, h = (maxW * ph) / pw;
  if (h > maxH) { h = maxH; w = (maxH * pw) / ph; }
  return { w, h };
}
// Bild ohne Verzerrung in Box (w oder h begrenzt), oben links; liefert {w,h}
function bildPassend(slide, datei, x, y, maxW, maxH, alt) {
  const [pw, ph] = BILDMASSE[datei];
  let w = maxW, h = (maxW * ph) / pw;
  if (h > maxH) { h = maxH; w = (maxH * pw) / ph; }
  slide.addImage({ path: path.join(BILDER, datei), x, y, w, h, altText: alt });
  return { w, h };
}
// Ausschnitt (Bruchteile des Originals) mit fester Höhe oder Breite
function bildAusschnitt(slide, datei, f, x, y, maxW, maxH, alt) {
  const [pw, ph] = BILDMASSE[datei];
  const cw = f.w * pw, ch = f.h * ph; // Ausschnitt in Pixeln
  let w = maxW, h = (maxW * ch) / cw;
  if (h > maxH) { h = maxH; w = (maxH * cw) / ch; }
  const Wd = w / f.w, Hd = h / f.h; // volle Bildgröße in Zoll bei dieser Skalierung
  slide.addImage({
    path: path.join(BILDER, datei), x, y, w: Wd, h: Hd, altText: alt,
    sizing: { type: "crop", x: f.x * Wd, y: f.y * Hd, w, h },
  });
  return { w, h };
}
function papier(slide, x, y, w, h) {
  slide.addShape(P.ShapeType.rect, { x, y, w, h, fill: { color: COL.papier }, line: { color: COL.rahmen, width: 1 } });
}

// ---------- Deck, Layouts ----------
function neuesDeck(titel) {
  const pres = new pptxgen();
  P = pres;
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: FONT, bodyFontFace: FONT };
  pres.author = "Houssam Taleb · Feyrouz Chahed";
  pres.company = "CircularFlow";
  pres.title = titel;
  pres.subject = "INNOSPRINT Zirkuläres Bauen, Dortmund, 20.11.2026";

  const fuss = (dark) => [
    { text: { text: "CircularFlow · INNOSPRINT 2026", options: { x: LM, y: 6.98, w: 6, h: 0.3, fontFace: FONT, fontSize: 10, color: dark ? COL.gruenHell : COL.tinte3, margin: 0, valign: "middle" } } },
  ];
  const nr = (dark) => ({ x: 11.73, y: 6.98, w: 1.0, h: 0.3, fontFace: FONT, fontSize: 10, color: dark ? COL.gruenHell : COL.tinte3, align: "right", margin: [0, 0, 0, 0] });
  const titelPh = (o) => ({ placeholder: { options: Object.assign({ name: "title", type: "title", x: LM, y: 0.4, w: CW, h: 1.15, fontFace: FONT, fontSize: 32, bold: true, color: COL.tinte, valign: "top", align: "left", margin: 0 }, o), text: "" } });
  const hell = (name) => pres.defineSlideMaster({ title: name, background: { color: COL.weiss }, objects: [titelPh({}), ...fuss(false)], slideNumber: nr(false) });
  ["INHALT", "BILD", "DEMO", "ANHANG"].forEach(hell);
  const dunkel = (name, tp) => pres.defineSlideMaster({
    title: name, background: { color: COL.gruen },
    objects: [
      titelPh(tp),
      ...(name === "TITEL" ? [{ placeholder: { options: { name: "untertitel", type: "body", x: LM, y: 2.85, w: CW, h: 0.5, fontFace: FONT, fontSize: 22, color: COL.gruenHell, valign: "top", align: "left", margin: 0 }, text: "" } }] : []),
      { text: { text: NAMEN, options: { x: LM, y: 5.75, w: CW, h: 0.4, fontFace: FONT, fontSize: 20, bold: true, color: COL.weiss, margin: 0, valign: "top" } } },
      { text: { text: EVENT, options: { x: LM, y: 6.2, w: CW, h: 0.35, fontFace: FONT, fontSize: 16, color: COL.gruenHell, margin: 0, valign: "top" } } },
      ...fuss(true),
    ],
    slideNumber: nr(true),
  });
  dunkel("TITEL", { x: LM, y: 0.7, w: CW, h: 2.0, fontSize: 44, color: COL.weiss });
  dunkel("SCHLUSS", { x: LM, y: 0.55, w: CW, h: 1.95, fontSize: 36, color: COL.weiss });
  return pres;
}

const woerter = (s) => s.split(/\s+/).filter(Boolean).length;
// Schätzregel: 2,3 Wörter je Sekunde, je Folie auf 5 s gerundet (mindestens 5 s)
const sekunden = (text) => Math.max(5, Math.round(woerter(text) / 2.3 / 5) * 5);

// Kürzungsstufe einer Folie, strukturiert abgelegt in notiz.min5 bzw. notiz.min3:
//   { art: "voll" }                    Folie bleibt unverändert (Zeile "bleibt.")
//   { art: "weg", text }               Folie entfällt oder wird ohne Kommentar gezeigt (0 s); text = Zeile
//   { art: "kurz", text, dauer? }      Kurzfassung statt Volltext; Dauer aus der Wortzahl, falls nicht gesetzt
//   { art: "zusatz"|"zuerst", text }   Volltext plus Zusatz am Ende bzw. am Anfang
//   { art: "bild", dauer }             als sichtbare Bildfolie, feste Dauer
// Fehlt eine der beiden Stufen, gilt "voll"; fehlen beide, steht keine Zeile in der Notiz.
function stufeAus(n, key, voll) {
  let st = n[key];
  if (!st) st = { art: "voll" };
  switch (st.art) {
    case "voll": return { zeile: "bleibt.", sek: voll, benannt: !!n[key] };
    case "weg": return { zeile: st.text || "entfällt.", sek: 0, benannt: true };
    case "kurz": {
      const d = st.dauer != null ? st.dauer : sekunden(st.text);
      return { zeile: `Kurzfassung sprechen (etwa ${d} Sekunden): ${st.text}`, sek: d, benannt: true };
    }
    case "zusatz": case "zuerst": {
      const d = st.dauer != null ? st.dauer : sekunden(st.text);
      const wo = st.art === "zusatz" ? "am Ende zusätzlich sagen" : "zuerst sagen";
      return { zeile: `${wo} (etwa ${d} Sekunden): ${st.text}`, sek: voll + d, benannt: true };
    }
    case "bild":
      return { zeile: `als sichtbare Bildfolie zeigen (Kopie der Demo-Folie, sichtbar gestellt, etwa ${st.dauer} Sekunden).`, sek: st.dauer, benannt: true };
    default: throw new Error("Unbekannte Stufe: " + st.art);
  }
}
function notizDaten(n) {
  const voll = n.dauer != null ? n.dauer : sekunden(n.text);
  const s5 = stufeAus(n, "min5", voll), s3 = stufeAus(n, "min3", voll);
  const zeigen = !!(n.min5 || n.min3);
  return { voll, s5, s3, zeigen };
}
function notizText(n) {
  const d = notizDaten(n);
  const teile = [`Spricht: ${n.spricht}`, "", n.text];
  if (n.klick) teile.push("", n.klick);
  if (d.zeigen) teile.push("", `Bei 5 Minuten: ${d.s5.zeile}`, "", `Bei 3 Minuten: ${d.s3.zeile}`);
  teile.push("", `Dauer: etwa ${d.voll} Sekunden`);
  return { text: teile.join("\n"), dauer: d.voll };
}
// Summen je Fassung aus denselben Daten wie die Notizen. Folien mit notiz.ausSumme (Anhang-Demo in C) zählen nicht.
function summen(folien) {
  const r = { voll: 0, min5: 0, min3: 0, anteil: {} };
  for (const f of folien) {
    if (f.notiz.ausSumme) continue;
    const d = notizDaten(f.notiz);
    r.voll += d.voll; r.min5 += d.s5.sek; r.min3 += d.s3.sek;
    const p = f.notiz.spricht;
    if (d.voll > 0) r.anteil[p] = (r.anteil[p] || 0) + d.voll;
  }
  return r;
}

// Baut ein Deck aus einer Liste von Folien-Beschreibungen
async function baue(pres, folien, datei) {
  const nr = {};
  folien.forEach((f, i) => { if (f.id) nr[f.id] = i + 1; });
  let aktAbschnitt = null;
  const dauern = [];
  for (const f of folien) {
    if (f.abschnitt && f.abschnitt !== aktAbschnitt) { pres.addSection({ title: f.abschnitt }); aktAbschnitt = f.abschnitt; }
    const s = pres.addSlide({ masterName: f.layout, sectionTitle: aktAbschnitt });
    if (f.versteckt) s.hidden = true;
    s.addText(f.titel, { placeholder: "title" });
    if (f.layout === "TITEL") s.addText(f.untertitel, { placeholder: "untertitel" });
    if (f.layout !== "TITEL" && f.layout !== "SCHLUSS") {
      let cx = LM;
      if (f.kopf) {
        const w = f.kopf.length * 0.098 + 0.3;
        T(s, f.kopf, { x: LM, y: 1.62, w, h: 0.36, fontSize: 14, color: COL.tinte2, valign: "middle" });
        cx = LM + w + 0.15;
      }
      if (f.chips) chipZeile(s, f.chips, cx, 1.62);
    }
    if (f.fuss) T(s, f.fuss, { x: LM, y: FUSS_Y, w: 11.0, h: 0.42, fontSize: 10, color: COL.tinte3, valign: "bottom" });
    if (f.zeichne) f.zeichne(s, { nr, chip, chipZeile });
    const nt = notizText(f.notiz);
    s.addNotes(nt.text);
    dauern.push(nt.dauer);
  }
  await pres.writeFile({ fileName: datei });
  await applyTheme(datei, THEME);
  return { nr, dauern };
}

module.exports = {
  COL, FONT, LM, CW, TOP, THEME, CHIPS, T, chip, chipZeile, karte, kette, zeit4, zeitleisteFall, fx,
  bildPassend, bildGroesse, bildAusschnitt, ausschnittRahmen, ketteZeile, papier, neuesDeck, baue, woerter, sekunden, summen, notizDaten, getP: () => P,
};
