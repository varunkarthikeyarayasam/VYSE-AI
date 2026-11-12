import { supabase } from "../supabase";
import type { Course, TimetableEntry, AttendanceRecord, StudentContextResult, Exam } from "../../types/database";

export async function getStudentContext(studentId: string): Promise<StudentContextResult> {
  const { data, error } = await supabase.rpc("get_student_context", {
    p_student_id: studentId,
  });
  if (error) throw error;
  return data as StudentContextResult;
}

export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("code");
  if (error) throw error;
  return data as Course[];
}

export async function getTimetable(section: string = "B"): Promise<TimetableEntry[]> {
  const { data, error } = await supabase
    .from("timetable")
    .select(`
      id, course_id, section, day_of_week, start_time, end_time, room, faculty_id,
      courses (code, name),
      faculty (profiles (full_name))
    `)
    .eq("section", section)
    .order("day_of_week")
    .order("start_time");

  if (error) throw error;

  return (data || []).map((row: any) => ({
    id: row.id,
    course_id: row.course_id,
    section: row.section,
    day_of_week: row.day_of_week,
    start_time: row.start_time,
    end_time: row.end_time,
    room: row.room,
    faculty_id: row.faculty_id,
    course_code: row.courses?.code,
    course_name: row.courses?.name,
    faculty_name: row.faculty?.profiles?.full_name,
  }));
}

export async function getAttendance(studentId: string): Promise<AttendanceRecord[]> {
  const { data, error } = await supabase
    .from("attendance")
    .select(`
      id, student_id, course_id, date, status, marked_by, created_at,
      courses (code, name)
    `)
    .eq("student_id", studentId)
    .order("date", { ascending: false });

  if (error) throw error;

  return (data || []).map((row: any) => ({
    id: row.id,
    student_id: row.student_id,
    course_id: row.course_id,
    date: row.date,
    status: row.status,
    marked_by: row.marked_by,
    created_at: row.created_at,
    course_code: row.courses?.code,
    course_name: row.courses?.name,
  }));
}

export async function getExams(): Promise<Exam[]> {
  const { data, error } = await supabase
    .from("exams")
    .select(`
      id, course_id, exam_type, exam_date, max_marks,
      courses (code, name)
    `)
    .order("exam_date", { ascending: true });

  if (error) throw error;

  return (data || []).map((row: any) => ({
    id: row.id,
    course_id: row.course_id,
    exam_type: row.exam_type,
    exam_date: row.exam_date,
    max_marks: Number(row.max_marks),
    course_code: row.courses?.code,
    course_name: row.courses?.name,
  }));
}