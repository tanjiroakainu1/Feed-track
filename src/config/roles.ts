import type { UserRole } from '../types'
import { ROLE_COLORS } from './theme'

export interface RoleConfig {
  role: UserRole
  title: string
  description: string
  color: string
  shortLabel: string
  path: string
}

export const ROLE_CONFIG: RoleConfig[] = [
  {
    role: 'administrator',
    title: 'Administrator',
    description: 'Manage feed products, users, orders, forecasting, and reports',
    color: ROLE_COLORS.administrator,
    shortLabel: 'Admin',
    path: '/administrator',
  },
  {
    role: 'inventory-staff',
    title: 'Inventory Staff',
    description: 'Update feed stock, monitor levels, and respond to alerts',
    color: ROLE_COLORS['inventory-staff'],
    shortLabel: 'Inventory',
    path: '/inventory-staff',
  },
  {
    role: 'sales-order-staff',
    title: 'Sales / Order Staff',
    description: 'Review, approve, and process feed supply orders',
    color: ROLE_COLORS['sales-order-staff'],
    shortLabel: 'Sales',
    path: '/sales-order-staff',
  },
  {
    role: 'customer',
    title: 'Customer',
    description: 'Browse feed products, place orders, and track delivery',
    color: ROLE_COLORS.customer,
    shortLabel: 'Customer',
    path: '/customer',
  },
]

export function getRolePath(role: UserRole): string {
  return ROLE_CONFIG.find((r) => r.role === role)?.path ?? '/'
}

export function getRoleConfig(role: UserRole): RoleConfig {
  return ROLE_CONFIG.find((r) => r.role === role)!
}

export function getRoleInitials(title: string): string {
  return title
    .split(/[\s/]+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
