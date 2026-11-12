/**
 * SATHYABAMA INSTITUTE OF SCIENCE AND TECHNOLOGY
 * OFFICIAL CAMPUS EVENTS CALENDAR (ODD SEMESTER 2026–2027)
 * 
 * Includes flagship campus events: Freshers Day, Culturals, Hackathons,
 * Technical Symposiums, Sports Meet, Academic Milestones & Workshops.
 */

export type EventCategory = 
  | "cultural" 
  | "freshers" 
  | "hackathon" 
  | "technical" 
  | "sports" 
  | "workshop" 
  | "academic" 
  | "holiday";

export interface CampusEventDetail {
  id: string;
  title: string;
  shortTitle: string;
  category: EventCategory;
  categoryLabel: string;
  dateStr: string; // e.g. "2026-09-18"
  day: number; // 18
  monthIndex: number; // 8 for Sept (0-indexed)
  monthName: string; // "September 2026"
  dayOfWeek: string; // "Friday"
  time: string; // "09:30 AM – 04:30 PM"
  venue: string; // "Dr. Remibai Jeppiaar Main Auditorium"
  themeTag: string; // "#Aarambh2026" or "#VivacityCulturals"
  accentColor: string; // hex or tailwind class
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  description: string;
  highlights: string[];
  chiefGuest?: string;
  studentPerks: string;
  facultyDuty: string; // In-charge assignment for Dr. T. Vino / Admin
  registrationOpen: boolean;
  registeredCount: number;
  odEligible: boolean;
  organizer: string;
}

