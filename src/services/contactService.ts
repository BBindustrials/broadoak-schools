import { supabase } from '../integrations/supabase/client';

export interface ContactMessage {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  replied: boolean;
  created_at?: string;
}

// Fetch all contact messages (admin)
export const fetchAllMessages = async (): Promise<ContactMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

// Fetch unread messages count
export const fetchUnreadCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
};

// Mark message as read
export const markAsRead = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

// Mark message as replied
export const markAsReplied = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ replied: true })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking message as replied:', error);
    throw error;
  }
};

// Delete message
export const deleteMessage = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

// Delete multiple messages
export const deleteMultipleMessages = async (ids: string[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .in('id', ids);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting messages:', error);
    throw error;
  }
};

// Mark multiple as read
export const markMultipleAsRead = async (ids: string[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .in('id', ids);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

// Send reply email (simulated - you can integrate with an email service)
export const sendReply = async (to: string, subject: string, message: string): Promise<void> => {
  // This would connect to an email service like Resend, SendGrid, etc.
  // For now, we'll just log and simulate
  console.log('Sending email to:', to);
  console.log('Subject:', subject);
  console.log('Message:', message);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // TODO: Integrate with actual email service
  // Example with Resend:
  // await resend.emails.send({
  //   from: 'noreply@broadoakschools.com',
  //   to: to,
  //   subject: subject,
  //   html: message
  // });
};