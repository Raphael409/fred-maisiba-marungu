// src/routes/AppRoutes.jsx — Public Site
// Admin section removed — it is now a completely separate app (admin-app/).

import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout          from '@/layouts/PublicLayout'
import Home                  from '@/pages/public/Home'
import About                 from '@/pages/public/About'
import VisionMission         from '@/pages/public/VisionMission'
import Projects              from '@/pages/public/Projects'
import ProjectDetail         from '@/pages/public/ProjectDetail'
import Gallery               from '@/pages/public/Gallery'
import NewsEvents            from '@/pages/public/NewsEvents'
import NewsDetail            from '@/pages/public/NewsDetail'
import Contact               from '@/pages/public/Contact'
import VolunteerRegistration from '@/pages/public/VolunteerRegistration'
import NotFound              from '@/pages/public/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index                 element={<Home />} />
        <Route path="about"          element={<About />} />
        <Route path="vision-mission" element={<VisionMission />} />
        <Route path="projects"       element={<Projects />} />
        <Route path="projects/:id"   element={<ProjectDetail />} />
        <Route path="gallery"        element={<Gallery />} />
        <Route path="news"           element={<NewsEvents />} />
        <Route path="news/:id"       element={<NewsDetail />} />
        <Route path="contact"        element={<Contact />} />
        <Route path="volunteer"      element={<VolunteerRegistration />} />
        <Route path="manifesto"      element={<Navigate to="/vision-mission#manifesto" replace />} />
        <Route path="*"              element={<NotFound />} />
      </Route>
    </Routes>
  )
}