"""Reproduzierbare synthetische Pixelbilder, keine echten Bauteilfotos."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ziel = Path(__file__).resolve().parents[1] / "fixtures" / "robustheit"
ziel.mkdir(parents=True, exist_ok=True)
font = ImageFont.truetype("DejaVuSans.ttf", 42)
klein = ImageFont.truetype("DejaVuSans.ttf", 22)

def etikett(lines, bg=255, fg=15):
    im = Image.new("RGB", (1500, 540), (bg, bg, bg))
    d = ImageDraw.Draw(im)
    d.text((40, 30), "SYNTHETISCHES TESTETIKETT - KEIN ECHTES BAUTEIL", fill=(fg, fg, fg), font=klein)
    for i, text in enumerate(lines):
        d.text((40, 110 + i * 90), text, fill=(fg, fg, fg), font=font)
    return im

normal = ["Hersteller: MUSTERWERK", "Modell: TUER-17", "Seriennummer: CF-2026-001", "Baujahr: 2020"]
alternativ = ["Fabrikat MUSTERWERK", "Typ = TUER-17", "Ser.-Nr. CF-2026-001", "Herstellungsjahr 2020"]
base = etikett(normal)
base.save(ziel / "klar.png")
etikett(alternativ).save(ziel / "alternative-beschriftung.png")
etikett(normal, 238, 218).save(ziel / "kontrastarm.png")
rechts = base.transpose(Image.Transpose.ROTATE_270)
rechts.save(ziel / "90-grad.png")
# Nachbildung der gewählten Vierteldrehung zur OCR-Prüfung; kein Canvas-/Browsernachweis.
rechts.transpose(Image.Transpose.ROTATE_90).save(ziel / "90-grad-korrigiert.png")
base.filter(ImageFilter.GaussianBlur(3)).save(ziel / "unscharf.png")
etikett(["Hersteller: Alpha", "Hersteller: Beta", "Modell: TUER-17", "Baujahr: 2020"]).save(ziel / "widerspruch.png")
Image.new("RGB", (1500, 540), "white").save(ziel / "leer.png")
print(f"8 synthetische Bilder erzeugt: {ziel}")
