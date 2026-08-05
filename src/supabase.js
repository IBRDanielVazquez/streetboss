import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('[StreetBoss] Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY en el entorno');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Returns a custom scoped Supabase client instance containing the x-client-slug header,
 * enabling Row Level Security (RLS) policies to isolate database operations per tenant.
 */
export const getSupabaseClient = (slug) => {
  if (!slug) return supabase;
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        'x-client-slug': slug,
      },
    },
  });
};
