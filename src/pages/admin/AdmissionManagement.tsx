/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import {
  fetchAdmissionInfo,
  updateAdmissionInfo,
  createAdmissionInfo,
  uploadAdmissionDocument,
  type AdmissionInfo,
  type ProcessStep,
} from '../../services/admissionService';

const DEFAULT_PROCESS_STEPS: ProcessStep[] = [
  { step: 1, title: 'Make Enquiry', description: 'Contact our admissions office via phone, email, or visit the school for initial consultation.' },
  { step: 2, title: 'Get Admission Form', description: 'Purchase or download the admission form and complete all required sections.' },
  { step: 3, title: 'Submit Documents', description: 'Submit completed form along with all required supporting documents.' },
  { step: 4, title: 'Entrance Assessment', description: 'Student takes age-appropriate entrance examination and interview.' },
  { step: 5, title: 'Admission Decision', description: 'Decision communicated within 5-7 business days via email/phone.' },
  { step: 6, title: 'Payment & Registration', description: 'Complete payment of fees and secure your child\'s placement.' },
];

const DEFAULT_REQUIREMENTS = [
  'Birth certificate (original and photocopy)',
  'Previous school records/report cards (last 2 years)',
  'Passport photographs (8 copies)',
  'Immunization/medical records',
  'Transfer certificate (for transfer students)',
  'Parent/Guardian identification documents',
];

const DEFAULT_CLASSES = [
  'Early Years (Ages 2-5)',
  'Primary School (Grades 1-6)',
  'Junior Secondary (JSS 1-3)',
  'Senior Secondary (SSS 1-3)',
];

