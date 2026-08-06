import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));

if (!isSupabaseConfigured) {
  console.warn('[StreetBoss] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY no configurados. Operando con bus de sincronización en tiempo real.');
}

// Fallback dummy client if credentials are absent
const createDummyClient = () => ({
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    delete: () => Promise.resolve({ data: [], error: null }),
    upsert: () => Promise.resolve({ data: [], error: null }),
    single: () => Promise.resolve({ data: null, error: null }),
  })
});

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : createDummyClient();

/**
 * Returns a custom scoped Supabase client instance containing the x-client-slug header,
 * enabling Row Level Security (RLS) policies to isolate database operations per tenant.
 */
export const getSupabaseClient = (slug) => {
  if (!isSupabaseConfigured) return supabase;
  if (!slug) return supabase;
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        'x-client-slug': slug,
      },
    },
  });
};
