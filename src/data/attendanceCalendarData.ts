/**
 * SATHYABAMA INSTITUTE OF SCIENCE AND TECHNOLOGY
 * OFFICIAL ACADEMIC ATTENDANCE & DUTY CALENDAR DATASET
 * 
 * Supports both Student (Arjun Kumar / Section C2) and Faculty (Dr. T. Vino / School of Computing)
 * Academic Year 2026–2027 • Odd Semester
 */

export type DayAttendanceStatus = 
  | "present" 
  | "od" 
  | "leave" 
  | "absent" 
  | "weekend" 
  | "holiday";

export interface AttendanceScheduleItem {
  period: string; // e.g. "08:55 - 09:45"
  title: string;  // Course Name or Duty Name
  code?: string;  // "S13BLH21"
  sectionOrRoom?: string; // "Block M - Room C2-301" or "Section C1 Lab"
  staffOrCoordinator?: string;
  type: "lecture" | "lab" | "hackathon" | "duty" | "break" | "research";
}

export interface DayCalendarRecord {
  day: number;
  dateStr: string; // "2026-09-11"
  dayOfWeek: string; // "Friday"
  shortDay: string; // "Fri"
  status: DayAttendanceStatus;
  statusLabel: string; // "Present & Logged" | "Approved On-Duty (OD)" | "Approved Medical Leave" | "Holiday"
  isToday?: boolean;
  rfidPunch?: string; // "07:54 AM (RFID Gate 2)" or "07:48 AM In • 03:35 PM Out"
  location: string;
  dutyOrNotes: string;
  schedule: AttendanceScheduleItem[];
  verifiedBy: string;
}

export interface MonthCalendarData {
  monthName: string; // "September 2026"
  year: number; // 2026
  monthIndex: number; // 8 for Sept (0-indexed)
  totalDays: number; // 30
  firstDayOffset: number; // 2 for Tuesday (0=Sun, 1=Mon, 2=Tue)
  workingDays: number;
  records: Record<number, DayCalendarRecord>;
}

