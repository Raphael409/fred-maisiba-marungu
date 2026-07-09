// src/components/public/Header.jsx
// Dual-bar header:
//   Bar 1 — thin dark info bar (office hours, location, social links)
//   Bar 2 — white main nav (logo, nav links, phone, CTA buttons)
// On scroll: both bars stay visible but bar 2 gains a shadow.
// On mobile: top bar collapses, hamburger controls the nav.

import {
  ChevronDown,
  Clock,
  Facebook,
  Instagram,
  MapPin,
  Menu,
  Phone,
  Twitter,
  X,
  Youtube,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'News & Events', to: '/news' },
  { label: 'Gallery', to: '/gallery' },
  {
    label: 'Vision',
    children: [
      { label: 'Vision & Mission', to: '/vision-mission' },
      { label: 'Manifesto', to: '/manifesto' },
    ],
  },
  { label: 'Contact', to: '/contact' },
]

const socials = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    <div className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-float' : ''}`}>

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

      {/* ── MAIN NAV BAR — floating pill ─────────────────────────── */}
      {/* Wrapper centers the pill and gives it horizontal breathing room */}
      <div className="px-4 lg:px-8 py-2">
        <div
          className={`
            mx-auto w-full max-w-[90%]
            rounded-3xl
            transition-all duration-300
            ${scrolled
              ? 'bg-secondary/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(22,25,26,0.35)] border border-white/10'
              : 'bg-secondary/85 backdrop-blur-lg shadow-[0_4px_20px_rgba(22,25,26,0.25)] border border-white/10'
            }
          `}
        >
          <div className="flex items-center justify-between h-14 lg:h-16 px-5 lg:px-7 gap-6">

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
                            `flex items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-100 ${isActive
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
                      `px-3 py-2 font-heading font-medium text-sm rounded-lg transition-colors duration-150 ${isActive
                        ? 'text-white bg-white/15 font-semibold'
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
                Get Involved
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

      {/* ── MOBILE MENU — drops below the pill ───────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden px-4 pb-3">
          <div className="mx-auto w-full max-w-[80%] bg-secondary/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-float overflow-hidden">
            <div className="px-4 py-3 space-y-0.5 max-h-[70vh] overflow-y-auto">

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
                        className={`text-white/50 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''
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
                              `flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive
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
                      `block px-3 py-2.5 font-heading font-medium text-sm rounded-lg transition-colors ${isActive
                        ? 'text-white bg-white/15 font-semibold'
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

                <div className="flex items-center gap-2 px-3">
                  <MapPin size={13} className="text-accent flex-shrink-0" />
                  <p className="text-xs text-white/70">Bogeka Ward, Kenya</p>
                </div>

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
                  Get Involved
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}