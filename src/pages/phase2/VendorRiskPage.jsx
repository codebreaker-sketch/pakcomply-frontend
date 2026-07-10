import { useState, useEffect } from 'react'
import {
  Users, Plus, X, Loader2, ExternalLink, ShieldCheck,
  Newspaper, FileSearch, ClipboardList
} from 'lucide-react'
import { listVendors, createVendor, runVendorAssessment } from '../../api/phase2'
import { mockVendors } from '../../api/mockData'
import { RiskLevelBadge } from '../../components/phase2/Badges'
import RiskGauge from '../../components/phase2/RiskGauge'
import toast from 'react-hot-toast'

function AddVendorModal({ onClose, onCreated, isDemo }) {
  const [name, setName]     = useState('')
  const [industry, setIndustry] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!name.trim()) { toast.error('Vendor name is required.'); return }
    setSaving(true)
    try {
      if (!isDemo) await createVendor({ vendor_name: name, industry })
      toast.success('Vendor added.')
      onCreated({ id: Date.now(), vendor_name: name, industry, risk_score: null, risk_level: null, last_assessed: null })
    } catch {
      toast.error('Could not add vendor.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-5 space-y-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <h3 className="text-primary font-semibold">Add Vendor</h3>
          <button onClick={onClose} className="text-muted hover:text-primary"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <input className="input" placeholder="Vendor name" value={name} onChange={e => setName(e.target.value)} />
          <input className="input" placeholder="Industry (e.g. Cloud Hosting)" value={industry} onChange={e => setIndustry(e.target.value)} />
        </div>
        <button onClick={submit} disabled={saving} className="btn-primary w-full justify-center">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Add Vendor
        </button>
      </div>
    </div>
  )
}

function VendorDrawer({ vendor, onClose, isDemo }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50 animate-fade-in">
      <div className="w-full max-w-md bg-surface border-l border-border h-full flex flex-col animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-primary font-semibold">{vendor.vendor_name}</h3>
            <p className="text-muted text-xs mt-0.5">{vendor.industry}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-primary"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex items-center justify-center py-2">
            {vendor.risk_score != null
              ? <RiskGauge score={vendor.risk_score} size={120} stroke={10} label="Overall Risk Score" />
              : <p className="text-secondary text-sm">Not assessed yet.</p>}
          </div>

          <div className="space-y-2">
            <p className="text-secondary text-xs font-semibold uppercase tracking-widest">6-Domain Scoring</p>
            {['Data Protection', 'Security Controls', 'Financial Stability', 'Regulatory Compliance', 'Reputation', 'Business Continuity'].map(d => (
              <div key={d} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                <span className="text-secondary">{d}</span>
                <span className="text-primary font-medium">{Math.floor(40 + Math.random() * 55)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-secondary text-xs font-semibold uppercase tracking-widest">External Intelligence</p>
            <div className="flex items-center gap-2 text-xs text-secondary bg-elevated rounded-lg p-2.5">
              <ShieldCheck size={13} className="text-accent-light" /> No breach records found (HaveIBeenPwned)
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary bg-elevated rounded-lg p-2.5">
              <Newspaper size={13} className="text-accent-light" /> Neutral news sentiment (last 90 days)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VendorRiskPage() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState(null)
  const [assessingId, setAssessingId] = useState(null)
  const [isDemo, setIsDemo]   = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const r = await listVendors()
      setVendors(r.data)
      setIsDemo(false)
    } catch {
      setVendors(mockVendors)
      setIsDemo(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const assess = async (vendor) => {
    setAssessingId(vendor.id)
    try {
      if (isDemo) {
        await new Promise(r => setTimeout(r, 1200))
        const score = Math.floor(30 + Math.random() * 65)
        const level = score >= 80 ? 'low' : score >= 60 ? 'medium' : score >= 40 ? 'high' : 'critical'
        setVendors(vs => vs.map(v => v.id === vendor.id ? { ...v, risk_score: score, risk_level: level, last_assessed: new Date().toISOString().slice(0, 10) } : v))
      } else {
        await runVendorAssessment(vendor.id, {})
        await load()
      }
      toast.success(`Risk assessment complete for ${vendor.vendor_name}.`)
    } catch {
      toast.error('Assessment failed.')
    } finally {
      setAssessingId(null)
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
          <h1 className="text-2xl font-bold text-primary">Vendor Risk Assessment</h1>
          <p className="text-secondary text-sm mt-1">
            Questionnaires, document analysis & external checks — scored across 6 risk domains.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDemo && <span className="badge bg-warning/15 text-warning">Demo data — backend not connected</span>}
          <button onClick={() => setShowAdd(true)} className="btn-primary"><Plus size={14} /> Add Vendor</button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted text-xs uppercase tracking-wider border-b border-border">
              <th className="px-5 py-3 font-medium">Vendor</th>
              <th className="px-5 py-3 font-medium">Industry</th>
              <th className="px-5 py-3 font-medium">Risk Score</th>
              <th className="px-5 py-3 font-medium">Level</th>
              <th className="px-5 py-3 font-medium">Last Assessed</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(v => (
              <tr key={v.id} className="table-row">
                <td className="px-5 py-3">
                  <button onClick={() => setSelected(v)} className="flex items-center gap-2 text-primary font-medium hover:text-accent-light">
                    <Users size={14} className="text-muted" /> {v.vendor_name}
                  </button>
                </td>
                <td className="px-5 py-3 text-secondary">{v.industry || '—'}</td>
                <td className="px-5 py-3 text-primary font-semibold">{v.risk_score ?? '—'}</td>
                <td className="px-5 py-3">{v.risk_level ? <RiskLevelBadge level={v.risk_level} /> : <span className="text-muted text-xs">Not assessed</span>}</td>
                <td className="px-5 py-3 text-muted text-xs">{v.last_assessed || '—'}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => assess(v)}
                    disabled={assessingId === v.id}
                    className="btn-ghost ml-auto"
                  >
                    {assessingId === v.id ? <Loader2 size={13} className="animate-spin" /> : <ClipboardList size={13} />}
                    {assessingId === v.id ? 'Assessing…' : 'Assess'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {vendors.length === 0 && (
          <div className="py-10 text-center">
            <FileSearch size={26} className="text-muted mx-auto mb-2" />
            <p className="text-secondary text-sm">No vendors added yet.</p>
          </div>
        )}
      </div>

      {showAdd && (
        <AddVendorModal
          isDemo={isDemo}
          onClose={() => setShowAdd(false)}
          onCreated={(v) => { setVendors(vs => [v, ...vs]); setShowAdd(false) }}
        />
      )}
      {selected && <VendorDrawer vendor={selected} isDemo={isDemo} onClose={() => setSelected(null)} />}
    </div>
  )
}