// =========================================================================
// 1. STUDENT CALENDAR — SEPTEMBER 2026 (ARJUN KUMAR, SECTION C2)
// =========================================================================
const STUDENT_SEPTEMBER_SCHEDULE_MAP: Record<string, AttendanceScheduleItem[]> = {
  Monday: [
    { period: "08:55 - 09:45", title: "Discrete Mathematics & Numerical Methods", code: "SMTB1302", sectionOrRoom: "Block M - Room C2-301", staffOrCoordinator: "Dr. Mary Metilda M I", type: "lecture" },
    { period: "09:45 - 10:35", title: "Computer Architecture & Organization", code: "SC5BOB1301", sectionOrRoom: "Block M - Room C2-301", staffOrCoordinator: "Ms. P. Kabitha", type: "lecture" },
    { period: "10:50 - 11:40", title: "Universal Human Values", code: "SISB4301", sectionOrRoom: "Block M - Room C2-301", staffOrCoordinator: "Ms. Leena Sivaguru", type: "lecture" },
    { period: "11:40 - 12:30", title: "Digital Logic Circuit Lab (Batch 1)", code: "S13BLH21", sectionOrRoom: "Virtual Computing Lab (Block M 2nd Fl)", staffOrCoordinator: "Dr. T. Vino", type: "lab" },
  ],
  Tuesday: [
    { period: "08:55 - 09:45", title: "Theory of Computation", code: "SC5B1303", sectionOrRoom: "Block M - Room C2-301", staffOrCoordinator: "Ms. Pavithra Babu", type: "lecture" },
    { period: "09:45 - 10:35", title: "Discrete Mathematics & Numerical Methods", code: "SMTB1302", sectionOrRoom: "Block M - Room C2-301", staffOrCoordinator: "Dr. Mary Metilda M I", type: "lecture" },
    { period: "10:50 - 11:40", title: "Computer Architecture & Organization", code: "SC5BOB1301", sectionOrRoom: "Block M - Room C2-301", staffOrCoordinator: "Ms. P. Kabitha", type: "lecture" },
    { period: "11:40 - 12:30", title: "Programming in Java CSS Lab (Batch 2)", code: "S12BLH31", sectionOrRoom: "Computing Lab 4", staffOrCoordinator: "Dr. M. D. Anto Praveena", type: "lab" },
  ],
  Wednesday: [
    { period: "08:55 - 09:45", title: "Universal Human Values", code: "SISB4301", sectionOrRoom: "Block M - Room C2-301", staffOrCoordinator: "Ms. Leena Sivaguru", type: "lecture" },
    { period: "09:45 - 10:35", title: "Theory of Computation", code: "SC5B1303", sectionOrRoom: "Block M - Room C2-301", staffOrCoordinator: "Ms. Pavithra Babu", type: "lecture" },
    { period: "10:50 - 11:40", title: "Discrete Mathematics & Numerical Methods", code: "SMTB1302", sectionOrRoom: "Block M - Room C2-301", staffOrCoordinator: "Dr. Mary Metilda M I", type: "lecture" },
    { period: "11:40 - 12:30", title: "Digital Logic Circuit Lab (Batch 2)", code: "S13BLH21", sectionOrRoom: "Virtual Computing Lab (Block M 2nd Fl)", staffOrCoordinator: "Dr. T. Vino", type: "lab" },
  ],
  Thursday: [
    { period: "08:55 - 09:45", title: "Computer Architecture & Organization", code: "SC5BOB1301", sectionOrRoom: "Block M - Room C2-301", staffOrCoordinator: "Ms. P. Kabitha", type: "lecture" },
    { period: "09:45 - 10:35", title: "Theory of Computation", code: "SC5B1303", sectionOrRoom: "Block M - Room C2-301", staffOrCoordinator: "Ms. Pavithra Babu", type: "lecture" },
    { period: "10:50 - 11:40", title: "Universal Human Values", code: "SISB4301", sectionOrRoom: "Block M - Room C2-301", staffOrCoordinator: "Ms. Leena Sivaguru", type: "lecture" },
    { period: "11:40 - 12:30", title: "Soft Skills & Aptitude Training", code: "SSB1001", sectionOrRoom: "Placement Seminar Hall", staffOrCoordinator: "Centre for Career Guidance", type: "lecture" },
  ],
  Friday: [
    { period: "08:55 - 09:45", title: "Discrete Mathematics & Numerical Methods", code: "SMTB1302", sectionOrRoom: "Block M - Room C2-301", staffOrCoordinator: "Dr. Mary Metilda M I", type: "lecture" },
    { period: "09:45 - 10:35", title: "Universal Human Values", code: "SISB4301", sectionOrRoom: "Block M - Room C2-301", staffOrCoordinator: "Ms. Leena Sivaguru", type: "lecture" },
    { period: "10:50 - 11:40", title: "Theory of Computation", code: "SC5B1303", sectionOrRoom: "Block M - Room C2-301", staffOrCoordinator: "Ms. Pavithra Babu", type: "lecture" },
    { period: "11:40 - 12:30", title: "Technical Project Lab & Mentorship", code: "PRJ301", sectionOrRoom: "Virtual Computing Lab", staffOrCoordinator: "Dr. T. Vino", type: "lab" },
  ],
};

