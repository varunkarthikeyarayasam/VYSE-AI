export interface CourseInfo {
  code: string;
  name: string;
  handlingStaff: string;
  courseCoordinator: string;
  roomOrLab: string;
  credits: number;
}

export interface TimetablePeriod {
  periodNumber: number;
  timeSlot: string;
  startTime: string;
  endTime: string;
  courseCode: string;
  courseName: string;
  handlingStaff: string;
  roomOrLab: string;
  isBreak?: boolean;
  isLunch?: boolean;
}

export interface DaySchedule {
  day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY";
  periods: TimetablePeriod[];
}

export const SATHYABAMA_TIMETABLE_HEADER = {
  institution: "SATHYABAMA INSTITUTE OF SCIENCE AND TECHNOLOGY (DEEMED TO BE UNIVERSITY)",
  accreditation: "Category - 1 University by UGC | Accredited with 'A++' grade by NAAC | Approved by AICTE",
  school: "SCHOOL OF COMPUTING",
  department: "DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING",
  program: "B.E – COMPUTER SCIENCE AND ENGINEERING",
  academicYear: "2026-2027 - ODD SEMESTER",
  year: "II",
  semester: "III",
  batch: "2025-2029",
  section: "C2",
  classCoordinator: "Ms. Leena Sivaguru",
  yearCoordinator: "Dr. A. Viji Amutha Mary",
};

export const SECTION_C2_METADATA = SATHYABAMA_TIMETABLE_HEADER;

export const SECTION_C2_COURSES: Record<string, CourseInfo> = {
  SMTB1302: {
    code: "SMTB1302",
    name: "Discrete Mathematics and Numerical Methods",
    handlingStaff: "Dr. Mary Metilda M I",
    courseCoordinator: "Dr. M. Premkumar",
    roomOrLab: "Block M (Room C2-301)",
    credits: 4,
  },
  SC5BOB1301: {
    code: "SC5BOB1301",
    name: "Computer Architecture and Organization",
    handlingStaff: "Ms. P. Kabitha",
    courseCoordinator: "Dr. S. Bangaru Kamatchi",
    roomOrLab: "Block M (Room C2-301)",
    credits: 3,
  },
  SISB4301: {
    code: "SISB4301",
    name: "Universal Human Values",
    handlingStaff: "Ms. Leena Sivaguru",
    courseCoordinator: "Dr. S. Nandini",
    roomOrLab: "Block M (Room C2-301)",
    credits: 2,
  },
  SC5B1303: {
    code: "SC5B1303",
    name: "Theory of Computation",
    handlingStaff: "Ms. Pavithra Babu",
    courseCoordinator: "Ms. V. Gowri Manohari",
    roomOrLab: "Block M (Room C2-301)",
    credits: 3,
  },
  S13BLH21: {
    code: "S13BLH21",
    name: "Digital Logic Circuit (Virtual Computing Lab)",
    handlingStaff: "Dr. T. Vino",
    courseCoordinator: "Dr. T. Vino",
    roomOrLab: "Virtual Computing Lab (Block M 2nd Floor)",
    credits: 2,
  },
  S12BLH31: {
    code: "S12BLH31",
    name: "Programming in Java (CSS Lab)",
    handlingStaff: "Dr. M. D. Anto Praveena / Dr. S. Prince Mary",
    courseCoordinator: "Dr. J Cruz Antony / Dr. M. Mahasree",
    roomOrLab: "CSS Lab (Center for Software Systems, Block M)",
    credits: 2,
  },
};

