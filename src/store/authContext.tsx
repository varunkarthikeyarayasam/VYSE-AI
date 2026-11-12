import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getCurrentProfile, getCurrentStudent, loginWithEmail, logout as apiLogout } from "../lib/api/auth";
import type { Profile, Student, UserRole } from "../types/database";

export interface DemoStudentAccount {
  registerNumber: string;
  name: string;
  department: string;
  year: number;
  email: string;
  attendance: number;
}

export interface DemoAdminAccount {
  adminNumber: string;
  name: string;
  designation: string;
  email: string;
}

export const DEMO_STUDENT_ACCOUNTS: DemoStudentAccount[] = [
  {
    registerNumber: "RA2311003010452",
    name: "Arjun Kumar",
    department: "Computer Science & Engineering",
    year: 3,
    email: "arjun.kumar@demo.campora.edu",
    attendance: 84,
  },
  {
    registerNumber: "RA2311003010418",
    name: "Divya S",
    department: "Artificial Intelligence & Data Science",
    year: 3,
    email: "divya.s@demo.campora.edu",
    attendance: 91,
  },
  {
    registerNumber: "RA2311003010488",
    name: "Rahul M",
    department: "Information Technology",
    year: 3,
    email: "rahul.m@demo.campora.edu",
    attendance: 68,
  },
];

export const DEMO_ADMIN_ACCOUNTS: DemoAdminAccount[] = [
  {
    adminNumber: "FAC-1042",
    name: "Dr. T. Vino",
    designation: "Associate Professor (CSE) & Digital Logic Lab Lead",
    email: "t.vino@sathyabama.ac.in",
  },
  {
    adminNumber: "FAC-1001",
    name: "Prof. R. Venkatesh",
    designation: "Head of Department (CSE) & Faculty Admin",
    email: "faculty.admin@demo.campora.edu",
  },
  {
    adminNumber: "ADMIN-001",
    name: "Dr. K. Senthil",
    designation: "Dean of Student Affairs & Transport Convener",
    email: "faculty.admin@demo.campora.edu",
  },
];

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  student: Student | null;
  role: UserRole;
  loading: boolean;
  registerNumber: string;
  adminId: string;
  isStudent: boolean;
  isFaculty: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithRegisterNumber: (registerNumber: string, pass: string) => Promise<void>;
  loginWithAdminNumber: (adminNumber: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  quickLogin: (roleKey: "arjun" | "divya" | "rahul" | "faculty") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIdentifier, setActiveIdentifier] = useState<string>("RA2311003010452");

  async function loadUserData() {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        const [userProfile, studentData] = await Promise.all([
          getCurrentProfile(),
          getCurrentStudent(),
        ]);
        setProfile(userProfile);
        setStudent(studentData);
      } else {
        setProfile(null);
        setStudent(null);
      }
    } catch (err) {
      console.error("Auth state loading error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          loadUserData();
        } else {
          setUser(null);
          setProfile(null);
          setStudent(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function login(email: string, pass: string) {
    setLoading(true);
    try {
      await loginWithEmail(email, pass);
      await loadUserData();
    } finally {
      setLoading(false);
    }
  }

  /**
   * Log in a student using their University Register Number
   */
  async function loginWithRegisterNumber(registerNumber: string, pass: string) {
    setLoading(true);
    const regClean = registerNumber.trim().toUpperCase();
    setActiveIdentifier(regClean);

    try {
      // Find matching demo student account
      const matched = DEMO_STUDENT_ACCOUNTS.find(
        (a) => a.registerNumber.toUpperCase() === regClean
      );

      const targetEmail = matched ? matched.email : `${regClean.toLowerCase()}@sathyabama.ac.in`;
      const targetPass = pass || "Campora@123";

      try {
        await loginWithEmail(targetEmail, targetPass);
        await loadUserData();
      } catch (authErr) {
        // Fallback demo profile mock if supabase credentials don't match or network is offline
        console.warn("Supabase auth fallback for student register login:", authErr);
        const demo = matched || {
          registerNumber: regClean,
          name: `Student (${regClean})`,
          department: "Computer Science & Engineering",
          year: 3,
          email: targetEmail,
          attendance: 85,
        };

        const mockProfile: Profile = {
          id: `mock-${regClean}`,
          role: "student",
          full_name: demo.name,
          email: demo.email,
          created_at: new Date().toISOString(),
        };

        const mockStudent: Student = {
          id: `mock-${regClean}`,
          name: demo.name,
          email: demo.email,
          roll_number: demo.registerNumber,
          department: demo.department,
          year: demo.year,
          section: "A",
          home_location: "Tambaram",
          created_at: new Date().toISOString(),
        };

        setUser({ id: mockProfile.id, email: mockProfile.email });
        setProfile(mockProfile);
        setStudent(mockStudent);
      }
    } finally {
      setLoading(false);
    }
  }

  /**
   * Log in faculty/admin using their Admin/Employee Number
   */
  async function loginWithAdminNumber(adminNumber: string, pass: string) {
    setLoading(true);
    const adminClean = adminNumber.trim().toUpperCase();
    setActiveIdentifier(adminClean);

    try {
      const matched = DEMO_ADMIN_ACCOUNTS.find(
        (a) => a.adminNumber.toUpperCase() === adminClean
      );

      const targetEmail = matched ? matched.email : "faculty.admin@demo.campora.edu";
      const targetPass = pass || "Campora@123";

      try {
        await loginWithEmail(targetEmail, targetPass);
        await loadUserData();
      } catch (authErr) {
        console.warn("Supabase auth fallback for admin login:", authErr);
        const demo = matched || {
          adminNumber: adminClean,
          name: `Faculty Admin (${adminClean})`,
          designation: "Faculty Member & Staff Coordinator",
          email: targetEmail,
        };

        const mockProfile: Profile = {
          id: `mock-admin-${adminClean}`,
          role: "faculty",
          full_name: demo.name,
          email: demo.email,
          created_at: new Date().toISOString(),
        };

        setUser({ id: mockProfile.id, email: mockProfile.email });
        setProfile(mockProfile);
        setStudent(null);
      }
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await apiLogout().catch(() => {});
      setUser(null);
      setProfile(null);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  }

  async function quickLogin(roleKey: "arjun" | "divya" | "rahul" | "faculty") {
    if (roleKey === "faculty") {
      await loginWithAdminNumber("FAC-1042", "Campora@123");
      return;
    }

    const regMap: Record<string, string> = {
      arjun: "RA2311003010452",
      divya: "RA2311003010418",
      rahul: "RA2311003010488",
    };
    await loginWithRegisterNumber(regMap[roleKey] || "RA2311003010452", "Campora@123");
  }

  const role: UserRole = profile?.role || "student";
  const isFaculty = role === "faculty" || role === "admin";
  const isStudent = role === "student";

  const registerNumber = student?.roll_number || (isStudent ? activeIdentifier : "");
  const adminId = isFaculty ? activeIdentifier : "";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        student,
        role,
        loading,
        registerNumber,
        adminId,
        isStudent,
        isFaculty,
        login,
        loginWithRegisterNumber,
        loginWithAdminNumber,
        logout,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}