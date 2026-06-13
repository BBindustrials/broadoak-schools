/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import {
  fetchAllStaff,
  uploadStaffPhoto,
  createStaff,
  updateStaff,
  deleteStaff,
  type StaffMember,
} from '../../services/staffService';

const DEPARTMENTS = [
  'Administration',
  'Leadership',
  'Teaching Staff',
  'Academic Support',
  'Administrative Staff',
  'Support Staff',
];

export const StaffManagement = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StaffMember | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    bio: '',
    email: '',
    phone: '',
    display_order: 0,
    is_active: true,
  });

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await fetchAllStaff();
      setStaff(data || []);
    } catch (error) {
      console.error('Error loading staff:', error);
      alert('Failed to load staff members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedFile(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position || !formData.department) {
      alert('Please fill in all required fields (Name, Position, Department)');
      return;
    }

    setUploading(true);

    try {
      let photoUrl = editingItem?.photo_url || '';

      if (selectedFile) {
        photoUrl = await uploadStaffPhoto(selectedFile);
      } else if (!editingItem) {
        alert('Please select a photo');
        setUploading(false);
        return;
      }

      const staffData = {
        name: formData.name,
        position: formData.position,
        department: formData.department,
        photo_url: photoUrl,
        bio: formData.bio,
        email: formData.email,
        phone: formData.phone,
        display_order: formData.display_order,
        is_active: formData.is_active,
      };

      if (editingItem && editingItem.id) {
        await updateStaff(editingItem.id, staffData);
        alert('Staff member updated successfully!');
      } else {
        await createStaff(staffData);
        alert('Staff member added successfully!');
      }
      
      setIsModalOpen(false);
      resetForm();
      await loadStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Failed to save staff member. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: StaffMember) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
      try {
        await deleteStaff(item.id!, item.photo_url);
        alert('Staff member deleted successfully!');
        await loadStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Failed to delete staff member. Please try again.');
      }
    }
  };

  const handleToggleActive = async (item: StaffMember) => {
    try {
      await updateStaff(item.id!, { is_active: !item.is_active });
      await loadStaff();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update staff status.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      department: '',
      bio: '',
      email: '',
      phone: '',
      display_order: 0,
      is_active: true,
    });
    setEditingItem(null);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const openEditModal = (item: StaffMember) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      position: item.position,
      department: item.department,
      bio: item.bio || '',
      email: item.email || '',
      phone: item.phone || '',
      display_order: item.display_order || 0,
      is_active: item.is_active,
    });
    if (item.photo_url) {
      setPreviewUrl(item.photo_url);
    }
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-spinner">Loading staff members...</div>
      </div>
    );
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h1>👥 Staff Management</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Add Staff Member
        </button>
      </div>

      {staff.length === 0 ? (
        <div className="empty-state">
          <p>👥 No staff members added yet</p>
          <p>Click "Add Staff Member" to start building your team directory.</p>
        </div>
      ) : (
        <div className="staff-admin-grid">
          {staff.map((item) => (
            <div key={item.id} className="staff-admin-card">
              <div className="staff-admin-photo">
                <img src={item.photo_url} alt={item.name} />
                <div className={`staff-status ${item.is_active ? 'active' : 'inactive'}`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="staff-admin-info">
                <h3>{item.name}</h3>
                <p className="staff-position">{item.position}</p>
                <p className="staff-department">{item.department}</p>
                <div className="staff-admin-actions">
                  <button className="edit-btn" onClick={() => openEditModal(item)}>
                    ✏️ Edit
                  </button>
                  <button 
                    className={`status-btn ${item.is_active ? 'deactivate' : 'activate'}`}
                    onClick={() => handleToggleActive(item)}
                  >
                    {item.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(item)}>
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
              <h2>{editingItem ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
              <button className="modal-close" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                ✕
              </button>
            </div>

            <div className="modal-body-wrapper">
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="modal-body">
                  {/* Photo Upload */}
                  <div className="form-group">
                    <label>Staff Photo *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={uploading}
                    />
                    {(previewUrl || editingItem?.photo_url) && (
                      <div className="staff-photo-preview">
                        <img src={previewUrl || editingItem?.photo_url} alt="Preview" />
                      </div>
                    )}
                    {uploading && <p className="uploading-text">Uploading...</p>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Position *</label>
                      <input
                        type="text"
                        placeholder="e.g., Vice Principal, Head Teacher"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Department *</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        required
                      >
                        <option value="">Select department</option>
                        {DEPARTMENTS.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Display Order</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      />
                      <small>Lower numbers appear first</small>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="text"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Biography</label>
                    <textarea
                      placeholder="Enter staff biography, qualifications, and achievements..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      />
                      <span>✓ Active (Visible on website)</span>
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={uploading}>
                    {uploading ? 'Saving...' : (editingItem ? 'Update Staff' : 'Add Staff')}
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