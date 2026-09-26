import { useTranslation } from 'react-i18next'
import { Link, useMatches } from 'react-router'
import { LOCALES, pathFor, type Locale, type PageKey } from '../../lib/routes'
import type { PageHandle } from '../../routes'

const isPageHandle = (handle: unknown): handle is PageHandle =>
  typeof handle === 'object' && handle !== null && 'page' in handle

/** Aktuelle Seite aus der Routen-Hierarchie; auf der 404-Seite keine. */
const useCurrentPage = (): PageKey | undefined => {
  const match = useMatches().find((m) => isPageHandle(m.handle))
  return match && isPageHandle(match.handle) ? match.handle.page : undefined
}

export function LanguageSwitcher({ current }: { current: Locale }) {
  const { t } = useTranslation()
  // Ohne bekannte Seite (404) führt der Umschalter zur Startseite der Sprache.
  const page = useCurrentPage() ?? 'home'

  return (
    <nav aria-label={t('languageSwitcher.label')}>
      <ul className="flex gap-4 font-mono text-sm">
        {LOCALES.map((locale) => (
          <li key={locale}>
            <Link
              to={pathFor(page, locale)}
              hrefLang={locale}
              lang={locale}
              aria-current={locale === current ? 'true' : undefined}
              className="text-gray-muted hover:text-red-light aria-[current]:text-gray-text"
            >
              {t(`languageSwitcher.${locale}`)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
