"use client";

import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  Bus,
  Phone,
  Mail,
  Award,
  TrendingUp,
  X,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  FileCheck,
  GraduationCap,
  Percent,
  Check,
  Building,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  Trophy,
  PartyPopper,
  Music,
  Heart,
  Share2,
} from "lucide-react";
import { useAuth } from "../../../store/authContext";
import { VyseLogo } from "../../ui/VyseLogo";
import {
  getStudentSeptemberCalendar,
  getFacultySeptemberCalendar,
  getStudentAugustCalendar,
  getFacultyAugustCalendar,
  getStudentOctoberCalendar,
  getFacultyOctoberCalendar,
  DayCalendarRecord,
  MonthCalendarData,
} from "../../../data/attendanceCalendarData";
import {
  CAMPUS_EVENTS_SEPTEMBER_2026,
  CampusEventDetail,
  EventCategory,
  getEventsForDay,
  getUpcomingCampusEvents,
} from "../../../data/campusEventsCalendarData";
import {
  HeatmapCells,
  HeatmapChart,
  HeatmapInteractionBoundary,
  HeatmapInteractionProvider,
  HeatmapLegend,
  HeatmapTooltip,
  HeatmapXAxis,
  HeatmapYAxis,
  RadarChart,
  RadarGrid,
  RadarAxis,
  RadarLabels,
  RadarArea,
  PieChart,
  PieSlice,
} from "@bklitui/ui/charts";
import { ContributionHeatmap } from "./ContributionHeatmap";
import { PerformanceRadar } from "./PerformanceRadar";
import { SalesChart as AttendancePieChart } from "./SalesChart";

interface PersonalInfoAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "attendance" | "profile" | "subjects" | "calendar";
}

