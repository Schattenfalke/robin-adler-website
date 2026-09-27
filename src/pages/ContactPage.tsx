import { useTranslation } from 'react-i18next'

export function ContactPage() {
  const { t } = useTranslation()

  return <h1>{t('pages.contact.title')}</h1>
}
