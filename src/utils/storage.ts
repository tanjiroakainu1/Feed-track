const STORAGE_PREFIX = 'system13_'

export const STORAGE_KEYS = {
  products: `${STORAGE_PREFIX}products`,
  orders: `${STORAGE_PREFIX}orders`,
  users: `${STORAGE_PREFIX}users`,
  stockMovements: `${STORAGE_PREFIX}stock_movements`,
  notifications: `${STORAGE_PREFIX}notifications`,
} as const

export function loadStoredData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveStoredData<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}
