import type { RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../hooks/useLocale'
import { logEvent } from '../../lib/analytics'
import { pathFor } from '../../lib/routes'
import { Door } from './Door'
import type { PortalControls } from './usePortalCanvas'

/** Reihenfolge = Portalindex im Canvas (Farben BUILD · FIX · REVIEW). */
const DOORS = ['build', 'fix', 'review'] as const

interface Props {
  ringRefs: RefObject<(HTMLElement | null)[]>
  portals: RefObject<PortalControls>
}

/** Die drei Türen BUILD, FIX, REVIEW — jede führt auf ihre Unterseite. */
export function ThreeDoors({ ringRefs, portals }: Props) {
  const { t } = useTranslation()
  const locale = useLocale()

  return (
    <nav aria-label={t('hero.doorsLabel')} className="relative z-10">
      <ul className="flex items-start justify-center gap-[.6rem] min-[601px]:gap-[clamp(1rem,7vw,6rem)]">
        {DOORS.map((page, index) => (
          <li key={page}>
            <Door
              to={pathFor(page, locale)}
              label={t(`doors.${page}.label`)}
              description={t(`doors.${page}.description`)}
              ringRef={(el) => {
                ringRefs.current[index] = el
              }}
              onActivate={() => portals.current.activate(index)}
              onDeactivate={() => portals.current.deactivate()}
              // Wichtigste Metrik laut docs/04-legal.md; ohne Einwilligung ein No-op.
              onSelect={() => logEvent('door_click', { door: page })}
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}
