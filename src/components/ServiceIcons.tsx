import type { ReactNode } from 'react'
import type { ServiceId } from '../i18n/translations.ts'

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <svg className="service-icon" viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

function SeoIcon() {
  return (
    <IconFrame>
      <path {...stroke} d="M4.2 16.8v-3.2M7 16.8V10.4M9.8 16.8v-5.6" />
      <circle {...stroke} cx="16.2" cy="9.2" r="4.4" />
      <path {...stroke} d="m19.4 12.4 3 3" />
    </IconFrame>
  )
}

function BuildIcon() {
  return (
    <IconFrame>
      <circle {...stroke} cx="12" cy="12" r="3" />
      <path
        {...stroke}
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
      />
    </IconFrame>
  )
}

function ShopIcon() {
  return (
    <IconFrame>
      <path {...stroke} d="M4.2 6.2h2.4l1.5 9.2h10.2" />
      <path {...stroke} d="M7.6 11.6h10.6l1.6-5.4H7.2" />
      <circle {...stroke} cx="9.4" cy="18.2" r="1.25" />
      <circle {...stroke} cx="16.8" cy="18.2" r="1.25" />
    </IconFrame>
  )
}

function WebIcon() {
  return (
    <IconFrame>
      <circle {...stroke} cx="12" cy="12" r="8" />
      <ellipse {...stroke} cx="12" cy="12" rx="3.2" ry="8" />
      <path {...stroke} d="M4.4 12h15.2" />
    </IconFrame>
  )
}

const icons: Record<ServiceId, () => ReactNode> = {
  seo: SeoIcon,
  custom: BuildIcon,
  shops: ShopIcon,
  web: WebIcon,
}

export function ServiceIcon({ id }: { id: ServiceId }) {
  const Icon = icons[id]
  return <Icon />
}
