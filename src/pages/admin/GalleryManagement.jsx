// src/pages/admin/GalleryManagement.jsx

import GalleryUploadModal from '@/components/admin/GalleryUploadModal'
import StatusBadge from '@/components/admin/StatusBadge'
import Button from '@/components/shared/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useGallery } from '@/hooks/useGallery'
import { useProjects } from '@/hooks/useProjects'
import { PROJECT_CATEGORIES } from '@/utils/constants'
import { Plus, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

export default function GalleryManagement() {
  const { galleryItems, loading, addGalleryItems, removeGalleryItem } = useGallery()
  const { projects } = useProjects()

  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')

  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Map project id → title for display
  const projectTitleMap = useMemo(() => {
    const map = {}
    projects.forEach(p => { map[p.id] = p.title })
    return map
  }, [projects])

  const filteredItems = useMemo(() => {
    return galleryItems.filter(item => {
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      const projectTitle = item.relatedProjectId ? projectTitleMap[item.relatedProjectId] : ''
      const matchesSearch =
        !search ||
        item.category?.toLowerCase().includes(search.toLowerCase()) ||
        projectTitle?.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [galleryItems, categoryFilter, search, projectTitleMap])

  async function handleSaveBatch(items) {
    await addGalleryItems(items)
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await removeGalleryItem(deleteTarget.id)
      toast.success('Photo removed from gallery.')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete photo.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Gallery Management</h1>
          <p className="text-sm text-neutral-muted mt-1">
            Upload and organize photos shown in the public Projects Gallery.
          </p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)} className="self-start sm:self-auto">
          <Plus size={18} />
          Add Photos
        </Button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by category or linked project..."
            className="w-full pl-9 pr-4 py-2.5 rounded border border-neutral-border bg-white text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

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
      </div>

      <p className="text-xs text-neutral-muted mb-3">
        Showing {filteredItems.length} of {galleryItems.length} photo{galleryItems.length !== 1 ? 's' : ''}
      </p>

      {/* Photo grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 text-neutral-muted bg-white rounded-xl shadow-card">
          <p>No photos found. Click "Add Photos" to upload your first batch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden border border-neutral-border bg-white shadow-card aspect-square"
            >
              <img
                src={item.thumbnailUrl || item.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />

              {/* Hover overlay with metadata + delete */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col justify-between p-2">
                <div className="flex justify-end">
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="bg-white/90 rounded-full p-1.5 hover:bg-red-50 hover:text-red-600 transition-colors"
                    aria-label="Delete photo"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="text-white">
                  <StatusBadge label={item.category} variant="default" />
                  {item.relatedProjectId && projectTitleMap[item.relatedProjectId] && (
                    <p className="text-xs mt-1 line-clamp-1 text-white/90">
                      {projectTitleMap[item.relatedProjectId]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload modal */}
      <GalleryUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSave={handleSaveBatch}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Remove this photo?"
        message="This photo will be permanently removed from the gallery. This cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}