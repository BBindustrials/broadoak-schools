import { supabase } from '../integrations/supabase/client';

export interface GalleryImage {
  id?: string;
  image_url: string;
  title: string;
  description: string;
  category: string;
  is_featured: boolean;
  display_order: number;
  created_at?: string;
}

// Fetch all gallery images (admin)
export const fetchAllGallery = async (): Promise<GalleryImage[]> => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Fetch gallery images for public view
export const fetchPublicGallery = async (): Promise<GalleryImage[]> => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Fetch featured gallery images for homepage
export const fetchFeaturedGallery = async (limit: number = 6): Promise<GalleryImage[]> => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

// Fetch gallery images by category
export const fetchGalleryByCategory = async (category: string): Promise<GalleryImage[]> => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('category', category)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
};

// Upload single image to storage
export const uploadGalleryImage = async (file: File): Promise<string> => {
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = fileName;
  
  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('gallery')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

// Upload multiple images to storage
export const uploadMultipleGalleryImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = fileName;
    
    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  });

  return Promise.all(uploadPromises);
};

// Create single gallery image
export const createGalleryImage = async (imageData: Omit<GalleryImage, 'id' | 'created_at'>): Promise<GalleryImage> => {
  const { data, error } = await supabase
    .from('gallery_images')
    .insert([{
      ...imageData,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Create multiple gallery images
export const createMultipleGalleryImages = async (imagesData: Omit<GalleryImage, 'id' | 'created_at'>[]): Promise<GalleryImage[]> => {
  const imagesWithDates = imagesData.map(img => ({
    ...img,
    created_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from('gallery_images')
    .insert(imagesWithDates)
    .select();

  if (error) throw error;
  return data || [];
};

// Update gallery image
export const updateGalleryImage = async (id: string, imageData: Partial<GalleryImage>): Promise<GalleryImage> => {
  const { data, error } = await supabase
    .from('gallery_images')
    .update(imageData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete gallery image
export const deleteGalleryImage = async (id: string, imageUrl: string): Promise<boolean> => {
  const fileName = imageUrl.split('/').pop();
  if (fileName) {
    await supabase.storage.from('gallery').remove([fileName]);
  }
  
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};