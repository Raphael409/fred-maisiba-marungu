// src/routes/AppRoutes.jsx

import AdminLayout from '@/layouts/AdminLayout'
import PublicLayout from '@/layouts/PublicLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'
import { Navigate, Route, Routes } from 'react-router-dom'

// Public pages
import About from '@/pages/public/About'
import Contact from '@/pages/public/Contact'
import Gallery from '@/pages/public/Gallery'
import Home from '@/pages/public/Home'
import NewsDetail from '@/pages/public/NewsDetail'
import NewsEvents from '@/pages/public/NewsEvents'
import NotFound from '@/pages/public/NotFound'
import ProjectDetail from '@/pages/public/ProjectDetail'
import Projects from '@/pages/public/Projects'
import VisionMission from '@/pages/public/VisionMission'
import VolunteerRegistration from '@/pages/public/VolunteerRegistration'

// Admin pages
import CalendarManagement from '@/pages/admin/CalendarManagement'
import ContactMessages from '@/pages/admin/ContactMessages'
import DashboardHome from '@/pages/admin/DashboardHome'
import EventManagement from '@/pages/admin/EventManagement'
import GalleryManagement from '@/pages/admin/GalleryManagement'
import Login from '@/pages/admin/Login'
import NewsletterSubscribers from '@/pages/admin/NewsletterSubscribers'
import NewsManagement from '@/pages/admin/NewsManagement'
import ProjectManagement from '@/pages/admin/ProjectManagement'
import VolunteerManagement from '@/pages/admin/VolunteerManagement'

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="vision-mission" element={<VisionMission />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="news" element={<NewsEvents />} />
        <Route path="news/:id" element={<NewsDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="volunteer" element={<VolunteerRegistration />} />
        <Route path="manifesto" element={<Navigate to="/vision-mission#manifesto" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin login */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin protected */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="projects" element={<ProjectManagement />} />
        <Route path="news" element={<NewsManagement />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="gallery" element={<GalleryManagement />} />
        <Route path="volunteers" element={<VolunteerManagement />} />
        <Route path="messages" element={<ContactMessages />} />
        <Route path="newsletter" element={<NewsletterSubscribers />} />
        <Route path="calendar" element={<CalendarManagement />} />
      </Route>

    </Routes>
  )
}