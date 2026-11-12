import React from "react";
import {
  Calendar,
  Bus,
  FileCheck2,
  Bell,
  Trophy,
  Navigation,
  ArrowUpRight,
  MapPin,
  FileText,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  Layers,
  Terminal,
} from "lucide-react";
import { useAuth } from "@/store/authContext";
import { useOdApprovalStore } from "@/store/odApprovalStore";
import { SectionLabel, VyseLogo, StrokeText } from "@/components/ui";

export function EmptyChatLanding({
  onSelectPrompt,
  onOpenMap,
  onOpenBusTransit,
  onOpenUpcomingHackathons,
  onOpenTimetable,
  onOpenPersonalInfo,
  onOpenLetterSelection,
  onOpenOdLetter,
  onOpenLeaveLetter,
  onOpenFacultyNotifications,
  onOpenStudentNotifications,
}: {
  onSelectPrompt: (prompt: string) => void;
  onOpenMap?: () => void;
  onOpenBusTransit?: () => void;
  onOpenUpcomingHackathons?: () => void;
  onOpenTimetable?: () => void;
  onOpenPersonalInfo?: (tab?: "attendance" | "profile" | "subjects" | "calendar") => void;
  onOpenLetterSelection?: () => void;
  onOpenOdLetter?: () => void;
  onOpenLeaveLetter?: () => void;
  onOpenFacultyNotifications?: () => void;
  onOpenStudentNotifications?: () => void;
}) {
  const { role, profile, student, user } = useAuth();
  const { pendingCount, getStudentNotifications } = useOdApprovalStore();

  const isFacultyOrAdmin = role === "faculty" || role === "admin";
  const studentName =
    student?.name || profile?.full_name || (user?.email ? user.email.split("@")[0] : "Arjun Kumar");
  const studentNotifs = !isFacultyOrAdmin ? getStudentNotifications(studentName) : [];
  const latestStudentNotif = studentNotifs[0];

  const workflowCards = [
    {
      id: "od",
      eyebrow: isFacultyOrAdmin ? "FACULTY PORTAL" : "ACADEMIC CLEARANCE",
      title: isFacultyOrAdmin ? "OD Review Queue" : "OD & Leave Approval",
      desc: isFacultyOrAdmin
        ? `${pendingCount} student requests awaiting official sign-off`
        : "Generate institutional OD letters & check 75% threshold",
      prompt: isFacultyOrAdmin
        ? "Review pending student OD requests awaiting faculty approval."
        : "I have a hackathon tomorrow and I need OD.",
      icon: FileCheck2,
      action: isFacultyOrAdmin ? onOpenFacultyNotifications : onOpenLetterSelection,
    },
    {
      id: "schedule",
      eyebrow: isFacultyOrAdmin ? "FACULTY TIMETABLE" : "SECTION C2",
      title: isFacultyOrAdmin ? "Weekly Teaching Plan" : "Academic Timetable",
      desc: isFacultyOrAdmin
        ? "Dr. T. Vino • 21 Periods/Wk across Sections A1–E3"
        : "Odd Semester 2026 • Discrete Math, CAO & Java Labs",
      prompt: isFacultyOrAdmin
        ? "What sections and classes do I have tomorrow?"
        : "What classes do I have tomorrow?",
      icon: Calendar,
      action: onOpenTimetable,
    },
    {
      id: "profile",
      eyebrow: "ATTENDANCE & LEAVES",
      title: "Personal Profile & Attendance",
      desc: isFacultyOrAdmin
        ? "Faculty duty records, leaves & academic profile"
        : "Attendance analytics, leaves & performance status",
      prompt: isFacultyOrAdmin
        ? "View my faculty profile, duty days, and leave analytics."
        : "Check my personal info, leaves, days present, and attendance percentage.",
      icon: UserCheck,
      action: () => onOpenPersonalInfo?.("attendance"),
    },
    {
      id: "transit",
      eyebrow: "CAMPUS LOGISTICS",
      title: "Bus Fleet Transit",
      desc: "175 verified routes, satellite mapping & morning timings",
      prompt: "Which bus should I take from Tambaram for my 8:30 class?",
      icon: Bus,
      action: onOpenBusTransit,
    },
    {
      id: "events",
      eyebrow: "CAMPUS CELEBRATIONS",
      title: "Campus Events Calendar",
      desc: "Freshers Day (Aarambh), Vivacity Culturals & Hackathons",
      prompt: "Show upcoming campus events like Freshers Day, Culturals, and Hackathons",
      icon: Calendar,
      action: () => onOpenPersonalInfo?.("calendar"),
    },
    {
      id: "navigation",
      eyebrow: "FACILITY DIRECTORY",
      title: "Block M & Campus Map",
      desc: "Interactive Google Maps routing for exam halls & labs",
      prompt: "My exam is in Block M. How do I get there?",
      icon: Navigation,
      action: onOpenMap,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-16 select-none animate-in fade-in duration-200">
      {/* =====================================================================
          1. ASYMMETRIC HERO SECTION (Editorial Layout)
          ===================================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2 sm:pt-6">
        {/* Left Column (7 cols): Oversized Condensed Typography */}
        <div className="lg:col-span-7 space-y-5 text-left">
          <div className="flex items-center gap-3">
            <VyseLogo size={22} showText={false} />
            <SectionLabel>
              SYSTEM 01 // AI CHATBOT
            </SectionLabel>
          </div>

          <div className="w-full max-w-xl py-1">
            <h1 className="sr-only">Vyse AI</h1>
            <StrokeText
              text="Vyse AI"
              strokeColor="var(--text-secondary, #8E9298)"
              fillColor="#F8FAFC"
              strokeWidth={1.4}
              drawDuration={1.6}
              fillDelay={0.2}
              stagger={0.05}
              ease="power2.out"
              trigger="mount"
              fillMode="wipe"
              fontSize={128}
              fontWeight={800}
              letterSpacing={-4}
              reverse={false}
              className="font-display tracking-tight"
            />
          </div>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl font-normal leading-relaxed pt-1">
            Autonomous campus assistant for Sathyabama University. Instant on-duty workflow clearance, real-time bus transit, and live attendance tracking.
          </p>

          {/* Action CTAs: Solid off-white pill + Ghost link with arrow */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              type="button"
              onClick={() => onSelectPrompt("What is my current attendance and schedule for tomorrow?")}
              className="px-6 py-3 rounded-full bg-[var(--cta-solid)] text-[var(--cta-solid-text)] text-xs font-semibold hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>Execute Primary Query</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => onOpenPersonalInfo?.("attendance")}
              className="px-4 py-3 rounded-md text-xs font-mono uppercase tracking-[0.14em] text-[var(--text-secondary)] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Open Student Profile</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Edge-Bleeding Card Surface */}
        <div className="lg:col-span-5 w-full">
          <div className="rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-hairline)]">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-tertiary)] block">
                  ACTIVE PROFILE
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {studentName}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[var(--border-hairline)] bg-[var(--bg-surface-2)] text-[var(--text-secondary)]">
                {isFacultyOrAdmin ? "FACULTY PORTAL" : "SECTION C2"}
              </span>
            </div>

            {/* Quick Status Rows */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-md bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] flex items-center justify-between">
                <span className="text-[var(--text-tertiary)] uppercase text-[11px] tracking-wider">Attendance Rate</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {isFacultyOrAdmin ? "95.6%" : "84.4%"}
                </span>
              </div>

              <div className="p-3 rounded-md bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] flex items-center justify-between">
                <span className="text-[var(--text-tertiary)] uppercase text-[11px] tracking-wider">Upcoming Milestone</span>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  Sep 18 • Freshers Day
                </span>
              </div>

              <div className="p-3 rounded-md bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] flex items-center justify-between">
                <span className="text-[var(--text-tertiary)] uppercase text-[11px] tracking-wider">Transit Line</span>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  Route 12B • Tambaram
                </span>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => onOpenTimetable?.()}
                className="w-full py-2.5 rounded-md bg-[var(--bg-surface-2)] hover:bg-white/[0.06] border border-[var(--border-hairline)] text-xs text-[var(--text-primary)] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>View Section Timetable</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. STAT STRIP (Single Hairline Bar, Evenly Split Columns)
          ===================================================================== */}
      <section className="rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--border-hairline)] text-left">
          <div className="p-5 sm:p-6 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-tertiary)] block">
              Transit Fleet
            </span>
            <div className="font-display text-3xl sm:text-4xl text-[var(--text-primary)]">
              175
            </div>
            <span className="text-[11px] text-[var(--text-secondary)] font-mono">
              Active Bus Routes
            </span>
          </div>

          <div className="p-5 sm:p-6 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-tertiary)] block">
              Safety Limit
            </span>
            <div className="font-display text-3xl sm:text-4xl text-[var(--text-primary)]">
              75.0%
            </div>
            <span className="text-[11px] text-[#7A8C7A] font-mono">
              Required Minimum
            </span>
          </div>

          <div className="p-5 sm:p-6 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-tertiary)] block">
              Odd Semester
            </span>
            <div className="font-display text-3xl sm:text-4xl text-[var(--text-primary)]">
              90
            </div>
            <span className="text-[11px] text-[var(--text-secondary)] font-mono">
              Instructional Days
            </span>
          </div>

          <div className="p-5 sm:p-6 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-tertiary)] block">
              Response SLA
            </span>
            <div className="font-display text-3xl sm:text-4xl chrome-text">
              &lt;250MS
            </div>
            <span className="text-[11px] text-[var(--text-secondary)] font-mono">
              AI Chatbot Status
            </span>
          </div>
        </div>
      </section>

      {/* Student Direct Notification Alert (if any active notice) */}
      {!isFacultyOrAdmin && latestStudentNotif && (
        <section
          onClick={() => {
            if (latestStudentNotif.type === "approved" && onOpenOdLetter) {
              onOpenOdLetter();
            } else if (onOpenStudentNotifications) {
              onOpenStudentNotifications();
            }
          }}
          className="p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline-strong)] hover:border-white/30 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 stroke-[1.5] text-[#7A8C7A] shrink-0" />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--text-primary)] uppercase font-mono tracking-wide">
                  {latestStudentNotif.title}
                </span>
                <span className="text-[9px] font-mono px-2 py-0.2 rounded-full border border-[#7A8C7A]/30 text-[#7A8C7A]">
                  {latestStudentNotif.statusText}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                {latestStudentNotif.message}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="self-end sm:self-center px-3 py-1.5 rounded-full bg-[var(--cta-solid)] text-[var(--cta-solid-text)] text-xs font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            Review Document
          </button>
        </section>
      )}

      {/* =====================================================================
          3. CARD GRID (Workflow Actions with Hairline Borders & Arrow Button)
          ===================================================================== */}
      <section className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <SectionLabel>CORE CAPABILITIES // ACTION SUITE</SectionLabel>
          <span className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider">
            6 Operational Nodes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => {
                  if (card.action) {
                    card.action();
                  } else {
                    onSelectPrompt(card.prompt);
                  }
                }}
                className="obsidian-card p-5 flex flex-col justify-between space-y-4 group cursor-pointer text-left"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                    {card.eyebrow}
                  </span>
                  <Icon className="w-4 h-4 stroke-[1.5] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2 font-normal">
                    {card.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-hairline)]">
                  <span className="text-[10px] font-mono text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors">
                    Click to launch
                  </span>
                  <div className="w-6 h-6 rounded-full border border-[var(--border-hairline)] group-hover:border-[var(--border-hairline-strong)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                    <ArrowRight className="w-3 h-3 stroke-[1.5] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          4. TWO-COLUMN CAPABILITY LIST (Generous Vertical Rhythm, No Card Wrappers)
          ===================================================================== */}
      <section className="space-y-6 text-left pt-4">
        <SectionLabel>SYSTEM ARCHITECTURE // RECURRENT PROTOCOLS</SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-5 h-5 stroke-[1.5] text-[var(--text-tertiary)] mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-[var(--text-primary)] tracking-wide">
                Autonomous OD Validation Pipeline
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Deterministic institutional policy verification. Automatically verifies semester attendance against the required 75% cutoff and compiles signed PDFs for Dean Office approval.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Compass className="w-5 h-5 stroke-[1.5] text-[var(--text-tertiary)] mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-[var(--text-primary)] tracking-wide">
                Satellite GPS Fleet Coordination
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Full-coverage monitoring across 175 Chennai college bus routes, providing live route stops, boarding schedules, and interactive campus map routing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Cpu className="w-5 h-5 stroke-[1.5] text-[var(--text-tertiary)] mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-[var(--text-primary)] tracking-wide">
                Multi-Vector Competency Radar
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Instant radar analysis spanning theory lectures, practical labs, RFID gate turnstile punctuality, and approved academic hackathon credentials.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Layers className="w-5 h-5 stroke-[1.5] text-[var(--text-tertiary)] mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-[var(--text-primary)] tracking-wide">
                Polyglot Campus Query Engine
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Native multi-lingual natural language interface supporting English, Tamil, Telugu, and Hindi for academic schedules, exam dates, and administrative regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. PROCESS / STEP TIMELINE (Numbered 01, 02, 03 Connected by Hairline)
          ===================================================================== */}
      <section className="space-y-6 text-left pt-4">
        <SectionLabel>EXECUTION WORKFLOW // 3-PHASE LIFECYCLE</SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="p-5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-2">
            <div className="font-display text-2xl text-[var(--text-tertiary)]">01</div>
            <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-[var(--text-primary)]">
              Input Query & Intent
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Submit your natural language query or attach event documentation via the command console.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-2">
            <div className="font-display text-2xl text-[var(--text-tertiary)]">02</div>
            <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-[var(--text-primary)]">
              Institutional Context
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              AI matches against Section C2 syllabus, registered timetable, and campus logs.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-2">
            <div className="font-display text-2xl text-[var(--text-tertiary)]">03</div>
            <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-[var(--text-primary)]">
              Verified Resolution
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Direct generation of clearance letters, transit paths, and academic standing reports.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. TAG / BADGE GRID (Campus Fast Intents)
          ===================================================================== */}
      <section className="space-y-4 text-left pt-4">
        <SectionLabel>CAMPUS DIRECTORY // FAST INTENTS</SectionLabel>
        <div className="p-5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] flex flex-wrap gap-2.5">
          {[
            { label: "OD Letter Request", prompt: "I have a hackathon tomorrow and I need OD." },
            { label: "Section C2 Timetable", prompt: "What classes do I have tomorrow?" },
            { label: "Tambaram 175 Routes", prompt: "Which bus should I take from Tambaram for my 8:30 class?" },
            { label: "Attendance Safety Cushion", prompt: "What is my attendance status and how many classes can I miss?" },
            { label: "Block M Examination Hall", prompt: "My exam is in Block M. How do I get there?" },
            { label: "Freshers Day Aarambh", prompt: "Show upcoming campus events like Freshers Day, Culturals, and Hackathons" },
            { label: "Digital Logic Circuit Lab", prompt: "When is my Digital Logic Circuit Lab in Block M?" },
          ].map((tag) => (
            <button
              key={tag.label}
              type="button"
              onClick={() => onSelectPrompt(tag.prompt)}
              className="px-3.5 py-1.5 rounded-full border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] bg-[var(--bg-surface-2)] text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================================
          7. CTA FOOTER PANEL (The One Full Brushed Chrome Gradient Panel)
          ===================================================================== */}
      <section className="chrome-panel rounded-lg p-8 sm:p-12 text-left relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#2E3A56] font-bold">
              READY TO COMMENCE SESSION
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#0B0C0E] tracking-tight uppercase leading-[0.92]">
              INITIATE IMMEDIATE <br />
              CAMPUS INQUIRY
            </h2>
            <p className="text-xs sm:text-sm text-[#3E4552] max-w-lg font-medium">
              Access the conversational engine below or select any protocol to execute automated academic tasks.
            </p>
          </div>

          <div className="md:col-span-4 flex md:justify-end">
            <button
              type="button"
              onClick={() => onSelectPrompt("What is my timetable and attendance status?")}
              className="px-6 py-3.5 rounded-full bg-[#0B0C0E] text-[#F5F5F4] text-xs font-semibold hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer shadow-md"
            >
              Start Session Now →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}