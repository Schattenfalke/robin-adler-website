# 04 — SEO, Recht & Analytics

> **Zweck**: Meta-Tags, Schema.org, Impressum, Datenschutz, Consent-Gating, GA4.
> Diese Datei wird NICHT automatisch geladen. Verweise in der Aufgabenstellung
> ausdrücklich darauf, z.B.: "Lies CLAUDE.md und docs/..., dann ...".

---

> **ACHTUNG**: Dieser Bereich ist rechtlich relevant. Nichts hier vereinfachen,
> weglassen oder "sinngemäß" umsetzen. Im Zweifel nachfragen statt raten.

---

## 6. SEO & METADATA

### 6.1 Global Meta Tags
```tsx
// src/components/Layout.tsx
import Head from 'next/head';

export const Layout = ({ children, meta }: Props) => {
  const defaults = {
    title: 'Robin Adler Systems – Architektur, Code, Klarheit',
    description: 'Systeme bauen, die Menschen tragen. Not systems that carry people. Build, Fix, Review.',
    image: 'https://robin-adler.de/og-image.jpg',
    url: 'https://robin-adler.de',
  };

  const meta_tags = { ...defaults, ...meta };

  return (
    <>
      <Head>
        <title>{meta_tags.title}</title>
        <meta name="description" content={meta_tags.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* OpenGraph for social sharing */}
        <meta property="og:title" content={meta_tags.title} />
        <meta property="og:description" content={meta_tags.description} />
        <meta property="og:image" content={meta_tags.image} />
        <meta property="og:url" content={meta_tags.url} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta_tags.title} />
        <meta name="twitter:description" content={meta_tags.description} />
        <meta name="twitter:image" content={meta_tags.image} />

        {/* Canonical */}
        <link rel="canonical" href={meta_tags.url} />

        {/* Fonts (self-hosted) */}
        <link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/JetBrainsMono-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

        {/* KEIN Google-Analytics-Script hier!
            GA4 darf in Deutschland (§25 TDDDG) erst NACH aktiver Einwilligung
            geladen werden. Das Laden passiert dynamisch in CookieBanner.tsx /
            lib/analytics.ts -> loadAnalytics(). Siehe Abschnitt 8. */}

        {/* Google Search Console Verification (setzt KEINE Cookies, ist unproblematisch) */}
        <meta name="google-site-verification" content={import.meta.env.VITE_GSC_VERIFICATION} />
      </Head>

      <body>{children}</body>
    </>
  );
};
```

### 6.2 Schema.org Structured Data
```tsx
// src/lib/schema.ts
export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Robin Adler',
  url: 'https://robin-adler.de',
  image: 'https://robin-adler.de/robin-adler.jpg',
  description: 'System Architect, Web Developer, Consultant',
  sameAs: [
    'https://linkedin.com/in/robin-adler',
    'https://github.com/robin-adler',
  ],
  jobTitle: 'System Architect & Consultant',
  knowsLanguage: ['de', 'en'],
  areaServed: 'DE',
};

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Impact Operating System',
  description: 'Systems that scale without you',
  areaServed: 'DE',
  availableLanguage: ['de', 'en'],
  offers: [
    {
      '@type': 'Offer',
      name: 'Klarheits-Impuls',
      price: '450',
      priceCurrency: 'EUR',
    },
    {
      '@type': 'Offer',
      name: 'Done-With-You',
      price: '2500',
      priceCurrency: 'EUR',
    },
    {
      '@type': 'Offer',
      name: 'Done-For-You',
      price: '7500',
      priceCurrency: 'EUR',
    },
  ],
};

export const addSchemaScript = (schema: object) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

---

## 7. LEGAL & DATENSCHUTZ

### 7.1 Impressum (DDG §5 & §7 Compliant)

```tsx
// src/pages/[lang]/impressum.tsx
import { useRouter } from 'next/router';

