// src/pages/public/NewsEvents.jsx

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { usePublicEvents } from '@/hooks/usePublicEvents'
import { usePublicNews } from '@/hooks/usePublicNews'
import { formatDate, formatDateRange, isUpcoming } from '@/utils/formatDate'
import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  Newspaper
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function NewsCard({ article }) {
  return (
    <Link to={`/news/${article.id}`}
      className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-neutral-border overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1">
      {article.coverImage && (
        <div className="aspect-[16/9] overflow-hidden flex-shrink-0">
          <img src={article.coverImage} alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          {article.category && (
            <span className="text-[10px] font-bold bg-accent/10 text-accent-dark px-2.5 py-1 rounded-full uppercase tracking-wide">
              {article.category}
            </span>
          )}
          <span className="text-xs text-neutral-muted">{formatDate(article.publishedAt || article.createdAt)}</span>
        </div>
        <h3 className="font-heading font-bold text-base text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-neutral-muted line-clamp-2 flex-1">{article.excerpt}</p>
        <div className="flex items-center gap-1 text-accent text-sm font-semibold mt-4">
          Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

function EventCard({ event }) {
  const d = event.startDateTime?.toDate ? event.startDateTime.toDate() : new Date(event.startDateTime)
  const upcoming = isUpcoming(event.endDateTime)
  return (
    <div className="bg-white rounded-2xl shadow-card border border-neutral-border overflow-hidden flex gap-4 p-4">
      <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${upcoming ? 'bg-secondary' : 'bg-neutral-bg'}`}>
        <span className={`font-heading font-bold text-xl leading-none ${upcoming ? 'text-white' : 'text-neutral-muted'}`}>{d.getDate()}</span>
        <span className={`text-[10px] uppercase tracking-wide mt-0.5 ${upcoming ? 'text-white/70' : 'text-neutral-muted'}`}>
          {d.toLocaleDateString('en', { month: 'short' })}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-semibold text-sm text-primary line-clamp-2">{event.title}</h3>
          {!upcoming && (
            <span className="text-[10px] text-neutral-muted bg-neutral-bg px-2 py-0.5 rounded-full flex-shrink-0">Past</span>
          )}
        </div>
        <div className="mt-1.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-neutral-muted">
            <Clock size={11} className="text-accent flex-shrink-0" />
            <span className="line-clamp-1">{formatDateRange(event.startDateTime, event.endDateTime)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-muted">
              <MapPin size={11} className="text-accent flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NewsEvents() {
  const { news, loading: newsLoading } = usePublicNews()
  const { events, loading: eventsLoading } = usePublicEvents()
  const [tab, setTab] = useState('news')

  const upcomingEvents = events.filter(e => isUpcoming(e.endDateTime))
  const pastEvents = events.filter(e => !isUpcoming(e.endDateTime))

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-hero text-white pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '36px 36px' }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h1 className="font-heading font-bold text-3xl lg:text-5xl text-white mb-4">News &amp; Events</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Stay up to date with the latest campaign news and upcoming events across Bogeka Ward.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-neutral-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-1 py-3">
            {[
              { key: 'news', label: `News (${news.length})`, icon: Newspaper },
              { key: 'events', label: `Events (${events.length})`, icon: CalendarDays },
            ].map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-heading font-semibold transition-colors ${tab === key ? 'bg-accent text-white' : 'text-neutral-muted hover:text-primary hover:bg-neutral-bg'
                  }`}>
                <Icon size={15} />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="bg-neutral-bg py-10 lg:py-16 min-h-[400px]">
        <div className="container mx-auto px-4 lg:px-8">

          {/* News tab */}
          {tab === 'news' && (
            newsLoading ? (
              <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
            ) : news.length === 0 ? (
              <div className="text-center py-24">
                <Newspaper size={40} className="text-neutral-muted mx-auto mb-3" />
                <p className="font-heading font-semibold text-primary">No news published yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map(a => <NewsCard key={a.id} article={a} />)}
              </div>
            )
          )}

          {/* Events tab */}
          {tab === 'events' && (
            eventsLoading ? (
              <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
            ) : events.length === 0 ? (
              <div className="text-center py-24">
                <CalendarDays size={40} className="text-neutral-muted mx-auto mb-3" />
                <p className="font-heading font-semibold text-primary">No events scheduled yet</p>
              </div>
            ) : (
              <div className="space-y-8">
                {upcomingEvents.length > 0 && (
                  <div>
                    <h2 className="font-heading font-bold text-xl text-primary mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent" /> Upcoming Events
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {upcomingEvents.map(e => <EventCard key={e.id} event={e} />)}
                    </div>
                  </div>
                )}
                {pastEvents.length > 0 && (
                  <div>
                    <h2 className="font-heading font-bold text-xl text-primary mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-neutral-muted" /> Past Events
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {pastEvents.map(e => <EventCard key={e.id} event={e} />)}
                    </div>
                  </div>
                )}
              </div>
            )
          )}

        </div>
      </section>
    </div>
  )
}