export const CAMPUS_EVENTS_SEPTEMBER_2026: CampusEventDetail[] = [
  // 1. FRESHERS DAY (AARAMBH 2026)
  {
    id: "evt-freshers-2026",
    title: "Freshers Day 'Aarambh 2026' • Welcome Gala & Induction",
    shortTitle: "Freshers Day",
    category: "freshers",
    categoryLabel: "Freshers & Induction",
    dateStr: "2026-09-18",
    day: 18,
    monthIndex: 8,
    monthName: "September 2026",
    dayOfWeek: "Friday",
    time: "09:30 AM – 04:30 PM",
    venue: "Dr. Remibai Jeppiaar Main Auditorium (5,000 Cap)",
    themeTag: "#Aarambh2026",
    accentColor: "#EC4899", // pink-500
    badgeBg: "bg-pink-500/20",
    badgeBorder: "border-pink-500/40",
    badgeText: "text-pink-300",
    description:
      "The official grand welcome celebration for the incoming freshman batch (2026–2030). Features presidential address by Chancellor Dr. Mariazeena Johnson, celebrity musical performance, Mr. & Ms. Fresher pageant, comedy showcase, and campus club inductions.",
    highlights: [
      "Inaugural address by Chancellor & Vice Chancellor",
      "Mr. & Ms. Fresher 2026 Pageant & Talent Hunt",
      "Live Fusion Band & Celebrity DJ Showcase",
      "Free Welcome Kit & Lunch Buffet for Freshers",
      "Over 30 Student Clubs & Arts Societies Registration Desks",
    ],
    chiefGuest: "Dr. Mariazeena Johnson (Chancellor) & Cine Celebrity Guest",
    studentPerks: "Full OD granted for all senior organizers and freshman participants; complimentary food coupons.",
    facultyDuty: "Dr. T. Vino assigned as Faculty Discipline & Seating Coordinator (Auditorium Section A).",
    registrationOpen: true,
    registeredCount: 3840,
    odEligible: true,
    organizer: "Student Affairs & Dean Office",
  },

  // 2. SATHYABAMA MEGA CULTURALS DAY 1 (VIVACITY '26)
  {
    id: "evt-culturals-day1",
    title: "Sathyabama Culturals 'Vivacity 2026' • Day 1 (Fine Arts & Theatre)",
    shortTitle: "Culturals (Day 1)",
    category: "cultural",
    categoryLabel: "Mega Culturals",
    dateStr: "2026-09-24",
    day: 24,
    monthIndex: 8,
    monthName: "September 2026",
    dayOfWeek: "Thursday",
    time: "10:00 AM – 06:30 PM",
    venue: "Open Air Amphitheatre & Architecture Quadrangle",
    themeTag: "#Vivacity2026",
    accentColor: "#8B5CF6", // purple-500
    badgeBg: "bg-purple-500/20",
    badgeBorder: "border-purple-500/40",
    badgeText: "text-purple-300",
    description:
      "Day 1 of the annual South Indian inter-collegiate cultural fest 'Vivacity '26'. Over 45 colleges competing in classical solo music, street theatre, mono-acting, stand-up comedy, and live canvas painting.",
    highlights: [
      "Inter-College Street Play (Nukkad Natak) Competition",
      "Classical & Semi-Classical Solo Dance Rounds",
      "Stand-Up Comedy & Mimicry Battle",
      "Canvas & Digital Art Installation Showcase",
    ],
    chiefGuest: "Padma Shri Awardee Playwright & Cultural Director",
    studentPerks: "Cash prizes up to ₹1,50,000 for winning teams; OD pass granted for all collegiate performers.",
    facultyDuty: "Dr. T. Vino assigned as Theatre Venue In-Charge & Stage Manager.",
    registrationOpen: true,
    registeredCount: 1420,
    odEligible: true,
    organizer: "Sathyabama Cultural Club & Student Council",
  },

  // 3. SATHYABAMA MEGA CULTURALS DAY 2 (VIVACITY '26 - BATTLE OF BANDS)
  {
    id: "evt-culturals-day2",
    title: "Sathyabama Culturals 'Vivacity 2026' • Day 2 (Battle of the Bands & Fashion)",
    shortTitle: "Culturals (Day 2)",
    category: "cultural",
    categoryLabel: "Mega Culturals",
    dateStr: "2026-09-25",
    day: 25,
    monthIndex: 8,
    monthName: "September 2026",
    dayOfWeek: "Friday",
    time: "11:00 AM – 08:30 PM",
    venue: "Main Open Ground Stage",
    themeTag: "#VivacityBands",
    accentColor: "#F43F5E", // rose-500
    badgeBg: "bg-rose-500/20",
    badgeBorder: "border-rose-500/40",
    badgeText: "text-rose-300",
    description:
      "Day 2 of Vivacity '26 features the legendary inter-college Western Rock & Fusion Battle of the Bands, followed by the National Runway Fashion Walk and beatboxing duels.",
    highlights: [
      "Rock & Fusion Battle of the Bands (16 Finalist Bands)",
      "Theme Runway & Haute Couture Fashion Show",
      "Acapella & Beatboxing Championship",
      "Night Food Street & University Night Bazaar",
    ],
    chiefGuest: "Celebrity Music Director & Playback Singer",
    studentPerks: "Full attendance OD for registered competitors; free entrance for university badge holders.",
    facultyDuty: "Dr. T. Vino assigned to External Band Jury Logistics & Sound Verification Panel.",
    registrationOpen: true,
    registeredCount: 2650,
    odEligible: true,
    organizer: "Music Society & Cultural Affairs",
  },

  // 4. SATHYABAMA MEGA CULTURALS DAY 3 (CHOREONITE & CELEBRITY CONCERT)
  {
    id: "evt-culturals-day3",
    title: "Sathyabama Culturals 'Vivacity 2026' • Grand Finale & Celebrity Night",
    shortTitle: "Celebrity Night & Choreonite",
    category: "cultural",
    categoryLabel: "Star Celebrity Concert",
    dateStr: "2026-09-26",
    day: 26,
    monthIndex: 8,
    monthName: "September 2026",
    dayOfWeek: "Saturday",
    time: "03:00 PM – 10:00 PM",
    venue: "Sathyabama International Sports Complex Main Stadium",
    themeTag: "#VivacityFinale",
    accentColor: "#A855F7", // purple-500
    badgeBg: "bg-purple-600/30",
    badgeBorder: "border-purple-400",
    badgeText: "text-purple-200 font-bold",
    description:
      "The spectacular culmination of Vivacity '26. Begins with Choreonite (National Mega Dance Competition) and concludes with an electrifying 3-hour live concert by India's top music artist.",
    highlights: [
      "Choreonite 2026: Eastern & Western Synchronized Dance Teams",
      "Live Mega Concert by Top National Bollywood / Kollywood Artist",
      "Grand Trophy & ₹5,00,000 Cash Prize Awards Ceremony",
      "Laser Light Show & Fireworks Display",
    ],
    chiefGuest: "Renowned Playback Singer & Music Producer",
    studentPerks: "All Sathyabama students eligible for free wristband entry with valid ID pass.",
    facultyDuty: "Dr. T. Vino assigned as VIP Stage & Guest Hospitality Convener.",
    registrationOpen: true,
    registeredCount: 6500,
    odEligible: true,
    organizer: "Cultural Board & Directorate of Student Welfare",
  },

  // 5. CODE SPRINT 24-HR NATIONAL HACKATHON
  {
    id: "evt-hackathon-2026",
    title: "Code Sprint 24-Hour National Hackathon • AI & Web3 Edition",
    shortTitle: "Code Sprint Hackathon",
    category: "hackathon",
    categoryLabel: "National Hackathon",
    dateStr: "2026-09-11",
    day: 11,
    monthIndex: 8,
    monthName: "September 2026",
    dayOfWeek: "Friday",
    time: "09:00 AM (Fri) – 03:00 PM (Sat)",
    venue: "Computing Innovation Hub & Block M Labs",
    themeTag: "#CodeSprint2026",
    accentColor: "#10B981", // emerald-500
    badgeBg: "bg-emerald-500/20",
    badgeBorder: "border-emerald-500/40",
    badgeText: "text-emerald-300",
    description:
      "24-Hour non-stop product engineering hackathon with 120 shortlisted teams. Problem statements in Agentic AI, Decentralized Identity, Healthcare Tech, and Smart Cities.",
    highlights: [
      "₹1,50,000 Cash Prize Pool + Cloud Credits",
      "Mentorship from Google, Microsoft, and Zoho Engineers",
      "Midnight Energy Drinks & Midnight Pizza Fuel",
      "Direct Internship & Placement Fast-Track for Winners",
    ],
    chiefGuest: "VP of Engineering, Leading Tech Unicorn",
    studentPerks: "Approved On-Duty (OD) pass automatically logged in attendance portal for both days.",
    facultyDuty: "Dr. T. Vino serving as Chief Technical Evaluation Jury & Mentor.",
    registrationOpen: false, // In progress
    registeredCount: 480,
    odEligible: true,
    organizer: "School of Computing & Google Developer Student Club",
  },

  // 6. TECHNOSUMMIT 2026 (CSE NATIONAL TECHNICAL SYMPOSIUM)
  {
    id: "evt-technosummit-2026",
    title: "Technosummit 2026 • CSE National Technical Symposium",
    shortTitle: "Technosummit Symposium",
    category: "technical",
    categoryLabel: "Technical Symposium",
    dateStr: "2026-09-04",
    day: 4,
    monthIndex: 8,
    monthName: "September 2026",
    dayOfWeek: "Friday",
    time: "09:00 AM – 04:30 PM",
    venue: "School of Computing (Block M) & Seminar Hall 1",
    themeTag: "#Technosummit26",
    accentColor: "#3B82F6", // blue-500
    badgeBg: "bg-blue-500/20",
    badgeBorder: "border-blue-500/40",
    badgeText: "text-blue-300",
    description:
      "Premier technical symposium organized by the Department of Computer Science and Engineering. Features Paper Presentations, Code Debugging, Robo Maze Race, UI/UX Overhaul, and Tech Quiz.",
    highlights: [
      "IEEE Student Branch Paper Presentation Track",
      "Reverse Coding & Blind Debugging Contests",
      "Robo Sumo & Line Follower Arena",
      "Certificates of Excellence published to University Portal",
    ],
    chiefGuest: "Director of R&D, Intel Technology India",
    studentPerks: "Academic credits & OD granted for presenting papers and organizing.",
    facultyDuty: "Dr. T. Vino: Technical Paper Review Committee Member.",
    registrationOpen: false, // completed
    registeredCount: 890,
    odEligible: true,
    organizer: "Department of Computer Science and Engineering",
  },

  // 7. GOOGLE CLOUD & VERTEX AI BOOTCAMP
  {
    id: "evt-cloud-bootcamp",
    title: "Vertex AI & Cloud Agentic Systems • 1-Day Hands-on Workshop",
    shortTitle: "AI & Cloud Bootcamp",
    category: "workshop",
    categoryLabel: "Technical Workshop",
    dateStr: "2026-09-16",
    day: 16,
    monthIndex: 8,
    monthName: "September 2026",
    dayOfWeek: "Wednesday",
    time: "10:00 AM – 04:00 PM",
    venue: "Virtual Computing Lab (Block M 2nd Floor)",
    themeTag: "#VertexAIBootcamp",
    accentColor: "#06B6D4", // cyan-500
    badgeBg: "bg-cyan-500/20",
    badgeBorder: "border-cyan-500/40",
    badgeText: "text-cyan-300",
    description:
      "Deep-dive hands-on developer workshop exploring Google Cloud Vertex AI, multi-modal Gemini API integration, tool calling, and full-stack AI agent deployment.",
    highlights: [
      "100 Google Cloud Skill Boost Credits per attendee",
      "Build & deploy a real-world multi-agent pipeline",
      "Official Google Developer Program Certificate",
    ],
    chiefGuest: "Google Developer Expert (GDE) in Machine Learning",
    studentPerks: "OD provided for 3rd & 4th year CSE/IT attendees; hands-on badge earned.",
    facultyDuty: "Dr. T. Vino: Lab Infrastructure & High-Speed Network Coordinator.",
    registrationOpen: true,
    registeredCount: 160,
    odEligible: true,
    organizer: "Centre for Academic Innovation & Google Cloud",
  },

  // 8. JEPPIAAR MEMORIAL SPORTS MEET
  {
    id: "evt-sports-day-2026",
    title: "Jeppiaar Memorial State Trophy & Annual Sports Meet 2026",
    shortTitle: "Sports Meet & Jeppiaar Trophy",
    category: "sports",
    categoryLabel: "Annual Sports Meet",
    dateStr: "2026-09-29",
    day: 29,
    monthIndex: 8,
    monthName: "September 2026",
    dayOfWeek: "Tuesday",
    time: "08:00 AM – 05:30 PM",
    venue: "Sathyabama Stadium & Olympic Synthetic Track",
    themeTag: "#JeppiaarTrophy",
    accentColor: "#F59E0B", // amber-500
    badgeBg: "bg-amber-500/20",
    badgeBorder: "border-amber-500/40",
    badgeText: "text-amber-300",
    description:
      "University-wide sports extravaganza. Includes Inter-Departmental Track & Field events (100m, 200m, 4x100m relay, long jump), Cricket, Football, and Staff vs Student Cricket match.",
    highlights: [
      "Torch Lighting by International Athlete Alumni",
      "Inter-School Athletic Championship & March Past",
      "Faculty vs Student Friendly Cricket Match",
      "Gold, Silver, Bronze Medals & University Points Trophy",
    ],
    chiefGuest: "National Track & Field Champion & Olympian",
    studentPerks: "Sports OD authorized for all athlete participants.",
    facultyDuty: "Dr. T. Vino: School of Computing Faculty Cricket Team Captain & Venue Official.",
    registrationOpen: true,
    registeredCount: 1850,
    odEligible: true,
    organizer: "Department of Physical Education",
  },

  // 9. OFFICIAL UNIVERSITY HOLIDAY (MILAD-UN-NABI)
  {
    id: "evt-holiday-milad",
    title: "Milad-un-Nabi • Official University Holiday",
    shortTitle: "Milad-un-Nabi Holiday",
    category: "holiday",
    categoryLabel: "University Holiday",
    dateStr: "2026-09-19",
    day: 19,
    monthIndex: 8,
    monthName: "September 2026",
    dayOfWeek: "Saturday",
    time: "All Day",
    venue: "Campus Closed",
    themeTag: "#CampusHoliday",
    accentColor: "#64748B", // slate-500
    badgeBg: "bg-slate-500/20",
    badgeBorder: "border-slate-500/40",
    badgeText: "text-slate-300",
    description: "Official university holiday observed across Sathyabama campus. No academic or instructional sessions scheduled.",
    highlights: ["Campus administrative offices and library closed"],
    studentPerks: "Non-instructional holiday recess.",
    facultyDuty: "Non-instructional recess.",
    registrationOpen: false,
    registeredCount: 0,
    odEligible: false,
    organizer: "Registrar Secretariat",
  },
];

// Helper to get events for specific day
export function getEventsForDay(day: number, monthIndex = 8): CampusEventDetail[] {
  if (monthIndex === 8) {
    return CAMPUS_EVENTS_SEPTEMBER_2026.filter((e) => e.day === day);
  }
  return [];
}

// Helper to get next upcoming flagship events
export function getUpcomingCampusEvents(): CampusEventDetail[] {
  return CAMPUS_EVENTS_SEPTEMBER_2026.filter((e) => e.day >= 11).sort((a, b) => a.day - b.day);
}
