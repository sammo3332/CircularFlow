#!/usr/bin/env python3
"""C2-Gegenprobe (Hilfsskript des Prüfers, liegt im Scratchpad, nicht im Repository).
Liest die gespeicherte dateivergleich.txt (SHA-256 der damals heruntergeladenen Auslieferung je Pfad) und rechnet die Spalten
'gegen plattform/' und 'gegen Nachbau' mit dem aktuellen Pitch-Stand neu. Aufruf: c2.py <repo> <nachbau> <gespeicherte-datei>"""
import hashlib, sys
from pathlib import Path
repo, nb, gesp = (Path(a) for a in sys.argv[1:4])
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
zeilen = [z for z in gesp.read_text(encoding="utf-8").splitlines()[6:] if z.strip()]
n = len(zeilen); abw_l, abw_n, widersprueche = [], [], []
for z in zeilen:
    teile = z.split()
    h, groesse, fl, fn, pfad = teile[0], int(teile[1]), teile[2], teile[3], teile[4]
    l, nbf = repo / "plattform" / pfad, nb / pfad
    gl = l.is_file() and sha(l) == h
    gn = nbf.is_file() and sha(nbf) == h
    if not gl: abw_l.append(pfad)
    if not gn: abw_n.append(pfad)
    if (fl == "gleich") != gl or (fn == "gleich") != gn:
        widersprueche.append(pfad)
    if nbf.is_file() and nbf.stat().st_size != groesse and gn:
        widersprueche.append(pfad + " (Größe)")
print(f"Zeilen in der gespeicherten Datei: {n}")
print(f"gleich wie plattform/ im Repository (neu gerechnet): {n - len(abw_l)} von {n}; abweichend: {', '.join(abw_l) or '-'}")
print(f"gleich wie frischer Nachbau (neu gerechnet): {n - len(abw_n)} von {n}; abweichend: {', '.join(abw_n) or '-'}")
print(f"Zeilen, in denen die neu gerechneten Spalten von den gespeicherten abweichen: {len(widersprueche)} {widersprueche or ''}")
nachbau_dateien = sorted(str(p.relative_to(nb)) for p in nb.rglob('*') if p.is_file() and p.name != 'dateien.json')
gesp_pfade = sorted(z.split()[4] for z in zeilen)
print(f"Dateiliste des frischen Nachbaus (ohne dateien.json) = Dateiliste der gespeicherten Datei: {nachbau_dateien == gesp_pfade} ({len(nachbau_dateien)} Dateien)")
