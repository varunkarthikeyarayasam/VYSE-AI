# VYSE — Phase 1 Repository & Supabase Audit

**Project Ref:** `bvwvfmelfozqpuhtbxkk`  
**Region:** `ap-south-1`  
**Live Host:** `db.bvwvfmelfozqpuhtbxkk.supabase.co`  
**Audit Date:** 2026-09-10  
**Status:** Completed against live Supabase project and local repository.

---

## 1. Entity Audit & Schema Action Plan

| Entity | Exists in DB? | Matches VYSE Spec? | Action | Description & Reconciliation |
| :--- | :--- | :--- | :--- | :--- |
| profiles | ❌ No | ❌ Missing | **CREATE** | Central role-aware identity table (id → auth.users.id, ole: student|faculty|admin, ull_name, email, created_at). All user tables FK to profiles.id. Backfilled from uth.users & students. |
| students | ✅ Yes | ⚠️ Partial | **EXTEND** | Keep as student role extension table. Add FK id → profiles(id). Contains oll_number, department, year, section, home_location. |
| faculty | ❌ No | ❌ Missing | **CREATE** | Extension table for faculty (id → profiles(id), department, designation). Seeded with faculty admin. |
| courses | ❌ No | ❌ Missing | **CREATE** | Unified course table (code, 
ame, department, year, semester, credits). Selected over subjects per specification. |
| timetable | ❌ No | ❌ Missing | **CREATE** | Weekly schedule entries (course_id, section, day_of_week, start_time, end_time, oom, aculty_id). |
| attendance | ❌ No | ❌ Missing | **CREATE** | Daily course attendance records (student_id, course_id, date, status: present|absent|od, marked_by). Indexed on (student_id, course_id, date). |
| exams | ❌ No | ❌ Missing | **CREATE** | Assessment registry (course_id, exam_type: cat1|cat2|fat|quiz, exam_date, max_marks). |
| marks | ❌ No | ❌ Missing | **CREATE** | Student grades (student_id, exam_id, marks_obtained, created_at). |
| academic_calendar | ❌ No | ❌ Missing | **CREATE** | Key institutional events and deadlines (	itle, description, event_date, category). |
| events | ✅ Yes | ✅ Matches | **KEEP** | Campus events catalog with status, od_available, event_date, start_time, enue. |
| event_registrations | ✅ Yes | ✅ Matches | **KEEP** | Student registrations for events (student_id, event_id, status: registered|cancelled|attended). |
| od_rules | ❌ No | ❌ Missing | **CREATE** | Deterministic policy configuration table (ule_name, min_attendance_percent: 75, pplicable_event_types text[], max_od_days_per_semester: 3, ctive). check_od_eligibility() reads from this. |
| od_requests | ✅ Yes | ⚠️ Needs extension | **EXTEND** | Add od_rule_id uuid references od_rules(id) and eligibility_snapshot jsonb for complete auditability. |
| bus_routes | ✅ Yes | ✅ Matches | **KEEP** | Regular and temporary route definitions with is_temporary, alid_from, alid_until. |
| bus_stops | ✅ Yes | ✅ Matches | **KEEP** | Route stops with stop_order, rrival_time, coordinates. |
| route_changes | ❌ No | ❌ Missing | **CREATE** | Announcement and audit log for route diversions/delays (oute_id, change_type, description, effective_from, effective_until, created_by). Reuses existing us_routes validity windows. |
| campus_locations | ✅ Yes | ⚠️ Needs extension | **EXTEND** | Add open_time time default '08:00:00', close_time time default '20:00:00', ctive boolean default true. Consolidates campus locations and facilities without duplication. |
| notices | ✅ Yes | ✅ Matches | **KEEP** | Verified campus notices with category, expiration, and source. |
| marketplace_items | ❌ No | ❌ Missing | **CREATE** | Peer-to-peer student marketplace (seller_id → profiles.id, 	itle, description, price, category, status: available|sold|removed, images text[]). |
| notifications | ❌ No | ❌ Missing | **CREATE** | User notification records (user_id → profiles.id, 	itle, ody, category, ead, ction_url). Subscribed via Supabase Realtime with per-user filters. |
| ai_knowledge | ⚠️ Existing as knowledge_documents | ⚠️ Rename / Alias | **RENAME/ALIAS** | Created view/alias i_knowledge pointing to knowledge_documents. Generated search_vector tsvector with GIN index already present; vector extensions omitted to maintain clean, dependency-free full-text search. |
| ai_conversation_sessions | ❌ No | ❌ Missing | **CREATE** | Chat session container (user_id → profiles.id, 	itle, started_at, last_message_at, metadata jsonb). |
| ai_messages | ❌ No | ❌ Missing | **CREATE** | Chat turn history (session_id, ole: user|assistant|tool, content, 	ool_calls jsonb, intent text, entities jsonb). |
| admin_users | ✅ Yes | ⚠️ Legacy | **MIGRATE & KEEP** | Role data migrated into profiles.role. Kept for backward compatibility with existing legacy SQL functions. |

