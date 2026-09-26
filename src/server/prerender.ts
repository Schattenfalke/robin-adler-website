/**
 * Erzeugt nach dem Client-Build eine echte HTML-Datei pro Route,
 * damit GitHub Pages jede URL mit Status 200 ausliefert.
 * Siehe docs/01-architektur.md, Abschnitt "Routing & Prerendering".
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { ALL_ROUTES, DEFAULT_LOCALE, localeFromPath, pathFor } from '../lib/routes'
import { render } from './render'

const DIST = join(process.cwd(), 'dist')
const ROOT_TAG = '<div id="root"></div>'

const template = await readFile(join(DIST, 'index.html'), 'utf8')
if (!template.includes(ROOT_TAG)) {
  throw new Error(`${ROOT_TAG} fehlt in dist/index.html`)
}

const fillTemplate = (path: string, html: string): string =>
  template
    .replace(/<html lang="[^"]*">/, `<html lang="${localeFromPath(path)}">`)
    .replace(ROOT_TAG, `<div id="root" data-path="${path}">${html}</div>`)

const write = async (file: string, content: string) => {
  const target = join(DIST, file)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
}

for (const { path } of ALL_ROUTES) {
  await write(join(path, 'index.html'), fillTemplate(path, await render(path)))
}

// Echte Fehlerseite. Der Pfad liegt unter /de/, damit die 404 im Layout erscheint;
// main.tsx rendert hier ohnehin neu statt zu hydrieren.
const notFoundPath = `/${DEFAULT_LOCALE}/404/`
await write('404.html', fillTemplate(notFoundPath, await render(notFoundPath)))

// GitHub Pages kann keine Server-Weiterleitung: statische Weiterleitung auf die Standardsprache.
const home = pathFor('home', DEFAULT_LOCALE)
await write(
  'index.html',
  `<!doctype html>
<html lang="${DEFAULT_LOCALE}">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=${home}" />
    <link rel="canonical" href="${home}" />
    <meta name="robots" content="noindex" />
    <title>Robin Adler</title>
  </head>
  <body>
    <a href="${home}">${home}</a>
  </body>
</html>
`,
)

console.log(`prerendered ${ALL_ROUTES.length} routes + 404.html + index.html`)
