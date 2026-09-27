// src/pages/public/Projects.jsx

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useProjects } from '@/hooks/useProjects'
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from '@/utils/constants'
import { formatDate } from '@/utils/formatDate'
import {
  ArrowRight,
  Calendar,
  FolderKanban,
  MapPin,
  Search,
  Tag,
  Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const STATUS_COLORS = {
  completed: 'bg-success/10 text-success border-success/20',
  ongoing: 'bg-accent/10 text-accent-dark border-accent/20',
  initiated: 'bg-blue-50 text-blue-700 border-blue-200',
  planned: 'bg-purple-50 text-purple-700 border-purple-200',
  stalled: 'bg-red-50 text-red-600 border-red-200',
}

function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-neutral-border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
        {project.coverImage ? (
          <img src={project.coverImage} alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-neutral-bg flex items-center justify-center">
            <FolderKanban size={32} className="text-neutral-muted" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1">
          <Tag size={10} className="text-secondary" />
          <span className="text-[10px] font-heading font-bold text-secondary uppercase tracking-wide">{project.category}</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[project.status] || STATUS_COLORS.planned}`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-1 text-accent text-xs font-medium truncate">
            <MapPin size={11} /><span className="truncate">{project.location || 'Bogeka Ward'}</span>
          </div>
          {project.startDate && (
            <div className="flex items-center gap-1 text-neutral-muted text-xs flex-shrink-0">
              <Calendar size={11} /><span>{formatDate(project.startDate)}</span>
            </div>
          )}
        </div>
        <h3 className="font-heading font-bold text-base text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-sm text-neutral-muted leading-relaxed line-clamp-2 mb-4 flex-1">
          {project.impactSummary || project.description || 'No description available.'}
        </p>
        {project.beneficiaries && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-muted mb-4">
            <Users size={12} className="text-secondary" />
            <span><strong className="text-primary">{project.beneficiaries.toLocaleString()}</strong> beneficiaries</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-border">
          <span className="text-xs font-heading font-semibold text-secondary group-hover:text-accent transition-colors">View Details</span>
          <div className="w-7 h-7 rounded-full bg-secondary/8 group-hover:bg-accent flex items-center justify-center transition-colors duration-200">
            <ArrowRight size={13} className="text-secondary group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Projects() {
  const { projects, loading } = useProjects()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const filtered = useMemo(() => {
    let r = [...projects]
    if (search) r = r.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()) || p.location?.toLowerCase().includes(search.toLowerCase()))
    if (category !== 'all') r = r.filter(p => p.category === category)
    if (status !== 'all') r = r.filter(p => p.status === status)
    if (sortBy === 'newest') r.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
    if (sortBy === 'oldest') r.sort((a, b) => (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0))
    if (sortBy === 'az') r.sort((a, b) => a.title?.localeCompare(b.title))
    return r
  }, [projects, search, category, status, sortBy])

  return (
    <div>
      <section className="relative bg-gradient-hero text-white pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '36px 36px' }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <FolderKanban size={12} className="text-accent" />
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-white/90">Proven Track Record</span>
          </div>
          <h1 className="font-heading font-bold text-3xl lg:text-5xl text-white mb-4">Community Projects</h1>
          <p className="text-white/70 max-w-xl mx-auto mb-6">Real projects, real impact — every initiative Fred Maisiba has delivered for the people of Bogeka Ward.</p>
          <div className="inline-flex items-center gap-6 bg-white/10 border border-white/20 rounded-2xl px-6 py-3 flex-wrap justify-center">
            {[
              { label: 'Total Projects', value: projects.length },
              { label: 'Completed', value: projects.filter(p => p.status === 'completed').length },
              { label: 'In Progress', value: projects.filter(p => p.status === 'ongoing').length },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="font-heading font-bold text-2xl text-white">{value}</p>
                <p className="text-xs text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-white border-b border-neutral-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20" />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-neutral-border text-sm bg-white focus:outline-none focus:border-secondary">
              <option value="all">All Categories</option>
              {PROJECT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-neutral-border text-sm bg-white focus:outline-none focus:border-secondary">
              <option value="all">All Statuses</option>
              {PROJECT_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-neutral-border text-sm bg-white focus:outline-none focus:border-secondary">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">A to Z</option>
            </select>
          </div>
        </div>
      </div>

      <section className="bg-neutral-bg py-10 lg:py-16 min-h-[400px]">
        <div className="container mx-auto px-4 lg:px-8">
          {!loading && (
            <p className="text-sm text-neutral-muted mb-5">
              Showing <strong className="text-primary">{filtered.length}</strong> of {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
          )}
          {loading ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-neutral-border">
              <FolderKanban size={40} className="text-neutral-muted mx-auto mb-3" />
              <p className="font-heading font-semibold text-primary mb-1">No projects found</p>
              <p className="text-sm text-neutral-muted">Try adjusting your filters.</p>
              <button onClick={() => { setSearch(''); setCategory('all'); setStatus('all') }}
                className="mt-4 text-sm text-accent font-semibold hover:text-accent-dark transition-colors">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </div>
      </section>

      <section className="bg-secondary py-14">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-2xl lg:text-3xl text-white mb-3">Want to Support More Projects?</h2>
          <p className="text-white/70 mb-7 max-w-xl mx-auto">Join the Chinsiaga movement and help Fred Maisiba deliver even more for Bogeka Ward.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/volunteer" className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white font-heading font-semibold text-sm rounded-full hover:bg-accent-dark transition-colors shadow-glow">
              Volunteer Now <ArrowRight size={15} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3 border-2 border-white/40 text-white font-heading font-semibold text-sm rounded-full hover:bg-white hover:text-secondary transition-colors">
              Contact the Campaign
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}