import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import de from '../locales/de.json'
import en from '../locales/en.json'

export const LANGUAGES = ['de', 'en'] as const
export type Language = (typeof LANGUAGES)[number]
export const DEFAULT_LANGUAGE: Language = 'de'

export const isLanguage = (value: string | undefined): value is Language =>
  LANGUAGES.some((language) => language === value)

/** Sprache aus dem ersten Pfadsegment, damit schon der erste Render stimmt. */
const languageFromPath = (pathname: string): Language => {
  const segment = pathname.split('/')[1]
  return isLanguage(segment) ? segment : DEFAULT_LANGUAGE
}

void i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    en: { translation: en },
  },
  lng: languageFromPath(window.location.pathname),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: LANGUAGES,
  interpolation: {
    // React escaped bereits selbst.
    escapeValue: false,
  },
})

export default i18n
