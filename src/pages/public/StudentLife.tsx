/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeaturedGallery, type GalleryImage } from '../../services/galleryService';
import { fetchStudentLifeSettings, type StudentLifeSettings } from '../../services/studentLifeService';
import { SEO } from '../../components/common/SEO';

// Club data with updated meeting times
const CLUBS = [
  {
    id: 1,
    name: 'Book & Comic Club',
    icon: '📚',
    color: '#1a3a6b',
    description: 'Discover the magic of reading! Members explore age-appropriate novels, graphic novels, and comics. Activities include book reviews, comic creation workshops, storytelling sessions, and literary quizzes.',
    activities: ['Book reading sessions', 'Comic creation workshops', 'Storytelling competitions', 'Author visits', 'Book review writing'],
    meeting_day: 'Tuesdays & Thursdays',
    meeting_time: '3:00 PM - 4:00 PM',
    venue: 'School Library',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400'
  },
  {
    id: 2,
    name: 'STEM Club (Coding & Robotics)',
    icon: '🤖',
    color: '#c41e3a',
    description: 'Future innovators unite! Students learn programming, robotics, and emerging technologies through hands-on projects. Prepare for the digital age with practical tech skills.',
    activities: ['Python programming', 'LEGO robotics', 'App development', 'AI awareness', 'Hackathons', '3D design'],
    meeting_day: 'Tuesdays & Thursdays',
    meeting_time: '3:00 PM - 4:00 PM',
    venue: 'ICT Lab',
    image: 'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?w=400'
  },
  {
    id: 3,
    name: 'Super Steps (Dancing Club)',
    icon: '💃',
    color: '#f4c542',
    description: 'Express yourself through movement! Learn various dance styles including cultural, contemporary, hip-hop, and traditional Nigerian dances. Build confidence and coordination.',
    activities: ['Cultural dance', 'Hip-hop routines', 'Choreography', 'Dance battles', 'Performance at school events'],
    meeting_day: 'Tuesdays & Thursdays',
    meeting_time: '3:00 PM - 4:00 PM',
    venue: 'Dance Studio / Hall',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400'
  },
  {
    id: 4,
    name: 'Taekwondo Club',
    icon: '🥋',
    color: '#2c3e50',
    description: 'Discipline, respect, and self-defense! Students learn Taekwondo techniques, forms (poomsae), sparring, and self-defense. Promotes physical fitness and mental focus.',
    activities: ['Basic kicks and punches', 'Poomsae (forms)', 'Sparring practice', 'Self-defense techniques', 'Fitness training', 'Belt grading'],
    meeting_day: 'Saturdays',
    meeting_time: '9:00 AM - 11:00 AM',
    venue: 'Sports Hall',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400'
  },
  {
    id: 5,
    name: 'Football Academy',
    icon: '⚽',
    color: '#27ae60',
    description: 'Develop football skills, teamwork, and sportsmanship. Professional coaching with focus on technique, tactics, and physical conditioning. Represent the school in competitions.',
    activities: ['Ball control drills', 'Tactical training', 'Fitness conditioning', 'Friendly matches', 'Inter-house competition', 'Tournaments'],
    meeting_day: 'Thursdays',
    meeting_time: '11:00 AM - 2:30 PM',
    venue: 'School Football Field',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400'
  },
  {
    id: 6,
    name: 'Home Makers Club',
    icon: '🍳',
    color: '#e67e22',
    description: 'Learn essential life skills for independent living! Cooking, baking, sewing, home management, and hospitality. Build confidence in domestic arts.',
    activities: ['Cooking and baking', 'Sewing and fashion design', 'Table setting and etiquette', 'Home decoration', 'Event planning', 'Food hygiene'],
    meeting_day: 'Tuesdays & Thursdays',
    meeting_time: '3:00 PM - 4:00 PM',
    venue: 'Home Economics Lab',
    image: 'https://images.unsplash.com/photo-1556911220-bda9f9f3a2d3?w=400'
  },
  {
    id: 7,
    name: 'Music Club',
    icon: '🎵',
    color: '#8e44ad',
    description: 'Unleash your musical talent! Learn vocal techniques, instruments, music theory, and performance skills. Join the school choir or band.',
    activities: ['Vocal training', 'Instrumental lessons (piano, guitar, drums)', 'Music theory', 'Choir practice', 'Band sessions', 'School performances'],
    meeting_day: 'Tuesdays & Thursdays',
    meeting_time: '3:00 PM - 4:00 PM',
    venue: 'Music Room',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400'
  },
  {
    id: 8,
    name: 'Language Club',
    icon: '🗣️',
    color: '#3498db',
    description: 'Embrace multilingualism! Learn French, Spanish, and Nigerian languages. Develop communication skills for global citizenship.',
    activities: ['French conversation', 'Spanish basics', 'Nigerian languages (Igbo, Yoruba, Hausa)', 'Cultural exchange', 'Language games', 'Pen pal programs'],
    meeting_day: 'Tuesdays & Thursdays',
    meeting_time: '3:00 PM - 4:00 PM',
    venue: 'Language Lab',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400'
  }
];

