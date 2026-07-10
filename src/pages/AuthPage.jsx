import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { login, signup } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const [mode, setMode]         = useState('login')   // 'login' | 'signup'
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [form, setForm]         = useState({ name: '', email: '', password: '', org_name: '' })

  const { loginSave } = useAuth()
  const navigate       = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fn   = mode === 'login' ? login : signup
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, org_name: form.org_name || undefined }

      const { data } = await fn(payload)
      loginSave(data)
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created — welcome to PakComply!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] bg-surface border-r border-border p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <span className="text-primary font-semibold text-lg tracking-tight">PakComply</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-primary leading-tight mb-4">
            Compliance<br />
            <span className="text-accent-light">Intelligence,</span><br />
            Automated.
          </h1>
          <p className="text-secondary text-base leading-relaxed max-w-xs">
            Align your organization with PECA, HEC, PTA, SBP, and SECP regulations — with AI-powered gap detection and audit-ready reporting.
          </p>

          {/* Feature list */}
          <div className="mt-8 space-y-3">
            {[
              'Policy compliance assessment',
              'Document OCR & text extraction',
              'Role-based access control',
              'Comprehensive audit logging',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-muted text-xs">
          Built for Pakistani regulatory frameworks · Phase 1 Platform
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <ShieldCheck size={15} className="text-white" />
            </div>
            <span className="text-primary font-semibold">PakComply</span>
          </div>

          <h2 className="text-2xl font-bold text-primary mb-1">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="text-secondary text-sm mb-7">
            {mode === 'login'
              ? "Don't have an account? "
              : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setForm({ name:'', email:'', password:'', org_name:'' }) }}
              className="text-accent-light hover:underline font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-medium text-secondary mb-1.5 block">Full Name</label>
                <input className="input" type="text" placeholder="Aimen Khan" value={form.name} onChange={set('name')} required />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-secondary mb-1.5 block">Email Address</label>
              <input className="input" type="email" placeholder="you@organization.pk" value={form.email} onChange={set('email')} required />
            </div>

            <div>
              <label className="text-xs font-medium text-secondary mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPass ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'}
                  value={form.password}
                  onChange={set('password')}
                  required
                  minLength={8}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-xs font-medium text-secondary mb-1.5 block">
                  Organization Name <span className="text-muted">(optional — creates a new org and makes you admin)</span>
                </label>
                <input className="input" type="text" placeholder="Air University, State Bank of Pakistan…" value={form.org_name} onChange={set('org_name')} />
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-6 py-2.5">
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> {mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
                : <>{mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={15} /></>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