export const AdmissionManagement = () => {
  const [admissionInfo, setAdmissionInfo] = useState<AdmissionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: 'Admissions Open 2024/2025',
    description: 'We are now accepting applications for the upcoming academic session. Give your child the gift of quality education with a global perspective.',
    requirements: DEFAULT_REQUIREMENTS,
    available_classes: DEFAULT_CLASSES,
    admission_form_url: '',
    fees_document_url: '',
    deadline: '',
    contact_phone: '+234 803 750 3627',
    contact_email: 'admissions@broadoakschools.com',
    process_steps: DEFAULT_PROCESS_STEPS,
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [newClass, setNewClass] = useState('');
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [editingStep, setEditingStep] = useState({ title: '', description: '' });

  useEffect(() => {
    loadAdmissionInfo();
  }, []);

  const loadAdmissionInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdmissionInfo();
      if (data) {
        setAdmissionInfo(data);
        setFormData({
          title: data.title || 'Admissions Open 2024/2025',
          description: data.description || '',
          requirements: data.requirements || DEFAULT_REQUIREMENTS,
          available_classes: data.available_classes || DEFAULT_CLASSES,
          admission_form_url: data.admission_form_url || '',
          fees_document_url: data.fees_document_url || '',
          deadline: data.deadline || '',
          contact_phone: data.contact_phone || '+234 803 750 3627',
          contact_email: data.contact_email || 'admissions@broadoakschools.com',
          process_steps: data.process_steps || DEFAULT_PROCESS_STEPS,
        });
      }
    } catch (error) {
      console.error('Error loading admission info:', error);
      setError('Failed to load admission information');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'admission_form_url' | 'fees_document_url') => {
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

    setUploading(true);
    try {
      const folder = field === 'admission_form_url' ? 'admission-forms' : 'fee-documents';
      const url = await uploadAdmissionDocument(file, folder);
      setFormData({ ...formData, [field]: url });
      alert('Document uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement.trim()],
      });
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    const updated = [...formData.requirements];
    updated.splice(index, 1);
    setFormData({ ...formData, requirements: updated });
  };

  const addClass = () => {
    if (newClass.trim()) {
      setFormData({
        ...formData,
        available_classes: [...formData.available_classes, newClass.trim()],
      });
      setNewClass('');
    }
  };

  const removeClass = (index: number) => {
    const updated = [...formData.available_classes];
    updated.splice(index, 1);
    setFormData({ ...formData, available_classes: updated });
  };

  const startEditingStep = (index: number) => {
    setEditingStepIndex(index);
    setEditingStep({
      title: formData.process_steps[index].title,
      description: formData.process_steps[index].description,
    });
  };

  const saveEditingStep = () => {
    if (editingStepIndex !== null) {
      const updated = [...formData.process_steps];
      updated[editingStepIndex] = {
        ...updated[editingStepIndex],
        title: editingStep.title,
        description: editingStep.description,
      };
      setFormData({ ...formData, process_steps: updated });
      setEditingStepIndex(null);
      setEditingStep({ title: '', description: '' });
    }
  };

  const cancelEditingStep = () => {
    setEditingStepIndex(null);
    setEditingStep({ title: '', description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const admissionData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        available_classes: formData.available_classes,
        admission_form_url: formData.admission_form_url,
        fees_document_url: formData.fees_document_url,
        deadline: formData.deadline,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        process_steps: formData.process_steps,
      };

      console.log('Saving admission data:', admissionData);

      if (admissionInfo?.id) {
        const result = await updateAdmissionInfo(admissionInfo.id, admissionData);
        console.log('Update result:', result);
        alert('Admission information updated successfully!');
      } else {
        const result = await createAdmissionInfo(admissionData);
        console.log('Create result:', result);
        alert('Admission information created successfully!');
      }
      
      await loadAdmissionInfo();
    } catch (error: any) {
      console.error('Error saving admission info:', error);
      setError(error.message || 'Failed to save admission information. Please try again.');
      alert(`Failed to save: ${error.message || 'Please try again.'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-spinner">Loading admission information...</div>
      </div>
    );
  }

  return (
    <div className="management-container admission-management">
      <div className="management-header">
        <h1>🎓 Admissions Management</h1>
        <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: '20px' }}>
          ⚠️ {error}
        </div>
      )}

      <div className="admission-tabs">
        <button className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>
          Basic Info
        </button>
        <button className={`tab-btn ${activeTab === 'requirements' ? 'active' : ''}`} onClick={() => setActiveTab('requirements')}>
          Requirements & Classes
        </button>
        <button className={`tab-btn ${activeTab === 'steps' ? 'active' : ''}`} onClick={() => setActiveTab('steps')}>
          Admission Steps
        </button>
        <button className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
          Documents & Contact
        </button>
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="admission-tab-content">
          <div className="form-group">
            <label>Admission Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="form-control"
              placeholder="Describe the admission process and what makes your school special..."
            />
          </div>

          <div className="form-group">
            <label>Application Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="form-control"
            />
          </div>
        </div>
      )}

      {/* Requirements & Classes Tab */}
      {activeTab === 'requirements' && (
        <div className="admission-tab-content">
          <div className="form-section">
            <h3>Admission Requirements</h3>
            <div className="list-management">
              {formData.requirements.map((req, index) => (
                <div key={index} className="list-item">
                  <span>{req}</span>
                  <button type="button" className="remove-btn" onClick={() => removeRequirement(index)}>✕</button>
                </div>
              ))}
              <div className="add-item">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add new requirement"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                />
                <button type="button" onClick={addRequirement}>Add</button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Available Classes</h3>
            <div className="list-management">
              {formData.available_classes.map((cls, index) => (
                <div key={index} className="list-item">
                  <span>{cls}</span>
                  <button type="button" className="remove-btn" onClick={() => removeClass(index)}>✕</button>
                </div>
              ))}
              <div className="add-item">
                <input
                  type="text"
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  placeholder="Add new class"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addClass())}
                />
                <button type="button" onClick={addClass}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admission Steps Tab */}
      {activeTab === 'steps' && (
        <div className="admission-tab-content">
          <div className="steps-management">
            {formData.process_steps.map((step, index) => (
              <div key={step.step} className="step-edit-card">
                <div className="step-number">{step.step}</div>
                {editingStepIndex === index ? (
                  <div className="step-edit-form">
                    <input
                      type="text"
                      value={editingStep.title}
                      onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                      placeholder="Step title"
                    />
                    <textarea
                      value={editingStep.description}
                      onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
                      placeholder="Step description"
                      rows={3}
                    />
                    <div className="step-edit-actions">
                      <button type="button" onClick={saveEditingStep}>Save</button>
                      <button type="button" onClick={cancelEditingStep}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="step-display">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                    <button type="button" className="edit-step-btn" onClick={() => startEditingStep(index)}>
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents & Contact Tab */}
      {activeTab === 'documents' && (
        <div className="admission-tab-content">
          <div className="form-section">
            <h3>Admission Form</h3>
            <div className="document-upload">
              <input type="file" accept=".pdf" onChange={(e) => handleDocumentUpload(e, 'admission_form_url')} disabled={uploading} />
              {formData.admission_form_url && (
                <a href={formData.admission_form_url} target="_blank" rel="noopener noreferrer" className="file-link">
                  📄 View Current Admission Form
                </a>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>School Fees Document</h3>
            <div className="document-upload">
              <input type="file" accept=".pdf" onChange={(e) => handleDocumentUpload(e, 'fees_document_url')} disabled={uploading} />
              {formData.fees_document_url && (
                <a href={formData.fees_document_url} target="_blank" rel="noopener noreferrer" className="file-link">
                  📄 View Current Fees Document
                </a>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  type="text"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};