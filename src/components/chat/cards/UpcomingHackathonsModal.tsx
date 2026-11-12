"use client";

import React, { useState } from "react";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  X,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  Check,
  Download,
  FileText,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../../store/authContext";
import { HackathonEvent } from "../../../data/sathyabamaEvents";
import { useHackathonStore, HackathonRegistration } from "../../../store/hackathonStore";

interface UpcomingHackathonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOdLetter?: () => void;
  onApplyOd?: () => void;
  initialFilter?: "all" | "eligible" | "not-eligible" | "registered";
  studentName?: string;
  studentDept?: string;
  attendancePercent?: number;
  studentYear?: number;
}

export function UpcomingHackathonsModal({
  isOpen,
  onClose,
  onOpenOdLetter,
  onApplyOd,
  initialFilter = "all",
  studentName,
  studentDept,
  attendancePercent,
  studentYear,
}: UpcomingHackathonsModalProps) {
  const { student, profile, registerNumber, role, isFaculty } = useAuth();
  const {
    hackathons,
    registrations,
    registerForHackathon,
    isStudentRegistered,
    evaluateEligibility,
  } = useHackathonStore();

  const [activeTab, setActiveTab] = useState<"all" | "eligible" | "not-eligible" | "registered">(
    initialFilter
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Registration Dialog State
  const [selectedHackathonForReg, setSelectedHackathonForReg] = useState<HackathonEvent | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState<number>(2);
  const [teammateInput, setTeammateInput] = useState("");
  const [justRegistered, setJustRegistered] = useState<HackathonRegistration | null>(null);

  if (!isOpen) return null;

  // Derive current student's data
  const currentStudent = {
    name: studentName || student?.name || profile?.full_name || "Arjun Kumar",
    rollNumber: student?.roll_number || registerNumber || "RA2311003010452",
    department: studentDept || student?.department || "Computer Science and Engineering",
    year: studentYear || student?.year || 2,
    attendance:
      attendancePercent ??
      (student?.name?.includes("Rahul")
        ? 68.0
        : student?.name?.includes("Divya")
        ? 91.0
        : 84.0),
  };

  const studentRegistrations = registrations.filter(
    (r: HackathonRegistration) => r.studentRollNo.toUpperCase() === currentStudent.rollNumber.toUpperCase()
  );

  // Evaluate all events
  const evaluatedEvents = hackathons.map((h: HackathonEvent) => {
    const evalResult = evaluateEligibility(h, currentStudent);
    const registered = isStudentRegistered(h.id, currentStudent.rollNumber);
    const regDetail = registrations.find(
      (r: HackathonRegistration) => r.hackathonId === h.id && r.studentRollNo.toUpperCase() === currentStudent.rollNumber.toUpperCase()
    );
    return {
      event: h,
      evaluation: evalResult,
      isRegistered: registered,
      registrationDetail: regDetail,
    };
  });

  const eligibleCount = evaluatedEvents.filter((e) => e.evaluation.eligible).length;
  const notEligibleCount = evaluatedEvents.filter((e) => !e.evaluation.eligible).length;

  // Filter based on activeTab and searchQuery
  const filteredEvents = evaluatedEvents.filter((item: (typeof evaluatedEvents)[0]) => {
    if (activeTab === "eligible" && !item.evaluation.eligible) return false;
    if (activeTab === "not-eligible" && item.evaluation.eligible) return false;
    if (activeTab === "registered" && !item.isRegistered) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.event.title.toLowerCase().includes(q) ||
      item.event.category.toLowerCase().includes(q) ||
      item.event.tags.some((t: string) => t.toLowerCase().includes(q)) ||
      item.event.venue.toLowerCase().includes(q)
    );
  });

  function startRegistration(hackathon: HackathonEvent) {
    setSelectedHackathonForReg(hackathon);
    setTeamName(`${currentStudent.name.split(" ")[0]}'s Innovators`);
    setTeamSize(hackathon.teamSizeMin || 2);
    setTeammateInput("");
    setJustRegistered(null);
  }

  function handleConfirmRegistration(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedHackathonForReg) return;

    const teammates = teammateInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const reg = registerForHackathon(
      selectedHackathonForReg.id,
      currentStudent,
      {
        teamName: teamName || "Sathyabama Team",
        teamSize,
        teammates,
      }
    );

    setJustRegistered(reg);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[var(--bg-surface)] border border-hairline-strong rounded-lg overflow-hidden flex flex-col h-[92vh]">
        {/* Top Header */}
        <div className="px-5 py-4 bg-[var(--bg-surface-2)] border-b border-hairline flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-md bg-[var(--bg-base)] border border-hairline flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-wide font-mono uppercase">
                  Sathyabama Hackathons & Technical Competitions
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-base)] text-[var(--text-secondary)] border border-hairline font-medium flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[var(--text-tertiary)]" /> 2026 Season Active
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                Institutional Screening, National Finals Nominations & 1-Click Verification
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
            title="Close Hackathons"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Student Attendance & Eligibility Status Bar */}
        <div className="px-5 py-3 bg-[#0C121F] border-b border-indigo-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative rounded-full p-[2px] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shrink-0">
              <div className="w-8 h-8 rounded-full bg-zinc-950 flex items-center justify-center text-xs font-bold text-white">
                {currentStudent.name.charAt(0)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{currentStudent.name}</span>
                <span className="text-[10px] font-mono text-slate-400">
                  ({currentStudent.rollNumber} • Year {currentStudent.year})
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>{currentStudent.department}</span>
              </div>
            </div>
          </div>

          {/* Attendance Gauge & Status */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-xs font-medium text-slate-400">Verified Attendance:</span>
                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                    currentStudent.attendance >= 75
                      ? "bg-emerald-950/60 text-emerald-400 border border-emerald-700/60"
                      : "bg-rose-950/60 text-rose-400 border border-rose-700/60"
                  }`}
                >
                  {currentStudent.attendance.toFixed(1)}%
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {currentStudent.attendance >= 75 ? (
                  <span className="text-emerald-400 flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Eligible for {eligibleCount} of {hackathons.length} hackathons
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center justify-end gap-1">
                    <XCircle className="w-3 h-3" /> Below 75% Institutional Threshold ({notEligibleCount} locked)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="p-4 bg-[#080C14] border-b border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "all"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              All Competitions ({hackathons.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("eligible")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === "eligible"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-zinc-900 text-emerald-400 hover:text-white border border-zinc-800"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Eligible to Register ({eligibleCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("not-eligible")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === "not-eligible"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "bg-zinc-900 text-rose-400 hover:text-white border border-zinc-800"
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Ineligible ({notEligibleCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("registered")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === "registered"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "bg-zinc-900 text-purple-400 hover:text-white border border-zinc-800"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>My Registrations ({studentRegistrations.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search hackathons, AI, CTF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Modal Event Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 space-y-2">
              <Trophy className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-sm font-semibold text-zinc-400">No events found in this category</p>
              <p className="text-xs text-zinc-500">
                Try switching filter tabs or clearing your search query.
              </p>
            </div>
          ) : (
            filteredEvents.map(({ event, evaluation, isRegistered, registrationDetail }) => {
              const isEligible = evaluation.eligible;

              return (
                <div
                  key={event.id}
                  className={`p-5 rounded-md border-hairline transition-all space-y-4 ${
                    isRegistered
                      ? "bg-[var(--bg-surface)] border-hairline-strong"
                      : isEligible
                      ? "bg-[var(--bg-surface)] hover:border-hairline-strong"
                      : "bg-[var(--bg-base)] opacity-80"
                  }`}
                >
                  {/* Card Top Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {event.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                          {event.mode}
                        </span>
                        {isRegistered && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                            <Check className="w-3 h-3 text-purple-400" /> REGISTERED
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white tracking-tight">
                        {event.title}
                      </h3>
                      <p className="text-xs text-zinc-400">{event.tagline}</p>
                    </div>

                    {/* Prize Badge */}
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] font-mono uppercase text-amber-400/90 block">
                        Prize Bounty
                      </span>
                      <span className="text-xs font-bold font-mono text-amber-300">
                        {event.prizePool}
                      </span>
                    </div>
                  </div>

                  {/* Key Event Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-black/40 border border-zinc-800/60 text-xs">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Date & Duration</span>
                        <span className="font-medium text-white">{event.dates}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-zinc-500 block">Campus Venue</span>
                        <span className="font-medium text-white truncate block">{event.venue}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-300">
                      <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Team Formation</span>
                        <span className="font-medium text-white">
                          {event.teamSizeMin === event.teamSizeMax
                            ? `${event.teamSizeMin} Members`
                            : `${event.teamSizeMin} to ${event.teamSizeMax} Members`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Eligibility Breakdown */}
                  <div
                    className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                      isEligible
                        ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-200"
                        : "bg-rose-950/20 border-rose-800/40 text-rose-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold">
                        {isEligible ? (
                          <>
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-300">ELIGIBLE TO PARTICIPATE</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-4 h-4 text-rose-400" />
                            <span className="text-rose-300">NOT ELIGIBLE FOR THIS EVENT</span>
                          </>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-zinc-400">
                        Institutional Rule: Attendance &gt;= {event.minAttendanceRequired}%
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-white/5 space-y-1 text-[11px]">
                      {isEligible ? (
                        evaluation.criteriaMet.map((c: string, i: number) => (
                          <div key={i} className="flex items-center gap-1.5 text-emerald-300">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{c}</span>
                          </div>
                        ))
                      ) : (
                        evaluation.reasons.map((r: string, i: number) => (
                          <div key={i} className="flex items-center gap-1.5 text-rose-300">
                            <X className="w-3 h-3 text-rose-400 shrink-0" />
                            <span>{r}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Registered Details (If already registered) */}
                  {isRegistered && registrationDetail && (
                    <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-purple-300">
                          CONFIRMED REGISTRATION PASS
                        </span>
                        <div className="font-mono font-bold text-white flex items-center gap-2">
                          <span>Pass ID: {registrationDetail.registrationId}</span>
                          <span>•</span>
                          <span>Team: {registrationDetail.teamName} ({registrationDetail.teamSize} pax)</span>
                        </div>
                      </div>

                      {(onApplyOd || onOpenOdLetter) && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            (onApplyOd || onOpenOdLetter)?.();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Apply OD for this Event</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>Deadline: {event.registrationDeadline}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isRegistered ? (
                        <button
                          type="button"
                          onClick={() => startRegistration(event)}
                          className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-purple-300 text-xs font-medium border border-zinc-800 transition-colors cursor-pointer"
                        >
                          Modify Registration
                        </button>
                      ) : isEligible ? (
                        <button
                          type="button"
                          onClick={() => startRegistration(event)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <span>Register for Hackathon</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs font-medium cursor-not-allowed"
                          title="You do not meet the minimum attendance or year threshold"
                        >
                          Ineligible to Register
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Interactive Registration Dialog Modal */}
        {selectedHackathonForReg && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-[var(--bg-surface)] border-hairline rounded-lg overflow-hidden flex flex-col">
              <div className="p-5 bg-[var(--bg-base)] border-b border-hairline flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                    Institutional Team Registration
                  </span>
                  <h3 className="font-bold text-sm text-[var(--text-bright)]">
                    {selectedHackathonForReg.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHackathonForReg(null);
                    setJustRegistered(null);
                  }}
                  className="p-1.5 rounded border-hairline bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-bright)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {justRegistered ? (
                /* Success Screen */
                <div className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <Check className="w-6 h-6" />
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">Registration Confirmed!</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Your entry has been locked in Sathyabama Hackathon System.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 text-left font-mono text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Registration Pass:</span>
                      <span className="text-emerald-400 font-bold">{justRegistered.registrationId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Lead Candidate:</span>
                      <span className="text-white">{justRegistered.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Team Name:</span>
                      <span className="text-indigo-300">{justRegistered.teamName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Confirmed Size:</span>
                      <span className="text-white">{justRegistered.teamSize} Developers</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {onOpenOdLetter && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHackathonForReg(null);
                          onClose();
                          onOpenOdLetter();
                        }}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Generate OD Letter for Event</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedHackathonForReg(null);
                        setJustRegistered(null);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-300 text-xs font-semibold border border-zinc-800 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleConfirmRegistration} className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. ByteForge AI"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Team Size
                    </label>
                    <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                      {[1, 2, 3, 4]
                        .filter(
                          (sz) =>
                            sz >= selectedHackathonForReg.teamSizeMin &&
                            sz <= selectedHackathonForReg.teamSizeMax
                        )
                        .map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setTeamSize(sz)}
                            className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                              teamSize === sz
                                ? "bg-indigo-600 text-white border-indigo-400 font-bold shadow-md shadow-indigo-600/30"
                                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                            }`}
                          >
                            {sz} {sz === 1 ? "Solo" : "Devs"}
                          </button>
                        ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Teammates Names / Roll Numbers (Optional)
                    </label>
                    <input
                      type="text"
                      value={teammateInput}
                      onChange={(e) => setTeammateInput(e.target.value)}
                      placeholder="e.g. Divya S (RA2311003010418), Rahul"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Lead participant: {currentStudent.name} ({currentStudent.rollNumber})
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-[11px] text-indigo-300">
                    Institutional verification completed: Attendance {currentStudent.attendance.toFixed(1)}% satisfies minimum threshold ({selectedHackathonForReg.minAttendanceRequired}%).
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedHackathonForReg(null)}
                      className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-medium"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                    >
                      Confirm Official Entry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
