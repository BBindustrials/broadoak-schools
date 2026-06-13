import { supabase } from '../integrations/supabase/client';

export interface SiteSettings {
  id?: string;
  school_name: string;
  school_logo: string;
  school_favicon: string;
  school_address: string;
  school_phone: string;
  school_phone_alt: string;
  school_email: string;
  school_email_alt: string;
  office_hours: string;
  facebook_url: string;
  tiktok_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
  footer_text: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch site settings
export const fetchSiteSettings = async (): Promise<SiteSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
};

// Update site settings
export const updateSiteSettings = async (id: string, settings: Partial<SiteSettings>): Promise<SiteSettings> => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating site settings:', error);
    throw error;
  }
};

// Create initial site settings
export const createSiteSettings = async (settings: Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>): Promise<SiteSettings> => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .insert([{
        ...settings,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating site settings:', error);
    throw error;
  }
};

// Upload logo image
export const uploadLogo = async (file: File): Promise<string> => {
  try {
    const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('site-assets')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
};

// Upload favicon
export const uploadFavicon = async (file: File): Promise<string> => {
  try {
    const fileName = `favicon-${Date.now()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('site-assets')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading favicon:', error);
    throw error;
  }
};

// Delete old image
export const deleteOldImage = async (imageUrl: string): Promise<void> => {
  try {
    const fileName = imageUrl.split('/').pop();
    if (fileName) {
      await supabase.storage.from('site-assets').remove([fileName]);
    }
  } catch (error) {
    console.error('Error deleting old image:', error);
  }
};