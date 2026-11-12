"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  ShieldCheck,
  User,
  Lock,
  ArrowRight,
  Sparkles,
  X,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  IdCard,
} from "lucide-react";
import {
  useAuth,
  DEMO_STUDENT_ACCOUNTS,
  DEMO_ADMIN_ACCOUNTS,
} from "../../store/authContext";
import { VyseLogo } from "../ui/VyseLogo";

interface SathyabamaLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "student" | "admin";
}

export function SathyabamaLoginModal({
  isOpen,
  onClose,
  initialTab = "student",
}: SathyabamaLoginModalProps) {
  const { loginWithRegisterNumber, loginWithAdminNumber, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"student" | "admin">(initialTab);

  // Student form state
  const [registerNumber, setRegisterNumber] = useState("RA2311003010452");
  const [studentPassword, setStudentPassword] = useState("Campora@123");

  // Admin form state
  const [adminNumber, setAdminNumber] = useState("FAC-1042");
  const [adminPassword, setAdminPassword] = useState("Campora@123");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleStudentSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!registerNumber.trim()) {
      setError("Please enter your Student Register Number.");
      return;
    }
    if (!studentPassword.trim()) {
      setError("Please enter your account password.");
      return;
    }

    try {
      await loginWithRegisterNumber(registerNumber, studentPassword);
      setSuccess(`Welcome, student ${registerNumber}! Logging you in...`);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Failed to authenticate student credentials.");
    }
  }

  async function handleAdminSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!adminNumber.trim()) {
      setError("Please enter your Admin / Faculty ID.");
      return;
    }
    if (!adminPassword.trim()) {
      setError("Please enter your account password.");
      return;
    }

    try {
      await loginWithAdminNumber(adminNumber, adminPassword);
      setSuccess(`Faculty verification successful (${adminNumber}). Redirecting...`);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Failed to authenticate faculty/admin credentials.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[var(--bg-surface)] border-hairline rounded-lg overflow-hidden flex flex-col">
        {/* Top Header Banner */}
        <div className="relative p-5 bg-[var(--bg-base)] border-b border-hairline">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded border-hairline bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-bright)] transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <VyseLogo size={40} showText={false} />

            <div>
              <h2 className="text-base font-bold text-[var(--text-bright)] tracking-wide flex items-center gap-2">
                Sathyabama Deemed University
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-bright)] border-hairline">
                  Portal Login
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Institutional Access • Students & Faculty Administration
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="mt-4 grid grid-cols-2 p-1 bg-[var(--bg-surface)] border-hairline rounded-full text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab("student");
                setError(null);
                setSuccess(null);
              }}
              className={`py-2 px-3 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "student"
                  ? "bg-[var(--text-bright)] text-[var(--bg-base)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-bright)]"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student (Register No)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("admin");
                setError(null);
                setSuccess(null);
              }}
              className={`py-2 px-3 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "admin"
                  ? "bg-[var(--text-bright)] text-[var(--bg-base)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-bright)]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Faculty / Admin</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          {activeTab === "student" ? (
            /* Student Form */
            <form onSubmit={handleStudentSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                  <IdCard className="w-3.5 h-3.5 text-[var(--text-bright)]" />
                  Student Register Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={registerNumber}
                    onChange={(e) => setRegisterNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. RA2311003010452 or 21CSE045"
                    className="w-full bg-[var(--bg-base)] border-hairline text-[var(--text-bright)] rounded px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-hairline-strong transition-all placeholder:text-[var(--text-muted)]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-muted)] uppercase font-mono">
                    REG NO
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[var(--text-bright)]" />
                  Portal Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="Enter student password"
                    className="w-full bg-[var(--bg-base)] border-hairline text-[var(--text-bright)] rounded px-3.5 py-2.5 text-xs focus:outline-none focus:border-hairline-strong transition-all placeholder:text-[var(--text-muted)]"
                  />
                  <KeyRound className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-5 rounded-full cta-pill-solid text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">Authenticating Register No...</span>
                ) : (
                  <>
                    <span>Sign In to Student Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* 1-Click Demo Fill for Testing */}
              <div className="pt-3 border-t border-hairline">
                <p className="text-[11px] text-[var(--text-secondary)] mb-2 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3 text-[var(--text-bright)]" />
                  Quick-Login Student Samples:
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {DEMO_STUDENT_ACCOUNTS.map((stu) => (
                    <button
                      key={stu.registerNumber}
                      type="button"
                      onClick={() => {
                        setRegisterNumber(stu.registerNumber);
                        setStudentPassword("Campora@123");
                      }}
                      className="p-2 rounded border-hairline bg-[var(--bg-base)] hover:border-hairline-strong text-left transition-all group cursor-pointer"
                    >
                      <p className="text-[11px] font-semibold text-[var(--text-bright)] truncate">
                        {stu.name}
                      </p>
                      <p className="text-[9px] text-[var(--text-muted)] font-mono truncate">
                        {stu.registerNumber}
                      </p>
                      <p
                        className={`text-[9px] font-bold mt-0.5 ${
                          stu.attendance >= 75 ? "text-[#7A8C7A]" : "text-[#B5675C]"
                        }`}
                      >
                        Att: {stu.attendance}%
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* Admin / Faculty Form */
            <form onSubmit={handleAdminSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                  <IdCard className="w-3.5 h-3.5 text-[var(--text-bright)]" />
                  Faculty / Admin Identification Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={adminNumber}
                    onChange={(e) => setAdminNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. FAC-1042 or ADMIN-001"
                    className="w-full bg-[var(--bg-base)] border-hairline text-[var(--text-bright)] rounded px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-hairline-strong transition-all placeholder:text-[var(--text-muted)]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-muted)] uppercase font-mono">
                    STAFF ID
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[var(--text-bright)]" />
                  Administrative Passkey
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter administrative passkey"
                    className="w-full bg-[var(--bg-base)] border-hairline text-[var(--text-bright)] rounded px-3.5 py-2.5 text-xs focus:outline-none focus:border-hairline-strong transition-all placeholder:text-[var(--text-muted)]"
                  />
                  <KeyRound className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-5 rounded-full cta-pill-solid text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">Authenticating Admin ID...</span>
                ) : (
                  <>
                    <span>Sign In to Faculty Administration</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* 1-Click Demo Fill for Testing */}
              <div className="pt-3 border-t border-hairline">
                <p className="text-[11px] text-[var(--text-secondary)] mb-2 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3 text-[var(--text-bright)]" />
                  Quick-Login Faculty & Admin Accounts:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ADMIN_ACCOUNTS.map((adm) => (
                    <button
                      key={adm.adminNumber}
                      type="button"
                      onClick={() => {
                        setAdminNumber(adm.adminNumber);
                        setAdminPassword("Campora@123");
                      }}
                      className="p-2.5 rounded border-hairline bg-[var(--bg-base)] hover:border-hairline-strong text-left transition-all group cursor-pointer"
                    >
                      <p className="text-[11px] font-semibold text-[var(--text-bright)] truncate">
                        {adm.name}
                      </p>
                      <p className="text-[9px] text-[var(--text-muted)] font-mono truncate">
                        ID: {adm.adminNumber}
                      </p>
                      <p className="text-[9px] text-[var(--text-secondary)] truncate mt-0.5">
                        {adm.designation}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
