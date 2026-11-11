import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, BookOpen, Building, CalendarCheck, CalendarDays, ClipboardList, FileText, GraduationCap, Megaphone, UserCog, Users } from "lucide-react";
import { PageHeader, Panel, StatCard, StatusBadge } from "@/components/app/ui-bits";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/lib/store";
import type { College } from "@/lib/mock-data";

export const Route = createFileRoute("/college/dashboard")({
  head: () => ({ meta: [
    { title: "College dashboard — CampusOS" },
    { name: "description", content: "Live mock overview of students, staff, attendance, academics, fees and college activity." },
    { property: "og:title", content: "College dashboard — CampusOS" },
    { property: "og:description", content: "College operations at a glance on CampusOS." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: CollegeDashboard,
});

const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const quickActions = [
  { label: "Add student", to: "/college/students", icon: GraduationCap }, { label: "Add teacher", to: "/college/teachers", icon: Users },
  { label: "Add staff", to: "/college/staff", icon: UserCog }, { label: "Mark attendance", to: "/college/attendance", icon: CalendarCheck },
  { label: "Create assignment", to: "/college/assignments", icon: ClipboardList }, { label: "Publish notice", to: "/college/notices", icon: Megaphone },
  { label: "Schedule exam", to: "/college/exams", icon: BookOpen }, { label: "Create timetable", to: "/college/timetable", icon: CalendarDays },
] as const;

function CollegeDashboard() {
  const collegeId = "col-bwic";
  const college = useCollection<College>("colleges").find((c) => c.id === collegeId);
  const students = useCollection<any>("students", collegeId);
  const employees = useCollection<any>("employees", collegeId);
  const departments = useCollection<any>("departments", collegeId);
  const attendance = useCollection<any>("attendance", collegeId);
  const leaves = useCollection<any>("leaves", collegeId);
  const exams = useCollection<any>("exams", collegeId);
  const assignments = useCollection<any>("assignments", collegeId);
  const notices = useCollection<any>("notices", collegeId);
  const audit = useCollection<any>("audit", collegeId);
  const sessions = useCollection<any>("sessions", collegeId);
  const results = useCollection<any>("results", collegeId);

  const teachers = employees.filter((e) => e.kind === "teacher");
  const staff = employees.filter((e) => e.kind === "staff");
  const monthMap = new Map<string, { month: string; present: number; total: number }>();
  attendance.forEach((row) => {
    const item = monthMap.get(row.month_name) ?? { month: row.month_name, present: 0, total: 0 };
    item.present += Number(row.present_days); item.total += Number(row.total_days); monthMap.set(row.month_name, item);
  });
  const attendanceTrend = [...monthMap.values()].map((m) => ({ ...m, rate: Math.round((m.present / Math.max(1, m.total)) * 100) }));
  const currentAttendance = attendanceTrend.at(-1)?.rate ?? 0;
  const departmentData = departments.map((department) => ({ name: department.code, fullName: department.name, students: students.filter((s) => s.department === department.name).length }));
  const gradeData = ["A+", "A", "B+", "B", "C+", "C", "F"].map((grade) => ({ grade, students: results.filter((r) => r.grade === grade).length }));
  const activeSession = sessions.find((s) => s.status === "Active");
  const pendingLeave = leaves.filter((l) => l.status === "Pending").length;

  return (
    <div className="space-y-6">
      <PageHeader title={`Good morning, ${college?.name ?? "College"}`} description={`${activeSession?.name ?? "Academic session"} · Here is what is happening across your institution.`} actions={<Button asChild variant="outline" size="sm"><Link to="/college/settings">College settings<ArrowRight /></Link></Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total students" value={students.length} hint={`${students.filter((s) => s.status === "Active").length} active enrollments`} icon={GraduationCap} />
        <StatCard label="Teachers" value={teachers.length} hint={`${departments.length} academic departments`} icon={Users} />
        <StatCard label="Staff accounts" value={staff.length} hint={`${employees.filter((e) => e.account === "Invited").length} invitations pending`} icon={UserCog} />
        <StatCard label="Attendance this month" value={`${currentAttendance}%`} hint="Across recorded monthly attendance" icon={CalendarCheck} tone="success" />
        <StatCard label="Pending leave" value={pendingLeave} hint="Applications awaiting review" icon={FileText} tone={pendingLeave ? "warning" : "muted"} />
        <StatCard label="Upcoming exams" value={exams.filter((e) => e.start_date >= "2026-11-11").length} hint={`${exams.length} examinations scheduled`} icon={BookOpen} />
        <StatCard label="Active assignments" value={assignments.filter((a) => a.due_date >= "2026-11-11").length} hint={`${assignments.length} total assignments`} icon={ClipboardList} />
        <StatCard label="Departments" value={departments.length} hint={activeSession?.name ?? "No active session"} icon={Building} />
      </div>

      <Panel title="Quick actions" description="Jump straight into a common administrative task.">
        <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4 xl:grid-cols-8">{quickActions.map((action) => <Link key={action.to} to={action.to} className="flex flex-col items-center gap-2 rounded-lg border px-2 py-4 text-center text-xs font-medium transition-colors hover:border-primary/40 hover:bg-accent"><action.icon className="size-4 text-primary" />{action.label}</Link>)}</div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Attendance trend" description="Monthly present-day percentage" className="xl:col-span-2"><div className="h-72 p-4"><ResponsiveContainer width="100%" height="100%"><AreaChart data={attendanceTrend} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}><defs><linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.28} /><stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} /><YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} unit="%" /><Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--foreground)" }} /><Area type="monotone" dataKey="rate" name="Attendance" unit="%" stroke="var(--chart-1)" strokeWidth={2} fill="url(#attendanceFill)" /></AreaChart></ResponsiveContainer></div></Panel>
        <Panel title="Students by department" description="Current enrollment distribution"><div className="h-72 p-4"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={departmentData} dataKey="students" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={3}>{departmentData.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}</Pie><Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }} /></PieChart></ResponsiveContainer><div className="flex flex-wrap justify-center gap-x-3 gap-y-1">{departmentData.map((entry, index) => <span key={entry.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className="size-2 rounded-full" style={{ background: chartColors[index % chartColors.length] }} />{entry.name} · {entry.students}</span>)}</div></div></Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Academic performance" description="Grade distribution across entered results" actions={<Button asChild variant="ghost" size="sm"><Link to="/college/results">View results</Link></Button>}><div className="h-64 p-4"><ResponsiveContainer width="100%" height="100%"><BarChart data={gradeData} margin={{ left: -24, right: 8 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="grade" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} /><Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }} /><Bar dataKey="students" fill="var(--chart-2)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel>
        <Panel title="Recent notices" description="Latest announcements for the mobile app" actions={<Button asChild variant="ghost" size="sm"><Link to="/college/notices">All notices</Link></Button>}><ul className="divide-y">{notices.slice(0, 5).map((notice) => <li key={notice.id} className="flex items-start gap-3 px-5 py-3"><span className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"><Megaphone className="size-3.5" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{notice.title}</p><p className="mt-0.5 text-xs text-muted-foreground">{notice.created_at} · {notice.department || "Whole college"}</p></div><StatusBadge status={notice.status} /></li>)}</ul></Panel>
      </div>

      <Panel title="Recent activity" description="Administrative changes in this college" actions={<Button asChild variant="ghost" size="sm"><Link to="/college/audit-logs">Audit log</Link></Button>}><ul className="divide-y">{audit.slice(0, 6).map((item) => <li key={item.id} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="text-sm">{item.action} <span className="text-muted-foreground">· {item.module}</span></p><p className="mt-0.5 truncate text-xs text-muted-foreground">{item.record}</p></div><p className="text-xs text-muted-foreground">{item.user} · {item.created_at}</p></li>)}</ul></Panel>
    </div>
  );
}
