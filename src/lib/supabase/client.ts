import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

// Client-side Supabase instance
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
