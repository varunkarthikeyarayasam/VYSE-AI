/**
 * SATHYABAMA INSTITUTE OF SCIENCE AND TECHNOLOGY
 * SCHOOL OF COMPUTING | FACULTY TIMETABLE | ODD SEMESTER 2026-2027
 * FACULTY: Dr. T. Vino
 * 
 * Verbatim dataset extracted from official faculty allocation circular.
 */

export interface FacultyPeriod {
  periodNumber: number;
  timeSlot: string; // e.g. "9.00-10.00"
  startTime: string; // e.g. "09:00 AM"
  endTime: string;   // e.g. "10:00 AM"
  section: string | null; // e.g. "A1", "C2", null if free
  courseCode: string;
  courseName: string;
  roomOrLab: string;
  type: "lab" | "theory" | "break" | "lunch" | "free";
  topic?: string;
  studentBatch?: string;
}

export interface FacultyDaySchedule {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  periods: FacultyPeriod[];
  totalTeachingHours: number;
}

export const FACULTY_METADATA = {
  institution: "SATHYABAMA INSTITUTE OF SCIENCE AND TECHNOLOGY",
  school: "SCHOOL OF COMPUTING",
  department: "Department of Computer Science and Engineering",
  academicYear: "ODD SEMESTER 2026-2027",
  facultyName: "Dr. T. Vino",
  staffId: "FAC-1042",
  designation: "Associate Professor & Digital Logic Lab Lead",
  primaryCourseCode: "S13BLH21",
  primaryCourseName: "Digital Logic Circuit (Virtual Computing Lab)",
  totalWeeklyTeachingHours: 21,
  allocatedSections: ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3", "D1", "D2", "D3", "E1", "E2", "E3"],
  cabinLocation: "Staff Cabin 204, 2nd Floor, Block M (School of Computing)",
  email: "t.vino@sathyabama.ac.in",
  phone: "+91 94440 82194",
  note: "Demo allocation — sections may range from A1 through E3.",
};

// Section room mapping in Block M
const SECTION_LOCATIONS: Record<string, string> = {
  A1: "Block M - Room 201 (Theory) / Virtual Comp Lab",
  A2: "Block M - Room 202 (Theory)",
  A3: "Block M - Room 203 (Theory)",
  B1: "Virtual Computing Lab (Block M 2nd Floor)",
  B2: "Block M - Room 301 (Theory)",
  B3: "Block M - Room 302 (Theory)",
  C1: "Block M - Room 303 (Theory)",
  C2: "Virtual Computing Lab (Block M 2nd Floor) / Room C2-301",
  C3: "Virtual Computing Lab (Block M 2nd Floor)",
  D1: "Block M - Room 304 (Theory)",
  D2: "Block M - Room 305 (Theory)",
  D3: "Block M - Room 306 (Theory)",
  E1: "Block M - Room 204 (Theory)",
  E2: "Block M - Room 205 (Theory)",
  E3: "Virtual Computing Lab (Block M 2nd Floor)",
};

