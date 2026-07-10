import { useState, useEffect } from 'react'
import { RefreshCw, Bell, TrendingUp, ShieldAlert, FileCheck, Users, Globe2 } from 'lucide-react'
import { getRiskOverview } from '../../api/phase2'
import { mockRiskOverview } from '../../api/mockData'
import RiskGauge from '../../components/phase2/RiskGauge'
import { SeverityBadge } from '../../components/phase2/Badges'
import toast from 'react-hot-toast'

const ICONS = { policy: FileCheck, vendor: Users, website: Globe2, data: ShieldAlert }

export default function RiskDashboardPage() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo]   = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const r = await getRiskOverview()
      setData(r.data)
      setIsDemo(false)
    } catch {
      setData(mockRiskOverview)
      setIsDemo(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-secondary text-sm">Loading risk overview…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-7 space-y-7 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Unified Risk Dashboard</h1>
          <p className="text-secondary text-sm mt-1">
            Compliance Index across policy, vendor, website & data risk — Phase 2 · AI Intelligence
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDemo && (
            <span className="badge bg-warning/15 text-warning">Demo data — backend not connected</span>
          )}
          <button onClick={load} className="btn-ghost"><RefreshCw size={14} /> Refresh</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6">
        {/* Overall compliance index */}
        <div className="card flex flex-col items-center justify-center gap-3 py-8">
          <p className="text-secondary text-xs font-semibold uppercase tracking-widest">Compliance Index</p>
          <RiskGauge score={data.compliance_index} size={160} stroke={12} />
          <p className="text-success text-xs font-medium flex items-center gap-1">
            <TrendingUp size={12} /> {data.trend}
          </p>
        </div>

        {/* Sub-scores */}
        <div className="grid grid-cols-2 gap-4">
          {data.scores.map(s => {
            const Icon = ICONS[s.key] || FileCheck
            return (
              <div key={s.key} className="card flex items-center gap-4">
                <RiskGauge score={s.value} size={72} stroke={7} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-primary font-semibold text-sm">
                    <Icon size={14} className="text-accent-light" /> {s.label}
                  </div>
                  <p className="text-muted text-xs mt-1 truncate">{s.framework}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Alert feed */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Bell size={15} className="text-accent-light" /> Intelligence Alert Feed
        </div>
        <div className="space-y-2">
          {data.alerts.map(a => (
            <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-elevated hover:bg-elevated/70 transition-colors">
              <SeverityBadge severity={a.severity} />
              <div className="flex-1 min-w-0">
                <p className="text-primary text-sm font-medium truncate">{a.title}</p>
                <p className="text-muted text-xs mt-0.5">{a.source}</p>
              </div>
              <span className="text-muted text-[11px] shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
