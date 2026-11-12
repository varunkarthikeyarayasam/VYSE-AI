import React from "react";
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  ShieldCheck,
  Clock,
  Trash2,
} from "lucide-react";
import { useOdApprovalStore, StudentNotification } from "@/store/odApprovalStore";
import { useAuth } from "@/store/authContext";

interface StudentNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLetter: (type: "od" | "leave") => void;
}

export function StudentNotificationsModal({
  isOpen,
  onClose,
  onOpenLetter,
}: StudentNotificationsModalProps) {
  const { student, profile, user } = useAuth();
  const {
    getStudentNotifications,
    markNotificationAsRead,
    dismissNotification,
    clearAllNotifications,
  } = useOdApprovalStore();

  if (!isOpen) return null;

  const studentQuery =
    student?.name || profile?.full_name || user?.email?.split("@")[0] || "Arjun";
  const notifs = getStudentNotifications(studentQuery);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-hairline-strong rounded-lg p-5 sm:p-6 text-[var(--text-primary)] space-y-5 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-hairline shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[var(--bg-surface-2)] border border-hairline flex items-center justify-center text-[var(--text-secondary)]">
              <Bell className="w-4 h-4 text-[var(--text-primary)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-mono font-semibold tracking-wider uppercase text-[var(--text-primary)]">
                  Student Notifications
                </h3>
                {notifs.filter((n) => !n.read).length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-hairline-strong">
                    {notifs.filter((n) => !n.read).length} New
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Live OD & Leave approval updates from faculty and HOD
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

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {notifs.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Bell className="w-7 h-7 text-[var(--text-tertiary)] mx-auto opacity-40" />
              <p className="text-xs text-[var(--text-secondary)]">No notifications at this time.</p>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                You will be notified here whenever faculty reviews your OD or Leave requests.
              </p>
            </div>
          ) : (
            notifs.map((notif) => {
              const isApproved = notif.type === "approved";

              return (
                <div
                  key={notif.id}
                  className="p-4 rounded-md border border-hairline bg-[var(--bg-surface-2)] transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 border border-hairline bg-[var(--bg-base)]">
                        {isApproved ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-[#7A8C7A]" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#B5675C]" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold font-mono text-[var(--text-primary)]">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                          {notif.timestamp}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full border border-hairline ${
                        isApproved
                          ? "bg-[var(--bg-base)] text-[#7A8C7A]"
                          : "bg-[var(--bg-base)] text-[#B5675C]"
                      }`}
                    >
                      {notif.statusText}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-9">
                    {notif.message}
                  </p>

                  <div className="pt-2 pl-9 flex items-center justify-between border-t border-hairline">
                    <button
                      type="button"
                      onClick={() => dismissNotification(notif.id)}
                      className="text-[11px] font-mono text-[var(--text-tertiary)] hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Dismiss</span>
                    </button>

                    {isApproved && (
                      <button
                        type="button"
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          onClose();
                          onOpenLetter(notif.letterType || "od");
                        }}
                        className="cta-pill-solid px-3.5 py-1 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Approved Letter</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifs.length > 0 && (
          <div className="pt-3 border-t border-hairline flex items-center justify-between text-[11px] font-mono text-[var(--text-tertiary)] shrink-0">
            <span>Sathyabama University Notification Desk</span>
            <button
              type="button"
              onClick={() => clearAllNotifications(studentQuery)}
              className="text-[var(--text-tertiary)] hover:text-[#B5675C] transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
