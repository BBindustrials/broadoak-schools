/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import {
  fetchStudentLifeSettings,
  updateStudentLifeSettings,
  createStudentLifeSettings,
  type StudentLifeSettings,
} from '../../services/studentLifeService';

export const StudentLifeManagement = () => {
  const [settings, setSettings] = useState<StudentLifeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    hero_title: 'Student Life',
    hero_subtitle: 'Beyond the Classroom - Growing Character, Building Futures',
    quote_text: '"Every student is encouraged to discover their passion, develop their talents, and become a well-rounded individual."',
    quote_author: 'The Broadoak Schools Philosophy',
    clubs_title: 'Clubs & Societies',
    clubs_subtitle: 'Discover your passion beyond the classroom',
    sports_title: 'Sports & Athletics',
    sports_subtitle: 'Building teamwork, discipline, and physical fitness',
    events_title: 'Annual Events Calendar',
    events_subtitle: 'Memorable moments throughout the school year',
    leadership_title: 'Leadership Development',
    gallery_title: 'Memories in Motion',
    gallery_subtitle: 'Capturing the vibrant spirit of student life',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await fetchStudentLifeSettings();
      if (data) {
        setSettings(data);
        setFormData({
          hero_title: data.hero_title || 'Student Life',
          hero_subtitle: data.hero_subtitle || 'Beyond the Classroom - Growing Character, Building Futures',
          quote_text: data.quote_text || '"Every student is encouraged to discover their passion...',
          quote_author: data.quote_author || 'The Broadoak Schools Philosophy',
          clubs_title: data.clubs_title || 'Clubs & Societies',
          clubs_subtitle: data.clubs_subtitle || 'Discover your passion beyond the classroom',
          sports_title: data.sports_title || 'Sports & Athletics',
          sports_subtitle: data.sports_subtitle || 'Building teamwork, discipline, and physical fitness',
          events_title: data.events_title || 'Annual Events Calendar',
          events_subtitle: data.events_subtitle || 'Memorable moments throughout the school year',
          leadership_title: data.leadership_title || 'Leadership Development',
          gallery_title: data.gallery_title || 'Memories in Motion',
          gallery_subtitle: data.gallery_subtitle || 'Capturing the vibrant spirit of student life',
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (settings?.id) {
        await updateStudentLifeSettings(settings.id, formData);
        alert('Student Life settings updated successfully!');
      } else {
        await createStudentLifeSettings(formData);
        alert('Student Life settings created successfully!');
      }
      await loadSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-spinner">Loading student life settings...</div>
      </div>
    );
  }

  return (
    <div className="management-container student-life-management">
      <div className="management-header">
        <h1>🎯 Student Life Management</h1>
        <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Hero Section */}
        <div className="form-section">
          <h3>Hero Section</h3>
          <div className="form-group">
            <label>Hero Title</label>
            <input
              type="text"
              value={formData.hero_title}
              onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Hero Subtitle</label>
            <input
              type="text"
              value={formData.hero_subtitle}
              onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

        {/* Quote Section */}
        <div className="form-section">
          <h3>Quote Section</h3>
          <div className="form-group">
            <label>Quote Text</label>
            <textarea
              value={formData.quote_text}
              onChange={(e) => setFormData({ ...formData, quote_text: e.target.value })}
              rows={3}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Quote Author</label>
            <input
              type="text"
              value={formData.quote_author}
              onChange={(e) => setFormData({ ...formData, quote_author: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

        {/* Clubs Section */}
        <div className="form-section">
          <h3>Clubs & Societies Section</h3>
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              value={formData.clubs_title}
              onChange={(e) => setFormData({ ...formData, clubs_title: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Section Subtitle</label>
            <input
              type="text"
              value={formData.clubs_subtitle}
              onChange={(e) => setFormData({ ...formData, clubs_subtitle: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

        {/* Sports Section */}
        <div className="form-section">
          <h3>Sports Section</h3>
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              value={formData.sports_title}
              onChange={(e) => setFormData({ ...formData, sports_title: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Section Subtitle</label>
            <input
              type="text"
              value={formData.sports_subtitle}
              onChange={(e) => setFormData({ ...formData, sports_subtitle: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

        {/* Events Section */}
        <div className="form-section">
          <h3>Events Section</h3>
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              value={formData.events_title}
              onChange={(e) => setFormData({ ...formData, events_title: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Section Subtitle</label>
            <input
              type="text"
              value={formData.events_subtitle}
              onChange={(e) => setFormData({ ...formData, events_subtitle: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

        {/* Leadership Section */}
        <div className="form-section">
          <h3>Leadership Section</h3>
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              value={formData.leadership_title}
              onChange={(e) => setFormData({ ...formData, leadership_title: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

        {/* Gallery Section */}
        <div className="form-section">
          <h3>Gallery Section</h3>
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              value={formData.gallery_title}
              onChange={(e) => setFormData({ ...formData, gallery_title: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Section Subtitle</label>
            <input
              type="text"
              value={formData.gallery_subtitle}
              onChange={(e) => setFormData({ ...formData, gallery_subtitle: e.target.value })}
              className="form-control"
            />
          </div>
        </div>
      </form>
    </div>
  );
};