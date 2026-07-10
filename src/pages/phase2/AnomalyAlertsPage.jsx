import { useState, useEffect } from 'react'
import { Activity, CheckCircle2, Gauge, AlertTriangle } from 'lucide-react'
import { listAnomalies, resolveAnomaly } from '../../api/phase2'
import { mockAnomalies } from '../../api/mockData'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

export default function AnomalyAlertsPage() {
  const [anomalies, setAnomalies] = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('open')
  const [isDemo, setIsDemo]       = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const r = await listAnomalies()
      setAnomalies(r.data)
      setIsDemo(false)
    } catch {
      setAnomalies(mockAnomalies)
      setIsDemo(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const resolve = async (a) => {
    try {
      if (!isDemo) await resolveAnomaly(a.id)
      setAnomalies(as => as.map(x => x.id === a.id ? { ...x, status: 'resolved' } : x))
      toast.success('Marked as resolved.')
    } catch {
      toast.error('Could not update anomaly.')
    }
  }

  const visible = anomalies.filter(a => filter === 'all' || a.status === filter)

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
          <h1 className="text-2xl font-bold text-primary">Anomaly Detection</h1>
          <p className="text-secondary text-sm mt-1">
            Isolation Forest flags unusual patterns in institutional data — enrollment, logins, transactions.
          </p>
        </div>
        {isDemo && <span className="badge bg-warning/15 text-warning">Demo data — backend not connected</span>}
      </div>

      <div className="flex items-center gap-2">
        {['open', 'resolved', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${filter === f ? 'bg-accent text-white' : 'bg-elevated text-secondary hover:text-primary'}`}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.length === 0 && (
          <div className="card py-12 text-center">
            <CheckCircle2 size={26} className="text-muted mx-auto mb-2" />
            <p className="text-secondary text-sm">No {filter !== 'all' ? filter : ''} anomalies.</p>
          </div>
        )}
        {visible.map(a => (
          <div key={a.id} className="card flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-warning/15 text-warning shrink-0">
              <AlertTriangle size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-primary font-semibold text-sm">{a.anomaly_type}</p>
                <span className="text-muted text-xs shrink-0">{formatDistanceToNow(new Date(a.detected_at), { addSuffix: true })}</span>
              </div>
              <p className="text-muted text-xs mt-0.5">{a.entity}</p>
              <p className="text-secondary text-sm mt-2">{a.detail}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-secondary">
                  <Gauge size={12} className="text-accent-light" /> Anomaly score: <span className="text-primary font-medium">{a.score.toFixed(2)}</span>
                </span>
                {a.status === 'open' ? (
                  <button onClick={() => resolve(a)} className="text-xs text-accent-light hover:underline flex items-center gap-1">
                    <CheckCircle2 size={12} /> Mark resolved
                  </button>
                ) : (
                  <span className="badge badge-processed">Resolved</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
