import type { ChatSurface, QuickQuestion } from './types'

const HOME_QUESTIONS: QuickQuestion[] = [
  { id: 'h1', label: 'What is Feed track?', prompt: 'What is Feed track and what does it do?' },
  { id: 'h2', label: 'Explain the 4 roles', prompt: 'Explain all four roles in Feed track and what each one can do' },
  { id: 'h3', label: 'How does forecasting work?', prompt: 'How does the inventory forecasting engine work in Feed track?' },
  { id: 'h4', label: 'Order lifecycle', prompt: 'Walk me through the full order lifecycle from customer to completion' },
  { id: 'h5', label: 'Philippine Peso pricing', prompt: 'How does Feed track handle Philippine Peso pricing and currency?' },
  { id: 'h6', label: 'How to get started?', prompt: 'How do I register and choose the right role in Feed track?' },
  { id: 'h7', label: 'Smart alerts', prompt: 'What smart alerts and notifications does Feed track send?' },
  { id: 'h8', label: 'What is livestock feed?', prompt: 'What is livestock feed and why is inventory management important for feed stores?' },
  { id: 'h9', label: 'Sample products', prompt: 'What feed products are available in the Feed track catalog?' },
  { id: 'h10', label: 'Real-time sync', prompt: 'How does real-time sync work across roles in Feed track?' },
  { id: 'h11', label: 'Reorder point formula', prompt: 'What is reorder point and how is it calculated?' },
  { id: 'h12', label: 'Live system stats', prompt: 'Give me live system stats right now' },
  { id: 'h13', label: 'Who uses this?', prompt: 'Who uses Feed track and what types of feed stores is it for?' },
  { id: 'h14', label: 'Poultry vs cattle feed', prompt: 'What is the difference between poultry, cattle, swine, and goat feed?' },
  { id: 'h15', label: 'Mobile friendly?', prompt: 'Is Feed track mobile friendly and responsive on phones?' },
  { id: 'h16', label: 'What can Track AI do?', prompt: 'What can Track AI help me with in Feed track?' },
  { id: 'h17', label: 'Low stock items now', prompt: 'Which products are low on stock right now?' },
  { id: 'h18', label: 'Switch roles', prompt: 'Can users switch between roles in Feed track?' },
]

const LOGIN_QUESTIONS: QuickQuestion[] = [
  { id: 'l1', label: 'How do I sign in?', prompt: 'How do I sign in to Feed track?' },
  { id: 'l2', label: 'Demo accounts', prompt: 'What demo accounts are available for quick login by role?' },
  { id: 'l3', label: 'Quick role access', prompt: 'How does quick role access work on the login page?' },
  { id: 'l4', label: 'Create account', prompt: 'How do I create a new Feed track account?' },
  { id: 'l5', label: 'Role security', prompt: 'How does role-based security work after I log in?' },
  { id: 'l6', label: 'What is Feed track?', prompt: 'Give me a quick overview of Feed track' },
  { id: 'l7', label: 'Wrong password?', prompt: 'What should I do if my login credentials do not work?' },
  { id: 'l8', label: 'What is a feed store?', prompt: 'What is a feeds supply store and who uses Feed track?' },
  { id: 'l9', label: 'Admin demo login', prompt: 'What is the administrator demo account email and password?' },
  { id: 'l10', label: 'Inventory demo login', prompt: 'What is the inventory staff demo account email and password?' },
  { id: 'l11', label: 'Sales demo login', prompt: 'What is the sales staff demo account email and password?' },
  { id: 'l12', label: 'Customer demo login', prompt: 'What is the customer demo account email and password?' },
  { id: 'l13', label: 'Which role for me?', prompt: 'Which Feed track role should I choose based on my job?' },
  { id: 'l14', label: 'After login?', prompt: 'What happens after I log in to Feed track?' },
  { id: 'l15', label: 'Live stats preview', prompt: 'Show me a preview of live system stats before I log in' },
  { id: 'l16', label: 'Ask Track AI', prompt: 'What can I ask Track AI on the login page?' },
]

