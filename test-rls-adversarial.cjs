const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://bvwvfmelfozqpuhtbxkk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2d3ZmbWVsZm96cXB1aHRieGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMjA1NDEsImV4cCI6MjEwNDU5NjU0MX0.Er1l5XLXNwt95wNTVAM5wpKH13lceHJ1jUo4y_1ZGiM";

async function runAdversarialRLSTests() {
  console.log("=================================================================");
  console.log("VYSE ADVERSARIAL RLS & SECURITY TEST SUITE");
  console.log("=================================================================");

  // Create Student A (Arjun) and Student B (Divya)
  const studentAClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: authA } = await studentAClient.auth.signInWithPassword({
    email: "arjun.kumar@demo.campora.edu",
    password: "Campora@123",
  });
  const studentAId = authA.user.id;

  const studentBClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: authB } = await studentBClient.auth.signInWithPassword({
    email: "divya.s@demo.campora.edu",
    password: "Campora@123",
  });
  const studentBId = authB.user.id;

  console.log("Student A (Arjun):", studentAId);
  console.log("Student B (Divya):", studentBId);

  // --------------------------------------------------------------------------
  // TEST 1: Student A attempts to read Student B's Attendance
  // --------------------------------------------------------------------------
  console.log("\n[ADVERSARIAL 1] Student A attempts to select Student B's attendance...");
  const { data: leakAttendance, error: errAtt } = await studentAClient
    .from("attendance")
    .select("*")
    .eq("student_id", studentBId);
  console.log("Rows returned to Student A for Student B's attendance:", leakAttendance?.length);
  if (leakAttendance && leakAttendance.length > 0) {
    throw new Error("SECURITY BREACH: Student A was able to view Student B's attendance!");
  }
  console.log("✓ BLOCKED: 0 rows returned (RLS correctly isolated attendance).");

  // --------------------------------------------------------------------------
  // TEST 2: Student A attempts to read Student B's OD Requests
  // --------------------------------------------------------------------------
  console.log("\n[ADVERSARIAL 2] Student A attempts to select Student B's OD requests...");
  const { data: leakOd } = await studentAClient
    .from("od_requests")
    .select("*")
    .eq("student_id", studentBId);
  console.log("Rows returned to Student A for Student B's OD requests:", leakOd?.length);
  if (leakOd && leakOd.length > 0) {
    throw new Error("SECURITY BREACH: Student A was able to view Student B's OD requests!");
  }
  console.log("✓ BLOCKED: 0 rows returned (RLS correctly isolated OD requests).");

  // --------------------------------------------------------------------------
  // TEST 3: Student A attempts to read Student B's Notifications
  // --------------------------------------------------------------------------
  console.log("\n[ADVERSARIAL 3] Student A attempts to read Student B's notifications...");
  const { data: leakNotifs } = await studentAClient
    .from("notifications")
    .select("*")
    .eq("user_id", studentBId);
  console.log("Rows returned to Student A for Student B's notifications:", leakNotifs?.length);
  if (leakNotifs && leakNotifs.length > 0) {
    throw new Error("SECURITY BREACH: Student A was able to view Student B's notifications!");
  }
  console.log("✓ BLOCKED: 0 rows returned (RLS correctly isolated notifications).");

  // --------------------------------------------------------------------------
  // TEST 4: Student A attempts to call review_od_request (Faculty Only)
  // --------------------------------------------------------------------------
  console.log("\n[ADVERSARIAL 4] Student A attempts to call review_od_request RPC...");
  const { data: reviewRes, error: reviewErr } = await studentAClient.rpc("review_od_request", {
    p_od_request_id: "00000000-0000-0000-0000-000000000000",
    p_decision: "approved",
  });
  if (!reviewErr || !reviewErr.message.includes("FORBIDDEN")) {
    throw new Error("SECURITY BREACH: Non-admin student was not rejected with FORBIDDEN on review_od_request!");
  }
  console.log("✓ BLOCKED: RPC rejected student with exception:", reviewErr.message);

  // --------------------------------------------------------------------------
  // TEST 5: Student A attempts to write to od_rules (Policy Configuration)
  // --------------------------------------------------------------------------
  console.log("\n[ADVERSARIAL 5] Student A attempts to insert a malicious row into od_rules...");
  const { data: malRule, error: ruleErr } = await studentAClient
    .from("od_rules")
    .insert({
      rule_name: "Hacked Rule",
      min_attendance_percent: 10.0,
    })
    .select();
  if (!ruleErr) {
    throw new Error("SECURITY BREACH: Student was able to insert a row into od_rules!");
  }
  console.log("✓ BLOCKED: RLS policy prevented student from modifying od_rules:", ruleErr.message);

  // --------------------------------------------------------------------------
  // TEST 6: Student A attempts to insert into bus_routes (Transport Configuration)
  // --------------------------------------------------------------------------
  console.log("\n[ADVERSARIAL 6] Student A attempts to insert into bus_routes...");
  const { data: malRoute, error: busErr } = await studentAClient
    .from("bus_routes")
    .insert({
      route_name: "Illegal Route",
      origin: "Anywhere",
      destination: "Campus",
    })
    .select();
  if (!busErr) {
    throw new Error("SECURITY BREACH: Student was able to insert a route into bus_routes!");
  }
  console.log("✓ BLOCKED: RLS policy prevented student from modifying bus_routes:", busErr.message);

  // --------------------------------------------------------------------------
  // TEST 7: Anonymous (Logged Out) Access Scope
  // --------------------------------------------------------------------------
  console.log("\n[ADVERSARIAL 7] Testing anonymous unauthenticated client permissions...");
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 7a. Public published events should be readable
  const { data: pubEvents, error: pubEventsErr } = await anonClient
    .from("events")
    .select("id, title, status");
  if (pubEventsErr || !pubEvents || pubEvents.length === 0) {
    throw new Error("Anon client should be able to view published events!");
  }
  console.log("✓ ALLOWED: Anonymous client successfully read " + pubEvents.length + " published events.");

  // 7b. Verified campus notices should be readable
  const { data: pubNotices, error: pubNoticesErr } = await anonClient
    .from("notices")
    .select("id, title, verified");
  if (pubNoticesErr || !pubNotices || pubNotices.length === 0) {
    throw new Error("Anon client should be able to view verified notices!");
  }
  console.log("✓ ALLOWED: Anonymous client successfully read " + pubNotices.length + " verified notices.");

  // 7c. Private student attendance must NOT be readable by anon
  const { data: anonAtt } = await anonClient.from("attendance").select("*");
  console.log("Rows returned to anonymous user for attendance:", anonAtt?.length);
  if (anonAtt && anonAtt.length > 0) {
    throw new Error("SECURITY BREACH: Anonymous user was able to view private student attendance!");
  }
  console.log("✓ BLOCKED: 0 rows returned to anon for attendance.");

  // 7d. Private student OD requests must NOT be readable by anon
  const { data: anonOds } = await anonClient.from("od_requests").select("*");
  console.log("Rows returned to anonymous user for od_requests:", anonOds?.length);
  if (anonOds && anonOds.length > 0) {
    throw new Error("SECURITY BREACH: Anonymous user was able to view private OD requests!");
  }
  console.log("✓ BLOCKED: 0 rows returned to anon for od_requests.");

  console.log("\n=================================================================");
  console.log(">>> ALL 7 ADVERSARIAL SECURITY CHECKS PASSED WITH 100% SUCCESS <<<");
  console.log("=================================================================");
}

runAdversarialRLSTests().catch(err => {
  console.error("\n❌ ADVERSARIAL TEST FAILED:", err);
  process.exit(1);
});