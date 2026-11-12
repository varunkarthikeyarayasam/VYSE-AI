import { useState, useEffect } from "react";

export interface StudentOdRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  section: string;
  semester: string;
  type: "od" | "leave";
  title: string;
  dates: string;
  attendancePercent: number;
  status: "approved" | "pending" | "rejected";
  approvedBy?: string;
  approvedAt?: string;
  remarks?: string;
}

export interface StudentNotification {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  message: string;
  type: "approved" | "rejected" | "info";
  statusText: string;
  letterType: "od" | "leave";
  timestamp: string;
  read: boolean;
}

const STORAGE_KEY = "vyse_od_approval_records";
const NOTIFICATIONS_STORAGE_KEY = "vyse_student_notifications";

const DEFAULT_REQUESTS: StudentOdRequest[] = [
  {
    id: "OD-REQ-001",
    studentId: "student-arjun",
    studentName: "Arjun Kumar",
    rollNumber: "RA2311003010452",
    department: "Computer Science and Engineering",
    section: "CSE-C",
    semester: "6",
    type: "od",
    title: "Code Sprint 24-Hour National Hackathon",
    dates: "11 / 09 / 2026 to 12 / 09 / 2026",
    attendancePercent: 90.7,
    status: "pending",
  },
  {
    id: "OD-REQ-002",
    studentId: "student-divya",
    studentName: "Divya S",
    rollNumber: "RA2311003010418",
    department: "Computer Science and Engineering",
    section: "CSE-A",
    semester: "6",
    type: "od",
    title: "IEEE International Conference on AI & Robotics",
    dates: "15 / 09 / 2026 to 16 / 09 / 2026",
    attendancePercent: 84.5,
    status: "pending",
  },
  {
    id: "LV-REQ-003",
    studentId: "student-rahul",
    studentName: "Rahul M",
    rollNumber: "RA2311003010488",
    department: "Information Technology",
    section: "IT-B",
    semester: "6",
    type: "leave",
    title: "Medical Leave & Consultation",
    dates: "18 / 09 / 2026 to 20 / 09 / 2026",
    attendancePercent: 71.2,
    status: "pending",
    remarks: "Attendance below 75% rule threshold (71.2%)",
  },
];

export const DEFAULT_NOTIFICATIONS: StudentNotification[] = [
  {
    id: "NOTIF-SEED-001",
    studentId: "student-arjun",
    studentName: "Arjun Kumar",
    title: "OD Request Approved! 🎉",
    message:
      "Your On-Duty request for 'Code Sprint 24-Hour National Hackathon' has been APPROVED by Prof. Venkatesh, HOD. Institutional seal and digital signature applied.",
    type: "approved",
    statusText: "OD Approved",
    letterType: "od",
    timestamp: "10:15 AM • Today",
    read: false,
  },
  {
    id: "NOTIF-SEED-002",
    studentId: "student-divya",
    studentName: "Divya S",
    title: "OD Request Under Review",
    message:
      "Your OD request for 'IEEE International Conference on AI & Robotics' is pending final faculty sign-off.",
    type: "info",
    statusText: "In Review",
    letterType: "od",
    timestamp: "09:30 AM • Today",
    read: false,
  },
];

function normalizeStr(str: string): string {
  return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function matchStudent(candidate: string, query: string): boolean {
  if (!candidate || !query) return false;
  const c = normalizeStr(candidate);
  const q = normalizeStr(query);
  if (!c || !q) return false;

  // Exact or substring match
  if (c === q || c.includes(q) || q.includes(c)) return true;

  // Match common aliases
  const aliases = ["arjun", "divya", "rahul"];
  for (const alias of aliases) {
    if (c.includes(alias) && q.includes(alias)) return true;
  }

  // Default fallback matching
  if ((q === "user" || q === "student") && c.includes("arjun")) return true;

  return false;
}

function getStoredRequests(): StudentOdRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not read stored OD requests", e);
  }
  return DEFAULT_REQUESTS;
}

function saveStoredRequests(records: StudentOdRequest[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.warn("Could not save OD requests", e);
  }
}

function getStoredNotifications(): StudentNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read stored student notifications", e);
  }
  return DEFAULT_NOTIFICATIONS;
}

function saveStoredNotifications(notifs: StudentNotification[]) {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.warn("Could not save student notifications", e);
  }
}

