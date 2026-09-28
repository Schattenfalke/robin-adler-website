import { useSyncExternalStore } from 'react'

const THRESHOLD = 8

const subscribe = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true })
  return () => window.removeEventListener('scroll', onChange)
}
const getSnapshot = () => window.scrollY > THRESHOLD
const getServerSnapshot = () => false // Prerender: Seite steht oben

/** true, sobald die Seite ein Stück gescrollt ist. Stimmt auch nach einem Reload mitten auf der Seite. */
export const useScrolled = (): boolean => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
