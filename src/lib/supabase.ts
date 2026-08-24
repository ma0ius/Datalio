"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* Browser Client für die App. Gibt null zurück, solange die Umgebungs-
   variablen fehlen, damit Build und Website ohne Supabase funktionieren. */
let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  if (!cached) cached = createClient(url, key);
  return cached;
}
