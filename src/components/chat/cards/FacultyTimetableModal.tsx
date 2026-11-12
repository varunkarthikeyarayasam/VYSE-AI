"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  GraduationCap,
  X,
  BookOpen,
  Coffee,
  Utensils,
  Award,
  Sparkles,
  Info,
  CheckCircle2,
  Table as TableIcon,
  Layers,
} from "lucide-react";
import {
  FACULTY_METADATA,
  FACULTY_WEEKLY_TIMETABLE,
  FACULTY_MATRIX_DATA,
  getFacultyScheduleForDay,
  FacultyPeriod,
} from "../../../data/sathyabamaFacultyTimetable";

interface FacultyTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDay?: string;
}

export function FacultyTimetableModal({
  isOpen,
  onClose,
  initialDay = "Monday",
}: FacultyTimetableModalProps) {
  const [selectedDay, setSelectedDay] = useState<string>(initialDay);
  const [viewMode, setViewMode] = useState<"matrix" | "daily">("matrix");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDaySchedule = getFacultyScheduleForDay(selectedDay);

  const daysList: Array<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"> = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  // Section badge color map
  const getSectionColor = (sec: string) => {
    if (sec.startsWith("A")) return "bg-[var(--bg-surface-2)] text-[var(--text-primary)] border-hairline";
    if (sec.startsWith("B")) return "bg-[var(--bg-surface-2)] text-[var(--text-primary)] border-hairline";
    if (sec.startsWith("C")) return "bg-[var(--bg-surface-2)] text-[var(--text-primary)] border-hairline-strong";
    if (sec.startsWith("D")) return "bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border-hairline";
    if (sec.startsWith("E")) return "bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] border-hairline";
    return "bg-[var(--bg-base)] text-[var(--text-secondary)] border-hairline";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[var(--bg-surface)] border border-hairline-strong rounded-lg overflow-hidden flex flex-col h-[90vh]">
        {/* Top Header */}
        <div className="px-5 py-4 bg-[var(--bg-surface-2)] border-b border-hairline flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-md bg-[var(--bg-base)] border border-hairline flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-wide font-mono uppercase">
                  {FACULTY_METADATA.institution}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-base)] text-[var(--text-secondary)] border border-hairline font-medium">
                  {FACULTY_METADATA.academicYear}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] flex items-center gap-2 flex-wrap">
                <span className="font-medium text-[var(--text-primary)]">{FACULTY_METADATA.school}</span>
                <span>•</span>
                <span>FACULTY: <strong className="text-white font-mono">{FACULTY_METADATA.facultyName}</strong></span>
                <span>•</span>
                <span className="text-zinc-400 font-mono">ID: {FACULTY_METADATA.staffId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("matrix")}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "matrix"
                    ? "bg-purple-600 text-white shadow-sm font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <TableIcon className="w-3 h-3" />
                <span className="hidden sm:inline">Official Table Matrix</span>
                <span className="sm:hidden">Matrix</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("daily")}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "daily"
                    ? "bg-purple-600 text-white shadow-sm font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Layers className="w-3 h-3" />
                <span className="hidden sm:inline">Daily Detailed Plan</span>
                <span className="sm:hidden">Daily</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
              title="Close Timetable"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Info Strip */}
        <div className="px-5 py-2.5 bg-[#0B0F1C] border-b border-purple-950/60 flex items-center justify-between text-xs text-slate-400 shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Subject: <strong className="text-white font-mono">{FACULTY_METADATA.primaryCourseCode}</strong> — {FACULTY_METADATA.primaryCourseName}</span>
            </span>
            <span className="hidden md:inline text-zinc-600">•</span>
            <span className="hidden md:flex items-center gap-1 text-zinc-400">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>Lab: Virtual Computing Lab (Block M, 2nd Floor)</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-800/60 text-purple-300 text-[11px] font-mono font-bold">
              21 Teaching Hours / Week
            </span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-[11px] font-mono">
              Sections A1–E3
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {viewMode === "matrix" ? (
            /* =========================================================================
             * VIEW 1: OFFICIAL VERBATIM TABLE MATRIX (Matching PDF document)
             * ========================================================================= */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <span>Weekly Allocation Matrix</span>
                    <span className="text-[10px] text-purple-400 font-sans normal-case font-normal">
                      (Click any cell to inspect section lab & topic details)
                    </span>
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">
                  {FACULTY_METADATA.academicYear}
                </span>
              </div>

              {/* PDF Responsive Table Container */}
              <div className="overflow-x-auto rounded-xl border border-zinc-800 shadow-xl bg-zinc-950/90">
                <table className="w-full text-center border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-900/90 text-zinc-300 font-bold border-b border-zinc-800">
                      <th className="p-3 border-r border-zinc-800 text-left font-mono min-w-[100px]">
                        DAY/TIMING
                      </th>
                      <th className="p-3 border-r border-zinc-800 min-w-[95px]">
                        9.00-10.00
                      </th>
                      <th className="p-3 border-r border-zinc-800 min-w-[95px]">
                        10.00-11.00
                      </th>
                      <th className="p-3 border-r border-zinc-800 bg-amber-950/20 text-amber-400 min-w-[95px]">
                        11.00-11.15<br />
                        <span className="text-[10px] font-mono font-normal">BREAK</span>
                      </th>
                      <th className="p-3 border-r border-zinc-800 bg-rose-950/20 text-rose-400 min-w-[95px]">
                        11.15-12.15<br />
                        <span className="text-[10px] font-mono font-normal">LUNCH</span>
                      </th>
                      <th className="p-3 border-r border-zinc-800 min-w-[95px]">
                        12.15-1.15
                      </th>
                      <th className="p-3 border-r border-zinc-800 min-w-[95px]">
                        1.15-2.15
                      </th>
                      <th className="p-3 min-w-[95px]">
                        2.15-3.15
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {FACULTY_MATRIX_DATA.map((row) => (
                      <tr
                        key={row.day}
                        className="hover:bg-zinc-900/40 transition-colors"
                      >
                        {/* Day Name */}
                        <td className="p-3 border-r border-zinc-800 text-left font-semibold text-white bg-zinc-900/30">
                          {row.day}
                        </td>

                        {/* Period 1: 9.00-10.00 */}
                        <td className="p-2 border-r border-zinc-800">
                          {row.period1 ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSection(row.period1);
                                setSelectedDay(row.day);
                              }}
                              className={`w-full py-2 rounded-lg border font-mono font-bold text-xs tracking-wider transition-all hover:scale-105 cursor-pointer shadow-sm ${getSectionColor(
                                row.period1
                              )}`}
                            >
                              {row.period1}
                            </button>
                          ) : (
                            <span className="text-zinc-600 font-mono text-[11px] italic">—</span>
                          )}
                        </td>

                        {/* Period 2: 10.00-11.00 */}
                        <td className="p-2 border-r border-zinc-800">
                          {row.period2 ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSection(row.period2);
                                setSelectedDay(row.day);
                              }}
                              className={`w-full py-2 rounded-lg border font-mono font-bold text-xs tracking-wider transition-all hover:scale-105 cursor-pointer shadow-sm ${getSectionColor(
                                row.period2
                              )}`}
                            >
                              {row.period2}
                            </button>
                          ) : (
                            <span className="text-zinc-600 font-mono text-[11px] italic">—</span>
                          )}
                        </td>

                        {/* Break */}
                        <td className="p-2 border-r border-zinc-800 bg-amber-950/10 text-amber-400 font-mono text-[10px] font-semibold">
                          BREAK
                        </td>

                        {/* Lunch */}
                        <td className="p-2 border-r border-zinc-800 bg-rose-950/10 text-rose-400 font-mono text-[10px] font-semibold">
                          LUNCH
                        </td>

                        {/* Period 3: 12.15-1.15 */}
                        <td className="p-2 border-r border-zinc-800">
                          {row.period3 ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSection(row.period3);
                                setSelectedDay(row.day);
                              }}
                              className={`w-full py-2 rounded-lg border font-mono font-bold text-xs tracking-wider transition-all hover:scale-105 cursor-pointer shadow-sm ${getSectionColor(
                                row.period3
                              )}`}
                            >
                              {row.period3}
                            </button>
                          ) : (
                            <span className="text-zinc-600 font-mono text-[11px] italic">—</span>
                          )}
                        </td>

                        {/* Period 4: 1.15-2.15 */}
                        <td className="p-2 border-r border-zinc-800">
                          {row.period4 ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSection(row.period4);
                                setSelectedDay(row.day);
                              }}
                              className={`w-full py-2 rounded-lg border font-mono font-bold text-xs tracking-wider transition-all hover:scale-105 cursor-pointer shadow-sm ${getSectionColor(
                                row.period4
                              )}`}
                            >
                              {row.period4}
                            </button>
                          ) : (
                            <span className="text-zinc-600 font-mono text-[11px] italic">—</span>
                          )}
                        </td>

                        {/* Period 5: 2.15-3.15 */}
                        <td className="p-2">
                          {row.period5 ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSection(row.period5);
                                setSelectedDay(row.day);
                              }}
                              className={`w-full py-2 rounded-lg border font-mono font-bold text-xs tracking-wider transition-all hover:scale-105 cursor-pointer shadow-sm ${getSectionColor(
                                row.period5
                              )}`}
                            >
                              {row.period5}
                            </button>
                          ) : (
                            <span className="text-zinc-600 font-mono text-[11px] italic">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Verbatim Footnote from Image */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono italic text-zinc-300">
                  {FACULTY_METADATA.note}
                </span>
                <span className="text-purple-400 font-semibold text-[11px]">
                  Total: 21 Active Periods / Week
                </span>
              </div>
            </div>
          ) : (
            /* =========================================================================
             * VIEW 2: DAILY DETAILED SCHEDULE VIEW
             * ========================================================================= */
            <div className="space-y-4">
              {/* Day Selector Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {daysList.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDay(d)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shrink-0 cursor-pointer ${
                      selectedDay === d
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
                        : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800/80"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Day's Header */}
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{selectedDay}'s Teaching Schedule</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                    {currentDaySchedule.totalTeachingHours} Teaching Sessions
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-mono">
                  {FACULTY_METADATA.primaryCourseCode} • {FACULTY_METADATA.primaryCourseName}
                </span>
              </div>

              {/* Detailed Session Cards */}
              <div className="space-y-2.5">
                {currentDaySchedule.periods.map((period, idx) => {
                  const isBreak = period.type === "break";
                  const isLunch = period.type === "lunch";
                  const isFree = period.type === "free";

                  if (isBreak) {
                    return (
                      <div
                        key={idx}
                        className="px-4 py-2 rounded-xl bg-amber-950/20 border border-amber-800/30 text-amber-300 flex items-center gap-2.5 text-xs font-mono"
                      >
                        <Coffee className="w-4 h-4 text-amber-400" />
                        <span>{period.timeSlot}</span>
                        <span>•</span>
                        <span className="font-bold">{period.courseName}</span>
                      </div>
                    );
                  }

                  if (isLunch) {
                    return (
                      <div
                        key={idx}
                        className="px-4 py-2 rounded-xl bg-rose-950/20 border border-rose-800/30 text-rose-300 flex items-center gap-2.5 text-xs font-mono"
                      >
                        <Utensils className="w-4 h-4 text-rose-400" />
                        <span>{period.timeSlot}</span>
                        <span>•</span>
                        <span className="font-bold">{period.courseName}</span>
                      </div>
                    );
                  }

                  if (isFree) {
                    return (
                      <div
                        key={idx}
                        className="px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60 text-zinc-400 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-zinc-500">{period.timeSlot}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="italic">{period.courseName}</span>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-500">{period.roomOrLab}</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-purple-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 font-mono font-bold text-xs">
                          P{period.periodNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-purple-300">
                              {period.timeSlot}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full border font-bold ${getSectionColor(period.section || "")}`}>
                              Section {period.section}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                              {period.type === "lab" ? "VIRTUAL LAB" : "THEORY"}
                            </span>
                          </div>
                          <p className="text-xs text-white font-medium mt-0.5">
                            {period.topic}
                          </p>
                          <p className="text-[11px] text-zinc-400 font-mono">
                            {period.studentBatch}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-2 py-1 rounded-lg flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          <span>{period.roomOrLab}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Workload Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Total Teaching Workload
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-white">21 Hours</span>
                <span className="text-[11px] text-emerald-400 font-mono">Per Week</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Mon (4), Tue (4), Wed (4), Thu (4), Fri (5)
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Allocated Student Sections
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-white">12 Sections</span>
                <span className="text-[11px] text-purple-400 font-mono">A1 through E3</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                ~720 students enrolled across CSE Year II
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Faculty Cabin & Support
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold font-mono text-white truncate">Cabin 204</span>
                <span className="text-[11px] text-cyan-400 font-mono">Block M</span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate">
                Office Hours: Daily 2:15 PM – 3:15 PM
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0B0F1C] border-t border-purple-950/60 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-zinc-400">
            <Info className="w-3.5 h-3.5 text-purple-400" />
            <span>Official Faculty Timetable Gazette • Sathyabama School of Computing</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-md shadow-purple-600/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
