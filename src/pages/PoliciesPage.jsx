import { useState, useEffect } from 'react'
import {
  Plus, FileText, Trash2, RefreshCw, Eye,
  ScanText, X, Loader2, Search
} from 'lucide-react'
import toast from 'react-hot-toast'
import { listPolicies, getPolicyText, reprocessPolicy, deletePolicy } from '../api/policies'
import StatusBadge, { PulseDot } from '../components/StatusBadge'
import UploadModal from '../components/UploadModal'
import { formatDistanceToNow, format } from 'date-fns'

// function TextDrawer({ policy, onClose }) {
//   const [data, setData]     = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     getPolicyText(policy.id)
//       .then(r => setData(r.data))
//       .catch(() => toast.error('Could not load extracted text.'))
//       .finally(() => setLoading(false))
//   }, [policy.id])

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50 animate-fade-in">
//       <div className="w-full max-w-2xl bg-surface border-l border-border h-full flex flex-col animate-slide-up">
//         <div className="flex items-center justify-between p-5 border-b border-border">
//           <div>
//             <h3 className="text-primary font-semibold">{policy.policy_name}</h3>
//             <div className="flex items-center gap-3 mt-1">
//               <StatusBadge status={data?.status || policy.status} />
//               {data?.used_ocr && <span className="text-[11px] text-warning bg-warning/10 px-2 py-0.5 rounded">OCR used</span>}
//               {data?.page_count && <span className="text-muted text-xs">{data.page_count} pages</span>}
//             </div>
//           </div>
//           <button onClick={onClose} className="text-muted hover:text-primary"><X size={18} /></button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-5">
//           {loading ? (
//             <div className="flex items-center justify-center h-full">
//               <Loader2 size={24} className="animate-spin text-accent" />
//             </div>
//           ) : data?.extracted_text ? (
//             <div>
//               <p className="text-muted text-xs mb-3 flex items-center gap-1.5">
//                 <ScanText size={11} /> Extracted text · processed {data.processed_at ? format(new Date(data.processed_at), 'PPp') : '—'}
//               </p>
//               <pre className="font-mono text-xs text-secondary leading-relaxed whitespace-pre-wrap bg-elevated rounded-xl p-4 border border-border">
//                 {data.extracted_text}
//               </pre>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
//               <ScanText size={28} className="text-muted" />
//               <p className="text-secondary text-sm">
//                 {data?.processing_error || (data?.status === 'processing' ? 'Processing in progress…' : 'No text extracted yet.')}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

