import { supabase } from './integrations/supabase/client';

async function testConnection() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();
  
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connected successfully:', data);
  }
}

testConnection();