/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import {
  fetchAllAcademicLevels,
  fetchAllClubs,
  createAcademicLevel,
  updateAcademicLevel,
  deleteAcademicLevel,
  createClub,
  updateClub,
  deleteClub,
  fetchAcademicResources,
  uploadResourceFile,
  createAcademicResource,
  deleteAcademicResource,
  type AcademicLevel,
  type Club,
  type AcademicResource,
} from '../../services/academicsService';

// Available icons for clubs
const CLUB_ICONS = ['🤖', '📚', '💃', '🥋', '⚽', '🍳', '🎵', '🗣️', '🎨', '🎭', '♟️', '🌱', '🧪', '📖', '🎮', '🏀'];

export const AcademicsManagement = () => {
  // State for data
  const [academicLevels, setAcademicLevels] = useState<AcademicLevel[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('levels');
  
  // Modal states
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<AcademicLevel | null>(null);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [editingResource, setEditingResource] = useState<AcademicResource | null>(null);
  
  // Form states
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Academic Level Form
  const [levelForm, setLevelForm] = useState({
    name: '',
    age_range: '',
    description: '',
    subjects: [''],
    features: [''],
    display_order: 0,
    is_active: true,
  });

  // Club Form
  const [clubForm, setClubForm] = useState({
    name: '',
    description: '',
    meeting_day: '',
    meeting_time: '',
    venue: '',
    coordinator: '',
    icon: '📚',
    display_order: 0,
    is_active: true,
  });

  // Resource Form
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    category: '',
    display_order: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [levelsData, clubsData, resourcesData] = await Promise.all([
        fetchAllAcademicLevels(),
        fetchAllClubs(),
        fetchAcademicResources(),
      ]);
      setAcademicLevels(levelsData || []);
      setClubs(clubsData || []);
      setResources(resourcesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load academics data');
    } finally {
      setLoading(false);
    }
  };

  // ==================== ACADEMIC LEVEL FUNCTIONS ====================
  const handleLevelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const levelData = {
        name: levelForm.name,
        age_range: levelForm.age_range,
        description: levelForm.description,
        subjects: levelForm.subjects.filter(s => s.trim()),
        features: levelForm.features.filter(f => f.trim()),
        display_order: levelForm.display_order,
        is_active: levelForm.is_active,
      };

      if (editingLevel) {
        await updateAcademicLevel(editingLevel.id!, levelData);
        alert('Academic level updated successfully!');
      } else {
        await createAcademicLevel(levelData);
        alert('Academic level created successfully!');
      }
      
      setIsLevelModalOpen(false);
      resetLevelForm();
      await loadData();
    } catch (error) {
      console.error('Error saving level:', error);
      alert('Failed to save academic level');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLevel = async (level: AcademicLevel) => {
    if (window.confirm(`Are you sure you want to delete "${level.name}"? This action cannot be undone.`)) {
      try {
        await deleteAcademicLevel(level.id!);
        alert('Academic level deleted successfully!');
        await loadData();
      } catch (error) {
        console.error('Error deleting level:', error);
        alert('Failed to delete academic level');
      }
    }
  };

  const resetLevelForm = () => {
    setLevelForm({
      name: '',
      age_range: '',
      description: '',
      subjects: [''],
      features: [''],
      display_order: 0,
      is_active: true,
    });
    setEditingLevel(null);
  };

  const openEditLevel = (level: AcademicLevel) => {
    setEditingLevel(level);
    setLevelForm({
      name: level.name,
      age_range: level.age_range || '',
      description: level.description || '',
      subjects: level.subjects?.length ? level.subjects : [''],
      features: level.features?.length ? level.features : [''],
      display_order: level.display_order || 0,
      is_active: level.is_active,
    });
    setIsLevelModalOpen(true);
  };

  // Array helpers for Level form
  const addArrayItem = (field: 'subjects' | 'features') => {
    setLevelForm({ ...levelForm, [field]: [...levelForm[field], ''] });
  };

  const updateArrayItem = (field: 'subjects' | 'features', index: number, value: string) => {
    const updated = [...levelForm[field]];
    updated[index] = value;
    setLevelForm({ ...levelForm, [field]: updated });
  };

  const removeArrayItem = (field: 'subjects' | 'features', index: number) => {
    const updated = [...levelForm[field]];
    updated.splice(index, 1);
    setLevelForm({ ...levelForm, [field]: updated });
  };

  // ==================== CLUB FUNCTIONS ====================
  const handleClubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const clubData = {
        name: clubForm.name,
        description: clubForm.description,
        meeting_day: clubForm.meeting_day,
        meeting_time: clubForm.meeting_time,
        venue: clubForm.venue,
        coordinator: clubForm.coordinator,
        icon: clubForm.icon,
        display_order: clubForm.display_order,
        is_active: clubForm.is_active,
      };

      if (editingClub) {
        await updateClub(editingClub.id!, clubData);
        alert('Club updated successfully!');
      } else {
        await createClub(clubData);
        alert('Club created successfully!');
      }
      
      setIsClubModalOpen(false);
      resetClubForm();
      await loadData();
    } catch (error) {
      console.error('Error saving club:', error);
      alert('Failed to save club');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClub = async (club: Club) => {
    if (window.confirm(`Are you sure you want to delete "${club.name}"? This action cannot be undone.`)) {
      try {
        await deleteClub(club.id!);
        alert('Club deleted successfully!');
        await loadData();
      } catch (error) {
        console.error('Error deleting club:', error);
        alert('Failed to delete club');
      }
    }
  };

  const resetClubForm = () => {
    setClubForm({
      name: '',
      description: '',
      meeting_day: '',
      meeting_time: '',
      venue: '',
      coordinator: '',
      icon: '📚',
      display_order: 0,
      is_active: true,
    });
    setEditingClub(null);
  };

  const openEditClub = (club: Club) => {
    setEditingClub(club);
    setClubForm({
      name: club.name,
      description: club.description || '',
      meeting_day: club.meeting_day || '',
      meeting_time: club.meeting_time || '',
      venue: club.venue || '',
      coordinator: club.coordinator || '',
      icon: club.icon || '📚',
      display_order: club.display_order || 0,
      is_active: club.is_active,
    });
    setIsClubModalOpen(true);
  };

  // ==================== RESOURCE FUNCTIONS ====================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resourceForm.title || !resourceForm.category) {
      alert('Please fill in title and category');
      return;
    }

    setSaving(true);
    setUploading(true);

    try {
      let fileUrl = '';
      if (selectedFile) {
        fileUrl = await uploadResourceFile(selectedFile);
      } else if (!editingResource) {
        alert('Please select a file to upload');
        setSaving(false);
        setUploading(false);
        return;
      }

      const resourceData = {
        title: resourceForm.title,
        description: resourceForm.description,
        file_url: fileUrl,
        category: resourceForm.category,
        display_order: resourceForm.display_order,
      };

      await createAcademicResource(resourceData);
      alert('Resource uploaded successfully!');
      
      setIsResourceModalOpen(false);
      resetResourceForm();
      setSelectedFile(null);
      await loadData();
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Failed to upload resource');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDeleteResource = async (resource: AcademicResource) => {
    if (window.confirm(`Are you sure you want to delete "${resource.title}"?`)) {
      try {
        await deleteAcademicResource(resource.id!, resource.file_url);
        alert('Resource deleted successfully!');
        await loadData();
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Failed to delete resource');
      }
    }
  };

  const resetResourceForm = () => {
    setResourceForm({
      title: '',
      description: '',
      category: '',
      display_order: 0,
    });
    setEditingResource(null);
    setSelectedFile(null);
  };

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-spinner">Loading academics data...</div>
      </div>
    );
  }

  return (
    <div className="management-container academics-management">
      <div className="management-header">
        <h1>📚 Academics Management</h1>
      </div>

      <div className="academics-tabs">
        <button className={`tab-btn ${activeTab === 'levels' ? 'active' : ''}`} onClick={() => setActiveTab('levels')}>
          Academic Levels
        </button>
        <button className={`tab-btn ${activeTab === 'clubs' ? 'active' : ''}`} onClick={() => setActiveTab('clubs')}>
          Clubs & Activities
        </button>
        <button className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>
          Learning Resources
        </button>
      </div>

      {/* ==================== ACADEMIC LEVELS TAB ==================== */}
      {activeTab === 'levels' && (
        <div className="academics-tab-content">
          <div className="section-header">
            <h2>Academic Levels</h2>
            <button className="btn-primary" onClick={() => setIsLevelModalOpen(true)}>
              + Add Academic Level
            </button>
          </div>

          {academicLevels.length === 0 ? (
            <div className="empty-state">
              <p>📚 No academic levels added yet</p>
              <p>Click "Add Academic Level" to start building your academics page.</p>
            </div>
          ) : (
            <div className="academic-levels-list">
              {academicLevels.map((level) => (
                <div key={level.id} className="academic-level-card">
                  <div className="level-header">
                    <div>
                      <h3>{level.name}</h3>
                      <p className="level-age">{level.age_range}</p>
                    </div>
                    <div className="level-status">
                      <span className={`status-badge ${level.is_active ? 'active' : 'inactive'}`}>
                        {level.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <p className="level-description">{level.description}</p>
                  
                  <div className="level-details-grid">
                    <div className="level-detail">
                      <strong>📖 Subjects:</strong>
                      <ul>
                        {level.subjects?.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>
                    <div className="level-detail">
                      <strong>✨ Features:</strong>
                      <ul>
                        {level.features?.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="level-actions">
                    <button className="edit-btn" onClick={() => openEditLevel(level)}>
                      ✏️ Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteLevel(level)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== CLUBS TAB ==================== */}
      {activeTab === 'clubs' && (
        <div className="academics-tab-content">
          <div className="section-header">
            <h2>Clubs & Activities</h2>
            <button className="btn-primary" onClick={() => setIsClubModalOpen(true)}>
              + Add Club
            </button>
          </div>

          {clubs.length === 0 ? (
            <div className="empty-state">
              <p>🎯 No clubs added yet</p>
              <p>Click "Add Club" to start building your clubs and activities.</p>
            </div>
          ) : (
            <div className="clubs-admin-grid">
              {clubs.map((club) => (
                <div key={club.id} className="club-admin-card">
                  <div className="club-icon-large">{club.icon}</div>
                  <div className="club-info">
                    <h3>{club.name}</h3>
                    <p>{club.description}</p>
                    <div className="club-meta">
                      <span>👥 Coordinator: {club.coordinator || 'TBD'}</span>
                      <span>📅 {club.meeting_day || 'TBD'} {club.meeting_time ? `at ${club.meeting_time}` : ''}</span>
                      <span>📍 {club.venue || 'TBD'}</span>
                    </div>
                    <div className="club-status">
                      <span className={`status-badge ${club.is_active ? 'active' : 'inactive'}`}>
                        {club.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="club-actions">
                    <button className="edit-btn" onClick={() => openEditClub(club)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteClub(club)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== RESOURCES TAB ==================== */}
      {activeTab === 'resources' && (
        <div className="academics-tab-content">
          <div className="section-header">
            <h2>Learning Resources</h2>
            <button className="btn-primary" onClick={() => setIsResourceModalOpen(true)}>
              + Add Resource
            </button>
          </div>

          {resources.length === 0 ? (
            <div className="empty-state">
              <p>📄 No learning resources added yet</p>
              <p>Click "Add Resource" to upload academic documents.</p>
            </div>
          ) : (
            <div className="resources-admin-list">
              {resources.map((resource) => (
                <div key={resource.id} className="resource-admin-card">
                  <div className="resource-icon">📄</div>
                  <div className="resource-info">
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    <span className="resource-category">{resource.category}</span>
                  </div>
                  <div className="resource-actions">
                    <a href={resource.file_url} target="_blank" rel="noopener noreferrer" className="view-btn">View</a>
                    <button className="delete-btn" onClick={() => handleDeleteResource(resource)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== ACADEMIC LEVEL MODAL ==================== */}
      {isLevelModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsLevelModalOpen(false); resetLevelForm(); }}>
          <div className="modal-container large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingLevel ? 'Edit Academic Level' : 'Add Academic Level'}</h2>
              <button className="modal-close" onClick={() => { setIsLevelModalOpen(false); resetLevelForm(); }}>✕</button>
            </div>
            <div className="modal-body-wrapper">
              <form onSubmit={handleLevelSubmit} className="modal-form">
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Level Name *</label>
                      <input type="text" value={levelForm.name} onChange={(e) => setLevelForm({ ...levelForm, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Age Range</label>
                      <input type="text" placeholder="e.g., Ages 2-5" value={levelForm.age_range} onChange={(e) => setLevelForm({ ...levelForm, age_range: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea value={levelForm.description} onChange={(e) => setLevelForm({ ...levelForm, description: e.target.value })} rows={3} />
                  </div>
                  <div className="form-group">
                    <label>Subjects</label>
                    {levelForm.subjects.map((item, index) => (
                      <div key={index} className="array-item">
                        <input type="text" value={item} onChange={(e) => updateArrayItem('subjects', index, e.target.value)} />
                        {levelForm.subjects.length > 1 && <button type="button" className="remove-btn" onClick={() => removeArrayItem('subjects', index)}>✕</button>}
                      </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addArrayItem('subjects')}>+ Add Subject</button>
                  </div>
                  <div className="form-group">
                    <label>Features</label>
                    {levelForm.features.map((item, index) => (
                      <div key={index} className="array-item">
                        <input type="text" value={item} onChange={(e) => updateArrayItem('features', index, e.target.value)} />
                        {levelForm.features.length > 1 && <button type="button" className="remove-btn" onClick={() => removeArrayItem('features', index)}>✕</button>}
                      </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addArrayItem('features')}>+ Add Feature</button>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Display Order</label>
                      <input type="number" value={levelForm.display_order} onChange={(e) => setLevelForm({ ...levelForm, display_order: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input type="checkbox" checked={levelForm.is_active} onChange={(e) => setLevelForm({ ...levelForm, is_active: e.target.checked })} />
                        <span>Active</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => { setIsLevelModalOpen(false); resetLevelForm(); }}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : (editingLevel ? 'Update' : 'Create')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CLUB MODAL ==================== */}
      {isClubModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsClubModalOpen(false); resetClubForm(); }}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClub ? 'Edit Club' : 'Add Club'}</h2>
              <button className="modal-close" onClick={() => { setIsClubModalOpen(false); resetClubForm(); }}>✕</button>
            </div>
            <div className="modal-body-wrapper">
              <form onSubmit={handleClubSubmit} className="modal-form">
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Club Name *</label>
                      <input type="text" value={clubForm.name} onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Icon</label>
                      <select value={clubForm.icon} onChange={(e) => setClubForm({ ...clubForm, icon: e.target.value })}>
                        {CLUB_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea value={clubForm.description} onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })} rows={3} />
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Meeting Day</label><input type="text" placeholder="e.g., Mondays" value={clubForm.meeting_day} onChange={(e) => setClubForm({ ...clubForm, meeting_day: e.target.value })} /></div>
                    <div className="form-group"><label>Meeting Time</label><input type="text" placeholder="e.g., 2:00 PM" value={clubForm.meeting_time} onChange={(e) => setClubForm({ ...clubForm, meeting_time: e.target.value })} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Venue</label><input type="text" placeholder="Meeting location" value={clubForm.venue} onChange={(e) => setClubForm({ ...clubForm, venue: e.target.value })} /></div>
                    <div className="form-group"><label>Coordinator</label><input type="text" placeholder="Staff name" value={clubForm.coordinator} onChange={(e) => setClubForm({ ...clubForm, coordinator: e.target.value })} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Display Order</label><input type="number" value={clubForm.display_order} onChange={(e) => setClubForm({ ...clubForm, display_order: parseInt(e.target.value) || 0 })} /></div>
                    <div className="form-group"><label className="checkbox-label"><input type="checkbox" checked={clubForm.is_active} onChange={(e) => setClubForm({ ...clubForm, is_active: e.target.checked })} /><span>Active</span></label></div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => { setIsClubModalOpen(false); resetClubForm(); }}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : (editingClub ? 'Update' : 'Create')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================== RESOURCE MODAL ==================== */}
      {isResourceModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsResourceModalOpen(false); resetResourceForm(); setSelectedFile(null); }}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Learning Resource</h2>
              <button className="modal-close" onClick={() => { setIsResourceModalOpen(false); resetResourceForm(); setSelectedFile(null); }}>✕</button>
            </div>
            <div className="modal-body-wrapper">
              <form onSubmit={handleResourceSubmit} className="modal-form">
                <div className="modal-body">
                  <div className="form-group"><label>Title *</label><input type="text" value={resourceForm.title} onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })} required /></div>
                  <div className="form-group"><label>Description</label><textarea value={resourceForm.description} onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })} rows={3} /></div>
                  <div className="form-row">
                    <div className="form-group"><label>Category *</label><select value={resourceForm.category} onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })} required><option value="">Select</option><option value="Curriculum">Curriculum</option><option value="Syllabus">Syllabus</option><option value="Past Questions">Past Questions</option><option value="Reading Materials">Reading Materials</option></select></div>
                    <div className="form-group"><label>Display Order</label><input type="number" value={resourceForm.display_order} onChange={(e) => setResourceForm({ ...resourceForm, display_order: parseInt(e.target.value) || 0 })} /></div>
                  </div>
                  <div className="form-group"><label>PDF File *</label><input type="file" accept=".pdf" onChange={handleFileSelect} required={!editingResource} />{uploading && <p className="uploading-text">Uploading...</p>}</div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => { setIsResourceModalOpen(false); resetResourceForm(); setSelectedFile(null); }}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving || uploading}>{saving ? 'Saving...' : 'Upload'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};