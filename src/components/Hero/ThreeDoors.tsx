import { useTranslation } from 'react-i18next'
import { useLocale } from '../../hooks/useLocale'
import { logEvent } from '../../lib/analytics'
import { pathFor } from '../../lib/routes'
import { Door } from './Door'
import { CodeIcon, MagnifierIcon, WrenchIcon } from './DoorIcons'

const DOORS = [
  { page: 'build', icon: <CodeIcon /> },
  { page: 'fix', icon: <WrenchIcon /> },
  { page: 'review', icon: <MagnifierIcon /> },
] as const

/** Die drei Türen BUILD, FIX, REVIEW — jede führt auf ihre Unterseite. */
export function ThreeDoors() {
  const { t } = useTranslation()
  const locale = useLocale()

  return (
    <nav aria-label={t('hero.doorsLabel')}>
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {DOORS.map(({ page, icon }) => (
          <li key={page}>
            <Door
              to={pathFor(page, locale)}
              label={t(`doors.${page}.label`)}
              description={t(`doors.${page}.description`)}
              icon={icon}
              // Wichtigste Metrik laut docs/04-legal.md; ohne Einwilligung ein No-op.
              onSelect={() => logEvent('door_click', { door: page })}
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}
