import { ALL_PERMISSIONS } from "./permissions";

export type CollegeStatus = "Pending" | "Under Review" | "Approved" | "Suspended" | "Rejected";
export type College = {
  id: string; code: string; slug: string; name: string; email: string; phone: string; address: string;
  city: string; province: string; country: string; website: string; affiliation: string; type: string;
  description: string; status: CollegeStatus; plan: string; subscription: "Active" | "Trial" | "Past due" | "Cancelled";
  created_at: string; students: number; staff: number; teachers: number; color: string;
};
export type Student = { id: string; college_id: string; student_id: string; full_name: string; department: string; email: string; phone: string; admission_year: number; room_no: string; avatar_url?: string; status: string };
export type Employee = { id: string; college_id: string; kind: "staff" | "teacher"; employee_id: string; full_name: string; email: string; phone: string; department: string; designation: string; joining_date: string; status: string; account: string; roles: string[]; subjects?: string; sections?: string };
export type Role = { id: string; college_id: string | null; name: string; description: string; permissions: string[]; system: boolean };
export type AuditLog = { id: string; college_id: string | null; user: string; action: string; module: string; record: string; created_at: string; meta: string };

const depts = ["Computer Science", "Business Administration", "Civil Engineering", "Hospitality", "Electronics"];
const first = ["Aarav", "Sita", "Rohan", "Priya", "Bikash", "Anjali", "Suman", "Nisha", "Kiran", "Pooja", "Ramesh", "Asha", "Dipesh", "Sarita", "Manish", "Kabita", "Sujan", "Rekha", "Nabin", "Gita", "Prakash", "Laxmi", "Rajan", "Sunita"];
const last = ["Sharma", "Thapa", "Gurung", "Shrestha", "Karki", "Adhikari", "Rai", "Magar", "Poudel", "Basnet"];
const pick = <T,>(a: T[], i: number) => a[i % a.length];
const uid = (p: string, i: number) => `${p}-${String(i).padStart(4, "0")}`;

export const SEED_COLLEGES: College[] = [
  { id: "col-bwic", code: "BWIC-001", slug: "bridgewater", name: "Bridgewater International College", email: "admin@bridgewater.edu.np", phone: "+977 1 4412345", address: "Putalisadak", city: "Kathmandu", province: "Bagmati", country: "Nepal", website: "bridgewater.edu.np", affiliation: "TU-AFF-2011-482", type: "Private", description: "Undergraduate programs in technology and management.", status: "Approved", plan: "Professional", subscription: "Active", created_at: "2025-03-14", students: 48, staff: 6, teachers: 8, color: "oklch(0.52 0.17 258)" },
  { id: "col-hmc", code: "HMC-002", slug: "himalayan", name: "Himalayan Management College", email: "info@himalayan.edu.np", phone: "+977 61 530011", address: "Lakeside", city: "Pokhara", province: "Gandaki", country: "Nepal", website: "himalayan.edu.np", affiliation: "PU-AFF-2015-113", type: "Private", description: "Business and hospitality management.", status: "Approved", plan: "Basic", subscription: "Active", created_at: "2025-05-02", students: 320, staff: 14, teachers: 22, color: "oklch(0.6 0.13 155)" },
  { id: "col-ktm", code: "KEC-003", slug: "kathmandu-eng", name: "Kathmandu Engineering Campus", email: "office@kec.edu.np", phone: "+977 1 5590021", address: "Kalimati", city: "Kathmandu", province: "Bagmati", country: "Nepal", website: "kec.edu.np", affiliation: "TU-AFF-2009-021", type: "Private", description: "Engineering programs.", status: "Under Review", plan: "Free Trial", subscription: "Trial", created_at: "2026-10-28", students: 0, staff: 0, teachers: 0, color: "oklch(0.72 0.15 65)" },
  { id: "col-lmc", code: "LMC-004", slug: "lumbini", name: "Lumbini Model College", email: "contact@lumbini.edu.np", phone: "+977 71 540112", address: "Butwal-11", city: "Butwal", province: "Lumbini", country: "Nepal", website: "lumbini.edu.np", affiliation: "TU-AFF-2018-301", type: "Community", description: "Science and humanities.", status: "Pending", plan: "Free Trial", subscription: "Trial", created_at: "2026-11-06", students: 0, staff: 0, teachers: 0, color: "oklch(0.7 0.12 220)" },
  { id: "col-evc", code: "EVC-005", slug: "everest", name: "Everest Valley College", email: "admin@everest.edu.np", phone: "+977 21 470090", address: "Main Road", city: "Biratnagar", province: "Koshi", country: "Nepal", website: "everest.edu.np", affiliation: "PU-AFF-2014-088", type: "Private", description: "IT and management.", status: "Suspended", plan: "Basic", subscription: "Past due", created_at: "2024-08-19", students: 210, staff: 9, teachers: 15, color: "oklch(0.58 0.2 25)" },
  { id: "col-scc", code: "SCC-006", slug: "sunrise", name: "Sunrise City College", email: "hello@sunrise.edu.np", phone: "+977 56 520033", address: "Bharatpur-10", city: "Chitwan", province: "Bagmati", country: "Nepal", website: "sunrise.edu.np", affiliation: "TU-AFF-2020-155", type: "Private", description: "Applied sciences.", status: "Approved", plan: "Enterprise", subscription: "Active", created_at: "2024-12-01", students: 890, staff: 31, teachers: 54, color: "oklch(0.32 0.06 262)" },
  { id: "col-gvc", code: "GVC-007", slug: "greenvalley", name: "Green Valley Academy", email: "apply@gva.edu.np", phone: "+977 1 6612200", address: "Lalitpur", city: "Lalitpur", province: "Bagmati", country: "Nepal", website: "gva.edu.np", affiliation: "KU-AFF-2022-019", type: "Private", description: "Design and media.", status: "Rejected", plan: "Free Trial", subscription: "Cancelled", created_at: "2026-09-10", students: 0, staff: 0, teachers: 0, color: "oklch(0.6 0.13 240)" },
];

