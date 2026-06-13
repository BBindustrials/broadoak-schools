/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import {
  fetchAllGallery,
  uploadMultipleGalleryImages,
  createMultipleGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
  type GalleryImage,
} from '../../services/galleryService';

const CATEGORIES = [
  'Classroom Activities',
  'School Events',
  'Sports',
  'Excursions',
  'Graduation',
  'Innovation & Technology',
  'Awards',
  'Cultural Day',
];

type FormDataType = {
  title: string;
  description: string;
  category: string;
  is_featured: boolean;
  display_order: number;
};

type BatchImageType = {
  file: File;
  preview: string;
  title: string;
  description: string;
};

export const GalleryManagement = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  // Batch upload states
  const [batchFiles, setBatchFiles] = useState<BatchImageType[]>([]);
  const [batchCategory, setBatchCategory] = useState('');
  const [batchIsFeatured, setBatchIsFeatured] = useState(false);
  
  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    description: '',
    category: '',
    is_featured: false,
    display_order: 0,
  });

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await fetchAllGallery();
      setImages(data || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
      alert('Failed to load gallery. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
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

  // Handle batch file selection
  const handleBatchFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    const newBatchImages: BatchImageType[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension for default title
      description: '',
    }));

    setBatchFiles(prev => [...prev, ...newBatchImages]);
  };

  const updateBatchImageTitle = (index: number, title: string) => {
    const updated = [...batchFiles];
    updated[index].title = title;
    setBatchFiles(updated);
  };

  const updateBatchImageDescription = (index: number, description: string) => {
    const updated = [...batchFiles];
    updated[index].description = description;
    setBatchFiles(updated);
  };

  const removeBatchImage = (index: number) => {
    const updated = [...batchFiles];
    URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    setBatchFiles(updated);
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (batchFiles.length === 0) {
      alert('Please select at least one image');
      return;
    }

    if (!batchCategory) {
      alert('Please select a category for all images');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload all images to storage
      const files = batchFiles.map(bf => bf.file);
      const imageUrls = await uploadMultipleGalleryImages(files);
      
      setUploadProgress(50);

      // Create database entries for all images
      const imagesData = batchFiles.map((bf, index) => ({
        image_url: imageUrls[index],
        title: bf.title || `Image ${index + 1}`,
        description: bf.description,
        category: batchCategory,
        is_featured: batchIsFeatured,
        display_order: 0,
      }));

      await createMultipleGalleryImages(imagesData);
      
      setUploadProgress(100);
      alert(`${batchFiles.length} images uploaded successfully!`);
      
      setIsBatchModalOpen(false);
      resetBatchForm();
      await loadImages();
    } catch (error) {
      console.error('Error uploading batch:', error);
      alert('Failed to upload some images. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category) {
      alert('Please fill in all required fields (Title and Category)');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = editingItem?.image_url || '';

      if (selectedFile) {
        const { uploadGalleryImage } = await import('../../services/galleryService');
        imageUrl = await uploadGalleryImage(selectedFile);
      } else if (!editingItem) {
        alert('Please select an image to upload');
        setUploading(false);
        return;
      }

      const imageData = {
        image_url: imageUrl,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        is_featured: formData.is_featured,
        display_order: formData.display_order,
      };

      if (editingItem && editingItem.id) {
        await updateGalleryImage(editingItem.id, imageData);
        alert('Image updated successfully!');
      } else {
        const { createGalleryImage } = await import('../../services/galleryService');
        await createGalleryImage(imageData);
        alert('Image added to gallery successfully!');
      }
      
      setIsModalOpen(false);
      resetForm();
      await loadImages();
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: GalleryImage) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"? This action cannot be undone.`)) {
      try {
        await deleteGalleryImage(item.id!, item.image_url);
        alert('Image deleted successfully!');
        await loadImages();
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image. Please try again.');
      }
    }
  };

  const handleToggleFeatured = async (item: GalleryImage) => {
    try {
      await updateGalleryImage(item.id!, { is_featured: !item.is_featured });
      await loadImages();
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('Failed to update featured status.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      is_featured: false,
      display_order: 0,
    });
    setEditingItem(null);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const resetBatchForm = () => {
    batchFiles.forEach(bf => URL.revokeObjectURL(bf.preview));
    setBatchFiles([]);
    setBatchCategory('');
    setBatchIsFeatured(false);
  };

  const openEditModal = (item: GalleryImage) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category,
      is_featured: item.is_featured,
      display_order: item.display_order || 0,
    });
    setPreviewUrl(item.image_url);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-spinner">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h1>🖼️ Gallery Management</h1>
        <div className="header-buttons">
          <button className="btn-secondary" onClick={() => setIsBatchModalOpen(true)}>
            📸 Batch Upload (Multiple)
          </button>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + Add Single Image
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="empty-state">
          <p>🖼️ No images in gallery yet</p>
          <p>Click "Add Single Image" or "Batch Upload" to start building your gallery.</p>
        </div>
      ) : (
        <>
          <div className="gallery-stats">
            <span>Total Images: {images.length}</span>
            <span>Featured: {images.filter(i => i.is_featured).length}</span>
          </div>
          <div className="gallery-admin-grid">
            {images.map((item) => (
              <div key={item.id} className="gallery-admin-card">
                <img src={item.image_url} alt={item.title} className="gallery-admin-image" />
                <div className="gallery-admin-overlay">
                  <div className="gallery-admin-info">
                    <h4>{item.title}</h4>
                    <p className="gallery-admin-category">{item.category}</p>
                  </div>
                  <div className="gallery-admin-actions">
                    <button
                      className={`featured-btn ${item.is_featured ? 'active' : ''}`}
                      onClick={() => handleToggleFeatured(item)}
                      title={item.is_featured ? 'Remove from homepage' : 'Feature on homepage'}
                    >
                      {item.is_featured ? '⭐ Featured' : '☆ Feature'}
                    </button>
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
        </>
      )}

      {/* Single Image Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsModalOpen(false); resetForm(); }}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Image' : 'Add New Image'}</h2>
              <button className="modal-close" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                ✕
              </button>
            </div>

            <div className="modal-body-wrapper">
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="modal-body">
                  <div className="form-group">
                    <label>{editingItem ? 'Change Image (Optional)' : 'Upload Image *'}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={uploading}
                    />
                    {(previewUrl || editingItem?.image_url) && (
                      <div className="image-preview-large">
                        <img src={previewUrl || editingItem?.image_url} alt="Preview" />
                      </div>
                    )}
                    {uploading && <p className="uploading-text">Uploading...</p>}
                  </div>

                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      placeholder="Enter image title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Enter image description (optional)"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        <option value="">Select category</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
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

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      />
                      <span>⭐ Feature this image on the homepage</span>
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={uploading}>
                    {uploading ? 'Saving...' : (editingItem ? 'Update Image' : 'Add to Gallery')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Batch Upload Modal */}
      {isBatchModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsBatchModalOpen(false); resetBatchForm(); }}>
          <div className="modal-container batch-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📸 Batch Upload Multiple Images</h2>
              <button className="modal-close" onClick={() => { setIsBatchModalOpen(false); resetBatchForm(); }}>
                ✕
              </button>
            </div>

            <div className="modal-body-wrapper">
              <form onSubmit={handleBatchSubmit} className="modal-form">
                <div className="modal-body">
                  <div className="form-group">
                    <label>Select Images (Multiple)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleBatchFileSelect}
                      disabled={uploading}
                      className="batch-file-input"
                    />
                    <small>You can select multiple images at once. Max 5MB per image.</small>
                  </div>

                  {batchFiles.length > 0 && (
                    <>
                      <div className="form-group">
                        <label>Category for All Images *</label>
                        <select
                          value={batchCategory}
                          onChange={(e) => setBatchCategory(e.target.value)}
                          required
                        >
                          <option value="">Select category</option>
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={batchIsFeatured}
                            onChange={(e) => setBatchIsFeatured(e.target.checked)}
                          />
                          <span>⭐ Feature all these images on the homepage</span>
                        </label>
                      </div>

                      <div className="batch-images-preview">
                        <h3>Images to Upload ({batchFiles.length})</h3>
                        <div className="batch-images-grid">
                          {batchFiles.map((bf, index) => (
                            <div key={index} className="batch-image-item">
                              <img src={bf.preview} alt={`Preview ${index}`} />
                              <button
                                type="button"
                                className="remove-batch-image"
                                onClick={() => removeBatchImage(index)}
                              >
                                ✕
                              </button>
                              <input
                                type="text"
                                placeholder="Title"
                                value={bf.title}
                                onChange={(e) => updateBatchImageTitle(index, e.target.value)}
                                className="batch-image-title"
                              />
                              <textarea
                                placeholder="Description (optional)"
                                value={bf.description}
                                onChange={(e) => updateBatchImageDescription(index, e.target.value)}
                                className="batch-image-description"
                                rows={2}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {uploading && (
                    <div className="upload-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <p>Uploading... {uploadProgress}%</p>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => { setIsBatchModalOpen(false); resetBatchForm(); }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={uploading || batchFiles.length === 0 || !batchCategory}>
                    {uploading ? `Uploading ${batchFiles.length} Images...` : `Upload ${batchFiles.length} Images`}
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