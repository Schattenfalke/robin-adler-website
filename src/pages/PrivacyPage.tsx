import { useTranslation } from 'react-i18next'
import { ExternalLink, LegalSection } from '../components/Legal/LegalSection'
import { OwnerAddress } from '../components/Legal/OwnerAddress'
import { OWNER } from '../lib/site'

const LINKS = {
  gaInfo: 'https://support.google.com/analytics/answer/6004245',
  gaOptOut: 'https://tools.google.com/dlpage/gaoptout',
  github: 'https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement',
  cloudflare: 'https://www.cloudflare.com/privacypolicy/',
} as const

/*
 * Grundlage: docs/04-legal.md, Abschnitt 7.2. Über die Vorlage hinaus ergänzt
 * (Pflichtangaben nach Art. 13 DSGVO bzw. sachliche Korrekturen):
 * - Anschrift des Verantwortlichen
 * - GA: "Universal Analytics" → GA4, Anbieter Google Ireland, USA-Übermittlung (DPF),
 *   Rechtsgrundlage, Speicherdauer 2 Monate; IP-Umgang als Anbieterangabe statt "IP-Masking"
 * - Kontaktformular: Art. 6 Abs. 1 lit. b, lit. f als Auffang
 * - Rechte: Art. 20, 21, 7 Abs. 3 und Beschwerderecht Art. 77
 * - Cookies: GA4 setzt _ga und _ga_<ID> (nicht _gid)
 * Vor dem Go-Live rechtlich prüfen lassen.
 */
export function PrivacyPage() {
  const { t } = useTranslation()

  return (
    <article className="max-w-3xl leading-relaxed">
      <h1 className="text-3xl font-bold">{t('pages.privacy.title')}</h1>
      <p className="mt-2 text-sm text-gray-muted">{t('privacy.updated')}</p>

      <LegalSection heading={t('privacy.controller.heading')}>
        <OwnerAddress />
        <p>{OWNER.email}</p>
      </LegalSection>

      <LegalSection heading={t('privacy.collected.heading')}>
        <p>{t('privacy.collected.intro')}</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>{t('privacy.collected.form')}</li>
          <li>{t('privacy.collected.analytics')}</li>
          <li>{t('privacy.collected.logs')}</li>
        </ul>
      </LegalSection>

      <LegalSection heading={t('privacy.legal.heading')}>
        <p>{t('privacy.legal.text')}</p>
      </LegalSection>

      <LegalSection heading={t('privacy.analytics.heading')}>
        <p>
          {t('privacy.analytics.service')} <ExternalLink href={LINKS.gaInfo} />
        </p>
        <p>{t('privacy.analytics.transfer')}</p>
        <p>{t('privacy.analytics.basis')}</p>
        <p>
          {t('privacy.analytics.optOut')} <ExternalLink href={LINKS.gaOptOut} />
        </p>
      </LegalSection>

      <LegalSection heading={t('privacy.form.heading')}>
        <p>{t('privacy.form.text')}</p>
        <p>{t('privacy.form.retention')}</p>
      </LegalSection>

      <LegalSection heading={t('privacy.rights.heading')}>
        <p>{t('privacy.rights.text')}</p>
        <p>{t('privacy.rights.more')}</p>
        <p>{t('privacy.rights.complaint')}</p>
        <p>
          {t('privacy.rights.contact')} {OWNER.email}
        </p>
      </LegalSection>

      <LegalSection heading={t('privacy.hosting.heading')}>
        <p>
          {t('privacy.hosting.github')} <ExternalLink href={LINKS.github} />
        </p>
        <p>
          {t('privacy.hosting.cloudflare')} <ExternalLink href={LINKS.cloudflare} />
        </p>
        <p>{t('privacy.hosting.endpoint')}</p>
      </LegalSection>

      <LegalSection heading={t('privacy.cookies.heading')}>
        <p>{t('privacy.cookies.text')}</p>
      </LegalSection>
    </article>
  )
}
