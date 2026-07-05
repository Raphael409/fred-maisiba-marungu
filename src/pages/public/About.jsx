// src/pages/public/About.jsx

import {
  ArrowRight,
  CheckCircle,
  Handshake,
  Heart,
  Lightbulb,
  Shield,
  Star, Target,
  Users,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useReveal() {
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

// ─── Core Values ─────────────────────────────────────────────────────────────
const coreValues = [
  {
    icon: Shield,
    title: 'Integrity',
    description: 'Every decision is made with honesty and transparency. The people of Bogeka deserve a leader they can trust unconditionally.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'All policy, all action, all effort starts with one question — how does this serve the people of Bogeka Ward?',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Solving old problems with new thinking — from digital transformation to modern farming techniques for Bogeka.',
  },
  {
    icon: Heart,
    title: 'Compassion',
    description: 'Leadership rooted in empathy. Fred Maisiba listens first, acts second, and never forgets who he is working for.',
  },
  {
    icon: Target,
    title: 'Accountability',
    description: 'Promises made are promises tracked. Every commitment comes with a plan, a timeline, and a public record.',
  },
  {
    icon: Handshake,
    title: 'Unity',
    description: '"Chinsiaga" — together we move forward. No village left behind, no resident overlooked in Bogeka Ward.',
  },
]

// ─── Timeline milestones ─────────────────────────────────────────────────────
const timeline = [
  {
    year: '[Year]',
    title: 'Born & Raised in Bogeka',
    description: '[Placeholder: Brief background on Fred\'s early life, upbringing, and family roots in Bogeka Ward. Replace with real content.]',
  },
  {
    year: '[Year]',
    title: 'Education & Early Career',
    description: '[Placeholder: Fred\'s educational background and early professional career. Schools attended, qualifications, and early work experience.]',
  },
  {
    year: '[Year]',
    title: 'Community Involvement Begins',
    description: '[Placeholder: When Fred first got actively involved in community work — youth groups, local initiatives, volunteer work in Bogeka Ward.]',
  },
  {
    year: '[Year]',
    title: 'First Community Projects',
    description: '[Placeholder: The first major community projects Fred initiated or led — describe the impact they had on Bogeka residents.]',
  },
  {
    year: '[Year]',
    title: 'Decision to Run for MCA',
    description: '[Placeholder: What motivated Fred to formally enter politics and run for Bogeka Ward MCA. The moment the campaign began.]',
  },
  {
    year: 'Today',
    title: 'Running for Bogeka Ward MCA',
    description: 'Fred Maisiba Marungu is now formally campaigning for Bogeka Ward MCA, carrying the "Chinsiaga" message of unity, delivery, and transparent leadership.',
  },
]

// ─── Timeline Item ────────────────────────────────────────────────────────────
function TimelineItem({ item, index }) {
  const [ref, visible] = useReveal()
  const isLeft = index % 2 === 0

  return (
    <div
      ref={ref}
      className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-0 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Left side — desktop only */}
      <div className={`hidden lg:block w-[calc(50%-32px)] ${isLeft ? 'text-right pr-10' : 'order-3 pl-10'}`}>
        {isLeft && (
          <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover p-6 border border-neutral-border transition-shadow duration-300">
            <span className="inline-block text-xs font-heading font-bold text-accent uppercase tracking-widest mb-2">
              {item.year}
            </span>
            <h3 className="font-heading font-bold text-lg text-primary mb-2">{item.title}</h3>
            <p className="text-sm text-neutral-muted leading-relaxed">{item.description}</p>
          </div>
        )}
      </div>

      {/* Center dot + line */}
      <div className="hidden lg:flex flex-col items-center w-16 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-secondary border-4 border-white shadow-card flex items-center justify-center z-10">
          <CheckCircle size={16} className="text-white" />
        </div>
      </div>

      {/* Right side — desktop only */}
      <div className={`hidden lg:block w-[calc(50%-32px)] ${!isLeft ? 'text-left pl-10' : 'order-3 pr-10'}`}>
        {!isLeft && (
          <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover p-6 border border-neutral-border transition-shadow duration-300">
            <span className="inline-block text-xs font-heading font-bold text-accent uppercase tracking-widest mb-2">
              {item.year}
            </span>
            <h3 className="font-heading font-bold text-lg text-primary mb-2">{item.title}</h3>
            <p className="text-sm text-neutral-muted leading-relaxed">{item.description}</p>
          </div>
        )}
      </div>

      {/* Mobile layout — always visible, left-aligned */}
      <div className="lg:hidden flex gap-4 w-full">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shadow-card">
            <CheckCircle size={14} className="text-white" />
          </div>
          {index < timeline.length - 1 && (
            <div className="w-0.5 flex-1 bg-neutral-border mt-2" />
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-card p-5 border border-neutral-border flex-1 mb-4">
          <span className="inline-block text-xs font-heading font-bold text-accent uppercase tracking-widest mb-1">
            {item.year}
          </span>
          <h3 className="font-heading font-bold text-base text-primary mb-1">{item.title}</h3>
          <p className="text-sm text-neutral-muted leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Value Card ───────────────────────────────────────────────────────────────
function ValueCard({ icon: Icon, title, description, index }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 80}ms` }}
      className={`group bg-neutral-bg rounded-2xl p-7 border border-neutral-border hover:border-secondary hover:shadow-card transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
    >
      <div className="w-12 h-12 rounded-xl bg-secondary group-hover:bg-accent flex items-center justify-center mb-4 transition-colors duration-300">
        <Icon size={22} className="text-white" />
      </div>
      <h3 className="font-heading font-bold text-base text-primary mb-2">{title}</h3>
      <p className="text-sm text-neutral-muted leading-relaxed">{description}</p>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function About() {
  return (
    <div>

      {/* ── Hero banner ─────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-primary-dark py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
                <Star size={12} className="text-accent" />
                <span className="text-xs font-heading font-semibold uppercase tracking-widest">
                  About the Candidate
                </span>
              </div>
              <h1 className="font-heading font-bold text-3xl lg:text-5xl mb-4 leading-tight">
                Fred Maisiba Marungu
              </h1>
              <p className="text-lg text-white/70 mb-3 font-accent italic">
                &ldquo;Chinsiaga&rdquo; — Together We Move Forward
              </p>
              <p className="text-white/70 leading-relaxed mb-8 max-w-lg">
                A son of Bogeka Ward, Fred Maisiba Marungu has dedicated
                his life to serving the community that shaped him — through
                real projects, honest leadership, and an unwavering
                commitment to every resident of Bogeka.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-heading font-semibold text-sm rounded-full hover:bg-accent-dark transition-colors shadow-glow"
                >
                  See Our Projects <ArrowRight size={15} />
                </Link>
                <Link
                  to="/vision-mission"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/40 text-white font-heading font-semibold text-sm rounded-full hover:bg-white hover:text-primary transition-colors"
                >
                  Our Vision
                </Link>
              </div>
            </div>

            {/* Right — candidate photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-3xl bg-white/5 border-2 border-white/10 scale-105" />
                <div className="w-[280px] sm:w-[320px] lg:w-[360px] aspect-[3/4] rounded-3xl overflow-hidden border-4 border-white/20 shadow-float relative z-10">
                  <img
                    src="https://res.cloudinary.com/dhkkunuyp/image/upload/v1783005786/696857342_10227010253996865_1671340349094157195_n_qipg0h.jpg"
                    alt="Fred Maisiba Marungu — Candidate for Bogeka Ward MCA"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Name tag overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent p-5">
                    <p className="font-heading font-bold text-white text-base">Fred Maisiba Marungu</p>
                    <p className="text-white/70 text-xs uppercase tracking-wide">Bogeka Ward MCA Candidate</p>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-accent rounded-2xl px-4 py-3 shadow-float z-20">
                  <p className="font-heading font-bold text-white text-sm">Bogeka</p>
                  <p className="text-white/80 text-xs">Ward MCA</p>
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
            <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-4">
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
                [Placeholder: Opening paragraph — Fred's background, where he grew up in Bogeka Ward,
                his family, and what shaped his early values. Make it personal and community-rooted.
                Replace this with the real biography.]
              </p>
              <p>
                [Placeholder: Second paragraph — Fred's education and early career. What he studied,
                where he worked, and how those experiences prepared him for community leadership.
                Be specific about qualifications and professional background.]
              </p>
              <p>
                [Placeholder: Third paragraph — Fred's community involvement before running for MCA.
                Volunteer work, local initiatives, projects he spearheaded or contributed to.
                This should connect directly to the Projects section of the site.]
              </p>
              <p>
                [Placeholder: Closing paragraph — What drove Fred to run for Bogeka Ward MCA.
                The specific needs of Bogeka he wants to address, and what makes him the right
                candidate at this moment. End with a forward-looking statement about Bogeka's future.]
              </p>
            </div>

            <div className="mt-8 p-5 bg-neutral-bg rounded-2xl border-l-4 border-accent">
              <p className="font-accent italic text-lg text-primary">
                &ldquo;Chinsiaga — together we move forward. Bogeka Ward deserves a leader
                who delivers, not just one who promises.&rdquo;
              </p>
              <p className="text-sm text-neutral-muted mt-2 font-heading font-semibold">
                — Fred Maisiba Marungu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────── */}
      <section className="bg-neutral-bg py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">

          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                The Journey
              </span>
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-3">
              Fred's Life &amp; Career Timeline
            </h2>
            <p className="text-neutral-muted">
              From Bogeka's roots to the campaign trail — a life shaped
              by community, purpose, and a commitment to delivery.
            </p>
          </div>

          {/* Timeline vertical line — desktop */}
          <div className="relative max-w-5xl mx-auto">
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-neutral-border" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <TimelineItem key={i} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ──────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">

          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                What We Stand For
              </span>
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-3">
              Core Values &amp; Philosophy
            </h2>
            <p className="text-neutral-muted">
              Six values that guide every decision Fred Maisiba makes —
              in the campaign and in office.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((v, i) => (
              <ValueCard key={v.title} {...v} index={i} />
            ))}
          </div>

        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-secondary py-14 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-2xl lg:text-3xl text-white mb-3">
            Ready to Support Fred Maisiba?
          </h2>
          <p className="text-white/70 mb-7 max-w-xl mx-auto">
            Join the Chinsiaga movement and help build a stronger Bogeka Ward.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/volunteer"
              className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white font-heading font-semibold text-sm rounded-full hover:bg-accent-dark transition-colors shadow-glow"
            >
              Join the Movement <ArrowRight size={15} />
            </Link>
            <Link
              to="/manifesto"
              className="inline-flex items-center gap-2 px-7 py-3 border-2 border-white/40 text-white font-heading font-semibold text-sm rounded-full hover:bg-white hover:text-secondary transition-colors"
            >
              Read the Manifesto
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}