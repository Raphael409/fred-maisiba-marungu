// src/components/admin/Sidebar.jsx

import { signOut } from '@/firebase/auth'
import {
  Calendar,
  CalendarDays,
  FolderKanban,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  Newspaper,
  Users
} from 'lucide-react'
import toast from 'react-hot-toast'
import { NavLink } from 'react-router-dom'

const navItems = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
    ],
  },
  {
    group: 'Content',
    items: [
      { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
      { label: 'News', to: '/admin/news', icon: Newspaper },
      { label: 'Events', to: '/admin/events', icon: Calendar },
      { label: 'Gallery', to: '/admin/gallery', icon: Image },
    ],
  },
  {
    group: 'Community',
    items: [
      { label: 'Volunteers', to: '/admin/volunteers', icon: Users },
      { label: 'Messages', to: '/admin/messages', icon: MessageSquare },
      { label: 'Newsletter', to: '/admin/newsletter', icon: Mail },
    ],
  },
  {
    group: 'Tools',
    items: [
      { label: 'Calendar', to: '/admin/calendar', icon: CalendarDays },
    ],
  },
]

export default function Sidebar({ onClose }) {
  async function handleSignOut() {
    try {
      await signOut()
      toast.success('Signed out.')
    } catch {
      toast.error('Failed to sign out.')
    }
  }

  return (
    <aside className="flex flex-col h-full bg-primary text-white w-64 flex-shrink-0">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
            <span className="font-heading font-bold text-white text-xs">FM</span>
          </div>
          <div>
            <p className="font-heading font-bold text-white text-sm leading-tight">Fred Maisiba</p>
            <p className="text-white/50 text-[10px] uppercase tracking-wide">Campaign Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navItems.map(group => (
          <div key={group.group}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 px-3 mb-1.5">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ label, to, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${isActive
                      ? 'bg-accent text-white font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>

    </aside>
  )
}