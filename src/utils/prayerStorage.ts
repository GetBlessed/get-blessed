// Utility for managing prayer storage across the app
import { fetchPrayers, fetchPrayer, insertPrayer, type PrayerInsert } from '@/lib/supabase/prayers';

export interface StoredPrayer {
  id: string;
  content: string;
  type: "prayer" | "blessing";
  author: string;
  supportCount: number;
  timeAgo: string;
  category: string;
  anonymous: boolean;
  urgent: boolean;
  onBehalfOf: string;
  organizationType: "individual" | "organization";
  scripture?: string;
  image?: string;
  createdAt: string;
}

const STORAGE_KEY = 'getblessed_prayers';

// Get all prayers from Supabase (with localStorage fallback)
export const getStoredPrayers = async (): Promise<StoredPrayer[]> => {
  try {
    // Try to fetch from Supabase first
    const prayers = await fetchPrayers();
    console.log('Retrieved prayers from Supabase:', prayers.length, 'prayers found');
    return prayers;
  } catch (error) {
    console.error('Error reading prayers from Supabase, falling back to localStorage:', error);

    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      console.log('Retrieved prayers from localStorage fallback:', parsed.length, 'prayers found');
      return parsed;
    } catch (localStorageError) {
      console.error('Error reading from localStorage fallback:', localStorageError);
      return [];
    }
  }
};

// Synchronous version for backward compatibility (uses localStorage)
export const getStoredPrayersSync = (): StoredPrayer[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    console.log('Retrieved prayers from localStorage (sync):', parsed.length, 'prayers found');
    return parsed;
  } catch (error) {
    console.error('Error reading prayers from localStorage (sync):', error);
    return [];
  }
};

// Get a single prayer by ID from Supabase (with localStorage fallback)
export const getStoredPrayer = async (id: string): Promise<StoredPrayer | null> => {
  try {
    // Try to fetch from Supabase first
    const prayer = await fetchPrayer(id);
    console.log('Found prayer in Supabase:', prayer ? 'Yes' : 'No');
    return prayer;
  } catch (error) {
    console.error('Error finding prayer in Supabase, falling back to localStorage:', error);

    // Fallback to localStorage
    try {
      const prayers = getStoredPrayersSync();
      console.log('Looking for prayer ID in localStorage:', id);
      console.log('Available prayer IDs:', prayers.map(p => p.id));
      const found = prayers.find(prayer => prayer.id === id) || null;
      console.log('Found prayer in localStorage:', found ? 'Yes' : 'No');
      return found;
    } catch (localStorageError) {
      console.error('Error finding prayer in localStorage fallback:', localStorageError);
      return null;
    }
  }
};

// Store a prayer in Supabase (with localStorage fallback)
export const storePrayer = async (prayer: StoredPrayer): Promise<StoredPrayer> => {
  try {
    // Try to save to Supabase first
    const savedPrayer = await insertPrayer({
      ...prayer,
      id: prayer.id || crypto.randomUUID(),
    });
    console.log('Stored prayer in Supabase:', savedPrayer.id, savedPrayer.type, savedPrayer.content.substring(0, 50));

    // Also save to localStorage as backup
    try {
      const prayers = getStoredPrayersSync();
      const updatedPrayers = [savedPrayer, ...prayers.filter(p => p.id !== savedPrayer.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrayers));
    } catch (localStorageError) {
      console.warn('Could not update localStorage backup:', localStorageError);
    }

    return savedPrayer;
  } catch (error) {
    console.error('Error storing prayer in Supabase, falling back to localStorage:', error);

    // Fallback to localStorage
    try {
      const prayers = getStoredPrayersSync();
      const updatedPrayers = [prayer, ...prayers];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrayers));
      console.log('Stored prayer in localStorage fallback:', prayer.id, prayer.type, prayer.content.substring(0, 50));
      console.log('Total prayers in localStorage:', updatedPrayers.length);
      return prayer;
    } catch (localStorageError) {
      console.error('Error storing prayer in localStorage fallback:', localStorageError);
      throw new Error('Failed to store prayer in both Supabase and localStorage');
    }
  }
};

// Update all prayers (for bulk operations) - localStorage only for compatibility
export const storeAllPrayers = (prayers: StoredPrayer[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prayers));
  } catch (error) {
    console.error('Error storing prayers:', error);
  }
};

// Initialize storage with default prayers if empty (localStorage fallback only)
export const initializePrayerStorage = (defaultPrayers: StoredPrayer[]): void => {
  try {
    const existing = getStoredPrayersSync();
    if (existing.length === 0) {
      storeAllPrayers(defaultPrayers);
      console.log('Initialized localStorage with default prayers');
    }
  } catch (error) {
    console.error('Error initializing prayer storage:', error);
  }
};

// Initialize prayers for app startup - checks both Supabase and localStorage
export const initializePrayerStorageAsync = async (defaultPrayers: StoredPrayer[]): Promise<boolean> => {
  try {
    // Check if we have prayers in Supabase
    const supabasePrayers = await getStoredPrayers();
    if (supabasePrayers.length > 0) {
      console.log('Found existing prayers in Supabase:', supabasePrayers.length);
      return true;
    }

    // If no prayers in Supabase, check localStorage and potentially migrate
    const localPrayers = getStoredPrayersSync();
    if (localPrayers.length > 0) {
      console.log('Found prayers in localStorage, considering migration to Supabase');
      return true;
    }

    // If no prayers anywhere, initialize with defaults in localStorage
    console.log('No prayers found, initializing with defaults');
    storeAllPrayers(defaultPrayers);
    return false;
  } catch (error) {
    console.error('Error during async initialization:', error);
    // Fallback to sync initialization
    initializePrayerStorage(defaultPrayers);
    return false;
  }
};