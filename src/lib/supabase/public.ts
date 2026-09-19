import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.d"; // Sesuaikan path type Database Anda jika ada

// Supabase client tanpa membaca cookies() - Sangat aman untuk unstable_cache()
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}