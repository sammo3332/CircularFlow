# Macht die vier Ecken außerhalb des Kartenradius durchsichtig (dort liegt im Rohbild die Seitenfläche der App).
# Der Bildinhalt der Karte bleibt unverändert. Aufruf: python3 -I ecken-runden.py <roh.png> <aus.png> <radius_px>
import sys
from PIL import Image, ImageDraw
roh, aus, radius = sys.argv[1], sys.argv[2], float(sys.argv[3])
im = Image.open(roh).convert('RGBA'); w, h = im.size
f = 4  # Überabtastung für eine glatte Kante
maske = Image.new('L', (w * f, h * f), 0)
ImageDraw.Draw(maske).rounded_rectangle([0, 0, w * f - 1, h * f - 1], radius=radius * f, fill=255)
im.putalpha(maske.resize((w, h), Image.LANCZOS)); im.save(aus)
print(aus, im.size)
