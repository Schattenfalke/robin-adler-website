/**
 * Einzige Quelle für alle Routen. Router, Prerenderer und (ab Phase 2) die
 * Sitemap lesen daraus — keine Route an zweiter Stelle hart schreiben.
 *
 * Bewusst ohne React-Abhängigkeit, damit auch Build-Skripte sie importieren können.
 */

export const LOCALES = ['de', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'de'

export const isLocale = (value: string | undefined): value is Locale =>
  LOCALES.some((locale) => locale === value)

/** URL-Segment je Seite und Sprache. Leerer String = Startseite der Sprache. */
export const PAGES = {
  home: { de: '', en: '' },
  build: { de: 'build', en: 'build' },
  fix: { de: 'fix', en: 'fix' },
  review: { de: 'review', en: 'review' },
  impressum: { de: 'impressum', en: 'legal-notice' },
  privacy: { de: 'datenschutz', en: 'privacy' },
  // Überschrift als Platzhalter, das Formular folgt in Phase 6.
  contact: { de: 'kontakt', en: 'contact' },
} as const satisfies Record<string, Record<Locale, string>>

export type PageKey = keyof typeof PAGES
export const PAGE_KEYS = Object.keys(PAGES) as PageKey[]

/**
 * Kanonischer Pfad, immer mit abschließendem Slash: GitHub Pages liefert
 * `de/build/index.html` aus und leitet `/de/build` sonst erst per 301 um.
 */
export const pathFor = (page: PageKey, locale: Locale): string => {
  const slug = PAGES[page][locale]
  return slug ? `/${locale}/${slug}/` : `/${locale}/`
}

/** Alle prerenderten Seiten. */
export const ALL_ROUTES = LOCALES.flatMap((locale) =>
  PAGE_KEYS.map((page) => ({ page, locale, path: pathFor(page, locale) })),
)

/** Sprache aus dem ersten Pfadsegment, Fallback auf die Standardsprache. */
export const localeFromPath = (pathname: string): Locale => {
  const segment = pathname.split('/')[1]
  return isLocale(segment) ? segment : DEFAULT_LOCALE
}
