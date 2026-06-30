// src/components/admin/Topbar.jsx

import { Menu, LogOut, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { signOut } from '@/firebase/auth'
import toast       from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ onMenuClick }) {
  const { user }   = useAuth()
  const navigate   = useNavigate()

  async function handleSignOut() {
    try {
      await signOut()
      toast.success('Signed out successfully')
      navigate('/admin/login')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  return (
    <header className="h-16 bg-white border-b border-neutral-border flex items-center justify-between px-4 lg:px-8 flex-shrink-0">

      {/* Left: hamburger (mobile) + page label */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-neutral-muted hover:text-primary"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
        <span className="font-heading font-semibold text-primary">
          Admin Dashboard
        </span>
      </div>

      {/* Right: user + sign out */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-muted">
          <User size={16} />
          <span>{user?.email}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm text-neutral-muted hover:text-red-600 transition-colors duration-150 font-medium"
          aria-label="Sign out"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  )
}
