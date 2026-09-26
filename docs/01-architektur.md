# 01 — Architektur, Stack & Design-System

> **Zweck**: Projektziele, Ordnerstruktur, Build-Setup, Farb- und Typo-Tokens.
> Diese Datei wird NICHT automatisch geladen. Verweise in der Aufgabenstellung
> ausdrücklich darauf, z.B.: "Lies CLAUDE.md und docs/..., dann ...".

---

## 1. PROJECT OVERVIEW & GOALS

### Vision
Robin Adler's website is a **self-showcase of his process**: not just portfolio, but **how he works**. Every animation tells a story:
- **BUILD**: Idea → Code → Live Result
- **FIX**: Error → Analysis → Healing
- **REVIEW**: Code Under Magnifying Glass → Clarity & Classification

The site **proves his competence through code quality and performance itself** — not just words.

### Core Messaging
**"Systeme bauen, die Menschen tragen und nicht von Menschen getragen werden."**

The 3 Doors represent:
- **BUILD**: New systems from scratch (Impact OS: Done-With-You, Done-For-You)
- **FIX**: Fix broken systems, optimize, debug (Refactor, Performance, Architecture)
- **REVIEW**: Audits, Code Reviews, Architecture Checks (Clarity-Pulse, Deep-Dives)

### Business Goals
1. **Generate leads** for Impact OS Tiers (450€ → 2.5k€ → 7.5k€+)
2. **Build trust** through technical excellence visible in the site itself
3. **SEO + GEO**: Rank for "System Architecture", "Code Review", "Web Optimization" + AI visibility (Claude, Perplexity)
4. **Self-documentation**: Code is clean, modular, well-commented → future handoff or client reference

---

## 2. TECHNICAL ARCHITECTURE

### 2.1 Frontend Stack
```
robin-adler.de (GitHub Pages Static)
├── React 19 (App Router via Vite)
├── TypeScript (strict mode)
├── Vite (build tool, < 2MB bundle target)
├── motion (Scroll-Animationen; Paket heisst `motion`, frueher `framer-motion` —
│         EINE Bibliothek, nicht zwei. Import: `import { motion } from 'motion/react'`)
├── three (aktuelle Version, per npm; KEINE fixe alte Version pinnen)
├── @react-three/fiber + @react-three/drei (React-Bindung fuer three)
├── Tailwind CSS (utility-first styling)
└── i18next (DE/EN routing)
```

### 2.2 Folder Structure
```
robin-adler-website/
├── public/
│   ├── fonts/              # Self-hosted Google Fonts (Inter, JetBrains Mono)
│   ├── assets/             # Higgsfield-generated videos, PNGs, SVGs
│   │   ├── build-hero.mp4
│   │   ├── fix-hero.mp4
│   │   ├── review-hero.mp4
│   │   └── icons/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── CNAME               # robin-adler.de (fuer GitHub Pages)
│   # KEIN _redirects — das ist Netlify-Syntax und hat auf GitHub Pages keine Wirkung.
│   # Routing wird ueber Prerendering geloest, siehe Abschnitt "Routing & Prerendering".
│
├── src/
│   ├── components/
│   │   ├── Hero/
│   │   │   ├── ThreeDoors.tsx       # SVG doors, click handlers
│   │   │   └── DatasFlowScene.tsx   # Three.js scene (red data flow)
│   │   ├── Sections/
│   │   │   ├── BuildSection.tsx     # Code → Website animation
│   │   │   ├── FixSection.tsx       # Red skull → green check
│   │   │   └── ReviewSection.tsx    # Magnifying glass → 3 ampels
│   │   ├── Cases/
│   │   │   ├── CaseCard.tsx
│   │   │   └── CaseModal.tsx
│   │   ├── Navigation/
│   │   │   ├── Header.tsx           # Sticky, links to 3 doors
│   │   │   └── MobileMenu.tsx
│   │   ├── Forms/
│   │   │   └── ContactForm.tsx      # Self-hosted submission
│   │   ├── Legal/
│   │   │   ├── Impressum.tsx        # DDG §5 + §7 compliant
│   │   │   ├── Privacy.tsx          # DSGVO + Google Analytics disclosure
│   │   │   └── CookieBanner.tsx     # Consent management
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   │
│   ├── hooks/
│   │   ├── useInView.ts             # Scroll trigger for animations
│   │   ├── useMediaQuery.ts         # Responsive helpers
│   │   ├── useI18n.ts               # i18n integration
│   │   └── useAnalytics.ts          # Google Analytics wrapper
│   │
│   ├── lib/
│   │   ├── i18n.ts                  # i18next config
│   │   ├── analytics.ts             # GA4 setup
│   │   ├── api.ts                   # Contact form endpoint
│   │   └── motion-presets.ts        # wiederverwendbare Animationspresets
│   │
│   ├── pages/
│   │   ├── [lang]/
│   │   │   ├── index.tsx            # Home (Hero + 3 doors)
│   │   │   ├── build.tsx            # BUILD section
│   │   │   ├── fix.tsx              # FIX section
│   │   │   ├── review.tsx           # REVIEW section
│   │   │   ├── impressum.tsx
│   │   │   ├── privacy.tsx
│   │   │   └── cookies.tsx
│   │   └── not-found.tsx
│   │
│   ├── types/
│   │   ├── cases.ts
│   │   ├── animations.ts
│   │   └── api.ts
│   │
│   ├── styles/
│   │   ├── globals.css              # Tailwind + custom vars (--primary-red, --dark-black, etc.)
│   │   └── animations.css           # Keyframes for non-Motion fallbacks
│   │
│   ├── App.tsx                      # Main router + i18n wrapper
│   └── main.tsx                     # Entry point
│
├── php-endpoint/                    # Deployed SEPARATELY to domain-offensive (NOT GitHub Pages)
│   ├── contact.php                  # Mail endpoint, CORS-locked to robin-adler.de
│   └── .htaccess                    # Rate limiting, deny direct access to logs
│
├── vite.config.ts                   # Vite config with motion.dev support
├── tsconfig.json
├── tailwind.config.ts
├── package.json
└── .github/workflows/deploy.yml     # GitHub Pages auto-deploy
```

