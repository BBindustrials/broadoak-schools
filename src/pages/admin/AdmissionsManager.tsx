/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';

interface AdmissionSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  updated_at: string;
}

export const AdmissionsManager = () => {
  const [settings, setSettings] = useState<AdmissionSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admission_info')
        .select('*');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (key: string, value: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('admission_info')
        .update({ setting_value: value, updated_at: new Date() })
        .eq('setting_key', key);

      if (error) throw error;
      
      setMessage('Admission information updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      fetchSettings();
    } catch (error) {
      setMessage('Error updating information');
    } finally {
      setSaving(false);
    }
  };

  const getSettingValue = (key: string) => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.setting_value || '';
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="management-container">
      <div className="management-header">
        <h1>Admissions Management</h1>
      </div>

      {message && <div className="success-message">{message}</div>}

      <div className="admissions-form">
        <div className="form-section">
          <h2>Admission Process</h2>
          <textarea
            value={getSettingValue('admission_process')}
            onChange={(e) => handleUpdate('admission_process', e.target.value)}
            rows={6}
            placeholder="Describe the admission process..."
            className="full-width-input"
          />
        </div>

        <div className="form-section">
          <h2>Admission Requirements</h2>
          <textarea
            value={getSettingValue('requirements')}
            onChange={(e) => handleUpdate('requirements', e.target.value)}
            rows={6}
            placeholder="List all admission requirements..."
            className="full-width-input"
          />
        </div>

        <div className="form-section">
          <h2>Available Classes</h2>
          <textarea
            value={getSettingValue('available_classes')}
            onChange={(e) => handleUpdate('available_classes', e.target.value)}
            rows={4}
            placeholder="List available classes and spots..."
            className="full-width-input"
          />
        </div>

        <div className="form-section">
          <h2>Admission Deadline</h2>
          <input
            type="date"
            value={getSettingValue('deadline')}
            onChange={(e) => handleUpdate('deadline', e.target.value)}
            className="full-width-input"
          />
        </div>

        <div className="form-section">
          <h2>Admission Contact Phone</h2>
          <input
            type="text"
            value={getSettingValue('contact_phone')}
            onChange={(e) => handleUpdate('contact_phone', e.target.value)}
            placeholder="+234 XXX XXX XXXX"
            className="full-width-input"
          />
        </div>

        <div className="form-section">
          <h2>Admission Contact Email</h2>
          <input
            type="email"
            value={getSettingValue('contact_email')}
            onChange={(e) => handleUpdate('contact_email', e.target.value)}
            placeholder="admissions@broadoakschools.com"
            className="full-width-input"
          />
        </div>
      </div>
    </div>
  );
};