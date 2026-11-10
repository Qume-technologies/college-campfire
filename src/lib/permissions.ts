export type PermissionModule = { key: string; label: string; permissions: { key: string; label: string }[] };

export const PERMISSION_MODULES: PermissionModule[] = [
  { key: "dashboard", label: "Dashboard", permissions: [
    { key: "dashboard.view", label: "View dashboard" }, { key: "dashboard.analytics", label: "View analytics" } ] },
  { key: "students", label: "Students", permissions: [
    { key: "students.view", label: "View students" }, { key: "students.create", label: "Add students" },
    { key: "students.edit", label: "Edit students" }, { key: "students.delete", label: "Delete students" },
    { key: "students.import", label: "Import students" }, { key: "students.export", label: "Export students" } ] },
  { key: "attendance", label: "Attendance", permissions: [
    { key: "attendance.view", label: "View attendance" }, { key: "attendance.mark", label: "Mark attendance" },
    { key: "attendance.edit", label: "Edit attendance" }, { key: "attendance.reports", label: "View attendance reports" } ] },
  { key: "timetable", label: "Timetable", permissions: [
    { key: "timetable.view", label: "View timetable" }, { key: "timetable.create", label: "Create timetable" },
    { key: "timetable.edit", label: "Edit timetable" }, { key: "timetable.delete", label: "Delete timetable" } ] },
  { key: "assignments", label: "Assignments", permissions: [
    { key: "assignments.view", label: "View assignments" }, { key: "assignments.create", label: "Create assignments" },
    { key: "assignments.edit", label: "Edit assignments" }, { key: "assignments.delete", label: "Delete assignments" } ] },
  { key: "notices", label: "Notices", permissions: [
    { key: "notices.view", label: "View notices" }, { key: "notices.create", label: "Publish notices" },
    { key: "notices.edit", label: "Edit notices" }, { key: "notices.delete", label: "Delete notices" } ] },
  { key: "exams", label: "Exams & Results", permissions: [
    { key: "exams.manage", label: "Manage exams" }, { key: "results.enter", label: "Enter marks" },
    { key: "results.publish", label: "Publish results" }, { key: "results.view", label: "View results" } ] },
  { key: "fees", label: "Fees", permissions: [
    { key: "fees.view", label: "View fees" }, { key: "fees.create", label: "Create fee records" },
    { key: "fees.pay", label: "Record payments" }, { key: "fees.reports", label: "View financial reports" } ] },
  { key: "staff", label: "Staff", permissions: [
    { key: "staff.view", label: "View staff" }, { key: "staff.create", label: "Add staff" },
    { key: "staff.edit", label: "Edit staff" }, { key: "staff.accounts", label: "Manage staff accounts" } ] },
  { key: "teachers", label: "Teachers", permissions: [
    { key: "teachers.view", label: "View teachers" }, { key: "teachers.assign", label: "Manage teacher assignments" } ] },
  { key: "leave", label: "Leave", permissions: [
    { key: "leave.view", label: "View leave applications" }, { key: "leave.review", label: "Approve / reject leave" } ] },
  { key: "settings", label: "Settings", permissions: [
    { key: "settings.college", label: "Manage college settings" }, { key: "settings.departments", label: "Manage departments" },
    { key: "settings.sessions", label: "Manage academic sessions" }, { key: "settings.roles", label: "Manage roles" },
    { key: "settings.permissions", label: "Manage permissions" }, { key: "audit.view", label: "View audit logs" } ] },
];

export const ALL_PERMISSIONS = PERMISSION_MODULES.flatMap((m) => m.permissions.map((p) => p.key));
