
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy,
  where
} from "firebase/firestore";
import { db } from "../firebase";
import { HeroContent, Insight, Author, OfficeLocation, Inquiry, Job, JobApplication, UserProfile } from '../types';

const COLLECTIONS = {
  HERO: 'hero',
  INSIGHTS: 'insights',
  AUTHORS: 'authors',
  OFFICES: 'offices',
  INQUIRIES: 'inquiries',
  EVENTS: 'events',
  JOBS: 'jobs',
  APPLICATIONS: 'applications',
  USERS: 'users'
};

export const contentService = {
  seedData: async () => {
    try {
      const heroRef = doc(db, COLLECTIONS.HERO, 'main');
      const heroSnap = await getDoc(heroRef);
      if (!heroSnap.exists()) {
        await setDoc(heroRef, {
          headline: "Strategic Legal Counsel for a Complex World",
          subtext: "Providing precise legal strategy and uncompromising advocacy for global enterprises and individuals.",
          backgroundImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2400",
          ctaText: "DISCUSS MANDATE"
        });
      }
    } catch (err) {
      console.debug("Seed error:", err);
    }
  },

  saveUserProfile: async (profile: UserProfile) => {
    await setDoc(doc(db, COLLECTIONS.USERS, profile.uid), profile);
  },

  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    return snap.exists() ? snap.data() as UserProfile : null;
  },

  subscribeHero: (callback: (hero: HeroContent) => void) => {
    return onSnapshot(doc(db, COLLECTIONS.HERO, 'main'), (docSnap) => {
      if (docSnap.exists()) callback({ id: docSnap.id, ...docSnap.data() } as HeroContent);
    });
  },

  subscribeJobs: (callback: (jobs: Job[]) => void) => {
    const q = query(collection(db, COLLECTIONS.JOBS), where('status', '==', 'active'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Job)));
    });
  },

  saveJob: async (job: Job) => {
    const { id, ...data } = job;
    if (id) await setDoc(doc(db, COLLECTIONS.JOBS, id), data);
    else await addDoc(collection(db, COLLECTIONS.JOBS), { ...data, postedDate: new Date().toISOString() });
  },

  deleteJob: async (id: string) => {
    await deleteDoc(doc(db, COLLECTIONS.JOBS, id));
  },

  subscribeUserApplications: (userId: string, callback: (apps: JobApplication[]) => void) => {
    const q = query(collection(db, COLLECTIONS.APPLICATIONS), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as JobApplication));
      data.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
      callback(data);
    });
  },

  subscribeAllApplications: (callback: (apps: JobApplication[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.APPLICATIONS), (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as JobApplication)));
    });
  },

  submitApplication: async (app: Omit<JobApplication, 'id'>) => {
    return await addDoc(collection(db, COLLECTIONS.APPLICATIONS), app);
  },

  updateApplicationStatus: async (id: string, status: JobApplication['status']) => {
    await updateDoc(doc(db, COLLECTIONS.APPLICATIONS, id), { status });
  },

  subscribeInsights: (callback: (insights: Insight[]) => void) => {
    const q = query(collection(db, COLLECTIONS.INSIGHTS), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Insight))));
  },
  
  subscribeHeroInsights: (callback: (insights: Insight[]) => void) => {
    const q = query(collection(db, COLLECTIONS.INSIGHTS), where('showInHero', '==', true));
    return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Insight))));
  },
  
  subscribeFeaturedInsights: (callback: (insights: Insight[]) => void) => {
    const q = query(collection(db, COLLECTIONS.INSIGHTS), where('isFeatured', '==', true));
    return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Insight))));
  },
  
  saveInsight: async (insight: Insight) => {
    const { id, ...data } = insight;
    if (id) await setDoc(doc(db, COLLECTIONS.INSIGHTS, id), data);
    else await addDoc(collection(db, COLLECTIONS.INSIGHTS), { ...data, date: new Date().toISOString() });
  },
  
  deleteInsight: async (id: string) => await deleteDoc(doc(db, COLLECTIONS.INSIGHTS, id)),

  subscribeAuthors: (callback: (authors: Author[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.AUTHORS), (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Author)));
    });
  },
  
  saveAuthor: async (author: Author) => {
    const { id, ...data } = author;
    if (id) await setDoc(doc(db, COLLECTIONS.AUTHORS, id), data);
    else await addDoc(collection(db, COLLECTIONS.AUTHORS), data);
  },
  
  deleteAuthor: async (id: string) => await deleteDoc(doc(db, COLLECTIONS.AUTHORS, id)),

  subscribeOffices: (callback: (offices: OfficeLocation[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.OFFICES), (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as OfficeLocation)));
    });
  },
  
  saveOffice: async (office: OfficeLocation) => {
    const { id, ...data } = office;
    if (id) await setDoc(doc(db, COLLECTIONS.OFFICES, id), data);
    else await addDoc(collection(db, COLLECTIONS.OFFICES), data);
  },
  
  deleteOffice: async (id: string) => await deleteDoc(doc(db, COLLECTIONS.OFFICES, id)),

  subscribeInquiries: (callback: (inquiries: Inquiry[]) => void) => {
    const q = query(collection(db, COLLECTIONS.INQUIRIES), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Inquiry))));
  },

  subscribeUserInquiries: (userId: string, callback: (inquiries: Inquiry[]) => void) => {
    const q = query(collection(db, COLLECTIONS.INQUIRIES), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Inquiry));
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(data);
    });
  },
  
  addInquiry: async (inquiry: any) => {
    const uniqueId = `AKP-${Math.floor(Math.random() * 900000) + 100000}`;
    await addDoc(collection(db, COLLECTIONS.INQUIRIES), { 
      ...inquiry, 
      date: new Date().toISOString(), 
      status: 'new', 
      uniqueId 
    });
    return uniqueId;
  },
  
  updateInquiryStatus: async (id: string, status: string) => {
    await updateDoc(doc(db, COLLECTIONS.INQUIRIES, id), { status });
  }
};
