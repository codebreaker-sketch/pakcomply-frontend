import { useState, useEffect } from 'react'
import {
  Globe2, ScanSearch, Loader2, ShieldCheck, Scale, Cpu,
  Wrench, ExternalLink, Clock
} from 'lucide-react'
import { listWebsiteScans, runWebsiteScan } from '../../api/phase2'
import { mockWebsiteScans } from '../../api/mockData'
import { SeverityBadge } from '../../components/phase2/Badges'
import RiskGauge from '../../components/phase2/RiskGauge'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const PILLAR_ICON = { Security: ShieldCheck, Legal: Scale, Technology: Cpu }

export default function WebsiteScannerPage() {
  const [scans, setScans]     = useState([])
  const [url, setUrl]         = useState('')
  const [scanning, setScanning] = useState(false)
  const [active, setActive]   = useState(null)
  const [isDemo, setIsDemo]   = useState(false)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const r = await listWebsiteScans()
      setScans(r.data)
      setActive(r.data[0] || null)
      setIsDemo(false)
    } catch {
      setScans(mockWebsiteScans)
      setActive(mockWebsiteScans[0])
      setIsDemo(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const scan = async () => {
    if (!url.trim()) { toast.error('Enter a website URL to scan.'); return }
    setScanning(true)
    try {
      if (isDemo) {
        await new Promise(r => setTimeout(r, 1500))
        const result = { ...mockWebsiteScans[0], id: Date.now(), url, scanned_at: new Date().toISOString() }
        setScans(s => [result, ...s])
        setActive(result)
      } else {
        const r = await runWebsiteScan(url)
        await load()
        setActive(r.data)
      }
      toast.success('Scan complete.')
      setUrl('')
    } catch {
      toast.error('Scan failed. Check the URL and try again.')
    } finally {
      setScanning(false)
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
          <h1 className="text-2xl font-bold text-primary">Website Compliance Scanner</h1>
          <p className="text-secondary text-sm mt-1">
            Three-pillar scan: Legal (PECA 2025), Security (headers, SSL), Technology (outdated libraries).
          </p>
        </div>
        {isDemo && <span className="badge bg-warning/15 text-warning">Demo data — backend not connected</span>}
      </div>

      {/* Scan input */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <ScanSearch size={15} className="text-accent-light" /> Run New Scan
        </div>
        <div className="flex gap-3">
          <input
            className="input flex-1" placeholder="https://your-organization.edu.pk"
            value={url} onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && scan()}
          />
          <button onClick={scan} disabled={scanning} className="btn-primary shrink-0">
            {scanning ? <Loader2 size={14} className="animate-spin" /> : <Globe2 size={14} />}
            {scanning ? 'Scanning…' : 'Scan Website'}
          </button>
        </div>
      </div>

      {!active ? (
        <div className="card py-16 text-center">
          <Globe2 size={28} className="text-muted mx-auto mb-2" />
          <p className="text-secondary text-sm">No scans yet — run your first scan above.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Score summary */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <ExternalLink size={14} className="text-accent-light" /> {active.url}
              </div>
              <span className="text-muted text-xs flex items-center gap-1">
                <Clock size={11} /> {format(new Date(active.scanned_at), 'PPp')}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-6 justify-items-center">
              <RiskGauge score={active.compliance_score} size={100} stroke={9} label="Overall Compliance" />
              <RiskGauge score={active.security_score} size={100} stroke={9} label="Security" />
              <RiskGauge score={active.legal_score} size={100} stroke={9} label="Legal (PECA)" />
            </div>
          </div>

          {/* Findings */}
          <div className="card space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Wrench size={15} className="text-accent-light" /> Findings & Fixes
            </div>
            {active.findings.map((f, i) => {
              const Icon = PILLAR_ICON[f.pillar] || ShieldCheck
              return (
                <div key={i} className="p-3 rounded-lg bg-elevated space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon size={14} className="text-accent-light shrink-0" />
                      <p className="text-primary text-sm font-medium truncate">{f.title}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-muted text-[11px]">{f.pillar}</span>
                      <SeverityBadge severity={f.severity} />
                    </div>
                  </div>
                  <p className="text-secondary text-xs pl-6">{f.fix}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
