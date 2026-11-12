import React, { useState } from "react";
import { Lock, Mail, ArrowRight, MapPin, GraduationCap, Shield, User } from "lucide-react";
import { useAuth } from "../../../store/authContext";
import { GoogleCampusMapModal } from "../../chat/cards/GoogleCampusMapModal";
import { SectionLabel, VyseLogo } from "../../ui";

export function AuthScreen() {
  const { login, quickLogin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    }
  }

  async function handleQuick(key: "arjun" | "divya" | "faculty") {
    setError(null);
    try {
      await quickLogin(key);
    } catch (err: any) {
      setError(err.message || "Quick login failed.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-base)] text-[var(--text-primary)] relative select-none">
      <div className="w-full max-w-md space-y-6 relative z-10 text-left">
        {/* Editorial Brand Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <VyseLogo size={32} showText={false} />
            <SectionLabel>CAMPUS GATEWAY // AI CHATBOT</SectionLabel>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl tracking-tight leading-[0.9] text-[var(--text-primary)]">
            SYSTEM <span className="chrome-text">AUTHENTICATION</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-normal">
            Sign in to initialize your institutional verified session.
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 sm:p-7 space-y-5 shadow-2xl">
          {error && (
            <div className="p-3 rounded-md bg-[#B5675C]/10 border border-[#B5675C]/30 text-[#B5675C] text-xs flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5675C] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase font-semibold text-[var(--text-tertiary)] tracking-[0.12em]">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 stroke-[1.5] text-[var(--text-tertiary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@demo.campora.edu"
                  required
                  className="w-full bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] focus:border-[var(--border-hairline-strong)] text-[var(--text-primary)] text-sm rounded-md pl-10 pr-4 py-2.5 outline-none transition-all placeholder:text-[var(--text-tertiary)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase font-semibold text-[var(--text-tertiary)] tracking-[0.12em]">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 stroke-[1.5] text-[var(--text-tertiary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] focus:border-[var(--border-hairline-strong)] text-[var(--text-primary)] text-sm rounded-md pl-10 pr-4 py-2.5 outline-none transition-all placeholder:text-[var(--text-tertiary)]"
                />
              </div>
            </div>

            {/* Solid off-white pill submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-full bg-[var(--cta-solid)] text-[var(--cta-solid-text)] text-xs font-semibold hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-40 shadow-xs"
            >
              {loading ? "Authenticating Node..." : "Initialize Session →"}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-[var(--border-hairline)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                1-Click Verified Personas
              </span>
              <span className="text-[10px] font-mono text-[var(--text-secondary)]">AI CHATBOT</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuick("arjun")}
                disabled={loading}
                className="p-3 rounded-md bg-[var(--bg-surface-2)] hover:bg-white/[0.04] border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] shrink-0">
                    <GraduationCap className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2">
                      <span>Arjun Kumar</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full border border-[var(--border-hairline)] text-[var(--text-tertiary)] uppercase">STUDENT</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5 font-mono">
                      Tambaram Line • 84.4% Att. • Section C2
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 transition-all shrink-0 stroke-[1.5]" />
              </button>

              <button
                type="button"
                onClick={() => handleQuick("faculty")}
                disabled={loading}
                className="p-3 rounded-md bg-[var(--bg-surface-2)] hover:bg-white/[0.04] border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] shrink-0">
                    <Shield className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2">
                      <span>Prof. K. Venkatesh</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full border border-[var(--border-hairline)] text-[var(--text-tertiary)] uppercase">FACULTY</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5 font-mono">
                      HOD CSE • OD Approver • Dr. T. Vino Timetable
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 transition-all shrink-0 stroke-[1.5]" />
              </button>

              <button
                type="button"
                onClick={() => handleQuick("divya")}
                disabled={loading}
                className="p-3 rounded-md bg-[var(--bg-surface-2)] hover:bg-white/[0.04] border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] shrink-0">
                    <User className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2">
                      <span>Divya S</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full border border-[var(--border-hairline)] text-[var(--text-tertiary)] uppercase">STUDENT</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5 font-mono">
                      Velachery Line • 91.1% Att. • AI&DS
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 transition-all shrink-0 stroke-[1.5]" />
              </button>

              {/* Physical Campus Map Button on Auth Screen */}
              <div className="pt-2 border-t border-[var(--border-hairline)]">
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="w-full py-2.5 px-3.5 rounded-md bg-transparent hover:bg-white/[0.04] border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Campus Block Navigation (Google Maps)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GoogleCampusMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        initialBlock="Block M"
        room="Room 302"
      />
    </div>
  );
}