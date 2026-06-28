import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { getRoleConfig } from '../config/roles'
import { useApp } from '../context/AppContext'
import type { ChatContext, ChatSurface } from '../chatbot/types'

function resolveSurface(pathname: string): ChatSurface {
  if (pathname === '/login') return 'login'
  if (pathname === '/register') return 'register'
  if (pathname.startsWith('/administrator')) return 'administrator'
  if (pathname.startsWith('/inventory-staff')) return 'inventory-staff'
  if (pathname.startsWith('/sales-order-staff')) return 'sales-order-staff'
  if (pathname.startsWith('/customer')) return 'customer'
  return 'home'
}

function resolveCurrentPage(pathname: string, surface: ChatSurface): string {
  const segments = pathname.split('/').filter(Boolean)
  if (surface === 'home' || surface === 'login' || surface === 'register') return surface
  return segments[segments.length - 1] ?? 'dashboard'
}

export function useChatContext(): ChatContext {
  const { pathname } = useLocation()
  const { currentUser, products, orders, users, getLowStockProducts } = useApp()

  return useMemo(() => {
    const surface = resolveSurface(pathname)
    const roleConfig = currentUser ? getRoleConfig(currentUser.role) : null

    return {
      surface,
      userName: currentUser?.name,
      userEmail: currentUser?.email,
      role: currentUser?.role,
      roleTitle: roleConfig?.title,
      currentPage: resolveCurrentPage(pathname, surface),
      products,
      orders,
      users,
      lowStockCount: getLowStockProducts().length,
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
    }
  }, [pathname, currentUser, products, orders, users, getLowStockProducts])
}
