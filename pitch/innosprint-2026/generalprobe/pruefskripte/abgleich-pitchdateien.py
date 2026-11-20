#!/usr/bin/env python3
"""Gleicht PPTX, Folien-PDF, Sprechtext-PDF und README des 5-Minuten-Pitches ab.
Rechnet nur aus den Dateien. Aufruf: abgleich.py <repo-wurzel> <ausgabe-json>"""
import hashlib, json, re, subprocess, sys, zipfile
from pathlib import Path
from pptx import Presentation
from pypdf import PdfReader

repo = Path(sys.argv[1])
aus = Path(sys.argv[2])
P = repo / "pitch/innosprint-2026"
pptx = P / "ausgabe/abgabe-5-minuten/CircularFlow_INNOSPRINT2026_Pitch-5-Minuten.pptx"
pdf = P / "ausgabe/abgabe-5-minuten/CircularFlow_INNOSPRINT2026_Pitch-5-Minuten.pdf"
spr = P / "ausgabe/sprechtexte/CircularFlow_INNOSPRINT2026_Pitch-5-Minuten_Sprechtext.pdf"
readme = (P / "README.md").read_text(encoding="utf-8")

erg = {"pruefungen": []}
def pruef(name, soll, ist, ok):
    erg["pruefungen"].append({"name": name, "soll": soll, "ist": ist, "ok": bool(ok)})

# 1 Prüfsummen
sha = {k: hashlib.sha256(p.read_bytes()).hexdigest() for k, p in {"pptx": pptx, "pdf": pdf, "sprechtext": spr}.items()}
erg["sha256"] = sha
m = re.search(r"PPTX `([0-9a-f]{16})`, PDF `([0-9a-f]{16})`, Sprechtext `([0-9a-f]{16})`", readme)
for k, v in zip(("pptx", "pdf", "sprechtext"), m.groups()):
    pruef(f"Prüfsumme {k} laut README", v, sha[k][:16], sha[k].startswith(v))

# 2 PPTX: Notizen, Zeitfenster, Ausblendung, Links
prs = Presentation(str(pptx))
folien = []
zf = zipfile.ZipFile(pptx)
for i, s in enumerate(prs.slides, 1):
    xml = zf.read(f"ppt/slides/slide{i}.xml").decode("utf-8")
    versteckt = 'show="0"' in xml[:600]
    notiz = [p.text for p in s.notes_slide.notes_text_frame.paragraphs] if s.has_notes_slide else []
    rels = zf.read(f"ppt/slides/_rels/slide{i}.xml.rels").decode("utf-8")
    ziele = sorted(set(int(x) for x in re.findall(r'Target="slide(\d+)\.xml"', rels)))
    texte = []
    for sh in s.shapes:
        if sh.has_text_frame:
            t = " ".join(p.text for p in sh.text_frame.paragraphs).strip()
            if t:
                texte.append(t)
    folien.append({"nr": i, "versteckt": versteckt, "notiz": notiz, "linkziele": ziele, "texte": texte})
erg["folien"] = len(folien)
pruef("Folienzahl PPTX", 15, len(folien), len(folien) == 15)
versteckt = [f["nr"] for f in folien if f["versteckt"]]
pruef("Ausgeblendete Folien", [5, 6, 10, 11, 12, 13, 14, 15], versteckt, versteckt == [5, 6, 10, 11, 12, 13, 14, 15])
links = {f["nr"]: f["linkziele"] for f in folien if f["linkziele"]}
erg["links_pptx"] = links
soll_links = {4: [5, 6], 5: [6, 7], 6: [7]}
pruef("Links PPTX (Folie -> Ziele)", soll_links, links, links == soll_links)

# 3 Wortzahl nach der Regel des Generators (baue.js)
def sprech(a): return not re.match(r"^(Klick:|Bei Zeitdruck:|Bei Rückfragen:)", a)
def gesprochen(a):
    a = re.sub(r"^K\d · ", "", a)
    a = re.sub(r"^Feyrouz: ", "", a)
    return re.sub(r"^Zurück zur Präsentation, Folie 7 · ", "", a)
