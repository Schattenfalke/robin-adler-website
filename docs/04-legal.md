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

> **Kein `react-helmet-async`.** React 19 hebt `<title>`, `<meta>` und `<link>` von
> selbst in den `<head>` — egal, wo im Baum sie gerendert werden. Unter React 19 ist
> `react-helmet-async` nur noch ein Durchreicher (steht so in dessen README) und damit
> eine überflüssige Abhängigkeit. Der Prerenderer (`src/server/prerender.ts`) schreibt
> die Tags beim Build in die statische HTML-Datei jeder Route.

Umsetzung im Repo: `src/components/Seo/PageMeta.tsx`, einmal im Layout gerendert.
Titel und Beschreibung kommen aus i18next (`meta.<seite>.title/description`),
URLs aus `src/lib/routes.ts` und `src/lib/site.ts`.

```tsx
// src/components/Seo/PageMeta.tsx (gekürzt)
export function PageMeta({ page, locale }: Props) {
  const { t } = useTranslation();
  const title = t(`meta.${page}.title`);
  const description = t(`meta.${page}.description`);
  const url = absoluteUrl(pathFor(page, locale));   // immer mit abschließendem Slash

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {LOCALES.map((alt) => (
        <link key={alt} rel="alternate" hrefLang={alt} href={absoluteUrl(pathFor(page, alt))} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={absoluteUrl(pathFor(page, DEFAULT_LOCALE))} />

      {/* OpenGraph / Twitter */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary" />
      {/* TODO: og:image / twitter:image, sobald ein Vorschaubild in public/ liegt */}

      {/* KEIN Google-Analytics-Script hier!
          GA4 darf in Deutschland (§25 TDDDG) erst NACH aktiver Einwilligung
          geladen werden. Das Laden passiert dynamisch in lib/analytics.ts ->
          loadAnalytics(), ausgelöst vom CookieBanner. Siehe Abschnitt 8. */}

      {/* Search Console Verification (setzt KEINE Cookies, ist unproblematisch) */}
      {verification ? <meta name="google-site-verification" content={verification} /> : null}
    </>
  );
}
```

Font-Preloads (`<link rel="preload" as="font">`) kommen dazu, sobald die Schriften in
`public/fonts/` liegen (Phase 7).

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
  // TODO: echte Profil-URLs eintragen. Nicht raten — erfundene sameAs-Links sind falsch.
  // sameAs: ['https://www.linkedin.com/in/…', 'https://github.com/…'],
  jobTitle: 'System Architect & Consultant',
  knowsLanguage: ['de', 'en'],
  areaServed: 'DE',
};

// Angebote mit Preisen erst ausliefern, wenn die Preise auch sichtbar auf der Seite
// stehen — Google verlangt, dass strukturierte Daten dem sichtbaren Inhalt entsprechen.
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

### 7.1 Impressum (§ 5 DDG)

> Anschrift, E-Mail und Telefon kommen im Repo aus `src/lib/site.ts` (`OWNER`),
> nicht hart aus dem JSX. Die Werte unten sind Platzhalter der Vorlage.

