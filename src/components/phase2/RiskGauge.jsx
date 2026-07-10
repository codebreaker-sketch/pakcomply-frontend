const LEVELS = [
  { min: 90, label: 'Excellent', color: '#16A34A' },
  { min: 70, label: 'Good',      color: '#0D9488' },
  { min: 50, label: 'Fair',      color: '#D97706' },
  { min: 0,  label: 'Poor',      color: '#DC2626' },
]

function levelFor(score) {
  return LEVELS.find(l => score >= l.min) || LEVELS[LEVELS.length - 1]
}

export default function RiskGauge({ score = 0, size = 128, stroke = 10, label }) {
  const level = levelFor(score)
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E2E8F0" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={level.color} strokeWidth={stroke} fill="none"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-primary text-2xl font-bold leading-none">{score}</span>
          <span className="text-muted text-[10px] mt-0.5">/ 100</span>
        </div>
      </div>
      {label && <p className="text-secondary text-xs font-medium">{label}</p>}
      <span className="text-[11px] font-medium" style={{ color: level.color }}>{level.label}</span>
    </div>
  )
}

export { levelFor }
