# VYSE — Final Autonomous Deliverable Report

**Platform Name:** VYSE (AI Smart Campus Platform)  
**Supabase Project Ref:** `bvwvfmelfozqpuhtbxkk`  
**Host:** `https://bvwvfmelfozqpuhtbxkk.supabase.co`  
**Delivery Date:** 2026-09-10  
**Status:** Complete, Verified, Zero Mock Data, Production-Grade  

---

## 1. Phase-by-Phase Implementation Summary

### Phase 1: Repository & Live Supabase Audit
- Verified local repository (`C:\Users\Laukik\Shadown_Coders`) and its link to Supabase project `bvwvfmelfozqpuhtbxkk`.
- Queried remote database tables, columns, routines, functions, and Edge Functions.
- Resolved GoTrue demo account schema null token constraints for `faculty.admin@demo.campora.edu`, `divya.s@demo.campora.edu`, and `rahul.m@demo.campora.edu`.
- Established `docs/AUDIT.md` mapping entities, RPC actions, Edge Functions, and naming reconciliations.

### Phase 2: Database Schema, Deterministic RPCs & Zero-Trust RLS
- Applied migrations `005_vyse_schema.sql`, `006_vyse_rls.sql`, `007_vyse_functions.sql`, `008_vyse_seed.sql`, and `009_fts_knowledge.sql` to live database.
- Implemented `profiles` single role-aware identity table and `faculty` extension.
- Built unified academic entities: `courses`, `timetable`, `attendance`, `exams`, `marks`, `academic_calendar`.
- Implemented `od_rules` deterministic policy engine and extended `od_requests` with `od_rule_id` and `eligibility_snapshot`.
- Implemented `route_changes`, extended `campus_locations` with operating hours, added `marketplace_items` and `notifications` (enabled on `supabase_realtime`).
- Activated zero-trust RLS across all 24 public tables.
- Wrote pure PL/pgSQL deterministic RPCs: `check_od_eligibility`, `prepare_od_request`, `confirm_od_request`, `prepare_event_registration`, `confirm_event_registration`, `get_active_bus_route`, and extended `get_student_context`.

### Phase 3: VYSE AI & RAG Architecture
- Deployed Edge Function `vyse-ai-tools` via Supabase Management API.
- Implemented strict tool router for discrete tool calls with uniform `{ success, data, source }` envelopes.
- Implemented conversational orchestrator with natural language intent recognition (`od_request`, `bus_inquiry`, `timetable_inquiry`, `attendance_inquiry`, `campus_knowledge`).
- Enforced **PREPARE → SHOW → CONFIRM → EXECUTE** lifecycle: AI proposes drafts and returns sealed `draft_token` action cards; user must click Confirm to execute submissions.
- Integrated full-text search against `ai_knowledge` using PostgreSQL `to_tsvector`, `websearch_to_tsquery`, and `ts_rank` with verified citations.
- Built session memory with `ai_conversation_sessions` and `ai_messages`.

### Phase 4: Modern Obsidian Frontend Application
- Scaffolded modern React 19 + TypeScript + Vite + Tailwind CSS frontend with dark obsidian theme (`#090B10`, `#11141E`, `#1A2030`, borders `#212738`, glowing accents).
- Created typed API layer (`src/lib/api/`) wrapping every database RPC and Edge Function call with zero mock data.
- Built Role-Gated Auth provider with quick-login personas for Arjun (Student), Divya, and Faculty Admin.
- Built interactive modules:
  - **Dashboard**: Today's timetable, 75% attendance gauge, verified notices carousel, live bus card.
  - **VYSE Chat**: Drawer & fullscreen modes, live tool stream status, citations, interactive PREPARE action cards.
  - **OD System**: Event selector, live pre-submission eligibility check, smart form, private signed-url uploads to `od-documents` storage bucket, status timeline.
  - **Bus Assistant**: Route lookup from Tambaram, special event-day schedule banner, arrival timelines.
  - **Campus & Map**: Facilities directory with open/close times, academic calendar.
  - **Marketplace**: P2P student listings with post item modal.
  - **Realtime Notifications**: User-scoped live notifications.
  - **Faculty Admin Dashboard**: Role-guarded OD review queue with approve and reject actions.

