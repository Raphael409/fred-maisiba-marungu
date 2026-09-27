// src/utils/formatDate.js
import { format, formatDistanceToNow } from 'date-fns'

export function formatDate(timestamp, fmt = 'dd MMM yyyy') {
  if (!timestamp) return ''
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  return format(date, fmt)
}

export function timeAgo(timestamp) {
  if (!timestamp) return ''
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  return formatDistanceToNow(date, { addSuffix: true })
}

// ─── Event-specific helpers ─────────────────────────────────

/**
 * Returns true if the event's end date/time is in the future
 * (or still ongoing). Used to badge events as Upcoming vs Past.
 */
export function isUpcoming(endDateTime) {
  if (!endDateTime) return false
  const end = endDateTime?.toDate ? endDateTime.toDate() : new Date(endDateTime)
  return end.getTime() >= Date.now()
}

/**
 * Formats a date range for display.
 * Same day → "12 Jul 2026, 9:00 AM – 1:00 PM"
 * Multi-day → "12 Jul 2026 – 14 Jul 2026"
 */
export function formatDateRange(start, end) {
  if (!start) return ''
  const startDate = start?.toDate ? start.toDate() : new Date(start)
  const endDate = end?.toDate ? end.toDate() : (end ? new Date(end) : null)

  if (!endDate) {
    return startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const sameDay = startDate.toDateString() === endDate.toDateString()

  if (sameDay) {
    const dateStr = startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    const startTime = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const endTime = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    return `${dateStr}, ${startTime} – ${endTime}`
  }

  const startStr = startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const endStr = endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  return `${startStr} – ${endStr}`
}