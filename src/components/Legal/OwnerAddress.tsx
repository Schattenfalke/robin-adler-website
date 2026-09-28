import { useTranslation } from 'react-i18next'
import { OWNER } from '../../lib/site'

/** Anschrift aus src/lib/site.ts — Impressum und Datenschutz zeigen dieselben Daten. */
export function OwnerAddress() {
  const { t } = useTranslation()

  return (
    <address className="not-italic">
      {OWNER.name}
      <br />
      {OWNER.street}
      <br />
      {OWNER.postalCode} {OWNER.city}
      <br />
      {t('impressum.country')}
    </address>
  )
}