export function getStudentSeptemberCalendar(): MonthCalendarData {
  const records: Record<number, DayCalendarRecord> = {};
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let d = 1; d <= 30; d++) {
    // Sept 1, 2026 is Tuesday (day of week = 2)
    const dayOfWeekIdx = (2 + (d - 1)) % 7;
    const dayOfWeek = dayNames[dayOfWeekIdx];
    const shortDay = shortDays[dayOfWeekIdx];
    const dateStr = `2026-09-${d.toString().padStart(2, "0")}`;
    const isToday = d === 11;

    let status: DayAttendanceStatus = "present";
    let statusLabel = "Present & Logged";
    let rfidPunch: string | undefined = `07:${48 + (d % 10)} AM (RFID Gate 2)`;
    let location = "Campus Block M - Room C2-301";
    let dutyOrNotes = "Regular 4-Period Academic Instruction Attended";
    let schedule: AttendanceScheduleItem[] = STUDENT_SEPTEMBER_SCHEDULE_MAP[dayOfWeek] || [];
    let verifiedBy = "Ms. Leena Sivaguru (Class Coordinator)";

    // Weekends
    if (dayOfWeekIdx === 0 || (dayOfWeekIdx === 6 && d !== 12 && d !== 26)) {
      status = "weekend";
      statusLabel = "Weekend Recess";
      rfidPunch = undefined;
      location = "Campus Closed (Hostel / Day Scholar)";
      dutyOrNotes = "Non-instructional weekend break";
      schedule = [];
      verifiedBy = "Dean Academics";
    }

    // Specific Special Dates
    if (d === 10) {
      // Approved Medical Leave
      status = "leave";
      statusLabel = "Approved Medical Leave";
      rfidPunch = "Leave Certificate #MED-2026-849";
      location = "Off-Campus";
      dutyOrNotes = "Medical certificate submitted to Class Coordinator Ms. Leena Sivaguru";
      schedule = [];
      verifiedBy = "Dr. A. Viji Amutha Mary (Year Coordinator)";
    } else if (d === 11) {
      // TODAY: CodeSprint Hackathon On-Duty (OD)
      status = "od";
      statusLabel = "Approved On-Duty (OD) - Hackathon";
      rfidPunch = "08:15 AM (Auditorium Main Biometric)";
      location = "Main Auditorium & Innovation Lab";
      dutyOrNotes = "Official OD granted for Code Sprint 24-Hour Hackathon (Ref: OD-2026-CS01)";
      schedule = [
        { period: "09:00 - 10:30", title: "Code Sprint Hackathon: Inauguration & Problem Statements", sectionOrRoom: "Main Auditorium", staffOrCoordinator: "Innovation Cell", type: "hackathon" },
        { period: "10:30 - 01:00", title: "Sprint Phase 1: Architecture & AI Integration", sectionOrRoom: "Lab 7 (Block M)", staffOrCoordinator: "Tech Mentors", type: "hackathon" },
        { period: "01:00 - 02:00", title: "Working Lunch & Jury Checkpoint", sectionOrRoom: "Auditorium Hall", staffOrCoordinator: "Hackathon Conveners", type: "break" },
        { period: "02:00 - 06:00", title: "Sprint Phase 2: Rapid Prototyping", sectionOrRoom: "Lab 7", staffOrCoordinator: "Dr. T. Vino (Jury)", type: "hackathon" },
      ];
      verifiedBy = "Dr. T. Vino (OD Approver / CSE Dept)";
    } else if (d === 12) {
      // Day 2 of Hackathon On-Duty
      status = "od";
      statusLabel = "Approved On-Duty (OD) - Hackathon Day 2";
      rfidPunch = "08:30 AM (Auditorium Checkpoint)";
      location = "Main Auditorium & Innovation Lab";
      dutyOrNotes = "Code Sprint 24-Hour Hackathon Final Pitching & Evaluation";
      schedule = [
        { period: "09:00 - 12:00", title: "Hackathon Code Freeze & Demo Submissions", sectionOrRoom: "Innovation Lab", staffOrCoordinator: "Tech Panel", type: "hackathon" },
        { period: "01:30 - 04:30", title: "Grand Finale Jury Pitches & Award Ceremony", sectionOrRoom: "Main Auditorium", staffOrCoordinator: "Dr. T. Vino & Dean", type: "hackathon" },
      ];
      verifiedBy = "Dr. T. Vino (OD Approver)";
    } else if (d === 19) {
      // University Holiday (Milad-un-Nabi)
      status = "holiday";
      statusLabel = "Official University Holiday";
      rfidPunch = undefined;
      location = "Campus Closed";
      dutyOrNotes = "Public Holiday observed across Sathyabama campus";
      schedule = [];
      verifiedBy = "Registrar Secretariat";
    }

    records[d] = {
      day: d,
      dateStr,
      dayOfWeek,
      shortDay,
      status,
      statusLabel,
      isToday,
      rfidPunch,
      location,
      dutyOrNotes,
      schedule,
      verifiedBy,
    };
  }

  return {
    monthName: "September 2026",
    year: 2026,
    monthIndex: 8,
    totalDays: 30,
    firstDayOffset: 2, // Sept 1 is Tuesday
    workingDays: 22,
    records,
  };
}

