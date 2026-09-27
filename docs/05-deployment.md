# 05 — Deployment, Performance & Go-Live

> **Zweck**: GitHub Actions, Cloudflare-DNS, Checkliste vor dem Livegang, Performance-Budget.
> Diese Datei wird NICHT automatisch geladen. Verweise in der Aufgabenstellung
> ausdrücklich darauf, z.B.: "Lies CLAUDE.md und docs/..., dann ...".

---

## 9. DEPLOYMENT CHECKLIST

### 9.1 Before Launch

- [ ] **Code Quality**
  - [ ] `npm run build` succeeds (no warnings)
  - [ ] `npm run preview` shows no console errors
  - [ ] Lighthouse score > 90 (Performance, Accessibility, Best Practices, SEO)
  - [ ] All TypeScript strict (no `any` types)

- [ ] **Security**
  - [ ] No API keys in code (use `.env.local`)
  - [ ] HTTPS enforced (GitHub Pages automatic)
  - [ ] Contact form validates input (prevent SQL injection, XSS)

- [ ] **Performance**
  - [ ] Images optimized (< 200kb each)
  - [ ] Videos compressed (< 5MB per video)
  - [ ] Fonts preloaded (self-hosted, woff2)
  - [ ] Bundle size < 200kb (gzip)

- [ ] **Legal**
  - [ ] Impressum vollständig (Name, echte Anschrift, E-Mail, Telefon) — KEINE USt-ID
  - [ ] Datenschutzerklärung nennt: GA4, Kontaktformular (PHP-Endpoint), GitHub Pages, Cloudflare
  - [ ] AVV mit Google abgeschlossen (GA4-Konto → Verwaltung → Kontoeinstellungen)
  - [ ] AVV mit Cloudflare abgeschlossen (falls Proxy aktiv)
  - [ ] Cookie-Banner: GA4 lädt NACHWEISLICH erst nach "Akzeptieren" (im Netzwerk-Tab prüfen!)
  - [ ] "Ablehnen" ist gleichwertig sichtbar wie "Akzeptieren" (keine Dark Patterns)
  - [ ] Einwilligung lässt sich nachträglich widerrufen (Footer-Link "Cookie-Einstellungen")
  - [ ] Beide Rechtstexte in DE + EN

- [ ] **Analytics**
  - [ ] GA4 ID in `.env.local`
  - [ ] **Test**: Seite im Inkognito-Modus öffnen → Netzwerk-Tab → KEIN Request an
        `googletagmanager.com` vor dem Klick auf "Akzeptieren"
  - [ ] Kein `anonymize_ip` im Code (UA-Relikt, unter GA4 wirkungslos — siehe docs/04-legal.md)
  - [ ] Google Signals + Werbefunktionen in GA4 DEAKTIVIERT (sonst zusätzliche Einwilligungspflicht)
  - [ ] Datenaufbewahrung in GA4 auf 2 Monate gesetzt (Verwaltung → Dateneinstellungen)
  - [ ] Search Console verifiziert
  - [ ] Sitemap in GSC eingereicht

- [ ] **Kontaktformular (PHP-Endpoint)**
  - [ ] `contact.php` auf domain-offensive hochgeladen
  - [ ] Subdomain `mail.robin-adler.de` per A-Record gesetzt (Cloudflare: DNS only)
  - [ ] CORS-Origin im PHP auf `https://robin-adler.de` gesetzt
  - [ ] Testversand funktioniert, Mail landet NICHT im Spam
  - [ ] SPF + DMARC im DNS gesetzt
  - [ ] Honeypot-Feld im Frontend vorhanden und unsichtbar
  - [ ] Rate Limit greift (4. Versuch innerhalb einer Stunde → 429)
  - [ ] `.ratelimit`-Verzeichnis von außen nicht erreichbar

- [ ] **Routing (haeufigste Fehlerquelle bei GitHub Pages)**
  - [ ] Jede Route existiert als echte Datei in `dist/` (z.B. `dist/de/build/index.html`)
  - [ ] Direktaufruf von `robin-adler.de/de/build` liefert **HTTP 200**, nicht 404
        (pruefen mit `curl -I https://robin-adler.de/de/build`)
  - [ ] Seitenaufruf mit deaktiviertem JavaScript zeigt lesbaren Inhalt
  - [ ] `404.html` ist eine echte Fehlerseite, KEIN kopiertes `index.html`
  - [ ] Kein `_redirects` im Build (Netlify-Syntax, hier wirkungslos)
  - [ ] `public/CNAME` enthaelt `robin-adler.de` (während der Vorschau: `preview.robin-adler.de`)
  - [ ] Produktions-Build hat KEIN `noindex` (`curl -s https://robin-adler.de/de/ | grep robots` → leer)

- [ ] **DNS & Hosting**
  - [ ] GitHub Pages: Source "GitHub Actions", Custom domain gesetzt, Enforce HTTPS an
  - [ ] Domain in GitHub verifiziert (Verified domains)
  - [ ] CloudFlare DNS pointing to GitHub Pages
  - [ ] SSL/TLS certificate valid (GitHub auto-provides)

- [ ] **SEO**
  - [ ] Meta tags correct on all pages
  - [ ] OpenGraph images 1200x630px
  - [ ] Schema.org structured data renders in test
  - [ ] Mobile-friendly (test in GSC Mobile Usability)