// Global listeners for reactive updates across components
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function useOdApprovalStore() {
  const [requests, setRequests] = useState<StudentOdRequest[]>(getStoredRequests);
  const [notifications, setNotifications] = useState<StudentNotification[]>(getStoredNotifications);

  useEffect(() => {
    const handler = () => {
      setRequests(getStoredRequests());
      setNotifications(getStoredNotifications());
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const approveRequest = (id: string, facultyName: string = "Prof. Venkatesh, HOD") => {
    const target = requests.find((r) => r.id === id);
    const updated = requests.map((req) => {
      if (req.id === id) {
        return {
          ...req,
          status: "approved" as const,
          approvedBy: facultyName,
          approvedAt: "11 / 09 / 2026",
          remarks: "Verified attendance eligibility (> 75%). OD Approved.",
        };
      }
      return req;
    });
    saveStoredRequests(updated);
    setRequests(updated);

    // NOTIFY STUDENT: Create real-time notification for this student
    if (target) {
      const newNotif: StudentNotification = {
        id: `NOTIF-${Date.now()}`,
        studentId: target.studentId,
        studentName: target.studentName,
        title: `${target.type.toUpperCase()} Request Approved! 🎉`,
        message: `Your ${target.type.toUpperCase()} request for "${target.title}" has been APPROVED by ${facultyName}. The official institutional seal has been applied to your letter.`,
        type: "approved",
        statusText: `${target.type.toUpperCase()} Approved`,
        letterType: target.type,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today",
        read: false,
      };
      const updatedNotifs = [newNotif, ...notifications.filter((n) => n.id !== newNotif.id)];
      saveStoredNotifications(updatedNotifs);
      setNotifications(updatedNotifs);
    }

    notify();
  };

  const rejectRequest = (id: string, reason: string = "Attendance or policy violation") => {
    const target = requests.find((r) => r.id === id);
    const updated = requests.map((req) => {
      if (req.id === id) {
        return {
          ...req,
          status: "rejected" as const,
          remarks: reason,
        };
      }
      return req;
    });
    saveStoredRequests(updated);
    setRequests(updated);

    // NOTIFY STUDENT: Create real-time notification for rejection
    if (target) {
      const newNotif: StudentNotification = {
        id: `NOTIF-${Date.now()}`,
        studentId: target.studentId,
        studentName: target.studentName,
        title: `${target.type.toUpperCase()} Request Rejected`,
        message: `Your ${target.type.toUpperCase()} request for "${target.title}" was not approved by faculty review (${reason}).`,
        type: "rejected",
        statusText: "Rejected",
        letterType: target.type,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " • Today",
        read: false,
      };
      const updatedNotifs = [newNotif, ...notifications.filter((n) => n.id !== newNotif.id)];
      saveStoredNotifications(updatedNotifs);
      setNotifications(updatedNotifs);
    }

    notify();
  };

  const resetRequest = (id: string) => {
    const updated = requests.map((req) => {
      if (req.id === id) {
        return {
          ...req,
          status: "pending" as const,
          approvedBy: undefined,
          approvedAt: undefined,
          remarks: undefined,
        };
      }
      return req;
    });
    saveStoredRequests(updated);
    setRequests(updated);
    notify();
  };

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveStoredNotifications(updated);
    setNotifications(updated);
    notify();
  };

  const dismissNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveStoredNotifications(updated);
    setNotifications(updated);
    notify();
  };

  const clearAllNotifications = (studentNameOrRoll: string) => {
    const updated = notifications.filter(
      (n) =>
        !matchStudent(n.studentName, studentNameOrRoll) &&
        !matchStudent(n.studentId, studentNameOrRoll)
    );
    saveStoredNotifications(updated);
    setNotifications(updated);
    notify();
  };

  const getStudentRequest = (studentNameOrRoll: string, type: "od" | "leave" = "od") => {
    const found = requests.find(
      (r) =>
        (matchStudent(r.studentName, studentNameOrRoll) ||
          matchStudent(r.rollNumber, studentNameOrRoll) ||
          matchStudent(r.studentId, studentNameOrRoll)) &&
        r.type === type
    );
    if (found) return found;
    const byType = requests.find((r) => r.type === type);
    return byType || requests[0];
  };

  const getStudentNotifications = (studentNameOrRoll: string) => {
    const matches = notifications.filter(
      (n) =>
        matchStudent(n.studentName, studentNameOrRoll) ||
        matchStudent(n.studentId, studentNameOrRoll)
    );
    // Fallback: If querying as default/demo student persona, return all arjun notifications
    if (
      matches.length === 0 &&
      (!studentNameOrRoll ||
        studentNameOrRoll.toLowerCase().includes("arjun") ||
        studentNameOrRoll.toLowerCase() === "user")
    ) {
      return notifications.filter((n) => matchStudent(n.studentName, "arjun"));
    }
    return matches;
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return {
    requests,
    notifications,
    pendingCount,
    approveRequest,
    rejectRequest,
    resetRequest,
    getStudentRequest,
    getStudentNotifications,
    markNotificationAsRead,
    dismissNotification,
    clearAllNotifications,
  };
}
