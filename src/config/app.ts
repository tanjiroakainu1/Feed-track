export const APP_NAME = 'Feed track'

export const APP_TAGLINE = 'Inventory forecasting & ordering for feeds supply stores'

export const APP_DESCRIPTION =
  'Manage products, orders, stock levels, and demand forecasts in one unified platform — built for Philippine feed stores with ₱ pricing.'

export const APP_DOCUMENT_TITLE = `${APP_NAME} — Feed Supply Management`
export const APP_HOME_TITLE = `${APP_NAME} — Home`

export const APP_ICON = '🌾'

export const DEVELOPER = {
  name: 'Raminder Jangao',
  role: 'Developer & System Architect',
  initials: 'RJ',
  tagline: 'Crafting smart feed supply management systems',
} as const

export const PLATFORM = {
  name: 'Feed track Platform',
  badge: '🌾 Feed Supply Platform',
  shortLabel: 'Platform',
  status: 'Live',
  description:
    'Access dashboards anytime, sync inventory and orders in real time, and scale your feeds supply store with smart forecasting and role-based workspaces.',
  pillars: [
    { label: 'Always online', icon: '🌐', detail: '24/7 access from any device' },
    { label: 'Real-time sync', icon: '⚡', detail: 'Orders, stock & alerts update instantly' },
    { label: 'Role-secure', icon: '🔐', detail: 'Encrypted role-based workspaces' },
    { label: 'PH-ready', icon: '🇵🇭', detail: 'Philippine Peso (₱) built-in' },
  ],
} as const

export const APP_FEATURES = [
  {
    label: 'Feed forecasting',
    icon: '📈',
    description: 'Weighted demand analysis, reorder points, and stockout risk in Philippine Peso (₱).',
  },
  {
    label: 'Order tracking',
    icon: '🚚',
    description: 'Customers and staff follow every order from placement to completion.',
  },
  {
    label: 'Role dashboards',
    icon: '🏪',
    description: 'Dedicated workspaces for admin, inventory, sales, and customer roles.',
  },
  {
    label: 'Smart alerts',
    icon: '🔔',
    description: 'Low-stock and order notifications routed to the right team instantly.',
  },
] as const

export const SYSTEM_FLOW = [
  {
    step: 1,
    title: 'Browse & place orders',
    description:
      'Customers explore the feed catalog, check stock availability, build a cart, and submit orders online.',
    icon: '🛒',
    accent: '#ca8a04',
    role: 'Customer',
  },
  {
    step: 2,
    title: 'Review & approve',
    description:
      'Sales staff inspect order details, approve or reject requests, and coordinate with inventory on availability.',
    icon: '✅',
    accent: '#d97706',
    role: 'Sales / Order Staff',
  },
  {
    step: 3,
    title: 'Fulfill & update stock',
    description:
      'Inventory staff process approved orders, record incoming/outgoing movements, and restock low items.',
    icon: '📦',
    accent: '#059669',
    role: 'Inventory Staff',
  },
  {
    step: 4,
    title: 'Forecast & alert',
    description:
      'The system forecasts demand, calculates reorder points, flags risks, and notifies the right roles.',
    icon: '🔮',
    accent: '#eab308',
    role: 'All roles',
  },
  {
    step: 5,
    title: 'Oversee & report',
    description:
      'Administrators manage products, users, orders, analytics, and export sales or forecast reports in ₱.',
    icon: '⚙️',
    accent: '#059669',
    role: 'Administrator',
  },
] as const

export const HOME_HIGHLIGHTS = [
  { label: 'Role dashboards', value: '4' },
  { label: 'Currency', value: '₱ PHP' },
  { label: 'Forecast window', value: '30 days' },
  { label: 'Always online', value: '24/7' },
] as const
