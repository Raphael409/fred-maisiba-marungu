// src/pages/public/Projects.jsx

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useProjects } from '@/hooks/useProjects'
import { PROJECT_CATEGORIES } from '@/utils/constants'
import { MapPin } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Projects() {
  const { projects, loading } = useProjects()
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter
      return matchesCategory && matchesStatus
    })
  }, [projects, categoryFilter, statusFilter])

  const completedCount = projects.filter(p => p.status === 'completed').length

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-white py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-secondary font-heading font-semibold text-sm uppercase tracking-wide mb-2">
            Proven Track Record
          </p>
          <h1 className="font-heading text-3xl lg:text-5xl font-bold mb-4">
            Community Projects &amp; Achievements
          </h1>
          <p className="text-neutral-on-dark-muted max-w-2xl mx-auto">
            {completedCount} completed project{completedCount !== 1 ? 's' : ''} and counting —
            real work, delivered for real communities.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">

        <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-center">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded border border-neutral-border bg-white text-sm focus:outline-none focus:border-accent"
          >
            <option value="all">All Categories</option>
            {PROJECT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded border border-neutral-border bg-white text-sm capitalize focus:outline-none focus:border-accent"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-neutral-muted py-20">
            No projects match your filters yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(project => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group bg-white rounded-xl shadow-card hover:shadow-card-hover overflow-hidden transition-shadow duration-200"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-secondary text-primary text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-lg text-primary mb-1 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-accent font-medium mb-2">
                    <MapPin size={12} /> {project.location}
                  </p>
                  <p className="text-sm text-neutral-muted line-clamp-2 mb-3">
                    {project.impactSummary}
                  </p>
                  <span className="text-sm font-semibold text-accent group-hover:text-accent-dark">
                    View Details &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}