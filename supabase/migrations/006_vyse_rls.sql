-- ============================================================================
-- 006_vyse_rls.sql — Zero-Trust RLS Policies & Role-Based Access Control
-- ============================================================================

-- Role helper functions (SECURITY DEFINER to avoid recursion)
create or replace function has_role(p_uid uuid, p_role text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = p_uid and role = p_role
  ) or exists (
    select 1 from admin_users where user_id = p_uid and (role = p_role or (p_role = 'admin' and role = 'faculty'))
  );
$$;

create or replace function is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = uid and role in ('admin', 'faculty')
  ) or exists (
    select 1 from admin_users where user_id = uid
  );
$$;

grant execute on function has_role(uuid, text) to authenticated, anon;
grant execute on function is_admin(uuid) to authenticated, anon;

-- Enable RLS across all new tables
alter table profiles                 enable row level security;
alter table faculty                  enable row level security;
alter table courses                  enable row level security;
alter table timetable                enable row level security;
alter table attendance               enable row level security;
alter table exams                    enable row level security;
alter table marks                    enable row level security;
alter table academic_calendar        enable row level security;
alter table od_rules                 enable row level security;
alter table route_changes            enable row level security;
alter table marketplace_items        enable row level security;
alter table notifications            enable row level security;
alter table ai_conversation_sessions enable row level security;
alter table ai_messages              enable row level security;

-- Drop any conflicting prior policies
drop policy if exists "profiles_select" on profiles;
drop policy if exists "profiles_update_own" on profiles;
drop policy if exists "profiles_insert_own" on profiles;

drop policy if exists "faculty_select" on faculty;
drop policy if exists "faculty_admin_all" on faculty;

drop policy if exists "courses_select" on courses;
drop policy if exists "courses_admin_all" on courses;

drop policy if exists "timetable_select" on timetable;
drop policy if exists "timetable_admin_all" on timetable;

drop policy if exists "calendar_select" on academic_calendar;
drop policy if exists "calendar_admin_all" on academic_calendar;

drop policy if exists "attendance_select_own" on attendance;
drop policy if exists "attendance_faculty_insert" on attendance;
drop policy if exists "attendance_faculty_update" on attendance;

drop policy if exists "exams_select" on exams;
drop policy if exists "exams_admin_all" on exams;

drop policy if exists "marks_select_own" on marks;
drop policy if exists "marks_admin_manage" on marks;

drop policy if exists "od_rules_select" on od_rules;
drop policy if exists "od_rules_admin_all" on od_rules;

drop policy if exists "route_changes_select" on route_changes;
drop policy if exists "route_changes_admin_all" on route_changes;

drop policy if exists "marketplace_select" on marketplace_items;
drop policy if exists "marketplace_insert_own" on marketplace_items;
drop policy if exists "marketplace_update_own" on marketplace_items;
drop policy if exists "marketplace_delete_own" on marketplace_items;

drop policy if exists "notifications_select_own" on notifications;
drop policy if exists "notifications_update_own" on notifications;
drop policy if exists "notifications_admin_insert" on notifications;

drop policy if exists "ai_sessions_select_own" on ai_conversation_sessions;
drop policy if exists "ai_sessions_insert_own" on ai_conversation_sessions;
drop policy if exists "ai_sessions_update_own" on ai_conversation_sessions;
drop policy if exists "ai_sessions_delete_own" on ai_conversation_sessions;

drop policy if exists "ai_messages_select_own" on ai_messages;
drop policy if exists "ai_messages_insert_own" on ai_messages;

drop policy if exists "od_docs_upload" on storage.objects;
drop policy if exists "od_docs_select" on storage.objects;

-- 1. profiles
create policy "profiles_select"
  on profiles for select
  to authenticated
  using (true);

create policy "profiles_update_own"
  on profiles for update
  to authenticated
  using (id = auth.uid() or is_admin(auth.uid()))
  with check (id = auth.uid() or is_admin(auth.uid()));

create policy "profiles_insert_own"
  on profiles for insert
  to authenticated
  with check (id = auth.uid() or is_admin(auth.uid()));

