/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPublishedNews, fetchNewsBySlug, fetchNewsByCategory, type NewsItem } from '../../services/newsService';

export const News = () => {
  const { slug } = useParams();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (slug) {
      loadSingleNews();
    } else {
      loadAllNews();
    }
  }, [slug, selectedCategory]);

  const loadAllNews = async () => {
    try {
      setLoading(true);
      let data;
      
      if (selectedCategory !== 'all') {
        data = await fetchNewsByCategory(selectedCategory);
      } else {
        data = await fetchPublishedNews();
      }
      
      setNewsList(data || []);

      // Extract unique categories
      const uniqueCategories = [...new Set((data || []).map(item => item.category).filter(Boolean))];
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSingleNews = async () => {
    try {
      setLoading(true);
      const data = await fetchNewsBySlug(slug!);
      setSelectedNews(data);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading news...
      </div>
    );
  }

  // Single News View
  if (slug && selectedNews) {
    return (
      <main className="news-single-page">
        <article className="news-single-container">
          <div className="container">
            <Link to="/news" className="back-link">← Back to News</Link>

            {selectedNews.featured_image && (
              <div className="news-single-featured">
                <img src={selectedNews.featured_image} alt={selectedNews.title} />
              </div>
            )}

            <div className="news-single-header">
              <div className="news-single-category">{selectedNews.category || 'General'}</div>
              <h1>{selectedNews.title}</h1>
              <div className="news-single-meta">
                <span>📅 {new Date(selectedNews.published_at || selectedNews.created_at || '').toLocaleDateString('en-NG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
                <span>✍️ By {selectedNews.author || 'Admin'}</span>
              </div>
            </div>

            <div
              className="news-single-content"
              dangerouslySetInnerHTML={{ __html: selectedNews.content }}
            />

            <div className="news-single-footer">
              <div className="share-buttons">
                <span>Share this article:</span>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
                <a href={`https://www.tiktok.com/share?url=${window.location.href}&text=${encodeURIComponent(selectedNews.title)}`} target="_blank" rel="noopener noreferrer">
                  TikTok
                </a>
                <a href={`https://wa.me/?text=${encodeURIComponent(selectedNews.title + ' - ' + window.location.href)}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </article>
      </main>
    );
  }

  // News List View
  return (
    <main className="news-page">
      <section className="news-hero">
        <div className="container">
          <h1>News & Updates</h1>
          <p>Stay informed with the latest happenings at The Broadoak Schools</p>
        </div>
      </section>

      <section className="news-content">
        <div className="container">
          <div className="news-layout">
            {/* Sidebar */}
            <aside className="news-sidebar">
              <div className="sidebar-widget">
                <h3>Categories</h3>
                <ul className="category-list">
                  <li>
                    <button
                      className={selectedCategory === 'all' ? 'active' : ''}
                      onClick={() => setSelectedCategory('all')}
                    >
                      All Posts ({newsList.length})
                    </button>
                  </li>
                  {categories.map(cat => (
                    <li key={cat}>
                      <button
                        className={selectedCategory === cat ? 'active' : ''}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat} ({newsList.filter(n => n.category === cat).length})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sidebar-widget">
                <h3>Quick Links</h3>
                <ul>
                  <li><Link to="/admissions">Admissions</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                  <li><Link to="/portal">Student Portal</Link></li>
                </ul>
              </div>
            </aside>

            {/* Main Content */}
            <div className="news-main">
              {newsList.length === 0 ? (
                <div className="no-news">
                  <p>No news articles found.</p>
                  <p>Check back soon for updates!</p>
                </div>
              ) : (
                <div className="news-list">
                  {newsList.map((item) => (
                    <article key={item.id} className="news-list-item">
                      {item.featured_image && (
                        <Link to={`/news/${item.slug}`} className="news-list-image">
                          <img src={item.featured_image} alt={item.title} />
                        </Link>
                      )}
                      <div className="news-list-content">
                        <div className="news-list-category">{item.category || 'General'}</div>
                        <h2>
                          <Link to={`/news/${item.slug}`}>{item.title}</Link>
                        </h2>
                        <div className="news-list-meta">
                          <span>📅 {new Date(item.published_at || item.created_at || '').toLocaleDateString('en-NG')}</span>
                          <span>✍️ {item.author || 'Admin'}</span>
                        </div>
                        <div
                          className="news-list-excerpt"
                          dangerouslySetInnerHTML={{
                            __html: item.content.substring(0, 200) + '...'
                          }}
                        />
                        <Link to={`/news/${item.slug}`} className="read-more">
                          Read More →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};