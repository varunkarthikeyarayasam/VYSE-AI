-- ============================================================================
-- 012_sathyabama_official_documents.sql
-- Verified Sathyabama Institutional Regulations, Handbook & Curriculum Corpus
-- ============================================================================

-- 1. Clear previous mock entries to maintain absolute data integrity
DELETE FROM knowledge_documents WHERE verified = true;

-- 2. Insert verified official regulatory chunks
INSERT INTO knowledge_documents (title, content, category, source, verified) VALUES
  ('Library Book Issue Limit and Loan Period', 'Four books are issued to a member for 30 Days and they must be returned on or before the last date stamped on the date-slip of each document. All readers are required to maintain strict discipline. Library Staff will not be responsible for readers'' personal books.

[Citation: [Central Library Rules & Regulations, Rule 1]]', 'Library', 'Central Library Rules & Regulations - Rule 1: Book Issue & Loan Period', true),
  ('Library Overdue Fines & Book Renewal Policy', 'Any overdue book should be either returned or renewed on or before the due date. An overdue book will be charged a late fine of Re. 1/- per day per book.

[Citation: [Central Library Rules & Regulations, Rule 11]]', 'Library', 'Central Library Rules & Regulations - Rule 11: Overdue Fines and Renewals', true),
  ('Policy for Lost Books and Replacement Costs', 'Every reader who loses a book must report to the University Library immediately and will be given one month time for finding and return of the book. In case the member fails to return the book after one month from the date of reporting, a fine of Re. 1/- per day per book will be charged till the book is replaced with a new copy of the same title, edition, and details. In case the borrower cannot replace the book, he/she will be required to pay TWO TIMES (2x) the cost of the book.

[Citation: [Central Library Rules & Regulations, Rule 9]]', 'Library', 'Central Library Rules & Regulations - Rule 9: Lost Book Reporting and Replacement Penalty', true),
  ('Library Property Damage, Marking and Page Tearing Disciplinary Actions', 'Members are responsible for any damage caused to books or library property and shall pay the penalty imposed by the Librarian. Underlining, marking, or folding of pages in library books is strictly prohibited. Members caught tearing pages or stealing books will be suspended forthwith from using library facilities and further institutional disciplinary action will be initiated. Readers must check books before borrowing (reporting torn, soiled, or loose binding at the counter) as the borrower is held responsible for condition upon return.

[Citation: [Central Library Rules & Regulations, Rules 2, 3, 7 & 8]]', 'Library', 'Central Library Rules & Regulations - Rules 2, 3, 7, 8: Book Damage, Marking and Tearing Suspension', true),
  ('Final Year Students Book Return & No Due Certificate', 'All final year students must return all books borrowed from the Central Library before the commencement of the final project review and obtain a No Due Certificate from the Library.

[Citation: [Central Library Rules & Regulations, Rule 10]]', 'Library', 'Central Library Rules & Regulations - Rule 10: Final Year No Due Certificate', true),
  ('Library Timings, Dress Code, and Digital Access (Knimbus / mLibrary)', 'Students entering the library must have proper inning (tucking) of shirts and must wear their ID card visibly at all times. Central Library timings are 8:00 AM to 8:00 PM on all working days. The collection encompasses 317,325 books of 53,402 titles, 3,278 CDs/DVDs, 153 print journals, and major e-resources (IEEE, Science Direct, ASME, ACM). 24x7 off-campus remote access is available via Knimbus (https://sist.knimbus.com/) and the mLibrary mobile app.

[Citation: [Central Library Rules & Regulations, Rule 12 & Handbook Page 16]]', 'Library', 'Central Library Rules & Regulations & Student Handbook - Rule 12 & Central Library Resources: Timings & Entry Protocol', true),
  ('Programme Duration and Maximum Completion Limits for UG', 'Regular Entry: Expected normal duration for B.E./B.Tech is 4 academic years (8 semesters). The maximum permitted period is 6 academic years (12 consecutive semesters, including break of study). Lateral Entry: Minimum duration is 3 academic years (6 semesters); maximum duration is 5 academic years (10 consecutive semesters). Each semester consists of normally 75 working days or 500 hours maximum.

[Citation: [Academic Regulations 2023, Clause 6]]', 'Academics', 'Academic Regulations 2023 - Clause 6: Duration of the Programme', true),
  ('Mandatory Attendance Thresholds (80% / 60% Condonation / Crash Course)', 'Every student is expected to maintain 100% attendance. A minimum of 80% attendance in each course is compulsory to appear for End Semester Examinations (ESE). Condonation: Students securing attendance between 60% and 80% may be permitted to write ESE only for unavoidable medical emergencies or institution representation, subject to forwarding by HoD and approval by Dean (Student Affairs). Ineligibility: Students with less than 60% or unapproved shortage are not permitted to write ESE. Students who missed CAE and minimum attendance due to approved emergencies must undergo a 30-hour departmental crash course and maintain 80% attendance in it.

[Citation: [Academic Regulations 2023, Clause 22.2]]', 'Attendance', 'Academic Regulations 2023 - Clause 22.2: Attendance Requirements for Semester Completion & ESE', true),
  ('On Duty (OD) Policy and Semester Allowances (Max 6 Days)', 'Students may avail a maximum of six (6) days ON DUTY (OD) per semester for co-curricular and extracurricular activities (symposiums, workshops, seminars, hackathons, sports). Prior written permission from the Head of the Department (HoD) is mandatory. Proof of attendance (certificate of participation/appreciation) must be submitted to the mentor/counselor immediately upon reporting back. OD for internships requires prior approval from HoD, Dean of School, and Dean (Student Affairs).

[Citation: [Academic Regulations 2023, Clause 7 & Handbook Page 14]]', 'Attendance', 'Academic Regulations 2023 - Clause 7: Attendance Regulations — On Duty (OD) Allowances', true),
  ('50-50 Evaluation Scheme: CAE1, CAE2, Assignments, and ESE', 'Continuous evaluation follows a 50-50 percentage weightage system between internal and external examinations. Theory Courses: Two Continuous Assessment Examinations (CAE1 & CAE2) conducted for 50 marks each. The combined score out of 100 is converted to 40 Marks. Course assignments carry 10 Marks, totaling 50 Internal Marks. End Semester Examinations (ESE) are conducted for 100 marks and scaled down to 50 Marks. Total course mark = 50 Internal + 50 External = 100 Marks. Practical Courses: Continuous session-wise assessment carries 30 marks; Model practical exam carries 20 marks; ESE practical carries 50 marks.

[Citation: [Academic Regulations 2023, Clause 20.1 & 20.2]]', 'Exams', 'Academic Regulations 2023 - Clause 20: Examinations and Assessment Weightages', true),
  ('Course Passing Criteria (50% Overall with Minimum 30% in ESE)', 'A candidate must secure not less than 50% of the total marks prescribed for the course (continuous assessment + end semester exam combined) to be declared as PASS. Crucially, the student must secure a minimum of 30% marks in the End Semester Examination itself (i.e., at least 15 out of 50 in scaled ESE or 30 out of 100). If a candidate fails, he/she must re-register and reappear for the course examination in subsequent semesters until securing a minimum ''C'' grade.

[Citation: [Academic Regulations 2023, Clause 22.1]]', 'Exams', 'Academic Regulations 2023 - Clause 22.1: Passing Requirements', true),
  ('Arrear Registrations and Internal Marks Retention', 'If a student acquires RA (Reappear) or AAA (Absent) in the End Semester Examination of a course, he/she retains the existing Internal Assessment Marks acquired from Continuous Assessment Examinations. The student simply pays the exam registration fee and rewrites the ESE in subsequent semesters until securing a minimum ''C'' grade. There is no restriction on the number of attempts taken to clear the course.

[Citation: [Academic Regulations 2023, Clause 8.2]]', 'Exams', 'Academic Regulations 2023 - Clause 8.2: Arrear Course Registrations', true),
  ('End Semester Examination Revaluation Rules', 'A candidate can apply for revaluation of his/her End Semester Examination answer paper in a theory course immediately after result declaration within TWO (2) WEEKS, on payment of the prescribed fee through the ERP portal. Revaluation is strictly NOT permitted for practical courses and for project work.

[Citation: [Academic Regulations 2023, Clause 21.2 & Clause 6]]', 'Exams', 'Academic Regulations 2023 - Clause 21.2: Revaluation Guidelines', true),
  ('Degree Honors & Classification: Exemplary, Distinction, First Class, Second Class', 'Degree classification criteria for B.E./B.Tech (calculated from 1st semester): 1. First Class with Exemplary: CGPA >= 9.00 passed in first appearance within 8 semesters (6 for lateral). 2. First Class with Distinction: CGPA >= 7.50 and < 9.00 passed in first appearance within 8 semesters (6 for lateral). 3. First Class: CGPA >= 6.00 and < 7.50 passed within 8 semesters (plus authorized break of study semesters). 4. Second Class: CGPA >= 5.00 and < 6.00 passed within maximum 12 semesters (10 for lateral). Minimum CGPA required for degree award is 5.00.

[Citation: [Academic Regulations 2023, Clause 27 & Clause 24]]', 'Academics', 'Academic Regulations 2023 - Clause 27: Classification of Degree Awarded', true),
  ('10-Point Grading Scale & Grade Points (A++ to RA)', 'Academic Regulations 2023 Grading System: 90-100 marks: A++ (Grade Point 10); 80-89 marks: A+ (Grade Point 9); 70-79 marks: B++ (Grade Point 8); 60-69 marks: B+ (Grade Point 7); 50-59 marks: C (Grade Point 6); 00-49 marks: RA (Reappear, Grade Point 0); Absent: AAA (Grade Point 0); Withdrawal: W (Grade Point 0); Authorized Break of Study: ABS (Grade Point 0). Note: RA, AAA, W, and ABS are excluded from GPA and CGPA calculations.

[Citation: [Academic Regulations 2023, Clause 24]]', 'Exams', 'Academic Regulations 2023 - Clause 24: Range of Marks for Grades', true),
  ('Criteria for Minor Degree and Honors Degree (18 Additional Credits)', 'Honors Degree: Students with CGPA > 8.5 at the end of the 4th semester are eligible. Must earn 18 additional credits (4-6 courses) from the department''s Honors Electives list (max 6 credits through NPTEL/SWAYAM). Minor Degree: Students with CGPA > 7.5 at the end of the 4th semester can take an 18-credit minor in any other engineering discipline starting from semester 5. Minimum 20 students needed to float a minor track. Degree title will reflect ''B.E. in CSE with Minor in Electrical Engineering''.

[Citation: [Academic Regulations 2023, Clauses 17 & 18]]', 'Academics', 'Academic Regulations 2023 - Clauses 17 & 18: Minor Degree and Honors Degree Regulations', true),
  ('Professional Training (PT I & II) & Hackathon Exemption Policy', 'Professional Training I (Semester 5, 2 credits) and Training II / Interdisciplinary Project (Semester 6, 3 credits) require minimum 2 weeks industrial/research internship during vacation. Special Exemption: Students who represent the Institution in International Level Hackathons/Buildathons or who win National Level Hackathons/Buildathons are exempted from pursuing Professional Training I (2 credits from Semester 5). Students submit their event project report for grade approval.

[Citation: [Academic Regulations 2023, Clauses 11.1 & 11.4]]', 'Academics', 'Academic Regulations 2023 - Clause 11: Experiential Learning & Hackathon Exemption', true),
  ('Exam Scribe Facility and 30-Minute Extra Time Guidelines', 'Divyangjan students or those with temporary physical disability/injury may apply for a scribe with medical certificate submitted to the CoE office at least 2 days prior to the exam. Scribes cannot be students or degree holders of technical programmes with similar competency. Students with certified reading/writing disability are allowed 30 minutes extra time per exam paper upon submitting proof to CoE at least 3 days in advance.

[Citation: [Academic Regulations 2023, Clause 21.3]]', 'Exams', 'Academic Regulations 2023 - Clause 21.3: Scribe and Compensatory Time for Examinations', true),
  ('Course Withdrawal Procedures & Authorized Break of Study', 'Course Withdrawal: Permitted once during programme for valid medical or family emergencies, provided application is submitted at least 5 days prior to examination commencement with HoD recommendation. Withdrawal does not count as an attempt or affect First Class eligibility. Authorized Break of Study: Granted once for valid reasons (e.g. accident, prolonged illness) for up to one year. Application must be submitted before the semester reopening day through HoD. Break of study semesters do not count against First Class 8-semester limit.

[Citation: [Academic Regulations 2023, Clauses 28 & 29]]', 'Academics', 'Academic Regulations 2023 - Clauses 28 & 29: Course Withdrawal and Authorized Break of Study', true),
  ('Post Graduate (M.E./M.Tech/MCA/MBA) Duration, Attendance & Grades', 'PG Programmes: Normal duration is 4 semesters for M.E./M.Tech/M.Sc/MBA/M.Arch (max 8 semesters), 6 semesters for MCA, and 10 semesters for 5-year integrated M.Sc. Attendance: Minimum 90% attendance required to complete semester. Examinations: 50% Internal (CAE) + 50% External (ESE). Grading: S (90-100, GP 10), A+ (80-89, GP 9), A (70-79, GP 8), B (60-69, GP 7), C (50-59, GP 6), F (0-49, GP 0). Degree: Minimum 5.0 CGPA required; Distinction for CGPA >= 7.50 in first appearance; First Class for 6.00 to 7.49.

[Citation: [PG Course Regulations — Credit System, Clauses 2, 3, 4 & 6]]', 'Academics', 'PG Course Regulations — Credit System - Clauses 2, 3, 4, 6: PG Duration, Attendance and Grading', true),
  ('Class Hours (9:00 AM – 3:15 PM) & Day Scholar Bus Timings (8:45 AM / 3:30 PM)', 'Academic Class Hours: 9:00 A.M. to 3:15 P.M. for all UG and PG programmes. Day Scholar Bus Schedule: Buses arrive at the campus by 8:45 A.M. and depart from the campus at 3:30 P.M. Sathyabama operates an extensive fleet of over 175 bus routes across Chennai and suburbs. Day scholars must board only at the boarding point designated on their ID card and cannot change buses without authorization.

[Citation: [Student Handbook 2025-26, Pages 14 & 27]]', 'Transport', 'Student Handbook 2025-26 - Academics & Transport: Daily Timings & Bus Fleet', true),
  ('Identity Card Mandatory Wear & Replacement Cost (₹500 / ₹250)', 'Wearing the official ID card is mandatory inside the campus, in institutional buses, in dining mess halls, and while representing the University in external events. Loss or Damage: Duplicate identity cards are issued through the Student Help Desk upon submitting an application and paying ₹ 500/- for (Card + Pouch + Lanyard) or ₹ 250/- for (Card only).

[Citation: [Student Handbook 2025-26, Page 14]]', 'Fees & Scholarships', 'Student Handbook 2025-26 - Academics: Identity Card Regulations and Duplicate Fees', true),
  ('Campus Dress Code & Strictly Prohibited Attire', 'Dress Code Policy: Boys must wear Formals or Jeans with a decent collared T-shirt, along with formal or sports shoes. Girls must wear Churidar / Salwar Kameez / Jeans and Kurtas. Strictly Prohibited Attire: Skirts, Sleeveless Tops, Torn Jeans, T-Shirts with obscene graphics/language, and Trousers with excessive cargo pockets are strictly prohibited. Placement Sessions: Full formal attire is compulsory for all placement interviews.

[Citation: [Student Handbook 2025-26, Page 31]]', 'Discipline', 'Student Handbook 2025-26 - Do''s and Don''ts: Dress Code and General Campus Discipline', true),
  ('Mobile Phone Ban in Classrooms, Laboratories & Libraries', 'Students are strictly not allowed to use mobile phones inside classrooms, laboratories, Central Library, or examination auditoriums. Disciplinary action will be taken if phones are used during academic instructional sessions.

[Citation: [Student Handbook 2025-26, Page 31]]', 'Discipline', 'Student Handbook 2025-26 - Do''s and Don''ts: Mobile Phone Restrictions', true),
  ('Zero-Tolerance Anti-Ragging Regulations (TN Act 1997 & Affidavit)', 'Ragging in any form is a criminal, non-bailable offense strictly prohibited inside and outside the campus under Tamil Nadu Prohibition of Ragging Act No. 7 of 1997. Involvement leads to immediate dismissal and police action. All students and parents must submit an online undertaking at https://sist.sathyabama.ac.in/arc/ within 15 days of commencement, plus a notarized ₹ 100/- non-judicial stamp paper affidavit. Anti-Ragging Cell In-charge: Dr. J. Jabez (arc@sathyabama.ac.in, 9841185953).

[Citation: [Student Handbook 2025-26, Pages 24, 26, 31]]', 'Discipline', 'Student Handbook 2025-26 - Do''s and Don''ts & Student Support: Anti-Ragging Policy', true),
  ('Dining Halls, Free Lunch Policy, and Separate Veg/Non-Veg Sections', 'All students are provided with nutritious lunch every working day. Dedicated separate mess halls operate for Boys and Girls, each featuring designated Vegetarian and Non-Vegetarian counters. Wearing the institutional ID card is mandatory to enter the mess halls.

[Citation: [Student Handbook 2025-26, Page 28]]', 'Student Support', 'Student Handbook 2025-26 - Assistance & Opportunities: Campus Dining & Food Services', true),
  ('Emergency & Student Support Directory (Help Desk, Grievance, Counseling, COE)', 'Key Campus Support Contacts:
• Student Help Desk: studenthelpdesk@sathyabama.ac.in (Certificates, fees, medical transit)
• Student Grievance Redressal Cell: Dr. S. Barani (student_grievance@sathyabama.ac.in, Ph: 9962933341)
• Student Counseling & Psychological Support: Dr. R. Parveen Banu (scps@sathyabama.ac.in, Ph: 9364444129)
• Anti-Ragging Cell: Dr. J. Jabez (arc@sathyabama.ac.in, Ph: 9841185953)
• Controller of Examinations (COE): Dr. S. Igni Sabasti Prabu (coe@sathyabama.ac.in)
• Internal Examinations Cell: Dr. V. Sivachidambaranathan (internalexams@sathyabama.ac.in)
• Placement Cell: Dr. E. John Bruce (placement@sathyabama.ac.in, Ph: 9840227823)
• Transport In-Charge: Mr. R. Sathish (transport@sathyabama.ac.in, Ph: 9962757181)
• Higher Studies & Skill Development: Dr. D. Susitra (dean.higherstudies@sathyabama.ac.in, Ph: 9884720170)
• Startup Cell: Dr. A. Sivasankari (startupcell@sathyabama.ac.in)
• Minority Scholarships: Mr. M. Balamurugan (scholarship@sathyabama.ac.in)
• Sports Director: Mr. K. Ravikumar (sports@sathyabama.ac.in)
• Cultural Coordinator: Dr. J. Refonaa (culturals@sathyabama.ac.in)
• Dean, School of Computing: Dr. L. Lakshmanan (dean.computing@sathyabama.ac.in)
• CSE HOD: Dr. L. Lakshmanan (csehod@sathyabama.ac.in)
• CSE Specialization HODs: Dr. P. Ajitha (csehod_cs@sathyabama.ac.in), Dr. Senduru Srinivasulu (csehod_ai@sathyabama.ac.in)

[Citation: [Student Handbook 2025-26, Pages 12, 24, 25]]', 'Student Support', 'Student Handbook 2025-26 - Student Support Systems: Key Administrative Contacts Directory', true),
  ('Chancellor''s Merit Scholarship, Government Grants & Train Pass Concession', 'Merit Scholarships: Awarded to the Top 3 rank holders in every semester through ''Chancellor''s Merit Scholarship'' based on consistent ESE academic performance, as well as top rankers in the SAEEE entrance test. Minority Scholarships & Travel: Government minority scholarships and railway ticket concession procedures are handled by Scholarship In-Charge Mr. M. Balamurugan (scholarship@sathyabama.ac.in).

[Citation: [Student Handbook 2025-26, Page 26]]', 'Fees & Scholarships', 'Student Handbook 2025-26 - Assistance: Merit Scholarships, Minority Grants & Train Concession', true),
  ('Examination Malpractice Inquiry Committee and Punitive Actions', 'Academic malpractice in Continuous Assessment Examinations (CAE) or End Semester Examinations (ESE) is strictly prohibited. Students caught in malpractice are summoned before the Examination Review / Unfair Means Committee (comprising the COE, Chief Superintendent, and a senior faculty nominee). Punishments range from cancellation of examination papers to semester suspension or termination of studies. Under university regulations, no supplementary examination is permitted for students caught indulging in malpractice.

[Citation: [Academic Regulations 2023, Clauses 21.4, 31 & Handbook Page 31]]', 'Exams', 'Student Handbook 2025-26 & Academic Regulations 2023 - Clause 21.4 & Clause 31: Academic Malpractice Penalties', true),
  ('B.E. CSE 8-Semester Credit & Mark Structure (161 Credits / 5400 Marks)', 'B.E. Computer Science and Engineering (Regulations 2023) spans 8 semesters comprising 161 total credits and 5400 total marks. Theory Courses: 31 courses (87 credits, 2900 marks). Practical / PT / Project / Skill Courses: 15 courses (32 credits, 1400 marks). Theory cum Practical Courses (Lab Heavy): 11 courses (42 credits, 1100 marks). Electives include 18 credits of Professional Electives (from Sem 4 to 8) categorized into 6 specialized verticals, plus Open Electives (12-18 credits).

[Citation: [B.E. CSE Curriculum 2023, Page 6]]', 'Curriculum', 'B.E. Computer Science and Engineering Curriculum 2023 - Curriculum Summary: Total Credits (161) and Marks (5400)', true),
  ('First Year B.E. CSE Course Codes & Credits (Semesters 1 and 2)', 'Semester 1 (17 Credits, 550 Marks):
• SHSB1101 - Technical English (3 credits)
• SMTB1101 - Matrices and Calculus (3 credits)
• SCYB1101 - Chemistry (3 credits)
• SEEB1101 - Electrical and Electronics Engineering (3 credits)
• S11BLH11 - Programming in C (Theory+Practical, 4 credits)
• SCYB2101 - Chemistry Lab (1 credit)
• Mandatory Audit Course - I (0 credits)

Semester 2 (18 Credits, 650 Marks):
• SMTB1201 - Advanced Calculus and Statistics (3 credits)
• SPHB1101 - Physics (3 credits)
• SCSB1201 - Data Structures (3 credits)
• S11BLH21 - Programming in Python (Theory+Practical, 4 credits)
• SMEB2102 - Engineering Drawing and Design (2 credits)
• SPHB2101 - Physics Lab (1 credit)
• SCSB2201 - Data Structures Lab (2 credits)
• Mandatory Audit Course - II (0 credits)

[Citation: [B.E. CSE Curriculum 2023, Page 2]]', 'Curriculum', 'B.E. Computer Science and Engineering Curriculum 2023 - Semesters 1 & 2 Course List', true),
  ('Second Year B.E. CSE Course Codes & Credits (Semesters 3 and 4)', 'Semester 3 (24 Credits, 700 Marks):
• SMTB1302 - Discrete Mathematics and Numerical Methods (3 credits)
• SCSB1301 - Computer Architecture and Organization (3 credits)
• SISB4301 - Universal Human Values (3 credits)
• SCSB1303 - Theory of Computation (3 credits)
• S13BLH21 - Digital Logic Circuits (Theory+Practical, 4 credits)
• S13BLH51 - Microprocessor and Microcontroller (Theory+Practical, 4 credits)
• S12BLH31 - Programming in Java (Theory+Practical, 4 credits)

Semester 4 (21 Credits, 800 Marks):
• SMTB1402 - Probability and Statistics (3 credits)
• SCSB1401 - Operating Systems and Unix (3 credits)
• Professional Elective 1 (3 credits)
• Open Elective 1 (3 credits)
• S11BLH41 - Database Management Systems (Theory+Practical, 4 credits)
• SCSB2401 - Operating Systems Lab (2 credits)
• SCSBDPROJ - Design Thinking and Innovations (2 credits)
• SPCB1401 - Skill Enhancement Course - I (1 credit)

[Citation: [B.E. CSE Curriculum 2023, Page 3]]', 'Curriculum', 'B.E. Computer Science and Engineering Curriculum 2023 - Semesters 3 & 4 Course List', true),
  ('Third Year B.E. CSE Course Codes & Credits (Semesters 5 and 6)', 'Semester 5 (24 Credits, 900 Marks):
• SCSB1501 - Data Communication and Computer Networks (3 credits)
• SCSB1502 - Design and Analysis of Algorithms (3 credits)
• Professional Elective 2 (3 credits)
• Open Elective 2 (3 credits)
• S11BLH51 - Software Engineering Design and Development (4 credits)
• S11BPB51 - Augmented and Virtual Reality (3 credits)
• SCSB2501 - Computer Networks Lab (2 credits)
• S11BPT1 - Professional Training I (2 credits)
• Skill Enhancement Course - II (1 credit)

Semester 6 (25 Credits, 900 Marks):
• SCSB1601 - Compiler Design (3 credits)
• SCSB1602 - Network Security (3 credits)
• SCSB1603 - Parallel and Distributed Computing (3 credits)
• Professional Elective 3 (3 credits)
• Open Elective 3 (3 credits)
• S11BLH61 - Machine Learning (4 credits)
• SCSB2601 - Compiler Design Lab (2 credits)
• S11BPT2 / S11BIPROJ - Professional Training II / Interdisciplinary Project (3 credits)
• Skill Enhancement Course - III (1 credit)

[Citation: [B.E. CSE Curriculum 2023, Page 4]]', 'Curriculum', 'B.E. Computer Science and Engineering Curriculum 2023 - Semesters 5 & 6 Course List', true),
  ('Final Year B.E. CSE Course Codes & Credits (Semesters 7 and 8)', 'Semester 7 (19 Credits, 600 Marks):
• Management Elective (3 credits)
• SCSB1701 - Artificial Intelligence (3 credits)
• Professional Elective 4 (3 credits)
• Open Elective 4 (3 credits)
• S12BLH71 - Big Data Analytics (4 credits)
• S11BPROJ1 - Project Phase - I (3 credits)

Semester 8 (13 Credits, 300 Marks):
• Professional Elective 5 (3 credits, NPTEL/SWAYAM eligible)
• Professional Elective 6 (3 credits, NPTEL/SWAYAM eligible)
• S11BPROJ2 - Project Phase - II (Capstone Final Project, 7 credits, 14 hours/week)

[Citation: [B.E. CSE Curriculum 2023, Page 5]]', 'Curriculum', 'B.E. Computer Science and Engineering Curriculum 2023 - Semesters 7 & 8 Course List', true),
  ('CSE Professional Elective Specialization Tracks', 'CSE Professional Electives are organized into 6 industry-tailored verticals:
1. Cyber Security: Information Security Analysis (SCSB3001), Cyber Crimes and Law (SCSB3002), Linux Programming (SCSB3003), Cryptography (SCSB3004), Ethical Hacking (SCSB3007), Blockchain (SCSB1262), Cyber Forensics (SCSB3008).
2. Full Stack Development: Advanced Java (SITB3001), Advanced Internet Technologies (SITB3003), Beginner Full Stack (SITB3005), UI/UX Design (SITB3006), Web Dev Bootcamp (SITB3007), Intro to JS (SITB3008), Backend Tools (SITB3009), Full Stack Framework (SITB3010).
3. Blockchain and IoT: Raspberry Pi & Arduino (SCSB3010), IoT Platforms (SCSB3011), IoT Architecture (SCSB3012), Sensors & Actuators (SCSB3014), Hyperledger & Fabric (SCSB1461).
4. AI & Machine Learning: Python for Data Science (SCSB3018), Neural Networks & Deep Learning (SCSB1451), Social Network Analysis (SCSB3020), AIoT (SCSB3021), NLP (SCSB3024), Predictive Analytics (SCSB1612).
5. Data Science: Mathematical Tools (SCSB3028), R Programming (SCSB3030), Computer Vision (SCSB1712), Exploratory Data Analysis (SCSB1232), Malware Data Science (SCSB3036).
6. General: Comprehensive Linux (SCSB3037), Advanced Computer Networks (SCSB3038), Web Designing (SITB3002), Cloud Computing (SCSB3032).

[Citation: [B.E. CSE Curriculum 2023, Pages 7-9]]', 'Curriculum', 'B.E. Computer Science and Engineering Curriculum 2023 - Professional Elective Verticals 1 to 6', true);

-- Verify row count
SELECT count(*) as total_official_rules FROM knowledge_documents WHERE verified = true;