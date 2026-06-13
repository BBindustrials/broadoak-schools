/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import {
  fetchSiteSettings,
  updateSiteSettings,
  createSiteSettings,
  uploadLogo,
  uploadFavicon,
  deleteOldImage,
} from '../../services/siteSettingsService';
import type { SiteSettings as SiteSettingsType } from '../../services/siteSettingsService';

export const SiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [faviconPreview, setFaviconPreview] = useState<string>('');
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [selectedFavicon, setSelectedFavicon] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    school_name: 'The Broadoak Schools',
    school_logo: '',
    school_favicon: '',
    school_address: 'Plot 4 Federal Housing Estate, off MCC, Uratta Road, Owerri, Imo State, Nigeria',
    school_phone: '+234 803 750 3627',
    school_phone_alt: '+234 810 444 6168',
    school_email: 'info@broadoakschools.com',
    school_email_alt: 'admissions@broadoakschools.com',
    office_hours: 'Monday – Friday, 8:00 AM – 4:00 PM',
    facebook_url: 'https://facebook.com/broadoakschools',
    tiktok_url: 'https://tiktok.com/thebroadoakschoolsowerri',
    instagram_url: 'https://instagram.com/broadoakschools',
    linkedin_url: 'https://linkedin.com/company/broadoakschools',
    youtube_url: 'https://youtube.com/thebroadoakschools',
    footer_text: '© The Broadoak Schools. All rights reserved.',
    primary_color: '#1a3a6b',
    secondary_color: '#c41e3a',
    accent_color: '#f4c542',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await fetchSiteSettings();
      if (data) {
        setSettings(data);
        setFormData({
          school_name: data.school_name || 'The Broadoak Schools',
          school_logo: data.school_logo || '',
          school_favicon: data.school_favicon || '',
          school_address: data.school_address || '',
          school_phone: data.school_phone || '',
          school_phone_alt: data.school_phone_alt || '',
          school_email: data.school_email || '',
          school_email_alt: data.school_email_alt || '',
          office_hours: data.office_hours || '',
          facebook_url: data.facebook_url || '',
          tiktok_url: data.tiktok_url || '',
          instagram_url: data.instagram_url || '',
          linkedin_url: data.linkedin_url || '',
          youtube_url: data.youtube_url || '',
          footer_text: data.footer_text || '',
          primary_color: data.primary_color || '#1a3a6b',
          secondary_color: data.secondary_color || '#c41e3a',
          accent_color: data.accent_color || '#f4c542',
        });
        setLogoPreview(data.school_logo);
        setFaviconPreview(data.school_favicon);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      alert('Failed to load site settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    setSelectedLogo(file);
    const preview = URL.createObjectURL(file);
    setLogoPreview(preview);
  };

  const handleFaviconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 500 * 1024) {
      alert('Favicon size should be less than 500KB');
      return;
    }

    setSelectedFavicon(file);
    const preview = URL.createObjectURL(file);
    setFaviconPreview(preview);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setUploading(true);

    try {
      let logoUrl = formData.school_logo;
      let faviconUrl = formData.school_favicon;

      if (selectedLogo) {
        if (logoUrl && logoUrl !== formData.school_logo) {
          await deleteOldImage(logoUrl);
        }
        logoUrl = await uploadLogo(selectedLogo);
      }

      if (selectedFavicon) {
        if (faviconUrl) {
          await deleteOldImage(faviconUrl);
        }
        faviconUrl = await uploadFavicon(selectedFavicon);
      }

      const settingsData = {
        ...formData,
        school_logo: logoUrl,
        school_favicon: faviconUrl,
      };

      if (settings?.id) {
        await updateSiteSettings(settings.id, settingsData);
        alert('Site settings updated successfully!');
      } else {
        await createSiteSettings(settingsData);
        alert('Site settings created successfully!');
      }
      
      await loadSettings();
      setSelectedLogo(null);
      setSelectedFavicon(null);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save site settings');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleColorChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-spinner">Loading site settings...</div>
      </div>
    );
  }

  return (
    <div className="management-container site-settings-container">
      <div className="management-header">
        <h1>⚙️ Site Settings</h1>
        <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="settings-tabs">
        <button className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>
          General
        </button>
        <button className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>
          Contact Info
        </button>
        <button className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`} onClick={() => setActiveTab('social')}>
          Social Media
        </button>
        <button className={`tab-btn ${activeTab === 'colors' ? 'active' : ''}`} onClick={() => setActiveTab('colors')}>
          Colors & Branding
        </button>
        <button className={`tab-btn ${activeTab === 'footer' ? 'active' : ''}`} onClick={() => setActiveTab('footer')}>
          Footer
        </button>
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="settings-tab-content">
          <div className="form-section">
            <h3>School Information</h3>
            
            <div className="form-group">
              <label>School Name</label>
              <input
                type="text"
                value={formData.school_name}
                onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>School Logo</label>
              <input type="file" accept="image/*" onChange={handleLogoSelect} disabled={uploading} />
              {logoPreview && (
                <div className="logo-preview">
                  <img src={logoPreview} alt="Logo Preview" />
                  <p className="preview-note">Current logo preview</p>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Favicon (Browser Tab Icon)</label>
              <input type="file" accept="image/*" onChange={handleFaviconSelect} disabled={uploading} />
              {faviconPreview && (
                <div className="favicon-preview">
                  <img src={faviconPreview} alt="Favicon Preview" width="32" height="32" />
                  <p className="preview-note">Current favicon preview</p>
                </div>
              )}
              <small>Recommended size: 32x32 or 64x64 pixels</small>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info Tab */}
      {activeTab === 'contact' && (
        <div className="settings-tab-content">
          <div className="form-section">
            <h3>Address & Hours</h3>
            
            <div className="form-group">
              <label>School Address</label>
              <textarea
                value={formData.school_address}
                onChange={(e) => setFormData({ ...formData, school_address: e.target.value })}
                rows={3}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Office Hours</label>
              <input
                type="text"
                value={formData.office_hours}
                onChange={(e) => setFormData({ ...formData, office_hours: e.target.value })}
                className="form-control"
                placeholder="e.g., Monday – Friday, 8:00 AM – 4:00 PM"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Primary Phone</label>
                <input
                  type="text"
                  value={formData.school_phone}
                  onChange={(e) => setFormData({ ...formData, school_phone: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Secondary Phone</label>
                <input
                  type="text"
                  value={formData.school_phone_alt}
                  onChange={(e) => setFormData({ ...formData, school_phone_alt: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Primary Email</label>
                <input
                  type="email"
                  value={formData.school_email}
                  onChange={(e) => setFormData({ ...formData, school_email: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Secondary Email</label>
                <input
                  type="email"
                  value={formData.school_email_alt}
                  onChange={(e) => setFormData({ ...formData, school_email_alt: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div className="settings-tab-content">
          <div className="form-section">
            <h3>Social Media Links</h3>
            
            <div className="form-group">
              <label>Facebook URL</label>
              <input
                type="url"
                value={formData.facebook_url}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                className="form-control"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div className="form-group">
              <label>TikTok URL</label>
              <input
                type="url"
                value={formData.tiktok_url}
                onChange={(e) => setFormData({ ...formData, tiktok_url: e.target.value })}
                className="form-control"
                placeholder="https://tiktok.com/yourhandle"
              />
            </div>

            <div className="form-group">
              <label>Instagram URL</label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                className="form-control"
                placeholder="https://instagram.com/yourhandle"
              />
            </div>

            <div className="form-group">
              <label>LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="form-control"
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>

            <div className="form-group">
              <label>YouTube URL</label>
              <input
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                className="form-control"
                placeholder="https://youtube.com/c/yourchannel"
              />
            </div>
          </div>
        </div>
      )}

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="settings-tab-content">
          <div className="form-section">
            <h3>School Colors</h3>
            <p className="section-note">These colors will be used throughout the website</p>
            
            <div className="color-preview-grid">
              <div className="color-preview-item">
                <div className="color-box" style={{ backgroundColor: formData.primary_color }}></div>
                <div className="form-group">
                  <label>Primary Color (Blue)</label>
                  <input
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => handleColorChange('primary_color', e.target.value)}
                    className="color-input"
                  />
                  <input
                    type="text"
                    value={formData.primary_color}
                    onChange={(e) => handleColorChange('primary_color', e.target.value)}
                    className="color-hex"
                  />
                </div>
              </div>

              <div className="color-preview-item">
                <div className="color-box" style={{ backgroundColor: formData.secondary_color }}></div>
                <div className="form-group">
                  <label>Secondary Color (Red)</label>
                  <input
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                    className="color-input"
                  />
                  <input
                    type="text"
                    value={formData.secondary_color}
                    onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                    className="color-hex"
                  />
                </div>
              </div>

              <div className="color-preview-item">
                <div className="color-box" style={{ backgroundColor: formData.accent_color }}></div>
                <div className="form-group">
                  <label>Accent Color (Yellow)</label>
                  <input
                    type="color"
                    value={formData.accent_color}
                    onChange={(e) => handleColorChange('accent_color', e.target.value)}
                    className="color-input"
                  />
                  <input
                    type="text"
                    value={formData.accent_color}
                    onChange={(e) => handleColorChange('accent_color', e.target.value)}
                    className="color-hex"
                  />
                </div>
              </div>
            </div>

            <div className="color-preview-section">
              <h4>Live Preview</h4>
              <div className="color-preview-buttons">
                <button style={{ backgroundColor: formData.primary_color, color: 'white' }}>Primary Button</button>
                <button style={{ backgroundColor: formData.secondary_color, color: 'white' }}>Secondary Button</button>
                <button style={{ backgroundColor: formData.accent_color, color: formData.primary_color }}>Accent Button</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Tab */}
      {activeTab === 'footer' && (
        <div className="settings-tab-content">
          <div className="form-section">
            <h3>Footer Settings</h3>
            
            <div className="form-group">
              <label>Footer Text</label>
              <textarea
                value={formData.footer_text}
                onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                rows={3}
                className="form-control"
                placeholder="© The Broadoak Schools. All rights reserved."
              />
              <small>HTML tags are allowed (e.g., &lt;br&gt;, &lt;a&gt;)</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteSettings;