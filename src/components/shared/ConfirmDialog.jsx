// src/components/shared/ConfirmDialog.jsx
// Requires the user to type "delete" before confirming deletion.
// Prevents all accidental deletions.

import { AlertTriangle, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function ConfirmDialog({
  isOpen,
  mode = 'delete',
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}) {
  const [typed, setTyped] = useState('')
  const inputRef = useRef(null)

  const keyword = 'delete'
  const isConfirmed = typed.trim().toLowerCase() === keyword

  // Reset and focus every time the dialog opens
  useEffect(() => {
    if (isOpen) {
      setTyped('')
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [isOpen])

  // Keyboard shortcuts
  function handleKeyDown(e) {
    if (e.key === 'Enter' && isConfirmed && !loading) onConfirm()
    if (e.key === 'Escape' && !loading) onCancel()
  }

  if (!isOpen) return null

  return (
    // Full-screen backdrop
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div
        className="relative bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.3)] w-full max-w-md border border-neutral-border animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >

        {/* Header */}
        <div className="flex items-start gap-4 px-6 pt-6 pb-4 border-b border-neutral-border">
          <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              id="confirm-title"
              className="font-heading font-bold text-base text-neutral-dark"
            >
              {title || 'Confirm Deletion'}
            </h2>
            {message && (
              <p className="text-sm text-neutral-muted mt-1 leading-relaxed">{message}</p>
            )}
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-neutral-muted hover:text-neutral-dark p-1 rounded-lg transition-colors flex-shrink-0 mt-0.5"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body — type to confirm */}
        <div className="px-6 py-5">
          <p className="text-sm text-neutral-dark mb-3">
            To confirm, type{' '}
            <code className="bg-red-50 text-red-700 font-mono font-bold px-1.5 py-0.5 rounded text-sm">
              delete
            </code>{' '}
            in the box below and click <strong>Delete</strong>.
          </p>

          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={e => setTyped(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Type "delete" to confirm'
            disabled={loading}
            autoComplete="off"
            spellCheck={false}
            className={`w-full px-4 py-3 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 transition-all ${typed.length > 0 && !isConfirmed
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : isConfirmed
                  ? 'border-success focus:border-success focus:ring-success/20 bg-success/5'
                  : 'border-neutral-border focus:border-secondary focus:ring-secondary/20'
              }`}
          />

          {/* Hint */}
          {typed.length > 0 && !isConfirmed && (
            <p className="text-xs text-red-500 mt-1.5">
              Keep typing — type the full word <strong>delete</strong>
            </p>
          )}
          {isConfirmed && (
            <p className="text-xs text-success mt-1.5 font-medium">
              ✓ Confirmed — click Delete to proceed
            </p>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 border border-neutral-border text-neutral-dark font-heading font-semibold text-sm rounded-xl hover:bg-neutral-bg disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!isConfirmed || loading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-heading font-bold text-sm rounded-xl transition-colors ${isConfirmed && !loading
                ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                : 'bg-red-200 text-red-400 cursor-not-allowed'
              }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-red-300 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={15} />
                Delete
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}