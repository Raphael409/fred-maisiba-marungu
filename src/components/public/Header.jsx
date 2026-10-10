// src/components/public/Header.jsx
// Dual-bar header:
//   Bar 1 — thin dark info bar (office hours, location, social links)
//   Bar 2 — white main nav (logo, nav links, phone, CTA buttons)
// On scroll: both bars stay visible but bar 2 gains a shadow.
// On mobile: top bar collapses, hamburger controls the nav.

import { useState, useEffect } from 'react'
import { Link, NavLink }       from 'react-router-dom'
import {
  Clock, MapPin, Phone,
  Facebook, Youtube, Menu, X, ChevronDown,
} from 'lucide-react'

// TikTok icon (not in lucide — using SVG inline)
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

const navItems = [
  { label: 'Home',          to: '/',               end: true },
  { label: 'About',         to: '/about' },
  { label: 'Projects',      to: '/projects' },
  { label: 'News & Events', to: '/news' },
  { label: 'Gallery',       to: '/gallery' },
  {
    label: 'Vision',
    children: [
      { label: 'Vision & Mission', to: '/vision-mission' },
      { label: 'Manifesto',        to: '/manifesto' },
    ],
  },
  { label: 'Contact',       to: '/contact' },
]

const socials = [
  { icon: Facebook,     href: 'https://www.facebook.com/mca.bogeka.marungu', label: 'Facebook' },
  { icon: WhatsAppIcon, href: 'https://wa.me/254719562294',                   label: 'WhatsApp' },
  { icon: Youtube,      href: 'https://www.youtube.com/@fredrickmarungu1340', label: 'YouTube'  },
  { icon: TikTokIcon,   href: 'https://www.tiktok.com/@fredhenry91',          label: 'TikTok'   },
]

