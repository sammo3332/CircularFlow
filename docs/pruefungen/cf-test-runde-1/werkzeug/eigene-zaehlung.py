# Eigene, unabhängige Zählung der Sprechwörter je Folie (andere Umsetzung als das Prüfskript)
import sys
from pptx import Presentation

prs = Presentation(sys.argv[1])
SKIP = ("Spricht:", "Zeitfenster:", "Klick:", "Bei Zeitdruck:", "Bei Rückfragen:")
MARKER = ("K1 · ", "K2 · ", "K3 · ", "K4 · ", "K5 · ", "K6 · ",
          "Zurück zur Präsentation, Folie 7 · ")

def woerter_str(t):           # Definition 1: durch Leerraum getrennte Tokens
    return len(t.split())

def woerter_alnum(t):         # Definition 2: nur Tokens mit mindestens einem Buchstaben/Ziffer
    return sum(1 for w in t.split() if any(c.isalnum() for c in w))

gesamt1 = gesamt2 = 0
anteil1 = {"Feyrouz": 0, "Houssam": 0}
anteil2 = {"Feyrouz": 0, "Houssam": 0}
zeit = {}
for nr, s in enumerate(prs.slides, 1):
    xml_ausgeblendet = s._element.get("show") == "0"
    if xml_ausgeblendet:
        continue
    paras = [p.text for p in s.notes_slide.notes_text_frame.paragraphs]
    kopf = paras[0].replace("Spricht:", "").strip()
    je1 = je2 = 0
    for p in paras[1:]:
        if not p.strip() or p.startswith(SKIP):
            if p.startswith("Zeitfenster:"):
                zeit[nr] = p
            continue
        t = p
        wer = kopf.split(",")[0].strip()          # Standard: erster genannter Sprecher
        if t.startswith("Feyrouz: "):
            wer, t = "Feyrouz", t[len("Feyrouz: "):]
        for m in MARKER:
            if t.startswith(m):
                t = t[len(m):]
        w1, w2 = woerter_str(t), woerter_alnum(t)
        je1 += w1; je2 += w2
        anteil1[wer] += w1; anteil2[wer] += w2
    gesamt1 += je1; gesamt2 += je2
    print(f"Folie {nr}: Sprecher laut Kopf={kopf!r}: Wörter (Leerraum)={je1}, (alnum)={je2} | {zeit.get(nr)}")
print("GESAMT (Leerraum):", gesamt1, anteil1)
print("GESAMT (alnum)   :", gesamt2, anteil2)
sek = sum(int(z.split("etwa ")[1].split(" Sekunden")[0]) for z in zeit.values())
print("Summe der Zeitfenster aus den Notizen:", sek, "s =", f"{sek//60}:{sek%60:02d}")