export default function Impressum() {
  const { locale } = useRouter();
  const isDe = locale === 'de';

  return (
    <Layout meta={{ title: isDe ? 'Impressum' : 'Legal Notice' }}>
      <div className="container py-20">
        <h1>{isDe ? 'Impressum' : 'Legal Notice'}</h1>

        <section>
          <h2>{isDe ? 'Anbieter (§5 DDG)' : 'Provider'}</h2>
          <p>
            Robin Adler<br />
            Straße 123<br />
            16909 Lindow (Mark)<br />
            {isDe ? 'Deutschland' : 'Germany'}
          </p>
          <p>
            <strong>E-Mail:</strong> kontakt@robin-adler.de<br />
            <strong>Telefon:</strong> +49 123 456789
          </p>
          {/* KEINE USt-ID angeben — Robin hat keine (Kleinunternehmerregelung §19 UStG).
              Eine nicht existierende oder falsche USt-ID im Impressum ist abmahnfähig.
              Der §19-Hinweis gehört auf Rechnungen, NICHT ins Impressum. */}
        </section>

        <section>
          <h2>{isDe ? 'Berufliche Qualifikation' : 'Professional Qualification'}</h2>
          <p>
            {isDe
              ? 'System Architect, Consultant, Web Developer — selbstständig tätig.'
              : 'System Architect, Consultant, Web Developer — self-employed.'}
          </p>
        </section>

        <section>
          <h2>{isDe ? 'Verantwortliche Stelle (§7 DDG)' : 'Responsible Party'}</h2>
          <p>
            {isDe
              ? 'Für die Inhalte dieser Webseite verantwortlich gem. § 7 Abs. 1 DDG: Robin Adler (siehe Anbieter oben).'
              : 'According to § 7 (1) DDG, responsible for the contents of this website: Robin Adler (see provider above).'}
          </p>
        </section>

        <section>
          <h2>{isDe ? 'Haftungsausschluss' : 'Disclaimer'}</h2>
          <p>
            {isDe
              ? 'Die Inhalte dieser Webseite werden mit größter Sorgfalt erstellt. Für Vollständigkeit, Aktualität und Richtigkeit kann jedoch keine Gewähr übernommen werden.'
              : 'The contents of this website are created with great care. However, no guarantee can be given for completeness, timeliness, or correctness.'}
          </p>
        </section>

        <section>
          <h2>{isDe ? 'Links' : 'Links'}</h2>
          <p>
            {isDe
              ? 'Diese Website enthält Links zu externen Websites. Für den Inhalt dieser verlinkten Seiten bin ich nicht verantwortlich.'
              : 'This website contains links to external websites. I am not responsible for the content of these linked pages.'}
          </p>
        </section>

        <section>
          <h2>{isDe ? 'Urheberrecht' : 'Copyright'}</h2>
          <p>
            {isDe
              ? 'Alle Inhalte dieser Website (Text, Bilder, Code) sind urheberrechtlich geschützt. Jede Vervielfältigung, Bearbeitung oder Verbreitung ohne ausdrückliche Zustimmung ist untersagt.'
              : 'All content on this website (text, images, code) is protected by copyright. Any reproduction, modification, or distribution without express permission is prohibited.'}
          </p>
        </section>
      </div>
    </Layout>
  );
}
```

### 7.2 Privacy Policy (DSGVO)

```tsx
// src/pages/[lang]/privacy.tsx (Excerpt)
export default function Privacy() {
  const { locale } = useRouter();
  const isDe = locale === 'de';

  return (
    <Layout meta={{ title: isDe ? 'Datenschutz' : 'Privacy Policy' }}>
      <div className="container py-20">
        <h1>{isDe ? 'Datenschutzerklärung' : 'Privacy Policy'}</h1>

        <section>
          <h2>{isDe ? 'Verantwortlicher' : 'Data Controller'}</h2>
          <p>Robin Adler, robin@robin-adler.de</p>
        </section>

        <section>
          <h2>{isDe ? '1. Erhobene Daten' : '1. Data Collected'}</h2>
          <p>
            {isDe
              ? 'Bei der Nutzung unserer Website werden folgende Daten erhoben:'
              : 'When using our website, the following data is collected:'}
          </p>
          <ul>
            <li>{isDe ? 'Kontaktformular: Name, E-Mail, Telefon, Nachricht' : 'Contact form: Name, email, phone, message'}</li>
            <li>{isDe ? 'Google Analytics: Besucherdaten, Klicks, Scroll-Verhalten' : 'Google Analytics: Visitor data, clicks, scroll behavior'}</li>
            <li>{isDe ? 'Server-Logs: IP-Adresse, Browser, Zeitstempel' : 'Server logs: IP address, browser, timestamp'}</li>
          </ul>
        </section>

        <section>
          <h2>{isDe ? '2. Rechtliche Grundlage' : '2. Legal Basis'}</h2>
          <p>
            {isDe
              ? 'Die Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 DSGVO. Kontaktformular: Legitimes Interesse (Art. 6 Abs. 1 f DSGVO) oder explizite Einwilligung (Art. 6 Abs. 1 a DSGVO).'
              : 'Processing is based on Article 6 (1) GDPR. Contact form: Legitimate interest (Article 6 (1) f GDPR) or explicit consent (Article 6 (1) a GDPR).'}
          </p>
        </section>

        <section>
          <h2>{isDe ? '3. Google Analytics' : '3. Google Analytics'}</h2>
          <p>
            {isDe
              ? 'Diese Website nutzt Google Analytics (Universal Analytics). Daten werden anonymisiert verarbeitet (IP-Masking aktiviert). Google Analytics unterliegt den Datenschutzbestimmungen von Google. Weitere Informationen: https://support.google.com/analytics/answer/6004245'
              : 'This website uses Google Analytics. Data is processed anonymously (IP masking enabled). Google Analytics is subject to Google\'s privacy policy. More info: https://support.google.com/analytics/answer/6004245'}
          </p>
          <p>
            {isDe
              ? 'Du kannst der Datenerhebung jederzeit widersprechen, indem du das Browser-Add-on installierst: https://tools.google.com/dlpage/gaoptout'
              : 'You can opt-out of data collection at any time by installing the browser add-on: https://tools.google.com/dlpage/gaoptout'}
          </p>
        </section>

        <section>
          <h2>{isDe ? '4. Kontaktformular' : '4. Contact Form'}</h2>
          <p>
            {isDe
              ? 'Deine Kontaktdaten werden nur zur Bearbeitung deiner Anfrage genutzt. Nach Abschluss der Kommunikation werden deine Daten gelöscht, es sei denn, es bestehen rechtliche Aufbewahrungspflichten.'
              : 'Your contact data is only used to process your inquiry. After completion of the communication, your data will be deleted unless legal retention obligations apply.'}
          </p>
          <p>
            {isDe ? 'Speicherdauer: max. 30 Tage nach letzter Nachricht.' : 'Retention period: max. 30 days after last message.'}
          </p>
        </section>

        <section>
          <h2>{isDe ? '5. Deine Rechte' : '5. Your Rights'}</h2>
          <p>
            {isDe
              ? 'Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner Daten (Art. 15–18 DSGVO).'
              : 'You have the right to access, correct, delete, and restrict processing of your data (Articles 15-18 GDPR).'}
          </p>
          <p>
            {isDe ? 'Kontakt: robin@robin-adler.de' : 'Contact: robin@robin-adler.de'}
          </p>
        </section>

        <section>
          <h2>{isDe ? '6. Hosting, CDN und Formular-Endpoint' : '6. Hosting, CDN and Form Endpoint'}</h2>
          <p>
            {isDe
              ? 'Die statischen Inhalte dieser Website werden auf GitHub Pages (GitHub Inc., USA) gehostet. Beim Aufruf werden technisch notwendige Server-Logs inkl. IP-Adresse verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (Bereitstellung der Website). GitHub Privacy Statement: https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement'
              : 'The static content of this website is hosted on GitHub Pages (GitHub Inc., USA). Technically necessary server logs including IP address are processed on access. Legal basis: Art. 6 (1) (f) GDPR.'}
          </p>
          <p>
            {isDe
              ? 'Die DNS-Auflösung erfolgt über Cloudflare (Cloudflare Inc., USA). Cloudflare Privacy Policy: https://www.cloudflare.com/privacypolicy/'
              : 'DNS resolution is handled by Cloudflare (Cloudflare Inc., USA).'}
          </p>
          <p>
            {isDe
              ? 'Der Endpoint des Kontaktformulars (mail.robin-adler.de) läuft auf einem Server der domain-offensive GmbH in Deutschland. Dort werden die Formulardaten für den Mailversand verarbeitet sowie zur Spam-Abwehr ein gehashter, nach einer Stunde gelöschter Wert deiner IP-Adresse gespeichert. Die IP-Adresse selbst wird nicht im Klartext gespeichert.'
              : 'The contact form endpoint (mail.robin-adler.de) runs on a server operated by domain-offensive GmbH in Germany. Form data is processed there for mail delivery, and a hashed IP value is stored for spam prevention and deleted after one hour. The IP address itself is not stored in plain text.'}
          </p>
        </section>

        <section>
          <h2>{isDe ? '7. Cookies' : '7. Cookies'}</h2>
          <p>
            {isDe
              ? 'Ohne deine Einwilligung werden keine Cookies gesetzt und keine Daten an Google übermittelt. Erst wenn du im Cookie-Banner auf "Einverstanden" klickst, wird Google Analytics geladen und setzt Cookies (_ga, _gid, Laufzeit bis 2 Jahre). Rechtsgrundlage: § 25 Abs. 1 TDDDG i.V.m. Art. 6 Abs. 1 lit. a DSGVO. Deine Entscheidung wird ausschließlich lokal in deinem Browser gespeichert (localStorage) und kann jederzeit über "Cookie-Einstellungen ändern" im Footer widerrufen werden; die gesetzten Cookies werden dabei gelöscht.'
              : 'No cookies are set and no data is transmitted to Google without your consent. Google Analytics is only loaded after you click "Accept" in the cookie banner. Legal basis: § 25 (1) TDDDG in conjunction with Art. 6 (1) (a) GDPR. Your choice is stored locally in your browser only and can be revoked at any time via "Cookie settings" in the footer.'}
          </p>
        </section>
      </div>
    </Layout>
  );
}
```

### 7.3 Consent-Management & Cookie-Banner

> **Rechtlicher Kern (§25 TDDDG + DSGVO)**: Google Analytics darf in Deutschland
> **erst nach aktiver Einwilligung** geladen werden. Ein Banner, der GA schon
> geladen hat und danach fragt, ist wertlos und abmahnfähig. Deshalb wird das
> GA-Script hier **dynamisch injiziert**, nicht statisch eingebunden.
>
> Weitere Pflichten: "Ablehnen" muss gleichwertig sichtbar sein (kein grauer
> Mini-Link neben einem grünen Riesenbutton), und die Entscheidung muss
> widerrufbar bleiben (Footer-Link).

```tsx
// src/lib/consent.ts
export type ConsentState = 'granted' | 'denied' | null;

