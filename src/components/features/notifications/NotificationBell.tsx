import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, ExternalLink } from "lucide-react";
import { getNotifications, markNotificationAsRead, subscribeToNotifications } from "../../../lib/api/notifications";
import { useAuth } from "../../../store/authContext";
import type { UserNotification } from "../../../types/database";

export function NotificationBell({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.id) return;

    loadNotifications();

    // Subscribe to selective Realtime channel for this specific user
    const channel = subscribeToNotifications(user.id, (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [user?.id]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function loadNotifications() {
    if (!user?.id) return;
    try {
      const data = await getNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      console.error("Error loading notifications:", err);
    }
  }

  async function handleMarkRead(id: string) {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Error marking read:", err);
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div ref={bellRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-hairline transition-colors cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--cta-solid)] text-[var(--cta-solid-text)] text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg bg-[var(--bg-surface)] border border-hairline-strong p-4 z-50 animate-fade-in space-y-3">
          <div className="flex items-center justify-between border-b border-hairline pb-2">
            <h4 className="font-semibold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono">Notifications</h4>
            <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
              {unreadCount} unread
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2">
            {notifications.length === 0 ? (
              <p className="text-center py-6 text-xs text-[var(--text-tertiary)]">
                No notifications yet.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-md border text-xs space-y-1 transition-colors ${
                    n.read
                      ? "bg-[var(--bg-base)] border-hairline text-[var(--text-tertiary)]"
                      : "bg-[var(--bg-surface-2)] border-hairline-strong text-[var(--text-primary)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-medium text-[var(--text-secondary)] uppercase text-[10px] tracking-wider">
                      {n.category}
                    </span>
                    {!n.read && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-0.5 cursor-pointer"
                      >
                        <Check className="w-3 h-3" /> Mark read
                      </button>
                    )}
                  </div>
                  <h5 className="font-medium text-[var(--text-primary)] text-xs">{n.title}</h5>
                  <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">{n.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}