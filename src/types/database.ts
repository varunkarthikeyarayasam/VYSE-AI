export type UserRole = "student" | "faculty" | "admin";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  created_at: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  roll_number: string;
  department: string;
  year: number;
  section: string;
  home_location: string;
  created_at: string;
}

export interface Faculty {
  id: string;
  department: string;
  designation: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  year: number;
  semester: number;
  credits: number;
  created_at: string;
}

export interface TimetableEntry {
  id: string;
  course_id: string;
  section: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
  faculty_id?: string;
  course_code?: string;
  course_name?: string;
  faculty_name?: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  course_id: string;
  date: string;
  status: "present" | "absent" | "od";
  marked_by?: string;
  created_at: string;
  course_code?: string;
  course_name?: string;
}

export interface Exam {
  id: string;
  course_id: string;
  exam_type: "cat1" | "cat2" | "fat" | "quiz" | "assignment";
  exam_date: string;
  max_marks: number;
  course_code?: string;
  course_name?: string;
}

export interface Mark {
  id: string;
  student_id: string;
  exam_id: string;
  marks_obtained: number;
  created_at: string;
  exam?: Exam;
}

export interface AcademicCalendarItem {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  category: "holiday" | "exam" | "event" | "academic_deadline" | "instructional";
  created_at: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  start_time: string;
  end_time?: string;
  venue: string;
  organizer?: string;
  registration_required: boolean;
  od_available: boolean;
  registration_url?: string;
  status: "draft" | "published" | "cancelled" | "completed";
  created_at: string;
}

export interface EventRegistration {
  id: string;
  student_id: string;
  event_id: string;
  status: "registered" | "cancelled" | "attended";
  registered_at: string;
  event?: CampusEvent;
}

export interface OdRule {
  id: string;
  rule_name: string;
  min_attendance_percent: number;
  applicable_event_types: string[];
  max_od_days_per_semester: number;
  description?: string;
  active: boolean;
  created_at: string;
}

export interface OdRequest {
  id: string;
  student_id: string;
  event_id?: string;
  reason: string;
  from_date: string;
  to_date: string;
  document_url?: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected";
  submitted_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  od_rule_id?: string;
  eligibility_snapshot?: OdEligibilityResult;
  event?: CampusEvent;
  student?: Student;
}

export interface BusRoute {
  id: string;
  route_name: string;
  origin: string;
  destination: string;
  active: boolean;
  is_temporary: boolean;
  valid_from?: string;
  valid_until?: string;
  created_at: string;
  stops?: BusStop[];
}

export interface BusStop {
  id: string;
  route_id: string;
  stop_name: string;
  stop_order: number;
  arrival_time: string;
  latitude?: number;
  longitude?: number;
}

export interface RouteChange {
  id: string;
  route_id: string;
  change_type: "delay" | "cancellation" | "diversion" | "temporary_addition";
  description: string;
  effective_from: string;
  effective_until: string;
  created_by?: string;
  created_at: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  type: "classroom" | "lab" | "department" | "auditorium" | "canteen" | "library" | "office" | "gate" | "other";
  building: string;
  floor?: string;
  description?: string;
  open_time?: string;
  close_time?: string;
  active?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface CampusNotice {
  id: string;
  title: string;
  content: string;
  category: string;
  published_at: string;
  expires_at?: string;
  verified: boolean;
  source?: string;
  created_at: string;
}

export interface MarketplaceItem {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  category: "books" | "electronics" | "furniture" | "uniform" | "other";
  status: "available" | "sold" | "removed";
  images: string[];
  created_at: string;
  seller?: Profile;
}

export interface UserNotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  category: string;
  read: boolean;
  action_url?: string;
  created_at: string;
}

export interface OdEligibilityResult {
  eligible: boolean;
  attendance_percent: number;
  min_required: number;
  od_used_this_semester: number;
  max_allowed: number;
  reasons: string[];
  event_id?: string;
  event_title?: string;
  event_date?: string;
  rule_id?: string;
}

export interface StudentContextResult {
  profile: Student;
  attendance: {
    total_classes: number;
    present_classes: number;
    attendance_percent: number;
    threshold_met: boolean;
  };
  today_timetable: Array<{
    timetable_id: string;
    course_code: string;
    course_name: string;
    start_time: string;
    end_time: string;
    room: string;
    faculty_name: string;
  }>;
  unread_notifications_count: number;
}

export interface ActionCardData {
  type: "action_card";
  action: "confirm_od_request" | "confirm_event_registration";
  draft_token: string;
  title: string;
  event_title: string;
  event_date: string;
  reason?: string;
  attendance_percent?: number;
  status: string;
}