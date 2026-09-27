// src/pages/public/VisionMission.jsx

import { Link }              from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import {
  ArrowRight, Target, Eye, GraduationCap, Stethoscope,
  Heart, HardHat, Sprout, Wifi, CheckCircle, Star,
} from 'lucide-react'

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useReveal(delay = 0) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

// ─── Strategic pillars ────────────────────────────────────────────────────────
const pillars = [
  {
    icon:      Sprout,
    title:     'Agriculture & Economic Empowerment',
    shortTerm: 'Support community farmers with high ROI "Kilimo Biashara" ventures',
    midTerm:   'Promote value addition and aggregation to improve farmers\' incomes',
    longTerm:  'Encourage youth and women to participate in agriculture as a business enterprise',
  },
  {
    icon:      GraduationCap,
    title:     'Education & Skills Development',
    shortTerm: 'Strengthen access to education and support deserving and marginalized learners',
    midTerm:   'Promote seamless vocational and technical skills for young people',
    longTerm:  'Support talent development and entrepreneurship as pathways to youth employment',
  },
  {
    icon:      Stethoscope,
    title:     'Healthcare & Social Welfare',
    shortTerm: 'Advocate for accessible and quality healthcare services',
    midTerm:   'Support initiatives addressing maternal and child health',
    longTerm:  'Strengthen community awareness on preventive social healthcare protection',
  },
  {
    icon:      HardHat,
    title:     'Roads, Water & Infrastructure',
    shortTerm: 'Prioritize improvement and maintenance of local roads',
    midTerm:   'Advocate for reliable access to clean and safe piped water',
    longTerm:  'Promote appropriate lighting and infrastructure that improves security and economic activity',
  },
  {
    icon:      Heart,
    title:     'Youth & Women Empowerment',
    shortTerm: 'Expand opportunities for youth entrepreneurship and skills development',
    midTerm:   'Support women-led enterprises and community initiatives',
    longTerm:  'Encourage inclusive participation in local development programs',
  },
  {
    icon:      Wifi,
    title:     'Accountable & Participatory Leadership',
    shortTerm: 'Promote transparency in development planning and implementation',
    midTerm:   'Maintain regular community consultations and feedback forums',
    longTerm:  'Track development projects and communicate progress openly to residents',
  },
]

