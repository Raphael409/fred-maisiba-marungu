// src/pages/admin/Login.jsx
import Button from '@/components/shared/Button'
import Input from '@/components/shared/Input'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/context/AuthContext'
import { signIn } from '@/firebase/auth'
import { Lock } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAdmin, loading: authLoading } = useAuth()

  const from = location.state?.from?.pathname || '/admin'

  // Wait for auth to finish loading, then redirect if already logged in as admin
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate(from, { replace: true })
    }
  }, [authLoading, user, isAdmin, from, navigate])

  // Show spinner while auth state is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
      // Don't navigate here — let the useEffect above handle it
      // once AuthContext finishes the isAdmin check
      toast.success('Success!')
    } catch {
      toast.error('Invalid email or password.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-card-hover p-8 animate-slide-up">

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-4">
            <Lock size={24} className="text-secondary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-primary">Admin Login</h1>
          <p className="text-neutral-muted text-sm mt-1">Fred Marungu Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@campaign.org"
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
          <Button
            type="submit"
            loading={loading}
            className="w-full mt-2"
            size="lg"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-xs text-center text-neutral-muted mt-6">
          Access restricted to authorised administrators only.
        </p>
      </div>
    </div>
  )
}