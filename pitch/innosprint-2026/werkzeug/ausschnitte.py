#!/usr/bin/env python3
"""Erzeugt die Bildausschnitte der Demo-Folien (Korrektur D1) aus den ganzen Bildschirmfotos.

Aufruf: python3 ausschnitte.py
Liest ../bilder/k*.jpg, schreibt ../bilder/ausschnitte/e1..e6-*.jpg und ausschnitte.json
(Maße und Hervorhebungsrahmen als Bruchteile des Ausschnitts; der Generator liest die JSON).

Koordinaten sind in der Anzeigegröße 2000 px Breite angegeben (so wurden die Originale gesichtet);
FAKTOR rechnet auf die Originalpixel um (2160 / 2000 = 1,08). k5-vorgang.jpg liegt in Originalgröße vor (Faktor 1).
Rahmen (hl) sind [x0, y0, x1, y1] in denselben Koordinaten.
"""
import json
import os
from PIL import Image

HIER = os.path.dirname(os.path.abspath(__file__))
BILDER = os.path.join(HIER, "..", "bilder")
AUS = os.path.join(BILDER, "ausschnitte")
os.makedirs(AUS, exist_ok=True)

DEFS = {
    # Zeitkritisch und die drei Kacheln (9 Positionen, 8 Paare, 2 Vorgänge); ohne linke Navigationsleiste
    "e1-uebersicht.jpg": dict(src="k1-uebersicht.jpg", f=1.08, box=(370, 175, 1965, 935),
        hl=[[398, 203, 650, 247], [402, 755, 562, 827], [933, 748, 1188, 818], [1466, 748, 1608, 818]]),
    # Filterchips und Tabelle (drei Zeilen)
    "e2-paarliste.jpg": dict(src="k2-paarliste.jpg", f=1.08, box=(375, 335, 1965, 898),
        hl=[[383, 347, 1530, 410]]),
    # Ergebniskasten mit Grund (zu spät)
    "e3-zu-spaet.jpg": dict(src="k3-zu-spaet.jpg", f=1.08, box=(375, 100, 1535, 775),
        hl=[[402, 545, 1030, 582]]),
    # Ergebniskasten mit Grund (weiter prüfen)
    "e4-weiter-pruefen.jpg": dict(src="k4-weiter-pruefen.jpg", f=1.08, box=(375, 100, 1535, 775),
        hl=[[402, 492, 1050, 530]]),
    # Statuskette und Formular Fachergebnis
    "e5-vorgang.jpg": dict(src="k5-vorgang.jpg", f=1.0, box=(20, 95, 1680, 885),
        hl=[[29, 236, 1670, 346]]),
    # Kasten Nächster fachlicher Schritt und Status
    "e6-vormerkung.jpg": dict(src="k6-vormerkung-anlegen.jpg", f=1.08, box=(375, 300, 1965, 1055),
        hl=[[384, 307, 1352, 696], [1174, 948, 1420, 1050]]),
}

out = {}
for name, d in DEFS.items():
    im = Image.open(os.path.join(BILDER, d["src"])).convert("RGB")
    f = d["f"]
    x0, y0, x1, y1 = [round(v * f) for v in d["box"]]
    x1, y1 = min(x1, im.width), min(y1, im.height)
    c = im.crop((x0, y0, x1, y1))
    c.save(os.path.join(AUS, name), quality=93, optimize=True)
    W, H = c.size
    hl = []
    for a, b, cc, dd in d["hl"]:
        ax, ay, bx, by = a * f - x0, b * f - y0, cc * f - x0, dd * f - y0
        hl.append([round(ax / W, 4), round(ay / H, 4), round((bx - ax) / W, 4), round((by - ay) / H, 4)])
    out[name] = {"w": W, "h": H, "hl": hl}
    print(name, W, "x", H)
with open(os.path.join(AUS, "ausschnitte.json"), "w") as fh:
    json.dump(out, fh, indent=1)
