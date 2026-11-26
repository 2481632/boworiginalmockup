# BogenPass · Mobile Demo

Die Demo startet als Musikerin. Über **Profil → Einstellungen** lassen sich das Demo-Konto für die gewünschte Rolle und das Ergebnis der Scan-Simulation auswählen. Nach dem Rollenwechsel bleiben die Einstellungen geöffnet. Zweimal **Zurück** führt zur Startansicht der gewählten Rolle.

Musiker und Bogenbauer nutzen dieselbe Bogenliste. Die Suche findet Namen, Holzarten, Seriennummern und Bogenpass-IDs. **Sortieren** ordnet nach Erstellungsdatum oder Name. **Filtern** kombiniert Verifizierungsstatus, Favoriten und Holzarten aus der jeweiligen Sammlung. Der Stern markiert einen Favoriten für das aktuelle Demo-Konto.

Unter **Grenzkontrolle → Bogen prüfen** zeigt die Maske zuerst die Zielposition für den Bogenkopf. Nach gut zwei Sekunden simuliert die Demo einen waagerecht ausgerichteten Bogen mit grünem Rand und gibt den runden Auslöser frei. Der Auslöser startet anschließend die bekannte Scan-Simulation. Die manuelle Suche funktioniert unabhängig von der Einstellung mit einer vorhandenen Bogen-ID, etwa `BGP-8F4A-291C`. Beim Neuladen startet die Demo wieder mit den Beispieldaten. Über **Profil → Abmelden** sind Willkommensseite und Registrierung erreichbar.

Zum lokalen Start `index.html` direkt im Browser öffnen. Alle Skripte, Bilder und Schriften liegen im Ordner. Beim Kopieren oder Weitergeben den gesamten Ordner mitnehmen. Dieselbe Ordnerstruktur lässt sich unverändert unter einem beliebigen Unterpfad auf GitHub Pages veröffentlichen.

## Im Code orientieren

- `app.js` verbindet Ansichten und Aktionen und verwaltet Navigation, Dialoge und Browser-Ereignisse.
- `data.js` enthält Beispieldaten, den Zustand der laufenden Demo und den Formularzustand.
- `profile.js`, `onboarding.js`, `passes.js`, `control.js` und `workshop.js` halten die Ansichten und die zugehörigen Aktionen am selben Ort.
- `bow-list.js` enthält die gemeinsame Startansicht mit Suche, Sortierung, Filtern und Favoriten.
- `components.js` enthält gemeinsame Bausteine. `overlays.js` enthält die Vorlagen für Menüs und Dialoge.

Die Skripte werden in der Reihenfolge aus `index.html` geladen. Für eine Änderung an den Einstellungen ist `profile.js` der Einstieg, für die Scan-Simulation `control.js`.

## Auf einem Handy testen

Für den temporären Zugriff über das Internet werden `python3` und `cloudflared` benötigt. Im Repository-Stamm ausführen:

```sh
python3 mockups/bogenapp_tunnel.py
```

Das Skript startet den lokalen Server für diesen Ordner und zeigt die öffentliche URL als QR-Code im Terminal. Der [Cloudflare Quick Tunnel](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/) braucht kein Konto. Jede Person mit der URL kann die Demo öffnen, solange das Skript läuft. **Strg+C** schließt den Tunnel und den lokalen Server.

Der QR-Code wird lokal mit dem mitgelieferten MIT-lizenzierten Generator erzeugt. [Nayuki QR Code Generator v1.8.0](https://github.com/nayuki/QR-Code-generator/tree/v1.8.0/python)
