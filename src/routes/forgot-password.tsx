import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/app/public-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [
    { title: "Reset password — CampusOS" },
    { name: "description", content: "Preview the CampusOS administrator password recovery flow." },
    { property: "og:title", content: "Reset password — CampusOS" },
    { property: "og:description", content: "Administrator account recovery for CampusOS." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); setSent(true); };

  return (
    <AuthLayout title="Reset your password" description="Enter your work email to preview the account recovery flow.">
      {sent ? <div className="py-4 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-success/10 text-success"><MailCheck className="size-6" /></span><h2 className="mt-4 text-lg font-semibold">Recovery preview complete</h2><p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">No email is sent from this mock-data preview. In production, recovery instructions would go to {email || "your email"}.</p><Button asChild className="mt-6"><Link to="/login">Return to sign in</Link></Button></div> : <form onSubmit={submit} className="space-y-5"><div className="space-y-2"><Label htmlFor="recovery-email">Work email</Label><Input id="recovery-email" type="email" placeholder="you@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} /></div><Button type="submit" className="w-full">Preview recovery email</Button><Button asChild variant="ghost" className="w-full"><Link to="/login"><ArrowLeft />Back to sign in</Link></Button></form>}
    </AuthLayout>
  );
}
