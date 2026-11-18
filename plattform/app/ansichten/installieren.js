// Installationshilfe (CF-PWA-01): erklärt je Gerät, wie die Seite als App auf den Startbildschirm kommt,
// und nennt die Grenzen. Kein Service Worker: ohne Verbindung zum Server startet die App nicht.
import { esc, chip, icon, seitenkopf } from '../ui.js';

// Ordnet den Browser grob einer Anleitung zu. Reine Funktion, damit sie ohne Browser prüfbar ist.
export function geraeteArt(ua = '', touchPunkte = 0) {
  const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && touchPunkte > 1);
  if (ios) return /CriOS|FxiOS|EdgiOS/.test(ua) ? 'ios-anderer' : 'ios';
  if (/Android/.test(ua)) return /Firefox/.test(ua) ? 'android-firefox' : 'android';
  if (/Firefox/.test(ua)) return 'rechner-firefox';
  if (/Chrome|Edg\//.test(ua)) return 'rechner';
  if (/Safari/.test(ua)) return 'rechner-safari';
  return 'unbekannt';
}

const WEGE = {
  android: { titel: 'Android · Chrome', schritte: ['Diese Seite in Chrome öffnen.', 'Oben rechts das Menü mit den drei Punkten antippen.', '„Zum Startbildschirm hinzufügen“ oder „App installieren“ wählen und bestätigen.', 'CircularFlow über das neue Symbol auf dem Startbildschirm öffnen.'] },
  ios: { titel: 'iPhone und iPad · Safari', schritte: ['Diese Seite in Safari öffnen.', 'Das Teilen-Symbol antippen (Quadrat mit Pfeil nach oben).', '„Zum Home-Bildschirm“ wählen und mit „Hinzufügen“ bestätigen.', 'CircularFlow über das neue Symbol auf dem Home-Bildschirm öffnen.'], hinweis: 'Auf iPhone und iPad hat die App vom Home-Bildschirm einen eigenen Speicher. Was vorher in Safari erfasst wurde, erscheint dort nicht.' },
  rechner: { titel: 'Rechner · Chrome oder Edge', schritte: ['Diese Seite in Chrome oder Edge öffnen.', 'In der Adresszeile rechts das Installieren-Symbol anklicken (Bildschirm mit Pfeil) oder im Menü „Speichern und teilen“ bzw. „Apps“ → „Installieren“ wählen.', 'Mit „Installieren“ bestätigen. CircularFlow öffnet sich in einem eigenen Fenster.'] },
};
const ANDERE = {
  'ios-anderer': 'Auf iPhone und iPad bitte Safari verwenden. Der Weg über das Teilen-Symbol ist in anderen Browsern je nach iOS-Version nicht vorhanden.',
  'android-firefox': 'Firefox bietet „Zum Startbildschirm hinzufügen“ im Menü an. Geprüft ist die Installation nur für Chrome.',
  'rechner-firefox': 'Firefox am Rechner installiert keine Web-Apps. Die Plattform läuft dort als normale Seite; für die Installation Chrome oder Edge verwenden.',
  'rechner-safari': 'Safari am Mac: Menü „Ablage“ → „Zum Dock hinzufügen“ (ab macOS 14). Dieser Weg wurde nicht geprüft.',
};
const PASSEND = { android: 'android', 'android-firefox': 'android', ios: 'ios', 'ios-anderer': 'ios', rechner: 'rechner', 'rechner-firefox': 'rechner', 'rechner-safari': 'rechner' };

const weg = (k, eigen) => { const w = WEGE[k]; return `<section class="flaeche inst-weg${eigen ? ' inst-eigen' : ''}" aria-labelledby="h-inst-${k}">
    <h2 id="h-inst-${k}">${esc(w.titel)} ${eigen ? chip('Ihr Gerät', 'info') : ''}</h2>
    <ol>${w.schritte.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
    ${w.hinweis ? `<p class="hinweisbox hinweisbox-warn">${esc(w.hinweis)}</p>` : ''}
  </section>`; };

