import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, Building2, CheckCircle2, CircleDollarSign, Clock3, GraduationCap, ScrollText, ShieldAlert, UserCog, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, StatCard, StatusBadge } from "@/components/app/ui-bits";
import { Button } from "@/components/ui/button";
import { dataApi, useCollection } from "@/lib/store";
import type { College } from "@/lib/mock-data";

export const Route = createFileRoute("/super-admin/dashboard")({
  head: () => ({ meta: [
    { title: "Platform dashboard — CampusOS" },
    { name: "description", content: "Monitor college applications, subscriptions, platform users and tenant activity." },
    { property: "og:title", content: "Platform dashboard — CampusOS" },
    { property: "og:description", content: "CampusOS multi-college platform administration." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: SuperAdminDashboard,
});

const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

function SuperAdminDashboard() {
  const colleges = useCollection<College>("colleges");
  const users = useCollection<any>("platform_users");
  const plans = useCollection<any>("plans");
  const audit = useCollection<any>("audit");
  const active = colleges.filter((c) => c.status === "Approved");
  const pending = colleges.filter((c) => c.status === "Pending" || c.status === "Under Review");
  const suspended = colleges.filter((c) => c.status === "Suspended");
  const planData = plans.map((plan) => ({ name: plan.name, colleges: colleges.filter((c) => c.plan === plan.name).length }));
  const monthlyRevenue = active.reduce((sum, college) => sum + Number(plans.find((p) => p.name === college.plan)?.price ?? 0), 0);
  const growthData = [...colleges].sort((a, b) => a.created_at.localeCompare(b.created_at)).map((college, index) => ({ name: college.code.split("-")[0], colleges: index + 1 }));
  const updateStatus = (college: College, status: College["status"]) => { dataApi.update("colleges", college.id, { status, subscription: status === "Approved" ? (college.subscription === "Trial" ? "Trial" : "Active") : college.subscription }, "Colleges", `${status} college`); toast.success(`${college.name}: ${status}`); };

  return (
    <div className="space-y-6">
      <PageHeader title="Platform overview" description="Monitor tenants, applications, subscriptions and activity across CampusOS." actions={<Button asChild size="sm"><Link to="/super-admin/colleges">Manage colleges<ArrowRight /></Link></Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Registered colleges" value={colleges.length} hint={`${users.length} platform team accounts`} icon={Building2} />
        <StatCard label="Active colleges" value={active.length} hint="Approved and operational tenants" icon={CheckCircle2} tone="success" />
        <StatCard label="Pending applications" value={pending.length} hint="Awaiting onboarding review" icon={Clock3} tone="warning" />
        <StatCard label="Suspended colleges" value={suspended.length} hint="Access currently disabled" icon={ShieldAlert} tone="destructive" />
        <StatCard label="Students across colleges" value={colleges.reduce((sum, c) => sum + c.students, 0).toLocaleString()} hint="Reported tenant enrollments" icon={GraduationCap} />
        <StatCard label="Teacher accounts" value={colleges.reduce((sum, c) => sum + c.teachers, 0).toLocaleString()} hint="Across all active colleges" icon={Users} />
        <StatCard label="Staff accounts" value={colleges.reduce((sum, c) => sum + c.staff, 0).toLocaleString()} hint="Non-teaching employees" icon={UserCog} />
        <StatCard label="Monthly plan value" value={`Rs ${monthlyRevenue.toLocaleString()}`} hint="Mock recurring plan total" icon={CircleDollarSign} tone="success" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Tenant growth" description="Cumulative registered colleges" className="xl:col-span-2"><div className="h-72 p-4"><ResponsiveContainer width="100%" height="100%"><BarChart data={growthData} margin={{ top: 12, right: 12, left: -24 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} /><Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }} /><Bar dataKey="colleges" fill="var(--chart-1)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel>
        <Panel title="Subscription mix" description="Colleges assigned to each plan"><div className="h-72 p-4"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={planData} dataKey="colleges" nameKey="name" innerRadius={50} outerRadius={82} paddingAngle={3}>{planData.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}</Pie><Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }} /></PieChart></ResponsiveContainer><div className="flex flex-wrap justify-center gap-3">{planData.map((entry, index) => <span key={entry.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className="size-2 rounded-full" style={{ background: colors[index % colors.length] }} />{entry.name} · {entry.colleges}</span>)}</div></div></Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Applications requiring attention" description="Review and update tenant access" className="xl:col-span-2" actions={<Button asChild variant="ghost" size="sm"><Link to="/super-admin/colleges">View all</Link></Button>}><ul className="divide-y">{pending.length ? pending.map((college) => <li key={college.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"><span className="grid size-9 shrink-0 place-items-center rounded-lg text-sm font-semibold text-primary-foreground" style={{ background: college.color }}>{college.name.charAt(0)}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{college.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{college.code} · {college.city} · {college.created_at}</p></div><StatusBadge status={college.status} /><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => updateStatus(college, "Rejected")}>Reject</Button><Button size="sm" onClick={() => updateStatus(college, "Approved")}>Approve</Button></div></li>) : <li className="px-5 py-10 text-center text-sm text-muted-foreground">No pending applications.</li>}</ul></Panel>
        <Panel title="Platform shortcuts" description="Common administration areas"><div className="grid gap-2 p-4">{[{ to: "/super-admin/users", label: "Manage platform users", icon: Users }, { to: "/super-admin/subscriptions", label: "Configure subscription plans", icon: CircleDollarSign }, { to: "/super-admin/roles", label: "Review platform roles", icon: ShieldAlert }, { to: "/super-admin/audit-logs", label: "Inspect platform audit log", icon: ScrollText }].map((item) => <Link key={item.to} to={item.to} className="flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:border-primary/40 hover:bg-accent"><item.icon className="size-4 text-primary" /><span className="flex-1">{item.label}</span><ArrowRight className="size-3.5 text-muted-foreground" /></Link>)}</div></Panel>
      </div>

      <Panel title="Recent platform activity" description="Latest audited actions across the system" actions={<Button asChild variant="ghost" size="sm"><Link to="/super-admin/audit-logs">Full audit log</Link></Button>}><ul className="divide-y">{audit.slice(0, 6).map((item) => <li key={item.id} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="text-sm">{item.action} <span className="text-muted-foreground">· {item.module}</span></p><p className="mt-0.5 truncate text-xs text-muted-foreground">{item.record}</p></div><p className="text-xs text-muted-foreground">{item.user} · {item.created_at}</p></li>)}</ul></Panel>
    </div>
  );
}
