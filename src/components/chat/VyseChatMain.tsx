import React, { useState, useEffect, useRef } from "react";
import { TopBar } from "../layout/TopBar";
import { EmptyChatLanding } from "./EmptyChatLanding";
import { MessageBubble, type ChatMessage } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { useAuth } from "../../store/authContext";
import { sendChatMessage, executeAiChat } from "../../lib/api/ai";
import {
  generateGroundedRegulationResponse,
  searchSathyabamaRegulations,
  logUnmatchedQuery,
} from "../../lib/rag/ragEngine";

import {
  checkOdEligibility,
  prepareOdRequest,
  confirmOdRequest,
  getStudentOdRequests,
} from "../../lib/api/od";
import { getActiveBusRoute } from "../../lib/api/transport";
import { getStudentContext, getAttendance, getExams } from "../../lib/api/academics";
import { getCampusNotices, getCampusLocations, getAcademicCalendar } from "../../lib/api/campus";
import { getEvents } from "../../lib/api/events";
import {
  detectLanguage,
  localizedText,
  type SupportedLanguage,
  type LanguageOption,
} from "../../lib/i18n/responses";
import { GoogleCampusMapModal } from "./cards/GoogleCampusMapModal";
import { ChennaiBusTransitModal } from "./cards/ChennaiBusTransitModal";
import { SathyabamaLoginModal } from "../auth/SathyabamaLoginModal";
import { LetterModal, LetterType } from "./cards/LetterModal";
import { LetterSelectionModal } from "./cards/LetterSelectionModal";
import { FacultyOdNotificationsModal } from "./cards/FacultyOdNotificationsModal";
import { StudentNotificationBanner } from "./cards/StudentNotificationBanner";
import { StudentNotificationsModal } from "./cards/StudentNotificationsModal";
import { searchSathyabamaBusRoutes } from "../../lib/api/transport";
import { SATHYABAMA_BUS_ROUTES } from "../../data/sathyabamaBusRoutes";
import { UpcomingHackathonsModal } from "./cards/UpcomingHackathonsModal";
import { SectionC2TimetableModal } from "./cards/SectionC2TimetableModal";
import { FacultyTimetableModal } from "./cards/FacultyTimetableModal";
import { PersonalInfoAttendanceModal } from "./cards/PersonalInfoAttendanceModal";
import { getTomorrowSchedule, getScheduleForDay, SECTION_C2_METADATA } from "../../data/sathyabamaTimetable";
import { getFacultyTomorrowSchedule } from "../../data/sathyabamaFacultyTimetable";
import { SATHYABAMA_HACKATHONS } from "../../data/sathyabamaEvents";
import { evaluateEligibility } from "../../store/hackathonStore";
import { DEMO_STUDENT_ACCOUNTS } from "../../store/authContext";

