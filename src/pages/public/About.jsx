// src/pages/public/About.jsx

import {
  ArrowRight,
  CheckCircle,
  Heart, Lightbulb,
  Shield,
  Star,
  Users,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// ─── Scroll-triggered fade-in hook ──────────────────────────────────────────
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, visible]
}

// ─── Core values data ────────────────────────────────────────────────────────
const coreValues = [
  {
    icon: Shield,
    title: 'Integrity',
    description: 'Every decision made in the open, every shilling accounted for. Fred leads with full transparency and zero tolerance for corruption.',
  },
  {
    icon: Heart,
    title: 'Service',
    description: 'Public office is not a privilege — it is a duty. Fred shows up for Bogeka Ward every single day, whether cameras are watching or not.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Bringing fresh, practical solutions to old problems — from digital access to modern farming — Fred thinks forward for Bogeka.',
  },
  {
    icon: Users,
    title: 'Inclusion',
    description: 'Every village, every family, every voice matters. Fred\'s vision leaves no corner of Bogeka Ward behind.',
  },
  {
    icon: Star,
    title: 'Excellence',
    description: 'Good enough is never enough. Fred holds himself and every project to the highest standard — because Bogeka deserves nothing less.',
  },
  {
    icon: CheckCircle,
    title: 'Accountability',
    description: 'Promises made are promises kept. Fred tracks every commitment and reports back to the community on progress and results.',
  },
]

// ─── Timeline milestones ─────────────────────────────────────────────────────
// Replace with real milestones once biography details are confirmed.
const timeline = [
  {
    year: '[Year]',
    title: 'Born & Raised in Bogeka',
    description: '[Placeholder: Brief detail about Fred\'s early life and upbringing in Bogeka Ward — where his deep connection to the community began.]',
  },
  {
    year: '[Year]',
    title: 'Education',
    description: '[Placeholder: Schools attended, qualifications earned, and how education shaped Fred\'s thinking and commitment to the community.]',
  },
  {
    year: '[Year]',
    title: 'Community Leadership Begins',
    description: '[Placeholder: First community role, organisation, or initiative Fred led — the moment public service became his calling.]',
  },
  {
    year: '[Year]',
    title: 'First Community Project Delivered',
    description: '[Placeholder: Description of the first tangible project Fred completed for Bogeka — what it was, where, and how many people it served.]',
  },
  {
    year: '[Year]',
    title: 'Expanded Community Work',
    description: '[Placeholder: Growth of Fred\'s community programme — more projects, more wards reached, wider impact across Bogeka.]',
  },
  {
    year: 'Today',
    title: 'Running for Bogeka Ward MCA',
    description: 'Building on a proven track record of delivered projects, Fred Maisiba Marungu is now asking for the mandate of Bogeka Ward — to do more, reach further, and serve every resident.',
  },
]

// ─── Value card ─────────────────────────────────────────────────────────────
function ValueCard({ icon: Icon, title, description, index }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${index * 80}ms` : '0ms' }}
      className={`group bg-white rounded-2xl p-7 border border-neutral-border shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1.5 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
    >
      <div className="w-13 h-13 w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-accent transition-colors duration-300">
        <Icon size={22} className="text-white" />
      </div>
      <h3 className="font-heading font-bold text-lg text-primary mb-2">{title}</h3>
      <p className="text-sm text-neutral-muted leading-relaxed">{description}</p>
      <div className="mt-5 h-0.5 w-10 rounded-full bg-accent/40 group-hover:w-full group-hover:bg-accent transition-all duration-500" />
    </div>
  )
}

// ─── Timeline item ───────────────────────────────────────────────────────────
function TimelineItem({ year, title, description, index }) {
  const [ref, visible] = useReveal()
  const isLeft = index % 2 === 0

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-0 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
    >
      {/* Content card */}
      <div className={`flex-1 pb-10 lg:pb-12 ${isLeft ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'} pl-12 lg:pl-0`}>
        <div className="bg-white rounded-2xl shadow-card p-6 border border-neutral-border hover:shadow-card-hover transition-shadow duration-300 inline-block w-full">
          <span className="inline-block text-xs font-heading font-bold text-accent uppercase tracking-widest mb-2">
            {year}
          </span>
          <h3 className="font-heading font-bold text-lg text-primary mb-2">{title}</h3>
          <p className="text-sm text-neutral-muted leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Center dot — desktop */}
      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-5 flex-col items-center">
        <div className="w-5 h-5 rounded-full bg-secondary border-4 border-white shadow-md z-10" />
      </div>

      {/* Left dot — mobile */}
      <div className="absolute left-0 top-5 flex flex-col items-center lg:hidden">
        <div className="w-4 h-4 rounded-full bg-secondary border-4 border-white shadow-md z-10" />
      </div>

      {/* Spacer for the other side on desktop */}
      <div className="hidden lg:block flex-1" />
    </div>
  )
}

