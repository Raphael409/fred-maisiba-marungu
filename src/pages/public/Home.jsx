// src/pages/public/Home.jsx
// Homepage — complete with all sections.

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useFeaturedProjects } from '@/hooks/useFeaturedProjects'
import { useProjects } from '@/hooks/useProjects'
import { usePublicEvents } from '@/hooks/usePublicEvents'
import { usePublicGallery } from '@/hooks/usePublicGallery'
import { usePublicNews } from '@/hooks/usePublicNews'
import { useVolunteers } from '@/hooks/useVolunteers'
import { formatDate, formatDateRange, isUpcoming } from '@/utils/formatDate'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  ChevronLeft, ChevronRight,
  Clock,
  Eye,
  FolderKanban,
  GraduationCap,
  HardHat,
  Heart,
  Image as ImageIcon,
  MapPin,
  Newspaper,
  Quote,
  Sparkles,
  Sprout,
  Stethoscope,
  Tag,
  Users,
  Wifi,
  ZoomIn
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// ─── Count-up hook ──────────────────────────────────────────────────────────
function useCountUp(target, duration = 1800) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const hasRun = useRef(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { setValue(target); return }

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true
          const start = performance.now()
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [target, duration])

  return [ref, value]
}

// ─── Single stat card ───────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, suffix = '+', label, description, index }) {
  const [ref, count] = useCountUp(value)

  const accents = [
    'bg-white/20 text-white border-white/10',
    'bg-white/20 text-white border-white/10',
    'bg-white/20 text-white border-white/10',
    'bg-white/20 text-white border-white/10',
  ]

  return (
    <div
      ref={ref}
      className="group relative bg-white/8 hover:bg-white/14 border border-white/10 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />

      {/* Icon circle */}
      <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        <Icon size={26} className="text-white" />
      </div>

      {/* Animated number */}
      <div className="flex items-end gap-1 mb-1">
        <span className="font-heading font-bold text-4xl lg:text-5xl text-white tabular-nums leading-none">
          {count.toLocaleString()}
        </span>
        <span className="font-heading font-bold text-2xl text-white/50 mb-1">
          {suffix}
        </span>
      </div>

      {/* Label */}
      <p className="font-heading font-semibold text-white mb-1">{label}</p>

      {/* Description */}
      <p className="text-sm text-white/60 leading-relaxed">{description}</p>

      {/* Bottom accent line */}
      <div className="mt-5 h-0.5 w-12 rounded-full bg-white/30 group-hover:w-full transition-all duration-500" />
    </div>
  )
}

// ─── Stats Section ───────────────────────────────────────────────────────────
function StatsSection({ projectCount, residentsCount, youthCount, villagesCount }) {
  const stats = [
    {
      icon: FolderKanban,
      value: projectCount,
      suffix: '+',
      label: 'Community Projects',
      description: 'Completed projects delivering real, measurable impact across our region.',
    },
    {
      icon: Users,
      value: residentsCount,
      suffix: '+',
      label: 'Residents Reached',
      description: 'People whose lives have been directly improved through our community work.',
    },
    {
      icon: Heart,
      value: youthCount,
      suffix: '+',
      label: 'Youth Empowered',
      description: 'Young people supported through education, skills, and opportunity programmes.',
    },
    {
      icon: MapPin,
      value: villagesCount,
      suffix: '+',
      label: 'Villages Supported',
      description: 'Communities across the region that have benefited from our outreach and projects.',
    },
  ]

  return (
    <section className="relative bg-primary py-16 lg:py-24 overflow-hidden">

      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-secondary opacity-90" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-white/3 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-white/3 blur-3xl" />
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">

        {/* Section heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-white/90">
              Our Impact in Numbers
            </span>
          </div>
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-white mb-4">
            Real Results, Real Communities
          </h2>
          <p className="text-white/65 leading-relaxed">
            Every number below represents a real person, a real place,
            and a real commitment honoured. This is our track record —
            and it's only the beginning.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>

        {/* Bottom link */}
        <div className="text-center mt-10">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-heading font-semibold text-sm transition-colors duration-200 group"
          >
            See all completed projects
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

      </div>
    </section>
  )
}

