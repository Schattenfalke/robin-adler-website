import { useTranslation } from 'react-i18next'

export function FixPage() {
  const { t } = useTranslation()

  return <h1>{t('pages.fix.title')}</h1>
}
