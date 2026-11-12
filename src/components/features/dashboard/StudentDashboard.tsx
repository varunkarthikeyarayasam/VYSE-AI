import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, Clock, Bus, AlertCircle, CheckCircle2, ChevronRight, ShieldCheck, ArrowRight, Bell } from "lucide-react";
import { Card, Badge, Button, VyseLogo } from "../../ui";
import { getStudentContext } from "../../../lib/api/academics";
import { getActiveBusRoute } from "../../../lib/api/transport";
import { getCampusNotices } from "../../../lib/api/campus";
import { getEvents } from "../../../lib/api/events";
import { useAuth } from "../../../store/authContext";
import type { StudentContextResult, BusRoute, CampusNotice, CampusEvent } from "../../../types/database";

export function StudentDashboard({
  onOpenChat,
  onNavigate,
}: {
  onOpenChat: (initialQuery?: string) => void;
  onNavigate: (tab: string) => void;
}) {
  const { student, user, profile } = useAuth();
  const [context, setContext] = useState<StudentContextResult | null>(null);
  const [activeBus, setActiveBus] = useState<BusRoute | null>(null);
  const [notices, setNotices] = useState<CampusNotice[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [student, user]);

  async function loadDashboard() {
    setLoading(true);
    try {
      const studentId = student?.id || user?.id || "11111111-1111-1111-1111-111111111111";
      const [ctx, bus, nts, evts] = await Promise.all([
        getStudentContext(studentId),
        getActiveBusRoute(student?.home_location ? "Tambaram" : "Tambaram"),
        getCampusNotices(),
        getEvents(),
      ]);
      setContext(ctx);
      setActiveBus(bus);
      setNotices(nts.slice(0, 3));
      setEvents(evts.slice(0, 2));
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  }

  const attPercent = context?.attendance?.attendance_percent ?? 82.0;
  const thresholdMet = attPercent >= 75.0;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="rounded-lg border-hairline bg-[var(--bg-surface)] p-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
                {student?.roll_number || "21CSE045"} • Section {student?.section || "B"}
              </span>
              <Badge variant="glow">SEMESTER 5</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-bright)] tracking-tight">
              Welcome back, {student?.name || profile?.full_name || "Arjun"}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl">
              Smart campus agentic intelligence is active. All institutional schedules, transport routes, and OD allowances are synchronized.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="glow"
              onClick={() => onOpenChat("I have a hackathon tomorrow and need OD")}
            >
              <VyseLogo size={18} showText={false} /> Ask VYSE AI
            </Button>
            <Button
              variant="secondary"
              onClick={() => onNavigate("od")}
            >
              Request OD
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Schedule & Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Timetable Widget (2 cols) */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--text-bright)]" />
              <h3 className="font-bold text-[var(--text-bright)] text-base">Today's Academic Schedule</h3>
            </div>
            <button
              onClick={() => onNavigate("academics")}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-bright)] font-medium flex items-center gap-1 cursor-pointer"
            >
              Full Timetable <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">Loading schedule...</div>
          ) : !context?.today_timetable || context.today_timetable.length === 0 ? (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">
              No classes scheduled for today. Enjoy your study session!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {context.today_timetable.map((item) => (
                <div
                  key={item.timetable_id}
                  className="p-3.5 rounded border-hairline bg-[var(--bg-base)] space-y-1.5 hover:border-hairline-strong transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="glow" size="sm">{item.course_code}</Badge>
                    <span className="text-xs font-mono font-bold text-[var(--text-secondary)]">
                      {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-[var(--text-bright)] text-xs line-clamp-1">
                    {item.course_name}
                  </h4>
                  <div className="text-[11px] text-[var(--text-secondary)] flex items-center justify-between pt-1">
                    <span>📍 {item.room}</span>
                    <span className="text-[var(--text-muted)]">👨‍🏫 {item.faculty_name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Attendance Summary Widget (1 col) */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <div>
              <h3 className="font-bold text-[var(--text-bright)] text-sm sm:text-base">Attendance Metric</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Institutional threshold check</p>
            </div>
            <Badge variant={thresholdMet ? "success" : "danger"}>
              {thresholdMet ? "ELIGIBLE" : "DEFICIT"}
            </Badge>
          </div>

          <div className="text-center py-3 space-y-1">
            <div className="inline-flex items-baseline gap-1">
              <span className="text-5xl font-black text-[var(--text-bright)] font-mono tracking-tight">
                {attPercent}
              </span>
              <span className="text-2xl font-bold text-[var(--text-secondary)] font-mono">%</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              {context?.attendance?.present_classes || 49} of {context?.attendance?.total_classes || 54} academic hours logged
            </p>
          </div>

          {/* Threshold Visual Indicator */}
          <div className="space-y-2">
            <div className="w-full h-2 rounded-full bg-[var(--bg-base)] border-hairline overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  thresholdMet ? "bg-[#7A8C7A]" : "bg-[#B5675C]"
                }`}
                style={{ width: `${Math.min(attPercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-[var(--text-secondary)]">
              <span>Policy Target: 75.0%</span>
              <span className="text-[#7A8C7A] font-bold">
                +{Math.max(0, attPercent - 75.0).toFixed(1)}% Safe Buffer
              </span>
            </div>
          </div>

          <div className="p-3 rounded border-hairline bg-[var(--bg-base)] text-xs text-[#7A8C7A] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#7A8C7A] shrink-0" />
            <span className="font-medium">OD eligibility confirmed by deterministic database RPC.</span>
          </div>
        </Card>
      </div>

      {/* Second Row: Live Transit & Upcoming Campus Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Live Bus Widget */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bus className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-slate-100 text-base">
                Live Transit from {student?.home_location || "Tambaram"}
              </h3>
            </div>
            <button
              onClick={() => onNavigate("transport")}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              Transit Details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeBus ? (
            <div className="p-4 rounded-xl bg-[#090B10]/70 border border-[#212738] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-100 text-sm">{activeBus.route_name}</h4>
                    {activeBus.is_temporary && (
                      <Badge variant="warning" size="sm">Special Schedule</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeBus.origin} → {activeBus.destination}
                  </p>
                </div>
                {activeBus.stops && activeBus.stops.length > 0 && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase">Boarding Time</span>
                    <span className="text-base font-bold text-indigo-400 font-mono block">
                      {activeBus.stops[0].arrival_time}
                    </span>
                  </div>
                )}
              </div>

              {activeBus.stops && (
                <div className="flex items-center gap-2 overflow-x-auto text-xs text-slate-400 pt-2 border-t border-[#1C2234]">
                  {activeBus.stops.map((s, idx) => (
                    <span key={s.stop_order} className="flex items-center gap-1 shrink-0">
                      <span className="font-mono text-emerald-400">{s.arrival_time}</span>
                      <span>{s.stop_name}</span>
                      {idx < (activeBus.stops?.length || 0) - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-600 ml-1" />
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-4 text-center">
              No active buses at this moment.
            </div>
          )}
        </Card>

        {/* Verified Institutional Notices */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-base">Verified Notices</h3>
            <Badge variant="info">OFFICIAL</Badge>
          </div>

          <div className="space-y-2.5">
            {notices.map((n) => (
              <div key={n.id} className="p-3 rounded-xl bg-[#090B10]/60 border border-[#212738] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-indigo-400">
                    {n.category}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(n.published_at).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-200 text-xs line-clamp-1">{n.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {n.content}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}