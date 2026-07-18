// src/pages/admin/NewsManagement.jsx

import DataTable from '@/components/admin/DataTable'
import NewsFormModal from '@/components/admin/NewsFormModal'
import StatusBadge from '@/components/admin/StatusBadge'
import Button from '@/components/shared/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useNews } from '@/hooks/useNews'
import { NEWS_CATEGORIES } from '@/utils/constants'
import { formatDate } from '@/utils/formatDate'
import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

export default function NewsManagement() {
  const { news, loading, createNews, editNews, removeNews } = useNews()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [publishFilter, setPublishFilter] = useState('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // ── Filtering ────────────────────────────────────────────
  const filteredNews = useMemo(() => {
    return news.filter(n => {
      const matchesSearch = n.title?.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || n.category === categoryFilter
      const matchesPublish =
        publishFilter === 'all' ||
        (publishFilter === 'published' && n.isPublished) ||
        (publishFilter === 'draft' && !n.isPublished)
      return matchesSearch && matchesCategory && matchesPublish
    })
  }, [news, search, categoryFilter, publishFilter])

  // ── Handlers ─────────────────────────────────────────────
  function openCreateModal() {
    setEditingArticle(null)
    setModalOpen(true)
  }

  function openEditModal(article) {
    setEditingArticle(article)
    setModalOpen(true)
  }

  async function handleSave(formData) {
    if (editingArticle) {
      await editNews(editingArticle.id, formData)
    } else {
      await createNews(formData)
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await removeNews(deleteTarget.id)
      toast.success('Article deleted.')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete article.')
    } finally {
      setDeleting(false)
    }
  }

  // ── Table columns ────────────────────────────────────────
  const columns = [
    {
      key: 'coverImage',
      label: '',
      render: (row) => (
        <img
          src={row.coverImage || 'https://via.placeholder.com/60x44?text=No+Image'}
          alt=""
          className="w-14 h-10 object-cover rounded"
        />
      ),
    },
    {
      key: 'title',
      label: 'Article',
      render: (row) => (
        <div>
          <p className="font-medium text-neutral-dark line-clamp-1">{row.title}</p>
          <p className="text-xs text-neutral-muted line-clamp-1">{row.excerpt}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => <StatusBadge label={row.category} variant="default" />,
    },
    {
      key: 'isPublished',
      label: 'Status',
      render: (row) => (
        <StatusBadge
          label={row.isPublished ? 'Published' : 'Draft'}
          variant={row.isPublished ? 'published' : 'draft'}
        />
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) => row.createdAt ? formatDate(row.createdAt) : '—',
    },
  ]

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-dark">News Management</h1>
          <p className="text-sm text-neutral-muted mt-1">
            Publish news articles and updates shown on the public site.
          </p>
        </div>
        <Button onClick={openCreateModal} className="self-start sm:self-auto">
          <Plus size={18} />
          Add New Article
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
            placeholder="Search articles by title..."
            className="w-full pl-9 pr-4 py-2.5 rounded border border-neutral-border bg-white text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded border border-neutral-border bg-white text-sm capitalize focus:outline-none focus:border-accent"
        >
          <option value="all">All Categories</option>
          {NEWS_CATEGORIES.map(cat => (
            <option key={cat} value={cat} className="capitalize">{cat}</option>
          ))}
        </select>

        <select
          value={publishFilter}
          onChange={e => setPublishFilter(e.target.value)}
          className="px-4 py-2.5 rounded border border-neutral-border bg-white text-sm focus:outline-none focus:border-accent"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <p className="text-xs text-neutral-muted mb-3">
        Showing {filteredNews.length} of {news.length} article{news.length !== 1 ? 's' : ''}
      </p>

      {/* Table */}
      <DataTable
        columns={columns}
        rows={filteredNews}
        loading={loading}
        onEdit={openEditModal}
        onDelete={setDeleteTarget}
        emptyMessage="No articles found. Click 'Add New Article' to publish your first one."
      />

      {/* Create/Edit modal */}
      <NewsFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingArticle}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        mode="delete"
        isOpen={!!deleteTarget}
        title="Delete this article?"
        message={`"${deleteTarget?.title}" will be permanently removed. This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}