### 2.2b Routing & Prerendering (WICHTIG)

GitHub Pages liefert ausschliesslich existierende Dateien aus. Eine reine
Single-Page-Application scheitert deshalb beim Direktaufruf: `/de/build` ist keine
Datei, also kommt eine 404 zurueck.

**Die haeufig empfohlene Loesung — `index.html` zusaetzlich als `404.html` ablegen —
wird hier NICHT verwendet.** GitHub Pages liefert `404.html` mit HTTP-Status 404 aus.
Fuer ein Projekt, dessen erklaertes Ziel Sichtbarkeit in Suchmaschinen und
KI-Assistenten ist, waere das ein Eigentor: Crawler sehen auf jeder Unterseite
zuerst einen Fehlerstatus.

**Stattdessen: Prerendering.** Beim Build wird fuer jede bekannte Route eine echte
HTML-Datei erzeugt:

```
dist/
├── index.html              → Redirect auf /de/
├── de/index.html
├── de/build/index.html
├── de/fix/index.html
├── de/review/index.html
├── de/impressum/index.html
├── de/datenschutz/index.html
├── en/... (analog)
└── 404.html                → echte Fehlerseite, kein Routing-Hack
```

Vorteile: Direktaufrufe liefern Status 200, die Seite ist ohne JavaScript lesbar
(gut fuer Crawler und KI-Assistenten), und der erste sichtbare Inhalt erscheint
schneller. Die Routenliste ist bekannt und endlich — genau der Fall, fuer den sich
Prerendering anbietet.

**Umsetzung**: `vite-react-ssg` oder ein vergleichbares Vite-Prerender-Plugin. Die
Routen werden zentral in `src/lib/routes.ts` definiert und sowohl vom Router als
auch vom Prerenderer und vom Sitemap-Generator gelesen — eine Quelle, drei Verbraucher.

```ts
// src/lib/routes.ts
export const ROUTES = ['', 'build', 'fix', 'review', 'impressum', 'datenschutz'] as const;
export const LOCALES = ['de', 'en'] as const;

export const ALL_PATHS = LOCALES.flatMap((l) =>
  ROUTES.map((r) => (r ? `/${l}/${r}` : `/${l}`))
);
```

Dynamische Inhalte (Case-Modals) bleiben client-seitig — die brauchen keine eigene URL,
solange sie nicht einzeln verlinkbar sein sollen. Falls Cases spaeter eigene URLs
bekommen, wandern sie ebenfalls in `ROUTES`.

### 2.3 Build & Deploy
**Vite Build**:
```bash
npm run build          # → dist/ folder
npm run preview        # Test production build locally
```

**GitHub Pages**:
- Repository: `robin-adler/robin-adler-website`
- Branch: `main`
- Settings → Pages → Deploy from `dist/` (via GitHub Actions)
- CNAME file: `robin-adler.de`

**CloudFlare DNS**:
- CNAME: `robin-adler.de` → `robin-adler.github.io`
- DNS only (no proxy needed initially, but can add for caching)
- Free Tier covers SSL, basic DDoS, analytics

---

## 3. DESIGN SYSTEM & COLORS

### 3.1 Color Palette
```css
/* Dark-Tech-Premium */
--black-primary: #0a0a0a;           /* Main background */
--black-secondary: #1a1a1a;         /* Cards, sections */
--red-primary: #d32f2f;             /* Hero, hover, accents */
--red-light: #ff5252;               /* Hover states, highlights */
--gold-primary: #d4af37;            /* Rare, premium accents */
--gray-text: #e0e0e0;               /* Body text */
--gray-muted: #888888;              /* Secondary text */
--green-success: #4caf50;           /* FIX section, "good" status */
--yellow-warning: #ffc107;          /* REVIEW section, "optimize" status */
--red-danger: #f44336;              /* REVIEW section, "critical" status */
```

### 3.2 Typography
```css
/* Self-hosted Google Fonts */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Variable.woff2') format('woff2');
  font-weight: 100 800;
}

/* Scale */
--text-xs: 0.75rem (12px);
--text-sm: 0.875rem (14px);
--text-base: 1rem (16px);
--text-lg: 1.125rem (18px);
--text-xl: 1.25rem (20px);
--text-2xl: 1.5rem (24px);
--text-3xl: 2rem (32px);
--text-4xl: 2.5rem (40px);
--text-5xl: 3rem (48px);

/* Headings: JetBrains Mono Bold */
h1, h2, h3: font-family: 'JetBrains Mono', monospace; font-weight: 700;

/* Body: Inter Regular */
body, p, li: font-family: 'Inter', sans-serif; font-weight: 400;

/* Code: JetBrains Mono */
code, pre: font-family: 'JetBrains Mono', monospace; font-size: 0.875rem;
```

### 3.3 Component Tokens
```tsx
// src/lib/motion-presets.ts

export const MOTION_PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { duration: 0.6 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.7, ease: "easeOut" },
  },
  codeTransform: {
    initial: { opacity: 0, rotateY: 90 },
    whileInView: { opacity: 1, rotateY: 0 },
    transition: { duration: 1.2, ease: "easeOut" },
    perspective: 1200,
  },
};
```

---

