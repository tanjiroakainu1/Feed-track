export type UserRole =
  | 'administrator'
  | 'inventory-staff'
  | 'sales-order-staff'
  | 'customer'

export type OrderStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'processing'
  | 'completed'
  | 'cancelled'

export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  lowStockThreshold: number
  description: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  status: OrderStatus
  total: number
  createdAt: string
  updatedAt: string
  notes?: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  active: boolean
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
}

export interface StockMovement {
  id: string
  productId: string
  productName: string
  type: 'incoming' | 'outgoing'
  quantity: number
  reason: string
  recordedBy: string
  recordedAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  read: boolean
  createdAt: string
  targetRole?: UserRole
  targetUserEmail?: string
}

export interface ReportSummary {
  totalSales: number
  totalOrders: number
  lowStockCount: number
  activeUsers: number
  pendingOrders: number
}
