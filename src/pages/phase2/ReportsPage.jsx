import { useState, useEffect } from 'react'
import { FileBarChart2, Download, Plus, X, Loader2, FileCheck2 } from 'lucide-react'
import { listReports, generateReport, downloadReport } from '../../api/phase2'
import { mockReports } from '../../api/mockData'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const REPORT_TYPES = [
  'HEC Quality Audit', 'PTA Cybersecurity Audit', 'SBP Compliance Inspection',
  'SECP Annual Review', 'Vendor Risk Summary', 'Executive Summary',
]

function GenerateModal({ onClose, onCreated, isDemo }) {
  const [type, setType]     = useState(REPORT_TYPES[0])
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    setSaving(true)
    try {
      if (!isDemo) {
        const r = await generateReport({ report_type: type })
        onCreated(r.data)
      } else {
        await new Promise(r => setTimeout(r, 900))
        onCreated({ id: Date.now(), report_type: type, generated_at: new Date().toISOString(), status: 'ready' })
      }
      toast.success('Report generation started.')
    } catch {
      toast.error('Could not generate report.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-5 space-y-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <h3 className="text-primary font-semibold">Generate Report</h3>
          <button onClick={onClose} className="text-muted hover:text-primary"><X size={18} /></button>
        </div>
        <select className="input" value={type} onChange={e => setType(e.target.value)}>
          {REPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={submit} disabled={saving} className="btn-primary w-full justify-center">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <FileBarChart2 size={14} />}
          Generate
        </button>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showGen, setShowGen] = useState(false)
  const [isDemo, setIsDemo]   = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const r = await listReports()
      setReports(r.data)
      setIsDemo(false)
    } catch {
      setReports(mockReports)
      setIsDemo(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const download = async (r) => {
    if (isDemo) { toast('Report download will work once the backend is connected.'); return }
    try {
      const res = await downloadReport(r.id)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `${r.report_type}.pdf`
      a.click()
    } catch {
      toast.error('Could not download report.')
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
          <h1 className="text-2xl font-bold text-primary">Reporting & Audit</h1>
          <p className="text-secondary text-sm mt-1">
            One-click, regulator-ready reports with evidence mapping to specific clauses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDemo && <span className="badge bg-warning/15 text-warning">Demo data — backend not connected</span>}
          <button onClick={() => setShowGen(true)} className="btn-primary"><Plus size={14} /> Generate Report</button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted text-xs uppercase tracking-wider border-b border-border">
              <th className="px-5 py-3 font-medium">Report</th>
              <th className="px-5 py-3 font-medium">Generated</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="table-row">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <FileBarChart2 size={14} className="text-muted" /> {r.report_type}
                  </div>
                </td>
                <td className="px-5 py-3 text-muted text-xs">{format(new Date(r.generated_at), 'PPp')}</td>
                <td className="px-5 py-3">
                  {r.status === 'ready'
                    ? <span className="badge badge-processed"><FileCheck2 size={10} /> Ready</span>
                    : <span className="badge badge-processing"><Loader2 size={10} className="animate-spin" /> Generating</span>}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => download(r)}
                    disabled={r.status !== 'ready'}
                    className="btn-ghost ml-auto disabled:opacity-40"
                  >
                    <Download size={13} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reports.length === 0 && (
          <div className="py-10 text-center">
            <FileBarChart2 size={26} className="text-muted mx-auto mb-2" />
            <p className="text-secondary text-sm">No reports generated yet.</p>
          </div>
        )}
      </div>

      {showGen && (
        <GenerateModal
          isDemo={isDemo}
          onClose={() => setShowGen(false)}
          onCreated={(r) => { setReports(rs => [r, ...rs]); setShowGen(false) }}
        />
      )}
    </div>
  )
}
