import { useTranslation } from 'react-i18next'
import { LegalSection } from '../components/Legal/LegalSection'
import { OwnerAddress } from '../components/Legal/OwnerAddress'
import { OWNER } from '../lib/site'

// Keine USt-ID: Kleinunternehmer (§ 19 UStG). Eine nicht existierende USt-ID im
// Impressum ist abmahnfähig; der §-19-Hinweis gehört auf Rechnungen, nicht hierher.
export function ImpressumPage() {
  const { t } = useTranslation()

  return (
    <article className="max-w-3xl leading-relaxed">
      <h1 className="text-3xl font-bold">{t('pages.impressum.title')}</h1>

      <LegalSection heading={t('impressum.provider.heading')}>
        <OwnerAddress />
        <p>
          <strong>{t('impressum.emailLabel')}:</strong> {OWNER.email}
          <br />
          <strong>{t('impressum.phoneLabel')}:</strong> {OWNER.phone}
        </p>
      </LegalSection>

      <LegalSection heading={t('impressum.qualification.heading')}>
        <p>{t('impressum.qualification.text')}</p>
      </LegalSection>

      <LegalSection heading={t('impressum.responsible.heading')}>
        <p>{t('impressum.responsible.text')}</p>
      </LegalSection>

      <LegalSection heading={t('impressum.disclaimer.heading')}>
        <p>{t('impressum.disclaimer.text')}</p>
      </LegalSection>

      <LegalSection heading={t('impressum.links.heading')}>
        <p>{t('impressum.links.text')}</p>
      </LegalSection>

      <LegalSection heading={t('impressum.copyright.heading')}>
        <p>{t('impressum.copyright.text')}</p>
      </LegalSection>
    </article>
  )
}
