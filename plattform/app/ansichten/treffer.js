import { esc, seitenkopf, routeAbgleich, routeBedarf, ergebnisChip } from '../ui.js';
import { bedarfKennung } from '../treffer.js';
import { lueckeText } from '../abgleich.js';

export function trefferSchalter(ctx, d) {
  const an = ctx.treffer?.vorgaben.beobachtet.includes(bedarfKennung(d));
  return `<div class="hinweisbox"><button type="button" class="knopf-zweit" data-action="bedarf-beobachten" data-projekt="${esc(d.projekt)}" data-bedarf="${esc(d.id)}" aria-pressed="${Boolean(an)}">${an ? 'Trefferhinweise ausschalten' : 'Über Angebote informieren'}</button><p>${an ? 'Hinweise sind an.' : 'Hinweise sind aus.'} Nur in diesem Browser. <a href="#treffer">Trefferhinweise ansehen</a></p></div>`;
}

export function trefferBanner(ctx) {
  const n = ctx.treffer?.anzahlNeu || 0;
  return n ? `<aside class="treffer-banner" aria-label="Neue Trefferhinweise"><a href="#treffer"><b>${n} ${n === 1 ? 'neuer Vorschlag' : 'neue Vorschläge'} für beobachtete Bedarfe</b> · Angebote ansehen</a><span>Zur Prüfung, keine Freigabe.</span></aside>` : '';
}

export function trefferSeite(ctx) {
  const t = ctx.treffer;
  return `${seitenkopf({ titel: 'Trefferhinweise', untertitel: 'Angebote für die Bedarfe, die du in diesem Browser beobachtest.' })}
    <p class="hinweisbox">Neue Bedarfe beobachtest du nach dem Speichern automatisch. Bei bestehenden Bedarfen kannst du „Über Angebote informieren“ einschalten. Hinweise erscheinen hier und auf jeder Seite der Plattform. Keine E-Mail und keine Push-Nachricht.</p>
    ${t.speicherFehler ? '<p class="speicherhinweis" role="alert">Hinweise und Lesestatus bleiben nur bis zum Neuladen erhalten. Der Browserspeicher ist nicht verfügbar oder voll.</p>' : ''}
    <section class="flaeche" aria-labelledby="h-treffer"><div class="block-kopf"><h2 id="h-treffer">${t.anzahlNeu} neue Vorschläge</h2>${t.anzahlNeu ? '<button type="button" class="knopf-zweit" data-action="treffer-alle-gelesen">Alle als gelesen markieren</button>' : ''}</div>
      <p>Die bisherigen Regeln prüfen Gruppe, Menge und Termine sowie hinterlegte Hürden. Anforderungen im Freitext werden nicht automatisch bewertet. Fachleute müssen die Eignung klären. Kein Angebot wird automatisch zugeteilt oder reserviert.</p>
      ${t.paare.length ? `<ul class="paarliste">${t.paare.map((a) => `<li><a class="paar" href="${routeAbgleich(a.schluessel)}" data-action="treffer-lesen" data-key="${esc(a.schluessel)}"><span class="paar-kopf">${ergebnisChip(a.gesamt)}${a.neu ? '<strong>Neu</strong>' : '<span>Gelesen</span>'}</span><b>${esc(a.bauteil.projekt)} · ${esc(a.bauteil.id)} · ${esc(a.bauteil.name)}</b><span>Für ${esc(a.bedarf.projekt)} · ${esc(a.bedarf.id)} · ${esc(a.bedarf.titel)}</span><small>${esc(a.gruende[0] || '')}</small>${a.menge.status === 'teilweise' ? `<strong>${esc(lueckeText(a.menge))}</strong>` : ''}<small>${esc(a.naechsterSchritt.text)}</small><small>Abgleich öffnen</small></a></li>`).join('')}</ul>` : '<p>Noch kein prüfbares Angebot für deine beobachteten Bedarfe. Du musst nicht selbst im Katalog suchen. Angebote mit fehlenden Angaben oder Zeitproblemen stehen weiterhin beim jeweiligen Bedarf.</p>'}
    </section>
    <section class="flaeche"><h2>Beobachtete Bedarfe (${t.beobachtet.length})</h2>${t.beobachtet.length ? `<ul>${t.beobachtet.map((d) => `<li><a href="${routeBedarf(d)}">${esc(d.projekt)} · ${esc(d.id)} · ${esc(d.titel)}</a></li>`).join('')}</ul>` : '<p>Öffne einen Bedarf und schalte „Über Angebote informieren“ ein oder erfasse einen neuen Bedarf.</p>'}
    <p class="leise">Hinweise gelten für den geladenen Datenstand und den gewählten Stichtag der Demo. Im verbundenen Pilotraum erscheinen neue Angebote nach dem Datenabgleich. Ist die Plattform geschlossen, wird nichts zugestellt. Beim Wechsel des Pilotraums gelten getrennte Einstellungen.</p></section>`;
}
