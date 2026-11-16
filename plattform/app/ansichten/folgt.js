// Platzhalter für Seiten, deren Formular ein späteres Paket baut. Nur intern.
import { seitenkopf } from '../ui.js';
export const projektNeuPlatzhalter = () => `${seitenkopf({ pfad: [['#projekte', 'Projekte']], aktuell: 'Projekt erfassen', titel: 'Projekt erfassen', untertitel: 'Das Formular folgt in Paket C (internes Platzhalterbild).' })}
  <div class="leer"><b>Formular folgt in Paket C.</b><p>Hier legen Sie später ein Projekt mit Gebäude, Etagen und Räumen an.</p><a class="knopf" href="#projekte">Zur Projektübersicht</a></div>`;
