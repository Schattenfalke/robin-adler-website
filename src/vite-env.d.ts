/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** GA4-Mess-ID (G-XXXXXXXXXX). Ohne ID lädt Analytics nie. */
  readonly VITE_GA_ID?: string
  /** Search-Console-Verifizierung, setzt keine Cookies. */
  readonly VITE_GSC_VERIFICATION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
