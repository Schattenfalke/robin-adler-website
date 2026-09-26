import type { ReactNode } from 'react'

/** Abschnitt einer Rechtsseite: Überschrift plus Absätze, einheitlich gesetzt. */
export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="mt-10 space-y-3">
      <h2 className="text-lg font-bold text-gray-text">{heading}</h2>
      {children}
    </section>
  )
}

/** Externer Link mit sichtbarer URL — Rechtstexte sollen die Adresse offen zeigen. */
export function ExternalLink({ href }: { href: string }) {
  return (
    <a href={href} rel="noopener noreferrer" className="break-all text-red-light underline underline-offset-2">
      {href}
    </a>
  )
}