### 9.2 GitHub Actions Deployment

Umgesetzt in `.github/workflows/deploy.yml` — dort ist die geltende Fassung.

- Offizielle Pages-Actions (`upload-pages-artifact` + `deploy-pages`), **nicht**
  `peaceiris/actions-gh-pages`: kein `gh-pages`-Branch, kein Token-Push, Deployment
  als Artefakt mit eigener Umgebung `github-pages`.
- Node 22 (Node 18 ist seit 2025 ohne Support), Actions in aktuellen Major-Versionen.
- Push auf `main` → bauen, prüfen, deployen. Pull Requests → nur bauen und prüfen.
- Prüfschritt: Der Build bricht ab, wenn prerenderte Routen, `404.html`, Sitemap
  oder `robots.txt` fehlen.

**Einmalig in GitHub einstellen** (kann der Workflow nicht selbst):
1. Settings → Pages → Build and deployment → Source: **GitHub Actions**
2. Settings → Pages → Custom domain: die Domain aus `public/CNAME` eintragen, speichern,
   nach dem Zertifikat **Enforce HTTPS** aktivieren.
   Wichtig: Bei Deployments per Actions ignoriert GitHub die CNAME-Datei im Artefakt —
   die Domain wirkt nur über diese Einstellung.
3. Empfohlen: Domain unter Profil → Settings → Pages → *Verified domains* verifizieren
   (schützt vor Übernahme der Subdomain durch fremde Repositories).

**Vorschau vs. Produktion** — gesteuert allein über `public/CNAME`:

| `public/CNAME`           | `SITE_URL`                        | Indexierung                         |
|--------------------------|-----------------------------------|-------------------------------------|
| `preview.robin-adler.de` | `https://preview.robin-adler.de`  | jede Seite `noindex, nofollow`, keine Sitemap in robots.txt |
| `robin-adler.de`         | `https://robin-adler.de`          | normal, Sitemap in robots.txt       |

Go-Live = `public/CNAME` auf `robin-adler.de` ändern + Custom domain in den Settings umstellen.

### 9.3 Environment Variables

```bash
# .env.local (never commit this — in .gitignore aufnehmen!)
VITE_GA_ID=G-XXXXXXXXXX
VITE_GSC_VERIFICATION=xxxxxxxxxxxxxxxxxxxx
VITE_CONTACT_API=https://mail.robin-adler.de/contact.php
```

> **Achtung**: Alles mit `VITE_`-Präfix landet im Client-Bundle und ist öffentlich
> einsehbar. Das ist für GA-ID und Endpoint-URL in Ordnung (beide sind ohnehin
> im Netzwerk-Tab sichtbar). Niemals Secrets (Mail-Passwörter, API-Keys) hier
> ablegen — die gehören ausschließlich serverseitig in die PHP-Datei bzw. deren
> Konfiguration auf domain-offensive.

### 9.4 DNS Setup (CloudFlare)

Ziel ist immer `schattenfalke.github.io` (GitHub-Konto des Repos), **nicht** `robin-adler.github.io`.
Proxy-Status: **DNS only** (graue Wolke), sonst kann GitHub kein Zertifikat ausstellen.

Vorschau:
```
Type: CNAME   Name: preview   Content: schattenfalke.github.io   Proxy: DNS only   TTL: Auto
```

Produktion (Apex-Domain — Cloudflare löst CNAME am Apex per "CNAME Flattening" auf;
alternativ die vier A-Records von GitHub Pages):
```
Type: CNAME   Name: @     Content: schattenfalke.github.io   Proxy: DNS only   TTL: Auto
Type: CNAME   Name: www   Content: schattenfalke.github.io   Proxy: DNS only   TTL: Auto
```

---


---

## 11. PERFORMANCE OPTIMIZATION

### 11.1 Vite Config Optimization

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      threshold: 1024, // Compress files > 1KB
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'motion': ['motion'],
          'three': ['three', '@react-three/fiber'],
        },
      },
    },
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
});
```

### 11.2 Image Optimization

Kein Next.js in diesem Projekt, also keine `next/image`-Optimierung.
Bilder werden beim Build vorverarbeitet (z.B. `vite-plugin-image-optimizer`)
oder einmalig manuell optimiert:

```bash
# Optimize images for web
npx imagemin public/assets/*.jpg --out-dir=public/assets --plugin=mozjpeg --quality=80
npx imagemin public/assets/*.png --out-dir=public/assets --plugin=pngquant
```

---

## 12. QUICK-START COMMANDS

```bash
# Clone & setup
git clone https://github.com/robin-adler/robin-adler-website.git
cd robin-adler-website
npm install

# Development
npm run dev
# → localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy (automatic via GitHub Actions)
git push origin main
# → Builds and deploys to GitHub Pages automatically
```

---

## 13. NEXT STEPS AFTER LAUNCH

1. **Monitor Google Analytics** (first week): Track visitor flow, which sections get most attention
2. **Iterate on Cases**: Add more detailed case studies based on GA insights
3. **Engage on Social**: Share individual cases on LinkedIn/Twitter
4. **Optimize Conversions**: A/B test CTA copy, button colors
5. **Expand i18n**: Add additional languages if demand grows
6. **Gather Testimonials**: Record quick video testimonials from clients, embed in cases

---