---

## 2. Remote RPC Audit & Actions

| RPC Routine | Current Status in DB | Action | Role & Contract |
| :--- | :--- | :--- | :--- |
| is_admin(uid uuid) | Exists (SQL function) | **EXTEND** | Update to check profiles.role in ('admin','faculty') alongside legacy dmin_users. |
| get_student_context(p_student_id uuid) | Exists (Returns basic student object) | **EXTEND** | Return comprehensive student context: profile, today's timetable, aggregated attendance %, unread notifications count. |
| search_events(p_search_text, p_date_filter) | Exists | **KEEP** | Returns published upcoming events. |
| get_event_details(p_event_id) | Exists | **KEEP** | Fetches full event record. |
| get_student_event_registrations(p_student_id) | Exists | **KEEP** | Returns student's registered events with event metadata. |
| create_od_request(...) | Exists | **EXTEND** | Support od_rule_id and eligibility_snapshot. |
| submit_od_request(p_od_request_id) | Exists | **KEEP** | Transitions draft to submitted. |
| get_student_od_requests(p_student_id) | Exists | **KEEP** | Fetches historical and pending requests for student. |
| eview_od_request(p_od_request_id, p_decision, p_rejection_reason) | Exists | **KEEP** | Admin/faculty review action (pproved / ejected). |
| dmin_list_od_requests(p_status) | Exists | **KEEP** | Administrative queue listing. |
| ind_bus_routes(origin, destination, time) | Exists | **KEEP** | Returns ranked bus routes. |
| get_active_bus_route(p_origin, p_destination) | ❌ Missing | **CREATE** | Deterministic single best route resolver (temporary route prioritized if active). |
| get_campus_location(p_search_text) | Exists | **KEEP** | Searches locations and facilities. |
| search_verified_knowledge(p_search_text) | Exists | **KEEP & OPTIMIZE** | Full-text query against i_knowledge using 	s_rank and 	o_tsvector. |
| get_student_action_context(p_student_id) | Exists | **KEEP** | Pulls upcoming registered events and pending ODs. |
| check_od_eligibility(p_student_id, p_event_id) | ❌ Missing | **CREATE** | **CRITICAL**: Deterministic PL/pgSQL function computing attendance %, event eligibility, rule matching, and returning explainable reasons JSON. |
| prepare_od_request(...) | ❌ Missing | **CREATE** | Consequential step 1: Validates eligibility and returns draft token. |
| confirm_od_request(draft_token) | ❌ Missing | **CREATE** | Consequential step 2: Creates and submits OD request using sealed draft parameters. |
| prepare_event_registration(...) | ❌ Missing | **CREATE** | Consequential step 1: Prepares event registration draft token. |
| confirm_event_registration(draft_token) | ❌ Missing | **CREATE** | Consequential step 2: Executes event registration. |

---

## 3. Remote Edge Function Audit & Actions

| Function Slug | Current State | Action | Reconciliation |
| :--- | :--- | :--- | :--- |
| right-service | Deployed (stub returning CAMPORA AI Engine connected successfully!) | **SUPERSEDED** | Superseded by official yse-ai-tools Edge Function. |
| yse-ai-tools | Not yet deployed | **CREATE & DEPLOY** | Production Edge Function handling tool routing (check_od_eligibility, prepare_od_request, confirm_od_request, search_events, get_active_bus_route, search_verified_knowledge, 	imetable, ttendance, marketplace) with strict envelope validation. |

---

## 4. Storage Buckets Audit

| Bucket | Exists in DB? | Public? | Action |
| :--- | :--- | :--- | :--- |
| od-documents | ❌ No | Private | **CREATE** private bucket with RLS policies restricting read/write to document owner and admins. Access provided strictly via short-lived signed URLs. |

---

## 5. Architectural & Naming Reconciliation Summary

1. **Brand Law**: Product is **VYSE** across all UI components, API clients, and documentation.
2. **Deterministic Rules**: All business logic (OD eligibility, attendance percentages, approval state machines) resides strictly in PostgreSQL SECURITY DEFINER functions.
3. **Identity Model**: Single source of truth profiles table keyed to uth.users.id.
4. **Transport**: us_routes.is_temporary remains the authoritative operational schedule; oute_changes serves as an audit/announcement feed.
5. **Knowledge Search**: GIN index over 	o_tsvector stored search vector satisfies full-text search requirements without external vector engine overhead.