import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, CalendarCheck, KeyRound, Lock, ShieldCheck, Smartphone, Wallet, FileBarChart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/app/public-shell";
import { SEED_PLANS } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "CampusOS — The operating system for modern colleges" },
    { name: "description", content: "Run admissions, attendance, exams, fees and staff for every campus from one secure, multi-tenant platform connected to your student app." },
    { property: "og:title", content: "CampusOS — The operating system for modern colleges" },
    { property: "og:description", content: "Multi-tenant college management connected to your student mobile app." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Landing,
});

const features = [
  { icon: Building2, t: "True multi-tenancy", d: "Every college gets isolated data, branding, roles and its own mobile app feed." },
  { icon: KeyRound, t: "Dynamic permissions", d: "Build any role. Toggle 50+ permissions by module, enforced on the server." },
  { icon: CalendarCheck, t: "Academic operations", d: "Attendance, timetables, assignments, exams and results in one place." },
  { icon: Wallet, t: "Fees & finance", d: "Invoices, payments, pending dues and reports per student." },
  { icon: Smartphone, t: "Live mobile sync", d: "What staff publish here appears instantly in your students' app." },
  { icon: ShieldCheck, t: "Audited by default", d: "Every sensitive change is logged with who, what and when." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <section className="relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-16 text-center md:px-6 md:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground"><Lock className="size-3" />Built for institutions · Tenant-isolated</span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">The operating system for modern colleges</h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">One platform for administrators, staff and teachers — connected to the app your students already use.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link to="/register-college">Register your college<ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/login">Sign in</Link></Button>
          </div>
        </div>
        <div className="relative mx-auto max-w-5xl px-4 pb-20 md:px-6"><Preview /></div>
      </section>
      <section className="border-t bg-card">
        <div className="mx-auto grid max-w-6xl gap-px overflow-hidden px-4 py-20 sm:grid-cols-2 md:px-6 lg:grid-cols-3">
          {features.map((f) => <div key={f.t} className="p-6"><f.icon className="size-5 text-primary" /><h3 className="mt-4 font-semibold">{f.t}</h3><p className="mt-1.5 text-sm text-muted-foreground">{f.d}</p></div>)}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <h2 className="text-center text-3xl font-semibold">Simple plans that grow with you</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-4">{SEED_PLANS.map((p) => (
          <div key={p.id} className={`surface p-6 ${p.name === "Professional" ? "ring-2 ring-primary" : ""}`}>
            <p className="text-sm font-medium">{p.name}</p>
            <p className="mt-3 text-2xl font-semibold">{p.price ? `Rs ${p.price.toLocaleString()}` : p.period === "custom" ? "Custom" : "Free"}<span className="text-sm font-normal text-muted-foreground">{p.price ? ` / ${p.period}` : ""}</span></p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              {[`${p.students > 99999 ? "Unlimited" : p.students.toLocaleString()} students`, `${p.teachers > 99999 ? "Unlimited" : p.teachers} teachers`, `${p.storage} storage`, p.modules].map((x) => <li key={x} className="flex gap-2"><Check className="size-4 text-success" />{x}</li>)}
            </ul>
          </div>))}
        </div>
      </section>
      <footer className="border-t py-8 text-center text-xs text-muted-foreground">© 2026 CampusOS · Students sign in through the mobile app.</footer>
    </div>
  );
}

function Preview() {
  return (
    <div className="surface overflow-hidden shadow-pop">
      <div className="flex">
        <div className="hidden w-44 shrink-0 space-y-1.5 bg-sidebar p-3 sm:block">
          {["Dashboard", "Students", "Attendance", "Timetable", "Exams", "Fees", "Roles"].map((x, i) => <div key={x} className={`rounded-md px-2 py-1.5 text-left text-xs ${i === 0 ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-muted"}`}>{x}</div>)}
        </div>
        <div className="flex-1 p-5 text-left">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[["Students", "1,284"], ["Attendance today", "92.4%"], ["Pending leave", "7"], ["Fees collected", "Rs 4.2M"]].map(([a, b]) => <div key={a} className="rounded-lg border p-3"><p className="text-[11px] text-muted-foreground">{a}</p><p className="mt-1 text-lg font-semibold">{b}</p></div>)}
          </div>
          <div className="mt-3 flex h-36 items-end gap-2 rounded-lg border p-4">
            {[62, 70, 66, 80, 76, 88, 84, 91, 87, 93, 90, 95].map((h, i) => <div key={i} className="flex-1 rounded-t bg-primary/80" style={{ height: `${h}%` }} />)}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><FileBarChart className="size-3.5" />Monthly attendance · synced to mobile app</div>
        </div>
      </div>
    </div>
  );
}