const C = "col-bwic";
export const SEED_STUDENTS: Student[] = Array.from({ length: 48 }, (_, i) => {
  const fn = `${pick(first, i)} ${pick(last, i * 3 + 1)}`;
  const year = 2022 + (i % 4);
  return { id: uid("stu", i), college_id: C, student_id: `BW${year}${String(i + 101).padStart(3, "0")}`, full_name: fn, department: pick(depts, i), email: `${fn.toLowerCase().replace(" ", ".")}@student.bwic.edu.np`, phone: `98${String(41000000 + i * 7919).slice(0, 8)}`, admission_year: year, room_no: `${["A", "B", "C"][i % 3]}-${101 + (i % 5)}`, status: i % 13 === 0 ? "Inactive" : "Active" };
});

const designations = ["Accountant", "Receptionist", "HR Manager", "Librarian", "IT Officer", "Admin Officer"];
const tDes = ["Professor", "Associate Professor", "Lecturer", "Senior Lecturer", "Assistant Professor"];
const subjects = ["Data Structures", "Database Systems", "Financial Accounting", "Structural Analysis", "Digital Electronics", "Marketing", "Operating Systems", "Hotel Operations"];
export const SEED_EMPLOYEES: Employee[] = [
  ...designations.map((d, i) => ({ id: uid("stf", i), college_id: C, kind: "staff" as const, employee_id: `EMP-S${100 + i}`, full_name: `${pick(first, i + 5)} ${pick(last, i + 2)}`, email: `${pick(first, i + 5).toLowerCase()}@bwic.edu.np`, phone: `98510${10000 + i * 311}`, department: "Administration", designation: d, joining_date: `202${i % 5}-0${(i % 9) + 1}-15`, status: i === 4 ? "On leave" : "Active", account: i === 5 ? "Invited" : "Active", roles: [d === "Accountant" ? "Accountant" : d === "HR Manager" ? "HR Manager" : "Receptionist"] })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: uid("tch", i), college_id: C, kind: "teacher" as const, employee_id: `EMP-T${200 + i}`, full_name: `Prof. ${pick(first, i + 11)} ${pick(last, i + 4)}`, email: `${pick(first, i + 11).toLowerCase()}.t@bwic.edu.np`, phone: `98010${20000 + i * 173}`, department: pick(depts, i), designation: pick(tDes, i), joining_date: `201${(i % 9) + 1}-07-01`, status: "Active", account: i === 7 ? "Invited" : "Active", roles: [i === 0 ? "Department Head" : "Teacher"], subjects: `${pick(subjects, i)}, ${pick(subjects, i + 3)}`, sections: `A-10${(i % 5) + 1}, B-10${((i + 2) % 5) + 1}` })),
];

