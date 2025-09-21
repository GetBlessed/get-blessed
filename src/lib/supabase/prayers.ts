import { createSupabaseClient } from './client';
import { formatDistanceToNow } from "date-fns";
import type { StoredPrayer } from '@/utils/prayerStorage';
import type {
  Prayer,
  PrayerLike,
  DatabasePrayer,
  DatabasePrayerLike,
  CreatePrayerInput,
  CreatePrayerLikeInput,
  TransformedPrayer,
} from "./types";

export interface PrayerInsert extends Omit<StoredPrayer, 'id' | 'timeAgo'> {
  id?: string;
}

export interface PrayerUpdate extends Partial<Omit<StoredPrayer, 'id' | 'createdAt'>> {
  [key: string]: any;
}

// Get all prayers from Supabase
export const fetchPrayers = async (): Promise<StoredPrayer[]> => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('prayers')
    .select(`
      *,
      likes_count:prayer_likes(count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching prayers:', error);
    throw new Error(`Failed to fetch prayers: ${error.message}`);
  }

  // Transform Supabase data to StoredPrayer format
  return (data || []).map(prayer => ({
    id: prayer.id,
    content: prayer.content,
    type: prayer.type,
    author: prayer.author_name,
    supportCount: prayer.likes_count?.[0]?.count || 0,
    timeAgo: formatTimeAgo(prayer.created_at),
    category: prayer.category,
    anonymous: prayer.anonymous,
    urgent: prayer.urgent,
    onBehalfOf: prayer.on_behalf_of || '',
    organizationType: prayer.organization_type,
    scripture: prayer.scripture || '',
    image: prayer.image_url || '',
    createdAt: prayer.created_at,
  }));
};

// Get a single prayer by ID from Supabase
export const fetchPrayer = async (id: string): Promise<StoredPrayer | null> => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('prayers')
    .select(`
      *,
      likes_count:prayer_likes(count)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching prayer:', error);
    throw new Error(`Failed to fetch prayer: ${error.message}`);
  }

  // Transform Supabase data to StoredPrayer format
  return {
    id: data.id,
    content: data.content,
    type: data.type,
    author: data.author_name,
    supportCount: data.likes_count?.[0]?.count || 0,
    timeAgo: formatTimeAgo(data.created_at),
    category: data.category,
    anonymous: data.anonymous,
    urgent: data.urgent,
    onBehalfOf: data.on_behalf_of || '',
    organizationType: data.organization_type,
    scripture: data.scripture || '',
    image: data.image_url || '',
    createdAt: data.created_at,
  };
};

// Insert a new prayer into Supabase
export const insertPrayer = async (prayer: PrayerInsert): Promise<StoredPrayer> => {
  const supabase = createSupabaseClient();

  // Transform StoredPrayer format to Supabase format
  const insertData = {
    id: prayer.id || crypto.randomUUID(),
    content: prayer.content,
    type: prayer.type,
    author_name: prayer.author,
    category: prayer.category,
    anonymous: prayer.anonymous,
    urgent: prayer.urgent,
    on_behalf_of: prayer.onBehalfOf,
    organization_type: prayer.organizationType,
    scripture: prayer.scripture || null,
    image_url: prayer.image || null,
    created_at: prayer.createdAt,
    user_id: null,  // Always null for now since we don't have authentication
  };

  const { data, error } = await supabase
    .from('prayers')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error inserting prayer:', error);
    throw new Error(`Failed to create prayer: ${error.message}`);
  }

  // Transform back to StoredPrayer format
  return {
    id: data.id,
    content: data.content,
    type: data.type,
    author: data.author_name,
    supportCount: data.likes_count?.[0]?.count || 0,
    timeAgo: formatTimeAgo(data.created_at),
    category: data.category,
    anonymous: data.anonymous,
    urgent: data.urgent,
    onBehalfOf: data.on_behalf_of || '',
    organizationType: data.organization_type,
    scripture: data.scripture || '',
    image: data.image || '',
    createdAt: data.created_at,
  };
};

