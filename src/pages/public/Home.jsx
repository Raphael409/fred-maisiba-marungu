// src/pages/public/Home.jsx
// Homepage — complete with all sections.

import { Link }              from 'react-router-dom'
import {
  ArrowRight, CheckCircle, FolderKanban, Users, Heart, MapPin, Tag, Eye,
  Calendar, Clock, Newspaper, CalendarDays, Quote, ChevronLeft, ChevronRight,
  GraduationCap, Stethoscope, Sprout, Wifi, HardHat, Sparkles,
} from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { useProjects }         from '@/hooks/useProjects'
import { usePublicNews }       from '@/hooks/usePublicNews'
import { usePublicEvents }     from '@/hooks/usePublicEvents'
import { useFeaturedProjects } from '@/hooks/useFeaturedProjects'
import LoadingSpinner          from '@/components/shared/LoadingSpinner'
import { formatDate, formatDateRange, isUpcoming } from '@/utils/formatDate'

// ─── Count-up hook ──────────────────────────────────────────────────────────
function useCountUp(target, duration = 1800) {
  const [value, setValue]   = useState(0)
  const ref                 = useRef(null)
  const hasRun              = useRef(false)

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
          const tick  = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased    = 1 - Math.pow(1 - progress, 3)
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
      icon:        FolderKanban,
      value:       projectCount,
      suffix:      '+',
      label:       'Community Projects',
      description: 'Completed projects delivering real, measurable impact across our region.',
    },
    {
      icon:        Users,
      value:       residentsCount,
      suffix:      '+',
      label:       'Residents Reached',
      description: 'People whose lives have been directly improved through our community work.',
    },
    {
      icon:        Heart,
      value:       youthCount,
      suffix:      '+',
      label:       'Youth Empowered',
      description: 'Young people supported through education, skills, and opportunity programmes.',
    },
    {
      icon:        MapPin,
      value:       villagesCount,
      suffix:      '+',
      label:       'Villages Supported',
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
              Join Our Movement
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
    ongoing:   'bg-accent/10 text-accent border-accent/20',
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
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${
                      statusColors[project.status] || statusColors.completed
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

// ─── Vision & Priorities Section ─────────────────────────────────────────────
const pillars = [
  {
    icon:        Sprout,
    title:       'Agriculture & Economic Empowerment',
    description: 'Supporting "Kilimo Biashara" ventures, promoting value addition, and encouraging youth and women to participate in agriculture as a business enterprise.',
  },
  {
    icon:        GraduationCap,
    title:       'Education & Skills Development',
    description: 'Strengthening access to education, supporting marginalized learners, promoting vocational and technical skills, and championing entrepreneurship for youth employment.',
  },
  {
    icon:        Stethoscope,
    title:       'Healthcare & Social Welfare',
    description: 'Advocating for accessible, quality healthcare, supporting maternal and child health initiatives, and strengthening community awareness on preventive healthcare.',
  },
  {
    icon:        HardHat,
    title:       'Roads, Water & Infrastructure',
    description: 'Prioritising improvement of local roads, advocating for clean piped water, and promoting appropriate lighting to improve security and economic activity.',
  },
  {
    icon:        Heart,
    title:       'Youth & Women Empowerment',
    description: 'Expanding opportunities for youth entrepreneurship, supporting women-led enterprises, and encouraging inclusive participation in local development programs.',
  },
  {
    icon:        Wifi,
    title:       'Accountable Leadership',
    description: 'Promoting transparency in development planning, maintaining regular community consultations, and tracking projects with open progress communication to residents.',
  },
]

function PillarCard({ icon: Icon, title, description, index }) {
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover border border-neutral-border transition-all duration-300 hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-secondary/8 group-hover:bg-secondary flex items-center justify-center mb-4 transition-colors duration-300">
        <Icon size={22} className="text-secondary group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="font-heading font-bold text-base text-primary mb-2">{title}</h3>
      <p className="text-sm text-neutral-muted leading-relaxed">{description}</p>
    </div>
  )
}

function VisionPrioritiesSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/8 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-primary">
              Our Priorities
            </span>
          </div>
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-3">
            Vision for Bogeka Ward
          </h2>
          <p className="text-neutral-muted leading-relaxed">
            Six priority areas that will shape every decision Fred Maisiba makes as MCA —
            rooted in what the community has told us matters most.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p, i) => (
            <PillarCard key={p.title} {...p} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href="/vision-mission"
            className="inline-flex items-center gap-2 px-7 py-3 bg-secondary text-white font-heading font-semibold text-sm rounded-full hover:bg-secondary-dark transition-colors shadow-md"
          >
            Read the Full Vision & Manifesto
            <ArrowRight size={15} />
          </a>
        </div>

      </div>
    </section>
  )
}

