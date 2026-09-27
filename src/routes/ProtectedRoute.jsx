// src/routes/ProtectedRoute.jsx
// Wraps admin routes — redirects to /admin/login if not authenticated or not admin.
// Shows a loading spinner while auth state is being determined.

import { useAuth } from '@/context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  // Still determining auth state — show spinner, don't redirect yet
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neutral-border border-t-secondary rounded-full animate-spin" />
          <p className="text-sm text-neutral-muted font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in → redirect to login, remember where they were trying to go
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Logged in but not an admin → redirect to login with a message
  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location, error: 'not-admin' }} replace />
  }

  // Authenticated admin — render the protected content
  return children
}