import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react'
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

  // Höhe als CSS-Variable veröffentlichen: Das mobile Menü endet darüber, und
  // scroll-padding-bottom hält fokussierte Elemente frei (WCAG 2.4.11).
  // Laufzeitwert, nicht per Klasse ausdrückbar — deshalb setProperty statt Tailwind.
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const banner = ref.current
    const root = document.documentElement
    if (!banner) return
    const observer = new ResizeObserver(([entry]) => {
      const height = entry?.borderBoxSize[0]?.blockSize ?? banner.offsetHeight
      root.style.setProperty('--banner-height', `${height}px`)
    })
    observer.observe(banner)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--banner-height')
    }
  }, [consent])

  if (consent !== null) return null

  // Beide Schaltflächen identisch: gleiche Größe, gleiche Gestaltung (keine Dark Patterns).
  const buttonClass =
    'cursor-pointer border border-gray-muted px-3 py-2.5 text-sm font-medium text-gray-text hover:border-red-light hover:text-red-light sm:px-6 sm:py-3 sm:text-base'

  return (
    <section
      ref={ref}
      aria-labelledby="cookie-banner-text"
      className="sticky bottom-0 z-50 border-t border-red-primary bg-black-secondary"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:gap-5 sm:py-5 lg:flex-row lg:items-center">
        <p id="cookie-banner-text" className="flex-1 text-sm leading-snug sm:leading-relaxed">
          <span className="sr-only">{t('cookies.ariaLabel')}: </span>
          {/* Mobil die Kurzfassung — nennt weiterhin Zweck, Cookies und Übermittlung an Google. */}
          <span className="sm:hidden">{t('cookies.textShort')}</span>
          <span className="hidden sm:inline">{t('cookies.text')}</span>{' '}
          <Link to={pathFor('privacy', locale)} className="text-red-light underline underline-offset-2">
            {t('cookies.privacyLink')}
          </Link>
        </p>
        <div className="grid shrink-0 grid-cols-2 gap-3">
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
