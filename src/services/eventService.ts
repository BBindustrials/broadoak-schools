/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '../integrations/supabase/client';

export interface EventItem {
  id?: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  venue: string;
  flyer_url: string;
  registration_link: string;
  status: 'upcoming' | 'past' | 'cancelled';
  featured_on_homepage: boolean;
  created_at?: string;
  updated_at?: string;
}

// Fetch all events (admin)
export const fetchAllEvents = async (): Promise<EventItem[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error in fetchAllEvents:', error);
    throw error;
  }
};

// Fetch upcoming events for public view
export const fetchUpcomingEvents = async (limit?: number): Promise<EventItem[]> => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .eq('status', 'upcoming')
      .order('event_date', { ascending: true });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error in fetchUpcomingEvents:', error);
    throw error;
  }
};

// Fetch past events
export const fetchPastEvents = async (limit?: number): Promise<EventItem[]> => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .eq('status', 'past')
      .order('event_date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error in fetchPastEvents:', error);
    throw error;
  }
};

// Fetch featured events for homepage
export const fetchFeaturedEvents = async (limit: number = 3): Promise<EventItem[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'upcoming')
      .eq('featured_on_homepage', true)
      .order('event_date', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error in fetchFeaturedEvents:', error);
    throw error;
  }
};

// Fetch single event by ID
export const fetchEventById = async (id: string): Promise<EventItem | null> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in fetchEventById:', error);
    throw error;
  }
};

// Upload flyer image to storage
export const uploadEventFlyer = async (file: File): Promise<string> => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = fileName;
    
    const { error: uploadError } = await supabase.storage
      .from('event-flyers')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('event-flyers')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadEventFlyer:', error);
    throw error;
  }
};

// Create new event
export const createEvent = async (eventData: Omit<EventItem, 'id' | 'created_at' | 'updated_at'>): Promise<EventItem> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([{
        title: eventData.title,
        description: eventData.description || '',
        event_date: eventData.event_date,
        event_time: eventData.event_time || null,
        venue: eventData.venue,
        flyer_url: eventData.flyer_url || '',
        registration_link: eventData.registration_link || '',
        status: eventData.status,
        featured_on_homepage: eventData.featured_on_homepage,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error in createEvent:', error);
    throw error;
  }
};

// Update event
export const updateEvent = async (id: string, eventData: Partial<EventItem>): Promise<EventItem> => {
  try {
    const updateData: any = {
      ...eventData,
      updated_at: new Date().toISOString(),
    };
    
    // Handle empty strings as null for time field
    if (updateData.event_time === '') {
      updateData.event_time = null;
    }

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error in updateEvent:', error);
    throw error;
  }
};

// Delete event
export const deleteEvent = async (id: string, flyerUrl?: string): Promise<boolean> => {
  try {
    // Delete flyer from storage if exists
    if (flyerUrl) {
      const fileName = flyerUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('event-flyers').remove([fileName]);
      }
    }
    
    // Delete from database
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    throw error;
  }
};