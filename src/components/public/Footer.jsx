// src/components/public/Footer.jsx

import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Twitter,
  Youtube,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Fred Maisiba', to: '/about' },
  { label: 'Vision & Mission', to: '/vision-mission' },
  { label: 'Manifesto', to: '/manifesto' },
  { label: 'Community Projects', to: '/projects' },
  { label: 'Gallery', to: '/gallery' },
]

const involvedLinks = [
  { label: 'Volunteer Registration', to: '/volunteer' },
  { label: 'Contact & Support', to: '/contact' },
  { label: 'News & Events', to: '/news' },
]

const socials = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: MessageCircle, href: '#', label: 'WhatsApp' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subDone, setSubDone] = useState(false)

  function handleSubscribe(e) {
    e.preventDefault()
    if (!email.trim()) return
    // TODO: wire to email service (e.g. Mailchimp, ConvertKit)
    setSubDone(true)
    setEmail('')
  }

  return (
    <footer className="bg-primary text-neutral-on-dark-muted">

      {/* ── Main footer grid ─────────────────────────────── */}
      <div className="container mx-auto px-4 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <span className="text-white font-heading font-bold text-sm">FM</span>
              </div>
              <div>
                <p className="font-heading font-bold text-white text-base leading-tight">
                  Fred Maisiba Marungu
                </p>
                <p className="text-[10px] text-neutral-on-dark-muted uppercase tracking-wide">
                  Candidate for Bogeka Ward MCA
                </p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed mb-5 max-w-xs">
              &ldquo;Chinsiaga&rdquo; — A movement built by Bogeka, for Bogeka.
              Real leadership, proven results, a brighter future.
            </p>

            {/* Socials */}
            <div className="flex gap-2 flex-wrap">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm mb-5 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm flex items-center gap-1.5 hover:text-accent transition-colors duration-150 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Get Involved + Contact */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm mb-5 uppercase tracking-wider">
              Get Involved
            </h3>
            <ul className="space-y-2.5 mb-7">
              {involvedLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm flex items-center gap-1.5 hover:text-accent transition-colors duration-150 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-heading font-semibold text-white text-sm mb-4 uppercase tracking-wider">
              Contact
            </h3>
            <address className="not-italic space-y-2.5">
              <a
                href="tel:+254719562294"
                className="flex items-center gap-2 text-sm hover:text-accent transition-colors"
              >
                <Phone size={13} className="text-accent flex-shrink-0" />
                +254 719 562 294
              </a>
              <a
                href="mailto:fredmaisiba@gmail.com"
                className="flex items-center gap-2 text-sm hover:text-accent transition-colors"
              >
                <Mail size={13} className="text-accent flex-shrink-0" />
                fredmaisiba@gmail.com
              </a>
              <span className="flex items-center gap-2 text-sm">
                <MapPin size={13} className="text-accent flex-shrink-0" />
                Bogeka Ward, Kenya
              </span>
            </address>
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm mb-5 uppercase tracking-wider">
              Stay Updated
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              Get campaign news, project updates, and event invitations
              delivered straight to your inbox.
            </p>

            {subDone ? (
              <div className="bg-success/10 border border-success/30 rounded-xl p-4 text-sm text-success font-medium">
                ✓ You're subscribed! Thank you.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-on-dark-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-white font-heading font-semibold text-sm rounded-xl hover:bg-accent-dark transition-colors duration-200"
                >
                  <Send size={14} />
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>
            &copy; {new Date().getFullYear()} Fred Maisiba Marungu Campaign. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Use</a>
          </div>
          <p className="text-neutral-on-dark-muted">
            Paid for by the Fred Maisiba Campaign Committee.
          </p>
        </div>
      </div>

    </footer>
  )
}