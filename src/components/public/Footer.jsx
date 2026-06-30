// src/components/public/Footer.jsx

import { Facebook, Instagram, MessageCircle, Twitter, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About the Candidate', to: '/about' },
  { label: 'Vision & Mission', to: '/vision-mission' },
  { label: 'Manifesto', to: '/manifesto' },
  { label: 'Community Projects', to: '/projects' },
]

const involvedLinks = [
  { label: 'Volunteer Registration', to: '/volunteer' },
  { label: 'Contact & Support', to: '/contact' },
  { label: 'Projects Gallery', to: '/gallery' },
  { label: 'News & Events', to: '/news' },
]

const socials = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'X/Twitter', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: MessageCircle, label: 'WhatsApp', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-neutral-bg-dark text-neutral-on-dark-muted">

      {/* Main footer grid */}
      <div className="container mx-auto px-4 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 font-heading font-bold text-lg text-neutral-on-dark mb-3">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-sm">
              F
            </div>
            <span>Chinsiaga</span>
          </div>
          <p className="text-sm leading-relaxed mb-5">
            Together, let's make Bogeka great
          </p>
          <div className="flex gap-2">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full bg-neutral-border/20 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors duration-150"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-heading font-semibold text-neutral-on-dark mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {quickLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm hover:text-secondary transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get Involved */}
        <div>
          <h3 className="font-heading font-semibold text-neutral-on-dark mb-4">
            Get Involved
          </h3>
          <ul className="space-y-2">
            {involvedLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm hover:text-secondary transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-heading font-semibold text-neutral-on-dark mb-4">
            Contact
          </h3>
          <address className="not-italic text-sm space-y-2">
            <p>Bogeka<br />Kisii County, Kitutu-Chache South</p>
            <p>
              <a href="tel:+0000000000" className="hover:text-secondary transition-colors">
                +254 719 562 294
              </a>
            </p>
            <p>
              <a href="mailto:info@campaign.org" className="hover:text-secondary transition-colors">
                info@campaign.org
              </a>
            </p>
          </address>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>&copy; {new Date().getFullYear()} Fredrick Maisiba Marungu. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-secondary transition-colors">Terms of Use</a>
          </div>
          <p>Developed By Rapahel Mbuya</p>
        </div>
      </div>
    </footer>
  )
}
