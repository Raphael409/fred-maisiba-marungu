// src/components/admin/Sidebar.jsx

import {
  Calendar,
  CalendarDays, FolderKanban,
  Image,
  LayoutDashboard,
  MessageSquare,
  Newspaper, Users,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Events', to: '/admin/events', icon: CalendarDays },
  { label: 'Calendar', to: '/admin/calendar', icon: Calendar },
  { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
  { label: 'Gallery', to: '/admin/gallery', icon: Image },
  { label: 'News', to: '/admin/news', icon: Newspaper },
  { label: 'Volunteers', to: '/admin/volunteers', icon: Users },
  { label: 'Messages', to: '/admin/messages', icon: MessageSquare },
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Sidebar panel */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-primary flex flex-col
          transform transition-transform duration-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-light">
          <div className="flex items-center gap-2 font-heading font-bold text-neutral-on-dark">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary text-sm font-bold">
              C
            </div>
            <span className="text-sm">Campaign Admin</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-neutral-on-dark-muted hover:text-white p-1"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
          {navItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-heading font-medium text-sm transition-colors duration-150 ${isActive
                  ? 'bg-secondary text-primary'
                  : 'text-neutral-on-dark-muted hover:bg-primary-light hover:text-neutral-on-dark'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer hint */}
        <div className="px-4 py-3 border-t border-primary-light">
          <p className="text-xs text-neutral-on-dark-muted">
            Marungu Campaign &copy; {new Date().getFullYear()}
          </p>
        </div>
      </aside>
    </>
  )
}
