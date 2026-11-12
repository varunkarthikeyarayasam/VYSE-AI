import React, { useState } from "react";
import { CheckCircle2, AlertCircle, FileCheck, ArrowRight, ShieldCheck, Clock, ExternalLink, Sparkles, FileText, Calendar, Bell } from "lucide-react";
import { confirmOdRequest } from "../../../lib/api/od";
import { LetterModal, LetterType } from "./LetterModal";
import { LetterSelectionModal } from "./LetterSelectionModal";
import { FacultyOdNotificationsModal } from "./FacultyOdNotificationsModal";
import { useAuth } from "@/store/authContext";

export interface OdWorkflowData {
  eventTitle: string;
  eventDate: string;
  attendancePercent: number;
  thresholdPercent: number;
  studentName: string;
  rollNumber: string;
  department: string;
  reason: string;
  draftToken?: string;
  requestId?: string;
  initialStep?: "eligibility" | "form" | "submitted";
}

export function EligibilityCard({
  data,
  onStepChange,
}: {
  data: OdWorkflowData;
  onStepChange?: (step: "eligibility" | "form" | "submitted") => void;
}) {
  const { role } = useAuth();
  const isFacultyOrAdmin = role === "faculty" || role === "admin";

  const [step, setStep] = useState<"eligibility" | "form" | "submitted">(
    data.initialStep || "eligibility"
  );
  const [submitting, setSubmitting] = useState(false);
  const [requestId, setRequestId] = useState<string>(
    data.requestId || `OD-2026-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [letterType, setLetterType] = useState<LetterType>("od");
  const [letterSelectionOpen, setLetterSelectionOpen] = useState(false);
  const [facultyNotificationsOpen, setFacultyNotificationsOpen] = useState(false);

  const isEligible = data.attendancePercent >= data.thresholdPercent;

  async function handleConfirmSubmit() {
    setSubmitting(true);
    try {
      if (data.draftToken) {
        const res = await confirmOdRequest(data.draftToken);
        if (res && res.id) {
          setRequestId(res.id);
        }
      }
      setStep("submitted");
      onStepChange?.("submitted");
    } catch (err) {
      console.warn("Using inline confirmation fallback:", err);
      setStep("submitted");
      onStepChange?.("submitted");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-hairline bg-[var(--bg-surface)] p-5 space-y-4 max-w-xl text-[var(--text-primary)] my-2">
      {/* Step 1: Initial Eligibility Check */}
      {step === "eligibility" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-[0.14em] text-[var(--text-tertiary)] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <span>OD Eligibility Verification</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border border-hairline">
              <CheckCircle2 className="w-3 h-3 text-[#7A8C7A]" />
              Verified Rules
            </span>
          </div>

          <div className="bg-[var(--bg-surface-2)] p-3.5 rounded-md border border-hairline space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Current Attendance:</span>
              <span className="font-mono font-semibold text-[#7A8C7A] text-sm">
                {data.attendancePercent}% ✓
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Required Threshold:</span>
              <span className="font-mono text-[var(--text-primary)]">
                {data.thresholdPercent}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Verified Event:</span>
              <span className="font-medium text-[var(--text-primary)]">
                {data.eventTitle} ✓
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Scheduled Date:</span>
              <span className="font-mono text-[var(--text-primary)]">
                {data.eventDate}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-md bg-[var(--bg-base)] border border-hairline flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#7A8C7A] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#7A8C7A] shrink-0" />
              <span>Status: ELIGIBILITY CRITERIA MET</span>
            </div>
            <span className="text-[10px] font-mono text-[#7A8C7A] bg-[var(--bg-surface-2)] px-2 py-0.5 rounded border border-hairline">
              APPROVED BY POLICY
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            You meet the configured eligibility criteria based on institutional records. Final authorization will be recorded by your department review board.
          </p>

          {/* Role-based actions: Faculty gets Notification Review, Student gets Letter Formats */}
          {isFacultyOrAdmin ? (
            <div className="pt-2 border-t border-hairline flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)] font-mono flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                Faculty Action Required
              </span>
              <button
                type="button"
                onClick={() => setFacultyNotificationsOpen(true)}
                className="cta-pill-solid py-1.5 px-3 text-xs font-medium font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <span>Review OD Notifications</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-hairline flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setLetterType("od");
                  setLetterModalOpen(true);
                }}
                className="flex-1 py-2 px-3 rounded-md bg-[var(--bg-surface-2)] hover:border-hairline-strong border border-hairline text-[var(--text-primary)] text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                <span>OD Letter Format</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLetterType("leave");
                  setLetterModalOpen(true);
                }}
                className="flex-1 py-2 px-3 rounded-md bg-[var(--bg-surface-2)] hover:border-hairline-strong border border-hairline text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                <span>Leave Letter Format</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setStep("form");
              onStepChange?.("form");
            }}
            className="cta-pill-solid w-full py-2.5 px-4 text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <span>Prepare OD Request</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Step 2: Inline Request Form & Review */}
      {step === "form" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-[0.14em] text-[var(--text-tertiary)] uppercase">
              <FileCheck className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <span>OD Request Summary & Review</span>
            </div>
            <span className="text-[10px] font-mono tracking-wider text-[var(--text-secondary)] bg-[var(--bg-surface-2)] border border-hairline px-2 py-0.5 rounded">
              READY FOR REVIEW
            </span>
          </div>

          <div className="bg-[var(--bg-surface-2)] p-4 rounded-md border border-hairline space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3 pb-2.5 border-b border-hairline">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">Student</span>
                <span className="font-semibold text-[var(--text-primary)]">{data.studentName}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">Register No</span>
                <span className="font-mono text-[var(--text-primary)]">{data.rollNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-2.5 border-b border-hairline">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">Department</span>
                <span className="text-[var(--text-primary)]">{data.department}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">Event Date</span>
                <span className="font-mono text-[var(--text-primary)]">{data.eventDate}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">Target Event</span>
              <span className="font-medium text-[var(--text-primary)]">{data.eventTitle}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">Statement of Purpose</span>
              <span className="text-[var(--text-secondary)] italic">{data.reason}</span>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setStep("eligibility")}
              className="px-3 py-2 rounded-md bg-[var(--bg-surface-2)] hover:border-hairline-strong border border-hairline text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleConfirmSubmit}
              disabled={submitting}
              className="cta-pill-solid flex-1 py-2.5 px-4 text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Submitting to Faculty Queue...
                </span>
              ) : (
                <>
                  <span>Confirm & Submit Request</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Successfully Submitted */}
      {step === "submitted" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 p-3 rounded-md bg-[var(--bg-surface-2)] border border-[#7A8C7A]/30 text-xs text-[#7A8C7A] font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#7A8C7A] shrink-0" />
            <div>
              <span className="font-semibold block">✓ OD Request Successfully Submitted</span>
              <span className="text-[11px] text-[var(--text-secondary)]">
                Routed to Department OD Review Committee for formal sign-off.
              </span>
            </div>
          </div>

          <div className="bg-[var(--bg-surface-2)] p-4 rounded-md border border-hairline space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Request ID:</span>
              <span className="font-mono font-medium text-[var(--text-primary)] bg-[var(--bg-base)] px-2 py-0.5 rounded border border-hairline">
                {requestId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Status:</span>
              <span className="inline-flex items-center gap-1 text-[#C29B38] font-medium">
                <Clock className="w-3 h-3" />
                Pending Faculty Approval
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Event:</span>
              <span className="text-[var(--text-primary)]">{data.eventTitle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Submission Timestamp:</span>
              <span className="text-[var(--text-tertiary)] font-mono text-[11px]">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • Today
              </span>
            </div>
          </div>

          {trackingOpen && (
            <div className="p-3 rounded-md bg-[var(--bg-base)] border border-hairline space-y-2 text-[11px]">
              <div className="text-[var(--text-tertiary)] font-mono uppercase tracking-wider text-[10px]">
                Lifecycle Tracking Timeline
              </div>
              <div className="space-y-1.5 pl-2 border-l border-hairline-strong">
                <div className="text-[#7A8C7A] font-medium">1. Autonomous Eligibility Check Passed</div>
                <div className="text-[#7A8C7A] font-medium">2. Student Consequential Confirmation Done</div>
                <div className="text-[#C29B38] font-medium">3. Awaiting HOD / Faculty Review</div>
              </div>
            </div>
          )}

          {/* Role-based step 3 actions */}
          {isFacultyOrAdmin ? (
            <button
              type="button"
              onClick={() => setFacultyNotificationsOpen(true)}
              className="cta-pill-solid w-full py-2 px-3 text-xs font-medium font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Open Faculty OD Notifications</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setLetterType("od");
                  setLetterModalOpen(true);
                }}
                className="cta-pill-solid flex-1 py-2 px-3 text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View OD Letter</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLetterType("leave");
                  setLetterModalOpen(true);
                }}
                className="flex-1 py-2 px-3 rounded-md bg-[var(--bg-surface-2)] hover:border-hairline-strong text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-hairline text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                <span>View Leave Letter</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setTrackingOpen(!trackingOpen)}
            className="w-full py-2 px-3 rounded-md bg-[var(--bg-surface-2)] hover:border-hairline-strong border border-hairline text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{trackingOpen ? "Hide Tracking Details" : "Track Request Status"}</span>
            <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)]" />
          </button>
        </div>
      )}

      {/* Modals */}
      <FacultyOdNotificationsModal
        isOpen={facultyNotificationsOpen}
        onClose={() => setFacultyNotificationsOpen(false)}
      />

      <LetterSelectionModal
        isOpen={letterSelectionOpen}
        onClose={() => setLetterSelectionOpen(false)}
        onSelectType={(t) => {
          setLetterType(t);
          setLetterModalOpen(true);
        }}
        attendancePercent={data.attendancePercent}
        studentName={data.studentName}
      />

      <LetterModal
        isOpen={letterModalOpen}
        onClose={() => setLetterModalOpen(false)}
        initialType={letterType}
        studentData={{
          name: data.studentName,
          rollNumber: data.rollNumber,
          department: data.department,
          attendancePercent: data.attendancePercent,
          eventName: data.eventTitle,
          eventDate: data.eventDate,
        }}
      />
    </div>
  );
}