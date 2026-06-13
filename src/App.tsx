import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { Home } from './pages/public/Home';
import { Portal } from './pages/public/Portal';
import { Contact } from './pages/public/Contact';
import { Admissions } from './pages/public/Admissions';
import { News } from './pages/public/News';
import { GalleryPage } from './pages/public/Gallery';
import { StaffPage } from './pages/public/Staff';
import { AcademicsPage } from './pages/public/Academics';
import { EventsPage } from './pages/public/Events';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { NewsManagement } from './pages/admin/NewsManagement';
import { GalleryManagement } from './pages/admin/GalleryManagement';
import { EventManagement } from './pages/admin/EventManagement';
import { StaffManagement } from './pages/admin/StaffManagement';
import { AcademicsManagement } from './pages/admin/AcademicsManagement';
import { AdmissionManagement } from './pages/admin/AdmissionManagement';
import ContactMessages from './pages/admin/ContactMessages';
import { SiteSettings } from './pages/admin/SiteSettings';
import { AboutPage } from './pages/public/About';
import { StudentLifeManagement } from './pages/admin/StudentLifeManagement';
import { StudentLife } from './pages/public/StudentLife';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<News />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/student-life" element={<StudentLife />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/news" element={<NewsManagement />} />
        <Route path="/admin/gallery" element={<GalleryManagement />} />
        <Route path="/admin/events" element={<EventManagement />} />
        <Route path="/admin/staff" element={<StaffManagement />} />
        <Route path="/admin/academics" element={<AcademicsManagement />} />
        <Route path="/admin/admissions" element={<AdmissionManagement />} />
        <Route path="/admin/messages" element={<ContactMessages />} />
        <Route path="/admin/settings" element={<SiteSettings />} />
        <Route path="/admin/student-life" element={<StudentLifeManagement />} />
      </Routes>
    </Router>
  );
}

export default App;