# Baut die Produktfolie „Mobile Erfassung und Entscheidung am Rechner“ als eigene, bearbeitbare PPTX.
# Sie ersetzt keine Folie der Pitch-Decks. Gestaltung nach ../werkzeug/GESTALTUNG.md (16:9, Arial, Farben der App).
# Aufruf vom Repository-Wurzelverzeichnis: python3 pitch/innosprint-2026/produktfolie/baue.py   (braucht python-pptx)
# Alle Elemente sind einzelne Formen und Textfelder; die Bilder sind unbearbeitete Aufnahmen aus bilder/ (siehe aufnahmen.cjs).
from pathlib import Path
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

HIER = Path(__file__).parent
F = lambda h: RGBColor.from_string(h)
GRUEN, GRUEN_HELL, TINTE, TINTE2, TINTE3, PAPIER, WEISS = '0E5546', 'E0EEE8', '17201D', '3F4A45', '59655F', 'F2F3F0', 'FFFFFF'
SIM, SIM_BG, ACHT, ACHT_BG, HINW, HINW_BG = '594810', 'F5EECB', '7D4C00', 'FBECD0', '1F4F96', 'E4ECF8'

pres = Presentation(); pres.slide_width = Inches(13.333); pres.slide_height = Inches(7.5)
pres.core_properties.title = 'CircularFlow · Produktfolie · Mobile Erfassung und Entscheidung am Rechner'
pres.core_properties.language = 'de-DE'
folie = pres.slides.add_slide(pres.slide_layouts[6])

def text(x, y, w, h, absaetze, gr=16, farbe=TINTE, fett=False, anker=MSO_ANCHOR.TOP, mitte=False, name=None):
    tb = folie.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h)); tf = tb.text_frame; tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0; tf.vertical_anchor = anker
    if name: tb.name = name
    for i, a in enumerate(absaetze if isinstance(absaetze, list) else [absaetze]):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        teile = a if isinstance(a, list) else [(a, fett)]
        for t, f in teile:
            r = p.add_run(); r.text = t; r.font.size = Pt(gr); r.font.bold = f; r.font.name = 'Arial'; r.font.color.rgb = F(farbe)
        if mitte: p.alignment = PP_ALIGN.CENTER
        p.space_after = Pt(4)
    return tb

def form(art, x, y, w, h, fuell, linie=None, rund=None, name=None):
    s = folie.shapes.add_shape(art, Inches(x), Inches(y), Inches(w), Inches(h))
    s.fill.solid(); s.fill.fore_color.rgb = F(fuell); s.shadow.inherit = False
    if linie: s.line.color.rgb = F(linie); s.line.width = Pt(0.75)
    else: s.line.fill.background()
    if rund is not None and art == MSO_SHAPE.ROUNDED_RECTANGLE: s.adjustments[0] = rund
    stil = s._element.find('{http://schemas.openxmlformats.org/presentationml/2006/main}style')
    if stil is not None: s._element.remove(stil)  # ohne Formatvorlage: kein Schatten, keine Standardschrift
    if name: s.name = name
    return s

def chip(x, y, w, t, farbe, bg):
    s = form(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, 0.32, bg, rund=0.3, name=f'Chip {t}')
    tf = s.text_frame; tf.margin_left = tf.margin_right = Inches(0.08); tf.margin_top = tf.margin_bottom = 0; tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER; r = p.add_run(); r.text = t
    r.font.size = Pt(12); r.font.bold = True; r.font.name = 'Arial'; r.font.color.rgb = F(farbe)
    tf.word_wrap = False

# Titel
text(0.6, 0.42, 12.1, 0.7, 'Erfassen am Handy, entscheiden am Rechner – ohne App-Store', gr=28, fett=True, name='Titel')

# Links: Handy. Der Rahmen ist gezeichnet und dient nur der Darstellung.
hx, hy, hw = 0.95, 1.4, 2.36; hh = (hw - 0.2) * 2202 / 1082 + 0.34
form(MSO_SHAPE.ROUNDED_RECTANGLE, hx, hy, hw, hh, TINTE, rund=0.11, name='Smartphone-Rahmen (nur Darstellung)')
bw = hw - 0.2; bh = bw * 2202 / 1082
folie.shapes.add_picture(str(HIER / 'bilder' / 'handy-pruefen.png'), Inches(hx + 0.1), Inches(hy + (hh - bh) / 2), Inches(bw), Inches(bh)).name = 'Aufnahme Handy: Prüfen und speichern'
text(3.6, 1.55, 2.55, 0.4, 'Auf der Baustelle', gr=20, fett=True, farbe=GRUEN)
text(3.6, 2.0, 2.55, 2.6, ['Bauteil mit Foto erfassen', 'Angaben mit Status: gemessen, bestätigt, vorgeschlagen, fehlt', 'Speichern und den Bauteilpass wieder öffnen'], gr=15, farbe=TINTE2, name='Text Handy')
chip(3.6, 4.55, 2.3, 'Nur auf diesem Gerät', HINW, HINW_BG)
chip(3.6, 4.97, 2.3, 'Erkennung: Simulation', SIM, SIM_BG)
chip(3.6, 5.39, 2.3, 'Testbild, kein Bauteilfoto', SIM, SIM_BG)

