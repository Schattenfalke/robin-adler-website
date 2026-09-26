import type { Locale } from './routes'
import { OWNER, SITE_URL } from './site'

/**
 * Schema.org für die Startseite.
 * TODO: `sameAs` (LinkedIn, GitHub …) und `image` ergänzen, sobald die echten URLs feststehen.
 * TODO: Angebote mit Preisen erst aufnehmen, wenn sie auch sichtbar auf der Seite stehen —
 *       Google verlangt, dass strukturierte Daten dem sichtbaren Inhalt entsprechen.
 */
export const homeSchema = (locale: Locale) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Robin Adler Systems',
      inLanguage: locale,
      publisher: { '@id': `${SITE_URL}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: OWNER.name,
      url: SITE_URL,
      description: 'System Architect, Web Developer, Consultant',
      jobTitle: 'System Architect & Consultant',
      knowsLanguage: ['de', 'en'],
    },
  ],
})

/** JSON-LD sicher serialisieren: `<` escapen, damit kein `</script>` den Block beendet. */
export const serializeJsonLd = (data: object): string =>
  JSON.stringify(data).replace(/</g, '\\u003c')
