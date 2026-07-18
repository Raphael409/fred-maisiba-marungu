// src/pages/admin/GalleryManagement.jsx

import GalleryUploadModal from '@/components/admin/GalleryUploadModal'
import VideoAddModal from '@/components/admin/VideoAddModal'
import Button from '@/components/shared/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useGallery } from '@/hooks/useGallery'
import { useProjects } from '@/hooks/useProjects'
import { PROJECT_CATEGORIES } from '@/utils/constants'
import { getYouTubeThumbnail } from '@/utils/youtube'
import { Play, Plus, Search, Trash2, Youtube } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

export default function GalleryManagement() {
  const { galleryItems, loading, addGalleryItems, removeGalleryItem } = useGallery()
  const { projects } = useProjects()

  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const projectTitleMap = useMemo(() => {
    const map = {}
    projects.forEach(p => { map[p.id] = p.title })
    return map
  }, [projects])

  const filteredItems = useMemo(() => {
    return galleryItems.filter(item => {
      const matchesType = typeFilter === 'all' || (typeFilter === 'video' ? item.type === 'video' : item.type !== 'video')
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      const projectTitle = item.relatedProjectId ? projectTitleMap[item.relatedProjectId] : ''
      const matchesSearch = !search ||
        item.category?.toLowerCase().includes(search.toLowerCase()) ||
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        projectTitle?.toLowerCase().includes(search.toLowerCase())
      return matchesType && matchesCategory && matchesSearch
    })
  }, [galleryItems, categoryFilter, typeFilter, search, projectTitleMap])

  async function handleSaveBatch(items) { await addGalleryItems(items) }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await removeGalleryItem(deleteTarget.id)
      toast.success(`${deleteTarget.type === 'video' ? 'Video' : 'Photo'} removed from gallery.`)
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete item.')
    } finally {
      setDeleting(false)
    }
  }

  const videoCount = galleryItems.filter(i => i.type === 'video').length
  const photoCount = galleryItems.filter(i => i.type !== 'video').length

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-dark">Gallery Management</h1>
          <p className="text-sm text-neutral-muted mt-1">
            {photoCount} photo{photoCount !== 1 ? 's' : ''} · {videoCount} YouTube video{videoCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setVideoModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white font-heading font-semibold text-sm rounded-xl hover:bg-red-700 transition-colors shadow-md"
          >
            <Youtube size={15} />
            Add Video
          </button>
          <Button onClick={() => setUploadModalOpen(true)}>
            <Plus size={15} />
            Add Photos
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, category or project..."
            className="w-full pl-9 pr-4 py-2.5 rounded border border-neutral-border bg-white text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 rounded border border-neutral-border bg-white text-sm focus:outline-none focus:border-secondary"
        >
          <option value="all">All Types</option>
          <option value="photo">Photos Only</option>
          <option value="video">Videos Only</option>
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 rounded border border-neutral-border bg-white text-sm focus:outline-none focus:border-secondary"
        >
          <option value="all">All Categories</option>
          {PROJECT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-border">
          <p className="font-heading font-semibold text-primary mb-1">No items found</p>
          <p className="text-sm text-neutral-muted">Add photos or YouTube videos using the buttons above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map(item => {
            const isVideo = item.type === 'video'
            const thumb = isVideo
              ? (item.thumbnail || getYouTubeThumbnail(item.videoId, 'hqdefault'))
              : item.imageUrl
            return (
              <div key={item.id} className="group relative rounded-xl overflow-hidden shadow-card bg-neutral-bg aspect-square">
                <img
                  src={thumb}
                  alt={item.caption || item.title || ''}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Video badge */}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center shadow-md">
                      <Play size={16} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div>
                    {isVideo && item.title && (
                      <p className="text-white text-xs font-medium line-clamp-2">{item.title}</p>
                    )}
                    {item.category && (
                      <span className="inline-block bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full mt-1">
                        {item.category}
                      </span>
                    )}
                    {item.relatedProjectId && projectTitleMap[item.relatedProjectId] && (
                      <p className="text-white/60 text-[10px] mt-0.5 truncate">
                        {projectTitleMap[item.relatedProjectId]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      <GalleryUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSave={handleSaveBatch}
        projects={projects}
      />

      {videoModalOpen && (
        <VideoAddModal
          onClose={() => setVideoModalOpen(false)}
          projects={projects}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        mode="delete"
        title={`Delete this ${deleteTarget?.type === 'video' ? 'video' : 'photo'}?`}
        message="This item will be permanently removed from the gallery."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}