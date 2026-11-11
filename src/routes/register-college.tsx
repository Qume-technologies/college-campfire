import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/app/public-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { dataApi } from "@/lib/store";

export const Route = createFileRoute("/register-college")({
  head: () => ({ meta: [
    { title: "Register your college — CampusOS" },
    { name: "description", content: "Create a college administration application for CampusOS." },
    { property: "og:title", content: "Register your college — CampusOS" },
    { property: "og:description", content: "Bring your college administration and student app together." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: RegisterCollegePage,
});

const initial = { name: "", email: "", phone: "", city: "", country: "Nepal", type: "Private", affiliation: "", address: "", website: "", description: "" };

function RegisterCollegePage() {
  const [form, setForm] = useState(initial);
  const [application, setApplication] = useState<{ name: string; code: string } | null>(null);
  const set = (key: keyof typeof initial, value: string) => setForm((old) => ({ ...old, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const code = `COL-${String(Date.now()).slice(-6)}`;
    const name = form.name.trim() || "Untitled College";
    dataApi.create("colleges", { ...form, name, code, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `college-${code.toLowerCase()}`, status: "Pending", plan: "Free Trial", subscription: "Trial", students: 0, staff: 0, teachers: 0, color: "oklch(0.52 0.17 258)" }, "College registration");
    setApplication({ name, code });
    toast.success("Application added to the preview");
  };

  return (
    <AuthLayout wide title="Register your college" description="Set up your institution profile. You can explore every area with mock data.">
      {application ? <div className="py-6 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-success/10 text-success"><CheckCircle2 className="size-6" /></span><h2 className="mt-4 text-xl font-semibold">Application created</h2><p className="mt-2 text-sm text-muted-foreground">{application.name} is now pending review in the demo college list.</p><div className="mx-auto mt-5 max-w-xs rounded-lg border bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Your application ID</p><p className="mt-1 text-lg font-semibold">{application.code}</p></div><div className="mt-6 flex flex-wrap justify-center gap-2"><Button asChild><Link to="/verify-college">Check status</Link></Button><Button asChild variant="outline"><Link to="/super-admin/colleges">Review in platform admin</Link></Button></div></div> : <form onSubmit={submit} className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="College name" id="name" value={form.name} onChange={(v) => set("name", v)} placeholder="Everest International College" /><Field label="Official email" id="email" type="email" value={form.email} onChange={(v) => set("email", v)} placeholder="admin@college.edu" /><Field label="Phone" id="phone" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+977 1 4000000" /><Field label="City" id="city" value={form.city} onChange={(v) => set("city", v)} placeholder="Kathmandu" /><Field label="Country" id="country" value={form.country} onChange={(v) => set("country", v)} /><div className="space-y-2"><Label>Institution type</Label><Select value={form.type} onValueChange={(v) => set("type", v)}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{["Private", "Community", "Public"].map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select></div><Field label="Affiliation / registration no." id="affiliation" value={form.affiliation} onChange={(v) => set("affiliation", v)} /><Field label="Website" id="website" value={form.website} onChange={(v) => set("website", v)} placeholder="college.edu.np" /><div className="space-y-2 sm:col-span-2"><Label htmlFor="address">Address</Label><Input id="address" value={form.address} onChange={(e) => set("address", e.target.value)} /></div><div className="space-y-2 sm:col-span-2"><Label htmlFor="description">About the institution</Label><Textarea id="description" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Programs, history, and academic focus…" /></div></div><div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">This creates an in-memory demo application only. No documents are uploaded and no real account is provisioned.</div><Button type="submit" className="w-full">Create demo application</Button><p className="text-center text-xs text-muted-foreground">Already registered? <Link to="/login" className="text-primary hover:underline">Open a workspace</Link></p></form>}
    </AuthLayout>
  );
}

function Field({ label, id, value, onChange, placeholder, type = "text" }: { label: string; id: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></div>;
}
