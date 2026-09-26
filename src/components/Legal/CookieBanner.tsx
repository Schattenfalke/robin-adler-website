import { useEffect, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { loadAnalytics } from '../../lib/analytics'
import { getConsent, setConsent, subscribeConsent, type ConsentState } from '../../lib/consent'
import { pathFor, type Locale } from '../../lib/routes'

/** Beim Prerender (und in der Hydration) ist die Einwilligung unbekannt → kein Banner im HTML. */
const getServerConsent = (): ConsentState | 'unknown' => 'unknown'

/**
 * Consent-Banner. Erscheint nur im Browser und nur, solange keine Entscheidung vorliegt.
 * `sticky` statt `fixed`: Er klebt am unteren Rand, gibt am Seitenende aber den Footer frei.
 * Beide Buttons sind gleich groß und gleich gestaltet: keine Dark Patterns.
 */
export function CookieBanner({ locale }: { locale: Locale }) {
  const { t } = useTranslation()
  const consent = useSyncExternalStore(subscribeConsent, getConsent, getServerConsent)

  // Einziger Weg zu Google Analytics: erteilte Einwilligung, jetzt oder aus einem früheren Besuch.
  useEffect(() => {
    if (consent === 'granted') loadAnalytics()
  }, [consent])

  if (consent !== null) return null

  const buttonClass =
    'cursor-pointer border border-gray-muted px-6 py-3 font-medium text-gray-text hover:border-red-light hover:text-red-light'

  return (
    <section
      aria-labelledby="cookie-banner-text"
      className="sticky bottom-0 z-50 border-t border-red-primary bg-black-secondary"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-5 lg:flex-row lg:items-center">
        <p id="cookie-banner-text" className="flex-1 text-sm leading-relaxed">
          <span className="sr-only">{t('cookies.ariaLabel')}: </span>
          {t('cookies.text')}{' '}
          <Link to={pathFor('privacy', locale)} className="text-red-light underline underline-offset-2">
            {t('cookies.privacyLink')}
          </Link>
        </p>
        <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => setConsent('denied')} className={buttonClass}>
            {t('cookies.reject')}
          </button>
          <button type="button" onClick={() => setConsent('granted')} className={buttonClass}>
            {t('cookies.accept')}
          </button>
        </div>
      </div>
    </section>
  )
}
