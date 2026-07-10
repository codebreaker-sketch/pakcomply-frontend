import { useState, useEffect } from 'react'
import { Building2, Users, Pencil, Check, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getMyOrg, updateMyOrg, listMembers, updateMemberRole } from '../api/organizations'
import { useAuth } from '../context/AuthContext'
import { format } from 'date-fns'

const ROLES = ['admin', 'compliance_officer', 'auditor', 'member']
const ROLE_LABELS = {
  admin: 'Admin', compliance_officer: 'Compliance Officer',
  auditor: 'Auditor', member: 'Member',
}
const ROLE_COLORS = {
  admin: 'text-accent-light bg-accent/15',
  compliance_officer: 'text-success bg-success/15',
  auditor: 'text-warning bg-warning/15',
  member: 'text-secondary bg-elevated',
}

function OrgInfoCard({ org, onUpdated }) {
  const [editing, setEditing] = useState(false)
  const [name, setName]       = useState(org.org_name)
  const [sector, setSector]   = useState(org.sector || '')
  const [saving, setSaving]   = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await updateMyOrg({ org_name: name, sector: sector || null })
      toast.success('Organization updated.')
      onUpdated()
      setEditing(false)
    } catch { toast.error('Update failed.') }
    finally { setSaving(false) }
  }

  return (
    <div className="card space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Building2 size={15} className="text-accent-light" /> Organization Info
        </div>
        {!editing
          ? <button onClick={() => setEditing(true)} className="btn-ghost text-xs"><Pencil size={13} /> Edit</button>
          : <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="btn-ghost text-xs"><X size={13} /> Cancel</button>
              <button onClick={save} disabled={saving} className="btn-primary text-xs py-1.5">
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Save
              </button>
            </div>
        }
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-muted text-xs mb-1.5">Organization Name</p>
          {editing
            ? <input className="input" value={name} onChange={e => setName(e.target.value)} />
            : <p className="text-primary font-medium">{org.org_name}</p>
          }
        </div>
        <div>
          <p className="text-muted text-xs mb-1.5">Sector</p>
          {editing
            ? <input className="input" value={sector} onChange={e => setSector(e.target.value)} placeholder="e.g. education, banking…" />
            : <p className="text-primary">{org.sector || <span className="text-muted">—</span>}</p>
          }
        </div>
        <div>
          <p className="text-muted text-xs mb-1">Organization ID</p>
          <p className="text-secondary font-mono text-xs">{org.id}</p>
        </div>
        <div>
          <p className="text-muted text-xs mb-1">Created</p>
          <p className="text-secondary text-sm">{format(new Date(org.created_at), 'PP')}</p>
        </div>
      </div>
    </div>
  )
}

function MembersTable({ members, currentUserId, onRoleChanged }) {
  const [changingId, setChangingId] = useState(null)

  const handleRoleChange = async (userId, role) => {
    setChangingId(userId)
    try {
      await updateMemberRole(userId, role)
      toast.success('Role updated.')
      onRoleChanged()
    } catch (err) { toast.error(err.response?.data?.detail || 'Failed to update role.') }
    finally { setChangingId(null) }
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2 text-primary font-semibold text-sm">
        <Users size={15} className="text-accent-light" /> Members ({members.length})
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['Name', 'Email', 'Role', 'Joined'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-muted py-2.5 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id} className="table-row">
                <td className="py-3 pr-4 text-primary font-medium">
                  {m.name}
                  {m.id === currentUserId && (
                    <span className="ml-2 text-[10px] text-muted bg-elevated px-1.5 py-0.5 rounded">You</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-secondary text-xs">{m.email}</td>
                <td className="py-3 pr-4">
                  {m.id === currentUserId ? (
                    <span className={`badge ${ROLE_COLORS[m.role]}`}>{ROLE_LABELS[m.role]}</span>
                  ) : (
                    <select
                      value={m.role}
                      disabled={changingId === m.id}
                      onChange={e => handleRoleChange(m.id, e.target.value)}
                      className="bg-elevated border border-border text-secondary text-xs rounded-lg px-2 py-1 outline-none focus:border-accent"
                    >
                      {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                    </select>
                  )}
                </td>
                <td className="py-3 text-muted text-xs">{format(new Date(m.created_at), 'PP')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function OrganizationPage() {
  const { user } = useAuth()
  const [org, setOrg]         = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [oRes, mRes] = await Promise.all([getMyOrg(), listMembers()])
      setOrg(oRes.data)
      setMembers(mRes.data)
    } catch { toast.error('Failed to load organization.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={24} className="animate-spin text-accent" />
    </div>
  )

  if (!org) return (
    <div className="p-7 flex flex-col items-center justify-center gap-3 h-full">
      <Building2 size={36} className="text-muted" />
      <p className="text-secondary">You don't belong to an organization yet.</p>
    </div>
  )

  return (
    <div className="p-7 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-primary">Organization</h1>
        <p className="text-secondary text-sm mt-0.5">Manage your organization's profile and team.</p>
      </div>
      <OrgInfoCard org={org} onUpdated={load} />
      <MembersTable members={members} currentUserId={user?.id} onRoleChanged={load} />
    </div>
  )
}
