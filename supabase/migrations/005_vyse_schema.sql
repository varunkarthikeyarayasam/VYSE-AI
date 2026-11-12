-- ============================================================================
-- 005_vyse_schema.sql — Core VYSE Unified Schema
-- ============================================================================

create extension if not exists pgcrypto;

-- 1. profiles (Single role-aware identity table)
create table if not exists profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        text not null check (role in ('student', 'faculty', 'admin')) default 'student',
  full_name   text not null,
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- Backfill profiles from existing auth.users and students
insert into profiles (id, role, full_name, email)
values
  ('11111111-1111-1111-1111-111111111111', 'student', 'Arjun Kumar', 'arjun.kumar@demo.campora.edu'),
  ('22222222-2222-2222-2222-222222222222', 'student', 'Divya S', 'divya.s@demo.campora.edu'),
  ('33333333-3333-3333-3333-333333333333', 'student', 'Rahul M', 'rahul.m@demo.campora.edu'),
  ('99999999-9999-9999-9999-999999999999', 'faculty', 'Prof. K. Venkatesh (Faculty Admin)', 'faculty.admin@demo.campora.edu')
on conflict (id) do update set
  role = excluded.role,
  full_name = excluded.full_name,
  email = excluded.email;

-- 2. faculty table
create table if not exists faculty (
  id          uuid primary key references profiles (id) on delete cascade,
  department  text not null,
  designation text not null default 'Assistant Professor'
);

insert into faculty (id, department, designation)
values
  ('99999999-9999-9999-9999-999999999999', 'Computer Science & Engineering', 'Associate Professor & HOD')
on conflict (id) do update set
  department = excluded.department,
  designation = excluded.designation;

-- 3. courses (Single authoritative course catalog table)
create table if not exists courses (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null,
  department  text not null,
  year        integer not null check (year between 1 and 5),
  semester    integer not null check (semester between 1 and 10),
  credits     integer not null default 3,
  created_at  timestamptz not null default now()
);

-- 4. timetable
create table if not exists timetable (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references courses (id) on delete cascade,
  section     text not null default 'B',
  day_of_week integer not null check (day_of_week between 1 and 7), -- 1: Mon, ..., 7: Sun
  start_time  time not null,
  end_time    time not null,
  room        text not null,
  faculty_id  uuid references faculty (id) on delete set null
);

-- 5. attendance
create table if not exists attendance (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references students (id) on delete cascade,
  course_id   uuid not null references courses (id) on delete cascade,
  date        date not null default current_date,
  status      text not null check (status in ('present', 'absent', 'od')),
  marked_by   uuid references faculty (id),
  created_at  timestamptz not null default now(),
  unique (student_id, course_id, date)
);

create index if not exists idx_attendance_student_course_date on attendance (student_id, course_id, date);

-- 6. exams & marks
create table if not exists exams (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references courses (id) on delete cascade,
  exam_type   text not null check (exam_type in ('cat1', 'cat2', 'fat', 'quiz', 'assignment')),
  exam_date   date not null,
  max_marks   numeric not null default 100
);

create table if not exists marks (
  id             uuid primary key default gen_random_uuid(),
  student_id     uuid not null references students (id) on delete cascade,
  exam_id        uuid not null references exams (id) on delete cascade,
  marks_obtained numeric not null check (marks_obtained >= 0),
  created_at     timestamptz not null default now(),
  unique (student_id, exam_id)
);

-- 7. academic_calendar
create table if not exists academic_calendar (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  event_date  date not null,
  category    text not null check (category in ('holiday', 'exam', 'event', 'academic_deadline', 'instructional')),
  created_at  timestamptz not null default now()
);

-- 8. od_rules (Deterministic policy table for On-Duty leave)
create table if not exists od_rules (
  id                         uuid primary key default gen_random_uuid(),
  rule_name                  text not null unique,
  min_attendance_percent     numeric not null default 75.0,
  applicable_event_types     text[] not null default array['hackathon', 'workshop', 'competition', 'cultural', 'sports'],
  max_od_days_per_semester   integer not null default 3,
  description                text,
  active                     boolean not null default true,
  created_at                 timestamptz not null default now()
);

-- 9. Extend od_requests with od_rule_id and eligibility_snapshot
alter table od_requests add column if not exists od_rule_id uuid references od_rules (id);
alter table od_requests add column if not exists eligibility_snapshot jsonb;

-- 10. route_changes (Announcement and audit log referencing bus_routes)
create table if not exists route_changes (
  id               uuid primary key default gen_random_uuid(),
  route_id         uuid not null references bus_routes (id) on delete cascade,
  change_type      text not null check (change_type in ('delay', 'cancellation', 'diversion', 'temporary_addition')),
  description      text not null,
  effective_from   timestamptz not null,
  effective_until  timestamptz not null,
  created_by       uuid references auth.users (id),
  created_at       timestamptz not null default now()
);

-- 11. Extend campus_locations with operational status
alter table campus_locations add column if not exists open_time time default '08:00:00';
alter table campus_locations add column if not exists close_time time default '20:00:00';
alter table campus_locations add column if not exists active boolean default true;

-- 12. marketplace_items
create table if not exists marketplace_items (
  id          uuid primary key default gen_random_uuid(),
  seller_id   uuid not null references profiles (id) on delete cascade,
  title       text not null,
  description text not null,
  price       numeric not null check (price >= 0),
  category    text not null check (category in ('books', 'electronics', 'furniture', 'uniform', 'other')),
  status      text not null default 'available' check (status in ('available', 'sold', 'removed')),
  images      text[] default array[]::text[],
  created_at  timestamptz not null default now()
);

-- 13. notifications
create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles (id) on delete cascade,
  title       text not null,
  body        text not null,
  category    text not null default 'general',
  read        boolean not null default false,
  action_url  text,
  created_at  timestamptz not null default now()
);

-- Enable Realtime on notifications
alter publication supabase_realtime add table notifications;

-- 14. ai_knowledge view (aliases knowledge_documents for VYSE brand alignment)
create or replace view ai_knowledge as
select * from knowledge_documents;

-- 15. ai_conversation_sessions & ai_messages (Conversation memory)
create table if not exists ai_conversation_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles (id) on delete cascade,
  title           text not null default 'New Conversation',
  started_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  metadata        jsonb default '{}'::jsonb
);

create table if not exists ai_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references ai_conversation_sessions (id) on delete cascade,
  role        text not null check (role in ('user', 'assistant', 'tool')),
  content     text not null,
  tool_calls  jsonb,
  intent      text,
  entities    jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_ai_messages_session on ai_messages (session_id, created_at asc);

-- 16. Storage bucket: od-documents (private)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('od-documents', 'od-documents', false, 10485760, array['application/pdf', 'image/png', 'image/jpeg'])
on conflict (id) do update set public = false;