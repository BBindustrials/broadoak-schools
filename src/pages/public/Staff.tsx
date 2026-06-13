/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import { fetchActiveStaff, fetchStaffByDepartment, type StaffMember } from '../../services/staffService';

const DEPARTMENTS = [
  'All',
  'Leadership',
  'Administration',
  'Teaching Staff',
  'Academic Support',
  'Administrative Staff',
  'Support Staff',
];

export const StaffPage = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadStaff();
  }, [selectedDepartment]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      let data;
      if (selectedDepartment === 'All') {
        data = await fetchActiveStaff();
      } else {
        data = await fetchStaffByDepartment(selectedDepartment);
      }
      setStaff(data || []);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const openStaffModal = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeStaffModal = () => {
    setIsModalOpen(false);
    setSelectedStaff(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="loading-spinner" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading staff directory...
      </div>
    );
  }

  return (
    <main className="staff-page">
      {/* Hero Section */}
      <section className="staff-hero">
        <div className="container">
          <h1>Our Staff</h1>
          <p>Meet the dedicated team shaping young minds at The Broadoak Schools</p>
        </div>
      </section>

      {/* Department Filter */}
      <section className="staff-filter-section">
        <div className="container">
          <div className="staff-filters">
            {DEPARTMENTS.map(dept => (
              <button
                key={dept}
                className={`filter-btn ${selectedDepartment === dept ? 'active' : ''}`}
                onClick={() => setSelectedDepartment(dept)}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="staff-grid-section">
        <div className="container">
          {staff.length === 0 ? (
            <div className="no-staff">
              <p>No staff members found in this department.</p>
            </div>
          ) : (
            <div className="staff-public-grid">
              {staff.map((member, index) => (
                <div
                  key={member.id}
                  className="staff-card"
                  onClick={() => openStaffModal(member)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="staff-card-image">
                    <img src={member.photo_url} alt={member.name} />
                  </div>
                  <div className="staff-card-info">
                    <h3>{member.name}</h3>
                    <p className="staff-position">{member.position}</p>
                    <p className="staff-department">{member.department}</p>
                    <button className="view-profile-btn">View Profile</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Staff Modal */}
      {isModalOpen && selectedStaff && (
        <div className="staff-modal-overlay" onClick={closeStaffModal}>
          <div className="staff-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="staff-modal-close" onClick={closeStaffModal}>✕</button>
            <div className="staff-modal-content">
              <div className="staff-modal-image">
                <img src={selectedStaff.photo_url} alt={selectedStaff.name} />
              </div>
              <div className="staff-modal-info">
                <h2>{selectedStaff.name}</h2>
                <p className="staff-modal-position">{selectedStaff.position}</p>
                <p className="staff-modal-department">{selectedStaff.department}</p>
                {selectedStaff.bio && (
                  <div className="staff-modal-bio">
                    <h3>Biography</h3>
                    <p>{selectedStaff.bio}</p>
                  </div>
                )}
                <div className="staff-modal-contact">
                  {selectedStaff.email && (
                    <p><strong>📧 Email:</strong> <a href={`mailto:${selectedStaff.email}`}>{selectedStaff.email}</a></p>
                  )}
                  {selectedStaff.phone && (
                    <p><strong>📞 Phone:</strong> <a href={`tel:${selectedStaff.phone}`}>{selectedStaff.phone}</a></p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};