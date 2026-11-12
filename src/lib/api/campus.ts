import { supabase } from "../supabase";
import type { CampusLocation, CampusNotice, AcademicCalendarItem } from "../../types/database";

export async function getCampusLocations(): Promise<CampusLocation[]> {
  const { data, error } = await supabase
    .from("campus_locations")
    .select("*")
    .order("name");
  if (error) throw error;
  return data as CampusLocation[];
}

export async function getCampusNotices(): Promise<CampusNotice[]> {
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .eq("verified", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data as CampusNotice[];
}

export async function getAcademicCalendar(): Promise<AcademicCalendarItem[]> {
  const { data, error } = await supabase
    .from("academic_calendar")
    .select("*")
    .order("event_date", { ascending: true });
  if (error) throw error;
  return data as AcademicCalendarItem[];
}