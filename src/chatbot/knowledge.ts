import {
  APP_DESCRIPTION,
  APP_FEATURES,
  APP_NAME,
  APP_TAGLINE,
  PLATFORM,
  SYSTEM_FLOW,
} from '../config/app'
import { ROLE_CONFIG } from '../config/roles'
import { formatCurrency } from '../utils/currency'
import {
  FORECAST_WINDOW_DAYS,
  LEAD_TIME_DAYS,
  SAFETY_STOCK_DAYS,
  TARGET_COVERAGE_DAYS,
} from '../utils/forecasting'
import type { KnowledgeEntry } from './types'

function roleList() {
  return ROLE_CONFIG.map(
    (r) => `• **${r.title}** (${r.shortLabel}) — ${r.description}. Path: \`${r.path}\``,
  ).join('\n')
}

function systemFlow() {
  return SYSTEM_FLOW.map(
    (s) => `${s.step}. **${s.title}** (${s.role}) — ${s.description}`,
  ).join('\n')
}

function featureList() {
  return APP_FEATURES.map((f) => `• **${f.label}** — ${f.description}`).join('\n')
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: 'what-is-feed-track',
    keywords: ['what is feed track', 'feed track', 'about', 'platform', 'overview', 'system'],
    category: 'system',
    answer: `**${APP_NAME}** is ${APP_TAGLINE.toLowerCase()}.\n\n${APP_DESCRIPTION}\n\n**Core pillars:**\n${PLATFORM.pillars.map((p) => `• ${p.label} — ${p.detail}`).join('\n')}\n\n**Key features:**\n${featureList()}`,
  },
  {
    id: 'roles',
    keywords: ['role', 'roles', 'four roles', 'administrator', 'inventory', 'sales', 'customer', 'who can'],
    category: 'system',
    answer: `Feed track has **4 role-based workspaces**:\n\n${roleList()}\n\nEach role sees a dedicated dashboard, navigation, and permissions. Switch roles via **Quick Role Access** on login (demo accounts) or the sidebar switcher when logged in.`,
  },
  {
    id: 'forecasting',
    keywords: ['forecast', 'forecasting', 'reorder', 'demand', 'safety stock', 'reorder point', 'rop', 'stockout'],
    category: 'system',
    answer: `Feed track uses a **weighted moving average** forecasting engine:\n\n• **Window:** ${FORECAST_WINDOW_DAYS}-day rolling demand analysis\n• **Lead time:** ${LEAD_TIME_DAYS} days supplier restock\n• **Safety stock:** ${SAFETY_STOCK_DAYS} days of average demand\n• **Target coverage:** ${TARGET_COVERAGE_DAYS} days when reordering\n\n**Formulas:**\n• Daily demand = weighted consumption ÷ ${FORECAST_WINDOW_DAYS}\n• Safety stock = daily demand × ${SAFETY_STOCK_DAYS}\n• Reorder point = (daily demand × ${LEAD_TIME_DAYS}) + safety stock\n• Suggested reorder = target stock − current stock\n\n**Status levels:** Critical · Warning · Good\n\n**Trends:** Rising / Falling / Stable based on recent vs prior demand.`,
  },
  {
    id: 'order-lifecycle',
    keywords: ['order lifecycle', 'order flow', 'order process', 'how orders work', 'fulfillment'],
    category: 'system',
    answer: `**Order lifecycle in Feed track:**\n\n${systemFlow()}\n\n**Order statuses:**\n• **Pending** — awaiting sales review\n• **Approved** — sales confirmed, inventory notified\n• **Rejected** — declined with reason\n• **Processing** — inventory fulfilling\n• **Completed** — delivered / picked up\n• **Cancelled** — voided`,
  },
  {
    id: 'currency',
    keywords: ['peso', 'php', '₱', 'currency', 'pricing', 'philippine'],
    category: 'system',
    answer: `Feed track is **Philippine Peso (₱) ready**. All product prices, order totals, analytics, and reports display in PHP.\n\nExample: Layer Pellets 50kg = ${formatCurrency(1850)}.\n\nReports and dashboards aggregate sales in ₱ for easy accounting at PH feed stores.`,
  },
  {
    id: 'login',
    keywords: ['sign in', 'login', 'log in', 'how to login'],
    category: 'system',
    surfaces: ['home', 'login', 'register'],
    answer: `**To sign in:**\n1. Go to **Sign In** from the home page or header\n2. Enter your email and password\n3. You'll land on your role dashboard automatically\n\n**Quick Role Access:** On the login page, tap any role card to instantly sign in with a demo account for that role.`,
  },
  {
    id: 'register',
    keywords: ['register', 'sign up', 'create account', 'new account'],
    category: 'system',
    surfaces: ['home', 'login', 'register'],
    answer: `**To register:**\n1. Click **Get Started** or **Register**\n2. Fill in name, email, password\n3. Choose your role (Admin, Inventory, Sales, or Customer)\n4. Submit — you'll be logged in immediately\n\nPick the role that matches your job: store owner → Admin, warehouse → Inventory, front desk → Sales, buyer → Customer.`,
  },
  {
    id: 'demo-accounts',
    keywords: ['demo', 'demo account', 'test account', 'quick access', 'sample login'],
    category: 'system',
    surfaces: ['login', 'home'],
    answer: (ctx) => {
      const accounts = ctx.users
        .filter((u) => u.active)
        .map((u) => {
          const role = ROLE_CONFIG.find((r) => r.role === u.role)
          return `• **${role?.title}** — ${u.email} (password: \`password123\`)`
        })
        .join('\n')
      return `**Demo accounts for quick login:**\n\n${accounts}\n\nOn the login page, use **Quick Role Access** cards to sign in instantly without typing credentials.`
    },
  },
  {
    id: 'alerts',
    keywords: ['alert', 'notification', 'low stock', 'smart alert'],
    category: 'system',
    answer: `Feed track sends **smart alerts** to the right roles:\n\n• **Low stock warnings** → Inventory Staff & Administrator\n• **New pending orders** → Sales / Order Staff\n• **Order status updates** → Customer\n• **Critical stockout risk** → Inventory & Admin\n\nAlerts appear in each role's notification panel and dashboard badges.`,
  },
  {
    id: 'products-catalog',
    keywords: ['products', 'catalog', 'feed products', 'what can i buy', 'inventory list'],
    category: 'system',
    answer: (ctx) => {
      const list = ctx.products
        .map(
          (p) =>
            `• **${p.name}** (${p.category}) — ${formatCurrency(p.price)} · Stock: ${p.stock} · ${p.description}`,
        )
        .join('\n')
      return `**Current feed catalog (${ctx.products.length} products):**\n\n${list}`
    },
  },
  {
    id: 'live-stats',
    keywords: ['live stats', 'stats now', 'current stats', 'system stats', 'how many'],
    category: 'system',
    answer: (ctx) => {
      const completed = ctx.orders.filter((o) => o.status === 'completed')
      const totalSales = completed.reduce((s, o) => s + o.total, 0)
      return `**Live system snapshot:**\n\n• Products: **${ctx.products.length}**\n• Total orders: **${ctx.orders.length}**\n• Pending orders: **${ctx.pendingOrders}**\n• Low stock items: **${ctx.lowStockCount}**\n• Active users: **${ctx.users.filter((u) => u.active).length}**\n• Completed sales: **${formatCurrency(totalSales)}**\n• Active role: **${ctx.roleTitle ?? 'Guest'}**`
    },
  },
  {
    id: 'low-stock-now',
    keywords: ['low stock', 'critical', 'critically low', 'critical items', 'running out', 'stockout', 'which products low'],
    category: 'system',
    answer: (ctx) => {
      const low = ctx.products.filter((p) => p.stock <= p.lowStockThreshold)
      if (low.length === 0) return 'All products are above their low-stock thresholds right now!'
      const list = low
        .map(
          (p) =>
            `• **${p.name}** — ${p.stock} left (threshold: ${p.lowStockThreshold}) ${p.stock <= p.lowStockThreshold / 2 ? '[Critical]' : '[Warning]'}`,
        )
        .join('\n')
      return `**${low.length} low-stock product(s):**\n\n${list}\n\nInventory staff should review the **Forecasting** page for reorder quantities.`
    },
  },
  {
    id: 'pending-orders',
    keywords: ['pending orders', 'pending', 'awaiting approval', 'new orders'],
    category: 'system',
    answer: (ctx) => {
      const pending = ctx.orders.filter((o) => o.status === 'pending')
      if (pending.length === 0) return 'No pending orders right now — all caught up!'
      const list = pending
        .map(
          (o) =>
            `• **${o.id}** — ${o.customerName} · ${formatCurrency(o.total)} · ${o.items.length} item(s)`,
        )
        .join('\n')
      return `**${pending.length} pending order(s):**\n\n${list}\n\nSales staff can review these on the **Review Orders** page.`
    },
  },
  // Admin-specific
  {
    id: 'admin-dashboard',
    keywords: ['admin dashboard', 'administrator dashboard', 'admin overview'],
    category: 'role',
    surfaces: ['administrator'],
    answer: `**Administrator dashboard** gives you:\n\n• System-wide KPIs (sales, orders, users, low stock)\n• Quick links to Products, Users, Orders, Reports\n• Low stock notification summary\n• Sales trend overview\n\nNavigate via sidebar: Dashboard · Products · Analytics · Low Stock · Users · Orders · Reports.`,
  },
  {
    id: 'admin-products',
    keywords: ['manage products', 'add product', 'edit product', 'delete product'],
    category: 'role',
    surfaces: ['administrator'],
    answer: `**Manage Products** (Admin → Products):\n\n• **Add** — name, category, ₱ price, stock, low-stock threshold, description\n• **Edit** — update any field inline\n• **Delete** — remove discontinued feeds\n\nCategories include Poultry, Cattle, Swine, Goat Feed, and Supplements.`,
  },
  {
    id: 'admin-users',
    keywords: ['user management', 'manage users', 'add user', 'deactivate'],
    category: 'role',
    surfaces: ['administrator'],
    answer: `**User Management** (Admin → Users):\n\n• View all accounts across 4 roles\n• Add new staff or customer accounts\n• Edit name, email, role, active status\n• Deactivate users without deleting history\n\nOnly administrators can manage user accounts.`,
  },
  {
    id: 'admin-reports',
    keywords: ['reports', 'export', 'analytics', 'sales report'],
    category: 'role',
    surfaces: ['administrator'],
    answer: `**Reports & Analytics:**\n\n• **Sales Analytics** — revenue trends, top products, order volume in ₱\n• **Reports** — export-ready summaries of sales, inventory, and forecasts\n• **Order Oversight** — full pipeline view of all orders\n\nAll monetary values in Philippine Peso (₱).`,
  },
  // Inventory-specific
  {
    id: 'inv-update-stock',
    keywords: ['update stock', 'adjust stock', 'change quantity'],
    category: 'role',
    surfaces: ['inventory-staff'],
    answer: `**Update Stock** (Inventory → Update Stock):\n\n1. Select a feed product\n2. Enter new quantity or adjustment\n3. Add a reason (restock, correction, damage, etc.)\n4. Save — stock syncs across all roles instantly\n\nUse **Record In/Out** for detailed movement logging.`,
  },
  {
    id: 'inv-record',
    keywords: ['record in', 'record out', 'incoming', 'outgoing', 'movement'],
    category: 'role',
    surfaces: ['inventory-staff'],
    answer: `**Record In/Out** logs every stock movement:\n\n• **Incoming** — supplier delivery, returns, transfers in\n• **Outgoing** — sales fulfillment, samples, damage, transfers out\n\nEach entry records quantity, reason, who recorded it, and timestamp. Movements feed the forecasting engine.`,
  },
  {
    id: 'inv-forecasting-page',
    keywords: ['forecasting page', 'reorder suggestion', 'inventory forecasting'],
    category: 'role',
    surfaces: ['inventory-staff', 'administrator'],
    answer: `**Inventory Forecasting** shows per-product:\n\n• Daily / weekly / monthly demand\n• Days of stock remaining\n• Reorder point & suggested reorder qty\n• Stockout risk % and trend (rising / falling / stable)\n• Estimated reorder cost in ₱\n\nSort by status: Critical first, then Warning, then Good.`,
  },
  // Sales-specific
  {
    id: 'sales-review',
    keywords: ['review orders', 'inspect order'],
    category: 'role',
    surfaces: ['sales-order-staff'],
    answer: `**Review Orders** (Sales → Review Orders):\n\nSee all incoming customer orders with items, totals in ₱, and customer details. Check stock availability before approving.`,
  },
  {
    id: 'sales-approve',
    keywords: ['approve', 'reject', 'approval'],
    category: 'role',
    surfaces: ['sales-order-staff'],
    answer: `**Approve / Reject Orders:**\n\n• **Approve** when stock is available and order is valid → moves to Approved, notifies Inventory\n• **Reject** with optional reason → customer notified\n\nCheck **Inventory Coordination** if stock is tight before approving large orders.`,
  },
  {
    id: 'sales-status',
    keywords: ['update status', 'order status', 'processing', 'completed'],
    category: 'role',
    surfaces: ['sales-order-staff'],
    answer: `**Order status pipeline:**\n\nPending → Approved → Processing → Completed\n\nSales staff can update status on the **Update Status** page. **Process Orders** handles batch fulfillment workflows.`,
  },
  // Customer-specific
  {
    id: 'cust-browse',
    keywords: ['browse', 'catalog', 'shop', 'products available'],
    category: 'role',
    surfaces: ['customer'],
    answer: `**Browse Products** (Customer → Browse):\n\nView all feed products with category, ₱ price, stock availability, and descriptions. Out-of-stock items are marked so you know before ordering.`,
  },
  {
    id: 'cust-order',
    keywords: ['place order', 'how to order', 'buy', 'cart', 'checkout'],
    category: 'role',
    surfaces: ['customer'],
    answer: `**Place Order:**\n\n1. Go to **Browse** or **Place Order**\n2. Add feeds to your cart (adjust quantities)\n3. Review total in ₱\n4. Submit — order goes to **Pending** for sales review\n5. Track progress on **Track Order** and **Updates**`,
  },
  {
    id: 'cust-track',
    keywords: ['track order', 'order status', 'where is my order', 'delivery'],
    category: 'role',
    surfaces: ['customer'],
    answer: `**Track Order** shows real-time status:\n\n• **Pending** — under review\n• **Approved** — confirmed\n• **Processing** — being prepared\n• **Completed** — ready / delivered\n• **Rejected / Cancelled** — declined or voided\n\nCheck **Order Updates** for notification history.`,
  },
  // General / world knowledge
  {
    id: 'livestock-feed',
    keywords: ['livestock feed', 'animal feed', 'what is feed', 'poultry feed', 'cattle feed'],
    category: 'world',
    answer: `**Livestock feed** is nutritionally formulated food for farm animals:\n\n• **Poultry feed** — layer pellets, broiler mash for chickens\n• **Cattle feed** — grower rations for beef/dairy cattle\n• **Swine feed** — starter, grower, finisher for pigs\n• **Goat feed** — premium blends for dairy/meat goats\n• **Supplements** — mineral blocks, vitamins\n\nFeed stores must manage inventory carefully because demand varies seasonally and spoilage is costly.`,
  },
  {
    id: 'feed-storage',
    keywords: ['storage', 'warehouse', 'store feed', 'best practices'],
    category: 'world',
    answer: `**Feed storage best practices:**\n\n• Keep dry, ventilated, off the ground\n• FIFO rotation — oldest stock first\n• Protect from pests and moisture\n• Monitor temperature (avoid heat/humidity)\n• Track expiry dates on bags\n• Separate medicated vs non-medicated feeds\n\nFeed track helps by alerting you before stock runs out or sits too long!`,
  },
  {
    id: 'ph-feed-industry',
    keywords: ['philippine', 'philippines feed', 'ph feed store', 'agriculture philippines'],
    category: 'world',
    answer: `The **Philippine feeds industry** supports a large livestock sector — poultry, swine, and cattle farming are major economic activities. Feed supply stores serve farmers with bagged feeds priced in **₱ (PHP)**.\n\nFeed track is designed for these stores: role-based staff workflows, peso pricing, demand forecasting for seasonal farming cycles, and multi-user coordination.`,
  },
  {
    id: 'customer-service',
    keywords: ['customer service', 'service tips', 'front desk'],
    category: 'world',
    surfaces: ['sales-order-staff'],
    answer: `**Customer service tips for feed stores:**\n\n• Confirm animal type and growth stage before recommending feed\n• Check stock before promising delivery dates\n• Explain bulk pricing for large orders\n• Follow up on rejected orders with alternatives\n• Keep customers updated on processing status\n\nFeed track's order status pipeline makes this easy!`,
  },
  {
    id: 'industry-trends',
    keywords: ['trends', 'industry', 'market', 'future of feed'],
    category: 'world',
    answer: `**Livestock feed industry trends:**\n\n• **Precision nutrition** — tailored feeds by species & stage\n• **Sustainable sourcing** — alternative proteins, reduced waste\n• **Digital inventory** — platforms like Feed track replacing spreadsheets\n• **Demand forecasting** — AI/weighted analytics for seasonal peaks\n• **E-commerce** — customers ordering feed online for pickup/delivery\n\nFeed track puts forecasting and online ordering in one platform!`,
  },
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'help'],
    category: 'general',
    answer: `Hello. I'm **Track AI**, your Feed track assistant. I can help with:\n\n• Platform features & navigation\n• Role-specific workflows\n• Live inventory & order data\n• Forecasting formulas\n• Feed industry knowledge\n• General world topics\n\nTry a quick question below or ask me anything!`,
  },
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'salamat', 'appreciate'],
    category: 'general',
    answer: `You're welcome! Happy to help anytime. If you need more info about Feed track or the feed industry, just ask!`,
  },
  {
    id: 'track-ai-help',
    keywords: ['track ai', 'what can track ai', 'chatbot', 'ai help', 'ask track ai'],
    category: 'general',
    answer: `**Track AI** is your floating assistant (tap the button bottom-right). I can:\n\n• Answer role-specific questions with **quick question chips**\n• Pull **live data** — stock levels, pending orders, catalog\n• Explain forecasting formulas & workflows\n• Share feed industry & world knowledge\n• Search Wikipedia for general topics\n\nEach page shows questions tailored to your current role!`,
  },
  {
    id: 'mobile-responsive',
    keywords: ['mobile', 'responsive', 'phone', 'tablet', 'mobile friendly', 'is feed track mobile'],
    category: 'system',
    answer: `Yes! Feed track is **fully responsive**:\n\n• Collapsible sidebar with mobile menu on all role dashboards\n• Touch-friendly tables with horizontal scroll hints\n• Mobile cart dock on **Place Order** for customers\n• Safe-area padding for notched phones\n• Track AI chatbot adapts to small screens\n\nWorks on phones, tablets, and desktops — no app install needed.`,
  },
  {
    id: 'switch-roles',
    keywords: ['switch role', 'switch roles', 'change role', 'role switcher', 'quick role'],
    category: 'system',
    answer: `**Switch roles** two ways:\n\n1. **Login page** — Quick Role Access cards sign you into demo accounts instantly\n2. **Sidebar switcher** — When logged in, use the **Switch Role** grid at the bottom of the sidebar (Admin · Inventory · Sales · Customer)\n\nEach role opens its own dashboard with separate navigation.`,
  },
  {
    id: 'wrong-password',
    keywords: ['wrong password', 'credentials', 'login failed', 'cannot login', 'forgot password'],
    category: 'system',
    surfaces: ['login', 'register', 'home'],
    answer: `If login fails:\n\n1. Double-check email spelling and password (demo password: \`password123\`)\n2. Use **Quick Role Access** on the login page to sign in instantly\n3. Register a new account if you don't have one yet\n4. Ask an **Administrator** to verify your account is active\n\nDemo accounts are pre-loaded — try Quick Role Access first!`,
  },
  {
    id: 'admin-demo',
    keywords: ['admin demo', 'administrator demo', 'admin email', 'admin login', 'admin account'],
    category: 'system',
    surfaces: ['login', 'home'],
    answer: (ctx) => {
      const admin = ctx.users.find((u) => u.role === 'administrator' && u.active)
      return admin
        ? `**Administrator demo:**\n• Email: \`${admin.email}\`\n• Password: \`password123\`\n\nOr tap the **Admin** card on Quick Role Access!`
        : 'Use Quick Role Access on the login page to sign in as Administrator instantly.'
    },
  },
  {
    id: 'inventory-demo',
    keywords: ['inventory demo', 'inventory staff demo', 'inventory email', 'inventory login'],
    category: 'system',
    surfaces: ['login', 'home'],
    answer: (ctx) => {
      const user = ctx.users.find((u) => u.role === 'inventory-staff' && u.active)
      return user
        ? `**Inventory Staff demo:**\n• Email: \`${user.email}\`\n• Password: \`password123\`\n\nOr tap **Inventory** on Quick Role Access!`
        : 'Use Quick Role Access on the login page to sign in as Inventory Staff instantly.'
    },
  },
  {
    id: 'sales-demo',
    keywords: ['sales demo', 'sales staff demo', 'sales email', 'sales login'],
    category: 'system',
    surfaces: ['login', 'home'],
    answer: (ctx) => {
      const user = ctx.users.find((u) => u.role === 'sales-order-staff' && u.active)
      return user
        ? `**Sales Staff demo:**\n• Email: \`${user.email}\`\n• Password: \`password123\`\n\nOr tap **Sales** on Quick Role Access!`
        : 'Use Quick Role Access on the login page to sign in as Sales Staff instantly.'
    },
  },
  {
    id: 'customer-demo',
    keywords: ['customer demo', 'customer email', 'customer login'],
    category: 'system',
    surfaces: ['login', 'home'],
    answer: (ctx) => {
      const user = ctx.users.find((u) => u.role === 'customer' && u.active)
      return user
        ? `**Customer demo:**\n• Email: \`${user.email}\`\n• Password: \`password123\`\n\nOr tap **Customer** on Quick Role Access!`
        : 'Use Quick Role Access on the login page to sign in as Customer instantly.'
    },
  },
  {
    id: 'after-login',
    keywords: ['after login', 'after i log in', 'what happens after login', 'land on dashboard'],
    category: 'system',
    answer: `After login you are redirected to your **role dashboard**:\n\n• **Admin** → \`/administrator\`\n• **Inventory** → \`/inventory-staff\`\n• **Sales** → \`/sales-order-staff\`\n• **Customer** → \`/customer\`\n\nYour sidebar shows role-specific pages. Track AI updates with questions for your role!`,
  },
  {
    id: 'register-fields',
    keywords: ['required fields', 'registration fields', 'what information register', 'register form'],
    category: 'system',
    surfaces: ['register', 'login'],
    answer: `**Registration requires:**\n\n• Full name\n• Email address\n• Password\n• Role selection (Administrator, Inventory Staff, Sales Staff, or Customer)\n\nSubmit and you're logged in immediately — no email verification needed in this demo.`,
  },
  {
    id: 'change-role-later',
    keywords: ['change role later', 'change my role', 'switch role after register'],
    category: 'system',
    surfaces: ['register', 'login'],
    answer: `Your role is set at registration, but you can:\n\n• Use **Quick Role Access** on login to try other demo roles\n• Use the **Switch Role** sidebar grid when logged in\n• Ask an **Administrator** to change your account role in User Management\n\nFor production stores, admins assign staff roles centrally.`,
  },
  {
    id: 'total-sales',
    keywords: ['total sales', 'completed sales', 'revenue', 'sales in peso', 'total revenue'],
    category: 'system',
    answer: (ctx) => {
      const completed = ctx.orders.filter((o) => o.status === 'completed')
      const total = completed.reduce((s, o) => s + o.total, 0)
      return `**Completed sales total:** ${formatCurrency(total)} across **${completed.length}** completed order(s).\n\nView breakdowns on Admin → **Sales Analytics** and **Reports**.`
    },
  },
  {
    id: 'top-products',
    keywords: ['top selling', 'best selling', 'most sold', 'top products', 'sells the most'],
    category: 'system',
    answer: (ctx) => {
      const counts: Record<string, { name: string; qty: number; revenue: number }> = {}
      for (const order of ctx.orders.filter((o) => ['completed', 'processing', 'approved'].includes(o.status))) {
        for (const item of order.items) {
          if (!counts[item.productId]) counts[item.productId] = { name: item.productName, qty: 0, revenue: 0 }
          counts[item.productId].qty += item.quantity
          counts[item.productId].revenue += item.quantity * item.unitPrice
        }
      }
      const sorted = Object.values(counts).sort((a, b) => b.qty - a.qty)
      if (sorted.length === 0) return 'No order data yet to rank top products.'
      const list = sorted.slice(0, 5).map((p, i) => `${i + 1}. **${p.name}** — ${p.qty} units · ${formatCurrency(p.revenue)}`).join('\n')
      return `**Top feed products by order volume:**\n\n${list}`
    },
  },
  {
    id: 'approved-orders',
    keywords: ['approved orders', 'currently approved', 'waiting for processing'],
    category: 'system',
    answer: (ctx) => {
      const approved = ctx.orders.filter((o) => o.status === 'approved')
      if (approved.length === 0) return 'No orders in **Approved** status right now.'
      const list = approved.map((o) => `• **${o.id}** — ${o.customerName} · ${formatCurrency(o.total)}`).join('\n')
      return `**${approved.length} approved order(s) awaiting processing:**\n\n${list}`
    },
  },
  {
    id: 'processing-orders',
    keywords: ['processing orders', 'in processing', 'being prepared'],
    category: 'system',
    answer: (ctx) => {
      const processing = ctx.orders.filter((o) => o.status === 'processing')
      if (processing.length === 0) return 'No orders in **Processing** status right now.'
      const list = processing.map((o) => `• **${o.id}** — ${o.customerName} · ${formatCurrency(o.total)}`).join('\n')
      return `**${processing.length} order(s) being processed:**\n\n${list}`
    },
  },
  {
    id: 'product-categories',
    keywords: ['product categories', 'categories', 'organize products', 'feed categories'],
    category: 'role',
    surfaces: ['administrator'],
    answer: (ctx) => {
      const cats = [...new Set(ctx.products.map((p) => p.category))]
      return `**Product categories in Feed track:**\n\n${cats.map((c) => `• ${c}`).join('\n')}\n\nSet category when adding/editing products on Admin → **Products**. Group reports and filters by category.`
    },
  },
  {
    id: 'deactivate-users',
    keywords: ['deactivate', 'disable user', 'deactivate account'],
    category: 'role',
    surfaces: ['administrator'],
    answer: `**Deactivate users** (Admin → Users):\n\n1. Find the user in the table\n2. Toggle **Active** status off\n3. User can no longer log in but order/inventory history is preserved\n\nRe-activate anytime. Only administrators can manage accounts.`,
  },
  {
    id: 'low-stock-threshold',
    keywords: ['low stock threshold', 'set threshold', 'reorder threshold setting'],
    category: 'role',
    surfaces: ['administrator'],
    answer: `Set **low stock threshold** per product on Admin → **Products**:\n\n• When adding: enter threshold alongside stock quantity\n• When editing: update the threshold field\n• Forecasting engine uses this alongside calculated reorder point\n\nExample: Layer Pellets threshold = 10 bags — alert fires when stock ≤ 10.`,
  },
  {
    id: 'admin-nav-pages',
    keywords: ['administrator pages', 'admin pages', 'navigate admin', 'list admin pages'],
    category: 'role',
    surfaces: ['administrator'],
    answer: `**Administrator pages:**\n\n• **Dashboard** — KPIs & overview\n• **Products** — add/edit/delete feed catalog\n• **Analytics** — sales trends in ₱\n• **Low Stock** — alert management\n• **Users** — account management\n• **Orders** — full order oversight\n• **Reports** — export summaries`,
  },
  {
    id: 'safety-stock-info',
    keywords: ['safety stock', 'buffer stock', 'days of demand'],
    category: 'role',
    surfaces: ['inventory-staff', 'administrator'],
    answer: `**Safety stock** in Feed track = **${SAFETY_STOCK_DAYS} days** of average daily demand.\n\nIt buffers against demand spikes and supplier delays. Combined with **${LEAD_TIME_DAYS}-day lead time** to calculate reorder point.\n\nView per-product safety stock on Inventory → **Forecasting**.`,
  },
  {
    id: 'lead-time',
    keywords: ['lead time', 'supplier lead', 'restock days'],
    category: 'role',
    surfaces: ['inventory-staff', 'administrator'],
    answer: `Feed track uses **${LEAD_TIME_DAYS} days** default supplier lead time for feed restock.\n\nReorder point = (daily demand × ${LEAD_TIME_DAYS}) + safety stock (${SAFETY_STOCK_DAYS} days).\n\nOrder before stock hits reorder point to avoid stockouts during delivery wait.`,
  },
  {
    id: 'pipeline-demand-info',
    keywords: ['pipeline demand', 'pipeline', 'reserved stock', 'effective stock'],
    category: 'role',
    surfaces: ['inventory-staff', 'administrator'],
    answer: `**Pipeline demand** = quantity reserved by pending, approved, and processing orders.\n\n**Effective stock** = current stock − pipeline demand\n\nForecasting uses effective stock for days-remaining calculation so you don't oversell.`,
  },
  {
    id: 'stockout-risk-info',
    keywords: ['stockout risk', 'risk percentage', 'stockout probability'],
    category: 'role',
    surfaces: ['inventory-staff', 'administrator'],
    answer: `**Stockout risk %** on the Forecasting page:\n\n• **85%+** — at or below lead time days remaining (Critical)\n• **55%** — ≤ 14 days remaining (Warning)\n• **25%** — ≤ 30 days\n• **8%** — healthy stock (Good)\n\nAdjusted by forecast confidence (low data = higher risk).`,
  },
  {
    id: 'inv-nav-pages',
    keywords: ['inventory pages', 'inventory staff pages', 'list inventory pages', 'my nav pages'],
    category: 'role',
    surfaces: ['inventory-staff'],
    answer: `**Inventory Staff pages:**\n\n• **Dashboard** — stock overview & alerts\n• **Update Stock** — adjust quantities\n• **Monitor** — watch all inventory levels\n• **Record In/Out** — log movements\n• **Alerts** — low stock notifications\n• **Forecasting** — demand, ROP, reorder suggestions`,
  },
  {
    id: 'after-stock-update',
    keywords: ['after stock update', 'after update stock', 'what happens after update'],
    category: 'role',
    surfaces: ['inventory-staff'],
    answer: `After updating stock:\n\n• All roles see new quantities **instantly**\n• Forecasting recalculates demand & days remaining\n• Low stock alerts update if threshold crossed\n• Sales can approve orders based on new availability\n• Customers see updated stock on Browse page`,
  },
  {
    id: 'sales-reject',
    keywords: ['reject order', 'reject an order', 'decline order', 'rejection reason'],
    category: 'role',
    surfaces: ['sales-order-staff'],
    answer: `**Reject orders** on Sales → **Approve/Reject**:\n\n1. Review order items and stock\n2. Click Reject with optional reason\n3. Customer sees rejected status + notification\n\n**Valid reasons:** out of stock, invalid quantity, duplicate order, payment issue. Suggest alternatives when possible!`,
  },
  {
    id: 'sales-check-stock',
    keywords: ['check stock', 'stock available', 'availability before approve'],
    category: 'role',
    surfaces: ['sales-order-staff'],
    answer: `Before approving:\n\n1. Check item quantities vs **Monitor Inventory** or **Inventory Coordination**\n2. Review pipeline demand on Forecasting (Inventory page)\n3. For large orders, confirm with Inventory staff via coordination page\n4. Reject or partial-approve if stock insufficient`,
  },
  {
    id: 'sales-bulk-orders',
    keywords: ['bulk order', 'large order', 'bulk feed', 'multiple bags'],
    category: 'role',
    surfaces: ['sales-order-staff', 'customer'],
    answer: `**Large bulk orders:**\n\n• Verify stock covers full quantity (check Forecasting)\n• Confirm delivery/pickup timeline with customer\n• Coordinate with Inventory for staging\n• Consider partial fulfillment if stock is tight\n• Totals calculated automatically in ₱ on the order`,
  },
  {
    id: 'sales-complete',
    keywords: ['mark completed', 'complete order', 'order completed'],
    category: 'role',
    surfaces: ['sales-order-staff'],
    answer: `Mark orders **Completed** on Sales → **Update Status** or **Process Orders**:\n\nPending → Approved → Processing → **Completed**\n\nCompleted means customer picked up or received delivery. Customer gets notification on **Order Updates**.`,
  },
  {
    id: 'sales-nav-pages',
    keywords: ['sales pages', 'sales staff pages', 'list sales pages'],
    category: 'role',
    surfaces: ['sales-order-staff'],
    answer: `**Sales / Order Staff pages:**\n\n• **Dashboard** — order queue overview\n• **Review Orders** — inspect new orders\n• **Approve/Reject** — decision workflow\n• **Update Status** — move through pipeline\n• **Process Orders** — batch fulfillment\n• **Inventory Coord.** — check stock with warehouse`,
  },
  {
    id: 'sales-pipeline',
    keywords: ['sales pipeline', 'order pipeline', 'step by step sales'],
    category: 'role',
    surfaces: ['sales-order-staff'],
    answer: `**Sales order pipeline:**\n\n1. **Review** new pending orders\n2. **Approve/Reject** based on stock & validity\n3. **Update Status** → Processing when inventory picks\n4. **Process Orders** for batch handling\n5. **Complete** when customer receives feed\n6. Use **Inventory Coord.** anytime stock is uncertain`,
  },
  {
    id: 'layer-pellets',
    keywords: ['layer pellets', 'layer pellet', 'poultry layer', 'egg production feed'],
    category: 'system',
    answer: (ctx) => {
      const p = ctx.products.find((x) => x.name.toLowerCase().includes('layer'))
      if (!p) return 'Layer Pellets are high-protein feed for egg-laying hens — check Browse for current catalog.'
      return `**${p.name}**\n\n• Category: ${p.category}\n• Price: ${formatCurrency(p.price)}\n• Stock: **${p.stock}** bags (threshold: ${p.lowStockThreshold})\n• ${p.description}\n\n${p.stock <= p.lowStockThreshold ? 'Note: Currently low stock!' : 'In stock — available to order.'}`
    },
  },
  {
    id: 'pig-starter',
    keywords: ['pig starter', 'swine starter', 'piglet feed', 'pig mash'],
    category: 'system',
    answer: (ctx) => {
      const p = ctx.products.find((x) => x.name.toLowerCase().includes('pig'))
      if (!p) return 'Pig Starter Mash is formulated for young piglets — check the product catalog.'
      return `**${p.name}**\n\n• Category: ${p.category}\n• Price: ${formatCurrency(p.price)}\n• Stock: **${p.stock}** bags (threshold: ${p.lowStockThreshold})\n• ${p.description}\n\n${p.stock > p.lowStockThreshold ? 'Well stocked!' : 'Note: Monitor stock levels.'}`
    },
  },
  {
    id: 'cattle-feed',
    keywords: ['cattle feed', 'cattle grower', 'beef feed', 'dairy feed recommend'],
    category: 'system',
    answer: (ctx) => {
      const p = ctx.products.find((x) => x.category.toLowerCase().includes('cattle'))
      if (!p) return 'Cattle feed supports beef and dairy growth — browse the catalog for options.'
      return `**Recommended: ${p.name}**\n\n• Price: ${formatCurrency(p.price)}\n• Stock: **${p.stock}** · ${p.description}\n\nBalanced nutrition for growing cattle. Order via Browse or Place Order!`
    },
  },
  {
    id: 'mobile-cart-dock',
    keywords: ['mobile cart', 'cart dock', 'mobile order', 'phone cart'],
    category: 'role',
    surfaces: ['customer'],
    answer: `On mobile, **Place Order** shows a **fixed cart dock** at the bottom:\n\n• See cart total in ₱ while scrolling products\n• Tap to expand cart and adjust quantities\n• Submit order without losing your place\n\nDesigned for one-handed use on phones!`,
  },
  {
    id: 'cancel-order',
    keywords: ['cancel order', 'cancel my order', 'void order'],
    category: 'role',
    surfaces: ['customer'],
    answer: `Orders can be **cancelled** only while **Pending** (before sales review).\n\nOnce Approved or Processing, contact the store to request cancellation. Rejected orders are declined by sales staff with a reason.`,
  },
  {
    id: 'cust-nav-pages',
    keywords: ['customer pages', 'list customer pages', 'my pages customer'],
    category: 'role',
    surfaces: ['customer'],
    answer: `**Customer pages:**\n\n• **Dashboard** — your order summary\n• **Browse** — explore feed catalog\n• **Place Order** — cart & checkout in ₱\n• **Track Order** — live status tracking\n• **History** — past orders\n• **Updates** — notification feed`,
  },
  {
    id: 'choose-feed',
    keywords: ['choose feed', 'right feed', 'pick feed', 'which feed for'],
    category: 'role',
    surfaces: ['customer', 'home'],
    answer: `**Choose feed by animal:**\n\n• **Chickens** → Layer Pellets (eggs) or broiler feeds\n• **Cattle** → Cattle Grower Feed (beef/dairy growth)\n• **Pigs** → Pig Starter Mash (piglets) or grower rations\n• **Goats** → Goat Feed Premium (dairy/meat)\n• **All** → Mineral Salt Block supplements\n\nBrowse the catalog for ₱ prices and stock availability!`,
  },
  {
    id: 'fulfillment-time',
    keywords: ['how long fulfill', 'fulfillment time', 'delivery time', 'when receive'],
    category: 'role',
    surfaces: ['customer'],
    answer: `Typical fulfillment timeline:\n\n• **Pending** — 1–24 hrs (sales review)\n• **Approved** — same day (inventory picks)\n• **Processing** — 1–2 days (staging/prep)\n• **Completed** — ready for pickup/delivery\n\nTimes vary by order size and stock availability. Track status on **Track Order**!`,
  },
  {
    id: 'monitor-inventory',
    keywords: ['monitor inventory', 'monitor page', 'watch inventory'],
    category: 'role',
    surfaces: ['inventory-staff'],
    answer: `**Monitor Inventory** shows all products at a glance:\n\n• Current stock vs low-stock threshold\n• Category and ₱ price\n• Color-coded status (healthy / low / critical)\n• Quick link to update or record movements\n\nUse daily as your warehouse snapshot.`,
  },
]

