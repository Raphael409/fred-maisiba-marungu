// src/routes/AppRoutes.jsx
// Single source of truth for all application routes.

import { Routes, Route, Navigate } from 'react-router-dom'

import PublicLayout from '@/layouts/PublicLayout'
import AdminLayout  from '@/layouts/AdminLayout'
import ProtectedRoute from './ProtectedRoute'

// Public pages
import Home                 from '@/pages/public/Home'
import About                from '@/pages/public/About'
import VisionMission        from '@/pages/public/VisionMission'
import Manifesto            from '@/pages/public/Manifesto'
import Projects             from '@/pages/public/Projects'
import ProjectDetail        from '@/pages/public/ProjectDetail'
import Gallery              from '@/pages/public/Gallery'
import NewsEvents           from '@/pages/public/NewsEvents'
import NewsDetail           from '@/pages/public/NewsDetail'
import Contact              from '@/pages/public/Contact'
import VolunteerRegistration from '@/pages/public/VolunteerRegistration'
import NotFound             from '@/pages/public/NotFound'

// Admin pages
import Login                from '@/pages/admin/Login'
import DashboardHome        from '@/pages/admin/DashboardHome'
import EventManagement      from '@/pages/admin/EventManagement'
import CalendarManagement   from '@/pages/admin/CalendarManagement'
import ProjectManagement    from '@/pages/admin/ProjectManagement'
import GalleryManagement    from '@/pages/admin/GalleryManagement'
import NewsManagement       from '@/pages/admin/NewsManagement'
import VolunteerManagement  from '@/pages/admin/VolunteerManagement'
import ContactMessages      from '@/pages/admin/ContactMessages'

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public routes ────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route index                element={<Home />} />
        <Route path="about"         element={<About />} />
        <Route path="vision-mission" element={<VisionMission />} />
        <Route path="manifesto"     element={<Manifesto />} />
        <Route path="projects"      element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />
        <Route path="gallery"       element={<Gallery />} />
        <Route path="news"          element={<NewsEvents />} />
        <Route path="news/:newsId"  element={<NewsDetail />} />
        <Route path="contact"       element={<Contact />} />
        <Route path="volunteer"     element={<VolunteerRegistration />} />
        <Route path="*"             element={<NotFound />} />
      </Route>

      {/* ── Admin login (no layout) ───────────────────── */}
      <Route path="admin/login" element={<Login />} />

      {/* ── Protected admin routes ────────────────────── */}
      <Route
        path="admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index                element={<DashboardHome />} />
        <Route path="events"        element={<EventManagement />} />
        <Route path="calendar"      element={<CalendarManagement />} />
        <Route path="projects"      element={<ProjectManagement />} />
        <Route path="gallery"       element={<GalleryManagement />} />
        <Route path="news"          element={<NewsManagement />} />
        <Route path="volunteers"    element={<VolunteerManagement />} />
        <Route path="messages"      element={<ContactMessages />} />
        {/* Catch unknown admin paths → dashboard home */}
        <Route path="*"             element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}