const staffPerms = ["dashboard.view", "students.view", "notices.view", "fees.view"];
const teacherPerms = ["dashboard.view", "students.view", "attendance.view", "attendance.mark", "attendance.edit", "timetable.view", "assignments.view", "assignments.create", "assignments.edit", "assignments.delete", "notices.view", "notices.create", "results.view", "results.enter", "leave.view", "teachers.view"];
export const SEED_ROLES: Role[] = [
  { id: "role-admin", college_id: C, name: "College Administrator", description: "Full access to every college module.", permissions: ALL_PERMISSIONS, system: true },
  { id: "role-principal", college_id: C, name: "Principal", description: "Academic leadership with broad oversight.", permissions: ALL_PERMISSIONS.filter((p) => !p.startsWith("settings.permissions")), system: false },
  { id: "role-vp", college_id: C, name: "Vice Principal", description: "Supports the principal across academics.", permissions: ALL_PERMISSIONS.filter((p) => !p.startsWith("settings") && !p.startsWith("fees")), system: false },
  { id: "role-coord", college_id: C, name: "Academic Coordinator", description: "Timetables, exams and assignments.", permissions: [...teacherPerms, "timetable.create", "timetable.edit", "timetable.delete", "exams.manage", "results.publish"], system: false },
  { id: "role-hod", college_id: C, name: "Department Head", description: "Oversees a department's teachers and results.", permissions: [...teacherPerms, "teachers.assign", "results.publish", "leave.review", "attendance.reports"], system: false },
  { id: "role-acc", college_id: C, name: "Accountant", description: "Fees and financial reports.", permissions: [...staffPerms, "fees.create", "fees.pay", "fees.reports", "dashboard.analytics"], system: false },
  { id: "role-rec", college_id: C, name: "Receptionist", description: "Front desk with read access.", permissions: [...staffPerms, "students.create", "students.edit", "leave.view"], system: false },
  { id: "role-hr", college_id: C, name: "HR Manager", description: "Staff and teacher records.", permissions: [...staffPerms, "staff.view", "staff.create", "staff.edit", "staff.accounts", "teachers.view", "teachers.assign"], system: false },
  { id: "role-teacher", college_id: C, name: "Teacher", description: "Assigned classes, attendance and assignments.", permissions: teacherPerms, system: true },
];

export const SEED_DEPARTMENTS = depts.map((d, i) => ({ id: uid("dep", i), college_id: C, name: d, code: d.split(" ").map((w) => w[0]).join("").toUpperCase(), head: SEED_EMPLOYEES.filter((e) => e.kind === "teacher")[i]?.full_name ?? "", programs: ["BSc CSIT, BIT", "BBA, BBM", "BE Civil", "BHM", "BE Electronics"][i], status: "Active" }));

const months = ["Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026"];
export const SEED_ATTENDANCE = SEED_STUDENTS.slice(0, 24).flatMap((s, i) => months.map((m, j) => {
  const total = 22 + (j % 3); const present = Math.max(10, total - ((i * 7 + j * 3) % 9));
  return { id: `att-${i}-${j}`, college_id: C, student_id: s.student_id, month_name: m, present_days: present, total_days: total };
}));

const times = [["08:00 AM", "09:00 AM"], ["09:00 AM", "10:00 AM"], ["10:15 AM", "11:15 AM"], ["11:15 AM", "12:15 PM"], ["01:00 PM", "02:00 PM"]];
export const SEED_TIMETABLE = Array.from({ length: 30 }, (_, i) => ({ id: uid("tt", i), college_id: C, department: pick(depts, Math.floor(i / 10)), admission_year: 2024 + (i % 2), room_number: `${["A", "B"][i % 2]}-10${(i % 4) + 1}`, day_of_week: 2 + (i % 6), time_start: pick(times, i)[0], time_end: pick(times, i)[1], subject_name: pick(subjects, i), teacher_name: SEED_EMPLOYEES.filter((e) => e.kind === "teacher")[i % 8].full_name }));

