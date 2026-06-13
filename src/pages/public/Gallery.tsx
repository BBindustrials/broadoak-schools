/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import { fetchPublicGallery, fetchGalleryByCategory, type GalleryImage } from '../../services/galleryService';
import { SEO } from '../../components/common/SEO';

const CATEGORIES = [
  'All',
  'Classroom Activities',
  'School Events',
  'Sports',
  'Excursions',
  'Graduation',
  'Innovation & Technology',
  'Awards',
  'Cultural Day',
];

export const GalleryPage = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const loadImages = async () => {
    try {
      setLoading(true);
      let data;
      if (selectedCategory === 'All') {
        data = await fetchPublicGallery();
      } else {
        data = await fetchGalleryByCategory(selectedCategory);
      }
      setImages(data || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [selectedCategory]);

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="loading-spinner" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading gallery...
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Gallery" 
        description="Explore our photo gallery and see the exciting moments at The Broadoak Schools."
        url="https://broadoakschools.com/gallery"
      />
    <main className="gallery-page">
      <section className="gallery-hero">
        <div className="container">
          <h1>Our Gallery</h1>
          <p>Capturing memories and moments at The Broadoak Schools</p>
        </div>
      </section>

      <section className="gallery-filter-section">
        <div className="container">
          <div className="gallery-filters">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-grid-section">
        <div className="container">
          {images.length === 0 ? (
            <div className="no-images">
              <p>No images found in this category.</p>
            </div>
          ) : (
            <div className="gallery-public-grid">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="gallery-item"
                  onClick={() => openLightbox(image)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <img src={image.image_url} alt={image.title} loading="lazy" />
                  <div className="gallery-item-overlay">
                    <div className="gallery-item-info">
                      <h3>{image.title}</h3>
                      <p>{image.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {isLightboxOpen && selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>✕</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.image_url} alt={selectedImage.title} />
            <div className="lightbox-info">
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.description}</p>
              <span className="lightbox-category">{selectedImage.category}</span>
            </div>
          </div>
        </div>
      )}
    </main>
      </>
  );
};