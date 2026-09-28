import { Link } from 'react-router'

interface Props {
  to: string
  label: string
  description: string
  /** Platzhalter-Kreis; der Canvas dahinter malt an seine gemessene Position. */
  ringRef: (el: HTMLSpanElement | null) => void
  onActivate: () => void
  onDeactivate: () => void
  onSelect: () => void
}

/**
 * Eine Tür als Link. Den zugänglichen Namen liefern Label und Beschreibung als echter Text;
 * das Licht ist reine Dekoration auf dem Canvas. Zeiger und Tastaturfokus lösen dasselbe aus.
 */
export function Door({ to, label, description, ringRef, onActivate, onDeactivate, onSelect }: Props) {
  return (
    <Link
      to={to}
      onClick={onSelect}
      onPointerEnter={onActivate}
      onPointerLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      className="group flex flex-col items-center gap-[1.4rem] rounded-[50%] transition-transform duration-[550ms] ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-2 focus-visible:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-[18px] focus-visible:outline-red-light motion-reduce:transition-none"
    >
      <span ref={ringRef} className="block aspect-square w-[clamp(96px,21vw,190px)] rounded-full" />
      <span className="font-mono text-[clamp(.95rem,2.2vw,1.28rem)] font-bold tracking-[.16em] text-gray-text">
        {label}
      </span>
      {/* Unter 600 px nur visuell ausgeblendet — bleibt Teil des zugänglichen Namens. */}
      <span className="-mt-[.7rem] max-w-[16ch] text-center text-[clamp(.72rem,1.5vw,.87rem)] leading-[1.45] text-gray-muted transition-colors duration-[400ms] group-hover:text-gray-text group-focus-visible:text-gray-text max-[600px]:sr-only motion-reduce:transition-none">
        {description}
      </span>
    </Link>
  )
}
