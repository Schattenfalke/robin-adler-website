import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useParams } from 'react-router'
import { isLanguage } from '../../lib/i18n'
import { NotFoundPage } from '../../pages/NotFoundPage'
import { LanguageSwitcher } from './LanguageSwitcher'

/** Rahmen für alle Routen unter /:lang — hält i18next und <html lang> synchron zur URL. */
export function LanguageLayout() {
  const { lang } = useParams()
  const { i18n } = useTranslation()
  const language = isLanguage(lang) ? lang : undefined

  useLayoutEffect(() => {
    if (!language) return
    document.documentElement.lang = language
    if (i18n.resolvedLanguage !== language) {
      void i18n.changeLanguage(language)
    }
  }, [language, i18n])

  // Unbekanntes Präfix (z.B. /fr oder /foo) → 404 in der aktuellen Sprache.
  if (!language) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16">
        <NotFoundPage />
      </main>
    )
  }

  return (
    <>
      <header className="mx-auto flex max-w-5xl justify-end px-4 py-6">
        <LanguageSwitcher current={language} />
      </header>
      <main className="mx-auto max-w-5xl px-4 py-16">
        <Outlet />
      </main>
    </>
  )
}
