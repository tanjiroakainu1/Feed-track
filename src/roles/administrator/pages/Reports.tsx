import { useState } from 'react'
import { PageContainer } from '../../../components/PageContainer'
import { ActionButton, Card, CardHeader, formatCurrency } from '../../../components/ui'
import { useApp } from '../../../context/AppContext'
import { buildForecasts } from '../../../utils/forecasting'

export function Reports() {
  const { reportSummary, orders, products, users, stockMovements, getLowStockProducts } = useApp()
  const [generated, setGenerated] = useState<string | null>(null)

  const generateReport = (type: string) => {
    const timestamp = new Date().toLocaleString('en-PH')
    let content = ''

    switch (type) {
      case 'sales':
        content = `Sales Report — ${timestamp}\nCurrency: PHP (₱)\nTotal Sales: ${formatCurrency(reportSummary.totalSales)}\nTotal Orders: ${reportSummary.totalOrders}\nPending: ${reportSummary.pendingOrders}`
        break
      case 'inventory':
        content = `Inventory Report — ${timestamp}\nTotal Products: ${products.length}\nLow Stock: ${getLowStockProducts().length}\n${getLowStockProducts().map((p) => `- ${p.name}: ${p.stock} units @ ${formatCurrency(p.price)}`).join('\n')}`
        break
      case 'forecast':
        content = `Forecast Report — ${timestamp}\nCurrency: PHP (₱)\n${buildForecasts(products, orders, stockMovements)
          .map(
            (f) =>
              `- ${f.productName}\n  Status: ${f.status} | ${f.daysRemaining}d left | Risk: ${f.stockoutRisk}%\n  Daily demand: ${f.dailyDemand} u | Reorder: ${f.suggestedReorderQty} u (${formatCurrency(f.estimatedReorderCost)})`,
          )
          .join('\n')}`
        break
      case 'users':
        content = `Users Report — ${timestamp}\nActive Users: ${reportSummary.activeUsers}\n${users.map((u) => `- ${u.name} (${u.role})`).join('\n')}`
        break
      case 'orders':
        content = `Orders Report — ${timestamp}\nCurrency: PHP (₱)\n${orders.map((o) => `#${o.id} | ${o.customerName} | ${o.status} | ${formatCurrency(o.total)}`).join('\n')}`
        break
    }

    setGenerated(content)
  }

  const downloadReport = () => {
    if (!generated) return
    const blob = new Blob([generated], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `feedtrack-report-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PageContainer
      title="Generate Reports"
      description="Create and export business reports. All monetary values in Philippine Peso (₱)."
    >
      <div className="mb-6 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <ReportButton label="Sales Report" icon="💰" onClick={() => generateReport('sales')} />
        <ReportButton label="Inventory Report" icon="📦" onClick={() => generateReport('inventory')} />
        <ReportButton label="Forecast Report" icon="🔮" onClick={() => generateReport('forecast')} />
        <ReportButton label="Users Report" icon="👥" onClick={() => generateReport('users')} />
        <ReportButton label="Orders Report" icon="📋" onClick={() => generateReport('orders')} />
      </div>

      {generated && (
        <Card>
          <CardHeader
            title="Report Preview"
            action={<ActionButton size="sm" onClick={downloadReport}>Download Report</ActionButton>}
          />
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-xs text-slate-700 sm:text-sm">
            {generated}
          </pre>
        </Card>
      )}
    </PageContainer>
  )
}

function ReportButton({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-base group min-h-[5rem] w-full rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm shadow-slate-200/40 transition-all duration-200 hover:-translate-y-1 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-100/80 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-500/25 sm:min-h-[5.5rem] sm:p-5"
    >
      <span className="text-xl transition-transform duration-200 group-hover:scale-110 sm:text-2xl">{icon}</span>
      <p className="mt-2 text-sm font-bold text-slate-900">{label}</p>
      <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">Tap to generate</p>
    </button>
  )
}