### Phase 5: Verification & Security Audit
- Verified `npm run build` and `tsc` with zero errors.
- Executed automated E2E lifecycle script `test-e2e.cjs` covering student login, timetable lookup, bus resolution, AI chat, eligibility check, action card confirmation, admin queue approval, and notification dispatch.
- Executed automated adversarial RLS script `test-rls-adversarial.cjs` verifying 100% student data isolation and unprivileged RPC rejection.

---

## 2. Files Created & Modified

### Database Migrations (`supabase/migrations/`)
- `005_vyse_schema.sql`: Core unified tables (`profiles`, `faculty`, `courses`, `timetable`, `attendance`, `exams`, `marks`, `academic_calendar`, `od_rules`, `route_changes`, `marketplace_items`, `notifications`, `ai_conversation_sessions`, `ai_messages`, private bucket `od-documents`).
- `006_vyse_rls.sql`: Zero-trust Row-Level Security policies and role helpers (`is_admin`, `has_role`).
- `007_vyse_functions.sql`: Deterministic business logic and two-step action RPCs (`check_od_eligibility`, `prepare_od_request`, `confirm_od_request`, etc.).
- `008_vyse_seed.sql`: Realistic courses, section B timetable, historical attendance records yielding 90.7% attendance, OD rules, and marketplace items.
- `009_fts_knowledge.sql`: GIN-indexed full-text search function `search_verified_knowledge` utilizing `websearch_to_tsquery` and `ts_rank`.

### Edge Functions (`supabase/functions/`)
- `supabase/functions/vyse-ai-tools/index.ts`: Deployed production edge function providing discrete tool routing, conversational intent parsing, PREPARE action card generation, and conversation memory.

### Frontend Application (`src/`)
- `package.json`: Vite, React 19, Tailwind CSS, Motion, Lucide icons, Supabase client.
- `vite.config.ts` & `tsconfig.json`: Modern build and bundling configurations.
- `index.html`: Obsidian root container and typography.
- `src/index.css`: Obsidian design tokens, glassmorphism card styles, and custom scrollbars.
- `src/main.tsx`: React root mounting `AuthProvider` and `App`.
- `src/app/App.tsx`: Master layout with responsive sidebar, top navbar, tab routing, and integrated AI drawer.
- `src/types/database.ts`: Strong typing for all Supabase entities, RPC contracts, and action cards.
- `src/lib/supabase.ts`: Typed Supabase client utilizing anon key.
- `src/lib/api/auth.ts`: Authentication and profile queries.
- `src/lib/api/academics.ts`: Timetable, courses, attendance, and student context.
- `src/lib/api/events.ts`: Event catalog and event registrations.
- `src/lib/api/od.ts`: OD eligibility checks, preparation, confirmation, review, and file upload.
- `src/lib/api/transport.ts`: Active and regular bus routes, route changes.
- `src/lib/api/campus.ts`: Locations, operational hours, academic calendar, notices.
- `src/lib/api/marketplace.ts`: P2P items and listings.
- `src/lib/api/notifications.ts`: Notification fetch, read updates, and Supabase Realtime subscriptions.
- `src/lib/api/ai.ts`: Typed client wrapper for `vyse-ai-tools` Edge Function.
- `src/store/authContext.tsx`: Role-based authentication state and one-click demo logins.
- `src/components/ui/index.tsx`: Reusable Button, Card, Badge, and Modal design primitives.
- `src/components/features/chat/VyseChatDrawer.tsx`: AI drawer & fullscreen interface with PREPARE action cards.
- `src/components/features/od/OdManager.tsx`: OD request management with live eligibility verification.
- `src/components/features/transport/BusAssistant.tsx`: Realtime bus transit viewer with event schedule banner.
- `src/components/features/academics/AcademicsView.tsx`: Timetable grid and 75% attendance threshold gauge.
- `src/components/features/campus/CampusView.tsx`: Facility hours and academic calendar.
- `src/components/features/marketplace/MarketplaceView.tsx`: Peer-to-peer campus marketplace.
- `src/components/features/notifications/NotificationBell.tsx`: Realtime notification bell dropdown.
- `src/components/features/admin/AdminDashboard.tsx`: Faculty authorization and OD review queue.
- `src/components/features/dashboard/StudentDashboard.tsx`: Hero overview, timetable widget, and transit cards.
- `src/components/features/auth/AuthScreen.tsx`: Persona-driven login screen.

### Tests & Documentation
- `docs/AUDIT.md`: Complete database and repository audit report.
- `test-e2e.cjs`: Automated end-to-end user journey test suite.
- `test-rls-adversarial.cjs`: Automated 7-point security and RLS penetration test suite.
- `docs/DELIVERY_REPORT.md`: This comprehensive deliverable documentation.

