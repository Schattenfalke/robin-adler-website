import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { revokeConsent } from '../../lib/consent'
import { pathFor, type Locale } from '../../lib/routes'

const linkClass = 'text-gray-muted hover:text-red-light'

export function Footer({ locale }: { locale: Locale }) {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-black-secondary">
      <nav aria-label={t('footer.navLabel')} className="mx-auto max-w-5xl px-4 py-8">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <li>
            <Link to={pathFor('impressum', locale)} className={linkClass}>
              {t('footer.impressum')}
            </Link>
          </li>
          <li>
            <Link to={pathFor('privacy', locale)} className={linkClass}>
              {t('footer.privacy')}
            </Link>
          </li>
          <li>
            <button type="button" onClick={revokeConsent} className={`${linkClass} cursor-pointer`}>
              {t('footer.cookieSettings')}
            </button>
          </li>
        </ul>
      </nav>
    </footer>
  )
}
