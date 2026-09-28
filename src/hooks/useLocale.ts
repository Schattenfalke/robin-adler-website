import { useLocation } from 'react-router'
import { localeFromPath, type Locale } from '../lib/routes'

/** Aktive Sprache aus der URL — dieselbe Quelle wie beim Prerender. */
export const useLocale = (): Locale => localeFromPath(useLocation().pathname)
