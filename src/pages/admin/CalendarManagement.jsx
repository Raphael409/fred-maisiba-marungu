// src/pages/admin/CalendarManagement.jsx
// Visual calendar view of all campaign events.

import { useEvents } from '@/hooks/useEvents'
import { formatDateRange } from '@/utils/formatDate'
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function getEventDate(ev) {
  if (!ev.startDateTime) return null
  return ev.startDateTime?.toDate ? ev.startDateTime.toDate() : new Date(ev.startDateTime)
}

export default function CalendarManagement() {
  const { events, loading } = useEvents()
  const [current, setCurrent] = useState(new Date())
  const [selected, setSelected] = useState(null)

  const year = current.getFullYear()
  const month = current.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Map events to their date string keys
  const eventMap = useMemo(() => {
    const map = {}
    events.forEach(ev => {
      const d = getEventDate(ev)
      if (!d) return
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = d.getDate()
        if (!map[key]) map[key] = []
        map[key].push(ev)
      }
    })
    return map
  }, [events, year, month])

  function prev() { setCurrent(new Date(year, month - 1, 1)) }
  function next() { setCurrent(new Date(year, month + 1, 1)) }
  function goToday() { setCurrent(new Date()) }

  const today = new Date()
  const isToday = (day) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  const dayEvents = selected ? (eventMap[selected] || []) : []

  // Build calendar grid cells
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-dark">Campaign Calendar</h1>
          <p className="text-sm text-neutral-muted mt-1">Visual overview of all campaign events by month.</p>
        </div>
        <Link
          to="/admin/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-heading font-semibold text-sm rounded-xl hover:bg-accent-dark transition-colors shadow-glow"
        >
          <Calendar size={15} />
          Manage Events
        </Link>
      </div>

      {/* Calendar card */}
      <div className="bg-white rounded-2xl shadow-card border border-neutral-border overflow-hidden">

        {/* Month navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border bg-secondary">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="text-center">
            <h2 className="font-heading font-bold text-lg text-white">
              {MONTHS[month]} {year}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToday}
              className="text-xs font-medium text-white/80 hover:text-white border border-white/30 rounded-lg px-3 py-1.5 hover:bg-white/10 transition-colors"
            >
              Today
            </button>
            <button
              onClick={next}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-neutral-border">
          {DAYS.map(d => (
            <div key={d} className="py-2 text-center text-xs font-heading font-semibold text-neutral-muted uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const hasEvents = day && eventMap[day]?.length > 0
            const isSelected = day === selected
            const isTodayCell = day && isToday(day)
            return (
              <div
                key={i}
                onClick={() => day && setSelected(isSelected ? null : day)}
                className={`min-h-[72px] p-2 border-b border-r border-neutral-border transition-colors ${day ? 'cursor-pointer hover:bg-neutral-bg' : 'bg-neutral-bg/40'
                  } ${isSelected ? 'bg-secondary/5 ring-2 ring-inset ring-secondary' : ''}`}
              >
                {day && (
                  <>
                    <span className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-sm font-heading font-semibold ${isTodayCell
                        ? 'bg-accent text-white'
                        : isSelected
                          ? 'bg-secondary text-white'
                          : 'text-neutral-dark'
                      }`}>
                      {day}
                    </span>
                    {hasEvents && (
                      <div className="mt-1 space-y-0.5">
                        {eventMap[day].slice(0, 2).map(ev => (
                          <p key={ev.id} className="text-[10px] leading-tight bg-secondary/10 text-secondary rounded px-1 py-0.5 truncate font-medium">
                            {ev.title}
                          </p>
                        ))}
                        {eventMap[day].length > 2 && (
                          <p className="text-[10px] text-neutral-muted">+{eventMap[day].length - 2} more</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected day events */}
      {selected && (
        <div className="mt-6 bg-white rounded-2xl shadow-card border border-neutral-border overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-border bg-neutral-bg flex items-center justify-between">
            <h3 className="font-heading font-semibold text-primary">
              Events on {MONTHS[month]} {selected}, {year}
            </h3>
            <button onClick={() => setSelected(null)} className="text-neutral-muted hover:text-neutral-dark text-sm">
              ✕
            </button>
          </div>

          {dayEvents.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <Calendar size={28} className="text-neutral-muted mx-auto mb-2" />
              <p className="text-sm text-neutral-muted">No events on this day.</p>
              <Link to="/admin/events" className="text-sm text-accent font-medium hover:text-accent-dark mt-2 inline-block">
                Add an event →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-border">
              {dayEvents.map(ev => (
                <div key={ev.id} className="flex items-start gap-4 px-5 py-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-primary">{ev.title}</p>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-neutral-muted">
                        <Clock size={11} className="text-accent" />
                        {formatDateRange(ev.startDateTime, ev.endDateTime)}
                      </span>
                      {ev.location && (
                        <span className="flex items-center gap-1 text-xs text-neutral-muted">
                          <MapPin size={11} className="text-accent" />
                          {ev.location}
                        </span>
                      )}
                    </div>
                    {ev.description && (
                      <p className="text-xs text-neutral-muted mt-1 line-clamp-2">{ev.description}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${ev.isPublished ? 'bg-success/10 text-success' : 'bg-neutral-bg text-neutral-muted'
                    }`}>
                    {ev.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Event summary for month */}
      <div className="mt-4 text-xs text-neutral-muted text-center">
        {Object.values(eventMap).flat().length} event{Object.values(eventMap).flat().length !== 1 ? 's' : ''} in {MONTHS[month]} {year}
        {' · '}
        <Link to="/admin/events" className="text-accent hover:text-accent-dark font-medium">
          Manage all events
        </Link>
      </div>

    </div>
  )
}