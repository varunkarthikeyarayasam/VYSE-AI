-- 011_exams_and_block_m.sql
-- Populate CAT-2 exams for Semester 5 courses and register Block M in campus_locations

-- 1. CAT-2 Exams
insert into exams (id, course_id, exam_type, exam_date, max_marks)
values
  ('e1000000-0001-0000-0000-000000000001', 'c1000000-0001-0000-0000-000000000001', 'cat2', current_date + 11, 50),
  ('e1000000-0002-0000-0000-000000000002', 'c1000000-0002-0000-0000-000000000002', 'cat2', current_date + 12, 50),
  ('e1000000-0003-0000-0000-000000000003', 'c1000000-0003-0000-0000-000000000003', 'cat2', current_date + 13, 50),
  ('e1000000-0004-0000-0000-000000000004', 'c1000000-0004-0000-0000-000000000004', 'cat2', current_date + 14, 50)
on conflict (id) do update set
  exam_date = excluded.exam_date,
  max_marks = excluded.max_marks;

-- 2. Ensure Block M is registered in campus_locations
insert into campus_locations (id, name, type, building, floor, description, latitude, longitude, open_time, close_time, active)
values
  (
    'c1000000-0000-0000-0000-000000000007',
    'Block M (Room 302 - Computer Science)',
    'classroom',
    'Block M',
    '3rd Floor (Room 302)',
    'Primary lecture halls, software engineering labs, and smart classrooms for CS/IT departments.',
    12.8415,
    80.1538,
    '08:00:00',
    '20:00:00',
    true
  )
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description;
