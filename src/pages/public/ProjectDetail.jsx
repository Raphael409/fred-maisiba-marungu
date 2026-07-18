// src/pages/public/ProjectDetail.jsx

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { usePublicGallery } from '@/hooks/usePublicGallery'
import { useSingleDocument } from '@/hooks/useSingleDocument'
import { formatDate } from '@/utils/formatDate'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle, FolderKanban,
  MapPin,
  Tag,
  Users,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

const STATUS_COLORS = {
  completed: 'bg-success/10 text-success border-success/20',
  ongoing: 'bg-accent/10 text-accent-dark border-accent/20',
  initiated: 'bg-blue-50 text-blue-700 border-blue-200',
  planned: 'bg-purple-50 text-purple-700 border-purple-200',
  stalled: 'bg-red-50 text-red-600 border-red-200',
}

export default function ProjectDetail() {
  const { id } = useParams()
  const { document: project, loading } = useSingleDocument('projects', id)
  const { galleryItems } = usePublicGallery()

  const relatedPhotos = galleryItems
    .filter(g => g.relatedProjectId === id || g.projectId === id)
    .slice(0, 6)

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <LoadingSpinner size="lg" />
    </div>
  )

  if (!project) return (
    <div className="text-center py-32">
      <FolderKanban size={40} className="text-neutral-muted mx-auto mb-3" />
      <h2 className="font-heading font-bold text-xl text-primary mb-2">Project not found</h2>
      <Link to="/projects" className="text-accent font-semibold hover:text-accent-dark">
        ← Back to Projects
      </Link>
    </div>
  )

  return (
    <div>
      {/* Hero */}
      {/* Hero image — natural aspect ratio, no crop */}
      {project.coverImage && (
        <div className="w-full bg-neutral-dark pt-28 lg:pt-36">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full max-h-[600px] object-contain mx-auto block"
          />
        </div>
      )}

      {/* Title bar */}
      <section className="relative bg-gradient-to-b from-primary to-secondary py-8 lg:py-10 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <Link to="/projects" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={15} /> Back to Projects
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {project.category && (
              <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                <Tag size={10} />{project.category}
              </span>
            )}
            <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${STATUS_COLORS[project.status] || STATUS_COLORS.planned}`}>
              {project.status}
            </span>
          </div>
          <h1 className="font-heading font-bold text-2xl lg:text-4xl text-white mb-3 max-w-3xl">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-white/70 text-sm">
            {project.location && (
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-accent" />{project.location}</span>
            )}
            {project.startDate && (
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-accent" />{formatDate(project.startDate)}</span>
            )}
            {project.beneficiaries && (
              <span className="flex items-center gap-1.5"><Users size={14} className="text-accent" />{project.beneficiaries.toLocaleString()} beneficiaries</span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main content */}
            <div className="lg:col-span-2">
              {project.impactSummary && (
                <div className="bg-neutral-bg border-l-4 border-accent rounded-r-xl p-5 mb-8">
                  <p className="font-heading font-semibold text-primary">{project.impactSummary}</p>
                </div>
              )}

              {project.description && (
                <div className="prose prose-sm max-w-none text-neutral-muted leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: project.description }} />
              )}

              {/* Gallery photos */}
              {relatedPhotos.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-heading font-bold text-lg text-primary mb-4">Project Photos</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {relatedPhotos.map(photo => (
                      <div key={photo.id} className="aspect-square rounded-xl overflow-hidden">
                        <img src={photo.imageUrl} alt={photo.caption || ''} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-neutral-bg rounded-2xl p-5 border border-neutral-border">
                <h3 className="font-heading font-semibold text-primary mb-4">Project Details</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Status', value: project.status, icon: CheckCircle },
                    { label: 'Category', value: project.category, icon: Tag },
                    { label: 'Location', value: project.location, icon: MapPin },
                    { label: 'Start Date', value: project.startDate ? formatDate(project.startDate) : null, icon: Calendar },
                    { label: 'End Date', value: project.endDate ? formatDate(project.endDate) : null, icon: Calendar },
                    { label: 'Beneficiaries', value: project.beneficiaries ? project.beneficiaries.toLocaleString() : null, icon: Users },
                  ].filter(item => item.value).map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon size={14} className="text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-neutral-muted uppercase tracking-wide">{label}</p>
                        <p className="text-sm font-medium text-neutral-dark capitalize">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-secondary rounded-2xl p-5 text-white">
                <h3 className="font-heading font-bold mb-2">Support This Work</h3>
                <p className="text-white/70 text-sm mb-4">Help Fred Maisiba deliver more projects like this across Bogeka Ward.</p>
                <Link to="/volunteer"
                  className="block text-center py-2.5 bg-accent text-white font-heading font-semibold text-sm rounded-xl hover:bg-accent-dark transition-colors shadow-glow">
                  Get Involved
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-bg py-12 border-t border-neutral-border">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/projects" className="inline-flex items-center gap-2 text-secondary font-heading font-semibold text-sm hover:text-accent transition-colors">
            <ArrowLeft size={15} /> All Projects
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary text-white font-heading font-semibold text-sm rounded-full hover:bg-secondary-dark transition-colors">
            Ask About This Project <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  )
}