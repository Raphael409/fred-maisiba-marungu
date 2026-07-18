// src/pages/admin/Login.jsx

import { useAuth } from '@/context/AuthContext'
import { signIn } from '@/firebase/auth'
import { Eye, EyeOff, Lock, Mail, ShieldAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)

  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAdmin, loading: authLoading } = useAuth()
  const from = location.state?.from?.pathname || '/admin'

  useEffect(() => {
    if (!authLoading && user && isAdmin) navigate(from, { replace: true })
  }, [authLoading, user, isAdmin, from, navigate])

  useEffect(() => {
    if (!lockedUntil) return
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000)
      if (remaining <= 0) {
        setLockedUntil(null); setAttempts(0); setTimeLeft(0); clearInterval(interval)
      } else { setTimeLeft(remaining) }
    }, 1000)
    return () => clearInterval(interval)
  }, [lockedUntil])

  const isLocked = lockedUntil && Date.now() < lockedUntil

  function formatTime(secs) {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (isLocked) return
    setLoading(true)
    try {
      await signIn(email, password)
      setAttempts(0)
      toast.success('Welcome back!')
    } catch {
      const n = attempts + 1
      setAttempts(n)
      if (n >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS)
        toast.error('Too many failed attempts. Locked for 15 minutes.')
      } else {
        const left = MAX_ATTEMPTS - n
        toast.error(`Invalid credentials. ${left} attempt${left !== 1 ? 's' : ''} remaining.`)
      }
    } finally { setLoading(false) }
  }

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
      <div className="w-10 h-10 border-4 border-neutral-border border-t-secondary rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-card-hover border border-neutral-border overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary px-8 py-7 text-center">
            <div className="w-14 h-14 rounded-full bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-3">
              <Lock size={24} className="text-white" />
            </div>
            <h1 className="font-heading font-bold text-xl text-white">Campaign Admin</h1>
            <p className="text-white/70 text-sm mt-1">Fred Maisiba — Bogeka Ward MCA</p>
          </div>

          <div className="px-8 py-7">

            {isLocked && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                <ShieldAlert size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700">Account temporarily locked</p>
                  <p className="text-xs text-red-600 mt-0.5">
                    Try again in <span className="font-bold tabular-nums">{formatTime(timeLeft)}</span>
                  </p>
                </div>
              </div>
            )}

            {!isLocked && attempts > 0 && attempts < MAX_ATTEMPTS && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-xs text-amber-800 font-medium">
                ⚠️ {MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts !== 1 ? 's' : ''} remaining before lockout.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-xs font-semibold text-neutral-dark mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@campaign.org" required disabled={isLocked} autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-border text-sm text-neutral-dark focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors disabled:opacity-50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-dark mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" required disabled={isLocked} autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-neutral-border text-sm text-neutral-dark focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors disabled:opacity-50" />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-muted hover:text-neutral-dark transition-colors" aria-label="Toggle password">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading || isLocked || !email || !password}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-secondary text-white font-heading font-bold text-sm rounded-xl hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md mt-2">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : <><Lock size={15} /> Sign In to Dashboard</>}
              </button>

            </form>

            <p className="text-xs text-center text-neutral-muted mt-5">
              Access restricted to authorised campaign administrators only.
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-neutral-muted mt-4">
          Fred Maisiba Marungu Campaign &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}