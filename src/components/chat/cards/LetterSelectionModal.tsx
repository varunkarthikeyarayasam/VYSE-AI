import React from "react";
import {
  FileText,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Printer,
  Scale,
} from "lucide-react";
import { LetterType } from "./LetterModal";

import { useAuth } from "@/store/authContext";

interface LetterSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: LetterType) => void;
  attendancePercent?: number;
  studentName?: string;
}

export function LetterSelectionModal({
  isOpen,
  onClose,
  onSelectType,
  attendancePercent = 90.7,
  studentName = "Arjun Kumar",
}: LetterSelectionModalProps) {
  const { role } = useAuth();

  if (!isOpen) return null;

  // Only student can generate letters
  if (role === "faculty" || role === "admin") return null;

  const isEligible = attendancePercent > 75.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-hairline-strong rounded-lg p-6 text-[var(--text-primary)] space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-hairline">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[var(--bg-surface-2)] border border-hairline flex items-center justify-center text-[var(--text-secondary)]">
              <Scale className="w-4 h-4 text-[var(--text-primary)]" />
            </div>
            <div>
              <h3 className="text-sm font-mono font-semibold tracking-wider uppercase text-[var(--text-primary)]">
                OD & Leave Eligibility
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Official institutional format generator & attendance validation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Priority Rule Callout Banner */}
        <div className="p-3.5 rounded-md border border-hairline bg-[var(--bg-base)] flex items-start gap-3 text-xs">
          {isEligible ? (
            <CheckCircle2 className="w-4 h-4 text-[#7A8C7A] shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#B5675C] shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <div className="font-medium flex items-center gap-2 font-mono">
              <span>Main Rule Priority: Attendance &gt; 75.0% Mandatory</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border border-hairline ${
                  isEligible
                    ? "bg-[var(--bg-surface-2)] text-[#7A8C7A]"
                    : "bg-[var(--bg-surface-2)] text-[#B5675C]"
                }`}
              >
                Current: {attendancePercent}%
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              {isEligible
                ? `You meet the attendance requirement. Letters can be generated and submitted for formal Admin & HOD approval.`
                : `Your attendance is below the 75% rule requirement. OD and formal leave letters require HOD special waiver consideration.`}
            </p>
          </div>
        </div>

        {/* THE TWO BUTTONS POP UP */}
        <div className="space-y-3">
          <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--text-tertiary)] font-semibold">
            Select Letter Format to Generate:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Button 1: OD Letter Format */}
            <button
              type="button"
              onClick={() => {
                onSelectType("od");
                onClose();
              }}
              className="group relative p-4 rounded-md bg-[var(--bg-surface-2)] hover:border-hairline-strong border border-hairline text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-md bg-[var(--bg-base)] border border-hairline flex items-center justify-center text-[var(--text-secondary)]">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[var(--bg-base)] text-[var(--text-secondary)] border border-hairline">
                  Priority
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] transition-colors flex items-center gap-1">
                  <span>OD Letter Format</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[var(--text-secondary)]" />
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-snug">
                  On-Duty attendance exemption for hackathons, competitions, or paper presentations.
                </p>
              </div>

              <div className="pt-2 border-t border-hairline flex items-center justify-between text-[10px] font-mono text-[var(--text-tertiary)]">
                <span>With HOD Sign-off</span>
                <span className="text-[#7A8C7A]">Print Ready</span>
              </div>
            </button>

            {/* Button 2: Leave Letter Format */}
            <button
              type="button"
              onClick={() => {
                onSelectType("leave");
                onClose();
              }}
              className="group relative p-4 rounded-md bg-[var(--bg-surface-2)] hover:border-hairline-strong border border-hairline text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-md bg-[var(--bg-base)] border border-hairline flex items-center justify-center text-[var(--text-secondary)]">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[var(--bg-base)] text-[var(--text-secondary)] border border-hairline">
                  Standard
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] transition-colors flex items-center gap-1">
                  <span>Leave Letter Format</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[var(--text-secondary)]" />
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-snug">
                  Formal leave of absence application for medical, emergency, or personal reasons.
                </p>
              </div>

              <div className="pt-2 border-t border-hairline flex items-center justify-between text-[10px] font-mono text-[var(--text-tertiary)]">
                <span>Academic Undertaking</span>
                <span className="text-[#7A8C7A]">Print Ready</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-hairline flex items-center justify-between text-[11px] font-mono text-[var(--text-tertiary)]">
          <span>Official University Letter Format (PDF Ready)</span>
          <span>Includes Bklit UI Charts</span>
        </div>
      </div>
    </div>
  );
}