export const SEED_ASSIGNMENTS = Array.from({ length: 10 }, (_, i) => ({ id: uid("asg", i), college_id: C, department: i % 4 === 0 ? "" : pick(depts, i), admission_year: 2024 + (i % 2), room_no: i % 3 === 0 ? "" : `A-10${(i % 4) + 1}`, title: ["Linked List Implementation", "ER Diagram Design", "Balance Sheet Analysis", "Beam Load Report", "Logic Gates Lab", "Market Survey", "Process Scheduling", "Menu Costing", "SQL Joins Practice", "Case Study Review"][i], subject: pick(subjects, i), description: "Submit a PDF with your solution and brief explanation.", due_date: `2026-11-${String(12 + i * 2).padStart(2, "0")}` }));

export const SEED_NOTICES = [
  ["Mid-term examination schedule released", "The mid-term schedule for all departments is now available. Check the exams section in the app.", ""],
  ["Library closed on Friday", "The central library will remain closed this Friday for inventory.", ""],
  ["Hackathon registrations open", "CS students can register for the inter-college hackathon until Nov 20.", "Computer Science"],
  ["Industrial visit — Civil", "Batch 2024 will visit the Melamchi project site on Nov 18.", "Civil Engineering"],
  ["Fee deadline reminder", "Second installment fees are due by Nov 30.", ""],
  ["Guest lecture on hospitality trends", "Join us in Hall B on Nov 15 at 2 PM.", "Hospitality"],
].map(([title, content, department], i) => ({ id: uid("not", i), college_id: C, title, content, department, room_no: "", created_at: `2026-11-${String(10 - i).padStart(2, "0")}`, status: i === 0 ? "Scheduled" : "Published" }));

export const SEED_NOTIFICATIONS = Array.from({ length: 8 }, (_, i) => ({ id: uid("ntf", i), college_id: C, student_id: i % 3 === 0 ? SEED_STUDENTS[i].student_id : "", department: i % 3 === 1 ? pick(depts, i) : "", room_no: "", title: ["Attendance updated", "New assignment posted", "Result published", "Fee reminder", "Leave approved", "Timetable changed", "Notice: holiday", "Exam hall assigned"][i], content: "Open the app to see details.", created_at: `2026-11-${String(10 - i).padStart(2, "0")}` }));

export const SEED_FEES = SEED_STUDENTS.slice(0, 30).map((s, i) => ({ id: uid("fee", i), college_id: C, student_id: s.student_id, title: i % 2 ? "Second Installment" : "Tuition — Semester 3", amount: [45000, 38000, 52000, 41000][i % 4], due_date: `2026-11-${String(15 + (i % 15)).padStart(2, "0")}`, is_paid: i % 3 !== 0 }));

export const SEED_EXAMS = [
  { title: "Mid-Term Examination", exam_type: "Mid-Term", start_date: "2026-11-20", end_date: "2026-11-28", department: "" },
  { title: "Programming Practical", exam_type: "Assessment", start_date: "2026-11-14", end_date: "2026-11-14", department: "Computer Science" },
  { title: "Final Semester Exam", exam_type: "Final", start_date: "2027-01-10", end_date: "2027-01-24", department: "" },
  { title: "Accounting Unit Test", exam_type: "Unit Test", start_date: "2026-10-05", end_date: "2026-10-06", department: "Business Administration" },
].map((e, i) => ({ id: uid("exm", i), college_id: C, ...e }));

const grades: [string, number][] = [["A+", 4], ["A", 3.7], ["B+", 3.3], ["B", 3], ["C+", 2.7], ["C", 2.3], ["F", 0]];
export const SEED_RESULTS = SEED_STUDENTS.slice(0, 20).flatMap((s, i) => [0, 1].map((j) => {
  const [grade, gpa] = grades[(i + j * 2) % grades.length];
  return { id: `res-${i}-${j}`, college_id: C, student_id: s.student_id, exam_id: "exm-0003", exam_title: "Unit Test — Semester 3", subject_name: pick(subjects, i + j), gpa, grade, status: gpa === 0 ? "Fail" : gpa >= 3.7 ? "Distinction" : "Pass", published: i % 4 !== 0 };
}));