// Updated Sports - Removed basketball, volleyball, table tennis, added indoor games
const SPORTS = [
  { name: 'Football Academy', icon: '⚽', description: 'Professional training and inter-school competitions' },
  { name: 'Athletics', icon: '🏃', description: 'Track and field events for all age groups' },
  { name: 'Taekwondo', icon: '🥋', description: 'Martial arts training on Saturdays' },
  { name: 'Ludo', icon: '🎲', description: 'Strategic board game for critical thinking' },
  { name: 'Chess', icon: '♟️', description: 'Develop strategic thinking and patience' },
];

// Annual events
const ANNUAL_EVENTS = [
  { month: 'Bi-annual', event: 'Inter-House Sports Competition', icon: '🏆' },
  { month: 'Biannual', event: 'Cultural Day & Graduation Ceremony', icon: '🎭' },
  { month: 'December', event: 'Christmas Carol', icon: '🎄' },
  { month: 'June', event: 'Hackathon', icon: '👨‍💻' },
  { month: 'July', event: 'Graduation Day', icon: '🎓' },
];

export const StudentLife = () => {
  const [selectedClub, setSelectedClub] = useState<typeof CLUBS[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [settings, setSettings] = useState<StudentLifeSettings | null>(null);
  const [, setLoadingSettings] = useState(true);

  useEffect(() => {
    loadGalleryImages();
    loadSettings();
  }, []);

  const loadGalleryImages = async () => {
    try {
      setLoadingGallery(true);
      const data = await fetchFeaturedGallery(8);
      setGalleryImages(data || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoadingGallery(false);
    }
  };

  const loadSettings = async () => {
    try {
      setLoadingSettings(true);
      const data = await fetchStudentLifeSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const openClubModal = (club: typeof CLUBS[0]) => {
    setSelectedClub(club);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeClubModal = () => {
    setIsModalOpen(false);
    setSelectedClub(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <SEO 
        title="Student Life" 
        description="Explore the vibrant student life at The Broadoak Schools. Discover clubs, sports, and annual events."
        url="https://broadoakschools.com/student-life"
      />
    <main className="student-life-page">
      <section className="student-life-hero">
        <div className="container">
          <h1>{settings?.hero_title || 'Student Life'}</h1>
          <p>{settings?.hero_subtitle || 'Beyond the Classroom - Growing Character, Building Futures'}</p>
        </div>
      </section>

      <section className="student-life-quote">
        <div className="container">
          <div className="quote-box">
            <p>{settings?.quote_text || '"Every student is encouraged to discover their passion, develop their talents, and become a well-rounded individual."'}</p>
            <span>- {settings?.quote_author || 'The Broadoak Schools Philosophy'}</span>
          </div>
        </div>
      </section>

      {/* Clubs & Societies Section */}
      <section className="clubs-section">
        <div className="container">
          <h2>{settings?.clubs_title || 'Clubs & Societies'}</h2>
          <p className="section-subtitle">{settings?.clubs_subtitle || 'Discover your passion beyond the classroom'}</p>
          
          <div className="clubs-grid">
            {CLUBS.map((club) => (
              <div key={club.id} className="club-card" onClick={() => openClubModal(club)}>
                <div className="club-icon" style={{ backgroundColor: club.color }}>
                  <span>{club.icon}</span>
                </div>
                <div className="club-info">
                  <h3>{club.name}</h3>
                  <p>{club.description.substring(0, 80)}...</p>
                  <button className="learn-more-btn">Learn More →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="sports-section">
        <div className="container">
          <h2>{settings?.sports_title || 'Sports & Athletics'}</h2>
          <p className="section-subtitle">{settings?.sports_subtitle || 'Building teamwork, discipline, and physical fitness'}</p>
          
          <div className="sports-grid">
            {SPORTS.map((sport, index) => (
              <div key={index} className="sport-card">
                <div className="sport-icon">{sport.icon}</div>
                <h3>{sport.name}</h3>
                <p>{sport.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual Events Section */}
      <section className="events-calendar-section">
        <div className="container">
          <h2>{settings?.events_title || 'Annual Events Calendar'}</h2>
          <p className="section-subtitle">{settings?.events_subtitle || 'Memorable moments throughout the school year'}</p>
          
          <div className="events-timeline">
            {ANNUAL_EVENTS.map((event, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-month">{event.month}</div>
                <div className="timeline-event">
                  <span className="event-icon">{event.icon}</span>
                  <span>{event.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="leadership-section">
        <div className="container">
          <h2>{settings?.leadership_title || 'Leadership Development'}</h2>
          <div className="leadership-grid">
            <div className="leadership-card">
              <div className="leadership-icon">👨‍🎓</div>
              <h3>Student Council</h3>
              <p>Elected representatives who voice student opinions and organize school activities.</p>
            </div>
            <div className="leadership-card">
              <div className="leadership-icon">🪄</div>
              <h3>Prefectorial Board</h3>
              <p>Head Boy, Head Girl, and departmental prefects maintaining school discipline.</p>
            </div>
            <div className="leadership-card">
              <div className="leadership-icon">🤝</div>
              <h3>Peer Mentoring Program</h3>
              <p>Senior students mentoring juniors academically and socially.</p>
            </div>
            <div className="leadership-card">
              <div className="leadership-icon">🏅</div>
              <h3>House System</h3>
              <p>Four houses competing in academics, sports, and cultural activities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="student-gallery-section">
        <div className="container">
          <h2>{settings?.gallery_title || 'Memories in Motion'}</h2>
          <p className="section-subtitle">{settings?.gallery_subtitle || 'Capturing the vibrant spirit of student life'}</p>
          
          <div className="student-gallery-grid">
            {!loadingGallery && galleryImages.slice(0, 4).map((image) => (
              <div key={image.id} className="gallery-item">
                <img src={image.image_url} alt={image.title} />
                <div className="gallery-overlay">
                  <span>📸 {image.title}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="gallery-cta">
            <Link to="/gallery" className="btn-primary">View Full Gallery →</Link>
          </div>
        </div>
      </section>

      {/* Club Modal */}
      {isModalOpen && selectedClub && (
        <div className="club-modal-overlay" onClick={closeClubModal}>
          <div className="club-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="club-modal-close" onClick={closeClubModal}>✕</button>
            
            <div className="club-modal-header" style={{ backgroundColor: selectedClub.color }}>
              <div className="club-modal-icon">{selectedClub.icon}</div>
              <h2>{selectedClub.name}</h2>
            </div>
            
            <div className="club-modal-body">
              <p className="club-modal-description">{selectedClub.description}</p>
              
              <div className="club-details-grid">
                <div className="club-detail-item">
                  <span className="detail-icon">📅</span>
                  <div>
                    <strong>Meeting Day</strong>
                    <p>{selectedClub.meeting_day}</p>
                  </div>
                </div>
                <div className="club-detail-item">
                  <span className="detail-icon">⏰</span>
                  <div>
                    <strong>Meeting Time</strong>
                    <p>{selectedClub.meeting_time}</p>
                  </div>
                </div>
                <div className="club-detail-item">
                  <span className="detail-icon">📍</span>
                  <div>
                    <strong>Venue</strong>
                    <p>{selectedClub.venue}</p>
                  </div>
                </div>
              </div>
              
              <div className="club-activities">
                <h3>Activities Include:</h3>
                <ul>
                  {selectedClub.activities.map((activity, idx) => (
                    <li key={idx}>{activity}</li>
                  ))}
                </ul>
              </div>
              
              <button className="join-club-btn" onClick={closeClubModal}>
                Interested? Contact Coordinator →
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
        </>
  );
};