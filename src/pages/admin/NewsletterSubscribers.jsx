// src/pages/admin/NewsletterSubscribers.jsx

import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useNewsletterSubscribers } from '@/hooks/useNewsletterSubscribers'
import { formatDate, timeAgo } from '@/utils/formatDate'
import { Download, Mail, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

export default function NewsletterSubscribers() {
    const { subscribers, loading, removeSubscriber } = useNewsletterSubscribers()
    const [search, setSearch] = useState('')
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const filtered = useMemo(() =>
        subscribers.filter(s =>
            s.email?.toLowerCase().includes(search.toLowerCase())
        ), [subscribers, search])

    async function handleDelete() {
        if (!deleteTarget) return
        setDeleting(true)
        try {
            await removeSubscriber(deleteTarget.id)
            toast.success('Subscriber removed.')
            setDeleteTarget(null)
        } catch {
            toast.error('Failed to remove subscriber.')
        } finally {
            setDeleting(false)
        }
    }

    function exportCSV() {
        const rows = [
            ['Email', 'Subscribed At'],
            ...subscribers.map(s => [
                s.email,
                s.subscribedAt
                    ? new Date(s.subscribedAt?.toDate?.() ?? s.subscribedAt).toISOString()
                    : '',
            ]),
        ]
        const csv = rows.map(r => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `newsletter-subscribers-${Date.now()}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('CSV downloaded.')
    }

    const columns = [
        {
            key: 'email',
            label: 'Email Address',
            render: row => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Mail size={14} className="text-secondary" />
                    </div>
                    <a
                        href={`mailto:${row.email}`}
                        className="text-sm font-medium text-secondary hover:text-accent transition-colors"
                        onClick={e => e.stopPropagation()}
                    >
                        {row.email}
                    </a>
                </div>
            ),
        },
        {
            key: 'subscribedAt',
            label: 'Subscribed',
            render: row => (
                <div>
                    <p className="text-sm text-neutral-dark">
                        {row.subscribedAt ? formatDate(row.subscribedAt) : '—'}
                    </p>
                    <p className="text-xs text-neutral-muted">
                        {row.subscribedAt ? timeAgo(row.subscribedAt) : ''}
                    </p>
                </div>
            ),
        },
    ]

    return (
        <div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="font-heading text-2xl font-bold text-neutral-dark">
                            Newsletter Subscribers
                        </h1>
                        <span className="bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {subscribers.length}
                        </span>
                    </div>
                    <p className="text-sm text-neutral-muted mt-1">
                        Emails collected from the footer newsletter signup on the homepage.
                    </p>
                </div>
                <button
                    onClick={exportCSV}
                    disabled={subscribers.length === 0}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white font-heading font-semibold text-sm rounded-xl hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                    <Download size={15} />
                    Export CSV
                </button>
            </div>

            {/* Stats banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-neutral-border shadow-card">
                    <p className="text-2xl font-heading font-bold text-primary">{subscribers.length}</p>
                    <p className="text-xs text-neutral-muted mt-0.5">Total Subscribers</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-neutral-border shadow-card">
                    <p className="text-2xl font-heading font-bold text-secondary">
                        {subscribers.filter(s => {
                            if (!s.subscribedAt) return false
                            const d = s.subscribedAt?.toDate?.() ?? new Date(s.subscribedAt)
                            const cutoff = new Date()
                            cutoff.setDate(cutoff.getDate() - 7)
                            return d > cutoff
                        }).length}
                    </p>
                    <p className="text-xs text-neutral-muted mt-0.5">This Week</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-neutral-border shadow-card col-span-2 sm:col-span-1">
                    <p className="text-2xl font-heading font-bold text-accent">
                        {subscribers.filter(s => {
                            if (!s.subscribedAt) return false
                            const d = s.subscribedAt?.toDate?.() ?? new Date(s.subscribedAt)
                            const cutoff = new Date()
                            cutoff.setMonth(cutoff.getMonth() - 1)
                            return d > cutoff
                        }).length}
                    </p>
                    <p className="text-xs text-neutral-muted mt-0.5">This Month</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-5">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by email address..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-border bg-white text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
            </div>

            <p className="text-xs text-neutral-muted mb-3">
                Showing {filtered.length} of {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
            </p>

            <DataTable
                columns={columns}
                rows={filtered}
                loading={loading}
                onDelete={setDeleteTarget}
                emptyMessage="No subscribers yet. They appear here when someone signs up via the homepage footer newsletter form."
            />

            <ConfirmDialog
                isOpen={!!deleteTarget}
                mode="delete"
                title="Remove this subscriber?"
                message={`"${deleteTarget?.email}" will be permanently removed from the newsletter list.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                loading={deleting}
            />

        </div>
    )
}