export const SEED_LEAVES = Array.from({ length: 12 }, (_, i) => ({ id: uid("lv", i), college_id: C, student_id: SEED_STUDENTS[i * 3].student_id, student_name: SEED_STUDENTS[i * 3].full_name, subject: ["Medical leave", "Family function", "Sports tournament", "Personal reasons"][i % 4], description: "Requesting leave for the mentioned dates. Supporting documents will be submitted.", start_date: `2026-11-${String(5 + i).padStart(2, "0")}`, end_date: `2026-11-${String(6 + i).padStart(2, "0")}`, status: ["Pending", "Approved", "Rejected", "Pending"][i % 4], admin_reply: i % 4 === 1 ? "Approved. Get well soon." : i % 4 === 2 ? "Please provide documents." : "" }));

export const SEED_PLANS = [
  { id: "plan-trial", name: "Free Trial", price: 0, period: "30 days", students: 100, staff: 5, teachers: 10, storage: "1 GB", admins: 1, modules: "Core modules" },
  { id: "plan-basic", name: "Basic", price: 4900, period: "month", students: 500, staff: 20, teachers: 40, storage: "10 GB", admins: 3, modules: "Core + Fees" },
  { id: "plan-pro", name: "Professional", price: 12900, period: "month", students: 2500, staff: 80, teachers: 150, storage: "100 GB", admins: 10, modules: "All modules" },
  { id: "plan-ent", name: "Enterprise", price: 0, period: "custom", students: 999999, staff: 999999, teachers: 999999, storage: "Unlimited", admins: 999, modules: "All + SSO + API" },
];

export const SEED_PLATFORM_USERS = [
  { id: "pu-1", full_name: "Platform Owner", email: "owner@campusos.app", role: "Super Admin", status: "Active", last_login: "2026-11-10" },
  { id: "pu-2", full_name: "Support Lead", email: "support@campusos.app", role: "Support", status: "Active", last_login: "2026-11-09" },
  { id: "pu-3", full_name: "Billing Analyst", email: "billing@campusos.app", role: "Billing", status: "Active", last_login: "2026-11-02" },
  { id: "pu-4", full_name: "Onboarding Reviewer", email: "review@campusos.app", role: "Reviewer", status: "Invited", last_login: "—" },
];

export const SEED_AUDIT: AuditLog[] = [
  ["Admin User", "Approved college", "Colleges", "HMC-002", null],
  ["Admin User", "Suspended college", "Colleges", "EVC-005", null],
  ["Sita Thapa", "Marked attendance", "Attendance", "Oct 2026 · CS", C],
  ["Sita Thapa", "Published result", "Results", "Unit Test — Semester 3", C],
  ["Ramesh Karki", "Recorded payment", "Fees", "fee-0004", C],
  ["College Admin", "Updated role permissions", "Roles", "Department Head", C],
  ["College Admin", "Invited staff", "Staff", "EMP-S105", C],
  ["College Admin", "Edited college profile", "Settings", "Branding", C],
].map(([user, action, module, record, college_id], i) => ({ id: uid("aud", i), user: user as string, action: action as string, module: module as string, record: record as string, college_id: college_id as string | null, created_at: `2026-11-${String(10 - i).padStart(2, "0")} 1${i}:2${i}`, meta: "{}" }));

export const SEED_SESSIONS = [
  { id: "ses-1", college_id: C, name: "2026/27 Academic Year", start_date: "2026-08-01", end_date: "2027-07-31", status: "Active" },
  { id: "ses-2", college_id: C, name: "2025/26 Academic Year", start_date: "2025-08-01", end_date: "2026-07-31", status: "Closed" },
];
export const SEED_SUBJECTS = subjects.map((s, i) => ({ id: uid("sub", i), college_id: C, name: s, code: `${["CS", "DB", "AC", "CE", "EL", "MK", "OS", "HM"][i]}${200 + i}`, department: pick(depts, i), credits: 3 }));
export const SEED_ROOMS = ["A-101", "A-102", "A-103", "B-101", "B-102", "Lab-1", "Hall B"].map((r, i) => ({ id: uid("rm", i), college_id: C, name: r, capacity: 40 + (i % 3) * 10, type: r.startsWith("Lab") ? "Lab" : r.startsWith("Hall") ? "Hall" : "Classroom" }));

export const DEPARTMENTS = depts;
