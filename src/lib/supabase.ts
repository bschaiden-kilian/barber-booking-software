import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Creates and returns a validated Supabase client.
 * Called only when VITE_USE_MOCK=false, so missing env vars are caught at
 * startup rather than silently producing a broken client.
 */
export function createSupabaseClient(): SupabaseClient {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  if (!url || !key) {
    throw new Error(
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, or use VITE_USE_MOCK=true'
    )
  }
  return createClient(url, key)
}
