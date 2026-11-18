# Eigene Stichprobe: liest Notizen der PPTX roh aus (ohne die Zählregeln des Prüfskripts)
import sys
from pptx import Presentation
pptx = sys.argv[1]
nummern = [int(x) for x in sys.argv[2:]]
prs = Presentation(pptx)
for i, s in enumerate(prs.slides, 1):
    if i not in nummern:
        continue
    print(f"===== Folie {i} =====")
    if s.has_notes_slide:
        for k, p in enumerate(s.notes_slide.notes_text_frame.paragraphs):
            print(f"[{k}] {p.text!r}")
    else:
        print("(keine Notizen)")
