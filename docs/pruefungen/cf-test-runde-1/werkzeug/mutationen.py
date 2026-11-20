# Mutationsprobe auf KOPIEN der App-Dateien im Scratchpad (nie in den Git-Arbeitsverzeichnissen).
import subprocess, shutil, sys, re
from pathlib import Path
M = Path(sys.argv[1])
muts = [
 ("M1 Regel: Fristtag um +1 Tag verschoben", "plattform/app/abgleich.js", "status: 'ok', tag: tagText(G - pz.wert)", "status: 'ok', tag: tagText(G - pz.wert + 1)"),
 ("M2 Regel: Annahmefenster wird ignoriert", "plattform/app/abgleich.js", "const annahme = A2.tag !== null && A2.tag < F.tag;", "const annahme = false;"),
 ("M3 Regel: Annahmeende zählt auch bei Gleichstand (< wird <=)", "plattform/app/abgleich.js", "A2.tag < F.tag; const G", "A2.tag <= F.tag; const G"),
 ("M4 Zeitkritisch: Fenster um einen Tag länger", "plattform/app/kennzahlen.js", "if (t < jetzt || t > ende) continue;", "if (t < jetzt || t > ende + 1440) continue;"),
 ("M5 Zeitkritisch: Eintrag auch ohne prüfbares Paar", "plattform/app/kennzahlen.js", "const f = n ? pruefbitteFrist(d) : null;", "const f = pruefbitteFrist(d);"),
 ("M6 Zeitkritisch: Tage aufgerundet statt abgerundet", "plattform/app/kennzahlen.js", "tage: Math.floor((t - jetzt) / 1440), pruefbarePaare", "tage: Math.ceil((t - jetzt) / 1440), pruefbarePaare"),
 ("M7 Zeitkritisch: Fristende am Tagesanfang statt 23:59", "plattform/app/kennzahlen.js", "const at = tagesende(f.tag); const t = minuten(at);", "const at = f.tag + 'T00:00'; const t = minuten(at);"),
 ("M8 Zeitkritisch: Einzahl/Mehrzahl vertauscht", "plattform/app/kennzahlen.js", "n === 1 ? 'prüfbares Paar' : 'prüfbare Paare'", "n === 1 ? 'prüfbare Paare' : 'prüfbares Paar'"),
 ("M9 Bedarfsseite: Grenztag gilt schon als verstrichen (< wird <=)", "plattform/app/ansichten/bedarfe.js", "const verstrichen = f.tag < String(ctx.at).slice(0, 10);", "const verstrichen = f.tag <= String(ctx.at).slice(0, 10);"),
 ("M10 Bedarfsseite: Chip „geschätzt“ entfällt", "plattform/app/ansichten/bedarfe.js", "${f.geschaetzt.length ? ` ${chip('geschätzt', 'warn')}` : ''}", "${''}"),
 ("M11 Bedarfsseite: Satz „In den 7 Tagen davor“ immer anzeigen", "plattform/app/ansichten/bedarfe.js", "`${verstrichen ? '' : '<small>In den 7 Tagen", "`${false ? '' : '<small>In den 7 Tagen"),
 ("M12 Übersicht: Detailzeile wird nicht benutzt", "plattform/app/ansichten/uebersicht.js", "${f.detail ? esc(f.detail) : f.art", "${false ? esc(f.detail) : f.art"),
]
ueberlebt = []
for i, (name, datei, alt, neu) in enumerate(muts, 1):
    ziel = M / f"m{i}"
    if ziel.exists(): shutil.rmtree(ziel)
    shutil.copytree(M / "base", ziel)
    p = ziel / datei; s = p.read_text(encoding="utf-8")
    if s.count(alt) != 1:
        print(f"{name}: MUTATION NICHT ANWENDBAR (Fundstellen: {s.count(alt)})"); continue
    p.write_text(s.replace(alt, neu), encoding="utf-8")
    r = subprocess.run(["node", "--test", str(ziel / "plattform/test/pruefbittefrist.test.mjs")], capture_output=True, text=True)
    fail = re.search(r"# fail (\d+)", r.stdout); n = int(fail.group(1)) if fail else -1
    gefangen = [m.group(1) for m in re.finditer(r"^not ok \d+ - (.+)$", r.stdout, re.M)]
    status = "ERKANNT" if n > 0 else "ÜBERLEBT"
    if n == 0: ueberlebt.append(name)
    print(f"{status:9} {name} | fehlgeschlagene neue Tests: {n} {('(' + '; '.join(g[:38] for g in gefangen[:3]) + ')') if gefangen else ''}")
print("\nÜBERLEBT (von der neuen Testdatei nicht erkannt):", ueberlebt if ueberlebt else "keine")
