// src/components/admin/Topbar.jsx

import { useAuth } from '@/context/AuthContext'
import { signOut } from '@/firebase/auth'
import { Bell, ChevronDown, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth()
  const [dropOpen, setDropOpen] = useState(false)

  async function handleSignOut() {
    try { await signOut(); toast.success('Signed out.') }
    catch { toast.error('Failed to sign out.') }
  }

  return (
    <header className="h-16 bg-secondary border-b border-white/10 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">

      {/* Left — hamburger (mobile) + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <div>
          <p className="font-heading font-bold text-white text-sm leading-tight">
            Campaign Admin
          </p>
          <p className="text-white/50 text-[10px] uppercase tracking-wide hidden sm:block">
            Fred Maisiba Marungu — Bogeka Ward MCA
          </p>
        </div>
      </div>

      {/* Right — user menu */}
      <div className="flex items-center gap-3">

        {/* Notification bell placeholder */}
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
          <Bell size={18} />
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropOpen(v => !v)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full pl-2 pr-3 py-1.5 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <span className="text-white text-sm font-medium hidden sm:block max-w-[120px] truncate">
              {user?.email?.split('@')[0] || 'Admin'}
            </span>
            <ChevronDown size={14} className="text-white/60" />
          </button>

          {dropOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-float border border-neutral-border py-1.5 z-20">
                <div className="px-4 py-2.5 border-b border-neutral-border">
                  <p className="text-xs font-semibold text-neutral-dark truncate">{user?.email}</p>
                  <p className="text-[10px] text-neutral-muted mt-0.5">Administrator</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}