import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Run in Supabase SQL editor:
// CREATE TABLE contact_messages (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   name text NOT NULL,
//   email text NOT NULL,
//   message text NOT NULL,
//   created_at timestamptz DEFAULT now()
// );
// ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "insert_only" ON contact_messages FOR INSERT WITH CHECK (true);

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  cached = createClient(url, key, {
    auth: { persistSession: false },
  });
  return cached;
}