// =========================================================================
// 2. FACULTY CALENDAR — SEPTEMBER 2026 (DR. T. VINO, FAC-1042)
// =========================================================================
const FACULTY_SEPTEMBER_SCHEDULE_MAP: Record<string, AttendanceScheduleItem[]> = {
  Monday: [
    { period: "09:00 - 10:00", title: "Digital Logic Circuit", code: "S13BLH21", sectionOrRoom: "Block M - Room 201 (Sec A1)", staffOrCoordinator: "Dr. T. Vino", type: "lecture" },
    { period: "10:00 - 11:00", title: "Digital Logic Circuit Lab", code: "S13BLH21", sectionOrRoom: "Virtual Comp Lab (Sec C2)", staffOrCoordinator: "Dr. T. Vino", type: "lab" },
    { period: "01:25 - 02:15", title: "Microprocessor Lab", code: "S13BLH21", sectionOrRoom: "Block M - Room 306 (Sec D3)", staffOrCoordinator: "Dr. T. Vino", type: "lab" },
    { period: "02:15 - 03:05", title: "Digital Electronics Theory", code: "S13BLH21", sectionOrRoom: "Block M - Room 204 (Sec E1)", staffOrCoordinator: "Dr. T. Vino", type: "lecture" },
  ],
  Tuesday: [
    { period: "08:55 - 09:45", title: "Digital Systems Lab", code: "S13BLH21", sectionOrRoom: "Virtual Comp Lab (Sec B1)", staffOrCoordinator: "Dr. T. Vino", type: "lab" },
    { period: "10:50 - 11:40", title: "Computer Architecture Theory", code: "S13BLH21", sectionOrRoom: "Block M - Room 301 (Sec B2)", staffOrCoordinator: "Dr. T. Vino", type: "lecture" },
    { period: "11:40 - 12:30", title: "Digital Logic Design", code: "S13BLH21", sectionOrRoom: "Block M - Room 205 (Sec E2)", staffOrCoordinator: "Dr. T. Vino", type: "lecture" },
    { period: "02:15 - 03:05", title: "Switching Theory & Logic Lab", code: "S13BLH21", sectionOrRoom: "Virtual Comp Lab (Sec C3)", staffOrCoordinator: "Dr. T. Vino", type: "lab" },
  ],
  Wednesday: [
    { period: "08:55 - 09:45", title: "Digital Logic Design Lab", code: "S13BLH21", sectionOrRoom: "Virtual Comp Lab (Sec C1)", staffOrCoordinator: "Dr. T. Vino", type: "lab" },
    { period: "09:45 - 10:35", title: "Hardware Description Language", code: "S13BLH21", sectionOrRoom: "Block M - Room 202 (Sec A2)", staffOrCoordinator: "Dr. T. Vino", type: "lecture" },
    { period: "11:40 - 12:30", title: "Digital Circuits Theory", code: "S13BLH21", sectionOrRoom: "Block M - Room 304 (Sec D1)", staffOrCoordinator: "Dr. T. Vino", type: "lecture" },
    { period: "01:25 - 02:15", title: "Microprocessor & Interfacing", code: "S13BLH21", sectionOrRoom: "Block M - Room 305 (Sec D2)", staffOrCoordinator: "Dr. T. Vino", type: "lecture" },
  ],
  Thursday: [
    { period: "08:55 - 09:45", title: "Digital Logic Circuit Lab", code: "S13BLH21", sectionOrRoom: "Virtual Comp Lab (Sec C2)", staffOrCoordinator: "Dr. T. Vino", type: "lab" },
    { period: "10:50 - 11:40", title: "Combinational Circuit Analysis", code: "S13BLH21", sectionOrRoom: "Block M - Room 203 (Sec A3)", staffOrCoordinator: "Dr. T. Vino", type: "lecture" },
    { period: "11:40 - 12:30", title: "VLSI Design Principles", code: "S13BLH21", sectionOrRoom: "Block M - Room 302 (Sec B3)", staffOrCoordinator: "Dr. T. Vino", type: "lecture" },
    { period: "02:15 - 03:05", title: "Sequential Circuits Lab", code: "S13BLH21", sectionOrRoom: "Virtual Comp Lab (Sec E3)", staffOrCoordinator: "Dr. T. Vino", type: "lab" },
  ],
  Friday: [
    { period: "08:55 - 09:45", title: "Digital Logic Circuit Lab", code: "S13BLH21", sectionOrRoom: "Block M - Room 303 (Sec C1)", staffOrCoordinator: "Dr. T. Vino", type: "lab" },
    { period: "09:45 - 10:35", title: "Logic Design Theory", code: "S13BLH21", sectionOrRoom: "Block M - Room 302 (Sec B3)", staffOrCoordinator: "Dr. T. Vino", type: "lecture" },
    { period: "11:45 - 12:35", title: "Computer Organization & Design", code: "S13BLH21", sectionOrRoom: "Virtual Comp Lab (Sec E3)", staffOrCoordinator: "Dr. T. Vino", type: "lab" },
    { period: "12:35 - 01:25", title: "Microprocessor Architecture", code: "S13BLH21", sectionOrRoom: "Block M - Room 306 (Sec D3)", staffOrCoordinator: "Dr. T. Vino", type: "lecture" },
    { period: "01:25 - 02:15", title: "Digital Circuit Verification", code: "S13BLH21", sectionOrRoom: "Block M - Room 201 (Sec A1)", staffOrCoordinator: "Dr. T. Vino", type: "lecture" },
  ],
};

