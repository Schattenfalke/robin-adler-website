import { useMatches } from 'react-router'
import type { PageKey } from '../lib/routes'
import type { PageHandle } from '../routes'

const isPageHandle = (handle: unknown): handle is PageHandle =>
  typeof handle === 'object' && handle !== null && 'page' in handle

/** Aktuelle Seite aus der Routen-Hierarchie; auf der 404-Seite undefined. */
export const useCurrentPage = (): PageKey | undefined => {
  const match = useMatches().find((m) => isPageHandle(m.handle))
  return match && isPageHandle(match.handle) ? match.handle.page : undefined
}
