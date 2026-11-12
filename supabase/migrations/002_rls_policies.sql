-- ============================================================================
-- 002_rls_policies.sql (FIXED & HARDENED)
-- ============================================================================

-- Enable RLS across all tables
alter table students            enable row level security;
alter table events              enable row level security;
alter table event_registrations enable row level security;
alter table od_requests         enable row level security;
alter table bus_routes          enable row level security;
alter table bus_stops           enable row level security;
alter table campus_locations    enable row level security;
alter table notices             enable row level security;
alter table knowledge_documents enable row level security;
alter table admin_users         enable row level security;

-- Helper: is_admin(uid)
-- SECURITY DEFINER bypasses RLS on admin_users cleanly
create or replace function is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from admin_users where user_id = uid
  );
$$;

grant execute on function is_admin(uuid) to authenticated, anon;

-- ============================================================================
-- 1. students
-- ============================================================================
create policy "students_select_own"
  on students for select
  to authenticated
  using (id = auth.uid() or is_admin(auth.uid()));

-- FIX: Allow students to create their OWN profile on signup
create policy "students_insert_own"
  on students for insert
  to authenticated
  with check (id = auth.uid() or is_admin(auth.uid()));

create policy "students_update_own"
  on students for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ============================================================================
-- 2. events
-- ============================================================================
create policy "events_select_published"
  on events for select
  to authenticated, anon
  using (status = 'published' or is_admin(auth.uid()));

create policy "events_admin_manage"
  on events for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- ============================================================================
-- 3. event_registrations
-- ============================================================================
create policy "registrations_select_own"
  on event_registrations for select
  to authenticated
  using (student_id = auth.uid() or is_admin(auth.uid()));

create policy "registrations_insert_own"
  on event_registrations for insert
  to authenticated
  with check (student_id = auth.uid());

create policy "registrations_update_own_cancel"
  on event_registrations for update
  to authenticated
  using (student_id = auth.uid() or is_admin(auth.uid()))
  with check (
    is_admin(auth.uid())
    or (student_id = auth.uid() and status = 'cancelled')
  );

-- ============================================================================
-- 4. od_requests
-- ============================================================================
create policy "od_select_own"
  on od_requests for select
  to authenticated
  using (student_id = auth.uid() or is_admin(auth.uid()));

-- FIX: Allow inserting as draft OR submitted
create policy "od_insert_own"
  on od_requests for insert
  to authenticated
  with check (student_id = auth.uid() and status in ('draft', 'submitted'));

create policy "od_update_own_draft_or_admin"
  on od_requests for update
  to authenticated
  using (
    (student_id = auth.uid() and status = 'draft')
    or is_admin(auth.uid())
  )
  with check (
    is_admin(auth.uid())
    or (student_id = auth.uid() and status in ('draft','submitted'))
  );

-- ============================================================================
-- 5. bus_routes & bus_stops
-- ============================================================================
create policy "bus_routes_select_active"
  on bus_routes for select
  to authenticated, anon
  using (active = true or is_admin(auth.uid()));

create policy "bus_routes_admin_all"
  on bus_routes for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

create policy "bus_stops_select"
  on bus_stops for select
  to authenticated, anon
  using (true);

create policy "bus_stops_admin_all"
  on bus_stops for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- ============================================================================
-- 6. campus_locations
-- ============================================================================
create policy "campus_locations_select"
  on campus_locations for select
  to authenticated, anon
  using (true);

create policy "campus_locations_admin_all"
  on campus_locations for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- ============================================================================
-- 7. notices
-- ============================================================================
create policy "notices_select_verified"
  on notices for select
  to authenticated, anon
  using (
    (verified = true and (expires_at is null or expires_at > now()))
    or is_admin(auth.uid())
  );

create policy "notices_admin_all"
  on notices for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- ============================================================================
-- 8. knowledge_documents
-- ============================================================================
create policy "knowledge_select_verified"
  on knowledge_documents for select
  to authenticated, anon
  using (verified = true or is_admin(auth.uid()));

create policy "knowledge_admin_all"
  on knowledge_documents for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- ============================================================================
-- 9. admin_users
-- ============================================================================
-- FIX: Removed infinite loop by checking the function directly
create policy "admin_users_policy"
  on admin_users for all
  to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));