/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';

interface DashboardStats {
  news: number;
  publishedNews: number;
  draftNews: number;
  events: number;
  upcomingEvents: number;
  pastEvents: number;
  gallery: number;
  featuredGallery: number;
  staff: number;
  activeStaff: number;
  messages: number;
  unreadMessages: number;
  admissions: number;
  studentLifeSettings: number;
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('');
  const [adminRole, setAdminRole] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    news: 0,
    publishedNews: 0,
    draftNews: 0,
    events: 0,
    upcomingEvents: 0,
    pastEvents: 0,
    gallery: 0,
    featuredGallery: 0,
    staff: 0,
    activeStaff: 0,
    messages: 0,
    unreadMessages: 0,
    admissions: 0,
    studentLifeSettings: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
    fetchStats();
    fetchRecentActivities();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
      return;
    }
    if (session.user.email) {
      setAdminName(session.user.email.split('@')[0]);
      
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('role')
        .eq('email', session.user.email)
        .single();
      
      if (adminData) {
        setAdminRole(adminData.role);
      }
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const { count: newsCount } = await supabase
        .from('news_posts')
        .select('*', { count: 'exact', head: true });
      
      const { count: publishedNewsCount } = await supabase
        .from('news_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');
      
      const { count: draftNewsCount } = await supabase
        .from('news_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });
      
      const { count: upcomingEventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'upcoming');
      
      const { count: pastEventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'past');

      const { count: galleryCount } = await supabase
        .from('gallery_images')
        .select('*', { count: 'exact', head: true });
      
      const { count: featuredGalleryCount } = await supabase
        .from('gallery_images')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true);

      const { count: staffCount } = await supabase
        .from('staff_members')
        .select('*', { count: 'exact', head: true });
      
      const { count: activeStaffCount } = await supabase
        .from('staff_members')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const { count: messagesCount } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true });
      
      const { count: unreadMessagesCount } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      const { count: admissionsCount } = await supabase
        .from('admission_info')
        .select('*', { count: 'exact', head: true });

      const { count: studentLifeCount } = await supabase
        .from('student_life_settings')
        .select('*', { count: 'exact', head: true });

      setStats({
        news: newsCount || 0,
        publishedNews: publishedNewsCount || 0,
        draftNews: draftNewsCount || 0,
        events: eventsCount || 0,
        upcomingEvents: upcomingEventsCount || 0,
        pastEvents: pastEventsCount || 0,
        gallery: galleryCount || 0,
        featuredGallery: featuredGalleryCount || 0,
        staff: staffCount || 0,
        activeStaff: activeStaffCount || 0,
        messages: messagesCount || 0,
        unreadMessages: unreadMessagesCount || 0,
        admissions: admissionsCount || 0,
        studentLifeSettings: studentLifeCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const { data: recentNews } = await supabase
        .from('news_posts')
        .select('id, title, created_at, status')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: recentEvents } = await supabase
        .from('events')
        .select('id, title, created_at, status')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: recentGallery } = await supabase
        .from('gallery_images')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: recentMessages } = await supabase
        .from('contact_messages')
        .select('id, full_name, created_at, is_read')
        .order('created_at', { ascending: false })
        .limit(3);

      const activities = [
        ...(recentNews?.map(n => ({ type: 'news', id: n.id, title: n.title, date: n.created_at, status: n.status })) || []),
        ...(recentEvents?.map(e => ({ type: 'event', id: e.id, title: e.title, date: e.created_at, status: e.status })) || []),
        ...(recentGallery?.map(g => ({ type: 'gallery', id: g.id, title: g.title, date: g.created_at })) || []),
        ...(recentMessages?.map(m => ({ type: 'message', id: m.id, title: m.full_name, date: m.created_at, is_read: m.is_read })) || []),
      ];

      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivities(activities.slice(0, 8));
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  if (loading) {
    return <div className="loading-spinner">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>The Broadoak Schools</h3>
          <p>Admin Control Panel</p>
          {adminRole && <span className="admin-role-badge">{adminRole}</span>}
        </div>
        
        <nav className="sidebar-nav">
          {/* Main Section */}
          <div className="nav-section">
            <div className="nav-section-title">MAIN</div>
            <a href="/admin/dashboard" className={`nav-item ${isActive('/admin/dashboard')}`}>
              <span className="nav-icon">📊</span>
              <span className="nav-text">Dashboard</span>
            </a>
          </div>

          {/* Content Management */}
          <div className="nav-section">
            <div className="nav-section-title">CONTENT MANAGEMENT</div>
            <a href="/admin/news" className={`nav-item ${isActive('/admin/news')}`}>
              <span className="nav-icon">📰</span>
              <span className="nav-text">News & Articles</span>
              {stats.draftNews > 0 && <span className="nav-badge">{stats.draftNews}</span>}
            </a>
            <a href="/admin/gallery" className={`nav-item ${isActive('/admin/gallery')}`}>
              <span className="nav-icon">🖼️</span>
              <span className="nav-text">Photo Gallery</span>
              <span className="nav-badge">{stats.gallery}</span>
            </a>
            <a href="/admin/events" className={`nav-item ${isActive('/admin/events')}`}>
              <span className="nav-icon">📅</span>
              <span className="nav-text">Events Calendar</span>
              {stats.upcomingEvents > 0 && <span className="nav-badge">{stats.upcomingEvents}</span>}
            </a>
          </div>

          {/* School Management */}
          <div className="nav-section">
            <div className="nav-section-title">SCHOOL MANAGEMENT</div>
            <a href="/admin/admissions" className={`nav-item ${isActive('/admin/admissions')}`}>
              <span className="nav-icon">🎓</span>
              <span className="nav-text">Admissions</span>
            </a>
            <a href="/admin/staff" className={`nav-item ${isActive('/admin/staff')}`}>
              <span className="nav-icon">👥</span>
              <span className="nav-text">Staff Directory</span>
              <span className="nav-badge">{stats.staff}</span>
            </a>
            <a href="/admin/student-life" className={`nav-item ${isActive('/admin/student-life')}`}>
              <span className="nav-icon">🎯</span>
              <span className="nav-text">Student Life</span>
            </a>
            <a href="/admin/academics" className={`nav-item ${isActive('/admin/academics')}`}>
              <span className="nav-icon">📚</span>
              <span className="nav-text">Academics</span>
            </a>
          </div>

          {/* Communications */}
          <div className="nav-section">
            <div className="nav-section-title">COMMUNICATIONS</div>
            <a href="/admin/messages" className={`nav-item ${isActive('/admin/messages')}`}>
              <span className="nav-icon">💬</span>
              <span className="nav-text">Contact Messages</span>
              {stats.unreadMessages > 0 && <span className="nav-badge unread">{stats.unreadMessages}</span>}
            </a>
          </div>

          {/* Settings */}
          <div className="nav-section">
            <div className="nav-section-title">SETTINGS</div>
            <a href="/admin/settings" className={`nav-item ${isActive('/admin/settings')}`}>
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Site Settings</span>
            </a>
          </div>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info-card">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <p className="user-name">{adminName}</p>
              <p className="user-email">{adminRole || 'Administrator'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <div className="dashboard-date">
            {new Date().toLocaleDateString('en-NG', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📰</div>
            <div className="stat-info">
              <h3>{stats.news}</h3>
              <p>Total Posts</p>
              <small>{stats.publishedNews} published, {stats.draftNews} draft</small>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{stats.events}</h3>
              <p>Total Events</p>
              <small>{stats.upcomingEvents} upcoming</small>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🖼️</div>
            <div className="stat-info">
              <h3>{stats.gallery}</h3>
              <p>Gallery Images</p>
              <small>{stats.featuredGallery} featured</small>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.staff}</h3>
              <p>Staff Members</p>
              <small>{stats.activeStaff} active</small>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-info">
              <h3>{stats.messages}</h3>
              <p>Contact Messages</p>
              <small>{stats.unreadMessages} unread</small>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎓</div>
            <div className="stat-info">
              <h3>{stats.admissions}</h3>
              <p>Admission Records</p>
              <small>Current settings</small>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <a href="/admin/news" className="action-btn">✏️ Write Article</a>
            <a href="/admin/gallery" className="action-btn">📸 Upload Photos</a>
            <a href="/admin/events" className="action-btn">📅 Add Event</a>
            <a href="/admin/staff" className="action-btn">👥 Add Staff</a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivities.length === 0 ? (
              <p className="activity-item">No recent activity</p>
            ) : (
              recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'news' && '📰'}
                    {activity.type === 'event' && '📅'}
                    {activity.type === 'gallery' && '🖼️'}
                    {activity.type === 'message' && '💬'}
                  </div>
                  <div className="activity-details">
                    <p className="activity-title">
                      {activity.type === 'news' && `News: ${activity.title}`}
                      {activity.type === 'event' && `Event: ${activity.title}`}
                      {activity.type === 'gallery' && `Gallery: ${activity.title}`}
                      {activity.type === 'message' && `Message from: ${activity.title}`}
                      {activity.status === 'published' && <span className="activity-badge published">Published</span>}
                      {activity.status === 'draft' && <span className="activity-badge draft">Draft</span>}
                      {activity.is_read === false && <span className="activity-badge unread">Unread</span>}
                    </p>
                    <p className="activity-date">
                      {new Date(activity.date).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};