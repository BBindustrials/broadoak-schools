import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AutoCarousel } from '../../components/common/AutoCarousel';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { fetchFeaturedNews } from '../../services/newsService';
import { fetchFeaturedEvents } from '../../services/eventService';
import { fetchFeaturedGallery } from '../../services/galleryService';
import type { NewsItem } from '../../services/newsService';
import type { EventItem } from '../../services/eventService';
import type { GalleryImage } from '../../services/galleryService';
import { SEO } from '../../components/common/SEO';

// ========== BANNER IMAGES ==========
import banner1 from '../../assets/banners/banner1.png';
import banner2 from '../../assets/banners/banner2.png';
import banner3 from '../../assets/banners/banner3.png';
import banner4 from '../../assets/banners/banner4.png';
import banner5 from '../../assets/banners/banner5.png';
import banner6 from '../../assets/banners/banner6.png';
import banner7 from '../../assets/banners/banner7.png';

// ========== CEO PHOTO ==========
import ceoPhoto from '../../assets/ceo(1).png';

// ========== SCHOOL CATEGORY IMAGES ==========
import earlyYearsImg from '../../assets/categories/early-years.png';
import primaryImg from '../../assets/categories/primary.png';
import highSchoolImg from '../../assets/categories/high-school.png';

// ========== TESTIMONIAL PARENT IMAGES ==========
import parent1 from '../../assets/testimonials/parent1.png';
import parent2 from '../../assets/testimonials/parent2.jpeg';
import parent3 from '../../assets/testimonials/parent3.png';

