# Vergleicht den Canva-Export der drei Musterfolien mit der lokalen Vorschau und misst die Schärfe der Produktaufnahme.
# Aufruf: python3 -I vergleich.py <ordner-canva-export> <ordner-lokale-vorschau>
import sys
from PIL import Image, ImageChops, ImageFilter, ImageStat
exp, lok = sys.argv[1], sys.argv[2]
def schaerfe(b):
    k = b.convert('L').filter(ImageFilter.Kernel((3, 3), [0, 1, 0, 1, -4, 1, 0, 1, 0], scale=1, offset=128)); return ImageStat.Stat(k).var[0]
for n, name in [(1, 'muster-1-einstieg'), (2, 'muster-2-problemgroesse'), (3, 'muster-3-produktnutzen')]:
    a = Image.open(f"{exp}/{name}.png").convert('RGB'); b = Image.open(f"{lok}/folie-{n}.png").convert('RGB')
    hart = sum(ImageChops.difference(a, b).convert('L').histogram()[61:])
    # geglättet: Kantenglättung fällt heraus, übrig bleiben echte Lage- oder Inhaltsabweichungen
    w = lambda im: im.filter(ImageFilter.GaussianBlur(4))
    weich = sum(ImageChops.difference(w(a), w(b)).convert('L').histogram()[41:])
    print(f"Folie {n}: Export {a.size[0]} x {a.size[1]} · abweichende Pixel hart {hart} ({100*hart/(a.size[0]*a.size[1]):.2f} %) · nach Glättung {weich} ({100*weich/(a.size[0]*a.size[1]):.3f} %)")
feld = (500, 290, 1400, 520)
print('Schärfemaß der Produktaufnahme (Laplace-Varianz, Ausschnitt 900 x 230): Canva-Export', round(schaerfe(Image.open(f"{exp}/muster-3-produktnutzen.png").crop(feld)), 1), '· lokale Vorschau', round(schaerfe(Image.open(f"{lok}/folie-3.png").crop(feld)), 1))
