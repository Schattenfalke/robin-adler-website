# robin-adler.de

Persönliche Business-Website von Robin Adler (Robin Adler Systems).
Ziel: Leads für Beratungsleistungen. Die Seite ist selbst der Kompetenzbeweis —
Code-Qualität und Performance sind Teil des Produkts, nicht Beiwerk.

## Stack

- React 19 + TypeScript (strict) + Vite
- Tailwind CSS
- Motion (framer-motion) für Scroll-Animationen
- Three.js + @react-three/fiber für die 3D-Hero-Szene
- i18next, Sprachen: `de` (Standard) und `en`
- Deployment: GitHub Pages, statischer Build, kein Server-Runtime
- Kontaktformular: separater PHP-Endpoint auf fremdem Shared Hosting (nicht in diesem Repo deploybar)

## Konzept in einem Satz

Drei Türen auf der Startseite — **BUILD**, **FIX**, **REVIEW** — führen zu je einem
Bereich mit einer Story-Animation, 1–3 Cases und genau einem Call-to-Action.

## Design-Tokens

Immer diese CSS-Variablen verwenden, nie Farbwerte hart schreiben:

```
--black-primary:   #0a0a0a   Hintergrund
--black-secondary: #1a1a1a   Karten, Sektionen
--red-primary:     #d32f2f   Akzent, Hover, 3D-Szene
--red-light:       #ff5252   Hover-Highlight
--gold-primary:    #d4af37   sehr sparsam einsetzen
--gray-text:       #e0e0e0   Fließtext
--gray-muted:      #888888   Sekundärtext
--green-success:   #4caf50   FIX: "gut"
--yellow-warning:  #ffc107   REVIEW: "optimierbar"
--red-danger:      #f44336   REVIEW: "kritisch"
```

Schrift: Überschriften und Code in `JetBrains Mono`, Fließtext in `Inter`.
Beide selbst gehostet aus `public/fonts/`. Niemals Google Fonts per CDN einbinden.

## Regeln

- Kein `any` in TypeScript. Kein `@ts-ignore`.
- Keine Inline-Styles und keine hart codierten Farbwerte — Tailwind-Klassen oder Tokens.
- Alle externen Assets selbst hosten. Keine Requests an fremde Domains außer dem Formular-Endpoint.
- Google Analytics darf **niemals** vor aktiver Einwilligung geladen werden. Das GA-Script
  gehört nicht ins HTML, sondern wird dynamisch aus `src/lib/analytics.ts` nachgeladen.
- Animationen starten bei `useInView`, nicht beim Seitenladen.
- Jede Animation muss `prefers-reduced-motion` respektieren.
- Bilder: `loading="lazy"`, explizite `width`/`height`, damit nichts springt.
- Alle sichtbaren Texte laufen über i18next. Keine deutschen Strings im JSX.
- `npm run build` muss ohne Warnungen durchlaufen, bevor eine Aufgabe als fertig gilt.

## Referenzdokumente

Werden **nicht** automatisch geladen. In der Aufgabe ausdrücklich nennen:

| Datei | Inhalt |
|---|---|
| `docs/00-sessions.md` | Phasenplan und fertige Aufgabentexte pro Sitzung |
| `docs/01-architektur.md` | Ordnerstruktur, Build-Setup, Design-System |
| `docs/02-seiten.md` | Seitenaufbau, Komponenten, Kontaktformular + PHP |
| `docs/03-animationen.md` | Die drei Story-Sequenzen, 3D-Szene |
| `docs/04-legal.md` | SEO, Impressum, Datenschutz, Consent, GA4 |
| `docs/05-deployment.md` | GitHub Actions, DNS, Go-Live-Checkliste |

## Arbeitsweise

- Eine Phase pro Sitzung. Siehe `docs/00-sessions.md`.
- Am Ende jeder Phase: Build prüfen, dann committen. Keine Phase überspringen.
- Nicht vorgreifen. Steht "keine Animationen" in der Aufgabe, dann keine Animationen —
  auch wenn `docs/03-animationen.md` verlockend danebenliegt.
- Platzhalter klar als solche markieren (`TODO:`), niemals erfundene Zahlen, Zitate
  oder Kundennamen einsetzen.

## Offene Punkte, die Robin selbst klären muss

- Impressum: echte Anschrift, Telefonnummer und E-Mail eintragen (aktuell Platzhalter)
- Keine USt-ID vorhanden (Kleinunternehmer) — Feld bleibt leer, nicht erfinden
- Case-Inhalte sind unstrukturiert und enthalten keine gemessenen Kennzahlen
- Higgsfield-Videos für die drei Bereiche noch nicht erzeugt
