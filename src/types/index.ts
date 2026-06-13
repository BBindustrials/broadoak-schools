// Navigation
export interface NavLink {
  name: string;
  path: string;
}

// News/Blog
export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  category: string;
  author: string;
  published_at: string;
  status: 'draft' | 'published';
}

// Events
export interface EventItem {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  venue: string;
  flyer_image: string | null;
  registration_link: string | null;
  status: 'upcoming' | 'past';
}

// Gallery
export interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  description: string | null;
  category: string;
  is_featured: boolean;
  uploaded_at: string;
}

// Staff
export interface StaffMember {
  id: string;
  name: string;
  position: string;
  department: string;
  photo_url: string | null;
  bio: string | null;
  email: string | null;
  display_order: number;
  status: 'active' | 'inactive';
}

// Admission
export interface AdmissionInfo {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  available_classes: string[];
  admission_form_url: string | null;
  fees_document_url: string | null;
  deadline: string | null;
  contact_phone: string;
  contact_email: string;
}

// Banner
export interface BannerSlide {
  id: string;
  imageUrl: string;
  headline: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

// Contact Message
export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Portal Link
export interface PortalLink {
  id: string;
  name: string;
  url: string;
  description: string | null;
  is_enabled: boolean;
}

// Site Settings
export interface SiteSettings {
  id: string;
  school_name: string;
  school_logo: string | null;
  school_address: string;
  school_phone: string;
  school_email: string;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  linkedin_url: string | null;
  footer_text: string;
}