import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { ThreeDoors } from './ThreeDoors'
import { usePortalCanvas } from './usePortalCanvas'

/**
 * Hero mit den drei Lichtportalen (Vorlage: docs/prototypes/lichtportale.html).
 * Höhe = Viewport minus Header minus Cookie-Banner (--banner-height, solange er steht),
 * damit die Portale beim ersten Besuch über dem Banner liegen statt darunter.
 * Der Canvas liegt hinter den Türen und malt dorthin, wo deren Ringe im Layout liegen.
 */
export function PortalHero() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ringRefs = useRef<(HTMLElement | null)[]>([])
  const portals = usePortalCanvas(canvasRef, ringRefs, useReducedMotion())

  return (
    <section className="relative flex min-h-[calc(100svh-4rem-var(--banner-height,0px))] flex-col items-center justify-center overflow-hidden px-4 pt-8 pb-20">
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 block size-full" />

      <div className="relative z-10 mb-[clamp(2.5rem,8vh,5.5rem)] max-w-[54rem] text-center">
        <h1 className="mb-[.9rem] font-sans text-[clamp(1.85rem,5vw,3.5rem)] leading-[1.14] font-medium tracking-[-0.022em] text-gray-text">
          {t('hero.title')}
          <br />
          <em className="text-red-light not-italic">{t('hero.titleAccent')}</em>
        </h1>
        <p className="text-[clamp(.95rem,1.8vw,1.12rem)] text-gray-muted">{t('hero.subtitle')}</p>
      </div>

      <ThreeDoors ringRefs={ringRefs} portals={portals} />
    </section>
  )
}
