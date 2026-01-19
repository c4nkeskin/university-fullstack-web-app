import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/App.css';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NewsListPage from './pages/NewsListPage';
import NewsDetailPage from './pages/NewsDetailPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import FacultiesPage from './pages/FacultiesPage';
import AcademicUnitDetailPage from './pages/AcademicUnitDetailPage';
import ContactPage from './pages/ContactPage';
import SystemPage from './pages/SystemPage';
import AcademicStaffPage from './pages/AcademicStaffPage';
import AcademicCalendarPage from './pages/AcademicCalendarPage';
import CourseSchedulePage from './pages/CourseSchedulePage';
import OBSLoginPage from './pages/OBSLoginPage';
import OBSDashboard from './pages/OBSDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import { BookOpen, Library, Mail, FileText } from 'lucide-react';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hakkimizda" element={<AboutPage />} />
          <Route path="/duyurular" element={<AnnouncementsPage />} />
          <Route path="/haberler" element={<NewsListPage />} />
          <Route path="/haberler/:id" element={<NewsDetailPage />} />
          <Route path="/etkinlikler" element={<EventsPage />} />
          <Route path="/etkinlikler/:id" element={<EventDetailPage />} />
          <Route path="/fakulteler" element={<FacultiesPage />} />
          <Route path="/meslek-yuksekokulları" element={<FacultiesPage />} />
          <Route path="/meslek-yüksekokulları" element={<FacultiesPage />} />
          <Route path="/enstituler" element={<FacultiesPage />} />
          <Route path="/akademik-birim/:id" element={<AcademicUnitDetailPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          
          {/* Academic Pages */}
          <Route path="/akademik-kadro" element={<AcademicStaffPage />} />
          <Route path="/akademik-takvim" element={<AcademicCalendarPage />} />
          <Route path="/ders-programlari" element={<CourseSchedulePage />} />
          
          {/* OBS Pages */}
          <Route path="/obs/giris" element={<OBSLoginPage />} />
          <Route path="/obs/dashboard" element={<OBSDashboard />} />
          
          {/* System Pages */}
          <Route path="/sistem/obs" element={<SystemPage title="OBS" icon={BookOpen} />} />
          <Route path="/sistem/kütüphane" element={<SystemPage title="Kütüphane" icon={Library} />} />
          <Route path="/sistem/e-posta" element={<SystemPage title="E-Posta" icon={Mail} />} />
          <Route path="/sistem/ebys" element={<SystemPage title="EBYS" icon={FileText} />} />
          
          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;