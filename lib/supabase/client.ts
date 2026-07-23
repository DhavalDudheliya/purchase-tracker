import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/types/database"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Copy .env.example to .env.local and fill in " +
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  )
}

/**
 * Single shared Supabase client for the whole app.
 * This is a no-auth, single-user app, so we use the public anon key directly.
 * All access should flow through TanStack Query hooks in `hooks/`.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
