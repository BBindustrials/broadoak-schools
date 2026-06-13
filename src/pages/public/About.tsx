// Import images - place your images in src/assets/about/
import ceoPhoto from '../../assets/about/ceo.png';
import principalPhoto from '../../assets/about/principal.png';
import schoolBuilding from '../../assets/about/school-building.png';
import studentsLearning from '../../assets/about/students-learning.jpg';
import graduation from '../../assets/about/graduation.jpg';
import { SEO } from '../../components/common/SEO';

export const AboutPage = () => {
  return (
    <>
      <SEO 
        title="About Us" 
        description="Learn more about The Broadoak Schools, our vision, mission, and core values. Discover what makes us a leading educational institution in Owerri."
        url="https://broadoakschools.com/about"
      />
    <main className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>About The Broadoak Schools</h1>
          <p>Root to grow, wings to fly</p>
        </div>
      </section>

      <div className="container">
        {/* Vision & Mission Section */}
        <section className="vision-mission-section">
          <div className="vision-card">
            <div className="card-icon">👁️</div>
            <h2>Our Vision</h2>
            <p>To establish a secure and caring environment in which imagination is kindled and potential fulfilled. To achieve excellence through a holistic approach to the development of every aspect of the individual. Teaching and learning will be fun and rewarding.</p>
          </div>
          <div className="mission-card">
            <div className="card-icon">🎯</div>
            <h2>Our Mission</h2>
            <p>We want our learners to become self-confident but not arrogant, tolerant but not subservient, ambitious but not ruthless, determined yet not self-centred.</p>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="core-values-section">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">📚</div>
              <h3>Quality Learning</h3>
              <p>Commitment to academic excellence and continuous improvement</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Responsiveness</h3>
              <p>Adapting to the needs of our students and community</p>
            </div>
            <div className="value-card">
              <div className="value-icon">👥</div>
              <h3>Team Work</h3>
              <p>Collaboration between staff, students, and parents</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💬</div>
              <h3>Communication</h3>
              <p>Open and transparent dialogue with all stakeholders</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Creativity</h3>
              <p>Encouraging innovative thinking and problem-solving</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔍</div>
              <h3>Critical Thinking</h3>
              <p>Developing analytical and reasoning skills</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔬</div>
              <h3>Research</h3>
              <p>Fostering curiosity and evidence-based learning</p>
            </div>
          </div>
        </section>

        {/* History Section with Image */}
        <section className="history-section">
          <div className="history-grid">
            <div className="history-content">
              <h2>Our History</h2>
              <p>The Broadoak Schools was founded in year 2009 with a vision to provide world-class education that nurtures the total child – academically, socially, morally, and physically. Over the years, we have grown to become one of the most respected educational institutions in Imo State, known for our commitment to excellence and innovation.</p>
              <p>What started as a small nursery school has now expanded to include primary, junior secondary, and senior secondary sections, with state-of-the-art facilities and a team of dedicated educators.</p>
            </div>
            <div className="history-image">
              <img src={schoolBuilding} alt="The Broadoak Schools Building" />
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="philosophy-section">
          <div className="philosophy-grid">
            <div className="philosophy-image">
              <img src={studentsLearning} alt="Students learning at Broadoak" />
            </div>
            <div className="philosophy-content">
              <h2>Our Philosophy</h2>
              <p>We believe that every child is unique and possesses innate potential waiting to be unlocked. Our educational philosophy is rooted in the understanding that learning should be engaging, meaningful, and enjoyable. We blend traditional teaching methods with modern technology to create a dynamic learning environment.</p>
              <p>We are committed to developing the whole child - academically, socially, emotionally, and physically - preparing them not just for exams, but for life.</p>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="achievements-section">
          <h2>Our Achievements</h2>
          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-icon">🏆</div>
              <div className="achievement-value">15+</div>
              <h3>Years of Excellence</h3>
              <p>Years of providing quality education</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">👨‍🎓</div>
              <div className="achievement-value">1000+</div>
              <h3>Happy Students</h3>
              <p>Students enrolled and thriving</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">👩‍🏫</div>
              <div className="achievement-value">50+</div>
              <h3>Qualified Staff</h3>
              <p>Dedicated and experienced teachers</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">🎓</div>
              <div className="achievement-value">100%</div>
              <h3>Cambridge Certified</h3>
              <p>International curriculum standards</p>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="leadership-section">
          <h2>Our Leadership</h2>
          <div className="leadership-grid">
            {/* CEO / Proprietor */}
            <div className="leadership-card">
              <div className="leadership-image-wrapper">
                <img src={ceoPhoto} alt="Dr. Dame Nkeiruka Happiness Uhegbu" className="leadership-image" />
              </div>
              <h3>Dr. Dame Nkeiruka Happiness Uhegbu</h3>
              <p className="leadership-position">Founder / Chief Executive Officer</p>
              <div className="leadership-message">
                <p>"Education is the most powerful weapon which you can use to change the world. At The Broadoak Schools, we are committed to raising a generation of leaders who will excel academically, morally, and socially."</p>
              </div>
            </div>

            {/* Principal */}
            <div className="leadership-card">
              <div className="leadership-image-wrapper">
                <img src={principalPhoto} alt="Mr. Augustine Ogbaji Omaj" className="leadership-image" />
              </div>
              <h3>Mr. Augustine Ogbaji Omaj</h3>
              <p className="leadership-position">Principal / Head of School</p>
              <div className="leadership-message">
                <p>"Every child is unique and deserves an education that brings out their best. I am proud to lead a team of dedicated educators who work tirelessly to ensure that every student reaches their full potential."</p>
              </div>
            </div>
          </div>
        </section>

        {/* Graduation/Gallery Section */}
        <section className="gallery-section">
          <h2>Moments at Broadoak</h2>
          <div className="gallery-grid-about">
            <div className="gallery-item">
              <img src={graduation} alt="Graduation Ceremony" />
            </div>
            <div className="gallery-item">
              <img src={studentsLearning} alt="Classroom Activity" />
            </div>
          </div>
        </section>
      </div>
    </main>
    </>
  );
};