const REGISTER_QUESTIONS: QuickQuestion[] = [
  { id: 'r1', label: 'How to register?', prompt: 'How do I register for a Feed track account step by step?' },
  { id: 'r2', label: 'Pick my role', prompt: 'Which role should I choose — administrator, inventory, sales, or customer?' },
  { id: 'r3', label: 'Role differences', prompt: 'What is the difference between all four Feed track roles?' },
  { id: 'r4', label: 'Account security', prompt: 'How are Feed track accounts secured after registration?' },
  { id: 'r5', label: 'Customer signup', prompt: 'I am a customer — what can I do after registering?' },
  { id: 'r6', label: 'Staff signup', prompt: 'I work at a feed store — which staff role should I pick?' },
  { id: 'r7', label: 'PH feed stores', prompt: 'Why is Feed track built for Philippine feed supply stores?' },
  { id: 'r8', label: 'Already have account?', prompt: 'I already have an account — how do I sign in instead?' },
  { id: 'r9', label: 'Register as admin', prompt: 'Can I register as an administrator and what can admins do?' },
  { id: 'r10', label: 'Required fields', prompt: 'What information do I need to provide when registering?' },
  { id: 'r11', label: 'Store owner role', prompt: 'I own a feed supply store — which role should I register as?' },
  { id: 'r12', label: 'Farmer customer', prompt: 'I am a farmer buying feed — should I register as customer?' },
  { id: 'r13', label: 'Instant access?', prompt: 'Do I get instant access to my dashboard after registering?' },
  { id: 'r14', label: 'Product catalog', prompt: 'What products will I see after registering as a customer?' },
  { id: 'r15', label: 'Change role later?', prompt: 'Can I change my role after registering?' },
  { id: 'r16', label: 'Track AI help', prompt: 'How can Track AI help me during registration?' },
]

const ADMIN_QUESTIONS: QuickQuestion[] = [
  { id: 'a1', label: 'Dashboard overview', prompt: 'What can I do on the administrator dashboard?' },
  { id: 'a2', label: 'Manage products', prompt: 'How do I add, edit, and delete feed products as admin?' },
  { id: 'a3', label: 'User management', prompt: 'How does user management work for administrators?' },
  { id: 'a4', label: 'Sales analytics', prompt: 'Explain the sales analytics page and what metrics I can see' },
  { id: 'a5', label: 'Low stock alerts', prompt: 'How do low stock notifications work and how do I respond?' },
  { id: 'a6', label: 'Order oversight', prompt: 'How can I oversee all orders as administrator?' },
  { id: 'a7', label: 'Export reports', prompt: 'How do I generate and export reports in Philippine Peso?' },
  { id: 'a8', label: 'Forecasting engine', prompt: 'Explain the forecasting formulas — reorder point, safety stock, and demand' },
  { id: 'a9', label: 'Live stats now', prompt: 'Give me live system stats right now — products, orders, low stock' },
  { id: 'a10', label: 'Feed industry trends', prompt: 'What are current trends in the livestock feed industry?' },
  { id: 'a11', label: 'Product categories', prompt: 'What product categories exist in Feed track and how do I organize them?' },
  { id: 'a12', label: 'Deactivate users', prompt: 'How do I deactivate a user account without deleting their history?' },
  { id: 'a13', label: 'Total sales in ₱', prompt: 'What are total completed sales in Philippine Peso right now?' },
  { id: 'a14', label: 'Pending orders', prompt: 'How many pending orders are there and who placed them?' },
  { id: 'a15', label: 'Critical stock items', prompt: 'Which products are at critical stock levels right now?' },
  { id: 'a16', label: 'Top selling products', prompt: 'Which feed products sell the most based on order data?' },
  { id: 'a17', label: 'Switch roles', prompt: 'How do I switch to another role using the sidebar switcher?' },
  { id: 'a18', label: 'Admin notifications', prompt: 'What notifications do administrators receive?' },
  { id: 'a19', label: 'Set low stock threshold', prompt: 'How do I set low stock thresholds when adding or editing products?' },
  { id: 'a20', label: 'Navigate admin pages', prompt: 'List all administrator pages and what each one does' },
]

