import { supabase } from "../supabase";
import type { OdRequest, OdEligibilityResult } from "../../types/database";

export async function checkOdEligibility(
  studentId: string,
  eventId: string
): Promise<OdEligibilityResult> {
  const { data, error } = await supabase.rpc("check_od_eligibility", {
    p_student_id: studentId,
    p_event_id: eventId,
  });
  if (error) throw error;
  return data as OdEligibilityResult;
}

export async function prepareOdRequest(params: {
  studentId: string;
  eventId: string;
  reason: string;
  fromDate: string;
  toDate: string;
  documentUrl?: string;
}) {
  const { data, error } = await supabase.rpc("prepare_od_request", {
    p_student_id: params.studentId,
    p_event_id: params.eventId,
    p_reason: params.reason,
    p_from_date: params.fromDate,
    p_to_date: params.toDate,
    p_document_url: params.documentUrl || null,
  });
  if (error) throw error;
  return data;
}

export async function confirmOdRequest(draftToken: string): Promise<OdRequest> {
  const { data, error } = await supabase.rpc("confirm_od_request", {
    p_draft_token: draftToken,
  });
  if (error) throw error;
  return data as OdRequest;
}

export async function getStudentOdRequests(studentId: string): Promise<OdRequest[]> {
  const { data, error } = await supabase
    .from("od_requests")
    .select(`
      *,
      events (id, title, event_date, venue)
    `)
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false });

  if (error) throw error;
  return (data || []).map((row: any) => ({
    ...row,
    event: row.events,
  })) as OdRequest[];
}

export async function getAdminOdRequests(statusFilter?: string): Promise<OdRequest[]> {
  const { data, error } = await supabase.rpc("admin_list_od_requests", {
    p_status: statusFilter || null,
  });
  if (error) throw error;

  return (data || []).map((r: any) => ({
    id: r.od_request_id,
    student_id: r.student_id,
    event_id: r.event_id,
    reason: r.reason,
    from_date: r.from_date,
    to_date: r.to_date,
    status: r.status,
    submitted_at: r.submitted_at,
    event: {
      id: r.event_id,
      title: r.event_title,
    },
    student: {
      id: r.student_id,
      name: r.student_name,
      roll_number: r.roll_number,
    },
  })) as OdRequest[];
}

export async function reviewOdRequest(
  odRequestId: string,
  decision: "approved" | "rejected" | "under_review",
  rejectionReason?: string
): Promise<OdRequest> {
  const { data, error } = await supabase.rpc("review_od_request", {
    p_od_request_id: odRequestId,
    p_decision: decision,
    p_rejection_reason: rejectionReason || null,
  });
  if (error) throw error;
  return data as OdRequest;
}

export async function uploadOdDocument(file: File, studentId: string): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const filePath = `${studentId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("od-documents")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  // Generate private signed URL valid for 7 days
  const { data, error: signedError } = await supabase.storage
    .from("od-documents")
    .createSignedUrl(filePath, 60 * 60 * 24 * 7);

  if (signedError) throw signedError;
  return data.signedUrl;
}