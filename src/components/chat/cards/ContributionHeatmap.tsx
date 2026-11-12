import React, { useMemo, useState } from "react";
import {
  HeatmapCells,
  HeatmapChart,
  HeatmapInteractionBoundary,
  HeatmapInteractionProvider,
  HeatmapLegend,
  HeatmapTooltip,
  HeatmapXAxis,
  HeatmapYAxis,
  HeatmapWeekColumn,
  HeatmapDayBin,
} from "@bklitui/ui/charts";
import { Calendar, Sparkles, Trophy, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Generate 16 weeks of Sathyabama Odd Semester 2026 data
 * Covers August 2, 2026 through November 21, 2026
 */
export function generateAcademicCalendarHeatmapData(isFaculty: boolean = false): HeatmapWeekColumn[] {
  const columns: HeatmapWeekColumn[] = [];
  // Start on Sunday, August 2, 2026
  const startDate = new Date(2026, 7, 2); // Month 7 = August (0-indexed)

  // 16 weeks in Odd Semester
  for (let weekIdx = 0; weekIdx < 16; weekIdx++) {
    const bins: HeatmapDayBin[] = [];

    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + weekIdx * 7 + dayIdx);

      const m = currentDate.getMonth(); // 7=Aug, 8=Sep, 9=Oct, 10=Nov
      const d = currentDate.getDate();
      const dayOfWeek = currentDate.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

      let count = 0;
      let status: "present" | "od" | "leave" | "holiday" | "weekend" = "present";
      let statusLabel = isFaculty ? "Instructional Duty Logged" : "Present & Attended";
      let title = "Regular Instructional Sessions";
      let details = isFaculty
        ? "4 Lecture Periods + 1 Lab Session (Block M)"
        : "Theory of Computation & Discrete Math Classes";
      let rfidPunch: string | undefined = "07:52 AM In • 03:30 PM Out";

      // Weekend logic
      if (dayOfWeek === 0) {
        count = 0;
        status = "weekend";
        statusLabel = "Sunday Recess";
        title = "Weekly Holiday";
        details = "Campus Closed • Self-Paced Study";
        rfidPunch = undefined;
      } else if (dayOfWeek === 6) {
        // Alternating Saturday lab / working days
        if (weekIdx % 2 === 1) {
          count = 4;
          status = "present";
          statusLabel = "Special Lab Session";
          title = "Technical Project & Hands-On Lab";
          details = "Computing Lab 4 • Practical Coding";
          rfidPunch = "08:45 AM In • 01:15 PM Out";
        } else {
          count = 0;
          status = "weekend";
          statusLabel = "Saturday Off";
          title = "Non-Instructional Saturday";
          details = "Study & Hackathon Preparation";
          rfidPunch = undefined;
        }
      } else {
        // Weekdays (Mon-Fri) - default 6-7 hours
        count = dayOfWeek === 2 || dayOfWeek === 4 ? 7 : 6;
      }

      // Specific Academic Calendar Milestones (Holidays, Fests, ODs)
      if (m === 7 && d === 15) {
        // Independence Day
        count = 0;
        status = "holiday";
        statusLabel = "National Holiday";
        title = "Independence Day";
        details = "Flag Hoisting Ceremony at Campus Ground";
        rfidPunch = "08:00 AM (Ceremonial)";
      } else if (m === 8 && d === 4) {
        // Krishna Jayanthi
        count = 0;
        status = "holiday";
        statusLabel = "Public Holiday";
        title = "Krishna Jayanthi";
        details = "University Declared Holiday";
        rfidPunch = undefined;
      } else if (m === 8 && (d === 11 || d === 12)) {
        // National Hackathon 2026 (Today is Sep 11!)
        count = 8;
        status = "od";
        statusLabel = "On-Duty (OD) Approved";
        title = d === 11 ? "Sathyabama National Hackathon (Day 1)" : "National Hackathon Pitch & Finals (Day 2)";
        details = "Auditorium Lab • Project Presentation & Coding Sprint";
        rfidPunch = "07:45 AM (Special Event Pass)";
      } else if (m === 8 && d === 18) {
        // Freshers Day "Aarambh '26"
        count = 7;
        status = "od";
        statusLabel = "Freshers Day Fest";
        title = "Aarambh '26 Freshers Celebration";
        details = "Main Auditorium • Cultural Performances & Welcoming Batch";
        rfidPunch = "08:15 AM In • 04:30 PM Out";
      } else if (m === 8 && (d === 24 || d === 25 || d === 26)) {
        // Vivacity 2026 Culturals
        count = 8;
        status = "od";
        statusLabel = "Mega Culturals (OD)";
        title = `Vivacity '26 Inter-Collegiate Fest (Day ${d - 23})`;
        details = "Open Air Theatre • Stage Events, Battle of Bands & Pro-Show";
        rfidPunch = "08:30 AM (Fest Registered Pass)";
      } else if (m === 9 && d === 2) {
        // Gandhi Jayanthi
        count = 0;
        status = "holiday";
        statusLabel = "National Holiday";
        title = "Gandhi Jayanthi";
        details = "National Holiday • Campus Closed";
        rfidPunch = undefined;
      } else if (m === 9 && (d === 19 || d === 20)) {
        // Ayutha Pooja / Vijaya Dasami
        count = 0;
        status = "holiday";
        statusLabel = "Festival Holiday";
        title = d === 19 ? "Ayudha Pooja" : "Vijaya Dasami";
        details = "Festive Recess";
        rfidPunch = undefined;
      } else if (m === 9 && d === 31) {
        // Deepavali
        count = 0;
        status = "holiday";
        statusLabel = "Deepavali Holiday";
        title = "Diwali Celebrations";
        details = "Campus Holiday";
        rfidPunch = undefined;
      }

      // Random casual absence for realism if not holiday/weekend
      if (weekIdx === 2 && dayOfWeek === 3) {
        // 1 Approved Sick Leave
        count = 0;
        status = "leave";
        statusLabel = "Approved Medical Leave";
        title = "Medical Leave (Certificate Submitted)";
        details = "Verified by Head of Department";
        rfidPunch = undefined;
      }

      bins.push({
        bin: dayIdx,
        count,
        date: currentDate,
        status,
        label: title,
        metadata: {
          status,
          statusLabel,
          title,
          details,
          rfidPunch,
          hours: count,
        },
      });
    }

    columns.push({
      bin: weekIdx,
      bins,
    });
  }

  return columns;
}

