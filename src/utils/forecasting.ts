import type { Order, Product, StockMovement } from '../types'

/** Default supplier lead time for feed restock (days). */
export const LEAD_TIME_DAYS = 7

/** Rolling window for demand analysis. */
export const FORECAST_WINDOW_DAYS = 30

/** Safety stock buffer expressed as days of average demand. */
export const SAFETY_STOCK_DAYS = 5

/** Target coverage when placing a reorder (days of supply). */
export const TARGET_COVERAGE_DAYS = 30

export type ForecastStatus = 'critical' | 'warning' | 'good'
export type ForecastTrend = 'rising' | 'falling' | 'stable'
export type ForecastConfidence = 'low' | 'medium' | 'high'

export interface ProductForecast {
  productId: string
  productName: string
  category: string
  currentStock: number
  lowStockThreshold: number
  price: number
  dailyDemand: number
  weeklyDemand: number
  monthlyDemand: number
  pipelineDemand: number
  effectiveStock: number
  daysRemaining: number
  safetyStock: number
  reorderPoint: number
  targetStock: number
  suggestedReorderQty: number
  estimatedReorderCost: number
  status: ForecastStatus
  trend: ForecastTrend
  trendPercent: number
  stockoutRisk: number
  confidence: ForecastConfidence
  dataPoints: number
  method: string
}

function daysAgo(dateStr: string, from: Date = new Date()) {
  const then = new Date(dateStr)
  return Math.max(0, (from.getTime() - then.getTime()) / (1000 * 60 * 60 * 24))
}

function decayWeight(ageDays: number, windowDays: number) {
  if (ageDays > windowDays) return 0
  return 1 - ageDays / (windowDays + 1)
}

function getMovementConsumption(
  movements: StockMovement[],
  productId: string,
  windowDays: number,
  type: 'recent' | 'prior' | 'all',
) {
  const now = new Date()
  let total = 0
  let weightSum = 0

  for (const movement of movements) {
    if (movement.productId !== productId || movement.type !== 'outgoing') continue

    const age = daysAgo(movement.recordedAt, now)
    if (age > windowDays * 2 && type !== 'all') continue

    const inRecent = age <= windowDays / 2
    const inPrior = age > windowDays / 2 && age <= windowDays

    if (type === 'recent' && !inRecent) continue
    if (type === 'prior' && !inPrior) continue
    if (type === 'all' && age > windowDays) continue

    const weight = decayWeight(age, windowDays)
    total += movement.quantity * weight
    weightSum += weight
  }

  return { total, weightSum }
}

function getOrderConsumption(
  orders: Order[],
  productId: string,
  windowDays: number,
  statuses: Order['status'][],
  slice: 'recent' | 'prior' | 'all',
) {
  const now = new Date()
  let total = 0
  let weightSum = 0

  for (const order of orders) {
    if (!statuses.includes(order.status)) continue

    const age = daysAgo(order.createdAt, now)
    if (age > windowDays * 2 && slice !== 'all') continue

    const inRecent = age <= windowDays / 2
    const inPrior = age > windowDays / 2 && age <= windowDays

    if (slice === 'recent' && !inRecent) continue
    if (slice === 'prior' && !inPrior) continue
    if (slice === 'all' && age > windowDays) continue

    const qty = order.items
      .filter((item) => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0)

    if (qty === 0) continue

    const weight = decayWeight(age, windowDays)
    total += qty * weight
    weightSum += weight
  }

  return { total, weightSum }
}

function pipelineDemand(orders: Order[], productId: string) {
  return orders
    .filter((o) => ['pending', 'approved', 'processing'].includes(o.status))
    .flatMap((o) => o.items)
    .filter((i) => i.productId === productId)
    .reduce((sum, i) => sum + i.quantity, 0)
}

function resolveTrend(recentRate: number, priorRate: number): { trend: ForecastTrend; trendPercent: number } {
  if (priorRate <= 0 && recentRate <= 0) return { trend: 'stable', trendPercent: 0 }
  if (priorRate <= 0) return { trend: 'rising', trendPercent: 100 }

  const change = ((recentRate - priorRate) / priorRate) * 100
  if (change > 10) return { trend: 'rising', trendPercent: Math.round(change) }
  if (change < -10) return { trend: 'falling', trendPercent: Math.round(Math.abs(change)) }
  return { trend: 'stable', trendPercent: Math.round(Math.abs(change)) }
}

function resolveConfidence(dataPoints: number): ForecastConfidence {
  if (dataPoints >= 6) return 'high'
  if (dataPoints >= 3) return 'medium'
  return 'low'
}

