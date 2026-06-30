// src/components/admin/StatusDropdown.jsx
// Inline status selector styled like a StatusBadge but clickable.
// Used in table rows so admins can update status without opening a modal.

const colorMap = {
    new: 'bg-accent/10 text-accent-dark border-accent/30',
    contacted: 'bg-secondary/10 text-secondary-dark border-secondary/30',
    active: 'bg-success/10 text-success border-success/30',
    unread: 'bg-red-50 text-red-600 border-red-200',
    read: 'bg-neutral-bg text-neutral-muted border-neutral-border',
    responded: 'bg-success/10 text-success border-success/30',
}

export default function StatusDropdown({ value, options, onChange, disabled = false }) {
    const colorKey = value?.toLowerCase()
    const classes = colorMap[colorKey] || 'bg-neutral-bg text-neutral-muted border-neutral-border'

    return (
        <select
            value={value}
            disabled={disabled}
            onChange={(e) => {
                e.stopPropagation()
                onChange(e.target.value)
            }}
            onClick={(e) => e.stopPropagation()}
            className={`
        text-xs font-semibold capitalize rounded-full px-2.5 py-1 border
        cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30
        disabled:opacity-50 disabled:cursor-not-allowed
        ${classes}
      `}
        >
            {options.map(opt => (
                <option key={opt} value={opt} className="capitalize bg-white text-neutral-dark">
                    {opt}
                </option>
            ))}
        </select>
    )
}