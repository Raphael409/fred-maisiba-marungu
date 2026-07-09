// src/pages/public/NewsEvents.jsx

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { usePublicEvents } from '@/hooks/usePublicEvents'
import { usePublicNews } from '@/hooks/usePublicNews'
import { formatDate, formatDateRange, isUpcoming } from '@/utils/formatDate'
import { Calendar, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function NewsEvents() {
  const { news, loading: newsLoading } = usePublicNews()
  const { events, loading: eventsLoading } = usePublicEvents()
  const [tab, setTab] = useState('news') // 'news' | 'events'

  const upcomingEvents = events.filter(e => isUpcoming(e.endDateTime))
  const pastEvents = events.filter(e => !isUpcoming(e.endDateTime))

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero text-white pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-secondary font-heading font-semibold text-sm uppercase tracking-wide mb-2">
            Stay Connected
          </p>
          <h1 className="font-heading text-3xl lg:text-5xl font-bold mb-4">
            News &amp; Events
          </h1>
          <p className="text-neutral-on-dark-muted max-w-2xl mx-auto">
            The latest updates from the campaign trail, plus upcoming community events.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-neutral-border sticky top-16 lg:top-20 bg-white z-30">
        <div className="container mx-auto px-4 lg:px-8 flex gap-6">
          <button
            onClick={() => setTab('news')}
            className={`py-4 font-heading font-semibold text-sm border-b-2 transition-colors ${tab === 'news'
                ? 'border-secondary text-primary'
                : 'border-transparent text-neutral-muted hover:text-primary'
              }`}
          >
            News ({news.length})
          </button>
          <button
            onClick={() => setTab('events')}
            className={`py-4 font-heading font-semibold text-sm border-b-2 transition-colors ${tab === 'events'
                ? 'border-secondary text-primary'
                : 'border-transparent text-neutral-muted hover:text-primary'
              }`}
          >
            Events ({events.length})
          </button>
        </div>
      </div>

      <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">

        {/* ── News tab ──────────────────────────────────── */}
        {tab === 'news' && (
          newsLoading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : news.length === 0 ? (
            <p className="text-center text-neutral-muted py-20">No news articles published yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map(article => (
                <Link
                  key={article.id}
                  to={`/news/${article.id}`}
                  className="group bg-white rounded-xl shadow-card hover:shadow-card-hover overflow-hidden transition-shadow duration-200"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-accent font-semibold uppercase tracking-wide mb-2">
                      {article.category} &middot; {formatDate(article.publishedAt || article.createdAt)}
                    </p>
                    <h3 className="font-heading font-semibold text-lg text-primary mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-neutral-muted line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                    <span className="text-sm font-semibold text-accent group-hover:text-accent-dark">
                      Read More &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}

        {/* ── Events tab ────────────────────────────────── */}
        {tab === 'events' && (
          eventsLoading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : events.length === 0 ? (
            <p className="text-center text-neutral-muted py-20">No events scheduled yet.</p>
          ) : (
            <div className="space-y-10">

              {upcomingEvents.length > 0 && (
                <div>
                  <h2 className="font-heading text-xl font-semibold text-primary mb-4">Upcoming Events</h2>
                  <div className="space-y-4">
                    {upcomingEvents.map(event => (
                      <EventRow key={event.id} event={event} upcoming />
                    ))}
                  </div>
                </div>
              )}

              {pastEvents.length > 0 && (
                <div>
                  <h2 className="font-heading text-xl font-semibold text-primary mb-4">Past Events</h2>
                  <div className="space-y-4">
                    {pastEvents.map(event => (
                      <EventRow key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )
        )}

      </section>
    </div>
  )
}

function EventRow({ event, upcoming = false }) {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 bg-white rounded-xl shadow-card p-5 ${!upcoming ? 'opacity-75' : ''}`}>
      {event.bannerImage && (
        <img
          src={event.bannerImage}
          alt=""
          className="w-full sm:w-40 h-32 sm:h-auto object-cover rounded-lg flex-shrink-0"
        />
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {upcoming && (
            <span className="bg-secondary text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
              Upcoming
            </span>
          )}
        </div>
        <h3 className="font-heading font-semibold text-lg text-primary mb-2">{event.title}</h3>
        <p className="text-sm text-neutral-muted mb-3 line-clamp-2">{event.description}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-muted">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-accent" />
            {formatDateRange(event.startDateTime, event.endDateTime)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-accent" />
            {event.location}
          </span>
        </div>
      </div>
    </div>
  )
}