```tsx
// src/pages/[lang]/impressum.tsx
import { useTranslation } from 'react-i18next';
// Kein Next.js — die aktive Sprache kommt aus i18next, nicht aus einem Next-Router.

export default function Impressum() {
  const { i18n } = useTranslation();
  const locale = i18n.language;
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

        {/* AUSKOMMENTIERT — bewusst nicht ausliefern.
            § 7 DDG ist die Haftungsregel für eigene Inhalte, keine Impressumspflicht.
            Gemeint wäre § 18 Abs. 2 MStV ("Verantwortlich für den Inhalt"). Der setzt aber
            journalistisch-redaktionelle Inhalte voraus, die diese Seite nicht hat.
            Reaktivieren, sobald es einen Blog o.ä. gibt — dann mit § 18 Abs. 2 MStV
            als Norm und vollständiger Anschrift der verantwortlichen Person.

        <section>
          <h2>{isDe ? 'Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)' : 'Responsible for content (§ 18 (2) MStV)'}</h2>
          <p>Robin Adler, Anschrift wie oben</p>
        </section>
        */}

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
// Vollständige, geltende Fassung: src/pages/PrivacyPage.tsx + src/locales/{de,en}.json.
// DE und EN sind dort gleich vollständig — keine gekürzte englische Fassung.
export default function Privacy() {
  const { i18n } = useTranslation();
  const locale = i18n.language;
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
              ? 'Die Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 DSGVO. Kontaktformular: Anfragen dienen der Durchführung vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO). Soweit eine Anfrage nicht auf einen Vertrag gerichtet ist, stützt sich die Verarbeitung auf mein berechtigtes Interesse an der Beantwortung (Art. 6 Abs. 1 lit. f DSGVO).'
              : 'Processing is based on Article 6 (1) GDPR. Contact form: inquiries serve to take steps prior to entering into a contract (Art. 6 (1) (b) GDPR). Where an inquiry is not aimed at a contract, processing is based on my legitimate interest in responding (Art. 6 (1) (f) GDPR).'}
          </p>
        </section>

        <section>
          <h2>{isDe ? '3. Google Analytics' : '3. Google Analytics'}</h2>
          <p>
            {isDe
              ? 'Diese Website nutzt Google Analytics 4, einen Webanalysedienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland — jedoch nur, wenn du im Cookie-Banner eingewilligt hast. IP-Adressen werden nach Angaben des Anbieters zur groben Standortbestimmung verwendet und dabei nicht protokolliert. Google Analytics unterliegt den Datenschutzbestimmungen von Google. Weitere Informationen: https://support.google.com/analytics/answer/6004245'
              : 'This website uses Google Analytics 4, a web analytics service provided by Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland — but only if you have given consent in the cookie banner. According to the provider, IP addresses are used to determine approximate location and are not logged in the process. Google Analytics is subject to Google\'s privacy policy. More info: https://support.google.com/analytics/answer/6004245'}
          </p>
          {/* NICHT "Universal Analytics" (seit 2023 abgeschaltet) und NICHT "IP-Masking" —
              das ist ein UA-Begriff. Aussagen über Googles interne Verarbeitung nur als
              Anbieterangabe formulieren ("nach Angaben des Anbieters"), sonst steht der
              Seitenbetreiber für eine Tatsache gerade, die er nicht prüfen kann. */}
          <p>
            {isDe
              ? 'Dabei können Daten an die Google LLC in den USA übermittelt werden. Die Google LLC ist unter dem EU-US Data Privacy Framework zertifiziert; die Übermittlung stützt sich auf den Angemessenheitsbeschluss der EU-Kommission (Art. 45 DSGVO).'
              : 'Data may be transferred to Google LLC in the USA. Google LLC is certified under the EU-US Data Privacy Framework; the transfer is based on the European Commission\'s adequacy decision (Art. 45 GDPR).'}
          </p>
          <p>
            {isDe
              ? 'Rechtsgrundlage ist deine Einwilligung (§ 25 Abs. 1 TDDDG i.V.m. Art. 6 Abs. 1 lit. a DSGVO). Die Analysedaten werden nach 2 Monaten gelöscht.'
              : 'The legal basis is your consent (§ 25 (1) TDDDG in conjunction with Art. 6 (1) (a) GDPR). Analytics data is deleted after 2 months.'}
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
          {/* Pflichtangaben nach Art. 13 DSGVO — nicht weglassen: */}
          <p>
            {isDe
              ? 'Außerdem hast du das Recht auf Datenübertragbarkeit (Art. 20 DSGVO) und das Recht, einer Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO zu widersprechen (Art. 21 DSGVO). Eine erteilte Einwilligung kannst du jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO).'
              : 'You also have the right to data portability (Art. 20 GDPR) and the right to object to processing based on Art. 6 (1) (f) GDPR (Art. 21 GDPR). You can withdraw any consent you have given at any time with effect for the future (Art. 7 (3) GDPR).'}
          </p>
          <p>
            {isDe
              ? 'Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung deiner Daten zu beschweren (Art. 77 DSGVO).'
              : 'You have the right to lodge a complaint about the processing of your data with a data protection supervisory authority (Art. 77 GDPR).'}
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
              ? 'Ohne deine Einwilligung werden keine Cookies gesetzt und keine Daten an Google übermittelt. Erst wenn du im Cookie-Banner auf "Einverstanden" klickst, wird Google Analytics geladen und setzt Cookies (_ga und _ga_<ID>, Laufzeit bis 2 Jahre). Rechtsgrundlage: § 25 Abs. 1 TDDDG i.V.m. Art. 6 Abs. 1 lit. a DSGVO. Deine Entscheidung wird ausschließlich lokal in deinem Browser gespeichert (localStorage) und kann jederzeit über "Cookie-Einstellungen ändern" im Footer widerrufen werden; die gesetzten Cookies werden dabei gelöscht.'
              : 'No cookies are set and no data is transmitted to Google without your consent. Google Analytics is only loaded after you click "Accept" in the cookie banner, and then sets cookies (_ga and _ga_<ID>, lifetime up to 2 years). Legal basis: § 25 (1) TDDDG in conjunction with Art. 6 (1) (a) GDPR. Your choice is stored locally in your browser only (localStorage) and can be revoked at any time via "Change cookie settings" in the footer; the cookies that were set are deleted in the process.'}
          {/* GA4 setzt _ga und _ga_<ID>. _gid war Universal Analytics und entfällt. */}
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
    if (name.startsWith('_ga')) {   // erfasst _ga und _ga_<ID> (GA4)
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
import { motion, AnimatePresence } from 'motion/react';
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

> **Abweichungen im Repo** (`src/components/Legal/CookieBanner.tsx`), bitte nicht
> "zurückkorrigieren":
> - `sticky bottom-0` im Dokumentfluss nach dem Footer statt `fixed` — ein fixer Banner
>   verdeckt den Footer und damit Impressum und Datenschutz.
> - Zustand über `useSyncExternalStore` statt `useState` + `useEffect`: So steht der
>   Banner nie im prerenderten HTML und blitzt bei bereits Entschiedenen nicht auf.
> - Beide Buttons identisch gestaltet (nicht einer rot, einer grau) — gleichwertig heißt gleich.
> - Keine Einblend-Animation (kein `motion`-Paket nur für den Banner).

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

// Minimal getypte gtag-Signatur — kein `any`, siehe Projektregeln in CLAUDE.md.
type GtagArgs =
  | ['js', Date]
  | ['config', string, Record<string, unknown>?]
  | ['event', string, Record<string, unknown>?];

declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void;
    dataLayer?: unknown[];
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
  const dataLayer = window.dataLayer;
  // ACHTUNG: gtag.js erwartet im dataLayer das `arguments`-Objekt, KEIN Array.
  // Ein Array (z.B. aus Rest-Parametern `(...args) => dataLayer.push(args)`) wird von
  // gtag.js kommentarlos verworfen — GA misst dann schlicht nichts, ohne Fehlermeldung.
  // Deshalb eine klassische `function` statt Pfeilfunktion. Ausnahme von der Stilregel
  // "prefer-rest-params" nach CLAUDE.md, Abschnitt "Korrektheit schlägt Stilregel".
  window.gtag = function gtag(..._args: GtagArgs) {
    // oxlint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  // KEIN `anonymize_ip: true`: Relikt aus Universal Analytics. Unter GA4 wirkungslos,
  // weil GA4 IP-Adressen nach Angaben von Google ohnehin nicht protokolliert. Der
  // Parameter würde eine Schutzmaßnahme vortäuschen, die nichts bewirkt.
  window.gtag('config', id, {
    allow_google_signals: false, // keine Werbe-/Remarketing-Funktionen
    allow_ad_personalization_signals: false,
    cookie_flags: 'SameSite=Strict;Secure',
  });

  loaded = true;
};

/**
 * WARNUNG — im Repo bewusst NICHT eingebaut. Doppelzählung!
 * GA4 erfasst Seitenwechsel einer Single-Page-App bereits selbst über die
 * "Erweiterte Messung" (Seitenaufrufe bei Browserverlaufsereignissen, standardmäßig an).
 * Zusätzlich manuell `page_view` zu senden zählt jeden Aufruf doppelt.
 * Nur verwenden, wenn im GA4-Datenstream die Verlaufsereignisse abgeschaltet werden —
 * und dann auch `send_page_view: false` in der config setzen.
 */
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

> Im Repo werden `sitemap.xml` und `robots.txt` NICHT von Hand gepflegt, sondern vom
> Prerenderer aus `src/lib/routes.ts` erzeugt (mit hreflang-Alternates, URLs mit Slash).
> Kein `Disallow: /admin` — es gibt keinen Admin-Bereich. Die Beispiele unten sind nur Illustration.

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