// ─── News & Events Section ────────────────────────────────────────────────────
function NewsEventsSection() {
  const { news,   loading: newsLoading }   = usePublicNews()
  const { events, loading: eventsLoading } = usePublicEvents()

  const latestNews     = news.slice(0, 3)
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

          {/* ── LEFT: News (3/5 width) ────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Newspaper size={18} className="text-accent" />
                <h3 className="font-heading font-bold text-lg text-primary">Latest News</h3>
              </div>
              <a href="/news" className="text-xs font-heading font-semibold text-primary hover:text-accent transition-colors flex items-center gap-1">
                View All <ArrowRight size={13} />
              </a>
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
                {latestNews.map(article => (
                  <a
                    key={article.id}
                    href={`/news/${article.id}`}
                    className="group flex gap-4 bg-white rounded-2xl shadow-card hover:shadow-card-hover p-4 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {article.coverImage && (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-xs text-accent font-semibold uppercase tracking-wide mb-1">
                        {article.category} · {formatDate(article.publishedAt || article.createdAt)}
                      </p>
                      <h4 className="font-heading font-semibold text-primary line-clamp-2 group-hover:text-accent transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-xs text-neutral-muted line-clamp-1 mt-1">{article.excerpt}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Events (2/5 width) ─────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-accent" />
                <h3 className="font-heading font-bold text-lg text-primary">Upcoming Events</h3>
              </div>
              <a href="/news" className="text-xs font-heading font-semibold text-primary hover:text-accent transition-colors flex items-center gap-1">
                View All <ArrowRight size={13} />
              </a>
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
                {upcomingEvents.map(event => {
                  const d = event.startDateTime?.toDate
                    ? event.startDateTime.toDate()
                    : new Date(event.startDateTime)
                  return (
                    <div key={event.id} className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover p-4 flex gap-4 transition-all duration-300 hover:-translate-y-0.5">
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-secondary flex flex-col items-center justify-center text-white">
                        <span className="font-heading font-bold text-xl leading-none">{d.getDate()}</span>
                        <span className="text-[10px] uppercase tracking-wide mt-0.5">
                          {d.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-semibold text-primary text-sm line-clamp-2 mb-1.5">{event.title}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-muted mb-1">
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


// Replace placeholder quotes with real community testimonials once collected.
const testimonials = [
  {
    quote: '"Leadership should translate plans into measurable improvements in people\'s lives. That is the standard I hold myself to every day."',
    name:  'Hon. Fred Maisiba Marungu',
    role:  'MCA Candidate, Bogeka Ward',
    avatar: '',
  },
  {
    quote: '[Placeholder: A genuine quote from a Bogeka Ward resident about Fred\'s work in the community — 2-3 sentences. Replace with a real testimonial.]',
    name:  '[Resident Name]',
    role:  '[Village, Bogeka Ward]',
    avatar: '',
  },
  {
    quote: '[Placeholder: A quote from a community leader or farmer about the impact of Fred\'s programmes. Replace with a real testimonial.]',
    name:  '[Community Leader Name]',
    role:  '[Role / Village, Bogeka Ward]',
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

          {/* Nav arrows — DESKTOP only (absolute, outside card via sm:px-8 container) */}
          <button
            onClick={() => go(-1)}
            className="hidden sm:flex absolute -left-5 top-[40%] -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-card items-center justify-center text-secondary hover:bg-accent hover:text-white transition-colors duration-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => go(1)}
            className="hidden sm:flex absolute -right-5 top-[40%] -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-card items-center justify-center text-secondary hover:bg-accent hover:text-white transition-colors duration-200"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>

          {/* Nav arrows — MOBILE only (below card, never overlaps) */}
          <div className="flex sm:hidden justify-center gap-4 mt-5">
            <button
              onClick={() => go(-1)}
              className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-secondary hover:bg-accent hover:text-white transition-colors duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => go(1)}
              className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-secondary hover:bg-accent hover:text-white transition-colors duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'w-7 bg-secondary' : 'w-2 bg-neutral-border hover:bg-accent/50'
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
            Join Our Movement for{' '}
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
              Join Our Movement
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

// ─── Main Home Component ────────────────────────────────────────────────────
export default function Home() {
  const { projects } = useProjects()

  const completedCount = projects.filter(p => p.status === 'completed').length
  const communityCount = new Set(projects.map(p => p.location).filter(Boolean)).size

  const residentsTarget = 3000
  const youthTarget     = 100
  const villagesTarget  = communityCount || 15

  return (
    <div>
      {/* 1. Hero — first impression, Fred's face, slogan, CTAs */}
      <HeroSection
        projectCount={completedCount}
        communityCount={communityCount}
      />

      {/* 2. Stats — credibility through numbers */}
      <StatsSection
        projectCount={completedCount}
        residentsCount={residentsTarget}
        youthCount={youthTarget}
        villagesCount={villagesTarget}
      />

      {/* 3. Featured Projects — proof of delivery */}
      <FeaturedProjectsSection />

      {/* 4. Vision & Priorities — what Fred stands for */}
      <VisionPrioritiesSection />

      {/* 5. News & Events — keeps site feeling active */}
      <NewsEventsSection />

      {/* 7. Testimonials — social proof */}
      <TestimonialsSection />

      {/* 8. CTA Band — one clear final call to action */}
      <CTABand />
    </div>
  )
}