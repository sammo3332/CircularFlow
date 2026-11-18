# CircularFlow · erster echter Scan-Versuch

Stand 18.11.2026. Technischer Versuch auf Auftrag von Houssam: vorhandene Scan-Technik und Open Source prüfen und sinnvoll nutzbar machen. Die Wahl dieses kleinen Versuchs ist eine Empfehlung von ChatGPT, keine Freigabe für eine neue Pitch-Demo.

Nutzerfall: Eine Person erfasst vor Ort ein Bauteil mit lesbarem Typenschild. Sie möchte Hersteller, Modell, Seriennummer und Baujahr nicht vollständig abtippen. Die Angaben müssen am Foto kontrolliert werden. Der Versuch ergänzt die frühe Datenerfassung; die bestehende Prüfung der Bestellfrist bleibt unverändert.

Prüfziel: Echte Bild-zu-Text-Verarbeitung statt des bisherigen Seitenverhältnis-Platzhalters. Einträge bleiben Vorschläge, bis eine Person sie am Foto prüft. Ein akzeptierter Etikettwert wird niemals als gemessen oder fachlich freigegeben markiert.

Abnahme vor Umsetzung:
1. Lokale Foto-/Dateiauswahl, echte Texterkennung aus Pixeln; kein Foto-Upload und kein Modell-API-Aufruf.
2. Nur ausdrücklich beschriftete Metadaten werden vorgeschlagen. Leeres Bild, unlesbarer Text, widersprüchliche Doppelwerte und unbekannte Felder erzeugen keine erfundenen Angaben.
3. Menschliche Prüfung je übernommener Angabe; lokales Speichern und JSON-Export eines geprüften Entwurfs. Foto bleibt im Arbeitsspeicher und wird nicht als Teil des gespeicherten Entwurfs abgelegt.
4. Breite, Höhe, Brandschutz, Material, Schadstoffe, Eignung und Verfügbarkeit bleiben außerhalb der automatischen Übernahme. Ein Text auf einem Typenschild ist kein Aufmaß und kein gültiger Nachweis.
5. Tests mit echter OCR-Engine an ausdrücklich synthetischen Etiketten, einschließlich leerem Bild und undeutlicher Variante. Ergebnisse und Grenzen dokumentieren. Kein Praxisbeleg und keine Zeitersparnis ohne Vergleichsversuch.

Entscheidung vom 18.11.2026: Tesseract.js 7.0.0 wird als erster lokaler OCR-Baustein verwendet. Begründung: vorhandene ausführbare Engine, Browserbetrieb möglich, keine API-Kosten und keine Übertragung von Gebäudeaufnahmen erforderlich. Diese Auswahl ersetzt keine spätere Prüfung einer echten Bauteil-Bilderkennung. Florence-2 und RoomPlan sind recherchierte spätere Optionen, nicht implementiert.

Grenze: eigenständiger Versuchsbereich. Noch keine Übernahme in den Bauteilpass, keine geräteübergreifende Synchronisation, kein 3D-Scan. Freigegebener Pitch und Plattformcode bleiben erhalten. Ein separates Arbeitsbranch enthält nur diesen Versuch.
