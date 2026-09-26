import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'
import type { Locale } from '../../lib/routes'
import { LanguageSwitcher } from './LanguageSwitcher'

/** Rahmen für alle Routen einer Sprache — hält i18next und <html lang> synchron zur URL. */
export function LanguageLayout({ locale }: { locale: Locale }) {
  const { i18n } = useTranslation()

  // Beim Prerender und beim ersten Client-Render ist die Sprache bereits gesetzt;
  // das hier greift beim Wechsel über den Sprachumschalter.
  useLayoutEffect(() => {
    document.documentElement.lang = locale
    if (i18n.resolvedLanguage !== locale) {
      void i18n.changeLanguage(locale)
    }
  }, [locale, i18n])

  return (
    <>
      <header className="mx-auto flex max-w-5xl justify-end px-4 py-6">
        <LanguageSwitcher current={locale} />
      </header>
      <main className="mx-auto max-w-5xl px-4 py-16">
        <Outlet />
      </main>
    </>
  )
}