function resolveStatus(daysRemaining: number, currentStock: number, reorderPoint: number): ForecastStatus {
  if (currentStock <= 0 || daysRemaining <= LEAD_TIME_DAYS) return 'critical'
  if (currentStock <= reorderPoint || daysRemaining <= 14) return 'warning'
  return 'good'
}

function stockoutRiskPercent(daysRemaining: number, confidence: ForecastConfidence) {
  let base: number
  if (daysRemaining <= LEAD_TIME_DAYS) base = 85
  else if (daysRemaining <= 14) base = 55
  else if (daysRemaining <= 30) base = 25
  else base = 8

  if (confidence === 'low') base = Math.min(99, base + 15)
  if (confidence === 'high') base = Math.max(0, base - 8)

  return base
}

export function buildProductForecast(
  product: Product,
  orders: Order[],
  stockMovements: StockMovement[],
): ProductForecast {
  const movementAll = getMovementConsumption(stockMovements, product.id, FORECAST_WINDOW_DAYS, 'all')
  const orderCompleted = getOrderConsumption(
    orders,
    product.id,
    FORECAST_WINDOW_DAYS,
    ['completed', 'processing'],
    'all',
  )

  const movementRecent = getMovementConsumption(stockMovements, product.id, FORECAST_WINDOW_DAYS, 'recent')
  const movementPrior = getMovementConsumption(stockMovements, product.id, FORECAST_WINDOW_DAYS, 'prior')
  const orderRecent = getOrderConsumption(
    orders,
    product.id,
    FORECAST_WINDOW_DAYS,
    ['completed', 'processing'],
    'recent',
  )
  const orderPrior = getOrderConsumption(
    orders,
    product.id,
    FORECAST_WINDOW_DAYS,
    ['completed', 'processing'],
    'prior',
  )

  const dataPoints =
    stockMovements.filter((m) => m.productId === product.id && m.type === 'outgoing').length +
    orders.filter((o) =>
      ['completed', 'processing'].includes(o.status) &&
      o.items.some((i) => i.productId === product.id),
    ).length

  const weightedConsumption =
    movementAll.total + orderCompleted.total > 0
      ? movementAll.total + orderCompleted.total
      : product.lowStockThreshold * 0.5

  const dailyDemand = Math.max(weightedConsumption / FORECAST_WINDOW_DAYS, 0.1)
  const pipeline = pipelineDemand(orders, product.id)
  const effectiveStock = Math.max(product.stock - pipeline, 0)
  const daysRemaining = Math.floor(effectiveStock / dailyDemand)

  const safetyStock = Math.ceil(dailyDemand * SAFETY_STOCK_DAYS)
  const reorderPoint = Math.ceil(dailyDemand * LEAD_TIME_DAYS + safetyStock)
  const targetStock = Math.ceil(dailyDemand * TARGET_COVERAGE_DAYS + safetyStock)
  const suggestedReorderQty = Math.max(0, targetStock - product.stock)

  const recentRate =
    (movementRecent.total + orderRecent.total) / Math.max(movementRecent.weightSum + orderRecent.weightSum, 1)
  const priorRate =
    (movementPrior.total + orderPrior.total) / Math.max(movementPrior.weightSum + orderPrior.weightSum, 1)
  const { trend, trendPercent } = resolveTrend(recentRate, priorRate)
  const confidence = resolveConfidence(dataPoints)
  const status = resolveStatus(daysRemaining, product.stock, reorderPoint)
  const stockoutRisk = stockoutRiskPercent(daysRemaining, confidence)

  return {
    productId: product.id,
    productName: product.name,
    category: product.category,
    currentStock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    price: product.price,
    dailyDemand: Math.round(dailyDemand * 10) / 10,
    weeklyDemand: Math.round(dailyDemand * 7 * 10) / 10,
    monthlyDemand: Math.round(dailyDemand * 30 * 10) / 10,
    pipelineDemand: pipeline,
    effectiveStock,
    daysRemaining,
    safetyStock,
    reorderPoint,
    targetStock,
    suggestedReorderQty,
    estimatedReorderCost: suggestedReorderQty * product.price,
    status,
    trend,
    trendPercent,
    stockoutRisk,
    confidence,
    dataPoints,
    method: 'Weighted moving average + pipeline demand + safety stock (ROP)',
  }
}

export function buildForecasts(
  products: Product[],
  orders: Order[],
  stockMovements: StockMovement[],
): ProductForecast[] {
  return products
    .map((product) => buildProductForecast(product, orders, stockMovements))
    .sort((a, b) => {
      const rank = { critical: 0, warning: 1, good: 2 }
      if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status]
      return a.daysRemaining - b.daysRemaining
    })
}

export function getCriticalForecasts(forecasts: ProductForecast[], limit = 5) {
  return forecasts.filter((f) => f.status !== 'good').slice(0, limit)
}
