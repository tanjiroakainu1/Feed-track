import type { Order, Product, User, UserRole } from '../types'

export type ChatSurface =
  | 'home'
  | 'login'
  | 'register'
  | 'administrator'
  | 'inventory-staff'
  | 'sales-order-staff'
  | 'customer'

export interface QuickQuestion {
  id: string
  label: string
  prompt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  source?: 'local' | 'live-data' | 'wikipedia' | 'openai'
}

export interface ChatContext {
  surface: ChatSurface
  userName?: string
  userEmail?: string
  role?: UserRole
  roleTitle?: string
  currentPage?: string
  products: Product[]
  orders: Order[]
  users: User[]
  lowStockCount: number
  pendingOrders: number
}

export interface KnowledgeEntry {
  id: string
  keywords: string[]
  answer: string | ((ctx: ChatContext) => string)
  surfaces?: ChatSurface[]
  category: 'system' | 'role' | 'general' | 'world'
}
