import { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, FileText, Sparkles } from 'lucide-react'
import { sendAssistantMessage } from '../../api/phase2'
import toast from 'react-hot-toast'

const SUGGESTIONS = [
  'What does PECA 2025 Section 17 require for consent?',
  'Does our data retention policy meet HEC standards?',
  'Summarize the PTA cybersecurity framework requirements.',
]

const DEMO_REPLY = {
  text: "Under PECA 2025 Section 17, organizations must obtain explicit, informed consent before collecting or processing personal data, and must clearly state the purpose of collection. This applies to student records, admissions data, and any third-party data sharing arrangements. Your current \"Student Data Handling Policy\" partially covers this but doesn't mention third-party sharing consent.",
  citations: [
    { label: 'PECA 2025, Section 17', doc: 'PECA_2025_Full_Text.pdf' },
    { label: 'HEC QA Manual, Cl. 4.3', doc: 'HEC_QA_Manual_2024.pdf' },
  ],
}

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi, I\u2019m the Pak-Reg Assistant. Ask me about any Pakistani regulation — HEC, PECA, PTA, SBP or SECP — and I\u2019ll cite the exact clause.' },
  ])
  const [input, setInput]     = useState('')
  const [sending, setSending] = useState(false)
  const [isDemo, setIsDemo]   = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async (text) => {
    const msg = (text ?? input).trim()
    if (!msg) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: msg }])
    setSending(true)
    try {
      const r = await sendAssistantMessage(msg, messages)
      setMessages(m => [...m, { role: 'assistant', text: r.data.text, citations: r.data.citations }])
      setIsDemo(false)
    } catch {
      setIsDemo(true)
      await new Promise(r => setTimeout(r, 900))
      setMessages(m => [...m, { role: 'assistant', ...DEMO_REPLY }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="p-7 h-full flex flex-col animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Bot size={22} className="text-accent-light" /> Pak-Reg Assistant
          </h1>
          <p className="text-secondary text-sm mt-1">
            RAG-powered — answers cite the exact regulatory clause it retrieved from ChromaDB.
          </p>
        </div>
        {isDemo && <span className="badge bg-warning/15 text-warning">Demo mode</span>}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-elevated text-secondary' : 'bg-accent text-white'}`}>
              {m.role === 'user' ? <User size={13} /> : <Bot size={13} />}
            </div>
            <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'bg-accent text-white' : 'card'}`}>
              <p className={m.role === 'user' ? '' : 'text-secondary'}>{m.text}</p>
              {m.citations && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {m.citations.map((c, j) => (
                    <span key={j} className="flex items-center gap-1 text-[11px] text-accent-light bg-accent/10 px-2 py-1 rounded-full">
                      <FileText size={10} /> {c.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center shrink-0"><Bot size={13} /></div>
            <div className="card px-4 py-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse-ring" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse-ring" style={{ animationDelay: '0.15s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse-ring" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} className="text-xs text-secondary bg-elevated hover:bg-border px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Sparkles size={11} className="text-accent-light" /> {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Ask about any Pakistani regulation…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button onClick={() => send()} disabled={sending} className="btn-primary shrink-0">
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
