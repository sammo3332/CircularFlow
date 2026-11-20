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

// ---------- Bausteine für das 5-Minuten-Deck (P5) ----------
// Türsymbol: abgerundetes Rechteck mit kleinem Griff. Stil: "normal" | "hervor" (gefüllt) | "gesucht" (gestrichelt)
function tuer(slide, x, y, w, h, stil = "normal", dark = false) {
  let fill, line, griff, dash = "solid";
  if (stil === "hervor") { fill = dark ? COL.weiss : COL.gruen; line = fill; griff = dark ? COL.gruen : COL.weiss; }
  else if (stil === "gesucht") { fill = null; line = dark ? COL.weiss : COL.gruen; griff = line; dash = "dash"; }
  else { fill = dark ? "1B6554" : COL.grauF; line = dark ? "6E9A8E" : COL.linie; griff = dark ? "9CBFB4" : "9AA39E"; }
  slide.addShape(P.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.1,
    fill: fill ? { color: fill } : { color: COL.weiss, transparency: 100 },
    line: { color: line, width: 2, dashType: dash },
  });
  const gd = Math.min(w, h) * 0.16;
  slide.addShape(P.ShapeType.ellipse, { x: x + w * 0.74 - gd / 2, y: y + h * 0.52, w: gd, h: gd, fill: { color: griff }, line: { color: griff, width: 0.25 } });
}
// Raster aus Türsymbolen; stil(i) liefert den Stil der i-ten Tür (zeilenweise)
function tuerGitter(slide, { x, y, cols, rows, tw, th, gap, stil, dark = false }) {
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    tuer(slide, x + c * (tw + gap), y + r * (th + gap), tw, th, stil(r * cols + c, c, r), dark);
  }
  return { w: cols * tw + (cols - 1) * gap, h: rows * th + (rows - 1) * gap };
}
// Uhr (Kreis mit zwei Zeigern), Mittelpunkt cx, cy
function uhr(slide, cx, cy, d, farbe) {
  slide.addShape(P.ShapeType.ellipse, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: farbe === COL.weiss ? COL.gruen : COL.weiss }, line: { color: farbe, width: 2.5 } });
  slide.addShape(P.ShapeType.line, { x: cx, y: cy - d * 0.32, w: 0, h: d * 0.32, line: { color: farbe, width: 2.5 } });
  slide.addShape(P.ShapeType.line, { x: cx, y: cy, w: d * 0.24, h: 0, line: { color: farbe, width: 2.5 } });
}
// Unterbrochener Pfeil von x0 nach x1 auf Höhe cy mit Uhr in der Lücke
function pfeilUnterbrochen(slide, { x0, x1, cy, farbe, uhrD = 0.75 }) {
  const mx = (x0 + x1) / 2, luecke = uhrD + 0.3;
  slide.addShape(P.ShapeType.line, { x: x0, y: cy, w: mx - luecke / 2 - x0, h: 0, line: { color: farbe, width: 3 } });
  slide.addShape(P.ShapeType.line, { x: mx + luecke / 2, y: cy, w: x1 - mx - luecke / 2, h: 0, line: { color: farbe, width: 3, endArrowType: "triangle" } });
  uhr(slide, mx, cy, uhrD, farbe);
}

// Vereinfachte Zeitleiste mit drei Marken, Klammer und Farbband grün/gelb/rot (linear in Tagen)
// d = Tage ab Start; band = [[von, bis, Farbe]]; marken: {d, datum, text, ausr: "l"|"m"|"r"}
function zeitleisteDrei(slide, { x0 = 0.95, w = 11.5, tage = 33, bandY, bh = 0.45, band, marken, klammer, legende }) {
  const X = (d) => x0 + (d / tage) * w;
  for (const [a, b, c] of band) slide.addShape(P.ShapeType.rect, { x: X(a), y: bandY, w: X(b) - X(a), h: bh, fill: { color: c }, line: { color: c, width: 0.25 } });
  const lw = 3.5, lh = 1.05;
  for (const m of marken) {
    const x = X(m.d);
    slide.addShape(P.ShapeType.line, { x, y: bandY - 0.3, w: 0, h: 0.3 + bh / 2, line: { color: COL.tinte3, width: 1.25 } });
    const lx = m.ausr === "l" ? LM : m.ausr === "r" ? LM + CW - lw : x - lw / 2;
    T(slide, [
      { text: m.datum, options: { bold: true, fontSize: 22, color: COL.tinte, breakLine: true } },
      { text: m.text, options: { fontSize: 20, color: COL.tinte2 } },
    ], { x: lx, y: bandY - 0.3 - 0.08 - lh, w: lw, h: lh, valign: "bottom", align: m.ausr === "l" ? "left" : m.ausr === "r" ? "right" : "center" });
    slide.addShape(P.ShapeType.ellipse, { x: x - 0.17, y: bandY + bh / 2 - 0.17, w: 0.34, h: 0.34, fill: { color: COL.weiss }, line: { color: COL.tinte, width: 2.5 } });
  }
  if (klammer) {
    const xa = X(klammer.von), xb = X(klammer.bis), yb = bandY + bh + 0.42;
    const lo = { color: COL.tinte, width: 2 };
    slide.addShape(P.ShapeType.line, { x: xa, y: yb, w: xb - xa, h: 0, line: lo });
    slide.addShape(P.ShapeType.line, { x: xa, y: yb - 0.2, w: 0, h: 0.2, line: lo });
    slide.addShape(P.ShapeType.line, { x: xb, y: yb - 0.2, w: 0, h: 0.2, line: lo });
    T(slide, klammer.text, { x: xa, y: yb + 0.08, w: xb - xa, h: 0.4, fontSize: 22, bold: true, align: "center", color: COL.tinte });
  }
  if (legende) {
    T(slide, legende.titel, { x: LM, y: legende.y, w: CW, h: 0.4, fontSize: 20, bold: true, color: COL.tinte, valign: "middle" });
    const runs = [];
    legende.eintraege.forEach(([c, t], i) => {
      if (i > 0) runs.push({ text: " · ", options: { color: COL.tinte3, bold: true } });
      runs.push({ text: t, options: { color: c, bold: true } });
    });
    T(slide, runs, { x: LM, y: legende.y + 0.5, w: CW, h: 0.45, fontSize: 24, valign: "middle" });
  }
}

