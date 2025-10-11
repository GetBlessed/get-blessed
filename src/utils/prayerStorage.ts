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
    // Return mock data when Supabase is not available
    console.warn('Returning mock prayers due to Supabase connection error');
    return getMockPrayers();
  }
};

// Mock data for when Supabase is not available
const getMockPrayers = (): StoredPrayer[] => [
  {
    id: "1",
    content: "Going through a difficult time with my health. Would appreciate prayers for strength and healing during my treatment journey.",
    type: "prayer",
    author: "Sarah M.",
    supportCount: 24,
    timeAgo: "2 hours ago",
    category: "Health",
    anonymous: false,
    urgent: true,
    onBehalfOf: "",
    organizationType: "individual",
    scripture: "Isaiah 41:10 - Do not fear, for I am with you; do not be dismayed, for I am your God.",
    image: "",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "2",
    content: "Grateful for the wonderful news about my sister's recovery. Sending blessings to everyone who supported us during this time.",
    type: "blessing",
    author: "Michael K.",
    supportCount: 18,
    timeAgo: "4 hours ago",
    category: "Gratitude",
    anonymous: false,
    urgent: false,
    onBehalfOf: "My sister",
    organizationType: "individual",
    image: "",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    content: "Starting a new job next week and feeling nervous. Prayers for confidence and wisdom would mean the world to me.",
    type: "prayer",
    author: "Anonymous",
    supportCount: 31,
    timeAgo: "6 hours ago",
    category: "Career",
    anonymous: true,
    urgent: false,
    onBehalfOf: "",
    organizationType: "individual",
    image: "",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "4",
    content: "Celebrating 10 years of sobriety today! Blessed beyond measure and grateful for this community's support throughout my journey.",
    type: "blessing",
    author: "David R.",
    supportCount: 67,
    timeAgo: "8 hours ago",
    category: "Personal Growth",
    anonymous: false,
    urgent: false,
    onBehalfOf: "",
    organizationType: "individual",
    scripture: "Philippians 4:13 - I can do all things through Christ who strengthens me.",
    image: "",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "5",
    content: "Our community food bank is running low on supplies. Praying for generous hearts to help us continue serving families in need.",
    type: "prayer",
    author: "Hope Community Center",
    supportCount: 45,
    timeAgo: "12 hours ago",
    category: "Community",
    anonymous: false,
    urgent: true,
    onBehalfOf: "Families in need",
    organizationType: "organization",
    image: "",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "6",
    content: "Just witnessed an incredible act of kindness from a stranger today. Feeling blessed and inspired to pay it forward!",
    type: "blessing",
    author: "Jennifer L.",
    supportCount: 29,
    timeAgo: "1 day ago",
    category: "Gratitude",
    anonymous: false,
    urgent: false,
    onBehalfOf: "",
    organizationType: "individual",
    image: "",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

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