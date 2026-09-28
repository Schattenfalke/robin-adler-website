/*
 * Symbole für die Türfüllungen, gezeichnet in einem 24×24-Raster.
 * Farbe und Strichstärke erbt jedes Symbol vom umgebenden <g> (currentColor).
 */

export function CodeIcon() {
  return (
    <>
      <polyline points="8 6 2 12 8 18" />
      <polyline points="16 6 22 12 16 18" />
    </>
  )
}

export function WrenchIcon() {
  return (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  )
}

export function MagnifierIcon() {
  return (
    <>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16" y2="16" />
    </>
  )
}