export function getFacultySeptemberCalendar(): MonthCalendarData {
  const records: Record<number, DayCalendarRecord> = {};
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let d = 1; d <= 30; d++) {
    const dayOfWeekIdx = (2 + (d - 1)) % 7;
    const dayOfWeek = dayNames[dayOfWeekIdx];
    const shortDay = shortDays[dayOfWeekIdx];
    const dateStr = `2026-09-${d.toString().padStart(2, "0")}`;
    const isToday = d === 11;

    let status: DayAttendanceStatus = "present";
    let statusLabel = "Duty Logged & Verified";
    let rfidPunch: string | undefined = `07:${45 + (d % 8)} AM In • 03:${30 + (d % 15)} PM Out (Block M Staff Terminal)`;
    let location = "Block M (School of Computing) • Cabin 204";
    let dutyOrNotes = "Full teaching periods and student laboratory sessions conducted";
    let schedule: AttendanceScheduleItem[] = FACULTY_SEPTEMBER_SCHEDULE_MAP[dayOfWeek] || [];
    let verifiedBy = "Head of Department (CSE) & Dean Office";

    if (dayOfWeekIdx === 0 || (dayOfWeekIdx === 6 && d !== 12)) {
      status = "weekend";
      statusLabel = "Weekend Academic Recess";
      rfidPunch = undefined;
      location = "Faculty Residence / Quarters";
      dutyOrNotes = "Non-instructional weekend break";
      schedule = [];
      verifiedBy = "Dean Academic Administration";
    }

    if (d === 11) {
      // TODAY (Friday): 5 full teaching periods
      status = "present";
      statusLabel = "Full Teaching Duty (5 Sessions)";
      rfidPunch = "07:48 AM In • 03:35 PM Out (Block M Staff Terminal)";
      location = "Block M Virtual Computing Lab & Rooms 303, 302, 306, 201";
      dutyOrNotes = "Conducted 5 teaching periods across Sections C1, B3, E3, D3, A1";
      schedule = FACULTY_SEPTEMBER_SCHEDULE_MAP.Friday;
      verifiedBy = "Dr. L. Lakshmanan (Dean, School of Computing)";
    } else if (d === 12) {
      // Saturday: OD Jury Evaluator for CodeSprint Hackathon
      status = "od";
      statusLabel = "Approved Academic OD (Hackathon Jury)";
      rfidPunch = "08:20 AM In • 05:15 PM Out (Auditorium Terminal)";
      location = "Main Auditorium & Computing Innovation Hub";
      dutyOrNotes = "Chief Technical Judge & Mentor for National CodeSprint 24-Hour Hackathon";
      schedule = [
        { period: "09:00 - 12:30", title: "Hackathon Evaluation Session: AI & Systems Track", sectionOrRoom: "Innovation Lab", staffOrCoordinator: "Dr. T. Vino (Lead Judge)", type: "duty" },
        { period: "02:00 - 05:00", title: "Final Stage Jury Scoring & Award Validation", sectionOrRoom: "Main Auditorium Stage", staffOrCoordinator: "Jury Board", type: "duty" },
      ];
      verifiedBy = "Centre for Innovation & Dean Office";
    } else if (d === 17) {
      // Authorized Cabin Research Leave
      status = "leave";
      statusLabel = "Authorized Cabin Research / Casual Leave";
      rfidPunch = "Approved Leave App #FAC-LV-2026-104";
      location = "Staff Cabin 204 / Library Digital Archive";
      dutyOrNotes = "Curriculum Board Board-of-Studies review & IEEE Conference manuscript preparation";
      schedule = [
        { period: "10:00 - 01:00", title: "Board of Studies Syllabus Moderation", sectionOrRoom: "Conference Hall 2", staffOrCoordinator: "CSE Curriculum Board", type: "research" },
      ];
      verifiedBy = "Dean, School of Computing";
    } else if (d === 19) {
      status = "holiday";
      statusLabel = "Official University Holiday";
      rfidPunch = undefined;
      location = "Campus Closed";
      dutyOrNotes = "Public Holiday (Milad-un-Nabi)";
      schedule = [];
      verifiedBy = "Registrar Secretariat";
    }

    records[d] = {
      day: d,
      dateStr,
      dayOfWeek,
      shortDay,
      status,
      statusLabel,
      isToday,
      rfidPunch,
      location,
      dutyOrNotes,
      schedule,
      verifiedBy,
    };
  }

  return {
    monthName: "September 2026",
    year: 2026,
    monthIndex: 8,
    totalDays: 30,
    firstDayOffset: 2,
    workingDays: 22,
    records,
  };
}

