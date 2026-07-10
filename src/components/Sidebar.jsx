import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Building2, ScrollText,
  ShieldCheck, LogOut, ChevronRight, Gauge, Scale, Users,
  Globe2, Activity, Radar, Bot, FileBarChart2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard'     },
  { to: '/policies',      icon: FileText,         label: 'Policies'      },
  { to: '/organization',  icon: Building2,         label: 'Organization'  },
  { to: '/audit-logs',    icon: ScrollText,        label: 'Audit Logs'   },
]

const NAV_PHASE2 = [
  { to: '/risk-dashboard',       icon: Gauge,        label: 'Risk Dashboard'      },
  { to: '/gap-analysis',         icon: Scale,        label: 'Gap Analysis'        },
  { to: '/vendor-risk',          icon: Users,        label: 'Vendor Risk'         },
  { to: '/website-scanner',      icon: Globe2,       label: 'Website Scanner'     },
  { to: '/anomalies',            icon: Activity,     label: 'Anomaly Detection'   },
  { to: '/regulatory-changes',   icon: Radar,        label: 'Regulatory Changes'  },
  { to: '/assistant',            icon: Bot,          label: 'Pak-Reg Assistant'   },
  { to: '/reports',              icon: FileBarChart2, label: 'Reports & Audit'    },
]

const ROLE_LABELS = {
  admin:               'Admin',
  compliance_officer:  'Compliance Officer',
  auditor:             'Auditor',
  member:              'Member',
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/auth')
  }

  return (
    <aside className="w-60 shrink-0 h-screen bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <div>
            <span className="text-primary font-semibold text-sm tracking-tight">PakComply</span>
            <p className="text-muted text-[10px] leading-none mt-0.5">Regulatory Intelligence</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-muted text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
          Platform
        </p>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={16} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}

        <p className="text-muted text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-5">
          Phase 2 · AI Intelligence
        </p>
        {NAV_PHASE2.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={16} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* User strip */}
      <div className="px-3 pb-4 border-t border-border pt-3 space-y-1">
        <div className="px-3 py-2.5 rounded-lg bg-elevated">
          <p className="text-primary text-sm font-medium truncate">{user?.name}</p>
          <p className="text-muted text-xs truncate">{user?.email}</p>
          <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium bg-accent/15 text-accent-light px-1.5 py-0.5 rounded">
            {ROLE_LABELS[user?.role] || user?.role}
          </span>
        </div>
        <button onClick={handleLogout} className="btn-ghost w-full justify-start text-danger hover:text-danger hover:bg-danger/10">
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