// inst: { art, laeuftAlsApp, angebot, sicher, manifest, ergebnis }
export function installieren(ctx) {
  const inst = ctx.ui.installation || {};
  const eigen = PASSEND[inst.art];
  const reihe = ['android', 'ios', 'rechner'].sort((a, b) => (b === eigen) - (a === eigen));
  const lage = inst.laeuftAlsApp ? `<div class="ergebnisbox inst-lage" role="status"><p><b>${icon('haken')} CircularFlow läuft als installierte App.</b></p><p>Es ist nichts weiter zu tun.</p></div>`
    : !inst.manifest ? '<p class="hinweisbox hinweisbox-warn" role="status">Diese Fassung der Seite lässt sich nicht installieren (Vorschau ohne App-Angaben). Sie bleibt im Browser nutzbar.</p>'
      : !inst.sicher ? '<p class="hinweisbox hinweisbox-warn" role="status">Diese Adresse ist nicht über HTTPS erreichbar. Die Seite lässt sich benutzen, aber nicht installieren. Für die Installation braucht es eine HTTPS-Adresse (oder „localhost“ am selben Rechner).</p>'
        : inst.ergebnis === 'installiert' ? `<div class="ergebnisbox inst-lage" role="status"><p><b>${icon('haken')} Installiert.</b> CircularFlow steht jetzt auf dem Startbildschirm oder in der App-Liste.</p></div>`
          : inst.angebot ? `<div class="ergebnisbox inst-lage"><p><b>Dieser Browser bietet die Installation an.</b></p><p><button type="button" class="knopf" id="inst-knopf" data-action="installieren">${icon('plus')} App installieren</button></p>${inst.ergebnis === 'abgelehnt' ? '<p class="leise" role="status">Die Installation wurde abgebrochen. Sie lässt sich jederzeit erneut starten.</p>' : ''}</div>`
            : `<p class="hinweisbox" role="status">Dieser Browser bietet keinen Installationsknopf an. ${esc(ANDERE[inst.art] || 'Bitte dem Weg für Ihr Gerät folgen.')}</p>`;
  return `
  ${seitenkopf({ pfad: [['#erfassung', 'Erfassen']], aktuell: 'App installieren', titel: 'CircularFlow als App installieren', untertitel: 'Die Plattform bleibt eine Webseite. Installiert bekommt sie ein eigenes Symbol und ein eigenes Fenster ohne Adresszeile.' })}
  <div class="inst">
    ${lage}
    <section class="flaeche inst-grenzen" aria-labelledby="h-inst-grenzen">
      <h2 id="h-inst-grenzen">Was die App kann und was nicht</h2>
      <ul>
        <li><b>Nur mit Verbindung.</b> Es gibt keine Offline-Nutzung. Ohne Verbindung zum Server startet die App nicht.</li>
        <li><b>Nur dieses Gerät.</b> Erfassungen und Fotos liegen im Browserspeicher dieses Geräts. Es gibt keine Synchronisierung: Was am Handy erfasst wird, erscheint nicht am Rechner.</li>
        <li><b>Kein Konto, kein Versand.</b> Nichts wird hochgeladen. Wer die Browserdaten löscht, löscht auch die Erfassungen.</li>
        <li><b>Kein App-Store.</b> Die Installation läuft allein über den Browser.</li>
        <li><b>Entwicklungsstand.</b> Projekte und Bauteile sind Beispieldaten; die Erkennung aus dem Foto ist simuliert.</li>
      </ul>
    </section>
    ${reihe.map((k) => weg(k, k === eigen)).join('')}
    ${ANDERE[inst.art] && !inst.laeuftAlsApp && (inst.angebot || !inst.manifest || !inst.sicher) ? `<p class="leise">${esc(ANDERE[inst.art])}</p>` : ''}
    <p class="klein">Geprüfte Geräte und Browser stehen in <span class="mono">plattform/README.md</span>, Abschnitt „Als App installieren“.</p>
  </div>`;
}
