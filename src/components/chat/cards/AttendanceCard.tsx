import React from "react";
import { CheckCircle2, ShieldCheck, TrendingUp, BookOpen, AlertTriangle } from "lucide-react";

export interface AttendanceSubject {
  code: string;
  name: string;
  attended: number;
  total: number;
  percentage: number;
}

export interface AttendanceCardData {
  overallPercentage: number;
  thresholdPercentage: number;
  totalAttended: number;
  totalClasses: number;
  subjects: AttendanceSubject[];
  canBunkCount?: number;
}

export function AttendanceCard({ data }: { data: AttendanceCardData }) {
  const isSafe = data.overallPercentage >= data.thresholdPercentage;
  const buffer = Math.round((data.overallPercentage - data.thresholdPercentage) * 10) / 10;

  return (
    <div className="rounded-lg border border-hairline bg-[var(--bg-surface)] p-5 space-y-4 max-w-xl text-[var(--text-primary)] my-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-hairline">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-[0.14em] text-[var(--text-tertiary)] uppercase">
          <TrendingUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          <span>ATTENDANCE INTELLIGENCE</span>
        </div>
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-hairline ${
            isSafe
              ? "bg-[var(--bg-surface-2)] text-[#7A8C7A]"
              : "bg-[var(--bg-surface-2)] text-[#B5675C]"
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          {isSafe ? "In Safe Zone" : "Debarment Risk"}
        </span>
      </div>

      {/* Main Metric Hero */}
      <div className="bg-[var(--bg-surface-2)] p-4 rounded-md border border-hairline flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block mb-1">
            Overall Verified Attendance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono tracking-tight text-[var(--text-primary)]">
              {data.overallPercentage}%
            </span>
            <span className="text-xs font-mono text-[var(--text-tertiary)]">
              ({data.totalAttended} / {data.totalClasses} classes)
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block mb-1">
            Safety Margin
          </span>
          <span className="inline-block px-2.5 py-1 rounded-md bg-[var(--bg-base)] border border-hairline text-[var(--text-secondary)] font-mono font-medium text-xs">
            +{buffer}% Buffer
          </span>
        </div>
      </div>

      {/* Policy Verification Callout */}
      <div className="p-3 rounded-md bg-[var(--bg-base)] border border-hairline flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-medium">
          <ShieldCheck className="w-4 h-4 text-[#7A8C7A] shrink-0" />
          <span>Requirement: 75.0% Required Attendance Met</span>
        </div>
        <span className="text-[10px] font-mono text-[#7A8C7A] bg-[var(--bg-surface-2)] px-2 py-0.5 rounded border border-hairline">
          OD ELIGIBLE
        </span>
      </div>

      {/* Subject-Wise Breakdown */}
      <div className="space-y-2.5">
        <div className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-[0.14em] flex items-center gap-1.5">
          <BookOpen className="w-3 h-3 text-[var(--text-tertiary)]" />
          <span>Course Breakdown</span>
        </div>

        <div className="space-y-2">
          {data.subjects.map((sub, idx) => (
            <div key={idx} className="bg-[var(--bg-surface-2)] p-2.5 rounded-md border border-hairline space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-[var(--text-primary)] text-[11px] bg-[var(--bg-base)] px-1.5 py-0.5 rounded border border-hairline">
                    {sub.code}
                  </span>
                  <span className="text-[var(--text-primary)] font-medium truncate max-w-[240px]">
                    {sub.name}
                  </span>
                </div>
                <div className="font-mono text-right shrink-0">
                  <span
                    className={`font-semibold ${
                      sub.percentage >= 85
                        ? "text-[#7A8C7A]"
                        : sub.percentage >= 75
                        ? "text-[var(--text-primary)]"
                        : "text-[#C29B38]"
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                  <span className="text-[10px] text-[var(--text-tertiary)] ml-1">
                    ({sub.attended}/{sub.total})
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[var(--bg-base)] h-1 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--cta-solid)] rounded-full transition-all"
                  style={{ width: `${Math.min(100, sub.percentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
