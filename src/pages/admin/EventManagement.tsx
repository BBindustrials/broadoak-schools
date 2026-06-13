/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import {
  fetchAllEvents,
  uploadEventFlyer,
  createEvent,
  updateEvent,
  deleteEvent,
  type EventItem,
} from '../../services/eventService';

export const EventManagement = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    venue: '',
    registration_link: '',
    status: 'upcoming' as 'upcoming' | 'past' | 'cancelled',
    featured_on_homepage: false,
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchAllEvents();
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      alert('Failed to load events. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedFile(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.event_date || !formData.venue) {
      alert('Please fill in all required fields (Title, Event Date, Venue)');
      return;
    }

    setUploading(true);

    try {
      let flyerUrl = editingItem?.flyer_url || '';

      if (selectedFile) {
        flyerUrl = await uploadEventFlyer(selectedFile);
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        event_date: formData.event_date,
        event_time: formData.event_time,
        venue: formData.venue,
        flyer_url: flyerUrl,
        registration_link: formData.registration_link,
        status: formData.status,
        featured_on_homepage: formData.featured_on_homepage,
      };

      if (editingItem && editingItem.id) {
        await updateEvent(editingItem.id, eventData);
        alert('Event updated successfully!');
      } else {
        await createEvent(eventData);
        alert('Event created successfully!');
      }
      
      setIsModalOpen(false);
      resetForm();
      await loadEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: EventItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"? This action cannot be undone.`)) {
      try {
        await deleteEvent(item.id!, item.flyer_url);
        alert('Event deleted successfully!');
        await loadEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const handleStatusChange = async (item: EventItem, newStatus: 'upcoming' | 'past' | 'cancelled') => {
    try {
      await updateEvent(item.id!, { status: newStatus });
      await loadEvents();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update event status.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      event_time: '',
      venue: '',
      registration_link: '',
      status: 'upcoming',
      featured_on_homepage: false,
    });
    setEditingItem(null);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const openEditModal = (item: EventItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      event_date: item.event_date,
      event_time: item.event_time || '',
      venue: item.venue || '',
      registration_link: item.registration_link || '',
      status: item.status,
      featured_on_homepage: item.featured_on_homepage || false,
    });
    if (item.flyer_url) {
      setPreviewUrl(item.flyer_url);
    }
    setIsModalOpen(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'upcoming': return 'status-upcoming';
      case 'past': return 'status-past';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-spinner">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h1>📅 Event Management</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Create New Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>📅 No events scheduled yet</p>
          <p>Click "Create New Event" to start adding events.</p>
        </div>
      ) : (
        <div className="events-admin-list">
          {events.map((item) => (
            <div key={item.id} className="event-admin-card">
              {item.flyer_url && (
                <div className="event-admin-flyer">
                  <img src={item.flyer_url} alt={item.title} />
                </div>
              )}
              <div className="event-admin-info">
                <div className="event-admin-header">
                  <h3>{item.title}</h3>
                  <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                <div className="event-admin-details">
                  <p><strong>📅 Date:</strong> {formatDate(item.event_date)}</p>
                  {item.event_time && <p><strong>⏰ Time:</strong> {item.event_time}</p>}
                  <p><strong>📍 Venue:</strong> {item.venue}</p>
                  {item.registration_link && (
                    <p><strong>🔗 Registration:</strong> <a href={item.registration_link} target="_blank" rel="noopener noreferrer">{item.registration_link}</a></p>
                  )}
                </div>
                <div className="event-admin-actions">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item, e.target.value as any)}
                    className="status-select"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button className="edit-btn" onClick={() => openEditModal(item)}>
                    ✏️ Edit
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
              <h2>{editingItem ? 'Edit Event' : 'Create New Event'}</h2>
              <button className="modal-close" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                ✕
              </button>
            </div>

            <div className="modal-body-wrapper">
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="modal-body">
                  <div className="form-group">
                    <label>Event Title *</label>
                    <input
                      type="text"
                      placeholder="Enter event title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Enter event description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Event Date *</label>
                      <input
                        type="date"
                        value={formData.event_date}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Event Time</label>
                      <input
                        type="time"
                        value={formData.event_time}
                        onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Venue *</label>
                      <input
                        type="text"
                        placeholder="Event venue"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Registration Link (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.registration_link}
                      onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
                    />
                    <small>Link where users can register for this event</small>
                  </div>

                  <div className="form-group">
                    <label>Event Flyer Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={uploading}
                    />
                    {(previewUrl || editingItem?.flyer_url) && (
                      <div className="image-preview-large">
                        <img src={previewUrl || editingItem?.flyer_url} alt="Flyer preview" />
                      </div>
                    )}
                    {uploading && <p className="uploading-text">Uploading...</p>}
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.featured_on_homepage}
                        onChange={(e) => setFormData({ ...formData, featured_on_homepage: e.target.checked })}
                      />
                      <span>⭐ Feature this event on the homepage</span>
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={uploading}>
                    {uploading ? 'Saving...' : (editingItem ? 'Update Event' : 'Create Event')}
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