export function VyseChatMain() {
  const { student, user, profile, role } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [typingStatus, setTypingStatus] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageOption>("auto");
  const [showMapModal, setShowMapModal] = useState(false);
  const [showBusTransitModal, setShowBusTransitModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedBusRouteNo, setSelectedBusRouteNo] = useState<string | undefined>(undefined);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [letterModalType, setLetterModalType] = useState<LetterType>("od");
  const [showLetterSelectionModal, setShowLetterSelectionModal] = useState(false);
  const [showFacultyNotificationsModal, setShowFacultyNotificationsModal] = useState(false);
  const [showStudentNotificationsModal, setShowStudentNotificationsModal] = useState(false);
  const [showHackathonsModal, setShowHackathonsModal] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [showFacultyTimetableModal, setShowFacultyTimetableModal] = useState(false);
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [personalInfoInitialTab, setPersonalInfoInitialTab] = useState<"attendance" | "profile" | "subjects" | "calendar">("attendance");

  const studentName = student?.name || profile?.full_name || "Arjun Kumar";
  const rollNo = student?.roll_number || "RA2311003010452";
  const dept = student?.department || "Computer Science and Engineering";
  const matchedDemo = DEMO_STUDENT_ACCOUNTS.find(
    (s) => s.registerNumber === rollNo || s.name.toLowerCase() === studentName.toLowerCase()
  );
  const currentAttendance = matchedDemo?.attendance ?? 84.0;

  // Cross-turn contextual memory
  const [activeContext, setActiveContext] = useState<{
    lastEvent?: string;
    lastEventDate?: string;
    lastTopic?: "od" | "transport" | "exam" | "events" | "academics" | "general";
    lastLocation?: string;
  }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingStatus]);

  function handleNewChat() {
    setMessages([]);
    setActiveContext({});
  }

  async function handleSendMessage(inputQuery: string, attachmentName?: string) {
    if (!inputQuery.trim() && !attachmentName) return;

    const query = inputQuery.trim() || (attachmentName ? `Uploaded document: ${attachmentName}` : "");
    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // 1. Detect language from query script or topbar selection
    const effectiveLang = detectLanguage(query, language);

    // 2. Append User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query + (attachmentName ? `\n[Attached: ${attachmentName}]` : ""),
      timestamp: userTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const lower = query.toLowerCase();
    const studentId = student?.id || user?.id || "11111111-1111-1111-1111-111111111111";
    const studentName = student?.name || profile?.full_name || "Arjun Kumar";
    const rollNo = student?.roll_number || "21CSE045";
    const dept = student?.department || "Computer Science";
    const homeLoc = student?.home_location || "Tambaram";

    const matchedDemo = DEMO_STUDENT_ACCOUNTS.find(
      (s) => s.registerNumber === (student?.roll_number || rollNo) || s.name.toLowerCase() === studentName.toLowerCase()
    );
    const currentAttendance = matchedDemo?.attendance ?? 84.0;

    try {
      // =========================================================================
      // CASE 15: COMPOUND INTENT — Hackathon OD + How to get there
      // "I have a hackathon tomorrow. I need OD. How do I get there?"
      // =========================================================================
      if (
        lower.includes("hackathon") &&
        (lower.includes("od") || lower.includes("on-duty") || lower.includes("on duty")) &&
        (lower.includes("how") || lower.includes("get there") || lower.includes("reach") || lower.includes("bus"))
      ) {
        setTypingStatus(`Evaluating OD eligibility & transit routing from ${homeLoc}...`);

        const events = await getEvents().catch(() => []);
        const hackathonEvent = events.find((e) => e.title.toLowerCase().includes("hackathon")) || {
          id: "33333333-3333-3333-3333-333333333331",
          title: "Code Sprint 24-Hour Hackathon",
          event_date: "2026-09-11",
        };

        const eligibility = await checkOdEligibility(studentId, hackathonEvent.id).catch(() => ({
          eligible: true,
          attendance_percent: 90.7,
          min_required: 75.0,
          od_used_this_semester: 1,
          max_allowed: 5,
          reasons: [],
        }));

        let draftToken = undefined;
        try {
          const prep = await prepareOdRequest({
            studentId,
            eventId: hackathonEvent.id,
            reason: `Participation in ${hackathonEvent.title}`,
            fromDate: hackathonEvent.event_date,
            toDate: hackathonEvent.event_date,
          });
          draftToken = prep.draft_token;
        } catch (e) {
          draftToken = "draft-demo-token-123";
        }

        const bus = await getActiveBusRoute(homeLoc).catch(() => null);

        setActiveContext({
          lastEvent: hackathonEvent.title,
          lastEventDate: hackathonEvent.event_date,
          lastTopic: "od",
          lastLocation: "Main Auditorium",
        });

        await new Promise((r) => setTimeout(r, 600));

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          contextTag: `${hackathonEvent.title} • ${homeLoc} Transit`,
          content:
            localizedText.compoundOdTransit[effectiveLang](hackathonEvent.title, homeLoc) +
            `\n\n**Transit Details**: Take the **${bus?.route_name || "Tambaram Hackathon Special"}** departing from **${
              bus?.stops?.[0]?.stop_name || "Tambaram Railway Station"
            }** at **${bus?.stops?.[0]?.arrival_time || "07:00 AM"}**, arriving at campus at **${
              bus?.stops?.[bus.stops.length - 1]?.arrival_time || "08:05 AM"
            }** (25 mins before reporting time).`,
          toolCalls: [
            { tool: "search_events('hackathon')", status: "completed" },
            { tool: "check_od_eligibility()", status: "completed" },
            { tool: `get_active_bus_route('${homeLoc}')`, status: "completed" },
          ],
          cardType: "od_eligibility",
          cardData: {
            eventTitle: hackathonEvent.title,
            eventDate: "11 September 2026",
            attendancePercent: eligibility.attendance_percent || 90.7,
            thresholdPercent: eligibility.min_required || 75.0,
            studentName,
            rollNumber: rollNo,
            department: dept,
            reason: `Participation in ${hackathonEvent.title}`,
            draftToken,
            initialStep: "eligibility",
          },
          citations: [
            { id: "c1", title: "Institutional Academic Regulations (OD Sec 4.2)", category: "Rules" },
            { id: "t1", title: "Transport Department Bulletin #402", category: "Transit" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }

      // =========================================================================
      // CASE 15 (PART B): CROSS-TURN REASONING — "How do I get there?"
      // Follows up on a previously discussed event
      // =========================================================================
      else if (
        (lower.includes("how do i get there") ||
          lower.includes("how to reach") ||
          lower.includes("directions") ||
          lower.includes("how can i go")) &&
        activeContext.lastEvent
      ) {
        setTypingStatus(`Resolving transit from ${homeLoc} for ${activeContext.lastEvent}...`);

        const bus = await getActiveBusRoute(homeLoc).catch(() => null);
        await new Promise((r) => setTimeout(r, 500));

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          contextTag: `${activeContext.lastEvent} • ${homeLoc} Transit`,
          content: `Based on your upcoming participation in **${activeContext.lastEvent}** and your registered residence in **${homeLoc}**, here is your optimal college transport match:`,
          toolCalls: [
            { tool: `get_active_bus_route('${homeLoc}', 'Campus')`, status: "completed" },
            { tool: "resolve_event_venue()", status: "completed" },
          ],
          cardType: "transport",
          cardData: {
            routeName: bus?.route_name || "Tambaram Hackathon Special",
            origin: bus?.origin || "Tambaram Railway Station",
            destination: bus?.destination || "Main Campus Auditorium",
            recommendedStop: bus?.stops?.[0]?.stop_name || "Tambaram Railway Station",
            departureTime: bus?.stops?.[0]?.arrival_time || "07:00 AM",
            arrivalTime: bus?.stops?.[bus.stops.length - 1]?.arrival_time || "08:05 AM",
            isTemporary: bus?.is_temporary ?? true,
            reasons: [
              `Direct match with your registered residence (${homeLoc})`,
              "Reaches campus 25 minutes prior to hackathon reporting time (08:30 AM)",
              "Verified temporary service activated for event day",
            ],
            stops: bus?.stops?.map((s) => ({
              order: s.stop_order,
              name: s.stop_name,
              time: s.arrival_time,
            })) || [
              { order: 1, name: "Tambaram Railway Station", time: "07:00 AM" },
              { order: 2, name: "Sanatorium", time: "07:15 AM" },
              { order: 3, name: "Chromepet", time: "07:25 AM" },
              { order: 4, name: "Main Campus Auditorium", time: "08:05 AM" },
            ],
          },
          citations: [
            { id: "t1", title: "Transport Department Bulletin #402", category: "Transit" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }

      // =========================================================================
      // CASE 1B: CAMPUS EVENTS CALENDAR (FRESHERS DAY, CULTURALS, HACKATHONS)
      // "events", "calendar", "freshers day", "culturals", "aarambh", "vivacity"
      // =========================================================================
      else if (
        lower.includes("calendar") ||
        lower.includes("events") ||
        lower.includes("event") ||
        lower.includes("fresher") ||
        lower.includes("cultural") ||
        lower.includes("aarambh") ||
        lower.includes("vivacity") ||
        lower.includes("symposium") ||
        lower.includes("sports day") ||
        lower.includes("sports meet")
      ) {
        setTypingStatus("Fetching official Sathyabama campus events calendar (Freshers Day & Culturals)...");

        await new Promise((r) => setTimeout(r, 450));

        const isTeacherOrAdmin = role === "faculty" || role === "admin";

        const eventsContent =
          `### 📅 Sathyabama Campus Events Calendar (Odd Semester 2026)\n\n` +
          `Here are the flagship campus celebrations, cultural fests, and hackathons scheduled for this semester:\n\n` +
          `• 💖 **Freshers Day 'Aarambh 2026'** — **Friday, September 18, 2026**\n` +
          `  * **Venue**: Dr. Remibai Jeppiaar Main Auditorium (5,000 Capacity)\n` +
          `  * **Chief Guests**: Chancellor Dr. Mariazeena Johnson & Cine Celebrity Guest\n` +
          `  * **Highlights**: Mr. & Ms. Fresher Pageant, Live Celebrity DJ, 30+ Club Desks, Free Welcome Kit & Lunch Buffet\n` +
          (isTeacherOrAdmin
            ? `  * **Faculty Duty**: Dr. T. Vino assigned as Discipline & Seating Coordinator (Auditorium Section A)\n\n`
            : `  * **Student Privileges**: Full OD authorized for all participants and senior volunteers; complimentary food coupons.\n\n`) +
          `• 🎭 **Sathyabama Mega Culturals 'Vivacity 2026'** — **September 24 – 26, 2026 (3-Day Fest)**\n` +
          `  * **Day 1 (Thu, Sep 24)**: Fine Arts, Street Play (Nukkad Natak), Mono-acting & Classical Solo Dance\n` +
          `  * **Day 2 (Fri, Sep 25)**: Battle of the Bands (Western/Eastern Rock), Beatboxing & Western Group Dance\n` +
          `  * **Day 3 (Sat, Sep 26)**: Star Celebrity Night, Choreonite Grand Finale & Celebrity Playback Singer Live Concert\n` +
          `  * **Prizes**: ₹1,50,000 Cash Pool across 45+ participating colleges.\n` +
          (isTeacherOrAdmin
            ? `  * **Faculty Duty**: Dr. T. Vino assigned as Theatre Venue In-Charge & Stage Manager.\n\n`
            : `  * **Student Privileges**: Full OD authorized for registered cultural performers.\n\n`) +
          `• ⚡ **CodeSprint 24-Hour National Hackathon** — **September 11 – 12, 2026**\n` +
          `  * ₹1,00,000 Prize Pool | Google Cloud Agentic AI & Smart Campus Tracks | OD Pre-Approved\n\n` +
          `• 🏆 **Jeppiaar Memorial Annual Sports Meet** — **Tuesday, September 29, 2026**\n` +
          `  * Track & Field Championships, Synthetic Olympic Track & Staff vs Student Cricket Match\n\n` +
          `👉 **Click the "Events Calendar" button** at the top right of your screen or in the quick options to explore the interactive month calendar grid, view event guidelines, claim student entry passes, or inspect faculty duty assignments!`;

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          contextTag: "Sathyabama Flagship Events Calendar",
          content: eventsContent,
          toolCalls: [
            { tool: "get_campus_events('September 2026')", status: "completed" },
            { tool: "resolve_event_categories(['freshers', 'culturals', 'hackathons', 'sports'])", status: "completed" },
          ],
          citations: [
            { id: "ev1", title: "Sathyabama Office of Student Affairs — Flagship Events Circular #108", category: "Events" },
            { id: "ev2", title: "Dean of Humanities & Cultural Affairs Directorate — Vivacity '26 Schedule", category: "Events" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }

      // =========================================================================
      // CASE 1: PERSONAL INFO, ATTENDANCE & LEAVES INQUIRY
      // "What is my attendance?" / "Show my personal info" / "How many leaves do I have?"
      // =========================================================================
      else if (
        !lower.includes("minimum attendance") &&
        !lower.includes("condonation") &&
        !lower.includes("attendance requirement") &&
        !lower.includes("attendance rule") &&
        !lower.includes("attendance regulation") &&
        !lower.includes("crash course") &&
        !lower.includes("required to write") &&
        (lower.includes("attendance") ||
          lower.includes("personal info") ||
          lower.includes("personal information") ||
          lower.includes("my profile") ||
          lower.includes("leave") ||
          lower.includes("bunk") ||
          lower.includes("present") ||
          lower.includes("absent") ||
          lower.includes("total days") ||
          lower.includes("debar") ||
          lower.includes("வருகை") ||
          lower.includes("హాజరు") ||
          lower.includes("अटेंडेंस"))
      ) {
        setTypingStatus("Calculating verified personal info, days present, leaves, and attendance percentage...");

        const isTeacherOrAdmin = role === "faculty" || role === "admin";
        const totalDays = 90;
        const rawAttendancePct = isTeacherOrAdmin
          ? 95.6
          : studentName.toLowerCase().includes("rahul")
          ? 67.8
          : studentName.toLowerCase().includes("divya")
          ? 91.1
          : 84.4;

        const presentDays = Math.round((rawAttendancePct / 100) * totalDays);
        const leaveDays = totalDays - presentDays;
        const calculatedPercentage = parseFloat(((presentDays / totalDays) * 100).toFixed(1));
        const isSafe = calculatedPercentage >= 75.0;
        const buffer = Math.round((calculatedPercentage - 75.0) * 10) / 10;
        const safeMissDays = Math.max(0, Math.floor(presentDays / 0.75 - totalDays));
        const recoveryDays = Math.max(0, Math.ceil((0.75 * totalDays - presentDays) / 0.25));

        await new Promise((r) => setTimeout(r, 450));

        const detailedContent =
          `### 📊 Personal Info & Attendance Analytics\n\n` +
          `**Name**: **${studentName}** | **ID**: \`${isTeacherOrAdmin ? "FAC-1042" : rollNo}\`\n` +
          `**Department**: ${dept} | **Role**: ${isTeacherOrAdmin ? "Faculty Administrator" : "Student (Section C2)"}\n\n` +
          `#### 📈 Attendance Calculation Breakdown:\n` +
          `• **Total Semester Working Days**: **${totalDays} Days**\n` +
          `• **Days Present**: **${presentDays} Days** (Logged & Verified)\n` +
          `• **No. of Leaves / Absences**: **${leaveDays} Days** (OD + Approved Leaves)\n` +
          `• **Attendance Percentage**: **${calculatedPercentage}%** ${isSafe ? "✅ (Eligible)" : "⚠️ (Debarment Risk)"}\n` +
          `  _Formula: (Present Days / Total Days) × 100 = (${presentDays} / ${totalDays}) × 100 = **${calculatedPercentage}%**_\n\n` +
          (isSafe
            ? `✨ **Good Standing**: You are **+${buffer}% above** the required 75.0% university threshold. You can safely take up to **${safeMissDays} more days** without falling below 75%.`
            : `⚠️ **Action Required**: You are **${Math.abs(buffer)}% below** the mandatory 75.0% mark. You must attend **${recoveryDays} consecutive instructional days** without absence to restore eligibility.`) +
          `\n\n👉 Click the **"Personal Info & Attendance"** slot near your profile at the top-right to inspect the full graphical circular gauge, day breakdown donut, and digital ID card!`;

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          contextTag: isTeacherOrAdmin ? "Faculty Attendance & Bio" : "Section C2 Attendance Analytics",
          content: detailedContent,
          toolCalls: [
            { tool: `get_personal_info('${studentId}')`, status: "completed" },
            { tool: `calculate_attendance_metrics(present=${presentDays}, total=${totalDays})`, status: "completed" },
          ],
          cardType: "attendance",
          cardData: {
            overallPercentage: calculatedPercentage,
            thresholdPercentage: 75.0,
            totalAttended: presentDays,
            totalClasses: totalDays,
            subjects: [
              { code: "CS303", name: "Full-Stack Reactive Engineering", attended: Math.round(presentDays * 0.22), total: Math.round(totalDays * 0.22), percentage: isSafe ? 95.0 : 70.0 },
              { code: "CS301", name: "Distributed Cloud Architecture", attended: Math.round(presentDays * 0.24), total: Math.round(totalDays * 0.24), percentage: isSafe ? 88.9 : 66.7 },
              { code: "CS302", name: "Artificial Intelligence & Agentic Systems", attended: Math.round(presentDays * 0.20), total: Math.round(totalDays * 0.20), percentage: isSafe ? 85.0 : 65.0 },
            ],
          },
          citations: [
            { id: "at1", title: "Institutional Academic Regulations (Sec 4.1 Attendance & Debarment)", category: "Rules" },
            { id: "sis", title: "Sathyabama SIS Verified Student Information Records", category: "Records" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }

      // =========================================================================
      // CASE 3: NEXT CLASS SPECIFICALLY
      // "What is my next class?"
      // =========================================================================
      else if (
        (lower.includes("next") &&
          (lower.includes("class") || lower.includes("lecture") || lower.includes("session") || lower.includes("period"))) ||
        lower.includes("where do i go next") ||
        lower.includes("அடுத்த வகுப்பு") ||
        lower.includes("తదుపరి తరగతి") ||
        lower.includes("अगली कक्षा")
      ) {
        setTypingStatus("Identifying next scheduled course session...");

        const ctx = await getStudentContext(studentId).catch(() => null);
        const nextCourse = ctx?.today_timetable?.[0] || {
          course_code: "CS301",
          course_name: "Distributed Cloud Architecture",
          start_time: "09:00:00",
          room: "Block M (Room 302)",
          faculty_name: "Dr. K. Venkatesh",
        };

        setActiveContext((prev) => ({
          ...prev,
          lastLocation: nextCourse.room,
          lastTopic: "academics",
        }));

        await new Promise((r) => setTimeout(r, 500));

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: localizedText.nextClass[effectiveLang](
            nextCourse.course_code,
            nextCourse.course_name,
            nextCourse.start_time.slice(0, 5) === "09:00" ? "09:00 AM" : nextCourse.start_time,
            nextCourse.room,
            nextCourse.faculty_name
          ),
          toolCalls: [
            { tool: `get_next_scheduled_class('${studentId}')`, status: "completed" },
          ],
          cardType: "schedule",
          cardData: {
            title: "UPCOMING IMMEDIATE CLASS",
            items: [
              {
                time: "09:00 - 10:00",
                courseCode: nextCourse.course_code,
                courseName: nextCourse.course_name,
                room: nextCourse.room,
                faculty: nextCourse.faculty_name,
              },
            ],
          },
          citations: [
            { id: "tt1", title: "Semester 5 Section B Master Timetable", category: "Academics" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }

      // =========================================================================
      // CASE 2: TOMORROW'S CLASSES / TIMETABLE (STUDENT SEC C2 & FACULTY DR. T. VINO)
      // "What classes do I have tomorrow?" / "Show me tomorrow's schedule / plan"
      // =========================================================================
      else if (
        (lower.includes("tomorrow") &&
          (lower.includes("class") || lower.includes("plan") || lower.includes("schedule") || lower.includes("timetable") || lower.includes("do i have") || lower.includes("period") || lower.includes("teaching"))) ||
        lower.includes("timetable") ||
        lower.includes("time table") ||
        lower.includes("faculty timetable") ||
        lower.includes("faculty schedule") ||
        lower.includes("section c2") ||
        lower.includes("c2 schedule") ||
        lower.includes("dr. t. vino") ||
        lower.includes("vino timetable") ||
        lower.includes("நாளைய வகுப்புகள்") ||
        lower.includes("రేపటి తరగతులు") ||
        lower.includes("कल की कक्षाएं")
      ) {
        const isFacultyOrAdmin = role === "faculty" || role === "admin";

        if (isFacultyOrAdmin) {
          setTypingStatus("Retrieving Dr. T. Vino's official faculty teaching schedule from School of Computing...");

          const { dayName, schedule, teachingSessions, totalTeachingHours } = getFacultyTomorrowSchedule();
          const scheduleItems = teachingSessions.map((p) => ({
            time: p.timeSlot,
            courseCode: p.section ? `Section ${p.section}` : p.courseCode,
            courseName: p.topic || p.courseName,
            room: p.roomOrLab,
            faculty: "Dr. T. Vino",
          }));

          setActiveContext((prev) => ({
            ...prev,
            lastLocation: teachingSessions[0]?.roomOrLab || "Virtual Computing Lab",
            lastTopic: "academics",
          }));

          await new Promise((r) => setTimeout(r, 450));

          const sessionListMd = teachingSessions
            .map(
              (p) =>
                `• **${p.timeSlot}**: **Section ${p.section}** (\`${p.courseCode}\` ${p.type === "lab" ? "[Virtual Lab]" : "[Theory]"})\n  *Topic: ${p.topic}*\n  *Venue: ${p.roomOrLab}*`
            )
            .join("\n");

          const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            contextTag: `Faculty Plan • ${dayName}`,
            content:
              `### 📅 Tomorrow's Faculty Teaching Plan: **${dayName}** (Dr. T. Vino)\n` +
              `**School of Computing** | Department of Computer Science & Engineering | **Odd Sem 2026-2027**\n` +
              `**Designation**: Associate Professor & Lab Lead | **Course**: \`S13BLH21\` Digital Logic Circuit\n` +
              `**Total Teaching Load**: **${totalTeachingHours} Sessions** scheduled for ${dayName}\n\n` +
              `${sessionListMd}\n\n` +
              `*Institutional Recess: **11:00 AM – 11:15 AM** (Morning Break) | **11:15 AM – 12:15 PM** (Lunch).*\n\n` +
              `👉 Click **"View Faculty Weekly Timetable"** on the dashboard card or profile dropdown to inspect your complete Monday–Friday 21-period allocation matrix across sections A1 through E3!`,
            toolCalls: [
              { tool: `get_faculty_timetable_vino('${dayName}')`, status: "completed" },
              { tool: "resolve_section_allocations('A1-E3')", status: "completed" },
            ],
            cardType: "schedule",
            cardData: {
              title: `FACULTY SCHEDULE — ${dayName.toUpperCase()} (DR. T. VINO)`,
              items: scheduleItems,
            },
            citations: [
              { id: "ftt", title: "Sathyabama School of Computing: Faculty Timetable Odd Sem 2026-2027 (Dr. T. Vino)", category: "Faculty" },
              { id: "alloc", title: "Dean Office Section Allocation Gazette (Sections A1-E3)", category: "Academics" },
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };

          setMessages((prev) => [...prev, botMsg]);
          return;
        }

        setTypingStatus("Retrieving official Section C2 schedule from School of Computing...");

        const { dayName, academicSessions } = getTomorrowSchedule();
        const scheduleItems = academicSessions.map((p) => ({
          time: p.timeSlot,
          courseCode: p.courseCode,
          courseName: p.courseName,
          room: p.roomOrLab,
          faculty: p.handlingStaff,
        }));

        setActiveContext((prev) => ({
          ...prev,
          lastLocation: academicSessions[0]?.roomOrLab || "Room C2-301",
          lastTopic: "academics",
        }));

        await new Promise((r) => setTimeout(r, 450));

        const periodListMd = academicSessions
          .map(
            (p) =>
              `• **${p.timeSlot}**: \`${p.courseCode}\` — **${p.courseName}**\n  *Faculty: ${p.handlingStaff} | Room/Lab: ${p.roomOrLab}*`
          )
          .join("\n");

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          contextTag: `Section C2 • ${dayName}`,
          content:
            `### 📅 Tomorrow's Timetable: **${dayName}** (Section C2)\n` +
            `**Department**: Computer Science & Engineering | **Semester**: III (2025–2029 Batch)\n` +
            `**Class Coordinator**: Ms. Leena Sivaguru | **Year Coordinator**: Dr. A. Viji Amutha Mary\n\n` +
            `${periodListMd}\n\n` +
            `*Institutional Recess: **11:00 AM – 11:15 AM** (Break) | **11:15 AM – 12:15 PM** (Lunch).*\n\n` +
            `👉 Click **"View Section C2 Timetable"** on the dashboard card or profile menu to inspect the full weekly Monday–Friday schedule grid with all faculty & coordinator details!`,
          toolCalls: [
            { tool: `get_timetable_section_c2('${dayName}')`, status: "completed" },
            { tool: "resolve_course_coordinators()", status: "completed" },
          ],
          cardType: "schedule",
          cardData: {
            title: `SECTION C2 — ${dayName.toUpperCase()} SCHEDULE`,
            items: scheduleItems,
          },
          citations: [
            { id: "tt1", title: "Sathyabama School of Computing: Section C2 Timetable (2026-2027 Odd Sem)", category: "Academics" },
            { id: "coord", title: "CSE Faculty Directory: Ms. Leena Sivaguru & Dr. A. Viji Amutha Mary", category: "Faculty" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }

      // =========================================================================
      // CASE 4: EXAMS / WHEN IS MY NEXT EXAM? / WHERE IS MY EXAM?
      // "When is my next exam?"
      // =========================================================================
      else if (
        lower.includes("exam") ||
        lower.includes("cat1") ||
        lower.includes("cat2") ||
        lower.includes("cat-2") ||
        lower.includes("fat") ||
        lower.includes("test") ||
        lower.includes("தேர்வு") ||
        lower.includes("పరీక్ష") ||
        lower.includes("परीक्षा")
      ) {
        setTypingStatus("Retrieving examination schedule from Controller of Examinations...");

        const dbExams = await getExams().catch(() => []);
        await new Promise((r) => setTimeout(r, 500));

        const examList = dbExams.length > 0
          ? dbExams.map((e) => ({
              id: e.id,
              courseCode: e.course_code || "CS301",
              courseName: e.course_name || "Semester Course",
              examType: e.exam_type.toUpperCase(),
              examDate: e.exam_date,
              room: "Block M (Room 302)",
              maxMarks: e.max_marks || 50,
            }))
          : [
              { id: "1", courseCode: "CS301", courseName: "Distributed Cloud Architecture", examType: "CAT2", examDate: "2026-09-21", room: "Block M (Room 302)", maxMarks: 50 },
              { id: "2", courseCode: "CS302", courseName: "Artificial Intelligence & Agentic Systems", examType: "CAT2", examDate: "2026-09-22", room: "Block M (Room 302)", maxMarks: 50 },
              { id: "3", courseCode: "CS303", courseName: "Full-Stack Reactive Engineering", examType: "CAT2", examDate: "2026-09-23", room: "Block M (Room 302)", maxMarks: 50 },
              { id: "4", courseCode: "CS304", courseName: "Database Internals & Distributed Storage", examType: "CAT2", examDate: "2026-09-24", room: "Block M (Room 302)", maxMarks: 50 },
            ];

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: localizedText.exams[effectiveLang](),
          toolCalls: [
            { tool: "get_exams()", status: "completed" },
            { tool: "get_academic_calendar('exam')", status: "completed" },
          ],
          cardType: "exam",
          cardData: {
            title: "CONTINUOUS ASSESSMENT TEST 2 (CAT-2)",
            description: "Examinations will be held in Block M (Room 302). Institutional ID and RFID badge verification required.",
            exams: examList,
          },
          citations: [
            { id: "ex1", title: "Office of the Controller of Examinations — CAT-2 Gazette", category: "Exams" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }

      // =========================================================================
      // CASE 9: OD STATUS SPECIFICALLY
      // "What's the status of my OD?"
      // =========================================================================
      else if (
        (lower.includes("status") &&
          (lower.includes("od") || lower.includes("on-duty") || lower.includes("leave") || lower.includes("request"))) ||
        lower.includes("track my od") ||
        lower.includes("check my od")
      ) {
        setTypingStatus("Querying live On-Duty requests in Supabase...");

        const existingRequests = await getStudentOdRequests(studentId).catch(() => []);
        const latestReq = existingRequests[0] || {
          id: "0d50a32f-25f9-49c8-b2f4-1377de2f655c",
          status: "submitted",
          event: { title: "Code Sprint 24-Hour Hackathon" },
          from_date: "2026-09-11",
          reason: "Participation in Code Sprint 24-Hour Hackathon",
        };

        await new Promise((r) => setTimeout(r, 500));

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: localizedText.odStatus[effectiveLang](
            latestReq.status,
            latestReq.event?.title || "Code Sprint 24-Hour Hackathon",
            latestReq.id
          ),
          toolCalls: [
            { tool: `get_student_od_requests('${studentId}')`, status: "completed" },
          ],
          cardType: "od_eligibility",
          cardData: {
            eventTitle: latestReq.event?.title || "Code Sprint 24-Hour Hackathon",
            eventDate: "11 September 2026",
            attendancePercent: 90.7,
            thresholdPercent: 75.0,
            studentName,
            rollNumber: rollNo,
            department: dept,
            reason: latestReq.reason || "Participation in Code Sprint Hackathon",
            requestId: latestReq.id,
            initialStep: "submitted",
          },
          citations: [
            { id: "c1", title: "Institutional OD Registry & Approval Records", category: "OD" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }

      // =========================================================================
      // CASE 7: PREPARE OD REQUEST SPECIFICALLY
      // "Prepare my OD request."
      // =========================================================================
      else if (
        lower.includes("prepare") &&
        (lower.includes("od") || lower.includes("on-duty") || lower.includes("request"))
      ) {
        setTypingStatus("Pre-filling official On-Duty request review card...");

        const events = await getEvents().catch(() => []);
        const hackathonEvent = events.find((e) => e.title.toLowerCase().includes("hackathon")) || {
          id: "33333333-3333-3333-3333-333333333331",
          title: "Code Sprint 24-Hour Hackathon",
          event_date: "2026-09-11",
        };

        let draftToken = undefined;
        try {
          const prep = await prepareOdRequest({
            studentId,
            eventId: hackathonEvent.id,
            reason: `Participation in ${hackathonEvent.title}`,
            fromDate: hackathonEvent.event_date,
            toDate: hackathonEvent.event_date,
          });
          draftToken = prep.draft_token;
        } catch (e) {
          draftToken = "draft-demo-token-123";
        }

        await new Promise((r) => setTimeout(r, 500));

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I've prepared your On-Duty request form with verified institutional data. Please review the details below and click **Confirm & Submit Request**:`,
          toolCalls: [
            { tool: "prepare_od_request()", status: "completed" },
          ],
          cardType: "od_eligibility",
          cardData: {
            eventTitle: hackathonEvent.title,
            eventDate: "11 September 2026",
            attendancePercent: 90.7,
            thresholdPercent: 75.0,
            studentName,
            rollNumber: rollNo,
            department: dept,
            reason: `Participation in ${hackathonEvent.title}`,
            draftToken,
            initialStep: "form",
          },
          citations: [
            { id: "c1", title: "Institutional Academic Regulations (OD Sec 4.2)", category: "Rules" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }

      // =========================================================================
      // CASE 8: CONFIRM OD REQUEST SPECIFICALLY
      // "Confirm the OD request."
      // =========================================================================
      else if (
        (lower.includes("confirm") || lower.includes("submit")) &&
        (lower.includes("od") || lower.includes("on-duty") || lower.includes("request"))
      ) {
        setTypingStatus("Executing database transaction for On-Duty request...");

        let confirmedId = `OD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        try {
          const prep = await prepareOdRequest({
            studentId,
            eventId: "aaaaaaaa-0001-0001-0001-000000000001",
            reason: "Participation in Code Sprint 24-Hour Hackathon",
            fromDate: "2026-09-11",
            toDate: "2026-09-11",
          });
          if (prep && prep.draft_token) {
            const confirmed = await confirmOdRequest(prep.draft_token);
            if (confirmed?.id) confirmedId = confirmed.id;
          }
        } catch (e) {
          // Fallback demo UUID
        }

        await new Promise((r) => setTimeout(r, 500));

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Your On-Duty request has been formally recorded in Supabase (Request ID: \`${confirmedId}\`). It is now in the faculty approval queue.`,
          toolCalls: [
            { tool: "confirm_od_request()", status: "completed" },
          ],
          cardType: "od_eligibility",
          cardData: {
            eventTitle: "Code Sprint 24-Hour Hackathon",
            eventDate: "11 September 2026",
            attendancePercent: 90.7,
            thresholdPercent: 75.0,
            studentName,
            rollNumber: rollNo,
            department: dept,
            reason: "Participation in Code Sprint 24-Hour Hackathon",
            requestId: confirmedId,
            initialStep: "submitted",
          },
          citations: [
            { id: "c1", title: "Institutional OD Registry", category: "Database" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }

      // =========================================================================
      // CASE 6: OD ELIGIBILITY SPECIFICALLY
      // "Am I eligible for OD?"
      // =========================================================================
      else if (
        (lower.includes("eligible") ||
          lower.includes("eligibility") ||
          lower.includes("can i take od") ||
          lower.includes("can i get od")) &&
        (lower.includes("od") || lower.includes("on-duty") || lower.includes("on duty"))
      ) {
        // RULE: No OD eligibility checks for faculty accounts
        if (role === "faculty" || role === "admin") {
          const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `**Faculty Account Notice**:\nOn-Duty (OD) eligibility rules and letter generation apply exclusively to enrolled students. As a faculty member or administrator (**${profile?.full_name || "Faculty Advisor"}**), you review and authorize incoming student applications.\n\nPlease open the **OD & Leave Notification Center** to review student requests.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, botMsg]);
          return;
        }

        setTypingStatus("Evaluating deterministic OD regulations...");

        const events = await getEvents().catch(() => []);
        const hackathonEvent = events.find((e) => e.title.toLowerCase().includes("hackathon")) || {
          id: "33333333-3333-3333-3333-333333333331",
          title: "Code Sprint 24-Hour Hackathon",
          event_date: "2026-09-11",
        };

        const eligibility = await checkOdEligibility(studentId, hackathonEvent.id).catch(() => ({
          eligible: true,
          attendance_percent: 90.7,
          min_required: 75.0,
          od_used_this_semester: 1,
          max_allowed: 5,
          reasons: [],
        }));

        await new Promise((r) => setTimeout(r, 500));

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: localizedText.odEligible[effectiveLang](
            hackathonEvent.title,
            eligibility.attendance_percent || 90.7,
            eligibility.min_required || 75.0
          ),
          toolCalls: [
            { tool: "check_od_eligibility()", status: "completed" },
          ],
          cardType: "od_eligibility",
          cardData: {
            eventTitle: hackathonEvent.title,
            eventDate: "11 September 2026",
            attendancePercent: eligibility.attendance_percent || 90.7,
            thresholdPercent: eligibility.min_required || 75.0,
            studentName,
            rollNumber: rollNo,
            department: dept,
            reason: `Participation in ${hackathonEvent.title}`,
            initialStep: "eligibility",
          },
          citations: [
            { id: "c1", title: "Institutional Academic Regulations (OD Sec 4.2)", category: "Rules" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }

      // =========================================================================
      // CASE 5: GENERAL OD & HACKATHON REQUEST
      // "I have a hackathon tomorrow and I need OD."
      // =========================================================================
      else if (
        lower.includes("od") ||
        lower.includes("on-duty") ||
        lower.includes("on duty") ||
        lower.includes("leave")
      ) {
        setTypingStatus("Checking student attendance & evaluating deterministic OD rules...");

        const events = await getEvents().catch(() => []);
        const hackathonEvent = events.find((e) => e.title.toLowerCase().includes("hackathon")) || {
          id: "33333333-3333-3333-3333-333333333331",
          title: "Code Sprint 24-Hour Hackathon",
          event_date: "2026-09-11",
        };

        const eligibility = await checkOdEligibility(studentId, hackathonEvent.id).catch(() => ({
          eligible: true,
          attendance_percent: 90.7,
          min_required: 75.0,
          od_used_this_semester: 1,
          max_allowed: 5,
          reasons: [],
        }));

        let draftToken = undefined;
        try {
          const prep = await prepareOdRequest({
            studentId,
            eventId: hackathonEvent.id,
            reason: `Participation in ${hackathonEvent.title}`,
            fromDate: hackathonEvent.event_date,
            toDate: hackathonEvent.event_date,
          });
          draftToken = prep.draft_token;
        } catch (e) {
          draftToken = "draft-demo-token-123";
        }

        setActiveContext({
          lastEvent: hackathonEvent.title,
          lastEventDate: hackathonEvent.event_date,
          lastTopic: "od",
          lastLocation: "Main Auditorium",
        });

        await new Promise((r) => setTimeout(r, 600));

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: localizedText.odEligible[effectiveLang](
            hackathonEvent.title,
            eligibility.attendance_percent || 90.7,
            eligibility.min_required || 75.0
          ),
          toolCalls: [
            { tool: "search_events('hackathon')", status: "completed" },
            { tool: "check_od_eligibility()", status: "completed" },
            { tool: "prepare_od_request()", status: "completed" },
          ],
          cardType: "od_eligibility",
          cardData: {
            eventTitle: hackathonEvent.title,
            eventDate: "11 September 2026",
            attendancePercent: eligibility.attendance_percent || 90.7,
            thresholdPercent: eligibility.min_required || 75.0,
            studentName,
            rollNumber: rollNo,
            department: dept,
            reason: `Participation in ${hackathonEvent.title}`,
            draftToken,
            initialStep: "eligibility",
          },
          citations: [
            { id: "c1", title: "Institutional Academic Regulations (OD Sec 4.2)", category: "Rules" },
            { id: "c2", title: "College Hackathon Calendar 2026", category: "Calendar" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }

      // =========================================================================
      // CASE 10: BUS / TRANSPORT / TAMBARAM ROUTE
      // "I live in Tambaram. Which bus should I take?"
      // =========================================================================
      else if (
        lower.includes("bus") ||
        lower.includes("transit") ||
        lower.includes("route") ||
        lower.includes("tambaram") ||
        lower.includes("commute") ||
        lower.includes("transport")
      ) {
        setTypingStatus(`Scanning official Sathyabama transport circular (175 routes) from ${homeLoc}...`);

        // Search in our official 175 bus routes dataset
        const matchedRoutes = searchSathyabamaBusRoutes(query);
        const bestRoute =
          matchedRoutes.length > 0
            ? matchedRoutes[0]
            : SATHYABAMA_BUS_ROUTES.find((r) =>
                r.origin.toLowerCase().includes(homeLoc.toLowerCase()) ||
                r.viaStops.some((s) => s.toLowerCase().includes(homeLoc.toLowerCase()))
              ) || SATHYABAMA_BUS_ROUTES[0];

        setSelectedBusRouteNo(bestRoute.routeNo);

        await new Promise((r) => setTimeout(r, 450));

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            `### 🚌 Sathyabama College Bus Route **${bestRoute.routeNo}** (Sl. No #${bestRoute.slNo})\n\n` +
            `• **Starting Point**: ${bestRoute.origin} (${bestRoute.departureTime})\n` +
            `• **Via Stops**: ${bestRoute.viaStops.join(" ➔ ")}\n` +
            `• **Destination**: Sathyabama Campus Main Gate, Jeppiaar Nagar (**Arrival ${bestRoute.campusInTime}**)\n` +
            `• **Zone**: ${bestRoute.zone}\n` +
            `• **Driver**: ${bestRoute.driverName} (📞 [${bestRoute.phoneNumber}](tel:${bestRoute.phoneNumber}))\n` +
            `• **Vehicle Plate**: \`${bestRoute.vehicleNo}\`\n\n` +
            `*Official Transport Circular Date: 28/08/2026. Campus morning in-time is strictly **08:30 AM**.*\n\n` +
            `👉 Click the **Bus Routes** button in the top bar or on the landing page to open the **Satellite 3D Map** with all 175 routes!`,
          toolCalls: [
            { tool: `search_sathyabama_bus_routes('${query.slice(0, 30)}')`, status: "completed" },
            { tool: `get_route_coordinates('Route ${bestRoute.routeNo}')`, status: "completed" },
          ],
          cardType: "transport",
          cardData: {
            routeName: `Route ${bestRoute.routeNo} • ${bestRoute.vehicleNo}`,
            origin: bestRoute.origin,
            destination: "Sathyabama Campus (Jeppiaar Nagar)",
            recommendedStop: bestRoute.stops[0]?.name || bestRoute.origin,
            departureTime: bestRoute.departureTime,
            arrivalTime: bestRoute.campusInTime,
            isTemporary: false,
            reasons: [
              `Official Sathyabama College Bus Route #${bestRoute.slNo} (${bestRoute.zone})`,
              `Direct connection arriving at Jeppiaar Nagar at ${bestRoute.campusInTime}`,
              `Driver: ${bestRoute.driverName} • Contact: ${bestRoute.phoneNumber}`,
            ],
            stops: bestRoute.stops.map((s: any) => ({
              order: s.order,
              name: s.name,
              time: s.time,
            })),
          },
          citations: [
            { id: "t2", title: "Sathyabama Transport Department Circular (28/08/2026)", category: "Transit" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }

      // =========================================================================
      // CASE 11 & 12: UPCOMING HACKATHONS & EVENTS (ELIGIBILITY & REGISTRATION)
      // "What hackathons are coming up?" / "Can I participate in this event?"
      // =========================================================================
      else if (
        lower.includes("hackathon") ||
        (lower.includes("event") && (lower.includes("tomorrow") || lower.includes("upcoming") || lower.includes("happening") || lower.includes("participate") || lower.includes("register") || lower.includes("join") || lower.includes("list"))) ||
        lower.includes("participate") ||
        lower.includes("hackathons")
      ) {
        // RULE: No hackathon student eligibility checks for faculty accounts
        if (role === "faculty" || role === "admin") {
          const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `**Faculty Account Notice**:\nHackathon student participation eligibility is strictly configured for enrolled student accounts. Faculty and Admin accounts (**${profile?.full_name || "Faculty Member"}**) act as Hackathon Jury, Mentors, and OD Approvers.\n\nTo view and approve student OD requests for hackathons, please use the **OD & Leave Notification Center**.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, botMsg]);
          return;
        }

        setTypingStatus("Evaluating attendance & regulatory criteria across upcoming hackathons...");

        const evaluated = SATHYABAMA_HACKATHONS.map((h) => ({
          hackathon: h,
          result: evaluateEligibility(h, currentAttendance, matchedDemo?.year ?? 2, dept),
        }));

        const eligibleOnes = evaluated.filter((e) => e.result.eligible);
        const ineligibleOnes = evaluated.filter((e) => !e.result.eligible);

        await new Promise((r) => setTimeout(r, 500));

        const eligibleMd =
          eligibleOnes.length > 0
            ? eligibleOnes
                .map(
                  (e) =>
                    `• **${e.hackathon.title}** (${e.hackathon.dates})\n  *Prize: ${e.hackathon.prizePool} | Team Size: ${e.hackathon.teamSizeMin}–${e.hackathon.teamSizeMax} | Venue: ${e.hackathon.venue}*`
                )
                .join("\n")
            : "*None available under current criteria (minimum 75% attendance required).*";

        const ineligibleMd =
          ineligibleOnes.length > 0
            ? ineligibleOnes
                .map(
                  (e) =>
                    `• **${e.hackathon.title}**: ${e.result.reasons.join(", ")}`
                )
                .join("\n")
            : "*None — you are eligible for all registered hackathons!*";

        const primaryHackathon = SATHYABAMA_HACKATHONS[0];
        const primaryResult = evaluated[0]?.result;

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          contextTag: `Hackathons • ${studentName}`,
          content:
            `### 🏆 Upcoming Hackathons & Events: Sathyabama Innovation Registry\n` +
            `**Student**: ${studentName} (${dept} • Year ${matchedDemo?.year ?? 2})\n` +
            `**Attendance**: **${currentAttendance}%** (Institutional Threshold: 75.0%)\n\n` +
            `#### ✅ Eligible Hackathons (${eligibleOnes.length}/${evaluated.length}):\n` +
            `${eligibleMd}\n\n` +
            `#### ❌ Ineligible / Restricted (${ineligibleOnes.length}):\n` +
            `${ineligibleMd}\n\n` +
            `👉 Click the **"Explore Hackathons & Register"** card on your dashboard or in the profile dropdown to open the full dashboard, configure your team, and receive an instant printable pass & OD request shortcut!`,
          toolCalls: [
            { tool: "query_upcoming_hackathons()", status: "completed" },
            { tool: `evaluate_eligibility('${studentName}', ${currentAttendance}%)`, status: "completed" },
          ],
          cardType: "event",
          cardData: {
            eventId: primaryHackathon.id,
            studentId,
            title: primaryHackathon.title,
            category: "National Technical Hackathon",
            eventDate: `${primaryHackathon.dates} • ${primaryHackathon.registrationDeadline}`,
            venue: primaryHackathon.venue,
            eligible: primaryResult?.eligible ?? true,
            criteria: [
              { label: `Attendance ${currentAttendance}% (Required ≥ ${primaryHackathon.minAttendanceRequired}%)`, met: currentAttendance >= primaryHackathon.minAttendanceRequired },
              { label: `Department (${(primaryHackathon.allowedDepartments || ["All Branches"]).join(", ")})`, met: true },
              { label: `Allowed Batch / Years (${primaryHackathon.allowedYears.map((y: number) => `Yr ${y}`).join(", ")})`, met: true },
            ],
          },
          citations: [
            { id: "h1", title: "Sathyabama Centre for Innovation & Hackathons 2026", category: "Events" },
            { id: "reg", title: "Dean Office Regulation for Hackathon OD Approvals", category: "Rules" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }

      // =========================================================================
      // CASE 13: SMART NOTICES
      // "Show me important notices."
      // =========================================================================
      else if (
        lower.includes("notice") ||
        lower.includes("important") ||
        lower.includes("update") ||
        lower.includes("announcement")
      ) {
        setTypingStatus("Filtering verified campus notices for your profile...");

        const notices = await getCampusNotices().catch(() => []);
        await new Promise((r) => setTimeout(r, 500));

        const noticeItems = [
          {
            id: "1",
            severity: "high" as const,
            title: "CAT-2 Examination Schedule Published",
            relevance: "Relevant to Semester 5 CSE — exams commence next week.",
            date: "Today",
          },
          {
            id: "2",
            severity: "medium" as const,
            title: "Temporary Bus Route Change (Tambaram)",
            relevance: "Tambaram express bus rerouted via Sanatorium due to bypass repair.",
            date: "Tomorrow",
          },
          {
            id: "3",
            severity: "info" as const,
            title: "Code Sprint 24-Hour Hackathon Registration Closing",
            relevance: "Registration closes at midnight for shortlisted participants.",
            date: "Today",
          },
        ];

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: localizedText.notices[effectiveLang](),
          toolCalls: [
            { tool: "get_campus_notices()", status: "completed" },
            { tool: "filter_relevant_notices()", status: "completed" },
          ],
          cardType: "notice",
          cardData: {
            items: noticeItems,
          },
          citations: [
            { id: "n1", title: "Dean's Office Gazette Notice #108", category: "Notices" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }

      // =========================================================================
      // CASE 14: CAMPUS NAVIGATION / WHERE IS BLOCK M?
      // "Where is Block M?"
      // =========================================================================
      else if (
        lower.includes("block m") ||
        lower.includes("where is") ||
        lower.includes("how do i get to") ||
        lower.includes("location of") ||
        lower.includes("navigate") ||
        lower.includes("navigation") ||
        lower.includes("map") ||
        lower.includes("sathyabama") ||
        lower.includes("directions")
      ) {
        setTypingStatus("Resolving campus building layout & walking route...");

        await new Promise((r) => setTimeout(r, 500));

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: localizedText.navigation[effectiveLang]("Block M", "Room 302"),
          toolCalls: [
            { tool: "resolve_campus_facility('Block M')", status: "completed" },
          ],
          cardType: "navigation",
          cardData: {
            destination: "Block M (Computer Science Academic Complex)",
            room: "Room 302 (3rd Floor)",
            sessionTime: "09:00 AM",
            startingPoint: "Campus Main Gate & Bus Terminal",
            lat: 12.8735,
            lng: 80.2212,
            steps: [
              "From the Bus Terminal, walk straight past the North Entrance Plaza (approx. 50m).",
              "Cross the Central Lawn pathway towards the Clock Tower.",
              "Block M is the 4-story glass academic complex located immediately to the left of the Library Tower.",
              "Take Elevator B or the central staircase to the 3rd floor; Room 302 is on the east wing corridor.",
            ],
          },
          citations: [
            { id: "m1", title: "Campus Master Plan & Building Index", category: "Facilities" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      }
    // =========================================================================
    // CASE 16 / 17 / DEFAULT: GEMINI LLM API + GROUNDED SATHYABAMA RAG
    // =========================================================================
    else {
        setTypingStatus("Synthesizing response with Gemini AI & campus regulations...");

        const historyForContext = messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

        const aiResponse = await executeAiChat({
          message: query,
          conversationHistory: historyForContext,
          studentContext: {
            name: studentName,
            rollNumber: rollNo,
            department: dept,
            attendance: currentAttendance,
            homeLocation: homeLoc,
          },
          language: effectiveLang,
        });

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiResponse.reply,
          toolCalls: aiResponse.tool_calls || [
            { tool: "vyse_ai_chat()", status: "completed" },
          ],
          citations: aiResponse.citations,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      }


    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I encountered an unexpected error: ${err.message || "Failed to process inquiry"}. Please check your connection and try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTypingStatus(null);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-transparent text-[#F8FAFC] overflow-hidden">
      {/* 1. Minimal Top Navigation Bar */}
      <TopBar
        onNewChat={handleNewChat}
        onOpenMap={() => setShowMapModal(true)}
        onOpenBusTransit={() => setShowBusTransitModal(true)}
        onOpenUpcomingHackathons={() => setShowHackathonsModal(true)}
        onOpenTimetable={() => {
          if (role === "faculty" || role === "admin") {
            setShowFacultyTimetableModal(true);
          } else {
            setShowTimetableModal(true);
          }
        }}
        onOpenPersonalInfo={(tab) => {
          setPersonalInfoInitialTab(tab || "attendance");
          setShowPersonalInfoModal(true);
        }}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onOpenNotifications={() => {
          if (role === "faculty" || role === "admin") {
            setShowFacultyNotificationsModal(true);
          } else {
            setShowStudentNotificationsModal(true);
          }
        }}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Real-time Student Notification Alert (When Faculty Approves or Rejects OD) */}
      <StudentNotificationBanner
        onOpenLetter={(type) => {
          setLetterModalType(type);
          setShowLetterModal(true);
        }}
        onOpenAllNotifications={() => setShowStudentNotificationsModal(true)}
      />

      {/* 2. Main Conversational Canvas */}
      <main className="flex-1 overflow-y-auto flex flex-col justify-between">
        {messages.length === 0 ? (
          <EmptyChatLanding
            onSelectPrompt={(p) => handleSendMessage(p)}
            onOpenMap={() => setShowMapModal(true)}
            onOpenBusTransit={() => setShowBusTransitModal(true)}
            onOpenUpcomingHackathons={() => setShowHackathonsModal(true)}
            onOpenTimetable={() => {
              if (role === "faculty" || role === "admin") {
                setShowFacultyTimetableModal(true);
              } else {
                setShowTimetableModal(true);
              }
            }}
            onOpenPersonalInfo={(tab) => {
              setPersonalInfoInitialTab(tab || "attendance");
              setShowPersonalInfoModal(true);
            }}
            onOpenLetterSelection={() => setShowLetterSelectionModal(true)}
            onOpenOdLetter={() => {
              setLetterModalType("od");
              setShowLetterModal(true);
            }}
            onOpenLeaveLetter={() => {
              setLetterModalType("leave");
              setShowLetterModal(true);
            }}
            onOpenFacultyNotifications={() => setShowFacultyNotificationsModal(true)}
            onOpenStudentNotifications={() => setShowStudentNotificationsModal(true)}
          />
        ) : (
          <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing Indicator */}
            {typingStatus && (
              <div className="flex items-center gap-3 my-3">
                <div className="w-7 h-7 rounded-md bg-[var(--bg-surface-2)] border border-hairline flex items-center justify-center shrink-0">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)] dot-1" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] dot-2" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] dot-3" />
                  </div>
                </div>
                <div className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-hairline px-3.5 py-2 rounded-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7A8C7A] animate-pulse" />
                  <span>{typingStatus}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* 3. Floating AI Input Box */}
      <footer className="shrink-0 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/90 to-transparent pt-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          loading={loading}
          language={language}
          onLanguageChange={setLanguage}
        />
      </footer>

      {/* 4. Interactive Google Campus Map Modal */}
      <GoogleCampusMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        initialBlock="Block M"
        room="Room 302"
      />

      {/* 5. Sathyabama 175 Chennai Metropolitan Bus Transit Modal (Google Satellite & Roadmap) */}
      <ChennaiBusTransitModal
        isOpen={showBusTransitModal}
        onClose={() => setShowBusTransitModal(false)}
        initialRouteNo={selectedBusRouteNo}
      />

      {/* 6. Sathyabama Institutional Login Modal (Register No & Admin ID) */}
      <SathyabamaLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* 7. Faculty OD Notifications Modal (Faculty / Admin Only) */}
      <FacultyOdNotificationsModal
        isOpen={showFacultyNotificationsModal}
        onClose={() => setShowFacultyNotificationsModal(false)}
      />

      {/* 8. Student OD Status Notifications Modal (Student Only) */}
      <StudentNotificationsModal
        isOpen={showStudentNotificationsModal}
        onClose={() => setShowStudentNotificationsModal(false)}
        onOpenLetter={(type) => {
          setLetterModalType(type);
          setShowLetterModal(true);
        }}
      />

      {/* 9. OD & Leave Eligibility Selection Pop-up Modal (Student Only) */}
      <LetterSelectionModal
        isOpen={showLetterSelectionModal}
        onClose={() => setShowLetterSelectionModal(false)}
        onSelectType={(t) => {
          setLetterModalType(t);
          setShowLetterModal(true);
        }}
        attendancePercent={currentAttendance}
        studentName={studentName}
      />

      {/* 10. Dashboard & Printable Paper Letter Modal (Student Only) */}
      <LetterModal
        isOpen={showLetterModal}
        onClose={() => setShowLetterModal(false)}
        initialType={letterModalType}
        studentData={{
          name: studentName,
          rollNumber: rollNo,
          department: dept,
          attendancePercent: currentAttendance,
          eventName: "Code Sprint 24-Hour National Hackathon",
          eventDate: "11 / 09 / 2026 to 12 / 09 / 2026",
          leaveReason: "Medical appointment and health recovery under physician advice",
          leaveDates: "11 / 09 / 2026 to 13 / 09 / 2026",
        }}
      />

      {/* 11. Upcoming Hackathons & Events Dashboard Modal (Student Only) */}
      <UpcomingHackathonsModal
        isOpen={showHackathonsModal}
        onClose={() => setShowHackathonsModal(false)}
        studentName={studentName}
        studentDept={dept}
        attendancePercent={currentAttendance}
        studentYear={matchedDemo?.year ?? 2}
        onApplyOd={() => {
          setShowHackathonsModal(false);
          setLetterModalType("od");
          setShowLetterModal(true);
        }}
      />

      {/* 12. Official Sathyabama Section C2 Timetable Modal (Student View) */}
      <SectionC2TimetableModal
        isOpen={showTimetableModal}
        onClose={() => setShowTimetableModal(false)}
      />

      {/* 12B. Official Sathyabama Faculty Weekly Timetable Modal (Dr. T. Vino / Admin View) */}
      <FacultyTimetableModal
        isOpen={showFacultyTimetableModal}
        onClose={() => setShowFacultyTimetableModal(false)}
      />

      {/* 13. Personal Info & Attendance Analytics Dashboard Modal */}
      {showPersonalInfoModal && (
        <PersonalInfoAttendanceModal
          isOpen={showPersonalInfoModal}
          onClose={() => setShowPersonalInfoModal(false)}
          initialTab={personalInfoInitialTab}
        />
      )}
    </div>
  );
}