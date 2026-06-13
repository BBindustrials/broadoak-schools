/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import { 
  fetchAllNews, 
  createNews, 
  updateNews, 
  deleteNews, 
  uploadNewsImage,
  type NewsItem 
} from '../../services/newsService';
import { RichTextEditor } from '../../components/common/RichTextEditor';

export const NewsManagement = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    content: '',
    status: 'draft' as 'draft' | 'published',
    featured_image: '',
    featured_on_homepage: false,
    author: 'Admin',
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await fetchAllNews();
      setNews(data || []);
    } catch (error) {
      console.error('Error loading news:', error);
      alert('Failed to load news. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadNewsImage(file);
      setFormData({ ...formData, featured_image: imageUrl });
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.content) {
      alert('Please fill in all required fields (Title, Slug, Content)');
      return;
    }

    try {
      const newsData = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        content: formData.content,
        status: formData.status,
        featured_image: formData.featured_image,
        featured_on_homepage: formData.featured_on_homepage,
        author: formData.author,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      };

      if (editingItem && editingItem.id) {
        await updateNews(editingItem.id, newsData);
        alert('News updated successfully!');
      } else {
        await createNews(newsData);
        alert('News created successfully!');
      }
      
      setIsModalOpen(false);
      resetForm();
      await loadNews();
    } catch (error: any) {
      console.error('Error saving news:', error);
      alert(error.message || 'Failed to save news. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this news post? This action cannot be undone.')) {
      try {
        await deleteNews(id);
        alert('News deleted successfully!');
        await loadNews();
      } catch (error) {
        console.error('Error deleting news:', error);
        alert('Failed to delete news. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      category: '',
      content: '',
      status: 'draft',
      featured_image: '',
      featured_on_homepage: false,
      author: 'Admin',
    });
    setEditingItem(null);
    setPreviewMode(false);
  };

  const openEditModal = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      category: item.category || '',
      content: item.content,
      status: item.status as 'draft' | 'published',
      featured_image: item.featured_image || '',
      featured_on_homepage: item.featured_on_homepage || false,
      author: item.author || 'Admin',
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-spinner">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h1>📰 News Management</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Write New Article
        </button>
      </div>

      {news.length === 0 ? (
        <div className="empty-state">
          <p>📝 No articles yet</p>
          <p>Click "Write New Article" to create your first news post.</p>
        </div>
      ) : (
        <div className="news-grid">
          {news.map((item) => (
            <div key={item.id} className="news-card">
              {item.featured_on_homepage && (
                <div className="featured-badge">⭐ Featured</div>
              )}
              {item.featured_image && (
                <img src={item.featured_image} alt={item.title} className="news-card-image" />
              )}
              <div className="news-card-content">
                <div className="news-card-header">
                  <span className={`status-badge ${item.status}`}>{item.status}</span>
                  <span className="news-date">
                    {new Date(item.created_at || '').toLocaleDateString()}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p className="news-category">{item.category || 'General'}</p>
                <div className="news-card-actions">
                  <button className="edit-btn" onClick={() => openEditModal(item)}>
                    ✏️ Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(item.id!)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsModalOpen(false); resetForm(); }}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Article' : 'Create New Article'}</h2>
              <button className="modal-close" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                ✕
              </button>
            </div>

            <div className="modal-tabs">
              <button
                className={`tab-btn ${!previewMode ? 'active' : ''}`}
                onClick={() => setPreviewMode(false)}
              >
                ✏️ Write
              </button>
              <button
                className={`tab-btn ${previewMode ? 'active' : ''}`}
                onClick={() => setPreviewMode(true)}
              >
                👁️ Preview
              </button>
            </div>

            <div className="modal-body-wrapper">
              <form onSubmit={handleSubmit} className="modal-form">
                {!previewMode ? (
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        placeholder="Enter article title"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            title: e.target.value,
                            slug: generateSlug(e.target.value)
                          });
                        }}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Slug (URL) *</label>
                      <input
                        type="text"
                        placeholder="article-url-slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                        required
                      />
                      <small>thebroadoakschools.com/news/{formData.slug || 'article-url'}</small>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="">Select category</option>
                          <option value="School News">🏫 School News</option>
                          <option value="Academic">📚 Academic</option>
                          <option value="Events">🎉 Events</option>
                          <option value="Achievements">🏆 Achievements</option>
                          <option value="Announcements">📢 Announcements</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                        >
                          <option value="draft">📄 Draft</option>
                          <option value="published">🚀 Published</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.featured_on_homepage}
                          onChange={(e) => setFormData({ ...formData, featured_on_homepage: e.target.checked })}
                        />
                        <span>⭐ Feature this article on the homepage</span>
                      </label>
                      <small>Featured articles will appear in the "Latest News" section on the homepage</small>
                    </div>

                    <div className="form-group">
                      <label>Featured Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      {uploading && <p className="uploading-text">Uploading...</p>}
                      {formData.featured_image && (
                        <div className="image-preview">
                          <img src={formData.featured_image} alt="Featured" />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, featured_image: '' })}
                            className="remove-image"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Content *</label>
                      <RichTextEditor
                        content={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                        placeholder="Write your amazing article here... Use the toolbar to format text, add images, lists, and more."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="modal-body preview-body">
                    <div className="preview-container">
                      <div className="preview-header">
                        {formData.featured_image && (
                          <img src={formData.featured_image} alt="Featured" className="preview-featured-image" />
                        )}
                        <h1 className="preview-title">{formData.title || 'Untitled Article'}</h1>
                        <div className="preview-meta">
                          <span>📅 {new Date().toLocaleDateString()}</span>
                          <span>🏷️ {formData.category || 'Uncategorized'}</span>
                          <span>⭐ {formData.featured_on_homepage ? 'Featured on Homepage' : 'Not Featured'}</span>
                          <span>📊 {formData.status === 'published' ? 'Published' : 'Draft'}</span>
                        </div>
                      </div>
                      <div
                        className="preview-content"
                        dangerouslySetInnerHTML={{
                          __html: formData.content || '<p><em>No content yet. Start writing in the Write tab!</em></p>'
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={uploading}>
                    {uploading ? 'Saving...' : (editingItem ? 'Update Article' : 'Publish Article')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};