import { GENERAL_WORLD_FACTS, KNOWLEDGE_BASE } from './knowledge'
import type { ChatContext, KnowledgeEntry } from './types'

export interface ChatEngineResult {
  content: string
  source: 'local' | 'live-data' | 'wikipedia' | 'openai'
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^\w\s₱]/g, ' ').replace(/\s+/g, ' ').trim()
}

function scoreEntry(query: string, entry: KnowledgeEntry, ctx: ChatContext): number {
  const q = normalize(query)
  let score = 0

  if (entry.surfaces && !entry.surfaces.includes(ctx.surface)) {
    score -= 2
  }

  for (const keyword of entry.keywords) {
    const k = normalize(keyword)
    if (q.includes(k)) score += k.split(' ').length * 3
    else {
      const words = k.split(' ')
      const matched = words.filter((w) => w.length > 2 && q.includes(w)).length
      score += matched * 1.5
    }
  }

  if (ctx.surface !== 'home' && entry.category === 'role') score += 1
  if (entry.category === 'system') score += 0.5

  return score
}

function resolveAnswer(entry: KnowledgeEntry, ctx: ChatContext): string {
  return typeof entry.answer === 'function' ? entry.answer(ctx) : entry.answer
}

function matchKnowledge(query: string, ctx: ChatContext): KnowledgeEntry | null {
  const scored = KNOWLEDGE_BASE.map((entry) => ({
    entry,
    score: scoreEntry(query, entry, ctx),
  }))
    .filter((s) => s.score > 2)
    .sort((a, b) => b.score - a.score)

  return scored[0]?.entry ?? null
}

function matchWorldFacts(query: string): string | null {
  const q = normalize(query)
  for (const [key, fact] of Object.entries(GENERAL_WORLD_FACTS)) {
    if (q.includes(key)) return fact
  }
  return null
}

async function fetchWikipedia(query: string): Promise<string | null> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json&origin=*`
    const searchRes = await fetch(searchUrl)
    if (!searchRes.ok) return null

    const [, titles] = (await searchRes.json()) as [unknown, string[]]
    if (!titles?.length) return null

    const title = titles[0]
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    const summaryRes = await fetch(summaryUrl)
    if (!summaryRes.ok) return null

    const data = (await summaryRes.json()) as { extract?: string; title?: string }
    if (!data.extract) return null

    return `${data.extract}\n\n*Source: Wikipedia — ${data.title ?? title}*`
  } catch {
    return null
  }
}

async function fetchOpenAI(query: string, ctx: ChatContext): Promise<string | null> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined
  if (!apiKey?.trim()) return null

  const systemPrompt = `You are Track AI, the assistant for Feed track — an inventory forecasting & ordering platform for Philippine feeds supply stores (₱ pricing). 
Current context: surface=${ctx.surface}, role=${ctx.roleTitle ?? 'guest'}, user=${ctx.userName ?? 'anonymous'}.
Answer helpfully about the system OR general world topics. Be concise, friendly, use markdown. 
System facts: 4 roles (admin, inventory, sales, customer), weighted demand forecasting, 30-day window, reorder points, real-time sync.`

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    })

    if (!res.ok) return null
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    return data.choices?.[0]?.message?.content?.trim() ?? null
  } catch {
    return null
  }
}

function buildFallback(query: string, ctx: ChatContext): string {
  return `I'm not 100% sure about "${query}" — but here's what I can help with on **Feed track** as **${ctx.roleTitle ?? 'Guest'}**:\n\n• Platform features & ${ctx.surface === 'home' ? '4 roles' : 'your role workflow'}\n• Live inventory & order data (try "live stats" or "low stock")\n• Forecasting & reorder formulas\n• Feed industry & general knowledge\n\nPick a **quick question** below or rephrase your question!`
}

/** Core AI engine — local knowledge first, then world facts, Wikipedia, optional OpenAI */
export async function askChatbot(query: string, ctx: ChatContext): Promise<ChatEngineResult> {
  const trimmed = query.trim()
  if (!trimmed) {
    return { content: 'Type a question or tap a quick question below!', source: 'local' }
  }

  const knowledge = matchKnowledge(trimmed, ctx)
  if (knowledge) {
    const isLive =
      typeof knowledge.answer === 'function' ||
      ['live-stats', 'low-stock-now', 'pending-orders', 'products-catalog', 'demo-accounts'].includes(
        knowledge.id,
      )
    return {
      content: resolveAnswer(knowledge, ctx),
      source: isLive ? 'live-data' : 'local',
    }
  }

  const worldFact = matchWorldFacts(trimmed)
  if (worldFact) {
    return { content: worldFact, source: 'local' }
  }

  const openai = await fetchOpenAI(trimmed, ctx)
  if (openai) {
    return { content: openai, source: 'openai' }
  }

  const wiki = await fetchWikipedia(trimmed)
  if (wiki) {
    return { content: wiki, source: 'wikipedia' }
  }

  return { content: buildFallback(trimmed, ctx), source: 'local' }
}

/** Synchronous quick test for CI / scripts — no network */
export function testChatbotEngine(ctx: ChatContext): { passed: number; failed: number; results: string[] } {
  const tests: { query: string; expectIncludes: string[] }[] = [
    { query: 'What is Feed track?', expectIncludes: ['Feed track', 'forecasting'] },
    { query: 'Explain all four roles', expectIncludes: ['Administrator', 'Customer'] },
    { query: 'How does forecasting work?', expectIncludes: ['reorder', '30'] },
    { query: 'Give me live system stats', expectIncludes: ['Products', 'orders'] },
    { query: 'hello', expectIncludes: ['Track AI'] },
    { query: 'What is livestock feed?', expectIncludes: ['Poultry', 'Cattle'] },
    { query: 'Demo accounts', expectIncludes: ['password123'] },
    { query: 'Philippine Peso pricing', expectIncludes: ['₱', 'Peso'] },
    { query: 'Administrator demo account email', expectIncludes: ['password123'] },
    { query: 'List all administrator pages', expectIncludes: ['Dashboard', 'Products', 'Reports'] },
    { query: 'Which products are critically low', expectIncludes: ['stock'] },
    { query: 'Tell me about Layer Pellets', expectIncludes: ['Layer Pellets', '₱'] },
    { query: 'List all inventory staff pages', expectIncludes: ['Update Stock', 'Forecasting'] },
    { query: 'List all sales staff pages', expectIncludes: ['Review Orders', 'Approve'] },
    { query: 'List all customer pages', expectIncludes: ['Browse', 'Place Order'] },
    { query: 'What is safety stock', expectIncludes: ['5', 'days'] },
    { query: 'Is Feed track mobile friendly', expectIncludes: ['responsive', 'mobile'] },
  ]

  const results: string[] = []
  let passed = 0
  let failed = 0

  for (const test of tests) {
    const entry = matchKnowledge(test.query, ctx)
    const content = entry ? resolveAnswer(entry, ctx) : matchWorldFacts(test.query) ?? ''
    const ok = test.expectIncludes.every((s) => content.toLowerCase().includes(s.toLowerCase()))
    if (ok) {
      passed++
      results.push(`"${test.query}"`)
    } else {
      failed++
      results.push(`Rejected: "${test.query}" — missing: ${test.expectIncludes.join(', ')}`)
    }
  }

  return { passed, failed, results }
}

export { matchKnowledge, matchWorldFacts }
