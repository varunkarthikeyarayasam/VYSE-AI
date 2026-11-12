import React, { useState, useEffect } from "react";
import { Sparkles, Bell, Plus, MapPin, Bus, UserCheck, Calendar, Palette } from "lucide-react";
import { useAuth } from "../../store/authContext";
import { useOdApprovalStore } from "../../store/odApprovalStore";
import { KokonutProfileDropdown } from "./KokonutProfileDropdown";
import { VyseLogo } from "../ui/VyseLogo";
import { getStoredTheme, toggleTheme, ThemeVariant } from "../../lib/theme";
import { LanguageOption } from "../../lib/i18n/responses";

export function TopBar({
  onNewChat,
  onOpenMap,
  onOpenBusTransit,
  onOpenUpcomingHackathons,
  onOpenTimetable,
  onOpenPersonalInfo,
  onOpenLoginModal,
  onOpenNotifications,
  language,
  onLanguageChange,
}: {
  onNewChat: () => void;
  onOpenMap?: () => void;
  onOpenBusTransit?: () => void;
  onOpenUpcomingHackathons?: () => void;
  onOpenTimetable?: () => void;
  onOpenPersonalInfo?: (tab?: "attendance" | "profile" | "subjects" | "calendar") => void;
  onOpenLoginModal?: () => void;
  onOpenNotifications?: () => void;
  language?: LanguageOption;
  onLanguageChange?: (lang: LanguageOption) => void;
}) {
  const { profile, student, role } = useAuth();
  const { pendingCount, getStudentNotifications } = useOdApprovalStore();
  const [theme, setTheme] = useState<ThemeVariant>("graphite");

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  function handleToggleTheme() {
    const next = toggleTheme();
    setTheme(next);
  }

  const isFacultyOrAdmin = role === "faculty" || role === "admin";
  const studentName = student?.name || profile?.full_name || "Arjun Kumar";
  const studentNotifs = getStudentNotifications(studentName);
  const unreadCount = studentNotifs.filter((n) => !n.read).length;

  const attendanceVal = isFacultyOrAdmin
    ? 96
    : studentName.toLowerCase().includes("rahul")
    ? 68
    : studentName.toLowerCase().includes("divya")
    ? 91
    : 84;

  return (
    <header className="h-16 border-b border-[var(--border-hairline)] bg-[var(--bg-base)]/95 backdrop-blur-xs px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Left: Brand Identity with Minimalist Hairline Monogram */}
      <div className="flex items-center gap-3.5">
        <VyseLogo size={34} showText={false} />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg tracking-wider text-[var(--text-primary)]">
              VYSE
            </span>
            <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-[var(--text-tertiary)] hidden sm:inline">
              // AI CHATBOT
            </span>
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)] font-mono tracking-wide block -mt-0.5">
            Sathyabama Operational System
          </span>
        </div>
      </div>

      {/* Center: Stat & System Status Strip (Hairline minimal) */}
      <div className="hidden lg:flex items-center gap-3 px-3 py-1 rounded-full border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#7A8C7A]" />
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-secondary)]">
          Node Online
        </span>
        <span className="text-[var(--border-hairline-strong)]">•</span>
        <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
          Verified Campus Intelligence
        </span>
      </div>

      {/* Right: Actions, Theme Switcher & Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Palette Switcher: Graphite Chrome vs Navy Chrome */}
        <button
          type="button"
          onClick={handleToggleTheme}
          title={`Active Palette: ${theme.toUpperCase()} CHROME. Click to switch.`}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono transition-all cursor-pointer"
        >
          <Palette className="w-3.5 h-3.5 stroke-[1.5]" />
          <span className="hidden sm:inline uppercase text-[10px] tracking-[0.12em] font-semibold">
            {theme}
          </span>
        </button>

        {/* Sathyabama Bus & Transit Button */}
        {onOpenBusTransit && (
          <button
            type="button"
            onClick={onOpenBusTransit}
            title="Open Sathyabama Bus Routes"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-all cursor-pointer"
          >
            <Bus className="w-3.5 h-3.5 stroke-[1.5]" />
            <span className="hidden sm:inline text-xs font-medium">Buses</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full border border-[var(--border-hairline)] text-[var(--text-tertiary)]">175</span>
          </button>
        )}

        {/* Physical Campus Map Button */}
        {onOpenMap && (
          <button
            type="button"
            onClick={onOpenMap}
            title="Open Campus Map"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 stroke-[1.5]" />
            <span className="hidden sm:inline text-xs font-medium">Map</span>
          </button>
        )}

        {/* Real-time OD Notifications Bell */}
        {onOpenNotifications && (
          <button
            type="button"
            onClick={onOpenNotifications}
            title={
              isFacultyOrAdmin
                ? `Faculty OD Review Queue (${pendingCount} pending)`
                : `Student OD Status Notifications (${unreadCount} unread)`
            }
            className="relative p-2 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-3.5 h-3.5 stroke-[1.5]" />
            {(isFacultyOrAdmin ? pendingCount > 0 : unreadCount > 0) && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#B5675C] text-white font-mono text-[9px] font-bold flex items-center justify-center">
                {isFacultyOrAdmin ? pendingCount : unreadCount}
              </span>
            )}
          </button>
        )}

        {/* Events Calendar Slot */}
        {onOpenPersonalInfo && (
          <button
            type="button"
            onClick={() => onOpenPersonalInfo("calendar")}
            title="Open Campus Events Calendar"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 stroke-[1.5]" />
            <span className="text-xs font-medium">Events</span>
          </button>
        )}

        {/* Personal Info & Attendance Slot */}
        {onOpenPersonalInfo && (
          <button
            type="button"
            onClick={() => onOpenPersonalInfo("attendance")}
            title="Open Personal Info & Attendance Records"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-all cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 stroke-[1.5]" />
            <span className="text-xs font-medium">Records</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full border border-[var(--border-hairline)] text-[var(--text-tertiary)]">
              {attendanceVal}%
            </span>
          </button>
        )}

        {/* Primary Solid Off-White Pill CTA (The deliberate contrast element) */}
        <button
          type="button"
          onClick={onNewChat}
          title="Start fresh conversation"
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--cta-solid)] text-[var(--cta-solid-text)] text-xs font-semibold hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Query</span>
        </button>

        {/* Minimalist Profile Trigger */}
        <KokonutProfileDropdown
          onOpenBusTransit={onOpenBusTransit}
          onOpenLoginModal={onOpenLoginModal}
          onOpenMap={onOpenMap}
          onOpenUpcomingHackathons={onOpenUpcomingHackathons}
          onOpenTimetable={onOpenTimetable}
          onOpenPersonalInfo={onOpenPersonalInfo}
        />
      </div>
    </header>
  );
}