import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Building2, CreditCard, LayoutDashboard, ScrollText, Settings, ShieldCheck, Users } from "lucide-react";
import { AppShell, type NavGroup } from "@/components/app/app-shell";
import { RequireSession } from "@/components/app/guard";

const groups: NavGroup[] = [
  { label: "Overview", items: [{ to: "/super-admin/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Tenants", items: [{ to: "/super-admin/colleges", label: "Colleges", icon: Building2 }, { to: "/super-admin/subscriptions", label: "Subscriptions", icon: CreditCard }] },
  { label: "Platform", items: [{ to: "/super-admin/users", label: "Platform users", icon: Users }, { to: "/super-admin/roles", label: "Platform roles", icon: ShieldCheck }, { to: "/super-admin/audit-logs", label: "Audit logs", icon: ScrollText }, { to: "/super-admin/settings", label: "Settings", icon: Settings }] },
];

export const Route = createFileRoute("/super-admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Super Admin — CampusOS" }, { name: "robots", content: "noindex" }] }),
  component: () => <RequireSession kind="super_admin"><AppShell groups={groups} subtitle="SaaS administration" crumbRoot="Platform"><Outlet /></AppShell></RequireSession>,
});
