
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
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase";
import { HeroContent, Insight, Author, OfficeLocation, Inquiry, Event } from '../types';

const COLLECTIONS = {
  HERO: 'hero',
  INSIGHTS: 'insights',
  AUTHORS: 'authors',
  OFFICES: 'offices',
  INQUIRIES: 'inquiries',
  EVENTS: 'events'
};

export const contentService = {
  seedData: async () => {
    try {
      const heroSnap = await getDoc(doc(db, COLLECTIONS.HERO, 'main'));
      if (!heroSnap.exists()) {
        await setDoc(doc(db, COLLECTIONS.HERO, 'main'), {
          headline: "Strategic Legal Counsel for a Complex World",
          subtext: "Providing precise legal strategy and uncompromising advocacy for global enterprises and individuals from the heart of New Delhi.",
          backgroundImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2400",
          ctaText: "DISCUSS MANDATE"
        });
      }
    } catch (err) {
      console.error("Error seeding data:", err);
    }
  },

  subscribeHero: (callback: (hero: HeroContent) => void) => {
    return onSnapshot(doc(db, COLLECTIONS.HERO, 'main'), (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as HeroContent);
      }
    });
  },
  
  updateHero: async (content: HeroContent) => {
    await setDoc(doc(db, COLLECTIONS.HERO, 'main'), content);
  },

  subscribeInsights: (callback: (insights: Insight[]) => void) => {
    const q = query(collection(db, COLLECTIONS.INSIGHTS), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Insight));
      callback(items);
    });
  },

  subscribeFeaturedInsights: (callback: (insights: Insight[]) => void) => {
    const q = query(collection(db, COLLECTIONS.INSIGHTS), where('isFeatured', '==', true));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Insight));
      callback(items);
    });
  },

  saveInsight: async (insight: Insight) => {
    const { id, ...data } = insight;
    if (id) {
      await setDoc(doc(db, COLLECTIONS.INSIGHTS, id), data);
    } else {
      await addDoc(collection(db, COLLECTIONS.INSIGHTS), {
        ...data,
        date: data.date || new Date().toISOString()
      });
    }
  },

  deleteInsight: async (id: string) => {
    await deleteDoc(doc(db, COLLECTIONS.INSIGHTS, id));
  },

  subscribeEvents: (callback: (events: Event[]) => void) => {
    const q = query(collection(db, COLLECTIONS.EVENTS), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      callback(items);
    });
  },

  subscribeAuthors: (callback: (authors: Author[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.AUTHORS), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Author));
      callback(items);
    });
  },

  saveAuthor: async (author: Author) => {
    const { id, ...data } = author;
    if (id) {
      await setDoc(doc(db, COLLECTIONS.AUTHORS, id), data);
    } else {
      await addDoc(collection(db, COLLECTIONS.AUTHORS), data);
    }
  },

  deleteAuthor: async (id: string) => {
    await deleteDoc(doc(db, COLLECTIONS.AUTHORS, id));
  },

  subscribeOffices: (callback: (offices: OfficeLocation[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.OFFICES), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OfficeLocation));
      callback(items);
    });
  },

  saveOffice: async (office: OfficeLocation) => {
    const { id, ...data } = office;
    if (id) {
      await setDoc(doc(db, COLLECTIONS.OFFICES, id), data);
    } else {
      await addDoc(collection(db, COLLECTIONS.OFFICES), data);
    }
  },

  deleteOffice: async (id: string) => {
    await deleteDoc(doc(db, COLLECTIONS.OFFICES, id));
  },

  subscribeInquiries: (callback: (inquiries: Inquiry[]) => void) => {
    const q = query(collection(db, COLLECTIONS.INQUIRIES), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry));
      callback(items);
    });
  },

  addInquiry: async (inquiry: Omit<Inquiry, 'id' | 'date' | 'status' | 'uniqueId'>) => {
    const uniqueId = `AKP-${Math.floor(100000 + Math.random() * 900000)}`;
    await addDoc(collection(db, COLLECTIONS.INQUIRIES), {
      ...inquiry,
      date: new Date().toISOString(),
      status: 'new',
      uniqueId
    });
  },

  updateInquiryStatus: async (id: string, status: Inquiry['status']) => {
    await updateDoc(doc(db, COLLECTIONS.INQUIRIES, id), { status });
  }
};
