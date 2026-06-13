import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';  // Use NavLink, not Router
import schoolLogo from '../../assets/logo.png';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : 'transparent'}`}>
      <div className="nav-container">
        <Link to="/" className="logo">
          <img src={schoolLogo} alt="The Broadoak Schools" />
        </Link>
        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink></li>
          <li><NavLink to="/admissions" onClick={() => setIsMenuOpen(false)}>Admissions</NavLink></li>
          <li><NavLink to="/academics" onClick={() => setIsMenuOpen(false)}>Academics</NavLink></li>
          <li><NavLink to="/gallery" onClick={() => setIsMenuOpen(false)}>Gallery</NavLink></li>
          <li><NavLink to="/news" onClick={() => setIsMenuOpen(false)}>News</NavLink></li>
          <li><NavLink to="/events" onClick={() => setIsMenuOpen(false)}>Events</NavLink></li>
          <li><NavLink to="/student-life" onClick={() => setIsMenuOpen(false)}>Student Life</NavLink></li>
          <li><NavLink to="/staff" onClick={() => setIsMenuOpen(false)}>Staff</NavLink></li>
          <li><NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</NavLink></li>
          <li><NavLink to="/portal" onClick={() => setIsMenuOpen(false)}>Portal</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};