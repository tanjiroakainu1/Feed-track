import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getRolePath } from '../config/roles'
import {
  initialNotifications,
  initialOrders,
  initialProducts,
  initialStockMovements,
  initialUsers,
} from '../data/mockData'
import type {
  AuthResult,
  Notification,
  Order,
  OrderStatus,
  Product,
  ReportSummary,
  StockMovement,
  User,
  UserRole,
} from '../types'
import { getNotificationsForUser } from '../utils/notifications'
import { loadStoredData, saveStoredData, STORAGE_KEYS } from '../utils/storage'

const AUTH_STORAGE_KEY = 'system13_auth_user_id'

interface AppContextValue {
  currentUser: User | null
  isAuthenticated: boolean
  currentRole: UserRole | null
  products: Product[]
  orders: Order[]
  users: User[]
  stockMovements: StockMovement[]
  notifications: Notification[]
  reportSummary: ReportSummary
  login: (email: string, password: string) => AuthResult
  register: (data: {
    name: string
    email: string
    password: string
    role: UserRole
  }) => AuthResult
  logout: () => void
  quickLoginAsRole: (role: UserRole) => AuthResult
  getUserNotifications: () => Notification[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  updateStock: (productId: string, quantity: number, reason: string, recordedBy: string) => void
  recordStockMovement: (
    movement: Omit<StockMovement, 'id' | 'recordedAt'>,
  ) => void
  addUser: (user: Omit<User, 'id'>) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void
  approveOrder: (orderId: string) => void
  rejectOrder: (orderId: string, reason?: string) => void
  processOrder: (orderId: string) => void
  completeOrder: (orderId: string) => void
  placeOrder: (
    customerName: string,
    customerEmail: string,
    items: { productId: string; quantity: number }[],
  ) => void
  markNotificationRead: (id: string) => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  getLowStockProducts: () => Product[]
  getCustomerOrders: (email: string) => Order[]
}

const AppContext = createContext<AppContextValue | null>(null)

const generateId = (prefix: string) =>
  `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>(() =>
    loadStoredData(STORAGE_KEYS.products, initialProducts),
  )
  const [orders, setOrders] = useState<Order[]>(() =>
    loadStoredData(STORAGE_KEYS.orders, initialOrders),
  )
  const [users, setUsers] = useState<User[]>(() =>
    loadStoredData(STORAGE_KEYS.users, initialUsers),
  )
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() =>
    loadStoredData(STORAGE_KEYS.stockMovements, initialStockMovements),
  )
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    loadStoredData(STORAGE_KEYS.notifications, initialNotifications),
  )

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.products, products)
  }, [products])

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.orders, orders)
  }, [orders])

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.users, users)
  }, [users])

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.stockMovements, stockMovements)
  }, [stockMovements])

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.notifications, notifications)
  }, [notifications])

  useEffect(() => {
    const storedId = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!storedId || currentUser) return
    const storedUser = users.find((u) => u.id === storedId && u.active)
    if (storedUser) {
      setCurrentUser(storedUser)
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [users, currentUser])

  useEffect(() => {
    if (!currentUser) return
    const freshUser = users.find((u) => u.id === currentUser.id)
    if (!freshUser || !freshUser.active) {
      setCurrentUser(null)
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } else if (freshUser !== currentUser) {
      setCurrentUser(freshUser)
    }
  }, [users, currentUser])

  const setAuthenticatedUser = useCallback((user: User | null) => {
    setCurrentUser(user)
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, user.id)
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [])

  const login = useCallback(
    (email: string, password: string): AuthResult => {
      const normalizedEmail = email.trim().toLowerCase()
      const user = users.find(
        (u) => u.email.toLowerCase() === normalizedEmail && u.password === password,
      )

      if (!user) {
        return { success: false, error: 'Invalid email or password.' }
      }

      if (!user.active) {
        return { success: false, error: 'This account has been deactivated.' }
      }

      setAuthenticatedUser(user)
      return { success: true, user }
    },
    [users, setAuthenticatedUser],
  )

  const register = useCallback(
    (data: {
      name: string
      email: string
      password: string
      role: UserRole
    }): AuthResult => {
      const normalizedEmail = data.email.trim().toLowerCase()
      const normalizedName = data.name.trim()

      if (!normalizedName || !normalizedEmail || !data.password) {
        return { success: false, error: 'All fields are required.' }
      }

      if (data.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' }
      }

      if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
        return { success: false, error: 'An account with this email already exists.' }
      }

      const newUser: User = {
        id: generateId('u'),
        name: normalizedName,
        email: normalizedEmail,
        password: data.password,
        role: data.role,
        active: true,
      }

      setUsers((prev) => [...prev, newUser])
      setAuthenticatedUser(newUser)
      return { success: true, user: newUser }
    },
    [users, setAuthenticatedUser],
  )

  const logout = useCallback(() => {
    setAuthenticatedUser(null)
  }, [setAuthenticatedUser])

  const quickLoginAsRole = useCallback(
    (role: UserRole): AuthResult => {
      const user = users.find((entry) => entry.role === role && entry.active)

      if (!user) {
        return { success: false, error: 'No active account is registered for this role.' }
      }

      setAuthenticatedUser(user)
      return { success: true, user }
    },
    [users, setAuthenticatedUser],
  )

  const getUserNotifications = useCallback(
    () => getNotificationsForUser(notifications, currentUser),
    [notifications, currentUser],
  )

  const getLowStockProducts = useCallback(
    () => products.filter((p) => p.stock <= p.lowStockThreshold),
    [products],
  )

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
      setNotifications((prev) => [
        {
          ...notification,
          id: generateId('n'),
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ])
    },
    [],
  )

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    setProducts((prev) => [...prev, { ...product, id: generateId('p') }])
  }, [])

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const recordStockMovement = useCallback(
    (movement: Omit<StockMovement, 'id' | 'recordedAt'>) => {
      setStockMovements((prev) => [
        {
          ...movement,
          id: generateId('sm'),
          recordedAt: new Date().toISOString(),
        },
        ...prev,
      ])
    },
    [],
  )

  const updateStock = useCallback(
    (productId: string, quantity: number, reason: string, recordedBy: string) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== productId) return p
          const newStock = Math.max(0, p.stock + quantity)
          return { ...p, stock: newStock }
        }),
      )

      const product = products.find((p) => p.id === productId)
      if (product) {
        recordStockMovement({
          productId,
          productName: product.name,
          type: quantity >= 0 ? 'incoming' : 'outgoing',
          quantity: Math.abs(quantity),
          reason,
          recordedBy,
        })

        const updatedStock = Math.max(0, product.stock + quantity)
        if (updatedStock <= product.lowStockThreshold) {
          addNotification({
            title: 'Low Stock Alert',
            message: `${product.name} is below threshold (${updatedStock} remaining)`,
            type: 'warning',
            targetRole: 'administrator',
          })
          addNotification({
            title: 'Low Stock Alert',
            message: `${product.name} needs restocking (${updatedStock} remaining)`,
            type: 'warning',
            targetRole: 'inventory-staff',
          })
        }
      }
    },
    [products, recordStockMovement, addNotification],
  )

  const addUser = useCallback((user: Omit<User, 'id'>) => {
    setUsers((prev) => [...prev, { ...user, id: generateId('u') }])
  }, [])

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)))
  }, [])

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus, notes?: string) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status, notes: notes ?? o.notes, updatedAt: new Date().toISOString() }
            : o,
        ),
      )
    },
    [],
  )

  const approveOrder = useCallback(
    (orderId: string) => {
      updateOrderStatus(orderId, 'approved')
      const order = orders.find((o) => o.id === orderId)
      if (order) {
        addNotification({
          title: 'Order Approved',
          message: `Your order #${orderId} has been approved`,
          type: 'success',
          targetRole: 'customer',
          targetUserEmail: order.customerEmail,
        })
      }
    },
    [updateOrderStatus, orders, addNotification],
  )

  const rejectOrder = useCallback(
    (orderId: string, reason?: string) => {
      updateOrderStatus(orderId, 'rejected', reason)
      const order = orders.find((o) => o.id === orderId)
      addNotification({
        title: 'Order Rejected',
        message: `Order #${orderId} was rejected${reason ? `: ${reason}` : ''}`,
        type: 'error',
        targetRole: 'customer',
        targetUserEmail: order?.customerEmail,
      })
    },
    [updateOrderStatus, orders, addNotification],
  )

  const processOrder = useCallback(
    (orderId: string) => {
      updateOrderStatus(orderId, 'processing')
      const order = orders.find((o) => o.id === orderId)
      const staffName = currentUser?.name ?? 'Sales Staff'
      if (order) {
        order.items.forEach((item) => {
          updateStock(item.productId, -item.quantity, `Order #${orderId} fulfillment`, staffName)
        })
        addNotification({
          title: 'Order Processing',
          message: `Order #${orderId} is now being processed`,
          type: 'info',
          targetRole: 'customer',
          targetUserEmail: order.customerEmail,
        })
      }
    },
    [updateOrderStatus, orders, updateStock, addNotification, currentUser],
  )

  const completeOrder = useCallback(
    (orderId: string) => {
      updateOrderStatus(orderId, 'completed')
      const order = orders.find((o) => o.id === orderId)
      addNotification({
        title: 'Order Completed',
        message: `Order #${orderId} has been completed and shipped`,
        type: 'success',
        targetRole: 'customer',
        targetUserEmail: order?.customerEmail,
      })
    },
    [updateOrderStatus, orders, addNotification],
  )

  const placeOrder = useCallback(
    (
      customerName: string,
      customerEmail: string,
      items: { productId: string; quantity: number }[],
    ) => {
      const orderItems = items.map((item) => {
        const product = products.find((p) => p.id === item.productId)!
        return {
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
        }
      })
      const total = orderItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      )
      const orderId = generateId('o')
      const newOrder: Order = {
        id: orderId,
        customerName,
        customerEmail,
        items: orderItems,
        status: 'pending',
        total,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setOrders((prev) => [newOrder, ...prev])
      addNotification({
        title: 'New Order',
        message: `New order #${orderId} from ${customerName}`,
        type: 'info',
        targetRole: 'sales-order-staff',
      })
      addNotification({
        title: 'Order Placed',
        message: `Your order #${orderId} has been placed successfully`,
        type: 'success',
        targetRole: 'customer',
        targetUserEmail: customerEmail,
      })
    },
    [products, addNotification],
  )

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }, [])

  const getCustomerOrders = useCallback(
    (email: string) => orders.filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase()),
    [orders],
  )

  const reportSummary = useMemo<ReportSummary>(() => {
    const completedOrders = orders.filter((o) => o.status === 'completed')
    return {
      totalSales: completedOrders.reduce((sum, o) => sum + o.total, 0),
      totalOrders: orders.length,
      lowStockCount: getLowStockProducts().length,
      activeUsers: users.filter((u) => u.active).length,
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
    }
  }, [orders, users, getLowStockProducts])

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      currentRole: currentUser?.role ?? null,
      products,
      orders,
      users,
      stockMovements,
      notifications,
      reportSummary,
      login,
      register,
      logout,
      quickLoginAsRole,
      getUserNotifications,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      recordStockMovement,
      addUser,
      updateUser,
      deleteUser,
      updateOrderStatus,
      approveOrder,
      rejectOrder,
      processOrder,
      completeOrder,
      placeOrder,
      markNotificationRead,
      addNotification,
      getLowStockProducts,
      getCustomerOrders,
    }),
    [
      currentUser,
      products,
      orders,
      users,
      stockMovements,
      notifications,
      reportSummary,
      login,
      register,
      logout,
      quickLoginAsRole,
      getUserNotifications,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      recordStockMovement,
      addUser,
      updateUser,
      deleteUser,
      updateOrderStatus,
      approveOrder,
      rejectOrder,
      processOrder,
      completeOrder,
      placeOrder,
      markNotificationRead,
      addNotification,
      getLowStockProducts,
      getCustomerOrders,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

export { getRolePath }
