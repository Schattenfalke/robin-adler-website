import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'

// public/CNAME ist die einzige Stelle für die Ziel-Domain des Deployments
// (Vorschau oder Produktion). src/lib/site.ts leitet daraus SITE_URL ab.
const domain = readFileSync(new URL('./public/CNAME', import.meta.url), 'utf8').trim()
if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
  throw new Error(`public/CNAME enthält keine gültige Domain: "${domain}"`)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.VITE_SITE_URL': JSON.stringify(`https://${domain}`),
  },
})
