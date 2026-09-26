import 'i18next'
import type de from '../locales/de.json'

// Typisierte Übersetzungsschlüssel: t('pages.foo') mit Tippfehler bricht den Build.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof de
    }
  }
}
