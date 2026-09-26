/**
 * Einwilligung für Google Analytics (§ 25 TDDDG, Art. 6 Abs. 1 lit. a DSGVO).
 * Die Entscheidung liegt ausschließlich im localStorage des Browsers.
 */

export type ConsentState = 'granted' | 'denied' | null

const KEY = 'ra-consent-analytics'
const VERSION = 'v1' // hochzählen, wenn sich der Zweck der Verarbeitung ändert

interface StoredConsent {
  value: Exclude<ConsentState, null>
  version: string
  at: string
}

const isStoredConsent = (data: unknown): data is StoredConsent =>
  typeof data === 'object' &&
  data !== null &&
  'value' in data &&
  (data.value === 'granted' || data.value === 'denied') &&
  'version' in data &&
  typeof data.version === 'string'

// Fallback, falls localStorage nicht schreibbar ist: Die Entscheidung gilt dann
// nur für diesen Seitenaufruf, der Banner verschwindet trotzdem.
let sessionOnly: ConsentState = null

// localStorage kann werfen (z.B. gesperrte Website-Daten). Dann zählt nur die Entscheidung dieses Seitenaufrufs.
export const getConsent = (): ConsentState => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return sessionOnly
    const data: unknown = JSON.parse(raw)
    if (!isStoredConsent(data) || data.version !== VERSION) return null // erneut fragen
    return data.value
  } catch {
    return sessionOnly
  }
}

const CHANGE_EVENT = 'ra-consent-change'

export const setConsent = (value: Exclude<ConsentState, null>) => {
  const data: StoredConsent = { value, version: VERSION, at: new Date().toISOString() }
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    sessionOnly = value
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** Für useSyncExternalStore: meldet Änderungen aus diesem und aus anderen Tabs. */
export const subscribeConsent = (onChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

/** Löscht GA-Cookies auf allen Domain-Ebenen, auf denen gtag sie gesetzt haben kann. */
const deleteAnalyticsCookies = () => {
  const expired = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  const parts = window.location.hostname.split('.')
  // robin-adler.de → [robin-adler.de, .robin-adler.de]; www.robin-adler.de zusätzlich die Subdomain
  const domains = parts.flatMap((_, i) => {
    const domain = parts.slice(i).join('.')
    return domain.includes('.') ? [domain, `.${domain}`] : []
  })

  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0]?.trim() ?? ''
    if (!name.startsWith('_ga') && !name.startsWith('_gid')) return
    document.cookie = `${name}=; ${expired}`
    domains.forEach((domain) => {
      document.cookie = `${name}=; ${expired}; domain=${domain}`
    })
  })
}

/**
 * Widerruf ("Cookie-Einstellungen ändern"): Entscheidung und GA-Cookies löschen,
 * dann neu laden — ein bereits geladenes GA-Script lässt sich nicht entladen.
 * Nach dem Neuladen erscheint der Banner wieder.
 */
export const revokeConsent = () => {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    // nichts gespeichert, nichts zu löschen
  }
  deleteAnalyticsCookies()
  window.location.reload()
}