const KEY = 'ra-consent-analytics';
const VERSION = 'v1'; // hochzählen, wenn sich der Zweck der Verarbeitung ändert

export const getConsent = (): ConsentState => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const { value, version } = JSON.parse(raw);
    if (version !== VERSION) return null; // erneut fragen
    return value === 'granted' ? 'granted' : 'denied';
  } catch {
    return null;
  }
};

export const setConsent = (value: Exclude<ConsentState, null>) => {
  localStorage.setItem(
    KEY,
    JSON.stringify({ value, version: VERSION, at: new Date().toISOString() })
  );
  window.dispatchEvent(new CustomEvent('ra-consent-change', { detail: value }));
};

export const revokeConsent = () => {
  localStorage.removeItem(KEY);
  // GA-Cookies aktiv löschen
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (name.startsWith('_ga') || name.startsWith('_gid')) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.robin-adler.de`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
  window.location.reload();
};
```

```tsx
// src/components/Legal/CookieBanner.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getConsent, setConsent } from '@/lib/consent';
import { loadAnalytics } from '@/lib/analytics';
import { useTranslation } from 'react-i18next';

export const CookieBanner = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (consent === null) {
      setShow(true);           // noch nie gefragt
    } else if (consent === 'granted') {
      loadAnalytics();         // frühere Einwilligung -> jetzt erst laden
    }
    // 'denied' -> nichts tun, kein Script, keine Cookies
  }, []);

  const accept = () => {
    setConsent('granted');
    loadAnalytics();
    setShow(false);
  };

  const reject = () => {
    setConsent('denied');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label={t('cookies.ariaLabel')}
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-0 inset-x-0 z-50 bg-black-secondary border-t border-red-primary"
        >
          <div className="container py-5 flex flex-col lg:flex-row lg:items-center gap-5">
            <p className="text-gray-text text-sm leading-relaxed flex-1">
              {t('cookies.text')}{' '}
              <a href="/datenschutz" className="text-red-primary underline underline-offset-2">
                {t('cookies.privacyLink')}
              </a>
            </p>

            {/* Beide Buttons optisch gleichwertig — keine Dark Patterns */}
            <div className="flex gap-3 shrink-0">
              <button
                onClick={reject}
                className="px-6 py-3 border border-gray-muted text-gray-text
                           hover:border-gray-text transition font-medium"
              >
                {t('cookies.reject')}
              </button>
              <button
                onClick={accept}
                className="px-6 py-3 border border-red-primary text-red-primary
                           hover:bg-red-primary hover:text-black-primary transition font-medium"
              >
                {t('cookies.accept')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

**Widerruf im Footer** (Pflicht — die Einwilligung muss so einfach widerrufbar
sein wie sie erteilt wurde):
```tsx
// src/components/Footer.tsx (Ausschnitt)
import { revokeConsent } from '@/lib/consent';

<button onClick={revokeConsent} className="text-gray-muted hover:text-red-primary text-sm">
  {t('footer.cookieSettings')}
</button>
```

**i18n-Texte** (`src/locales/de.json`):
```json
{
  "cookies": {
    "ariaLabel": "Hinweis zur Datenverarbeitung",
    "text": "Ich nutze Google Analytics, um zu verstehen, welche Inhalte hier hilfreich sind. Dabei werden Cookies gesetzt und Daten an Google übermittelt. Ohne deine Zustimmung passiert nichts davon.",
    "privacyLink": "Datenschutzerklärung",
    "accept": "Einverstanden",
    "reject": "Nur technisch Notwendiges"
  },
  "footer": {
    "cookieSettings": "Cookie-Einstellungen ändern"
  }
}
```

## 8. GOOGLE ANALYTICS & SEARCH CONSOLE SETUP

### 8.1 GA4 — Consent-gated Loading

Das Script wird **ausschließlich** durch `loadAnalytics()` geladen, und das wird
nur aus `CookieBanner.tsx` nach erteilter Einwilligung aufgerufen. Es gibt keinen
zweiten Pfad, über den GA jemals ohne Consent startet.

```ts
// src/lib/analytics.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getConsent } from './consent';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

let loaded = false;

/** Lädt GA4 dynamisch. Wird NUR nach aktiver Einwilligung aufgerufen. */
export const loadAnalytics = () => {
  if (loaded) return;
  if (getConsent() !== 'granted') return;   // doppelte Absicherung
  const id = import.meta.env.VITE_GA_ID;
  if (!id) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', id, {
    anonymize_ip: true,          // IP-Kürzung
    allow_google_signals: false, // keine Werbe-/Remarketing-Funktionen
    allow_ad_personalization_signals: false,
    cookie_flags: 'SameSite=Strict;Secure',
  });

  loaded = true;
};

