-- ============================================================================
-- 007_vyse_functions.sql — Deterministic Business Logic & PREPARE->CONFIRM RPCs
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. check_od_eligibility (Pure SQL logic, deterministic, no LLM dependency)
-- ----------------------------------------------------------------------------
create or replace function check_od_eligibility(
  p_student_id uuid,
  p_event_id   uuid
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student           record;
  v_event             record;
  v_rule              record;
  v_attendance_pct    numeric;
  v_present_count     integer := 0;
  v_total_classes     integer := 0;
  v_od_used           integer := 0;
  v_min_required      numeric := 75.0;
  v_max_allowed       integer := 3;
  v_eligible          boolean := true;
  v_reasons           text[] := array[]::text[];
  v_semester_start    date;
begin
  -- Validate caller permission (enforce when called in authenticated user context)
  if auth.uid() is not null and auth.uid() is distinct from p_student_id and not is_admin(auth.uid()) then
    raise exception 'FORBIDDEN';
  end if;

  -- 1. Validate student
  select * into v_student from students where id = p_student_id;
  if not found then
    raise exception 'STUDENT_NOT_FOUND';
  end if;

  -- 2. Validate event
  select * into v_event from events where id = p_event_id;
  if not found then
    raise exception 'EVENT_NOT_FOUND';
  end if;

  -- 3. Retrieve applicable OD rule
  select * into v_rule
  from od_rules
  where active = true
  order by created_at desc
  limit 1;

  if found then
    v_min_required := v_rule.min_attendance_percent;
    v_max_allowed  := v_rule.max_od_days_per_semester;
  end if;

  -- 4. Calculate student attendance percentage
  select
    count(*) filter (where status in ('present', 'od')),
    count(*)
  into v_present_count, v_total_classes
  from attendance
  where student_id = p_student_id;

  if v_total_classes > 0 then
    v_attendance_pct := round((v_present_count::numeric / v_total_classes::numeric) * 100.0, 1);
  else
    v_attendance_pct := 82.0;
  end if;

  -- 5. Calculate OD days used this semester
  v_semester_start := date_trunc('month', current_date - interval '3 months')::date;
  select coalesce(sum((to_date - from_date) + 1), 0)
  into v_od_used
  from od_requests
  where student_id = p_student_id
    and status = 'approved'
    and from_date >= v_semester_start;

  -- 6. Evaluate deterministic conditions
  -- Condition A: Attendance threshold
  if v_attendance_pct >= v_min_required then
    v_reasons := array_append(v_reasons, format('Attendance %s%% meets the %s%% minimum requirement', v_attendance_pct, v_min_required));
  else
    v_reasons := array_append(v_reasons, format('Attendance %s%% is below the mandatory %s%% threshold', v_attendance_pct, v_min_required));
    v_eligible := false;
  end if;

  -- Condition B: Event OD availability
  if v_event.od_available = true then
    v_reasons := array_append(v_reasons, 'Event is recognized and approved for On-Duty (OD)');
  else
    v_reasons := array_append(v_reasons, 'Event does not offer On-Duty (OD) leave');
    v_eligible := false;
  end if;

  -- Condition C: Semester allowance
  if v_od_used < v_max_allowed then
    v_reasons := array_append(v_reasons, format('%s of %s semester OD allowances used', v_od_used, v_max_allowed));
  else
    v_reasons := array_append(v_reasons, format('Semester OD limit reached (%s of %s allowances used)', v_od_used, v_max_allowed));
    v_eligible := false;
  end if;

  return json_build_object(
    'eligible', v_eligible,
    'attendance_percent', v_attendance_pct,
    'min_required', v_min_required,
    'od_used_this_semester', v_od_used,
    'max_allowed', v_max_allowed,
    'reasons', v_reasons,
    'event_id', v_event.id,
    'event_title', v_event.title,
    'event_date', v_event.event_date,
    'rule_id', v_rule.id
  );
end;
$$;

grant execute on function check_od_eligibility(uuid, uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- 2. PREPARE & CONFIRM OD REQUEST (Consequential Action Pattern)
-- ----------------------------------------------------------------------------
create or replace function prepare_od_request(
  p_student_id   uuid,
  p_event_id     uuid,
  p_reason       text,
  p_from_date    date,
  p_to_date      date,
  p_document_url text default null
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_eligibility json;
  v_eligible    boolean;
  v_draft_token text;
  v_draft_data  json;
begin
  if auth.uid() is not null and auth.uid() is distinct from p_student_id and not is_admin(auth.uid()) then
    raise exception 'FORBIDDEN';
  end if;

  v_eligibility := check_od_eligibility(p_student_id, p_event_id);
  v_eligible := (v_eligibility->>'eligible')::boolean;

  if not v_eligible then
    return json_build_object(
      'success', false,
      'eligible', false,
      'eligibility', v_eligibility,
      'message', 'Student is not eligible for OD request on this event'
    );
  end if;

  v_draft_data := json_build_object(
    'student_id', p_student_id,
    'event_id', p_event_id,
    'reason', p_reason,
    'from_date', p_from_date,
    'to_date', p_to_date,
    'document_url', p_document_url,
    'rule_id', (v_eligibility->>'rule_id'),
    'eligibility_snapshot', v_eligibility,
    'created_at', extract(epoch from now())
  );

  v_draft_token := encode(v_draft_data::text::bytea, 'base64');

  return json_build_object(
    'success', true,
    'eligible', true,
    'action', 'CONFIRM_REQUIRED',
    'draft_token', v_draft_token,
    'draft_details', v_draft_data,
    'message', 'OD Request draft prepared. Confirmation required to execute submission.'
  );
end;
$$;

grant execute on function prepare_od_request(uuid, uuid, text, date, date, text) to authenticated;

create or replace function confirm_od_request(
  p_draft_token text
)
returns od_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_raw_text   text;
  v_draft_data json;
  v_student_id uuid;
  v_event_id   uuid;
  v_reason     text;
  v_from_date  date;
  v_to_date    date;
  v_doc_url    text;
  v_rule_id    uuid;
  v_snapshot   jsonb;
  v_row        od_requests;
begin
  begin
    v_raw_text := convert_from(decode(p_draft_token, 'base64'), 'UTF8');
    v_draft_data := v_raw_text::json;
  exception when others then
    raise exception 'INVALID_DRAFT_TOKEN';
  end;

  v_student_id := (v_draft_data->>'student_id')::uuid;
  v_event_id   := (v_draft_data->>'event_id')::uuid;
  v_reason     := v_draft_data->>'reason';
  v_from_date  := (v_draft_data->>'from_date')::date;
  v_to_date    := (v_draft_data->>'to_date')::date;
  v_doc_url    := v_draft_data->>'document_url';
  v_rule_id    := (v_draft_data->>'rule_id')::uuid;
  v_snapshot   := (v_draft_data->'eligibility_snapshot')::jsonb;

  if auth.uid() is not null and auth.uid() is distinct from v_student_id and not is_admin(auth.uid()) then
    raise exception 'FORBIDDEN';
  end if;

  insert into od_requests (
    student_id, event_id, reason, from_date, to_date,
    document_url, status, submitted_at, od_rule_id, eligibility_snapshot
  )
  values (
    v_student_id, v_event_id, v_reason, v_from_date, v_to_date,
    v_doc_url, 'submitted', now(), v_rule_id, v_snapshot
  )
  returning * into v_row;

  insert into notifications (user_id, title, body, category, action_url)
  values (
    v_student_id,
    'OD Request Submitted',
    format('Your OD request for %s has been submitted for faculty review.', coalesce(v_snapshot->>'event_title', 'event')),
    'od',
    '/od'
  );

  return v_row;
end;
$$;

grant execute on function confirm_od_request(text) to authenticated;

-- ----------------------------------------------------------------------------
-- 3. PREPARE & CONFIRM EVENT REGISTRATION
-- ----------------------------------------------------------------------------
create or replace function prepare_event_registration(
  p_student_id uuid,
  p_event_id   uuid
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event      record;
  v_existing   record;
  v_draft_data json;
  v_token      text;
begin
  if auth.uid() is not null and auth.uid() is distinct from p_student_id and not is_admin(auth.uid()) then
    raise exception 'FORBIDDEN';
  end if;

  select * into v_event from events where id = p_event_id and status = 'published';
  if not found then
    raise exception 'EVENT_NOT_FOUND';
  end if;

  select * into v_existing from event_registrations where student_id = p_student_id and event_id = p_event_id;
  if found and v_existing.status = 'registered' then
    raise exception 'ALREADY_REGISTERED';
  end if;

  v_draft_data := json_build_object(
    'student_id', p_student_id,
    'event_id', p_event_id,
    'event_title', v_event.title,
    'event_date', v_event.event_date,
    'venue', v_event.venue,
    'created_at', extract(epoch from now())
  );

  v_token := encode(v_draft_data::text::bytea, 'base64');

  return json_build_object(
    'success', true,
    'action', 'CONFIRM_REQUIRED',
    'draft_token', v_token,
    'event', json_build_object('id', v_event.id, 'title', v_event.title, 'event_date', v_event.event_date, 'venue', v_event.venue),
    'message', format('Ready to register for %s. Click Confirm to complete.', v_event.title)
  );
end;
$$;

grant execute on function prepare_event_registration(uuid, uuid) to authenticated;

create or replace function confirm_event_registration(
  p_draft_token text
)
returns event_registrations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_raw_text   text;
  v_draft_data json;
  v_student_id uuid;
  v_event_id   uuid;
  v_row        event_registrations;
begin
  begin
    v_raw_text := convert_from(decode(p_draft_token, 'base64'), 'UTF8');
    v_draft_data := v_raw_text::json;
  exception when others then
    raise exception 'INVALID_DRAFT_TOKEN';
  end;

  v_student_id := (v_draft_data->>'student_id')::uuid;
  v_event_id   := (v_draft_data->>'event_id')::uuid;

  if auth.uid() is not null and auth.uid() is distinct from v_student_id and not is_admin(auth.uid()) then
    raise exception 'FORBIDDEN';
  end if;

  insert into event_registrations (student_id, event_id, status, registered_at)
  values (v_student_id, v_event_id, 'registered', now())
  on conflict (student_id, event_id) do update set
    status = 'registered',
    registered_at = now()
  returning * into v_row;

  insert into notifications (user_id, title, body, category, action_url)
  values (
    v_student_id,
    'Event Registration Confirmed',
    format('You have successfully registered for %s.', coalesce(v_draft_data->>'event_title', 'event')),
    'event',
    '/events'
  );

  return v_row;
end;
$$;

grant execute on function confirm_event_registration(text) to authenticated;

-- ----------------------------------------------------------------------------
-- 4. get_active_bus_route (Deterministic single best route resolver)
-- ----------------------------------------------------------------------------
create or replace function get_active_bus_route(
  p_origin      text,
  p_destination text default 'Campus'
)
returns json
language plpgsql
security invoker
stable
as $$
declare
  v_route record;
  v_stops json;
begin
  select r.*
  into v_route
  from bus_routes r
  where r.active = true
    and r.origin ilike '%' || p_origin || '%'
    and (
      (r.is_temporary = true and now() between r.valid_from and r.valid_until)
      or (r.is_temporary = true and r.valid_from::date = (current_date + interval '1 day')::date)
    )
  order by r.is_temporary desc, r.created_at desc
  limit 1;

  if v_route.id is null then
    select r.*
    into v_route
    from bus_routes r
    where r.active = true
      and r.origin ilike '%' || p_origin || '%'
      and r.is_temporary = false
    limit 1;
  end if;

  if v_route.id is null then
    return null;
  end if;

  select json_agg(
    json_build_object(
      'stop_name', stop_name,
      'stop_order', stop_order,
      'arrival_time', arrival_time,
      'latitude', latitude,
      'longitude', longitude
    ) order by stop_order
  )
  into v_stops
  from bus_stops
  where route_id = v_route.id;

  return json_build_object(
    'route_id', v_route.id,
    'route_name', v_route.route_name,
    'origin', v_route.origin,
    'destination', v_route.destination,
    'is_temporary', v_route.is_temporary,
    'valid_from', v_route.valid_from,
    'valid_until', v_route.valid_until,
    'stops', coalesce(v_stops, '[]'::json)
  );
end;
$$;

grant execute on function get_active_bus_route(text, text) to authenticated, anon;

-- ----------------------------------------------------------------------------
-- 5. get_student_context (Extended with timetable, attendance, unread notifications)
-- ----------------------------------------------------------------------------
create or replace function get_student_context(p_student_id uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student              record;
  v_today_day            integer;
  v_timetable            json;
  v_attendance_summary   json;
  v_unread_notifications integer := 0;
  v_total_classes        integer := 0;
  v_present_classes      integer := 0;
  v_attendance_pct       numeric := 82.0;
begin
  if auth.uid() is not null and auth.uid() is distinct from p_student_id and not is_admin(auth.uid()) then
    raise exception 'FORBIDDEN';
  end if;

  select * into v_student from students where id = p_student_id;
  if not found then
    raise exception 'STUDENT_NOT_FOUND';
  end if;

  v_today_day := extract(isodow from current_date)::integer;
  select coalesce(json_agg(
    json_build_object(
      'timetable_id', t.id,
      'course_code', c.code,
      'course_name', c.name,
      'start_time', t.start_time,
      'end_time', t.end_time,
      'room', t.room,
      'faculty_name', p.full_name
    ) order by t.start_time
  ), '[]'::json)
  into v_timetable
  from timetable t
  join courses c on c.id = t.course_id
  left join faculty f on f.id = t.faculty_id
  left join profiles p on p.id = f.id
  where t.section = coalesce(v_student.section, 'B')
    and t.day_of_week = v_today_day;

  select
    count(*),
    count(*) filter (where status in ('present', 'od'))
  into v_total_classes, v_present_classes
  from attendance
  where student_id = p_student_id;

  if v_total_classes > 0 then
    v_attendance_pct := round((v_present_classes::numeric / v_total_classes::numeric) * 100.0, 1);
  end if;

  v_attendance_summary := json_build_object(
    'total_classes', v_total_classes,
    'present_classes', v_present_classes,
    'attendance_percent', v_attendance_pct,
    'threshold_met', (v_attendance_pct >= 75.0)
  );

  select count(*)
  into v_unread_notifications
  from notifications
  where user_id = p_student_id and read = false;

  return json_build_object(
    'profile', json_build_object(
      'id', v_student.id,
      'name', v_student.name,
      'email', v_student.email,
      'roll_number', v_student.roll_number,
      'department', v_student.department,
      'year', v_student.year,
      'section', v_student.section,
      'home_location', v_student.home_location
    ),
    'attendance', v_attendance_summary,
    'today_timetable', v_timetable,
    'unread_notifications_count', v_unread_notifications
  );
end;
$$;

grant execute on function get_student_context(uuid) to authenticated;