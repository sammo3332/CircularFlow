// Leaflet-Karte der Startseite. Grundlage sind die Bezirksgrenzen aus dem Repository, damit die Karte
// auch ohne Internet funktioniert. Die Straßenkarte (OpenStreetMap) ist eine zuschaltbare Ergänzung.
import { esc } from './ui.js';

let karte = null;
let markerSchicht = null;
let osm = null;

export function karteEntfernen(ansicht) {
  if (karte) {
    if (ansicht) { const c = karte.getCenter(); ansicht.mitte = [c.lat, c.lng]; ansicht.zoom = karte.getZoom(); }
    karte.remove(); karte = null; markerSchicht = null; osm = null;
  }
}

// projekte: [{ p, popupHtml, aktiv }]; meldeFehler(text) zeigt Hinweise unter der Karte.
export function karteMontieren(el, { region, geo, projekte, ansicht, osmAn, meldeFehler }) {
  if (!window.L) throw new Error('Leaflet nicht geladen');
  const L = window.L;
  karte = L.map(el, { zoomControl: true, attributionControl: true, minZoom: 9, maxZoom: 17, zoomSnap: 0.25 });
  // Bezirksnamen liegen unter den Projektmarkern (Markerebene 600).
  karte.createPane('bezirksnamen').style.zIndex = 450;
  el.classList.toggle('mit-strassenkarte', Boolean(osmAn));
  karte.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
  if (geo) {
    const bezirke = L.geoJSON(geo, {
      interactive: false,
      // Farben kommen aus styles.css (Klasse bezirk-flaeche), damit ein Wechsel zwischen Hell und Dunkel sofort greift.
      style: () => ({ className: 'bezirk-flaeche', weight: 1.3 }),
      attribution: esc(region.grenzenQuelle),
    }).addTo(karte);
    for (const f of geo.features) {
      if (!f.properties.mitte) continue;
      // Doppelnamen zweizeilig (Innenstadt-West), damit sich benachbarte Namen nicht überlagern.
      const name = esc(f.properties.name).replace('-', '-<br>');
      L.marker(f.properties.mitte, { pane: 'bezirksnamen', interactive: false, keyboard: false, icon: L.divIcon({ className: 'bezirk-name', html: `<span>${name}</span>`, iconSize: [110, 26], iconAnchor: [55, 13] }) }).addTo(karte);
    }
    const grenzen = bezirke.getBounds();
    karte.setMaxBounds(grenzen.pad(0.6));
    if (ansicht?.mitte) karte.setView(ansicht.mitte, ansicht.zoom); else karte.fitBounds(grenzen, { padding: [10, 10] });
  } else {
    karte.setView(ansicht?.mitte || region.mitte, ansicht?.zoom || region.zoom);
  }
  if (osmAn) osmZuschalten(meldeFehler);
  markerSchicht = L.layerGroup().addTo(karte);
  for (const { p, popupHtml, aktiv } of projekte) {
    const m = L.marker(p.lage, {
      keyboard: true, title: `${p.kurz} · ${p.name}`, alt: `${p.kurz} ${p.name}`, riseOnHover: true,
      icon: L.divIcon({ className: 'pmarker-huelle', html: `<span class="pmarker${aktiv ? ' aktiv' : ''} pm-${esc(p.herkunft)}" data-marker="${esc(p.kurz)}" style="--pf:${esc(p.farbe)}">${esc(p.kurz)}</span>`, iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -18] }),
    });
    m.bindPopup(popupHtml, { maxWidth: 280, minWidth: 220, className: 'ppopup' });
    m.on('popupopen', () => markiere(p.kurz, true));
    m.on('popupclose', () => markiere(p.kurz, false));
    m.addTo(markerSchicht);
  }
  setTimeout(() => karte && karte.invalidateSize(), 0);
}

function markiere(kurz, an) {
  document.querySelectorAll(`[data-projektzeile="${kurz}"]`).forEach((z) => z.classList.toggle('markiert', an));
}

export function markerHervorheben(kurz, an) {
  document.querySelectorAll(`[data-marker="${kurz}"]`).forEach((m) => m.classList.toggle('hervor', an));
}

export function popupOeffnen(kurz) {
  if (!markerSchicht) return;
  markerSchicht.eachLayer((m) => { if (m.options.title?.startsWith(`${kurz} ·`)) { karte.setView(m.getLatLng(), Math.max(karte.getZoom(), 12)); m.openPopup(); } });
}

function osmZuschalten(meldeFehler) {
  const L = window.L;
  let fehler = 0;
  osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>-Mitwirkende', className: 'osm-kacheln' });
  osm.on('tileerror', () => { fehler += 1; if (fehler === 3) meldeFehler('Die Straßenkarte ist nicht erreichbar. Die Bezirksgrenzen bleiben sichtbar.'); });
  osm.addTo(karte);
  osm.bringToBack();
}