/** Page-Views bei Client-seitiger Navigation. No-op ohne Consent. */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (!window.gtag) return;
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_path: location.pathname,
    });
  }, [location.pathname]);
};

/** Custom Events. No-op ohne Consent — nie ein Fehler, nie ein Tracking-Leck. */
export const logEvent = (name: string, params?: Record<string, unknown>) => {
  if (!window.gtag) return;
  window.gtag('event', name, params);
};

// Verwendung:
// logEvent('door_click', { door: 'build' });
// logEvent('contact_form_submit', { service: 'fix' });
```

**GA4-Kontoeinstellungen, die du im Google-Interface setzen musst** (der Code allein
reicht nicht):
1. **AVV abschließen**: Verwaltung → Kontoeinstellungen → Zusatz zur Datenverarbeitung akzeptieren
2. **Datenaufbewahrung**: Verwaltung → Dateneinstellungen → Datenaufbewahrung → **2 Monate**
3. **Google Signals**: Verwaltung → Dateneinstellungen → Datenerhebung → **deaktiviert lassen**
4. **Nutzer-ID / Demografie**: deaktiviert lassen (sonst wird die Einwilligung umfangreicher)

**Was du für eine Portfolio-Seite tracken solltest** (mehr nicht — Datensparsamkeit
ist auch eine Positionierungsfrage):
- `door_click` — welche der 3 Türen wird gewählt? (Das ist deine wichtigste Metrik.)
- `case_open` — welcher Case wird angeklickt?
- `contact_form_submit` — Conversion, mit `service`-Parameter
- `scroll_depth` (GA4 Standard) — kommen Leute bis zu den Cases?

### 8.2 Search Console Integration

**Add `<meta name="google-site-verification">` to head:**
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

**Generate sitemap:**
```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://robin-adler.de/de</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://robin-adler.de/de/build</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... more URLs ... -->
</urlset>
```

**Generate robots.txt:**
```text
<!-- public/robots.txt -->
User-agent: *
Allow: /
Disallow: /admin
Sitemap: https://robin-adler.de/sitemap.xml
```

---

