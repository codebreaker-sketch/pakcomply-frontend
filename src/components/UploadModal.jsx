import { useState, useRef } from 'react'
import { X, UploadCloud, FileText, Loader2, CheckCircle2 } from 'lucide-react'
import { uploadPolicy } from '../api/policies'
import toast from 'react-hot-toast'

const POLICY_TYPES = [
  'security', 'data_protection', 'hr', 'vendor', 'it_governance',
  'incident_response', 'privacy', 'academic', 'financial', 'other'
]

export default function UploadModal({ onClose, onSuccess }) {
  const [file, setFile]       = useState(null)
  const [name, setName]       = useState('')
  const [type, setType]       = useState('')
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [done, setDone]       = useState(false)
  const inputRef              = useRef()

  const pickFile = (f) => {
    if (!f) return
    setFile(f)
    if (!name) setName(f.name.replace(/\.[^.]+$/, ''))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    pickFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { toast.error('Select a file first.'); return }
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('policy_name', name || file.name)
    if (type) fd.append('policy_type', type)
    try {
      const { data } = await uploadPolicy(fd, setProgress)
      setDone(true)
      toast.success(`"${data.policy_name}" uploaded — processing started.`)
      setTimeout(() => { onSuccess?.(data); onClose() }, 1200)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-primary font-semibold">Upload Policy Document</h3>
            <p className="text-muted text-xs mt-0.5">PDF, DOCX, TXT or ZIP · max 25 MB</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-primary transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
              ${file ? 'border-accent/40 bg-accent/5' : 'border-border hover:border-accent/40 hover:bg-elevated/50'}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileText size={24} className="text-accent-light" />
                <p className="text-primary text-sm font-medium">{file.name}</p>
                <p className="text-muted text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button type="button" onClick={e => { e.stopPropagation(); setFile(null); setName('') }}
                  className="text-danger text-xs hover:underline mt-1">Remove</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <UploadCloud size={28} className="text-muted" />
                <p className="text-secondary text-sm">Drop a file here or <span className="text-accent-light">browse</span></p>
              </div>
            )}
            <input ref={inputRef} type="file" className="hidden"
              accept=".pdf,.docx,.doc,.txt,.zip"
              onChange={e => pickFile(e.target.files[0])} />
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-medium text-secondary mb-1.5 block">Policy Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Information Security Policy v2" required />
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-medium text-secondary mb-1.5 block">Policy Type <span className="text-muted">(optional)</span></label>
            <select className="input" value={type} onChange={e => setType(e.target.value)}>
              <option value="">Select type…</option>
              {POLICY_TYPES.map(t => (
                <option key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
              ))}
            </select>
          </div>

          {/* Progress bar */}
          {uploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-secondary">
                <span>Uploading…</span><span>{progress}%</span>
              </div>
              <div className="w-full bg-elevated rounded-full h-1.5">
                <div className="bg-accent h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center" disabled={uploading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={uploading || done}>
              {done
                ? <><CheckCircle2 size={14} /> Uploaded!</>
                : uploading
                  ? <><Loader2 size={14} className="animate-spin" /> Uploading…</>
                  : <><UploadCloud size={14} /> Upload</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
