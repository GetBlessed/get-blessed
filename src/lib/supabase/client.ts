import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
  
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('Supabase environment variables not found. Using placeholder values. Database features will not work.');
  }
  
  return createBrowserClient(supabaseUrl, supabaseKey);
}