export default function Header() {
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [scrolled,     setScrolled]     = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
      // Close mobile menu on scroll
      if (mobileOpen) setMobileOpen(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mobileOpen])

  // Close mobile menu when clicking outside the header
  useEffect(() => {
    if (!mobileOpen) return
    function handleClickOutside(e) {
      if (!e.target.closest('header')) {
        setMobileOpen(false)
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [mobileOpen])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false)
        setOpenDropdown(null)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  function toggleDropdown(label) {
    setOpenDropdown(prev => prev === label ? null : label)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-float' : ''}`}>

      {/* ── TOP INFO BAR ─────────────────────────────────────────── */}
      <div className="hidden md:block bg-white border-b border-neutral-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-9">

            {/* Left — office hours */}
            <div className="flex items-center gap-1.5 text-neutral-muted text-xs">
              <Clock size={12} className="text-accent" />
              <span>Campaign Office:</span>
              <span className="text-neutral-dark font-medium">Mon – Fri, 8am – 6pm</span>
            </div>

            {/* Center — phone number */}
            <div className="flex items-center gap-1.5 text-neutral-muted text-xs">
              <Phone size={12} className="text-accent" />
              <span>Call Anytime:</span>
              <a
                href="tel:+254719562294"
                className="text-neutral-dark font-medium hover:text-accent transition-colors"
              >
                +254 719 562 294
              </a>
            </div>

            {/* Right — social icons */}
            <div className="flex items-center gap-3">
              <span className="text-neutral-muted text-xs uppercase tracking-wider font-medium">
                Follow Us:
              </span>
              <div className="flex items-center gap-2">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 rounded flex items-center justify-center text-neutral-muted hover:text-white hover:bg-accent transition-colors duration-150"
                  >
                    <Icon size={13} />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── MAIN NAV BAR — full width ─────────────────────────── */}
      <div className="bg-secondary shadow-md">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16 gap-6">

            {/* Logo — always shows name text on all screen sizes */}
            <Link
              to="/"
              className="flex items-center gap-2.5 flex-shrink-0"
            >
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-secondary font-heading font-bold text-xs">FM</span>
              </div>
              {/* Show name on ALL screen sizes including mobile */}
              <div>
                <p className="font-heading font-bold text-white text-sm leading-tight">
                  Fred Maisiba
                </p>
                <p className="text-[9px] text-white/60 font-medium uppercase tracking-wide leading-tight hidden sm:block">
                  Bogeka Ward MCA
                </p>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav
              className="hidden lg:flex items-center gap-0.5 flex-1 justify-center"
              aria-label="Primary navigation"
            >
              {navItems.map(item =>
                item.children ? (
                  <div key={item.label} className="relative group">
                    <button
                      className="flex items-center gap-1 px-3 py-2 font-heading font-medium text-sm text-white/85 hover:text-white transition-colors duration-150 rounded-lg hover:bg-white/10"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {item.label}
                      <ChevronDown
                        size={13}
                        className="text-white/50 group-hover:rotate-180 transition-transform duration-200"
                      />
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-float border border-neutral-border py-1.5 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                      {item.children.map(child => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-100 ${
                              isActive
                                ? 'text-secondary font-semibold bg-neutral-bg'
                                : 'text-neutral-dark hover:bg-neutral-bg hover:text-secondary'
                            }`
                          }
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `px-3 py-2 font-heading font-medium text-sm rounded-lg transition-colors duration-150 ${
                        isActive
                          ? 'text-white bg-accent font-semibold shadow-sm'
                          : 'text-white/85 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )
              )}
            </nav>

            {/* Right — CTA + hamburger */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                to="/volunteer"
                className="hidden lg:inline-flex px-5 py-2 bg-accent text-white font-heading font-semibold text-sm rounded-full hover:bg-accent-dark transition-colors duration-200 shadow-glow"
              >
                Join Our Movement
              </Link>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileOpen(v => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ──────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-secondary border-t border-white/10 shadow-float overflow-y-auto max-h-[calc(100vh-100px)]">
          <div className="container mx-auto px-4 py-3 space-y-0.5">

              {navItems.map(item =>
                item.children ? (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="flex items-center justify-between w-full px-3 py-2.5 font-heading font-medium text-sm text-white/90 hover:bg-white/10 rounded-lg transition-colors"
                      aria-expanded={openDropdown === item.label}
                    >
                      {item.label}
                      <ChevronDown
                        size={15}
                        className={`text-white/50 transition-transform duration-200 ${
                          openDropdown === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="ml-4 pl-3 border-l-2 border-white/20 space-y-0.5 mt-0.5 mb-1">
                        {item.children.map(child => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                                isActive
                                  ? 'text-white font-semibold bg-white/15'
                                  : 'text-white/70 hover:text-white hover:bg-white/10'
                              }`
                            }
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-accent/80 flex-shrink-0" />
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2.5 font-heading font-medium text-sm rounded-lg transition-colors ${
                        isActive
                          ? 'text-white bg-accent font-semibold'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )
              )}

              {/* Mobile contact info */}
              <div className="pt-3 mt-1 border-t border-white/10 space-y-2.5">
                <a
                  href="tel:+254719562294"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10"
                >
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Phone size={13} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-[9px] text-white/60 uppercase tracking-wide">Call Anytime</p>
                    <p className="text-sm font-heading font-bold text-white">+254 719 562 294</p>
                  </div>
                </a>

                <a
                  href="https://maps.app.goo.gl/YyPHX8v6k5jDSPHs8?g_st=awb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 hover:text-white transition-colors group"
                >
                  <MapPin size={13} className="text-accent flex-shrink-0" />
                  <p className="text-xs text-white/70 group-hover:text-white transition-colors">Bogeka Ward, Kenya</p>
                </a>

                <div className="flex items-center gap-3 px-3">
                  <span className="text-xs text-white/60">Follow Us:</span>
                  {socials.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-7 h-7 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                    >
                      <Icon size={13} />
                    </a>
                  ))}
                </div>

                <Link
                  to="/volunteer"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-4 py-2.5 bg-accent text-white font-heading font-semibold text-sm rounded-full hover:bg-accent-dark transition-colors shadow-glow"
                >
                  Join Our Movement
                </Link>
              </div>

            </div>
          </div>
      )}

    </header>
  )
}