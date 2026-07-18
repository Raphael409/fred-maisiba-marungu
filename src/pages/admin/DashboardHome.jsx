// src/pages/admin/DashboardHome.jsx

import { useEvents } from '@/hooks/useEvents'
import { useGallery } from '@/hooks/useGallery'
import { useNews } from '@/hooks/useNews'
import { useProjects } from '@/hooks/useProjects'
import { useVolunteers } from '@/hooks/useVolunteers'
import { isUpcoming } from '@/utils/formatDate'
import {
  ArrowRight,
  Calendar,
  Clock,
  FolderKanban,
  Image, MessageSquare,
  Newspaper,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

function StatCard({ icon: Icon, label, value, sub, iconBg, to }) {
  return (
    <Link
      to={to}
      className="group bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover border border-neutral-border transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={20} className="text-white" />
        </div>
        <ArrowRight size={14} className="text-neutral-muted group-hover:text-accent transition-colors" />
      </div>
      <p className="font-heading font-bold text-3xl text-neutral-dark tabular-nums">{value}</p>
      <p className="font-heading font-semibold text-sm text-neutral-dark mt-1">{label}</p>
      {sub && <p className="text-xs text-neutral-muted mt-0.5">{sub}</p>}
    </Link>
  )
}

export default function DashboardHome() {
  const { projects } = useProjects()
  const { news } = useNews()
  const { volunteers } = useVolunteers()
  const { events } = useEvents()
  const { galleryItems } = useGallery()

  const completed = projects.filter(p => p.status === 'completed').length
  const ongoing = projects.filter(p => p.status === 'ongoing').length
  const published = news.filter(n => n.isPublished).length
  const drafts = news.filter(n => !n.isPublished).length
  const newVols = volunteers.filter(v => v.status === 'new').length
  const upcoming = events.filter(e => isUpcoming(e.endDateTime)).length

  const recentProjects = [...projects].slice(0, 5)
  const recentVolunteers = [...volunteers].slice(0, 5)
  const upcomingEvents = events.filter(e => isUpcoming(e.endDateTime)).slice(0, 3)

  const stats = [
    { icon: FolderKanban, label: 'Total Projects', value: projects.length, sub: `${completed} completed · ${ongoing} ongoing`, iconBg: 'bg-secondary', to: '/admin/projects' },
    { icon: Newspaper, label: 'News Articles', value: news.length, sub: `${published} published · ${drafts} drafts`, iconBg: 'bg-accent', to: '/admin/news' },
    { icon: Users, label: 'Volunteers', value: volunteers.length, sub: `${newVols} new sign-ups`, iconBg: 'bg-success', to: '/admin/volunteers' },
    { icon: Calendar, label: 'Events', value: events.length, sub: `${upcoming} upcoming`, iconBg: 'bg-secondary', to: '/admin/events' },
    { icon: Image, label: 'Gallery Items', value: galleryItems.length, sub: 'Photos & videos', iconBg: 'bg-accent', to: '/admin/gallery' },
    { icon: MessageSquare, label: 'Messages', value: '—', sub: 'Click to view', iconBg: 'bg-secondary', to: '/admin/messages' },
  ]

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-dark">Dashboard</h1>
        <p className="text-sm text-neutral-muted mt-1">
          Welcome back — overview of the Fred Maisiba campaign platform.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent projects */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-neutral-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-border bg-neutral-bg">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-accent" />
              <h2 className="font-heading font-semibold text-base text-neutral-dark">Recent Projects</h2>
            </div>
            <Link to="/admin/projects" className="text-xs text-accent hover:text-accent-dark font-semibold transition-colors">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-neutral-border">
            {recentProjects.length === 0 ? (
              <p className="text-sm text-neutral-muted px-5 py-8 text-center">No projects yet.</p>
            ) : recentProjects.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                {p.coverImage && (
                  <img src={p.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-dark truncate">{p.title}</p>
                  <p className="text-xs text-neutral-muted truncate">{p.location}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0 ${p.status === 'completed' ? 'bg-success/10 text-success' :
                    p.status === 'ongoing' ? 'bg-accent/10 text-accent-dark' :
                      'bg-neutral-bg text-neutral-muted border border-neutral-border'
                  }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Upcoming events */}
          <div className="bg-white rounded-2xl shadow-card border border-neutral-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-border bg-neutral-bg">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-accent" />
                <h2 className="font-heading font-semibold text-sm text-neutral-dark">Upcoming Events</h2>
              </div>
              <Link to="/admin/events" className="text-xs text-accent hover:text-accent-dark font-semibold">View all →</Link>
            </div>
            <div className="divide-y divide-neutral-border">
              {upcomingEvents.length === 0 ? (
                <p className="text-xs text-neutral-muted px-5 py-6 text-center">No upcoming events.</p>
              ) : upcomingEvents.map(ev => {
                const d = ev.startDateTime?.toDate ? ev.startDateTime.toDate() : new Date(ev.startDateTime)
                return (
                  <div key={ev.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm leading-none">{d.getDate()}</span>
                      <span className="text-white/70 text-[9px] uppercase">{d.toLocaleDateString('en', { month: 'short' })}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-neutral-dark truncate">{ev.title}</p>
                      <p className="text-[10px] text-neutral-muted truncate">{ev.location}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* New volunteers */}
          <div className="bg-white rounded-2xl shadow-card border border-neutral-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-border bg-neutral-bg">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-accent" />
                <h2 className="font-heading font-semibold text-sm text-neutral-dark">New Volunteers</h2>
              </div>
              <Link to="/admin/volunteers" className="text-xs text-accent hover:text-accent-dark font-semibold">View all →</Link>
            </div>
            <div className="divide-y divide-neutral-border">
              {recentVolunteers.length === 0 ? (
                <p className="text-xs text-neutral-muted px-5 py-6 text-center">No volunteers yet.</p>
              ) : recentVolunteers.map(v => (
                <div key={v.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-secondary font-bold text-xs">
                      {v.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-neutral-dark truncate">{v.fullName}</p>
                    <p className="text-[10px] text-neutral-muted truncate">{v.location}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0 ${v.status === 'new' ? 'bg-accent/10 text-accent-dark border border-accent/20' :
                      v.status === 'active' ? 'bg-success/10 text-success border border-success/20' :
                        'bg-neutral-bg text-neutral-muted border border-neutral-border'
                    }`}>
                    {v.status || 'new'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}