import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'
import { LANGUAGES, type Language } from '../../lib/i18n'

/** Tauscht nur das Sprachpräfix aus, der Rest des Pfads bleibt erhalten. */
const pathForLanguage = (pathname: string, language: Language): string => {
  const [, , ...rest] = pathname.split('/')
  return ['', language, ...rest].join('/')
}

export function LanguageSwitcher({ current }: { current: Language }) {
  const { t } = useTranslation()
  const { pathname, search, hash } = useLocation()

  return (
    <nav aria-label={t('languageSwitcher.label')}>
      <ul className="flex gap-4 font-mono text-sm">
        {LANGUAGES.map((language) => (
          <li key={language}>
            <Link
              to={pathForLanguage(pathname, language) + search + hash}
              hrefLang={language}
              lang={language}
              aria-current={language === current ? 'true' : undefined}
              className="text-gray-muted hover:text-red-light aria-[current]:text-gray-text"
            >
              {t(`languageSwitcher.${language}`)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
