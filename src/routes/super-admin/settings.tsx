import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, Check, CreditCard, Database, KeyRound, Save, ShieldCheck, Smartphone, Webhook } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, StatusBadge } from "@/components/app/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { audit } from "@/lib/store";

export const Route = createFileRoute("/super-admin/settings")({
  head: () => ({ meta: [
    { title: "Platform settings — CampusOS" },
    { name: "description", content: "Configure CampusOS platform details, integrations, security and notification preferences." },
    { property: "og:title", content: "Platform settings — CampusOS" },
    { property: "og:description", content: "Global settings for CampusOS platform administration." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: PlatformSettings,
});

function PlatformSettings() {
  const [general, setGeneral] = useState({ name: "CampusOS", support: "support@campusos.app", website: "https://campusos.app", message: "Welcome to CampusOS. Your college administration workspace is ready." });
  const [security, setSecurity] = useState({ requireMfa: false, approveNewColleges: true, sessionTimeout: true, auditExports: true });
  const [notifications, setNotifications] = useState({ newApplication: true, failedPayment: true, suspendedTenant: true, dailyDigest: false });
  const save = (area: string) => { audit("Updated platform settings", "Settings", area); toast.success(`${area} saved in this preview`); };

  return (
    <div>
      <PageHeader title="Platform settings" description="Global product defaults, integrations and administration preferences." />
      <Tabs defaultValue="general" className="space-y-6"><TabsList className="h-auto flex-wrap justify-start"><TabsTrigger value="general">General</TabsTrigger><TabsTrigger value="integrations">Integrations</TabsTrigger><TabsTrigger value="security">Security</TabsTrigger><TabsTrigger value="notifications">Notifications</TabsTrigger></TabsList>
        <TabsContent value="general"><div className="grid gap-6 xl:grid-cols-3"><Panel title="Platform identity" description="Customer-facing product details" className="xl:col-span-2"><div className="grid gap-4 p-5 sm:grid-cols-2"><Setting label="Platform name" value={general.name} onChange={(value) => setGeneral((g) => ({ ...g, name: value }))} /><Setting label="Support email" type="email" value={general.support} onChange={(value) => setGeneral((g) => ({ ...g, support: value }))} /><div className="space-y-2 sm:col-span-2"><Label>Website</Label><Input value={general.website} onChange={(e) => setGeneral((g) => ({ ...g, website: e.target.value }))} /></div><div className="space-y-2 sm:col-span-2"><Label>Welcome message</Label><Textarea rows={4} value={general.message} onChange={(e) => setGeneral((g) => ({ ...g, message: e.target.value }))} /></div><div className="sm:col-span-2"><Button onClick={() => save("Platform identity")}><Save />Save general settings</Button></div></div></Panel><Panel title="Workspace shortcuts" description="Manage related platform configuration"><div className="grid gap-2 p-4"><Button asChild variant="outline"><Link to="/super-admin/roles"><KeyRound />Platform roles</Link></Button><Button asChild variant="outline"><Link to="/super-admin/subscriptions"><CreditCard />Subscription plans</Link></Button><Button asChild variant="outline"><Link to="/super-admin/users"><ShieldCheck />Administrator accounts</Link></Button></div></Panel></div></TabsContent>
        <TabsContent value="integrations"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[{ icon: Database, title: "Shared application backend", text: "The current preview uses in-memory mock collections. Connect a shared backend before production use.", status: "Mock data" }, { icon: Smartphone, title: "Flutter student app", text: "College identifiers and compatible record shapes are ready in the frontend preview.", status: "Preview" }, { icon: BellRing, title: "Firebase Cloud Messaging", text: "No push credentials are configured. No notifications are delivered externally.", status: "Not connected" }, { icon: CreditCard, title: "Payment gateway", text: "Plans are configurable, but live billing and payments are not enabled.", status: "Not connected" }, { icon: Webhook, title: "Webhooks", text: "No outbound webhook endpoints are configured in this preview.", status: "Not connected" }, { icon: Check, title: "Email delivery", text: "Password recovery is a visual preview and does not send email.", status: "Not connected" }].map((item) => <Panel key={item.title} title={item.title}><div className="p-5"><div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground"><item.icon className="size-4" /></span><StatusBadge status={item.status} /></div><p className="mt-4 min-h-16 text-sm text-muted-foreground">{item.text}</p></div></Panel>)}</div></TabsContent>
        <TabsContent value="security"><div className="grid gap-6 lg:grid-cols-2"><Panel title="Access policies" description="Preview global administration safeguards"><div className="divide-y px-5"><Preference label="Require MFA for platform users" description="Ask platform staff for a second factor." checked={security.requireMfa} onChange={(value) => setSecurity((s) => ({ ...s, requireMfa: value }))} /><Preference label="Review new college applications" description="Keep new tenants pending until approved." checked={security.approveNewColleges} onChange={(value) => setSecurity((s) => ({ ...s, approveNewColleges: value }))} /><Preference label="Automatic session timeout" description="Expire inactive administration sessions." checked={security.sessionTimeout} onChange={(value) => setSecurity((s) => ({ ...s, sessionTimeout: value }))} /></div></Panel><Panel title="Audit controls" description="Activity retention and exports"><div className="p-5"><Preference label="Audit sensitive exports" description="Record CSV exports in the activity log." checked={security.auditExports} onChange={(value) => setSecurity((s) => ({ ...s, auditExports: value }))} /><div className="mt-5 rounded-lg bg-warning/15 p-4 text-xs text-warning-foreground">Access checks are intentionally disabled for this mock-data preview. These switches do not provide production security.</div><Button className="mt-5" onClick={() => save("Security preferences")}><Save />Save security preferences</Button></div></Panel></div></TabsContent>
        <TabsContent value="notifications"><Panel title="Platform administrator alerts" description="Choose events to include in the preview notification center" className="max-w-3xl"><div className="divide-y px-5"><Preference label="New college application" description="Show newly registered institutions." checked={notifications.newApplication} onChange={(value) => setNotifications((n) => ({ ...n, newApplication: value }))} /><Preference label="Failed subscription payment" description="Show billing issues requiring attention." checked={notifications.failedPayment} onChange={(value) => setNotifications((n) => ({ ...n, failedPayment: value }))} /><Preference label="Tenant suspension" description="Show when a college is suspended." checked={notifications.suspendedTenant} onChange={(value) => setNotifications((n) => ({ ...n, suspendedTenant: value }))} /><Preference label="Daily platform digest" description="Prepare a daily activity summary." checked={notifications.dailyDigest} onChange={(value) => setNotifications((n) => ({ ...n, dailyDigest: value }))} /></div><div className="px-5 pb-5"><Button onClick={() => save("Notification preferences")}><Save />Save notification preferences</Button></div></Panel></TabsContent>
      </Tabs>
    </div>
  );
}

function Setting({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <div className="space-y-2"><Label>{label}</Label><Input type={type} value={value} onChange={(e) => onChange(e.target.value)} /></div>;
}
function Preference({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <div className="flex items-center gap-4 py-4"><div className="min-w-0 flex-1"><Label>{label}</Label><p className="mt-1 text-xs text-muted-foreground">{description}</p></div><Switch checked={checked} onCheckedChange={onChange} /></div>;
}
