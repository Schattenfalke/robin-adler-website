import { useTranslation } from 'react-i18next'

export function BuildPage() {
  const { t } = useTranslation()

  return <h1>{t('pages.build.title')}</h1>
}
