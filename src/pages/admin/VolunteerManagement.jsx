// src/pages/admin/VolunteerManagement.jsx

import DataTable from '@/components/admin/DataTable'
import StatusDropdown from '@/components/admin/StatusDropdown'
import VolunteerDetailModal from '@/components/admin/VolunteerDetailModal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useVolunteers } from '@/hooks/useVolunteers'
import { VOLUNTEER_STATUSES } from '@/utils/constants'
import { formatDate } from '@/utils/formatDate'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

export default function VolunteerManagement() {
  const { volunteers, loading, updateVolunteerStatus, removeVolunteer } = useVolunteers()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [selectedVolunteer, setSelectedVolunteer] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter(v => {
      const matchesSearch =
        v.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        v.email?.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || v.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [volunteers, search, statusFilter])

  async function handleStatusChange(id, status) {
    try {
      await updateVolunteerStatus(id, status)
      toast.success('Status updated.')
      setSelectedVolunteer(prev => prev?.id === id ? { ...prev, status } : prev)
    } catch {
      toast.error('Failed to update status.')
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await removeVolunteer(deleteTarget.id)
      toast.success('Volunteer record deleted.')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete record.')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: 'fullName',
      label: 'Volunteer',
      render: (row) => (
        <div>
          <p className="font-medium text-neutral-dark">{row.fullName}</p>
          <p className="text-xs text-neutral-muted">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (row) => row.location || '—',
    },
    {
      key: 'areasOfInterest',
      label: 'Interests',
      render: (row) => (
        <span className="text-xs text-neutral-muted">
          {row.areasOfInterest?.length
            ? `${row.areasOfInterest.length} area${row.areasOfInterest.length > 1 ? 's' : ''}`
            : '—'}
        </span>
      ),
    },
    {
      key: 'submittedAt',
      label: 'Submitted',
      render: (row) => row.submittedAt ? formatDate(row.submittedAt) : '—',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <StatusDropdown
          value={row.status || 'new'}
          options={VOLUNTEER_STATUSES}
          onChange={(status) => handleStatusChange(row.id, status)}
        />
      ),
    },
  ]

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-neutral-dark">Volunteer Management</h1>
        <p className="text-sm text-neutral-muted mt-1">
          Review and follow up with volunteer sign-ups from the public site.
          Click any row to view full details.
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 rounded border border-neutral-border bg-white text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded border border-neutral-border bg-white text-sm capitalize focus:outline-none focus:border-accent"
        >
          <option value="all">All Statuses</option>
          {VOLUNTEER_STATUSES.map(s => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-neutral-muted mb-3">
        Showing {filteredVolunteers.length} of {volunteers.length} volunteer{volunteers.length !== 1 ? 's' : ''}
      </p>

      {/* Table — clicking a row opens the detail modal; status dropdown and
          delete button stop propagation so they don't also trigger it */}
      <DataTable
        columns={columns}
        rows={filteredVolunteers}
        loading={loading}
        onDelete={setDeleteTarget}
        onRowClick={setSelectedVolunteer}
        emptyMessage="No volunteer sign-ups yet. They'll appear here once submitted via the public site."
      />

      {/* Detail modal */}
      {selectedVolunteer && (
        <VolunteerDetailModal
          volunteer={selectedVolunteer}
          onClose={() => setSelectedVolunteer(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        mode="delete"
        isOpen={!!deleteTarget}
        title="Delete this volunteer record?"
        message={`"${deleteTarget?.fullName}"'s submission will be permanently removed. This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}