def woerter(s): return len([w for w in re.split(r"\s+", s) if w])
sichtbar = [f for f in folien if not f["versteckt"]]
je = {}
anteil = {"Feyrouz": 0, "Houssam": 0}
zeit_sek, uhr = {}, {}
for f in sichtbar:
    n = f["notiz"]
    kopf = n[0] if n else ""
    spricht = re.sub(r"^Spricht:\s*", "", kopf)
    zeile = next((a for a in n if a.startswith("Zeitfenster:")), "")
    mz = re.search(r"etwa (\d+) Sekunden · Uhr am Ende: (\d+:\d{2})", zeile)
    zeit_sek[f["nr"]] = int(mz.group(1)) if mz else None
    uhr[f["nr"]] = mz.group(2) if mz else None
    körper = [a for a in n[1:] if not a.startswith("Zeitfenster:") and sprech(a)]
    w_abs = [woerter(gesprochen(a)) for a in körper]
    je[f["nr"]] = {"spricht": spricht, "woerter": sum(w_abs), "absaetze": w_abs}
    for a in körper:
        w = woerter(gesprochen(a))
        if a.startswith("Feyrouz: "):
            anteil["Feyrouz"] += w
        elif spricht == "Feyrouz":
            anteil["Feyrouz"] += w
        elif spricht.startswith("Houssam"):
            anteil["Houssam"] += w
        else:
            anteil["Houssam"] += w
gesamt = sum(v["woerter"] for v in je.values())
erg["woerter_je_folie"] = je
erg["woerter_gesamt"] = gesamt
erg["sprecheranteil"] = anteil
summe_sek = sum(v for v in zeit_sek.values() if v)
erg["zeitfenster"] = zeit_sek
erg["uhr"] = uhr
erg["zeit_summe_s"] = summe_sek
mm = lambda s: f"{s // 60}:{s % 60:02d}"
laufend, uhr_ber = 0, {}
for nr in sorted(zeit_sek):
    laufend += zeit_sek[nr]
    uhr_ber[nr] = mm(laufend)
pruef("Uhr am Ende je Folie = Summe der Zeitfenster", uhr_ber, uhr, uhr_ber == uhr)
ruhig = round(gesamt / 1.8 + 18)
zuegig = round((gesamt / 2.3 + 18) / 5) * 5
erg["zeit_ruhig_s"], erg["zeit_zuegig_s"] = ruhig, zuegig
pruef("Zeit ruhig (Wörter/1,8 + 18 s) gegen Summe der Zeitfenster", summe_sek, ruhig, abs(ruhig - summe_sek) <= 1)

# 4 README-Aussagen
def lies(muster, flags=0):
    mm_ = re.search(muster, readme, flags)
    return mm_.groups() if mm_ else None
r_woerter = lies(r"Standard-Sprechtext hat (\d+) Wörter\. Feyrouz spricht (\d+), Houssam (\d+)")
pruef("README: Wörter gesamt", gesamt, int(r_woerter[0]) if r_woerter else None, r_woerter and int(r_woerter[0]) == gesamt)
pruef("README: Feyrouz", anteil["Feyrouz"], int(r_woerter[1]) if r_woerter else None, r_woerter and int(r_woerter[1]) == anteil["Feyrouz"])
pruef("README: Houssam", anteil["Houssam"], int(r_woerter[2]) if r_woerter else None, r_woerter and int(r_woerter[2]) == anteil["Houssam"])
tab = re.findall(r"^\| (\d) \| [^|]+ \| [^|]+ \| (\d+) s \| \*{0,2}(\d:\d{2})\*{0,2} \|$", readme, re.M)
r_zeit = {int(a): (int(b), c) for a, b, c in tab}
soll_zeit = {nr: (zeit_sek[nr], uhr[nr]) for nr in zeit_sek}
pruef("README: Zeitfenster und Uhr je Folie", soll_zeit, r_zeit, r_zeit == soll_zeit)
r_tempo = lies(r"ruhigem Tempo \(etwa 1,8 Wörter je Sekunde\) dauert der Vortrag (\d:\d{2})")
pruef("README: Dauer ruhig", mm(summe_sek), r_tempo[0] if r_tempo else None, r_tempo and r_tempo[0] == mm(summe_sek))
r_z = lies(r"zügigem Tempo \(2,3 Wörter je Sekunde\) dauert er etwa (\d:\d{2})")
pruef("README: Dauer zügig", mm(zuegig), r_z[0] if r_z else None, r_z and r_z[0] == mm(zuegig))
r_rest = lies(r"Grenze von 5:00 bleiben (\d+) Sekunden")
pruef("README: Rest bis 5:00", 300 - summe_sek, int(r_rest[0]) if r_rest else None, r_rest and int(r_rest[0]) == 300 - summe_sek)

