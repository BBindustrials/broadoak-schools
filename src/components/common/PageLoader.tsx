import { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';

interface PageLoaderProps {
  children: React.ReactNode;
}

export const PageLoader = ({ children }: PageLoaderProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate minimum loading time for smooth animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <img 
            src={logo} 
            alt="The Broadoak Schools Logo" 
            className="loading-logo pulse-animation"
          />
          <div className="loading-text">Preparing your experience...</div>
          <div className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};