function TextDrawer({ policy, onClose }) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchText = (silent = false) => {
    if (!silent) setLoading(true)
    return getPolicyText(policy.id)
      .then(r => setData(r.data))
      .catch(() => { if (!silent) toast.error('Could not load extracted text.') })
      .finally(() => { if (!silent) setLoading(false) })
  }

  useEffect(() => {
    fetchText()
  }, [policy.id])

  // Auto-poll every 2s while this policy is still uploaded/processing,
  // so the drawer updates the moment the backend finishes (or fails)
  // without the user needing to close and reopen it.
  useEffect(() => {
    const status = data?.status || policy.status
    const isPending = status === 'uploaded' || status === 'processing'
    if (!isPending) return

    const interval = setInterval(() => fetchText(true), 2000) // silent = no spinner flicker
    return () => clearInterval(interval)
  }, [data?.status, policy.id])

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50 animate-fade-in">
      <div className="w-full max-w-2xl bg-surface border-l border-border h-full flex flex-col animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-primary font-semibold">{policy.policy_name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge status={data?.status || policy.status} />
              {data?.used_ocr && <span className="text-[11px] text-warning bg-warning/10 px-2 py-0.5 rounded">OCR used</span>}
              {data?.page_count && <span className="text-muted text-xs">{data.page_count} pages</span>}
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-primary"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={24} className="animate-spin text-accent" />
            </div>
          ) : data?.extracted_text ? (
            <div>
              <p className="text-muted text-xs mb-3 flex items-center gap-1.5">
                <ScanText size={11} /> Extracted text · processed {data.processed_at ? format(new Date(data.processed_at), 'PPp') : '—'}
              </p>
              <pre className="font-mono text-xs text-secondary leading-relaxed whitespace-pre-wrap bg-elevated rounded-xl p-4 border border-border">
                {data.extracted_text}
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
              <ScanText size={28} className="text-muted" />
              <p className="text-secondary text-sm">
                {data?.processing_error || (data?.status === 'processing' ? 'Processing in progress…' : 'No text extracted yet.')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PoliciesPage() {
  const [policies, setPolicies]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [viewing, setViewing]     = useState(null)
  const [search, setSearch]       = useState('')

  // const load = async () => {
  //   setLoading(true)
  //   try { const r = await listPolicies(); setPolicies(r.data) }
  //   catch { toast.error('Failed to load policies.') }
  //   finally { setLoading(false) }
  // }
  const load = async (silent = false) => {
    if (!silent) setLoading(true)
    try { const r = await listPolicies(); setPolicies(r.data) }
    catch { if (!silent) toast.error('Failed to load policies.') }
    finally { if (!silent) setLoading(false) }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const hasPending = policies.some(p => p.status === 'uploaded' || p.status === 'processing')
    if (!hasPending) return

    const interval = setInterval(() => load(true), 2000) // silent = no loading spinner flicker
    return () => clearInterval(interval)
  }, [policies])

  const handleReprocess = async (p) => {
    try {
      await reprocessPolicy(p.id)
      toast.success(`Reprocessing "${p.policy_name}"…`)
      load()
    } catch { toast.error('Reprocess failed.') }
  }

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.policy_name}"? This cannot be undone.`)) return
    try {
      await deletePolicy(p.id)
      toast.success('Policy deleted.')
      setPolicies(ps => ps.filter(x => x.id !== p.id))
    } catch { toast.error('Delete failed.') }
  }

  const filtered = policies.filter(p =>
    p.policy_name.toLowerCase().includes(search.toLowerCase()) ||
    (p.policy_type || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-7 space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Policies</h1>
          <p className="text-secondary text-sm mt-0.5">{policies.length} document{policies.length !== 1 ? 's' : ''} in your repository</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="btn-ghost"><RefreshCw size={14} /></button>
          <button onClick={() => setShowUpload(true)} className="btn-primary">
            <Plus size={15} /> Upload Policy
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input className="input pl-8" placeholder="Search policies…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={24} className="animate-spin text-accent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <FileText size={36} className="text-muted" />
          <p className="text-secondary text-base">{search ? 'No policies match your search.' : 'No policies uploaded yet.'}</p>
          {!search && (
            <button onClick={() => setShowUpload(true)} className="btn-primary mt-1">
              <Plus size={14} /> Upload your first policy
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="card hover:border-border/80 transition-all group">
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <PulseDot status={p.status} />
                  <StatusBadge status={p.status} />
                </div>
                {p.used_ocr && (
                  <span className="text-[10px] font-medium text-warning bg-warning/10 px-1.5 py-0.5 rounded">OCR</span>
                )}
              </div>

              {/* Name + type */}
              <div className="mb-4">
                <h3 className="text-primary font-semibold text-sm leading-snug line-clamp-2">{p.policy_name}</h3>
                {p.policy_type && (
                  <span className="text-muted text-xs mt-1 inline-block capitalize">
                    {p.policy_type.replace(/_/g, ' ')}
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="text-muted text-[11px] space-y-1 mb-4 border-t border-border pt-3">
                <div className="flex justify-between">
                  <span>Uploaded</span>
                  <span className="text-secondary">{formatDistanceToNow(new Date(p.upload_date), { addSuffix: true })}</span>
                </div>
                {p.page_count && (
                  <div className="flex justify-between">
                    <span>Pages</span><span className="text-secondary">{p.page_count}</span>
                  </div>
                )}
                {p.file_size_bytes && (
                  <div className="flex justify-between">
                    <span>Size</span>
                    <span className="text-secondary">{(p.file_size_bytes / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => setViewing(p)} className="btn-ghost flex-1 justify-center text-xs py-1.5">
                  <Eye size={13} /> View Text
                </button>
                <button onClick={() => handleReprocess(p)} title="Reprocess" className="btn-ghost px-2 py-1.5">
                  <RefreshCw size={13} />
                </button>
                <button onClick={() => handleDelete(p)} title="Delete" className="btn-ghost px-2 py-1.5 text-danger hover:bg-danger/10 hover:text-danger">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => load()}
        />
      )}

      {viewing && <TextDrawer policy={viewing} onClose={() => setViewing(null)} />}
    </div>
  )
}
