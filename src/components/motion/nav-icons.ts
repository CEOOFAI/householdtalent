import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  Briefcase,
  LifeBuoy,
  User,
  Settings,
  Plus,
  Handshake,
  Building2,
  type LucideIcon,
} from 'lucide-react'

/**
 * Icons are referenced by name so nav config can be passed from Server
 * Components (layouts) into client nav components.
 */
export const NAV_ICONS = {
  dashboard: LayoutDashboard,
  file: FileText,
  users: Users,
  card: CreditCard,
  briefcase: Briefcase,
  support: LifeBuoy,
  user: User,
  settings: Settings,
  plus: Plus,
  handshake: Handshake,
  building: Building2,
} satisfies Record<string, LucideIcon>

export type NavIconName = keyof typeof NAV_ICONS

export interface NavItem {
  label: string
  href: string
  icon?: NavIconName
}

/** Picks the single nav item that best matches the pathname (longest prefix wins). */
export function findActiveHref(pathname: string | null, items: NavItem[]) {
  if (!pathname) return null
  let best: string | null = null
  for (const item of items) {
    const match = pathname === item.href || pathname.startsWith(item.href + '/')
    if (match && (!best || item.href.length > best.length)) best = item.href
  }
  return best
}