export function PersonalInfoAttendanceModal({
  isOpen,
  onClose,
  initialTab = "attendance",
}: PersonalInfoAttendanceModalProps) {
  const { profile, student, registerNumber, adminId, isFaculty, role } = useAuth();
  const [activeTab, setActiveTab] = useState<"attendance" | "profile" | "subjects" | "calendar">(initialTab);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Calendar & Campus Events State
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(8); // 7=Aug, 8=Sep, 9=Oct
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(18); // Default to Sept 18 (Freshers Day)
  const [statusFilter, setStatusFilter] = useState<"all" | "present" | "od" | "leave" | "holiday">("all");
  const [selectedEventCategory, setSelectedEventCategory] = useState<EventCategory | "all">("all");
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(["evt-freshers-2026"]);
  const [acknowledgedFacultyDuties, setAcknowledgedFacultyDuties] = useState<string[]>(["evt-freshers-2026"]);
  const [academicCalendarView, setAcademicCalendarView] = useState<"heatwave" | "miniGrid">("heatwave");
  const [showHeatwaveInCalendarTab, setShowHeatwaveInCalendarTab] = useState<boolean>(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      if (initialTab === "calendar") {
        setSelectedCalendarDay(18); // Default to Freshers Day!
      }
    }
  }, [isOpen, initialTab]);

  const isTeacherOrAdmin = isFaculty || role === "faculty" || role === "admin";

  // ==========================================
  // 1. RESOLVE STUDENT OR FACULTY PROFILE
  // ==========================================
  const studentName = profile?.full_name || student?.name || (isTeacherOrAdmin ? "Prof. R. Venkatesh" : "Arjun Kumar");
  const regNo = student?.roll_number || registerNumber || (isTeacherOrAdmin ? (adminId || "FAC-1042") : "RA2311003010452");
  const department = student?.department || (isTeacherOrAdmin ? "Computer Science and Engineering" : "Computer Science and Engineering");

  // Determine base attendance percentage based on persona
  const rawAttendancePct = isTeacherOrAdmin
    ? 95.6
    : studentName.toLowerCase().includes("rahul")
    ? 67.8
    : studentName.toLowerCase().includes("divya")
    ? 91.1
    : 84.4;

  // ==========================================
  // 2. DETAILED MATHEMATICAL CALCULATIONS
  // ==========================================
  const totalDays = 90; // Standard Odd Semester Instructional Working Days
  const presentDays = Math.round((rawAttendancePct / 100) * totalDays);
  const absentOrLeaveDays = totalDays - presentDays;

  // Granular breakdown
  const approvedOdDays = isTeacherOrAdmin ? 2 : rawAttendancePct >= 80 ? 4 : 1;
  const casualMedicalLeaves = Math.max(0, absentOrLeaveDays - approvedOdDays - (rawAttendancePct < 75 ? 18 : 2));
  const unexcusedAbsences = Math.max(0, absentOrLeaveDays - approvedOdDays - casualMedicalLeaves);

  // Exact calculated percentage
  const calculatedPercentage = parseFloat(((presentDays / totalDays) * 100).toFixed(1));
  const isSafe = calculatedPercentage >= 75.0;
  const bufferMargin = parseFloat((calculatedPercentage - 75.0).toFixed(1));

  // Bunk or Recovery Calculation
  // Formula for how many classes can miss: (present) / (total + x) >= 0.75 => x <= (present / 0.75) - total
  const safeToMissDays = Math.max(0, Math.floor(presentDays / 0.75 - totalDays));
  // Formula for how many consecutive classes to reach 75%: (present + y) / (total + y) >= 0.75 => y >= (0.75*total - present) / 0.25
  const neededConsecutiveDays = Math.max(0, Math.ceil((0.75 * totalDays - presentDays) / 0.25));

  // Donut slices data
  const donutData = [
    { id: "present", label: "Present & Logged", count: presentDays, color: "#10B981", percent: parseFloat(((presentDays / totalDays) * 100).toFixed(1)) },
    { id: "od", label: "Approved On-Duty (OD)", count: approvedOdDays, color: "#8B5CF6", percent: parseFloat(((approvedOdDays / totalDays) * 100).toFixed(1)) },
    { id: "leaves", label: "Approved Leaves", count: casualMedicalLeaves, color: "#F59E0B", percent: parseFloat(((casualMedicalLeaves / totalDays) * 100).toFixed(1)) },
    ...(unexcusedAbsences > 0
      ? [{ id: "unexcused", label: "Unexcused Absence", count: unexcusedAbsences, color: "#EF4444", percent: parseFloat(((unexcusedAbsences / totalDays) * 100).toFixed(1)) }]
      : []),
  ];

  // Subject attendance data (Matching Section C2 official timetable)
  const subjectAttendance = [
    { code: "SMTB1302", name: "Discrete Mathematics & Numerical Methods", staff: "Dr. Mary Metilda M I", attended: Math.round(presentDays * 0.23), total: 20 },
    { code: "SC5BOB1301", name: "Computer Architecture & Organization", staff: "Ms. P. Kabitha", attended: Math.round(presentDays * 0.22), total: 20 },
    { code: "SISB4301", name: "Universal Human Values", staff: "Ms. Leena Sivaguru", attended: Math.round(presentDays * 0.24), total: 20 },
    { code: "SC5B1303", name: "Theory of Computation", staff: "Ms. Pavithra Babu", attended: Math.round(presentDays * 0.21), total: 20 },
    { code: "S13BLH21", name: "Digital Logic Circuit Lab", staff: "Dr. T. Vino", attended: Math.round(presentDays * 0.12), total: 10 },
    { code: "S12BLH31", name: "Programming in Java CSS Lab", staff: "Dr. M. D. Anto Praveena", attended: Math.round(presentDays * 0.11), total: 10 },
  ].map((s) => ({
    ...s,
    attended: Math.min(s.total, Math.max(1, s.attended)),
    percentage: Math.min(100, Math.round((Math.min(s.total, Math.max(1, s.attended)) / s.total) * 100)),
  }));

  // Monthly trends data
  const monthlyTrends = [
    { month: "August", rate: isTeacherOrAdmin ? 96 : Math.min(100, calculatedPercentage + 6), days: 22 },
    { month: "September", rate: isTeacherOrAdmin ? 94 : Math.min(100, calculatedPercentage + 2), days: 24 },
    { month: "October", rate: isTeacherOrAdmin ? 97 : Math.max(50, calculatedPercentage - 4), days: 22 },
    { month: "November (MTD)", rate: isTeacherOrAdmin ? 95 : calculatedPercentage, days: 22 },
  ];

  // ==========================================
  // 3. CALENDAR DATA RESOLUTION (STUDENT / FACULTY)
  // ==========================================
  const calendarData: MonthCalendarData = useMemo(() => {
    if (selectedMonthIndex === 7) {
      return isTeacherOrAdmin ? getFacultyAugustCalendar() : getStudentAugustCalendar();
    }
    if (selectedMonthIndex === 9) {
      return isTeacherOrAdmin ? getFacultyOctoberCalendar() : getStudentOctoberCalendar();
    }
    return isTeacherOrAdmin ? getFacultySeptemberCalendar() : getStudentSeptemberCalendar();
  }, [selectedMonthIndex, isTeacherOrAdmin]);

  const activeDayRecord: DayCalendarRecord = useMemo(() => {
    return (
      calendarData.records[selectedCalendarDay] ||
      calendarData.records[1] || {
        day: 1,
        dateStr: "2026-09-01",
        dayOfWeek: "Tuesday",
        shortDay: "Tue",
        status: "present",
        statusLabel: "Present & Logged",
        location: "Block M - Campus",
        dutyOrNotes: "Regular Academic Session",
        schedule: [],
        verifiedBy: "Dean Office",
      }
    );
  }, [calendarData, selectedCalendarDay]);

  // Campus Events for the selected day & month
  const dayEvents: CampusEventDetail[] = useMemo(() => {
    return getEventsForDay(selectedCalendarDay, selectedMonthIndex);
  }, [selectedCalendarDay, selectedMonthIndex]);

  const activeEvent: CampusEventDetail | null = dayEvents[0] || null;

  const upcomingEventsList: CampusEventDetail[] = useMemo(() => {
    return getUpcomingCampusEvents();
  }, []);

  const monthStats = useMemo(() => {
    const days = Object.values(calendarData.records);
    const presentCount = days.filter((d) => d.status === "present").length;
    const odCount = days.filter((d) => d.status === "od").length;
    const leaveCount = days.filter((d) => d.status === "leave").length;
    const holidayCount = days.filter((d) => d.status === "holiday" || d.status === "weekend").length;
    return {
      total: days.length,
      workingDays: calendarData.workingDays,
      presentCount,
      odCount,
      leaveCount,
      holidayCount,
    };
  }, [calendarData]);

  // Radial Gauge SVG Parameters
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calculatedPercentage / 100) * circumference;

  // Competency Radar Chart Dataset (Matching Aura/Stovest Palette & User Code)
  const radarMetrics = [
    { key: "theory", label: "Theory Lectures" },
    { key: "lab", label: "Lab Practicals" },
    { key: "od", label: "OD / Hackathons" },
    { key: "punctuality", label: "RFID Punctuality" },
    { key: "assessments", label: "Continuous Assess" },
    { key: "discipline", label: "Campus Standing" },
  ];

  const radarData = [
    {
      label: isTeacherOrAdmin ? "Faculty Standing" : "Student Standing",
      color: "#3b82f6", // Electric Blue matching Aura/Stovest image
      values: isTeacherOrAdmin
        ? { theory: 96, lab: 95, od: 92, punctuality: 96, assessments: 98, discipline: 96 }
        : {
            theory: Math.round(calculatedPercentage * 0.98),
            lab: Math.min(100, Math.round(calculatedPercentage * 1.06)),
            od: isSafe ? 90 : 65,
            punctuality: isSafe ? 88 : 72,
            assessments: isSafe ? 92 : 78,
            discipline: isSafe ? 94 : 80,
          },
    },
    {
      label: "75% Required Minimum",
      color: "#f59e0b", // Warm Amber matching Aura/Stovest image
      values: { theory: 75, lab: 75, od: 75, punctuality: 75, assessments: 75, discipline: 75 },
    },
  ];

  // Attendance & Leave Distribution Pie Dataset (Strictly matching user colors: #0ea5e9, #a855f7, #f59e0b, #10b981)
  const pieData = [
    { label: "Present Classes", value: presentDays, color: "#0ea5e9" },
    { label: "Approved On-Duty", value: approvedOdDays, color: "#a855f7" },
    { label: "Medical / Leaves", value: Math.max(1, casualMedicalLeaves), color: "#f59e0b" },
    { label: "Campus Recess", value: 8, color: "#10b981" },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[95vh] flex flex-col rounded-lg bg-[var(--bg-base)] border border-[var(--border-hairline)] shadow-2xl text-[var(--text-primary)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Ambient Header */}
        <div className="shrink-0 px-5 sm:px-7 py-4 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <VyseLogo size={32} showText={false} />
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-[var(--text-primary)]">
                  {isTeacherOrAdmin ? "Faculty Teaching Records" : "Student Academic Records"}
                </h3>
                <span
                  className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isTeacherOrAdmin
                      ? "border-[var(--border-hairline-strong)] text-[var(--text-secondary)]"
                      : isSafe
                      ? "border-[#7A8C7A]/30 text-[#7A8C7A] bg-[#7A8C7A]/10"
                      : "border-[#B5675C]/30 text-[#B5675C] bg-[#B5675C]/10"
                  }`}
                >
                  {isTeacherOrAdmin ? "FACULTY PORTAL" : isSafe ? "DEBARMENT SAFE (≥75%)" : "ATTENDANCE DEFICIT"}
                </span>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] font-mono mt-0.5">
                Sathyabama Institute of Science and Technology • Student Records Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] font-mono text-[var(--text-tertiary)] px-3 py-1 rounded-full border border-[var(--border-hairline)]">
              ODD SEMESTER 2026
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-md border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-white flex items-center justify-center transition-colors text-xs font-mono cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Apple-Style Pill Tab Navigation Controls (Deliberate Contrast) */}
        <div className="shrink-0 px-4 sm:px-7 py-3 bg-[var(--bg-base)] border-b border-[var(--border-hairline)] flex items-center gap-2 overflow-x-auto select-none">
          <button
            type="button"
            onClick={() => setActiveTab("attendance")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "attendance"
                ? "bg-[var(--cta-solid)] text-[var(--cta-solid-text)] shadow-xs"
                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-hairline)]"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Dashboard & Performance</span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === "attendance" ? "bg-black/15 text-black" : "border border-[var(--border-hairline)] text-[var(--text-tertiary)]"
              }`}
            >
              {calculatedPercentage}%
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "calendar"
                ? "bg-[var(--cta-solid)] text-[var(--cta-solid-text)] shadow-xs"
                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-hairline)]"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Campus Events Calendar</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full border border-[var(--border-hairline)] text-[var(--text-tertiary)]">
              Freshers & Culturals
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-[var(--cta-solid)] text-[var(--cta-solid-text)] shadow-xs"
                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-hairline)]"
            }`}
          >
            <User className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Personal Bio & ID Profile</span>
          </button>

          {!isTeacherOrAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab("subjects")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "subjects"
                  ? "bg-[var(--cta-solid)] text-[var(--cta-solid-text)] shadow-xs"
                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-hairline)]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Course Registry</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 custom-scrollbar">
          {/* ========================================================= */}
          {/* TAB 1: EXECUTIVE ACADEMIC DASHBOARD                       */}
          {/* ========================================================= */}
          {activeTab === "attendance" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* 1. Welcome Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-display text-2xl sm:text-3xl text-[var(--text-primary)] tracking-tight">
                      Welcome, {studentName}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--border-hairline)] text-[var(--text-secondary)]">
                      {isTeacherOrAdmin ? "FACULTY PROFILE" : "SECTION C2"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] font-mono">
                    {department} • Odd Semester 2026 Academic Overview
                  </p>
                </div>

                <div className="flex items-center gap-2.5 self-start md:self-auto">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] text-xs font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A8C7A]" />
                    <span className="text-[var(--text-secondary)]">Standing:</span>
                    <span className="text-[var(--text-primary)] font-bold">{calculatedPercentage}%</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("calendar")}
                    className="px-3.5 py-1.5 rounded-full border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] bg-[var(--bg-surface-2)] text-[var(--text-primary)] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Campus Events</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                </div>
              </div>

              {/* 2. 4 Obsidian Chrome KPI Cards with Hairline Borders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1 - Overall Attendance */}
                <div className="obsidian-card p-5 flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex items-start justify-between gap-2 z-10">
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                      Overall Attendance
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full border border-[var(--border-hairline)] text-[#7A8C7A]">
                      +15.2% OD
                    </span>
                  </div>

                  <div className="my-2 z-10">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-4xl tracking-tight text-[var(--text-primary)]">
                        {calculatedPercentage}%
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--text-secondary)] font-mono block mt-0.5">
                      +15.2% OD Qualified Standing
                    </span>
                  </div>

                  {/* Brushed Chrome Spline Wave */}
                  <div className="w-full h-8 mt-1 relative z-0 opacity-40">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40" preserveAspectRatio="none">
                      <path d="M0 32 Q 30 10, 60 22 T 120 14 T 160 26 T 200 8" stroke="var(--text-secondary)" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                </div>

                {/* KPI 2 - Classes Conducted */}
                <div className="obsidian-card p-5 flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex items-start justify-between gap-2 z-10">
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                      Classes Conducted
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full border border-[var(--border-hairline)] text-[var(--text-secondary)]">
                      +8.1% Completed
                    </span>
                  </div>

                  <div className="my-2 z-10">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-4xl tracking-tight text-[var(--text-primary)]">
                        {presentDays}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)] font-mono">/ {totalDays} days</span>
                    </div>
                    <span className="text-[11px] text-[var(--text-secondary)] font-mono block mt-0.5">
                      180 periods conducted
                    </span>
                  </div>

                  <div className="w-full h-8 mt-1 relative z-0 opacity-40">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40" preserveAspectRatio="none">
                      <path d="M0 28 Q 40 35, 80 18 T 140 24 T 180 10 T 200 16" stroke="var(--text-secondary)" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                </div>

                {/* KPI 3 - Approved OD Passes */}
                <div className="obsidian-card p-5 flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex items-start justify-between gap-2 z-10">
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                      Approved OD Passes
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full border border-[var(--border-hairline)] text-[var(--text-secondary)]">
                      +3.5% Events
                    </span>
                  </div>

                  <div className="my-2 z-10">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-4xl tracking-tight text-[var(--text-primary)]">
                        {approvedOdDays}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)] font-mono">Events</span>
                    </div>
                    <span className="text-[11px] text-[var(--text-secondary)] font-mono block mt-0.5">
                      National Hackathon Credited
                    </span>
                  </div>

                  <div className="w-full h-8 mt-1 relative z-0 opacity-40">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40" preserveAspectRatio="none">
                      <path d="M0 35 Q 35 15, 75 25 T 130 12 T 175 22 T 200 6" stroke="var(--text-secondary)" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                </div>

                {/* KPI 4 - Safety Cushion */}
                <div className="obsidian-card p-5 flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex items-start justify-between gap-2 z-10">
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                      Safety Bunk Cushion
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full border border-[#7A8C7A]/30 text-[#7A8C7A]">
                      +2.1% Safe
                    </span>
                  </div>

                  <div className="my-2 z-10">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-4xl tracking-tight text-[var(--text-primary)]">
                        +{safeToMissDays}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)] font-mono">Classes</span>
                    </div>
                    <span className="text-[11px] text-[var(--text-secondary)] font-mono block mt-0.5">
                      {casualMedicalLeaves} casual leaves recorded
                    </span>
                  </div>

                  <div className="w-full h-8 mt-1 relative z-0 opacity-40">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40" preserveAspectRatio="none">
                      <path d="M0 30 Q 30 20, 70 30 T 130 16 T 170 24 T 200 10" stroke="var(--text-secondary)" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 3. Dual Apple-Style Analytical Chart Cards (Radar + Pie) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Left (7 Cols): Performance Radar Chart */}
                <div className="lg:col-span-7 rounded-md border-hairline bg-[var(--bg-surface)] p-5 sm:p-6 flex flex-col justify-between space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-hairline gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[var(--text-bright)] tracking-wide">
                          Academic Competency & Standing Radar
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-base)] text-[var(--text-bright)] border-hairline font-bold">
                          Multi-Vector
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Continuous institutional evaluation across 6 key metrics
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono self-start sm:self-auto">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-sm shadow-blue-500/50" />
                        <span className="text-slate-300 font-medium">Standing</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-sm shadow-amber-500/50" />
                        <span className="text-slate-400 font-medium">75% Target</span>
                      </div>
                    </div>
                  </div>

                  {/* The Radar Chart Component */}
                  <div className="flex items-center justify-center py-2 overflow-x-auto">
                    <RadarChart data={radarData} metrics={radarMetrics} size={280}>
                      <RadarGrid levels={4} />
                      <RadarAxis />
                      <RadarLabels />
                      {radarData.map((item, index) => (
                        <RadarArea key={item.label} index={index} />
                      ))}
                    </RadarChart>
                  </div>

                  {/* Radar Metric Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-hairline">
                    {radarMetrics.map((m) => {
                      const val = (radarData[0].values as any)[m.key] || 0;
                      return (
                        <div key={m.key} className="p-2.5 rounded-md bg-[var(--bg-surface-2)] border border-hairline flex items-center justify-between">
                          <span className="text-[11px] text-[var(--text-secondary)] truncate mr-1">{m.label}</span>
                          <span className="text-xs font-mono font-bold text-[var(--text-primary)] shrink-0">{val}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right (5 Cols): Attendance & Leave Distribution Pie Chart */}
                <div className="lg:col-span-5 rounded-lg bg-[var(--bg-surface)] border border-hairline p-5 sm:p-6 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-hairline">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[var(--text-primary)] tracking-wide">
                          Attendance & Leave Distribution
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border border-hairline font-bold">
                          90 Days
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                        Categorical semester proportion
                      </p>
                    </div>

                    <span className="text-[10px] font-mono text-[var(--text-secondary)] px-2.5 py-1 rounded-full bg-[var(--bg-surface-2)] border border-hairline">
                      Odd Sem '26
                    </span>
                  </div>

                  {/* The Pie Chart Component */}
                  <div className="flex items-center justify-center py-2">
                    <PieChart data={pieData} size={240}>
                      {pieData.map((_, index) => (
                        <PieSlice key={index} index={index} />
                      ))}
                    </PieChart>
                  </div>

                  {/* Categorical Breakdown Cards */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-hairline">
                    {pieData.map((item) => {
                      const pct = Math.round((item.value / 90) * 100);
                      return (
                        <div key={item.label} className="p-2.5 rounded-md bg-[var(--bg-surface-2)] border border-hairline space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-[11px] text-[var(--text-secondary)] truncate font-medium">{item.label}</span>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs font-mono font-bold text-[var(--text-primary)]">{item.value} days</span>
                            <span className="text-[10px] font-mono text-[var(--text-tertiary)]">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. Full-Width Academic Calendar Activity Heatwave */}
              <div className="p-5 sm:p-6 rounded-md border-hairline bg-[var(--bg-surface)] space-y-4">
                <ContributionHeatmap
                  isFaculty={isTeacherOrAdmin}
                  showCardWrapper={false}
                  onSelectDate={(date) => {
                    if (date.getMonth() === 8) {
                      setSelectedCalendarDay(date.getDate());
                      setActiveTab("calendar");
                    }
                  }}
                />
              </div>

              {/* 5. Bottom Section: Course Registry Table (7 cols) + Recent Activity Feed (5 cols) (Image 1 Style) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Left Table (7 Cols) */}
                <div className="lg:col-span-7 rounded-md border-hairline bg-[var(--bg-surface)] p-5 sm:p-6 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-hairline">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-bright)] tracking-wide">
                        Course-Wise Attendance Registry
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                        Semester III • Section C2 Subject & Lab Records
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[var(--bg-base)] text-[var(--text-bright)] border-hairline">
                      {subjectAttendance.length} Courses
                    </span>
                  </div>

                  {/* Clean Table matching Image 1 */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-hairline text-[var(--text-muted)] font-mono text-[10px] uppercase tracking-wider">
                          <th className="pb-2.5 font-semibold">Course</th>
                          <th className="pb-2.5 font-semibold">Faculty Mentor</th>
                          <th className="pb-2.5 font-semibold">Classes</th>
                          <th className="pb-2.5 font-semibold">Status</th>
                          <th className="pb-2.5 font-semibold text-right">Standing</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {subjectAttendance.map((sub) => {
                          const meets = sub.percentage >= 75;
                          return (
                            <tr key={sub.code} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 pr-2">
                                <div className="font-semibold text-[var(--text-bright)]">{sub.name}</div>
                                <span className="font-mono text-[10px] text-[var(--text-secondary)]">{sub.code}</span>
                              </td>
                              <td className="py-3 text-[var(--text-secondary)] text-[11px]">{sub.staff}</td>
                              <td className="py-3 font-mono text-[var(--text-secondary)] text-[11px]">
                                {sub.attended}/{sub.total}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                                    meets
                                      ? "bg-[#7A8C7A]/10 text-[#7A8C7A] border-[#7A8C7A]/30"
                                      : "bg-[#B5675C]/10 text-[#B5675C] border-[#B5675C]/30"
                                  }`}
                                >
                                  {meets ? "Eligible" : "Shortage"}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <span className={`font-mono font-bold ${meets ? "text-[#7A8C7A]" : "text-[#B5675C]"}`}>
                                  {sub.percentage}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Activity Feed (5 Cols) */}
                <div className="lg:col-span-5 rounded-md border-hairline bg-[var(--bg-surface)] p-5 sm:p-6 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">
                        Recent Activity & Access Logs
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Turnstiles, Lab Sign-offs & Clearances
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Live Sync
                    </div>
                  </div>

                  {/* 4 Activity Items with Monochrome Hairline Cards */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-md bg-[var(--bg-surface-2)] border border-hairline flex items-start gap-3 hover:border-hairline-strong transition-colors">
                      <div className="w-8 h-8 rounded-md bg-[var(--bg-base)] border border-hairline text-[var(--text-secondary)] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[#7A8C7A]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[var(--text-primary)]">RFID Gate 2 Check-in</span>
                          <span className="text-[10px] font-mono text-[var(--text-tertiary)]">07:54 AM</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Campus Turnstile Verified • On-Time Entry</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-md bg-[var(--bg-surface-2)] border border-hairline flex items-start gap-3 hover:border-hairline-strong transition-colors">
                      <div className="w-8 h-8 rounded-md bg-[var(--bg-base)] border border-hairline text-[var(--text-secondary)] flex items-center justify-center shrink-0">
                        <Trophy className="w-4 h-4 text-[var(--text-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[var(--text-primary)]">National Hackathon OD Pass</span>
                          <span className="text-[10px] font-mono text-[#7A8C7A]">Approved</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">HOD Approved • 2 Days Attendance Credit</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-md bg-[var(--bg-surface-2)] border border-hairline flex items-start gap-3 hover:border-hairline-strong transition-colors">
                      <div className="w-8 h-8 rounded-md bg-[var(--bg-base)] border border-hairline text-[var(--text-secondary)] flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-[var(--text-tertiary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[var(--text-primary)]">Digital Logic Circuit Lab</span>
                          <span className="text-[10px] font-mono text-[var(--text-tertiary)]">Yesterday</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Block M 2nd Fl • Dr. T. Vino Attendance Signed</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-md bg-[var(--bg-surface-2)] border border-hairline flex items-start gap-3 hover:border-hairline-strong transition-colors">
                      <div className="w-8 h-8 rounded-md bg-[var(--bg-base)] border border-hairline text-[var(--text-secondary)] flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4 text-[#7A8C7A]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[var(--text-primary)]">Medical Leave Verification</span>
                          <span className="text-[10px] font-mono text-[#7A8C7A]">Verified</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Dean Office Cleared • 1 Day Exemption</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Safety Cushion Guidance Bar */}
              <div className="p-4 rounded-md bg-[var(--bg-surface)] border border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-md ${isSafe ? "bg-[var(--bg-surface-2)] text-[#7A8C7A]" : "bg-[var(--bg-surface-2)] text-[#B5675C]"} border border-hairline shrink-0`}>
                    {isSafe ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      {isSafe ? "Attendance Safety Cushion & Status" : "Attendance Recovery Requirement"}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {isSafe ? (
                        <>
                          You can safely miss up to <strong className="text-emerald-400 font-mono font-bold">{safeToMissDays} more classes</strong> without falling below the 75% institutional limit.
                        </>
                      ) : (
                        <>
                          CRITICAL: You need to attend the next <strong className="text-rose-400 font-mono font-bold">{neededConsecutiveDays} consecutive days</strong> without absence to reach the 75% threshold.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 text-xs font-semibold shrink-0 cursor-pointer transition-colors"
                >
                  View Full Profile →
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PERSONAL INFORMATION & OFFICIAL ID BADGE           */}
          {/* ========================================================= */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Virtual University Smart ID Card */}
              <div className="relative rounded-lg border-hairline bg-[var(--bg-surface)] p-6 overflow-hidden">
                {/* ID Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-hairline gap-3">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase font-bold">
                      SATHYABAMA INSTITUTE OF SCIENCE AND TECHNOLOGY
                    </span>
                    <h2 className="text-lg font-black text-[var(--text-bright)] font-mono tracking-tight mt-0.5">
                      {isTeacherOrAdmin ? "FACULTY IDENTIFICATION CARD" : "STUDENT DIGITAL SMART PASS"}
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[var(--bg-base)] border-hairline text-[var(--text-bright)] font-bold self-start sm:self-auto">
                    ACADEMIC YEAR 2026–2027
                  </span>
                </div>

                {/* ID Card Body Info Grid */}
                <div className="py-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Avatar & Photo Slot */}
                  <div className="flex flex-col items-center gap-2.5 shrink-0">
                    <div className="relative rounded-md p-1 border-hairline bg-[var(--bg-surface)]">
                      <div className="w-24 h-24 rounded bg-[var(--bg-base)] flex items-center justify-center text-3xl font-black text-[var(--text-bright)] font-mono">
                        {studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#7A8C7A] ring-2 ring-[var(--bg-base)]" />
                    </div>
                    <span className="text-[10px] font-mono text-[#7A8C7A] font-bold px-2 py-0.5 rounded-full bg-[#7A8C7A]/10 border border-[#7A8C7A]/30">
                      STATUS: ACTIVE
                    </span>
                  </div>

                  {/* Profile Key Identity Fields */}
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Full Legal Name
                      </span>
                      <span className="text-sm font-bold text-white">{studentName}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        {isTeacherOrAdmin ? "Employee / Admin ID" : "University Register Number"}
                      </span>
                      <span className="text-sm font-mono font-bold text-purple-300">{regNo}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Department / School
                      </span>
                      <span className="text-xs font-semibold text-slate-200">
                        {department} (School of Computing)
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        {isTeacherOrAdmin ? "Faculty Role" : "Class Section & Semester"}
                      </span>
                      <span className="text-xs font-semibold text-slate-200">
                        {isTeacherOrAdmin
                          ? "Head of Dept (CSE) & OD Approver"
                          : "Section C2 • Semester III (Batch 2025–2029)"}
                      </span>
                    </div>

                    {!isTeacherOrAdmin && (
                      <>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                            Class Coordinator
                          </span>
                          <span className="text-xs font-medium text-slate-300">Ms. Leena Sivaguru</span>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                            Year Coordinator
                          </span>
                          <span className="text-xs font-medium text-slate-300">Dr. A. Viji Amutha Mary</span>
                        </div>
                      </>
                    )}

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Official Contact Email
                      </span>
                      <span className="text-xs font-mono text-slate-300 truncate block">
                        {isTeacherOrAdmin ? "faculty.admin@demo.campora.edu" : `${studentName.toLowerCase().replace(" ", ".")}@demo.campora.edu`}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Transit & Home Location
                      </span>
                      <span className="text-xs font-medium text-slate-300">
                        {isTeacherOrAdmin ? "Faculty Quarters • Campus" : "Tambaram (Bus Route #15A)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ID Card Footer Barcode & Micro-print */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-mono text-slate-500 gap-2">
                  <span>CARD-SERIAL: SIST-2026-98421098</span>
                  <span className="text-slate-400">CATEGORY-1 UNIVERSITY • NAAC 'A++' ACCREDITED</span>
                </div>
              </div>

              {/* Contact & Administrative Directory */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[#0E1322] border border-[#1E2738] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">College Portal</span>
                    <span className="text-xs font-semibold text-slate-200 truncate block">student.sathyabama.ac.in</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0E1322] border border-[#1E2738] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Dean Office Helpdesk</span>
                    <span className="text-xs font-semibold text-slate-200 truncate block">+91 (044) 2450 3150</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0E1322] border border-[#1E2738] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Transit Convener</span>
                    <span className="text-xs font-semibold text-slate-200 truncate block">175 Campus Routes</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: SUBJECT-WISE BREAKDOWN (SECTION C2 TIMETABLE)      */}
          {/* ========================================================= */}
          {activeTab === "subjects" && !isTeacherOrAdmin && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-md border-hairline bg-[var(--bg-surface)] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-bright)] uppercase tracking-wider font-mono">
                    Section C2 Course-Wise Attendance Registry
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Semester III • B.E Computer Science and Engineering (Class Coordinator: Ms. Leena Sivaguru)
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-[var(--bg-base)] text-[var(--text-bright)] border-hairline">
                  {subjectAttendance.length} Courses
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subjectAttendance.map((sub) => {
                  const meets = sub.percentage >= 75;
                  return (
                    <div
                      key={sub.code}
                      className="p-4 rounded-md border-hairline bg-[var(--bg-surface)] hover:border-hairline-strong transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[var(--text-bright)] bg-[var(--bg-base)] px-2 py-0.5 rounded border-hairline">
                              {sub.code}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                                meets
                                  ? "bg-[#7A8C7A]/10 text-[#7A8C7A] border-[#7A8C7A]/30"
                                  : "bg-[#B5675C]/10 text-[#B5675C] border-[#B5675C]/30"
                              }`}
                            >
                              {meets ? "Eligible" : "Shortage"}
                            </span>
                          </div>
                          <h5 className="font-semibold text-xs text-[var(--text-bright)] mt-1">{sub.name}</h5>
                          <p className="text-[11px] text-[var(--text-secondary)]">Staff: {sub.staff}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-xl font-black font-mono ${meets ? "text-[#7A8C7A]" : "text-[#B5675C]"}`}>
                            {sub.percentage}%
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                            {sub.attended}/{sub.total} classes
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-1.5 w-full bg-[var(--bg-base)] rounded-full overflow-hidden border-hairline">
                        <div
                          className={`h-full rounded-full ${meets ? "bg-[#7A8C7A]" : "bg-[#B5675C]"}`}
                          style={{ width: `${sub.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: SATHYABAMA CAMPUS EVENTS CALENDAR                  */}
          {/* Freshers Day, Culturals, Hackathons, Sports & Symposiums  */}
          {/* ========================================================= */}
          {activeTab === "calendar" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* 1. Header Banner & Month Switcher */}
              <div className="p-4 rounded-md border-hairline bg-[var(--bg-surface)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Title & Subtitle */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded border-hairline bg-[var(--bg-base)] flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-[var(--text-bright)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[var(--text-bright)] tracking-wide">
                        Campus Events Calendar (Odd Semester 2026)
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-base)] text-[var(--text-secondary)] border-hairline font-bold">
                        Aarambh & Vivacity '26
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                      Sathyabama Flagship Celebrations • Freshers Day, Mega Culturals, Hackathons & Sports Meet
                    </p>
                  </div>
                </div>

                {/* Right Month Navigation */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <div className="flex items-center rounded border-hairline bg-[var(--bg-base)] p-1">
                    <button
                      type="button"
                      disabled={selectedMonthIndex <= 7}
                      onClick={() => {
                        setSelectedMonthIndex((prev) => Math.max(7, prev - 1));
                        setSelectedCalendarDay(1);
                      }}
                      className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-surface)] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="px-3 py-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span className="text-sm font-bold font-mono text-[var(--text-bright)] tracking-wide">
                        {calendarData.monthName}
                      </span>
                      {calendarData.monthIndex === 8 && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border-hairline bg-[var(--bg-surface)] text-[var(--text-bright)]">
                          FEST MONTH
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={selectedMonthIndex >= 9}
                      onClick={() => {
                        setSelectedMonthIndex((prev) => Math.min(9, prev + 1));
                        setSelectedCalendarDay(1);
                      }}
                      className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-surface)] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Optional Expandable Semester Activity Heatwave */}
              <div className="rounded-md border-hairline bg-[var(--bg-surface)] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--text-muted)]" />
                    <span className="text-xs font-mono font-bold text-[var(--text-bright)] uppercase tracking-wide">
                      Semester Attendance & Activity Heat Wave
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-base)] text-[var(--text-secondary)] border-hairline">
                      Monochrome 16-Week
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHeatwaveInCalendarTab((prev) => !prev)}
                    className="text-xs font-mono text-slate-300 hover:text-white px-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{showHeatwaveInCalendarTab ? "Hide Heat Wave" : "Show Full 16-Week Heat Wave"}</span>
                    <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", showHeatwaveInCalendarTab ? "rotate-90" : "")} />
                  </button>
                </div>

                {showHeatwaveInCalendarTab && (
                  <div className="pt-2 border-t border-white/5 animate-in fade-in duration-200">
                    <ContributionHeatmap
                      isFaculty={isTeacherOrAdmin}
                      showCardWrapper={false}
                      onSelectDate={(date) => {
                        if (date.getMonth() >= 7 && date.getMonth() <= 9) {
                          setSelectedMonthIndex(date.getMonth());
                          setSelectedCalendarDay(date.getDate());
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 3. Flagship Events Quick-Jump Highlights Strip */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Quick-Jump to Flagship Campus Events:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {[
                    {
                      id: "evt-freshers-2026",
                      day: 18,
                      title: "Freshers Day 'Aarambh'",
                      date: "Fri, Sep 18",
                      badge: "💖 Welcome Gala",
                      accent: "from-pink-950/80 to-rose-950/80 border-pink-500/50 text-pink-300 hover:border-pink-400",
                      isFlagship: true,
                    },
                    {
                      id: "evt-culturals-day1",
                      day: 24,
                      title: "Vivacity Culturals (D1)",
                      date: "Thu, Sep 24",
                      badge: "🎭 Fine Arts & Theatre",
                      accent: "from-purple-950/80 to-indigo-950/80 border-purple-500/50 text-purple-300 hover:border-purple-400",
                      isFlagship: true,
                    },
                    {
                      id: "evt-culturals-day2",
                      day: 25,
                      title: "Vivacity Bands (D2)",
                      date: "Fri, Sep 25",
                      badge: "🎸 Battle of Bands",
                      accent: "from-purple-950/80 to-violet-950/80 border-purple-500/50 text-purple-300 hover:border-purple-400",
                    },
                    {
                      id: "evt-culturals-day3",
                      day: 26,
                      title: "Vivacity Star Night (D3)",
                      date: "Sat, Sep 26",
                      badge: "⭐ Choreonite & Concert",
                      accent: "from-fuchsia-950/80 to-purple-950/80 border-fuchsia-500/50 text-fuchsia-300 hover:border-fuchsia-400",
                      isFlagship: true,
                    },
                    {
                      id: "evt-hackathon-codesprint",
                      day: 11,
                      title: "CodeSprint Hackathon",
                      date: "Sep 11–12",
                      badge: "⚡ 24H National",
                      accent: "from-amber-950/80 to-orange-950/80 border-amber-500/50 text-amber-300 hover:border-amber-400",
                    },
                    {
                      id: "evt-sports-day-2026",
                      day: 29,
                      title: "Jeppiaar Sports Trophy",
                      date: "Tue, Sep 29",
                      badge: "🏆 University Meet",
                      accent: "from-emerald-950/80 to-teal-950/80 border-emerald-500/50 text-emerald-300 hover:border-emerald-400",
                    },
                  ].map((evt) => {
                    const isSelected = selectedCalendarDay === evt.day;
                    return (
                      <button
                        key={evt.id}
                        type="button"
                        onClick={() => {
                          setSelectedCalendarDay(evt.day);
                          if (selectedMonthIndex !== 8) setSelectedMonthIndex(8);
                        }}
                        className={`p-2.5 rounded-xl border text-left bg-gradient-to-br transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                          evt.accent
                        } ${
                          isSelected
                            ? "ring-2 ring-white/60 shadow-lg shadow-pink-950/50 scale-[1.02]"
                            : "hover:scale-[1.01]"
                        }`}
                      >
                        <div>
                          <span className="text-[9px] font-mono font-bold block truncate">{evt.badge}</span>
                          <span className="text-xs font-bold text-white block mt-0.5 truncate group-hover:text-pink-200">
                            {evt.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-300 block mt-1">{evt.date}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none">
                <span className="text-[10px] font-mono uppercase text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-slate-400" /> Category:
                </span>
                {[
                  { id: "all", label: "All Events", count: CAMPUS_EVENTS_SEPTEMBER_2026.length },
                  { id: "freshers", label: "💖 Freshers Day", count: 1, color: "bg-pink-400" },
                  { id: "cultural", label: "🎭 Mega Culturals", count: 3, color: "bg-purple-400" },
                  { id: "hackathon", label: "⚡ Hackathons", count: 2, color: "bg-amber-400" },
                  { id: "technical", label: "💻 Technical & AI", count: 2, color: "bg-cyan-400" },
                  { id: "sports", label: "🏆 Sports Meet", count: 1, color: "bg-emerald-400" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setSelectedEventCategory(filter.id as any)}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      selectedEventCategory === filter.id
                        ? "bg-[var(--text-bright)] text-[var(--bg-base)] border-[var(--text-bright)] shadow-sm"
                        : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-hairline hover:text-[var(--text-bright)] hover:border-hairline-strong"
                    }`}
                  >
                    {filter.color && <span className={`w-1.5 h-1.5 rounded-full ${filter.color}`} />}
                    <span>{filter.label}</span>
                    <span className="text-[10px] opacity-70">({filter.count})</span>
                  </button>
                ))}
              </div>

              {/* 4. Two-Column Split: Interactive Month Calendar (Left) + Event Inspector Card (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left Column: 7-Column Monthly Calendar Grid */}
                <div className="lg:col-span-7 p-4 sm:p-5 rounded-md border-hairline bg-[var(--bg-surface)] flex flex-col justify-between space-y-4">
                  <div>
                    {/* Day of Week Headers */}
                    <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
                      {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((dayName, idx) => (
                        <div
                          key={dayName}
                          className={`py-1 text-[11px] font-mono font-bold tracking-wider ${
                            idx === 0 || idx === 6 ? "text-slate-500" : "text-slate-300"
                          }`}
                        >
                          {dayName}
                        </div>
                      ))}
                    </div>

                    {/* Day Number Cells Grid */}
                    <div className="grid grid-cols-7 gap-1.5">
                      {/* Blank offset cells for September 1 (starts on Tuesday -> 2 offset cells) */}
                      {Array.from({ length: calendarData.firstDayOffset }).map((_, idx) => (
                        <div
                          key={`offset-${idx}`}
                          className="h-16 sm:h-20 rounded-xl border border-dashed border-zinc-800/30 bg-zinc-950/20"
                        />
                      ))}

                      {/* Day Number Cells */}
                      {Array.from({ length: calendarData.totalDays }, (_, i) => i + 1).map((dayNum) => {
                        const dayEvts = getEventsForDay(dayNum, selectedMonthIndex);
                        const evt = dayEvts[0] || null;
                        const isSelected = selectedCalendarDay === dayNum;
                        const isToday = selectedMonthIndex === 8 && dayNum === 11;

                        // Filter check
                        const matchesCategory =
                          selectedEventCategory === "all" ||
                          (evt && evt.category === selectedEventCategory) ||
                          (selectedEventCategory === "technical" && (evt?.category === "technical" || evt?.category === "workshop"));

                        // Determine event badge color
                        const isFreshers = evt?.category === "freshers";
                        const isCultural = evt?.category === "cultural";
                        const isHackathon = evt?.category === "hackathon";
                        const isSports = evt?.category === "sports";
                        const isTech = evt?.category === "technical" || evt?.category === "workshop";
                        const isHoliday = evt?.category === "holiday";

                        return (
                          <button
                            key={dayNum}
                            type="button"
                            onClick={() => setSelectedCalendarDay(dayNum)}
                            className={`h-16 sm:h-20 p-1.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer relative overflow-hidden group ${
                              !matchesCategory && evt
                                ? "opacity-30"
                                : isSelected
                                ? "bg-gradient-to-br from-pink-950/80 via-purple-950/80 to-indigo-950/80 border-pink-400 ring-2 ring-pink-500/60 shadow-xl shadow-pink-950/50"
                                : isFreshers
                                ? "bg-[#23091B] border-pink-500/70 hover:border-pink-400 text-pink-200 ring-1 ring-pink-500/30 shadow-md shadow-pink-950/40"
                                : isCultural
                                ? "bg-[#1A0A2E] border-purple-500/70 hover:border-purple-400 text-purple-200 ring-1 ring-purple-500/30 shadow-md shadow-purple-950/40"
                                : isHackathon
                                ? "bg-[#241505] border-amber-500/60 hover:border-amber-400 text-amber-200"
                                : isSports
                                ? "bg-[#0A2218] border-emerald-500/60 hover:border-emerald-400 text-emerald-200"
                                : isTech
                                ? "bg-[#091C28] border-cyan-500/60 hover:border-cyan-400 text-cyan-200"
                                : isHoliday
                                ? "bg-[#181C26] border-slate-700/60 text-slate-400"
                                : isToday
                                ? "bg-cyan-950/40 border-cyan-400/80 ring-1 ring-cyan-400/50 text-white"
                                : "bg-[#0B0F19]/90 border-zinc-800/60 hover:border-slate-600 text-slate-400"
                            }`}
                          >
                            {/* Day Number & Event Pin */}
                            <div className="flex items-start justify-between w-full">
                              <span
                                className={`text-xs font-mono font-bold ${
                                  isSelected
                                    ? "text-white"
                                    : isFreshers
                                    ? "text-pink-300 font-black"
                                    : isCultural
                                    ? "text-purple-300 font-black"
                                    : isHackathon
                                    ? "text-amber-300"
                                    : isSports
                                    ? "text-emerald-300"
                                    : isToday
                                    ? "text-cyan-300"
                                    : "text-slate-400"
                                }`}
                              >
                                {dayNum}
                              </span>

                              {isFreshers ? (
                                <span className="text-[10px] animate-bounce">💖</span>
                              ) : isCultural ? (
                                <span className="text-[10px]">🎭</span>
                              ) : isHackathon ? (
                                <span className="text-[10px]">⚡</span>
                              ) : isToday ? (
                                <span className="text-[8px] font-mono font-black px-1 rounded bg-cyan-400 text-slate-950">
                                  NOW
                                </span>
                              ) : null}
                            </div>

                            {/* Event Label Tag or Academic Status */}
                            <div className="w-full">
                              {isFreshers ? (
                                <span className="text-[8px] sm:text-[9px] font-mono font-black text-pink-200 bg-pink-900/70 border border-pink-600/60 px-1 py-0.2 rounded block truncate text-center shadow-xs">
                                  Freshers Day
                                </span>
                              ) : isCultural ? (
                                <span className="text-[8px] sm:text-[9px] font-mono font-bold text-purple-200 bg-purple-900/70 border border-purple-600/60 px-1 py-0.2 rounded block truncate text-center shadow-xs">
                                  {evt?.shortTitle.replace("Culturals ", "") || "Culturals"}
                                </span>
                              ) : isHackathon ? (
                                <span className="text-[8px] sm:text-[9px] font-mono font-bold text-amber-200 bg-amber-900/60 border border-amber-600/50 px-1 py-0.2 rounded block truncate text-center">
                                  {evt?.shortTitle || "Hackathon"}
                                </span>
                              ) : isSports ? (
                                <span className="text-[8px] sm:text-[9px] font-mono font-bold text-emerald-200 bg-emerald-900/60 border border-emerald-600/50 px-1 py-0.2 rounded block truncate text-center">
                                  Sports Trophy
                                </span>
                              ) : isTech ? (
                                <span className="text-[8px] sm:text-[9px] font-mono font-bold text-cyan-200 bg-cyan-900/60 border border-cyan-600/50 px-1 py-0.2 rounded block truncate text-center">
                                  {evt?.shortTitle || "Symposium"}
                                </span>
                              ) : isHoliday ? (
                                <span className="text-[8px] font-mono text-slate-400 bg-slate-900 px-1 py-0.2 rounded block truncate text-center">
                                  Holiday
                                </span>
                              ) : (
                                <span className="text-[8px] font-mono text-slate-500 truncate block">
                                  {selectedMonthIndex === 8 && (dayNum % 7 === 5 || dayNum % 7 === 6)
                                    ? "Recess"
                                    : "Instruction"}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Calendar Category Legend */}
                  <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-pink-400" />
                        Freshers Day (Sep 18)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        Vivacity Culturals (Sep 24-26)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        Hackathon (Sep 11-12)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Sports Meet (Sep 29)
                      </span>
                    </div>
                    <span className="text-slate-500">Click any event day to inspect full details</span>
                  </div>
                </div>

                {/* Right Column: Selected Day Event Inspector Card */}
                <div className="lg:col-span-5 p-5 rounded-md border-hairline bg-[var(--bg-surface)] flex flex-col justify-between space-y-4">
                  {activeEvent ? (
                    <div className="space-y-4">
                      {/* Event Banner Header */}
                      <div className="pb-3 border-b border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${activeEvent.badgeBg} ${activeEvent.badgeBorder} ${activeEvent.badgeText}`}
                          >
                            {activeEvent.categoryLabel}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-muted)] font-semibold">
                            {activeEvent.themeTag}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-lg font-black text-[var(--text-bright)] font-mono leading-snug">
                            {activeEvent.title}
                          </h4>
                          <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
                            {activeEvent.dayOfWeek}, {activeEvent.day} {activeEvent.monthName}
                          </p>
                        </div>
                      </div>

                      {/* Event Venue, Time & Chief Guest */}
                      <div className="space-y-2 text-xs">
                        <div className="p-3 rounded border-hairline bg-[var(--bg-base)] flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                              Venue & Stage
                            </span>
                            <span className="font-semibold text-[var(--text-bright)] block mt-0.5">
                              {activeEvent.venue}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 rounded border-hairline bg-[var(--bg-base)] flex items-start gap-2.5">
                          <Clock className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                              Session Timing
                            </span>
                            <span className="font-semibold text-[var(--text-bright)] block mt-0.5">
                              {activeEvent.time}
                            </span>
                          </div>
                        </div>

                        {activeEvent.chiefGuest && (
                          <div className="p-3 rounded border-hairline bg-[var(--bg-base)] flex items-start gap-2.5">
                            <Award className="w-4 h-4 text-[#C29B38] shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] font-mono text-[#C29B38] uppercase tracking-wider block">
                                Chief Guests & VIPs
                              </span>
                              <span className="font-semibold text-[var(--text-bright)] block mt-0.5">
                                {activeEvent.chiefGuest}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Event Description & Highlights */}
                      <div className="space-y-2">
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                          {activeEvent.description}
                        </p>

                        <div className="p-3 rounded border-hairline bg-[var(--bg-base)] space-y-1.5">
                          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[var(--text-bright)]" /> Key Event Highlights:
                          </span>
                          <ul className="space-y-1 text-[11px] text-[var(--text-secondary)]">
                            {activeEvent.highlights.map((h, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-[var(--text-bright)] font-bold shrink-0">•</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Role-Specific Action Card: Student vs Faculty */}
                      <div className="pt-2 border-t border-white/10 space-y-3">
                        {isTeacherOrAdmin ? (
                          /* FACULTY / ADMIN DUTY CARD */
                          <div className="p-3.5 rounded border-hairline bg-[var(--bg-base)] space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-secondary)] flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-[var(--text-bright)]" />
                                Official Faculty Duty Assignment
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full border-hairline bg-[var(--bg-surface)] text-[var(--text-bright)]">
                                Dr. T. Vino
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-[var(--text-bright)]">{activeEvent.facultyDuty}</p>
                            <button
                              type="button"
                              onClick={() => {
                                if (!acknowledgedFacultyDuties.includes(activeEvent.id)) {
                                  setAcknowledgedFacultyDuties((prev) => [...prev, activeEvent.id]);
                                }
                              }}
                              className={`w-full py-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                acknowledgedFacultyDuties.includes(activeEvent.id)
                                  ? "bg-[#7A8C7A]/20 text-[#7A8C7A] border border-[#7A8C7A]/40"
                                  : "cta-pill-solid"
                              }`}
                            >
                              <Check className="w-4 h-4" />
                              <span>
                                {acknowledgedFacultyDuties.includes(activeEvent.id)
                                  ? "Faculty Duty Acknowledged & Logged"
                                  : "Acknowledge Event Duty Assignment"}
                              </span>
                            </button>
                          </div>
                        ) : (
                          /* STUDENT REGISTRATION & ON-DUTY (OD) CARD */
                          <div className="p-3.5 rounded border-hairline bg-[var(--bg-base)] space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-secondary)] flex items-center gap-1.5">
                                <FileCheck className="w-3.5 h-3.5 text-[var(--text-bright)]" />
                                Student OD Pass & Perks
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#7A8C7A]/10 text-[#7A8C7A] border border-[#7A8C7A]/30 font-bold">
                                {activeEvent.odEligible ? "OD Authorized" : "Recess"}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)]">{activeEvent.studentPerks}</p>

                            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-1 border-t border-white/5">
                              <span>Registered Students:</span>
                              <span className="text-[var(--text-bright)] font-bold">
                                {registeredEventIds.includes(activeEvent.id)
                                  ? activeEvent.registeredCount + 1
                                  : activeEvent.registeredCount}{" "}
                                Attendees
                              </span>
                            </div>

                            {/* Interactive Registration Button */}
                            {activeEvent.registrationOpen && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (!registeredEventIds.includes(activeEvent.id)) {
                                    setRegisteredEventIds((prev) => [...prev, activeEvent.id]);
                                  }
                                }}
                                className={`w-full py-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                  registeredEventIds.includes(activeEvent.id)
                                    ? "bg-[#7A8C7A]/20 text-[#7A8C7A] border border-[#7A8C7A]/40"
                                    : "cta-pill-solid"
                                }`}
                              >
                                {registeredEventIds.includes(activeEvent.id) ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 text-[#7A8C7A]" />
                                    <span>Entry Pass Confirmed (OD Registered)</span>
                                  </>
                                ) : (
                                  <>
                                    <PartyPopper className="w-4 h-4 text-inherit" />
                                    <span>Claim Free Student Pass & Register</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Non-event day overview */
                    <div className="space-y-4 my-auto py-8 text-center">
                      <div className="w-12 h-12 rounded border-hairline bg-[var(--bg-base)] flex items-center justify-center mx-auto text-[var(--text-muted)]">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-[var(--text-bright)] font-mono">
                          Day {selectedCalendarDay} September 2026
                        </h5>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xs mx-auto">
                          Regular academic instructional day. No major flagship fests scheduled on this date.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/10 space-y-2">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">
                          Jump Directly to Flagship Celebrations:
                        </span>
                        <div className="flex flex-col gap-2 max-w-xs mx-auto">
                          <button
                            type="button"
                            onClick={() => setSelectedCalendarDay(18)}
                            className="py-2 px-3 rounded border-hairline bg-[var(--bg-base)] hover:border-hairline-strong text-[var(--text-bright)] text-xs font-bold transition-all cursor-pointer flex items-center justify-between"
                          >
                            <span>Freshers Day 'Aarambh' (Sep 18)</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedCalendarDay(24)}
                            className="py-2 px-3 rounded border-hairline bg-[var(--bg-base)] hover:border-hairline-strong text-[var(--text-bright)] text-xs font-bold transition-all cursor-pointer flex items-center justify-between"
                          >
                            <span>Vivacity Culturals (Sep 24–26)</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Bottom Navigation & Feature Summary Bar */}
              <div className="p-4 rounded-md border-hairline bg-[var(--bg-surface)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded border-hairline bg-[var(--bg-base)] flex items-center justify-center text-[#7A8C7A] shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[var(--text-bright)] block">
                      Need Attendance & Leaves Breakdown?
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] font-mono">
                      Current: {calculatedPercentage}% attendance • {presentDays} days logged • {casualMedicalLeaves} leaves
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("attendance")}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
                >
                  <span>Open Attendance Analytics</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="shrink-0 p-4 sm:px-6 border-t border-[#1F293D] bg-[#0E1322]/90 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            Institutional Registry Timestamp: {new Date().toLocaleDateString("en-GB")}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
