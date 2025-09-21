// TypeScript interfaces for Supabase database schema

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Prayer {
  id: string;
  content: string;
  type: "prayer" | "blessing";
  author: string;
  category: string;
  anonymous: boolean;
  urgent: boolean;
  on_behalf_of?: string;
  organization_type: "individual" | "organization";
  scripture?: string;
  image?: string;
  user_id?: string;
  support_count: number;
  created_at: string;
  updated_at: string;
}

export interface PrayerSupport {
  id: string;
  prayer_id: string;
  user_id?: string;
  supporter_name?: string;
  anonymous: boolean;
  created_at: string;
}

// Database table types (for raw database responses)
export interface DatabasePrayer {
  id: string;
  content: string;
  type: "prayer" | "blessing";
  author: string;
  category: string;
  anonymous: boolean;
  urgent: boolean;
  on_behalf_of: string | null;
  organization_type: "individual" | "organization";
  scripture: string | null;
  image: string | null;
  user_id: string | null;
  support_count: number;
  created_at: string;
  updated_at: string;
}

export interface DatabasePrayerSupport {
  id: string;
  prayer_id: string;
  user_id: string | null;
  supporter_name: string | null;
  anonymous: boolean;
  created_at: string;
}

// Input types for creating new records
export interface CreatePrayerInput {
  content: string;
  type: "prayer" | "blessing";
  author: string;
  category: string;
  anonymous?: boolean;
  urgent?: boolean;
  on_behalf_of?: string;
  organization_type?: "individual" | "organization";
  scripture?: string;
  image?: string;
  user_id?: string;
}

export interface CreatePrayerSupportInput {
  prayer_id: string;
  user_id?: string;
  supporter_name?: string;
  anonymous?: boolean;
}

// Utility type for transforming database response to app format
export interface TransformedPrayer extends Omit<Prayer, 'support_count'> {
  supportCount: number;
  timeAgo: string;
  onBehalfOf?: string;
  organizationType: "individual" | "organization";
}