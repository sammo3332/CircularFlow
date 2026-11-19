// Pilotraum: gemeinsamer Datenstand über den Pilotserver (plattform/server/pilotserver.mjs). Ohne Verbindung bleibt alles lokal.
// Die Verbindung (Serveradresse und Schlüssel) liegt getrennt vom Datenstand im Browserspeicher dieses Geräts.
export const PILOTRAUM_SCHLUESSEL = 'circularflow-pilotraum-v1';
export function pilotraumLaden(speicher) {
  try { const d = JSON.parse(speicher?.getItem(PILOTRAUM_SCHLUESSEL) || 'null'); return d && typeof d.url === 'string' && typeof d.schluessel === 'string' ? { url: d.url, schluessel: d.schluessel, ...(typeof d.raum === 'string' ? { raum: d.raum } : {}) } : null; } catch { return null; }
}
export function pilotraumSpeichern(speicher, cfg) { try { if (cfg) speicher?.setItem(PILOTRAUM_SCHLUESSEL, JSON.stringify({ url: cfg.url, schluessel: cfg.schluessel, ...(cfg.raum ? { raum: cfg.raum } : {}) })); else speicher?.removeItem(PILOTRAUM_SCHLUESSEL); } catch { /* ohne Speicher */ } }

const basis = (url) => String(url || '').replace(/\/+$/, '');
async function anfrage(cfg, pfad, { methode = 'GET', body = null } = {}) {
  let res;
  try { res = await fetch(`${basis(cfg.url)}${pfad}`, { method: methode, headers: { authorization: `Bearer ${cfg.schluessel}`, ...(body ? { 'content-type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' }); }
  catch { throw new Error('Der Pilotserver ist nicht erreichbar. Adresse prüfen oder Server starten.'); }
  let daten = null; try { daten = await res.json(); } catch { /* keine JSON-Antwort */ }
  if (res.status === 409) return { konflikt: true, ...daten };
  if (!res.ok) throw new Error(daten?.fehler || `Der Pilotserver antwortet mit Fehler ${res.status}.`);
  return daten;
}
export const raumInfo = (cfg) => anfrage(cfg, '/api/raum');
export const standHolen = (cfg) => anfrage(cfg, '/api/raum/stand');
export const standSchreiben = (cfg, basisVersion, daten) => anfrage(cfg, '/api/raum/stand', { methode: 'PUT', body: { basisVersion, daten } });

