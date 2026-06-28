import { initialOrders, initialProducts, initialUsers } from '../src/data/mockData.ts'
import { testChatbotEngine } from '../src/chatbot/engine.ts'
import { getQuickQuestions } from '../src/chatbot/quickQuestions.ts'
import type { ChatContext } from '../src/chatbot/types.ts'

const ctx: ChatContext = {
  surface: 'administrator',
  roleTitle: 'Administrator',
  userName: 'Admin User',
  products: initialProducts,
  orders: initialOrders,
  users: initialUsers,
  lowStockCount: initialProducts.filter((p) => p.stock <= p.lowStockThreshold).length,
  pendingOrders: initialOrders.filter((o) => o.status === 'pending').length,
}

const { passed, failed, results } = testChatbotEngine(ctx)

console.log('\n🌾 Track AI Engine Tests\n')
for (const line of results) console.log(line)
console.log(`\n${passed} passed, ${failed} failed\n`)

const surfaces = ['home', 'login', 'register', 'administrator', 'inventory-staff', 'sales-order-staff', 'customer'] as const
console.log('📋 Quick question counts:')
for (const s of surfaces) {
  console.log(`  ${s}: ${getQuickQuestions(s).length} questions`)
}
console.log('')

if (failed > 0) {
  throw new Error(`${failed} chatbot test(s) failed`)
}

const query = 'Philippines agriculture'
try {
  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json&origin=*`,
  )
  const [, titles] = (await res.json()) as [unknown, string[]]
  if (titles?.length) {
    console.log(`✅ Wikipedia API reachable — sample: "${titles[0]}"`)
  } else {
    console.log('⚠️ Wikipedia API returned no results (network may be limited)')
  }
} catch {
  console.log('⚠️ Wikipedia API unreachable (offline?) — local engine still works')
}

console.log('\n✅ Track AI is ready!\n')
