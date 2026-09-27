import type { ReactNode } from 'react'
import { Link } from 'react-router'

interface Props {
  to: string
  label: string
  description: string
  icon: ReactNode
  onSelect?: () => void
}

// Einzige Bewegung: Farb- und Deckkraftwechsel. Bei prefers-reduced-motion ohne Übergang.
const fade = 'transition duration-300 motion-reduce:transition-none'

/**
 * Eine Tür als Link. Das SVG ist rein dekorativ (aria-hidden); den zugänglichen Namen
 * liefern Label und Beschreibung als echter Text. Hover und Tastaturfokus sehen gleich aus.
 */
export function Door({ to, label, description, icon, onSelect }: Props) {
  return (
    <Link
      to={to}
      onClick={onSelect}
      className="group flex flex-col items-center gap-4 rounded-sm p-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-light"
    >
      <svg
        viewBox="0 0 160 240"
        aria-hidden="true"
        className={`w-full max-w-44 text-gray-muted group-hover:text-red-primary group-focus-visible:text-red-primary ${fade}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Lichtspalt hinter der Tür — erscheint bei Hover/Fokus */}
        <rect
          x="134"
          y="22"
          width="6"
          height="208"
          stroke="none"
          className={`fill-red-primary opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 ${fade}`}
        />
        {/* Zarge und Schwelle */}
        <path d="M14 232 V14 H146 V232" />
        <line x1="6" y1="232" x2="154" y2="232" />
        {/* Türblatt mit Füllungen und Griff */}
        <rect x="22" y="22" width="112" height="210" className="fill-black-secondary" />
        <rect x="36" y="40" width="84" height="90" rx="2" strokeOpacity="0.6" />
        <rect x="36" y="146" width="84" height="66" rx="2" strokeOpacity="0.6" />
        <circle cx="118" cy="140" r="4" fill="currentColor" stroke="none" />
        <g transform="translate(60 67) scale(1.5)" strokeWidth="1.5">
          {icon}
        </g>
      </svg>

      <span className="text-center">
        <span
          className={`block font-mono text-2xl font-bold tracking-widest text-gray-text group-hover:text-red-light group-focus-visible:text-red-light ${fade}`}
        >
          {label}
        </span>
        <span className="mt-1 block text-sm text-gray-muted">{description}</span>
      </span>
    </Link>
  )
}
