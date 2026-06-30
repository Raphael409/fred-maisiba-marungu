// src/components/shared/ConfirmDialog.jsx

import Button from './Button'

export default function ConfirmDialog({
  isOpen,
  title   = 'Are you sure?',
  message = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-card-hover w-full max-w-md p-6 animate-slide-up">
        <h2 className="text-lg font-heading font-semibold text-neutral-dark mb-2">
          {title}
        </h2>
        <p className="text-neutral-muted mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
