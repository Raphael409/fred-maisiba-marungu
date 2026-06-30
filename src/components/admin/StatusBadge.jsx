// src/components/admin/StatusBadge.jsx
// Small colored pill used in tables to show category/status/featured state.

const colorMap = {
    // Status
    completed: 'bg-success/10 text-success',
    ongoing: 'bg-secondary/10 text-secondary-dark',

    // Featured
    featured: 'bg-accent/10 text-accent-dark',
    'not-featured': 'bg-neutral-bg text-neutral-muted',

    // News publish state
    published: 'bg-success/10 text-success',
    draft: 'bg-neutral-bg text-neutral-muted',

    // Volunteer / message status
    new: 'bg-accent/10 text-accent-dark',
    contacted: 'bg-secondary/10 text-secondary-dark',
    active: 'bg-success/10 text-success',
    unread: 'bg-red-50 text-red-600',
    read: 'bg-neutral-bg text-neutral-muted',
    responded: 'bg-success/10 text-success',

    // Fallback
    default: 'bg-primary/10 text-primary',
}

export default function StatusBadge({ label, variant }) {
    const colorKey = (variant || label || '').toLowerCase().replace(/\s+/g, '-')
    const classes = colorMap[colorKey] || colorMap.default

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${classes}`}
        >
            {label}
        </span>
    )
}