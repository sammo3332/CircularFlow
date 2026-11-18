#!/usr/bin/env python3
"""Vergleicht die heruntergeladene veröffentlichte Plattform mit plattform/ im Repository und mit einem Nachbau.
Aufruf: python3 -I dateivergleich.py <repo-wurzel> <download-ordner> <nachbau-ordner> <ausgabe.txt>
Der Nachbau entsteht mit: node plattform/bauen-artifact.mjs <nachbau-ordner> (Zielordner außerhalb des Repositorys)."""
import hashlib, sys
from pathlib import Path

repo, dl, nb, aus = (Path(a) for a in sys.argv[1:5])
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
dateien = sorted(str(p.relative_to(dl)) for p in dl.rglob("*") if p.is_file())
zeilen, lokal_gleich, nachbau_gleich, abw_lokal, abw_nachbau = [], 0, 0, [], []
for d in dateien:
    h = sha(dl / d)
    l = repo / "plattform" / d
    n = nb / d
    hl = sha(l) if l.is_file() else None
    hn = sha(n) if n.is_file() else None
    if hl == h: lokal_gleich += 1
    else: abw_lokal.append(d)
    if hn == h: nachbau_gleich += 1
    else: abw_nachbau.append(d)
    zeilen.append(f"{h}  {(dl / d).stat().st_size:>8}  {'gleich' if hl == h else 'ABWEICHT':<8} {'gleich' if hn == h else 'ABWEICHT':<8} {d}")
ausgabe = [
    "Vergleich der heruntergeladenen veröffentlichten Plattform mit dem Repository",
    f"Dateien im Download: {len(dateien)}",
    f"gleich wie plattform/ im Repository: {lokal_gleich} von {len(dateien)}; abweichend: {', '.join(abw_lokal) or '-'}",
    f"gleich wie der Nachbau aus bauen-artifact.mjs: {nachbau_gleich} von {len(dateien)}; abweichend: {', '.join(abw_nachbau) or '-'}",
    "Spalten: SHA-256 der heruntergeladenen Datei | Größe in Bytes | gegen plattform/ | gegen Nachbau | Pfad",
    "",
] + zeilen
aus.write_text("\n".join(ausgabe) + "\n", encoding="utf-8")
print("\n".join(ausgabe[:4]))
