import { useState, useEffect } from 'react'
import { Radar, Plus, Pencil, Minus, BellRing, CheckCheck } from 'lucide-react'
import { listRegulatoryChanges, acknowledgeChange } from '../../api/phase2'
import { mockRegulatoryChanges } from '../../api/mockData'
import { SeverityBadge } from '../../components/phase2/Badges'
import toast from 'react-hot-toast'

const CHANGE_ICON = {
  new:      { icon: Plus,   cls: 'bg-success/15 text-success' },
  modified: { icon: Pencil, cls: 'bg-warning/15 text-warning' },
  removed:  { icon: Minus,  cls: 'bg-danger/15 text-danger' },
}

export default function RegulatoryChangesPage() {
  const [changes, setChanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo]   = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const r = await listRegulatoryChanges()
      setChanges(r.data)
      setIsDemo(false)
    } catch {
      setChanges(mockRegulatoryChanges)
      setIsDemo(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const ack = async (c) => {
    try {
      if (!isDemo) await acknowledgeChange(c.id)
      setChanges(cs => cs.map(x => x.id === c.id ? { ...x, acknowledged: true } : x))
      toast.success('Acknowledged.')
    } catch {
      toast.error('Could not update.')
    }
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
          <h1 className="text-2xl font-bold text-primary">Regulatory Change Detection</h1>
          <p className="text-secondary text-sm mt-1">
            Monitors HEC, PTA, SBP & SECP portals and flags updates affecting your policies.
          </p>
        </div>
        {isDemo && <span className="badge bg-warning/15 text-warning">Demo data — backend not connected</span>}
      </div>

      <div className="space-y-3">
        {changes.map(c => {
          const cfg = CHANGE_ICON[c.change_type] || CHANGE_ICON.modified
          const Icon = cfg.icon
          return (
            <div key={c.id} className="card flex items-start gap-4">
              <div className={`p-2.5 rounded-lg shrink-0 ${cfg.cls}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-primary font-semibold text-sm">{c.title}</p>
                  <span className="text-muted text-xs shrink-0">{c.published_at}</span>
                </div>
                <p className="text-muted text-xs mt-0.5">{c.authority} · {c.affected_policies} affected polic{c.affected_policies === 1 ? 'y' : 'ies'}</p>
                <div className="flex items-center gap-3 mt-3">
                  <SeverityBadge severity={c.impact} />
                  {c.acknowledged ? (
                    <span className="text-xs text-success flex items-center gap-1"><CheckCheck size={12} /> Acknowledged</span>
                  ) : (
                    <button onClick={() => ack(c)} className="text-xs text-accent-light hover:underline flex items-center gap-1">
                      <BellRing size={12} /> Acknowledge & notify team
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        {changes.length === 0 && (
          <div className="card py-12 text-center">
            <Radar size={26} className="text-muted mx-auto mb-2" />
            <p className="text-secondary text-sm">No regulatory changes detected recently.</p>
          </div>
        )}
      </div>
    </div>
  )
}
