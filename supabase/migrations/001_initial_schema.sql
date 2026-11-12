create extension if not exists pgcrypto;

-- 1. students
create table if not exists students (
  id             uuid primary key references auth.users (id) on delete cascade,
  name           text not null,
  email          text not null unique,
  roll_number    text not null unique,
  department     text not null,
  year           integer not null check (year between 1 and 5),
  section        text,
  home_location  text not null,
  created_at     timestamptz not null default now()
);

-- 2. events
create table if not exists events (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  description           text,
  event_date            date not null,
  start_time            time not null,
  end_time              time,
  venue                 text not null,
  organizer             text,
  registration_required boolean not null default false,
  od_available          boolean not null default false,
  registration_url      text,
  status                text not null default 'draft' check (status in ('draft','published','cancelled','completed')),
  created_at            timestamptz not null default now()
);

-- 3. event_registrations
create table if not exists event_registrations (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references students (id) on delete cascade,
  event_id      uuid not null references events (id) on delete cascade,
  status        text not null default 'registered' check (status in ('registered','cancelled','attended')),
  registered_at timestamptz not null default now(),
  unique (student_id, event_id)
);

-- 4. od_requests
create table if not exists od_requests (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references students (id) on delete cascade,
  event_id          uuid references events (id) on delete set null,
  reason            text not null,
  from_date         date not null,
  to_date           date not null,
  document_url      text,
  status            text not null default 'draft' check (status in ('draft','submitted','under_review','approved','rejected')),
  submitted_at      timestamptz default now(),
  reviewed_at       timestamptz,
  reviewed_by       uuid references auth.users (id),
  rejection_reason  text
);

-- 5. bus_routes
create table if not exists bus_routes (
  id            uuid primary key default gen_random_uuid(),
  route_name    text not null,
  origin        text not null,
  destination   text not null,
  active        boolean not null default true,
  is_temporary  boolean not null default false,
  valid_from    timestamptz,
  valid_until   timestamptz,
  created_at    timestamptz not null default now(),
  check (
    (is_temporary = false) or
    (is_temporary = true and valid_from is not null and valid_until is not null and valid_until > valid_from)
  )
);

-- 6. bus_stops
create table if not exists bus_stops (
  id            uuid primary key default gen_random_uuid(),
  route_id      uuid not null references bus_routes (id) on delete cascade,
  stop_name     text not null,
  stop_order    integer not null,
  arrival_time  time not null,
  latitude      numeric,
  longitude     numeric,
  unique (route_id, stop_order)
);

-- 7. campus_locations
create table if not exists campus_locations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        text not null check (type in ('classroom','lab','department','auditorium','canteen','library','office','gate','other')),
  building    text not null,
  floor       text,
  description text,
  latitude    numeric,
  longitude   numeric,
  created_at  timestamptz not null default now()
);

-- 8. notices
create table if not exists notices (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  content       text not null,
  category      text not null default 'general',
  published_at  timestamptz not null default now(),
  expires_at    timestamptz,
  verified      boolean not null default false,
  source        text,
  created_at    timestamptz not null default now()
);

-- 9. knowledge_documents
create table if not exists knowledge_documents (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  content       text not null,
  category      text not null,
  source        text,
  verified      boolean not null default false,
  updated_at    timestamptz not null default now(),
  search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || content)) STORED
);

-- 10. Indexes
create index if not exists idx_events_event_date on events (event_date);
create index if not exists idx_od_requests_student_id on od_requests (student_id);
create index if not exists idx_bus_routes_origin on bus_routes (origin);
create index if not exists idx_bus_stops_route_id on bus_stops (route_id);
create index if not exists idx_knowledge_search on knowledge_documents USING GIN (search_vector);

-- 11. Demo Seed Data
INSERT INTO events (id, title, description, event_date, start_time, end_time, venue, od_available, status) 
VALUES (
    'e1234567-e89b-12d3-a456-426614174000', 
    'Smart Campus Hackathon', 
    'A 24-hour hackathon to build smart campus solutions.',
    CURRENT_DATE + interval '1 day', 
    '09:00:00', 
    '17:00:00', 
    'Main Auditorium', 
    true, 
    'published'
);

INSERT INTO bus_routes (id, route_name, origin, destination) 
VALUES ('b1234567-e89b-12d3-a456-426614174000', 'Route 42 - Express', 'Tambaram', 'Campus Main Gate');

INSERT INTO bus_stops (route_id, stop_name, stop_order, arrival_time) 
VALUES 
    ('b1234567-e89b-12d3-a456-426614174000', 'Tambaram Sanatorium', 1, '07:15:00'),
    ('b1234567-e89b-12d3-a456-426614174000', 'Tambaram MEPZ', 2, '07:30:00'),
    ('b1234567-e89b-12d3-a456-426614174000', 'Campus Main Gate', 3, '08:20:00');

INSERT INTO knowledge_documents (title, category, content, verified) 
VALUES (
    'On-Duty (OD) Rules for Hackathons', 
    'od', 
    'Students participating in recognized campus hackathons are eligible for 2 days of OD. Apply via the OD portal at least 1 day prior.',
    true
);