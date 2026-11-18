// Eigene Vektorgrafiken der Musterfolien (SVG). Jede Grafik ist ein eigenes, in Canva verschiebbares Element.
// Keine fremden Bilder, keine Schrift in den Grafiken (Beschriftungen sind bearbeitbarer Text auf der Folie).
const { F } = require('./basis');
const svg = (w, h, inhalt) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${inhalt}</svg>\n`;

const TUER = { w: 74, h: 164, abstand: 12 };
const PANEEL = '#DD8E24';
// Eine Tür: Türblatt, zwei Füllungen, Drücker
const tuerTeile = (x = 0, y = 0, blatt = F.bernstein, fuellung = PANEEL) =>
  `<rect x="${x}" y="${y}" width="74" height="164" rx="5" fill="${blatt}"/>` +
  `<rect x="${x + 11}" y="${y + 13}" width="52" height="58" rx="3" fill="${fuellung}"/>` +
  `<rect x="${x + 11}" y="${y + 84}" width="52" height="67" rx="3" fill="${fuellung}"/>` +
  `<rect x="${x + 53}" y="${y + 75}" width="15" height="6" rx="3" fill="${F.tinte}"/>`;
const reiheBreite = (n) => n * TUER.w + (n - 1) * TUER.abstand;

const grafiken = {
  // Produktzeichen der Plattform: abgerundetes Quadrat mit dem Kreislauf-Symbol (Pfade aus plattform/app/ui.js)
  'marke-gruen': () => svg(56, 56, `<rect width="56" height="56" rx="14" fill="${F.gruen}"/>${kreislauf(F.weiss)}`),
  'marke-hell': () => svg(56, 56, `<rect width="56" height="56" rx="14" fill="${F.creme}"/>${kreislauf(F.gruen)}`),
  'tuer': () => svg(TUER.w, TUER.h, tuerTeile()),
  // sechs angebotene Türen
  'tueren-angeboten': () => svg(reiheBreite(6), TUER.h, [0, 1, 2, 3, 4, 5].map((i) => tuerTeile(i * (TUER.w + TUER.abstand))).join('')),
  // sechs gesuchte Türen: leere, gestrichelte Umrisse
  'tueren-gesucht': () => svg(reiheBreite(6), TUER.h, [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${i * (TUER.w + TUER.abstand) + 2.5}" y="2.5" width="69" height="159" rx="5" fill="${F.creme}" fill-opacity="0.08" stroke="${F.creme}" stroke-width="4" stroke-dasharray="13 9" stroke-linecap="round"/>`).join('')),
  // Bürohaus (Rückbau)
  'haus-lindenhof': () => {
    let s = `<rect x="0" y="0" width="236" height="18" rx="4" fill="#2A8C74"/><rect x="10" y="18" width="216" height="332" fill="${F.gruenMittel}"/>`;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const hell = (r === 1 && c === 2) || (r === 2 && c === 0); s += `<rect x="${30 + c * 65}" y="${44 + r * 64}" width="46" height="42" rx="3" fill="${hell ? '#F7CF8A' : F.gruen}"/>`; }
    return svg(236, 350, s + `<rect x="96" y="298" width="44" height="52" fill="${F.gruenTief}"/>`);
  },
  // Gebäude im Umbau mit Gerüst
  'umbau-am-kanal': () => {
    let s = `<rect x="0" y="0" width="236" height="18" rx="4" fill="#2A8C74"/><rect x="10" y="18" width="216" height="332" fill="${F.gruenMittel}"/>`;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) s += `<rect x="${30 + c * 98}" y="${44 + r * 64}" width="78" height="42" rx="3" fill="${(r === 0 && c === 1) ? '#F7CF8A' : F.gruen}"/>`;
    const g = `stroke="${F.creme}" stroke-linecap="round"`;
    for (const x of [5, 118, 231]) s += `<line x1="${x}" y1="30" x2="${x}" y2="350" ${g} stroke-width="4" opacity="0.9"/>`;
    for (const y of [98, 162, 226, 290]) s += `<line x1="5" y1="${y}" x2="231" y2="${y}" ${g} stroke-width="5" opacity="0.9"/>`;
    s += `<line x1="5" y1="98" x2="118" y2="162" ${g} stroke-width="3" opacity="0.6"/><line x1="118" y1="226" x2="231" y2="290" ${g} stroke-width="3" opacity="0.6"/>`;
    return svg(236, 350, s);
  },
  // Der Weg vom Angebot zum Bedarf als Bogen, an der höchsten Stelle von der Uhr unterbrochen („fünf nach zwölf“)
  'bogen-zu-spaet': () => {
    // Kreisbogen durch (588|566), Scheitel (960|430) und (1332|566): Radius 576,76, Mittelpunkt (960|1006,76)
    const R = 576.76, MY = 1006.76, ox = 570, oy = 356; const P = (x, y) => `${(x - ox).toFixed(1)} ${(y - oy).toFixed(1)}`;
    const yAuf = (x) => MY - Math.sqrt(R * R - (x - 960) * (x - 960));
    const cx = 960 - ox, cy = 430 - oy;
    let s = `<path d="M${P(588, 566)}A${R} ${R} 0 0 1 ${P(862, yAuf(862))}" fill="none" stroke="${F.creme}" stroke-width="7" stroke-dasharray="20 15" stroke-linecap="round"/>`;
    s += `<path d="M${P(1048, yAuf(1048))}A${R} ${R} 0 0 1 ${P(1332, 566)}" fill="none" stroke="${F.creme}" stroke-width="7" stroke-dasharray="20 15" stroke-linecap="round" opacity="0.28"/>`;
    // Pfeilspitze in Laufrichtung kurz vor der Uhr (Spitze bei x = 890, Tangente etwa -8,4 Grad)
    const tx = 890, ty = yAuf(890), n = Math.hypot(ty - MY, tx - 960), c = -(ty - MY) / n, sn = (tx - 960) / n;
    const bx = tx - 30 * c, by = ty - 30 * sn;
    s += `<path d="M${P(tx, ty)}L${P(bx - 14 * sn, by + 14 * c)}L${P(bx + 14 * sn, by - 14 * c)}Z" fill="${F.creme}"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="64" fill="${F.rot}"/><circle cx="${cx}" cy="${cy}" r="51" fill="${F.creme}"/>`;
    for (const [dx, dy] of [[0, -43], [43, 0], [0, 43], [-43, 0]]) s += `<circle cx="${cx + dx}" cy="${cy + dy}" r="3.5" fill="${F.tinte3}"/>`;
    s += `<line x1="${cx}" y1="${cy}" x2="${cx + 1}" y2="${cy - 25}" stroke="${F.tinte}" stroke-width="8" stroke-linecap="round"/>`;
    s += `<line x1="${cx}" y1="${cy}" x2="${cx + 19}" y2="${cy - 33}" stroke="${F.rot}" stroke-width="6" stroke-linecap="round"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="6" fill="${F.tinte}"/>`;
    return svg(780, 224, s);
  },
  // Container, aus dem eine Tür ragt
  'container': () => svg(156, 104,
    `<g transform="rotate(-16 62 50)"><rect x="46" y="2" width="34" height="76" rx="3" fill="#E79A30"/></g>` +
    `<g transform="rotate(20 96 50)"><rect x="80" y="0" width="36" height="80" rx="3" fill="${F.bernstein}"/><rect x="86" y="7" width="24" height="26" rx="2" fill="${PANEEL}"/><rect x="86" y="40" width="24" height="30" rx="2" fill="${PANEEL}"/></g>` +
    `<path d="M10 46H146L128 98H28Z" fill="${F.gruenHell}"/><rect x="2" y="40" width="152" height="13" rx="5" fill="${F.creme}"/>` +
    `<path d="M52 60L56 92M78 60V92M104 60L100 92" stroke="${F.gruen}" stroke-width="4" stroke-linecap="round" opacity="0.3" fill="none"/>`),
  // Lieferwagen mit neuer Tür
  'lieferung': () => svg(156, 104,
    `<rect x="4" y="18" width="92" height="62" rx="6" fill="${F.creme}"/>` +
    `<rect x="38" y="28" width="24" height="44" rx="2.5" fill="none" stroke="${F.gruen}" stroke-width="4"/><circle cx="56" cy="51" r="2.6" fill="${F.gruen}"/>` +
    `<path d="M100 36H128L150 58V80H100Z" fill="${F.gruenHell}"/><path d="M107 43H125L138 57H107Z" fill="${F.gruen}"/>` +
    `<circle cx="34" cy="84" r="13" fill="${F.tinte}"/><circle cx="34" cy="84" r="5" fill="${F.creme}"/><circle cx="124" cy="84" r="13" fill="${F.tinte}"/><circle cx="124" cy="84" r="5" fill="${F.creme}"/>`),
  // Symbole der drei Angaben (Produktfolie)
  'symbol-bauteil': () => svg(72, 72, scheibe() + strich(`<path d="M36 17L53 26.5V45.5L36 55L19 45.5V26.5Z"/><path d="M19 26.5L36 36L53 26.5M36 36V55"/>`)),
  'symbol-bestellfrist': () => svg(72, 72, scheibe() + `<rect x="38" y="38" width="11" height="10" rx="2" fill="${F.bernstein}"/>` + strich(`<rect x="16" y="20" width="40" height="35" rx="5"/><path d="M16 31H56M27 15V23M45 15V23"/>`)),
  'symbol-pruefzeit': () => svg(72, 72, scheibe() + `<path d="M36 40V24A16 16 0 0 1 49.86 32Z" fill="${F.bernstein}"/>` + strich(`<circle cx="36" cy="40" r="16"/><path d="M36 18V24M31 17H41M36 40L44 32"/>`)),
  // Mauszeiger
  'zeiger': () => svg(48, 60, `<path d="M7 5V47L18 37L26 55L33 52L25 34H40Z" fill="${F.weiss}" stroke="${F.tinte}" stroke-width="3.5" stroke-linejoin="round"/>`),
};
function kreislauf(farbe) {
  return `<g transform="translate(12 12) scale(1.3333)" fill="none" stroke="${farbe}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 4.5A8.5 8.5 0 0 0 4.2 9"/><path d="M4 4v5h5"/><path d="M7 19.5A8.5 8.5 0 0 0 19.8 15"/><path d="M20 20v-5h-5"/></g>`;
}
const scheibe = () => `<circle cx="36" cy="36" r="36" fill="${F.gruenHell}"/>`;
const strich = (inhalt) => `<g fill="none" stroke="${F.gruen}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${inhalt}</g>`;

module.exports = { grafiken, TUER, reiheBreite };
