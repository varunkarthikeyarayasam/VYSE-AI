-- ============================================================================
-- CAMPORA — 0004_seed.sql
-- DEMO / SEED DATA ONLY. Not for production use.
--
-- NOTE ON auth.users: this seed inserts directly into auth.users so the demo
-- works out of the box against a fresh local/hosted Supabase project. This
-- only works when run with sufficient privileges (e.g. `supabase db reset`,
-- or pasted into the Supabase SQL Editor as the postgres role). In a normal
-- app, users are created via Supabase Auth (signUp), not raw SQL.
--
-- All dates are computed relative to CURRENT_DATE so the "hackathon
-- tomorrow" demo always works no matter when you run this seed.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Demo auth users (password for all demo accounts: "Campora@123")
-- ----------------------------------------------------------------------------
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data
)
values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'arjun.kumar@demo.campora.edu', crypt('Campora@123', gen_salt('bf')), now(), now(), now(), '{}', '{}'),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'divya.s@demo.campora.edu', crypt('Campora@123', gen_salt('bf')), now(), now(), now(), '{}', '{}'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'rahul.m@demo.campora.edu', crypt('Campora@123', gen_salt('bf')), now(), now(), now(), '{}', '{}'),
  ('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'faculty.admin@demo.campora.edu', crypt('Campora@123', gen_salt('bf')), now(), now(), now(), '{}', '{}')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- students  (Arjun lives in Tambaram — the hero of our demo)
-- ----------------------------------------------------------------------------
insert into students (id, name, email, roll_number, department, year, section, home_location)
values
  ('11111111-1111-1111-1111-111111111111', 'Arjun Kumar', 'arjun.kumar@demo.campora.edu', '21CSE045', 'Computer Science', 3, 'B', 'Tambaram, Chennai'),
  ('22222222-2222-2222-2222-222222222222', 'Divya S', 'divya.s@demo.campora.edu', '21ECE012', 'Electronics & Communication', 3, 'A', 'Velachery, Chennai'),
  ('33333333-3333-3333-3333-333333333333', 'Rahul M', 'rahul.m@demo.campora.edu', '22IT098', 'Information Technology', 2, 'C', 'Chromepet, Chennai')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- admin_users  (faculty/admin demo account)
-- ----------------------------------------------------------------------------
insert into admin_users (user_id, role)
values ('99999999-9999-9999-9999-999999999999', 'faculty')
on conflict (user_id) do nothing;

-- ----------------------------------------------------------------------------
-- campus_locations
-- ----------------------------------------------------------------------------
insert into campus_locations (name, type, building, floor, description, latitude, longitude)
values
  ('Main Auditorium', 'auditorium', 'Anna Block', 'Ground', 'Primary venue for large college events, hackathons and seminars.', 12.8406, 80.1534),
  ('CSE Department Office', 'department', 'Bharathi Block', '2nd Floor', 'Computer Science & Engineering department office.', 12.8409, 80.1531),
  ('Central Library', 'library', 'Library Block', 'Ground', 'Main campus library.', 12.8412, 80.1529),
  ('Innovation Lab', 'lab', 'Anna Block', '1st Floor', 'Hackathon and innovation lab space, adjacent to the Main Auditorium.', 12.8407, 80.1535),
  ('Main Gate', 'gate', 'Campus Entrance', null, 'Primary entrance/exit and bus boarding point.', 12.8399, 80.1520),
  ('Canteen', 'canteen', 'Student Center', 'Ground', 'Main student canteen.', 12.8404, 80.1526)
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- events  (5 total; one hackathon happening tomorrow, OD-eligible)
-- ----------------------------------------------------------------------------
insert into events (id, title, description, event_date, start_time, end_time, venue, organizer, registration_required, od_available, registration_url, status)
values
  ('aaaaaaaa-0001-0001-0001-000000000001',
   'Code Sprint 24-Hour Hackathon',
   'A 24-hour on-campus hackathon for students to build AI and full-stack projects. OD is available for registered participants.',
   current_date + 1, '08:00', '18:00', 'Main Auditorium', 'CSE Department & IEEE Student Chapter',
   true, true, 'https://forms.example.edu/hackathon-register', 'published'),

  ('aaaaaaaa-0002-0002-0002-000000000002',
   'Guest Lecture: Cloud Architecture at Scale',
   'Industry expert session on distributed systems and cloud infrastructure.',
   current_date + 3, '10:00', '11:30', 'CSE Seminar Hall', 'CSE Department',
   false, false, null, 'published'),

  ('aaaaaaaa-0003-0003-0003-000000000003',
   'Inter-College Cultural Fest — Zenith',
   'Annual cultural festival with music, dance and drama competitions.',
   current_date + 10, '09:00', '20:00', 'Main Auditorium & Grounds', 'Student Affairs Council',
   true, true, 'https://forms.example.edu/zenith-register', 'published'),

  ('aaaaaaaa-0004-0004-0004-000000000004',
   'Placement Prep: Resume & Aptitude Bootcamp',
   'Career services workshop covering resume building and aptitude test practice.',
   current_date + 5, '14:00', '16:30', 'Central Library Seminar Room', 'Training & Placement Cell',
   true, false, 'https://forms.example.edu/placement-bootcamp', 'published'),

  ('aaaaaaaa-0005-0005-0005-000000000005',
   'Robotics Club Weekly Meetup',
   'Weekly build session for the Robotics Club.',
   current_date + 2, '16:00', '18:00', 'Innovation Lab', 'Robotics Club',
   false, false, null, 'published')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- event_registrations
-- Arjun is registered for the hackathon (drives the primary demo).
-- Divya is registered for the cultural fest. Rahul is unregistered anywhere.
-- ----------------------------------------------------------------------------
insert into event_registrations (student_id, event_id, status)
values
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-000000000001', 'registered'),
  ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-0003-0003-0003-000000000003', 'registered')
on conflict (student_id, event_id) do nothing;

-- ----------------------------------------------------------------------------
-- bus_routes — normal route + temporary event-day route for the hackathon
-- ----------------------------------------------------------------------------
insert into bus_routes (id, route_name, origin, destination, active, is_temporary, valid_from, valid_until)
values
  ('bbbbbbbb-0001-0001-0001-000000000001',
   'Tambaram Regular Service', 'Tambaram', 'VIT Chennai Campus', true, false, null, null),

  ('bbbbbbbb-0002-0002-0002-000000000002',
   'Tambaram Hackathon Special', 'Tambaram', 'VIT Chennai Campus', true, true,
   (current_date + 1)::timestamptz + interval '5 hours',   -- 05:00 on hackathon day
   (current_date + 1)::timestamptz + interval '20 hours')  -- 20:00 on hackathon day
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- bus_stops
-- ----------------------------------------------------------------------------
insert into bus_stops (route_id, stop_name, stop_order, arrival_time, latitude, longitude)
values
  -- Normal route — departs Tambaram 07:20
  ('bbbbbbbb-0001-0001-0001-000000000001', 'Tambaram Railway Station', 1, '07:20', 12.9249, 80.1000),
  ('bbbbbbbb-0001-0001-0001-000000000001', 'Chromepet Signal', 2, '07:35', 12.9516, 80.1409),
  ('bbbbbbbb-0001-0001-0001-000000000001', 'Pallavaram Bus Depot', 3, '07:48', 12.9675, 80.1497),
  ('bbbbbbbb-0001-0001-0001-000000000001', 'VIT Chennai Main Gate', 4, '08:30', 12.8399, 80.1520),

  -- Temporary hackathon-day special — departs earlier, 07:00, fewer stops
  ('bbbbbbbb-0002-0002-0002-000000000002', 'Tambaram Railway Station', 1, '07:00', 12.9249, 80.1000),
  ('bbbbbbbb-0002-0002-0002-000000000002', 'Pallavaram Bus Depot', 2, '07:25', 12.9675, 80.1497),
  ('bbbbbbbb-0002-0002-0002-000000000002', 'VIT Chennai Main Gate', 3, '08:00', 12.8399, 80.1520)
on conflict (route_id, stop_order) do nothing;

-- ----------------------------------------------------------------------------
-- notices  (verified)
-- ----------------------------------------------------------------------------
insert into notices (title, content, category, verified, source, expires_at)
values
  ('Hackathon Special Bus Service Activated',
   'A special early-departure bus service from Tambaram will run on the day of Code Sprint 24-Hour Hackathon to help participants reach campus on time.',
   'transport', true, 'Transport Office', (current_date + 2)::timestamptz),

  ('OD Submission Deadline Reminder',
   'Students requesting On-Duty (OD) leave for the hackathon must submit their OD request at least one day in advance through CAMPORA or the department office.',
   'academic', true, 'Dean of Student Affairs', (current_date + 2)::timestamptz)
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- knowledge_documents  (verified institutional knowledge)
-- ----------------------------------------------------------------------------
insert into knowledge_documents (title, content, category, source, verified)
values
  ('OD (On-Duty) Policy for Hackathons and Technical Events',
   'Students participating in college-approved hackathons, technical competitions or workshops are eligible for On-Duty (OD) leave, provided the event is registered on CAMPORA and the student has a valid event registration. OD requests must be submitted at least 24 hours before the event date wherever possible, along with the event name and reason. Requests are reviewed by the respective department''s faculty coordinator. Approved OD is treated as present for attendance calculation.',
   'OD rules', 'Dean of Student Affairs Handbook 2026', true),

  ('Attendance Requirement Policy',
   'A minimum of 75% attendance is mandatory in each subject per semester to be eligible to write end-semester examinations. Approved OD leave counts towards the attendance percentage as present.',
   'attendance rules', 'Academic Regulations 2026', true),

  ('Event Registration & Participation Guidelines',
   'All college-organized events requiring participation credit or OD eligibility must be registered on the CAMPORA platform by the organizing department or club. Students must register individually before the event to be eligible for OD or participation certificates.',
   'event policies', 'Student Affairs Council', true),

  ('Campus Bus Transport Guidelines',
   'Regular campus bus routes operate on fixed daily schedules. On days with major college events, the Transport Office may activate temporary special routes with adjusted timings to help students reach campus on time. Temporary routes are shown only while active.',
   'campus procedures', 'Transport Office', true),

  ('Department Office Contact & Working Hours',
   'Department offices are open from 9:00 AM to 5:00 PM on working days. Students can collect OD approval letters and submit physical documents (if required) at their respective department office.',
   'department information', 'Academic Office', true)
on conflict do nothing;