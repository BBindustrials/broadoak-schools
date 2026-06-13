import { supabase } from '../integrations/supabase/client';

export interface AboutSection {
  id?: string;
  section_key: string;
  title: string;
  content: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Leadership {
  id?: string;
  name: string;
  position: string;
  message: string;
  photo_url: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Achievement {
  id?: string;
  title: string;
  value: string;
  description: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CoreValue {
  id?: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// ABOUT SECTIONS (Text Content)
// ============================================

export const fetchAboutSections = async (): Promise<AboutSection[]> => {
  try {
    const { data, error } = await supabase
      .from('about_sections')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching about sections:', error);
    return [];
  }
};

export const fetchAllAboutSections = async (): Promise<AboutSection[]> => {
  try {
    const { data, error } = await supabase
      .from('about_sections')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all about sections:', error);
    return [];
  }
};

export const updateAboutSection = async (id: string, data: Partial<AboutSection>): Promise<AboutSection> => {
  try {
    const { data: result, error } = await supabase
      .from('about_sections')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error updating about section:', error);
    throw error;
  }
};

// ============================================
// LEADERSHIP (Proprietor, Principal, etc.)
// ============================================

export const fetchLeadership = async (): Promise<Leadership[]> => {
  try {
    const { data, error } = await supabase
      .from('leadership')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching leadership:', error);
    return [];
  }
};

export const fetchAllLeadership = async (): Promise<Leadership[]> => {
  try {
    const { data, error } = await supabase
      .from('leadership')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all leadership:', error);
    return [];
  }
};

export const createLeadership = async (data: Omit<Leadership, 'id' | 'created_at' | 'updated_at'>): Promise<Leadership> => {
  try {
    const { data: result, error } = await supabase
      .from('leadership')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating leadership:', error);
    throw error;
  }
};

export const updateLeadership = async (id: string, data: Partial<Leadership>): Promise<Leadership> => {
  try {
    const { data: result, error } = await supabase
      .from('leadership')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error updating leadership:', error);
    throw error;
  }
};

export const deleteLeadership = async (id: string, photoUrl?: string): Promise<boolean> => {
  try {
    if (photoUrl) {
      const fileName = photoUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('leadership-photos').remove([fileName]);
      }
    }
    
    const { error } = await supabase
      .from('leadership')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting leadership:', error);
    throw error;
  }
};

// ============================================
// ACHIEVEMENTS
// ============================================

export const fetchAchievements = async (): Promise<Achievement[]> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
};

export const fetchAllAchievements = async (): Promise<Achievement[]> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all achievements:', error);
    return [];
  }
};

export const createAchievement = async (data: Omit<Achievement, 'id' | 'created_at' | 'updated_at'>): Promise<Achievement> => {
  try {
    const { data: result, error } = await supabase
      .from('achievements')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating achievement:', error);
    throw error;
  }
};

export const updateAchievement = async (id: string, data: Partial<Achievement>): Promise<Achievement> => {
  try {
    const { data: result, error } = await supabase
      .from('achievements')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error updating achievement:', error);
    throw error;
  }
};

export const deleteAchievement = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting achievement:', error);
    throw error;
  }
};

// ============================================
// CORE VALUES
// ============================================

export const fetchCoreValues = async (): Promise<CoreValue[]> => {
  try {
    const { data, error } = await supabase
      .from('core_values')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching core values:', error);
    return [];
  }
};

export const fetchAllCoreValues = async (): Promise<CoreValue[]> => {
  try {
    const { data, error } = await supabase
      .from('core_values')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all core values:', error);
    return [];
  }
};

export const createCoreValue = async (data: Omit<CoreValue, 'id' | 'created_at' | 'updated_at'>): Promise<CoreValue> => {
  try {
    const { data: result, error } = await supabase
      .from('core_values')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating core value:', error);
    throw error;
  }
};

export const updateCoreValue = async (id: string, data: Partial<CoreValue>): Promise<CoreValue> => {
  try {
    const { data: result, error } = await supabase
      .from('core_values')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error updating core value:', error);
    throw error;
  }
};

export const deleteCoreValue = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('core_values')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting core value:', error);
    throw error;
  }
};

// Upload leadership photo
export const uploadLeadershipPhoto = async (file: File): Promise<string> => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('leadership-photos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('leadership-photos')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading leadership photo:', error);
    throw error;
  }
};