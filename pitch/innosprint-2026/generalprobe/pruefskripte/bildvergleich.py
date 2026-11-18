#!/usr/bin/env python3
"""Vergleicht die Ersatzbilder der Pitch-Folien 5 und 6 mit einer frischen Aufnahme der Demo.
Aufruf: python3 -I bildvergleich.py <repo-wurzel> <aufnahme-ordner> <ausgabe.txt>
Der Aufnahme-Ordner stammt aus demo-pruefung.js (01-start-uebersicht.png, 02-k2-paarliste.png, 03-k3-zu-spaet.png,
04-k4-weiter-pruefen.png). Ein Pixel zählt als abweichend, wenn sein größter Kanalunterschied über 24 von 255 liegt."""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

repo, aufn, aus = (Path(a) for a in sys.argv[1:4])
paare = [
    ("bilder/k1-uebersicht.jpg", "01-start-uebersicht.png"),
    ("bilder/k2-paarliste.jpg", "02-k2-paarliste.png"),
    ("bilder/k3-zu-spaet.jpg", "03-k3-zu-spaet.png"),
    ("bilder/k4-weiter-pruefen.jpg", "04-k4-weiter-pruefen.png"),
]
zeilen = ["Ersatzbilder der Folien 5 und 6 gegen frische Aufnahme (veröffentlichte Auslieferung, lokal geöffnet)",
          "Spalten: Ersatzbild | Aufnahme | Größe Ersatzbild | Größe Aufnahme | Anteil Pixel mit Kanalunterschied > 24 | mittlerer Unterschied (0 bis 255)"]
for bild, neu in paare:
    a = Image.open(repo / "pitch/innosprint-2026" / bild).convert("RGB")
    b = Image.open(aufn / neu).convert("RGB")
    if a.size != b.size:
        zeilen.append(f"{bild} | {neu} | {a.size} | {b.size} | Größe verschieden, nicht verglichen | -")
        continue
    x, y = np.asarray(a, dtype=np.int16), np.asarray(b, dtype=np.int16)
    d = np.abs(x - y)
    anteil = float((d.max(axis=2) > 24).mean()) * 100
    zeilen.append(f"{bild} | {neu} | {a.size[0]}x{a.size[1]} | {b.size[0]}x{b.size[1]} | {anteil:.2f} % | {float(d.mean()):.2f}")
aus.write_text("\n".join(zeilen) + "\n", encoding="utf-8")
print("\n".join(zeilen))