// Update a prayer in Supabase
export const updatePrayer = async (id: string, updates: PrayerUpdate): Promise<StoredPrayer> => {
  const supabase = createSupabaseClient();

  // Transform updates to Supabase format
  const updateData: Record<string, any> = {};
  if (updates.content !== undefined) updateData.content = updates.content;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.author !== undefined) updateData.author_name = updates.author;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.anonymous !== undefined) updateData.anonymous = updates.anonymous;
  if (updates.urgent !== undefined) updateData.urgent = updates.urgent;
  if (updates.onBehalfOf !== undefined) updateData.on_behalf_of = updates.onBehalfOf;
  if (updates.organizationType !== undefined) updateData.organization_type = updates.organizationType;
  if (updates.scripture !== undefined) updateData.scripture = updates.scripture || null;
  if (updates.image !== undefined) updateData.image_url = updates.image || null;

  const { data, error } = await supabase
    .from('prayers')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      likes_count:prayer_likes(count)
    `)
    .single();

  if (error) {
    console.error('Error updating prayer:', error);
    throw new Error(`Failed to update prayer: ${error.message}`);
  }

  // Transform back to StoredPrayer format
  return {
    id: data.id,
    content: data.content,
    type: data.type,
    author: data.author_name,
    supportCount: data.likes_count?.[0]?.count || 0,
    timeAgo: formatTimeAgo(data.created_at),
    category: data.category,
    anonymous: data.anonymous,
    urgent: data.urgent,
    onBehalfOf: data.on_behalf_of || '',
    organizationType: data.organization_type,
    scripture: data.scripture || '',
    image: data.image || '',
    createdAt: data.created_at,
  };
};

// Delete a prayer from Supabase
export const deletePrayer = async (id: string): Promise<void> => {
  const supabase = createSupabaseClient();

  const { error } = await supabase
    .from('prayers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting prayer:', error);
    throw new Error(`Failed to delete prayer: ${error.message}`);
  }
};

// Add a like to a prayer
export const addPrayerLike = async (
  likeData: CreatePrayerLikeInput
): Promise<{ data: boolean; error: string | null }> => {
  try {
    const supabase = createSupabaseClient();

    // Start a transaction by creating the like record first
    const { data: support, error: supportError } = await supabase
      .from("prayer_likes")
      .insert({
        prayer_id: likeData.prayer_id,
        user_id: likeData.user_id || null,
        supporter_name: likeData.supporter_name || null,
        anonymous: likeData.anonymous ?? false,
      })
      .select()
      .single();

    if (supportError) {
      console.error("Error creating prayer like:", supportError);
      return { data: false, error: supportError.message };
    }


    return { data: true, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Unexpected error adding prayer like:", err);
    return { data: false, error: errorMessage };
  }
};

// Get prayer like records for a specific prayer
export const getPrayerLikes = async (
  prayerId: string
): Promise<{ data: PrayerLike[] | null; error: string | null }> => {
  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("prayer_likes")
      .select("*")
      .eq("prayer_id", prayerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching prayer likes:", error);
      return { data: null, error: error.message };
    }

    const likeRecords: PrayerLike[] = data?.map((record: DatabasePrayerLike) => ({
      id: record.id,
      prayer_id: record.prayer_id,
      user_id: record.user_id || undefined,
      supporter_name: record.supporter_name || undefined,
      anonymous: record.anonymous,
      created_at: record.created_at,
    })) || [];

    return { data: likeRecords, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Unexpected error fetching prayer likes:", err);
    return { data: null, error: errorMessage };
  }
};

// Enhanced function for retrieving all prayers with error handling
export const getAllPrayers = async (
  limit = 50,
  offset = 0
): Promise<{ data: StoredPrayer[] | null; error: string | null }> => {
  try {
    const prayers = await fetchPrayers();
    return { data: prayers, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    return { data: null, error: errorMessage };
  }
};

// Enhanced function for retrieving a single prayer with error handling
export const getPrayerById = async (
  id: string
): Promise<{ data: StoredPrayer | null; error: string | null }> => {
  try {
    const prayer = await fetchPrayer(id);
    return { data: prayer, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    return { data: null, error: errorMessage };
  }
};

// Enhanced function for creating prayers with error handling
export const createPrayer = async (
  prayerData: CreatePrayerInput
): Promise<{ data: StoredPrayer | null; error: string | null }> => {
  try {
    const prayerInsert: PrayerInsert = {
      content: prayerData.content,
      type: prayerData.type,
      author: prayerData.author,
      category: prayerData.category,
      anonymous: prayerData.anonymous ?? false,
      urgent: prayerData.urgent ?? false,
      onBehalfOf: prayerData.on_behalf_of || '',
      organizationType: prayerData.organization_type ?? "individual",
      scripture: prayerData.scripture || '',
      image: prayerData.image || '',
      supportCount: 0,
      createdAt: new Date().toISOString(),
    };

    const prayer = await insertPrayer(prayerInsert);
    return { data: prayer, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    return { data: null, error: errorMessage };
  }
};

// Get prayers by user ID
export const getPrayersByUserId = async (
  userId: string,
  limit = 50,
  offset = 0
): Promise<{ data: StoredPrayer[] | null; error: string | null }> => {
  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("prayers")
      .select(`
        *,
        likes_count:prayer_likes(count)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching user prayers:", error);
      return { data: null, error: error.message };
    }

    const prayers = (data || []).map(prayer => ({
      id: prayer.id,
      content: prayer.content,
      type: prayer.type,
      author: prayer.author_name,
      supportCount: prayer.likes_count?.[0]?.count || 0,
      timeAgo: formatTimeAgo(prayer.created_at),
      category: prayer.category,
      anonymous: prayer.anonymous,
      urgent: prayer.urgent,
      onBehalfOf: prayer.on_behalf_of || '',
      organizationType: prayer.organization_type,
      scripture: prayer.scripture || '',
      image: prayer.image_url || '',
      createdAt: prayer.created_at,
    }));

    return { data: prayers, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Unexpected error fetching user prayers:", err);
    return { data: null, error: errorMessage };
  }
};

