// ============================================================================
// SATHYABAMA INSTITUTE OF SCIENCE AND TECHNOLOGY
// Official Verified Regulatory Document Chunks & Knowledge Corpus
// Sources: Central Library Rules, Academic Regulations 2023 (UG & PG),
//          Student Handbook 2025-26, B.E. CSE Curriculum & Syllabus 2023
// ============================================================================

export interface DocumentChunk {
  id: string;
  document: string;
  section: string;
  title: string;
  category: "Library" | "Academics" | "Attendance" | "Exams" | "Discipline" | "Transport" | "Student Support" | "Curriculum" | "Fees & Scholarships";
  content: string;
  citation: string;
  keywords: string[];
}

export const SATHYABAMA_OFFICIAL_DOCUMENTS: DocumentChunk[] = [
  // ==========================================================================
  // SECTION 1: CENTRAL LIBRARY RULES & REGULATIONS
  // ==========================================================================
  {
    id: "lib-book-issue-retention",
    document: "Central Library Rules & Regulations",
    section: "Rule 1: Book Issue & Loan Period",
    title: "Library Book Issue Limit and Loan Period",
    category: "Library",
    content:
      "Four books are issued to a member for 30 Days and they must be returned on or before the last date stamped on the date-slip of each document. All readers are required to maintain strict discipline. Library Staff will not be responsible for readers' personal books.",
    citation: "[Central Library Rules & Regulations, Rule 1]",
    keywords: [
      "library", "books", "issue", "borrow", "30 days", "four books",
      "loan period", "due date", "return date", "date-slip", "how many books",
      "நூலகம்", "நூலக", "புத்தகம்", "புத்தகங்கள்", "கடன்",
      "లైబ్రరీ", "పుస్తకం", "పుస్తకాలు", "రుణం",
      "पुस्तकालय", "किताब", "किताबें", "उधार"
    ],
  },
  {
    id: "lib-overdue-fines",
    document: "Central Library Rules & Regulations",
    section: "Rule 11: Overdue Fines and Renewals",
    title: "Library Overdue Fines & Book Renewal Policy",
    category: "Library",
    content:
      "Any overdue book should be either returned or renewed on or before the due date. An overdue book will be charged a late fine of Re. 1/- per day per book.",
    citation: "[Central Library Rules & Regulations, Rule 11]",
    keywords: [
      "library", "fine", "overdue", "late return", "renew", "renewal",
      "re 1", "one rupee", "penalty", "daily fine", "book fine",
      "அபராதம்", "தாமதம்", "ఫైన్", "జరిమానా", "जुर्माना", "देरी"
    ],
  },
  {
    id: "lib-lost-book-replacement",
    document: "Central Library Rules & Regulations",
    section: "Rule 9: Lost Book Reporting and Replacement Penalty",
    title: "Policy for Lost Books and Replacement Costs",
    category: "Library",
    content:
      "Every reader who loses a book must report to the University Library immediately and will be given one month time for finding and return of the book. In case the member fails to return the book after one month from the date of reporting, a fine of Re. 1/- per day per book will be charged till the book is replaced with a new copy of the same title, edition, and details. In case the borrower cannot replace the book, he/she will be required to pay TWO TIMES (2x) the cost of the book.",
    citation: "[Central Library Rules & Regulations, Rule 9]",
    keywords: [
      "lost book", "missing book", "lost", "replacement", "replace", "two times",
      "2x cost", "double cost", "one month", "library penalty"
    ],
  },
  {
    id: "lib-damage-misconduct-discipline",
    document: "Central Library Rules & Regulations",
    section: "Rules 2, 3, 7, 8: Book Damage, Marking and Tearing Suspension",
    title: "Library Property Damage, Marking and Page Tearing Disciplinary Actions",
    category: "Library",
    content:
      "Members are responsible for any damage caused to books or library property and shall pay the penalty imposed by the Librarian. Underlining, marking, or folding of pages in library books is strictly prohibited. Members caught tearing pages or stealing books will be suspended forthwith from using library facilities and further institutional disciplinary action will be initiated. Readers must check books before borrowing (reporting torn, soiled, or loose binding at the counter) as the borrower is held responsible for condition upon return.",
    citation: "[Central Library Rules & Regulations, Rules 2, 3, 7 & 8]",
    keywords: [
      "tearing pages", "stealing", "damage", "underlining", "marking", "suspension",
      "suspended", "disciplinary action", "condition of book", "soiled"
    ],
  },
  {
    id: "lib-final-year-no-due",
    document: "Central Library Rules & Regulations",
    section: "Rule 10: Final Year No Due Certificate",
    title: "Final Year Students Book Return & No Due Certificate",
    category: "Library",
    content:
      "All final year students must return all books borrowed from the Central Library before the commencement of the final project review and obtain a No Due Certificate from the Library.",
    citation: "[Central Library Rules & Regulations, Rule 10]",
    keywords: [
      "final year", "no due certificate", "no due", "project review", "clearance",
      "library clearance", "return books"
    ],
  },
  {
    id: "lib-dress-code-timings",
    document: "Central Library Rules & Regulations & Student Handbook",
    section: "Rule 12 & Central Library Resources: Timings & Entry Protocol",
    title: "Library Timings, Dress Code, and Digital Access (Knimbus / mLibrary)",
    category: "Library",
    content:
      "Students entering the library must have proper inning (tucking) of shirts and must wear their ID card visibly at all times. Central Library timings are 8:00 AM to 8:00 PM on all working days. The collection encompasses 317,325 books of 53,402 titles, 3,278 CDs/DVDs, 153 print journals, and major e-resources (IEEE, Science Direct, ASME, ACM). 24x7 off-campus remote access is available via Knimbus (https://sist.knimbus.com/) and the mLibrary mobile app.",
    citation: "[Central Library Rules & Regulations, Rule 12 & Handbook Page 16]",
    keywords: [
      "library timings", "dress code", "tucking", "inning", "knimbus", "mlibrary",
      "working hours", "digital library", "e-resources", "ieee", "8 am to 8 pm"
    ],
  },

  // ==========================================================================
  // SECTION 2: ACADEMIC REGULATIONS 2023 (UG - B.E. / B.Tech)
  // ==========================================================================
  {
    id: "ug-duration-programme",
    document: "Academic Regulations 2023",
    section: "Clause 6: Duration of the Programme",
    title: "Programme Duration and Maximum Completion Limits for UG",
    category: "Academics",
    content:
      "Regular Entry: Expected normal duration for B.E./B.Tech is 4 academic years (8 semesters). The maximum permitted period is 6 academic years (12 consecutive semesters, including break of study). Lateral Entry: Minimum duration is 3 academic years (6 semesters); maximum duration is 5 academic years (10 consecutive semesters). Each semester consists of normally 75 working days or 500 hours maximum.",
    citation: "[Academic Regulations 2023, Clause 6]",
    keywords: [
      "duration", "semesters", "8 semesters", "12 semesters", "lateral entry",
      "maximum period", "years", "working days", "75 days", "500 hours"
    ],
  },
  {
    id: "ug-attendance-requirements-ese",
    document: "Academic Regulations 2023",
    section: "Clause 22.2: Attendance Requirements for Semester Completion & ESE",
    title: "Mandatory Attendance Thresholds (80% / 60% Condonation / Crash Course)",
    category: "Attendance",
    content:
      "Every student is expected to maintain 100% attendance. A minimum of 80% attendance in each course is compulsory to appear for End Semester Examinations (ESE). Condonation: Students securing attendance between 60% and 80% may be permitted to write ESE only for unavoidable medical emergencies or institution representation, subject to forwarding by HoD and approval by Dean (Student Affairs). Ineligibility: Students with less than 60% or unapproved shortage are not permitted to write ESE. Students who missed CAE and minimum attendance due to approved emergencies must undergo a 30-hour departmental crash course and maintain 80% attendance in it.",
    citation: "[Academic Regulations 2023, Clause 22.2]",
    keywords: [
      "attendance", "80%", "condonation", "60%", "crash course", "shortage",
      "medical leave", "medical emergency", "not permitted", "ese eligibility",
      "attendance percentage", "minimum attendance"
    ],
  },
  {
    id: "ug-on-duty-regulations",
    document: "Academic Regulations 2023",
    section: "Clause 7: Attendance Regulations — On Duty (OD) Allowances",
    title: "On Duty (OD) Policy and Semester Allowances (Max 6 Days)",
    category: "Attendance",
    content:
      "Students may avail a maximum of six (6) days ON DUTY (OD) per semester for co-curricular and extracurricular activities (symposiums, workshops, seminars, hackathons, sports). Prior written permission from the Head of the Department (HoD) is mandatory. Proof of attendance (certificate of participation/appreciation) must be submitted to the mentor/counselor immediately upon reporting back. OD for internships requires prior approval from HoD, Dean of School, and Dean (Student Affairs).",
    citation: "[Academic Regulations 2023, Clause 7 & Handbook Page 14]",
    keywords: [
      "od", "on duty", "on-duty", "6 days", "od limit", "od days", "permission",
      "hackathon od", "seminar od", "prior permission", "hod approval"
    ],
  },
  {
    id: "ug-examination-assessment-weightage",
    document: "Academic Regulations 2023",
    section: "Clause 20: Examinations and Assessment Weightages",
    title: "50-50 Evaluation Scheme: CAE1, CAE2, Assignments, and ESE",
    category: "Exams",
    content:
      "Continuous evaluation follows a 50-50 percentage weightage system between internal and external examinations. Theory Courses: Two Continuous Assessment Examinations (CAE1 & CAE2) conducted for 50 marks each. The combined score out of 100 is converted to 40 Marks. Course assignments carry 10 Marks, totaling 50 Internal Marks. End Semester Examinations (ESE) are conducted for 100 marks and scaled down to 50 Marks. Total course mark = 50 Internal + 50 External = 100 Marks. Practical Courses: Continuous session-wise assessment carries 30 marks; Model practical exam carries 20 marks; ESE practical carries 50 marks.",
    citation: "[Academic Regulations 2023, Clause 20.1 & 20.2]",
    keywords: [
      "cae", "cae1", "cae2", "internal marks", "ese", "end semester exam",
      "50 marks", "40 marks", "10 marks assignment", "weightage", "evaluation scheme"
    ],
  },
  {
    id: "ug-passing-minimum-requirements",
    document: "Academic Regulations 2023",
    section: "Clause 22.1: Passing Requirements",
    title: "Course Passing Criteria (50% Overall with Minimum 30% in ESE)",
    category: "Exams",
    content:
      "A candidate must secure not less than 50% of the total marks prescribed for the course (continuous assessment + end semester exam combined) to be declared as PASS. Crucially, the student must secure a minimum of 30% marks in the End Semester Examination itself (i.e., at least 15 out of 50 in scaled ESE or 30 out of 100). If a candidate fails, he/she must re-register and reappear for the course examination in subsequent semesters until securing a minimum 'C' grade.",
    citation: "[Academic Regulations 2023, Clause 22.1]",
    keywords: [
      "pass mark", "passing minimum", "50%", "30% in ese", "minimum marks",
      "cut off", "pass criteria", "ra grade", "reappear"
    ],
  },
  {
    id: "ug-arrears-and-internal-marks-retention",
    document: "Academic Regulations 2023",
    section: "Clause 8.2: Arrear Course Registrations",
    title: "Arrear Registrations and Internal Marks Retention",
    category: "Exams",
    content:
      "If a student acquires RA (Reappear) or AAA (Absent) in the End Semester Examination of a course, he/she retains the existing Internal Assessment Marks acquired from Continuous Assessment Examinations. The student simply pays the exam registration fee and rewrites the ESE in subsequent semesters until securing a minimum 'C' grade. There is no restriction on the number of attempts taken to clear the course.",
    citation: "[Academic Regulations 2023, Clause 8.2]",
    keywords: [
      "arrear", "arrears", "internal marks", "retained", "retain internal marks",
      "attempts", "c grade", "reappear", "ra"
    ],
  },
  {
    id: "ug-revaluation-procedure",
    document: "Academic Regulations 2023",
    section: "Clause 21.2: Revaluation Guidelines",
    title: "End Semester Examination Revaluation Rules",
    category: "Exams",
    content:
      "A candidate can apply for revaluation of his/her End Semester Examination answer paper in a theory course immediately after result declaration within TWO (2) WEEKS, on payment of the prescribed fee through the ERP portal. Revaluation is strictly NOT permitted for practical courses and for project work.",
    citation: "[Academic Regulations 2023, Clause 21.2 & Clause 6]",
    keywords: [
      "revaluation", "reval", "paper recheck", "theory revaluation", "two weeks",
      "erp fee", "practical revaluation", "project revaluation"
    ],
  },
  {
    id: "ug-degree-classification-cgpa",
    document: "Academic Regulations 2023",
    section: "Clause 27: Classification of Degree Awarded",
    title: "Degree Honors & Classification: Exemplary, Distinction, First Class, Second Class",
    category: "Academics",
    content:
      "Degree classification criteria for B.E./B.Tech (calculated from 1st semester): 1. First Class with Exemplary: CGPA >= 9.00 passed in first appearance within 8 semesters (6 for lateral). 2. First Class with Distinction: CGPA >= 7.50 and < 9.00 passed in first appearance within 8 semesters (6 for lateral). 3. First Class: CGPA >= 6.00 and < 7.50 passed within 8 semesters (plus authorized break of study semesters). 4. Second Class: CGPA >= 5.00 and < 6.00 passed within maximum 12 semesters (10 for lateral). Minimum CGPA required for degree award is 5.00.",
    citation: "[Academic Regulations 2023, Clause 27 & Clause 24]",
    keywords: [
      "cgpa", "distinction", "exemplary", "first class", "second class",
      "9.0", "7.5", "6.0", "5.0", "degree classification", "honors"
    ],
  },
  {
    id: "ug-grading-scale-table",
    document: "Academic Regulations 2023",
    section: "Clause 24: Range of Marks for Grades",
    title: "10-Point Grading Scale & Grade Points (A++ to RA)",
    category: "Exams",
    content:
      "Academic Regulations 2023 Grading System: 90-100 marks: A++ (Grade Point 10); 80-89 marks: A+ (Grade Point 9); 70-79 marks: B++ (Grade Point 8); 60-69 marks: B+ (Grade Point 7); 50-59 marks: C (Grade Point 6); 00-49 marks: RA (Reappear, Grade Point 0); Absent: AAA (Grade Point 0); Withdrawal: W (Grade Point 0); Authorized Break of Study: ABS (Grade Point 0). Note: RA, AAA, W, and ABS are excluded from GPA and CGPA calculations.",
    citation: "[Academic Regulations 2023, Clause 24]",
    keywords: [
      "grade", "grade points", "grading scale", "a++", "a+", "b++", "b+", "c grade",
      "ra grade", "marks range", "10 point scale"
    ],
  },
  {
    id: "ug-honors-and-minors-degree",
    document: "Academic Regulations 2023",
    section: "Clauses 17 & 18: Minor Degree and Honors Degree Regulations",
    title: "Criteria for Minor Degree and Honors Degree (18 Additional Credits)",
    category: "Academics",
    content:
      "Honors Degree: Students with CGPA > 8.5 at the end of the 4th semester are eligible. Must earn 18 additional credits (4-6 courses) from the department's Honors Electives list (max 6 credits through NPTEL/SWAYAM). Minor Degree: Students with CGPA > 7.5 at the end of the 4th semester can take an 18-credit minor in any other engineering discipline starting from semester 5. Minimum 20 students needed to float a minor track. Degree title will reflect 'B.E. in CSE with Minor in Electrical Engineering'.",
    citation: "[Academic Regulations 2023, Clauses 17 & 18]",
    keywords: [
      "honors degree", "minor degree", "18 credits", "cgpa 8.5", "cgpa 7.5",
      "honors electives", "secondary specialization", "additional credits"
    ],
  },
  {
    id: "ug-experiential-professional-training-exemption",
    document: "Academic Regulations 2023",
    section: "Clause 11: Experiential Learning & Hackathon Exemption",
    title: "Professional Training (PT I & II) & Hackathon Exemption Policy",
    category: "Academics",
    content:
      "Professional Training I (Semester 5, 2 credits) and Training II / Interdisciplinary Project (Semester 6, 3 credits) require minimum 2 weeks industrial/research internship during vacation. Special Exemption: Students who represent the Institution in International Level Hackathons/Buildathons or who win National Level Hackathons/Buildathons are exempted from pursuing Professional Training I (2 credits from Semester 5). Students submit their event project report for grade approval.",
    citation: "[Academic Regulations 2023, Clauses 11.1 & 11.4]",
    keywords: [
      "professional training", "internship", "pt1", "pt2", "hackathon exemption",
      "hackathon", "buildathon", "exemption", "credits", "summer internship"
    ],
  },
  {
    id: "ug-scribe-and-extra-time",
    document: "Academic Regulations 2023",
    section: "Clause 21.3: Scribe and Compensatory Time for Examinations",
    title: "Exam Scribe Facility and 30-Minute Extra Time Guidelines",
    category: "Exams",
    content:
      "Divyangjan students or those with temporary physical disability/injury may apply for a scribe with medical certificate submitted to the CoE office at least 2 days prior to the exam. Scribes cannot be students or degree holders of technical programmes with similar competency. Students with certified reading/writing disability are allowed 30 minutes extra time per exam paper upon submitting proof to CoE at least 3 days in advance.",
    citation: "[Academic Regulations 2023, Clause 21.3]",
    keywords: [
      "scribe", "writer", "extra time", "30 minutes", "disability", "medical certificate",
      "divyangjan", "coe", "exam assistance"
    ],
  },
  {
    id: "ug-course-withdrawal-break-of-study",
    document: "Academic Regulations 2023",
    section: "Clauses 28 & 29: Course Withdrawal and Authorized Break of Study",
    title: "Course Withdrawal Procedures & Authorized Break of Study",
    category: "Academics",
    content:
      "Course Withdrawal: Permitted once during programme for valid medical or family emergencies, provided application is submitted at least 5 days prior to examination commencement with HoD recommendation. Withdrawal does not count as an attempt or affect First Class eligibility. Authorized Break of Study: Granted once for valid reasons (e.g. accident, prolonged illness) for up to one year. Application must be submitted before the semester reopening day through HoD. Break of study semesters do not count against First Class 8-semester limit.",
    citation: "[Academic Regulations 2023, Clauses 28 & 29]",
    keywords: [
      "course withdrawal", "withdraw", "break of study", "gap year", "semester break",
      "temporary discontinue", "medical leave", "5 days"
    ],
  },

  // ==========================================================================
  // SECTION 3: PG COURSE REGULATIONS (Credit System)
  // ==========================================================================
  {
    id: "pg-regulations-summary",
    document: "PG Course Regulations — Credit System",
    section: "Clauses 2, 3, 4, 6: PG Duration, Attendance and Grading",
    title: "Post Graduate (M.E./M.Tech/MCA/MBA) Duration, Attendance & Grades",
    category: "Academics",
    content:
      "PG Programmes: Normal duration is 4 semesters for M.E./M.Tech/M.Sc/MBA/M.Arch (max 8 semesters), 6 semesters for MCA, and 10 semesters for 5-year integrated M.Sc. Attendance: Minimum 90% attendance required to complete semester. Examinations: 50% Internal (CAE) + 50% External (ESE). Grading: S (90-100, GP 10), A+ (80-89, GP 9), A (70-79, GP 8), B (60-69, GP 7), C (50-59, GP 6), F (0-49, GP 0). Degree: Minimum 5.0 CGPA required; Distinction for CGPA >= 7.50 in first appearance; First Class for 6.00 to 7.49.",
    citation: "[PG Course Regulations — Credit System, Clauses 2, 3, 4 & 6]",
    keywords: [
      "pg", "m.tech", "m.e", "mca", "mba", "90% attendance", "pg grading",
      "pg regulations", "post graduate", "s grade"
    ],
  },

  // ==========================================================================
  // SECTION 4: STUDENT HANDBOOK (2025–26) — CAMPUS LIFE, DISCIPLINE, SERVICES
  // ==========================================================================
  {
    id: "handbook-class-and-bus-timings",
    document: "Student Handbook 2025-26",
    section: "Academics & Transport: Daily Timings & Bus Fleet",
    title: "Class Hours (9:00 AM – 3:15 PM) & Day Scholar Bus Timings (8:45 AM / 3:30 PM)",
    category: "Transport",
    content:
      "Academic Class Hours: 9:00 A.M. to 3:15 P.M. for all UG and PG programmes. Day Scholar Bus Schedule: Buses arrive at the campus by 8:45 A.M. and depart from the campus at 3:30 P.M. Sathyabama operates an extensive fleet of over 175 bus routes across Chennai and suburbs. Day scholars must board only at the boarding point designated on their ID card and cannot change buses without authorization.",
    citation: "[Student Handbook 2025-26, Pages 14 & 27]",
    keywords: [
      "class timings", "college timing", "timing", "bus timings", "bus departure",
      "arrival", "8:45 am", "9:00 am", "3:15 pm", "3:30 pm", "transport schedule"
    ],
  },
  {
    id: "handbook-id-card-and-replacement-fee",
    document: "Student Handbook 2025-26",
    section: "Academics: Identity Card Regulations and Duplicate Fees",
    title: "Identity Card Mandatory Wear & Replacement Cost (₹500 / ₹250)",
    category: "Fees & Scholarships",
    content:
      "Wearing the official ID card is mandatory inside the campus, in institutional buses, in dining mess halls, and while representing the University in external events. Loss or Damage: Duplicate identity cards are issued through the Student Help Desk upon submitting an application and paying ₹ 500/- for (Card + Pouch + Lanyard) or ₹ 250/- for (Card only).",
    citation: "[Student Handbook 2025-26, Page 14]",
    keywords: [
      "id card", "lost id card", "duplicate id", "id card fee", "500", "250",
      "lanyard", "pouch", "student help desk", "id replacement", "fine for id"
    ],
  },
  {
    id: "handbook-dress-code-and-decorum",
    document: "Student Handbook 2025-26",
    section: "Do's and Don'ts: Dress Code and General Campus Discipline",
    title: "Campus Dress Code & Strictly Prohibited Attire",
    category: "Discipline",
    content:
      "Dress Code Policy: Boys must wear Formals or Jeans with a decent collared T-shirt, along with formal or sports shoes. Girls must wear Churidar / Salwar Kameez / Jeans and Kurtas. Strictly Prohibited Attire: Skirts, Sleeveless Tops, Torn Jeans, T-Shirts with obscene graphics/language, and Trousers with excessive cargo pockets are strictly prohibited. Placement Sessions: Full formal attire is compulsory for all placement interviews.",
    citation: "[Student Handbook 2025-26, Page 31]",
    keywords: [
      "dress code", "uniform", "clothes", "jeans", "t-shirt", "collar", "churidar",
      "torn jeans", "sleeveless", "skirts", "shoes", "placement dress code"
    ],
  },
  {
    id: "handbook-mobile-phones-prohibited",
    document: "Student Handbook 2025-26",
    section: "Do's and Don'ts: Mobile Phone Restrictions",
    title: "Mobile Phone Ban in Classrooms, Laboratories & Libraries",
    category: "Discipline",
    content:
      "Students are strictly not allowed to use mobile phones inside classrooms, laboratories, Central Library, or examination auditoriums. Disciplinary action will be taken if phones are used during academic instructional sessions.",
    citation: "[Student Handbook 2025-26, Page 31]",
    keywords: [
      "mobile phone", "cell phone", "phone allowed", "phone prohibited", "phone ban",
      "using phone", "electronics"
    ],
  },
  {
    id: "handbook-anti-ragging-policy",
    document: "Student Handbook 2025-26",
    section: "Do's and Don'ts & Student Support: Anti-Ragging Policy",
    title: "Zero-Tolerance Anti-Ragging Regulations (TN Act 1997 & Affidavit)",
    category: "Discipline",
    content:
      "Ragging in any form is a criminal, non-bailable offense strictly prohibited inside and outside the campus under Tamil Nadu Prohibition of Ragging Act No. 7 of 1997. Involvement leads to immediate dismissal and police action. All students and parents must submit an online undertaking at https://sist.sathyabama.ac.in/arc/ within 15 days of commencement, plus a notarized ₹ 100/- non-judicial stamp paper affidavit. Anti-Ragging Cell In-charge: Dr. J. Jabez (arc@sathyabama.ac.in, 9841185953).",
    citation: "[Student Handbook 2025-26, Pages 24, 26, 31]",
    keywords: [
      "ragging", "anti-ragging", "anti ragging", "stamp paper", "affidavit", "100 stamp",
      "jabez", "disciplinary", "ragging act 1997", "complaint"
    ],
  },
  {
    id: "handbook-mess-food-dining",
    document: "Student Handbook 2025-26",
    section: "Assistance & Opportunities: Campus Dining & Food Services",
    title: "Dining Halls, Free Lunch Policy, and Separate Veg/Non-Veg Sections",
    category: "Student Support",
    content:
      "All students are provided with nutritious lunch every working day. Dedicated separate mess halls operate for Boys and Girls, each featuring designated Vegetarian and Non-Vegetarian counters. Wearing the institutional ID card is mandatory to enter the mess halls.",
    citation: "[Student Handbook 2025-26, Page 28]",
    keywords: [
      "food", "mess", "lunch", "canteen", "veg", "non-veg", "dining", "meal",
      "mess hall", "free food"
    ],
  },
  {
    id: "handbook-student-support-contacts",
    document: "Student Handbook 2025-26",
    section: "Student Support Systems: Key Administrative Contacts Directory",
    title: "Emergency & Student Support Directory (Help Desk, Grievance, Counseling, COE)",
    category: "Student Support",
    content:
      "Key Campus Support Contacts:\n• Student Help Desk: studenthelpdesk@sathyabama.ac.in (Certificates, fees, medical transit)\n• Student Grievance Redressal Cell: Dr. S. Barani (student_grievance@sathyabama.ac.in, Ph: 9962933341)\n• Student Counseling & Psychological Support: Dr. R. Parveen Banu (scps@sathyabama.ac.in, Ph: 9364444129)\n• Anti-Ragging Cell: Dr. J. Jabez (arc@sathyabama.ac.in, Ph: 9841185953)\n• Controller of Examinations (COE): Dr. S. Igni Sabasti Prabu (coe@sathyabama.ac.in)\n• Internal Examinations Cell: Dr. V. Sivachidambaranathan (internalexams@sathyabama.ac.in)\n• Placement Cell: Dr. E. John Bruce (placement@sathyabama.ac.in, Ph: 9840227823)\n• Transport In-Charge: Mr. R. Sathish (transport@sathyabama.ac.in, Ph: 9962757181)\n• Higher Studies & Skill Development: Dr. D. Susitra (dean.higherstudies@sathyabama.ac.in, Ph: 9884720170)\n• Startup Cell: Dr. A. Sivasankari (startupcell@sathyabama.ac.in)\n• Minority Scholarships: Mr. M. Balamurugan (scholarship@sathyabama.ac.in)\n• Sports Director: Mr. K. Ravikumar (sports@sathyabama.ac.in)\n• Cultural Coordinator: Dr. J. Refonaa (culturals@sathyabama.ac.in)\n• Dean, School of Computing: Dr. L. Lakshmanan (dean.computing@sathyabama.ac.in)\n• CSE HOD: Dr. L. Lakshmanan (csehod@sathyabama.ac.in)\n• CSE Specialization HODs: Dr. P. Ajitha (csehod_cs@sathyabama.ac.in), Dr. Senduru Srinivasulu (csehod_ai@sathyabama.ac.in)",
    citation: "[Student Handbook 2025-26, Pages 12, 24, 25]",
    keywords: [
      "contact", "phone number", "email", "grievance", "counseling", "help desk",
      "barani", "parveen banu", "jabez", "john bruce", "sathish", "igni sabasti", "lakshmanan",
      "coe email", "hod email", "directory"
    ],
  },
  {
    id: "handbook-scholarships-and-railway-concession",
    document: "Student Handbook 2025-26",
    section: "Assistance: Merit Scholarships, Minority Grants & Train Concession",
    title: "Chancellor's Merit Scholarship, Government Grants & Train Pass Concession",
    category: "Fees & Scholarships",
    content:
      "Merit Scholarships: Awarded to the Top 3 rank holders in every semester through 'Chancellor's Merit Scholarship' based on consistent ESE academic performance, as well as top rankers in the SAEEE entrance test. Minority Scholarships & Travel: Government minority scholarships and railway ticket concession procedures are handled by Scholarship In-Charge Mr. M. Balamurugan (scholarship@sathyabama.ac.in).",
    citation: "[Student Handbook 2025-26, Page 26]",
    keywords: [
      "scholarship", "merit scholarship", "chancellor scholarship", "railway concession",
      "train pass", "minority scholarship", "financial aid", "top rankers", "balamurugan"
    ],
  },
  {
    id: "handbook-academic-malpractice",
    document: "Student Handbook 2025-26 & Academic Regulations 2023",
    section: "Clause 21.4 & Clause 31: Academic Malpractice Penalties",
    title: "Examination Malpractice Inquiry Committee and Punitive Actions",
    category: "Exams",
    content:
      "Academic malpractice in Continuous Assessment Examinations (CAE) or End Semester Examinations (ESE) is strictly prohibited. Students caught in malpractice are summoned before the Examination Review / Unfair Means Committee (comprising the COE, Chief Superintendent, and a senior faculty nominee). Punishments range from cancellation of examination papers to semester suspension or termination of studies. Under university regulations, no supplementary examination is permitted for students caught indulging in malpractice.",
    citation: "[Academic Regulations 2023, Clauses 21.4, 31 & Handbook Page 31]",
    keywords: [
      "malpractice", "cheating", "copying", "unfair means", "malpractice committee",
      "suspended", "termination", "exam punishment", "bit paper", "phone in exam"
    ],
  },

  // ==========================================================================
  // SECTION 5: B.E. COMPUTER SCIENCE & ENGINEERING CURRICULUM 2023
  // ==========================================================================
  {
    id: "cse-curriculum-overview",
    document: "B.E. Computer Science and Engineering Curriculum 2023",
    section: "Curriculum Summary: Total Credits (161) and Marks (5400)",
    title: "B.E. CSE 8-Semester Credit & Mark Structure (161 Credits / 5400 Marks)",
    category: "Curriculum",
    content:
      "B.E. Computer Science and Engineering (Regulations 2023) spans 8 semesters comprising 161 total credits and 5400 total marks. Theory Courses: 31 courses (87 credits, 2900 marks). Practical / PT / Project / Skill Courses: 15 courses (32 credits, 1400 marks). Theory cum Practical Courses (Lab Heavy): 11 courses (42 credits, 1100 marks). Electives include 18 credits of Professional Electives (from Sem 4 to 8) categorized into 6 specialized verticals, plus Open Electives (12-18 credits).",
    citation: "[B.E. CSE Curriculum 2023, Page 6]",
    keywords: [
      "cse credits", "total credits", "161 credits", "5400 marks", "curriculum",
      "b.e cse", "semester credits", "credit distribution", "total marks"
    ],
  },
  {
    id: "cse-semester-1-2-courses",
    document: "B.E. Computer Science and Engineering Curriculum 2023",
    section: "Semesters 1 & 2 Course List",
    title: "First Year B.E. CSE Course Codes & Credits (Semesters 1 and 2)",
    category: "Curriculum",
    content:
      "Semester 1 (17 Credits, 550 Marks):\n• SHSB1101 - Technical English (3 credits)\n• SMTB1101 - Matrices and Calculus (3 credits)\n• SCYB1101 - Chemistry (3 credits)\n• SEEB1101 - Electrical and Electronics Engineering (3 credits)\n• S11BLH11 - Programming in C (Theory+Practical, 4 credits)\n• SCYB2101 - Chemistry Lab (1 credit)\n• Mandatory Audit Course - I (0 credits)\n\nSemester 2 (18 Credits, 650 Marks):\n• SMTB1201 - Advanced Calculus and Statistics (3 credits)\n• SPHB1101 - Physics (3 credits)\n• SCSB1201 - Data Structures (3 credits)\n• S11BLH21 - Programming in Python (Theory+Practical, 4 credits)\n• SMEB2102 - Engineering Drawing and Design (2 credits)\n• SPHB2101 - Physics Lab (1 credit)\n• SCSB2201 - Data Structures Lab (2 credits)\n• Mandatory Audit Course - II (0 credits)",
    citation: "[B.E. CSE Curriculum 2023, Page 2]",
    keywords: [
      "semester 1", "semester 2", "first year", "c programming", "python",
      "data structures", "shsb1101", "smtb1101", "scsb1201", "s11blh11", "s11blh21",
      "first sem courses", "second sem subjects"
    ],
  },
  {
    id: "cse-semester-3-4-courses",
    document: "B.E. Computer Science and Engineering Curriculum 2023",
    section: "Semesters 3 & 4 Course List",
    title: "Second Year B.E. CSE Course Codes & Credits (Semesters 3 and 4)",
    category: "Curriculum",
    content:
      "Semester 3 (24 Credits, 700 Marks):\n• SMTB1302 - Discrete Mathematics and Numerical Methods (3 credits)\n• SCSB1301 - Computer Architecture and Organization (3 credits)\n• SISB4301 - Universal Human Values (3 credits)\n• SCSB1303 - Theory of Computation (3 credits)\n• S13BLH21 - Digital Logic Circuits (Theory+Practical, 4 credits)\n• S13BLH51 - Microprocessor and Microcontroller (Theory+Practical, 4 credits)\n• S12BLH31 - Programming in Java (Theory+Practical, 4 credits)\n\nSemester 4 (21 Credits, 800 Marks):\n• SMTB1402 - Probability and Statistics (3 credits)\n• SCSB1401 - Operating Systems and Unix (3 credits)\n• Professional Elective 1 (3 credits)\n• Open Elective 1 (3 credits)\n• S11BLH41 - Database Management Systems (Theory+Practical, 4 credits)\n• SCSB2401 - Operating Systems Lab (2 credits)\n• SCSBDPROJ - Design Thinking and Innovations (2 credits)\n• SPCB1401 - Skill Enhancement Course - I (1 credit)",
    citation: "[B.E. CSE Curriculum 2023, Page 3]",
    keywords: [
      "semester 3", "semester 4", "second year", "java", "dbms", "os", "operating systems",
      "theory of computation", "microprocessor", "dlc", "discrete math", "scsb1301", "s11blh41"
    ],
  },
  {
    id: "cse-semester-5-6-courses",
    document: "B.E. Computer Science and Engineering Curriculum 2023",
    section: "Semesters 5 & 6 Course List",
    title: "Third Year B.E. CSE Course Codes & Credits (Semesters 5 and 6)",
    category: "Curriculum",
    content:
      "Semester 5 (24 Credits, 900 Marks):\n• SCSB1501 - Data Communication and Computer Networks (3 credits)\n• SCSB1502 - Design and Analysis of Algorithms (3 credits)\n• Professional Elective 2 (3 credits)\n• Open Elective 2 (3 credits)\n• S11BLH51 - Software Engineering Design and Development (4 credits)\n• S11BPB51 - Augmented and Virtual Reality (3 credits)\n• SCSB2501 - Computer Networks Lab (2 credits)\n• S11BPT1 - Professional Training I (2 credits)\n• Skill Enhancement Course - II (1 credit)\n\nSemester 6 (25 Credits, 900 Marks):\n• SCSB1601 - Compiler Design (3 credits)\n• SCSB1602 - Network Security (3 credits)\n• SCSB1603 - Parallel and Distributed Computing (3 credits)\n• Professional Elective 3 (3 credits)\n• Open Elective 3 (3 credits)\n• S11BLH61 - Machine Learning (4 credits)\n• SCSB2601 - Compiler Design Lab (2 credits)\n• S11BPT2 / S11BIPROJ - Professional Training II / Interdisciplinary Project (3 credits)\n• Skill Enhancement Course - III (1 credit)",
    citation: "[B.E. CSE Curriculum 2023, Page 4]",
    keywords: [
      "semester 5", "semester 6", "third year", "computer networks", "daa", "algorithms",
      "compiler design", "network security", "machine learning", "scsb1501", "scsb1502", "scsb1601"
    ],
  },
  {
    id: "cse-semester-7-8-courses",
    document: "B.E. Computer Science and Engineering Curriculum 2023",
    section: "Semesters 7 & 8 Course List",
    title: "Final Year B.E. CSE Course Codes & Credits (Semesters 7 and 8)",
    category: "Curriculum",
    content:
      "Semester 7 (19 Credits, 600 Marks):\n• Management Elective (3 credits)\n• SCSB1701 - Artificial Intelligence (3 credits)\n• Professional Elective 4 (3 credits)\n• Open Elective 4 (3 credits)\n• S12BLH71 - Big Data Analytics (4 credits)\n• S11BPROJ1 - Project Phase - I (3 credits)\n\nSemester 8 (13 Credits, 300 Marks):\n• Professional Elective 5 (3 credits, NPTEL/SWAYAM eligible)\n• Professional Elective 6 (3 credits, NPTEL/SWAYAM eligible)\n• S11BPROJ2 - Project Phase - II (Capstone Final Project, 7 credits, 14 hours/week)",
    citation: "[B.E. CSE Curriculum 2023, Page 5]",
    keywords: [
      "semester 7", "semester 8", "final year", "ai", "artificial intelligence",
      "big data", "project phase 1", "project phase 2", "capstone", "scsb1701", "s12blh71"
    ],
  },
  {
    id: "cse-professional-elective-verticals",
    document: "B.E. Computer Science and Engineering Curriculum 2023",
    section: "Professional Elective Verticals 1 to 6",
    title: "CSE Professional Elective Specialization Tracks",
    category: "Curriculum",
    content:
      "CSE Professional Electives are organized into 6 industry-tailored verticals:\n1. Cyber Security: Information Security Analysis (SCSB3001), Cyber Crimes and Law (SCSB3002), Linux Programming (SCSB3003), Cryptography (SCSB3004), Ethical Hacking (SCSB3007), Blockchain (SCSB1262), Cyber Forensics (SCSB3008).\n2. Full Stack Development: Advanced Java (SITB3001), Advanced Internet Technologies (SITB3003), Beginner Full Stack (SITB3005), UI/UX Design (SITB3006), Web Dev Bootcamp (SITB3007), Intro to JS (SITB3008), Backend Tools (SITB3009), Full Stack Framework (SITB3010).\n3. Blockchain and IoT: Raspberry Pi & Arduino (SCSB3010), IoT Platforms (SCSB3011), IoT Architecture (SCSB3012), Sensors & Actuators (SCSB3014), Hyperledger & Fabric (SCSB1461).\n4. AI & Machine Learning: Python for Data Science (SCSB3018), Neural Networks & Deep Learning (SCSB1451), Social Network Analysis (SCSB3020), AIoT (SCSB3021), NLP (SCSB3024), Predictive Analytics (SCSB1612).\n5. Data Science: Mathematical Tools (SCSB3028), R Programming (SCSB3030), Computer Vision (SCSB1712), Exploratory Data Analysis (SCSB1232), Malware Data Science (SCSB3036).\n6. General: Comprehensive Linux (SCSB3037), Advanced Computer Networks (SCSB3038), Web Designing (SITB3002), Cloud Computing (SCSB3032).",
    citation: "[B.E. CSE Curriculum 2023, Pages 7-9]",
    keywords: [
      "electives", "verticals", "cyber security", "full stack", "ai", "machine learning",
      "data science", "iot", "blockchain", "cloud computing", "specialization"
    ],
  },
];