// ─── PillarCard ───────────────────────────────────────────────────────────────
function PillarCard({ icon: Icon, title, shortTerm, midTerm, longTerm, index }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 80}ms` }}
      className={`bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-neutral-border overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Card header */}
      <div className="bg-secondary px-6 py-5 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
          <Icon size={22} className="text-white" />
        </div>
        <h3 className="font-heading font-bold text-lg text-white">{title}</h3>
      </div>

      {/* Timeline goals */}
      <div className="p-6 space-y-4">
        {[
          { label: 'First 100 Days', text: shortTerm, color: 'bg-accent' },
          { label: 'Year 1',         text: midTerm,   color: 'bg-secondary' },
          { label: 'Full Term',      text: longTerm,  color: 'bg-primary' },
        ].map(({ label, text, color }) => (
          <div key={label} className="flex gap-3">
            <div className="flex flex-col items-center flex-shrink-0 mt-1">
              <div className={`w-2.5 h-2.5 rounded-full ${color} flex-shrink-0`} />
              <div className="w-0.5 flex-1 bg-neutral-border mt-1" />
            </div>
            <div className="pb-2">
              <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-neutral-muted mb-0.5">
                {label}
              </p>
              <p className="text-sm text-neutral-dark leading-relaxed">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function VisionMission() {
  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-primary-dark pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '36px 36px' }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Star size={12} className="text-accent" />
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-white/90">
              Our Direction
            </span>
          </div>
          <h1 className="font-heading font-bold text-3xl lg:text-5xl text-white mb-4">
            Vision &amp; Mission
          </h1>
          <p className="font-accent italic text-xl text-white/80 mb-6">
            &ldquo;Chinsiaga&rdquo; — Together We Move Forward
          </p>
          <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
            A clear direction for Bogeka Ward, grounded in real community
            needs and backed by a proven track record of delivery.
          </p>
        </div>
      </section>

      {/* ── Vision Statement ──────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

              {/* Vision */}
              <div className="group bg-neutral-bg rounded-3xl p-8 border border-neutral-border hover:border-secondary hover:shadow-card transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-5">
                  <Eye size={26} className="text-white" />
                </div>
                <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-3 py-1 mb-3">
                  <span className="text-xs font-heading font-bold uppercase tracking-widest text-secondary">
                    Our Vision
                  </span>
                </div>
                <h2 className="font-heading font-bold text-xl text-primary mb-4 leading-snug">
                  A united, prosperous, and empowered Bogeka Ward where every household has access to opportunity, essential services, and sustainable economic growth.
                </h2>
                <p className="text-sm text-neutral-muted leading-relaxed">
                  Bogeka Ward has the people, the land, and the potential to thrive. Fred Maisiba's
                  vision is a ward where farmers earn dignified incomes, young people have real
                  pathways to employment, mothers access quality healthcare close to home, and every
                  village — no matter how remote — benefits from improved roads, clean water, and
                  accountable leadership. By the end of his first term, every household in Bogeka
                  Ward should feel the difference.
                </p>
              </div>

              {/* Mission */}
              <div className="group bg-neutral-bg rounded-3xl p-8 border border-neutral-border hover:border-accent hover:shadow-card transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-5">
                  <Target size={26} className="text-white" />
                </div>
                <div className="inline-flex items-center gap-2 bg-accent/8 rounded-full px-3 py-1 mb-3">
                  <span className="text-xs font-heading font-bold uppercase tracking-widest text-accent-dark">
                    Our Mission
                  </span>
                </div>
                <h2 className="font-heading font-bold text-xl text-primary mb-4 leading-snug">
                  To promote transparent, inclusive and people-centered development by prioritizing the needs of residents, strengthening local livelihoods, and ensuring that public resources are used responsibly for the benefit of the entire community.
                </h2>
                <p className="text-sm text-neutral-muted leading-relaxed">
                  Fred will work closely with the County Government, development partners, community
                  groups, and residents themselves to plan, fund, and implement projects. Regular
                  community consultations, open progress tracking, and transparent reporting will
                  ensure that every shilling of public resources is accounted for and that
                  development priorities reflect the needs of all villages and groups within
                  Bogeka Ward — leaving no one behind.
                </p>
              </div>

            </div>

            {/* Pull quote */}
            <div className="mt-10 bg-secondary rounded-3xl p-8 text-center">
              <p className="font-accent italic text-xl lg:text-2xl text-white leading-relaxed mb-4">
                &ldquo;Before I ask for your vote, I want you to see what I have already built.
                The future of Bogeka will be decided by what we do together — Chinsiaga.&rdquo;
              </p>
              <p className="font-heading font-semibold text-white/70 text-sm">
                — Fred Maisiba Marungu, Candidate for Bogeka Ward MCA
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Strategic Goals Timeline ───────────────────────────── */}
      <section className="bg-neutral-bg py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                The Plan
              </span>
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-3">
              Strategic Priorities &amp; Goals
            </h2>
            <p className="text-neutral-muted leading-relaxed">
              Six priority areas with clear, time-bound commitments across
              the first 100 days, Year 1, and the full term.
            </p>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-5 flex-wrap">
              {[
                { color: 'bg-accent',    label: 'First 100 Days' },
                { color: 'bg-secondary', label: 'Year 1' },
                { color: 'bg-primary',   label: 'Full Term' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-xs font-medium text-neutral-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <PillarCard key={p.title} {...p} index={i} />
            ))}
          </div>

        </div>
      </section>

      {/* ── Commitment band ───────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-4">
              <CheckCircle size={12} className="text-accent" />
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                Our Commitment
              </span>
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-3">
              How We Will Be Held Accountable
            </h2>
            <p className="text-neutral-muted leading-relaxed max-w-xl mx-auto">
              Fred Maisiba commits to the following accountability measures
              throughout his term as Bogeka Ward MCA.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Quarterly public progress reports on all commitments',
              'Open ward barazas every three months for community feedback',
              'Public project tracking dashboard (online and physical notice boards)',
              'Annual ward development report shared with all villages',
              'Direct phone and email access to the MCA office',
              'Zero tolerance for corruption — all procurement to be transparent',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-neutral-bg rounded-xl p-4 border border-neutral-border">
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle size={14} className="text-accent" />
                </div>
                <p className="text-sm text-neutral-dark leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-secondary py-14 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-2xl lg:text-3xl text-white mb-3">
            Ready to Hold Us to This Vision?
          </h2>
          <p className="text-white/70 mb-7 max-w-xl mx-auto">
            Join the Chinsiaga movement and help make this vision a
            reality for Bogeka Ward.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/manifesto"
              className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white font-heading font-semibold text-sm rounded-full hover:bg-accent-dark transition-colors shadow-glow"
            >
              Download the Manifesto <ArrowRight size={15} />
            </Link>
            <Link
              to="/volunteer"
              className="inline-flex items-center gap-2 px-7 py-3 border-2 border-white/40 text-white font-heading font-semibold text-sm rounded-full hover:bg-white hover:text-secondary transition-colors"
            >
              Join Our Movement
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}