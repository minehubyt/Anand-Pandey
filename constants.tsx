
import React from 'react';
import { Briefcase, Gavel, Scale, ShieldCheck, FileText, Users } from 'lucide-react';
import { PracticeArea, OfficeLocation } from './types';

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    id: 'corp',
    title: 'Corporate Law',
    description: 'Expert guidance on mergers, acquisitions, and corporate governance for enterprises.',
    icon: 'Briefcase'
  },
  {
    id: 'crim',
    title: 'Criminal Defense',
    description: 'Strategic defense representation in high-profile criminal litigation cases.',
    icon: 'Gavel'
  },
  {
    id: 'civ',
    title: 'Civil Litigation',
    description: 'Resolving disputes across a broad spectrum of commercial and private legal matters.',
    icon: 'Scale'
  },
  {
    id: 'ip',
    title: 'Intellectual Property',
    description: 'Securing and defending your innovations and creative assets globally.',
    icon: 'ShieldCheck'
  },
  {
    id: 'fam',
    title: 'Family Law',
    description: 'Compassionate legal support for complex family matters and domestic relations.',
    icon: 'Users'
  },
  {
    id: 'est',
    title: 'Estate Planning',
    description: 'Wealth preservation and management for future generations.',
    icon: 'FileText'
  }
];

export const OFFICES: OfficeLocation[] = [
  {
    // Fix: Added unique 'id' property to satisfy OfficeLocation interface
    id: 'delhi',
    city: 'New Delhi',
    address: 'High Court Chambers, Shanti Path, New Delhi, 110001',
    phone: '+91 11 2345 6789',
    email: 'delhi.office@akpandey.com',
    coordinates: { lat: 28.6139, lng: 77.2090 }
  },
  {
    // Fix: Added unique 'id' property to satisfy OfficeLocation interface
    id: 'lucknow',
    city: 'Lucknow',
    address: 'Civil Lines, Hazratganj, Lucknow, 226001',
    phone: '+91 522 987 6543',
    email: 'lucknow.office@akpandey.com',
    coordinates: { lat: 26.8467, lng: 80.9462 }
  }
];

export const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Briefcase': return <Briefcase className="w-6 h-6" />;
    case 'Gavel': return <Gavel className="w-6 h-6" />;
    case 'Scale': return <Scale className="w-6 h-6" />;
    case 'ShieldCheck': return <ShieldCheck className="w-6 h-6" />;
    case 'FileText': return <FileText className="w-6 h-6" />;
    case 'Users': return <Users className="w-6 h-6" />;
    default: return <Scale className="w-6 h-6" />;
  }
};
