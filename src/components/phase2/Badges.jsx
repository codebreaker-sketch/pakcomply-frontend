import { AlertTriangle, AlertOctagon, Info, CheckCircle2 } from 'lucide-react'

const SEVERITY = {
  critical: { label: 'Critical', cls: 'bg-danger/15 text-danger',   icon: AlertOctagon },
  high:     { label: 'High',     cls: 'bg-danger/15 text-danger',   icon: AlertTriangle },
  medium:   { label: 'Medium',   cls: 'bg-warning/15 text-warning', icon: AlertTriangle },
  low:      { label: 'Low',      cls: 'bg-success/15 text-success', icon: Info },
}

export function SeverityBadge({ severity }) {
  const cfg = SEVERITY[severity] || SEVERITY.low
  const Icon = cfg.icon
  return (
    <span className={`badge ${cfg.cls}`}>
      <Icon size={10} /> {cfg.label}
    </span>
  )
}

const RISK_LEVEL = {
  critical: { label: 'Critical', cls: 'bg-danger/15 text-danger' },
  high:     { label: 'High',     cls: 'bg-danger/15 text-danger' },
  medium:   { label: 'Medium',   cls: 'bg-warning/15 text-warning' },
  low:      { label: 'Low',      cls: 'bg-success/15 text-success' },
}

export function RiskLevelBadge({ level }) {
  const cfg = RISK_LEVEL[level] || RISK_LEVEL.low
  return <span className={`badge ${cfg.cls}`}>{cfg.label} Risk</span>
}

const GAP_TYPE = {
  missing: { label: 'Missing',  cls: 'bg-danger/15 text-danger' },
  partial: { label: 'Partial',  cls: 'bg-warning/15 text-warning' },
  matched: { label: 'Matched',  cls: 'bg-success/15 text-success' },
}

export function GapTypeBadge({ type }) {
  const cfg = GAP_TYPE[type] || GAP_TYPE.partial
  const Icon = type === 'matched' ? CheckCircle2 : AlertTriangle
  return (
    <span className={`badge ${cfg.cls}`}>
      <Icon size={10} /> {cfg.label}
    </span>
  )
}
