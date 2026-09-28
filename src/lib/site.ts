/**
 * Stammdaten der Website. Impressum, Datenschutz und Schema.org lesen von hier —
 * echte Daten werden nur an dieser einen Stelle eingetragen.
 */

/** Produktionsdomain. Nur hier darf sie stehen. */
export const PRODUCTION_URL = 'https://robin-adler.de'

/** Ziel des aktuellen Builds, aus public/CNAME (siehe vite.config.ts). */
export const SITE_URL = import.meta.env.VITE_SITE_URL

/**
 * Nur der Produktions-Build darf in Suchmaschinen landen. Jede andere Domain
 * (z.B. preview.robin-adler.de) bekommt noindex, sonst droht Duplicate Content.
 */
export const IS_PRODUCTION = SITE_URL === PRODUCTION_URL

/** Absolute URL zu einem Pfad aus src/lib/routes.ts. */
export const absoluteUrl = (path: string): string => `${SITE_URL}${path}`

// TODO: Echte Angaben eintragen, bevor die Seite live geht (siehe CLAUDE.md, "Offene Punkte").
// Keine USt-ID: Kleinunternehmer nach § 19 UStG — das Feld existiert bewusst nicht.
export const OWNER = {
  name: 'Robin Adler',
  street: 'TODO: Straße und Hausnummer',
  postalCode: 'TODO: PLZ',
  city: 'TODO: Ort',
  email: 'TODO: E-Mail-Adresse',
  phone: 'TODO: Telefonnummer',
} as const
