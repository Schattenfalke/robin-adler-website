import { useEffect, useRef, type RefObject } from 'react'
import {
  createPortal,
  createVignette,
  isSettling,
  readPalette,
  RECEDE,
  reduceParticles,
  renderScene,
  stepPortals,
} from './portalRenderer'

export interface PortalControls {
  /** Portal i ansteuern (Zeiger oder Tastaturfokus), die anderen treten zurück. */
  activate: (index: number) => void
  /** Alle zurück in den Ruhezustand. */
  deactivate: () => void
}

const NOOP_CONTROLS: PortalControls = { activate: () => {}, deactivate: () => {} }

/*
 * Adaptive Auflösung. Die Kosten wachsen mit der Pixelzahl (gemessen: DPR 2 → 1 verdreifacht
 * die Bildrate auf schwacher Hardware). Start scharf mit DPR 2; hält das Gerät die Bildrate
 * nicht, wird stufenweise gesenkt — nur abwärts, nie zurück, damit nichts flackert.
 */
const DPR_STEPS = [2, 1.5, 1] as const
const MIN_FPS = 45
/*
 * Messfenster nach Zeit, nicht nach Bildern: Bei 60 Bildern bräuchte ein Gerät mit 12 fps
 * fünf Sekunden pro Entscheidung — genau die Geräte, die schnell entlastet werden müssen.
 */
const SAMPLE_WINDOW_MS = 1000
/** Auf der untersten Stufe zusätzlich nur noch dieser Anteil der Partikel. */
const LOW_END_PARTICLES = 0.5
/*
 * Erst nach dieser Zeit messen: Seitenaufbau, Hydration und Schriftladen erzeugen kurze
 * Einbrüche. Da die Auflösung nie wieder steigt, würde ein solcher Einbruch ein starkes
 * Gerät dauerhaft herunterstufen.
 */
const MEASURE_DELAY_MS = 1000

/**
 * Lebenszyklus des Portal-Canvas. Die Portalpositionen werden zur Laufzeit aus den
 * DOM-Rechtecken der Ring-Platzhalter gemessen — Licht und Layout bleiben so auf jedem
 * Viewport deckungsgleich, ohne Maße doppelt zu pflegen.
 *
 * Die Schleife läuft nur, solange die Hero sichtbar ist, der Tab aktiv ist und es etwas
 * zu bewegen gibt. Bei reduzierter Bewegung: ein statisches Bild; nur der Farbübergang
 * beim Ansteuern wird noch ausgeblendet (keine Bewegung).
 */
export function usePortalCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  ringRefs: RefObject<(HTMLElement | null)[]>,
  reducedMotion: boolean,
): RefObject<PortalControls> {
  const controls = useRef<PortalControls>(NOOP_CONTROLS)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !ctx) return

    const motion = !reducedMotion
    const palette = readPalette(ctx)
    const portals = [0, 1, 2].map(createPortal)
    let width = 0
    let height = 0
    let t = 0
    let raf = 0
    let last = 0
    let inView = false
    let pageVisible = !document.hidden
    let vignette = createVignette(1, 1, 1, palette)
    let dprStep = 0
    let sampleTime = 0
    let sampleFrames = 0
    const mountedAt = performance.now()

    const render = () => renderScene(ctx, width, height, t, portals, palette, vignette)

    const measure = () => {
      const base = canvas.getBoundingClientRect()
      portals.forEach((p, i) => {
        const ring = ringRefs.current[i]?.getBoundingClientRect()
        if (!ring) return
        p.cx = ring.left - base.left + ring.width / 2
        p.cy = ring.top - base.top + ring.height / 2
        p.r = ring.width / 2
      })
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_STEPS[dprStep] ?? 1)
      canvas.dataset.quality = String(dprStep) // 0 = volle Auflösung; zum Nachsehen in den Entwicklertools
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      vignette = createVignette(width, height, dpr, palette)
      measure()
      render() // auch ohne laufende Schleife ein korrektes Bild
    }

    // Mittelt die Bildrate über SAMPLE_WINDOW_MS und senkt bei Bedarf eine Stufe.
    const adaptResolution = (dt: number, now: number) => {
      if (dprStep >= DPR_STEPS.length - 1) return
      if (now - mountedAt < MEASURE_DELAY_MS) return
      sampleTime += dt
      sampleFrames += 1
      if (sampleTime < SAMPLE_WINDOW_MS) return
      const fps = (sampleFrames * 1000) / sampleTime
      sampleTime = 0 // neues Fenster, auch nach einem Stufenwechsel
      sampleFrames = 0
      if (fps < MIN_FPS) {
        dprStep += 1
        if (dprStep === DPR_STEPS.length - 1) reduceParticles(portals, LOW_END_PARTICLES)
        resize()
      }
    }

    const shouldRun = () => inView && pageVisible && (motion || isSettling(portals))

    const frame = (now: number) => {
      const dt = Math.min(now - last, 60)
      last = now
      if (motion) t += dt // ohne Bewegung atmen auch die Bögen nicht
      stepPortals(portals, dt, motion)
      render()
      if (motion) adaptResolution(dt, now)
      raf = shouldRun() ? requestAnimationFrame(frame) : 0
    }

    const start = () => {
      if (raf || !shouldRun()) return
      last = performance.now()
      sampleTime = 0 // nach Pause neu messen, der erste Frame ist nicht repräsentativ
      sampleFrames = 0
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? false
      if (inView) start()
      else stop()
    })
    intersection.observe(canvas)

    const onVisibility = () => {
      pageVisible = !document.hidden
      if (pageVisible) start()
      else stop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Größe des Canvas und Lage der Ringe (Schriften, Umbrüche, Drehung des Geräts).
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    ringRefs.current.forEach((ring) => ring && resizeObserver.observe(ring))

    controls.current = {
      activate: (index) => {
        portals.forEach((p, j) => (p.target = j === index ? 1 : RECEDE))
        start()
      },
      deactivate: () => {
        portals.forEach((p) => (p.target = 0))
        start()
      },
    }

    resize()

    return () => {
      stop()
      intersection.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      controls.current = NOOP_CONTROLS
    }
  }, [canvasRef, ringRefs, reducedMotion])

  return controls
}
