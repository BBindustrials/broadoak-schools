/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';

interface NewsPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  status: 'draft' | 'published';
  published_at: string;
  created_at: string;
}

interface FormData {
  title: string;
  content: string;
  status: 'draft' | 'published';
  featured_image: string;
}

export const NewsManager = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    status: 'draft',
    featured_image: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `news/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('website-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('website-assets')
        .getPublicUrl(filePath);

      setFormData({ ...formData, featured_image: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      if (editingPost) {
        const { error } = await supabase
          .from('news_posts')
          .update({
            title: formData.title,
            slug,
            content: formData.content,
            status: formData.status,
            featured_image: formData.featured_image,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingPost.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('news_posts')
          .insert({
            title: formData.title,
            slug,
            content: formData.content,
            status: formData.status,
            featured_image: formData.featured_image,
            author: 'Admin',
            published_at: formData.status === 'published' ? new Date().toISOString() : null,
          });
          
        if (error) throw error;
      }
      
      setShowModal(false);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const { error } = await supabase.from('news_posts').delete().eq('id', id);
        if (error) throw error;
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      content: '',
      status: 'draft',
      featured_image: '',
    });
  };

  const handleEdit = (post: NewsPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      status: post.status,
      featured_image: post.featured_image || '',
    });
    setShowModal(true);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="management-container">
      <div className="management-header">
        <h1>News Management</h1>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="add-btn">
          + Add News Post
        </button>
      </div>

      <div className="news-grid">
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>No news posts yet. Click "Add News Post" to create your first post.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="news-card">
              {post.featured_image && (
                <img src={post.featured_image} alt={post.title} className="news-card-image" />
              )}
              <div className="news-card-content">
                <div className="news-card-header">
                  <span className="news-date">{new Date(post.created_at).toLocaleDateString()}</span>
                  <span className={`status-badge ${post.status}`}>{post.status}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 100)}...</p>
                <div className="news-card-actions">
                  <button onClick={() => handleEdit(post)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(post.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingPost ? 'Edit News Post' : 'Add News Post'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter news title"
                />
              </div>

              <div className="form-group">
                <label>Featured Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={uploading}
                />
                {uploading && <p className="uploading-text">Uploading image...</p>}
                {formData.featured_image && (
                  <div className="image-preview">
                    <img src={formData.featured_image} alt="Preview" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featured_image: '' })}
                      className="remove-image"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  required
                  placeholder="Write your news content here..."
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">Save Post</button>
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};