-- 2. faculty
create policy "faculty_select"
  on faculty for select
  to authenticated, anon
  using (true);

create policy "faculty_admin_all"
  on faculty for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- 3. courses & timetable & academic_calendar
create policy "courses_select"
  on courses for select
  to authenticated, anon
  using (true);

create policy "courses_admin_all"
  on courses for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

create policy "timetable_select"
  on timetable for select
  to authenticated, anon
  using (true);

create policy "timetable_admin_all"
  on timetable for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

create policy "calendar_select"
  on academic_calendar for select
  to authenticated, anon
  using (true);

create policy "calendar_admin_all"
  on academic_calendar for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- 4. attendance (Strict isolation: students only read their own)
create policy "attendance_select_own"
  on attendance for select
  to authenticated
  using (
    student_id = auth.uid()
    or is_admin(auth.uid())
    or marked_by = auth.uid()
  );

create policy "attendance_faculty_insert"
  on attendance for insert
  to authenticated
  with check (
    is_admin(auth.uid())
    or marked_by = auth.uid()
  );

create policy "attendance_faculty_update"
  on attendance for update
  to authenticated
  using (is_admin(auth.uid()) or marked_by = auth.uid())
  with check (is_admin(auth.uid()) or marked_by = auth.uid());

-- 5. exams & marks
create policy "exams_select"
  on exams for select
  to authenticated, anon
  using (true);

create policy "exams_admin_all"
  on exams for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

create policy "marks_select_own"
  on marks for select
  to authenticated
  using (student_id = auth.uid() or is_admin(auth.uid()));

create policy "marks_admin_manage"
  on marks for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- 6. od_rules
create policy "od_rules_select"
  on od_rules for select
  to authenticated, anon
  using (active = true or is_admin(auth.uid()));

create policy "od_rules_admin_all"
  on od_rules for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- 7. route_changes
create policy "route_changes_select"
  on route_changes for select
  to authenticated, anon
  using (true);

create policy "route_changes_admin_all"
  on route_changes for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- 8. marketplace_items
create policy "marketplace_select"
  on marketplace_items for select
  to authenticated
  using (status = 'available' or seller_id = auth.uid() or is_admin(auth.uid()));

create policy "marketplace_insert_own"
  on marketplace_items for insert
  to authenticated
  with check (seller_id = auth.uid());

create policy "marketplace_update_own"
  on marketplace_items for update
  to authenticated
  using (seller_id = auth.uid() or is_admin(auth.uid()))
  with check (seller_id = auth.uid() or is_admin(auth.uid()));

create policy "marketplace_delete_own"
  on marketplace_items for delete
  to authenticated
  using (seller_id = auth.uid() or is_admin(auth.uid()));

-- 9. notifications (Strict isolation: user only reads their own)
create policy "notifications_select_own"
  on notifications for select
  to authenticated
  using (user_id = auth.uid());

create policy "notifications_update_own"
  on notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "notifications_admin_insert"
  on notifications for insert
  to authenticated
  with check (is_admin(auth.uid()) or user_id = auth.uid());

-- 10. ai_conversation_sessions & ai_messages (Strict user isolation)
create policy "ai_sessions_select_own"
  on ai_conversation_sessions for select
  to authenticated
  using (user_id = auth.uid());

create policy "ai_sessions_insert_own"
  on ai_conversation_sessions for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "ai_sessions_update_own"
  on ai_conversation_sessions for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "ai_sessions_delete_own"
  on ai_conversation_sessions for delete
  to authenticated
  using (user_id = auth.uid());

create policy "ai_messages_select_own"
  on ai_messages for select
  to authenticated
  using (
    exists (
      select 1 from ai_conversation_sessions s
      where s.id = ai_messages.session_id and s.user_id = auth.uid()
    )
  );

create policy "ai_messages_insert_own"
  on ai_messages for insert
  to authenticated
  with check (
    exists (
      select 1 from ai_conversation_sessions s
      where s.id = ai_messages.session_id and s.user_id = auth.uid()
    )
  );

-- 11. Storage Policies for od-documents
create policy "od_docs_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'od-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "od_docs_select"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'od-documents'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or is_admin(auth.uid())
    )
  );