---

## 3. Final Database Table Registry

| Table Name | Purpose |
| :--- | :--- |
| `profiles` | Authoritative role-aware identity table (`student`, `faculty`, `admin`) linked to `auth.users`. |
| `students` | Student demographic extension table (roll number, department, year, section, home location). |
| `faculty` | Faculty department and academic designation details. |
| `courses` | Catalog of academic subjects, departments, semester designations, and credit values. |
| `timetable` | Weekly course schedule entries mapping section, day of week, time window, room, and instructor. |
| `attendance` | Daily course session attendance records (`present`, `absent`, `od`) with faculty marker tracking. |
| `exams` | Assessment registry defining exam formats (`cat1`, `cat2`, `fat`, `quiz`), dates, and maximum marks. |
| `marks` | Student evaluation scores for specific academic examinations. |
| `academic_calendar` | Institutional calendar of instructional days, exams, events, and holidays. |
| `events` | Campus event catalog with published status, dates, venues, and OD eligibility flags. |
| `event_registrations` | Student registration records for campus events. |
| `od_rules` | Deterministic policy configuration table defining minimum attendance % and semester allowances. |
| `od_requests` | Formal student On-Duty leave applications with attached eligibility snapshot and review history. |
| `bus_routes` | Regular and temporary campus transit routes with validity windows. |
| `bus_stops` | Intermediate stops, coordinates, and scheduled arrival timings for each transit route. |
| `route_changes` | Transport announcement and audit feed for delays, cancellations, and temporary diversions. |
| `campus_locations` | Physical facility directory containing building, floor, type, and operating hours. |
| `notices` | Official verified institutional notifications and announcements. |
| `marketplace_items` | Student peer-to-peer marketplace listings for books, electronics, and supplies. |
| `notifications` | User notification inbox records subscribed via Supabase Realtime. |
| `ai_knowledge` | View aliasing verified institutional documents for full-text RAG search. |
| `ai_conversation_sessions` | AI chat session containers tracking start time and metadata. |
| `ai_messages` | Conversation history turns tracking roles, intent, extracted entities, and tool executions. |
| `admin_users` | Legacy admin table maintained for backwards compatibility alongside `profiles.role`. |

---

## 4. Row-Level Security (RLS) Policy Summary

| Table | Permitted Operations | Access Rule / Policy Logic |
| :--- | :--- | :--- |
| `profiles` | SELECT, UPDATE, INSERT | Authenticated users can view all profiles; users can update only their own profile; admins have full rights. |
| `faculty` | SELECT, ALL | Anyone can view faculty directory; only admins can modify faculty assignments. |
| `courses` | SELECT, ALL | Public read; admin/faculty write. |
| `timetable` | SELECT, ALL | Public read; admin/faculty write. |
| `attendance` | SELECT, INSERT, UPDATE | **Strict Isolation**: Students can select only their own records (`student_id = auth.uid()`); faculty can insert/update for classes they teach. |
| `exams` | SELECT, ALL | Public read; admin/faculty write. |
| `marks` | SELECT, ALL | **Strict Isolation**: Students can select only their own marks; admin/faculty have manage rights. |
| `academic_calendar`| SELECT, ALL | Public read; admin write. |
| `events` | SELECT, ALL | Published events are readable by anyone; admin has full manage rights. |
| `event_registrations`| SELECT, INSERT, UPDATE| Students view and insert only their own registrations; students can cancel their own registrations. |
| `od_rules` | SELECT, ALL | Active rules readable by all authenticated users; admin write only. |
| `od_requests` | SELECT, INSERT, UPDATE| **Strict Isolation**: Students can select and insert only their own requests; admins/faculty have review rights. |
| `bus_routes` | SELECT, ALL | Active routes are readable by all; admin write only. |
| `bus_stops` | SELECT, ALL | Readable by all; admin write only. |
| `route_changes` | SELECT, ALL | Readable by all; admin write only. |
| `campus_locations`| SELECT, ALL | Readable by all; admin write only. |
| `notices` | SELECT, ALL | Verified, non-expired notices readable by all; admin write only. |
| `marketplace_items`| SELECT, INSERT, UPDATE, DELETE| Available items readable by all; only the `seller_id` can modify/delete their listings. |
| `notifications` | SELECT, UPDATE, INSERT| **Strict Isolation**: Users can select and update only notifications where `user_id = auth.uid()`. |
| `ai_conversation_sessions`| ALL | **Strict Isolation**: Users can select and modify only sessions where `user_id = auth.uid()`. |
| `ai_messages` | ALL | **Strict Isolation**: Users can select and insert only messages belonging to their sessions. |
| `storage.objects` (`od-documents`)| SELECT, INSERT | Uploads restricted to user's folder (`(storage.foldername(name))[1] = auth.uid()`); downloads restricted to owner or admin. |

