import type { ReactNode } from 'react'
import { Navigate, type RouteObject } from 'react-router'
import { LanguageLayout } from './components/Layout/LanguageLayout'
import { DEFAULT_LOCALE, LOCALES, PAGE_KEYS, PAGES, type PageKey } from './lib/routes'
import { BuildPage } from './pages/BuildPage'
import { FixPage } from './pages/FixPage'
import { HomePage } from './pages/HomePage'
import { ImpressumPage } from './pages/ImpressumPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { ReviewPage } from './pages/ReviewPage'

const PAGE_ELEMENTS: Record<PageKey, ReactNode> = {
  home: <HomePage />,
  build: <BuildPage />,
  fix: <FixPage />,
  review: <ReviewPage />,
  impressum: <ImpressumPage />,
  privacy: <PrivacyPage />,
}

/** Wird in `handle` jeder Seitenroute abgelegt, damit der Sprachumschalter die Gegenseite findet. */
export interface PageHandle {
  page: PageKey
}

/** Routenbaum für Browser und Prerenderer — abgeleitet aus src/lib/routes.ts. */
export const routes: RouteObject[] = [
  // Nur für den Dev-Server; im Build ersetzt eine statische Weiterleitung diese Route.
  { path: '/', element: <Navigate to={`/${DEFAULT_LOCALE}/`} replace /> },
  ...LOCALES.map(
    (locale): RouteObject => ({
      path: `/${locale}`,
      element: <LanguageLayout locale={locale} />,
      children: [
        ...PAGE_KEYS.map((page): RouteObject => {
          const slug = PAGES[page][locale]
          const handle: PageHandle = { page }
          return slug
            ? { path: slug, element: PAGE_ELEMENTS[page], handle }
            : { index: true, element: PAGE_ELEMENTS[page], handle }
        }),
        { path: '*', element: <NotFoundPage /> },
      ],
    }),
  ),
  // Unbekanntes Sprachpräfix (z.B. /fr/…) → 404 in der Standardsprache, mit Footer (Impressum-Link).
  {
    path: '*',
    element: (
      <LanguageLayout locale={DEFAULT_LOCALE}>
        <NotFoundPage />
      </LanguageLayout>
    ),
  },
]