// ========== SOCIAL MEDIA ICONS ==========
import { FaFacebookF, FaTiktok, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const BANNERS = [
  { 
    id: '1', 
    imageUrl: banner1, 
    headline: 'Welcome to The Broadoak Schools', 
    subtitle: 'Excellence in Education, Character in Action', 
    buttonText: 'Explore More', 
    buttonLink: '/about' 
  },
  { 
    id: '2', 
    imageUrl: banner2, 
    headline: 'Cambridge Certified Excellence', 
    subtitle: 'Globally Recognized Curriculum', 
    buttonText: 'Apply Now', 
    buttonLink: '/admissions' 
  },
  { 
    id: '3', 
    imageUrl: banner3, 
    headline: 'Innovation & Technology Hub', 
    subtitle: 'AI, Robotics, and Future Skills Development', 
    buttonText: 'Discover', 
    buttonLink: '/academics' 
  },
  { 
    id: '4', 
    imageUrl: banner4, 
    headline: 'State-of-the-Art Facilities', 
    subtitle: 'Modern Classrooms & Learning Environments', 
    buttonText: 'View Gallery', 
    buttonLink: '/gallery' 
  },
  { 
    id: '5', 
    imageUrl: banner5, 
    headline: 'Holistic Student Development', 
    subtitle: 'Sports, Arts, Leadership & Character Building', 
    buttonText: 'Student Life', 
    buttonLink: '/student-life' 
  },
  { 
    id: '6', 
    imageUrl: banner6, 
    headline: 'Meet Our Expert Faculty', 
    subtitle: 'Dedicated Teachers Committed to Excellence', 
    buttonText: 'Our Staff', 
    buttonLink: '/staff' 
  },
  { 
    id: '7', 
    imageUrl: banner7, 
    headline: 'Join The Broadoak Family', 
    subtitle: 'Enroll Today for the Academic Session', 
    buttonText: 'Admissions Open', 
    buttonLink: '/admissions' 
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Mrs. Lolo Oluchi Emma Ugorji',
    role: 'Parent',
    text: 'The Broadoak Schools have transformed my child\'s confidence and academic performance. The teachers are dedicated and the environment is nurturing.',
    image: parent1,
  },
  {
    id: 2,
    name: 'Pastor Udoka Obinwanne Ukah',
    role: 'Parent',
    text: 'I am impressed by the blend of traditional values and modern technology. My son loves the robotics club! Highly recommended.',
    image: parent2,
  },
  {
    id: 3,
    name: 'Sir Clesta',
    role: 'Parent',
    text: 'Cambridge curriculum delivered with excellence. My daughter\'s critical thinking skills have soared. Thank you, Broadoak!',
    image: parent3,
  },
];

export const Home = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [newsData, eventsData, galleryData] = await Promise.all([
          fetchFeaturedNews(3),
          fetchFeaturedEvents(3),
          fetchFeaturedGallery(6),
        ]);
        setNews(newsData || []);
        setEvents(eventsData || []);
        setGallery(galleryData || []);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SEO 
        title="Home" 
        description="Welcome to The Broadoak Schools - Cambridge certified excellence in Owerri. Quality education from Early Years to Senior Secondary. Enroll today!"
        url="https://broadoakschools.com"
      />
    <main>
      <AutoCarousel slides={BANNERS} interval={8000} autoPlay={true} />

      <div className="certification-badge">
        ⭐ Cambridge International School | Accredited by Cambridge Assessment International Education ⭐
      </div>

      <section className="mission-vision-section">
        <div className="container">
          <div className="mission-card">
            <h2>Our Mission</h2>
            <p>
              To create and encourage young individuals who are self‑confident yet humble, 
              ambitious yet principled, and determined to make a positive impact on society.
            </p>
          </div>
          <div className="vision-card">
            <h2>Our Vision</h2>
            <p>
              To establish a secure and nurturing environment where imagination is kindled 
              and every student's potential is fully realized through holistic education.
            </p>
          </div>
          <div className="values-card">
            <h2>Core Values</h2>
            <ul>
              <li>📚 Academic Excellence</li>
              <li>🤝 Integrity & Respect</li>
              <li>💡 Innovation & Creativity</li>
              <li>🌍 Global Citizenship</li>
              <li>🏆 Resilience & Determination</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="welcome-section">
        <div className="container">
          <div className="welcome-content">
            <div className="welcome-image">
              <img src={ceoPhoto} alt="CEO of The Broadoak Schools" />
              <p className="caption">Our Founder & Proprietor</p>
            </div>
            <div className="welcome-text">
              <h2>Welcome to The Broadoak Schools, Owerri</h2>
              <p>
                At The Broadoak Schools, we offer a complete education for life. We help students realize their full
                potential by providing a secure environment with individual attention and a blend of traditional and 
                modern teaching methods. Ranked among the best schools in Imo State, we are committed to raising 
                future leaders who are academically excellent and morally upright.
              </p>
              <Link to="/about" className="btn-secondary">Discover More About Us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2>Our Academic Levels</h2>
          <div className="categories-grid">
            <div className="category-card">
              <img src={earlyYearsImg} alt="Early Years" />
              <div className="category-content">
                <h3>Early Years</h3>
                <p>Nursery & Kindergarten (Ages 2–5)</p>
                <ul>
                  <li>Play‑based learning approach</li>
                  <li>Montessori methods integration</li>
                  <li>Safe, caring environment</li>
                </ul>
              </div>
            </div>
            <div className="category-card">
              <img src={primaryImg} alt="Primary School" />
              <div className="category-content">
                <h3>Primary School</h3>
                <p>Grades 1–6 (Ages 6–11)</p>
                <ul>
                  <li>Cambridge Primary curriculum</li>
                  <li>STEM & Arts integration</li>
                  <li>Character development focus</li>
                </ul>
              </div>
            </div>
            <div className="category-card">
              <img src={highSchoolImg} alt="High School" />
              <div className="category-content">
                <h3>High School</h3>
                <p>JSS1 – SSS3 (Ages 12–18)</p>
                <ul>
                  <li>Cambridge Lower & Upper Secondary</li>
                  <li>IGCSE preparation pathway</li>
                  <li>Career guidance & leadership</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="highlights-section">
        <div className="container">
          <h2>Why Choose Broadoak?</h2>
          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="highlight-icon">🎓</div>
              <h3>Cambridge Certified</h3>
              <p>International curriculum with global recognition and standards.</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">💡</div>
              <h3>Innovation Hub</h3>
              <p>AI, robotics, coding, and future skills laboratory.</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🏆</div>
              <h3>Excellence Track Record</h3>
              <p>Outstanding results in national and international examinations.</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">👩‍🏫</div>
              <h3>Experienced Faculty</h3>
              <p>Dedicated teachers who inspire and mentor students.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <h2>What Parents Say About Us</h2>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="testimonial-card">
                <img src={t.image} alt={t.name} className="testimonial-image" />
                <p className="testimonial-text">“{t.text}”</p>
                <p className="testimonial-author">— {t.name}</p>
                <p className="testimonial-role">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="news-events-section">
        <div className="container">
          <div className="news-column">
            <h2>Latest News</h2>
            {news.length > 0 ? (
              news.map((item) => (
                <article key={item.id} className="news-item">
                  {item.featured_image && <img src={item.featured_image} alt={item.title} />}
                  <div>
                    <h3>{item.title}</h3>
                    <p>{new Date(item.published_at || item.created_at || '').toLocaleDateString('en-NG')}</p>
                    <Link to={`/news/${item.slug}`}>Read More →</Link>
                  </div>
                </article>
              ))
            ) : (
              <p>No news available. Check back soon!</p>
            )}
          </div>
          <div className="events-column">
            <h2>Upcoming Events</h2>
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-date">
                    {new Date(event.event_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                  </div>
                  <div>
                    <h3>{event.title}</h3>
                    <p>{event.description?.substring(0, 100)}...</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No upcoming events scheduled.</p>
            )}
          </div>
        </div>
      </section>

      <section className="gallery-preview-section">
        <div className="container">
          <h2>Our Moments</h2>
          <div className="gallery-grid">
            {gallery.length > 0 ? (
              gallery.map((image) => (
                <img key={image.id} src={image.image_url} alt={image.title} />
              ))
            ) : (
              <p>Gallery images coming soon.</p>
            )}
          </div>
          <Link to="/gallery" className="btn-primary">View Full Gallery →</Link>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Join The Broadoak Schools?</h2>
          <p>Give your child the gift of quality education with a global perspective.</p>
          <Link to="/admissions" className="btn-primary">Apply for Admission →</Link>
        </div>
      </section>

      <section className="contact-social-section">
        <div className="container">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p><strong>📍 Address:</strong> Plot 4, the broadoak schools crescent, Federal Housing Estate, off MCC, Uratta Road, Owerri, Imo State, Nigeria</p>
            <p><strong>📞 Phone:</strong> +234 803 750 3627, +234 810 444 6168</p>
            <p><strong>📧 Email:</strong> info@broadoakschools.com</p>
            <p><strong>🕒 Office Hours:</strong> Monday – Friday, 8:00 AM – 4:00 PM</p>
          </div>
          <div className="social-links">
            <h3>Connect With Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com/broadoakschools" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF /> Facebook
              </a>
              <a href="https://tiktok.com/@thebroadoakschoolsowerri" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <FaTiktok /> TikTok 
              </a>
              <a href="https://instagram.com/broadoakschools" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram /> Instagram
              </a>
              <a href="https://linkedin.com/company/broadoakschools" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn /> LinkedIn
              </a>
              <a href="https://www.youtube.com/@thebroadoakschools" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube /> YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} The Broadoak Schools. All rights reserved.</p>
          <p style={{ marginTop: '8px' }}>
            Created by{' '}
            <a 
              href="https://bbaitech.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: 'var(--primary-yellow)', 
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              BB AI TECH SOLUTIONS
            </a>
          </p>
        </div>
      </footer>
    </main>
    </>
  );
};