// User-provided interface compatibility wrapper
interface ContributionHeatmapProps {
  data?: HeatmapWeekColumn[];
  isFaculty?: boolean;
  onSelectDate?: (date: Date, bin: HeatmapDayBin) => void;
  className?: string;
  showCardWrapper?: boolean;
}

export function ContributionHeatmap({
  data: customData,
  isFaculty = false,
  onSelectDate,
  className,
  showCardWrapper = true,
}: ContributionHeatmapProps) {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "aug" | "sep" | "oct" | "nov">("all");

  const fullData = useMemo(() => {
    return customData || generateAcademicCalendarHeatmapData(isFaculty);
  }, [customData, isFaculty]);

  // Filter weeks based on selected month tab if user wants a focused view
  const activeData = useMemo(() => {
    if (selectedFilter === "all") return fullData;
    const targetMonth =
      selectedFilter === "aug" ? 7 : selectedFilter === "sep" ? 8 : selectedFilter === "oct" ? 9 : 10;
    return fullData.filter((week) => {
      return week.bins.some((b) => b.date.getMonth() === targetMonth);
    });
  }, [fullData, selectedFilter]);

  const handleCellClick = (bin: HeatmapDayBin) => {
    onSelectDate?.(bin.date, bin);
  };

  const content = (
    <div className={cn("space-y-3 select-none", className)}>
      {/* Header controls & stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-slate-300 shadow-inner">
            <Calendar className="w-4 h-4 text-slate-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold font-mono tracking-wider text-slate-200 uppercase">
                Academic Engagement Heatwave
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                Monochrome
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Odd Semester 2026 • 16-Week Instructional & Activity Matrix
            </p>
          </div>
        </div>

        {/* Month Filter Switcher */}
        <div className="flex items-center gap-1 bg-[#111622] p-1 rounded-xl border border-white/5 self-start sm:self-auto">
          {[
            { key: "all", label: "All (16 Wks)" },
            { key: "aug", label: "Aug" },
            { key: "sep", label: "Sep (Now)" },
            { key: "oct", label: "Oct" },
            { key: "nov", label: "Nov" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedFilter(tab.key as any)}
              className={cn(
                "px-2.5 py-1 text-[10px] font-mono font-semibold rounded-lg transition-all cursor-pointer",
                selectedFilter === tab.key
                  ? "bg-slate-200 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Heatmap Chart Layout */}
      <HeatmapInteractionProvider>
        <HeatmapInteractionBoundary className="pt-1">
          <div className="flex items-start">
            {/* Weekday Y-Axis */}
            <HeatmapYAxis className="mt-5" />

            {/* Main Fluid Grid with X-Axis */}
            <div className="flex-1 min-w-0">
              <HeatmapXAxis />
              <HeatmapChart data={activeData} layout="fluid" onCellClick={handleCellClick}>
                <HeatmapCells />
                <HeatmapTooltip />
              </HeatmapChart>
            </div>
          </div>

          {/* Monochrome Legend Swatches & Summary */}
          <HeatmapLegend />
        </HeatmapInteractionBoundary>
      </HeatmapInteractionProvider>

      {/* Highlights & Key Milestones Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
        <div className="p-2.5 rounded-xl bg-[#111622] border border-white/5 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-400 block">Attendance Rate</span>
            <span className="font-bold text-white">95.6% Verified</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-[#111622] border border-white/5 flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-400 block">Approved ODs</span>
            <span className="font-bold text-white">4 National Events</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-[#111622] border border-white/5 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-400 block">Avg Daily Hours</span>
            <span className="font-bold text-white">6.8 hrs / Day</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-[#111622] border border-white/5 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-400 block">Today's Session</span>
            <span className="font-bold text-white">Sep 11 (Hackathon)</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!showCardWrapper) {
    return content;
  }

  return (
    <div className="p-5 rounded-lg bg-[var(--bg-surface)] border border-hairline">
      {content}
    </div>
  );
}

// Default export as requested in user prompt
export default ContributionHeatmap;
