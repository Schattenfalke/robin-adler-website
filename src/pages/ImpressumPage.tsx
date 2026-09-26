import { useTranslation } from 'react-i18next'

export function ImpressumPage() {
  const { t } = useTranslation()

  return <h1>{t('pages.impressum.title')}</h1>
}
