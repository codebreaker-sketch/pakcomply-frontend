import { Clock, CheckCircle2, XCircle, Loader2, Upload } from 'lucide-react'

const CONFIG = {
  uploaded:   { label: 'Uploaded',   cls: 'badge-uploaded',   icon: Upload      },
  processing: { label: 'Processing', cls: 'badge-processing', icon: Loader2     },
  processed:  { label: 'Processed',  cls: 'badge-processed',  icon: CheckCircle2},
  failed:     { label: 'Failed',     cls: 'badge-failed',     icon: XCircle     },
}

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] || CONFIG.uploaded
  const Icon = cfg.icon
  return (
    <span className={`badge ${cfg.cls}`}>
      <Icon size={10} className={status === 'processing' ? 'animate-spin' : ''} />
      {cfg.label}
    </span>
  )
}

// The signature pulse dot — changes color + animation based on status
export function PulseDot({ status, size = 10 }) {
  const colors = {
    uploaded:   'bg-muted',
    processing: 'bg-warning animate-pulse-ring',
    processed:  'bg-success animate-pulse-ring',
    failed:     'bg-danger',
  }
  return (
    <span
      className={`inline-block rounded-full ${colors[status] || 'bg-muted'}`}
      style={{ width: size, height: size }}
    />
  )
}
