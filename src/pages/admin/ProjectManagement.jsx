// src/pages/admin/ProjectManagement.jsx

import DataTable from '@/components/admin/DataTable'
import ProjectFormModal from '@/components/admin/ProjectFormModal'
import StatusBadge from '@/components/admin/StatusBadge'
import Button from '@/components/shared/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useProjects } from '@/hooks/useProjects'
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from '@/utils/constants'
import { formatDate } from '@/utils/formatDate'
import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

export default function ProjectManagement() {
  const { projects, loading, createProject, editProject, removeProject } = useProjects()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // ── Filtering ────────────────────────────────────────────
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [projects, search, categoryFilter, statusFilter])

  // ── Handlers ─────────────────────────────────────────────
  function openCreateModal() {
    setEditingProject(null)
    setModalOpen(true)
  }

  function openEditModal(project) {
    setEditingProject(project)
    setModalOpen(true)
  }

  async function handleSave(formData) {
    if (editingProject) {
      await editProject(editingProject.id, formData)
    } else {
      await createProject(formData)
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await removeProject(deleteTarget.id)
      toast.success('Project deleted.')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete project.')
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
      label: 'Project',
      render: (row) => (
        <div>
          <p className="font-medium text-neutral-dark">{row.title}</p>
          <p className="text-xs text-neutral-muted">{row.location}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => <StatusBadge label={row.category} variant="default" />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge label={row.status} />,
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (row) => (
        <StatusBadge
          label={row.featured ? 'Featured' : 'Not Featured'}
          variant={row.featured ? 'featured' : 'not-featured'}
        />
      ),
    },
    {
      key: 'completedDate',
      label: 'Completed',
      render: (row) => row.completedDate ? formatDate(row.completedDate) : '—',
    },
  ]

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Project Management</h1>
          <p className="text-sm text-neutral-muted mt-1">
            Manage community projects and achievements shown on the public site.
          </p>
        </div>
        <Button onClick={openCreateModal} className="self-start sm:self-auto">
          <Plus size={18} />
          Add New Project
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
            placeholder="Search projects by title..."
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

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded border border-neutral-border bg-white text-sm focus:outline-none focus:border-accent capitalize"
        >
          <option value="all">All Statuses</option>
          {PROJECT_STATUSES.map(s => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-neutral-muted mb-3">
        Showing {filteredProjects.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
      </p>

      {/* Table */}
      <DataTable
        columns={columns}
        rows={filteredProjects}
        loading={loading}
        onEdit={openEditModal}
        onDelete={setDeleteTarget}
        emptyMessage="No projects found. Click 'Add New Project' to create your first one."
      />

      {/* Create/Edit modal */}
      <ProjectFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingProject}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete this project?"
        message={`"${deleteTarget?.title}" will be permanently removed. This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}