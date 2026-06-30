// src/routes/ProtectedRoute.jsx
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  // Always wait for auth + isAdmin check to complete before deciding
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-neutral-muted font-body">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Not logged in at all
  if (!user) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location }}
        replace
      />
    )
  }

  // Logged in but not an admin (has Auth account but no admins/{uid} doc)
  if (!isAdmin) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location, error: 'not-admin' }}
        replace
      />
    )
  }

  return children
}