# Rechts: Rechner. Schlichter Fensterrahmen, ebenfalls nur Darstellung.
rx, ry, rw = 6.45, 1.5, 6.3; rh = rw * 720 / 1280
form(MSO_SHAPE.RECTANGLE, rx - 0.12, ry - 0.12, rw + 0.24, rh + 0.24, PAPIER, linie='D5D9D2', name='Fläche hinter der Rechner-Aufnahme')
folie.shapes.add_picture(str(HIER / 'bilder' / 'rechner-entscheidung.png'), Inches(rx), Inches(ry), Inches(rw), Inches(rh)).name = 'Aufnahme Rechner: Entscheidungsseite'
text(6.33, 5.3, 4.2, 0.4, 'Im Büro', gr=20, fett=True, farbe=GRUEN)
text(6.33, 5.72, 6.5, 0.75, 'Angebot und Bedarf abgleichen, Prüfbitte anlegen, den nächsten fachlichen Schritt sehen', gr=15, farbe=TINTE2, name='Text Rechner')
chip(9.0, 5.33, 1.5, 'Beispieldaten', SIM, SIM_BG)
chip(10.6, 5.33, 2.15, 'Vorgang: Simulation', SIM, SIM_BG)

# Ehrliche Grenze, gut sichtbar
g = form(MSO_SHAPE.ROUNDED_RECTANGLE, 0.6, 6.5, 12.13, 0.44, ACHT_BG, rund=0.25, name='Hinweis Grenze')
tf = g.text_frame; tf.margin_left = Inches(0.15); tf.vertical_anchor = MSO_ANCHOR.MIDDLE; tf.margin_top = tf.margin_bottom = 0
p = tf.paragraphs[0]; p.alignment = PP_ALIGN.LEFT
for t, f in [('Stand heute: ', True), ('Dieselbe Web-App auf beiden Geräten. Daten bleiben im jeweiligen Browser, Handy und Rechner sind noch nicht verbunden. Nicht offline nutzbar.', False)]:
    r = p.add_run(); r.text = t; r.font.bold = f; r.font.size = Pt(12); r.font.name = 'Arial'; r.font.color.rgb = F(ACHT)

text(0.6, 7.06, 9.6, 0.3, 'Aufnahmen: Entwicklungsstand 18.11.2026, Chromium, Handy als emuliertes Geräteprofil; Rahmen gezeichnet. Echte Geräte noch nicht geprüft.', gr=10, farbe=TINTE3, name='Quelle')
text(10.3, 7.06, 2.43, 0.3, 'CircularFlow · INNOSPRINT 2026', gr=10, farbe=TINTE3, name='Fußzeile').text_frame.paragraphs[0].alignment = PP_ALIGN.RIGHT

NOTIZ = [
    'Sprechtext (etwa 35 Sekunden)',
    'CircularFlow ist eine Web-App. Auf der Baustelle nimmt eine Projektperson ein Bauteil mit dem Handy auf: Raum wählen, Foto machen, Maße und Zustand eintragen, speichern. Jede Angabe trägt ihren Status, also gemessen, bestätigt, nur vorgeschlagen oder fehlt.',
    'Im Büro läuft dieselbe Anwendung am Rechner. Dort gleichen wir Angebot und Bedarf ab, legen eine Prüfbitte an und sehen den nächsten fachlichen Schritt.',
    'Die App lässt sich aus dem Browser auf den Startbildschirm legen. Dafür brauchen wir keinen App-Store.',
    'Ehrlich zum Stand: Handy und Rechner sind noch nicht verbunden. Die Daten bleiben im jeweiligen Browser. Die Verbindung ist der nächste Schritt, sobald ein Praxispartner den Ablauf bestätigt hat.',
    'Bei Rückfragen:',
    '„Ist das Foto echt?“ Das Bild auf der Folie ist ein gezeichnetes Testbild. Die Fotoaufnahme selbst ist echt umgesetzt (Kamera oder Datei, verkleinert, im Browser gespeichert). Die Erkennung der Bauteilgruppe aus dem Foto ist simuliert.',
    '„Funktioniert das offline?“ Nein. Offline-Nutzung ist nicht umgesetzt und wird nicht zugesagt.',
    '„Auf welchen Geräten geprüft?“ Bisher nur in Chromium am Rechner und mit emulierten Handy-Profilen (Pixel 7, iPhone 13). Auf echten Geräten und mit einer HTTPS-Adresse ist die Installation noch nicht geprüft.',
    '„Sind das echte Projekte?“ Nein. Projekte, Personen und Bauteile sind Beispieldaten; Prüfbitte und Fachergebnis sind Simulation, nichts wird versendet.',
    'Nicht sagen: „synchronisiert“, „App im Store“, „funktioniert ohne Netz“, „KI erkennt das Bauteil“.',
]
nf = folie.notes_slide.notes_text_frame; nf.text = NOTIZ[0]
for a in NOTIZ[1:]: nf.add_paragraph().text = a

ziel = HIER / 'CircularFlow_Produktfolie_Erfassung-und-Entscheidung.pptx'
pres.save(ziel); print(ziel)
