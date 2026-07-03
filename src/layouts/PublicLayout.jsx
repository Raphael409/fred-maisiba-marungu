// src/layouts/PublicLayout.jsx
// Header is position:fixed (dual bar — info bar + nav bar).
// Total header height: ~108px desktop, ~64px mobile.
// <main> has matching top padding so content clears the header.

import AIChatWidget from '@/components/public/AIChatWidget'
import Footer from '@/components/public/Footer'
import Header from '@/components/public/Header'
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
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