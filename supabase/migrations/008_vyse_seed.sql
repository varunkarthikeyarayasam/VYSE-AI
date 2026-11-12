-- ============================================================================
-- 008_vyse_seed.sql — Realistic Academics, Attendance, and Campus Life Data
-- ============================================================================

-- 1. Courses
insert into courses (id, code, name, department, year, semester, credits)
values
  ('c1000000-0001-0000-0000-000000000001', 'CS301', 'Distributed Cloud Architecture', 'Computer Science', 3, 5, 4),
  ('c1000000-0002-0000-0000-000000000002', 'CS302', 'Artificial Intelligence & Agentic Systems', 'Computer Science', 3, 5, 4),
  ('c1000000-0003-0000-0000-000000000003', 'CS303', 'Full-Stack Reactive Engineering', 'Computer Science', 3, 5, 3),
  ('c1000000-0004-0000-0000-000000000004', 'CS304', 'Database Internals & Distributed Storage', 'Computer Science', 3, 5, 3)
on conflict (code) do nothing;

-- 2. Timetable (Scheduled across weekdays, including current day of week)
do $$
declare
  v_day integer;
begin
  for v_day in 1..5 loop
    insert into timetable (course_id, section, day_of_week, start_time, end_time, room, faculty_id)
    values
      ('c1000000-0001-0000-0000-000000000001', 'B', v_day, '08:30:00', '09:30:00', 'Anna Block - 302', '99999999-9999-9999-9999-999999999999'),
      ('c1000000-0002-0000-0000-000000000002', 'B', v_day, '09:45:00', '10:45:00', 'Bharathi Block - Lab 4', '99999999-9999-9999-9999-999999999999'),
      ('c1000000-0003-0000-0000-000000000003', 'B', v_day, '11:00:00', '12:00:00', 'Anna Block - 302', '99999999-9999-9999-9999-999999999999'),
      ('c1000000-0004-0000-0000-000000000004', 'B', v_day, '13:30:00', '14:30:00', 'Innovation Lab', '99999999-9999-9999-9999-999999999999')
    on conflict do nothing;
  end loop;
end $$;

-- 3. Attendance records (Calculated to yield exactly ~82% attendance for Arjun Kumar)
do $$
declare
  v_date date;
  v_c1 uuid := 'c1000000-0001-0000-0000-000000000001';
  v_c2 uuid := 'c1000000-0002-0000-0000-000000000002';
  v_c3 uuid := 'c1000000-0003-0000-0000-000000000003';
  v_arjun uuid := '11111111-1111-1111-1111-111111111111';
  v_divya uuid := '22222222-2222-2222-2222-222222222222';
  v_faculty uuid := '99999999-9999-9999-9999-999999999999';
  v_idx integer := 0;
  v_status text;
begin
  for v_idx in 1..25 loop
    v_date := current_date - (v_idx || ' days')::interval;
    -- Exclude weekends
    if extract(isodow from v_date) <= 5 then
      -- Course 1: Arjun (absent every 6th day)
      v_status := case when v_idx % 6 = 0 then 'absent' else 'present' end;
      insert into attendance (student_id, course_id, date, status, marked_by)
      values (v_arjun, v_c1, v_date, v_status, v_faculty)
      on conflict (student_id, course_id, date) do nothing;

      -- Course 2: Arjun
      v_status := case when v_idx % 5 = 0 then 'absent' else 'present' end;
      insert into attendance (student_id, course_id, date, status, marked_by)
      values (v_arjun, v_c2, v_date, v_status, v_faculty)
      on conflict (student_id, course_id, date) do nothing;

      -- Course 3: Arjun present
      insert into attendance (student_id, course_id, date, status, marked_by)
      values (v_arjun, v_c3, v_date, 'present', v_faculty)
      on conflict (student_id, course_id, date) do nothing;

      -- Divya attendance
      insert into attendance (student_id, course_id, date, status, marked_by)
      values (v_divya, v_c1, v_date, 'present', v_faculty)
      on conflict (student_id, course_id, date) do nothing;
    end if;
  end loop;
end $$;

-- 4. OD Policy Rules
insert into od_rules (rule_name, min_attendance_percent, applicable_event_types, max_od_days_per_semester, description, active)
values (
  'Standard Academic OD Policy (2026)',
  75.0,
  array['hackathon', 'workshop', 'competition', 'cultural', 'sports'],
  3,
  'Requires mandatory 75% aggregate attendance. Maximum of 3 On-Duty days granted per semester for approved campus events.',
  true
)
on conflict (rule_name) do nothing;

-- 5. Academic Calendar
insert into academic_calendar (title, description, event_date, category)
values
  ('Smart Campus Hackathon Demo Day', 'Annual 24-hour hackathon judging and presentations.', current_date + 1, 'event'),
  ('Continuous Assessment Test 2 (CAT-2)', 'Mid-term examinations for semester 5 subjects.', current_date + 12, 'exam'),
  ('National Innovation & Technology Day', 'Institutional holiday celebrating student innovators.', current_date + 18, 'holiday'),
  ('Final Semester Project Milestone 1', 'Submission of system architecture and API documentation.', current_date + 25, 'academic_deadline')
on conflict do nothing;

-- 6. Marketplace Items
insert into marketplace_items (seller_id, title, description, price, category, status)
values
  ('11111111-1111-1111-1111-111111111111', 'Distributed Systems: Concepts and Design (5th Edition)', 'Hardcover textbook, like new condition, essential for CS301 syllabus.', 450.00, 'books', 'available'),
  ('22222222-2222-2222-2222-222222222222', 'Raspberry Pi 4 Model B (4GB RAM) with Aluminum Case & 32GB SD', 'Perfect for IoT or embedded systems coursework. Comes pre-flashed.', 3200.00, 'electronics', 'available'),
  ('33333333-3333-3333-3333-333333333333', 'CSE Lab Coat (Unisex, Size M)', 'Official university laboratory coat in clean, excellent condition.', 250.00, 'uniform', 'available')
on conflict do nothing;

-- 7. Notifications
insert into notifications (user_id, title, body, category, action_url)
values
  ('11111111-1111-1111-1111-111111111111', 'Special Hackathon Bus Service', 'A direct morning bus from Tambaram has been scheduled for tomorrow at 07:00 AM.', 'transport', '/transport'),
  ('11111111-1111-1111-1111-111111111111', 'Attendance Advisory', 'Your current aggregate attendance is 82.0%, satisfying the 75% OD eligibility requirement.', 'academic', '/academics')
on conflict do nothing;