import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router'
import i18n from '../lib/i18n'
import { localeFromPath } from '../lib/routes'
import { routes } from '../routes'

const handler = createStaticHandler(routes)

/** Rendert eine Route zu HTML. Nur für den Build, läuft in Node. */
export async function render(path: string): Promise<string> {
  await i18n.changeLanguage(localeFromPath(path))

  const context = await handler.query(new Request(`https://robin-adler.de${path}`))
  if (context instanceof Response) {
    throw new Error(`Route ${path} liefert eine Weiterleitung statt einer Seite`)
  }

  return renderToString(
    <StrictMode>
      <StaticRouterProvider router={createStaticRouter(handler.dataRoutes, context)} context={context} hydrate={false} />
    </StrictMode>,
  )
}
