import { Link } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher, FaUserLock, FaBookOpen, FaChartLine, FaCreditCard } from 'react-icons/fa';
import { SEO } from '../../components/common/SEO';

export const Portal = () => {
  const handleExamPortalClick = () => {
    window.open('https://app.klacify.com.ng/startcbt/guest.php', '_blank');
  };

  return (
    <>
      <SEO 
        title="Portals" 
        description="Access your personalized dashboard for academic resources, examinations, and school management."
        url="https://broadoakschools.com/portal"
      />
    <main className="portal-page">
      {/* Hero Section - Fixed spacing */}
      <div className="portal-hero-spacer"></div>
      <section className="portal-hero">
        <div className="container">
          <h1>Our Portals</h1>
          <p>Access your personalized dashboard for academic resources, examinations, and school management</p>
        </div>
      </section>

      {/* Rest of the component remains the same */}
      
      {/* Portals Grid */}
      <section className="portals-section">
        <div className="container">
          <div className="portals-grid">
            
            {/* Admin Portal Card */}
            <div className="portal-card admin-portal">
              <div className="portal-icon">
                <FaUserLock />
              </div>
              <h2>Admin Portal</h2>
              <p>Secure access for school administrators, teachers, and staff to manage website content, student records, and school operations.</p>
              <div className="portal-features">
                <h3>Features:</h3>
                <ul>
                  <li>✓ Content Management System</li>
                  <li>✓ Student Records Management</li>
                  <li>✓ Staff Dashboard</li>
                  <li>✓ Announcement Publishing</li>
                  <li>✓ Gallery & Events Management</li>
                </ul>
              </div>
              <Link to="/admin/login" className="portal-btn admin-btn">
                Access Admin Portal →
              </Link>
              <p className="portal-note">Authorized personnel only</p>
            </div>

            {/* Exam Portal Card */}
            <div className="portal-card exam-portal">
              <div className="portal-icon">
                <FaBookOpen />
              </div>
              <h2>Exam Portal</h2>
              <p>Take examinations, view results, and track academic progress through our integrated examination platform.</p>
              <div className="portal-features">
                <h3>Features:</h3>
                <ul>
                  <li>✓ Online CBT Examinations</li>
                  <li>✓ Instant Results</li>
                  <li>✓ Past Questions Access</li>
                  <li>✓ Performance Analytics</li>
                  <li>✓ Examination Schedule</li>
                </ul>
              </div>
              <button onClick={handleExamPortalClick} className="portal-btn exam-btn">
                Launch Exam Portal →
              </button>
              <p className="portal-note">Powered by Klassify CBT Platform</p>
            </div>

            {/* Student Portal Card (Coming Soon) */}
            <div className="portal-card student-portal coming-soon">
              <div className="portal-icon">
                <FaUserGraduate />
              </div>
              <h2>Student Portal</h2>
              <p>Access your academic records, assignments, and learning resources.</p>
              <div className="portal-features">
                <h3>Coming Features:</h3>
                <ul>
                  <li>✓ Academic History</li>
                  <li>✓ Assignment Submission</li>
                  <li>✓ Learning Materials</li>
                  <li>✓ Fee Payment Tracking</li>
                </ul>
              </div>
              <button className="portal-btn coming-soon-btn" disabled>
                Coming Soon
              </button>
            </div>

            {/* Parent Portal Card (Coming Soon) */}
            <div className="portal-card parent-portal coming-soon">
              <div className="portal-icon">
                <FaChartLine />
              </div>
              <h2>Parent Portal</h2>
              <p>Monitor your child's academic progress, attendance, and school activities.</p>
              <div className="portal-features">
                <h3>Coming Features:</h3>
                <ul>
                  <li>✓ Child Performance Tracking</li>
                  <li>✓ Attendance Monitoring</li>
                  <li>✓ Fee Payment Portal</li>
                  <li>✓ Teacher Communication</li>
                </ul>
              </div>
              <button className="portal-btn coming-soon-btn" disabled>
                Coming Soon
              </button>
            </div>

            {/* Staff Portal Card (Coming Soon) */}
            <div className="portal-card staff-portal coming-soon">
              <div className="portal-icon">
                <FaChalkboardTeacher />
              </div>
              <h2>Staff Portal</h2>
              <p>Access staff resources, lesson plans, and administrative tools.</p>
              <div className="portal-features">
                <h3>Coming Features:</h3>
                <ul>
                  <li>✓ Lesson Planning Tools</li>
                  <li>✓ Grade Submission</li>
                  <li>✓ Attendance Management</li>
                  <li>✓ Staff Communication</li>
                </ul>
              </div>
              <button className="portal-btn coming-soon-btn" disabled>
                Coming Soon
              </button>
            </div>

            {/* Payment Portal Card (Coming Soon) */}
            <div className="portal-card payment-portal coming-soon">
              <div className="portal-icon">
                <FaCreditCard />
              </div>
              <h2>Payment Portal</h2>
              <p>Make secure online payments for school fees, admission forms, and other services.</p>
              <div className="portal-features">
                <h3>Coming Features:</h3>
                <ul>
                  <li>✓ School Fee Payment</li>
                  <li>✓ Admission Form Purchase</li>
                  <li>✓ Payment History</li>
                  <li>✓ Receipt Generation</li>
                </ul>
              </div>
              <button className="portal-btn coming-soon-btn" disabled>
                Coming Soon
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="portal-help">
        <div className="container">
          <h2>Need Help?</h2>
          <p>If you're experiencing issues accessing any portal, please contact our support team:</p>
          <div className="help-contact">
            <p>📞 Phone: +234 803 750 3627</p>
            <p>📧 Email: support@broadoakschools.com</p>
            <p>🕒 Support Hours: Monday - Friday, 8:00 AM - 4:00 PM</p>
          </div>
        </div>
      </section>
    </main>
      </>
  );
};