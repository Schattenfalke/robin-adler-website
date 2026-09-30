/**
 * Zeichenlogik der Lichtportale, übertragen aus docs/prototypes/lichtportale.html.
 * Der visuelle Zustand dort ist verbindlich — Werte hier nur mit Abgleich am Prototyp ändern.
 * Kein React: reine Canvas-Funktionen, damit Zeichnen und Lebenszyklus getrennt bleiben.
 */

export type RGB = readonly [number, number, number]

/** Farben aus den Design-Tokens (siehe readPalette). */
export interface Palette {
  background: RGB
  rest: RGB
  hover: readonly [RGB, RGB, RGB]
}

interface Particle {
  a: number
  rad: number
  sp: number
  pull: number
  size: number
}

export interface Portal {
  cx: number
  cy: number
  r: number
  /** 0 = Ruhe, 1 = angesteuert, negativ = zurückgetreten */
  glow: number
  target: number
  spin: number
  parts: Particle[]
}

// Gesamttempo. 1 = Referenz. Alles Bewegte haengt hieran, damit Boegen,
// Atmen und Partikel nie auseinanderlaufen.
export const SPEED = 1

const PARTICLES_PER_PORTAL = 52
const RINGS = 9
/** Zurücktreten der nicht angesteuerten Portale. */
export const RECEDE = -0.3

// Weißanteil für Glanzlichter: physikalisches Aufhellen zum Licht hin,
// keine Gestaltungsfarbe — deshalb kein Token.
const WHITE: RGB = [255, 255, 255]

