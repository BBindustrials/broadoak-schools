import { useState, useEffect } from 'react';

interface Slide {
  id: string;
  imageUrl: string;
  headline: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

interface AutoCarouselProps {
  slides: Slide[];
  interval?: number;
  autoPlay?: boolean;
}

export const AutoCarousel = ({ slides, interval = 5000, autoPlay = true }: AutoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [slides.length, interval, autoPlay]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="custom-carousel">
      <div className="carousel-slide">
        <img src={slides[currentIndex].imageUrl} alt={slides[currentIndex].headline} />
        <div className="carousel-caption">
          <h1>{slides[currentIndex].headline}</h1>
          <p>{slides[currentIndex].subtitle}</p>
          <a href={slides[currentIndex].buttonLink} className="btn-primary">
            {slides[currentIndex].buttonText}
          </a>
        </div>
      </div>
      
      <button className="carousel-arrow prev" onClick={goToPrevious}>❮</button>
      <button className="carousel-arrow next" onClick={goToNext}>❯</button>
      
      <div className="carousel-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
};