import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, type LinkProps } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Bell, ChevronsLeft, ChevronsRight, HelpCircle, LogOut, Menu, Search, Settings, GraduationCap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSession, signOut, useCan } from "@/lib/auth";
import { useCollection } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Initials } from "./ui-bits";

export type NavItem = { to: NonNullable<LinkProps["to"]>; label: string; icon: LucideIcon; perm?: string };
export type NavGroup = { label: string; items: NavItem[] };

export function Brand({ collapsed, dark = true }: { collapsed?: boolean; dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={cn("grid size-8 place-items-center rounded-lg", dark ? "bg-sidebar-primary text-sidebar-primary-foreground" : "bg-primary text-primary-foreground")}><GraduationCap className="size-4.5" /></span>
      {!collapsed && <span className={cn("text-[15px] font-semibold tracking-tight", dark ? "text-sidebar-accent-foreground" : "text-foreground")}>CampusOS</span>}
    </div>
  );
}

function SidebarNav({ groups, collapsed, onNavigate, subtitle }: { groups: NavGroup[]; collapsed?: boolean; onNavigate?: () => void; subtitle?: string }) {
  const { pathname } = useLocation(); const can = useCan(); const session = useSession(); const navigate = useNavigate();
  const [closed, setClosed] = useState<string[]>([]);
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className={cn("flex h-14 items-center border-b border-sidebar-border px-4", collapsed && "justify-center px-0")}><Brand collapsed={collapsed} /></div>
      {subtitle && !collapsed && <div className="px-4 pt-4 text-[11px] font-medium tracking-wider text-sidebar-muted uppercase">{subtitle}</div>}
      <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-3">
        {groups.map((g) => {
          const items = g.items.filter((i) => can(i.perm)); if (!items.length) return null;
          const isClosed = closed.includes(g.label);
          return (
            <div key={g.label}>
              {!collapsed && <button onClick={() => setClosed((c) => isClosed ? c.filter((x) => x !== g.label) : [...c, g.label])} className="flex w-full items-center justify-between px-2 pb-1 text-[11px] font-medium tracking-wider text-sidebar-muted uppercase hover:text-sidebar-foreground">{g.label}<ChevronDown className={cn("size-3 transition-transform", isClosed && "-rotate-90")} /></button>}
              {!isClosed && <ul className="space-y-0.5">{items.map((i) => {
                const active = pathname === i.to || pathname.startsWith(i.to + "/");
                return <li key={i.to}><Link to={i.to} onClick={onNavigate} title={collapsed ? i.label : undefined} className={cn("relative flex h-8 items-center gap-2.5 rounded-md px-2 text-[13px] transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", active && "bg-sidebar-accent font-medium text-sidebar-accent-foreground", collapsed && "justify-center")}>
                  {active && <span className="absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full bg-sidebar-primary" />}
                  <i.icon className={cn("size-4 shrink-0", active ? "text-sidebar-primary" : "text-sidebar-muted")} />{!collapsed && i.label}</Link></li>;
              })}</ul>}
            </div>);
        })}
      </nav>
      <div className="border-t border-sidebar-border p-2">
        <button onClick={() => { signOut(); navigate({ to: "/login" }); }} className={cn("flex w-full items-center gap-2.5 rounded-md p-2 text-left hover:bg-sidebar-accent", collapsed && "justify-center")}>
          <Initials name={session?.name ?? "U"} className="bg-sidebar-accent text-sidebar-accent-foreground" />
          {!collapsed && <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-medium text-sidebar-accent-foreground">{session?.name}</span><span className="block truncate text-[11px] text-sidebar-muted">{session?.title}</span></span>}
          {!collapsed && <LogOut className="size-4 text-sidebar-muted" />}
        </button>
      </div>
    </div>
  );
}

