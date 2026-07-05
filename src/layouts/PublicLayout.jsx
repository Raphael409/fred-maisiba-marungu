// src/layouts/PublicLayout.jsx
// Header is position:fixed (dual bar — info bar + nav bar).
// Total header height: ~108px desktop, ~64px mobile.
// <main> has matching top padding so content clears the header.

import AIChatWidget from '@/components/public/AIChatWidget'
import Footer from '@/components/public/Footer'
import Header from '@/components/public/Header'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      {/* pt clears fixed header: 64px mobile, 108px desktop */}
      <main className="flex-1 pt-16 lg:pt-[108px]">
        <Outlet />
      </main>
      <Footer />
      {/* AI assistant — floats bottom-right on every public page */}
      <AIChatWidget />
    </div>
  )
}