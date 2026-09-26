import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import i18n from './lib/i18n'
import { localeFromPath } from './lib/routes'
import { routes } from './routes'
import './styles/globals.css'

const container = document.getElementById('root')
if (!container) throw new Error('#root fehlt in index.html')

const { pathname } = window.location
await i18n.changeLanguage(localeFromPath(pathname))

const app = (
  <StrictMode>
    <RouterProvider router={createBrowserRouter(routes)} />
  </StrictMode>
)

// Hydrieren nur, wenn das vorgerenderte HTML zu genau dieser URL gehört.
// Die 404.html wird für beliebige Pfade ausgeliefert — dort neu rendern.
const trimSlash = (path: string) => path.replace(/\/+$/, '')
const prerenderedPath = container.dataset.path
if (prerenderedPath !== undefined && trimSlash(prerenderedPath) === trimSlash(pathname)) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
