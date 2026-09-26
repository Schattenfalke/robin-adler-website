/**
 * Google Analytics 4 — wird ausschließlich hier und nur nach Einwilligung geladen.
 * Kein GA-Script im HTML. Einziger Aufrufer von loadAnalytics(): CookieBanner.
 */
import { getConsent } from './consent'

type GtagArgs =
  | ['js', Date]
  | ['config', string, Record<string, unknown>?]
  | ['event', string, Record<string, unknown>?]

declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void
    dataLayer?: unknown[]
  }
}

let loaded = false

/** Lädt GA4 dynamisch. Ohne erteilte Einwilligung oder ohne Mess-ID passiert nichts. */
export const loadAnalytics = () => {
  if (loaded) return
  if (getConsent() !== 'granted') return // doppelte Absicherung
  const id = import.meta.env.VITE_GA_ID
  if (!id) return

  window.dataLayer = window.dataLayer ?? []
  const dataLayer = window.dataLayer
  // gtag.js erwartet das arguments-Objekt, kein Array — mit einem Array
  // werden die Befehle stillschweigend ignoriert. Deshalb keine Pfeilfunktion.
  window.gtag = function gtag(..._args: GtagArgs) {
    // oxlint-disable-next-line prefer-rest-params
    dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  // GA4 protokolliert keine IP-Adressen, `anonymize_ip` wäre wirkungslos.
  // Seitenaufrufe bei Navigation erfasst GA4 selbst (Verlaufsereignisse, "Erweiterte Messung").
  window.gtag('config', id, {
    allow_google_signals: false, // keine Werbe-/Remarketing-Funktionen
    allow_ad_personalization_signals: false,
    cookie_flags: 'SameSite=Strict;Secure',
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(script)

  loaded = true
}

/** Custom Events. Ohne Einwilligung ein No-op — nie ein Fehler, nie ein Tracking-Leck. */
export const logEvent = (name: string, params?: Record<string, unknown>) => {
  window.gtag?.('event', name, params)
}
