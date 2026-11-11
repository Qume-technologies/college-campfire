import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BookOpen, Building, CalendarCheck, CalendarDays, ClipboardList, FileBarChart, GraduationCap, KeyRound, LayoutDashboard, Megaphone, BellRing, Settings, ShieldCheck, UserCog, Users, Wallet, FileText, ScrollText } from "lucide-react";
import { AppShell, type NavGroup } from "@/components/app/app-shell";
import { previewSession, useSession } from "@/lib/auth";
import { useCollection } from "@/lib/store";
import type { College } from "@/lib/mock-data";

const groups: NavGroup[] = [
  { label: "Overview", items: [{ to: "/college/dashboard", label: "Dashboard", icon: LayoutDashboard, perm: "dashboard.view" }] },
  { label: "People", items: [
    { to: "/college/students", label: "Students", icon: GraduationCap, perm: "students.view" },
    { to: "/college/teachers", label: "Teachers", icon: Users, perm: "teachers.view" },
    { to: "/college/staff", label: "Staff", icon: UserCog, perm: "staff.view" },
    { to: "/college/departments", label: "Departments", icon: Building, perm: "settings.departments" } ] },
  { label: "Academics", items: [
    { to: "/college/attendance", label: "Attendance", icon: CalendarCheck, perm: "attendance.view" },
    { to: "/college/timetable", label: "Timetable", icon: CalendarDays, perm: "timetable.view" },
    { to: "/college/assignments", label: "Assignments", icon: ClipboardList, perm: "assignments.view" },
    { to: "/college/exams", label: "Exams", icon: BookOpen, perm: "exams.manage" },
    { to: "/college/results", label: "Results", icon: FileBarChart, perm: "results.view" },
    { to: "/college/leave-management", label: "Leave requests", icon: FileText, perm: "leave.view" } ] },
  { label: "Communication", items: [
    { to: "/college/notices", label: "Notices", icon: Megaphone, perm: "notices.view" },
    { to: "/college/notifications", label: "Notifications", icon: BellRing, perm: "notices.create" } ] },
  { label: "Finance", items: [{ to: "/college/fees", label: "Fees", icon: Wallet, perm: "fees.view" }] },
  { label: "Administration", items: [
    { to: "/college/roles", label: "Roles", icon: ShieldCheck, perm: "settings.roles" },
    { to: "/college/permissions", label: "Permissions", icon: KeyRound, perm: "settings.permissions" },
    { to: "/college/audit-logs", label: "Audit logs", icon: ScrollText, perm: "audit.view" },
    { to: "/college/settings", label: "Settings", icon: Settings, perm: "settings.college" } ] },
];

function CollegeLayout() {
  const s = useSession() ?? previewSession("college");
  const college = useCollection<College>("colleges").find((c) => c.id === s.college_id);
  return <AppShell groups={groups} subtitle={college?.name} crumbRoot={college?.code ?? "College"}><Outlet /></AppShell>;
}

export const Route = createFileRoute("/college")({
  ssr: false,
  head: () => ({ meta: [{ title: "College — CampusOS" }, { name: "robots", content: "noindex" }] }),
  component: CollegeLayout,
});
