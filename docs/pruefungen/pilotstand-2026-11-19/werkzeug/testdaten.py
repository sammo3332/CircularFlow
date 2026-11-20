# Erzeugt die Testdaten für browserlauf.mjs: gezeichnetes Bauteilfoto, beschädigtes Bild, falscher Dateityp, Rauschbild.
# Aufruf: python3 -I docs/pruefungen/pilotstand-2026-11-19/werkzeug/testdaten.py <Zielordner>
import os, random, sys
from PIL import Image, ImageDraw, ImageFont
d = sys.argv[1] if len(sys.argv) > 1 else 'testdaten'
os.makedirs(d, exist_ok=True)
img = Image.new('RGB', (1200, 1600), (236, 232, 224)); dr = ImageDraw.Draw(img)
dr.rectangle((300, 150, 900, 1500), fill=(176, 122, 60), outline=(90, 60, 30), width=12); dr.ellipse((820, 800, 860, 840), fill=(40, 40, 40))
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 44); dr.text((330, 60), 'TESTBILD – gezeichnete Tür, kein echtes Bauteil', fill=(60, 60, 60), font=f)
img.save(os.path.join(d, 'testbild-tuer.jpg'), quality=85)
open(os.path.join(d, 'kaputt.png'), 'wb').write(b'\x89PNG\r\n\x1a\n' + os.urandom(4000))
open(os.path.join(d, 'notiz.txt'), 'w').write('kein Bild')
random.seed(1); Image.effect_noise((2600, 2600), 64).convert('RGB').save(os.path.join(d, 'rauschen.png'))
print('Testdaten in', d, os.listdir(d))
