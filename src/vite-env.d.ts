/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Ziel-URL des Builds, per `define` aus public/CNAME gesetzt (vite.config.ts). */
  readonly VITE_SITE_URL: string
  /** GA4-Mess-ID (G-XXXXXXXXXX). Ohne ID lädt Analytics nie. */
  readonly VITE_GA_ID?: string
  /** Search-Console-Verifizierung, setzt keine Cookies. */
  readonly VITE_GSC_VERIFICATION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
