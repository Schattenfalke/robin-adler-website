# robin-adler.de

Persönliche Business-Website von Robin Adler.
Statische React-Anwendung, deployt auf GitHub Pages.

## Einstieg

Der gesamte Projektkontext liegt in [`CLAUDE.md`](./CLAUDE.md) und `docs/`.
Der Bauplan mit fertigen Aufgabentexten pro Arbeitsschritt steht in
[`docs/00-sessions.md`](./docs/00-sessions.md).

## Lokale Entwicklung

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

Vorher `.env.local` anlegen:

```
VITE_GA_ID=G-XXXXXXXXXX
VITE_GSC_VERIFICATION=...
VITE_CONTACT_API=https://mail.robin-adler.de/contact.php
```

## Struktur

```
CLAUDE.md              Projektregeln, Design-Tokens, Konventionen
docs/00-sessions.md    Phasenplan und Aufgabentexte
docs/01-architektur.md Ordnerstruktur, Build, Design-System
docs/02-seiten.md      Seitenaufbau, Komponenten, Kontaktformular
docs/03-animationen.md Story-Sequenzen, 3D-Szene
docs/04-legal.md       SEO, Impressum, Datenschutz, Consent, GA4
docs/05-deployment.md  Actions, DNS, Go-Live-Checkliste
php-endpoint/          Kontaktformular-Backend (manuell per FTP deployt)
```

## Wichtig

Der PHP-Endpoint unter `php-endpoint/` wird **nicht** über dieses Repo deployt.
GitHub Pages führt kein PHP aus. Die Datei wird manuell auf das Shared Hosting
geladen und dort getestet.
