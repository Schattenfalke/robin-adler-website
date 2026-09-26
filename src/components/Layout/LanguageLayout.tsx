import { useLayoutEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'
import { useCurrentPage } from '../../hooks/useCurrentPage'
import type { Locale } from '../../lib/routes'
import { CookieBanner } from '../Legal/CookieBanner'
import { PageMeta } from '../Seo/PageMeta'
import { Footer } from './Footer'
import { LanguageSwitcher } from './LanguageSwitcher'

interface Props {
  locale: Locale
  /** Nur für die 404 außerhalb der Sprachrouten; sonst rendert die Route per Outlet. */
  children?: ReactNode
}

/** Rahmen für alle Seiten einer Sprache — hält i18next und <html lang> synchron zur URL. */
export function LanguageLayout({ locale, children }: Props) {
  const { i18n } = useTranslation()
  const page = useCurrentPage()

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
      <PageMeta page={page} locale={locale} />
      <div className="flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-5xl justify-end px-4 py-6">
          <LanguageSwitcher current={locale} />
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16">{children ?? <Outlet />}</main>
        <Footer locale={locale} />
        {/* Im Fluss nach dem Footer, damit Impressum und Datenschutz nie verdeckt sind. */}
        <CookieBanner locale={locale} />
      </div>
    </>
  )
}
