// Utility for managing prayer storage across the app
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

// Get all prayers from storage
export const getStoredPrayers = (): StoredPrayer[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading prayers from storage:', error);
    return [];
  }
};

// Get a single prayer by ID
export const getStoredPrayer = (id: string): StoredPrayer | null => {
  try {
    const prayers = getStoredPrayers();
    return prayers.find(prayer => prayer.id === id) || null;
  } catch (error) {
    console.error('Error finding prayer:', error);
    return null;
  }
};

// Store a prayer
export const storePrayer = (prayer: StoredPrayer): void => {
  try {
    const prayers = getStoredPrayers();
    const updatedPrayers = [prayer, ...prayers];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrayers));
  } catch (error) {
    console.error('Error storing prayer:', error);
  }
};

// Update all prayers (for bulk operations)
export const storeAllPrayers = (prayers: StoredPrayer[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prayers));
  } catch (error) {
    console.error('Error storing prayers:', error);
  }
};

// Initialize storage with default prayers if empty
export const initializePrayerStorage = (defaultPrayers: StoredPrayer[]): void => {
  const existing = getStoredPrayers();
  if (existing.length === 0) {
    storeAllPrayers(defaultPrayers);
  }
};