// Eingabe-Ampel: drei Eingabekästen, Pfeil, Frage, Pfeil, drei Ergebnisse (grün/gelb/rot = Zeitstatus)
function eingabeAmpel(slide, { y, eingaben, frage, ergebnisse }) {
  const g = 0.35, bw = (CW - 2 * g) / 3, bh = 0.7;
  eingaben.forEach((t, i) => {
    const x = LM + i * (bw + g);
    karte(slide, x, y, bw, bh, { fill: COL.gruenHell, line: COL.gruen, lw: 1.5 });
    T(slide, t, { x, y, w: bw, h: bh, fontSize: 22, bold: true, color: COL.gruen, align: "center", valign: "middle" });
  });
  const qy = y + bh + 0.55, qw = 6.6, qx = LM + (CW - qw) / 2;
  slide.addShape(P.ShapeType.downArrow, { x: LM + CW / 2 - 0.2, y: y + bh + 0.08, w: 0.4, h: 0.4, fill: { color: COL.tinte3 }, line: { color: COL.tinte3, width: 0.25 } });
  slide.addText(frage, {
    shape: P.ShapeType.roundRect, rectRadius: 0.1, x: qx, y: qy, w: qw, h: 0.75, fill: { color: COL.gruen }, line: { color: COL.gruen, width: 0.5 },
    fontFace: FONT, fontSize: 24, bold: true, color: COL.weiss, align: "center", valign: "middle", margin: 0.05, fit: "none",
  });
  const ry = qy + 0.75 + 0.55;
  slide.addShape(P.ShapeType.downArrow, { x: LM + CW / 2 - 0.2, y: qy + 0.75 + 0.08, w: 0.4, h: 0.4, fill: { color: COL.tinte3 }, line: { color: COL.tinte3, width: 0.25 } });
  ergebnisse.forEach(([t, fg, bg], i) => {
    const x = LM + i * (bw + g);
    slide.addText(t, {
      shape: P.ShapeType.roundRect, rectRadius: 0.1, x, y: ry, w: bw, h: 0.75, fill: { color: bg }, line: { color: fg, width: 2 },
      fontFace: FONT, fontSize: 24, bold: true, color: fg, align: "center", valign: "middle", margin: 0.05, fit: "none",
    });
  });
  return { bis: ry + 0.75 };
}

// Kette angeboten → geprüft → eingebaut (senkrecht, für schmale Spalten)
function kettePilot(slide, { x, y, w, stufen, darunter }) {
  const bh = 0.8, ab = 0.45;
  stufen.forEach((t, i) => {
    const sy = y + i * (bh + ab), letzte = i === stufen.length - 1;
    slide.addText(t, {
      shape: P.ShapeType.roundRect, rectRadius: 0.1, x, y: sy, w, h: bh, fill: { color: letzte ? COL.gruen : COL.gruenHell }, line: { color: COL.gruen, width: 2 },
      fontFace: FONT, fontSize: 22, bold: true, color: letzte ? COL.weiss : COL.gruen, align: "center", valign: "middle", margin: 0.08, fit: "none",
    });
    if (!letzte) slide.addShape(P.ShapeType.downArrow, { x: x + w / 2 - 0.2, y: sy + bh + 0.04, w: 0.4, h: ab - 0.08, fill: { color: COL.tinte3 }, line: { color: COL.tinte3, width: 0.25 } });
  });
  const dy = y + stufen.length * bh + (stufen.length - 1) * ab + 0.2;
  T(slide, darunter, { x, y: dy, w, h: 0.9, fontSize: 20, color: COL.tinte2, align: "center" });
  return { bis: dy + 0.9 };
}

