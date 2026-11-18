# Misst im Canva-Export der Probeseite, wo die Schrift relativ zur Textbox liegt.
# Aufruf: python3 -I textlage-messen.py <export.png>
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB'); W, H = im.size; px = im.load(); f = W / 1920
def dunkel(x0, y0, x1, y1, test):
    zeilen = [y for y in range(int(y0*f), int(y1*f)) if any(test(px[x, y]) for x in range(int(x0*f), int(x1*f)))]
    return (zeilen[0]/f, (zeilen[-1]+1)/f) if zeilen else None
def spalten(x0, y0, x1, y1, test):
    sp = [x for x in range(int(x0*f), int(x1*f)) if any(test(px[x, y]) for y in range(int(y0*f), int(y1*f)))]
    return (sp[0]/f, (sp[-1]+1)/f) if sp else None
tinte = lambda p: p[0] < 90 and p[1] < 90 and p[2] < 90
gruen = lambda p: p[0] < 90 and p[1] > 60 and p[1] < 130 and p[2] < 110
braun = lambda p: abs(p[0]-0x59) < 40 and abs(p[1]-0x48) < 40 and p[2] < 70
print('Bild', W, H)
# Text 1: Box top 80, fett 100 px, Zeilenhöhe 1.2. Nur das H (x 100..175) für Versalhöhe und Grundlinie.
print('T1 H (Versaloberkante, Grundlinie):', dunkel(100, 60, 168, 230, tinte), 'erwartet Versalhöhe 71.6')
print('T1 gesamte Zeile (mit Unterlängen):', dunkel(100, 60, 1489, 230, tinte), 'Spalten', spalten(100, 60, 1500, 230, tinte))
# Text 2: Box top 300, normal 48 px, Zeilenhöhe 1.3, zentriert in 100..1000
print('T2 Zeile 1 (Z von Zeile):', dunkel(100, 290, 1000, 352, gruen), 'Spalten', spalten(100, 290, 1000, 352, gruen))
print('T2 Zeile 2:', dunkel(100, 356, 1000, 430, gruen), 'Spalten', spalten(100, 356, 1000, 430, gruen))
# Pille: Form top 440 Höhe 80, Text top 460, fett 32
print('Pille Text:', dunkel(1130, 445, 1370, 515, braun), 'Spalten', spalten(1110, 450, 1390, 510, braun))
# rechtsbündig: Box 560..1040, top 440, 36 px
print('rechts:', dunkel(560, 430, 1045, 500, tinte), 'Spalten', spalten(540, 430, 1060, 500, tinte))
# dünne Linie: top 960 Höhe 8, Pfad 3..5
print('Linie:', dunkel(100, 950, 500, 980, tinte), 'Spalten', spalten(90, 950, 520, 980, tinte))
