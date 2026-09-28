import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
const getSnapshot = () => window.matchMedia(QUERY).matches
const getServerSnapshot = () => false // Prerender kennt die Einstellung nicht; Effekte laufen erst im Browser

/** true, wenn das System reduzierte Bewegung wünscht. Reagiert auch auf Änderungen zur Laufzeit. */
export const useReducedMotion = (): boolean => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
