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
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  SATHYABAMA_TIMETABLE_HEADER,
  SECTION_C2_COURSES,
  SECTION_C2_TIMETABLE,
  DaySchedule,
  getScheduleForDay,
} from "../../../data/sathyabamaTimetable";

interface SectionC2TimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDay?: string;
}

export function SectionC2TimetableModal({
  isOpen,
  onClose,
  initialDay = "FRIDAY",
}: SectionC2TimetableModalProps) {
  const [selectedDay, setSelectedDay] = useState<string>(initialDay.toUpperCase());
  const [viewMode, setViewMode] = useState<"day" | "grid">("day");

  if (!isOpen) return null;

  const currentSchedule: DaySchedule = getScheduleForDay(selectedDay);

  const daysList: Array<"MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY"> = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[var(--bg-surface)] border border-hairline-strong rounded-lg overflow-hidden flex flex-col h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[var(--bg-surface-2)] border-b border-hairline flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-md bg-[var(--bg-base)] border border-hairline flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-wide font-mono uppercase">
                  Sathyabama Timetable • School of Computing
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-base)] text-[var(--text-primary)] border border-hairline font-semibold">
                  SEC {SATHYABAMA_TIMETABLE_HEADER.section}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-base)] text-[var(--text-secondary)] border border-hairline">
                  {SATHYABAMA_TIMETABLE_HEADER.academicYear}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {SATHYABAMA_TIMETABLE_HEADER.program} • Year {SATHYABAMA_TIMETABLE_HEADER.year} / Semester {SATHYABAMA_TIMETABLE_HEADER.semester} (Batch {SATHYABAMA_TIMETABLE_HEADER.batch})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Switcher: Day View vs Grid View */}
            <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("day")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  viewMode === "day"
                    ? "bg-indigo-600 text-white shadow-sm font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Daily View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white shadow-sm font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Full Weekly Grid
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

        {/* Coordinators Bar */}
        <div className="px-5 py-2 bg-[#0B101C] border-b border-indigo-950/60 flex items-center justify-between text-[11px] text-slate-400 shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <strong className="text-slate-300">Class Coordinator:</strong>{" "}
              {SATHYABAMA_TIMETABLE_HEADER.classCoordinator}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <strong className="text-slate-300">Year Coordinator:</strong>{" "}
              {SATHYABAMA_TIMETABLE_HEADER.yearCoordinator}
            </span>
          </div>
          <span className="font-mono text-emerald-400">Campus Hours: 09:00 AM - 03:15 PM</span>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {viewMode === "day" ? (
            /* Day View with Pills */
            <div className="space-y-4">
              {/* Day Pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {daysList.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                      selectedDay === day
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400"
                        : "bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    <span>{day}</span>
                    {selectedDay === day && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </button>
                ))}
              </div>

              {/* Sessions List */}
              <div className="space-y-3">
                {currentSchedule.periods.map((period, idx) => {
                  if (period.isBreak) {
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-center justify-between text-xs text-amber-200"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Coffee className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold block">{period.courseName}</span>
                            <span className="text-[10px] text-amber-300/80">
                              {period.roomOrLab}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono font-bold bg-amber-900/50 px-2.5 py-1 rounded-lg border border-amber-700/50">
                          {period.timeSlot} (15 mins)
                        </span>
                      </div>
                    );
                  }

                  if (period.isLunch) {
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-800/40 flex items-center justify-between text-xs text-orange-200"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                            <Utensils className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold block">{period.courseName}</span>
                            <span className="text-[10px] text-orange-300/80">
                              {period.roomOrLab}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono font-bold bg-orange-900/50 px-2.5 py-1 rounded-lg border border-orange-700/50">
                          {period.timeSlot} (1 hour)
                        </span>
                      </div>
                    );
                  }

                  const courseDetail = SECTION_C2_COURSES[period.courseCode];

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#0E1422] border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                          {period.periodNumber}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
                              {period.courseCode}
                            </span>
                            <h4 className="font-bold text-sm text-white truncate">
                              {period.courseName}
                            </h4>
                          </div>

                          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1 text-slate-300">
                              <User className="w-3.5 h-3.5 text-indigo-400" />
                              Staff: <strong className="text-white font-medium">{period.handlingStaff}</strong>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-300">
                              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                              {period.roomOrLab}
                            </span>
                          </div>

                          {courseDetail && (
                            <p className="text-[10px] text-slate-500 mt-1">
                              Coordinator: {courseDetail.courseCoordinator} • {courseDetail.credits} Academic Credits
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-800/60">
                          {period.timeSlot}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Official Weekly Grid View matching Circular */
            <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#0A0E18]">
              <table className="w-full text-xs text-left text-slate-300 border-collapse">
                <thead className="bg-[#101626] text-[11px] font-mono uppercase text-slate-400 border-b border-zinc-800">
                  <tr>
                    <th className="p-3 border-r border-zinc-800">DAY/TIMING</th>
                    <th className="p-3 border-r border-zinc-800">9.00-10.00</th>
                    <th className="p-3 border-r border-zinc-800">10.00-11.00</th>
                    <th className="p-3 border-r border-zinc-800 text-center bg-amber-950/30 text-amber-300">
                      11.00-11.15
                    </th>
                    <th className="p-3 border-r border-zinc-800 text-center bg-orange-950/30 text-orange-300">
                      11.15-12.15
                    </th>
                    <th className="p-3 border-r border-zinc-800">12.15-1.15</th>
                    <th className="p-3 border-r border-zinc-800">1.15-2.15</th>
                    <th className="p-3">2.15-3.15</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 font-mono text-[11px]">
                  {SECTION_C2_TIMETABLE.map((dayRow) => (
                    <tr key={dayRow.day} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="p-3 font-bold text-white border-r border-zinc-800 bg-[#0C1220]">
                        {dayRow.day}
                      </td>
                      <td className="p-3 border-r border-zinc-800 font-semibold text-cyan-300">
                        {dayRow.periods.find((p) => p.timeSlot === "9.00-10.00")?.courseCode}
                      </td>
                      <td className="p-3 border-r border-zinc-800 font-semibold text-indigo-300">
                        {dayRow.periods.find((p) => p.timeSlot === "10.00-11.00")?.courseCode}
                      </td>
                      <td className="p-3 border-r border-zinc-800 text-center text-amber-400 font-bold bg-amber-950/20">
                        BREAK
                      </td>
                      <td className="p-3 border-r border-zinc-800 text-center text-orange-400 font-bold bg-orange-950/20">
                        LUNCH
                      </td>
                      <td className="p-3 border-r border-zinc-800 font-semibold text-emerald-300">
                        {dayRow.periods.find((p) => p.timeSlot === "12.15-1.15")?.courseCode}
                      </td>
                      <td className="p-3 border-r border-zinc-800 font-semibold text-purple-300">
                        {dayRow.day === "THURSDAY"
                          ? "S13BLH21 (Extended Lab)"
                          : dayRow.periods.find((p) => p.timeSlot === "1.15-2.15")?.courseCode}
                      </td>
                      <td className="p-3 font-semibold text-pink-300">
                        {dayRow.day === "THURSDAY"
                          ? "S13BLH21"
                          : dayRow.periods.find((p) => p.timeSlot === "2.15-3.15")?.courseCode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Official Course Catalog & Faculty In-Charge */}
          <div className="pt-4 border-t border-zinc-800 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Curriculum Courses & Faculty Coordination (Odd Semester 2026-2027)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.values(SECTION_C2_COURSES).map((course, idx) => (
                <div
                  key={course.code}
                  className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-400">
                      {idx + 1}. {course.code}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-slate-300">
                      {course.credits} Credits
                    </span>
                  </div>
                  <p className="font-semibold text-white">{course.name}</p>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-zinc-800 flex items-center justify-between">
                    <span>Staff: <strong className="text-slate-200">{course.handlingStaff}</strong></span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Coordinator: {course.courseCoordinator} • Venue: {course.roomOrLab}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
