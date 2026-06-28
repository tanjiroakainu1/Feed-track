import { PageContainer } from '../../../components/PageContainer'
import { StatCard, StatGrid } from '../../../components/StatCard'
import {
  Card,
  CardHeader,
  EmptyState,
  StatusBadge,
  formatCurrency,
} from '../../../components/ui'
import {
  FORECAST_WINDOW_DAYS,
  LEAD_TIME_DAYS,
  buildForecasts,
  type ForecastConfidence,
  type ForecastTrend,
  type ProductForecast,
} from '../../../utils/forecasting'
import { useApp } from '../../../context/AppContext'

export function InventoryForecasting() {
  const { products, orders, stockMovements } = useApp()
  const forecasts = buildForecasts(products, orders, stockMovements)

  const critical = forecasts.filter((f) => f.status === 'critical').length
  const warning = forecasts.filter((f) => f.status === 'warning').length
  const reorderValue = forecasts.reduce((sum, f) => sum + f.estimatedReorderCost, 0)

  return (
    <PageContainer
      title="Inventory Forecasting"
      description={`Demand forecasting using weighted consumption, pipeline orders, safety stock, and reorder point (ROP) analysis over a ${FORECAST_WINDOW_DAYS}-day window.`}
    >
      <StatGrid>
        <StatCard label="Critical Items" value={critical} icon="alert" variant={critical > 0 ? 'warning' : 'success'} />
        <StatCard label="Watch List" value={warning} icon="alert" variant={warning > 0 ? 'warning' : 'default'} />
        <StatCard label="Products Tracked" value={forecasts.length} icon="product" variant="info" />
        <StatCard
          label="Est. Reorder Value"
          value={formatCurrency(reorderValue)}
          icon="money"
          trend="Suggested restock spend"
        />
      </StatGrid>

      <Card className="mb-6" padding="compact">
        <CardHeader
          title="Forecasting Method"
          subtitle={`Lead time: ${LEAD_TIME_DAYS} days · Weighted moving average + pipeline demand + safety stock buffer`}
        />
        <p className="text-sm leading-relaxed text-slate-600">
          Daily demand is calculated from outgoing stock movements and fulfilled orders with recent activity
          weighted higher. Pipeline demand from active orders reduces effective stock. Reorder suggestions target{' '}
          {FORECAST_WINDOW_DAYS} days of coverage plus safety stock. Amounts shown in Philippine Peso (₱).
        </p>
      </Card>

      {forecasts.length === 0 ? (
        <EmptyState message="No products available for forecasting." icon="chart" />
      ) : (
        <div className="space-y-4">
          {forecasts.map((forecast) => (
            <ForecastCard key={forecast.productId} forecast={forecast} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}

function ForecastCard({ forecast }: { forecast: ProductForecast }) {
  const stockPct = Math.min(100, (forecast.currentStock / Math.max(forecast.targetStock, 1)) * 100)
  const reorderPct = Math.min(100, (forecast.currentStock / Math.max(forecast.reorderPoint, 1)) * 100)

  return (
    <Card padding="compact" hover className={statusBorder(forecast.status)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-900">{forecast.productName}</h3>
            <StatusBadge status={forecast.status === 'good' ? 'active' : forecast.status} />
            <TrendBadge trend={forecast.trend} percent={forecast.trendPercent} />
            <ConfidenceBadge confidence={forecast.confidence} />
          </div>
          <p className="mt-1 text-sm text-slate-500">{forecast.category}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-extrabold text-slate-900">{forecast.daysRemaining}d</p>
          <p className="text-xs font-semibold text-slate-500">until stockout</p>
          <p className="mt-1 text-xs font-bold text-rose-600">{forecast.stockoutRisk}% risk</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 xs:gap-3 min-[480px]:grid-cols-3 lg:grid-cols-6">
        <Metric label="Daily demand" value={`${forecast.dailyDemand} u/d`} />
        <Metric label="Weekly demand" value={`${forecast.weeklyDemand} u/w`} />
        <Metric label="Pipeline" value={`${forecast.pipelineDemand} u`} />
        <Metric label="Effective stock" value={`${forecast.effectiveStock} u`} />
        <Metric label="Reorder point" value={`${forecast.reorderPoint} u`} />
        <Metric label="Safety stock" value={`${forecast.safetyStock} u`} />
      </div>

      <div className="mt-4 space-y-3">
        <ProgressBar
          label="Stock vs target coverage"
          value={stockPct}
          tone={forecast.status === 'critical' ? 'danger' : forecast.status === 'warning' ? 'warning' : 'success'}
          caption={`${forecast.currentStock} / ${forecast.targetStock} units`}
        />
        <ProgressBar
          label="Stock vs reorder point"
          value={reorderPct}
          tone={forecast.currentStock <= forecast.reorderPoint ? 'danger' : 'success'}
          caption={`${forecast.currentStock} / ${forecast.reorderPoint} units (ROP)`}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">
            Suggested reorder: {forecast.suggestedReorderQty} units
          </p>
          <p className="text-sm text-slate-600">
            Est. cost: {formatCurrency(forecast.estimatedReorderCost)} · {forecast.dataPoints} data points
          </p>
        </div>
        {forecast.suggestedReorderQty > 0 && (
          <span className="inline-flex w-fit rounded-full bg-stone-50 px-3 py-1 text-xs font-bold text-stone-700 ring-1 ring-stone-200/60">
            Restock recommended
          </span>
        )}
      </div>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-[11px]">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-slate-900">{value}</p>
    </div>
  )
}

function ProgressBar({
  label,
  value,
  tone,
  caption,
}: {
  label: string
  value: number
  tone: 'success' | 'warning' | 'danger'
  caption: string
}) {
  const colors = {
    success: 'bg-stone-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
  }

  return (
    <div>
      <div className="mb-1 flex flex-col gap-0.5 xs:flex-row xs:items-center xs:justify-between xs:gap-2 text-xs">
        <span className="font-semibold text-slate-600">{label}</span>
        <span className="break-words text-slate-500">{caption}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full transition-all ${colors[tone]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function TrendBadge({ trend, percent }: { trend: ForecastTrend; percent: number }) {
  const styles = {
    rising: 'bg-rose-50 text-rose-700 ring-rose-200/60',
    falling: 'bg-stone-50 text-stone-700 ring-stone-200/60',
    stable: 'bg-slate-100 text-slate-600 ring-slate-200/60',
  }
  const icons = { rising: '↑', falling: '↓', stable: '→' }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset ${styles[trend]}`}>
      {icons[trend]} {trend}{percent > 0 ? ` ${percent}%` : ''}
    </span>
  )
}

function ConfidenceBadge({ confidence }: { confidence: ForecastConfidence }) {
  const labels = { low: 'Low confidence', medium: 'Medium confidence', high: 'High confidence' }
  return (
    <span className="rounded-full bg-stone-50 px-2 py-0.5 text-[11px] font-semibold text-stone-700 ring-1 ring-stone-200/60">
      {labels[confidence]}
    </span>
  )
}

function statusBorder(status: ProductForecast['status']) {
  if (status === 'critical') return 'border-rose-200'
  if (status === 'warning') return 'border-amber-200'
  return ''
}