const mix = (a: RGB, b: RGB, k: number): RGB => [
  a[0] + (b[0] - a[0]) * k,
  a[1] + (b[1] - a[1]) * k,
  a[2] + (b[2] - a[2]) * k,
]
const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`

const newParticle = (spread: boolean): Particle => ({
  a: Math.random() * Math.PI * 2, // Winkel auf der Bahn
  rad: spread ? Math.random() : 1, // 1 = aussen, 0 = Zentrum
  sp: (0.00012 + Math.random() * 0.00022) * SPEED, // Winkelgeschwindigkeit
  pull: (0.00005 + Math.random() * 0.00011) * SPEED, // Sog nach innen
  size: 0.4 + Math.random() * 1.6,
})

/**
 * Weniger Partikel für schwache Geräte (unterste Auflösungsstufe). Kürzt nur,
 * die verbleibenden laufen unverändert weiter — kein Sprung im Bild.
 */
export function reduceParticles(portals: Portal[], fraction: number) {
  const count = Math.round(PARTICLES_PER_PORTAL * fraction)
  for (const p of portals) p.parts.length = Math.min(p.parts.length, count)
}

export const createPortal = (): Portal => ({
  cx: 0,
  cy: 0,
  r: 0,
  glow: 0,
  target: 0,
  spin: 0,
  parts: Array.from({ length: PARTICLES_PER_PORTAL }, () => newParticle(true)),
})

/** Liest eine Token-Farbe; der Canvas normalisiert jede CSS-Schreibweise zu #rrggbb. */
const readToken = (ctx: CanvasRenderingContext2D, name: string): RGB => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  ctx.fillStyle = '#000000'
  ctx.fillStyle = value
  const hex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(ctx.fillStyle))
  if (!hex) throw new Error(`Token ${name} ist keine deckende Farbe: "${value}"`)
  return [parseInt(hex[1] ?? '0', 16), parseInt(hex[2] ?? '0', 16), parseInt(hex[3] ?? '0', 16)]
}

export const readPalette = (ctx: CanvasRenderingContext2D): Palette => ({
  background: readToken(ctx, '--black-primary'),
  rest: readToken(ctx, '--red-primary'), // Markenrot im Ruhezustand
  hover: [readToken(ctx, '--red-light'), readToken(ctx, '--gold-fix'), readToken(ctx, '--blue-review')], // BUILD · FIX · REVIEW
})

/** Zeitfortschritt: Farbübergang immer, Drehung und Partikel nur mit Bewegung. */
export function stepPortals(portals: Portal[], dt: number, motion: boolean) {
  for (const p of portals) {
    p.glow += (p.target - p.glow) * Math.min(1, dt * 0.0055)
    if (!motion) continue
    p.spin += dt * (1 + Math.max(0, p.glow) * 2.2)
    for (const s of p.parts) {
      s.a += s.sp * dt * (1 + Math.max(0, p.glow) * 1.8)
      s.rad -= s.pull * dt * (1 + Math.max(0, p.glow) * 1.5)
      if (s.rad < 0) Object.assign(s, newParticle(false))
    }
  }
}

/** true, solange ein Farbübergang noch sichtbar läuft. */
export const isSettling = (portals: Portal[]) => portals.some((p) => Math.abs(p.target - p.glow) > 0.002)

function drawPortal(ctx: CanvasRenderingContext2D, p: Portal, col: RGB, t: number) {
  const g = p.glow
  const R = p.r
  const e = 1 + g * 0.16 // leichtes Aufblühen beim Ansteuern
  const intensity = 0.55 + g * 0.45

  // 1. Aussenschein
  const halo = ctx.createRadialGradient(p.cx, p.cy, R * 0.55, p.cx, p.cy, R * (2.6 + g * 1.1))
  halo.addColorStop(0, rgba(col, 0.2 * intensity))
  halo.addColorStop(0.45, rgba(col, 0.06 * intensity))
  halo.addColorStop(1, rgba(col, 0))
  ctx.fillStyle = halo
  ctx.beginPath()
  ctx.arc(p.cx, p.cy, R * (2.6 + g * 1.1), 0, Math.PI * 2)
  ctx.fill()

  ctx.save()
  ctx.globalCompositeOperation = 'lighter'

  // 2. Der Wirbel: verschachtelte Bögen, abwechselnd gegenläufig
  for (let i = 0; i < RINGS; i++) {
    const f = i / (RINGS - 1)
    const dir = i % 2 ? -1 : 1
    const rad = R * e * (0.3 + f * 0.68) + Math.sin(t * 0.00016 * SPEED + i * 1.7) * R * 0.028
    // Radiant pro Millisekunde. Innen etwas schneller als aussen.
    const speed = (0.00016 + f * 0.00009) * dir * SPEED
    const start = p.spin * speed + i * 2.1
    const span = 1.5 + Math.sin(t * 0.00013 * SPEED + i * 0.9) * 0.75 + f * 1.4
    const alpha = (0.3 - f * 0.17) * intensity

    ctx.beginPath()
    ctx.arc(p.cx, p.cy, rad, start, start + span)
    ctx.strokeStyle = rgba(col, alpha)
    ctx.lineWidth = Math.max(1, R * (0.085 - f * 0.055))
    ctx.lineCap = 'round'
    ctx.stroke()

    // heller Faden auf dem Bogen
    ctx.beginPath()
    ctx.arc(p.cx, p.cy, rad, start + span * 0.25, start + span * 0.72)
    ctx.strokeStyle = rgba(mix(col, WHITE, 0.55), alpha * 0.55)
    ctx.lineWidth = Math.max(0.6, R * 0.016)
    ctx.stroke()
  }

  // 3. Leuchtender Kern
  const core = ctx.createRadialGradient(p.cx, p.cy, 0, p.cx, p.cy, R * e * 0.86)
  core.addColorStop(0, rgba(mix(col, WHITE, 0.42), 0.34 * intensity))
  core.addColorStop(0.5, rgba(col, 0.17 * intensity))
  core.addColorStop(1, rgba(col, 0))
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(p.cx, p.cy, R * e * 0.86, 0, Math.PI * 2)
  ctx.fill()

  // 4. Partikel auf Spiralbahnen
  for (const s of p.parts) {
    const rr = R * e * (0.22 + s.rad * 0.84)
    const x = p.cx + Math.cos(s.a) * rr
    const y = p.cy + Math.sin(s.a) * rr
    const fade = (1 - Math.abs(s.rad - 0.55) * 1.3) * intensity
    if (fade <= 0) continue
    ctx.beginPath()
    ctx.arc(x, y, s.size * (1 + g * 0.5), 0, Math.PI * 2)
    ctx.fillStyle = rgba(WHITE, 0.3 * fade)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x, y, s.size * (3.2 + g * 1.4), 0, Math.PI * 2)
    ctx.fillStyle = rgba(col, 0.13 * fade)
    ctx.fill()
  }

  // 5. Scharfe Lichtkante als Abschluss des Kreises
  ctx.beginPath()
  ctx.arc(p.cx, p.cy, R * e, 0, Math.PI * 2)
  ctx.strokeStyle = rgba(mix(col, WHITE, 0.3), 0.22 * intensity + g * 0.25)
  ctx.lineWidth = 1 + g * 0.9
  ctx.stroke()

  ctx.restore()

  // 6. Lichtwurf auf den Boden
  const fy = p.cy + R * 1.75
  const spill = ctx.createRadialGradient(p.cx, fy, 0, p.cx, fy, R * (1.8 + g * 0.7))
  spill.addColorStop(0, rgba(col, 0.2 * intensity))
  spill.addColorStop(1, rgba(col, 0))
  ctx.save()
  ctx.translate(p.cx, fy)
  ctx.scale(1, 0.24)
  ctx.translate(-p.cx, -fy)
  ctx.fillStyle = spill
  ctx.beginPath()
  ctx.arc(p.cx, fy, R * (1.8 + g * 0.7), 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

/**
 * Vignette als fertiges Bild. Ein bildschirmfüllender Verlauf ist beim Rastern der teuerste
 * Einzelposten; er ändert sich nur mit der Größe, also einmal pro Resize statt pro Bild.
 */
export function createVignette(width: number, height: number, dpr: number, palette: Palette): HTMLCanvasElement {
  const layer = document.createElement('canvas')
  layer.width = Math.max(1, Math.round(width * dpr))
  layer.height = Math.max(1, Math.round(height * dpr))
  const ctx = layer.getContext('2d')
  if (!ctx) return layer
  ctx.scale(dpr, dpr)
  const v = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.22,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.8,
  )
  v.addColorStop(0, rgba(palette.background, 0))
  v.addColorStop(1, rgba(palette.background, 0.93))
  ctx.fillStyle = v
  ctx.fillRect(0, 0, width, height)
  return layer
}

/** Ein vollständiges Bild: Hintergrund, drei Portale, Vignette. */
export function renderScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  portals: Portal[],
  palette: Palette,
  vignette: HTMLCanvasElement,
) {
  ctx.fillStyle = rgba(palette.background, 1)
  ctx.fillRect(0, 0, width, height)
  portals.forEach((p, i) => {
    const hover = palette.hover[i] ?? palette.rest
    drawPortal(ctx, p, mix(palette.rest, hover, Math.max(0, p.glow)), t)
  })
  ctx.drawImage(vignette, 0, 0, width, height)
}