export const FACULTY_WEEKLY_TIMETABLE: FacultyDaySchedule[] = [
  // =========================================================================
  // MONDAY: A1, C2, BREAK, LUNCH, D3, E1
  // =========================================================================
  {
    day: "Monday",
    totalTeachingHours: 4,
    periods: [
      {
        periodNumber: 1,
        timeSlot: "9.00-10.00",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        section: "A1",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.A1,
        type: "theory",
        topic: "Boolean Algebra Simplification & Logic Gates",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 2,
        timeSlot: "10.00-11.00",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        section: "C2",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit (Lab)",
        roomOrLab: SECTION_LOCATIONS.C2,
        type: "lab",
        topic: "Combinational Logic & Adders Simulation",
        studentBatch: "B.E CSE 2025-2029 (Sem III - Sec C2)",
      },
      {
        periodNumber: 3,
        timeSlot: "11.00-11.15",
        startTime: "11:00 AM",
        endTime: "11:15 AM",
        section: null,
        courseCode: "RECESS",
        courseName: "Morning Tea Break",
        roomOrLab: "Faculty Lounge / Staff Room",
        type: "break",
      },
      {
        periodNumber: 4,
        timeSlot: "11.15-12.15",
        startTime: "11:15 AM",
        endTime: "12:15 PM",
        section: null,
        courseCode: "LUNCH",
        courseName: "Institutional Lunch Recess",
        roomOrLab: "Staff Dining Hall",
        type: "lunch",
      },
      {
        periodNumber: 5,
        timeSlot: "12.15-1.15",
        startTime: "12:15 PM",
        endTime: "01:15 PM",
        section: "D3",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.D3,
        type: "theory",
        topic: "Karnaugh Maps 4-Variable Minimization",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 6,
        timeSlot: "1.15-2.15",
        startTime: "01:15 PM",
        endTime: "02:15 PM",
        section: "E1",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.E1,
        type: "theory",
        topic: "NAND/NOR Universal Gate Implementations",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 7,
        timeSlot: "2.15-3.15",
        startTime: "02:15 PM",
        endTime: "03:15 PM",
        section: null,
        courseCode: "FREE",
        courseName: "Research & Project Mentoring Hours",
        roomOrLab: "Cabin 204 (Block M)",
        type: "free",
      },
    ],
  },

  // =========================================================================
  // TUESDAY: B2, (FREE), BREAK, LUNCH, C3, E3, D1
  // =========================================================================
  {
    day: "Tuesday",
    totalTeachingHours: 4,
    periods: [
      {
        periodNumber: 1,
        timeSlot: "9.00-10.00",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        section: "B2",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.B2,
        type: "theory",
        topic: "Multiplexers 4:1 and 8:1 Design",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 2,
        timeSlot: "10.00-11.00",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        section: null,
        courseCode: "FREE",
        courseName: "Student Academic Mentoring & Office Hours",
        roomOrLab: "Cabin 204 (Block M)",
        type: "free",
      },
      {
        periodNumber: 3,
        timeSlot: "11.00-11.15",
        startTime: "11:00 AM",
        endTime: "11:15 AM",
        section: null,
        courseCode: "RECESS",
        courseName: "Morning Tea Break",
        roomOrLab: "Faculty Lounge",
        type: "break",
      },
      {
        periodNumber: 4,
        timeSlot: "11.15-12.15",
        startTime: "11:15 AM",
        endTime: "12:15 PM",
        section: null,
        courseCode: "LUNCH",
        courseName: "Institutional Lunch Recess",
        roomOrLab: "Staff Dining Hall",
        type: "lunch",
      },
      {
        periodNumber: 5,
        timeSlot: "12.15-1.15",
        startTime: "12:15 PM",
        endTime: "01:15 PM",
        section: "C3",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit (Lab)",
        roomOrLab: SECTION_LOCATIONS.C3,
        type: "lab",
        topic: "Decoders, Encoders & BCD to 7-Segment Display",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 6,
        timeSlot: "1.15-2.15",
        startTime: "01:15 PM",
        endTime: "02:15 PM",
        section: "E3",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.E3,
        type: "theory",
        topic: "Carry Look-Ahead Adder Design",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 7,
        timeSlot: "2.15-3.15",
        startTime: "02:15 PM",
        endTime: "03:15 PM",
        section: "D1",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.D1,
        type: "theory",
        topic: "Magnitude Comparators & Parity Checkers",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
    ],
  },

  // =========================================================================
  // WEDNESDAY: E2, A3, BREAK, LUNCH, B1, (FREE), C1
  // =========================================================================
  {
    day: "Wednesday",
    totalTeachingHours: 4,
    periods: [
      {
        periodNumber: 1,
        timeSlot: "9.00-10.00",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        section: "E2",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.E2,
        type: "theory",
        topic: "Introduction to Sequential Logic & SR Latches",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 2,
        timeSlot: "10.00-11.00",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        section: "A3",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.A3,
        type: "theory",
        topic: "D and T Flip-Flops Timing Diagrams",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 3,
        timeSlot: "11.00-11.15",
        startTime: "11:00 AM",
        endTime: "11:15 AM",
        section: null,
        courseCode: "RECESS",
        courseName: "Morning Tea Break",
        roomOrLab: "Faculty Lounge",
        type: "break",
      },
      {
        periodNumber: 4,
        timeSlot: "11.15-12.15",
        startTime: "11:15 AM",
        endTime: "12:15 PM",
        section: null,
        courseCode: "LUNCH",
        courseName: "Institutional Lunch Recess",
        roomOrLab: "Staff Dining Hall",
        type: "lunch",
      },
      {
        periodNumber: 5,
        timeSlot: "12.15-1.15",
        startTime: "12:15 PM",
        endTime: "01:15 PM",
        section: "B1",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit (Lab)",
        roomOrLab: SECTION_LOCATIONS.B1,
        type: "lab",
        topic: "Master-Slave JK Flip-Flop Circuitry",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 6,
        timeSlot: "1.15-2.15",
        startTime: "01:15 PM",
        endTime: "02:15 PM",
        section: null,
        courseCode: "FREE",
        courseName: "School of Computing Faculty Committee Meeting",
        roomOrLab: "Dean Conference Hall (Block M)",
        type: "free",
      },
      {
        periodNumber: 7,
        timeSlot: "2.15-3.15",
        startTime: "02:15 PM",
        endTime: "03:15 PM",
        section: "C1",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.C1,
        type: "theory",
        topic: "State Tables & Excitation Table Derivation",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
    ],
  },

  // =========================================================================
  // THURSDAY: D2, E1, BREAK, LUNCH, A2, C2, (FREE)
  // =========================================================================
  {
    day: "Thursday",
    totalTeachingHours: 4,
    periods: [
      {
        periodNumber: 1,
        timeSlot: "9.00-10.00",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        section: "D2",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.D2,
        type: "theory",
        topic: "Synchronous 4-Bit Binary Up/Down Counters",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 2,
        timeSlot: "10.00-11.00",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        section: "E1",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.E1,
        type: "theory",
        topic: "Mod-N Counters & Truncated Sequences",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 3,
        timeSlot: "11.00-11.15",
        startTime: "11:00 AM",
        endTime: "11:15 AM",
        section: null,
        courseCode: "RECESS",
        courseName: "Morning Tea Break",
        roomOrLab: "Faculty Lounge",
        type: "break",
      },
      {
        periodNumber: 4,
        timeSlot: "11.15-12.15",
        startTime: "11:15 AM",
        endTime: "12:15 PM",
        section: null,
        courseCode: "LUNCH",
        courseName: "Institutional Lunch Recess",
        roomOrLab: "Staff Dining Hall",
        type: "lunch",
      },
      {
        periodNumber: 5,
        timeSlot: "12.15-1.15",
        startTime: "12:15 PM",
        endTime: "01:15 PM",
        section: "A2",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.A2,
        type: "theory",
        topic: "Serial-In Serial-Out & PIPO Shift Registers",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 6,
        timeSlot: "1.15-2.15",
        startTime: "01:15 PM",
        endTime: "02:15 PM",
        section: "C2",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit (Lab)",
        roomOrLab: SECTION_LOCATIONS.C2,
        type: "lab",
        topic: "Ring Counter & Johnson Counter Hardware Demo",
        studentBatch: "B.E CSE 2025-2029 (Sem III - Sec C2)",
      },
      {
        periodNumber: 7,
        timeSlot: "2.15-3.15",
        startTime: "02:15 PM",
        endTime: "03:15 PM",
        section: null,
        courseCode: "FREE",
        courseName: "Laboratory Equipment Calibration & Setup",
        roomOrLab: "Virtual Computing Lab",
        type: "free",
      },
    ],
  },

  // =========================================================================
  // FRIDAY: C1, B3, BREAK, LUNCH, E3, D3, A1
  // =========================================================================
  {
    day: "Friday",
    totalTeachingHours: 5,
    periods: [
      {
        periodNumber: 1,
        timeSlot: "9.00-10.00",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        section: "C1",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.C1,
        type: "theory",
        topic: "Semiconductor Memories: ROM, PROM, EPROM",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 2,
        timeSlot: "10.00-11.00",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        section: "B3",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.B3,
        type: "theory",
        topic: "Programmable Logic Arrays (PLA) & PAL Architectures",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 3,
        timeSlot: "11.00-11.15",
        startTime: "11:00 AM",
        endTime: "11:15 AM",
        section: null,
        courseCode: "RECESS",
        courseName: "Morning Tea Break",
        roomOrLab: "Faculty Lounge",
        type: "break",
      },
      {
        periodNumber: 4,
        timeSlot: "11.15-12.15",
        startTime: "11:15 AM",
        endTime: "12:15 PM",
        section: null,
        courseCode: "LUNCH",
        courseName: "Institutional Lunch Recess",
        roomOrLab: "Staff Dining Hall",
        type: "lunch",
      },
      {
        periodNumber: 5,
        timeSlot: "12.15-1.15",
        startTime: "12:15 PM",
        endTime: "01:15 PM",
        section: "E3",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit (Lab)",
        roomOrLab: SECTION_LOCATIONS.E3,
        type: "lab",
        topic: "FPGA Prototyping & Verilog Gate-Level Design",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 6,
        timeSlot: "1.15-2.15",
        startTime: "01:15 PM",
        endTime: "02:15 PM",
        section: "D3",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.D3,
        type: "theory",
        topic: "Combinational Circuit Hardware Diagnostics",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
      {
        periodNumber: 7,
        timeSlot: "2.15-3.15",
        startTime: "02:15 PM",
        endTime: "03:15 PM",
        section: "A1",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit",
        roomOrLab: SECTION_LOCATIONS.A1,
        type: "theory",
        topic: "Weekly Review, Doubts & Continuous Evaluation",
        studentBatch: "B.E CSE 2025-2029 (Sem III)",
      },
    ],
  },
];

/**
 * Get faculty schedule for a specific day ("Monday", "Tuesday", etc.)
 */
export function getFacultyScheduleForDay(dayName: string): FacultyDaySchedule {
  const clean = dayName.trim().toLowerCase();
  const match = FACULTY_WEEKLY_TIMETABLE.find((d) => d.day.toLowerCase() === clean);
  return match || FACULTY_WEEKLY_TIMETABLE[0]; // Default to Monday
}

/**
 * Get faculty tomorrow's schedule and active teaching sessions
 */
export function getFacultyTomorrowSchedule(date: Date = new Date()): {
  dayName: string;
  schedule: FacultyDaySchedule;
  teachingSessions: FacultyPeriod[];
  totalTeachingHours: number;
} {
  const dayIndex = date.getDay(); // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
  let tomorrowIndex = (dayIndex + 1) % 7;

  // Weekend rollover to Monday
  if (tomorrowIndex === 0 || tomorrowIndex === 6) {
    tomorrowIndex = 1;
  }

  const days: Array<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"> = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const targetDay = days[tomorrowIndex - 1] || "Monday";
  const schedule = getFacultyScheduleForDay(targetDay);
  const teachingSessions = schedule.periods.filter((p) => p.section !== null && p.type !== "break" && p.type !== "lunch" && p.type !== "free");

  return {
    dayName: targetDay,
    schedule,
    teachingSessions,
    totalTeachingHours: teachingSessions.length,
  };
}

/**
 * Matrix format matching the user's PDF circular table verbatim.
 */
export interface FacultyMatrixRow {
  day: string;
  period1: string; // 9.00-10.00
  period2: string; // 10.00-11.00
  breakTime: string; // 11.00-11.15
  lunchTime: string; // 11.15-12.15
  period3: string; // 12.15-1.15
  period4: string; // 1.15-2.15
  period5: string; // 2.15-3.15
}

export const FACULTY_MATRIX_DATA: FacultyMatrixRow[] = [
  {
    day: "Monday",
    period1: "A1",
    period2: "C2",
    breakTime: "BREAK",
    lunchTime: "LUNCH",
    period3: "D3",
    period4: "E1",
    period5: "",
  },
  {
    day: "Tuesday",
    period1: "B2",
    period2: "",
    breakTime: "BREAK",
    lunchTime: "LUNCH",
    period3: "C3",
    period4: "E3",
    period5: "D1",
  },
  {
    day: "Wednesday",
    period1: "E2",
    period2: "A3",
    breakTime: "BREAK",
    lunchTime: "LUNCH",
    period3: "B1",
    period4: "",
    period5: "C1",
  },
  {
    day: "Thursday",
    period1: "D2",
    period2: "E1",
    breakTime: "BREAK",
    lunchTime: "LUNCH",
    period3: "A2",
    period4: "C2",
    period5: "",
  },
  {
    day: "Friday",
    period1: "C1",
    period2: "B3",
    breakTime: "BREAK",
    lunchTime: "LUNCH",
    period3: "E3",
    period4: "D3",
    period5: "A1",
  },
];
