# Erzeugt ein gekennzeichnetes Testbild (kein echtes Bauteilfoto) im Hochformat wie eine Handykamera.
from PIL import Image, ImageDraw, ImageFont
import sys
W,H=1536,2048
im=Image.new('RGB',(W,H),(214,210,202))
d=ImageDraw.Draw(im)
d.rectangle([0,1700,W,H],fill=(120,112,104))           # Boden
d.rectangle([0,1680,W,1712],fill=(238,236,230))        # Sockelleiste
d.rectangle([420,260,1120,1700],fill=(92,84,76))       # Zarge
d.rectangle([460,300,1080,1700],fill=(176,134,92))     # Türblatt
for x in range(470,1080,38): d.line([x,300,x,1700],fill=(168,126,86),width=3)
d.rectangle([540,420,1000,900],outline=(150,110,74),width=8)
d.rectangle([540,1000,1000,1560],outline=(150,110,74),width=8)
d.rounded_rectangle([980,1010,1050,1040],8,fill=(60,60,62)) # Drücker
d.ellipse([985,1080,1015,1110],fill=(60,60,62))
try: f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',54)
except Exception: f=ImageFont.load_default()
d.rectangle([0,0,W,150],fill=(245,238,203))
d.text((40,44),'TESTBILD · gezeichnet, kein echtes Bauteilfoto',fill=(89,72,16),font=f)
im.save(sys.argv[1],quality=88)
