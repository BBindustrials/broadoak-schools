import { supabase } from '../integrations/supabase/client';

export interface StudentLifeSettings {
  id?: string;
  hero_title: string;
  hero_subtitle: string;
  quote_text: string;
  quote_author: string;
  clubs_title: string;
  clubs_subtitle: string;
  sports_title: string;
  sports_subtitle: string;
  events_title: string;
  events_subtitle: string;
  leadership_title: string;
  gallery_title: string;
  gallery_subtitle: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch student life settings
export const fetchStudentLifeSettings = async (): Promise<StudentLifeSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('student_life_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching student life settings:', error);
    return null;
  }
};

// Update student life settings
export const updateStudentLifeSettings = async (id: string, settingsData: Partial<StudentLifeSettings>): Promise<StudentLifeSettings> => {
  try {
    const { data, error } = await supabase
      .from('student_life_settings')
      .update({
        ...settingsData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating student life settings:', error);
    throw error;
  }
};

// Create initial settings
export const createStudentLifeSettings = async (settingsData: Omit<StudentLifeSettings, 'id' | 'created_at' | 'updated_at'>): Promise<StudentLifeSettings> => {
  try {
    const { data, error } = await supabase
      .from('student_life_settings')
      .insert([{
        ...settingsData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating student life settings:', error);
    throw error;
  }
};