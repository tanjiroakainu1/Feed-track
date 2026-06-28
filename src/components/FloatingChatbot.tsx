import { useCallback, useEffect, useRef, useState } from 'react'
import { askChatbot } from '../chatbot/engine'
import { getQuickQuestions, getSurfaceLabel, getWelcomeMessage } from '../chatbot/quickQuestions'
import type { ChatMessage } from '../chatbot/types'
import { useChatContext } from '../hooks/useChatContext'
import { APP_NAME } from '../config/app'
import { getRoleConfig } from '../config/roles'
import { BrandMark } from './FormalIcon'

function formatMessage(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\n)/g)
  return parts.map((part, i) => {
    if (part === '\n') return <br key={i} />
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-stone-800">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

function sourceLabel(source?: ChatMessage['source']) {
  switch (source) {
    case 'live-data':
      return 'Live data'
    case 'wikipedia':
      return 'Wikipedia'
    case 'openai':
      return 'AI'
    default:
      return 'Feed track'
  }
}

function createId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function FloatingChatbot() {
  const ctx = useChatContext()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [initialized, setInitialized] = useState(false)
  const [questionsOpen, setQuestionsOpen] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const quickQuestions = getQuickQuestions(ctx.surface)
  const accentColor = ctx.role ? getRoleConfig(ctx.role).color : '#57534e'

  useEffect(() => {
    setInitialized(false)
  }, [ctx.surface])

  useEffect(() => {
    if (open && !initialized) {
      setMessages([
        {
          id: createId(),
          role: 'assistant',
          content: getWelcomeMessage(ctx.surface, ctx.userName),
          timestamp: Date.now(),
          source: 'local',
        },
      ])
      setInitialized(true)
    }
  }, [open, initialized, ctx.surface, ctx.userName])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (!open) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('chatbot-open')

    const t = setTimeout(() => inputRef.current?.focus(), 220)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      clearTimeout(t)
      document.body.style.overflow = prevOverflow
      document.body.classList.remove('chatbot-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || typing) return

      const userMsg: ChatMessage = {
        id: createId(),
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, userMsg])
      setInput('')
      setTyping(true)

      const delay = 400 + Math.random() * 600
      await new Promise((r) => setTimeout(r, delay))

      try {
        const result = await askChatbot(trimmed, ctx)
        const assistantMsg: ChatMessage = {
          id: createId(),
          role: 'assistant',
          content: result.content,
          timestamp: Date.now(),
          source: result.source,
        }
        setMessages((prev) => [...prev, assistantMsg])
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again.',
            timestamp: Date.now(),
            source: 'local',
          },
        ])
      } finally {
        setTyping(false)
      }
    },
    [ctx, typing],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close chat overlay"
          className="chatbot-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="chatbot-root">
        {open && (
          <div
            ref={panelRef}
            className="chatbot-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Track AI chatbot"
          >
            <div className="chatbot-panel-inner">
              {/* Header */}
              <div
                className="chatbot-header shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${accentColor} 0%, #44403c 50%, #292524 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMyIgY3k9IjMiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60" />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                    <div className="chatbot-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-xs font-extrabold tracking-tight text-white ring-2 ring-white/25 backdrop-blur-sm sm:h-11 sm:w-11 sm:rounded-2xl sm:text-sm">
                      <BrandMark />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-white sm:text-base">Track AI</p>
                      <p className="truncate text-[10px] font-medium text-white/75 sm:text-[11px]">
                        {APP_NAME} · {getSurfaceLabel(ctx.surface)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/90 transition hover:bg-white/20 sm:h-8 sm:w-8"
                    aria-label="Close chat"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="relative mt-2.5 flex flex-wrap items-center gap-1.5 sm:mt-3 sm:gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/90 ring-1 ring-white/15 sm:text-[10px]">
                    <span className="chatbot-pulse h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Online
                  </span>
                  {ctx.currentPage && ctx.surface !== 'home' && (
                    <span className="max-w-[10rem] truncate rounded-full bg-black/20 px-2.5 py-1 text-[9px] font-semibold text-white/80 sm:max-w-none sm:text-[10px]">
                      {ctx.currentPage}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick questions */}
              <div className="chatbot-questions shrink-0 border-b border-stone-100 bg-stone-50/95">
                <button
                  type="button"
                  onClick={() => setQuestionsOpen((v) => !v)}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left sm:px-4 sm:py-3"
                  aria-expanded={questionsOpen}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-stone-500 sm:text-[11px]">
                    Quick questions
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-stone-200/80 px-2 py-0.5 text-[9px] font-bold text-stone-600">
                      {quickQuestions.length}
                    </span>
                    <svg
                      className={`h-4 w-4 text-stone-400 transition-transform ${questionsOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {questionsOpen && (
                  <div className="chatbot-chips border-t border-stone-100/80 px-3 pb-3 pt-2 sm:px-4 sm:pb-3.5">
                    <p className="chatbot-scroll-hint mb-2 text-[9px] font-medium text-stone-400 sm:hidden">
                      Swipe for more
                    </p>
                    <div className="chatbot-chips-track">
                      {quickQuestions.map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => sendMessage(q.prompt)}
                          disabled={typing}
                          className="chatbot-chip touch-target"
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="chatbot-messages min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4 sm:py-4">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`chatbot-bubble max-w-[min(100%,20rem)] break-words rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed sm:max-w-[88%] sm:text-sm ${
                          msg.role === 'user'
                            ? 'rounded-br-md bg-stone-800 text-white'
                            : 'rounded-bl-md border border-stone-100 bg-stone-50 text-stone-700'
                        }`}
                        style={
                          msg.role === 'assistant'
                            ? { borderLeftColor: accentColor, borderLeftWidth: 3 }
                            : undefined
                        }
                      >
                        <div className="whitespace-pre-wrap">{formatMessage(msg.content)}</div>
                        {msg.role === 'assistant' && msg.source && (
                          <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider text-stone-400">
                            {sourceLabel(msg.source)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {typing && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-stone-100 bg-stone-50 px-4 py-3">
                        <span className="chatbot-dot h-2 w-2 rounded-full bg-stone-400" style={{ animationDelay: '0ms' }} />
                        <span className="chatbot-dot h-2 w-2 rounded-full bg-stone-400" style={{ animationDelay: '150ms' }} />
                        <span className="chatbot-dot h-2 w-2 rounded-full bg-stone-400" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="chatbot-input shrink-0 border-t border-stone-100 bg-white">
                <div className="flex items-center gap-2 px-3 py-3 sm:px-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Feed track or the world…"
                    disabled={typing}
                    enterKeyHint="send"
                    autoComplete="off"
                    className="chatbot-input-field min-h-[2.875rem] flex-1 rounded-xl border border-stone-200 bg-stone-50/80 px-3.5 text-base text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300/50 disabled:opacity-60 sm:min-h-[2.75rem] sm:text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || typing}
                    className="touch-target flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-lg transition hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 sm:h-11 sm:w-11"
                    style={{ backgroundColor: accentColor }}
                    aria-label="Send message"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FAB */}
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="chatbot-fab touch-target"
            style={{
              background: `linear-gradient(145deg, ${accentColor} 0%, #292524 100%)`,
              boxShadow: `0 12px 40px -8px ${accentColor}80, 0 4px 16px -4px rgba(28,25,23,0.4)`,
            }}
            aria-label="Open Track AI chat"
            aria-expanded={false}
          >
            <span className="chatbot-fab-ring absolute inset-0 rounded-2xl sm:rounded-[1.25rem]" aria-hidden="true" />
            <span className="relative text-xs font-extrabold tracking-tight sm:text-sm">
              <BrandMark />
            </span>
          </button>
        )}
      </div>
    </>
  )
}