export const GENERAL_WORLD_FACTS: Record<string, string> = {
  philippines:
    'The **Philippines** is an archipelago in Southeast Asia with over 7,000 islands. Manila is the capital. Agriculture — including livestock farming — is a major sector. Currency: Philippine Peso (₱ / PHP).',
  manila:
    '**Manila** is the capital of the Philippines, located on Luzon island. It is a major commercial and agricultural trading hub for the country.',
  agriculture:
    '**Agriculture** is the practice of cultivating crops and raising livestock. In the Philippines, key sectors include rice, coconut, poultry, swine, and cattle farming — all requiring animal feed supply chains.',
  chicken:
    '**Chickens** are the most widely farmed poultry globally. Layer hens produce eggs and need high-protein layer pellets. Broilers are raised for meat. Feed conversion ratio is a key efficiency metric.',
  cattle:
    '**Cattle** farming produces beef and dairy. Cattle require grower and finisher rations with balanced protein, fiber, and minerals. Proper feed management affects growth rate and milk yield.',
  pig:
    '**Pigs (swine)** are efficient meat producers. Feed stages: starter (piglets), grower, finisher. Feed costs represent ~60-70% of swine production expenses — inventory management is critical.',
  goat:
    '**Goats** are hardy livestock raised for meat and milk. They need premium feed blends with adequate protein and minerals. Popular in Philippine smallholder farming.',
  weather:
    'Weather affects feed demand — rainy seasons may reduce farm activity while dry seasons increase livestock feeding needs. Feed track forecasting helps anticipate these shifts.',
  inflation:
    '**Inflation** affects feed prices due to grain and commodity costs. Philippine feed stores often adjust ₱ prices seasonally. Tracking margins in Feed track analytics helps manage this.',
  ai: '**Artificial Intelligence (AI)** in inventory systems like Feed track uses demand patterns, weighted averages, and trend detection to suggest reorders — reducing stockouts and overstock.',
  cloud:
    'Feed track runs as a modern web app accessible from any browser — no installation needed. Data syncs in real time across all role dashboards.',
}
