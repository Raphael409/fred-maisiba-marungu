// src/pages/public/ProjectDetail.jsx

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { usePublicGallery } from '@/hooks/usePublicGallery'
import { useSingleDocument } from '@/hooks/useSingleDocument'
import { formatDate } from '@/utils/formatDate'
import { ArrowLeft, Calendar, DollarSign, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export default function ProjectDetail() {
  const { projectId } = useParams()
  const { data: project, loading } = useSingleDocument('projects', projectId)
  const { galleryItems } = usePublicGallery()

  const relatedPhotos = galleryItems.filter(
    item => item.relatedProjectId === projectId
  )

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-primary mb-2">Project Not Found</h1>
        <p className="text-neutral-muted mb-6">This project may have been removed or the link is incorrect.</p>
        <Link to="/projects" className="text-accent font-semibold hover:text-accent-dark">
          &larr; Back to all projects
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Hero image */}
      <div className="relative h-[40vh] lg:h-[55vh] overflow-hidden">
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/20 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 lg:px-8 pb-8">
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-secondary text-sm font-medium mb-4"
            >
              <ArrowLeft size={16} /> Back to all projects
            </Link>
            <span className="inline-block bg-secondary text-primary text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-3">
              {project.category}
            </span>
            <h1 className="font-heading text-2xl lg:text-4xl font-bold text-white max-w-3xl">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2">
            <p className="text-lg text-primary font-medium mb-6 leading-relaxed">
              {project.impactSummary}
            </p>
            <div className="prose-content">
              <p className="text-neutral-dark leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Related gallery photos */}
            {relatedPhotos.length > 0 && (
              <div className="mt-10">
                <h2 className="font-heading text-xl font-semibold text-primary mb-4">
                  Photos from this Project
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {relatedPhotos.map(photo => (
                    <Link
                      key={photo.id}
                      to="/gallery"
                      className="aspect-square rounded-lg overflow-hidden"
                    >
                      <img
                        src={photo.imageUrl}
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — key facts */}
          <aside className="lg:col-span-1">
            <div className="bg-neutral-bg rounded-xl p-6 space-y-5 sticky top-24">
              <h3 className="font-heading font-semibold text-primary text-lg">Project Details</h3>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-neutral-muted">Location</p>
                  <p className="text-sm font-medium text-neutral-dark">{project.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-[18px] h-[18px] flex-shrink-0 mt-0.5">
                  <span className={`block w-2.5 h-2.5 rounded-full mt-1 ${project.status === 'completed' ? 'bg-success' : 'bg-secondary'
                    }`} />
                </span>
                <div>
                  <p className="text-xs text-neutral-muted">Status</p>
                  <p className="text-sm font-medium text-neutral-dark capitalize">{project.status}</p>
                </div>
              </div>

              {project.completedDate && (
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-muted">Completed</p>
                    <p className="text-sm font-medium text-neutral-dark">
                      {formatDate(project.completedDate)}
                    </p>
                  </div>
                </div>
              )}

              {project.budget && (
                <div className="flex items-start gap-3">
                  <DollarSign size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-muted">Budget</p>
                    <p className="text-sm font-medium text-neutral-dark">
                      KES {Number(project.budget).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <Link
                to="/volunteer"
                className="block text-center mt-2 px-4 py-2.5 bg-secondary text-primary font-heading font-semibold text-sm rounded hover:bg-secondary-dark transition-colors"
              >
                Support More Projects Like This
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}