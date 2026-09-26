import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import de from '../locales/de.json'
import en from '../locales/en.json'
import { DEFAULT_LOCALE, LOCALES } from './routes'

// Ressourcen liegen im Bundle, deshalb synchron initialisieren:
// So stimmt die Sprache schon beim ersten Render (Prerender und Hydration).
void i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    en: { translation: en },
  },
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: LOCALES,
  initAsync: false,
  interpolation: {
    // React escaped bereits selbst.
    escapeValue: false,
  },
})

export default i18n
