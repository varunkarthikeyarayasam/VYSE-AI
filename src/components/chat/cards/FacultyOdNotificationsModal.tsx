import React, { useState } from "react";
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  UserCheck,
  FileCheck,
  Check,
  AlertCircle,
  Calendar,
  Filter,
} from "lucide-react";
import { useOdApprovalStore, StudentOdRequest } from "@/store/odApprovalStore";
import { useAuth } from "@/store/authContext";

interface FacultyOdNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FacultyOdNotificationsModal({
  isOpen,
  onClose,
}: FacultyOdNotificationsModalProps) {
  const { profile, role } = useAuth();
  const { requests, pendingCount, approveRequest, rejectRequest, resetRequest } =
    useOdApprovalStore();

  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const facultyName = profile?.full_name || "Prof. Venkatesh (HOD / Faculty Advisor)";

  const filteredRequests = requests.filter((req) => {
    if (filter === "pending") return req.status === "pending";
    if (filter === "approved") return req.status === "approved";
    return true;
  });

  const handleApprove = (req: StudentOdRequest) => {
    if (req.attendancePercent <= 75.0) {
      const confirmLow = window.confirm(
        `Warning: ${req.studentName}'s attendance is ${req.attendancePercent}%, which is below the mandatory 75% requirement. Grant special HOD exemption?`
      );
      if (!confirmLow) return;
    }

    approveRequest(req.id, facultyName);
    setToastMessage(`✓ ${req.type.toUpperCase()} Approved for ${req.studentName}. Official status updated.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReject = (req: StudentOdRequest) => {
    rejectRequest(req.id, "Rejected by faculty advisor / HOD review");
    setToastMessage(`✕ ${req.type.toUpperCase()} Request for ${req.studentName} marked as Rejected.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[var(--bg-surface)] border border-hairline-strong rounded-lg p-5 sm:p-6 text-[var(--text-primary)] space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-hairline shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-md bg-[var(--bg-surface-2)] border border-hairline flex items-center justify-center text-[var(--text-secondary)]">
              <Bell className="w-4 h-4 text-[var(--text-primary)]" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--cta-solid)] text-[var(--cta-solid-text)] font-mono text-[10px] font-bold flex items-center justify-center ring-2 ring-[var(--bg-surface)]">
                  {pendingCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-mono font-semibold tracking-wider uppercase text-[var(--text-primary)]">
                  OD & Leave Request Notifications
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border border-hairline">
                  Faculty / Admin Portal
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Logged in as: <span className="text-[var(--text-primary)] font-medium">{facultyName}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Toast Banner */}
        {toastMessage && (
          <div className="p-3 rounded-md bg-[var(--bg-surface-2)] border border-[#7A8C7A]/40 text-[#7A8C7A] text-xs font-medium flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-[#7A8C7A] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Info & Rule Summary Banner */}
        <div className="p-3.5 rounded-md bg-[var(--bg-base)] border border-hairline flex items-start gap-3 text-xs shrink-0">
          <ShieldCheck className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-[var(--text-primary)] font-mono">
              Institutional OD Issuance Rule: Attendance &gt; 75.0% Required
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              When approved here, the student's status changes to <strong>"OD Approved"</strong> and the official paper letter receives the digital institutional seal. Letters cannot be generated directly from faculty accounts.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 bg-[var(--bg-base)] p-1 rounded-md border border-hairline">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                filter === "all" ? "bg-[var(--cta-solid)] text-[var(--cta-solid-text)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              All ({requests.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                filter === "pending" ? "bg-[var(--cta-solid)] text-[var(--cta-solid-text)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("approved")}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                filter === "approved" ? "bg-[var(--cta-solid)] text-[var(--cta-solid-text)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Approved ({requests.filter((r) => r.status === "approved").length})
            </button>
          </div>

          <span className="text-[11px] font-mono text-[var(--text-tertiary)] hidden sm:inline">
            Active Semester: 6 (2025-26)
          </span>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-10 text-[var(--text-secondary)] text-xs">
              No notifications matching this filter.
            </div>
          ) : (
            filteredRequests.map((req) => {
              const isQualified = req.attendancePercent > 75.0;
              const isApproved = req.status === "approved";
              const isRejected = req.status === "rejected";

              return (
                <div
                  key={req.id}
                  className="p-4 rounded-md border border-hairline bg-[var(--bg-surface-2)] transition-all space-y-3"
                >
                  {/* Top Row: Student details & status badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--text-primary)] text-sm">{req.studentName}</span>
                        <span className="text-xs font-mono text-[var(--text-tertiary)]">
                          ({req.rollNumber} • {req.section})
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-[var(--bg-base)] text-[var(--text-secondary)] border border-hairline">
                          {req.type.toUpperCase()} Request
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] font-medium">{req.title}</p>
                      <p className="text-[11px] text-[var(--text-tertiary)] font-mono">Date(s): {req.dates}</p>
                    </div>

                    {/* Status Pill */}
                    <div className="shrink-0">
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium uppercase tracking-wider bg-[var(--bg-base)] text-[#7A8C7A] border border-[#7A8C7A]/40">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#7A8C7A]" />
                          <span>OD Approved</span>
                        </span>
                      ) : isRejected ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium uppercase tracking-wider bg-[var(--bg-base)] text-[#B5675C] border border-[#B5675C]/40">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#B5675C]" />
                          <span>Rejected</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium uppercase tracking-wider bg-[var(--bg-base)] text-[#C29B38] border border-[#C29B38]/30">
                          <Clock className="w-3.5 h-3.5 text-[#C29B38]" />
                          <span>Pending Review</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle: Attendance Rule Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-hairline text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-tertiary)]">Attendance:</span>
                      <span
                        className={`font-mono font-semibold ${
                          isQualified ? "text-[#7A8C7A]" : "text-[#B5675C]"
                        }`}
                      >
                        {req.attendancePercent}%
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isQualified
                            ? "bg-[var(--bg-base)] text-[#7A8C7A] border-[#7A8C7A]/30"
                            : "bg-[var(--bg-base)] text-[#B5675C] border-[#B5675C]/30"
                        }`}
                      >
                        {isQualified ? "Rule Met (> 75%)" : "Rule Violation (≤ 75%)"}
                      </span>
                    </div>

                    {req.approvedBy && (
                      <span className="text-[11px] text-[var(--text-tertiary)] font-mono">
                        Sign-off by: <strong className="text-[var(--text-secondary)] font-medium">{req.approvedBy}</strong>
                      </span>
                    )}
                  </div>

                  {/* Actions for Faculty */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    {isApproved ? (
                      <button
                        type="button"
                        onClick={() => resetRequest(req.id)}
                        className="px-3 py-1.5 rounded-md bg-[var(--bg-base)] hover:border-hairline-strong border border-hairline text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono transition-colors cursor-pointer"
                      >
                        Revoke Sign-off
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleReject(req)}
                          className="px-3 py-1.5 rounded-md bg-[var(--bg-base)] hover:border-hairline-strong text-[var(--text-secondary)] hover:text-[#B5675C] border border-hairline text-xs font-medium transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(req)}
                          className="cta-pill-solid px-4 py-1.5 text-xs font-medium font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve {req.type.toUpperCase()}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-hairline flex items-center justify-between text-[11px] font-mono text-[var(--text-tertiary)] shrink-0">
          <span>Sathyabama Academic OD Portal</span>
          <span>Department of Computer Science and Engineering</span>
        </div>
      </div>
    </div>
  );
}
