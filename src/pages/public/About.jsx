// src/pages/public/About.jsx

import { Link } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'

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

export default function About() {
  const [bioRef, bioVisible] = useReveal()
  const [compRef, compVisible] = useReveal()
  const [philRef, philVisible] = useReveal()
  const [visRef, visVisible] = useReveal()

  return (
    <div>

      {/* ── Hero ─────────────────────────────────────────────── */}
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
              <p className="text-white/75 text-lg leading-relaxed max-w-lg">
                Experienced. Educated. Results-Oriented. Community-Focused.
                Candidate for Bogeka Ward MCA.
              </p>
            </div>

            {/* Right — photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-white/10 transform rotate-3" />
                <div className="relative w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] rounded-3xl overflow-hidden border-4 border-white/20 shadow-float">
                  <img
                    src="https://res.cloudinary.com/dhkkunuyp/image/upload/v1783005786/696857342_10227010253996865_1671340349094157195_n_qipg0h.jpg"
                    alt="Fred Maisiba Marungu — Candidate for Bogeka Ward MCA"
                    className="w-full h-full object-cover object-top"
                  />
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

      {/* ── 1. Biography ─────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div
            ref={bioRef}
            className={`max-w-3xl mx-auto transition-all duration-700 ${bioVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                Leadership Profile
              </span>
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-6">
              Biography
            </h2>

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
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
              {[
                { label: 'Ward',     value: 'Bogeka' },
                { label: 'Position', value: 'Ward MCA' },
                { label: 'Phone',    value: '+254 719 562 294' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-neutral-bg rounded-xl p-4 text-center">
                  <p className="text-xs text-neutral-muted uppercase tracking-wide mb-1">{label}</p>
                  <p className="font-heading font-semibold text-primary text-sm leading-snug">{value}</p>
                </div>
              ))}
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

      {/* ── 2. Leadership Competencies ───────────────────────── */}
      <section className="bg-neutral-bg py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div
            ref={compRef}
            className={`max-w-3xl mx-auto transition-all duration-700 ${compVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                Skills &amp; Expertise
              </span>
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-6">
              Leadership Competencies
            </h2>
            <p className="text-neutral-muted leading-relaxed mb-8">
              A decade of professional experience has built a broad and directly applicable
              set of competencies for effective grassroots leadership in Bogeka Ward.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                'Strategic Planning',
                'Project Management',
                'People Leadership',
                'Data Analysis',
                'Financial & Operations Management',
                'Agriculture',
                'Performance Management',
                'Community Engagement',
                'Problem Solving',
                'Accountability',
              ].map(skill => (
                <span
                  key={skill}
                  className="bg-white text-secondary text-sm font-heading font-semibold px-4 py-2 rounded-full border border-secondary/20 shadow-card hover:bg-secondary hover:text-white transition-colors duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Leadership Philosophy ─────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div
            ref={philRef}
            className={`max-w-3xl mx-auto transition-all duration-700 ${philVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                His Approach
              </span>
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-8">
              Leadership Philosophy
            </h2>

            {/* Pull quote */}
            <div className="bg-secondary rounded-2xl p-8 mb-8 relative overflow-hidden">
              <div className="absolute top-4 left-6 text-white/10 font-heading font-bold text-[120px] leading-none select-none">&ldquo;</div>
              <p className="relative z-10 font-heading font-bold text-xl lg:text-2xl text-white leading-snug">
                Leadership should translate plans into measurable improvements in people&apos;s lives.
              </p>
              <p className="relative z-10 text-white/60 text-sm mt-4 font-medium">
                — Hon. Fred Maisiba Marungu
              </p>
            </div>

            <div className="space-y-4 text-neutral-muted leading-relaxed">
              <p>
                Marungu's professional experience is grounded in planning, execution,
                accountability, and service — with an emphasis on identifying challenges,
                mobilising people, using data to make informed decisions, and delivering
                measurable results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Vision for Public Service ─────────────────────── */}
      <section className="bg-neutral-bg py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div
            ref={visRef}
            className={`max-w-3xl mx-auto transition-all duration-700 ${visVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                Why He's Running
              </span>
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-6">
              Vision for Public Service
            </h2>
            <div className="space-y-4 text-neutral-muted leading-relaxed">
              <p>
                The experience gained through years of working with communities, farmers,
                teams, and development programs provides a foundation for a leadership
                approach centred on inclusive development, accountable use of resources,
                stronger livelihoods, better services, youth opportunities, and practical
                community-driven solutions.
              </p>
              <p>
                Fred Maisiba brings to Bogeka Ward a leadership style built on evidence,
                not rhetoric — one that listens to residents, plans carefully, executes
                with discipline, and reports back openly on results. Under the banner of
                <em> "Chinsiaga — Together We Move Forward"</em>, the vision is simple:
                development that reaches every household in Bogeka Ward.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/vision-mission"
                className="inline-flex items-center gap-2 px-7 py-3 bg-secondary text-white font-heading font-semibold text-sm rounded-full hover:bg-secondary-dark transition-colors shadow-md"
              >
                Read the Full Vision <ArrowRight size={15} />
              </Link>
              <Link
                to="/volunteer"
                className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white font-heading font-semibold text-sm rounded-full hover:bg-accent-dark transition-colors shadow-glow"
              >
                Join Our Movement <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}