# 5 Folien-PDF
r = PdfReader(str(pdf))
pruef("Seitenzahl Folien-PDF", 15, len(r.pages), len(r.pages) == 15)
idx = {p.indirect_reference.idnum: i + 1 for i, p in enumerate(r.pages)}
pdf_links = {}
for i, page in enumerate(r.pages, 1):
    for a in page.get("/Annots") or []:
        a = a.get_object()
        if a.get("/Subtype") != "/Link":
            continue
        dest = a.get("/Dest")
        if dest is None and a.get("/A") is not None:
            dest = a["/A"].get_object().get("/D")
        if dest is not None:
            z = idx.get(dest[0].idnum)
            pdf_links.setdefault(i, []).append(z)
pdf_links = {k: sorted(v) for k, v in pdf_links.items()}
erg["links_pdf"] = pdf_links
pruef("Links PDF (Seite -> Zielseiten)", soll_links, pdf_links, pdf_links == soll_links)
fonts = subprocess.run(["pdffonts", str(pdf)], capture_output=True, text=True).stdout
nicht_eingebettet = [l for l in fonts.splitlines()[2:] if l.split()[-5:-4] == ["no"]]
pruef("PDF-Schriften eingebettet", 0, len(nicht_eingebettet), not nicht_eingebettet)
pdf_text = [subprocess.run(["pdftotext", "-f", str(i), "-l", str(i), "-layout", str(pdf), "-"], capture_output=True, text=True).stdout for i in range(1, 16)]
fehlt = []
for f in folien:
    titel = f["texte"][0] if f["texte"] else ""
    erstes = re.sub(r"\s+", " ", titel)[:40]
    if erstes and erstes not in re.sub(r"\s+", " ", pdf_text[f["nr"] - 1]):
        fehlt.append((f["nr"], erstes))
pruef("PDF-Seite enthält den Anfang des Titels der PPTX-Folie", [], fehlt, not fehlt)

# 6 Sprechtext-PDF
sp = PdfReader(str(spr))
pruef("Seitenzahl Sprechtext-PDF", 16, len(sp.pages), len(sp.pages) == 16)
sp_text = "\n".join(subprocess.run(["pdftotext", "-layout", str(spr), "-"], capture_output=True, text=True).stdout.splitlines())
norm = lambda s: re.sub(r"[\s\-­]+", "", s)
sp_norm = norm(sp_text)
fehl_abs = []
for f in folien:
    for a in f["notiz"][1:]:
        if not a.startswith("Zeitfenster:") and norm(a) not in sp_norm:
            fehl_abs.append((f["nr"], a[:60]))
pruef("Jeder Notizabsatz steht im Sprechtext-PDF", [], fehl_abs, not fehl_abs)
m2 = re.search(r"(\d+) Wörter · Summe der Zeitfenster: (\d+) s \((\d:\d{2})\)", sp_text)
pruef("Sprechtext-Deckblatt: Wörter, Summe, Uhr", [gesamt, summe_sek, mm(summe_sek)], list(m2.groups()) if m2 else None,
      m2 and int(m2.group(1)) == gesamt and int(m2.group(2)) == summe_sek and m2.group(3) == mm(summe_sek))
m3 = re.search(r"zügigem Tempo \(2,3 Wörter je Sekunde\) dauert der Vortrag etwa (\d:\d{2})", re.sub(r"\s+", " ", sp_text))
pruef("Sprechtext-Zeitsatz: zügig", mm(zuegig), m3.group(1) if m3 else None, m3 and m3.group(1) == mm(zuegig))

erg["alle_ok"] = all(p["ok"] for p in erg["pruefungen"])
aus.write_text(json.dumps(erg, ensure_ascii=False, indent=1), encoding="utf-8")
for p in erg["pruefungen"]:
    print(("OK    " if p["ok"] else "FEHLER"), p["name"], "" if p["ok"] else f"| soll {p['soll']} | ist {p['ist']}")
print("Wörter:", gesamt, "| Sprecheranteil:", anteil, "| Summe Zeitfenster:", summe_sek, "s =", mm(summe_sek), "| ruhig gerechnet:", ruhig, "s | zügig:", mm(zuegig))
print("ALLES OK" if erg["alle_ok"] else "ES GIBT ABWEICHUNGEN")
