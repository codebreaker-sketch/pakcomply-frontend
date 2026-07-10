import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, CheckCircle2, Clock, XCircle,
  Building2, ArrowRight, ScanText, RefreshCw
} from 'lucide-react'
import { listPolicies } from '../api/policies'
import { getMyOrg, getAuditLogs } from '../api/organizations'
import { useAuth } from '../context/AuthContext'
import StatusBadge, { PulseDot } from '../components/StatusBadge'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

function StatCard({ icon: Icon, label, value, sub, accent = false }) {
  return (
    <div className={`card flex items-start justify-between ${accent ? 'border-accent/30 bg-accent/5' : ''}`}>
      <div>
        <p className="text-secondary text-xs font-medium mb-2">{label}</p>
        <p className="text-primary text-3xl font-bold">{value}</p>
        {sub && <p className="text-muted text-xs mt-1">{sub}</p>}
      </div>
      <div className={`p-2.5 rounded-lg ${accent ? 'bg-accent/20 text-accent-light' : 'bg-elevated text-secondary'}`}>
        <Icon size={18} />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [policies, setPolicies] = useState([])
  const [org, setOrg]           = useState(null)
  const [logs, setLogs]         = useState([])
  const [loading, setLoading]   = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [pRes, lRes] = await Promise.all([listPolicies(), getAuditLogs(20)])
      setPolicies(pRes.data)
      setLogs(lRes.data)
      if (user?.org_id) {
        const oRes = await getMyOrg()
        setOrg(oRes.data)
      }
    } catch {
      toast.error('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const counts = {
    total:      policies.length,
    processed:  policies.filter(p => p.status === 'processed').length,
    processing: policies.filter(p => p.status === 'processing').length,
    failed:     policies.filter(p => p.status === 'failed').length,
  }

  const recent = policies.slice(0, 5)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-secondary text-sm">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-7 space-y-7 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Good {getGreeting()}, {user?.name?.split(' ')[0]}.
          </h1>
          <p className="text-secondary text-sm mt-1">
            {org ? <span className="flex items-center gap-1.5"><Building2 size={13} /> {org.org_name}</span> : 'No organization linked yet.'}
          </p>
        </div>
        <button onClick={load} className="btn-ghost">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={FileText}     label="Total Policies"  value={counts.total}      sub="All uploaded documents" accent />
        <StatCard icon={CheckCircle2} label="Processed"       value={counts.processed}  sub="Text extracted successfully" />
        <StatCard icon={Clock}        label="Processing"      value={counts.processing} sub="Being processed now" />
        <StatCard icon={XCircle}      label="Failed"          value={counts.failed}     sub="Need attention" />
      </div>

      {/* Bottom two columns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent policies */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <ScanText size={15} className="text-accent-light" /> Recent Policies
            </div>
            <Link to="/policies" className="text-xs text-accent-light hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="py-8 text-center">
              <FileText size={28} className="text-muted mx-auto mb-2" />
              <p className="text-secondary text-sm">No policies uploaded yet.</p>
              <Link to="/policies" className="text-accent-light text-sm hover:underline mt-1 block">Upload your first policy →</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-elevated hover:bg-elevated/70 transition-colors">
                  <PulseDot status={p.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-primary text-sm font-medium truncate">{p.policy_name}</p>
                    <p className="text-muted text-xs mt-0.5 truncate">
                      {p.policy_type || 'No type'} · {formatDistanceToNow(new Date(p.upload_date), { addSuffix: true })}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent audit log */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <CheckCircle2 size={15} className="text-accent-light" /> Recent Activity
            </div>
            <Link to="/audit-logs" className="text-xs text-accent-light hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>

          {logs.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-secondary text-sm">No activity logged yet.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {logs.slice(0, 7).map(log => (
                <div key={log.id} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-primary font-mono text-xs">{log.action}</p>
                    {log.details && <p className="text-muted text-xs truncate">{log.details}</p>}
                  </div>
                  <span className="text-muted text-[11px] shrink-0">
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