---

## 5. PostgreSQL RPC Routine Signatures

```sql
-- 1. Deterministic OD Eligibility
FUNCTION check_od_eligibility(p_student_id uuid, p_event_id uuid)
RETURNS json
SECURITY DEFINER;

-- 2. Consequential OD Request Preparation
FUNCTION prepare_od_request(p_student_id uuid, p_event_id uuid, p_reason text, p_from_date date, p_to_date date, p_document_url text DEFAULT null)
RETURNS json
SECURITY DEFINER;

-- 3. Consequential OD Request Execution
FUNCTION confirm_od_request(p_draft_token text)
RETURNS od_requests
SECURITY DEFINER;

-- 4. Consequential Event Registration Preparation
FUNCTION prepare_event_registration(p_student_id uuid, p_event_id uuid)
RETURNS json
SECURITY DEFINER;

-- 5. Consequential Event Registration Execution
FUNCTION confirm_event_registration(p_draft_token text)
RETURNS event_registrations
SECURITY DEFINER;

-- 6. Deterministic Active Bus Route Selection
FUNCTION get_active_bus_route(p_origin text, p_destination text DEFAULT 'Campus')
RETURNS json
STABLE SECURITY INVOKER;

-- 7. Full Context Assembly
FUNCTION get_student_context(p_student_id uuid)
RETURNS json
SECURITY DEFINER;

-- 8. Full-Text Search Over Institutional Knowledge
FUNCTION search_verified_knowledge(p_search_text text)
RETURNS TABLE (id uuid, title text, content text, category text, source text, verified boolean, updated_at timestamptz, rank real)
STABLE SECURITY INVOKER;

-- 9. Faculty Review Action
FUNCTION review_od_request(p_od_request_id uuid, p_decision text, p_rejection_reason text DEFAULT null)
RETURNS od_requests
SECURITY DEFINER;

-- 10. Administrative OD Queue Listing
FUNCTION admin_list_od_requests(p_status text DEFAULT null)
RETURNS TABLE (od_request_id uuid, student_id uuid, student_name text, roll_number text, event_id uuid, event_title text, reason text, from_date date, to_date date, status text, submitted_at timestamptz)
SECURITY DEFINER;
```

---

## 6. Edge Function Tool Layer: `vyse-ai-tools`

**Endpoint:** `POST https://bvwvfmelfozqpuhtbxkk.supabase.co/functions/v1/vyse-ai-tools`  
**Authentication:** Pass `apikey` and `Authorization: Bearer <JWT_OR_ANON_KEY>` in headers.

### High-Level Chat Mode
- **Payload:** `{ "action": "chat", "message": "I have a hackathon tomorrow and need OD", "student_id": "<uuid>" }`
- **Response:**
  ```json
  {
    "success": true,
    "session_id": "8fa2409c-...",
    "intent": "od_request",
    "entities": { "event": "Code Sprint 24-Hour Hackathon" },
    "reply": "You are eligible for On-Duty (OD) leave for **Code Sprint 24-Hour Hackathon**!...",
    "tool_calls": [
      { "tool": "search_events", "status": "completed" },
      { "tool": "check_od_eligibility", "status": "completed" },
      { "tool": "prepare_od_request", "status": "completed" }
    ],
    "action_card": {
      "type": "action_card",
      "action": "confirm_od_request",
      "draft_token": "eyJzdHVkZW50X2lkIjoiMTExMS4uLiJ9",
      "title": "Submit OD Request: Code Sprint 24-Hour Hackathon",
      "event_title": "Code Sprint 24-Hour Hackathon",
      "event_date": "2026-09-11",
      "attendance_percent": 90.7,
      "status": "READY_FOR_CONFIRMATION"
    }
  }
  ```

