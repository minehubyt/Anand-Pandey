
export interface PracticeArea {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface OfficeLocation {
  id: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  coordinates: { lat: number; lng: number };
  image?: string;
  locationUrl?: string;
}

export interface Author {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string;
  role?: 'Partner' | 'Senior Associate' | 'Associate' | 'Counsel' | 'Senior Partner';
  linkedin?: string;
  whatsapp?: string;
  email?: string;
  qualifications?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  desc: string;
  image: string;
  location?: string;
}

export interface Insight {
  id: string;
  type: 'insights' | 'reports' | 'podcasts' | 'articles' | 'events' | 'casestudy';
  category: string;
  title: string;
  date: string;
  desc: string;
  image: string; // Thumbnail
  bannerImage?: string;
  pdfUrl?: string;
  audioUrl?: string;
  season?: string;
  episode?: string;
  authorId?: string;
  content?: string; // HTML or structured JSON for rich text
  isFeatured?: boolean;
  featuredColor?: string; // For the news carousel background
}

export interface HeroContent {
  id: string;
  headline: string;
  subtext: string;
  backgroundImage: string;
  ctaText: string;
  active?: boolean;
}

export interface Inquiry {
  id: string;
  type: 'rfp' | 'contact' | 'appointment';
  name: string;
  email: string;
  date: string;
  status: 'new' | 'reviewed' | 'archived';
  uniqueId: string;
  details: any;
}
