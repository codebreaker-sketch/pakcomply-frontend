import { useState, useEffect } from 'react'
import { ScrollText, RefreshCw, Loader2, Search } from 'lucide-react'
import { getAuditLogs } from '../api/organizations'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const ACTION_COLOR = {
  'user.signup':     'text-success',
  'user.login':      'text-accent-light',
  'user.role_update':'text-warning',
  'policy.upload':   'text-info',
  'policy.reprocess':'text-warning',
  'policy.delete':   'text-danger',
  'policy.update':   'text-secondary',
  'organization.create': 'text-success',
  'organization.update': 'text-secondary',
}

export default function AuditLogsPage() {
  const [logs, setLogs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  const load = async () => {
    setLoading(true)
    try { const r = await getAuditLogs(200); setLogs(r.data) }
    catch { toast.error('Failed to load audit logs.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const filtered = logs.filter(l =>
    l.action.includes(search) ||
    (l.details || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.entity_type || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-7 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Audit Logs</h1>
          <p className="text-secondary text-sm mt-0.5">{logs.length} entries recorded</p>
        </div>
        <button onClick={load} className="btn-ghost"><RefreshCw size={14} /> Refresh</button>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input className="input pl-8" placeholder="Filter by action, type…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-accent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <ScrollText size={28} className="text-muted" />
            <p className="text-secondary text-sm">No audit logs found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  {['Action', 'Entity', 'Details', 'IP Address', 'Timestamp'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-muted py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => (
                  <tr key={log.id} className="table-row">
                    <td className="py-3 px-4">
                      <span className={`font-mono text-xs font-medium ${ACTION_COLOR[log.action] || 'text-secondary'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted text-xs">
                      {log.entity_type && (
                        <span className="bg-elevated px-1.5 py-0.5 rounded text-secondary">{log.entity_type}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-secondary text-xs max-w-xs truncate">{log.details || '—'}</td>
                    <td className="py-3 px-4 text-muted font-mono text-xs">{log.ip_address || '—'}</td>
                    <td className="py-3 px-4 text-muted text-xs whitespace-nowrap">
                      {format(new Date(log.timestamp), 'PPp')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
