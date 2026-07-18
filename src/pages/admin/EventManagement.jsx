// src/pages/admin/EventManagement.jsx

import DataTable from '@/components/admin/DataTable'
import EventFormModal from '@/components/admin/EventFormModal'
import StatusBadge from '@/components/admin/StatusBadge'
import Button from '@/components/shared/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useEvents } from '@/hooks/useEvents'
import { formatDateRange, isUpcoming } from '@/utils/formatDate'
import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

export default function EventManagement() {
  const { events, loading, createEvent, editEvent, removeEvent } = useEvents()

  const [search, setSearch] = useState('')
  const [timingFilter, setTimingFilter] = useState('all') // all | upcoming | past

  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // ── Filtering ────────────────────────────────────────────
  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const matchesSearch = ev.title?.toLowerCase().includes(search.toLowerCase())
      const upcoming = isUpcoming(ev.endDateTime)
      const matchesTiming =
        timingFilter === 'all' ||
        (timingFilter === 'upcoming' && upcoming) ||
        (timingFilter === 'past' && !upcoming)
      return matchesSearch && matchesTiming
    })
  }, [events, search, timingFilter])

  // ── Handlers ─────────────────────────────────────────────
  function openCreateModal() {
    setEditingEvent(null)
    setModalOpen(true)
  }

  function openEditModal(event) {
    setEditingEvent(event)
    setModalOpen(true)
  }

  async function handleSave(formData) {
    if (editingEvent) {
      await editEvent(editingEvent.id, formData)
    } else {
      await createEvent(formData)
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await removeEvent(deleteTarget.id)
      toast.success('Event deleted.')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete event.')
    } finally {
      setDeleting(false)
    }
  }

  // ── Table columns ────────────────────────────────────────
  const columns = [
    {
      key: 'bannerImage',
      label: '',
      render: (row) => (
        <img
          src={row.bannerImage || 'https://via.placeholder.com/60x44?text=Event'}
          alt=""
          className="w-14 h-10 object-cover rounded"
        />
      ),
    },
    {
      key: 'title',
      label: 'Event',
      render: (row) => (
        <div>
          <p className="font-medium text-neutral-dark">{row.title}</p>
          <p className="text-xs text-neutral-muted">{row.location}</p>
        </div>
      ),
    },
    {
      key: 'dateRange',
      label: 'Date & Time',
      render: (row) => (
        <span className="text-sm">
          {formatDateRange(row.startDateTime, row.endDateTime)}
        </span>
      ),
    },
    {
      key: 'timing',
      label: 'Status',
      render: (row) => (
        <StatusBadge
          label={isUpcoming(row.endDateTime) ? 'Upcoming' : 'Past'}
          variant={isUpcoming(row.endDateTime) ? 'featured' : 'not-featured'}
        />
      ),
    },
  ]

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-dark">Event Management</h1>
          <p className="text-sm text-neutral-muted mt-1">
            Create and manage campaign events shown on the public site.
          </p>
        </div>
        <Button onClick={openCreateModal} className="self-start sm:self-auto">
          <Plus size={18} />
          Add New Event
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
            placeholder="Search events by title..."
            className="w-full pl-9 pr-4 py-2.5 rounded border border-neutral-border bg-white text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <select
          value={timingFilter}
          onChange={e => setTimingFilter(e.target.value)}
          className="px-4 py-2.5 rounded border border-neutral-border bg-white text-sm focus:outline-none focus:border-accent"
        >
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>

      <p className="text-xs text-neutral-muted mb-3">
        Showing {filteredEvents.length} of {events.length} event{events.length !== 1 ? 's' : ''}
      </p>

      {/* Table */}
      <DataTable
        columns={columns}
        rows={filteredEvents}
        loading={loading}
        onEdit={openEditModal}
        onDelete={setDeleteTarget}
        emptyMessage="No events found. Click 'Add New Event' to create your first one."
      />

      {/* Create/Edit modal */}
      <EventFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingEvent}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        mode="delete"
        isOpen={!!deleteTarget}
        title="Delete this event?"
        message={`"${deleteTarget?.title}" will be permanently removed. This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}