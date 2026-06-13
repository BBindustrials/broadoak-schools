/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }
    setUserEmail(user.email || '');
    
    const role = localStorage.getItem('adminRole');
    setUserRole(role || '');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminRole');
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>The Broadoak Schools</h3>
          <p>Admin Dashboard</p>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>
            📊 Dashboard
          </Link>
          <Link to="/admin/homepage" className={isActive('/admin/homepage')}>
            🏠 Homepage Manager
          </Link>
          <Link to="/admin/admissions" className={isActive('/admin/admissions')}>
            📝 Admissions Manager
          </Link>
          <Link to="/admin/news" className={isActive('/admin/news')}>
            📰 News Manager
          </Link>
          <Link to="/admin/gallery" className={isActive('/admin/gallery')}>
            🖼️ Gallery Manager
          </Link>
          <Link to="/admin/events" className={isActive('/admin/events')}>
            📅 Events Manager
          </Link>
          <Link to="/admin/staff" className={isActive('/admin/staff')}>
            👥 Staff Manager
          </Link>
          <Link to="/admin/contacts" className={isActive('/admin/contacts')}>
            💬 Contact Messages
          </Link>
          <Link to="/admin/settings" className={isActive('/admin/settings')}>
            ⚙️ Site Settings
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <p className="user-email">{userEmail}</p>
            <p className="user-role">Role: {userRole}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};