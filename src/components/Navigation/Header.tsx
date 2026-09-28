import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router'
import { useScrolled } from '../../hooks/useScrolled'
import { pathFor, type Locale } from '../../lib/routes'
import { OWNER } from '../../lib/site'
import { LanguageSwitcher } from './LanguageSwitcher'

const NAV_ITEMS = ['build', 'fix', 'review', 'contact'] as const

const fade = 'transition duration-300 motion-reduce:transition-none'
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-light'

/**
 * Sticky Header: Logo, die drei Bereiche, Kontakt, Sprachumschalter.
 * Unter md ein Hamburger-Menü als aufklappendes Panel (Disclosure, kein Modal):
 * Es endet oberhalb des Cookie-Banners (--banner-height), damit keiner den anderen verdeckt.
 */
export function Header({ locale }: { locale: Locale }) {
  const { t } = useTranslation()
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)

  const close = () => setOpen(false)
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && open) {
      close()
      toggleRef.current?.focus()
    }
  }

  const navLinks = (itemClass: string) =>
    NAV_ITEMS.map((page) => (
      <li key={page}>
        <NavLink
          to={pathFor(page, locale)}
          onClick={close}
          className={({ isActive }) =>
            `${itemClass} ${focusRing} ${fade} ${isActive ? 'text-red-light' : 'text-gray-text hover:text-red-light'}`
          }
        >
          {t(`nav.${page}`)}
        </NavLink>
      </li>
    ))

  const solid = scrolled || open

  return (
    <header
      onKeyDown={onKeyDown}
      className={`sticky top-0 z-40 border-b ${fade} ${
        solid ? 'border-black-secondary bg-black-primary/95 backdrop-blur' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-6 px-4">
        <Link
          to={pathFor('home', locale)}
          aria-label={`${OWNER.name} – ${t('header.homeLabel')}`}
          className={`font-mono text-lg font-bold tracking-tight text-gray-text hover:text-red-light ${focusRing} ${fade}`}
        >
          {OWNER.name}
        </Link>

        <nav aria-label={t('header.navLabel')} className="hidden md:block">
          <ul className="flex items-center gap-8 font-mono text-sm tracking-wider">{navLinks('py-2')}</ul>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher current={locale} />
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? t('header.closeMenu') : t('header.openMenu')}
            onClick={() => setOpen((value) => !value)}
            className={`-mr-2 cursor-pointer p-2 text-gray-text hover:text-red-light md:hidden ${focusRing} ${fade}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem-var(--banner-height,0px))] overflow-y-auto border-b border-black-secondary bg-black-primary md:hidden"
      >
        <nav aria-label={t('header.navLabel')} className="mx-auto max-w-5xl px-4 py-4">
          <ul className="flex flex-col font-mono text-lg tracking-wider">{navLinks('block py-3')}</ul>
        </nav>
      </div>
    </header>
  )
}
