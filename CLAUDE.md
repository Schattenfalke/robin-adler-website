# robin-adler.de

Persönliche Business-Website von Robin Adler (Robin Adler Systems).
Ziel: Leads für Beratungsleistungen. Die Seite ist selbst der Kompetenzbeweis —
Code-Qualität und Performance sind Teil des Produkts, nicht Beiwerk.

## Stack

- React 19 + TypeScript (strict) + Vite
- Tailwind CSS
- `motion` für Scroll-Animationen — das ist das umbenannte `framer-motion`,
  EIN Paket, nicht zwei. Import: `motion/react`
- `three` (aktuelle Version) + `@react-three/fiber` + `@react-three/drei`
- i18next, Sprachen: `de` (Standard) und `en`
- Deployment: GitHub Pages, statischer Build, kein Server-Runtime
- Routing: **prerendert**, eine echte HTML-Datei pro Route. Kein SPA-Fallback
  über `404.html` — der liefert Status 404 und schadet der Auffindbarkeit.
  Kein `_redirects`, das ist Netlify-Syntax und wirkungslos hier.
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
- Kein Next.js. Findet sich in den Referenzdokumenten `next/head`, `next/router`
  oder `next/image`, ist das ein Fehler in der Vorlage — ersetze durch
  React-19-Metadaten (siehe nächste Regel), `react-i18next` bzw. Build-Zeit-Bildoptimierung.
- Kein `react-helmet-async`. React 19 hebt `<title>`, `<meta>` und `<link>` selbst in den
  `<head>`, der Prerenderer schreibt sie in die statische HTML-Datei
  (`src/components/Seo/PageMeta.tsx`). Nicht wieder einbauen.
- Stammdaten (Anschrift, E-Mail, Telefon, Domain) stehen ausschließlich in `src/lib/site.ts`.
  Impressum, Datenschutz, Schema.org und Footer lesen daraus. Nirgends sonst hart schreiben.
- Routen werden zentral in `src/lib/routes.ts` gepflegt. Router, Prerenderer und
  Sitemap lesen daraus. Keine Route an zwei Stellen hart schreiben.
- Rechtstexte (Impressum, Datenschutz, Cookie-Banner) sind in DE und EN gleich vollständig.
  Keine gekürzte Fassung in einer der Sprachen.

## Korrektheit schlägt Stilregel

Würde eine Projektregel dazu führen, dass Code seine Funktion verliert, ist die Funktion
wichtiger. Dann: Ausnahme setzen, direkt am Code mit Kommentar begründen, im Bericht
der Sitzung erwähnen. Stillschweigende Ausnahmen gibt es nicht.

Präzedenzfall: `gtag.js` braucht im `dataLayer` das `arguments`-Objekt. Ein Array
(Rest-Parameter, "moderner" Stil) wird kommentarlos verworfen — GA misst dann nichts.
Deshalb steht in `src/lib/analytics.ts` bewusst eine `function` mit `arguments` und
einem Lint-Disable samt Begründung.

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
