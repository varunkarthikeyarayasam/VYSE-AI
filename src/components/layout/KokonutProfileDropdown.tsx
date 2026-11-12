"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Shield,
  GraduationCap,
  LogOut,
  Bus,
  KeyRound,
  Check,
  ChevronRight,
  Sparkles,
  ExternalLink,
  MapPin,
  Trophy,
  Calendar,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../../store/authContext";
import { VyseLogo } from "../ui/VyseLogo";

interface KokonutProfileDropdownProps {
  onOpenBusTransit?: () => void;
  onOpenLoginModal?: () => void;
  onOpenMap?: () => void;
  onOpenUpcomingHackathons?: () => void;
  onOpenTimetable?: () => void;
  onOpenPersonalInfo?: (tab?: "attendance" | "profile" | "subjects" | "calendar") => void;
}

export function KokonutProfileDropdown({
  onOpenBusTransit,
  onOpenLoginModal,
  onOpenMap,
  onOpenUpcomingHackathons,
  onOpenTimetable,
  onOpenPersonalInfo,
}: KokonutProfileDropdownProps) {
  const { profile, student, role, registerNumber, adminId, isFaculty, logout, quickLogin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = profile?.full_name || (isFaculty ? "Prof. Venkatesh" : "Arjun Kumar");
  const identifierText = isFaculty ? `Admin ID: ${adminId || "FAC-1042"}` : `Reg No: ${registerNumber || "RA2311003010452"}`;
  const avatarInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Kokonut UI Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-2 py-1.5 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] transition-all duration-150 cursor-pointer focus:outline-none"
      >
        {/* Minimalist Monogram Avatar */}
        <div className="relative w-6 h-6 rounded-md bg-[var(--bg-surface-2)] border border-[var(--border-hairline-strong)] flex items-center justify-center text-[10px] font-mono font-bold text-[var(--text-primary)] shrink-0">
          {avatarInitials}
          {/* Status Indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#7A8C7A]" />
        </div>

        {/* User Info labels (desktop) */}
        <div className="text-left hidden sm:block min-w-0 max-w-[110px]">
          <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
            {displayName}
          </div>
          <div className="text-[10px] text-[var(--text-tertiary)] font-mono truncate">
            {isFaculty ? "Faculty Admin" : (student?.roll_number || registerNumber || "Student")}
          </div>
        </div>

        {/* Bending Line / Chevron SVG */}
        <svg
          className={`w-3.5 h-3.5 text-[var(--text-tertiary)] transition-transform duration-150 group-hover:text-[var(--text-secondary)] ${
            isOpen ? "rotate-180 text-[var(--text-primary)]" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-2xl p-3 z-50 animate-in fade-in duration-100 space-y-3 custom-scrollbar">
          {/* Header Card */}
          <div className="p-3 rounded-md bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-md bg-[var(--bg-base)] border border-[var(--border-hairline-strong)] flex items-center justify-center text-xs font-mono font-bold text-[var(--text-primary)] shrink-0">
                {avatarInitials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{displayName}</p>
                <p className="text-[10px] text-[var(--text-tertiary)] font-mono truncate">{identifierText}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[9px] font-mono px-2 py-0.2 rounded-full border border-[var(--border-hairline)] text-[var(--text-secondary)] uppercase tracking-wider">
                    {isFaculty ? "Faculty Admin" : "Sathyabama Student"}
                  </span>
                </div>
              </div>
            </div>
            <VyseLogo size={24} showText={false} />
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="space-y-1">
            {/* Events Calendar */}
            {onOpenPersonalInfo && (
              <button
                type="button"
                onClick={() => {
                  onOpenPersonalInfo("calendar");
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 rounded-md hover:bg-[var(--bg-surface-2)] border border-transparent hover:border-[var(--border-hairline)] text-left text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 stroke-[1.5] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]" />
                  <div>
                    <span className="font-semibold block leading-tight text-[var(--text-primary)]">Campus Events Calendar</span>
                    <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                      Freshers Day, Culturals & Hackathons
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Personal Info & Attendance */}
            {onOpenPersonalInfo && (
              <button
                type="button"
                onClick={() => {
                  onOpenPersonalInfo("attendance");
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 rounded-md hover:bg-[var(--bg-surface-2)] border border-transparent hover:border-[var(--border-hairline)] text-left text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 stroke-[1.5] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]" />
                  <div>
                    <span className="font-semibold block leading-tight text-[var(--text-primary)]">Personal Info & Attendance</span>
                    <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                      {isFaculty ? "Faculty Bio & Duty Records" : "Attendance Analytics & Bio"}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Bus Transit Feature */}
            {onOpenBusTransit && (
              <button
                type="button"
                onClick={() => {
                  onOpenBusTransit();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 rounded-md hover:bg-[var(--bg-surface-2)] border border-transparent hover:border-[var(--border-hairline)] text-left text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Bus className="w-4 h-4 stroke-[1.5] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]" />
                  <div>
                    <span className="font-semibold block leading-tight text-[var(--text-primary)]">Bus Transit (175 Routes)</span>
                    <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                      Chennai Satellite Transit Map
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Campus Google Map */}
            {onOpenMap && (
              <button
                type="button"
                onClick={() => {
                  onOpenMap();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 rounded-md hover:bg-[var(--bg-surface-2)] border border-transparent hover:border-[var(--border-hairline)] text-left text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 stroke-[1.5] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]" />
                  <div>
                    <span className="font-semibold block leading-tight text-[var(--text-primary)]">Campus Block Map</span>
                    <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                      Jeppiaar Nagar Blocks & Facilities
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Upcoming Hackathons */}
            {onOpenUpcomingHackathons && !isFaculty && (
              <button
                type="button"
                onClick={() => {
                  onOpenUpcomingHackathons();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 rounded-md hover:bg-[var(--bg-surface-2)] border border-transparent hover:border-[var(--border-hairline)] text-left text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-4 h-4 stroke-[1.5] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]" />
                  <div>
                    <span className="font-semibold block leading-tight text-[var(--text-primary)]">Upcoming Hackathons</span>
                    <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                      Registration & Standing
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Timetable / Weekly Plan */}
            {onOpenTimetable && (
              <button
                type="button"
                onClick={() => {
                  onOpenTimetable();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 rounded-md hover:bg-[var(--bg-surface-2)] border border-transparent hover:border-[var(--border-hairline)] text-left text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 stroke-[1.5] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]" />
                  <div>
                    <span className="font-semibold block leading-tight text-[var(--text-primary)]">
                      {isFaculty ? "Faculty Weekly Timetable" : "Section C2 Timetable"}
                    </span>
                    <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                      {isFaculty ? "Dr. T. Vino • Weekly Schedule" : "Weekly Schedule & Lab Slots"}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Portal Login Modal */}
            {onOpenLoginModal && (
              <button
                type="button"
                onClick={() => {
                  onOpenLoginModal();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 rounded-md hover:bg-[var(--bg-surface-2)] border border-transparent hover:border-[var(--border-hairline)] text-left text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 stroke-[1.5] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]" />
                  <div>
                    <span className="font-semibold block leading-tight text-[var(--text-primary)]">Portal Authentication</span>
                    <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                      Switch Register No / Admin ID
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* Quick Demo Personas */}
          <div className="pt-2.5 border-t border-[var(--border-hairline)] space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-tertiary)] block">
              Quick Test Personas
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  quickLogin("arjun");
                  setIsOpen(false);
                }}
                className={`p-2 rounded-md border text-left text-[11px] transition-all cursor-pointer ${
                  !isFaculty && student?.name?.includes("Arjun")
                    ? "bg-[var(--bg-surface-2)] text-[var(--text-primary)] border-[var(--border-hairline-strong)] font-semibold"
                    : "bg-transparent text-[var(--text-secondary)] border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] hover:text-[var(--text-primary)]"
                }`}
              >
                <p className="font-semibold truncate">Arjun (84%)</p>
                <p className="text-[9px] text-[var(--text-tertiary)] font-mono truncate">CSE Student</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickLogin("divya");
                  setIsOpen(false);
                }}
                className={`p-2 rounded-md border text-left text-[11px] transition-all cursor-pointer ${
                  !isFaculty && student?.name?.includes("Divya")
                    ? "bg-[var(--bg-surface-2)] text-[var(--text-primary)] border-[var(--border-hairline-strong)] font-semibold"
                    : "bg-transparent text-[var(--text-secondary)] border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] hover:text-[var(--text-primary)]"
                }`}
              >
                <p className="font-semibold truncate">Divya (91%)</p>
                <p className="text-[9px] text-[var(--text-tertiary)] font-mono truncate">AI&DS Student</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickLogin("rahul");
                  setIsOpen(false);
                }}
                className={`p-2 rounded-md border text-left text-[11px] transition-all cursor-pointer ${
                  !isFaculty && student?.name?.includes("Rahul")
                    ? "bg-[var(--bg-surface-2)] text-[#B5675C] border-[#B5675C]/40 font-semibold"
                    : "bg-transparent text-[var(--text-secondary)] border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] hover:text-[var(--text-primary)]"
                }`}
              >
                <p className="font-semibold truncate">Rahul (68%)</p>
                <p className="text-[9px] text-[var(--text-tertiary)] font-mono truncate">Attendance Deficit</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickLogin("faculty");
                  setIsOpen(false);
                }}
                className={`p-2 rounded-md border text-left text-[11px] transition-all cursor-pointer ${
                  isFaculty
                    ? "bg-[var(--bg-surface-2)] text-[var(--text-primary)] border-[var(--border-hairline-strong)] font-semibold"
                    : "bg-transparent text-[var(--text-secondary)] border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] hover:text-[var(--text-primary)]"
                }`}
              >
                <p className="font-semibold truncate">Prof. Venkatesh</p>
                <p className="text-[9px] text-[var(--text-tertiary)] font-mono truncate">Faculty Approver</p>
              </button>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="pt-2 border-t border-[var(--border-hairline)]">
            <button
              type="button"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 rounded-md bg-transparent hover:bg-white/[0.04] border border-[var(--border-hairline)] hover:border-[#B5675C]/40 text-[var(--text-secondary)] hover:text-[#B5675C] text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
