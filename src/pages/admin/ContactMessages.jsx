// src/pages/admin/ContactMessages.jsx

import DataTable from '@/components/admin/DataTable'
import StatusDropdown from '@/components/admin/StatusDropdown'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useContactMessages } from '@/hooks/useContactMessages'
import { MESSAGE_STATUSES } from '@/utils/constants'
import { formatDate, timeAgo } from '@/utils/formatDate'
import { Clock, Mail, Phone, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

function MessageDetailModal({ message, onClose, onStatusChange }) {
  if (!message) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white rounded-2xl shadow-card-hover w-full max-w-lg max-h-[85vh] flex flex-col animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border">
          <h2 className="font-heading font-semibold text-primary">{message.subject || 'Message'}</h2>
          <button onClick={onClose} className="text-neutral-muted hover:text-neutral-dark">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <StatusDropdown
              value={message.status || 'unread'}
              options={MESSAGE_STATUSES}
              onChange={status => onStatusChange(message.id, status)}
            />
            <span className="text-xs text-neutral-muted">{timeAgo(message.submittedAt)}</span>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-accent" /><span className="font-medium text-neutral-dark">{message.name}</span><span className="text-neutral-muted">— {message.email}</span></div>
            {message.phone && <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-accent" /><span className="text-neutral-dark">{message.phone}</span></div>}
            <div className="flex items-center gap-2 text-sm"><Clock size={14} className="text-accent" /><span className="text-neutral-muted">{formatDate(message.submittedAt, 'dd MMM yyyy, HH:mm')}</span></div>
          </div>
          <div className="bg-neutral-bg rounded-xl p-4">
            <p className="text-sm text-neutral-dark leading-relaxed whitespace-pre-line">{message.message}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}
              className="flex-1 text-center py-2.5 bg-secondary text-white font-heading font-semibold text-sm rounded-xl hover:bg-secondary-dark transition-colors">
              Reply via Email
            </a>
            {message.phone && (
              <a href={`tel:${message.phone}`}
                className="flex-1 text-center py-2.5 border border-secondary text-secondary font-heading font-semibold text-sm rounded-xl hover:bg-secondary hover:text-white transition-colors">
                Call
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContactMessages() {
  const { messages, loading, updateStatus, removeMessage } = useContactMessages()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = useMemo(() => messages.filter(m => {
    const matchSearch = m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || m.status === statusFilter
    return matchSearch && matchStatus
  }), [messages, search, statusFilter])

  async function handleStatusChange(id, status) {
    try {
      await updateStatus(id, status)
      setSelected(prev => prev?.id === id ? { ...prev, status } : prev)
      toast.success('Status updated.')
    } catch { toast.error('Failed to update status.') }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await removeMessage(deleteTarget.id)
      toast.success('Message deleted.')
      setDeleteTarget(null)
    } catch { toast.error('Failed to delete message.') }
    finally { setDeleting(false) }
  }

  const unreadCount = messages.filter(m => m.status === 'unread').length

  const columns = [
    {
      key: 'name', label: 'From', render: row => (
        <div>
          <p className="font-medium text-neutral-dark">{row.name}</p>
          <p className="text-xs text-neutral-muted">{row.email}</p>
        </div>
      )
    },
    {
      key: 'subject', label: 'Subject', render: row => (
        <p className="text-sm text-neutral-dark line-clamp-1">{row.subject || '—'}</p>
      )
    },
    {
      key: 'submittedAt', label: 'Received', render: row => (
        <span className="text-xs text-neutral-muted">{row.submittedAt ? timeAgo(row.submittedAt) : '—'}</span>
      )
    },
    {
      key: 'status', label: 'Status', render: row => (
        <StatusDropdown value={row.status || 'unread'} options={MESSAGE_STATUSES}
          onChange={status => handleStatusChange(row.id, status)} />
      )
    },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-neutral-dark">Contact Messages</h1>
            {unreadCount > 0 && (
              <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>
            )}
          </div>
          <p className="text-sm text-neutral-muted mt-1">Messages submitted via the public contact form.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or subject..."
            className="w-full pl-9 pr-4 py-2.5 rounded border border-neutral-border bg-white text-sm focus:outline-none focus:border-secondary" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded border border-neutral-border bg-white text-sm capitalize focus:outline-none focus:border-secondary">
          <option value="all">All Statuses</option>
          {MESSAGE_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      <p className="text-xs text-neutral-muted mb-3">
        Showing {filtered.length} of {messages.length} message{messages.length !== 1 ? 's' : ''}
      </p>

      <DataTable columns={columns} rows={filtered} loading={loading}
        onRowClick={row => { setSelected(row); handleStatusChange(row.id, row.status === 'unread' ? 'read' : row.status) }}
        onDelete={setDeleteTarget}
        emptyMessage="No messages yet. They appear here when submitted via the public contact form." />

      {selected && <MessageDetailModal message={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />}

      <ConfirmDialog isOpen={!!deleteTarget} mode="delete"
        title="Delete this message?"
        message={`Message from "${deleteTarget?.name}" will be permanently removed.`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  )
}