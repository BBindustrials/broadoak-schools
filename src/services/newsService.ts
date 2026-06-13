import { supabase } from '../integrations/supabase/client';

export interface NewsItem {
  id?: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  status: 'draft' | 'published';
  featured_image: string;
  featured_on_homepage: boolean;
  author: string;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Fetch all news posts (admin)
export const fetchAllNews = async () => {
  const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Fetch published news posts (public)
export const fetchPublishedNews = async () => {
  const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Fetch featured news for homepage
export const fetchFeaturedNews = async (limit: number = 3) => {
  const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .eq('status', 'published')
    .eq('featured_on_homepage', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

// Fetch single news post by slug
export const fetchNewsBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  return data;
};

// Fetch news by category
export const fetchNewsByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', category)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Create new news post
export const createNews = async (newsData: Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('news_posts')
    .insert([{
      ...newsData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update existing news post
export const updateNews = async (id: string, newsData: Partial<NewsItem>) => {
  const { data, error } = await supabase
    .from('news_posts')
    .update({
      ...newsData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete news post
export const deleteNews = async (id: string) => {
  const { error } = await supabase
    .from('news_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

// Upload image to storage
export const uploadNewsImage = async (file: File): Promise<string> => {
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = fileName;
  
  const { error: uploadError } = await supabase.storage
    .from('news-images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('news-images')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

// Delete image from storage
export const deleteNewsImage = async (imageUrl: string) => {
  const fileName = imageUrl.split('/').pop();
  if (!fileName) return;
  
  const { error } = await supabase.storage
    .from('news-images')
    .remove([fileName]);

  if (error) throw error;
  return true;
};