export function AppShell({ groups, children, subtitle, crumbRoot, headerExtra }: { groups: NavGroup[]; children: ReactNode; subtitle?: string; crumbRoot: string; headerExtra?: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false); const [mobile, setMobile] = useState(false);
  const { pathname } = useLocation(); const session = useSession(); const navigate = useNavigate(); const can = useCan();
  const all = groups.flatMap((g) => g.items).filter((i) => can(i.perm));
  const current = [...all].sort((a, b) => b.to.length - a.to.length).find((i) => pathname.startsWith(i.to));
  const [q, setQ] = useState("");
  const notifs = useCollection<any>("audit", session?.college_id ?? undefined).slice(0, 6);
  const results = q ? all.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())) : [];
  return (
    <div className="flex min-h-screen bg-background">
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 transition-[width] duration-200 lg:block", collapsed ? "w-16" : "w-60")}><SidebarNav groups={groups} collapsed={collapsed} subtitle={subtitle} /></aside>
      <Sheet open={mobile} onOpenChange={setMobile}><SheetContent side="left" className="w-64 border-0 p-0"><SheetTitle className="sr-only">Navigation</SheetTitle><SidebarNav groups={groups} subtitle={subtitle} onNavigate={() => setMobile(false)} /></SheetContent></Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur md:px-6">
          <Button variant="ghost" size="icon" className="size-8 lg:hidden" onClick={() => setMobile(true)} aria-label="Open menu"><Menu /></Button>
          <Button variant="ghost" size="icon" className="hidden size-8 lg:inline-flex" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">{collapsed ? <ChevronsRight /> : <ChevronsLeft />}</Button>
          <nav className="hidden items-center gap-1.5 text-sm sm:flex"><span className="text-muted-foreground">{crumbRoot}</span><span className="text-muted-foreground/50">/</span><span className="font-medium">{current?.label ?? "Overview"}</span></nav>
          <div className="relative ml-auto w-full max-w-xs">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to…" className="h-8 bg-muted/50 pl-8" />
            {results.length > 0 && <div className="absolute top-10 right-0 left-0 z-40 rounded-lg border bg-popover p-1 shadow-pop">{results.map((r) => <button key={r.to} onClick={() => { navigate({ to: r.to }); setQ(""); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"><r.icon className="size-4 text-muted-foreground" />{r.label}</button>)}</div>}
          </div>
          {headerExtra}
          <Popover><PopoverTrigger asChild><Button variant="ghost" size="icon" className="relative size-8" aria-label="Notifications"><Bell /><span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" /></Button></PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0"><div className="border-b px-4 py-3 text-sm font-semibold">Recent activity</div>
              <ul className="max-h-80 divide-y overflow-y-auto">{notifs.map((n) => <li key={n.id} className="px-4 py-2.5"><p className="text-sm">{n.action} <span className="text-muted-foreground">· {n.module}</span></p><p className="text-xs text-muted-foreground">{n.user} · {n.created_at}</p></li>)}</ul></PopoverContent></Popover>
          <Popover><PopoverTrigger asChild><Button variant="ghost" size="icon" className="hidden size-8 sm:inline-flex" aria-label="Help"><HelpCircle /></Button></PopoverTrigger>
            <PopoverContent align="end" className="w-72 text-sm"><p className="font-semibold">Need help?</p><p className="mt-1 text-muted-foreground">Email support@campusos.app or use "Jump to…" to find any page quickly.</p></PopoverContent></Popover>
          <DropdownMenu><DropdownMenuTrigger asChild><button aria-label="Account menu"><Initials name={session?.name ?? "U"} /></button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56"><DropdownMenuLabel><p className="text-sm">{session?.name}</p><p className="text-xs font-normal text-muted-foreground">{session?.email}</p></DropdownMenuLabel><DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: session?.kind === "super_admin" ? "/super-admin/settings" : "/college/settings" })}><Settings />Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { signOut(); navigate({ to: "/login" }); }}><LogOut />Sign out</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
        </header>
        <main className="mx-auto w-full max-w-[1400px] flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
