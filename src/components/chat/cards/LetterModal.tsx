import React, { useState } from "react";
import {
  Printer,
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Sliders,
  Check,
  Info,
  Clock,
  Sparkles,
  Bell,
  Lock,
} from "lucide-react";
import { PieChart, PieSlice } from "@/components/ui/charts";
import {
  RadarChart,
  RadarGrid,
  RadarAxis,
  RadarLabels,
  RadarArea,
} from "@/components/ui/charts";
import { useAuth } from "@/store/authContext";
import { useOdApprovalStore } from "@/store/odApprovalStore";

export type LetterType = "od" | "leave";

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: LetterType;
  studentData?: {
    name?: string;
    rollNumber?: string;
    department?: string;
    section?: string;
    semester?: string;
    attendancePercent?: number;
    eventName?: string;
    eventDate?: string;
    leaveReason?: string;
    leaveDates?: string;
  };
}

export function LetterModal({
  isOpen,
  onClose,
  initialType = "od",
  studentData,
}: LetterModalProps) {
  const { student, role, profile } = useAuth();
  const { getStudentRequest } = useOdApprovalStore();

  const [letterType, setLetterType] = useState<LetterType>(initialType);

  // Core business rule: Attendance MUST be > 75%
  const [attendancePercent, setAttendancePercent] = useState<number>(
    studentData?.attendancePercent ?? 90.7
  );

  // Student details
  const studentName = studentData?.name || student?.name || "Arjun Kumar";
  const rollNumber =
    studentData?.rollNumber || student?.roll_number || "RA2311003010452";
  const department =
    studentData?.department ||
    student?.department ||
    "Computer Science and Engineering";
  const section = studentData?.section || student?.section || "CSE-C";
  const semester = studentData?.semester || "6";
  const universityName = "SATHYABAMA INSTITUTE OF SCIENCE AND TECHNOLOGY";
  const universityAddress =
    "Jeppiaar Nagar, Rajiv Gandhi Salai, Chennai, Tamil Nadu - 600119";

  const eventName =
    studentData?.eventName || "Code Sprint 24-Hour National Hackathon";
  const eventDate = studentData?.eventDate || "11 / 09 / 2026 to 12 / 09 / 2026";
  const leaveReason =
    studentData?.leaveReason ||
    "Medical appointment and recovery under medical advice";
  const leaveDates = studentData?.leaveDates || "11 / 09 / 2026 to 13 / 09 / 2026";

  const refNumber =
    letterType === "od"
      ? `SIST/CSE/OD/2026/0842`
      : `SIST/CSE/LV/2026/0419`;

  const todayStr = "11 / 09 / 2026";

  // Eligibility check: strictly > 75%
  const isAttendanceEligible = attendancePercent > 75.0;

  // Real-time approval state from reactive shared store
  const currentRecord = getStudentRequest(studentName, letterType);
  const isApproved =
    isAttendanceEligible && currentRecord?.status === "approved";
  const approverName = currentRecord?.approvedBy || "Prof. Venkatesh, HOD";
  const approvalDate = currentRecord?.approvedAt || "11 / 09 / 2026";

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  // RULE: If Faculty / Admin tries to view student letter generator, show restriction notice
  if (role === "faculty" || role === "admin") {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--bg-surface)] border-hairline rounded-md p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded border-hairline bg-[var(--bg-base)] flex items-center justify-center mx-auto text-[#C29B38]">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[var(--text-bright)] font-mono">
              Faculty / Admin View
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Letter format generation is reserved for students. Faculty and administrators review incoming submissions through the <strong>OD & Leave Notification Center</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-full cta-pill-solid text-xs font-semibold cursor-pointer transition-all"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Chart 1: Attendance Metrics Pie Chart (Bklit UI)
  const attendedClasses = Math.round((attendancePercent / 100) * 88);
  const absentClasses = Math.max(0, 88 - attendedClasses);
  const odExemptClasses = Math.min(5, Math.floor(attendedClasses * 0.08));
  const effectivePresent = attendedClasses - odExemptClasses;

  const attendancePieData = [
    { label: "Regular Present", value: effectivePresent, color: "#64748b" }, // Slate-500
    { label: "OD / Co-Curricular", value: odExemptClasses, color: "#475569" }, // Slate-600
    { label: "Absent", value: absentClasses, color: "#334155" }, // Slate-700
  ];

  // Chart 2: Student Marks & Progression Radar Chart (Bklit UI)
  const radarMetrics = [
    { key: "academics", label: "Academics" },
    { key: "practicals", label: "Practicals" },
    { key: "projects", label: "Projects" },
    { key: "attendance", label: "Attendance" },
    { key: "assessments", label: "Continuous" },
  ];

  const radarData = [
    {
      label: studentName,
      color: isAttendanceEligible ? "#60A5FA" : "#F43F5E",
      values: {
        academics: 88,
        practicals: 94,
        projects: 90,
        attendance: Math.round(attendancePercent),
        assessments: 86,
      },
    },
    {
      label: "Class Average",
      color: "#64748b",
      values: {
        academics: 74,
        practicals: 78,
        projects: 72,
        attendance: 78,
        assessments: 76,
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm flex flex-col items-center justify-start p-3 sm:p-6 print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Top Floating Control Bar (Hidden on Print) */}
      <div className="sticky top-2 z-30 w-full max-w-5xl mb-4 bg-[var(--bg-surface)] border-hairline rounded-md p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        {/* Left: Format Switcher Tabs (For Students) */}
        <div className="flex items-center gap-1.5 bg-[var(--bg-base)] p-1 rounded-full border-hairline">
          <button
            type="button"
            onClick={() => setLetterType("od")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              letterType === "od"
                ? "bg-[var(--text-bright)] text-[var(--bg-base)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-bright)]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>OD Letter Format</span>
          </button>
          <button
            type="button"
            onClick={() => setLetterType("leave")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              letterType === "leave"
                ? "bg-[var(--text-bright)] text-[var(--bg-base)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-bright)]"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Leave Letter Format</span>
          </button>
        </div>

        {/* Center: Live Rule & Status Badge (ONLY APPROVED OR NOT) */}
        <div className="flex items-center gap-2">
          {/* Rule Indicator */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 border ${
              isAttendanceEligible
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30"
            }`}
          >
            {isAttendanceEligible ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span>
              Attendance: {attendancePercent}% (Rule: &gt; 75% Required)
            </span>
          </div>

          {/* Student Status Indicator: SHOWS ONLY APPROVED OR NOT APPROVED */}
          <div
            className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
              isApproved
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-sm shadow-emerald-500/30"
                : "bg-amber-500/15 text-amber-300 border-amber-500/30"
            }`}
          >
            {isApproved ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {letterType === "od" ? "OD Approved" : "Leave Approved"}
                </span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Not Approved</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions (Print + Close) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#121826] hover:bg-[#1E2638] text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ==========================================
          SECTION 1: DASHBOARD METRICS & CHARTS (BEFORE THE LETTER)
          ========================================== */}
      <div className="w-full max-w-5xl mb-8 space-y-4 print:hidden">
        {/* Dashboard Header Banner */}
        <div className="bg-[var(--bg-surface)] border-hairline rounded-md p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[var(--bg-base)] text-[var(--text-bright)] border-hairline">
                Student Portal
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono">
                Ref: {refNumber}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[var(--text-bright)] font-mono tracking-tight flex items-center gap-2">
              <span>{studentName}</span>
              <span className="text-xs text-[var(--text-secondary)] font-normal">
                ({rollNumber} • {department} • Sem {semester})
              </span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {letterType === "od"
                ? `On-Duty request for: ${eventName} (${eventDate})`
                : `Formal leave request for: ${leaveReason} (${leaveDates})`}
            </p>
          </div>

          {/* Interactive Attendance Slider for Testing */}
          <div className="bg-[var(--bg-base)] border-hairline p-3 rounded flex flex-col items-start gap-1.5 w-full sm:w-auto min-w-[220px]">
            <div className="flex items-center justify-between w-full text-[11px] font-mono">
              <span className="text-[var(--text-secondary)] flex items-center gap-1">
                <Sliders className="w-3 h-3 text-[var(--text-bright)]" />
                Attendance Monitor:
              </span>
              <span
                className={`font-bold ${
                  isAttendanceEligible ? "text-[#7A8C7A]" : "text-[#B5675C]"
                }`}
              >
                {attendancePercent}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="0.5"
              value={attendancePercent}
              onChange={(e) => setAttendancePercent(parseFloat(e.target.value))}
              className="w-full accent-white cursor-pointer h-1.5 bg-[var(--bg-surface)] rounded-full border-hairline"
            />
            <div className="flex justify-between w-full text-[9px] font-mono text-[var(--text-muted)]">
              <span>50%</span>
              <span className="text-[#C29B38] font-semibold">75% Threshold</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* CHARTS GRID: Attendance Pie Chart + Student Marks Radar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart 1: Attendance Metrics */}
          <div className="bg-[var(--bg-surface)] border-hairline rounded-md p-6 flex flex-col items-center relative">
            <div className="w-full flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)]">
                Attendance Metrics & Threshold
              </h4>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                  isAttendanceEligible
                    ? "bg-[#7A8C7A]/10 text-[#7A8C7A] border-[#7A8C7A]/30"
                    : "bg-[#B5675C]/10 text-[#B5675C] border-[#B5675C]/30"
                }`}
              >
                {isAttendanceEligible ? "> 75% Qualified" : "Below 75%"}
              </span>
            </div>

            <PieChart data={attendancePieData} size={250}>
              {attendancePieData.map((_, index) => (
                <PieSlice key={index} index={index} />
              ))}
            </PieChart>

            {/* Attendance Legend & Summary */}
            <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-hairline text-center">
              <div className="bg-[var(--bg-base)] p-2 rounded border-hairline">
                <span className="text-[10px] text-[var(--text-muted)] block font-mono">Present</span>
                <span className="text-xs font-bold text-[var(--text-bright)] font-mono">
                  {attendedClasses} / 88
                </span>
              </div>
              <div className="bg-[var(--bg-base)] p-2 rounded border-hairline">
                <span className="text-[10px] text-[var(--text-muted)] block font-mono">OD Allowed</span>
                <span className="text-xs font-bold text-[var(--text-bright)] font-mono">
                  {odExemptClasses} Slots
                </span>
              </div>
              <div className="bg-[var(--bg-base)] p-2 rounded border-hairline">
                <span className="text-[10px] text-[var(--text-muted)] block font-mono">Absent</span>
                <span className="text-xs font-bold text-[var(--text-secondary)] font-mono">
                  {absentClasses} Days
                </span>
              </div>
            </div>
          </div>

          {/* Chart 2: Student Marks & Progression Radar */}
          <div className="bg-[var(--bg-surface)] border-hairline rounded-md p-6 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)]">
                Student Marks & Progression
              </h4>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-base)] text-[var(--text-bright)] border-hairline">
                SGPA: 8.85
              </span>
            </div>

            <RadarChart data={radarData} metrics={radarMetrics} size={280}>
              <RadarGrid />
              <RadarAxis />
              <RadarLabels />
              {radarData.map((item, index) => (
                <RadarArea key={item.label} index={index} />
              ))}
            </RadarChart>
          </div>
        </div>

        {/* OFFICIAL STATUS DISPLAY (STUDENT VIEW - ONLY APPROVED OR NOT APPROVED) */}
        <div
          className={`border-hairline rounded-md p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--bg-surface)]`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Official Institutional Status
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              {isApproved ? (
                <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  {letterType === "od" ? "OD Approved" : "Leave Approved"}: Authorized by {approverName}. Digital institutional seal validated.
                </span>
              ) : isAttendanceEligible ? (
                <span className="text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Not Approved: Your application is pending review by your Faculty Advisor / HOD. Official approval will be updated once signed.
                </span>
              ) : (
                <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Not Approved: Attendance ({attendancePercent}%) is below the mandatory 75% threshold. Cannot be approved under standard regulations.
                </span>
              )}
            </p>
          </div>

          <div className="shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                isApproved
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-sm shadow-emerald-500/20"
                  : "bg-amber-500/15 text-amber-300 border-amber-500/30"
              }`}
            >
              {isApproved ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Approved</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Not Approved</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* ==========================================
          SECTION 2: PAPER-STYLE LETTER COMPONENT (BELOW THE DASHBOARD)
          Exact physical paper sheet format specified in prompt
          ========================================== */}
      <div className="relative z-10 w-full max-w-[800px] bg-[#fcfbf9] text-slate-800 p-10 sm:p-16 rounded-sm shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-slate-300/80 mb-16 font-serif select-text print:shadow-none print:border-none print:m-0 print:p-8 print:max-w-none">
        {/* University Header */}
        <div className="text-center border-b-2 border-slate-800 pb-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-slate-900 font-serif">
            {universityName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 uppercase tracking-widest font-sans font-semibold">
            Department of {department}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            [{universityAddress}]
          </p>
        </div>

        {/* Date and Ref */}
        <div className="flex justify-between items-start text-sm font-sans mb-8">
          <div>
            <span className="font-semibold">Ref No:</span> {refNumber}
          </div>
          <div>
            <span className="font-semibold">Date:</span> {todayStr}
          </div>
        </div>

        {/* From / To Sections */}
        <div className="space-y-4 text-sm font-sans mb-8">
          <div>
            <p className="font-semibold">From,</p>
            <p className="pl-4 text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900">{studentName}</span> (Student Name)<br />
              Register / Enrollment No: <span className="font-mono font-medium">{rollNumber}</span><br />
              Class / Section: <span className="font-medium">{section}</span>, Semester: <span className="font-medium">{semester}</span><br />
              School / Faculty of <span className="font-medium">School of Computing</span>
            </p>
          </div>

          <div className="pt-2">
            <p className="font-semibold">To,</p>
            <p className="pl-4 text-slate-700 leading-relaxed">
              The Head of Department / Dean,<br />
              Department of {department},<br />
              {universityName}
            </p>
          </div>
        </div>

        {/* Subject */}
        <div className="text-sm font-sans mb-6">
          {letterType === "od" ? (
            <p className="font-bold text-slate-900">
              <span className="underline">Subject:</span> Request for On-Duty (OD) attendance approval for{" "}
              <span className="font-semibold text-slate-950">{eventName}</span> — reg.
            </p>
          ) : (
            <p className="font-bold text-slate-900">
              <span className="underline">Subject:</span> Request for formal Leave of Absence from{" "}
              <span className="font-semibold text-slate-950">{leaveDates}</span> — reg.
            </p>
          )}
        </div>

        {/* Salutation & Body Paragraphs */}
        <div className="space-y-4 text-sm leading-relaxed text-justify font-serif text-slate-800">
          <p>Respected Sir / Madam,</p>

          {letterType === "od" ? (
            <>
              <p className="indent-8">
                I am writing to formally request On-Duty (OD) attendance for participating/representing {universityName} in the{" "}
                <span className="font-semibold"> {eventName} </span> event / competition / workshop held at Tech Innovation Hub on the date(s) of {eventDate}.
              </p>

              <p className="indent-8">
                As this event involves academic/co-curricular representation of our institution, I kindly request you to grant me
                attendance exemption / On-Duty status for the aforementioned duration. My cumulative attendance stands at{" "}
                <span className="font-bold">{attendancePercent}%</span>, which is above the institutional requirement of 75%. I will ensure that any missed coursework or assignments are completed promptly.
              </p>

              <p>
                Attached herewith are the necessary supporting documents / invitation letters for your kind perusal and approval.
              </p>
            </>
          ) : (
            <>
              <p className="indent-8">
                I am writing to formally request a leave of absence from regular university classes for the period of{" "}
                <span className="font-semibold">{leaveDates}</span> due to {leaveReason}.
              </p>

              <p className="indent-8">
                My current cumulative attendance percentage is{" "}
                <span className="font-bold">{attendancePercent}%</span>, which fulfills the required 75% attendance threshold. I have coordinated with my subject faculty and peers to complete any missed assignments, laboratory recordings, or coursework immediately upon resuming attendance.
              </p>

              <p>
                Kindly consider my request and grant formal leave approval for the stated dates.
              </p>
            </>
          )}
        </div>

        {/* Closing & Signatures */}
        <div className="mt-14 flex justify-between items-end text-sm font-sans">
          <div className="space-y-1">
            <p className="font-semibold">Forwarded By:</p>
            <div className="h-12 flex items-end">
              <span className="font-mono text-xs italic text-slate-500">
                [Faculty Advisor / Mentor Sign]
              </span>
            </div>
            <p className="border-t border-slate-400 pt-1 text-slate-600">Faculty Advisor / Mentor Sign</p>
          </div>

          <div className="space-y-1 text-right">
            <p className="font-semibold">Yours sincerely,</p>
            <div className="h-12 flex items-end justify-end">
              <span className="font-serif italic font-bold text-slate-800 text-base">
                {studentName}
              </span>
            </div>
            <p className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
              ___________________________<br />
              <span className="text-xs font-normal text-slate-600">(Signature of the Student)</span>
            </p>
          </div>
        </div>

        {/* Office Use Section (Dynamically reflects Approved or Not Approved) */}
        <div className="mt-12 border border-dashed border-slate-400 p-5 text-xs font-sans rounded bg-slate-50/50 relative overflow-hidden">
          {/* Stamp Overlay if Approved */}
          {isApproved && (
            <div className="absolute right-6 top-3 rotate-[-8deg] border-2 border-emerald-600 text-emerald-700 px-3 py-1.5 rounded-lg font-mono font-black text-xs uppercase tracking-widest bg-emerald-50/80 shadow-sm flex items-center gap-1.5 pointer-events-none select-none">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{letterType === "od" ? "OD APPROVED" : "LEAVE APPROVED"}</span>
            </div>
          )}

          <p className="font-bold underline mb-3 text-slate-700">For Office / HOD Use Only:</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-semibold">
                Status: [ &nbsp;{isApproved ? "✓" : ""}&nbsp; ] Approved &nbsp;&nbsp;&nbsp; [ &nbsp;{!isApproved ? "✕" : ""}&nbsp; ] Not Approved
              </p>
              <p className="text-slate-600">
                Approval Date: <span className="font-mono">{isApproved ? approvalDate : "____ / ____ / 20__"}</span>
              </p>
            </div>
            <div className="flex justify-between items-center pt-1">
              <p className="text-slate-700">
                <span className="font-semibold">Remarks:</span>{" "}
                {isApproved ? (
                  <span className="font-medium text-emerald-800">
                    {letterType === "od"
                      ? `OD Approved - Attendance > 75% verified. Authorized by ${approverName}.`
                      : `Leave Approved - Verified academic standing. Authorized by ${approverName}.`}
                  </span>
                ) : !isAttendanceEligible ? (
                  <span className="font-medium text-rose-800">
                    Not Approved - Attendance ({attendancePercent}%) is below 75% mandatory threshold.
                  </span>
                ) : (
                  <span className="text-slate-500 italic">
                    Status: Not Approved (Pending Faculty Advisor / HOD Review)
                  </span>
                )}
              </p>
            </div>
            <div className="flex justify-between items-end pt-3">
              <p className="text-slate-500 text-[11px]">
                Authentication Hash: <span className="font-mono">SIST-AUTH-9842-ODX</span>
              </p>
              <p className="font-semibold text-right">
                Signature:{" "}
                <span className="font-serif italic font-bold text-slate-800">
                  {isApproved ? approverName : "_________________"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