export const SECTION_C2_TIMETABLE: DaySchedule[] = [
  {
    day: "MONDAY",
    periods: [
      {
        periodNumber: 1,
        timeSlot: "9.00-10.00",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        courseCode: "S13BLH21",
        courseName: SECTION_C2_COURSES.S13BLH21.name,
        handlingStaff: "Dr. T. Vino",
        roomOrLab: SECTION_C2_COURSES.S13BLH21.roomOrLab,
      },
      {
        periodNumber: 2,
        timeSlot: "10.00-11.00",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        courseCode: "SMTB1302",
        courseName: SECTION_C2_COURSES.SMTB1302.name,
        handlingStaff: "Dr. Mary Metilda M I",
        roomOrLab: SECTION_C2_COURSES.SMTB1302.roomOrLab,
      },
      {
        periodNumber: 3,
        timeSlot: "11.00-11.15",
        startTime: "11:00 AM",
        endTime: "11:15 AM",
        courseCode: "BREAK",
        courseName: "Morning Refreshment Break",
        handlingStaff: "-",
        roomOrLab: "Campus Amenities / Canteen",
        isBreak: true,
      },
      {
        periodNumber: 4,
        timeSlot: "11.15-12.15",
        startTime: "11:15 AM",
        endTime: "12:15 PM",
        courseCode: "LUNCH",
        courseName: "Official Student Lunch Recess",
        handlingStaff: "-",
        roomOrLab: "Central Student Dining Hall",
        isLunch: true,
      },
      {
        periodNumber: 5,
        timeSlot: "12.15-1.15",
        startTime: "12:15 PM",
        endTime: "01:15 PM",
        courseCode: "S12BLH31",
        courseName: SECTION_C2_COURSES.S12BLH31.name,
        handlingStaff: "Dr. M. D. Anto Praveena",
        roomOrLab: SECTION_C2_COURSES.S12BLH31.roomOrLab,
      },
      {
        periodNumber: 6,
        timeSlot: "1.15-2.15",
        startTime: "01:15 PM",
        endTime: "02:15 PM",
        courseCode: "SC5BOB1301",
        courseName: SECTION_C2_COURSES.SC5BOB1301.name,
        handlingStaff: "Ms. P. Kabitha",
        roomOrLab: SECTION_C2_COURSES.SC5BOB1301.roomOrLab,
      },
      {
        periodNumber: 7,
        timeSlot: "2.15-3.15",
        startTime: "02:15 PM",
        endTime: "03:15 PM",
        courseCode: "SISB4301",
        courseName: SECTION_C2_COURSES.SISB4301.name,
        handlingStaff: "Ms. Leena Sivaguru",
        roomOrLab: SECTION_C2_COURSES.SISB4301.roomOrLab,
      },
    ],
  },
  {
    day: "TUESDAY",
    periods: [
      {
        periodNumber: 1,
        timeSlot: "9.00-10.00",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        courseCode: "SMTB1302",
        courseName: SECTION_C2_COURSES.SMTB1302.name,
        handlingStaff: "Dr. Mary Metilda M I",
        roomOrLab: SECTION_C2_COURSES.SMTB1302.roomOrLab,
      },
      {
        periodNumber: 2,
        timeSlot: "10.00-11.00",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        courseCode: "S12BLH31",
        courseName: SECTION_C2_COURSES.S12BLH31.name,
        handlingStaff: "Dr. M. D. Anto Praveena",
        roomOrLab: SECTION_C2_COURSES.S12BLH31.roomOrLab,
      },
      {
        periodNumber: 3,
        timeSlot: "11.00-11.15",
        startTime: "11:00 AM",
        endTime: "11:15 AM",
        courseCode: "BREAK",
        courseName: "Morning Refreshment Break",
        handlingStaff: "-",
        roomOrLab: "Campus Amenities / Canteen",
        isBreak: true,
      },
      {
        periodNumber: 4,
        timeSlot: "11.15-12.15",
        startTime: "11:15 AM",
        endTime: "12:15 PM",
        courseCode: "LUNCH",
        courseName: "Official Student Lunch Recess",
        handlingStaff: "-",
        roomOrLab: "Central Student Dining Hall",
        isLunch: true,
      },
      {
        periodNumber: 5,
        timeSlot: "12.15-1.15",
        startTime: "12:15 PM",
        endTime: "01:15 PM",
        courseCode: "S12BLH31",
        courseName: SECTION_C2_COURSES.S12BLH31.name,
        handlingStaff: "Dr. S. Prince Mary",
        roomOrLab: SECTION_C2_COURSES.S12BLH31.roomOrLab,
      },
      {
        periodNumber: 6,
        timeSlot: "1.15-2.15",
        startTime: "01:15 PM",
        endTime: "02:15 PM",
        courseCode: "SC5B1303",
        courseName: SECTION_C2_COURSES.SC5B1303.name,
        handlingStaff: "Ms. Pavithra Babu",
        roomOrLab: SECTION_C2_COURSES.SC5B1303.roomOrLab,
      },
      {
        periodNumber: 7,
        timeSlot: "2.15-3.15",
        startTime: "02:15 PM",
        endTime: "03:15 PM",
        courseCode: "SC5BOB1301",
        courseName: SECTION_C2_COURSES.SC5BOB1301.name,
        handlingStaff: "Ms. P. Kabitha",
        roomOrLab: SECTION_C2_COURSES.SC5BOB1301.roomOrLab,
      },
    ],
  },
  {
    day: "WEDNESDAY",
    periods: [
      {
        periodNumber: 1,
        timeSlot: "9.00-10.00",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        courseCode: "SC5BOB1301",
        courseName: SECTION_C2_COURSES.SC5BOB1301.name,
        handlingStaff: "Ms. P. Kabitha",
        roomOrLab: SECTION_C2_COURSES.SC5BOB1301.roomOrLab,
      },
      {
        periodNumber: 2,
        timeSlot: "10.00-11.00",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        courseCode: "SMTB1302",
        courseName: SECTION_C2_COURSES.SMTB1302.name,
        handlingStaff: "Dr. Mary Metilda M I",
        roomOrLab: SECTION_C2_COURSES.SMTB1302.roomOrLab,
      },
      {
        periodNumber: 3,
        timeSlot: "11.00-11.15",
        startTime: "11:00 AM",
        endTime: "11:15 AM",
        courseCode: "BREAK",
        courseName: "Morning Refreshment Break",
        handlingStaff: "-",
        roomOrLab: "Campus Amenities / Canteen",
        isBreak: true,
      },
      {
        periodNumber: 4,
        timeSlot: "11.15-12.15",
        startTime: "11:15 AM",
        endTime: "12:15 PM",
        courseCode: "LUNCH",
        courseName: "Official Student Lunch Recess",
        handlingStaff: "-",
        roomOrLab: "Central Student Dining Hall",
        isLunch: true,
      },
      {
        periodNumber: 5,
        timeSlot: "12.15-1.15",
        startTime: "12:15 PM",
        endTime: "01:15 PM",
        courseCode: "S12BLH31",
        courseName: SECTION_C2_COURSES.S12BLH31.name,
        handlingStaff: "Dr. M. D. Anto Praveena",
        roomOrLab: SECTION_C2_COURSES.S12BLH31.roomOrLab,
      },
      {
        periodNumber: 6,
        timeSlot: "1.15-2.15",
        startTime: "01:15 PM",
        endTime: "02:15 PM",
        courseCode: "SC5B1303",
        courseName: SECTION_C2_COURSES.SC5B1303.name,
        handlingStaff: "Ms. Pavithra Babu",
        roomOrLab: SECTION_C2_COURSES.SC5B1303.roomOrLab,
      },
      {
        periodNumber: 7,
        timeSlot: "2.15-3.15",
        startTime: "02:15 PM",
        endTime: "03:15 PM",
        courseCode: "S13BLH21",
        courseName: SECTION_C2_COURSES.S13BLH21.name,
        handlingStaff: "Dr. T. Vino",
        roomOrLab: SECTION_C2_COURSES.S13BLH21.roomOrLab,
      },
    ],
  },
  {
    day: "THURSDAY",
    periods: [
      {
        periodNumber: 1,
        timeSlot: "9.00-10.00",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        courseCode: "S12BLH31",
        courseName: SECTION_C2_COURSES.S12BLH31.name,
        handlingStaff: "Dr. M. D. Anto Praveena",
        roomOrLab: SECTION_C2_COURSES.S12BLH31.roomOrLab,
      },
      {
        periodNumber: 2,
        timeSlot: "10.00-11.00",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        courseCode: "SC5B1303",
        courseName: SECTION_C2_COURSES.SC5B1303.name,
        handlingStaff: "Ms. Pavithra Babu",
        roomOrLab: SECTION_C2_COURSES.SC5B1303.roomOrLab,
      },
      {
        periodNumber: 3,
        timeSlot: "11.00-11.15",
        startTime: "11:00 AM",
        endTime: "11:15 AM",
        courseCode: "BREAK",
        courseName: "Morning Refreshment Break",
        handlingStaff: "-",
        roomOrLab: "Campus Amenities / Canteen",
        isBreak: true,
      },
      {
        periodNumber: 4,
        timeSlot: "11.15-12.15",
        startTime: "11:15 AM",
        endTime: "12:15 PM",
        courseCode: "LUNCH",
        courseName: "Official Student Lunch Recess",
        handlingStaff: "-",
        roomOrLab: "Central Student Dining Hall",
        isLunch: true,
      },
      {
        periodNumber: 5,
        timeSlot: "12.15-1.15",
        startTime: "12:15 PM",
        endTime: "01:15 PM",
        courseCode: "SMTB1302",
        courseName: SECTION_C2_COURSES.SMTB1302.name,
        handlingStaff: "Dr. Mary Metilda M I",
        roomOrLab: SECTION_C2_COURSES.SMTB1302.roomOrLab,
      },
      {
        periodNumber: 6,
        timeSlot: "1.15-3.15",
        startTime: "01:15 PM",
        endTime: "03:15 PM",
        courseCode: "S13BLH21",
        courseName: "Digital Logic Circuit Lab (Extended Lab Session)",
        handlingStaff: "Dr. T. Vino",
        roomOrLab: SECTION_C2_COURSES.S13BLH21.roomOrLab,
      },
    ],
  },
  {
    day: "FRIDAY",
    periods: [
      {
        periodNumber: 1,
        timeSlot: "9.00-10.00",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        courseCode: "S12BLH31",
        courseName: SECTION_C2_COURSES.S12BLH31.name,
        handlingStaff: "Dr. S. Prince Mary",
        roomOrLab: SECTION_C2_COURSES.S12BLH31.roomOrLab,
      },
      {
        periodNumber: 2,
        timeSlot: "10.00-11.00",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        courseCode: "SC5B1303",
        courseName: SECTION_C2_COURSES.SC5B1303.name,
        handlingStaff: "Ms. Pavithra Babu",
        roomOrLab: SECTION_C2_COURSES.SC5B1303.roomOrLab,
      },
      {
        periodNumber: 3,
        timeSlot: "11.00-11.15",
        startTime: "11:00 AM",
        endTime: "11:15 AM",
        courseCode: "BREAK",
        courseName: "Morning Refreshment Break",
        handlingStaff: "-",
        roomOrLab: "Campus Amenities / Canteen",
        isBreak: true,
      },
      {
        periodNumber: 4,
        timeSlot: "11.15-12.15",
        startTime: "11:15 AM",
        endTime: "12:15 PM",
        courseCode: "LUNCH",
        courseName: "Official Student Lunch Recess",
        handlingStaff: "-",
        roomOrLab: "Central Student Dining Hall",
        isLunch: true,
      },
      {
        periodNumber: 5,
        timeSlot: "12.15-1.15",
        startTime: "12:15 PM",
        endTime: "01:15 PM",
        courseCode: "S13BLH21",
        courseName: SECTION_C2_COURSES.S13BLH21.name,
        handlingStaff: "Dr. T. Vino",
        roomOrLab: SECTION_C2_COURSES.S13BLH21.roomOrLab,
      },
      {
        periodNumber: 6,
        timeSlot: "1.15-2.15",
        startTime: "01:15 PM",
        endTime: "02:15 PM",
        courseCode: "SC5BOB1301",
        courseName: SECTION_C2_COURSES.SC5BOB1301.name,
        handlingStaff: "Ms. P. Kabitha",
        roomOrLab: SECTION_C2_COURSES.SC5BOB1301.roomOrLab,
      },
      {
        periodNumber: 7,
        timeSlot: "2.15-3.15",
        startTime: "02:15 PM",
        endTime: "03:15 PM",
        courseCode: "SISB4301",
        courseName: SECTION_C2_COURSES.SISB4301.name,
        handlingStaff: "Ms. Leena Sivaguru",
        roomOrLab: SECTION_C2_COURSES.SISB4301.roomOrLab,
      },
    ],
  },
];

