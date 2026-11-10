import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, icon: Icon, tone = "primary" }: { label: string; value: ReactNode; hint?: string; icon: LucideIcon; tone?: "primary" | "success" | "warning" | "destructive" | "muted" }) {
  const tones = { primary: "bg-accent text-accent-foreground", success: "bg-success/10 text-success", warning: "bg-warning/15 text-warning-foreground", destructive: "bg-destructive/10 text-destructive", muted: "bg-muted text-muted-foreground" };
  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        <span className={cn("grid size-8 place-items-center rounded-lg", tones[tone])}><Icon className="size-4" /></span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const STATUS: Record<string, string> = {
  active: "success", approved: "success", paid: "success", published: "success", pass: "success", distinction: "success", accepted: "success", present: "success",
  pending: "warning", "under review": "warning", invited: "warning", trial: "warning", scheduled: "warning", "on leave": "warning", unpaid: "warning", draft: "warning", late: "warning",
  suspended: "destructive", rejected: "destructive", inactive: "muted", "past due": "destructive", fail: "destructive", cancelled: "muted", closed: "muted", absent: "destructive",
};
export function StatusBadge({ status }: { status: string }) {
  const t = STATUS[status?.toLowerCase()] ?? "muted";
  const cls = { success: "bg-success/10 text-success ring-success/20", warning: "bg-warning/15 text-warning-foreground ring-warning/30", destructive: "bg-destructive/10 text-destructive ring-destructive/20", muted: "bg-muted text-muted-foreground ring-border" }[t];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", cls)}>
      <span className="size-1.5 rounded-full bg-current" />{status}
    </span>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-xl bg-muted text-muted-foreground"><Inbox className="size-5" /></span>
      <p className="mt-4 text-sm font-medium">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Panel({ title, description, actions, children, className }: { title?: string; description?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("surface", className)}>
      {title && (
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div><h3 className="text-sm font-semibold">{title}</h3>{description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}</div>
          {actions}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}

export function Initials({ name, className }: { name: string; className?: string }) {
  const i = name.replace("Prof. ", "").split(" ").map((w) => w[0]).slice(0, 2).join("");
  return <span className={cn("grid size-8 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground", className)}>{i}</span>;
}

export function NoAccess() {
  return <div className="surface"><EmptyState title="You don't have access to this page" description="Ask your college administrator to grant the required permission to your role." /></div>;
}
