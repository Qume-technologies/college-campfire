import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Search } from "lucide-react";
import { AuthLayout } from "@/components/app/public-shell";
import { StatusBadge } from "@/components/app/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dataApi } from "@/lib/store";
import type { College } from "@/lib/mock-data";

export const Route = createFileRoute("/verify-college")({
  head: () => ({ meta: [
    { title: "Check college application — CampusOS" },
    { name: "description", content: "Check a CampusOS college registration using its application ID or email." },
    { property: "og:title", content: "Check college application — CampusOS" },
    { property: "og:description", content: "Track a college registration on CampusOS." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: VerifyCollegePage,
});

function VerifyCollegePage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<College | null | undefined>(undefined);
  const check = (event?: FormEvent) => {
    event?.preventDefault();
    const needle = query.trim().toLowerCase();
    setResult(dataApi.get<College>("colleges").find((c) => c.code.toLowerCase() === needle || c.email.toLowerCase() === needle || c.slug.toLowerCase() === needle) ?? null);
  };
  const demo = (code: string) => { setQuery(code); const found = dataApi.get<College>("colleges").find((c) => c.code === code); setResult(found ?? null); };

  return (
    <AuthLayout title="Check application status" description="Use your college ID, registration email, or college slug.">
      <form onSubmit={check} className="space-y-5">
        <div className="space-y-2"><Label htmlFor="college-query">College ID or email</Label><div className="flex gap-2"><Input id="college-query" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="BWIC-001" /><Button type="submit" size="icon" aria-label="Check status"><Search /></Button></div></div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span>Try:</span>{["BWIC-001", "KEC-003", "LMC-004"].map((code) => <button type="button" key={code} onClick={() => demo(code)} className="rounded-md bg-muted px-2 py-1 hover:bg-accent">{code}</button>)}</div>
      </form>
      {result !== undefined && <div className="mt-6 border-t pt-6">{result ? <div><div className="flex items-start gap-3"><span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground"><Building2 className="size-5" /></span><div className="min-w-0 flex-1"><p className="font-medium">{result.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{result.code} · {result.city}</p></div><StatusBadge status={result.status} /></div><dl className="mt-5 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-xs text-muted-foreground">Registered</dt><dd className="mt-1">{result.created_at}</dd></div><div><dt className="text-xs text-muted-foreground">Plan</dt><dd className="mt-1">{result.plan}</dd></div></dl></div> : <div className="text-center"><p className="text-sm font-medium">No application found</p><p className="mt-1 text-sm text-muted-foreground">Check the ID or email and try again.</p><Button asChild variant="outline" size="sm" className="mt-4"><Link to="/register-college">Register a college</Link></Button></div>}</div>}
    </AuthLayout>
  );
}
