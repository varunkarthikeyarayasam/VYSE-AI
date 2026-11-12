import { supabase } from "../supabase";
import type { Profile, Student, Faculty } from "../../types/database";

export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.warn("Could not fetch profile, falling back:", error.message);
    return {
      id: user.id,
      email: user.email || "",
      full_name: user.email?.split("@")[0] || "User",
      role: "student",
      created_at: new Date().toISOString(),
    };
  }
  return data as Profile;
}

export async function getCurrentStudent(): Promise<Student | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("students")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Student | null;
}