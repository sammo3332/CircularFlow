// Berliner Wanduhrzeit als Zeichenkette ("YYYY-MM-DDTHH:mm"). Vergleiche ohne Gerätezeitzone.
export const WT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export function teile(s) {
  const [d, t = '00:00'] = String(s).split('T');
  const [y, m, dd] = d.split('-').map(Number);
  const [h, mi] = t.split(':').map(Number);
  return { y, m, dd, h, mi };
}
export function minuten(s) { const p = teile(s); return Date.UTC(p.y, p.m - 1, p.dd, p.h, p.mi) / 60000; }
export function istDatum(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(s ?? ''))) return false;
  const p = teile(s); const d = new Date(Date.UTC(p.y, p.m - 1, p.dd));
  return d.getUTCFullYear() === p.y && d.getUTCMonth() === p.m - 1 && d.getUTCDate() === p.dd;
}
export function zeit(s, mitTag = true) {
  const p = teile(s); const wt = WT[new Date(Date.UTC(p.y, p.m - 1, p.dd)).getUTCDay()];
  const d = `${String(p.dd).padStart(2, '0')}.${String(p.m).padStart(2, '0')}.`;
  return `${mitTag ? wt + ' ' : ''}${d}, ${String(p.h).padStart(2, '0')}:${String(p.mi).padStart(2, '0')}`;
}
export function datum(s) { const p = teile(s); return `${String(p.dd).padStart(2, '0')}.${String(p.m).padStart(2, '0')}.${p.y}`; }
export function abstand(ziel, jetzt) {
  const diff = minuten(ziel) - minuten(jetzt); const a = Math.abs(diff);
  const tage = Math.floor(a / 1440), std = Math.floor((a % 1440) / 60), min = a % 60;
  const text = tage ? `${tage} Tg.${std ? ` ${std} Std.` : ''}` : std ? `${std} Std.${min ? ` ${min} Min.` : ''}` : `${min} Min.`;
  if (diff === 0) return { text: 'genau jetzt', vorbei: false };
  return diff > 0 ? { text: `noch ${text}`, vorbei: false } : { text: `seit ${text} vorbei`, vorbei: true };
}
// Umkehrung von minuten(): Minutenzahl zurück in die Wanduhrzeit „YYYY-MM-DDTHH:mm“.
export const ausMinuten = (n) => new Date(n * 60000).toISOString().slice(0, 16);
export const bis = (s, at) => Boolean(s) && minuten(s) <= minuten(at);

// Echte Uhrzeit in Berlin als Wanduhrzeit „YYYY-MM-DDTHH:mm“, unabhängig von der Zeitzone des Geräts.
// Für den Projektradar: Quellen, Meldungen und Prüfschritte sind echte Vorgänge, keine Projektzeit-Simulation.
export function jetztBerlin(datum = new Date()) {
  const t = Object.fromEntries(new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(datum).filter((x) => x.type !== 'literal').map((x) => [x.type, x.value]));
  return `${t.year}-${t.month}-${t.day}T${t.hour}:${t.minute}`;
}
