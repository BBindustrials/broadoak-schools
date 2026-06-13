/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import { fetchAcademicLevels, fetchClubs, type AcademicLevel, type Club } from '../../services/academicsService';
import { SEO } from '../../components/common/SEO';

export const AcademicsPage = () => {
  const [levels, setLevels] = useState<AcademicLevel[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'levels' | 'clubs'>('levels');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [levelsData, clubsData] = await Promise.all([
        fetchAcademicLevels(),
        fetchClubs(),
      ]);
      setLevels(levelsData || []);
      setClubs(clubsData || []);
    } catch (error) {
      console.error('Error loading academics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading academics...</div>;
  }

  return (
    <>
      <SEO 
        title="Academics" 
        description="Explore the academic programs at The Broadoak Schools. Discover our curriculum, teaching methods, and learning opportunities."
        url="https://broadoakschools.com/academics"
      />
    <main className="academics-page">
      <section className="academics-hero">
        <div className="container">
          <h1>Academics</h1>
          <p>Cambridge Certified Excellence | 21st Century Learning | Future-Ready Skills</p>
        </div>
      </section>

      <section className="academics-tabs-section">
        <div className="container">
          <div className="academics-tabs">
            <button className={`tab-btn ${activeTab === 'levels' ? 'active' : ''}`} onClick={() => setActiveTab('levels')}>
              Academic Levels
            </button>
            <button className={`tab-btn ${activeTab === 'clubs' ? 'active' : ''}`} onClick={() => setActiveTab('clubs')}>
              Clubs & Activities
            </button>
          </div>
        </div>
      </section>

      {activeTab === 'levels' && (
        <section className="academic-levels-section">
          <div className="container">
            <div className="academic-levels-grid">
              {levels.map((level, idx) => (
                <div key={level.id} className="academic-level-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="level-header">
                    <h2>{level.name}</h2>
                    <span className="level-age">{level.age_range}</span>
                  </div>
                  <p className="level-description">{level.description}</p>
                  <div className="level-details">
                    <div className="level-subjects">
                      <h4>📖 Subjects</h4>
                      <ul>{level.subjects?.map((s, i) => <li key={i}>{s}</li>)}</ul>
                    </div>
                    <div className="level-features">
                      <h4>✨ Features</h4>
                      <ul>{level.features?.map((f, i) => <li key={i}>{f}</li>)}</ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'clubs' && (
        <section className="clubs-section">
          <div className="container">
            <div className="clubs-intro">
              <h2>Beyond the Classroom</h2>
              <p>Discover your passion through our diverse clubs and activities</p>
            </div>
            <div className="clubs-grid">
              {clubs.map((club, idx) => (
                <div key={club.id} className="club-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="club-icon">{club.icon}</div>
                  <h3>{club.name}</h3>
                  <p>{club.description}</p>
                  <div className="club-details">
                    <span>👥 Coordinator: {club.coordinator}</span>
                    <span>📅 {club.meeting_day} at {club.meeting_time}</span>
                    <span>📍 {club.venue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
    </>        
  );
};