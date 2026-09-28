import { useTranslation } from 'react-i18next'
import { DEFAULT_LOCALE, LOCALES, pathFor, type Locale, type PageKey } from '../../lib/routes'
import { homeSchema, serializeJsonLd } from '../../lib/schema'
import { absoluteUrl, IS_PRODUCTION } from '../../lib/site'

const OG_LOCALE: Record<Locale, string> = { de: 'de_DE', en: 'en_US' }

interface Props {
  /** undefined = 404-Seite: kein Canonical, keine Alternates, noindex. */
  page: PageKey | undefined
  locale: Locale
}

/**
 * Head-Tags einer Seite. React 19 hebt <title>, <meta> und <link> selbst in den <head>;
 * der Prerenderer schreibt sie in die statische HTML-Datei.
 * TODO: og:image / twitter:image ergänzen, sobald ein Vorschaubild in public/ liegt.
 */
export function PageMeta({ page, locale }: Props) {
  const { t } = useTranslation()
  const key = page ?? 'notFound'
  const title = t(`meta.${key}.title`)
  const description = t(`meta.${key}.description`)
  const url = page ? absoluteUrl(pathFor(page, locale)) : undefined
  const verification = import.meta.env.VITE_GSC_VERIFICATION

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* 404 nie indexieren; Vorschau-Builds gar nicht (auch keinen Links folgen). */}
      {!IS_PRODUCTION ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : page ? null : (
        <meta name="robots" content="noindex" />
      )}
      {url ? <link rel="canonical" href={url} /> : null}
      {page
        ? LOCALES.map((alt) => (
            <link key={alt} rel="alternate" hrefLang={alt} href={absoluteUrl(pathFor(page, alt))} />
          ))
        : null}
      {page ? (
        <link rel="alternate" hrefLang="x-default" href={absoluteUrl(pathFor(page, DEFAULT_LOCALE))} />
      ) : null}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Robin Adler Systems" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content={OG_LOCALE[locale]} />
      {url ? <meta property="og:url" content={url} /> : null}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {verification ? <meta name="google-site-verification" content={verification} /> : null}

      {page === 'home' ? (
        <script
          type="application/ld+json"
          // JSON-LD muss als roher Text in das Script; serializeJsonLd escaped `<`.
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(homeSchema(locale)) }}
        />
      ) : null}
    </>
  )
}
