// src/pages/public/About.jsx

import { Link } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import {
  ArrowRight, Shield, Heart, Lightbulb,
  Users, Star, CheckCircle,
} from 'lucide-react'

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
    icon: Users,
    title: 'Inclusion',
    description: 'Every village, every family, every voice matters. Fred\'s development agenda leaves no corner of Bogeka Ward behind.',
  },
  {
    icon: CheckCircle,
    title: 'Accountability',
    description: 'Promises made are promises kept. Fred tracks every commitment and reports back openly to the community on progress and results.',
  },
  {
    icon: Heart,
    title: 'Service',
    description: 'Public office is not a privilege — it is a duty. Fred is committed to people-centred leadership that puts residents first.',
  },
  {
    icon: Star,
    title: 'Sustainable Development',
    description: 'Development that lasts — projects planned for long-term impact, not short-term gain, benefiting current and future generations of Bogeka Ward.',
  },
]

// ─── Value card ─────────────────────────────────────────────────────────────
function ValueCard({ icon: Icon, title, description, index }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${index * 80}ms` : '0ms' }}
      className={`group bg-white rounded-2xl p-7 border border-neutral-border shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1.5 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
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

            {/* Leadership competencies */}
            <div className="mb-6">
              <p className="text-xs font-heading font-bold uppercase tracking-widest text-accent mb-3">
                Leadership Competencies
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Strategic Planning','Project Management','People Leadership',
                  'Data Analysis','Financial & Operations Management','Agriculture',
                  'Performance Management','Community Engagement',
                  'Problem Solving','Accountability',
                ].map(skill => (
                  <span key={skill} className="bg-secondary/8 text-secondary text-xs font-heading font-semibold px-3 py-1.5 rounded-full border border-secondary/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Short biography — exact from manifesto */}
            <div className="space-y-4 text-neutral-muted leading-relaxed">
              <p>
                Hon. Fredrick Marungu is a Master's holder from UoN in Project Planning and
                Management and a professional, experienced field operations leader. A Project
                Specialist with experience in project execution, team leadership, data-driven
                performance management, agriculture, financial inclusion, and community-focused
                programs.
              </p>
              <p>
                His professional journey has involved managing teams, developing local programs,
                improving service delivery, supporting smallholder farmers, and turning around
                underperforming operations — experience that provides a strong foundation for
                effective grassroots leadership.
              </p>
              <blockquote className="border-l-4 border-accent pl-4 italic text-neutral-dark font-medium">
                "Leadership should translate plans into measurable improvements in people's lives."
              </blockquote>
            </div>

            {/* Quick facts band */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
              {[
                { label: 'Ward', value: 'Bogeka' },
                { label: 'Position', value: 'Ward MCA' },
                { label: 'Phone', value: '+254 719 562 294' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-neutral-bg rounded-xl p-4 text-center">
                  <p className="text-xs text-neutral-muted uppercase tracking-wide mb-1">{label}</p>
                  <p className="font-heading font-semibold text-primary text-sm leading-snug">{value}</p>
                </div>
              ))}
              {/* Email — full width row so long address doesn't overflow */}
              <div className="col-span-2 sm:col-span-1 bg-neutral-bg rounded-xl p-4 text-center">
                <p className="text-xs text-neutral-muted uppercase tracking-wide mb-1">Email</p>
                <a
                  href="mailto:fmarungu2011@gmail.com"
                  className="font-heading font-semibold text-accent text-xs leading-snug hover:text-accent-dark transition-colors break-all"
                >
                  fmarungu2011@gmail.com
                </a>
              </div>
            </div>

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
              These five principles — drawn directly from the Bogeka Ward Development Manifesto — are the foundation of Fred Maisiba's leadership approach.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
              Join Our Movement <ArrowRight size={16} />
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