// Personenkarte: Name fett, darunter Beschreibung
function personenKarte(slide, { x, y, w, h, name, text, fill = COL.gruenHell }) {
  karte(slide, x, y, w, h, { fill });
  T(slide, [
    { text: name, options: { bold: true, fontSize: 22, color: COL.gruen, breakLine: true } },
    { text, options: { fontSize: 20, color: COL.tinte } },
  ], { x: x + 0.2, y: y + 0.12, w: w - 0.4, h: h - 0.24, valign: "top", lineSpacingMultiple: 0.9 });
}

// Mengenleiste: n Türen, die ersten `belegt` gefüllt (vorgemerkt), die übrigen gestrichelt (offen); Beschriftung darunter
function mengenleiste(slide, { x, y, n, belegt, tw = 1.0, th = 1.7, gap = 0.3, textBelegt, textOffen }) {
  for (let i = 0; i < n; i++) tuer(slide, x + i * (tw + gap), y, tw, th, i < belegt ? "hervor" : "gesucht", false);
  const bw = belegt * tw + (belegt - 1) * gap, ox = x + belegt * (tw + gap);
  const ly = y + th + 0.12;
  slide.addShape(P.ShapeType.line, { x, y: ly, w: bw, h: 0, line: { color: COL.gruen, width: 2 } });
  T(slide, textBelegt, { x, y: ly + 0.06, w: bw, h: 0.4, fontSize: 16, bold: true, color: COL.gruen, align: "center" });
  slide.addShape(P.ShapeType.line, { x: ox, y: ly, w: (n - belegt) * tw + (n - belegt - 1) * gap, h: 0, line: { color: COL.tinte, width: 2, dashType: "dash" } });
  T(slide, textOffen, { x: ox - 0.2, y: ly + 0.06, w: tw + 0.4, h: 0.4, fontSize: 16, bold: true, color: COL.tinte, align: "center" });
  return { w: n * tw + (n - 1) * gap, bis: ly + 0.5 };
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
function neuesDeck(titel, opt = {}) {
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
  const hell = (name) => pres.defineSlideMaster({ title: name, background: { color: COL.weiss }, objects: [titelPh(opt.p5 ? { fontSize: 34 } : {}), ...fuss(false)], slideNumber: nr(false) });
  ["INHALT", "BILD", "DEMO", "ANHANG"].forEach(hell);
  if (opt.p5) {
    // Pitch 5 Minuten: dunkle Layouts ohne feste Namenszeilen, Titel 34 pt
    const dunkelP5 = (name) => pres.defineSlideMaster({
      title: name, background: { color: COL.gruen }, objects: [titelPh({ x: LM, y: 0.5, w: CW, h: 1.3, fontSize: 34, color: COL.weiss }), ...fuss(true)], slideNumber: nr(true),
    });
    dunkelP5("P5TITEL"); dunkelP5("P5SCHLUSS");
    return pres;
  }
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
//   { art: "bild", dauer, regie? }             als sichtbare Bildfolie, feste Dauer
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
      return { zeile: `als sichtbare Bildfolie zeigen (Kopie der Demo-Folie, sichtbar gestellt, etwa ${st.dauer} Sekunden).${st.regie ? " " + st.regie : ""}`, sek: st.dauer, benannt: true };
    default: throw new Error("Unbekannte Stufe: " + st.art);
  }
}
function notizDaten(n) {
  const voll = n.dauer != null ? n.dauer : sekunden(n.text);
  const s5 = stufeAus(n, "min5", voll), s3 = stufeAus(n, "min3", voll);
  const zeigen = !!(n.min5 || n.min3);
  return { voll, s5, s3, zeigen };
}
// Notizformat des 5-Minuten-Decks: n.absaetze (Liste von Absätzen), n.zeitfenster (Zeile am Ende) oder n.zeit {sek, uhr}
function notizTextP5(n) {
  const teile = [`Spricht: ${n.spricht}`, "", n.absaetze.join("\n\n"), "", n.zeitfenster || `Zeitfenster: etwa ${n.zeit.sek} Sekunden · Uhr am Ende: ${n.zeit.uhr}`];
  return { text: teile.join("\n"), dauer: n.zeit ? n.zeit.sek : 0 };
}
function notizText(n) {
  if (n.absaetze) return notizTextP5(n);
  const d = notizDaten(n);
  const teile = [`Spricht: ${n.spricht}`, "", n.text];
  if (n.klick) teile.push("", n.klick);
  if (d.zeigen) teile.push("", `Bei 5 Minuten: ${d.s5.zeile}`, "", `Bei 3 Minuten: ${d.s3.zeile}`);
  teile.push("", `Dauer (voll): etwa ${d.voll} Sekunden`);
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
    if (f.fuss) T(s, f.fuss, { x: LM, y: FUSS_Y, w: 11.0, h: 0.42, fontSize: f.fussPt || 10, color: f.fussFarbe || COL.tinte3, valign: "bottom" });
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
  tuer, tuerGitter, uhr, pfeilUnterbrochen, zeitleisteDrei, eingabeAmpel, kettePilot, personenKarte, mengenleiste,
  bildPassend, bildGroesse, bildAusschnitt, ausschnittRahmen, ketteZeile, papier, neuesDeck, baue, woerter, sekunden, summen, notizDaten, getP: () => P,
};
