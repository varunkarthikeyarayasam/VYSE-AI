import React from "react";
import { Bell, CheckCircle2, AlertTriangle, FileText, X, ShieldCheck } from "lucide-react";
import { useOdApprovalStore, StudentNotification } from "@/store/odApprovalStore";
import { useAuth } from "@/store/authContext";

interface StudentNotificationBannerProps {
  onOpenLetter: (type: "od" | "leave") => void;
  onOpenAllNotifications?: () => void;
}

export function StudentNotificationBanner({
  onOpenLetter,
  onOpenAllNotifications,
}: StudentNotificationBannerProps) {
  const { student, profile, user, role } = useAuth();
  const { getStudentNotifications, dismissNotification, markNotificationAsRead } = useOdApprovalStore();

  // Only render for students
  if (role === "faculty" || role === "admin") return null;

  const studentName = student?.name || profile?.full_name || (user?.email ? user.email.split("@")[0] : "Arjun Kumar");
  const studentNotifs = getStudentNotifications(studentName);

  if (studentNotifs.length === 0) return null;

  // Show the latest notification
  const latest = studentNotifs[0];
  const isApproved = latest.type === "approved";

  return (
    <div
      className={`mx-4 my-2 p-3.5 sm:p-4 rounded-md border border-hairline bg-[var(--bg-surface)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 border-l-4 ${
        isApproved ? "border-l-[#7A8C7A]" : "border-l-[#B5675C]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 border border-hairline bg-[var(--bg-surface-2)]">
          {isApproved ? (
            <ShieldCheck className="w-4 h-4 text-[#7A8C7A]" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-[#B5675C]" />
          )}
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-xs uppercase tracking-wider text-[var(--text-primary)]">
              {latest.title}
            </span>
            <span
              className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full border border-hairline ${
                isApproved
                  ? "bg-[var(--bg-surface-2)] text-[#7A8C7A]"
                  : "bg-[var(--bg-surface-2)] text-[#B5675C]"
              }`}
            >
              {latest.statusText}
            </span>
            <span className="text-[10px] text-[var(--text-tertiary)] font-mono hidden sm:inline">
              {latest.timestamp}
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-xl">
            {latest.message}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {isApproved && (
          <button
            type="button"
            onClick={() => {
              markNotificationAsRead(latest.id);
              onOpenLetter(latest.letterType || "od");
            }}
            className="cta-pill-solid px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Approved Letter</span>
          </button>
        )}

        {onOpenAllNotifications && (
          <button
            type="button"
            onClick={onOpenAllNotifications}
            className="px-2.5 py-1.5 rounded-md bg-[var(--bg-surface-2)] hover:border-hairline-strong text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono transition-colors cursor-pointer border border-hairline flex items-center gap-1"
            title="View all notifications"
          >
            <Bell className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <span>All ({studentNotifs.length})</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => dismissNotification(latest.id)}
          className="p-1.5 rounded-md bg-[var(--bg-surface-2)] hover:border-hairline-strong text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer border border-hairline"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
