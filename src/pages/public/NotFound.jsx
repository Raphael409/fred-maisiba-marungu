// src/pages/public/NotFound.jsx

import { ArrowLeft, FolderKanban, Home, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-neutral-bg px-4">
      <div className="text-center max-w-lg">

        {/* Big 404 */}
        <div className="relative mb-6">
          <p className="font-heading font-bold text-[120px] lg:text-[160px] leading-none text-neutral-border select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center shadow-float">
              <span className="font-heading font-bold text-white text-2xl">FM</span>
            </div>
          </div>
        </div>

        <h1 className="font-heading font-bold text-2xl lg:text-3xl text-primary mb-3">
          Page Not Found
        </h1>
        <p className="text-neutral-muted leading-relaxed mb-8">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Home', to: '/', icon: Home },
            { label: 'Projects', to: '/projects', icon: FolderKanban },
            { label: 'Contact', to: '/contact', icon: Phone },
          ].map(({ label, to, icon: Icon }) => (
            <Link key={to} to={to}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-neutral-border rounded-xl text-sm font-heading font-semibold text-neutral-dark hover:border-secondary hover:text-secondary transition-colors shadow-card">
              <Icon size={15} />{label}
            </Link>
          ))}
        </div>

        <Link to="/" className="inline-flex items-center gap-2 text-accent font-semibold hover:text-accent-dark transition-colors text-sm">
          <ArrowLeft size={15} /> Back to Homepage
        </Link>
      </div>
    </div>
  )
}