const INVENTORY_QUESTIONS: QuickQuestion[] = [
  { id: 'i1', label: 'Update stock', prompt: 'How do I update feed stock levels as inventory staff?' },
  { id: 'i2', label: 'Monitor inventory', prompt: 'How does the monitor inventory page work?' },
  { id: 'i3', label: 'Record in/out', prompt: 'How do I record incoming and outgoing stock movements?' },
  { id: 'i4', label: 'Low stock alerts', prompt: 'What should I do when I receive a low stock alert?' },
  { id: 'i5', label: 'Forecasting page', prompt: 'Explain the inventory forecasting page and reorder suggestions' },
  { id: 'i6', label: 'Reorder point', prompt: 'What is reorder point and how is it calculated in Feed track?' },
  { id: 'i7', label: 'Critical items now', prompt: 'Which products are critically low on stock right now?' },
  { id: 'i8', label: 'Fulfill orders', prompt: 'How does inventory staff fulfill approved orders?' },
  { id: 'i9', label: 'Demand trends', prompt: 'How does Feed track detect rising or falling demand for feed products?' },
  { id: 'i10', label: 'Feed storage tips', prompt: 'What are best practices for storing livestock feed in a warehouse?' },
  { id: 'i11', label: 'Safety stock', prompt: 'What is safety stock and how many days of demand does Feed track use?' },
  { id: 'i12', label: 'Record incoming', prompt: 'How do I record an incoming supplier delivery?' },
  { id: 'i13', label: 'Record outgoing', prompt: 'How do I record outgoing stock for order fulfillment?' },
  { id: 'i14', label: 'Lead time days', prompt: 'What is the supplier lead time used in forecasting?' },
  { id: 'i15', label: 'Stockout risk', prompt: 'How is stockout risk percentage calculated per product?' },
  { id: 'i16', label: 'Pipeline demand', prompt: 'What is pipeline demand and how does it affect available stock?' },
  { id: 'i17', label: 'Goat feed low?', prompt: 'Is goat feed or any supplement running low right now?' },
  { id: 'i18', label: 'Reorder cost in ₱', prompt: 'How do I see estimated reorder cost in Philippine Peso on the forecasting page?' },
  { id: 'i19', label: 'My nav pages', prompt: 'List all inventory staff pages and what each one does' },
  { id: 'i20', label: 'After stock update', prompt: 'What happens across the system after I update stock levels?' },
]

const SALES_QUESTIONS: QuickQuestion[] = [
  { id: 's1', label: 'Review orders', prompt: 'How do I review incoming customer orders as sales staff?' },
  { id: 's2', label: 'Approve or reject', prompt: 'When should I approve vs reject a feed supply order?' },
  { id: 's3', label: 'Update status', prompt: 'How do I update order status through the fulfillment pipeline?' },
  { id: 's4', label: 'Process orders', prompt: 'What does processing an order mean in Feed track?' },
  { id: 's5', label: 'Inventory coord.', prompt: 'How do I coordinate with inventory staff on order availability?' },
  { id: 's6', label: 'Pending orders now', prompt: 'How many pending orders are there right now and who placed them?' },
  { id: 's7', label: 'Order statuses', prompt: 'Explain all order statuses — pending, approved, processing, completed, rejected' },
  { id: 's8', label: 'Order totals in ₱', prompt: 'How are order totals calculated in Philippine Peso?' },
  { id: 's9', label: 'Customer info', prompt: 'What customer information can sales staff see on orders?' },
  { id: 's10', label: 'Customer service tips', prompt: 'What are best practices for customer service in feed supply stores?' },
  { id: 's11', label: 'Reject an order', prompt: 'How do I reject an order and what reason should I give the customer?' },
  { id: 's12', label: 'Approved orders', prompt: 'Which orders are currently approved and waiting for processing?' },
  { id: 's13', label: 'Processing orders', prompt: 'Which orders are currently in processing status?' },
  { id: 's14', label: 'Check stock first', prompt: 'How do I check if stock is available before approving an order?' },
  { id: 's15', label: 'Large bulk orders', prompt: 'How should I handle large bulk feed orders from customers?' },
  { id: 's16', label: 'Sales notifications', prompt: 'What notifications do sales staff receive in Feed track?' },
  { id: 's17', label: 'Mark completed', prompt: 'How do I mark an order as completed after fulfillment?' },
  { id: 's18', label: 'My nav pages', prompt: 'List all sales staff pages and what each one does' },
  { id: 's19', label: 'Layer pellets order', prompt: 'A customer wants layer pellets — what should I check before approving?' },
  { id: 's20', label: 'Order pipeline flow', prompt: 'Walk me through the sales order pipeline step by step' },
]