// ─── Wave Divider ───────────────────────────────────────────────────────────
function WaveDivider() {
  return (
    <div className="absolute bottom-0 left-0 right-0 leading-[0] z-10">
      <svg
        viewBox="0 0 1440 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-[60px] sm:h-[80px] lg:h-[100px]"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C180,90 360,10 540,50 C720,90 900,20 1080,55 C1260,88 1380,30 1440,50 L1440,100 L0,100 Z"
          fill="#F5F5F5"
        />
      </svg>
    </div>
  )
}

// ─── Floating Stat Card ─────────────────────────────────────────────────────
function FloatCard({ number, suffix = '+', label, className = '' }) {
  return (
    <div className={`absolute bg-white rounded-2xl shadow-float px-5 py-4 flex items-center gap-3 z-20 ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <CheckCircle size={20} className="text-primary" />
      </div>
      <div>
        <p className="font-heading font-bold text-xl text-primary leading-tight">
          {number}{suffix}
        </p>
        <p className="text-xs text-neutral-muted leading-tight">{label}</p>
      </div>
    </div>
  )
}

// ─── Hero Section ───────────────────────────────────────────────────────────
function HeroSection({ projectCount, communityCount }) {
  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">

      {/* ── Full-width background image ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://res.cloudinary.com/dhkkunuyp/image/upload/v1783203168/campaign/news/lshtsujcmvvr0afpenks.jpg"
          alt="Fred Maisiba Marungu — Bogeka Ward MCA"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay — heavier on the left (text side), lighter on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        {/* Bottom fade for wave divider transition */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 w-full pt-24 pb-20 lg:pt-[112px] lg:pb-28">
        <div className="max-w-2xl">

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-white/90">
              Candidate for Bogeka Ward MCA
            </span>
          </div>

          {/* Slogan */}
          <p className="font-accent italic text-2xl sm:text-3xl text-white/90 mb-3">
            &ldquo;Chinsiaga&rdquo;
          </p>

          {/* Main headline */}
          <h1 className="font-heading font-bold leading-[1.05] mb-6 text-[clamp(2.2rem,5vw,3.6rem)] text-white">
            Leadership That{' '}
            <span className="relative inline-block">
              Delivers
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 9 C50 3, 100 3, 198 9"
                  stroke="#F45A22"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {' '}Real Change
          </h1>

          {/* Subtext */}
          <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-xl">
            Fred Maisiba Marungu is running for Bogeka Ward MCA — together we build
            a stronger Bogeka through development, transparency, and opportunity.
            Not promises — proven results.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-10">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary font-heading font-bold text-sm rounded-full shadow-float hover:bg-neutral-bg hover:scale-105 transition-all duration-200"
            >
              About Fred Maisiba
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/volunteer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-heading font-bold text-sm rounded-full shadow-glow hover:bg-accent-dark hover:scale-105 transition-all duration-200"
            >
              Get Involved
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/50 text-white font-heading font-semibold text-sm rounded-full hover:bg-white hover:text-primary hover:scale-105 transition-all duration-200"
            >
              View Projects
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Floating stat cards — inline below CTAs */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={18} className="text-accent" />
              </div>
              <div>
                <p className="font-heading font-bold text-xl text-white leading-tight">
                  {projectCount}+
                </p>
                <p className="text-xs text-white/60 leading-tight">Projects Completed</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={18} className="text-white" />
              </div>
              <div>
                <p className="font-heading font-bold text-xl text-white leading-tight">
                  {communityCount}+
                </p>
                <p className="text-xs text-white/60 leading-tight">Communities Served</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Wave divider */}
      <WaveDivider />

    </section>
  )
}

// ─── Featured Projects Section ──────────────────────────────────────────────
function FeaturedProjectsSection() {
  const { featuredProjects, loading } = useFeaturedProjects()

  const statusColors = {
    completed: 'bg-success/10 text-success border-success/20',
    ongoing: 'bg-accent/10 text-accent border-accent/20',
  }

  return (
    <section className="bg-neutral-bg py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-primary/8 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-primary">
                Proven Track Record
              </span>
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-3">
              Featured Community Projects
            </h2>
            <p className="text-neutral-muted leading-relaxed">
              A selection of our most impactful completed projects —
              each one a real commitment delivered for our community.
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-primary text-primary font-heading font-semibold text-sm rounded-full hover:bg-primary hover:text-white transition-colors duration-200 flex-shrink-0 self-start sm:self-auto"
          >
            View All Projects
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>

        ) : featuredProjects.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-border">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FolderKanban size={28} className="text-primary" />
            </div>
            <p className="font-heading font-semibold text-primary mb-1">No featured projects yet</p>
            <p className="text-sm text-neutral-muted">
              Mark projects as "Featured" in the admin dashboard to showcase them here.
            </p>
          </div>

        ) : (
          /* Projects grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredProjects.slice(0, 3).map((project, i) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Category tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1">
                    <Tag size={11} className="text-primary" />
                    <span className="text-xs font-heading font-semibold text-primary">
                      {project.category}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${statusColors[project.status] || statusColors.completed
                      }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 lg:p-6 flex flex-col flex-1">

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-accent text-xs font-medium mb-2">
                    <MapPin size={12} />
                    <span>{project.location}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-lg text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors duration-200">
                    {project.title}
                  </h3>

                  {/* Impact summary */}
                  <p className="text-sm text-neutral-muted leading-relaxed line-clamp-2 mb-5 flex-1">
                    {project.impactSummary}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-border">
                    <span className="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-primary group-hover:text-accent transition-colors duration-200">
                      <Eye size={14} />
                      View Details
                    </span>
                    <div className="w-8 h-8 rounded-full bg-primary/8 group-hover:bg-primary flex items-center justify-center transition-colors duration-200">
                      <ArrowRight size={14} className="text-primary group-hover:text-white transition-colors duration-200" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}

// ─── Impact Band (navy divider — distinguishes the two grey sections) ──────
function ImpactBand() {
  return (
    <section className="relative bg-secondary py-14 lg:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-secondary-dark via-secondary to-primary opacity-90" />
      <div className="absolute -top-24 right-1/4 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">

          <div className="max-w-xl">
            <p className="font-accent italic text-xl sm:text-2xl text-white/85 mb-2">
              &ldquo;Chinsiaga&rdquo;
            </p>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">
              A movement built by Bogeka, for Bogeka.
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 flex-shrink-0">
            <Link
              to="/volunteer"
              className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white font-heading font-semibold text-sm rounded-full shadow-glow hover:bg-accent-dark hover:scale-105 transition-all duration-200"
            >
              Join the Movement
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/vision-mission"
              className="inline-flex items-center gap-2 px-7 py-3 border-2 border-white/40 text-white font-heading font-semibold text-sm rounded-full hover:bg-white hover:text-secondary transition-all duration-200"
            >
              Our Vision
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── News & Events Section ──────────────────────────────────────────────────
function NewsEventsSection() {
  const { news, loading: newsLoading } = usePublicNews()
  const { events, loading: eventsLoading } = usePublicEvents()

  const latestNews = news.slice(0, 3)
  const upcomingEvents = events.filter(e => isUpcoming(e.endDateTime)).slice(0, 3)

  return (
    <section className="bg-neutral-bg py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/8 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-primary">
              Stay Connected
            </span>
          </div>
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-3">
            News &amp; Upcoming Events
          </h2>
          <p className="text-neutral-muted leading-relaxed">
            Follow the latest campaign updates and join us at upcoming
            community events across Bogeka Ward.
          </p>
        </div>

        {/* Side-by-side layout: News left, Events right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* ── LEFT: News (3/5 width) ──────────────────────── */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Newspaper size={18} className="text-accent" />
                <h3 className="font-heading font-bold text-lg text-primary">Latest News</h3>
              </div>
              <Link
                to="/news"
                className="text-xs font-heading font-semibold text-primary hover:text-accent transition-colors duration-200 flex items-center gap-1"
              >
                View All <ArrowRight size={13} />
              </Link>
            </div>

            {newsLoading ? (
              <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
            ) : latestNews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-border p-10 text-center">
                <Newspaper size={28} className="text-neutral-muted mx-auto mb-3" />
                <p className="text-sm text-neutral-muted">No news published yet — check back soon.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {latestNews.map((article, i) => (
                  <Link
                    key={article.id}
                    to={`/news/${article.id}`}
                    className={`group flex gap-4 bg-white rounded-2xl shadow-card hover:shadow-card-hover p-4 transition-all duration-300 hover:-translate-y-0.5 ${i === 0 ? 'sm:flex-row' : 'flex-row'
                      }`}
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-xs text-accent font-semibold uppercase tracking-wide mb-1">
                        {article.category} &middot; {formatDate(article.publishedAt || article.createdAt)}
                      </p>
                      <h4 className="font-heading font-semibold text-primary line-clamp-2 group-hover:text-accent transition-colors duration-200">
                        {article.title}
                      </h4>
                      <p className="text-xs text-neutral-muted line-clamp-1 mt-1">
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Events (2/5 width) ───────────────────── */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-accent" />
                <h3 className="font-heading font-bold text-lg text-primary">Upcoming Events</h3>
              </div>
              <Link
                to="/news"
                className="text-xs font-heading font-semibold text-primary hover:text-accent transition-colors duration-200 flex items-center gap-1"
              >
                View All <ArrowRight size={13} />
              </Link>
            </div>

            {eventsLoading ? (
              <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
            ) : upcomingEvents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-border p-10 text-center">
                <CalendarDays size={28} className="text-neutral-muted mx-auto mb-3" />
                <p className="text-sm text-neutral-muted">No upcoming events scheduled yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => {
                  const eventDate = event.startDateTime?.toDate
                    ? event.startDateTime.toDate()
                    : new Date(event.startDateTime)

                  return (
                    <div
                      key={event.id}
                      className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover p-4 flex gap-4 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      {/* Date badge */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-secondary flex flex-col items-center justify-center text-white">
                        <span className="font-heading font-bold text-xl leading-none">
                          {eventDate.getDate()}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide mt-0.5">
                          {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-semibold text-primary text-sm line-clamp-2 mb-1.5">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-muted mb-1">
                          <Clock size={11} className="text-accent flex-shrink-0" />
                          <span className="line-clamp-1">
                            {formatDateRange(event.startDateTime, event.endDateTime)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-muted">
                          <MapPin size={11} className="text-accent flex-shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  )
}

// ─── Vision & Priorities Section ────────────────────────────────────────────
const pillars = [
  {
    icon: GraduationCap,
    title: 'Education',
    description: 'Investing in schools, scholarships, and learning resources so every child in Bogeka has a real chance to succeed.',
  },
  {
    icon: Stethoscope,
    title: 'Healthcare',
    description: 'Improving access to quality, affordable healthcare facilities and services across every village in the ward.',
  },
  {
    icon: Heart,
    title: 'Youth Empowerment',
    description: 'Creating skills, mentorship, and economic opportunities that give young people a future worth staying for.',
  },
  {
    icon: HardHat,
    title: 'Infrastructure',
    description: 'Building and maintaining roads, water systems, and public facilities that connect and serve our communities.',
  },
  {
    icon: Sprout,
    title: 'Agriculture',
    description: 'Supporting farmers with resources, training, and market access to strengthen food security and livelihoods.',
  },
  {
    icon: Wifi,
    title: 'Digital Transformation',
    description: 'Bringing connectivity and digital literacy to Bogeka so our community can compete and thrive in a modern economy.',
  },
]

function PillarCard({ icon: Icon, title, description, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${index * 80}ms` : '0ms' }}
      className={`group bg-white rounded-2xl p-7 border border-neutral-border shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1.5 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
    >
      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
        <Icon size={26} className="text-white" />
      </div>
      <h3 className="font-heading font-bold text-lg text-primary mb-2">{title}</h3>
      <p className="text-sm text-neutral-muted leading-relaxed">{description}</p>

      {/* Bottom accent line */}
      <div className="mt-5 h-0.5 w-10 rounded-full bg-accent/40 group-hover:w-full group-hover:bg-accent transition-all duration-500" />
    </div>
  )
}

function VisionPrioritiesSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-4">
            <Sparkles size={12} className="text-accent" />
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
              Our Vision
            </span>
          </div>
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-3">
            Priorities for a Stronger Bogeka
          </h2>
          <p className="text-neutral-muted leading-relaxed">
            Six pillars that guide every decision, every project, and every
            commitment we make to the people of Bogeka Ward.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <PillarCard key={pillar.title} {...pillar} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            to="/vision-mission"
            className="inline-flex items-center gap-2 px-7 py-3 bg-secondary text-white font-heading font-semibold text-sm rounded-full hover:bg-secondary-dark transition-colors duration-200 shadow-md"
          >
            Read Our Full Vision &amp; Mission
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  )
}

// ─── Testimonials Section ───────────────────────────────────────────────────
// Placeholder content — swap with real community testimonials once collected.
// `avatar` should be a Cloudinary URL once real resident photos are available;
// falls back to initials if left blank.
const testimonials = [
  {
    quote: "[Placeholder: A short, genuine quote about how a completed project changed daily life in Bogeka — 2-3 sentences.]",
    name: '[Resident Name]',
    role: '[Role / Village, Bogeka Ward]',
    avatar: '',
  },
  {
    quote: '[Placeholder: A short, genuine quote from a community leader about Fred Maisiba\'s leadership and accountability.]',
    name: '[Resident Name]',
    role: '[Role / Village, Bogeka Ward]',
    avatar: '',
  },
  {
    quote: '[Placeholder: A short, genuine quote from a volunteer or youth beneficiary of a campaign programme.]',
    name: '[Resident Name]',
    role: '[Role / Village, Bogeka Ward]',
    avatar: '',
  },
]

function getInitials(name) {
  return name
    .replace(/[\[\]]/g, '')
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function TestimonialsSection() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [paused])

  function go(direction) {
    setIndex(prev => (prev + direction + testimonials.length) % testimonials.length)
  }

  const current = testimonials[index]

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Section header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
              In Their Words
            </span>
          </div>
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary">
            What Bogeka Is Saying
          </h2>
        </div>

        {/* Carousel */}
        <div
          className="relative max-w-2xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >

          {/* ── Dark testimonial card ─────────────────────────── */}
          <div className="relative bg-secondary rounded-3xl shadow-float overflow-hidden">

            {/* Decorative gradient + glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-dark via-secondary to-primary" />
            <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-accent/10 blur-3xl" />

            {/* Giant decorative speech-mark watermark */}
            <Quote
              size={180}
              strokeWidth={0}
              fill="currentColor"
              className="absolute -top-6 right-2 text-white/[0.06] pointer-events-none select-none"
            />

            <div className="relative z-10 px-8 pt-10 pb-24 sm:px-12 sm:pt-12 sm:pb-28 min-h-[260px] flex flex-col justify-center">

              {/* Small quote badge */}
              <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center mb-6 shadow-glow">
                <Quote size={18} className="text-white" fill="white" strokeWidth={0} />
              </div>

              {/* Quote text */}
              <p
                key={index}
                className="text-lg sm:text-xl text-white leading-relaxed italic font-accent animate-fade-in"
              >
                &ldquo;{current.quote}&rdquo;
              </p>
            </div>

            {/* ── Profile footer — avatar bottom-left, overlapping card edge ── */}
            <div className="absolute bottom-0 left-0 right-0 px-8 sm:px-12 pb-6 flex items-center gap-4 z-10">
              {/* Avatar circle */}
              <div className="w-14 h-14 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md">
                {current.avatar ? (
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-heading font-bold text-white text-sm">
                    {getInitials(current.name)}
                  </span>
                )}
              </div>
              <div>
                <p className="font-heading font-semibold text-white text-sm">{current.name}</p>
                <p className="text-xs text-white/60">{current.role}</p>
              </div>
            </div>
          </div>

          {/* Nav arrows */}
          <button
            onClick={() => go(-1)}
            className="absolute left-0 sm:-left-5 top-[40%] -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-secondary hover:bg-accent hover:text-white transition-colors duration-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-0 sm:-right-5 top-[40%] -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-secondary hover:bg-accent hover:text-white transition-colors duration-200"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-7 bg-secondary' : 'w-2 bg-neutral-border hover:bg-accent/50'
                  }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

// ─── Gallery Preview Section (masonry) ──────────────────────────────────────
function GallerySection() {
  const { galleryItems, loading } = usePublicGallery()
  const previewItems = galleryItems.slice(0, 9)

  return (
    <section className="bg-neutral-bg py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-4">
              <ImageIcon size={12} className="text-accent" />
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                Our Work in Pictures
              </span>
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-3">
              Gallery
            </h2>
            <p className="text-neutral-muted leading-relaxed">
              A visual journey through the projects and moments shaping Bogeka Ward.
            </p>
          </div>

          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary text-white font-heading font-semibold text-sm rounded-full hover:bg-secondary-dark transition-colors duration-200 flex-shrink-0 self-start sm:self-auto"
          >
            View Full Gallery
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Masonry grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : previewItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-border">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={28} className="text-secondary" />
            </div>
            <p className="font-heading font-semibold text-primary mb-1">No photos yet</p>
            <p className="text-sm text-neutral-muted">
              Upload photos in the admin dashboard to showcase them here.
            </p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-3 gap-4 [column-fill:_balance]">
            {previewItems.map((item) => (
              <Link
                key={item.id}
                to="/gallery"
                className="group relative block w-full mb-4 break-inside-avoid rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
              >
                <img
                  src={item.imageUrl}
                  alt={item.caption || ''}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  {item.category && (
                    <span className="text-white text-xs font-heading font-semibold uppercase tracking-wide mb-1">
                      {item.category}
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 text-white/80 text-xs">
                    <ZoomIn size={12} />
                    <span>View in Gallery</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}

// ─── Final CTA Band ──────────────────────────────────────────────────────────
function CTABand() {
  return (
    <section className="relative overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary-dark" />
      {/* Decorative elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-28 relative z-10">
        <div className="max-w-3xl mx-auto text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-white/90">
              Be Part of the Change
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-heading font-bold text-white mb-5 text-[clamp(2rem,5vw,3.2rem)] leading-tight">
            Join the Movement for{' '}
            <span className="text-accent">Bogeka Ward</span>
          </h2>

          {/* Subtext */}
          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Whether it's your time, your voice, or your support — every
            contribution brings us closer to a stronger, more prosperous
            Bogeka. Fred Maisiba needs you.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/volunteer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-heading font-bold text-sm rounded-full shadow-glow hover:bg-accent-dark hover:scale-105 transition-all duration-200"
            >
              Volunteer Now
              <ArrowRight size={17} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-heading font-semibold text-sm rounded-full hover:bg-white hover:text-primary transition-all duration-200"
            >
              Meet Fred Maisiba
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Contact Form Section ────────────────────────────────────────────────────
const emptyContact = { name: '', email: '', phone: '', subject: '', message: '' }

function ContactSection() {
  const [form, setForm] = useState(emptyContact)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Your name is required.'
    if (!form.email.trim()) next.email = 'Your email is required.'
    if (!form.subject.trim()) next.subject = 'Please enter a subject.'
    if (!form.message.trim()) next.message = 'Please enter a message.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await addDocument('contactMessages', {
        ...form,
        status: 'unread',
        submittedAt: new Date(),
      })
      setSubmitted(true)
      setForm(emptyContact)
      toast.success('Message sent! We\'ll get back to you shortly.')
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-neutral-bg py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Left: info ─────────────────────────────────── */}
          <div>
            <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-4">
              <MessageSquare size={12} className="text-accent" />
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                Get in Touch
              </span>
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-4">
              Send Us a Message
            </h2>
            <p className="text-neutral-muted leading-relaxed mb-8">
              Have a question, suggestion, or want to support the campaign?
              Fill in the form and the Fred Maisiba campaign team will get
              back to you as soon as possible.
            </p>

            {/* Contact details */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-card">
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-neutral-muted uppercase tracking-wide">Call Anytime</p>
                  <a
                    href="tel:+254719562294"
                    className="font-heading font-semibold text-primary hover:text-accent transition-colors"
                  >
                    +254 719 562 294
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-card">
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-neutral-muted uppercase tracking-wide">Email Us</p>
                  <a
                    href="mailto:fredmaisiba@gmail.com"
                    className="font-heading font-semibold text-primary hover:text-accent transition-colors"
                  >
                    fredmaisiba@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-card">
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-neutral-muted uppercase tracking-wide">Ward</p>
                  <p className="font-heading font-semibold text-primary">Bogeka Ward, Kenya</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: form ────────────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-card-hover p-7 lg:p-9">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle size={32} className="text-success" />
                </div>
                <h3 className="font-heading font-bold text-xl text-primary">Message Sent!</h3>
                <p className="text-neutral-muted text-sm max-w-xs">
                  Thank you for reaching out. The Fred Maisiba campaign team
                  will respond to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm text-accent font-semibold hover:text-accent-dark transition-colors"
                >
                  Send another message →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => update('name', e.target.value)}
                        placeholder="Your full name"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors ${errors.name ? 'border-red-400' : 'border-neutral-border'
                          }`}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => update('email', e.target.value)}
                        placeholder="your@email.com"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors ${errors.email ? 'border-red-400' : 'border-neutral-border'
                          }`}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Phone + Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                      Phone (optional)
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => update('phone', e.target.value)}
                        placeholder="+254 7XX XXX XXX"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                      Subject *
                    </label>
                    <select
                      value={form.subject}
                      onChange={e => update('subject', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors bg-white ${errors.subject ? 'border-red-400' : 'border-neutral-border'
                        }`}
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Community Project">Community Project</option>
                      <option value="Volunteer">Volunteer</option>
                      <option value="Media & Press">Media &amp; Press</option>
                      <option value="Support & Donation">Support &amp; Donation</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                    placeholder="Write your message here..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors resize-none ${errors.message ? 'border-red-400' : 'border-neutral-border'
                      }`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary text-white font-heading font-bold text-sm rounded-xl hover:bg-secondary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Main Home Component ────────────────────────────────────────────────────
export default function Home() {
  const { projects } = useProjects()
  const { volunteers } = useVolunteers()

  const completedCount = projects.filter(p => p.status === 'completed').length
  const communityCount = new Set(projects.map(p => p.location).filter(Boolean)).size

  const residentsTarget = 20000
  const youthTarget = 100
  const villagesTarget = communityCount || 15

  return (
    <div>
      <HeroSection
        projectCount={completedCount}
        communityCount={communityCount}
      />
      <StatsSection
        projectCount={completedCount}
        residentsCount={residentsTarget}
        youthCount={youthTarget}
        villagesCount={villagesTarget}
      />
      <FeaturedProjectsSection />
      <ImpactBand />
      <NewsEventsSection />
      <VisionPrioritiesSection />
      <GallerySection />
      <TestimonialsSection />
      <CTABand />
    </div>
  )
}