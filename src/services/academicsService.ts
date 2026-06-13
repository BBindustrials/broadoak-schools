import { supabase } from '../integrations/supabase/client';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface AcademicLevel {
  id?: string;
  name: string;
  age_range: string;
  description: string;
  subjects: string[];
  features: string[];
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Club {
  id?: string;
  name: string;
  description: string;
  meeting_day: string;
  meeting_time: string;
  venue: string;
  coordinator: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AcademicResource {
  id?: string;
  title: string;
  description: string;
  file_url: string;
  category: string;
  display_order: number;
  created_at?: string;
}

// ============================================
// ACADEMIC LEVELS CRUD OPERATIONS
// ============================================

// Fetch only active academic levels for public page
export const fetchAcademicLevels = async (): Promise<AcademicLevel[]> => {
  try {
    const { data, error } = await supabase
      .from('academic_levels')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching academic levels:', error);
    return [];
  }
};

// Fetch all academic levels for admin (including inactive)
export const fetchAllAcademicLevels = async (): Promise<AcademicLevel[]> => {
  try {
    const { data, error } = await supabase
      .from('academic_levels')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all academic levels:', error);
    return [];
  }
};

// Create new academic level
export const createAcademicLevel = async (data: Omit<AcademicLevel, 'id' | 'created_at' | 'updated_at'>): Promise<AcademicLevel> => {
  try {
    const { data: result, error } = await supabase
      .from('academic_levels')
      .insert([{
        name: data.name,
        age_range: data.age_range,
        description: data.description,
        subjects: data.subjects,
        features: data.features,
        display_order: data.display_order,
        is_active: data.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating academic level:', error);
    throw error;
  }
};

// Update academic level
export const updateAcademicLevel = async (id: string, data: Partial<AcademicLevel>): Promise<AcademicLevel> => {
  try {
    const { data: result, error } = await supabase
      .from('academic_levels')
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
    console.error('Error updating academic level:', error);
    throw error;
  }
};

// Delete academic level
export const deleteAcademicLevel = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('academic_levels')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting academic level:', error);
    throw error;
  }
};

// ============================================
// CLUBS CRUD OPERATIONS
// ============================================

// Fetch only active clubs for public page
export const fetchClubs = async (): Promise<Club[]> => {
  try {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return [];
  }
};

// Fetch all clubs for admin (including inactive)
export const fetchAllClubs = async (): Promise<Club[]> => {
  try {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all clubs:', error);
    return [];
  }
};

// Create new club
export const createClub = async (data: Omit<Club, 'id' | 'created_at' | 'updated_at'>): Promise<Club> => {
  try {
    const { data: result, error } = await supabase
      .from('clubs')
      .insert([{
        name: data.name,
        description: data.description,
        meeting_day: data.meeting_day,
        meeting_time: data.meeting_time,
        venue: data.venue,
        coordinator: data.coordinator,
        icon: data.icon,
        display_order: data.display_order,
        is_active: data.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating club:', error);
    throw error;
  }
};

// Update club
export const updateClub = async (id: string, data: Partial<Club>): Promise<Club> => {
  try {
    const { data: result, error } = await supabase
      .from('clubs')
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
    console.error('Error updating club:', error);
    throw error;
  }
};

// Delete club
export const deleteClub = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clubs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting club:', error);
    throw error;
  }
};

// ============================================
// ACADEMIC RESOURCES (Documents)
// ============================================

// Fetch all academic resources
export const fetchAcademicResources = async (): Promise<AcademicResource[]> => {
  try {
    const { data, error } = await supabase
      .from('academic_resources')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching academic resources:', error);
    return [];
  }
};

// Upload resource file to storage
export const uploadResourceFile = async (file: File): Promise<string> => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `academic-resources/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading resource file:', error);
    throw error;
  }
};

// Create new academic resource
export const createAcademicResource = async (data: Omit<AcademicResource, 'id' | 'created_at'>): Promise<AcademicResource> => {
  try {
    const { data: result, error } = await supabase
      .from('academic_resources')
      .insert([{
        title: data.title,
        description: data.description,
        file_url: data.file_url,
        category: data.category,
        display_order: data.display_order,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating academic resource:', error);
    throw error;
  }
};

// Delete academic resource
export const deleteAcademicResource = async (id: string, fileUrl?: string): Promise<boolean> => {
  try {
    // Delete file from storage if exists
    if (fileUrl) {
      const fileName = fileUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('documents').remove([`academic-resources/${fileName}`]);
      }
    }
    
    // Delete from database
    const { error } = await supabase
      .from('academic_resources')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting academic resource:', error);
    throw error;
  }
};