// =========================================================================
// 3. AUGUST 2026 & OCTOBER 2026 GENERATORS
// =========================================================================
export function getStudentAugustCalendar(): MonthCalendarData {
  const records: Record<number, DayCalendarRecord> = {};
  for (let d = 1; d <= 31; d++) {
    // Aug 1, 2026 is Saturday (offset = 6)
    const dayOfWeekIdx = (6 + (d - 1)) % 7;
    const isWeekend = dayOfWeekIdx === 0 || dayOfWeekIdx === 6;
    records[d] = {
      day: d,
      dateStr: `2026-08-${d.toString().padStart(2, "0")}`,
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeekIdx],
      shortDay: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeekIdx],
      status: isWeekend ? "weekend" : "present",
      statusLabel: isWeekend ? "Weekend Recess" : "Present & Attended",
      location: isWeekend ? "Campus Closed" : "Block M - Room C2-301",
      dutyOrNotes: isWeekend ? "Weekend Break" : "Regular Academic Periods Attended",
      schedule: isWeekend ? [] : STUDENT_SEPTEMBER_SCHEDULE_MAP.Monday,
      verifiedBy: "Ms. Leena Sivaguru",
    };
  }
  return {
    monthName: "August 2026",
    year: 2026,
    monthIndex: 7,
    totalDays: 31,
    firstDayOffset: 6, // Aug 1 is Saturday
    workingDays: 21,
    records,
  };
}

