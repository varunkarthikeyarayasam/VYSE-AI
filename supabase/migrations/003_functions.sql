-- ============================================================================
-- 003_functions.sql (FIXED & HARDENED FOR MULTI-DAY OD)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. get_student_context(student_id)
-- ----------------------------------------------------------------------------
create or replace function get_student_context(p_student_id uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result json;
begin
  if auth.uid() is distinct from p_student_id and not is_admin(auth.uid()) then
    raise exception 'FORBIDDEN';
  end if;

  select json_build_object(
    'id', s.id,
    'name', s.name,
    'department', s.department,
    'year', s.year,
    'section', s.section,
    'home_location', s.home_location
  )
  into v_result
  from students s
  where s.id = p_student_id;

  if v_result is null then
    raise exception 'STUDENT_NOT_FOUND';
  end if;

  return v_result;
end;
$$;

grant execute on function get_student_context(uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- 2. search_events(search_text, date_filter)
-- ----------------------------------------------------------------------------
create or replace function search_events(
  p_search_text text default null,
  p_date_filter date default null
)
returns setof events
language sql
security invoker
stable
as $$
  select *
  from events
  where status = 'published'
    and (p_date_filter is null or event_date = p_date_filter)
    and (p_date_filter is not null or event_date >= current_date)
    and (
      p_search_text is null
      or title ilike '%' || p_search_text || '%'
      or description ilike '%' || p_search_text || '%'
    )
  order by event_date asc, start_time asc
  limit 20;
$$;

grant execute on function search_events(text, date) to authenticated, anon;

-- ----------------------------------------------------------------------------
-- 3. get_event_details(event_id)
-- ----------------------------------------------------------------------------
create or replace function get_event_details(p_event_id uuid)
returns events
language plpgsql
security invoker
as $$
declare
  v_row events;
begin
  select * into v_row from events where id = p_event_id and status = 'published';

  if not found then
    raise exception 'EVENT_NOT_FOUND';
  end if;

  return v_row;
end;
$$;

grant execute on function get_event_details(uuid) to authenticated, anon;

-- ----------------------------------------------------------------------------
-- 4. get_student_event_registrations(student_id)
-- ----------------------------------------------------------------------------
create or replace function get_student_event_registrations(p_student_id uuid)
returns table (
  registration_id uuid,
  status text,
  registered_at timestamptz,
  event_id uuid,
  event_title text,
  event_date date,
  start_time time,
  venue text,
  od_available boolean
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is distinct from p_student_id and not is_admin(auth.uid()) then
    raise exception 'FORBIDDEN';
  end if;

  return query
  select
    r.id, r.status, r.registered_at,
    e.id, e.title, e.event_date, e.start_time, e.venue, e.od_available
  from event_registrations r
  join events e on e.id = r.event_id
  where r.student_id = p_student_id
  order by e.event_date asc;
end;
$$;

grant execute on function get_student_event_registrations(uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- 5. create_od_request (FIXED for multi-day from_date/to_date)
-- ----------------------------------------------------------------------------
create or replace function create_od_request(
  p_student_id   uuid,
  p_event_id     uuid,
  p_reason       text,
  p_from_date    date,
  p_to_date      date,
  p_document_url text default null
)
returns od_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row od_requests;
begin
  if auth.uid() is distinct from p_student_id and not is_admin(auth.uid()) then
    raise exception 'FORBIDDEN';
  end if;

  if p_reason is null or length(trim(p_reason)) = 0 then
    raise exception 'INVALID_INPUT';
  end if;

  if p_event_id is not null and not exists (select 1 from events where id = p_event_id) then
    raise exception 'EVENT_NOT_FOUND';
  end if;

  insert into od_requests (student_id, event_id, reason, from_date, to_date, document_url, status)
  values (p_student_id, p_event_id, p_reason, p_from_date, p_to_date, p_document_url, 'draft')
  returning * into v_row;

  return v_row;
end;
$$;

grant execute on function create_od_request(uuid, uuid, text, date, date, text) to authenticated;

-- ----------------------------------------------------------------------------
-- 6. submit_od_request(od_request_id)
-- ----------------------------------------------------------------------------
create or replace function submit_od_request(p_od_request_id uuid)
returns od_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row od_requests;
begin
  select * into v_row from od_requests where id = p_od_request_id;

  if not found then
    raise exception 'OD_REQUEST_NOT_FOUND';
  end if;

  if v_row.student_id is distinct from auth.uid() and not is_admin(auth.uid()) then
    raise exception 'FORBIDDEN';
  end if;

  if v_row.status is distinct from 'draft' then
    raise exception 'INVALID_STATUS';
  end if;

  update od_requests
  set status = 'submitted', submitted_at = now()
  where id = p_od_request_id
  returning * into v_row;

  return v_row;
end;
$$;

grant execute on function submit_od_request(uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- 7. get_student_od_requests(student_id)
-- ----------------------------------------------------------------------------
create or replace function get_student_od_requests(p_student_id uuid)
returns setof od_requests
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is distinct from p_student_id and not is_admin(auth.uid()) then
    raise exception 'FORBIDDEN';
  end if;

  return query
  select * from od_requests
  where student_id = p_student_id
  order by coalesce(submitted_at, '-infinity'::timestamptz) desc, id desc;
end;
$$;

grant execute on function get_student_od_requests(uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- 7b. review_od_request(od_request_id, decision, rejection_reason)
-- ----------------------------------------------------------------------------
create or replace function review_od_request(
  p_od_request_id    uuid,
  p_decision         text,
  p_rejection_reason text default null
)
returns od_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row od_requests;
begin
  if not is_admin(auth.uid()) then
    raise exception 'FORBIDDEN';
  end if;

  if p_decision not in ('approved','rejected','under_review') then
    raise exception 'INVALID_INPUT';
  end if;

  select * into v_row from od_requests where id = p_od_request_id;
  if not found then
    raise exception 'OD_REQUEST_NOT_FOUND';
  end if;

  if v_row.status not in ('submitted','under_review') then
    raise exception 'INVALID_STATUS';
  end if;

  if p_decision = 'rejected' and (p_rejection_reason is null or length(trim(p_rejection_reason)) = 0) then
    raise exception 'INVALID_INPUT';
  end if;

  update od_requests
  set status = p_decision,
      reviewed_at = now(),
      reviewed_by = auth.uid(),
      rejection_reason = case when p_decision = 'rejected' then p_rejection_reason else null end
  where id = p_od_request_id
  returning * into v_row;

  return v_row;
end;
$$;

grant execute on function review_od_request(uuid, text, text) to authenticated;

-- ----------------------------------------------------------------------------
-- 7c. admin_list_od_requests(status_filter)
-- ----------------------------------------------------------------------------
create or replace function admin_list_od_requests(p_status text default null)
returns table (
  od_request_id uuid,
  student_id uuid,
  student_name text,
  roll_number text,
  event_id uuid,
  event_title text,
  reason text,
  from_date date,
  to_date date,
  status text,
  submitted_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin(auth.uid()) then
    raise exception 'FORBIDDEN';
  end if;

  return query
  select o.id, o.student_id, s.name, s.roll_number, o.event_id, e.title,
         o.reason, o.from_date, o.to_date, o.status, o.submitted_at
  from od_requests o
  join students s on s.id = o.student_id
  left join events e on e.id = o.event_id
  where p_status is null or o.status = p_status
  order by coalesce(o.submitted_at, '-infinity'::timestamptz) desc;
end;
$$;

grant execute on function admin_list_od_requests(text) to authenticated;

-- ----------------------------------------------------------------------------
-- 8. find_bus_routes(origin, destination, target_arrival_time)
-- ----------------------------------------------------------------------------
create or replace function find_bus_routes(
  p_origin text,
  p_destination text,
  p_target_arrival_time time default null
)
returns table (
  route_id uuid,
  route_name text,
  origin text,
  destination text,
  is_temporary boolean,
  valid_from timestamptz,
  valid_until timestamptz,
  departure_time time,
  arrival_time time,
  stops json
)
language sql
security invoker
stable
as $$
  with candidate_routes as (
    select r.*
    from bus_routes r
    where r.active = true
      and r.origin ilike '%' || p_origin || '%'
      and r.destination ilike '%' || p_destination || '%'
      and (
        r.is_temporary = false
        or (r.is_temporary = true and now() between r.valid_from and r.valid_until)
      )
  ),
  stop_bounds as (
    select route_id, min(stop_order) as min_order, max(stop_order) as max_order
    from bus_stops
    group by route_id
  ),
  dep_arr as (
    select
      cr.id,
      (select bs.arrival_time from bus_stops bs
        where bs.route_id = cr.id and bs.stop_order = sb.min_order) as departure_time,
      (select bs.arrival_time from bus_stops bs
        where bs.route_id = cr.id and bs.stop_order = sb.max_order) as arrival_time
    from candidate_routes cr
    join stop_bounds sb on sb.route_id = cr.id
  ),
  stops_agg as (
    select
      route_id,
      json_agg(
        json_build_object(
          'stop_name', stop_name,
          'stop_order', stop_order,
          'arrival_time', arrival_time,
          'latitude', latitude,
          'longitude', longitude
        ) order by stop_order
      ) as stops
    from bus_stops
    group by route_id
  )
  select
    cr.id as route_id, cr.route_name, cr.origin, cr.destination, cr.is_temporary,
    cr.valid_from, cr.valid_until,
    da.departure_time, da.arrival_time,
    coalesce(sa.stops, '[]'::json) as stops
  from candidate_routes cr
  left join dep_arr da on da.id = cr.id
  left join stops_agg sa on sa.route_id = cr.id
  order by
    cr.is_temporary desc,            
    case
      when p_target_arrival_time is null or da.arrival_time is null then 0
      else abs(extract(epoch from (da.arrival_time - p_target_arrival_time)))
    end asc,
    da.departure_time asc;
$$;

grant execute on function find_bus_routes(text, text, time) to authenticated, anon;

-- ----------------------------------------------------------------------------
-- 9. get_campus_location(search_text)
-- ----------------------------------------------------------------------------
create or replace function get_campus_location(p_search_text text)
returns setof campus_locations
language sql
security invoker
stable
as $$
  select *
  from campus_locations
  where name ilike '%' || p_search_text || '%'
     or building ilike '%' || p_search_text || '%'
     or description ilike '%' || p_search_text || '%'
  order by name
  limit 10;
$$;

grant execute on function get_campus_location(text) to authenticated, anon;

-- ----------------------------------------------------------------------------
-- 10. search_verified_knowledge(search_text)
-- ----------------------------------------------------------------------------
create or replace function search_verified_knowledge(p_search_text text)
returns setof knowledge_documents
language sql
security invoker
stable
as $$
  select *
  from knowledge_documents
  where verified = true
    and (
      title ilike '%' || p_search_text || '%'
      or content ilike '%' || p_search_text || '%'
      or category ilike '%' || p_search_text || '%'
    )
  order by updated_at desc
  limit 10;
$$;

grant execute on function search_verified_knowledge(text) to authenticated, anon;

-- ----------------------------------------------------------------------------
-- 11. get_student_action_context(student_id)
-- ----------------------------------------------------------------------------
create or replace function get_student_action_context(p_student_id uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile json;
  v_upcoming_events json;
  v_pending_ods json;
begin
  if auth.uid() is distinct from p_student_id and not is_admin(auth.uid()) then
    raise exception 'FORBIDDEN';
  end if;

  select json_build_object(
    'id', s.id, 'name', s.name, 'department', s.department,
    'year', s.year, 'section', s.section, 'home_location', s.home_location
  )
  into v_profile
  from students s
  where s.id = p_student_id;

  if v_profile is null then
    raise exception 'STUDENT_NOT_FOUND';
  end if;

  select coalesce(json_agg(json_build_object(
    'event_id', e.id, 'title', e.title, 'event_date', e.event_date,
    'start_time', e.start_time, 'venue', e.venue, 'od_available', e.od_available,
    'registration_status', r.status
  ) order by e.event_date), '[]'::json)
  into v_upcoming_events
  from event_registrations r
  join events e on e.id = r.event_id
  where r.student_id = p_student_id
    and e.event_date >= current_date
    and r.status = 'registered';

  select coalesce(json_agg(json_build_object(
    'od_request_id', o.id, 'event_id', o.event_id, 'reason', o.reason,
    'from_date', o.from_date, 'to_date', o.to_date, 'status', o.status
  ) order by o.from_date desc), '[]'::json)
  into v_pending_ods
  from od_requests o
  where o.student_id = p_student_id
    and o.status in ('draft','submitted','under_review');

  return json_build_object(
    'profile', v_profile,
    'upcoming_registered_events', v_upcoming_events,
    'pending_od_requests', v_pending_ods
  );
end;
$$;

grant execute on function get_student_action_context(uuid) to authenticated;