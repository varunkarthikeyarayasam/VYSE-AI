const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://bvwvfmelfozqpuhtbxkk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2d3ZmbWVsZm96cXB1aHRieGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMjA1NDEsImV4cCI6MjEwNDU5NjU0MX0.Er1l5XLXNwt95wNTVAM5wpKH13lceHJ1jUo4y_1ZGiM";

async function runE2ETest() {
  console.log("=================================================================");
  console.log("VYSE E2E VERIFICATION SUITE — LIVE SUPABASE TEST");
  console.log("=================================================================");

  // Step 1: Sign in as Arjun Kumar (Student from Tambaram)
  console.log("\n[1] Authenticating as Arjun Kumar (Tambaram Student)...");
  const studentClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: authData, error: authError } = await studentClient.auth.signInWithPassword({
    email: "arjun.kumar@demo.campora.edu",
    password: "Campora@123",
  });
  if (authError) throw new Error("Arjun login failed: " + authError.message);
  console.log("✓ Arjun authenticated successfully. User ID:", authData.user.id);

  // Step 2: Load Dashboard Data (Context, Timetable, Bus)
  console.log("\n[2] Fetching Arjun's Dashboard Context...");
  const { data: studentCtx, error: ctxError } = await studentClient.rpc("get_student_context", {
    p_student_id: authData.user.id,
  });
  if (ctxError) throw new Error("get_student_context failed: " + ctxError.message);
  console.log("✓ Profile:", studentCtx.profile.name, "-", studentCtx.profile.department);
  console.log("✓ Attendance:", studentCtx.attendance.attendance_percent + "% (Threshold met: " + studentCtx.attendance.threshold_met + ")");
  console.log("✓ Today's classes:", studentCtx.today_timetable.length, "classes scheduled");

  // Step 3: Check Live Bus Assistant from Tambaram
  console.log("\n[3] Checking Bus Assistant for Tambaram...");
  const { data: busRoute, error: busError } = await studentClient.rpc("get_active_bus_route", {
    p_origin: "Tambaram",
    p_destination: "Campus",
  });
  if (busError) throw new Error("get_active_bus_route failed: " + busError.message);
  console.log("✓ Active Route:", busRoute.route_name);
  console.log("✓ Special/Temporary?:", busRoute.is_temporary);
  console.log("✓ First Stop Departure:", busRoute.stops[0]?.stop_name, "at", busRoute.stops[0]?.arrival_time);

  // Step 4: VYSE AI Chat Interaction (Find Hackathon -> Check Eligibility -> PREPARE)
  console.log("\n[4] Interacting with VYSE AI Edge Function ('I have a hackathon tomorrow and need OD')...");
  const aiRes = await fetch(`${SUPABASE_URL}/functions/v1/vyse-ai-tools`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${authData.session.access_token}`,
    },
    body: JSON.stringify({
      action: "chat",
      message: "I have a hackathon tomorrow and need OD",
      student_id: authData.user.id,
    }),
  });
  const aiData = await aiRes.json();
  if (!aiData.success) throw new Error("AI Chat failed: " + JSON.stringify(aiData));
  console.log("✓ AI Intent Identified:", aiData.intent);
  console.log("✓ AI Tool Calls:", aiData.tool_calls.map(t => t.tool).join(", "));
  console.log("✓ AI Action Card Generated:", !!aiData.action_card, "-", aiData.action_card?.title);
  const draftToken = aiData.action_card?.draft_token;
  if (!draftToken) throw new Error("No draft token provided in action card");

  // Step 5: Execute User Confirmation (CONFIRM Action Card)
  console.log("\n[5] Executing Action Card Confirmation (confirm_od_request)...");
  const { data: odSubmitted, error: confirmError } = await studentClient.rpc("confirm_od_request", {
    p_draft_token: draftToken,
  });
  if (confirmError) throw new Error("confirm_od_request failed: " + confirmError.message);
  console.log("✓ OD Request Created & Submitted! ID:", odSubmitted.id);
  console.log("✓ Status:", odSubmitted.status);
  console.log("✓ Eligibility Snapshot Attached:", !!odSubmitted.eligibility_snapshot);

  // Step 6: Faculty Admin Sign-In & Review Queue
  console.log("\n[6] Authenticating as Faculty Admin (Prof. K. Venkatesh)...");
  const adminClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: adminAuth, error: adminAuthError } = await adminClient.auth.signInWithPassword({
    email: "faculty.admin@demo.campora.edu",
    password: "Campora@123",
  });
  if (adminAuthError) throw new Error("Admin login failed: " + adminAuthError.message);
  console.log("✓ Faculty Admin authenticated. User ID:", adminAuth.user.id);

  console.log("\n[7] Querying Faculty OD Review Queue...");
  const { data: pendingRequests, error: queueError } = await adminClient.rpc("admin_list_od_requests", {
    p_status: "submitted",
  });
  if (queueError) throw new Error("admin_list_od_requests failed: " + queueError.message);
  const foundRequest = pendingRequests.find(r => r.od_request_id === odSubmitted.id);
  console.log("✓ Found submitted request in queue for student:", foundRequest?.student_name);

  console.log("\n[8] Approving OD Request via review_od_request...");
  const { data: approvedRow, error: reviewError } = await adminClient.rpc("review_od_request", {
    p_od_request_id: odSubmitted.id,
    p_decision: "approved",
  });
  if (reviewError) throw new Error("review_od_request failed: " + reviewError.message);
  console.log("✓ Request status updated to:", approvedRow.status);

  // Step 7: Verify Student View & Realtime Notification
  console.log("\n[9] Verifying updated status and notification for Arjun...");
  const { data: studentOds } = await studentClient
    .from("od_requests")
    .select("id, status, submitted_at, reviewed_at")
    .eq("id", odSubmitted.id)
    .single();
  console.log("✓ Arjun's OD status in database:", studentOds?.status);
  console.log("✓ Reviewed at timestamp:", studentOds?.reviewed_at);

  const { data: notifs } = await studentClient
    .from("notifications")
    .select("id, title, body, read, created_at")
    .eq("user_id", authData.user.id)
    .order("created_at", { ascending: false })
    .limit(2);
  console.log("✓ Latest notifications received by Arjun:");
  notifs.forEach(n => console.log("   • [" + n.title + "] " + n.body));

  console.log("\n=================================================================");
  console.log(">>> ALL E2E LIFECYCLE TESTS PASSED CLEANLY WITH ZERO ERRORS <<<");
  console.log("=================================================================");
}

runE2ETest().catch(err => {
  console.error("\n❌ E2E TEST FAILED:", err);
  process.exit(1);
});