export function getStudentOctoberCalendar(): MonthCalendarData {
  const records: Record<number, DayCalendarRecord> = {};
  for (let d = 1; d <= 31; d++) {
    // Oct 1, 2026 is Thursday (offset = 4)
    const dayOfWeekIdx = (4 + (d - 1)) % 7;
    const isWeekend = dayOfWeekIdx === 0 || dayOfWeekIdx === 6;
    records[d] = {
      day: d,
      dateStr: `2026-10-${d.toString().padStart(2, "0")}`,
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeekIdx],
      shortDay: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeekIdx],
      status: isWeekend ? "weekend" : "present",
      statusLabel: isWeekend ? "Weekend Recess" : "Upcoming Scheduled Class",
      location: isWeekend ? "Campus Closed" : "Block M - Room C2-301",
      dutyOrNotes: isWeekend ? "Weekend Break" : "Scheduled Odd Semester Syllabus Track",
      schedule: isWeekend ? [] : STUDENT_SEPTEMBER_SCHEDULE_MAP.Monday,
      verifiedBy: "Ms. Leena Sivaguru",
    };
  }
  return {
    monthName: "October 2026",
    year: 2026,
    monthIndex: 9,
    totalDays: 31,
    firstDayOffset: 4, // Oct 1 is Thursday
    workingDays: 22,
    records,
  };
}

export function getFacultyAugustCalendar(): MonthCalendarData {
  const records: Record<number, DayCalendarRecord> = {};
  for (let d = 1; d <= 31; d++) {
    const dayOfWeekIdx = (6 + (d - 1)) % 7;
    const isWeekend = dayOfWeekIdx === 0 || dayOfWeekIdx === 6;
    records[d] = {
      day: d,
      dateStr: `2026-08-${d.toString().padStart(2, "0")}`,
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeekIdx],
      shortDay: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeekIdx],
      status: isWeekend ? "weekend" : "present",
      statusLabel: isWeekend ? "Weekend Recess" : "Teaching Duty Logged",
      location: isWeekend ? "Residence" : "Block M - School of Computing",
      dutyOrNotes: isWeekend ? "Weekend Recess" : "All assigned curriculum periods completed",
      schedule: isWeekend ? [] : FACULTY_SEPTEMBER_SCHEDULE_MAP.Monday,
      verifiedBy: "Dean, School of Computing",
    };
  }
  return {
    monthName: "August 2026",
    year: 2026,
    monthIndex: 7,
    totalDays: 31,
    firstDayOffset: 6,
    workingDays: 21,
    records,
  };
}

export function getFacultyOctoberCalendar(): MonthCalendarData {
  const records: Record<number, DayCalendarRecord> = {};
  for (let d = 1; d <= 31; d++) {
    const dayOfWeekIdx = (4 + (d - 1)) % 7;
    const isWeekend = dayOfWeekIdx === 0 || dayOfWeekIdx === 6;
    records[d] = {
      day: d,
      dateStr: `2026-10-${d.toString().padStart(2, "0")}`,
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeekIdx],
      shortDay: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeekIdx],
      status: isWeekend ? "weekend" : "present",
      statusLabel: isWeekend ? "Weekend Recess" : "Scheduled Teaching Duty",
      location: isWeekend ? "Residence" : "Block M - School of Computing",
      dutyOrNotes: isWeekend ? "Weekend Recess" : "Odd Semester Teaching Schedule",
      schedule: isWeekend ? [] : FACULTY_SEPTEMBER_SCHEDULE_MAP.Monday,
      verifiedBy: "Dean, School of Computing",
    };
  }
  return {
    monthName: "October 2026",
    year: 2026,
    monthIndex: 9,
    totalDays: 31,
    firstDayOffset: 4,
    workingDays: 22,
    records,
  };
}
