// Utility for managing prayer storage via Supabase
import { fetchPrayers, fetchPrayer, insertPrayer } from '@/lib/supabase/prayers';

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

// Get all prayers from Supabase
export const getStoredPrayers = async (): Promise<StoredPrayer[]> => {
  try {
    const prayers = await fetchPrayers();
    console.log('Retrieved prayers from Supabase:', prayers.length, 'prayers found');
    return prayers;
  } catch (error) {
    console.error('Error reading prayers from Supabase:', error);
    throw error; // Propagate error instead of falling back
  }
};

// Get a single prayer by ID from Supabase
export const getStoredPrayer = async (id: string): Promise<StoredPrayer | null> => {
  try {
    const prayer = await fetchPrayer(id);
    console.log('Found prayer in Supabase:', prayer ? 'Yes' : 'No');
    return prayer;
  } catch (error) {
    console.error('Error finding prayer in Supabase:', error);
    throw error; // Propagate error instead of falling back
  }
};

// Store a prayer in Supabase
export const storePrayer = async (prayer: StoredPrayer): Promise<StoredPrayer> => {
  try {
    const savedPrayer = await insertPrayer({
      ...prayer,
      id: prayer.id || crypto.randomUUID(),
    });
    console.log('Stored prayer in Supabase:', savedPrayer.id, savedPrayer.type, savedPrayer.content.substring(0, 50));
    return savedPrayer;
  } catch (error) {
    console.error('Error storing prayer in Supabase:', error);
    throw error; // Propagate error instead of falling back
  }
};