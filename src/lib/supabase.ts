import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://bvwvfmelfozqpuhtbxkk.supabase.co";
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2d3ZmbWVsZm96cXB1aHRieGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMjA1NDEsImV4cCI6MjEwNDU5NjU0MX0.Er1l5XLXNwt95wNTVAM5wpKH13lceHJ1jUo4y_1ZGiM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});