// Search prayers by content or category
export const searchPrayers = async (
  query: string,
  limit = 50
): Promise<{ data: StoredPrayer[] | null; error: string | null }> => {
  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("prayers")
      .select(`
        *,
        likes_count:prayer_likes(count)
      `)
      .or(`content.ilike.%${query}%, category.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error searching prayers:", error);
      return { data: null, error: error.message };
    }

    const prayers = (data || []).map(prayer => ({
      id: prayer.id,
      content: prayer.content,
      type: prayer.type,
      author: prayer.author_name,
      supportCount: prayer.likes_count?.[0]?.count || 0,
      timeAgo: formatTimeAgo(prayer.created_at),
      category: prayer.category,
      anonymous: prayer.anonymous,
      urgent: prayer.urgent,
      onBehalfOf: prayer.on_behalf_of || '',
      organizationType: prayer.organization_type,
      scripture: prayer.scripture || '',
      image: prayer.image_url || '',
      createdAt: prayer.created_at,
    }));

    return { data: prayers, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Unexpected error searching prayers:", err);
    return { data: null, error: errorMessage };
  }
};

// Subscribe to real-time prayer changes
export const subscribeToPrayers = (callback: (payload: Record<string, any>) => void): (() => void) => {
  const supabase = createSupabaseClient();

  const subscription = supabase
    .channel('prayers_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'prayers'
      },
      (payload) => {
        console.log("Real-time prayer update:", payload);
        callback(payload);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
};

// Subscribe to real-time prayer likes updates
export const subscribeToPrayerLikes = (
  callback: (payload: Record<string, any>) => void
): (() => void) => {
  const supabase = createSupabaseClient();

  const subscription = supabase
    .channel("prayer_likes_channel")
    .on(
      "postgres_changes",
      {
        event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
        schema: "public",
        table: "prayer_likes",
      },
      (payload) => {
        console.log("Real-time prayer likes update:", payload);
        callback(payload);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
};

// Add to waitlist
export const addToWaitlist = async (data: {
  email: string;
  name: string;
  phone?: string;
  organization?: string;
}): Promise<void> => {
  const supabase = createSupabaseClient();

  const { error } = await supabase
    .from('waitlist')
    .insert({
      email: data.email,
      name: data.name,
      phone: data.phone || null,
      organization: data.organization || null,
    });

  if (error) {
    if (error.code === '23505') {
      throw new Error('This email is already on the waitlist');
    }
    console.error('Error adding to waitlist:', error);
    throw new Error(`Failed to add to waitlist: ${error.message}`);
  }
};

// Helper function to format time ago using date-fns
function formatTimeAgo(createdAt: string): string {
  return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
}