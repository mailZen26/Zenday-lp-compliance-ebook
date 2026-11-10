# zen-day.ai – Website & Landingpages

Statische Seiten für **zen-day.ai**. Jeder Push auf `main` geht automatisch über Vercel live.

## Ordnerstruktur

```
/
├── index.html              Startseite (zen-day.ai)
├── zenday.css, zenday.js   gemeinsames Design und Script für alle Seiten
├── vercel.json             Weiterleitungen von alten Adressen
├── assets/                 seitenübergreifende Bilder (z. B. Foto Tilmann Förster)
├── learning-lab/           Hub für E-Books, Kurse, Mini-Apps (+ später blog/)
├── ebooks/
│   └── <thema>/            eine Landingpage pro E-Book
│       ├── index.html      Opt-in-Seite   → zen-day.ai/ebooks/<thema>/
│       ├── danke/index.html Danke-Seite   → zen-day.ai/ebooks/<thema>/danke/
│       └── assets/         Cover, OG-Bild, Vorschauseiten
├── ki-teamassistenz/       Warteliste KI Teamassistenz (gleiche Form: danke/, assets/)
├── impressum/
└── datenschutz/
```

## Regeln für neue Seiten

1. **Ein Ordner pro Seite**, darin immer `index.html`. Ordnername = URL, nur Kleinbuchstaben, Bindestriche, keine Umlaute (`ae`, `oe`, `ue`).
2. **Neues E-Book:** Ordner unter `ebooks/` anlegen, immer mit `index.html`, `danke/index.html` und `assets/`. Keine Bilder lose in den Ordner legen.
3. **Bildnamen:** `cover.jpg`, `og.jpg` (1200 × 630), `vorschau-<name>.jpg`.
4. **Pfade immer absolut** ab Root schreiben: `/ebooks/empfang/assets/cover.jpg`, `/zenday.css`.
5. **Danke-Seiten** bekommen `<meta name="robots" content="noindex, nofollow">`.
6. **Footer** jeder Seite verlinkt `/impressum` und `/datenschutz`. Keine Links mehr auf zen-day.de.
7. **Adresse geändert?** Alte URL in `vercel.json` auf die neue weiterleiten, damit Ads und Links nicht brechen.
8. Keine Platzhalter-Dateien committen. Ein Ordner entsteht mit seiner ersten echten Datei.
