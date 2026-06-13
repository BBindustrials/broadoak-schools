import { supabase } from '../integrations/supabase/client';

export interface StaffMember {
  id?: string;
  name: string;
  position: string;
  department: string;
  photo_url: string;
  bio: string;
  email: string;
  phone: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Fetch all staff members (admin)
export const fetchAllStaff = async (): Promise<StaffMember[]> => {
  try {
    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
};

// Fetch active staff members for public view
export const fetchActiveStaff = async (): Promise<StaffMember[]> => {
  try {
    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching active staff:', error);
    throw error;
  }
};

// Fetch staff by department
export const fetchStaffByDepartment = async (department: string): Promise<StaffMember[]> => {
  try {
    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .eq('department', department)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching staff by department:', error);
    throw error;
  }
};

// Upload staff photo
export const uploadStaffPhoto = async (file: File): Promise<string> => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = fileName;
    
    const { error: uploadError } = await supabase.storage
      .from('staff-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('staff-photos')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading staff photo:', error);
    throw error;
  }
};

// Create new staff member
export const createStaff = async (staffData: Omit<StaffMember, 'id' | 'created_at' | 'updated_at'>): Promise<StaffMember> => {
  try {
    const { data, error } = await supabase
      .from('staff_members')
      .insert([{
        name: staffData.name,
        position: staffData.position,
        department: staffData.department,
        photo_url: staffData.photo_url,
        bio: staffData.bio,
        email: staffData.email,
        phone: staffData.phone,
        display_order: staffData.display_order,
        is_active: staffData.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
};

// Update staff member
export const updateStaff = async (id: string, staffData: Partial<StaffMember>): Promise<StaffMember> => {
  try {
    const { data, error } = await supabase
      .from('staff_members')
      .update({
        ...staffData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating staff:', error);
    throw error;
  }
};

// Delete staff member
export const deleteStaff = async (id: string, photoUrl?: string): Promise<boolean> => {
  try {
    // Delete photo from storage if exists
    if (photoUrl) {
      const fileName = photoUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('staff-photos').remove([fileName]);
      }
    }
    
    // Delete from database
    const { error } = await supabase
      .from('staff_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting staff:', error);
    throw error;
  }
};

// Reorder staff members
export const reorderStaff = async (staffOrder: { id: string; display_order: number }[]): Promise<boolean> => {
  try {
    for (const item of staffOrder) {
      const { error } = await supabase
        .from('staff_members')
        .update({ display_order: item.display_order })
        .eq('id', item.id);
      
      if (error) throw error;
    }
    return true;
  } catch (error) {
    console.error('Error reordering staff:', error);
    throw error;
  }
};