// ─── Main About page ─────────────────────────────────────────────────────────
export default function About() {
  return (
    <div>

      {/* ── Hero Banner ─────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-primary-dark text-white pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-xs font-heading font-semibold uppercase tracking-widest text-white/90">
                  About the Candidate
                </span>
              </div>
              <h1 className="font-heading font-bold text-3xl lg:text-5xl mb-4 leading-tight">
                Fred Maisiba Marungu
              </h1>
              <p className="font-accent italic text-xl text-white/80 mb-5">
                &ldquo;Chinsiaga&rdquo;
              </p>
              <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-lg">
                Candidate for Bogeka Ward MCA — a lifelong son of Bogeka
                with a proven record of delivering real change for his community.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white font-heading font-semibold text-sm rounded-full shadow-glow hover:bg-accent-dark transition-colors duration-200"
                >
                  See His Projects <ArrowRight size={16} />
                </Link>
                <Link
                  to="/vision-mission"
                  className="inline-flex items-center gap-2 px-7 py-3 border-2 border-white/40 text-white font-heading font-semibold text-sm rounded-full hover:bg-white hover:text-primary transition-all duration-200"
                >
                  Our Vision
                </Link>
              </div>
            </div>

            {/* Right — photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-3xl bg-white/10 transform rotate-3" />
                <div className="relative w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] rounded-3xl overflow-hidden border-4 border-white/20 shadow-float">
                  <img
                    src="https://res.cloudinary.com/dhkkunuyp/image/upload/v1783005786/696857342_10227010253996865_1671340349094157195_n_qipg0h.jpg"
                    alt="Fred Maisiba Marungu — Candidate for Bogeka Ward MCA"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Name tag */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 to-transparent p-5">
                    <p className="font-heading font-bold text-white">Fred Maisiba Marungu</p>
                    <p className="text-white/70 text-xs uppercase tracking-wide">Bogeka Ward MCA Candidate</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Biography ────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">

            <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                Biography
              </span>
            </div>

            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-6">
              A Lifelong Commitment to Bogeka
            </h2>

            <div className="space-y-5 text-neutral-muted leading-relaxed">
              <p>
                [Placeholder: Opening paragraph about Fred Maisiba Marungu — where he was born,
                his family background, and his early connection to Bogeka Ward. This should be
                warm, personal, and authentic — written in a way that helps voters feel they
                know him as a person, not just a politician.]
              </p>
              <p>
                [Placeholder: Second paragraph covering Fred's education and professional
                background — his qualifications, career before politics, and any organisations
                or community groups he has been part of. Focus on how these experiences shaped
                his understanding of Bogeka's needs.]
              </p>
              <p>
                [Placeholder: Third paragraph about Fred's entry into community leadership —
                what motivated him, the first initiative he led, and how it grew from there.
                Include specific examples of problems he identified and solutions he delivered.]
              </p>
              <p>
                [Placeholder: Final paragraph about why Fred is running for Bogeka Ward MCA
                now — what he believes the ward still needs, what he is uniquely positioned
                to deliver, and his personal commitment to every resident of Bogeka.]
              </p>
            </div>

            {/* Quick facts band */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
              {[
                { label: 'Ward', value: 'Bogeka' },
                { label: 'Position', value: 'Ward MCA' },
                { label: 'Email', value: 'fmarungu2011@gmail.com' },
                { label: 'Phone', value: '+254 719 562 294' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-neutral-bg rounded-xl p-4 text-center">
                  <p className="text-xs text-neutral-muted uppercase tracking-wide mb-1">{label}</p>
                  <p className="font-heading font-semibold text-primary text-sm leading-snug">{value}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Career / Life Timeline ───────────────────────────── */}
      <section className="bg-neutral-bg py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                The Journey
              </span>
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-3">
              From Bogeka to the Ballot
            </h2>
            <p className="text-neutral-muted leading-relaxed">
              A timeline of the experiences, milestones, and moments that shaped
              Fred Maisiba Marungu into the leader Bogeka Ward needs.
            </p>
          </div>

          {/* Vertical timeline */}
          <div className="relative max-w-4xl mx-auto">

            {/* Centre line — desktop */}
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-neutral-border" />

            {/* Left line — mobile */}
            <div className="lg:hidden absolute left-2 top-0 bottom-0 w-0.5 bg-neutral-border" />

            {timeline.map((item, i) => (
              <TimelineItem key={i} {...item} index={i} />
            ))}

          </div>
        </div>
      </section>

      {/* ── Core Values ─────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                What He Stands For
              </span>
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-3">
              Core Values &amp; Principles
            </h2>
            <p className="text-neutral-muted leading-relaxed">
              These six values are not campaign slogans — they are the principles
              Fred Maisiba lives and leads by, every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, i) => (
              <ValueCard key={value.title} {...value} index={i} />
            ))}
          </div>

        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-primary-dark py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h2 className="font-heading font-bold text-white text-2xl lg:text-3xl mb-4">
            Ready to Support Fred Maisiba?
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Join the Chinsiaga movement and help build a stronger Bogeka Ward —
            one project, one community, one vote at a time.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/volunteer"
              className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white font-heading font-semibold text-sm rounded-full shadow-glow hover:bg-accent-dark transition-colors duration-200"
            >
              Volunteer Now <ArrowRight size={16} />
            </Link>
            <Link
              to="/manifesto"
              className="inline-flex items-center gap-2 px-7 py-3 border-2 border-white/40 text-white font-heading font-semibold text-sm rounded-full hover:bg-white hover:text-primary transition-all duration-200"
            >
              Read the Manifesto
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}