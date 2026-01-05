
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

export interface Job {
  id: string;
  title: string;
  department: 'Litigation' | 'Corporate' | 'Support' | 'Internship';
  location: string;
  description: string;
  postedDate: string;
  status: 'active' | 'closed';
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  jobTitle: string;
  status: 'Received' | 'Under Review' | 'Interview' | 'Offered' | 'Rejected';
  submittedDate: string;
  data: {
    personal: {
      name: string;
      email: string;
      mobile: string;
      photo: string;
    };
    education: string;
    experience: string;
    interests: string;
    resumeUrl: string;
  };
}

export interface Insight {
  id: string;
  type: 'insights' | 'reports' | 'podcasts' | 'articles' | 'events' | 'casestudy';
  category: string;
  title: string;
  date: string;
  desc: string;
  image: string;
  bannerImage?: string;
  pdfUrl?: string;
  audioUrl?: string;
  season?: string;
  episode?: string;
  authorId?: string;
  content?: string;
  isFeatured?: boolean;
  showInHero?: boolean;
  featuredColor?: string;
  featuredLabel?: string;
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
  userId?: string;
  type: 'rfp' | 'contact' | 'appointment';
  name: string;
  email: string;
  date: string;
  status: 'new' | 'reviewed' | 'archived';
  uniqueId: string;
  details: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'applicant' | 'general' | 'admin';
  createdAt: string;
}