/**
 * Returns the schedule for a specific day ("MONDAY" ... "FRIDAY")
 */
export function getScheduleForDay(dayName: string): DaySchedule {
  const clean = dayName.trim().toUpperCase();
  const match = SECTION_C2_TIMETABLE.find((d) => d.day === clean);
  return match || SECTION_C2_TIMETABLE[4]; // Default to Friday
}

/**
 * Returns tomorrow's scheduled classes excluding recess breaks
 */
export function getTomorrowSchedule(date: Date = new Date()): {
  dayName: string;
  schedule: DaySchedule;
  academicSessions: TimetablePeriod[];
} {
  const dayIndex = date.getDay(); // 0=Sun, 1=Mon, ..., 4=Thu, 5=Fri, 6=Sat
  // Tomorrow's day index
  let tomorrowIndex = (dayIndex + 1) % 7;

  // If tomorrow is Saturday or Sunday, advance to Monday
  if (tomorrowIndex === 0 || tomorrowIndex === 6) {
    tomorrowIndex = 1;
  }

  const days: Array<"MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY"> = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
  ];

  const targetDay = days[tomorrowIndex - 1] || "FRIDAY";
  const schedule = getScheduleForDay(targetDay);
  const academicSessions = schedule.periods.filter((p) => !p.isBreak && !p.isLunch);

  return {
    dayName: targetDay,
    schedule,
    academicSessions,
  };
}