### Discrete Tool Calls
- `check_od_eligibility`: `{ "tool": "check_od_eligibility", "params": { "student_id": "...", "event_id": "..." } }`
- `prepare_od_request`: `{ "tool": "prepare_od_request", "params": { "student_id": "...", "event_id": "...", "reason": "...", "from_date": "...", "to_date": "..." } }`
- `confirm_od_request`: `{ "tool": "confirm_od_request", "params": { "draft_token": "..." } }`
- `get_active_bus_route`: `{ "tool": "get_active_bus_route", "params": { "origin": "Tambaram", "destination": "Campus" } }`
- `search_verified_knowledge`: `{ "tool": "search_verified_knowledge", "params": { "search_text": "attendance requirement" } }`
- `get_student_context`: `{ "tool": "get_student_context", "params": { "student_id": "..." } }`

---

## 7. Seed / Demo Credentials & Personas

Password for all demo accounts: **`Campora@123`**

| Persona | Name | Email | Role | Context & Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Student** | Arjun Kumar | `arjun.kumar@demo.campora.edu` | `student` | Tambaram resident • 3rd year CSE • 90.7% attendance • Eligible for Hackathon OD • Primary demo persona. |
| **Peer Student** | Divya S | `divya.s@demo.campora.edu` | `student` | Velachery resident • 3rd year ECE • Registered for Cultural Fest • Marketplace seller. |
| **Junior Student** | Rahul M | `rahul.m@demo.campora.edu` | `student` | Chromepet resident • 2nd year IT • Marketplace seller. |
| **Faculty Admin** | Prof. K. Venkatesh | `faculty.admin@demo.campora.edu` | `faculty` | Associate Professor & HOD • Grants & reviews OD leaves in Faculty Queue. |

---

## 8. Environment Variables Specification

### Frontend-Safe (`.env` / `import.meta.env.*`)
```env
VITE_SUPABASE_URL=https://bvwvfmelfozqpuhtbxkk.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Server-Only / Edge Function Secrets
*(Managed via Supabase Project Secrets — NEVER in client code)*
```env
SUPABASE_URL=https://bvwvfmelfozqpuhtbxkk.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_DB_URL=postgresql://postgres:...
```

---

## 9. Local Setup & Execution Guide

### Prerequisites
- Node.js >= v20 (tested on v24.20.0)
- npm >= 10

### 1. Installation
```bash
git clone https://github.com/rushal-k/Shadown_Coders.git
cd Shadown_Coders
npm install
```

### 2. Verify Database Connection & Run Automated Tests
```bash
node test-e2e.cjs
node test-rls-adversarial.cjs
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 10. Consumer Integration Guidelines

### For Frontend Developers
All requests to the backend must be made through [`src/lib/api/`](file:///C:/Users/Laukik/Shadown_Coders/src/lib/api):
```typescript
import { checkOdEligibility, prepareOdRequest, confirmOdRequest } from "@/lib/api/od";
import { getActiveBusRoute } from "@/lib/api/transport";
import { sendChatMessage } from "@/lib/api/ai";

// Example: Check eligibility
const eligibility = await checkOdEligibility(studentId, eventId);

// Example: Send message to VYSE AI
const response = await sendChatMessage({
  message: "I have a hackathon tomorrow and need OD",
  studentId,
});
```

### For AI Orchestrator / External Agent Consumers
Call the Edge Function directly:
```bash
curl -X POST https://bvwvfmelfozqpuhtbxkk.supabase.co/functions/v1/vyse-ai-tools \
  -H "Content-Type: application/json" \
  -H "apikey: <VITE_SUPABASE_ANON_KEY>" \
  -H "Authorization: Bearer <USER_ACCESS_TOKEN>" \
  -d '{
    "action": "chat",
    "message": "What bus should I take from Tambaram?",
    "student_id": "11111111-1111-1111-1111-111111111111"
  }'
```

---

## 11. Intentional Non-Implementation (Scope Discipline)

1. **Third-Party Translation Neural Models**: Language toggle switches UI prompt intent framing; full multilingual speech-to-speech models are out of scope.
2. **Dedicated Vector Database / pgvector Embeddings**: Stored PostgreSQL `search_vector` GIN indexes with `websearch_to_tsquery` and `ts_rank` satisfy campus institutional documentation search cleanly with zero infrastructure dependencies.
3. **Container Orchestration (Docker / Kubernetes)**: Supabase platform (PostgreSQL, Auth, RLS, Storage, Realtime, Edge Functions) satisfies all backend requirements with zero operational complexity.