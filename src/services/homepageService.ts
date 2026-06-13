import { supabase } from '../integrations/supabase/client';

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  featured_image: string | null;
  content: string;
  author: string;
  status: string;
  published_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  venue: string;
  flyer_image: string | null;
  registration_link: string | null;
  status: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  category: string;
  description: string | null;
  is_featured: boolean;
  created_at: string;
}

/**
 * Fetch latest news posts for homepage
 */
export const fetchLatestNews = async (limit: number = 3): Promise<NewsItem[]> => {
  try {
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching news:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching news:', error);
    return [];
  }
};

/**
 * Fetch upcoming events for homepage
 */
export const fetchUpcomingEvents = async (limit: number = 3): Promise<EventItem[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'upcoming')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching events:', error);
    return [];
  }
};

/**
 * Fetch featured gallery images for homepage preview
 */
export const fetchFeaturedGallery = async (limit: number = 6): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching gallery:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching gallery:', error);
    return [];
  }
};

/**
 * Fetch single news post by slug
 */
export const fetchNewsBySlug = async (slug: string): Promise<NewsItem | null> => {
  try {
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching news post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching news post:', error);
    return null;
  }
};

/**
 * Fetch all news posts with pagination
 */
export const fetchAllNews = async (page: number = 1, pageSize: number = 10): Promise<{ data: NewsItem[]; count: number }> => {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('news_posts')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching all news:', error);
      return { data: [], count: 0 };
    }

    return { data: data || [], count: count || 0 };
  } catch (error) {
    console.error('Unexpected error fetching all news:', error);
    return { data: [], count: 0 };
  }
};

/**
 * Fetch all events
 */
export const fetchAllEvents = async (): Promise<EventItem[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching all events:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching all events:', error);
    return [];
  }
};

/**
 * Fetch single event by ID
 */
export const fetchEventById = async (id: string): Promise<EventItem | null> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching event:', error);
    return null;
  }
};

/**
 * Fetch all gallery images
 */
export const fetchAllGallery = async (): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching gallery:', error);
    return [];
  }
};

/**
 * Fetch gallery images by category
 */
export const fetchGalleryByCategory = async (category: string): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery by category:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching gallery by category:', error);
    return [];
  }
};