import { useState, useEffect } from "react";
import { HackathonEvent, SATHYABAMA_HACKATHONS } from "../data/sathyabamaEvents";

export interface HackathonRegistration {
  registrationId: string;
  hackathonId: string;
  hackathonTitle: string;
  studentName: string;
  studentRollNo: string;
  studentDepartment: string;
  studentYear: number;
  attendanceAtRegistration: number;
  teamName: string;
  teamSize: number;
  teammateNames?: string[];
  registeredAt: string;
  status: "confirmed" | "waitlist";
}

export interface EligibilityResult {
  eligible: boolean;
  attendancePercent: number;
  thresholdPercent: number;
  reasons: string[];
  criteriaMet: string[];
}

const STORAGE_KEY = "vyse_hackathon_registrations";

const DEFAULT_REGISTRATIONS: HackathonRegistration[] = [
  {
    registrationId: "SAT-HACK-8492",
    hackathonId: "codesprint-2026",
    hackathonTitle: "CodeSprint 2026: 24-Hour National Hackathon",
    studentName: "Arjun Kumar",
    studentRollNo: "RA2311003010452",
    studentDepartment: "Computer Science and Engineering",
    studentYear: 3,
    attendanceAtRegistration: 84.0,
    teamName: "NeuralShadown",
    teamSize: 3,
    teammateNames: ["Divya S", "Karthik R"],
    registeredAt: "2026-09-08 14:32",
    status: "confirmed",
  },
];

function getStoredRegistrations(): HackathonRegistration[] {
  if (typeof window === "undefined") return DEFAULT_REGISTRATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REGISTRATIONS));
      return DEFAULT_REGISTRATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse hackathon registrations from storage:", e);
    return DEFAULT_REGISTRATIONS;
  }
}

function saveStoredRegistrations(data: HackathonRegistration[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save hackathon registrations to storage:", e);
  }
}

/**
 * Standalone deterministic eligibility evaluator for any hackathon event
 */
export function evaluateEligibility(
  hackathon: HackathonEvent,
  attendance: number = 84.0,
  year: number = 2,
  department: string = "Computer Science and Engineering"
): EligibilityResult {
  const reasons: string[] = [];
  const criteriaMet: string[] = [];
  let eligible = true;

  // 1. Attendance Check
  if (attendance < hackathon.minAttendanceRequired) {
    eligible = false;
    reasons.push(
      `Attendance ${attendance.toFixed(1)}% is below the required ${hackathon.minAttendanceRequired}% threshold`
    );
  } else {
    criteriaMet.push(
      `Attendance verified: ${attendance.toFixed(1)}% (Threshold: ${hackathon.minAttendanceRequired}%)`
    );
  }

  // 2. Academic Year Check
  if (!hackathon.allowedYears.includes(year)) {
    eligible = false;
    reasons.push(
      `Restricted to Year ${hackathon.allowedYears.join(", ")} students (Current: Year ${year})`
    );
  } else {
    criteriaMet.push(`Academic Standing: Eligible for Year ${year}`);
  }

  // 3. Department Check (if specified)
  if (hackathon.allowedDepartments && hackathon.allowedDepartments.length > 0) {
    const matchesDept = hackathon.allowedDepartments.some((d) =>
      department.toLowerCase().includes(d.toLowerCase())
    );
    if (!matchesDept) {
      eligible = false;
      reasons.push(`Targeted to ${hackathon.allowedDepartments.join(", ")} students`);
    } else {
      criteriaMet.push(`Department verified (${department})`);
    }
  }

  // 4. Special Prerequisite Check
  if (hackathon.prerequisiteRule) {
    if (hackathon.id === "cybersentinel-ctf" && attendance < 80) {
      eligible = false;
      reasons.push(`Requires >= 80% attendance or verified CS402 Security Elective completion`);
    } else {
      criteriaMet.push(`Prerequisite Status: Cleared (${hackathon.prerequisiteRule})`);
    }
  }

  if (eligible && reasons.length === 0) {
    reasons.push("All institutional & event prerequisites satisfied");
  }

  return {
    eligible,
    attendancePercent: attendance,
    thresholdPercent: hackathon.minAttendanceRequired,
    reasons,
    criteriaMet,
  };
}

export function useHackathonStore() {
  const [registrations, setRegistrations] = useState<HackathonRegistration[]>(getStoredRegistrations);

  useEffect(() => {
    const handleSync = () => {
      setRegistrations(getStoredRegistrations());
    };
    window.addEventListener("vyse-hackathon-updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("vyse-hackathon-updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const notify = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("vyse-hackathon-updated"));
    }
  };

  const registerForHackathon = (
    hackathonId: string,
    student: {
      name: string;
      rollNumber: string;
      department: string;
      year: number;
      attendance: number;
    },
    teamDetails: {
      teamName: string;
      teamSize: number;
      teammates?: string[];
    }
  ): HackathonRegistration => {
    const hackathon = SATHYABAMA_HACKATHONS.find((h) => h.id === hackathonId);
    const regId = `SAT-HACK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReg: HackathonRegistration = {
      registrationId: regId,
      hackathonId,
      hackathonTitle: hackathon?.title || "Sathyabama Hackathon",
      studentName: student.name,
      studentRollNo: student.rollNumber,
      studentDepartment: student.department,
      studentYear: student.year,
      attendanceAtRegistration: student.attendance,
      teamName: teamDetails.teamName || `${student.name.split(" ")[0]}'s Team`,
      teamSize: teamDetails.teamSize || 1,
      teammateNames: teamDetails.teammates || [],
      registeredAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      status: "confirmed",
    };

    const updated = [
      ...registrations.filter(
        (r) =>
          !(
            r.hackathonId === hackathonId &&
            r.studentRollNo.toUpperCase() === student.rollNumber.toUpperCase()
          )
      ),
      newReg,
    ];

    saveStoredRegistrations(updated);
    setRegistrations(updated);
    notify();

    return newReg;
  };

  const isStudentRegistered = (hackathonId: string, rollNumber: string): boolean => {
    const clean = rollNumber.trim().toUpperCase();
    return registrations.some(
      (r) => r.hackathonId === hackathonId && r.studentRollNo.toUpperCase() === clean
    );
  };

  const getStudentRegistrations = (rollNumber: string): HackathonRegistration[] => {
    const clean = rollNumber.trim().toUpperCase();
    return registrations.filter(
      (r) => r.studentRollNo.toUpperCase() === clean
    );
  };

  return {
    hackathons: SATHYABAMA_HACKATHONS,
    registrations,
    registerForHackathon,
    isStudentRegistered,
    getStudentRegistrations,
    evaluateEligibility: (
      hackathon: HackathonEvent,
      student: { attendance?: number; year?: number; department?: string }
    ) =>
      evaluateEligibility(
        hackathon,
        student.attendance ?? 84.0,
        student.year ?? 2,
        student.department ?? "Computer Science and Engineering"
      ),
  };
}
