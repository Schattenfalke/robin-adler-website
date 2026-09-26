import { createBrowserRouter, Navigate } from 'react-router'
import { LanguageLayout } from './components/Layout/LanguageLayout'
import { DEFAULT_LANGUAGE } from './lib/i18n'
import { BuildPage } from './pages/BuildPage'
import { FixPage } from './pages/FixPage'
import { HomePage } from './pages/HomePage'
import { ImpressumPage } from './pages/ImpressumPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { ReviewPage } from './pages/ReviewPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to={`/${DEFAULT_LANGUAGE}`} replace /> },
  {
    path: '/:lang',
    element: <LanguageLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'build', element: <BuildPage /> },
      { path: 'fix', element: <FixPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'impressum', element: <ImpressumPage /> },
      { path: 'datenschutz', element: <PrivacyPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