const CUSTOMER_QUESTIONS: QuickQuestion[] = [
  { id: 'c1', label: 'Browse products', prompt: 'How do I browse the feed product catalog as a customer?' },
  { id: 'c2', label: 'Place an order', prompt: 'How do I place a feed supply order step by step?' },
  { id: 'c3', label: 'Track my order', prompt: 'How do I track my order status in Feed track?' },
  { id: 'c4', label: 'Order history', prompt: 'Where can I see my past order history?' },
  { id: 'c5', label: 'Order updates', prompt: 'How do order update notifications work for customers?' },
  { id: 'c6', label: 'Prices in ₱', prompt: 'How are feed product prices shown in Philippine Peso?' },
  { id: 'c7', label: 'Available products', prompt: 'What feed products are currently available to order?' },
  { id: 'c8', label: 'How long to fulfill?', prompt: 'How long does it typically take for an order to be fulfilled?' },
  { id: 'c9', label: 'Cancel an order?', prompt: 'Can I cancel an order after placing it?' },
  { id: 'c10', label: 'Types of livestock feed', prompt: 'What types of livestock feed exist — poultry, cattle, swine, goat?' },
  { id: 'c11', label: 'Layer pellets info', prompt: 'Tell me about Layer Pellets 50kg — price, stock, and what it is for' },
  { id: 'c12', label: 'Pig starter mash', prompt: 'Tell me about Pig Starter Mash — price, stock, and who needs it' },
  { id: 'c13', label: 'Mobile cart dock', prompt: 'How does the mobile cart dock work when placing orders on phone?' },
  { id: 'c14', label: 'Out of stock items', prompt: 'Which products are currently out of stock or low stock?' },
  { id: 'c15', label: 'My order status', prompt: 'What do pending, approved, processing, and completed mean for my order?' },
  { id: 'c16', label: 'My notifications', prompt: 'What notifications will I receive as a customer?' },
  { id: 'c17', label: 'Bulk order tips', prompt: 'How do I place a bulk order for multiple bags of feed?' },
  { id: 'c18', label: 'Cattle feed pick', prompt: 'Which cattle feed product do you recommend and what is the price?' },
  { id: 'c19', label: 'My nav pages', prompt: 'List all customer pages and what each one does' },
  { id: 'c20', label: 'Pick the right feed', prompt: 'How do I choose the right feed for my chickens, pigs, or goats?' },
]

export const QUICK_QUESTIONS: Record<ChatSurface, QuickQuestion[]> = {
  home: HOME_QUESTIONS,
  login: LOGIN_QUESTIONS,
  register: REGISTER_QUESTIONS,
  administrator: ADMIN_QUESTIONS,
  'inventory-staff': INVENTORY_QUESTIONS,
  'sales-order-staff': SALES_QUESTIONS,
  customer: CUSTOMER_QUESTIONS,
}

export function getQuickQuestions(surface: ChatSurface): QuickQuestion[] {
  return QUICK_QUESTIONS[surface] ?? HOME_QUESTIONS
}

export function getQuickQuestionCount(surface: ChatSurface): number {
  return getQuickQuestions(surface).length
}

export function getSurfaceLabel(surface: ChatSurface): string {
  const labels: Record<ChatSurface, string> = {
    home: 'Guest',
    login: 'Sign In',
    register: 'Register',
    administrator: 'Administrator',
    'inventory-staff': 'Inventory Staff',
    'sales-order-staff': 'Sales / Order Staff',
    customer: 'Customer',
  }
  return labels[surface]
}

export function getWelcomeMessage(surface: ChatSurface, userName?: string): string {
  const greeting = userName ? `Hey ${userName.split(' ')[0]}!` : 'Hey there!'
  const count = getQuickQuestionCount(surface)
  const intros: Record<ChatSurface, string> = {
    home: `${greeting} I'm **Track AI** — your Feed track guide. Ask me anything about our platform, forecasting, orders, or the feed industry. **${count} quick questions** ready below!`,
    login: `${greeting} I'm **Track AI** — help with sign in, demo accounts, and getting started. **${count} quick questions** below!`,
    register: `${greeting} I'm **Track AI** — I'll help you pick the right role and register fast. **${count} quick questions** below!`,
    administrator: `${greeting} I'm **Track AI**, your admin copilot — products, users, analytics, live stats. **${count} quick questions** for your role below!`,
    'inventory-staff': `${greeting} I'm **Track AI**, your inventory assistant — stock, alerts, forecasting, movements. **${count} quick questions** below!`,
    'sales-order-staff': `${greeting} I'm **Track AI**, your sales desk partner — orders, approvals, coordination. **${count} quick questions** below!`,
    customer: `${greeting} I'm **Track AI**, your shopping assistant — browse, order, track. **${count} quick questions** below!`,
  }
  return intros[surface]
}
