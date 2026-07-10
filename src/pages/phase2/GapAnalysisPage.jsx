import { useState, useEffect } from 'react'
import {
  Scale, Play, Loader2, FileText, ArrowRight, Bot,
  ChevronRight, ListChecks
} from 'lucide-react'
import { listAssessments, runComplianceCheck } from '../../api/phase2'
import { listPolicies } from '../../api/policies'
import { mockAssessments, mockGaps } from '../../api/mockData'
import { GapTypeBadge } from '../../components/phase2/Badges'
import RiskGauge from '../../components/phase2/RiskGauge'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

const FRAMEWORKS = [
  'HEC Quality Assurance Manual',
  'PTA Cybersecurity Framework',
  'PECA 2025 Data Protection',
  'SBP Prudential Regulations',
  'SECP Corporate Governance Rules',
]

export default function GapAnalysisPage() {
  const [assessments, setAssessments] = useState([])
  const [policies, setPolicies]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [running, setRunning]         = useState(false)
  const [selected, setSelected]       = useState(null)
  const [isDemo, setIsDemo]           = useState(false)

  const [policyId, setPolicyId]       = useState('')
  const [framework, setFramework]     = useState(FRAMEWORKS[0])

  const load = async () => {
    setLoading(true)
    try {
      const [aRes, pRes] = await Promise.all([listAssessments(), listPolicies()])
      setAssessments(aRes.data)
      setPolicies(pRes.data)
      setIsDemo(false)
    } catch {
      setAssessments(mockAssessments)
      setIsDemo(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const runCheck = async () => {
    if (!isDemo && !policyId) { toast.error('Select a policy first.'); return }
    setRunning(true)
    try {
      if (isDemo) {
        await new Promise(r => setTimeout(r, 1200))
        toast.success('Gap analysis complete (demo).')
        setSelected({ ...mockAssessments[0], gapsList: mockGaps })
      } else {
        const r = await runComplianceCheck({ policy_id: policyId, framework })
        toast.success('Gap analysis started.')
        await load()
        setSelected(r.data)
      }
    } catch {
      toast.error('Could not run compliance check.')
    } finally {
      setRunning(false)
    }
  }

  const openAssessment = (a) => {
    setSelected({ ...a, gapsList: isDemo ? mockGaps : (a.gapsList || []) })
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="w-7 h-7 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-7 space-y-7 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Gap Analysis</h1>
          <p className="text-secondary text-sm mt-1">
            AI compares your policies against Pakistani regulatory frameworks using RAG-based semantic search.
          </p>
        </div>
        {isDemo && <span className="badge bg-warning/15 text-warning">Demo data — backend not connected</span>}
      </div>

      {/* Run new check */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Scale size={15} className="text-accent-light" /> Run Compliance Check
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
          <select className="input" value={policyId} onChange={e => setPolicyId(e.target.value)}>
            <option value="">Select policy document…</option>
            {policies.map(p => <option key={p.id} value={p.id}>{p.policy_name}</option>)}
          </select>
          <select className="input" value={framework} onChange={e => setFramework(e.target.value)}>
            {FRAMEWORKS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <button onClick={runCheck} disabled={running} className="btn-primary">
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {running ? 'Analyzing…' : 'Run Analysis'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.3fr] gap-6">
        {/* Assessment list */}
        <div className="card space-y-3">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <ListChecks size={15} className="text-accent-light" /> Recent Assessments
          </div>
          {assessments.length === 0 ? (
            <p className="text-secondary text-sm py-6 text-center">No assessments run yet.</p>
          ) : assessments.map(a => (
            <button
              key={a.id}
              onClick={() => openAssessment(a)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-lg bg-elevated hover:bg-elevated/70 transition-colors ${selected?.id === a.id ? 'ring-1 ring-accent' : ''}`}
            >
              <FileText size={16} className="text-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-primary text-sm font-medium truncate">{a.policy_name}</p>
                <p className="text-muted text-xs mt-0.5">
                  {a.framework} · {a.status === 'running' ? 'Analyzing…' : `${a.gaps} gap${a.gaps === 1 ? '' : 's'} found`} · {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                </p>
              </div>
              {a.status === 'running'
                ? <Loader2 size={14} className="animate-spin text-warning shrink-0" />
                : <span className="text-primary text-sm font-bold shrink-0">{a.score}</span>}
              <ChevronRight size={14} className="text-muted shrink-0" />
            </button>
          ))}
        </div>

        {/* Selected assessment detail */}
        <div className="card space-y-4">
          {!selected ? (
            <div className="py-16 text-center">
              <Scale size={28} className="text-muted mx-auto mb-2" />
              <p className="text-secondary text-sm">Select an assessment to view detected gaps.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary font-semibold text-sm">{selected.policy_name}</p>
                  <p className="text-muted text-xs mt-0.5">vs. {selected.framework}</p>
                </div>
                {selected.score != null && <RiskGauge score={selected.score} size={64} stroke={6} />}
              </div>

              <div className="space-y-2">
                {(selected.gapsList || []).map(g => (
                  <div key={g.id} className="p-3 rounded-lg bg-elevated space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-primary text-sm font-medium">{g.clause}</p>
                      <GapTypeBadge type={g.gap_type} />
                    </div>
                    <div className="flex items-start gap-2 text-xs text-secondary bg-surface border border-border rounded-lg p-2.5">
                      <Bot size={13} className="text-accent-light mt-0.5 shrink-0" />
                      <span>{g.recommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
