/**
 * Erzeugt nach dem Client-Build eine echte HTML-Datei pro Route,
 * damit GitHub Pages jede URL mit Status 200 ausliefert.
 * Siehe docs/01-architektur.md, Abschnitt "Routing & Prerendering".
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { ALL_ROUTES, DEFAULT_LOCALE, LOCALES, localeFromPath, pathFor } from '../lib/routes'
import { absoluteUrl, IS_PRODUCTION, SITE_URL } from '../lib/site'
import { render } from './render'

const DIST = join(process.cwd(), 'dist')
const ROOT_TAG = '<div id="root"></div>'

const template = await readFile(join(DIST, 'index.html'), 'utf8')
if (!template.includes(ROOT_TAG)) {
  throw new Error(`${ROOT_TAG} fehlt in dist/index.html`)
}

/**
 * React 19 stellt <title>, <meta> und <link> an den Anfang der renderToString-Ausgabe.
 * Diese führende Gruppe gehört in den <head>; der Rest ist der Seiteninhalt.
 */
const HOISTED_HEAD = /^(?:<title>[^<]*<\/title>|<meta [^>]*\/>|<link [^>]*\/>)+/

const splitHead = (rendered: string): { head: string; body: string } => {
  const head = HOISTED_HEAD.exec(rendered)?.[0] ?? ''
  return { head, body: rendered.slice(head.length) }
}

/** Markiert Head-Tags, die main.tsx vor einem Neu-Rendern entfernt (nur 404.html, gleicher Name dort). */
const PRERENDERED_MARK = 'data-prerendered'

const fillTemplate = (path: string, rendered: string, { hydrates = true } = {}): string => {
  const { head: hoisted, body } = splitHead(rendered)
  if (!hoisted.includes('<title>')) throw new Error(`Route ${path} rendert keinen <title>`)
  const head = hydrates ? hoisted : hoisted.replace(/<(title|meta|link)\b/g, `<$1 ${PRERENDERED_MARK}`)
  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${localeFromPath(path)}">`)
    .replace(/<title>[^<]*<\/title>/, '')
    .replace('</head>', `${head}</head>`)
    .replace(ROOT_TAG, `<div id="root" data-path="${path}">${body}</div>`)
}

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
await write('404.html', fillTemplate(notFoundPath, await render(notFoundPath), { hydrates: false }))

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

// Sitemap mit Sprachalternativen — aus derselben Routenliste wie Router und Prerenderer.
const sitemapEntries = ALL_ROUTES.map(({ page, path }) => {
  const alternates = LOCALES.map(
    (locale) =>
      `    <xhtml:link rel="alternate" hreflang="${locale}" href="${absoluteUrl(pathFor(page, locale))}"/>`,
  )
  return [`  <url>`, `    <loc>${absoluteUrl(path)}</loc>`, ...alternates, `  </url>`].join('\n')
})
await write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.join('\n')}
</urlset>
`,
)
// Vorschau: Crawlen erlauben, damit Suchmaschinen das noindex der Seiten überhaupt sehen
// (ein Disallow würde es verbergen). Die Sitemap wird dort nicht beworben.
await write(
  'robots.txt',
  IS_PRODUCTION
    ? `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`
    : `# Vorschau-Build (${SITE_URL}) — alle Seiten tragen noindex.\nUser-agent: *\nAllow: /\n`,
)

console.log(`${SITE_URL}${IS_PRODUCTION ? '' : ' (Vorschau, noindex)'}: prerendered ${ALL_ROUTES.length} routes + 404.html + index.html + sitemap.xml + robots.txt`)
