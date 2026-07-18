// src/components/admin/DataTable.jsx
// Generic, reusable table for admin management pages.
// Accepts column definitions + row data; handles pagination internally.

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

const PAGE_SIZE = 10

/**
 * columns: [{ key, label, render?: (row) => JSX }]
 * rows: array of data objects (must include `id`)
 * onEdit, onDelete: (row) => void
 */
export default function DataTable({
    columns,
    rows,
    loading = false,
    onEdit,
    onDelete,
    onRowClick,
    emptyMessage = 'No records found.',
}) {
    const [page, setPage] = useState(1)
    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
    const paginatedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    // Reset to page 1 if filtering reduces rows below current page
    if (page > totalPages) setPage(totalPages)

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (rows.length === 0) {
        return (
            <div className="text-center py-16 text-neutral-muted">
                <p>{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-neutral-border bg-neutral-bg">
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    className="text-left px-4 py-3 font-heading font-semibold text-neutral-dark whitespace-nowrap"
                                >
                                    {col.label}
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-4 py-3 text-right font-heading font-semibold text-neutral-dark">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRows.map(row => (
                            <tr
                                key={row.id}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                                className={`border-b border-neutral-border last:border-0 hover:bg-neutral-bg/50 transition-colors duration-100 ${onRowClick ? 'cursor-pointer' : ''
                                    }`}
                            >
                                {columns.map(col => (
                                    <td key={col.key} className="px-4 py-3 text-neutral-dark align-middle">
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                                {(onEdit || onDelete) && (
                                    <td
                                        className="px-4 py-3 text-right whitespace-nowrap"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex justify-end gap-1">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(row)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary hover:text-white text-xs font-semibold transition-colors"
                                                    aria-label="Edit"
                                                >
                                                    <Pencil size={13} /> Edit
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(row)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-xs font-semibold transition-colors"
                                                    aria-label="Delete"
                                                >
                                                    <Trash2 size={13} /> Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-border">
                    <p className="text-xs text-neutral-muted">
                        Page {page} of {totalPages} &middot; {rows.length} total
                    </p>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-1.5 rounded border border-neutral-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-bg"
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-1.5 rounded border border-neutral-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-bg"
                            aria-label="Next page"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}