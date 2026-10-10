// src/components/public/Footer.jsx

import { Link } from 'react-router-dom'
import { addDocument, getDocuments, where } from '@/firebase/firestore'
import toast from 'react-hot-toast'
import { useState } from 'react'
import {
  Facebook, Youtube,
  Mail, Phone, MapPin, ArrowRight, Send,
} from 'lucide-react'

const quickLinks = [
  { label: 'Home',                to: '/' },
  { label: 'About Fred Maisiba', to: '/about' },
  { label: 'Vision & Mission',   to: '/vision-mission' },
  { label: 'Manifesto',          to: '/manifesto' },
  { label: 'Community Projects', to: '/projects' },
  { label: 'Gallery',            to: '/gallery' },
]

const involvedLinks = [
  { label: 'Membership Registration', to: '/volunteer' },
  { label: 'Contact & Support',      to: '/contact' },
  { label: 'News & Events',          to: '/news' },
]

// TikTok icon
function TikTokIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  )
}

// WhatsApp icon
function WhatsAppIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  )
}

const socials = [
  { icon: Facebook,     href: 'https://www.facebook.com/mca.bogeka.marungu', label: 'Facebook' },
  { icon: WhatsAppIcon, href: 'https://wa.me/254719562294',                   label: 'WhatsApp' },
  { icon: Youtube,      href: 'https://www.youtube.com/@fredrickmarungu1340', label: 'YouTube'  },
  { icon: TikTokIcon,   href: 'https://www.tiktok.com/@fredhenry91',          label: 'TikTok'   },
]

export default function Footer() {
  const [email,      setEmail]      = useState('')
  const [subDone,    setSubDone]    = useState(false)
  const [subLoading, setSubLoading] = useState(false)
  const [subError,   setSubError]   = useState('')

  async function handleSubscribe(e) {
    e.preventDefault()
    setSubError('')

    const clean = email.trim().toLowerCase()

    // Format check
    if (!clean) {
      setSubError('Please enter your email address.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setSubError('Please enter a valid email address.')
      return
    }

    setSubLoading(true)
    try {
      // Duplicate check
      const existing = await getDocuments('newsletterSubscribers', [
        where('email', '==', clean)
      ])
      if (existing.length > 0) {
        setSubError('This email is already subscribed.')
        setSubLoading(false)
        return
      }

      // Save to Firestore
      await addDocument('newsletterSubscribers', {
        email:        clean,
        subscribedAt: new Date(),
      })
      setSubDone(true)
      setEmail('')
      toast.success('Subscribed! Thank you.')
    } catch (err) {
      console.error('Newsletter subscribe error:', err?.code, err?.message)
      setSubError('Failed to subscribe. Please try again.')
    } finally {
      setSubLoading(false)
    }
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

          {/* Col 3 — Join Our Movement + Contact */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm mb-5 uppercase tracking-wider">
              Join Our Movement
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
                href="mailto:fmarungu2011@gmail.com"
                className="flex items-center gap-2 text-sm hover:text-accent transition-colors"
              >
                <Mail size={13} className="text-accent flex-shrink-0" />
                fmarungu2011@gmail.com
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
                ✓ You're subscribed! Thank you for joining.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setSubError('') }}
                    placeholder="Your email address"
                    disabled={subLoading}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border text-neutral-dark placeholder-neutral-muted text-sm focus:outline-none focus:ring-2 transition-colors disabled:opacity-60 ${
                      subError
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                        : 'border-white/20 focus:border-accent focus:ring-accent/20'
                    }`}
                  />
                </div>

                {/* Inline error */}
                {subError && (
                  <p className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
                    <span>✕</span> {subError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={subLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-white font-heading font-semibold text-sm rounded-xl hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {subLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Subscribe
                    </>
                  )}
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
            Designed &amp; built by{' '}
            <a
              href="https://raphaelmbuya.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-light transition-colors font-medium"
            >
              Raphael Mbuya
            </a>
          </p>
        </div>
      </div>

    </footer>
  )
}