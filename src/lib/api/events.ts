import { supabase } from "../supabase";
import type { CampusEvent, EventRegistration } from "../../types/database";

export async function getEvents(): Promise<CampusEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("event_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data as CampusEvent[];
}

export async function getEventDetails(eventId: string): Promise<CampusEvent> {
  const { data, error } = await supabase.rpc("get_event_details", {
    p_event_id: eventId,
  });
  if (error) throw error;
  return data as CampusEvent;
}

export async function getStudentRegistrations(studentId: string): Promise<EventRegistration[]> {
  const { data, error } = await supabase
    .from("event_registrations")
    .select(`
      id, student_id, event_id, status, registered_at,
      events (*)
    `)
    .eq("student_id", studentId);

  if (error) throw error;

  return (data || []).map((r: any) => ({
    id: r.id,
    student_id: r.student_id,
    event_id: r.event_id,
    status: r.status,
    registered_at: r.registered_at,
    event: r.events,
  }));
}

export async function prepareEventRegistration(studentId: string, eventId: string) {
  const { data, error } = await supabase.rpc("prepare_event_registration", {
    p_student_id: studentId,
    p_event_id: eventId,
  });
  if (error) throw error;
  return data;
}

export async function confirmEventRegistration(draftToken: string) {
  const { data, error } = await supabase.rpc("confirm_event_registration", {
    p_draft_token: draftToken,
  });
  if (error) throw error;
  return data;
}