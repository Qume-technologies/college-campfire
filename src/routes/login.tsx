import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Building2, ShieldCheck } from "lucide-react";
import { AuthLayout } from "@/components/app/public-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enterPreview } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Workspace sign in — CampusOS" },
    { name: "description", content: "Open a College or Platform administration workspace." },
    { property: "og:title", content: "Workspace sign in — CampusOS" },
    { property: "og:description", content: "Choose a CampusOS administration workspace." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [kind, setKind] = useState<"college" | "super_admin">("college");
  const [email, setEmail] = useState("admin@bridgewater.edu.np");
  const [password, setPassword] = useState("demo1234");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    enterPreview(kind);
    navigate({ to: kind === "college" ? "/college/dashboard" : "/super-admin/dashboard" });
  };

  const choose = (value: "college" | "super_admin") => {
    setKind(value);
    setEmail(value === "college" ? "admin@bridgewater.edu.np" : "owner@campusos.app");
  };

  return (
    <AuthLayout title="Welcome back" description="Choose a workspace and continue — credentials are not checked in this preview.">
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => choose("college")} className={`rounded-xl border p-4 text-left transition-colors ${kind === "college" ? "border-primary bg-accent" : "hover:bg-muted"}`}>
            <Building2 className="size-5 text-primary" /><span className="mt-3 block text-sm font-medium">College admin</span><span className="mt-1 block text-xs text-muted-foreground">Academic workspace</span>
          </button>
          <button type="button" onClick={() => choose("super_admin")} className={`rounded-xl border p-4 text-left transition-colors ${kind === "super_admin" ? "border-primary bg-accent" : "hover:bg-muted"}`}>
            <ShieldCheck className="size-5 text-primary" /><span className="mt-3 block text-sm font-medium">Super admin</span><span className="mt-1 block text-xs text-muted-foreground">Platform workspace</span>
          </button>
        </div>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="password">Password</Label><Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link></div><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" className="w-full">Open {kind === "college" ? "college" : "platform"} dashboard<ArrowRight /></Button>
        <p className="text-center text-xs text-muted-foreground">New institution? <Link to="/register-college" className="text-primary hover:underline">Register your college</Link></p>
      </form>
    </AuthLayout>
  );
}
