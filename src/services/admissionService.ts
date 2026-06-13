import { supabase } from '../integrations/supabase/client';

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface AdmissionInfo {
  id?: string;
  title: string;
  description: string;
  requirements: string[];
  available_classes: string[];
  admission_form_url: string;
  fees_document_url: string;
  deadline: string;
  contact_phone: string;
  contact_email: string;
  process_steps: ProcessStep[];
  created_at?: string;
  updated_at?: string;
}

// Fetch admission info (public)
export const fetchAdmissionInfo = async (): Promise<AdmissionInfo | null> => {
  try {
    const { data, error } = await supabase
      .from('admission_info')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching admission info:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error in fetchAdmissionInfo:', error);
    return null;
  }
};

// Update admission info (admin)
export const updateAdmissionInfo = async (id: string, admissionData: Partial<AdmissionInfo>): Promise<AdmissionInfo> => {
  try {
    const { data, error } = await supabase
      .from('admission_info')
      .update({
        title: admissionData.title,
        description: admissionData.description,
        requirements: admissionData.requirements,
        available_classes: admissionData.available_classes,
        admission_form_url: admissionData.admission_form_url,
        fees_document_url: admissionData.fees_document_url,
        deadline: admissionData.deadline,
        contact_phone: admissionData.contact_phone,
        contact_email: admissionData.contact_email,
        process_steps: admissionData.process_steps,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating admission info:', error);
    throw error;
  }
};

// Create initial admission info (if none exists)
export const createAdmissionInfo = async (admissionData: Omit<AdmissionInfo, 'id' | 'created_at' | 'updated_at'>): Promise<AdmissionInfo> => {
  try {
    const { data, error } = await supabase
      .from('admission_info')
      .insert([{
        title: admissionData.title,
        description: admissionData.description,
        requirements: admissionData.requirements,
        available_classes: admissionData.available_classes,
        admission_form_url: admissionData.admission_form_url,
        fees_document_url: admissionData.fees_document_url,
        deadline: admissionData.deadline,
        contact_phone: admissionData.contact_phone,
        contact_email: admissionData.contact_email,
        process_steps: admissionData.process_steps,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating admission info:', error);
    throw error;
  }
};

// Upload document to storage
export const uploadAdmissionDocument = async (file: File, folder: string): Promise<string> => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${folder}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};