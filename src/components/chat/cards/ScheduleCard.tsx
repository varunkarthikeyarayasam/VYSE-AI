import React from "react";
import { Calendar, Clock, MapPin, User, CheckCircle2 } from "lucide-react";

export interface ScheduleItem {
  time: string;
  courseCode: string;
  courseName: string;
  room: string;
  faculty: string;
}

export function ScheduleCard({
  title = "YOUR DAY — TOMORROW",
  items,
}: {
  title?: string;
  items: ScheduleItem[];
}) {
  return (
    <div className="rounded-lg border border-hairline bg-[var(--bg-surface)] p-5 space-y-4 max-w-xl text-[var(--text-primary)] my-2">
      <div className="flex items-center justify-between pb-3 border-b border-hairline">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          <h4 className="font-mono font-semibold text-[11px] tracking-[0.14em] text-[var(--text-tertiary)] uppercase">
            {title}
          </h4>
        </div>
        <span className="text-[10px] font-mono tracking-wider text-[var(--text-secondary)] bg-[var(--bg-surface-2)] border border-hairline px-2.5 py-0.5 rounded-full">
          {items.length} sessions scheduled
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-md bg-[var(--bg-surface-2)] border border-hairline hover:border-hairline-strong transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-medium text-[var(--text-primary)] bg-[var(--bg-base)] px-2 py-0.5 rounded border border-hairline">
                  {item.time}
                </span>
                <span className="text-[11px] font-mono text-[var(--text-tertiary)] font-medium">
                  {item.courseCode}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[var(--text-secondary)] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[var(--text-tertiary)]" />
                {item.room}
              </span>
            </div>

            <h5 className="font-medium text-xs text-[var(--text-primary)]">
              {item.courseName}
            </h5>

            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] pt-1 border-t border-hairline">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-[var(--text-tertiary)]" />
                {item.faculty}
              </span>
              <span className="text-[10px] text-[#7A8C7A] font-mono">Confirmed</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 flex items-center justify-between text-[11px] text-[var(--text-tertiary)] border-t border-hairline">
        <span>Institutional Timetable Sync</span>
        <span className="font-mono tracking-wider">Fall 2026</span>
      </div>
    </div>
  );
}